/* ===== 5e EIST · Construire une fusée : dessin légendé et atelier de lancement ===== */
Store.key = "eist5-construire-fusee-v1";
const WID = {};

/* --- fusée en coupe, redessinée, avec six repères numérotés --- */
function drawRocket(W, F) {
  const tk = TK(F), H = W * 2.05, cx = W * 0.4, bw = W * 0.3, top = F * 0.4, nose = H * 0.2, bodyT = top + nose, bodyB = H * 0.78, nozB = H * 0.93, x0 = cx - bw / 2, x1 = cx + bw / 2;
  const tag = (n, x, y, tx, ty) => `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" style="stroke:var(--ink);stroke-width:1.5"/><circle cx="${tx}" cy="${ty}" r="${tk * 0.85}" style="fill:var(--accent)"/><text x="${tx}" y="${ty + tk * 0.36}" text-anchor="middle" style="fill:var(--accent-ink);font-size:${tk}px;font-weight:800">${n}</text>`;
  const tx = W - tk * 1.1;
  let g = `<path d="M${x0} ${bodyT} Q${x0} ${top + nose * 0.35} ${cx} ${top} Q${x1} ${top + nose * 0.35} ${x1} ${bodyT} Z" style="fill:var(--metal);stroke:var(--ink);stroke-width:2"/>`;
  g += `<rect x="${x0}" y="${bodyT}" width="${bw}" height="${bodyB - bodyT}" style="fill:var(--metal);stroke:var(--ink);stroke-width:2"/>`;
  g += `<rect x="${x0 + bw * 0.13}" y="${bodyT + H * 0.03}" width="${bw * 0.74}" height="${H * 0.36}" rx="${bw * 0.12}" style="fill:var(--tank);stroke:var(--ink);stroke-width:1.5"/>`;
  g += `<rect x="${x0 + bw * 0.22}" y="${bodyB - H * 0.13}" width="${bw * 0.56}" height="${H * 0.1}" rx="6" style="fill:var(--fire);stroke:var(--ink);stroke-width:1.5"/>`;
  g += `<path d="M${cx - bw * 0.16} ${bodyB} L${cx - bw * 0.36} ${nozB} L${cx + bw * 0.36} ${nozB} L${cx + bw * 0.16} ${bodyB} Z" style="fill:var(--c6);stroke:var(--ink);stroke-width:2"/>`;
  [-1, 1].forEach(s => { g += `<path d="M${cx + s * bw / 2} ${bodyB - H * 0.17} L${cx + s * bw * 1.05} ${bodyB + H * 0.03} L${cx + s * bw / 2} ${bodyB} Z" style="fill:var(--c3);stroke:var(--ink);stroke-width:2"/>`; });
  g += tag(1, cx + bw * 0.1, top + nose * 0.5, tx, top + nose * 0.5) + tag(2, cx + bw * 0.2, bodyT + H * 0.16, tx, bodyT + H * 0.16) + tag(3, x1, bodyT + H * 0.3, tx, bodyT + H * 0.3) + tag(4, cx + bw * 0.2, bodyB - H * 0.08, tx, bodyB - H * 0.12) + tag(6, cx + bw * 0.9, bodyB - H * 0.01, tx, bodyB - H * 0.01) + tag(5, cx + bw * 0.2, (bodyB + nozB) / 2 + 4, tx, nozB - 2);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Fusée en coupe avec six repères : 1 au sommet pointu, 2 sur la grande cuve intérieure, 3 sur la paroi extérieure, 4 sur le bloc situé en bas à l'intérieur, 5 sur le cône évasé tout en bas, 6 sur les petites ailes du bas">${g}</svg>`;
}
const INFOS = [["Coiffe", "Pointe arrondie au sommet de la fusée. Sa forme fend l'air. Elle protège aussi le satellite."], ["Réservoir", "Grande cuve à l'intérieur de la fusée. Il est rempli de carburant (les ergols)."], ["Corps (structure)", "Paroi solide tout autour de la fusée. Elle tient bon malgré la forte pression des gaz."], ["Chambre de combustion", "Partie du moteur où le carburant brûle. Cela produit beaucoup de gaz très chauds, sous forte pression."], ["Tuyère", "Cône évasé tout en bas. Les gaz brûlés sortent par là, à très grande vitesse."], ["Ailerons", "Petites ailes fixées en bas. Ils gardent la fusée bien droite."]];
WID.rocketDoc = el => { el.innerHTML = `<div class="two"><div class="figbox"></div><div class="infos">${shuffle(INFOS, 11).map(([n, t]) => `<div><b>${n}</b><span>${nb(t)}</span></div>`).join("")}</div></div><p class="cap">Dessin simplifié d'une fusée en coupe (les fiches d'information sont dans le désordre).</p>`; liveSVG($(".figbox", el), drawRocket); };

/* --- atelier : choisir la coiffe, les ailerons et le réservoir, puis lancer --- */
const flight = o => { const base = o.tank ? 80 : 40, alt = Math.round(base * (o.nose ? 1 : 0.7) * (o.fins ? 1 : 0.4)); return { alt, wob: !o.fins }; };
WID.atelier = el => {
  const o = { nose: 0, fins: 0, tank: 0 }, hist = []; let p = 0, cur = flight(o);
  const OPT = [["nose", "Sommet", ["Plat", "Coiffe pointue"]], ["fins", "Ailerons", ["Sans", "Avec"]], ["tank", "Réservoir", ["Petit", "Grand"]]];
  el.innerHTML = `<p class="lead">Choisis les éléments de ta fusée, puis lance-la. Change <b>un seul élément à la fois</b> pour comparer.</p>
    <div class="opt3">${OPT.map(([k, lab, ch]) => `<div><span class="lab3">${lab}</span><div class="seg" role="group" aria-label="${lab}">${ch.map((c, j) => `<button type="button" data-k="${k}" data-j="${j}">${c}</button>`).join("")}</div></div>`).join("")}</div>
    <div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div><div class="hist"></div>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), H = Math.min(W * 0.8, 17 * F), gy = H - F * 1.2, L = F * 2.6, Y = m => gy - m / 100 * (gy - F * 1.2); let g = `<rect x="0" y="0" width="${W}" height="${gy}" rx="8" style="fill:var(--sky)"/><rect x="0" y="${gy}" width="${W}" height="${H - gy}" style="fill:var(--gnd)"/>`;
    for (let m = 0; m <= 100; m += 20) g += `<line x1="${L}" x2="${W}" y1="${Y(m)}" y2="${Y(m)}" style="stroke:var(--line)"/>` + sT(L - 6, Y(m) + tk * 0.35, m + " m", "end", tk);
    const up = Math.min(1, p / 0.7), a = cur.alt * (1 - Math.pow(1 - up, 2)), x = (L + W) / 2 + (cur.wob ? Math.sin(up * 9) * W * 0.16 * up : 0), rot = cur.wob ? Math.sin(up * 9 + 1) * 55 * up : 0, s = F * 1.25, y = Y(a) - s * 1.7;
    for (let q = 0; q < up; q += 0.06) { const aq = cur.alt * (1 - Math.pow(1 - q, 2)), xq = (L + W) / 2 + (cur.wob ? Math.sin(q * 9) * W * 0.16 * q : 0); g += `<circle cx="${xq}" cy="${Y(aq) - 2}" r="2.5" style="fill:var(--muted)"/>`; }
    g += `<g transform="translate(${x},${y}) rotate(${rot.toFixed(1)})">${o.fins ? `<path d="M${-s * 0.4} ${s * 1.1} L${-s} ${s * 1.7} L${-s * 0.4} ${s * 1.6} Z M${s * 0.4} ${s * 1.1} L${s} ${s * 1.7} L${s * 0.4} ${s * 1.6} Z" style="fill:var(--c3);stroke:var(--ink);stroke-width:1.2"/>` : ""}<rect x="${-s * 0.4}" y="${o.tank ? -s * 0.6 : 0}" width="${s * 0.8}" height="${o.tank ? s * 2.2 : s * 1.6}" style="fill:var(--metal);stroke:var(--ink);stroke-width:1.5"/>${o.nose ? `<path d="M${-s * 0.4} ${o.tank ? -s * 0.6 : 0} L0 ${(o.tank ? -s * 0.6 : 0) - s * 0.9} L${s * 0.4} ${o.tank ? -s * 0.6 : 0} Z" style="fill:var(--bad);stroke:var(--ink);stroke-width:1.5"/>` : ""}${p > 0 && up < 1 ? `<path d="M${-s * 0.25} ${s * 1.6} L0 ${s * 2.5} L${s * 0.25} ${s * 1.6} Z" style="fill:var(--fire)"/>` : ""}</g>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Vol de la fusée : altitude de 0 à 100 mètres">${g}</svg>`;
  });
  const desc = () => OPT.map(([k, , ch]) => ch[o[k]].toLowerCase()).join(" · ");
  const paintOpts = () => $$("[data-k]", el).forEach(b => b.setAttribute("aria-pressed", o[b.dataset.k] === +b.dataset.j ? "true" : "false"));
  const ctl = animCtl($(".animctl", el), 4500, q => {
    p = q; fig.draw(); const r = $(".readout", el);
    if (q <= 0) r.innerHTML = `Fusée prête : <b>${desc()}</b>. Touche « Lancer ».`;
    else if (q < 1) r.innerHTML = "Décollage…";
    else { r.innerHTML = `Altitude atteinte : <b>${cur.alt}${NB}m</b>${cur.wob ? " · la fusée part de travers et tourne sur elle-même !" : " · vol bien droit."}`; const d = desc(); if (!hist.some(h => h[0] === d)) hist.push([d, cur.alt, cur.wob]); $(".hist", el).innerHTML = tbl(["Mes essais (sommet · ailerons · réservoir)", "Altitude", "Vol"], hist.map(h => [h[0], h[1] + NB + "m", h[2] ? "de travers" : "droit"])); }
  });
  $$("[data-k]", el).forEach(b => b.onclick = () => { o[b.dataset.k] = +b.dataset.j; cur = flight(o); paintOpts(); ctl.set(0); });
  paintOpts();
};
