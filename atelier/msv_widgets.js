/* ===== 5e EIST · Physique-chimie · Masse et volume : le labo de mesure (seringue, éprouvettes, balance, conversions, changements d'état) ===== */
Store.key = "eist5-masse-volume-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const xo = k => { const x = xst(); if (!x[k] || typeof x[k] !== "object") x[k] = {}; return x[k]; };
const N1 = x => (+x).toFixed(1);
const sX = (x, y, txt, a, size, extra) => { extra = extra || ""; const m = extra.match(/style="([^"]*)"/); return `<text x="${N1(x)}" y="${N1(y)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${N1(size)}px;${m ? m[1] : ""}" ${extra.replace(/style="[^"]*"/, "")}>${esc(txt)}</text>`; };
const rng = s => { let x = s >>> 0 || 1; return () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; }; };
const press = (el, sel, on) => $$(sel, el).forEach(b => b.setAttribute("aria-pressed", String(on(b))));
const f1 = x => fmt(x, 1), f0 = x => fmt(x, 0);
const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
function loop(el, fn) { let lt = 0; const st = ts => { if (!document.body.contains(el)) return; const dt = lt ? Math.min(0.1, (ts - lt) / 1000) : 0; lt = ts; if (fn(dt, ts) !== false) requestAnimationFrame(st); }; requestAnimationFrame(st); }
/* effet « boum » : éclats d'émojis et secousse */
function boom(el, emo, n) {
  const host = el.closest(".db") || el; host.classList.remove("shake"); void host.offsetWidth; host.classList.add("shake");
  const r = host.getBoundingClientRect(), box = document.createElement("div"); box.className = "boom"; box.setAttribute("aria-hidden", "true");
  for (let i = 0; i < (n || 14); i++) { const s = document.createElement("span"); s.textContent = [].concat(emo)[i % [].concat(emo).length]; s.style.left = (30 + Math.random() * 40) + "%"; s.style.top = (35 + Math.random() * 20) + "%"; s.style.setProperty("--dx", (Math.random() * 2 - 1) * r.width * 0.45 + "px"); s.style.setProperty("--dy", (-Math.random() * 0.6 - 0.2) * Math.max(200, r.height) + "px"); s.style.animationDelay = (Math.random() * 0.15) + "s"; box.appendChild(s); }
  host.appendChild(box); setTimeout(() => box.remove(), 1400);
}
const LIQ = "#4aa3df", LIQD = "#2b7bb9", OIL = "#e8b730", ICE = "#d9f1ff", GLASS = "rgba(200,225,240,.25)", PATE = "#e0569a";
const glassStroke = `stroke:var(--ink);stroke-width:2;opacity:.75`;

/* ---------- éprouvette graduée (dessin) ---------- */
function cylinder(x, top, w, h, cfg, level, opt) {
  opt = opt || {}; const { vmin, vmax, minor, major } = cfg, Y = v => top + h - (v - vmin) / (vmax - vmin) * h * 0.92, F = opt.F || 18;
  let g = `<rect x="${N1(x)}" y="${N1(top - 6)}" width="${N1(w)}" height="${N1(h + 12)}" rx="6" style="fill:${GLASS};${glassStroke}"/>`;
  const layers = opt.layers || [{ v: level, c: opt.color || LIQ }];
  let prev = top + h + 4; layers.forEach(L => { const y = Y(L.v); g += `<rect x="${N1(x + 2)}" y="${N1(y)}" width="${N1(w - 4)}" height="${N1(Math.max(0, prev - y))}" style="fill:${L.c};opacity:.85"/>`; prev = y; });
  const yl = Y(layers[layers.length - 1].v); g += `<path d="M${N1(x + 2)},${N1(yl - 5)} Q${N1(x + w / 2)},${N1(yl + 4)} ${N1(x + w - 2)},${N1(yl - 5)}" style="fill:none;stroke:${LIQD};stroke-width:2.2"/>`;
  for (let v = Math.ceil(vmin / minor) * minor; v <= vmax + 1e-9; v += minor) { const y = Y(v), big = Math.abs(v / major - Math.round(v / major)) < 1e-6; g += `<line x1="${N1(x + w)}" x2="${N1(x + w - (big ? w * 0.42 : w * 0.22))}" y1="${N1(y)}" y2="${N1(y)}" style="stroke:var(--ink);stroke-width:${big ? 1.8 : 1}"/>`; if (big && !opt.nolab) g += sX(x + w + 5, y + F * 0.32, fmt(v), "start", F * 0.8, `font-weight="700"`); }
  if (opt.unit) g += sX(x + w / 2, top - 12, opt.unit, "middle", F * 0.8, `font-weight="700"`);
  return { svg: g, Y };
}
/* loupe : zoom autour du ménisque ; eye = position de l'œil (−1 au-dessus, 0 en face, +1 en dessous) */
function loupe(x, y, w, h, cfg, level, eye, F) {
  const span = cfg.minor * 7, v0 = level - span / 2, Yv = v => y + h - (v - v0) / span * h, shift = eye * cfg.minor * 1.6, id = "lp" + Math.random().toString(36).slice(2, 7);
  let g = `<defs><clipPath id="${id}"><rect x="${N1(x)}" y="${N1(y)}" width="${N1(w)}" height="${N1(h)}" rx="14"/></clipPath></defs><g clip-path="url(#${id})"><rect x="${N1(x)}" y="${N1(y)}" width="${N1(w)}" height="${N1(h)}" style="fill:var(--surface)"/>`;
  const yl = Yv(level); g += `<rect x="${N1(x)}" y="${N1(yl)}" width="${N1(w)}" height="${N1(y + h - yl)}" style="fill:${LIQ};opacity:.55"/><path d="M${N1(x)},${N1(yl - h * 0.09)} Q${N1(x + w * 0.5)},${N1(yl + h * 0.05)} ${N1(x + w)},${N1(yl - h * 0.09)}" style="fill:none;stroke:${LIQD};stroke-width:3"/>`;
  for (let v = Math.floor((v0 - span) / cfg.minor) * cfg.minor; v <= v0 + 2 * span; v += cfg.minor) { const yy = Yv(v - shift), big = Math.abs(v / cfg.major - Math.round(v / cfg.major)) < 1e-6, mid = !big && cfg.mid && Math.abs(v / cfg.mid - Math.round(v / cfg.mid)) < 1e-6; g += `<line x1="${N1(x + w * 0.38)}" x2="${N1(x + w * (big ? 0.95 : mid ? 0.8 : 0.68))}" y1="${N1(yy)}" y2="${N1(yy)}" style="stroke:var(--ink);stroke-width:${big ? 2.6 : 1.6}"/>`; if (big || mid) g += sX(x + w * 0.33, yy + F * 0.35, fmt(v), "end", F * (big ? 0.95 : 0.85), `font-weight="${big ? 800 : 700}"`); }
  g += `</g><rect x="${N1(x)}" y="${N1(y)}" width="${N1(w)}" height="${N1(h)}" rx="14" style="fill:none;stroke:var(--accent);stroke-width:3"/>` + sX(x + w / 2, y - 8, "🔍 Loupe", "middle", F * 0.8, `font-weight="800"`);
  return g;
}
/* balance électronique */
function balance(x, y, w, disp, F, opt) {
  opt = opt || {}; const h = w * 0.34;
  let g = `<path d="M${N1(x)},${N1(y + h)} L${N1(x + w * 0.06)},${N1(y + h * 0.25)} L${N1(x + w * 0.94)},${N1(y + h * 0.25)} L${N1(x + w)},${N1(y + h)} Z" style="fill:#e9edf1;stroke:#6b7782;stroke-width:1.5"/>`;
  g += `<rect x="${N1(x + w * 0.1)}" y="${N1(y)}" width="${N1(w * 0.8)}" height="${N1(h * 0.18)}" rx="4" style="fill:#cfd6dc;stroke:#6b7782;stroke-width:1.2"/>`;
  g += `<rect x="${N1(x + w * 0.22)}" y="${N1(y + h * 0.42)}" width="${N1(w * 0.42)}" height="${N1(h * 0.42)}" rx="5" style="fill:#1d2b1e"/>`;
  g += `<text x="${N1(x + w * 0.62)}" y="${N1(y + h * 0.75)}" text-anchor="end" style="fill:#7dff8a;font-family:ui-monospace,Menlo,Consolas,monospace;font-weight:700;font-size:${N1(Math.min(h * 0.34, F * 1.5))}px">${esc(disp)}</text>`;
  g += sX(x + w * 0.68, y + h * 0.72, opt.unit || "g", "start", F * 0.8, `font-weight="800" style="fill:#333"`);
  g += `<rect x="${N1(x + w * 0.76)}" y="${N1(y + h * 0.48)}" width="${N1(w * 0.12)}" height="${N1(h * 0.3)}" rx="4" style="fill:${opt.tareHi ? "#ffb300" : "#9aa6b1"}"/>` + sX(x + w * 0.82, y + h * 0.68, "TARE", "middle", F * 0.55, `font-weight="800" style="fill:#fff"`);
  return g;
}
const gfmt = (m, d) => fmt(m, d === undefined ? 1 : d);

/* =====================================================================
   1 · La seringue bouchée : air ou eau ?
   ===================================================================== */
WID.seringue = el => {
  const st = xo("ser"); if (!st.fl) st.fl = "air"; if (st.plug === undefined) st.plug = true; if (!st.t || typeof st.t !== "object") st.t = {};
  let F = 0, V = 20, out = 0, R = rng(7); const P = Array.from({ length: 46 }, () => ({ x: R(), y: R(), vx: R() - 0.5, vy: R() - 0.5 }));
  el.innerHTML = `<p class="lead">${nb("Comme Nicolas : remplis la seringue, bouche l'orifice avec ton doigt, puis pousse le piston de plus en plus fort.")}</p>
    <div class="seg" role="group" aria-label="Contenu de la seringue"><button type="button" data-fl="air">💨 Air</button><button type="button" data-fl="eau">💧 Eau</button></div>
    <div class="row"><button type="button" class="btn ghost" data-plug aria-pressed="true">☝ Doigt sur l'orifice</button></div>
    <div class="field"><label>Force sur le piston : <b data-fv></b><input type="range" min="0" max="100" step="1" value="0" data-f aria-label="Force sur le piston, de 0 à 100"></label></div>
    <div class="row">${[0, 50, 100].map(v => `<button type="button" class="btn ghost sm" data-fq="${v}">${v === 0 ? "Relâcher" : v === 50 ? "Pousser" : "💪 Pousser à fond"}</button>`).join("")}</div>
    <div class="figbox" data-fig></div><p class="readout" data-ro aria-live="polite"></p>`;
  const target = () => { if (!st.plug) return Math.max(2, 20 - F * 0.18); if (st.fl === "air") return 20 / (1 + F / 38); return 20; };
  const fig = liveSVG($("[data-fig]", el), (W, Fs) => {
    const H = Math.max(W * 0.36, Fs * 9), bx = W * 0.14, bw = W * 0.62, by = H * 0.3, bh = H * 0.3, px = bx + bw * (V / 20), water = st.fl === "eau";
    let g = `<rect x="${N1(bx)}" y="${N1(by)}" width="${N1(bw)}" height="${N1(bh)}" rx="8" style="fill:${GLASS};${glassStroke}"/>`;
    g += `<rect x="${N1(bx - W * 0.06)}" y="${N1(by + bh * 0.38)}" width="${N1(W * 0.06)}" height="${N1(bh * 0.24)}" style="fill:${GLASS};${glassStroke}"/>`;
    if (water) g += `<rect x="${N1(bx + 2)}" y="${N1(by + 2)}" width="${N1(px - bx - 2)}" height="${N1(bh - 4)}" style="fill:${LIQ};opacity:.45"/>`;
    const n = water ? 46 : Math.round(46 * (1 - out)); for (let i = 0; i < n; i++) { const p = P[i], cx = bx + 6 + p.x * (px - bx - 12), cy = by + 6 + p.y * (bh - 12); g += `<circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(Math.min(bh * 0.07, Fs * 0.36))}" style="fill:${water ? "#1565c0" : "#8e99a8"}"/>`; }
    if (!st.plug && F > 2) { if (water) g += `<path d="M${N1(bx - W * 0.06)},${N1(by + bh / 2)} q${N1(-W * 0.06)},${N1(-bh * 0.1)} ${N1(-W * 0.12)},${N1(bh * 0.5)}" style="fill:none;stroke:${LIQ};stroke-width:${N1(bh * 0.12)};stroke-linecap:round;opacity:.8"/>`; else for (let k = 0; k < 4; k++) g += `<circle cx="${N1(bx - W * (0.08 + 0.025 * k))}" cy="${N1(by + bh / 2 + (k % 2 ? -1 : 1) * bh * 0.12)}" r="${N1(bh * 0.05)}" style="fill:#8e99a8;opacity:${N1(1 - k * 0.2)}"/>`; }
    g += `<rect x="${N1(px)}" y="${N1(by + 3)}" width="${N1(W * 0.025)}" height="${N1(bh - 6)}" style="fill:#455a64"/><rect x="${N1(px)}" y="${N1(by + bh * 0.42)}" width="${N1(W * 0.2)}" height="${N1(bh * 0.16)}" style="fill:#78909c"/><rect x="${N1(px + W * 0.2)}" y="${N1(by - bh * 0.15)}" width="${N1(W * 0.025)}" height="${N1(bh * 1.3)}" rx="3" style="fill:#455a64"/>`;
    for (let v = 0; v <= 20; v += 2) { const xx = bx + bw * v / 20; g += `<line x1="${N1(xx)}" x2="${N1(xx)}" y1="${N1(by + bh)}" y2="${N1(by + bh - (v % 10 ? bh * 0.15 : bh * 0.28))}" style="stroke:var(--ink);stroke-width:1.3"/>`; if (v % 10 === 0) g += sX(xx, by + bh + Fs * 0.95, v + " mL", "middle", TK(Fs) * 0.95); }
    if (st.plug) g += `<text x="${N1(bx - W * 0.1)}" y="${N1(by + bh * 0.66)}" text-anchor="middle" style="font-size:${N1(bh * 0.6)}px">👉</text>`;
    const pres = st.plug ? (water ? 1 + F * 2 : 20 / V) : 1, gx = W * 0.5, gy = H * 0.1, frac = Math.min(1, (pres - 1) / 6);
    g += sX(gx, gy + Fs * 0.4, `Pression : ${pres > 50 ? "énorme !" : f1(pres) + " bar"}`, "middle", Fs * 0.85, `font-weight="800" style="fill:${frac > 0.9 ? "#c62828" : "var(--ink)"}"`);
    g += `<rect x="${N1(W * 0.25)}" y="${N1(H * 0.78)}" width="${N1(W * 0.5)}" height="${N1(Fs * 0.6)}" rx="6" style="fill:var(--surface-2);stroke:var(--line)"/><rect x="${N1(W * 0.25)}" y="${N1(H * 0.78)}" width="${N1(W * 0.5 * frac)}" height="${N1(Fs * 0.6)}" rx="6" style="fill:${frac > 0.9 ? "#c62828" : "#ff9800"}"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Seringue contenant de ${water ? "l'eau" : "l'air"}">${g}</svg>`;
  });
  let blasted = false;
  const paint = () => { press(el, "[data-fl]", b => b.dataset.fl === st.fl); $("[data-plug]", el).setAttribute("aria-pressed", String(st.plug)); $("[data-plug]", el).textContent = st.plug ? "☝ Doigt sur l'orifice : bouché" : "☝ Orifice ouvert"; $("[data-fv]", el).textContent = F; $("[data-f]", el).value = F; };
  const setF = v => { F = Math.max(0, Math.min(100, v)); paint(); };
  loop(el, dt => {
    const T = target(); V += (T - V) * Math.min(1, dt * 6); if (!st.plug && st.fl === "air" && F > 2) out = Math.min(0.85, out + dt * 0.3); if (F === 0) out = Math.max(0, out - dt);
    const water = st.fl === "eau", sp = water ? 0.04 : 0.6; P.forEach(p => { p.x += p.vx * dt * sp * (water ? 0.2 : 1) * 20 / Math.max(V, 3); p.y += p.vy * dt * sp; if (p.x < 0 || p.x > 1) { p.vx *= -1; p.x = Math.max(0, Math.min(1, p.x)); } if (p.y < 0 || p.y > 1) { p.vy *= -1; p.y = Math.max(0, Math.min(1, p.y)); } if (water) { p.x += (Math.random() - 0.5) * 0.004; p.y += (Math.random() - 0.5) * 0.004; } });
    fig.draw();
    if (F >= 80 && st.plug) { const k = st.fl + "B"; if (!st.t[k]) { st.t[k] = 1; keep(); } if (st.fl === "eau" && !blasted) { blasted = true; boom(el, ["😖", "💢", "🚫"], 10); } }
    if (F < 60) blasted = false;
    $("[data-ro]", el).innerHTML = `Volume occupé dans la seringue : <b>${f1(V)} mL</b>${st.plug ? "" : " · le contenu s'échappe par l'orifice !"}`;
  });
  $$("[data-fl]", el).forEach(b => b.onclick = () => { st.fl = b.dataset.fl; out = 0; V = 20; F = 0; keep(); paint(); });
  $("[data-plug]", el).onclick = () => { st.plug = !st.plug; out = 0; keep(); paint(); };
  $("[data-f]", el).addEventListener("input", e => setF(+e.target.value));
  $$("[data-fq]", el).forEach(b => b.onclick = () => setF(+b.dataset.fq));
  paint();
};
const serDone = () => { const t = xo("ser").t || {}; return !!(t.airB && t.eauB); };

/* =====================================================================
   2 · Lire une éprouvette : œil en face du bas du ménisque
   ===================================================================== */
const EPR = { 1: { vmin: 56, vmax: 82, minor: 2, major: 10, mid: 0, level: 74, lab: "Éprouvette ①" }, 2: { vmin: 40, vmax: 160, minor: 5, major: 50, mid: 10, level: 135, lab: "Éprouvette ②" } };
WID.eprouvette = el => {
  const st = xo("epr"); if (!EPR[st.k]) st.k = 1; if (!Number.isFinite(st.eye)) st.eye = -1; if (!st.ok || typeof st.ok !== "object") st.ok = {};
  el.innerHTML = `<div class="seg" role="group" aria-label="Éprouvette">${Object.keys(EPR).map(k => `<button type="button" data-k="${k}">${EPR[k].lab}</button>`).join("")}</div>
    <div class="field"><label>Position de ton œil : <b data-ev></b><input type="range" min="-1" max="1" step="0.1" data-e aria-label="Position de l'œil, de au-dessus à en dessous"></label></div>
    <div class="row">${[[-1, "⬆ Au-dessus"], [0, "👁 En face"], [1, "⬇ En dessous"]].map(([v, t]) => `<button type="button" class="btn ghost sm" data-eq="${v}">${t}</button>`).join("")}</div>
    <div class="figbox" data-fig></div><p class="readout" data-ro aria-live="polite"></p>`;
  const fig = liveSVG($("[data-fig]", el), (W, F) => {
    const c = EPR[st.k], H = Math.max(F * 15, Math.min(W * 0.75, F * 20)), cx = W < 420 ? Math.max(W * 0.2, F * 3) : W * 0.3, cw = Math.max(F * 2.6, W * 0.09), top = H * 0.08, ch = H * 0.84, C = cylinder(cx, top, cw, ch, c, c.level, { F, unit: "mL" }), yl = C.Y(c.level);
    const ey = yl + st.eye * H * 0.25, ex = W * 0.08;
    let g = C.svg + `<text x="${N1(ex)}" y="${N1(ey + F * 0.5)}" text-anchor="middle" style="font-size:${N1(F * 1.6)}px">👁</text><line x1="${N1(ex + F)}" y1="${N1(ey)}" x2="${N1(cx + cw * 0.5)}" y2="${N1(yl)}" style="stroke:#d62828;stroke-width:2" stroke-dasharray="6 4"/>`;
    const lx = Math.max(W * 0.56, cx + cw + F * 2.8), lw = W - lx - 4, lh = H * 0.62;
    g += `<line x1="${N1(cx + cw)}" y1="${N1(yl)}" x2="${N1(lx)}" y2="${N1(H * 0.15 + lh / 2)}" style="stroke:var(--accent);stroke-width:1.5" stroke-dasharray="3 3"/>` + loupe(lx, H * 0.15, lw, lh, c, c.level, st.eye, F);
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${c.lab} et loupe sur le ménisque">${g}</svg>`;
  });
  const paint = () => { press(el, "[data-k]", b => +b.dataset.k === st.k); $("[data-e]", el).value = st.eye; const e = st.eye; $("[data-ev]", el).textContent = Math.abs(e) < 0.05 ? "en face du ménisque" : e < 0 ? "au-dessus" : "en dessous"; if (Math.abs(e) < 0.05) { st.ok[st.k] = 1; } $("[data-ro]", el).innerHTML = Math.abs(e) < 0.05 ? `✓ Œil en face du <b>bas du ménisque</b> : lis la graduation dans la loupe.` : `⚠ L'œil n'est pas en face : la graduation semble décalée dans la loupe (erreur de parallaxe).`; keep(); fig.draw(); };
  $$("[data-k]", el).forEach(b => b.onclick = () => { st.k = +b.dataset.k; st.eye = -1; paint(); });
  $("[data-e]", el).addEventListener("input", e => { st.eye = Math.round(+e.target.value * 10) / 10; paint(); });
  $$("[data-eq]", el).forEach(b => b.onclick = () => { st.eye = +b.dataset.eq; paint(); });
  paint();
};
const eprDone = () => { const o = xo("epr").ok || {}; return !!(o[1] && o[2]); };

/* =====================================================================
   3 · Le volume de la pâte à modeler par déplacement d'eau
   ===================================================================== */
const IMM = { vmin: 0, vmax: 160, minor: 5, major: 50, mid: 10, w0: 100, vp: 25 };
WID.immersion = el => {
  const st = xo("imm"); if (!st.done || typeof st.done !== "object") st.done = {};
  let mode = 0, t = 0, run = false;
  el.innerHTML = `<p class="lead">${nb("L'éprouvette contient de l'eau. Plonge la pâte à modeler, puis recommence en la cassant en deux morceaux.")}</p>
    <div class="row"><button type="button" class="btn" data-go="1">🫳 Plonger la pâte</button><button type="button" class="btn" data-go="2">✂ Casser en deux et plonger</button><button type="button" class="btn ghost" data-go="0">↺ Retirer la pâte</button></div>
    <div class="figbox" data-fig></div><p class="readout" data-ro aria-live="polite"></p>`;
  const fig = liveSVG($("[data-fig]", el), (W, F) => {
    const H = Math.max(F * 15, Math.min(W * 0.75, F * 20)), cx = W < 420 ? Math.max(W * 0.12, F * 2.5) : W * 0.3, cw = Math.max(F * 3, W * 0.11), top = H * 0.08, ch = H * 0.84, k = ease(t), lev = IMM.w0 + (mode ? IMM.vp * Math.min(1, Math.max(0, (k - 0.55) / 0.45)) : 0);
    const C = cylinder(cx, top, cw, ch, IMM, lev, { F, unit: "mL" }); let g = C.svg;
    const blobs = mode === 2 ? [[0.35, 0.7], [0.65, 0.7]] : mode === 1 ? [[0.5, 1]] : [];
    blobs.forEach(([fx, s], i) => { const r = cw * 0.22 * s, x0 = W * 0.12 + i * F, y0 = top - F, x1 = cx + cw * fx, y1 = top + ch - r - 4 - i * r * 1.1, x = x0 + (x1 - x0) * Math.min(1, k * 1.4), y = y0 + (y1 - y0) * ease(k); g += `<ellipse cx="${N1(x)}" cy="${N1(y)}" rx="${N1(r * 1.15)}" ry="${N1(r)}" style="fill:${PATE};stroke:#8e1b54;stroke-width:1.5"/>`; });
    if (!mode) g += `<ellipse cx="${N1(Math.max(cx * 0.45, F))}" cy="${N1(top + ch - F)}" rx="${N1(cw * 0.25)}" ry="${N1(cw * 0.22)}" style="fill:${PATE};stroke:#8e1b54;stroke-width:1.5"/>` + sX(Math.max(cx * 0.45, F * 2.4), top + ch + F * 0.5, W < 420 ? "pâte" : "pâte à modeler", "middle", TK(F) * 0.9);
    if (mode && k > 0.5 && k < 0.85) { const yl = C.Y(lev); for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.15 + 0.7 * i / 6), d = (k - 0.5) * cw * 2.2; g += `<circle cx="${N1(cx + cw / 2 + Math.cos(a) * d)}" cy="${N1(yl + Math.sin(a) * d)}" r="${N1(F * 0.18)}" style="fill:${LIQ}"/>`; } }
    { const lx = Math.max(W * 0.56, cx + cw + F * 2.8); g += loupe(lx, H * 0.15, W - lx - 4, H * 0.62, IMM, lev, 0, F); }
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Éprouvette avec ${mode ? "la pâte à modeler immergée" : "de l'eau seule"}">${g}</svg>`;
  });
  const ro = () => { $("[data-ro]", el).innerHTML = mode ? (t >= 1 ? `La pâte (${mode === 1 ? "un morceau" : "deux morceaux"}) est entièrement immergée : lis le niveau dans la loupe.` : "…") : "Eau seule dans l'éprouvette : lis le niveau dans la loupe."; };
  $$("[data-go]", el).forEach(b => b.onclick = () => { mode = +b.dataset.go; t = mode ? 0 : 1; ro(); if (!mode) { fig.draw(); return; } if (run) return; run = true; loop(el, dt => { t = Math.min(1, t + dt / 1.6); fig.draw(); if (t >= 1) { run = false; st.done[mode] = 1; keep(); ro(); boom(el, ["💦", "💧"], 8); return false; } }); });
  ro();
};
const immDone = () => { const d = xo("imm").done || {}; return !!(d[1] && d[2]); };

/* =====================================================================
   4 · La balance électronique et la tare (gobelet + jus)
   ===================================================================== */
WID.balance = el => {
  /* modèle physique : masse brute sur le plateau (gobelet + jus versé) − tare ; une seule boucle d'animation pour tout le widget */
  const st = xo("bal"), G = 5.8, J = 161.2;
  if (!["rien", "gob"].includes(st.on)) st.on = st.on === "jus" ? "gob" : "rien"; if (!Number.isFinite(st.pour)) st.pour = 0; if (!Number.isFinite(st.tare)) st.tare = 0; if (!st.f || typeof st.f !== "object") st.f = {};
  if (st.pour > 0) st.pour = 1; /* un versement interrompu par un rechargement est considéré comme terminé */
  let pouring = false, msg = "";
  const gross = () => (st.on === "gob" ? G + J * st.pour : 0), net = () => Math.round((gross() - st.tare) * 10) / 10;
  let shown = net();
  el.innerHTML = `<div class="row"><button type="button" class="btn" data-a="gob">🥤 Poser le gobelet vide</button><button type="button" class="btn" data-a="jus">🍊 Verser le jus</button><button type="button" class="btn ghost" data-a="tare">TARE (remise à zéro)</button><button type="button" class="btn ghost" data-a="rien">↺ Tout enlever</button></div>
    <div class="figbox" data-fig></div><p class="readout" data-ro aria-live="polite"></p>`;
  const fig = liveSVG($("[data-fig]", el), (W, F) => {
    const H = Math.max(F * 12, W * 0.55), bw = Math.min(W * 0.8, F * 22), bx = (W - bw) / 2, by = H * 0.55, d = Math.round(shown * 10) / 10; let g = balance(bx, by, bw, gfmt(Object.is(d, -0) ? 0 : d), F, { tareHi: st.tare > 0 });
    if (st.on === "gob") {
      const gw = bw * 0.22, gh = bw * 0.26, gx = W / 2 - gw / 2, gy = by - gh, f = st.pour, inset = gw * 0.12;
      if (f > 0) { const top = gy + gh * (1 - 0.85 * f), k = (top - gy) / gh; g += `<path d="M${N1(gx + inset * k)},${N1(top)} L${N1(gx + inset)},${N1(gy + gh - 2)} L${N1(gx + gw - inset)},${N1(gy + gh - 2)} L${N1(gx + gw - inset * k)},${N1(top)} Z" style="fill:#ff9f1c;opacity:.9"/>`; }
      g += `<path d="M${N1(gx)},${N1(gy)} L${N1(gx + inset)},${N1(gy + gh)} L${N1(gx + gw - inset)},${N1(gy + gh)} L${N1(gx + gw)},${N1(gy)} Z" style="fill:${GLASS};${glassStroke}"/>`;
      if (pouring) g += `<path d="M${N1(gx + gw * 0.9)},${N1(gy - bw * 0.25)} Q${N1(gx + gw * 0.6)},${N1(gy - bw * 0.1)} ${N1(gx + gw * 0.55)},${N1(gy + gh * 0.9)}" style="fill:none;stroke:#ff9f1c;stroke-width:${N1(F * 0.35)};stroke-linecap:round"/><text x="${N1(gx + gw * 1.1)}" y="${N1(gy - bw * 0.2)}" style="font-size:${N1(F * 2.2)}px">🫗</text>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Balance électronique affichant ${gfmt(d)} g">${g}</svg>`;
  });
  const ro = () => { const on = st.on === "rien" ? "rien" : st.pour >= 1 ? "le gobelet et le jus" : st.pour > 0 ? "le gobelet, en train de se remplir" : "le gobelet vide"; $("[data-ro]", el).innerHTML = `Sur la balance : <b>${on}</b>${st.tare ? ` · tare faite (la balance a été remise à zéro avec ${f1(st.tare)} g sur le plateau)` : ""}${msg ? `<br>${msg}` : ""}`; };
  loop(el, dt => {
    if (pouring) { st.pour = Math.min(1, st.pour + dt / 1.6); if (st.pour >= 1) { pouring = false; if (Math.abs(st.tare - G) < 0.05) st.f.jusTare = 1; else if (!st.tare) st.f.jusSans = 1; else msg = "⚠ La tare a été faite pendant le versement : la balance n'affiche pas la masse de tout le jus. Recommence."; keep(); ro(); } }
    const goal = net(), k = Math.min(1, dt * (pouring ? 9 : 12)); shown += (goal - shown) * k; if (Math.abs(goal - shown) < 0.05) shown = goal;
    fig.draw();
  });
  $$("[data-a]", el).forEach(b => b.onclick = () => {
    const a = b.dataset.a; msg = "";
    if (a === "gob") { if (st.on === "gob") msg = "Le gobelet est déjà sur le plateau."; else { st.on = "gob"; st.pour = 0; if (!st.tare) st.f.gob = 1; } }
    else if (a === "jus") { if (st.on !== "gob") msg = "Pose d'abord le gobelet sur le plateau."; else if (st.pour >= 1 || pouring) msg = "Le gobelet est déjà plein."; else pouring = true; }
    else if (a === "tare") { st.tare = Math.round(gross() * 10) / 10; shown = net(); if (st.on === "gob" && st.pour === 0) st.f.tareGob = 1; if (pouring) msg = "⚠ Tare faite pendant le versement !"; }
    else { st.on = "rien"; st.pour = 0; st.tare = 0; pouring = false; shown = 0; }
    keep(); ro(); fig.draw();
  });
  ro();
};
const balDone = () => { const f = xo("bal").f || {}; return !!(f.gob && f.jusTare); };

/* ---------- balances « énoncé » (affichage fixe) et vérification débloquée ---------- */
function staticBalances(el, items, cap) {
  el.innerHTML = `<div class="sbal">${items.map((_, i) => `<div class="figbox" data-i="${i}"></div>`).join("")}</div>${cap ? `<p class="cap">${cap}</p>` : ""}`;
  items.forEach((it, i) => liveSVG($(`[data-i="${i}"]`, el), (W, F) => { const H = Math.max(F * 11, W * 0.62), bw = Math.min(W * 0.92, F * 18), bx = (W - bw) / 2, by = H * 0.6; let g = balance(bx, by, bw, it.d, F, { unit: it.u }); g += `<text x="${N1(W / 2)}" y="${N1(by - F * 0.4)}" text-anchor="middle" style="font-size:${N1(Math.min(F * 4, bw * 0.28))}px">${it.ic}</text>` + sX(W / 2, F * 1.1, it.t, "middle", F * 0.85, `font-weight="800"`); return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(it.t)} : ${esc(it.d)} ${it.u || "g"}">${g}</svg>`; }));
}
WID.bouteilles = el => staticBalances(el, [{ t: "Grande bouteille 1,5 L, vide", d: "37", ic: "🍾" }, { t: "Petite bouteille 50 cL, pleine", d: "521", ic: "🧴" }, { t: "1 L d'eau", d: "1000", ic: "🧊" }], nb("La balance affiche la masse en grammes. Rappel : 1 L d'eau a une masse de 1 kg, soit 1 000 g."));
WID.becher = el => staticBalances(el, [{ t: "Bécher vide (tare faite)", d: "0", ic: "🫙" }, { t: "Bécher + 250 mL de liquide", d: "250", ic: "🧪" }]);
WID.verifBouteilles = el => {
  let s = { big: false, small: true };
  el.innerHTML = `<p class="lead">Vérifie tes calculs : remplis ou vide les bouteilles.</p><div class="row"><button type="button" class="btn" data-b="big">🍾 Remplir / vider la grande bouteille</button><button type="button" class="btn" data-b="small">🧴 Remplir / vider la petite bouteille</button></div><div data-z></div>`;
  const paint = () => staticBalances($("[data-z]", el), [{ t: `Grande bouteille ${s.big ? "pleine" : "vide"}`, d: s.big ? "1537" : "37", ic: "🍾" }, { t: `Petite bouteille ${s.small ? "pleine" : "vide"}`, d: s.small ? "521" : "21", ic: "🧴" }]);
  $$("[data-b]", el).forEach(b => b.onclick = () => { s[b.dataset.b] = !s[b.dataset.b]; paint(); boom(el, ["💧"], 6); }); paint();
};

/* =====================================================================
   5 · Arcade : barre les mesures qui ne sont pas des volumes
   ===================================================================== */
const TRI = ["8,82 L", "0,787 m³", "0,046 mL", "7,26 cm³", "405 cL", "0,054 dm³", "0,0004 mg", "975 hL", "96,5 kg", "0,502 g", "53,5 dL", "99 g", "1,11 kg", "0,004 dL", "86,8 cL", "471 L", "0,035 dm³", "0,218 mg", "0,962 m³", "2,47 hL", "284 cm³", "0,022 mL"];
const isMass = s => /\s(mg|g|kg)$/.test(s);
WID.tri = el => {
  const st = xo("tri"); if (!Array.isArray(st.x)) st.x = []; let t0 = null, tim = null, res = null;
  el.innerHTML = `<p class="lead">${nb("⚡ Défi chrono : touche les mesures qui ne sont PAS des volumes pour les barrer, le plus vite possible. Touche à nouveau pour annuler.")}</p>
    <div class="row"><span class="chrono" data-c>⏱ 0,0 s</span><span class="chip" data-best></span></div><div class="trig" data-g></div>
    <div class="row"><button type="button" class="btn" data-v>✔ Valider mon tri</button><button type="button" class="btn ghost" data-r>↺ Recommencer</button></div><div data-res aria-live="polite"></div>`;
  const paint = () => {
    $("[data-g]", el).innerHTML = TRI.map((s, i) => { const on = st.x.includes(i), cls = res ? (on && isMass(s) ? "is-ok" : on && !isMass(s) ? "is-bad" : !on && isMass(s) ? "miss" : "") : ""; return `<button type="button" class="tchip ${on ? "struck" : ""} ${cls}" data-i="${i}" aria-pressed="${on}">${s}${res && cls === "is-bad" ? " ✗" : res && cls === "miss" ? " ⟵ oubliée" : ""}</button>`; }).join("");
    $$("[data-i]", el).forEach(b => b.onclick = () => { if (!t0) { t0 = performance.now(); tim = setInterval(() => { if (!document.body.contains(el)) return clearInterval(tim); $("[data-c]", el).textContent = "⏱ " + f1((performance.now() - t0) / 1000) + " s"; }, 100); } const i = +b.dataset.i, k = st.x.indexOf(i); if (k >= 0) st.x.splice(k, 1); else st.x.push(i); res = null; $("[data-res]", el).innerHTML = ""; keep(); paint(); const n = $(`[data-i="${i}"]`, el); if (n) { n.focus(); n.classList.add("pop"); } });
    $("[data-best]", el).textContent = st.best ? "🏆 Record : " + f1(st.best) + " s" : "🏆 Pas encore de record";
  };
  $("[data-v]", el).onclick = () => {
    const good = TRI.map((s, i) => i).filter(i => isMass(TRI[i])), ok = good.every(i => st.x.includes(i)) && st.x.every(i => isMass(TRI[i])), dt = t0 ? (performance.now() - t0) / 1000 : 0; clearInterval(tim);
    res = true; paint();
    if (ok) { st.ok = 1; if (dt && (!st.best || dt < st.best)) st.best = dt; keep(); paint(); boom(el, ["🎉", "⚡", "🏆", "✨"], 18); $("[data-res]", el).innerHTML = `<p class="fb ok">✓ Tri parfait${dt ? " en " + f1(dt) + " s" : ""} : les ${good.length} masses sont barrées.</p>`; }
    else { const miss = good.filter(i => !st.x.includes(i)).length, bad = st.x.filter(i => !isMass(TRI[i])).length; $("[data-res]", el).innerHTML = `<p class="fb bad">✗ Pas encore : ${miss} mesure(s) oubliée(s), ${bad} volume(s) barré(s) à tort.</p>`; boom(el, ["💥"], 4); }
    t0 = null;
  };
  $("[data-r]", el).onclick = () => { st.x = []; res = null; t0 = null; clearInterval(tim); $("[data-c]", el).textContent = "⏱ 0,0 s"; $("[data-res]", el).innerHTML = ""; keep(); paint(); };
  paint();
};
const triOk = () => !!xo("tri").ok;

/* =====================================================================
   6 · Le tableau de conversion (volumes et capacités, masses)
   ===================================================================== */
const TABV = { cols: ["m³", "", "", "dm³", "", "", "cm³", "", "", "mm³"], heads: [["m³", 3], ["dm³", 3], ["cm³", 3], ["mm³", 3]], sub: ["", "", "kL", "hL", "daL", "L", "dL", "cL", "mL", "", "", ""], unit: { "m³": 2, "dm³": 5, "cm³": 8, "mm³": 11, kL: 2, hL: 3, daL: 4, L: 5, dL: 6, cL: 7, mL: 8 }, n: 12 };
const TABM = { heads: [["kg", 1], ["hg", 1], ["dag", 1], ["g", 1], ["dg", 1], ["cg", 1], ["mg", 1]], sub: [], unit: { kg: 0, hg: 1, dag: 2, g: 3, dg: 4, cg: 5, mg: 6 }, n: 7 };
WID.tableau = el => {
  const st = xo("tab"); if (!st.kind) st.kind = "v"; if (!st.val) st.val = "240,7"; if (!st.u) st.u = "mL"; if (!st.to) st.to = "L";
  el.innerHTML = `<p class="lead">${nb("Le tableau de conversion : écris un nombre, choisis son unité. Le chiffre des unités se place dans la colonne de l'unité. Choisis ensuite l'unité d'arrivée : la virgule saute dans cette colonne, et c'est à toi de lire le résultat (attention aux zéros à ajouter dans les cases « ? »).")}</p>
    <div class="seg" role="group" aria-label="Tableau"><button type="button" data-kind="v">Volumes et capacités</button><button type="button" data-kind="m">Masses</button></div>
    <div class="row"><label class="plab" for="tabv">Nombre</label><input id="tabv" class="inp" inputmode="decimal" autocomplete="off" style="max-width:9rem"><span class="plab">Unité de départ</span></div><div class="seg" data-from></div>
    <p class="plab">Unité d'arrivée</p><div class="seg" data-to></div><div class="tablewrap"><div data-t></div></div><p class="readout" data-ro aria-live="polite"></p>`;
  const T = () => st.kind === "v" ? TABV : TABM;
  const paint = () => {
    const tb = T(), units = Object.keys(tb.unit); if (!tb.unit.hasOwnProperty(st.u)) st.u = units[0]; if (!tb.unit.hasOwnProperty(st.to)) st.to = units[1];
    press(el, "[data-kind]", b => b.dataset.kind === st.kind);
    $("[data-from]", el).innerHTML = units.map(u => `<button type="button" data-u="${u}" aria-pressed="${u === st.u}">${u}</button>`).join("");
    $("[data-to]", el).innerHTML = units.map(u => `<button type="button" data-to2="${u}" aria-pressed="${u === st.to}">${u}</button>`).join("");
    const raw = String(st.val).replace(/\s/g, "").replace(".", ","), m = raw.match(/^(\d*)(?:,(\d*))?$/), ip = m ? (m[1] || "0").replace(/^0+(?=\d)/, "") : "", dp = m ? (m[2] || "") : "", cu = tb.unit[st.u], ct = tb.unit[st.to], n = tb.n;
    const cells = new Array(n).fill(null); let okFit = !!m;
    ip.split("").reverse().forEach((d, i) => { const c = cu - i; if (c < 0) okFit = false; else cells[c] = d; });
    dp.split("").forEach((d, i) => { const c = cu + 1 + i; if (c >= n) okFit = false; else cells[c] = d; });
    const filled = cells.map((c, i) => c !== null ? i : -1).filter(i => i >= 0), lo = Math.min(...filled, ct), hi = Math.max(...filled, ct);
    let h = `<table class="t conv"><thead><tr>${tb.heads.map(([u, s]) => `<th colspan="${s}" class="${u === st.to ? "tgt" : ""}">${u}</th>`).join("")}</tr>${tb.sub.length ? `<tr>${tb.sub.map(s => `<th class="sub">${s}</th>`).join("")}</tr>` : ""}</thead><tbody><tr>`;
    for (let i = 0; i < n; i++) { const d = cells[i], need = d === null && i >= lo && i <= hi, isT = i === ct; h += `<td class="${isT ? "tgt" : ""} ${i === cu ? "src" : ""} ${need ? "need" : ""}">${d !== null ? `<b>${d}</b>` : need ? "?" : ""}${i === ct ? `<span class="comma" aria-label="virgule d'arrivée">,</span>` : ""}${i === cu && i !== ct ? `<span class="comma0" aria-hidden="true">,</span>` : ""}</td>`; }
    h += `</tr></tbody></table>`; $("[data-t]", el).innerHTML = h;
    $("[data-ro]", el).innerHTML = !m ? "Écris un nombre (avec une virgule si besoin)." : !okFit ? "Ce nombre ne tient pas dans le tableau : choisis une autre unité." : `${nb(raw)} ${st.u} → ? ${st.to} · la virgule d'arrivée est la <b>virgule rouge</b>, juste après la colonne « ${st.to} ». Lis les chiffres de gauche à droite et complète les cases « ? » par des zéros.`;
    $$("[data-u]", el).forEach(b => b.onclick = () => { st.u = b.dataset.u; keep(); paint(); $(`[data-u="${st.u}"]`, el).focus(); });
    $$("[data-to2]", el).forEach(b => b.onclick = () => { st.to = b.dataset.to2; keep(); paint(); $(`[data-to2="${st.to}"]`, el).focus(); const c = $(".comma", el); if (c) c.classList.add("jump"); });
  };
  const inp = $("#tabv", el); inp.value = st.val; inp.addEventListener("input", () => { st.val = inp.value; keep(); paint(); });
  $$("[data-kind]", el).forEach(b => b.onclick = () => { st.kind = b.dataset.kind; if (st.kind === "m") { st.u = "g"; st.to = "cg"; st.val = "47,5"; } else { st.u = "mL"; st.to = "L"; st.val = "240,7"; } inp.value = st.val; keep(); paint(); });
  paint();
};

/* =====================================================================
   7 · L'eau (1 L = 1 kg) et les lingots d'or et d'argent
   ===================================================================== */
WID.eau = el => {
  const st = xo("eau"); if (!Number.isFinite(st.L)) st.L = 0; let shown = st.L;
  el.innerHTML = `<p class="lead">${nb("Verse de l'eau litre par litre dans l'aquarium posé sur la balance (en kilogrammes).")}</p><div class="row"><button type="button" class="btn" data-p="1">💧 +1 L</button><button type="button" class="btn ghost" data-p="0">↺ Vider</button></div><div class="figbox" data-fig></div><div data-tab></div>`;
  const fig = liveSVG($("[data-fig]", el), (W, F) => { const H = Math.max(F * 12, W * 0.55), bw = Math.min(W * 0.8, F * 22), bx = (W - bw) / 2, by = H * 0.62, aw = bw * 0.5, ah = bw * 0.32, ax = W / 2 - aw / 2, ay = by - ah, lv = Math.min(1, shown / 5); let g = balance(bx, by, bw, fmt(shown, 0), F, { unit: "kg" }) + `<rect x="${N1(ax)}" y="${N1(ay)}" width="${N1(aw)}" height="${N1(ah)}" style="fill:${GLASS};${glassStroke}"/><rect x="${N1(ax + 2)}" y="${N1(ay + ah * (1 - lv * 0.9))}" width="${N1(aw - 4)}" height="${N1(ah * lv * 0.9)}" style="fill:${LIQ};opacity:.8"/>`; for (let k = 1; k <= 5; k++) g += `<line x1="${N1(ax + aw)}" x2="${N1(ax + aw - aw * 0.1)}" y1="${N1(ay + ah * (1 - k / 5 * 0.9))}" y2="${N1(ay + ah * (1 - k / 5 * 0.9))}" style="stroke:var(--ink)"/>` + sX(ax + aw + 4, ay + ah * (1 - k / 5 * 0.9) + F * 0.3, k + " L", "start", TK(F) * 0.85); return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${st.L} litres d'eau sur la balance">${g}</svg>`; });
  const tab = () => { $("[data-tab]", el).innerHTML = st.L ? tbl(["Volume d'eau", ...Array.from({ length: st.L }, (_, i) => (i + 1) + " L")], [["Masse", ...Array.from({ length: st.L }, (_, i) => (i + 1) + " kg")]]) : ""; };
  $$("[data-p]", el).forEach(b => b.onclick = () => { st.L = b.dataset.p === "1" ? Math.min(5, st.L + 1) : 0; if (st.L >= 3) st.ok = 1; keep(); tab(); loop(el, dt => { shown += (st.L - shown) * Math.min(1, dt * 5); fig.draw(); if (Math.abs(st.L - shown) < 0.01) { shown = st.L; fig.draw(); return false; } }); if (st.L === 5) boom(el, ["💧", "💦"], 8); });
  tab();
};
const eauOk = () => !!xo("eau").ok;
const LING = { or: { m: 2, v: 104, c: "#f5c518", n: "or" }, ag: { m: 3, v: 286, c: "#c9d1d9", n: "argent" } };
WID.lingots = el => {
  const st = xo("ling"); if (!LING[st.k]) st.k = "or"; if (!Number.isFinite(st.n)) st.n = 1; if (!st.seen || typeof st.seen !== "object") st.seen = {};
  el.innerHTML = `<div class="seg" role="group" aria-label="Métal"><button type="button" data-k="or">🥇 Lingots d'or</button><button type="button" data-k="ag">🥈 Lingots d'argent</button></div><div class="row"><button type="button" class="btn" data-n="1">+ 1 lingot</button><button type="button" class="btn ghost" data-n="0">↺ Un seul lingot</button></div><div class="figbox" data-fig></div><p class="readout" data-ro aria-live="polite"></p>`;
  const fig = liveSVG($("[data-fig]", el), (W, F) => { const L = LING[st.k], H = Math.max(F * 10, W * 0.42), bw = W * 0.2, bh = bw * 0.32; let g = ""; for (let i = 0; i < st.n; i++) { const x = W * 0.08 + (i % 2) * bw * 0.6, y = H * 0.82 - (i + 1) * bh * 1.05; g += `<path d="M${N1(x)},${N1(y + bh)} L${N1(x + bw * 0.15)},${N1(y)} L${N1(x + bw * 0.85)},${N1(y)} L${N1(x + bw)},${N1(y + bh)} Z" style="fill:${L.c};stroke:#7a5b00;stroke-width:1.5"/>` + sX(x + bw / 2, y + bh * 0.72, L.m + " kg", "middle", F * 0.7, `font-weight="800" style="fill:#3a2b00"`); } g += `<text x="${N1(W * 0.62)}" y="${N1(H * 0.45)}" text-anchor="middle" style="font-size:${N1(F * 1.1)}px;font-weight:800;fill:var(--ink)">${st.n} lingot${st.n > 1 ? "s" : ""} d'${L.n}</text>` + sX(W * 0.62, H * 0.45 + F * 1.4, st.n === 1 ? `masse : ${L.m} kg · volume : ${L.v} cm³` : "masse totale ? · volume total ?", "middle", F * 0.85, `font-weight="700"`); return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${st.n} lingots d'${L.n}">${g}</svg>`; });
  const paint = () => { press(el, "[data-k]", b => b.dataset.k === st.k); st.seen[st.k + st.n] = 1; $("[data-ro]", el).innerHTML = st.n === 1 ? nb(`Un lingot d'${LING[st.k].n} : ${LING[st.k].m} kg pour ${LING[st.k].v} cm³.`) : nb(`${st.n} lingots identiques : à toi de calculer leur masse et leur volume (tableau de proportionnalité).`); keep(); fig.draw(); };
  $$("[data-k]", el).forEach(b => b.onclick = () => { st.k = b.dataset.k; st.n = 1; paint(); });
  $$("[data-n]", el).forEach(b => b.onclick = () => { st.n = b.dataset.n === "1" ? Math.min(4, st.n + 1) : 1; paint(); if (st.n === 4) boom(el, ["✨", "💰"], 8); });
  paint();
};

/* =====================================================================
   8 · Huile et glaçons dans une éprouvette, sur la balance
   ===================================================================== */
const HG = { vmin: 0, vmax: 200, minor: 2, major: 20, mid: 10, oil: 110, ice: 66, water: 60, m0: 215, mi: 60 };
WID.huile = el => {
  const st = xo("hg"); if (!Number.isFinite(st.s)) st.s = 0; let melt = st.s >= 3 ? 1 : 0, run = false;
  el.innerHTML = `<div class="row"><button type="button" class="btn" data-s="1">① Verser l'huile</button><button type="button" class="btn" data-s="2">② Ajouter les glaçons</button><button type="button" class="btn" data-s="3">③ Attendre la fusion ▶</button><button type="button" class="btn ghost" data-s="0">↺ Recommencer</button></div><div class="figbox" data-fig></div><p class="readout" data-ro aria-live="polite"></p>`;
  const fig = liveSVG($("[data-fig]", el), (W, F) => {
    const H = Math.max(F * 16, Math.min(W * 0.8, F * 21)), cw = Math.max(F * 3, W * 0.1), cx = W < 420 ? Math.max(W * 0.08, F) : W * 0.22, top = H * 0.06, ch = H * 0.62, s = st.s;
    const iceV = s >= 2 ? HG.ice * (1 - melt) : 0, wat = s >= 2 ? HG.water * melt : 0, oil = s >= 1 ? HG.oil : 0, total = oil + iceV + wat;
    const layers = []; if (wat > 0.5) layers.push({ v: wat, c: LIQ }); if (oil) layers.push({ v: wat + oil + iceV, c: OIL });
    const C = cylinder(cx, top, cw, ch, HG, Math.max(total, 0.01), { F, unit: "cm³", layers: layers.length ? layers : [{ v: 0.01, c: "transparent" }] }); let g = C.svg;
    if (iceV > 0.5) { const n = 4; for (let i = 0; i < n; i++) { const sz = cw * 0.3 * Math.cbrt(1 - melt), y = C.Y(wat + oil + iceV) + 4 + i * sz * 0.9; g += `<rect x="${N1(cx + cw * (0.2 + 0.3 * (i % 2)))}" y="${N1(y)}" width="${N1(sz)}" height="${N1(sz)}" rx="3" style="fill:${ICE};stroke:#6fb6e6;stroke-width:1.5;opacity:.95"/>`; } }
    if (s >= 2 && melt > 0 && melt < 1) for (let i = 0; i < 5; i++) { const y = C.Y(wat + oil * ((i * 0.23 + melt * 3) % 1)); g += `<circle cx="${N1(cx + cw * (0.3 + 0.1 * i))}" cy="${N1(y)}" r="${N1(F * 0.2)}" style="fill:${LIQ}"/>`; }
    const bw = Math.min(W * 0.5, F * 16), by = top + ch + F * 1.4; g += balance(cx + cw / 2 - bw / 2, by, bw, fmt(s === 0 ? 114 : s === 1 ? HG.m0 : HG.m0 + HG.mi, 0), F);
    const lx = Math.max(W * 0.58, cx + cw + F * 2.8); g += loupe(lx, H * 0.08, W - lx - 4, H * 0.5, HG, total || 0.01, 0, F);
    if (s >= 1) g += sX((lx + W) / 2, H * 0.66, s === 1 ? "huile" : melt >= 1 ? "huile + eau de fusion" : melt > 0 ? "les glaçons fondent…" : "huile + glaçons", "middle", F * 0.9, `font-weight="800"`);
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Éprouvette sur une balance, étape ${s}">${g}</svg>`;
  });
  const ro = () => { $("[data-ro]", el).innerHTML = ["Éprouvette vide sur la balance.", "Étape 1 : huile dans l'éprouvette.", "Étape 2 : huile et glaçons.", melt < 1 ? "Étape 3 : fusion en cours…" : "Étape 3 : après la fusion de tous les glaçons."][st.s] + " Lis le volume dans la loupe et la masse sur la balance."; };
  $$("[data-s]", el).forEach(b => b.onclick = () => {
    const s = +b.dataset.s; if (s > st.s + 1) { $("[data-ro]", el).textContent = "Fais les étapes dans l'ordre."; return; }
    st.s = s; melt = 0; keep(); ro(); fig.draw();
    if (s === 2) boom(el, ["🧊"], 6);
    if (s === 3 && !run) { run = true; loop(el, dt => { melt = Math.min(1, melt + dt / 4); fig.draw(); if (melt >= 1) { run = false; st.melted = 1; keep(); ro(); boom(el, ["💧", "✨"], 8); return false; } }); }
  });
  ro();
};
const hgDone = () => !!xo("hg").melted;

/* =====================================================================
   9 · Glaçons dans un flacon fermé (ou ouvert) sur la balance
   ===================================================================== */
WID.flacon = el => {
  const st = xo("fla"); if (st.closed === undefined) st.closed = true; let melt = 0, evap = 0, run = false;
  el.innerHTML = `<div class="row"><button type="button" class="btn ghost" data-c aria-pressed="true"></button></div><div class="row"><button type="button" class="btn" data-m>▶ Laisser fondre les glaçons</button><button type="button" class="btn" data-e>🕒 Attendre 3 jours</button><button type="button" class="btn ghost" data-r>↺ Recommencer</button></div><div class="figbox" data-fig></div><p class="readout" data-ro aria-live="polite"></p>`;
  const mass = () => 167.2 - (st.closed ? 0 : 25 * evap);
  const fig = liveSVG($("[data-fig]", el), (W, F) => {
    const H = Math.max(F * 13, W * 0.6), bw = Math.min(W * 0.7, F * 20), bx = (W - bw) / 2, by = H * 0.66, fw = bw * 0.36, fh = bw * 0.42, fx = W / 2 - fw / 2, fy = by - fh;
    let g = balance(bx, by, bw, f1(mass()), F) + `<path d="M${N1(fx + fw * 0.38)},${N1(fy)} L${N1(fx + fw * 0.38)},${N1(fy + fh * 0.35)} L${N1(fx)},${N1(fy + fh)} L${N1(fx + fw)},${N1(fy + fh)} L${N1(fx + fw * 0.62)},${N1(fy + fh * 0.35)} L${N1(fx + fw * 0.62)},${N1(fy)}" style="fill:${GLASS};${glassStroke}"/>`;
    if (st.closed) g += `<rect x="${N1(fx + fw * 0.35)}" y="${N1(fy - fh * 0.1)}" width="${N1(fw * 0.3)}" height="${N1(fh * 0.13)}" rx="3" style="fill:#8d6e63"/>`;
    const wl = (melt * 0.45) * (1 - evap); if (wl > 0.01) g += `<path d="M${N1(fx + fw * 0.06)},${N1(fy + fh * (1 - wl * 0.5))} L${N1(fx + 2)},${N1(fy + fh - 2)} L${N1(fx + fw - 2)},${N1(fy + fh - 2)} L${N1(fx + fw * 0.94)},${N1(fy + fh * (1 - wl * 0.5))} Z" style="fill:${LIQ};opacity:.8"/>`;
    for (let i = 0; i < 5; i++) { const sz = fw * 0.16 * Math.cbrt(Math.max(0, 1 - melt)); if (sz > 1) g += `<rect x="${N1(fx + fw * (0.15 + 0.14 * i))}" y="${N1(fy + fh - sz - 3 - (i % 2) * sz)}" width="${N1(sz)}" height="${N1(sz)}" rx="2" style="fill:${ICE};stroke:#6fb6e6;stroke-width:1.2"/>`; }
    if (!st.closed && evap > 0 && evap < 1) for (let i = 0; i < 4; i++) g += `<text x="${N1(fx + fw * 0.5 + (i - 1.5) * F)}" y="${N1(fy - F * (0.5 + ((evap * 4 + i * 0.3) % 1) * 2))}" style="font-size:${N1(F)}px;opacity:.7">〰</text>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Flacon ${st.closed ? "fermé" : "ouvert"} sur une balance affichant ${f1(mass())} g">${g}</svg>`;
  });
  const ro = () => { $("[data-c]", el).textContent = st.closed ? "🔒 Flacon fermé par un bouchon" : "🔓 Flacon ouvert"; $("[data-c]", el).setAttribute("aria-pressed", String(st.closed)); $("[data-ro]", el).innerHTML = (melt <= 0 ? "Glaçons dans le flacon." : melt < 1 ? "Les glaçons fondent…" : evap > 0 ? `Trois jours plus tard, flacon ${st.closed ? "fermé" : "ouvert"}.` : "Toute la glace a fondu.") + " Lis la masse sur la balance."; };
  const go = (key, dur, f) => { if (run) return; run = true; loop(el, dt => { const v = f(dt / dur); fig.draw(); ro(); if (v >= 1) { run = false; st[key + (st.closed ? "F" : "O")] = 1; keep(); return false; } }); };
  $("[data-c]", el).onclick = () => { if (run) return; st.closed = !st.closed; melt = 0; evap = 0; keep(); ro(); fig.draw(); };
  $("[data-m]", el).onclick = () => go("m", 4, d => (melt = Math.min(1, melt + d)));
  $("[data-e]", el).onclick = () => { if (melt < 1) { $("[data-ro]", el).textContent = "Laisse d'abord fondre les glaçons."; return; } go("e", 3, d => (evap = Math.min(1, evap + d))); };
  $("[data-r]", el).onclick = () => { if (run) return; melt = 0; evap = 0; ro(); fig.draw(); };
  ro();
};
const flaDone = () => { const s = xo("fla"); return !!(s.mF); };

/* =====================================================================
   10 · Des roches qui éclatent sous l'effet du gel
   ===================================================================== */
WID.roche = el => {
  const st = xo("roc"); let wet = 0, T = 10, burst = 0, run = false;
  el.innerHTML = `<div class="row"><button type="button" class="btn" data-p>🌧 Pluie d'automne</button><button type="button" class="btn ghost" data-r>↺ Recommencer</button></div><div class="field"><label>Température de l'hiver : <b data-tv></b><input type="range" min="-15" max="10" step="1" value="10" data-t aria-label="Température en degrés Celsius, de moins 15 à 10"></label></div><div class="figbox" data-fig></div><p class="readout" data-ro aria-live="polite"></p>`;
  const frozen = () => wet > 0.9 && T < 0;
  const fig = liveSVG($("[data-fig]", el), (W, F) => {
    const H = Math.max(F * 12, W * 0.5), cx = W * 0.45, cy = H * 0.58, R = Math.min(W * 0.3, H * 0.38), open = frozen() ? Math.min(1, (0 - T) / 5) : 0, gapw = R * (0.04 + 0.08 * open) + burst * R * 0.6;
    let g = `<rect x="0" y="${N1(cy + R * 0.7)}" width="${N1(W)}" height="${N1(H - cy - R * 0.7)}" style="fill:${T < 0 ? "#e8f1f7" : "#8bb174"}"/>`;
    const half = (s) => `<path transform="translate(${N1(s * gapw / 2 + s * burst * R * 0.5)} ${N1(-burst * R * 0.25 * (s > 0 ? 1 : 0.6))}) rotate(${N1(s * burst * 18)} ${N1(cx)} ${N1(cy)})" d="M${N1(cx)},${N1(cy - R)} ${s < 0 ? `Q${N1(cx - R * 1.3)},${N1(cy - R * 0.8)} ${N1(cx - R * 1.1)},${N1(cy + R * 0.2)} Q${N1(cx - R)},${N1(cy + R * 0.75)} ${N1(cx - R * 0.1)},${N1(cy + R * 0.75)}` : `Q${N1(cx + R * 1.2)},${N1(cy - R)} ${N1(cx + R * 1.15)},${N1(cy + R * 0.1)} Q${N1(cx + R)},${N1(cy + R * 0.78)} ${N1(cx - R * 0.1)},${N1(cy + R * 0.75)}`} L${N1(cx + R * 0.05)},${N1(cy + R * 0.2)} L${N1(cx - R * 0.08)},${N1(cy - R * 0.3)} Z" style="fill:#9e8f80;stroke:#5d4f44;stroke-width:2"/>`;
    g += half(-1) + half(1);
    if (wet > 0 && burst < 0.5) g += `<path d="M${N1(cx)},${N1(cy - R)} L${N1(cx - R * 0.08)},${N1(cy - R * 0.3)} L${N1(cx + R * 0.05)},${N1(cy + R * 0.2)} L${N1(cx - R * 0.1)},${N1(cy + R * 0.75)}" style="fill:none;stroke:${frozen() ? "#bfe6ff" : LIQ};stroke-width:${N1(gapw * 1.4 * wet + 2)};stroke-linejoin:round;opacity:.95"/>`;
    if (frozen() && burst < 0.5) g += sX(cx + R * 0.35, cy - R * 0.55, `glace : +${fmt(Math.round(9 * open))} % de volume`, "start", F * 0.85, `font-weight="800" style="fill:#0d47a1"`);
    g += sX(W - F * 0.6, F * 1.4, `${T} °C`, "end", F * 1.3, `font-weight="900" style="fill:${T < 0 ? "#1565c0" : "#c62828"}"`);
    if (T < 0) for (let i = 0; i < 12; i++) g += `<text x="${N1((i * 97) % W)}" y="${N1((i * 53 + Date.now() / 30) % (cy))}" style="font-size:${N1(F * 0.8)}px;opacity:.6">❄</text>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Roche fissurée à ${T} degrés">${g}</svg>`;
  });
  const ro = () => { $("[data-tv]", el).textContent = T + " °C"; $("[data-ro]", el).innerHTML = burst >= 1 ? "💥 La roche a éclaté !" : !wet ? "Roche sèche, avec une fissure." : T >= 0 ? "La fissure est remplie d'eau liquide. Fais baisser la température." : "L'eau de la fissure a gelé…"; };
  const tick = () => { if (run) return; run = true; loop(el, dt => { fig.draw(); if (frozen() && T <= -5 && burst < 1) { if (burst === 0) boom(el, ["💥", "🪨", "❄"], 16); burst = Math.min(1, burst + dt * 1.5); if (burst >= 1) { st.burst = 1; keep(); ro(); } } if (!document.body.contains(el)) return false; }); };
  $("[data-p]", el).onclick = () => { if (T < 0) { $("[data-ro]", el).textContent = "Il gèle : la pluie ne peut pas entrer. Remonte d'abord la température."; return; } loop(el, dt => { wet = Math.min(1, wet + dt / 1.2); fig.draw(); ro(); if (wet >= 1) return false; }); };
  $("[data-t]", el).addEventListener("input", e => { T = +e.target.value; ro(); fig.draw(); });
  $("[data-r]", el).onclick = () => { wet = 0; burst = 0; T = 10; $("[data-t]", el).value = 10; ro(); fig.draw(); };
  ro(); tick();
};
const rocDone = () => !!xo("roc").burst;
