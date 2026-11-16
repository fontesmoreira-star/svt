/* ===== 5e EIST · Révision Mission 4 : graphique à construire et simulations ===== */
Store.key = "eist5-revision-mission4-v1";
const WID = {};

/* --- graphique à construire : toucher la grille pour placer chaque point --- */
function mountPlot(el, p, v, checked, onChange) {
  el.innerHTML = `${tbl([p.xName, ...p.pts.map(q => fmt(q[0]))], [[p.yName, ...p.pts.map(q => fmt(q[1]))]])}<p class="lead">Touche le quadrillage pour placer chaque point du tableau. Touche de nouveau pour le déplacer.</p><div class="figbox" tabindex="0"></div><p class="readout" aria-live="polite"></p><div class="row"><button type="button" class="btn ghost" data-clear>Effacer mes points</button></div>`;
  let geo = null; const host = $(".figbox", el), n = () => p.pts.filter((q, i) => v[i] !== undefined).length;
  const fig = liveSVG(host, (W, F) => {
    const tk = TK(F), H = Math.min(Math.max(W * 0.62, 17 * F), 20 * F), L = F * 3, R = F * 0.9, T = F * 1.3, B = F * 3, pw = W - L - R, ph = H - T - B;
    const X = x => L + x / p.xMax * pw, Y = y => T + (p.yMax - y) / (p.yMax - p.yMin) * ph; geo = { L, T, pw, ph };
    let g = "";
    for (let y = p.yMin; y <= p.yMax + 1e-9; y += p.snap) g += `<line x1="${L}" x2="${L + pw}" y1="${Y(y)}" y2="${Y(y)}" style="stroke:var(--${y === 0 ? "muted" : "grid"});stroke-width:${y === 0 ? 1.6 : 1}"/>` + sT(L - 6, Y(y) + tk * 0.35, fmt(y), "end", tk);
    for (let x = 0; x <= p.xMax; x++) g += `<line x1="${X(x)}" x2="${X(x)}" y1="${T}" y2="${T + ph}" style="stroke:var(--grid)"/>` + sT(X(x), T + ph + tk * 1.3, x, "middle", tk);
    g += `<line x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:1.6"/>` + sT(L + pw / 2, H - F * 0.4, p.xTitle, "middle", tk, 'font-weight="700"') + sT(4, T - F * 0.45, p.yTitle, "start", tk, 'font-weight="700"');
    const placed = p.pts.map((q, i) => v[i] === undefined ? null : [q[0], v[i], i]).filter(Boolean);
    if (placed.length > 1) g += `<path d="${placed.map((q, i) => (i ? "L" : "M") + X(q[0]).toFixed(1) + "," + Y(q[1]).toFixed(1)).join(" ")}" style="fill:none;stroke:var(--c1);stroke-width:2.5"/>`;
    placed.forEach(q => { const bad = checked && q[1] !== p.pts[q[2]][1]; g += `<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="${F * 0.3}" style="fill:var(--${bad ? "bad" : checked ? "ok" : "c2"});stroke:var(--surface);stroke-width:2"/>` + (checked ? sT(X(q[0]), Y(q[1]) - F * 0.5, bad ? "✗" : "✓", "middle", tk, `font-weight="800" style="fill:var(--${bad ? "bad" : "ok"})"`) : ""); });
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Quadrillage pour construire le graphique : ${n()} point(s) placé(s) sur ${p.pts.length}">${g}</svg>`;
  });
  const say = () => { $(".readout", el).innerHTML = `<b>${n()}</b> point(s) placé(s) sur ${p.pts.length}.`; };
  host.addEventListener("pointerdown", e => {
    const svg = host.querySelector("svg"); if (!svg || !geo) return; const r = svg.getBoundingClientRect(), k = svg.viewBox.baseVal.width / r.width, sx = (e.clientX - r.left) * k, sy = (e.clientY - r.top) * k;
    const xv = (sx - geo.L) / geo.pw * p.xMax, yv = p.yMax - (sy - geo.T) / geo.ph * (p.yMax - p.yMin); let bi = 0; p.pts.forEach((q, i) => { if (Math.abs(q[0] - xv) < Math.abs(p.pts[bi][0] - xv)) bi = i; });
    const y = Math.max(p.yMin, Math.min(p.yMax, Math.round(yv / p.snap) * p.snap)); v[bi] = y; checked = false; fig.draw(); say(); onChange(v);
  });
  $("[data-clear]", el).onclick = () => { Object.keys(v).forEach(k => delete v[k]); checked = false; fig.draw(); say(); onChange(v); };
  say();
}

/* --- les trois états de l'eau : curseur de température et particules --- */
WID.thermo = el => {
  el.innerHTML = `<p class="lead">Change la température de l'eau pure et observe son état et l'agitation des particules.</p><div class="field"><label for="thS">Température : <b class="num" id="thV"></b></label><input id="thS" type="range" min="-20" max="120" step="5" value="-20"></div><p class="readout" id="thR" aria-live="polite"></p><div class="figbox" style="max-width:24rem;margin:0 auto"></div>`;
  let T = -20, t0 = performance.now(); const N = 30, seed = Array.from({ length: N }, (_, i) => [Math.sin(i * 12.9898) * 43758.5453 % 1, Math.sin(i * 78.233) * 12543.123 % 1].map(x => Math.abs(x)));
  const fig = liveSVG($(".figbox", el), (W, F) => { const H = W * 0.7, t = (performance.now() - t0) / 1000, st = T < 0 ? 0 : T < 100 ? 1 : T === 100 ? 1.5 : 2, amp = st === 0 ? 1.2 : st < 2 ? 4 : 9; let g = `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="12" style="fill:var(--surface-2);stroke:var(--ink);stroke-width:2"/>`;
    for (let i = 0; i < N; i++) { let x, y; const c = i % 6, r = Math.floor(i / 6), s = W * 0.085;
      if (st === 0) { x = W / 2 + (c - 2.5) * s; y = H - s * 0.9 - r * s; }
      else if (st < 2 && !(st === 1.5 && i % 3 === 0)) { x = W * 0.08 + seed[i][0] * W * 0.84; y = H - s * 0.6 - seed[i][1] * H * 0.36; }
      else { x = W * 0.08 + seed[i][0] * W * 0.84 + Math.sin(t * 1.3 + i) * W * 0.05; y = H * 0.08 + seed[i][1] * H * 0.8 + Math.cos(t * 1.1 + i * 2) * H * 0.05; }
      g += `<circle cx="${(x + Math.sin(t * 7 + i * 3) * amp).toFixed(1)}" cy="${(y + Math.cos(t * 6 + i * 5) * amp).toFixed(1)}" r="${s * 0.36}" style="fill:var(--sea)"/>`; }
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Particules d'eau : rangées et serrées à l'état solide, serrées mais désordonnées à l'état liquide, dispersées à l'état gazeux">${g}</svg>`; });
  const upd = () => { $("#thV", el).textContent = (T < 0 ? "−" + (-T) : T) + NB + "°C"; $("#thR", el).innerHTML = T < 0 ? "État <b>solide</b> : particules rangées, serrées, qui vibrent sur place." : T === 0 ? "<b>0 °C</b> : solide et liquide en même temps." : T < 100 ? "État <b>liquide</b> : particules serrées, mais qui glissent les unes sur les autres." : T === 100 ? "<b>100 °C</b> : liquide et gaz en même temps." : "État <b>gazeux</b> : particules dispersées, très agitées."; };
  $("#thS", el).oninput = e => { T = +e.target.value; upd(); };
  const loop = () => { if (!document.body.contains(el)) return; fig.draw(); requestAnimationFrame(loop); }; upd(); requestAnimationFrame(loop);
};

/* --- la balance : un glaçon fond dans un verre d'eau --- */
WID.balance = el => {
  el.innerHTML = `<p class="lead">Un verre d'eau contenant un glaçon est posé sur une balance. On attend que le glaçon fonde.</p><div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox" style="max-width:22rem;margin:0 auto"></div>`;
  let p = 0; const fig = liveSVG($(".figbox", el), (W, F) => { const tk = TK(F), H = W * 0.95, by = H - F * 3.2, gx = W * 0.3, gw = W * 0.4, gt = F * 1.2, s = gw * 0.34 * Math.cbrt(1 - p), wl = gt + (by - gt) * 0.35;
    let g = `<rect x="${gx}" y="${wl}" width="${gw}" height="${by - wl}" style="fill:var(--sea);opacity:.3"/><path d="M${gx} ${gt} L${gx} ${by} L${gx + gw} ${by} L${gx + gw} ${gt}" style="fill:none;stroke:var(--ink);stroke-width:2.5"/>`;
    if (s > 1.5) g += `<rect x="${gx + gw / 2 - s / 2}" y="${wl - s * 0.1}" width="${s}" height="${s}" rx="3" style="fill:var(--ice);stroke:var(--ink);stroke-width:1.5"/>`;
    g += `<rect x="${W * 0.12}" y="${by}" width="${W * 0.76}" height="${F * 0.5}" rx="4" style="fill:var(--c6)"/><rect x="${W * 0.2}" y="${by + F * 0.5}" width="${W * 0.6}" height="${F * 2.3}" rx="8" style="fill:var(--surface-2);stroke:var(--ink);stroke-width:2"/>` + sT(W / 2, by + F * 2.05, "250,0 g", "middle", tk * 1.4, 'font-weight="800"');
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Verre d'eau avec un glaçon posé sur une balance qui affiche une masse">${g}</svg>`; });
  animCtl($(".animctl", el), 7000, q => { p = q; fig.draw(); $(".readout", el).innerHTML = q <= 0 ? "<b>Début</b> : le glaçon flotte. Lis la masse affichée." : q < 1 ? "Le glaçon fond…" : "<b>Fin</b> : tout le glaçon a fondu. Lis de nouveau la masse."; });
};

/* --- courbes données en document --- */
const SOL = [[0, 20], [1, 10], [2, 5], [3, 0], [4, 0], [5, 0], [6, 0], [7, -5], [8, -10]];
const FUS = [[0, -10], [1, -5], [2, 0], [3, 0], [4, 0], [5, 0], [6, 5], [7, 10], [8, 15]];
const curve = (pts, bands) => el => { el.innerHTML = `<div class="chartbox"></div>`; mountChart($(".chartbox", el), { type: "line", series: [{ name: "Température de l'eau", pts, color: "c1", w: 3 }], markers: true, bands, xMin: 0, xMax: 8, xStep: 1, yMin: -15, yMax: 25, yStep: 5, xTitle: "Temps (min)", yTitle: "Température (°C)", xRead: v => "t = " + v + NB + "min", yRead: v => fmt(v) + NB + "°C", h: 14, alt: "Température de l'eau en fonction du temps" }); };
WID.solDoc = curve(SOL, [{ x0: 0, x1: 3, label: "zone A" }, { x0: 6, x1: 8, label: "zone C" }]);
WID.fusDoc = curve(FUS, []);
