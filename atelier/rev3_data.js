/* ===== 3e SVT · Révision du chapitre 1 (activités 1 à 6), d'après les fiches du professeur ===== */
const PROBLEM = "D'où viennent les caractères d'un individu, et où se trouve l'information qui les détermine ?";
const gap = `<span class="gap">………</span>`;
const word = (label, ans, err) => ({ t: "word", c: "conn", label, ans, err });
const DOC_ARBRE = { title: "Document · L'arbre généalogique d'une famille", w: "arbre" };
const DOC_CHIRO = { title: "Document · Une cellule observée au microscope (activité 4)", w: "chiro" };
const DOC_TP = { title: "Document · Le protocole du TP (activité 5)", html: `<ul class="ul"><li><b>Étape 1</b> : broyer la banane avec de l'eau, du liquide vaisselle et du sel.</li><li><b>Étape 2</b> : transvaser le liquide dans un tube à essai.</li><li><b>Étape 3</b> : verser très lentement de l'éthanol froid le long de la paroi, sans agiter. Des filaments blanchâtres apparaissent.</li><li><b>Étape 4</b> : pêcher les filaments, puis ajouter du vert de méthyle.</li></ul>` };
const DOC_CARYO = { title: "Document · Les caryotypes de l'enquête (activité 6)", html: tbl(["", "Nombre de chromosomes", "Chromosomes sexuels"], [["Échantillon (pâte blanchâtre)", "46", "X et Y"], ["Victime", "47 (trois chromosomes 21)", "X et Y"], ["Jean, Djamal, Max", "46", "X et Y"], ["Lucie, Laure", "46", "X et X"], ["Chien", "78", "—"]]) };
const DOC_SOURIS = { title: "Document · Une expérience de transfert de noyau chez la souris", html: `<ul class="ul"><li>On prélève un ovule chez une souris <b>blanche</b> et on retire son noyau.</li><li>On y place le noyau d'une cellule de souris <b>brune</b>.</li><li>On implante l'œuf obtenu dans l'utérus d'une souris <b>noire</b>.</li><li>Résultat : tous les souriceaux obtenus de cette façon sont <b>bruns</b>.</li></ul>` };
const BIL = [
  ["Activité 1", "Un caractère est une particularité observable directement ou indirectement. Les caractères qui se retrouvent chez tous les individus d'une espèce sont des caractères <u>spécifiques</u> de cette espèce. Chaque individu se différencie par des <u>variations individuelles</u> qui lui sont propres (couleur des yeux, groupe sanguin…). L'ensemble des caractères observables constitue le <u>phénotype</u> de l'individu."],
  ["Activité 2", "Les caractères qui se retrouvent plus ou moins de génération en génération sont des caractères <u>héréditaires</u>. Certains caractères du phénotype peuvent être modifiés par l'<u>environnement</u> ou les conditions de <u>vie</u>. Ces modifications ne sont pas <u>transmises à la descendance</u>, donc ne sont pas <u>héréditaires</u> (bronzage, nombre de globules rouges, musculature…)."],
  ["Activités 3 et 4", "Le transfert de noyau montre que l'information génétique se trouve dans le <u>noyau</u> des cellules. Au microscope, on y observe des <u>chromosomes</u>."],
  ["Activité 5", "Les chromosomes contiennent de l'<u>ADN</u>. On peut l'extraire des cellules ; le vert de méthyle le colore en vert."],
  ["Activité 6", "L'ensemble des chromosomes d'une espèce est nommé <u>caryotype</u>. Chaque espèce possède un caryotype spécifique. L'espèce humaine possède <u>23</u> paires de chromosomes dans le noyau de chaque cellule (sauf les cellules sexuelles, qui en ont la moitié). Homme : <u>22</u> paires + <u>XY</u>. Femme : <u>22</u> paires + <u>XX</u>. Un nombre <u>anormal</u> de chromosomes empêche le développement de l'embryon ou entraîne des anomalies (syndrome de Down : 3 chromosomes 21 au lieu de 2)."]];
const bilanHTML = () => BIL.map(([a, t]) => `<p><b>${a}.</b> ${nb(t)}</p>`).join("");
const SI = ["Spécifique (de l'espèce)", "Individuel"], HN = ["Héréditaire", "Non héréditaire"];

const GROUPS = [
{ id: "p1", n: 1, icon: "🧑‍🤝‍🧑", tab: "Caractères", title: "Les caractères d'un individu", sub: "Activités 1 et 2 : profil des suspects et arbres généalogiques.",
  items: [
  { id: "a1", lvl: "easy", title: "Activité 1 · Caractères spécifiques ou individuels ?",
    parts: [
      { t: "rows", c: "conn", label: "Classe chaque caractère des suspects.", choices: SI, rows: [{ txt: "Avoir deux yeux", a: 0 }, { txt: "La couleur des yeux", a: 1 }, { txt: "Se tenir debout sur deux jambes", a: 0 }, { txt: "Le groupe sanguin", a: 1 }, { txt: "Avoir cinq doigts à chaque main", a: 0 }, { txt: "La couleur des cheveux", a: 1 }] },
      word(`Les caractères communs à tous les individus d'une espèce sont des caractères ${gap} de cette espèce.`, ["spécifiques", "spécifique", "de l'espèce"], [[["individuels", "individuel"], "Individuel, c'est ce qui change d'une personne à l'autre."]]),
      word(`L'ensemble des caractères observables d'un individu constitue son ${gap}.`, ["phénotype"], [[["caryotype"], "Le caryotype, c'est l'ensemble des chromosomes. On cherche le mot pour l'ensemble des caractères."], [["génotype"], "Ce mot désigne les gènes, pas ce qu'on observe."]])],
    hints: ["Un caractère spécifique se retrouve chez tous les humains.", "Tous les suspects ont deux yeux, mais pas la même couleur d'yeux.", "Deux yeux, station debout, cinq doigts : spécifiques. Couleurs, groupe sanguin : individuels. Le mot du bilan : phénotype."],
    corr: "Les caractères qui se retrouvent chez tous les individus d'une espèce sont des caractères spécifiques. Chaque individu se différencie par des variations individuelles (couleur des yeux, groupe sanguin…). L'ensemble des caractères observables constitue le phénotype." },
  { id: "a2", lvl: "mid", title: "Activité 2 · Héréditaire ou non ?", docs: [DOC_ARBRE],
    parts: [
      { t: "choice", c: "lire", label: "Dans cette famille, qui possède une fossette au menton ?", o: ["Paul, Anna et Léa", "Rose, Marc et Tom", "Tout le monde"], a: 0 },
      { t: "choice", c: "rais", label: "Que peut-on en déduire sur ce caractère ?", o: ["Il se retrouve de génération en génération : il est héréditaire", "Il dépend de l'alimentation", "Il apparaît au hasard"], a: 0 },
      { t: "rows", c: "conn", label: "Ces caractères sont-ils héréditaires ?", choices: HN, rows: [{ txt: "La couleur des yeux", a: 0 }, { txt: "Le bronzage", a: 1 }, { txt: "Le groupe sanguin", a: 0 }, { txt: "La musculature d'un sportif", a: 1 }, { txt: "Le nombre de globules rouges après un séjour en altitude", a: 1 }] },
      word(`Certains caractères du phénotype peuvent être modifiés par l'${gap} ou les conditions de vie.`, ["environnement", "le milieu", "milieu"]),
      { t: "choice", c: "conn", label: "Ces modifications dues aux conditions de vie…", o: ["sont transmises à la descendance", "ne sont pas transmises à la descendance, donc ne sont pas héréditaires", "deviennent héréditaires au bout de quelques années"], a: 1 }],
    hints: ["Sur l'arbre, les symboles colorés possèdent le caractère.", "Un caractère héréditaire se transmet des parents aux enfants. Le bronzage d'un parent ne se retrouve pas chez son bébé.", "Fossette : héréditaire. Yeux et groupe sanguin : héréditaires. Bronzage, musculature, globules rouges : non héréditaires."],
    corr: "Les caractères qui se retrouvent plus ou moins de génération en génération sont des caractères héréditaires. Certains caractères du phénotype peuvent être modifiés par l'environnement ou les conditions de vie : ces modifications ne sont pas transmises à la descendance, donc ne sont pas héréditaires (bronzage, nombre de globules rouges, musculature…)." }] },

{ id: "p2", n: 2, icon: "🔬", tab: "Le noyau", title: "Où se trouve l'information génétique ?", sub: "Activités 3 et 4 : transfert de noyau et observation au microscope.",
  items: [
  { id: "b1", lvl: "mid", title: "Activité 3 · L'expérience de transfert de noyau",
    intro: "La vache noire et blanche a été fécondée par un taureau noir et blanc, comme elle.",
    pre: { label: "Avant de lancer l'animation : de quelle couleur sera le veau ?", o: ["Noir et blanc, comme la donneuse d'embryon", "Roux, comme la donneuse d'ovule", "Comme la vache porteuse"], a: 0 },
    widget: { title: "Animation · Le transfert de noyau", w: "clone", sim: "Schéma simplifié" },
    parts: [
      { t: "choice", c: "lire", label: "D'où vient le noyau placé dans l'ovule ?", o: ["D'une cellule de l'embryon de la vache noire et blanche", "De l'ovule de la vache rousse", "D'une cellule de la vache porteuse"], a: 0 },
      { t: "choice", c: "lire", label: "D'après l'expérience de ta fiche, à qui le veau ressemble-t-il ?", o: ["À la vache rousse, qui a donné l'ovule", "À la vache porteuse", "À la race noire et blanche, qui a donné le noyau"], a: 2, no: { 0: "La vache rousse n'a donné que l'ovule, sans son noyau.", 1: "Quelle que soit la vache porteuse, le veau a les mêmes caractères." } },
      { t: "choice", c: "rais", label: "Qu'en déduis-tu ?", o: ["L'information génétique se trouve dans le noyau des cellules", "L'information génétique se trouve dans le cytoplasme de l'ovule", "L'information génétique vient de l'utérus de la vache porteuse"], a: 0 }],
    hints: ["Suis le point rouge : c'est le noyau qui est déplacé.", "Le veau ressemble à celle qui a fourni le noyau, pas à celle qui a fourni l'ovule ni à la porteuse.", "Le veau est noir et blanc : les caractères héréditaires dépendent du noyau."],
    corr: "Je vois que le veau présente tous les caractères de la race noire et blanche. Or seul le noyau provient de cette race : l'ovule vient d'une vache rousse et la gestation se fait dans une vache porteuse. J'en déduis que l'information génétique se trouve dans le noyau des cellules.",
    unlock: { title: "🔓 Animation complète · Le veau obtenu", w: "cloneFull", sim: "Schéma simplifié" } },
  { id: "b2", lvl: "easy", title: "Activité 4 · Au cœur des cellules", docs: [DOC_CHIRO],
    parts: [
      { t: "match", c: "conn", label: "Légende la cellule.", ask: "Choisis le nom du", rows: [{ e: "①", txt: "Repère 1", v: "Membrane" }, { e: "②", txt: "Repère 2", v: "Cytoplasme" }, { e: "③", txt: "Repère 3", v: "Noyau" }, { e: "④", txt: "Repère 4", v: "Chromosome" }] },
      { t: "num", c: "conn", label: "Tu observes avec un oculaire ×10 et un objectif ×40. Quel est le grossissement du microscope ?", unit: "fois", ans: 400, err: [[v => v === 50, "On n'additionne pas : grossissement = oculaire × objectif."]] }],
    hints: ["Les chromosomes se trouvent à l'intérieur du noyau.", "La membrane entoure la cellule ; le cytoplasme est entre la membrane et le noyau.", "1 membrane · 2 cytoplasme · 3 noyau · 4 chromosome. Grossissement : 10 × 40 = 400."],
    corr: "La cellule est limitée par une membrane et contient du cytoplasme et un noyau. Dans le noyau, on observe des chromosomes. Grossissement du microscope = oculaire × objectif = 10 × 40 = 400." }] },

{ id: "p3", n: 3, icon: "🧬", tab: "ADN", title: "ADN et chromosomes", sub: "Activités 5 et 6 : extraction d'ADN et caryotypes.",
  items: [
  { id: "c1", lvl: "mid", title: "Activité 5 · Notre échantillon contient-il de l'ADN ?", docs: [DOC_TP],
    parts: [
      { t: "match", c: "conn", label: "Relie chaque produit à son rôle.", ask: "Choisis le rôle de", rows: [{ e: "🧴", txt: "Le liquide vaisselle", v: "Détruit les membranes des cellules" }, { e: "🧂", txt: "Le sel", v: "Aide à précipiter l'ADN" }, { e: "🧪", txt: "L'éthanol froid", v: "Fait apparaître les filaments blancs d'ADN" }, { e: "🟢", txt: "Le vert de méthyle", v: "Colore l'ADN en vert" }] },
      { t: "choice", c: "rais", label: "J'observe que le précipité devient vert. Or le vert de méthyle se fixe spécifiquement sur l'ADN. Donc…", o: ["le précipité contient de l'ADN", "le précipité contient du sel", "la banane n'a pas de cellules"], a: 0 },
      { t: "choice", c: "conn", label: "Quelle erreur empêche de voir les filaments d'ADN ?", o: ["Verser l'éthanol très lentement", "Agiter le tube après avoir versé l'éthanol", "Utiliser de l'éthanol bien froid"], a: 1 }],
    hints: ["Les rôles sont écrits dans le protocole de ta fiche.", "Pour libérer l'ADN, il faut d'abord détruire les membranes des cellules.", "Liquide vaisselle : membranes. Sel : aide à précipiter. Éthanol froid : filaments blancs. Vert de méthyle : coloration verte."],
    corr: "Notre échantillon de banane contient bien de l'ADN. Nous l'avons extrait en détruisant les membranes cellulaires (liquide vaisselle), puis en le faisant précipiter avec l'éthanol. Le test au vert de méthyle confirme la présence d'ADN." },
  { id: "c2", lvl: "mid", title: "Activité 6 · Lire un caryotype", docs: [DOC_CARYO],
    parts: [
      word(`L'ensemble des chromosomes d'une espèce est nommé ${gap}.`, ["caryotype"], [[["phénotype"], "Le phénotype, c'est l'ensemble des caractères observables."]]),
      { t: "num", c: "conn", label: "Combien de paires de chromosomes une cellule humaine possède-t-elle ?", unit: "paires", ans: 23, err: [[v => v === 46, "46, c'est le nombre de chromosomes. Combien de paires ?"]] },
      { t: "rows", c: "lire", label: "Peut-on innocenter ce suspect grâce à son caryotype ?", choices: ["Innocenté", "Pas innocenté"], rows: [{ txt: "Lucie (46 chromosomes, X et X)", a: 0 }, { txt: "Max (46 chromosomes, X et Y)", a: 1 }, { txt: "Le chien (78 chromosomes)", a: 0 }, { txt: "Jean (46 chromosomes, X et Y)", a: 1 }] },
      { t: "choice", c: "rais", label: "L'échantillon peut-il venir de la victime ?", o: ["Oui, elle a aussi X et Y", "Non : la victime a 47 chromosomes, avec trois chromosomes 21", "On ne peut pas savoir"], a: 1 },
      { t: "choice", c: "rais", label: "Le caryotype permet-il de désigner le coupable parmi Jean, Djamal et Max ?", o: ["Oui", "Non : ils ont tous les trois le même type de caryotype"], a: 1 }],
    hints: ["L'échantillon : 46 chromosomes, X et Y. Cherche qui a un caryotype différent.", "Un homme a X et Y, une femme X et X. Un chien n'a pas le même nombre de chromosomes qu'un humain.", "Lucie et le chien sont innocentés. Jean, Djamal et Max ont le même type de caryotype que l'échantillon."],
    corr: "L'ensemble des chromosomes d'une espèce est son caryotype. L'espèce humaine possède 23 paires de chromosomes : 22 paires + XY chez l'homme, 22 paires + XX chez la femme. Je vois que l'échantillon contient X et Y, or Lucie et Laure ont X et X : elles sont innocentées, comme le chien (78 chromosomes). Les trois hommes ont le même type de caryotype : on ne peut pas les départager." }] },

{ id: "p4", n: 4, icon: "🎓", tab: "Brevet", title: "Comme au brevet", sub: "Un document nouveau, les mêmes raisonnements.",
  items: [
  { id: "d2", lvl: "hard", title: "Exercice type brevet", docs: [DOC_SOURIS], recop: true,
    parts: [
      { t: "choice", c: "lire", label: "De quelle souris vient le noyau ?", o: ["De la souris blanche", "De la souris brune", "De la souris noire"], a: 1 },
      { t: "choice", c: "rais", label: "Complète : « Je vois que les souriceaux sont bruns, or… »", o: ["seul le noyau provient d'une souris brune", "la souris porteuse est brune", "l'ovule provient d'une souris brune"], a: 0 },
      { t: "choice", c: "rais", label: "« … donc j'en déduis que… »", o: ["la couleur du pelage dépend de la souris porteuse", "l'information qui détermine la couleur du pelage se trouve dans le noyau", "la couleur du pelage dépend de l'alimentation"], a: 1 },
      { t: "match", c: "conn", label: "Range du plus grand au plus petit.", ask: "Choisis l'élément pour", rows: [{ e: "1", txt: "Le plus grand", v: "Cellule" }, { e: "2", txt: "À l'intérieur", v: "Noyau" }, { e: "3", txt: "Encore à l'intérieur", v: "Chromosome" }, { e: "4", txt: "Ce qui le constitue", v: "ADN" }] },
      { t: "choice", c: "conn", label: "La couleur du pelage d'une souris est…", o: ["un caractère héréditaire", "un caractère dû à l'environnement", "un caractère spécifique de toutes les souris"], a: 0 }],
    hints: ["Repère ce que chaque souris apporte : l'ovule sans noyau, le noyau, l'utérus.", "C'est la même expérience que celle des vaches de l'activité 3.", "Noyau de souris brune → souriceaux bruns : l'information est dans le noyau. Cellule > noyau > chromosome > ADN."],
    corr: "Je vois que les souriceaux sont bruns. Or seul le noyau provient d'une souris brune (l'ovule vient d'une souris blanche, la porteuse est noire). J'en déduis que l'information génétique, qui détermine les caractères héréditaires, se trouve dans le noyau. Le noyau contient les chromosomes, constitués d'ADN." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Dans l'enquête, la pâte blanchâtre retrouvée sur la victime a servi à…", o: ["établir le caryotype de l'assassin", "mesurer la taille de l'assassin", "connaître l'âge de la victime"], a: 0 },
    { t: "num", c: "conn", label: "Combien de chromosomes le noyau d'une cellule humaine contient-il ?", unit: "chromosomes", ans: 46, err: [[v => v === 23, "23, c'est le nombre de paires."]] }],
  hints: ["Souviens-toi de l'activité 6.", "23 paires, donc…", "Le caryotype de l'assassin · 46 chromosomes."],
  corr: "L'échantillon a permis d'établir un caryotype, comparé à ceux des suspects. Une cellule humaine contient 46 chromosomes, soit 23 paires." };
const RESUME = `Question du chapitre : ${PROBLEM}

À savoir
${BIL.map(([a, t]) => `- ${a}. ${t.replace(/<\/?u>/g, "")}`).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
