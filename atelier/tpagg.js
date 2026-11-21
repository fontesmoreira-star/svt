/* ===== 3e SVT · Activité 7 · TP noté sur 10 (8 points ici + manipulation sur 2 notée par le professeur) : analyse du sang retrouvé sur les vêtements de la victime ===== */
Store.key = "svt3-tp-agglutination-note-v2";
const META_KEY = "svt3-tp-agglutination-note-meta";
const SIGN = "Mr Moreira, Vauban Luxembourg";
const DEF = { fs: 21, theme: null, proj: false, view: "consignes", bench: {}, ans: { p1: {}, p2: {}, c: {} }, val: {}, rendu: null };
let S = Store.load(DEF);
["bench", "val"].forEach(k => { if (!S[k] || typeof S[k] !== "object") S[k] = {}; });
if (!S.ans || typeof S.ans !== "object") S.ans = {}; ["p1", "p2", "c"].forEach(k => { if (!S.ans[k] || typeof S.ans[k] !== "object") S.ans[k] = {}; });
const save = () => Store.save(S);
const meta = () => { try { return JSON.parse(localStorage.getItem(META_KEY) || "{}") || {}; } catch (e) { return {}; } };
const setMeta = m => { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) {} };
const pts = v => String(v).replace(".", ",");

/* ---------- données ---------- */
const GROUPS = { A: ["A"], B: ["B"], AB: ["A", "B"], O: [] };
const agglu = (g, s) => GROUPS[g].includes(s);
const SAMPLES = { lucie: { g: "A", nm: "Lucie DITÉE" }, coupable: { g: "O", nm: "le sang du coupable" } };
const RES = ["Agglutination", "Pas d'agglutination"], GR = ["A", "B", "AB", "O"];
/* Réponses rédigées : notées par éléments attendus (mots-clés, texte normalisé sans accents) ; le professeur relit dans la copie. */
const nrm = x => String(x || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/œ/g, "oe").replace(/[’'`\-]/g, " ").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const any = (n, ...re) => re.some(r => r.test(n));
const PARTS = [
  { id: "p1", bench: "lucie", n: 1, max: 2, tab: "Partie 1 · Lucie", title: "Partie 1 · Vérification du groupe sanguin de Lucie DITÉE",
    proto: ["Placer une goutte de l'échantillon de « Lucie DITÉE » (= antigène) dans deux puits sur une plaque.", "Dans chaque puits, rajouter un sérum (= anticorps = AC) : anti-A dans le premier, anti-B dans le second. Les anticorps anti-A reconnaissent et se fixent spécifiquement sur les marqueurs A ; les anti-B, sur les marqueurs B.", "Mélanger avec un cure-dent différent pour chaque puits, puis observer le résultat et confirmer son groupe sanguin."],
    items: [{ k: "a", lab: "Résultat avec anti-A", o: RES, ans: 0, p: 0.5 }, { k: "b", lab: "Résultat avec anti-B", o: RES, ans: 1, p: 0.5 }, { k: "g", lab: "Groupe sanguin de Lucie", o: GR, ans: 0, p: 0.5 },
      { k: "j", t: "txt", p: 0.5, lab: "Justifie en une phrase le groupe sanguin de Lucie DITÉE.", ph: "Lucie est du groupe … car son sang …",
        crit: [{ lab: "relie le résultat à l'agglutination avec le sérum anti-A (et pas anti-B) ou à la présence de l'antigène (marqueur) A", p: 0.5,
          f: n => any(n, /(antigene|marqueur|molecule|proteine)s?( de type| du groupe)? a\b/, /agglutin\w*( \w+){0,5} anti ?a\b/, /anti ?a\b( \w+){0,5} agglutin/) }],
        model: "Le sang de Lucie agglutine avec le sérum anti-A mais pas avec le sérum anti-B : ses globules rouges portent l'antigène A, elle est donc du groupe A." }] },
  { id: "p2", bench: "coupable", n: 2, max: 2, tab: "Partie 2 · Coupable", title: "Partie 2 · Analyse du sang du coupable",
    proto: ["Placer une goutte de l'échantillon « sang du coupable » (= antigène) dans deux puits sur une plaque.", "Dans chaque puits, rajouter un sérum (= anticorps = AC) : anti-A dans le premier, anti-B dans le second.", "Mélanger avec un cure-dent différent pour chaque puits, puis observer le résultat."],
    items: [{ k: "a", lab: "Résultat avec anti-A", o: RES, ans: 1, p: 0.5 }, { k: "b", lab: "Résultat avec anti-B", o: RES, ans: 1, p: 0.5 }, { k: "g", lab: "Groupe sanguin du coupable", o: GR, ans: 3, p: 0.5 },
      { k: "j", t: "txt", p: 0.5, lab: "Justifie en une phrase le groupe sanguin du coupable : que portent (ou ne portent pas) ses globules rouges ?", ph: "Le sang du coupable … donc ses globules rouges …",
        crit: [{ lab: "explique l'absence d'agglutination avec les deux sérums ou l'absence d'antigènes (marqueurs) A et B", p: 0.5,
          f: n => any(n, /(aucun|aucune|pas d|ni|sans|ne porte\w*( \w+){0,2})( \w+){0,2} (antigene|marqueur|molecule|proteine)/, /(antigene|marqueur)s?( \w+){0,3} ni\b/, /ni a\b( \w+){0,4} ni b\b/)
            || (any(n, /\b(n|ne|pas|aucune?|ni|sans)( \w+){0,3} agglutin/) && any(n, /\bni\b/, /aucun/, /deux/, /\b2\b/, /les 2/)) }],
        model: "Le sang du coupable n'agglutine ni avec le sérum anti-A, ni avec le sérum anti-B : ses globules rouges ne portent ni l'antigène A ni l'antigène B, il est donc du groupe O." }] }];
const CONC = [
  { k: "c1", p: 0.5, lab: "Je vois que…", sub: "le résultat du test", o: ["le sang du coupable n'agglutine ni avec le sérum anti-A, ni avec le sérum anti-B", "le sang du coupable agglutine avec les sérums anti-A et anti-B", "le sang de Lucie DITÉE agglutine avec le sérum anti-A"], ord: [1, 0, 2] },
  { k: "c2", p: 0.5, lab: "Je sais que…", sub: "ce que signifie ce résultat", o: ["sans agglutination, les globules rouges ne portent ni antigène A ni antigène B : le sang est du groupe O", "sans agglutination, le test n'a pas fonctionné", "sans agglutination, les globules rouges portent les antigènes A et B : le sang est du groupe AB"], ord: [2, 0, 1] },
  { k: "c3", p: 0.5, lab: "Or…", sub: "ce que dit le document", o: ["Jean NEYMAR est du groupe O, Djamal ALATETE du groupe A et Max HYMOME du groupe AB", "les trois suspects sont des hommes", "Lucie DITÉE est du groupe A"], ord: [1, 2, 0] },
  { k: "c4", t: "txt", p: 1.5, lab: "Donc…", sub: "rédige : qui peut être le coupable ? Justifie, et explique pourquoi les deux autres suspects sont innocentés", ph: "Donc … peut être le coupable car … ; … et … sont innocentés car …",
    crit: [{ lab: "nomme Jean NEYMAR comme coupable possible", p: 0.5, f: n => any(n, /neymar/, /\bjean\b/) },
      { lab: "justifie : il a le même groupe sanguin (O) que le sang retrouvé", p: 0.5, f: n => any(n, /groupe( sanguin)? (est )?o\b/, /\b(du|le|en|au) o\b/, /compatible/, /meme groupe/, /\bo\b( \w+){0,3} comme/, /correspond/) },
      { lab: "innocente Djamal ALATETE (A) et Max HYMOME (AB) : groupes différents", p: 0.5, f: n => (any(n, /djamal|alatete/) && any(n, /\bmax\b|hymome/) || any(n, /deux autres|autres suspects|les autres/)) && any(n, /innocent|\bpas\b|ne peu|\bne\b|exclu|elimin|ecart|incompatible|differ|disculp|aucun/) }],
    model: "Donc seul Jean NEYMAR, du groupe O, a un groupe sanguin compatible avec le sang retrouvé : il peut être le coupable. Djamal ALATETE (groupe A) et Max HYMOME (groupe AB) ont des groupes différents : ils sont innocentés." },
  { k: "c5", t: "txt", p: 1, lab: "Mais…", sub: "rédige : esprit critique · ce test suffit-il à prouver la culpabilité ? Que pourrait-on faire de plus ?", ph: "Mais … ; pour en être sûr, on pourrait …",
    crit: [{ lab: "explique que c'est un indice et pas une preuve (beaucoup de personnes sont du groupe O)", p: 0.5, f: n => any(n, /indice/, /pas (une |de |la )?preuve/, /ne prouve/, /prouve pas/, /pas suffisant|insuffisant|ne suffit|suffit pas/, /pas (sur|certain)/, /beaucoup|nombreu|plusieurs|d autres (personnes|gens)|autre personne|n importe qui|frequent|courant|repandu|commun/) },
      { lab: "propose une autre analyse pour confirmer (ADN, empreintes…)", p: 0.5, f: n => any(n, /\badn\b/, /empreinte/, /genetique/, /caryotype/, /autres? (test|analyse|examen|preuve|indice)/, /enquete|alibi|temoin|video|camera/) }],
    model: "Mais beaucoup de personnes sont du groupe O : c'est un indice, pas une preuve à lui seul. Une analyse de l'ADN (ou des empreintes) permettrait de confirmer." }];
const MINTXT = 15;
const MAXAPP = 8, MANIP = 2;

/* ---------- dessins : globules, puits, références ---------- */
const hash = k => { const x = Math.sin(k * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const WN = 30, DISP = [], CLMP = [];
for (let i = 0; i < WN; i++) { const a = i * 2.399963, r = 6 + 31 * Math.sqrt((i + 0.5) / WN); DISP.push([50 + r * Math.cos(a) + (hash(i) - 0.5) * 4, 50 + r * Math.sin(a) + (hash(i + 50) - 0.5) * 4]); }
{ const C = [[34, 38], [64, 34], [60, 64], [36, 66], [50, 50]]; for (let j = 0; j < WN; j++) { const c = C[j % 5], k = Math.floor(j / 5), aa = k * 2.4 + j, rr = k === 0 ? 0 : 3.2 * Math.sqrt(k) + 1; CLMP.push([c[0] + rr * Math.cos(aa), c[1] + rr * Math.sin(aa)]); } }
function wellSVG(st, id) {
  st = st || {}; let h = `<svg viewBox="0 0 100 100" aria-hidden="true"${id ? ` id="${id}"` : ""}><circle cx="50" cy="50" r="46" fill="var(--well)" stroke="var(--well-rim)" stroke-width="4"/>`;
  if (st.blood) { const cl = st.mixed && st.agg; h += `<circle class="wbg" cx="50" cy="50" r="42" fill="var(--plasma)" fill-opacity="${cl ? 0.25 : 0.95}"/>`; for (let i = 0; i < WN; i++) { const p = cl ? CLMP[i] : DISP[i]; h += `<circle class="wcell" cx="0" cy="0" r="${cl ? 5.2 : 3.4}" fill="var(--rbc)" style="transform:translate(${p[0].toFixed(1)}px,${p[1].toFixed(1)}px)"/>`; } }
  if (st.serum && !st.mixed) h += `<circle cx="50" cy="50" r="12" fill="${st.serum === "A" ? "var(--agA)" : "var(--agB)"}" opacity=".85"/>`;
  if (st.contam) h += `<text x="50" y="58" text-anchor="middle" font-size="26" font-weight="700" fill="var(--bad)">✖</text>`;
  return h + "</svg>";
}
function refHTML() {
  let h = `<div class="reftable"><span class="h">Groupe</span><span class="h c">Anti-A</span><span class="h c">Anti-B</span><span class="h">Résultat</span>`;
  [["A", "Agglutination avec anti-A seulement"], ["B", "Agglutination avec anti-B seulement"], ["AB", "Agglutination avec anti-A et anti-B"], ["O", "Pas d'agglutination"]].forEach(([g, t]) => { h += `<span class="g">${g}</span>${wellSVG({ blood: 1, mixed: 1, agg: agglu(g, "A") })}${wellSVG({ blood: 1, mixed: 1, agg: agglu(g, "B") })}<span class="t">${nb(t)}</span>`; });
  return h + `</div><p class="cap">${nb("Puits schématisés : des grumeaux sur fond clair = agglutination ; une suspension rouge homogène = pas d'agglutination.")}</p>`;
}
const REF = () => `<details class="ref"><summary>${nb("Aide pour interpréter le résultat")}</summary>${refHTML()}</details>`;

/* ---------- paillasse virtuelle (reprise du labo d'agglutination) ---------- */
const TOOLS = [["blood", "🩸", "Goutte de sang"], ["sA", "🔵", "Sérum anti-A"], ["sB", "🟡", "Sérum anti-B"], ["pick", "🥢", "Cure-dent neuf"]];
const STEPS = ["Dépose une goutte de sang dans chaque puits.", "Ajoute le sérum anti-A dans le puits anti-A.", "Ajoute le sérum anti-B dans le puits anti-B.", "Mélange chaque puits avec un cure-dent neuf.", "Observe le résultat."];
function bst(k) { let b = S.bench[k]; if (!b || !b.w) b = S.bench[k] = { w: { A: {}, B: {} }, tool: null, pick: null, pid: 0, err: 0, contam: 0, msg: "", done: false }; return b; }
function prog(b) { const A = b.w.A, B = b.w.B; return [!!(A.blood && B.blood), !!A.serum, !!B.serum, !!(A.mixed && B.mixed), !!b.done]; }
function renderBench(k, el) {
  const b = bst(k), pr = prog(b), now = pr.indexOf(false), lock = b.done || !!S.rendu;
  const wb = s => { const w = b.w[s], sub = w.contam ? "Contaminé !" : w.mixed ? (w.agg ? "Agglutination" : "Pas d'agglutination") : [w.blood ? "sang" : "", w.serum ? "sérum anti-" + w.serum : ""].filter(Boolean).join(" + ") || "vide";
    return `<button type="button" class="wellbtn${b.tool && !lock ? " target" : ""}${w.contam ? " contam" : ""}" data-well="${s}" aria-label="Puits anti-${s} : ${sub}">${wellSVG(w, "w-" + k + "-" + s)}<span class="wn">Puits anti-${s}</span><span class="ws">${sub}</span></button>`; };
  el.innerHTML = `<div class="row" style="justify-content:space-between"><b>Échantillon : ${SAMPLES[k].nm}</b><span class="chip ${b.err ? "mid" : ""}">Erreurs de manipulation : ${b.err}</span></div>
    <ol class="guide">${STEPS.map((s, i) => { const ok = pr[i]; return `<li class="${ok ? "ok" : i === now ? "now" : ""}"><span class="ck">${ok ? "✓" : i + 1}</span><span>${s}</span></li>`; }).join("")}</ol>
    <div class="toolsbar" role="group" aria-label="Matériel">${TOOLS.map(([t, ic, nm]) => `<button type="button" class="tool" data-tool="${t}" aria-pressed="${b.tool === t}" ${lock ? "disabled" : ""}><span class="tic" aria-hidden="true">${ic}</span>${nm}${t === "pick" && b.pick ? `<small>en main${b.pick.dirty ? " (déjà utilisé)" : ""}</small>` : ""}</button>`).join("")}</div>
    <div class="tray">${wb("A")}${wb("B")}</div>
    <p class="log" aria-live="polite">${nb(b.msg || "Touche un matériel, puis le puits où l'utiliser.")}</p>
    ${b.contamMsg && !b.done ? `<div class="box err"><p class="lab">✖ Erreur critique</p><p>${nb("Tu as utilisé le même cure-dent dans les deux puits : des anticorps sont passés d'un puits à l'autre. Le résultat n'est plus fiable : nettoie la plaque et recommence.")}</p></div>` : ""}
    ${lock ? "" : `<div class="row"><button type="button" class="btn ghost" data-clean>↺ Nettoyer la plaque et recommencer</button></div>`}
    ${b.done ? `<div class="fb ok"><p class="h">✓ Manipulation terminée${b.err ? "" : " sans erreur"}.</p><p>${nb("Observe les deux puits, puis complète ta fiche de résultats.")}</p></div>` : ""}`;
}
function benchClick(k, e, el, after) {
  const b = bst(k); if (S.rendu) return;
  const t = e.target.closest("[data-tool],[data-well],[data-clean]"); if (!t) return;
  const err = m => { b.err++; b.msg = "✗ " + m; };
  if (t.dataset.clean !== undefined && !b.done) { S.bench[k] = { w: { A: {}, B: {} }, tool: null, pick: null, pid: 0, err: b.err, contam: b.contam, msg: "Plaque nettoyée : recommence le protocole.", done: false }; save(); renderBench(k, el); return; }
  if (b.done) return;
  if (t.dataset.tool) { const tk = t.dataset.tool; if (tk === "pick") { b.pid++; b.pick = { id: b.pid, dirty: null }; b.tool = "pick"; b.msg = "Tu as un cure-dent neuf en main : touche le puits à mélanger."; } else { b.tool = b.tool === tk ? null : tk; b.msg = b.tool ? "Touche le puits où l'utiliser." : ""; } save(); renderBench(k, el); return; }
  if (t.dataset.well) {
    const s = t.dataset.well, w = b.w[s], tool = b.tool;
    if (!tool) { b.msg = "Choisis d'abord un matériel."; renderBench(k, el); return; }
    if (w.contam) { b.msg = "Ce puits est contaminé : nettoie la plaque."; renderBench(k, el); return; }
    if (tool === "blood") { if (w.blood) b.msg = "Il y a déjà du sang dans ce puits."; else { w.blood = true; b.msg = "✓ Goutte de sang déposée dans le puits anti-" + s + "."; } }
    else if (tool === "sA" || tool === "sB") { const sr = tool === "sA" ? "A" : "B"; if (sr !== s) err("Ce puits est marqué anti-" + s + " : mets-y le sérum anti-" + s + "."); else if (w.serum) b.msg = "Il y a déjà du sérum dans ce puits."; else { w.serum = sr; b.msg = "✓ Sérum anti-" + sr + " ajouté."; } }
    else if (tool === "pick") {
      if (!b.pick) b.msg = "Prends un cure-dent neuf.";
      else if (!w.blood || !w.serum) err("Il faut d'abord la goutte de sang ET le sérum dans ce puits.");
      else if (w.mixed) b.msg = "Ce puits est déjà mélangé.";
      else if (b.pick.dirty && b.pick.dirty !== s) { w.contam = true; b.contamMsg = true; b.contam++; err("Contamination ! Ce cure-dent a déjà servi dans l'autre puits."); }
      else {
        w.mixed = true; w.agg = agglu(SAMPLES[k].g, s); b.pick.dirty = s; b.msg = "✓ Puits anti-" + s + " mélangé. Observe…";
        const A = b.w.A, B = b.w.B; if (A.mixed && B.mixed && !A.contam && !B.contam) { b.done = true; b.tool = null; b.contamMsg = false; b.msg = "✓ Les deux puits sont prêts. Observe le résultat !"; }
        save();
        const fin = JSON.parse(JSON.stringify(w)), pre = JSON.parse(JSON.stringify(w)); pre.mixed = false; pre.serum = null; b.w[s] = pre; renderBench(k, el); b.w[s] = fin;
        const svg = document.getElementById("w-" + k + "-" + s);
        setTimeout(() => { if (svg) { svg.querySelectorAll(".wcell").forEach((c, i) => { const p = fin.agg ? CLMP[i] : DISP[i]; c.style.transform = `translate(${p[0].toFixed(1)}px,${p[1].toFixed(1)}px)`; c.setAttribute("r", fin.agg ? 5.2 : 3.4); }); const bg = svg.querySelector(".wbg"); if (bg) bg.setAttribute("fill-opacity", fin.agg ? 0.25 : 0.95); }
          setTimeout(() => { renderBench(k, el); if (after) after(); }, 1500); }, 60);
        return;
      }
    }
    save(); renderBench(k, el);
  }
}

/* ---------- notation ---------- */
const rnd = x => Math.round(x * 100) / 100;
const isTxt = it => it.t === "txt";
const txtOf = (pid, k) => String(S.ans[pid][k] || "").trim();
const critRes = (it, v) => { const n = nrm(v); return it.crit.map(c => !!n && !!c.f(n)); };
const itemScore = (pid, it, ok) => { const v = S.ans[pid][it.k]; if (isTxt(it)) return rnd(critRes(it, v).reduce((s, x, i) => s + (x ? it.crit[i].p : 0), 0)); return v === (ok === undefined ? it.ans : ok) ? it.p : 0; };
const partScore = P => rnd(P.items.reduce((s, it) => s + itemScore(P.id, it), 0));
const CMAX = rnd(CONC.reduce((s, c) => s + c.p, 0));
const concScore = () => rnd(CONC.reduce((s, c) => s + itemScore("c", c, 0), 0));
const total = () => rnd(PARTS.reduce((s, P) => s + partScore(P), 0) + concScore());
const allVal = () => S.val.p1 && S.val.p2 && S.val.c;
const missingTxt = (pid, items) => items.filter(isTxt).some(it => txtOf(pid, it.k).length < MINTXT);

/* zone de réponse rédigée (parties 1, 2 et conclusion) */
function txtHTML(pid, it, val, num) {
  const v = txtOf(pid, it.k), shown = !!S.rendu, id = `tx-${pid}-${it.k}`;
  let h = `<div class="rowq"><label class="rt" for="${id}">${num ? `<span class="cn">${num}</span> ` : ""}${num ? `<b>${it.lab}</b> <span class="muted">(${nb(it.sub)})</span>` : nb(it.lab)} <span class="ctag">${pts(it.p)} pt · réponse rédigée</span></label>
    <textarea class="inp" id="${id}" data-tx="${it.k}" ${val ? "readonly" : ""} placeholder="${esc(it.ph)}" style="min-height:5rem">${esc(S.ans[pid][it.k] || "")}</textarea>${val ? "" : `<p class="cap" data-cnt="${it.k}"></p>`}`;
  if (shown) { const r = critRes(it, v); h += `<div class="corr"><p class="h">Éléments attendus · ${pts(itemScore(pid, it))} / ${pts(it.p)} pt</p><ul class="ul">${it.crit.map((c, i) => `<li>${r[i] ? "✓ présent" : "✗ absent"} (${pts(c.p)} pt) : ${nb(c.lab)}</li>`).join("")}</ul><p><b>Exemple de réponse :</b> ${nb(it.model)}</p></div>`; }
  return h + "</div>";
}
function wireTxt(m, pid) {
  $$("[data-tx]", m).forEach(ta => { const k = ta.dataset.tx, c = $(`[data-cnt="${k}"]`, m);
    const cnt = () => { if (!c) return; const L = ta.value.trim().length; c.textContent = `${L} caractères${L < MINTXT ? ` (au moins ${MINTXT})` : ""}`; };
    ta.addEventListener("input", () => { S.ans[pid][k] = ta.value; save(); cnt(); }); cnt(); });
}

/* ---------- navigation ---------- */
const VIEWS = ["consignes", "p1", "p2", "conc", "copie"];
const TABN = { consignes: "Consignes", p1: `1 · Lucie (/${PARTS[0].max})`, p2: `2 · Coupable (/${PARTS[1].max})`, conc: `Conclusion (/${CMAX})`, copie: "Ma copie" };
function tabs() {
  $("#tabs").innerHTML = VIEWS.map(v => { const done = v === "conc" ? S.val.c : S.val[v], st = v === "copie" ? (S.rendu ? "✓ rendue" : "") : done ? "✓" : ""; return `<button class="tab" type="button" data-v="${v}" ${S.view === v ? 'aria-current="page"' : ""}>${TABN[v]}${st ? `<span class="dot" aria-label="${v === "copie" ? "copie rendue" : "partie validée"}">${st}</span>` : ""}</button>`; }).join("");
  $$("#tabs .tab").forEach(b => b.onclick = () => go(b.dataset.v));
}
function go(v, noScroll) {
  if (!VIEWS.includes(v)) v = "consignes"; S.view = v; save(); tabs();
  if (location.hash !== "#" + v) { try { history.replaceState(null, "", "#" + v); } catch (e) {} }
  const m = $("#main");
  if (v === "consignes") renderConsignes(m); else if (v === "conc") renderConc(m); else if (v === "copie") renderCopie(m); else renderPart(m, PARTS.find(P => P.id === v));
  if (!noScroll) window.scrollTo(0, 0);
  const c = $("#tabs [aria-current]"); if (c && c.scrollIntoView) c.scrollIntoView({ block: "nearest", inline: "center" });
}
const nextBtn = (v, t) => `<div class="row"><button type="button" class="btn" data-next="${v}">${t}</button></div>`;
const wireNext = m => $$("[data-next]", m).forEach(b => b.onclick = () => go(b.dataset.next));

/* ---------- consignes ---------- */
function renderConsignes(m) {
  m.innerHTML = `<section class="view">
    <div class="panel"><p class="kicker">Activité 7 · TP évalué</p><h2 class="sec-title">${nb("Analyse du sang récupéré sur les vêtements de la victime")}</h2>
      <div class="box info"><p class="lab">ℹ Objectif</p><p>${nb("Déterminer le groupe sanguin de l'échantillon retrouvé sur les vêtements afin de définir le coupable.")}</p><p><b>Méthode :</b> test d'agglutination.</p></div></div>
    <div class="panel"><h3>Barème</h3>${tbl(["Partie", "Points"], [["Partie 1 · Vérification du groupe sanguin de Lucie DITÉE", String(PARTS[0].max)], ["Partie 2 · Analyse du sang du coupable", String(PARTS[1].max)], ["Conclusion · Qui est le coupable et pour quelle raison ?", pts(CMAX)], ["<b>Sous-total noté dans l'application</b>", `<b>${MAXAPP}</b>`], ["Manipulation (soin, protocole, cure-dents) · notée par le professeur", String(MANIP)], ["<b>Total</b>", `<b>${MAXAPP + MANIP}</b>`]])}
      <p class="cap">${nb("Les réponses rédigées sont notées sur les éléments attendus ; le professeur relit ta copie.")}</p></div>
    <div class="box warn"><p class="lab">⚠ Règles du TP noté</p><ul class="ul">
      <li>${nb("Chaque partie se valide <b>une seule fois</b> : relis-toi avant de valider.")}</li>
      <li>${nb("Aucune correction n'est affichée avant la remise de ta copie.")}</li>
      <li>${nb("Rédige des phrases complètes, avec le vocabulaire du cours (agglutination, antigène, anticorps, groupe sanguin).")}</li>
      <li>${nb(`Ta manipulation est notée sur ${MANIP} par le professeur : tes erreurs de manipulation figurent dans ta copie.`)}</li>
      <li>${nb("Quand les trois parties sont validées, rends ta copie dans l'onglet « Ma copie », puis montre-la au professeur.")}</li></ul></div>
    <div class="box err"><p class="lab">✖ Attention</p><p>${nb("On mélange avec des cure-dents différents pour chaque puits.")}</p></div>
    <div class="panel"><h3>${nb("Aide pour interpréter le résultat")}</h3>${refHTML()}</div>
    ${nextBtn("p1", "Commencer la partie 1 →")}</section>`;
  wireNext(m);
}

/* ---------- parties 1 et 2 ---------- */
function rowsHTML(P) {
  const A = S.ans[P.id], val = !!S.val[P.id], done = bst(P.bench).done, shown = !!S.rendu;
  return P.items.map(it => isTxt(it) ? (done ? txtHTML(P.id, it, val) : "") : `<div class="rowq"><span class="rt">${it.lab} <span class="ctag">${pts(it.p)} pt</span></span><div class="seg" role="group" aria-label="${esc(it.lab)}">${it.o.map((o, j) => { const sel = A[it.k] === j, cls = shown && sel ? (j === it.ans ? "is-ok" : "is-bad") : ""; return `<button type="button" class="${cls}" data-k="${it.k}" data-j="${j}" aria-pressed="${sel}" ${val || !done ? "disabled" : ""}>${cls === "is-ok" ? "✓ " : cls === "is-bad" ? "✗ " : ""}${o}</button>`; }).join("")}</div>${shown && A[it.k] !== it.ans ? `<p class="pfb bad">Réponse attendue : <b>${it.o[it.ans]}</b></p>` : ""}</div>`).join("");
}
function renderPart(m, P) {
  const nextV = P.id === "p1" ? "p2" : "conc";
  m.innerHTML = `<section class="view"><div><p class="kicker">Partie ${P.n} · ${P.max} points</p><h2 class="sec-title">${nb(P.title)}</h2></div>
    <div class="panel"><h3>Protocole</h3><ol class="ul">${P.proto.map(x => `<li>${nb(x)}</li>`).join("")}</ol></div>
    <div class="panel bench" id="bench"></div>
    ${REF()}
    <div class="panel"><h3>Ma fiche de résultats <span class="chip">/ ${P.max} points</span></h3><div class="rows" id="rows"></div><div class="row acts" id="acts"></div><div id="vmsg" aria-live="polite"></div></div>
    ${nextBtn(nextV, P.id === "p1" ? "Partie 2 →" : "Conclusion →")}</section>`;
  const bel = $("#bench", m);
  const paintRows = () => {
    $("#rows", m).innerHTML = (bst(P.bench).done ? "" : `<p class="locked">🔒 ${nb("Termine d'abord la manipulation : ta fiche de résultats se déverrouille ensuite.")}</p>`) + rowsHTML(P);
    $$("#rows [data-k]", m).forEach(b => b.onclick = () => { S.ans[P.id][b.dataset.k] = +b.dataset.j; save(); paintRows(); const n = $(`#rows [data-k="${b.dataset.k}"][data-j="${b.dataset.j}"]`, m); if (n) n.focus(); });
    wireTxt($("#rows", m), P.id);
    const acts = $("#acts", m), msg = $("#vmsg", m);
    if (S.val[P.id]) { acts.innerHTML = ""; msg.innerHTML = S.rendu ? `<div class="fb ${partScore(P) === P.max ? "ok" : "bad"}"><p class="h">Partie ${P.n} : ${pts(partScore(P))} / ${P.max}</p></div>` : `<div class="fb neutral"><p class="h">✓ Partie ${P.n} validée.</p><p>${nb("Tu ne peux plus la modifier. La correction s'affichera à la remise de ta copie.")}</p></div>`; return; }
    acts.innerHTML = `<button type="button" class="btn" id="valBtn">Valider la partie ${P.n}</button>`; msg.innerHTML = "";
    armButton($("#valBtn", m), `Valider la partie ${P.n}`, "Confirmer : je ne pourrai plus modifier", () => {
      if (!bst(P.bench).done) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb("Termine d'abord la manipulation.")}</p></div>`; return; }
      if (P.items.some(it => !isTxt(it) && S.ans[P.id][it.k] === undefined)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb("Complète toutes les lignes de ta fiche avant de valider.")}</p></div>`; return; }
      if (missingTxt(P.id, P.items)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb(`Rédige ta justification (au moins ${MINTXT} caractères).`)}</p></div>`; return; }
      S.val[P.id] = Date.now(); save(); tabs(); paintRows();
    });
  };
  renderBench(P.bench, bel);
  bel.addEventListener("click", e => benchClick(P.bench, e, bel, paintRows));
  paintRows(); wireNext(m);
}

/* ---------- conclusion ---------- */
function renderConc(m) {
  const A = S.ans.c, val = !!S.val.c, shown = !!S.rendu, p2 = S.ans.p2, Q = CONC.filter(c => !isTxt(c)), qmax = rnd(Q.reduce((s, c) => s + c.p, 0));
  const qHTML = (c, ci) => `<div class="cstep"><p class="pl"><span class="cn">${ci + 1}</span> <b>${c.lab}</b> <span class="muted">(${c.sub})</span> <span class="ctag">${pts(c.p)} pt</span></p><div class="opts" role="radiogroup" aria-label="${esc(c.lab)}">${c.ord.map(j => { const sel = A[c.k] === j, cls = shown && sel ? (j === 0 ? "is-ok" : "is-bad") : ""; return `<button type="button" class="opt ${cls}" role="radio" aria-checked="${sel}" data-c="${c.k}" data-j="${j}" ${val ? "disabled" : ""}><span class="k">${"ABC"[c.ord.indexOf(j)]}</span><span>${nb(c.o[j])}</span>${cls ? `<span class="tag">${cls === "is-ok" ? "✓ Juste" : "✗ Faux"}</span>` : ""}</button>`; }).join("")}</div>${shown && A[c.k] !== 0 ? `<p class="pfb bad">Attendu : ${nb(c.o[0])}</p>` : ""}</div>`;
  m.innerHTML = `<section class="view"><div><p class="kicker">Conclusion · ${pts(CMAX)} points</p><h2 class="sec-title">${nb("Qui est le coupable et pour quelle raison ?")}</h2><p class="lead">${nb("Explique ton raisonnement en t'appuyant sur les résultats du test d'agglutination.")}</p></div>
    <div class="box info"><p class="lab">ℹ Document · Groupes sanguins des suspects (données fictives)</p>${tbl(["Suspect", "Sexe (activité 6)", "Groupe sanguin"], [["Jean NEYMAR", "homme (XY)", "O"], ["Djamal ALATETE", "homme (XY)", "A"], ["Max HYMOME", "homme (XY)", "AB"]])}</div>
    <div class="panel"><h3>Mes résultats de la partie 2</h3>${S.val.p2 ? `<p>${nb(`Anti-A : <b>${p2.a === undefined ? "—" : RES[p2.a]}</b> · Anti-B : <b>${p2.b === undefined ? "—" : RES[p2.b]}</b> · Groupe : <b>${p2.g === undefined ? "—" : GR[p2.g]}</b>`)}</p>` : `<p class="locked">${nb("Valide d'abord la partie 2.")}</p>`}</div>
    <div class="panel"><h3>Mon raisonnement · étapes 1 à 3 <span class="chip">${pts(qmax)} pt</span></h3><p class="lead">${nb("Pour chaque étape, choisis le morceau de phrase qui convient.")}</p><div class="conc">${Q.map(qHTML).join("")}</div></div>
    <div class="panel"><h3>Mon raisonnement · étapes 4 et 5, rédigées <span class="chip">${pts(rnd(CMAX - qmax))} pt</span></h3><p class="lead">${nb("Rédige avec tes propres mots, en phrases complètes : cite les suspects et leurs groupes sanguins.")}</p><div class="rows" id="ctx">${CONC.map((c, ci) => isTxt(c) ? txtHTML("c", c, val, ci + 1) : "").join("")}</div></div>
    <div class="row acts" id="acts"></div><div id="vmsg" aria-live="polite"></div>${nextBtn("copie", "Ma copie →")}</section>`;
  wireTxt($("#ctx", m), "c");
  $$("[data-c]", m).forEach(b => b.onclick = () => { A[b.dataset.c] = +b.dataset.j; save(); const y = window.scrollY; renderConc(m); window.scrollTo(0, y); const n = $(`[data-c="${b.dataset.c}"][data-j="${b.dataset.j}"]`, m); if (n) n.focus({ preventScroll: true }); });
  const acts = $("#acts", m), msg = $("#vmsg", m);
  if (val) { msg.innerHTML = S.rendu ? `<div class="fb ${concScore() === CMAX ? "ok" : "bad"}"><p class="h">Conclusion : ${pts(concScore())} / ${pts(CMAX)}</p></div>` : `<div class="fb neutral"><p class="h">✓ Conclusion validée.</p><p>${nb("La correction s'affichera à la remise de ta copie.")}</p></div>`; }
  else { acts.innerHTML = `<button type="button" class="btn" id="valBtn">Valider la conclusion</button>`;
    armButton($("#valBtn", m), "Valider la conclusion", "Confirmer : je ne pourrai plus modifier", () => {
      if (Q.some(c => A[c.k] === undefined)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb(`Choisis un morceau de phrase pour chacune des étapes 1 à ${Q.length}.`)}</p></div>`; return; }
      if (missingTxt("c", CONC)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb(`Rédige les étapes 4 et 5 (au moins ${MINTXT} caractères chacune).`)}</p></div>`; return; }
      S.val.c = Date.now(); save(); tabs(); renderConc(m); }); }
  wireNext(m);
}

/* ---------- la copie ---------- */
const hm = d => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const dmy = d => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const manipTxt = k => { const b = bst(k), c = b.contam || 0; return `${b.err} erreur${b.err > 1 ? "s" : ""}${c ? ` (dont ${c} contamination${c > 1 ? "s" : ""})` : ""}`; };
function copyText(name) {
  const R = S.rendu, clean = x => String(x).replace(/ | /g, " ").replace(/<[^>]+>/g, "");
  const txtLine = (pid, it) => { const v = txtOf(pid, it.k); let l = `- ${it.lab}${it.sub ? ` (${it.sub})` : ""}\n  « ${v || "—"} »${R ? ` → ${pts(itemScore(pid, it))} / ${pts(it.p)}` : ""}\n`; if (R) { const r = critRes(it, v); it.crit.forEach((c, i) => { l += `    ${r[i] ? "[✓]" : "[ ]"} ${c.lab} (${pts(c.p)} pt)\n`; }); } return l; };
  let t = `TP NOTÉ · ACTIVITÉ 7 · ANALYSE DU SANG RETROUVÉ SUR LES VÊTEMENTS DE LA VICTIME\n3e SVT · Génétique\n\nÉlève : ${name || "—"}\n`;
  t += R ? `Copie rendue le ${dmy(R.t)} à ${hm(R.t)}\nCopies rendues sur cet appareil : ${R.n}\n\nNOTE DE L'APPLICATION : ${pts(R.note)} / ${MAXAPP}\nMANIPULATION (notée par le professeur) : ____ / ${MANIP}\nTOTAL : ____ / ${MAXAPP + MANIP}\n` : "Copie pas encore rendue.\n";
  PARTS.forEach(P => { t += `\n${P.title} : ${R ? pts(partScore(P)) : "—"} / ${P.max}\n`; P.items.forEach(it => { if (isTxt(it)) { t += txtLine(P.id, it); return; } const a = S.ans[P.id][it.k]; t += `- ${it.lab} : ${a === undefined ? "—" : it.o[a]}${R ? ` (attendu : ${it.o[it.ans]}) → ${pts(a === it.ans ? it.p : 0)} / ${pts(it.p)}` : ""}\n`; }); t += `- Manipulation : ${manipTxt(P.bench)}\n`; });
  t += `\nConclusion : ${R ? pts(concScore()) : "—"} / ${pts(CMAX)}\n`; CONC.forEach(c => { if (isTxt(c)) { t += txtLine("c", c); return; } const a = S.ans.c[c.k]; t += `- ${c.lab} ${a === undefined ? "—" : c.o[a]}${R ? ` → ${pts(a === 0 ? c.p : 0)} / ${pts(c.p)}` : ""}\n`; });
  if (R) t += `\nRaisonnement attendu : ${CONC.map(c => isTxt(c) ? c.model : c.lab.replace(/…$/, "") + " " + c.o[0] + ".").join(" ")}\n`;
  return clean(t + `\n${SIGN}\n`);
}
function renderCopie(m) {
  const R = S.rendu, st = [["Partie 1 · Lucie DITÉE", S.val.p1], ["Partie 2 · Sang du coupable", S.val.p2], ["Conclusion", S.val.c]];
  const wr = [...PARTS.flatMap(P => P.items.filter(isTxt).map(it => [P.tab, it, P.id])), ...CONC.filter(isTxt).map(c => ["Conclusion · " + c.lab, c, "c"])];
  m.innerHTML = `<section class="view"><div><p class="kicker">Ma copie</p><h2 class="sec-title">${R ? "Ma copie corrigée" : "Rendre ma copie"}</h2></div>
    ${R ? `<div class="panel"><p class="score-big">${pts(R.note)} / ${MAXAPP}</p><div class="bar" aria-hidden="true"><i style="width:${R.note / MAXAPP * 100}%"></i></div><p class="lead">${nb(`+ manipulation sur ${MANIP}, notée par le professeur. Copie rendue le ${dmy(R.t)} à ${hm(R.t)} · copies rendues sur cet appareil : ${R.n}`)}</p></div>
      <div class="panel"><h3>Détail de la note</h3>${tbl(["Partie", "Points"], [...PARTS.map(P => [P.title, `${pts(partScore(P))} / ${P.max}`]), ["Conclusion", `${pts(concScore())} / ${pts(CMAX)}`], ["<b>Sous-total (application)</b>", `<b>${pts(R.note)} / ${MAXAPP}</b>`], ["Manipulation (professeur)", `… / ${MANIP}`], ["<b>Total</b>", `<b>… / ${MAXAPP + MANIP}</b>`]])}
        <p class="lead">${nb(`Manipulation : partie 1 : ${manipTxt("lucie")} ; partie 2 : ${manipTxt("coupable")}.`)}</p>
        <p class="lead">${nb("La correction détaillée s'affiche dans chaque onglet : ✓ juste, ✗ faux, avec la réponse attendue et les éléments attendus des réponses rédigées.")}</p></div>
      <div class="box key"><p class="lab">✔ Ce qu'il fallait conclure</p><p>${nb("Le sang retrouvé n'agglutine ni avec le sérum anti-A, ni avec le sérum anti-B : ses globules rouges ne portent ni antigène A ni antigène B, il est du groupe O. Or Jean NEYMAR est du groupe O, Djamal ALATETE du groupe A et Max HYMOME du groupe AB. Seul Jean NEYMAR a un groupe compatible : il peut être l'auteur du sang. Mais beaucoup de personnes sont du groupe O : c'est un indice, pas une preuve à lui seul.")}</p></div>
      <div class="panel"><h3>Mes réponses rédigées</h3>${wr.map(([t, it, pid]) => `<div class="field"><b>${nb(t)} · ${pts(itemScore(pid, it))} / ${pts(it.p)}</b><p class="quote">« ${esc(txtOf(pid, it.k))} »</p></div>`).join("")}</div>
      <div class="panel"><h3>Transmettre ma copie</h3><div id="bt"></div></div>`
    : `<div class="panel"><h3>Où en es-tu ?</h3><ul class="inds">${st.map(([n, v]) => `<li class="${v ? "done" : ""}"><span class="bx" aria-hidden="true">${v ? "✓" : ""}</span><span>${n} <span class="st">${v ? "✓ validée" : "à valider"}</span></span></li>`).join("")}</ul>
      ${allVal() ? `<p class="lead">${nb("Tout est validé. Quand tu rends ta copie, ta note s'affiche avec la correction.")}</p><div class="row"><button type="button" class="btn" id="rendre">📝 Rendre ma copie</button></div>` : `<p class="locked">🔒 ${nb("Valide les trois parties pour pouvoir rendre ta copie.")}</p>`}</div>`}
    <div class="panel"><h3>Recommencer</h3><p class="lead">${nb("Efface ta copie et tes manipulations sur cet appareil. Le nombre de copies rendues reste enregistré.")}</p><div class="row"><button class="btn ghost" type="button" id="reset">Tout effacer</button></div></div></section>`;
  const r = $("#rendre", m); if (r) armButton(r, "📝 Rendre ma copie", "Confirmer la remise de ma copie", () => { const M = meta(); M.n = (M.n || 0) + 1; setMeta(M); S.rendu = { t: Date.now(), note: total(), n: M.n }; save(); tabs(); renderCopie(m); window.scrollTo(0, 0); });
  if (R) renderBilanTools($("#bt", m), copyText, name => `<p class="kicker">TP noté · Activité 7 · copie à montrer au professeur</p><h2>${esc(name || "Élève")}</h2><p>${nb(`Copie rendue le ${dmy(R.t)} à ${hm(R.t)}`)}</p><p class="score-big">${pts(R.note)} / ${MAXAPP}</p>${PARTS.map(P => `<div class="line"><span>${P.title}</span><b class="num">${pts(partScore(P))} / ${P.max}</b></div>`).join("")}<div class="line"><span>Conclusion</span><b class="num">${pts(concScore())} / ${pts(CMAX)}</b></div><div class="line"><span>Manipulation (professeur) · ${manipTxt("lucie")} puis ${manipTxt("coupable")}</span><b class="num">… / ${MANIP}</b></div><div class="line"><span>Copies rendues sur cet appareil</span><b class="num">${R.n}</b></div>`, "tp-agglutination");
  armButton($("#reset", m), "Tout effacer", "Confirmer l'effacement ?", () => { S.bench = {}; S.ans = { p1: {}, p2: {}, c: {} }; S.val = {}; S.rendu = null; save(); go("consignes"); });
}

/* ---------- démarrage ---------- */
Display.init(S, save);
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && h !== S.view && VIEWS.includes(h)) go(h); });
go(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : (S.view || "consignes"), true);
