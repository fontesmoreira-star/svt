/* ===== 5e EIST · Vitesses et mouvements : figures et simulations ===== */
Store.key = "eist5-vitesses-mouvements-v1";
const WID = {};
const CHR = [[0, .2, .4, .6, .8, 1], [0, .1, .3, .6, 1], [0, .4, .7, .9, 1]];
const posAt = (a, u) => { const n = a.length - 1, x = Math.max(0, Math.min(n, u * n)), i = Math.min(n - 1, Math.floor(x)); return a[i] + (a[i + 1] - a[i]) * (x - i); };

/* --- document : les trois mouvements de la fiche (points toutes les 5 s) --- */
function drawChrono(W, F, u) {
  const tk = TK(F), rowH = F * 3.3, H = rowH * 3 + F * 0.4, L = F * 0.9, R = F * 1.6, pw = W - L - R, dyn = u !== null; let g = "";
  CHR.forEach((a, i) => {
    const y = F * 2.2 + i * rowH, X = f => L + f * pw, shown = dyn ? a.filter((f, k) => k / (a.length - 1) <= u + 1e-6) : a;
    g += sT(L - 4, y - F * 1.05, "Mouvement " + (i + 1), "start", tk, 'font-weight="800"');
    g += `<line x1="${X(0)}" x2="${X(1)}" y1="${y}" y2="${y}" style="stroke:var(--muted);stroke-width:2"/>`;
    shown.forEach(f => { g += `<circle cx="${X(f)}" cy="${y}" r="${F * 0.3}" style="fill:var(--dot)"/>`; });
    if (dyn) g += `<text x="${X(posAt(a, u))}" y="${y - F * 0.35}" text-anchor="middle" style="font-size:${F * 1.25}px">🚀</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Trois lignes de points. Mouvement 1 : six points régulièrement espacés. Mouvement 2 : cinq points de plus en plus écartés. Mouvement 3 : cinq points de plus en plus rapprochés.">${g}</svg>`;
}
WID.chronoFig = el => { el.innerHTML = `<div class="figbox"></div><p class="cap">Chaque point marque la position de l'objet toutes les 5 secondes. L'objet se déplace de gauche à droite.</p>`; liveSVG($(".figbox", el), (W, F) => drawChrono(W, F, null)); };
WID.chrono3 = el => {
  el.innerHTML = `<p class="lead">Les trois objets partent en même temps. Chacun laisse un point toutes les 5 secondes.</p><div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div>`;
  let u = 0; const fig = liveSVG($(".figbox", el), (W, F) => drawChrono(W, F, u));
  animCtl($(".animctl", el), 8000, p => { u = p; fig.draw(); $(".readout", el).innerHTML = p >= 1 ? "<b>Arrivée.</b> Mouvement 1 : uniforme · mouvement 2 : accéléré · mouvement 3 : ralenti." : `Temps : <b>${Math.round(p * 25)}${NB}s</b>`; });
};

/* --- le rover à piloter : un point chaque seconde --- */
WID.rover = el => {
  el.innerHTML = `<p class="lead">Le rover laisse un point <b>chaque seconde</b>. Change sa vitesse pendant qu'il roule et regarde l'écart entre les points.</p>
    <div class="pilot"><button class="btn" type="button" data-a="run"></button><button class="btn ghost" type="button" data-a="up">⏫ Accélérer</button><button class="btn ghost" type="button" data-a="down">⏬ Freiner</button><button class="btn ghost" type="button" data-a="reset">${CT.animReset}</button></div>
    <p class="readout" aria-live="polite"></p><div class="gauge" aria-hidden="true"><i></i></div><div class="figbox"></div>`;
  const S0 = () => ({ x: 0, v: 4, tgt: 4, t: 0, dots: [0], play: false, lt: 0 }); let s = S0(), raf = 0;
  const fig = liveSVG($(".figbox", el), (W, F) => { const H = F * 4.2, y = F * 2.9, L = F * 0.8, pw = W - L * 2, X = x => L + x / 100 * pw; let g = `<rect x="0" y="${y - F * 0.5}" width="${W}" height="${F}" rx="${F * 0.5}" style="fill:var(--trk)"/>`; s.dots.forEach(d => { g += `<circle cx="${X(d)}" cy="${y}" r="${F * 0.27}" style="fill:var(--dot)"/>`; }); g += `<text x="${X(s.x)}" y="${y - F * 0.75}" text-anchor="middle" style="font-size:${F * 1.5}px">🚙</text>`; return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Piste : le rover avance de gauche à droite et laisse un point chaque seconde">${g}</svg>`; });
  const run = $('[data-a="run"]', el);
  const paint = () => { run.textContent = s.play ? CT.animPause : s.x >= 100 ? "▶ Rejouer" : s.t > 0 ? CT.animResume : CT.animRun; $(".readout", el).innerHTML = s.x >= 100 ? `<b>Arrivée</b> en ${fmt(s.t, 1)}${NB}s. Regarde l'écart entre les points, puis recommence autrement.` : `Vitesse du rover : <b>${fmt(Math.round(s.v))}</b> · temps : <b>${Math.floor(s.t)}${NB}s</b>`; $(".gauge i", el).style.width = Math.min(100, s.v / 16 * 100) + "%"; fig.draw(); };
  const frame = ts => { if (!s.play) return; if (!document.body.contains(el)) { s.play = false; return; } const dt = s.lt ? Math.min(0.1, (ts - s.lt) / 1000) : 0; s.lt = ts;
    s.v += Math.sign(s.tgt - s.v) * Math.min(Math.abs(s.tgt - s.v), 5 * dt); const t1 = s.t + dt; if (Math.floor(t1) > Math.floor(s.t)) s.dots.push(s.x + s.v * (Math.floor(t1) - s.t)); s.t = t1; s.x += s.v * dt;
    if (s.x >= 100) { s.x = 100; s.play = false; } paint(); if (s.play) raf = requestAnimationFrame(frame); };
  run.onclick = () => { if (s.play) { s.play = false; cancelAnimationFrame(raf); } else { if (s.x >= 100) { const tg = s.tgt; s = S0(); s.tgt = tg; } s.play = true; s.lt = 0; raf = requestAnimationFrame(frame); } paint(); };
  $('[data-a="up"]', el).onclick = () => { s.tgt = Math.min(16, s.tgt + 4); paint(); };
  $('[data-a="down"]', el).onclick = () => { s.tgt = Math.max(1, s.tgt - 4); paint(); };
  $('[data-a="reset"]', el).onclick = () => { s.play = false; cancelAnimationFrame(raf); s = S0(); paint(); };
  paint();
};

/* --- la course sur 100 m (débloquée) --- */
const RUN = [["🐌", "Escargot", 0.013], ["🚶", "Marcheur", 1.7], ["🏃", "Usain Bolt", 10], ["🐆", "Guépard", 110 / 3.6], ["🚗", "Voiture", 130 / 3.6]];
WID.course = el => {
  el.innerHTML = `<p class="lead">Tout le monde parcourt 100 m à sa vitesse. Qui arrive en premier ?</p><div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div>
    <p class="cap">À 0,013 m/s, l'escargot mettrait plus de 2 heures pour faire 100 m.</p>`;
  let t = 0; const T = 12;
  const fig = liveSVG($(".figbox", el), (W, F) => { const tk = TK(F), rowH = F * 2.5, H = rowH * RUN.length + F * 0.6, L = F * 0.6, R = F * 5.2, pw = W - L - R; let g = `<line x1="${L + pw}" x2="${L + pw}" y1="0" y2="${H}" style="stroke:var(--bad);stroke-width:3" stroke-dasharray="6 5"/>`;
    RUN.forEach(([e, n, v], i) => { const y = F * 1.9 + i * rowH, d = Math.min(100, v * t), done = v * t >= 100; g += `<rect x="${L}" y="${y - F * 0.35}" width="${pw}" height="${F * 0.5}" rx="${F * 0.25}" style="fill:var(--trk)"/><text x="${L + d / 100 * pw}" y="${y - F * 0.3}" text-anchor="middle" style="font-size:${F * 1.35}px">${e}</text>` + sT(W - 2, y + tk * 0.1, done ? fmt(100 / v, 1) + " s" : fmt(d, d < 10 ? 2 : 0) + " m", "end", tk, 'font-weight="700"'); });
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Course sur 100 mètres entre un escargot, un marcheur, Usain Bolt, un guépard et une voiture">${g}</svg>`; });
  animCtl($(".animctl", el), T * 1000, p => { t = p * T; fig.draw(); $(".readout", el).innerHTML = `Chronomètre : <b>${fmt(t, 1)}${NB}s</b>${p >= 1 ? " · le marcheur et l'escargot sont encore en route !" : ""}`; });
};

/* --- graphique de la fusée (document) et vol synchronisé (débloqué) --- */
const FUS = [[0, 0], [5, 10], [10, 20], [15, 30], [20, 40], [25, 50], [30, 50], [35, 50], [40, 50], [45, 50], [50, 45], [55, 40], [60, 35], [65, 30], [70, 25], [75, 20]];
const fusSpec = extra => Object.assign({ type: "line", series: [{ name: "Vitesse de la fusée", pts: FUS, color: "c2", w: 3 }], markers: true, xMin: 0, xMax: 80, xStep: 10, yMin: 0, yMax: 60, yStep: 10, xTitle: "Temps (s)", yTitle: "Vitesse (m/s)", xRead: v => "t = " + v + NB + "s", yRead: v => fmt(v) + NB + "m/s", h: 15, alt: "Vitesse de la fusée en fonction du temps" }, extra || {});
WID.graphFig = el => { el.innerHTML = `<div class="chartbox"></div>`; mountChart($(".chartbox", el), fusSpec({ tableOpen: false })); };
const fusV = t => posAtXY(FUS, t);
function posAtXY(a, x) { for (let i = 1; i < a.length; i++) if (x <= a[i][0]) return a[i - 1][1] + (a[i][1] - a[i - 1][1]) * (x - a[i - 1][0]) / (a[i][0] - a[i - 1][0]); return a[a.length - 1][1]; }
const FDIST = (() => { const d = [[0, 0]]; let s = 0; for (let t = 1; t <= 75; t++) { s += (fusV(t - 1) + fusV(t)) / 2; d.push([t, s]); } return d; })();
WID.fusee = el => {
  el.innerHTML = `<p class="lead">La fusée suit exactement le graphique. Elle laisse un point toutes les 5 secondes : regarde l'écart entre les points.</p><div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div><div class="chartbox"></div>`;
  let t = 0; const tot = FDIST[75][1];
  const fig = liveSVG($(".figbox", el), (W, F) => { const H = F * 4, y = F * 2.9, L = F * 0.9, pw = W - L * 2, X = d => L + d / tot * pw; let g = `<rect x="0" y="${y - F * 0.5}" width="${W}" height="${F}" rx="${F * 0.5}" style="fill:var(--trk)"/>`; for (let k = 0; k <= t; k += 5) g += `<circle cx="${X(posAtXY(FDIST, k))}" cy="${y}" r="${F * 0.25}" style="fill:var(--dot)"/>`; g += `<text x="${X(posAtXY(FDIST, t))}" y="${y - F * 0.7}" text-anchor="middle" style="font-size:${F * 1.4}px">🚀</text>`; return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="La fusée avance et laisse un point toutes les 5 secondes">${g}</svg>`; });
  const ch = mountChart($(".chartbox", el), fusSpec({ table: false }));
  animCtl($(".animctl", el), 12000, p => { t = p * 75; ch.cut = p >= 1 ? null : t; ch.sel = null; ch.draw(); fig.draw(); const v = fusV(t); $(".readout", el).innerHTML = `t = <b>${Math.round(t)}${NB}s</b> · vitesse : <b>${fmt(Math.round(v))}${NB}m/s</b> · mouvement <b>${t < 25 ? "accéléré" : t <= 45 ? "uniforme" : "ralenti"}</b>`; });
};
