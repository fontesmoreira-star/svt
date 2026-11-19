/* ===== 5e EIST · Mission 6 · Tempête de sable · Activité 1 · L'énergie éolienne sur Mars : simulations ===== */
Store.key = "eist5-eolienne-mars-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const N1 = x => (+x).toFixed(1);
const rng = s => { let x = s; return () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; }; };
/* texte SVG dont le style optionnel complète le style de base */
const sX = (x, y, txt, a, size, extra) => { extra = extra || ""; const m = extra.match(/style="([^"]*)"/); return `<text x="${N1(x)}" y="${N1(y)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${N1(size)}px;${m ? m[1] : ""}" ${extra.replace(/style="[^"]*"/, "")}>${esc(txt)}</text>`; };
const press = (el, key, cur) => $$(`[data-${key}]`, el).forEach(b => b.setAttribute("aria-pressed", b.dataset[key] === String(cur) ? "true" : "false"));
function loopWhile(el, fn) { let lt = 0; const st = ts => { if (!document.body.contains(el)) return; const dt = lt ? Math.min(0.1, (ts - lt) / 1000) : 0; lt = ts; fn(dt, ts); requestAnimationFrame(st); }; requestAnimationFrame(st); }

/* modèle de l'éolienne du document 1 : tourne dès 2 m/s, produit dès 4 m/s, maximum à 12 m/s, freine à 25 m/s */
const turns = v => v >= 2 && v < 25;
const power = v => v < 4 || v >= 25 ? 0 : v >= 12 ? 1 : (v ** 3 - 64) / (1728 - 64);
/* dessin : mât, nacelle, trois pales (angle a), lampe (allumée selon p), panneau de freinage */
function turbine(cx, base, h, a, p, brake, opt) {
  opt = opt || {}; const hub = base - h, L = h * 0.42, w = Math.max(5, h * 0.05);
  let g = `<path d="M${N1(cx - w * 0.6)},${N1(base)} L${N1(cx - w * 0.25)},${N1(hub)} L${N1(cx + w * 0.25)},${N1(hub)} L${N1(cx + w * 0.6)},${N1(base)} Z" style="fill:#eef1f4;stroke:#6b7782;stroke-width:1.4"/>`;
  g += `<g transform="translate(${N1(cx)} ${N1(hub)}) rotate(${N1(a)})">${[0, 120, 240].map(r => `<path transform="rotate(${r})" d="M0,0 L${N1(-w * 0.9)},${N1(-L * 0.18)} L${N1(-w * 0.35)},${N1(-L)} L${N1(w * 0.5)},${N1(-L * 0.2)} Z" style="fill:#fafbfc;stroke:#6b7782;stroke-width:1.3"/>`).join("")}</g>`;
  g += `<circle cx="${N1(cx)}" cy="${N1(hub)}" r="${N1(w * 0.9)}" style="fill:#8f9ba6;stroke:#4b5560"/>`;
  if (brake) g += `<g><circle cx="${N1(cx + L * 0.75)}" cy="${N1(hub - L * 0.75)}" r="${N1(h * 0.09)}" style="fill:#c62828;stroke:#fff;stroke-width:2"/><rect x="${N1(cx + L * 0.75 - h * 0.055)}" y="${N1(hub - L * 0.75 - h * 0.014)}" width="${N1(h * 0.11)}" height="${N1(h * 0.028)}" fill="#fff"/></g>`;
  if (opt.lamp !== false) {
    const lx = cx + h * 0.42, ly = base - h * 0.16, r = h * 0.075;
    g += `<path d="M${N1(cx + w * 0.6)},${N1(base - 2)} L${N1(lx)},${N1(base - 2)} L${N1(lx)},${N1(ly + r)}" style="fill:none;stroke:#4b5560;stroke-width:2"/>`;
    if (p > 0) g += `<circle cx="${N1(lx)}" cy="${N1(ly)}" r="${N1(r * (1.6 + 1.6 * p))}" style="fill:#ffd54a;opacity:${N1(0.15 + 0.45 * p)}"/>`;
    g += `<circle cx="${N1(lx)}" cy="${N1(ly)}" r="${N1(r)}" style="fill:${p > 0 ? "#ffd54a" : "#d7dbe0"};stroke:#4b5560;stroke-width:1.5"/><rect x="${N1(lx - r * 0.5)}" y="${N1(ly + r * 0.8)}" width="${N1(r)}" height="${N1(r * 0.5)}" fill="#4b5560"/>`;
  }
  return g;
}

/* ---------- 1 · la soufflerie : vent réglable, rotor, lampe, freinage ---------- */
const ZONE = v => v < 2 ? 0 : v < 4 ? 1 : v < 12 ? 2 : v < 25 ? 3 : 4;
WID.souffle = el => {
  let v = 0, a = 0; const R = rng(4), P = Array.from({ length: 26 }, () => ({ x: R(), y: R() }));
  el.innerHTML = `<p class="lead">${nb("Règle la vitesse du vent dans la soufflerie. Observe le rotor, la lampe et la barre de production.")}</p>
    <div class="field"><label>Vitesse du vent<input type="range" min="0" max="30" step="1" value="0" data-v aria-label="Vitesse du vent en mètres par seconde, de 0 à 30"></label></div>
    <div class="row">${[1, 3, 8, 15, 28].map(x => `<button type="button" class="btn ghost vbtn" data-vv="${x}">${x} m/s</button>`).join("")}</div>
    <div class="figbox" style="max-width:34rem;margin:0 auto"></div>
    <div class="prodw" aria-hidden="true"><span>Production d'électricité</span><div class="gauge"><i></i></div></div><p class="readout" aria-live="polite"></p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const H = Math.min(Math.max(W * 0.62, F * 11), F * 15), base = H - F * 0.8, th = H * 0.6;
    let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="12" style="fill:#d6ecfb"/><rect x="0" y="${N1(base)}" width="${W}" height="${N1(F * 0.8)}" rx="0" style="fill:#7a9a52"/>`;
    P.forEach(q => { if (v > 0) s += `<line x1="${N1(q.x * W)}" y1="${N1(q.y * base * 0.9 + 6)}" x2="${N1(q.x * W + Math.min(F * 2.4, 6 + v * 1.4))}" y2="${N1(q.y * base * 0.9 + 6)}" style="stroke:#fff;stroke-width:2.2;stroke-linecap:round;opacity:.9"/>`; });
    s += turbine(W * 0.42, base, th, a, power(v), v >= 25);
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Éolienne dans une soufflerie, vent de ${v} mètres par seconde">${s}</svg>`;
  });
  const upd = () => { $("[data-v]", el).value = v; press(el, "vv", v); $(".gauge i", el).style.width = (power(v) * 100) + "%"; $(".readout", el).innerHTML = nb(`Vent : <b>${v} m/s</b> · production : <b>${Math.round(power(v) * 100)} %</b> du maximum.`); const X = xst(); X.zones = X.zones || {}; X.zones[ZONE(v)] = 1; keep(); };
  $("[data-v]", el).oninput = e => { v = +e.target.value; upd(); };
  $$("[data-vv]", el).forEach(b => b.onclick = () => { v = +b.dataset.vv; upd(); });
  loopWhile(el, dt => { if (turns(v)) { a = (a + dt * (40 + v * 26)) % 360; } P.forEach(q => { q.x = (q.x + dt * v * 0.02) % 1; }); fig.draw(); });
  upd();
};

/* ---------- 2 · la double échelle m/s ↔ km/h ---------- */
WID.echelle = el => {
  let v = +(xst().ech || 0);
  el.innerHTML = `<p class="lead">${nb("Déplace le curseur rouge : il montre la même vitesse sur les deux échelles.")}</p>
    <div class="field"><label>Curseur<input type="range" min="0" max="30" step="0.5" value="${v}" data-e aria-label="Vitesse en mètres par seconde, de 0 à 30"></label></div><div class="row"><button type="button" class="btn ghost" data-st="-0.5" aria-label="Reculer le curseur de 0,5 mètre par seconde">◀ −0,5</button><button type="button" class="btn ghost" data-st="0.5" aria-label="Avancer le curseur de 0,5 mètre par seconde">+0,5 ▶</button></div><div class="figbox"></div><p class="readout" aria-live="polite"></p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F) * 0.85, L = F * 1, Rr = F * 3.2, pw = W - L - Rr, y1 = F * 2.4, y2 = F * 5.6, H = F * 7.6, X = ms => L + ms / 30 * pw;
    let s = `<line x1="${N1(X(0))}" x2="${N1(X(30))}" y1="${N1(y1)}" y2="${N1(y1)}" style="stroke:var(--ink);stroke-width:2"/><line x1="${N1(X(0))}" x2="${N1(X(30))}" y1="${N1(y2)}" y2="${N1(y2)}" style="stroke:var(--ink);stroke-width:2"/>`;
    const narrow = pw < F * 18, lm = narrow ? 10 : 5, lk = narrow ? 40 : 20;
    for (let m = 0; m <= 30; m++) { const big = m % 5 === 0; s += `<line x1="${N1(X(m))}" x2="${N1(X(m))}" y1="${N1(y1)}" y2="${N1(y1 - (big ? F * 0.55 : F * 0.3))}" style="stroke:var(--ink);stroke-width:${big ? 2 : 1.2}"/>`; if (m % lm === 0) s += sX(X(m), y1 - F * 0.75, String(m), "middle", tk); }
    for (let k = 0; k <= 100; k += 10) { const x = X(k / 3.6), big = k % 20 === 0, lab = k % lk === 0; s += `<line x1="${N1(x)}" x2="${N1(x)}" y1="${N1(y2)}" y2="${N1(y2 + (big ? F * 0.55 : F * 0.3))}" style="stroke:var(--ink);stroke-width:${big ? 2 : 1.2}"/>`; if (lab) s += sX(x, y2 + F * 1.35, String(k), "middle", tk); }
    s += sX(W - 2, y1 + F * 0.15, "m/s", "end", tk, 'font-weight="800"') + sX(W - 2, y2 + F * 0.15, "km/h", "end", tk, 'font-weight="800"');
    s += `<line x1="${N1(X(v))}" x2="${N1(X(v))}" y1="${N1(y1 - F * 0.9)}" y2="${N1(y2 + F * 0.9)}" style="stroke:var(--bad);stroke-width:3"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Double échelle : en haut les mètres par seconde de 0 à 30, en bas les kilomètres par heure de 0 à 100. Le curseur est sur ${fmt(v)} mètres par seconde.">${s}</svg>`;
  });
  const upd = () => { $(".readout", el).innerHTML = nb(`Curseur sur <b>${fmt(v)} m/s</b> (échelle du haut). Lis l'échelle du bas.`); fig.draw(); };
  $("[data-e]", el).oninput = e => { v = +e.target.value; xst().ech = v; keep(); upd(); };
  $$("[data-st]", el).forEach(b => b.onclick = () => { v = Math.max(0, Math.min(30, v + +b.dataset.st)); $("[data-e]", el).value = v; xst().ech = v; keep(); upd(); });
  upd();
};

/* ---------- 3 · une brise sur Terre, une tempête sur Mars ---------- */
WID.deuxvents = el => {
  let a = 0, run = true; const R = rng(9), dust = Array.from({ length: 70 }, () => ({ x: R(), y: R(), s: 0.6 + R() })), air = Array.from({ length: 22 }, () => ({ x: R(), y: R() })), mair = Array.from({ length: 3 }, () => ({ x: R(), y: R() }));
  el.innerHTML = `<p class="lead">${nb("À gauche, une éolienne sur Terre dans une petite brise. À droite, la même éolienne sur Mars, dans une tempête de poussière. Les points blancs représentent l'air qui pousse les pales.")}</p>
    <div class="row"><button type="button" class="btn ghost" data-run>⏸ Pause</button></div><div class="figbox"></div>
    <p class="cap">${nb("Sur Terre : brise de moins de 10 km/h. Sur Mars : vent de tempête jusqu'à 160 km/h, dans une atmosphère très peu épaisse.")}</p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), gap = F * 0.6, pw = (W - gap) / 2, H = Math.min(Math.max(pw * 1.25, F * 11), F * 15), base = H - F * 1.6, th = Math.min(H * 0.55, pw * 0.8);
    const panel = (x0, sky, ground, title, mars) => {
      let s = `<clipPath id="cp${mars ? 1 : 0}"><rect x="${N1(x0)}" y="0" width="${N1(pw)}" height="${N1(H)}" rx="12"/></clipPath><g clip-path="url(#cp${mars ? 1 : 0})"><rect x="${N1(x0)}" y="0" width="${N1(pw)}" height="${N1(H)}" style="fill:${sky}"/><rect x="${N1(x0)}" y="${N1(base)}" width="${N1(pw)}" height="${N1(H - base)}" style="fill:${ground}"/>`;
      if (mars) dust.forEach(q => { s += `<circle cx="${N1(x0 + q.x * pw)}" cy="${N1(q.y * base)}" r="${N1(1.4 * q.s + 0.6)}" style="fill:#b5532e;opacity:.55"/>`; });
      (mars ? mair : air).forEach(q => { s += `<circle cx="${N1(x0 + q.x * pw)}" cy="${N1(q.y * base * 0.95)}" r="${N1(F * 0.16)}" style="fill:#fff;opacity:.95"/>`; });
      s += turbine(x0 + pw * 0.4, base, th, a, 0, false) + `</g>` + sX(x0 + pw / 2, F * 1.2, title, "middle", tk, 'font-weight="800" style="fill:#102a33"');
      return s;
    };
    const s = panel(0, "#cfe8fb", "#7a9a52", "Sur Terre", false) + panel(pw + gap, "#e7b49a", "#b5532e", "Sur Mars", true);
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${N1(H)}" role="img" aria-label="Deux éoliennes identiques : sur Terre dans une petite brise, sur Mars dans une tempête de poussière. Elles tournent toutes les deux lentement et leurs lampes restent éteintes.">${s}</svg>`;
  });
  $("[data-run]", el).onclick = e => { run = !run; e.target.textContent = run ? "⏸ Pause" : "▶ Reprendre"; };
  loopWhile(el, dt => { if (!run) return; a = (a + dt * 95) % 360; dust.forEach(q => { q.x = (q.x + dt * 0.55 * q.s) % 1; }); air.forEach(q => { q.x = (q.x + dt * 0.04) % 1; }); mair.forEach(q => { q.x = (q.x + dt * 0.6) % 1; }); fig.draw(); });
};
