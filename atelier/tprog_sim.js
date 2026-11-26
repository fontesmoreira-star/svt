/* ===== 5e EIST · Mission 6 · Activité 3 · Thymio virtuel : blocs, scènes, simulation et tests automatiques des défis (aucun affichage ici) ===== */
const TCOL = { rouge: "#e53935", vert: "#43a047", bleu: "#1e88e5", violet: "#8e24aa", jaune: "#fdd835", blanc: "#f4f6f8" };
const COLS = ["rouge", "vert", "bleu", "violet", "jaune", "blanc", "eteint"];
const CNAME = { rouge: "rouge", vert: "vert", bleu: "bleu", violet: "violet", jaune: "jaune", blanc: "blanc", eteint: "éteint" };
/* événements : « lorsque … » */
const EVS = {
  b_av: { g: "t", i: "▲", t: "le bouton avant est touché" }, b_ar: { g: "t", i: "▼", t: "le bouton arrière est touché" },
  b_g: { g: "t", i: "◀", t: "le bouton gauche est touché" }, b_d: { g: "t", i: "▶", t: "le bouton droit est touché" }, b_c: { g: "t", i: "●", t: "le bouton central est touché" },
  choc: { g: "c", i: "👋", t: "un choc est détecté (on tape sur le dos)" },
  p_dev: { g: "p", i: "⬆", t: "un objet est détecté devant" }, p_g: { g: "p", i: "↖", t: "un objet est détecté à gauche" }, p_d: { g: "p", i: "↗", t: "un objet est détecté à droite" },
  p_der: { g: "p", i: "⬇", t: "un objet est détecté derrière" }, p_rien: { g: "p", i: "∅", t: "rien n'est détecté devant" },
  s_nn: { g: "s", i: "⚫⚫", t: "les deux capteurs au sol voient du noir" }, s_bn: { g: "s", i: "⚪⚫", t: "seul le capteur au sol gauche voit du blanc" },
  s_nb: { g: "s", i: "⚫⚪", t: "seul le capteur au sol droit voit du blanc" }, s_bb: { g: "s", i: "⚪⚪", t: "les deux capteurs au sol voient du blanc" } };
const EVG = { t: "👆 Les touches", c: "👋 Le choc", p: "📡 Les capteurs de proximité", s: "🔦 Les capteurs au sol" };
/* actions */
const ACTS = { m_av: { g: "m", i: "⬆", t: "rouler en avant" }, m_ar: { g: "m", i: "⬇", t: "rouler en arrière" }, m_g: { g: "m", i: "↶", t: "tourner à gauche" }, m_d: { g: "m", i: "↷", t: "tourner à droite" }, m_st: { g: "m", i: "⏹", t: "arrêter les moteurs" },
  son: { g: "s", i: "🔊", t: "jouer un bip" } };
COLS.forEach(c => { ACTS["d_" + c] = { g: "d", c, i: "💡", t: c === "eteint" ? "éteindre le dos" : `allumer le dos en ${CNAME[c]}` }; ACTS["v_" + c] = { g: "v", c, i: "💡", t: c === "eteint" ? "éteindre le ventre" : `allumer le ventre en ${CNAME[c]}` }; });
const ACG = { m: "⚙ Les moteurs (roues)", d: "💡 La LED du dessus : le dos", v: "💡 La LED du dessous : le ventre", s: "🔊 Le haut-parleur" };
const evTxt = e => EVS[e] ? EVS[e].t : "…", acTxt = a => ACTS[a] ? ACTS[a].t : "…";
const lq = t => (/^[aeiouyéè]/i.test(t) ? "LORSQU'" : "LORSQUE ") + t;
const progLines = prog => (prog || []).map(b => `${lq(evTxt(b.e))} ALORS ${b.a.length ? b.a.map(acTxt).join(" et ") : "…"}`);

/* ---------- scènes (unités : largeur du robot = 1 ; y vers le bas) ---------- */
const rectSegs = (x1, y1, x2, y2) => [[x1, y1, x2, y1], [x2, y1, x2, y2], [x2, y2, x1, y2], [x1, y2, x1, y1]];
const STAD = (() => { const P = [], cx = 5, cy = 3.6, L = 2.2, R = 1.85, n = 40; for (let i = 0; i <= n; i++) P.push([cx - L + 2 * L * i / n, cy + R]); for (let i = 1; i <= n; i++) { const a = Math.PI / 2 - Math.PI * i / n; P.push([cx + L + R * Math.cos(a), cy + R * Math.sin(a)]); }
  for (let i = 1; i <= n; i++) P.push([cx + L - 2 * L * i / n, cy - R]); for (let i = 1; i <= n; i++) { const a = -Math.PI / 2 - Math.PI * i / n; P.push([cx - L + R * Math.cos(a), cy + R * Math.sin(a)]); } return P; })();
const SCENES = {
  bac: { W: 7, H: 4.9, start: { x: 3.5, y: 2.8, th: 0 }, walls: rectSegs(0, 0, 7, 4.9), objs: [], hands: true, name: "le bac d'essai" },
  trousses: { W: 8, H: 6.6, start: { x: 4, y: 3.3, th: 0 }, walls: rectSegs(0, 0, 8, 6.6), objs: [[2.9, 0.45, 5.1, 1.0, "trousse 1"], [2.9, 5.6, 5.1, 6.15, "trousse 2"]], name: "les deux trousses" },
  piste: { W: 10, H: 7.2, start: { x: 4.2, y: 5.45, th: 90 }, walls: rectSegs(0, 0, 10, 7.2), objs: [], line: STAD, loop: true, name: "la piste noire" },
  laby: { W: 10, H: 7, start: { x: 1.15, y: 5.6, th: 0 }, walls: [...rectSegs(0, 0, 10, 7), [2.3, 2.3, 2.3, 7], [2.3, 2.3, 7.7, 2.3], [7.7, 2.3, 7.7, 4.7], [4.6, 4.7, 7.7, 4.7]], objs: [], goal: [5.8, 2.45, 7.6, 4.6], name: "le labyrinthe" } };
SCENES.trousses.objs.forEach(o => { o.segs = rectSegs(o[0], o[1], o[2], o[3]); });

/* ---------- géométrie ---------- */
const SFR = [[-0.42, -0.36, -40], [-0.25, -0.55, -20], [0, -0.62, 0], [0.25, -0.55, 20], [0.42, -0.36, 40]], SRR = [[-0.28, 0.5, 190], [0.28, 0.5, 170]], SGR = [[-0.13, -0.44], [0.13, -0.44]];
const RANGE = 0.8, RBODY = 0.58, VMOT = 1.2, WMOT = 110, LWID = 0.6;
const wpt = (P, lx, ly) => { const c = Math.cos(P.th * Math.PI / 180), s = Math.sin(P.th * Math.PI / 180); return [P.x + lx * c - ly * s, P.y + lx * s + ly * c]; };
function rayHit(o, d, segs) { let best = Infinity; for (const g of segs) { const ex = g[2] - g[0], ey = g[3] - g[1], den = d[0] * ey - d[1] * ex; if (Math.abs(den) < 1e-9) continue; const qx = g[0] - o[0], qy = g[1] - o[1], t = (qx * ey - qy * ex) / den, u = (qx * d[1] - qy * d[0]) / den; if (t >= 0 && u >= 0 && u <= 1 && t < best) best = t; } return best; }
const dSeg = (p, g) => { const dx = g[2] - g[0], dy = g[3] - g[1], L = dx * dx + dy * dy; let t = L ? ((p[0] - g[0]) * dx + (p[1] - g[1]) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0] - g[0] - t * dx, p[1] - g[1] - t * dy); };
const dPoly = (p, P) => { let m = 1e9; for (let i = 1; i < P.length; i++) { const d = dSeg(p, [P[i - 1][0], P[i - 1][1], P[i][0], P[i][1]]); if (d < m) m = d; } return m; };

/* ---------- simulation ---------- */
function mkSim(sceneKey, prog, start) {
  const sc = SCENES[sceneKey];
  return { key: sceneKey, sc, prog, P: { ...(start || sc.start) }, v: 0, w: 0, top: "eteint", bot: "eteint", beep: 0, t: 0, nextS: 0, hands: [], f: [0, 0, 0, 0, 0], r: [0, 0], g: [1, 1], bumped: 0, bumpT: 0, fired: [], lastEv: null };
}
const simSegs = sim => { const out = sim.sc.walls.slice(); (sim.sc.objs || []).forEach(o => out.push(...o.segs)); sim.hands.forEach(h => out.push(...rectSegs(h[0] - 0.3, h[1] - 0.3, h[0] + 0.3, h[1] + 0.3))); return out; };
function doAct(sim, a) {
  const A = ACTS[a]; if (!A) return;
  if (a === "m_av") { sim.v = VMOT; sim.w = 0; } else if (a === "m_ar") { sim.v = -VMOT; sim.w = 0; } else if (a === "m_g") { sim.v = 0; sim.w = -WMOT; } else if (a === "m_d") { sim.v = 0; sim.w = WMOT; } else if (a === "m_st") { sim.v = 0; sim.w = 0; }
  else if (a === "son") sim.beep = 0.5; else if (A.g === "d") sim.top = A.c; else if (A.g === "v") sim.bot = A.c;
}
function fire(sim, e) { let any = false; sim.prog.forEach(b => { if (b.e === e) { b.a.forEach(a => doAct(sim, a)); any = true; } }); if (any) sim.lastEv = e; return any; }
function sense(sim) {
  const segs = simSegs(sim), P = sim.P;
  sim.f = SFR.map(s => { const o = wpt(P, s[0], s[1]), a = (P.th + s[2]) * Math.PI / 180; return rayHit(o, [Math.sin(a), -Math.cos(a)], segs) <= RANGE ? 1 : 0; });
  sim.r = SRR.map(s => { const o = wpt(P, s[0], s[1]), a = (P.th + s[2]) * Math.PI / 180; return rayHit(o, [Math.sin(a), -Math.cos(a)], segs) <= RANGE ? 1 : 0; });
  sim.g = SGR.map(s => sim.sc.line && dPoly(wpt(P, s[0], s[1]), sim.sc.line) <= LWID / 2 ? 1 : 0); /* 1 = noir */
}
function conds(sim) {
  const f = sim.f, dev = f[2] || (f[1] && f[3]), g = f[0] || (f[1] && !f[3]), d = f[4] || (f[3] && !f[1]), G = sim.g;
  return { p_dev: !!dev, p_g: !!g, p_d: !!d, p_der: !!(sim.r[0] || sim.r[1]), p_rien: !f.some(Boolean), s_nn: !!(G[0] && G[1]), s_bn: !!(!G[0] && G[1]), s_nb: !!(G[0] && !G[1]), s_bb: !!(!G[0] && !G[1]) };
}
function simStep(sim, h) {
  sim.t += h; sim.beep = Math.max(0, sim.beep - h);
  if (sim.t >= sim.nextS) { sim.nextS = sim.t + 0.1; sense(sim); const C = conds(sim); sim.fired = []; sim.prog.forEach(b => { if (C[b.e]) { b.a.forEach(a => doAct(sim, a)); sim.fired.push(b); sim.lastEv = b.e; } }); }
  const P = sim.P, th = P.th + sim.w * h, a = th * Math.PI / 180, nx = P.x + sim.v * Math.sin(a) * h, ny = P.y - sim.v * Math.cos(a) * h;
  const segs = simSegs(sim);
  if (sim.v && segs.some(g => dSeg([nx, ny], g) < RBODY)) { P.th = th; sim.bumped += h; sim.bumpT += h; } else { P.x = nx; P.y = ny; P.th = th; sim.bumpT = 0; }
}
function addHand(sim, where) {
  const P = sim.P, off = { dev: [0, -1.35], g: [-1.0, -0.95], d: [1.0, -0.95], der: [0, 1.25] }[where]; if (!off) { sim.hands = []; return; }
  sim.hands = [wpt(P, off[0], off[1])];
}
/* ---------- tests automatiques des défis : renvoient { ok, lines: [[bool, texte]] } ---------- */
const run = (sim, T, h) => { const n = Math.round(T / (h || 1 / 60)); for (let i = 0; i < n; i++) simStep(sim, h || 1 / 60); };
const ARROWS = [["b_av", "▲ avant"], ["b_ar", "▼ arrière"], ["b_g", "◀ gauche"], ["b_d", "▶ droite"]];
/* diagnostic d'un robot qui n'a pas réussi */
const diag = sim => sim.bumpT > 1.5 ? "Le robot est bloqué contre un obstacle : quel capteur le détecte ? Y a-t-il un bloc pour cette situation ?" : sim.v === 0 && sim.w !== 0 ? "Le robot tourne sur lui-même sans s'arrêter : quelle action le remettrait en route ?" : sim.v === 0 ? "Le robot s'est arrêté : quel bloc a déclenché « arrêter les moteurs » ?" : "Observe-le dans la simulation pour comprendre ce qui se passe.";
const MOT = sim => sim.v > 0 ? "m_av" : sim.v < 0 ? "m_ar" : sim.w < 0 ? "m_g" : sim.w > 0 ? "m_d" : "m_st";
const DEFIS = {
  d1: { scene: "bac", test(prog) {
    const L = [], cols = []; const sim = mkSim("bac", prog);
    ARROWS.forEach(([e, n]) => { const before = sim.top; fire(sim, e); run(sim, 0.3); const c = sim.top; cols.push(c); L.push([c !== "eteint", c !== "eteint" ? `Bouton ${n} : le dos devient ${CNAME[c]}.` : `Bouton ${n} : le dos ne s'allume pas.`]); });
    const distinct = new Set(cols.filter(c => c !== "eteint")).size === 4; L.push([distinct, distinct ? "Quatre couleurs différentes : une par flèche." : "Il faut une couleur différente pour chaque flèche."]);
    return { ok: L.every(x => x[0]), lines: L }; } },
  d2: { scene: "bac", test(prog) {
    const L = [], n = prog.filter(b => b.e === "b_av").length; L.push([n === 1, n === 1 ? "Un seul bloc pour le bouton avant." : n ? `Il y a ${n} blocs pour le bouton avant : regroupe les actions dans un seul bloc.` : "Aucun bloc ne réagit au bouton avant."]);
    const sim = mkSim("bac", prog); fire(sim, "b_av"); run(sim, 0.3);
    L.push([sim.top === "rouge", sim.top === "rouge" ? "Le dos devient rouge." : `Le dos ${sim.top === "eteint" ? "ne s'allume pas" : "devient " + CNAME[sim.top]}.`]);
    L.push([sim.bot === "rouge", sim.bot === "rouge" ? "Le ventre devient rouge." : `Le ventre ${sim.bot === "eteint" ? "ne s'allume pas" : "devient " + CNAME[sim.bot]}.`]);
    return { ok: L.every(x => x[0]), lines: L }; } },
  d3: { scene: "bac", test(prog) {
    const L = [], want = { b_av: ["m_av", "bleu", "il avance", "bleu"], b_ar: ["m_ar", "violet", "il recule", "violet"], b_d: ["m_d", "vert", "il tourne à droite", "vert"], b_g: ["m_g", "rouge", "il tourne à gauche", "rouge"] };
    ARROWS.forEach(([e, n]) => { const sim = mkSim("bac", prog); fire(sim, e); run(sim, 0.25); const w = want[e], m = MOT(sim) === w[0], c = sim.top === w[1];
      L.push([m && c, `Bouton ${n} : ${m ? w[2] : "il devrait : " + w[2]}${c ? ", dos " + w[3] : ", le dos devrait être " + w[3]}.`]); });
    const sim = mkSim("bac", prog); fire(sim, "b_av"); run(sim, 0.3); fire(sim, "choc"); const beep = sim.beep > 0; run(sim, 0.3); const st = MOT(sim) === "m_st";
    L.push([st, st ? "Tape sur le dos : le robot s'arrête." : "Tape sur le dos : le robot devrait s'arrêter."]);
    L.push([beep, beep ? "Il émet un son." : "Il devrait émettre un son en s'arrêtant."]);
    L.push([sim.top === "blanc", sim.top === "blanc" ? "Son dos s'allume en blanc." : "Son dos devrait s'allumer en blanc."]);
    return { ok: L.every(x => x[0]), lines: L }; } },
  d4: { scene: "trousses", test(prog) {
    const L = [], sim = mkSim("trousses", prog); run(sim, 1); const still = Math.hypot(sim.P.x - sim.sc.start.x, sim.P.y - sim.sc.start.y) < 0.05;
    L.push([still, still ? "Avant d'appuyer sur un bouton, le robot attend." : "Le robot part tout seul : il doit attendre qu'on appuie sur le bouton avant."]);
    fire(sim, "b_av"); let dir = 0, flips = 0, py = sim.P.y, run1 = 0; for (let i = 0; i < 24 * 60; i++) { simStep(sim, 1 / 60); const dy = sim.P.y - py; py = sim.P.y; run1 += Math.abs(dy); const d = dy < -1e-4 ? -1 : dy > 1e-4 ? 1 : 0; if (d && d !== dir) { if (dir && run1 >= 1) flips++; if (!dir || run1 >= 1) { dir = d; run1 = 0; } } }
    const moved = flips >= 1 || dir !== 0, ar = flips >= 4;
    L.push([moved, moved ? "Bouton avant : le robot se met en marche." : "Bouton avant : le robot ne démarre pas."]);
    L.push([ar, ar ? `Il fait des allers-retours entre les trousses (${Math.floor(flips / 2)} allers-retours en 24 secondes).` : flips ? "Il change de sens, mais ne fait pas d'allers-retours sans fin : il reste bloqué contre une trousse." : "Il ne fait pas demi-tour devant les trousses."]);
    fire(sim, "b_ar"); run(sim, 0.4); const x0 = sim.P.y; run(sim, 2); const stop = Math.abs(sim.P.y - x0) < 0.02 && MOT(sim) === "m_st";
    L.push([stop, stop ? "Bouton arrière : le robot s'arrête." : "Bouton arrière : le robot devrait s'arrêter."]);
    return { ok: L.every(x => x[0]), lines: L }; } },
  d5: { scene: "piste", test(prog) {
    const L = [], P = SCENES.piste.line, N = P.length - 1;
    const near = p => { let b = 0, m = 1e9; P.forEach((q, i) => { const d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d < m) { m = d; b = i; } }); return b; };
    [[SCENES.piste.start, "dans un sens", 1], [{ x: 5.8, y: 5.45, th: 270 }, "dans l'autre sens", -1]].forEach(([st, lab, sg]) => {
      const sim = mkSim("piste", prog, st); fire(sim, "b_av"); let idx = near([sim.P.x, sim.P.y]), prog2 = 0, lost = false;
      for (let i = 0; i < 40 * 60; i++) { simStep(sim, 1 / 60); if (i % 6) continue; if (dPoly([sim.P.x, sim.P.y], P) > 1.2) { lost = true; break; } const j = near([sim.P.x, sim.P.y]); let d = j - idx; if (d > N / 2) d -= N; if (d < -N / 2) d += N; prog2 += sg * d; idx = j; if (prog2 >= N) break; }
      const pc = Math.max(0, Math.min(100, Math.round(prog2 / N * 100))), ok = prog2 >= N;
      L.push([ok, ok ? `Piste parcourue ${lab} : le robot fait le tour complet en suivant la ligne.` : lost ? `Piste parcourue ${lab} : le robot quitte la ligne (après ${pc} % du tour).` : `Piste parcourue ${lab} : le robot ne fait pas le tour en 40 secondes (${pc} % du tour). ${diag(sim)}`]);
    });
    return { ok: L.every(x => x[0]), lines: L }; } },
  laby: { scene: "laby", test(prog) {
    const L = [], sim = mkSim("laby", prog), G = sim.sc.goal; fire(sim, "b_av"); let ok = false;
    for (let i = 0; i < 120 * 60; i++) { simStep(sim, 1 / 60); if (sim.P.x > G[0] && sim.P.x < G[2] && sim.P.y > G[1] && sim.P.y < G[3]) { ok = true; break; } }
    L.push([ok, ok ? `Le robot traverse le labyrinthe et arrive aux panneaux solaires en ${Math.round(sim.t)} secondes, sans aide.` : `En 2 minutes, le robot n'arrive pas aux panneaux solaires. ${diag(sim)}`]);
    return { ok, lines: L, t: sim.t }; } } };
