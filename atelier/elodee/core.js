/* ===== Socle commun : affichage, stockage, nombres, graphiques, bilan ===== */
"use strict";
const CT = Object.assign({
  locale: "fr-FR", dec: ",", readHint: "Touche le graphique pour lire une valeur.", table: "Tableau de valeurs", light: "☀ Clair", dark: "☾ Sombre",
  dlNo: "Le téléchargement n'est pas disponible ici : utilise « Copier » ou « Montrer au professeur ».", dlOk: "Fichier proposé à l'enregistrement.", dlDeclined: "Enregistrement annulé.",
  dlBusy: "Une demande est déjà ouverte : réessaie dans un instant.", dlFail: "Téléchargement impossible ici : utilise « Copier ».", dlDone: "Fichier téléchargé.",
  name: "Prénom ou numéro (facultatif, reste sur cet appareil)", bDl: "⬇ Télécharger (.txt)", bCp: "⧉ Copier", bMail: "✉ Envoyer par mail", bShow: "👁 Montrer au professeur",
  cpSel: "Texte sélectionné : copie-le avec ⌘C / Ctrl+C ou « Copier » du menu.", cpOk: "Bilan copié : colle-le où ton professeur l'a demandé.", mailOk: "Ta messagerie devrait s'ouvrir avec le bilan.",
  bilanTxt: "Texte du bilan", close: "Fermer", student: "eleve", subject: "Bilan "
}, (typeof window !== "undefined" && window.CORE_T) || {});
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
try { document.documentElement.lang = (window.TP_LANG || "fr"); } catch (e) {}

/* ---------- stockage de confort (l'app marche sans) ---------- */
const Store = {
  key: "es-th1",
  load(def) { let o = {}; try { o = JSON.parse(localStorage.getItem(this.key) || "{}") || {}; } catch (e) { o = {}; } return Object.assign({}, def, o); },
  save(obj) { try { localStorage.setItem(this.key, JSON.stringify(obj)); } catch (e) {} }
};

/* ---------- nombres à la française ---------- */
const SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
const supStr = s => String(s).split("").map(c => SUP[c] || c).join("");
function fmt(x, dec) {
  if (x === null || x === undefined || Number.isNaN(x)) return "—";
  let s = dec === undefined ? String(Math.round(x * 1e6) / 1e6) : Number(x).toFixed(dec);
  let neg = s.startsWith("-"); if (neg) s = s.slice(1);
  let [i, d] = s.split(".");
  i = i.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (neg ? "−" : "") + i + (d ? CT.dec + d : "");
}
function fmtPow(p) { /* 2.21e7 -> "2,21 × 10⁷" */
  if (p === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(p))); const m = p / Math.pow(10, e);
  const mr = Math.round(m * 100) / 100;
  if (e >= -1 && e <= 3) return fmt(p, p < 10 ? 2 : 0);
  return (mr === 1 ? "" : fmt(mr) + " × ") + "10" + supStr(e);
}
/* lit « 1 020 », « 1,02e5 », « 1,02 × 10^5 », « 1,02x10⁵ », « 10⁵ », « −3 », « +12,4 °C » */
function parseNum(str) {
  if (str === null || str === undefined) return NaN;
  let s = String(str).trim();
  const SUPR = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };
  s = s.replace(/10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (m, g) => "10^" + g.split("").map(c => SUPR[c]).join(""));
  s = s.replace(/[−–]/g, "-").replace(/[\s  ]/g, "").replace(/,/g, ".");
  s = s.replace(/(°c|°|pa|hpa|bar|mbar|atm|mmhg|cm|mm|m|ans?|%|points?|pts?|\/an|°c\/siècle|°c\/an)+$/i, "");
  let m = s.match(/^([+-]?\d*\.?\d+)(?:[x×*·]10\^?\(?([+-]?\d+)\)?)$/i);
  if (m) return parseFloat(m[1]) * Math.pow(10, parseInt(m[2], 10));
  m = s.match(/^([+-]?)10\^\(?([+-]?\d+)\)?$/);
  if (m) return (m[1] === "-" ? -1 : 1) * Math.pow(10, parseInt(m[2], 10));
  if (/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(s)) return parseFloat(s);
  return NaN;
}
const near = (v, target, tolAbs, tolRel) => Number.isFinite(v) && Math.abs(v - target) <= Math.max(tolAbs || 0, Math.abs(target) * (tolRel || 0));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function shuffle(a, seed) { const r = a.slice(); let x = seed || (Math.random() * 1e9) | 0; for (let i = r.length - 1; i > 0; i--) { x = (x * 1103515245 + 12345) & 0x7fffffff; const j = x % (i + 1); [r[i], r[j]] = [r[j], r[i]]; } return r; }

/* ---------- affichage : taille, thème, projection ---------- */
const Display = {
  S: null, onChange: null,
  init(S, save) {
    this.S = S; this.save = save; this.apply();
    $("#fsMinus").onclick = () => { S.fs = Math.max(16, (S.fs || 20) - 2); this.apply(); save(); };
    $("#fsPlus").onclick = () => { S.fs = Math.min(32, (S.fs || 20) + 2); this.apply(); save(); };
    $("#themeBtn").onclick = () => {
      const dark = S.theme ? S.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      S.theme = dark ? "light" : "dark"; this.apply(); save();
    };
    $("#projBtn").onclick = () => { S.proj = !S.proj; this.apply(); save(); };
    matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => this.apply());
  },
  apply() {
    const S = this.S, r = document.documentElement;
    const base = S.fs || 20; r.style.setProperty("--fs", Math.round(base * (S.proj ? 1.4 : 1)) + "px");
    if (S.theme) r.setAttribute("data-theme", S.theme); else r.removeAttribute("data-theme");
    r.classList.toggle("proj", !!S.proj);
    const pb = $("#projBtn"); if (pb) pb.setAttribute("aria-pressed", S.proj ? "true" : "false");
    const dark = S.theme ? S.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    const tb = $("#themeBtn"); if (tb) tb.innerHTML = dark ? CT.light : CT.dark;
    Charts.redrawAll();
    if (this.onChange) this.onChange();
  }
};

/* bouton à confirmation en deux temps (pas de confirm()) */
function armButton(btn, label, confirmLabel, action) {
  let t = null;
  btn.onclick = () => {
    if (!t) { btn.textContent = confirmLabel; btn.classList.add("warn"); t = setTimeout(() => { btn.textContent = label; btn.classList.remove("warn"); t = null; }, 4000); return; }
    clearTimeout(t); t = null; btn.textContent = label; btn.classList.remove("warn"); action();
  };
}

/* ======================= GRAPHIQUES (SVG redessiné à la largeur réelle) ======================= */
const Charts = {
  list: new Set(),
  redrawAll() { this.list.forEach(c => { if (!document.body.contains(c.host)) this.list.delete(c); else c.draw(); }); }
};
let _rsT = null;
window.addEventListener("resize", () => { clearTimeout(_rsT); _rsT = setTimeout(() => Charts.redrawAll(), 120); });

const PAT = ["none", "dots", "diag", "cross", "horiz", "vert"];
function patternOne(pid, color, p) {
  let inner = "";
  if (p === "dots") inner = `<circle cx="3" cy="3" r="1.3" style="fill:var(--surface)"/>`;
  if (p === "diag") inner = `<path d="M-1,7 L7,-1" style="stroke:var(--surface);stroke-width:1.4"/>`;
  if (p === "cross") inner = `<path d="M-1,7 L7,-1 M-1,-1 L7,7" style="stroke:var(--surface);stroke-width:1.1"/>`;
  if (p === "horiz") inner = `<path d="M0,3 H6" style="stroke:var(--surface);stroke-width:1.4"/>`;
  if (p === "vert") inner = `<path d="M3,0 V6" style="stroke:var(--surface);stroke-width:1.4"/>`;
  return `<pattern id="${pid}" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" style="fill:var(--${color})"/>${inner}</pattern>`;
}
function patDefs(id, colors) { return colors.map((c, i) => patternOne(`${id}-p${i}`, c, PAT[i % PAT.length])).join(""); }
const DASH = i => (i % 4 === 1 ? "7 4" : i % 4 === 2 ? "2 4" : i % 4 === 3 ? "11 4 2 4" : "");
function swatch(color, i, kind) {
  if (kind === "line") return `<svg width="34" height="12" aria-hidden="true"><path d="M2 6 H32" style="stroke:var(--${color});stroke-width:3.2;fill:none;stroke-linecap:round" stroke-dasharray="${DASH(i)}"/></svg>`;
  const pid = "sw" + Math.random().toString(36).slice(2, 8); const p = PAT[i % PAT.length];
  const fill = p === "none" ? `var(--${color})` : `url(#${pid})`;
  return `<svg width="20" height="20" aria-hidden="true">${p === "none" ? "" : `<defs>${patternOne(pid, color, p)}</defs>`}<rect x="1" y="1" width="18" height="18" rx="3" style="fill:${fill};stroke:var(--ink);stroke-width:.7"/></svg>`;
}

/* phase de l'eau */
const PSAT = [[0.01, 611.657], [10, 1228], [20, 2339], [30, 4247], [40, 7385], [50, 12352], [60, 19946], [70, 31201], [80, 47414], [90, 70182], [100, 101418], [120, 198670], [140, 361540], [160, 618230], [180, 1002800], [200, 1554900], [220, 2319600], [240, 3346900], [260, 4692300], [280, 6416600], [300, 8587900], [320, 11284000], [340, 14594000], [360, 18666000], [374, 22064000]];
const Water = {
  Tt: 0.01, Pt: 611.657, Tc: 374, Pc: 2.2064e7,
  psat(T) { if (T <= 0.01) return this.Pt; if (T >= 374) return this.Pc; for (let i = 1; i < PSAT.length; i++) { const [t1, p1] = PSAT[i]; const [t0, p0] = PSAT[i - 1]; if (T <= t1) { const f = (T - t0) / (t1 - t0); return Math.pow(10, Math.log10(p0) + f * (Math.log10(p1) - Math.log10(p0))); } } return this.Pc; },
  tsat(P) { if (P <= this.Pt) return this.Tt; if (P >= this.Pc) return this.Tc; for (let i = 1; i < PSAT.length; i++) { const [t1, p1] = PSAT[i]; const [t0, p0] = PSAT[i - 1]; if (P <= p1) { const f = (Math.log10(P) - Math.log10(p0)) / (Math.log10(p1) - Math.log10(p0)); return t0 + f * (t1 - t0); } } return this.Tc; },
  psub(T) { const K = T + 273.15; return Math.exp(9.550426 - 5723.265 / K + 3.53068 * Math.log(K) - 0.00728332 * K); },
  tmelt(P) { return 0.01 - 7.4e-8 * (P - this.Pt); },
  state(T, P) {
    if (P >= this.Pc && T >= this.Tc) return "fluide supercritique";
    if (P > this.Pt && T < this.tmelt(P)) return "solide (glace)";
    if (P <= this.Pt && T < 0.01) return P > this.psub(T) ? "solide (glace)" : "gaz (vapeur)";
    if (T >= this.Tc) return "gaz (vapeur)";
    return P > this.psat(T) ? "liquide" : "gaz (vapeur)";
  }
};

function mountChart(container, spec) {
  container.innerHTML = "";
  const id = "ch" + Math.random().toString(36).slice(2, 8);
  const host = document.createElement("div"); host.className = "chart"; host.tabIndex = 0;
  host.setAttribute("role", "img"); host.setAttribute("aria-label", spec.alt || spec.title || "Graphique");
  const legend = document.createElement("div"); legend.className = "legend";
  const readout = document.createElement("div"); readout.className = "readout"; readout.setAttribute("aria-live", "polite");
  readout.innerHTML = spec.readHint || CT.readHint;
  container.append(host);
  if (spec.legend !== false && spec.type !== "phase" && (spec.series || spec.parts)) container.append(legend);
  container.append(readout);
  if (spec.table !== false) { const t = buildTable(spec); if (t) container.append(t); }

  const ch = { host, spec, sel: null, draw: null };
  const fsPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 20;

  if (spec.type !== "phase" && legend.isConnected) {
    const names = spec.type === "stack" ? spec.parts : spec.series.map(s => s.name);
    const colors = spec.type === "stack" ? spec.colors : spec.series.map(s => s.color);
    if (names.length > 1 || spec.type === "stack") legend.innerHTML = names.map((n, i) => `<span>${swatch(colors[i], i, spec.type === "line" ? "line" : "fill")}${esc(n)}</span>`).join("");
    else legend.remove();
  }

  function axisText(x, y, txt, anchor, size, extra) { return `<text x="${x}" y="${y}" text-anchor="${anchor}" style="fill:var(--ink);font-size:${size}px" ${extra || ""}>${esc(txt)}</text>`; }

  ch.draw = function () {
    const W = Math.max(260, host.clientWidth || container.clientWidth || 320);
    const F = fsPx(); const tk = Math.max(12, F * 0.72), tt = Math.max(13, F * 0.78);
    const H = spec.h ? spec.h * F : Math.round(Math.min(Math.max(W * 0.58, 15 * F), 24 * F));
    let svg = "";
    if (spec.type === "bar") svg = drawBar(W, H, F, tk, tt);
    else if (spec.type === "line") svg = drawLine(W, H, F, tk, tt);
    else if (spec.type === "stack") svg = drawStack(W, F, tk, tt);
    else if (spec.type === "phase") svg = drawPhase(W, H, F, tk, tt);
    host.innerHTML = svg;
  };

  /* --- barres groupées --- */
  let geo = {};
  function drawBar(W, H, F, tk, tt) {
    const S = spec.series, cats = spec.categories;
    const L = F * 3.3, R = F * 0.8, T = F * 0.9, B = F * 3.2 + (spec.rotate ? F * 1.2 : 0);
    const pw = W - L - R, ph = H - T - B;
    const yMax = spec.yMax, yStep = spec.yStep;
    const y = v => T + ph - (v / yMax) * ph;
    let g = "";
    for (let v = 0; v <= yMax + 1e-9; v += yStep) { g += `<line x1="${L}" x2="${L + pw}" y1="${y(v)}" y2="${y(v)}" style="stroke:var(--grid)"/>` + axisText(L - 6, y(v) + tk * 0.35, fmt(v), "end", tk); }
    const gw = pw / cats.length, bw = Math.min(gw * 0.7 / S.length, F * 3.2);
    geo = { bars: [] };
    cats.forEach((c, ci) => {
      const gx = L + gw * ci + (gw - bw * S.length) / 2;
      S.forEach((s, si) => {
        const v = s.values[ci]; const x = gx + bw * si; const yy = y(Math.max(v, 0));
        const sel = ch.sel && ch.sel[0] === ci && ch.sel[1] === si;
        g += `<rect x="${x + 1}" y="${yy}" width="${bw - 2}" height="${Math.max(T + ph - yy, 0)}" rx="3" style="fill:var(--${s.color});${sel ? "stroke:var(--ink);stroke-width:3" : ""}"/>`;
        const lbl = spec.valueLabel ? spec.valueLabel(v, ci, si) : fmt(v);
        if (spec.showValues !== false) g += axisText(x + bw / 2, yy - 5, lbl, "middle", tk, `font-weight="700"`);
        geo.bars.push({ ci, si, x, w: bw });
      });
      const cx = L + gw * ci + gw / 2;
      if (spec.rotate) g += `<text transform="translate(${cx},${T + ph + 8}) rotate(35)" style="fill:var(--ink);font-size:${tk}px">${esc(c)}</text>`;
      else g += axisText(cx, T + ph + tk * 1.35, c, "middle", tk, `font-weight="700"`);
    });
    g += `<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:1.5"/>`;
    g += axisText(L + pw / 2, H - F * 0.35, spec.xTitle || "", "middle", tt, `font-weight="700"`);
    g += `<text transform="translate(${F * 0.95},${T + ph / 2}) rotate(-90)" text-anchor="middle" style="fill:var(--ink);font-size:${tt}px;font-weight:700">${esc(spec.yTitle || "")}</text>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${g}</svg>`;
  }

  /* --- courbes --- */
  function drawLine(W, H, F, tk, tt) {
    const S = spec.series;
    const L = F * 3.6, R = F * 1.1, T = F * 0.9, B = F * 3.2;
    const pw = W - L - R, ph = H - T - B;
    const { xMin, xMax, yMin, yMax } = spec;
    const X = v => L + (v - xMin) / (xMax - xMin) * pw, Y = v => T + ph - (v - yMin) / (yMax - yMin) * ph;
    let g = "";
    (spec.bands || []).forEach(b => { g += `<rect x="${X(b.x0)}" y="${T}" width="${X(b.x1) - X(b.x0)}" height="${ph}" style="fill:var(--shade)"/>` + (b.label ? axisText((X(b.x0) + X(b.x1)) / 2, T + tk * 1.1, b.label, "middle", tk * 0.92, `font-weight="700"`) : ""); });
    const maxXt = Math.max(2, Math.floor(pw / (F * (spec.xTickW || 3.6))));
    let xs = spec.xStep; while ((xMax - xMin) / xs > maxXt) xs *= 2;
    for (let v = Math.ceil(xMin / xs) * xs; v <= xMax + 1e-9; v += xs) { g += `<line x1="${X(v)}" x2="${X(v)}" y1="${T}" y2="${T + ph}" style="stroke:var(--grid)"/>` + axisText(X(v), T + ph + tk * 1.35, spec.xFmt ? spec.xFmt(v) : fmt(v), "middle", tk); }
    for (let v = Math.ceil(yMin / spec.yStep) * spec.yStep; v <= yMax + 1e-9; v += spec.yStep) { g += `<line x1="${L}" x2="${L + pw}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:var(--grid)${Math.abs(v) < 1e-9 && yMin < 0 ? ";stroke:var(--muted);stroke-width:1.4" : ""}"/>` + axisText(L - 6, Y(v) + tk * 0.35, spec.yFmt ? spec.yFmt(v) : fmt(v), "end", tk); }
    (spec.hlines || []).forEach(hl => { g += `<line x1="${L}" x2="${L + pw}" y1="${Y(hl.y)}" y2="${Y(hl.y)}" style="stroke:var(--${hl.color || "muted"});stroke-width:2" stroke-dasharray="7 5"/>` + (hl.label ? axisText(L + 6, Y(hl.y) - 6, hl.label, "start", tk * 0.92, `font-weight="700"`) : ""); });
    S.forEach((s, si) => {
      const d = s.pts.map((p, i) => (i ? "L" : "M") + X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1)).join(" ");
      g += `<path d="${d}" style="fill:none;stroke:var(--${s.color});stroke-width:${s.w || 3};stroke-linejoin:round;stroke-linecap:round" stroke-dasharray="${s.dash !== undefined ? s.dash : DASH(si)}"/>`;
      if (spec.markers) s.pts.forEach(p => { g += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="${F * 0.17}" style="fill:var(--${s.color})"/>`; });
    });
    if (ch.sel !== null) {
      const xv = ch.sel; g += `<line x1="${X(xv)}" x2="${X(xv)}" y1="${T}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:1.5" stroke-dasharray="3 3"/>`;
      S.forEach(s => { const p = s.pts.find(q => q[0] === xv); if (p) g += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="${F * 0.3}" style="fill:var(--surface);stroke:var(--${s.color});stroke-width:3"/>`; });
    }
    g += `<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:1.5"/>`;
    g += axisText(L + pw / 2, H - F * 0.35, spec.xTitle || "", "middle", tt, `font-weight="700"`);
    g += `<text transform="translate(${F * 0.95},${T + ph / 2}) rotate(-90)" text-anchor="middle" style="fill:var(--ink);font-size:${tt}px;font-weight:700">${esc(spec.yTitle || "")}</text>`;
    geo = { L, pw, X, xMin, xMax };
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${g}</svg>`;
  }

  /* --- barres empilées horizontales (cumul à 100 %) --- */
  function drawStack(W, F, tk, tt) {
    const rows = spec.rows, P = spec.parts;
    const L = F * (spec.labelW || 5.6), R = F * 0.9, T = F * 0.5, rowH = F * 2.3, gap = F * 0.9, B = F * 3.1;
    const pw = W - L - R; const H = T + rows.length * (rowH + gap) - gap + B;
    const X = v => L + v / 100 * pw;
    let g = `<defs>${patDefs(id, spec.colors)}</defs>`;
    for (let v = 0; v <= 100; v += 20) g += `<line x1="${X(v)}" x2="${X(v)}" y1="${T}" y2="${T + rows.length * (rowH + gap) - gap}" style="stroke:var(--grid)"/>` + axisText(X(v), T + rows.length * (rowH + gap) - gap + tk * 1.35, fmt(v), "middle", tk);
    geo = { segs: [] };
    rows.forEach((r, ri) => {
      const y0 = T + ri * (rowH + gap); let acc = 0;
      g += axisText(L - 8, y0 + rowH / 2 - (r.sub ? tk * 0.2 : -tk * 0.35), r.label, "end", tk, `font-weight="700"`);
      if (r.sub) g += axisText(L - 8, y0 + rowH / 2 + tk * 0.95, r.sub, "end", tk * 0.88);
      r.values.forEach((v, pi) => {
        if (v <= 0) return;
        const x = X(acc), w = X(acc + v) - X(acc);
        const sel = ch.sel && ch.sel[0] === ri && ch.sel[1] === pi;
        const fill = PAT[pi % PAT.length] === "none" ? `var(--${spec.colors[pi]})` : `url(#${id}-p${pi})`;
        g += `<rect x="${x}" y="${y0}" width="${w}" height="${rowH}" style="fill:${fill};stroke:var(--surface);stroke-width:1.5${sel ? ";stroke:var(--ink);stroke-width:3" : ""}"/>`;
        const lbl = fmt(v) + " %";
        if (w > tk * 3.4) g += `<rect x="${x + w / 2 - tk * 1.55}" y="${y0 + rowH / 2 - tk * 0.75}" width="${tk * 3.1}" height="${tk * 1.5}" rx="4" style="fill:var(--surface);opacity:.92"/>` + axisText(x + w / 2, y0 + rowH / 2 + tk * 0.36, lbl, "middle", tk * 0.92, `font-weight="800"`);
        geo.segs.push({ ri, pi, x, w, y0, h: rowH });
        acc += v;
      });
    });
    g += axisText(L + pw / 2, H - F * 0.35, spec.xTitle || "Proportion (%)", "middle", tt, `font-weight="700"`);
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${g}</svg>`;
  }

  /* --- diagramme d'état de l'eau (pression en échelle logarithmique) --- */
  function drawPhase(W, H, F, tk, tt) {
    const L = F * 3.6, R = F * 1, T = F * 0.9, B = F * 3.2;
    const pw = W - L - R, ph = H - T - B;
    const tMin = spec.tMin ?? -150, tMax = spec.tMax ?? 500, lpMin = spec.lpMin ?? 1, lpMax = spec.lpMax ?? 8;
    const X = t => L + (t - tMin) / (tMax - tMin) * pw;
    const Y = p => T + ph - (Math.log10(p) - lpMin) / (lpMax - lpMin) * ph;
    const clipY = y => Math.min(Math.max(y, T), T + ph);
    let g = `<defs><clipPath id="${id}-c"><rect x="${L}" y="${T}" width="${pw}" height="${ph}"/></clipPath></defs>`;
    // zones colorées
    let sub = "", sat = "";
    for (let t = tMin; t <= 0.01; t += 2) sub += (sub ? "L" : "M") + X(t).toFixed(1) + "," + Y(Math.max(Water.psub(t), Math.pow(10, lpMin - 3))).toFixed(1) + " ";
    sub += "L" + X(0.01) + "," + Y(Water.Pt);
    for (let t = 0.01; t <= 374; t += 2) sat += (sat ? "L" : "M") + X(t).toFixed(1) + "," + Y(Water.psat(t)).toFixed(1) + " ";
    sat += "L" + X(374) + "," + Y(Water.Pc);
    const Ptop = Math.pow(10, lpMax);
    const meltTop = X(Water.tmelt(Ptop));
    g += `<g clip-path="url(#${id}-c)">`;
    g += `<path d="${sub.replace("M", "M" + X(tMin) + "," + Y(Ptop) + " L")} L${meltTop},${Y(Ptop)} Z" style="fill:var(--info-soft)"/>`;
    g += `<path d="M${X(0.01)},${Y(Water.Pt)} ${sat.replace("M", "L")} L${X(374)},${Y(Ptop)} L${meltTop},${Y(Ptop)} Z" style="fill:var(--ok-soft)"/>`;
    g += `<path d="${sub} ${sat.replace("M", "L")} L${X(374)},${Y(Ptop)} L${X(tMax)},${Y(Ptop)} L${X(tMax)},${T + ph + 50} L${X(tMin)},${T + ph + 50} Z" style="fill:var(--warn-soft)"/>`;
    g += `</g>`;
    for (let e = lpMin; e <= lpMax; e++) g += `<line x1="${L}" x2="${L + pw}" y1="${Y(Math.pow(10, e))}" y2="${Y(Math.pow(10, e))}" style="stroke:var(--grid)"/>` + axisText(L - 6, Y(Math.pow(10, e)) + tk * 0.35, "10" + supStr(e), "end", tk);
    let step = [10, 20, 50, 100, 200, 500].find(s => (tMax - tMin) / s <= pw / (F * 2.6)) || 500;
    for (let t = Math.ceil(tMin / step) * step; t <= tMax; t += step) g += `<line x1="${X(t)}" x2="${X(t)}" y1="${T}" y2="${T + ph}" style="stroke:var(--grid)"/>` + axisText(X(t), T + ph + tk * 1.35, fmt(t), "middle", tk);
    g += `<g clip-path="url(#${id}-c)"><path d="${sub}" style="fill:none;stroke:var(--info);stroke-width:2.5"/><path d="${sat}" style="fill:none;stroke:var(--c2);stroke-width:2.5"/><line x1="${X(0.01)}" y1="${Y(Water.Pt)}" x2="${meltTop}" y2="${Y(Ptop)}" style="stroke:var(--info);stroke-width:2.5"/></g>`;
    g += `<circle cx="${X(0.01)}" cy="${Y(Water.Pt)}" r="${F * 0.24}" style="fill:var(--ink)"/>` + axisText(X(0.01) + F * 0.35, Y(Water.Pt) + tk * 1.25, "point triple", "start", tk * 0.88, `font-weight="700"`);
    if (Water.Pc <= Ptop) g += `<circle cx="${X(374)}" cy="${Y(Water.Pc)}" r="${F * 0.24}" style="fill:var(--ink)"/>` + axisText(X(374), Y(Water.Pc) - F * 0.45, "point critique", "middle", tk * 0.88, `font-weight="700"`);
    g += axisText(X(tMin) + F * 0.6, T + F * 1.4, "SOLIDE", "start", tt, `font-weight="800" letter-spacing=".08em"`);
    const pl = Math.pow(10, lpMax - 0.5), tl = Math.min(Water.tsat(pl), tMax) / 2;
    g += axisText(X(tl), Y(pl) + F * 0.4, "LIQUIDE", "middle", tt, `font-weight="800" letter-spacing=".08em"`);
    g += axisText(X(tMin + 0.86 * (tMax - tMin)), Y(Math.pow(10, lpMin + 0.35)), "GAZ", "middle", tt, `font-weight="800" letter-spacing=".08em"`);
    (spec.segments || []).forEach(s => {
      const y = Y(s.P); g += `<line x1="${X(s.t0)}" x2="${X(s.t1)}" y1="${y}" y2="${y}" style="stroke:var(--${s.color || "c3"});stroke-width:${F * 0.32};stroke-linecap:round;opacity:.9"/>` + axisText(X(s.t0), y - F * 0.5, s.label, "start", tk, `font-weight="800"`);
    });
    (spec.points || []).forEach(p => { g += `<circle cx="${X(p.T)}" cy="${Y(p.P)}" r="${F * 0.3}" style="fill:var(--${p.color || "c3"});stroke:var(--surface);stroke-width:2"/>` + axisText(X(p.T) + F * 0.45, Y(p.P) - F * 0.35, p.label, "start", tk, `font-weight="800"`); });
    if (ch.sel) { const [t, p] = ch.sel; g += `<line x1="${X(t)}" x2="${X(t)}" y1="${T}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:1.4" stroke-dasharray="4 3"/><line x1="${L}" x2="${L + pw}" y1="${Y(p)}" y2="${Y(p)}" style="stroke:var(--ink);stroke-width:1.4" stroke-dasharray="4 3"/><circle cx="${X(t)}" cy="${Y(p)}" r="${F * 0.3}" style="fill:var(--surface);stroke:var(--ink);stroke-width:3"/>`; }
    g += `<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:1.5"/>`;
    g += axisText(L + pw / 2, H - F * 0.35, "Température (°C)", "middle", tt, `font-weight="700"`);
    g += `<text transform="translate(${F * 0.95},${T + ph / 2}) rotate(-90)" text-anchor="middle" style="fill:var(--ink);font-size:${tt}px;font-weight:700">Pression (Pa, échelle logarithmique)</text>`;
    geo = { L, T, pw, ph, tMin, tMax, lpMin, lpMax };
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${g}</svg>`;
  }

  /* --- lecture au toucher --- */
  function pick(evt) {
    const svg = host.querySelector("svg"); if (!svg) return;
    const r = svg.getBoundingClientRect(); const sx = (evt.clientX - r.left) * (svg.viewBox.baseVal.width / r.width); const sy = (evt.clientY - r.top) * (svg.viewBox.baseVal.height / r.height);
    if (spec.type === "bar") { let best = null, bd = 1e9; geo.bars.forEach(b => { const d = Math.abs(sx - (b.x + b.w / 2)); if (d < bd) { bd = d; best = b; } }); if (best) setSel([best.ci, best.si]); }
    else if (spec.type === "line") { const xv = geo.xMin + (sx - geo.L) / geo.pw * (geo.xMax - geo.xMin); setSel(nearestX(xv)); }
    else if (spec.type === "stack") { const s = geo.segs.find(q => sx >= q.x && sx <= q.x + q.w && sy >= q.y0 - 4 && sy <= q.y0 + q.h + 4); if (s) setSel([s.ri, s.pi]); }
    else if (spec.type === "phase") { const t = geo.tMin + (sx - geo.L) / geo.pw * (geo.tMax - geo.tMin); const lp = geo.lpMax - (sy - geo.T) / geo.ph * (geo.lpMax - geo.lpMin); if (t < geo.tMin || t > geo.tMax || lp < geo.lpMin || lp > geo.lpMax) return; setSel([t, Math.pow(10, lp)]); }
  }
  function allX() { const s = new Set(); spec.series.forEach(se => se.pts.forEach(p => s.add(p[0]))); return Array.from(s).sort((a, b) => a - b); }
  function nearestX(xv) { const xs = allX(); let b = xs[0]; xs.forEach(x => { if (Math.abs(x - xv) < Math.abs(b - xv)) b = x; }); return b; }
  function setSel(v) { ch.sel = v; ch.draw(); readout.innerHTML = describe(); }
  function describe() {
    if (spec.type === "bar") { const [ci, si] = ch.sel; const s = spec.series[si]; const v = s.values[ci]; return `<b>${esc(spec.categories[ci])}</b>${spec.series.length > 1 ? " · " + esc(s.name) : ""} : ${spec.valueLabel ? spec.valueLabel(v, ci, si) : fmt(v)}${spec.unit ? " " + spec.unit : ""}`; }
    if (spec.type === "line") { const xv = ch.sel; return `<b>${spec.xRead ? spec.xRead(xv) : fmt(xv)}</b> → ` + spec.series.map(s => { const p = s.pts.find(q => q[0] === xv); return p ? `${esc(s.name)} : ${spec.yRead ? spec.yRead(p[1]) : fmt(p[1])}` : null; }).filter(Boolean).join(" · "); }
    if (spec.type === "stack") { const [ri, pi] = ch.sel; return `<b>${esc(spec.rows[ri].label)}</b> · ${esc(spec.parts[pi])} : ${fmt(spec.rows[ri].values[pi])} %`; }
    if (spec.type === "phase") { const [t, p] = ch.sel; return `Point touché : <b>T ≈ ${fmt(Math.round(t))} °C</b> ; <b>P ≈ ${fmtPow(Number(p.toPrecision(2)))} Pa</b>${spec.readState ? ` → état de l'eau : <b>${Water.state(t, p)}</b>` : ""}`; }
    return "";
  }
  host.addEventListener("pointerdown", e => { pick(e); });
  host.addEventListener("pointermove", e => { if (e.buttons && e.pointerType === "mouse") pick(e); });
  host.addEventListener("keydown", e => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return; e.preventDefault(); const dir = e.key === "ArrowRight" ? 1 : -1;
    if (spec.type === "line") { const xs = allX(); let i = ch.sel === null ? 0 : xs.indexOf(ch.sel) + dir; i = Math.max(0, Math.min(xs.length - 1, i)); setSel(xs[i]); }
    if (spec.type === "bar") { const n = spec.categories.length * spec.series.length; let k = ch.sel ? ch.sel[0] * spec.series.length + ch.sel[1] + dir : 0; k = (k + n) % n; setSel([Math.floor(k / spec.series.length), k % spec.series.length]); }
    if (spec.type === "stack") { const flat = []; spec.rows.forEach((r, ri) => r.values.forEach((v, pi) => { if (v > 0) flat.push([ri, pi]); })); let k = ch.sel ? flat.findIndex(f => f[0] === ch.sel[0] && f[1] === ch.sel[1]) + dir : 0; k = (k + flat.length) % flat.length; setSel(flat[k]); }
  });
  ch.draw(); Charts.list.add(ch);
  if (window.ResizeObserver) { let lw = 0; new ResizeObserver(() => { const w = host.clientWidth; if (Math.abs(w - lw) > 4) { lw = w; ch.draw(); } }).observe(host); }
  return ch;
}

function buildTable(spec) {
  let head = "", body = "";
  if (spec.type === "bar") {
    head = `<tr><th>${esc(spec.xTitle || "")}</th>${spec.series.map(s => `<th>${esc(s.name || spec.yTitle)}</th>`).join("")}</tr>`;
    body = spec.categories.map((c, ci) => `<tr><td>${esc(c)}</td>${spec.series.map((s, si) => `<td class="n">${spec.valueLabel ? spec.valueLabel(s.values[ci], ci, si) : fmt(s.values[ci])}</td>`).join("")}</tr>`).join("");
  } else if (spec.type === "line") {
    const xs = new Set(); spec.series.forEach(s => s.pts.forEach(p => xs.add(p[0])));
    const X = Array.from(xs).sort((a, b) => a - b);
    head = `<tr><th>${esc(spec.xTitle || "")}</th>${spec.series.map(s => `<th>${esc(s.name)}</th>`).join("")}</tr>`;
    body = X.map(x => `<tr><td class="n">${spec.xFmt ? spec.xFmt(x) : fmt(x)}</td>${spec.series.map(s => { const p = s.pts.find(q => q[0] === x); return `<td class="n">${p ? (spec.yFmt ? spec.yFmt(p[1]) : fmt(p[1])) : "—"}</td>`; }).join("")}</tr>`).join("");
  } else if (spec.type === "stack") {
    head = `<tr><th>Niveau</th>${spec.parts.map(p => `<th>${esc(p)} (%)</th>`).join("")}</tr>`;
    body = spec.rows.map(r => `<tr><td>${esc(r.label)}${r.sub ? " (" + esc(r.sub) + ")" : ""}</td>${r.values.map(v => `<td class="n">${fmt(v)}</td>`).join("")}</tr>`).join("");
  } else if (spec.type === "phase") {
    if (spec.table === "none") return null;
    head = `<tr><th>Repère</th><th>Température</th><th>Pression</th></tr>`;
    body = `<tr><td>Point triple</td><td class="n">0,01 °C</td><td class="n">611 Pa</td></tr><tr><td>Ébullition sous 1 atm</td><td class="n">100 °C</td><td class="n">1,013 × 10⁵ Pa</td></tr><tr><td>Point critique</td><td class="n">374 °C</td><td class="n">2,21 × 10⁷ Pa</td></tr>`;
  }
  const d = document.createElement("details"); d.className = "tbl"; if (spec.tableOpen) d.open = true;
  d.innerHTML = `<summary>${CT.table}${spec.type === "phase" ? " (repères)" : ""}</summary><div class="tablewrap"><table class="t"><thead>${head}</thead><tbody>${body}</tbody></table></div>`;
  return d;
}

/* ======================= BILAN : télécharger / copier / mail / montrer ======================= */
const inClaude = () => !!(window.claude && typeof window.claude.use === "function");
let _dlP = null;
function getDownloads() { if (!inClaude()) return Promise.resolve(null); if (!_dlP) _dlP = window.claude.use("downloads").catch(() => null); return _dlP; }
setTimeout(() => { getDownloads(); }, 0);

async function saveText(filename, text) {
  if (inClaude()) {
    const d = await getDownloads();
    if (!d) return { ok: false, msg: CT.dlNo };
    try { await d.save({ filename, data: text }); return { ok: true, msg: CT.dlOk }; }
    catch (e) { const c = e && e.code; if (c === "declined") return { ok: false, msg: CT.dlDeclined }; if (c === "rate_limited") return { ok: false, msg: CT.dlBusy }; return { ok: false, msg: CT.dlFail }; }
  }
  try {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 2000); return { ok: true, msg: CT.dlDone };
  } catch (e) { return { ok: false, msg: CT.dlFail }; }
}

function renderBilanTools(container, getText, getShow, appSlug) {
  container.innerHTML = `
    <div class="field"><label for="eleve">${CT.name}</label><input id="eleve" class="inp" autocomplete="off" maxlength="40"></div>
    <div class="row">
      <button class="btn" id="bDl" type="button">${CT.bDl}</button>
      <button class="btn ghost" id="bCp" type="button">${CT.bCp}</button>
      ${inClaude() ? "" : `<button class="btn ghost" id="bMail" type="button">${CT.bMail}</button>`}
      <button class="btn ghost" id="bShow" type="button">${CT.bShow}</button>
    </div>
    <p class="toast" id="bMsg" aria-live="polite"></p>
    <textarea class="inp copyarea" id="bTxt" readonly hidden aria-label="${CT.bilanTxt}"></textarea>`;
  const inp = $("#eleve", container);
  try { inp.value = localStorage.getItem("es-th1-eleve") || ""; } catch (e) {}
  inp.addEventListener("input", () => { try { localStorage.setItem("es-th1-eleve", inp.value); } catch (e) {} });
  const msg = t => { $("#bMsg", container).textContent = t; };
  $("#bDl", container).onclick = async () => { const r = await saveText(`bilan-${appSlug}-${(inp.value || CT.student).replace(/[^a-z0-9-]+/gi, "_")}.txt`, getText(inp.value)); msg(r.msg); };
  $("#bCp", container).onclick = () => {
    const txt = getText(inp.value); const ta = $("#bTxt", container);
    const fallback = () => { ta.hidden = false; ta.value = txt; ta.focus(); ta.select(); msg(CT.cpSel); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => msg(CT.cpOk), fallback); else fallback();
  };
  const bm = $("#bMail", container); if (bm) bm.onclick = () => { const txt = getText(inp.value); location.href = "mailto:?subject=" + encodeURIComponent(CT.subject + appSlug) + "&body=" + encodeURIComponent(txt); msg(CT.mailOk); };
  $("#bShow", container).onclick = () => showOverlay(getShow(inp.value));
}
function showOverlay(html) {
  const o = document.createElement("div"); o.className = "overlay"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true");
  o.innerHTML = `<div class="in">${html}<button class="btn" type="button" id="ovClose">${CT.close}</button></div>`;
  document.body.appendChild(o); const c = $("#ovClose", o); c.focus();
  const close = () => { o.remove(); document.removeEventListener("keydown", k); }; const k = e => { if (e.key === "Escape") close(); };
  c.onclick = close; document.addEventListener("keydown", k);
}
const today = () => new Date().toLocaleDateString(CT.locale, { day: "numeric", month: "long", year: "numeric" });
