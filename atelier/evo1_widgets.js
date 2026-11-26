/* ===== 3e SVT · Chapitre 3 · Diversité et évolution des êtres vivants · Activité 1 · L'apparition d'un nouveau caractère : simulations =====
   D'après la fiche du professeur « Activité 1 : L'apparition d'un nouveau caractère chez un être vivant » (drosophile, transmission des mutations, Lamarck et Darwin).
   Tous les dessins sont des schémas redessinés (aucune image de manuel). */
Store.key = "svt3-evo-act1-v1";
const WID = {}, LIVE = {};
const xst = () => { if (!S.x || typeof S.x !== "object") S.x = {}; return S.x; };
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const f1 = v => (+v).toFixed(1);
const rng = s => { let x = s; return () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; }; };
const gauss = R => { let u = 0; for (let i = 0; i < 6; i++) u += R(); return (u - 3) / Math.sqrt(0.5); };
const ss = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
/* texte SVG dont le style optionnel complète le style de base */
const sX = (x, y, txt, a, size, extra) => { extra = extra || ""; const m = extra.match(/style="([^"]*)"/); return `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${f1(size)}px;${m ? m[1] : ""}" ${extra.replace(/style="[^"]*"/, "")}>${esc(txt)}</text>`; };
const press = (el, key, cur) => $$(`[data-${key}]`, el).forEach(b => b.setAttribute("aria-pressed", b.dataset[key] === String(cur) ? "true" : "false"));
function loopWhile(el, fn) { let lt = 0; const st = ts => { if (!document.body.contains(el)) return; const dt = lt ? Math.min(0.1, (ts - lt) / 1000) : 0; lt = ts; if (fn(dt, ts) !== false) requestAnimationFrame(st); }; requestAnimationFrame(st); }
const MUT = "#d81b7a";   /* couleur du nouvel allèle (mutation), identique en mode clair et sombre */
const star = (x, y, r) => { let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.45 : r; d += (i ? "L" : "M") + f1(x + q * Math.cos(a)) + "," + f1(y + q * Math.sin(a)); } return `<path d="${d}Z" style="fill:${MUT};stroke:#fff;stroke-width:${f1(Math.max(1, r * 0.18))}"/>`; };

/* ======================= 1 · Les drosophiles : dessin, gènes, caryotype ======================= */
const EYE = { rouges: "#c0392b", blancs: "#f6f3ea", bruns: "#7a4a24" };
const THX = { beige: "#b98d56", jaune: "#dcbc4c" };
const ABD = { "rayé": ["#d6ae74", "#4a3320"], sombre: ["#3b2d22", "#17100b"] };
const FLIES = [
  { n: "A", eye: "rouges", thx: "beige", wing: "longues", ant: "normales", abd: "rayé" },
  { n: "B", eye: "blancs", thx: "beige", wing: "longues", ant: "normales", abd: "rayé" },
  { n: "C", eye: "rouges", thx: "beige", wing: "courtes", ant: "normales", abd: "rayé" },
  { n: "D", eye: "rouges", thx: "jaune", wing: "longues", ant: "normales", abd: "sombre" },
  { n: "E", eye: "bruns", thx: "beige", wing: "longues", ant: "courtes", abd: "rayé" },
  { n: "F", eye: "blancs", thx: "jaune", wing: "courtes", ant: "normales", abd: "sombre" }];
const WILD = FLIES[0];
/* les cinq gènes du document 2 (chromosome, position relative le long du chromosome) */
const GENES = [
  { k: "eye", chr: 0, pos: 0.14, doc: ["Gène de la couleur", "des yeux"], nm: "Couleur des yeux", al: f => `yeux ${f.eye}` },
  { k: "thx", chr: 0, pos: 0.6, doc: ["Gène déterminant la", "couleur du thorax"], nm: "Couleur du thorax", al: f => `thorax ${f.thx}` },
  { k: "wing", chr: 1, pos: 0.09, doc: ["Gène de la taille", "des ailes"], nm: "Taille des ailes", al: f => `ailes ${f.wing}` },
  { k: "ant", chr: 1, pos: 0.46, doc: ["Gène de la forme", "des antennes"], nm: "Forme des antennes", al: f => `antennes ${f.ant}` },
  { k: "abd", chr: 1, pos: 0.79, doc: ["Gène de la couleur", "de l'abdomen"], nm: "Couleur de l'abdomen", al: f => `abdomen ${f.abd}` }];
const flyAlt = f => `Drosophile ${f.n ? f.n + " " : ""}: yeux ${f.eye}, thorax ${f.thx}, ${f.wing === "4" ? "quatre ailes" : "ailes " + f.wing}, antennes ${f.ant}, abdomen ${f.abd}`;

/* une drosophile vue de dessus, dans un repère 100 × 130 (tête en haut) */
function flyG(f, id) {
  const four = f.wing === "4", wingC = "rgba(200,220,236,.62)", wingS = "#5d7180", thxC = THX[f.thx] || THX.beige, ab = ABD[f.abd] || ABD["rayé"], eyeC = EYE[f.eye] || EYE.rouges;
  const aY = four ? 95 : 85, ink = "#3a2a1c";
  const mir = s => s + `<g transform="translate(100,0) scale(-1,1)">${s}</g>`;
  let g = mir(`<path d="M58,33 L70,26 L79,19 M60,43 L75,45 L88,48 M58,${four ? 62 : 52} L70,${four ? 72 : 62} L78,${four ? 84 : 74}" style="fill:none;stroke:${ink};stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round"/>`);
  g += `<clipPath id="ab${id}"><ellipse cx="50" cy="${aY}" rx="13" ry="24"/></clipPath><ellipse cx="50" cy="${aY}" rx="13" ry="24" style="fill:${ab[0]};stroke:${ink};stroke-width:1"/>`;
  g += `<g clip-path="url(#ab${id})">${[0, 1, 2, 3].map(i => `<path d="M35,${aY - 12 + i * 9} Q50,${aY - 7 + i * 9} 65,${aY - 12 + i * 9}" style="fill:none;stroke:${ab[1]};stroke-width:3.6"/>`).join("")}</g>`;
  g += four ? `<ellipse cx="50" cy="59" rx="12.5" ry="9.5" style="fill:${thxC};stroke:${ink};stroke-width:1"/>` : `<ellipse cx="50" cy="56" rx="9" ry="4.5" style="fill:${thxC};stroke:${ink};stroke-width:1"/>`;
  g += `<ellipse cx="50" cy="43" rx="13" ry="12" style="fill:${thxC};stroke:${ink};stroke-width:1"/><ellipse cx="50" cy="30" rx="9" ry="3.6" style="fill:${thxC};stroke:${ink};stroke-width:1"/>`;
  g += `<ellipse cx="50" cy="19" rx="11" ry="8.5" style="fill:${thxC};stroke:${ink};stroke-width:1"/>`;
  g += `<ellipse cx="40.5" cy="18.5" rx="5.8" ry="7" style="fill:${eyeC};stroke:${ink};stroke-width:.9"/><ellipse cx="59.5" cy="18.5" rx="5.8" ry="7" style="fill:${eyeC};stroke:${ink};stroke-width:.9"/>`;
  g += mir(f.ant === "courtes" ? `<path d="M46,12 L45,8.5" style="fill:none;stroke:${ink};stroke-width:1.6;stroke-linecap:round"/>` : `<path d="M46,12 L44,7 L41,2.5 M44,7 L39.5,6 M43,5 L38.5,3.5" style="fill:none;stroke:${ink};stroke-width:1.3;stroke-linecap:round"/>`);
  if (four) g += mir(`<g transform="rotate(14 55 58)"><path d="M55,57 C71,59 87,83 84,110 C82,122 72,124 68,116 C62,104 58,78 55,63 Z" style="fill:${wingC};stroke:${wingS};stroke-width:1.2"/><path d="M57,62 C65,78 72,96 76,114 M58,60 C70,74 79,92 82,108" style="fill:none;stroke:${wingS};stroke-width:.7;opacity:.8"/></g>`);
  else g += mir(`<path d="M55,54 L61,60" style="stroke:${ink};stroke-width:1.4"/><circle cx="62.5" cy="61.5" r="2.7" style="fill:${thxC};stroke:${ink};stroke-width:1"/>`);
  g += mir((four ? `<g transform="rotate(-14 56 40)">` : "<g>") + (f.wing === "courtes" ? `<path d="M56,38 C64,37 72,44 70,53 C69,59 63,58 59,52 C57,48 56,44 56,38 Z" style="fill:${wingC};stroke:${wingS};stroke-width:1.2"/><path d="M58,42 C62,46 64,50 64,54" style="fill:none;stroke:${wingS};stroke-width:.7"/>`
    : `<path d="M56,37 C74,35 92,59 90,91 C88,107 77,111 71,103 C64,93 60,63 56,45 Z" style="fill:${wingC};stroke:${wingS};stroke-width:1.2"/><path d="M58,43 C66,59 74,79 80,99 M60,41 C72,55 82,73 87,91" style="fill:none;stroke:${wingS};stroke-width:.7;opacity:.8"/>`) + "</g>");
  return g;
}
const flySVG = (f, id, cls) => `<svg viewBox="0 0 100 130" class="${cls || ""}" role="img" aria-label="${esc(flyAlt(f))}">${flyG(f, id)}</svg>`;

/* caryotype schématique : 4 paires (1 : bâtonnets, 2 et 3 : en V, 4 : points) */
function karyG(x0, y0, w, h, F) {
  const sl = w / 4, cw = Math.max(4, Math.min(sl * 0.11, h * 0.075)), tk = TK(F) * 0.95, top = y0 + h * 0.06, base = y0 + h - tk * 1.5;
  const col = ["#d65c8c", "#a9c23f", "#b07a3c", "#8d949c"];
  let g = "";
  for (let p = 0; p < 4; p++) {
    const cx = x0 + sl * (p + 0.5);
    [-1, 1].forEach(s => {
      const x = cx + s * sl * 0.17;
      if (p === 0) g += `<line x1="${f1(x)}" y1="${f1(top + h * 0.1)}" x2="${f1(x)}" y2="${f1(base - h * 0.08)}" style="stroke:${col[p]};stroke-width:${f1(cw)};stroke-linecap:round"/>`;
      else if (p < 3) { const ay = base - h * 0.06, arm = (base - top) * (p === 1 ? 0.62 : 0.7), dx = arm * 0.34; g += `<path d="M${f1(x - dx * 0.55)},${f1(ay - arm)} L${f1(x)},${f1(ay)} L${f1(x + dx * 0.55)},${f1(ay - arm * 0.92)}" style="fill:none;stroke:${col[p]};stroke-width:${f1(cw)};stroke-linecap:round;stroke-linejoin:round"/>`; }
      else g += `<circle cx="${f1(x)}" cy="${f1(base - h * 0.14)}" r="${f1(cw * 0.75)}" style="fill:${col[p]}"/>`;
    });
    g += sX(cx, y0 + h - tk * 0.2, `Chr. ${p + 1}`, "middle", tk, 'font-weight="700"');
  }
  return g;
}
WID.kary = el => {
  liveSVG(el, (W, F) => { const H = Math.min(F * 9, Math.max(F * 7, W * 0.42)); return `<svg viewBox="0 0 ${W} ${f1(H)}" width="${W}" height="${f1(H)}" role="img" aria-label="Caryotype schématique d'une cellule de drosophile : chromosomes rangés par paires, numérotés de 1 à 4."><rect x="1" y="1" width="${W - 2}" height="${f1(H - 2)}" rx="12" style="fill:var(--surface-2);stroke:var(--line)"/>${karyG(F * 0.4, F * 0.3, W - F * 0.8, H - F * 0.5, F)}</svg>`; });
};

/* chromosomes 1 et 2 avec les gènes du document 2 ; si une mouche est donnée, on affiche ses allèles */
const CHR = [
  { name: "Chromosome 1", L: 7.6, cen: 0.3, arms: ["#9ccc7d", "#79b8e0"], band: "#d989b5", gb: "#c2549a", bands: [0.22, 0.42, 0.5, 0.72, 0.82, 0.9] },
  { name: "Chromosome 2", L: 9.6, cen: 0.2, arms: ["#1aa596", "#1aa596"], band: "#8b3a7e", gb: "#6a1f60", bands: [0.3, 0.36, 0.6, 0.67, 0.93], cenC: "#e04848" }];
function chromoG(cx, top, L, cw, c, hi) {
  const ce = top + L * c.cen, r = cw / 2;
  let g = `<rect x="${f1(cx - r)}" y="${f1(top)}" width="${f1(cw)}" height="${f1(ce - top - cw * 0.15)}" rx="${f1(r)}" style="fill:${c.arms[0]};stroke:#2d3b33;stroke-width:1"/>`;
  g += `<rect x="${f1(cx - r)}" y="${f1(ce + cw * 0.15)}" width="${f1(cw)}" height="${f1(top + L - ce - cw * 0.15)}" rx="${f1(r)}" style="fill:${c.arms[1]};stroke:#2d3b33;stroke-width:1"/>`;
  g += c.cenC ? `<ellipse cx="${f1(cx)}" cy="${f1(ce)}" rx="${f1(r * 0.62)}" ry="${f1(cw * 0.32)}" style="fill:${c.cenC};stroke:#2d3b33;stroke-width:1"/>` : `<rect x="${f1(cx - r * 0.55)}" y="${f1(ce - cw * 0.3)}" width="${f1(r * 1.1)}" height="${f1(cw * 0.6)}" style="fill:${c.arms[1]};stroke:#2d3b33;stroke-width:1"/>`;
  c.bands.forEach(b => { g += `<rect x="${f1(cx - r + 0.8)}" y="${f1(top + L * b)}" width="${f1(cw - 1.6)}" height="${f1(L * 0.022)}" style="fill:${c.band}"/>`; });
  GENES.filter(q => CHR[q.chr] === c).forEach(q => { g += `<rect x="${f1(cx - r + 0.8)}" y="${f1(top + L * q.pos - L * 0.025)}" width="${f1(cw - 1.6)}" height="${f1(L * 0.05)}" style="fill:${hi === q.k ? MUT : c.gb}"/>`; });
  return g;
}
function genesSVG(W, F, fly) {
  const tk = TK(F) * 0.95, cols = W >= F * 27 ? 2 : 1, cwid = W / cols, cw = F * 1.05;
  const blocks = CHR.map(c => ({ c, L: F * c.L * (fly ? 0.85 : 1) }));
  const bh = b => F * 1.7 + b.L + F * 0.9;
  const H = cols === 2 ? Math.max(...blocks.map(bh)) : blocks.reduce((s, b) => s + bh(b), 0);
  let g = "", yAcc = 0;
  blocks.forEach((b, k) => {
    const x0 = cols === 2 ? k * cwid : 0, y0 = cols === 2 ? 0 : yAcc, cx = x0 + F * 1.4, top = y0 + F * 1.7;
    g += sX(x0 + F * 0.3, y0 + F * 1.05, b.c.name, "start", tk, 'font-weight="800"') + chromoG(cx, top, b.L, cw, b.c);
    GENES.filter(q => q.chr === k).forEach(q => {
      const y = top + b.L * q.pos, lx = cx + cw / 2 + F * 1.3;
      g += `<line x1="${f1(cx + cw / 2 + 2)}" y1="${f1(y)}" x2="${f1(lx - 4)}" y2="${f1(y)}" style="stroke:var(--muted);stroke-width:1.4"/>`;
      const lines = fly ? [q.nm, `allèle « ${q.al(fly).split(" ").slice(1).join(" ")} »`] : q.doc;
      g += sX(lx, y - tk * 0.15, lines[0], "start", tk, fly ? 'font-weight="700"' : "") + sX(lx, y + tk * 1.05, lines[1], "start", tk, fly ? `style="fill:var(--accent);font-weight:800"` : "");
    });
    yAcc += bh(b);
  });
  return `<svg viewBox="0 0 ${W} ${f1(H)}" width="${W}" height="${f1(H)}" role="img" aria-label="${fly ? esc(`Chromosomes 1 et 2 de la drosophile ${fly.n} et les allèles de cinq gènes : ` + GENES.map(q => q.nm + " " + q.al(fly).split(" ").slice(1).join(" ")).join(", ")) : "Chromosome 1 : gène de la couleur des yeux et gène de la couleur du thorax. Chromosome 2 : gène de la taille des ailes, gène de la forme des antennes et gène de la couleur de l'abdomen."}">${g}</svg>`;
}
WID.genes = el => { liveSVG(el, (W, F) => genesSVG(W, F, null)); };

/* ---------- élevage : examiner les drosophiles une à une ---------- */
WID.elevage = el => {
  const X = xst(); X.vu = X.vu || {};
  let cur = Number.isInteger(X.sel) ? X.sel : null;
  el.innerHTML = `<p class="lead">${nb("Touche une drosophile de l'élevage pour ouvrir sa fiche : son caryotype et les allèles de cinq de ses gènes. Examine-en au moins quatre.")}</p>
    <div class="flygrid" role="group" aria-label="Les drosophiles de l'élevage">${FLIES.map((f, i) => `<button type="button" class="flyb" data-f="${i}" aria-pressed="false">${flySVG(f, "g" + i)}<span class="fn">Mouche ${f.n} <span class="fv" data-fv></span></span></button>`).join("")}</div>
    <p class="readout" aria-live="polite"></p>
    <div class="flycard" hidden><p class="fct"></p><div class="fcg"><figure class="fcf"><div class="figbox" data-k></div><figcaption class="cap">Son caryotype</figcaption></figure><figure class="fcf"><div class="figbox" data-c></div><figcaption class="cap">Ses chromosomes 1 et 2 (un seul chromosome de chaque paire est dessiné)</figcaption></figure></div></div>
    <div class="carnet" aria-label="Mon carnet d'observation"></div>`;
  const card = $(".flycard", el);
  let kf = null, cf = null;
  const paint = () => {
    $$("[data-f]", el).forEach(b => { const i = +b.dataset.f; b.setAttribute("aria-pressed", i === cur ? "true" : "false"); $("[data-fv]", b).textContent = X.vu[i] ? "✓ examinée" : ""; });
    const n = Object.keys(X.vu).length;
    $(".readout", el).innerHTML = nb(`Drosophiles examinées : <b>${n}/${FLIES.length}</b>${n < 4 ? " (au moins 4 attendues)" : ""}.`);
    if (cur === null) { card.hidden = true; } else {
      const f = FLIES[cur]; card.hidden = false; $(".fct", card).innerHTML = `Fiche de la mouche ${f.n}`;
      if (!kf) kf = liveSVG($("[data-k]", card), (W, F) => { const w = Math.min(W, F * 16), H = F * 6.4; return `<svg viewBox="0 0 ${w} ${f1(H)}" width="${w}" height="${f1(H)}" role="img" aria-label="Caryotype de la mouche ${FLIES[cur].n} : chromosomes rangés par paires, numérotés de 1 à 4.">${karyG(0, 0, w, H, F)}</svg>`; });
      if (!cf) cf = liveSVG($("[data-c]", card), (W, F) => genesSVG(W, F, FLIES[cur]));
      kf.draw(); cf.draw();
    }
    const ids = Object.keys(X.vu).map(Number).sort((a, b) => a - b);
    $(".carnet", el).innerHTML = ids.length ? `<p class="kicker">Mon carnet d'observation</p><div class="cgrid">${ids.map(i => { const f = FLIES[i]; return `<div class="cobs"><p class="ct">Mouche ${f.n}</p><p>Caryotype : 4 paires</p>${GENES.map(q => `<p>${q.nm} : <b>${q.al(f).split(" ").slice(1).join(" ")}</b></p>`).join("")}</div>`; }).join("")}</div>` : "";
  };
  $$("[data-f]", el).forEach(b => b.onclick = () => { cur = +b.dataset.f; X.sel = cur; X.vu[cur] = 1; keep(); paint(); const c = $(".flycard", el); if (c && c.scrollIntoView) c.scrollIntoView({ block: "nearest", behavior: "smooth" }); });
  paint();
};

/* ---------- 2 · une drosophile normale et une drosophile mutante à quatre ailes ---------- */
const SEGP = { T1: [50, 30, 10, 4.2], T2: [50, 43, 14, 12.6], T3n: [50, 56, 10.5, 5.6], T3f: [50, 59, 13.5, 10.5] };
const SEGC = { T1: "#7b3fa0", T2: "#1f6fb2", T3: "#d35400" };
WID.ailes = el => {
  let seg = !!xst().seg4;
  el.innerHTML = `<p class="lead">${nb("À gauche, une drosophile normale ; à droite, une drosophile mutante. Compare-les, puis affiche les trois segments du thorax (T1, T2 et T3).")}</p>
    <div class="row"><button type="button" class="btn ghost" data-seg aria-pressed="${seg}"></button></div><div class="figbox"></div><p class="cap">${nb("Schéma d'après une photographie. Vue de dessus, tête en haut.")}</p>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F) * 0.95, gap = F * 0.6, pw = (W - gap) / 2, lab = seg ? F * 1.9 : F * 0.3, s = Math.min((pw - lab - F * 0.3) / 100, F * 13 / 130), H = F * 1.8 + 130 * s + F * 0.5;
    const one = (x0, f, title) => {
      const ox = x0 + lab + (pw - lab - 100 * s) / 2, oy = F * 1.8;
      let g = `<rect x="${f1(x0)}" y="${f1(F * 1.45)}" width="${f1(pw)}" height="${f1(H - F * 1.45)}" rx="12" style="fill:#f4efe3;stroke:var(--line)"/>` + sX(x0 + pw / 2, F * 1.0, title, "middle", tk, 'font-weight="800"');
      g += `<g transform="translate(${f1(ox)} ${f1(oy)}) scale(${s.toFixed(3)})">${flyG(f, f.wing === "4" ? "wm" : "wn")}`;
      if (seg) Object.entries({ T1: SEGP.T1, T2: SEGP.T2, T3: f.wing === "4" ? SEGP.T3f : SEGP.T3n }).forEach(([k, p]) => { g += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${p[2]}" ry="${p[3]}" style="fill:${SEGC[k]};fill-opacity:.28;stroke:${SEGC[k]};stroke-width:${f1(2.2 / s * 0.6)};stroke-dasharray:${f1(4 / s)} ${f1(2.5 / s)}"/>`; });
      g += `</g>`;
      if (seg) Object.entries({ T1: SEGP.T1, T2: SEGP.T2, T3: f.wing === "4" ? SEGP.T3f : SEGP.T3n }).forEach(([k, p], i) => {
        const yy = oy + p[1] * s, xe = ox + (p[0] - p[2]) * s, xl = x0 + F * 0.25, ly = oy + (24 + i * 18) * s;
        g += `<line x1="${f1(xl + F * 1.2)}" y1="${f1(ly - tk * 0.35)}" x2="${f1(xe)}" y2="${f1(yy)}" style="stroke:${SEGC[k]};stroke-width:2"/>` + sX(xl, ly, k, "start", tk, `style="fill:${SEGC[k]};font-weight:800"`);
      });
      if (seg && f.wing !== "4") { const bx = ox + 63 * s, by = oy + 62 * s; g += `<line x1="${f1(bx + 3)}" y1="${f1(by + 3)}" x2="${f1(x0 + pw - F * 0.3)}" y2="${f1(oy + 75 * s)}" style="stroke:#1b1a12;stroke-width:1.4"/>` + sX(x0 + pw - F * 0.3, oy + 75 * s + tk * 1.1, "balancier", "end", tk * 0.92, `font-weight="700" style="fill:#1b1a12"`); }
      return g;
    };
    const sh = pw < F * 9.5;
    return `<svg viewBox="0 0 ${W} ${f1(H)}" width="${W}" height="${f1(H)}" role="img" aria-label="Deux drosophiles vues de dessus. À gauche, une drosophile normale : deux ailes et deux petits balanciers. À droite, une drosophile mutante : quatre ailes, sans balanciers.${seg ? " Les segments T1, T2 et T3 du thorax sont colorés." : ""}">${one(0, WILD, sh ? "Normale" : "Drosophile normale")}${one(pw + gap, Object.assign({}, WILD, { wing: "4" }), sh ? "Mutante" : "Drosophile mutante")}</svg>`;
  });
  const b = $("[data-seg]", el), upd = () => { b.textContent = seg ? "🔍 Masquer les segments du thorax" : "🔍 Afficher les segments du thorax (T1, T2, T3)"; b.setAttribute("aria-pressed", seg); fig.draw(); };
  b.onclick = () => { seg = !seg; xst().seg4 = seg; if (seg) xst().segVu = 1; keep(); upd(); };
  upd();
};

/* ---------- 2 · le labo des mutations : cellule de l'aile ou spermatozoïde ? ---------- */
const MPH = { A: [0, 0.22], B: [0.22, 0.48], C: [0.48, 0.74], D: [0.74, 1] };
function cellG(cx, cy, r, mut, k, sperm) {
  /* une cellule avec une paire de chromosomes (spermatozoïde : un seul chromosome de la paire) ; le gène est une bande ; mut = 0..1 */
  let g = "";
  if (sperm) {
    g += `<path d="M${f1(cx - r * 0.9)},${f1(cy)} C${f1(cx - r * 1.6)},${f1(cy - r * 0.5)} ${f1(cx - r * 2.1)},${f1(cy + r * 0.5)} ${f1(cx - r * 2.8)},${f1(cy)}" style="fill:none;stroke:#7d8fa6;stroke-width:${f1(Math.max(1.5, r * 0.09))};stroke-linecap:round"/>`;
    g += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(r * 0.95)}" ry="${f1(r * 0.7)}" style="fill:var(--spz);stroke:var(--ink);stroke-width:1.4"/>`;
  } else g += `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" style="fill:#f3e6c4;stroke:#7a6a45;stroke-width:1.6"/><circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r * 0.62)}" style="fill:#e3f0d8;stroke:#6b8a5b;stroke-width:1.2"/>`;
  const L = r * (sperm ? 0.95 : 0.9), cw = Math.max(3, r * 0.14), xs = sperm ? [cx] : [cx - r * 0.16, cx + r * 0.16];
  xs.forEach((x, i) => {
    g += `<rect x="${f1(x - cw / 2)}" y="${f1(cy - L / 2)}" width="${f1(cw)}" height="${f1(L)}" rx="${f1(cw / 2)}" style="fill:#1aa596;stroke:#2d3b33;stroke-width:.8"/>`;
    const m = i === 0 ? mut : 0;
    g += `<rect x="${f1(x - cw / 2)}" y="${f1(cy - L / 2 + L * 0.16)}" width="${f1(cw)}" height="${f1(L * 0.12)}" style="fill:${m > 0.5 ? MUT : "#6a1f60"}"/>`;
    if (m > 0.5) g += star(x + cw * 1.7, cy - L / 2 + L * 0.22, Math.max(4.5, r * 0.17));
  });
  return g;
}
WID.mutlab = el => {
  const X = xst(); X.mut = X.mut || {};
  let ch = X.mch === "spz" ? "spz" : "aile", P = 0, ctl = null;
  el.innerHTML = `<p class="lead">${nb("Une mutation se produit dans une cellule du père. Choisis cette cellule, puis lance l'animation et observe ses descendants.")}</p>
    <div class="seg" role="group" aria-label="Cellule du père touchée par la mutation"><button type="button" data-c="aile">Une cellule de l'aile</button><button type="button" data-c="spz">Un spermatozoïde</button></div>
    <div class="row animctl"></div><div class="figbox"></div><p class="readout" aria-live="polite"></p>
    <div class="mres"></div>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F) * 0.92, ph = F * 7, gp = F * 0.45, H = ph * 4 + gp * 3, gm = ch === "spz";
    const at = k => ss(MPH[k][0], MPH[k][1], P), on = k => P >= MPH[k][0] - 1e-6;
    let g = "";
    const panel = (k, i, title) => { const y0 = i * (ph + gp); g += `<rect x="0.5" y="${f1(y0 + 0.5)}" width="${W - 1}" height="${f1(ph - 1)}" rx="12" style="fill:var(--surface-2);stroke:var(--line);opacity:${on(k) ? 1 : 0.45}"/>` + sX(F * 0.5, y0 + F * 1.05, title, "start", tk, `font-weight="800" style="opacity:${on(k) ? 1 : 0.55}"`); return y0; };
    /* 1 · la mutation */
    let y0 = panel("A", 0, "1 · La mutation chez le père"), s = (ph - F * 1.6) / 130 * (W < F * 24 ? 0.82 : 1), fx = F * 0.6, fy = y0 + F * 1.35;
    g += `<rect x="${f1(fx - 3)}" y="${f1(fy - 3)}" width="${f1(100 * s + 6)}" height="${f1(130 * s + 4)}" rx="8" style="fill:#f4efe3"/><g transform="translate(${f1(fx)} ${f1(fy)}) scale(${s.toFixed(3)})">${flyG(WILD, "mp")}</g>`;
    const tgt = gm ? [50, 104] : [80, 78], tx = fx + tgt[0] * s, ty = fy + tgt[1] * s, mA = ss(0.08, 0.13, P);
    const nar = W < F * 24, zr = Math.min(ph * (nar ? 0.29 : 0.33), W * 0.15), zx = Math.max(fx + 100 * s + zr * (gm ? 3.4 : 1.6), W * 0.62), zy = y0 + ph * (nar ? 0.5 : 0.58);
    if (!gm && P > 0.13) { const pr = lerp(1.5, 8, ss(0.13, 0.42, P)) * s; g += `<circle cx="${f1(tx)}" cy="${f1(ty)}" r="${f1(pr)}" style="fill:${MUT};opacity:.75"/>`; }
    g += `<circle cx="${f1(tx)}" cy="${f1(ty)}" r="${f1(Math.max(F * 0.45, 6 * s))}" style="fill:none;stroke:var(--bad);stroke-width:2.4"/>`;
    g += `<line x1="${f1(tx)}" y1="${f1(ty)}" x2="${f1(zx - zr * (gm ? 2.9 : 1.05))}" y2="${f1(zy)}" style="stroke:var(--muted);stroke-width:1.5;stroke-dasharray:5 4"/>`;
    g += cellG(zx, zy, zr, mA, 0, gm);
    if (P > 0.06 && P < 0.15) g += `<path d="M${f1(zx + zr * 0.9)},${f1(zy - zr * 1.25)} l${f1(-zr * 0.35)},${f1(zr * 0.55)} l${f1(zr * 0.25)},0 l${f1(-zr * 0.35)},${f1(zr * 0.6)} l${f1(zr * 0.55)},${f1(-zr * 0.72)} l${f1(-zr * 0.25)},0 l${f1(zr * 0.3)},${f1(-zr * 0.43)} Z" style="fill:#ffd23f;stroke:#7a5b00;stroke-width:1.2"/>`;
    g += nar ? sX(zx, y0 + ph - tk * 0.35, "zoom", "middle", tk * 0.88, 'font-weight="700"') : sX(Math.min(W - F * 0.4, zx + zr), y0 + F * 1.05, gm ? "Zoom : un spermatozoïde" : "Zoom : une cellule de l'aile", "end", tk * 0.9, 'font-weight="700"');
    /* 2 · la fécondation */
    y0 = panel("B", 1, "2 · La fécondation");
    if (on("B")) {
      const b = at("B"), ox = W * 0.74, oyy = y0 + ph * 0.52, orr = Math.min(ph * 0.29, W * 0.14), sr = Math.max(F * 0.42, orr * 0.24);
      g += `<circle cx="${f1(ox)}" cy="${f1(oyy)}" r="${f1(orr)}" style="fill:var(--ovu);stroke:var(--ink);stroke-width:1.5"/><circle cx="${f1(ox)}" cy="${f1(oyy)}" r="${f1(orr * 0.32)}" style="fill:#e3f0d8;stroke:#6b8a5b"/>`;
      g += sX(ox, y0 + ph - tk * 0.4, b > 0.95 ? "cellule-œuf" : "ovule", "middle", tk * 0.9, 'font-weight="700"');
      [0, 1, 2].forEach(j => {
        const sx0 = F * 2.6 + j * F * 0.2, sy0 = y0 + ph * (0.38 + j * 0.24), win = j === 1, ex = win ? ox - orr * 0.55 : ox - orr - sr * (2.2 + j), ey = win ? oyy : sy0 + (oyy - sy0) * 0.3;
        const xx = lerp(sx0, ex, ss(0, win ? 1 : 0.85, b)), yy = lerp(sy0, ey, ss(0, 1, b));
        if (win && b > 0.97) return;
        g += cellG(xx, yy, sr, win && gm ? 1 : 0, 0, true);
      });
      if (b > 0.97) g += cellG(ox, oyy, orr * 0.55, gm ? 1 : 0, 0, false).replace(/#f3e6c4/, "var(--ovu)");
      g += sX(F * 0.5, y0 + ph - tk * 0.4, W < F * 24 ? "spermatozoïdes" : "spermatozoïdes du père", "start", tk * 0.9, 'font-weight="700"');
    }
    /* 3 · les premières mitoses */
    y0 = panel("C", 2, "3 · Les premières mitoses");
    if (on("C")) {
      const c = at("C"), kk = Math.min(3, Math.floor(c * 4)), n = 2 ** kk, cr = Math.min(ph * 0.3, W * 0.12) / (1 + kk * 0.45), cx0 = W * 0.6, cy0 = y0 + ph * 0.56;
      const pos = n === 1 ? [[0, 0]] : n === 2 ? [[-0.5, 0], [0.5, 0]] : n === 4 ? [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]] : [[-1.5, -0.5], [-0.5, -0.5], [0.5, -0.5], [1.5, -0.5], [-1.5, 0.5], [-0.5, 0.5], [0.5, 0.5], [1.5, 0.5]];
      pos.forEach(([a, bq]) => { const x = cx0 + a * cr * 2.1, y = cy0 + bq * cr * 2.1; g += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(cr)}" style="fill:#f3e6c4;stroke:#7a6a45;stroke-width:1.3"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(cr * 0.45)}" style="fill:#e3f0d8;stroke:#6b8a5b"/>`; if (gm) g += star(x, y, Math.max(4, cr * 0.32)); });
      g += sX(F * 0.5, y0 + ph * 0.6, `${n} cellule${n > 1 ? "s" : ""}`, "start", tk, 'font-weight="800"');
    }
    /* 4 · le descendant */
    y0 = panel("D", 3, W < F * 24 ? "4 · Un descendant" : "4 · Un descendant, zoom sur trois de ses cellules");
    if (on("D")) {
      const d = at("D"), sF = (ph - F * 1.6) / 130 * (W < F * 24 ? 0.82 : 1), s2 = sF * lerp(0.55, 1, d);
      g += `<rect x="${f1(F * 0.6 - 3)}" y="${f1(y0 + F * 1.35 - 3)}" width="${f1(100 * s2 + 6)}" height="${f1(130 * s2 + 4)}" rx="8" style="fill:#f4efe3"/><g transform="translate(${f1(F * 0.6)} ${f1(y0 + F * 1.35)}) scale(${s2.toFixed(3)})">${flyG(WILD, "md")}</g>`;
      if (d > 0.5) { const xs = F * 0.6 + 100 * sF + F * 0.9, zr2 = Math.min(ph * 0.22, (W - xs - F * 0.3) / 7.4); ["œil", "aile", "patte"].forEach((nm, j) => { const x = xs + zr2 * (1.15 + j * 2.55), y = y0 + ph * 0.52; g += cellG(x, y, zr2, gm ? 1 : 0, 0, false) + sX(x, y + zr2 + tk, nm, "middle", tk * 0.88, 'font-weight="700"'); }); }
    }
    return `<svg viewBox="0 0 ${W} ${f1(H)}" width="${W}" height="${f1(H)}" role="img" aria-label="${gm ? "Mutation dans un spermatozoïde du père" : "Mutation dans une cellule de l'aile du père"} : animation en quatre étapes, la mutation, la fécondation, les premières mitoses, un descendant.">${g}</svg>`;
  });
  const MSG = () => {
    const gm = ch === "spz";
    if (P <= 0) return "Touche « Lancer » pour démarrer l'animation.";
    if (P < MPH.A[1]) return gm ? "⚡ Une mutation modifie un gène dans un spermatozoïde : un nouvel allèle apparaît (★)." : "⚡ Une mutation modifie un gène dans une cellule de l'aile : un nouvel allèle apparaît (★).";
    if (P < MPH.B[1]) return gm ? "Imaginons que ce spermatozoïde féconde un ovule." : "La cellule mutée se divise : une petite tache de cellules mutées apparaît dans l'aile du père. Un spermatozoïde du père féconde un ovule.";
    if (P < MPH.C[1]) return "La cellule-œuf se divise par mitoses : toutes les cellules de l'embryon sont des copies de la cellule-œuf.";
    return "Observe les cellules du descendant.";
  };
  const res = () => { $(".mres", el).innerHTML = `<p class="kicker">Mes expériences</p><ul class="ul"><li>Mutation dans une cellule de l'aile : ${X.mut.aile ? "✓ animation observée jusqu'au bout" : "pas encore observée"}</li><li>Mutation dans un spermatozoïde : ${X.mut.spz ? "✓ animation observée jusqu'au bout" : "pas encore observée"}</li></ul>`; };
  const upd = () => { press(el, "c", ch); fig.draw(); $(".readout", el).innerHTML = nb(MSG()); };
  ctl = animCtl($(".animctl", el), 10000, p => { P = p; if (p >= 1 && !X.mut[ch]) { X.mut[ch] = 1; keep(); res(); } upd(); });
  $$("[data-c]", el).forEach(b => b.onclick = () => { ch = b.dataset.c; X.mch = ch; keep(); ctl.set(0); upd(); });
  res(); upd();
};

/* ======================= 3 · Lamarck et Darwin ======================= */
const TXT = {
  L: { who: "Selon Lamarck (1744 – 1829)", intro: "Jean-Baptiste de Lamarck est un naturaliste français qui fut l'un des premiers à élaborer une théorie de l'évolution, appelée « transformisme ». Voici comment il tente d'expliquer la longueur du cou de la girafe :",
    segs: ["« (…) on sait que cet animal, le plus grand des mammifères,", "habite l'intérieur de l'Afrique,", "et qu'il vit dans des lieux où la terre, presque toujours aride et sans herbage,", "l'oblige de brouter le feuillage des arbres,", "et de s'efforcer continuellement d'y atteindre.", "Il est résulté de cette habitude soutenue depuis longtemps,", "dans tous les individus de sa race,", "que ses jambes de devant sont devenues plus longues que celles de derrière,", "et que son col s'est tellement allongé,", "que la girafe, sans se dresser sur ses jambes de derrière, élève sa tête et atteint à six mètres de hauteur (…).", "Les efforts dans un sens quelconque, longtemps soutenus ou habituellement faits par certaines parties d'un corps vivant,", "pour satisfaire des besoins exigés par la nature ou par les circonstances,", "étendent ces parties,", "et leur font acquérir des dimensions et une forme qu'elles n'eussent jamais obtenues,", "si ces efforts ne fussent point devenus l'action habituelle des animaux qui les ont exercés. »"],
    key: [3, 4, 5, 6, 8, 10, 12, 13] },
  D: { who: "Selon Darwin (1809 – 1882)", intro: "Charles Darwin est un naturaliste anglais. Dans son ouvrage le plus connu, « L'Origine des espèces », il décrit sa théorie de la « sélection naturelle ». Voici comment il tente d'expliquer la longueur du cou de la girafe :",
    segs: ["« La haute stature, l'allongement du cou, des membres antérieurs, de la tête et de la langue", "sont chez la Girafe des conditions qui adaptent admirablement sa charpente entière à l'habitude de brouter sur les branches élevées des arbres.", "Elle peut ainsi trouver une nourriture hors de portée pour les autres Ongulés habitant le même pays,", "ce qui doit, pendant les disettes, lui être très avantageux (…).", "De même pour la Girafe naissante dans la nature,", "les individus les plus élevés et capables ainsi de brouter un pouce ou deux plus haut que les autres,", "ont souvent pu être conservés en temps de famine (…).", "Les individus ayant une ou plusieurs parties plus allongées qu'à l'ordinaire,", "ont dû en général seuls survivre.", "Leur croisement a produit des descendants (…)", "héritant des mêmes particularités corporelles,", "(…) tandis que les individus moins favorisés sous les mêmes rapports", "auront été plus exposés à périr. »"],
    key: [3, 4, 5, 6, 7, 8, 10, 11, 12] } };
const hlN = k => ((xst().hl || {})[k] || []).length;
WID.surligneur = el => {
  const X = xst(); X.hl = X.hl || { L: [], D: [] }; ["L", "D"].forEach(k => { if (!Array.isArray(X.hl[k])) X.hl[k] = []; });
  el.innerHTML = `<p class="lead">${nb("Touche un passage pour le surligner (touche-le à nouveau pour l'effacer). Surligne les éléments importants de la théorie de Lamarck, puis de celle de Darwin : au moins trois passages dans chaque texte.")}</p>
    <div class="hlg">${["L", "D"].map(k => `<section class="hlt" aria-label="${esc(TXT[k].who)}"><p class="hlw">${TXT[k].who}</p><p class="hli">${nb(TXT[k].intro)}</p><p class="hlq">${TXT[k].segs.map((s, i) => `<span role="button" tabindex="0" class="hlseg" data-k="${k}" data-i="${i}" aria-pressed="false">${nb(s)}</span>`).join(" ")}</p></section>`).join("")}</div>
    <p class="readout" aria-live="polite"></p>
    <div class="row"><button type="button" class="btn ghost" data-cmp></button><button type="button" class="btn ghost" data-clr>Effacer mes surlignages</button></div><p class="cmpmsg lead" aria-live="polite"></p>`;
  const upd = () => {
    $$(".hlseg", el).forEach(b => { const k = b.dataset.k, i = +b.dataset.i, on = X.hl[k].includes(i), key = TXT[k].key.includes(i); b.setAttribute("aria-pressed", on); b.classList.toggle("key", !!X.cmp && key); b.setAttribute("aria-label", `${b.textContent}${on ? " (surligné)" : ""}${X.cmp && key ? " (idée importante)" : ""}`); });
    const nL = hlN("L"), nD = hlN("D"), ready = nL >= 3 && nD >= 3;
    $(".readout", el).innerHTML = nb(`Passages surlignés : Lamarck <b>${nL}</b> · Darwin <b>${nD}</b>${ready ? " ✓" : " (au moins 3 dans chaque texte)"}.`);
    const cb = $("[data-cmp]", el); cb.disabled = !ready; cb.textContent = X.cmp ? "Masquer les idées importantes" : "👀 Comparer avec les idées importantes"; cb.setAttribute("aria-pressed", !!X.cmp);
    $(".cmpmsg", el).innerHTML = X.cmp ? nb(["L", "D"].map(k => { const hit = TXT[k].key.filter(i => X.hl[k].includes(i)).length; return `${k === "L" ? "Lamarck" : "Darwin"} : ${hit}/${TXT[k].key.length} idées importantes surlignées`; }).join(" · ") + ". Les idées importantes sont soulignées en vert.") : ready ? "" : "La comparaison se débloque quand tu as surligné au moins trois passages dans chaque texte.";
  };
  $$(".hlseg", el).forEach(b => { const tog = () => { const k = b.dataset.k, i = +b.dataset.i, a = X.hl[k], j = a.indexOf(i); if (j >= 0) a.splice(j, 1); else a.push(i); keep(); upd(); }; b.onclick = tog; b.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tog(); } }; });
  $("[data-cmp]", el).onclick = () => { X.cmp = !X.cmp; keep(); upd(); };
  armButton($("[data-clr]", el), "Effacer mes surlignages", "Confirmer l'effacement ?", () => { X.hl = { L: [], D: [] }; X.cmp = false; keep(); upd(); });
  upd();
};

/* ---------- girafes : dessin commun ---------- */
/* x : milieu du corps ; gy : sol ; u : pixels par mètre ; neck : longueur du cou (m) ; o : { baby (échelle), grey, fall (0..1), op } */
function giraffe(x, gy, u, neck, o) {
  o = o || {};
  const k = o.baby || 1, legH = 1.75 * u * k, bodyH = 0.8 * u * k, bodyW = 1.5 * u * k, by = gy - legH - bodyH * 0.45;
  const col = o.grey ? "#a59f95" : "#dba443", spot = o.grey ? "#7b756c" : "#8a5326", ink = o.grey ? "#5e5a53" : "#5b3412", lw = Math.max(2, 0.16 * u * k);
  let g = "";
  [-0.42, -0.25, 0.25, 0.42].forEach(f => { g += `<line x1="${f1(x + f * bodyW)}" y1="${f1(by)}" x2="${f1(x + f * bodyW)}" y2="${f1(gy)}" style="stroke:${col};stroke-width:${f1(lw)};stroke-linecap:round"/>`; });
  const nx0 = x + bodyW * 0.3, ny0 = by - bodyH * 0.1, nx1 = x + bodyW * 0.5, ny1 = by - bodyH * 0.45 - neck * u * k;
  g += `<line x1="${f1(x - bodyW * 0.5)}" y1="${f1(by - bodyH * 0.1)}" x2="${f1(x - bodyW * 0.62)}" y2="${f1(by + bodyH * 0.55)}" style="stroke:${ink};stroke-width:${f1(lw * 0.45)};stroke-linecap:round"/>`;
  g += `<line x1="${f1(nx0)}" y1="${f1(ny0)}" x2="${f1(nx1)}" y2="${f1(ny1)}" style="stroke:${col};stroke-width:${f1(lw * 2)};stroke-linecap:round"/>`;
  g += `<ellipse cx="${f1(x)}" cy="${f1(by)}" rx="${f1(bodyW / 2)}" ry="${f1(bodyH / 2)}" style="fill:${col}"/>`;
  [[-0.25, -0.1], [0.05, 0.12], [0.28, -0.15], [-0.05, -0.28]].forEach(([a, b]) => { g += `<circle cx="${f1(x + a * bodyW)}" cy="${f1(by + b * bodyH)}" r="${f1(bodyH * 0.13)}" style="fill:${spot}"/>`; });
  for (let t = 0.25; t < 0.9; t += 0.3) g += `<circle cx="${f1(lerp(nx0, nx1, t))}" cy="${f1(lerp(ny0, ny1, t))}" r="${f1(lw * 0.45)}" style="fill:${spot}"/>`;
  g += `<ellipse cx="${f1(nx1 + 0.22 * u * k)}" cy="${f1(ny1 + 0.04 * u * k)}" rx="${f1(0.32 * u * k)}" ry="${f1(0.15 * u * k)}" style="fill:${col}"/>`;
  g += `<line x1="${f1(nx1 - 0.02 * u * k)}" y1="${f1(ny1 - 0.08 * u * k)}" x2="${f1(nx1 - 0.06 * u * k)}" y2="${f1(ny1 - 0.3 * u * k)}" style="stroke:${ink};stroke-width:${f1(lw * 0.4)};stroke-linecap:round"/>`;
  const fall = o.fall || 0, op = o.op === undefined ? 1 : o.op;
  return `<g style="opacity:${op.toFixed(2)}" ${fall ? `transform="rotate(${f1(-82 * fall)} ${f1(x)} ${f1(gy)})"` : ""}>${g}</g>`;
}
const reachOf = neck => 2.57 + neck; /* hauteur atteinte (m), tête comprise, pour un cou de longueur « neck » (girafe adulte) */
const neckOf = (h, k) => h / (k || 1) - 2.57; /* cou à dessiner pour atteindre h avec une girafe à l'échelle k */
/* arbre : feuillage entre 3 et 6,3 m ; cut = hauteur sous laquelle les feuilles ont été mangées (famine) */
function tree(x, gy, u, cut, op) {
  let g = `<rect x="${f1(x - 0.18 * u)}" y="${f1(gy - 3.4 * u)}" width="${f1(0.36 * u)}" height="${f1(3.4 * u)}" style="fill:#7a5230"/>`;
  g += `<path d="M${f1(x)},${f1(gy - 2.6 * u)} L${f1(x - 1.1 * u)},${f1(gy - 3.6 * u)} M${f1(x)},${f1(gy - 3.0 * u)} L${f1(x + 1.0 * u)},${f1(gy - 4.0 * u)} M${f1(x)},${f1(gy - 3.3 * u)} L${f1(x - 0.8 * u)},${f1(gy - 4.6 * u)}" style="stroke:#7a5230;stroke-width:${f1(Math.max(2, 0.12 * u))};stroke-linecap:round"/>`;
  const blobs = [[-0.9, 3.6, 0.8], [0.8, 3.9, 0.85], [-0.4, 4.6, 0.95], [0.6, 5.1, 0.9], [-0.7, 5.5, 0.75], [0.1, 5.9, 0.8]];
  const id = "tc" + Math.round(x) + "_" + Math.round(gy);
  g += `<clipPath id="${id}"><rect x="${f1(x - 3 * u)}" y="0" width="${f1(6 * u)}" height="${f1(gy - (cut || 0) * u)}"/></clipPath><g clip-path="url(#${id})">`;
  blobs.forEach(([a, h, r]) => { g += `<ellipse cx="${f1(x + a * u)}" cy="${f1(gy - h * u)}" rx="${f1(r * u)}" ry="${f1(r * 0.62 * u)}" style="fill:#4e9a3a;opacity:${(op === undefined ? 1 : op).toFixed(2)}"/>`; });
  return g + `</g>`;
}

/* ---------- 3 · deux scénarios animés ---------- */
WID.scenarios = el => {
  let P = 0;
  el.innerHTML = `<p class="lead">${nb("Lance l'animation : elle rejoue côte à côte le scénario de Lamarck et celui de Darwin, sur trois générations de girafes.")}</p><div class="row animctl"></div><div class="figbox"></div><div class="scap"></div>`;
  const CAP = {
    L: ["Génération 1 : les girafes s'étirent sans cesse pour atteindre les feuilles. Leur cou s'allonge au cours de leur vie.", "Leurs petits naissent avec le cou allongé par les efforts de leurs parents, et s'étirent à leur tour.", "Génération après génération, le cou s'allonge : les girafes atteignent les feuilles élevées."],
    D: ["Génération 1 : dès leur naissance, les girafes ont des cous de longueurs différentes.", "Famine : il ne reste des feuilles qu'en hauteur. Les girafes au cou trop court ne se nourrissent plus et meurent.", "Les survivantes ont des petits qui héritent de leur long cou."] };
  const stage = () => P < 1 / 3 ? 0 : P < 2 / 3 ? 1 : 2;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F) * 0.95, two = W >= F * 26, gap = F * 0.5, pw = two ? (W - gap) / 2 : W, ph = F * 10.5, H = two ? ph : ph * 2 + gap;
    const pan = (x0, y0, who) => {
      const gy = y0 + ph - F * 0.7, u = (ph - F * 2.4) / 6.6, tx = x0 + pw - 1.75 * u;
      let g = `<rect x="${f1(x0 + 0.5)}" y="${f1(y0 + 0.5)}" width="${f1(pw - 1)}" height="${f1(ph - 1)}" rx="12" style="fill:#e8f3fb;stroke:var(--line)"/><rect x="${f1(x0 + 1)}" y="${f1(gy)}" width="${f1(pw - 2)}" height="${f1(y0 + ph - gy - 1)}" style="fill:#d9c48f"/>`;
      g += sX(x0 + F * 0.5, y0 + F * 1.1, who === "L" ? "Selon Lamarck" : "Selon Darwin", "start", tk, 'font-weight="800" style="fill:#102a33"');
      const st = stage(), xs = [0.16, 0.34, 0.52, 0.7].map(t => x0 + t * (pw - 2.6 * u) + u * 0.6);
      if (who === "L") {
        g += tree(tx, gy, u, 3.9);
        const s0 = ss(0.04, 0.28, P), s1 = ss(0.4, 0.6, P), s2 = ss(0.72, 0.95, P);
        if (st === 0) xs.slice(0, 3).forEach(x => { g += giraffe(x, gy, u, lerp(0.9, 1.45, s0)); if (P > 0.05 && P < 0.3) g += sX(x + 1 * u, gy - (reachOf(lerp(0.9, 1.45, s0)) + 0.4) * u, "↑", "middle", tk * 1.1, `style="fill:#c62828;font-weight:800"`); });
        if (st === 1) { xs.slice(0, 3).forEach(x => { g += giraffe(x, gy, u, 1.45, { op: 1 - ss(0.55, 0.66, P) }); }); xs.slice(0, 3).forEach((x, i) => { g += giraffe(x + 0.9 * u, gy, u, lerp(1.45, 1.8, s1), { baby: lerp(0.45, 1, s1) }); }); }
        if (st === 2) xs.slice(0, 3).forEach(x => { g += giraffe(x + 0.9 * u, gy, u, lerp(1.8, 2.3, s2)); if (P < 0.93) g += sX(x + 1.9 * u, gy - (reachOf(lerp(1.8, 2.3, s2)) + 0.4) * u, "↑", "middle", tk * 1.1, `style="fill:#c62828;font-weight:800"`); });
      } else {
        const cut = st === 0 ? 0 : lerp(3.0, 4.4, ss(0.36, 0.5, P)), necks = [0.95, 1.95, 2.2, 1.2];
        g += tree(tx, gy, u, cut || 3.0);
        if (st === 1 && P > 0.36) g += `<line x1="${f1(x0 + F * 0.3)}" y1="${f1(gy - cut * u)}" x2="${f1(x0 + pw - F * 0.3)}" y2="${f1(gy - cut * u)}" style="stroke:#7a5230;stroke-width:1.6;stroke-dasharray:6 5"/>`;
        if (st < 2) necks.forEach((nk, i) => { const dies = reachOf(nk) < 4.4, fl = st === 1 && dies ? ss(0.5, 0.6, P) : 0; g += giraffe(xs[i], gy, u, nk, { grey: fl > 0, fall: fl, op: st === 1 && dies ? 1 - 0.5 * ss(0.6, 0.66, P) : 1 }); });
        if (st === 2) { const s2 = ss(0.68, 0.9, P); [1, 2].forEach(i => { g += giraffe(xs[i], gy, u, necks[i], { op: 1 - ss(0.86, 0.98, P) * 0.6 }); }); [[0, 2.05], [1, 2.3], [3, 1.9], [2, 2.15]].forEach(([i, nk]) => { g += giraffe(xs[i] + (i === 1 || i === 2 ? 0.9 * u : 0), gy, u, nk, { baby: lerp(0.45, 1, s2) }); }); }
      }
      return g;
    };
    const g = pan(0, 0, "L") + (two ? pan(pw + gap, 0, "D") : pan(0, ph + gap, "D"));
    return `<svg viewBox="0 0 ${W} ${f1(H)}" width="${W}" height="${f1(H)}" role="img" aria-label="Deux scénarios animés pour expliquer le long cou des girafes. ${esc(CAP.L[stage()])} ${esc(CAP.D[stage()])}">${g}</svg>`;
  });
  const upd = () => { const s = stage(); $(".scap", el).innerHTML = `<div class="scg"><p><b>Lamarck · étape ${s + 1}/3</b> · ${nb(CAP.L[s])}</p><p><b>Darwin · étape ${s + 1}/3</b> · ${nb(CAP.D[s])}</p></div>`; fig.draw(); };
  animCtl($(".animctl", el), 15000, p => { P = p; if (p >= 1) { xst().scen = 1; keep(); } upd(); });
};

/* ======================= 4 · Le simulateur de troupeau ======================= */
const HERD = { n: 24, m0: 4.5, sd0: 0.22, mut: 0.07, seed0: 11, seeds: { f: 101, t: 99 }, max: 10 };
const _hc = {};
function herdRun(mode, n) {
  const key = mode + n; if (_hc[key]) return _hc[key];
  const R0 = rng(HERD.seed0); let h = Array.from({ length: HERD.n }, () => Math.max(3.9, Math.min(5.2, HERD.m0 + gauss(R0) * HERD.sd0)));
  const R = rng(HERD.seeds[mode]), gens = [h], surv = [], thr = [];
  for (let g = 0; g < n; g++) {
    let alive, t = null;
    if (mode === "f") { const so = h.slice().sort((a, b) => a - b); t = so[Math.floor(h.length * 0.45)]; alive = h.map(v => R() < 1 / (1 + Math.exp(-(v - t) / 0.03))); }
    else alive = h.map(() => R() < 0.85);
    if (alive.filter(Boolean).length < 4) { const ord = h.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]); ord.slice(0, 4).forEach(([, i]) => { alive[i] = true; }); }
    const Sv = h.filter((v, i) => alive[i]);
    const nx = Array.from({ length: HERD.n }, () => { const a = Sv[Math.floor(R() * Sv.length)], b = Sv[Math.floor(R() * Sv.length)]; return Math.max(3.6, Math.min(6.2, (a + b) / 2 + gauss(R) * HERD.mut)); });
    surv.push(alive); thr.push(t); h = nx; gens.push(h);
  }
  return (_hc[key] = { gens, surv, thr });
}
const meanOf = a => a.reduce((s, v) => s + v, 0) / a.length;
const meanAt = (mode, g) => Math.round(meanOf(herdRun(mode, g).gens[g]) * 100) / 100;
const trS = () => { const X = xst(); X.tr = X.tr || {}; ["f", "t"].forEach(k => { if (!Number.isInteger(X.tr[k])) X.tr[k] = 0; }); if (X.tr.mode !== "t") X.tr.mode = "f"; return X.tr; };
WID.troupeau = el => {
  const T = trS();
  let anim = null, queue = 0;
  el.innerHTML = `<p class="lead">${nb("Un troupeau de 24 girafes vit près d'arbres. À chaque génération, certaines meurent, les autres ont des petits : chaque petit a une taille proche de la moyenne de celle de ses parents, à quelques centimètres près (au hasard). Compare un troupeau qui subit des famines et un troupeau témoin, sans famine, où quelques girafes meurent aussi, au hasard (maladies, prédateurs…).")}</p>
    <div class="seg" role="group" aria-label="Troupeau"><button type="button" data-m="f">🏜 Avec famines</button><button type="button" data-m="t">🌳 Sans famine (témoin)</button></div>
    <div class="row"><button type="button" class="btn" data-next></button><button type="button" class="btn ghost" data-five></button><button type="button" class="btn ghost" data-rst>↺ Recommencer ce troupeau</button></div>
    <div class="figbox"></div><p class="readout" aria-live="polite"></p><div class="chartbox"></div>`;
  const fig = liveSVG($(".figbox", el), (W, F) => {
    const tk = TK(F) * 0.9, H = Math.min(Math.max(W * 0.6, F * 12), F * 15.5), gy = H - F * 1.2, u = (gy - F * 1.6) / 6.6, L = F * 2.3, nar = W < F * 26, txr = W - (nar ? 0.9 : 1.8) * u;
    const m = T.mode, n = T[m], run = herdRun(m, Math.min(HERD.max, n + (anim ? 1 : 0)));
    const q = anim ? anim.q : 1, cur = anim ? run.gens[n] : run.gens[n], nxt = anim ? run.gens[n + 1] : null, alive = anim ? run.surv[n] : null, thr = anim ? run.thr[n] : null;
    const famine = m === "f" && anim, cut = famine ? lerp(3.0, thr, ss(0.02, 0.25, q)) : 0;
    let g = `<rect x="0.5" y="0.5" width="${W - 1}" height="${f1(H - 1)}" rx="12" style="fill:${famine ? "#f6ead2" : "#e8f3fb"};stroke:var(--line)"/><rect x="1" y="${f1(gy)}" width="${W - 2}" height="${f1(H - gy - 1)}" style="fill:${m === "f" ? "#d9c48f" : "#a9c97a"}"/>`;
    for (let k = 0; k <= 6; k++) { const y = gy - k * u; g += `<line x1="${f1(L - F * 0.35)}" y1="${f1(y)}" x2="${f1(W - F * 0.3)}" y2="${f1(y)}" style="stroke:rgba(16,42,51,.14);stroke-width:1"/>` + sX(L - F * 0.5, y + tk * 0.35, k === 6 ? "6 m" : String(k), "end", tk, `style="fill:#102a33"`); }
    g += tree(txr, gy, u, famine ? Math.max(3.0, cut) : 0);
    if (famine && q > 0.05) g += `<line x1="${f1(L)}" y1="${f1(gy - cut * u)}" x2="${f1(W - F * 0.3)}" y2="${f1(gy - cut * u)}" style="stroke:#7a5230;stroke-width:1.8;stroke-dasharray:6 5"/>` ; let lab = ""; if (famine && q > 0.05) { const lb = `feuilles ${nar ? "" : "restantes "}au-dessus de ${fmt(cut, 1)} m`, lw2 = lb.length * tk * 0.88 * 0.53, ly = gy - cut * u - F * 0.35; lab += `<rect x="${f1(L + F * 0.05)}" y="${f1(ly - tk * 0.95)}" width="${f1(lw2 + F * 0.3)}" height="${f1(tk * 1.3)}" rx="6" style="fill:#fffaf0;opacity:.9"/>` + sX(L + F * 0.2, ly, lb, "start", tk * 0.88, `style="fill:#5a3a10;font-weight:700"`); }
    const x0 = L + u * 0.4, x1 = txr - (nar ? 1.1 : 1.6) * u, nn = HERD.n, drawn = Array.from({ length: nn }, (_, i) => i).filter(i => !nar || i % 3 === 0), slot = (x1 - x0) / (nar ? drawn.length : nn / 2), kk = Math.max(0.55, Math.min(1, slot * (nar ? 1.35 : 1.9) / (1.5 * u)));
    const pos = i => { if (nar) return [x0 + slot * (drawn.indexOf(i) + 0.5), gy]; const row = i % 2, col = Math.floor(i / 2); return [x0 + slot * (col + (row ? 0.5 : 0)), gy - (row ? F * 0.15 : 0)]; };
    const order = drawn.slice().sort((a, b) => (a % 2) - (b % 2)).reverse();
    order.forEach(i => {
      const [x, y] = pos(i);
      const back = !nar && i % 2 ? 0.6 : 1;
      if (!anim) { g += giraffe(x, y, u, neckOf(cur[i], kk), { baby: kk, op: back }); return; }
      if (q < 0.55) { const dies = !alive[i], fl = dies ? ss(0.22, 0.42, q) : 0; g += giraffe(x, y, u, neckOf(cur[i], kk), { baby: kk, grey: dies && q > 0.2, fall: fl, op: back * (dies ? 1 - 0.7 * ss(0.42, 0.55, q) : 1) }); }
      else { const gr = ss(0.55, 0.95, q); if (alive[i] && q < 0.8) g += giraffe(x, y, u, neckOf(cur[i], kk), { baby: kk, op: back * (1 - ss(0.6, 0.8, q)) }); g += giraffe(x + (alive[i] ? slot * 0.3 : 0), y, u, neckOf(nxt[i], kk), { baby: kk * lerp(0.45, 1, gr), op: back }); }
    });
    if (nar) g += sX(L, H - F * 0.35, "8 girafes sur 24 dessinées", "start", tk * 0.8, `style="fill:#3d3320"`);
    g += lab + sX(W - F * 0.4, F * 1.1, `${m === "f" ? "Avec famines" : "Sans famine (témoin)"} · génération ${anim && q > 0.55 ? n + 1 : n}`, "end", tk, 'font-weight="800" style="fill:#102a33"');
    return `<svg viewBox="0 0 ${W} ${f1(H)}" width="${W}" height="${f1(H)}" role="img" aria-label="Troupeau de 24 girafes ${m === "f" ? "avec famines" : "sans famine"}, génération ${n}. Hauteur moyenne ${fmt(meanOf(run.gens[n]), 2)} mètres. Échelle de hauteur de 0 à 6 mètres à gauche.">${g}</svg>`;
  });
  const chart = () => {
    const pts = k => Array.from({ length: T[k] + 1 }, (_, i) => [i, meanAt(k, i)]);
    mountChart($(".chartbox", el), { type: "line", title: "Hauteur moyenne du troupeau", alt: "Graphique : hauteur moyenne des girafes (en mètres) en fonction de la génération, pour le troupeau avec famines et pour le troupeau témoin.", series: [{ name: "Avec famines", color: "c1", pts: pts("f") }, { name: "Sans famine (témoin)", color: "c2", pts: pts("t") }], xMin: 0, xMax: HERD.max, xStep: 1, yMin: 4.2, yMax: 5.4, yStep: 0.2, xTitle: "Génération", yTitle: "Hauteur moyenne (m)", yFmt: v => fmt(v, 2), xRead: v => "Génération " + v, yRead: v => fmt(v, 2) + " m", markers: true, tableOpen: true });
  };
  const readout = () => { const m = T.mode, h = herdRun(m, T[m]).gens[T[m]]; $(".readout", el).innerHTML = nb(`<b>${m === "f" ? "Avec famines" : "Sans famine (témoin)"}</b> · génération <b>${T[m]}</b> · hauteur moyenne : <b>${fmt(meanOf(h), 2)} m</b> (la plus petite : ${fmt(Math.min(...h), 2)} m ; la plus grande : ${fmt(Math.max(...h), 2)} m). Générations simulées : avec famines ${T.f}/${HERD.max} · témoin ${T.t}/${HERD.max}.`); };
  const btns = () => { press(el, "m", T.mode); const full = T[T.mode] >= HERD.max, busy = !!anim; $("[data-next]", el).textContent = full ? "10 générations simulées" : "▶ Génération suivante"; $("[data-five]", el).textContent = "⏩ 5 générations"; $("[data-next]", el).disabled = full || busy; $("[data-five]", el).disabled = full || busy; $$("[data-m]", el).forEach(b => b.disabled = busy); };
  const step = () => {
    if (T[T.mode] >= HERD.max) { queue = 0; return; }
    anim = { q: 0 }; btns();
    loopWhile(el, dt => { anim.q = Math.min(1, anim.q + dt / (queue > 1 ? 1.3 : 2.4)); fig.draw(); if (anim.q >= 1) { T[T.mode]++; anim = null; keep(); fig.draw(); readout(); chart(); queue = Math.max(0, queue - 1); btns(); if (queue > 0) step(); return false; } });
  };
  $("[data-next]", el).onclick = () => { queue = 1; step(); };
  $("[data-five]", el).onclick = () => { queue = Math.min(5, HERD.max - T[T.mode]); step(); };
  $$("[data-m]", el).forEach(b => b.onclick = () => { T.mode = b.dataset.m; keep(); fig.draw(); readout(); btns(); });
  armButton($("[data-rst]", el), "↺ Recommencer ce troupeau", "Remettre à la génération 0 ?", () => { T[T.mode] = 0; keep(); fig.draw(); readout(); chart(); btns(); });
  readout(); chart(); btns();
};
