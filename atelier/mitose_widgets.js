/* ===== Activité 9 (3e) · Multiplication cellulaire : cellule animée, graphique, schéma bilan ===== */
Store.key = "mitose-3e-act9-v1";
const ss = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- modèle : une cellule à 4 chromosomes (2 longs, 2 courts), tau de 0 à 1 ---------- */
const CHR = [{ len: 1, col: "chl", p: [-0.22, -0.2], a: 0.5, my: -0.61, ph: 0.4 }, { len: 1, col: "chl", p: [0.2, 0.14], a: 2.2, my: -0.11, ph: 1.9 }, { len: 0.6, col: "chs", p: [-0.14, 0.25], a: 1.2, my: 0.32, ph: 3.1 }, { len: 0.6, col: "chs", p: [0.2, -0.27], a: 2.9, my: 0.68, ph: 4.4 }];
const PHASES = [
  { id: "inter", n: 1, name: "INTERPHASE", a: 0, b: 0.25, txt: "Les chromatides de chacun des chromosomes se dupliquent : on passe de chromosomes simples à des chromosomes doubles." },
  { id: "pro", n: 2, name: "PROPHASE", a: 0.25, b: 0.43, txt: "Les molécules d'A.D.N. se pelotonnent. Les chromosomes deviennent visibles." },
  { id: "meta", n: 3, name: "MÉTAPHASE", a: 0.43, b: 0.53, txt: "Les chromosomes doubles sont alignés à l'équateur de la cellule." },
  { id: "ana", n: 4, name: "ANAPHASE", a: 0.53, b: 0.68, txt: "Les chromatides de chaque chromosome double se séparent et migrent chacune vers un pôle de la cellule : on passe de chromosomes doubles à des chromosomes simples." },
  { id: "telo", n: 5, name: "TÉLOPHASE", a: 0.68, b: 0.79, txt: "Les chromosomes à une chromatide sont aux pôles. On a donc chaque type de chromosomes simples de la cellule de départ à chaque pôle." },
  { id: "fin", n: 6, name: "", a: 0.79, b: 1.001, txt: "L'A.D.N. se dépelotonne. Le cytoplasme se divise. Les membranes se forment, divisant la cellule en deux." }];
const phaseAt = tau => PHASES.find(p => tau >= p.a && tau < p.b) || PHASES[5];
const SHOTWIN = { pro: [0.3, 0.43], meta: [0.455, 0.53], ana: [0.545, 0.675], telo: [0.685, 0.8] };
/* instants représentatifs de chaque étape (vignettes) */
const TAUREF = { inter: 0.2, pro: 0.38, meta: 0.5, ana: 0.61, telo: 0.73, fin: 0.99 };

function cellBody(cx, cy, R, tau) {
  const dup = ss(0.1, 0.25, tau), dec = ss(0.8, 0.94, tau), cond = ss(0.25, 0.36, tau) * (1 - dec), align = ss(0.4, 0.47, tau), sep = ss(0.53, 0.68, tau), pinch = ss(0.74, 0.98, tau);
  const h = (0.22 * ss(0.53, 0.74, tau) + 0.63 * pinch) * R, r = R * (1 - 0.22 * pinch), sw = Math.max(1.6, R * 0.035), xN = 0.42 * R + 0.55 * h;
  const env0 = 1 - ss(0.26, 0.36, tau), env1 = ss(0.8, 0.92, tau), f = v => v.toFixed(1);
  let g = "";
  [-1, 1].forEach(s => { g += `<circle cx="${f(cx + s * h)}" cy="${f(cy)}" r="${f(r)}" style="fill:var(--cyto);stroke:var(--ink);stroke-width:${f(sw)}"/>`; });
  if (pinch < 0.985) [-1, 1].forEach(s => { g += `<circle cx="${f(cx + s * h)}" cy="${f(cy)}" r="${f(r - sw / 2)}" style="fill:var(--cyto)"/>`; });
  if (env0 > 0.02) g += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.58)}" style="fill:var(--nuc);stroke:var(--muted);stroke-width:${f(sw * 0.7)};opacity:${env0.toFixed(2)}"/>`;
  if (env1 > 0.02) [-1, 1].forEach(s => { g += `<circle cx="${f(cx + s * xN)}" cy="${f(cy)}" r="${f(R * 0.47)}" style="fill:var(--nuc);stroke:var(--muted);stroke-width:${f(sw * 0.7)};opacity:${env1.toFixed(2)}"/>`; });
  const wMin = Math.max(1.3, R * 0.022), w = lerp(wMin, R * 0.085, cond);
  CHR.forEach(c => [0, 1].forEach(k => {
    const side = k ? 1 : -1, op = k ? dup : 1; if (op < 0.03) return;
    const L = c.len * 0.34 * R * (1 + 1.3 * (1 - cond)), amp = 0.075 * R * (1 - cond);
    const th = lerp(c.a, Math.PI / 2, align) + side * 0.3 * cond * (1 - sep) * dup;
    const dl = lerp(0.03, 0.018, cond) * R * dup * (1 - sep);
    const x0 = cx + lerp(c.p[0] * R, 0, align) + side * dl * Math.abs(Math.sin(th)) + side * xN * sep + c.p[0] * 0.5 * R * dec * (k ? 1 : 1);
    const y0 = cy + lerp(c.p[1] * R, lerp(c.my * R, c.my * R * 0.95, sep), align) - side * dl * Math.cos(th) * 0.3 + (c.p[1] * R - c.my * R * 0.95) * 0.8 * dec;
    const thd = lerp(th, c.a + (k ? 0.9 : 0), dec), dx = Math.cos(thd), dy = Math.sin(thd); let d = "";
    for (let i = 0; i <= 12; i++) { const u = i / 12 - 0.5, o = amp * Math.sin(u * 15 + c.ph + k); d += (i ? "L" : "M") + f(x0 + dx * u * L - dy * o) + "," + f(y0 + dy * u * L + dx * o); }
    g += `<path d="${d}" style="fill:none;stroke:var(--${c.col});stroke-width:${f(w)};stroke-linecap:round;stroke-linejoin:round;opacity:${op.toFixed(2)}"/>`;
    if (k && cond > 0.6 && sep < 0.04) g += `<circle cx="${f(cx + lerp(c.p[0] * R, 0, align))}" cy="${f(y0)}" r="${f(w * 0.62)}" style="fill:var(--ink)"/>`;
  }));
  return g;
}
function cellSVG(W, H, tau, alt) {
  const R = Math.min(H * 0.44, W / 3.5);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${alt || "Cellule en cours de multiplication"}">${cellBody(W / 2, H / 2, R, tau)}</svg>`;
}
const thumb = tau => cellSVG(180, 104, tau, "Photo de la cellule");

/* ---------- cellule animée : Lancer / Pause / Recommencer + image par image ---------- */
const CELL = { tau: 0 };
function cellWidget(el, named, extra) {
  el.innerHTML = nb(`<p class="lead">${named ? "L'animation est maintenant commentée : le nom et la description de chaque étape s'affichent." : "Modèle simplifié : une cellule à 4 chromosomes (2 longs en vert, 2 courts en jaune)."}</p>
    <div class="row animctl" data-ctl></div><div class="field"><label>Avance ou recule image par image<input type="range" min="0" max="1" step="0.005" value="0" data-sl aria-label="Position dans l'animation"></label></div>
    <div class="figbox" data-fig></div><p class="celllab" data-lab aria-live="polite"></p>`);
  let tau = 0; const sl = $("[data-sl]", el), lab = $("[data-lab]", el);
  const fig = liveSVG($("[data-fig]", el), (W, F) => cellSVG(W, Math.min(Math.max(W * 0.42, 9 * F), 14 * F), tau));
  const ctl = animCtl($("[data-ctl]", el), 18000, p => {
    tau = p; CELL.tau = p; sl.value = p; fig.draw();
    if (named) { const ph = phaseAt(p); lab.innerHTML = `<span class="chip ok">${ph.n} · ${ph.name || "fin de la division"}</span> ${nb(ph.txt)}`; }
    else lab.textContent = p <= 0 ? "Touche « Lancer », ou déplace le curseur." : p >= 1 ? "Fin : la cellule s'est multipliée." : "";
    if (extra) extra(p);
  });
  sl.oninput = () => ctl.set(+sl.value);
  return ctl;
}
const WID = {};
WID.cell = el => cellWidget(el, false);
WID.cellNamed = el => cellWidget(el, true);

/* ---------- graphique : quantité d'ADN par cellule ---------- */
const ADN = { mere: [[0, 1], [2, 1], [4, 1], [6, 1], [8, 1], [9, 1.1], [10, 1.3], [11, 1.5], [12, 1.7], [13, 1.9], [14, 2], [16, 2], [18, 2], [20, 2], [22, 2]], fille: [[22, 2], [22.5, 1], [24, 1], [26, 1], [28, 1], [30, 1]] };
const qFmt = v => Math.abs(v - 1) < 1e-6 ? "Q" : Math.abs(v - 2) < 1e-6 ? "2Q" : v === 0 ? "0" : fmt(v, 1) + " Q";
const adnSpec = extra => Object.assign({ type: "line", series: [{ name: "Cellule de départ", pts: ADN.mere, color: "c3", w: 3.4, dash: "" }, { name: "Cellule-fille 1", pts: ADN.fille, color: "c2", w: 3.6, dash: "" }, { name: "Cellule-fille 2", pts: ADN.fille, color: "c1", w: 3.6, dash: "3 9" }],
  xMin: 0, xMax: 30, xStep: 5, yMin: 0, yMax: 2.5, yStep: 1, xTitle: "Temps (heures)", yTitle: "Quantité d'ADN dans une cellule", yFmt: qFmt, yRead: qFmt, xRead: v => fmt(v, 1) + NB + "h", h: 14, alt: "Quantité d'ADN contenue dans une cellule en fonction du temps" }, extra || {});
WID.adn = el => { el.innerHTML = `<div class="chartbox" data-ch></div><p class="cap">${nb("Les deux cellules-filles ont la même quantité d'ADN : leurs courbes sont superposées.")}</p>`; mountChart($("[data-ch]", el), adnSpec({ anim: true, animStart: "empty", animDur: 8000 })); };
/* temps du graphique (h) correspondant à l'instant tau de l'animation */
const TMAP = [[0, 0], [0.1, 8], [0.25, 14], [0.3, 20], [0.76, 21.8], [0.98, 22.5], [1, 30]];
const hoursAt = tau => { for (let i = 1; i < TMAP.length; i++) if (tau <= TMAP[i][0]) { const [a, b] = [TMAP[i - 1], TMAP[i]]; return a[1] + (b[1] - a[1]) * (tau - a[0]) / (b[0] - a[0]); } return 30; };
WID.sync = el => {
  el.innerHTML = `<div data-cell></div><h4>Quantité d'ADN au même instant</h4><div class="chartbox" data-ch></div>`;
  const ch = mountChart($("[data-ch]", el), adnSpec({ table: false, readHint: " " }));
  cellWidget($("[data-cell]", el), true, p => { ch.cut = p >= 1 ? null : hoursAt(p); ch.sel = null; ch.draw(); });
};

/* ---------- schéma bilan : mini-cellules dessinées selon les choix de l'élève ---------- */
function miniCell(cx, cy, R, kind, F) {
  let g = `<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:var(--cyto);stroke:var(--ink);stroke-width:2"/><circle cx="${cx}" cy="${cy}" r="${R * 0.66}" style="fill:var(--nuc);stroke:var(--muted);stroke-width:1.3"/>`;
  if (!kind) return g + `<text x="${cx}" y="${cy + F * 0.45}" text-anchor="middle" style="fill:var(--ink);font-size:${F * 1.3}px;font-weight:800">?</text>`;
  const set = { s4: [["chl", 1, 0], ["chl", 1, 0], ["chs", 0.62, 0], ["chs", 0.62, 0]], d4: [["chl", 1, 1], ["chl", 1, 1], ["chs", 0.62, 1], ["chs", 0.62, 1]], s2: [["chl", 1, 0], ["chs", 0.62, 0]], s8: [["chl", 1, 0], ["chl", 1, 0], ["chl", 1, 0], ["chl", 1, 0], ["chs", 0.62, 0], ["chs", 0.62, 0], ["chs", 0.62, 0], ["chs", 0.62, 0]] }[kind];
  const n = set.length, sp = R * 1.05 / n, w = Math.max(2.5, Math.min(R * 0.11, sp * 0.3));
  set.forEach(([col, len, dbl], i) => {
    const x = cx + (i - (n - 1) / 2) * sp, L = R * 0.62 * len, st = `stroke:var(--${col});stroke-width:${w.toFixed(1)};stroke-linecap:round`;
    if (dbl) g += `<line x1="${x - w * 0.9}" y1="${cy - L / 2}" x2="${x + w * 0.9}" y2="${cy + L / 2}" style="${st}"/><line x1="${x + w * 0.9}" y1="${cy - L / 2}" x2="${x - w * 0.9}" y2="${cy + L / 2}" style="${st}"/><circle cx="${x}" cy="${cy}" r="${w * 0.55}" style="fill:var(--ink)"/>`;
    else g += `<line x1="${x}" y1="${cy - L / 2}" x2="${x}" y2="${cy + L / 2}" style="${st}"/>`;
  });
  return g;
}
function schemaSVG(W, F, v) {
  const tk = TK(F), R = Math.min(W * 0.115, F * 3.4), H = R * 4.9 + tk * 1.6, y = H / 2 - tk * 0.5, xA = R + 4, xB = W * 0.47, xC = W - R - 4, yC = y - R * 1.18, yD = y + R * 1.18;
  const mid = ["s4", "d4", "s8"][v[0]], fin = ["s2", "s4", "d4"][v[1]];
  const ar = (x1, y1, x2, y2) => arrow(x1, y1, x2, y2, Math.max(4, R * 0.13), "accent");
  let g = miniCell(xA, y, R, "s4", F) + miniCell(xB, y, R, mid, F) + miniCell(xC, yC, R, fin, F) + miniCell(xC, yD, R, fin, F);
  g += ar(xA + R + 8, y, xB - R - 10, y) + ar(xB + R + 8, y - R * 0.3, xC - R - 10, yC + R * 0.2) + ar(xB + R + 8, y + R * 0.3, xC - R - 10, yD - R * 0.2);
  const badge = (x, yy, t) => `<circle cx="${x}" cy="${yy}" r="${tk * 0.85}" style="fill:var(--accent)"/><text x="${x}" y="${yy + tk * 0.36}" text-anchor="middle" style="fill:var(--accent-ink);font-size:${tk}px;font-weight:800">${t}</text>`;
  g += badge((xA + xB) / 2, y - tk * 1.5, "1") + badge((xB + xC) / 2 - R * 0.1, y, "2");
  g += sT(xA, y + R + tk * 1.3, "départ", "middle", tk, 'font-weight="700"') + sT(xB, y + R + tk * (W < 480 ? 2.5 : 1.3), "avant de se diviser", "middle", tk, 'font-weight="700"') + sT(xC, H - 3, "cellules-filles", "middle", tk, 'font-weight="700"');
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Schéma bilan : une cellule de départ à 4 chromosomes simples, une flèche numérotée 1 vers la cellule juste avant sa division, puis une flèche numérotée 2 vers les deux cellules-filles. Le contenu des cellules suit tes choix.">${g}</svg>`;
}
