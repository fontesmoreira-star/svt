/* ===== 3e SVT · Activité 7 · TP noté sur 10 : analyse du sang retrouvé sur les vêtements de la victime ===== */
Store.key = "svt3-tp-agglutination-note-v1";
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
const PARTS = [
  { id: "p1", bench: "lucie", n: 1, max: 2, tab: "Partie 1 · Lucie", title: "Partie 1 · Vérification du groupe sanguin de Lucie DITÉE",
    proto: ["Placer une goutte de l'échantillon de « Lucie DITÉE » (= antigène) dans deux puits sur une plaque.", "Dans chaque puits, rajouter un sérum (= anticorps = AC) : anti-A dans le premier, anti-B dans le second. Les anticorps anti-A reconnaissent et se fixent spécifiquement sur les marqueurs A ; les anti-B, sur les marqueurs B.", "Mélanger avec un cure-dent différent pour chaque puits, puis observer le résultat et confirmer son groupe sanguin."],
    items: [{ k: "a", lab: "Résultat avec anti-A", o: RES, ans: 0, p: 0.5 }, { k: "b", lab: "Résultat avec anti-B", o: RES, ans: 1, p: 0.5 }, { k: "g", lab: "Groupe sanguin de Lucie", o: GR, ans: 0, p: 1 }] },
  { id: "p2", bench: "coupable", n: 2, max: 3, tab: "Partie 2 · Coupable", title: "Partie 2 · Analyse du sang du coupable",
    proto: ["Placer une goutte de l'échantillon « sang du coupable » (= antigène) dans deux puits sur une plaque.", "Dans chaque puits, rajouter un sérum (= anticorps = AC) : anti-A dans le premier, anti-B dans le second.", "Mélanger avec un cure-dent différent pour chaque puits, puis observer le résultat."],
    items: [{ k: "a", lab: "Résultat avec anti-A", o: RES, ans: 1, p: 1 }, { k: "b", lab: "Résultat avec anti-B", o: RES, ans: 1, p: 1 }, { k: "g", lab: "Groupe sanguin du coupable", o: GR, ans: 3, p: 1 }] }];
const CONC = [
  { k: "c1", lab: "Je vois que…", sub: "le résultat du test", o: ["le sang du coupable n'agglutine ni avec le sérum anti-A, ni avec le sérum anti-B", "le sang du coupable agglutine avec les sérums anti-A et anti-B", "le sang de Lucie DITÉE agglutine avec le sérum anti-A"], ord: [1, 0, 2] },
  { k: "c2", lab: "Je sais que…", sub: "ce que signifie ce résultat", o: ["sans agglutination, les globules rouges ne portent ni antigène A ni antigène B : le sang est du groupe O", "sans agglutination, le test n'a pas fonctionné", "sans agglutination, les globules rouges portent les antigènes A et B : le sang est du groupe AB"], ord: [2, 0, 1] },
  { k: "c3", lab: "Or…", sub: "ce que dit le document", o: ["Jean NEYMAR est du groupe O, Djamal ALATETE du groupe A et Max HYMOME du groupe AB", "les trois suspects sont des hommes", "Lucie DITÉE est du groupe A"], ord: [1, 2, 0] },
  { k: "c4", lab: "Donc…", sub: "qui peut être le coupable ?", o: ["seul Jean NEYMAR a un groupe sanguin compatible avec le sang retrouvé : Djamal ALATETE et Max HYMOME sont innocentés", "Max HYMOME est le coupable, car le groupe AB contient tous les antigènes", "Djamal ALATETE est le coupable, car il est du même groupe que Lucie DITÉE"], ord: [2, 0, 1] },
  { k: "c5", lab: "Mais…", sub: "esprit critique", o: ["beaucoup de personnes sont du groupe O : c'est un indice, pas une preuve ; une analyse de l'ADN permettrait de le confirmer", "le test d'agglutination prouve à lui seul que Jean NEYMAR est coupable", "le témoin Lucie DITÉE montre que le test ne fonctionne pas"], ord: [1, 2, 0] }];
const MINTXT = 40;

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
const partScore = P => P.items.reduce((s, it) => s + (S.ans[P.id][it.k] === it.ans ? it.p : 0), 0);
const concScore = () => CONC.reduce((s, c) => s + (S.ans.c[c.k] === 0 ? 1 : 0), 0);
const total = () => PARTS.reduce((s, P) => s + partScore(P), 0) + concScore();
const allVal = () => S.val.p1 && S.val.p2 && S.val.c;

/* ---------- navigation ---------- */
const VIEWS = ["consignes", "p1", "p2", "conc", "copie"];
const TABN = { consignes: "Consignes", p1: "1 · Lucie (/2)", p2: "2 · Coupable (/3)", conc: "Conclusion (/5)", copie: "Ma copie" };
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
    <div class="panel"><h3>Barème</h3>${tbl(["Partie", "Points"], [["Partie 1 · Vérification du groupe sanguin de Lucie DITÉE", "2"], ["Partie 2 · Analyse du sang du coupable", "3"], ["Conclusion · Qui est le coupable et pour quelle raison ?", "5"], ["<b>Total</b>", "<b>10</b>"]])}</div>
    <div class="box warn"><p class="lab">⚠ Règles du TP noté</p><ul class="ul">
      <li>${nb("Chaque partie se valide <b>une seule fois</b> : relis-toi avant de valider.")}</li>
      <li>${nb("Aucune correction n'est affichée avant la remise de ta copie.")}</li>
      <li>${nb("Les erreurs de manipulation ne retirent pas de points, mais elles figurent dans ta copie.")}</li>
      <li>${nb("Quand les trois parties sont validées, rends ta copie dans l'onglet « Ma copie », puis montre-la au professeur.")}</li></ul></div>
    <div class="box err"><p class="lab">✖ Attention</p><p>${nb("On mélange avec des cure-dents différents pour chaque puits.")}</p></div>
    <div class="panel"><h3>${nb("Aide pour interpréter le résultat")}</h3>${refHTML()}</div>
    ${nextBtn("p1", "Commencer la partie 1 →")}</section>`;
  wireNext(m);
}

/* ---------- parties 1 et 2 ---------- */
function rowsHTML(P) {
  const A = S.ans[P.id], val = !!S.val[P.id], done = bst(P.bench).done, shown = !!S.rendu;
  return P.items.map(it => `<div class="rowq"><span class="rt">${it.lab} <span class="ctag">${pts(it.p)} pt</span></span><div class="seg" role="group" aria-label="${esc(it.lab)}">${it.o.map((o, j) => { const sel = A[it.k] === j, cls = shown && sel ? (j === it.ans ? "is-ok" : "is-bad") : ""; return `<button type="button" class="${cls}" data-k="${it.k}" data-j="${j}" aria-pressed="${sel}" ${val || !done ? "disabled" : ""}>${cls === "is-ok" ? "✓ " : cls === "is-bad" ? "✗ " : ""}${o}</button>`; }).join("")}</div>${shown && A[it.k] !== it.ans ? `<p class="pfb bad">Réponse attendue : <b>${it.o[it.ans]}</b></p>` : ""}</div>`).join("");
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
    const acts = $("#acts", m), msg = $("#vmsg", m);
    if (S.val[P.id]) { acts.innerHTML = ""; msg.innerHTML = S.rendu ? `<div class="fb ${partScore(P) === P.max ? "ok" : "bad"}"><p class="h">Partie ${P.n} : ${pts(partScore(P))} / ${P.max}</p></div>` : `<div class="fb neutral"><p class="h">✓ Partie ${P.n} validée.</p><p>${nb("Tu ne peux plus la modifier. La correction s'affichera à la remise de ta copie.")}</p></div>`; return; }
    acts.innerHTML = `<button type="button" class="btn" id="valBtn">Valider la partie ${P.n}</button>`; msg.innerHTML = "";
    armButton($("#valBtn", m), `Valider la partie ${P.n}`, "Confirmer : je ne pourrai plus modifier", () => {
      if (!bst(P.bench).done) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb("Termine d'abord la manipulation.")}</p></div>`; return; }
      if (P.items.some(it => S.ans[P.id][it.k] === undefined)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb("Complète toutes les lignes de ta fiche avant de valider.")}</p></div>`; return; }
      S.val[P.id] = Date.now(); save(); tabs(); paintRows();
    });
  };
  renderBench(P.bench, bel);
  bel.addEventListener("click", e => benchClick(P.bench, e, bel, paintRows));
  paintRows(); wireNext(m);
}

/* ---------- conclusion ---------- */
function renderConc(m) {
  const A = S.ans.c, val = !!S.val.c, shown = !!S.rendu, p2 = S.ans.p2;
  m.innerHTML = `<section class="view"><div><p class="kicker">Conclusion · 5 points</p><h2 class="sec-title">${nb("Qui est le coupable et pour quelle raison ?")}</h2><p class="lead">${nb("Explique ton raisonnement en t'appuyant sur les résultats du test d'agglutination.")}</p></div>
    <div class="box info"><p class="lab">ℹ Document · Groupes sanguins des suspects (données fictives)</p>${tbl(["Suspect", "Sexe (activité 6)", "Groupe sanguin"], [["Jean NEYMAR", "homme (XY)", "O"], ["Djamal ALATETE", "homme (XY)", "A"], ["Max HYMOME", "homme (XY)", "AB"]])}</div>
    <div class="panel"><h3>Mes résultats de la partie 2</h3>${S.val.p2 ? `<p>${nb(`Anti-A : <b>${p2.a === undefined ? "—" : RES[p2.a]}</b> · Anti-B : <b>${p2.b === undefined ? "—" : RES[p2.b]}</b> · Groupe : <b>${p2.g === undefined ? "—" : GR[p2.g]}</b>`)}</p>` : `<p class="locked">${nb("Valide d'abord la partie 2.")}</p>`}</div>
    <div class="panel"><h3>Mon raisonnement <span class="chip">5 × 1 point</span></h3><p class="lead">${nb("Pour chaque étape, choisis le morceau de phrase qui convient.")}</p><div class="conc">${CONC.map((c, ci) => `<div class="cstep"><p class="pl"><span class="cn">${ci + 1}</span> <b>${c.lab}</b> <span class="muted">(${c.sub})</span></p><div class="opts" role="radiogroup" aria-label="${esc(c.lab)}">${c.ord.map(j => { const sel = A[c.k] === j, cls = shown && sel ? (j === 0 ? "is-ok" : "is-bad") : ""; return `<button type="button" class="opt ${cls}" role="radio" aria-checked="${sel}" data-c="${c.k}" data-j="${j}" ${val ? "disabled" : ""}><span class="k">${"ABC"[c.ord.indexOf(j)]}</span><span>${nb(c.o[j])}</span>${cls ? `<span class="tag">${cls === "is-ok" ? "✓ Juste" : "✗ Faux"}</span>` : ""}</button>`; }).join("")}</div>${shown && A[c.k] !== 0 ? `<p class="pfb bad">Attendu : ${nb(c.o[0])}</p>` : ""}</div>`).join("")}</div></div>
    <div class="panel"><h3>Ma conclusion rédigée</h3><p class="lead">${nb("Rédige ta conclusion avec tes propres mots, en une ou plusieurs phrases. Elle figurera dans ta copie et sera lue par le professeur.")}</p><textarea class="inp" id="ctxt" ${val ? "readonly" : ""} placeholder="Je vois que… Je sais que… Or… Donc… Mais…">${esc(A.txt || "")}</textarea><p class="lead" id="ccount"></p></div>
    <div class="row acts" id="acts"></div><div id="vmsg" aria-live="polite"></div>${nextBtn("copie", "Ma copie →")}</section>`;
  const ta = $("#ctxt", m), cnt = () => { $("#ccount", m).textContent = `${(A.txt || "").trim().length} caractères${(A.txt || "").trim().length < MINTXT ? ` (au moins ${MINTXT})` : ""}`; };
  ta.addEventListener("input", () => { A.txt = ta.value; save(); cnt(); }); cnt();
  $$("[data-c]", m).forEach(b => b.onclick = () => { A[b.dataset.c] = +b.dataset.j; save(); renderConc(m); const n = $(`[data-c="${b.dataset.c}"][data-j="${b.dataset.j}"]`, m); if (n) n.focus(); });
  const acts = $("#acts", m), msg = $("#vmsg", m);
  if (val) { msg.innerHTML = S.rendu ? `<div class="fb ${concScore() === 5 ? "ok" : "bad"}"><p class="h">Conclusion : ${concScore()} / 5</p></div>` : `<div class="fb neutral"><p class="h">✓ Conclusion validée.</p><p>${nb("La correction s'affichera à la remise de ta copie.")}</p></div>`; }
  else { acts.innerHTML = `<button type="button" class="btn" id="valBtn">Valider la conclusion</button>`;
    armButton($("#valBtn", m), "Valider la conclusion", "Confirmer : je ne pourrai plus modifier", () => {
      if (CONC.some(c => A[c.k] === undefined)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb("Choisis un morceau de phrase pour chacune des 5 étapes.")}</p></div>`; return; }
      if ((A.txt || "").trim().length < MINTXT) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb(`Rédige ta conclusion (au moins ${MINTXT} caractères).`)}</p></div>`; return; }
      S.val.c = Date.now(); save(); tabs(); renderConc(m); }); }
  wireNext(m);
}

/* ---------- la copie ---------- */
const hm = d => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const dmy = d => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
function copyText(name) {
  const R = S.rendu, clean = x => String(x).replace(/ | /g, " ").replace(/<[^>]+>/g, "");
  let t = `TP NOTÉ · ACTIVITÉ 7 · ANALYSE DU SANG RETROUVÉ SUR LES VÊTEMENTS DE LA VICTIME\n3e SVT · Génétique\n\nÉlève : ${name || "—"}\n`;
  t += R ? `Copie rendue le ${dmy(R.t)} à ${hm(R.t)}\nCopies rendues sur cet appareil : ${R.n}\n\nNOTE : ${pts(R.note)} / 10\n` : "Copie pas encore rendue.\n";
  PARTS.forEach(P => { t += `\n${P.title} : ${R ? pts(partScore(P)) : "—"} / ${P.max}\n`; P.items.forEach(it => { const a = S.ans[P.id][it.k]; t += `- ${it.lab} : ${a === undefined ? "—" : it.o[a]}${R ? ` (attendu : ${it.o[it.ans]}) → ${pts(a === it.ans ? it.p : 0)} / ${pts(it.p)}` : ""}\n`; }); { const b = bst(P.bench), c = b.contam || 0; t += `- Erreurs de manipulation : ${b.err}${c ? ` (dont ${c} contamination${c > 1 ? "s" : ""})` : ""}\n`; } });
  t += `\nConclusion : ${R ? concScore() : "—"} / 5\n`; CONC.forEach(c => { const a = S.ans.c[c.k]; t += `- ${c.lab} ${a === undefined ? "—" : c.o[a]}${R ? ` → ${a === 0 ? 1 : 0} / 1` : ""}\n`; });
  t += `\nConclusion rédigée par l'élève :\n« ${(S.ans.c.txt || "").trim() || "—"} »\n`;
  if (R) t += `\nRaisonnement attendu : ${CONC.map(c => c.lab.replace(/…$/, "") + " " + c.o[0] + ".").join(" ")}\n`;
  return clean(t + `\n${SIGN}\n`);
}
function renderCopie(m) {
  const R = S.rendu, st = [["Partie 1 · Lucie DITÉE", S.val.p1], ["Partie 2 · Sang du coupable", S.val.p2], ["Conclusion", S.val.c]];
  m.innerHTML = `<section class="view"><div><p class="kicker">Ma copie</p><h2 class="sec-title">${R ? "Ma copie corrigée" : "Rendre ma copie"}</h2></div>
    ${R ? `<div class="panel"><p class="score-big">${pts(R.note)} / 10</p><div class="bar" aria-hidden="true"><i style="width:${R.note * 10}%"></i></div><p class="lead">${nb(`Copie rendue le ${dmy(R.t)} à ${hm(R.t)} · copies rendues sur cet appareil : ${R.n}`)}</p></div>
      <div class="panel"><h3>Détail de la note</h3>${tbl(["Partie", "Points"], [...PARTS.map(P => [P.title, `${pts(partScore(P))} / ${P.max}`]), ["Conclusion", `${concScore()} / 5`], ["<b>Total</b>", `<b>${pts(R.note)} / 10</b>`]])}
        <p class="lead">${nb(`Erreurs de manipulation (sans retrait de points) : partie 1 : ${bst("lucie").err} ; partie 2 : ${bst("coupable").err}.`)}</p>
        <p class="lead">${nb("La correction détaillée s'affiche dans chaque onglet : ✓ juste, ✗ faux, avec la réponse attendue.")}</p></div>
      <div class="box key"><p class="lab">✔ Ce qu'il fallait conclure</p><p>${nb("Le sang retrouvé n'agglutine ni avec le sérum anti-A, ni avec le sérum anti-B : ses globules rouges ne portent ni antigène A ni antigène B, il est du groupe O. Or Jean NEYMAR est du groupe O, Djamal ALATETE du groupe A et Max HYMOME du groupe AB. Seul Jean NEYMAR a un groupe compatible : il peut être l'auteur du sang. Mais beaucoup de personnes sont du groupe O : c'est un indice, pas une preuve à lui seul.")}</p></div>
      <div class="panel"><h3>Ma conclusion rédigée</h3><p class="quote">« ${esc((S.ans.c.txt || "").trim())} »</p></div>
      <div class="panel"><h3>Transmettre ma copie</h3><div id="bt"></div></div>`
    : `<div class="panel"><h3>Où en es-tu ?</h3><ul class="inds">${st.map(([n, v]) => `<li class="${v ? "done" : ""}"><span class="bx" aria-hidden="true">${v ? "✓" : ""}</span><span>${n} <span class="st">${v ? "✓ validée" : "à valider"}</span></span></li>`).join("")}</ul>
      ${allVal() ? `<p class="lead">${nb("Tout est validé. Quand tu rends ta copie, ta note s'affiche avec la correction.")}</p><div class="row"><button type="button" class="btn" id="rendre">📝 Rendre ma copie</button></div>` : `<p class="locked">🔒 ${nb("Valide les trois parties pour pouvoir rendre ta copie.")}</p>`}</div>`}
    <div class="panel"><h3>Recommencer</h3><p class="lead">${nb("Efface ta copie et tes manipulations sur cet appareil. Le nombre de copies rendues reste enregistré.")}</p><div class="row"><button class="btn ghost" type="button" id="reset">Tout effacer</button></div></div></section>`;
  const r = $("#rendre", m); if (r) armButton(r, "📝 Rendre ma copie", "Confirmer la remise de ma copie", () => { const M = meta(); M.n = (M.n || 0) + 1; setMeta(M); S.rendu = { t: Date.now(), note: total(), n: M.n }; save(); tabs(); renderCopie(m); window.scrollTo(0, 0); });
  if (R) renderBilanTools($("#bt", m), copyText, name => `<p class="kicker">TP noté · Activité 7 · copie à montrer au professeur</p><h2>${esc(name || "Élève")}</h2><p>${nb(`Copie rendue le ${dmy(R.t)} à ${hm(R.t)}`)}</p><p class="score-big">${pts(R.note)} / 10</p>${PARTS.map(P => `<div class="line"><span>${P.title}</span><b class="num">${pts(partScore(P))} / ${P.max}</b></div>`).join("")}<div class="line"><span>Conclusion</span><b class="num">${concScore()} / 5</b></div><div class="line"><span>Erreurs de manipulation</span><b class="num">${bst("lucie").err + bst("coupable").err}</b></div><div class="line"><span>Copies rendues sur cet appareil</span><b class="num">${R.n}</b></div>`, "tp-agglutination");
  armButton($("#reset", m), "Tout effacer", "Confirmer l'effacement ?", () => { S.bench = {}; S.ans = { p1: {}, p2: {}, c: {} }; S.val = {}; S.rendu = null; save(); go("consignes"); });
}

/* ---------- démarrage ---------- */
Display.init(S, save);
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && h !== S.view && VIEWS.includes(h)) go(h); });
go(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : (S.view || "consignes"), true);
