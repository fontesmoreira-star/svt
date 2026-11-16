/* ===== Moteur de l'activité : navigation, questions, correction, bilan ===== */
const LV = { easy: ["🟢 Facile", "easy", "🟢"], mid: ["🟡 Moyen", "mid", "🟡"], hard: ["🔴 Défi", "hard", "🔴"] };
const COMPS = { lire: "Extraire et exploiter des informations", calc: "Calculer, estimer un ordre de grandeur", mod: "Expérimenter, exploiter une modélisation", rais: "Raisonner, argumenter", redac: "Rédiger une réponse argumentée (auto-évaluation)" };
const SIGN = "Mr Moreira, Vauban Luxembourg";
const ITEMS = {};
GROUPS.forEach(g => g.items.forEach((it, i) => { ITEMS[it.id] = { it, g, i, label: `${g.n ? "Atelier " + g.n : g.title} · étape ${i + 1} · ${it.title}` }; }));

/* ---------- état ---------- */
const DEF = { fs: 21, theme: null, proj: false, it: {}, view: "accueil", step: {}, pre: {} };
let S = Store.load(DEF);
["it", "step", "pre"].forEach(k => { if (!S[k] || typeof S[k] !== "object") S[k] = {}; });
const save = () => Store.save(S);
const scorable = p => p.t !== "text";
function itState(id) { if (!S.it[id]) S.it[id] = { v: {}, hints: 0, crit: {} }; return S.it[id]; }
const itemMax = it => it.parts.filter(scorable).length;
const corrShown = st => !!(st && st.first && (st.lastOk || (st.tries || 0) >= 2));
function status(it) { const st = S.it[it.id]; if (!st || !st.first) return ["", "à faire"]; if (!itemMax(it)) return ["✓", "rédigé"]; return st.first.pts === st.first.max ? ["✓", "réussi au premier essai"] : ["◐", st.first.pts + "/" + st.first.max + " au premier essai"]; }

/* ---------- vérification ---------- */
const stripUnit = s => String(s === undefined || s === null ? "" : s).replace(/[\s  ]*[a-zA-Zéèµ°%²³₂][\sa-zA-Zéèµ°%²³₂.\/  ]*$/, "");
function checkPart(p, val) {
  if (p.t === "word") {
    const r = fuzzy(val, p.ans); if (r.empty) return { ok: false, empty: true, msg: "Réponse manquante." };
    if (r.ok) return { ok: true, msg: r.typo ? `✓ Juste. Orthographe exacte : « ${p.ans[0]} ».` : "✓ Juste." };
    for (const [alts, m] of (p.err || [])) if (fuzzy(val, alts).ok) return { ok: false, msg: "✗ Faux. " + m };
    return { ok: false, msg: "✗ Pas encore : relis le document, puis utilise un coup de pouce si besoin." };
  }
  if (p.t === "num") {
    if (val === undefined || String(val).trim() === "") return { ok: false, empty: true, msg: "Réponse manquante." };
    let v = parseNum(val); if (!Number.isFinite(v)) v = parseNum(stripUnit(val));
    if (!Number.isFinite(v)) return { ok: false, msg: "✗ Écris un nombre (la virgule est acceptée)." };
    if (near(v, p.ans, p.tol || 0, 0)) return { ok: true, msg: "✓ Juste." };
    for (const [f, m] of (p.err || [])) if (f(v)) return { ok: false, msg: "✗ Faux. " + m };
    return { ok: false, msg: "✗ Pas encore : vérifie ta lecture ou ton calcul." };
  }
  if (p.t === "choice") { if (val === undefined || val === null) return { ok: false, empty: true, msg: "Choisis une réponse." }; return val === p.a ? { ok: true, msg: "✓ Juste." } : { ok: false, msg: "✗ Faux. " + ((p.no && p.no[val]) || "Ce n'est pas la bonne proposition.") }; }
  if (p.t === "multi") { const s = (val || []).slice().sort().join(","); if (!s) return { ok: false, empty: true, msg: "Choisis au moins une réponse." }; return s === p.a.slice().sort().join(",") ? { ok: true, msg: "✓ Juste." } : { ok: false, msg: "✗ Pas encore : il y a " + p.a.length + " bonnes réponses." }; }
  if (p.t === "rows") { const v = val || {}; if (p.rows.some((r, i) => v[i] === undefined)) return { ok: false, empty: true, msg: "Réponds à chaque ligne." }; const bad = p.rows.filter((r, i) => v[i] !== r.a).length; return bad ? { ok: false, msg: `✗ ${bad} ligne(s) à corriger (marquées ✗).` } : { ok: true, msg: "✓ Toutes les lignes sont justes." }; }
  if (p.t === "loop") { const v = val || []; if (v.length < p.items.length) return { ok: false, empty: true, msg: "Place toutes les étiquettes." }; const bad = v.filter((x, i) => x !== i).length; return bad ? { ok: false, msg: `✗ ${bad} étiquette(s) mal placée(s) (marquées ✗).` } : { ok: true, msg: "✓ Boucle juste." }; }
  return { ok: true, msg: "" };
}
function order(key, n) { const base = Array.from({ length: n }, (_, i) => i); let h = 7; for (const c of key) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff; let r = shuffle(base, h); if (r.every((x, i) => x === i)) r = r.reverse(); return r; }

/* ---------- documents ---------- */
function docHTML(d) {
  return `<figure class="doc" style="margin:0"><figcaption class="dh"><span>${d.title}</span>${d.sim ? `<span class="sim">⚠ ${d.sim}</span>` : ""}</figcaption><div class="db">${d.html || ""}${d.fig ? `<div class="figbox" data-fig="${d.fig}"></div>` : ""}${d.cap ? `<p class="cap">${d.cap}</p>` : ""}</div></figure>`;
}
function mountFigs(root) { $$("[data-fig]", root).forEach(el => { if (el.dataset.mounted) return; el.dataset.mounted = "1"; FIGS[el.dataset.fig](el); }); }

/* ---------- navigation ---------- */
const VIEWS = ["accueil", ...GROUPS.map(g => g.id), "bilan"];
const grp = id => GROUPS.find(g => g.id === id);
function gScore(g) { let pts = 0, max = 0, done = 0; g.items.forEach(it => { const st = S.it[it.id]; max += itemMax(it); if (st && st.first) { pts += st.first.pts; done++; } }); return { pts, max, done, n: g.items.length }; }
function tabs() {
  $("#tabs").innerHTML = VIEWS.map(v => {
    if (v === "accueil") return `<button class="tab" type="button" data-v="accueil">Accueil</button>`;
    if (v === "bilan") return `<button class="tab" type="button" data-v="bilan">Bilan</button>`;
    const g = grp(v), sc = gScore(g);
    return `<button class="tab" type="button" data-v="${v}">${g.icon} ${g.n ? "Atelier " + g.n : g.title}<span class="dot" aria-label="${sc.done} étape(s) faite(s) sur ${sc.n}">${sc.done}/${sc.n}</span></button>`;
  }).join("");
  $$("#tabs .tab").forEach(b => { b.onclick = () => go(b.dataset.v); if (b.dataset.v === S.view) b.setAttribute("aria-current", "page"); });
}
function go(v, noScroll) {
  if (!VIEWS.includes(v)) v = "accueil";
  S.view = v; save(); tabs();
  if (location.hash !== "#" + v) { try { history.replaceState(null, "", "#" + v); } catch (e) {} }
  const m = $("#main");
  if (v === "accueil") renderHome(m); else if (v === "bilan") renderBilan(m); else renderGroup(m, grp(v));
  if (!noScroll) window.scrollTo(0, 0);
  const cur = $("#tabs [aria-current]"); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest", inline: "center" });
}

/* ---------- accueil ---------- */
function preRows(readonly) {
  return `<div class="rows">${PRE.rows.map((row, i) => { const cur = S.pre[i]; return `<div class="rowq"><span class="rt">${row.txt}</span><div class="seg" role="group" aria-label="${esc(row.txt)}">${PRE.choices.map((c, j) => `<button type="button" aria-pressed="${cur === j}" data-pi="${i}" data-pj="${j}" ${readonly ? "disabled" : ""}>${c}</button>`).join("")}</div></div>`; }).join("")}</div>`;
}
function renderHome(m) {
  m.innerHTML = `<section class="view">
    <div class="panel"><p class="kicker">Chapitre 2 · Trois ateliers</p><h2 class="sec-title">Évolution de la température et rétroactions</h2>
      <p>${nb("Les modélisations du climat indiquent fréquemment des fourchettes de variations possibles. Ces incertitudes sont liées à la complexité du système climatique, avec des effets amplificateurs ou stabilisateurs.")}</p>
      <div class="box info"><p class="lab">ℹ Problématique</p><p><b>${nb(PROBLEM)}</b></p></div>
      <p class="lead">Ce que j'ai déjà vu : gaz à effet de serre · albédo · indices de variations climatiques · photosynthèse.</p></div>
    <div class="panel"><p class="kicker">Avant de commencer · non noté</p><h3>Ton intuition de départ</h3><p class="lead">${nb("D'après toi, quel est l'effet de chaque phénomène sur le réchauffement climatique ? Tu retrouveras tes réponses à la mise en commun.")}</p>${preRows(false)}</div>
    <div><p class="kicker">Trois ateliers, puis la mise en commun</p><div class="grid-cards" style="margin-top:.5rem">${GROUPS.map(g => { const sc = gScore(g); return `<button class="card-btn ${g.n ? "" : "feature"}" type="button" data-go="${g.id}"><span class="kicker">${g.n ? "Atelier " + g.n : "Après les ateliers"}</span><span class="t">${g.icon} ${g.title}</span><span class="m">${g.sub}</span><span class="row" style="gap:.3rem"><span class="chip ${sc.done === sc.n ? "ok" : sc.done ? "mid" : ""}">${sc.done}/${sc.n} étapes</span>${g.items.map(it => `<span aria-hidden="true">${LV[it.lvl][2]}</span>`).join("")}</span></button>`; }).join("")}</div></div>
    <div class="panel"><p class="kicker">Mode d'emploi</p>
      <ul class="ul">
        <li>Fais les <b>trois ateliers</b>, dans l'ordre indiqué par ton professeur, puis la <b>mise en commun</b>.</li>
        <li>Les étapes vont du <span class="lv easy">🟢 Facile</span> au <span class="lv hard">🔴 Défi</span>. Touche <b>Vérifier</b> : la correction est immédiate. Seul le premier essai compte, puis tu corriges librement.</li>
        <li>Bloqué ? Trois <b>coups de pouce</b> s'affichent un par un. Le corrigé apparaît quand tout est juste, ou après ton deuxième essai.</li>
        <li>Certaines simulations se débloquent quand tu as trouvé la réponse : elles servent à vérifier et à aller plus loin.</li>
        <li>À la fin, l'onglet <b>Bilan</b> te permet de télécharger ou de montrer ton résultat.</li>
      </ul></div>
  </section>`;
  $$("[data-go]", m).forEach(b => b.onclick = () => go(b.dataset.go));
  $$("[data-pi]", m).forEach(b => b.onclick = () => { S.pre[+b.dataset.pi] = +b.dataset.pj; save(); $$(`[data-pi="${b.dataset.pi}"]`, m).forEach(x => x.setAttribute("aria-pressed", x === b ? "true" : "false")); });
}

/* ---------- vue d'un atelier ---------- */
function indDone(ind) { return ind.items.every(id => { const st = S.it[id]; return st && st.first && (st.lastOk || !itemMax(ITEMS[id].it)); }); }
function renderGroup(m, g) {
  const k = Math.max(0, Math.min(g.items.length - 1, S.step[g.id] || 0)), it = g.items[k], gi = GROUPS.indexOf(g);
  m.innerHTML = `<section class="view"><div><p class="kicker">${g.n ? "Atelier " + g.n : "Après les ateliers"}</p><h2 class="sec-title">${g.icon} ${g.title}</h2><p class="lead">${g.sub}</p></div>
    ${g.inds.length ? `<div class="panel"><p class="kicker">Indicateurs de réussite</p><ul class="inds">${g.inds.map((d, i) => { const ok = indDone(d); return `<li class="${ok ? "done" : ""}"><span class="bx" aria-hidden="true">${ok ? "✓" : ""}</span><span><b>${i + 1}.</b> ${d.t} <span class="st">${ok ? "✓ fait" : "à faire · étape" + (d.items.length > 1 ? "s " : " ") + d.items.map(id => ITEMS[id].i + 1).join(" et ")}</span></span></li>`; }).join("")}</ul></div>` : ""}
    <div class="stepper" role="group" aria-label="Étapes">${g.items.map((x, i) => { const s = status(x); return `<button type="button" data-s="${i}" ${i === k ? 'aria-current="step"' : ""} aria-label="Étape ${i + 1}, ${LV[x.lvl][0].split(" ")[1]}, ${s[1]}">${i + 1} <span aria-hidden="true">${LV[x.lvl][2]}</span>${s[0] ? `<span aria-hidden="true">${s[0]}</span>` : ""}</button>`; }).join("")}</div>
    <article class="panel itemroot" id="item"></article>
    <div class="row" id="navx"></div></section>`;
  $$(".stepper button", m).forEach(b => b.onclick = () => { S.step[g.id] = +b.dataset.s; save(); renderGroup(m, g); window.scrollTo(0, 0); });
  renderItem(it, $("#item"));
  const nx = $("#navx"), nextG = GROUPS[gi + 1];
  nx.innerHTML = `${k > 0 ? `<button class="btn ghost" type="button" data-p>← Étape ${k}</button>` : ""}${k < g.items.length - 1 ? `<button class="btn" type="button" data-n>Étape ${k + 2} →</button>` : nextG ? `<button class="btn" type="button" data-c>${nextG.icon} ${nextG.n ? "Atelier " + nextG.n : nextG.title} →</button>` : `<button class="btn" type="button" data-b>Voir mon bilan →</button>`}`;
  const st = d => { S.step[g.id] = k + d; save(); renderGroup(m, g); window.scrollTo(0, 0); };
  const a = $("[data-p]", nx); if (a) a.onclick = () => st(-1);
  const b = $("[data-n]", nx); if (b) b.onclick = () => st(1);
  const c = $("[data-c]", nx); if (c) c.onclick = () => go(nextG.id);
  const d = $("[data-b]", nx); if (d) d.onclick = () => go("bilan");
}
function refreshChrome(it) {
  tabs(); const g = ITEMS[it.id].g;
  $$(".stepper button").forEach((b, i) => { const x = g.items[i], s = status(x); b.innerHTML = `${i + 1} <span aria-hidden="true">${LV[x.lvl][2]}</span>${s[0] ? `<span aria-hidden="true">${s[0]}</span>` : ""}`; b.setAttribute("aria-label", `Étape ${i + 1}, ${LV[x.lvl][0].split(" ")[1]}, ${s[1]}`); });
  $$(".inds li").forEach((li, i) => { const d = g.inds[i], ok = indDone(d); li.classList.toggle("done", ok); $(".bx", li).textContent = ok ? "✓" : ""; $(".st", li).textContent = ok ? "✓ fait" : "à faire · étape" + (d.items.length > 1 ? "s " : " ") + d.items.map(id => ITEMS[id].i + 1).join(" et "); });
}

/* ---------- une étape ---------- */
function renderItem(it, root) {
  const id = it.id, st = itState(id), lvl = LV[it.lvl], locked = it.pre && st.pre === undefined;
  root.innerHTML = `<p class="lv ${lvl[1]}">${lvl[0]}</p><h3 class="item-title">${it.title}</h3>${it.intro ? `<p>${it.intro}</p>` : ""}${(it.docs || []).map(docHTML).join("")}
    ${it.pre ? `<div class="hypo" id="hypo"></div>` : ""}
    ${it.widget ? `<figure class="doc" style="margin:0"><figcaption class="dh"><span>${it.widget.title}</span>${it.widget.sim ? `<span class="sim">⚠ ${it.widget.sim}</span>` : ""}</figcaption><div class="db" id="wz">${locked ? `<p class="locked">🔒 Choisis d'abord ton hypothèse : l'expérience se débloque ensuite.</p>` : ""}</div></figure>` : ""}
    <div class="parts" style="display:grid;gap:.9rem" ${locked ? "hidden" : ""}>${it.parts.map((p, k) => `<div class="part" data-k="${k}"></div>`).join("")}</div>
    <div class="row acts" ${locked ? "hidden" : ""}></div><div class="gfb" aria-live="polite"></div>
    <div class="hints hz"></div><div class="after" style="display:grid;gap:.9rem"></div><div class="unl"></div>`;
  mountFigs(root);
  if (it.pre) paintPre(it, root);
  if (it.widget && !locked) WID[it.widget.w]($("#wz", root));
  it.parts.forEach((p, k) => renderPart(it, k, root));
  paintActions(it, root);
}
function paintPre(it, root) {
  const st = S.it[it.id], h = $("#hypo", root), fixed = !!st.first, shown = corrShown(st);
  h.innerHTML = `<p class="hl">🤔 ${it.pre.label} <span class="ctag">non noté</span></p><div class="opts" role="radiogroup">${it.pre.o.map((o, j) => `<button type="button" class="opt" role="radio" aria-checked="${st.pre === j}" data-h="${j}" ${fixed ? "disabled" : ""}><span class="k">${"ABCD"[j]}</span><span>${o}</span></button>`).join("")}</div>
    ${shown && st.pre !== undefined ? `<p class="pfb ${st.pre === it.pre.a ? "ok" : ""}">${st.pre === it.pre.a ? "✓ Ton hypothèse est confirmée par l'expérience." : "↻ L'expérience t'a conduit à réviser ton hypothèse de départ : c'est ainsi que l'on progresse."}</p>` : fixed ? `<p class="lead">Hypothèse enregistrée.</p>` : st.pre === undefined ? "" : `<p class="lead">Hypothèse enregistrée : tu peux encore la changer avant de vérifier.</p>`}`;
  $$("[data-h]", h).forEach(b => b.onclick = () => { const was = st.pre === undefined; st.pre = +b.dataset.h; save(); if (was) { renderItem(it, root); const n = $(`[data-h="${st.pre}"]`, root); if (n) n.focus(); } else { paintPre(it, root); const n = $(`[data-h="${st.pre}"]`, root); if (n) n.focus(); } });
}
function renderPart(it, k, root) {
  const id = it.id, p = it.parts[k], st = S.it[id], box = $(`.part[data-k="${k}"]`, root), v = st.v[k], pid = `${id}-p${k}`;
  const checked = !!st.checked; const r = checked && scorable(p) ? checkPart(p, v) : null;
  let h = `<p class="pl" id="${pid}-l"><span class="muted">${k + 1}.</span> ${p.label} <span class="ctag">${COMPS[p.c || "redac"].split(" (")[0]}</span></p>`;
  const okc = r ? (r.ok ? "is-ok" : "is-bad") : "";
  if (p.t === "num") h += `<div class="row"><input id="${pid}" class="inp ${okc}" inputmode="decimal" autocomplete="off" aria-labelledby="${pid}-l" value="${esc(v || "")}"><span class="unit">${p.unit || ""}</span></div>`;
  if (p.t === "word") h += `<div class="row"><input id="${pid}" class="inp wide ${okc}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-labelledby="${pid}-l" value="${esc(v || "")}" style="max-width:22rem"></div>`;
  if (p.t === "choice") h += `<div class="opts" role="radiogroup" aria-labelledby="${pid}-l">${p.o.map((o, j) => { let cls = "", t = ""; if (checked && v === j) { cls = j === p.a ? "is-ok" : "is-bad"; t = j === p.a ? "✓ Juste" : "✗ Faux"; } return `<button type="button" class="opt ${cls}" role="radio" aria-checked="${v === j}" data-j="${j}"><span class="k">${"ABCD"[j]}</span><span>${o}</span>${t ? `<span class="tag">${t}</span>` : ""}</button>`; }).join("")}</div>`;
  if (p.t === "multi") h += `<div class="opts" role="group" aria-labelledby="${pid}-l">${p.o.map((o, j) => { const on = (v || []).includes(j); return `<button type="button" class="opt" aria-pressed="${on}" aria-checked="${on}" data-j="${j}"><span class="k" style="border-radius:6px">${on ? "✓" : ""}</span><span>${o}</span></button>`; }).join("")}</div>`;
  if (p.t === "rows") h += `<div class="rows">${p.rows.map((row, i) => { const cur = (v || {})[i]; return `<div class="rowq"><span class="rt">${row.txt}</span><div class="seg" role="group" aria-label="${esc(row.txt)}">${p.choices.map((c, j) => { const cls = checked && cur === j ? (j === row.a ? "is-ok" : "is-bad") : ""; return `<button type="button" class="${cls}" aria-pressed="${cur === j}" data-i="${i}" data-j="${j}">${cls === "is-ok" ? "✓ " : cls === "is-bad" ? "✗ " : ""}${c}</button>`; }).join("")}</div></div>`; }).join("")}</div>`;
  if (p.t === "loop") {
    const chosen = v || [], ord = order(id + k, p.items.length), solved = checked && r && r.ok;
    h += `<div class="loopd"><span class="lhead" aria-hidden="true">▶</span><div class="lslot fixed"><span class="n">1</span><span>${p.start}</span></div>${p.items.map((_, i) => { const j = chosen[i], cls = checked && j !== undefined ? (j === i ? "is-ok" : "is-bad") : ""; return `<div class="larr" aria-hidden="true">↓</div><button type="button" class="lslot ${j !== undefined ? "filled" : ""} ${cls}" data-slot="${i}" ${j === undefined ? "disabled" : ""} aria-label="Case ${i + 2} : ${j !== undefined ? esc(p.items[j]) + ". Toucher pour retirer." : "vide"}"><span class="n">${i + 2}</span><span>${j !== undefined ? p.items[j] : `<span class="muted">…</span>`}</span>${cls ? `<span class="tag">${cls === "is-ok" ? "✓ Juste" : "✗ Faux"}</span>` : ""}</button>`; }).join("")}<p class="lret">↺ ${solved ? p.back + " : retour à la case 1." : "puis retour à la case 1 : la boucle est bouclée."}</p></div>
      <div class="bank">${ord.filter(j => !chosen.includes(j)).map(j => `<button type="button" class="order-item" data-j="${j}"><span class="n">+</span><span>${p.items[j]}</span></button>`).join("")}</div><p class="lead">Touche une étiquette pour la placer dans la première case libre. Touche une case remplie pour la vider.</p>`;
  }
  if (p.t === "text") h += `<textarea id="${pid}" class="inp" aria-labelledby="${pid}-l" placeholder="Rédige ta réponse ici, en phrases complètes…">${esc(v || "")}</textarea><p class="lead">Après validation : réponse modèle et grille d'auto-évaluation.</p>`;
  h += `<div class="pfbw" aria-live="polite">${r ? `<p class="pfb ${r.ok ? "ok" : "bad"}">${r.msg}</p>` : ""}</div>`;
  box.innerHTML = h;
  const setV = (val, rerender) => { st.v[k] = val; save(); if (rerender) renderPart(it, k, root); };
  const clear = () => { $$(".is-ok,.is-bad", box).forEach(x => x.classList.remove("is-ok", "is-bad")); const f = $(".pfbw", box); if (f) f.innerHTML = ""; };
  const refocus = sel => { const n = box.querySelector(sel); if (n) n.focus(); };
  if (["num", "text", "word"].includes(p.t)) { const inp = box.querySelector("input,textarea"); inp.addEventListener("input", () => { setV(inp.value, false); clear(); }); if (p.t !== "text") inp.addEventListener("keydown", ev => { if (ev.key === "Enter") { const b = $(".acts [data-check]", root); if (b) b.click(); } }); }
  if (p.t === "choice") $$(".opt", box).forEach(b => b.onclick = () => { setV(+b.dataset.j, true); refocus(`.opt[data-j="${b.dataset.j}"]`); });
  if (p.t === "multi") $$(".opt", box).forEach(b => b.onclick = () => { const cur = (st.v[k] || []).slice(); const j = +b.dataset.j; const i = cur.indexOf(j); if (i >= 0) cur.splice(i, 1); else cur.push(j); setV(cur, true); refocus(`[data-j="${j}"]`); });
  if (p.t === "rows") $$(".seg button", box).forEach(b => b.onclick = () => { const cur = Object.assign({}, st.v[k] || {}); cur[+b.dataset.i] = +b.dataset.j; setV(cur, true); refocus(`[data-i="${b.dataset.i}"][data-j="${b.dataset.j}"]`); });
  if (p.t === "loop") {
    $$(".bank [data-j]", box).forEach(b => b.onclick = () => { const cur = (st.v[k] || []).slice(); cur.push(+b.dataset.j); setV(cur, true); refocus(".bank [data-j]") || refocus(`[data-slot="${cur.length - 1}"]`); });
    $$("[data-slot]", box).forEach(b => b.onclick = () => { const cur = (st.v[k] || []).slice(); cur.splice(+b.dataset.slot, 1); setV(cur, true); refocus(".bank [data-j]"); });
  }
}

function synthHTML() {
  const fin = ITEMS.c1.it.parts[0], v = (S.it.c1 && S.it.c1.v[0]) || {};
  const answered = PRE.rows.filter((r, i) => S.pre[i] !== undefined).length, good = PRE.rows.filter((r, i) => S.pre[i] === r.a).length;
  return `<div class="panel" style="background:var(--surface-2)"><p class="kicker">Schéma-bilan</p>
    <div class="synth"><div><span class="sg">🌊 Océan</span><span class="ef">Amortit à court terme</span><span>Inertie thermique : l'eau s'échauffe moins vite que l'air… mais se refroidit lentement, d'où des effets à long terme.</span></div>
      <div><span class="sg">🧊 Surfaces gelées</span><span class="ef">Amplifie</span><span>Fonte des glaces → albédo en baisse → plus d'énergie absorbée → réchauffement accru : rétroaction positive.</span></div>
      <div><span class="sg">🌳 Végétalisation</span><span class="ef">Amortit à court terme</span><span>Les forêts en croissance stockent du CO₂ par photosynthèse. À l'équilibre, le puits devient nul.</span></div></div>
    <div class="box warn"><p class="lab">⚠ Vigilance</p><p>${nb("La hausse du niveau marin (dilatation de l'océan, fonte des glaces continentales) est une conséquence du réchauffement : elle n'agit pas en retour sur la température.")}</p></div>
    ${answered ? `<p class="kicker">Ton intuition de départ</p><div class="beforeafter">${PRE.rows.map((r, i) => `<div class="ba"><span>${r.txt}</span><span><b>${S.pre[i] === undefined ? "—" : PRE.choices[S.pre[i]]}</b> ${S.pre[i] === undefined ? "" : S.pre[i] === r.a ? "· ✓ confirmée" : S.pre[i] === 2 ? "· → réponse dans le schéma-bilan" : "· ↻ à réviser"}</span></div>`).join("")}</div><p class="lead">${good}/${PRE.rows.length} de tes intuitions de départ sont confirmées par les documents.</p>` : ""}</div>`;
}

function paintActions(it, root) {
  const id = it.id, st = S.it[id]; const acts = $(".acts", root), gfb = $(".gfb", root), hints = $(".hz", root), after = $(".after", root);
  const max = itemMax(it), hasText = it.parts.some(p => p.t === "text"), shown = corrShown(st);
  acts.innerHTML = `<button class="btn" type="button" data-check>${max ? "Vérifier" : "Valider ma réponse"}</button>
    ${st.hints < 3 && !(shown && st.lastOk) ? `<button class="btn ghost" type="button" data-hint>💡 Coup de pouce ${st.hints + 1}/3</button>` : ""}
    <button class="btn ghost" type="button" data-reset>↺ Recommencer</button>`;
  hints.innerHTML = it.hints.slice(0, st.hints).map((h, i) => `<p class="hint"><b>Coup de pouce ${i + 1}/3</b> · ${h}</p>`).join("");
  if (st.first) {
    const f = st.first;
    gfb.innerHTML = max ? (st.lastOk ? `<div class="fb ok"><p class="h">✓ Tout est juste${f.pts === f.max ? (st.tries === 1 ? " du premier coup !" : ".") : " (après correction)."}</p><p>Score retenu (premier essai) : ${f.pts}/${f.max}${f.hints ? ` · ${f.hints} coup(s) de pouce avant le premier essai` : ""}.</p></div>`
      : `<div class="fb bad"><p class="h">✗ ${st.lastPts}/${max} réponse(s) juste(s).</p><p>${shown ? "Le corrigé est affiché ci-dessous : corrige les réponses marquées ✗, puis vérifie à nouveau." : "Corrige les réponses marquées ✗, puis vérifie à nouveau. Le corrigé s'affichera au deuxième essai."} (Score retenu : ${f.pts}/${f.max}, premier essai.)</p></div>`) : `<div class="fb ok"><p class="h">✓ Réponse enregistrée.</p><p>Compare-la à la réponse modèle, puis coche la grille.</p></div>`;
  } else gfb.innerHTML = "";
  let a = "";
  if (shown && it.corr) a += `<div class="corr"><p class="h">Corrigé</p><p>${it.corr}</p></div>`;
  if (hasText && st.first) a += `<div class="panel" style="background:var(--surface-2)"><p class="kicker">Réponse rédigée · auto-évaluation</p><div class="box info"><p class="lab">ℹ Réponse modèle</p><p>${it.model}</p></div><p><b>Coche ce que ta réponse contient :</b></p><div class="crit">${it.crit.map((c, i) => `<button type="button" aria-pressed="${!!st.crit[i]}" data-ci="${i}"><span class="bx">${st.crit[i] ? "✓" : ""}</span><span>${c}</span></button>`).join("")}</div><p class="lead">Auto-évaluation : ${Object.values(st.crit).filter(Boolean).length}/${it.crit.length} critères.</p></div>`;
  if (shown && it.synth) a += synthHTML();
  after.innerHTML = a;
  const unl = $(".unl", root), ustate = !it.unlock ? "" : (shown && st.lastOk) ? "open" : st.first ? "locked" : "";
  if (unl.dataset.state !== ustate) {
    unl.dataset.state = ustate;
    unl.innerHTML = ustate === "open" ? `<figure class="doc unlock" style="margin:0"><figcaption class="dh"><span>${it.unlock.title}</span>${it.unlock.sim ? `<span class="sim">⚠ ${it.unlock.sim}</span>` : ""}</figcaption><div class="db unlockz"></div></figure>` : ustate === "locked" ? `<p class="locked">🔒 Une simulation se débloque quand toutes les réponses sont justes.</p>` : "";
    if (ustate === "open") WID[it.unlock.w]($(".unlockz", unl));
  }
  $("[data-check]", acts).onclick = () => {
    const res = it.parts.map((p, k) => scorable(p) ? checkPart(p, st.v[k]) : null);
    const empty = res.some(r => r && r.empty);
    const textEmpty = it.parts.some((p, k) => p.t === "text" && !String(st.v[k] || "").trim());
    const pts = res.filter(r => r && r.ok).length;
    if ((empty || textEmpty) && !st.first) { gfb.innerHTML = `<div class="fb neutral"><p class="h">Complète toutes les questions avant de vérifier.</p><p>Le premier essai n'est compté que lorsque tout est rempli.</p></div>`; gfb.scrollIntoView({ block: "nearest", behavior: "smooth" }); return; }
    st.checked = true; st.lastPts = pts; st.lastOk = pts === max; st.tries = (st.tries || 0) + 1;
    if (!st.first) st.first = { pts, max, hints: st.hints, parts: res.map(r => r ? !!r.ok : null) };
    save();
    it.parts.forEach((p, k) => renderPart(it, k, root)); if (it.pre) paintPre(it, root); paintActions(it, root); refreshChrome(it);
    const g = $(".gfb", root); if (g && g.scrollIntoView) g.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  const hb = $("[data-hint]", acts); if (hb) hb.onclick = () => { st.hints = Math.min(3, st.hints + 1); save(); paintActions(it, root); const hs = $$(".hz .hint", root); const last = hs[hs.length - 1]; if (last) last.scrollIntoView({ block: "nearest", behavior: "smooth" }); };
  armButton($("[data-reset]", acts), "↺ Recommencer", "Effacer mes réponses ?", () => { const keep = st.first; S.it[id] = { v: {}, hints: 0, crit: {}, pre: st.pre, first: keep, tries: keep ? st.tries : 0, lastOk: false }; save(); renderItem(it, root); refreshChrome(it); });
  $$(".crit button", after).forEach(b => b.onclick = () => { const i = +b.dataset.ci; st.crit[i] = !st.crit[i]; save(); paintActions(it, root); const nb2 = $(`.after [data-ci="${i}"]`, root); if (nb2) nb2.focus(); });
}

/* ---------- bilan ---------- */
function compStats() { const out = {}; Object.keys(COMPS).forEach(k => out[k] = { ok: 0, n: 0 }); Object.values(ITEMS).forEach(({ it }) => { const st = S.it[it.id]; if (!st || !st.first) return; it.parts.forEach((p, k) => { if (!scorable(p)) return; const c = p.c || "rais"; out[c].n++; if (st.first.parts[k]) out[c].ok++; }); if (it.crit) { out.redac.n += it.crit.length; out.redac.ok += Object.values(st.crit || {}).filter(Boolean).length; } }); return out; }
function missedParts() { const out = []; Object.values(ITEMS).forEach(({ it, label }) => { const st = S.it[it.id]; if (!st || !st.first) return; st.first.parts.forEach((ok, k) => { if (ok === false) out.push(`${label} · question ${k + 1}`); }); }); return out; }
function totals() { let pts = 0, max = 0, done = 0, n = 0; GROUPS.forEach(g => { const s = gScore(g); pts += s.pts; max += s.max; done += s.done; n += s.n; }); return { pts, max, done, n }; }
const gName = g => g.n ? `Atelier ${g.n} · ${g.title}` : g.title;
function bilanText(name) {
  const T = totals(), cs = compStats(), ms = missedParts();
  let t = `ÉVOLUTION DE LA TEMPÉRATURE ET RÉTROACTIONS\nTerminale · Enseignement scientifique · Thème 1, chapitre 2 · Trois ateliers et une mise en commun\n\nRÉSUMÉ DE L'ACTIVITÉ\n${RESUME}\n\nBILAN\nÉlève : ${name || "—"}\nDate : ${today()}\n\nPoints au premier essai\n`;
  GROUPS.forEach(g => { const s = gScore(g); t += `- ${gName(g)} : ${s.done ? s.pts + "/" + s.max : "—"} (${s.done}/${s.n} étapes faites)\n`; g.items.forEach((it, i) => { const st = S.it[it.id]; t += `    étape ${i + 1} ${LV[it.lvl][2]} ${it.title.replace(/ | /g, " ")} : ${st && st.first ? (itemMax(it) ? st.first.pts + "/" + st.first.max : "rédigé") + (st.first.hints ? ` (${st.first.hints} coup(s) de pouce)` : "") : "—"}\n`; }); });
  t += `Total : ${T.pts}/${T.max} (${T.done}/${T.n} étapes faites)\n\nIndicateurs de réussite\n`;
  GROUPS.forEach(g => g.inds.forEach(d => { t += `- [${indDone(d) ? "x" : " "}] Atelier ${g.n} · ${d.t}\n`; }));
  t += `\nBilan par compétence (premier essai)\n`; Object.entries(COMPS).forEach(([k, lab]) => { const c = cs[k]; t += `- ${lab} : ${c.n ? (k === "redac" ? c.ok + "/" + c.n + " critères cochés" : c.ok + "/" + c.n) : "—"}\n`; });
  t += `\nQuestions ratées au premier essai (${ms.length})\n${ms.length ? ms.map(x => "- " + x).join("\n") : "- aucune"}\n`;
  const pre = PRE.rows.filter((r, i) => S.pre[i] !== undefined); if (pre.length) t += `\nIntuitions de départ confirmées : ${PRE.rows.filter((r, i) => S.pre[i] === r.a).length}/${PRE.rows.length}\n`;
  const txt = Object.values(ITEMS).filter(({ it }) => it.parts.some(p => p.t === "text") && S.it[it.id] && S.it[it.id].first);
  if (txt.length) { t += `\nRéponses rédigées\n`; txt.forEach(({ it, label }) => { const k = it.parts.findIndex(p => p.t === "text"); t += `- ${label}\n  ${String(S.it[it.id].v[k] || "").trim().replace(/\s*\n\s*/g, "\n  ")}\n`; }); }
  return (t + `\n${SIGN}\n`).replace(/ | /g, " ");
}
function renderBilan(m) {
  const T = totals(), cs = compStats(), ms = missedParts();
  m.innerHTML = `<section class="view"><div><p class="kicker">Bilan</p><h2 class="sec-title">Mon bilan de l'activité</h2><p class="lead">Points comptés au premier essai. ${T.done}/${T.n} étapes faites.</p></div>
    <div class="panel"><p class="score-big">${T.pts}/${T.max}</p><div class="bar" aria-hidden="true"><i style="width:${T.max ? T.pts / T.max * 100 : 0}%"></i></div></div>
    <div class="panel"><h3>Par partie</h3><div class="tablewrap"><table class="t"><thead><tr><th>Partie</th><th>Étapes faites</th><th>Points (premier essai)</th></tr></thead><tbody>${GROUPS.map(g => { const s = gScore(g); return `<tr><td>${g.icon} ${gName(g)}</td><td class="n">${s.done}/${s.n}</td><td class="n">${s.done ? s.pts + "/" + s.max : "—"}</td></tr>`; }).join("")}</tbody></table></div></div>
    <div class="panel"><h3>Indicateurs de réussite</h3><ul class="inds">${GROUPS.map(g => g.inds.map(d => { const ok = indDone(d); return `<li class="${ok ? "done" : ""}"><span class="bx" aria-hidden="true">${ok ? "✓" : ""}</span><span><b>Atelier ${g.n}.</b> ${d.t} <span class="st">${ok ? "✓ fait" : "à faire"}</span></span></li>`; }).join("")).join("")}</ul></div>
    <div class="panel"><h3>Par compétence</h3><div class="comps">${Object.entries(COMPS).map(([k, lab]) => { const c = cs[k]; const r = c.n ? c.ok / c.n : 0; return `<div class="comp"><div class="row" style="justify-content:space-between"><span>${lab}</span><b class="num">${c.n ? c.ok + "/" + c.n : "—"}</b></div><div class="bar" aria-hidden="true"><i style="width:${r * 100}%"></i></div></div>`; }).join("")}</div></div>
    <div class="panel"><h3>Questions ratées au premier essai</h3>${ms.length ? `<ul class="ul">${ms.map(x => `<li>${x}</li>`).join("")}</ul>` : "<p>Aucune pour l'instant.</p>"}</div>
    <div class="panel"><h3>Transmettre mon bilan</h3><p class="lead">Le fichier contient le résumé de l'activité, tes points par partie et par compétence, les indicateurs de réussite, les questions ratées au premier essai et tes réponses rédigées.</p><div id="bt"></div></div>
    <div class="panel"><h3>Recommencer</h3><p class="lead">Efface toutes les réponses de cette activité sur cet appareil.</p><div class="row"><button class="btn ghost" type="button" id="reset">Tout effacer</button></div></div></section>`;
  renderBilanTools($("#bt"), bilanText, name => `<p class="kicker">Bilan à montrer au professeur</p><h2>${esc(name || "Élève")}</h2><p>Température et rétroactions · ${today()}</p>${GROUPS.map(g => { const s = gScore(g); return `<div class="line"><span>${g.icon} ${gName(g)}</span><b class="num">${s.done ? s.pts + "/" + s.max : "—"} <span style="font-weight:400">(${s.done}/${s.n} étapes)</span></b></div>`; }).join("")}<div class="line"><span><b>Total (premier essai)</b></span><b class="num">${T.pts}/${T.max}</b></div><div class="line"><span>Rédaction (critères cochés)</span><b class="num">${cs.redac.n ? cs.redac.ok + "/" + cs.redac.n : "—"}</b></div><div class="line"><span>Questions ratées au premier essai</span><b class="num">${ms.length}</b></div>`, "temperature-retroactions");
  armButton($("#reset"), "Tout effacer", "Confirmer l'effacement ?", () => { S.it = {}; S.step = {}; S.pre = {}; save(); go("accueil"); });
}

/* ---------- démarrage ---------- */
Display.init(S, save);
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && h !== S.view && VIEWS.includes(h)) go(h); });
go(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : (S.view || "accueil"), true);
