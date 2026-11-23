/* ===== 2nde SVT · Thème 1 · Chapitre 2 · Le métabolisme des cellules · Fiche de révision animée : les animations =====
   Dix animations : escalier des unités, les deux « ateliers » d'une cellule, cultures de deux micro-organismes mystères,
   molécules de la respiration et des fermentations, photosynthèse, microscope (levures, euglènes) avec règle virtuelle,
   réseau du tilleul, trajet de l'amidon et spécificité de l'amylase, voies du glucose, ExAO de graines de pois.
   Toutes les valeurs numériques sont simulées et signalées ⚠. Chaque animation : Lancer / Pause / Recommencer (animCtl). */
Store.key = "svt2-metabolisme-fiche-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const N1 = x => (+x).toFixed(1);
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const sg = (p, a, b) => cl((p - a) / (b - a), 0, 1);
const ez = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const LP = (a, b, t) => a + (b - a) * t;
const RMO = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
const rnd = seed => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
const s14 = F => Math.max(15, TK(F) * .9);
let UID = 0;

/* texte SVG ; o = { a: ancrage, s: taille, w: graisse, c: couleur, op: opacité, h: halo de lisibilité } */
function tx(x, y, s, o) {
  o = o || {};
  const halo = o.h ? `;paint-order:stroke;stroke:${o.hc || "var(--surface)"};stroke-width:${N1(o.s * .3)}px;stroke-linejoin:round` : "";
  return `<text x="${N1(x)}" y="${N1(y)}" text-anchor="${o.a || "middle"}" style="fill:${o.c || "var(--ink)"};font-size:${N1(o.s)}px;font-weight:${o.w || 700}${o.op !== undefined ? ";opacity:" + N1(o.op) : ""}${halo}">${esc(s)}</text>`;
}
const segH = (name, opts, cur, attr) => `<div class="seg" role="group" aria-label="${name}">${opts.map(([k, lab]) => `<button type="button" data-${attr}="${k}" aria-pressed="${k === cur}">${lab}</button>`).join("")}</div>`;
function bindSeg(host, attr, fn) { $$(`[data-${attr}]`, host).forEach(b => b.onclick = () => { $$(`[data-${attr}]`, host).forEach(c => c.setAttribute("aria-pressed", String(c === b))); fn(b.dataset[attr]); }); }
const svgW = (W, H, label, g) => `<svg viewBox="0 0 ${N1(W)} ${N1(H)}" width="${N1(W)}" height="${N1(H)}" role="img" aria-label="${esc(label)}">${g}</svg>`;

/* ---------- atomes, molécules, énergie ---------- */
const AT = { C: "#454b4f", O: "#e0483a", H: "#f4f6f7" };
const atom = (x, y, r, e) => `<circle cx="${N1(x)}" cy="${N1(y)}" r="${N1(r)}" style="fill:${AT[e]};stroke:#1d2326;stroke-width:${N1(Math.max(.8, r * .14))}"/>`;
function hexa(x, y, R, op, fill) {
  let d = ""; for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; d += (i ? "L" : "M") + N1(x + R * Math.cos(a)) + "," + N1(y + R * Math.sin(a)); }
  return `<path d="${d}Z" style="fill:${fill || "var(--glc)"};stroke:var(--glc-s);stroke-width:${N1(Math.max(1.2, R * .13))};opacity:${N1(op === undefined ? 1 : op)}"/>`;
}
function mol(k, x, y, a, op) {
  op = op === undefined ? 1 : op; if (op <= .01) return "";
  let g = "";
  if (k === "O2") g = atom(x - .78 * a, y, a, "O") + atom(x + .78 * a, y, a, "O");
  else if (k === "CO2") g = atom(x - 1.45 * a, y, a, "O") + atom(x + 1.45 * a, y, a, "O") + atom(x, y, a * .9, "C");
  else if (k === "H2O") g = atom(x - .9 * a, y + .7 * a, a * .6, "H") + atom(x + .9 * a, y + .7 * a, a * .6, "H") + atom(x, y, a, "O");
  else if (k === "glc") g = hexa(x, y, a * 2.1, 1);
  else if (k === "eth") g = atom(x - 1.3 * a, y + .4 * a, a * .55, "H") + atom(x - 1.1 * a, y, a * .85, "C") + atom(x + .1 * a, y - .3 * a, a * .85, "C") + atom(x + 1.3 * a, y, a * .9, "O") + atom(x + 2.1 * a, y - .4 * a, a * .5, "H");
  else if (k === "lac") g = atom(x - 1.4 * a, y, a * .8, "C") + atom(x, y - .3 * a, a * .8, "C") + atom(x + 1.4 * a, y, a * .8, "C") + atom(x, y - 1.5 * a, a * .8, "O") + atom(x + 2.2 * a, y - .9 * a, a * .8, "O") + atom(x + 2.2 * a, y + .9 * a, a * .8, "O");
  return `<g style="opacity:${N1(op)}">${g}</g>`;
}
function spark(x, y, r, op) {
  if (op <= .01) return ""; const k = .3;
  return `<path d="M${N1(x)},${N1(y - r)}L${N1(x + r * k)},${N1(y - r * k)}L${N1(x + r)},${N1(y)}L${N1(x + r * k)},${N1(y + r * k)}L${N1(x)},${N1(y + r)}L${N1(x - r * k)},${N1(y + r * k)}L${N1(x - r)},${N1(y)}L${N1(x - r * k)},${N1(y - r * k)}Z" style="fill:var(--nrg);stroke:var(--nrg-s);stroke-width:1;opacity:${N1(op)}"/>`;
}
const bead = (x, y, r, col, op) => `<circle cx="${N1(x)}" cy="${N1(y)}" r="${N1(r)}" style="fill:${col};stroke:var(--ink);stroke-width:1.2;opacity:${N1(op === undefined ? 1 : op)}"/>`;
const ico = (inner, w, h) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${inner}</svg>`;
const LEG = {
  glc: ["glucose", () => ico(hexa(13, 12, 10), 26, 24)], org: ["molécule organique (ex. : glucose)", () => ico(hexa(13, 12, 10), 26, 24)],
  small: ["petites molécules", () => ico(bead(7, 12, 5, "var(--c1)") + bead(19, 12, 5, "var(--c3)"), 26, 24)],
  O2: ["dioxygène O₂", () => ico(mol("O2", 15, 12, 6), 30, 24)], CO2: ["dioxyde de carbone CO₂", () => ico(mol("CO2", 18, 12, 5.5), 36, 24)],
  H2O: ["eau H₂O", () => ico(mol("H2O", 14, 10, 6), 28, 24)], eth: ["éthanol", () => ico(mol("eth", 15, 13, 5.5), 34, 24)],
  lac: ["acide lactique", () => ico(mol("lac", 12, 15, 4.6), 36, 26)], nrg: ["énergie", () => ico(spark(12, 12, 10, 1), 24, 24)],
  orgp: ["matière organique (sève élaborée, nectar…)", () => ico(`<circle cx="12" cy="12" r="6" style="fill:var(--org);stroke:var(--org-s);stroke-width:1.5"/>`, 24, 24)],
  minp: ["eau et sels minéraux", () => ico(`<circle cx="12" cy="12" r="6" style="fill:var(--min);stroke:var(--min-s);stroke-width:1.5"/>`, 24, 24)],
  lum: ["lumière", () => ico(`<path d="M2,12 q3,-6 6,0 t6,0 t6,0" style="fill:none;stroke:var(--nrg-s);stroke-width:2.5"/>`, 24, 24)]
};
const legend = keys => `<div class="mleg">${keys.map(k => `<span>${LEG[k][1]()}${LEG[k][0]}</span>`).join("")}</div>`;
/* point le long d'une ligne brisée, t de 0 à 1 */
function along(P, t) {
  const L = []; let tot = 0; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); L.push(d); tot += d; }
  let r = cl(t, 0, 1) * tot; for (let i = 0; i < L.length; i++) { if (r <= L[i] || i === L.length - 1) { const f = L[i] ? r / L[i] : 0; return [LP(P[i][0], P[i + 1][0], f), LP(P[i][1], P[i + 1][1], f)]; } r -= L[i]; }
  return P[P.length - 1];
}
const poly = (P, st) => `<polyline points="${P.map(p => N1(p[0]) + "," + N1(p[1])).join(" ")}" style="fill:none;${st}"/>`;

/* =====================================================================
   0. Échauffement · l'escalier des unités
   ===================================================================== */
const ESC = [{ u: "m", p: "10⁰ m", i: "1 m = 1 000 mm", ex: "un tilleul adulte : environ 20 m" },
  { u: "mm", p: "10⁻³ m", i: "1 mm = 1 000 µm = 0,001 m", ex: "une graine de pois : environ 8 mm" },
  { u: "µm", p: "10⁻⁶ m", i: "1 µm = 1 000 nm = 0,001 mm", ex: "une cellule : de quelques µm à quelques dizaines de µm" },
  { u: "nm", p: "10⁻⁹ m", i: "1 nm = 0,001 µm", ex: "une molécule : de l'ordre du nm" }];
WID.escalier = host => {
  let pos = 0, from = 0, t = 1, raf = 0;
  host.innerHTML = `<div class="figbox"></div><div class="row"><button class="btn" type="button" data-d="1">⬇ Descendre d'une marche</button><button class="btn ghost" type="button" data-d="-1">⬆ Monter d'une marche</button></div><p class="esc-info" aria-live="polite"></p>`;
  const fig = liveSVG($(".figbox", host), (W0, F) => {
    const W = Math.min(W0, F * 28), ox = (W0 - W) / 2, tk = TK(F), n = 4, H = cl(W * .46, F * 10, F * 13), sw = W / n, top = tk * 2.6, sh = (H - top - tk * 3.2) / (n - 1);
    let g = "";
    for (let i = 0; i < n; i++) {
      const x0 = i * sw, y0 = top + i * sh, cur = i === pos && t >= 1;
      g += `<rect x="${N1(x0 + 2)}" y="${N1(y0)}" width="${N1(sw - 4)}" height="${N1(H - y0 - 2)}" rx="10" style="fill:${cur ? "var(--accent-soft)" : "var(--surface-2)"};stroke:${cur ? "var(--accent)" : "var(--line)"};stroke-width:${cur ? 2.5 : 1.5}"/>`;
      g += tx(x0 + sw / 2, y0 + tk * 1.5, ESC[i].u, { s: tk * 1.35, w: 800 });
      g += tx(x0 + sw / 2, y0 + tk * 2.85, ESC[i].p, { s: s14(F), w: 600, c: "var(--muted)" });
      if (i < n - 1) g += tx((i + 1) * sw, y0 + sh * .5 + tk * .35, "× 1 000", { s: s14(F), w: 800, c: "var(--accent)", h: 1 });
    }
    const bx = i => i * sw + sw / 2, by = i => top + i * sh - F * .62, e = ez(t);
    const x = LP(bx(from), bx(pos), e), y = LP(by(from), by(pos), e) - Math.sin(Math.PI * e) * F * 1.5;
    g += `<circle cx="${N1(x)}" cy="${N1(y)}" r="${N1(F * .52)}" style="fill:var(--c2);stroke:var(--ink);stroke-width:1.5"/>`;
    return svgW(W0, H, "Escalier des unités de longueur : mètre, millimètre, micromètre, nanomètre. On multiplie par 1 000 à chaque marche descendue.", `<g transform="translate(${N1(ox)},0)">${g}</g>`);
  });
  const info = () => { $(".esc-info", host).innerHTML = nb(`Tu es sur la marche <b>${ESC[pos].u}</b> : ${ESC[pos].i}. Exemple : ${ESC[pos].ex}.`); $$("[data-d]", host).forEach(b => b.disabled = (+b.dataset.d === 1 && pos === 3) || (+b.dataset.d === -1 && pos === 0)); };
  const move = d => {
    const np = cl(pos + d, 0, 3); if (np === pos) return; from = pos; pos = np; info(); cancelAnimationFrame(raf);
    if (RMO) { t = 1; fig.draw(); return; }
    t = 0; let lt = 0; const fr = ts => { if (!lt) lt = ts; t = Math.min(1, (ts - lt) / 520); fig.draw(); if (t < 1 && document.body.contains(host)) raf = requestAnimationFrame(fr); }; raf = requestAnimationFrame(fr);
  };
  $$("[data-d]", host).forEach(b => b.onclick = () => move(+b.dataset.d));
  info();
};

/* =====================================================================
   1a. Les deux ateliers d'une cellule : synthèse et production d'énergie
   ===================================================================== */
function drawUsine(W0, F, p, mode) {
  const W = Math.min(W0, F * 30), ox = (W0 - W) / 2, tk = TK(F), H = cl(W * .64, F * 13, F * 18), syn = mode !== "nrg", nrg = mode !== "syn", a = cl(W * .011, 4.6, 7.5);
  const gr = syn ? ez(sg(p, .15, .95)) : 0, top = tk * 2.1, bot = H - tk * 1.7, cx = W / 2, cy = (top + bot) / 2;
  const rx0 = W * .37, ry0 = (bot - top) / 2 / 1.08, rx = rx0 * (1 + .06 * gr), ry = ry0 * (1 + .08 * gr);
  let g = `<ellipse cx="${N1(cx)}" cy="${N1(cy)}" rx="${N1(rx)}" ry="${N1(ry)}" style="fill:var(--cell);stroke:var(--cell-s);stroke-width:${N1(F * .22)}"/>`;
  if (gr > .02) g += `<ellipse cx="${N1(cx)}" cy="${N1(cy)}" rx="${N1(rx0)}" ry="${N1(ry0)}" style="fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:4 5;opacity:.8"/>`;
  g += `<line x1="${N1(cx)}" y1="${N1(cy - ry * .82)}" x2="${N1(cx)}" y2="${N1(cy + ry * .82)}" style="stroke:var(--line);stroke-width:2;stroke-dasharray:6 6"/>`;
  g += tx(W * .27, tk * 1.2, "Atelier synthèse", { s: tk, op: syn ? 1 : .4 }) + tx(W * .73, tk * 1.2, "Atelier énergie", { s: tk, op: nrg ? 1 : .4 });
  /* synthèse : 6 petites molécules s'assemblent en une grande molécule */
  const cols = ["var(--c1)", "var(--c3)", "var(--c4)", "var(--c2)", "var(--c5)", "var(--c1)"], r = a * 1.25, n = 6;
  const fx = i => cx - rx * .8 + i * (rx * .64 / (n - 1)), fy = cy + ry * .12, opS = syn ? 1 : .22;
  const P = [];
  for (let i = 0; i < n; i++) {
    const tt = ez(sg(p, .06 + i * .1, .24 + i * .1)), sx = r * 1.7 + (i % 2) * r * 2.6, sy = cy + (i - 2.5) * r * 2.7;
    P.push([LP(sx, fx(i), tt), LP(sy, fy, tt) + Math.sin(p * 30 + i) * r * .5 * (1 - tt), tt]);
  }
  for (let i = 1; i < n; i++) if (P[i][2] >= 1 && P[i - 1][2] >= 1) g += `<line x1="${N1(P[i - 1][0])}" y1="${N1(P[i - 1][1])}" x2="${N1(P[i][0])}" y2="${N1(P[i][1])}" style="stroke:var(--ink);stroke-width:${N1(r * .55)};opacity:${opS}"/>`;
  P.forEach((q, i) => g += bead(q[0], q[1], r, cols[i], opS));
  if (syn && p > .78) g += tx((fx(0) + fx(n - 1)) / 2, fy + r * 2 + s14(F), "grande molécule", { s: s14(F), w: 700, c: "var(--muted)", op: sg(p, .78, .86) });
  /* énergie : une molécule organique est dégradée */
  const ex = cx + rx * .45, ey = cy - ry * .05, tin = ez(sg(p, .05, .32)), R = a * 2.4, opE = nrg ? 1 : .22;
  const shake = p > .32 && p < .44 ? Math.sin(p * 220) * R * .1 : 0;
  const hx = LP(W - R * 1.15, ex, tin) + shake, hy = LP(top + R * .4, ey, tin), hop = 1 - sg(p, .44, .52);
  if (hop > 0) g += `<g style="opacity:${N1(opE)}">${hexa(hx, hy, R * (1 + .15 * sg(p, .38, .48)), hop)}</g>`;
  if (p > .42 && p < .5) g += `<circle cx="${N1(ex)}" cy="${N1(ey)}" r="${N1(R * (1 + 2 * sg(p, .42, .5)))}" style="fill:none;stroke:var(--nrg-s);stroke-width:3;opacity:${N1((1 - sg(p, .42, .5)) * opE)}"/>`;
  for (let j = 0; j < 6; j++) {
    const tt = ez(sg(p, .46 + j * .03, .82 + j * .02)), k = j % 2 ? "H2O" : "CO2", txx = W - a * 3.2, tyy = cy - ry * .7 + j * ry * .28;
    if (p > .45) g += mol(k, LP(ex, txx, tt), LP(ey, tyy, tt), a, opE);
  }
  for (let k = 0; k < 5; k++) {
    const tt = sg(p, .47 + k * .06, .78 + k * .04); if (tt <= 0 || tt >= 1) continue;
    const tx2 = mode === "both" ? cx - rx * .5 + k * a * 2 : ex - rx * .25 + k * a * 2.2, ty2 = mode === "both" ? fy - r * 2.6 : cy - ry * .65;
    g += spark(LP(ex, tx2, ez(tt)), LP(ey, ty2, ez(tt)) - Math.sin(Math.PI * tt) * ry * .25, a * 1.6, (1 - sg(tt, .8, 1)) * opE);
  }
  if (nrg && p > .86) g += tx(W * .76, H - tk * .45, "CO₂ et H₂O rejetés", { s: s14(F), c: "var(--muted)", op: sg(p, .86, .92) });
  if (syn && gr > .6) g += tx(W * .24, H - tk * .45, "la cellule grandit", { s: s14(F), c: "var(--muted)", op: sg(gr, .6, .8) });
  if (p <= 0) g += tx(cx, cy + ry * .55, "cellule", { s: s14(F), c: "var(--muted)", w: 600 });
  return svgW(W0, H, "Une cellule avec deux ateliers. À gauche, de petites molécules entrent et s'assemblent en une grande molécule : la cellule grandit. À droite, une molécule organique est dégradée : de l'énergie est libérée, du CO₂ et de l'eau sortent de la cellule.", `<g transform="translate(${N1(ox)},0)">${g}</g>`);
}
WID.usine = host => {
  const x = xst(); x.us = x.us || {};
  let mode = "both", p = 0;
  host.innerHTML = `${segH("Atelier observé", [["syn", "⚙️ Synthèse"], ["nrg", "⚡ Énergie"], ["both", "Les deux ateliers"]], "both", "um")}<div class="figbox"></div><div class="row animctl"></div><p class="cap" aria-live="polite"></p>${legend(["small", "org", "nrg", "CO2", "H2O"])}`;
  const fig = liveSVG($(".figbox", host), (W, F) => drawUsine(W, F, p, mode));
  const cap = () => { $(".cap", host).textContent = p <= 0 ? "Touche ▶ Lancer." : p < 1 ? "Animation en cours…" : mode === "syn" ? "Fin : l'atelier synthèse a fabriqué une grande molécule." : mode === "nrg" ? "Fin : la molécule organique a été dégradée." : "Fin : l'énergie libérée à droite est utilisée à gauche pour les synthèses."; };
  const ctl = animCtl($(".animctl", host), 8000, v => { p = v; fig.draw(); cap(); if (v >= 1) { if (mode !== "nrg") x.us.syn = 1; if (mode !== "syn") x.us.nrg = 1; keep(); } });
  bindSeg(host, "um", k => { mode = k; ctl.set(0); });
};

/* =====================================================================
   1b. Deux micro-organismes mystères en culture (7 jours)
   ===================================================================== */
const CU = { 1: { col: "var(--cy)", g: [8, .1, .1] }, 2: { col: "var(--ye)", g: [.1, .1, 12] } };
const CU_M = ["eau + sels minéraux, à la lumière", "eau + sels minéraux, à l'obscurité", "eau + sels minéraux + glucose, à l'obscurité"];
const cuAt = (o, i, p) => { const f = CU[o].g[i]; return f <= .1 ? .1 : .1 * Math.pow(f / .1, ez(sg(p, .08, .92))); };
function drawCultures(W, F, p, org, id) {
  const tk = TK(F), H = cl(W * .62, F * 12.5, F * 16.5), top = tk * 4.6, bot = H - tk * 1.5, fw = Math.min(W / 3 - 18, F * 6.4);
  let g = tx(W / 2, tk * 1.15, `Micro-organisme ${org === 1 ? "①" : "②"} · jour ${Math.round(7 * sg(p, .05, .95))} sur 7`, { s: tk, w: 800 });
  for (let i = 0; i < 3; i++) {
    const x = W * (2 * i + 1) / 6, nw = fw * .15, bw = fw * .48, nh = (bot - top) * .3;
    const path = `M${N1(x - nw)},${N1(top)} L${N1(x - nw)},${N1(top + nh)} L${N1(x - bw)},${N1(bot - 8)} Q${N1(x - bw)},${N1(bot)} ${N1(x - bw + 8)},${N1(bot)} L${N1(x + bw - 8)},${N1(bot)} Q${N1(x + bw)},${N1(bot)} ${N1(x + bw)},${N1(bot - 8)} L${N1(x + nw)},${N1(top + nh)} L${N1(x + nw)},${N1(top)} Z`;
    const lvl = top + nh + (bot - top - nh) * .25, c = cuAt(org, i, p), gg = cl(Math.log(c / .1) / Math.log(120), 0, 1), cid = `cu${id}-${i}`;
    g += `<clipPath id="${cid}"><path d="${path}"/></clipPath>`;
    g += `<g clip-path="url(#${cid})"><rect x="${N1(x - bw)}" y="${N1(lvl)}" width="${N1(bw * 2)}" height="${N1(bot - lvl)}" style="fill:var(--medium)"/><rect x="${N1(x - bw)}" y="${N1(lvl)}" width="${N1(bw * 2)}" height="${N1(bot - lvl)}" style="fill:${CU[org].col};opacity:${N1(gg * .8)}"/>`;
    const R = rnd(31 + i * 7 + org * 101), nd = Math.round(3 + gg * 46);
    for (let k = 0; k < nd; k++) { const yy = LP(lvl + 4, bot - 4, R()), half = LP(nw, bw, (yy - top - nh) / (bot - top - nh)) - 5, xx = x + (R() * 2 - 1) * half; g += `<circle cx="${N1(xx)}" cy="${N1(yy)}" r="${N1(Math.max(1.6, fw * .022))}" style="fill:${CU[org].col};stroke:var(--ink);stroke-width:.5"/>`; }
    g += `</g><path d="${path}" style="fill:none;stroke:var(--ink);stroke-width:2"/>`;
    g += `<rect x="${N1(x - nw - 3)}" y="${N1(top - 6)}" width="${N1(nw * 2 + 6)}" height="9" rx="3" style="fill:var(--muted)"/>`;
    if (i === 2) for (let k = 0; k < 3; k++) g += hexa(x + (k - 1) * bw * .38, bot - (bot - lvl) * (.3 + (k % 2) * .25), fw * .065, .95);
    if (i === 0) { /* lampe allumée */
      const ly = top - tk * 1.45; g += `<circle cx="${N1(x)}" cy="${N1(ly)}" r="${N1(tk * .55)}" style="fill:var(--nrg);stroke:var(--nrg-s);stroke-width:1.5"/>`;
      for (let k = 0; k < 8; k++) { const an = k * Math.PI / 4; g += `<line x1="${N1(x + Math.cos(an) * tk * .8)}" y1="${N1(ly + Math.sin(an) * tk * .8)}" x2="${N1(x + Math.cos(an) * tk * 1.15)}" y2="${N1(ly + Math.sin(an) * tk * 1.15)}" style="stroke:var(--nrg-s);stroke-width:2"/>`; }
    } else { /* placard noir, ouvert à la fin pour voir le résultat */
      const lift = ez(sg(p, .93, 1)), op = .86 - .72 * lift;
      g += `<rect x="${N1(x - bw - 6)}" y="${N1(top - tk * 2.2 - lift * tk * .8)}" width="${N1(bw * 2 + 12)}" height="${N1(bot - top + tk * 2.2 + 6)}" rx="10" style="fill:#0d1418;opacity:${N1(op)}"/>`;
      g += tx(x, top - tk * 1.15 - lift * tk * .8, "obscurité", { s: s14(F), c: "#e8eef0", op: .4 + .6 * (1 - lift) });
    }
    g += tx(x, H - tk * .3, "ABC"[i], { s: tk * 1.1, w: 800 });
  }
  return svgW(W, H, `Trois flacons de culture du micro-organisme ${org}. A : ${CU_M[0]}. B : ${CU_M[1]}. C : ${CU_M[2]}. Le trouble du flacon indique la multiplication des cellules ; les nombres sont dans le tableau.`, g);
}
WID.cultures = host => {
  const x = xst(); x.cu = x.cu || {};
  let org = 1, p = 0; const id = ++UID;
  host.innerHTML = `${segH("Micro-organisme", [["1", "Micro-organisme ①"], ["2", "Micro-organisme ②"]], "1", "org")}
    <ul class="ul cu-l">${CU_M.map((m, i) => `<li><b>${"ABC"[i]}</b> · ${m}</li>`).join("")}</ul>
    <div class="figbox"></div><div class="row animctl"></div><p class="cap">Touche ▶ Lancer : 7 jours de culture en accéléré.</p><div class="cu-t"></div>`;
  const fig = liveSVG($(".figbox", host), (W, F) => drawCultures(W, F, p, org, id));
  const table = () => {
    const cell = (o, i) => x.cu[o] ? `0,1 → ${fmt(CU[o].g[i])}` : o === org && p > 0 ? `0,1 → ${fmt(cuAt(o, i, p), 1)} …` : "—";
    $(".cu-t", host).innerHTML = `<p class="lead">Nombre de cellules (millions par mL), du jour 0 au jour 7 · <span class="simw">⚠ Valeurs simulées</span></p>` + `<div class="fit">${tbl(["Milieu", "Micro-organisme ①", "Micro-organisme ②"], [0, 1, 2].map(i => [`${"ABC"[i]} · ${CU_M[i]}`, cell(1, i), cell(2, i)]))}</div>`;
  };
  const ctl = animCtl($(".animctl", host), 6000, v => { p = v; fig.draw(); if (v >= 1 && !x.cu[org]) { x.cu[org] = 1; keep(); } table(); });
  bindSeg(host, "org", k => { org = +k; ctl.set(0); });
  table();
};

/* =====================================================================
   2a. Respiration et fermentations : les molécules en mouvement
   ===================================================================== */
const RX = {
  r: { name: "Respiration", eq: "glucose + dioxygène → dioxyde de carbone + eau + énergie", inn: [["glc", 1], ["O2", 6]], out: [["CO2", 6], ["H2O", 6]], e: 1, c: "Atomes de carbone : 6 dans le glucose → 6 dans les 6 CO₂." },
  a: { name: "Fermentation alcoolique", eq: "glucose → dioxyde de carbone + éthanol + énergie", inn: [["glc", 1]], out: [["eth", 2], ["CO2", 2]], e: .06, c: "Atomes de carbone : 6 dans le glucose → 2 × 2 dans l'éthanol + 2 × 1 dans le CO₂ = 6." },
  l: { name: "Fermentation lactique", eq: "glucose → acide lactique + énergie", inn: [["glc", 1]], out: [["lac", 2]], e: .06, c: "Atomes de carbone : 6 dans le glucose → 2 × 3 dans l'acide lactique = 6." } };
const MOLN = { glc: "glucose", O2: "O₂", CO2: "CO₂", H2O: "H₂O", eth: "éthanol", lac: "acide lactique" };
function drawReac(W, F, p, k) {
  const R = RX[k], tk = TK(F), H = cl(W * .56, F * 12, F * 16), a = cl(W * .015, 5, 10.5), cx = W * .44, cy = H * .55;
  let g = tx(W * .2, tk * 1.2, "Au départ", { s: tk, c: "var(--muted)" }) + tx(W * .76, tk * 1.2, "À l'arrivée", { s: tk, c: "var(--muted)" });
  g += `<line x1="${N1(W * .5)}" y1="${N1(tk * .8)}" x2="${N1(W * .5)}" y2="${N1(H - 4)}" style="stroke:var(--line);stroke-width:1.5;stroke-dasharray:5 6"/>`;
  const t1 = ez(sg(p, .04, .3)), jig = p > .3 && p < .42 ? Math.sin(p * 260) * a * .5 : 0, fade = 1 - sg(p, .42, .5);
  const g0 = [W * .2, H * .52], ring = LP(a * 5.4, a * 2.6, t1);
  if (fade > 0) {
    g += mol("glc", LP(g0[0], cx, t1) + jig, LP(g0[1], cy, t1), a * 1.05, fade);
    if (k === "r") for (let i = 0; i < 6; i++) { const an = i * Math.PI / 3 + Math.PI / 6; g += mol("O2", LP(g0[0], cx, t1) + Math.cos(an) * ring - jig, LP(g0[1], cy, t1) + Math.sin(an) * ring, a * .9, fade); }
  }
  const ghost = p < .05 ? 1 : .35 * sg(p, .55, .7);
  if (p >= .05 && ghost > 0) { g += mol("glc", g0[0], g0[1], a * 1.05, ghost); if (k === "r") for (let i = 0; i < 6; i++) { const an = i * Math.PI / 3 + Math.PI / 6; g += mol("O2", g0[0] + Math.cos(an) * a * 5.4, g0[1] + Math.sin(an) * a * 5.4, a * .9, ghost); } }
  if (p < .05 || p > .55) g += tx(g0[0], g0[1] + a * 2.4 + (k === "r" ? a * 5 : 0) + s14(F) * 1.1, k === "r" ? "1 glucose + 6 O₂" : "1 glucose", { s: s14(F), c: "var(--muted)", op: p < .05 ? 1 : sg(p, .55, .7) });
  if (p > .4 && p < .52) g += `<circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(a * (3 + 7 * sg(p, .4, .52)))}" style="fill:none;stroke:var(--nrg-s);stroke-width:3;opacity:${N1(1 - sg(p, .4, .52))}"/>`;
  /* produits : groupes empilés à droite */
  if (p > .44) {
    const gh = s14(F) * 1.35, rowH = a * 3.4, groups = R.out.map(([m, n]) => ({ m, n, rows: Math.ceil(n / 3) }));
    const tot = groups.reduce((s, q) => s + gh + q.rows * rowH, 0) + (groups.length - 1) * a * 1.5; let y = Math.max(tk * 2, cy - tot / 2);
    groups.forEach(q => {
      const lab = y + s14(F); y += gh;
      for (let i = 0; i < q.n; i++) {
        const col = i % 3, row = Math.floor(i / 3), ncol = Math.min(3, q.n), sp = q.m === "lac" ? a * 6.2 : a * 5.6;
        const fx = W * .76 + (col - (ncol - 1) / 2) * sp - (q.m === "lac" ? a * .6 : 0), fy = y + row * rowH + rowH * .45, tt = ez(sg(p, .46 + i * .025, .82 + i * .012));
        g += mol(q.m, LP(cx, fx, tt), LP(cy, fy, tt), a, sg(p, .44, .5));
      }
      g += tx(W * .76, lab, `${q.n} ${MOLN[q.m]}`, { s: s14(F), c: "var(--ink)", op: sg(p, .8, .88) });
      y += q.rows * rowH + a * 1.5;
    });
  }
  const ns = R.e >= 1 ? 10 : 1;
  for (let i = 0; i < ns; i++) {
    const tt = sg(p, .44 + i * .035, .8 + i * .02); if (tt <= 0 || tt >= 1) continue;
    const an = -Math.PI / 2 + (i - (ns - 1) / 2) * .32;
    g += spark(cx + Math.cos(an) * tt * H * .42, cy + Math.sin(an) * tt * H * .42, a * 1.7, 1 - sg(tt, .7, 1));
  }
  return svgW(W, H, `${R.name} : ${R.eq}. Les molécules se rapprochent, réagissent, puis les produits s'éloignent ; de l'énergie est libérée.`, g);
}
WID.reac = host => {
  const x = xst(); x.rx = x.rx || {};
  let k = "r", p = 0;
  host.innerHTML = `${segH("Réaction", Object.entries(RX).map(([kk, r]) => [kk, r.name]), "r", "rk")}<p class="eqn" aria-live="polite"></p><div class="figbox"></div><div class="row animctl"></div>
    <div class="nrgw"><span class="lead">Énergie libérée</span><div class="nrgbar" aria-hidden="true"><i></i></div><span class="nrgv" aria-live="polite">—</span></div><p class="cap carb" aria-live="polite"></p>${legend(["glc", "O2", "CO2", "H2O", "eth", "lac", "nrg"])}`;
  const fig = liveSVG($(".figbox", host), (W, F) => drawReac(W, F, p, k));
  const up = () => {
    const R = RX[k], e = R.e * sg(p, .45, .9);
    $(".eqn", host).innerHTML = nb(`<b>${R.name}</b> : ${R.eq}`);
    $(".nrgbar i", host).style.width = (e * 100).toFixed(1) + "%";
    $(".nrgv", host).textContent = p < .45 ? "—" : R.e >= 1 ? "beaucoup" : "peu (environ 16 fois moins)";
    $(".carb", host).textContent = p >= .86 ? R.c : "";
  };
  const ctl = animCtl($(".animctl", host), 6500, v => { p = v; fig.draw(); up(); if (v >= 1 && !x.rx[k]) { x.rx[k] = 1; keep(); } });
  bindSeg(host, "rk", kk => { k = kk; ctl.set(0); });
};

/* =====================================================================
   2b. La photosynthèse dans un chloroplaste (lampe allumée / éteinte)
   ===================================================================== */
function drawPhoto(W, F, p, on) {
  const tk = TK(F), H = cl(W * .62, F * 12.5, F * 17), a = cl(W * .011, 4.4, 7.4), cx = W * .55, cy = H * .54, rx = W * .29, ry = H * .3;
  let g = `<ellipse cx="${N1(cx)}" cy="${N1(cy)}" rx="${N1(rx)}" ry="${N1(ry)}" style="fill:var(--chl-soft);stroke:var(--chl);stroke-width:${N1(F * .2)}"/>`;
  const R0 = rnd(5);
  for (let i = 0; i < 7; i++) { const tx0 = cx - rx * .7 + i * rx * .23, ty0 = cy + (i % 2 ? .35 : -.38) * ry; for (let j = 0; j < 3; j++) g += `<rect x="${N1(tx0 - rx * .07)}" y="${N1(ty0 + j * a * .9 - a)}" width="${N1(rx * .14)}" height="${N1(a * .7)}" rx="3" style="fill:var(--chl);opacity:.55"/>`; R0(); }
  g += tx(cx + rx * .55, cy - ry - tk * .35, "chloroplaste", { s: s14(F), c: "var(--chl)", h: 1 });
  /* lampe */
  const lx = W * .1, ly = H * .13;
  g += `<circle cx="${N1(lx)}" cy="${N1(ly)}" r="${N1(tk * .75)}" style="fill:${on ? "var(--nrg)" : "var(--surface-2)"};stroke:${on ? "var(--nrg-s)" : "var(--muted)"};stroke-width:2"/>`;
  g += `<rect x="${N1(lx - tk * .35)}" y="${N1(ly + tk * .62)}" width="${N1(tk * .7)}" height="${N1(tk * .5)}" rx="2" style="fill:var(--muted)"/>`;
  g += tx(lx, ly + tk * 2, on ? "allumée" : "éteinte", { s: s14(F), c: "var(--muted)" });
  if (on) for (let k = 0; k < 4; k++) {
    const ph = ((p * 7 + k / 4) % 1), sx = lx + tk, sy = ly + tk * .4, ex = cx - rx * .35, ey = cy - ry * .45;
    const px = LP(sx, ex, ph), py = LP(sy, ey, ph), ang = Math.atan2(ey - sy, ex - sx), L = tk * 1.5;
    if (p > 0) { let d = ""; for (let s = 0; s <= 12; s++) { const u = s / 12 * L, w = Math.sin(s / 12 * Math.PI * 3) * a * .9; d += (s ? "L" : "M") + N1(px + Math.cos(ang) * u - Math.sin(ang) * w) + "," + N1(py + Math.sin(ang) * u + Math.cos(ang) * w); } g += `<path d="${d}" style="fill:none;stroke:var(--nrg-s);stroke-width:2.5;opacity:${N1(Math.sin(ph * Math.PI))}"/>`; }
  }
  /* 6 CO₂ (à gauche) et 6 H₂O (en bas) entrent ; avec lumière : glucose + 6 O₂ */
  const tin = ez(sg(p, .05, .35)), conv = on ? ez(sg(p, .36, .5)) : 0, fade = on ? 1 - sg(p, .46, .54) : 1;
  for (let i = 0; i < 6; i++) {
    const sx = W * .07, sy = H * .4 + i * H * .1, ix = cx - rx * .45 + (i % 2) * rx * .2, iy = cy - ry * .45 + Math.floor(i / 2) * ry * .3;
    const jx = !on && p > .35 ? Math.sin(p * 40 + i) * a * .8 : 0, x0 = LP(sx, ix, tin) + jx, y0 = LP(sy, iy, tin);
    g += mol("CO2", LP(x0, cx, conv), LP(y0, cy, conv), a, fade);
    const hx = cx - rx * .55 + i * rx * .22, hy = H - a * 2.4, jx2 = cx + rx * .05 + (i % 3) * rx * .18, jy2 = cy + ry * .05 + Math.floor(i / 3) * ry * .32;
    const x1 = LP(hx, jx2, tin) - jx, y1 = LP(hy, jy2, tin);
    g += mol("H2O", LP(x1, cx, conv), LP(y1, cy, conv), a, fade);
  }
  if (on && p > .44 && p < .56) g += `<circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(a * (3 + 8 * sg(p, .44, .56)))}" style="fill:none;stroke:var(--nrg-s);stroke-width:3;opacity:${N1(1 - sg(p, .44, .56))}"/>`;
  if (on && p > .48) {
    const s = ez(sg(p, .48, .62)); g += hexa(cx, cy, a * 2.4 * s, 1);
    if (p > .7) g += tx(cx, cy + a * 2.4 + s14(F) * 1.1, "glucose", { s: s14(F), op: sg(p, .7, .78), h: 1 });
    for (let i = 0; i < 6; i++) { const tt = ez(sg(p, .52 + i * .03, .88 + i * .015)), fx = W - a * 2.6, fy = cy - ry * .9 + i * ry * .36; g += mol("O2", LP(cx, fx, tt), LP(cy, fy, tt), a, sg(p, .5, .56)); }
  }
  return svgW(W, H, `Un chloroplaste ; lampe ${on ? "allumée" : "éteinte"}. Six molécules de CO₂ et six molécules d'eau entrent dans le chloroplaste.${on ? " Avec la lumière, elles réagissent : une molécule de glucose est fabriquée et six molécules de dioxygène sont rejetées." : ""}`, g);
}
WID.photo = host => {
  const x = xst(); x.ph = x.ph || {};
  let on = true, p = 0;
  host.innerHTML = `${segH("Lampe", [["on", "☀ Lampe allumée"], ["off", "🌑 Lampe éteinte"]], "on", "lp")}<div class="figbox"></div><div class="row animctl"></div><p class="cap" aria-live="polite"></p>${legend(["lum", "CO2", "H2O", "glc", "O2"])}`;
  const fig = liveSVG($(".figbox", host), (W, F) => drawPhoto(W, F, p, on));
  const cap = () => { $(".cap", host).textContent = p < .9 ? (p > 0 ? "Animation en cours…" : "Touche ▶ Lancer.") : `Glucose fabriqué : ${on ? "1 molécule (6 atomes de carbone, venus des 6 CO₂)" : "0 molécule"}.`; };
  const ctl = animCtl($(".animctl", host), 6500, v => { p = v; fig.draw(); cap(); if (v >= 1 && !x.ph[on ? "on" : "off"]) { x.ph[on ? "on" : "off"] = 1; keep(); } });
  bindSeg(host, "lp", k => { on = k === "on"; ctl.set(0); });
};

/* =====================================================================
   3. Microscope virtuel : levures et euglènes, règle virtuelle et barre d'échelle
   ===================================================================== */
const SL = { l: { name: "Lame 1 · levures", span: 6.4, bar: 5, barCm: 2, cell: 2.4 }, e: { name: "Lame 2 · euglènes", span: 7.8, bar: 20, barCm: 2, cell: 5 } };
function ruler(x0, y, u, len, F) {
  const h = F * 1.25; let g = `<rect x="${N1(x0 - 6)}" y="${N1(y)}" width="${N1(len * u + 12)}" height="${N1(h)}" rx="3" style="fill:#fff6c9;stroke:#8a6a00;stroke-width:1.2;opacity:.93"/>`;
  for (let m = 0; m <= len * 10; m++) { const xx = x0 + m * u / 10, L = m % 10 === 0 ? h * .55 : m % 5 === 0 ? h * .38 : h * .22; g += `<line x1="${N1(xx)}" y1="${N1(y)}" x2="${N1(xx)}" y2="${N1(y + L)}" style="stroke:#3a2c00;stroke-width:${m % 10 === 0 ? 1.4 : .9}"/>`; if (m % 10 === 0) g += `<text x="${N1(xx)}" y="${N1(y + h - 2)}" text-anchor="middle" style="fill:#3a2c00;font-size:${N1(Math.max(11.5, F * .52))}px;font-weight:700">${m / 10}</text>`; }
  return g;
}
/* repère numéroté (légende du dessin) : cercle blanc + numéro, trait jusqu'à l'organite */
function pin(ax, ay, x, y, n, F) { const r = Math.max(10, F * .55); return `<line x1="${N1(ax)}" y1="${N1(ay)}" x2="${N1(x)}" y2="${N1(y)}" style="stroke:#1a1a1a;stroke-width:1.3"/><circle cx="${N1(x)}" cy="${N1(y)}" r="${N1(r)}" style="fill:#fff;stroke:#1a1a1a;stroke-width:1.5"/><text x="${N1(x)}" y="${N1(y + r * .42)}" text-anchor="middle" style="fill:#1a1a1a;font-size:${N1(r * 1.25)}px;font-weight:800">${n}</text>`; }
const MI_LEG = { l: ["noyau", "vacuole", "mitochondrie*", "paroi"], e: ["noyau", "chloroplastes", "stigma (tache rouge)", "flagelle", "mitochondrie*"] };
function yeastCell(xc, yc, L, rot, legendOn, F, main) {
  const w = L * .78, R = rnd(Math.round(xc * 7 + yc));
  let g = `<g transform="rotate(${rot} ${N1(xc)} ${N1(yc)})"><ellipse cx="${N1(xc)}" cy="${N1(yc)}" rx="${N1(L / 2)}" ry="${N1(w / 2)}" style="fill:#f4e5bd;stroke:#8d6d2c;stroke-width:${N1(Math.max(1.6, L * .025))}"/>`;
  g += `<circle cx="${N1(xc + L * .13)}" cy="${N1(yc + L * .02)}" r="${N1(L * .2)}" style="fill:#e3eff5;stroke:#7c99a8;stroke-width:1.2"/>`;
  g += `<circle cx="${N1(xc - L * .2)}" cy="${N1(yc - L * .1)}" r="${N1(L * .1)}" style="fill:#c9acd8;stroke:#6b4a80;stroke-width:1.2"/>`;
  for (let i = 0; i < 5; i++) { const mx = xc + (R() - .5) * L * .6, my = yc + (R() > .5 ? 1 : -1) * L * (.2 + R() * .07); g += `<ellipse cx="${N1(mx)}" cy="${N1(my)}" rx="${N1(L * .055)}" ry="${N1(L * .022)}" transform="rotate(${Math.round(R() * 60 - 30)} ${N1(mx)} ${N1(my)})" style="fill:#e08b55;stroke:#8a4418;stroke-width:.8"/>`; }
  g += `</g>`;
  if (main && legendOn) g += pin(xc - L * .2, yc - L * .1, xc - L * .22, yc - L * .66, 1, F) + pin(xc + L * .2, yc - L * .05, xc + L * .28, yc - L * .66, 2, F) + pin(xc + L * .1, yc + L * .24, xc + L * .66, yc + L * .2, 3, F) + pin(xc - L * .48, yc + L * .1, xc - L * .68, yc + L * .2, 4, F);
  return g;
}
function euglena(x0, yc, L, legendOn, F, main, rot) {
  const w = L * .2, R = rnd(Math.round(x0 * 3 + yc));
  const body = `M${N1(x0)},${N1(yc)} C${N1(x0)},${N1(yc - w * .62)} ${N1(x0 + L * .22)},${N1(yc - w * .58)} ${N1(x0 + L * .48)},${N1(yc - w * .52)} C${N1(x0 + L * .76)},${N1(yc - w * .46)} ${N1(x0 + L * .94)},${N1(yc - w * .12)} ${N1(x0 + L)},${N1(yc + w * .04)} C${N1(x0 + L * .9)},${N1(yc + w * .26)} ${N1(x0 + L * .74)},${N1(yc + w * .5)} ${N1(x0 + L * .48)},${N1(yc + w * .52)} C${N1(x0 + L * .22)},${N1(yc + w * .56)} ${N1(x0)},${N1(yc + w * .5)} ${N1(x0)},${N1(yc)} Z`;
  let g = `<g transform="rotate(${rot || 0} ${N1(x0 + L / 2)} ${N1(yc)})">`;
  g += `<path d="M${N1(x0 + L * .01)},${N1(yc - w * .15)} C${N1(x0 - L * .12)},${N1(yc - w * 1.2)} ${N1(x0 - L * .2)},${N1(yc + w * .8)} ${N1(x0 - L * .34)},${N1(yc - w * .4)}" style="fill:none;stroke:#3f6b2e;stroke-width:${N1(Math.max(1.4, L * .008))}"/>`;
  g += `<path d="${body}" style="fill:#d9efc9;stroke:#3f6b2e;stroke-width:${N1(Math.max(1.6, L * .009))}"/>`;
  for (let i = 0; i < 14; i++) { const cx = x0 + L * (.24 + .62 * (i / 13)) + (R() - .5) * L * .03, cy = yc + (i % 2 ? 1 : -1) * w * (.12 + R() * .2) * (1 - Math.abs(i / 13 - .45)); g += `<ellipse cx="${N1(cx)}" cy="${N1(cy)}" rx="${N1(L * .034)}" ry="${N1(L * .021)}" transform="rotate(${Math.round(R() * 80 - 40)} ${N1(cx)} ${N1(cy)})" style="fill:#3d9a37;stroke:#1f5a1c;stroke-width:.8"/>`; }
  g += `<circle cx="${N1(x0 + L * .5)}" cy="${N1(yc)}" r="${N1(L * .058)}" style="fill:#c9b4dc;stroke:#5f4478;stroke-width:1.2"/>`;
  g += `<circle cx="${N1(x0 + L * .085)}" cy="${N1(yc - w * .16)}" r="${N1(L * .02)}" style="fill:#d7261e;stroke:#7a1410;stroke-width:.8"/>`;
  for (let i = 0; i < 3; i++) { const mx = x0 + L * (.32 + i * .17), my = yc + (i % 2 ? -1 : 1) * w * .3; g += `<ellipse cx="${N1(mx)}" cy="${N1(my)}" rx="${N1(L * .022)}" ry="${N1(L * .009)}" style="fill:#e08b55;stroke:#8a4418;stroke-width:.7"/>`; }
  g += `</g>`;
  if (main && legendOn) g += pin(x0 + L * .5, yc, x0 + L * .52, yc - w * 1.35, 1, F) + pin(x0 + L * .76, yc - w * .15, x0 + L * .78, yc - w * 1.35, 2, F) + pin(x0 + L * .085, yc - w * .16, x0 + L * .08, yc - w * 1.35, 3, F) + pin(x0 - L * .17, yc + w * .45, x0 - L * .2, yc + w * 1.3, 4, F) + pin(x0 + L * .32, yc + w * .3, x0 + L * .3, yc - w * 1.35, 5, F);
  return g;
}
function drawMicro(W, F, sl, rul, leg) {
  const S = SL[sl], tk = TK(F), D = Math.min(W - 12, F * 23), u = D / S.span, cx = W / 2, cy = tk * 1.6 + D / 2, H = cy + D / 2 + tk * 1.9;
  const id = "mf" + sl;
  let g = tx(cx, tk * 1.05, S.name, { s: tk, w: 800 });
  g += `<clipPath id="${id}"><circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(D / 2)}"/></clipPath><circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(D / 2)}" style="fill:#fbfbf4"/><g clip-path="url(#${id})">`;
  const L = S.cell * u, mx = cx - L / 2, my = cy - D * .1;
  if (sl === "l") {
    [[-.37, -.31, 2.0, 20], [.37, -.32, 2.2, -35], [-.39, .26, 2.3, 60], [.38, .25, 1.9, 15], [0, -.44, 1.7, 85]].forEach(([dx, dy, l, r]) => g += yeastCell(cx + dx * D, cy + dy * D, l * u, r, false, F, false));
    g += yeastCell(cx + .5 * D, cy - .05 * D, 1.1 * u, 30, false, F, false);
    g += yeastCell(cx, my, L, 0, leg, F, true);
  } else {
    g += euglena(cx - D * .5, cy + D * .26, 4 * u, false, F, false, -8) + euglena(cx + D * .12, cy - D * .42, 4.4 * u, false, F, false, -4);
    g += euglena(mx, my, L, leg, F, true, 0);
  }
  const bx = sl === "e" ? cx + D * .05 : cx - S.barCm * u / 2, byy = cy + D * .3;
  g += `</g><circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(D / 2)}" style="fill:none;stroke:#1f2a2e;stroke-width:${N1(F * .45)}"/>`;
  g += `<rect x="${N1(bx)}" y="${N1(byy)}" width="${N1(S.barCm * u)}" height="${N1(F * .3)}" style="fill:#111"/>` + tx(bx + S.barCm * u / 2, byy - F * .3, `${S.bar} µm`, { s: s14(F), c: "#111", h: 1, hc: "#fbfbf4" });
  if (rul === "c") g += ruler(mx, sl === "l" ? my + L * .45 : my + L * .17, u, Math.ceil(S.cell) + (sl === "l" ? 1 : 0), F);
  else g += ruler(bx, byy + F * .55, u, 3, F);
  return svgW(W, H, `${S.name} au microscope : une cellule principale au centre et une barre d'échelle de ${S.bar} micromètres. Une règle virtuelle graduée en centimètres est placée ${rul === "c" ? "sous la cellule principale, zéro au bord gauche de la cellule" : "sous la barre d'échelle, zéro au bord gauche de la barre"}.`, g);
}
WID.micro = host => {
  const x = xst(); x.mi = x.mi || {};
  let sl = "l", rul = "c", leg = false;
  host.innerHTML = `${segH("Lame observée", [["l", "Lame 1 · levures"], ["e", "Lame 2 · euglènes"]], "l", "sl")}${segH("Position de la règle", [["c", "📏 Règle sous la cellule"], ["b", "📏 Règle sous la barre d'échelle"]], "c", "ru")}
    <div class="row"><button type="button" class="btn ghost" data-leg aria-pressed="false">🏷 Afficher les légendes</button></div><div class="figbox micro"></div>
    <p class="cap">Règle virtuelle en cm, à l'échelle du dessin : 0 est toujours placé au bord gauche de ce que tu mesures. On mesure le corps de la cellule, sans le flagelle.</p><div class="leg-n" hidden><ol class="ul mi-leg"></ol><p class="cap">* Les mitochondries ne sont visibles qu'au microscope électronique : elles sont ajoutées sur le dessin.</p></div>`;
  const legList = () => { $(".mi-leg", host).innerHTML = MI_LEG[sl].map(x => `<li>${x}</li>`).join(""); };
  const mark = () => { x.mi[sl + rul] = 1; keep(); };
  const fig = liveSVG($(".figbox", host), (W, F) => drawMicro(W, F, sl, rul, leg));
  bindSeg(host, "sl", k => { sl = k; fig.draw(); legList(); mark(); });
  bindSeg(host, "ru", k => { rul = k; fig.draw(); mark(); });
  const lb = $("[data-leg]", host); lb.onclick = () => { leg = !leg; lb.setAttribute("aria-pressed", String(leg)); lb.textContent = leg ? "🏷 Masquer les légendes" : "🏷 Afficher les légendes"; $(".leg-n", host).hidden = !leg; fig.draw(); };
  legList(); mark();
};

/* =====================================================================
   4. Le tilleul et ses partenaires : flux de matière (et d'énergie)
   ===================================================================== */
const RS = { all: "Tout voir", bee: "🐝 Abeille", aph: "🟢 Puceron", lad: "🐞 Coccinelle", cep: "🍄 Cèpe" };
const RS_T = { all: "Le tilleul, producteur primaire, réalise la photosynthèse : il produit la matière organique (glucose…) qui circule dans la sève élaborée.",
  bee: "L'abeille se nourrit du nectar des fleurs (matière organique).", aph: "Le puceron perce les tiges pour prélever la sève élaborée.",
  lad: "La coccinelle se nourrit des pucerons.", cep: "Le cèpe de Bordeaux (mycorhize) reçoit de la matière organique du tilleul et lui fournit de l'eau et des sels minéraux : association mutualiste." };
function drawReseau(W, F, p, sel, nrj) {
  const tk = TK(F), H = cl(W * .8, F * 15, F * 22), G = H * .66, X = v => v * W, Y = v => v * H, s = s14(F);
  const on = k => sel === "all" || sel === k || (k === "aph" && sel === "lad"), op = k => on(k) ? 1 : .28;
  let g = `<rect x="0" y="0" width="${N1(W)}" height="${N1(G)}" rx="12" style="fill:var(--sky)"/><rect x="0" y="${N1(G)}" width="${N1(W)}" height="${N1(H - G)}" style="fill:var(--soil)"/>`;
  /* soleil */
  g += `<circle cx="${N1(X(.08))}" cy="${N1(Y(.08))}" r="${N1(F * .9)}" style="fill:var(--nrg);stroke:var(--nrg-s);stroke-width:2"/>`;
  for (let k = 0; k < 8; k++) { const an = k * Math.PI / 4; g += `<line x1="${N1(X(.08) + Math.cos(an) * F * 1.15)}" y1="${N1(Y(.08) + Math.sin(an) * F * 1.15)}" x2="${N1(X(.08) + Math.cos(an) * F * 1.5)}" y2="${N1(Y(.08) + Math.sin(an) * F * 1.5)}" style="stroke:var(--nrg-s);stroke-width:2"/>`; }
  /* racines, mycélium */
  [[.47, G / H, .3, .86], [.47, G / H, .6, .9], [.47, G / H, .45, .96], [.47, G / H, .64, .76]].forEach(([a, b, c, d]) => g += `<path d="M${N1(X(a))},${N1(Y(b))} Q${N1(X((a + c) / 2))},${N1(Y(d) - 8)} ${N1(X(c))},${N1(Y(d))}" style="fill:none;stroke:#7b5532;stroke-width:${N1(F * .22)};stroke-linecap:round"/>`);
  g += `<path d="M${N1(X(.6))},${N1(Y(.9))} q${N1(W * .04)},-${N1(H * .06)} ${N1(W * .1)},-${N1(H * .14)} M${N1(X(.64))},${N1(Y(.76))} q${N1(W * .03)},${N1(H * .02)} ${N1(W * .07)},-${N1(H * .06)}" style="fill:none;stroke:#f0ead8;stroke-width:2;stroke-dasharray:3 3;opacity:${op("cep")}"/>`;
  /* tronc, branche du puceron, houppier, fleurs */
  g += `<path d="M${N1(X(.44))},${N1(G)} L${N1(X(.455))},${N1(Y(.3))} L${N1(X(.495))},${N1(Y(.3))} L${N1(X(.51))},${N1(G)} Z" style="fill:#8a5a34;stroke:#5a3a20;stroke-width:1.5"/>`;
  g += `<path d="M${N1(X(.46))},${N1(Y(.4))} Q${N1(X(.36))},${N1(Y(.36))} ${N1(X(.2))},${N1(Y(.39))}" style="fill:none;stroke:#7b5532;stroke-width:${N1(F * .28)};stroke-linecap:round"/>`;
  [[.47, .2, .14], [.36, .25, .1], [.58, .25, .1], [.43, .1, .09], [.53, .11, .09], [.31, .17, .07]].forEach(([a, b, r]) => g += `<circle cx="${N1(X(a))}" cy="${N1(Y(b))}" r="${N1(W * r * .9)}" style="fill:var(--leaf)"/>`);
  [[.62, .3], [.59, .17], [.66, .22]].forEach(([a, b]) => { for (let k = 0; k < 3; k++) g += `<circle cx="${N1(X(a) + (k - 1) * F * .35)}" cy="${N1(Y(b) + (k % 2) * F * .3)}" r="${N1(F * .28)}" style="fill:#fff2a8;stroke:#b39200;stroke-width:1;opacity:${op("bee")}"/>`; });
  /* cèpe */
  const cx0 = X(.74);
  g += `<g style="opacity:${op("cep")}"><rect x="${N1(cx0 - F * .35)}" y="${N1(G - F * 1.1)}" width="${N1(F * .7)}" height="${N1(F * 1.3)}" rx="5" style="fill:#f2ecd9;stroke:#8a7a55;stroke-width:1.2"/><path d="M${N1(cx0 - F * 1.05)},${N1(G - F * .95)} Q${N1(cx0)},${N1(G - F * 2.4)} ${N1(cx0 + F * 1.05)},${N1(G - F * .95)} Z" style="fill:#8a4e22;stroke:#5a3010;stroke-width:1.2"/></g>`;
  /* abeille */
  const bx = X(.82), by = Y(.18) + Math.sin(p * 60) * F * .15;
  g += `<g style="opacity:${op("bee")}"><ellipse cx="${N1(bx - F * .2)}" cy="${N1(by - F * .45)}" rx="${N1(F * .35)}" ry="${N1(F * .22)}" style="fill:#e8f3fb;stroke:#7aa0b8;stroke-width:1"/><ellipse cx="${N1(bx)}" cy="${N1(by)}" rx="${N1(F * .55)}" ry="${N1(F * .34)}" style="fill:#f3c623;stroke:#3a2c00;stroke-width:1.2"/><path d="M${N1(bx - F * .12)},${N1(by - F * .32)} v${N1(F * .64)} M${N1(bx + F * .15)},${N1(by - F * .3)} v${N1(F * .6)}" style="stroke:#222;stroke-width:${N1(F * .12)}"/></g>`;
  /* puceron et coccinelle sur la branche */
  const ax = X(.27), ay = Y(.375) - F * .2, lx = X(.15), ly = Y(.385) - F * .35;
  g += `<ellipse cx="${N1(ax)}" cy="${N1(ay)}" rx="${N1(F * .32)}" ry="${N1(F * .22)}" style="fill:#7ec850;stroke:#2f6a16;stroke-width:1.2;opacity:${op("aph")}"/>`;
  g += `<g style="opacity:${op("lad")}"><circle cx="${N1(lx - F * .45)}" cy="${N1(ly)}" r="${N1(F * .2)}" style="fill:#222"/><circle cx="${N1(lx)}" cy="${N1(ly)}" r="${N1(F * .42)}" style="fill:#d7261e;stroke:#222;stroke-width:1.2"/><line x1="${N1(lx)}" y1="${N1(ly - F * .42)}" x2="${N1(lx)}" y2="${N1(ly + F * .42)}" style="stroke:#222;stroke-width:1.2"/>${[[-.2, -.15], [.2, -.15], [-.18, .18], [.18, .18]].map(([a, b]) => `<circle cx="${N1(lx + a * F)}" cy="${N1(ly + b * F)}" r="${N1(F * .08)}" style="fill:#222"/>`).join("")}</g>`;
  /* trajets */
  const P = {
    lum: [[X(.11), Y(.12)], [X(.33), Y(.2)]],
    bee: [[X(.47), Y(.24)], [X(.6), Y(.29)], [bx - F * .6, by]],
    aph: [[X(.47), Y(.27)], [X(.465), Y(.38)], [X(.36), Y(.37)], [ax + F * .3, ay]],
    lad: [[ax - F * .3, ay], [lx + F * .45, ly]],
    cepO: [[X(.48), Y(.26)], [X(.48), G], [X(.6), Y(.9)], [X(.7), Y(.76)], [cx0, G - F * .2]],
    cepM: [[cx0 - F * .2, G + F * .1], [X(.64), Y(.76)], [X(.5), G + F * .2], [X(.475), Y(.42)]]
  };
  const show = { lum: true, bee: on("bee"), aph: on("aph"), lad: on("lad"), cepO: on("cep"), cepM: on("cep") };
  Object.entries(P).forEach(([k, pts]) => {
    if (!show[k]) return;
    const col = k === "lum" ? "var(--nrg-s)" : k === "cepM" ? "var(--min-s)" : "var(--org-s)";
    g += poly(pts, `stroke:${col};stroke-width:2;stroke-dasharray:4 5;opacity:.75`);
    const n = k === "lum" ? 3 : 4;
    for (let j = 0; j < n; j++) {
      const t = ((p * 9 + j / n) % 1), [qx, qy] = along(pts, t);
      if (k === "lum") g += `<circle cx="${N1(qx)}" cy="${N1(qy)}" r="${N1(F * .22)}" style="fill:var(--nrg)"/>`;
      else { const m = k === "cepM"; g += `<circle cx="${N1(qx)}" cy="${N1(qy)}" r="${N1(F * .26)}" style="fill:var(--${m ? "min" : "org"});stroke:var(--${m ? "min" : "org"}-s);stroke-width:1.5"/>`; if (nrj && !m) g += spark(qx + F * .3, qy - F * .3, F * .28, 1); }
    }
  });
  /* étiquettes */
  const L = (xx, yy, t, k, a) => tx(xx, yy, t, { s, a: a || "middle", op: k ? op(k) : 1, h: 1 });
  g += L(X(.47), G - F * .3, "Tilleul") + L(bx, by + F * 1.2, "Abeille", "bee") + L(ax + F * .1, ay + F * 1.25, "Puceron", "aph") + L(lx, ly - F * .75, "Coccinelle", "lad") + L(cx0, G + F * 1.2, "Cèpe", "cep");
  const wide = W >= F * 26;
  if (wide && sel === "bee") g += L(X(.66), Y(.36), "nectar", "bee"); if (wide && (sel === "aph" || sel === "lad")) g += L(X(.36), Y(.335), "sève élaborée", "aph"); if (wide && sel === "lad") g += L(X(.15), Y(.47), "pucerons", "lad");
  if (sel === "cep") g += L(X(.86), Y(.78), "matière", "cep") + L(X(.86), Y(.78) + s * 1.1, "organique", "cep") + L(X(.25), Y(.8), "eau + sels", "cep") + L(X(.25), Y(.8) + s * 1.1, "minéraux", "cep");
  return svgW(W, H, "Le tilleul et ses partenaires. La lumière du Soleil arrive sur les feuilles du tilleul. Des points dorés (matière organique) circulent du tilleul vers les fleurs puis l'abeille, du tilleul vers le puceron puis la coccinelle, et du tilleul vers le cèpe ; des points bleus (eau et sels minéraux) vont du cèpe vers les racines du tilleul.", g);
}
WID.reseau = host => {
  const x = xst(); x.rs = x.rs || {};
  let sel = "all", p = 0, nrj = false;
  host.innerHTML = `${segH("Relation affichée", Object.entries(RS), "all", "rs")}<div class="row"><button type="button" class="btn ghost" data-nrj aria-pressed="false">⚡ Montrer l'énergie</button></div><div class="figbox"></div><div class="row animctl"></div><p class="cap rs-t" aria-live="polite"></p>${legend(["lum", "orgp", "minp"])}<p class="cap nrj-n" hidden>⚡ La matière organique contient de l'énergie chimique : les flux de matière sont aussi des flux d'énergie.</p>`;
  const fig = liveSVG($(".figbox", host), (W, F) => drawReseau(W, F, p, sel, nrj));
  const capt = () => { $(".rs-t", host).textContent = nb(RS_T[sel]); };
  animCtl($(".animctl", host), 14000, v => { p = v; fig.draw(); if (v > .12 && sel !== "all" && !x.rs[sel]) { x.rs[sel] = 1; keep(); } });
  bindSeg(host, "rs", k => { sel = k; capt(); fig.draw(); });
  const nb2 = $("[data-nrj]", host); nb2.onclick = () => { nrj = !nrj; nb2.setAttribute("aria-pressed", String(nrj)); $(".nrj-n", host).hidden = !nrj; fig.draw(); };
  capt();
};

/* =====================================================================
   5a. De l'amidon au glucose : le trajet, puis l'amylase au travail
   ===================================================================== */
const DG_ST = ["1 · Ingestion", "2 · Digestion chimique", "3 · Absorption intestinale", "4 · Transport sanguin"];
const dgStep = p => p < .13 ? 0 : p < .6 ? 1 : p < .74 ? 2 : 3;
function drawTrajet(W, F, p) {
  const tk = TK(F), Wd = Math.min(W, F * 27), ox = (W - Wd) / 2, H = cl(Wd * 1.0, F * 16, F * 22), s = s14(F), a = cl(Wd * .013, 4.5, 7.5), X = v => ox + v * Wd, Y = v => v * H;
  let g = "";
  /* tête et bouche */
  g += `<circle cx="${N1(X(.42))}" cy="${N1(Y(.09))}" r="${N1(Y(.075))}" style="fill:var(--skin);stroke:var(--ink);stroke-width:1.5"/><path d="M${N1(X(.42) - F * .5)},${N1(Y(.115))} q${N1(F * .5)},${N1(F * .35)} ${N1(F)},0" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>`;
  /* tube digestif */
  const tube = [[X(.42), Y(.13)], [X(.42), Y(.27)], [X(.48), Y(.33)]];
  g += poly(tube, `stroke:var(--gut);stroke-width:${N1(F * .55)};stroke-linecap:round;stroke-linejoin:round`);
  g += `<ellipse cx="${N1(X(.54))}" cy="${N1(Y(.35))}" rx="${N1(Wd * .11)}" ry="${N1(H * .05)}" transform="rotate(18 ${N1(X(.54))} ${N1(Y(.35))})" style="fill:var(--gut);stroke:var(--gut-s);stroke-width:1.5"/>`;
  const coil = [[X(.6), Y(.39)], [X(.6), Y(.43)], [X(.3), Y(.45)], [X(.3), Y(.51)], [X(.66), Y(.53)], [X(.66), Y(.59)], [X(.3), Y(.61)], [X(.3), Y(.67)], [X(.62), Y(.69)]];
  g += poly(coil, `stroke:var(--gut-s);stroke-width:${N1(F * .7)};stroke-linecap:round;stroke-linejoin:round`) + poly(coil, `stroke:var(--gut);stroke-width:${N1(F * .5)};stroke-linecap:round;stroke-linejoin:round`);
  /* vaisseau sanguin et cellules */
  const vessel = [[X(.2), Y(.75)], [X(.7), Y(.75)], [X(.78), Y(.82)], [X(.78), Y(.88)]];
  g += poly(vessel, `stroke:var(--blood);stroke-width:${N1(F * .6)};stroke-linecap:round;stroke-linejoin:round;opacity:.85`);
  g += `<rect x="${N1(X(.62))}" y="${N1(Y(.88))}" width="${N1(Wd * .34)}" height="${N1(H * .1)}" rx="10" style="fill:var(--cell);stroke:var(--cell-s);stroke-width:2"/>`;
  for (let k = 0; k < 3; k++) g += `<circle cx="${N1(X(.68) + k * Wd * .1)}" cy="${N1(Y(.93))}" r="${N1(H * .028)}" style="fill:var(--surface);stroke:var(--cell-s);stroke-width:1.5"/>`;
  /* étiquettes */
  const L = (xx, yy, t, an, c) => tx(xx, yy, t, { s, a: an || "start", c: c || "var(--ink)", h: 1 });
  g += L(X(.52), Y(.08), "bouche") + L(X(.52), Y(.08) + s * 1.15, "salive : amylase", "start", "var(--enz)");
  g += L(X(.67), Y(.33), "estomac");
  g += L(X(.7), Y(.47), "intestin grêle") + L(X(.7), Y(.47) + s * 1.15, "suc pancréatique :", "start", "var(--enz)") + L(X(.7), Y(.47) + s * 2.3, "amylase", "start", "var(--enz)");
  g += L(X(.2), Y(.75) - F * .65, "sang", "start", "var(--blood)") + L(X(.79), Y(.88) - F * .3, "cellules", "middle");
  /* l'amidon : 8 glucoses enchaînés */
  const st = dgStep(p), n = 8, r = a * 1.25;
  const potato = [[X(.42), -r * 3], [X(.42), Y(.11)]], path1 = [[X(.42), Y(.11)], ...tube, [X(.6), Y(.37)], ...coil];
  let cx, cy, gap, cut;
  if (p < .13) { [cx, cy] = along(potato, ez(sg(p, 0, .12))); gap = 0; cut = 0; }
  else if (p < .6) { [cx, cy] = along(path1, ez(sg(p, .2, .58))); gap = r * .6 * sg(p, .13, .2) + r * 1.6 * sg(p, .44, .58); cut = p < .44 ? 1 : 7; }
  else { [cx, cy] = coil[coil.length - 1]; gap = r * 2.2; cut = 7; }
  const beads = [];
  for (let i = 0; i < n; i++) {
    const half = (n - 1) / 2; let bx = cx + (i - half) * r * 2.05, by = cy;
    if (cut === 1) bx += (i < 4 ? -1 : 1) * gap; else if (cut === 7) bx += (i - half) * gap * .5;
    if (p >= .6) { /* absorption puis transport */
      const ab = ez(sg(p, .6 + i * .012, .72 + i * .012)), vx = X(.25) + i * Wd * .055, vy = Y(.75);
      bx = LP(X(.3) + i * Wd * .045, vx, ab); by = LP(Y(.69), vy, ab);
      if (p >= .74) { const tt = ez(sg(p, .74 + i * .02, .94 + i * .006)); [bx, by] = along([[vx, vy], [X(.7), Y(.75)], [X(.78), Y(.82)], [X(.66) + (i % 4) * Wd * .085, Y(.9) + Math.floor(i / 4) * H * .045]], tt); }
    }
    beads.push([bx, by]);
  }
  if (p < .6) for (let i = 1; i < n; i++) { const linked = cut === 0 || (cut === 1 && i !== 4); if (linked) g += `<line x1="${N1(beads[i - 1][0])}" y1="${N1(beads[i - 1][1])}" x2="${N1(beads[i][0])}" y2="${N1(beads[i][1])}" style="stroke:var(--glc-s);stroke-width:${N1(r * .5)}"/>`; }
  beads.forEach(([bx, by]) => g += hexa(bx, by, r));
  if ((p > .12 && p < .21) || (p > .43 && p < .53)) { const [ex, ey] = p < .3 ? [cx, cy - r * 1.1] : [cx, cy - r * 1.1]; g += enzyme(ex, ey, r * 1.6, 0, 1); }
  return svgW(W, H, `Le trajet de l'amidon d'une pomme de terre. Étape en cours : ${DG_ST[st]}.`, g);
}
/* l'amylase : une forme violette avec une encoche (site actif) */
function enzyme(x, y, R, rot, op) {
  return `<g transform="rotate(${rot} ${N1(x)} ${N1(y)})" style="opacity:${N1(op)}"><path d="M${N1(x - R)},${N1(y)} A${N1(R)},${N1(R)} 0 0 1 ${N1(x + R)},${N1(y)} L${N1(x + R * .42)},${N1(y)} L${N1(x)},${N1(y - R * .5)} L${N1(x - R * .42)},${N1(y)} Z" style="fill:var(--enz);stroke:var(--enz-s);stroke-width:1.5"/></g>`;
}
function drawZoom(W, F, p, sub) {
  const tk = TK(F), H = cl(W * .36, F * 8, F * 10.5), a = cl(W * .016, 6, 10), n = 8, s = s14(F), cy = H * .62, r = a * 1.25, sp = r * 2.3;
  let g = "", x0 = W / 2 - (n - 1) / 2 * sp;
  if (sub === "am") {
    const nd = p < .1 ? 0 : Math.min(7, Math.floor((p - .1) / .11) + 1), free = nd >= 7 ? 8 : nd;
    const pos = i => x0 + i * sp + (Math.min(i, nd) - nd / 2) * a * .7, jx = j => (pos(j - 1) + pos(j)) / 2;
    for (let i = 1; i < n; i++) if (i > nd) g += `<line x1="${N1(pos(i - 1))}" y1="${N1(cy)}" x2="${N1(pos(i))}" y2="${N1(cy)}" style="stroke:var(--glc-s);stroke-width:${N1(r * .5)}"/>`;
    for (let i = 0; i < n; i++) g += hexa(pos(i), cy + (i < free ? Math.sin(p * 30 + i) * 1.5 : 0), r);
    let ex, ey = cy - r * 1.05, op = 1;
    if (p < .1) ex = LP(-r * 3, jx(1), ez(p / .1));
    else if (p < .78) { const k = (p - .1) / .11, c = Math.min(6, Math.floor(k)), f = k - Math.floor(k); ex = c >= 6 ? jx(7) : LP(jx(c + 1), jx(c + 2), ez(sg(f, .55, 1))); ey -= Math.sin(sg(f, .5, 1) * Math.PI) * r * .9; }
    else { const f = sg(p, .78, .95); ex = LP(jx(7), W + r * 3, ez(f)); ey -= f * r * 1.5; op = 1 - f; }
    if (op > .02 && p > 0) g += enzyme(ex, ey, r * 1.7, 0, op) + tx(ex, ey - r * 2.1, "amylase", { s: s * .92, c: "var(--enz)", h: 1, op });
    g += tx(W / 2, H - s * .3, `Coupures : ${nd} sur 7 · glucoses libérés : ${free}`, { s, c: "var(--muted)" });
    g += tx(W / 2, tk * 1.05, "amidon (chaîne de glucoses)", { s, c: "var(--muted)" });
  } else {
    const shapes = (i, xx) => i % 3 === 0 ? `<rect x="${N1(xx - r)}" y="${N1(cy - r)}" width="${N1(r * 2)}" height="${N1(r * 2)}" rx="3" style="fill:var(--c3);stroke:var(--ink);stroke-width:1.2"/>` : i % 3 === 1 ? `<path d="M${N1(xx)},${N1(cy - r * 1.1)} L${N1(xx + r)},${N1(cy + r * .8)} L${N1(xx - r)},${N1(cy + r * .8)} Z" style="fill:var(--c4);stroke:var(--ink);stroke-width:1.2"/>` : `<circle cx="${N1(xx)}" cy="${N1(cy)}" r="${N1(r)}" style="fill:var(--c1);stroke:var(--ink);stroke-width:1.2"/>`;
    for (let i = 1; i < n; i++) g += `<line x1="${N1(x0 + (i - 1) * sp)}" y1="${N1(cy)}" x2="${N1(x0 + i * sp)}" y2="${N1(cy)}" style="stroke:var(--ink);stroke-width:${N1(r * .4)}"/>`;
    for (let i = 0; i < n; i++) g += shapes(i, x0 + i * sp);
    const tries = [.15, .45, .75], phase = tries.map(t0 => sg(p, t0, t0 + .22)), k = phase.findIndex(v => v > 0 && v < 1), ph = k >= 0 ? phase[k] : 0, jx = k >= 0 ? x0 + (1.5 + k * 2) * sp : x0 - sp;
    const dy = Math.sin(ph * Math.PI) * r * 1.2, bounce = ph > .45 && ph < .65;
    const exx = p <= 0 ? -r * 9 : k >= 0 ? jx : p < .15 ? LP(-r * 3, x0 - sp, ez(sg(p, 0, .15))) : x0 + 5.5 * sp + sp * ez(sg(p, .97, 1));
    g += enzyme(exx, cy - r * 2.6 + dy, r * 1.7, bounce ? 16 : 0, 1) + tx(exx, cy - r * 4.7 + dy, "amylase", { s: s * .92, c: "var(--enz)", h: 1 });
    if (bounce) g += tx(jx + r * 2.4, cy - r * 1.6, "ne se fixe pas", { s, a: "start", c: "var(--bad)", h: 1 });
    g += tx(W / 2, H - s * .3, "Coupures : 0 · aucune molécule libérée", { s, c: "var(--muted)" });
    g += tx(W / 2, tk * 1.05, "protéine", { s, c: "var(--muted)" });
  }
  return svgW(W, H, sub === "am" ? "Zoom : l'amylase se fixe sur l'amidon et le découpe, liaison après liaison, en molécules de glucose." : "Zoom : l'amylase s'approche d'une protéine mais ne peut pas s'y fixer : aucune coupure.", g);
}
WID.digest = host => {
  const x = xst(); x.dg = x.dg || {};
  let p = 0, q = 0, sub = "am";
  host.innerHTML = `<p class="kicker">Le trajet de l'amidon d'une pomme de terre</p><div class="figbox tr"></div><div class="row animctl a1"></div><div class="chips dgst" aria-live="polite">${DG_ST.map((t, i) => `<span class="dgc" data-i="${i}">${t}</span>`).join("")}</div>
    <p class="kicker" style="margin-top:.6rem">Zoom : l'amylase au travail</p>${segH("Molécule présentée à l'amylase", [["am", "Amidon + amylase"], ["pr", "Protéine + amylase"]], "am", "sb")}<div class="figbox zm"></div><div class="row animctl a2"></div>`;
  const f1 = liveSVG($(".tr", host), (W, F) => drawTrajet(W, F, p));
  const f2 = liveSVG($(".zm", host), (W, F) => drawZoom(W, F, q, sub));
  const chips = () => { const st = dgStep(p); $$(".dgc", host).forEach((c, i) => { c.classList.toggle("on", p > 0 && i === st); c.classList.toggle("done", p > 0 && (i < st || p >= 1)); }); };
  animCtl($(".a1", host), 11000, v => { p = v; f1.draw(); chips(); if (v >= 1 && !x.dg.trip) { x.dg.trip = 1; keep(); } });
  const c2 = animCtl($(".a2", host), 6000, v => { q = v; f2.draw(); if (v >= 1 && !x.dg[sub]) { x.dg[sub] = 1; keep(); } });
  bindSeg(host, "sb", k => { sub = k; c2.set(0); });
};

/* =====================================================================
   5b. Les voies du glucose : respiration ou stockage selon la cellule
   ===================================================================== */
const VO = { foie: { name: "Cellule du foie", st: "glycogène" }, muscle: { name: "Cellule musculaire", st: "glycogène" }, adip: { name: "Cellule du tissu adipeux", st: "triglycérides" } };
function drawVoies(W, F, p, k) {
  const tk = TK(F), narrow = W < F * 24, H = cl(W * .66, F * (narrow ? 15 : 13), F * 17.5), s = s14(F), a = cl(W * .012, 4.5, 7), r = a * 1.15;
  const vx = W * .07, nx = W * (narrow ? .27 : .3), ny = H * .5, bx = W * (narrow ? .42 : .47), bw = W * (narrow ? .56 : .5), rY = H * .04, rH = H * .34, sY = H * .5, sH = H * .46;
  let g = `<rect x="${N1(vx - W * .045)}" y="0" width="${N1(W * .09)}" height="${N1(H)}" rx="10" style="fill:var(--blood);opacity:.8"/>` + tx(vx, s * 1.2, "sang", { s, c: "#fff" });
  g += `<rect x="${N1(bx)}" y="${N1(rY)}" width="${N1(bw)}" height="${N1(rH)}" rx="12" style="fill:var(--surface-2);stroke:var(--c2);stroke-width:2"/>` + (narrow ? tx(bx + bw / 2, rY + s * 1.3, "Respiration", { s }) + tx(bx + bw / 2, rY + s * 2.4, "cellulaire", { s }) + tx(bx + bw / 2, rY + s * 3.5, "(mitochondries)", { s, c: "var(--muted)", w: 600 }) : tx(bx + bw / 2, rY + s * 1.3, "Respiration cellulaire", { s }) + tx(bx + bw / 2, rY + s * 2.5, "dans les mitochondries", { s, c: "var(--muted)", w: 600 }));
  g += `<rect x="${N1(bx)}" y="${N1(sY)}" width="${N1(bw)}" height="${N1(sH)}" rx="12" style="fill:var(--surface-2);stroke:var(--c1);stroke-width:2"/>` + tx(bx + bw / 2, sY + s * 1.3, "Stockage", { s });
  g += `<line x1="${N1(vx + W * .05)}" y1="${N1(ny)}" x2="${N1(nx - a * 3)}" y2="${N1(ny)}" style="stroke:var(--muted);stroke-width:2;marker-end:none"/>`;
  g += `<path d="M${N1(nx + a * 2.6)},${N1(ny - a)} Q${N1(bx - W * .04)},${N1(rY + rH * .5)} ${N1(bx)},${N1(rY + rH * .55)} M${N1(nx + a * 2.6)},${N1(ny + a)} Q${N1(bx - W * .04)},${N1(sY + sH * .5)} ${N1(bx)},${N1(sY + sH * .55)}" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:5 5"/>`;
  g += hexa(nx, ny, a * 2.4) + tx(nx, ny + a * 2.4 + s * 1.1, "glucose", { s, h: 1 });
  for (let i = 0; i < 6; i++) { const yy = ((p * 4 + i / 6) % 1) * H; g += hexa(vx, yy, r * .9, .9); }
  /* stockage : glycogène (ramifié) ou triglycérides (gouttelette) */
  const sc = bx + bw / 2, scy = sY + sH * .6, nst = Math.round(12 * sg(p, .35, .9));
  if (k !== "adip") {
    const pts = [[0, 0], [1, 0], [2, 0], [3, 0], [-1, 0], [-2, 0], [1, -1], [1.8, -1.6], [-1, 1], [-1.8, 1.6], [2.5, .9], [-2.6, -.9]];
    for (let i = 1; i < nst; i++) { const [px, py] = pts[i], [qx, qy] = pts[i < 6 ? (i === 4 ? 0 : i - 1) : i === 6 ? 1 : i === 7 ? 6 : i === 8 ? 4 : i === 9 ? 8 : i === 10 ? 2 : 5]; g += `<line x1="${N1(sc + qx * r * 2.1)}" y1="${N1(scy + qy * r * 2.1)}" x2="${N1(sc + px * r * 2.1)}" y2="${N1(scy + py * r * 2.1)}" style="stroke:var(--glc-s);stroke-width:${N1(r * .45)}"/>`; }
    for (let i = 0; i < nst; i++) g += hexa(sc + pts[i][0] * r * 2.1, scy + pts[i][1] * r * 2.1, r);
  } else {
    const R = Math.sqrt(nst / 12) * Math.min(bw * .3, sH * .3);
    if (R > 1) g += `<circle cx="${N1(sc)}" cy="${N1(scy)}" r="${N1(R)}" style="fill:var(--fat);stroke:var(--fat-s);stroke-width:2"/>`;
  }
  if (p > .88) g += tx(sc, sY + sH - s * .5, VO[k].st, { s, w: 800, op: sg(p, .88, .95), h: 1 });
  /* glucoses en route : 3 vers la respiration, 5 vers le stockage */
  for (let i = 0; i < 8; i++) {
    const t0 = .02 + i * .045, t1 = ez(sg(p, t0, t0 + .2)), up = i % 3 === 0, t2 = ez(sg(p, t0 + .22, t0 + .45));
    if (t1 <= 0 || t2 >= 1) continue;
    let px = LP(vx, nx, t1), py = ny + (1 - t1) * (i - 3.5) * a;
    if (t2 > 0) { px = LP(nx, up ? bx + bw * .3 : sc, t2); py = LP(ny, up ? rY + rH * .72 : scy, t2) + Math.sin(t2 * Math.PI) * (up ? -1 : 1) * H * .05; }
    g += hexa(px, py, r);
  }
  for (let i = 0; i < 6; i++) { const tt = sg(p, .35 + i * .08, .55 + i * .08); if (tt > 0 && tt < 1) g += spark(bx + bw * (.3 + i * .1), rY + rH * .72 - tt * rH * .5, a * 1.5, 1 - tt); }
  if (p > .4) g += tx(bx + bw - 10, rY + rH - s * .45, "→ énergie", { s, a: "end", c: "var(--nrg-s)", op: sg(p, .4, .5) });
  return svgW(W, H, `${VO[k].name} : le glucose apporté par le sang est utilisé par la respiration cellulaire, qui libère de l'énergie, ou mis en réserve.`, g);
}
WID.voies = host => {
  const x = xst(); x.vo = x.vo || {};
  let k = "foie", p = 0;
  host.innerHTML = `${segH("Cellule observée", Object.entries(VO).map(([kk, v]) => [kk, v.name]), "foie", "vk")}<div class="figbox"></div><div class="row animctl"></div><p class="cap" aria-live="polite">Touche ▶ Lancer.</p>`;
  const fig = liveSVG($(".figbox", host), (W, F) => drawVoies(W, F, p, k));
  const ctl = animCtl($(".animctl", host), 7000, v => { p = v; fig.draw(); $(".cap", host).textContent = v >= 1 ? `${VO[k].name} : réserve de ${VO[k].st}.` : v > 0 ? "Animation en cours…" : "Touche ▶ Lancer."; if (v >= 1 && !x.vo[k]) { x.vo[k] = 1; keep(); } });
  bindSeg(host, "vk", kk => { k = kk; ctl.set(0); });
};

/* =====================================================================
   6. ExAO virtuelle : graines de pois en germination / graines sèches (enceinte fermée, 20 min)
   ===================================================================== */
const EXD = { g: { name: "Graines en germination", col: "var(--c2)", o: t => 20.9 - .08 * t + .015 * Math.sin(Math.PI * t / 4), c: t => .04 + .08 * t - .012 * Math.sin(Math.PI * t / 4) },
  s: { name: "Graines sèches", col: "var(--c1)", o: t => 20.9 - .001 * t, c: t => .04 + .0005 * t } };
const EXY = { o: { min: 18.5, max: 21.5, step: .5, t: "Dioxygène O₂ (%)", short: "O₂" }, c: { min: 0, max: 2, step: .5, t: "Dioxyde de carbone CO₂ (%)", short: "CO₂" } };
const f2 = v => fmt(Math.round(v * 100) / 100, 2);
function drawExao(W, F, gz, runs, cur, tc, rd) {
  const Y0 = EXY[gz], tk = TK(F), L = F * 3.5, R = F * .9, T = F * 1.1, B = F * 2.7, H = cl(W * .52, F * 10.5, F * 14), pw = W - L - R, ph = H - T - B;
  const X = t => L + t / 20 * pw, Y = v => T + ph - (v - Y0.min) / (Y0.max - Y0.min) * ph;
  let g = "";
  for (let v = Y0.min; v <= Y0.max + 1e-9; v += Y0.step) g += `<line x1="${N1(L)}" y1="${N1(Y(v))}" x2="${N1(L + pw)}" y2="${N1(Y(v))}" style="stroke:var(--line);stroke-width:1"/>` + `<text x="${N1(L - 6)}" y="${N1(Y(v) + tk * .35)}" text-anchor="end" style="fill:var(--ink);font-size:${N1(tk)}px">${fmt(v, 1)}</text>`;
  for (let t = 0; t <= 20; t += 2) g += `<line x1="${N1(X(t))}" y1="${N1(T)}" x2="${N1(X(t))}" y2="${N1(T + ph)}" style="stroke:var(--line);stroke-width:${t % 10 ? .6 : 1}"/>` + (t % 4 === 0 ? `<text x="${N1(X(t))}" y="${N1(T + ph + tk * 1.2)}" text-anchor="middle" style="fill:var(--ink);font-size:${N1(tk)}px">${t}</text>` : "");
  g += `<line x1="${N1(L)}" y1="${N1(T + ph)}" x2="${N1(L + pw)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.6"/><line x1="${N1(L)}" y1="${N1(T)}" x2="${N1(L)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.6"/>`;
  g += tx(L + pw / 2, H - tk * .35, "Temps (min)", { s: tk, w: 600 }) + `<text transform="rotate(-90 ${N1(tk * .95)} ${N1(T + ph / 2)})" x="${N1(tk * .95)}" y="${N1(T + ph / 2)}" text-anchor="middle" style="fill:var(--ink);font-size:${N1(tk * .9)}px;font-weight:600">${esc(Y0.t)}</text>`;
  ["g", "s"].forEach((c, ci) => {
    const tmax = cur === c ? tc : runs[c] ? 20 : -1; if (tmax < 0) return;
    let d = ""; for (let t = 0; t <= tmax + 1e-9; t += .25) d += (d ? "L" : "M") + N1(X(t)) + "," + N1(Y(EXD[c][gz](t)));
    g += `<path d="${d}" style="fill:none;stroke:${EXD[c].col};stroke-width:3;stroke-linejoin:round${ci ? ";stroke-dasharray:8 5" : ""}"/>`;
    if (cur === c && tc < 20) g += `<circle cx="${N1(X(tc))}" cy="${N1(Y(EXD[c][gz](tc)))}" r="5" style="fill:${EXD[c].col};stroke:var(--surface);stroke-width:2"/>`;
  });
  if (rd !== null && rd !== undefined) g += `<line x1="${N1(X(rd))}" y1="${N1(T)}" x2="${N1(X(rd))}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5;stroke-dasharray:3 3"/>`;
  return svgW(W, H, `Graphique : ${Y0.t} en fonction du temps, de 0 à 20 minutes. Les valeurs sont dans le tableau sous le graphique.`, g);
}
function drawJar(W, F, cur, p) {
  const s = s14(F), jx = W * .5, jw = Math.min(W * .5, F * 10), top = F * 1.9, bot = top + F * 3.6, H = bot + s * 1.9;
  let g = `<rect x="${N1(jx - jw / 2)}" y="${N1(top)}" width="${N1(jw)}" height="${N1(bot - top)}" rx="12" style="fill:var(--medium);stroke:var(--ink);stroke-width:2"/><rect x="${N1(jx - jw / 2 - 4)}" y="${N1(top - 6)}" width="${N1(jw + 8)}" height="10" rx="4" style="fill:var(--muted)"/>`;
  const R = rnd(9), germ = cur !== "s";
  for (let i = 0; i < 14; i++) { const sx = jx + (R() - .5) * jw * .8, sy = bot - F * .45 - R() * F * .5; g += `<circle cx="${N1(sx)}" cy="${N1(sy)}" r="${N1(F * .3)}" style="fill:#d9cf7a;stroke:#7a6a20;stroke-width:1"/>`; if (germ) g += `<path d="M${N1(sx)},${N1(sy - F * .25)} q${N1(F * .2)},-${N1(F * .4)} ${N1(F * .05)},-${N1(F * .75)}" style="fill:none;stroke:#5aa84a;stroke-width:2.2;stroke-linecap:round"/>`; }
  [[-.25, "sonde O₂"], [.25, "sonde CO₂"]].forEach(([dx, t], i) => { const px = jx + dx * jw; g += `<rect x="${N1(px - F * .18)}" y="${N1(top - F * .5)}" width="${N1(F * .36)}" height="${N1(F * 2.1)}" rx="4" style="fill:#444"/>` + tx(px + (i ? F * .3 : -F * .3), top - F * .75, t, { s, a: i ? "start" : "end", c: "var(--muted)" }); });
  g += tx(jx, H - s * .35, `Enceinte fermée · graines ${germ ? "en germination" : "sèches"}`, { s, c: "var(--muted)" });
  return svgW(W, H, `Enceinte fermée contenant des graines de pois ${germ ? "en germination" : "sèches"}, avec une sonde à dioxygène et une sonde à dioxyde de carbone.`, g);
}
WID.exao = host => {
  const x = xst(); x.ex = x.ex || {};
  let cur = "g", tc = 0, rd = null;
  host.innerHTML = `${segH("Graines placées dans l'enceinte", [["g", "🌱 Graines en germination"], ["s", "Graines sèches"]], "g", "ex")}<div class="figbox jar"></div><div class="row animctl"></div><p class="cap">20 minutes de mesures en accéléré. <span class="simw">⚠ Valeurs simulées</span></p>
    <div class="exleg"></div><div class="figbox go"></div><div class="figbox gc"></div><p class="readout" aria-live="polite">Touche un graphique pour lire les valeurs.</p><div class="ext"></div>`;
  const fj = liveSVG($(".jar", host), (W, F) => drawJar(W, F, cur, tc / 20));
  const fo = liveSVG($(".go", host), (W, F) => drawExao(W, F, "o", x.ex, cur, tc, rd));
  const fc = liveSVG($(".gc", host), (W, F) => drawExao(W, F, "c", x.ex, cur, tc, rd));
  const leg = () => { $(".exleg", host).innerHTML = `<div class="mleg">${["g", "s"].filter(c => x.ex[c] || c === cur).map((c, i) => `<span>${ico(`<line x1="2" y1="12" x2="34" y2="12" style="stroke:${EXD[c].col};stroke-width:3${c === "s" ? ";stroke-dasharray:8 5" : ""}"/>`, 36, 24)}${EXD[c].name}</span>`).join("")}</div>`; };
  const table = () => {
    const have = ["g", "s"].filter(c => x.ex[c]); if (!have.length) { $(".ext", host).innerHTML = ""; return; }
    const T = []; for (let t = 0; t <= 20; t += 2) T.push(t);
    $(".ext", host).innerHTML = ["o", "c"].map(gz => `<details class="tbl"><summary>Tableau de valeurs · ${EXY[gz].short} (%)</summary><div class="tablewrap"><table class="t"><thead><tr><th>Temps (min)</th>${have.map(c => `<th>${EXD[c].name}</th>`).join("")}</tr></thead><tbody>${T.map(t => `<tr><td class="n">${t}</td>${have.map(c => `<td class="n">${f2(EXD[c][gz](t))}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>`).join("");
  };
  const redraw = () => { fj.draw(); fo.draw(); fc.draw(); };
  const read = ev => {
    const svg = ev.currentTarget.querySelector("svg"); if (!svg) return; const b = svg.getBoundingClientRect(), F = fsPx(), L = F * 3.5, R = F * .9, W = b.width;
    const t = Math.round(cl((ev.clientX - b.left - L) / (W - L - R) * 20, 0, 20) * 2) / 2; rd = t;
    const have = ["g", "s"].filter(c => x.ex[c] || (c === cur && tc >= t));
    $(".readout", host).innerHTML = have.length ? nb(`<b>t = ${fmt(t, 1)} min</b> · ` + have.map(c => `${EXD[c].name} : O₂ ${f2(EXD[c].o(t))} % · CO₂ ${f2(EXD[c].c(t))} %`).join(" — ")) : "Lance d'abord une mesure.";
    fo.draw(); fc.draw();
  };
  [".go", ".gc"].forEach(sel => { const el = $(sel, host); el.addEventListener("pointerdown", read); el.tabIndex = 0; el.setAttribute("aria-label", "Graphique : touche pour lire les valeurs ; les mêmes valeurs sont dans le tableau."); });
  const ctl = animCtl($(".animctl", host), 8000, v => { tc = 20 * v; redraw(); if (v >= 1 && !x.ex[cur]) { x.ex[cur] = 1; keep(); leg(); table(); } });
  bindSeg(host, "ex", k => { cur = k; rd = null; ctl.set(x.ex[k] ? 1 : 0); leg(); });
  if (x.ex.g) ctl.set(1);
  leg(); table();
};
