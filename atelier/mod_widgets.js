/* ===== Terminale ES · Thème 1 · 1.3 Le climat du futur · Activité 2 : comment sont faits les modèles climatiques · le laboratoire du climatologue ===== */
Store.key = "tes-climat-futur-modeles-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const xo = k => { const x = xst(); if (!x[k] || typeof x[k] !== "object") x[k] = {}; return x[k]; };
const N1 = x => (+x).toFixed(1);
const sX = (x, y, txt, a, size, extra) => { extra = extra || ""; const m = extra.match(/style="([^"]*)"/); return `<text x="${N1(x)}" y="${N1(y)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${N1(size)}px;${m ? m[1] : ""}" ${extra.replace(/style="[^"]*"/, "")}>${esc(txt)}</text>`; };
const rng = s => { let x = s >>> 0 || 1; return () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; }; };
const gauss = R => { const u = Math.max(1e-9, R()), v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const press = (el, sel, on) => $$(sel, el).forEach(b => b.setAttribute("aria-pressed", String(on(b))));
const f1 = x => fmt(x, 1), f2 = x => fmt(x, 2), f0 = x => fmt(x, 0);

/* ---------- masques terre / mer (mod_maps.js) ---------- */
const MB = {};
function maskBits(key, b) { if (!MB[key]) { const s = atob(b), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); MB[key] = u; } return MB[key]; }
const bit = (u, i) => (u[i >> 3] >> (7 - (i & 7))) & 1;
function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888"; }
const dark = () => document.documentElement.dataset.theme === "dark" || (!document.documentElement.dataset.theme && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
const PAL = () => dark() ? { sea: "#16344a", land: "#3f6b3a", landOff: "#4a4f55", seaOff: "#2b2f34", ice: "#f2f6fa", grid: "rgba(255,255,255,.35)", obs: "#ffb74d" } : { sea: "#a9cfe8", land: "#8cbf6e", landOff: "#c9ccd0", seaOff: "#e3e5e8", ice: "#f3f7fa", grid: "rgba(0,0,0,.28)", obs: "#d9480f" };
function canvasHost(host, ratio, paint) {
  host.innerHTML = `<canvas class="mapc" role="img"></canvas>`; const cv = host.firstChild;
  const o = { draw() { const W = Math.max(260, host.clientWidth || 320), H = Math.round(W * ratio), dpr = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.width = W + "px"; cv.style.height = H + "px"; const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0); paint(g, W, H, cv); }, cv };
  o.draw(); if (window.ResizeObserver) { let lw = host.clientWidth; new ResizeObserver(() => { const w = host.clientWidth; if (Math.abs(w - lw) > 4) { lw = w; o.draw(); } }).observe(host); }
  if (window.matchMedia) try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => o.draw()); } catch (e) {}
  return o;
}

/* ---------- graphique générique (une grandeur) ---------- */
function tickStep(range, maxT) { const raw = range / Math.max(1, maxT), p = Math.pow(10, Math.floor(Math.log10(raw))); for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= raw) return m * p; return 10 * p; }
function lchart(W, F, o) {
  const tk = TK(F), tt = Math.max(16, F * 0.82), H = o.H ? o.H(W, F) : Math.round(Math.min(Math.max(W * 0.58, F * 13), F * 19)), L = F * 3.7, R = F * 1.1, T = F * 0.9, B = F * 3.2, pw = W - L - R, ph = H - T - B;
  const X = v => L + (v - o.x0) / (o.x1 - o.x0) * pw, Y = v => T + ph - (v - o.y0) / (o.y1 - o.y0) * ph;
  let g = "";
  (o.vbands || []).forEach(b => { g += `<rect x="${N1(X(b.a))}" y="${N1(T)}" width="${N1(X(b.b) - X(b.a))}" height="${N1(ph)}" style="fill:var(--shade)"/>` + (b.lab ? sX((X(b.a) + X(b.b)) / 2, T + tk * 1.1, b.lab, "middle", tk * 0.9, `font-weight="700"`) : ""); });
  const xs = o.xStep || tickStep(o.x1 - o.x0, Math.floor(pw / (F * 3.4))), ys = o.yStep || tickStep(o.y1 - o.y0, Math.floor(ph / (F * 1.6)));
  for (let v = Math.ceil(o.x0 / xs - 1e-9) * xs; v <= o.x1 + 1e-9; v += xs) g += `<line x1="${N1(X(v))}" x2="${N1(X(v))}" y1="${N1(T)}" y2="${N1(T + ph)}" style="stroke:var(--grid)"/>` + sX(X(v), T + ph + tk * 1.35, o.xFmt ? o.xFmt(v) : fmt(Math.round(v * 100) / 100), "middle", tk);
  for (let v = Math.ceil(o.y0 / ys - 1e-9) * ys; v <= o.y1 + 1e-9; v += ys) g += `<line x1="${N1(L)}" x2="${N1(L + pw)}" y1="${N1(Y(v))}" y2="${N1(Y(v))}" style="stroke:var(--grid)${Math.abs(v) < 1e-9 && o.y0 < 0 ? ";stroke:var(--muted);stroke-width:1.4" : ""}"/>` + sX(L - 6, Y(v) + tk * 0.35, fmt(Math.round(v * 100) / 100), "end", tk);
  (o.hlines || []).forEach(h => { g += `<line x1="${N1(L)}" x2="${N1(L + pw)}" y1="${N1(Y(h.y))}" y2="${N1(Y(h.y))}" style="stroke:var(--${h.color || "muted"});stroke-width:1.8" stroke-dasharray="7 5"/>` + (h.lab ? sX(L + 6, Y(h.y) - 6, h.lab, "start", tk * 0.9, `font-weight="700"`) : ""); });
  const clip = (pts, cut) => cut === undefined || cut === null ? pts : pts.filter(p => p[0] <= cut);
  (o.bands || []).forEach(b => { const up = clip(b.hi, o.cut), dn = clip(b.lo, o.cut).slice().reverse(); if (up.length > 1) g += `<polygon points="${up.concat(dn).map(p => N1(X(p[0])) + "," + N1(Y(p[1]))).join(" ")}" style="fill:var(--${b.color});opacity:${b.op || 0.2}"/>`; });
  (o.series || []).forEach(s => { const pts = clip(s.pts, s.cut !== undefined ? s.cut : o.cut); if (pts.length < 1) return; g += `<path d="${pts.map((p, k) => (k ? "L" : "M") + N1(X(p[0])) + "," + N1(Y(p[1]))).join(" ")}" style="fill:none;stroke:var(--${s.color});stroke-width:${s.w || 3};stroke-linejoin:round;stroke-linecap:round;opacity:${s.op || 1}" stroke-dasharray="${s.dash || ""}"/>`; if (s.dot && pts.length < s.pts.length) { const p = pts[pts.length - 1]; g += `<circle cx="${N1(X(p[0]))}" cy="${N1(Y(p[1]))}" r="${N1(F * 0.26)}" style="fill:var(--${s.color});stroke:var(--surface);stroke-width:2"/>`; } });
  (o.marks || []).forEach(m => { if (o.cut !== undefined && o.cut !== null && m.x > o.cut) return; const cx = X(m.x), cy = Y(m.y), r = F * (m.r || 0.28); g += m.shape === "sq" ? `<rect x="${N1(cx - r)}" y="${N1(cy - r)}" width="${N1(2 * r)}" height="${N1(2 * r)}" style="fill:var(--${m.color || "ink"});stroke:var(--surface);stroke-width:1.5"/>` : `<circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(r)}" style="fill:var(--${m.color || "ink"});stroke:var(--surface);stroke-width:1.5"/>`; if (m.w) g += `<line x1="${N1(X(m.x - m.w))}" x2="${N1(X(m.x + m.w))}" y1="${N1(cy)}" y2="${N1(cy)}" style="stroke:var(--${m.color || "ink"});stroke-width:3"/>`; });
  if (o.sel !== undefined && o.sel !== null) g += `<line x1="${N1(X(o.sel))}" x2="${N1(X(o.sel))}" y1="${N1(T)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5" stroke-dasharray="3 3"/>`;
  g += `<line x1="${N1(L)}" x2="${N1(L + pw)}" y1="${N1(T + ph)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${N1(L)}" x2="${N1(L)}" y1="${N1(T)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5"/>`;
  g += sX(L + pw / 2, H - F * 0.35, o.xTitle || "", "middle", tt, `font-weight="700"`) + `<text transform="translate(${N1(F * 0.95)},${N1(T + ph / 2)}) rotate(-90)" text-anchor="middle" style="fill:var(--ink);font-size:${N1(tt)}px;font-weight:700">${esc(o.yTitle || "")}</text>`;
  o.geo = { L, pw, x0: o.x0, x1: o.x1 };
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(o.alt || o.yTitle || "Graphique")}">${g}</svg>`;
}
const xAt = (o, host, ev) => { const svg = host.querySelector("svg"); if (!svg || !o.geo) return null; const r = svg.getBoundingClientRect(), sx = (ev.clientX - r.left) * (svg.viewBox.baseVal.width / r.width); return Math.max(o.geo.x0, Math.min(o.geo.x1, o.geo.x0 + (sx - o.geo.L) / o.geo.pw * (o.geo.x1 - o.geo.x0))); };
const legend = items => `<ul class="mleg">${items.map(i => `<li><svg width="34" height="14" aria-hidden="true"><path d="M2 7 H32" style="stroke:var(--${i.color});stroke-width:${i.w || 3.4};fill:none;stroke-linecap:round;opacity:${i.op || 1}" stroke-dasharray="${i.dash || ""}"/>${i.dot ? `<circle cx="17" cy="7" r="5" style="fill:var(--${i.color})"/>` : ""}</svg><span>${i.lab}</span></li>`).join("")}</ul>`;

/* =========================================================================================
   1 · Construire une Terre virtuelle, module par module (MCGOA → MST)
   ========================================================================================= */
const MODS = [
  { k: "atm", ic: "🌬", n: "Atmosphère", d: "vents, nuages, pluies, rayonnement" },
  { k: "oce", ic: "🌊", n: "Océan", d: "courants marins, stockage de la chaleur" },
  { k: "gla", ic: "🧊", n: "Glaces de mer", d: "banquise, albédo des pôles" },
  { k: "con", ic: "🌳", n: "Continents", d: "végétation, sols, neige, rivières" },
  { k: "ret", ic: "🔁", n: "Rétroactions (cycle du carbone)", d: "CO₂ absorbé ou rejeté par l'océan et la végétation" }];
const COUPL = [["atm", "oce", "chaleur, évaporation de l'eau, entraînement des courants par le vent"], ["atm", "con", "évaporation des sols et des plantes, neige, poussières"], ["oce", "gla", "formation et fonte de la banquise"], ["con", "gla", "eau douce des rivières, neige et glace"], ["atm", "gla", "albédo : la glace réfléchit le rayonnement solaire"]];
function mstName(m) {
  const n = MODS.filter(x => m[x.k]).length, four = ["atm", "oce", "gla", "con"].every(k => m[k]);
  if (four && m.ret) return ["MST · modèle du système Terre", "à partir des années 2000 : on ajoute les rétroactions, notamment celles du cycle du carbone.", "ok"];
  if (four) return ["MCGOA · modèle de circulation générale océan-atmosphère (+ glaces de mer et continents)", "années 1990 : les modèles utilisés par le GIEC.", "mid"];
  if (m.atm && m.oce && n === 2) return ["Modèle couplé océan-atmosphère", "1969 : premier couplage d'un océan et d'une atmosphère sur ordinateur.", "mid"];
  if (m.atm && n === 1) return ["Modèle d'atmosphère seule", "1950 : premiers calculs du temps sur ordinateur.", ""];
  if (!n) return ["Aucun module", "Touche un module pour commencer à construire ta Terre virtuelle.", ""];
  return ["Modèle incomplet", "Les modules doivent être couplés à l'atmosphère pour échanger chaleur, eau et CO₂.", ""];
}
WID.mst = el => {
  const m = xo("mst"); if (m.atm === undefined) m.atm = true;
  el.innerHTML = `<p class="lead">${nb("Ajoute les modules un par un : chacun contient des variables et des équations. Observe ce que ta Terre virtuelle sait simuler.")}</p>
    <div class="seg mods" role="group" aria-label="Modules du modèle">${MODS.map(x => `<button type="button" data-m="${x.k}"><span aria-hidden="true">${x.ic}</span> ${x.n}</button>`).join("")}</div>
    <div class="mstw"><div class="mstd" data-d></div><div class="figbox" data-map></div></div>
    <div class="mstn" data-n aria-live="polite"></div><div data-sim></div>`;
  const map = canvasHost($("[data-map]", el), 0.5, (g, W, H, cv) => {
    const G = MASK.glob, u = maskBits("glob", G.b), P = PAL(), cw = W / G.nx, chh = H / G.ny, t = (Date.now() / 1000);
    for (let j = 0; j < G.ny; j++) for (let i = 0; i < G.nx; i++) { const land = bit(u, j * G.nx + i), lat = 90 - (j + 0.5) * G.r;
      let c = land ? (m.con ? P.land : P.landOff) : (m.oce ? P.sea : P.seaOff);
      if (m.gla && !land && Math.abs(lat) > 68) c = P.ice; if (land && (lat < -62 || (lat > 60 && (i * 2 - 180) > -75 && (i * 2 - 180) < -10))) c = m.con ? P.ice : P.landOff;
      g.fillStyle = c; g.fillRect(i * cw, j * chh, cw + 0.6, chh + 0.6); }
    if (m.atm) { g.strokeStyle = dark() ? "rgba(255,255,255,.75)" : "rgba(255,255,255,.95)"; g.lineWidth = 2; [[-60, 1], [-30, -1], [30, 1], [60, -1]].forEach(([la, d]) => { const y = (90 - la) / 180 * H; for (let k = 0; k < 6; k++) { const x0 = ((k / 6) * W + d * 18) % W; g.beginPath(); g.moveTo(x0, y); g.quadraticCurveTo(x0 + 18 * d, y - 6, x0 + 36 * d, y); g.stroke(); g.beginPath(); g.moveTo(x0 + 36 * d, y); g.lineTo(x0 + 28 * d, y - 4); g.moveTo(x0 + 36 * d, y); g.lineTo(x0 + 28 * d, y + 4); g.stroke(); } }); }
    if (m.ret) { g.font = `${Math.max(12, W / 40)}px sans-serif`; g.fillStyle = dark() ? "#ffd27a" : "#8a4b00"; [[0.18, 0.62], [0.52, 0.42], [0.8, 0.55], [0.35, 0.8]].forEach(([x, y]) => g.fillText("↻CO₂", x * W, y * H)); }
    cv.setAttribute("aria-label", "Carte de la Terre virtuelle : " + (MODS.filter(x => m[x.k]).map(x => x.n).join(", ") || "aucun module"));
  });
  const paint = () => {
    press(el, "[data-m]", b => !!m[b.dataset.m]);
    const on = k => m[k], box = (k, cls) => { const x = MODS.find(y => y.k === k); return `<div class="mb ${on(k) ? "on" : "off"} ${cls || ""}"><b><span aria-hidden="true">${x.ic}</span> ${x.n}</b><span>${on(k) ? x.d : "module absent"}</span></div>`; };
    const four = ["atm", "oce", "gla", "con"].every(on);
    $("[data-d]", el).innerHTML = `<div class="mst ${four && on("ret") ? "full" : ""}"><p class="mlab mst-l">Modèle du système Terre (MST)</p><div class="mcg ${four ? "full" : ""}"><p class="mlab mcg-l">MCGOA</p><div class="mg4">${box("oce")}${box("gla")}${box("atm")}${box("con")}</div></div>${box("ret", "rt")}</div>`;
    const N = mstName(m), cp = COUPL.filter(([a, b]) => on(a) && on(b));
    const ph = MODS.filter(x => on(x.k)).map(x => x.d).concat(cp.map(c => c[2]));
    $("[data-n]", el).innerHTML = `<p class="chip ${N[2]}">${N[0]}</p><p class="lead">${nb(N[1])}</p>`;
    $("[data-sim]", el).innerHTML = `<p class="plab">Ce que ma Terre virtuelle sait simuler (${ph.length})</p>${ph.length ? `<ul class="ul ph">${ph.map(p => `<li>${p}</li>`).join("")}</ul>` : `<p class="lead">Rien pour l'instant.</p>`}${cp.length ? `<p class="plab">Échanges entre modules couplés (${cp.length}) : une flèche = des équations</p><ul class="ul ph">${cp.map(([a, b, t]) => `<li>${MODS.find(x => x.k === a).n} ⇄ ${MODS.find(x => x.k === b).n} : ${t}</li>`).join("")}</ul>` : ""}`;
    map.draw();
  };
  $$("[data-m]", el).forEach(b => b.onclick = () => { m[b.dataset.m] = !m[b.dataset.m]; keep(); paint(); $(`[data-m="${b.dataset.m}"]`, el).focus(); });
  paint();
};
const mstFull = () => { const m = xo("mst"); return MODS.every(x => m[x.k]); };

/* =========================================================================================
   2 · Des équations aux mailles : la résolution d'un modèle
   ========================================================================================= */
const RES = [{ r: 5, km: 500 }, { r: 2.5, km: 250 }, { r: 1, km: 100 }, { r: 0.5, km: 50 }, { r: 0.25, km: 25 }, { r: 0.1, km: 10 }];
const LUX = { lon: 6.13, lat: 49.61, area: 2586 };
const cols = km => 510e6 / (km * km), costRel = km => Math.pow(100 / km, 3);
function dur(km) { const mo = costRel(km); const h = mo * 30 * 24; if (h < 48) return f0(Math.max(1, h)) + " heures"; if (mo < 1) return f0(h / 24) + " jours"; if (mo < 12) return f0(mo) + " mois"; return f0(mo / 12) + " ans"; }
WID.maille = el => {
  const st = xo("res"); if (!st.seen || typeof st.seen !== "object") st.seen = {}; if (!RES.some(x => x.km === st.km)) st.km = 500; st.seen[st.km] = 1;
  el.innerHTML = `<p class="lead">${nb("Dans un modèle, la Terre est découpée en mailles. Dans chaque maille, une seule valeur de température, de vent, d'humidité… Choisis la taille des mailles et regarde l'Europe de l'Ouest.")}</p>
    <div class="seg" role="group" aria-label="Taille des mailles">${RES.map(x => `<button type="button" data-km="${x.km}">${x.km} km</button>`).join("")}</div>
    <div class="figbox" data-map></div><p class="cap" data-cap></p><div data-info></div>`;
  const map = canvasHost($("[data-map]", el), 25 / 45 * 1.15, (g, W, H, cv) => {
    const E = MASK.eu, x = RES.find(y => y.km === st.km), R = E.res[String(x.r)], u = maskBits("eu" + x.r, R.b), P = PAL(), cw = W / R.nx, ch = H / R.ny;
    for (let j = 0; j < R.ny; j++) for (let i = 0; i < R.nx; i++) { g.fillStyle = bit(u, j * R.nx + i) ? P.land : P.sea; g.fillRect(i * cw, j * ch, cw + 0.6, ch + 0.6); }
    if (cw >= 5) { g.strokeStyle = P.grid; g.lineWidth = 1; g.beginPath(); for (let i = 0; i <= R.nx; i++) { g.moveTo(i * cw, 0); g.lineTo(i * cw, H); } for (let j = 0; j <= R.ny; j++) { g.moveTo(0, j * ch); g.lineTo(W, j * ch); } g.stroke(); }
    const lx = (LUX.lon - E.lon0) / (E.lon1 - E.lon0) * W, ly = (E.lat1 - LUX.lat) / (E.lat1 - E.lat0) * H, ci = Math.floor((LUX.lon - E.lon0) / x.r), cj = Math.floor((E.lat1 - LUX.lat) / x.r);
    g.strokeStyle = "#d62828"; g.lineWidth = 3; g.strokeRect(ci * cw, cj * ch, cw, ch);
    g.fillStyle = "#d62828"; g.beginPath(); g.arc(lx, ly, 5, 0, 7); g.fill();
    const fs = Math.max(14, W / 34); g.font = `700 ${fs}px sans-serif`; g.lineWidth = 4; g.strokeStyle = dark() ? "#111" : "#fff"; g.strokeText("Luxembourg", lx + 8, ly - 8); g.fillStyle = "#d62828"; g.fillText("Luxembourg", lx + 8, ly - 8);
    cv.setAttribute("aria-label", `Carte de l'Europe de l'Ouest avec des mailles de ${x.km} km`);
  });
  const paint = () => {
    press(el, "[data-km]", b => +b.dataset.km === st.km);
    const km = st.km, x = RES.find(y => y.km === km), E = MASK.eu, R = E.res[String(x.r)], u = maskBits("eu" + x.r, R.b), ci = Math.floor((LUX.lon - E.lon0) / x.r), cj = Math.floor((E.lat1 - LUX.lat) / x.r), luxLand = bit(u, cj * R.nx + ci);
    $("[data-cap]", el).innerHTML = nb(`Carré rouge : la maille qui contient Luxembourg (${luxLand ? "classée « terre »" : "classée « mer » !"}). ⚠ Carte réelle découpée en mailles d'environ ${km} km (masque terre/mer GLOBE, NOAA).`);
    const n = cols(km), seen = Object.keys(st.seen).length, mx = Math.log10(costRel(10)), mn = Math.log10(costRel(500));
    $("[data-info]", el).innerHTML = tbl(["Pour des mailles de " + km + " km", "Valeur"], [["Colonnes d'air sur toute la Terre", nb(fmt(Math.round(n / (n > 1e5 ? 1000 : 1)) * (n > 1e5 ? 1000 : 1)))], ["Mailles avec 50 niveaux d'altitude", nb(n * 50 >= 1e6 ? fmt(Math.round(n * 50 / 1e5) / 10) + " millions" : fmt(Math.round(n * 50)))], ["Le Luxembourg (2 586 km²) occupe", nb(LUX.area / (km * km) < 1 ? fmt(Math.round(LUX.area / (km * km) * 100) / 100) + " maille (moins d'une !)" : fmt(Math.round(LUX.area / (km * km))) + " mailles")], ["Calculs à faire, par rapport à 100 km", nb(costRel(km) >= 1 ? "× " + fmt(Math.round(costRel(km))) : "÷ " + fmt(Math.round(1 / costRel(km))))], ["Durée d'une simulation de 100 ans", "≈ " + nb(dur(km))]])
      + `<div class="costbar" aria-hidden="true"><i style="width:${N1(8 + 92 * (Math.log10(costRel(km)) - mn) / (mx - mn))}%"></i></div><p class="cap">${nb("⚠ Ordre de grandeur simplifié : on prend 1 mois de calcul sur un supercalculateur pour 100 ans de climat avec des mailles de 100 km. Quand la maille est divisée par 2, il y a 4 fois plus de colonnes et il faut un pas de temps 2 fois plus court : 8 fois plus de calculs.")} · Tailles testées : ${seen}/${RES.length}</p>`;
  };
  $$("[data-km]", el).forEach(b => b.onclick = () => { st.km = +b.dataset.km; st.seen[st.km] = 1; keep(); paint(); map.draw(); $(`[data-km="${st.km}"]`, el).focus(); });
  paint();
};
const resSeen = () => Object.keys(xo("res").seen || {}).length;

/* =========================================================================================
   3 · Météo ou climat ? Deux simulations presque identiques (modèle de Lorenz, 1963)
   ========================================================================================= */
function lorenz(x, y, z, n, dt, keepEvery) {
  const out = []; const f = (a, b, c) => [10 * (b - a), a * (28 - c) - b, a * b - 8 / 3 * c];
  for (let i = 0; i <= n; i++) {
    if (i % keepEvery === 0) out.push([i * dt, x, y, z]);
    const k1 = f(x, y, z), k2 = f(x + dt / 2 * k1[0], y + dt / 2 * k1[1], z + dt / 2 * k1[2]), k3 = f(x + dt / 2 * k2[0], y + dt / 2 * k2[1], z + dt / 2 * k2[2]), k4 = f(x + dt * k3[0], y + dt * k3[1], z + dt * k3[2]);
    x += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); z += dt / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
  }
  return out;
}
const LZ = { x0: 1, y0: 1, z0: 20, d: 0.001, tmax: 30 };
let LZA = null, LZB = null, LZC = null;
function lzRuns() { if (!LZA) { LZA = lorenz(LZ.x0, LZ.y0, LZ.z0, LZ.tmax / 0.005, 0.005, 4); LZB = lorenz(LZ.x0 + LZ.d, LZ.y0, LZ.z0, LZ.tmax / 0.005, 0.005, 4); } return [LZA, LZB]; }
const lzSplit = () => { const [a, b] = lzRuns(); const k = a.findIndex((p, i) => Math.abs(p[1] - b[i][1]) > 4); return k < 0 ? LZ.tmax : a[k][0]; };
function lzClim() {
  if (LZC) return LZC; const bins = 16, lo = -20, hi = 20, H = [new Array(bins).fill(0), new Array(bins).fill(0)], stats = [];
  [LZ.x0, LZ.x0 + LZ.d].forEach((x0, r) => { const a = lorenz(x0, LZ.y0, LZ.z0, 200000, 0.005, 2); let s = 0, s2 = 0, n = 0; a.forEach((p, i) => { if (i < 2000) return; const b = Math.max(0, Math.min(bins - 1, Math.floor((p[1] - lo) / (hi - lo) * bins))); H[r][b]++; s += p[1]; s2 += p[1] * p[1]; n++; }); stats.push({ m: s / n, sd: Math.sqrt(s2 / n - (s / n) ** 2), n }); H[r] = H[r].map(v => v / n * 100); });
  return (LZC = { H, stats, bins, lo, hi });
}
WID.lorenz = el => {
  const st = xo("lz");
  el.innerHTML = `<p class="lead">${nb("Edward Lorenz (1963) a réduit l'atmosphère à trois équations. On lance deux simulations dont le point de départ ne diffère que de 0,001 : une erreur de mesure minuscule. La courbe suit une variable du modèle, qu'on peut voir comme la force du vent.")}</p>
    <div class="figbox" data-fig></div><div class="row animctl" data-ctl></div>${legend([{ color: "c1", lab: "Simulation A" }, { color: "c2", lab: "Simulation B (départ décalé de 0,001)", dash: "7 4" }])}<p class="readout" data-ro aria-live="polite"></p>
    <div class="clim"><button type="button" class="btn" data-clim>📊 Calculer le climat des deux simulations</button><p class="lead">${nb("Le climat, c'est la statistique de la météo : on fait tourner chaque simulation très longtemps (100 000 pas de calcul) et on compte combien de fois chaque valeur apparaît.")}</p><div data-h></div></div>`;
  const [A, B] = lzRuns(); let cut = 0;
  const o = { x0: 0, x1: LZ.tmax, y0: -22, y1: 22, yStep: 10, xTitle: "Temps du modèle", yTitle: "Force du vent", alt: "Deux simulations de Lorenz superposées" };
  const fig = liveSVG($("[data-fig]", el), (W, F) => { o.cut = cut; o.series = [{ pts: A.map(p => [p[0], p[1]]), color: "c1", w: 2.6, dot: true }, { pts: B.map(p => [p[0], p[1]]), color: "c2", w: 2.6, dash: "7 4", dot: true }]; return lchart(W, F, o); });
  const ro = () => { const k = Math.min(A.length - 1, Math.round(cut / (LZ.tmax) * (A.length - 1))), dd = Math.abs(A[k][1] - B[k][1]); $("[data-ro]", el).innerHTML = `Temps <b>${f1(A[k][0])}</b> : A → <b>${f1(A[k][1])}</b> · B → <b>${f1(B[k][1])}</b> · écart <b>${f1(dd)}</b>${cut >= LZ.tmax - 1e-9 ? ` · les deux « météos » se séparent vers t ≈ <b>${f0(lzSplit())}</b>` : ""}`; };
  animCtl($("[data-ctl]", el), 9000, p => { cut = p * LZ.tmax; fig.draw(); ro(); if (p >= 1 && !st.done) { st.done = 1; keep(); } });
  if (st.done) { cut = LZ.tmax; fig.draw(); ro(); }
  const showH = () => {
    const C = lzClim(), hb = $("[data-h]", el);
    liveSVG(hb, (W, F) => {
      const tk = TK(F), H = Math.round(Math.min(Math.max(W * 0.5, F * 12), F * 16)), L = F * 3.4, R = F * 0.8, T = F * 0.8, Bm = F * 3.2, pw = W - L - R, ph = H - T - Bm, ymax = Math.ceil(Math.max(...C.H[0], ...C.H[1]) / 2) * 2, bw = pw / C.bins;
      let g = ""; for (let v = 0; v <= ymax; v += 2) g += `<line x1="${N1(L)}" x2="${N1(L + pw)}" y1="${N1(T + ph - v / ymax * ph)}" y2="${N1(T + ph - v / ymax * ph)}" style="stroke:var(--grid)"/>` + sX(L - 6, T + ph - v / ymax * ph + tk * .35, fmt(v), "end", tk);
      for (let i = 0; i < C.bins; i++) [0, 1].forEach(r => { const v = C.H[r][i], h = v / ymax * ph; g += `<rect x="${N1(L + i * bw + 2 + r * (bw - 4) / 2)}" y="${N1(T + ph - h)}" width="${N1((bw - 4) / 2)}" height="${N1(h)}" style="fill:var(--${r ? "c2" : "c1"})"/>`; });
      for (let v = C.lo; v <= C.hi; v += 10) g += sX(L + (v - C.lo) / (C.hi - C.lo) * pw, T + ph + tk * 1.35, fmt(v), "middle", tk);
      g += `<line x1="${N1(L)}" x2="${N1(L + pw)}" y1="${N1(T + ph)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5"/>` + sX(L + pw / 2, H - F * .35, "Force du vent", "middle", Math.max(16, F * .82), `font-weight="700"`) + `<text transform="translate(${N1(F * .95)},${N1(T + ph / 2)}) rotate(-90)" text-anchor="middle" style="fill:var(--ink);font-size:${N1(Math.max(16, F * .82))}px;font-weight:700">Fréquence (%)</text>`;
      return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Histogrammes des deux simulations">${g}</svg>`;
    });
    hb.insertAdjacentHTML("beforeend", legend([{ color: "c1", lab: "Simulation A", w: 10 }, { color: "c2", lab: "Simulation B", w: 10 }]) + tbl(["Statistique sur 100 000 pas", "Simulation A", "Simulation B"], [["Moyenne", f2(C.stats[0].m), f2(C.stats[1].m)], ["Écart type (variabilité)", f2(C.stats[0].sd), f2(C.stats[1].sd)]]) + `<p class="cap">⚠ Valeurs simulées (modèle de Lorenz).</p>`);
  };
  $("[data-clim]", el).onclick = () => { st.clim = 1; keep(); showH(); $("[data-clim]", el).textContent = "✓ Climat calculé"; };
  if (st.clim) { showH(); $("[data-clim]", el).textContent = "✓ Climat calculé"; }
};

/* =========================================================================================
   4 · Le test du présent : profil de température en fonction de la latitude (modèle de bilan d'énergie)
   ========================================================================================= */
const EBM = (() => {
  const n = 90, lat = [], cf = [], s = [], cfh = [], dphi = Math.PI / 180;
  for (let i = 0; i < n; i++) { const p = (i + 0.5) * dphi; lat.push(i + 0.5); cf.push(Math.cos(p)); const x = Math.sin(p); s.push(1 - 0.482 * (3 * x * x - 1) / 2); }
  for (let i = 0; i <= n; i++) cfh.push(i === 0 || i === n ? 0 : Math.cos(i * dphi));
  return { n, lat, cf, s, cfh, dphi, Q: 1361 / 4, A: 203.3, B: 2.09, a0: 0.3, ai: 0.25, w: 6 };
})();
const OBSLAT = [[5, 26.5], [15, 25.5], [25, 22], [35, 16.5], [45, 9.5], [55, 2.5], [65, -6], [75, -15], [85, -23]];
function ebmSolve(D) {
  const E = EBM, n = E.n, k = E.lat.map((_, i) => D / (E.dphi * E.dphi * E.cf[i])), a = [], b = [], c = [];
  for (let i = 0; i < n; i++) { a.push(i ? -k[i] * E.cfh[i] : 0); c.push(i < n - 1 ? -k[i] * E.cfh[i + 1] : 0); b.push(E.B + k[i] * (E.cfh[i] + E.cfh[i + 1])); }
  let T = new Array(n).fill(15);
  for (let it = 0; it < 160; it++) {
    const d = T.map((t, i) => E.Q * E.s[i] * (1 - (E.a0 + E.ai * 0.5 * (1 - Math.tanh((t + 10) / E.w)))) - E.A);
    const cp = new Array(n), dp = new Array(n); cp[0] = c[0] / b[0]; dp[0] = d[0] / b[0];
    for (let i = 1; i < n; i++) { const m = b[i] - a[i] * cp[i - 1]; cp[i] = c[i] / m; dp[i] = (d[i] - a[i] * dp[i - 1]) / m; }
    const x = new Array(n); x[n - 1] = dp[n - 1]; for (let i = n - 2; i >= 0; i--) x[i] = dp[i] - cp[i] * x[i + 1];
    T = T.map((t, i) => 0.6 * t + 0.4 * x[i]);
  }
  return T;
}
const ebmAt = (T, l) => { const i = Math.max(0, Math.min(EBM.n - 2, Math.floor(l - 0.5))), f = (l - 0.5) - i; return T[i] * (1 - f) + T[i + 1] * f; };
const ebmErr = T => Math.sqrt(OBSLAT.reduce((s, [l, v]) => s + (ebmAt(T, l) - v) ** 2, 0) / OBSLAT.length);
const ebmMean = T => T.reduce((s, t, i) => s + t * EBM.cf[i], 0) / EBM.cf.reduce((a, b) => a + b, 0);
const EBMC = {}; const ebm = D => { const k = D.toFixed(2); return EBMC[k] || (EBMC[k] = ebmSolve(D)); };
const PROF_OK = 3;
WID.profil = el => {
  const st = xo("prof"); if (!Number.isFinite(st.D)) st.D = 0; if (!Array.isArray(st.tried)) st.tried = [];
  el.innerHTML = `<p class="lead">${nb("Le modèle calcule l'équilibre entre l'énergie solaire reçue et l'énergie infrarouge émise, à chaque latitude. Les vents et les courants marins transportent de la chaleur de l'équateur vers les pôles : c'est le paramètre à régler. Compare au climat observé.")}</p>
    <div class="field"><label>Transport de chaleur par les vents et les courants : <b data-dv></b><input type="range" min="0" max="1" step="0.02" data-d aria-label="Efficacité du transport de chaleur, de 0 à 1"></label><div class="row">${[-0.1, -0.02, 0.02, 0.1].map(d => `<button type="button" class="btn ghost sm" data-dd="${d}">${d > 0 ? "+" : "−"}${fmt(Math.abs(d))}</button>`).join("")}</div></div>
    <div class="figbox" data-fig></div>${legend([{ color: "c2", lab: "Modèle (moyenne des deux hémisphères)" }, { color: "ink", lab: "Observations (stations, bouées, satellites), arrondies", dot: true, w: 0.01 }])}
    <div class="score" data-sc aria-live="polite"></div><div data-tab></div>`;
  const o = { x0: 0, x1: 90, y0: -60, y1: 60, yStep: 20, xTitle: "Latitude (°)", yTitle: "Température (°C)", alt: "Température moyenne en fonction de la latitude" };
  const fig = liveSVG($("[data-fig]", el), (W, F) => { const T = ebm(st.D); o.series = [{ pts: EBM.lat.map((l, i) => [l, T[i]]), color: "c2", w: 3.4 }]; o.marks = OBSLAT.map(([l, v]) => ({ x: l, y: v, color: "ink", r: 0.3 })); return lchart(W, F, o); });
  const paint = () => {
    const T = ebm(st.D), e = ebmErr(T), ok = e < PROF_OK; $("[data-dv]", el).textContent = f2(st.D); $("[data-d]", el).value = st.D;
    if (ok) st.ok = 1;
    const k = st.D.toFixed(2); if (!st.tried.includes(k)) { st.tried.push(k); if (st.tried.length > 40) st.tried.shift(); }
    $("[data-sc]", el).innerHTML = `<p class="big ${ok ? "ok" : "bad"}">Écart moyen avec les observations : <b>${f1(e)} °C</b> ${ok ? "· ✓ moins de 3 °C : le modèle reproduit le climat actuel" : "· ✗ plus de 3 °C : modifie le modèle"}</p>`;
    $("[data-tab]", el).innerHTML = tbl(["Latitude", "Modèle", "Observé"], OBSLAT.filter((_, i) => i % 2 === 0).map(([l, v]) => [l + "°", f1(ebmAt(T, l)) + " °C", f1(v) + " °C"])) + `<p class="cap">${nb(`Moyenne du globe dans le modèle : ${f1(ebmMean(T))} °C · ⚠ Valeurs simulées ; observations : moyennes annuelles arrondies.`)}</p>`;
    fig.draw(); keep();
  };
  const set = v => { st.D = Math.max(0, Math.min(1, Math.round(v * 50) / 50)); paint(); };
  $("[data-d]", el).addEventListener("input", e => set(+e.target.value));
  $$("[data-dd]", el).forEach(b => b.onclick = () => set(st.D + +b.dataset.dd));
  paint();
};
const profOk = () => !!xo("prof").ok;

/* =========================================================================================
   5 · Le test du passé : −21 000 ans (dernier maximum glaciaire)
   ========================================================================================= */
const PALEO = { Fg: 5.35 * Math.log(185 / 280) - 0.5 - 1.0, k: 1.06, orb: 4, a: 3.08, L0: 70, Tdata: [-7, -5], Ldata: [45, 50] };
function obsLim(lon) { const S = [[-180, -170, 62], [-170, -140, 60], [-140, -125, 49], [-125, -110, 47], [-110, -95, 44], [-95, -80, 39], [-80, -68, 41], [-68, -50, 45], [-50, -10, 60], [-10, -5, 52], [-5, 2, 51.5], [2, 10, 53], [10, 25, 52], [25, 35, 54], [35, 50, 58], [50, 65, 62], [65, 180, 74]]; for (const [a, b, v] of S) if (lon >= a && lon < b) return v; return 74; }
const OBSMEAN = 47.5;
const isGreen = (lon, lat) => lon > -75 && lon < -10 && lat > 59;
let PALCELLS = null;
function palCells() { if (PALCELLS) return PALCELLS; const G = MASK.glob, u = maskBits("glob", G.b), out = []; let W = 0; for (let j = 0; j < G.ny; j++) { const lat = 90 - (j + 0.5) * G.r, w = Math.cos(lat * Math.PI / 180); for (let i = 0; i < G.nx; i++) { W += w; const lon = -180 + (i + 0.5) * G.r; if (bit(u, j * G.nx + i) && lat > 25 && !isGreen(lon, lat)) out.push({ i, j, lat, lon, w, off: obsLim(lon) - OBSMEAN }); } } PALCELLS = { cells: out, W }; return PALCELLS; }
const iceArea = L => { const P = palCells(); let s = 0; P.cells.forEach(c => { if (c.lat >= c.off + L && c.lat < 80) s += c.w; }); return s / P.W * 100; };
function paleoRun(S) { let L = PALEO.L0, T = 0; const h = [{ T, L }]; for (let i = 0; i < 50; i++) { T = S / 3.7 * (PALEO.Fg - PALEO.k * iceArea(L)); const Ln = Math.max(30, Math.min(72, PALEO.L0 - PALEO.orb + PALEO.a * T)); L += 0.5 * (Ln - L); h.push({ T, L }); } return h; }
const PALC = {}; const paleo = S => PALC[S] || (PALC[S] = paleoRun(S));
const palOk = r => r.T >= PALEO.Tdata[0] && r.T <= PALEO.Tdata[1] && r.L >= PALEO.Ldata[0] && r.L <= PALEO.Ldata[1];
const palVerdict = r => r.T > PALEO.Tdata[1] ? "trop chaud" : r.T < PALEO.Tdata[0] ? "trop froid" : r.L < PALEO.Ldata[0] ? "calottes trop étendues" : r.L > PALEO.Ldata[1] ? "calottes trop petites" : "compatible";
WID.paleo = el => {
  const st = xo("pal"); if (!Number.isFinite(st.S)) st.S = 1.5; if (!Array.isArray(st.tests)) st.tests = [];
  let step = -1, L = PALEO.L0 + 0.0001, playing = false, showObs = true;
  el.innerHTML = `<div class="pflow"><div class="pbox in"><p class="plab">Paramètres d'entrée (−21 000 ans)</p><ul class="ul"><li>Orbite de la Terre : étés moins ensoleillés aux hautes latitudes nord</li><li>CO₂ = 185 ppm · CH₄ = 350 ppb</li><li>Plus de poussières, moins de végétation</li></ul></div><div class="pbox calc"><p class="plab">Calculs par le modèle</p><div class="field"><label>Version du modèle · sensibilité climatique : <b data-sv></b> °C par doublement du CO₂<input type="range" min="1.5" max="6" step="0.5" data-s aria-label="Sensibilité climatique du modèle, de 1,5 à 6 °C"></label></div><div class="row"><button type="button" class="btn" data-run>▶ Lancer le calcul</button><button type="button" class="btn ghost" data-pause hidden>⏸ Pause</button></div></div><div class="pbox out"><p class="plab">Résultats en sortie</p><p data-out aria-live="polite">—</p></div></div>
    <div class="figbox" data-map></div><ul class="mleg"><li><span class="icesw" aria-hidden="true"></span><span>Glaces et calottes calculées par le modèle (en blanc)</span></li><li><svg width="34" height="14" aria-hidden="true"><path d="M2 7 H32" style="stroke:#d9480f;stroke-width:3.4;fill:none" stroke-dasharray="6 4"/></svg><span>Limite des calottes connue d'après les indices géologiques (tracé simplifié)</span></li></ul><div class="row"><button type="button" class="btn ghost" data-obs aria-pressed="true">Afficher les données géologiques</button></div>
    <div data-tab></div>`;
  const map = canvasHost($("[data-map]", el), 0.34, (g, W, H, cv) => {
    const G = MASK.glob, u = maskBits("glob", G.b), P = PAL(), lat0 = 90, lat1 = 15, rows = (lat0 - lat1) / G.r, cw = W / G.nx, ch = H / rows;
    for (let j = 0; j < rows; j++) for (let i = 0; i < G.nx; i++) { const land = bit(u, j * G.nx + i), lat = 90 - (j + 0.5) * G.r, lon = -180 + (i + 0.5) * G.r; let c = land ? P.land : P.sea; if (!land && lat > 72) c = P.ice; if (land && isGreen(lon, lat)) c = P.ice; g.fillStyle = c; g.fillRect(i * cw, j * ch, cw + .6, ch + .6); }
    palCells().cells.forEach(c => { if (c.lat >= c.off + L && c.lat < 80 && c.lat >= lat1) { g.fillStyle = P.ice; g.fillRect(c.i * cw, c.j * ch, cw + .6, ch + .6); } });
    if (showObs) { g.strokeStyle = P.obs; g.lineWidth = 3; g.setLineDash([7, 5]); g.beginPath(); let on = false; for (let lon = -170; lon <= 70; lon += 1) { const v = obsLim(lon), ok = (lon >= -170 && lon < -50) || (lon >= -10 && lon < 65); const x = (lon + 180) / 360 * W, y = (lat0 - v) / (lat0 - lat1) * H; if (ok) { if (!on) g.moveTo(x, y); else g.lineTo(x, y); on = true; } else on = false; } g.stroke(); g.setLineDash([]); }
    const fs = Math.max(13, W / 45); g.font = `700 ${fs}px sans-serif`; g.fillStyle = dark() ? "#fff" : "#123"; g.fillText(step < 0 ? "Aujourd'hui" : `Calcul : itération ${Math.min(step, 50)}/50`, 8, fs + 4);
    cv.setAttribute("aria-label", step < 0 ? "Carte de l'hémisphère Nord aujourd'hui" : `Calottes calculées : limite moyenne ${f0(L)}° Nord`);
  });
  const tab = () => { const t = st.tests; $("[data-tab]", el).innerHTML = t.length ? tbl(["Version (sensibilité)", "Température par rapport à aujourd'hui", "Limite moyenne des calottes", "Comparaison aux données"], t.map(r => [fmt(r.S) + " °C", (r.T > 0 ? "+" : "") + f1(r.T) + " °C", f0(r.L) + "° N", (palOk(r) ? "✓ " : "✗ ") + palVerdict(r)])) + `<p class="cap">${nb("Données géologiques : environ −6 °C (entre −7 et −5 °C) ; limite sud des calottes vers 45 à 50° N en moyenne (Amérique du Nord et Europe). ⚠ Valeurs simulées.")}</p>` : `<p class="lead">Les versions que tu testes s'afficheront ici.</p>`; };
  const out = (h, fin) => { const r = h; $("[data-out]", el).innerHTML = `Température : <b>${(r.T > 0 ? "+" : "") + f1(r.T)} °C</b> par rapport à aujourd'hui<br>Limite moyenne des calottes : <b>${f0(r.L)}° N</b>${fin ? `<br><span class="chip ${palOk(r) ? "ok" : "bad"}">${palOk(r) ? "✓ compatible avec les données géologiques" : "✗ " + palVerdict(r) + " : si différences, modification du modèle"}</span>` : ""}`; };
  const paint = () => { $("[data-sv]", el).textContent = fmt(st.S); $("[data-s]", el).value = st.S; tab(); };
  function run() {
    const h = paleo(st.S); step = 0; playing = true; $("[data-pause]", el).hidden = false; $("[data-run]", el).disabled = true; let lt = 0;
    const fr = ts => { if (!document.body.contains(el)) return; if (!playing) { lt = 0; return requestAnimationFrame(fr); } if (!lt || ts - lt > 90) { lt = ts; step++; const r = h[Math.min(step, 50)]; L = r.L; out(r, false); map.draw(); } if (step < 50) requestAnimationFrame(fr); else { const r = h[50]; out(r, true); $("[data-pause]", el).hidden = true; $("[data-run]", el).disabled = false; const t = st.tests.filter(x => x.S !== st.S); t.push({ S: st.S, T: r.T, L: r.L }); t.sort((a, b) => a.S - b.S); st.tests = t; keep(); tab(); } };
    requestAnimationFrame(fr);
  }
  $("[data-s]", el).addEventListener("input", e => { st.S = +e.target.value; keep(); paint(); });
  $("[data-run]", el).onclick = run;
  $("[data-pause]", el).onclick = () => { playing = !playing; $("[data-pause]", el).textContent = playing ? "⏸ Pause" : "▶ Reprendre"; };
  $("[data-obs]", el).onclick = () => { showObs = !showObs; $("[data-obs]", el).setAttribute("aria-pressed", String(showObs)); map.draw(); };
  paint();
};
const palTests = () => (xo("pal").tests || []);

/* =========================================================================================
   6 · Les apports : attribution du réchauffement (1850-2025) et projections (2100) · ensemble de 12 modèles
   ========================================================================================= */
const YR = []; for (let y = 1850; y <= 2100; y++) YR.push(y);
const lin = pts => YR.map(y => { if (y <= pts[0][0]) return pts[0][1]; for (let i = 1; i < pts.length; i++) if (y <= pts[i][0]) { const [a, va] = pts[i - 1], [b, vb] = pts[i]; return va + (vb - va) * (y - a) / (b - a); } return pts[pts.length - 1][1]; });
const FORC = (() => {
  const co2 = lin([[1850, 285], [1900, 296], [1950, 311], [1960, 317], [1970, 326], [1980, 339], [1990, 354], [2000, 370], [2010, 390], [2020, 413], [2025, 426]]);
  const ghg = co2.map(c => 1.72 * 5.35 * Math.log(c / 285));
  const aer = lin([[1850, -0.1], [1900, -0.2], [1950, -0.45], [1970, -0.85], [1980, -1.05], [1990, -1.1], [2005, -1.15], [2015, -1.05], [2025, -0.9]]);
  const sol = YR.map(y => 0.1 * Math.sin(2 * Math.PI * (y - 1850) / 11) + (y < 1900 ? 0 : y < 1950 ? 0.12 * (y - 1900) / 50 : 0.12));
  const vol = YR.map(() => -0.15); [[1883, -3], [1886, -0.6], [1902, -1.6], [1912, -1], [1963, -2.2], [1974, -0.6], [1982, -2.4], [1991, -3.3]].forEach(([y, f]) => [0.7, 0.6, 0.25, 0.08].forEach((c, k) => { const i = y - 1850 + k; if (i < YR.length) vol[i] += f * c; }));
  return { ghg, aer, sol, vol };
})();
const SSP = { "1-2.6": { lab: "SSP1-2.6 · forte baisse des émissions", ghg: [[2040, 4.0], [2100, 3.0]], aer: [[2050, -0.45], [2100, -0.3]], color: "c4", ar6: [1.8, 1.3, 2.4] },
  "2-4.5": { lab: "SSP2-4.5 · émissions stables puis en lente baisse", ghg: [[2060, 4.65], [2100, 5.15]], aer: [[2050, -0.7], [2100, -0.45]], color: "c5", ar6: [2.7, 2.1, 3.5] },
  "5-8.5": { lab: "SSP5-8.5 · émissions très fortes", ghg: [[2060, 6.0], [2100, 9.2]], aer: [[2050, -0.8], [2100, -0.6]], color: "c2", ar6: [4.4, 3.3, 5.7] } };
const NMOD = 12, MODS12 = Array.from({ length: NMOD }, (_, i) => { const t = i / (NMOD - 1); return { lam: 0.8 + 0.9 * t, aer: 1.3 - 0.5 * t, seed: 101 + i * 37 }; });
function emu(sw, ssp) {
  const ghg = FORC.ghg.slice(), aer = FORC.aer.slice(), i25 = 2025 - 1850;
  if (ssp) { const P = SSP[ssp], g = lin([[2025, FORC.ghg[i25]]].concat(P.ghg)), a = lin([[2025, FORC.aer[i25]]].concat(P.aer)); for (let i = i25 + 1; i < YR.length; i++) { ghg[i] = g[i]; aer[i] = a[i]; } }
  const end = ssp ? 2100 : 2025, n = end - 1850 + 1;
  return MODS12.map(m => { const R = rng(m.seed); let T = 0, Td = 0, e = 0; const out = []; for (let i = 0; i < n; i++) { const F = (sw.sol ? FORC.sol[i] : 0) + (sw.vol ? (YR[i] > 2025 ? -0.15 : FORC.vol[i]) : 0) + (sw.ghg ? ghg[i] : 0) + (sw.aer ? m.aer * aer[i] : 0); T += (F - m.lam * T - 0.7 * (T - Td)) / 8; Td += 0.7 * (T - Td) / 100; e = 0.55 * e + 0.09 * gauss(R); out.push(T + e); } const b = out.slice(0, 51).reduce((a, v) => a + v, 0) / 51; return out.map(v => v - b); });
}
const OBSDEC = [[1855, -0.03], [1865, -0.02], [1875, 0], [1885, -0.08], [1895, -0.12], [1905, -0.15], [1915, -0.12], [1925, -0.03], [1935, 0.06], [1945, 0.13], [1955, 0.05], [1965, 0.05], [1975, 0.12], [1985, 0.35], [1995, 0.55], [2005, 0.88], [2015, 1.09], [2022.5, 1.33]];
const decMean = (s, y) => { const a = y === 2022.5 ? 2020 : y - 5, b = y === 2022.5 ? 2025 : y + 4; let t = 0, n = 0; for (let k = a; k <= b; k++) { const i = k - 1850; if (i >= 0 && i < s.length) { t += s[i]; n++; } } return t / n; };
function ensStats(runs, end) { const n = end - 1850 + 1, mean = [], lo = [], hi = []; for (let i = 0; i < n; i++) { const v = runs.map(r => r[i]).sort((a, b) => a - b); mean.push(v.reduce((a, b) => a + b, 0) / v.length); lo.push(v[0]); hi.push(v[v.length - 1]); } return { mean, lo, hi }; }
const ENS = {}; const ens = (sw, ssp) => { const k = ["sol", "vol", "ghg", "aer"].map(x => sw[x] ? 1 : 0).join("") + (ssp || ""); return ENS[k] || (ENS[k] = (() => { const r = emu(sw, ssp); return { runs: r, st: ensStats(r, ssp ? 2100 : 2025) }; })()); };
const attErr = E => Math.sqrt(OBSDEC.reduce((s, [y, v]) => s + (decMean(E.st.mean, y) - v) ** 2, 0) / OBSDEC.length);
const FN = [["sol", "☀ Soleil"], ["vol", "🌋 Volcans"], ["ghg", "🏭 Gaz à effet de serre humains"], ["aer", "🌫 Aérosols humains (pollution)"]];
const swName = sw => { const k = FN.filter(f => sw[f[0]]).map(f => f[0]).join(","); return k === "sol,vol" ? "Sans émissions anthropiques" : k === "sol,vol,ghg,aer" ? "Avec émissions anthropiques" : FN.filter(f => sw[f[0]]).map(f => f[1].slice(2).split(" ")[0]).join(" + ") || "Aucun forçage"; };
WID.attrib = el => {
  const st = xo("att"); if (!st.sw || typeof st.sw !== "object") st.sw = { sol: true, vol: true, ghg: false, aer: false }; if (!st.runs || typeof st.runs !== "object") st.runs = {};
  let cut = 2025, sel = null;
  el.innerHTML = `<p class="lead">${nb("12 modèles différents simulent la température de 1850 à 2025. Choisis les facteurs pris en compte (les « forçages »), lance les modèles et compare aux observations.")}</p>
    <div class="row">${[["nat", "Sans émissions anthropiques"], ["all", "Avec émissions anthropiques"]].map(([k, t]) => `<button type="button" class="btn ghost" data-pre="${k}">${t}</button>`).join("")}</div>
    <div class="seg" role="group" aria-label="Forçages pris en compte">${FN.map(([k, t]) => `<button type="button" data-f="${k}">${t}</button>`).join("")}</div>
    <div class="row"><button type="button" class="btn" data-run>▶ Lancer les 12 modèles</button></div>
    <p class="qlong" data-cfg></p><div class="figbox chartbox" data-fig></div>${legend([{ color: "c1", lab: "Moyenne des 12 modèles (trait épais)", w: 4 }, { color: "c1", lab: "Ensemble des 12 modèles (bande)", w: 10, op: 0.25 }, { color: "ink", lab: "Observations (moyennes par décennie)", dot: true, w: 0.01 }])}
    <p class="readout" data-ro aria-live="polite">${nb("Touche le graphique pour lire une année.")}</p><div class="score" data-sc></div><div data-tab></div>`;
  const o = { x0: 1850, x1: 2025, y0: -0.6, y1: 1.6, yStep: 0.4, xFmt: v => String(v), xTitle: "Année", yTitle: "Écart à 1850-1900 (°C)", alt: "Température simulée et observée de 1850 à 2025" };
  const cfg = () => ens(st.sw);
  const fig = liveSVG($("[data-fig]", el), (W, F) => { const E = cfg(), P = (a) => a.map((v, i) => [1850 + i, v]); o.cut = cut; o.sel = sel; o.bands = [{ lo: P(E.st.lo), hi: P(E.st.hi), color: "c1", op: 0.22 }]; o.series = [{ pts: P(E.st.mean), color: "c1", w: 3.8, dot: true }]; o.marks = OBSDEC.map(([y, v]) => ({ x: y, y: v, color: "ink", r: 0.27, w: y === 2022.5 ? 2.5 : 4.5 })); return lchart(W, F, o); });
  $("[data-fig]", el).addEventListener("pointerdown", ev => { const x = xAt(o, $("[data-fig]", el), ev); if (x === null) return; sel = Math.round(x); const E = cfg(), i = sel - 1850, od = OBSDEC.reduce((b, p) => Math.abs(p[0] - sel) < Math.abs(b[0] - sel) ? p : b); $("[data-ro]", el).innerHTML = `En <b>${sel}</b> : moyenne des modèles <b>${f2(E.st.mean[i])} °C</b> (de ${f2(E.st.lo[i])} à ${f2(E.st.hi[i])}) · observations, décennie la plus proche : <b>${f2(od[1])} °C</b>`; fig.draw(); });
  const paint = () => {
    press(el, "[data-f]", b => !!st.sw[b.dataset.f]); const nm = swName(st.sw);
    $("[data-cfg]", el).innerHTML = `Configuration : <b>${nm}</b> · <span class="sim">⚠ Valeurs simulées</span>`;
    const E = cfg(), e = attErr(E), m = decMean(E.st.mean, 2015);
    $("[data-sc]", el).innerHTML = `<p class="big ${e < 0.15 ? "ok" : "bad"}">Écart moyen modèles / observations : <b>${f2(e)} °C</b> · 2011-2020 : modèles <b>${f2(m)} °C</b>, observations <b>${f2(1.09)} °C</b></p>`;
    const R = Object.values(st.runs);
    $("[data-tab]", el).innerHTML = R.length ? tbl(["Simulation lancée", "Écart moyen", "Modèles 2011-2020", "Observé 2011-2020"], R.map(r => [r.n, f2(r.e) + " °C", f2(r.m) + " °C", "1,09 °C"])) : "";
  };
  const launch = () => { const E = cfg(), k = FN.map(f => st.sw[f[0]] ? 1 : 0).join(""); st.runs[k] = { n: swName(st.sw), e: attErr(E), m: decMean(E.st.mean, 2015) }; keep(); paint(); sel = null; cut = 1850; let lt = 0; const fr = ts => { if (!document.body.contains(el)) return; const dt = lt ? Math.min(100, ts - lt) : 0; lt = ts; cut = Math.min(2025, cut + 175 * dt / 4500); fig.draw(); if (cut < 2025) requestAnimationFrame(fr); }; requestAnimationFrame(fr); };
  $$("[data-f]", el).forEach(b => b.onclick = () => { st.sw[b.dataset.f] = !st.sw[b.dataset.f]; keep(); paint(); fig.draw(); $(`[data-f="${b.dataset.f}"]`, el).focus(); });
  $$("[data-pre]", el).forEach(b => b.onclick = () => { const all = b.dataset.pre === "all"; st.sw = { sol: true, vol: true, ghg: all, aer: all }; keep(); paint(); launch(); });
  $("[data-run]", el).onclick = launch;
  paint();
};
const attRan = k => !!(xo("att").runs || {})[k];
const ATT = { nat: () => ens({ sol: 1, vol: 1, ghg: 0, aer: 0 }), all: () => ens({ sol: 1, vol: 1, ghg: 1, aer: 1 }) };

WID.proj = el => {
  const st = xo("proj"); if (!st.seen || typeof st.seen !== "object") st.seen = {};
  const keys = Object.keys(SSP); let sel = null;
  el.innerHTML = `<p class="lead">${nb("Les mêmes 12 modèles, prolongés jusqu'en 2100 avec trois scénarios d'émissions du GIEC. Le nombre après le tiret est le forçage radiatif atteint en 2100 (en W/m²). Touche un scénario pour l'afficher ou le masquer.")}</p>
    <div class="seg" role="group" aria-label="Scénarios">${keys.map(k => `<button type="button" data-k="${k}">${SSP[k].lab}</button>`).join("")}</div>
    <div class="figbox chartbox" data-fig></div><div data-leg></div><p class="readout" data-ro aria-live="polite">${nb("Touche le graphique pour lire une année.")}</p><div data-tab></div>`;
  const all = { sol: 1, vol: 1, ghg: 1, aer: 1 };
  const o = { x0: 1950, x1: 2100, y0: -0.5, y1: 6, yStep: 1, xFmt: v => String(v), xTitle: "Année", yTitle: "Écart à 1850-1900 (°C)", alt: "Projections de température jusqu'en 2100", hlines: [{ y: 1.5, lab: "1,5 °C" }, { y: 2, lab: "2 °C" }], vbands: [{ a: 2081, b: 2100, lab: "2081-2100" }] };
  const fig = liveSVG($("[data-fig]", el), (W, F) => { const on = keys.filter(k => st.seen[k]), P = a => a.map((v, i) => [1850 + i, v]).filter(p => p[0] >= 1950); o.sel = sel; o.bands = on.map(k => { const E = ens(all, k); return { lo: P(E.st.lo), hi: P(E.st.hi), color: SSP[k].color, op: 0.2 }; }); o.series = on.map(k => ({ pts: P(ens(all, k).st.mean), color: SSP[k].color, w: 3.4 })); o.marks = OBSDEC.filter(p => p[0] >= 1950).map(([y, v]) => ({ x: y, y: v, color: "ink", r: 0.25 })); return lchart(W, F, o); });
  const m8 = k => { const E = ens(all, k), r = E.runs.map(s => s.slice(2081 - 1850, 2101 - 1850).reduce((a, b) => a + b, 0) / 20).sort((a, b) => a - b); return { m: r.reduce((a, b) => a + b, 0) / r.length, lo: r[0], hi: r[r.length - 1] }; };
  $("[data-fig]", el).addEventListener("pointerdown", ev => { const x = xAt(o, $("[data-fig]", el), ev); if (x === null) return; sel = Math.round(x); const on = keys.filter(k => st.seen[k]); $("[data-ro]", el).innerHTML = `En <b>${sel}</b> : ` + (on.length ? on.map(k => `${k} → <b>${f1(ens(all, k).st.mean[sel - 1850])} °C</b>`).join(" · ") : "affiche un scénario."); fig.draw(); });
  const paint = () => {
    press(el, "[data-k]", b => !!st.seen[b.dataset.k]); const on = keys.filter(k => st.seen[k]);
    $("[data-leg]", el).innerHTML = legend(on.map(k => ({ color: SSP[k].color, lab: SSP[k].lab + " · trait : moyenne, bande : 12 modèles" })).concat([{ color: "ink", lab: "Observations (moyennes par décennie)", dot: true, w: 0.01 }]));
    $("[data-tab]", el).innerHTML = on.length ? tbl(["Scénario", "Mes 12 modèles · 2081-2100", "GIEC 2021 · 2081-2100"], on.map(k => { const r = m8(k), a = SSP[k].ar6; return [k, `${f1(r.m)} °C (${f1(r.lo)} à ${f1(r.hi)})`, `${f1(a[0])} °C (${f1(a[1])} à ${f1(a[2])})`]; })) + `<p class="cap">${nb("Écarts à la moyenne 1850-1900. ⚠ Valeurs simulées par un modèle simplifié ; colonne GIEC : meilleure estimation et fourchette très probable (rapport AR6, 2021).")}</p>` : "";
    fig.draw();
  };
  $$("[data-k]", el).forEach(b => b.onclick = () => { st.seen[b.dataset.k] = !st.seen[b.dataset.k]; keep(); paint(); $(`[data-k="${b.dataset.k}"]`, el).focus(); });
  paint();
};
const projSeen = () => Object.values(xo("proj").seen || {}).filter(Boolean).length;

/* ---------- mon paragraphe synthétique (reconstruit à partir des réponses des parties 1 à 3) ---------- */
WID.monpara = el => { const P = paraParts(); el.innerHTML = P.some(Boolean) ? `<ol class="paral">${P.map((t, i) => `<li><span class="kicker">Partie ${i + 1}</span><p>${t ? esc(t) : `<span class="muted">pas encore rédigée (dernière étape de la partie ${i + 1})</span>`}</p></li>`).join("")}</ol>` : `<p class="locked">Tes phrases des parties 1, 2 et 3 apparaîtront ici.</p>`; };
