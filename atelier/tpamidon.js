/* ===== 2nde SVT · Thème 1 · Métabolisme · TP noté sur 10 (8 points ici + manipulation sur 2 notée par le professeur) : l'action de l'amylase sur l'amidon ===== */
/* Moteur tiré de tpagg.js (TP noté agglutination, 3e) ; paillasse tirée du TP virtuel de pomme_widgets.js. */
Store.key = "svt2-tp-amylase-note-v1";
const META_KEY = "svt2-tp-amylase-note-meta";
const SIGN = "Mr Moreira, Vauban Luxembourg";
const DEF = { fs: 21, theme: null, proj: false, view: "consignes", bench: null, ans: { p1: {}, p2: {}, c: {} }, val: {}, rendu: null };
let S = Store.load(DEF);
if (!S.val || typeof S.val !== "object") S.val = {};
if (!S.ans || typeof S.ans !== "object") S.ans = {}; ["p1", "p2", "c"].forEach(k => { if (!S.ans[k] || typeof S.ans[k] !== "object") S.ans[k] = {}; });
const save = () => Store.save(S);
const meta = () => { try { return JSON.parse(localStorage.getItem(META_KEY) || "{}") || {}; } catch (e) { return {}; } };
const setMeta = m => { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) {} };
const pts = v => String(v).replace(".", ",");

/* ---------- réponses rédigées : éléments attendus repérés sur un texte normalisé (sans accents) ---------- */
const nrm = x => String(x || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").replace(/[’'`\-]/g, " ").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const any = (n, ...re) => re.some(r => r.test(n));
const AMYL = /\bam[iy]l\w*|\benz[iy]m\w*/;                                  // amylase, amilase, amylaze, enzyme…
const SANS_AMYL = n => any(n, /\b(sans|pas|aucune?|absence|n a pas|ne contient pas|ni)( \w+){0,3} (am[iy]l|enz[iy]m)/, /\bseule?s? (difference|chose|changement)/, /\b(compar\w*|differ\w*|temoin)( \w+){0,8} (am[iy]l|enz[iy]m)/, /(am[iy]l|enz[iy]m)\w*( \w+){0,6} (seulement|uniquement|que dans|que le tube 2|juste)/);
const PAS_AMIDON = n => any(n, /\b(plus|pas|aucun|aucune|sans|absence)( de| d| de l| d l)? amidon/, /amidon( \w+){0,5} (a disparu|disparu|disparait|disparaitre|absent|n est plus|n y est plus|plus la|plus present|transforme|degrade|digere|decoupe|coupe|detruit|consomme|hydrolyse|decompose|casse)/, /disparition( \w+){0,2} amidon/);
const ACTION = /transform|digere|digerer|digestion|decoup|coupe|degrad|hydroly|casse|decompos|disparait|disparaitre|fait disparaitre|detruit|change|convert|separ|libere/;

const PA = ["Amidon présent", "Amidon absent"], GL = ["Positif : glucose présent", "Négatif : pas de glucose"];
const PARTS = [
  { id: "p1", n: 1, max: 2, tab: "Partie 1 · Amidon", title: "Partie 1 · Suivre la disparition de l'amidon (eau iodée)", ready: () => p1Done(),
    proto: ["Verser 5 mL d'empois d'amidon dans le tube 1 et dans le tube 2.", "Ajouter 2 mL d'amylase dans le tube 2 seulement : le tube 1 est le témoin.", "Placer les deux tubes au bain-marie à 37 °C.", "Toutes les 3 minutes, de 0 à 12 minutes : prélever quelques gouttes de chaque tube et les tester à l'eau iodée dans un godet de la plaque."],
    items: [{ k: "a", lab: "Tube 1 à 12 minutes (test à l'eau iodée)", o: PA, ans: 0, p: 0.5 }, { k: "b", lab: "Tube 2 à 12 minutes (test à l'eau iodée)", o: PA, ans: 1, p: 0.5 },
      { k: "e", lab: "Dans le tube 2, entre 0 et 12 minutes, la coloration de l'eau iodée…", o: ["passe peu à peu du bleu-noir au jaune", "reste bleu-noir", "passe du jaune au bleu-noir"], ans: 0, p: 0.5 },
      { k: "j", t: "txt", p: 0.5, lab: "Explique ce que montre la coloration de l'eau iodée dans le tube 2 à 12 minutes.", ph: "À 12 minutes, l'eau iodée est … dans le tube 2, donc …",
        crit: [{ lab: "relie la coloration jaune (plus de bleu-noir) à la disparition de l'amidon", p: 0.5, f: n => PAS_AMIDON(n) }],
        model: "À 12 minutes, l'eau iodée reste jaune dans le tube 2 : elle ne devient plus bleu-noir, donc il n'y a plus d'amidon dans ce tube." }] },
  { id: "p2", n: 2, max: 2, tab: "Partie 2 · Glucose", title: "Partie 2 · Rechercher le glucose et analyser le dispositif", ready: () => p2Done(),
    proto: ["À 12 minutes, après le dernier test à l'eau iodée : tremper une bandelette Glucotest dans chaque tube.", "Observer la zone réactive de chaque bandelette."],
    items: [{ k: "a", lab: "Bandelette Glucotest · tube 1", o: GL, ans: 1, p: 0.5 }, { k: "b", lab: "Bandelette Glucotest · tube 2", o: GL, ans: 0, p: 0.5 },
      { k: "c", lab: "Pourquoi place-t-on les tubes à 37 °C ?", o: ["C'est la température du corps humain", "Pour faire bouillir l'amidon", "Pour colorer l'eau iodée"], ans: 0, p: 0.5 },
      { k: "j", t: "txt", p: 0.5, lab: "Justifie le rôle du tube témoin (tube 1).", ph: "Le tube 1 est le témoin : il montre que …",
        crit: [{ lab: "explique que le témoin n'a pas d'amylase (seule différence avec le tube 2) et sert à comparer : sans amylase, l'amidon ne disparaît pas", p: 0.5, f: n => SANS_AMYL(n) }],
        model: "Le tube 1 ne contient pas d'amylase : c'est la seule différence avec le tube 2. Il montre que, sans amylase, l'amidon ne disparaît pas tout seul, même à 37 °C." }] }];
const CONC = [
  { k: "c1", p: 0.5, lab: "Je vois que…", sub: "les résultats des deux tests", o: ["dans le tube 2, l'amidon disparaît et du glucose apparaît, alors que rien ne change dans le tube 1", "dans les deux tubes, l'amidon disparaît et du glucose apparaît", "dans le tube 1, l'amidon disparaît et du glucose apparaît"], ord: [1, 0, 2] },
  { k: "c2", p: 0.5, lab: "Je sais que…", sub: "ce qu'est l'amidon", o: ["l'amidon est une grosse molécule formée de nombreuses molécules de glucose attachées", "l'amidon est formé de molécules d'eau iodée", "le glucose est formé de nombreuses molécules d'amidon"], ord: [2, 0, 1] },
  { k: "c3", p: 0.5, lab: "Or…", sub: "ce qui distingue les deux tubes", o: ["les deux tubes sont dans les mêmes conditions (37 °C, 12 minutes) : seul le tube 2 contient de l'amylase", "le tube 1 contient plus d'amidon que le tube 2", "seul le tube 2 est placé au bain-marie"], ord: [1, 2, 0] },
  { k: "c4", t: "txt", p: 1.5, lab: "Donc…", sub: "rédige : quel est le rôle de l'amylase ? Que devient l'amidon ? Quel type de molécule est l'amylase ?", ph: "Donc l'amylase … l'amidon en … ; c'est une …",
    crit: [{ lab: "attribue la disparition de l'amidon à l'amylase (elle le transforme, le découpe, le digère)", p: 0.5, f: n => AMYL.test(n) && ACTION.test(n) && /amidon/.test(n) },
      { lab: "indique que l'amidon est transformé en glucose", p: 0.5, f: n => any(n, /amidon( \w+){0,6} (en|du|de|des) (glucose|glu)/, /amidon( \w+){0,8} glucose/) && ACTION.test(n) && !/glucose( \w+){0,3} en amidon/.test(n) },
      { lab: "nomme l'amylase comme une enzyme", p: 0.5, f: n => /\benz[iy]m/.test(n) }],
    model: "Donc l'amylase transforme l'amidon en glucose : elle découpe la longue chaîne d'amidon en molécules de glucose. L'amylase est une enzyme." },
  { k: "c5", t: "txt", p: 1, lab: "Mais…", sub: "rédige : limites de l'expérience · que ne montre-t-elle pas ? Que pourrait-on faire de plus ?", ph: "Mais cette expérience … ; pour aller plus loin, on pourrait …",
    crit: [{ lab: "donne une limite : expérience en tube et pas dans le tube digestif, une seule expérience, résultat qualitatif (pas de quantité)", p: 0.5,
        f: n => any(n, /\btubes?\b( \w+){0,6} (pas|non|et non)( \w+){0,4} (corps|intestin|bouche|organisme|tube digestif|estomac|vivant)/, /in vitro/, /(pas|non|n est pas|ne se passe pas)( \w+){0,5} (dans|en) (le |l |un )?(corps|intestin|bouche|organisme|tube digestif|estomac|humain)/, /(une seule|qu une|1 seule|un seul|seulement une|seulement un) (fois|experience|essai|test|manip)/, /\b(repet|refaire|refait|recommenc)\w*/, /quantit|combien|mesur\w*( \w+){0,3} (precis|exact)|qualitati/, /(conditions|realite)( \w+){0,4} differ/, /artificiel/, /simul/) },
      { lab: "propose une expérience complémentaire (répéter, amylase chauffée ou bouillie, autre température, salive, mesurer la quantité de glucose…)", p: 0.5,
        f: n => any(n, /\b(repet|refaire|refait|recommenc|reproduire)\w*/, /(bouill|chauff|cuit|cuite|denatur|100 c|100 degre)/, /(autres?|differente?s?|plusieurs) (temperature|tube|amylase|enzyme|concentration|quantit|aliment|substance|molecule)/, /temperature( \w+){0,3} (differ|autre|plus|froid|chaud|0|10|20|60|80)/, /\bsaliv/, /(pourrait|faudrait|faut|peut|devrait|pour|essayer de)( \w+){0,4} (mesur|dos|quantifi)/, /(sans amidon|autre aliment|pomme de terre|pain|riz)/, /(dans|en) (le |l )?(intestin|corps|bouche)( \w+){0,3} (reel|vrai)/) }],
    model: "Mais l'expérience est faite une seule fois, dans un tube, et non dans le tube digestif : elle ne dit pas ce qui se passe vraiment dans l'intestin. On pourrait la répéter, ou refaire le test avec de l'amylase bouillie pour vérifier que c'est bien l'enzyme qui agit." }];
const MINTXT = 15;
const MAXAPP = 8, MANIP = 2;

/* ---------- paillasse virtuelle (reprise du TP virtuel amylase de pomme_widgets.js) ---------- */
const IO = ["io0", "io1", "io2", "io3", "io4"], ION = ["bleu-noir", "violet", "brun", "jaune-brun", "jaune"];
const ERRK = [["reactif", "mauvais réactif"], ["ordre", "mauvais ordre"], ["contam", "contamination"], ["temoin", "oubli du témoin"]];
const errZero = () => ({ reactif: 0, ordre: 0, contam: 0, temoin: 0 });
const benchNew = keep => ({ t1: false, t2: false, amyl: false, bath: false, time: 0, tested: [0, 0, 0, 0, 0], gluco: false, ruin: null, tool: null, msg: "", err: keep || { p1: errZero(), p2: errZero() } });
function bst() { let b = S.bench; if (!b || !b.tested || !b.err) b = S.bench = benchNew(); ["p1", "p2"].forEach(p => { if (!b.err[p]) b.err[p] = errZero(); }); return b; }
const p1Done = () => !!bst().tested[4], p2Done = () => !!bst().gluco;
const phase = () => p1Done() ? "p2" : "p1";
const errN = (pid, k) => { const e = bst().err[pid]; return k ? e[k] || 0 : ERRK.reduce((s, [x]) => s + (e[x] || 0), 0); };
const TOOLS = [["empois", "🥣", "Empois d'amidon (5 mL)"], ["amyl", "💧", "Amylase (2 mL)"], ["iode", "🟤", "Eau iodée"], ["gluco", "📏", "Bandelette Glucotest"]];
const STEPS = { p1: ["Verse l'empois d'amidon dans les deux tubes.", "Ajoute l'amylase dans le bon tube.", "Place les tubes au bain-marie à 37 °C.", "Teste à l'eau iodée à 0, 3, 6, 9 et 12 minutes."], p2: ["Teste les deux tubes avec une bandelette Glucotest.", "Observe la zone réactive des bandelettes."] };
function prog(pid) { const b = bst(); return pid === "p1" ? [b.t1 && b.t2, b.amyl, b.bath, !!b.tested[4]] : [b.gluco, b.gluco]; }
let an = null, raf = 0;
function drawBench(W, F) {
  const b = bst(), tk = TK(F), now = performance.now(), q = an ? Math.min(1, (now - an.t0) / an.dur) : 1;
  const hb = F * 10, bx0 = W * 0.04, bx1 = W * 0.58, by0 = hb * 0.5, tw = F * 1.6, th = F * 5.2, tx = i => bx0 + (bx1 - bx0) * (0.3 + 0.4 * i), inY = F * 3.4, outY = F * 0.9;
  const ty = an && an.k === "bath" ? outY + (inY - outY) * q : b.bath ? inY : outY;
  const col0 = F * 4.6, cw = (W - col0 - F * 0.4) / 5, r = Math.min(F * 0.95, cw * 0.36), py = hb + F * 2.9, wx = c => col0 + cw * (c + 0.5), wy = i => py + i * F * 2.5;
  let g = `<rect x="${bx0}" y="${by0}" width="${bx1 - bx0}" height="${hb - by0}" rx="8" style="fill:var(--sea);opacity:${b.bath ? 0.3 : 0.12}"/><path d="M${bx0} ${by0 - F * 0.4} L${bx0} ${hb} L${bx1} ${hb} L${bx1} ${by0 - F * 0.4}" style="fill:none;stroke:var(--ink);stroke-width:2.5"/>` + sT(bx0 + 6, hb - 8, "Bain-marie 37 °C", "start", tk * 0.92, 'font-weight="700"');
  if (b.bath) for (let k = 0; k < 5; k++) { const ph = (now / 1400 + k * 0.23) % 1; g += `<circle cx="${bx0 + (bx1 - bx0) * (0.08 + 0.21 * k)}" cy="${hb - 6 - ph * (hb - by0 - 10)}" r="${2 + (k % 2)}" style="fill:var(--surface);opacity:${0.7 * (1 - ph)}"/>`; }
  [0, 1].forEach(i => { const x = tx(i), full = i ? b.t2 : b.t1, fillQ = an && an.k === "empois" && an.i === i ? q : full ? 1 : 0, ruined = b.ruin && b.ruin.i === i;
    if (fillQ > 0) g += `<rect x="${x - tw / 2 + 2}" y="${ty + th * (1 - 0.6 * fillQ)}" width="${tw - 4}" height="${Math.max(0, th * 0.6 * fillQ - 3)}" rx="${tw * 0.4}" style="fill:var(--${ruined && b.ruin.k === "iode" ? "io0" : "starch"})"/>`;
    if (i === 1 && b.amyl) g += `<rect x="${x - tw / 2 + 2}" y="${ty + th * 0.4}" width="${tw - 4}" height="${th * 0.12}" style="fill:var(--c3);opacity:.35"/>`;
    if (ruined && b.ruin.k === "amyl") g += `<rect x="${x - tw / 2 + 2}" y="${ty + th * 0.4}" width="${tw - 4}" height="${th * 0.12}" style="fill:var(--c3);opacity:.35"/>`;
    g += `<path d="M${x - tw / 2} ${ty} L${x - tw / 2} ${ty + th - tw / 2} Q${x - tw / 2} ${ty + th} ${x} ${ty + th} Q${x + tw / 2} ${ty + th} ${x + tw / 2} ${ty + th - tw / 2} L${x + tw / 2} ${ty}" style="fill:none;stroke:var(--${ruined ? "bad" : "ink"});stroke-width:2.4"/>` + sT(x, ty - 6, "Tube " + (i + 1) + ((i === 1 && b.amyl) || (ruined && b.ruin.k === "amyl") ? " + A" : ""), "middle", tk * 0.92, 'font-weight="800"');
    if (ruined) g += sT(x, ty + th * 0.55, "✖", "middle", tk * 1.6, 'font-weight="800" style="fill:var(--bad)"'); });
  if (an && an.k === "amyl") g += `<circle cx="${tx(an.i)}" cy="${-4 + (ty + th * 0.4 + 4) * q}" r="${F * 0.22}" style="fill:var(--c3)"/>`;
  const clock = an && an.k === "wait" ? Math.round((b.time - 3 + 3 * q) * 10) / 10 : b.time;
  g += sT(W - 6, F * 1.3, "⏱ " + String(clock).replace(".", ",") + " min", "end", tk * 1.25, 'font-weight="800"');
  [0, 1].forEach(i => { const x = W * (0.7 + 0.16 * i), dip = an && an.k === "gluco" ? Math.sin(Math.min(1, q * 2) * Math.PI) * F * 1.2 : 0, on = b.gluco && (!an || an.k !== "gluco" || q > 0.5);
    g += `<rect x="${x - F * 0.35}" y="${F * 2.6 + dip}" width="${F * 0.7}" height="${F * 3.2}" rx="3" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.5"/><rect x="${x - F * 0.35}" y="${F * 4.9 + dip}" width="${F * 0.7}" height="${F * 0.9}" style="fill:var(--${on ? (i ? "gpos" : "gneg") : "well"});stroke:var(--ink);stroke-width:1.5"/>` + sT(x, F * 7, "B" + (i + 1), "middle", tk * 0.9, 'font-weight="700"'); });
  g += sT(W * 0.78, F * 8.1, "Glucotest", "middle", tk * 0.9);
  g += `<rect x="2" y="${hb + F * 0.5}" width="${W - 4}" height="${F * 7}" rx="10" style="fill:var(--surface-2);stroke:var(--line)"/>`;
  for (let c = 0; c < 5; c++) g += sT(wx(c), py - r - 7, c * 3 + (cw > F * 3.2 ? " min" : "′"), "middle", tk * 0.9, 'font-weight="700"');
  [0, 1].forEach(i => { g += sT(8, wy(i) + tk * 0.35, "Tube " + (i + 1), "start", tk * 0.9, 'font-weight="700"');
    for (let c = 0; c < 5; c++) { const cur = an && an.k === "sample" && an.c === c, done = b.tested[c] && !cur, col = IO[i ? c : 0];
      g += `<circle cx="${wx(c)}" cy="${wy(i)}" r="${r}" style="fill:var(--well);stroke:var(--ink);stroke-width:1.8"/>` + (done || (cur && q > 0.45) ? `<circle cx="${wx(c)}" cy="${wy(i)}" r="${r - 2}" style="fill:var(--${cur && q < 0.7 ? "starch" : col});opacity:${cur ? Math.min(1, (q - 0.45) * 4) : 1}"/>` : "");
      if (cur && q <= 0.45) { const u = q / 0.45; g += `<circle cx="${tx(i) + (wx(c) - tx(i)) * u}" cy="${ty + (wy(i) - ty) * u - Math.sin(u * Math.PI) * F * 2}" r="${F * 0.2}" style="fill:var(--starch);stroke:var(--ink);stroke-width:1"/>`; } } });
  return `<svg viewBox="0 0 ${W} ${hb + F * 7.8}" width="${W}" height="${hb + F * 7.8}" role="img" aria-label="Paillasse : deux tubes, un bain-marie, une plaque à godets et deux bandelettes Glucotest. Tes observations sont reprises dans le tableau sous le dessin.">${g}</svg>`;
}
/* tableau d'observations : couleurs seulement, jamais l'interprétation */
function obsHTML() {
  const b = bst(), rows = b.tested.map((x, c) => x ? [c * 3 + " min", ION[0], ION[c]] : null).filter(Boolean);
  if (b.gluco) rows.push(["Glucotest", "jaune", "verte"]);
  return rows.length ? tbl(["Test", "Tube 1", "Tube 2"], rows) : `<p class="cap">${nb("Tes observations s'afficheront ici.")}</p>`;
}
function benchClick(e, el, after) {
  const b = bst(); if (S.rendu || an) return;
  const t = e.target.closest("[data-tool],[data-tgt],[data-act]"); if (!t) return;
  const P = phase(), err = (k, m) => { b.err[P][k]++; b.msg = "✗ " + m; };
  const anim = (k, dur, extra, fin) => { an = Object.assign({ k, t0: performance.now(), dur }, extra || {}); paintBench(el); const loop = () => { if (!document.body.contains(el)) { an = null; return; } benchFig && benchFig.draw(); if (performance.now() - an.t0 >= an.dur) { an = null; fin(); save(); paintBench(el); if (after) after(); } else raf = requestAnimationFrame(loop); }; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); };
  if (t.dataset.act === "clean") { if (P === "p1") { S.bench = benchNew(b.err); S.bench.msg = "Paillasse nettoyée : recommence le protocole depuis le début."; save(); paintBench(el); if (after) after(); } return; }
  if (b.ruin && P === "p1") { b.msg = "Le résultat n'est plus fiable : nettoie la paillasse et recommence."; paintBench(el); return; }
  if (b.gluco) return;
  if (t.dataset.tool) { const k = t.dataset.tool; b.tool = k; b.msg = b.tool ? "Touche maintenant l'endroit où l'utiliser : un tube ou la plaque à godets." : ""; save(); paintBench(el); return; }
  if (t.dataset.act === "bath") {
    if (b.bath) b.msg = "Les tubes sont déjà au bain-marie.";
    else if (!b.t1) err("temoin", "Tu as oublié le tube témoin : verse aussi l'empois d'amidon dans le tube 1.");
    else if (!b.t2) err("ordre", "Verse d'abord l'empois d'amidon dans le tube 2.");
    else if (!b.amyl) err("ordre", "Ajoute d'abord l'amylase, avant de lancer la réaction au bain-marie.");
    else { b.tool = null; return anim("bath", 900, null, () => { b.bath = true; b.msg = "✓ Tubes au bain-marie à 37 °C. Fais le test de 0 minute."; }); }
    save(); paintBench(el); return;
  }
  if (t.dataset.act === "wait") {
    const c = b.time / 3;
    if (!b.bath) err("ordre", "Place d'abord les tubes au bain-marie : la réaction n'a pas commencé.");
    else if (b.time >= 12) b.msg = "Les 12 minutes sont écoulées.";
    else if (!b.tested[c]) err("ordre", `Tu as oublié le test de ${b.time} min : fais le prélèvement avant d'attendre.`);
    else { b.time += 3; return anim("wait", 1400, null, () => { b.msg = `⏱ ${b.time} min : nouveau prélèvement.`; }); }
    save(); paintBench(el); return;
  }
  if (t.dataset.tgt) {
    const tg = t.dataset.tgt, tool = b.tool, i = tg === "t1" ? 0 : tg === "t2" ? 1 : -1;
    if (!tool) { b.msg = "Choisis d'abord un matériel."; paintBench(el); return; }
    if (tool === "empois") {
      if (i < 0) err("reactif", "L'empois d'amidon se verse dans les tubes, pas dans les godets.");
      else if (i === 0 ? b.t1 : b.t2) b.msg = "Ce tube contient déjà ses 5 mL d'empois.";
      else return anim("empois", 700, { i }, () => { if (i) b.t2 = true; else b.t1 = true; b.msg = `✓ 5 mL d'empois d'amidon dans le tube ${i + 1}.`; });
    } else if (tool === "amyl") {
      if (i < 0) err("reactif", "L'amylase se verse dans un tube, pas dans les godets.");
      else if (i === 0) { if (P === "p2") err("contam", "Geste refusé : de l'amylase dans le tube 1 détruirait le témoin."); else { b.ruin = { i: 0, k: "amyl" }; b.tool = null; err("contam", "Contamination du témoin : le tube 1 ne doit pas contenir d'amylase."); } }
      else if (!b.t2) err("ordre", "Verse d'abord l'empois d'amidon dans le tube 2.");
      else if (b.amyl) b.msg = "Il y a déjà de l'amylase dans le tube 2.";
      else return anim("amyl", 900, { i: 1 }, () => { b.amyl = true; b.msg = "✓ 2 mL d'amylase dans le tube 2 (« + A »)."; });
    } else if (tool === "iode") {
      if (i >= 0) { if (P === "p2") err("contam", "Geste refusé : l'eau iodée se met dans les godets, jamais dans les tubes."); else { b.ruin = { i, k: "iode" }; b.tool = null; err("contam", `L'eau iodée a été versée dans le tube ${i + 1} : il est inutilisable. L'eau iodée se met dans les godets, sur un prélèvement.`); } }
      else if (!b.bath) err("ordre", "Lance d'abord la réaction : les tubes doivent être au bain-marie.");
      else if (b.tested[b.time / 3]) b.msg = b.time >= 12 ? "Le dernier test à l'eau iodée est fait." : "Ce prélèvement est déjà testé : attends 3 minutes.";
      else { const c = b.time / 3; return anim("sample", 1900, { c }, () => { b.tested[c] = 1; b.msg = `✓ Test à l'eau iodée à ${b.time} min : observe les deux godets.`; }); }
    } else if (tool === "gluco") {
      if (i < 0) err("reactif", "Les prélèvements dans les godets se testent à l'eau iodée ; la bandelette Glucotest se trempe dans les tubes.");
      else if (b.time < 12 || !b.tested[4]) err("ordre", "Les bandelettes Glucotest s'utilisent à 12 minutes, après le dernier test à l'eau iodée.");
      else { b.tool = null; return anim("gluco", 1600, null, () => { b.gluco = true; b.msg = "✓ Bandelettes trempées dans les deux tubes. Observe-les, puis complète ta fiche."; }); }
    }
    save(); paintBench(el);
  }
}
let benchFig = null;
function benchSkeleton(el, pid) {
  el.innerHTML = `<div class="row" style="justify-content:space-between"><b>${nb("Ma paillasse")}</b><span class="chip" id="bchip"></span></div>
    <ol class="guide" id="bguide"></ol><div class="toolsbar" role="group" aria-label="Matériel" id="btools"></div>
    <div class="targets" role="group" aria-label="Où utiliser le matériel" id="btgt"></div><div class="row" id="bacts"></div>
    <p class="log" aria-live="polite" id="blog"></p><div id="bbox"></div><div class="figbox" id="bfig"></div><p class="sim">⚠ ${nb("Valeurs simulées · modèle simplifié")}</p><div id="bobs"></div>`;
  el.dataset.pid = pid; benchFig = liveSVG($("#bfig", el), drawBench); paintBench(el);
}
function paintBench(el) {
  const b = bst(), pid = el.dataset.pid, pr = prog(pid), now = pr.indexOf(false), lock = !!S.rendu || pr.every(Boolean) || !!an, mine = errN(pid);
  $("#bchip", el).className = "chip" + (mine ? " mid" : ""); $("#bchip", el).textContent = `Erreurs de manipulation (partie ${pid === "p1" ? 1 : 2}) : ${mine}`;
  $("#bguide", el).innerHTML = STEPS[pid].map((s, i) => `<li class="${pr[i] ? "ok" : i === now ? "now" : ""}"><span class="ck">${pr[i] ? "✓" : i + 1}</span><span>${nb(s)}</span></li>`).join("");
  const off = lock || (b.ruin && pid === "p1") ? "disabled" : "";
  $("#btools", el).innerHTML = TOOLS.map(([k, ic, nm]) => `<button type="button" class="tool" data-tool="${k}" aria-pressed="${b.tool === k}" ${off}><span class="tic" aria-hidden="true">${ic}</span>${nb(nm)}</button>`).join("");
  $("#btgt", el).innerHTML = [["t1", "🧪 Tube 1"], ["t2", "🧪 Tube 2"], ["plate", "⚪ Plaque à godets"]].map(([k, l]) => `<button type="button" class="tgt${b.tool && !off ? " target" : ""}" data-tgt="${k}" ${off}>${l}</button>`).join("");
  $("#bacts", el).innerHTML = `<button type="button" class="btn" data-act="bath" ${off}>♨ Mettre au bain-marie</button><button type="button" class="btn" data-act="wait" ${off}>⏱ Attendre 3 minutes</button>${pid === "p1" && !p1Done() && !S.rendu ? `<button type="button" class="btn ghost" data-act="clean" ${an ? "disabled" : ""}>↺ Nettoyer la paillasse</button>` : ""}`;
  $("#blog", el).innerHTML = nb(b.msg || "Touche un matériel, puis l'endroit où l'utiliser. Le temps est accéléré.");
  $("#bbox", el).innerHTML = b.ruin && pid === "p1" ? `<div class="box err"><p class="lab">✖ Erreur critique</p><p>${nb(b.ruin.k === "amyl" ? "Le tube témoin contient de l'amylase : il ne peut plus servir de comparaison. Nettoie la paillasse et recommence." : "L'eau iodée a été versée dans un tube : la réaction ne peut plus être suivie. Nettoie la paillasse et recommence.")}</p></div>` : pr.every(Boolean) ? `<div class="fb ok"><p class="h">✓ ${pid === "p1" ? "Tests à l'eau iodée terminés" : "Tests Glucotest terminés"}${mine ? "" : " sans erreur"}.</p><p>${nb("Observe tes résultats, puis complète ta fiche.")}</p></div>` : "";
  $("#bobs", el).innerHTML = obsHTML(); if (benchFig) benchFig.draw();
}

/* ---------- notation ---------- */
const rnd = x => Math.round(x * 100) / 100;
const isTxt = it => it.t === "txt";
const txtOf = (pid, k) => String(S.ans[pid][k] || "").trim();
const critRes = (it, v) => { const n = nrm(v); return it.crit.map(c => !!n && !!c.f(n)); };
const itemScore = (pid, it, ok) => { const v = S.ans[pid][it.k]; if (isTxt(it)) return rnd(critRes(it, v).reduce((s, x, i) => s + (x ? it.crit[i].p : 0), 0)); return v === (ok === undefined ? it.ans : ok) ? it.p : 0; };
const partScore = P => rnd(P.items.reduce((s, it) => s + itemScore(P.id, it), 0));
const CMAX = rnd(CONC.reduce((s, c) => s + c.p, 0));
const concScore = () => rnd(CONC.reduce((s, c) => s + itemScore("c", c, 0), 0));
const total = () => rnd(PARTS.reduce((s, P) => s + partScore(P), 0) + concScore());
const allVal = () => S.val.p1 && S.val.p2 && S.val.c;
const missingTxt = (pid, items) => items.filter(isTxt).some(it => txtOf(pid, it.k).length < MINTXT);

function txtHTML(pid, it, val, num) {
  const v = txtOf(pid, it.k), shown = !!S.rendu, id = `tx-${pid}-${it.k}`;
  let h = `<div class="rowq"><label class="rt" for="${id}">${num ? `<span class="cn">${num}</span> ` : ""}${num ? `<b>${it.lab}</b> <span class="muted">(${nb(it.sub)})</span>` : nb(it.lab)} <span class="ctag">${pts(it.p)} pt · réponse rédigée</span></label>
    <textarea class="inp" id="${id}" data-tx="${it.k}" ${val ? "readonly" : ""} placeholder="${esc(it.ph)}" style="min-height:5rem">${esc(S.ans[pid][it.k] || "")}</textarea>${val ? "" : `<p class="cap" data-cnt="${it.k}"></p>`}`;
  if (shown) { const r = critRes(it, v); h += `<div class="corr"><p class="h">Éléments attendus · ${pts(itemScore(pid, it))} / ${pts(it.p)} pt</p><ul class="ul">${it.crit.map((c, i) => `<li>${r[i] ? "✓ présent" : "✗ absent"} (${pts(c.p)} pt) : ${nb(c.lab)}</li>`).join("")}</ul><p><b>Exemple de réponse :</b> ${nb(it.model)}</p></div>`; }
  return h + "</div>";
}
function wireTxt(m, pid) {
  $$("[data-tx]", m).forEach(ta => { const k = ta.dataset.tx, c = $(`[data-cnt="${k}"]`, m);
    const cnt = () => { if (!c) return; const L = ta.value.trim().length; c.textContent = `${L} caractères${L < MINTXT ? ` (au moins ${MINTXT})` : ""}`; };
    ta.addEventListener("input", () => { S.ans[pid][k] = ta.value; save(); cnt(); }); cnt(); });
}

/* ---------- navigation ---------- */
const VIEWS = ["consignes", "p1", "p2", "conc", "copie"];
const TABN = { consignes: "Consignes", p1: `1 · Amidon (/${PARTS[0].max})`, p2: `2 · Glucose (/${PARTS[1].max})`, conc: `Conclusion (/${CMAX})`, copie: "Ma copie" };
function tabs() {
  $("#tabs").innerHTML = VIEWS.map(v => { const done = v === "conc" ? S.val.c : S.val[v], st = v === "copie" ? (S.rendu ? "✓ rendue" : "") : done ? "✓" : ""; return `<button class="tab" type="button" data-v="${v}" ${S.view === v ? 'aria-current="page"' : ""}>${TABN[v]}${st ? `<span class="dot" aria-label="${v === "copie" ? "copie rendue" : "partie validée"}">${st}</span>` : ""}</button>`; }).join("");
  $$("#tabs .tab").forEach(b => b.onclick = () => go(b.dataset.v));
}
function go(v, noScroll) {
  if (!VIEWS.includes(v)) v = "consignes"; S.view = v; save(); tabs(); an = null; cancelAnimationFrame(raf);
  if (location.hash !== "#" + v) { try { history.replaceState(null, "", "#" + v); } catch (e) {} }
  const m = $("#main");
  if (v === "consignes") renderConsignes(m); else if (v === "conc") renderConc(m); else if (v === "copie") renderCopie(m); else renderPart(m, PARTS.find(P => P.id === v));
  if (!noScroll) window.scrollTo(0, 0);
  const c = $("#tabs [aria-current]"); if (c && c.scrollIntoView) c.scrollIntoView({ block: "nearest", inline: "center" });
}
const nextBtn = (v, t) => `<div class="row"><button type="button" class="btn" data-next="${v}">${t}</button></div>`;
const wireNext = m => $$("[data-next]", m).forEach(b => b.onclick = () => go(b.dataset.next));
const RAPPEL = `<div class="box info"><p class="lab">ℹ Rappels</p><ul class="ul"><li>${nb("L'eau iodée met en évidence l'amidon : elle devient <b>bleu-noir</b> en sa présence.")}</li><li>${nb("La bandelette Glucotest met en évidence le glucose : sa zone réactive devient <b>verte</b> en sa présence.")}</li><li>${nb("L'empois d'amidon est de l'amidon dissous dans de l'eau chaude.")}</li></ul></div>`;

/* ---------- consignes ---------- */
function renderConsignes(m) {
  m.innerHTML = `<section class="view">
    <div class="panel"><p class="kicker">Le métabolisme des cellules · TP évalué</p><h2 class="sec-title">${nb("L'action de l'amylase sur l'amidon")}</h2>
      <div class="box info"><p class="lab">ℹ Objectif</p><p>${nb("La pomme de terre est riche en amidon. Montrer ce que devient l'amidon en présence d'amylase, une molécule présente dans la salive et le suc pancréatique.")}</p><p><b>Méthode :</b> ${nb("deux tubes d'empois d'amidon à 37 °C, dont un témoin sans amylase ; tests à l'eau iodée et au Glucotest.")}</p></div></div>
    ${RAPPEL}
    <div class="panel"><h3>Barème</h3>${tbl(["Partie", "Points"], [[PARTS[0].title, String(PARTS[0].max)], [PARTS[1].title, String(PARTS[1].max)], ["Conclusion · Que fait l'amylase ? (je vois, je sais, or, donc, mais)", pts(CMAX)], ["<b>Sous-total noté dans l'application</b>", `<b>${MAXAPP}</b>`], ["Manipulation (soin, protocole) · notée par le professeur", String(MANIP)], ["<b>Total</b>", `<b>${MAXAPP + MANIP}</b>`]])}
      <p class="cap">${nb("Les réponses rédigées sont notées sur les éléments attendus ; le professeur relit ta copie.")}</p></div>
    <div class="box warn"><p class="lab">⚠ Règles du TP noté</p><ul class="ul">
      <li>${nb("Chaque partie se valide <b>une seule fois</b> : relis-toi avant de valider.")}</li>
      <li>${nb("Aucune correction n'est affichée avant la remise de ta copie.")}</li>
      <li>${nb("Rédige des phrases complètes, avec le vocabulaire du cours (amidon, glucose, amylase, enzyme, témoin).")}</li>
      <li>${nb(`Ta manipulation est notée sur ${MANIP} par le professeur : tes erreurs de manipulation (mauvais réactif, mauvais ordre, contamination, oubli du témoin) figurent dans ta copie.`)}</li>
      <li>${nb("Quand les trois parties sont validées, rends ta copie dans l'onglet « Ma copie », puis montre-la au professeur.")}</li></ul></div>
    <div class="box err"><p class="lab">✖ Attention</p><p>${nb("Le tube 1 est le témoin : il ne reçoit jamais d'amylase. L'eau iodée se met dans les godets, jamais dans les tubes.")}</p></div>
    ${nextBtn("p1", "Commencer la partie 1 →")}</section>`;
  wireNext(m);
}

/* ---------- parties 1 et 2 ---------- */
function rowsHTML(P) {
  const A = S.ans[P.id], val = !!S.val[P.id], done = P.ready(), shown = !!S.rendu;
  return P.items.map(it => isTxt(it) ? (done ? txtHTML(P.id, it, val) : "") : `<div class="rowq"><span class="rt">${nb(it.lab)} <span class="ctag">${pts(it.p)} pt</span></span><div class="seg" role="group" aria-label="${esc(it.lab)}">${it.o.map((o, j) => { const sel = A[it.k] === j, cls = shown && sel ? (j === it.ans ? "is-ok" : "is-bad") : ""; return `<button type="button" class="${cls}" data-k="${it.k}" data-j="${j}" aria-pressed="${sel}" ${val || !done ? "disabled" : ""}>${cls === "is-ok" ? "✓ " : cls === "is-bad" ? "✗ " : ""}${nb(o)}</button>`; }).join("")}</div>${shown && A[it.k] !== it.ans ? `<p class="pfb bad">Réponse attendue : <b>${nb(it.o[it.ans])}</b></p>` : ""}</div>`).join("");
}
function renderPart(m, P) {
  const nextV = P.id === "p1" ? "p2" : "conc";
  m.innerHTML = `<section class="view"><div><p class="kicker">Partie ${P.n} · ${P.max} points</p><h2 class="sec-title">${nb(P.title)}</h2></div>
    <div class="panel"><h3>Protocole</h3><ol class="ul">${P.proto.map(x => `<li>${nb(x)}</li>`).join("")}</ol></div>
    ${RAPPEL}
    ${P.id === "p2" && !p1Done() ? `<p class="locked">🔒 ${nb("Termine d'abord les tests à l'eau iodée de la partie 1.")}</p>` : `<div class="panel bench" id="bench"></div>`}
    <div class="panel"><h3>Ma fiche de résultats <span class="chip">/ ${P.max} points</span></h3><div class="rows" id="rows"></div><div class="row acts" id="acts"></div><div id="vmsg" aria-live="polite"></div></div>
    ${nextBtn(nextV, P.id === "p1" ? "Partie 2 →" : "Conclusion →")}</section>`;
  const bel = $("#bench", m);
  const paintRows = () => {
    $("#rows", m).innerHTML = (P.ready() ? "" : `<p class="locked">🔒 ${nb("Termine d'abord la manipulation : ta fiche de résultats se déverrouille ensuite.")}</p>`) + rowsHTML(P);
    $$("#rows [data-k]", m).forEach(b => b.onclick = () => { S.ans[P.id][b.dataset.k] = +b.dataset.j; save(); paintRows(); const n = $(`#rows [data-k="${b.dataset.k}"][data-j="${b.dataset.j}"]`, m); if (n) n.focus(); });
    wireTxt($("#rows", m), P.id);
    const acts = $("#acts", m), msg = $("#vmsg", m);
    if (S.val[P.id]) { acts.innerHTML = ""; msg.innerHTML = S.rendu ? `<div class="fb ${partScore(P) === P.max ? "ok" : "bad"}"><p class="h">Partie ${P.n} : ${pts(partScore(P))} / ${P.max}</p></div>` : `<div class="fb neutral"><p class="h">✓ Partie ${P.n} validée.</p><p>${nb("Tu ne peux plus la modifier. La correction s'affichera à la remise de ta copie.")}</p></div>`; return; }
    acts.innerHTML = `<button type="button" class="btn" id="valBtn">Valider la partie ${P.n}</button>`; msg.innerHTML = "";
    armButton($("#valBtn", m), `Valider la partie ${P.n}`, "Confirmer : je ne pourrai plus modifier", () => {
      if (!P.ready()) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb("Termine d'abord la manipulation.")}</p></div>`; return; }
      if (P.items.some(it => !isTxt(it) && S.ans[P.id][it.k] === undefined)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb("Complète toutes les lignes de ta fiche avant de valider.")}</p></div>`; return; }
      if (missingTxt(P.id, P.items)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb(`Rédige ta réponse (au moins ${MINTXT} caractères).`)}</p></div>`; return; }
      S.val[P.id] = Date.now(); save(); tabs(); paintRows();
    });
  };
  if (bel) { benchSkeleton(bel, P.id); let was = P.ready(); bel.addEventListener("click", e => benchClick(e, bel, () => { if (P.ready() !== was) { was = P.ready(); paintRows(); } })); }
  paintRows(); wireNext(m);
}

/* ---------- conclusion ---------- */
function renderConc(m) {
  const A = S.ans.c, val = !!S.val.c, shown = !!S.rendu, Q = CONC.filter(c => !isTxt(c)), qmax = rnd(Q.reduce((s, c) => s + c.p, 0)), r1 = S.ans.p1, r2 = S.ans.p2, v = (a, L) => a === undefined ? "—" : L[a];
  const qHTML = (c, ci) => `<div class="cstep"><p class="pl"><span class="cn">${ci + 1}</span> <b>${c.lab}</b> <span class="muted">(${c.sub})</span> <span class="ctag">${pts(c.p)} pt</span></p><div class="opts" role="radiogroup" aria-label="${esc(c.lab)}">${c.ord.map(j => { const sel = A[c.k] === j, cls = shown && sel ? (j === 0 ? "is-ok" : "is-bad") : ""; return `<button type="button" class="opt ${cls}" role="radio" aria-checked="${sel}" data-c="${c.k}" data-j="${j}" ${val ? "disabled" : ""}><span class="k">${"ABC"[c.ord.indexOf(j)]}</span><span>${nb(c.o[j])}</span>${cls ? `<span class="tag">${cls === "is-ok" ? "✓ Juste" : "✗ Faux"}</span>` : ""}</button>`; }).join("")}</div>${shown && A[c.k] !== 0 ? `<p class="pfb bad">Attendu : ${nb(c.o[0])}</p>` : ""}</div>`;
  m.innerHTML = `<section class="view"><div><p class="kicker">Conclusion · ${pts(CMAX)} points</p><h2 class="sec-title">${nb("Que fait l'amylase ?")}</h2><p class="lead">${nb("Explique ton raisonnement en t'appuyant sur tes résultats des parties 1 et 2.")}</p></div>
    <div class="panel"><h3>Mes résultats</h3>${S.val.p1 && S.val.p2 ? tbl(["À 12 minutes", "Tube 1 (témoin)", "Tube 2 (+ amylase)"], [["Eau iodée", v(r1.a, PA), v(r1.b, PA)], ["Glucotest", v(r2.a, GL), v(r2.b, GL)]]) : `<p class="locked">${nb("Valide d'abord les parties 1 et 2.")}</p>`}</div>
    <div class="panel"><h3>Mon raisonnement · étapes 1 à 3 <span class="chip">${pts(qmax)} pt</span></h3><p class="lead">${nb("Pour chaque étape, choisis le morceau de phrase qui convient.")}</p><div class="conc">${Q.map(qHTML).join("")}</div></div>
    <div class="panel"><h3>Mon raisonnement · étapes 4 et 5, rédigées <span class="chip">${pts(rnd(CMAX - qmax))} pt</span></h3><p class="lead">${nb("Rédige avec tes propres mots, en phrases complètes.")}</p><div class="rows" id="ctx">${CONC.map((c, ci) => isTxt(c) ? txtHTML("c", c, val, ci + 1) : "").join("")}</div></div>
    <div class="row acts" id="acts"></div><div id="vmsg" aria-live="polite"></div>${nextBtn("copie", "Ma copie →")}</section>`;
  wireTxt($("#ctx", m), "c");
  $$("[data-c]", m).forEach(b => b.onclick = () => { A[b.dataset.c] = +b.dataset.j; save(); const y = window.scrollY; renderConc(m); window.scrollTo(0, y); const n = $(`[data-c="${b.dataset.c}"][data-j="${b.dataset.j}"]`, m); if (n) n.focus({ preventScroll: true }); });
  const acts = $("#acts", m), msg = $("#vmsg", m);
  if (val) { msg.innerHTML = S.rendu ? `<div class="fb ${concScore() === CMAX ? "ok" : "bad"}"><p class="h">Conclusion : ${pts(concScore())} / ${pts(CMAX)}</p></div>` : `<div class="fb neutral"><p class="h">✓ Conclusion validée.</p><p>${nb("La correction s'affichera à la remise de ta copie.")}</p></div>`; }
  else { acts.innerHTML = `<button type="button" class="btn" id="valBtn">Valider la conclusion</button>`;
    armButton($("#valBtn", m), "Valider la conclusion", "Confirmer : je ne pourrai plus modifier", () => {
      if (Q.some(c => A[c.k] === undefined)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb(`Choisis un morceau de phrase pour chacune des étapes 1 à ${Q.length}.`)}</p></div>`; return; }
      if (missingTxt("c", CONC)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb(`Rédige les étapes 4 et 5 (au moins ${MINTXT} caractères chacune).`)}</p></div>`; return; }
      S.val.c = Date.now(); save(); tabs(); renderConc(m); }); }
  wireNext(m);
}

/* ---------- la copie ---------- */
const hm = d => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const dmy = d => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const manipTxt = pid => { const n = errN(pid); if (!n) return "aucune erreur"; return `${n} erreur${n > 1 ? "s" : ""} (${ERRK.filter(([k]) => errN(pid, k)).map(([k, l]) => `${l} : ${errN(pid, k)}`).join(", ")})`; };
function copyText(name) {
  const R = S.rendu, clean = x => String(x).replace(/ | /g, " ").replace(/<[^>]+>/g, "");
  const txtLine = (pid, it) => { const v = txtOf(pid, it.k); let l = `- ${it.lab}${it.sub ? ` (${it.sub})` : ""}\n  « ${v || "—"} »${R ? ` → ${pts(itemScore(pid, it))} / ${pts(it.p)}` : ""}\n`; if (R) { const r = critRes(it, v); it.crit.forEach((c, i) => { l += `    ${r[i] ? "[✓]" : "[ ]"} ${c.lab} (${pts(c.p)} pt)\n`; }); } return l; };
  let t = `TP NOTÉ · L'ACTION DE L'AMYLASE SUR L'AMIDON\n2nde SVT · Thème 1 · Le métabolisme des cellules\n\nÉlève : ${name || "—"}\n`;
  t += R ? `Copie rendue le ${dmy(R.t)} à ${hm(R.t)}\nCopies rendues sur cet appareil : ${R.n}\n\nNOTE DE L'APPLICATION : ${pts(R.note)} / ${MAXAPP}\nMANIPULATION (notée par le professeur) : ____ / ${MANIP}\nTOTAL : ____ / ${MAXAPP + MANIP}\n` : "Copie pas encore rendue.\n";
  PARTS.forEach(P => { t += `\n${P.title} : ${R ? pts(partScore(P)) : "—"} / ${P.max}\n`; P.items.forEach(it => { if (isTxt(it)) { t += txtLine(P.id, it); return; } const a = S.ans[P.id][it.k]; t += `- ${it.lab} : ${a === undefined ? "—" : it.o[a]}${R ? ` (attendu : ${it.o[it.ans]}) → ${pts(a === it.ans ? it.p : 0)} / ${pts(it.p)}` : ""}\n`; }); t += `- Manipulation : ${manipTxt(P.id)}\n`; });
  t += `\nConclusion : ${R ? pts(concScore()) : "—"} / ${pts(CMAX)}\n`; CONC.forEach(c => { if (isTxt(c)) { t += txtLine("c", c); return; } const a = S.ans.c[c.k]; t += `- ${c.lab} ${a === undefined ? "—" : c.o[a]}${R ? ` → ${pts(a === 0 ? c.p : 0)} / ${pts(c.p)}` : ""}\n`; });
  if (R) t += `\nRaisonnement attendu : ${CONC.map(c => isTxt(c) ? c.model : c.lab.replace(/…$/, "") + " " + c.o[0] + ".").join(" ")}\n`;
  return clean(t + `\n${SIGN}\n`);
}
function renderCopie(m) {
  const R = S.rendu, st = [[PARTS[0].title, S.val.p1], [PARTS[1].title, S.val.p2], ["Conclusion", S.val.c]];
  const wr = [...PARTS.flatMap(P => P.items.filter(isTxt).map(it => [P.tab, it, P.id])), ...CONC.filter(isTxt).map(c => ["Conclusion · " + c.lab, c, "c"])];
  m.innerHTML = `<section class="view"><div><p class="kicker">Ma copie</p><h2 class="sec-title">${R ? "Ma copie corrigée" : "Rendre ma copie"}</h2></div>
    ${R ? `<div class="panel"><p class="score-big">${pts(R.note)} / ${MAXAPP}</p><div class="bar" aria-hidden="true"><i style="width:${R.note / MAXAPP * 100}%"></i></div><p class="lead">${nb(`+ manipulation sur ${MANIP}, notée par le professeur. Copie rendue le ${dmy(R.t)} à ${hm(R.t)} · copies rendues sur cet appareil : ${R.n}`)}</p></div>
      <div class="panel"><h3>Détail de la note</h3>${tbl(["Partie", "Points"], [...PARTS.map(P => [P.title, `${pts(partScore(P))} / ${P.max}`]), ["Conclusion", `${pts(concScore())} / ${pts(CMAX)}`], ["<b>Sous-total (application)</b>", `<b>${pts(R.note)} / ${MAXAPP}</b>`], ["Manipulation (professeur)", `… / ${MANIP}`], ["<b>Total</b>", `<b>… / ${MAXAPP + MANIP}</b>`]])}
        <p class="lead">${nb(`Manipulation · partie 1 : ${manipTxt("p1")} ; partie 2 : ${manipTxt("p2")}.`)}</p>
        <p class="lead">${nb("La correction détaillée s'affiche dans chaque onglet : ✓ juste, ✗ faux, avec la réponse attendue et les éléments attendus des réponses rédigées.")}</p></div>
      <div class="box key"><p class="lab">✔ Ce qu'il fallait conclure</p><p>${nb("Dans le tube 2, l'eau iodée passe du bleu-noir au jaune et le Glucotest devient positif : l'amidon disparaît et du glucose apparaît. Dans le tube témoin, sans amylase, rien ne change. L'amidon étant formé de nombreuses molécules de glucose, l'amylase, une enzyme, transforme l'amidon en glucose. Mais l'expérience est faite en tube et une seule fois : il faudrait la répéter et la compléter (amylase bouillie, autre température).")}</p></div>
      <div class="panel"><h3>Mes réponses rédigées</h3>${wr.map(([t, it, pid]) => `<div class="field"><b>${nb(t)} · ${pts(itemScore(pid, it))} / ${pts(it.p)}</b><p class="quote">« ${esc(txtOf(pid, it.k))} »</p></div>`).join("")}</div>
      <div class="panel"><h3>Transmettre ma copie</h3><div id="bt"></div></div>`
    : `<div class="panel"><h3>Où en es-tu ?</h3><ul class="inds">${st.map(([n, v]) => `<li class="${v ? "done" : ""}"><span class="bx" aria-hidden="true">${v ? "✓" : ""}</span><span>${nb(n)} <span class="st">${v ? "✓ validée" : "à valider"}</span></span></li>`).join("")}</ul>
      ${allVal() ? `<p class="lead">${nb("Tout est validé. Quand tu rends ta copie, ta note s'affiche avec la correction.")}</p><div class="row"><button type="button" class="btn" id="rendre">📝 Rendre ma copie</button></div>` : `<p class="locked">🔒 ${nb("Valide les trois parties pour pouvoir rendre ta copie.")}</p>`}</div>`}
    <div class="panel"><h3>Recommencer</h3><p class="lead">${nb("Efface ta copie et tes manipulations sur cet appareil. Le nombre de copies rendues reste enregistré.")}</p><div class="row"><button class="btn ghost" type="button" id="reset">Tout effacer</button></div></div></section>`;
  const r = $("#rendre", m); if (r) armButton(r, "📝 Rendre ma copie", "Confirmer la remise de ma copie", () => { const M = meta(); M.n = (M.n || 0) + 1; setMeta(M); S.rendu = { t: Date.now(), note: total(), n: M.n }; save(); tabs(); renderCopie(m); window.scrollTo(0, 0); });
  if (R) renderBilanTools($("#bt", m), copyText, name => `<p class="kicker">TP noté · Amylase et amidon · copie à montrer au professeur</p><h2>${esc(name || "Élève")}</h2><p>${nb(`Copie rendue le ${dmy(R.t)} à ${hm(R.t)}`)}</p><p class="score-big">${pts(R.note)} / ${MAXAPP}</p>${PARTS.map(P => `<div class="line"><span>${nb(P.title)}</span><b class="num">${pts(partScore(P))} / ${P.max}</b></div>`).join("")}<div class="line"><span>Conclusion</span><b class="num">${pts(concScore())} / ${pts(CMAX)}</b></div><div class="line"><span>${nb(`Manipulation (professeur) · partie 1 : ${manipTxt("p1")} · partie 2 : ${manipTxt("p2")}`)}</span><b class="num">… / ${MANIP}</b></div><div class="line"><span>Total</span><b class="num">… / ${MAXAPP + MANIP}</b></div><div class="line"><span>Copies rendues sur cet appareil</span><b class="num">${R.n}</b></div>`, "tp-amylase");
  armButton($("#reset", m), "Tout effacer", "Confirmer l'effacement ?", () => { S.bench = null; S.ans = { p1: {}, p2: {}, c: {} }; S.val = {}; S.rendu = null; save(); go("consignes"); });
}

/* ---------- démarrage ---------- */
Display.init(S, save);
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && h !== S.view && VIEWS.includes(h)) go(h); });
go(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : (S.view || "consignes"), true);
