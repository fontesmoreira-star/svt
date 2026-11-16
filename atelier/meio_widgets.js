/* ===== Activité 10 (3e) · La méiose : cellule animée, schéma, loterie, croisement, fécondation ===== */
Store.key = "svt3-meiose-act10-v1";
const WID = {}, LIVE = {};
const ss = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
const f1 = v => (+v).toFixed(1);
const xst = () => { if (!S.x || typeof S.x !== "object") S.x = {}; return S.x; };
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };

/* ---------- modèle : une cellule à 2 paires (une longue, une courte) ; tau de 0 à 1 ---------- */
const TT = { dup: [0.05, 0.14], cond: [0.14, 0.22], envOff: [0.15, 0.23], pair: [0.21, 0.31], ana1: [0.38, 0.47], cyto1: [0.46, 0.56], rot2: [0.57, 0.64], ana2: [0.68, 0.77], cyto2: [0.76, 0.88], envOn: [0.88, 0.97] };
const LENS = [1, 0.62, 0.82], PNAME = ["long", "court", "moyen"];
const P0 = [[[-0.22, -0.16, 0.5], [0.2, 0.14, 2.3]], [[-0.12, 0.25, 1.2], [0.22, -0.24, 2.9]], [[0.04, -0.02, 0.2], [-0.26, 0.06, 1.7]]];
const DEFCFG = { pairs: [{ ori: 1 }, { ori: -1 }] };

function chromatid(x, y, th, L, w, amp, ph, o) {
  const dx = Math.cos(th), dy = Math.sin(th); let d = "";
  for (let i = 0; i <= 12; i++) { const u = i / 12 - 0.5, a = amp * Math.sin(u * 15 + ph); d += (i ? "L" : "M") + f1(x + dx * u * L - dy * a) + "," + f1(y + dy * u * L + dx * a); }
  let g = `<path d="${d}" style="fill:none;stroke:var(--${o ? "chm" : "chp"});stroke-width:${f1(w)};stroke-linecap:round;stroke-linejoin:round"/>`;
  if (o && w > 3) g += `<path d="${d}" style="fill:none;stroke:var(--surface);stroke-width:${f1(w * 0.3)};stroke-dasharray:${f1(w * 0.55)} ${f1(w * 0.75)}"/>`;
  return g;
}
function meioDraw(cx, cy, R, tau, cfg) {
  const n = cfg.pairs.length, at = k => ss(TT[k][0], TT[k][1], tau);
  const dup = at("dup"), cond = at("cond"), envOff = at("envOff"), pr = at("pair"), a1 = at("ana1"), p1 = at("cyto1"), r2 = at("rot2"), a2 = at("ana2"), p2 = at("cyto2"), envOn = at("envOn");
  const hI = 0.98 * R, rI = 0.7 * R, hII = 0.56 * R, rII = 0.525 * R, sw = Math.max(1.6, R * 0.03);
  let g = "";
  const cells = [];
  if (p2 <= 0) { const h = hI * p1, r = lerp(R, rI, p1); cells.push([cx - h, cy, r], [cx + h, cy, r]); }
  else { const h = hII * p2, r = lerp(rI, rII, p2); [-1, 1].forEach(s => [-1, 1].forEach(t => cells.push([cx + s * hI, cy + t * h, r]))); }
  const pinch = p2 > 0 ? p2 : p1;
  cells.forEach(([x, y, r]) => { g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" style="fill:var(--cyto);stroke:var(--ink);stroke-width:${f1(sw)}"/>`; });
  if (pinch < 0.985) cells.forEach(([x, y, r]) => { g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r - sw / 2)}" style="fill:var(--cyto)"/>`; });
  if (envOff < 1) g += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R * 0.6)}" style="fill:var(--nuc);stroke:var(--muted);stroke-width:${f1(sw * 0.7)};opacity:${(1 - envOff).toFixed(2)}"/>`;
  if (envOn > 0) cells.forEach(([x, y, r]) => { g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.74)}" style="fill:var(--nuc);stroke:var(--muted);stroke-width:${f1(sw * 0.7)};opacity:${envOn.toFixed(2)}"/>`; });
  const lsc = n > 2 ? 0.85 : 1, spX = Math.min(0.42 * R, 2 * rI * 0.82 / n), dl = 0.045 * R;
  const w = lerp(Math.max(1.3, R * 0.022), Math.max(2.4, R * 0.075), cond), amp = 0.07 * R * (1 - cond), fs = Math.max(12, R * 0.16);
  const chs = [];
  cfg.pairs.forEach((pq, q) => [0, 1].forEach(o => {
    const ori = pq.ori || 1, side = o === 0 ? -ori : ori, yq = (q - (n - 1) / 2) * (n > 2 ? 0.4 : 0.54) * R, xq = (q - (n - 1) / 2) * spX, P = P0[q][o];
    let x = cx + P[0] * R, y = cy + P[1] * R, th = P[2];
    const mix = (e, X, Y) => { x = lerp(x, X, e); y = lerp(y, Y, e); };
    mix(pr, cx + side * 0.15 * R, cy + yq); th = lerp(th, Math.PI / 2, pr);
    mix(a1, cx + side * 0.58 * R, cy + yq * 0.85);
    mix(p1, cx + side * hI + xq * 0.5, cy + yq * 0.8);
    mix(r2, cx + side * hI + xq, cy); th = lerp(th, 0, r2);
    const L0 = LENS[q] * 0.36 * R * lsc, L = L0 * lerp(1, Math.min(1, spX * 0.86 / L0), r2) * (1 + 1.2 * (1 - cond));
    chs.push({ q, o, x, y, th, L, side, lab: pq.lab ? pq.lab[o] : "" });
  }));
  /* fuseaux de division (traits fins) */
  const op1 = ss(0.25, 0.31, tau) * (1 - ss(0.45, 0.49, tau)) * 0.45, op2 = ss(0.6, 0.65, tau) * (1 - ss(0.76, 0.79, tau)) * 0.45, sp = `stroke:var(--muted);stroke-width:${f1(Math.max(1, R * 0.012))}`;
  if (op1 > 0.01) chs.forEach(c => { g += `<line x1="${f1(cx + c.side * 0.9 * R)}" y1="${f1(cy)}" x2="${f1(c.x)}" y2="${f1(c.y)}" style="${sp};opacity:${op1.toFixed(2)}"/>`; });
  const sepOff = (kk) => kk * (lerp(dl * dup, 0.3 * R, a2) + (hII - 0.3 * R) * p2);
  if (op2 > 0.01) chs.forEach(c => [-1, 1].forEach(kk => { const px = -Math.sin(c.th), py = Math.cos(c.th), o = sepOff(kk); g += `<line x1="${f1(cx + c.side * hI)}" y1="${f1(cy + kk * 0.62 * rI)}" x2="${f1(c.x + px * o)}" y2="${f1(c.y + py * o)}" style="${sp};opacity:${op2.toFixed(2)}"/>`; }));
  /* chromosomes */
  chs.forEach(c => {
    const px = -Math.sin(c.th), py = Math.cos(c.th), dx = Math.cos(c.th), dy = Math.sin(c.th);
    [0, 1].forEach(k => {
      if (k && dup < 0.03) return; const kk = k ? 1 : -1, o = sepOff(kk), X = c.x + px * o, Y = c.y + py * o;
      g += `<g style="opacity:${(k ? dup : 1).toFixed(2)}">${chromatid(X, Y, c.th, c.L, w, amp, c.q * 2 + c.o + k, c.o)}</g>`;
      if (c.lab && cond > 0.5 && (k === 0 || a2 > 0.3)) { const vert = Math.abs(Math.sin(c.th)) > 0.5, lx = vert ? X - dx * (c.L / 2 + fs * 0.75) : X, ly = vert ? Y - dy * (c.L / 2 + fs * 0.75) + fs * 0.36 : Y - (k || a2 > 0.3 ? 1 : 2) * w * 0.9 - fs * 0.3 - (k || a2 > 0.3 ? 0 : dl); g += `<text x="${f1(lx)}" y="${f1(ly)}" text-anchor="middle" style="fill:var(--ink);font-size:${f1(fs)}px;font-weight:800;paint-order:stroke;stroke:var(--cyto);stroke-width:4px">${esc(c.lab)}</text>`; }
    });
    if (dup > 0.6 && cond > 0.6 && a2 < 0.05) g += `<circle cx="${f1(c.x)}" cy="${f1(c.y)}" r="${f1(w * 0.62)}" style="fill:var(--ink)"/>`;
  });
  return g;
}
const meioH = (W, F) => Math.min(Math.max(W * 0.62, 10 * F), 15 * F);
function meioSVG(W, H, tau, cfg, alt) {
  const R = Math.min(H / 2.35, W / 3.5);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${alt || "Cellule en cours de méiose"}">${meioDraw(W / 2, H / 2, R, tau, cfg)}</svg>`;
}
const thumb = tau => meioSVG(180, 110, tau, DEFCFG, "Photo de la cellule");

/* étapes, fenêtres des photos et vignettes */
const PHASES = [
  { n: 1, name: "Interphase", sav: "", a: 0, b: 0.21, txt: "Chaque chromosome fait une copie de lui-même : c'est la duplication. Les chromosomes simples deviennent doubles." },
  { n: 2, name: "Méiose I · les paires se rangent", sav: "prophase I et métaphase I", a: 0.21, b: 0.38, txt: "Les chromosomes deviennent visibles. Les deux chromosomes de chaque paire se placent côte à côte, au milieu de la cellule." },
  { n: 3, name: "Méiose I · les paires se séparent", sav: "anaphase I", a: 0.38, b: 0.47, txt: "Les deux chromosomes de chaque paire se séparent : chacun part vers un pôle de la cellule. Le hasard décide du côté où part chaque chromosome." },
  { n: 4, name: "Méiose I · deux cellules", sav: "télophase I", a: 0.47, b: 0.57, txt: "La cellule se divise en deux. Chaque cellule reçoit un seul chromosome de chaque paire, encore double." },
  { n: 5, name: "Méiose II · les chromosomes s'alignent", sav: "prophase II et métaphase II", a: 0.57, b: 0.68, txt: "Dans chacune des deux cellules, les chromosomes doubles s'alignent au milieu." },
  { n: 6, name: "Méiose II · les chromatides se séparent", sav: "anaphase II", a: 0.68, b: 0.77, txt: "Les deux chromatides de chaque chromosome se séparent et partent vers les pôles." },
  { n: 7, name: "Fin · quatre cellules", sav: "télophase II", a: 0.77, b: 1.001, txt: "Chaque cellule se divise : on obtient 4 cellules reproductrices, avec un chromosome simple de chaque paire." }];
const phaseAt = tau => PHASES.find(p => tau >= p.a && tau < p.b) || PHASES[6];
const SHOTWIN = { paires: [0.305, 0.38], sep1: [0.395, 0.47], deux: [0.56, 0.68], sep2: [0.695, 0.78] };
const SHOTNM = { paires: "les paires de chromosomes rangées au milieu de la cellule", sep1: "les deux chromosomes d'une paire qui se séparent", deux: "deux cellules aux chromosomes encore doubles", sep2: "les chromatides qui se séparent" };
const TAUREF = { d0: 0.03, d1: 0.34, d2: 0.43, d3: 0.66, d4: 0.73, d5: 0.995 };

/* ---------- cellule animée : Lancer / Pause / Recommencer + image par image ---------- */
const CELL = { tau: 0 };
const LEG = note => `<p class="cap"><span class="swl"><span><i style="background:var(--chp)"></i>chromosome venu du père (bleu, plein)</span><span><i class="mat"></i>chromosome venu de la mère (rouge, rayé)</span></span>${note === undefined ? "Modèle simplifié : 2 paires de chromosomes (une longue, une courte) au lieu de 23." : note}</p>`;
function meioWidget(el, o) {
  el.innerHTML = `${o.lead ? `<p class="lead">${nb(o.lead)}</p>` : ""}<div class="row animctl" data-ctl></div><div class="field"><label>Avance ou recule image par image<input type="range" min="0" max="1" step="0.005" value="0" data-sl aria-label="Position dans l'animation"></label></div>
    <div class="figbox" data-fig></div><p class="celllab" data-lab aria-live="polite"></p>${LEG(o.note)}`;
  let tau = 0; const sl = $("[data-sl]", el), lab = $("[data-lab]", el), cfg = () => o.cfg ? o.cfg() : DEFCFG;
  const fig = liveSVG($("[data-fig]", el), (W, F) => meioSVG(W, meioH(W, F), tau, cfg(), o.alt || "Animation d'une cellule qui se divise par méiose : 2 paires de chromosomes, une longue et une courte."));
  let last = "";
  const ctl = animCtl($("[data-ctl]", el), o.dur || 22000, p => {
    tau = p; if (o.track !== false) CELL.tau = p; sl.value = p; fig.draw();
    let t;
    if (o.text) t = o.text(p);
    else if (o.named) { const ph = phaseAt(p); t = `<span class="chip ok">${ph.n} · ${ph.name}</span>${ph.sav ? ` <span class="muted">(${ph.sav})</span>` : ""} ${nb(ph.txt)}`; }
    else t = p <= 0 ? "Touche « Lancer », ou déplace le curseur." : p >= 1 ? "Fin : la cellule de départ a donné 4 cellules." : "";
    if (t !== last) { last = t; lab.innerHTML = t; }
  });
  sl.oninput = () => ctl.set(+sl.value);
  return { ctl, fig };
}
WID.meio = el => meioWidget(el, {});
WID.meioNamed = el => meioWidget(el, { named: true });

/* ---------- les gamètes de Super-Méiose et de Super-Mitose ---------- */
const PAR = { m: { name: "Super-Méiose", sym: "♀", who: "Une cellule de l'ovaire de Super-Méiose", g: ["A", "O"], gam: "cellules reproductrices (ovules)" }, p: { name: "Super-Mitose", sym: "♂", who: "Une cellule du testicule de Super-Mitose", g: ["B", "O"], gam: "cellules reproductrices (spermatozoïdes)" } };
WID.gam = el => {
  let who = "m";
  el.innerHTML = `<div class="seg" role="group" aria-label="Personnage">${["m", "p"].map(k => `<button type="button" data-who="${k}">${PAR[k].sym} ${PAR[k].name} (${PAR[k].g.join("/")})</button>`).join("")}</div><div data-mw></div>`;
  const mw = meioWidget($("[data-mw]", el), { cfg: () => ({ pairs: [{ ori: 1, lab: PAR[who].g }, { ori: -1 }] }), dur: 16000, track: false,
    note: "Modèle simplifié : 2 paires de chromosomes au lieu de 23. Le gène du groupe sanguin est porté par la paire longue ; les lettres indiquent ses allèles.",
    text: p => { const P = PAR[who]; return p <= 0 ? nb(`${P.who} : sur la paire longue, un chromosome porte l'allèle ${P.g[0]}, l'autre porte l'allèle ${P.g[1]}. Touche « Lancer ».`) : p >= 1 ? nb(`Fin : 4 cellules à un chromosome de chaque paire.${who === "m" ? " Chez la femme, une seule d'entre elles devient un ovule." : " Chez l'homme, elles deviennent 4 spermatozoïdes."} Lis l'allèle que porte chacune.`) : `<span class="chip ok">${phaseAt(p).name}</span>`; } });
  const paint = () => $$("[data-who]", el).forEach(b => b.setAttribute("aria-pressed", b.dataset.who === who ? "true" : "false"));
  $$("[data-who]", el).forEach(b => b.onclick = () => { who = b.dataset.who; paint(); mw.ctl.set(0); mw.fig.draw(); });
  paint();
};

/* ---------- le schéma bilan de la fiche, dessiné d'après les choix de l'élève ---------- */
const SCH_W = [["duplication", "fécondation", "séparation des paires"], ["simples", "doubles"], ["simples", "doubles"], ["diploïde", "haploïde"], ["diploïdes", "haploïdes"]];
const SCH_D = ["2 paires de chromosomes simples", "2 paires de chromosomes doubles", "1 chromosome simple de chaque paire", "1 chromosome double de chaque paire"];
const SCH_OKW = { 0: 0, 1: 1, 2: 1, 3: 0, 4: 1 }, SCH_OKD = { 0: 0, 1: 1, 2: 3, 3: 2 };
function miniMeio(cx, cy, r, kind, br) {
  let g = `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" style="fill:var(--cyto);stroke:var(--ink);stroke-width:2"/>`;
  if (kind === undefined) return g + `<text x="${f1(cx)}" y="${f1(cy + r * 0.32)}" text-anchor="middle" style="fill:var(--muted);font-size:${f1(r * 0.9)}px;font-weight:800">?</text>`;
  const set = kind < 2 ? [[0, 0], [0, 1], [1, 0], [1, 1]] : br ? [[0, 1], [1, 0]] : [[0, 0], [1, 1]], dbl = kind === 1 || kind === 3, n = set.length, sp = r * 1.25 / n, w = Math.max(2.2, Math.min(r * 0.12, sp * 0.3));
  set.forEach(([q, o], i) => {
    const x = cx + (i - (n - 1) / 2) * sp + (n === 4 ? (i < 2 ? -0.18 : 0.18) * sp : 0), L = r * 0.95 * (q ? 0.6 : 1), col = o ? "chm" : "chp";
    const ln = (x1, y1, x2, y2) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" style="stroke:var(--${col});stroke-width:${f1(w)};stroke-linecap:round"/>` + (o ? `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" style="stroke:var(--surface);stroke-width:${f1(w * 0.32)};stroke-dasharray:${f1(w * 0.6)} ${f1(w * 0.8)}"/>` : "");
    if (dbl) g += ln(x - w * 0.9, cy - L / 2, x + w * 0.9, cy + L / 2) + ln(x + w * 0.9, cy - L / 2, x - w * 0.9, cy + L / 2) + `<circle cx="${f1(x)}" cy="${f1(cy)}" r="${f1(w * 0.55)}" style="fill:var(--ink)"/>`;
    else g += ln(x, cy - L / 2, x, cy + L / 2);
  });
  return g;
}
const tx = (x, y, segs, anchor, size) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" style="font-size:${f1(size)}px;fill:var(--ink)">${segs.map(([t, h]) => h ? `<tspan style="fill:var(--${t.startsWith("…") ? "muted" : "accent"});font-weight:800">${esc(t)}</tspan>` : esc(t)).join("")}</text>`;
function schemaSVG(W, F, vw, vd) {
  const tk = TK(F), wide = W >= 560, word = i => vw[i] === undefined ? "………" : SCH_W[i][vw[i]];
  const LAB = [[[["46 chromosomes"]], [["(1 cellule, "], [word(3), 1], [")"]]], [[["46 chromosomes "], [word(1), 1]], [["(1 cellule)"]]], [[["23 chromosomes "], [word(2), 1]], [["(2 cellules)"]]], [[["23 chromosomes"]], [["(4 cellules, "], [word(4), 1], [")"]]]];
  const ARR = [[[["Interphase ou"]], [[word(0), 1]]], [[["Méiose I"]]], [[["Méiose II"]]]];
  const lw = wide ? W * 0.34 : 0, xc = wide ? lw + (W - lw) / 2 : W / 2, r = wide ? Math.min(F * 2.3, (W - lw) / 9.6) : Math.min(F * 1.9, (W - 12) / 9.6);
  const lh = tk * 1.25, labH = wide ? 0 : lh * 2 + 6, gapA = Math.max(tk * (wide ? 3 : 3.8), r * 1.4);
  const X = [[xc], [xc], [xc - 2.4 * r, xc + 2.4 * r], [xc - 3.55 * r, xc - 1.25 * r, xc + 1.25 * r, xc + 3.55 * r]], Y = [];
  let y = 6, g = "";
  for (let L = 0; L < 4; L++) { y += labH + r; Y.push(y); y += r + (L < 3 ? gapA : 8); }
  const H = y, aw = Math.max(3, r * 0.09);
  for (let L = 0; L < 3; L++) {
    const nar = !wide && L > 0, y1 = Y[L] + r + 4 + (nar ? tk * 1.5 : 0), y2 = Y[L + 1] - r - labH - 4, ym = nar ? Y[L] + r + 4 + tk * 0.95 - tk * 0.35 : (y1 + y2) / 2;
    if (L === 0) g += arrow(xc, y1, xc, y2, aw, "accent") + ARR[0].map((s, i) => tx(xc + 12, ym + (i - 0.35) * lh, s, "start", tk * 0.95)).join("");
    if (L === 1) g += X[2].map(x2 => arrow(xc + (x2 - xc) * 0.12, y1, x2 - (x2 - xc) * 0.1, y2, aw, "accent")).join("") + tx(xc, ym + tk * 0.35, ARR[1][0], "middle", tk * 0.95);
    if (L === 2) { X[2].forEach((x1, i) => [X[3][2 * i], X[3][2 * i + 1]].forEach(x2 => { g += arrow(x1 + (x2 - x1) * 0.15, y1, x2 - (x2 - x1) * 0.08, y2, aw, "accent"); })); g += tx(xc, ym + tk * 0.35, ARR[2][0], "middle", tk * 0.95); }
  }
  LAB.forEach((ls, L) => ls.forEach((s, i) => { g += wide ? tx(4, Y[L] + (i - 0.3) * lh * 1.1, s, "start", tk * (i ? 1 : 1.1)) : tx(xc, Y[L] - r - labH + lh * (i + 0.85), s, "middle", tk * (i ? 0.88 : 1)); }));
  X.forEach((xs, L) => xs.forEach((x, i) => { g += miniMeio(x, Y[L], r, vd[L], L === 2 ? i : L === 3 ? (i < 2 ? 0 : 1) : 0); }));
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Schéma montrant comment 1 cellule à 46 chromosomes donne 4 cellules à 23 chromosomes. Les mots et les dessins suivent tes choix.">${g}</svg>`;
}
LIVE.schema = (W, F, v) => schemaSVG(W, F, (v && v[0]) || {}, (v && v[1]) || {});
WID.schemaFinal = el => { el.innerHTML = `<div class="figbox"></div>`; liveSVG($(".figbox", el), (W, F) => schemaSVG(W, F, SCH_OKW, SCH_OKD)); };

/* ---------- la loterie de la méiose ---------- */
const lot = () => { const x = xst(); if (!x.lot || typeof x.lot !== "object") x.lot = { runs: {}, found: {} }; return x.lot; };
const keyName = key => key.split("").map((c, q) => `${PNAME[q]} : ${c === "p" ? "père" : "mère"}`).join(", ");
function gamSVG(key, n, size) {
  const r = size / 2 - 3, c = size / 2; let g = "";
  if (!key) g = `<circle cx="${c}" cy="${c}" r="${r}" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:5 4"/><text x="${c}" y="${c + r * 0.3}" text-anchor="middle" style="fill:var(--muted);font-size:${f1(r * 0.85)}px;font-weight:800">?</text>`;
  else { g = `<circle cx="${c}" cy="${c}" r="${r}" style="fill:var(--cyto);stroke:var(--ink);stroke-width:2"/>`; const sp = r * 1.1 / n, w = Math.max(3, Math.min(r * 0.16, sp * 0.4)); key.split("").forEach((o, q) => { const x = c + (q - (n - 1) / 2) * sp, L = r * 1.05 * LENS[q], col = o === "m" ? "chm" : "chp"; g += `<line x1="${f1(x)}" y1="${f1(c - L / 2)}" x2="${f1(x)}" y2="${f1(c + L / 2)}" style="stroke:var(--${col});stroke-width:${f1(w)};stroke-linecap:round"/>` + (o === "m" ? `<line x1="${f1(x)}" y1="${f1(c - L / 2)}" x2="${f1(x)}" y2="${f1(c + L / 2)}" style="stroke:var(--surface);stroke-width:${f1(w * 0.32)};stroke-dasharray:${f1(w * 0.6)} ${f1(w * 0.8)}"/>` : ""); }); }
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true">${g}</svg>`;
}
const allKeys = n => Array.from({ length: 1 << n }, (_, i) => Array.from({ length: n }, (_, q) => (i >> (n - 1 - q)) & 1 ? "m" : "p").join(""));
WID.loterie = el => {
  let n = 2, cfg = { pairs: [{ ori: 1 }, { ori: -1 }] }, tau = 0.22, busy = false;
  el.innerHTML = `<p class="lead">${nb("Chaque méiose répartit les chromosomes de chaque paire entre les cellules. Lance plusieurs méioses et collectionne les sortes de cellules reproductrices obtenues.")}</p>
    <div class="opt3"><div><span class="lab3">Nombre de paires</span><div class="seg" role="group" aria-label="Nombre de paires de chromosomes">${[1, 2, 3].map(k => `<button type="button" data-n="${k}">${k} paire${k > 1 ? "s" : ""}</button>`).join("")}</div></div></div>
    <div class="row"><button type="button" class="btn" data-go>🎲 Faire une méiose</button></div>
    <div class="figbox" data-fig></div><p class="readout" data-out aria-live="polite"></p>
    <div class="coll"></div>${LEG("Modèle simplifié : 1 à 3 paires de chromosomes au lieu de 23.")}
    <div class="calc"><p class="lab3">${nb("Et avec plus de paires ?")}</p><div class="field"><label>Nombre de paires de chromosomes : <b data-cn>23</b><input type="range" min="1" max="23" step="1" value="23" data-cr aria-label="Nombre de paires de chromosomes"></label></div><p class="readout" data-cout aria-live="polite"></p></div>`;
  const fig = liveSVG($("[data-fig]", el), (W, F) => meioSVG(W, Math.min(meioH(W, F), 12 * F), tau, cfg, `Cellule à ${n} paire(s) de chromosomes en méiose.`));
  const coll = () => { const L = lot(), f = (L.found[n] = L.found[n] || {}), ks = allKeys(n), got = ks.filter(k => f[k]).length, runs = (L.runs[n] || 0);
    $(".coll", el).innerHTML = `<p class="lead"><b>Ma collection</b> (${n} paire${n > 1 ? "s" : ""}) : ${runs} méiose${runs > 1 ? "s" : ""} · <b>${got} / ${ks.length}</b> sortes de cellules reproductrices trouvées.</p><div class="gams">${ks.map(k => `<div class="gam ${f[k] ? "has" : ""}" role="img" aria-label="${f[k] ? `Cellule ${keyName(k)}, obtenue ${f[k]} fois` : "Sorte pas encore trouvée"}">${gamSVG(f[k] ? k : "", n, 54)}<span>${f[k] ? "× " + f[k] : "?"}</span></div>`).join("")}</div>`; };
  const paint = () => { $$("[data-n]", el).forEach(b => b.setAttribute("aria-pressed", +b.dataset.n === n ? "true" : "false")); $("[data-go]", el).disabled = busy; coll(); };
  const go = () => {
    if (busy) return; busy = true; cfg = { pairs: Array.from({ length: n }, () => ({ ori: Math.random() < 0.5 ? 1 : -1 })) }; paint();
    const t0 = performance.now(), dur = 4200;
    const step = now => { if (!document.body.contains(el)) return; const q = Math.min(1, (now - t0) / dur); tau = lerp(0.22, 1, q); fig.draw();
      $("[data-out]", el).innerHTML = q < 0.3 ? "Les paires se rangent au milieu… de quel côté part chaque chromosome ?" : q < 1 ? phaseAt(tau).name : "";
      if (q < 1) return requestAnimationFrame(step);
      const left = cfg.pairs.map(p => p.ori === 1 ? "p" : "m").join(""), right = left.split("").map(c => c === "p" ? "m" : "p").join(""), L = lot(), f = (L.found[n] = L.found[n] || {});
      f[left] = (f[left] || 0) + 2; f[right] = (f[right] || 0) + 2; L.runs[n] = (L.runs[n] || 0) + 1; busy = false; keep(); paint();
      $("[data-out]", el).innerHTML = nb(`Méiose n° ${L.runs[n]} : 2 cellules « ${keyName(left)} » et 2 cellules « ${keyName(right)} ».`);
    };
    requestAnimationFrame(step);
  };
  const calc = () => { const N = +$("[data-cr]", el).value, v = Math.pow(2, N); $("[data-cn]", el).textContent = N; $("[data-cout]", el).innerHTML = nb(`Avec ${N} paire${N > 1 ? "s" : ""} : 2 × 2 × … (${N} fois) = 2${supStr(N)} = <b>${fmt(v)}</b> sortes de cellules reproductrices différentes.`); };
  $$("[data-n]", el).forEach(b => b.onclick = () => { if (busy) return; n = +b.dataset.n; cfg = { pairs: Array.from({ length: n }, (_, q) => ({ ori: q % 2 ? -1 : 1 })) }; tau = 0.22; fig.draw(); $("[data-out]", el).innerHTML = ""; paint(); });
  $("[data-go]", el).onclick = go; $("[data-cr]", el).oninput = calc;
  paint(); calc(); $("[data-out]", el).innerHTML = "Touche « 🎲 Faire une méiose ».";
};

/* ---------- animation : la fécondation (après le tableau de croisement) ---------- */
const FEC = [["A", "B", "AB", "A/B"], ["A", "O", "A", "A/O"], ["O", "B", "B", "B/O"], ["O", "O", "O", "O/O"]];
WID.fecond = el => {
  el.innerHTML = `<div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div><p class="cap">${nb("Rappel des activités précédentes : l'allèle O est récessif ; les allèles A et B s'expriment tous les deux.")}</p>`;
  let p = 0, last = "";
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), rowH = Math.max(F * 3, 56), H = rowH * 4 + 6, xo = W * 0.24, ro = Math.min(F * 1.15, rowH * 0.4); let g = "";
    FEC.forEach(([a, b, grp, gt], i) => {
      const y = 3 + rowH * (i + 0.5), t0 = i * 0.13, q = seg(p, t0, t0 + 0.34), fus = seg(p, t0 + 0.34, t0 + 0.42), res = seg(p, t0 + 0.42, t0 + 0.5);
      g += `<circle cx="${f1(xo)}" cy="${f1(y)}" r="${f1(ro * (1 + 0.12 * fus))}" style="fill:var(--ovu);stroke:var(--${fus > 0.5 ? "accent" : "ink"});stroke-width:${fus > 0.5 ? 3 : 2}"/>`;
      g += `<text x="${f1(xo)}" y="${f1(y + tk * 0.36)}" text-anchor="middle" style="fill:var(--ink);font-size:${f1(tk * (fus > 0.5 ? 1 : 1.1))}px;font-weight:800">${fus > 0.5 ? gt : a}</text>`;
      if (fus < 0.5) { const hx = lerp(W - F * 2.6, xo + ro + F * 0.1, q), wig = F * 0.28, ph = p * 70 + i; let d = `M${f1(hx + F * 0.4)},${f1(y)}`; for (let k = 1; k <= 8; k++) d += ` L${f1(hx + F * 0.4 + k * F * 0.26)},${f1(y + Math.sin(ph + k * 0.9) * wig * k / 8)}`;
        g += `<path d="${d}" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linecap:round"/><ellipse cx="${f1(hx)}" cy="${f1(y)}" rx="${f1(F * 0.45)}" ry="${f1(F * 0.32)}" style="fill:var(--spz);stroke:var(--ink);stroke-width:1.6"/>` + sT(hx, y - F * 0.5, b, "middle", tk * 0.9, 'font-weight="800"'); }
      if (res > 0) g += `<g style="opacity:${res.toFixed(2)}">` + sT(xo + ro * 1.45, y - tk * 0.15, "cellule-œuf " + gt, "start", tk * 0.9, 'font-weight="700"') + sT(xo + ro * 1.45, y + tk * 1.05, "→ groupe " + grp, "start", tk * 0.9, 'font-weight="800" style="fill:var(--accent)"') + `</g>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Quatre fécondations : ovule A et spermatozoïde B donnent une cellule-œuf A/B, groupe AB ; A et O donnent A/O, groupe A ; O et B donnent B/O, groupe B ; O et O donnent O/O, groupe O.">${g}</svg>`;
  });
  animCtl($(".animctl", el), 9000, x => { p = x; fig.draw(); const t = x <= 0 ? "Quatre rencontres possibles entre un ovule et un spermatozoïde." : x < 1 ? "Fécondation : chaque spermatozoïde s'unit à un ovule et forme une cellule-œuf." : "Un même couple peut avoir des enfants des groupes AB, A, B et O : la méiose, puis la fécondation au hasard, créent de la diversité génétique."; if (t !== last) { last = t; $(".readout", el).innerHTML = nb(t); } });
};
