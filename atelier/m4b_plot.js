/* ---------- tableau « temps / mesure » découpé en blocs pour tenir dans l'écran ---------- */
const tblXin = (xn, yn, xs, ys) => { const F = parseFloat(getComputedStyle(document.documentElement).fontSize) || 20, avail = Math.min(innerWidth, F * 62) - 100, N = Math.floor((avail - F * 7.5) / (F * 3.2)); if (N < 4) return tbl([xn, yn], xs.map((x, i) => [x, ys[i]])); const c = Math.ceil(xs.length / N), per = Math.ceil(xs.length / c); let h = ""; for (let i = 0; i < xs.length; i += per) h += tbl([xn, ...xs.slice(i, i + per)], [[yn, ...ys.slice(i, i + per)]]); return h; };
const tblX = (xn, yn, xs, ys) => `<div class="tblx" data-tx="${esc(JSON.stringify([xn, yn, xs, ys]))}">${tblXin(xn, yn, xs, ys)}</div>`;
addEventListener("resize", () => $$("[data-tx]").forEach(d => { try { d.innerHTML = tblXin(...JSON.parse(d.dataset.tx)); } catch (e) {} }));
/* ---------- question « placer les points » (reprise de la v1) ---------- */
function mountPlot(el, p, v, checked, onChange) {
  el.innerHTML = `${tblX(p.xName, p.yName, p.pts.map(q => fmt(q[0])), p.pts.map(q => fmt(q[1])))}<p class="lead">Touche le quadrillage pour placer chaque point du tableau. Touche de nouveau pour le déplacer.</p><div class="figbox" tabindex="0"></div><p class="readout" aria-live="polite"></p><div class="row"><button type="button" class="btn ghost" data-clear>Effacer mes points</button></div>`;
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

