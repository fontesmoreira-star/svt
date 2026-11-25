/* ===== 2nde SVT · Thème 1 · Chapitre 3 · Activité 2 · L'évolution de la biodiversité au cours du temps : animations et TP virtuels =====
   Frise des temps géologiques, machine à remonter le temps (inspirée du logiciel « Écosystèmes ») avec quatre écosystèmes dessinés,
   loupe binoculaire sur deux sables (foraminifères du Maastrichtien et du Danien), données de la limite K/T en temps réel (carotte),
   courbe du nombre de familles marines sur 540 Ma, causes de l'érosion de la biodiversité, Amazonie comparée au Luxembourg,
   sélection de la téosinte au maïs. Valeurs simulées ou approchées, toujours signalées ⚠. */
Store.key = "svt2-biodiversite-temps-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const N1 = x => (+x).toFixed(1);
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const sg = (p, a, b) => cl((p - a) / (b - a), 0, 1);
const ez = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const LP = (a, b, t) => a + (b - a) * t;
const RMO = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
const rnd = seed => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
const s14 = F => Math.max(15, TK(F) * .9);
function tx(x, y, s, o) {
  o = o || {};
  const halo = o.h ? `;paint-order:stroke;stroke:${o.hc || "var(--surface)"};stroke-width:${N1(o.s * .3)}px;stroke-linejoin:round` : "";
  return `<text x="${N1(x)}" y="${N1(y)}" text-anchor="${o.a || "middle"}" style="fill:${o.c || "var(--ink)"};font-size:${N1(o.s)}px;font-weight:${o.w || 700}${o.op !== undefined ? ";opacity:" + N1(o.op) : ""}${halo}">${esc(s)}</text>`;
}
const segH = (name, opts, cur, attr) => `<div class="seg" role="group" aria-label="${name}">${opts.map(([k, lab]) => `<button type="button" data-${attr}="${k}" aria-pressed="${k === cur}">${lab}</button>`).join("")}</div>`;
function bindSeg(host, attr, fn) { $$(`[data-${attr}]`, host).forEach(b => b.onclick = () => { $$(`[data-${attr}]`, host).forEach(c => c.setAttribute("aria-pressed", String(c === b))); fn(b.dataset[attr]); }); }
const svgW = (W, H, label, g, vb) => `<svg viewBox="${vb || `0 0 ${N1(W)} ${N1(H)}`}" width="${N1(W)}" height="${N1(H)}" role="img" aria-label="${esc(label)}">${g}</svg>`;
const ico = (inner, w, h) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">${inner}</svg>`;
/* animation courte (transition) sans commande : t de 0 à 1 */
function tween(ms, onT, done) { if (RMO) { onT(1); if (done) done(); return; } let t0 = 0; const f = ts => { if (!t0) t0 = ts; const t = Math.min(1, (ts - t0) / ms); onT(t); if (t < 1) requestAnimationFrame(f); else if (done) done(); }; requestAnimationFrame(f); }
/* repère numéroté (r en unités du dessin) */
const pinV = (x, y, n, r) => `<circle cx="${N1(x)}" cy="${N1(y)}" r="${N1(r)}" style="fill:#fff;stroke:#1a1a1a;stroke-width:${N1(r * .14)}"/><text x="${N1(x)}" y="${N1(y + r * .42)}" text-anchor="middle" style="fill:#1a1a1a;font-size:${N1(r * 1.2)}px;font-weight:800">${n}</text>`;

/* =====================================================================
   Les temps géologiques (périodes, en Ma ; couleurs proches de l'échelle internationale)
   ===================================================================== */
const PER = [["Cambrien", 539, 485, "#7fa056"], ["Ordovicien", 485, 444, "#2aa486"], ["Silurien", 444, 419, "#a8dcb5"], ["Dévonien", 419, 359, "#cb8c37"], ["Carbonifère", 359, 299, "#67a599"], ["Permien", 299, 252, "#f04028"],
  ["Trias", 252, 201, "#9a4fa6"], ["Jurassique", 201, 145, "#34b2c9"], ["Crétacé", 145, 66, "#7fc64e"], ["Paléogène", 66, 23, "#fd9a52"], ["Néogène", 23, 2.6, "#ffe619"], ["Quaternaire", 2.6, 0, "#f9f97f"]];
const ERA = [["Paléozoïque (ère primaire)", 539, 252], ["Mésozoïque (ère secondaire)", 252, 66], ["Cénozoïque", 66, 0]];
function friseSVG(W, F, o) {
  o = o || {};
  const tk = TK(F), L = 8, R = 8, pw = W - L - R, X = t => L + (539 - t) / 539 * pw, top = o.compact ? 4 : tk * 1.6, eh = o.compact ? 0 : tk * 1.5, ph = o.compact ? F * 1.5 : F * 2.2, H = top + eh + ph + (o.compact ? tk * 1.2 : tk * 3.4);
  let g = "";
  if (!o.compact) ERA.forEach(([n, a, b], i) => { g += `<rect x="${N1(X(a))}" y="${N1(top)}" width="${N1(X(b) - X(a))}" height="${N1(eh - 3)}" style="fill:var(--surface-2);stroke:var(--line)"/>`; const short = n.split(" ")[0]; if (X(b) - X(a) > short.length * tk * .55) g += tx((X(a) + X(b)) / 2, top + eh * .7, X(b) - X(a) > n.length * tk * .5 ? n : short, { s: tk * .82, w: 700 }); });
  PER.forEach(([n, a, b, c]) => { const on = o.sel === n; g += `<rect x="${N1(X(a))}" y="${N1(top + eh)}" width="${N1(Math.max(1, X(b) - X(a)))}" height="${N1(ph)}" style="fill:${c};stroke:${on ? "var(--ink)" : "#ffffff"};stroke-width:${on ? 3 : .8}"/>`; });
  if (!o.compact) for (let t = 500; t >= 0; t -= 100) g += `<line x1="${N1(X(t))}" y1="${N1(top + eh + ph)}" x2="${N1(X(t))}" y2="${N1(top + eh + ph + 6)}" style="stroke:var(--ink);stroke-width:1.2"/>` + tx(X(t), top + eh + ph + tk * 1.25, t ? `−${t}` : "0", { s: s14(F) });
  if (!o.compact) g += tx(L, H - tk * .3, "Temps (millions d'années, Ma)", { s: s14(F), a: "start", w: 600, c: "var(--muted)" });
  (o.marks || []).forEach(m => { const x = X(-m.t); g += `<line x1="${N1(x)}" y1="${N1(top + eh - 2)}" x2="${N1(x)}" y2="${N1(top + eh + ph + 2)}" style="stroke:var(--ink);stroke-width:${m.on ? 3 : 1.6};stroke-dasharray:${m.on ? "none" : "4 3"}"/>`; if (m.on) g += `<path d="M${N1(x - 7)},${N1(top + eh - 9)} L${N1(x + 7)},${N1(top + eh - 9)} L${N1(x)},${N1(top + eh)} Z" style="fill:var(--ink)"/>`; });
  if (o.cursor !== undefined && o.cursor !== null) { const x = X(-o.cursor); g += `<rect x="${N1(x - 3)}" y="${N1(top + eh - 4)}" width="6" height="${N1(ph + 8)}" rx="3" style="fill:var(--ink)"/>`; }
  return svgW(W, H, o.label || "Frise des temps géologiques des 539 derniers millions d'années, avec les ères et les périodes.", g);
}
WID.frise = host => {
  const x = xst(); x.fr = x.fr || {};
  let sel = null;
  host.innerHTML = `<div class="figbox"></div><p class="lead">Touche une période pour lire ses dates :</p><div class="chips frp">${PER.map(([n, a, b, c]) => `<button type="button" class="chipb" data-p="${n}" aria-pressed="false"><span class="sw" style="background:${c}"></span>${n}</button>`).join("")}</div><p class="fr-info" aria-live="polite"></p>`;
  const fig = liveSVG($(".figbox", host), (W, F) => friseSVG(W, F, { sel, marks: [{ t: -305 }, { t: -150 }, { t: -68 }, { t: 0 }] }));
  $$("[data-p]", host).forEach(b => b.onclick = () => {
    sel = b.dataset.p; $$("[data-p]", host).forEach(c => c.setAttribute("aria-pressed", String(c === b)));
    const p = PER.find(q => q[0] === sel), d = Math.round((p[1] - p[2]) * 10) / 10;
    $(".fr-info", host).innerHTML = nb(`<b>${p[0]}</b> : de −${fmt(p[1])} Ma à ${p[2] ? "−" + fmt(p[2]) + " Ma" : "aujourd'hui"}, soit une durée de ${fmt(d)} millions d'années. Ère : ${ERA.find(e => p[1] <= e[1] && p[2] >= e[2])[0]}.`);
    x.fr[sel] = 1; keep(); fig.draw();
  });
};

/* =====================================================================
   1. La machine à remonter le temps : quatre forêts marécageuses
   ===================================================================== */
const ST = [["a", 0, "Aujourd'hui", "Guadeloupe"], ["k", -68, "Crétacé", "vers −68 Ma"], ["j", -150, "Jurassique", "vers −150 Ma"], ["c", -305, "Carbonifère", "vers −305 Ma"]];
const STN = Object.fromEntries(ST.map(s => [s[0], s]));
const SP = {
  c: [["Lépidodendron", "lycophyte géant, jusqu'à 30 à 40 m de haut"], ["Calamite", "prêle géante, jusqu'à 10 à 20 m de haut"], ["Fougère arborescente", "fougère de plusieurs mètres de haut"], ["Meganeura", "libellule géante, environ 70 cm d'envergure (insecte)"], ["Arthropleura", "mille-pattes géant, jusqu'à 2 m (myriapode, ce n'est pas un insecte)"], ["Amphibien primitif", "souvent bien plus grand que les amphibiens actuels"]],
  j: [["Araucaria", "conifère"], ["Cycas", "plante à graines, sans fleurs (cycadale)"], ["Fougères", "fougères"], ["Diplodocus", "dinosaure herbivore, environ 25 m"], ["Allosaure", "dinosaure carnivore, environ 9 m"], ["Archéoptéryx", "l'un des plus anciens oiseaux connus"], ["Petit mammifère", "de la taille d'une musaraigne"], ["Grenouille", "amphibien"], ["Libellule", "insecte"]],
  k: [["Magnolia", "arbre à fleurs"], ["Cyprès des marais", "conifère des zones humides"], ["Fougères", "fougères"], ["Tricératops", "dinosaure herbivore, environ 9 m"], ["Tyrannosaure", "dinosaure carnivore, environ 12 m"], ["Oiseau", "oiseau"], ["Petit mammifère", "mammifère"], ["Salamandre", "amphibien"], ["Libellule", "insecte"]],
  a: [["Mangle médaille", "arbre à fleurs aux racines en planches"], ["Fromager", "grand arbre à fleurs (Ceiba pentandra)"], ["Fougères", "fougères"], ["Madère", "plante à fleurs à gros tubercule"], ["Colibri falle-vert", "oiseau qui se nourrit de nectar"], ["Sucrier", "oiseau qui se nourrit de nectar"], ["Crabe de terre", "crustacé"], ["Raton laveur", "mammifère, espèce protégée"], ["Hylode", "petite grenouille des sous-bois (non citée dans le document 1)"], ["Papillon", "insecte (non cité dans le document 1)"]]
};
const GR = ["Fougères", "Prêles et lycophytes géants", "Conifères", "Plantes à fleurs", "Insectes", "Amphibiens", "Dinosaures (non aviens)", "Oiseaux", "Mammifères"];
const TV = { c: [1, 1, 0, 0, 1, 1, 0, 0, 0], j: [1, 0, 1, 0, 1, 1, 1, 1, 1], k: [1, 0, 1, 1, 1, 1, 1, 1, 1], a: [1, 0, 0, 1, 1, 1, 0, 1, 1] };
const ERAS = ["c", "j", "k", "a"];

/* ---- végétaux (coordonnées du dessin : 1000 × 560) ---- */
const qb = (a, c, b, t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
function frond(x, y, ang, len, col, w, leaf) {
  const a = ang * Math.PI / 180, b = [x + Math.cos(a) * len, y + Math.sin(a) * len * .55 + len * .25], c = [x + Math.cos(a) * len * .5, y + Math.sin(a) * len - len * .1];
  let g = `<path d="M${N1(x)},${N1(y)} Q${N1(c[0])},${N1(c[1])} ${N1(b[0])},${N1(b[1])}" style="fill:none;stroke:${col};stroke-width:${N1(w)};stroke-linecap:round"/>`;
  if (leaf) for (let i = 1; i < 9; i++) { const t = i / 9, p = qb([x, y], c, b, t), q = qb([x, y], c, b, t + .02), dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy) || 1, L = leaf * (1 - t * .7); g += `<line x1="${N1(p[0] - dy / d * L)}" y1="${N1(p[1] + dx / d * L)}" x2="${N1(p[0] + dy / d * L)}" y2="${N1(p[1] - dx / d * L)}" style="stroke:${col};stroke-width:${N1(w * .7)};stroke-linecap:round"/>`; }
  return g;
}
const fern = (x, y, s, col) => [-165, -135, -110, -70, -45, -15].map(a => frond(x, y, a, 62 * s, col || "#4c8a3a", 4 * s, 9 * s)).join("");
function treeFern(x, yb, h, s) { let g = `<rect x="${N1(x - 8 * s)}" y="${N1(yb - h)}" width="${N1(16 * s)}" height="${N1(h)}" rx="4" style="fill:#5d4a2e"/>`; [-175, -150, -125, -95, -60, -30, -5].forEach(a => g += frond(x, yb - h, a, 95 * s, "#3f7a32", 5 * s, 12 * s)); return g; }
function lepido(x, yb, h) {
  const top = yb - h * .74; let g = `<path d="M${N1(x - 17)},${N1(yb)} L${N1(x - 10)},${N1(top)} L${N1(x + 10)},${N1(top)} L${N1(x + 17)},${N1(yb)} Z" style="fill:#6b6a3c"/>`;
  for (let yy = yb - 14; yy > top + 6; yy -= 16) for (let k = -1; k <= 1; k++) { const xx = x + k * 7 + ((yy / 16) % 2 ? 3.5 : 0); g += `<path d="M${N1(xx)},${N1(yy - 5)} l4,5 l-4,5 l-4,-5 Z" style="fill:#4b4a26"/>`; }
  const br = (x0, y0, dx, dy, d) => { const x1 = x0 + dx, y1 = y0 + dy; let s = `<line x1="${N1(x0)}" y1="${N1(y0)}" x2="${N1(x1)}" y2="${N1(y1)}" style="stroke:#6b6a3c;stroke-width:${N1(10 - d * 3)};stroke-linecap:round"/>`; if (d < 2) s += br(x1, y1, -Math.abs(dx) * .7, dy * .8, d + 1) + br(x1, y1, Math.abs(dx) * .7, dy * .8, d + 1); else s += `<ellipse cx="${N1(x1)}" cy="${N1(y1 - 12)}" rx="11" ry="24" style="fill:#2f5f2a"/>`; return s; };
  return g + br(x, top, -32, -h * .1, 0) + br(x, top, 32, -h * .1, 0);
}
function calam(x, yb, h) {
  let g = `<rect x="${N1(x - 6)}" y="${N1(yb - h)}" width="12" height="${N1(h)}" rx="3" style="fill:#7a8b4a"/>`;
  for (let yy = yb - 24; yy > yb - h; yy -= 24) { g += `<line x1="${N1(x - 7)}" y1="${N1(yy)}" x2="${N1(x + 7)}" y2="${N1(yy)}" style="stroke:#3e4a1f;stroke-width:2"/>`; if (yy < yb - h * .35) for (let k = 0; k < 4; k++) { const L = 18 + k * 5; g += `<line x1="${N1(x)}" y1="${N1(yy)}" x2="${N1(x - L)}" y2="${N1(yy + 8 + k * 2)}" style="stroke:#4e7a2e;stroke-width:2"/><line x1="${N1(x)}" y1="${N1(yy)}" x2="${N1(x + L)}" y2="${N1(yy + 8 + k * 2)}" style="stroke:#4e7a2e;stroke-width:2"/>`; } }
  return g + `<ellipse cx="${N1(x)}" cy="${N1(yb - h - 8)}" rx="5" ry="10" style="fill:#5a6a2a"/>`;
}
function arauc(x, yb, h) { let g = `<rect x="${N1(x - 6)}" y="${N1(yb - h)}" width="12" height="${N1(h)}" style="fill:#5a3e26"/>`; for (let i = 0; i < 6; i++) { const yy = yb - h * (.45 + i * .11), rx = 70 - i * 9; g += `<ellipse cx="${N1(x)}" cy="${N1(yy)}" rx="${N1(rx)}" ry="13" style="fill:${i % 2 ? "#2e5a2b" : "#376b31"}"/>`; } return g; }
function cycad(x, yb, s) { let g = ""; for (let i = 0; i < 9; i++) { const a = (-170 + i * 20) * Math.PI / 180, L = 62 * s; g += `<line x1="${N1(x)}" y1="${N1(yb - 44 * s)}" x2="${N1(x + Math.cos(a) * L)}" y2="${N1(yb - 44 * s + Math.sin(a) * L * .7)}" style="stroke:#3c7a35;stroke-width:${N1(6 * s)};stroke-linecap:round"/>`; } return `<rect x="${N1(x - 14 * s)}" y="${N1(yb - 46 * s)}" width="${N1(28 * s)}" height="${N1(46 * s)}" rx="8" style="fill:#7a5a32"/>` + g; }
function crownTree(x, yb, h, col, blobs, flowers) { let g = `<path d="M${N1(x - 9)},${N1(yb)} L${N1(x - 6)},${N1(yb - h * .7)} L${N1(x + 6)},${N1(yb - h * .7)} L${N1(x + 9)},${N1(yb)} Z" style="fill:#5d4630"/>`; blobs.forEach(([dx, dy, r]) => g += `<circle cx="${N1(x + dx)}" cy="${N1(yb - h + dy)}" r="${N1(r)}" style="fill:${col}"/>`); (flowers || []).forEach(([dx, dy]) => g += `<circle cx="${N1(x + dx)}" cy="${N1(yb - h + dy)}" r="6" style="fill:#f3a6c8;stroke:#fff;stroke-width:1.5"/>`); return g; }
function cypress(x, yb, h) { return `<path d="M${N1(x - 16)},${N1(yb)} Q${N1(x - 5)},${N1(yb - 20)} ${N1(x - 5)},${N1(yb - h * .4)} L${N1(x + 5)},${N1(yb - h * .4)} Q${N1(x + 5)},${N1(yb - 20)} ${N1(x + 16)},${N1(yb)} Z" style="fill:#6a4a2c"/><path d="M${N1(x)},${N1(yb - h)} L${N1(x + 42)},${N1(yb - h * .32)} L${N1(x - 42)},${N1(yb - h * .32)} Z" style="fill:#5a6f33"/>` + [[-40, 6], [34, 10]].map(([dx, dy]) => `<path d="M${N1(x + dx - 6)},${N1(yb + dy)} L${N1(x + dx)},${N1(yb + dy - 16)} L${N1(x + dx + 6)},${N1(yb + dy)} Z" style="fill:#6a4a2c"/>`).join(""); }
function ceiba(x, yb, h) { let g = `<path d="M${N1(x - 34)},${N1(yb)} Q${N1(x - 10)},${N1(yb - 30)} ${N1(x - 9)},${N1(yb - h * .8)} L${N1(x + 9)},${N1(yb - h * .8)} Q${N1(x + 10)},${N1(yb - 30)} ${N1(x + 34)},${N1(yb)} Z" style="fill:#8e8a80"/>`; [[0, 0, 100, 26], [-30, 22, 70, 20], [40, 18, 66, 18]].forEach(([dx, dy, rx, ry]) => g += `<ellipse cx="${N1(x + dx)}" cy="${N1(yb - h + dy)}" rx="${rx}" ry="${ry}" style="fill:#3f7d3a"/>`); return g; }
function mangle(x, yb, h) { let g = ""; [-46, -24, 24, 46].forEach(d => g += `<path d="M${N1(x)},${N1(yb - 60)} Q${N1(x + d * .4)},${N1(yb - 30)} ${N1(x + d)},${N1(yb)} L${N1(x + d * .8)},${N1(yb)} Q${N1(x + d * .25)},${N1(yb - 24)} ${N1(x)},${N1(yb - 40)}" style="fill:#7d6a4c"/>`); return g + crownTree(x, yb, h, "#356f33", [[0, 10, 62], [-50, 36, 46], [50, 34, 48]]); }
function taro(x, yb, s) { let g = ""; [[-34, -70, -18], [0, -92, 0], [34, -66, 20], [-6, -50, -8]].forEach(([dx, dy, r]) => { const lx = x + dx * s, ly = yb + dy * s; g += `<line x1="${N1(x)}" y1="${N1(yb)}" x2="${N1(lx)}" y2="${N1(ly + 14 * s)}" style="stroke:#4f8a3a;stroke-width:${N1(3 * s)}"/><path d="M${N1(lx)},${N1(ly + 20 * s)} C${N1(lx - 26 * s)},${N1(ly + 4 * s)} ${N1(lx - 22 * s)},${N1(ly - 18 * s)} ${N1(lx)},${N1(ly - 4 * s)} C${N1(lx + 22 * s)},${N1(ly - 18 * s)} ${N1(lx + 26 * s)},${N1(ly + 4 * s)} ${N1(lx)},${N1(ly + 20 * s)} Z" transform="rotate(${r} ${N1(lx)} ${N1(ly)})" style="fill:#4e9a3e;stroke:#2f6a26;stroke-width:1.5"/>`; }); return g; }
/* ---- animaux ---- */
function dragon(x, y, s, big) { const c = big ? "#5b6d7a" : "#3b6f8f"; return [[-12, -1], [6, -1]].map(([dx, k]) => `<ellipse cx="${N1(x + dx * s)}" cy="${N1(y - 22 * s)}" rx="${N1(8 * s)}" ry="${N1(24 * s)}" transform="rotate(${dx < 0 ? -18 : 14} ${N1(x + dx * s)} ${N1(y)})" style="fill:rgba(210,235,250,.65);stroke:#6b8fa6;stroke-width:1"/><ellipse cx="${N1(x + dx * s)}" cy="${N1(y + 22 * s)}" rx="${N1(8 * s)}" ry="${N1(24 * s)}" transform="rotate(${dx < 0 ? 18 : -14} ${N1(x + dx * s)} ${N1(y)})" style="fill:rgba(210,235,250,.65);stroke:#6b8fa6;stroke-width:1"/>`).join("") + `<line x1="${N1(x - 46 * s)}" y1="${N1(y)}" x2="${N1(x + 26 * s)}" y2="${N1(y)}" style="stroke:${c};stroke-width:${N1(6 * s)};stroke-linecap:round"/><circle cx="${N1(x + 30 * s)}" cy="${N1(y)}" r="${N1(6 * s)}" style="fill:${c}"/>`; }
function arthro(x, y, s) { let g = ""; for (let i = 0; i < 12; i++) { const xx = x + i * 11 * s, yy = y + Math.sin(i * .6) * 3 * s; g += `<line x1="${N1(xx)}" y1="${N1(yy + 5 * s)}" x2="${N1(xx - 3 * s)}" y2="${N1(yy + 13 * s)}" style="stroke:#3e2c1a;stroke-width:1.5"/><rect x="${N1(xx - 5 * s)}" y="${N1(yy - 7 * s)}" width="${N1(11 * s)}" height="${N1(13 * s)}" rx="${N1(4 * s)}" style="fill:${i % 2 ? "#7a5232" : "#8c6040"};stroke:#3e2c1a;stroke-width:1"/>`; } return g; }
function amphib(x, y, s, col) { col = col || "#5f6f3a"; return `<path d="M${N1(x - 40 * s)},${N1(y)} Q${N1(x - 80 * s)},${N1(y + 4 * s)} ${N1(x - 96 * s)},${N1(y + 10 * s)} Q${N1(x - 70 * s)},${N1(y + 10 * s)} ${N1(x - 38 * s)},${N1(y + 8 * s)} Z" style="fill:${col}"/>` + [[-26, 1], [22, 1]].map(([dx]) => `<line x1="${N1(x + dx * s)}" y1="${N1(y + 6 * s)}" x2="${N1(x + (dx - 8) * s)}" y2="${N1(y + 18 * s)}" style="stroke:${col};stroke-width:${N1(5 * s)};stroke-linecap:round"/><line x1="${N1(x + dx * s)}" y1="${N1(y + 6 * s)}" x2="${N1(x + (dx + 8) * s)}" y2="${N1(y + 18 * s)}" style="stroke:${col};stroke-width:${N1(5 * s)};stroke-linecap:round"/>`).join("") + `<ellipse cx="${N1(x)}" cy="${N1(y)}" rx="${N1(42 * s)}" ry="${N1(11 * s)}" style="fill:${col}"/><ellipse cx="${N1(x + 46 * s)}" cy="${N1(y - 2 * s)}" rx="${N1(16 * s)}" ry="${N1(9 * s)}" style="fill:${col}"/><circle cx="${N1(x + 50 * s)}" cy="${N1(y - 6 * s)}" r="${N1(2.2 * s)}" style="fill:#111"/>`; }
function frog(x, y, s, col) { col = col || "#6a9a3a"; return `<ellipse cx="${N1(x)}" cy="${N1(y)}" rx="${N1(13 * s)}" ry="${N1(9 * s)}" style="fill:${col}"/><path d="M${N1(x - 12 * s)},${N1(y + 4 * s)} q-8,10 6,10 M${N1(x + 12 * s)},${N1(y + 4 * s)} q8,10 -6,10" style="fill:none;stroke:${col};stroke-width:${N1(4 * s)}"/><circle cx="${N1(x + 6 * s)}" cy="${N1(y - 8 * s)}" r="${N1(3.5 * s)}" style="fill:${col}"/><circle cx="${N1(x + 6 * s)}" cy="${N1(y - 8 * s)}" r="${N1(1.5 * s)}" style="fill:#111"/>`; }
function sauro(x, y, s) { const c = "#7f8a6a"; return `<path d="M${N1(x - 60 * s)},${N1(y - 8 * s)} Q${N1(x - 130 * s)},${N1(y)} ${N1(x - 190 * s)},${N1(y + 18 * s)} Q${N1(x - 120 * s)},${N1(y + 10 * s)} ${N1(x - 55 * s)},${N1(y + 14 * s)} Z" style="fill:${c}"/>` + [-40, -15, 20, 45].map(d => `<rect x="${N1(x + d * s - 7 * s)}" y="${N1(y + 10 * s)}" width="${N1(14 * s)}" height="${N1(52 * s)}" rx="${N1(5 * s)}" style="fill:${c}"/>`).join("") + `<ellipse cx="${N1(x)}" cy="${N1(y)}" rx="${N1(72 * s)}" ry="${N1(34 * s)}" style="fill:${c}"/><path d="M${N1(x + 50 * s)},${N1(y - 22 * s)} Q${N1(x + 110 * s)},${N1(y - 50 * s)} ${N1(x + 140 * s)},${N1(y - 120 * s)}" style="fill:none;stroke:${c};stroke-width:${N1(20 * s)};stroke-linecap:round"/><ellipse cx="${N1(x + 150 * s)}" cy="${N1(y - 126 * s)}" rx="${N1(18 * s)}" ry="${N1(9 * s)}" style="fill:${c}"/>`; }
function thero(x, y, s, c) { c = c || "#6d5a46"; return `<path d="M${N1(x - 30 * s)},${N1(y)} Q${N1(x - 90 * s)},${N1(y + 6 * s)} ${N1(x - 120 * s)},${N1(y + 20 * s)} Q${N1(x - 80 * s)},${N1(y + 18 * s)} ${N1(x - 26 * s)},${N1(y + 18 * s)} Z" style="fill:${c}"/><path d="M${N1(x - 6 * s)},${N1(y + 16 * s)} L${N1(x - 14 * s)},${N1(y + 64 * s)} L${N1(x + 2 * s)},${N1(y + 64 * s)} L${N1(x + 10 * s)},${N1(y + 18 * s)} Z M${N1(x + 16 * s)},${N1(y + 16 * s)} L${N1(x + 14 * s)},${N1(y + 64 * s)} L${N1(x + 30 * s)},${N1(y + 64 * s)} L${N1(x + 30 * s)},${N1(y + 16 * s)} Z" style="fill:${c}"/><ellipse cx="${N1(x)}" cy="${N1(y + 6 * s)}" rx="${N1(40 * s)}" ry="${N1(22 * s)}" transform="rotate(-12 ${N1(x)} ${N1(y)})" style="fill:${c}"/><rect x="${N1(x + 30 * s)}" y="${N1(y - 34 * s)}" width="${N1(44 * s)}" height="${N1(26 * s)}" rx="${N1(8 * s)}" style="fill:${c}"/><line x1="${N1(x + 36 * s)}" y1="${N1(y - 14 * s)}" x2="${N1(x + 72 * s)}" y2="${N1(y - 16 * s)}" style="stroke:#2a2018;stroke-width:1.5"/><circle cx="${N1(x + 60 * s)}" cy="${N1(y - 26 * s)}" r="${N1(2.5 * s)}" style="fill:#111"/><line x1="${N1(x + 30 * s)}" y1="${N1(y + 4 * s)}" x2="${N1(x + 40 * s)}" y2="${N1(y + 12 * s)}" style="stroke:${c};stroke-width:${N1(4 * s)}"/>`; }
function trice(x, y, s) { const c = "#8a7d5c"; return [-40, -18, 22, 44].map(d => `<rect x="${N1(x + d * s - 8 * s)}" y="${N1(y + 12 * s)}" width="${N1(16 * s)}" height="${N1(34 * s)}" rx="${N1(5 * s)}" style="fill:${c}"/>`).join("") + `<path d="M${N1(x - 56 * s)},${N1(y)} Q${N1(x - 90 * s)},${N1(y + 6 * s)} ${N1(x - 104 * s)},${N1(y + 16 * s)} L${N1(x - 54 * s)},${N1(y + 14 * s)} Z" style="fill:${c}"/><ellipse cx="${N1(x)}" cy="${N1(y)}" rx="${N1(62 * s)}" ry="${N1(32 * s)}" style="fill:${c}"/><path d="M${N1(x + 48 * s)},${N1(y - 30 * s)} A${N1(34 * s)},${N1(34 * s)} 0 0 1 ${N1(x + 66 * s)},${N1(y + 24 * s)} Z" style="fill:#a8936a;stroke:${c};stroke-width:2"/><ellipse cx="${N1(x + 78 * s)}" cy="${N1(y + 4 * s)}" rx="${N1(28 * s)}" ry="${N1(18 * s)}" style="fill:${c}"/><path d="M${N1(x + 80 * s)},${N1(y - 8 * s)} L${N1(x + 112 * s)},${N1(y - 28 * s)} L${N1(x + 88 * s)},${N1(y - 2 * s)} Z M${N1(x + 96 * s)},${N1(y + 4 * s)} L${N1(x + 116 * s)},${N1(y - 6 * s)} L${N1(x + 102 * s)},${N1(y + 10 * s)} Z" style="fill:#f1ead8;stroke:#555;stroke-width:1"/>`; }
function bird(x, y, s, c, tail) { c = c || "#5a6b8a"; return `${tail ? `<path d="M${N1(x - 12 * s)},${N1(y)} L${N1(x - 40 * s)},${N1(y + 6 * s)} L${N1(x - 38 * s)},${N1(y - 4 * s)} Z" style="fill:${c}"/>` : ""}<path d="M${N1(x - 4 * s)},${N1(y - 2 * s)} Q${N1(x - 14 * s)},${N1(y - 26 * s)} ${N1(x - 32 * s)},${N1(y - 30 * s)} Q${N1(x - 14 * s)},${N1(y - 12 * s)} ${N1(x + 4 * s)},${N1(y - 2 * s)} Z" style="fill:${c};opacity:.85"/><ellipse cx="${N1(x)}" cy="${N1(y)}" rx="${N1(14 * s)}" ry="${N1(8 * s)}" style="fill:${c}"/><circle cx="${N1(x + 14 * s)}" cy="${N1(y - 5 * s)}" r="${N1(6 * s)}" style="fill:${c}"/><path d="M${N1(x + 19 * s)},${N1(y - 6 * s)} L${N1(x + 28 * s)},${N1(y - 3 * s)} L${N1(x + 19 * s)},${N1(y - 2 * s)} Z" style="fill:#d9a33a"/>`; }
function hummer(x, y, s) { return `<ellipse cx="${N1(x - 6 * s)}" cy="${N1(y - 12 * s)}" rx="${N1(5 * s)}" ry="${N1(16 * s)}" transform="rotate(-30 ${N1(x)} ${N1(y)})" style="fill:rgba(160,220,190,.6)"/><ellipse cx="${N1(x)}" cy="${N1(y)}" rx="${N1(12 * s)}" ry="${N1(6 * s)}" transform="rotate(-25 ${N1(x)} ${N1(y)})" style="fill:#1f7a4a"/><circle cx="${N1(x + 10 * s)}" cy="${N1(y - 6 * s)}" r="${N1(5 * s)}" style="fill:#1f7a4a"/><line x1="${N1(x + 14 * s)}" y1="${N1(y - 6 * s)}" x2="${N1(x + 32 * s)}" y2="${N1(y - 2 * s)}" style="stroke:#222;stroke-width:${N1(2 * s)}"/>`; }
function mammal(x, y, s, c) { c = c || "#7a6656"; return `<path d="M${N1(x - 14 * s)},${N1(y)} Q${N1(x - 30 * s)},${N1(y - 10 * s)} ${N1(x - 34 * s)},${N1(y + 2 * s)}" style="fill:none;stroke:${c};stroke-width:${N1(3 * s)}"/><ellipse cx="${N1(x)}" cy="${N1(y)}" rx="${N1(17 * s)}" ry="${N1(9 * s)}" style="fill:${c}"/><ellipse cx="${N1(x + 16 * s)}" cy="${N1(y - 3 * s)}" rx="${N1(9 * s)}" ry="${N1(6 * s)}" style="fill:${c}"/><circle cx="${N1(x + 13 * s)}" cy="${N1(y - 9 * s)}" r="${N1(3 * s)}" style="fill:${c}"/><circle cx="${N1(x + 19 * s)}" cy="${N1(y - 5 * s)}" r="${N1(1.4 * s)}" style="fill:#111"/>`; }
function crab(x, y, s) { let g = ""; for (let k = -2; k <= 2; k++) if (k) g += `<path d="M${N1(x + k * 6 * s)},${N1(y + 4 * s)} l${N1(k * 6 * s)},${N1(10 * s)}" style="stroke:#8a7d66;stroke-width:${N1(2.5 * s)}"/>`; return g + `<circle cx="${N1(x - 22 * s)}" cy="${N1(y - 8 * s)}" r="${N1(9 * s)}" style="fill:#e9e2d2;stroke:#8a7d66"/><circle cx="${N1(x + 20 * s)}" cy="${N1(y - 6 * s)}" r="${N1(6 * s)}" style="fill:#e9e2d2;stroke:#8a7d66"/><ellipse cx="${N1(x)}" cy="${N1(y)}" rx="${N1(18 * s)}" ry="${N1(12 * s)}" style="fill:#f1ece0;stroke:#8a7d66;stroke-width:1.5"/>`; }
function raccoon(x, y, s) { const c = "#8a8a86"; let g = `<path d="M${N1(x - 30 * s)},${N1(y)} Q${N1(x - 56 * s)},${N1(y - 8 * s)} ${N1(x - 66 * s)},${N1(y + 8 * s)}" style="fill:none;stroke:${c};stroke-width:${N1(10 * s)};stroke-linecap:round"/>`; for (let i = 0; i < 3; i++) g += `<circle cx="${N1(x - 42 * s - i * 8 * s)}" cy="${N1(y - 3 * s + i * 3 * s)}" r="${N1(4 * s)}" style="fill:#3a3a38"/>`; return g + [-18, 16].map(d => `<rect x="${N1(x + d * s - 4 * s)}" y="${N1(y + 8 * s)}" width="${N1(8 * s)}" height="${N1(16 * s)}" style="fill:#5a5a56"/>`).join("") + `<ellipse cx="${N1(x)}" cy="${N1(y)}" rx="${N1(34 * s)}" ry="${N1(16 * s)}" style="fill:${c}"/><ellipse cx="${N1(x + 34 * s)}" cy="${N1(y - 8 * s)}" rx="${N1(14 * s)}" ry="${N1(11 * s)}" style="fill:${c}"/><rect x="${N1(x + 26 * s)}" y="${N1(y - 12 * s)}" width="${N1(18 * s)}" height="${N1(6 * s)}" rx="3" style="fill:#222"/><path d="M${N1(x + 46 * s)},${N1(y - 6 * s)} l8,3 l-8,3 Z" style="fill:#222"/>`; }
function butter(x, y, s) { return `<ellipse cx="${N1(x - 9 * s)}" cy="${N1(y - 6 * s)}" rx="${N1(10 * s)}" ry="${N1(13 * s)}" style="fill:#f29a2e"/><ellipse cx="${N1(x + 9 * s)}" cy="${N1(y - 6 * s)}" rx="${N1(10 * s)}" ry="${N1(13 * s)}" style="fill:#f29a2e"/><ellipse cx="${N1(x - 7 * s)}" cy="${N1(y + 8 * s)}" rx="${N1(7 * s)}" ry="${N1(8 * s)}" style="fill:#e0701a"/><ellipse cx="${N1(x + 7 * s)}" cy="${N1(y + 8 * s)}" rx="${N1(7 * s)}" ry="${N1(8 * s)}" style="fill:#e0701a"/><line x1="${N1(x)}" y1="${N1(y - 14 * s)}" x2="${N1(x)}" y2="${N1(y + 14 * s)}" style="stroke:#222;stroke-width:${N1(3 * s)}"/>`; }

/* ---- les quatre scènes : décor + organismes + position des repères ---- */
const SC = {
  c: { sky: ["#b8cbbb", "#dfe8d8"], gr: "#4d4a2f", wa: "#3d5a49", items: [
    [() => lepido(180, 440, 400) + lepido(470, 450, 440) + lepido(860, 440, 380), [470, 150]], [() => calam(330, 445, 250) + calam(700, 445, 220) + calam(950, 440, 200), [330, 250]],
    [() => treeFern(600, 445, 150, 1) + fern(90, 450, 1) + fern(780, 452, .9), [600, 330]], [() => dragon(260, 200, 1.6, 1), [262, 150]], [() => arthro(560, 470, 1), [620, 505]], [() => amphib(860, 480, 1), [860, 450]]] },
  j: { sky: ["#e7d9b5", "#f6efdc"], gr: "#9c8050", wa: "#5f8aa0", items: [
    [() => arauc(150, 440, 360) + arauc(880, 440, 330), [150, 110]], [() => cycad(330, 445, 1.2) + cycad(690, 450, 1), [330, 340]], [() => fern(450, 452, 1) + fern(970, 455, .8), [455, 400]],
    [() => sauro(560, 330, 1.05), [600, 280]], [() => thero(250, 400, .9), [270, 360]], [() => bird(800, 150, 1.4, "#6b5a3a", 1), [800, 112]], [() => mammal(470, 490, 1.1), [470, 462]], [() => frog(860, 500, 1.2), [860, 472]], [() => dragon(700, 210, .8), [700, 175]]] },
  k: { sky: ["#c9e2ef", "#ecf6f8"], gr: "#6f8547", wa: "#4c7c88", items: [
    [() => crownTree(150, 440, 300, "#4b8a3e", [[0, 10, 56], [-46, 40, 44], [44, 40, 46]], [[-30, 0], [20, -10], [40, 40], [-50, 46], [0, 50]]) + crownTree(940, 440, 260, "#4b8a3e", [[0, 10, 50], [-40, 34, 40]], [[-20, 10], [10, 40]]), [150, 100]],
    [() => cypress(800, 445, 300), [800, 120]], [() => fern(330, 452, 1) + fern(640, 455, .9), [330, 400]], [() => trice(470, 405, 1.05), [470, 350]], [() => thero(690, 372, 1.15), [700, 318]], [() => bird(300, 140, 1.3, "#3c5b7a"), [300, 102]],
    [() => mammal(230, 490, 1.1), [230, 462]], [() => amphib(880, 495, .55, "#7a4a2a"), [880, 470]], [() => dragon(560, 190, .8), [560, 155]]] },
  a: { sky: ["#cfeadf", "#eef8f2"], gr: "#4c6a35", wa: "#3f6d63", items: [
    [() => mangle(180, 440, 320), [180, 110]], [() => ceiba(760, 440, 400), [760, 70]], [() => fern(470, 452, 1.1) + fern(950, 455, .9) + fern(330, 450, .8), [470, 395]], [() => taro(610, 470, 1), [610, 390]],
    [() => hummer(420, 220, 1.6), [420, 180]], [() => bird(560, 240, 1.2, "#2f3a3a"), [560, 205]], [() => crab(890, 500, 1.3), [890, 470]], [() => raccoon(330, 480, 1.1), [330, 445]], [() => frog(720, 500, 1.1, "#9a7a4a"), [720, 472]], [() => butter(280, 330, 1.2), [280, 298]]] }
};
function sceneSVG(W, F, e, op, warp) {
  const S2 = SC[e], k = W / 1000, H = W * .56, r = Math.max(11, F * .55) / k, id = "sk" + e;
  let g = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${S2.sky[0]}"/><stop offset="1" stop-color="${S2.sky[1]}"/></linearGradient></defs><rect x="0" y="0" width="1000" height="560" style="fill:url(#${id})"/>`;
  g += `<path d="M0,440 Q250,425 500,442 T1000,438 L1000,560 L0,560 Z" style="fill:${S2.gr}"/><path d="M0,505 Q200,490 420,508 T1000,500 L1000,560 L0,560 Z" style="fill:${S2.wa};opacity:.9"/>`;
  g += `<g style="opacity:${N1(op)}">` + S2.items.map(([d]) => d()).join("") + S2.items.map(([, p], i) => pinV(p[0], p[1], i + 1, r)).join("") + `</g>`;
  if (warp > 0) { const R = rnd(7); for (let i = 0; i < 26; i++) { const yy = R() * 560, w = 120 + R() * 380, xx = ((R() + warp * 3) % 1) * 1300 - 300; g += `<rect x="${N1(xx)}" y="${N1(yy)}" width="${N1(w)}" height="${N1(3 + R() * 5)}" rx="3" style="fill:#fff;opacity:${N1(warp * .8)}"/>`; } }
  return svgW(W, H, `Écosystème ${STN[e][2]} (${STN[e][3]}) : ${SP[e].map((s, i) => (i + 1) + " " + s[0]).join(", ")}.`, g, "0 0 1000 560");
}
function mkTemps(grid) {
  return host => {
    const x = xst(); x.tv = x.tv || { vis: {}, g: {} }; x.tv.vis = x.tv.vis || {}; x.tv.g = x.tv.g || {};
    let cur = x.tv.cur || "a", age = STN[cur][1], op = 1, warp = 0, busy = false;
    host.innerHTML = `${segH("Destination", ST.map(s => [s[0], `${s[0] === "a" ? "🏝" : "⏳"} ${s[2]}`]), cur, "st")}<div class="figbox tvf"></div><p class="tv-age" aria-live="polite"></p><div class="figbox tvs"></div>
      <div class="carnet"><p class="kicker tv-k"></p><ol class="ul tv-l"></ol></div>${grid ? `<div class="tv-g"></div>` : ""}`;
    const ff = liveSVG($(".tvf", host), (W, F) => friseSVG(W, F, { compact: true, cursor: age, marks: ST.map(s => ({ t: s[1], on: s[0] === cur })), label: `Frise du temps : position de la machine, ${age ? "−" + fmt(-Math.round(age)) + " Ma" : "aujourd'hui"}.` }));
    const fs = liveSVG($(".tvs", host), (W, F) => sceneSVG(W, F, cur, op, warp));
    const info = () => {
      const s = STN[cur]; $(".tv-age", host).innerHTML = busy ? `⏳ Voyage dans le temps… <b>${age ? "−" + fmt(-Math.round(age)) + " Ma" : "aujourd'hui"}</b>` : nb(`📍 <b>${s[2]}</b> · ${s[0] === "a" ? "forêt marécageuse de Guadeloupe, aujourd'hui" : `forêt marécageuse, ${s[3]}`}`);
      $(".tv-k", host).textContent = `Carnet de terrain · ${s[2]}`;
      $(".tv-l", host).innerHTML = SP[cur].map(([n, d]) => `<li><b>${esc(n)}</b> · ${esc(nb(d))}</li>`).join("");
    };
    const AB = { c: "Carb.", j: "Jur.", k: "Crét.", a: "Auj." };
    const paintGrid = (check) => {
      if (!grid) return; const G = x.tv.g, vis = x.tv.vis, all = ERAS.every(e => vis[e]);
      let bad = 0, cells = 0; G[cur] = G[cur] || {};
      const head = `<tr><th>Groupe</th>${ERAS.map(e => `<th${e === cur ? ' class="cur"' : ""}>${AB[e]}<br><span class="muted">${e === "a" ? "0" : "−" + (-STN[e][1])}</span></th>`).join("")}</tr>`;
      const body = GR.map((gname, i) => `<tr><td>${gname}</td>${ERAS.map(e => { const on = !!(G[e] && G[e][i]); if (!vis[e]) return `<td class="na">…</td>`; let m = ""; if (check) { cells++; const okk = on === !!TV[e][i]; if (!okk) bad++; m = okk ? " ✓" : " ✗"; } return `<td class="${m === " ✓" ? "is-ok" : m === " ✗" ? "is-bad" : ""}${e === cur ? " cur" : ""}">${on ? "oui" : "—"}${m}</td>`; }).join("")}</tr>`).join("");
      $(".tv-g", host).innerHTML = `<p class="kicker">Mon tableau des groupes présents</p>
        <p class="lead">Forêt affichée : <b>${STN[cur][2]}</b>. Touche les groupes présents dans cette forêt (aide-toi du carnet de terrain) :</p>
        <div class="chips gch">${GR.map((gname, i) => `<button type="button" class="chipb" data-gi="${i}" aria-pressed="${!!G[cur][i]}">${G[cur][i] ? "✓ " : ""}${gname}</button>`).join("")}</div>
        <div class="tablewrap"><table class="t gt"><colgroup><col class="gc0">${ERAS.map(() => `<col>`).join("")}</colgroup>${head}${body}</table></div>
        <div class="row"><button type="button" class="btn ghost" data-gchk ${all ? "" : "disabled"}>✔ Vérifier mon tableau</button><span class="lead g-msg" aria-live="polite">${check ? (bad ? `✗ ${bad} case(s) à corriger (marquées ✗), sur ${cells}. Retourne dans la forêt concernée pour corriger.` : `✓ Tableau juste : ${cells} cases.`) : all ? "" : "Visite les quatre époques pour pouvoir vérifier."}</span></div>`;
      if (check) { x.tv.gchk = (x.tv.gchk || 0) + 1; if (!bad) x.tv.gok = 1; keep(); }
      $$("[data-gi]", host).forEach(b => b.onclick = () => { const i = +b.dataset.gi; G[cur][i] = !G[cur][i]; keep(); paintGrid(false); const n = $(`[data-gi="${i}"]`, host); if (n) n.focus(); });
      const cb = $("[data-gchk]", host); if (cb) cb.onclick = () => { paintGrid(true); const n = $("[data-gchk]", host); if (n) n.focus(); };
    };
    const arrive = () => { busy = false; x.tv.vis[cur] = 1; x.tv.cur = cur; keep(); info(); paintGrid(false); };
    bindSeg(host, "st", k => {
      if (busy || k === cur) return; const from = age, to = STN[k][1], prev = cur; busy = true;
      tween(1500, t => { age = LP(from, to, ez(t)); if (t < .5) { cur = prev; op = 1 - t * 2; warp = t * 2; } else { cur = k; op = (t - .5) * 2; warp = (1 - t) * 2; } ff.draw(); fs.draw(); info(); }, () => { cur = k; age = to; op = 1; warp = 0; ff.draw(); fs.draw(); arrive(); });
    });
    info(); x.tv.vis[cur] = 1; keep(); paintGrid(false);
  };
}
WID.temps = mkTemps(false);
WID.temps2 = mkTemps(true);

/* =====================================================================
   2a. TP virtuel : foraminifères de part et d'autre de la limite K/T (loupe binoculaire)
   ===================================================================== */
const FT = { glt: "Globotruncanidés", het: "Hétérohélicidés", gbg: "Globigérinidés" };
const FT_D = { glt: "coquille en forme de disque, loges disposées en spirale, bordure épaissie (carène)", het: "loges alignées sur deux rangées qui s'élargissent : forme d'éventail", gbg: "loges en forme de boules, disposées en spirale" };
const SAB = {
  M: { name: "Sable A · Maastrichtien (fin du Crétacé, juste avant −66 Ma)", short: "Maastrichtien", f: [["glt", 300, 330, 72, 20], ["het", 650, 300, 70, -25], ["glt", 690, 650, 66, 60], ["het", 330, 680, 66, 30], ["glt", 505, 510, 76, -10], ["het", 520, 170, 60, 80]] },
  D: { name: "Sable B · Danien (début du Tertiaire, juste après −66 Ma)", short: "Danien", f: [["gbg", 310, 340, 58, 10], ["gbg", 670, 330, 62, -40], ["het", 500, 520, 46, 20], ["gbg", 330, 690, 56, 70], ["gbg", 690, 660, 60, 15], ["het", 520, 180, 44, -60]] }
};
function foram(t, x, y, r, rot, sel) {
  let g = "";
  if (t === "glt") { g += `<circle cx="0" cy="0" r="${r}" style="fill:#e9dcc2;stroke:#8a6a3a;stroke-width:${N1(r * .12)}"/><circle cx="0" cy="0" r="${N1(r * .84)}" style="fill:none;stroke:#b08a52;stroke-width:${N1(r * .05)}"/>`; for (let i = 0; i < 7; i++) { const a = i * .9, rr = r * (.25 + i * .085), cx = Math.cos(a) * rr * .6, cy = Math.sin(a) * rr * .6; g += `<circle cx="${N1(cx)}" cy="${N1(cy)}" r="${N1(r * (.16 + i * .035))}" style="fill:#efe4cf;stroke:#8a6a3a;stroke-width:1.2"/>`; } }
  else if (t === "het") { for (let i = 0; i < 7; i++) { const w = r * (.16 + i * .06), yy = r * (.9 - i * .26), xx = (i % 2 ? 1 : -1) * w * .7; g += `<ellipse cx="${N1(xx)}" cy="${N1(yy)}" rx="${N1(w)}" ry="${N1(r * .17)}" style="fill:#efe2c8;stroke:#8a6a3a;stroke-width:1.2"/>`; } }
  else { [[0, 0, .42], [.48, -.18, .34], [.38, .4, .3], [-.12, .5, .25], [-.45, .2, .5]].forEach(([dx, dy, rr], i) => g += `<circle cx="${N1(dx * r)}" cy="${N1(dy * r)}" r="${N1(rr * r)}" style="fill:${i === 4 ? "#f3ead6" : "#ece0c6"};stroke:#8a6a3a;stroke-width:1.3"/>`); g += `<circle cx="${N1(-.05 * r)}" cy="${N1(.05 * r)}" r="${N1(r * .09)}" style="fill:#6a5030"/>`; }
  return `<g transform="translate(${x} ${y}) rotate(${rot})">${sel ? `<circle cx="0" cy="0" r="${N1(r * 1.25)}" style="fill:none;stroke:#f2b705;stroke-width:8"/>` : ""}${g}</g>`;
}
function loupeSVG(W, F, s, sel, ans) {
  const D = Math.min(W - 10, F * 22), k = D / 1000, R = rnd(s === "M" ? 11 : 23), r = Math.max(11, F * .55) / k;
  let g = `<clipPath id="lp${s}"><circle cx="500" cy="500" r="480"/></clipPath><circle cx="500" cy="500" r="480" style="fill:#3c3226"/><g clip-path="url(#lp${s})">`;
  for (let i = 0; i < 70; i++) { const cx = R() * 1000, cy = R() * 1000; if (SAB[s].f.some(f => Math.hypot(f[1] - cx, f[2] - cy) < f[3] + 40)) continue; const n = 5 + Math.floor(R() * 3), rr = 22 + R() * 30; let d = ""; for (let j = 0; j < n; j++) { const a = j / n * 6.283, q = rr * (.7 + R() * .5); d += (j ? "L" : "M") + N1(cx + Math.cos(a) * q) + "," + N1(cy + Math.sin(a) * q); } g += `<path d="${d}Z" style="fill:${["#c9b38a", "#b79a6a", "#d8c7a2", "#a8895a"][i % 4]};stroke:#6b5534;stroke-width:1"/>`; }
  SAB[s].f.forEach(([t, x, y, rr, rot], i) => { g += foram(t, x, y, rr, rot, sel === i); const a = ans && ans[i]; g += pinV(x + rr * .95, y - rr * .95, a ? (a === t ? "✓" : "✗") : i + 1, r * .9); });
  g += `</g><circle cx="500" cy="500" r="480" style="fill:none;stroke:#1f2a2e;stroke-width:${N1(Math.max(10, F * .45) / k)}"/>`;
  return `<div style="display:flex;justify-content:center">${svgW(D, D, `Vue à la loupe binoculaire du ${SAB[s].name} : grains de sable et ${SAB[s].f.length} microfossiles numérotés à identifier.`, g, "0 0 1000 1000")}</div>`;
}
WID.loupe = host => {
  const x = xst(); x.lp = x.lp || { M: {}, D: {}, e: 0 }; x.lp.M = x.lp.M || {}; x.lp.D = x.lp.D || {};
  let s = "M", sel = -1;
  host.innerHTML = `${segH("Échantillon", [["M", "Sable A · Maastrichtien"], ["D", "Sable B · Danien"]], "M", "sb")}<p class="lead lp-n"></p><div class="figbox lpv"></div>
    <div class="lp-q" aria-live="polite"></div><p class="kicker">Planche d'identification</p><div class="plate">${Object.keys(FT).map(t => `<figure><svg viewBox="-90 -90 180 180" width="84" height="84" aria-hidden="true">${foram(t, 0, 0, 70, 0, false)}</svg><figcaption><b>${FT[t]}</b><br>${FT_D[t]}</figcaption></figure>`).join("")}</div><div class="lp-c"></div>`;
  const view = $(".lpv", host);
  const draw = () => { view.innerHTML = liveHTML(); bindTap(); };
  const liveHTML = () => { const W = Math.max(260, view.clientWidth || 320), F = fsPx(); return loupeSVG(W, F, s, sel, x.lp[s]); };
  const bindTap = () => { const svg = $("svg", view); if (!svg) return; svg.onclick = ev => { const b = svg.getBoundingClientRect(), px = (ev.clientX - b.left) / b.width * 1000, py = (ev.clientY - b.top) / b.height * 1000; const i = SAB[s].f.findIndex(f => Math.hypot(f[1] - px, f[2] - py) < f[3] * 1.3); if (i >= 0) pick(i); }; };
  const count = () => { const n = o => SAB[o].f.filter((f, i) => x.lp[o][i] === f[0]).length; $(".lp-c", host).innerHTML = `<p class="task ${n("M") + n("D") === 12 ? "is-ok" : ""}">${n("M") === 6 ? "✓" : "○"} Sable A : ${n("M")}/6 microfossiles bien identifiés · ${n("D") === 6 ? "✓" : "○"} Sable B : ${n("D")}/6</p>`; };
  const ask = () => {
    const q = $(".lp-q", host);
    q.innerHTML = `<p class="lead">Touche un microfossile numéroté sur l'image, ou choisis son numéro :</p><div class="chips">${SAB[s].f.map((f, i) => { const a = x.lp[s][i]; return `<button type="button" class="chipb" data-f="${i}" aria-pressed="${sel === i}">${i + 1}${a ? (a === f[0] ? " ✓" : " ✗") : ""}</button>`; }).join("")}</div>` +
      (sel >= 0 ? `<p class="lead"><b>Microfossile n° ${sel + 1}</b> : à quel groupe appartient-il ?</p><div class="chips">${Object.keys(FT).map(t => `<button type="button" class="chipb" data-t="${t}" aria-pressed="${x.lp[s][sel] === t}">${FT[t]}</button>`).join("")}</div>${x.lp[s][sel] ? `<p class="pfb ${x.lp[s][sel] === SAB[s].f[sel][0] ? "ok" : "bad"}">${x.lp[s][sel] === SAB[s].f[sel][0] ? "✓ Juste : " + FT[SAB[s].f[sel][0]] + "." : "✗ Pas encore : compare sa forme avec la planche (" + FT_D[x.lp[s][sel]] + " : est-ce bien le cas ?)."}</p>` : ""}` : "");
    $$("[data-f]", q).forEach(b => b.onclick = () => pick(+b.dataset.f));
    $$("[data-t]", q).forEach(b => b.onclick = () => { const was = x.lp[s][sel]; x.lp[s][sel] = b.dataset.t; if (!was && b.dataset.t !== SAB[s].f[sel][0]) x.lp.e = (x.lp.e || 0) + 1; keep(); draw(); ask(); count(); const n = $(`[data-t="${b.dataset.t}"]`, q); if (n) n.focus(); });
  };
  const pick = i => { sel = i; draw(); ask(); };
  const setS = k => { s = k; sel = -1; $(".lp-n", host).textContent = SAB[s].name + " · grossissement × 40"; draw(); ask(); };
  bindSeg(host, "sb", setS);
  if (window.ResizeObserver) { let lw = view.clientWidth; new ResizeObserver(() => { const w = view.clientWidth; if (Math.abs(w - lw) > 4) { lw = w; draw(); } }).observe(view); }
  setS("M"); count();
};
/* répartition des trois groupes dans le temps (document du TP) */
function rangeSVG(W, F) {
  const tk = TK(F), s = s14(F), L = Math.min(W * .42, F * 11), R = 10, H = F * 9.2, X = t => L + (t - 70) / (60 - 70) * (W - L - R), top = tk * 1.6, rh = F * 1.9;
  let g = tx(X(66), top - tk * .5, "limite K/T (−66 Ma)", { s, c: "var(--bad)" });
  const rows = [["glt", 70, 66], ["het", 70, 64.5], ["gbg", 66, 60]];
  rows.forEach(([t, a, b], i) => { const y = top + i * rh + rh * .2; g += tx(L - 8, y + rh * .5, FT[t], { s, a: "end" }) + `<rect x="${N1(X(a))}" y="${N1(y + rh * .18)}" width="${N1(X(b) - X(a))}" height="${N1(rh * .5)}" rx="6" style="fill:var(--c${i + 1})"/>`; });
  g += `<line x1="${N1(X(66))}" y1="${N1(top)}" x2="${N1(X(66))}" y2="${N1(top + rh * 3)}" style="stroke:var(--bad);stroke-width:2.5;stroke-dasharray:6 4"/>`;
  for (let t = 70; t >= 60; t -= 2) g += tx(X(t), top + rh * 3 + tk * 1.1, `−${t}`, { s }); g += tx(X(65), H - 4, "Temps (Ma)", { s, c: "var(--muted)", w: 600 });
  return svgW(W, H, "Répartition des fossiles : les globotruncanidés vivent jusqu'à la limite K/T ; les hétérohélicidés de part et d'autre ; les globigérinidés seulement après.", g);
}
WID.range = host => { host.innerHTML = `<div class="figbox"></div>`; liveSVG($(".figbox", host), (W, F) => rangeSVG(W, F)); };

/* =====================================================================
   2b. La limite K/T dans les roches : quatre mesures en temps réel (document 2, redessiné)
   ===================================================================== */
const KT = 66, KTA = -67, KTB = -65;
const KTM = {
  pr: { t: "Productivité biologique", u: "% de la valeur avant la crise", min: 0, max: 110, step: 25, f: t => t < -KT ? 100 - 2 * Math.sin(t * 9) : 100 * (.06 + .5 * (1 - Math.exp(-(t + KT) / .5))), col: "c4" },
  ca: { t: "Abondance du CaCO₃ dans la roche", u: "%", min: 0, max: 100, step: 25, f: t => t < -KT - .02 ? 82 + 3 * Math.sin(t * 7) : t < -KT + .02 ? 6 : 6 + 58 * (1 - Math.exp(-(t + KT - .02) / .45)), col: "c1" },
  ir: { t: "Teneur en iridium", u: "ng/g de roche", min: 0, max: 10, step: 2, f: t => .3 + 8.7 * Math.exp(-Math.pow((t + KT) / .025, 2)), col: "c3" },
  mg: { t: "Fragments de magnétite", u: "unités arbitraires", min: 0, max: 100, step: 25, f: t => 3 + 92 * Math.exp(-Math.pow((t + KT) / .03, 2)), col: "c2" }
};
const KTT = [-67, -66.6, -66.4, -66.2, -66.1, -66.05, -66, -65.95, -65.9, -65.8, -65.6, -65.4, -65.2, -65];
function ktChart(W, F, k, tc, rd) {
  const M = KTM[k], tk = TK(F), s = s14(F), two = (M.t.length + M.u.length + 3) * s * .52 > W - 8, L = F * 3.3, R = F * .8, T = tk * 1.3 + (two ? s * 1.15 : 0), B = F * 2.3, H = F * 7.4 + (two ? s * 1.15 : 0), pw = W - L - R, ph = H - T - B;
  const X = t => L + (t - KTA) / (KTB - KTA) * pw, Y = v => T + ph - (v - M.min) / (M.max - M.min) * ph;
  let g = two ? tx(4, tk * .95, M.t, { s, a: "start" }) + tx(4, tk * .95 + s * 1.15, `(${M.u})`, { s: s * .92, a: "start", w: 600, c: "var(--muted)" }) : tx(4, tk * .95, `${M.t} (${M.u})`, { s, a: "start" });
  for (let v = M.min; v <= M.max + 1e-9; v += M.step) g += `<line x1="${N1(L)}" y1="${N1(Y(v))}" x2="${N1(L + pw)}" y2="${N1(Y(v))}" style="stroke:var(--line);stroke-width:1"/><text x="${N1(L - 5)}" y="${N1(Y(v) + tk * .33)}" text-anchor="end" style="fill:var(--ink);font-size:${N1(s)}px">${fmt(v)}</text>`;
  for (let t = -67; t <= -65 + 1e-9; t += .5) g += `<line x1="${N1(X(t))}" y1="${N1(T + ph)}" x2="${N1(X(t))}" y2="${N1(T + ph + 5)}" style="stroke:var(--ink)"/><text x="${N1(X(t))}" y="${N1(T + ph + tk * 1.1)}" text-anchor="middle" style="fill:var(--ink);font-size:${N1(s)}px">${fmt(t, 1).replace("-", "−")}</text>`;
  g += `<line x1="${N1(X(-KT))}" y1="${N1(T)}" x2="${N1(X(-KT))}" y2="${N1(T + ph)}" style="stroke:var(--bad);stroke-width:2;stroke-dasharray:6 4"/>`;
  g += `<line x1="${N1(L)}" y1="${N1(T + ph)}" x2="${N1(L + pw)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${N1(L)}" y1="${N1(T)}" x2="${N1(L)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5"/>`;
  if (tc > KTA) { let d = ""; for (let t = KTA; t <= tc + 1e-9; t += .005) d += (d ? "L" : "M") + N1(X(t)) + "," + N1(Y(M.f(t))); g += `<path d="${d}" style="fill:none;stroke:var(--${M.col});stroke-width:2.6;stroke-linejoin:round"/>`; }
  if (rd !== null && rd !== undefined && rd <= tc) g += `<line x1="${N1(X(rd))}" y1="${N1(T)}" x2="${N1(X(rd))}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-dasharray:3 3"/><circle cx="${N1(X(rd))}" cy="${N1(Y(M.f(rd)))}" r="5" style="fill:var(--${M.col});stroke:var(--surface);stroke-width:2"/>`;
  g += tx(L + pw / 2, H - tk * .25, "Temps (Ma)", { s, w: 600, c: "var(--muted)" });
  return svgW(W, H, `${M.t} en fonction du temps, de −67 à −65 Ma ; valeurs dans le tableau.`, g);
}
function ktEvents(W, F, tc) {
  const tk = TK(F), s = s14(F), L = F * 3.3, R = F * .8, pw = W - L - R, X = t => L + (t - KTA) / (KTB - KTA) * pw, narrow = W < F * 26;
  const y1 = tk * 1.3 + s * 1.2, b1 = y1 + s * .7, y2 = b1 + 26, b2 = y2 + s * .7, H = b2 + 22;
  let g = tx(4, tk * .95, "Événements", { s, a: "start" });
  if (tc >= -66.4) { const e = Math.min(tc, -65.5); g += tx(L, y1, narrow ? "Volcanisme du Deccan" : "Volcanisme du Deccan (Inde)", { s, a: "start", c: "#b55a00" }) + `<rect x="${N1(X(-66.4))}" y="${N1(b1 - 2)}" width="${N1(X(e) - X(-66.4))}" height="14" rx="7" style="fill:#f08a24"/>`; }
  if (tc >= -66) g += tx(L, y2, narrow ? "Impact de Chicxulub" : "Impact de la météorite de Chicxulub (Mexique)", { s, a: "start", c: "var(--bad)" }) + `<circle cx="${N1(X(-66))}" cy="${N1(b2 + 6)}" r="9" style="fill:var(--bad)"/>`;
  g += `<line x1="${N1(X(-KT))}" y1="${N1(tk * 1.2)}" x2="${N1(X(-KT))}" y2="${N1(H)}" style="stroke:var(--bad);stroke-width:2;stroke-dasharray:6 4"/>`;
  return svgW(W, H, "Frise des événements : le volcanisme du Deccan commence vers −66,4 Ma et dure jusque vers −65,5 Ma ; l'impact de Chicxulub a lieu à −66 Ma, à la limite K/T.", g);
}
function coreSVG(W, F, tc) {
  const s = s14(F), H = W < F * 12 ? F * 26 : F * 12, cw = Math.min(F * 4.2, W * .3), cx = F * 1, top = F * .8, bot = H - F * .8, Y = t => bot - (t - KTA) / (KTB - KTA) * (bot - top), yc = Y(Math.max(KTA, Math.min(tc, KTB)));
  let g = `<rect x="${N1(cx)}" y="${N1(top)}" width="${N1(cw)}" height="${N1(bot - top)}" rx="10" style="fill:var(--surface-2);stroke:var(--line);stroke-dasharray:5 4"/>`;
  const layers = [[KTA, -66.01, "#f1ead8"], [-66.01, -65.99, "#3a3430"], [-65.99, -65.7, "#9b8f7d"], [-65.7, KTB, "#d9cfb9"]];
  layers.forEach(([a, b, c]) => { if (tc <= a) return; const yb = Y(a), yt = Y(Math.min(b, tc)); g += `<rect x="${N1(cx)}" y="${N1(yt)}" width="${N1(cw)}" height="${N1(Math.max(1, yb - yt))}" style="fill:${c}"/>`; });
  g += `<rect x="${N1(cx)}" y="${N1(top)}" width="${N1(cw)}" height="${N1(bot - top)}" rx="10" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>`;
  if (tc > KTA) g += `<line x1="${N1(cx - 6)}" y1="${N1(yc)}" x2="${N1(cx + cw + 6)}" y2="${N1(yc)}" style="stroke:var(--accent);stroke-width:3"/>`;
  const lx = cx + cw + 10;
  if (tc > -66.5) g += tx(lx, Y(-66.6), "calcaire riche", { s, a: "start" }) + tx(lx, Y(-66.6) + s * 1.1, "en CaCO₃", { s, a: "start" });
  if (tc >= -66) g += tx(lx, Y(-66) + s * .35, "← fine couche", { s, a: "start", c: "var(--bad)" }) + tx(lx, Y(-66) + s * 1.45, "d'argile sombre", { s, a: "start", c: "var(--bad)" });
  if (tc > -65.6) g += tx(lx, Y(-65.4), "marnes, puis", { s, a: "start" }) + tx(lx, Y(-65.4) + s * 1.1, "calcaire", { s, a: "start" });
  g += tx(cx + cw / 2, H - 2, "carotte", { s, c: "var(--muted)", w: 600 });
  return svgW(W, H, "Carotte de roches sédimentaires de part et d'autre de la limite K/T : calcaire clair en bas, une fine couche d'argile sombre à la limite, puis des marnes et du calcaire.", g);
}
WID.kt = host => {
  const x = xst(); x.kt = x.kt || {};
  let tc = KTA, rd = null;
  host.innerHTML = `<div class="ktg"><div class="figbox ktc"></div><div class="ktr"><div class="figbox ktev"></div>${Object.keys(KTM).map(k => `<div class="figbox kt-${k}" data-k="${k}"></div>`).join("")}</div></div>
    <div class="row animctl"></div><p class="cap"><span class="simw">⚠ Valeurs simulées</span>, d'après l'allure du document 2. Touche un graphique pour lire les valeurs.</p><p class="readout kt-ro" aria-live="polite"></p><div class="kt-t"></div>`;
  const fcore = liveSVG($(".ktc", host), (W, F) => coreSVG(W, F, tc)), fev = liveSVG($(".ktev", host), (W, F) => ktEvents(W, F, tc));
  const figs = Object.keys(KTM).map(k => liveSVG($(".kt-" + k, host), (W, F) => ktChart(W, F, k, tc, rd)));
  const all = () => { fcore.draw(); fev.draw(); figs.forEach(f => f.draw()); };
  const table = () => { $(".kt-t", host).innerHTML = tc >= KTB ? `<details class="tbl"><summary>Tableau de valeurs</summary><div class="fit"><table class="t"><thead><tr><th>Temps (Ma)</th>${Object.values(KTM).map(m => `<th>${m.t.replace(" dans la roche", "")} (${m.u.replace("% de la valeur avant la crise", "%")})</th>`).join("")}</tr></thead><tbody>${KTT.map(t => `<tr><td>${fmt(t, 2).replace("-", "−")}</td>${Object.values(KTM).map(m => `<td>${fmt(Math.round(m.f(t) * 10) / 10)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>` : ""; };
  $$("[data-k]", host).forEach(el => el.addEventListener("pointerdown", ev => {
    const svg = el.querySelector("svg"); if (!svg) return; const b = svg.getBoundingClientRect(), F = fsPx(), L = F * 3.3, R = F * .8, t = Math.round(cl(KTA + (ev.clientX - b.left - L) / (b.width - L - R) * (KTB - KTA), KTA, KTB) * 20) / 20;
    if (t > tc) { $(".kt-ro", host).textContent = "Lance d'abord la lecture de la carotte jusqu'à ce point."; return; } rd = t;
    $(".kt-ro", host).innerHTML = nb(`<b>t = ${fmt(t, 2).replace("-", "−")} Ma</b> · ` + Object.values(KTM).map(m => `${m.t} : ${fmt(Math.round(m.f(t) * 10) / 10)} ${m.u === "%" ? "%" : m.u === "% de la valeur avant la crise" ? "%" : m.u}`).join(" · ")); figs.forEach(f => f.draw());
  }));
  animCtl($(".animctl", host), 12000, v => { tc = KTA + v * (KTB - KTA); all(); if (v >= 1 && !x.kt.done) { x.kt.done = 1; keep(); } table(); });
  if (x.kt.done) { tc = KTB; all(); table(); }
};

/* =====================================================================
   2c. Le nombre de familles marines depuis 540 Ma (document 3, valeurs approchées)
   ===================================================================== */
const FAM = [[-541, 80], [-530, 150], [-510, 160], [-490, 175], [-470, 330], [-450, 420], [-445, 425], [-443, 320], [-430, 360], [-400, 400], [-380, 425], [-372, 415], [-365, 330], [-340, 360], [-300, 385], [-260, 405], [-252, 395], [-250, 190],
  [-235, 260], [-205, 340], [-201, 330], [-199, 270], [-170, 360], [-145, 450], [-100, 560], [-67, 620], [-66, 620], [-64, 510], [-50, 600], [-30, 680], [-10, 745], [0, 780]];
const famAt = t => { for (let i = 1; i < FAM.length; i++) if (t <= FAM[i][0]) { const [a, va] = FAM[i - 1], [b, vb] = FAM[i]; return va + (vb - va) * (t - a) / (b - a); } return 780; };
const CRI = [[-444, "Ordovicien-Silurien"], [-372, "Dévonien"], [-252, "Permien-Trias"], [-201, "Trias-Jurassique"], [-66, "Crétacé-Tertiaire (K/T)"]];
const EXT = [[-359, "placodermes (poissons cuirassés)"], [-252, "trilobites, scorpions de mer"], [-94, "ichtyosaures"], [-66, "ammonites, dinosaures non aviens"]];
function famSVG(W, F, tc, rd) {
  const tk = TK(F), s = s14(F), L = F * 3.4, R = F * 1, T = tk * 1.4, B = F * 2.6, H = cl(W * .55, F * 12, F * 17), pw = W - L - R, ph = H - T - B, X = t => L + (t + 541) / 541 * pw, Y = v => T + ph - v / 800 * ph;
  let g = tx(4, tk * .95, W < F * 22 ? "Familles d'animaux marins" : "Diversité animale marine (nombre de familles)", { s, a: "start" });
  for (let v = 0; v <= 800; v += 200) g += `<line x1="${N1(L)}" y1="${N1(Y(v))}" x2="${N1(L + pw)}" y2="${N1(Y(v))}" style="stroke:var(--line)"/><text x="${N1(L - 5)}" y="${N1(Y(v) + tk * .33)}" text-anchor="end" style="fill:var(--ink);font-size:${N1(s)}px">${v}</text>`;
  for (let t = -500; t <= 0; t += 100) g += `<line x1="${N1(X(t))}" y1="${N1(T + ph)}" x2="${N1(X(t))}" y2="${N1(T + ph + 5)}" style="stroke:var(--ink)"/>` + (W >= F * 22 || t % 200 === 0 ? `<text x="${N1(X(t))}" y="${N1(T + ph + tk * 1.1)}" text-anchor="middle" style="fill:var(--ink);font-size:${N1(s)}px">${t ? "−" + (-t) : 0}</text>` : "");
  g += `<line x1="${N1(L)}" y1="${N1(T + ph)}" x2="${N1(L + pw)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${N1(L)}" y1="${N1(T)}" x2="${N1(L)}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-width:1.5"/>`;
  if (tc > -541) { let d = ""; for (let t = -541; t <= tc + 1e-9; t += 1) d += (d ? "L" : "M") + N1(X(t)) + "," + N1(Y(famAt(t))); g += `<path d="${d}" style="fill:none;stroke:var(--c1);stroke-width:2.8;stroke-linejoin:round"/>`; }
  CRI.forEach(([t], i) => { if (tc < t + 3) return; const x = X(t), y = Y(famAt(t - 2)) - F * .5; g += `<path d="M${N1(x)},${N1(y)} l-6,-14 l12,0 Z" style="fill:var(--bad)"/><line x1="${N1(x)}" y1="${N1(y - 14)}" x2="${N1(x)}" y2="${N1(y - F * 1.4)}" style="stroke:var(--bad);stroke-width:2.5"/>`; });
  EXT.forEach(([t], i) => { if (tc < t + 3) return; g += pinV(X(t), Y(famAt(t)) + F * 1.1, "abcd"[i], Math.max(10, F * .45)); });
  if (rd !== null && rd !== undefined && rd <= tc) g += `<line x1="${N1(X(rd))}" y1="${N1(T)}" x2="${N1(X(rd))}" y2="${N1(T + ph)}" style="stroke:var(--ink);stroke-dasharray:3 3"/><circle cx="${N1(X(rd))}" cy="${N1(Y(famAt(rd)))}" r="5" style="fill:var(--c1);stroke:var(--surface);stroke-width:2"/>`;
  g += tx(L + pw / 2, H - tk * .3, "Temps (millions d'années)", { s, w: 600, c: "var(--muted)" });
  return svgW(W, H, "Nombre de familles d'animaux marins au cours des 540 derniers millions d'années, avec cinq chutes brutales marquées d'une flèche rouge (les crises).", g);
}
WID.familles = host => {
  const x = xst(); x.fa = x.fa || {};
  let tc = -541, rd = null;
  host.innerHTML = `<div class="figbox fam"></div><div class="row animctl"></div><p class="cap"><span class="simw">⚠ Valeurs approchées</span>, d'après l'allure du document 3. ▼ rouge : crise biologique. Touche le graphique pour lire une valeur.</p><p class="readout fa-ro" aria-live="polite"></p>
    <ul class="ul fa-x" hidden>${EXT.map(([t, n], i) => `<li><b>${"abcd"[i]}</b> · disparition des ${n} (vers −${-t} Ma)</li>`).join("")}</ul><div class="fa-t"></div>`;
  const f = liveSVG($(".fam", host), (W, F) => famSVG(W, F, tc, rd));
  $(".fam", host).addEventListener("pointerdown", ev => { const svg = ev.currentTarget.querySelector("svg"); if (!svg) return; const b = svg.getBoundingClientRect(), F = fsPx(), L = F * 3.4, R = F, t = Math.round(cl(-541 + (ev.clientX - b.left - L) / (b.width - L - R) * 541, -541, 0)); if (t > tc) { $(".fa-ro", host).textContent = "Lance d'abord la courbe jusqu'à ce point."; return; } rd = t; $(".fa-ro", host).innerHTML = nb(`<b>${t ? t + " Ma" : "aujourd'hui"}</b> · environ ${Math.round(famAt(t) / 10) * 10} familles`); f.draw(); });
  const table = () => { $(".fa-t", host).innerHTML = tc >= 0 ? `<details class="tbl"><summary>Tableau de valeurs (avant et après chaque crise)</summary><div class="fit"><table class="t"><thead><tr><th>Crise</th><th>Familles juste avant</th><th>Familles juste après</th></tr></thead><tbody>${[[-445, -443], [-372, -365], [-252, -250], [-201, -199], [-66, -64]].map(([a, b], i) => `<tr><td>${CRI[i][1]} (${CRI[i][0]} Ma)</td><td>${Math.round(famAt(a))}</td><td>${Math.round(famAt(b))}</td></tr>`).join("")}</tbody></table></div></details>` : ""; $(".fa-x", host).hidden = tc < 0; };
  animCtl($(".animctl", host), 10000, v => { tc = -541 + v * 541; f.draw(); if (v >= 1 && !x.fa.done) { x.fa.done = 1; keep(); } table(); });
  if (x.fa.done) { tc = 0; f.draw(); table(); }
};

/* =====================================================================
   3a. L'Homme et la biodiversité : causes de l'érosion (document 4) et Amazonie comparée au Luxembourg
   ===================================================================== */
const ERO = { cats: ["Perte et destruction de l'habitat", "Surexploitation (chasse, pêche…)", "Espèces invasives", "Maladies", "Pollution"], series: [["Mammifères", [82, 32, 25, 3, 10], "c1"], ["Oiseaux", [76, 33, 5, 2, 2], "c2"], ["Amphibiens", [78, 7, 7, 16, 26], "c3"], ["Conifères", [59, 17, 4, 0, 1], "c4"]] };
WID.erosion = host => {
  const x = xst(); x.am = x.am || {};
  host.innerHTML = `<p class="kicker">L'érosion de la biodiversité et ses causes</p><div class="figbox ero"></div><p class="cap"><span class="simw">⚠ Valeurs approchées</span>, lues sur le document 4 (pourcentage des espèces menacées concernées par chaque cause ; une espèce peut avoir plusieurs causes).</p>
    <p class="kicker" style="margin-top:.6rem">La forêt amazonienne de 2000 à 2010</p><div class="figbox amz"></div><div class="row animctl"></div><p class="readout am-ro" aria-live="polite"></p>`;
  const fe = liveSVG($(".ero", host), (W, F) => {
    const s = s14(F), bh = Math.max(12, F * .62), gap = 3, blk = s * 1.5 + 4 * (bh + gap) + F * .6, H = ERO.cats.length * blk + 4, L = 4, vw = s * 3.2, pw = W - L - vw;
    let g = "";
    ERO.cats.forEach((c, ci) => { const y0 = ci * blk; g += tx(L, y0 + s * 1.05, c, { s, a: "start" }); ERO.series.forEach(([n, v, col], si) => { const y = y0 + s * 1.5 + si * (bh + gap), w = v[ci] / 100 * pw; g += `<rect x="${N1(L)}" y="${N1(y)}" width="${N1(pw)}" height="${N1(bh)}" rx="3" style="fill:var(--surface-2)"/><rect x="${N1(L)}" y="${N1(y)}" width="${N1(Math.max(1.5, w))}" height="${N1(bh)}" rx="3" style="fill:var(--${col})"/>` + tx(L + Math.max(1.5, w) + 5, y + bh * .82, fmt(v[ci]) + " %", { s: s * .9, a: "start", w: 700 }); }); });
    return svgW(W, H, "Pourcentage des espèces menacées concernées par chaque cause : " + ERO.cats.map((c, ci) => c + " : " + ERO.series.map(([n, v]) => n.toLowerCase() + " " + v[ci] + " %").join(", ")).join(" ; ") + ".", g);
  });
  $(".ero", host).insertAdjacentHTML("afterend", `<div class="mleg">${ERO.series.map(([n, , col]) => `<span><i class="sq" style="background:var(--${col})"></i>${n}</span>`).join("")}</div><details class="tbl"><summary>Tableau de valeurs</summary><div class="fit"><table class="t"><thead><tr><th>Cause</th>${ERO.series.map(([n]) => `<th>${n} (%)</th>`).join("")}</tr></thead><tbody>${ERO.cats.map((c, ci) => `<tr><td>${c}</td>${ERO.series.map(([, v]) => `<td>${v[ci]}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>`);
  let p = 0;
  const f = liveSVG($(".amz", host), (W, F) => {
    const s = s14(F), H = cl(W * .5, F * 11, F * 16), lux = 2586, tot = 400000, A = tot * p, side = Math.sqrt(A / tot), big = Math.min(W < F * 22 ? W * .45 : W * .55, H - F * 2.2), lx = Math.sqrt(lux / tot) * big;
    let g = `<rect x="10" y="${N1(F * 1.4)}" width="${N1(big)}" height="${N1(big)}" style="fill:none;stroke:var(--line);stroke-dasharray:5 4"/>`;
    g += `<rect x="10" y="${N1(F * 1.4 + big - side * big)}" width="${N1(side * big)}" height="${N1(side * big)}" style="fill:#c8743a;opacity:.85"/>`;
    g += tx(10, F * 1, W < F * 22 ? `Forêt détruite : ${fmt(Math.round(40 * p * 10) / 10)} millions d'ha` : `Surface de forêt détruite : ${fmt(Math.round(40 * p * 10) / 10)} millions d'hectares`, { s, a: "start" });
    const ox = 10 + big + F * 1.2, oy = F * 1.4 + big - lx;
    g += `<rect x="${N1(ox)}" y="${N1(oy)}" width="${N1(Math.max(3, lx))}" height="${N1(Math.max(3, lx))}" style="fill:#2f7d3a"/>` + tx(ox, oy - s * 2.6, "Luxembourg", { s, a: "start" }) + tx(ox, oy - s * 1.5, "2 586 km²", { s, a: "start", c: "var(--muted)", w: 600 }) + tx(ox, oy - s * .4, "(même échelle)", { s, a: "start", c: "var(--muted)", w: 600 });
    return svgW(W, H, `Carré orange : surface de forêt amazonienne détruite depuis 2000 (${fmt(Math.round(40 * p * 10) / 10)} millions d'hectares). Petit carré vert : la surface du Luxembourg, à la même échelle.`, g);
  });
  animCtl($(".animctl", host), 7000, v => { p = v; f.draw(); $(".am-ro", host).innerHTML = nb(`Année <b>${2000 + Math.round(v * 10)}</b> · rappel : 1 ha = 10 000 m² et 1 km² = 1 000 000 m²`); if (v >= 1 && !x.am.done) { x.am.done = 1; keep(); } });
};

/* =====================================================================
   3b. De la téosinte au maïs : la sélection artificielle (modèle simplifié)
   ===================================================================== */
const SEL0 = 6;
function selPop(gen, mean) { const R = rnd(101 + gen * 17), out = []; for (let i = 0; i < 12; i++) { const z = (R() + R() + R() - 1.5) * 1.6; out.push(Math.max(3, Math.round((mean + z * (1.4 + mean * .06)) * 10) / 10)); } return out; }
function ear(x, yb, len, s, teo) {
  const h = len * s, w = teo ? 7 : 7 + len * .55; let g = "";
  if (teo) { for (let i = 0; i < Math.max(3, Math.round(len / 1.1)); i++) g += `<path d="M${N1(x)},${N1(yb - i * 8.5)} l${N1(w * .6)},-4 l0,-6 l${N1(-w * .6)},-4 Z" style="fill:${i % 2 ? "#6b5a40" : "#7a6a4e"};stroke:#3a2e1e;stroke-width:1"/>`; return g; }
  g += `<path d="M${N1(x - w / 2)},${N1(yb)} Q${N1(x - w * .62)},${N1(yb - h * .55)} ${N1(x)},${N1(yb - h)} Q${N1(x + w * .62)},${N1(yb - h * .55)} ${N1(x + w / 2)},${N1(yb)} Z" style="fill:#f0c234;stroke:#a77a12;stroke-width:1.2"/>`;
  for (let r = 1; r < 4; r++) g += `<line x1="${N1(x - w / 2 + r * w / 4)}" y1="${N1(yb - 3)}" x2="${N1(x)}" y2="${N1(yb - h + 6)}" style="stroke:#c99a1c;stroke-width:1"/>`;
  return g;
}
WID.selection = host => {
  const x = xst(); x.sl = x.sl || { gens: [SEL0] };
  host.innerHTML = `<div class="figbox sl-f"></div><div class="row"><button type="button" class="btn" data-sel>🌽 Récolter, garder les 3 plus gros épis et les ressemer</button><button type="button" class="btn ghost" data-rz>↺ Revenir à la téosinte</button></div><p class="readout sl-ro" aria-live="polite"></p><div class="figbox sl-g"></div><p class="cap"><span class="simw">⚠ Modèle simplifié</span> : une génération = une saison de culture. Il a fallu des milliers d'années pour obtenir le maïs actuel.</p>`;
  let pop = selPop(x.sl.gens.length - 1, x.sl.gens[x.sl.gens.length - 1]), keepIdx = [], anim = 0;
  const top3 = () => pop.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 3).map(a => a[1]);
  const fp = liveSVG($(".sl-f", host), (W, F) => {
    const s = s14(F), H = F * 10, base = H - F * 2.2, sc = (base - F * 1.2) / 24, sp = W / 12, g0 = x.sl.gens.length - 1;
    let g = tx(10, F * .95, `Génération ${g0} · ${g0 === 0 ? "téosinte (plante sauvage)" : "plantes cultivées"}`, { s, a: "start" });
    pop.forEach((v, i) => { const on = keepIdx.includes(i); g += (on ? `<rect x="${N1(i * sp + 3)}" y="${N1(base - v * sc - 10)}" width="${N1(sp - 6)}" height="${N1(v * sc + 14)}" rx="8" style="fill:none;stroke:#f2b705;stroke-width:4"/>` : "") + ear(i * sp + sp / 2, base, v, sc, g0 === 0 && v < 9) + tx(i * sp + sp / 2, base + s * 1.2, fmt(v), { s: s * .9, c: "var(--muted)", w: 600 }); });
    g += tx(W / 2, H - 4, "longueur de l'épi (cm)", { s, c: "var(--muted)", w: 600 });
    return svgW(W, H, `Génération ${g0} : douze épis, longueurs ${pop.map(v => fmt(v)).join(", ")} cm.`, g);
  });
  const fg = liveSVG($(".sl-g", host), (W, F) => {
    const s = s14(F), L = F * 3, R = F, T = F, B = F * 2.4, H = F * 9, pw = W - L - R, ph = H - T - B, n = Math.max(10, x.sl.gens.length - 1), X = i => L + i / n * pw, Y = v => T + ph - v / 25 * ph;
    let g = "";
    for (let v = 0; v <= 25; v += 5) g += `<line x1="${N1(L)}" y1="${N1(Y(v))}" x2="${N1(L + pw)}" y2="${N1(Y(v))}" style="stroke:var(--line)"/><text x="${N1(L - 5)}" y="${N1(Y(v) + s * .33)}" text-anchor="end" style="fill:var(--ink);font-size:${N1(s)}px">${v}</text>`;
    for (let i = 0; i <= n; i += 2) g += `<text x="${N1(X(i))}" y="${N1(T + ph + s * 1.2)}" text-anchor="middle" style="fill:var(--ink);font-size:${N1(s)}px">${i}</text>`;
    let d = ""; x.sl.gens.forEach((v, i) => { d += (i ? "L" : "M") + N1(X(i)) + "," + N1(Y(v)); g += `<circle cx="${N1(X(i))}" cy="${N1(Y(v))}" r="4.5" style="fill:var(--c2)"/>`; }); g += `<path d="${d}" style="fill:none;stroke:var(--c2);stroke-width:2.6"/>`;
    g += tx(L + pw / 2, H - 4, "Génération", { s, c: "var(--muted)", w: 600 }) + `<text transform="rotate(-90 ${N1(s)} ${N1(T + ph / 2)})" x="${N1(s)}" y="${N1(T + ph / 2)}" text-anchor="middle" style="fill:var(--ink);font-size:${N1(s * .9)}px;font-weight:600">Longueur moyenne (cm)</text>`;
    return svgW(W, H, `Longueur moyenne des épis au fil des générations : ${x.sl.gens.map(v => fmt(v)).join(" ; ")} cm.`, g);
  });
  const ro = () => { const m = x.sl.gens; $(".sl-ro", host).innerHTML = nb(`Longueur moyenne : <b>${fmt(m[m.length - 1])} cm</b> à la génération ${m.length - 1} (au départ : ${fmt(m[0])} cm).`); };
  $("[data-sel]", host).onclick = () => {
    if (anim) return; keepIdx = top3(); fp.draw(); anim = 1;
    setTimeout(() => { const mk = keepIdx.reduce((a, i) => a + pop[i], 0) / 3, prev = x.sl.gens[x.sl.gens.length - 1], next = Math.round((prev + .55 * (mk - prev)) * 10) / 10; x.sl.gens.push(next); keep(); pop = selPop(x.sl.gens.length - 1, next); keepIdx = []; anim = 0; fp.draw(); fg.draw(); ro(); }, RMO ? 0 : 900);
  };
  armButton($("[data-rz]", host), "↺ Revenir à la téosinte", "Effacer les générations ?", () => { x.sl.gens = [SEL0]; keep(); pop = selPop(0, SEL0); keepIdx = []; fp.draw(); fg.draw(); ro(); });
  ro();
};
