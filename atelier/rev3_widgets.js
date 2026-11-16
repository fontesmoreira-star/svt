/* ===== 3e SVT · Révision du chapitre 1 : schémas et animation ===== */
Store.key = "svt3-revision-ch1-v1";
const WID = {};
const em = (x, y, e, size) => `<text x="${x}" y="${y}" text-anchor="middle" style="font-size:${size}px">${e}</text>`;

/* --- activité 2 : un arbre généalogique (famille imaginaire) --- */
WID.arbre = el => {
  el.innerHTML = `<div class="figbox"></div><p class="cap"><span class="swl"><span><i style="background:var(--has)"></i>possède une fossette au menton</span><span><i style="background:var(--surface)"></i>n'en possède pas</span></span>Carré : homme · rond : femme. Famille imaginaire.</p>`;
  liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), H = F * 12.5, s = F * 1.5, cx = W / 2, dx = Math.min(W * 0.22, F * 5), ys = [F * 1.2, F * 5.4, F * 9.6];
    const P = (x, y, m, has, n) => (m ? `<rect x="${x - s / 2}" y="${y}" width="${s}" height="${s}" rx="4"` : `<circle cx="${x}" cy="${y + s / 2}" r="${s / 2}"`) + ` style="fill:var(--${has ? "has" : "surface"});stroke:var(--ink);stroke-width:2.2"/>` + sT(x, y + s + tk * 1.05, n, "middle", tk * 0.95, 'font-weight="700"');
    const ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:var(--ink);stroke-width:2"/>`;
    let g = ln(cx - dx * 1.5 + s / 2, ys[0] + s / 2, cx - dx * 0.5 - s / 2, ys[0] + s / 2) + ln(cx - dx, ys[0] + s / 2, cx - dx, ys[1]);
    g += ln(cx - dx + s / 2, ys[1] + s / 2, cx + dx * 0.4 - s / 2, ys[1] + s / 2) + ln(cx - dx * 0.3, ys[1] + s / 2, cx - dx * 0.3, ys[2] - F * 0.7) + ln(cx - dx, ys[2] - F * 0.7, cx + dx * 0.4, ys[2] - F * 0.7) + ln(cx - dx, ys[2] - F * 0.7, cx - dx, ys[2]) + ln(cx + dx * 0.4, ys[2] - F * 0.7, cx + dx * 0.4, ys[2]);
    g += P(cx - dx * 1.5, ys[0], 1, 1, "Paul") + P(cx - dx * 0.5, ys[0], 0, 0, "Rose") + P(cx - dx, ys[1], 0, 1, "Anna") + P(cx + dx * 0.4, ys[1], 1, 0, "Marc") + P(cx - dx, ys[2], 0, 1, "Léa") + P(cx + dx * 0.4, ys[2], 1, 0, "Tom");
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Arbre généalogique sur trois générations. Paul, le grand-père, sa fille Anna et sa petite-fille Léa ont une fossette au menton. Rose, Marc et Tom n'en ont pas.">${g}</svg>`;
  });
};

/* --- activité 3 : transfert de noyau chez la vache (schéma redessiné, animé) --- */
function mkClone(full) {
  return el => {
    el.innerHTML = `<div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div>`;
    let p = 0; const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
    const fig = liveSVG($(".figbox", el), (W, F) => {
      const tk = TK(F) * 0.95, H = F * 12.5, E = F * 2.7, y1 = F * 2.6, y2 = F * 8.6, xc = W * 0.36, xm = W * 0.6, ym = F * 5.6, xr = W - F * 2.2;
      let g = em(F * 1.6, y1 + F * 0.6, "🐄", E) + sT(4, y1 + F * 1.9, "donneuse", "start", tk) + sT(4, y1 + F * 1.9 + tk * 1.1, "d'embryon", "start", tk) + em(F * 1.6, y2 + F * 0.6, "🐂", E) + sT(4, y2 + F * 1.9, "donneuse", "start", tk) + sT(4, y2 + F * 1.9 + tk * 1.1, "d'ovule", "start", tk);
      const t1 = (p - 0.15) / 0.2, t2 = (p - 0.4) / 0.25, t3 = (p - 0.68) / 0.17;
      g += `<circle cx="${xc}" cy="${y1}" r="${F * 0.85}" style="fill:var(--cyto);stroke:var(--ink);stroke-width:1.5"/>` + sT(xc, y1 + F * 1.9, "cellule de l'embryon", "middle", tk);
      const ox = lerp(xc, xm, t2), oy = lerp(y2, ym, t2), ovx = lerp(ox, xr, t3), ovy = lerp(oy, ym - F * 1.2, t3);
      if (p < 0.85) g += `<circle cx="${ovx}" cy="${ovy}" r="${F * 1.15}" style="fill:var(--nuc);stroke:var(--ink);stroke-width:1.5"/>`;
      if (p < 0.4) g += sT(xc, y2 + F * 2.1, t1 > 1 ? "ovule sans noyau" : "ovule non fécondé", "middle", tk);
      if (t1 < 1) g += `<circle cx="${xc + lerp(0, F * 1.6, t1)}" cy="${y2 + lerp(0, F * 1.3, t1)}" r="${F * 0.33}" style="fill:var(--c4);opacity:${1 - Math.max(0, t1) * 0.9}"/>`;
      const nx = p < 0.4 ? xc : p < 0.65 ? lerp(xc, xm, t2) : ovx, ny = p < 0.4 ? y1 : p < 0.65 ? lerp(y1, ym, t2) : ovy;
      if (p < 0.85) g += `<circle cx="${nx}" cy="${ny}" r="${F * 0.33}" style="fill:var(--bad)"/>`;
      g += em(xr, ym - F * 0.6, "🐃", E) + sT(W - 4, ym + F * 0.6, "vache porteuse", "end", tk);
      if (p >= 0.85) g += (full ? em(xr, y2 + F * 1, "🐄", E * 0.8) : `<circle cx="${xr}" cy="${y2 + F * 0.4}" r="${F * 1.1}" style="fill:var(--surface-2);stroke:var(--ink);stroke-width:1.5" stroke-dasharray="5 4"/>` + sT(xr, y2 + F * 0.4 + tk * 0.6, "?", "middle", tk * 1.8, 'font-weight="800"')) + sT(W - 4, y2 + F * 2.3, full ? "veau noir et blanc" : "veau", "end", tk, 'font-weight="700"');
      return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Transfert de noyau : le noyau d'une cellule d'embryon de vache noire et blanche est placé dans l'ovule sans noyau d'une vache rousse, puis l'œuf est implanté dans une vache porteuse">${g}</svg>`;
    });
    animCtl($(".animctl", el), 9000, q => { p = q; fig.draw(); $(".readout", el).innerHTML = q <= 0 ? "Deux vaches donneuses : l'une noire et blanche, l'autre rousse." : q < 0.38 ? "<b>1.</b> On retire le noyau de l'ovule de la vache rousse." : q < 0.66 ? "<b>2.</b> On greffe dans cet ovule le noyau d'une cellule de l'embryon noir et blanc." : q < 0.85 ? "<b>3.</b> On implante le nouvel « œuf » dans l'utérus d'une vache porteuse." : full ? "<b>4.</b> Le veau présente tous les caractères de la race noire et blanche." : "<b>4.</b> Un veau naît. De quelle couleur est-il ?"; });
  };
}
WID.clone = mkClone(false); WID.cloneFull = mkClone(true);

/* --- activité 4 : cellule de glande salivaire de larve de chironome (schéma) --- */
WID.chiro = el => {
  el.innerHTML = `<div class="figbox" style="max-width:26rem;margin:0 auto"></div><p class="cap">Schéma d'une cellule de glande salivaire de larve de chironome, vue au microscope (les chromosomes y sont géants).</p>`;
  liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), H = W * 0.72, cx = W * 0.42, cy = H / 2, rx = W * 0.36, ry = H * 0.42, nr = H * 0.26, tx = W - tk * 1.1;
    const tag = (n, x, y, ty) => `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" style="stroke:var(--ink);stroke-width:1.5"/><circle cx="${tx}" cy="${ty}" r="${tk * 0.85}" style="fill:var(--accent)"/><text x="${tx}" y="${ty + tk * 0.36}" text-anchor="middle" style="fill:var(--accent-ink);font-size:${tk}px;font-weight:800">${n}</text>`;
    let g = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" style="fill:var(--cyto);stroke:var(--ink);stroke-width:3"/><circle cx="${cx}" cy="${cy}" r="${nr}" style="fill:var(--nuc);stroke:var(--ink);stroke-width:2"/>`;
    [[-0.45, -0.3, 35], [0.15, 0.05, -50], [-0.25, 0.45, 10]].forEach(([dx, dy, a]) => { const L = nr * 0.95, w = nr * 0.2; let b = ""; for (let i = 0; i < 7; i++) b += `<rect x="${-L / 2 + i * L / 7}" y="${-w / 2}" width="${L / 7}" height="${w}" style="fill:var(--chr);opacity:${i % 2 ? 0.45 : 1}"/>`; g += `<g transform="translate(${cx + dx * nr},${cy + dy * nr}) rotate(${a})">${b}</g>`; });
    g += tag(1, cx + rx * 0.72, cy - ry * 0.7, H * 0.1) + tag(2, cx + rx * 0.72, cy - ry * 0.25, H * 0.35) + tag(3, cx + nr * 0.82, cy + nr * 0.3, H * 0.62) + tag(4, cx + nr * 0.25, cy + nr * 0.52, H * 0.9);
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Cellule avec quatre repères : 1 sur le contour de la cellule, 2 sur la zone entre le contour et le noyau, 3 sur le grand rond central, 4 sur un bâtonnet rayé situé dans ce rond">${g}</svg>`;
  });
};
