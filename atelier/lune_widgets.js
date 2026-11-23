/* ===== 5e EIST · Mission 5 · Activité 5 · Les phases de la Lune · dessins et simulations ===== */
Store.key = "eist5-phases-lune-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const N1 = x => (+x).toFixed(1);
const sM = (x, y, txt, a, size) => `<text x="${N1(x)}" y="${N1(y)}" text-anchor="${a}" style="fill:var(--muted);font-size:${N1(size)}px">${esc(txt)}</text>`;
const D2R = Math.PI / 180;
const LIT = "#f6e7a1", DARK = "#2a2f36", MOONG = "#c4c7cc", SUNC = "#e3a72f";
const rng = s => { let x = s; return () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; }; };
const PH_TXT = ["Aucune partie éclairée visible", "Moitié droite éclairée", "Moitié gauche éclairée", "Disque entièrement éclairé"];
const PHN = ["Nouvelle lune", "Premier quartier", "Pleine lune", "Dernier quartier"];

/* pictogramme d'une Lune dessinée par moitiés : 0 rien, 1 droite, 2 gauche, 3 tout */
function phasePic(st, s) {
  if (st === undefined || st === null) return `<svg viewBox="0 0 40 40" width="${s}" height="${s}" role="img" aria-label="Pas encore dessinée"><circle cx="20" cy="20" r="17" style="fill:none;stroke:var(--muted);stroke-width:1.5;stroke-dasharray:3 3"/></svg>`;
  return `<svg viewBox="0 0 40 40" width="${s}" height="${s}" role="img" aria-label="${PH_TXT[st]}"><circle cx="20" cy="20" r="17" fill="${DARK}"/>${st & 2 ? `<path d="M20,3 A17,17 0 0 0 20,37 Z" fill="${LIT}"/>` : ""}${st & 1 ? `<path d="M20,3 A17,17 0 0 1 20,37 Z" fill="${LIT}"/>` : ""}<circle cx="20" cy="20" r="17" style="fill:none;stroke:var(--ink);stroke-width:1.3"/></svg>`;
}

/* Lune vue depuis la Terre (hémisphère Nord) : e = angle Soleil-Terre-Lune, 0 = nouvelle lune, 180 = pleine lune */
function moonDisk(cx, cy, R, eDeg) {
  const e = ((eDeg % 360) + 360) % 360, c = Math.cos(e * D2R), rx = Math.abs(c) * R, frac = (1 - c) / 2;
  const top = `${N1(cx)},${N1(cy - R)}`, bot = `${N1(cx)},${N1(cy + R)}`;
  const d = e < 180 ? `M${top} A${N1(R)},${N1(R)} 0 0 1 ${bot} A${N1(rx)},${N1(R)} 0 0 ${c > 0 ? 0 : 1} ${top} Z`
    : `M${top} A${N1(R)},${N1(R)} 0 0 0 ${bot} A${N1(rx)},${N1(R)} 0 0 ${c > 0 ? 1 : 0} ${top} Z`;
  const mare = [[-0.28, -0.22, 0.2], [0.18, -0.3, 0.14], [0.05, 0.18, 0.24], [-0.35, 0.28, 0.12], [0.38, 0.12, 0.1]].map(([x, y, r]) => `<circle cx="${N1(cx + x * R)}" cy="${N1(cy + y * R)}" r="${N1(r * R)}" style="fill:#000;opacity:.09"/>`).join("");
  return `<circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(R)}" fill="${DARK}"/>${frac > 0.004 ? `<path d="${d}" fill="${LIT}"/>` : ""}${mare}<circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(R)}" style="fill:none;stroke:#5b6470;stroke-width:1.2"/>`;
}
function phaseName(eDeg) {
  const e = ((eDeg % 360) + 360) % 360;
  return e < 10 || e > 350 ? "Nouvelle lune" : e < 80 ? "Premier croissant" : e <= 100 ? "Premier quartier" : e < 170 ? "Lune gibbeuse croissante" : e <= 190 ? "Pleine lune" : e < 260 ? "Lune gibbeuse décroissante" : e <= 280 ? "Dernier quartier" : "Dernier croissant";
}

/* ciel nocturne : ce que voit l'observateur terrestre */
function skyView(W, F, eDeg, show) {
  const tk = TK(F), H = Math.min(Math.max(W * 0.72, F * 11), F * 15), R = Math.min(W * 0.19, H * 0.24), cx = W / 2, cy = H * 0.43, r = rng(7);
  let g = `<rect x="0" y="0" width="${W}" height="${H}" rx="14" fill="#0b1a2c"/>`;
  for (let i = 0; i < 46; i++) { const x = r() * W, y = r() * H * 0.78, s = 0.6 + r() * 1.4; if (Math.hypot(x - cx, y - cy) > R * 1.25) g += `<circle cx="${N1(x)}" cy="${N1(y)}" r="${N1(s)}" fill="#dfe8f5" opacity="${N1(0.35 + r() * 0.6)}"/>`; }
  g += moonDisk(cx, cy, R, eDeg);
  const gy = H * 0.82;
  g += `<path d="M0,${N1(gy)} C${N1(W * 0.25)},${N1(gy - H * 0.06)} ${N1(W * 0.45)},${N1(gy + H * 0.03)} ${N1(W * 0.7)},${N1(gy - H * 0.04)} S${N1(W)},${N1(gy)} ${N1(W)},${N1(gy)} L${W},${H} L0,${H} Z" fill="#132a1f"/>`;
  const ox = W * 0.16, oy = gy - H * 0.005, s = Math.max(F * 0.9, H * 0.06);
  g += `<g style="stroke:#9fb8a8;stroke-width:2.4;stroke-linecap:round;fill:none"><circle cx="${N1(ox)}" cy="${N1(oy - s * 1.9)}" r="${N1(s * 0.32)}"/><path d="M${N1(ox)},${N1(oy - s * 1.55)} L${N1(ox)},${N1(oy - s * 0.7)} M${N1(ox)},${N1(oy - s * 0.7)} L${N1(ox - s * 0.35)},${N1(oy)} M${N1(ox)},${N1(oy - s * 0.7)} L${N1(ox + s * 0.35)},${N1(oy)} M${N1(ox)},${N1(oy - s * 1.35)} L${N1(ox + s * 0.5)},${N1(oy - s * 1.75)}"/></g>`;
  g += `<text x="10" y="${N1(tk * 1.3)}" style="fill:#dfe8f5;font-size:${N1(Math.min(tk * 0.9, W / 22))}px;font-weight:700">Depuis la Terre (hémisphère Nord)</text>`;
  if (show) g += `<text x="${N1(cx)}" y="${N1(H - tk * 0.6)}" text-anchor="middle" style="fill:#f6e7a1;font-size:${N1(tk)}px;font-weight:800">${esc(show)}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Ciel nocturne : la Lune telle que la voit un observateur terrestre. La phase est écrite sous les dessins.">${g}</svg>`;
}

/* le schéma du document : Soleil à gauche, Terre au centre, orbite de la Lune vue en perspective */
const WKPHI = { 1: 270, 2: 0, 3: 90, 4: 180 };
function persp(W, F, o) {
  const tk = TK(F) * 0.9, narrow = W < F * 24, H = Math.min(Math.max(W * (narrow ? 0.7 : 0.6), F * 10), F * 17), cx = W * (narrow ? 0.58 : 0.6), cy = H * 0.54, rx = Math.min(W * (narrow ? 0.38 : 0.34), H * 0.95), ry = rx * 0.36, t = -14 * D2R, Re = rx * 0.3, Rm = Math.max(F * 0.62, rx * 0.085);
  const P = ph => { const a = ph * D2R, dx = rx * Math.cos(a), dy = -ry * Math.sin(a); return [cx + dx * Math.cos(t) - dy * Math.sin(t), cy + dx * Math.sin(t) + dy * Math.cos(t)]; };
  let g = "";
  const bx = Math.max(6, W * 0.02), bw = Math.min(W * 0.2, F * 5.2);
  g += `<rect x="${N1(bx)}" y="${N1(H * 0.1)}" width="${N1(bw)}" height="${N1(tk * 1.7)}" rx="6" style="fill:#fff3b0;stroke:${SUNC}"/><text x="${N1(bx + bw / 2)}" y="${N1(H * 0.1 + tk * 1.2)}" text-anchor="middle" style="fill:#5a4100;font-size:${N1(tk)}px;font-weight:800">☀ Soleil</text>`;
  const ax0 = Math.min(W * 0.26, P(180)[0] - Rm - 18);
  [0.4, 0.58].forEach(y => { g += `<line x1="${N1(bx)}" y1="${N1(H * y)}" x2="${N1(ax0)}" y2="${N1(H * y)}" style="stroke:${SUNC};stroke-width:3.5"/><polygon points="${N1(ax0 + 12)},${N1(H * y)} ${N1(ax0)},${N1(H * y - 7)} ${N1(ax0)},${N1(H * y + 7)}" fill="${SUNC}"/>`; });
  g += sM(bx, H * 0.4 - tk * 0.55, "lumière du Soleil", "start", tk * 0.85);
  let d = ""; for (let k = 0; k <= 72; k++) { const [x, y] = P(k * 5); d += (k ? "L" : "M") + N1(x) + "," + N1(y); }
  g += `<path d="${d}" style="fill:none;stroke:var(--ink);stroke-width:1.4;stroke-dasharray:5 5;opacity:.75"/>`;
  [300, 125].forEach(ph => { const [x1, y1] = P(ph), [x2, y2] = P(ph + 7); g += arrow(x1, y1, x2, y2, 2, "ink", 0.8); });
  const moon = (ph, main) => { const [x, y] = P(ph), r = main ? Rm * 1.05 : Rm; let m = `<circle cx="${N1(x)}" cy="${N1(y)}" r="${N1(r)}" style="fill:${o.lit ? DARK : MOONG};stroke:${main ? "var(--accent)" : "var(--ink)"};stroke-width:${main ? 3 : 1.3}"/>`; if (o.lit) m += `<path d="M${N1(x)},${N1(y - r)} A${N1(r)},${N1(r)} 0 0 0 ${N1(x)},${N1(y + r)} Z" fill="${LIT}"/><circle cx="${N1(x)}" cy="${N1(y)}" r="${N1(r)}" style="fill:none;stroke:var(--ink);stroke-width:1.3"/>`; return m; };
  const label = w => { const [x, y] = P(WKPHI[w]), half = tk * 2.6, lx = Math.max(half + 2, Math.min(W - half - 2, x)), ly = w === 1 || w === 4 ? y + Rm + tk * 1.15 : y - Rm - tk * 0.45; return sT(lx, ly, "Semaine " + w, "middle", tk * 0.9, 'font-weight="700"'); };
  const back = [], front = [];
  if (o.ghosts) [1, 2, 3, 4].forEach(w => (Math.sin(WKPHI[w] * D2R) > 0.05 ? back : front).push(moon(WKPHI[w], false)));
  if (o.phi !== undefined && o.phi !== null) (Math.sin(o.phi * D2R) > 0.05 ? back : front).push(moon(o.phi, true));
  g += back.join("");
  const ax = -22 * D2R, al = Re * 1.32;
  g += `<line x1="${N1(cx + Math.sin(ax) * al)}" y1="${N1(cy + Math.cos(ax) * al)}" x2="${N1(cx - Math.sin(ax) * al)}" y2="${N1(cy - Math.cos(ax) * al)}" style="stroke:var(--ink);stroke-width:2.4"/>`;
  g += `<circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(Re)}" style="fill:#bfe9f2;stroke:var(--ink);stroke-width:1.6"/>`;
  g += `<path d="M${N1(cx - Re * 0.92)},${N1(cy - Re * 0.25)} C${N1(cx - Re * 0.5)},${N1(cy + Re * 0.35)} ${N1(cx + Re * 0.2)},${N1(cy + Re * 0.2)} ${N1(cx + Re * 0.98)},${N1(cy + Re * 0.22)}" style="fill:none;stroke:#245a68;stroke-width:1.5"/>`;
  if (o.lit) g += `<path d="M${N1(cx)},${N1(cy - Re)} A${N1(Re)},${N1(Re)} 0 0 1 ${N1(cx)},${N1(cy + Re)} Z" style="fill:#0b1a2c;opacity:.45"/>`;
  g += arrow(cx - Math.sin(ax) * al * 0.95, cy - Math.cos(ax) * al * 0.95, cx - Math.sin(ax) * al * 1.25, cy - Math.cos(ax) * al * 1.25, 2.4, "ink", 1);
  g += `<text x="${N1(cx)}" y="${N1(cy + Re * 0.62)}" text-anchor="middle" style="fill:#0c3c48;font-size:${N1(tk * 0.9)}px;font-weight:800">Terre</text>`;
  g += front.join("");
  if (o.ghosts || o.labels) [1, 2, 3, 4].forEach(w => { g += label(w); });
  return { H, svg: `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(o.alt || "Schéma : le Soleil à gauche éclaire la Terre et la Lune ; la Lune tourne autour de la Terre ; ses positions à la fin des semaines 1 à 4 sont repérées.")}">${g}</svg>` };
}

/* ---------- 1 · le labo de la lumière : comment voit-on la Lune ? ---------- */
WID.rayon = el => {
  const X = xst(); X.ray = X.ray || {};
  let scr = 0, hand = 0, q = 0;
  el.innerHTML = `<p class="lead">${nb("Lance la lumière. Puis recommence avec un obstacle.")}</p>
    <div class="opt3"><div><span class="lab3">Écran entre le Soleil et la Lune</span><div class="seg" role="group" aria-label="Écran entre le Soleil et la Lune"><button type="button" data-s="0">Non</button><button type="button" data-s="1">Oui</button></div></div>
    <div><span class="lab3">Main devant l'œil</span><div class="seg" role="group" aria-label="Main devant l'œil"><button type="button" data-h="0">Non</button><button type="button" data-h="1">Oui</button></div></div></div>
    <div class="row animctl"></div><div class="figbox"></div><p class="readout" aria-live="polite"></p><p class="lead" data-n></p>`;
  const key = () => scr ? "screen" : hand ? "hand" : "free";
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F) * 0.9, H = Math.min(Math.max(W * 0.5, F * 11), F * 14), sx = W * 0.1, sy = H * 0.3, sr = Math.min(H * 0.13, W * 0.07), mx = W * 0.6, my = H * 0.28, mr = Math.min(H * 0.08, W * 0.05), ex = W * 0.86, ey = H * 0.8, scX = W * 0.36, hx = ex - W * 0.07;
    const p1 = Math.min(1, q / 0.45), p2 = Math.max(0, (q - 0.45) / 0.55), lit = !scr && q >= 0.45;
    let g = `<rect width="${W}" height="${H}" rx="14" fill="#0b1a2c"/>`;
    const r = rng(3); for (let i = 0; i < 30; i++) g += `<circle cx="${N1(r() * W)}" cy="${N1(r() * H * 0.6)}" r="${N1(0.6 + r())}" fill="#dfe8f5" opacity=".5"/>`;
    for (let k = 0; k < 10; k++) { const a = k * 36 * D2R; g += `<line x1="${N1(sx + Math.cos(a) * sr * 1.15)}" y1="${N1(sy + Math.sin(a) * sr * 1.15)}" x2="${N1(sx + Math.cos(a) * sr * 1.6)}" y2="${N1(sy + Math.sin(a) * sr * 1.6)}" style="stroke:${SUNC};stroke-width:2.5;opacity:.85"/>`; }
    g += `<circle cx="${N1(sx)}" cy="${N1(sy)}" r="${N1(sr)}" fill="#ffd34d"/>` + `<text x="${N1(sx)}" y="${N1(sy + sr * 1.6 + tk)}" text-anchor="middle" style="fill:#ffe9a8;font-size:${N1(tk)}px;font-weight:800">Soleil</text>`;
    const reach = scr ? (scX - sx) / (mx - mr - sx) : 1, L1 = Math.min(p1, reach);
    if (q > 0) g += `<line x1="${N1(sx + sr)}" y1="${N1(sy)}" x2="${N1(sx + sr + (mx - mr - sx - sr) * L1)}" y2="${N1(sy + (my - sy) * L1)}" style="stroke:#ffd34d;stroke-width:3.5"/>`;
    if (scr) g += `<rect x="${N1(scX - 6)}" y="${N1(sy - H * 0.2)}" width="12" height="${N1(H * 0.4)}" rx="3" fill="#8a96a3"/><text x="${N1(scX)}" y="${N1(sy + H * 0.2 + tk * 1.1)}" text-anchor="middle" style="fill:#dfe8f5;font-size:${N1(tk * 0.85)}px">écran</text>`;
    g += `<circle cx="${N1(mx)}" cy="${N1(my)}" r="${N1(mr)}" style="fill:${lit ? "#f3eccb" : "#1a2533"};stroke:${lit ? "#f3eccb" : "#5b6470"};stroke-width:1.5;${lit ? "" : "stroke-dasharray:4 3"}"/><text x="${N1(mx)}" y="${N1(my - mr - tk * 0.5)}" text-anchor="middle" style="fill:#dfe8f5;font-size:${N1(tk)}px;font-weight:800">Lune</text>`;
    if (lit) { for (let k = 0; k < 8; k++) { const a = (k * 45 + 20) * D2R, l = mr * (1.3 + 1.2 * Math.min(1, p2 * 2)); g += `<line x1="${N1(mx + Math.cos(a) * mr * 1.15)}" y1="${N1(my + Math.sin(a) * mr * 1.15)}" x2="${N1(mx + Math.cos(a) * l)}" y2="${N1(my + Math.sin(a) * l)}" style="stroke:#f3eccb;stroke-width:2;stroke-dasharray:4 3;opacity:.7"/>`; }
      const stopX = hand ? hx + 10 : ex - 14, L2 = Math.min(p2, (stopX - mx) / (ex - mx));
      g += `<line x1="${N1(mx)}" y1="${N1(my + mr)}" x2="${N1(mx + (ex - mx) * L2)}" y2="${N1(my + mr + (ey - my - mr) * L2)}" style="stroke:#f3eccb;stroke-width:3"/>`; }
    g += `<path d="M0,${N1(H * 0.9)} Q${N1(W * 0.5)},${N1(H * 0.84)} ${N1(W)},${N1(H * 0.9)} L${W},${H} L0,${H} Z" fill="#132a1f"/>`;
    g += `<ellipse cx="${N1(ex)}" cy="${N1(ey)}" rx="${N1(F * 1.05)}" ry="${N1(F * 0.6)}" style="fill:#f5f7fa;stroke:#dfe8f5;stroke-width:1.5"/><circle cx="${N1(ex - F * 0.25)}" cy="${N1(ey - F * 0.05)}" r="${N1(F * 0.38)}" fill="#3b6ea8"/><circle cx="${N1(ex - F * 0.25)}" cy="${N1(ey - F * 0.05)}" r="${N1(F * 0.16)}" fill="#0b1a2c"/>`;
    g += `<text x="${N1(ex)}" y="${N1(ey + F * 0.6 + tk * 1.05)}" text-anchor="middle" style="fill:#dfe8f5;font-size:${N1(tk * 0.85)}px;font-weight:700">observateur</text>`;
    if (hand) g += `<text x="${N1(hx)}" y="${N1(ey + tk * 0.4)}" text-anchor="middle" style="font-size:${N1(F * 1.6)}px">✋</text>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Le Soleil, la Lune et un observateur sur Terre. Ce qui se passe est écrit sous le dessin.">${g}</svg>`;
  });
  const done = () => { const n = ["free", "screen", "hand"].filter(k => X.ray[k]).length; $("[data-n]", el).textContent = `Essais réalisés : ${n}/3 (sans obstacle, avec l'écran, avec la main).`; };
  const ctl = animCtl($(".animctl", el), 5200, p => { q = p; fig.draw();
    $(".readout", el).innerHTML = nb(p <= 0 ? "Touche « Lancer »." : p < 0.45 ? (scr ? "La lumière du Soleil part vers la Lune… et rencontre l'écran." : "La lumière du Soleil part vers la Lune…") : scr ? "La lumière du Soleil n'arrive pas jusqu'à la Lune : la Lune n'est pas éclairée. L'observateur ne la voit pas." : p < 1 ? "La Lune est éclairée : elle renvoie la lumière dans toutes les directions…" : hand ? "La main arrête la lumière qui vient de la Lune : l'observateur ne voit pas la Lune." : "La lumière qui vient de la Lune arrive jusqu'à l'œil : l'observateur voit la Lune.");
    if (p >= 1 && !X.ray[key()]) { X.ray[key()] = 1; keep(); done(); } });
  const paint = () => { $$("[data-s]", el).forEach(b => b.setAttribute("aria-pressed", +b.dataset.s === scr ? "true" : "false")); $$("[data-h]", el).forEach(b => b.setAttribute("aria-pressed", +b.dataset.h === hand ? "true" : "false")); };
  $$("[data-s]", el).forEach(b => b.onclick = () => { scr = +b.dataset.s; if (scr) hand = 0; paint(); ctl.set(0); });
  $$("[data-h]", el).forEach(b => b.onclick = () => { hand = +b.dataset.h; if (hand) scr = 0; paint(); ctl.set(0); });
  paint(); done();
};

/* ---------- 2 · le simulateur de lunaison (remplace la vidéo) ---------- */
function lunaCtl(el, intro, onDay) {
  el.innerHTML = `<p class="lead">${nb(intro)}</p><div class="row animctl"></div>
    <div class="seg wkb" role="group" aria-label="Aller à la fin d'une semaine">${[1, 2, 3, 4].map(w => `<button type="button" data-wk="${w}">Semaine ${w}</button>`).join("")}</div>
    <div class="field"><label for="${el.id || "x"}-d">Jour de la lunaison : <b data-dv>0</b> sur 28</label><input id="${el.id || "x"}-d" type="range" min="0" max="28" step="0.5" value="0" data-day></div>
    <div class="lgrid"><div class="figbox" data-dg></div><div class="figbox" data-sky></div></div><p class="readout" aria-live="polite"></p>`;
  let day = 0;
  const ctl = animCtl($(".animctl", el), 16000, q => { day = 28 * q; sync(); });
  function sync() { const sl = $("[data-day]", el); if (sl && Math.abs(+sl.value - day) > 0.26) sl.value = String(Math.round(day * 2) / 2); $("[data-dv]", el).textContent = fmt(Math.round(day * 2) / 2); const wk = [1, 2, 3, 4].find(w => Math.abs(day - 7 * w) < 0.26); $$("[data-wk]", el).forEach(b => b.setAttribute("aria-pressed", +b.dataset.wk === wk ? "true" : "false")); onDay(day, wk); }
  $$("[data-wk]", el).forEach(b => b.onclick = () => ctl.set(+b.dataset.wk / 4));
  $("[data-day]", el).oninput = e => ctl.set(+e.target.value / 28);
  return ctl;
}
WID.lunaison = el => {
  const X = xst(); X.wk = X.wk || {};
  let day = 0, dg, sky;
  lunaCtl(el, "Lance la lunaison, ou touche une semaine. Observe la Lune depuis la Terre.", (d, wk) => {
    day = d; if (dg) { dg.draw(); sky.draw(); }
    if (wk && !X.wk[wk]) { X.wk[wk] = 1; keep(); }
    const e = 360 * d / 28;
    $(".readout", el).innerHTML = nb(`Jour ${fmt(Math.round(d * 2) / 2)}${wk ? ` · <b>fin de la semaine ${wk}</b>` : ""} · ${phaseName(e)}. Semaines observées : ${Object.keys(X.wk).length}/4.`);
  });
  dg = liveSVG($("[data-dg]", el), (W, F) => persp(W, F, { phi: 180 + 360 * day / 28, ghosts: true, alt: "Schéma du document : la Lune (cerclée de couleur) tourne autour de la Terre. Sa position et le jour sont écrits sous les dessins." }).svg);
  sky = liveSVG($("[data-sky]", el), (W, F) => skyView(W, F, 360 * day / 28, phaseName(360 * day / 28)));
};

/* ---------- 3 · le schéma du document (positions seules) ---------- */
WID.schema = el => { el.innerHTML = `<div class="figbox"></div><p class="cap">Les quatre positions de la Lune à la fin de chaque semaine. Toi, tu regardes ce schéma depuis l'espace : le Soleil est à ta gauche.</p>`; liveSVG($(".figbox", el), (W, F) => persp(W, F, { ghosts: true }).svg); };

/* ---------- animation débloquée : vue depuis l'espace et vue depuis la Terre ---------- */
function topView(W, F, phi) {
  const tk = TK(F) * 0.9, H = Math.min(Math.max(W * 0.78, F * 13), F * 17), cx = W * 0.57, cy = H * 0.52, Rm = F * 1.7, Re = F * 1.0, rO = Math.min(W * 0.36, H / 2 - Rm * 1.35 - F * 0.5);
  let g = `<rect width="${W}" height="${H}" rx="14" style="fill:var(--surface-2)"/>`;
  [0.3, 0.5, 0.7].forEach(y => { g += `<line x1="6" y1="${N1(H * y)}" x2="${N1(W * 0.14)}" y2="${N1(H * y)}" style="stroke:${SUNC};stroke-width:3"/><polygon points="${N1(W * 0.14 + 11)},${N1(H * y)} ${N1(W * 0.14)},${N1(H * y - 6)} ${N1(W * 0.14)},${N1(H * y + 6)}" fill="${SUNC}"/>`; });
  g += sT(6, H * 0.3 - tk * 0.6, "☀ Soleil", "start", tk, 'font-weight="800"');
  g += `<circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(rO)}" style="fill:none;stroke:var(--ink);stroke-width:1.3;stroke-dasharray:5 5;opacity:.7"/>`;
  g += `<circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(Re)}" fill="#1a3550"/><path d="M${N1(cx)},${N1(cy - Re)} A${N1(Re)},${N1(Re)} 0 0 0 ${N1(cx)},${N1(cy + Re)} Z" fill="#7cc6e6"/><circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(Re)}" style="fill:none;stroke:var(--ink);stroke-width:1.4"/>` + sT(cx, cy + Re + tk * 1.1, "Terre", "middle", tk * 0.9, 'font-weight="800"');
  const a = phi * D2R, mx = cx + rO * Math.cos(a), my = cy - rO * Math.sin(a);
  g += `<circle cx="${N1(mx)}" cy="${N1(my)}" r="${N1(Rm)}" fill="${DARK}"/><path d="M${N1(mx)},${N1(my - Rm)} A${N1(Rm)},${N1(Rm)} 0 0 0 ${N1(mx)},${N1(my + Rm)} Z" fill="${LIT}" opacity=".55"/>`;
  const psi = Math.atan2(cy - my, cx - mx) / D2R; let tt = psi; while (tt <= 0) tt += 360; while (tt > 360) tt -= 360;
  const lo = Math.max(90, tt - 90), hi = Math.min(270, tt + 90);
  if (hi - lo > 1) { let d = `M${N1(mx)},${N1(my)}`; for (let s = lo; s <= hi + 0.01; s += 3) d += ` L${N1(mx + Rm * Math.cos(s * D2R))},${N1(my + Rm * Math.sin(s * D2R))}`; g += `<path d="${d} Z" style="fill:#ffd84d;stroke:var(--accent);stroke-width:3;stroke-linejoin:round"/>`; }
  let arc = ""; for (let s = psi - 90; s <= psi + 90.01; s += 4) arc += (arc ? " L" : "M") + `${N1(mx + Rm * 1.28 * Math.cos(s * D2R))},${N1(my + Rm * 1.28 * Math.sin(s * D2R))}`;
  g += `<path d="${arc}" style="fill:none;stroke:var(--accent);stroke-width:2.2;stroke-dasharray:4 4"/><circle cx="${N1(mx)}" cy="${N1(my)}" r="${N1(Rm)}" style="fill:none;stroke:var(--ink);stroke-width:1.4"/>`;
  g += `<line x1="${N1(cx + (mx - cx) * (Re / rO) * 1.1)}" y1="${N1(cy + (my - cy) * (Re / rO) * 1.1)}" x2="${N1(mx - (mx - cx) * (Rm * 1.4 / rO))}" y2="${N1(my - (my - cy) * (Rm * 1.4 / rO))}" style="stroke:var(--accent);stroke-width:1.4;stroke-dasharray:2 4"/>`;
  g += sT(6, tk * 1.2, "Vue de dessus, depuis l'espace", "start", tk * 0.9, 'font-weight="700"');
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Vue de dessus depuis l'espace : la moitié de la Lune tournée vers le Soleil est toujours éclairée ; la partie que l'on voit depuis la Terre est entourée. L'explication est écrite sous les dessins.">${g}</svg>`;
}
WID.espace = el => {
  let day = 7, dg, sky;
  const ctl = lunaCtl(el, "Depuis l'espace, la moitié tournée vers le Soleil est toujours éclairée. Depuis la Terre, on ne voit que la moitié de la Lune tournée vers nous (pointillés).", (d, wk) => {
    day = d; if (dg) { dg.draw(); sky.draw(); }
    const e = ((360 * d / 28) % 360 + 360) % 360, near = x => Math.abs(e - x) < 10, part = e < 10 || e > 350 ? "on ne voit <b>aucune partie</b> de la moitié éclairée" : near(180) ? "on voit <b>toute</b> la moitié éclairée" : near(90) || near(270) ? "on voit <b>la moitié</b> de la moitié éclairée" : `on voit <b>${(e < 90 || e > 270) ? "une petite partie" : "une grande partie"}</b> de la moitié éclairée`;
    $(".readout", el).innerHTML = nb(`Jour ${fmt(Math.round(d * 2) / 2)}${wk ? ` · fin de la semaine ${wk}` : ""} · ${phaseName(e)} : depuis la Terre, ${part} (en surbrillance).`);
  });
  dg = liveSVG($("[data-dg]", el), (W, F) => topView(W, F, 180 + 360 * day / 28));
  sky = liveSVG($("[data-sky]", el), (W, F) => skyView(W, F, 360 * day / 28, phaseName(360 * day / 28)));
  el.insertAdjacentHTML("beforeend", `<p class="cap">${nb("Vue de dessus : jaune pâle = moitié éclairée par le Soleil · jaune vif, cerné de couleur = partie éclairée tournée vers la Terre, celle que l'on voit · pointillés = moitié de la Lune tournée vers la Terre.")}</p>`);
  ctl.set(0.25);
};
