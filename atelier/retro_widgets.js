/* ===== Activité « Évolution de la température et rétroactions » : documents, figures et simulations ===== */
Store.key = "retroactions-climat-tle-v1";
const SIMUL = "Valeurs simulées";
const NB = " ", NN = " ";
const tbl = (head, rows) => `<div class="tablewrap"><table class="t"><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* ---------- typographie française appliquée aux contenus ---------- */
function nb(s) {
  return String(s).replace(/ ([?!;])/g, NN + "$1").replace(/ :(?=[ <]|$)/g, NB + ":").replace(/« /g, "«" + NB).replace(/ »/g, NB + "»")
    .replace(/(\d) (\d{3})(?!\d)/g, "$1" + NN + "$2").replace(/(\d) (%|°C|m|cm|mm|mL|L|W|km|km²|km³|Mt|t|kg|ans|min|fois|millions)(?![\wà-ÿ²³])/g, "$1" + NB + "$2");
}
function typo(o) { if (typeof o === "string") return nb(o); if (Array.isArray(o)) return o.map(typo); if (o && typeof o === "object") { Object.keys(o).forEach(k => { if (typeof o[k] !== "function") o[k] = typo(o[k]); }); } return o; }

/* ---------- SVG redessiné à la largeur réelle (texte toujours lisible) ---------- */
const fsPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 20;
function liveSVG(host, draw) {
  const o = { host, draw() { const W = Math.max(260, host.clientWidth || 320); host.innerHTML = draw(W, fsPx()); } };
  o.draw(); Charts.list.add(o);
  if (window.ResizeObserver) { let lw = host.clientWidth; new ResizeObserver(() => { const w = host.clientWidth; if (Math.abs(w - lw) > 4) { lw = w; o.draw(); } }).observe(host); }
  return o;
}
const sT = (x, y, txt, a, size, extra) => `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${size.toFixed(1)}px" ${extra || ""}>${esc(txt)}</text>`;
const TK = F => Math.max(15, F * 0.76);
function arrow(x1, y1, x2, y2, w, color, op) {
  const a = Math.atan2(y2 - y1, x2 - x1), hl = Math.max(w * 1.1, 10), hw = Math.max(w * 0.95, 7);
  const bx = x2 - Math.cos(a) * hl, by = y2 - Math.sin(a) * hl, nx = -Math.sin(a), ny = Math.cos(a);
  return `<g style="opacity:${op || 1}"><line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" style="stroke:var(--${color});stroke-width:${Math.max(w, 1.5).toFixed(1)}"/><polygon points="${x2.toFixed(1)},${y2.toFixed(1)} ${(bx + nx * hw).toFixed(1)},${(by + ny * hw).toFixed(1)} ${(bx - nx * hw).toFixed(1)},${(by - ny * hw).toFixed(1)}" style="fill:var(--${color})"/></g>`;
}

/* ---------- commande d'animation commune : Lancer / Pause / Recommencer ---------- */
function animCtl(el, dur, onP) {
  el.innerHTML = `<button class="btn" type="button" data-a="run"></button><button class="btn ghost" type="button" data-a="reset">${CT.animReset}</button>`;
  const st = { p: 0, playing: false, lt: 0, raf: 0 }, b = el.querySelector('[data-a="run"]');
  const lab = () => { b.textContent = st.playing ? CT.animPause : (st.p > 0 && st.p < 1) ? CT.animResume : CT.animRun; };
  const frame = ts => {
    if (!st.playing) return; if (!document.body.contains(el)) { st.playing = false; return; }
    const dt = st.lt ? Math.min(100, ts - st.lt) : 0; st.lt = ts; st.p = Math.min(1, st.p + dt / dur);
    if (st.p >= 1) st.playing = false; onP(st.p); lab(); if (st.playing) st.raf = requestAnimationFrame(frame);
  };
  st.play = () => { if (st.p >= 1) st.p = 0; st.playing = true; st.lt = 0; lab(); st.raf = requestAnimationFrame(frame); };
  st.pause = () => { st.playing = false; cancelAnimationFrame(st.raf); lab(); };
  st.set = p => { st.pause(); st.p = Math.max(0, Math.min(1, p)); onP(st.p); lab(); };
  b.onclick = () => st.playing ? st.pause() : st.play();
  el.querySelector('[data-a="reset"]').onclick = () => st.set(0);
  lab(); onP(0); return st;
}

/* ======================= FIGURES DES DOCUMENTS ======================= */
const FIGS = {};

/* --- Doc. 1 : dilatation thermique (schéma redessiné) --- */
function oceanPanel(x0, w, y0, h, F, lift, warm, title, frac) {
  const tk = TK(F), top = y0 + F * 1.5, bot = y0 + h - 2, sea0 = top + (bot - top) * 0.36, thermo = top + (bot - top) * 0.72, sea = sea0 - lift;
  const wb = sea + (thermo - sea) * (frac === undefined ? 1 : frac);
  let g = `<rect x="${x0}" y="${top}" width="${w}" height="${bot - top}" rx="8" style="fill:var(--surface-2)"/>`;
  g += `<rect x="${x0}" y="${thermo}" width="${w}" height="${bot - thermo}" style="fill:var(--sea);opacity:.5"/>`;
  g += `<rect x="${x0}" y="${sea}" width="${w}" height="${thermo - sea}" style="fill:var(--sea);opacity:.22"/>`;
  if (warm > 0) g += `<rect x="${x0}" y="${sea}" width="${w}" height="${wb - sea}" style="fill:var(--c2);opacity:${(0.12 + 0.3 * warm).toFixed(2)}"/>`;
  g += `<path d="M${x0 + w} ${top + (sea0 - top) * 0.3} L${x0 + w * 0.84} ${sea0 - (sea0 - top) * 0.35} L${x0 + w * 0.7} ${thermo} L${x0 + w * 0.6} ${bot} L${x0 + w} ${bot} Z" style="fill:var(--sand);stroke:var(--muted);stroke-width:1.2"/>`;
  g += `<line x1="${x0}" x2="${x0 + w * 0.7}" y1="${thermo}" y2="${thermo}" style="stroke:var(--ink);stroke-width:1.6" stroke-dasharray="7 5"/>`;
  g += `<line x1="${x0}" x2="${x0 + w * 0.86}" y1="${sea0}" y2="${sea0}" style="stroke:var(--muted);stroke-width:1.6" stroke-dasharray="3 4"/>`;
  g += `<line x1="${x0}" x2="${x0 + w * 0.8}" y1="${sea}" y2="${sea}" style="stroke:var(--sea);stroke-width:3.5"/>`;
  g += sT(x0 + 6, y0 + F * 1.05, title, "start", tk, 'font-weight="800"');
  g += sT(x0 + 8, thermo + tk * 1.15, "eau profonde", "start", tk * 0.94);
  g += sT(x0 + 8, thermo - 7, "thermocline", "start", tk * 0.94, 'font-weight="700"');
  if (lift > 3) g += `<line x1="${x0 + w * 0.3}" x2="${x0 + w * 0.3}" y1="${sea0}" y2="${sea}" style="stroke:var(--ink);stroke-width:2"/>` + sT(x0 + w * 0.3 + 6, sea - 6, "hausse du niveau*", "start", tk * 0.94, 'font-weight="700"');
  return g;
}
FIGS.dilat = el => liveSVG(el, (W, F) => {
  const two = W >= 540, gap = F * 0.9, w = two ? (W - gap) / 2 : W, h = Math.min(Math.max(w * 0.62, 10 * F), 13 * F), H = two ? h : h * 2 + gap;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Avant et après réchauffement : la couche d'eau située au-dessus de la thermocline se dilate et le niveau de la mer monte">${oceanPanel(0, w, 0, h, F, 0, 0, "Avant")}${oceanPanel(two ? w + gap : 0, w, two ? 0 : h + gap, h, F, h * 0.09, 0.7, "Après réchauffement")}</svg>`;
});

/* --- Doc. 3 : coupe de la grotte Cosquer (schéma redessiné) --- */
const SL = [[-20, -130], [-18, -125], [-16, -115], [-14, -95], [-12, -65], [-10, -40], [-8, -15], [-6, -3], [-4, 0], [0, 0]];
const seaLevel = ka => { for (let i = 1; i < SL.length; i++) if (ka <= SL[i][0]) { const [a, b] = [SL[i - 1], SL[i]]; return a[1] + (b[1] - a[1]) * (ka - a[0]) / (b[0] - a[0]); } return 0; };
let _cq = 0;
function drawCosquer(W, F, lvl, dyn) {
  const tk = TK(F), H = Math.min(Math.max(W * 0.56, 13 * F), 19 * F), top = F * 0.4, ph = H - top - 2, id = "cq" + (++_cq);
  const Y = m => top + (55 - m) / 205 * ph, X = f => f * W, pt = a => a.map(([f, m]) => X(f).toFixed(1) + "," + Y(m).toFixed(1)).join(" ");
  const land = [[0, -146], [0.14, -122], [0.27, -82], [0.35, -46], [0.36, -28], [0.4, -5], [0.47, 22], [0.6, 40], [1, 46], [1, -150], [0, -150]];
  const cave = [[0.345, -33], [0.5, -22], [0.6, -8], [0.66, 12], [0.76, 18], [0.85, 8], [0.87, -12], [0.76, -14], [0.66, -12], [0.58, -22], [0.48, -32], [0.345, -42]];
  const yl = Y(lvl), wh = Math.max(0, top + ph - yl);
  let g = `<defs><clipPath id="${id}"><polygon points="${pt(cave)}"/></clipPath><clipPath id="${id}b"><rect x="0" y="${top}" width="${W}" height="${ph}" rx="8"/></clipPath></defs><g clip-path="url(#${id}b)">`;
  g += `<rect x="0" y="${top}" width="${W}" height="${ph}" style="fill:var(--surface-2)"/>`;
  g += `<rect x="0" y="${yl}" width="${W}" height="${wh}" style="fill:var(--sea);opacity:.42"/><line x1="0" x2="${W}" y1="${yl}" y2="${yl}" style="stroke:var(--sea);stroke-width:3.5"/>`;
  if (dyn && lvl < -1) g += `<line x1="0" x2="${W}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--muted);stroke-width:1.5" stroke-dasharray="4 4"/>`;
  g += `<polygon points="${pt(land)}" style="fill:var(--sand);stroke:var(--muted);stroke-width:1.2"/>`;
  g += `<polygon points="${pt(cave)}" style="fill:var(--surface)"/><g clip-path="url(#${id})"><rect x="0" y="${yl}" width="${W}" height="${wh}" style="fill:var(--sea);opacity:.55"/></g><polygon points="${pt(cave)}" style="fill:none;stroke:var(--ink);stroke-width:1.4"/></g>`;
  g += sT(6, Y(0) - 6, dyn ? "niveau actuel" : "niveau de la mer aujourd'hui", "start", tk * 0.92, dyn ? "" : 'font-weight="700"');
  g += `<line x1="${X(0.02)}" x2="${X(0.34)}" y1="${Y(-37)}" y2="${Y(-37)}" style="stroke:var(--ink);stroke-width:1.5"/>` + sT(6, Y(-37) - 6, "entrée : −37 m", "start", tk * 0.94, 'font-weight="700"');
  g += sT(X(0.53), Y(-50), "galerie (175 m)", "middle", tk * 0.94) + `<line x1="${X(0.5)}" x2="${X(0.5)}" y1="${Y(-44)}" y2="${Y(-29)}" style="stroke:var(--ink);stroke-width:1.5"/>`;
  g += sT(X(0.98), Y(-72), "salle ornée de peintures", "end", tk * 0.94, 'font-weight="700"') + `<line x1="${X(0.78)}" x2="${X(0.78)}" y1="${Y(-64)}" y2="${Y(-15)}" style="stroke:var(--ink);stroke-width:1.5"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Coupe simplifiée de la grotte Cosquer : entrée à 37 m sous le niveau actuel de la mer, galerie de 175 m qui remonte vers une salle ornée, en partie hors de l'eau">${g}</svg>`;
}
FIGS.cosquer = el => liveSVG(el, (W, F) => drawCosquer(W, F, 0, false));

/* --- Doc. 3 : carte de la banquise antarctique (schéma simplifié) --- */
FIGS.banquise = el => liveSVG(el, (W, F) => {
  const tk = TK(F), H = Math.min(W * 0.78, 17 * F), cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.46;
  const blob = (r0, f) => { let d = ""; for (let i = 0; i <= 72; i++) { const t = i / 72 * 2 * Math.PI, r = R * r0 * f(t); d += (i ? "L" : "M") + (cx + r * Math.cos(t)).toFixed(1) + "," + (cy + r * Math.sin(t)).toFixed(1); } return d + "Z"; };
  let g = `<rect x="0" y="0" width="${W}" height="${H}" rx="10" style="fill:var(--sea)"/>`;
  g += `<path d="${blob(0.74, t => 1 + 0.09 * Math.sin(3 * t + 1) + 0.06 * Math.cos(5 * t) - 0.1 * Math.exp(-Math.pow(t - 3.9, 2) * 3))}" style="fill:var(--ice);opacity:.95"/>`;
  g += `<path d="${blob(0.44, t => 1 + 0.2 * Math.sin(2 * t + 0.6) + 0.1 * Math.cos(3 * t))}" style="fill:var(--c6);stroke:var(--ink);stroke-width:1"/>`;
  g += `<path d="${blob(0.93, t => 1 + 0.04 * Math.sin(2 * t) + 0.03 * Math.cos(4 * t + 2))}" style="fill:none;stroke:var(--c2);stroke-width:${Math.max(3, F * 0.18)}"/>`;
  g += `<text x="${cx}" y="${cy - 2}" text-anchor="middle" style="fill:var(--surface);font-size:${tk}px;font-weight:800">Continent</text><text x="${cx}" y="${cy + tk * 1.1}" text-anchor="middle" style="fill:var(--surface);font-size:${tk}px;font-weight:800">antarctique</text>`;
  g += `<text x="${cx}" y="${cy - R * 0.585}" text-anchor="middle" style="fill:#11282e;font-size:${tk}px;font-weight:800">Banquise</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Carte schématique : autour du continent antarctique, la banquise d'octobre 2023 reste partout en deçà de la ligne orange qui marque son extension moyenne de 1991 à 2020">${g}</svg>`;
});

/* ======================= SIMULATIONS ======================= */
const WID = {};

/* --- Atelier 1 : dilatation de l'océan (débloquée) --- */
WID.dilat = el => {
  el.innerHTML = nb(`<p class="lead">Fais varier la hausse de température et l'épaisseur de la couche qui se réchauffe (au maximum 1 000 m : la thermocline). Coefficient de dilatation : 2,6 × 10⁻⁴ °C⁻¹.</p>
    <div class="field"><label for="dlT">Hausse de température de la couche : <b class="num" id="dlTv"></b></label><input id="dlT" type="range" min="0" max="4" step="0.5" value="1"></div>
    <div class="field"><label for="dlH">Épaisseur de la couche réchauffée : <b class="num" id="dlHv"></b></label><input id="dlH" type="range" min="100" max="1000" step="100" value="1000"></div>
    <div class="figbox" id="dlFig"></div><p class="cap">Pointillés gris : niveau initial · zone orangée : eau réchauffée. * Hauteur exagérée (échelle non respectée).</p>
    <div class="bigres"><p>Hausse du niveau marin</p><p class="score-big num" id="dlR" aria-live="polite"></p><p class="lead" id="dlC"></p></div>`);
  const T = $("#dlT", el), Hh = $("#dlH", el); let cur = 0, tgt = 0, raf = 0;
  const fig = liveSVG($("#dlFig", el), (W, F) => { const h = Math.min(Math.max(W * 0.42, 9 * F), 12 * F); return `<svg viewBox="0 0 ${W} ${h}" width="${W}" height="${h}" role="img" aria-label="Coupe de l'océan : le niveau monte quand la couche superficielle se dilate">${oceanPanel(0, W, 0, h, F, cur * h * 0.2, +T.value / 4, "Océan", +Hh.value / 1000)}</svg>`; });
  const step = () => { cur += (tgt - cur) * 0.18; if (Math.abs(tgt - cur) < 0.004) cur = tgt; fig.draw(); if (cur !== tgt && document.body.contains(el)) raf = requestAnimationFrame(step); };
  const upd = () => {
    const dT = +T.value, h = +Hh.value, dh = h * 2.6e-4 * dT; tgt = dh / 1.04;
    $("#dlTv", el).textContent = "+ " + fmt(dT, 1) + NB + "°C"; $("#dlHv", el).textContent = fmt(h) + NB + "m";
    $("#dlR", el).textContent = fmt(dh * 100, 1) + NB + "cm"; $("#dlC", el).textContent = `${fmt(h)}${NB}m × 2,6 × 10⁻⁴ × ${fmt(dT, 1)} = ${fmt(dh, 3)}${NB}m`;
    cancelAnimationFrame(raf); raf = requestAnimationFrame(step);
  };
  T.oninput = upd; Hh.oninput = upd; upd();
};

/* --- Atelier 1 : inertie thermique, air et eau chauffés par la même lampe --- */
const INERT = (() => { const f = (t, tau) => t <= 20 ? 30 - 10 * Math.exp(-t / tau) : 20 + (10 - 10 * Math.exp(-20 / tau)) * Math.exp(-(t - 20) / tau); const air = [], eau = []; for (let t = 0; t <= 60; t += 2) { air.push([t, Math.round(f(t, 5) * 10) / 10]); eau.push([t, Math.round(f(t, 20) * 10) / 10]); } return { air, eau }; })();
WID.inertie = el => {
  el.innerHTML = nb(`<p class="lead">Une même lampe chauffe 1 kg d'air et 1 kg d'eau, tous deux à 20 °C au départ. Elle s'éteint au bout de 20 min.</p><p class="readout" id="inSt" aria-live="polite"></p><div class="chartbox" id="inCh"></div>`);
  mountChart($("#inCh", el), { type: "line", series: [{ name: "Air", pts: INERT.air, color: "c2", w: 3.2 }, { name: "Eau", pts: INERT.eau, color: "c1", w: 3.2 }], xMin: 0, xMax: 60, xStep: 10, yMin: 18, yMax: 32, yStep: 2, anim: true, animStart: "empty", animDur: 9000,
    bands: [{ x0: 0, x1: 20, label: "lampe allumée" }], xTitle: "Temps (min)", yTitle: "Température (°C)", xRead: v => "t = " + v + NB + "min", yRead: v => fmt(v, 1) + NB + "°C", h: 15,
    alt: "Température de l'air et de l'eau en fonction du temps",
    onCut: x => { const s = $("#inSt", el); if (s) s.innerHTML = x <= 0 ? "💡 Lampe prête. Touche « Lancer »." : x < 20 ? `💡 <b>Lampe allumée</b> · t = ${Math.round(x)}${NB}min` : x < 60 ? `○ <b>Lampe éteinte</b> · t = ${Math.round(x)}${NB}min` : "○ Fin de l'expérience : touche le graphique pour lire les valeurs."; } });
};

/* --- Atelier 2 : remontée de la mer et grotte Cosquer (débloquée) --- */
WID.cosquer = el => {
  el.innerHTML = nb(`<p class="lead">Remonte 20 000 ans en arrière, puis laisse la mer remonter jusqu'à aujourd'hui. À partir de quand l'entrée de la grotte est-elle sous l'eau ?</p>
    <div class="row animctl" id="cqCtl"></div><div class="field"><label for="cqS">Époque : <b class="num" id="cqV"></b></label><input id="cqS" type="range" min="-20" max="0" step="0.5" value="-20"></div>
    <div class="figbox" id="cqFig"></div><p class="readout" id="cqSt" aria-live="polite"></p>`);
  let ka = -20; const fig = liveSVG($("#cqFig", el), (W, F) => drawCosquer(W, F, seaLevel(ka), true)), s = $("#cqS", el);
  const paint = () => { const l = Math.round(seaLevel(ka)); $("#cqV", el).textContent = ka > -0.25 ? "aujourd'hui" : "il y a " + fmt(Math.round(-ka * 1000)) + NB + "ans"; $("#cqSt", el).innerHTML = `Niveau de la mer : <b>${l === 0 ? "0" : "−" + Math.abs(l)}${NB}m</b> · entrée de la grotte : <b>${l < -37 ? "à l'air libre" : "sous l'eau"}</b>`; fig.draw(); };
  const ctl = animCtl($("#cqCtl", el), 9000, p => { ka = -20 + 20 * p; s.value = ka; paint(); });
  s.oninput = () => ctl.set((+s.value + 20) / 20);
};

/* --- Atelier 2 : TP virtuel, banquise ou glaces continentales --- */
function drawTP(W, F, p) {
  const tk = TK(F), H = Math.min(Math.max(W * 0.66, 15 * F), 21 * F), gl = tk * 2.6, bw = Math.min((W - 2 * gl - F * 3.1) / 2, F * 9);
  const off = Math.max(0, (W - (2 * gl + 2 * bw + F * 3.1)) / 2), xs = [off + gl, off + gl + bw + F * 2.2 + gl], top = F * 5, bot = H - F * 2, bh = bot - top, Y = v => bot - v / 400 * bh;
  let g = `<line x1="0" x2="${W}" y1="${bot + 2}" y2="${bot + 2}" style="stroke:var(--muted);stroke-width:2"/>`;
  [[300, 300], [200, 250]].forEach(([v0, v1], i) => {
    const x = xs[i], lv = v0 + (v1 - v0) * p, yl = Y(lv);
    g += `<rect x="${x + 1.5}" y="${yl}" width="${bw - 3}" height="${bot - yl}" style="fill:var(--sea);opacity:.3"/><line x1="${x + 1.5}" x2="${x + bw - 1.5}" y1="${yl}" y2="${yl}" style="stroke:var(--sea);stroke-width:2.5"/>`;
    for (let v = 10; v <= 400; v += 10) { const len = v % 100 === 0 ? F * 1 : v % 50 === 0 ? F * 0.65 : F * 0.3; g += `<line x1="${x}" x2="${x + len}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:var(--ink);stroke-width:${v % 50 === 0 ? 1.8 : 1}"/>`; if (v % 100 === 0) g += sT(x - 6, Y(v) + tk * 0.35, v, "end", tk); }
    g += `<path d="M${x} ${top - F * 0.3} L${x} ${bot} L${x + bw} ${bot} L${x + bw} ${top - F * 0.3}" style="fill:none;stroke:var(--ink);stroke-width:2.5;stroke-linejoin:round"/>`;
    g += `<line x1="${x + bw - F * 1.1}" x2="${x + bw + F * 0.55}" y1="${Y(v0)}" y2="${Y(v0)}" style="stroke:var(--bad);stroke-width:3.5"/>`;
    g += sT(x + bw / 2, H - F * 0.45, "Bécher " + (i + 1), "middle", tk, 'font-weight="800"');
    const s = bw * 0.27 * Math.cbrt(1 - p);
    if (i === 0 && s > 1.5) [0.3, 0.7].forEach(f => { g += `<rect x="${x + bw * f - s / 2}" y="${yl - s * 0.1}" width="${s}" height="${s}" rx="3" style="fill:var(--ice);stroke:var(--ink);stroke-width:1.5"/>`; });
    if (i === 1) {
      const x1 = x - gl - F * 0.55, y1 = top - F * 3.6, x2 = x + bw * 0.5, y2 = top - F * 1.2, a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      g += `<line x1="${x1 + 4}" x2="${x1 + 4}" y1="${y1}" y2="${bot}" style="stroke:var(--c5);stroke-width:${F * 0.22}"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:var(--c5);stroke-width:${F * 0.38};stroke-linecap:round"/>`;
      if (s > 1.5) [0.3, 0.68].forEach(f => { g += `<g transform="translate(${x1 + (x2 - x1) * f},${y1 + (y2 - y1) * f - F * 0.19}) rotate(${a.toFixed(1)})"><rect x="${-s / 2}" y="${-s}" width="${s}" height="${s}" rx="3" style="fill:var(--ice);stroke:var(--ink);stroke-width:1.5"/></g>`; });
      if (p > 0 && p < 1) [0, 1, 2].forEach(k => { const q = (p * 14 + k / 3) % 1; g += `<circle cx="${x2 + 3}" cy="${y2 + q * (yl - y2)}" r="${F * 0.15}" style="fill:var(--sea)"/>`; });
    }
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Deux béchers gradués de 0 à 400 mL. Bécher 1 : deux glaçons flottent dans l'eau. Bécher 2 : deux glaçons sont posés sur une planche inclinée au-dessus de l'eau.">${g}</svg>`;
}
WID.tp = el => {
  el.innerHTML = nb(`<p class="lead"><b>Bécher 1</b> : deux glaçons flottent dans l'eau (banquise). <b>Bécher 2</b> : deux glaçons sont posés sur une planche inclinée (glaces continentales). Le trait rouge marque le niveau de départ.</p>
    <div class="row animctl" id="tpCtl"></div><p class="readout" id="tpSt" aria-live="polite"></p><div class="figbox" id="tpFig"></div>
    <p class="cap">Graduations en mL : grand trait tous les 100 mL, trait moyen tous les 50 mL, petit trait tous les 10 mL.</p>`);
  let p = 0; const fig = liveSVG($("#tpFig", el), (W, F) => drawTP(W, F, p));
  animCtl($("#tpCtl", el), 9000, q => { p = q; fig.draw(); $("#tpSt", el).innerHTML = q <= 0 ? "<b>Début</b> : repère les deux niveaux de départ." : q < 1 ? `Fonte en cours… ${Math.round(q * 100)}${NB}%` : "<b>Fin</b> : tous les glaçons ont fondu. Lis les deux niveaux."; });
};

/* --- Atelier 2 : albédo d'une surface (débloqué) --- */
const SURF = [["Glace", 0.6, 0.6, "ice"], ["Océan", 0.05, 0.1, "sea"], ["Forêt", 0.05, 0.2, "c4"], ["Moyenne terrestre", 0.3, 0.3, "c6"]];
WID.albedo = el => {
  let k = 0, ice = 10;
  el.innerHTML = nb(`<p class="lead">Choisis une surface : l'épaisseur des flèches montre la part du rayonnement solaire réfléchie et la part absorbée.</p>
    <div class="seg" role="group" aria-label="Surface">${SURF.map((s, i) => `<button type="button" data-k="${i}">${s[0]}</button>`).join("")}</div>
    <div class="figbox" id="alFig"></div><p class="readout" id="alR" aria-live="polite"></p>
    <h4>Une planète « glace + océan »</h4><div class="field"><label for="alS">Part de la surface couverte de glace : <b class="num" id="alSv"></b></label><input id="alS" type="range" min="0" max="100" step="5" value="10"></div>
    <div class="mosaic" aria-hidden="true"><i id="alMi" style="background:var(--ice)"></i><i id="alMo" style="background:var(--sea);flex:1"></i></div>
    <p class="readout" id="alM" aria-live="polite"></p><p class="cap">Calcul fait avec un albédo de 0,6 pour la glace et de 0,075 pour l'océan (milieu de l'intervalle 0,05-0,1).</p>`);
  const fig = liveSVG($("#alFig", el), (W, F) => {
    const tk = TK(F), H = Math.min(Math.max(W * 0.5, 11 * F), 14 * F), gy = H - F * 2.6, s = SURF[k], a = (s[1] + s[2]) / 2, base = F * 1.5, cx = W / 2;
    let g = `<rect x="0" y="0" width="${W}" height="${gy}" rx="8" style="fill:var(--surface-2)"/><rect x="0" y="${gy}" width="${W}" height="${H - gy}" style="fill:var(--${s[3]});opacity:${s[3] === "ice" ? 1 : 0.55};stroke:var(--muted);stroke-width:1.2"/>`;
    g += arrow(cx - W * 0.3, F * 1.4, cx - 6, gy - 4, base, "c5") + arrow(cx + 6, gy - 4, cx + W * 0.3, F * 1.4, base * a, "c5", 0.85) + arrow(cx, gy + 2, cx, H - 4, base * (1 - a), "c2");
    g += sT(cx - W * 0.3 + base, F * 1.2, "reçu : 100 %", "start", tk, 'font-weight="700"') + sT(Math.min(W - 4, cx + W * 0.3 + base), F * 1.2, "réfléchi", "end", tk, 'font-weight="700"') + sT(cx + base, H - F * 0.7, "absorbé", "start", tk, 'font-weight="700"') + sT(8, H - F * 0.7, s[0], "start", tk, 'font-weight="800"');
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Rayonnement reçu, réfléchi et absorbé par la surface choisie">${g}</svg>`;
  });
  const pc = v => fmt(Math.round(v * 100));
  const upd = () => {
    $$(".seg button", el).forEach((b, i) => b.setAttribute("aria-pressed", i === k ? "true" : "false")); fig.draw();
    const s = SURF[k]; $("#alR", el).innerHTML = s[1] === s[2] ? `<b>${s[0]}</b> · albédo ${fmt(s[1], 2)} → réfléchi : <b>${pc(s[1])}${NB}%</b> · absorbé : <b>${pc(1 - s[1])}${NB}%</b>` : `<b>${s[0]}</b> · albédo ${fmt(s[1], 2)} à ${fmt(s[2], 2)} → réfléchi : <b>${pc(s[1])} à ${pc(s[2])}${NB}%</b> · absorbé : <b>${pc(1 - s[2])} à ${pc(1 - s[1])}${NB}%</b>`;
    const f = ice / 100, am = f * 0.6 + (1 - f) * 0.075; $("#alSv", el).textContent = ice + NB + "%"; $("#alMi", el).style.width = ice + "%";
    $("#alM", el).innerHTML = `Albédo moyen : <b>${fmt(am, 2)}</b> → énergie solaire absorbée : <b>${pc(1 - am)}${NB}%</b>`;
  };
  $$(".seg button", el).forEach(b => b.onclick = () => { k = +b.dataset.k; upd(); });
  $("#alS", el).oninput = e => { ice = +e.target.value; upd(); }; upd();
};

/* --- Atelier 2 : la boucle glaces-albédo en action (débloquée) --- */
function loopModel(D) {
  const tau = 30, m = 1.5, kf = 0.25, T0 = [], T1 = [], A0 = [], A1 = []; let t1 = 0;
  for (let y = 0; y <= 200; y++) {
    const t0 = D * (1 - Math.exp(-y / tau));
    if (y % 10 === 0) { T0.push([y, Math.round(t0 * 100) / 100]); T1.push([y, Math.round(t1 * 100) / 100]); A0.push([y, Math.round((15 - m * t0) * 10) / 10]); A1.push([y, Math.round((15 - m * t1) * 10) / 10]); }
    t1 += (D + kf * m * t1 - t1) / tau;
  }
  return { T0, T1, A0, A1 };
}
WID.loop = el => {
  el.innerHTML = nb(`<p class="lead">On impose un réchauffement de départ, puis on compare deux mondes : l'un où la fonte des glaces ne change pas l'albédo (sans rétroaction), l'autre où elle le fait baisser (avec rétroaction). Modèle très simplifié.</p>
    <div class="field"><label for="lpD">Réchauffement imposé au départ : <b class="num" id="lpDv"></b></label><input id="lpD" type="range" min="1" max="3" step="0.5" value="2"></div>
    <div class="row animctl" id="lpCtl"></div><div class="fb neutral" id="lpRes" aria-live="polite"></div>
    <h4>Température</h4><div class="chartbox" id="lpT"></div><h4>Surface des glaces</h4><div class="chartbox" id="lpA"></div>`);
  let D = 2, M, chT, chA, ctl;
  const tabs = h => $$("details.tbl", el).forEach(d => { d.hidden = h; });
  const build = () => {
    M = loopModel(D); $("#lpDv", el).textContent = "+ " + fmt(D, 1) + NB + "°C";
    const base = { type: "line", xMin: 0, xMax: 200, xStep: 50, xTitle: "Temps (années)", xRead: v => "Année " + v, h: 13 };
    chT = mountChart($("#lpT", el), Object.assign({}, base, { series: [{ name: "Avec rétroaction glaces-albédo", pts: M.T1, color: "c2", w: 3.2 }, { name: "Sans rétroaction", pts: M.T0, color: "c6", w: 2.4 }], yMin: 0, yMax: 5, yStep: 1, yTitle: "Réchauffement (°C)", yRead: v => "+ " + fmt(v, 1) + NB + "°C", alt: "Réchauffement en fonction du temps, avec et sans rétroaction" }));
    chA = mountChart($("#lpA", el), Object.assign({}, base, { series: [{ name: "Avec rétroaction glaces-albédo", pts: M.A1, color: "c2", w: 3.2 }, { name: "Sans rétroaction", pts: M.A0, color: "c6", w: 2.4 }], yMin: 6, yMax: 16, yStep: 2, yTitle: "Surface des glaces (10⁶ km²)", yRead: v => fmt(v, 1) + " × 10⁶" + NB + "km²", alt: "Surface des glaces en fonction du temps, avec et sans rétroaction" }));
  };
  const onP = p => {
    [chT, chA].forEach(c => { c.cut = p >= 1 ? null : p * 200; c.sel = null; c.draw(); }); tabs(p < 1);
    const r = $("#lpRes", el), a = M.T1[20][1], b = M.T0[20][1];
    if (p >= 1) { r.className = "box info"; r.innerHTML = `<p class="lab">ℹ Résultat de la simulation</p><p><b>Après 200 ans : + ${fmt(a, 1)}${NB}°C avec la rétroaction, contre + ${fmt(b, 1)}${NB}°C sans (× ${fmt(a / b, 1)}).</b> Il reste ${fmt(M.A1[20][1], 1)} × 10⁶${NB}km² de glaces au lieu de ${fmt(M.A0[20][1], 1)} × 10⁶${NB}km².</p><p>La fonte des glaces renforce le réchauffement qui l'a provoquée.</p>`; }
    else { r.className = "fb neutral"; r.innerHTML = `<p class="h">${p <= 0 ? "Touche « Lancer » : le résultat s'affiche à la fin du tracé." : "Année " + Math.round(p * 200) + "…"}</p>`; }
  };
  build(); ctl = animCtl($("#lpCtl", el), 8000, onP);
  $("#lpD", el).oninput = e => { D = +e.target.value; ctl.pause(); ctl.p = 0; build(); ctl.set(0); };
};

/* --- Atelier 3 : une forêt qui grandit --- */
const STOCK = [[0, 10], [25, 50], [50, 130], [75, 180], [100, 196], [125, 200], [150, 200]];
const stockAt = x => { for (let i = 1; i < STOCK.length; i++) if (x <= STOCK[i][0]) { const [a, b] = [STOCK[i - 1], STOCK[i]]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return 200; };
WID.foret = el => {
  el.innerHTML = nb(`<p class="lead">On plante une forêt sur un terrain nu et on suit, pendant 150 ans, le carbone stocké dans ses arbres.</p><div class="figbox" id="foFig"></div><p class="readout" id="foSt" aria-live="polite"></p><div class="chartbox" id="foCh"></div>`);
  let age = 0;
  const fig = liveSVG($("#foFig", el), (W, F) => {
    const H = F * 6, gy = H - F * 0.6, n = Math.max(5, Math.min(11, Math.floor(W / (F * 3.2)))), s = stockAt(age) / 200; let g = `<rect x="0" y="0" width="${W}" height="${gy}" rx="8" style="fill:var(--surface-2)"/><rect x="0" y="${gy}" width="${W}" height="${H - gy}" style="fill:var(--sand)"/>`;
    for (let i = 0; i < n; i++) { const x = W * (i + 0.5) / n, k = 0.82 + 0.18 * Math.sin(i * 2.3 + 1), h = Math.max(F * 0.35, F * 4.6 * s * k), r = Math.max(F * 0.22, h * 0.36); g += `<rect x="${x - Math.max(1.5, r * 0.14)}" y="${gy - h * 0.55}" width="${Math.max(3, r * 0.28)}" height="${h * 0.55}" style="fill:var(--c5)"/><ellipse cx="${x}" cy="${gy - h * 0.66}" rx="${r}" ry="${h * 0.36}" style="fill:var(--c4)"/>`; }
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Rangée d'arbres dont la taille suit l'âge de la forêt">${g}</svg>`;
  });
  mountChart($("#foCh", el), { type: "line", series: [{ name: "Carbone stocké", pts: STOCK, color: "c4", w: 3.4 }], markers: true, xMin: 0, xMax: 150, xStep: 25, yMin: 0, yMax: 220, yStep: 40, anim: true, animStart: "empty", animDur: 9000,
    xTitle: "Âge de la forêt (années)", yTitle: "Carbone stocké (t par hectare)", xRead: v => v + NB + "ans", yRead: v => fmt(v) + NB + "t de carbone par hectare", h: 14, alt: "Carbone stocké dans la forêt en fonction de son âge",
    onCut: x => { age = x; if (fig) fig.draw(); const s = $("#foSt", el); if (s) s.innerHTML = x <= 0 ? "🌱 Terrain tout juste planté. Touche « Lancer »." : x < 150 ? `🌳 Âge de la forêt : <b>${Math.round(x)}${NB}ans</b>` : "🌳 Forêt de 150 ans : touche le graphique pour lire les valeurs."; } });
};
WID.puits = el => {
  el.innerHTML = nb(`<p class="lead">Le puits de carbone est ce que la forêt stocke en plus chaque année : c'est la pente de la courbe précédente.</p><div class="chartbox" id="puCh"></div>
    <div class="box key"><p class="lab">✔ Règle clé</p><p>Forêt jeune : le stock augmente, le puits est fort. Forêt ancienne à l'équilibre : le stock est élevé mais ne varie plus, le puits est nul.</p></div>`);
  const pts = STOCK.slice(1).map((p, i) => [(p[0] + STOCK[i][0]) / 2, Math.round((p[1] - STOCK[i][1]) / 25 * 100) / 100]);
  mountChart($("#puCh", el), { type: "line", series: [{ name: "Puits de carbone", pts, color: "c1", w: 3.4 }], markers: true, xMin: 0, xMax: 150, xStep: 25, yMin: 0, yMax: 4, yStep: 1, anim: true, animStart: "empty", animDur: 6000,
    xTitle: "Âge de la forêt (années)", yTitle: "Puits (t par hectare et par an)", xRead: v => "Vers " + fmt(v, 1) + NB + "ans", yRead: v => fmt(v, 2) + NB + "t par hectare et par an", h: 13, alt: "Puits de carbone de la forêt en fonction de son âge" });
};
