/* ===== Moteur du TP élodée (FR ou DNL EN) ===== */
const LANG = window.TP_LANG || "fr";
const C = TPDATA[LANG], U = C.ui, EXD = TPDATA.EXAO, IMG = window.IMG || {};
Store.key = "svt2-elodee-" + LANG;
const isEN = LANG === "en";
const COL = isEN ? ": " : "\u00a0: ";

/* typographie française (espaces insécables) */
const ty = s => (isEN || typeof s !== "string") ? s : s.replace(/ ([?!:;»%])/g, " $1").replace(/« /g, "« ").replace(/(\d) (g\/L|mg\/L|min|cm|°C|pt|pts)\b/g, "$1 $2");
const BOX = { info: ["ℹ", U.info], warn: ["⚠", U.vig], key: ["✔", U.key] };
const box = (k, html, lab) => `<div class="box ${k}"><p class="lab">${BOX[k][0]} ${lab || BOX[k][1]}</p>${html}</div>`;

/* ---------- registre des items ---------- */
const ITEMS = {};
const reg = (step, it) => { it.step = step; ITEMS[it.id] = it; return it; };
const s1 = C.s1, e1 = C.s3.ex1, e2 = C.s3.ex2, s4 = C.s4;
reg("s1", { id: "s1a", type: "grid", rowHead: s1.tableHead[0], cols: [{ head: s1.tableHead[1], opts: s1.o2Opts }, { head: s1.tableHead[2], opts: s1.lightOpts }], rows: s1.rows.map(r => ({ label: r.name, a: [r.o2, r.light] })) });
reg("s1", { id: "s1b", type: "grid", rowHead: "", cols: [{ head: U.darkCol, opts: s1.predOpts }, { head: U.lightCol, opts: s1.predOpts }], rows: s1.hyps.map(r => ({ label: r.label, a: [r.dark, r.light] })), fb: (ri, ci, v) => (s1.fb[ri + "-" + (ci ? "light" : "dark")] || {})[v] });
reg("s3", { id: "e1a", type: "choice", q: "", opts: e1.organites, a: e1.orgA, no: e1.orgNo });
reg("s3", { id: "e1b1", type: "grid", rowHead: "", cols: [{ head: isEN ? "Colour of the chloroplasts" : "Couleur des chloroplastes", opts: e1.colorOpts }], rows: e1.colorRows.map(r => ({ label: r.label, a: [r.a] })) });
reg("s3", { id: "e1b2", type: "choice", q: isEN ? "Which molecule is made and stored in the chloroplasts in light?" : "Quelle molécule est fabriquée et stockée dans les chloroplastes à la lumière ?", opts: e1.mol, a: e1.molA, no: e1.molNo });
reg("s3", { id: "e1bc", type: "crit", list: e1.critB });
reg("s3", { id: "e2a0", type: "num", q: e2.q0, unit: "g/L", ans: 15, tol: 0.4 });
reg("s3", { id: "e2a10", type: "num", q: e2.q10, unit: "g/L", ans: 0.5, tol: 0.3, err: [[v => v > 1.4 && v < 3, isEN ? "Read the value at the very end of the curve, at t = 10 min." : "Lis la valeur tout au bout de la courbe, à t = 10 min."]] });
reg("s3", { id: "e2a", type: "choice", q: isEN ? "What do yeast cells consume during respiration?" : "Que consomment les levures lors de la respiration ?", opts: e2.cons, a: e2.consA, no: e2.consNo });
reg("s3", { id: "e2ac", type: "crit", list: e2.critA });
reg("s3", { id: "e2b1", type: "grid", rowHead: "", cols: [{ head: isEN ? "Mitochondria" : "Mitochondries", opts: e2.mitoOpts }], rows: e2.mitoRows.map(r => ({ label: r.label, a: [r.a] })) });
reg("s3", { id: "e2b2", type: "choice", q: isEN ? "Where does respiration take place in the cell?" : "Où se déroule la respiration dans la cellule ?", opts: e2.site, a: e2.siteA, no: e2.siteNo });
reg("s3", { id: "e2bc", type: "crit", list: e2.critBb });
reg("s4", { id: "s4d", type: "crit", list: s4.critD });
reg("s4", { id: "s4o", type: "choice", q: s4.obs, opts: s4.obsOpts, a: s4.obsA, no: s4.obsNo });
reg("s4", { id: "s4i", type: "grid", rowHead: "", cols: [{ head: U.cellsCol, opts: s4.ioOpts }, { head: s4.imQ, opts: s4.imOpts }], rows: [{ label: s4.iUp, a: [0, 0] }, { label: s4.iDown, a: [1, 1] }] });
reg("s4", { id: "s4c", type: "choice", q: s4.cQ, opts: s4.hypOpts, a: s4.hypA, no: s4.hypNo });
reg("s4", { id: "s4cc", type: "crit", list: s4.critC });
reg("s4", { id: "s4b", type: "crit", list: s4.critBonus });
C.s2.groupQ.forEach((q, i) => reg("s2", { id: "g" + i, type: "text", q }));
if (isEN) {
  const D = C.dnl;
  reg("lab", { id: "gap", type: "gap" });
  reg("lab", { id: "match", type: "match" });
  D.quiz.qs.forEach((q, i) => reg("lab", { id: "qz" + i, type: "choice", q: (i + 1) + ". " + q.q, opts: q.o, a: q.a }));
  reg("lab", { id: "chal", type: "text", q: "Your description:" });
  D.exit.starters.forEach((q, i) => reg("lab", { id: "ex" + i, type: "text", q }));
  reg("lab", { id: "min", type: "text", q: D.minute.q });
}

/* ---------- état ---------- */
const DEF = { fs: 20, theme: null, proj: false, view: "mission", it: {}, crit: {}, txt: {}, ticks: {}, proto: false, src: "mine", simDone: false, labA: null };
let S = Store.load(DEF);
const save = () => Store.save(S);
const st = id => (S.it[id] = S.it[id] || { v: null });

/* ---------- correction ---------- */
function maxOf(it) { if (it.type === "grid") return it.rows.length * it.cols.length; if (it.type === "gap") return C.dnl.gap.bank.length; if (it.type === "match") return C.dnl.match.pairs.length; if (["choice", "num"].includes(it.type)) return 1; return 0; }
function evalItem(it) {
  const s = st(it.id), v = s.v;
  if (it.type === "choice") { if (v === null || v === undefined) return { empty: true }; return { pts: v === it.a ? 1 : 0, msg: v === it.a ? "" : ((it.no && it.no[v]) || "") }; }
  if (it.type === "num") { if (v === null || String(v).trim() === "") return { empty: true }; const x = parseNum(v); if (!Number.isFinite(x)) return { pts: 0, msg: U.numNaN, nan: true }; if (near(x, it.ans, it.tol)) return { pts: 1, msg: "" }; for (const [f, m] of (it.err || [])) if (f(x)) return { pts: 0, msg: m }; return { pts: 0, msg: U.numBad.replace(/^✗ /, "") }; }
  if (it.type === "grid") { const g = v || {}; let pts = 0, empty = false; const msgs = []; it.rows.forEach((r, ri) => r.a.forEach((a, ci) => { const x = g[ri + "-" + ci]; if (x === undefined) empty = true; else if (x === a) pts++; else if (it.fb) { const m = it.fb(ri, ci, x); if (m) msgs.push(m); } })); if (empty) return { empty: true }; return { pts, msg: msgs.join(" "), bad: maxOf(it) - pts }; }
  if (it.type === "gap") { const g = v || {}; const blanks = gapBlanks(); if (blanks.some((b, i) => g[i] === undefined)) return { empty: true }; const pts = blanks.filter((b, i) => g[i] === b).length; return { pts, bad: blanks.length - pts }; }
  if (it.type === "match") { const g = v || {}; const n = C.dnl.match.pairs.length; if (Object.keys(g).length < n) return { empty: true }; let pts = 0; for (let i = 0; i < n; i++) if (g[i] === i) pts++; return { pts, bad: n - pts }; }
  return { pts: 0 };
}
function stepScore(step) { let p = 0, m = 0; Object.values(ITEMS).filter(it => it.step === step).forEach(it => { const mx = maxOf(it); if (!mx) return; m += mx; const s = S.it[it.id]; if (s && s.first !== undefined) p += s.first; }); return [p, m]; }
function stepCrit(step) { let a = 0, b = 0; Object.values(ITEMS).filter(it => it.step === step && it.type === "crit").forEach(it => { b += it.list.length; a += Object.values(S.crit[it.id] || {}).filter(Boolean).length; }); return [a, b]; }

/* ---------- rendu des items ---------- */
function renderItem(el, it) {
  const s = st(it.id); el.dataset.item = it.id; el.classList.add("item");
  const checked = !!s.checked, r = checked ? evalItem(it) : null;
  let h = "";
  if (it.q && it.type !== "text") h += `<p class="q">${ty(it.q)}</p>`;
  if (it.type === "choice") {
    h += `<div class="opts" role="radiogroup">${it.opts.map((o, j) => { let cls = "", tag = ""; if (checked && s.v === j) { cls = j === it.a ? "is-ok" : "is-bad"; tag = j === it.a ? U.ok.replace(/\.$/, "") : "✗"; } return `<button type="button" class="opt ${cls}" role="radio" aria-checked="${s.v === j}" data-j="${j}"><span class="k">${"ABCDE"[j]}</span><span>${ty(o)}</span>${tag ? `<span class="tag">${tag}</span>` : ""}</button>`; }).join("")}</div>`;
  }
  if (it.type === "num") h += `<div class="row"><input class="inp ${r && !r.empty ? (r.pts ? "is-ok" : "is-bad") : ""}" inputmode="decimal" autocomplete="off" aria-label="${esc(it.q)}" value="${esc(s.v || "")}"><span class="unit">${it.unit}</span></div>`;
  if (it.type === "grid") {
    h += `<div class="grid">${it.rows.map((row, ri) => `<div class="grow"><p class="gl">${ty(row.label)}</p>${it.cols.map((col, ci) => { const cur = (s.v || {})[ri + "-" + ci]; return `<div class="gc">${it.cols.length > 1 || col.head ? `<span class="gh">${ty(col.head)}</span>` : ""}<div class="seg" role="radiogroup" aria-label="${esc(row.label + " · " + col.head)}">${col.opts.map((o, j) => { const cls = checked && cur === j ? (j === row.a[ci] ? "is-ok" : "is-bad") : ""; return `<button type="button" role="radio" class="${cls}" aria-checked="${cur === j}" data-c="${ri}-${ci}" data-j="${j}">${cls === "is-ok" ? "✓ " : cls === "is-bad" ? "✗ " : ""}${ty(o)}</button>`; }).join("")}</div></div>`; }).join("")}</div>`).join("")}</div>`;
  }
  if (it.type === "crit") {
    const c = S.crit[it.id] || {};
    h += `<div class="critwrap"><p class="ch">✍ ${ty(U.critHead)}</p><div class="crit">${it.list.map((x, i) => `<button type="button" aria-pressed="${!!c[i]}" data-ci="${i}"><span class="bx">${c[i] ? "✓" : ""}</span><span>${ty(x)}</span></button>`).join("")}</div><p class="small muted">${U.critCount(Object.values(c).filter(Boolean).length, it.list.length)}</p></div>`;
  }
  if (it.type === "text") h += `<label class="q" for="t-${it.id}">${ty(it.q)}</label><textarea id="t-${it.id}" class="inp">${esc(S.txt[it.id] || "")}</textarea>`;
  if (it.type === "gap") h += gapHTML(s, checked);
  if (it.type === "match") h += matchHTML(s, checked);
  if (maxOf(it)) {
    h += `<div class="row act"><button class="btn" type="button" data-check>${U.check}</button>${s.first !== undefined ? `<span class="chip">${U.firstCounted}${COL}${s.first}/${maxOf(it)}</span>` : ""}</div><div class="fbz" aria-live="polite">${fbHTML(it, s, r)}</div>`;
  }
  el.innerHTML = h;
  bindItem(el, it);
}
function fbHTML(it, s, r) {
  if (!r) return s.warn ? `<div class="fb neutral"><p class="h">${U.incomplete}</p></div>` : "";
  if (r.empty) return `<div class="fb neutral"><p class="h">${U.incomplete}</p></div>`;
  const mx = maxOf(it);
  if (r.pts === mx) return `<div class="fb ok"><p class="h">${s.first === mx && s.tries === 1 ? U.okFirst : s.first === mx ? U.ok : U.okLater}</p></div>`;
  const head = it.type === "grid" || it.type === "gap" || it.type === "match" ? U.rowsBad(r.bad) : U.notYet;
  return `<div class="fb bad"><p class="h">${head}</p>${r.msg ? `<p>${ty(r.msg)}</p>` : ""}</div>`;
}
function bindItem(el, it) {
  const s = st(it.id);
  const changed = (rerender, focusSel) => { s.checked = false; s.warn = false; save(); if (rerender) { renderItem(el, it); if (focusSel) { const n = el.querySelector(focusSel); if (n) n.focus(); } } else { $$(".is-ok,.is-bad", el).forEach(x => x.classList.remove("is-ok", "is-bad")); const f = $(".fbz", el); if (f) f.innerHTML = ""; } };
  if (it.type === "choice") $$(".opt", el).forEach(b => b.onclick = () => { s.v = +b.dataset.j; changed(true, `.opt[data-j="${b.dataset.j}"]`); });
  if (it.type === "num") { const i = $("input", el); i.addEventListener("input", () => { s.v = i.value; changed(false); }); i.addEventListener("keydown", e => { if (e.key === "Enter") $("[data-check]", el).click(); }); }
  if (it.type === "grid") $$("[data-c]", el).forEach(b => b.onclick = () => { s.v = Object.assign({}, s.v || {}); s.v[b.dataset.c] = +b.dataset.j; changed(true, `[data-c="${b.dataset.c}"][data-j="${b.dataset.j}"]`); });
  if (it.type === "crit") $$("[data-ci]", el).forEach(b => b.onclick = () => { const c = Object.assign({}, S.crit[it.id] || {}); c[b.dataset.ci] = !c[b.dataset.ci]; S.crit[it.id] = c; save(); renderItem(el, it); const n = el.querySelector(`[data-ci="${b.dataset.ci}"]`); if (n) n.focus(); tabs(); });
  if (it.type === "text") { const t = $("textarea", el); t.addEventListener("input", () => { S.txt[it.id] = t.value; save(); if (it.onInput) it.onInput(t.value, el); }); if (it.onInput) it.onInput(t.value, el); }
  if (it.type === "gap") bindGap(el, it, s, changed);
  if (it.type === "match") bindMatch(el, it, s, changed);
  const cb = $("[data-check]", el);
  if (cb) cb.onclick = () => {
    const r = evalItem(it);
    if (r.empty) { s.warn = true; s.checked = false; save(); $(".fbz", el).innerHTML = fbHTML(it, s, null); return; }
    s.checked = true; s.warn = false; s.tries = (s.tries || 0) + 1; if (s.first === undefined) s.first = r.pts;
    save(); renderItem(el, it); tabs(); updateStepScore();
    const f = $(".fbz", el); if (f && f.scrollIntoView) f.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
}
function mountItems(root) { $$("[data-it]", root).forEach(el => renderItem(el, ITEMS[el.dataset.it])); }
const I = id => `<div class="panel itempanel" data-it="${id}"></div>`;
const Iin = id => `<div data-it="${id}"></div>`;

/* ---------- documents ---------- */
const imgDoc = (key, cap, extra) => IMG[key] ? `<figure class="doc" style="margin:0"><figcaption class="dh"><span>${ty(cap)}</span></figcaption><div class="db"><img src="${IMG[key]}" alt="${esc(cap)}" style="width:100%;height:auto;border-radius:8px">${extra || ""}</div></figure>` : "";
const DOCSPECS = new Map(); let _dk = 0;
function chartDoc(title, spec, sim) { const k = "d" + (++_dk); DOCSPECS.set(k, spec); return `<figure class="doc" style="margin:0"><figcaption class="dh"><span>${ty(title)}</span>${sim ? `<span class="sim">⚠ ${ty(sim)}</span>` : ""}</figcaption><div class="db"><div class="chartbox" data-chart="${k}"></div></div></figure>`; }
function mountDocs(root) { $$("[data-chart]", root).forEach(el => { if (el.dataset.mounted) return; el.dataset.mounted = "1"; mountChart(el, DOCSPECS.get(el.dataset.chart)); }); }
const dec = v => fmt(v, 2);
function exaoSpec(pts) {
  return { type: "line", series: [{ name: C.exao.series, pts, color: "c1", w: 3 }], xMin: 0, xMax: 40, xStep: 5, yMin: 7.6, yMax: 10, yStep: 0.4, legend: false, table: false, xTickW: 2.4,
    bands: [{ x0: 10, x1: 20, label: "☀ " + C.exao.light }, { x0: 30, x1: 40, label: "☀ " + C.exao.light }],
    xTitle: C.exao.xTitle, yTitle: C.exao.yTitle, xRead: v => "t = " + fmt(v) + " min", yRead: v => dec(v) + " mg/L", yFmt: v => fmt(v, 1), readHint: U.chartHint, alt: C.exao.title, h: 15 };
}
const yeastSpec = () => ({ type: "line", series: [{ name: isEN ? "Glucose" : "Glucose", pts: e2.gluc, color: "c2" }], xMin: 0, xMax: 10, xStep: 1, yMin: 0, yMax: 16, yStep: 2, markers: true, legend: false, xTickW: 2,
  xTitle: isEN ? "Time (min)" : "Temps (min)", yTitle: isEN ? "Glucose (g/L)" : "Glucose (g/L)", xRead: v => "t = " + fmt(v) + " min", yRead: v => fmt(v) + " g/L", readHint: U.chartHint, h: 13 });

/* ---------- vues ---------- */
const VIEWS = isEN ? ["mission", "s1", "s2", "s3", "s4", "lab", "bilan"] : ["mission", "s1", "s2", "s3", "s4", "bilan"];
function tabs() {
  $("#tabs").innerHTML = VIEWS.map((v, i) => { let mark = ""; if (["s1", "s3", "s4", "lab"].includes(v)) { const [p, m] = stepScore(v); const done = Object.values(ITEMS).filter(it => it.step === v && maxOf(it)).every(it => S.it[it.id] && S.it[it.id].first !== undefined); mark = done ? ` <span class="dot" aria-label="${p}/${m}">✓</span>` : ""; } return `<button class="tab" type="button" data-v="${v}" ${v === S.view ? 'aria-current="page"' : ""}>${U.tabs[i]}${mark}</button>`; }).join("");
  $$("#tabs .tab").forEach(b => b.onclick = () => go(b.dataset.v));
}
function updateStepScore() { const el = $("#stepScore"); if (!el) return; const [p, m] = stepScore(S.view); el.textContent = `${U.score}${COL}${p}/${m}`; }
function navRow(v) { const i = VIEWS.indexOf(v); const p = VIEWS[i - 1], n = VIEWS[i + 1]; return `<div class="row navx">${p ? `<button class="btn ghost" type="button" data-go="${p}">${U.prev}</button>` : ""}${n ? `<button class="btn" type="button" data-go="${n}">${U.next}</button>` : ""}</div>`; }
function go(v, noScroll) {
  if (!VIEWS.includes(v)) v = "mission";
  stopSim(); S.view = v; save(); tabs();
  if (location.hash !== "#" + v) { try { history.replaceState(null, "", "#" + v); } catch (e) {} }
  const m = $("#main");
  ({ mission: vMission, s1: vS1, s2: vS2, s3: vS3, s4: vS4, lab: vLab, bilan: vBilan })[v](m);
  mountDocs(m); mountItems(m); updateStepScore();
  $$("[data-go]", m).forEach(b => b.onclick = () => go(b.dataset.go));
  if (!noScroll) window.scrollTo(0, 0);
  const cur = $("#tabs [aria-current]"); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest", inline: "center" });
}
const head = (kick, title, scored) => `<div class="vh"><div><p class="kicker">${ty(kick)}</p><h2 class="sec-title">${ty(title)}</h2></div>${scored ? `<span class="chip" id="stepScore"></span>` : ""}</div>`;
const clueCard = (c, icon) => `<div class="clue"><p class="ct">${icon} ${ty(c.title)}</p><p class="eq">${c.over ? `<span class="over">${ty(c.over)}</span>` : ""}${c.eq}</p><dl>${c.rows.map(r => `<dt>${ty(r[0])}</dt><dd>${ty(r[1])}</dd>`).join("")}</dl></div>`;

function vMission(m) {
  m.innerHTML = `<section class="view">${head(C.meta.activity.split(/[–-] /)[0].trim(), C.h.inv.replace(/^[^:]+: ?/, ""))}
    <div class="panel"><h3>🔍 ${ty(C.h.sit)}</h3>${C.situation.map(p => `<p>${ty(p)}</p>`).join("")}<p class="small muted"><b>${ty(C.h.clues)}</b></p><div class="clues">${clueCard(C.clues.ps, "🌿")}${clueCard(C.clues.rs, "🔥")}</div></div>
    <div class="panel"><h3>🎯 ${ty(C.h.mission)}</h3><div class="box key"><p class="lab">✔ ${ty(C.h.problem)}</p><p><b>${ty(C.problem)}</b></p></div><p><b>${ty(C.h.iq)}</b></p><ol class="ol">${C.invQ.map(q => `<li>${ty(q)}</li>`).join("")}</ol></div>
    <details class="panel"><summary><b>${ty(C.meta.objectivesTitle)}</b></summary><ul class="ol">${C.meta.objectives.map(o => `<li>${ty(o)}</li>`).join("")}</ul>${C.meta.capacities ? `<p class="small muted">${ty(C.meta.capacities)}</p>` : ""}</details>
    ${box("info", `<p>${ty(U.wordNote)}</p>`)}
    <div class="row navx"><button class="btn" type="button" data-go="s1">${U.missionGo}</button></div></section>`;
}
function vS1(m) {
  m.innerHTML = `<section class="view">${head(isEN ? "Step 1" : "Étape 1", C.h.s1.replace(/^[^:]+: ?/, ""), true)}<p class="lead">${ty(s1.before)}</p>
    <div class="clues">${clueCard(C.clues.ps, "🌿")}${clueCard(C.clues.rs, "🔥")}</div>
    <div class="panel"><h3>${ty(s1.a)}</h3>${Iin("s1a")}</div>
    <div class="panel"><h3>${ty(s1.b)}</h3>${box("key", `<p>${isEN ? "A prediction follows from a hypothesis: “<i>If</i> the cells only…, <i>then</i> we should observe…”." : "Une prédiction découle de l'hypothèse : « <i>si</i> les cellules ne font que…, <i>alors</i> on devrait observer… »."}</p>`, isEN ? "Method" : "Méthode")}${Iin("s1b")}</div>
    ${navRow("s1")}</section>`;
}
function timelineBar() {
  return `<div class="tl" role="img" aria-label="${esc(C.s2.alternance.map(a => a[0] + " " + a[1]).join(", "))}">${C.s2.alternance.map((a, i) => `<div class="tls ${i % 2 ? "on" : "off"}"><span class="tlt">${i % 2 ? "☀" : "☾"} ${ty(a[1])}</span><span class="tlm">${a[0]}</span></div>`).join("")}</div>`;
}
function vS2(m) {
  const P = C.s2;
  m.innerHTML = `<section class="view">${head(isEN ? "Step 2" : "Étape 2", C.h.s2.replace(/^[^:]+: ?/, ""))}
    <div class="panel"><h3>🧪 ${ty(P.equipTitle)}</h3><ul class="ol">${P.equipment.map(e => `<li>${ty(e)}</li>`).join("")}</ul></div>
    <div class="panel"><h3>💬 ${ty(P.groupTitle)}</h3><p class="small muted">${ty(U.groupNote)}</p>${P.groupQ.map((q, i) => Iin("g" + i)).join("")}
      ${S.proto ? "" : `<div class="row"><button class="btn" type="button" id="showProto">${U.showProto}</button></div>`}</div>
    <div id="proto" ${S.proto ? "" : "hidden"}>
      <div class="panel"><h3>${ty(P.protoTitle)}</h3><p class="small muted">${ty(U.tickHint)}</p><div class="crit ticks">${P.protocol.map((p, i) => `<button type="button" aria-pressed="${!!S.ticks[i]}" data-tk="${i}"><span class="bx">${S.ticks[i] ? "✓" : ""}</span><span><b>${i + 1}.</b> ${ty(p)}</span></button>`).join("")}</div>
        ${IMG.latis ? `<figure class="doc" style="margin:0"><figcaption class="dh"><span>LATIS BIO</span>${isEN ? `<span class="small">(yeah, this image is in French, don't tell anyone!)</span>` : ""}</figcaption><div class="db"><img src="${IMG.latis}" alt="LATIS BIO" style="max-width:min(100%,30rem);height:auto"></div></figure>` : ""}</div>
      <div class="panel"><h3>${ty(P.altTitle)}</h3>${timelineBar()}<ul class="ol">${P.alternance.map(a => `<li><b>${a[0]}</b>${COL}${ty(a[1])} ${ty(a[2])}</li>`).join("")}</ul></div>
      ${box("warn", `<ul class="ol">${P.vigilance.map(v => `<li>${ty(v)}</li>`).join("")}</ul>`)}
    </div>${navRow("s2")}</section>`;
  const sp = $("#showProto", m); if (sp) sp.onclick = () => { S.proto = true; save(); $("#proto").hidden = false; sp.remove(); $("#proto").scrollIntoView({ behavior: "smooth", block: "start" }); };
  $$("[data-tk]", m).forEach(b => b.onclick = () => { const i = b.dataset.tk; S.ticks[i] = !S.ticks[i]; save(); b.setAttribute("aria-pressed", !!S.ticks[i]); b.querySelector(".bx").textContent = S.ticks[i] ? "✓" : ""; });
}
function vS3(m) {
  m.innerHTML = `<section class="view">${head(isEN ? "Step 3" : "Étape 3", C.h.s3.replace(/^[^:]+: ?/, ""), true)}
    <div class="panel"><h3>${ty(e1.title)}</h3>${imgDoc("elodee", e1.doc)}<p class="small muted">🌿 ${ty(e1.link)}</p>
      <div class="part"><p class="pl">${ty(e1.a)}</p>${Iin("e1a")}</div>
      <div class="part"><p class="pl">${ty(e1.b)}</p>${Iin("e1b1")}${Iin("e1b2")}${Iin("e1bc")}</div>
      ${box("info", `<p>${ty(e1.note)}</p>`)}</div>
    <div class="panel"><h3>${ty(e2.title)}</h3><p>${ty(e2.ctx)}</p>
      ${chartDoc(e2.doc1, yeastSpec(), U.docRedrawn)}
      <div class="part"><p class="pl">${ty(e2.a)}</p><div class="nums">${Iin("e2a0")}${Iin("e2a10")}</div>${Iin("e2a")}${Iin("e2ac")}</div>
      ${imgDoc("levure", e2.doc2)}
      <div class="part"><p class="pl">${ty(e2.b)}</p>${Iin("e2b1")}${Iin("e2b2")}${Iin("e2bc")}</div></div>
    ${navRow("s3")}</section>`;
}

/* --- ExAO virtuelle --- */
let SIM = { t: 0, run: false, raf: 0, last: 0, ch: null };
function stopSim() { SIM.run = false; cancelAnimationFrame(SIM.raf); }
const lightAt = t => (t >= 10 && t < 20) || (t >= 30 && t < 40);
function simHTML() {
  return `<figure class="doc" style="margin:0"><figcaption class="dh"><span>📈 ${ty(C.exao.title)}</span><span class="sim">⚠ ${ty(C.exao.sim)}</span></figcaption><div class="db">
    <div class="exao"><div class="reactor" aria-hidden="true">${reactorSVG()}</div>
      <div class="exstat"><p><span class="muted">${C.exao.time}</span> <b class="num" id="exT">0,0 min</b></p><p><span class="muted">${C.exao.o2}</span> <b class="num" id="exO">—</b></p><p><span class="muted">${C.exao.lamp}</span> <b id="exL">☾ ${C.exao.off}</b></p>
      <div class="row"><button class="btn" type="button" id="exRun">${C.exao.run}</button><button class="btn ghost" type="button" id="exReset">${C.exao.reset}</button></div><p class="toast" id="exDone" aria-live="polite"></p></div></div>
    <div class="chartbox" id="exChart"></div>
    <details class="tbl"><summary>${C.exao.tableT}</summary><div class="tablewrap" id="exTab"></div></details></div></figure>`;
}
function reactorSVG() {
  const leaves = []; for (let i = 0; i < 9; i++) { const y = 150 - i * 12, side = i % 2 ? 1 : -1; leaves.push(`<ellipse cx="${60 + side * 9}" cy="${y}" rx="9" ry="3.2" transform="rotate(${side * -28} ${60 + side * 9} ${y})" style="fill:var(--c4)"/>`); }
  const bub = [0, 1, 2, 3, 4, 5].map(i => `<circle class="bub" cx="${52 + (i * 7) % 18}" cy="${140 - i * 15}" r="${1.6 + (i % 3) * 0.6}" style="animation-delay:${i * 0.35}s"/>`).join("");
  return `<svg viewBox="0 0 120 200" width="96" height="160"><rect x="20" y="30" width="80" height="150" rx="10" style="fill:var(--info-soft);stroke:var(--muted);stroke-width:2"/><rect x="22" y="44" width="76" height="134" rx="8" style="fill:var(--shade)"/>
    <line x1="60" y1="170" x2="60" y2="58" style="stroke:var(--c4);stroke-width:3"/>${leaves.join("")}<g id="bubs" class="off">${bub}</g>
    <rect x="86" y="18" width="6" height="110" rx="3" style="fill:var(--muted)"/><rect x="48" y="172" width="24" height="5" rx="2.5" style="fill:var(--ink)"/>
    <g id="lampG"><circle cx="104" cy="16" r="10" style="fill:var(--surface-2);stroke:var(--muted);stroke-width:2"/></g><rect id="cover" x="16" y="26" width="88" height="158" rx="12" style="fill:var(--ink);opacity:.55"/></svg>`;
}
function simPts() { return EXD.filter(p => p[0] <= SIM.t + 1e-9); }
function simPaint() {
  const pts = simPts(); const last = pts[pts.length - 1];
  if (SIM.ch) { SIM.ch.spec.series[0].pts = pts; SIM.ch.draw(); }
  const L = lightAt(Math.min(SIM.t, 39.99)) && SIM.t > 0;
  const tT = $("#exT"); if (!tT) return;
  tT.textContent = fmt(SIM.t, 1) + " min"; $("#exO").textContent = last ? dec(last[1]) + " mg/L" : "—";
  $("#exL").textContent = (L ? "☀ " : "☾ ") + (L ? C.exao.on : C.exao.off);
  $("#cover").style.opacity = L ? "0" : ".55"; $("#lampG circle").style.fill = L ? "var(--c5)" : "var(--surface-2)";
  $("#bubs").setAttribute("class", L && SIM.run ? "on" : "off");
  const rows = EXD.filter(p => Number.isInteger(p[0]) && p[0] <= SIM.t + 1e-9);
  $("#exTab").innerHTML = `<table class="t"><thead><tr><th>${C.exao.xTitle}</th><th>${isEN ? "Condition" : "Condition"}</th><th>${C.exao.yTitle}</th></tr></thead><tbody>${rows.map(p => `<tr><td class="n">${p[0]}</td><td>${p[0] === 40 ? "—" : lightAt(p[0]) ? "☀ " + C.exao.light : "☾ " + C.exao.dark}</td><td class="n">${dec(p[1])}</td></tr>`).join("")}</tbody></table>`;
  $("#exRun").textContent = SIM.run ? C.exao.pause : SIM.t > 0 && SIM.t < 40 ? C.exao.resume : C.exao.run;
  $("#exRun").disabled = SIM.t >= 40;
  $("#exDone").textContent = SIM.t >= 40 ? C.exao.done : "";
}
function simLoop(ts) {
  if (!SIM.run) return;
  const dt = SIM.last ? Math.min(0.25, (ts - SIM.last) / 1000) : 0; SIM.last = ts;
  SIM.t = Math.min(40, SIM.t + dt * 1.0); // 1 s = 1 min
  if (SIM.t >= 40) { SIM.run = false; S.simDone = true; save(); }
  simPaint(); if (SIM.run) SIM.raf = requestAnimationFrame(simLoop);
}
function mountSim(root) {
  SIM.t = S.simDone ? 40 : 0; SIM.run = false; SIM.last = 0;
  SIM.ch = mountChart($("#exChart", root), exaoSpec(simPts()));
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) $("#bubs").style.display = "none";
  $("#exRun").onclick = () => { if (SIM.run) { SIM.run = false; cancelAnimationFrame(SIM.raf); simPaint(); return; } if (SIM.t >= 40) return; SIM.run = true; SIM.last = 0; SIM.raf = requestAnimationFrame(simLoop); simPaint(); };
  $("#exReset").onclick = () => { stopSim(); SIM.t = 0; S.simDone = false; save(); simPaint(); };
  simPaint();
}
let photoURL = null;
function vS4(m) {
  m.innerHTML = `<section class="view">${head(isEN ? "Step 4" : "Étape 4", C.h.s4.replace(/^[^:]+: ?/, ""), true)}
    <div class="panel"><p class="q">${ty(U.srcQ)}</p><div class="seg" role="radiogroup">${[["mine", U.srcMine], ["sim", U.srcSim]].map(([k, l]) => `<button type="button" role="radio" data-src="${k}" aria-checked="${S.src === k}">${ty(l)}</button>`).join("")}</div>
      <div id="srcMine" ${S.src === "mine" ? "" : "hidden"}><p class="pl">${ty(s4.photo)}</p><label class="btn ghost" for="photo" style="width:max-content">${U.photoBtn}</label><input id="photo" type="file" accept="image/*" class="sr"><p class="small muted">${ty(U.photoNote)}</p><div id="photoPrev">${photoURL ? `<img src="${photoURL}" alt="${esc(U.photoCap)}" class="ph">` : `<p class="muted">${U.photoNone}</p>`}</div></div>
      <div id="srcSim" ${S.src === "sim" ? "" : "hidden"}>${simHTML()}</div></div>
    ${isEN ? box("info", `<p><b>Describing a curve:</b> “Between <i>0</i> and <i>10</i> minutes, the O₂ level <i>falls slowly</i> from <i>8.2</i> to <i>7.9</i> mg/L.” · “When the lamp is turned on, the O₂ level <i>rises quickly</i>…” · “The curve goes up / goes down / levels off.”</p>`, "Useful language") : ""}
    <div class="panel"><h3>${ty(s4.analysis)}</h3><p class="pl">${ty(s4.d)}</p><p>${ty(s4.dIntro)}</p><ul class="ol"><li>${ty(s4.dDark)}</li><li>${ty(s4.dLight)}</li></ul>${Iin("s4d")}
      <div class="part">${Iin("s4o")}</div></div>
    <div class="panel"><h3>${ty(s4.i)}</h3>${Iin("s4i")}</div>
    <div class="panel"><h3>${ty(s4.c)}</h3><p><i>${ty(s4.cQ2)}</i></p>${Iin("s4c")}${Iin("s4cc")}</div>
    <div class="panel"><h3>🎓 ${ty(C.h.more)}</h3><p class="pl">${ty(s4.bonus)}</p>${Iin("s4b")}</div>
    ${navRow("s4")}</section>`;
  $$("[data-src]", m).forEach(b => b.onclick = () => { S.src = b.dataset.src; save(); stopSim(); vS4(m); mountItems(m); updateStepScore(); $$("[data-go]", m).forEach(x => x.onclick = () => go(x.dataset.go)); if (S.src === "sim") mountSim(m); const nb = $(`[data-src="${S.src}"]`, m); if (nb) nb.focus(); });
  $("#photo", m).addEventListener("change", e => { const f = e.target.files && e.target.files[0]; if (!f) return; if (photoURL) URL.revokeObjectURL(photoURL); photoURL = URL.createObjectURL(f); $("#photoPrev", m).innerHTML = `<img src="${photoURL}" alt="${esc(U.photoCap)}" class="ph">`; });
  if (S.src === "sim") mountSim(m);
}

/* --- Language lab (DNL) --- */
function gapBlanks() { const out = []; C.dnl.gap.sentences.forEach(s => s.forEach(x => { if (typeof x === "number") out.push(x); })); return out; }
function gapHTML(s, checked) {
  const G = C.dnl.gap, v = s.v || {}, used = new Set(Object.values(v)); let bi = 0;
  const sent = G.sentences.map(sn => `<li>${sn.map(x => { if (typeof x !== "number") return esc(x); const i = bi++; const w = v[i]; const cls = checked && w !== undefined ? (w === x ? "is-ok" : "is-bad") : ""; return `<button type="button" class="blank ${cls} ${S.labA === i ? "act" : ""}" data-b="${i}" aria-label="Blank ${i + 1}${w !== undefined ? ": " + G.bank[w] : ""}">${w !== undefined ? (cls === "is-ok" ? "✓ " : cls === "is-bad" ? "✗ " : "") + G.bank[w] : "…"}</button>`; }).join("")}</li>`).join("");
  return `<ol class="ol gapl">${sent}</ol><div class="bank" role="group" aria-label="Word bank">${G.bank.map((w, j) => `<button type="button" class="wb" data-w="${j}" ${used.has(j) ? "disabled" : ""}>${w}</button>`).join("")}</div>`;
}
function bindGap(el, it, s, changed) {
  $$("[data-b]", el).forEach(b => b.onclick = () => { const i = +b.dataset.b; const v = Object.assign({}, s.v || {}); if (v[i] !== undefined) { delete v[i]; s.v = v; S.labA = i; changed(true, `[data-b="${i}"]`); return; } S.labA = S.labA === i ? null : i; save(); renderItem(el, it); const n = el.querySelector(`[data-b="${i}"]`); if (n) n.focus(); });
  $$("[data-w]", el).forEach(b => b.onclick = () => { const v = Object.assign({}, s.v || {}); let i = S.labA; const n = gapBlanks().length; if (i === null || i === undefined || v[i] !== undefined) { i = null; for (let k = 0; k < n; k++) if (v[k] === undefined) { i = k; break; } } if (i === null) return; v[i] = +b.dataset.w; s.v = v; let nx = null; for (let k = i + 1; k < n; k++) if (v[k] === undefined) { nx = k; break; } S.labA = nx; changed(true, nx !== null ? `[data-b="${nx}"]` : "[data-check]"); });
}
function matchOrder() { return shuffle(C.dnl.match.pairs.map((p, i) => i), 4242); }
function matchHTML(s, checked) {
  const P = C.dnl.match.pairs, v = s.v || {}, inv = {}; Object.entries(v).forEach(([en, f]) => inv[f] = +en);
  return `<div class="mcols"><div class="mcol">${P.map((p, i) => { const cls = checked && v[i] !== undefined ? (v[i] === i ? "is-ok" : "is-bad") : ""; return `<button type="button" class="mi ${cls} ${S.labA === "m" + i ? "act" : ""}" data-en="${i}"><span class="mn">${i + 1}</span><span>${p[0]}</span>${v[i] !== undefined ? `<span class="tag">→ ${"ABCDEFGH"[matchOrder().indexOf(v[i])]}</span>` : ""}</button>`; }).join("")}</div>
    <div class="mcol">${matchOrder().map((fi, k) => `<button type="button" class="mi" data-fr="${fi}"><span class="mn">${"ABCDEFGH"[k]}</span><span>${P[fi][1]}</span>${inv[fi] !== undefined ? `<span class="tag">← ${inv[fi] + 1}</span>` : ""}</button>`).join("")}</div></div>`;
}
function bindMatch(el, it, s, changed) {
  $$("[data-en]", el).forEach(b => b.onclick = () => { const i = +b.dataset.en; S.labA = "m" + i; save(); renderItem(el, it); const n = el.querySelector(`[data-en="${i}"]`); if (n) n.focus(); });
  $$("[data-fr]", el).forEach(b => b.onclick = () => { if (typeof S.labA !== "string" || !S.labA.startsWith("m")) return; const en = +S.labA.slice(1), fi = +b.dataset.fr; const v = Object.assign({}, s.v || {}); Object.keys(v).forEach(k => { if (v[k] === fi) delete v[k]; }); v[en] = fi; s.v = v; let nx = null; for (let k = 0; k < C.dnl.match.pairs.length; k++) if (v[k] === undefined) { nx = k; break; } S.labA = nx === null ? null : "m" + nx; changed(true, nx === null ? "[data-check]" : `[data-en="${nx}"]`); });
}
let TPS = { left: 120, run: false, iv: 0 };
function vLab(m) {
  const D = C.dnl;
  ITEMS.chal.onInput = (txt, el) => { const found = Array.from(new Set((txt.toLowerCase().match(/[a-z]+/g) || []).filter(w => D.challenge.forbidden.includes(w)))); let o = el.querySelector(".chk"); if (!o) { o = document.createElement("p"); o.className = "chk"; o.setAttribute("aria-live", "polite"); el.appendChild(o); } const n = (txt.match(/\S+/g) || []).length; o.innerHTML = !txt.trim() ? "" : found.length ? `<span class="pfb bad">✗ ${D.challenge.found} ${found.join(", ")}</span>` : `<span class="pfb ok">${D.challenge.clean}</span> <span class="muted">(${n} ${D.challenge.words})</span>`; };
  m.innerHTML = `<section class="view">${head("DNL · English", U.tabs[5], true)}
    <div class="panel"><h3>💬 ${D.tps.title}</h3><p class="small muted">${D.tps.lead}</p><ol class="ol">${D.tps.qs.map(q => `<li>“${q}”</li>`).join("")}</ol>
      <div class="row"><span class="score-big num" id="tpsT" style="font-size:1.8rem">2:00</span><button class="btn" type="button" id="tpsRun">${D.tps.start}</button><button class="btn ghost" type="button" id="tpsReset">${D.tps.restart}</button></div><p class="toast" id="tpsMsg" aria-live="polite"></p></div>
    <div class="panel"><h3>🧩 ${D.gap.title}</h3><p class="small muted">${D.gap.lead}</p>${Iin("gap")}</div>
    <div class="panel"><h3>🔗 ${D.match.title}</h3><p class="small muted">${D.match.lead}</p>${Iin("match")}</div>
    <div class="panel"><h3>📈 ${D.challenge.title}</h3>${chartDoc(C.exao.title, exaoSpec(EXD), C.exao.sim)}<p>${D.challenge.lead} <b>${D.challenge.banned.join(", ")}</b>.</p><p class="small muted">${D.challenge.alt}</p>${Iin("chal")}</div>
    <div class="panel"><h3>✅ ${D.quiz.title}</h3>${D.quiz.qs.map((q, i) => `<div class="part">${Iin("qz" + i)}</div>`).join("")}</div>
    <div class="panel"><h3>🎟 ${D.exit.title}</h3><p class="small muted">${D.exit.lead}</p>${D.exit.starters.map((q, i) => Iin("ex" + i)).join("")}<h3 style="margin-top:.6rem">⏱ ${D.minute.title}</h3>${Iin("min")}</div>
    <div class="panel"><h3>📚 ${D.glossary.title}</h3><input class="inp wide" id="gq" type="search" placeholder="Search… / Rechercher…" aria-label="Search the glossary"><div class="tablewrap"><table class="t glo"><thead><tr><th>Français</th><th>English</th><th>IPA</th><th>Example in context</th></tr></thead><tbody id="gbody"></tbody></table></div></div>
    <div class="panel"><h3>⚠ ${D.mistakes.title}</h3><p class="pl">False friends · Faux amis</p><div class="tablewrap"><table class="t"><thead><tr><th>French</th><th>≠ English</th><th>Correct translation</th></tr></thead><tbody>${D.mistakes.falseFriends.map(r => `<tr><td>${r[0]}</td><td>≠ ${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table></div>
      <p class="pl">Common grammatical errors</p><ul class="ol">${D.mistakes.grammar.map(g => `<li><span class="pfb bad">✗ “${g[0]}”</span> → <span class="pfb ok">✓ “${g[1]}”</span></li>`).join("")}</ul>
      <p class="pl">Pronunciation tips</p><ul class="ol">${D.mistakes.pron.map(p => `<li><b>${p[0]}</b>: ${p[1]}</li>`).join("")}</ul></div>
    <details class="panel"><summary><b>🌍 ${D.culture.title}</b></summary><p class="pl">Historical context</p><ul class="ol">${D.culture.hist.map(h => `<li><b>${h[0]}</b>: ${h[1]}</li>`).join("")}</ul><p class="pl">Modern applications</p><ul class="ol">${D.culture.modern.map(h => `<li><b>${h[0]}</b>: ${h[1]}</li>`).join("")}</ul><p class="pl">English-speaking scientists</p><ul class="ol">${D.culture.sci.map(h => `<li><b>${h[0]}</b>: ${h[1]}</li>`).join("")}</ul></details>
    ${box("key", `<p>${D.remember}</p>`, "Remember")}
    ${navRow("lab")}</section>`;
  const canSpeak = "speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function";
  const drawG = q => { const k = (q || "").toLowerCase(); $("#gbody", m).innerHTML = D.glossary.items.filter(r => !k || r.join(" ").toLowerCase().includes(k)).map(r => `<tr><td>${r[0]}</td><td><b>${r[1]}</b>${canSpeak ? ` <button type="button" class="say" data-say="${esc(r[1].replace(/\(.*?\)/g, ""))}" aria-label="Listen: ${esc(r[1])}">🔊</button>` : ""}</td><td>${r[2]}</td><td>“${r[3]}”${canSpeak ? ` <button type="button" class="say" data-say="${esc(r[3])}" aria-label="Listen to the example">🔊</button>` : ""}</td></tr>`).join(""); $$("[data-say]", m).forEach(b => b.onclick = () => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(b.dataset.say); u.lang = "en-GB"; u.rate = 0.9; speechSynthesis.speak(u); } catch (e) {} }); };
  drawG(""); $("#gq", m).addEventListener("input", e => drawG(e.target.value));
  const paint = () => { const t = $("#tpsT"); if (!t) return; t.textContent = Math.floor(TPS.left / 60) + ":" + String(TPS.left % 60).padStart(2, "0"); $("#tpsRun").textContent = TPS.run ? D.tps.stop : D.tps.start; };
  $("#tpsRun", m).onclick = () => { if (TPS.run) { clearInterval(TPS.iv); TPS.run = false; paint(); return; } if (TPS.left <= 0) TPS.left = 120; TPS.run = true; $("#tpsMsg").textContent = ""; TPS.iv = setInterval(() => { TPS.left--; if (TPS.left <= 0) { TPS.left = 0; clearInterval(TPS.iv); TPS.run = false; const mm = $("#tpsMsg"); if (mm) mm.textContent = D.tps.end; } paint(); }, 1000); paint(); };
  $("#tpsReset", m).onclick = () => { clearInterval(TPS.iv); TPS.run = false; TPS.left = 120; $("#tpsMsg").textContent = ""; paint(); };
  paint();
}

/* --- bilan --- */
function scoredSteps() { return VIEWS.filter(v => ["s1", "s3", "s4", "lab"].includes(v)); }
function stepName(v) { return U.tabs[VIEWS.indexOf(v)]; }
function bilanText(name) {
  let t = `${U.exportTitle}\n${U.eleve}${COL}${name || "—"}\n${U.date}${COL}${today()}\n${U.firstTry}\n\n`; let P = 0, M = 0;
  scoredSteps().forEach(v => { const [p, m] = stepScore(v); const [a, b] = stepCrit(v); P += p; M += m; t += `${stepName(v)}${COL}${p}/${m}${b ? ` · ${U.colCrit} ${a}/${b}` : ""}\n`; });
  t += `\n${U.total}${COL}${P}/${M}\n`;
  const g = C.s2.groupQ.map((q, i) => S.txt["g" + i] ? `- ${q}\n  ${S.txt["g" + i]}` : "").filter(Boolean); if (g.length) t += `\n${U.groupAns}\n${g.join("\n")}\n`;
  if (isEN) { const ex = C.dnl.exit.starters.map((q, i) => S.txt["ex" + i] ? `- ${S.txt["ex" + i]}` : "").filter(Boolean); if (ex.length) t += `\n${U.exitAns}\n${ex.join("\n")}\n`; if (S.txt.min) t += `\n${U.minuteAns}\n${S.txt.min}\n`; if (S.txt.chal) t += `\n${U.challengeAns}\n${S.txt.chal}\n`; }
  return t;
}
function vBilan(m) {
  let P = 0, M = 0; const rows = scoredSteps().map(v => { const [p, mm] = stepScore(v); const [a, b] = stepCrit(v); P += p; M += mm; return `<tr><td>${stepName(v)}</td><td class="n">${p}/${mm}</td><td class="n">${b ? a + "/" + b : U.none}</td></tr>`; }).join("");
  m.innerHTML = `<section class="view">${head(U.bilanT, U.bilanT)}<p class="lead">${ty(U.bilanLead)}</p>
    <div class="panel"><p class="score-big">${P}/${M}</p><div class="bar" aria-hidden="true"><i style="width:${M ? P / M * 100 : 0}%"></i></div></div>
    <div class="tablewrap"><table class="t"><thead><tr><th>${U.colStep}</th><th>${U.colScore}</th><th>${U.colCrit}</th></tr></thead><tbody>${rows}</tbody></table></div>
    <div class="panel"><h3>${U.transmit}</h3><div id="bt"></div></div>
    <div class="panel"><h3>${U.reset}</h3><p class="lead">${ty(U.resetLead)}</p><div class="row"><button class="btn ghost" type="button" id="reset">${U.reset}</button></div></div></section>`;
  renderBilanTools($("#bt", m), bilanText, name => `<p class="kicker">${U.showTitle}</p><h2>${esc(name || U.eleve)}</h2><p>${ty(C.meta.title)} · ${today()}</p>${scoredSteps().map(v => { const [p, mm] = stepScore(v); return `<div class="line"><span>${stepName(v)}</span><b class="num">${p}/${mm}</b></div>`; }).join("")}<div class="line"><span><b>${U.total}</b></span><b class="num">${P}/${M}</b></div>`, isEN ? "elodea-lab" : "tp-elodee");
  armButton($("#reset", m), U.reset, U.resetC, () => { Object.assign(S, { it: {}, crit: {}, txt: {}, ticks: {}, proto: false, simDone: false, labA: null }); save(); go("mission"); });
}

/* ---------- démarrage ---------- */
Display.init(S, save);
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && h !== S.view && VIEWS.includes(h)) go(h); });
go(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : (S.view || "mission"), true);
