/* ===== 5e EIST · Révision de la Mission 4, d'après les documents du professeur ===== */
const PROBLEM = "Comment conserver les vivres de la fusée ? Ce qu'il faut savoir sur l'eau, les micro-organismes et les aliments.";
const gap = `<span class="gap">………</span>`;
const word = (label, ans, err) => ({ t: "word", c: "conn", label, ans, err });
const CH = ["Fusion", "Solidification", "Vaporisation", "Liquéfaction"];
const DOC_SOL = { title: "Document · Refroidissement de l'eau pure (comme au TP2)", sim: SIMUL, w: "solDoc" };
const DOC_FUS = { title: "Document · On réchauffe de la glace", sim: SIMUL, w: "fusDoc" };
const DOC_BACT = { title: "Document · La multiplication des bactéries (activité 1)", html: `<p>À température ambiante, chaque bactérie se divise en deux une fois toutes les 20 minutes environ. Le nombre de bactéries est donc multiplié par deux toutes les 20 minutes.</p>` };
const bilanHTML = () => `<ul>${["nommer les quatre changements d'état de l'eau étudiés et dire s'il faut chauffer ou refroidir", "dire ce que deviennent la masse et le volume de l'eau lors d'un changement d'état", "construire un graphique : titre, axes avec unités, échelle régulière, points bien placés", "repérer un palier sur une courbe et dire ce qui se passe pendant ce palier", "donner la température d'ébullition et la température de solidification de l'eau pure", "citer des micro-organismes et dire avec quel instrument on les observe", "calculer un nombre de bactéries qui double toutes les 20 minutes, et retrouver dans l'activité 1 le seuil à partir duquel un plat devient toxique", "citer les besoins des micro-organismes et expliquer comment chaque technique de conservation les en prive"].map(x => `<li>Je sais ${nb(x)}.</li>`).join("")}</ul><p><b>Pour t'entraîner encore :</b></p><div class="links"><a href="changements-etat/ebullition-eau.html">💧 L'ébullition de l'eau (TP3)</a><a href="micro-organismes/echiquier-bacteries.html">♟ L'échiquier des bactéries (activité 1)</a></div>`;

const GROUPS = [
{ id: "p1", n: 1, icon: "💧", tab: "États", title: "Les changements d'état de l'eau", sub: "Nommer un changement d'état ; masse et volume.",
  items: [
  { id: "a1", lvl: "easy", title: "Quel changement d'état ?",
    parts: [
      { t: "rows", c: "conn", label: "Nomme le changement d'état dans chaque situation.", choices: CH, rows: [{ txt: "Un glaçon devient de l'eau dans un verre.", a: 0 }, { txt: "De la buée se forme sur un miroir froid.", a: 3 }, { txt: "L'eau d'une flaque disparaît au soleil.", a: 2 }, { txt: "L'eau d'un bac devient de la glace au congélateur.", a: 1 }] },
      { t: "rows", c: "conn", label: "Faut-il chauffer ou refroidir ?", choices: ["Il faut chauffer", "Il faut refroidir"], rows: [{ txt: "Pour passer de l'état liquide à l'état gazeux", a: 0 }, { txt: "Pour passer de l'état liquide à l'état solide", a: 1 }, { txt: "Pour passer de l'état gazeux à l'état liquide", a: 1 }] }],
    hints: ["Repère l'état de départ et l'état d'arrivée : solide, liquide ou gazeux.", "La buée, ce sont de fines gouttes d'eau liquide : la vapeur d'eau de l'air est devenue liquide.", "Glaçon qui fond : fusion. Buée : liquéfaction. Flaque qui sèche : vaporisation. Bac à glaçons : solidification."],
    corr: "Solide → liquide : fusion. Liquide → solide : solidification. Liquide → gaz : vaporisation. Gaz → liquide : liquéfaction. On chauffe pour la fusion et la vaporisation ; on refroidit pour la solidification et la liquéfaction.",
    unlock: { title: "🔓 Simulation débloquée · Les particules d'eau selon la température", w: "thermo", sim: "Modèle simplifié" } },
  { id: "a2", lvl: "mid", title: "Masse et volume : l'expérience du glaçon",
    pre: { label: "Ton hypothèse : quand le glaçon aura fondu, la balance affichera…", o: ["une masse plus petite", "la même masse", "une masse plus grande"], a: 1 },
    widget: { title: "Expérience virtuelle · Un glaçon fond sur la balance", w: "balance", sim: SIMUL },
    parts: [
      { t: "num", c: "mod", label: "Lance l'expérience. Quelle masse la balance affiche-t-elle quand le glaçon a fondu ?", unit: "g", ans: 250, tol: 0.5 },
      { t: "choice", c: "rais", label: "Que montre cette expérience ?", o: ["De la matière a disparu pendant la fusion", "La quantité de matière n'a pas changé : seul l'état de l'eau a changé", "De la matière est apparue pendant la fusion"], a: 1 },
      { t: "choice", c: "rais", label: "Une bouteille en verre remplie d'eau et fermée éclate au congélateur. Pourquoi ?", o: ["La glace est plus lourde que l'eau liquide", "En devenant solide, l'eau prend plus de place", "Le froid rend le verre mou"], a: 1 }],
    hints: ["Compare la masse affichée au début et à la fin.", "La balance mesure la quantité de matière. Elle ne dit rien de la place occupée.", "250 g au début comme à la fin. La bouteille éclate parce que la glace occupe plus de place que l'eau liquide."],
    corr: "La balance affiche 250 g avant et après la fusion du glaçon. Dans la bouteille, l'eau qui gèle occupe plus de place qu'à l'état liquide : le volume, lui, a changé. À toi d'en tirer la règle sur la masse et sur le volume, et de la vérifier dans ton cahier." }] },

{ id: "p2", n: 2, icon: "📈", tab: "Courbes", title: "Construire et lire une courbe", sub: "Placer des points, repérer un palier, conclure.",
  items: [
  { id: "b1", lvl: "mid", title: "Construire un graphique",
    intro: `<div class="box key"><p class="lab">✔ Règle clé</p><p>Un graphique complet a un titre, deux axes avec leur grandeur et leur unité, et une échelle régulière.</p></div>`,
    parts: [
      { t: "plot", c: "lire", label: "Place les neuf points du tableau.", pts: SOL, xMax: 8, yMin: -15, yMax: 25, snap: 5, xName: "Temps (min)", yName: "Température (°C)", xTitle: "Temps (min)", yTitle: "Température (°C)" },
      { t: "choice", c: "lire", label: "Quel titre convient à ce graphique ?", o: ["Évolution de la température de l'eau en fonction du temps", "Évolution du temps en fonction de l'eau", "Tableau des températures"], a: 0 }],
    hints: ["Pour chaque colonne du tableau : repère le temps en bas, puis monte jusqu'à la bonne température.", "Attention aux températures négatives : elles sont sous la ligne du zéro.", "De 3 à 6 min, les quatre points sont tous sur la ligne 0 °C."],
    corr: "On lit le temps sur l'axe horizontal et la température sur l'axe vertical. Les températures négatives se placent sous le zéro. Le titre dit ce qui est mesuré (la température de l'eau) en fonction de quoi (le temps)." },
  { id: "b2", lvl: "mid", title: "Lire la courbe de solidification", docs: [DOC_SOL],
    parts: [
      { t: "rows", c: "lire", label: "Dans quel état se trouve l'eau ?", choices: ["Liquide", "Liquide et solide en même temps", "Solide"], rows: [{ txt: "Zone A (de 0 à 3 min)", a: 0 }, { txt: "Entre les zones A et C (de 3 à 6 min)", a: 1 }, { txt: "Zone C (de 6 à 8 min)", a: 2 }] },
      word(`La partie horizontale de la courbe s'appelle un ${gap}.`, ["palier", "palier de température", "plateau"]),
      { t: "num", c: "lire", label: "À quelle température l'eau pure devient-elle solide ?", unit: "°C", ans: 0 }],
    hints: ["Au début, l'eau est à 20 °C : dans quel état est-elle ?", "Pendant la partie horizontale, la glace se forme peu à peu : il y a encore du liquide.", "Liquide, puis liquide et solide pendant le palier à 0 °C, puis solide."],
    corr: "L'eau liquide refroidit jusqu'à 0 °C. La température reste alors constante : c'est un palier, pendant lequel l'eau se solidifie (liquide et solide sont présents). Quand toute l'eau est solide, la température baisse de nouveau." },
  { id: "b3", lvl: "mid", title: "La conclusion du TP3",
    parts: [
      word(`La température d'${gap} de l'eau pure, dans des conditions normales de pression, est de 100 °C.`, ["ébullition", "vaporisation"]),
      word(`Pendant le changement d'état, la température reste ${gap}.`, ["constante", "la même", "stable", "fixe"]),
      { t: "choice", c: "conn", label: "Au TP3, des gouttelettes apparaissent sur les parois du ballon. Que s'est-il passé ?", o: ["De la vapeur d'eau est redevenue liquide au contact de la paroi plus froide", "Le ballon a fui", "L'eau liquide a grimpé le long du verre"], a: 0 },
      { t: "choice", c: "rais", label: "L'eau bout-elle toujours à 100 °C ?", o: ["Oui, partout et toujours", "Non : cela dépend de la pression, par exemple en haute montagne", "Non : cela dépend de la couleur de la casserole"], a: 1 }],
    hints: ["Relis la conclusion de ta fiche de TP3.", "Quand l'eau bout, le thermomètre ne monte plus.", "Ébullition · constante · la vapeur d'eau se liquéfie sur la paroi froide · cela dépend de la pression."],
    corr: "La température d'ébullition de l'eau pure, dans des conditions normales de pression, est de 100 °C. On note l'existence d'un palier : la vaporisation de l'eau pure s'effectue à température constante. Les gouttelettes sur les parois viennent de la vapeur d'eau qui redevient liquide." }] },

{ id: "p3", n: 3, icon: "🦠", tab: "Microbes", title: "Micro-organismes et conservation", sub: "Ce qu'ils sont, comment ils se multiplient, comment s'en protéger.",
  items: [
  { id: "c1", lvl: "easy", title: "Petits, mais nombreux", docs: [DOC_BACT],
    parts: [
      { t: "rows", c: "conn", label: "Avec quoi peut-on l'observer ?", choices: ["À l'œil nu", "Seulement au microscope"], rows: [{ txt: "Une fourmi", a: 0 }, { txt: "Une bactérie", a: 1 }, { txt: "Un grain de riz", a: 0 }, { txt: "Une levure", a: 1 }] },
      { t: "num", c: "calc", label: "On part d'une seule bactérie. Combien y en a-t-il au bout de 1 heure ?", unit: "bactéries", ans: 8, err: [[v => v === 6, "On ne multiplie pas par 2 le nombre de divisions : la population double à chaque division. 1 → 2 → 4 → …"], [v => v === 3, "3, c'est le nombre de divisions en 1 heure. Combien de bactéries après 3 doublements ?"]] },
      { t: "num", c: "calc", label: "Et au bout de 2 heures ?", unit: "bactéries", ans: 64, err: [[v => v === 16, "16, c'est le double de 8. Mais en une heure de plus, il y a encore 3 divisions."], [v => v === 12, "La population double à chaque division : 8 → 16 → 32 → …"]] }],
    hints: ["En 1 heure, il y a 60 ÷ 20 = 3 divisions.", "1 → 2 → 4 → 8 : chaque flèche est une division de 20 minutes.", "8 bactéries après 1 h. En 2 h, 6 divisions : 64 bactéries."],
    corr: "Les bactéries et les levures sont des micro-organismes : on ne les voit qu'au microscope. En 1 heure, il y a 3 divisions : 1 → 2 → 4 → 8 bactéries. En 2 heures, 6 divisions : 64 bactéries. Le nombre double à chaque fois : il devient très vite immense." },
  { id: "c2", lvl: "mid", title: "Conserver les aliments",
    parts: [
      { t: "multi", c: "conn", label: "De quoi les micro-organismes ont-ils besoin pour se développer sur un aliment ? (4 réponses)", o: ["D'eau", "De nourriture", "De chaleur", "De temps", "De lumière", "De froid"], a: [0, 1, 2, 3] },
      { t: "rows", c: "rais", label: "Comment cette technique freine-t-elle les micro-organismes ?", choices: ["Elle les prive de chaleur", "Elle les prive d'eau"], rows: [{ txt: "Mettre un plat au réfrigérateur", a: 0 }, { txt: "Saler un jambon", a: 1 }, { txt: "Faire une confiture très sucrée", a: 1 }, { txt: "Déshydrater un plat pour l'espace", a: 1 }] },
      { t: "choice", c: "rais", label: "Sam prépare un plat réhydraté à midi, le laisse sur la table et le mange le lendemain. Quel est le problème ?", o: ["Le plat a eu de l'eau, de la chaleur et du temps : les micro-organismes ont pu se multiplier", "Le plat a perdu son goût", "Le plat a gelé"], a: 0 }],
    hints: ["Pense à ce qui manque dans un plat déshydraté, et à ce qui manque dans un réfrigérateur.", "Le sel et le sucre « retiennent » l'eau : les micro-organismes ne peuvent plus l'utiliser.", "Eau, nourriture, chaleur, temps. Réfrigérateur : moins de chaleur. Sel, sucre, déshydratation : moins d'eau."],
    corr: "Pour se développer, les micro-organismes ont besoin d'eau, de nourriture, de chaleur et de temps. Pour réduire leur développement, il suffit de supprimer l'un de ces éléments : le froid les prive de chaleur ; le sel, le sucre et la déshydratation les privent d'eau. Un plat réhydraté laissé à température ambiante leur offre tout ce qu'il faut." }] },

{ id: "p4", n: 4, icon: "🎯", tab: "Défi", title: "Prêt pour le contrôle ?", sub: "Des situations nouvelles pour vérifier que tu sais faire.",
  items: [
  { id: "d2", lvl: "hard", title: "Défi final", docs: [DOC_FUS, DOC_BACT], recop: true,
    parts: [
      { t: "num", c: "lire", label: "Sur ce graphique, à quelle température se trouve le palier ?", unit: "°C", ans: 0 },
      { t: "choice", c: "rais", label: "Quel changement d'état se produit pendant ce palier ?", o: CH, a: 0, no: { 1: "Ici on réchauffe de la glace : la température monte.", 2: "La vaporisation de l'eau pure se fait vers 100 °C." } },
      { t: "num", c: "lire", label: "Pendant combien de minutes la température reste-t-elle constante ?", unit: "min", ans: 3, tol: 0.2, err: [[v => v === 4, "Il y a 4 points sur le palier, mais de 2 min à 5 min il s'écoule…"]] },
      { t: "num", c: "calc", label: "En partant d'une bactérie, combien de divisions faut-il pour dépasser 1 000 bactéries ?", unit: "divisions", ans: 10, err: [[v => v === 500, "La population ne gagne pas 2 bactéries à chaque fois : elle double."]] },
      { t: "num", c: "calc", label: "Combien de minutes cela représente-t-il ?", unit: "min", ans: 200, tol: 0.5 }],
    hints: ["Le palier est la partie horizontale de la courbe.", "1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1 024…", "Palier à 0 °C pendant 3 min : fusion. 10 divisions × 20 min = 200 min."],
    corr: "Le palier est à 0 °C, de 2 à 5 min, soit pendant 3 minutes : la glace fond (fusion). Pour les bactéries : 1 → 2 → 4 → … → 1 024 après 10 divisions, soit 10 × 20 = 200 minutes (3 h 20 min)." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Quels sont les trois états de l'eau ?", o: ["Solide, liquide, gazeux", "Froid, tiède, chaud", "Glace, neige, grêle"], a: 0 },
    { t: "choice", c: "conn", label: "Pourquoi les plats des astronautes sont-ils déshydratés ?", o: ["Pour qu'ils soient plus jolis", "Pour qu'ils se conservent longtemps et pèsent moins lourd", "Pour qu'ils cuisent plus vite"], a: 1 }],
  hints: ["Pense à la glace, à l'eau du robinet et à la vapeur.", "Sans eau, les micro-organismes ne se développent pas.", "Solide, liquide, gazeux · conservation et masse."],
  corr: "L'eau existe à l'état solide, liquide ou gazeux. Un plat déshydraté ne contient presque plus d'eau : les micro-organismes ne peuvent pas s'y développer, et il est plus léger à emporter." };
const RESUME = `Révision de la Mission 4 : changements d'état de l'eau, courbes de température, micro-organismes, conservation des aliments.

Avant le contrôle, je vérifie que je sais :
- nommer les changements d'état de l'eau et dire s'il faut chauffer ou refroidir ;
- dire ce que deviennent la masse et le volume lors d'un changement d'état ;
- construire un graphique complet (titre, axes, unités, échelle, points) ;
- repérer un palier et dire ce qui se passe pendant ce palier ;
- citer des micro-organismes, calculer un doublement toutes les 20 minutes ;
- citer les besoins des micro-organismes et les techniques de conservation.`;
typo(GROUPS); typo(RAPPEL);
