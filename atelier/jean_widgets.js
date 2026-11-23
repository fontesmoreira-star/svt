/* ===== 3e SVT · Activité 8 · L'arbre de Jean : allèles du système ABO, fabrique de globules rouges, arbre généalogique, naissances au hasard =====
   Repris de la page autonome « L'arbre de Jean » pour le moteur noté (note.js). L'état des manipulations est rangé dans S.w. */
const GORD = { A: 0, B: 1, O: 2 };
function pheno(a, b) { const s = [a, b], A = s.includes("A"), B = s.includes("B"); return A && B ? "AB" : A ? "A" : B ? "B" : "O"; }
const gname = (a, b) => GORD[a] <= GORD[b] ? a + "/" + b : b + "/" + a;
function symSVG(k) {
  if (k === "A") return '<svg viewBox="0 0 20 20" aria-hidden="true"><polygon points="10,2 18,17 2,17" fill="var(--agA)"/></svg>';
  if (k === "B") return '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" fill="var(--agB)"/></svg>';
  if (k === "O") return '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="var(--agO)"/></svg>';
  return "";
}
const al = k => `<span class="al">${symSVG(k)}${k}</span>`;
/* globule rouge et ses antigènes (triangles A, carrés B) */
function rbcSVG(g) {
  const ag = g === "AB" ? ["A", "B"] : g === "O" ? [] : [g];
  let h = '<svg class="rbc" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="33" fill="var(--rbc)"/><circle cx="50" cy="50" r="18" fill="var(--rbc-in)" opacity=".55"/>';
  if (ag.length) for (let i = 0; i < 8; i++) {
    const a = i / 8 * 6.2832, x = 50 + Math.cos(a) * 38, y = 50 + Math.sin(a) * 38, kind = ag.length === 2 ? (i % 2 ? "B" : "A") : ag[0];
    if (kind === "A") { const p = []; for (let j = 0; j < 3; j++) { const t = a + j * 2.0944; p.push((x + Math.cos(t) * 7).toFixed(1) + "," + (y + Math.sin(t) * 7).toFixed(1)); } h += `<polygon points="${p.join(" ")}" fill="var(--agA)"/>`; }
    else h += `<rect x="${(x - 4.5).toFixed(1)}" y="${(y - 4.5).toFixed(1)}" width="9" height="9" fill="var(--agB)" transform="rotate(${(a * 57.3).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  return h + "</svg>";
}
const barSVG = () => '<svg class="bar9" viewBox="0 0 30 110" aria-hidden="true"><rect class="body" x="3" y="3" width="24" height="104" rx="12" fill="var(--chr)"/><rect x="3" y="24" width="24" height="7" fill="var(--chr-band)"/><rect x="3" y="70" width="24" height="5" fill="var(--chr-band)" opacity=".6"/></svg>';
function chrHTML(val, attrs, cls, from, ro) {
  const v = val || "";
  return `<div class="chr ${cls || ""}">${barSVG()}<button type="button" class="slotb${v ? "" : " empty"}${ro ? " ro" : ""}" ${attrs} ${ro ? "disabled" : ""} aria-label="Allèle : ${v || "vide"}${ro ? "" : ". Toucher pour changer."}">${v ? symSVG(v) + v : "?"}</button>${from ? `<span class="from ${cls}">${from}</span>` : ""}</div>`;
}
const CYC = ["", "A", "B", "O"];
const nextAl = (v, noEmpty) => { let n = CYC[(CYC.indexOf(v || "") + 1) % 4]; if (noEmpty && !n) n = "A"; return n; };
const LEGEND_AL = `<div class="legendrow"><span>${al("A")} → fabrication de l'antigène A</span><span>${al("B")} → fabrication de l'antigène B</span><span>${al("O")} → aucun antigène</span></div>`;

const WID = {};
/* fabrique de globules rouges : deux chromosomes n°9 → groupe sanguin */
WID.factory = el => {
  if (!Array.isArray(S.w.fac)) S.w.fac = ["A", "O"]; if (!S.w.seen || typeof S.w.seen !== "object") S.w.seen = {};
  const paint = focus => {
    const [a, b] = S.w.fac, g = pheno(a, b);
    const msg = a === b ? `Deux allèles identiques (${a} et ${a}) : groupe ${g}.` : g === "AB" ? "A et B s'expriment tous les deux : les deux antigènes sont fabriqués." : `L'allèle ${g} s'exprime ; l'allèle O, présent une seule fois, ne s'exprime pas.`;
    const seen = Object.keys(S.w.seen);
    el.innerHTML = `<p>${nb("Touche les carrés orange pour changer les allèles des deux chromosomes n°9, puis observe le globule rouge fabriqué.")}</p>
      <div class="factory"><div class="pair">${chrHTML(a, 'data-fac="0"')}${chrHTML(b, 'data-fac="1"')}</div><div class="farrow" aria-hidden="true"></div>
      <div class="cellout" aria-live="polite"><div class="pop">${rbcSVG(g)}</div><span class="grp">Groupe ${g}</span><span class="gen">Génotype : ${gname(a, b)}</span></div></div>
      <p class="log">${nb(msg)}</p><p class="cap">${nb(`Génotypes déjà testés : ${seen.length} / 6${seen.length ? ` (${seen.join(", ")})` : ""}`)}</p>`;
    $$("[data-fac]", el).forEach(btn => btn.onclick = () => { const i = +btn.dataset.fac; S.w.fac[i] = nextAl(S.w.fac[i], true); S.w.seen[gname(S.w.fac[0], S.w.fac[1])] = 1; save(); paint(i); });
    if (focus !== undefined) { const n = $(`[data-fac="${focus}"]`, el); if (n) n.focus({ preventScroll: true }); }
  };
  S.w.seen[gname(S.w.fac[0], S.w.fac[1])] = 1; paint();
};
/* naissances au hasard : père B/O × mère A/O */
const SG = [{ g: "AB", gen: "A/B" }, { g: "A", gen: "A/O" }, { g: "B", gen: "B/O" }, { g: "O", gen: "O/O" }];
WID.sim = el => {
  if (!S.w.sim || typeof S.w.sim !== "object") S.w.sim = { A: 0, B: 0, AB: 0, O: 0 };
  el.innerHTML = `<div class="parents"><div class="person dad"><span class="pn">Père</span><span class="pg">B/O · groupe B</span><div class="gam" data-gd><span>B</span><span>O</span></div></div><span class="x" aria-hidden="true">×</span>
      <div class="person mom"><span class="pn">Mère</span><span class="pg">A/O · groupe A</span><div class="gam" data-gm><span>A</span><span>O</span></div></div></div>
    <div class="kid" data-kid aria-live="polite"><span class="muted">Appuie sur « 1 enfant » pour commencer.</span></div>
    <div class="row"><button class="btn" type="button" data-one>👶 1 enfant</button><button class="btn ghost" type="button" data-hundred>100 enfants</button><button class="btn ghost" type="button" data-zero>↺ Remettre à zéro</button></div>
    <p><b>Nombre d'enfants de chaque groupe sanguin</b></p><div class="sbars" data-bars></div><div data-tab></div>`;
  const RM = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const draw = () => [Math.random() < .5 ? "B" : "O", Math.random() < .5 ? "A" : "O"];
  const paint = () => {
    const s = S.w.sim, T = s.A + s.B + s.AB + s.O, mx = Math.max(1, s.A, s.B, s.AB, s.O);
    $("[data-bars]", el).innerHTML = SG.map(x => `<div class="b"><span><b>Groupe ${x.g}</b></span><div class="tr"><span style="width:${s[x.g] / mx * 100}%"></span></div><span class="n">${s[x.g]}</span></div>`).join("");
    $("[data-tab]", el).innerHTML = tbl(["Groupe", "Génotype", "Enfants", "%"], [...SG.map(x => [x.g, x.gen, String(s[x.g]), T ? Math.round(s[x.g] / T * 100) + NB + "%" : "—"]), ["<b>Total</b>", "", `<b>${T}</b>`, T ? "100" + NB + "%" : "—"]]);
  };
  $("[data-one]", el).onclick = () => {
    const r = draw(), g = pheno(r[0], r[1]); S.w.sim[g]++; save();
    const gd = $("[data-gd]", el).children, gm = $("[data-gm]", el).children; [gd[0], gd[1], gm[0], gm[1]].forEach(x => x.classList.remove("pick"));
    (r[0] === "B" ? gd[0] : gd[1]).classList.add("pick"); (r[1] === "A" ? gm[0] : gm[1]).classList.add("pick");
    $("[data-kid]", el).innerHTML = `<div class="pop">${rbcSVG(g)}</div><div><div class="kt">Groupe ${g}</div><div>${nb(`Allèle du père : ${al(r[0])} · allèle de la mère : ${al(r[1])}`)}</div><div class="muted">${nb(`Génotype : ${gname(r[0], r[1])}`)}</div></div>`;
    paint();
  };
  let running = false; const hb = $("[data-hundred]", el);
  hb.onclick = () => { if (running) return; running = true; hb.disabled = true; let n = 0;
    const tick = () => { if (!document.body.contains(el)) { save(); return; } for (let i = 0; i < (RM ? 100 : 5) && n < 100; i++, n++) { const r = draw(); S.w.sim[pheno(r[0], r[1])]++; } paint();
      if (n < 100) setTimeout(tick, 30); else { running = false; hb.disabled = false; save(); $("[data-kid]", el).innerHTML = `<span><b>${nb("100 enfants de plus sont nés.")}</b> ${nb("Regarde le pourcentage de chaque groupe.")}</span>`; } };
    tick(); };
  $("[data-zero]", el).onclick = () => { S.w.sim = { A: 0, B: 0, AB: 0, O: 0 }; save(); paint(); $("[data-kid]", el).innerHTML = `<span class="muted">Appuie sur « 1 enfant » pour commencer.</span>`; };
  paint();
};

/* ---------- arbre généalogique : type de question « tree » ---------- */
const FAM = [{ k: "dad", nm: "Père de Jean", g: "B", cls: "dad" }, { k: "mom", nm: "Mère de Jean", g: "A", cls: "mom" }, { k: "sis", nm: "Sœur de Jean", g: "AB" }, { k: "jean", nm: "Jean", g: "O" }, { k: "bro", nm: "Frère de Jean", g: "B" }];
const TREE_SLOTS = ["dad0", "dad1", "mom0", "mom1", "sis0", "sis1", "jean0", "jean1", "bro0", "bro1"];
const TREE_OK = { dad: v => [v.dad0, v.dad1].sort().join("") === "BO", mom: v => [v.mom0, v.mom1].sort().join("") === "AO", sis: v => v.sis0 === "B" && v.sis1 === "A", jean: v => v.jean0 === "O" && v.jean1 === "O", bro: v => v.bro0 === "B" && v.bro1 === "O" };
const TREE_EXP = { dad: "B/O", mom: "A/O", sis: "B (du père) + A (de la mère)", jean: "O (du père) + O (de la mère)", bro: "B (du père) + O (de la mère)" };
const isKid = p => p.k !== "dad" && p.k !== "mom";
const gtxt = (v, p) => { const a = v[p.k + "0"] || "?", b = v[p.k + "1"] || "?"; return isKid(p) ? `${a} (du père) + ${b} (de la mère)` : `${a}/${b}`; };
function treeHTML(v, ro) {
  v = v || {};
  const person = p => `<div class="person ${p.cls || ""}${p.k === "jean" ? " jean" : ""}"><span class="pn">${p.nm}</span><span class="pg">Groupe ${p.g}</span><div class="pair">${chrHTML(v[p.k + "0"], `data-ts="${p.k}0"`, isKid(p) ? "d" : "", isKid(p) ? "du père" : "", ro)}${chrHTML(v[p.k + "1"], `data-ts="${p.k}1"`, isKid(p) ? "m" : "", isKid(p) ? "de la mère" : "", ro)}</div></div>`;
  return `<div class="tree"><div class="gen1">${person(FAM[0])}${person(FAM[1])}</div><div class="links"><span class="h"></span><span class="v"></span></div><div class="links2"><span class="h"></span><span class="t" style="left:0"></span><span class="t" style="left:50%"></span><span class="t" style="right:0"></span></div><div class="gen2">${person(FAM[2])}${person(FAM[3])}${person(FAM[4])}</div></div>`;
}
const QX = {
  tree: {
    html: (q, v, ro) => treeHTML(v, ro),
    wire: (box, q, ctx) => $$("[data-ts]", box).forEach(b => b.onclick = () => { const v = Object.assign({}, ctx.get() || {}), k = b.dataset.ts; v[k] = nextAl(v[k]); ctx.set(v, true); ctx.focus(`[data-ts="${k}"]`); }),
    filled: (q, v) => !!v && TREE_SLOTS.every(k => v[k]),
    score: (q, v) => v ? FAM.filter(p => TREE_OK[p.k](v)).length * q.pr : 0,
    ans: (q, v) => FAM.map(p => `${p.nm} : ${gtxt(v || {}, p)}`).join(" · "),
    exp: q => FAM.map(p => `${p.nm} : ${TREE_EXP[p.k]}`).join(" · "),
    prof: (q, v) => { v = v || {}; return `<ul class="ul">${FAM.map(p => { const ok = TREE_OK[p.k](v); return `<li>${ok ? "✓" : "✗"} ${p.nm} (groupe ${p.g}) : <b>${esc(gtxt(v, p))}</b>${ok ? "" : ` <span class="muted">(attendu : ${TREE_EXP[p.k]})</span>`} · ${pts(ok ? q.pr : 0)} / ${pts(q.pr)}</li>`; }).join("")}</ul><p class="cap">${nb("Pour les enfants, l'ordre compte : allèle du père à gauche, de la mère à droite.")}</p>`; }
  }
};
