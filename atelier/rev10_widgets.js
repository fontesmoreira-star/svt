/* ---------- outils communs ---------- */
const tw = (fn, dur, done) => { const t0 = performance.now(); const st = now => { const q = Math.min(1, (now - t0) / dur); fn(q); if (q < 1) requestAnimationFrame(st); else if (done) done(); }; requestAnimationFrame(st); };
const segBtns = (name, key, opts, cur) => `<div><span class="lab3">${name}</span><div class="seg" role="group" aria-label="${esc(name)}">${opts.map(([k, l]) => `<button type="button" data-${key}="${k}" aria-pressed="${k === cur}">${l}</button>`).join("")}</div></div>`;
const press = (el, key, cur) => $$(`[data-${key}]`, el).forEach(b => b.setAttribute("aria-pressed", b.dataset[key] === String(cur) ? "true" : "false"));

/* ---------- activités 1-2 : les jumeaux et l'environnement ---------- */
const SKIN = ["#f1cfb3", "#b47448"];
function person(x, y, s, o) {
  const skin = `rgb(${[0, 1, 2].map(i => Math.round(lerp(parseInt(SKIN[0].substr(1 + 2 * i, 2), 16), parseInt(SKIN[1].substr(1 + 2 * i, 2), 16), o.tan || 0))).join(",")})`, aw = lerp(s * 0.08, s * 0.16, o.mus || 0), st = "stroke:var(--ink);stroke-width:1.6";
  let g = "";
  [-1, 1].forEach(k => { g += `<line x1="${f1(x + k * s * 0.1)}" y1="${f1(y - s * 0.2)}" x2="${f1(x + k * s * 0.13)}" y2="${f1(y + s * 0.18)}" style="stroke:#2b3f63;stroke-width:${f1(s * 0.11)};stroke-linecap:round"/>`; });
  [-1, 1].forEach(k => { g += `<line x1="${f1(x + k * s * 0.24)}" y1="${f1(y - s * 0.62)}" x2="${f1(x + k * s * 0.33)}" y2="${f1(y - s * 0.25)}" style="stroke:${skin};stroke-width:${f1(aw)};stroke-linecap:round"/>`; });
  g += `<rect x="${f1(x - s * 0.24)}" y="${f1(y - s * 0.68)}" width="${f1(s * 0.48)}" height="${f1(s * 0.5)}" rx="${f1(s * 0.1)}" style="fill:var(--c1);${st}"/>`;
  g += `<circle cx="${f1(x)}" cy="${f1(y - s * 0.86)}" r="${f1(s * 0.2)}" style="fill:${skin};${st}"/><path d="M${f1(x - s * 0.2)},${f1(y - s * 0.88)} Q${f1(x)},${f1(y - s * 1.16)} ${f1(x + s * 0.2)},${f1(y - s * 0.88)} Q${f1(x)},${f1(y - s * 0.98)} ${f1(x - s * 0.2)},${f1(y - s * 0.88)}Z" style="fill:#4a2c17"/>`;
  [-1, 1].forEach(k => { g += `<circle cx="${f1(x + k * s * 0.075)}" cy="${f1(y - s * 0.86)}" r="${f1(s * 0.03)}" style="fill:#5b3a1e"/>`; });
  return g;
}
function drop(x, y, r, n) { let g = `<path d="M${f1(x)},${f1(y - r * 1.5)} Q${f1(x + r * 1.1)},${f1(y - r * 0.2)} ${f1(x)},${f1(y + r)} Q${f1(x - r * 1.1)},${f1(y - r * 0.2)} ${f1(x)},${f1(y - r * 1.5)}Z" style="fill:var(--surface);stroke:var(--bad);stroke-width:2"/>`; for (let i = 0; i < n; i++) { const a = i * 2.39996, d = r * 0.62 * Math.sqrt((i + 0.5) / n); g += `<circle cx="${f1(x + Math.cos(a) * d)}" cy="${f1(y - r * 0.15 + Math.sin(a) * d)}" r="${f1(Math.max(1.8, r * 0.1))}" style="fill:var(--bad)"/>`; } return g; }
WID.jumeaux = el => {
  const J = xst().jum || (xst().jum = { sun: 0, sport: 0, alt: 0, baby: 0 });
  let bq = J.baby ? 1 : 0;
  el.innerHTML = `<p class="lead">${nb("Deux vrais jumeaux ont les mêmes gènes. Le jumeau 1 reste en ville. Change les conditions de vie du jumeau 2, puis fais naître son bébé.")}</p>
    <div class="row" role="group" aria-label="Conditions de vie du jumeau 2">${[["sun", "☀ Vacances au soleil"], ["sport", "🏋 Musculation"], ["alt", "⛰ Vie en montagne"]].map(([k, l]) => `<button type="button" class="btn ghost tog" data-env="${k}" aria-pressed="${!!J[k]}">${l}</button>`).join("")}</div>
    <div class="row"><button type="button" class="btn" data-baby>👶 Le jumeau 2 a un bébé</button><button type="button" class="btn ghost" data-rz>↺ Recommencer</button></div>
    <div class="figbox"></div><div class="res"></div>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const s = Math.min(F * 6, W * 0.24), H = s * 1.55 + F * 1.6, tk = TK(F), xs = [W * 0.17, W * 0.5, W * 0.83], y = s * 1.25; let g = "";
    g += person(xs[0], y, s, {}) + person(xs[1], y, s, { tan: J.sun ? 1 : 0, mus: J.sport ? 1 : 0 });
    g += drop(xs[0] + s * 0.45, y - s * 0.95, s * 0.12, 10) + drop(xs[1] + s * 0.45, y - s * 0.95, s * 0.12, J.alt ? 13 : 10);
    g += sT(xs[0], y + s * 0.3, "Jumeau 1", "middle", tk, 'font-weight="800"') + sT(xs[1], y + s * 0.3, "Jumeau 2", "middle", tk, 'font-weight="800"');
    if (bq > 0) g += `<g style="opacity:${f1(bq)}">${person(xs[2], y, s * 0.62 * lerp(0.6, 1, bq), {})}${drop(xs[2] + s * 0.3, y - s * 0.62, s * 0.09, 10)}${sT(xs[2], y + s * 0.3, "Son bébé", "middle", tk, 'font-weight="800"')}</g>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Deux jumeaux et, si tu l'as fait naître, le bébé du jumeau 2. Le tableau sous le dessin décrit leurs caractères.">${g}</svg>`;
  });
  const table = () => { const b = J.baby, row = (n, v1, v2, v3) => [n, v1, v2, ...(b ? [v3] : [])];
    $(".res", el).innerHTML = `<p class="lead"><b>Comparer les caractères</b> <span class="sim">⚠ Valeurs simulées</span></p>` + tbl(["Caractère", "Jumeau 1", "Jumeau 2", ...(b ? ["Son bébé (à la naissance)"] : [])], [
      row("Couleur des yeux", "marron", "marron", "hérité de ses parents"), row("Groupe sanguin", "A", "A", "hérité de ses parents"),
      row("Couleur de la peau", "claire", J.sun ? "bronzée" : "claire", "claire"), row("Muscles des bras", "normaux", J.sport ? "très développés" : "normaux", "normaux"),
      row("Globules rouges par mm³ de sang", "≈ 5 millions", J.alt ? "≈ 6 millions" : "≈ 5 millions", "≈ 5 millions")]); };
  const paint = () => { $$("[data-env]", el).forEach(b => b.setAttribute("aria-pressed", J[b.dataset.env] ? "true" : "false")); fig.draw(); table(); };
  $$("[data-env]", el).forEach(b => b.onclick = () => { J[b.dataset.env] = J[b.dataset.env] ? 0 : 1; keep(); paint(); });
  $("[data-baby]", el).onclick = () => { if (J.baby) return; J.baby = 1; keep(); tw(q => { bq = q; fig.draw(); }, 1200, paint); table(); };
  $("[data-rz]", el).onclick = () => { Object.assign(J, { sun: 0, sport: 0, alt: 0, baby: 0 }); bq = 0; keep(); paint(); };
  paint();
};

/* ---------- activité 3 : le clonage, à toi de choisir les vaches ---------- */
const COAT = { nb: ["noire et blanche", "#fbfaf4", "noir et blanc"], ro: ["rousse", "#b9582c", "roux"], br: ["brune", "#6b4a2f", "brun"] };
function cow(x, y, s, coat, op) {
  const c = COAT[coat][1], st = "stroke:var(--ink);stroke-width:1.6"; let g = `<g style="opacity:${op === undefined ? 1 : op}">`;
  [-0.32, -0.16, 0.18, 0.32].forEach(dx => { g += `<rect x="${f1(x + dx * s - s * 0.04)}" y="${f1(y)}" width="${f1(s * 0.08)}" height="${f1(s * 0.3)}" rx="${f1(s * 0.03)}" style="fill:${c};${st}"/>`; });
  g += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(s * 0.45)}" ry="${f1(s * 0.22)}" style="fill:${c};${st}"/>`;
  if (coat === "nb") g += `<path d="M${f1(x - s * 0.2)},${f1(y - s * 0.18)} q${f1(s * 0.14)},${f1(-s * 0.02)} ${f1(s * 0.16)},${f1(s * 0.12)} q${f1(-s * 0.06)},${f1(s * 0.14)} ${f1(-s * 0.2)},${f1(s * 0.08)}Z" style="fill:#1b1b1b"/><circle cx="${f1(x + s * 0.18)}" cy="${f1(y + s * 0.04)}" r="${f1(s * 0.09)}" style="fill:#1b1b1b"/>`;
  g += `<ellipse cx="${f1(x + s * 0.5)}" cy="${f1(y - s * 0.12)}" rx="${f1(s * 0.15)}" ry="${f1(s * 0.11)}" style="fill:${coat === "nb" ? "#1b1b1b" : c};${st}"/><ellipse cx="${f1(x + s * 0.6)}" cy="${f1(y - s * 0.08)}" rx="${f1(s * 0.07)}" ry="${f1(s * 0.06)}" style="fill:#e9b7a6;${st}"/>`;
  g += `<path d="M${f1(x - s * 0.45)},${f1(y - s * 0.05)} q${f1(-s * 0.1)},${f1(s * 0.1)} ${f1(-s * 0.06)},${f1(s * 0.24)}" style="fill:none;${st}"/></g>`;
  return g;
}
const CLO = () => { const x = xst(); if (!x.clo || typeof x.clo !== "object") x.clo = { n: "nb", o: "ro", p: "br", tries: {} }; return x.clo; };
WID.clonage = el => {
  const C = CLO(); let p = 0;
  el.innerHTML = `<p class="lead">${nb("Choisis la vache qui donne le noyau, celle qui donne l'ovule (dont on retire le noyau) et la vache porteuse. Lance l'expérience et observe le veau.")}</p>
    <div class="opt3">${segBtns("Le noyau vient d'un embryon de vache…", "cn", [["nb", "noire et blanche"], ["ro", "rousse"]], C.n)}${segBtns("L'ovule vient d'une vache…", "co", [["ro", "rousse"], ["nb", "noire et blanche"]], C.o)}${segBtns("La vache porteuse est…", "cp", [["br", "brune"], ["ro", "rousse"], ["nb", "noire et blanche"]], C.p)}</div>
    <div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div><div class="res"></div>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F) * 0.92, s = Math.min(F * 3.6, W * 0.3), rh = s * 0.75 + tk * 2.2, H = rh * 3 + 6, xc = s * 0.62 + 4, xe = W * 0.62, xv = W * 0.86, ys = [rh * 0.42, rh * 1.42, rh * 2.42], cr = Math.min(F * 0.9, W * 0.07);
    const lab = (i, t) => sT(xc, ys[i] + s * 0.3 + tk * 1.25, t, "middle", tk, 'font-weight="700"');
    let g = cow(xc, ys[0], s, C.n) + lab(0, "donne le noyau") + cow(xc, ys[1], s, C.o) + lab(1, "donne l'ovule") + cow(xc, ys[2], s, C.p) + lab(2, "porteuse");
    const t1 = seg(p, 0.05, 0.3), t2 = seg(p, 0.3, 0.55), t3 = seg(p, 0.55, 0.78), t4 = seg(p, 0.78, 0.95);
    g += `<circle cx="${f1(xe)}" cy="${f1(ys[0])}" r="${f1(cr)}" style="fill:var(--cyto);stroke:var(--ink);stroke-width:1.5"/>` + sT(xe, ys[0] + cr + tk * 1.1, "cellule d'embryon", "middle", tk * 0.9);
    const oy = lerp(ys[1], ys[2], t3);
    if (t3 < 1) g += `<circle cx="${f1(lerp(xe, xc + s * 0.05, t3))}" cy="${f1(oy)}" r="${f1(cr * 1.25 * (1 - 0.6 * t3))}" style="fill:var(--nuc);stroke:var(--ink);stroke-width:1.5"/>` + (t3 <= 0 ? sT(xe, ys[1] + cr * 1.25 + tk * 1.1, t1 >= 1 ? "ovule sans noyau" : "ovule", "middle", tk * 0.9) : "");
    if (t1 < 1) g += `<circle cx="${f1(xe + t1 * cr * 2.2)}" cy="${f1(ys[1] + t1 * cr * 1.2)}" r="${f1(cr * 0.38)}" style="fill:var(--c4);opacity:${f1(1 - t1 * 0.9)}"/>`;
    const nx = t2 <= 0 ? xe : t3 <= 0 ? xe : lerp(xe, xc + s * 0.05, t3), ny = t2 <= 0 ? ys[0] : t3 <= 0 ? lerp(ys[0], ys[1], t2) : oy;
    if (t3 < 1) g += `<circle cx="${f1(nx)}" cy="${f1(ny)}" r="${f1(cr * 0.38)}" style="fill:var(--bad)"/>`;
    if (t4 > 0) g += cow(xv, ys[2] + s * 0.05, s * 0.6, C.n, t4) + sT(xv, ys[2] + s * 0.3 + tk * 1.25, "le veau", "middle", tk, `font-weight="800" style="opacity:${f1(t4)}"`);
    else g += `<circle cx="${f1(xv)}" cy="${f1(ys[2])}" r="${f1(s * 0.22)}" style="fill:var(--surface-2);stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 4"/>` + sT(xv, ys[2] + tk * 0.4, "?", "middle", tk * 1.6, 'font-weight="800"');
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Transfert de noyau : vache ${COAT[C.n][0]} donneuse du noyau, vache ${COAT[C.o][0]} donneuse de l'ovule, vache ${COAT[C.p][0]} porteuse. Le résultat est écrit sous le dessin.">${g}</svg>`;
  });
  const table = () => { const T = Object.entries(C.tries); $(".res", el).innerHTML = T.length ? `<p class="lead"><b>Mes essais</b> : ${T.length}</p>` + tbl(["Noyau", "Ovule", "Porteuse", "Veau obtenu"], T.map(([k, v]) => [...k.split("-").map(c => COAT[c][0]), "<b>" + COAT[v][2] + "</b>"])) : ""; };
  const ctl = animCtl($(".animctl", el), 7000, q => { p = q; fig.draw(); $(".readout", el).innerHTML = nb(q <= 0 ? "Choisis les trois vaches, puis touche « Lancer »." : q < 0.3 ? "1. On retire le noyau de l'ovule." : q < 0.55 ? "2. On greffe dans cet ovule le noyau d'une cellule de l'embryon." : q < 0.78 ? "3. On implante le nouvel « œuf » dans l'utérus de la vache porteuse." : q < 1 ? "4. Un veau naît…" : `Le veau est <b>${COAT[C.n][2]}</b>.`);
    if (q >= 1) { const k = [C.n, C.o, C.p].join("-"); if (!C.tries[k]) { C.tries[k] = C.n; keep(); table(); } } });
  const pick = (key, f) => $$(`[data-${key}]`, el).forEach(b => b.onclick = () => { C[f] = b.dataset[key]; press(el, key, C[f]); keep(); ctl.set(0); });
  pick("cn", "n"); pick("co", "o"); pick("cp", "p"); table();
};

/* ---------- activité 5 : TP virtuel, extraire l'ADN de la banane ---------- */
const TPA = [["eau", "💧 Ajouter 10 mL d'eau distillée"], ["liq", "🧴 Ajouter le liquide vaisselle"], ["sel", "🧂 Ajouter une pincée de sel"], ["broy", "🥣 Broyer 2 à 3 minutes"], ["trans", "🧪 Transvaser dans le tube (1/3)"], ["agit", "🔄 Agiter le tube"], ["eth", "❄ Verser l'éthanol froid le long de la paroi"], ["wait", "⏱ Attendre 2 à 3 minutes"], ["peche", "🥄 Pêcher les filaments"], ["vert", "🟢 Ajouter le vert de méthyle"]];
const TPN = { eau: "l'eau", liq: "le liquide vaisselle (il détruit les membranes des cellules)", sel: "le sel (il aide l'ADN à précipiter)" };
WID.tpadn = el => {
  const st = { eau: 0, liq: 0, sel: 0, broy: 0, trans: 0, agit: 0, eth: 0, shaken: 0, wait: 0, peche: 0, vert: 0 }; let an = null;
  const T = () => { const x = xst(); if (!x.tp || typeof x.tp !== "object") x.tp = { done: 0 }; return x.tp; };
  el.innerHTML = `<p class="lead">${nb("Réalise le protocole de l'activité 5 : touche les actions dans le bon ordre. Attention à l'erreur fréquente !")}</p><div class="pilot"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div>`;
  const say = m => { $(".readout", el).innerHTML = nb(m); };
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), H = F * 10.5, q = an ? Math.min(1, (performance.now() - an.t0) / an.dur) : 1, k = an ? an.k : "", mx = W * 0.2, my = F * 6.5, mw = Math.min(W * 0.17, F * 4), tx = W * 0.55, tW = F * 1.6, tH = F * 7, ty = F * 1.6, gx = W * 0.85, gy = F * 7.5; let g = "";
    /* mortier */
    const pr = x => k === x ? q : (st[x] ? 1 : 0), fillM = pr("broy");
    g += `<path d="M${f1(mx - mw)},${f1(my - mw * 0.55)} Q${f1(mx - mw)},${f1(my + mw * 0.6)} ${f1(mx)},${f1(my + mw * 0.6)} Q${f1(mx + mw)},${f1(my + mw * 0.6)} ${f1(mx + mw)},${f1(my - mw * 0.55)}Z" style="fill:var(--surface-2);stroke:var(--ink);stroke-width:2.5"/>`;
    if (!st.trans || k === "trans") { const a = k === "trans" ? 1 - q : 1; g += `<ellipse cx="${f1(mx)}" cy="${f1(my + mw * 0.2)}" rx="${f1(mw * 0.82)}" ry="${f1(mw * 0.3 * (st.eau ? 1 : 0.6))}" style="fill:${st.eau ? "#e8dcae" : "transparent"};opacity:${f1(a)}"/>`; if (fillM < 1) for (let i = 0; i < 5; i++) g += `<rect x="${f1(mx - mw * 0.55 + i * mw * 0.24)}" y="${f1(my + mw * (0.05 + (i % 2) * 0.12))}" width="${f1(mw * 0.2)}" height="${f1(mw * 0.14)}" rx="3" style="fill:#f2d75a;stroke:var(--ink);stroke-width:1;opacity:${f1((1 - fillM) * a)}"/>`; }
    if (k === "broy") g += `<line x1="${f1(mx + mw * 0.6 + Math.sin(q * 40) * mw * 0.15)}" y1="${f1(my - mw * 1.3)}" x2="${f1(mx + Math.sin(q * 40) * mw * 0.3)}" y2="${f1(my + mw * 0.2)}" style="stroke:var(--muted);stroke-width:${f1(mw * 0.16)};stroke-linecap:round"/>`;
    if (st.liq && !st.trans) g += sT(mx, my + mw * 0.6 + tk * 1.3, "+ liquide vaisselle" + (st.sel ? " + sel" : ""), "middle", tk * 0.8);
    g += sT(mx, F * 1, "Mortier", "middle", tk, 'font-weight="800"');
    /* tube */
    const jus = pr("trans"), eth = pr("eth"), bot = ty + tH;
    if (jus > 0) g += `<rect x="${f1(tx - tW / 2 + 2)}" y="${f1(bot - tH * 0.33 * jus)}" width="${f1(tW - 4)}" height="${f1(tH * 0.33 * jus)}" style="fill:${st.shaken ? "#d9d3bd" : "#e3d29a"}"/>`;
    if (eth > 0 && !st.shaken) g += `<rect x="${f1(tx - tW / 2 + 2)}" y="${f1(bot - tH * 0.33 - tH * 0.42 * eth)}" width="${f1(tW - 4)}" height="${f1(tH * 0.42 * eth)}" style="fill:#d7ecf7;opacity:.85"/>`;
    if (st.shaken) g += `<rect x="${f1(tx - tW / 2 + 2)}" y="${f1(bot - tH * 0.75)}" width="${f1(tW - 4)}" height="${f1(tH * 0.42)}" style="fill:#e5dfc8"/>` + sT(tx, bot + tk * 1.2, "mélange trouble", "middle", tk * 0.85, 'font-weight="700"');
    const fil = st.shaken ? 0 : k === "wait" ? q : k === "peche" ? 1 - q : (st.wait && !st.peche ? 1 : 0);
    if (fil > 0) for (let i = 0; i < 4; i++) { const x0 = tx - tW * 0.3 + i * tW * 0.2, yb = bot - tH * 0.33; g += `<path d="M${f1(x0)},${f1(yb)} q${f1(tW * 0.12)},${f1(-tH * 0.12 * fil)} 0,${f1(-tH * 0.25 * fil)}" style="fill:none;stroke:#fff;stroke-width:3;opacity:${f1(fil)};stroke-linecap:round"/><path d="M${f1(x0)},${f1(yb)} q${f1(tW * 0.12)},${f1(-tH * 0.12 * fil)} 0,${f1(-tH * 0.25 * fil)}" style="fill:none;stroke:var(--muted);stroke-width:1;opacity:${f1(fil)}"/>`; }
    g += `<path d="M${f1(tx - tW / 2)},${f1(ty)} L${f1(tx - tW / 2)},${f1(bot - tW / 2)} Q${f1(tx - tW / 2)},${f1(bot)} ${f1(tx)},${f1(bot)} Q${f1(tx + tW / 2)},${f1(bot)} ${f1(tx + tW / 2)},${f1(bot - tW / 2)} L${f1(tx + tW / 2)},${f1(ty)}" style="fill:none;stroke:var(--ink);stroke-width:2.2"/>` + sT(tx, F * 1, "Tube", "middle", tk, 'font-weight="800"');
    if (st.wait && !st.peche && !st.shaken && !an) g += sT(tx + tW * 0.7, bot - tH * 0.36, "← filaments blancs", "start", tk * 0.85, 'font-weight="700"');
    /* verre de montre */
    g += `<path d="M${f1(gx - F * 1.8)},${f1(gy)} Q${f1(gx)},${f1(gy + F * 1.1)} ${f1(gx + F * 1.8)},${f1(gy)}" style="fill:none;stroke:var(--ink);stroke-width:2.2"/>` + sT(gx, gy + F * 1.9, "Verre de montre", "middle", tk * 0.85, 'font-weight="700"');
    if (st.peche || k === "peche") { const a = k === "peche" ? q : 1, col = (st.vert || k === "vert") ? (k === "vert" ? `rgb(${Math.round(lerp(245, 47, q))},${Math.round(lerp(245, 138, q))},${Math.round(lerp(245, 74, q))})` : "#2f8a4a") : "#f5f5f5"; g += `<ellipse cx="${f1(gx)}" cy="${f1(gy + F * 0.25)}" rx="${f1(F * 0.8)}" ry="${f1(F * 0.25)}" style="fill:${col};stroke:var(--ink);stroke-width:1;opacity:${f1(a)}"/>`; }
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Paillasse : un mortier, un tube à essai et un verre de montre. L'état du TP est écrit au-dessus du dessin.">${g}</svg>`;
  });
  const loop = () => { if (!document.body.contains(el)) return; fig.draw(); if (an && performance.now() - an.t0 >= an.dur) { const d = an.done; an = null; btns(); if (d) d(); fig.draw(); return; } if (an) requestAnimationFrame(loop); };
  const run = (k, dur, done) => { an = { k, t0: performance.now(), dur, done }; btns(); requestAnimationFrame(loop); };
  const btns = () => { $(".pilot", el).innerHTML = TPA.map(([k, l]) => `<button type="button" class="btn ${k === "agit" ? "ghost" : ""}" data-act="${k}" ${an ? "disabled" : ""}>${l}</button>`).join("") + `<button type="button" class="btn ghost" data-act="reset" ${an ? "disabled" : ""}>${CT.animReset}</button>`; $$("[data-act]", el).forEach(b => b.onclick = () => act(b.dataset.act)); };
  const act = k => {
    if (k === "reset") { Object.keys(st).forEach(x => st[x] = 0); an = null; btns(); fig.draw(); return say("Paillasse prête : un morceau de banane dans le mortier."); }
    if (st.shaken) return say("✗ Le tube a été agité après l'éthanol : recommence le TP (bouton « Recommencer »).");
    if (["eau", "liq", "sel"].includes(k)) { if (st.broy) return say("Le broyage est déjà fait."); if (st[k]) return say("C'est déjà fait."); st[k] = 1; fig.draw(); return say("✓ " + { eau: "Eau distillée ajoutée.", liq: "Liquide vaisselle ajouté : il détruit les membranes des cellules.", sel: "Sel ajouté : il aide l'ADN à précipiter." }[k]); }
    if (k === "broy") { const miss = ["eau", "liq", "sel"].filter(x => !st[x]); if (miss.length) return say("✗ Avant de broyer, il manque : " + miss.map(x => TPN[x]).join(" ; ") + "."); if (st.broy) return say("C'est déjà broyé."); return run("broy", 1600, () => { st.broy = 1; say("✓ Purée lisse obtenue : les cellules sont broyées et leurs membranes détruites."); }); }
    if (!st.broy) return say("✗ Il faut d'abord préparer et broyer le mélange dans le mortier.");
    if (k === "trans") { if (st.trans) return say("C'est déjà fait."); return run("trans", 1200, () => { st.trans = 1; say("✓ Le tube est rempli au tiers."); }); }
    if (!st.trans) return say("✗ Transvase d'abord le mélange dans le tube.");
    if (k === "agit") { if (st.eth) { st.shaken = 1; fig.draw(); return say("✗ Erreur fréquente : il ne faut PAS agiter après l'éthanol ! Les deux liquides se mélangent et l'ADN ne forme pas de filaments. Recommence."); } st.agit = 1; return say("✓ Tu agites doucement, tube bouché avec le pouce : c'est juste avant l'éthanol, donc c'est permis."); }
    if (k === "eth") { if (st.eth) return say("C'est déjà fait."); return run("eth", 1500, () => { st.eth = 1; say("✓ L'éthanol froid forme une couche au-dessus du mélange. Surtout, n'agite plus !"); }); }
    if (!st.eth) return say("✗ Il manque l'éthanol froid.");
    if (k === "wait") { if (st.wait) return say("C'est déjà fait."); return run("wait", 2000, () => { st.wait = 1; say("✓ Des filaments blanchâtres apparaissent entre les deux liquides : l'ADN précipite."); }); }
    if (!st.wait) return say("✗ Attends un peu : les filaments ne sont pas encore apparus.");
    if (k === "peche") { if (st.peche) return say("C'est déjà fait."); return run("peche", 1200, () => { st.peche = 1; say("✓ Les filaments sont déposés sur le verre de montre."); }); }
    if (!st.peche) return say("✗ Pêche d'abord les filaments avec la spatule.");
    if (k === "vert") { if (st.vert) return say("C'est déjà fait."); return run("vert", 1400, () => { st.vert = 1; T().done = 1; keep(); say("✓ <b>Le précipité devient vert</b> avec le vert de méthyle. TP terminé : réponds aux questions."); }); }
  };
  btns(); act("reset");
};

/* ---------- activités 4 et 6 : le chromosome simple et double ---------- */
WID.chromo = el => {
  let d = 1;
  el.innerHTML = `<div class="seg" role="group" aria-label="Chromosome"><button type="button" data-d="0">Chromosome simple</button><button type="button" data-d="1">Chromosome double</button></div><div class="figbox" style="max-width:30rem"></div><p class="cap">${nb("Schéma simplifié d'un chromosome. Les repères ① ② ③ sont à légender.")}</p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), H = F * 11, cx = W * 0.38, cy = H / 2, L = H * 0.78, w = Math.max(10, F * 0.75), off = d ? w * 0.75 : 0, tx = W - tk * 1.2;
    const chrom = x => `<rect x="${f1(x - w / 2)}" y="${f1(cy - L / 2)}" width="${f1(w)}" height="${f1(L)}" rx="${f1(w / 2)}" style="fill:var(--chp);stroke:var(--ink);stroke-width:1.5"/>` + [0.12, 0.26, 0.62, 0.8].map(t => `<rect x="${f1(x - w / 2)}" y="${f1(cy - L / 2 + t * L)}" width="${f1(w)}" height="${f1(L * 0.04)}" style="fill:var(--surface);opacity:.7"/>`).join("");
    const tag = (n, x, y, ty) => `<line x1="${f1(x)}" y1="${f1(y)}" x2="${f1(tx)}" y2="${f1(ty)}" style="stroke:var(--ink);stroke-width:1.5"/><circle cx="${f1(tx)}" cy="${f1(ty)}" r="${f1(tk * 0.85)}" style="fill:var(--accent)"/><text x="${f1(tx)}" y="${f1(ty + tk * 0.36)}" text-anchor="middle" style="fill:var(--accent-ink);font-size:${f1(tk)}px;font-weight:800">${n}</text>`;
    let g = chrom(cx - off) + (d ? chrom(cx + off) + `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(w * 0.75)}" style="fill:var(--ink)"/>` : "");
    if (d) g += tag("①", cx - off - w / 2, cy - L * 0.3, H * 0.12) + tag("②", cx + w * 0.6, cy, H * 0.5) + tag("③", cx + off + w / 2, cy + L * 0.3, H * 0.88);
    else g += tag("①", cx + w / 2, cy - L * 0.3, H * 0.12);
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${d ? "Chromosome double : deux bâtonnets identiques reliés en leur milieu. Repère 1 sur le bâtonnet de gauche, repère 2 sur le point qui les relie, repère 3 sur le bâtonnet de droite." : "Chromosome simple : un seul bâtonnet, repère 1."}">${g}</svg>`;
  });
  const paint = () => { press(el, "d", d); fig.draw(); };
  $$("[data-d]", el).forEach(b => b.onclick = () => { d = +b.dataset.d; paint(); }); paint();
};

/* ---------- activité 6 : lire des caryotypes ---------- */
const KARYO = [{ n: "Caryotype n° 1", sex: "XX", t21: 0 }, { n: "Caryotype n° 2", sex: "XY", t21: 1 }, { n: "Caryotype n° 3", sex: "XY", t21: 0 }];
const KLEN = Array.from({ length: 22 }, (_, i) => 1 - i * 0.036);
WID.caryo = el => {
  let k = 0, sel = null;
  el.innerHTML = `<div class="seg" role="group" aria-label="Caryotype affiché">${KARYO.map((c, i) => `<button type="button" data-k="${i}">${c.n}</button>`).join("")}</div><p class="lead">${nb("Touche une paire pour compter ses chromosomes.")}</p><div class="figbox karyo"></div><p class="readout" aria-live="polite"></p><p class="cap">${nb("Caryotypes schématisés : les chromosomes sont photographiés pendant une division (chromosomes doubles), puis classés par paires et par taille décroissante.")}</p>`;
  const pairs = () => { const K = KARYO[k]; return [...KLEN.map((l, i) => ({ id: String(i + 1), lab: String(i + 1), ch: Array(K.t21 && i === 20 ? 3 : 2).fill(l) })), { id: "sx", lab: K.sex === "XX" ? "X X" : "X Y", ch: K.sex === "XX" ? [0.62, 0.62] : [0.62, 0.22] }]; };
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F) * 0.9, P = pairs(), rows = [P.slice(0, 6), P.slice(6, 12), P.slice(12, 18), P.slice(18)], cw = W / 6, rh = Math.max(F * 4.2, cw * 0.9), H = rh * 4 + 4, cmax = rh - tk * 1.6, w = Math.max(3, Math.min(cw * 0.07, F * 0.32)); let g = "";
    rows.forEach((r, ri) => r.forEach((pr, ci) => {
      const x0 = cw * ci + 2, y0 = rh * ri + 2, base = y0 + cmax, n = pr.ch.length, sp = Math.min(cw * 0.22, w * 3.6), on = sel === pr.id;
      g += `<g class="kp" data-p="${pr.id}" tabindex="0" role="button" aria-pressed="${on}" aria-label="Paire ${pr.lab === "X X" || pr.lab === "X Y" ? "des chromosomes sexuels" : "n° " + pr.lab}"><rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(cw - 4)}" height="${f1(rh - 4)}" rx="8" style="fill:${on ? "var(--accent-soft)" : "transparent"};stroke:${on ? "var(--accent)" : "transparent"};stroke-width:2"/>`;
      pr.ch.forEach((l, j) => { const x = x0 + (cw - 4) / 2 + (j - (n - 1) / 2) * sp, h = cmax * l * 0.92, y = base - h; [-1, 1].forEach(s => { g += `<rect x="${f1(x + s * w * 0.55 - w / 2)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(w / 2)}" style="fill:var(--chp)"/>`; }); g += `<rect x="${f1(x - w)}" y="${f1(y + h * 0.38)}" width="${f1(w * 2)}" height="${f1(Math.max(2, h * 0.05))}" style="fill:var(--surface)"/>`; });
      g += sT(x0 + (cw - 4) / 2, y0 + rh - tk * 0.55, pr.lab, "middle", tk, 'font-weight="700"') + `</g>`;
    }));
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="group" aria-label="${KARYO[k].n} : 22 paires numérotées et une paire de chromosomes sexuels. Touche une paire pour connaître le nombre de ses chromosomes.">${g}</svg>`;
  });
  const host = $(".figbox", el);
  const choose = id => { sel = id; fig.draw(); const pr = pairs().find(p => p.id === id); $(".readout", el).innerHTML = nb(pr.id === "sx" ? `Chromosomes sexuels : <b>${KARYO[k].sex === "XX" ? "X et X" : "X et Y"}</b>.` : `Paire n° ${pr.lab} : <b>${pr.ch.length} chromosomes</b>.`); const n = host.querySelector(`[data-p="${id}"]`); if (n) n.focus(); };
  host.addEventListener("click", ev => { const n = ev.target.closest("[data-p]"); if (n) choose(n.dataset.p); });
  host.addEventListener("keydown", ev => { if (ev.key !== "Enter" && ev.key !== " ") return; const n = ev.target.closest("[data-p]"); if (n) { ev.preventDefault(); choose(n.dataset.p); } });
  const paint = () => { press(el, "k", k); sel = null; fig.draw(); $(".readout", el).innerHTML = nb(`${KARYO[k].n} affiché.`); };
  $$("[data-k]", el).forEach(b => b.onclick = () => { k = +b.dataset.k; paint(); }); paint();
};

/* ---------- activité 7 : TP virtuel, le test d'agglutination ---------- */
const SAMP = [["lucie", "Lucie DITÉE (témoin)", "A"], ["coup", "Sang du coupable", "O"], ["m1", "Échantillon mystère 1", "AB"], ["m2", "Échantillon mystère 2", "B"]];
const AGG = () => { const x = xst(); if (!x.agg || typeof x.agg !== "object") x.agg = {}; return x.agg; };
WID.aggl = el => {
  let s = "lucie", an = null;
  el.innerHTML = `<p class="lead">${nb("Choisis un échantillon, puis ajoute le sérum anti-A dans le puits de gauche et le sérum anti-B dans celui de droite. Un cure-dent propre pour chaque puits !")}</p>
    <div class="opt3">${segBtns("Échantillon", "s", SAMP.map(x => [x[0], x[1]]), s)}</div>
    <div class="row"><button type="button" class="btn" data-sa="A">💧 Ajouter l'anti-A</button><button type="button" class="btn" data-sa="B">💧 Ajouter l'anti-B</button></div>
    <div class="figbox" style="max-width:34rem"></div><p class="readout" aria-live="polite"></p><div class="res"></div>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), H = F * 8, r = Math.min(F * 2.6, W * 0.17), xs = [W * 0.28, W * 0.72], y = F * 3.6, R = AGG()[s] || {}, grp = SAMP.find(x => x[0] === s)[2]; let g = "";
    ["A", "B"].forEach((ab, i) => {
      const x = xs[i], q = an && an.ab === ab ? Math.min(1, (performance.now() - an.t0) / an.dur) : (R[ab] !== undefined ? 1 : 0), ag = grp.includes(ab) && q > 0.5;
      g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" style="fill:var(--surface-2);stroke:var(--ink);stroke-width:2"/>`;
      if (!ag) g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.78)}" style="fill:#c0392b;opacity:.88"/>`;
      else { g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 0.78)}" style="fill:#f3c8bf;opacity:${f1(Math.min(1, (q - 0.5) * 3))}"/>`; for (let i2 = 0; i2 < 16; i2++) { const a = i2 * 2.4, d = r * 0.6 * Math.sqrt((i2 + 0.5) / 16); g += `<circle cx="${f1(x + Math.cos(a) * d)}" cy="${f1(y + Math.sin(a) * d)}" r="${f1(r * 0.075 + (i2 % 3) * r * 0.02)}" style="fill:#8e1f14"/>`; } }
      if (an && an.ab === ab && q < 0.6) g += `<path d="M${f1(x - r * 0.4)},${f1(y)} q${f1(r * 0.4)},${f1(-r * 0.5)} ${f1(r * 0.8)},0" style="fill:none;stroke:#fff;stroke-width:3;opacity:.8" transform="rotate(${f1(q * 720)} ${f1(x)} ${f1(y)})"/>`;
      g += sT(x, y + r + tk * 1.2, "anti-" + ab, "middle", tk, 'font-weight="800"') + (q >= 1 ? sT(x, y + r + tk * 2.4, ag ? "agglutination" : "pas d'agglutination", "middle", tk * 0.9, 'font-weight="700"') : "");
    });
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Deux puits : sérum anti-A à gauche, anti-B à droite. Le résultat est écrit sous chaque puits et dans le tableau.">${g}</svg>`;
  });
  const table = () => { const A = AGG(), rows = SAMP.filter(x => A[x[0]]).map(x => [x[1], A[x[0]].A === undefined ? "—" : A[x[0]].A ? "agglutination" : "pas d'agglutination", A[x[0]].B === undefined ? "—" : A[x[0]].B ? "agglutination" : "pas d'agglutination"]); $(".res", el).innerHTML = rows.length ? `<p class="lead"><b>Mes résultats</b></p>` + tbl(["Échantillon", "Anti-A", "Anti-B"], rows) : ""; };
  const loop = () => { if (!document.body.contains(el)) return; fig.draw(); if (an && performance.now() - an.t0 >= an.dur) { const ab = an.ab, r = (AGG()[s] || {})[ab]; an = null; fig.draw(); table(); $$("[data-sa]", el).forEach(b => b.disabled = false); $(".readout", el).innerHTML = nb(`Sérum anti-${ab} : <b>${r ? "agglutination" : "pas d'agglutination"}</b>.`); return; } if (an) requestAnimationFrame(loop); };
  $$("[data-sa]", el).forEach(b => b.onclick = () => { if (an) return; const ab = b.dataset.sa, A = AGG(); A[s] = A[s] || {}; if (A[s][ab] !== undefined) { $(".readout", el).innerHTML = nb("Ce puits est déjà testé. Change d'échantillon."); return; } A[s][ab] = SAMP.find(x => x[0] === s)[2].includes(ab) ? 1 : 0; keep(); an = { ab, t0: performance.now(), dur: 1600 }; $$("[data-sa]", el).forEach(x => x.disabled = true); $(".readout", el).innerHTML = nb(`On mélange le sérum anti-${ab} avec l'échantillon…`); requestAnimationFrame(loop); });
  $$("[data-s]", el).forEach(b => b.onclick = () => { if (an) return; s = b.dataset.s; press(el, "s", s); $(".readout", el).innerHTML = ""; fig.draw(); });
  table();
};

/* ---------- activité 8 : la machine à groupes sanguins ---------- */
WID.allele = el => {
  let a1 = "A", a2 = "O";
  el.innerHTML = `<div class="opt3">${segBtns("Allèle sur le chromosome n° 9 venu du père", "a1", [["A", "A"], ["B", "B"], ["O", "O"]], a1)}${segBtns("Allèle sur le chromosome n° 9 venu de la mère", "a2", [["A", "A"], ["B", "B"], ["O", "O"]], a2)}</div><div class="figbox" style="max-width:34rem"></div><p class="readout" aria-live="polite"></p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F), H = F * 9, cy = H / 2, x9 = W * 0.2, gx = W * 0.66, R = Math.min(F * 3, W * 0.2), L = H * 0.75, w = Math.max(10, F * 0.65); let g = "";
    [[a1, -1, "chp"], [a2, 1, "chm"]].forEach(([al, s, col]) => { const x = x9 + s * w * 1.1; g += `<rect x="${f1(x - w / 2)}" y="${f1(cy - L / 2)}" width="${f1(w)}" height="${f1(L)}" rx="${f1(w / 2)}" style="fill:var(--${col});stroke:var(--ink);stroke-width:1.5"/><rect x="${f1(x - w * 0.9)}" y="${f1(cy + L * 0.12)}" width="${f1(w * 1.8)}" height="${f1(tk * 1.3)}" rx="4" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.5"/>` + sT(x, cy + L * 0.12 + tk, al, "middle", tk, 'font-weight="800"'); });
    g += sT(x9, cy + L / 2 + tk * 1.1, "paire n° 9", "middle", tk * 0.9, 'font-weight="700"');
    g += arrow(x9 + w * 2.6, cy, gx - R - 8, cy, 3, "accent");
    g += `<circle cx="${f1(gx)}" cy="${f1(cy)}" r="${f1(R)}" style="fill:#c0392b;stroke:var(--ink);stroke-width:2"/><circle cx="${f1(gx)}" cy="${f1(cy)}" r="${f1(R * 0.45)}" style="fill:#a32d22"/>`;
    const ag = [a1, a2].filter(a => a !== "O"); const kinds = [...new Set(ag)]; const n = 10;
    for (let i = 0; i < n && kinds.length; i++) { const k = kinds[i % kinds.length], a = i / n * Math.PI * 2, x = gx + Math.cos(a) * R, y = cy + Math.sin(a) * R, ox = Math.cos(a), oy = Math.sin(a), sz = R * 0.13;
      g += k === "A" ? `<polygon points="${f1(x + ox * sz * 2)},${f1(y + oy * sz * 2)} ${f1(x - oy * sz)},${f1(y + ox * sz)} ${f1(x + oy * sz)},${f1(y - ox * sz)}" style="fill:#3b9a3f;stroke:var(--ink);stroke-width:1"/>` : `<circle cx="${f1(x + ox * sz * 1.2)}" cy="${f1(y + oy * sz * 1.2)}" r="${f1(sz)}" style="fill:#8e44ad;stroke:var(--ink);stroke-width:1"/>`; }
    g += sT(gx, cy + R + tk * 1.4, "globule rouge", "middle", tk * 0.9, 'font-weight="700"');
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Paire de chromosomes n° 9 portant les allèles ${a1} et ${a2}, et le globule rouge obtenu. Le résultat est écrit sous le dessin.">${g}</svg>`;
  });
  const grp = () => { const s = [a1, a2]; return s.includes("A") && s.includes("B") ? "AB" : s.includes("A") ? "A" : s.includes("B") ? "B" : "O"; };
  const paint = () => { press(el, "a1", a1); press(el, "a2", a2); fig.draw(); const g = grp(), ant = g === "O" ? "aucun antigène" : g === "AB" ? "des antigènes A (triangles verts) et B (ronds violets)" : `des antigènes ${g} (${g === "A" ? "triangles verts" : "ronds violets"})`; $(".readout", el).innerHTML = nb(`Génotype <b>${a1}/${a2}</b> → le globule rouge porte ${ant} → phénotype : <b>groupe ${g}</b>.`); };
  $$("[data-a1]", el).forEach(b => b.onclick = () => { a1 = b.dataset.a1; paint(); }); $$("[data-a2]", el).forEach(b => b.onclick = () => { a2 = b.dataset.a2; paint(); }); paint();
};

/* ---------- activité 8 : l'arbre de la famille de Jean, complété par l'élève ---------- */
const FAM = [["Papa", 1, "B"], ["Maman", 0, "A"], ["Sœur", 0, "AB"], ["Jean", 1, "O"], ["Frère", 1, "B"]];
const FAMG = [["B/B", "B/O"], ["A/A", "A/O"], ["A/B", "A/O", "B/O"], ["O/O", "A/O", "B/O"], ["B/B", "B/O"]];
LIVE.famille = (W, F, v) => {
  const tk = TK(F), cur = (v && v[0]) || {}, s = Math.min(F * 2, W * 0.12), H = s * 2 + tk * 7.5 + F * 2.4, y1 = tk * 0.5, y2 = y1 + s + tk * 3.4 + F * 1.4, X = [W * 0.3, W * 0.7, W * 0.17, W * 0.5, W * 0.83];
  const ln = (a, b, c, d) => `<line x1="${f1(a)}" y1="${f1(b)}" x2="${f1(c)}" y2="${f1(d)}" style="stroke:var(--ink);stroke-width:2"/>`;
  let g = ln(X[0] + s / 2, y1 + s / 2, X[1] - s / 2, y1 + s / 2) + ln(W / 2, y1 + s / 2, W / 2, y2 - F * 0.9) + ln(X[2], y2 - F * 0.9, X[4], y2 - F * 0.9) + [2, 3, 4].map(i => ln(X[i], y2 - F * 0.9, X[i], y2)).join("");
  FAM.forEach(([n, m, grp], i) => { const x = X[i], y = i < 2 ? y1 : y2, gt = cur[i] === undefined ? "?" : FAMG[i][cur[i]];
    g += (m ? `<rect x="${f1(x - s / 2)}" y="${f1(y)}" width="${f1(s)}" height="${f1(s)}" rx="4"` : `<circle cx="${f1(x)}" cy="${f1(y + s / 2)}" r="${f1(s / 2)}"`) + ` style="fill:var(--surface);stroke:var(--ink);stroke-width:2.2"/>` + sT(x, y + s / 2 + tk * 0.36, grp, "middle", tk, 'font-weight="800"');
    g += sT(x, y + s + tk * 1.15, n, "middle", tk * 0.95, 'font-weight="700"') + `<text x="${f1(x)}" y="${f1(y + s + tk * 2.35)}" text-anchor="middle" style="font-size:${f1(tk * 0.95)}px;font-weight:800;fill:var(--${gt === "?" ? "muted" : "accent"})">(${gt})</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Arbre de la famille de Jean : le papa (groupe B) et la maman (groupe A) ont trois enfants, la sœur (groupe AB), Jean (groupe O) et le frère (groupe B). Sous chacun, le génotype que tu as choisi.">${g}</svg>`;
};

/* ---------- activités 9 et 10 : images à classer et animation côte à côte ---------- */
const DUO_IMG = [["meio", 0.995], ["mito", 0.5], ["meio", 0.34], ["meio", 0.43], ["mito", 0.8], ["mito", 0.61]];
const duoImg = ([k, t], i) => `<span class="pic">${k === "mito" ? mitoSVG(200, 116, t, "Image " + (i + 1) + " : une cellule en division") : meioSVG(200, 116, t, "Image " + (i + 1) + " : une cellule en division")}</span><span>Image ${i + 1}</span>`;
WID.duo = el => {
  let p = 0;
  el.innerHTML = `<div class="row animctl"></div><div class="duo"><div><h4>Mitose (activité 9)</h4><div class="figbox" data-a></div></div><div><h4>Méiose (activité 10)</h4><div class="figbox" data-b></div></div></div><p class="readout" aria-live="polite"></p>${LEG("Modèle simplifié : 2 paires de chromosomes au lieu de 23.")}`;
  const fa = liveSVG($("[data-a]", el), (W, F) => mitoSVG(W, Math.min(W * 0.75, 12 * F), p, "Mitose : une cellule donne deux cellules identiques")), fb = liveSVG($("[data-b]", el), (W, F) => meioSVG(W, Math.min(W * 0.75, 12 * F), p, "Méiose : une cellule donne quatre cellules à un chromosome de chaque paire"));
  animCtl($(".animctl", el), 18000, q => { p = q; fa.draw(); fb.draw(); $(".readout", el).innerHTML = nb(q <= 0 ? "Même cellule de départ : 2 paires de chromosomes." : q < 1 ? "Observe les deux divisions en même temps." : "Mitose : 2 cellules identiques, avec les 2 paires. Méiose : 4 cellules, avec un seul chromosome de chaque paire."); });
};
