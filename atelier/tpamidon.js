/* ===== 2nde SVT · Thème 1 · Métabolisme · TP noté sur 10 (8 points ici + manipulation sur 2 notée par le professeur) : l'action de l'amylase sur l'amidon =====
   Les élèves font la VRAIE manipulation : l'app guide le protocole (gestes animés, jamais le résultat), chronomètre les prélèvements,
   recueille les observations du groupe et pose les questions. La copie est un compte rendu (.txt) ; la notation des résultats suit
   la cohérence avec les observations du groupe. La simulation n'est proposée qu'après la remise.
   Moteur de notation tiré de tpagg.js (TP noté agglutination, 3e) ; dessin de paillasse tiré de pomme_widgets.js. */
Store.key = "svt2-tp-amylase-note-v1";
const META_KEY = "svt2-tp-amylase-note-meta";
const SIGN = "Mr Moreira, Vauban Luxembourg";
const NOBS = () => ({ t1: [null, null, null, null, null], t2: [null, null, null, null, null], g1: null, g2: null });
const DEF = { fs: 21, theme: null, proj: false, view: "consignes", groupe: ["", "", "", ""], hyp: "", steps: {}, chrono: null, recal: [], obs: NOBS(), ans: { p1: {}, p2: {}, c: {} }, val: {}, rendu: null, apres: "" };
let S = Store.load(DEF);
["steps", "val"].forEach(k => { if (!S[k] || typeof S[k] !== "object") S[k] = {}; });
if (!Array.isArray(S.groupe)) S.groupe = ["", "", "", ""];
if (!Array.isArray(S.recal)) S.recal = [];
if (!S.obs || !Array.isArray(S.obs.t1) || !Array.isArray(S.obs.t2)) S.obs = NOBS();
if (!S.ans || typeof S.ans !== "object") S.ans = {}; ["p1", "p2", "c"].forEach(k => { if (!S.ans[k] || typeof S.ans[k] !== "object") S.ans[k] = {}; });
const save = () => Store.save(S);
const meta = () => { try { return JSON.parse(localStorage.getItem(META_KEY) || "{}") || {}; } catch (e) { return {}; } };
const setMeta = m => { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) {} };
const pts = v => String(v).replace(".", ",");
const clamp = x => Math.max(0, Math.min(1, x));
const groupNames = () => S.groupe.map(x => String(x || "").trim()).filter(Boolean);

/* ---------- observations du groupe ---------- */
const IOC = [["io0", "bleu-noir"], ["io1", "violet"], ["io2", "brun"], ["io3", "jaune-brun"], ["io4", "jaune"]];
const GLC = [["gneg", "jaune"], ["gpal", "vert clair"], ["gpos", "vert foncé"]];
const TIMES = [0, 3, 6, 9, 12];
const obsDone = () => S.obs.t1.every(x => x !== null) && S.obs.t2.every(x => x !== null) && S.obs.g1 !== null && S.obs.g2 !== null;
/* lecture attendue, déduite des observations du groupe (notation par cohérence) */
const lec = arr => { const L = arr[4]; if (L === null || L === undefined) return undefined; return L === 4 ? 2 : L === 0 ? 0 : 1; };
const glu = g => g === null || g === undefined ? undefined : g === 0 ? 1 : 0;
const changed = (arr, g) => lec(arr) > 0 || glu(g) === 0;
const typical = () => changed(S.obs.t2, S.obs.g2) && !changed(S.obs.t1, S.obs.g1) && lec(S.obs.t2) === 2;

/* ---------- réponses rédigées : éléments attendus repérés sur un texte normalisé (sans accents) ; le professeur relit ---------- */
const nrm = x => String(x || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").replace(/[’'`\-]/g, " ").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const any = (n, ...re) => re.some(r => r.test(n));
const AMYL = /\bam[iy]l\w*|\benz[iy]m\w*/;
const NEG = /\b(pas|jamais|ne) (\w+ )?(disparu|disparait|transforme|degrade|digere|decoupe|detruit|diminue)/;
const SANS_AMYL = n => any(n, /\b(sans|pas|aucune?|absence|n a pas|ne contient pas|ni)( \w+){0,3} (am[iy]l|enz[iy]m)/, /\bseule?s? (difference|chose|changement)/, /\b(compar\w*|differ\w*|temoin)( \w+){0,8} (am[iy]l|enz[iy]m)/, /(am[iy]l|enz[iy]m)\w*( \w+){0,6} (seulement|uniquement|que dans|que le tube 2|juste)/);
const PAS_AMIDON = n => !NEG.test(n) && any(n, /\b(plus|pas|aucun|aucune|sans|absence)( de| d| de l| d l)? amidon/, /amidon( \w+){0,5} (a disparu|disparu|disparait|disparaitre|absent|n est plus|n y est plus|plus la|plus present|transforme|degrade|digere|decoupe|coupe|detruit|consomme|hydrolyse|decompose|casse)/, /disparition( \w+){0,2} amidon/);
const DIMINUE = n => any(n, /amidon( \w+){0,5} (diminu|baiss|moins|reduit|commence)/, /(moins|diminution|baisse|reduction)( \w+){0,3} amidon/, /(reste|encore|toujours)( \w+){0,3} (un peu|peu|une partie|quelques)/, /(pas|ne) (\w+ )?(totalement|completement|entierement|tout)/, /(eclairc|s eclair|plus clair|moins fonce|moins bleu)/);
const PRESENT = n => any(n, /(toujours|encore|reste)( \w+){0,4} (de l |d |l |de )?amidon/, /amidon( \w+){0,4} (present|toujours|reste|pas disparu|n a pas disparu|ne disparait pas)/, /(bleu noir|bleu|fonce)( \w+){0,8} amidon/, /amidon( \w+){0,8} (bleu noir|bleu)/);
const ACTION = /transform|digere|digerer|digestion|decoup|coupe|degrad|hydroly|casse|decompos|disparait|disparaitre|fait disparaitre|detruit|change|convert|separ|libere/;
const labOf = c => typeof c.lab === "function" ? c.lab() : c.lab;
const ansOf = it => typeof it.ans === "function" ? it.ans() : it.ans;

const GL = ["Positif : glucose présent", "Négatif : pas de glucose"];
const LEC = ["l'amidon est présent du début à la fin", "l'amidon diminue, mais il en reste à 12 minutes", "l'amidon a disparu à 12 minutes"];
const PARTS = [
  { id: "p1", n: 1, max: 1, tab: "Partie 1 · Préparer", title: "Partie 1 · Hypothèse et préparation de l'expérience", ready: () => !!S.steps.s3,
    items: [{ k: "c", lab: "Pourquoi place-t-on les tubes à 37 °C ?", o: ["C'est la température du corps humain", "Pour faire bouillir l'amidon", "Pour colorer l'eau iodée"], ans: 0, p: 0.5 },
      { k: "j", t: "txt", p: 0.5, lab: "Justifiez le rôle du tube témoin (tube 1).", ph: "Le tube 1 est le témoin : il montre que …",
        crit: [{ lab: "explique que le témoin n'a pas d'amylase (seule différence avec le tube 2) et sert à comparer", p: 0.5, f: n => SANS_AMYL(n) }],
        model: "Le tube 1 ne contient pas d'amylase : c'est la seule différence avec le tube 2. Il permet de comparer et de vérifier que, sans amylase, l'amidon ne disparaît pas tout seul, même à 37 °C." }] },
  { id: "p2", n: 2, max: 2.5, tab: "Partie 2 · Résultats", title: "Partie 2 · Suivre la réaction, noter et lire les résultats", ready: () => obsDone(),
    items: [{ k: "a", lab: "Tube 1 (témoin) : d'après vos observations à l'eau iodée, entre 0 et 12 minutes…", o: LEC, ans: () => lec(S.obs.t1), p: 0.5 },
      { k: "b", lab: "Tube 2 (+ amylase) : d'après vos observations à l'eau iodée, entre 0 et 12 minutes…", o: LEC, ans: () => lec(S.obs.t2), p: 0.5 },
      { k: "g1", lab: "Bandelette Glucotest du tube 1", o: GL, ans: () => glu(S.obs.g1), p: 0.5 },
      { k: "g2", lab: "Bandelette Glucotest du tube 2", o: GL, ans: () => glu(S.obs.g2), p: 0.5 },
      { k: "j", t: "txt", p: 0.5, lab: "Expliquez ce que montrent vos résultats à l'eau iodée pour le tube 2.", ph: "Dans le tube 2, l'eau iodée … donc …",
        crit: [{ lab: () => { const L = lec(S.obs.t2); return L === 2 ? "relie la coloration jaune à 12 min à la disparition de l'amidon" : L === 1 ? "relie l'éclaircissement de la coloration à la diminution de l'amidon (il en reste)" : "relie la coloration bleu-noir maintenue à la présence d'amidon"; }, p: 0.5,
          f: n => { const L = lec(S.obs.t2); return L === 2 ? PAS_AMIDON(n) : L === 1 ? DIMINUE(n) || PAS_AMIDON(n) && /(peu a peu|progressiv|petit a petit|au fur)/.test(n) : PRESENT(n); } }],
        model: () => { const L = lec(S.obs.t2); return L === 2 ? "Dans le tube 2, l'eau iodée passe peu à peu du bleu-noir au jaune : l'amidon disparaît, il n'y en a plus à 12 minutes." : L === 1 ? "Dans le tube 2, la coloration de l'eau iodée s'éclaircit sans devenir jaune : la quantité d'amidon diminue, mais il en reste à 12 minutes." : "Dans le tube 2, l'eau iodée reste bleu-noir : l'amidon est toujours présent, il n'a pas disparu."; } }] }];
const CONC = [
  { k: "c1", p: 0.5, lab: "Je vois que…", sub: "vos résultats", o: ["dans le tube 2 seulement, l'amidon diminue ou disparaît et du glucose apparaît ; rien ne change dans le tube 1 (témoin)", "dans les deux tubes, l'amidon diminue et du glucose apparaît", "dans aucun des deux tubes, l'amidon ne diminue", "dans le tube 1 seulement, l'amidon diminue et du glucose apparaît"], ord: [1, 0, 3, 2],
    ans: () => { const a = changed(S.obs.t1, S.obs.g1), b = changed(S.obs.t2, S.obs.g2); return b && !a ? 0 : a && b ? 1 : !a && !b ? 2 : 3; } },
  { k: "c2", p: 0.5, lab: "Je sais que…", sub: "ce qu'est l'amidon", o: ["l'amidon est une grosse molécule formée de nombreuses molécules de glucose attachées", "l'amidon est formé de molécules d'eau iodée", "le glucose est formé de nombreuses molécules d'amidon"], ord: [2, 0, 1], ans: 0 },
  { k: "c3", p: 0.5, lab: "Or…", sub: "ce qui distingue les deux tubes", o: ["les deux tubes sont dans les mêmes conditions (37 °C, 12 minutes) : seul le tube 2 contient de l'amylase", "le tube 1 contient plus d'amidon que le tube 2", "seul le tube 2 est placé au bain-marie"], ord: [1, 2, 0], ans: 0 },
  { k: "c4", t: "txt", p: 1.5, lab: "Donc…", sub: "rédigez : quel est le rôle de l'amylase ? Que devient l'amidon ? Quel type de molécule est l'amylase ?", ph: "Donc l'amylase … l'amidon en … ; c'est une …",
    crit: [{ lab: "attribue la disparition de l'amidon à l'amylase (elle le transforme, le découpe, le digère)", p: 0.5, f: n => AMYL.test(n) && ACTION.test(n) && /amidon/.test(n) },
      { lab: "indique que l'amidon est transformé en glucose", p: 0.5, f: n => any(n, /amidon( \w+){0,6} (en|du|de|des) (glucose|glu)/, /amidon( \w+){0,8} glucose/) && ACTION.test(n) && !/glucose( \w+){0,3} en amidon/.test(n) },
      { lab: "nomme l'amylase comme une enzyme", p: 0.5, f: n => /\benz[iy]m/.test(n) }],
    model: "Donc l'amylase transforme l'amidon en glucose : elle découpe la longue chaîne d'amidon en molécules de glucose. L'amylase est une enzyme." },
  { k: "c5", t: "txt", p: 1, lab: "Mais…", sub: "rédigez : limites de l'expérience · que ne montre-t-elle pas ? Que pourrait-on faire de plus ?", ph: "Mais cette expérience … ; pour aller plus loin, on pourrait …",
    crit: [{ lab: "donne une limite : expérience en tube et pas dans le tube digestif, une seule expérience, résultat qualitatif, ou un résultat inattendu expliqué", p: 0.5,
        f: n => any(n, /\btubes?\b( \w+){0,6} (pas|non|et non)( \w+){0,4} (corps|intestin|bouche|organisme|tube digestif|estomac|vivant)/, /in vitro/, /(pas|non|n est pas|ne se passe pas)( \w+){0,5} (dans|en) (le |l |un )?(corps|intestin|bouche|organisme|tube digestif|estomac|humain)/, /(une seule|qu une|1 seule|un seul|seulement une|seulement un) (fois|experience|essai|test|manip)/, /\b(repet|refaire|refait|recommenc)\w*/, /quantit|combien|qualitati/, /(conditions|realite)( \w+){0,4} differ/, /artificiel/, /(erreur|incertitud|imprecis|pas eu le temps|plus longtemps|plus de temps|pas assez (de )?temps|il (en )?restait|pas totalement|pas completement)/) },
      { lab: "propose une expérience complémentaire (répéter, amylase chauffée ou bouillie, autre température, salive, mesurer la quantité de glucose…)", p: 0.5,
        f: n => any(n, /\b(repet|refaire|refait|recommenc|reproduire)\w*/, /(bouill|chauff|cuit|cuite|denatur|100 c|100 degre)/, /(autres?|differente?s?|plusieurs) (temperature|tube|amylase|enzyme|concentration|quantit|aliment|substance|molecule)/, /temperature( \w+){0,3} (differ|autre|plus|froid|chaud|0|10|20|60|80)/, /\bsaliv/, /(pourrait|faudrait|faut|peut|devrait|pour|essayer de)( \w+){0,4} (mesur|dos|quantifi)/, /(sans amidon|autre aliment|pomme de terre|pain|riz)/, /(plus longtemps|plus de temps|attendre plus)/) }],
    model: "Mais l'expérience est faite une seule fois, dans un tube, et non dans le tube digestif : elle ne dit pas ce qui se passe vraiment dans l'intestin. On pourrait la répéter, ou refaire le test avec de l'amylase bouillie pour vérifier que c'est bien l'enzyme qui agit." },
  { k: "hv", p: 0, lab: "Notre hypothèse est…", sub: "relisez votre hypothèse de départ · non noté", o: ["validée", "en partie validée", "invalidée"], ord: [0, 1, 2], ans: null },
  { k: "c6", t: "txt", p: 0.5, lab: "Retour sur l'hypothèse", sub: "rédigez : justifiez votre réponse en vous appuyant sur vos résultats", ph: "Notre hypothèse est … car nos résultats montrent que …",
    crit: [{ lab: "s'appuie sur un résultat de l'expérience (amidon, glucose, tube témoin…) pour valider ou non l'hypothèse", p: 0.5, f: n => any(n, /amidon|glucose|tube|temoin|iod|glucotest|bleu|jaune|vert|violet|brun|resultat|am[iy]l/) && any(n, /\b(car|puisque|parce|donc|comme|en effet|montre|prouve|vu que|d apres|grace|or|alors que|mais)\b/) }],
    model: "Notre hypothèse est validée car, dans le tube 2 avec amylase, l'amidon a disparu et du glucose est apparu, alors que rien n'a changé dans le tube témoin sans amylase." }];
const MINTXT = 15;
const MAXAPP = 8, MANIP = 2;
const MANIP_GRID = ["Tube témoin préparé et sans amylase", "Gestes dans le bon ordre (empois, amylase, bain-marie, prélèvements)", "Pipettes propres : pas de contamination entre les tubes", "Eau iodée dans les godets, jamais dans les tubes", "Prélèvements à l'heure (toutes les 3 minutes)", "Soin, sécurité et rangement de la paillasse"];

/* ---------- dessin de la paillasse (tiré du TP virtuel de pomme_widgets.js) ----------
   st = { fill:[f1,f2], amyl, drop:{i,q}|null, bath:0..1, time, god:[[5],[5]] (null | "?" | clé de couleur), pip:{i,c,q}|null, strips:null|{z:[k1,k2], dip} } */
function drawScene(W, F, st) {
  const tk = TK(F), nar = W < 460, hb = F * 10, bx0 = W * 0.04, bx1 = W * (nar ? 0.62 : 0.58), by0 = hb * 0.5, tw = F * 1.6, th = F * 5.2, tx = i => bx0 + (bx1 - bx0) * (0.3 + 0.4 * i), inY = F * 3.4, outY = F * 0.9, now = performance.now();
  const ty = outY + (inY - outY) * st.bath;
  const col0 = F * 4.6, cw = (W - col0 - F * 0.4) / 5, r = Math.min(F * 0.95, cw * 0.36), py = hb + F * 2.9, wx = c => col0 + cw * (c + 0.5), wy = i => py + i * F * 2.5;
  let g = `<rect x="${bx0}" y="${by0}" width="${bx1 - bx0}" height="${hb - by0}" rx="8" style="fill:var(--sea);opacity:${0.12 + 0.18 * st.bath}"/><path d="M${bx0} ${by0 - F * 0.4} L${bx0} ${hb} L${bx1} ${hb} L${bx1} ${by0 - F * 0.4}" style="fill:none;stroke:var(--ink);stroke-width:2.5"/>` + sT(bx0 + 6, hb - 8, "Bain-marie 37 °C", "start", tk * 0.92, 'font-weight="700"');
  if (st.bath >= 1) for (let k = 0; k < 5; k++) { const ph = (now / 1400 + k * 0.23) % 1; g += `<circle cx="${bx0 + (bx1 - bx0) * (0.08 + 0.21 * k)}" cy="${hb - 6 - ph * (hb - by0 - 10)}" r="${2 + (k % 2)}" style="fill:var(--surface);opacity:${0.7 * (1 - ph)}"/>`; }
  [0, 1].forEach(i => { const x = tx(i), f = st.fill[i];
    if (f > 0) g += `<rect x="${x - tw / 2 + 2}" y="${ty + th * (1 - 0.6 * f)}" width="${tw - 4}" height="${Math.max(0, th * 0.6 * f - 3)}" rx="${tw * 0.4}" style="fill:var(--starch)"/>`;
    if (i === 1 && st.amyl) g += `<rect x="${x - tw / 2 + 2}" y="${ty + th * 0.4}" width="${tw - 4}" height="${th * 0.12}" style="fill:var(--c3);opacity:.35"/>`;
    g += `<path d="M${x - tw / 2} ${ty} L${x - tw / 2} ${ty + th - tw / 2} Q${x - tw / 2} ${ty + th} ${x} ${ty + th} Q${x + tw / 2} ${ty + th} ${x + tw / 2} ${ty + th - tw / 2} L${x + tw / 2} ${ty}" style="fill:none;stroke:var(--ink);stroke-width:2.4"/>` + sT(x, ty - 6, (nar ? "T" : "Tube ") + (i + 1) + (i === 1 && st.amyl ? " + A" : ""), "middle", tk * 0.92, 'font-weight="800"'); });
  if (st.drop) g += `<circle cx="${tx(st.drop.i)}" cy="${-4 + (ty + th * 0.4 + 4) * st.drop.q}" r="${F * 0.22}" style="fill:var(--c3)"/>`;
  if (st.time !== null && st.time !== undefined) g += sT(W - 6, F * 1.3, "⏱ " + String(st.time).replace(".", ",") + " min", "end", tk * 1.25, 'font-weight="800"');
  if (st.strips) [0, 1].forEach(i => { const x = W * (0.7 + 0.16 * i), dip = Math.sin(clamp(st.strips.dip * 2) * Math.PI) * F * 1.2, z = st.strips.z[i];
    g += `<rect x="${x - F * 0.35}" y="${F * 2.6 + dip}" width="${F * 0.7}" height="${F * 3.2}" rx="3" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.5"/><rect x="${x - F * 0.35}" y="${F * 4.9 + dip}" width="${F * 0.7}" height="${F * 0.9}" style="fill:var(--${z && z !== "?" ? z : "well"});stroke:var(--ink);stroke-width:1.5"/>` + (z === "?" ? sT(x, F * 5.6 + dip, "?", "middle", tk * 0.8, 'font-weight="800"') : "") + sT(x, F * 7, "B" + (i + 1), "middle", tk * 0.9, 'font-weight="700"'); });
  if (st.strips) g += sT(W * 0.78, F * 8.1, "Glucotest", "middle", tk * 0.9);
  g += `<rect x="2" y="${hb + F * 0.5}" width="${W - 4}" height="${F * 7}" rx="10" style="fill:var(--surface-2);stroke:var(--line)"/>`;
  for (let c = 0; c < 5; c++) g += sT(wx(c), py - r - 7, TIMES[c] + (cw > F * 3.2 ? " min" : "′"), "middle", tk * 0.9, 'font-weight="700"');
  [0, 1].forEach(i => { g += sT(8, wy(i) + tk * 0.35, "Tube " + (i + 1), "start", tk * 0.9, 'font-weight="700"');
    for (let c = 0; c < 5; c++) { const v = st.god[i][c];
      g += `<circle cx="${wx(c)}" cy="${wy(i)}" r="${r}" style="fill:var(--well);stroke:var(--ink);stroke-width:1.8"/>` + (v && v !== "?" ? `<circle cx="${wx(c)}" cy="${wy(i)}" r="${r - 2}" style="fill:var(--${v})"/>` : v === "?" ? `<circle cx="${wx(c)}" cy="${wy(i)}" r="${r - 2}" style="fill:var(--neutral)"/>` + sT(wx(c), wy(i) + tk * 0.35, "?", "middle", tk, 'font-weight="800"') : ""); }
    if (st.pip && st.pip.q < 1) { const u = st.pip.q < 0.6 ? st.pip.q / 0.6 : 1, x0 = tx(i), y0 = ty, x1 = wx(st.pip.c), y1 = wy(i); g += `<circle cx="${x0 + (x1 - x0) * u}" cy="${y0 + (y1 - y0) * u - Math.sin(u * Math.PI) * F * 2}" r="${F * 0.2}" style="fill:var(--starch);stroke:var(--ink);stroke-width:1"/>`; if (st.pip.q > 0.65) g += `<circle cx="${x1}" cy="${y1 - (1 - st.pip.q) * F * 6}" r="${F * 0.17}" style="fill:var(--io2)"/>`; } });
  return `<svg viewBox="0 0 ${W} ${hb + F * 7.8}" width="${W}" height="${hb + F * 7.8}" role="img" aria-label="Paillasse schématisée : deux tubes, un bain-marie, une plaque à godets et deux bandelettes Glucotest.">${g}</svg>`;
}

/* ---------- protocole animé : le geste, jamais le résultat ---------- */
const STEPS1 = [
  { k: "s1", txt: "Étiquette les tubes 1 et 2, puis verse 5 mL d'empois d'amidon dans chacun.", anim: "empois" },
  { k: "s2", txt: "Ajoute 2 mL d'amylase dans le tube 2 seulement. Le tube 1, sans amylase, est le témoin.", anim: "amyl" },
  { k: "s3", txt: "Place les deux tubes au bain-marie à 37 °C, puis lance le chronomètre : fais aussitôt le premier prélèvement (0 minute).", anim: "bath", go: "✓ C'est fait : lancer le chronomètre" }];
const SAMPLE_TXT = "Prélève quelques gouttes de chaque tube avec une pipette propre (une par tube), dépose-les dans deux godets, puis ajoute une goutte d'eau iodée dans chaque godet.";
const GLUCO_TXT = "Après le dernier test à l'eau iodée : trempe une bandelette Glucotest dans chaque tube, puis lis la couleur de la zone réactive.";
let AN = { kind: null, t0: 0, dur: 1, c: 0 }, raf = 0, tick = 0;
function sceneFor(kind, q, c) {
  const prev = (i) => S.obs["t" + (i + 1)].map((v, j) => v === null ? null : j < c ? IOC[v][0] : null);
  const st = { fill: [1, 1], amyl: true, drop: null, bath: 1, time: null, god: [[null, null, null, null, null], [null, null, null, null, null]], pip: null, strips: null };
  if (kind === "empois") Object.assign(st, { fill: [clamp(q * 2), clamp(q * 2 - 1)], amyl: false, bath: 0 });
  else if (kind === "amyl") Object.assign(st, { amyl: q >= 1, drop: q < 1 ? { i: 1, q } : null, bath: 0 });
  else if (kind === "bath") Object.assign(st, { bath: clamp(q * 1.3), time: 0 });
  else if (kind === "sample") { st.time = TIMES[c]; st.god = [prev(0), prev(1)]; if (q > 0.7) { st.god[0][c] = "?"; st.god[1][c] = "?"; } st.pip = q < 1 ? { c, q } : null; }
  else if (kind === "gluco") { st.time = 12; st.god = [prev(0), prev(1)]; st.strips = { z: q > 0.6 ? ["?", "?"] : [null, null], dip: q }; }
  return st;
}
function animFig(host, kind, c) {
  const fig = liveSVG(host, (W, F) => drawScene(W, F, sceneFor(kind, AN.kind === kind && AN.host === host ? clamp((performance.now() - AN.t0) / AN.dur) : 1, c)));
  const play = () => { AN = { kind, t0: performance.now(), dur: kind === "sample" ? 2400 : 1800, c, host }; cancelAnimationFrame(raf); const loop = () => { if (!document.body.contains(host)) return; fig.draw(); if (performance.now() - AN.t0 < AN.dur || kind === "bath") raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); };
  return { fig, play };
}

/* ---------- notation ---------- */
const rnd = x => Math.round(x * 100) / 100;
const isTxt = it => it.t === "txt";
const txtOf = (pid, k) => String(S.ans[pid][k] || "").trim();
const critRes = (it, v) => { const n = nrm(v); return it.crit.map(c => !!n && !!c.f(n)); };
const modelOf = it => typeof it.model === "function" ? it.model() : it.model;
const itemScore = (pid, it) => { const v = S.ans[pid][it.k]; if (isTxt(it)) return rnd(critRes(it, v).reduce((s, x, i) => s + (x ? it.crit[i].p : 0), 0)); const a = ansOf(it); return a !== null && a !== undefined && v === a ? it.p : 0; };
const partScore = P => rnd(P.items.reduce((s, it) => s + itemScore(P.id, it), 0));
const CMAX = rnd(CONC.reduce((s, c) => s + c.p, 0));
const concScore = () => rnd(CONC.reduce((s, c) => s + itemScore("c", c), 0));
const total = () => rnd(PARTS.reduce((s, P) => s + partScore(P), 0) + concScore());
const allVal = () => S.val.p1 && S.val.p2 && S.val.c;
const missingTxt = (pid, items) => items.filter(isTxt).some(it => txtOf(pid, it.k).length < MINTXT);

function txtHTML(pid, it, val, num) {
  const v = txtOf(pid, it.k), shown = !!S.rendu, id = `tx-${pid}-${it.k}`;
  let h = `<div class="rowq"><label class="rt" for="${id}">${num ? `<span class="cn">${num}</span> ` : ""}${num ? `<b>${it.lab}</b> <span class="muted">(${nb(it.sub)})</span>` : nb(it.lab)} <span class="ctag">${pts(it.p)} pt · réponse rédigée</span></label>
    <textarea class="inp" id="${id}" data-tx="${it.k}" ${val ? "readonly" : ""} placeholder="${esc(it.ph)}" style="min-height:5rem">${esc(S.ans[pid][it.k] || "")}</textarea>${val ? "" : `<p class="cap" data-cnt="${it.k}"></p>`}`;
  if (shown) { const r = critRes(it, v); h += `<div class="corr"><p class="h">Éléments attendus · ${pts(itemScore(pid, it))} / ${pts(it.p)} pt (relu par le professeur)</p><ul class="ul">${it.crit.map((c, i) => `<li>${r[i] ? "✓ présent" : "✗ absent"} (${pts(c.p)} pt) : ${nb(labOf(c))}</li>`).join("")}</ul><p><b>Exemple de réponse :</b> ${nb(modelOf(it))}</p></div>`; }
  return h + "</div>";
}
function wireTxt(m, pid) {
  $$("[data-tx]", m).forEach(ta => { const k = ta.dataset.tx, c = $(`[data-cnt="${k}"]`, m);
    const cnt = () => { if (!c) return; const L = ta.value.trim().length; c.textContent = `${L} caractères${L < MINTXT ? ` (au moins ${MINTXT})` : ""}`; };
    ta.addEventListener("input", () => { S.ans[pid][k] = ta.value; save(); cnt(); }); cnt(); });
}

/* ---------- navigation ---------- */
const VIEWS = ["consignes", "p1", "p2", "conc", "copie", "sim"];
const TABN = { consignes: "Consignes", p1: `1 · Préparer (/${PARTS[0].max})`, p2: `2 · Résultats (/${pts(PARTS[1].max)})`, conc: `Conclusion (/${pts(CMAX)})`, copie: "Compte rendu", sim: "🔓 Simulation" };
const visible = () => VIEWS.filter(v => v !== "sim" || S.rendu);
function tabs() {
  $("#tabs").innerHTML = visible().map(v => { const done = v === "conc" ? S.val.c : S.val[v], st = v === "copie" ? (S.rendu ? "✓ rendu" : "") : done ? "✓" : ""; return `<button class="tab" type="button" data-v="${v}" ${S.view === v ? 'aria-current="page"' : ""}>${TABN[v]}${st ? `<span class="dot" aria-label="${v === "copie" ? "compte rendu rendu" : "partie validée"}">${st}</span>` : ""}</button>`; }).join("");
  $$("#tabs .tab").forEach(b => b.onclick = () => go(b.dataset.v));
}
function go(v, noScroll) {
  if (!visible().includes(v)) v = "consignes"; S.view = v; save(); tabs(); clearInterval(tick); cancelAnimationFrame(raf); AN = { kind: null };
  if (location.hash !== "#" + v) { try { history.replaceState(null, "", "#" + v); } catch (e) {} }
  const m = $("#main");
  if (v === "consignes") renderConsignes(m); else if (v === "p1") renderP1(m); else if (v === "p2") renderP2(m); else if (v === "conc") renderConc(m); else if (v === "copie") renderCopie(m); else renderSim(m);
  if (!noScroll) window.scrollTo(0, 0);
  const c = $("#tabs [aria-current]"); if (c && c.scrollIntoView) c.scrollIntoView({ block: "nearest", inline: "center" });
}
const nextBtn = (v, t) => `<div class="row"><button type="button" class="btn" data-next="${v}">${t}</button></div>`;
const wireNext = m => $$("[data-next]", m).forEach(b => b.onclick = () => go(b.dataset.next));
const PROBLEME = "Que devient l'amidon en présence d'amylase ?";
const RAPPEL = `<div class="box info"><p class="lab">ℹ Rappels</p><ul class="ul"><li>${nb("L'eau iodée met en évidence l'amidon : elle devient <b>bleu-noir</b> en sa présence. Sans amidon, elle garde sa couleur jaune-orangé.")}</li><li>${nb("La bandelette Glucotest met en évidence le glucose : sa zone réactive devient <b>verte</b> en sa présence.")}</li></ul></div>`;
function groupHTML() { return `<div class="panel"><h3>${nb("Notre groupe")}</h3><p class="lead">${nb("Prénoms des élèves du groupe : ils figurent sur le compte rendu (ils restent sur cet appareil).")}</p><div class="grp">${S.groupe.map((g, i) => `<input class="inp" data-g="${i}" maxlength="30" autocomplete="off" placeholder="Prénom ${i + 1}${i ? " (facultatif)" : ""}" aria-label="Prénom ${i + 1}" value="${esc(g || "")}">`).join("")}</div></div>`; }
const wireGroup = m => $$("[data-g]", m).forEach(x => x.addEventListener("input", () => { S.groupe[+x.dataset.g] = x.value; save(); }));

/* ---------- consignes ---------- */
function renderConsignes(m) {
  m.innerHTML = `<section class="view">
    <div class="panel"><p class="kicker">Le métabolisme des cellules · TP évalué</p><h2 class="sec-title">${nb("L'action de l'amylase sur l'amidon")}</h2>
      <div class="box info"><p class="lab">ℹ Problème</p><p><b>${nb(PROBLEME)}</b></p><p>${nb("La pomme de terre est riche en amidon. L'amylase est une molécule présente dans la salive et le suc pancréatique.")}</p></div>
      <p class="lead">${nb("Vous réalisez la manipulation <b>en vrai</b>. Cette application vous guide pas à pas, chronomètre les prélèvements, recueille vos observations et vos réponses, puis construit votre <b>compte rendu</b>.")}</p></div>
    ${groupHTML()}
    ${RAPPEL}
    <div class="panel"><h3>Barème</h3>${tbl(["Partie", "Points"], [[PARTS[0].title, pts(PARTS[0].max)], [PARTS[1].title, pts(PARTS[1].max)], ["Conclusion (je vois, je sais, or, donc, mais)", "4"], ["Retour sur l'hypothèse (justification)", "0,5"], ["<b>Sous-total noté dans l'application</b>", `<b>${MAXAPP}</b>`], ["Manipulation (soin, protocole) · notée par le professeur", String(MANIP)], ["<b>Total</b>", `<b>${MAXAPP + MANIP}</b>`]])}
      <p class="cap">${nb("L'hypothèse de départ n'est pas notée. Les résultats sont notés selon <b>vos</b> observations : notez ce que vous voyez vraiment. Les réponses rédigées sont relues par le professeur.")}</p></div>
    <div class="box warn"><p class="lab">⚠ Règles du TP noté</p><ul class="ul">
      <li>${nb("Chaque partie se valide <b>une seule fois</b> : relisez-vous avant de valider.")}</li>
      <li>${nb("Aucune correction n'est affichée avant la remise du compte rendu.")}</li>
      <li>${nb("Rédigez des phrases complètes, avec le vocabulaire du cours (amidon, glucose, amylase, enzyme, témoin).")}</li>
      <li>${nb(`Votre manipulation est notée sur ${MANIP} par le professeur, qui observe votre paillasse.`)}</li>
      <li>${nb("Une simulation de l'expérience sera proposée <b>après</b> la remise, pour comparer avec vos résultats.")}</li></ul></div>
    <div class="box err"><p class="lab">✖ Attention</p><p>${nb("Le tube 1 est le témoin : il ne reçoit jamais d'amylase. Une pipette par tube. L'eau iodée se met dans les godets, jamais dans les tubes. Éloignez l'iPad des liquides.")}</p></div>
    ${nextBtn("p1", "Commencer la partie 1 →")}</section>`;
  wireGroup(m); wireNext(m);
}

/* ---------- fiche de questions d'une partie (choix + rédigé) ---------- */
function rowsHTML(P) {
  const A = S.ans[P.id], val = !!S.val[P.id], done = P.ready(), shown = !!S.rendu;
  return P.items.map(it => { if (isTxt(it)) return done ? txtHTML(P.id, it, val) : ""; const ok = ansOf(it);
    return `<div class="rowq"><span class="rt">${nb(it.lab)} <span class="ctag">${pts(it.p)} pt</span></span><div class="seg" role="group" aria-label="${esc(it.lab)}">${it.o.map((o, j) => { const sel = A[it.k] === j, cls = shown && sel ? (j === ok ? "is-ok" : "is-bad") : ""; return `<button type="button" class="${cls}" data-k="${it.k}" data-j="${j}" aria-pressed="${sel}" ${val || !done ? "disabled" : ""}>${cls === "is-ok" ? "✓ " : cls === "is-bad" ? "✗ " : ""}${nb(o)}</button>`; }).join("")}</div>${shown && A[it.k] !== ok ? `<p class="pfb bad">Réponse cohérente avec vos observations : <b>${nb(it.o[ok])}</b></p>` : ""}</div>`; }).join("");
}
function ficheHTML(P) { return `<div class="panel"><h3>Fiche de questions <span class="chip">/ ${pts(P.max)} point${P.max > 1 ? "s" : ""}</span></h3><div class="rows" id="rows"></div><div class="row acts" id="acts"></div><div id="vmsg" aria-live="polite"></div></div>`; }
function wireFiche(m, P, lockMsg) {
  const paint = () => {
    $("#rows", m).innerHTML = (P.ready() ? "" : `<p class="locked">🔒 ${nb(lockMsg)}</p>`) + rowsHTML(P);
    $$("#rows [data-k]", m).forEach(b => b.onclick = () => { S.ans[P.id][b.dataset.k] = +b.dataset.j; save(); paint(); const n = $(`#rows [data-k="${b.dataset.k}"][data-j="${b.dataset.j}"]`, m); if (n) n.focus(); });
    wireTxt($("#rows", m), P.id);
    const acts = $("#acts", m), msg = $("#vmsg", m);
    if (S.val[P.id]) { acts.innerHTML = ""; msg.innerHTML = S.rendu ? `<div class="fb ${partScore(P) === P.max ? "ok" : "bad"}"><p class="h">Partie ${P.n} : ${pts(partScore(P))} / ${pts(P.max)}</p></div>` : `<div class="fb neutral"><p class="h">✓ Partie ${P.n} validée.</p><p>${nb("Vous ne pouvez plus la modifier. La correction s'affichera à la remise du compte rendu.")}</p></div>`; return; }
    acts.innerHTML = `<button type="button" class="btn" id="valBtn">Valider la partie ${P.n}</button>`; msg.innerHTML = "";
    armButton($("#valBtn", m), `Valider la partie ${P.n}`, "Confirmer : je ne pourrai plus modifier", () => {
      if (!P.ready()) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb(lockMsg)}</p></div>`; return; }
      if (P.items.some(it => !isTxt(it) && S.ans[P.id][it.k] === undefined)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb("Répondez à toutes les questions avant de valider.")}</p></div>`; return; }
      if (missingTxt(P.id, P.items)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb(`Rédigez votre réponse (au moins ${MINTXT} caractères).`)}</p></div>`; return; }
      S.val[P.id] = Date.now(); save(); tabs(); go(P.id, true);
    });
  };
  paint(); return paint;
}

/* ---------- partie 1 : hypothèse et préparation ---------- */
function renderP1(m) {
  const P = PARTS[0], s1 = !!S.steps.s1, cur = STEPS1.findIndex(s => !S.steps[s.k]);
  m.innerHTML = `<section class="view"><div><p class="kicker">Partie 1 · ${pts(P.max)} point</p><h2 class="sec-title">${nb(P.title)}</h2></div>
    <div class="box info"><p class="lab">ℹ Problème</p><p><b>${nb(PROBLEME)}</b></p></div>
    <div class="panel"><h3>${nb("Notre hypothèse")} <span class="chip">non notée</span></h3>
      <p class="lead">${nb(s1 ? "Votre hypothèse est enregistrée : vous y reviendrez dans la conclusion." : "Avant de manipuler, écrivez ce que vous pensez qu'il va se passer, et pourquoi.")}</p>
      <textarea class="inp" id="hyp" ${s1 ? "readonly" : ""} placeholder="${esc("Nous pensons que, dans le tube avec amylase, l'amidon …")}" style="min-height:4.5rem">${esc(S.hyp || "")}</textarea>${s1 ? "" : `<p class="cap" id="hypc"></p>`}</div>
    <div class="panel"><h3>Protocole · préparation</h3><ol class="psteps" id="psteps"></ol></div>
    ${ficheHTML(P)}${nextBtn("p2", "Partie 2 →")}</section>`;
  const hy = $("#hyp", m), hc = $("#hypc", m), hcnt = () => { if (hc) { const L = hy.value.trim().length; hc.textContent = `${L} caractères${L < MINTXT ? ` (au moins ${MINTXT} pour commencer la manipulation)` : ""}`; } };
  const paintSteps = () => {
    const c = STEPS1.findIndex(s => !S.steps[s.k]), hypOk = String(S.hyp || "").trim().length >= MINTXT;
    $("#psteps", m).innerHTML = STEPS1.map((s, i) => { const done = !!S.steps[s.k], now = i === c;
      return `<li class="pstep ${done ? "ok" : now ? "now" : ""}"><div class="ph"><span class="ck">${done ? "✓" : i + 1}</span><span>${nb(s.txt)}</span></div>${now ? (hypOk || i > 0 ? `<div class="figbox" id="pfig"></div><div class="row"><button type="button" class="btn ghost" id="replay">▶ Revoir le geste</button><button type="button" class="btn" id="stepok">${s.go || "✓ C'est fait"}</button></div>` : `<p class="locked">🔒 ${nb("Écrivez d'abord votre hypothèse.")}</p>`) : ""}</li>`; }).join("");
    if (c >= 0 && (hypOk || c > 0)) { const s = STEPS1[c], a = animFig($("#pfig", m), s.anim, 0); a.play(); $("#replay", m).onclick = a.play;
      $("#stepok", m).onclick = () => { S.steps[s.k] = Date.now(); if (s.k === "s3") S.chrono = Date.now(); save(); if (s.k === "s1") { go("p1", true); return; } paintSteps(); paintF(); }; }
    if (c < 0) $("#psteps", m).insertAdjacentHTML("beforeend", `<li class="pstep ok"><div class="fb ok"><p class="h">✓ ${nb("Préparation terminée : le chronomètre tourne.")}</p><p>${nb("Passez à la partie 2 pour les prélèvements. Vous pouvez répondre aux questions de la partie 1 pendant les attentes.")}</p><div class="row"><button type="button" class="btn" data-next="p2">Partie 2 : prélèvements →</button></div></div></li>`);
    wireNext(m);
  };
  if (!s1) { hy.addEventListener("input", () => { const was = String(S.hyp || "").trim().length >= MINTXT; S.hyp = hy.value; save(); hcnt(); if ((S.hyp.trim().length >= MINTXT) !== was) paintSteps(); }); hcnt(); }
  paintSteps();
  const paintF = wireFiche(m, P, "Terminez d'abord la préparation (étapes 1 à 3).");
  wireNext(m);
}

/* ---------- partie 2 : prélèvements chronométrés et observations ---------- */
const elapsed = () => S.chrono ? (Date.now() - S.chrono) / 1000 : 0;
const mmss = s => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
const EARLY = 20; // un prélèvement peut être saisi 20 s avant l'heure
const nextIdx = () => TIMES.findIndex((t, c) => S.obs.t1[c] === null || S.obs.t2[c] === null);
const openAt = c => elapsed() >= TIMES[c] * 60 - EARLY;
function palHTML(key, list, sel, lock) { return `<div class="pal" role="radiogroup">${list.map(([v, nm], j) => `<button type="button" class="swb" role="radio" aria-checked="${sel === j}" data-o="${key}" data-j="${j}" ${lock ? "disabled" : ""}><i style="background:var(--${v})"></i>${nb(nm)}</button>`).join("")}</div>`; }
function obsTable() {
  const cell = (v, L) => v === null ? "—" : `<span class="sw"><i style="background:var(--${L[v][0]})"></i>${L[v][1]}</span>`;
  const rows = TIMES.map((t, c) => [t + " min", cell(S.obs.t1[c], IOC), cell(S.obs.t2[c], IOC)]);
  rows.push(["Glucotest (12 min)", cell(S.obs.g1, GLC), cell(S.obs.g2, GLC)]);
  return `<p class="cap"><b>${nb("Tableau · Couleur de l'eau iodée au cours du temps et couleur des bandelettes Glucotest, à 37 °C (nos observations)")}</b></p>` + tbl(["Temps", "Tube 1 (témoin)", "Tube 2 (+ amylase)"], rows);
}
function renderP2(m) {
  const P = PARTS[1];
  m.innerHTML = `<section class="view"><div><p class="kicker">Partie 2 · ${pts(P.max)} points</p><h2 class="sec-title">${nb(P.title)}</h2></div>
    ${!S.steps.s3 ? `<p class="locked">🔒 ${nb("Terminez d'abord la préparation (partie 1) : le chronomètre démarre quand les tubes sont au bain-marie.")}</p>` : `
    <div class="panel chronop"><div class="row" style="justify-content:space-between;align-items:center"><span class="chrono" id="chrono" aria-live="off"></span><span class="chip" id="nextc" aria-live="polite"></span></div><div id="recal"></div></div>
    ${RAPPEL}
    <div class="panel"><h3>${nb("Prélèvements et observations")}</h3><p class="lead">${nb("Notez la couleur que vous voyez <b>vraiment</b> dans chaque godet, même si elle vous surprend.")}</p><div id="obs"></div></div>
    <div class="panel"><h3>${nb("Notre tableau de résultats")}</h3><div id="otab"></div></div>`}
    ${ficheHTML(P)}${nextBtn("conc", "Conclusion →")}</section>`;
  const paintF = wireFiche(m, P, "Notez d'abord toutes vos observations (eau iodée de 0 à 12 minutes, puis Glucotest).");
  wireNext(m);
  if (!S.steps.s3) return;
  const lock = !!S.val.p2 || !!S.rendu;
  let editing = null, lastKey = "";
  const paintObs = () => {
    const n = nextIdx(), glOpen = n < 0, el = $("#obs", m);
    const key = [n, editing, glOpen, S.obs.g1, S.obs.g2, n >= 0 && openAt(n)].join("|"); lastKey = key;
    let h = "";
    TIMES.forEach((t, c) => { const done = S.obs.t1[c] !== null && S.obs.t2[c] !== null, cur = c === n || editing === c;
      if (cur && !lock) { const open = openAt(c) || done;
        h += `<div class="obsrow now"><p class="ot"><b>${t} min</b> · ${nb(SAMPLE_TXT)}</p>${open ? (editing === c ? "" : `<div class="figbox" id="sfig"></div><div class="row"><button type="button" class="btn ghost" id="replay">▶ Revoir le geste</button></div>`) + `<p class="ol">Godet du tube 1 (témoin)</p>${palHTML("t1-" + c, IOC, S.obs.t1[c], lock)}<p class="ol">Godet du tube 2 (+ amylase)</p>${palHTML("t2-" + c, IOC, S.obs.t2[c], lock)}${editing === c ? `<div class="row"><button type="button" class="btn" id="edok">✓ Terminé</button></div>` : ""}` : `<p class="locked">⏱ ${nb(`Prélèvement à ${t} min : attendez le signal du chronomètre`)} (<span id="cd">${mmss(TIMES[c] * 60 - elapsed())}</span>).</p>`}</div>`; }
      else if (done) h += `<div class="obsrow ok"><span class="ck">✓</span><span><b>${t} min</b> · tube 1 : <span class="sw"><i style="background:var(--${IOC[S.obs.t1[c]][0]})"></i>${IOC[S.obs.t1[c]][1]}</span> · tube 2 : <span class="sw"><i style="background:var(--${IOC[S.obs.t2[c]][0]})"></i>${IOC[S.obs.t2[c]][1]}</span></span>${lock ? "" : `<button type="button" class="btn ghost sm" data-edit="${c}">Modifier</button>`}</div>`;
      else h += `<div class="obsrow"><span class="ck">${c + 1}</span><span class="muted">${t} min · à venir</span></div>`; });
    h += glOpen ? `<div class="obsrow ${S.obs.g1 !== null && S.obs.g2 !== null ? "ok" : "now"}"><p class="ot"><b>Glucotest</b> · ${nb(GLUCO_TXT)}</p>${lock ? "" : `<div class="figbox" id="gfig"></div><div class="row"><button type="button" class="btn ghost" id="greplay">▶ Revoir le geste</button></div>`}<p class="ol">Bandelette du tube 1 (témoin)</p>${palHTML("g1", GLC, S.obs.g1, lock)}<p class="ol">Bandelette du tube 2 (+ amylase)</p>${palHTML("g2", GLC, S.obs.g2, lock)}</div>` : `<div class="obsrow"><span class="ck">6</span><span class="muted">Glucotest · après le test de 12 min</span></div>`;
    el.innerHTML = h;
    const rc = $("#recal", m);
    if (rc) { if (lock || n < 0) rc.innerHTML = ""; else { const T = TIMES[n];
      rc.innerHTML = `<p class="cap">${nb("Chronomètre lancé trop tôt ou trop tard ? Recalez-le : le prochain prélèvement se fait alors maintenant. Le recalage est signalé dans le compte rendu.")}</p><div class="row"><button type="button" class="btn ghost" id="recalBtn">↺ Recaler : prélèvement de ${T} min maintenant</button></div>`;
      armButton($("#recalBtn", m), `↺ Recaler : prélèvement de ${T} min maintenant`, `Confirmer : le chronomètre repart de ${T}:00`, () => { S.chrono = Date.now() - T * 60000; S.recal.push({ at: T, t: Date.now() }); save(); lastKey = ""; tickF(); }); } }
    const sf = $("#sfig", m); if (sf) { const c = n; const a = animFig(sf, "sample", c); a.play(); $("#replay", m).onclick = a.play; }
    const gf = $("#gfig", m); if (gf) { const a = animFig(gf, "gluco", 5); if (S.obs.g1 === null) a.play(); $("#greplay", m).onclick = a.play; }
    $$("[data-o]", el).forEach(b => b.onclick = () => { const [k, c] = b.dataset.o.split("-"), j = +b.dataset.j; if (c === undefined) S.obs[k] = j; else S.obs[k][+c] = j; save();
      const y = window.scrollY; const before = nextIdx(); if (editing === null && before !== n) { paintObs(); } else { $$(`[data-o="${b.dataset.o}"]`, el).forEach(x => x.setAttribute("aria-checked", String(+x.dataset.j === j))); } window.scrollTo(0, y); $("#otab", m).innerHTML = obsTable(); paintF(); });
    $$("[data-edit]", el).forEach(b => b.onclick = () => { editing = +b.dataset.edit; paintObs(); });
    const eo = $("#edok", m); if (eo) eo.onclick = () => { editing = null; paintObs(); };
    $("#otab", m).innerHTML = obsTable();
  };
  const tickF = () => { if (!document.body.contains(m) || S.view !== "p2") { clearInterval(tick); return; }
    const e = elapsed(), n = nextIdx(), ch = $("#chrono", m), nc = $("#nextc", m); if (!ch) return;
    ch.textContent = "⏱ " + mmss(e); const cd = $("#cd", m); if (cd && n >= 0) cd.textContent = mmss(TIMES[n] * 60 - e);
    if (lock || obsDone()) nc.textContent = "✓ Observations terminées";
    else if (n < 0) nc.textContent = "Glucotest : maintenant";
    else { const d = TIMES[n] * 60 - e; nc.textContent = d <= EARLY ? `Prélèvement de ${TIMES[n]} min : maintenant !` : `Prélèvement de ${TIMES[n]} min dans ${mmss(d)}`; nc.className = "chip" + (d <= EARLY ? " go" : ""); }
    const key = [n, editing, n < 0, S.obs.g1, S.obs.g2, n >= 0 && openAt(n)].join("|"); if (key !== lastKey) paintObs(); };
  paintObs(); tickF(); clearInterval(tick); tick = setInterval(tickF, 500);
}

/* ---------- conclusion ---------- */
function renderConc(m) {
  const A = S.ans.c, val = !!S.val.c, shown = !!S.rendu, Q = CONC.filter(c => !isTxt(c) && c.p > 0), qmax = rnd(Q.reduce((s, c) => s + c.p, 0));
  const qHTML = (c, ci) => { const ok = ansOf(c); return `<div class="cstep"><p class="pl"><span class="cn">${ci}</span> <b>${c.lab}</b> <span class="muted">(${c.sub})</span> <span class="ctag">${c.p ? pts(c.p) + " pt" : "non noté"}</span></p><div class="opts" role="radiogroup" aria-label="${esc(c.lab)}">${c.ord.map(j => { const sel = A[c.k] === j, cls = shown && sel && c.p ? (j === ok ? "is-ok" : "is-bad") : ""; return `<button type="button" class="opt ${cls}" role="radio" aria-checked="${sel}" data-c="${c.k}" data-j="${j}" ${val ? "disabled" : ""}><span class="k">${"ABCD"[c.ord.indexOf(j)]}</span><span>${nb(c.o[j])}</span>${cls ? `<span class="tag">${cls === "is-ok" ? "✓ Juste" : "✗ Faux"}</span>` : ""}</button>`; }).join("")}</div>${shown && c.p && A[c.k] !== ok ? `<p class="pfb bad">Attendu (d'après vos observations) : ${nb(c.o[ok])}</p>` : ""}</div>`; };
  const HV = CONC.find(c => c.k === "hv"), C6 = CONC.find(c => c.k === "c6");
  m.innerHTML = `<section class="view"><div><p class="kicker">Conclusion · ${pts(CMAX)} points</p><h2 class="sec-title">${nb("Que devient l'amidon en présence d'amylase ?")}</h2><p class="lead">${nb("Construisez votre raisonnement à partir de vos propres résultats.")}</p></div>
    <div class="panel"><h3>Nos résultats</h3>${S.val.p2 ? obsTable() : `<p class="locked">${nb("Validez d'abord la partie 2.")}</p>`}</div>
    <div class="panel"><h3>Raisonnement · étapes 1 à 3 <span class="chip">${pts(qmax)} pt</span></h3><p class="lead">${nb("Pour chaque étape, choisissez le morceau de phrase qui convient.")}</p><div class="conc">${Q.map((c, i) => qHTML(c, i + 1)).join("")}</div></div>
    <div class="panel"><h3>Raisonnement · étapes 4 et 5, rédigées <span class="chip">2,5 pt</span></h3><p class="lead">${nb("Rédigez avec vos propres mots, en phrases complètes.")}</p><div class="rows" id="ctx">${["c4", "c5"].map((k, i) => txtHTML("c", CONC.find(c => c.k === k), val, i + 4)).join("")}</div></div>
    <div class="panel"><h3>Retour sur l'hypothèse <span class="chip">0,5 pt</span></h3><p class="cap"><b>Notre hypothèse de départ :</b></p><p class="quote">« ${esc(S.hyp || "—")} »</p><div class="conc">${qHTML(HV, 6)}</div><div class="rows" id="ctx2">${txtHTML("c", C6, val, 7)}</div></div>
    <div class="row acts" id="acts"></div><div id="vmsg" aria-live="polite"></div>${nextBtn("copie", "Compte rendu →")}</section>`;
  wireTxt($("#ctx", m), "c"); wireTxt($("#ctx2", m), "c");
  $$("[data-c]", m).forEach(b => b.onclick = () => { A[b.dataset.c] = +b.dataset.j; save(); const y = window.scrollY; renderConc(m); window.scrollTo(0, y); const n = $(`[data-c="${b.dataset.c}"][data-j="${b.dataset.j}"]`, m); if (n) n.focus({ preventScroll: true }); });
  const acts = $("#acts", m), msg = $("#vmsg", m);
  if (val) { msg.innerHTML = S.rendu ? `<div class="fb ${concScore() === CMAX ? "ok" : "bad"}"><p class="h">Conclusion : ${pts(concScore())} / ${pts(CMAX)}</p></div>` : `<div class="fb neutral"><p class="h">✓ Conclusion validée.</p><p>${nb("La correction s'affichera à la remise du compte rendu.")}</p></div>`; }
  else { acts.innerHTML = `<button type="button" class="btn" id="valBtn">Valider la conclusion</button>`;
    armButton($("#valBtn", m), "Valider la conclusion", "Confirmer : je ne pourrai plus modifier", () => {
      if (!S.val.p2) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb("Validez d'abord la partie 2 : la conclusion s'appuie sur vos résultats.")}</p></div>`; return; }
      if (CONC.filter(c => !isTxt(c)).some(c => A[c.k] === undefined)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb("Choisissez un morceau de phrase pour chaque étape, et dites si votre hypothèse est validée.")}</p></div>`; return; }
      if (missingTxt("c", CONC)) { msg.innerHTML = `<div class="fb neutral"><p class="h">${nb(`Rédigez les étapes 4, 5 et 7 (au moins ${MINTXT} caractères chacune).`)}</p></div>`; return; }
      S.val.c = Date.now(); save(); tabs(); renderConc(m); }); }
  wireNext(m);
}

/* ---------- le compte rendu ---------- */
const hm = d => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const dmy = d => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const chOf = (pid, it) => { const a = S.ans[pid][it.k]; return a === undefined ? "—" : it.o[a]; };
const SIM = { t1: [0, 0, 0, 0, 0], t2: [0, 1, 2, 3, 4], g1: 0, g2: 2 };
function copyText() {
  const R = S.rendu, clean = x => String(x).replace(/ | /g, " ").replace(/<[^>]+>/g, ""), A1 = S.ans.p1, A2 = S.ans.p2, C = S.ans.c, P1 = PARTS[0], P2 = PARTS[1], it = (L, k) => L.find(x => x.k === k);
  const q = v => v || "—", lead = (w, v) => { v = String(v || "").trim(); return !v ? w + " —" : nrm(v).startsWith(nrm(w)) ? v : w + " " + v; }, iol = c => [IOC[S.obs.t1[c]], IOC[S.obs.t2[c]]].map(x => x ? x[1] : "—");
  let t = `COMPTE RENDU DE TP · L'ACTION DE L'AMYLASE SUR L'AMIDON\n2nde SVT · Thème 1 · Le métabolisme des cellules\n\nGroupe : ${groupNames().join(", ") || "—"}\n${R ? `Compte rendu rendu le ${dmy(R.t)} à ${hm(R.t)} · comptes rendus rendus sur cet appareil : ${R.n}` : `Date : ${dmy(Date.now())}`}\n`;
  t += `\n1. PROBLÈME\n${PROBLEME}\n`;
  t += `\n2. HYPOTHÈSE (non notée)\n${q(S.hyp)}\n`;
  t += `\n3. PROTOCOLE\n- Deux tubes contenant chacun 5 mL d'empois d'amidon.\n- Tube 2 : ajout de 2 mL d'amylase. Tube 1 : sans amylase, c'est le témoin.\n- Les deux tubes sont placés au bain-marie à 37 °C.\n- Toutes les 3 minutes, de 0 à 12 minutes : prélèvement de quelques gouttes de chaque tube, test à l'eau iodée dans un godet.\n- À 12 minutes : test de chaque tube avec une bandelette Glucotest.\nPourquoi 37 °C ? ${chOf("p1", it(P1.items, "c"))}.\nRôle du tube témoin : ${q(txtOf("p1", "j"))}\n${S.recal.length ? `Chronomètre de l'application recalé ${S.recal.length} fois (au prélèvement de ${S.recal.map(r => r.at + " min").join(", ")}).\n` : ""}`;
  t += `\n4. RÉSULTATS\nTableau · Couleur de l'eau iodée au cours du temps et couleur des bandelettes Glucotest, à 37 °C\nTemps | Tube 1 (témoin) | Tube 2 (+ amylase)\n${TIMES.map((tm, c) => `${tm} min | ${iol(c).join(" | ")}`).join("\n")}\nGlucotest (12 min) | ${S.obs.g1 === null ? "—" : GLC[S.obs.g1][1]} | ${S.obs.g2 === null ? "—" : GLC[S.obs.g2][1]}\n`;
  t += `Lecture : tube 1 (témoin) : ${chOf("p2", it(P2.items, "a"))} ; tube 2 : ${chOf("p2", it(P2.items, "b"))}. Glucotest : tube 1 : ${chOf("p2", it(P2.items, "g1"))} ; tube 2 : ${chOf("p2", it(P2.items, "g2"))}.\n`;
  t += `\n5. INTERPRÉTATION\n${q(txtOf("p2", "j"))}\n`;
  t += `\n6. CONCLUSION\nJe vois que ${chOf("c", it(CONC, "c1"))}.\nJe sais que ${chOf("c", it(CONC, "c2"))}.\nOr ${chOf("c", it(CONC, "c3"))}.\n${lead("Donc", txtOf("c", "c4"))}\n${lead("Mais", txtOf("c", "c5"))}\n`;
  t += `\n7. RETOUR SUR L'HYPOTHÈSE\nNotre hypothèse est ${chOf("c", it(CONC, "hv"))}.\nJustification : ${q(txtOf("c", "c6"))}\n`;
  if (R) {
    t += `\n────────────────────────\nNOTE\nApplication : ${pts(R.note)} / ${MAXAPP}\nManipulation (notée par le professeur) : ____ / ${MANIP}\nTOTAL : ____ / ${MAXAPP + MANIP}\n`;
    t += `\nGrille de manipulation (professeur)\n${MANIP_GRID.map(x => `[ ] ${x}`).join("\n")}\n`;
    t += `\nDÉTAIL DE LA NOTE (les réponses rédigées sont relues par le professeur)\n`;
    const line = (pid, x) => { if (isTxt(x)) { const r = critRes(x, txtOf(pid, x.k)); return `- ${x.lab.replace(/…$/, "")} (rédigé) : ${pts(itemScore(pid, x))} / ${pts(x.p)}\n${x.crit.map((c, i) => `    ${r[i] ? "[✓]" : "[ ]"} ${labOf(c)} (${pts(c.p)} pt)`).join("\n")}\n`; } if (!x.p) return ""; const a = ansOf(x); return `- ${x.lab} : ${chOf(pid, x)}${a === undefined || a === null ? "" : ` (attendu${typeof x.ans === "function" ? " d'après les observations" : ""} : ${x.o[a]})`} → ${pts(itemScore(pid, x))} / ${pts(x.p)}\n`; };
    PARTS.forEach(P => { t += `${P.title} : ${pts(partScore(P))} / ${pts(P.max)}\n` + P.items.map(x => line(P.id, x)).join(""); });
    t += `Conclusion et retour sur l'hypothèse : ${pts(concScore())} / ${pts(CMAX)}\n` + CONC.map(x => line("c", x)).join("");
    if (String(S.apres || "").trim()) t += `\nAPRÈS LA REMISE · COMPARAISON AVEC LA SIMULATION (non noté)\n${String(S.apres).trim()}\n`;
  }
  return clean(t + `\n${SIGN}\n`);
}
function renderCopie(m) {
  const R = S.rendu, st = [[PARTS[0].title, S.val.p1], [PARTS[1].title, S.val.p2], ["Conclusion et retour sur l'hypothèse", S.val.c]];
  const wr = [["Rôle du tube témoin", PARTS[0].items.find(isTxt), "p1"], ["Interprétation", PARTS[1].items.find(isTxt), "p2"], ...CONC.filter(isTxt).map(c => [c.lab, c, "c"])];
  m.innerHTML = `<section class="view"><div><p class="kicker">Compte rendu</p><h2 class="sec-title">${R ? "Notre compte rendu corrigé" : "Rendre notre compte rendu"}</h2></div>
    ${R ? `<div class="panel"><p class="score-big">${pts(R.note)} / ${MAXAPP}</p><div class="bar" aria-hidden="true"><i style="width:${R.note / MAXAPP * 100}%"></i></div><p class="lead">${nb(`+ manipulation sur ${MANIP}, notée par le professeur. Groupe : ${groupNames().join(", ") || "—"}. Rendu le ${dmy(R.t)} à ${hm(R.t)} · comptes rendus rendus sur cet appareil : ${R.n}`)}</p></div>
      <div class="panel"><h3>Détail de la note</h3>${tbl(["Partie", "Points"], [...PARTS.map(P => [P.title, `${pts(partScore(P))} / ${pts(P.max)}`]), ["Conclusion et retour sur l'hypothèse", `${pts(concScore())} / ${pts(CMAX)}`], ["<b>Sous-total (application)</b>", `<b>${pts(R.note)} / ${MAXAPP}</b>`], ["Manipulation (professeur)", `… / ${MANIP}`], ["<b>Total</b>", `<b>… / ${MAXAPP + MANIP}</b>`]])}
        <p class="lead">${nb("La correction détaillée s'affiche dans chaque onglet. Les résultats sont corrigés d'après vos observations ; les réponses rédigées sont relues par le professeur.")}</p></div>
      <div class="box key"><p class="lab">✔ Ce qu'il fallait conclure</p><p>${nb("Dans le tube 2, l'eau iodée passe peu à peu du bleu-noir au jaune et le Glucotest devient positif : l'amidon disparaît et du glucose apparaît. Dans le tube témoin, sans amylase, rien ne change. L'amidon étant formé de nombreuses molécules de glucose, l'amylase, une enzyme, transforme l'amidon en glucose. Mais l'expérience est faite en tube et une seule fois : il faudrait la répéter et la compléter (amylase bouillie, autre température).")}</p>${typical() ? "" : `<p>${nb("Vos résultats diffèrent du résultat attendu : comparez-les avec la simulation (onglet 🔓 Simulation) et cherchez une explication.")}</p>`}</div>
      <div class="panel"><h3>Nos réponses rédigées</h3>${wr.map(([t, it, pid]) => `<div class="field"><b>${nb(t)} · ${pts(itemScore(pid, it))} / ${pts(it.p)}</b><p class="quote">« ${esc(txtOf(pid, it.k))} »</p></div>`).join("")}</div>
      <div class="panel"><h3>Transmettre notre compte rendu</h3><div id="bt"></div></div>
      ${nextBtn("sim", "🔓 Comparer avec la simulation →")}`
    : `${groupHTML()}<div class="panel"><h3>Où en êtes-vous ?</h3><ul class="inds">${st.map(([n, v]) => `<li class="${v ? "done" : ""}"><span class="bx" aria-hidden="true">${v ? "✓" : ""}</span><span>${nb(n)} <span class="st">${v ? "✓ validée" : "à valider"}</span></span></li>`).join("")}</ul>
      ${allVal() ? `<p class="lead">${nb("Tout est validé. Quand vous rendez le compte rendu, la note s'affiche avec la correction, puis la simulation se débloque.")}</p><div class="row"><button type="button" class="btn" id="rendre">📝 Rendre notre compte rendu</button></div><div id="rmsg" aria-live="polite"></div>` : `<p class="locked">🔒 ${nb("Validez les trois parties pour pouvoir rendre le compte rendu.")}</p>`}</div>`}
    <div class="panel"><h3>Recommencer</h3><p class="lead">${nb("Efface le compte rendu, les observations et les prénoms sur cet appareil (pour le groupe suivant). Le nombre de comptes rendus rendus reste enregistré.")}</p><div class="row"><button class="btn ghost" type="button" id="reset">Tout effacer</button></div></div></section>`;
  if (!R) wireGroup(m);
  const r = $("#rendre", m); if (r) armButton(r, "📝 Rendre notre compte rendu", "Confirmer la remise", () => { if (!groupNames().length) { $("#rmsg", m).innerHTML = `<div class="fb neutral"><p class="h">${nb("Indiquez au moins un prénom dans « Notre groupe ».")}</p></div>`; return; } const M = meta(); M.n = (M.n || 0) + 1; setMeta(M); S.rendu = { t: Date.now(), note: total(), n: M.n }; save(); tabs(); renderCopie(m); window.scrollTo(0, 0); });
  if (R) { renderBilanTools($("#bt", m), copyText, () => `<p class="kicker">TP noté · Amylase et amidon · compte rendu à montrer au professeur</p><h2>${esc(groupNames().join(", ") || "Groupe")}</h2><p>${nb(`Rendu le ${dmy(R.t)} à ${hm(R.t)}`)}</p><p class="score-big">${pts(R.note)} / ${MAXAPP}</p>${PARTS.map(P => `<div class="line"><span>${nb(P.title)}</span><b class="num">${pts(partScore(P))} / ${pts(P.max)}</b></div>`).join("")}<div class="line"><span>Conclusion et retour sur l'hypothèse</span><b class="num">${pts(concScore())} / ${pts(CMAX)}</b></div><div class="line"><span>Manipulation (professeur)</span><b class="num">… / ${MANIP}</b></div><div class="line"><span>Total</span><b class="num">… / ${MAXAPP + MANIP}</b></div>${S.recal.length ? `<div class="line"><span>Chronomètre recalé</span><b class="num">${S.recal.length} fois</b></div>` : ""}<div class="line"><span>Comptes rendus rendus sur cet appareil</span><b class="num">${R.n}</b></div>`, "tp-amylase");
    const inp = $("#eleve", m); if (inp) { inp.value = groupNames().join(" ") || "groupe"; const f = inp.closest(".field"); if (f) f.hidden = true; } }
  wireNext(m);
  armButton($("#reset", m), "Tout effacer", "Confirmer l'effacement ?", () => { const fs = S.fs, th = S.theme; S = Object.assign(JSON.parse(JSON.stringify(DEF)), { fs, theme: th }); save(); go("consignes"); });
}

/* ---------- après la remise : la simulation, pour comparer ---------- */
function simScene(p) {
  const minute = clamp((p - 0.16) / 0.72) * 12, god = [[], []];
  for (let c = 0; c < 5; c++) { const on = p > 0.16 && minute >= TIMES[c] - 0.01; god[0][c] = on ? IOC[SIM.t1[c]][0] : null; god[1][c] = on ? IOC[SIM.t2[c]][0] : null; }
  return { fill: [1, 1], amyl: p >= 0.08, drop: p < 0.08 && p > 0 ? { i: 1, q: p / 0.08 } : null, bath: clamp((p - 0.08) / 0.06), time: Math.round(minute * 2) / 2, god, pip: null, strips: { z: p > 0.94 ? [GLC[SIM.g1][0], GLC[SIM.g2][0]] : [null, null], dip: p > 0.9 ? clamp((p - 0.9) / 0.06) : 0 } };
}
function renderSim(m) {
  const cell = (v, L) => v === null ? "—" : `<span class="sw"><i style="background:var(--${L[v][0]})"></i>${L[v][1]}</span>`;
  const cmp = i => tbl(["Temps", "Nous", "Simulé"], [...TIMES.map((t, c) => [t + " min", cell(S.obs["t" + i][c], IOC), cell(SIM["t" + i][c], IOC)]), ["Glucotest", cell(S.obs["g" + i], GLC), cell(SIM["g" + i], GLC)]]);
  m.innerHTML = `<section class="view"><div><p class="kicker">Après la remise · non noté</p><h2 class="sec-title">${nb("Comparer nos résultats avec la simulation")}</h2></div>
    <div class="panel"><h3>${nb("L'expérience simulée")}</h3><p class="lead">${nb("Lancez la simulation : le temps est accéléré.")}</p><div class="row animctl"></div><div class="figbox" id="simfig"></div><p class="sim">⚠ ${nb("Valeurs simulées · modèle simplifié")}</p></div>
    <div class="panel"><h3>${nb("Nos résultats et les résultats simulés")}</h3><div class="cmpw"><div><p class="cap"><b>Tube 1 (témoin)</b></p>${cmp(1)}</div><div><p class="cap"><b>Tube 2 (+ amylase)</b></p>${cmp(2)}</div></div></div>
    <div class="panel"><h3>${nb("Et vous ?")} <span class="chip">non noté</span></h3><label class="rt" for="apres">${nb("Vos résultats sont-ils conformes à la simulation ? Si non, proposez une explication (température, quantité d'amylase, temps, pipettes…).")}</label><textarea class="inp" id="apres" style="min-height:5rem" placeholder="${esc("Nos résultats sont … ; la différence pourrait venir de …")}">${esc(S.apres || "")}</textarea><p class="cap">${nb("Votre réponse est ajoutée à la fin du fichier .txt du compte rendu (onglet Compte rendu).")}</p></div></section>`;
  let p = 0; const fig = liveSVG($("#simfig", m), (W, F) => drawScene(W, F, simScene(p)));
  animCtl($(".animctl", m), 16000, x => { p = x; fig.draw(); });
  $("#apres", m).addEventListener("input", e => { S.apres = e.target.value; save(); });
}

/* ---------- démarrage ---------- */
Display.init(S, save);
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && h !== S.view && visible().includes(h)) go(h); });
go(visible().includes(location.hash.slice(1)) ? location.hash.slice(1) : (S.view || "consignes"), true);
