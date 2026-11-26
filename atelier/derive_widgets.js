/* ===== 2nde SVT · Thème 1 · Chapitre 3 · Activité 4 « La dérive génétique » : simulations =====
   1. Une petite population (10 individus) génération après génération : chaque descendant reçoit deux allèles tirés au hasard
      parmi ceux des parents (modèle de Wright-Fisher), animation des tirages et courbe de fréquence.
   2. Simulateur de génétique des populations (inspiré du « Population Genetics Explorer » de HHMI BioInteractive) :
      effectif 10 à 10 000, 100 générations, 1 ou 10 simulations, courbes, tableau et résumé par effectif.
   3. Goulot d'étranglement (guépard) : six allèles d'un gène, crise démographique de 10 générations, allèles perdus.
   Toutes les valeurs sont simulées (tirages aléatoires) et signalées ⚠. */
Store.key = "svt2-derive-genetique-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const N1 = x => (+x).toFixed(1);
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const ez = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const LP = (a, b, t) => a + (b - a) * t;
const RMO = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
const s14 = F => Math.max(15, TK(F) * .9);
function tx(x, y, s, o) {
  o = o || {};
  const halo = o.h ? `;paint-order:stroke;stroke:${o.hc || "var(--surface)"};stroke-width:${N1(o.s * .3)}px;stroke-linejoin:round` : "";
  return `<text x="${N1(x)}" y="${N1(y)}" text-anchor="${o.a || "middle"}" style="fill:${o.c || "var(--ink)"};font-size:${N1(o.s)}px;font-weight:${o.w || 700}${o.op !== undefined ? ";opacity:" + N1(o.op) : ""}${halo}">${esc(s)}</text>`;
}
const segH = (name, opts, cur, attr) => `<div class="seg" role="group" aria-label="${name}">${opts.map(([k, lab]) => `<button type="button" data-${attr}="${k}" aria-pressed="${String(k) === String(cur)}">${lab}</button>`).join("")}</div>`;
function bindSeg(host, attr, fn) { $$(`[data-${attr}]`, host).forEach(b => b.onclick = () => { $$(`[data-${attr}]`, host).forEach(c => c.setAttribute("aria-pressed", String(c === b))); fn(b.dataset[attr]); }); }
const svgW = (W, H, label, g) => `<svg viewBox="0 0 ${N1(W)} ${N1(H)}" width="${N1(W)}" height="${N1(H)}" role="img" aria-label="${esc(label)}">${g}</svg>`;
function tween(ms, onT, done) { if (RMO) { onT(1); if (done) done(); return; } let t0 = 0; const f = ts => { if (!t0) t0 = ts; const t = Math.min(1, (ts - t0) / ms); onT(t); if (t < 1) requestAnimationFrame(f); else if (done) done(); }; requestAnimationFrame(f); }
const pct = v => fmt(Math.round(v * 10) / 10);
const sw = c => `<span class="sq" style="background:${c}"></span>`;

/* ---------- tirages aléatoires ---------- */
const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
function binom(n, p) { if (p <= 0) return 0; if (p >= 1) return n; if (n <= 2000) { let k = 0; for (let i = 0; i < n; i++) if (Math.random() < p) k++; return k; } return cl(Math.round(n * p + Math.sqrt(n * p * (1 - p)) * gauss()), 0, n); }
/* génération suivante (Wright-Fisher) : 2N copies du gène tirées au hasard dans le pool des parents */
const nextFreq = (p, N) => binom(2 * N, p) / (2 * N);
function multiNext(P, N) { const n = 2 * N; let rest = n, acc = 1; const out = P.map((p, i) => { if (i === P.length - 1) return rest; const k = acc > 0 ? binom(rest, cl(p / acc, 0, 1)) : 0; rest -= k; acc -= p; return k; }); return out.map(k => k / n); }

/* ---------- graphique commun (fréquence en % au fil des générations) ---------- */
function frame(W, H, F, o) {
  const s = s14(F), L = F * 3.2, R = F * .9, T = F * (o.top || .9), B = F * 3, pw = W - L - R, ph = H - T - B, X = g => L + g / o.gx * pw, Y = v => T + ph - (v - (o.y0 || 0)) / ((o.y1 || 100) - (o.y0 || 0)) * ph;
  let g = "";
  (o.yt || [0, 25, 50, 75, 100]).forEach(v => g += `<line x1="${N1(L)}" y1="${N1(Y(v))}" x2="${N1(L + pw)}" y2="${N1(Y(v))}" style="stroke:var(--line);stroke-width:1"/><text x="${N1(L - 6)}" y="${N1(Y(v) + s * .34)}" text-anchor="end" style="fill:var(--ink);font-size:${N1(s)}px">${v}</text>`);
  const step = o.xs || (o.gx <= 30 ? 5 : o.gx <= 60 ? 10 : 20);
  for (let v = 0; v <= o.gx; v += step) g += `<line x1="${N1(X(v))}" y1="${N1(T + ph)}" x2="${N1(X(v))}" y2="${N1(T + ph + 5)}" style="stroke:var(--ink)"/><text x="${N1(X(v))}" y="${N1(T + ph + s * 1.25)}" text-anchor="middle" style="fill:var(--ink);font-size:${N1(s)}px">${v}</text>`;
  g += `<line x1="${N1(L)}" y1="${N1(T + ph)}" x2="${N1(L + pw)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${N1(L)}" y1="${N1(T)}" x2="${N1(L)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5"/>`;
  g += tx(L + pw / 2, H - s * .35, o.xl || "Génération", { s, c: "var(--muted)", w: 600 }) + `<text transform="rotate(-90 ${N1(s * .95)} ${N1(T + ph / 2)})" x="${N1(s * .95)}" y="${N1(T + ph / 2)}" text-anchor="middle" style="fill:var(--ink);font-size:${N1(s * .9)}px;font-weight:600">${esc(o.yl)}</text>`;
  return { g, X, Y, L, T, pw, ph, s };
}
const pathOf = (arr, X, Y, n) => arr.slice(0, n === undefined ? arr.length : n).map((v, i) => (i ? "L" : "M") + N1(X(i)) + "," + N1(Y(v))).join("");

/* =====================================================================
   1. Une petite population, génération après génération
   ===================================================================== */
const AC = ["var(--c1)", "var(--c2)"], AN = ["A1", "A2"], NU = 10;
const enc = pop => pop.map(([a, b]) => a + "" + b).join(""), dec = s => Array.from({ length: s.length / 2 }, (_, i) => [+s[2 * i], +s[2 * i + 1]]);
const countA1 = s => s.split("").filter(c => c === "0").length;
function pop50() { const a = [...Array(NU).fill(0), ...Array(NU).fill(1)]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return enc(Array.from({ length: NU }, (_, i) => [a[2 * i], a[2 * i + 1]])); }
const urFix = s => { const n = countA1(s); return n === 0 ? 1 : n === 2 * NU ? 0 : -1; };
function urLayout(W, F) {
  const cols = W < 560 ? 5 : 10, rows = NU / cols, cw = (W - 12) / cols, ch = Math.max(F * 3.3, 62), lab = s14(F) * 1.6, blk = rows * ch + lab;
  const pos = (blkI, i) => { const c = i % cols, r = Math.floor(i / cols), x0 = 6 + c * cw, y0 = blkI * (blk + F * .6) + lab + r * ch; return { x0, y0, cx: x0 + cw / 2, cw, ch, al: [[x0 + cw / 2 - cw * .14, y0 + ch * .34], [x0 + cw / 2 + cw * .14, y0 + ch * .34]] }; };
  return { cols, rows, cw, ch, lab, blk, H: 2 * blk + F * .6 + 4, pos };
}
function indiv(P, gen, k, F, ghost) {
  const s = s14(F), bw = Math.max(9, P.cw * .13), bh = P.ch * .46, y = P.y0 + P.ch * .1;
  let g = `<rect x="${N1(P.x0 + 4)}" y="${N1(P.y0 + 3)}" width="${N1(P.cw - 8)}" height="${N1(P.ch - 6)}" rx="10" style="fill:var(--surface);stroke:var(--line);stroke-width:1.5${ghost ? ";opacity:.45" : ""}"/>`;
  if (!gen) return g;
  gen.forEach((a, j) => { const [cx] = P.al[j]; g += `<rect x="${N1(cx - bw / 2)}" y="${N1(y)}" width="${N1(bw)}" height="${N1(bh)}" rx="${N1(bw / 2)}" style="fill:var(--surface-2);stroke:var(--ink);stroke-width:1.2"/><rect x="${N1(cx - bw / 2 + 1)}" y="${N1(y + bh * .28)}" width="${N1(bw - 2)}" height="${N1(bh * .26)}" style="fill:${AC[a]}"/>`; });
  g += tx(P.cx, P.y0 + P.ch * .84, gen.map(a => AN[a]).join(" "), { s: s * .86, c: "var(--ink)" });
  return g;
}
WID.urne = host => {
  const x = xst(); x.ur = x.ur || {}; if (!x.ur.g || !x.ur.g.length) x.ur.g = [pop50()]; x.ur.nf = x.ur.nf || 0; x.ur.fx = x.ur.fx || [];
  let fly = null, busy = false;
  host.innerHTML = `<div class="mleg">${sw(AC[0])}allèle A1${sw(AC[1])}allèle A2<span>Chaque individu porte deux exemplaires du gène (deux chromosomes homologues).</span></div><div class="figbox ur-p"></div>
    <div class="row"><button type="button" class="btn" data-ug="1">▶ Génération suivante</button><button type="button" class="btn ghost" data-ug="10">⏩ 10 générations</button><button type="button" class="btn ghost" data-ur>↺ Nouvelle population (50 %)</button></div>
    <p class="readout ur-ro" aria-live="polite"></p><div class="figbox ur-c"></div><div class="ur-t"></div><div class="ur-k"></div>`;
  const fp = liveSVG($(".ur-p", host), (W, F) => {
    const Lo = urLayout(W, F), G = x.ur.g, n = G.length, par = n > 1 ? dec(G[n - 2]) : null, kid = dec(G[n - 1]), s = s14(F);
    let g = tx(6, Lo.lab * .62, n > 1 ? `Parents (gén. ${n - 2}) · A1 = ${pct(countA1(G[n - 2]) / 20 * 100)} %` : (W < 560 ? "Parents : à la reproduction" : "Parents : ils apparaîtront ici à la première reproduction"), { s, a: "start", c: n > 1 ? "var(--ink)" : "var(--muted)" });
    g += tx(6, Lo.blk + F * .6 + Lo.lab * .62, `${n > 1 ? "Descendants" : "Individus"} (gén. ${n - 1}) · A1 = ${pct(countA1(G[n - 1]) / 20 * 100)} %`, { s, a: "start" });
    for (let i = 0; i < NU; i++) { g += indiv(Lo.pos(0, i), par ? par[i] : null, i, F, !par); g += indiv(Lo.pos(1, i), fly && fly.t < 1 ? null : kid[i], i, F); }
    if (fly) fly.src.forEach((src, k) => { const t = cl(fly.t * 1.6 - (k / 20) * .6, 0, 1); if (t <= 0) return; const a = Lo.pos(0, Math.floor(src / 2)).al[src % 2], b = Lo.pos(1, Math.floor(k / 2)).al[k % 2], e = ez(t);
      g += `<circle cx="${N1(LP(a[0], b[0], e))}" cy="${N1(LP(a[1], b[1], e) - Math.sin(Math.PI * e) * 14)}" r="${N1(Math.max(6, F * .32))}" style="fill:${AC[kid[Math.floor(k / 2)][k % 2]]};stroke:var(--ink);stroke-width:1.2"/>`; });
    return svgW(W, Lo.H, `Génération ${n - 1} : ${countA1(G[n - 1])} allèles A1 sur 20.`, g);
  });
  const fc = liveSVG($(".ur-c", host), (W, F) => {
    const H = cl(W * .5, F * 9, F * 13), h = x.ur.g.map(s => countA1(s) / 20 * 100), gx = Math.max(30, Math.ceil((h.length - 1) / 10) * 10), fr = frame(W, H, F, { gx, yl: "Fréquence de A1 (%)" });
    let g = fr.g + `<path d="${pathOf(h, fr.X, fr.Y)}" style="fill:none;stroke:var(--c1);stroke-width:3"/>`;
    h.forEach((v, i) => g += `<circle cx="${N1(fr.X(i))}" cy="${N1(fr.Y(v))}" r="3.5" style="fill:var(--c1)"/>`);
    return svgW(W, H, `Fréquence de l'allèle A1 au fil des générations : ${h.map(pct).join(" ; ")} %.`, g);
  });
  const ro = () => {
    const G = x.ur.g, last = G[G.length - 1], f = urFix(last), n1 = countA1(last);
    $(".ur-ro", host).innerHTML = nb(f >= 0 ? `<b>Génération ${G.length - 1}</b> : l'allèle <b>${AN[f]}</b> est <b>fixé</b> (100 %) ; l'allèle ${AN[1 - f]} a <b>disparu</b>. Il ne peut plus réapparaître : plus aucun parent ne le porte.` : `<b>Génération ${G.length - 1}</b> : ${n1} allèles A1 et ${20 - n1} allèles A2 sur 20, soit A1 = ${pct(n1 / 20 * 100)} % et A2 = ${pct(100 - n1 / 20 * 100)} %.`);
    $(".ur-t", host).innerHTML = `<details class="tbl"><summary>Tableau des fréquences</summary><div class="fit"><table class="t"><thead><tr><th>Génération</th><th>Allèles A1 (sur 20)</th><th>Fréquence de A1</th><th>Fréquence de A2</th></tr></thead><tbody>${G.map((s, i) => { const n = countA1(s); return `<tr><td>${i}</td><td>${n}</td><td>${pct(n / 20 * 100)} %</td><td>${pct(100 - n / 20 * 100)} %</td></tr>`; }).join("")}</tbody></table></div></details>`;
    $(".ur-k", host).innerHTML = `<p class="task ${x.ur.nf ? "is-ok" : ""}">${x.ur.nf ? "✓" : "○"} Allèle fixé dans ${x.ur.nf} population(s)${x.ur.fx.length ? ` · génération(s) de fixation : ${x.ur.fx.join(", ")}` : ""}</p>`;
  };
  const step = anim => {
    const G = x.ur.g, par = dec(G[G.length - 1]), all = par.flat(), src = Array.from({ length: 20 }, () => Math.floor(Math.random() * 20)), kid = Array.from({ length: NU }, (_, i) => [all[src[2 * i]], all[src[2 * i + 1]]]), s = enc(kid);
    const wasFixed = urFix(G[G.length - 1]) >= 0;
    G.push(s); if (G.length > 400) G.splice(1, G.length - 400);
    if (!wasFixed && urFix(s) >= 0) { x.ur.nf++; x.ur.fx.push(G.length - 1); }
    keep(); return { src };
  };
  const refresh = () => { fp.draw(); fc.draw(); ro(); };
  const lock = b => { busy = b; $$("[data-ug],[data-ur]", host).forEach(e => e.disabled = b); };
  $$("[data-ug]", host).forEach(b => b.onclick = () => {
    if (busy) return; const n = +b.dataset.ug;
    if (n === 1) { lock(true); const { src } = step(); fly = { src, t: 0 }; tween(1500, t => { fly.t = t; fp.draw(); }, () => { fly = null; refresh(); lock(false); }); }
    else { lock(true); let k = 0; const go = () => { step(); refresh(); if (++k < n) setTimeout(go, RMO ? 0 : 160); else lock(false); }; go(); }
  });
  $("[data-ur]", host).onclick = () => { if (busy) return; x.ur.g = [pop50()]; keep(); refresh(); };
  refresh();
};

/* =====================================================================
   2. Le simulateur : 100 générations, effectif au choix
   ===================================================================== */
const SIMC = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
const NG = 100;
function runSim(N) { const a = [50]; let p = .5; for (let g = 1; g <= NG; g++) { p = nextFreq(p, N); a.push(Math.round(p * 1000) / 10); } return a; }
const simRuns = N => ((xst().sim || {}).r || {})[N] || [];
const lost = a => a[a.length - 1] === 0 || a[a.length - 1] === 100;
const firstLost = a => a.findIndex(v => v === 0 || v === 100);
const nfmt = n => String(n).replace(/(\d)(\d{3})$/, "$1\u202f$2");
function mkSim(sizes, def) {
  return host => {
    const x = xst(); x.sim = x.sim || {}; x.sim.r = x.sim.r || {};
    let N = def, anim = null, busy = false;
    host.innerHTML = `<div class="pg-top"><span class="pg-logo">Population <b>Genetics</b> Explorer</span><span class="pg-path">Simulateur inspiré de HHMI BioInteractive · un gène, deux allèles A1 et A2</span></div>
      <div class="sim-set"><p><b>Fréquence initiale de A1</b> : 50 %</p><p><b>Nombre de générations</b> : 100</p>${sizes.length > 1 ? `<div><b>Effectif de la population</b> ${segH("Effectif de la population", sizes.map(n => [n, nfmt(n) + " individus"]), def, "sz")}</div>` : `<p><b>Effectif de la population</b> : ${nfmt(def)} individus</p>`}</div>
      <div class="row"><button type="button" class="btn" data-run="1">▶ Lancer 1 simulation</button><button type="button" class="btn" data-run="10">▶▶ Lancer 10 simulations</button><button type="button" class="btn ghost" data-clr>Effacer les courbes</button></div>
      <div class="figbox sim-f"></div><p class="cap"><span class="simw">⚠ Valeurs simulées</span> : chaque simulation est un nouveau tirage au hasard, tes courbes sont différentes de celles de tes voisins.</p><p class="readout sim-ro" aria-live="polite"></p><div class="sim-t"></div><div class="sim-s"></div>`;
    const fig = liveSVG($(".sim-f", host), (W, F) => {
      const H = cl(W * .58, F * 11, F * 16), fr = frame(W, H, F, { gx: NG, yl: "Fréquence de A1 (%)", xs: W < 480 ? 25 : 10 }), R = simRuns(N).slice(-10);
      let g = fr.g;
      R.forEach((a, i) => g += `<path d="${pathOf(a, fr.X, fr.Y)}" style="fill:none;stroke:${SIMC[i % 10]};stroke-width:2.2;stroke-linejoin:round;opacity:.92"/>`);
      if (anim) anim.runs.forEach((a, i) => { const k = R.length + i; g += `<path d="${pathOf(a, fr.X, fr.Y, Math.max(2, Math.round(anim.t * NG) + 1))}" style="fill:none;stroke:${SIMC[k % 10]};stroke-width:2.6;stroke-linejoin:round"/>`; });
      g += tx(fr.L + 8, fr.T + fr.s * 1.1, `${nfmt(N)} individus`, { s: fr.s, a: "start", h: 1 });
      return svgW(W, H, `Fréquence de l'allèle A1 pendant 100 générations, population de ${nfmt(N)} individus, ${R.length} simulation(s). Fréquences finales : ${R.map(a => pct(a[NG])).join(" ; ")} %.`, g);
    });
    const info = () => {
      const all = simRuns(N), R = all.slice(-10), off = all.length - R.length, nl = R.filter(lost).length;
      $(".sim-ro", host).innerHTML = nb(R.length ? `${nfmt(N)} individus · ${R.length} simulation(s) affichée(s) : un allèle a disparu dans <b>${nl}</b> d'entre elles${nl ? ` (le plus tôt à la génération ${Math.min(...R.filter(lost).map(firstLost))})` : ""}.` : "Lance des simulations : chaque courbe représente une population.");
      $(".sim-t", host).innerHTML = R.length ? `<div class="fit"><table class="t"><thead><tr><th>Simul.</th><th>A1 finale</th><th>A2 finale</th><th>Disparu ?</th></tr></thead><tbody>${R.map((a, i) => `<tr><td class="nw">${sw(SIMC[i % 10])}${off + i + 1}</td><td class="nw">${pct(a[NG])} %</td><td class="nw">${pct(100 - a[NG])} %</td><td>${a[NG] === 0 ? "oui (A1, gén. " + firstLost(a) + ")" : a[NG] === 100 ? "oui (A2, gén. " + firstLost(a) + ")" : "non"}</td></tr>`).join("")}</tbody></table></div>` : "";
      const S0 = sizes.filter(n => simRuns(n).length);
      $(".sim-s", host).innerHTML = S0.length ? `<p class="kicker">Résumé par effectif</p><div class="fit"><table class="t"><thead><tr><th>Effectif</th><th>Simul.</th><th>Disparitions</th><th>A1 finale (min – max)</th></tr></thead><tbody>${S0.map(n => { const A = simRuns(n), f = A.map(a => a[NG]); return `<tr><td class="nw">${nfmt(n)}</td><td>${A.length}</td><td>${A.filter(lost).length}</td><td>${pct(Math.min(...f))} à ${pct(Math.max(...f))} %</td></tr>`; }).join("")}</tbody></table></div>` : "";
    };
    const lockB = b => { busy = b; $$("[data-run],[data-clr],[data-sz]", host).forEach(e => e.disabled = b); };
    $$("[data-run]", host).forEach(b => b.onclick = () => {
      if (busy) return; const k = +b.dataset.run, runs = Array.from({ length: k }, () => runSim(N)); lockB(true); anim = { runs, t: 0 };
      tween(k > 1 ? 2400 : 1600, t => { anim.t = t; fig.draw(); }, () => { x.sim.r[N] = (x.sim.r[N] || []).concat(runs); anim = null; keep(); fig.draw(); info(); lockB(false); });
    });
    $("[data-clr]", host).onclick = () => { if (busy) return; x.sim.r[N] = []; keep(); fig.draw(); info(); };
    if (sizes.length > 1) bindSeg(host, "sz", k => { N = +k; fig.draw(); info(); });
    info();
  };
}
WID.simA = mkSim([10], 10);
WID.simB = mkSim([10, 100, 1000, 10000], 10000);

/* =====================================================================
   3. Goulot d'étranglement : le guépard
   ===================================================================== */
const GLC = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"], GL0 = [.3, .24, .18, .13, .09, .06], GLT = 60, GLA = 20, GLB = 30, GLN = 10000;
function runGoulot(c) { const T = [GL0.slice()]; let P = GL0.slice(); for (let g = 1; g <= GLT; g++) { P = multiNext(P, g > GLA && g <= GLB ? c : GLN); T.push(P.map(v => Math.round(v * 10000) / 10000)); } return T; }
const nAl = P => P.filter(v => v > 0).length;
WID.goulot = host => {
  const x = xst(); x.gl = x.gl || {}; x.gl.k = x.gl.k || {};
  let c = 5, tr = x.gl.last && x.gl.last.c === 5 ? x.gl.last.T : null, t = tr ? 1 : 0;
  host.innerHTML = `<div class="mleg">${GLC.map((col, i) => `<span>${sw(col)}allèle ${String.fromCharCode(65 + i)}</span>`).join("")}</div>
    <div><b>Effectif pendant la crise</b> (générations 21 à 30) ${segH("Effectif pendant la crise", [[5, "5 guépards"], [50, "50 guépards"], [500, "500 guépards"]], 5, "gc")}</div>
    <div class="figbox gl-f"></div><div class="figbox gl-n"></div><div class="row animctl"></div><p class="cap"><span class="simw">⚠ Modèle simplifié, valeurs simulées</span> : avant et après la crise, la population compte 10 000 guépards.</p><p class="readout gl-ro" aria-live="polite"></p><div class="gl-t"></div><div class="gl-k"></div>`;
  const fa = liveSVG($(".gl-f", host), (W, F) => {
    const H = cl(W * .55, F * 11, F * 15), fr = frame(W, H, F, { gx: GLT, yl: "Fréquence (%)", top: 2.2, xs: 10 }), s = fr.s, n = tr ? Math.round(t * GLT) : -1;
    let g = `<rect x="${N1(fr.X(GLA))}" y="${N1(fr.T)}" width="${N1(fr.X(GLB) - fr.X(GLA))}" height="${N1(fr.ph)}" style="fill:var(--bad-soft)"/>` + fr.g;
    g += tx((fr.L + fr.X(GLA)) / 2, fr.T - s * .5, "10 000", { s: s * .9, c: "var(--muted)" }) + tx((fr.X(GLA) + fr.X(GLB)) / 2, fr.T - s * .5, `crise : ${c}`, { s: s * .9, c: "var(--bad)" }) + tx((fr.X(GLB) + fr.L + fr.pw) / 2, fr.T - s * .5, "10 000 guépards", { s: s * .9, c: "var(--muted)" });
    if (n >= 0) { let below = tr.slice(0, n + 1).map(() => 0);
      GLC.forEach((col, k) => { const top = tr.slice(0, n + 1).map((P, i) => below[i] + P[k] * 100); let d = top.map((v, i) => (i ? "L" : "M") + N1(fr.X(i)) + "," + N1(fr.Y(v))).join(""); for (let i = n; i >= 0; i--) d += "L" + N1(fr.X(i)) + "," + N1(fr.Y(below[i])); g += `<path d="${d}Z" style="fill:${col};opacity:.88"/>`; below = top; }); }
    [GLA, GLB].forEach(v => g += `<line x1="${N1(fr.X(v))}" y1="${N1(fr.T)}" x2="${N1(fr.X(v))}" y2="${N1(fr.T + fr.ph)}" style="stroke:var(--bad);stroke-width:2.5;stroke-dasharray:7 5"/>`);
    return svgW(W, H, `Fréquences des six allèles dans la population de guépards, crise à ${c} individus entre les générations 21 et 30.${n >= 0 ? " Allèles présents à la génération " + n + " : " + nAl(tr[n]) + "." : ""}`, g);
  });
  const fn = liveSVG($(".gl-n", host), (W, F) => {
    const H = cl(W * .3, F * 8, F * 10), fr = frame(W, H, F, { gx: GLT, y1: 6, yt: [0, 2, 4, 6], yl: "Nb d'allèles", xs: 10 }), n = tr ? Math.round(t * GLT) : -1;
    let g = `<rect x="${N1(fr.X(GLA))}" y="${N1(fr.T)}" width="${N1(fr.X(GLB) - fr.X(GLA))}" height="${N1(fr.ph)}" style="fill:var(--bad-soft)"/>` + fr.g;
    if (n >= 0) { let d = ""; tr.slice(0, n + 1).forEach((P, i) => { const v = nAl(P); d += (i ? `L${N1(fr.X(i))},${N1(fr.Y(nAl(tr[i - 1])))}L` : "M") + N1(fr.X(i)) + "," + N1(fr.Y(v)); }); g += `<path d="${d}" style="fill:none;stroke:var(--c3);stroke-width:3"/>`; }
    return svgW(W, H, `Nombre d'allèles différents présents dans la population au fil des générations.`, g);
  });
  const info = () => {
    const n = tr ? Math.round(t * GLT) : -1;
    $(".gl-ro", host).innerHTML = nb(n < 0 ? "Lance la simulation : la population traverse une crise de 10 générations." : n < GLA ? `Génération ${n} : 10 000 guépards, ${nAl(tr[n])} allèles présents.` : n <= GLB ? `Génération ${n} : <b>crise</b>, seulement ${c} guépards. Allèles présents : <b>${nAl(tr[n])}</b>.` : `Génération ${n} : de nouveau 10 000 guépards. Allèles présents : <b>${nAl(tr[n])}</b> sur 6 au départ.`);
    $(".gl-t", host).innerHTML = tr && n >= 0 ? `<div class="fit"><table class="t"><thead><tr><th>Génér.</th><th>Effectif</th><th>Allèles présents</th><th>Allèles perdus</th></tr></thead><tbody>${[0, GLA, GLB, GLT].filter(g => g <= n).map(g => `<tr><td>${g}</td><td class="nw">${g > GLA && g <= GLB ? c : nfmt(10000)}</td><td>${nAl(tr[g])}</td><td>${tr[g].map((v, k) => v > 0 ? "" : String.fromCharCode(65 + k)).filter(Boolean).join(", ") || "aucun"}</td></tr>`).join("")}</tbody></table></div>` : "";
    const K = x.gl.k;
    $(".gl-k", host).innerHTML = `<p class="task ${K[5] !== undefined && K[500] !== undefined ? "is-ok" : ""}">${[5, 50, 500].map(v => `${K[v] !== undefined ? "✓" : "○"} crise à ${v} : ${K[v] !== undefined ? K[v] + " allèle(s) conservé(s)" : "pas encore"}`).join(" · ")}</p>`;
  };
  const all = () => { fa.draw(); fn.draw(); info(); };
  let ready = false;
  const ctl = animCtl($(".animctl", host), 6000, v => {
    if (!ready) return;
    if (tr && v < t) tr = null;
    if (!tr && v > 0) tr = runGoulot(c);
    t = v; if (v >= 1 && tr) { x.gl.k[c] = nAl(tr[GLT]); x.gl.last = { c, T: tr }; keep(); }
    all();
  });
  ready = true;
  $('.animctl [data-a="run"]', host).setAttribute("aria-label", "Lancer la simulation de la crise");
  bindSeg(host, "gc", k => { c = +k; tr = null; t = 0; ctl.set(0); all(); });
  if (tr) { t = 0; const keepT = tr; ctl.set(1); if (!tr) tr = keepT; } all();
};
