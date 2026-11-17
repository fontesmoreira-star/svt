/* ===== 5e EIST · Mission 5 · Signaux lumineux : le système Soleil-Terre-Lune · Activité 6, d'après la fiche du professeur ===== */
const PROBLEM = "Pourquoi la Lune change-t-elle d'apparence ?";
const gap = `<span class="gap">………</span>`;
const HOME = { slug: "phases-de-la-lune", short: "Les phases de la Lune", last: "c1", lastG: "p3", lastK: 0, dur: "environ 45 minutes",
  kicker: "Mission 5 · Signaux lumineux · Activité 6", title: "Pourquoi la Lune change-t-elle d'apparence ?",
  intro: "Avant le départ pour Mars, l'équipage apprend à lire le ciel. Chaque soir, la Lune n'a pas la même forme. À toi de comprendre pourquoi !",
  lab: "La question de la mission", goal: "Objectif : expliquer les phases de la Lune avec le Soleil, la Terre et la Lune.",
  fact: "La lumière renvoyée par la Lune met environ 1,3 seconde pour arriver jusqu'à ton œil.",
  parts: "Les trois parties de l'activité", recop: "Bilan à recopier dans le cahier",
  txt: "ACTIVITÉ 6 · POURQUOI LA LUNE CHANGE-T-ELLE D'APPARENCE ?\n5e EIST · Mission 5 · Signaux lumineux : le système Soleil-Terre-Lune",
  comps: { conn: "Mobiliser ses connaissances", lire: "Exploiter un schéma, une animation", mod: "Manipuler, modéliser", rais: "Raisonner, argumenter" },
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "Je choisis ou je complète, pas à pas." },
    l: { icon: "🚀", short: "Experte", name: "Version experte", q: "experte", desc: "Les mêmes manipulations, moins d'aide : j'écris mes réponses, j'explique avec mes mots et je calcule." } },
  extraTitle: "Mon tableau des phases",
  extra: () => { const [T, E] = tabAns(); return `MON TABLEAU DES PHASES\n${[0, 1, 2, 3].map(i => `- Semaine ${i + 1} · depuis la Terre : ${T[i] === undefined ? "—" : PH_TXT[T[i]]} · depuis l'espace : ${E[i] === undefined ? "—" : PH_TXT[E[i]]}`).join("\n")}\n` },
  extraHTML: () => { const [T, E] = tabAns(); return `<div class="tablewrap"><table class="t phtab"><thead><tr><th>N° semaine</th><th>Ce que voit un observateur depuis la Terre</th><th>Ce que voit un observateur depuis l'espace</th></tr></thead><tbody>${[0, 1, 2, 3].map(i => `<tr><td>${i + 1}</td><td>${phasePic(T[i], 44)}<span class="pdt">${T[i] === undefined ? "—" : PH_TXT[T[i]]}</span></td><td>${phasePic(E[i], 44)}<span class="pdt">${E[i] === undefined ? "—" : PH_TXT[E[i]]}</span></td></tr>`).join("")}</tbody></table></div>` } };
function tabAns() { const get = id => { const it = ITEMS[id].it, k = it.parts.findIndex(p => p.t === "phase"), st = IT()[id]; return k >= 0 && st && st.v[k] ? st.v[k] : {}; }; return [get("b1"), get("b2")]; }

const DOC_INTRO = { title: "Document 1 · Pour voir un objet", html: `<p><i>Nous savons que pour voir un objet, il faut que de la lumière provenant de cet objet arrive jusqu'à notre œil.</i></p><p><i>Seules les étoiles, comme le Soleil, émettent de la lumière (<b>source primaire</b>).</i></p><p><i>Les planètes et les satellites, comme la Lune, n'en émettent pas (<b>objet diffusant</b>).</i></p><p><i>Il faut donc que le ……… éclaire ……… et qu'un rayon lumineux parvienne jusqu'à ………</i></p>` };
const DOC_TXT = { title: "Document 2 · Les phases de la Lune", html: `<p>En observant la Lune tous les soirs, on remarque que son aspect change. Ces différents aspects sont appelés <b>phases de la Lune</b>. Les différentes phases de la Lune évoluent sur une période de 28 jours environ, appelée <b>lunaison</b>. Le Soleil éclaire toujours une moitié de la Lune, mais l'observateur terrestre voit totalement, partiellement ou pas du tout, cette partie éclairée.</p>` };
const DOC_SCH = { title: "Document 3 · La Lune autour de la Terre", w: "schema", sim: "Schéma simplifié" };
const WEEKS = n => [1, 2, 3, 4].map(w => ({ txt: "Semaine " + w, a: n[w - 1] }));

const BIL = ["Pour voir un objet, il faut que de la lumière provenant de cet objet arrive jusqu'à notre œil.",
  "Le Soleil est une <u>source primaire</u> de lumière. La Lune est un <u>objet diffusant</u> : elle n'émet pas de lumière, elle renvoie la lumière du Soleil.",
  "Le Soleil éclaire toujours <u>une moitié</u> de la Lune.",
  "La Lune tourne autour de la Terre en 28 jours environ : c'est la <u>lunaison</u>. Selon la position de la Lune, l'observateur terrestre voit totalement, partiellement ou pas du tout sa moitié éclairée : ce sont les <u>phases de la Lune</u>.",
  "Depuis l'espace, on voit toujours une moitié éclairée : l'apparence de la Lune dépend de la position de l'observateur (le <u>référentiel</u>)."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("") + `<p class="lab2">Je dessine les quatre phases (vues depuis l'hémisphère Nord) :</p><div class="phstrip">${[[0, "Nouvelle lune"], [1, "Premier quartier"], [3, "Pleine lune"], [2, "Dernier quartier"]].map(([s, n]) => `<figure>${phasePic(s, 58)}<figcaption>${n}</figcaption></figure>`).join("")}</div>`;

const GROUPS = [
{ id: "p1", n: 1, icon: "🔦", tab: "Voir la Lune", title: "Comment voit-on la Lune ?", sub: "Le labo de la lumière · environ 10 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "Le labo de la lumière",
    docs: [DOC_INTRO],
    widget: { title: "Labo virtuel · Le trajet de la lumière", w: "rayon", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Fais les trois essais : sans obstacle, avec l'écran, avec la main.", okMsg: "Trois essais réalisés.", done: () => { const n = ["free", "screen", "hand"].filter(k => (xst().ray || {})[k]).length; return { ok: n === 3, msg: `${n}/3 essais réalisés.` }; } },
      { t: "rows", c: "conn", label: "Complète la phrase du document 1.", choices: ["Soleil", "la Lune", "notre œil"], rows: [{ txt: "Il faut donc que le … (1)", a: 0 }, { txt: "… éclaire … (2)", a: 1 }, { txt: "… et qu'un rayon lumineux parvienne jusqu'à … (3)", a: 2 }] },
      { t: "rows", c: "conn", label: "Source primaire ou objet diffusant ?", choices: ["Source primaire", "Objet diffusant"], rows: [{ txt: "Le Soleil", a: 0 }, { txt: "La Lune", a: 1 }, { txt: "La planète Mars", a: 1 }, { txt: "L'étoile Polaire", a: 0 }] }],
    hints: ["Dans le labo, regarde d'où part la lumière, puis où elle va.", "Le document 1 le dit : seules les étoiles émettent de la lumière. Les planètes et les satellites n'en émettent pas.", "Soleil · la Lune · notre œil. Le Soleil et l'étoile Polaire sont des sources primaires ; la Lune et Mars sont des objets diffusants."],
    corr: "Il faut donc que le Soleil éclaire la Lune et qu'un rayon lumineux parvienne jusqu'à notre œil. Le Soleil et l'étoile Polaire sont des étoiles : ce sont des sources primaires. La Lune (un satellite) et Mars (une planète) n'émettent pas de lumière : ce sont des objets diffusants. Avec l'écran, la Lune n'est pas éclairée ; avec la main, la lumière de la Lune n'arrive pas à l'œil : dans les deux cas, on ne voit pas la Lune." }] },

{ id: "p2", n: 2, icon: "🌓", tab: "Les phases", title: "Pourquoi la Lune change-t-elle d'apparence ?", sub: "Simulateur et schéma · environ 25 minutes.",
  items: [
  { id: "b1", lvl: "mid", title: "Ce que voit un observateur depuis la Terre",
    intro: "Complète d'abord la colonne « observateur depuis la Terre ».",
    docs: [DOC_TXT],
    widget: { title: "Simulateur · La Lune autour de la Terre (remplace la vidéo)", w: "lunaison", sim: "Animation simplifiée" },
    parts: [
      { t: "task", c: "mod", label: "Observe la Lune à la fin des quatre semaines.", okMsg: "Les quatre semaines sont observées.", done: () => { const n = Object.keys(xst().wk || {}).length; return { ok: n >= 4, msg: `${n}/4 semaines observées.` }; } },
      { t: "phase", c: "lire", label: "Dessine ce que voit un observateur depuis la Terre.", rows: WEEKS([1, 3, 2, 0]) },
      { t: "rows", c: "lire", label: "Comment s'appelle chaque phase ?", choices: PHN, rows: [{ txt: "Semaine 1", a: 1 }, { txt: "Semaine 2", a: 2 }, { txt: "Semaine 3", a: 3 }, { txt: "Semaine 4", a: 0 }] }],
    hints: ["Touche « Semaine 1 », puis 2, 3 et 4 : regarde la Lune dans le ciel, à droite.", "Pour dessiner, touche la moitié éclairée. Si on ne voit rien d'éclairé, touche « Rien d'éclairé ».", "Semaine 1 : moitié droite (premier quartier). Semaine 2 : tout le disque (pleine lune). Semaine 3 : moitié gauche (dernier quartier). Semaine 4 : rien (nouvelle lune)."],
    corr: "Semaine 1 : premier quartier, la moitié droite est éclairée. Semaine 2 : pleine lune, tout le disque est éclairé. Semaine 3 : dernier quartier, la moitié gauche est éclairée. Semaine 4 : nouvelle lune, on ne voit aucune partie éclairée. (Observations depuis l'hémisphère Nord, comme au Luxembourg.)" },
  { id: "b2", lvl: "hard", title: "Ce que voit un observateur depuis l'espace",
    intro: "Puis réfléchis et complète la colonne « observateur depuis l'espace ». Rappel : référentiel !",
    docs: [DOC_SCH, { title: "Document 2 (extrait)", html: `<p>Le Soleil éclaire toujours une moitié de la Lune, mais l'observateur terrestre voit totalement, partiellement ou pas du tout, cette partie éclairée.</p>` }],
    pre: { label: "Ton avis d'abord : l'observateur placé dans l'espace voit-il, lui aussi, la Lune changer de forme ?", o: ["Oui, il voit les mêmes phases que depuis la Terre", "Non, il voit toujours la même chose", "Je ne sais pas"], a: 1, yes: "✓ Bonne intuition : ton dessin le confirme.", nope: "↻ Ton dessin t'a fait changer d'avis : c'est ainsi que l'on progresse." },
    parts: [
      { t: "phase", c: "mod", label: "Dessine ce que voit un observateur placé dans l'espace, là d'où tu regardes le schéma (le Soleil est à sa gauche).", rows: WEEKS([2, 2, 2, 2]) },
      { t: "choice", c: "rais", label: "Pourquoi cet observateur voit-il toujours la même chose ?", o: ["Le Soleil éclaire toujours la moitié de la Lune tournée vers lui, et l'observateur la regarde toujours depuis le même endroit", "La Lune produit sa propre lumière", "La Lune ne tourne pas autour de la Terre"], a: 0, no: { 1: "Relis le document 1 : la Lune est un objet diffusant.", 2: "Regarde le schéma : la Lune occupe quatre positions différentes." } },
      { t: "rows", c: "rais", label: "Vrai ou faux ?", choices: ["Vrai", "Faux"], rows: [{ txt: "Le Soleil éclaire toujours une moitié de la Lune.", a: 0 }, { txt: "Les phases de la Lune sont dues à l'ombre de la Terre.", a: 1 }, { txt: "L'apparence de la Lune dépend de l'endroit d'où on l'observe.", a: 0 }] }],
    hints: ["Sur le schéma, le Soleil éclaire tout depuis la gauche.", "Quelle que soit la position de la Lune, quelle moitié est tournée vers le Soleil ?", "Les quatre dessins sont identiques : la moitié gauche, tournée vers le Soleil, est éclairée. L'ombre de la Terre n'y est pour rien (c'est une éclipse, un phénomène rare)."],
    corr: "Depuis l'espace, à l'endroit d'où l'on regarde le schéma, on voit toujours la moitié gauche de la Lune éclairée : c'est la moitié tournée vers le Soleil. Les quatre dessins sont identiques. Depuis la Terre, on voit, selon la position de la Lune, une partie plus ou moins grande de cette moitié éclairée : l'apparence de la Lune dépend du référentiel. Les phases ne sont pas dues à l'ombre de la Terre.",
    unlock: { title: "🔓 Animation débloquée · Depuis l'espace et depuis la Terre", w: "espace", sim: "Modèle simplifié" } }] },

{ id: "p3", n: 3, icon: "🚀", tab: "Mission", title: "Prêt à lire le ciel ?", sub: "Une situation nouvelle, puis le bilan à recopier · environ 10 minutes.",
  items: [
  { id: "c1", lvl: "hard", title: "Le bilan de la mission", recop: true,
    docs: [DOC_SCH],
    parts: [
      { t: "rows", c: "rais", label: "Où se trouve la Lune ?", choices: ["Entre la Terre et le Soleil", "À l'opposé du Soleil", "Sur le côté"], rows: [{ txt: "À la pleine lune", a: 1 }, { txt: "À la nouvelle lune", a: 0 }, { txt: "Au premier quartier", a: 2 }] },
      { t: "choice", c: "rais", label: "Pleine lune. Depuis la Lune, un astronaute regarde la Terre. Que voit-il ?", o: ["Une Terre presque toute sombre", "Une Terre toute éclairée", "Une Terre à moitié éclairée"], a: 0, no: { 1: "C'est ce que voit l'observateur terrestre de la Lune. Mets-toi à la place de l'astronaute : la moitié de la Terre tournée vers lui est-elle éclairée par le Soleil ?", 2: "Regarde le schéma : à la pleine lune, la Lune est à l'opposé du Soleil." } },
      { t: "choice", c: "conn", label: "Pourquoi la Lune change-t-elle d'apparence ?", o: ["En tournant autour de la Terre, elle nous montre une partie plus ou moins grande de sa moitié éclairée par le Soleil", "L'ombre de la Terre la cache en partie", "Elle change de forme"], a: 0 }],
    hints: ["Repère la Semaine 2 (pleine lune) et la Semaine 4 (nouvelle lune) sur le schéma : où sont-elles par rapport au Soleil ?", "Pour l'astronaute, c'est la Terre qui est éclairée ou non par le Soleil. Quelle moitié de la Terre voit-il ?", "Pleine lune : à l'opposé du Soleil. Nouvelle lune : entre la Terre et le Soleil. L'astronaute voit la face de la Terre qui est dans la nuit."],
    corr: "À la pleine lune, la Lune est à l'opposé du Soleil ; à la nouvelle lune, elle est entre la Terre et le Soleil ; au premier quartier, elle est sur le côté. À la pleine lune, l'astronaute voit la moitié de la Terre qui est dans la nuit : une Terre presque toute sombre. La Lune change d'apparence car, en tournant autour de la Terre, elle nous montre une partie plus ou moins grande de sa moitié éclairée par le Soleil." }] }
];

const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Le Soleil est…", o: ["une source primaire de lumière", "un objet diffusant", "une planète"], a: 0 },
    { t: "choice", c: "conn", label: "La Lune tourne autour…", o: ["de la Terre", "de Mars", "d'elle-même seulement"], a: 0 }],
  hints: ["Le Soleil est une étoile : il produit sa propre lumière.", "La Lune est le satellite de la Terre.", "Source primaire · de la Terre."],
  corr: "Le Soleil est une étoile : c'est une source primaire de lumière. La Lune est le satellite naturel de la Terre : elle tourne autour de la Terre." };

/* ===== VERSION EXPERTE : mêmes manipulations, réponses écrites, explications rédigées, un calcul ===== */
const EXPERT = {
r0: { parts: [
    { t: "word", c: "conn", label: `Le Soleil produit sa propre lumière : c'est une source ${gap}.`, ans: ["primaire", "lumineuse"], err: [[["secondaire", "diffusante"], "Une source qui produit sa propre lumière est une source primaire."]] },
    { t: "word", c: "conn", label: `La Lune est le satellite naturel de la ${gap}.`, ans: ["Terre"] }],
  hints: ["Une étoile, comme le Soleil, produit sa propre lumière.", "La Lune tourne autour de notre planète.", "Primaire · Terre."] },
a1: { parts: [
    { t: "task", c: "mod", label: "Fais les trois essais : sans obstacle, avec l'écran, avec la main.", okMsg: "Trois essais réalisés.", done: () => { const n = ["free", "screen", "hand"].filter(k => (xst().ray || {})[k]).length; return { ok: n === 3, msg: `${n}/3 essais réalisés.` }; } },
    { t: "word", c: "conn", label: `Il faut donc que le ${gap} éclaire…`, ans: ["Soleil"], err: [[["Lune"], "La Lune n'émet pas de lumière : c'est elle qui est éclairée."]] },
    { t: "word", c: "conn", label: `… éclaire ${gap}…`, ans: ["la Lune", "Lune"], err: [[["Soleil"], "Le Soleil est la source : c'est lui qui éclaire."]] },
    { t: "word", c: "conn", label: `… et qu'un rayon lumineux parvienne jusqu'à ${gap}.`, ans: ["notre œil", "œil", "oeil", "nos yeux", "yeux", "l'œil de l'observateur", "observateur", "l'observateur"] },
    { t: "redac", c: "rais", min: 15, label: "Un membre de l'équipage affirme : « La Lune brille parce qu'elle produit sa propre lumière, comme le Soleil. » Explique-lui son erreur.",
      crit: [{ g: "sais", lab: "Tu dis que la Lune ne produit pas de lumière", re: [/pas (sa propre|de|sa) lumiere|n'(emet|produit)|ne (produit|emet|fabrique)|aucune lumiere|pas une source|n'est pas (une )?source|ne brille pas/] },
        { g: "sais", lab: "Tu emploies le vocabulaire : objet diffusant", re: [/diffus/] },
        { g: "deduis", lab: "Tu expliques d'où vient la lumière de la Lune", re: [/soleil/, /eclair|lumiere|renvoi|reflet|reflech|diffus/] },
        { g: "deduis", lab: "Tu expliques que cette lumière arrive jusqu'à nous", re: [/oeil|yeux|observateur|jusqu'a nous|vers nous|jusqu'a la terre|vers la terre|on la voit|nous la voyons/] }],
      model: "Tu te trompes : la Lune ne produit pas sa propre lumière, ce n'est pas une source primaire. C'est un objet diffusant : elle est éclairée par le Soleil et renvoie une partie de cette lumière, qui arrive jusqu'à notre œil." }],
  hints: ["Dans le labo, regarde d'où part la lumière, puis où elle va.", "Pour répondre à l'astronaute : la Lune est-elle une source primaire ou un objet diffusant ? D'où vient sa lumière ? Où va-t-elle ?", "Soleil · la Lune · notre œil. La Lune n'émet pas de lumière : c'est un objet diffusant, éclairé par le Soleil ; elle renvoie cette lumière jusqu'à notre œil."] },
b1: { parts: [
    { t: "task", c: "mod", label: "Observe la Lune à la fin des quatre semaines.", okMsg: "Les quatre semaines sont observées.", done: () => { const n = Object.keys(xst().wk || {}).length; return { ok: n >= 4, msg: `${n}/4 semaines observées.` }; } },
    { t: "phase", c: "lire", label: "Dessine ce que voit un observateur depuis la Terre.", rows: WEEKS([1, 3, 2, 0]) },
    { t: "num", c: "rais", tol: 1, label: "Calcul : d'après le document 2, combien de jours séparent la nouvelle lune de la pleine lune ?", unit: "jours", ans: 14.5, err: [[v => v === 28, "28 jours, c'est une lunaison entière : de nouvelle lune à nouvelle lune."], [v => v === 7, "7 jours, c'est seulement jusqu'au premier quartier."]] },
    { t: "word", c: "lire", label: `Entre la nouvelle lune et la pleine lune, la partie éclairée que l'on voit ${gap}.`, ans: ["grandit", "augmente", "s'agrandit", "croît", "grossit", "s'élargit"], err: [[["diminue", "rétrécit", "décroît"], "Regarde le ciel du simulateur entre la semaine 4 et la semaine 2."]] }],
  hints: ["Touche « Semaine 1 », puis 2, 3 et 4 : regarde la Lune dans le ciel, à droite.", "La pleine lune est à mi-chemin de la lunaison : divise la durée de la lunaison par 2.", "Semaine 1 : moitié droite. Semaine 2 : tout. Semaine 3 : moitié gauche. Semaine 4 : rien. 28 ÷ 2 = 14 jours ; la partie éclairée visible grandit."],
  corr: "Semaine 1 : premier quartier, la moitié droite est éclairée. Semaine 2 : pleine lune, tout le disque est éclairé. Semaine 3 : dernier quartier, la moitié gauche est éclairée. Semaine 4 : nouvelle lune, on ne voit aucune partie éclairée. La pleine lune arrive à mi-lunaison : 28 ÷ 2 = 14 jours environ après la nouvelle lune ; entre les deux, la partie éclairée visible grandit." },
b2: { parts: [
    { t: "phase", c: "mod", label: "Dessine ce que voit un observateur placé dans l'espace, là d'où tu regardes le schéma (le Soleil est à sa gauche).", rows: WEEKS([2, 2, 2, 2]) },
    { t: "redac", c: "rais", min: 25, label: "Explique pourquoi la Lune change d'apparence pour l'observateur terrestre, alors qu'elle a toujours la même apparence pour l'observateur dans l'espace.",
      crit: [{ g: "sais", lab: "Le Soleil éclaire toujours une moitié de la Lune", re: [/moitie/, /eclair/] },
        { g: "vois", lab: "Depuis l'espace, on voit toujours la même chose", re: [/espace/, /toujours|meme|pareil|change pas|identique/] },
        { g: "vois", lab: "Depuis la Terre, on voit une partie plus ou moins grande de la moitié éclairée", re: [/terre/, /partie|partiellement|totalement|plus ou moins|pas du tout|morceau|portion|en entier|\btout (le disque|le cercle|la moitie|eclaire)|\brien\b/] },
        { g: "deduis", lab: "Tu relies au mouvement de la Lune ou au référentiel", re: [/referentiel|point de vue|position|tourne|autour|orbite|deplace|bouge/] }],
      model: "Je sais que le Soleil éclaire toujours une moitié de la Lune. Depuis l'espace, l'observateur regarde toujours depuis le même endroit : il voit toujours la moitié tournée vers le Soleil, la Lune a toujours la même apparence. Depuis la Terre, la Lune tourne autour de nous : selon sa position, on voit totalement, partiellement ou pas du tout sa moitié éclairée. J'en déduis que l'apparence de la Lune dépend du référentiel." }],
  hints: ["Sur le schéma, le Soleil éclaire tout depuis la gauche : quelle moitié de la Lune est éclairée à chaque position ?", "Rédige en trois temps : je sais (ce qu'éclaire le Soleil) → je vois (depuis l'espace, depuis la Terre) → j'en déduis (le référentiel).", "Les quatre dessins sont identiques (moitié gauche). Le Soleil éclaire toujours une moitié ; depuis la Terre, on en voit une partie plus ou moins grande selon la position de la Lune."] },
c1: { parts: [
    { t: "redac", c: "rais", min: 30, label: "Réponds à la question de la mission : pourquoi la Lune change-t-elle d'apparence ? Emploie le vocabulaire de l'activité.",
      crit: [{ g: "sais", lab: "La Lune est éclairée par le Soleil", re: [/soleil/, /eclair|diffus|lumiere|renvoi/] },
        { g: "sais", lab: "Une moitié de la Lune est toujours éclairée", re: [/moitie/] },
        { g: "vois", lab: "La Lune tourne autour de la Terre", re: [/tourne|orbite|autour|revolution|deplace/] },
        { g: "deduis", lab: "On voit une partie plus ou moins grande de la moitié éclairée", re: [/partie|partiellement|totalement|plus ou moins|pas du tout|portion|\btout (le disque|le cercle|la moitie|eclaire)|\brien\b/] },
        { g: "sais", lab: "Tu emploies le vocabulaire : phases, lunaison", re: [/phase|lunaison/] }],
      model: "La Lune est un objet diffusant : le Soleil éclaire toujours une moitié de la Lune. En 28 jours environ (une lunaison), la Lune tourne autour de la Terre. Selon sa position, l'observateur terrestre voit totalement, partiellement ou pas du tout cette moitié éclairée : ce sont les phases de la Lune." },
    { t: "word", c: "rais", label: `Pleine lune. Depuis la Lune, un astronaute regarde la Terre. La Terre lui paraît ${gap}.`, ans: ["sombre", "noire", "non éclairée", "pas éclairée", "obscure", "nouvelle terre", "dans la nuit", "invisible", "pas visible"], err: [[["éclairée", "pleine", "toute éclairée", "ronde", "lumineuse"], "C'est ce que voit l'observateur terrestre de la Lune. Mets-toi à la place de l'astronaute : la moitié de la Terre tournée vers lui est-elle éclairée par le Soleil ?"]] }],
  hints: ["Reprends tes réponses des parties 1 et 2 : qui éclaire la Lune ? Quelle partie ? Que fait la Lune autour de la Terre ?", "Pour l'astronaute, c'est la Terre qui est éclairée ou non par le Soleil. À la pleine lune, la Lune est à l'opposé du Soleil.", "Le Soleil éclaire une moitié de la Lune ; en tournant autour de la Terre (lunaison), elle nous en montre une partie plus ou moins grande : ce sont les phases. L'astronaute voit la face de la Terre qui est dans la nuit : sombre."],
  corr: "Le Soleil éclaire toujours une moitié de la Lune, un objet diffusant. En tournant autour de la Terre (lunaison de 28 jours environ), la Lune nous montre une partie plus ou moins grande de cette moitié éclairée : ce sont les phases de la Lune. À la pleine lune, la Lune est à l'opposé du Soleil : l'astronaute voit la face de la Terre qui est dans la nuit, une Terre presque toute sombre." }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `La question de la mission : ${PROBLEM}\n${HOME.goal}\n\nBilan à recopier\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}\n- Les quatre phases (hémisphère Nord) : nouvelle lune (rien d'éclairé), premier quartier (moitié droite), pleine lune (tout le disque), dernier quartier (moitié gauche).`;
typo(GROUPS); typo(RAPPEL);
