/* ===== 5e EIST · Mission 6 · Tempête de sable · Technologie · Activité 2 · Découvrir la programmation avec Thymio : simulations ===== */
Store.key = "eist5-thymio-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const N1 = x => (+x).toFixed(1), N3 = x => (+x).toFixed(3);
const RAD = Math.PI / 180;
/* texte SVG dont le style optionnel complète le style de base */
const sX = (x, y, txt, a, size, extra) => { extra = extra || ""; const m = extra.match(/style="([^"]*)"/); return `<text x="${N1(x)}" y="${N1(y)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${N1(size)}px;${m ? m[1] : ""}" ${extra.replace(/style="[^"]*"/, "")}>${esc(txt)}</text>`; };
const press = (el, key, cur) => $$(`[data-${key}]`, el).forEach(b => b.setAttribute("aria-pressed", b.dataset[key] === String(cur) ? "true" : "false"));
function loopWhile(el, fn) { let lt = 0; const st = ts => { if (!document.body.contains(el)) return; const dt = lt ? Math.min(0.1, (ts - lt) / 1000) : 0; lt = ts; fn(dt, ts); requestAnimationFrame(st); }; requestAnimationFrame(st); }
const seen = key => { const X = xst(); X.seen = X.seen || {}; X.seen[key] = X.seen[key] || {}; return X.seen[key]; };
const nSeen = key => Object.keys(((xst().seen || {})[key]) || {}).length;
/* découpe un texte en lignes d'au plus n caractères */
const wrapT = (t, n) => { const out = []; let cur = ""; String(t).split(" ").forEach(w => { if (cur && (cur + " " + w).length > n) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; }); if (cur) out.push(cur); return out; };

/* ---------- le robot vu du dessus (schéma simplifié) : largeur 1, avant vers le haut (y négatif) ---------- */
const MCOL = { rouge: "#d93030", vert: "#2fa84f", jaune: "#e3b800", violet: "#8e44c9", cyan: "#13b0c6", bleu: "#2f6fe0", off: "#c9d1d8" };
const MNAME = { rouge: "rouge", vert: "vert", jaune: "jaune", violet: "violet", cyan: "cyan" };
const FR = [[-0.42, -0.36], [-0.25, -0.55], [0, -0.62], [0.25, -0.55], [0.42, -0.36]], RR = [[-0.28, 0.5], [0.28, 0.5]], GR = [[-0.13, -0.44], [0.13, -0.44]];
const BODY = "M-0.5,0.44 Q-0.5,0.5 -0.44,0.5 L0.44,0.5 Q0.5,0.5 0.5,0.44 L0.5,-0.12 C0.5,-0.48 0.28,-0.62 0,-0.62 C-0.28,-0.62 -0.5,-0.48 -0.5,-0.12 Z";
const TOPLED = "M-0.4,0.4 L-0.4,-0.1 C-0.4,-0.4 -0.22,-0.52 0,-0.52 C0.22,-0.52 0.4,-0.4 0.4,-0.1 L0.4,0.4 Z";
function robotSVG(x, y, th, s, o) {
  o = o || {}; const ns = 'vector-effect="non-scaling-stroke"', sn = o.sens || {}, col = MCOL[o.mode] || MCOL.off;
  let g = `<g transform="translate(${N1(x)} ${N1(y)}) rotate(${N1(th)}) scale(${N3(s)})">`;
  if (o.ghost) return g + `<path d="${BODY}" style="fill:none;stroke:var(--muted);stroke-width:1.6;stroke-dasharray:5 4" ${ns}/></g>`;
  g += `<rect x="-0.63" y="-0.1" width="0.13" height="0.44" rx="0.04" style="fill:#2a2e33"/><rect x="0.5" y="-0.1" width="0.13" height="0.44" rx="0.04" style="fill:#2a2e33"/>`;
  g += `<path d="${BODY}" style="fill:#fbfcfd;stroke:#56616b;stroke-width:1.6" ${ns}/>`;
  g += `<path d="${TOPLED}" style="fill:${col};opacity:${o.mode && o.mode !== "off" ? 0.62 : 0.35}"/>`;
  /* capteurs au sol (sous le robot, vus par transparence) */
  if (!o.noGround) GR.forEach((p, i) => { const c = o.gcol ? o.gcol[i] : (sn.g && sn.g[i] ? "#ff3b30" : "none"), z = o.gcol ? 1.7 : 1; g += `<rect x="${p[0] - 0.05 * z}" y="${p[1] - 0.04 * z}" width="${0.1 * z}" height="${0.08 * z}" rx="0.015" style="fill:${c};stroke:${o.gcol ? "#e53935" : "#56616b"};stroke-width:${o.gcol ? 2 : 1};${o.gcol ? "" : "stroke-dasharray:2 2"}" ${ns}/>`; });
  /* les cinq touches : quatre flèches et le bouton central */
  const bt = (d, k) => { const on = o.press === k; return `<path d="${d}" style="fill:${on ? "#fff59d" : "rgba(255,255,255,.8)"};stroke:${on ? "#e65100" : "#56616b"};stroke-width:${on ? 2.6 : 1}" ${ns}/>`; };
  g += bt("M0,-0.37 L0.09,-0.23 L-0.09,-0.23 Z", "av") + bt("M0,0.33 L0.09,0.19 L-0.09,0.19 Z", "ar") + bt("M-0.31,-0.02 L-0.17,-0.11 L-0.17,0.07 Z", "g") + bt("M0.31,-0.02 L0.17,-0.11 L0.17,0.07 Z", "d");
  g += `<circle cx="0" cy="-0.02" r="0.065" style="fill:${o.press === "c" ? "#fff59d" : "rgba(255,255,255,.8)"};stroke:#56616b;stroke-width:1" ${ns}/>`;
  /* capteurs de proximité : cinq devant, deux derrière ; leur petit voyant rouge s'allume quand ils détectent */
  const dot = (p, on) => (on ? `<circle cx="${p[0]}" cy="${p[1]}" r="0.085" style="fill:#ff3b30;opacity:.45"/>` : "") + `<circle cx="${p[0]}" cy="${p[1]}" r="0.035" style="fill:${on ? "#ff1a1a" : "#3a4047"}"/>`;
  FR.forEach((p, i) => { g += dot(p, sn.f && sn.f[i]); });
  RR.forEach((p, i) => { g += dot(p, sn.r && sn.r[i]); });
  return g + "</g>";
}
/* coordonnées du monde d'un point du robot (repère du robot : avant = y négatif) */
const toW = (P, lx, ly, sc) => { const c = Math.cos(P.th * RAD), s = Math.sin(P.th * RAD); return [P.x + (lx * c - ly * s) * sc, P.y + (lx * s + ly * c) * sc]; };

/* ---------- 1 · les pièces du robot : quatre vues, six numéros à tester ---------- */
const VIEWS4 = [["dessus", "Vue du dessus", [1, 2]], ["dessous", "Vue du dessous", [3, 4, 6]], ["devant", "Vue de devant", [4, 5]], ["derriere", "Vue de derrière", [4, 5]]];
const MKMSG = { 1: "① : ton doigt appuie dessus, elle s'éclaire.", 2: "② : ils s'allument et changent de couleur.", 3: "③ : il émet un son : bip, bip ♪", 4: "④ : elles tournent.", 5: "⑤ : une main s'approche… les petits voyants rouges s'allument : le robot a « senti » la main sans la toucher.", 6: "⑥ : ils sont tournés vers le sol, juste sous l'avant du robot." };
const CIRC = ["", "①", "②", "③", "④", "⑤", "⑥"];
WID.anatomie = el => {
  let view = xst().view || "dessus", fx = 0, te = 9;
  el.innerHTML = `<p class="lead">${nb("Choisis une vue, puis touche un numéro pour le tester. Observe bien ce qui se passe.")}</p>
    <div class="vbar" role="group" aria-label="Choisir la vue">${VIEWS4.map(v => `<button type="button" data-vw="${v[0]}">${v[1]}</button>`).join("")}</div>
    <div class="figbox"></div><div class="row mk"></div><p class="readout" aria-live="polite"></p><p class="cap">${nb("Schéma simplifié du robot Thymio : compare-le au vrai robot posé sur ta table.")}</p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const D = Math.min(W, F * 24), ox = (W - D) / 2, u = D / 10, H = u * 7.4, tk = TK(F), R = Math.max(F * 0.8, 15);
    const on = m => fx === m && te < 2.8, ph = te * 6;
    let s = `<rect x="0" y="0" width="${W}" height="${N1(H)}" rx="12" style="fill:var(--surface-2)"/>`;
    const mk = (m, mx, my, tx, ty) => `<line x1="${N1(mx)}" y1="${N1(my)}" x2="${N1(tx)}" y2="${N1(ty)}" style="stroke:var(--accent);stroke-width:2.2"/><circle cx="${N1(tx)}" cy="${N1(ty)}" r="4" style="fill:var(--accent)"/><circle cx="${N1(mx)}" cy="${N1(my)}" r="${N1(R)}" style="fill:${on(m) ? "var(--accent)" : "var(--surface)"};stroke:var(--accent);stroke-width:2.5"/>` + sX(mx, my + R * 0.36, String(m), "middle", R * 1.05, `font-weight="800" style="fill:${on(m) ? "var(--accent-ink)" : "var(--ink)"}"`);
    if (view === "dessus") {
      const cx = ox + 5 * u, cy = 3.95 * u, sc = 4.4 * u;
      const mode = on(2) ? ["rouge", "vert", "bleu", "jaune", "violet"][Math.floor(te * 2.2) % 5] : "off";
      s += robotSVG(cx, cy, 0, sc, { mode, press: on(1) ? "av" : null, noGround: true });
      if (on(1)) { const fy = cy - 0.3 * sc - (te < 0.5 ? (0.5 - te) * u * 3 : 0); s += `<circle cx="${N1(cx)}" cy="${N1(fy)}" r="${N1(u * 0.38)}" style="fill:#f1c27d;opacity:.8;stroke:#8d5524;stroke-width:2"/>`; }
      s += mk(1, ox + 1.1 * u, 1.3 * u, cx, cy - 0.31 * sc) + mk(2, ox + 8.9 * u, 6.4 * u, cx + 0.3 * sc, cy + 0.25 * sc);
    }
    if (view === "dessous") {
      const cx = ox + 5 * u, cy = 3.95 * u, sc = 4.4 * u, P = (lx, ly) => [cx + lx * sc, cy + ly * sc];
      s += `<g transform="translate(${N1(cx)} ${N1(cy)}) scale(${N3(sc)})"><path d="${BODY}" style="fill:#e4e8ec;stroke:#56616b;stroke-width:1.6" vector-effect="non-scaling-stroke"/></g>`;
      [-1, 1].forEach(k => { const [x0, y0] = P(k < 0 ? -0.48 : 0.36, -0.08), w = 0.12 * sc, h = 0.42 * sc; s += `<rect x="${N1(x0)}" y="${N1(y0)}" width="${N1(w)}" height="${N1(h)}" rx="${N1(w * 0.3)}" style="fill:#2a2e33"/>`; const off = on(4) ? (ph * 6) % 12 : 0; for (let yy = y0 - 12 + off; yy < y0 + h; yy += 12) if (yy > y0) s += `<line x1="${N1(x0 + 2)}" x2="${N1(x0 + w - 2)}" y1="${N1(yy)}" y2="${N1(yy)}" style="stroke:#7c858e;stroke-width:3"/>`; });
      GR.forEach(p => { const [gx, gy] = P(p[0], p[1] - 0.02); if (on(6)) s += `<circle cx="${N1(gx)}" cy="${N1(gy)}" r="${N1(u * (0.35 + 0.15 * Math.sin(ph)))}" style="fill:#ff3b30;opacity:.3"/>`; s += `<rect x="${N1(gx - u * 0.22)}" y="${N1(gy - u * 0.16)}" width="${N1(u * 0.44)}" height="${N1(u * 0.32)}" rx="3" style="fill:#1f2328"/><circle cx="${N1(gx)}" cy="${N1(gy)}" r="${N1(u * 0.07)}" style="fill:${on(6) ? "#ff3b30" : "#5b636b"}"/>`; });
      const [hx, hy] = P(0, 0.28);
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i * i + j * j <= 5) s += `<circle cx="${N1(hx + i * u * 0.13)}" cy="${N1(hy + j * u * 0.13)}" r="${N1(u * 0.04)}" style="fill:#3a4047"/>`;
      s += `<circle cx="${N1(hx)}" cy="${N1(hy)}" r="${N1(u * 0.36)}" style="fill:none;stroke:#56616b;stroke-width:1.5"/>`;
      if (on(3)) for (let k = 0; k < 3; k++) { const r = u * (0.5 + ((te * 1.6 + k / 3) % 1) * 1.6); s += `<circle cx="${N1(hx)}" cy="${N1(hy)}" r="${N1(r)}" style="fill:none;stroke:var(--accent);stroke-width:2.5;opacity:${N1(1 - (r / u - 0.5) / 1.6)}"/>`; }
      s += sX(ox + 0.2 * u, 0.7 * u, "Robot retourné", "start", tk * 0.9, 'style="fill:var(--muted)"');
      s += mk(3, ox + 9 * u, 6.6 * u, hx + u * 0.3, hy + u * 0.2) + mk(4, ox + 9.1 * u, 2.2 * u, ...P(0.48, 0.05)) + mk(6, ox + 1.0 * u, 1.3 * u, ...P(-0.13, -0.46));
    }
    if (view === "devant" || view === "derriere") {
      const front = view === "devant", bx = ox + 1.1 * u, bw = 7.8 * u, by = 2.3 * u, bh = 2.6 * u, gy = 5.6 * u;
      s += `<line x1="${N1(ox)}" x2="${N1(ox + D)}" y1="${N1(gy)}" y2="${N1(gy)}" style="stroke:var(--muted);stroke-width:2"/>`;
      [ox + 0.55 * u, ox + 8.85 * u].forEach(wx => { s += `<rect x="${N1(wx)}" y="${N1(3.7 * u)}" width="${N1(0.6 * u)}" height="${N1(gy - 3.7 * u)}" rx="${N1(0.18 * u)}" style="fill:#2a2e33"/>`; const off = on(4) ? (ph * 5) % (0.5 * u) : 0; for (let yy = 3.7 * u + off; yy < gy - 2; yy += 0.5 * u) s += `<line x1="${N1(wx + 3)}" x2="${N1(wx + 0.6 * u - 3)}" y1="${N1(yy)}" y2="${N1(yy)}" style="stroke:#7c858e;stroke-width:3"/>`; });
      s += `<rect x="${N1(bx)}" y="${N1(by)}" width="${N1(bw)}" height="${N1(bh)}" rx="${N1(0.5 * u)}" style="fill:#fbfcfd;stroke:#56616b;stroke-width:2"/><rect x="${N1(bx + 0.3 * u)}" y="${N1(by)}" width="${N1(bw - 0.6 * u)}" height="${N1(0.35 * u)}" rx="${N1(0.15 * u)}" style="fill:${MCOL.off}"/>`;
      const xs = front ? [2, 3.5, 5, 6.5, 8] : [3.2, 6.8], wy = by + 1.15 * u, near = on(5) ? Math.min(1, te / 1.4) : 0;
      xs.forEach((xx, i) => { const wx = ox + xx * u, lit = on(5) && near > (front ? Math.abs(i - (xs.length - 1) / 2) / 3 + 0.25 : 0.4); if (lit) s += `<circle cx="${N1(wx)}" cy="${N1(wy - 0.55 * u)}" r="${N1(0.22 * u)}" style="fill:#ff3b30;opacity:.45"/>`; s += `<circle cx="${N1(wx)}" cy="${N1(wy - 0.55 * u)}" r="${N1(0.09 * u)}" style="fill:${lit ? "#ff1a1a" : "#c4cad0"}"/><rect x="${N1(wx - 0.3 * u)}" y="${N1(wy - 0.17 * u)}" width="${N1(0.6 * u)}" height="${N1(0.34 * u)}" rx="4" style="fill:#1f2328"/>`; });
      if (on(5)) { const hx = ox + 5 * u, hs = u * (0.9 + near * 1.1); s += `<text x="${N1(hx)}" y="${N1(by - 0.15 * u)}" text-anchor="middle" style="font-size:${N1(hs)}px;opacity:${N1(0.4 + 0.5 * near)}">✋</text>`; }
      s += mk(4, ox + 2.4 * u, 6.7 * u, ox + 0.85 * u, 5.0 * u) + mk(5, ox + (front ? 6.5 : 6.8) * u, 0.95 * u, ox + (front ? 6.5 : 6.8) * u, wy - 0.18 * u);
    }
    const vt = VIEWS4.find(v => v[0] === view)[1];
    return `<svg viewBox="0 0 ${W} ${N1(H)}" width="${W}" height="${N1(H)}" role="img" aria-label="${esc(vt)} du robot Thymio, schéma simplifié, avec les numéros ${VIEWS4.find(v => v[0] === view)[2].join(", ")}.">${s}</svg>`;
  });
  const paint = () => {
    press(el, "vw", view); const v = VIEWS4.find(x => x[0] === view), X = xst(); X.anat = X.anat || {};
    $(".mk", el).innerHTML = v[2].map(m => `<button type="button" class="btn ghost" data-m="${m}" aria-label="Tester le numéro ${m}">${CIRC[m]} Tester${X.anat[m] ? " ✓" : ""}</button>`).join("");
    $$("[data-m]", el).forEach(b => b.onclick = () => { fx = +b.dataset.m; te = 0; X.anat[fx] = 1; keep(); $(".readout", el).innerHTML = nb(MKMSG[fx] + ` (${Object.keys(X.anat).length}/6 numéros testés)`); paint(); });
    fig.draw();
  };
  $$("[data-vw]", el).forEach(b => b.onclick = () => { view = b.dataset.vw; xst().view = view; keep(); fx = 0; te = 9; $(".readout", el).textContent = ""; paint(); });
  loopWhile(el, dt => { if (te < 2.8) { te += dt; fig.draw(); } else if (te < 9) { te = 9; fig.draw(); } });
  paint();
};

/* ---------- 2 · qui perçoit ? qui agit ? la chaîne d'information ---------- */
const TILES = [{ k: "roues", i: "⚙", l: "Roues (moteurs)" }, { k: "prox", i: "📡", l: "Capteurs de proximité" }, { k: "led", i: "💡", l: "LED" }, { k: "touch", i: "👆", l: "Touches" }, { k: "hp", i: "🔊", l: "Haut-parleur" }, { k: "sol", i: "🔦", l: "Capteurs au sol" }];
const SCEN = {
  main: { b: "✋ Une main devant", env: ["✋", "Une main s'approche", "devant le robot"], in: ["prox"], out: ["roues", "led"], eff: ["↩ Il recule", "et devient rouge"] },
  fleche: { b: "👆 La flèche avant", env: ["👆", "On appuie sur", "la flèche avant"], in: ["touch"], out: ["roues", "hp"], eff: ["⬆ Il avance", "et fait « bip »"] },
  bord: { b: "⬛ Le bord de la table", env: ["⬛", "Le robot arrive", "au bord de la table"], in: ["sol"], out: ["roues", "led", "hp"], eff: ["⏹ Il s'arrête,", "clignote et sonne"] } };
WID.chaine = el => {
  let sc = null, t = 0;
  el.innerHTML = `<p class="lead">${nb("Choisis une situation et suis le trajet de l'information, de l'extérieur du robot jusqu'à sa réaction.")}</p>
    <div class="row sitb">${Object.entries(SCEN).map(([k, v]) => `<button type="button" class="btn ghost" data-sc="${k}">${v.b}</button>`).join("")}</div>
    <div class="figbox"></div><div class="legend" aria-hidden="true"><span><i style="background:#1e6fd9"></i>${nb("bleu : l'information entre dans le robot")}</span><span><i style="background:#e8710a"></i>${nb("orange : le robot agit sur ce qui l'entoure")}</span></div><p class="readout" aria-live="polite"></p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = Math.max(17, F * 0.82), wide = W >= F * 40, g = F * 1.2, cols = wide || W >= F * 24 ? 3 : 2, rows = 6 / cols, BLUE = "#1e6fd9", ORA = "#e8710a";
    let env, eff, rob, H;
    if (wide) { const bw = Math.min(F * 9.5, W * 0.22), rw = W - 2 * bw - 2 * g; H = F * 12.5; env = [0, H * 0.22, bw, H * 0.56]; rob = [bw + g, 0, rw, H]; eff = [W - bw, H * 0.22, bw, H * 0.56]; }
    else { const bh = F * 4.4, rh = F * 2.8 + rows * (F * 3.8 + F * 0.5) + F * 0.6; env = [0, 0, W, bh]; rob = [0, bh + g, W, rh]; eff = [0, bh + 2 * g + rh, W, bh]; H = eff[1] + bh; }
    const prog = [rob[0] + F * 0.6, rob[1] + F * 0.6, rob[2] - F * 1.2, F * 2.2], tw = (rob[2] - F * 1.2 - (cols - 1) * F * 0.5) / cols, th = wide ? (rob[3] - F * 3.6 - F * 0.5) / 2 : F * 3.8;
    const tilePos = j => { const c = j % cols, r = Math.floor(j / cols); return [rob[0] + F * 0.6 + c * (tw + F * 0.5), prog[1] + prog[3] + F * 0.6 + r * (th + F * 0.5)]; };
    const ctr = b => [b[0] + b[2] / 2, b[1] + b[3] / 2], tc = k => { const j = TILES.findIndex(x => x.k === k), p = tilePos(j); return [p[0] + tw / 2, p[1] + th / 2]; };
    const S0 = SCEN[sc], inOn = S0 && t > 0.95, outOn = S0 && t > 2.45, effOn = S0 && t > 3.3, progOn = S0 && t > 1.6 && t < 2.6;
    let s = `<rect x="${N1(rob[0])}" y="${N1(rob[1])}" width="${N1(rob[2])}" height="${N1(rob[3])}" rx="16" style="fill:var(--surface-2);stroke:var(--line);stroke-width:2"/>`;
    s += `<rect x="${N1(prog[0])}" y="${N1(prog[1])}" width="${N1(prog[2])}" height="${N1(prog[3])}" rx="12" style="fill:${progOn ? "#fff3c4" : "var(--surface)"};stroke:${progOn ? "#c79a00" : "var(--line)"};stroke-width:${progOn ? 3 : 1.5}"/>` + sX(prog[0] + prog[2] / 2, prog[1] + prog[3] * 0.66, "🧠 le programme du robot", "middle", tk, 'font-weight="800"');
    TILES.forEach((T, j) => {
      const [x, y] = tilePos(j), isIn = inOn && S0.in.includes(T.k), isOut = outOn && S0.out.includes(T.k), c = isIn ? BLUE : isOut ? ORA : "var(--line)";
      s += `<rect x="${N1(x)}" y="${N1(y)}" width="${N1(tw)}" height="${N1(th)}" rx="12" style="fill:${isIn ? "#dbe9ff" : isOut ? "#ffe6cc" : "var(--surface)"};stroke:${c};stroke-width:${isIn || isOut ? 4 : 1.5}"/>`;
      const lines = wrapT(T.l, Math.max(8, Math.floor((tw - 10) / (tk * 0.95 * 0.56))));
      s += `<text x="${N1(x + tw / 2)}" y="${N1(y + th * 0.36)}" text-anchor="middle" style="font-size:${N1(tk * 1.15)}px">${T.i}</text>`;
      lines.forEach((ln, i) => { s += sX(x + tw / 2, y + th * 0.36 + tk * 1.2 * (i + 1), ln, "middle", tk * 0.95, `font-weight="700" style="${isIn || isOut ? "fill:#102030" : ""}"`); });
    });
    const box = (b, lines, onC, act) => { let r = `<rect x="${N1(b[0])}" y="${N1(b[1])}" width="${N1(b[2])}" height="${N1(b[3])}" rx="14" style="fill:${act ? onC + "22" : "var(--surface)"};stroke:${act ? onC : "var(--line)"};stroke-width:${act ? 3 : 1.5};stroke-dasharray:${act ? "0" : "6 5"}"/>`; const cx = b[0] + b[2] / 2; (lines || []).forEach((ln, i) => { r += i === 0 && ln.length <= 2 ? `<text x="${N1(cx)}" y="${N1(b[1] + F * 1.7)}" text-anchor="middle" style="font-size:${N1(tk * 1.4)}px">${ln}</text>` : sX(cx, b[1] + F * 1.7 + (lines[0].length <= 2 ? tk * 1.3 * i : tk * 1.3 * (i + 0.2)), ln, "middle", tk * 0.95, 'font-weight="700"'); }); return r; };
    s += box(env, S0 ? S0.env : ["", "Choisis une", "situation"], BLUE, !!S0) + box(eff, effOn ? S0.eff : ["", "Réaction", "du robot…"], ORA, effOn);
    if (S0) {
      const lerp = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], E = ctr(env), P = ctr(prog), Ef = ctr(eff), dot = (p, c) => `<circle cx="${N1(p[0])}" cy="${N1(p[1])}" r="${N1(F * 0.42)}" style="fill:${c};stroke:#fff;stroke-width:2"/>`;
      const A = tc(S0.in[0]);
      if (t < 1.0) s += dot(lerp(E, A, t / 1.0), BLUE); else if (t < 1.7) s += dot(lerp(A, P, (t - 1.0) / 0.7), BLUE);
      else if (t < 2.5) S0.out.forEach(k => { s += dot(lerp(P, tc(k), (t - 1.7) / 0.8), ORA); }); else if (t < 3.4) S0.out.forEach(k => { s += dot(lerp(tc(k), Ef, (t - 2.5) / 0.9), ORA); });
    }
    return `<svg viewBox="0 0 ${W} ${N1(H)}" width="${W}" height="${N1(H)}" role="img" aria-label="${S0 ? esc(`${S0.env.slice(1).join(" ")} : l'information entre par ${S0.in.map(k => TILES.find(x => x.k === k).l).join(", ")}, passe par le programme, puis ${S0.out.map(k => TILES.find(x => x.k === k).l).join(", ")} agissent : ${S0.eff.join(" ")}.`) : "Schéma du robot : six éléments et le programme. Choisis une situation."}">${s}</svg>`;
  });
  $$("[data-sc]", el).forEach(b => b.onclick = () => { sc = b.dataset.sc; t = 0; seen("chaine")[sc] = 1; keep(); press(el, "sc", sc); $(".readout", el).innerHTML = nb(`Situation : <b>${SCEN[sc].env.slice(1).join(" ")}</b>. L'animation recommence en boucle. (${nSeen("chaine")}/3 situations observées)`); });
  loopWhile(el, dt => { if (!sc) return; t += dt; if (t > 4.8) t = 0; fig.draw(); });
};

/* ---------- 3 · l'arène : Thymio dans un mode préenregistré (vue du dessus, sur une table) ---------- */
const AW = 7, AH = 5.6, EDGE = 0.55, START = [3.5, 3.0];
const SITS = { devant: { lab: "📦 Objet devant", d: "un objet devant", obj: [0, -1.9], f: [0, 1, 1, 1, 0] }, droite: { lab: "📦 Objet à droite", d: "un objet à droite", obj: [1.4, -1.2], f: [0, 0, 0, 1, 1] },
  gauche: { lab: "📦 Objet à gauche", d: "un objet à gauche", obj: [-1.4, -1.2], f: [1, 1, 0, 0, 0] }, derriere: { lab: "📦 Objet derrière", d: "un objet derrière", obj: [0, 1.75], r: [1, 1] },
  rien: { lab: "🚫 Aucun objet", d: "aucun objet autour du robot" }, vide: { lab: "⬛ Bord de la table", d: "le bord de la table juste devant", start: 2.1 },
  av: { lab: "▲", d: "on appuie sur la flèche avant", press: "av" }, ar: { lab: "▼", d: "on appuie sur la flèche arrière", press: "ar" }, g: { lab: "◀", d: "on appuie sur la flèche gauche", press: "g" }, d: { lab: "▶", d: "on appuie sur la flèche droite", press: "d" } };
const MOVES = { avance: [1, 0, "avance"], recule: [-0.9, 0, "recule"], td: [0, 36, "tourne à droite"], tg: [0, -36, "tourne à gauche"], rg: [-0.8, 22, "recule en tournant à gauche"], rd: [-0.8, -22, "recule en tournant à droite"], edge: [1, 0, "avance puis s'arrête au bord"] };
const MODES = {
  rouge1: { col: "rouge", sits: ["devant"], act: { devant: "recule" }, clear: true },
  rouge: { col: "rouge", sits: ["devant", "droite", "gauche", "derriere"], act: { devant: "recule", droite: "rg", gauche: "rd", derriere: "avance" }, clear: true },
  vert: { col: "vert", sits: ["devant", "droite", "gauche"], act: { devant: "avance", droite: "td", gauche: "tg" }, clear: true },
  violet: { col: "violet", sits: ["av", "g", "d", "ar"], act: { av: "avance", ar: "recule", d: "td", g: "tg" }, pad: true },
  jaune: { col: "jaune", sits: ["devant", "droite", "gauche", "rien", "vide"], act: { devant: "recule", droite: "tg", gauche: "td", rien: "avance", vide: "edge" }, edge: true } };
const BOXH = 0.36;
function arena(el, key) {
  const M = MODES[key]; let sit = null, t = 0, slow = false, P = { x: START[0], y: START[1], th: 0 }, P0 = { ...P }, trail = [], halted = false;
  const objOf = s => s && SITS[s].obj ? [START[0] + SITS[s].obj[0], START[1] + SITS[s].obj[1]] : null;
  const chip = `<span class="modechip"><i style="background:${MCOL[M.col]}"></i>Mode ${MNAME[M.col]}</span>`;
  const ctl = M.pad ? `<div class="pad" role="group" aria-label="Les flèches de Thymio">${[["", "av", ""], ["g", "", "d"], ["", "ar", ""]].flat().map(k => k ? `<button type="button" data-st="${k}" aria-label="Flèche ${{ av: "avant", ar: "arrière", g: "gauche", d: "droite" }[k]}">${SITS[k].lab}</button>` : `<span></span>`).join("")}</div>`
    : `<div class="row sitb">${M.sits.map(k => `<button type="button" class="btn ghost" data-st="${k}">${SITS[k].lab}</button>`).join("")}${M.clear ? `<button type="button" class="btn ghost" data-st="">✖ Retirer l'objet</button>` : ""}</div>`;
  el.innerHTML = `<p class="lead">${chip} ${nb(M.pad ? "Touche une flèche du robot : il réagit, puis recommence en boucle." : "Choisis une situation : le robot réagit, puis recommence en boucle.")}</p>
    ${M.pad ? `<div class="padw">${ctl}<div class="figbox"></div></div>` : `${ctl}<div class="figbox"></div>`}
    <div class="row"><button type="button" class="btn ghost" data-slow aria-pressed="false">🐢 Ralenti</button></div><p class="readout" aria-live="polite"></p>`;
  const reset = () => { const st = sit && SITS[sit].start; P = { x: START[0], y: st || START[1], th: 0 }; P0 = { ...P }; trail = [[P.x, P.y]]; t = 0; halted = false; };
  const hits = (Q) => { const o = objOf(sit); if (!o) return false; const pts = [...FR, ...RR, [-0.5, 0.5], [0.5, 0.5], [-0.5, -0.12], [0.5, -0.12], [-0.63, 0.34], [0.63, 0.34], [-0.63, -0.1], [0.63, -0.1]]; return pts.some(p => { const w = toW(Q, p[0], p[1], 1); return Math.abs(w[0] - o[0]) < BOXH + 0.05 && Math.abs(w[1] - o[1]) < BOXH + 0.05; }); };
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const k = W / AW, H = AH * k, tk = TK(F) * 0.85, o = objOf(sit), S0 = sit ? SITS[sit] : null;
    let s = `<rect x="0" y="0" width="${W}" height="${N1(H)}" rx="12" style="fill:#e9dcc3"/>`;
    for (let i = 1; i < AW; i++) s += `<line x1="${N1(i * k)}" x2="${N1(i * k)}" y1="0" y2="${N1(H)}" style="stroke:#d6c6a8;stroke-width:1"/>`;
    for (let j = 1; j < AH; j++) s += `<line y1="${N1(j * k)}" y2="${N1(j * k)}" x1="0" x2="${W}" style="stroke:#d6c6a8;stroke-width:1"/>`;
    if (M.edge) s += `<rect x="0" y="0" width="${W}" height="${N1(EDGE * k)}" rx="12" style="fill:#1c2025"/><rect x="0" y="${N1(EDGE * k * 0.5)}" width="${W}" height="${N1(EDGE * k * 0.5)}" style="fill:#1c2025"/>` + sX(W / 2, EDGE * k * 0.68, "vide : le bord de la table", "middle", tk, 'style="fill:#fff" font-weight="700"');
    if (o) s += `<rect x="${N1((o[0] - BOXH) * k)}" y="${N1((o[1] - BOXH) * k)}" width="${N1(2 * BOXH * k)}" height="${N1(2 * BOXH * k)}" rx="${N1(0.08 * k)}" style="fill:#c48a50;stroke:#7a4f24;stroke-width:2"/><rect x="${N1((o[0] - BOXH * 0.7) * k)}" y="${N1((o[1] - BOXH * 0.7) * k)}" width="${N1(1.4 * BOXH * k)}" height="${N1(1.4 * BOXH * k)}" rx="${N1(0.06 * k)}" style="fill:#d9a46b"/>` + sX(o[0] * k, (o[1] + BOXH) * k + tk * 1.1, "objet", "middle", tk * 0.9, 'style="fill:#5d3a17" font-weight="700"');
    if (sit) s += robotSVG(P0.x * k, P0.y * k, P0.th, k, { ghost: true });
    if (trail.length > 1) s += `<polyline points="${trail.map(p => `${N1(p[0] * k)},${N1(p[1] * k)}`).join(" ")}" style="fill:none;stroke:#1565c0;stroke-width:3;stroke-dasharray:6 5;stroke-linecap:round"/>`;
    const lit = S0 && t < 1.5, sens = { f: lit && S0.f, r: lit && S0.r, g: sit === "vide" && halted ? [1, 1] : null };
    s += robotSVG(P.x * k, P.y * k, P.th, k, { mode: M.col, sens, press: S0 && S0.press && t < 2.1 ? S0.press : null });
    const act = sit ? MOVES[M.act[sit]][2] : "est immobile";
    return `<svg viewBox="0 0 ${W} ${N1(H)}" width="${W}" height="${N1(H)}" role="img" aria-label="${esc(`Vue du dessus : Thymio en mode ${MNAME[M.col]} sur une table. ${S0 ? "Situation : " + S0.d + ". Le robot " + act + "." : "Aucune situation choisie : le robot est immobile."}`)}">${s}</svg>`;
  });
  const choose = v => {
    sit = v || null; reset(); press(el, "st", v || "");
    if (sit) { seen(key)[sit] = 1; keep(); }
    $(".readout", el).innerHTML = nb(sit ? `Situation : <b>${SITS[sit].d}</b>. Observe ce que fait le robot. (${nSeen(key)}/${M.sits.length} ${M.pad ? "flèches testées" : "situations observées"})` : M.pad ? "Touche une flèche du robot." : M.edge ? "Choisis une situation." : "Aucun objet : observe le robot.");
    fig.draw();
  };
  $$("[data-st]", el).forEach(b => b.onclick = () => choose(b.dataset.st));
  $("[data-slow]", el).onclick = e => { slow = !slow; e.currentTarget.setAttribute("aria-pressed", String(slow)); };
  loopWhile(el, dt => {
    if (!sit) return; const mv = MOVES[M.act[sit]]; t += dt * (slow ? 0.45 : 1);
    if (t > 0.5 && t < 2.1 && !halted) {
      const h = dt * (slow ? 0.45 : 1), Q = { x: P.x, y: P.y, th: P.th + mv[1] * h }; Q.x += mv[0] * Math.sin(Q.th * RAD) * h; Q.y -= mv[0] * Math.cos(Q.th * RAD) * h;
      if (hits(Q)) { Q.x = P.x; Q.y = P.y; }
      if (M.act[sit] === "edge") { const gs = toW(Q, 0, -0.44, 1); if (gs[1] <= EDGE + 0.02) { halted = true; Q.x = P.x; Q.y = P.y; } }
      P = Q; if (Math.hypot(P.x - trail[trail.length - 1][0], P.y - trail[trail.length - 1][1]) > 0.04) trail.push([P.x, P.y]);
    }
    if (t > 3.1) reset();
    fig.draw();
  });
  choose(null);
}
Object.keys(MODES).forEach(k => { WID["arena_" + k] = el => arena(el, k); });

/* ---------- 4 · le robot nettoyeur : suivre la ligne noire de la base aux panneaux solaires ---------- */
const PW = 12, PH = 8, LW = 0.6, RWP = 0.9, VLIN = 1, WROT = 120;
const PSEG = [[[1.4, 6.3], [1.4, 4.8], [2.2, 4.4], [3.8, 4.4]], [[3.8, 4.4], [5.6, 4.4], [6.2, 6.3], [7.8, 5.7]], [[7.8, 5.7], [9.4, 5.1], [7.6, 1.9], [9.8, 1.9]]];
const bez = (s, t) => { const u = 1 - t; return [0, 1].map(k => u * u * u * s[0][k] + 3 * u * u * t * s[1][k] + 3 * u * t * t * s[2][k] + t * t * t * s[3][k]); };
const PPTS = []; PSEG.forEach((s, i) => { for (let j = i ? 1 : 0; j <= 80; j++) PPTS.push(bez(s, j / 80)); });
const PEND = PPTS[PPTS.length - 1], PANEL = [10.45, 0.75, 1.25, 2.35];
function dSeg(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy; let t = L ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); }
const dLine = p => { let m = 1e9; for (let i = 1; i < PPTS.length; i++) { const d = dSeg(p, PPTS[i - 1], PPTS[i]); if (d < m) m = d; } return m; };
const PRULES = [["⚫⚫", "les deux capteurs au sol voient du noir"], ["⚪⚫", "seul le capteur gauche voit du blanc"], ["⚫⚪", "seul le capteur droit voit du blanc"], ["⚪⚪", "les deux capteurs au sol voient du blanc"]];
const PACTS = ["⬆ il avance", "↶ il tourne à gauche", "↷ il tourne à droite", "⏹ il s'arrête"];
const PSPD = [["lent", "🐢 Lent", 0.6], ["normal", "▶ Normal", 1.6], ["rapide", "⏩ Rapide", 4]];
const PGOOD = [0, 2, 1, 3];
const progTxt = () => { const p = xst().prog || {}; return PRULES.map((r, i) => `SI ${r[1]} ALORS ${p[i] === undefined ? "…" : PACTS[p[i]].slice(2)}`); };
WID.piste = el => {
  const X = xst(); X.prog = X.prog || {};
  let P = { x: PPTS[0][0], y: PPTS[0][1], th: 0 }, trail = [], run = false, sim = 0, stopT = 0, spin = 0, rule = -1, sens = [true, true], end = null, spd = "normal", clean = X.pisteOk ? 1 : 0;
  el.innerHTML = `<p class="lead">${nb("Le robot nettoyeur part de la base et doit suivre la ligne noire jusqu'aux panneaux solaires, puis s'y arrêter. Il a deux capteurs au sol, à l'avant : un à gauche, un à droite. La gauche et la droite sont celles du robot, comme si tu étais assis dessus.")}</p>
    <div class="pgrid"><div><div class="figbox"></div><p class="readout" aria-live="polite"></p>
      <div class="row"><button type="button" class="btn" data-run>▶ Tester mon programme</button><button type="button" class="btn ghost" data-rst>↺ Remettre à la base</button></div>
      <div class="row spd" role="group" aria-label="Vitesse de la simulation"><span class="lab3">Vitesse :</span>${PSPD.map(s => `<button type="button" class="btn ghost" data-sp="${s[0]}">${s[1]}</button>`).join("")}</div></div>
    <div class="prog"><p class="kicker">Mon programme · 4 instructions logiques</p>${PRULES.map((r, i) => `<div class="prow" data-r="${i}"><p class="pif"><span aria-hidden="true">${r[0]}</span> <b>SI</b> ${nb(r[1])}</p><div class="pthen"><b>ALORS</b><div class="seg2" role="group" aria-label="${esc("Action si " + r[1])}">${PACTS.map((a, j) => `<button type="button" data-ri="${i}" data-aj="${j}" aria-pressed="false">${nb(a)}</button>`).join("")}</div></div></div>`).join("")}</div></div>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const k = W / PW, H = PH * k, tk = TK(F) * 0.85;
    let s = `<rect x="0" y="0" width="${W}" height="${N1(H)}" rx="12" style="fill:#c9744a"/>`;
    s += `<rect x="${N1(0.25 * k)}" y="${N1(0.25 * k)}" width="${N1((PW - 0.5) * k)}" height="${N1((PH - 0.5) * k)}" rx="6" style="fill:#fbfaf6;stroke:#b9a98f;stroke-width:1.5"/>`;
    s += `<line x1="${N1(PW / 2 * k)}" x2="${N1(PW / 2 * k)}" y1="${N1(0.25 * k)}" y2="${N1((PH - 0.25) * k)}" style="stroke:#e5dfd2;stroke-width:1.5;stroke-dasharray:4 4"/>`;
    s += `<path d="M${PSEG.map((sg, i) => `${i ? "" : `${N1(sg[0][0] * k)},${N1(sg[0][1] * k)} `}C${sg.slice(1).map(p => `${N1(p[0] * k)},${N1(p[1] * k)}`).join(" ")}`).join(" ")}" style="fill:none;stroke:#15171a;stroke-width:${N1(LW * k)};stroke-linecap:round"/>`;
    /* la base (en bas à gauche) et les panneaux solaires (à droite) */
    s += `<path d="M${N1(0.5 * k)},${N1(7.75 * k)} A${N1(0.95 * k)},${N1(0.75 * k)} 0 0 1 ${N1(2.4 * k)},${N1(7.75 * k)} Z" style="fill:#dfe5ea;stroke:#56616b;stroke-width:2"/>` + sX(1.45 * k, 7.6 * k, "BASE", "middle", tk * 0.85, 'font-weight="800" style="fill:#1d2a33"');
    const [px, py, pw, ph] = PANEL;
    [0, 1].forEach(i => { const y0 = py + i * (ph / 2 + 0.05); s += `<rect x="${N1(px * k)}" y="${N1(y0 * k)}" width="${N1(pw * k)}" height="${N1((ph / 2 - 0.05) * k)}" rx="3" style="fill:${clean ? "#2f6fe0" : "#3c5a86"};stroke:#1c2a40;stroke-width:2"/>`; for (let c = 1; c < 3; c++) s += `<line x1="${N1((px + c * pw / 3) * k)}" x2="${N1((px + c * pw / 3) * k)}" y1="${N1(y0 * k)}" y2="${N1((y0 + ph / 2 - 0.05) * k)}" style="stroke:#9ec1ff;stroke-width:1;opacity:.7"/>`; });
    if (clean < 1) { let r = 11; for (let i = 0; i < 46; i++) { r = (r * 1103515245 + 12345) & 0x7fffffff; const ax = px + (r % 1000) / 1000 * pw; r = (r * 1103515245 + 12345) & 0x7fffffff; const ay = py + (r % 1000) / 1000 * ph; s += `<circle cx="${N1(ax * k)}" cy="${N1(ay * k)}" r="${N1(k * 0.12)}" style="fill:#c26a3c;opacity:${N1(0.9 * (1 - clean))}"/>`; } }
    else s += sX((PW - 0.35) * k, (py + ph) * k + tk * 3.2, "⚡ courant rétabli", "end", tk * 0.85, 'font-weight="800" style="fill:#0b6b2f"');
    s += sX((PW - 0.35) * k, (py + ph) * k + tk * 1.1, "panneaux", "end", tk * 0.8, 'font-weight="700" style="fill:#1d2a33"') + sX((PW - 0.35) * k, (py + ph) * k + tk * 2.1, "solaires", "end", tk * 0.8, 'font-weight="700" style="fill:#1d2a33"');
    if (trail.length > 1) s += `<polyline points="${trail.map(p => `${N1(p[0] * k)},${N1(p[1] * k)}`).join(" ")}" style="fill:none;stroke:#13b0c6;stroke-width:3;stroke-dasharray:6 5;stroke-linecap:round;opacity:.9"/>`;
    s += robotSVG(P.x * k, P.y * k, P.th, RWP * k, { mode: "cyan", gcol: sens.map(b => b ? "#000" : "#fff") });
    return `<svg viewBox="0 0 ${W} ${N1(H)}" width="${W}" height="${N1(H)}" role="img" aria-label="${esc(`Piste d'essai vue du dessus : une ligne noire relie la base aux panneaux solaires. Capteur gauche : ${sens[0] ? "noir" : "blanc"}, capteur droit : ${sens[1] ? "noir" : "blanc"}.${end ? " " + end.txt : ""}`)}">${s}</svg>`;
  });
  const loc = (lx, ly) => toW(P, lx, ly, RWP);
  const senseNow = () => { sens = [dLine(loc(GR[0][0], GR[0][1])) <= LW / 2, dLine(loc(GR[1][0], GR[1][1])) <= LW / 2]; return sens; };
  const readout = () => { const r = $(".readout", el); if (end) r.innerHTML = `<span class="${end.ok ? "okm" : "badm"}">${nb(end.txt)}</span>`; else r.innerHTML = nb(`Capteur gauche : <b>${sens[0] ? "⚫ noir" : "⚪ blanc"}</b> · capteur droit : <b>${sens[1] ? "⚫ noir" : "⚪ blanc"}</b>${run ? "" : " · Programme le robot, puis teste-le."}`); };
  const hl = i => { if (i === rule) return; rule = i; $$(".prow", el).forEach(r => r.classList.toggle("on", +r.dataset.r === i)); };
  const paintProg = () => { $$("[data-ri]", el).forEach(b => b.setAttribute("aria-pressed", String(X.prog[b.dataset.ri] === +b.dataset.aj))); };
  const home = () => { run = false; P = { x: PPTS[0][0], y: PPTS[0][1], th: 0 }; trail = [[P.x, P.y]]; sim = 0; stopT = 0; spin = 0; end = null; hl(-1); senseNow(); readout(); fig.draw(); };
  const finish = (ok, txt) => { run = false; end = { ok, txt }; hl(-1); X.pisteRuns = (X.pisteRuns || 0) + 1; if (ok) X.pisteOk = 1; keep(); readout(); fig.draw(); };
  const step = h => {
    const sL = senseNow(), kk = sL[0] && sL[1] ? 0 : !sL[0] && sL[1] ? 1 : sL[0] && !sL[1] ? 2 : 3, a = X.prog[kk]; hl(kk);
    const v = a === 0 ? VLIN : 0, w = a === 1 ? -WROT : a === 2 ? WROT : 0;
    P.th += w * h; P.x += v * Math.sin(P.th * RAD) * h; P.y -= v * Math.cos(P.th * RAD) * h; sim += h;
    if (v) spin = 0; else spin += Math.abs(w * h);
    const tl = trail[trail.length - 1]; if (Math.hypot(P.x - tl[0], P.y - tl[1]) > 0.06 && trail.length < 3000) trail.push([P.x, P.y]);
    if (a === 3) { stopT += h; if (stopT > 0.5) { const near = Math.hypot(P.x - PEND[0], P.y - PEND[1]) < 1; return finish(near, near ? "✓ Mission réussie : le robot est arrivé aux panneaux solaires et s'y est arrêté. Il peut les nettoyer : la base retrouve son électricité !" : "✗ Le robot s'est arrêté avant d'arriver aux panneaux. Regarde quelle instruction était active, puis corrige ton programme."); } } else stopT = 0;
    if (spin > 540) return finish(false, "✗ Le robot tourne sur lui-même sans avancer. Quelle instruction est active ? Corrige-la.");
    if (dLine([P.x, P.y]) > 1.3 || P.x < 0.3 || P.x > PW - 0.3 || P.y < 0.3 || P.y > PH - 0.3) return finish(false, "✗ Le robot a quitté la ligne et s'est perdu dans le sable. Corrige ton programme.");
    const f = loc(0, -0.62); if (f[0] > PANEL[0] && f[1] > PANEL[1] && f[1] < PANEL[1] + PANEL[3]) return finish(false, "✗ Le robot a roulé sur les panneaux ! Il devait s'arrêter au bout de la ligne.");
    if (sim > 30) return finish(false, Math.hypot(P.x - PEND[0], P.y - PEND[1]) < 1.5 ? "✗ Au bout de la ligne, le robot tourne en rond au lieu de s'arrêter. Quelle instruction est active ? Corrige-la." : "✗ Le robot n'arrive pas aux panneaux : il tourne en rond. Corrige ton programme.");
  };
  $$("[data-ri]", el).forEach(b => b.onclick = () => { X.prog[b.dataset.ri] = +b.dataset.aj; keep(); paintProg(); if (end || run) home(); });
  $("[data-run]", el).onclick = () => { const miss = [0, 1, 2, 3].filter(i => X.prog[i] === undefined); if (miss.length) { $(".readout", el).innerHTML = `<span class="badm">${nb(`Choisis d'abord une action pour chaque instruction (il en manque ${miss.length}).`)}</span>`; return; } home(); run = true; readout(); };
  $("[data-rst]", el).onclick = home;
  $$("[data-sp]", el).forEach(b => b.onclick = () => { spd = b.dataset.sp; press(el, "sp", spd); });
  press(el, "sp", spd);
  loopWhile(el, dt => {
    if (run) { let n = Math.round(dt * PSPD.find(s => s[0] === spd)[2] * 120); while (n-- > 0 && run) step(1 / 120); if (run) readout(); fig.draw(); }
    else if (X.pisteOk && clean < 1) { clean = Math.min(1, clean + dt * 0.8); fig.draw(); }
  });
  paintProg(); home();
};
