/* ===== 5e EIST · Révision Mission 4 (v2) : simulations et animations ===== */
Store.key = "eist5-revision-mission4-v2";
const WID = {}, LIVE = {};
const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
const seg = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
const f1 = v => (+v).toFixed(1);
const xst = () => { if (!S.x || typeof S.x !== "object") S.x = {}; return S.x; };
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const RM = (() => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
const deg = T => (T < 0 ? "−" + fmt(-T) : fmt(T)) + NB + "°C";
const press = (el, key, cur) => $$(`[data-${key}]`, el).forEach(b => b.setAttribute("aria-pressed", b.dataset[key] === String(cur) ? "true" : "false"));
const segBtns = (name, key, opts, cur) => `<div><span class="lab3">${name}</span><div class="seg" role="group" aria-label="${esc(name)}">${opts.map(([k, l]) => `<button type="button" data-${key}="${k}" aria-pressed="${String(k) === String(cur)}">${l}</button>`).join("")}</div></div>`;
const rng = s => { let x = s; return () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; }; };
function loopWhile(el, fn) { const st = ts => { if (!document.body.contains(el)) return; fn(ts); requestAnimationFrame(st); }; requestAnimationFrame(st); }
function thermo(x, y, h, T, Tmin, Tmax, tk) {
  const q = Math.max(0, Math.min(1, (T - Tmin) / (Tmax - Tmin))), w = Math.max(8, h * 0.07), bulb = w * 1.25;
  return `<rect x="${f1(x - w / 2)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(w / 2)}" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.6"/><rect x="${f1(x - w * 0.25)}" y="${f1(y + h * (1 - q))}" width="${f1(w * 0.5)}" height="${f1(h * q + bulb * 0.5)}" style="fill:var(--bad)"/><circle cx="${f1(x)}" cy="${f1(y + h + bulb * 0.55)}" r="${f1(bulb)}" style="fill:var(--bad);stroke:var(--ink);stroke-width:1.6"/>` + sT(x, y + h + bulb * 2.6, deg(Math.round(T)), "middle", tk, 'font-weight="800"');
}

/* ---------- 1 · les particules d'eau : chauffer, refroidir ---------- */
WID.particules = el => {
  const N = 36, R = rng(7), P = Array.from({ length: N }, (_, i) => ({ c: i % 6, r: Math.floor(i / 6), lx: R(), ly: R(), gx: R(), gy: R(), ph: R() * 6.28, x: 0, y: 0, init: 0 }));
  let T = -10, mode = 0, ice = 1, gas = 0, lt = 0;
  el.innerHTML = `<p class="lead">${nb("Chauffe ou refroidis l'eau pure, ou déplace le curseur. Observe les particules et le thermomètre.")}</p>
    <div class="row"><button type="button" class="btn" data-m="1">🔥 Chauffer</button><button type="button" class="btn" data-m="-1">❄ Refroidir</button><button type="button" class="btn ghost" data-m="0">⏸ Arrêter</button></div>
    <div class="field"><label>Température de l'eau<input type="range" min="-20" max="120" step="1" value="-10" data-t aria-label="Température de l'eau en degrés Celsius"></label></div>
    <div class="figbox" style="max-width:36rem;margin:0 auto"></div><p class="readout" aria-live="polite"></p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), H = Math.min(W * 0.62, F * 15), bw = W - F * 5, bh = H - F * 0.8, s = Math.min(bw / 9, bh / 8), now = performance.now() / 1000;
    let g = `<rect x="2" y="2" width="${f1(bw)}" height="${f1(bh)}" rx="12" style="fill:var(--surface-2);stroke:var(--ink);stroke-width:2"/>`;
    const nIce = Math.round(N * (T < 0 ? 1 : T === 0 ? ice : 0)), nGas = Math.round(N * (T > 100 ? 1 : T === 100 ? gas : 0));
    P.forEach((p, i) => {
      const st = i < nIce ? 0 : i >= N - nGas ? 2 : 1; let tx, ty, amp;
      if (st === 0) { tx = 2 + bw / 2 + (p.c - 2.5) * s * 1.05; ty = bh - s * 0.7 - p.r * s * 1.05; amp = s * (0.04 + 0.002 * Math.max(0, T + 20)); }
      else if (st === 1) { tx = 2 + s * 0.6 + p.lx * (bw - s * 1.2); ty = bh - s * 0.6 - p.ly * bh * 0.42; amp = s * 0.18; tx += Math.sin(now * 0.8 + p.ph) * s * 0.6; }
      else { tx = 2 + s * 0.6 + ((p.gx + now * 0.08 * (0.5 + p.ph / 6)) % 1) * (bw - s * 1.2); ty = s * 0.6 + Math.abs(Math.sin(now * 0.7 + p.ph * 3)) * (bh - s * 1.2) * (0.3 + 0.7 * p.gy); amp = s * 0.1; }
      if (!p.init) { p.x = tx; p.y = ty; p.init = 1; } const k = st === 2 ? 0.25 : 0.12; p.x += (tx - p.x) * k; p.y += (ty - p.y) * k;
      g += `<circle cx="${f1(p.x + Math.sin(now * 9 + p.ph * 5) * amp)}" cy="${f1(p.y + Math.cos(now * 8 + p.ph * 3) * amp)}" r="${f1(s * 0.38)}" style="fill:var(--sea);stroke:var(--ink);stroke-width:1"/>`;
    });
    g += thermo(W - F * 2, F * 0.6, H - F * 4.2, T, -20, 120, tk);
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Particules d'eau à ${deg(T)} et thermomètre. L'état de l'eau est écrit sous le dessin.">${g}</svg>`;
  });
  const text = () => T < 0 ? `<b>${deg(T)}</b> · état <b>solide</b> (glace) : particules rangées, serrées, qui vibrent sur place.` : T === 0 ? `<b>0 °C</b> · la glace et l'eau liquide sont présentes en même temps.` : T < 100 ? `<b>${deg(T)}</b> · état <b>liquide</b> : particules serrées, en désordre, qui glissent les unes sur les autres.` : T === 100 ? `<b>100 °C</b> · l'eau liquide et la vapeur d'eau sont présentes en même temps.` : `<b>${deg(T)}</b> · état <b>gazeux</b> (vapeur d'eau) : particules très éloignées, qui bougent dans tous les sens.`;
  let last = "";
  const upd = () => { $("[data-t]", el).value = T; const t = nb(text()); if (t !== last) { last = t; $(".readout", el).innerHTML = t; } };
  $$("[data-m]", el).forEach(b => b.onclick = () => { mode = +b.dataset.m; });
  $("[data-t]", el).oninput = e => { mode = 0; T = +e.target.value; ice = T === 0 ? 0.5 : T < 0 ? 1 : 0; gas = T === 100 ? 0.5 : T > 100 ? 1 : 0; upd(); };
  loopWhile(el, ts => { const dt = lt ? Math.min(0.1, (ts - lt) / 1000) : 0; lt = ts;
    if (mode === 1) { if (T === 0 && ice > 0) ice = Math.max(0, ice - dt * 0.35); else if (T === 100 && gas < 1) gas = Math.min(1, gas + dt * 0.35); else { const nT = Math.min(120, T + dt * 14); T = (T < 0 && nT >= 0) ? 0 : (T < 100 && nT >= 100) ? 100 : nT; if (T === 0) ice = 1; if (T === 100) gas = 0; if (T >= 120) mode = 0; } }
    if (mode === -1) { if (T === 100 && gas > 0) gas = Math.max(0, gas - dt * 0.35); else if (T === 0 && ice < 1) ice = Math.min(1, ice + dt * 0.35); else { const nT = Math.max(-20, T - dt * 14); T = (T > 100 && nT <= 100) ? 100 : (T > 0 && nT <= 0) ? 0 : nT; if (T === 100) gas = 1; if (T === 0) ice = 0; if (T <= -20) mode = 0; } }
    if (mode) T = (T === 0 || T === 100) ? T : Math.round(T * 10) / 10; fig.draw(); if (mode) upd(); });
  upd();
};

/* ---------- 1 · quatre scènes de la vie quotidienne ---------- */
const SCENES = ["Un glaçon posé dans une assiette, au soleil", "Une flaque d'eau, après la pluie, au soleil", "Le miroir de la salle de bains, pendant une douche chaude", "De l'eau versée dans le bac à glaçons du congélateur"];
function sceneSVG(i, W, F, t) {
  const H = W * 0.62, tk = TK(F) * 0.85, u = (t % 6) / 6; let g = `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="10" style="fill:var(--surface-2);stroke:var(--line)"/>`;
  if (i === 0) { const s = W * 0.22 * (1 - 0.75 * u), cx = W * 0.5, cy = H * 0.66; g += `<circle cx="${f1(W * 0.85)}" cy="${f1(H * 0.18)}" r="${f1(W * 0.07)}" style="fill:#f5c542"/><ellipse cx="${f1(cx)}" cy="${f1(cy + H * 0.12)}" rx="${f1(W * 0.36)}" ry="${f1(H * 0.1)}" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.5"/><ellipse cx="${f1(cx)}" cy="${f1(cy + H * 0.11)}" rx="${f1(W * 0.08 + W * 0.22 * u)}" ry="${f1(H * 0.03 + H * 0.05 * u)}" style="fill:#7fb6e6;opacity:.8"/><rect x="${f1(cx - s / 2)}" y="${f1(cy + H * 0.1 - s)}" width="${f1(s)}" height="${f1(s)}" rx="${f1(s * 0.15)}" style="fill:#e6f3fb;stroke:#6a9cc4;stroke-width:1.5"/>`; }
  if (i === 1) { const cx = W * 0.5, cy = H * 0.78; g += `<circle cx="${f1(W * 0.85)}" cy="${f1(H * 0.18)}" r="${f1(W * 0.07)}" style="fill:#f5c542"/><rect x="1" y="${f1(cy)}" width="${W - 2}" height="${f1(H - cy - 1)}" style="fill:#9a8d7a;opacity:.5"/><ellipse cx="${f1(cx)}" cy="${f1(cy + H * 0.04)}" rx="${f1(W * 0.34 * (1 - 0.8 * u))}" ry="${f1(H * 0.06 * (1 - 0.6 * u))}" style="fill:#7fb6e6;opacity:.85"/>`; for (let k = 0; k < 3; k++) { const v = (u * 1.5 + k / 3) % 1; g += `<path d="M${f1(cx - W * 0.15 + k * W * 0.15)},${f1(cy - v * H * 0.5)} q${f1(W * 0.03)},${f1(-H * 0.05)} 0,${f1(-H * 0.1)} q${f1(-W * 0.03)},${f1(-H * 0.05)} 0,${f1(-H * 0.1)}" style="fill:none;stroke:var(--muted);stroke-width:1.6;stroke-dasharray:3 3;opacity:${f1(1 - v)}"/>`; } g += sT(W * 0.06, H * 0.14, "vapeur invisible", "start", tk * 0.85); }
  if (i === 2) { const mx = W * 0.45, mw = W * 0.4, my = H * 0.12, mh = H * 0.62; g += `<rect x="${f1(mx)}" y="${f1(my)}" width="${f1(mw)}" height="${f1(mh)}" rx="8" style="fill:#dbeefa;stroke:var(--ink);stroke-width:2"/><rect x="${f1(mx)}" y="${f1(my)}" width="${f1(mw)}" height="${f1(mh)}" rx="8" style="fill:#ffffff;opacity:${f1(0.75 * u)}"/>`; const r = rng(3); for (let k = 0; k < 26; k++) { const x = mx + 6 + r() * (mw - 12), y = my + 6 + r() * (mh - 12); if (r() < u) g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.5 + r() * 2.5)}" style="fill:#8fbfe3"/>`; } for (let k = 0; k < 3; k++) { const v = (u * 2 + k / 3) % 1; g += `<path d="M${f1(W * 0.12 + k * W * 0.08)},${f1(H * 0.85 - v * H * 0.5)} q${f1(W * 0.03)},${f1(-H * 0.05)} 0,${f1(-H * 0.1)}" style="fill:none;stroke:var(--muted);stroke-width:1.6;stroke-dasharray:3 3;opacity:${f1(1 - v)}"/>`; } g += sT(W * 0.05, H * 0.95, "douche chaude", "start", tk * 0.85); }
  if (i === 3) { const cols = 4, cw = W * 0.18, x0 = W * 0.5 - cw * cols / 2, y0 = H * 0.4, ch = H * 0.36; g += `<rect x="${f1(x0 - 6)}" y="${f1(y0 - 6)}" width="${f1(cw * cols + 12)}" height="${f1(ch + 12)}" rx="8" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.5"/>`; for (let c = 0; c < cols; c++) { const fz = Math.max(0, Math.min(1, u * 1.6 - c * 0.12)); g += `<rect x="${f1(x0 + c * cw + 3)}" y="${f1(y0 + 3)}" width="${f1(cw - 6)}" height="${f1(ch - 6)}" rx="4" style="fill:rgb(${Math.round(lerp(127, 232, fz))},${Math.round(lerp(182, 244, fz))},${Math.round(lerp(230, 251, fz))});stroke:#6a9cc4"/>`; if (fz > 0.6) g += sT(x0 + c * cw + cw / 2, y0 + ch / 2 + tk * 0.35, "❄", "middle", tk * 1.1); } g += sT(W * 0.05, H * 0.2, "−18 °C", "start", tk, 'font-weight="800"'); }
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Scène ${i + 1} : ${SCENES[i]}">${g}</svg>`;
}
WID.scenes = el => {
  let on = !RM, t = 0, lt = 0;
  el.innerHTML = `<div class="row"><button type="button" class="btn ghost" data-pp></button></div><div class="scenes">${SCENES.map((s, i) => `<figure><div class="figbox" data-sc="${i}"></div><figcaption><b>Scène ${i + 1}</b> · ${nb(s)}</figcaption></figure>`).join("")}</div>`;
  const figs = SCENES.map((s, i) => liveSVG($(`[data-sc="${i}"]`, el), (W, F) => sceneSVG(i, W, F, t)));
  const lab = () => { $("[data-pp]", el).textContent = on ? "⏸ Pause" : "▶ Lancer les animations"; };
  $("[data-pp]", el).onclick = () => { on = !on; lab(); }; lab();
  loopWhile(el, ts => { const dt = lt ? Math.min(0.1, (ts - lt) / 1000) : 0; lt = ts; if (on) { t += dt; figs.forEach(f => f.draw()); } });
};

/* ---------- 1 · masse et volume : la balance et la bouteille ---------- */
WID.masse = el => {
  let pa = 0, pb = 0;
  el.innerHTML = `<div class="duo"><div><h4>${nb("Expérience A · Un glaçon dans un bocal fermé, posé sur une balance")}</h4><div class="row animctl" data-a></div><div class="figbox" data-fa></div><p class="readout" data-ra aria-live="polite"></p></div>
    <div><h4>${nb("Expérience B · Une bouteille d'eau au congélateur, posée sur une balance")}</h4><div class="row animctl" data-b></div><div class="figbox" data-fb></div><p class="readout" data-rb aria-live="polite"></p></div></div>`;
  const scale = (W, H, x, y, w, txt) => `<rect x="${f1(x - w / 2)}" y="${f1(y)}" width="${f1(w)}" height="${f1(H * 0.12)}" rx="6" style="fill:var(--surface);stroke:var(--ink);stroke-width:2"/><rect x="${f1(x - w * 0.28)}" y="${f1(y + H * 0.025)}" width="${f1(w * 0.56)}" height="${f1(H * 0.07)}" rx="3" style="fill:#0f2a1c"/><text x="${f1(x)}" y="${f1(y + H * 0.08)}" text-anchor="middle" style="fill:#7dff9a;font-size:${f1(H * 0.06)}px;font-family:ui-monospace,Menlo,monospace;font-weight:700">${txt}</text>`;
  const fa = liveSVG($("[data-fa]", el), (W, F) => { const H = Math.min(W * 0.85, F * 13), cx = W / 2, jw = W * 0.42, jh = H * 0.5, jy = H * 0.2, by = jy + jh, s = jw * 0.42 * (1 - 0.85 * pa), wl = jh * (0.05 + 0.1 * pa); let g = "";
    g += `<rect x="${f1(cx - jw / 2)}" y="${f1(by - wl)}" width="${f1(jw)}" height="${f1(wl)}" style="fill:#7fb6e6;opacity:.85"/>`;
    if (pa < 0.98) g += `<rect x="${f1(cx - s / 2)}" y="${f1(by - wl * 0.4 - s)}" width="${f1(s)}" height="${f1(s)}" rx="${f1(s * 0.15)}" style="fill:#e6f3fb;stroke:#6a9cc4;stroke-width:1.5"/>`;
    g += `<path d="M${f1(cx - jw / 2)},${f1(jy)} L${f1(cx - jw / 2)},${f1(by)} L${f1(cx + jw / 2)},${f1(by)} L${f1(cx + jw / 2)},${f1(jy)}" style="fill:none;stroke:var(--ink);stroke-width:2.5"/><rect x="${f1(cx - jw / 2 - 4)}" y="${f1(jy - H * 0.05)}" width="${f1(jw + 8)}" height="${f1(H * 0.05)}" rx="3" style="fill:var(--c2)"/>` + sT(cx + jw / 2 + 6, jy - H * 0.01, "couvercle", "start", TK(F) * 0.8);
    g += scale(W, H, cx, by + 2, W * 0.7, "152,4 g");
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Bocal fermé contenant un glaçon, posé sur une balance. La masse affichée est écrite sous le dessin.">${g}</svg>`; });
  const fb = liveSVG($("[data-fb]", el), (W, F) => { const H = Math.min(W * 0.85, F * 13), cx = W / 2, bw = W * 0.26 * (1 + 0.12 * pb), bh = H * 0.56, by0 = H * 0.16, bot = by0 + bh, lvl = bh * (0.62 + 0.08 * pb), col = `rgb(${Math.round(lerp(127, 225, pb))},${Math.round(lerp(182, 240, pb))},${Math.round(lerp(230, 250, pb))})`; let g = "";
    if (pb > 0.02) g += `<rect x="2" y="2" width="${W - 4}" height="${f1(bot)}" rx="8" style="fill:#d9ecf7;opacity:${f1(0.5 * Math.min(1, pb * 3))}"/>` + sT(8, F * 1.1, "congélateur −18 °C", "start", TK(F) * 0.85, 'font-weight="700"');
    g += `<rect x="${f1(cx - bw / 2 + 3)}" y="${f1(bot - lvl)}" width="${f1(bw - 6)}" height="${f1(lvl - 3)}" rx="6" style="fill:${col}"/>`;
    g += `<path d="M${f1(cx - bw * 0.16)},${f1(by0)} L${f1(cx - bw * 0.16)},${f1(by0 + bh * 0.12)} Q${f1(cx - bw / 2)},${f1(by0 + bh * 0.18)} ${f1(cx - bw / 2)},${f1(by0 + bh * 0.3)} L${f1(cx - bw / 2)},${f1(bot - 6)} Q${f1(cx - bw / 2)},${f1(bot)} ${f1(cx - bw / 2 + 6)},${f1(bot)} L${f1(cx + bw / 2 - 6)},${f1(bot)} Q${f1(cx + bw / 2)},${f1(bot)} ${f1(cx + bw / 2)},${f1(bot - 6)} L${f1(cx + bw / 2)},${f1(by0 + bh * 0.3)} Q${f1(cx + bw / 2)},${f1(by0 + bh * 0.18)} ${f1(cx + bw * 0.16)},${f1(by0 + bh * 0.12)} L${f1(cx + bw * 0.16)},${f1(by0)}Z" style="fill:none;stroke:var(--ink);stroke-width:2.5"/><rect x="${f1(cx - bw * 0.2)}" y="${f1(by0 - H * 0.05)}" width="${f1(bw * 0.4)}" height="${f1(H * 0.05)}" rx="3" style="fill:var(--c1)"/>`;
    const ly = bot - bh * 0.62; g += `<line x1="${f1(cx - bw / 2 - 10)}" x2="${f1(cx + bw / 2 + 10)}" y1="${f1(ly)}" y2="${f1(ly)}" style="stroke:var(--bad);stroke-width:2.5;stroke-dasharray:6 4"/>` + sT(cx + bw / 2 + 12, ly + 5, "trait de départ", "start", TK(F) * 0.8, 'style="fill:var(--bad)"');
    g += scale(W, H, cx, bot + 2, W * 0.7, "500,0 g");
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Bouteille d'eau sur une balance, avec un trait rouge au niveau de départ de l'eau. Ce qui se passe est écrit sous le dessin.">${g}</svg>`; });
  animCtl($("[data-a]", el), 7000, q => { pa = q; fa.draw(); $("[data-ra]", el).innerHTML = nb(q <= 0 ? "Touche « Lancer » : le glaçon va fondre (temps accéléré). Surveille l'écran de la balance." : q < 1 ? "Le glaçon fond…" : "Le glaçon a entièrement fondu. Regarde l'écran de la balance."); });
  animCtl($("[data-b]", el), 7000, q => { pb = q; fb.draw(); $("[data-rb]", el).innerHTML = nb(q <= 0 ? "Bouteille d'eau liquide, remplie jusqu'au trait rouge. Touche « Lancer » : direction le congélateur." : q < 1 ? "L'eau se transforme en glace…" : "Toute l'eau est devenue de la glace. Compare avec le trait rouge et regarde la balance."); });
};

/* ---------- 2 · TP virtuel : l'eau qui gèle, courbe en temps réel ---------- */
const GEL = [[0, 18], [1, 11], [2, 6], [3, 2.5], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, -2.5], [10, -5], [11, -7], [12, -8]];
const gelT = t => { const i = Math.min(11, Math.floor(t)), a = GEL[i], b = GEL[i + 1]; return a[1] + (b[1] - a[1]) * (t - i); };
const gelIce = t => Math.max(0, Math.min(1, (t - 4) / 4));
WID.tpgel = el => {
  let t = 0, sel = null, geo = null;
  el.innerHTML = `<p class="lead">${nb("Comme au TP 2 : un tube d'eau pure est plongé dans un mélange de glace et de sel. Lance la manipulation (temps accéléré) : les mesures s'ajoutent chaque minute.")}</p><div class="row animctl"></div>
    <div class="tpw"><div class="figbox" data-bench></div><div><div class="figbox chartg" data-g tabindex="0"></div><p class="readout" data-rd aria-live="polite"></p></div></div><div class="res"></div>`;
  const bench = liveSVG($("[data-bench]", el), (W, F) => { const tk = TK(F), H = Math.min(W * 0.95, F * 15), cx = W * 0.42, bw = W * 0.6, by = H * 0.4, bh = H * 0.5, tw = W * 0.14, ty = H * 0.12, th = H * 0.68, T = gelT(t), ice = gelIce(t); let g = "";
    g += `<rect x="${f1(cx - bw / 2)}" y="${f1(by)}" width="${f1(bw)}" height="${f1(bh)}" rx="10" style="fill:#e8f2f8;stroke:var(--ink);stroke-width:2"/>`;
    const r = rng(11); for (let k = 0; k < 14; k++) { const x = cx - bw / 2 + 8 + r() * (bw - 16), y = by + 10 + r() * (bh - 24), s = 10 + r() * 10; if (Math.abs(x - cx) < tw * 0.7) continue; g += `<rect x="${f1(x - s / 2)}" y="${f1(y - s / 2)}" width="${f1(s)}" height="${f1(s)}" rx="3" style="fill:#ffffff;stroke:#9cc3dd" transform="rotate(${f1(r() * 40 - 20)} ${f1(x)} ${f1(y)})"/>`; }
    g += sT(cx, by + bh + tk * 1.2, "glace + sel", "middle", tk * 0.9, 'font-weight="700"');
    const wl = th * 0.55, wy = ty + th - wl;
    g += `<rect x="${f1(cx - tw / 2 + 3)}" y="${f1(wy)}" width="${f1(tw - 6)}" height="${f1(wl - tw * 0.4)}" style="fill:#7fb6e6"/><rect x="${f1(cx - tw / 2 + 3)}" y="${f1(wy + (wl - tw * 0.4) * (1 - ice))}" width="${f1(tw - 6)}" height="${f1((wl - tw * 0.4) * ice)}" style="fill:#e3f1fb"/>`;
    const r2 = rng(5); for (let k = 0; k < 18; k++) { const yy = wy + 4 + r2() * (wl - tw * 0.6), xx = cx - tw / 2 + 5 + r2() * (tw - 10); if (ice > 0 && ice < 1 && r2() < 0.6 && (yy - wy) / (wl - tw * 0.4) > 1 - ice - 0.25) g += `<path d="M${f1(xx - 4)},${f1(yy)} L${f1(xx + 4)},${f1(yy)} M${f1(xx)},${f1(yy - 4)} L${f1(xx)},${f1(yy + 4)}" style="stroke:#ffffff;stroke-width:1.5"/>`; }
    g += `<path d="M${f1(cx - tw / 2)},${f1(ty)} L${f1(cx - tw / 2)},${f1(ty + th - tw / 2)} Q${f1(cx - tw / 2)},${f1(ty + th)} ${f1(cx)},${f1(ty + th)} Q${f1(cx + tw / 2)},${f1(ty + th)} ${f1(cx + tw / 2)},${f1(ty + th - tw / 2)} L${f1(cx + tw / 2)},${f1(ty)}" style="fill:none;stroke:var(--ink);stroke-width:2.2"/>`;
    g += `<line x1="${f1(cx)}" y1="${f1(ty - H * 0.08)}" x2="${f1(cx)}" y2="${f1(ty + th - tw * 0.5)}" style="stroke:var(--ink);stroke-width:2"/>` + thermo(W * 0.88, H * 0.06, H * 0.62, T, -10, 20, tk);
    g += sT(4, tk * 1.2, "⏱ " + Math.floor(t) + " min " + String(Math.floor((t % 1) * 60)).padStart(2, "0") + " s", "start", tk, 'font-weight="800"');
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Tube d'eau dans un bain de glace et de sel, avec un thermomètre. La température et l'état sont écrits sous le graphique.">${g}</svg>`; });
  const gr = liveSVG($("[data-g]", el), (W, F) => { const tk = TK(F) * 0.9, H = Math.min(Math.max(W * 0.75, F * 13), F * 17), L = F * 2.8, Rr = F * 0.8, Tp = F * 1.4, B = F * 2.6, pw = W - L - Rr, ph = H - Tp - B, X = x => L + x / 12 * pw, Y = y => Tp + (20 - y) / 30 * ph; let g = "";
    for (let y = -10; y <= 20; y += 5) g += `<line x1="${f1(L)}" x2="${f1(L + pw)}" y1="${f1(Y(y))}" y2="${f1(Y(y))}" style="stroke:var(--${y === 0 ? "muted" : "grid"});stroke-width:${y === 0 ? 1.5 : 1}"/>` + sT(L - 5, Y(y) + tk * 0.35, fmt(y), "end", tk);
    for (let x = 0; x <= 12; x += 2) g += `<line x1="${f1(X(x))}" x2="${f1(X(x))}" y1="${f1(Tp)}" y2="${f1(Tp + ph)}" style="stroke:var(--grid)"/>` + sT(X(x), Tp + ph + tk * 1.3, x, "middle", tk);
    g += `<line x1="${f1(L)}" x2="${f1(L)}" y1="${f1(Tp)}" y2="${f1(Tp + ph)}" style="stroke:var(--ink);stroke-width:1.6"/>` + sT(L + pw / 2, H - F * 0.3, "Temps (min)", "middle", tk, 'font-weight="700"') + sT(4, Tp - F * 0.5, "Température (°C)", "start", tk, 'font-weight="700"');
    let d = ""; for (let k = 0; k <= 60; k++) { const tt = Math.min(t, k * 0.2); d += (k ? "L" : "M") + f1(X(tt)) + "," + f1(Y(gelT(tt))); if (tt >= t) break; } if (t > 0) g += `<path d="${d}" style="fill:none;stroke:var(--c1);stroke-width:3"/>`;
    GEL.forEach(([x, y]) => { if (x <= t + 1e-6) g += `<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${f1(F * (sel === x ? 0.42 : 0.28))}" style="fill:var(--c2);stroke:var(--surface);stroke-width:2"/>`; });
    geo = { L, pw };
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Graphique en cours de tracé : température de l'eau en fonction du temps. Les mesures sont dans le tableau.">${g}</svg>`; });
  const host = $("[data-g]", el);
  host.addEventListener("pointerdown", e => { const svg = host.querySelector("svg"); if (!svg || !geo) return; const r = svg.getBoundingClientRect(), k = svg.viewBox.baseVal.width / r.width, x = Math.round(((e.clientX - r.left) * k - geo.L) / geo.pw * 12); if (x < 0 || x > 12 || x > t + 1e-6) return; sel = x; gr.draw(); $("[data-rd]", el).innerHTML = nb(`Mesure à <b>${x} min</b> : <b>${deg(GEL[x][1])}</b>.`); });
  const table = () => { const n = Math.floor(t + 1e-6); $(".res", el).innerHTML = `<p class="lead"><b>Tableau de mesures</b> <span class="sim">⚠ Valeurs simulées</span></p>` + tblX("Temps (min)", "Température (°C)", GEL.map(q => q[0]), GEL.map(q => q[0] <= n ? fmt(q[1]) : "")); };
  let ln = -1;
  animCtl($(".animctl", el), 26000, q => { t = q * 12; bench.draw(); gr.draw(); const n = Math.floor(t + 1e-6); if (n !== ln) { ln = n; table(); } const ice = gelIce(t), st = ice <= 0 ? "liquide" : ice >= 1 ? "solide" : "liquide et solide : des cristaux de glace se forment"; if (sel === null || q >= 1 || q <= 0) $("[data-rd]", el).innerHTML = nb(q <= 0 ? "Touche « Lancer ». Tu pourras ensuite toucher le graphique pour lire une mesure." : `Température : <b>${deg(Math.round(gelT(t) * 10) / 10)}</b> · eau à l'état <b>${st}</b>.`); });
  table();
};

/* ---------- 2 · animation débloquée : pourquoi un palier ? ---------- */
WID.palier = el => {
  let p = 0;
  el.innerHTML = `<div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox" style="max-width:34rem;margin:0 auto"></div>`;
  const T = q => q < 0.25 ? lerp(-15, 0, q / 0.25) : q < 0.65 ? 0 : lerp(0, 25, (q - 0.65) / 0.35), ice = q => q < 0.25 ? 1 : q < 0.65 ? 1 - (q - 0.25) / 0.4 : 0;
  const fig = liveSVG($(".figbox", el), (W, F) => { const tk = TK(F) * 0.9, H = Math.min(W * 0.7, F * 14), px = W * 0.25, py = H * 0.35, pw = W * 0.36, ph = H * 0.38, now = performance.now() / 1000; let g = "";
    g += `<rect x="${f1(px - pw / 2 - 10)}" y="${f1(py + ph + 4)}" width="${f1(pw + 20)}" height="${f1(H * 0.07)}" rx="4" style="fill:var(--muted)"/>`;
    for (let k = 0; k < 4; k++) { const v = (now * 0.8 + k / 4) % 1; g += arrow(px - pw / 3 + k * pw / 4.5, py + ph + H * 0.22 - v * H * 0.12, px - pw / 3 + k * pw / 4.5, py + ph + H * 0.14 - v * H * 0.12, 2.5, "bad", 1 - v); }
    g += sT(px, H - 4, "la plaque chauffe toujours autant", "middle", tk * 0.85, 'font-weight="700"');
    const wl = ph * 0.6, ic = ice(p); g += `<rect x="${f1(px - pw / 2 + 3)}" y="${f1(py + ph - wl)}" width="${f1(pw - 6)}" height="${f1(wl - 3)}" style="fill:#7fb6e6;opacity:${f1(0.3 + 0.6 * (1 - ic))}"/>`;
    const r = rng(9); for (let k = 0; k < 7; k++) { const s = pw * 0.18 * ic, x = px - pw * 0.35 + r() * pw * 0.6, y = py + ph - wl * 0.4 - r() * wl * 0.4; if (s > 2) g += `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(s)}" height="${f1(s)}" rx="3" style="fill:#e6f3fb;stroke:#6a9cc4"/>`; }
    g += `<path d="M${f1(px - pw / 2)},${f1(py)} L${f1(px - pw / 2)},${f1(py + ph)} L${f1(px + pw / 2)},${f1(py + ph)} L${f1(px + pw / 2)},${f1(py)}" style="fill:none;stroke:var(--ink);stroke-width:2.5"/>` + thermo(px + pw / 2 + F * 1.2, py - H * 0.2, ph + H * 0.12, T(p), -15, 25, tk);
    const gx = W * 0.6, gw = W * 0.38, gy = H * 0.12, gh = H * 0.6, X = q => gx + q * gw, Y = v => gy + (25 - v) / 40 * gh;
    g += `<line x1="${f1(gx)}" y1="${f1(gy)}" x2="${f1(gx)}" y2="${f1(gy + gh)}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${f1(gx)}" y1="${f1(Y(0))}" x2="${f1(gx + gw)}" y2="${f1(Y(0))}" style="stroke:var(--muted);stroke-dasharray:4 3"/>` + sT(gx - 4, Y(0) + tk * 0.35, "0", "end", tk) + sT(gx + gw / 2, gy + gh + tk * 1.3, "temps", "middle", tk) + sT(gx, gy - 6, "T (°C)", "start", tk);
    let d = ""; for (let k = 0; k <= 50; k++) { const q = Math.min(p, k / 50); d += (k ? "L" : "M") + f1(X(q)) + "," + f1(Y(T(q))); if (q >= p) break; } if (p > 0) g += `<path d="${d}" style="fill:none;stroke:var(--c1);stroke-width:3"/>`;
    if (p > 0.3 && p < 0.65) g += sT(X(0.45), Y(0) - 8, "palier", "middle", tk, 'font-weight="800" style="fill:var(--c2)"');
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Une casserole de glace chauffée, avec un thermomètre, et la courbe de température qui se trace en même temps.">${g}</svg>`; });
  loopWhile(el, () => fig.draw());
  animCtl($(".animctl", el), 14000, q => { p = q; $(".readout", el).innerHTML = nb(q <= 0 ? "De la glace à −15 °C sur une plaque chauffante. La plaque chauffe toujours autant." : q < 0.25 ? "La glace se réchauffe : sa température monte." : q < 0.65 ? "La glace fond : la chaleur reçue sert à faire fondre la glace, la température reste à 0 °C. C'est le <b>palier</b>." : q < 1 ? "Toute la glace a fondu : la température de l'eau liquide remonte." : "La température ne reste constante que pendant le changement d'état."); });
};

/* ---------- 3 · le microscope virtuel ---------- */
const SLIDES = [["yaourt", "Lame 1 · Une goutte de yaourt", 58], ["levure", "Lame 2 · De la levure de boulanger dans de l'eau", 41], ["pain", "Lame 3 · Un peu de pain moisi", 70]];
WID.micro = el => {
  const M = xst().mic || (xst().mic = {});
  let sl = "yaourt", z = 40, foc = 20;
  el.innerHTML = `<p class="lead">${nb("Choisis une lame, un grossissement, puis tourne la vis de mise au point jusqu'à obtenir une image nette.")}</p>
    <div class="opt3">${segBtns("Lame", "sl", SLIDES.map(s => [s[0], s[1].split(" · ")[0]]), sl)}${segBtns("Grossissement", "z", [[40, "× 40"], [100, "× 100"], [400, "× 400"]], z)}</div>
    <div class="field"><label>Vis de mise au point<input type="range" min="0" max="100" step="1" value="20" data-f aria-label="Mise au point"></label></div>
    <div class="figbox" style="max-width:26rem;margin:0 auto"></div><p class="readout" aria-live="polite"></p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const S0 = SLIDES.find(s => s[0] === sl), blur = Math.max(0, Math.abs(foc - S0[2]) - 4) / 5, k = { 40: 0.16, 100: 0.4, 400: 1 }[z], H = W, cx = W / 2, cy = H / 2, R = W * 0.46, r = rng(sl.length * 31 + 7), u = R * 0.05 * k; let g = "";
    g += `<defs><clipPath id="fov"><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}"/></clipPath><filter id="bl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${f1(blur)}"/></filter></defs><rect width="${W}" height="${H}" style="fill:#0b0b0b"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" style="fill:#f4f1e4"/>`;
    let o = "";
    const spr = { yaourt: 2.2, levure: 1.9, pain: 1.15 }[sl]; for (let n = 0; n < 60; n++) { const x = cx + (r() * 2 - 1) * R * spr * k, y = cy + (r() * 2 - 1) * R * spr * k, a = r() * 360;
      if (sl === "yaourt") { for (let c = 0; c < 3; c++) o += `<rect x="${f1(x + c * u * 2.6 * Math.cos(a / 57.3) - u * 1.2)}" y="${f1(y + c * u * 2.6 * Math.sin(a / 57.3) - u * 0.4)}" width="${f1(u * 2.4)}" height="${f1(u * 0.8)}" rx="${f1(u * 0.4)}" transform="rotate(${f1(a)} ${f1(x + c * u * 2.6 * Math.cos(a / 57.3))} ${f1(y + c * u * 2.6 * Math.sin(a / 57.3))})" style="fill:#7a5aa8"/>`; }
      else if (sl === "levure") { if (n > 30) break; o += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(u * 3.2)}" ry="${f1(u * 2.6)}" style="fill:#e9d8a6;stroke:#8a6d2c;stroke-width:${f1(Math.max(0.8, u * 0.35))}"/><circle cx="${f1(x - u * 0.6)}" cy="${f1(y)}" r="${f1(u * 0.8)}" style="fill:#c8a85a;opacity:.7"/>` + (r() < 0.5 ? `<ellipse cx="${f1(x + u * 3.6)}" cy="${f1(y - u * 1.6)}" rx="${f1(u * 1.4)}" ry="${f1(u * 1.1)}" style="fill:#e9d8a6;stroke:#8a6d2c;stroke-width:${f1(Math.max(0.8, u * 0.35))}"/>` : ""); }
      else { if (n > 9) break; let px = x, py = y, d = `M${f1(px)},${f1(py)}`; for (let s = 0; s < 6; s++) { px += Math.cos(a / 57.3 + (s % 2 ? 0.35 : -0.25)) * u * 4; py += Math.sin(a / 57.3 + (s % 2 ? 0.35 : -0.25)) * u * 4; d += ` L${f1(px)},${f1(py)}`; } o += `<path d="${d}" style="fill:none;stroke:#5c7a4a;stroke-width:${f1(Math.max(1, u * 0.9))}"/><line x1="${f1(px)}" y1="${f1(py)}" x2="${f1(px)}" y2="${f1(py - u * 6)}" style="stroke:#5c7a4a;stroke-width:${f1(Math.max(1, u * 0.7))}"/><circle cx="${f1(px)}" cy="${f1(py - u * 7.5)}" r="${f1(u * 2.4)}" style="fill:#2f4f3a"/>`; for (let s = 0; s < 6; s++) o += `<circle cx="${f1(px + Math.cos(s) * u * 1.4)}" cy="${f1(py - u * 7.5 + Math.sin(s) * u * 1.4)}" r="${f1(u * 0.5)}" style="fill:#8fbf7a"/>`; }
    }
    g += `<g clip-path="url(#fov)"><g filter="url(#bl)">${o}</g></g><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" style="fill:none;stroke:#333;stroke-width:3"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Champ du microscope : ${S0[1]}, grossissement ${z}, image ${blur < 0.5 ? "nette" : "floue"}.">${g}</svg>`;
  });
  const upd = () => { const S0 = SLIDES.find(s => s[0] === sl), net = Math.abs(foc - S0[2]) <= 4; if (net && z === 400 && !M[sl]) { M[sl] = 1; keep(); }
    $(".readout", el).innerHTML = nb(`${S0[1]} · grossissement × ${z} · image <b>${net ? "nette" : "floue"}</b>${net && z < 400 ? " : augmente le grossissement pour mieux voir" : ""}${net && z === 400 ? " ✓" : ""}. Lames observées nettes à × 400 : ${Object.keys(M).length}/3.`); fig.draw(); };
  $$("[data-sl]", el).forEach(b => b.onclick = () => { sl = b.dataset.sl; press(el, "sl", sl); upd(); });
  $$("[data-z]", el).forEach(b => b.onclick = () => { z = +b.dataset.z; press(el, "z", z); upd(); });
  $("[data-f]", el).oninput = e => { foc = +e.target.value; upd(); };
  upd();
};

/* ---------- 3 · la boîte de Petri : multiplication des bactéries ---------- */
const PLACES = [["table", "Sur la table (25 °C)", 20, "Table (25 °C)"], ["frigo", "Au réfrigérateur (4 °C)", 180, "Réfrigé\u00adrateur (4 °C)"], ["congel", "Au congélateur (−18 °C)", 0, "Congé\u00adlateur (−18 °C)"]];
WID.petri = el => {
  let pl = "table", p = 0; const R0 = rng(17), PTS = Array.from({ length: 520 }, () => { const a = R0() * 6.283, d = Math.sqrt(R0()); return [Math.cos(a) * d, Math.sin(a) * d]; });
  el.innerHTML = `<p class="lead">${nb("Une seule bactérie au départ. Choisis où ranger l'aliment, puis lance 3 heures de multiplication (temps accéléré).")}</p><div class="opt3">${segBtns("Lieu", "pl", PLACES.map(x => [x[0], x[1]]), pl)}</div><div class="row animctl"></div><div class="figbox" style="max-width:30rem;margin:0 auto"></div><p class="readout" aria-live="polite"></p><div class="res"></div>`;
  const count = m => { const per = PLACES.find(x => x[0] === pl)[2]; return per ? Math.pow(2, Math.floor(m / per + 1e-9)) : 1; };
  const fig = liveSVG($(".figbox", el), (W, F) => { const tk = TK(F), H = W * 0.72, cx = W * 0.42, cy = H * 0.52, R = H * 0.42, m = p * 180, n = count(m), shown = Math.min(n, PTS.length); let g = "";
    g += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R + 6)}" style="fill:var(--surface);stroke:var(--ink);stroke-width:2.5"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" style="fill:#f3e7c4"/>`;
    for (let i = 0; i < shown; i++) g += `<ellipse cx="${f1(cx + PTS[i][0] * R * Math.min(1, 0.12 + Math.sqrt(shown) / 23))}" cy="${f1(cy + PTS[i][1] * R * Math.min(1, 0.12 + Math.sqrt(shown) / 23))}" rx="${f1(Math.max(2, R * 0.03))}" ry="${f1(Math.max(1.3, R * 0.016))}" style="fill:#7a5aa8"/>`;
    g += sT(W * 0.86, H * 0.2, Math.floor(m / 60) + " h " + String(Math.round(m % 60)).padStart(2, "0"), "middle", tk * 1.2, 'font-weight="800"') + sT(W * 0.86, H * 0.2 + tk * 1.4, "écoulées", "middle", tk * 0.85);
    g += sT(W * 0.86, H * 0.55, fmt(n), "middle", tk * 1.3, 'font-weight="800" style="fill:var(--accent)"') + sT(W * 0.86, H * 0.55 + tk * 1.3, n > 1 ? "bactéries" : "bactérie", "middle", tk * 0.85);
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Boîte de Petri : ${fmt(n)} bactérie(s) après ${Math.round(m)} minutes. Les résultats sont aussi dans le tableau.">${g}</svg>`; });
  const RES = () => xst().petri || (xst().petri = {});
  const table = () => { const Rr = RES(); $(".res", el).innerHTML = `<p class="lead"><b>Mes résultats</b> (nombre de bactéries après 1 h, 2 h, 3 h) <span class="sim">⚠ Valeurs simulées pour le réfrigérateur et le congélateur</span></p>` + tbl(["Lieu", "1\u00a0h", "2\u00a0h", "3\u00a0h"], PLACES.map(x => [x[3], ...[60, 120, 180].map(m => Rr[x[0]] && Rr[x[0]][m] !== undefined ? fmt(Rr[x[0]][m]) : "—")])); };
  const ctl = animCtl($(".animctl", el), 12000, q => { p = q; fig.draw(); const m = q * 180, Rr = RES(); [60, 120, 180].forEach(h => { if (m >= h - 1e-6) { Rr[pl] = Rr[pl] || {}; if (Rr[pl][h] === undefined) { Rr[pl][h] = count(h); keep(); table(); } } });
    $(".readout", el).innerHTML = nb(q <= 0 ? "Touche « Lancer »." : pl === "table" ? "À 25 °C, chaque bactérie se divise en deux toutes les 20 minutes." : pl === "frigo" ? "Au froid, les bactéries se divisent beaucoup plus lentement." : "Au congélateur, les bactéries ne se multiplient plus… mais elles ne sont pas mortes."); });
  $$("[data-pl]", el).forEach(b => b.onclick = () => { pl = b.dataset.pl; press(el, "pl", pl); ctl.set(0); });
  table();
};

/* ---------- 3 · le bouclier anti-microbes : besoins et conservation ---------- */
const NEEDS = [["eau", "💧", "eau"], ["nut", "🍞", "nutriments"], ["chal", "🌡", "chaleur"], ["o2", "💨", "dioxygène"]];
const TECH = [["aucune", "Aucune", [], "Les micro-organismes trouvent tout ce dont ils ont besoin : ils se multiplient vite."], ["frigo", "Réfrigérateur", ["chal"], "Il fait froid : les micro-organismes se multiplient beaucoup plus lentement."], ["congel", "Congélateur", ["chal", "eau"], "Très froid et l'eau devient de la glace : ils ne se multiplient plus."], ["pasteur", "Pasteurisation", ["kill"], "L'aliment est chauffé : la plupart des micro-organismes sont tués."], ["selsucre", "Sel ou sucre", ["eau"], "Le sel ou le sucre « attirent » l'eau : elle n'est plus disponible pour les micro-organismes."], ["vide", "Mise sous vide", ["o2"], "Sans air, plus de dioxygène pour la plupart des micro-organismes."]];
WID.bouclier = el => {
  let te = "aucune", lt = 0, grow = 0;
  el.innerHTML = `<div class="opt3">${segBtns("Technique de conservation", "te", TECH.map(x => [x[0], x[1]]), te)}</div><div class="figbox" style="max-width:30rem;margin:0 auto"></div><p class="readout" aria-live="polite"></p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => { const tk = TK(F), H = Math.max(W * 0.75, F * 15), cx = W / 2, cy = H / 2, rx = Math.min(W * 0.36, W / 2 - F * 3.4), ry = H / 2 - F * 3.4, now = performance.now() / 1000, T = TECH.find(x => x[0] === te), kill = T[2].includes("kill"), frozen = te === "congel"; let g = "";
    NEEDS.forEach(([k, ic, nm], i) => { const a = -Math.PI / 2 + i * Math.PI / 2, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry, off = T[2].includes(k); g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(F * 1.6)}" style="fill:var(--${off ? "bad-soft" : "ok-soft"});stroke:var(--${off ? "bad" : "ok"});stroke-width:2.5"/><text x="${f1(x)}" y="${f1(y + F * 0.45)}" text-anchor="middle" style="font-size:${f1(F * 1.3)}px">${ic}</text>` + sT(x, y + F * 2.4, (off ? "✗ " : "✓ ") + nm, "middle", tk * 0.9, `font-weight="800" style="fill:var(--${off ? "bad" : "ok"})"`); if (off) g += `<line x1="${f1(x - F * 1.2)}" y1="${f1(y - F * 1.2)}" x2="${f1(x + F * 1.2)}" y2="${f1(y + F * 1.2)}" style="stroke:var(--bad);stroke-width:4"/>`; });
    const n = Math.min(12, 1 + Math.floor(grow)), r = rng(4);
    for (let i = 0; i < n; i++) { const a = r() * 6.283, d = i ? F * (0.9 + r() * 1.3) : 0, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, wob = frozen || kill ? 0 : Math.sin(now * 6 + i) * 2; g += `<ellipse cx="${f1(x + wob)}" cy="${f1(y)}" rx="${f1(F * 0.85)}" ry="${f1(F * 0.5)}" transform="rotate(${f1(a * 57)} ${f1(x)} ${f1(y)})" style="fill:${kill ? "#9aa0a6" : frozen ? "#9fc6e6" : "#7a5aa8"};stroke:var(--ink);stroke-width:1.2"/>` + (kill ? sT(x, y + tk * 0.35, "✗", "middle", tk, 'font-weight="800" style="fill:var(--bad)"') : ""); }
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Un micro-organisme entouré de ses quatre besoins. La technique choisie barre un ou plusieurs besoins ; l'effet est écrit sous le dessin.">${g}</svg>`; });
  const upd = () => { press(el, "te", te); grow = 0; $(".readout", el).innerHTML = nb(TECH.find(x => x[0] === te)[3]); fig.draw(); };
  $$("[data-te]", el).forEach(b => b.onclick = () => { te = b.dataset.te; upd(); });
  loopWhile(el, ts => { const dt = lt ? Math.min(0.1, (ts - lt) / 1000) : 0; lt = ts; const sp = { aucune: 1.6, frigo: 0.25, congel: 0, pasteur: 0, selsucre: 0.15, vide: 0.3 }[te]; grow = Math.min(11.9, grow + dt * sp * (RM ? 0 : 1)); if (grow >= 11.9 && sp > 0) grow = 0; fig.draw(); });
  upd();
};

/* ---------- 3 · enquête : le pique-nique de Léo ---------- */
const PIC = [["poulet", "🍗", "Poulet rôti", "Sorti du réfrigérateur à 11 h, puis resté dans le panier, au soleil, jusqu'au repas de 16 h. Température dans le panier : 32 °C.", 1], ["yaourt", "🥛", "Yaourts", "Gardés toute la journée dans la glacière, avec des pains de glace : 6 °C.", 0], ["mayo", "🥚", "Mayonnaise maison", "Préparée le matin avec des œufs crus, puis restée 5 heures au soleil, hors de la glacière.", 1], ["confiture", "🍓", "Confiture", "Très sucrée. Pot ouvert le matin même.", 0], ["jus", "🧃", "Jus de fruits pasteurisé", "Brique fermée jusqu'au repas, bue en entier.", 0], ["pain", "🥖", "Pain", "Acheté le matin, sec et croustillant.", 0]];
WID.piquenique = el => {
  const I = xst().pic || (xst().pic = {}); let cur = null;
  el.innerHTML = `<div class="picnic"><p class="lead">${nb("☀ Samedi, 32 °C à l'ombre. Le soir, Léo a mal au ventre. Touche chaque aliment du pique-nique pour lire sa fiche.")}</p><div class="pics">${PIC.map(x => `<button type="button" class="picb" data-pi="${x[0]}"><span class="pe" aria-hidden="true">${x[1]}</span><span>${x[2]}</span><span class="pc"></span></button>`).join("")}</div></div><div class="box info pfiche" aria-live="polite"><p class="lab">ℹ Fiche de l'aliment</p><p class="pt">Touche un aliment.</p></div>`;
  const paint = () => { $$("[data-pi]", el).forEach(b => { const k = b.dataset.pi; b.setAttribute("aria-pressed", cur === k ? "true" : "false"); $(".pc", b).textContent = I[k] ? "✓ inspecté" : ""; }); const x = PIC.find(q => q[0] === cur); if (x) $(".pt", el).innerHTML = nb(`<b>${x[1]} ${x[2]}</b> : ${x[3]}`); };
  $$("[data-pi]", el).forEach(b => b.onclick = () => { cur = b.dataset.pi; if (!I[cur]) { I[cur] = 1; keep(); } paint(); });
  paint();
};
