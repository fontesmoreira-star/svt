/* ===== 3e SVT · Révision du chapitre (activités 1 à 10) : simulations et animations ===== */
Store.key = "svt3-revision-genetique-act1-10-v1";
const WID = {}, LIVE = {};
const ss = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
const f1 = v => (+v).toFixed(1);
const xst = () => { if (!S.x || typeof S.x !== "object") S.x = {}; return S.x; };
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const LEG = note => `<p class="cap"><span class="swl"><span><i style="background:var(--chp)"></i>chromosome venu du père (bleu, plein)</span><span><i class="mat"></i>chromosome venu de la mère (rouge, rayé)</span></span>${note || ""}</p>`;

/* ---------- dessins repris des activités 9 (mitose) et 10 (méiose), mêmes couleurs ---------- */
const CHR = [{ len: 1, col: "chp", p: [-0.22, -0.2], a: 0.5, my: -0.61, ph: 0.4 }, { len: 1, col: "chm", p: [0.2, 0.14], a: 2.2, my: -0.11, ph: 1.9 }, { len: 0.6, col: "chp", p: [-0.14, 0.25], a: 1.2, my: 0.32, ph: 3.1 }, { len: 0.6, col: "chm", p: [0.2, -0.27], a: 2.9, my: 0.68, ph: 4.4 }];
function mitoBody(cx, cy, R, tau) {
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
    if (c.col === "chm" && w > 3) g += `<path d="${d}" style="fill:none;stroke:var(--surface);stroke-width:${f(w * 0.3)};stroke-dasharray:${f(w * 0.55)} ${f(w * 0.75)};opacity:${op.toFixed(2)}"/>`;
    if (k && cond > 0.6 && sep < 0.04) g += `<circle cx="${f(cx + lerp(c.p[0] * R, 0, align))}" cy="${f(y0)}" r="${f(w * 0.62)}" style="fill:var(--ink)"/>`;
  }));
  return g;
}

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

const mitoSVG = (W, H, tau, alt) => { const R = Math.min(H * 0.44, W / 3.5); return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${alt}">${mitoBody(W / 2, H / 2, R, tau)}</svg>`; };
const meioSVG = (W, H, tau, alt) => { const R = Math.min(H / 2.35, W / 3.5); return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${alt}">${meioDraw(W / 2, H / 2, R, tau, DEFCFG)}</svg>`; };
