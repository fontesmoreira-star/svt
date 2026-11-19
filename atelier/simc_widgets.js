/* ===== Terminale ES · Thème 1 · 1.3 Le climat du futur · Activité 1.1 : simulateur climatique (inspiré du logiciel SimClimat) ===== */
Store.key = "tes-climat-futur-simulateur-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const N1 = x => (+x).toFixed(1);
const sX = (x, y, txt, a, size, extra) => { extra = extra || ""; const m = extra.match(/style="([^"]*)"/); return `<text x="${N1(x)}" y="${N1(y)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${N1(size)}px;${m ? m[1] : ""}" ${extra.replace(/style="[^"]*"/, "")}>${esc(txt)}</text>`; };

/* ---------- le modèle : cycle du carbone (réponse impulsionnelle), effet de serre, deux couches d'océan, niveau des mers ----------
   Pas de temps : 1 an. Départ : 2007, état obtenu en faisant tourner le modèle depuis 1850 avec des émissions historiques simplifiées. */
const MOD = { y0: 2007, TPI: 13.7, C0: 280, PPM: 2.12, A: [0.2173, 0.224, 0.2824, 0.2763], TAU: [1e9, 394.4, 36.54, 4.304],
  HIST: [[1850, 0.65], [1900, 1.2], [1930, 1.9], [1950, 2.9], [1970, 5.3], [1990, 7.5], [2000, 8.1], [2007, 9.2]], HF: 0.735,
  LAM: { pl: 3.2, wv: 1.5, alb: 0.4, oth: 0.1 }, Cm: 8, Cd: 100, G: 0.7, SL: 0.34, KC: 0.7, F2X: 3.71 };
const FULL = { wv: true, alb: true, carb: true };
const lamOf = fb => MOD.LAM.pl - (fb.wv ? MOD.LAM.wv : 0) - (fb.alb ? MOD.LAM.alb : 0) - MOD.LAM.oth;
const histE = y => { const H = MOD.HIST; for (let i = 1; i < H.length; i++) if (y <= H[i][0]) { const [a, ea] = H[i - 1], [b, eb] = H[i]; return (ea + (eb - ea) * (y - a) / (b - a)) * MOD.HF; } return 0; };
function cstep(s, E, carb, l0, lc) {
  const slow = 1 + MOD.KC * Math.max(0, carb ? s.T : s.T07);
  for (let i = 0; i < 4; i++) s.b[i] = s.b[i] * Math.exp(-1 / (MOD.TAU[i] * slow)) + MOD.A[i] * E;
  s.C = MOD.C0 + s.b.reduce((a, b) => a + b, 0) / MOD.PPM;
  const F = 5.35 * Math.log(s.C / MOD.C0);
  const dT = (F - l0 * s.T07 - lc * (s.T - s.T07) - MOD.G * (s.T - s.Td)) / MOD.Cm;
  s.Td += MOD.G * (s.T - s.Td) / MOD.Cd; s.T += dT; s.H += MOD.SL * s.T;
}
let BASE = null;
function base() {
  if (BASE) return BASE;
  const s = { b: [0, 0, 0, 0], T: 0, Td: 0, H: 0, T07: 0, C: MOD.C0 }, l = lamOf(FULL);
  for (let y = 1850; y < MOD.y0; y++) { s.T07 = s.T; cstep(s, histE(y), true, l, l); }
  s.T07 = s.T; s.H = 0; BASE = JSON.stringify(s); return BASE;
}
const fbKey = fb => (fb.wv ? "1" : "0") + (fb.alb ? "1" : "0") + (fb.carb ? "1" : "0");
const CACHE = {};
/* run(E, dur, fb, ecs) → { C: [], T: [], H: [] } indexés par année depuis 2007 ; ecs : sensibilité climatique imposée (fourchette) */
function run(E, dur, fb, ecs) {
  fb = fb || FULL; dur = dur || 100; const key = [E, dur, fbKey(fb), ecs || 0].join("|"); if (CACHE[key]) return CACHE[key];
  const s = JSON.parse(base()), l0 = lamOf(FULL), lc = ecs ? MOD.F2X / ecs : lamOf(fb), o = { C: [s.C], T: [MOD.TPI + s.T], H: [0] };
  for (let k = 1; k <= dur; k++) { cstep(s, E, fb.carb, l0, lc); o.C.push(s.C); o.T.push(MOD.TPI + s.T); o.H.push(s.H); }
  return (CACHE[key] = o);
}
const val = (E, q, year, fb, dur) => run(E, dur || 100, fb || FULL)[q][(year || 2107) - MOD.y0];
const r1 = x => Math.round(x * 10) / 10;

/* ---------- grandeurs affichées ---------- */
const QTY = {
  T: { lab: "Température", long: "Température moyenne à la surface du globe", unit: "°C", dec: 1, ax: "Température (°C)", lo: 14, hi: 17, step: 0.5 },
  C: { lab: "CO₂", long: "Concentration en CO₂ de l'atmosphère", unit: "ppm", dec: 0, ax: "CO₂ (ppm)", lo: 300, hi: 700, step: 100 },
  H: { lab: "Niveau des mers", long: "Élévation du niveau moyen des mers depuis 2007", unit: "cm", dec: 0, ax: "Élévation (cm)", lo: 0, hi: 80, step: 20 } };
const fq = (q, v) => fmt(v, QTY[q].dec) + " " + QTY[q].unit;
const EMI = [["0", "Nulles", 0], ["8", "Comme aujourd'hui", 8], ["16", "Deux fois plus", 16], ["o", "Autre", null]];
const FBL = { wv: "Vapeur d'eau", alb: "Glaces et albédo", carb: "Puits de carbone (océan, végétation)" };
const FBS = { wv: "vapeur d'eau", alb: "glaces", carb: "puits de carbone" };
const MAXSIM = 10;
function fbTxt(fb) { const off = Object.keys(FBL).filter(k => !fb[k]); return off.length ? "sans " + off.map(k => FBS[k]).join(", sans ") : "toutes les rétroactions"; }
function autoName(E, fb, dur) { const e = E === 0 ? "Nulles" : E === 8 ? "Comme aujourd'hui" : E === 16 ? "Deux fois plus" : "Autre " + fmt(E) + " GtC/an"; const off = Object.keys(FBL).filter(k => !fb[k]); return e + (off.length ? " · sans " + off.map(k => FBS[k]).join(", ") : "") + (dur !== 100 ? " · " + dur + " ans" : ""); }
function sims() { const x = xst(); if (!Array.isArray(x.sims)) x.sims = []; return x.sims; }
function ui() { const x = xst(); if (!x.ui || typeof x.ui !== "object") x.ui = {}; const u = x.ui; if (![50, 100, 200].includes(u.dur)) u.dur = 100; if (!EMI.some(e => e[0] === u.emi)) u.emi = "8"; if (!Number.isFinite(u.other)) u.other = 4; if (!u.fb || typeof u.fb !== "object") u.fb = Object.assign({}, FULL); if (!QTY[u.q]) u.q = "T"; return u; }
const curE = u => u.emi === "o" ? u.other : +u.emi;
/* manipulations attendues par les étapes */
const hasSim = (E, mask, dur) => sims().some(s => Math.abs(s.E - E) < 1e-9 && fbKey(s.fb) === (mask || "111") && s.dur >= (dur || 100));
const otherSims = () => sims().filter(s => ![0, 8, 16].includes(s.E) && fbKey(s.fb) === "111" && s.dur >= 100);
const stabSim = () => otherSims().find(s => Math.abs(val(s.E, "C") - val(s.E, "C", 2007)) <= 6);
const tick = ok => ok ? "✓" : "○";
function axisRange(q, list, extra) {
  const Q = QTY[q]; let lo = Q.lo, hi = Q.hi;
  list.forEach(s => s.v.forEach(v => { if (v < lo) lo = v; if (v > hi) hi = v; })); (extra || []).forEach(v => { if (v < lo) lo = v; if (v > hi) hi = v; });
  let st = Q.step; while ((hi - lo) / st > 8) st *= 2;
  return { lo: Math.floor(lo / st - 1e-9) * st, hi: Math.ceil(hi / st + 1e-9) * st, st };
}
const DASHS = ["", "8 5", "2 5", "12 4 3 4", "", "8 5", "2 5", "12 4 3 4"];
const colOf = i => "c" + ((i % 6) + 1);
function swatchL(i) { return `<svg width="34" height="12" aria-hidden="true" style="flex:none"><path d="M2 6 H32" style="stroke:var(--${colOf(i)});stroke-width:3.4;fill:none;stroke-linecap:round" stroke-dasharray="${DASHS[i % 8]}"/></svg>`; }

/* ---------- graphique commun (une grandeur, plusieurs courbes superposées, curseur d'année) ---------- */
function plotSVG(W, F, o) {
  const tk = TK(F), H = Math.round(Math.min(Math.max(W * 0.6, F * 13), F * 20)), L = F * 3.7, R = F * 1.1, T = F * 0.9, B = F * 3.2, pw = W - L - R, ph = H - T - B;
  const x0 = MOD.y0, x1 = MOD.y0 + o.span, ax = axisRange(o.q, o.series, o.extra), X = y => L + (y - x0) / (x1 - x0) * pw, Y = v => T + ph - (v - ax.lo) / (ax.hi - ax.lo) * ph;
  let g = "";
  (o.bands || []).forEach(b => { const up = b.hi.map((v, k) => `${N1(X(x0 + k))},${N1(Y(v))}`), dn = b.lo.map((v, k) => `${N1(X(x0 + k))},${N1(Y(v))}`).reverse(); const n = o.cut === undefined ? up.length : Math.max(1, Math.floor(o.cut - x0) + 1); g += `<polygon points="${up.slice(0, n).concat(dn.slice(dn.length - n)).join(" ")}" style="fill:var(--${b.color});opacity:.18"/>`; });
  const xs = [10, 20, 25, 50, 100, 200].filter(d => o.span % d === 0).find(d => pw / (o.span / d) >= F * 3.4) || o.span;
  for (let y = x0; y <= x1 + 1e-9; y += xs) g += `<line x1="${N1(X(y))}" x2="${N1(X(y))}" y1="${N1(T)}" y2="${N1(T + ph)}" style="stroke:var(--grid)"/>` + sX(X(y), T + ph + tk * 1.35, String(y), "middle", tk);
  for (let v = ax.lo; v <= ax.hi + 1e-9; v += ax.st) g += `<line x1="${N1(L)}" x2="${N1(L + pw)}" y1="${N1(Y(v))}" y2="${N1(Y(v))}" style="stroke:var(--grid)"/>` + sX(L - 6, Y(v) + tk * 0.35, fmt(Math.round(v * 100) / 100), "end", tk);
  (o.hlines || []).forEach(h => { g += `<line x1="${N1(L)}" x2="${N1(L + pw)}" y1="${N1(Y(h.v))}" y2="${N1(Y(h.v))}" style="stroke:var(--muted);stroke-width:1.6" stroke-dasharray="6 5"/>` + sX(L + 6, Y(h.v) - 6, h.lab, "start", tk * 0.92, `font-weight="700"`); });
  o.series.forEach(s => {
    const n = s.cut === undefined ? s.v.length : Math.max(1, Math.min(s.v.length, Math.floor(s.cut - x0) + 1)); if (!n) return;
    const d = s.v.slice(0, n).map((v, k) => (k ? "L" : "M") + N1(X(x0 + k)) + "," + N1(Y(v))).join(" ");
    g += `<path d="${d}" style="fill:none;stroke:var(--${s.color});stroke-width:${s.w || 3.2};stroke-linejoin:round;stroke-linecap:round" stroke-dasharray="${s.dash || ""}"/>`;
    if (s.cut !== undefined && n < s.v.length) g += `<circle cx="${N1(X(x0 + n - 1))}" cy="${N1(Y(s.v[n - 1]))}" r="${N1(F * 0.28)}" style="fill:var(--${s.color});stroke:var(--surface);stroke-width:2"/>`;
  });
  if (o.sel !== undefined && o.sel !== null) {
    g += `<line x1="${N1(X(o.sel))}" x2="${N1(X(o.sel))}" y1="${N1(T)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5" stroke-dasharray="3 3"/>`;
    o.series.forEach(s => { const k = o.sel - x0, n = s.cut === undefined ? s.v.length : Math.floor(s.cut - x0) + 1; if (k < s.v.length && k < n) g += `<circle cx="${N1(X(o.sel))}" cy="${N1(Y(s.v[k]))}" r="${N1(F * 0.3)}" style="fill:var(--surface);stroke:var(--${s.color});stroke-width:3"/>`; });
  }
  g += `<line x1="${N1(L)}" x2="${N1(L + pw)}" y1="${N1(T + ph)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${N1(L)}" x2="${N1(L)}" y1="${N1(T)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5"/>`;
  g += sX(L + pw / 2, H - F * 0.35, "Année", "middle", Math.max(16, F * 0.82), `font-weight="700"`);
  g += `<text transform="translate(${N1(F * 0.95)},${N1(T + ph / 2)}) rotate(-90)" text-anchor="middle" style="fill:var(--ink);font-size:${N1(Math.max(16, F * 0.82))}px;font-weight:700">${esc(QTY[o.q].ax)}</text>`;
  o.geo = { L, pw, x0, x1 };
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(QTY[o.q].long)} de ${x0} à ${x1}">${g}</svg>`;
}
const yearAt = (o, host, ev) => { const svg = host.querySelector("svg"); if (!svg || !o.geo) return null; const r = svg.getBoundingClientRect(), sx = (ev.clientX - r.left) * (svg.viewBox.baseVal.width / r.width); return Math.max(o.geo.x0, Math.min(o.geo.x1, Math.round(o.geo.x0 + (sx - o.geo.L) / o.geo.pw * (o.geo.x1 - o.geo.x0)))); };

/* ---------- le simulateur ---------- */
WID.sim = el => {
  const u = ui(); let anim = null, nameDirty = false, msg = "";
  const P = { q: u.q, sel: null, span: 100, series: [] };
  el.innerHTML = `<div class="simc">
    <div class="simp" role="group" aria-label="Paramètres de la simulation">
      <p class="simh">1 · Je règle la simulation</p>
      <div class="field"><label for="simName">Nom de la simulation</label><input id="simName" class="inp wide" maxlength="60" autocomplete="off" style="max-width:none"></div>
      <div class="field"><span class="plab" id="durL">Départ : ${MOD.y0} (état observé) · Durée</span><div class="seg" role="group" aria-labelledby="durL">${[50, 100, 200].map(d => `<button type="button" data-dur="${d}">${d} ans</button>`).join("")}</div></div>
      <div class="field"><span class="plab" id="emiL">Émissions humaines de CO₂, en GtC par an (gigatonnes de carbone)</span><div class="seg" role="group" aria-labelledby="emiL">${EMI.map(e => `<button type="button" data-emi="${e[0]}">${e[1]}${e[2] !== null ? ` · ${e[2]}` : "…"}</button>`).join("")}</div></div>
      <div class="field" data-other><label>Autre valeur : <b data-ev></b> GtC/an<input type="range" min="0" max="30" step="0.5" data-or aria-label="Émissions en gigatonnes de carbone par an, de 0 à 30"></label><div class="row">${[-1, -0.5, 0.5, 1].map(d => `<button type="button" class="btn ghost sm" data-od="${d}">${d > 0 ? "+" : "−"}${fmt(Math.abs(d))}</button>`).join("")}</div></div>
      <details class="fbx" data-fbx><summary>Options du modèle : rétroactions prises en compte</summary><p class="lead">Par défaut, le modèle tient compte des trois rétroactions. Touche une rétroaction pour l'activer ou la désactiver.</p><div class="seg" role="group" aria-label="Rétroactions">${Object.keys(FBL).map(k => `<button type="button" data-fb="${k}"></button>`).join("")}</div></details>
      <div class="row"><button type="button" class="btn" data-run>▶ Lancer la simulation</button></div>
      <p class="lead" data-msg aria-live="polite"></p>
    </div>
    <div class="simr">
      <p class="simh">2 · J'observe les résultats</p>
      <div class="seg" role="group" aria-label="Grandeur affichée">${Object.keys(QTY).map(q => `<button type="button" data-q="${q}">${q === "T" ? "🌡 " : q === "C" ? "☁ " : "🌊 "}${QTY[q].lab}</button>`).join("")}</div>
      <p class="qlong" data-ql></p>
      <div class="figbox chartbox" data-fig></div>
      <div class="row animctl" data-ctl></div>
      <ul class="simleg" data-leg></ul>
      <div class="field" data-yr><label>Lire une année : <b data-yv></b><input type="range" min="${MOD.y0}" max="${MOD.y0 + 100}" step="1" data-ys aria-label="Année à lire"></label></div>
      <p class="readout" data-ro aria-live="polite"></p>
      <div data-tab></div>
      <div class="row"><button type="button" class="btn ghost" data-clear>Effacer toutes les simulations</button></div>
    </div></div>`;
  const nameI = $("#simName", el), fig = $("[data-fig]", el);
  const series = () => sims().map((s, i) => ({ s, i, color: colOf(s.col), dash: DASHS[s.col % 8], v: run(s.E, s.dur, s.fb)[P.q], cut: anim && anim.id === s.id ? anim.cut : undefined }));
  const chart = liveSVG(fig, (W, F) => { P.series = series(); P.span = Math.max(100, ...sims().map(s => s.dur)); return plotSVG(W, F, P); });
  fig.addEventListener("pointerdown", ev => { const y = yearAt(P, fig, ev); if (y !== null) { P.sel = y; paintRead(true); } });
  function paintParams() {
    $$("[data-dur]", el).forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.dur === u.dur)));
    $$("[data-emi]", el).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.emi === u.emi)));
    $("[data-other]", el).hidden = u.emi !== "o"; $("[data-ev]", el).textContent = fmt(u.other); $("[data-or]", el).value = u.other;
    $$("[data-fb]", el).forEach(b => { const on = !!u.fb[b.dataset.fb]; b.setAttribute("aria-pressed", String(on)); b.textContent = (on ? "✓ " : "✗ ") + FBL[b.dataset.fb] + (on ? " : activée" : " : désactivée"); });
    if (!nameDirty) nameI.value = autoName(curE(u), u.fb, u.dur);
  }
  function paintRead(fromTap) {
    const span = Math.max(100, ...sims().map(s => s.dur)), ys = $("[data-ys]", el);
    if (P.sel === null || P.sel > MOD.y0 + span) P.sel = MOD.y0 + Math.min(100, span);
    ys.max = MOD.y0 + span; ys.value = P.sel; $("[data-yv]", el).textContent = P.sel;
    const L = sims(); $("[data-ro]", el).innerHTML = L.length ? `En <b>${P.sel}</b> : ` + L.map(s => { const k = P.sel - MOD.y0, r = run(s.E, s.dur, s.fb)[P.q]; return `${esc(s.name)} → <b>${k < r.length ? fq(P.q, r[k]) : "—"}</b>`; }).join(" · ") : "Lance une simulation : les courbes s'affichent ici.";
    chart.draw();
  }
  function paintRes() {
    $$("[data-q]", el).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.q === P.q)));
    $("[data-ql]", el).innerHTML = `${QTY[P.q].long} (${QTY[P.q].unit}) · <span class="sim">⚠ ${SIMUL}</span>`;
    const L = sims(), span = Math.max(100, ...L.map(s => s.dur));
    $("[data-leg]", el).innerHTML = L.map(s => `<li>${swatchL(s.col)}<span class="sn"><b>${esc(s.name)}</b><span class="muted"> · ${fmt(s.E)} GtC/an · ${s.dur} ans · ${fbTxt(s.fb)}</span></span><button type="button" class="btn ghost sm" data-del="${s.id}" aria-label="Retirer la simulation ${esc(s.name)}">✕</button></li>`).join("");
    const cw = el.clientWidth || 600, cols = (cw < 330 ? [0, 1] : cw < 560 ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1]).map(f => MOD.y0 + Math.round(span * f));
    $("[data-tab]", el).innerHTML = L.length ? `<div class="tablewrap"><table class="t simtab"><caption>${esc(QTY[P.q].long)} (${QTY[P.q].unit}) · ⚠ ${SIMUL}</caption><thead><tr><th>Simulation</th>${cols.map(c => `<th class="n">${c}</th>`).join("")}</tr></thead><tbody>${L.map(s => { const r = run(s.E, s.dur, s.fb)[P.q]; return `<tr><td>${swatchL(s.col)} ${esc(s.name)}</td>${cols.map(c => `<td class="n">${c - MOD.y0 < r.length ? fmt(r[c - MOD.y0], QTY[P.q].dec) : "—"}</td>`).join("")}</tr>`; }).join("")}</tbody></table></div>` : "";
    $("[data-yr]", el).hidden = !L.length;
    $("[data-clear]", el).parentNode.hidden = !L.length;
    const ctl = $("[data-ctl]", el);
    ctl.innerHTML = L.length ? `<button type="button" class="btn ghost" data-pause>${anim && anim.playing ? CT.animPause : anim && anim.cut < anim.end ? CT.animResume : CT.animRun}</button><button type="button" class="btn ghost" data-replay>${CT.animReset}</button><span class="lead">${anim ? "Courbe de « " + esc((L.find(s => s.id === anim.id) || {}).name || "") + " »" : "Rejouer la dernière simulation"}</span>` : "";
    if (L.length) {
      $("[data-pause]", ctl).onclick = () => { if (!anim) return replay(); if (anim.playing) { anim.playing = false; paintRes(); } else { if (anim.cut >= anim.end) anim.cut = MOD.y0; play(); } };
      $("[data-replay]", ctl).onclick = () => replay();
    }
    $$("[data-del]", el).forEach(b => b.onclick = () => { const x = xst(); x.sims = sims().filter(s => s.id !== +b.dataset.del); if (anim && anim.id === +b.dataset.del) anim = null; keep(); paintRes(); const n = $("[data-del]", el) || $("[data-run]", el); n.focus(); });
    paintRead();
  }
  function play() {
    anim.playing = true; let lt = 0; paintRes();
    const fr = ts => { if (!anim || !anim.playing) return; if (!document.body.contains(el)) { anim.playing = false; return; } const dt = lt ? Math.min(100, ts - lt) : 0; lt = ts; anim.cut = Math.min(anim.end, anim.cut + (anim.end - MOD.y0) * dt / 3500); chart.draw(); if (anim.cut >= anim.end) { anim.playing = false; paintRes(); return; } requestAnimationFrame(fr); };
    requestAnimationFrame(fr);
  }
  function replay() { const L = sims(); if (!L.length) return; const s = anim ? L.find(x => x.id === anim.id) || L[L.length - 1] : L[L.length - 1]; anim = { id: s.id, cut: MOD.y0, end: MOD.y0 + s.dur, playing: false }; play(); }
  function launch() {
    const E = curE(u), fb = Object.assign({}, u.fb), L = sims();
    const same = L.find(s => Math.abs(s.E - E) < 1e-9 && s.dur === u.dur && fbKey(s.fb) === fbKey(fb));
    if (same) { msg = `Cette simulation existe déjà (« ${esc(same.name)} ») : elle est rejouée.`; anim = { id: same.id, cut: MOD.y0, end: MOD.y0 + same.dur, playing: false }; }
    else {
      if (L.length >= MAXSIM) { $("[data-msg]", el).innerHTML = `${MAXSIM} simulations au maximum : retire une simulation (✕) avant d'en lancer une autre.`; return; }
      const x = xst(), used = L.map(s => s.col % 6); let col = 0; while (used.includes(col) && col < 6) col++; if (col >= 6) col = L.length;
      x.nid = (x.nid || 0) + 1; const name = (nameI.value || "").trim() || autoName(E, fb, u.dur);
      const s = { id: x.nid, name: name.slice(0, 60), E, dur: u.dur, fb, col }; L.push(s); x.sims = L; keep();
      msg = `Simulation « ${esc(s.name)} » lancée.`; anim = { id: s.id, cut: MOD.y0, end: MOD.y0 + s.dur, playing: false }; nameDirty = false;
    }
    $("[data-msg]", el).innerHTML = msg; P.sel = null; paintParams(); play();
  }
  $$("[data-dur]", el).forEach(b => b.onclick = () => { u.dur = +b.dataset.dur; keep(); paintParams(); });
  $$("[data-emi]", el).forEach(b => b.onclick = () => { u.emi = b.dataset.emi; keep(); paintParams(); });
  const setO = v => { u.other = Math.max(0, Math.min(30, Math.round(v * 2) / 2)); keep(); paintParams(); };
  $("[data-or]", el).addEventListener("input", e => setO(+e.target.value));
  $$("[data-od]", el).forEach(b => b.onclick = () => setO(u.other + +b.dataset.od));
  $$("[data-fb]", el).forEach(b => b.onclick = () => { const k = b.dataset.fb; u.fb[k] = !u.fb[k]; keep(); paintParams(); $(`[data-fb="${k}"]`, el).focus(); });
  if (fbKey(u.fb) !== "111") $("[data-fbx]", el).open = true;
  nameI.addEventListener("input", () => { nameDirty = true; });
  nameI.addEventListener("keydown", e => { if (e.key === "Enter") launch(); });
  $("[data-run]", el).onclick = launch;
  $$("[data-q]", el).forEach(b => b.onclick = () => { P.q = u.q = b.dataset.q; keep(); paintRes(); });
  $("[data-ys]", el).addEventListener("input", e => { P.sel = +e.target.value; paintRead(); });
  armButton($("[data-clear]", el), "Effacer toutes les simulations", "Confirmer : tout effacer ?", () => { xst().sims = []; anim = null; keep(); paintRes(); });
  paintParams(); paintRes();
  if (window.ResizeObserver) { const bk = () => { const w = el.clientWidth; return w < 330 ? 0 : w < 560 ? 1 : 2; }; let nw = bk(); new ResizeObserver(() => { const n = bk(); if (n !== nw && document.body.contains(el)) { nw = n; paintRes(); } }).observe(el); }
};

/* ---------- schéma du modèle (ce que le logiciel met en équations) ---------- */
WID.schema = el => {
  const box = (ic, t, s, cls) => `<div class="mbox ${cls || ""}"><span class="mi" aria-hidden="true">${ic}</span><span><b>${t}</b>${s ? `<span class="ms">${s}</span>` : ""}</span></div>`;
  const arr = t => `<div class="marr"><span aria-hidden="true">↓</span><span>${t}</span></div>`;
  el.innerHTML = `<div class="mflow">
    ${box("🏭", "Émissions humaines de CO₂", "combustibles fossiles, déforestation")}
    ${arr("le CO₂ s'ajoute à l'atmosphère")}
    <div class="mpair">${box("☁", "CO₂ dans l'atmosphère", "concentration en ppm")}${box("🌊🌳", "Puits de carbone", "l'océan et la végétation absorbent une partie du CO₂", "side")}</div>
    ${arr("effet de serre : forçage radiatif")}
    <div class="mpair">${box("🌡", "Température de surface", "moyenne du globe")}${box("🧊", "Océan profond", "stocke lentement une partie de la chaleur", "side")}</div>
    ${arr("dilatation de l'eau de mer, fonte des glaces")}
    ${box("📏", "Niveau des mers", "élévation depuis 2007")}
    <div class="mloop"><span aria-hidden="true">🔁</span><span><b>Rétroactions</b> (option du modèle) : vapeur d'eau, glaces et albédo, puits de carbone.</span></div></div>
    <p class="cap">${nb("Chaque flèche correspond à une équation. L'ordinateur calcule l'état du climat année après année : à partir de l'année 2007, il calcule 2008, puis 2009, etc. (pas de temps : 1 an).")}</p>`;
};

/* ---------- fourchette des projections (débloquée à la fin) ---------- */
WID.fourchette = el => {
  const SC = [[0, "Émissions nulles", 4], [8, "Comme aujourd'hui", 5], [16, "Deux fois plus", 2]], ECS = [2.5, 4];
  const P = { q: "T", span: 100, sel: null, series: [], bands: [], cut: MOD.y0 };
  el.innerHTML = `<p class="lead">${nb("Les climatologues ne connaissent pas exactement la sensibilité du climat : d'après le GIEC (2021), un doublement du CO₂ réchauffe probablement la Terre de 2,5 °C à 4 °C à long terme. On relance donc chaque scénario avec une sensibilité faible et une sensibilité forte.")}</p><div class="figbox chartbox" data-fig></div><div class="row animctl" data-ctl></div><ul class="simleg">${SC.map(s => `<li>${swatchL(s[2] - 1)}<span class="sn"><b>${s[1]}</b><span class="muted"> · ${s[0]} GtC/an · bande : sensibilité de 2,5 °C à 4 °C</span></span></li>`).join("")}</ul><div data-tab></div>`;
  P.series = SC.map(s => ({ color: "c" + s[2], dash: DASHS[s[2] - 1], v: run(s[0], 100, FULL).T }));
  P.bands = SC.map(s => { const a = run(s[0], 100, FULL, ECS[0]).T, b = run(s[0], 100, FULL, ECS[1]).T; return { color: "c" + s[2], lo: a.map((v, k) => Math.min(v, b[k])), hi: a.map((v, k) => Math.max(v, b[k])) }; });
  P.extra = P.bands.flatMap(b => [Math.min(...b.lo), Math.max(...b.hi)]);
  const fig = $("[data-fig]", el); let cut = MOD.y0;
  const chart = liveSVG(fig, (W, F) => { P.series.forEach(s => s.cut = cut); P.cut = cut; return plotSVG(W, F, P); });
  $("[data-tab]", el).innerHTML = tbl(["Scénario", "Température en 2107 (modèle central)", "Fourchette en 2107"], SC.map((s, i) => [s[1], fq("T", P.series[i].v[100]), `${fmt(P.bands[i].lo[100], 1)} à ${fmt(P.bands[i].hi[100], 1)} °C`]));
  animCtl($("[data-ctl]", el), 4000, p => { cut = MOD.y0 + 100 * p; chart.draw(); });
};
