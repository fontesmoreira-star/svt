/* ===== 2nde SVT · Thème 1 · Chapitre 3 · Activité 3 « L'organisation des vertébrés » : dessins, TP virtuels et logiciel =====
   Carpe et grenouille : pôles et axes de polarité à nommer, pliage le long d'un plan (vue de dessus), radiographie virtuelle
   (comparaison avec une roussette, squelette cartilagineux), limites tête | tronc | queue, squelette et axes.
   Logiciel de classification inspiré de Phylogène : membres antérieurs de la mésange, de l'oreillard, de la tortue et de la grenouille,
   os à colorier, puis alignement animé et comparaison avec l'aile d'un papillon. Dessins schématiques, valeurs simulées signalées ⚠. */
Store.key = "svt2-organisation-vertebres-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const N1 = x => (+x).toFixed(1);
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const ez = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const LP = (a, b, t) => a + (b - a) * t;
const D2R = Math.PI / 180;
const RMO = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
const s14 = F => Math.max(15, TK(F) * .9);
let UID = 0; const uid = p => p + (++UID);
function tx(x, y, s, o) {
  o = o || {};
  const halo = o.h ? `;paint-order:stroke;stroke:${o.hc || "var(--surface)"};stroke-width:${N1(o.s * .3)}px;stroke-linejoin:round` : "";
  return `<text x="${N1(x)}" y="${N1(y)}" text-anchor="${o.a || "middle"}" style="fill:${o.c || "var(--ink)"};font-size:${N1(o.s)}px;font-weight:${o.w || 700}${o.op !== undefined ? ";opacity:" + N1(o.op) : ""}${halo}">${esc(s)}</text>`;
}
const segH = (name, opts, cur, attr) => `<div class="seg" role="group" aria-label="${name}">${opts.map(([k, lab]) => `<button type="button" data-${attr}="${k}" aria-pressed="${k === cur}">${lab}</button>`).join("")}</div>`;
function bindSeg(host, attr, fn) { $$(`[data-${attr}]`, host).forEach(b => b.onclick = () => { $$(`[data-${attr}]`, host).forEach(c => c.setAttribute("aria-pressed", String(c === b))); fn(b.dataset[attr]); }); }
const svgW = (W, H, label, g, vb) => `<svg viewBox="${vb || `0 0 ${N1(W)} ${N1(H)}`}" width="${N1(W)}" height="${N1(H)}" role="img" aria-label="${esc(label)}">${g}</svg>`;
function tween(ms, onT, done) { if (RMO) { onT(1); if (done) done(); return; } let t0 = 0; const f = ts => { if (!t0) t0 = ts; const t = Math.min(1, (ts - t0) / ms); onT(t); if (t < 1) requestAnimationFrame(f); else if (done) done(); }; requestAnimationFrame(f); }
const pinV = (x, y, n, r, on) => `<circle cx="${N1(x)}" cy="${N1(y)}" r="${N1(r)}" style="fill:${on ? "#fff3b0" : "#fff"};stroke:#1a1a1a;stroke-width:${N1(r * (on ? .24 : .14))}"/><text x="${N1(x)}" y="${N1(y + r * .42)}" text-anchor="middle" style="fill:#1a1a1a;font-size:${N1(r * 1.2)}px;font-weight:800">${n}</text>`;
/* scène dessinée dans un repère 1000 × 560 ; textes et repères gardent une taille lisible à l'écran */
const SCN = (W, label, g) => svgW(W, W * .56, label, g, "0 0 1000 560");
const sk = (W, F) => { const k = W / 1000; return { k, fs: s14(F) / k, pr: Math.max(11, F * .55) / k }; };
const LB = (x, y, s, fs, o) => tx(x, y, s, Object.assign({ s: fs, c: "#1b1b1b", h: 1, hc: "#ffffff" }, o || {}));
const tap = (svg, ev) => { const b = svg.getBoundingClientRect(); return [(ev.clientX - b.left) / b.width * 1000, (ev.clientY - b.top) / b.height * 560]; };

/* ---------- géométrie ---------- */
const yAt = (P, x) => { if (x <= P[0][0]) return P[0][1]; for (let i = 1; i < P.length; i++) if (x <= P[i][0]) { const [a, va] = P[i - 1], [b, vb] = P[i]; return va + (vb - va) * (x - a) / (b - a); } return P[P.length - 1][1]; };
function crPath(P, closed) {
  const n = P.length, g = i => closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))];
  let d = `M${N1(P[0][0])},${N1(P[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    d += `C${N1(p1[0] + (p2[0] - p0[0]) / 6)},${N1(p1[1] + (p2[1] - p0[1]) / 6)} ${N1(p2[0] - (p3[0] - p1[0]) / 6)},${N1(p2[1] - (p3[1] - p1[1]) / 6)} ${N1(p2[0])},${N1(p2[1])}`;
  }
  return d + (closed ? "Z" : "");
}
const mir = (P, y0) => P.map(([x, y]) => [x, 2 * y0 - y]);
const MIRROR = g => `<g transform="translate(0,560) scale(1,-1)">${g}</g>`;
const ell = (x, y, rx, ry) => `M${N1(x - rx)},${N1(y)} a${N1(rx)},${N1(ry)} 0 1,0 ${N1(2 * rx)},0 a${N1(rx)},${N1(ry)} 0 1,0 ${N1(-2 * rx)},0 Z`;
const lerpPt = (P, u) => { const L = []; let T = 0; for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); L.push(l); T += l; } let d = u * T; for (let i = 1; i < P.length; i++) { if (d <= L[i - 1] || i === P.length - 1) { const t = L[i - 1] ? Math.min(1, d / L[i - 1]) : 0; return [LP(P[i - 1][0], P[i][0], t), LP(P[i - 1][1], P[i][1], t)]; } d -= L[i - 1]; } return P[P.length - 1]; };
/* membre « charnu » : traits arrondis superposés (contour puis couleur) */
const limbS = (pts, ws, fill, out, ow) => {
  let a = "", b = ""; for (let i = 1; i < pts.length; i++) { const [x1, y1] = pts[i - 1], [x2, y2] = pts[i], w = ws[Math.min(i - 1, ws.length - 1)];
    a += `<line x1="${N1(x1)}" y1="${N1(y1)}" x2="${N1(x2)}" y2="${N1(y2)}" style="stroke:${out};stroke-width:${N1(w + (ow || 5))};stroke-linecap:round"/>`;
    b += `<line x1="${N1(x1)}" y1="${N1(y1)}" x2="${N1(x2)}" y2="${N1(y2)}" style="stroke:${fill};stroke-width:${N1(w)};stroke-linecap:round"/>`; }
  return a + b;
};

/* ---------- rendu d'un squelette à partir de primitives ----------
   l : os droit · s : os courbe · p : os plein (crâne) · h : trou (orbite) · r : vertèbre · c : petit os rond · d : détail (trait sombre) */
function R(P, s) {
  let a = "", b = "";
  const O = s.out, ow = s.ow || 3.5;
  P.forEach(p => {
    const c = s.fill(p.k), op = s.op ? s.op(p.k) : 1, ops = op < 1 ? `;opacity:${N1(op)}` : "";
    if (p.t === "l") { const L = `x1="${N1(p.x1)}" y1="${N1(p.y1)}" x2="${N1(p.x2)}" y2="${N1(p.y2)}"`; if (O) a += `<line ${L} style="stroke:${O};stroke-width:${N1(p.w + ow)};stroke-linecap:round${ops}"/>`; b += `<line ${L} style="stroke:${c};stroke-width:${N1(p.w)};stroke-linecap:round${ops}"/>`; }
    else if (p.t === "s") { const st = `fill:none;stroke-linecap:round;stroke-linejoin:round${ops}`; if (O) a += `<path d="${p.d}" style="${st};stroke:${O};stroke-width:${N1(p.w + ow)}"/>`; b += `<path d="${p.d}" style="${st};stroke:${c};stroke-width:${N1(p.w)}"/>`; }
    else if (p.t === "p") b += `<path d="${p.d}" style="fill:${c};stroke:${O || c};stroke-width:${O ? 2.5 : 0}${ops}"/>`;
    else if (p.t === "h") b += `<path d="${p.d}" style="fill:${s.bg};stroke:${O || "none"};stroke-width:2"/>`;
    else if (p.t === "r") { const R0 = `x="${N1(p.x - p.w / 2)}" y="${N1(p.y - p.h / 2)}" width="${N1(p.w)}" height="${N1(p.h)}" rx="${N1(Math.min(p.w, p.h) * .3)}"`; b += `<rect ${R0} style="fill:${c};stroke:${O || c};stroke-width:${O ? 2 : 0}${ops}"/>`; }
    else if (p.t === "c") b += `<circle cx="${N1(p.x)}" cy="${N1(p.y)}" r="${N1(p.r)}" style="fill:${c};stroke:${O || c};stroke-width:${O ? 2 : 0}${ops}"/>`;
    else if (p.t === "d") b += `<path d="${p.d}" style="fill:none;stroke:${s.det};stroke-width:${N1(p.w || 2)};stroke-linecap:round${ops}"/>`;
  });
  return a + b;
}
/* styles : radiographie (os blancs sur fond sombre), planche anatomique (os ivoire cernés) */
const XR = (op, hl) => ({ fill: k => (hl && hl[k]) || "#eef4ff", op: () => op, bg: "#22303f", det: "#4e6278", out: null });
const PLATE = hl => ({ fill: k => (hl && hl[k]) || "#efe6d2", out: "#6b5a3e", ow: 3.5, bg: "#f6f1e6", det: "#8a7656" });

/* =====================================================================
   LA CARPE (vue de côté, tête à gauche)
   ===================================================================== */
const CPT = [[95, 300], [120, 262], [170, 228], [250, 200], [330, 178], [420, 165], [500, 166], [600, 182], [700, 228], [790, 268]];
const CPB = [[95, 312], [130, 342], [180, 365], [240, 385], [320, 402], [420, 412], [520, 408], [620, 388], [700, 355], [790, 332]];
const CBODY = crPath([...CPT, ...CPB.slice().reverse()], true);
const cTop = x => yAt(CPT, x), cBot = x => yAt(CPB, x);
const CFIN = {
  caud: "M785,270 C830,240 880,200 928,163 C910,230 890,272 880,300 C890,330 910,372 928,437 C880,402 830,362 785,330 Z",
  dors: "M402,170 L446,92 C480,104 530,128 652,202 C600,188 500,172 402,170 Z",
  anal: "M648,380 L700,442 C715,446 728,442 738,436 L712,362 Z",
  pect: "M262,372 C280,418 302,440 336,450 C322,420 304,392 290,376 Z",
  pelv: "M470,408 C484,446 506,466 534,474 C528,446 516,424 504,404 Z" };
function carpShape(c) {
  const f = d => `<path d="${d}" style="fill:${c.fin};stroke:${c.out};stroke-width:2.5;stroke-linejoin:round"/>`;
  return f(CFIN.caud) + f(CFIN.dors) + f(CFIN.anal) + `<path d="${CBODY}" style="fill:${c.body};stroke:${c.out};stroke-width:3"/>` + (c.inner || "") + f(CFIN.pect) + f(CFIN.pelv) + (c.top || "");
}
function carpSide() {
  const id = uid("cb");
  let sc = ""; for (let i = 0, x = 272; x < 790; x += 26, i++) for (let y = 168; y < 420; y += 24) { const yy = y + (i % 2) * 12; sc += `<path d="M${x},${yy - 11} q10,11 0,22" style="fill:none;stroke:#5e4620;stroke-width:1.4;opacity:.35"/>`; }
  const inner = `<defs><clipPath id="${id}"><path d="${CBODY}"/></clipPath></defs><g clip-path="url(#${id})"><path d="M60,332 C250,336 600,352 820,318 L820,470 L60,470 Z" style="fill:#ead59a;opacity:.9"/><path d="M60,150 C250,196 500,188 820,258 L820,90 L60,90 Z" style="fill:#5e4a1e;opacity:.5"/>${sc}</g>
    <path d="M232,214 C268,262 268,330 236,372" style="fill:none;stroke:#5e4620;stroke-width:3"/><path d="M262,276 C400,290 600,296 790,300" style="fill:none;stroke:#3f2f12;stroke-width:2;stroke-dasharray:3 7"/>`;
  const top = `<circle cx="172" cy="266" r="15" style="fill:#f1e2b0;stroke:#3a2a10;stroke-width:2"/><circle cx="170" cy="266" r="8" style="fill:#14100a"/>
    <path d="M98,306 C108,312 120,314 132,312" style="fill:none;stroke:#3a2a10;stroke-width:3"/><path d="M118,312 C112,326 104,334 96,338 M128,314 C126,330 122,340 116,348" style="fill:none;stroke:#6e5527;stroke-width:2.5"/>`;
  return carpShape({ fin: "#c9a25a", body: "#b8893a", out: "#5e4620", inner, top });
}
const fan = (from, edge, n, w, k) => { const P = []; for (let i = 0; i < n; i++) { const e = lerpPt(edge, n > 1 ? i / (n - 1) : 0), f = Array.isArray(from[0]) ? lerpPt(from, n > 1 ? i / (n - 1) : 0) : from; P.push({ t: "l", k, x1: f[0], y1: f[1], x2: e[0], y2: e[1], w: typeof w === "function" ? w(i) : w }); } return P; };
function carpSkel() {
  const P = [];
  P.push({ k: "crane", t: "p", d: "M98,302 C108,262 150,232 200,222 C226,216 246,214 260,222 L264,256 C264,300 264,340 258,364 C230,374 190,370 160,354 C130,340 108,324 98,302 Z" });
  P.push({ k: "crane", t: "h", d: ell(172, 266, 21, 19) });
  P.push({ k: "crane", t: "d", d: "M104,310 C140,330 180,340 214,338", w: 3 }, { k: "crane", t: "d", d: "M226,226 C256,270 256,330 230,362", w: 3 }, { k: "crane", t: "d", d: "M120,286 C150,300 190,304 226,298", w: 2 });
  P.push({ k: "ant", t: "s", d: "M266,222 C278,270 282,330 276,374", w: 8 });
  P.push(...fan([276, 376], [[284, 420], [300, 436], [318, 444], [336, 450]], 6, 3, "ant"));
  const V = [];
  for (let i = 0; i < 31; i++) { const x = 272 + i * 17, y = 296 + i * .2; V.push([x, y]); }
  V.forEach(([x, y]) => {
    P.push({ k: "col", t: "l", x1: x + 2, y1: y - 8, x2: x + 13, y2: cTop(x + 13) + 16, w: 3 });
    if (x <= 600) P.push({ k: "cote", t: "s", d: `M${x},${y + 8} Q${x + 24},${N1((y + cBot(x)) / 2)} ${x + 14},${N1(cBot(x + 14) - 16)}`, w: 3.4 });
    else P.push({ k: "col", t: "l", x1: x + 2, y1: y + 8, x2: x + 13, y2: cBot(x + 13) - 14, w: 3 });
  });
  V.forEach(([x, y]) => P.push({ k: "col", t: "r", x, y, w: 14, h: 17 }));
  P.push(...fan([[402, 172], [652, 204]], [[446, 96], [540, 140], [648, 202]], 12, i => i ? 2.4 : 5, "nage"));
  P.push(...fan([[652, 380], [712, 364]], [[700, 440], [735, 434], [712, 364]], 6, 2.4, "nage"));
  P.push({ k: "post", t: "l", x1: 466, y1: 392, x2: 506, y2: 402, w: 7 });
  P.push(...fan([502, 406], [[486, 448], [506, 464], [534, 472]], 5, 3, "post"));
  P.push(...fan([[790, 286], [790, 314]], [[926, 166], [880, 300], [926, 434]], 15, 2.4, "nage"));
  P.push({ k: "col", t: "r", x: 795, y: 301, w: 16, h: 24 });
  return P;
}

/* =====================================================================
   LA ROUSSETTE (petit requin, squelette cartilagineux)
   ===================================================================== */
const RT = [[60, 300], [100, 281], [170, 264], [280, 254], [420, 256], [560, 266], [700, 277], [822, 286]];
const RB = [[60, 307], [110, 323], [190, 339], [300, 347], [440, 343], [580, 329], [700, 313], [822, 300]];
const RBODY = crPath([...RT, ...RB.slice().reverse()], true);
const RFIN = {
  caud: "M815,284 C870,282 930,276 976,270 L980,284 C950,300 905,314 862,320 C842,314 828,307 815,302 Z",
  d1: "M520,264 C545,226 565,212 586,212 L602,268 Z", d2: "M650,273 C668,246 682,238 696,238 L706,279 Z",
  pect: "M205,338 C240,372 276,396 312,402 C300,372 280,350 252,340 Z", pelv: "M470,341 C490,360 515,372 542,372 C530,352 515,340 494,336 Z",
  anal: "M640,320 C660,337 680,343 702,340 C690,325 680,316 668,312 Z" };
function sharkShape(c) {
  const f = d => `<path d="${d}" style="fill:${c.fin};stroke:${c.out};stroke-width:2.5;stroke-linejoin:round"/>`;
  return f(RFIN.caud) + f(RFIN.d1) + f(RFIN.d2) + f(RFIN.anal) + `<path d="${RBODY}" style="fill:${c.body};stroke:${c.out};stroke-width:3"/>` + (c.inner || "") + f(RFIN.pect) + f(RFIN.pelv) + (c.top || "");
}
function sharkSide() {
  const id = uid("rb"); let sp = ""; const r = (() => { let s = 7; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; })();
  for (let i = 0; i < 70; i++) { const x = 120 + r() * 700, y = 255 + r() * 70; if (y < yAt(RB, x) - 8 && y > yAt(RT, x) + 4) sp += `<circle cx="${N1(x)}" cy="${N1(y)}" r="${N1(2 + r() * 3.5)}" style="fill:#5b4630;opacity:.75"/>`; }
  const inner = `<defs><clipPath id="${id}"><path d="${RBODY}"/></clipPath></defs><g clip-path="url(#${id})"><path d="M40,322 C250,330 600,325 830,300 L830,380 L40,380 Z" style="fill:#efe3c6;opacity:.9"/>${sp}</g>`;
  let gill = ""; for (let i = 0; i < 5; i++) gill += `<path d="M${205 + i * 10},${298 + i} C${209 + i * 10},${308 + i} ${209 + i * 10},${318 + i} ${205 + i * 10},${326 + i}" style="fill:none;stroke:#4a3a26;stroke-width:2"/>`;
  const top = `<ellipse cx="135" cy="286" rx="11" ry="6" style="fill:#2b241a"/><path d="M80,312 C100,318 125,320 150,316" style="fill:none;stroke:#4a3a26;stroke-width:2.5"/>${gill}`;
  return sharkShape({ fin: "#b79c6e", body: "#c8ad7c", out: "#5d4a2e", inner, top });
}
function sharkSkel() {
  const P = [{ k: "crane", t: "p", d: "M70,304 C90,286 140,274 200,276 L206,322 C160,332 110,324 70,307 Z" }, { k: "crane", t: "h", d: ell(138, 288, 12, 8) },
    { k: "crane", t: "s", d: "M98,318 C130,334 170,338 204,330", w: 6 }];
  for (let i = 0; i < 48; i++) { const x = 212 + i * 16, y = x < 820 ? 300 + (x - 212) / 608 * -2 : 298 - (x - 820) * .16; if (x > 975) break; P.push({ k: "col", t: "r", x, y, w: 12, h: x < 820 ? 13 : 10 }); if (x < 830) P.push({ k: "col", t: "l", x1: x + 2, y1: y - 6, x2: x + 6, y2: yAt(RT, x) + 10, w: 2.5 }); }
  P.push({ k: "ant", t: "s", d: "M214,286 C222,310 226,330 222,346", w: 7 }, ...fan([[230, 344], [262, 346]], [[244, 360], [280, 384], [306, 398]], 7, 2.5, "ant"));
  P.push({ k: "post", t: "l", x1: 476, y1: 334, x2: 504, y2: 336, w: 6 }, ...fan([500, 338], [[492, 356], [516, 368], [538, 370]], 4, 2.5, "post"));
  P.push(...fan([[530, 264], [596, 266]], [[548, 230], [570, 216], [588, 216]], 6, 2.5, "nage"));
  return P;
}

/* =====================================================================
   LA GRENOUILLE · vue de côté (assise, tête à gauche) et vue de dessus
   ===================================================================== */
const GS = [[95, 300], [120, 268], [175, 244], [240, 234], [330, 214], [450, 204], [560, 218], [630, 252], [652, 300], [640, 345], [600, 372], [480, 392], [340, 392], [230, 372], [150, 342], [108, 318]];
const GSB = crPath(GS, true);
function frogSide() {
  const id = uid("gs"), G = "#6f9e3f", O = "#2f4a18";
  let g = `<defs><clipPath id="${id}"><path d="${GSB}"/></clipPath></defs>`;
  g += `<path d="${GSB}" style="fill:${G};stroke:${O};stroke-width:3"/><g clip-path="url(#${id})"><path d="M80,338 C250,366 500,384 670,330 L670,420 L80,420 Z" style="fill:#e5e2a6"/>`;
  [[400, 240, 26, 13], [500, 236, 20, 11], [330, 250, 16, 9], [560, 262, 18, 10], [450, 290, 14, 8]].forEach(([x, y, a, b]) => g += `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" style="fill:#3f5f22;opacity:.8"/>`);
  g += `</g><circle cx="308" cy="262" r="21" style="fill:#5a7f33;stroke:${O};stroke-width:2"/>`;
  g += limbS([[615, 322], [520, 398]], [58], G, O) + limbS([[520, 398], [640, 446]], [38], G, O) + limbS([[640, 446], [500, 472]], [20], G, O);
  [[455, 462], [450, 476], [456, 488], [470, 494]].forEach(t => g += limbS([[500, 472], t], [8], G, O, 4));
  g += limbS([[300, 345], [290, 420], [296, 470]], [30, 22], G, O);
  [[268, 480], [286, 483], [306, 483], [324, 478]].forEach(t => g += limbS([[296, 470], t], [8], G, O, 4));
  g += `<circle cx="225" cy="232" r="27" style="fill:${G};stroke:${O};stroke-width:3"/><circle cx="225" cy="232" r="17" style="fill:#c9a227;stroke:#3a2a10;stroke-width:2"/><ellipse cx="225" cy="232" rx="11" ry="6" style="fill:#121008"/>`;
  g += `<path d="M100,312 C140,322 180,326 216,320" style="fill:none;stroke:${O};stroke-width:3"/><circle cx="118" cy="286" r="3" style="fill:${O}"/>`;
  return g;
}
const GT = [[92, 280], [100, 250], [128, 222], [172, 205], [240, 200], [300, 195], [380, 180], [470, 178], [560, 195], [630, 225], [664, 255], [675, 280]];
const GTB = crPath([...GT, ...mir(GT, 280).reverse().slice(1, -1)], true);
const FARM = { sh: [285, 207], el: [305, 132], wr: [232, 100], f: [[178, 62], [168, 88], [176, 114], [196, 134]] };
const FLEG = { hip: [655, 252], kn: [762, 172], an: [872, 140], ft: [918, 121], t: [[975, 64], [985, 94], [986, 124], [978, 152], [958, 172]] };
function frogTopHalf(c) {
  let g = limbS([FLEG.hip, FLEG.kn, FLEG.an, FLEG.ft], [58, 40, 22], c.body, c.out);
  if (c.web) g += `<path d="M${FLEG.ft} ${FLEG.t.map(p => "L" + p).join(" ")} Z" style="fill:${c.web};opacity:.75"/>`;
  FLEG.t.forEach(t => g += limbS([FLEG.ft, t], [9], c.body, c.out, 4));
  g += limbS([FARM.sh, FARM.el, FARM.wr], [30, 24], c.body, c.out);
  FARM.f.forEach(t => g += limbS([FARM.wr, t], [9], c.body, c.out, 4));
  return g;
}
function frogTop(c) {
  c = c || { body: "#6f9e3f", out: "#2f4a18", web: "#8fb862", spot: "#3f5f22", eye: 1 };
  const half = frogTopHalf(c);
  let g = half + MIRROR(half) + `<path d="${GTB}" style="fill:${c.body};stroke:${c.out};stroke-width:3"/>`;
  if (c.spot) { [[400, 228, 24, 12], [500, 236, 20, 11], [330, 240, 15, 9], [560, 262, 16, 10]].forEach(([x, y, a, b]) => { g += `<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" style="fill:${c.spot};opacity:.8"/><ellipse cx="${x}" cy="${560 - y}" rx="${a}" ry="${b}" style="fill:${c.spot};opacity:.8"/>`; });
    g += `<path d="M250,232 C350,238 500,240 600,248 M250,328 C350,322 500,320 600,312" style="fill:none;stroke:#c7d98a;stroke-width:5;opacity:.7"/>`; }
  if (c.eye) [212, 348].forEach(y => g += `<ellipse cx="200" cy="${y}" rx="26" ry="21" style="fill:${c.body};stroke:${c.out};stroke-width:3"/><ellipse cx="204" cy="${y}" rx="15" ry="11" style="fill:#c9a227;stroke:#3a2a10;stroke-width:2"/><ellipse cx="204" cy="${y}" rx="10" ry="4" style="fill:#121008"/>`);
  return g;
}
/* squelette de grenouille, vue dorsale : « mid » sur l'axe, « side » répété en miroir */
function frogSkel() {
  const mid = [], side = [];
  mid.push({ k: "crane", t: "p", d: "M98,280 C100,245 135,214 180,200 L236,196 C252,206 260,236 262,262 L262,298 C260,324 252,354 236,364 L180,360 C135,346 100,315 98,280 Z" });
  mid.push({ k: "crane", t: "h", d: ell(192, 236, 34, 23) }, { k: "crane", t: "h", d: ell(192, 324, 34, 23) }, { k: "crane", t: "d", d: "M120,280 L250,280", w: 2 });
  for (let i = 0; i < 8; i++) { const x = 276 + i * 34; mid.push({ k: "col", t: "r", x, y: 280, w: 26, h: 24 }); side.push({ k: "col", t: "l", x1: x + 2, y1: 270, x2: x + 6, y2: 280 - [44, 62, 56, 50, 47, 44, 42, 40][i], w: 6 }); }
  mid.push({ k: "col", t: "r", x: 552, y: 280, w: 26, h: 26 }); side.push({ k: "col", t: "l", x1: 556, y1: 270, x2: 578, y2: 226, w: 10 });
  mid.push({ k: "uro", t: "l", x1: 572, y1: 280, x2: 652, y2: 280, w: 10 });
  side.push({ k: "post", t: "l", x1: 580, y1: 230, x2: 660, y2: 268, w: 9 }); mid.push({ k: "post", t: "c", x: 664, y: 280, r: 15 });
  side.push({ k: "ant", t: "p", d: "M262,258 L302,256 L306,226 L270,222 Z" }, { k: "ant", t: "l", x1: 286, y1: 228, x2: 287, y2: 208, w: 10 }, { k: "ant", t: "l", x1: 286, y1: 210, x2: 248, y2: 240, w: 5 });
  side.push({ k: "ant", t: "l", x1: FARM.sh[0], y1: FARM.sh[1], x2: FARM.el[0], y2: FARM.el[1], w: 10 }, { k: "ant", t: "l", x1: FARM.el[0], y1: FARM.el[1], x2: FARM.wr[0], y2: FARM.wr[1], w: 12 },
    { k: "ant", t: "d", d: `M${N1(LP(FARM.el[0], FARM.wr[0], .2))},${N1(LP(FARM.el[1], FARM.wr[1], .2) + 1)} L${N1(LP(FARM.el[0], FARM.wr[0], .8))},${N1(LP(FARM.el[1], FARM.wr[1], .8) + 1)}`, w: 1.6 });
  [[-6, -3], [2, 6], [-4, 9]].forEach(([dx, dy]) => side.push({ k: "ant", t: "c", x: FARM.wr[0] - 8 + dx, y: FARM.wr[1] + dy, r: 5 }));
  FARM.f.forEach(t => { const b = [FARM.wr[0] - 12, FARM.wr[1]]; [[0, .5], [.56, .8], [.84, 1]].forEach(([a, z], j) => side.push({ k: "ant", t: "l", x1: LP(b[0], t[0], a), y1: LP(b[1], t[1], a), x2: LP(b[0], t[0], z) , y2: LP(b[1], t[1], z), w: [5, 4, 3][j] })); });
  side.push({ k: "post", t: "l", x1: FLEG.hip[0], y1: FLEG.hip[1], x2: FLEG.kn[0], y2: FLEG.kn[1], w: 11 }, { k: "post", t: "l", x1: FLEG.kn[0], y1: FLEG.kn[1], x2: FLEG.an[0], y2: FLEG.an[1], w: 12 },
    { k: "post", t: "l", x1: FLEG.an[0], y1: FLEG.an[1] - 5, x2: FLEG.ft[0], y2: FLEG.ft[1] - 5, w: 6 }, { k: "post", t: "l", x1: FLEG.an[0] + 2, y1: FLEG.an[1] + 6, x2: FLEG.ft[0] + 2, y2: FLEG.ft[1] + 6, w: 6 });
  FLEG.t.forEach(t => { const b = [FLEG.ft[0] + 6, FLEG.ft[1]]; [[0, .45], [.5, .75], [.8, 1]].forEach(([a, z], j) => side.push({ k: "post", t: "l", x1: LP(b[0], t[0], a), y1: LP(b[1], t[1], a), x2: LP(b[0], t[0], z), y2: LP(b[1], t[1], z), w: [5, 4, 3][j] })); });
  return { mid, side };
}
const frogSkelSVG = st => { const S0 = frogSkel(); return R(S0.side, st) + MIRROR(R(S0.side, st)) + R(S0.mid, st); };

/* =====================================================================
   1. Axes de polarité et plan de symétrie (carpe et grenouille)
   ===================================================================== */
const POLE = { av: "Avant · pôle antérieur", ar: "Arrière · pôle postérieur", do: "Dos · pôle dorsal", ve: "Ventre · pôle ventral" };
const POLES = { c: [["do", 480, 52], ["av", 42, 304], ["ve", 480, 518], ["ar", 964, 300]], g: [["ar", 724, 300], ["do", 400, 146], ["av", 52, 300], ["ve", 400, 522]] };
const AXL = { c: { ap: [62, 302, 944, 302], dv: [480, 72, 480, 498] }, g: { ap: [74, 300, 702, 300], dv: [400, 168, 400, 500] } };
const AN = { c: "Carpe", g: "Grenouille" };
const BGW = `<rect width="1000" height="560" style="fill:#d3e7ec"/><path d="M0,80 C200,60 400,100 600,80 S900,60 1000,84 M0,500 C200,480 420,520 640,496 S900,480 1000,504" style="fill:none;stroke:#b4d3db;stroke-width:6"/>`;
const BGL = `<rect width="1000" height="560" style="fill:#e3ead0"/><path d="M0,486 C300,476 700,484 1000,476 L1000,560 L0,560 Z" style="fill:#c8d4a6"/>`;
const BGT = `<rect width="1000" height="560" style="fill:#e3ead0"/>`;
const axDone = (an, ax) => { const p = ((xst().ax || {}).p || {})[an] || {}, need = ax === "ap" ? ["av", "ar"] : ["do", "ve"]; return need.every(k => POLES[an].some(([kk], i) => kk === k && p[i] === k)); };
function arrow2(x1, y1, x2, y2, col, w, gr) {
  const xa = LP(x1, x2, .5 - gr / 2), ya = LP(y1, y2, .5 - gr / 2), xb = LP(x1, x2, .5 + gr / 2), yb = LP(y1, y2, .5 + gr / 2), a = Math.atan2(yb - ya, xb - xa), h = w * 3.4;
  const head = (x, y, s) => `<path d="M${N1(x)},${N1(y)} L${N1(x - s * h * Math.cos(a) + h * .6 * Math.sin(a))},${N1(y - s * h * Math.sin(a) - h * .6 * Math.cos(a))} L${N1(x - s * h * Math.cos(a) - h * .6 * Math.sin(a))},${N1(y - s * h * Math.sin(a) + h * .6 * Math.cos(a))} Z" style="fill:${col}"/>`;
  return `<line x1="${N1(xa)}" y1="${N1(ya)}" x2="${N1(xb)}" y2="${N1(yb)}" style="stroke:#ffffff;stroke-width:${N1(w + 5)};stroke-linecap:round;opacity:.85"/><line x1="${N1(xa)}" y1="${N1(ya)}" x2="${N1(xb)}" y2="${N1(yb)}" style="stroke:${col};stroke-width:${N1(w)};stroke-linecap:round"/>` + (gr > .98 ? head(xb, yb, 1) + head(xa, ya, -1) : "");
}
function sideScene(W, F, an, sel, grow) {
  const { fs, pr } = sk(W, F), x = xst().ax, p = x.p[an];
  let g = an === "c" ? BGW + carpSide() : BGL + frogSide();
  const A = AXL[an];
  ["ap", "dv"].forEach(ax => { const gr = grow[an + ax]; if (gr > 0) { const [x1, y1, x2, y2] = A[ax]; g += arrow2(x1, y1, x2, y2, ax === "ap" ? "#c0392b" : "#1f5fbf", 7, gr); if (gr > .98 && W >= 560) g += ax === "ap" ? LB(an === "c" ? 600 : 575, y1 - fs * .7, "axe antéro-postérieur", fs * .95, { c: "#9b2216" }) : LB(x1 + fs * .5, an === "c" ? 140 : 206, "axe dorso-ventral", fs * .95, { a: "start", c: "#163f80" }); } });
  POLES[an].forEach(([k, px, py], i) => {
    const ok = p[i] === k, bad = p[i] && !ok;
    g += pinV(px, py, i + 1, pr, sel === i);
    if (ok) { const lab = W >= 560 ? POLE[k].split(" · ")[0] : "", ax = px < 120 ? "start" : px > 880 ? "end" : "middle", dy = py < 150 ? pr * 1.9 : py > 450 ? -pr * 1.3 : -pr * 1.4; g += LB(px + (ax === "start" ? -pr : ax === "end" ? pr : 0), py + dy, ("✓ " + lab).trim(), fs, { a: ax, c: "#0c5a2a" }); }
    if (bad) g += `<circle cx="${N1(px)}" cy="${N1(py)}" r="${N1(pr * 1.3)}" style="fill:none;stroke:#c0392b;stroke-width:${N1(pr * .2)}"/>`;
  });
  return SCN(W, `${AN[an]} vue de côté, tête à gauche. Repères numérotés aux deux extrémités du corps, sur le dos et sous le ventre.`, g);
}
/* vue de dessus et pliage : la moitié supérieure (A) ou avant (B) bascule sur l'autre moitié */
function topScene(W, F, an, fold) {
  const { fs } = sk(W, F), id = uid("tf"), draw = () => an === "c" ? carpTop() : frogTop(), SIL = { body: "#ffd166", fin: "#ffd166", out: "#b86e00", web: "#ffd166" }, ghost = () => an === "c" ? carpTop(SIL) : frogTop(SIL);
  const bg = an === "c" ? `<rect width="1000" height="560" style="fill:#d3e7ec"/>` : BGT;
  let g = bg + `<defs><clipPath id="${id}a"><rect x="0" y="0" width="1000" height="280"/></clipPath><clipPath id="${id}b"><rect x="0" y="280" width="1000" height="280"/></clipPath><clipPath id="${id}c"><rect x="0" y="0" width="500" height="560"/></clipPath><clipPath id="${id}d"><rect x="500" y="0" width="500" height="560"/></clipPath></defs>`;
  const f = fold || {}, t = f.t || 0, s = Math.cos(Math.PI * t), op = s < 0 ? .6 : 1;
  if (!f.k || t === 0) g += draw();
  else if (f.k === "A") g += `<g clip-path="url(#${id}b)">${draw()}</g><g style="opacity:.25" clip-path="url(#${id}a)">${draw()}</g><g transform="translate(0,280) scale(1,${N1(s).replace("-0.0", "-0.01")}) translate(0,-280)"><g clip-path="url(#${id}a)" style="opacity:${op}">${s < 0 ? ghost() : draw()}</g></g>`;
  else g += `<g clip-path="url(#${id}d)">${draw()}</g><g style="opacity:.25" clip-path="url(#${id}c)">${draw()}</g><g transform="translate(500,0) scale(${N1(s).replace("-0.0", "-0.01")},1) translate(-500,0)"><g clip-path="url(#${id}c)" style="opacity:${op}">${s < 0 ? ghost() : draw()}</g></g>`;
  const dA = (xst().ax.f[an] || {}).A;
  g += `<line x1="30" y1="280" x2="970" y2="280" style="stroke:#c0392b;stroke-width:4;stroke-dasharray:14 9"/>` + LB(978, 280 - fs * .5, dA ? (W >= 560 ? "A · plan de symétrie" : "A") : "ligne A", fs, { a: "end", c: "#9b2216" });
  g += `<line x1="500" y1="20" x2="500" y2="540" style="stroke:#6c3fa0;stroke-width:4;stroke-dasharray:14 9"/>` + LB(500 + fs * .4, 540 - fs * .3, "ligne B", fs, { a: "start", c: "#4a2577" });
  if (dA && !f.k) g += LB(330, 60, W >= 560 ? "côté droit de l'animal" : "côté droit", fs, { c: "#0c5a2a" }) + LB(330, 515, W >= 560 ? "côté gauche de l'animal" : "côté gauche", fs, { c: "#0c5a2a" });
  g += LB(an === "c" ? 70 : 60, 280 - fs * 1.6, "tête", fs * .9, { a: "start" });
  return SCN(W, `${AN[an]} vue de dessus, tête à gauche. Ligne A : de la tête à la queue. Ligne B : en travers du corps.`, g);
}
const CTOP = [[95, 280], [115, 262], [160, 246], [230, 233], [320, 225], [420, 227], [520, 237], [640, 253], [760, 268], [805, 273], [860, 276], [915, 278]];
const CTB = crPath([...CTOP, ...mir(CTOP, 280).reverse().slice(1, -1)], true);
function carpTop(c) {
  const sil = !!c; c = c || { body: "#b8893a", fin: "#c9a25a", out: "#5e4620" };
  const O = c.out, fin = d => `<path d="${d}" style="fill:${c.fin};stroke:${O};stroke-width:2.5;stroke-linejoin:round"/>`;
  const half = fin("M262,238 C280,200 300,176 336,168 C330,196 316,222 300,240 Z") + fin("M478,232 C494,206 512,190 546,184 C540,206 530,226 516,238 Z");
  let g = half + MIRROR(half) + `<path d="${CTB}" style="fill:${c.body};stroke:${O};stroke-width:3"/>`;
  if (sil) return g;
  g += `<path d="M180,280 C300,268 600,270 860,278 C600,290 300,292 180,280 Z" style="fill:#5e4a1e;opacity:.55"/>`;
  g += `<line x1="404" y1="280" x2="650" y2="280" style="stroke:#6e5527;stroke-width:7;stroke-linecap:round"/>`;
  [252, 308].forEach(y => g += `<circle cx="166" cy="${y}" r="10" style="fill:#f1e2b0;stroke:#3a2a10;stroke-width:2"/><circle cx="164" cy="${y}" r="5" style="fill:#14100a"/>`);
  return g;
}
WID.axes = host => {
  const x = xst(); x.ax = x.ax || {}; x.ax.p = x.ax.p || { c: {}, g: {} }; x.ax.f = x.ax.f || { c: {}, g: {} }; x.ax.e = x.ax.e || 0;
  let an = "c", vw = "s", sel = -1, busy = false; const grow = {};
  ["c", "g"].forEach(a => ["ap", "dv"].forEach(k => grow[a + k] = axDone(a, k) ? 1 : 0));
  host.innerHTML = `${segH("Animal", [["c", "🐟 Carpe"], ["g", "🐸 Grenouille"]], "c", "an")}${segH("Vue", [["s", "Vue de côté : les axes"], ["t", "Vue de dessus : le plan"]], "s", "vw")}
    <div class="figbox ax-f"></div><div class="mleg ax-l"></div><div class="ax-q" aria-live="polite"></div><div class="ax-c"></div>`;
  const fig = $(".ax-f", host);
  const fold = { k: null, t: 0 };
  const leg = () => { $(".ax-l", host).innerHTML = vw === "s" ? `<span><span class="sq" style="background:#c0392b"></span>${axDone(an, "ap") ? "✓" : "○"} axe antéro-postérieur (avant ↔ arrière)</span><span><span class="sq" style="background:#1f5fbf"></span>${axDone(an, "dv") ? "✓" : "○"} axe dorso-ventral (dos ↔ ventre)</span>` : `<span><span class="sq" style="background:#ffd166"></span>moitié pliée</span><span><span class="sq" style="background:#c0392b"></span>ligne A</span><span><span class="sq" style="background:#6c3fa0"></span>ligne B</span>`; };
  const draw = () => { const W = Math.max(260, fig.clientWidth || 320), F = fsPx(); fig.innerHTML = vw === "s" ? sideScene(W, F, an, sel, grow) : topScene(W, F, an, fold); bindTap(); leg(); };
  const bindTap = () => { const svg = $("svg", fig); if (!svg || vw !== "s") return; svg.onclick = ev => { const [px, py] = tap(svg, ev), i = POLES[an].findIndex(([, qx, qy]) => Math.hypot(qx - px, qy - py) < 60); if (i >= 0) { sel = i; draw(); ask(); } }; };
  const count = () => { const n = a => POLES[a].filter(([k], i) => x.ax.p[a][i] === k).length, fa = a => !!(x.ax.f[a] || {}).A;
    $(".ax-c", host).innerHTML = `<p class="task ${n("c") + n("g") === 8 && fa("c") && fa("g") ? "is-ok" : ""}">${n("c") === 4 ? "✓" : "○"} Carpe : ${n("c")}/4 pôles · ${fa("c") ? "✓" : "○"} plan de symétrie trouvé · ${n("g") === 4 ? "✓" : "○"} Grenouille : ${n("g")}/4 pôles · ${fa("g") ? "✓" : "○"} plan de symétrie trouvé</p>`; };
  const ask = () => {
    const q = $(".ax-q", host);
    if (vw === "t") {
      const f = x.ax.f[an] || {};
      q.innerHTML = `<p class="lead">Plie l'animal le long d'une ligne : ses deux moitiés se superposent-elles ?</p><div class="row"><button type="button" class="btn" data-fold="A">Plier selon la ligne A</button><button type="button" class="btn ghost" data-fold="B">Plier selon la ligne B</button></div>
        <p class="readout">${f.A ? "✓ <b>Ligne A</b> : les deux moitiés se superposent, elles sont semblables. La ligne A correspond au <b>plan de symétrie bilatérale</b> : il sépare un côté droit et un côté gauche. " : ""}${f.B ? "✗ <b>Ligne B</b> : la tête ne se superpose pas à la queue. Ce n'est pas un plan de symétrie." : ""}${!f.A && !f.B ? "Essaie les deux lignes." : ""}</p>`;
      $$("[data-fold]", q).forEach(b => b.onclick = () => { if (busy) return; busy = true; const k = b.dataset.fold; fold.k = k;
        tween(1100, t => { fold.t = ez(t); draw(); }, () => setTimeout(() => { x.ax.f[an] = x.ax.f[an] || {}; x.ax.f[an][k] = 1; keep(); ask(); count(); tween(800, t => { fold.t = 1 - ez(t); draw(); }, () => { fold.k = null; fold.t = 0; busy = false; draw(); }); }, RMO ? 0 : 700)); });
      return;
    }
    const p = x.ax.p[an];
    q.innerHTML = `<p class="lead">Touche un repère numéroté sur l'image, ou choisis son numéro, puis nomme le pôle :</p><div class="chips">${POLES[an].map(([k], i) => `<button type="button" class="chipb" data-pi="${i}" aria-pressed="${sel === i}">${i + 1}${p[i] ? (p[i] === k ? " ✓" : " ✗") : ""}</button>`).join("")}</div>` +
      (sel >= 0 ? `<p class="lead"><b>Repère n° ${sel + 1}</b> : quel pôle du corps ?</p><div class="chips">${Object.keys(POLE).map(k => `<button type="button" class="chipb" data-po="${k}" aria-pressed="${p[sel] === k}">${POLE[k]}</button>`).join("")}</div>${p[sel] ? `<p class="pfb ${p[sel] === POLES[an][sel][0] ? "ok" : "bad"}">${p[sel] === POLES[an][sel][0] ? "✓ Juste : " + POLE[p[sel]].toLowerCase() + "." : "✗ Pas encore : repère où se trouvent la tête, la queue, le dos et le ventre."}</p>` : ""}` : "");
    $$("[data-pi]", q).forEach(b => b.onclick = () => { sel = +b.dataset.pi; draw(); ask(); });
    $$("[data-po]", q).forEach(b => b.onclick = () => {
      const was = p[sel], k = b.dataset.po; p[sel] = k; if (!was && k !== POLES[an][sel][0]) x.ax.e++;
      ["ap", "dv"].forEach(ax => { if (axDone(an, ax) && !grow[an + ax]) tween(900, t => { grow[an + ax] = Math.max(.001, ez(t)); draw(); }); });
      keep(); draw(); ask(); count(); const n = $(`[data-po="${k}"]`, q); if (n) n.focus();
    });
  };
  bindSeg(host, "an", k => { an = k; sel = -1; draw(); ask(); });
  bindSeg(host, "vw", k => { vw = k; sel = -1; draw(); ask(); });
  if (window.ResizeObserver) { let lw = fig.clientWidth; new ResizeObserver(() => { const w = fig.clientWidth; if (Math.abs(w - lw) > 4) { lw = w; draw(); } }).observe(fig); }
  draw(); ask(); count();
};

/* =====================================================================
   2. Radiographie : nature du squelette et trois parties du corps
   ===================================================================== */
const RXA = { c: { n: "Carpe", v: "vue de côté", ct: 88 }, g: { n: "Grenouille", v: "vue de dessus", ct: 85 }, r: { n: "Roussette (petit requin)", v: "vue de côté", ct: 21 } };
const ZT = { c: [262, 628], g: [262, 560] }, ZTOL = { c: [36, 46], g: [36, 40] };
const ZONE = [["Tête", "#3d8bfd"], ["Tronc", "#34c26b"], ["Queue", "#ffaa2b"]];
function xrayScene(W, F, an, sw, bands, ok) {
  const { fs } = sk(W, F), id = uid("rx"), sx = 1000 * sw;
  const normal = an === "c" ? BGW + carpSide() : an === "g" ? BGT + frogTop() : BGW + sharkSide();
  const ghost = { body: "#2b3b4d", fin: "#26364a", out: "#4d6178" };
  const sil = an === "c" ? carpShape(ghost) : an === "g" ? frogTop({ body: "#2b3b4d", out: "#4d6178" }) : sharkShape(ghost);
  const sk0 = an === "c" ? R(carpSkel(), XR(.95)) : an === "g" ? frogSkelSVG(XR(.95)) : R(sharkSkel(), XR(.3));
  const xr = `<rect width="1000" height="560" style="fill:#0b1520"/>${sil}${sk0}`;
  let g = `<defs><clipPath id="${id}a"><rect x="0" y="0" width="${N1(sx)}" height="560"/></clipPath><clipPath id="${id}b"><rect x="${N1(sx)}" y="0" width="${N1(1000 - sx)}" height="560"/></clipPath></defs>`;
  g += sw < 1 ? `<g clip-path="url(#${id}b)">${normal}</g>` : "";
  g += sw > 0 ? `<g clip-path="url(#${id}a)">${xr}</g>` : "";
  if (sw > 0 && sw < 1) g += `<rect x="${N1(sx - 14)}" y="0" width="28" height="560" style="fill:#9fe3ff;opacity:.25"/><rect x="${N1(sx - 3)}" y="0" width="6" height="560" style="fill:#c9f1ff"/>`;
  if (sw >= 1 && bands) {
    const [b1, b2] = bands, xs = [0, b1, b2, 1000];
    ZONE.forEach(([n, c], i) => { g += `<rect x="${N1(xs[i])}" y="0" width="${N1(xs[i + 1] - xs[i])}" height="560" style="fill:${c};opacity:.2"/>`; g += tx((xs[i] + xs[i + 1]) / 2, fs * 1.3, n, { s: fs, c: "#ffffff", h: 1, hc: "#0b1520" }); });
    [b1, b2].forEach((b, i) => g += `<line x1="${N1(b)}" y1="${N1(fs * 1.8)}" x2="${N1(b)}" y2="560" style="stroke:${(ok || [])[i] ? "#7dffa8" : "#ffffff"};stroke-width:4;stroke-dasharray:12 8"/>`);
    if (an === "g" && ok && ok[1]) g += tx(612, 280 + fs * 1.9, "urostyle", { s: fs * .9, c: "#ffe7a8", h: 1, hc: "#0b1520" });
  }
  if (sw >= 1) g += tx(990, 550 - fs * .2, an === "r" ? "squelette peu contrasté" : "squelette très contrasté", { s: fs * .85, a: "end", c: "#dfe9f5", w: 600, h: 1, hc: "#0b1520" });
  return SCN(W, `Radiographie de la ${RXA[an].n.toLowerCase()} (${RXA[an].v}).`, g);
}
WID.radio = host => {
  const x = xst(); x.rx = x.rx || {}; x.rx.v = x.rx.v || {}; x.rx.b = x.rx.b || { c: [400, 860], g: [400, 860] }; x.rx.ok = x.rx.ok || {}; x.rx.n = x.rx.n || 0;
  let an = "c", sw = x.rx.v.c ? 1 : 0, ctl = null;
  host.innerHTML = `${segH("Animal", [["c", "🐟 Carpe"], ["g", "🐸 Grenouille"], ["r", "🦈 Roussette"]], "c", "an")}<div class="figbox rx-f"></div><div class="row animctl"></div>
    <div class="meter rx-m" aria-live="polite"></div><div class="rx-z"></div><div class="rx-c"></div>`;
  const fig = liveSVG($(".rx-f", host), (W, F) => xrayScene(W, F, an, sw, an !== "r" && x.rx.v[an] ? x.rx.b[an] : null, x.rx.ok[an] ? [1, 1] : (x.rx.zk || {})[an]));
  const count = () => { const v = ["c", "g", "r"].filter(k => x.rx.v[k]).length, z = ["c", "g"].filter(k => x.rx.ok[k]).length;
    $(".rx-c", host).innerHTML = `<p class="task ${v === 3 && z === 2 ? "is-ok" : ""}">${v === 3 ? "✓" : "○"} ${v}/3 radiographies · ${z === 2 ? "✓" : "○"} limites des trois parties justes : ${z}/2 (carpe, grenouille)</p>`; };
  const meter = () => { $(".rx-m", host).innerHTML = `<p class="lead">Contraste du squelette sur la radiographie <span class="simw">⚠ Valeurs simulées</span></p>` + ["c", "g", "r"].map(k => `<div class="mrow"><span>${RXA[k].n}</span><span class="bar"><i style="width:${x.rx.v[k] ? RXA[k].ct : 0}%"></i></span><b>${x.rx.v[k] ? RXA[k].ct + " %" : "?"}</b></div>`).join(""); };
  const zones = () => {
    const z = $(".rx-z", host);
    if (an === "r") { z.innerHTML = x.rx.v.r ? `<p class="readout">La roussette sert de point de comparaison : son squelette est en <b>cartilage</b>, souple et peu minéralisé.</p>` : ""; return; }
    if (!x.rx.v[an]) { z.innerHTML = `<p class="readout">Lance la radiographie : tu pourras ensuite délimiter les parties du corps.</p>`; return; }
    const b = x.rx.b[an];
    z.innerHTML = `<p class="lead"><b>Délimite les trois parties du corps</b> : déplace les deux limites, puis vérifie.</p>
      <label class="rng">Limite tête | tronc<input type="range" min="100" max="900" step="5" value="${b[0]}" data-z="0" aria-label="Limite entre la tête et le tronc"></label>
      <label class="rng">Limite tronc | queue<input type="range" min="100" max="980" step="5" value="${b[1]}" data-z="1" aria-label="Limite entre le tronc et la queue"></label>
      <div class="row"><button type="button" class="btn" data-zchk>Vérifier mes limites</button></div><div class="rx-fb" aria-live="polite">${x.rx.ok[an] ? `<p class="pfb ok">✓ Les trois parties sont bien délimitées.</p>` : ""}</div>`;
    $$("[data-z]", z).forEach(r => r.oninput = () => { const i = +r.dataset.z; let v = +r.value; if (i === 0) v = Math.min(v, b[1] - 40); else v = Math.max(v, b[0] + 40); b[i] = v; r.value = v; if (x.rx.zk) x.rx.zk[an] = null; x.rx.ok[an] = 0; keep(); fig.draw(); count(); });
    $("[data-zchk]", z).onclick = () => {
      x.rx.n++; const T = ZT[an], tol = ZTOL[an], r = b.map((v, i) => Math.abs(v - T[i]) <= tol[i]), msg = [];
      if (!r[0]) msg.push(b[0] < T[0] ? (an === "c" ? "La limite tête | tronc est trop en avant : la tête comprend tout le crâne, opercule compris." : "La limite tête | tronc est trop en avant : la tête comprend tout le crâne.") : "La limite tête | tronc est trop en arrière : le tronc commence juste derrière le crâne, là où s'attachent les membres antérieurs.");
      if (!r[1]) msg.push(an === "c" ? (b[1] < T[1] ? "La limite tronc | queue est trop en avant : le tronc contient la cage formée par les côtes." : "La limite tronc | queue est trop en arrière : la queue commence là où les côtes s'arrêtent, au niveau de l'anus.") : (b[1] < T[1] ? "La limite tronc | queue est trop en avant : le tronc va jusqu'au bassin (vertèbre sacrée)." : "La limite tronc | queue est trop en arrière : chez la grenouille, la queue est réduite à un seul os, caché entre les os du bassin."));
      x.rx.zk = x.rx.zk || {}; x.rx.zk[an] = r; x.rx.ok[an] = r[0] && r[1] ? 1 : 0; keep(); fig.draw(); count();
      $(".rx-fb", host).innerHTML = x.rx.ok[an] ? `<p class="pfb ok">✓ Les trois parties sont bien délimitées${an === "g" ? " : la queue de la grenouille est réduite à un os, l'<b>urostyle</b>" : ""}.</p>` : `<p class="pfb bad">✗ ${msg.join(" ")}</p>`;
    };
  };
  const setA = k => { an = k; sw = x.rx.v[k] ? 1 : 0; if (ctl) ctl.set(sw); fig.draw(); zones(); meter(); };
  ctl = animCtl($(".animctl", host), 3500, v => { sw = v; fig.draw(); if (v >= 1 && !x.rx.v[an]) { x.rx.v[an] = 1; keep(); zones(); meter(); count(); } });
  $('.animctl [data-a="run"]', host).setAttribute("aria-label", "Lancer la radiographie");
  bindSeg(host, "an", setA);
  setA("c"); count();
};

/* =====================================================================
   3. Le squelette et les axes : crâne, colonne vertébrale, membres
   ===================================================================== */
const SQK = { crane: ["Crâne", "#d1495b"], col: ["Colonne vertébrale", "#2f6fd6"], ant: ["Membre antérieur", "#2e9e44"], post: ["Membre postérieur", "#e07b00"] };
const SQP = { c: [["ant", 300, 418], ["crane", 150, 300], ["post", 512, 446], ["col", 440, 296]], g: [["col", 410, 280], ["post", 766, 172], ["crane", 150, 280], ["ant", 300, 150]] };
function squelScene(W, F, an, sel, axes) {
  const { fs, pr } = sk(W, F), a = xst().sq.a[an], hl = {};
  SQP[an].forEach(([k], i) => { if (a[i] === k) { hl[k] = SQK[k][1]; if (k === "col") hl.uro = SQK.col[1]; } });
  let g = `<rect width="1000" height="560" style="fill:#f6f1e6"/>`;
  g += an === "c" ? R(carpSkel(), PLATE(hl)) : frogSkelSVG(PLATE(hl));
  const wide = W >= 560;
  if (axes) {
    if (an === "c") { g += arrow2(40, 300, 960, 300, "#c0392b", 6, 1) + arrow2(480, 70, 480, 500, "#1f5fbf", 6, 1) + (wide ? LB(940, 300 - fs * .8, "axe antéro-postérieur", fs * .9, { a: "end", c: "#9b2216" }) + LB(480 + fs * .4, 96, "axe dorso-ventral", fs * .9, { a: "start", c: "#163f80" }) + LB(480, 60, "dos", fs * .9, { c: "#163f80" }) + LB(480, 530, "ventre", fs * .9, { c: "#163f80" }) + LB(40, 300 + fs * 1.6, "avant", fs * .9, { a: "start", c: "#9b2216" }) : LB(480, 60, "dos", fs * .9, { c: "#163f80" }) + LB(480, 530, "ventre", fs * .9, { c: "#163f80" })); }
    else { g += `<rect x="30" y="272" width="940" height="16" style="fill:#c0392b;opacity:.18"/>` + arrow2(40, 280, 960, 280, "#c0392b", 6, 1) + (wide ? LB(960, 280 - fs * .8, "axe antéro-postérieur · plan de symétrie", fs * .85, { a: "end", c: "#9b2216" }) : "") + LB(420, 40, "côté droit", fs * .9, { c: "#0c5a2a" }) + LB(420, 545, "côté gauche", fs * .9, { c: "#0c5a2a" }); }
  }
  SQP[an].forEach(([k, px, py], i) => { g += pinV(px, py, i + 1, pr, sel === i); if (a[i] === k && wide) g += LB(px, py + (py > 400 ? -pr * 1.5 : pr * 2.3), SQK[k][0], fs * .9, { c: SQK[k][1], hc: "#fffdf7" }); });
  return SCN(W, `Squelette de la ${AN[an].toLowerCase()} (${an === "c" ? "vue de côté" : "vue de dessus"}), quatre structures numérotées.`, g);
}
WID.squel = host => {
  const x = xst(); x.sq = x.sq || {}; x.sq.a = x.sq.a || { c: {}, g: {} }; x.sq.ax = x.sq.ax || {}; x.sq.e = x.sq.e || 0;
  let an = "c", sel = -1, axes = false;
  host.innerHTML = `${segH("Animal", [["c", "🐟 Carpe · vue de côté"], ["g", "🐸 Grenouille · vue de dessus"]], "c", "an")}<div class="row"><button type="button" class="btn ghost tog" data-axes aria-pressed="false">Afficher les axes et le plan de symétrie</button></div>
    <div class="figbox sq-f"></div><div class="mleg sq-l"></div><div class="sq-q" aria-live="polite"></div><div class="sq-c"></div>`;
  const fig = $(".sq-f", host);
  const leg = () => { const a = x.sq.a[an]; $(".sq-l", host).innerHTML = SQP[an].map(([k], i) => `<span><span class="sq" style="background:${a[i] === k ? SQK[k][1] : "#efe6d2"};border:1px solid #6b5a3e"></span>${i + 1} · ${a[i] === k ? SQK[k][0] : "?"}</span>`).join("") + (axes ? (an === "c" ? `<span><span class="sq" style="background:#c0392b"></span>axe antéro-postérieur</span><span><span class="sq" style="background:#1f5fbf"></span>axe dorso-ventral</span>` : `<span><span class="sq" style="background:#c0392b"></span>axe antéro-postérieur et plan de symétrie (vu de dessus)</span>`) : ""); };
  const draw = () => { const W = Math.max(260, fig.clientWidth || 320); fig.innerHTML = squelScene(W, fsPx(), an, sel, axes); leg(); const svg = $("svg", fig); svg.onclick = ev => { const [px, py] = tap(svg, ev), i = SQP[an].findIndex(([, qx, qy]) => Math.hypot(qx - px, qy - py) < 60); if (i >= 0) { sel = i; draw(); ask(); } }; };
  const count = () => { const n = a => SQP[a].filter(([k], i) => x.sq.a[a][i] === k).length, ax = ["c", "g"].filter(a => x.sq.ax[a]).length;
    $(".sq-c", host).innerHTML = `<p class="task ${n("c") + n("g") === 8 && ax === 2 ? "is-ok" : ""}">${n("c") === 4 ? "✓" : "○"} Carpe : ${n("c")}/4 · ${n("g") === 4 ? "✓" : "○"} Grenouille : ${n("g")}/4 · ${ax === 2 ? "✓" : "○"} axes affichés pour ${ax}/2 animaux</p>`; };
  const ask = () => {
    const q = $(".sq-q", host), a = x.sq.a[an];
    q.innerHTML = `<p class="lead">Touche un numéro sur le squelette, ou choisis-le ici :</p><div class="chips">${SQP[an].map(([k], i) => `<button type="button" class="chipb" data-si="${i}" aria-pressed="${sel === i}">${i + 1}${a[i] ? (a[i] === k ? " ✓" : " ✗") : ""}</button>`).join("")}</div>` +
      (sel >= 0 ? `<p class="lead"><b>Structure n° ${sel + 1}</b> : de quoi s'agit-il ?</p><div class="chips">${Object.keys(SQK).map(k => `<button type="button" class="chipb" data-sk="${k}" aria-pressed="${a[sel] === k}">${SQK[k][0]}</button>`).join("")}</div>${a[sel] ? `<p class="pfb ${a[sel] === SQP[an][sel][0] ? "ok" : "bad"}">${a[sel] === SQP[an][sel][0] ? "✓ Juste." : "✗ Pas encore : regarde à quelle extrémité du corps, ou de quel côté, se trouve cette structure."}</p>` : ""}` : "");
    $$("[data-si]", q).forEach(b => b.onclick = () => { sel = +b.dataset.si; draw(); ask(); });
    $$("[data-sk]", q).forEach(b => b.onclick = () => { const was = a[sel], k = b.dataset.sk; a[sel] = k; if (!was && k !== SQP[an][sel][0]) x.sq.e++; keep(); draw(); ask(); count(); const n = $(`[data-sk="${k}"]`, q); if (n) n.focus(); });
  };
  const tb = $("[data-axes]", host);
  tb.onclick = () => { axes = !axes; tb.setAttribute("aria-pressed", String(axes)); if (axes) { x.sq.ax[an] = 1; keep(); count(); } draw(); };
  bindSeg(host, "an", k => { an = k; sel = -1; if (axes) { x.sq.ax[an] = 1; keep(); count(); } draw(); ask(); });
  if (window.ResizeObserver) { let lw = fig.clientWidth; new ResizeObserver(() => { const w = fig.clientWidth; if (Math.abs(w - lw) > 4) { lw = w; draw(); } }).observe(fig); }
  draw(); ask(); count();
};

/* =====================================================================
   4. Logiciel de classification (inspiré de Phylogène) : les membres antérieurs
   ===================================================================== */
const CAT = { ce: ["Ceinture scapulaire", "#8e44ad"], hu: ["Humérus (bras)", "#e07b00"], ab: ["Radius et cubitus (avant-bras)", "#1f78b4"], ma: ["Os de la main", "#2e9e44"] };
const CATL = { ce: "ceinture scapulaire (omoplate, clavicule)", hu: "humérus", ab: "radius et cubitus", ma: "os de la main (carpe, métacarpe, phalanges)" };
/* angles en degrés (0 = vers la droite, positif = vers le bas) ; po = décalage perpendiculaire ; s = longueurs des os d'un doigt (le premier est le métacarpien) */
const SPC = {
  me: { n: "Mésange", full: "Mésange charbonnière · oiseau", e: "🐦", org: "aile", fn: "voler", fs: "voler", pins: ["hu", "ma", "ce", "ab"],
    g: [{ a: 168, ac: 180, l: 78, w: 5 }, { a: 112, ac: 140, l: 46, w: 9 }], hu: { l: 100, w: 11, a: -26 }, a1: 50, a2: -38,
    fa: [{ l: 108, w: 5, po: -5 }, { l: 114, w: 8, po: 5 }], ca: [[4, -4, 7], [6, 6, 6]],
    dg: [{ bo: 8, po: -7, ang: -38, s: [9, 15], w: 4 }, { bo: 12, po: -2, ang: 0, s: [58, 30, 17], w: 6 }, { bo: 12, po: 6, ang: 3, s: [52, 13], w: 4 }], skin: "plumes" },
  or: { n: "Oreillard", full: "Oreillard roux · mammifère (chauve-souris)", e: "🦇", org: "aile", fn: "voler", fs: "voler", pins: ["ma", "ab", "hu", "ce"],
    g: [{ a: 158, ac: 180, l: 56, w: 12 }, { a: 104, ac: 140, l: 50, w: 5 }], hu: { l: 82, w: 8, a: -24 }, a1: 40, a2: -6,
    fa: [{ l: 128, w: 8, po: -2 }, { l: 52, w: 3, po: 6 }], ca: [[3, -4, 6], [5, 5, 6]],
    dg: [{ bo: 6, po: -9, ang: -72, s: [12, 13, 9], w: 4 }, { bo: 8, po: -5, ang: -20, s: [108, 22], w: 3.6 }, { bo: 8, po: -1, ang: -4, s: [118, 52, 42, 22], w: 3.6 }, { bo: 8, po: 3, ang: 20, s: [104, 40, 30], w: 3.4 }, { bo: 8, po: 7, ang: 44, s: [96, 32, 24], w: 3.2 }], skin: "membrane" },
  to: { n: "Tortue", full: "Tortue terrestre · reptile", e: "🐢", org: "patte avant", fn: "marcher", fs: "marcher", pins: ["ab", "ce", "ma", "hu"],
    g: [{ a: 262, ac: 180, l: 72, w: 9 }, { a: 196, ac: 214, l: 44, w: 7 }, { a: 128, ac: 140, l: 52, w: 10 }], hu: { l: 80, w: 14, a: 34 }, a1: 50, a2: -24,
    fa: [{ l: 52, w: 8, po: -6 }, { l: 54, w: 9, po: 6 }], ca: [[4, -8, 6], [4, 0, 6], [4, 8, 6], [12, -4, 5], [12, 5, 5]],
    dg: [-30, -15, 0, 15, 30].map((a, i) => ({ bo: 18, po: -12 + i * 6, ang: a, s: [14, 10, 9], w: 5 })), skin: "patte" },
  gr: { n: "Grenouille", full: "Grenouille · amphibien", e: "🐸", org: "patte avant", fn: "se déplacer à terre et amortir les sauts", fs: "se déplacer, sauter", pins: ["ce", "hu", "ab", "ma"],
    g: [{ a: 236, ac: 200, l: 72, w: 16 }, { a: 160, ac: 165, l: 46, w: 5 }, { a: 128, ac: 140, l: 40, w: 7 }], hu: { l: 72, w: 9, a: 42 }, a1: -64, a2: 22,
    fa: [{ l: 56, w: 12, po: 0, fused: 1 }], ca: [[3, -5, 6], [4, 4, 6], [10, 0, 5]],
    dg: [-30, -10, 10, 30].map((a, i) => ({ bo: 14, po: -9 + i * 6, ang: a, s: [24, 13, 10], w: 4.4 })), skin: "patte2" } };
const SPK = ["me", "or", "to", "gr"];
function limbGeo(S0, t) {
  const B = [], u = 1 - t, Rd = a => a * D2R, sh = (x1, y1, x2, y2, w, k, f) => { const L = Math.hypot(x2 - x1, y2 - y1) || 1, c = Math.min(w * .5 + 1.5, L * .2), ux = (x2 - x1) / L, uy = (y2 - y1) / L; B.push({ k, x1: x1 + ux * c, y1: y1 + uy * c, x2: x2 - ux * c, y2: y2 - uy * c, w, f }); };
  S0.g.forEach(e => { const a = Rd(LP(e.a, e.ac, t)); sh(0, 0, e.l * Math.cos(a), e.l * Math.sin(a), e.w, "ce"); });
  const a0 = Rd(S0.hu.a * u), E = [S0.hu.l * Math.cos(a0), S0.hu.l * Math.sin(a0)]; sh(0, 0, E[0], E[1], S0.hu.w, "hu");
  const a1 = a0 + Rd(S0.a1 * u), n1 = [-Math.sin(a1), Math.cos(a1)], Lf = Math.max(...S0.fa.map(f => f.l));
  S0.fa.forEach(f => sh(E[0] + n1[0] * f.po, E[1] + n1[1] * f.po, E[0] + n1[0] * f.po + f.l * Math.cos(a1), E[1] + n1[1] * f.po + f.l * Math.sin(a1), f.w, "ab", f.fused));
  const Wr = [E[0] + Lf * Math.cos(a1), E[1] + Lf * Math.sin(a1)], a2 = a1 + Rd(S0.a2 * u), d2 = [Math.cos(a2), Math.sin(a2)], n2 = [-d2[1], d2[0]], tips = [];
  S0.ca.forEach(([bo, po, w]) => sh(Wr[0] + d2[0] * bo + n2[0] * po - d2[0] * 3, Wr[1] + d2[1] * bo + n2[1] * po - d2[1] * 3, Wr[0] + d2[0] * bo + n2[0] * po + d2[0] * 3, Wr[1] + d2[1] * bo + n2[1] * po + d2[1] * 3, w, "ma"));
  S0.dg.forEach(d => { let px = Wr[0] + d2[0] * d.bo + n2[0] * d.po, py = Wr[1] + d2[1] * d.bo + n2[1] * d.po; const ad = a2 + Rd(d.ang * (1 - t * .35));
    d.s.forEach((l, i) => { const qx = px + l * Math.cos(ad), qy = py + l * Math.sin(ad); sh(px, py, qx, qy, d.w * (i ? .82 : 1), "ma"); px = qx; py = qy; }); tips.push([px, py]); });
  return { B, E, Wr, a0, a1, a2, tips };
}
function plumePts(G) {
  const n1 = [-Math.sin(G.a1), Math.cos(G.a1)], n2 = [-Math.sin(G.a2), Math.cos(G.a2)], n0 = [-Math.sin(G.a0), Math.cos(G.a0)], tip = G.tips[1], d2 = [Math.cos(G.a2), Math.sin(G.a2)];
  return [[0, 0], G.E, G.Wr, [tip[0] + d2[0] * 34, tip[1] + d2[1] * 34], [tip[0] + d2[0] * 10 + n2[0] * 58, tip[1] + d2[1] * 10 + n2[1] * 58], [G.Wr[0] + n2[0] * 112, G.Wr[1] + n2[1] * 112], [G.E[0] + n1[0] * 98, G.E[1] + n1[1] * 98], [n0[0] * 46, n0[1] * 46]];
}
function skinSVG(sp, G, T) {
  const S0 = SPC[sp], P = p => T(p[0], p[1]), pts = A => A.map(p => P(p).map(N1).join(",")).join(" ");
  if (S0.skin === "plumes") { const A = plumePts(G), tip = G.tips[1];
    let f = ""; for (let i = 1; i < 10; i++) { const a = lerpPt([[0, 0], G.E, G.Wr, tip], i / 10), b = lerpPt([A[7], A[6], A[5], A[4]], i / 10); f += `<line x1="${N1(P(a)[0])}" y1="${N1(P(a)[1])}" x2="${N1(P(b)[0])}" y2="${N1(P(b)[1])}" style="stroke:#8f9db2;stroke-width:1.5"/>`; }
    return `<polygon points="${pts(A)}" style="fill:#cfd8e6;stroke:#8f9db2;stroke-width:2;stroke-linejoin:round"/>` + f; }
  if (S0.skin === "membrane") { const body = [-20, 190], T2 = G.tips; let d = `M${P([0, 0]).map(N1)} L${P(G.E).map(N1)} L${P(G.Wr).map(N1)} L${P(T2[1]).map(N1)}`;
    for (let i = 2; i < T2.length; i++) { const c = [LP(T2[i - 1][0], G.Wr[0], .3), LP(T2[i - 1][1], G.Wr[1], .3)], m = [(T2[i - 1][0] + T2[i][0]) / 2, (T2[i - 1][1] + T2[i][1]) / 2]; const cc = [LP(m[0], G.Wr[0], .22), LP(m[1], G.Wr[1], .22)]; d += ` Q${P(cc).map(N1)} ${P(T2[i]).map(N1)}`; }
    const cb = [LP(T2[4][0], body[0], .5) + 10, LP(T2[4][1], body[1], .5) - 30]; d += ` Q${P(cb).map(N1)} ${P(body).map(N1)} Z`;
    return `<path d="${d}" style="fill:#b98f7d;opacity:.5;stroke:#7d5a4b;stroke-width:2;stroke-linejoin:round"/>`; }
  const w = S0.skin === "patte" ? 44 : 28, c = S0.skin === "patte" ? "#a99366" : "#86b257", o = S0.skin === "patte" ? "#6e5c36" : "#4b7128", k = Math.hypot(T(1, 0)[0] - T(0, 0)[0], T(1, 0)[1] - T(0, 0)[1]);
  const mid = [G.Wr[0] + Math.cos(G.a2) * 18, G.Wr[1] + Math.sin(G.a2) * 18];
  let s = limbS([P([0, 0]), P(G.E), P(G.Wr), P(mid)], [w * k, w * .8 * k, w * .7 * k], c, o, 4);
  G.tips.forEach(t => { s += limbS([P(mid), P(t)], [(S0.skin === "patte" ? 14 : 10) * k], c, o, 3); if (S0.skin === "patte") s += `<circle cx="${N1(P(t)[0])}" cy="${N1(P(t)[1])}" r="${N1(5 * k + 1)}" style="fill:#3b3226"/>`; });
  return `<g style="opacity:.55">${s}</g>`;
}
const bbox = (G, sp, withSkin) => { let xs = [], ys = []; G.B.forEach(b => { xs.push(b.x1, b.x2); ys.push(b.y1, b.y2); }); if (withSkin) { if (SPC[sp].skin === "plumes") plumePts(G).forEach(([a, b]) => { xs.push(a); ys.push(b); }); if (SPC[sp].skin === "membrane") { xs.push(-20); ys.push(190); } }
  return [Math.min(...xs) - 12, Math.min(...ys) - 12, Math.max(...xs) + 12, Math.max(...ys) + 12]; };
/* dessin d'un membre dans une boîte (bx, by, bw, bh) ; col(k) = couleur de l'os ; o.hit = zones tactiles ; o.pins = repères numérotés */
function limbDraw(sp, t, box, col, o) {
  o = o || {}; const G = limbGeo(SPC[sp], t), bb = o.bb || bbox(G, sp, o.skin), sc = o.sc || Math.min(box[2] / (bb[2] - bb[0]), box[3] / (bb[3] - bb[1]));
  const ox = o.ox !== undefined ? o.ox : box[0] + (box[2] - (bb[2] - bb[0]) * sc) / 2 - bb[0] * sc, oy = o.oy !== undefined ? o.oy : box[1] + (box[3] - (bb[3] - bb[1]) * sc) / 2 - bb[1] * sc;
  const T = (x, y) => [ox + x * sc, oy + y * sc];
  let g = o.skin ? skinSVG(sp, G, T) : "";
  const groups = {}; G.B.forEach(b => (groups[b.k] = groups[b.k] || []).push(b));
  Object.keys(CAT).forEach(k => { const L = groups[k] || []; let a = "", c = "", h = "";
    L.forEach(b => { const [x1, y1] = T(b.x1, b.y1), [x2, y2] = T(b.x2, b.y2), w = Math.max(2.2, b.w * sc), Lc = `x1="${N1(x1)}" y1="${N1(y1)}" x2="${N1(x2)}" y2="${N1(y2)}"`;
      a += `<line ${Lc} style="stroke:#4a3d2a;stroke-width:${N1(w + 3)};stroke-linecap:round"/>`; c += `<line ${Lc} style="stroke:${col(k)};stroke-width:${N1(w)};stroke-linecap:round"/>`;
      if (b.f) c += `<line x1="${N1(LP(x1, x2, .18))}" y1="${N1(LP(y1, y2, .18))}" x2="${N1(LP(x1, x2, .82))}" y2="${N1(LP(y1, y2, .82))}" style="stroke:#4a3d2a;stroke-width:1.4"/>`;
      if (o.hit) h += `<line ${Lc} style="stroke:transparent;stroke-width:${N1(Math.max(30, w + 18))};stroke-linecap:round"/>`; });
    g += `<g data-b="${k}"${o.hit ? ' style="cursor:pointer"' : ""}>${h}${a}${c}</g>`; });
  if (o.pins) { const r = o.pr, [LW, LH] = o.lim; SPC[sp].pins.forEach((k, i) => { const L = groups[k]; let p, d;
      if (k === "ma") { const tp = G.tips[Math.floor(G.tips.length / 2)]; p = [LP(G.Wr[0], tp[0], .55), LP(G.Wr[1], tp[1], .55)]; d = [tp[0] - G.Wr[0], tp[1] - G.Wr[1]]; } else { const b = L.reduce((m, q) => Math.hypot(q.x2 - q.x1, q.y2 - q.y1) > Math.hypot(m.x2 - m.x1, m.y2 - m.y1) ? q : m, L[0]); p = [(b.x1 + b.x2) / 2, (b.y1 + b.y2) / 2]; d = [b.x2 - b.x1, b.y2 - b.y1]; }
      const dl = Math.hypot(d[0], d[1]) || 1; let n = [-d[1] / dl, d[0] / dl]; if (n[1] > 0 || (Math.abs(n[1]) < .2 && n[0] < 0)) n = [-n[0], -n[1]];
      const [bx, by] = T(p[0], p[1]), px = cl(bx + n[0] * r * 2, r + 2, LW - r - 2), py = cl(by + n[1] * r * 2, r + 2, LH - r - 2);
      g += `<g data-b="${k}" style="cursor:pointer"><line x1="${N1(bx)}" y1="${N1(by)}" x2="${N1(px)}" y2="${N1(py)}" style="stroke:#1a1a1a;stroke-width:2"/><circle cx="${N1(bx)}" cy="${N1(by)}" r="3.5" style="fill:#1a1a1a"/>${pinV(px, py, i + 1, r, o.sel === k)}</g>`; }); }
  return { g, G, sc, ox, oy };
}
const boneCol = (sp, done) => k => done && done[k] ? CAT[k][1] : "#efe6d2";
WID.phylo = host => {
  const x = xst(); x.ph = x.ph || {}; x.ph.a = x.ph.a || {}; SPK.forEach(s => x.ph.a[s] = x.ph.a[s] || {}); x.ph.e = x.ph.e || 0;
  let sp = "me", brush = null, skin = window.innerWidth >= 600, msg = "", last = null;
  host.innerHTML = `<div class="pg-top"><span class="pg-logo">Phylo<b>virtuel</b></span><span class="pg-path">Collection « vertébrés lycée » › Comparer › Données anatomiques › Organe locomoteur</span></div>
    ${segH("Espèce", SPK.map(k => [k, `${SPC[k].e} ${SPC[k].n}`]), "me", "sp")}<p class="readout ph-i"></p>
    <p class="lead">1. Choisis un pinceau · 2. Touche l'os (ou son numéro) à colorier :</p><div class="chips pal">${Object.keys(CAT).map(k => `<button type="button" class="chipb" data-cat="${k}" aria-pressed="false"><span class="sw" style="background:${CAT[k][1]}"></span>${CAT[k][0]}</button>`).join("")}</div>
    <div class="row"><button type="button" class="btn ghost tog" data-skin aria-pressed="${skin}">Montrer le membre (peau, plumes)</button></div>
    <div class="figbox ph-f"></div><div class="chips ph-n"></div><div class="ph-fb" aria-live="polite"></div><div class="ph-c"></div>
    <p class="kicker">Comparer les quatre membres antérieurs</p><div class="ph-gal"></div>`;
  const fig = $(".ph-f", host);
  const big = () => { const W = Math.max(260, fig.clientWidth || 320), F = fsPx(), r = Math.max(13, F * .62), G0 = limbGeo(SPC[sp], 0), b0 = bbox(G0, sp, skin), H = cl((W - r * 4.8) * (b0[3] - b0[1]) / (b0[2] - b0[0]) + r * 4.8, F * 10, Math.min(W * .9, F * 22));
    const d = limbDraw(sp, 0, [r * 2.4, r * 2.4, W - r * 4.8, H - r * 4.8], boneCol(sp, x.ph.a[sp]), { hit: 1, pins: 1, pr: r, skin, sel: last, lim: [W, H] });
    return svgW(W, H, `Membre antérieur de la ${SPC[sp].n.toLowerCase()}, quatre ensembles d'os numérotés.`, `<rect width="${N1(W)}" height="${N1(H)}" rx="10" style="fill:#f6f1e6"/>` + d.g); };
  const gal = () => { const host2 = $(".ph-gal", host); host2.innerHTML = SPK.map(k => `<figure class="phg${k === sp ? " cur" : ""}"><div class="figbox" data-g="${k}"></div><figcaption>${SPC[k].e} ${SPC[k].n} · ${SPC[k].org} · ${Object.keys(CAT).filter(c => x.ph.a[k][c]).length}/4</figcaption></figure>`).join("");
    $$("[data-g]", host2).forEach(el => liveSVG(el, (W) => { const H = W * .9, d = limbDraw(el.dataset.g, 0, [6, 6, W - 12, H - 12], boneCol(el.dataset.g, x.ph.a[el.dataset.g]), { skin: false }); return svgW(W, H, `Membre antérieur de la ${SPC[el.dataset.g].n.toLowerCase()}.`, `<rect width="${N1(W)}" height="${N1(H)}" rx="8" style="fill:#f6f1e6"/>` + d.g); })); };
  const count = () => { const n = k => Object.keys(CAT).filter(c => x.ph.a[k][c]).length, T = SPK.reduce((s, k) => s + n(k), 0);
    $(".ph-c", host).innerHTML = `<p class="task ${T === 16 ? "is-ok" : ""}">${SPK.map(k => `${n(k) === 4 ? "✓" : "○"} ${SPC[k].n} ${n(k)}/4`).join(" · ")}</p>`; };
  const info = () => { $(".ph-i", host).innerHTML = nb(`<b>${SPC[sp].full}</b> · membre antérieur : ${SPC[sp].org} · fonction : ${SPC[sp].fn}.`); };
  const nums = () => { $(".ph-n", host).innerHTML = `<span class="lead">Numéros :</span>` + SPC[sp].pins.map((k, i) => `<button type="button" class="chipb" data-bn="${k}" aria-label="Os ou ensemble d'os n° ${i + 1}">${i + 1}${x.ph.a[sp][k] ? " ✓" : ""}</button>`).join(""); $$("[data-bn]", host).forEach(b => b.onclick = () => paint(b.dataset.bn)); };
  const draw = () => { fig.innerHTML = big(); };
  const paint = k => {
    last = k;
    if (!brush) msg = `<p class="pfb mid">Choisis d'abord un pinceau (une couleur) au-dessus du dessin.</p>`;
    else if (x.ph.a[sp][k]) msg = `<p class="pfb ok">✓ Déjà colorié : ${CATL[k]}.</p>`;
    else if (brush === k) { x.ph.a[sp][k] = 1; msg = `<p class="pfb ok">✓ Juste : ${CATL[k]}${sp === "gr" && k === "ab" ? " (chez la grenouille, le radius et le cubitus sont soudés en un seul os)" : ""}${sp === "or" && k === "ma" ? " (les os des doigts sont très allongés : ils tendent la membrane de l'aile)" : ""}.</p>`; keep(); gal(); }
    else { x.ph.e++; keep(); msg = `<p class="pfb bad">✗ Ce n'est pas ${brush === "ab" ? "le radius et le cubitus" : brush === "ma" ? "la main" : brush === "ce" ? "la ceinture scapulaire" : "l'humérus"}. Pars de l'épaule : ceinture scapulaire → humérus (un os) → radius et cubitus (deux os) → main (nombreux petits os).</p>`; }
    $(".ph-fb", host).innerHTML = nb(msg); draw(); nums(); count();
  };
  fig.addEventListener("click", ev => { const g = ev.target.closest("[data-b]"); if (g) paint(g.dataset.b); });
  $$("[data-cat]", host).forEach(b => b.onclick = () => { brush = b.dataset.cat; $$("[data-cat]", host).forEach(c => c.setAttribute("aria-pressed", String(c === b))); });
  const sb = $("[data-skin]", host); sb.onclick = () => { skin = !skin; sb.setAttribute("aria-pressed", String(skin)); draw(); };
  bindSeg(host, "sp", k => { sp = k; last = null; msg = ""; $(".ph-fb", host).innerHTML = ""; info(); draw(); nums(); gal(); });
  if (window.ResizeObserver) { let lw = fig.clientWidth; new ResizeObserver(() => { const w = fig.clientWidth; if (Math.abs(w - lw) > 4) { lw = w; draw(); } }).observe(fig); }
  info(); draw(); nums(); count(); gal();
};

/* =====================================================================
   5. Aligner les quatre membres (même taille d'humérus) et comparer avec l'aile d'un papillon
   ===================================================================== */
function papillon(x0, y0, h, done, wide) {
  const s = h / 120, P = (x, y) => `${N1(x0 + x * s)},${N1(y0 + y * s)}`;
  let g = `<ellipse cx="${N1(x0 - 6 * s)}" cy="${N1(y0 + 4 * s)}" rx="${N1(14 * s)}" ry="${N1(9 * s)}" style="fill:#3a2f25"/><ellipse cx="${N1(x0 - 30 * s)}" cy="${N1(y0 + 5 * s)}" rx="${N1(14 * s)}" ry="${N1(7 * s)}" style="fill:#4a3d30"/>`;
  g += `<path d="M${P(0, 0)} C${P(40, -50)} ${P(120, -62)} ${P(176, -40)} C${P(168, -6)} ${P(130, 30)} ${P(70, 40)} C${P(40, 40)} ${P(14, 26)} ${P(0, 8)} Z" style="fill:#e9a23b;stroke:#2b2118;stroke-width:${N1(3 * s + 1)}"/>`;
  [[176, -40], [150, -10], [118, 20], [80, 36], [130, -50], [96, -54]].forEach(([a, b]) => g += `<path d="M${P(0, 2)} Q${P(a * .45, b * .2)} ${P(a, b)}" style="fill:none;stroke:#2b2118;stroke-width:${N1(1.8 * s + .5)}"/>`);
  g += `<path d="M${P(2, 10)} C${P(30, 60)} ${P(70, 96)} ${P(110, 88)} C${P(104, 56)} ${P(60, 30)} ${P(2, 10)} Z" style="fill:#e9a23b;stroke:#2b2118;stroke-width:${N1(3 * s + 1)};opacity:.85"/>`;
  return g + (done ? tx(x0 + 120 * s, y0 + 66 * s, wide ? "aucun os : ni ceinture, ni humérus, ni radius, ni cubitus" : "aucun os", { s: Math.max(15, h * .13), a: "start", c: "#7a1f14", h: 1, hc: "#f6f1e6", w: 700 }) : "");
}
WID.aligne = host => {
  const x = xst(); x.al = x.al || {};
  let t = x.al.done ? 1 : 0, pap = !!x.al.pap;
  host.innerHTML = `<div class="mleg">${Object.keys(CAT).map(k => `<span><span class="sq" style="background:${CAT[k][1]}"></span>${CAT[k][0]}</span>`).join("")}</div><div class="figbox al-f"></div><div class="row animctl"></div>
    <div class="row"><button type="button" class="btn ghost tog" data-pap aria-pressed="${pap}">🦋 Ajouter l'aile d'un papillon (insecte)</button></div><p class="readout al-ro" aria-live="polite"></p><div class="al-c"></div>`;
  const fig = liveSVG($(".al-f", host), (W, F) => {
    const s = s14(F), rows = SPK.length + (pap ? 1 : 0), rh = cl(W * .26, F * 5.6, F * 9), H = rows * rh + 6, pad = 8, lab = s * 1.6;
    /* alignement : même longueur d'humérus, épaules alignées */
    const A = SPK.map(k => { const G = limbGeo(SPC[k], 1), b = bbox(G, k); return { k, b, l: SPC[k].hu.l }; });
    const maxW = Math.max(...A.map(a => (a.b[2] - a.b[0]) / a.l)), minX = Math.min(...A.map(a => a.b[0] / a.l)), hgt = Math.max(...A.map(a => (a.b[3] - a.b[1]) / a.l));
    const HL = Math.min((W - 2 * pad) / maxW, (rh - lab - 8) / hgt), X0 = pad - minX * HL, e = ez(t);
    let g = "";
    SPK.forEach((k, i) => { const y0 = i * rh, box = [pad, y0 + lab, W - 2 * pad, rh - lab - 6];
      const G0 = limbGeo(SPC[k], 0), b0 = bbox(G0, k), sc0 = Math.min(box[2] / (b0[2] - b0[0]), box[3] / (b0[3] - b0[1])), ox0 = box[0] + (box[2] - (b0[2] - b0[0]) * sc0) / 2 - b0[0] * sc0, oy0 = box[1] + (box[3] - (b0[3] - b0[1]) * sc0) / 2 - b0[1] * sc0;
      const a = A[i], sc1 = HL / a.l, oy1 = box[1] + box[3] / 2 - ((a.b[1] + a.b[3]) / 2) * sc1;
      const d = limbDraw(k, e, box, kk => CAT[kk][1], { sc: LP(sc0, sc1, e), ox: LP(ox0, X0, e), oy: LP(oy0, oy1, e) });
      g += `<rect x="2" y="${N1(y0 + 2)}" width="${N1(W - 4)}" height="${N1(rh - 4)}" rx="8" style="fill:#f6f1e6"/>` + tx(pad + 4, y0 + s * 1.15, W >= 560 ? `${SPC[k].e} ${SPC[k].n} · ${SPC[k].org} · ${SPC[k].fn}` : `${SPC[k].e} ${SPC[k].n} · ${SPC[k].fs}`, { s, a: "start", c: "#2b2118" }) + d.g; });
    if (pap) { const y0 = SPK.length * rh; g += `<rect x="2" y="${N1(y0 + 2)}" width="${N1(W - 4)}" height="${N1(rh - 4)}" rx="8" style="fill:#f6f1e6"/>` + tx(pad + 4, y0 + s * 1.15, "🦋 Papillon (insecte) · aile · voler", { s, a: "start", c: "#2b2118" }) + papillon(X0 + 10, y0 + lab + (rh - lab) * .42, (rh - lab) * .62, t >= 1, W >= 560); }
    if (t >= 1) g += `<line x1="${N1(X0)}" y1="4" x2="${N1(X0)}" y2="${N1(H - 4)}" style="stroke:#7a1f14;stroke-width:1.6;stroke-dasharray:5 5"/>`;
    return svgW(W, H, `Membres antérieurs de la mésange, de l'oreillard, de la tortue et de la grenouille${t >= 1 ? ", alignés à l'épaule avec un humérus de même longueur" : ", dans leur position naturelle"}${pap ? ", et aile de papillon" : ""}.`, g);
  });
  const ro = () => { $(".al-ro", host).innerHTML = nb((t >= 1 ? "Membres <b>alignés à l'épaule</b>, humérus ramené à la même longueur : chez les quatre vertébrés, on retrouve la même succession d'os, de l'épaule vers les doigts." : "Les quatre membres dans leur position naturelle. Lance l'animation pour les déplier et leur donner un humérus de même longueur.") + (pap ? " L'aile du papillon, elle, ne contient <b>aucun os</b> : ni ceinture, ni humérus, ni radius, ni cubitus." : "")); };
  const count = () => { $(".al-c", host).innerHTML = `<p class="task ${x.al.done && x.al.pap ? "is-ok" : ""}">${x.al.done ? "✓" : "○"} membres alignés · ${x.al.pap ? "✓" : "○"} comparaison avec l'aile du papillon</p>`; };
  const ctl = animCtl($(".animctl", host), 4000, v => { t = v; fig.draw(); ro(); if (v >= 1 && !x.al.done) { x.al.done = 1; keep(); count(); } });
  $('.animctl [data-a="run"]', host).setAttribute("aria-label", "Aligner les membres");
  const pb = $("[data-pap]", host); pb.onclick = () => { pap = !pap; pb.setAttribute("aria-pressed", String(pap)); if (pap) { x.al.pap = 1; keep(); count(); } fig.draw(); ro(); };
  if (x.al.done) { ctl.set(1); } ro(); count();
};
