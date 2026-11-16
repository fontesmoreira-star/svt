/* ===== 2nde SVT · Les échelles de la biodiversité : manipulations et animations ===== */
Store.key = "svt2-echelles-biodiversite-v1";
const WID = {}, LIVE = {};
const lerp = (a, b, q) => a + (b - a) * Math.max(0, Math.min(1, q));
const seg = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const N1 = x => (+x).toFixed(1);

/* ---------- dessins : canards et équidés ---------- */
const DK = {
  A: { body: "#b7babd", chest: "#6e4128", head: "#1f6b45", ring: 1, bill: "#e0b422", wing: "#8f9498", bl: 1 },
  B: { body: "#fbfaf2", chest: "#fbfaf2", head: "#fbfaf2", bill: "#ee8a1e", wing: "#e6e2d3", bl: 1 },
  C: { body: "#b4562c", chest: "#fbfaf2", head: "#1c5a4a", bill: "#23201e", wing: "#dfe3e6", bl: 1.75 },
  D: { body: "#9b7648", chest: "#8b6539", head: "#ab8552", bill: "#c47a2c", wing: "#74552f", bl: 1, mot: 1 },
  E: { body: "#a8845a", chest: "#97734a", head: "#b59163", bill: "#8d6d3e", wing: "#7f6039", bl: 1.75, mot: 1 },
  K: { body: "#f1d54a", chest: "#f1d54a", head: "#f1d54a", bill: "#d98a2b", wing: "#c9a93a", bl: 0.8 }
};
function badge(x, y, r, txt) { return `<circle cx="${N1(x)}" cy="${N1(y)}" r="${N1(r)}" style="fill:var(--surface);stroke:var(--ink);stroke-width:2"/><text x="${N1(x)}" y="${N1(y + r * 0.42)}" text-anchor="middle" style="fill:var(--ink);font-size:${N1(r * 1.25)}px;font-weight:800">${txt}</text>`; }
function duck(k, x, y, s, dir, lab, op) {
  const d = DK[k], u = s / 10, st = `stroke:var(--ink);stroke-width:${Math.max(1, u * 0.28).toFixed(2)}`, tip = 6.3 + 2 * d.bl, wide = d.bl > 1.3 ? 0.3 : 0;
  let g = `<g transform="translate(${N1(x)},${N1(y)}) scale(${dir < 0 ? -1 : 1},1)" style="opacity:${op === undefined ? 1 : op}">`;
  g += `<path d="M${-4.4 * u},${-0.6 * u} L${-7.2 * u},${-2.8 * u} L${-4 * u},${1.2 * u}Z" style="fill:${d.wing};${st}"/>`;
  g += `<ellipse cx="0" cy="0" rx="${5 * u}" ry="${3 * u}" style="fill:${d.body};${st}"/>`;
  g += `<path d="M${1.2 * u},${-2.6 * u} Q${5.6 * u},${-2.4 * u} ${4.9 * u},${0.8 * u} Q${3.4 * u},${3 * u} ${1 * u},${2.9 * u} Q${2.6 * u},0 ${1.2 * u},${-2.6 * u}Z" style="fill:${d.chest};${st}"/>`;
  g += `<ellipse cx="${-0.9 * u}" cy="${-0.5 * u}" rx="${2.9 * u}" ry="${1.6 * u}" style="fill:${d.wing};${st}"/>`;
  if (d.mot) for (let i = 0; i < 5; i++) g += `<path d="M${(-3 + i * 1.5) * u},${(1.3 + (i % 2) * 0.5) * u} q${0.5 * u},${0.6 * u} ${1 * u},0" style="fill:none;stroke:#5a4022;stroke-width:${Math.max(1, u * 0.25).toFixed(2)}"/>`;
  g += `<path d="M${3 * u},${-1.4 * u} L${3.3 * u},${-5 * u} L${5.6 * u},${-5 * u} L${5.3 * u},${-1 * u}Z" style="fill:${d.head}"/>`;
  if (d.ring) g += `<rect x="${3.08 * u}" y="${-2.6 * u}" width="${2.3 * u}" height="${0.7 * u}" style="fill:#fbfaf2"/>`;
  g += `<path d="M${6 * u},${-5.2 * u} L${tip * u},${(-4.95 - wide) * u} Q${(tip + 0.6) * u},${-4.4 * u} ${tip * u},${(-3.85 + wide) * u} L${6 * u},${-4 * u}Z" style="fill:${d.bill};${st}"/>`;
  g += `<circle cx="${4.6 * u}" cy="${-5 * u}" r="${2 * u}" style="fill:${d.head};${st}"/><circle cx="${5.2 * u}" cy="${-5.5 * u}" r="${0.36 * u}" style="fill:#111"/></g>`;
  if (lab) g += badge(x, y - s * 0.98, Math.max(11, s * 0.2), lab);
  return g;
}
const EQ = { H: { c: "#8b5a33", m: "#3b2413", ear: 1.1, sz: 1 }, D: { c: "#9b9892", m: "#4c4a47", ear: 2.3, sz: 0.82, pale: 1 }, M: { c: "#5f4631", m: "#2b1f15", ear: 2, sz: 0.93 } };
function equid(k, x, y, s, dir, lab, op) {
  const e = EQ[k], u = s * e.sz / 10, st = `stroke:var(--ink);stroke-width:${Math.max(1, u * 0.26).toFixed(2)}`;
  let g = `<g transform="translate(${N1(x)},${N1(y - 5.6 * u)}) scale(${dir < 0 ? -1 : 1},1)" style="opacity:${op === undefined ? 1 : op}">`;
  g += `<path d="M${-4.3 * u},${-0.9 * u} Q${-6.2 * u},0 ${-5.4 * u},${3.6 * u}" style="fill:none;stroke:${e.m};stroke-width:${0.9 * u};stroke-linecap:round"/>`;
  [-3.6, -2.4, 2.2, 3.4].forEach(lx => { g += `<rect x="${lx * u}" y="${1.2 * u}" width="${0.9 * u}" height="${4.4 * u}" rx="${0.3 * u}" style="fill:${e.c};${st}"/>`; });
  g += `<ellipse cx="0" cy="0" rx="${4.6 * u}" ry="${2.3 * u}" style="fill:${e.c};${st}"/>`;
  g += `<path d="M${2.6 * u},${-1.6 * u} L${4.4 * u},${0.2 * u} L${6.4 * u},${-4.4 * u} L${4.9 * u},${-5.6 * u}Z" style="fill:${e.c};${st}"/>`;
  g += `<path d="M${2.7 * u},${-1.9 * u} L${4.9 * u},${-5.7 * u}" style="fill:none;stroke:${e.m};stroke-width:${0.9 * u};stroke-linecap:round"/>`;
  g += `<ellipse cx="${5.2 * u}" cy="${(-6.1 - e.ear * 0.45) * u}" rx="${0.42 * u}" ry="${e.ear * 0.62 * u}" transform="rotate(-10 ${5.2 * u} ${-6 * u})" style="fill:${e.c};${st}"/>`;
  g += `<ellipse cx="${6.7 * u}" cy="${-5 * u}" rx="${2 * u}" ry="${1.1 * u}" transform="rotate(28 ${6.7 * u} ${-5 * u})" style="fill:${e.c};${st}"/>`;
  if (e.pale) g += `<ellipse cx="${7.9 * u}" cy="${-4.3 * u}" rx="${0.8 * u}" ry="${0.7 * u}" style="fill:#e9e5dc"/>`;
  g += `<circle cx="${6.3 * u}" cy="${-5.6 * u}" r="${0.3 * u}" style="fill:#111"/></g>`;
  if (lab) g += `<text x="${N1(x)}" y="${N1(y + s * 0.3)}" text-anchor="middle" style="fill:var(--ink);font-size:${N1(Math.max(14, s * 0.22))}px;font-weight:800">${lab}</text>`;
  return g;
}

/* ---------- document : les cinq canards ---------- */
WID.canards = el => {
  el.innerHTML = `<div class="figbox"></div><p class="cap">Dessins simplifiés d'après des photographies : A, B, C et D sont ceux de la fiche ; E a été observé sur le même étang.</p>`;
  liveSVG($(".figbox", el), (W, F) => {
    const cols = W < 520 ? 3 : 5, cw = W / cols, rows = Math.ceil(5 / cols), rh = F * 6.2, s = Math.min(cw * 0.5, F * 3.4); let g = "";
    for (let r = 0; r < rows; r++) g += `<rect x="2" y="${r * rh + F * 3.1}" width="${W - 4}" height="${F * 2.6}" rx="10" style="fill:var(--sea);opacity:.28"/>`;
    "ABCDE".split("").forEach((k, i) => { const c = i % cols, r = Math.floor(i / cols), n = r === rows - 1 ? 5 - cols * (rows - 1) : cols, off = (cols - n) * cw / 2; g += duck(k, off + cw * (c + 0.45), r * rh + F * 3.7, s, 1, k); });
    return `<svg viewBox="0 0 ${W} ${rows * rh}" width="${W}" height="${rows * rh}" role="img" aria-label="Cinq canards. A : tête verte, collier blanc, corps gris. B : entièrement blanc, bec orange. C : tête verte, poitrine blanche, flancs roux, grand bec large et noir. D : brun tacheté. E : brun tacheté, grand bec large.">${g}</svg>`;
  });
};

/* ---------- TP virtuel : test d'interfécondité (volière, écurie) ---------- */
const OUT = { fert: "✓ petits fertiles", ster: "◐ petits stériles", none: "✗ pas de descendance" };
function mkCross(cfg) {
  return el => {
    const R = S.cross[cfg.key] || (S.cross[cfg.key] = {});
    let m = cfg.males[0][0], f = cfg.females[0][0], p = 0, last = "";
    el.innerHTML = `<p class="lead">${cfg.lead}</p>
      <div class="opt3"><div><span class="lab3">♂ Mâle</span><div class="seg" role="group" aria-label="Choix du mâle">${cfg.males.map(([k, n]) => `<button type="button" data-m="${k}">${n}</button>`).join("")}</div></div>
      <div><span class="lab3">♀ Femelle</span><div class="seg" role="group" aria-label="Choix de la femelle">${cfg.females.map(([k, n]) => `<button type="button" data-f="${k}">${n}</button>`).join("")}</div></div></div>
      <div class="row animctl"></div><div class="figbox"></div><p class="readout" aria-live="polite"></p><div class="res"></div>`;
    const nm = (list, k) => list.find(x => x[0] === k)[1];
    const fig = liveSVG($(".figbox", el), (W, F) => crossScene(cfg, W, F, p, m, f, cfg.res(m, f)));
    const table = () => { const n = Object.keys(R).length, tot = cfg.males.length * cfg.females.length; $(".res", el).innerHTML = `<p class="lead"><b>Mes croisements</b> : ${n}/${tot} réalisés.</p>` + tbl(["♂ \\ ♀", ...cfg.females.map(x => x[1])], cfg.males.map(a => [a[1], ...cfg.females.map(b => R[a[0] + b[0]] ? OUT[R[a[0] + b[0]]] : `<span class="muted">à tester</span>`)])); };
    const ctl = animCtl($(".animctl", el), cfg.dur, q => {
      p = q; fig.draw(); const lc = x => x[0].toLowerCase() + x.slice(1), t = cfg.text(q, nm(cfg.males, m), lc(nm(cfg.females, f)), cfg.res(m, f)); if (t !== last) { last = t; $(".readout", el).innerHTML = t; }
      if (q >= 1 && !R[m + f]) { R[m + f] = cfg.res(m, f); keep(); table(); }
    });
    const paint = () => { $$("[data-m]", el).forEach(b => b.setAttribute("aria-pressed", b.dataset.m === m ? "true" : "false")); $$("[data-f]", el).forEach(b => b.setAttribute("aria-pressed", b.dataset.f === f ? "true" : "false")); };
    $$("[data-m]", el).forEach(b => b.onclick = () => { m = b.dataset.m; paint(); ctl.set(0); });
    $$("[data-f]", el).forEach(b => b.onclick = () => { f = b.dataset.f; paint(); ctl.set(0); });
    paint(); table();
  };
}
function crossScene(cfg, W, F, p, m, f, o) {
  const H = F * 10.5, tk = TK(F), yW = F * 5.6, s = Math.min(F * 3.3, W * 0.2), ok = o !== "none", D = cfg.draw, gen2 = ok && p >= 0.74;
  let g = cfg.water ? `<rect x="2" y="${F * 3.4}" width="${W - 4}" height="${H - F * 3.4 - 2}" rx="12" style="fill:var(--sea);opacity:.28"/>` : `<rect x="2" y="${F * 5.2}" width="${W - 4}" height="${H - F * 5.2 - 2}" rx="12" style="fill:var(--c4);opacity:.3"/>`;
  const cap = t => sT(8, tk * 1.2, t, "start", tk, 'font-weight="800"');
  const heart = (x, y, q) => `<text x="${N1(x)}" y="${N1(y)}" text-anchor="middle" style="font-size:${N1(F * (0.5 + 1.1 * q))}px;fill:var(--bad);opacity:${q}">♥</text>`;
  const nest = (x, y, n, lab) => { let h = `<ellipse cx="${N1(x)}" cy="${N1(y)}" rx="${F * 1.9}" ry="${F * 0.7}" style="fill:#8a6a3c;stroke:var(--ink);stroke-width:1.5"/>`; for (let i = 0; i < n; i++) h += `<ellipse cx="${N1(x + (i - (n - 1) / 2) * F * 0.5)}" cy="${N1(y - F * 0.25 - (i % 2) * 3)}" rx="${F * 0.24}" ry="${F * 0.32}" style="fill:#f5f1e3;stroke:var(--ink);stroke-width:1.2"/>`; return h + (lab ? sT(x, y + F * 1.5, lab, "middle", tk * 0.9, 'font-weight="700"') : ""); };
  if (!gen2) {
    const a = seg(p, 0, 0.2), away = !ok ? seg(p, 0.42, 0.8) : 0;
    const gapx = s * (cfg.water ? 1.05 : 1.15), xm = lerp(lerp(W * 0.13, W / 2 - gapx, a), W * 0.12, away), xf = lerp(lerp(W * 0.87, W / 2 + gapx, a), W * 0.88, away), bob = Math.sin(p * 60) * 2;
    g += cap(p <= 0 ? "Avant le croisement" : "Génération 1 : les parents");
    g += D(cfg.shape(m), xm, yW + bob, s, away > 0.15 ? -1 : 1, cfg.tag(m)) + D(cfg.shape(f), xf, yW - bob, s, away > 0.15 ? 1 : -1, cfg.tag(f));
    if (ok && p > 0.2) g += heart(W / 2, yW - s * 0.75, Math.min(1, seg(p, 0.2, 0.3)) * (1 - seg(p, 0.5, 0.6)));
    if (!ok && p > 0.22 && p < 0.5) g += sT(W / 2, yW - s * 0.6, "… ?", "middle", F * 1.3, 'font-weight="800"');
    if (cfg.water) {
      if (ok && p >= 0.36 && p < 0.58) g += nest(W / 2, H - F * 1.9, Math.round(seg(p, 0.36, 0.52) * 6), "");
      if (!ok && p >= 0.5) g += nest(W / 2, H - F * 2.2, 0, "nid vide");
    } else if (ok && p >= 0.36 && p < 0.56) g += sT(W / 2, H - F * 1.2, "⏳ gestation : environ un an", "middle", tk, 'font-weight="700"');
    if (ok && p >= 0.56) { const q = seg(p, 0.56, 0.74), n = cfg.water ? 6 : 1, ks = cfg.water ? lerp(s * 0.26, s * 0.4, q) : lerp(s * 0.4, s * 0.62, q), sp = Math.min(ks * 1.9, (W - 16) / 6.4); for (let i = 0; i < n; i++) g += D(cfg.kid(m, f), W / 2 + (i - (n - 1) / 2) * sp, H - F * (cfg.water ? 1.7 : 0.9) + (cfg.water ? Math.sin(p * 80 + i) * 2 : 0), ks, 1); }
  } else {
    const [ya, yb] = cfg.young(m, f), a = seg(p, 0.74, 0.82), fert = o === "fert";
    g += cap("Génération 2 : les jeunes adultes");
    g += D(ya, lerp(W * 0.15, W / 2 - s * 1.1, a), yW, s * 0.95, 1) + D(yb, lerp(W * 0.85, W / 2 + s * 1.1, a), yW, s * 0.95, -1);
    if (fert) { g += heart(W / 2, yW - s * 0.75, seg(p, 0.82, 0.88) * (1 - seg(p, 0.92, 0.96))); if (cfg.water && p >= 0.88 && p < 0.95) g += nest(W / 2, H - F * 1.9, 4, ""); if (p >= 0.95) { const n = cfg.water ? 4 : 1, ks = s * (cfg.water ? 0.3 : 0.42), sp = Math.min(ks * 1.9, (W - 16) / 6.4); for (let i = 0; i < n; i++) g += D(cfg.kid(m, f), W / 2 + (i - (n - 1) / 2) * sp, H - F * (cfg.water ? 1.7 : 0.9), ks, 1); } }
    else if (p > 0.86) g += sT(W / 2, H - F * 1.3, "✗ toujours aucun petit", "middle", tk, 'font-weight="800"');
  }
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${cfg.alt}">${g}</svg>`;
}
WID.voliere = mkCross({ key: "can", water: 1, dur: 9000, alt: "Volière : un mâle et une femelle sont réunis. Le résultat du croisement est écrit sous le dessin et dans le tableau.",
  lead: "Choisis un mâle et une femelle, puis touche « ▶ Lancer » : ils sont réunis dans une volière pendant deux saisons de reproduction (temps accéléré). Réalise les <b>six croisements</b> possibles.",
  males: [["A", "Canard A"], ["C", "Canard C"]], females: [["B", "Canard B"], ["D", "Canard D"], ["E", "Canard E"]],
  res: (m, f) => (m === "A") === (f !== "E") ? "fert" : "none", draw: duck, shape: k => k, tag: k => k, kid: () => "K", young: (m, f) => [m, f],
  text: (q, m, f, o) => q <= 0 ? `${m} et ${f} sont prêts : touche « ▶ Lancer ».` : q < 0.2 ? `${m} et ${f} sont réunis dans la volière…` : o === "none" ? (q < 0.45 ? "Ils s'observent, mais ne forment pas de couple." : q < 1 ? "Le nid reste vide…" : `✗ <b>${m} × ${f}</b> : aucun œuf, aucun caneton. <b>Pas de descendance.</b>`) : q < 0.36 ? "Ils forment un couple : accouplement." : q < 0.56 ? "La femelle pond : <b>6 œufs</b>." : q < 0.74 ? "Éclosion : <b>6 canetons</b>, qui grandissent." : q < 0.88 ? "Un an plus tard : les jeunes, devenus adultes, forment un couple à leur tour." : q < 1 ? "Nouvelle ponte…" : `✓ <b>${m} × ${f}</b> : des canetons, capables d'avoir eux-mêmes des petits. <b>Descendance fertile.</b>` });
WID.ecurie = mkCross({ key: "equ", water: 0, dur: 9000, alt: "Pré : un mâle et une femelle sont réunis. Le résultat du croisement est écrit sous le dessin et dans le tableau.",
  lead: "Même protocole dans un pré : réunis un mâle et une femelle, puis observe leur petit… et ce qu'il devient une fois adulte. Réalise les <b>quatre croisements</b>.",
  males: [["H", "Étalon (cheval)"], ["D", "Âne"]], females: [["J", "Jument (cheval)"], ["N", "Ânesse"]],
  res: (m, f) => (m === "H") === (f === "J") ? "fert" : "ster", draw: equid, shape: k => (k === "H" || k === "J") ? "H" : "D", tag: k => ({ H: "étalon", J: "jument", D: "âne", N: "ânesse" })[k],
  kid: (m, f) => (m === "H") === (f === "J") ? (m === "H" ? "H" : "D") : "M", young: (m, f) => (m === "H") === (f === "J") ? (m === "H" ? ["H", "H"] : ["D", "D"]) : ["M", "M"],
  text: (q, m, f, o) => { const kid = o === "fert" ? (m.startsWith("É") ? "un poulain" : "un ânon") : (m.startsWith("Â") ? "un mulet (ou une mule)" : "un bardot"); return q <= 0 ? `${m} et ${f} sont prêts : touche « ▶ Lancer ».` : q < 0.2 ? `${m} et ${f} sont réunis dans le pré…` : q < 0.36 ? "Ils forment un couple : accouplement." : q < 0.56 ? "Gestation…" : q < 0.74 ? `Naissance : <b>${kid}</b>, qui grandit.` : q < 0.88 ? "Quelques années plus tard : les petits de ce croisement sont adultes. On réunit un mâle et une femelle." : q < 1 ? "…" : o === "fert" ? `✓ <b>${m} × ${f}</b> : ${kid}, capable d'avoir à son tour des petits. <b>Descendance fertile.</b>` : `◐ <b>${m} × ${f}</b> : ${kid}, mais il ne peut pas avoir de petits. <b>Descendance stérile.</b>`; } });

/* ---------- documents à explorer : classifications en groupes emboîtés ---------- */
const EMB = {
  veg: { hint: "Touche un caractère (en gras) ou un végétal.", levels: [
    ["Chlorophylle", "pigment vert qui capte la lumière : il permet au végétal de fabriquer sa matière organique (photosynthèse).", [["Ulve (algue verte)", "algue verte marine, en forme de lame, aussi appelée laitue de mer."]]],
    ["Tige et feuilles", "organes aériens : la tige porte les feuilles.", [["Polytric (mousse)", "mousse des sous-bois humides ; elle se reproduit par des spores."]]],
    ["Racines et vaisseaux conducteurs", "les racines puisent l'eau et les sels minéraux ; les vaisseaux conduisent la sève dans toute la plante.", [["Fougère", "plante des sous-bois ; elle se reproduit par des spores, visibles sous les feuilles."]]],
    ["Graines", "la graine contient un embryon et des réserves : en germant, elle donne une nouvelle plante.", [["Pin sylvestre (conifère)", "arbre dont les graines sont portées par des cônes (pommes de pin)."]]],
    ["Fleurs et fruits", "la fleur est l'organe de la reproduction ; elle se transforme en fruit, qui renferme les graines.", [["Cerisier", "arbre dont la fleur donne un fruit, la cerise, qui renferme une graine."], ["Coquelicot", "plante des champs à fleurs rouges ; son fruit est une capsule pleine de graines."]]]] },
  vert: { hint: "Touche un caractère (en gras) ou un animal.", levels: [
    ["Crâne et vertèbres", "squelette interne : le crâne protège l'encéphale, les vertèbres forment la colonne vertébrale.", [["Lamproie", "animal aquatique au corps allongé, à la bouche ronde en ventouse."]]],
    ["Mâchoires", "pièces du squelette qui bordent la bouche : elles permettent de saisir la nourriture.", [["Requin", "poisson dont le squelette est fait de cartilage."]]],
    ["Squelette osseux", "squelette fait d'os, et non de cartilage.", [["Sardine", "poisson à nageoires rayonnées, qui vit en bancs."]]],
    ["Doigts", "quatre membres terminés par des doigts.", [["Crapaud (amphibien)", "amphibien : sa peau est nue et humide, ses œufs sont pondus dans l'eau."], ["Grenouille (amphibien)", "amphibien : le têtard vit dans l'eau, l'adulte respire aussi par des poumons."]]],
    ["Amnios", "poche remplie de liquide qui protège l'embryon : il peut se développer hors de l'eau.", [["Lézard", "animal couvert d'écailles soudées, qui pond des œufs à coquille."], ["Crocodile", "grand animal à écailles, qui pond ses œufs à terre."], ["Mésange", "oiseau : son corps est couvert de plumes."]]],
    ["Poils et mamelles", "le corps est couvert de poils ; les femelles allaitent leurs petits.", [["Chat", "mammifère carnivore."], ["Gorille", "mammifère : grand singe d'Afrique."], ["Homme", "mammifère : l'espèce humaine."]]]] }
};
function mkEmb(key) {
  return el => {
    const d = EMB[key]; let h = "";
    for (let i = d.levels.length - 1; i >= 0; i--) { const [n, , sp] = d.levels[i]; h = `<div class="nb ${i % 2 ? "o" : ""}" data-l="${i}"><button type="button" class="nbh" data-c="${i}" aria-pressed="false">${n}</button><div class="nbs">${sp.map((s, j) => `<button type="button" class="sp" data-s="${i}-${j}" aria-pressed="false">${s[0]}</button>`).join("")}</div>${h}</div>`; }
    el.innerHTML = `<p class="lead">${d.hint} Une fenêtre d'explication s'ouvre sous le document. Un être vivant possède <b>tous les caractères des boîtes dans lesquelles il est rangé</b>.</p><div class="emb">${h}</div><div class="box info win" aria-live="polite"><p class="lab">ℹ Fenêtre d'explication</p><p class="wtxt">Touche un terme du document.</p></div>`;
    const clear = () => { $$("[aria-pressed]", el).forEach(b => b.setAttribute("aria-pressed", "false")); $$(".nb", el).forEach(b => b.classList.remove("on")); };
    $$(".nbh", el).forEach(b => b.onclick = () => { clear(); b.setAttribute("aria-pressed", "true"); b.parentNode.classList.add("on"); const L = d.levels[+b.dataset.c]; $(".wtxt", el).innerHTML = `<b>${L[0]}</b> : ${L[1]} Ce caractère est présent chez tous les êtres vivants rangés dans la boîte encadrée.`; });
    $$(".sp", el).forEach(b => b.onclick = () => { clear(); b.setAttribute("aria-pressed", "true"); const [i, j] = b.dataset.s.split("-").map(Number), s = d.levels[i][2][j]; $(".wtxt", el).innerHTML = `<b>${s[0]}</b> : ${s[1]} Pour connaître ses caractères, repère toutes les boîtes qui le contiennent.`; });
  };
}
WID.embVeg = mkEmb("veg"); WID.embVert = mkEmb("vert");

/* ---------- groupes emboîtés construits par l'élève (mâchoires, doigts, mamelles) ---------- */
const BOXA = ["Sardine", "Crapaud", "Gorille", "Requin", "Crocodile", "Homme"], BOXN = ["Mâchoires", "Doigts", "Mamelles"];
LIVE.boites = (W, F, v) => {
  const tk = TK(F), cur = (v && v[0]) || {}, rh = tk * 1.5, top = tk * 1.9, bh = rh * 2 + 12, H = top + bh * 3 + 14, todo = BOXA.filter((_, i) => cur[i] === undefined); let g = "";
  g += sT(4, tk * 1.1, todo.length ? "À ranger : " + todo.join(", ") : "Tous les animaux sont rangés.", "start", tk * 0.9, 'font-weight="700"');
  [0, 1, 2].forEach(b => { const x = 3 + b * F * 0.9, y = top + b * bh; g += `<rect x="${x}" y="${y}" width="${W - 2 * x}" height="${H - y - 4 - b * 6}" rx="10" style="fill:var(--${b % 2 ? "surface-2" : "surface"});stroke:var(--${["c1", "c2", "c3"][b]});stroke-width:2.5"/>` + sT(x + 10, y + rh * 0.95, BOXN[b], "start", tk, 'font-weight="800"') + sT(x + 10, y + rh * 1.95, BOXA.filter((_, i) => cur[i] === b).join(", ") || "…", "start", tk * 0.95); });
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Trois boîtes emboîtées : Mâchoires, qui contient Doigts, qui contient Mamelles. ${BOXA.map((a, i) => a + " : " + (cur[i] === undefined ? "à ranger" : "boîte " + BOXN[cur[i]])).join(" ; ")}.">${g}</svg>`;
};

/* ---------- des groupes emboîtés à l'arbre de parenté ---------- */
const TROWS = [["h", "Mâchoires", 1], ["s", "Requin", 1], ["s", "Sardine", 1], ["h", "Doigts", 2], ["s", "Crapaud", 2], ["s", "Crocodile", 2], ["s", "Lézard", 2], ["s", "Mésange", 2], ["s", "Pigeon", 2], ["h", "Mamelles", 3], ["s", "Chat sauvage", 3], ["s", "Homme", 3], ["s", "Gorille", 3]];
const TSP = TROWS.filter(r => r[0] === "s"), INNOV = ["mâchoires", "doigts", "mamelles"];
function treeSVG(W, F, o) {
  const tk = TK(F), rh = Math.max(F * 1.5, 28), top = 6, H = top + rh * TROWS.length + 16, lw = Math.min(W * 0.5, F * 7.8), xL = W - lw, ta = xL - 22, x0 = 8;
  const X = [x0, x0 + ta * 0.3, 0, 0]; X[1] = x0 + ta * 0.34; X[2] = lerp(X[1], x0 + ta * 0.66, o.a2); X[3] = lerp(X[2], x0 + ta * 0.94, o.a3);
  const yr = i => top + rh * (i + 0.5), ys = {}; TROWS.forEach((r, i) => { if (r[0] === "s") ys[r[1]] = yr(i); });
  const NY = [0, 0, 0, (yr(10) + yr(12)) / 2]; NY[2] = (yr(4) + NY[3]) / 2; NY[1] = (yr(1) + NY[2]) / 2; NY[0] = NY[1];
  const col = ["c1", "c2", "c3"], L = `stroke:var(--ink);stroke-width:2.5;fill:none;stroke-linecap:round`; let g = "";
  [1, 2, 3].forEach(b => { const op = o.box[b - 1]; if (op <= 0) return; const first = TROWS.findIndex(r => r[0] === "h" && r[2] === b), ins = (b - 1) * 5; g += `<g style="opacity:${op}"><rect x="${xL - 4 + ins}" y="${top + rh * first + 2}" width="${lw - 2 - ins * 2}" height="${rh * (TROWS.length - first) + 10 - ins}" rx="8" style="fill:var(--${b % 2 ? "surface" : "surface-2"});stroke:var(--${col[b - 1]});stroke-width:2.5"/>` + sT(xL + 4 + ins, yr(first) + tk * 0.35, TROWS[first][1], "start", tk * 0.95, 'font-weight="800"') + `</g>`; });
  const t1 = seg(o.a1, 0, 0.5), l1 = seg(o.a1, 0.5, 1);
  g += `<line x1="${x0}" y1="${NY[1]}" x2="${lerp(x0, X[1], t1)}" y2="${NY[1]}" style="${L}"/>`;
  g += `<g style="opacity:${l1}">`;
  TSP.forEach(([, n, lv]) => { g += `<line x1="${X[lv]}" y1="${ys[n]}" x2="${xL - 8}" y2="${ys[n]}" style="${L}"/>`; });
  g += `<line x1="${X[1]}" y1="${yr(1)}" x2="${X[1]}" y2="${NY[2]}" style="${L}"/><line x1="${X[1]}" y1="${NY[2]}" x2="${X[2]}" y2="${NY[2]}" style="${L}"/><line x1="${X[2]}" y1="${yr(4)}" x2="${X[2]}" y2="${NY[3]}" style="${L}"/><line x1="${X[2]}" y1="${NY[3]}" x2="${X[3]}" y2="${NY[3]}" style="${L}"/><line x1="${X[3]}" y1="${yr(10)}" x2="${X[3]}" y2="${yr(12)}" style="${L}"/></g>`;
  const sel = (o.sel || []).filter(n => ys[n]), lv = n => TSP.find(r => r[1] === n)[2], mr = sel.length === 2 ? Math.min(lv(sel[0]), lv(sel[1])) : 0;
  if (mr) sel.forEach(n => { let k = lv(n), d = `M${xL - 8},${ys[n]} L${X[k]},${ys[n]} L${X[k]},${NY[k]}`; while (k > mr) { d += ` L${X[k - 1]},${NY[k]} L${X[k - 1]},${NY[k - 1]}`; k--; } g += `<path d="${d}" style="fill:none;stroke:var(--accent);stroke-width:7;stroke-linecap:round;stroke-linejoin:round;opacity:.8"/>`; });
  [[1, t1 >= 1 ? 1 : 0, (x0 + X[1]) / 2], [2, seg(o.a2, 0.6, 1), (X[1] + X[2]) / 2], [3, seg(o.a3, 0.6, 1), (X[2] + X[3]) / 2]].forEach(([k, op, mx]) => { if (op <= 0) return;
    g += `<g style="opacity:${op}"><line x1="${mx}" y1="${NY[k] - 8}" x2="${mx}" y2="${NY[k] + 8}" style="stroke:var(--${col[k - 1]});stroke-width:5"/>` + sT(k === 1 ? x0 - 4 : mx, NY[k] + F * 0.62 + tk * 0.95, INNOV[k - 1], k === 1 ? "start" : "middle", tk * 0.82, `font-weight="800" style="fill:var(--${col[k - 1]});paint-order:stroke;stroke:var(--surface);stroke-width:4px"`) + `<circle cx="${X[k]}" cy="${NY[k]}" r="${F * 0.5}" style="fill:var(--${mr === k ? "accent" : "surface"});stroke:var(--ink);stroke-width:2.5"/><text x="${X[k]}" y="${NY[k] + F * 0.24}" text-anchor="middle" style="fill:var(--${mr === k ? "accent-ink" : "ink"});font-size:${N1(F * 0.68)}px;font-weight:800">${k}</text></g>`; });
  TSP.forEach(([, n]) => { g += `<g style="opacity:${Math.max(l1, o.box[0])}">` + sT(xL + 15, ys[n] + tk * 0.35, n, "start", tk * (W < 420 ? 0.88 : 0.95), sel.includes(n) ? 'font-weight="800"' : "") + `</g>`; });
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${o.alt}">${g}</svg>`;
}
const TLEG = `<p class="cap"><b>①, ②, ③</b> : ancêtres communs 1, 2 et 3. Un trait de couleur sur une branche : apparition d'un caractère, transmis à tous les descendants. Arbre construit avec trois caractères seulement.</p>`;
WID.morph = el => {
  el.innerHTML = `<div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div>${TLEG}`;
  let p = 0, last = ""; const fig = liveSVG($(".figbox", el), (W, F) => treeSVG(W, F, { a1: seg(p, 0.06, 0.28), a2: seg(p, 0.44, 0.64), a3: seg(p, 0.78, 0.97), box: [seg(p, 0, 0.06) || (p > 0 ? 1 : 0.0001), seg(p, 0.36, 0.44), seg(p, 0.7, 0.78)], alt: "Animation : les trois boîtes emboîtées deviennent, une à une, les branches d'un arbre de parenté." }));
  animCtl($(".animctl", el), 14000, q => { p = q; fig.draw(); const t = q <= 0 ? "Trois boîtes emboîtées… à convertir en arbre." : q < 0.34 ? "<b>Boîte « Mâchoires »</b> : tous ses animaux ont hérité des mâchoires d'un <b>ancêtre commun 1</b>." : q < 0.68 ? "<b>Boîte « Doigts »</b> : ses animaux ont hérité des doigts d'un <b>ancêtre commun 2</b>, plus récent." : q < 1 ? "<b>Boîte « Mamelles »</b> : ses animaux ont hérité des mamelles d'un <b>ancêtre commun 3</b>, encore plus récent." : "Chaque boîte est devenue une branche : un groupe emboîté correspond à un ancêtre commun et à tous ses descendants."; if (t !== last) { last = t; $(".readout", el).innerHTML = t; } });
};
WID.arbre = el => {
  let sel = [];
  el.innerHTML = `<p class="lead">Touche <b>deux espèces</b> : le chemin qui les relie à leur dernier ancêtre commun s'affiche sur l'arbre.</p><div class="chips">${TSP.map(r => `<button type="button" class="chipb" data-n="${r[1]}" aria-pressed="false">${r[1]}</button>`).join("")}</div><div class="figbox"></div><p class="readout" aria-live="polite"></p>${TLEG}`;
  const fig = liveSVG($(".figbox", el), (W, F) => treeSVG(W, F, { a1: 1, a2: 1, a3: 1, box: [1, 1, 1], sel, alt: "Arbre de parenté. Ancêtre commun 1 (mâchoires) : Requin, Sardine et tous les suivants. Ancêtre commun 2 (doigts) : Crapaud, Crocodile, Lézard, Mésange, Pigeon et les suivants. Ancêtre commun 3 (mamelles) : Chat sauvage, Homme, Gorille." }));
  const upd = () => { $$("[data-n]", el).forEach(b => b.setAttribute("aria-pressed", sel.includes(b.dataset.n) ? "true" : "false")); fig.draw(); const lv = n => TSP.find(r => r[1] === n)[2]; $(".readout", el).innerHTML = sel.length < 2 ? (sel.length ? `<b>${sel[0]}</b> sélectionné : touche une deuxième espèce.` : "Aucune espèce sélectionnée.") : `Dernier ancêtre commun de <b>${sel[0]}</b> et <b>${sel[1]}</b> : <b>ancêtre commun ${Math.min(lv(sel[0]), lv(sel[1]))}</b>.`; };
  $$("[data-n]", el).forEach(b => b.onclick = () => { const n = b.dataset.n, i = sel.indexOf(n); if (i >= 0) sel.splice(i, 1); else { sel.push(n); if (sel.length > 2) sel.shift(); } upd(); }); upd();
};

/* ---------- biodiversité génétique : portraits ---------- */
const P_Y = [["bleus", "#4b86c8"], ["verts", "#4f9a5b"], ["noisette", "#a5743a"], ["marron", "#5b381f"]], P_C = [["blonds", "#e2c168"], ["roux", "#c2612b"], ["bruns", "#6a4424"], ["noirs", "#1e1b19"]], P_T = ["raides", "ondulés", "frisés"], P_G = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "inconnu"];
const PF = [["y", "Couleur des yeux", P_Y.map(x => x[0])], ["c", "Couleur des cheveux", P_C.map(x => x[0])], ["t", "Texture des cheveux", P_T], ["g", "Groupe sanguin", P_G]];
function face(x, y, r, o) {
  const hc = o.c === undefined ? null : P_C[o.c][1], ec = o.y === undefined ? "var(--line)" : P_Y[o.y][1], st = "stroke:var(--ink);stroke-width:1.6", hs = hc ? `fill:${hc};${st}` : `fill:none;stroke:var(--muted);stroke-width:1.6;stroke-dasharray:4 3`; let g = "";
  if (hc && o.t === 0) g += `<path d="M${x - r * 1.02},${y + r * 0.95} L${x - r * 1.02},${y - r * 0.1} A${r * 1.02},${r * 1.02} 0 0 1 ${x + r * 1.02},${y - r * 0.1} L${x + r * 1.02},${y + r * 0.95} L${x + r * 0.6},${y + r * 0.95} L${x + r * 0.6},${y} L${x - r * 0.6},${y} L${x - r * 0.6},${y + r * 0.95}Z" style="${hs}"/>`;
  if (hc && o.t === 1) [-1, 1].forEach(sd => { let d = `M${x + sd * r * 0.86},${y - r * 0.2}`; for (let i = 0; i < 4; i++) d += ` q${sd * (i % 2 ? -1 : 1) * r * 0.32},${r * 0.15} 0,${r * 0.3}`; g += `<path d="${d}" style="fill:none;stroke:${hc};stroke-width:${r * 0.36};stroke-linecap:round"/>`; });
  if (hc && o.t === 2) for (let a = 170; a <= 370; a += 20) { const q = a * Math.PI / 180; g += `<circle cx="${N1(x + Math.cos(q) * r * 0.92)}" cy="${N1(y + Math.sin(q) * r * 0.92)}" r="${N1(r * 0.3)}" style="${hs}"/>`; }
  g += `<circle cx="${x}" cy="${y}" r="${r * 0.82}" style="fill:var(--surface);${st}"/>`;
  g += `<path d="M${x - r * 0.8},${y - r * 0.18} A${r * 0.82},${r * 0.82} 0 0 1 ${x + r * 0.8},${y - r * 0.18} Q${x},${y - r * (o.t === 2 ? 0.75 : 0.5)} ${x - r * 0.8},${y - r * 0.18}Z" style="${hs}"/>`;
  [-1, 1].forEach(sd => { g += `<ellipse cx="${x + sd * r * 0.3}" cy="${y + r * 0.08}" rx="${r * 0.17}" ry="${r * 0.13}" style="fill:#fff;${st}"/><circle cx="${x + sd * r * 0.3}" cy="${y + r * 0.08}" r="${r * 0.1}" style="fill:${ec}"/><circle cx="${x + sd * r * 0.3}" cy="${y + r * 0.08}" r="${r * 0.04}" style="fill:#111"/>`; });
  return g + `<path d="M${x - r * 0.25},${y + r * 0.42} Q${x},${y + r * 0.62} ${x + r * 0.25},${y + r * 0.42}" style="fill:none;${st};stroke-linecap:round"/>`;
}
const porCount = () => S.por.reduce((n, o) => n + PF.filter(f => o[f[0]] !== undefined).length, 0);
const porRows = () => PF.map(f => [f[1], ...S.por.map(o => o[f[0]] === undefined ? "—" : f[2][o[f[0]]])]);
WID.portraits = el => {
  let cur = 0;
  el.innerHTML = `<p class="lead">Pense à trois personnes de ton entourage (amis, famille). Pour chacune, choisis ses caractères : le portrait et le tableau se construisent. Aucun nom n'est demandé ; si tu ne connais pas un groupe sanguin, choisis « inconnu ».</p>
    <div class="seg" role="group" aria-label="Personne décrite">${[1, 2, 3].map(i => `<button type="button" data-p="${i - 1}">Personne ${i}</button>`).join("")}</div><div class="figbox"></div><div class="pfs"></div><div class="res"></div>`;
  const fig = liveSVG($(".figbox", el), (W, F) => { const tk = TK(F), cw = W / 3, r = Math.min(cw * 0.3, F * 2.6), H = r * 2.5 + tk * 3.4; let g = ""; S.por.forEach((o, i) => { const cx = cw * (i + 0.5), cy = r * 1.3; if (i === cur) g += `<rect x="${cw * i + 3}" y="2" width="${cw - 6}" height="${H - 4}" rx="12" style="fill:var(--accent-soft);stroke:var(--accent);stroke-width:2"/>`; g += face(cx, cy, r, o) + sT(cx, r * 2.5 + tk * 1.1, "Personne " + (i + 1), "middle", tk, 'font-weight="800"') + sT(cx, r * 2.5 + tk * 2.4, o.g === undefined ? "groupe : —" : o.g === 8 ? "groupe inconnu" : "groupe " + P_G[o.g], "middle", tk * 0.9); }); return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Portraits des trois personnes décrites ; leurs caractères sont repris dans le tableau sous le dessin.">${g}</svg>`; });
  const paint = () => {
    $$("[data-p]", el).forEach(b => b.setAttribute("aria-pressed", +b.dataset.p === cur ? "true" : "false"));
    $(".pfs", el).innerHTML = PF.map(f => `<div class="pf"><span class="lab3">${f[1]}</span><div class="seg" role="group" aria-label="${f[1]}, personne ${cur + 1}">${f[2].map((v, j) => `<button type="button" data-k="${f[0]}" data-j="${j}" aria-pressed="${S.por[cur][f[0]] === j}">${v}</button>`).join("")}</div></div>`).join("");
    $$("[data-k]", el).forEach(b => b.onclick = () => { S.por[cur][b.dataset.k] = +b.dataset.j; keep(); paint(); const n = $(`[data-k="${b.dataset.k}"][data-j="${b.dataset.j}"]`, el); if (n) n.focus(); });
    fig.draw(); $(".res", el).innerHTML = `<p class="lead"><b>Mon tableau</b> : ${porCount()}/12 cases remplies.</p>` + tbl(["Caractère", "Personne 1", "Personne 2", "Personne 3"], porRows());
  };
  $$("[data-p]", el).forEach(b => b.onclick = () => { cur = +b.dataset.p; paint(); }); paint();
};
WID.classe = el => {
  let pop = [], t0 = 0;
  el.innerHTML = `<p class="lead">Avec seulement ces quatre caractères, combien de portraits différents peut-on obtenir ? Tire une classe de 24 élèves au hasard.</p><div class="row"><button type="button" class="btn" data-draw>🎲 Tirer une classe au hasard</button></div><div class="figbox"></div><p class="readout" aria-live="polite"></p><p class="cap">Modèle simplifié : chaque version d'un caractère a ici la même chance d'être tirée, ce qui n'est pas le cas dans une vraie population.</p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => { const cols = W < 520 ? 4 : W < 760 ? 6 : 8, rows = Math.ceil(24 / cols), cw = W / cols, r = Math.min(cw * 0.36, F * 1.6), rh = r * 2.3 + TK(F) * 1.5, q = t0 ? (performance.now() - t0) / 1500 : 1; let g = ""; pop.forEach((o, i) => { const a = seg(q, i / 30, i / 30 + 0.2); if (a <= 0) return; const cx = cw * (i % cols + 0.5), cy = rh * Math.floor(i / cols) + r * 1.15; g += `<g style="opacity:${a}">` + face(cx, cy, r * (0.6 + 0.4 * a), o) + sT(cx, cy + r * 1.15 + TK(F) * 0.9, P_G[o.g], "middle", TK(F) * 0.85, 'font-weight="700"') + `</g>`; }); return `<svg viewBox="0 0 ${W} ${Math.max(rows * rh, F * 2)}" width="${W}" height="${Math.max(rows * rh, F * 2)}" role="img" aria-label="Vingt-quatre portraits tirés au hasard ; le nombre de portraits différents est écrit sous le dessin.">${g}</svg>`; });
  const loop = () => { if (!document.body.contains(el)) return; fig.draw(); if (performance.now() - t0 < 1900) requestAnimationFrame(loop); else { t0 = 0; fig.draw(); } };
  $("[data-draw]", el).onclick = () => { const rnd = n => Math.floor(Math.random() * n); pop = Array.from({ length: 24 }, () => ({ y: rnd(4), c: rnd(4), t: rnd(3), g: rnd(8) })); t0 = performance.now(); requestAnimationFrame(loop); const n = new Set(pop.map(o => [o.y, o.c, o.t, o.g].join("-"))).size; $(".readout", el).innerHTML = `24 élèves tirés au hasard : <b>${n} portraits différents</b>. Avec ces quatre caractères seulement, il existe 4 × 4 × 3 × 8 = <b>384 combinaisons</b> possibles.`; };
  $(".readout", el).innerHTML = "Touche le bouton pour tirer une classe.";
};

/* ---------- TP virtuel : explorer deux écosystèmes ---------- */
const ECO = {
  lac: { name: "Lac", btn: "🏞 Lac", type: "aquatique", cond: { t: ["Température de l'eau", 16, "°C", 40], l: ["Luminosité à 1 m sous la surface", 20000, "lux", 100000], h: ["Humidité de l'air au-dessus de l'eau", 75, "%", 100] },
    sp: [["canard", "🦆", "Canard colvert", "oiseau", 0.28, 0.335, "float", 1], ["cygne", "🦢", "Cygne tuberculé", "oiseau", 0.66, 0.32, "float", 1.15], ["gren", "🐸", "Grenouille verte", "amphibien", 0.47, 0.375, "hop", 0.85], ["perche", "🐟", "Perche", "poisson", 0.5, 0.63, "swim", 1], ["limnee", "🐌", "Limnée", "mollusque (escargot d'eau douce)", 0.26, 0.875, "walk", 0.8], ["ecrev", "🦞", "Écrevisse", "crustacé", 0.74, 0.87, "walk", 0.9], ["moust", "🦟", "Moustique", "insecte", 0.2, 0.15, "fly", 0.75], ["roseau", "🌾", "Roseau", "plante à fleurs", 0.92, 0.33, "sway", 1.5]] },
  foret: { name: "Forêt", btn: "🌲 Forêt", type: "terrestre", cond: { t: ["Température de l'air", 18, "°C", 40], l: ["Luminosité dans le sous-bois", 2000, "lux", 100000], h: ["Humidité de l'air", 85, "%", 100] },
    sp: [["chene", "🌳", "Chêne pédonculé", "plante à fleurs (arbre)", 0.22, 0.47, "sway", 3.1], ["chouette", "🦉", "Chouette hulotte", "oiseau", 0.62, 0.22, "still", 1], ["ecur", "🐿️", "Écureuil roux", "mammifère", 0.86, 0.45, "climb", 0.9], ["cerf", "🦌", "Cerf élaphe", "mammifère", 0.5, 0.68, "walk", 1.35], ["renard", "🦊", "Renard roux", "mammifère", 0.82, 0.78, "walk", 1], ["fougere", "🌿", "Fougère aigle", "fougère", 0.1, 0.85, "sway", 1.2], ["amanite", "🍄", "Amanite tue-mouches", "champignon", 0.3, 0.87, "still", 0.9], ["fourmi", "🐜", "Fourmi rousse", "insecte", 0.6, 0.95, "walk", 0.7]] },
  champ: { name: "Champ", btn: "🌾 Champ", type: "terrestre", cond: { t: ["Température de l'air", 25, "°C", 40], l: ["Luminosité en plein soleil", 80000, "lux", 100000], h: ["Humidité de l'air", 45, "%", 100] },
    sp: [["ble", "🌾", "Blé tendre", "plante à fleurs", 0.13, 0.62, "sway", 1.6], ["tournesol", "🌻", "Tournesol", "plante à fleurs", 0.87, 0.57, "sway", 1.7], ["lapin", "🐇", "Lapin de garenne", "mammifère", 0.35, 0.8, "hop", 1], ["abeille", "🐝", "Abeille domestique", "insecte", 0.62, 0.38, "fly", 0.75], ["cocci", "🐞", "Coccinelle à sept points", "insecte", 0.7, 0.92, "walk", 0.7], ["papillon", "🦋", "Piéride du chou", "insecte (papillon)", 0.3, 0.28, "fly", 0.85], ["campa", "🐁", "Campagnol des champs", "mammifère", 0.5, 0.93, "walk", 0.8], ["saut", "🦗", "Grande sauterelle verte", "insecte", 0.88, 0.86, "hop", 0.8]] }
};
const SENS = [["t", "🌡 Thermomètre"], ["l", "☀ Luxmètre"], ["h", "💧 Hygromètre"]];
const ecoSt = k => { if (!S.eco[k]) S.eco[k] = { m: {}, sp: {} }; return S.eco[k]; };
const ecoN = k => { const e = S.eco[k] || { m: {}, sp: {} }; return [Object.keys(e.m).length, Object.keys(e.sp).length]; };
const ecoOk = k => { const [a, b] = ecoN(k); return a === 3 && b >= 5; };
const ecoSeen = () => Object.keys(ECO).filter(k => { const [a, b] = ecoN(k); return a + b > 0; });
const ecoVal = (k, c) => (S.eco[k] && S.eco[k].m[c]) ? fmt(ECO[k].cond[c][1]) + NB + ECO[k].cond[c][2] : "—";
const ecoRows = ks => [["Type de milieu", ...ks.map(k => ECO[k].type)], ["Température", ...ks.map(k => ecoVal(k, "t"))], ["Luminosité", ...ks.map(k => ecoVal(k, "l"))], ["Humidité de l'air", ...ks.map(k => ecoVal(k, "h"))], ["Espèces identifiées", ...ks.map(k => ECO[k].sp.filter(s => S.eco[k].sp[s[0]]).map(s => s[2]).join(", ") || "—")]];
function ecoDone() { const terr = ["foret", "champ"].find(ecoOk), part = k => { const [a, b] = ecoN(k); return `${ECO[k].name} : ${a}/3 mesures, ${Math.min(b, 5)}/5 espèces`; }; const best = terr || (ecoN("champ")[0] + ecoN("champ")[1] > ecoN("foret")[0] + ecoN("foret")[1] ? "champ" : "foret"); return { ok: ecoOk("lac") && !!terr, msg: `${part("lac")} · ${part(best)}${best === "foret" && !terr ? " (ou le champ)" : ""}.` }; }
function ecoBg(k, W, H) {
  if (k === "lac") return `<rect width="${W}" height="${H * 0.37}" style="fill:#cfe8f6"/><ellipse cx="${W * 0.3}" cy="${H * 0.37}" rx="${W * 0.5}" ry="${H * 0.09}" style="fill:#7fae6e"/><ellipse cx="${W * 0.85}" cy="${H * 0.37}" rx="${W * 0.35}" ry="${H * 0.07}" style="fill:#6b9c5f"/><rect y="${H * 0.37}" width="${W}" height="${H * 0.63}" style="fill:#4f93c4"/><rect y="${H * 0.62}" width="${W}" height="${H * 0.38}" style="fill:#3f7fb0"/><path d="M0,${H} L0,${H * 0.93} Q${W * 0.3},${H * 0.88} ${W * 0.55},${H * 0.94} T${W},${H * 0.91} L${W},${H}Z" style="fill:#8a7453"/><ellipse cx="${W * 0.47}" cy="${H * 0.41}" rx="${W * 0.06}" ry="${H * 0.014}" style="fill:#4d9a57"/><ellipse cx="${W * 0.58}" cy="${H * 0.43}" rx="${W * 0.04}" ry="${H * 0.011}" style="fill:#5aa864"/><path d="M0,${H * 0.375} H${W}" style="stroke:#fff;stroke-width:2;opacity:.6"/>`;
  if (k === "foret") { let g = `<rect width="${W}" height="${H}" style="fill:#3d6b47"/><ellipse cx="${W * 0.5}" cy="${H * 0.55}" rx="${W * 0.4}" ry="${H * 0.3}" style="fill:#5c8f5f;opacity:.55"/><rect y="${H * 0.82}" width="${W}" height="${H * 0.18}" style="fill:#6b5335"/>`; [[0.62, 0.05], [0.86, 0.045], [0.04, 0.04]].forEach(([x, w]) => { g += `<rect x="${W * (x - w / 2)}" y="0" width="${W * w}" height="${H * 0.84}" style="fill:#5b3f28"/>`; }); g += `<path d="M${W * 0.62},${H * 0.3} L${W * 0.74},${H * 0.26}" style="stroke:#5b3f28;stroke-width:${H * 0.022}"/>`; for (let i = 0; i < 9; i++) g += `<circle cx="${W * (i / 8)}" cy="${H * (i % 2 ? 0.02 : 0.06)}" r="${W * 0.1}" style="fill:${i % 2 ? "#2f5a3a" : "#356641"}"/>`; return g; }
  let g = `<rect width="${W}" height="${H * 0.56}" style="fill:#bfe1f5"/><circle cx="${W * 0.85}" cy="${H * 0.15}" r="${H * 0.07}" style="fill:#f7d046"/><rect y="${H * 0.52}" width="${W}" height="${H * 0.06}" style="fill:#86b56a"/><rect y="${H * 0.56}" width="${W}" height="${H * 0.44}" style="fill:#d9c36a"/>`; for (let i = 0; i < 28; i++) g += `<path d="M${W * (i + 0.5) / 28},${H * (0.6 + (i % 3) * 0.035)} v${H * 0.09}" style="stroke:#b8982f;stroke-width:2"/>`; return g;
}
WID.eco = el => {
  let cur = S.eco.cur && ECO[S.eco.cur] ? S.eco.cur : "lac", paused = false, clock = 0, lt = 0, sens = null, pick = "", lastId = "";
  try { paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  el.innerHTML = `<p class="lead">Explore le <b>lac</b> et <b>un milieu terrestre</b> au choix (forêt ou champ). Dans chacun : fais les <b>trois mesures</b>, puis touche les êtres vivants pour en identifier <b>au moins cinq</b>. Ton tableau se construit sous le paysage.</p>
    <div class="seg" role="group" aria-label="Milieu exploré">${Object.keys(ECO).map(k => `<button type="button" data-e="${k}">${ECO[k].btn} <span class="muted">(${ECO[k].type})</span></button>`).join("")}</div>
    <div class="pilot">${SENS.map(([k, n]) => `<button type="button" class="btn" data-sn="${k}">${n}</button>`).join("")}<button type="button" class="btn ghost" data-pause></button></div>
    <div class="sensors"></div><div class="figbox scene"></div><p class="readout" aria-live="polite"></p><div class="res"></div>`;
  const host = $(".scene", el);
  const pos = (s, t, W, H) => { const ph = s[4] * 17, bx = s[4] * W, by = s[5] * H, mv = s[6]; let x = bx, y = by, flip = false, rot = 0;
    if (mv === "float") { x += Math.sin(t * 0.25 + ph) * W * 0.06; y += Math.sin(t * 1.3 + ph) * 2.5; flip = Math.cos(t * 0.25 + ph) > 0; }
    if (mv === "swim") { x += Math.sin(t * 0.35 + ph) * W * 0.3; y += Math.sin(t * 0.9 + ph) * H * 0.03; flip = Math.cos(t * 0.35 + ph) > 0; }
    if (mv === "fly") { x += Math.sin(t * 0.7 + ph) * W * 0.09; y += Math.sin(t * 1.9 + ph) * H * 0.05; flip = Math.cos(t * 0.7 + ph) > 0; }
    if (mv === "hop") y -= Math.pow(Math.max(0, Math.sin(t * 1.3 + ph)), 6) * H * 0.07;
    if (mv === "walk") { x += Math.sin(t * 0.22 + ph) * W * 0.1; flip = Math.cos(t * 0.22 + ph) > 0; }
    if (mv === "climb") y += Math.sin(t * 0.4 + ph) * H * 0.14;
    if (mv === "sway") rot = Math.sin(t * 0.8 + ph) * 4;
    return { x, y, flip, rot }; };
  const fig = liveSVG(host, (W, F) => { const small = W < 480, H = small ? W * 1.15 : Math.max(F * 13, Math.min(W * 0.62, F * 21)), tk = TK(F), e = ECO[cur], st = ecoSt(cur); let g = `<clipPath id="ecoclip"><rect width="${W}" height="${H}" rx="12"/></clipPath><g clip-path="url(#ecoclip)">${ecoBg(cur, W, H)}</g>`;
    e.sp.forEach(s => { const es = F * 1.75 * s[7], hr = Math.max(26, Math.min(es * 0.6, F * 2)), found = !!st.sp[s[0]], P = pos(s, clock, W, H);
      g += `<g class="ecosp" data-id="${s[0]}" tabindex="0" role="button" aria-label="${found ? s[2] + ", " + s[3] + ", identifié" : "Être vivant à identifier"}" transform="translate(${N1(P.x)},${N1(P.y)})"><circle r="${N1(hr)}" class="hit"/><g class="em"><text text-anchor="middle" y="${N1(es * 0.35)}" style="font-size:${N1(es)}px">${s[1]}</text></g>${found ? ((!small || lastId === s[0]) ? `<text text-anchor="${s[4] < 0.25 ? "start" : s[4] > 0.75 ? "end" : "middle"}" x="${s[4] < 0.25 ? N1(-hr) : s[4] > 0.75 ? N1(hr) : 0}" y="${N1(es * 0.35 + tk * 1.05)}" style="font-size:${N1(tk * 0.82)}px;font-weight:800;fill:#14251a;paint-order:stroke;stroke:#fff;stroke-width:4px">✓ ${esc(s[2])}</text>` : `<g transform="translate(${N1(Math.min(hr, es * 0.5))},${N1(-Math.min(hr, es * 0.45))})"><circle r="11" style="fill:#17703d;stroke:#fff;stroke-width:1.5"/><text text-anchor="middle" y="5" style="font-size:15px;font-weight:800;fill:#fff">✓</text></g>`) : `<g transform="translate(${N1(Math.min(hr, es * 0.5))},${N1(-Math.min(hr, es * 0.45))})"><circle r="11" style="fill:#fff;stroke:#14251a;stroke-width:1.5"/><text text-anchor="middle" y="5" style="font-size:15px;font-weight:800;fill:#14251a">?</text></g>`}</g>`; });
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="group" aria-label="Paysage : ${e.name}. Touche les êtres vivants pour les identifier.">${g}</svg>`; });
  const place = () => { const svg = host.firstElementChild; if (!svg) return; const W = +svg.getAttribute("width"), H = +svg.getAttribute("height"); ECO[cur].sp.forEach(s => { const n = svg.querySelector(`[data-id="${s[0]}"]`); if (!n) return; const P = pos(s, clock, W, H); n.setAttribute("transform", `translate(${N1(P.x)},${N1(P.y)})`); n.querySelector(".em").setAttribute("transform", `scale(${P.flip ? -1 : 1},1) rotate(${N1(P.rot)})`); }); };
  const sensors = () => { const e = ECO[cur], st = ecoSt(cur); $(".sensors", el).innerHTML = SENS.map(([k]) => { const c = e.cond[k], run = sens && sens.k === k, q = run ? Math.min(1, (performance.now() - sens.t0) / 900) : 1, on = st.m[k] || run, v = on ? c[1] * (run ? 1 - Math.pow(1 - q, 3) : 1) : 0; return `<div class="sens"><span class="sn">${c[0]}</span><b class="sv">${on ? fmt(k === "l" ? Math.round(v / 100) * 100 : Math.round(v)) + NB + c[2] : "—"}</b><div class="gauge" aria-hidden="true"><i style="width:${on ? Math.max(2, v / c[3] * 100) : 0}%"></i></div></div>`; }).join(""); };
  const table = () => { const ks = ecoSeen(), [a, b] = ecoN(cur); $(".res", el).innerHTML = `<p class="lead"><b>${ECO[cur].name}</b> : ${a}/3 mesures · ${b}/8 espèces identifiées (au moins 5).</p>` + (ks.length ? `<p class="lead"><b>Mon tableau</b></p>` + tbl(["", ...ks.map(k => ECO[k].name)], ecoRows(ks)) : ""); };
  const paint = () => { $$("[data-e]", el).forEach(b => b.setAttribute("aria-pressed", b.dataset.e === cur ? "true" : "false")); $("[data-pause]", el).textContent = paused ? "▶ Reprendre l'animation" : "⏸ Pause"; fig.draw(); place(); sensors(); table(); };
  const say = t => { $(".readout", el).innerHTML = t; };
  const ident = id => { const s = ECO[cur].sp.find(x => x[0] === id); if (!s) return; ecoSt(cur).sp[id] = 1; lastId = id; keep(); say(`${s[1]} <b>${s[2]}</b> · ${s[3]} · milieu : ${ECO[cur].name.toLowerCase()}.`); fig.draw(); place(); table(); const n = host.querySelector(`[data-id="${id}"]`); if (n && pick === "key") n.focus(); };
  host.addEventListener("click", ev => { const n = ev.target.closest("[data-id]"); if (n) { pick = "tap"; ident(n.dataset.id); } });
  host.addEventListener("keydown", ev => { if (ev.key !== "Enter" && ev.key !== " ") return; const n = ev.target.closest("[data-id]"); if (n) { ev.preventDefault(); pick = "key"; ident(n.dataset.id); } });
  $$("[data-e]", el).forEach(b => b.onclick = () => { cur = b.dataset.e; S.eco.cur = cur; sens = null; keep(); paint(); say(`Tu es dans le milieu « ${ECO[cur].name} » (${ECO[cur].type}).`); });
  $$("[data-sn]", el).forEach(b => b.onclick = () => { const k = b.dataset.sn, c = ECO[cur].cond[k]; sens = { k, t0: performance.now() }; ecoSt(cur).m[k] = 1; keep(); say(`${c[0]} : <b>${fmt(c[1])}${NB}${c[2]}</b>.`); table(); });
  $("[data-pause]", el).onclick = () => { paused = !paused; $("[data-pause]", el).textContent = paused ? "▶ Reprendre l'animation" : "⏸ Pause"; };
  const loop = ts => { if (!document.body.contains(el)) return; const dt = lt ? Math.min(100, ts - lt) : 0; lt = ts; if (!paused) { clock += dt / 1000; place(); } if (sens) { sensors(); if (performance.now() - sens.t0 > 900) { sens = null; sensors(); } } requestAnimationFrame(loop); };
  paint(); say(`Tu es dans le milieu « ${ECO[cur].name} » (${ECO[cur].type}).`); requestAnimationFrame(loop);
};

/* ---------- animation finale : le zoom sur les trois échelles ---------- */
WID.zoom = el => {
  el.innerHTML = `<div class="row animctl"></div><p class="readout" aria-live="polite"></p><div class="figbox"></div>`;
  let p = 0, last = ""; const TXT = ["<b>① Diversité des écosystèmes</b> : des milieux de vie aux conditions différentes.", "<b>② Diversité des espèces</b> : dans un même milieu vivent de nombreuses espèces.", "<b>③ Diversité génétique</b> : au sein d'une même espèce, les individus sont différents."];
  const fig = liveSVG($(".figbox", el), (W, F) => { const H = Math.max(F * 11, Math.min(W * 0.5, F * 15)), tk = TK(F), st = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2, q = seg(p, st / 3, (st + 1) / 3), fade = Math.min(1, q * 6) * (st < 2 ? 1 - seg(q, 0.9, 1) : 1); let g = "";
    if (st === 0) { [["#4f93c4", "🏞", "Lac"], ["#3d6b47", "🌲", "Forêt"], ["#d9c36a", "🌾", "Champ"]].forEach(([c, e, n], i) => { const a = seg(q, i * 0.15, i * 0.15 + 0.2), w = W * 0.29, x = W * 0.04 + i * W * 0.315; g += `<g style="opacity:${a}"><rect x="${x}" y="${F * 1.2}" width="${w}" height="${H - F * 4}" rx="12" style="fill:${c};stroke:var(--ink);stroke-width:2"/><text x="${x + w / 2}" y="${H * 0.5}" text-anchor="middle" style="font-size:${N1(Math.min(w * 0.5, F * 3.4))}px">${e}</text>` + sT(x + w / 2, H - F * 1.6, n, "middle", tk, 'font-weight="800"') + `</g>`; }); if (q > 0.7) g += `<rect x="${W * 0.04 - 4}" y="${F * 1.2 - 4}" width="${W * 0.29 + 8}" height="${H - F * 4 + 8}" rx="14" style="fill:none;stroke:var(--c2);stroke-width:4;stroke-dasharray:8 6;opacity:${seg(q, 0.7, 0.8)}"/>`; }
    if (st === 1) { g += `<rect x="4" y="${F * 1.2}" width="${W - 8}" height="${H - F * 2.4}" rx="12" style="fill:#4f93c4;stroke:var(--ink);stroke-width:2"/>`; ["🦆", "🦢", "🐸", "🐟", "🐌", "🦞", "🦟", "🌾"].forEach((e, i) => { const a = seg(q, 0.08 + i * 0.08, 0.16 + i * 0.08); g += `<text x="${W * (0.14 + (i % 4) * 0.24)}" y="${H * (0.42 + Math.floor(i / 4) * 0.32) + Math.sin(p * 40 + i) * 3}" text-anchor="middle" style="font-size:${N1(F * 2.2 * (0.5 + 0.5 * a))}px;opacity:${a}">${e}</text>`; }); if (q > 0.8) g += `<circle cx="${W * 0.14}" cy="${H * 0.42 - F * 0.7}" r="${F * 1.7}" style="fill:none;stroke:var(--c2);stroke-width:4;stroke-dasharray:8 6;opacity:${seg(q, 0.8, 0.88)}"/>`; }
    if (st === 2) { g += `<rect x="4" y="${F * 1.2}" width="${W - 8}" height="${H - F * 2.4}" rx="12" style="fill:var(--sea);opacity:.28"/>`; const s = Math.min(F * 3, W * 0.16); ["A", "D", "B", "A", "D", "B"].forEach((k, i) => { const a = seg(q, 0.05 + i * 0.1, 0.15 + i * 0.1); g += duck(k, W * (0.17 + (i % 3) * 0.33), H * (0.42 + Math.floor(i / 3) * 0.34), s * (i > 2 ? 0.85 : 1), i % 2 ? -1 : 1, "", a); }); }
    g = `<g style="opacity:${p <= 0 ? 1 : Math.max(0.05, fade)}">${g}</g>` + sT(8, tk * 1.05, ["① Écosystèmes", "② Espèces", "③ Individus d'une même espèce"][st], "start", tk, 'font-weight="800"');
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Zoom en trois temps : trois écosystèmes, puis les espèces d'un lac, puis des individus différents d'une même espèce de canard.">${g}</svg>`; });
  animCtl($(".animctl", el), 13000, x => { p = x; fig.draw(); const t = x <= 0 ? "Un zoom en trois temps sur la biodiversité." : TXT[x < 1 / 3 ? 0 : x < 2 / 3 ? 1 : 2] + (x >= 1 ? " La biodiversité, c'est tout cela à la fois." : ""); if (t !== last) { last = t; $(".readout", el).innerHTML = t; } });
};
