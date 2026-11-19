/* ===== 5e EIST · Révision de la Mission 5 · Le décollage de la fusée : simulations et animations ===== */
Store.key = "eist5-revision-mission5-v1";
const WID = {}, LIVE = {};
const f1 = v => (+v).toFixed(1);
const xst = () => { if (!S.x || typeof S.x !== "object") S.x = {}; return S.x; };
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const press = (el, key, cur) => $$(`[data-${key}]`, el).forEach(b => b.setAttribute("aria-pressed", b.dataset[key] === String(cur) ? "true" : "false"));
const segBtns = (name, key, opts, cur) => `<div><span class="lab3">${name}</span><div class="seg" role="group" aria-label="${esc(name)}">${opts.map(([k, l]) => `<button type="button" data-${key}="${k}" aria-pressed="${String(k) === String(cur)}">${l}</button>`).join("")}</div></div>`;
const rng = s => { let x = s; return () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; }; };
const D2R = Math.PI / 180;
/* texte SVG : comme sT (kit.js), mais un style passé en option complète le style de base au lieu d'être ignoré */
const sX = (x, y, txt, a, size, extra) => { extra = extra || ""; const m = extra.match(/style="([^"]*)"/); return `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${size.toFixed(1)}px;${m ? m[1] : ""}" ${extra.replace(/style="[^"]*"/, "")}>${esc(txt)}</text>`; };
const posAt = (a, u) => { const n = a.length - 1, x = Math.max(0, Math.min(n, u * n)), i = Math.min(n - 1, Math.floor(x)); return a[i] + (a[i + 1] - a[i]) * (x - i); };

/* ---------- 1 · la centrifugeuse : vision et circulation selon l'accélération ---------- */
const GSANG = { 1: 1, 2: 0.9, 3: 0.72, 4: 0.6, 5: 0.32, 6: 0.04 };
WID.centri = el => {
  let g = +(xst().g || 1);
  el.innerHTML = `<p class="lead">${nb("Tu es dans la centrifugeuse. Augmente l'accélération et observe ta vision et le sang qui monte jusqu'au cerveau.")}</p>
    <div class="field"><label>Accélération<input type="range" min="1" max="6" step="1" value="${g}" data-g aria-label="Accélération en g, de 1 à 6"></label></div>
    <div class="row">${[1, 2, 3, 4, 5, 6].map(v => `<button type="button" class="btn ghost gbtn" data-gv="${v}">${v}${NB}g</button>`).join("")}</div>
    <div class="figbox" style="max-width:40rem;margin:0 auto"></div><p class="readout" aria-live="polite"></p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), H = Math.min(Math.max(W * 0.55, F * 12), F * 16), q = GSANG[g], cx = W * 0.27, R = Math.min(W * 0.2, H * 0.36), hx = W * 0.72, hy = H * 0.46;
    // silhouette : tête, cœur, vaisseau vers le cerveau rempli selon q
    const top = H * 0.12, heart = H * 0.72, vx = cx;
    let s = `<ellipse cx="${f1(cx)}" cy="${f1(top + F * 1.6)}" rx="${f1(F * 2.2)}" ry="${f1(F * 1.7)}" style="fill:#f2b8c6;stroke:var(--ink);stroke-width:1.6"/>` + sX(cx, top + F * 1.85, "cerveau", "middle", tk * 0.9, 'font-weight="700" style="fill:#5a1730"');
    s += `<rect x="${f1(vx - F * 0.45)}" y="${f1(top + F * 3.2)}" width="${f1(F * 0.9)}" height="${f1(heart - top - F * 3.6)}" rx="${f1(F * 0.45)}" style="fill:var(--surface-2);stroke:var(--ink);stroke-width:1.4"/>`;
    const fullH = heart - top - F * 3.6, hh = fullH * q;
    s += `<rect x="${f1(vx - F * 0.3)}" y="${f1(heart - F * 0.4 - hh)}" width="${f1(F * 0.6)}" height="${f1(Math.max(0, hh))}" rx="${f1(F * 0.3)}" style="fill:#c62828"/>`;
    s += `<text x="${f1(cx)}" y="${f1(heart + F * 0.9)}" text-anchor="middle" style="font-size:${f1(F * 2.2)}px">🫀</text>` + sX(cx, heart + F * 2.2, "cœur", "middle", tk * 0.9);
    s += sX(cx + F * 0.9, top + F * 3.2 + fullH / 2, "sang", "start", tk * 0.85, 'style="fill:var(--muted)"');
    // hublot : ce que voit l'astronaute
    const veil = g <= 2 ? 0 : g <= 4 ? 0.45 : g === 5 ? 0.82 : 1, dark = g >= 6;
    s += `<defs><clipPath id="hub"><circle cx="${f1(hx)}" cy="${f1(hy)}" r="${f1(R)}"/></clipPath><radialGradient id="vg"><stop offset="35%" stop-color="#777" stop-opacity="${dark ? 1 : veil * 0.7}"/><stop offset="100%" stop-color="${dark ? "#000" : "#555"}" stop-opacity="${dark ? 1 : Math.min(1, veil * 1.15)}"/></radialGradient></defs>`;
    s += `<g clip-path="url(#hub)"><rect x="${f1(hx - R)}" y="${f1(hy - R)}" width="${f1(2 * R)}" height="${f1(2 * R)}" fill="#8fc7ef"/><rect x="${f1(hx - R)}" y="${f1(hy + R * 0.25)}" width="${f1(2 * R)}" height="${f1(R)}" fill="#c98f5a"/>`;
    for (let i = 0; i < 6; i++) s += `<rect x="${f1(hx - R + i * R / 3 + R * 0.05)}" y="${f1(hy - R * 0.55)}" width="${f1(R * 0.16)}" height="${f1(R * 0.8)}" fill="#e6e9ee" stroke="#7d8790"/>`;
    s += `<circle cx="${f1(hx + R * 0.45)}" cy="${f1(hy - R * 0.6)}" r="${f1(R * 0.14)}" fill="#ffd54a"/><rect x="${f1(hx - R)}" y="${f1(hy - R)}" width="${f1(2 * R)}" height="${f1(2 * R)}" fill="url(#vg)"/></g>`;
    s += `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="${f1(R)}" style="fill:none;stroke:var(--ink);stroke-width:${f1(F * 0.35)}"/>` + sX(hx, hy + R + F * 1.3, "Ce que voit l'astronaute", "middle", tk);
    return `<svg viewBox="0 0 ${W} ${H + F * 0.6}" width="${W}" height="${f1(H + F * 0.6)}" role="img" aria-label="Accélération ${g} g. À gauche, le sang qui monte du cœur au cerveau. À droite, la vision de l'astronaute.">${s}</svg>`;
  });
  const upd = () => { $("[data-g]", el).value = g; press(el, "gv", g); $(".readout", el).innerHTML = nb(`Accélération : <b>${g} g</b> · ton corps semble <b>${g === 1 ? "aussi lourd que d'habitude" : g + " fois plus lourd"}</b>. ${g === 1 ? "C'est la situation au sol, sur Terre." : ""}`); fig.draw(); const X = xst(); X.gseen = X.gseen || {}; X.gseen[g] = 1; X.g = g; keep(); };
  $("[data-g]", el).oninput = e => { g = +e.target.value; upd(); };
  $$("[data-gv]", el).forEach(b => b.onclick = () => { g = +b.dataset.gv; upd(); });
  upd();
};

/* ---------- 2 · prélèvements de sang à l'entrée et à la sortie du cerveau ---------- */
const SANG = [["Dioxygène", "mL", 20, 12], ["Glucose", "mg", 90, 80], ["Dioxyde de carbone", "mL", 49, 57]];
WID.sang = el => {
  el.innerHTML = `<p class="lead">${nb("Touche les deux seringues pour analyser 100 mL de sang : celui qui entre dans le cerveau et celui qui en sort.")}</p>
    <div class="labsang"><button type="button" class="syr" data-sy="in">💉 Prélèvement 1<small>sang entrant</small></button><span class="brain" aria-hidden="true">🧠</span><button type="button" class="syr" data-sy="out">💉 Prélèvement 2<small>sang sortant</small></button></div>
    <div class="res"></div>`;
  const paint = () => {
    const X = xst(), sy = X.sy || {};
    $$("[data-sy]", el).forEach(b => b.setAttribute("aria-pressed", sy[b.dataset.sy] ? "true" : "false"));
    $(".res", el).innerHTML = (sy.in || sy.out) ? tbl(["Dans 100 mL de sang", "Sang entrant", "Sang sortant"], SANG.map(([n, u, a, b]) => [n, sy.in ? `${a}${NB}${u}` : "…", sy.out ? `${b}${NB}${u}` : "…"])) + `<p class="cap">${nb("Analyse du sang entrant et sortant du cerveau d'une personne en situation de stress (document de l'activité 1).")}</p>` : `<p class="locked">Aucun prélèvement pour l'instant.</p>`;
  };
  $$("[data-sy]", el).forEach(b => b.onclick = () => { const X = xst(); X.sy = X.sy || {}; X.sy[b.dataset.sy] = 1; keep(); paint(); });
  paint();
};

/* ---------- 3 · schéma des échanges sang-cerveau, dessiné à partir des réponses ---------- */
const SUB = [["Dioxygène", "c1"], ["Glucose", "c5"], ["Dioxyde de carbone", "c6"], ["Énergie", "c2"]];
LIVE.schema = (W, F, v) => {
  const tk = TK(F), r = v[0] || {}, H = F * 17.4, ox = W * 0.12, ow = W * 0.76, oy = F * 1.2, oh = F * 7.2, vy = oy + oh + F * 4.6, vh = F * 1.6, narrow = W < F * 22;
  let s = `<ellipse cx="${f1(W / 2)}" cy="${f1(oy + oh / 2)}" rx="${f1(ow / 2)}" ry="${f1(oh / 2)}" style="fill:#f7d4dd;stroke:#9c3b57;stroke-width:2.5"/>` + sX(W / 2, oy + F * 1.4, "CERVEAU", "middle", tk, 'font-weight="800" style="fill:#7a2140"');
  s += `<rect x="${f1(ox)}" y="${f1(vy)}" width="${f1(ow)}" height="${f1(vh)}" rx="6" style="fill:#fbe3e3;stroke:#c62828;stroke-width:2.5"/>` + sX(W / 2, vy + vh * 0.7, "vaisseau sanguin", "middle", tk * 0.9, 'style="fill:#a51d1d"');
  s += arrow(2, vy + vh / 2, ox - 4, vy + vh / 2, 4, "bad") + sX(2, vy + vh + F * 1.2, "sang entrant", "start", tk * 0.9, 'font-weight="700"');
  s += arrow(ox + ow + 4, vy + vh / 2, W - 2, vy + vh / 2, 4, "bad") + sX(W - 2, vy + vh + F * 1.2, "sang sortant", "end", tk * 0.9, 'font-weight="700"');
  const slots = [0.18, 0.39, 0.61, 0.82]; let inside = 0;
  SUB.forEach(([n, c], i) => {
    const a = r[i], x = ox + ow * slots[i], y1 = vy - 4, y0 = oy + oh * 0.82;
    const ly = y0 + (i + 1) * (y1 - y0) / 5 + tk * 0.3, lx = i < 2 ? x + 6 : x - 6, la = i < 2 ? "start" : "end";
    if (a === 0) s += arrow(x, y1, x, y0, 4, c) + sX(lx, ly, n, la, tk * 0.82, 'font-weight="800" paint-order="stroke" style="stroke:var(--surface);stroke-width:4px;fill:var(--ink)"');
    else if (a === 1) s += arrow(x, y0, x, y1, 4, c) + sX(lx, ly, n, la, tk * 0.82, 'font-weight="800" paint-order="stroke" style="stroke:var(--surface);stroke-width:4px;fill:var(--ink)"');
    else if (a === 2) { s += sX(W / 2, oy + F * 3.4 + inside * F * 1.3, "⚡ " + n + (narrow ? "" : " (produite et utilisée)"), "middle", tk * 0.85, 'font-weight="800" style="fill:#7a2140"'); inside++; }
  });
  const left = SUB.filter((x, i) => r[i] === undefined).map(x => x[0]);
  if (left.length) s += sX(W / 2, H - F * 0.3, "À placer : " + left.join(", "), "middle", tk * 0.8, 'style="fill:var(--muted)"');
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Schéma des échanges entre le sang et le cerveau, construit à partir de tes réponses">${s}</svg>`;
};

/* ---------- 4 · document 3 : réactivité du cœur après entraînement ---------- */
const REAC = [[0, 5.4], [2, 4.9], [4, 4.2], [6, 3.2], [8, 2.6], [10, 1.9]];
WID.reac = el => { el.innerHTML = `<p class="cap">${nb("La réactivité du cœur est le temps que met le cœur pour augmenter la fréquence de ses battements.")}</p><div class="chartbox"></div>`;
  mountChart($(".chartbox", el), { type: "line", series: [{ name: "Réactivité du cœur", pts: REAC, color: "c3", w: 3 }], markers: true, xMin: 0, xMax: 10, xStep: 2, yMin: 0, yMax: 6, yStep: 1, xTitle: "Nombre de séances de centrifugeuse", yTitle: "Réactivité du cœur (s)", xRead: v => fmt(v) + " séance" + (v > 1 ? "s" : ""), yRead: v => fmt(v, 1) + NB + "s", h: 14, alt: "Réactivité du cœur en fonction du nombre de séances de centrifugeuse" }); };

/* ---------- 5 · le référentiel : la fusée vue depuis le sol ou depuis le siège ---------- */
WID.refer = el => {
  let view = xst().view || "sol", u = 0;
  el.innerHTML = `<div class="row">${segBtns("Je regarde depuis…", "vw", [["sol", "🧍 le sol, près de la tour"], ["fus", "💺 mon siège, dans la fusée"]], view)}</div><div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox" style="max-width:30rem;margin:0 auto"></div>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), H = Math.min(F * 18, Math.max(W * 1.05, F * 13)), alt = u * u * H * 1.6, rw = F * 2.2, rh = F * 7;
    const groundY = H - F * 1.2, rx = W * 0.5 - rw / 2;
    // dans le référentiel de la fusée : la fusée reste au milieu, le décor descend
    const y0 = H * 0.36, rocketY = view === "fus" ? y0 : groundY - rh - alt, decor = view === "fus" ? alt - (groundY - rh - y0) : 0;
    let s = `<rect x="0" y="0" width="${W}" height="${H}" style="fill:#cfe8fb"/>`;
    const R = rng(3); for (let i = 0; i < 5; i++) { const cx = R() * W, cy = (R() * H * 0.7 + decor) % (H * 1.1) - F; s += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(F * 2.4)}" ry="${f1(F * 0.9)}" fill="#fff" opacity=".9"/>`; }
    s += `<g transform="translate(0 ${f1(decor)})"><rect x="0" y="${f1(groundY)}" width="${W}" height="${f1(H * 1.2)}" fill="#7a9a52"/><rect x="${f1(rx - F * 2.6)}" y="${f1(groundY - rh * 1.15)}" width="${f1(F * 0.8)}" height="${f1(rh * 1.15)}" fill="#8a8f96" stroke="var(--ink)"/>${[0.2, 0.45, 0.7].map(k => `<line x1="${f1(rx - F * 1.8)}" x2="${f1(rx - F * 0.2)}" y1="${f1(groundY - rh * k)}" y2="${f1(groundY - rh * k)}" stroke="#8a8f96" stroke-width="3"/>`).join("")}<text x="${f1(W * 0.85)}" y="${f1(groundY - F * 0.2)}" text-anchor="middle" style="font-size:${f1(F * 2)}px">🧍</text></g>`;
    const ry = rocketY;
    s += `<g><path d="M${f1(rx)},${f1(ry + rh * 0.25)} Q${f1(rx + rw / 2)},${f1(ry - rh * 0.12)} ${f1(rx + rw)},${f1(ry + rh * 0.25)} L${f1(rx + rw)},${f1(ry + rh)} L${f1(rx)},${f1(ry + rh)} Z" style="fill:#f4f6f8;stroke:var(--ink);stroke-width:1.6"/><path d="M${f1(rx)},${f1(ry + rh * 0.75)} L${f1(rx - F * 0.8)},${f1(ry + rh)} L${f1(rx)},${f1(ry + rh)} Z M${f1(rx + rw)},${f1(ry + rh * 0.75)} L${f1(rx + rw + F * 0.8)},${f1(ry + rh)} L${f1(rx + rw)},${f1(ry + rh)} Z" style="fill:#c62828;stroke:var(--ink)"/><circle cx="${f1(rx + rw / 2)}" cy="${f1(ry + rh * 0.42)}" r="${f1(rw * 0.32)}" style="fill:#bfe3ff;stroke:var(--ink);stroke-width:1.5"/><text x="${f1(rx + rw / 2)}" y="${f1(ry + rh * 0.42 + rw * 0.22)}" text-anchor="middle" style="font-size:${f1(rw * 0.55)}px">👨‍🚀</text>${u > 0 ? `<path d="M${f1(rx + rw * 0.2)},${f1(ry + rh)} L${f1(rx + rw / 2)},${f1(ry + rh + F * (2 + Math.sin(u * 60)))} L${f1(rx + rw * 0.8)},${f1(ry + rh)} Z" fill="#ff9800"/>` : ""}</g>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="overflow:hidden" role="img" aria-label="Décollage d'une fusée vu ${view === "sol" ? "depuis le sol" : "depuis le siège de l'astronaute"}">${s}</svg>`;
  });
  const read = () => { const d = Math.round(u * u * 1600); $(".readout", el).innerHTML = nb(`Temps : <b>${fmt(u * 10, 1)} s</b> · distance entre l'astronaute et le sol : <b>${fmt(d)} m</b> · distance entre l'astronaute et son siège : <b>0 m</b>.`); };
  const ctl = animCtl($(".animctl", el), 7000, p => { u = p; fig.draw(); read(); if (p >= 1) { const X = xst(); X.ref = X.ref || {}; X.ref[view] = 1; keep(); } });
  $$("[data-vw]", el).forEach(b => b.onclick = () => { view = b.dataset.vw; xst().view = view; keep(); press(el, "vw", view); fig.draw(); });
};

/* ---------- 6 · le radar du rover : mesurer une distance et une durée ---------- */
WID.radar = el => {
  el.innerHTML = `<p class="lead">${nb("Lance le rover. Lis la distance parcourue sur la piste graduée et la durée sur le chronomètre.")}</p><div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div>`;
  let u = 0; const D = 36, T = 12;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), L = F * 1.2, Rr = F * 1.4, pw = W - L - Rr, y = F * 3.4, H = F * 6.4, X = m => L + m / 42 * pw, x = D * Math.min(1, u);
    let s = `<rect x="0" y="${f1(y - F * 0.45)}" width="${W}" height="${f1(F * 0.9)}" rx="${f1(F * 0.45)}" style="fill:var(--trk)"/>`;
    for (let m = 0; m <= 42; m += 6) s += `<line x1="${f1(X(m))}" x2="${f1(X(m))}" y1="${f1(y + F * 0.5)}" y2="${f1(y + F * 1)}" style="stroke:var(--ink);stroke-width:2"/>` + sX(X(m), y + F * 2.1, m + " m", "middle", tk * 0.85);
    s += `<text x="${f1(X(x))}" y="${f1(y - F * 0.6)}" text-anchor="middle" style="font-size:${f1(F * 1.7)}px">🚙</text>`;
    if (u >= 1) s += `<line x1="${f1(X(D))}" x2="${f1(X(D))}" y1="${f1(y - F * 2.6)}" y2="${f1(y + F * 0.5)}" style="stroke:var(--bad);stroke-width:2.5" stroke-dasharray="5 4"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Piste graduée tous les 6 mètres. Le rover avance de gauche à droite.">${s}</svg>`;
  });
  animCtl($(".animctl", el), T * 1000, p => { u = p; fig.draw(); $(".readout", el).innerHTML = `⏱ Chronomètre : <b>${fmt(p * T, 1)}${NB}s</b>${p >= 1 ? " · <b>le rover s'arrête.</b> Repère où il s'est arrêté sur la piste." : ""}`; if (p >= 1) { xst().radar = 1; keep(); } });
};

/* ---------- 7 · trois mobiles, un point chaque seconde ---------- */
const TR = [["A", "🛸", [0, .36, .64, .84, .96, 1]], ["B", "🛰", [0, .2, .4, .6, .8, 1]], ["C", "🚙", [0, .04, .16, .36, .64, 1]]];
WID.traces = el => {
  el.innerHTML = `<p class="lead">${nb("Trois mobiles A, B et C partent en même temps. Chacun laisse un point toutes les secondes.")}</p><div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div>`;
  let u = 0;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), rowH = F * 3.3, H = rowH * 3 + F * 0.6, L = F * 0.9, R = F * 1.6, pw = W - L - R; let g = "";
    TR.forEach(([n, e, a], i) => { const y = F * 2.3 + i * rowH, X = f => L + f * pw, shown = a.filter((f, k) => k / (a.length - 1) <= u + 1e-6);
      g += sX(L - 4, y - F * 1.1, "Mobile " + n, "start", tk, 'font-weight="800"') + `<line x1="${f1(X(0))}" x2="${f1(X(1))}" y1="${f1(y)}" y2="${f1(y)}" style="stroke:var(--muted);stroke-width:2"/>`;
      shown.forEach(f => { g += `<circle cx="${f1(X(f))}" cy="${f1(y)}" r="${f1(F * 0.3)}" style="fill:var(--dot)"/>`; });
      g += `<text x="${f1(X(posAt(a, u)))}" y="${f1(y - F * 0.35)}" text-anchor="middle" style="font-size:${f1(F * 1.3)}px">${e}</text>`; });
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Trois lignes : les points laissés chaque seconde par les mobiles A, B et C">${g}</svg>`;
  });
  animCtl($(".animctl", el), 6000, p => { u = p; fig.draw(); $(".readout", el).innerHTML = `Temps : <b>${Math.floor(p * 5 + 1e-6)}${NB}s</b>${p >= 1 ? " · <b>arrivée.</b> Compare l'écart entre les points de chaque mobile." : ""}`; if (p >= 1) { xst().traces = 1; keep(); } });
};

/* ---------- 8 · la vitesse de la capsule au retour (valeurs simulées) ---------- */
const CAP = [[0, 0], [5, 15], [10, 30], [15, 45], [20, 60], [25, 60], [30, 60], [35, 60], [40, 60], [45, 47.5], [50, 35], [55, 22.5], [60, 10], [65, 10], [70, 10], [75, 10], [80, 10]];
WID.capsule = el => { el.innerHTML = `<p class="cap">${nb("La capsule descend vers l'océan. À 40 s, les parachutes s'ouvrent. À 80 s, elle touche l'eau.")}</p><div class="chartbox"></div>`;
  mountChart($(".chartbox", el), { type: "line", series: [{ name: "Vitesse de la capsule", pts: CAP, color: "c2", w: 3 }], markers: true, xMin: 0, xMax: 80, xStep: 10, yMin: 0, yMax: 70, yStep: 10, xTitle: "Temps (s)", yTitle: "Vitesse (m/s)", xRead: v => "t = " + v + NB + "s", yRead: v => fmt(v) + NB + "m/s", h: 15, alt: "Vitesse de la capsule en fonction du temps" }); };

/* ---------- 9 · la fusée et ses éléments ---------- */
WID.fuseeDessin = el => { el.innerHTML = `<div class="figbox" style="max-width:30rem;margin:0 auto"></div>`;
  liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F) * (W < F * 20 ? 0.8 : 0.9), H = F * 19, rw = Math.min(W * 0.15, F * 4), cx = Math.max(rw * 1.15, W * 0.2), top = F * 0.8, lab = cx + rw * 1.1 + F * 0.6;
    const yC = top + F * 3.2, yR = top + F * 9, yB = top + F * 13.5, yT = top + F * 15.6;
    let s = `<path d="M${f1(cx - rw / 2)},${f1(yC)} Q${f1(cx)},${f1(top - F * 0.6)} ${f1(cx + rw / 2)},${f1(yC)} Z" style="fill:#c62828;stroke:var(--ink);stroke-width:1.6"/>`;
    s += `<rect x="${f1(cx - rw / 2)}" y="${f1(yC)}" width="${f1(rw)}" height="${f1(yB - yC)}" style="fill:#eef1f4;stroke:var(--ink);stroke-width:1.6"/>`;
    s += `<rect x="${f1(cx - rw * 0.32)}" y="${f1(yC + F * 1.4)}" width="${f1(rw * 0.64)}" height="${f1(F * 6.4)}" rx="6" style="fill:#9cc7ea;stroke:var(--ink);stroke-width:1.2"/>`;
    s += `<rect x="${f1(cx - rw * 0.3)}" y="${f1(yB - F * 2.6)}" width="${f1(rw * 0.6)}" height="${f1(F * 2.2)}" rx="4" style="fill:#ffb74d;stroke:var(--ink);stroke-width:1.2"/>`;
    s += `<path d="M${f1(cx - rw * 0.25)},${f1(yB)} L${f1(cx - rw * 0.45)},${f1(yT)} L${f1(cx + rw * 0.45)},${f1(yT)} L${f1(cx + rw * 0.25)},${f1(yB)} Z" style="fill:#78838d;stroke:var(--ink);stroke-width:1.4"/>`;
    s += `<path d="M${f1(cx - rw / 2)},${f1(yB - F * 2.4)} L${f1(cx - rw * 1.05)},${f1(yB + F * 0.6)} L${f1(cx - rw / 2)},${f1(yB)} Z M${f1(cx + rw / 2)},${f1(yB - F * 2.4)} L${f1(cx + rw * 1.05)},${f1(yB + F * 0.6)} L${f1(cx + rw / 2)},${f1(yB)} Z" style="fill:#c62828;stroke:var(--ink);stroke-width:1.4"/>`;
    const L = [["Coiffe", top + F * 1.5, cx + rw * 0.15], ["Corps (structure)", yC + F * 0.7, cx + rw / 2], ["Réservoir", yR - F * 1.2, cx + rw * 0.3], ["Chambre de combustion", yB - F * 1.5, cx + rw * 0.28], ["Ailerons", yB - F * 0.2, cx + rw * 0.95], ["Tuyère", yT - F * 0.9, cx + rw * 0.35]];
    L.forEach(([n, y, x0], i) => { const ly = top + F * 1.6 + i * F * 2.9; s += `<line x1="${f1(x0)}" y1="${f1(y)}" x2="${f1(lab - 6)}" y2="${f1(ly - tk * 0.35)}" style="stroke:var(--muted);stroke-width:1.5"/>` + sX(lab, ly, n, "start", tk, 'font-weight="700"'); });
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Dessin d'une fusée légendé : coiffe, corps, réservoir, chambre de combustion, ailerons, tuyère">${s}</svg>`;
  }); };

/* ---------- 10 · la Lune autour de la Terre ---------- */
const LIT = "#f6e7a1", DARKM = "#2a2f36";
function moonDisk(cx, cy, R, eDeg) {
  const e = ((eDeg % 360) + 360) % 360, c = Math.cos(e * D2R), rx = Math.abs(c) * R, frac = (1 - c) / 2, top = `${f1(cx)},${f1(cy - R)}`, bot = `${f1(cx)},${f1(cy + R)}`;
  const d = e < 180 ? `M${top} A${f1(R)},${f1(R)} 0 0 1 ${bot} A${f1(rx)},${f1(R)} 0 0 ${c > 0 ? 0 : 1} ${top} Z` : `M${top} A${f1(R)},${f1(R)} 0 0 0 ${bot} A${f1(rx)},${f1(R)} 0 0 ${c > 0 ? 1 : 0} ${top} Z`;
  return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" fill="${DARKM}"/>${frac > 0.004 ? `<path d="${d}" fill="${LIT}"/>` : ""}<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" style="fill:none;stroke:#5b6470;stroke-width:1.2"/>`;
}
/* positions : 1 en haut, 2 côté Soleil, 3 en bas, 4 opposée au Soleil ; e = angle Soleil-Terre-Lune */
const LPOS = { 1: [0, -1, 270], 2: [-1, 0, 0], 3: [0, 1, 90], 4: [1, 0, 180] };
WID.lune = el => {
  let pos = +(xst().lpos || 0);
  el.innerHTML = `<p class="lead">${nb("Le Soleil est à gauche, très loin. Place la Lune sur son orbite, puis regarde ce que voit un observateur sur Terre (hémisphère Nord).")}</p>
    <div class="row">${[1, 2, 3, 4].map(n => `<button type="button" class="btn ghost" data-lp="${n}">Position ${n}</button>`).join("")}</div><div class="duo"><div><h4>Vu de l'espace, au-dessus du pôle Nord</h4><div class="figbox top"></div></div><div><h4>Ce que voit l'observateur sur Terre</h4><div class="figbox sky"></div></div></div><p class="cap">⚠ Schéma simplifié : les distances et les tailles ne sont pas à l'échelle.</p>`;
  const top = liveSVG($(".top", el), (W, F) => {
    const tk = TK(F), H = Math.min(W, F * 16), cx = W * 0.55, cy = H / 2, R = Math.min(W * 0.27, H * 0.34), re = F * 1.4, rm = F * 0.95;
    let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="#0d1726"/>`;
    for (let i = 0; i < 4; i++) { const y = H * (0.2 + i * 0.2); s += arrow(F * 0.5, y, F * 3.2, y, 2.5, "c5"); }
    s += sX(F * 0.4, F * 1.2, "☀ Soleil", "start", tk, 'font-weight="800" style="fill:#ffd54a"');
    s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(R)}" style="fill:none;stroke:#7e8ca3;stroke-width:1.5" stroke-dasharray="5 5"/>`;
    { const P = t => [cx + R * Math.cos(t * D2R), cy - R * Math.sin(t * D2R)], [ax, ay] = P(20), [bx, by] = P(68), t2 = 70 * D2R;
      s += `<path d="M${f1(ax)},${f1(ay)} A${f1(R)},${f1(R)} 0 0 0 ${f1(bx)},${f1(by)}" style="fill:none;stroke:#b8c4d6;stroke-width:2.5"/>` + arrow(bx, by, bx - Math.sin(t2) * F * 0.9, by - Math.cos(t2) * F * 0.9, 2.5, "muted"); }
    s += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(re)}" fill="#1f5fa8"/><path d="M${f1(cx)},${f1(cy - re)} A${f1(re)},${f1(re)} 0 0 0 ${f1(cx)},${f1(cy + re)} Z" fill="#5fb0ff"/>` + sX(cx, cy + re + tk * 1.1, "Terre", "middle", tk * 0.85, 'style="fill:#cfe0ff"');
    [1, 2, 3, 4].forEach(n => { const [dx, dy] = LPOS[n], x = cx + dx * R, y = cy + dy * R;
      if (n === pos) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rm)}" fill="${DARKM}" stroke="#c4c7cc"/><path d="M${f1(x)},${f1(y - rm)} A${f1(rm)},${f1(rm)} 0 0 0 ${f1(x)},${f1(y + rm)} Z" fill="${LIT}"/>`;
      else s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rm * 0.55)}" style="fill:none;stroke:#7e8ca3;stroke-width:1.5"/>`;
      s += sX(x + (dx ? dx * rm * 1.9 : rm * 1.6), y + (dy ? dy * rm * 1.9 : 0) + tk * 0.35, String(n), "middle", tk, 'font-weight="800" style="fill:#fff"'); });
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Vue de l'espace : Soleil à gauche, Terre au centre, ${pos ? "Lune en position " + pos : "quatre positions possibles de la Lune"}. La Lune tourne autour de la Terre dans le sens inverse des aiguilles d'une montre.">${s}</svg>`;
  });
  const sky = liveSVG($(".sky", el), (W, F) => {
    const tk = TK(F), H = Math.min(W, F * 16), R = Math.min(W, H) * 0.28, r = rng(5); let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="#0b1220"/>`;
    for (let i = 0; i < 40; i++) s += `<circle cx="${f1(r() * W)}" cy="${f1(r() * H * 0.8)}" r="${f1(0.6 + r() * 1.2)}" fill="#fff" opacity="${f1(0.4 + r() * 0.5)}"/>`;
    s += `<rect x="0" y="${f1(H * 0.84)}" width="${W}" height="${f1(H * 0.16)}" fill="#1b2a1a"/>`;
    s += pos ? moonDisk(W / 2, H * 0.42, R, LPOS[pos][2]) : sX(W / 2, H * 0.45, "Choisis une position", "middle", tk, 'style="fill:#cfd8e3"');
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${pos ? "Lune vue depuis la Terre pour la position " + pos : "Ciel nocturne, aucune position choisie"}">${s}</svg>`;
  });
  $$("[data-lp]", el).forEach(b => b.onclick = () => { pos = +b.dataset.lp; const X = xst(); X.lpos = pos; X.lseen = X.lseen || {}; X.lseen[pos] = 1; keep(); press(el, "lp", pos); top.draw(); sky.draw(); });
  press(el, "lp", pos);
};

/* ---------- pupitre de lancement : le code à cinq chiffres ---------- */
const CODE = ["7", "3", "9", "1", "5"];
const gDone = g => g.items.every(it => { const st = S.it[it.id]; return st && st.first && st.lastOk; });
WID.pupitre = el => {
  const found = () => GROUPS.slice(0, 5).filter(gDone).length;
  const paint = () => {
    const X = xst(), n = found();
    el.innerHTML = `<p>${nb(`Chaque partie de 1 à 5 terminée (toutes les réponses justes) te donne <b>un chiffre du code de lancement</b>, dans l'ordre des parties. Tu en as trouvé <b>${n}/5</b>.`)}</p>
      <div class="row"><input class="inp" inputmode="numeric" autocomplete="off" maxlength="5" aria-label="Code de lancement à 5 chiffres" placeholder="Code" value="${esc(X.code || "")}" style="max-width:9rem;letter-spacing:.3em;font-weight:800"><button type="button" class="btn" data-launch>🚀 Lancer le décollage</button></div>
      <p class="pfb" aria-live="polite"></p><div class="figbox launchz"></div>`;
    const inp = $("input", el), fb = $(".pfb", el);
    inp.oninput = () => { xst().code = inp.value; keep(); fb.textContent = ""; };
    $("[data-launch]", el).onclick = () => {
      if (inp.value.replace(/\D/g, "") !== CODE.join("")) { fb.className = "pfb bad"; fb.textContent = n < 5 ? `✗ Code incorrect. Il te manque encore ${5 - n} chiffre(s) : termine les parties.` : "✗ Code incorrect : relis les chiffres trouvés à la fin de chaque partie, dans l'ordre."; return; }
      fb.className = "pfb ok"; fb.textContent = "✓ Code accepté. Compte à rebours…"; xst().launched = 1; keep();
      let u = 0; const fig = liveSVG($(".launchz", el), (W, F) => { const H = F * 13, k = Math.max(0, u - 0.5) * 2, y = H - F * 5 - k * k * H; const c = u < 0.5 ? String(5 - Math.floor(u * 10)) : "Décollage !";
        return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="overflow:hidden" role="img" aria-label="Compte à rebours puis décollage de la fusée"><rect width="${W}" height="${H}" rx="12" fill="#0d1726"/><rect y="${f1(H - F * 1.4)}" width="${W}" height="${f1(F * 1.4)}" fill="#7a3b1e"/><text x="${f1(W / 2)}" y="${f1(y)}" text-anchor="middle" style="font-size:${f1(F * 4)}px">🚀</text>${k > 0 ? `<text x="${f1(W / 2)}" y="${f1(y + F * 2.2)}" text-anchor="middle" style="font-size:${f1(F * 2)}px">🔥</text>` : ""}` + sX(W / 2, F * 2.4, c, "middle", F * 2, 'font-weight="800" style="fill:#ffd54a"') + `</svg>`; });
      const t0 = performance.now(); const st = ts => { if (!document.body.contains(el)) return; u = Math.min(1, (ts - t0) / 6000); fig.draw(); if (u < 1) requestAnimationFrame(st); else fb.textContent = "🚀 Bravo : la fusée est partie pour Mars !"; }; requestAnimationFrame(st);
    };
  };
  paint();
};
const codeFoot = g => { const i = GROUPS.indexOf(g); if (i > 4) return ""; return gDone(g) ? `<div class="box key"><p class="lab">🔑 Code de lancement</p><p>${nb(`Partie ${g.n} terminée : le chiffre n°${g.n} du code est <b class="codeb">${CODE[i]}</b>. Note-le !`)}</p></div>` : `<p class="locked">🔑 Réussis toutes les étapes de cette partie pour obtenir le chiffre n°${g.n} du code de lancement.</p>`; };
const pupitreHTML = () => `<div class="panel"><p class="kicker">🎛 Pupitre de lancement</p><div data-w="pupitre"></div></div>`;
