/* ===== Activité 10 (3e) : contenus, d'après la fiche du professeur ===== */
const PROBLEM = "Comment une cellule à 46 chromosomes peut-elle donner des cellules reproductrices, et que contiennent ces cellules ?";
const gap = `<span class="gap">………</span>`;
const GRIDC = ["A/B", "A/O", "B/O", "O/O", "A/A", "B/B"];
const myGrid = () => { const v = ((S.it.d2 || {}).v || {})[0] || {}; return [0, 1, 2, 3].map(i => v[i] === undefined ? "—" : GRIDC[v[i]]); };
const HOME = { slug: "meiose-cellules-reproductrices", short: "Activité 10 · La méiose", last: "d3", lastG: "p4", lastK: 2,
  kicker: "3e SVT · Génétique · Activité 10", title: "Reconstituer les étapes de la méiose, à l'origine des cellules reproductrices",
  intro: "Chez l'être humain, une cellule de la peau contient 46 chromosomes, rangés en 23 paires. Les cellules reproductrices (spermatozoïdes et ovules) se forment par une division particulière : la méiose.",
  lab: "Problème", goal: "Objectif : reconstituer les étapes de la méiose, puis compléter le schéma, le tableau de croisement et le bilan de ta fiche.",
  fact: "La méiose n'a lieu que dans les organes reproducteurs : les testicules et les ovaires.",
  parts: "Les quatre parties de l'activité (environ une heure)", recop: "Bilan à recopier dans ton cahier",
  txt: "ACTIVITÉ 10 · RECONSTITUER LES ÉTAPES DE LA MÉIOSE À L'ORIGINE DES CELLULES REPRODUCTRICES\n3e SVT · Génétique",
  comps: { conn: "Mobiliser ses connaissances", mod: "Observer une animation, manipuler", repr: "Compléter un schéma, un tableau", rais: "Raisonner, argumenter" },
  extraTitle: "Mon tableau de croisement",
  extraHTML: () => { const g = myGrid(), r = lot().runs[2] || 0; return tbl(["♀ \\ ♂", "Spermatozoïde B", "Spermatozoïde O"], [["Ovule A", g[0], g[1]], ["Ovule O", g[2], g[3]]]) + `<p class="lead">Loterie de la méiose : ${r} méiose${r > 1 ? "s" : ""} réalisée${r > 1 ? "s" : ""} avec 2 paires.</p>`; },
  extra: () => { const g = myGrid(); return `MON TABLEAU DE CROISEMENT (génotypes des cellules-œufs)\n- Ovule A × spermatozoïde B : ${g[0]}\n- Ovule A × spermatozoïde O : ${g[1]}\n- Ovule O × spermatozoïde B : ${g[2]}\n- Ovule O × spermatozoïde O : ${g[3]}\n`; } };

const BIL = ["Chaque cellule reproductrice contient <u>23</u> chromosomes.",
  "Lors de la formation des cellules reproductrices, les chromosomes d'une paire, parfois génétiquement <u>différents</u> par leurs allèles, se répartissent <u>aléatoirement</u> (au hasard).",
  "Les cellules reproductrices produites par un individu sont donc génétiquement <u>différentes</u>. La méiose crée de la diversité génétique au sein d'une espèce, au contraire de la mitose."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("") + `<p class="lab">Schéma à recopier</p><div data-w="schemaFinal"></div>`;
const shot = (id, nom) => ({ t: "shot", c: "mod", ph: id, label: nom });
const DRAW_ROWS = [{ txt: "Cellule de départ", a: 0 }, { txt: "Après l'interphase", a: 1 }, { txt: "Après la méiose I (chacune des 2 cellules)", a: 3 }, { txt: "Après la méiose II (chacune des 4 cellules)", a: 2 }];

const GROUPS = [
{ id: "p1", n: 1, icon: "🔬", tab: "Observer", title: "Observer une méiose", sub: "Une cellule donne quatre cellules : regarde, compte, photographie.",
  items: [
  { id: "a1", lvl: "easy", title: "Une cellule devient quatre",
    pre: { label: "Ton hypothèse : par méiose, combien de cellules une cellule va-t-elle donner ?", o: ["2 cellules", "4 cellules", "23 cellules", "46 cellules"], a: 1 },
    widget: { title: "Animation · Une cellule se divise par méiose", w: "meio", sim: "Modèle simplifié" },
    parts: [
      { t: "num", c: "mod", label: "Lance l'animation. Combien de cellules obtient-on à la fin ?", unit: "cellules", ans: 4, err: [[v => v === 2, "Regarde jusqu'au bout : la cellule se divise deux fois de suite."]] },
      { t: "num", c: "mod", label: "Arrête l'animation quand les chromosomes sont rangés deux par deux au milieu de la cellule. Combien de paires vois-tu ?", unit: "paires", ans: 2, err: [[v => v === 4, "4, c'est le nombre de chromosomes. Une paire, c'est deux chromosomes de même taille."]] },
      { t: "num", c: "mod", label: "À la fin, combien de chromosomes chaque cellule contient-elle ?", unit: "chromosomes", ans: 2, err: [[v => v === 4, "4, c'est le nombre de chromosomes de la cellule de départ. Compte dans une seule des 4 cellules."], [v => v === 8, "Compte les chromosomes d'une seule cellule."]] },
      { t: "choice", c: "rais", label: "Dans chaque cellule obtenue, on trouve…", o: ["un chromosome de chaque paire : un long et un court", "les deux chromosomes de la paire longue", "les quatre chromosomes de la cellule de départ"], a: 0 }],
    hints: ["Utilise le curseur sous les boutons pour avancer ou reculer image par image.", "Au milieu de l'animation, les chromosomes sont côte à côte, deux par deux : ce sont les paires. À la fin, compte les chromosomes d'une seule cellule.", "4 cellules · 2 paires · 2 chromosomes par cellule, un long et un court."],
    corr: "La cellule de départ (2 paires, soit 4 chromosomes) se divise deux fois de suite : elle donne 4 cellules. Chaque cellule obtenue ne contient que 2 chromosomes : un chromosome de chaque paire. Le nombre de chromosomes a été divisé par deux." },
  { id: "a2", lvl: "mid", title: "Photographe de la méiose",
    intro: "Ta fiche te demandait d'utiliser le Genially. Ici, tu photographies directement la cellule : place l'animation au bon moment, puis touche le bouton 📸 sous la description de l'étape.",
    widget: { title: "Animation · Place la cellule au bon moment", w: "meio", sim: "Modèle simplifié" },
    parts: [shot("paires", "<b>Méiose I</b> · les chromosomes doubles sont rangés par paires au milieu"), shot("sep1", "<b>Méiose I</b> · les deux chromosomes de chaque paire se séparent"), shot("deux", "<b>Fin de la méiose I</b> · deux cellules, aux chromosomes encore doubles"), shot("sep2", "<b>Méiose II</b> · les deux chromatides de chaque chromosome se séparent")],
    hints: ["Lis chaque description, puis cherche l'image qui lui correspond avec le curseur.", "Méiose I : ce sont des chromosomes entiers, en forme de X, qui se séparent. Méiose II : ce sont les chromatides, des bâtonnets simples.", "Tu peux refaire une photo autant de fois que tu veux : replace le curseur, puis touche de nouveau 📸."],
    corr: "Méiose I : les chromosomes doubles se rangent par paires au milieu de la cellule, puis les deux chromosomes de chaque paire se séparent ; on obtient 2 cellules aux chromosomes encore doubles. Méiose II : dans chaque cellule, les deux chromatides de chaque chromosome se séparent ; on obtient 4 cellules aux chromosomes simples.",
    unlock: { title: "🔓 Animation débloquée · La méiose commentée", w: "meioNamed", sim: "Modèle simplifié" } },
  { id: "a3", lvl: "hard", title: "Défi · Reconstituer les étapes",
    parts: [{ t: "order", c: "conn", label: "Touche les six images dans l'ordre, de la cellule de départ aux quatre cellules reproductrices.", keys: ["d0", "d1", "d2", "d3", "d4", "d5"], alts: ["Une cellule, chromosomes en fils fins dans le noyau", "Chromosomes en X rangés par paires au milieu", "Les chromosomes de chaque paire s'écartent", "Deux cellules, chromosomes en X alignés", "Les chromatides s'écartent dans les deux cellules", "Quatre cellules à chromosomes simples"] }],
    hints: ["Commence par la cellule seule, dont le noyau contient des fils fins.", "Méiose I : les paires se rangent, puis se séparent, et l'on obtient 2 cellules. Méiose II : les chromatides se séparent, et l'on obtient 4 cellules.", "Fils fins → paires au milieu → paires qui s'écartent → 2 cellules → chromatides qui s'écartent → 4 cellules."],
    corr: "Interphase (duplication), puis méiose I (les paires se rangent au milieu, puis se séparent : 2 cellules), puis méiose II (les chromatides se séparent : 4 cellules)." }] },

{ id: "p2", n: 2, icon: "🧩", tab: "Schéma", title: "Le schéma bilan : de 1 cellule à 4 cellules", sub: "Complète le schéma de ta fiche : il se dessine d'après tes choix.",
  items: [
  { id: "b1", lvl: "mid", title: "Compléter le schéma de la fiche", live: "schema", liveTitle: "Schéma montrant comment 1 cellule à 46 chromosomes donne 4 cellules à 23 chromosomes",
    intro: "Le schéma se complète avec tes réponses. Dans les cercles, on ne dessine que 2 paires de chromosomes au lieu de 23 : bleu = venu du père, rouge rayé = venu de la mère.",
    parts: [
      { t: "rows", c: "conn", label: "Complète les mots qui manquent sur le schéma.", choices: null, rows: [
        { txt: "Interphase ou ………", o: SCH_W[0], a: 0 }, { txt: "46 chromosomes ……… (1 cellule)", o: SCH_W[1], a: 1 }, { txt: "23 chromosomes ……… (2 cellules)", o: SCH_W[2], a: 1 },
        { txt: "46 chromosomes (1 cellule, ………)", o: SCH_W[3], a: 0 }, { txt: "23 chromosomes (4 cellules, ………)", o: SCH_W[4], a: 1 }] },
      { t: "rows", c: "repr", label: "Que faut-il dessiner dans les cercles ?", choices: SCH_D, rows: DRAW_ROWS }],
    hints: ["Interphase : chaque chromosome fait une copie de lui-même (activité 9). Un chromosome copié est double.", "Diploïde : les chromosomes vont par paires. Haploïde : un seul chromosome de chaque paire. La méiose I sépare les paires ; la méiose II sépare les chromatides.", "Duplication · doubles · doubles · diploïde · haploïdes. Dessins : 2 paires simples → 2 paires doubles → 1 double de chaque paire → 1 simple de chaque paire."],
    corr: "La cellule de départ est diploïde : 46 chromosomes simples, rangés par paires. Pendant l'interphase, chaque chromosome se copie (duplication) : 46 chromosomes doubles. La méiose I sépare les deux chromosomes de chaque paire : 2 cellules à 23 chromosomes doubles. La méiose II sépare les chromatides : 4 cellules haploïdes à 23 chromosomes simples, un de chaque paire." },
  { id: "b2", lvl: "hard", title: "Défi · Compter les chromosomes",
    parts: [
      { t: "num", c: "rais", label: "Juste avant la méiose, la cellule possède 46 chromosomes doubles. Combien de chromatides cela fait-il ?", unit: "chromatides", ans: 92, err: [[v => v === 46, "Chaque chromosome double possède 2 chromatides."]] },
      { t: "num", c: "rais", label: "Combien de chromosomes un spermatozoïde ou un ovule humain contient-il ?", unit: "chromosomes", ans: 23, err: [[v => v === 46, "46, c'est le nombre de la cellule de départ : la méiose le divise par deux."]] },
      { t: "num", c: "rais", label: "À la fécondation, un spermatozoïde s'unit à un ovule. Combien de chromosomes la cellule-œuf contient-elle ?", unit: "chromosomes", ans: 46, err: [[v => v === 23, "23, c'est un seul gamète. La cellule-œuf reçoit les chromosomes des deux."], [v => v === 92, "Chaque gamète n'apporte que 23 chromosomes."]] },
      { t: "choice", c: "rais", label: "Que se passerait-il si les cellules reproductrices contenaient 46 chromosomes ?", o: ["La cellule-œuf aurait 92 chromosomes : le nombre doublerait à chaque génération", "Rien ne changerait", "La cellule-œuf aurait 23 chromosomes"], a: 0 }],
    hints: ["Un chromosome double = 2 chromatides.", "La méiose divise par deux le nombre de chromosomes ; la fécondation réunit ceux de deux cellules reproductrices.", "92 chromatides · 23 chromosomes · 23 + 23 = 46 chromosomes."],
    corr: "Juste avant la méiose, 46 chromosomes doubles représentent 92 chromatides. Chaque cellule reproductrice ne contient que 23 chromosomes ; à la fécondation, 23 + 23 = 46 : la cellule-œuf retrouve le nombre de chromosomes de l'espèce. Sans la méiose, ce nombre doublerait à chaque génération." }] },

{ id: "p3", n: 3, icon: "🎲", tab: "Hasard", title: "Des cellules reproductrices différentes", sub: "La loterie de la méiose : comment se répartissent les chromosomes de chaque paire ?",
  items: [
  { id: "c1", lvl: "mid", title: "La loterie de la méiose",
    widget: { title: "Simulation · La loterie de la méiose", w: "loterie", sim: "Tirage au hasard simulé" },
    parts: [
      { t: "task", c: "mod", label: "Réalise au moins 5 méioses avec 2 paires de chromosomes.", okMsg: "5 méioses réalisées.", done: () => { const r = lot().runs[2] || 0; return { ok: r >= 5, msg: `${Math.min(r, 5)}/5 méioses réalisées avec 2 paires.` }; } },
      { t: "num", c: "mod", label: "Avec 2 paires, combien de sortes de cellules reproductrices différentes peut-on obtenir ?", unit: "sortes", ans: 4, err: [[v => v === 2, "Lance d'autres méioses : la répartition change d'une méiose à l'autre."], [v => v === 8, "8, c'est avec 3 paires. Choisis « 2 paires »."]] },
      { t: "choice", c: "rais", label: "Comment les chromosomes de chaque paire se répartissent-ils dans les cellules reproductrices ?", o: ["Au hasard : chaque cellule reçoit un chromosome de chaque paire, venu soit du père, soit de la mère", "Toujours de la même façon : les chromosomes venus du père restent ensemble", "Chaque cellule reçoit les deux chromosomes de chaque paire"], a: 0, no: { 1: "Regarde ta collection : on obtient aussi des cellules qui mélangent un chromosome du père et un chromosome de la mère." } },
      { t: "choice", c: "rais", label: "Chez l'être humain (23 paires), combien de sortes de cellules reproductrices un individu peut-il fabriquer ?", o: ["23", "46", "Plus de 8 millions"], a: 2 }],
    hints: ["Touche « 🎲 Faire une méiose » plusieurs fois et regarde ta collection se remplir.", "Avec 1 paire : 2 sortes. À chaque paire ajoutée, le nombre de sortes double.", "2 paires : 2 × 2 = 4 sortes. 23 paires : utilise le calculateur sous la collection."],
    corr: "Lors de la méiose, les chromosomes de chaque paire se répartissent au hasard : chaque cellule reproductrice reçoit un chromosome de chaque paire, venu soit du père, soit de la mère. Avec 2 paires, on obtient 2 × 2 = 4 sortes de cellules ; avec les 23 paires humaines, 2²³, soit plus de 8 millions de sortes. Les cellules reproductrices d'un individu sont donc génétiquement différentes." }] },

{ id: "p4", n: 4, icon: "👪", tab: "Croisement", title: "Le tableau de croisement, puis le bilan", sub: "Super-Méiose et Super-Mitose : quels enfants peuvent-ils avoir ?",
  items: [
  { id: "d1", lvl: "easy", title: "Les gamètes de Super-Méiose et de Super-Mitose",
    intro: "Super-Méiose est du groupe sanguin A : son génotype est A/O. Super-Mitose est du groupe B : son génotype est B/O. Le gène du groupe sanguin est porté par une paire de chromosomes : ici, la paire longue.",
    widget: { title: "Animation · La méiose chez Super-Méiose et chez Super-Mitose", w: "gam", sim: "Modèle simplifié" },
    parts: [
      { t: "multi", c: "mod", label: "Quels ovules Super-Méiose (A/O) peut-elle produire ? (plusieurs réponses)", o: ["Des ovules portant l'allèle A", "Des ovules portant l'allèle O", "Des ovules portant les allèles A et O", "Des ovules portant l'allèle B"], a: [0, 1] },
      { t: "multi", c: "mod", label: "Quels spermatozoïdes Super-Mitose (B/O) peut-il produire ? (plusieurs réponses)", o: ["Des spermatozoïdes portant l'allèle B", "Des spermatozoïdes portant l'allèle O", "Des spermatozoïdes portant les allèles B et O", "Des spermatozoïdes portant l'allèle A"], a: [0, 1] },
      { t: "choice", c: "rais", label: "Pourquoi une cellule reproductrice ne porte-t-elle qu'un seul allèle du gène du groupe sanguin ?", o: ["Parce qu'elle ne reçoit qu'un chromosome de chaque paire", "Parce que l'allèle O est détruit", "Parce que la méiose fabrique de nouveaux allèles"], a: 0 }],
    hints: ["Lance l'animation pour Super-Méiose, puis pour Super-Mitose, et lis les lettres dans les 4 cellules finales.", "Chaque cellule reproductrice reçoit un seul chromosome de la paire longue : celui qui porte A, ou celui qui porte O.", "Super-Méiose : ovules A ou O. Super-Mitose : spermatozoïdes B ou O."],
    corr: "La méiose sépare les deux chromosomes de chaque paire : chaque cellule reproductrice n'en reçoit qu'un. Super-Méiose (A/O) produit des ovules portant A et des ovules portant O ; Super-Mitose (B/O) produit des spermatozoïdes portant B et des spermatozoïdes portant O." },
  { id: "d2", lvl: "mid", title: "Compléter le tableau de croisement",
    intro: "En ligne : les ovules de Super-Méiose. En colonne : les spermatozoïdes de Super-Mitose. Chaque case est une cellule-œuf : elle reçoit l'allèle de l'ovule et celui du spermatozoïde.",
    parts: [
      { t: "grid", c: "repr", label: "Complète chaque case avec le génotype de la cellule-œuf.", corner: "♀ \\ ♂", rows: [["ovule", "A"], ["ovule", "O"]], cols: [["sperma\u00ADtozoïde", "B"], ["sperma\u00ADtozoïde", "O"]], chips: GRIDC, ans: [0, 1, 2, 3], ask: "Choisis le génotype de la case" },
      { t: "num", c: "rais", label: "Combien de génotypes différents les enfants de ce couple peuvent-ils avoir ?", unit: "génotypes", ans: 4, err: [[v => v === 2, "Compte les génotypes différents dans les 4 cases du tableau."]] },
      { t: "choice", c: "rais", label: "Que montre ce tableau ?", o: ["Un même couple peut avoir des enfants génétiquement différents : la méiose et la fécondation créent de la diversité", "Tous les enfants d'un couple ont le même génotype", "Les enfants ont toujours le génotype de leur père"], a: 0 }],
    hints: ["Une case = l'allèle de l'ovule + l'allèle du spermatozoïde. L'ordre des deux allèles n'a pas d'importance : O/B s'écrit aussi B/O.", "Ovule A et spermatozoïde B : la cellule-œuf est A/B.", "A/B · A/O · B/O · O/O : 4 génotypes différents."],
    corr: "Ovule A et spermatozoïde B : A/B. Ovule A et spermatozoïde O : A/O. Ovule O et spermatozoïde B : B/O. Ovule O et spermatozoïde O : O/O. Ce couple peut avoir des enfants de 4 génotypes différents : la méiose, puis la rencontre au hasard des cellules reproductrices lors de la fécondation, créent de la diversité génétique.",
    unlock: { title: "🔓 Animation débloquée · La fécondation", w: "fecond", sim: "Modèle simplifié" } },
  { id: "d3", lvl: "mid", title: "Compléter le bilan", recop: true,
    intro: "Écris le mot qui manque dans chaque phrase de ta fiche. Les accents et les petites fautes de frappe sont acceptés.",
    parts: [
      { t: "num", c: "conn", label: `Chaque cellule reproductrice contient ${gap} chromosomes.`, unit: "chromosomes", ans: 23, err: [[v => v === 46, "46, c'est une cellule de la peau. La méiose divise ce nombre par deux."]] },
      { t: "word", c: "conn", label: `Lors de la formation des cellules reproductrices, les chromosomes d'une paire, parfois génétiquement ${gap} par leurs allèles, …`, ans: ["différents", "différent", "différentes"], err: [[["identiques", "identique", "pareils"], "Pense à Super-Méiose : sur la paire longue, un chromosome porte A, l'autre porte O."]] },
      { t: "word", c: "rais", label: `… se répartissent ${gap}.`, ans: ["aléatoirement", "au hasard", "de façon aléatoire", "de manière aléatoire", "aléatoires", "aléatoire"], err: [[["en deux", "par moitié", "moitié"], "Ils sont bien partagés entre les cellules, mais le mot attendu dit comment : pense à la loterie de la méiose."], [["identiques", "pareil", "pareils"], "Pense à la loterie de la méiose : la répartition change d'une méiose à l'autre."]] },
      { t: "word", c: "conn", label: `Les cellules reproductrices produites par un individu sont donc génétiquement ${gap}.`, ans: ["différentes", "différents", "différente", "toutes différentes", "uniques"], err: [[["identiques", "identique"], "Des cellules identiques, c'est le résultat de la mitose (activité 9)."]] }],
    hints: ["Relis tes réponses des parties 2 et 3.", "La loterie de la méiose : la répartition des chromosomes change d'une méiose à l'autre.", "Dans l'ordre : 23 · différents · aléatoirement (au hasard) · différentes."],
    corr: "Le bilan complet s'affiche ci-dessous : recopie-le dans ton cahier, avec le schéma." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Ce que je sais déjà",
  parts: [
    { t: "num", c: "conn", label: "Combien de chromosomes le noyau d'une cellule humaine contient-il ?", unit: "chromosomes", ans: 46, err: [[v => v === 23, "23, c'est le nombre de paires."]] },
    { t: "choice", c: "conn", label: "Dans un caryotype humain, les chromosomes sont rangés…", o: ["par paires : 23 paires", "par groupes de trois", "un par un, tous différents"], a: 0 },
    { t: "choice", c: "conn", label: "Activité 9 : une cellule qui se multiplie par mitose donne…", o: ["2 cellules identiques à elle, à 46 chromosomes", "4 cellules différentes", "2 cellules à 23 chromosomes"], a: 0 }],
  hints: ["Pense au caryotype humain étudié dans les activités précédentes.", "Dans un caryotype, chaque chromosome a son double de même taille.", "46 chromosomes · par paires · 2 cellules identiques."],
  corr: "Le noyau d'une cellule humaine contient 46 chromosomes, rangés en 23 paires. Par mitose, une cellule donne 2 cellules identiques à elle, à 46 chromosomes." };
const RESUME = `Problème : ${PROBLEM}

Les étapes de la méiose (animation)
${PHASES.map(p => `${p.n}. ${p.name}${p.sav ? " (" + p.sav + ")" : ""} : ${p.txt}`).join("\n")}

Schéma : 1 cellule à 46 chromosomes (diploïde) → interphase ou duplication → 46 chromosomes doubles (1 cellule) → méiose I → 23 chromosomes doubles (2 cellules) → méiose II → 23 chromosomes (4 cellules haploïdes).

Bilan à recopier dans le cahier
${BIL.map(x => x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
