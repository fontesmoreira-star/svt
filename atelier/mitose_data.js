/* ===== Activité 9 (3e) : contenus, d'après la fiche du professeur ===== */
const PROBLEM = "Comment une cellule transmet-elle ses chromosomes aux deux cellules qu'elle forme en se multipliant ?";
const DOC_ETAPES = { title: "Voici les étapes de la mitose", html: `<span class="stamp">À connaître !</span><div class="phases">${PHASES.map(p => `<div class="phase"><span class="pn"><i>${p.n}</i>${p.name}</span><span>${p.txt}</span></div>`).join("")}</div>` };
const DOC_ADN = { title: "Graphique · Évolution de la quantité d'ADN au cours d'une division cellulaire", sim: SIMUL + " (durées indicatives)", w: "adn" };
const NAMES = ["Interphase", "Prophase", "Métaphase", "Anaphase", "Télophase"];
const shot = (id, nom) => ({ t: "shot", c: "mod", ph: id, label: `<b>${nom}</b>` });
const gap = `<span class="gap">………</span>`;
const BILAN = [
  ["Avant la multiplication d'une cellule, chacun des 46 chromosomes ", "simples", " fait une copie de lui-même = c'est la ", "duplication", "."],
  ["Pendant la multiplication, les chromosomes maintenant ", "doubles", " se séparent en ", "2", " lots de chromosomes ", "simples", " et se répartissent dans les deux cellules-filles."],
  ["La cellule qui se divise transmet ainsi les 46 chromosomes ", "identiques", " aux siens."]];
const bilanHTML = () => BILAN.map(l => `<p>${l.map((x, i) => i % 2 ? `<u>${x}</u>` : x).join("")}</p>`).join("");
const bilanTXT = () => BILAN.map(l => l.join("")).join("\n");

const GROUPS = [
{ id: "p1", n: 1, icon: "🔬", tab: "Observer", title: "Observer une cellule qui se multiplie", sub: "Regarde l'animation, puis photographie les étapes de la mitose.",
  items: [
  { id: "a1", lvl: "easy", title: "Une cellule se multiplie",
    widget: { title: "Animation · Une cellule se multiplie", w: "cell", sim: "Modèle simplifié" },
    parts: [
      { t: "num", c: "mod", label: "Lance l'animation. Combien de cellules y a-t-il à la fin ?", unit: "cellules", ans: 2 },
      { t: "num", c: "mod", label: "Arrête l'animation quand les chromosomes sont bien visibles, au milieu de la cellule. Combien en comptes-tu ?", unit: "chromosomes", ans: 4, err: [[v => v === 8, "Regarde bien : chaque chromosome est alors formé de deux bâtonnets attachés. Compte les chromosomes, pas les bâtonnets."], [v => v === 2, "Il y a 2 couleurs, mais plusieurs chromosomes de chaque couleur."]] },
      { t: "choice", c: "mod", label: "À ce moment-là, à quoi ressemble chaque chromosome ?", o: ["À un seul bâtonnet", "À deux bâtonnets attachés, en forme de X", "À un long fil très fin"], a: 1 },
      { t: "num", c: "mod", label: "Avance encore : les bâtonnets se séparent et partent de chaque côté. Combien de bâtonnets arrivent de chaque côté ?", unit: "bâtonnets", ans: 4, err: [[v => v === 2, "Compte tous les bâtonnets d'un même côté, les verts et les jaunes."], [v => v === 8, "8, c'est le total des deux côtés. Compte d'un seul côté."]] }],
    hints: ["Utilise le curseur sous les boutons pour avancer ou reculer image par image.", "Les chromosomes sont le mieux visibles quand ils sont rangés les uns sous les autres, au milieu de la cellule.", "Au milieu : 4 chromosomes en forme de X. Ensuite : 4 bâtonnets de chaque côté (2 verts, 2 jaunes). À la fin : 2 cellules."],
    corr: "La cellule de départ donne 2 cellules-filles. Avant de se séparer, ses 4 chromosomes sont formés chacun de deux bâtonnets attachés (forme de X). Les bâtonnets se séparent : 4 partent de chaque côté. Chaque cellule-fille possède donc 4 chromosomes, comme la cellule de départ." },
  { id: "a2", lvl: "mid", title: "Photographe de la mitose", docs: [DOC_ETAPES],
    intro: "Dans ta fiche, tu devais coller des captures d'écran. Ici, tu photographies directement la cellule : place l'animation au bon moment, puis touche le bouton 📸 de l'étape que tu vois.",
    widget: { title: "Animation · Place la cellule au bon moment", w: "cell", sim: "Modèle simplifié" },
    parts: [shot("pro", "Prophase"), shot("meta", "Métaphase"), shot("ana", "Anaphase"), shot("telo", "Télophase")],
    hints: ["Lis la description de chaque étape dans le document, puis cherche l'image qui lui correspond avec le curseur.", "Prophase : chromosomes visibles mais en désordre. Métaphase : alignés au milieu. Anaphase : les bâtonnets s'écartent. Télophase : ils sont arrivés aux deux pôles.", "Tu peux refaire une photo autant de fois que tu veux : replace le curseur, puis touche de nouveau le bouton 📸."],
    corr: "Prophase : les chromosomes doubles deviennent visibles. Métaphase : ils sont alignés à l'équateur de la cellule. Anaphase : les deux chromatides de chaque chromosome se séparent et migrent vers les pôles. Télophase : les chromosomes simples sont aux deux pôles.",
    unlock: { title: "🔓 Animation débloquée · La mitose commentée", w: "cellNamed", sim: "Modèle simplifié" } }] },

{ id: "p2", n: 2, icon: "🧩", tab: "Les étapes", title: "Connaître les étapes de la mitose", sub: "Sans le document : remets en ordre, associe, puis nomme de mémoire.",
  items: [
  { id: "b1", lvl: "easy", title: "Remettre les images dans l'ordre",
    parts: [{ t: "order", c: "conn", label: "Touche les six images dans l'ordre, de la cellule de départ aux deux cellules-filles.", keys: ["inter", "pro", "meta", "ana", "telo", "fin"], alts: ["Chromosomes en fils fins dans le noyau", "Chromosomes en X, en désordre", "Chromosomes en X alignés au milieu", "Bâtonnets qui s'écartent vers les deux côtés", "Bâtonnets arrivés aux deux pôles", "Deux cellules, chacune avec un noyau"] }],
    hints: ["Commence par la cellule seule, dont le noyau contient des fils fins.", "Les chromosomes deviennent visibles, s'alignent au milieu, puis leurs bâtonnets se séparent.", "Fils fins → X en désordre → X alignés → bâtonnets qui s'écartent → bâtonnets aux pôles → deux cellules."],
    corr: "Interphase, prophase, métaphase, anaphase, télophase, puis séparation en deux cellules." },
  { id: "b2", lvl: "mid", title: "Associer chaque description à son étape",
    parts: [{ t: "rows", c: "conn", label: "Quel est le nom de l'étape décrite ?", choices: NAMES, rows: [
        { txt: "Les chromosomes doubles sont alignés à l'équateur de la cellule.", a: 2 },
        { txt: "Les chromatides de chacun des chromosomes se dupliquent : on passe de chromosomes simples à des chromosomes doubles.", a: 0 },
        { txt: "Les chromatides de chaque chromosome double se séparent et migrent chacune vers un pôle de la cellule.", a: 3 },
        { txt: "Les molécules d'A.D.N. se pelotonnent. Les chromosomes deviennent visibles.", a: 1 },
        { txt: "Les chromosomes à une chromatide sont aux pôles.", a: 4 }] },
      { t: "choice", c: "conn", label: "À quelle étape passe-t-on de chromosomes doubles à des chromosomes simples ?", o: NAMES, a: 3, no: { 0: "À l'interphase, c'est l'inverse : les chromosomes simples deviennent doubles.", 2: "À la métaphase, les chromosomes sont encore doubles : ils sont seulement alignés." } }],
    hints: ["Repense à tes quatre photos : que voyait-on sur chacune ?", "Alignés au milieu : métaphase. Les chromatides se séparent : anaphase.", "Duplication : interphase. Chromosomes visibles : prophase. Alignés : métaphase. Séparation : anaphase. Aux pôles : télophase."],
    corr: "Interphase : duplication (chromosomes simples → doubles). Prophase : les chromosomes deviennent visibles. Métaphase : alignés à l'équateur. Anaphase : les chromatides se séparent (chromosomes doubles → simples). Télophase : les chromosomes simples sont aux pôles." },
  { id: "b3", lvl: "hard", title: "Défi · Nommer les étapes de mémoire",
    parts: [["pro", ["prophase", "profase"]], ["meta", ["métaphase", "metafase"]], ["ana", ["anaphase", "anafase"]], ["telo", ["télophase", "telofase"]]].sort((x, y) => ({ ana: 0, pro: 1, telo: 2, meta: 3 }[x[0]] - { ana: 0, pro: 1, telo: 2, meta: 3 }[y[0]])).map(([k, ans]) => ({ t: "word", c: "conn", label: "Écris le nom de cette étape.", th: k, spell: true, ans, err: [[NAMES.filter(n => normTxt(n) !== normTxt(ans[0])), "C'est bien une étape de la division, mais pas celle de l'image. Regarde où sont les chromosomes."]] })),
    hints: ["Les quatre étapes à écrire : prophase, métaphase, anaphase, télophase.", "Méta = au milieu. Ana = les bâtonnets s'écartent. Télo = à la fin, aux pôles.", "Dans l'ordre des images : anaphase, prophase, télophase, métaphase."],
    corr: "Dans l'ordre des images : anaphase (les chromatides s'écartent), prophase (chromosomes visibles, en désordre), télophase (chromosomes simples aux pôles), métaphase (chromosomes alignés à l'équateur)." }] },

{ id: "p3", n: 3, icon: "📈", tab: "L'ADN", title: "Suivre la quantité d'ADN", sub: "Lis le graphique de ta fiche, puis relie-le aux étapes.",
  items: [
  { id: "c1", lvl: "easy", title: "Lire le graphique", docs: [DOC_ADN],
    parts: [
      { t: "rows", c: "lire", label: "Lance le tracé, puis touche le graphique. Quelle est la quantité d'ADN dans une cellule ?", choices: ["Q", "2Q"], rows: [{ txt: "À 4 heures", a: 0 }, { txt: "À 18 heures", a: 1 }, { txt: "À 26 heures, dans chaque cellule-fille", a: 0 }] },
      { t: "num", c: "lire", label: "À quelle heure la quantité d'ADN commence-t-elle à augmenter ?", unit: "h", ans: 8, tol: 1, err: [[v => v >= 13 && v <= 15, "À cette heure-là, la quantité d'ADN a fini d'augmenter. Cherche le moment où la courbe quitte la valeur Q."], [v => v >= 20, "À cette heure-là, la quantité d'ADN diminue. Cherche le moment où la courbe commence à monter."]] },
      { t: "num", c: "lire", label: "À quelle heure atteint-elle 2Q ?", unit: "h", ans: 14, tol: 1, err: [[v => v >= 7 && v <= 9, "À cette heure-là, la courbe commence seulement à monter. Cherche le moment où elle arrive à 2Q."], [v => v >= 20, "À cette heure-là, la cellule se divise. Cherche le premier moment où la courbe arrive à 2Q."]] }],
    hints: ["Touche le graphique à l'heure demandée : la valeur s'affiche juste en dessous.", "La courbe est plate à Q, puis elle monte, puis elle est plate à 2Q.", "Q à 4 h, 2Q à 18 h, Q à 26 h. La courbe monte de 8 h à 14 h."],
    corr: "La cellule contient d'abord une quantité Q d'ADN. De 8 h à 14 h, cette quantité double et atteint 2Q. Après la division, chaque cellule-fille contient de nouveau la quantité Q." },
  { id: "c2", lvl: "mid", title: "Relier le graphique aux étapes", docs: [DOC_ADN],
    parts: [
      { t: "choice", c: "rais", label: "La quantité d'ADN passe de Q à 2Q. Que se passe-t-il dans la cellule ?", o: ["Chaque chromosome fait une copie de lui-même : les chromosomes simples deviennent doubles", "La cellule fabrique 46 nouveaux chromosomes différents", "La cellule se coupe en deux"], a: 0 },
      { t: "choice", c: "rais", label: "Quand la quantité d'ADN vaut 2Q, les chromosomes de la cellule sont…", o: ["simples (une chromatide)", "doubles (deux chromatides)"], a: 1 },
      { t: "choice", c: "rais", label: "Pourquoi chaque cellule-fille ne contient-elle que la quantité Q ?", o: ["Parce que la moitié de l'ADN a été détruite", "Parce que les deux chromatides de chaque chromosome se sont séparées : chaque cellule-fille en a reçu une", "Parce que les cellules-filles sont plus petites"], a: 1 }],
    hints: ["Doubler une quantité d'ADN, c'est en faire une copie.", "Un chromosome double contient deux fois plus d'ADN qu'un chromosome simple.", "Q → 2Q : duplication. 2Q : chromosomes doubles. 2Q → Q : les chromatides se séparent et se répartissent dans les deux cellules-filles."],
    corr: "Quand la quantité d'ADN passe de Q à 2Q, chaque chromosome simple fait une copie de lui-même et devient double : c'est la duplication. Lors de la division, les deux chromatides de chaque chromosome se séparent : chaque cellule-fille reçoit la quantité Q.",
    unlock: { title: "🔓 Animation débloquée · La cellule et le graphique en même temps", w: "sync", sim: SIMUL + " (durées indicatives)" } }] },

{ id: "p4", n: 4, icon: "📝", tab: "Schéma bilan", title: "Construire le bilan", sub: "Complète le schéma bilan, puis le texte à recopier dans ton cahier.",
  items: [
  { id: "d1", lvl: "mid", title: "Compléter le schéma bilan", live: true,
    intro: "Le schéma se dessine d'après tes choix. La cellule de départ possède 4 chromosomes simples.",
    parts: [{ t: "rows", c: "rais", label: "Complète les quatre éléments du schéma.", choices: null, rows: [
        { txt: "Flèche 1 : que fait la cellule ?", o: ["Duplication : chaque chromosome se copie", "Séparation des chromatides", "Rien ne change"], a: 0 },
        { txt: "Cellule juste avant de se diviser : elle contient…", o: ["4 chromosomes simples", "4 chromosomes doubles", "8 chromosomes simples"], a: 1 },
        { txt: "Flèche 2 : que se passe-t-il ?", o: ["Duplication : chaque chromosome se copie", "Séparation des chromatides et partage entre deux cellules", "Les chromosomes disparaissent"], a: 1 },
        { txt: "Chaque cellule-fille contient…", o: ["2 chromosomes simples", "4 chromosomes simples", "4 chromosomes doubles"], a: 1 }] }],
    hints: ["Regarde le schéma se dessiner : les deux cellules-filles doivent ressembler à la cellule de départ.", "Avant de se diviser, la cellule copie chacun de ses chromosomes : ils deviennent doubles, mais leur nombre ne change pas.", "Flèche 1 : duplication. Milieu : 4 chromosomes doubles. Flèche 2 : séparation des chromatides. Cellules-filles : 4 chromosomes simples."],
    corr: "La cellule copie d'abord chacun de ses chromosomes (duplication) : elle possède alors 4 chromosomes doubles. Puis les chromatides se séparent et se répartissent dans deux cellules-filles, qui reçoivent chacune 4 chromosomes simples, identiques à ceux de la cellule de départ." },
  { id: "d2", lvl: "mid", title: "Compléter le bilan", recop: true,
    intro: "Écris le mot qui manque dans chaque phrase. Les accents et les petites fautes de frappe sont acceptés.",
    parts: [
      { t: "word", c: "conn", label: `Avant la multiplication d'une cellule, chacun des 46 chromosomes ${gap} fait une copie de lui-même…`, ans: ["simples", "simple", "à une chromatide"], err: [[["doubles", "double"], "Avant de se copier, un chromosome n'a qu'une seule chromatide."]] },
      { t: "word", c: "conn", label: `… = c'est la ${gap}.`, ans: ["duplication", "réplication", "copie"], err: [[["mitose", "multiplication", "division"], "Ce mot désigne la séparation en deux cellules. On cherche le nom de la copie des chromosomes."]] },
      { t: "word", c: "conn", label: `Pendant la multiplication, les chromosomes maintenant ${gap} se séparent…`, ans: ["doubles", "double", "à deux chromatides"], err: [[["simples", "simple"], "Ils viennent de se copier : chaque chromosome a maintenant deux chromatides."]] },
      { t: "num", c: "conn", label: `… en ${gap} lots de chromosomes…`, unit: "lots", ans: 2, err: [[v => true, "Dans combien de cellules-filles les chromosomes se répartissent-ils ?"]] },
      { t: "word", c: "conn", label: `… lots de chromosomes ${gap} et se répartissent dans les deux cellules-filles.`, ans: ["simples", "simple", "identiques", "identique"], err: [[["doubles", "double"], "Les chromatides viennent de se séparer : chaque chromosome n'en a plus qu'une."]] },
      { t: "word", c: "conn", label: `La cellule qui se divise transmet ainsi les 46 chromosomes ${gap} aux siens.`, ans: ["identiques", "identique", "semblables", "pareils"], err: [[["différents", "different"], "Chaque chromatide est la copie de l'autre : que peut-on dire des chromosomes transmis ?"], [["simples", "simple"], "Ils sont bien simples, mais on attend ici le mot qui les compare à ceux de la cellule de départ."]] }],
    hints: ["Un chromosome simple a une chromatide ; un chromosome double en a deux.", "La copie des chromosomes s'appelle la duplication. Les deux copies sont les mêmes.", "Dans l'ordre : simples · duplication · doubles · 2 · simples · identiques."],
    corr: "Le bilan complet s'affiche ci-dessous : recopie-le dans ton cahier." },
  { id: "d3", lvl: "hard", title: "Défi · Et dans le corps humain ?",
    intro: "Une cellule de peau humaine possède 46 chromosomes.",
    parts: [
      { t: "num", c: "rais", label: "Cette cellule se multiplie. Combien de chromosomes chaque cellule-fille possède-t-elle ?", unit: "chromosomes", ans: 46, err: [[v => v === 23, "Les chromosomes ne sont pas partagés en deux moitiés : chacun est d'abord copié, puis les deux copies se séparent."], [v => v === 92, "92, c'est le nombre de chromatides juste avant la division. Chaque cellule-fille en reçoit la moitié."]] },
      { t: "num", c: "rais", label: "Juste avant de se diviser, la cellule a 46 chromosomes doubles. Combien de chromatides cela fait-il ?", unit: "chromatides", ans: 92, err: [[v => v === 46, "Chaque chromosome double possède 2 chromatides."]] },
      { t: "num", c: "rais", label: "La cellule de départ se multiplie 3 fois de suite. Combien de cellules obtient-on ?", unit: "cellules", ans: 8, err: [[v => v === 6, "Le nombre de cellules double à chaque multiplication : 1 → 2 → 4 → …"], [v => v === 3, "À chaque multiplication, toutes les cellules se divisent en deux."]] }],
    hints: ["La multiplication cellulaire conserve le nombre de chromosomes.", "46 chromosomes doubles = 46 × 2 chromatides. Le nombre de cellules double à chaque multiplication.", "46 chromosomes · 92 chromatides · 1 → 2 → 4 → 8 cellules."],
    corr: "Chaque cellule-fille reçoit 46 chromosomes, identiques à ceux de la cellule de départ. Juste avant la division, les 46 chromosomes doubles représentent 92 chromatides. Après 3 multiplications : 1 → 2 → 4 → 8 cellules, toutes à 46 chromosomes." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Ce que je sais déjà",
  parts: [
    { t: "num", c: "conn", label: "Combien de chromosomes le noyau d'une cellule humaine contient-il ?", unit: "chromosomes", ans: 46, err: [[v => v === 23, "23, c'est le nombre de paires."]] },
    { t: "word", c: "conn", label: "De quelle molécule un chromosome est-il constitué ?", ans: ["ADN", "a d n", "acide désoxyribonucléique"] },
    { t: "choice", c: "conn", label: "Où se trouvent les chromosomes dans la cellule ?", o: ["Dans le noyau", "Dans le cytoplasme", "Dans la membrane"], a: 0 }],
  hints: ["Pense au caryotype humain étudié dans les activités précédentes.", "23 paires de chromosomes ; la molécule s'écrit en trois lettres.", "46 chromosomes · ADN · dans le noyau."],
  corr: "Le noyau d'une cellule humaine contient 46 chromosomes (23 paires). Chaque chromosome est constitué d'une molécule d'ADN." };
const RESUME = `Problème : ${PROBLEM}

Les étapes de la mitose (à connaître)
${PHASES.map(p => `${p.n}. ${p.name ? p.name + " : " : ""}${p.txt}`).join("\n")}

Bilan à recopier dans le cahier
${bilanTXT()}`;
typo(GROUPS); typo(RAPPEL); typo(DOC_ETAPES); BILAN.forEach((l, i) => { BILAN[i] = l.map(nb); });
