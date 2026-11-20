/* ===== Terminale ES · Thème 3 · 3.1 La biodiversité et son évolution · Activité 1 : le laboratoire de capture-marquage-recapture (CMR) =====
   Étang dessiné en canvas : une population de poissons d'effectif inconnu, un filet, le marquage, l'attente (marche aléatoire), une ou
   plusieurs recaptures, l'estimation puis la révélation de l'effectif réel. Conditions de terrain activables (biais de la méthode),
   séries de 50 CMR automatiques (fluctuation d'échantillonnage) et intervalles de confiance au niveau de 95 %.
   Les animations sont portées par le modèle (LAB, MINI) : changer d'étape pendant une animation ne casse pas l'expérience. */
Store.key = "tes-th3-cmr-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const RMO = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
const isDark = () => { const t = document.documentElement.getAttribute("data-theme"); if (t) return t === "dark"; try { return matchMedia("(prefers-color-scheme: dark)").matches; } catch (e) { return false; } };
const TAU = Math.PI * 2;
const clampN = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const rng = seed => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
const pc = x => fmt(x, 1) + NB + "%";
const nI = x => fmt(Math.round(x));
const mean = a => a.length ? a.reduce((s, v) => s + v, 0) / a.length : NaN;

/* ---------- l'étang : une ellipse d'eau dans une prairie (largeur 1, hauteur PH) ---------- */
const PH = 0.6;
const EC = { x: 0.5, y: PH / 2, a: 0.47, b: PH / 2 - 0.035 };
const inE = (x, y, s) => { s = s || 1; const dx = (x - EC.x) / (EC.a * s), dy = (y - EC.y) / (EC.b * s); return dx * dx + dy * dy <= 1; };
const rndIn = (s, R) => { R = R || Math.random; for (;;) { const x = EC.x + (R() * 2 - 1) * EC.a * s, y = EC.y + (R() * 2 - 1) * EC.b * s; if (inE(x, y, s)) return [x, y]; } };
const ringPt = (an, rho) => [EC.x + Math.cos(an) * EC.a * rho, EC.y + Math.sin(an) * EC.b * rho];
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const REEDS = (() => { const R = rng(5), o = []; for (let i = 0; i < 34; i++) o.push([i / 34 * TAU + R() * 0.12, 0.02 + R() * 0.025]); return o; })();
const mkFish = (x, y, born) => ({ x, y, a: Math.random() * TAU, ph: Math.random() * TAU, m: 0, wm: 0, lost: 0, dead: 0, out: 0, born: born ? 1 : 0, hl: 0 });
function swim(F, n) { const v = 0.0045, s = 0.95; for (let k = 0; k < n; k++) for (const f of F) { if (f.out || f.dead) continue; f.a += (Math.random() - 0.5) * 0.6; const nx = f.x + v * Math.cos(f.a), ny = f.y + v * Math.sin(f.a); if (inE(nx, ny, s)) { f.x = nx; f.y = ny; } else f.a += Math.PI * (0.6 + Math.random() * 0.8); } }

function PAL() {
  return isDark() ? { grass: "#1b3124", water: "#12394b", water2: "#164356", edge: "#3d8299", reed: "#5c8c50", fish: "#d5e7eb", tag: "#ffb02e", tagS: "#2b1700", net: "#e5eff1", netF: "rgba(229,239,241,.10)", netL: "rgba(229,239,241,.28)", halo: "rgba(255,255,255,.30)", hl: "#ffffff", ink: "#e5eff1", veil: "rgba(8,22,27,.82)", pin: "#ffb02e" }
    : { grass: "#d6e8c6", water: "#b3d9e6", water2: "#a3d0df", edge: "#5a9db3", reed: "#5b8a3c", fish: "#1f3f49", tag: "#f08a00", tagS: "#3b2200", net: "#11282e", netF: "rgba(255,255,255,.22)", netL: "rgba(17,40,46,.22)", halo: "rgba(255,255,255,.85)", hl: "#11282e", ink: "#11282e", veil: "rgba(255,255,255,.86)", pin: "#b65f00" };
}
function addFish(g, x, y, a, L, wag) {
  const c = Math.cos(a), s = Math.sin(a), rx = L * 0.5, ry = L * 0.21, wg = wag * L * 0.09, P2 = (u, w) => [x + c * u - s * w, y + s * u + c * w];
  g.moveTo(x + c * rx, y + s * rx); g.ellipse(x, y, rx, ry, a, 0, TAU);
  const A = P2(-L * 0.4, 0), B = P2(-L * 0.8, -L * 0.23 + wg), C = P2(-L * 0.8, L * 0.23 + wg);
  g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.lineTo(C[0], C[1]); g.closePath();
}
function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function drawNet(g, W, P, c, R, prog) {
  const x = c[0] * W, y = c[1] * W, r = Math.max(4, R * W * prog);
  g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU); g.fillStyle = P.netF; g.fill(); g.clip(); g.beginPath();
  const st = Math.max(7, W / 80); for (let d = -2 * r; d <= 2 * r; d += st) { g.moveTo(x + d - r, y - r); g.lineTo(x + d + r, y + r); g.moveTo(x + d + r, y - r); g.lineTo(x + d - r, y + r); }
  g.strokeStyle = P.netL; g.lineWidth = 1; g.stroke(); g.restore();
  g.beginPath(); g.arc(x, y, r, 0, TAU); g.setLineDash([8, 5]); g.lineWidth = 2.6; g.strokeStyle = P.net; g.stroke(); g.setLineDash([]);
}
function drawPin(g, W, P, c) { const x = c[0] * W, y = c[1] * W, r = Math.max(14, W * 0.035); g.beginPath(); g.arc(x, y, r, 0, TAU); g.setLineDash([4, 4]); g.lineWidth = 2.5; g.strokeStyle = P.pin; g.stroke(); g.setLineDash([]); g.beginPath(); g.moveTo(x - r * 0.5, y); g.lineTo(x + r * 0.5, y); g.moveTo(x, y - r * 0.5); g.lineTo(x, y + r * 0.5); g.stroke(); }
function banner(g, W, P, txt, prog) {
  let fs = Math.max(20, Math.min(fsPx() * 0.95, 28)); const ff = getComputedStyle(document.body).fontFamily;
  g.font = `700 ${fs}px ${ff}`; while (g.measureText(txt).width > W * 0.9 && fs > 14) { fs -= 1; g.font = `700 ${fs}px ${ff}`; }
  const tw = g.measureText(txt).width, pad = fs * 0.6, bw = tw + 2 * pad, bh = fs * 1.9, x = (W - bw) / 2, y = fs * 0.45;
  g.fillStyle = P.veil; roundRect(g, x, y, bw, bh, 10); g.fill(); g.fillStyle = P.ink; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, W / 2, y + bh / 2 - (prog !== undefined ? 2 : 0));
  if (prog !== undefined) { g.fillStyle = P.tag; g.fillRect(x + pad, y + bh - 7, (bw - 2 * pad) * clampN(prog, 0, 1), 4); }
}

/* ---------- vue d'un étang : dessin, animation d'ambiance, file d'animations portée par le modèle ---------- */
function pondView(host, M, o) {
  host.innerHTML = `<canvas role="img"></canvas>`;
  const cvs = host.firstChild; let W = 0, H = 0, dpr = 1, vis = true, lt = 0;
  const v = { host, t: 0, dirty: true, draw() { W = 0; v.dirty = true; paint(); }, refresh() { v.dirty = true; } };
  const frozen = () => RMO || !!xst().frozen;
  function size() { const w = Math.max(260, Math.round(host.clientWidth || 320)); if (w !== W || !cvs.width) { W = w; H = Math.round(W * PH); dpr = Math.min(2, window.devicePixelRatio || 1); cvs.width = Math.round(W * dpr); cvs.height = Math.round(H * dpr); cvs.style.width = W + "px"; cvs.style.height = H + "px"; } }
  function paint() {
    size(); const g = cvs.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const P = PAL(), t = v.t, L = o.L(W), fr = frozen(), F = M.F, al0 = o.murky ? 0.55 : 1;
    g.fillStyle = P.grass; g.fillRect(0, 0, W, H);
    g.beginPath(); g.ellipse(EC.x * W, EC.y * W, EC.a * W, EC.b * W, 0, 0, TAU); g.fillStyle = P.water; g.fill();
    g.beginPath(); g.ellipse(EC.x * W, EC.y * W, EC.a * W * 0.6, EC.b * W * 0.52, 0, 0, TAU); g.fillStyle = P.water2; g.fill();
    g.beginPath(); g.ellipse(EC.x * W, EC.y * W, EC.a * W, EC.b * W, 0, 0, TAU); g.lineWidth = 3; g.strokeStyle = P.edge; g.stroke();
    g.beginPath(); REEDS.forEach(([an, h]) => { const x = EC.x + Math.cos(an) * EC.a * 1.025, y = EC.y + Math.sin(an) * EC.b * 1.05; for (let j = -1; j <= 1; j++) { g.moveTo((x + j * 0.005) * W, y * W); g.lineTo((x + j * 0.009) * W, (y - h * (1 - Math.abs(j) * 0.35)) * W); } });
    g.strokeStyle = P.reed; g.lineWidth = Math.max(1.5, W / 420); g.stroke();
    const pos = f => { if (fr || f.fix) return [f.x * W, f.y * W, f.a, 0]; const s = f.ph; return [(f.x + 0.0035 * Math.sin(t * 0.8 + s)) * W, (f.y + 0.0025 * Math.cos(t * 1.1 + s * 1.3)) * W, f.a + 0.22 * Math.sin(t * 0.9 + s), Math.sin(t * 6 + s * 3)]; };
    const len = f => f.born ? L * 0.62 : L, alv = f => f.al === undefined ? 1 : f.al;
    if (o.under) o.under(g, W, P);
    g.fillStyle = P.fish; g.globalAlpha = al0; g.beginPath();
    for (const f of F) { if (f.out || f.dead || f.hl || alv(f) < 1) continue; const [x, y, a, w] = pos(f); addFish(g, x, y, a, len(f), w); }
    g.fill();
    for (const f of F) { if (f.out || f.dead || f.hl || alv(f) >= 1) continue; g.globalAlpha = Math.max(0, alv(f)) * al0; g.beginPath(); const [x, y, a, w] = pos(f); addFish(g, x, y, a, len(f), w); g.fill(); }
    g.globalAlpha = 1;
    for (const f of F) { if (f.out || f.dead || !f.hl) continue; const [x, y, a, w] = pos(f), l = len(f); g.globalAlpha = Math.max(0, alv(f)); g.beginPath(); g.arc(x, y, l * 0.66, 0, TAU); g.fillStyle = P.halo; g.fill(); g.lineWidth = 1.6; g.strokeStyle = P.hl; g.stroke(); g.beginPath(); addFish(g, x, y, a, l, w); g.fillStyle = P.fish; g.fill(); }
    g.globalAlpha = 1; g.beginPath();
    for (const f of F) { if (f.out || f.dead || !f.m || alv(f) < 0.4) continue; const [x, y] = pos(f), r = Math.max(2.4, len(f) * 0.22 * (f.tg === undefined ? 1 : f.tg)); g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); }
    g.fillStyle = P.tag; g.fill(); g.lineWidth = Math.max(1, L * 0.07); g.strokeStyle = P.tagS; g.stroke();
    if (o.lost && o.lost()) { g.setLineDash([3, 3]); g.beginPath(); for (const f of F) { if (f.out || f.dead || !f.lost) continue; const [x, y] = pos(f), r = Math.max(3.5, L * 0.32); g.moveTo(x + r, y); g.arc(x, y, r, 0, TAU); } g.strokeStyle = P.tag; g.lineWidth = 1.8; g.stroke(); g.setLineDash([]); }
    if (o.over) o.over(g, W, P);
    const al = o.aria ? o.aria() : "Étang"; if (al !== v.al) { v.al = al; cvs.setAttribute("aria-label", al); }
  }
  function loop(ts) {
    if (!document.body.contains(host)) return;
    const dt = lt ? Math.min(100, ts - lt) : 16; lt = ts; let act = false;
    if (M.anims.length) { const a = M.anims[0]; a.t += dt; const p = Math.min(1, a.t / a.dur); a.step(p); if (p >= 1) { M.anims.shift(); if (a.end) a.end(); } act = true; }
    if (!frozen() && vis) { v.t += dt / 1000; act = true; }
    if (act || v.dirty) { paint(); v.dirty = false; }
    requestAnimationFrame(loop);
  }
  if (window.IntersectionObserver) new IntersectionObserver(es => { vis = es[0].isIntersecting; }).observe(host);
  cvs.addEventListener("pointerdown", ev => { if (!o.tap) return; const r = cvs.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.width; o.tap(x, y); v.dirty = true; });
  if (window.ResizeObserver) new ResizeObserver(() => { if (Math.abs((host.clientWidth || 0) - W) > 2) v.draw(); }).observe(host);
  Charts.list.add(v); paint(); requestAnimationFrame(loop);
  return v;
}
const queue = (M, dur, step, end) => { M.anims.push({ dur: RMO ? Math.min(dur, 250) : dur, t: 0, step, end }); };
const fishIco = (marked, sm) => `<svg class="fico${sm ? " sm" : ""}" viewBox="0 0 40 20" aria-hidden="true"><path d="M30 10 A13 6 0 1 1 30 9.9 Z M10 10 L2 3 L2 17 Z" class="fb"/>${marked ? `<circle cx="18" cy="10" r="4.6" class="ft"/>` : ""}</svg>`;

/* ======================= LE LABORATOIRE DE CMR ======================= */
const WAIT = { h: ["1 heure", 30], j: ["1 jour", 500], s: ["1 semaine", 4000] };
const PLACE = { rand: "Au hasard", same: "Au même endroit que la capture", far: "À l'autre bout de l'étang" };
const EFF = { none: "Aucun", pred: "Le héron repère et mange les poissons marqués", shy: "Les poissons marqués évitent le filet" };
const LOSE = { f: "Permanente", t: "S'efface chez certains poissons" };
const BIRTH = { f: "Constante", t: "Naissances et arrivées de poissons" };
const UDEF = { n1: 50, n2: 50, k: 1, w: "s", pl: "rand", lose: false, eff: "none", birth: false, auto: false };
const NMIN = 10, NMAX = 300;
function uL() {
  const x = xst(); if (!x.u || typeof x.u !== "object") x.u = {}; const u = x.u;
  Object.keys(UDEF).forEach(k => { if (typeof u[k] !== typeof UDEF[k]) u[k] = UDEF[k]; });
  ["n1", "n2"].forEach(k => { u[k] = clampN(Math.round(u[k] / 10) * 10, NMIN, NMAX); });
  if (![1, 3, 5].includes(u.k)) u.k = 1; if (!WAIT[u.w]) u.w = "s"; if (!PLACE[u.pl]) u.pl = "rand"; if (!EFF[u.eff]) u.eff = "none";
  return u;
}
const idealU = u => u.w === "s" && u.pl === "rand" && !u.lose && u.eff === "none" && !u.birth;
function runs() { const x = xst(); if (!Array.isArray(x.runs)) x.runs = []; return x.runs; }
const calcOk = () => xst().calcOk || 0;
const autoOn = () => calcOk() >= 2 && uL().auto;
const condTxt = r => { const c = []; if (r.w !== "s") { c.push("attente " + WAIT[r.w][0]); if (r.pl === "near") c.push("même endroit"); if (r.pl === "far") c.push("autre bout"); } if (r.lose) c.push("marque qui s'efface"); if (r.eff === "pred") c.push("héron"); if (r.eff === "shy") c.push("filet évité"); if (r.birth) c.push("naissances"); return c.length ? c.join(", ") : "idéales"; };
/* manipulations attendues par les étapes */
const done = runs => runs.filter(r => r.est !== null);
const stdRuns = () => runs().filter(r => r.std);
const lastEst = () => { const L = done(runs()); return L.length ? L[L.length - 1] : null; };
const errMean = L => L.length ? mean(L.map(r => r.err)) : NaN;
const bigStd = () => done(stdRuns()).filter(r => r.n1 >= 150 && r.n2 >= 150);
const smallStd = () => done(stdRuns()).filter(r => r.n1 < 100 && r.n2 < 100);
const multiStd = () => done(stdRuns()).filter(r => r.k >= 3);
const hasRun = pred => runs().some(pred);
function sameProto() { const g = {}; stdRuns().forEach(r => { const k = r.n1 + "|" + r.n2 + "|" + r.k; (g[k] = g[k] || []).push(r); }); let best = []; Object.values(g).forEach(a => { if (a.length > best.length) best = a; }); return best; }

let LAB = null;
function newLab() {
  const N = 300 + Math.floor(Math.random() * 601), F = [];
  for (let i = 0; i < N; i++) { const [x, y] = rndIn(0.93); F.push(mkFish(x, y)); }
  const x = xst(); x.pid = (x.pid || 0) + 1;
  return { pid: x.pid, N0: N, F, anims: [], ph: "ready", pend: null, cap: null, rec: [], cfg: null, est: null, imp: false, tries: 0, born: 0, eaten: 0, lostN: 0, w1: false, msg: "", ui: null, net: null };
}
const capPoint = () => ringPt(Math.random() * TAU, 0.42 + Math.random() * 0.28);
function farPoint(c) { const an = Math.atan2((c[1] - EC.y) / EC.b, (c[0] - EC.x) / EC.a) + Math.PI; return ringPt(an, 0.72); }
function pickNear(L, c, n, shy) {
  const A = L.F.filter(f => !f.out && !f.dead).map(f => [dist([f.x, f.y], c), f]).sort((a, b) => a[0] - b[0]), sel = [];
  for (const [d, f] of A) { if (sel.length >= n) break; if (shy && f.wm && Math.random() < 0.7) continue; sel.push([d, f]); }
  const nx = A.find(a => !sel.includes(a)), dn = sel.length ? sel[sel.length - 1][0] : 0.05;
  return { sel: sel.map(s => s[1]), R: nx && nx[0] > dn ? (dn + nx[0]) / 2 : dn + 0.01 };
}
function labCapture(L) {
  const u = uL(); L.cfg = Object.assign({}, u); const c = L.pend || capPoint(); L.pend = null;
  const { sel, R } = pickNear(L, c, L.cfg.n1, false); L.cap = { c, n: sel.length }; L.net = { c, R, p: 0 }; L.busy = true;
  sel.forEach(f => { f.hl = 1; });
  queue(L, 1000, p => { L.net.p = Math.min(1, p * 2); if (p > 0.55) sel.forEach(f => { f.al = 1 - (p - 0.55) / 0.45; }); }, () => { sel.forEach(f => { f.out = 1; f.hl = 0; f.al = undefined; }); L.net = null; L.ph = "captured"; L.busy = false; L.msg = `${L.cap.n} poissons capturés dans le filet : ils sont dans le seau.`; if (L.ui) L.ui(); });
}
function labMark(L) {
  const sel = L.F.filter(f => f.out); L.busy = true;
  sel.forEach(f => { f.out = 0; f.m = 1; f.wm = 1; f.al = 0; f.tg = 0; });
  queue(L, 800, p => sel.forEach(f => { f.al = Math.min(1, p * 2); f.tg = clampN((p - 0.3) / 0.5, 0, 1.25 - Math.max(0, p - 0.8)); }), () => { sel.forEach(f => { f.al = undefined; f.tg = undefined; }); L.ph = "released"; L.busy = false; L.msg = `${sel.length} poissons marqués d'une pastille orange, puis relâchés là où ils ont été capturés.`; if (L.ui) L.ui(); });
}
function labWait(L) {
  const cfg = L.cfg, T = WAIT[cfg.w][1], first = !L.w1; L.w1 = true; L.busy = true;
  const bornT = [], deathT = [];
  if (first && cfg.birth) { const nb = Math.round(L.N0 * 0.6); for (let i = 0; i < nb; i++) { const [x, y] = rndIn(0.93); const f = mkFish(x, y, true); f.dead = 1; f.pend = 1; L.F.push(f); bornT.push([Math.random(), f]); } }
  if (first && cfg.eff === "pred") L.F.forEach(f => { if (f.m && !f.dead && Math.random() < 0.5) deathT.push([Math.random() * 0.9, f]); });
  let k = 0; L.waitP = 0;
  queue(L, RMO ? 250 : (cfg.w === "h" ? 900 : 1700), p => {
    const goal = Math.round(T * p); if (goal > k) { swim(L.F, goal - k); k = goal; }
    L.waitP = p;
    bornT.forEach(b => { if (b[1].pend && b[0] <= p) { b[1].pend = 0; b[1].dead = 0; b[1].al = 0; } if (!b[1].pend && b[1].al !== undefined) b[1].al = Math.min(1, b[1].al + 0.08); });
    deathT.forEach(d => { if (!d[1].dead && d[0] <= p) { d[1].al = (d[1].al === undefined ? 1 : d[1].al) - 0.12; if (d[1].al <= 0) { d[1].dead = 1; d[1].al = undefined; } } });
  }, () => {
    bornT.forEach(b => { b[1].pend = 0; b[1].dead = 0; b[1].al = undefined; }); deathT.forEach(d => { d[1].dead = 1; d[1].al = undefined; });
    if (first) { L.born = bornT.length; L.eaten = deathT.length; if (cfg.lose) L.F.forEach(f => { if (f.m && !f.dead && Math.random() < 0.5) { f.m = 0; f.lost = 1; L.lostN++; } }); }
    L.waitP = null; L.ph = "waited"; L.busy = false; L.msg = `${WAIT[cfg.w][0]} plus tard : les poissons se sont déplacés dans l'étang.`; if (L.ui) L.ui();
  });
}
function labRecapture(L) {
  const cfg = L.cfg; let c = L.pend; L.pend = null;
  if (!c) c = cfg.pl === "same" ? L.cap.c.slice() : cfg.pl === "far" ? farPoint(L.cap.c) : capPoint();
  const { sel, R } = pickNear(L, c, cfg.n2, cfg.eff === "shy"), m = sel.filter(f => f.m).length;
  L.rec.push({ c, n: sel.length, m }); L.net = { c, R, p: 0 }; L.busy = true; sel.forEach(f => { f.hl = 1; });
  queue(L, 900, p => { L.net.p = Math.min(1, p * 1.6); }, () => { L.ph = "recap"; L.busy = false; L.msg = `Recapture ${L.rec.length} : ${sel.length} poissons dans le filet. Les poissons marqués sont repérés grâce à leur pastille : compte-les dans le carnet.`; if (L.ui) L.ui(); });
}
function labRelease(L) { L.F.forEach(f => { f.hl = 0; }); L.net = null; labWait(L); }
function labEstimate(L) {
  L.F.forEach(f => { f.hl = 0; }); L.net = null;
  const cfg = L.cfg, mb = mean(L.rec.map(r => r.m));
  if (!mb) { L.est = null; L.imp = true; L.ph = "estimated"; L.msg = "Aucun poisson marqué recapturé : m = 0. On ne peut pas diviser par 0, l'estimation est impossible."; return; }
  if (autoOn()) { L.est = cfg.n1 * cfg.n2 / mb; L.ph = "estimated"; L.msg = "Calcul automatique de l'estimation."; return; }
  L.ph = "estimate"; L.msg = "Calcule l'estimation de l'effectif dans le carnet de terrain.";
}
function labReveal(L) {
  const cfg = L.cfg, mb = mean(L.rec.map(r => r.m)), d = dist(L.rec[0].c, L.cap.c), est = L.est === null ? null : Math.round(L.est);
  const r = { id: (xst().rid = (xst().rid || 0) + 1), pid: L.pid, n1: L.cap.n, n2: cfg.n2, k: cfg.k, ms: L.rec.map(q => q.m), mb, est, N: L.N0, N1: L.F.filter(f => !f.dead).length,
    err: est === null ? null : Math.abs(est - L.N0) / L.N0 * 100, w: cfg.w, pl: d < 0.12 ? "near" : d > 0.3 ? "far" : "mid", lose: cfg.lose, eff: cfg.eff, birth: cfg.birth, std: cfg.w === "s" && !cfg.lose && cfg.eff === "none" && !cfg.birth };
  const L2 = runs(); L2.push(r); while (L2.length > 40) L2.shift(); L.run = r; L.ph = "revealed"; keep();
}

const NAME = { n1: ["Poissons capturés puis marqués", "n₁"], n2: ["Poissons recapturés à chaque recapture", "n₂"] };
const segH = (key, lab, map) => `<div class="field"><span class="plab" id="sg-${key}">${lab}</span><div class="seg" role="group" aria-labelledby="sg-${key}">${Object.keys(map).map(k => `<button type="button" data-s="${key}" data-v="${k}">${map[k]}</button>`).join("")}</div></div>`;
function labW(el, openCond) {
  const u = uL(); if (!LAB) LAB = newLab(); const L = LAB;
  el.innerHTML = `<div class="simc cmr">
    <div class="simp" role="group" aria-label="Protocole de l'expérience">
      <p class="simh">1 · Je règle mon protocole</p>
      ${["n1", "n2"].map(k => `<div class="field"><label>${NAME[k][0]} : <b>${NAME[k][1]} = <span data-nv="${k}"></span></b><input type="range" min="${NMIN}" max="${NMAX}" step="10" data-nr="${k}" aria-label="${NAME[k][0]}, de ${NMIN} à ${NMAX}"></label><div class="row">${[-50, -10, 10, 50].map(d => `<button type="button" class="btn ghost sm" data-nd="${k}" data-d="${d}" aria-label="${d > 0 ? "Ajouter" : "Retirer"} ${Math.abs(d)} à ${NAME[k][1]}">${d > 0 ? "+" : "−"}${Math.abs(d)}</button>`).join("")}</div></div>`).join("")}
      <div class="field"><span class="plab" id="sg-k">Nombre de recaptures (on fait ensuite la moyenne de m)</span><div class="seg" role="group" aria-labelledby="sg-k">${[1, 3, 5].map(k => `<button type="button" data-kk="${k}">${k} recapture${k > 1 ? "s" : ""}</button>`).join("")}</div></div>
      <details class="fbx" data-cond ${openCond ? "open" : ""}><summary>Conditions de terrain&nbsp;<span class="chip" data-cb></span></summary>
        <p class="lead">Sur le terrain, les conditions de la méthode ne sont pas toujours respectées. Modifie une condition, puis réalise une CMR pour voir son effet.</p>
        ${segH("w", "Temps d'attente avant la recapture", { h: WAIT.h[0], j: WAIT.j[0], s: WAIT.s[0] })}
        ${segH("pl", "Lieu de la recapture", PLACE)}
        ${segH("lose", "La marque", LOSE)}
        ${segH("eff", "Effet de la marque sur le poisson", EFF)}
        ${segH("birth", "La population pendant l'attente", BIRTH)}
        <div class="row"><button type="button" class="btn ghost" data-ideal>↺ Revenir aux conditions idéales</button></div>
      </details>
      <p class="lead lockn" data-lock hidden>🔒 Réglages verrouillés pendant l'expérience. Termine-la, ou touche « Nouvel étang ».</p>
    </div>
    <div class="simr">
      <p class="simh">2 · Je réalise l'expérience</p>
      <ol class="cmrsteps" data-steps aria-label="Étapes de l'expérience"></ol>
      <div class="pond" data-pond></div>
      <p class="pleg">${fishIco(false)} poisson <span class="sep">·</span> ${fishIco(true)} poisson marqué (pastille orange) <span class="sep">·</span> <span class="sim">⚠ ${SIMUL}</span></p>
      <div class="row acts2"><button type="button" class="btn" data-act></button><button type="button" class="btn ghost" data-new>🔄 Nouvel étang</button><button type="button" class="btn ghost" data-frz></button></div>
      <p class="lead" data-msg aria-live="polite"></p>
      <div class="carnet" data-carnet></div>
    </div>
    <div class="simr"><p class="simh">3 · Mes simulations</p><div data-log></div></div></div>`;
  const view = pondView($("[data-pond]", el), L, {
    L: W => clampN(W * 0.019, 6, 13),
    lost: () => L.ph === "revealed",
    tap: (x, y) => { if (L.busy || !["ready", "waited"].includes(L.ph) || !inE(x, y, 0.95)) return; L.pend = [x, y]; $("[data-msg]", el).textContent = L.ph === "ready" ? "📍 Filet placé : touche « Capturer »." : "📍 Filet placé : touche « Recapturer »."; },
    over: (g, W, P) => {
      if (L.pend) drawPin(g, W, P, L.pend);
      if (L.net) drawNet(g, W, P, L.net.c, L.net.R, L.net.p);
      if (L.waitP !== null && L.waitP !== undefined) banner(g, W, P, `⏩ ${WAIT[L.cfg.w][0]} plus tard…`, L.waitP);
      else if (L.ph === "ready" && !L.pend) banner(g, W, P, "Touche l'étang pour placer ton filet");
      else if (L.ph === "waited" && !L.pend && L.cfg && L.cfg.pl === "rand") banner(g, W, P, "Touche l'étang pour placer ton filet");
    },
    aria: () => `Étang n° ${L.pid}, population de poissons d'effectif inconnu. ${L.msg || ""}`
  });
  const STEPS = ["Capturer", "Marquer", "Attendre", "Recapturer", "Estimer", "Vérifier"];
  const stepIx = () => L.ph === "recap" ? (L.rec.length < L.cfg.k ? 2 : 4) : ({ ready: 0, captured: 1, released: 2, waited: 3, estimate: 4, estimated: 5, revealed: 6 })[L.ph];
  function paintParams() {
    const lock = L.ph !== "ready" || L.busy;
    ["n1", "n2"].forEach(k => { $(`[data-nv="${k}"]`, el).textContent = u[k]; const r = $(`[data-nr="${k}"]`, el); r.value = u[k]; r.disabled = lock; });
    $$("[data-nd]", el).forEach(b => { b.disabled = lock; });
    $$("[data-kk]", el).forEach(b => { b.setAttribute("aria-pressed", String(+b.dataset.kk === u.k)); b.disabled = lock; });
    $$("[data-s]", el).forEach(b => { const k = b.dataset.s, val = typeof UDEF[k] === "boolean" ? String(u[k] ? "t" : "f") : u[k]; b.setAttribute("aria-pressed", String(b.dataset.v === val)); b.disabled = lock; });
    $("[data-ideal]", el).disabled = lock || idealU(u);
    const cb = $("[data-cb]", el); cb.textContent = idealU(u) ? "idéales" : "modifiées"; cb.className = "chip " + (idealU(u) ? "ok" : "mid");
    $("[data-lock]", el).hidden = !lock || L.ph === "revealed";
  }
  function actLabel() {
    const c = L.cfg || u;
    switch (L.ph) {
      case "ready": return `🎣 Capturer ${c.n1} poissons`;
      case "captured": return "🖍 Marquer et relâcher";
      case "released": return `⏳ Attendre ${WAIT[c.w][0]}`;
      case "waited": return `🎣 Recapturer ${c.n2} poissons${c.k > 1 ? ` (${L.rec.length + 1}/${c.k})` : ""}`;
      case "recap": return L.rec.length < c.k ? `↩ Relâcher et attendre ${WAIT[c.w][0]}` : "🧮 Estimer l'effectif";
      case "estimate": return "🧮 Calcule ci-dessous";
      case "estimated": return "👁 Révéler l'effectif réel";
      default: return "🔄 Nouvelle simulation";
    }
  }
  function carnet() {
    const c = L.cfg, lines = [`<li><b>Étang n° ${L.pid}</b> · effectif réel : <b>${L.ph === "revealed" ? nI(L.N0) + " poissons" : "inconnu"}</b></li>`];
    if (L.cap) lines.push(`<li>Capture : <b>n₁ = ${L.cap.n}</b> poissons ${L.ph === "captured" ? "dans le seau 🪣" : "marqués puis relâchés"}</li>`);
    if (L.w1 && c) lines.push(`<li>Attente avant chaque recapture : ${WAIT[c.w][0]}${idealU(c) ? "" : ` · conditions : ${condTxt({ w: c.w, pl: c.pl === "same" ? "near" : c.pl === "far" ? "far" : "mid", lose: c.lose, eff: c.eff, birth: c.birth })}`}</li>`);
    L.rec.forEach((r, i) => { lines.push(`<li>Recapture${c.k > 1 ? " " + (i + 1) : ""} : <b>n₂ = ${r.n}</b> poissons, dont <b>m = ${r.m}</b> marqués</li>`); });
    let h = `<p class="kicker">📒 Carnet de terrain</p><ul class="ul">${lines.join("")}</ul>`;
    if (["recap", "estimate", "estimated", "revealed"].includes(L.ph) && L.rec.length === c.k && c.k > 1) h += `<p>Moyenne : m̄ = (${L.rec.map(r => r.m).join(" + ")}) ÷ ${c.k} = <b>${fmt(Math.round(mean(L.rec.map(r => r.m)) * 100) / 100)}</b></p>`;
    const mL = c && c.k > 1 ? "m̄" : "m", n1 = L.cap ? L.cap.n : 0, n2 = c ? c.n2 : 0;
    if (L.ph === "estimate") {
      const ex = n1 * n2 / mean(L.rec.map(r => r.m));
      h += `<div class="estf"><label for="estIn">Calcule l'estimation : <b>N̂ = n₁ × n₂ ÷ ${mL}</b> = </label><div class="row"><input id="estIn" class="inp" inputmode="decimal" autocomplete="off" aria-describedby="estFb"><span class="unit">poissons</span><button type="button" class="btn" data-est>Vérifier mon calcul</button></div><p class="pfb" id="estFb" aria-live="polite">${L.tries ? `✗ Pas encore : N̂ = n₁ × n₂ ÷ ${mL} = ${n1} × ${n2} ÷ ${mL === "m̄" ? fmt(Math.round(mean(L.rec.map(r => r.m)) * 100) / 100) : L.rec[0].m}.` : `Utilise ta calculatrice${calcOk() < 2 ? ` (calcul ${calcOk() + 1}/2 : ensuite, le calcul devient automatique)` : ""}.`}</p>
        ${L.tries >= 2 ? `<p class="lead">Le calcul : ${n1} × ${n2} ÷ ${mL === "m̄" ? fmt(Math.round(mean(L.rec.map(r => r.m)) * 100) / 100) : L.rec[0].m} ≈ <b>${nI(ex)}</b> poissons.</p><div class="row"><button type="button" class="btn ghost" data-estok>Continuer avec N̂ ≈ ${nI(ex)}</button></div>` : ""}</div>`;
    }
    if (L.ph === "estimated" || L.ph === "revealed") h += L.imp ? `<p class="box warn"><span class="lab">⚠ Estimation impossible</span><span>Aucun poisson marqué parmi les poissons recapturés (m = 0) : on ne peut pas diviser par 0. Augmente n₁ ou n₂.</span></p>` : `<p>Estimation : <b>N̂ = ${n1} × ${n2} ÷ ${c.k > 1 ? fmt(Math.round(mean(L.rec.map(r => r.m)) * 100) / 100) : L.rec[0].m} ≈ ${nI(L.est)} poissons</b></p>`;
    if (L.ph === "revealed") {
      const r = L.run, ch = [];
      if (L.born) ch.push(`${L.born} naissances ou arrivées pendant l'attente`); if (L.eaten) ch.push(`${L.eaten} poissons marqués mangés par le héron`); if (L.lostN) ch.push(`${L.lostN} poissons ont perdu leur marque (cercles en pointillés)`);
      h += `<div class="box ${r.est === null ? "warn" : r.err <= 10 ? "key" : "warn"}"><span class="lab">👁 Vérification (possible seulement en simulation)</span><span>On vide l'étang et on compte tous les poissons : <b>N = ${nI(L.N0)}</b> au moment du marquage.${ch.length ? " " + ch.join(" · ") + "." : ""}</span>${r.est === null ? "" : `<span>Écart = |N̂ − N| ÷ N × 100 = |${nI(r.est)} − ${nI(r.N)}| ÷ ${nI(r.N)} × 100 = <b>${pc(r.err)}</b> · ${r.est > r.N ? "surestimation" : r.est < r.N ? "sous-estimation" : "estimation exacte"}</span>`}</div>`;
    }
    return h;
  }
  function logHTML() {
    const R = runs(); if (!R.length) return `<p class="locked">Tes simulations apparaîtront ici après l'étape « Vérifier ».</p>`;
    const nar = (el.clientWidth || 600) < 800, last = R.slice(-12);
    const rows = last.map(r => { const mm = r.k > 1 ? `m̄ = ${fmt(Math.round(r.mb * 100) / 100)}` : `m = ${r.ms[0]}`, est = r.est === null ? "impossible" : nI(r.est), er = r.err === null ? "—" : pc(r.err), cnd = condTxt(r);
      return nar ? [`<b>n° ${r.id}</b><br>n₁ = ${r.n1} · n₂ = ${r.n2}${r.k > 1 ? ` · ${r.k} recaptures` : ""}<br>${mm}${cnd !== "idéales" ? `<br><span class="muted">⚠ ${cnd}</span>` : ""}`, est, nI(r.N), er]
        : [`n° ${r.id}`, String(r.n1), String(r.n2) + (r.k > 1 ? ` (×${r.k})` : ""), mm, est, nI(r.N), er, cnd]; });
    const head = nar ? ["Simulation", "N̂ estimé", "N réel", "Écart"] : ["Simulation", "n₁", "n₂", "Marqués recapturés", "N̂ estimé", "N réel", "Écart", "Conditions"];
    const g = [[smallStd(), "petits échantillons (n₁ et n₂ < 100)"], [bigStd(), "grands échantillons (n₁ et n₂ ≥ 150)"], [multiStd(), "plusieurs recaptures (3 ou 5)"]].filter(a => a[0].length);
    return `<div class="tablewrap"><table class="t simtab"><caption>Mes simulations${R.length > 12 ? " (les 12 dernières)" : ""} · ⚠ ${SIMUL}</caption><thead><tr>${head.map(x => `<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      ${g.length ? `<p class="lead"><b>Écart moyen</b> (conditions idéales) : ${g.map(a => `${a[1]} → <b>${pc(errMean(a[0]))}</b> (${a[0].length} simulation${a[0].length > 1 ? "s" : ""})`).join(" · ")}</p>` : ""}
      <div class="row"><button type="button" class="btn ghost" data-clr>Effacer le tableau</button></div>`;
  }
  function paintLog() { const lg = $("[data-log]", el); lg.innerHTML = logHTML(); const b = $("[data-clr]", lg); if (b) armButton(b, "Effacer le tableau", "Confirmer : tout effacer ?", () => { xst().runs = []; keep(); paintLog(); }); }
  function paintUI() {
    if (!document.body.contains(el)) return;
    paintParams();
    const ix = stepIx(); $("[data-steps]", el).innerHTML = STEPS.map((s, i) => `<li class="${i < ix ? "dn" : i === ix ? "cur" : ""}" ${i === ix ? 'aria-current="step"' : ""}><span class="n">${i < ix ? "✓" : i + 1}</span>${s}</li>`).join("");
    const a = $("[data-act]", el); a.textContent = actLabel(); a.disabled = L.busy || L.ph === "estimate"; a.hidden = L.ph === "estimate";
    $("[data-msg]", el).textContent = L.msg || (L.ph === "ready" ? "Une population de poissons d'effectif inconnu vit dans l'étang. Règle ton protocole, puis capture." : "");
    $("[data-carnet]", el).innerHTML = carnet();
    $("[data-frz]", el).textContent = RMO ? "Animation réduite" : xst().frozen ? "▶ Animer les poissons" : "⏸ Figer les poissons"; $("[data-frz]", el).disabled = RMO;
    const ei = $("#estIn", el);
    if (ei) {
      const chk = () => { const v = parseNum(ei.value), ex = L.cap.n * L.cfg.n2 / mean(L.rec.map(r => r.m)); if (!Number.isFinite(v)) { $("#estFb", el).textContent = "Écris un nombre (la virgule est acceptée)."; return; }
        if (near(v, ex, Math.max(1, ex * 0.015))) { const x = xst(); x.calcOk = (x.calcOk || 0) + 1; if (x.calcOk === 2) { uL().auto = true; L.msg = "✓ Calcul juste. Deux calculs justes : le calcul de N̂ est désormais automatique (option dans le carnet)."; } else L.msg = "✓ Calcul juste."; L.est = ex; L.ph = "estimated"; keep(); paintUI(); const b = $("[data-act]", el); if (b) b.focus(); }
        else { L.tries++; paintUI(); const n = $("#estIn", el); if (n) { n.value = ei.value; n.focus(); } } };
      $("[data-est]", el).onclick = chk; ei.addEventListener("keydown", ev => { if (ev.key === "Enter") chk(); });
      const ok = $("[data-estok]", el); if (ok) ok.onclick = () => { L.est = L.cap.n * L.cfg.n2 / mean(L.rec.map(r => r.m)); L.ph = "estimated"; L.msg = "Retiens la formule : N̂ = n₁ × n₂ ÷ m."; paintUI(); $("[data-act]", el).focus(); };
    }
    if (calcOk() >= 2 && (L.ph === "ready" || L.ph === "revealed")) { $("[data-carnet]", el).insertAdjacentHTML("beforeend", `<div class="row"><button type="button" class="btn ghost sm" data-auto aria-pressed="${uL().auto}">${uL().auto ? "✓ Calcul automatique de N̂ : activé" : "Calcul automatique de N̂ : désactivé"}</button></div>`); $("[data-auto]", el).onclick = () => { uL().auto = !uL().auto; keep(); paintUI(); $("[data-auto]", el).focus(); }; }
    paintLog(); view.refresh();
  }
  L.ui = paintUI;
  $("[data-act]", el).onclick = () => {
    if (L.busy) return;
    if (L.ph === "ready") labCapture(L); else if (L.ph === "captured") labMark(L); else if (L.ph === "released") labWait(L); else if (L.ph === "waited") labRecapture(L);
    else if (L.ph === "recap") { if (L.rec.length < L.cfg.k) labRelease(L); else labEstimate(L); }
    else if (L.ph === "estimated") labReveal(L); else if (L.ph === "revealed") { LAB = newLab(); labW(el, $("[data-cond]", el).open); $("[data-act]", el).focus(); return; }
    paintUI(); const ei = $("#estIn", el); if (ei) ei.focus();
  };
  armButton($("[data-new]", el), "🔄 Nouvel étang", "Confirmer : nouvel étang ?", () => { if (L.busy) return; LAB = newLab(); labW(el, $("[data-cond]", el).open); });
  $("[data-frz]", el).onclick = () => { xst().frozen = !xst().frozen; keep(); paintUI(); };
  const setN = (k, v) => { if (L.ph !== "ready") return; u[k] = clampN(Math.round(v / 10) * 10, NMIN, NMAX); keep(); paintUI(); };
  $$("[data-nr]", el).forEach(r => r.addEventListener("input", () => setN(r.dataset.nr, +r.value)));
  $$("[data-nd]", el).forEach(b => b.onclick = () => setN(b.dataset.nd, u[b.dataset.nd] + +b.dataset.d));
  $$("[data-kk]", el).forEach(b => b.onclick = () => { if (L.ph !== "ready") return; u.k = +b.dataset.kk; keep(); paintUI(); b.focus(); });
  $$("[data-s]", el).forEach(b => b.onclick = () => { if (L.ph !== "ready") return; const k = b.dataset.s; u[k] = typeof UDEF[k] === "boolean" ? b.dataset.v === "t" : b.dataset.v; keep(); paintUI(); b.focus(); });
  $("[data-ideal]", el).onclick = () => { Object.assign(u, { w: "s", pl: "rand", lose: false, eff: "none", birth: false }); keep(); paintUI(); };
  if (!idealU(u)) $("[data-cond]", el).open = true;
  if (window.ResizeObserver) { let nw = (el.clientWidth || 600) < 800; new ResizeObserver(() => { const n = (el.clientWidth || 600) < 800; if (n !== nw && document.body.contains(el)) { nw = n; paintLog(); } }).observe(el); }
  paintUI();
}
WID.lab = el => labW(el, false);
WID.labc = el => labW(el, true);

/* ======================= PARTIE 1 : LE PETIT ÉTANG (scénario fixe : 30 poissons, 6 marqués, recapture de 10 dont 2 marqués) ======================= */
let MINI = null;
function newMini() {
  const R = rng(7), F = []; for (let i = 0; i < 30; i++) { const [x, y] = rndIn(0.82, R); const f = mkFish(x, y); f.a = R() * TAU; f.ph = R() * TAU; F.push(f); }
  return { F, anims: [], ph: 0, busy: false, net: null, tray: null, ui: null, waitP: null };
}
const C1 = [0.27, 0.31], C2 = [0.72, 0.29];
function miniTargets(M) {
  const R = rng(11), T = []; while (T.length < 30) { const p = rndIn(0.82, R); if (T.every(q => dist(p, q) > 0.045)) T.push(p); }
  const ord = T.map((p, i) => [dist(p, C2), i]).sort((a, b) => a[0] - b[0]).map(a => a[1]), near = ord.slice(0, 10), far = ord.slice(10);
  const mk = M.F.filter(f => f.m), um = M.F.filter(f => !f.m), tgt = new Map();
  [near[3], near[7]].forEach((ti, j) => tgt.set(mk[j], T[ti])); mk.slice(2).forEach((f, j) => tgt.set(f, T[far[j * 4 + 1]]));
  const nearL = near.filter((ti, j) => j !== 3 && j !== 7), farL = far.filter((ti, j) => ![1, 5, 9, 13].includes(j));
  um.forEach((f, j) => tgt.set(f, T[j < 8 ? nearL[j] : farL[j - 8]]));
  return tgt;
}
WID.mini = el => {
  if (!MINI) MINI = newMini(); const M = MINI;
  el.innerHTML = `<div class="simr cmr"><p class="lead">Dans ce petit étang à l'eau trouble, on ne peut pas compter les poissons. Réalise l'expérience étape par étape : toutes les quantités sont petites, pour bien comprendre.</p>
    <ol class="cmrsteps" data-steps aria-label="Étapes de l'expérience"></ol><div class="pond" data-pond></div>
    <p class="pleg">${fishIco(false)} poisson <span class="sep">·</span> ${fishIco(true)} poisson marqué (pastille orange)</p>
    <div class="row acts2"><button type="button" class="btn" data-act></button><button type="button" class="btn ghost" data-rst>↺ Recommencer</button></div>
    <p class="lead" data-msg aria-live="polite"></p><div data-tray></div></div>`;
  const STEPS = ["Capturer", "Marquer et relâcher", "Attendre", "Recapturer"];
  const view = pondView($("[data-pond]", el), M, { L: W => clampN(W * 0.045, 14, 34), murky: true,
    over: (g, W, P) => { if (M.net) drawNet(g, W, P, M.net.c, M.net.R, M.net.p); if (M.waitP !== null) banner(g, W, P, "⏩ Une semaine plus tard…", M.waitP); },
    aria: () => "Petit étang à l'eau trouble. " + ($("[data-msg]", el) ? $("[data-msg]", el).textContent : "") });
  const LAB_ = ["🎣 Capturer des poissons", "🖍 Marquer et relâcher", "⏳ Attendre une semaine", "🎣 Recapturer des poissons", "✓ Expérience terminée"];
  const MSG = ["Touche « Capturer » : le filet est lancé à gauche de l'étang.", "Les poissons capturés sont dans le seau.", "Les poissons marqués ont été relâchés là où ils ont été capturés.", "Une semaine a passé : les poissons se sont mélangés.", "Compte les poissons du seau de la recapture."];
  function tray() { if (M.ph === 1) return `<div class="tray"><p class="kicker">🪣 Seau de la capture : ${M.F.filter(f => f.out).length} poissons</p><div class="fishes">${M.F.filter(f => f.out).map(() => fishIco(false)).join("")}</div></div>`;
    if (M.ph === 4) { const sel = M.F.filter(f => f.hl), ord = shuffle(sel.map((f, i) => i), 3); return `<div class="tray"><p class="kicker">🪣 Seau de la recapture : ${sel.length} poissons</p><div class="fishes">${ord.map(i => fishIco(!!sel[i].m)).join("")}</div><p class="lead">Les pastilles orange signalent les poissons marqués.</p></div>`; }
    return ""; }
  function paintUI() {
    if (!document.body.contains(el)) return;
    $("[data-steps]", el).innerHTML = STEPS.map((s, i) => `<li class="${i < M.ph ? "dn" : i === M.ph ? "cur" : ""}" ${i === M.ph ? 'aria-current="step"' : ""}><span class="n">${i < M.ph ? "✓" : i + 1}</span>${s}</li>`).join("");
    const a = $("[data-act]", el); a.textContent = LAB_[M.ph]; a.disabled = M.busy || M.ph >= 4; $("[data-msg]", el).textContent = MSG[M.ph]; $("[data-tray]", el).innerHTML = tray(); view.refresh();
  }
  M.ui = paintUI;
  $("[data-act]", el).onclick = () => {
    if (M.busy) return; M.busy = true;
    if (M.ph === 0) { const all = M.F.map(f => [dist([f.x, f.y], C1), f]).sort((a, b) => a[0] - b[0]), sel = all.slice(0, 6); M.net = { c: C1, R: (all[5][0] + all[6][0]) / 2, p: 0 }; sel.forEach(s => { s[1].hl = 1; });
      queue(M, 1100, p => { M.net.p = Math.min(1, p * 2); if (p > 0.55) sel.forEach(s => { s[1].al = 1 - (p - 0.55) / 0.45; }); }, () => { sel.forEach(s => { s[1].out = 1; s[1].hl = 0; s[1].al = undefined; }); M.net = null; M.ph = 1; M.busy = false; if (M.ui) M.ui(); }); }
    else if (M.ph === 1) { const sel = M.F.filter(f => f.out); sel.forEach(f => { f.out = 0; f.m = 1; f.al = 0; f.tg = 0; }); queue(M, 900, p => sel.forEach(f => { f.al = Math.min(1, p * 2); f.tg = clampN((p - 0.3) / 0.5, 0, 1); }), () => { sel.forEach(f => { f.al = undefined; f.tg = undefined; }); M.ph = 2; M.busy = false; if (M.ui) M.ui(); }); }
    else if (M.ph === 2) { const tgt = miniTargets(M), st = new Map(M.F.map(f => [f, [f.x, f.y]])), sg = new Map(M.F.map((f, i) => [f, (i % 2 ? 1 : -1) * (0.03 + (i % 5) * 0.01)]));
      queue(M, 2200, p => { const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; M.waitP = p; M.F.forEach(f => { const s = st.get(f), t = tgt.get(f), dx = t[0] - s[0], dy = t[1] - s[1], d = Math.hypot(dx, dy) || 1, w = Math.sin(p * Math.PI * 2) * sg.get(f); const nx = s[0] + dx * e - dy / d * w, ny = s[1] + dy * e + dx / d * w; if (p < 0.98) f.a = Math.atan2(ny - f.y, nx - f.x); f.x = nx; f.y = ny; }); },
        () => { M.F.forEach(f => { const t = tgt.get(f); f.x = t[0]; f.y = t[1]; }); M.waitP = null; M.ph = 3; M.busy = false; if (M.ui) M.ui(); }); }
    else if (M.ph === 3) { const all = M.F.map(f => [dist([f.x, f.y], C2), f]).sort((a, b) => a[0] - b[0]), sel = all.slice(0, 10); M.net = { c: C2, R: (all[9][0] + all[10][0]) / 2, p: 0 }; sel.forEach(s => { s[1].hl = 1; });
      queue(M, 1000, p => { M.net.p = Math.min(1, p * 1.6); }, () => { M.ph = 4; M.busy = false; xst().miniDone = true; keep(); if (M.ui) M.ui(); }); }
    paintUI();
  };
  armButton($("[data-rst]", el), "↺ Recommencer", "Confirmer : recommencer ?", () => { if (M.busy) return; MINI = newMini(); WID.mini(el); });
  paintUI();
};
/* la balance des proportions (partie 1, étape 2) */
WID.balance = el => {
  const x = xst(); let N = Number.isInteger(x.bal) ? clampN(x.bal, 10, 60) : 18;
  el.innerHTML = `<div class="simr cmr bal"><p class="lead">Hypothèse de la méthode : après le mélange, la <b>proportion de poissons marqués</b> est la même dans l'échantillon de recapture et dans tout l'étang. Fais varier N, l'effectif de l'étang.</p>
    <div class="balrow"><p class="kicker">Échantillon de la recapture (le seau)</p><div class="fishes">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => fishIco(i === 2 || i === 7)).join("")}</div><div class="pbar" aria-hidden="true"><i style="width:20%"></i></div><p class="pv">2 marqués sur 10 → proportion = 2 ÷ 10 = <b>0,20</b></p></div>
    <div class="balrow"><p class="kicker">Tout l'étang : 6 poissons marqués sur N poissons</p><div class="field"><label>N = <b data-bv></b> poissons<input type="range" min="10" max="60" step="1" data-br aria-label="Effectif N de l'étang, de 10 à 60"></label><div class="row">${[-5, -1, 1, 5].map(d => `<button type="button" class="btn ghost sm" data-bd="${d}" aria-label="${d > 0 ? "Ajouter" : "Retirer"} ${Math.abs(d)} poisson${Math.abs(d) > 1 ? "s" : ""}">${d > 0 ? "+" : "−"}${Math.abs(d)}</button>`).join("")}</div></div>
      <div class="fishes sm" data-bf></div><div class="pbar" aria-hidden="true"><i data-bb></i></div><p class="pv" data-bp aria-live="polite"></p></div>
    <p class="cap">Les deux barres représentent la proportion de poissons marqués (de 0 à 1).</p></div>`;
  function paint() { $("[data-bv]", el).textContent = N; $("[data-br]", el).value = N; $("[data-bf]", el).innerHTML = Array.from({ length: N }, (_, i) => fishIco(i % Math.max(1, Math.floor(N / 6)) === 0 && Math.floor(i / Math.max(1, Math.floor(N / 6))) < 6, 1)).join(""); $("[data-bb]", el).style.width = (6 / N * 100).toFixed(1) + "%"; $("[data-bp]", el).innerHTML = `6 marqués sur ${N} → proportion = 6 ÷ ${N} = <b>${fmt(Math.round(6 / N * 100) / 100, 2)}</b>`; }
  const set = v => { N = clampN(Math.round(v), 10, 60); x.bal = N; if (N === 30) x.bal30 = true; keep(); paint(); };
  $("[data-br]", el).addEventListener("input", e => set(+e.target.value));
  $$("[data-bd]", el).forEach(b => b.onclick = () => set(N + +b.dataset.bd));
  paint();
};
WID.minicount = el => { el.innerHTML = `<p>On vide l'étang et on compte tous les poissons : <b>N = 30</b>, dont 6 marqués.</p><div class="fishes">${Array.from({ length: 30 }, (_, i) => fishIco(i % 5 === 0)).join("")}</div><p class="lead">Ici, l'estimation tombe juste. Dans la partie 2, avec un grand étang, tu verras que ce n'est pas toujours le cas… et dans la réalité, on ne peut pas vider l'étang pour vérifier !</p>`; };

/* ======================= PARTIE 4 : 50 CMR AUTOMATIQUES ET INTERVALLES DE CONFIANCE ======================= */
const NTEST = 600, FLN = [25, 50, 100, 200, 300], XMAX = 1500;
function series() { const x = xst(); if (!Array.isArray(x.flu)) x.flu = []; return x.flu; }
const serie = n => series().find(s => s.n === n);
function hyper(N, K, n) { let m = 0, k = K, t = N; for (let i = 0; i < n; i++) { if (Math.random() * t < k) { m++; k--; } t--; } return m; }
function icN(n1, n2, m) { const f = m / n2, h = 1 / Math.sqrt(n2), lo = n1 / (f + h), hi = f - h > 0 ? n1 / (f - h) : null; return { f, h, lo, hi }; }
function sStats(s) {
  const n = s.n, E = s.ms.map(m => m ? n * n / m : null), ok = E.filter(e => e !== null), I = s.ms.map(m => icN(n, n, m));
  const cont = I.filter(c => c.lo <= NTEST && (c.hi === null || NTEST <= c.hi)).length, B = I.filter(c => c.hi !== null);
  return { n, cnt: s.ms.length, imp: E.length - ok.length, min: ok.length ? Math.min(...ok) : null, max: ok.length ? Math.max(...ok) : null, avg: ok.length ? mean(ok) : null,
    within: E.filter(e => e !== null && Math.abs(e - NTEST) <= 0.1 * NTEST).length / s.ms.length * 100, cont: cont / s.ms.length * 100, unb: I.length - B.length, wid: B.length ? mean(B.map(c => c.hi - c.lo)) : null };
}
const stat = n => { const s = serie(n); return s ? sStats(s) : null; };
function fluTable(ic) {
  const L = series().slice().sort((a, b) => a.n - b.n); if (!L.length) return `<p class="locked">Lance une série : le tableau des résultats s'affiche ici.</p>`;
  const head = ic ? ["n₁ = n₂", "Intervalles contenant N", "Intervalles sans borne supérieure", "Largeur moyenne (bornés)"] : ["n₁ = n₂", "Estimations impossibles (m = 0)", "N̂ le plus petit – le plus grand", "Estimations à moins de 10 % de N"];
  const rows = L.map(s => { const t = sStats(s); return ic ? [`n = ${s.n}`, pc(t.cont), `${t.unb} sur ${t.cnt}`, t.wid === null ? "—" : nI(t.wid) + " poissons"] : [`n = ${s.n}`, `${t.imp} sur ${t.cnt}`, t.min === null ? "—" : `${nI(t.min)} – ${nI(t.max)}`, pc(t.within)]; });
  return `<div class="tablewrap"><table class="t simtab"><caption>${ic ? "Intervalles de confiance à 95 %" : "Estimations N̂"} · 50 CMR par série · N réel = ${nI(NTEST)} · ⚠ ${SIMUL}</caption><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function fluW(el, ic) {
  const x = xst(); let n = FLN.includes(x.fn) ? x.fn : 50, sel = null, rev = null;
  el.innerHTML = `<div class="simc cmr"><div class="simp"><p class="simh">1 · Je règle la série</p>
      <p class="lead">Un étang simulé dont on connaît l'effectif : <b>N = ${nI(NTEST)} poissons</b>. L'ordinateur réalise 50 CMR identiques, avec <b>n₁ = n₂ = n</b>.</p>
      <div class="field"><span class="plab" id="fnL">Taille des échantillons n</span><div class="seg" role="group" aria-labelledby="fnL">${FLN.map(v => `<button type="button" data-fn="${v}">n = ${v}</button>`).join("")}</div></div>
      <div class="row"><button type="button" class="btn" data-go>▶ Lancer 50 CMR</button></div><p class="lead" data-msg aria-live="polite"></p></div>
    <div class="simr"><p class="simh">2 · J'observe ${ic ? "les intervalles de confiance" : "la dispersion des estimations"}</p>
      ${ic ? `<div class="field"><span class="plab" id="fsL">Série affichée</span><div class="seg" role="group" aria-labelledby="fsL" data-fsel></div></div>` : ""}
      <p class="qlong">${ic ? "Chaque trait : l'intervalle de confiance à 95 % d'une CMR (point : N̂). Trait rouge en pointillés : l'intervalle ne contient pas N." : "Chaque point : l'estimation N̂ d'une CMR. Ligne en pointillés : l'effectif réel N."} <span class="sim">⚠ ${SIMUL}</span></p>
      <div class="figbox chartbox" data-fig></div><p class="readout" data-ro aria-live="polite">${CT.readHint}</p><div data-tab></div>
      <div class="row"><button type="button" class="btn ghost" data-clr>Effacer les séries</button></div></div></div>`;
  const fig = $("[data-fig]", el);
  const G = {};
  const chart = liveSVG(fig, (W, F) => ic ? forest(W, F) : dots(W, F));
  function xaxis(g, W, F, L, pw, T, ph, X) { const tk = TK(F), st = pw < 420 ? 500 : 300; for (let v = 0; v <= XMAX; v += st) { g.push(`<line x1="${X(v).toFixed(1)}" x2="${X(v).toFixed(1)}" y1="${T}" y2="${T + ph}" style="stroke:var(--grid)"/>` + sT(X(v), T + ph + tk * 1.35, fmt(v), "middle", tk)); } g.push(`<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:1.5"/>`); g.push(sT(L + pw / 2, T + ph + tk * 2.9, ic ? "Effectif N (poissons)" : "Estimation N̂ (poissons)", "middle", Math.max(16, F * 0.82), `font-weight="700"`)); g.push(`<line x1="${X(NTEST).toFixed(1)}" x2="${X(NTEST).toFixed(1)}" y1="${T - F * 0.3}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:2" stroke-dasharray="6 5"/>` + sT(X(NTEST) + 6, T - F * 0.35, "N réel = " + fmt(NTEST), "start", tk, `font-weight="700"`)); }
  function dots(W, F) {
    const L2 = series().slice().sort((a, b) => a.n - b.n), tk = TK(F), Lm = F * 3.6, R = F * 1.4, T = F * 1.6, rh = Math.max(F * 3, 64), ph = Math.max(1, L2.length) * rh, B = F * 3.6, H = T + ph + B, pw = W - Lm - R, X = v => Lm + Math.min(v, XMAX) / XMAX * pw, g = [];
    xaxis(g, W, F, Lm, pw, T, ph, X); G.d = { rows: [], Lm, pw, T, rh, X };
    if (!L2.length) g.push(sT(Lm + pw / 2, T + ph / 2, "Lance une série de 50 CMR", "middle", tk));
    L2.forEach((s, ri) => {
      const y0 = T + (ri + 1) * rh - 6, bw = 25, cnt = {}, r = Math.max(3, Math.min(6, pw / (XMAX / bw) / 2 * 0.95)), shown = rev && rev.n === s.n ? Math.floor(rev.k) : s.ms.length;
      g.push(`<line x1="${Lm}" x2="${Lm + pw}" y1="${y0 + 3}" y2="${y0 + 3}" style="stroke:var(--line)"/>` + sT(Lm - 8, y0 - rh * 0.3, "n = " + s.n, "end", tk, `font-weight="700"`));
      const bins = {}; s.ms.slice(0, shown).forEach((m, i) => { const e = m ? s.n * s.n / m : null, b = e === null ? "inf" : e > XMAX ? "over" : Math.floor(e / bw); (bins[b] = bins[b] || []).push([e, i, m]); });
      const cap = Math.floor((rh - 14) / (2 * r));
      Object.entries(bins).forEach(([b, arr]) => { if (b === "inf" || b === "over") return; const cx = X((+b + 0.5) * bw), dy = arr.length > cap ? (rh - 14) / arr.length : 2 * r; arr.forEach((a, j) => g.push(`<circle cx="${cx.toFixed(1)}" cy="${(y0 - r - j * dy).toFixed(1)}" r="${r.toFixed(1)}" style="fill:var(--c${1 + (FLN.indexOf(s.n) % 5)});stroke:var(--surface);stroke-width:1"/>`)); });
      const ov = (bins.over || []).length, inf = (bins.inf || []).length;
      if (ov) g.push(sT(Lm + pw + 3, y0 - 4, "»" + ov, "start", tk * 0.9, `font-weight="700"`));
      G.d.rows.push({ s, y0, bins, inf, ov });
    });
    return `<svg viewBox="0 0 ${W} ${H.toFixed(0)}" width="${W}" height="${H.toFixed(0)}" role="img" aria-label="Estimations de 50 CMR par série, comparées à N = ${NTEST}">${g.join("")}</svg>`;
  }
  function forest(W, F) {
    const s = serie(sel), tk = TK(F), Lm = F * 3.2, R = F * 1.6, T = F * 1.6, B = F * 3.6, rs = Math.max(7, F * 0.36), ph = 50 * rs + 8, H = T + ph + B, pw = W - Lm - R, X = v => Lm + Math.min(v, XMAX) / XMAX * pw, g = [];
    xaxis(g, W, F, Lm, pw, T, ph, X); G.f = { s, T, rs, X, Lm, pw };
    g.push(`<text transform="translate(${(F * 0.95).toFixed(1)},${(T + ph / 2).toFixed(1)}) rotate(-90)" text-anchor="middle" style="fill:var(--ink);font-size:${Math.max(16, F * 0.82).toFixed(1)}px;font-weight:700">N° de la CMR</text>`);
    [1, 10, 20, 30, 40, 50].forEach(i => g.push(sT(Lm - 6, T + 4 + (i - 0.5) * rs + tk * 0.3, String(i), "end", tk * 0.85)));
    if (!s) g.push(sT(Lm + pw / 2, T + ph / 2, "Lance une série de 50 CMR", "middle", tk));
    else { const shown = rev && rev.n === s.n ? Math.floor(rev.k) : s.ms.length;
      s.ms.slice(0, shown).forEach((m, i) => { const c = icN(s.n, s.n, m), y = T + 4 + (i + 0.5) * rs, inside = c.lo <= NTEST && (c.hi === null || NTEST <= c.hi), col = inside ? "var(--c1)" : "var(--bad)", x2 = c.hi === null ? Lm + pw + R * 0.6 : X(c.hi);
        g.push(`<line x1="${X(c.lo).toFixed(1)}" x2="${x2.toFixed(1)}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" style="stroke:${col};stroke-width:${Math.max(2, rs * 0.42).toFixed(1)}" ${inside ? "" : 'stroke-dasharray="4 3"'}/>`);
        if (c.hi === null || c.hi > XMAX) g.push(`<polygon points="${(Lm + pw + R * 0.85).toFixed(1)},${y.toFixed(1)} ${(Lm + pw + R * 0.5).toFixed(1)},${(y - rs * 0.4).toFixed(1)} ${(Lm + pw + R * 0.5).toFixed(1)},${(y + rs * 0.4).toFixed(1)}" style="fill:${col}"/>`);
        if (m) g.push(`<circle cx="${X(s.n * s.n / m).toFixed(1)}" cy="${y.toFixed(1)}" r="${Math.max(2.5, rs * 0.38).toFixed(1)}" style="fill:var(--surface);stroke:${col};stroke-width:2"/>`); }); }
    return `<svg viewBox="0 0 ${W} ${H.toFixed(0)}" width="${W}" height="${H.toFixed(0)}" role="img" aria-label="Intervalles de confiance de 50 CMR">${g.join("")}</svg>`;
  }
  fig.addEventListener("pointerdown", ev => {
    const svg = fig.querySelector("svg"); if (!svg) return; const r = svg.getBoundingClientRect(), k = svg.viewBox.baseVal.width / r.width, sx = (ev.clientX - r.left) * k, sy = (ev.clientY - r.top) * k, ro = $("[data-ro]", el);
    if (ic && G.f && G.f.s) { const i = Math.floor((sy - G.f.T - 4) / G.f.rs); if (i < 0 || i >= G.f.s.ms.length) return; const m = G.f.s.ms[i], c = icN(G.f.s.n, G.f.s.n, m); ro.innerHTML = `CMR n° ${i + 1} (n = ${G.f.s.n}) : m = ${m}${m ? ` → N̂ ≈ ${nI(G.f.s.n * G.f.s.n / m)}` : " → N̂ impossible"} · f = ${fmt(Math.round(c.f * 1000) / 1000)} · intervalle ${c.hi === null ? `[${nI(c.lo)} ; +∞[` : `[${nI(c.lo)} ; ${nI(c.hi)}]`} · ${c.lo <= NTEST && (c.hi === null || NTEST <= c.hi) ? "✓ contient N" : "✗ ne contient pas N"}`; return; }
    if (!ic && G.d) { const row = G.d.rows.find(q => sy <= q.y0 + 6 && sy >= q.y0 - G.d.rh + 6); if (!row) return; const v = (sx - G.d.Lm) / G.d.pw * XMAX; if (v < 0) return; const b = Math.floor(v / 25), arr = row.bins[b] || []; ro.innerHTML = `n = ${row.s.n} : <b>${arr.length}</b> estimation${arr.length > 1 ? "s" : ""} entre ${fmt(b * 25)} et ${fmt(b * 25 + 25)} poissons${row.ov ? ` · ${row.ov} au-delà de ${fmt(XMAX)}` : ""}${row.inf ? ` · ${row.inf} impossible${row.inf > 1 ? "s" : ""} (m = 0)` : ""}.`; }
  });
  function paint() {
    $$("[data-fn]", el).forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.fn === n)));
    const L2 = series().slice().sort((a, b) => a.n - b.n);
    if (ic) { if (!serie(sel)) sel = serie(n) ? n : L2.length ? L2[L2.length - 1].n : null; const fs = $("[data-fsel]", el); fs.innerHTML = L2.length ? L2.map(s => `<button type="button" data-fs="${s.n}" aria-pressed="${s.n === sel}">n = ${s.n}</button>`).join("") : `<span class="lead">aucune série</span>`; $$("[data-fs]", el).forEach(b => b.onclick = () => { sel = +b.dataset.fs; paint(); b.focus(); }); }
    $("[data-tab]", el).innerHTML = fluTable(ic); $("[data-clr]", el).parentNode.hidden = !L2.length; chart.draw();
  }
  $$("[data-fn]", el).forEach(b => b.onclick = () => { n = x.fn = +b.dataset.fn; keep(); paint(); b.focus(); });
  $("[data-go]", el).onclick = () => {
    const ms = Array.from({ length: 50 }, () => hyper(NTEST, n, n)), L2 = series().filter(s => s.n !== n); L2.push({ n, ms }); x.flu = L2; sel = n; keep();
    $("[data-msg]", el).textContent = `50 CMR réalisées avec n₁ = n₂ = ${n}.`; rev = { n, k: 0 }; let lt = 0; paint();
    const fr = ts => { if (!document.body.contains(el) || !rev) return; const dt = lt ? Math.min(100, ts - lt) : 16; lt = ts; rev.k += 50 * dt / (RMO ? 1 : 1400); if (rev.k >= 50) { rev = null; chart.draw(); return; } chart.draw(); requestAnimationFrame(fr); };
    requestAnimationFrame(fr);
  };
  armButton($("[data-clr]", el), "Effacer les séries", "Confirmer : tout effacer ?", () => { x.flu = []; rev = null; keep(); paint(); });
  paint();
}
WID.flu = el => fluW(el, false);
WID.fluic = el => fluW(el, true);

/* ---------- la demi-largeur 1/√n (partie 4, étape 2) ---------- */
const RN = [25, 50, 100, 200, 400, 800, 1600];
WID.ruler = el => {
  const x = xst(); if (!Array.isArray(x.rv)) x.rv = []; let n = RN.includes(x.rn) ? x.rn : null; const f = 0.3;
  el.innerHTML = `<p class="lead">Exemple : dans un échantillon de n poissons, la proportion de poissons marqués vaut <b>f = 0,30</b>. Choisis n et observe l'intervalle <span style="white-space:nowrap">[f − 1/√n ; f + 1/√n]</span>.</p>
    <div class="seg" role="group" aria-label="Taille de l'échantillon n">${RN.map(v => `<button type="button" data-rn="${v}">n = ${fmt(v)}</button>`).join("")}</div>
    <div class="figbox chartbox" data-fig></div><p class="readout" data-ro aria-live="polite"></p><div data-tab></div>`;
  const chart = liveSVG($("[data-fig]", el), (W, F) => {
    const tk = TK(F), L = F * 1.2, R = F * 1.2, T = F * 2.6, ph = F * 2.2, B = F * 3.6, H = T + ph + B, pw = W - L - R, X = v => L + v * pw, g = [];
    for (let v = 0; v <= 1.0001; v += 0.1) g.push(`<line x1="${X(v).toFixed(1)}" x2="${X(v).toFixed(1)}" y1="${T}" y2="${T + ph}" style="stroke:var(--grid)"/>` + (Math.round(v * 10) % 2 === 0 || pw > 520 ? sT(X(v), T + ph + tk * 1.35, fmt(Math.round(v * 10) / 10), "middle", tk) : ""));
    g.push(`<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" style="stroke:var(--ink);stroke-width:1.5"/>`);
    g.push(sT(L + pw / 2, T + ph + tk * 2.9, "Proportion f de poissons marqués (sans unité)", "middle", Math.max(16, F * 0.8), `font-weight="700"`));
    if (n) { const h = 1 / Math.sqrt(n), lo = Math.max(0, f - h), hi = Math.min(1, f + h), y = T + ph / 2;
      g.push(`<rect x="${X(lo).toFixed(1)}" y="${(y - F * 0.4).toFixed(1)}" width="${(X(hi) - X(lo)).toFixed(1)}" height="${(F * 0.8).toFixed(1)}" rx="6" style="fill:var(--accent);opacity:.3;stroke:var(--accent);stroke-width:2"/>`);
      g.push(`<circle cx="${X(f).toFixed(1)}" cy="${y.toFixed(1)}" r="${(F * 0.32).toFixed(1)}" style="fill:var(--accent)"/>`);
      g.push(sT(X(lo) + 4, T - F * 0.4, fmt(Math.round((f - h) * 1000) / 1000), "end", tk, `font-weight="700"`) + sT(X(hi) - 4, T - F * 0.4, fmt(Math.round((f + h) * 1000) / 1000), "start", tk, `font-weight="700"`)); }
    return `<svg viewBox="0 0 ${W} ${H.toFixed(0)}" width="${W}" height="${H.toFixed(0)}" role="img" aria-label="Intervalle autour de f = 0,30">${g.join("")}</svg>`;
  });
  function paint() {
    $$("[data-rn]", el).forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.rn === n)));
    $("[data-ro]", el).innerHTML = n ? `n = ${fmt(n)} : 1/√n = 1 ÷ ${fmt(Math.round(Math.sqrt(n) * 100) / 100)} ≈ <b>${fmt(Math.round(1 / Math.sqrt(n) * 1000) / 1000)}</b> · intervalle [${fmt(Math.round((f - 1 / Math.sqrt(n)) * 1000) / 1000)} ; ${fmt(Math.round((f + 1 / Math.sqrt(n)) * 1000) / 1000)}]` : "Choisis une taille d'échantillon n.";
    const V = RN.filter(v => x.rv.includes(v));
    $("[data-tab]", el).innerHTML = V.length ? tbl(["n", "√n", "1/√n", "Intervalle pour f = 0,30", "Largeur"], V.map(v => { const h = 1 / Math.sqrt(v); return [fmt(v), fmt(Math.round(Math.sqrt(v) * 100) / 100), fmt(Math.round(h * 1000) / 1000), `[${fmt(Math.round((f - h) * 1000) / 1000)} ; ${fmt(Math.round((f + h) * 1000) / 1000)}]`, fmt(Math.round(2 * h * 1000) / 1000)]; })) : "";
    chart.draw();
  }
  $$("[data-rn]", el).forEach(b => b.onclick = () => { n = x.rn = +b.dataset.rn; if (!x.rv.includes(n)) x.rv.push(n); keep(); paint(); b.focus(); });
  paint();
};

/* ---------- récapitulatif (dernière étape) et tableaux du bilan ---------- */
function runsTable() {
  const R = runs(); if (!R.length) return `<p class="locked">Aucune simulation dans le laboratoire pour l'instant.</p>`;
  return tbl(["Simulation", "Protocole", "N̂ estimé", "N réel", "Écart", "Conditions"], R.slice(-12).map(r => [`n° ${r.id}`, `n₁ = ${r.n1} · n₂ = ${r.n2}${r.k > 1 ? ` · ${r.k} recaptures` : ""}`, r.est === null ? "impossible" : nI(r.est), nI(r.N), r.err === null ? "—" : pc(r.err), condTxt(r)]));
}
WID.recap = el => { el.innerHTML = `<p class="kicker">Mes CMR dans le laboratoire</p>${runsTable()}<p class="kicker">Mes séries de 50 CMR</p>${fluTable(false)}${series().length ? fluTable(true) : ""}`; };
