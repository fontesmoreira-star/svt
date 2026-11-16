/* ===== 5e EIST · Fusée à eau : banc d'essai virtuel ===== */
Store.key = "eist5-fusee-a-eau-v1";
const WID = {};
const WATER = [["Vide", 0, 0.04], ["Un tiers", 0.33, 1], ["Deux tiers", 0.66, 0.5], ["Pleine", 1, 0.08]];
const flight = o => ({ alt: Math.round(40 * WATER[o.water][2] * (o.nose ? 1 : 0.75) * (o.fins ? 1 : 0.4)), wob: !o.fins && WATER[o.water][2] > 0.1 });
WID.banc = el => {
  const o = { water: 0, nose: 0, fins: 0 }, hist = []; let p = 0, cur = flight(o);
  const OPT = [["water", "Eau", WATER.map(w => w[0])], ["nose", "Coiffe", ["Sans", "Avec"]], ["fins", "Ailerons", ["Sans", "Avec"]]];
  el.innerHTML = `<p class="lead">Règle ta fusée à eau, pompe, puis lance. Change <b>un seul réglage à la fois</b> pour comparer.</p>
    <div class="opt3">${OPT.map(([k, lab, ch]) => `<div><span class="lab3">${lab}</span><div class="seg" role="group" aria-label="${lab}">${ch.map((c, j) => `<button type="button" data-k="${k}" data-j="${j}">${c}</button>`).join("")}</div></div>`).join("")}</div>
    <div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div><div class="hist"></div>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), H = Math.min(W * 0.8, 17 * F), gy = H - F * 1.2, L = F * 2.6, Y = m => gy - m / 50 * (gy - F * 1.2); let g = `<rect x="0" y="0" width="${W}" height="${gy}" rx="8" style="fill:var(--sky)"/><rect x="0" y="${gy}" width="${W}" height="${H - gy}" style="fill:var(--gnd)"/>`;
    for (let m = 0; m <= 50; m += 10) g += `<line x1="${L}" x2="${W}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:var(--line)"/>` + sT(L - 6, Y(m) + tk * 0.35, m + " m", "end", tk);
    const up = Math.min(1, p / 0.7), a = cur.alt * (1 - Math.pow(1 - up, 2)), xc = (L + W) / 2, x = xc + (cur.wob ? Math.sin(up * 9) * W * 0.16 * up : 0), rot = cur.wob ? Math.sin(up * 9 + 1) * 55 * up : 0, s = F * 1.25, bh = s * 2.2, y = Y(a) - bh - s * 0.35, wl = WATER[o.water][1] * Math.max(0, 1 - up * 1.6);
    for (let q = 0; q < up; q += 0.05) { const aq = cur.alt * (1 - Math.pow(1 - q, 2)), xq = xc + (cur.wob ? Math.sin(q * 9) * W * 0.16 * q : 0); if (WATER[o.water][1] > 0) g += `<circle cx="${xq}" cy="${Y(aq) - 2}" r="3" style="fill:var(--tank)"/>`; }
    g += `<g transform="translate(${x},${y}) rotate(${rot.toFixed(1)})">${o.fins ? `<path d="M${-s * 0.4} ${bh * 0.6} L${-s} ${bh + s * 0.2} L${-s * 0.4} ${bh} Z M${s * 0.4} ${bh * 0.6} L${s} ${bh + s * 0.2} L${s * 0.4} ${bh} Z" style="fill:var(--c3);stroke:var(--ink);stroke-width:1.2"/>` : ""}<rect x="${-s * 0.4}" y="0" width="${s * 0.8}" height="${bh}" rx="${s * 0.15}" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.5"/><rect x="${-s * 0.4 + 1.5}" y="${bh * (1 - wl)}" width="${s * 0.8 - 3}" height="${bh * wl}" style="fill:var(--tank)"/><rect x="${-s * 0.13}" y="${bh}" width="${s * 0.26}" height="${s * 0.3}" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.5"/>${o.nose ? `<path d="M${-s * 0.4} 0 L0 ${-s * 0.9} L${s * 0.4} 0 Z" style="fill:var(--bad);stroke:var(--ink);stroke-width:1.5"/>` : ""}</g>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Vol de la fusée à eau : altitude de 0 à 50 mètres">${g}</svg>`;
  });
  const desc = () => OPT.map(([k, lab, ch]) => lab.toLowerCase() + " : " + ch[o[k]].toLowerCase()).join(" · ");
  const paintOpts = () => $$("[data-k]", el).forEach(b => b.setAttribute("aria-pressed", o[b.dataset.k] === +b.dataset.j ? "true" : "false"));
  const ctl = animCtl($(".animctl", el), 4500, q => {
    p = q; fig.draw(); const r = $(".readout", el);
    if (q <= 0) r.innerHTML = `Fusée sur le pas de tir · <b>${desc()}</b>. Touche « Lancer ».`;
    else if (q < 1) r.innerHTML = "Décollage…";
    else { r.innerHTML = `Altitude atteinte : <b>${cur.alt}${NB}m</b>${o.water === 0 ? " · sans eau à éjecter, la fusée décolle à peine." : o.water === 3 ? " · plus de place pour l'air comprimé : la fusée décolle à peine." : cur.wob ? " · la fusée part de travers !" : " · vol bien droit."}`; const d = desc(); if (!hist.some(h => h[0] === d)) hist.push([d, cur.alt]); $(".hist", el).innerHTML = tbl(["Mes essais", "Altitude"], hist.map(h => [h[0], h[1] + NB + "m"])); }
  });
  $$("[data-k]", el).forEach(b => b.onclick = () => { o[b.dataset.k] = +b.dataset.j; cur = flight(o); paintOpts(); ctl.set(0); });
  paintOpts();
};
