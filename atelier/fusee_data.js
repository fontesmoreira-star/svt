/* ===== 5e EIST · Activité 4 : contenus, d'après la fiche du professeur ===== */
const PROBLEM = "À quoi sert chaque élément d'une fusée ?";
const DOC_FUSEE = { title: "Document · Les éléments d'une vraie fusée", w: "rocketDoc" };
const FT = [["Améliorer la pénétration dans l'air (limiter les frottements)", "Coiffe"], ["Contenir le carburant", "Réservoir"], ["Éjecter les gaz de combustion", "Tuyère"], ["Augmenter la pression en produisant des gaz par combustion", "Chambre de combustion"], ["Résister à la pression des gaz de combustion", "Corps (structure)"], ["Stabiliser la fusée et corriger sa trajectoire", "Ailerons"]];
const USAGE = "Transporter une charge (satellite, équipage) dans l'espace";
const bilanHTML = () => `<p><b>Fonction d'usage</b> (à quoi sert la fusée ?) : <u>${nb(USAGE)}</u>.</p>${tbl(["Fonction technique", "Solution technique"], FT.map(([f, s]) => [nb(f), `<u>${s}</u>`]))}<p>${nb("La fonction d'usage dit à quoi sert l'objet. Une fonction technique dit ce que l'objet doit faire pour y arriver. Une solution technique est l'élément qui réalise cette fonction.")}</p>`;

const GROUPS = [
{ id: "p1", n: 1, icon: "🔍", tab: "S'informer", title: "S'informer sur une vraie fusée", sub: "Lis les fiches d'information et légende le dessin.",
  items: [
  { id: "a1", lvl: "easy", title: "Légender la fusée", docs: [DOC_FUSEE],
    parts: [{ t: "match", c: "lire", label: "Donne son nom à chaque repère du dessin.", ask: "Choisis le nom du", rows: [{ e: "①", txt: "Repère 1", v: "Coiffe" }, { e: "②", txt: "Repère 2", v: "Réservoir" }, { e: "③", txt: "Repère 3", v: "Corps (structure)" }, { e: "④", txt: "Repère 4", v: "Chambre de combustion" }, { e: "⑤", txt: "Repère 5", v: "Tuyère" }, { e: "⑥", txt: "Repère 6", v: "Ailerons" }] }],
    hints: ["Chaque fiche dit où se trouve l'élément : au sommet, à l'intérieur, tout en bas…", "Le repère 1 est au sommet. Le repère 5 est le cône tout en bas. Le repère 6 montre les petites ailes.", "1 coiffe · 2 réservoir · 3 corps · 4 chambre de combustion · 5 tuyère · 6 ailerons."],
    corr: "1 : coiffe (au sommet). 2 : réservoir (grande cuve intérieure). 3 : corps, la paroi de la fusée. 4 : chambre de combustion (dans le moteur). 5 : tuyère (cône tout en bas). 6 : ailerons (petites ailes du bas)." }] },

{ id: "p2", n: 2, icon: "🧩", tab: "Le schéma", title: "Compléter le schéma", sub: "Fonction d'usage, fonctions techniques et solutions techniques.",
  items: [
  { id: "b1", lvl: "easy", title: "La fonction d'usage",
    intro: `<div class="box info"><p class="lab">ℹ Vocabulaire</p><p>La <b>fonction d'usage</b> répond à la question : « À quoi sert cet objet ? »</p></div>`,
    parts: [
      { t: "choice", c: "rais", label: "Quelle est la fonction d'usage d'une fusée ?", o: ["Brûler du carburant", USAGE, "Voler le plus vite possible", "Résister à la pression"], a: 1, no: { 0: "Brûler du carburant est un moyen, pas le but.", 2: "La vitesse est un moyen d'atteindre l'espace, pas le but.", 3: "C'est une fonction technique : ce que la fusée doit faire pour réussir sa mission." } },
      { t: "choice", c: "rais", label: "« Contenir le carburant », c'est…", o: ["la fonction d'usage de la fusée", "une fonction technique : ce que la fusée doit faire pour remplir sa mission", "une solution technique : un élément de la fusée"], a: 1 }],
    hints: ["Pourquoi envoie-t-on des fusées ?", "Une fusée emporte quelque chose : un satellite, une sonde, des astronautes.", "Fonction d'usage : transporter une charge dans l'espace. « Contenir le carburant » est une fonction technique."],
    corr: "La fonction d'usage d'une fusée est de transporter une charge (satellite, équipage) dans l'espace. Pour y arriver, elle doit remplir plusieurs fonctions techniques, comme contenir le carburant." },
  { id: "d2", lvl: "mid", title: "À chaque fonction technique sa solution", docs: [DOC_FUSEE], recop: true,
    intro: `<div class="box info"><p class="lab">ℹ Vocabulaire</p><p>Une <b>solution technique</b> est l'élément de la fusée qui réalise une fonction technique.</p></div>`,
    parts: [{ t: "match", c: "rais", label: "Relie chaque fonction technique à sa solution technique.", ask: "Choisis la solution pour", rows: FT.map(([f, s], i) => ({ e: "⚙", txt: f, v: s })) }],
    hints: ["Relis les fiches d'information : chacune explique le rôle d'un élément.", "Ce qui fend l'air est au sommet. Ce qui laisse sortir les gaz est tout en bas.", "Coiffe : pénétration dans l'air. Réservoir : carburant. Tuyère : éjecter les gaz. Chambre de combustion : produire les gaz. Corps : résister. Ailerons : stabiliser."],
    corr: "Pénétration dans l'air : coiffe. Contenir le carburant : réservoir. Éjecter les gaz : tuyère. Produire des gaz par combustion : chambre de combustion. Résister à la pression : corps de la fusée. Stabiliser et corriger la trajectoire : ailerons." }] },

{ id: "p3", n: 3, icon: "🚀", tab: "L'atelier", title: "L'atelier de lancement", sub: "Teste des fusées, puis dépanne celles qui volent mal.",
  items: [
  { id: "c1", lvl: "mid", title: "Tester pour comprendre",
    widget: { title: "Simulation · Atelier de lancement", w: "atelier", sim: SIMUL },
    parts: [
      { t: "rows", c: "mod", label: "Fais des essais en changeant un seul élément à la fois. Que constates-tu ?", choices: ["Elle monte plus haut", "Elle vole droit", "Rien ne change"], rows: [{ txt: "Quand on ajoute des ailerons, surtout…", a: 1 }, { txt: "Quand on remplace le sommet plat par une coiffe pointue…", a: 0 }, { txt: "Quand on prend un grand réservoir…", a: 0 }] },
      { t: "num", c: "mod", label: "Quelle est la plus grande altitude que tu peux atteindre ?", unit: "m", ans: 80, tol: 0.5, err: [[v => v === 100, "100 m est le haut de l'échelle. Lis l'altitude affichée après le vol."], [v => v < 80, "Une autre fusée monte plus haut : change encore un élément."]] }],
    hints: ["Lance d'abord la fusée de départ, puis change un seul bouton et relance.", "Regarde le tableau « Mes essais » : il garde tous tes résultats.", "Meilleure fusée : coiffe pointue, avec ailerons, grand réservoir. Elle atteint 80 m."],
    corr: "Les ailerons stabilisent la fusée : elle vole droit. La coiffe pointue limite les frottements de l'air : la fusée monte plus haut. Un grand réservoir contient plus de carburant : elle monte plus haut. La meilleure fusée atteint 80 m." },
  { id: "c2", lvl: "hard", title: "Défi · Dépanner une fusée",
    parts: [
      { t: "choice", c: "rais", label: "Une minifusée décolle, puis part de travers en tournant sur elle-même. Quelle fonction technique n'est pas remplie ?", o: ["Contenir le carburant", "Stabiliser la fusée et corriger sa trajectoire", "Éjecter les gaz de combustion"], a: 1 },
      { t: "choice", c: "rais", label: "Que faut-il lui ajouter ?", o: ["Une tuyère plus large", "Des ailerons", "Un deuxième réservoir"], a: 1 },
      { t: "choice", c: "rais", label: "Le corps d'une autre fusée se déchire au décollage. Quelle fonction technique n'est pas remplie ?", o: ["Résister à la pression des gaz de combustion", "Améliorer la pénétration dans l'air", "Stabiliser la fusée"], a: 0 },
      { t: "choice", c: "rais", label: "Une fusée vole droit, mais elle est très freinée par l'air. Quel élément faut-il améliorer ?", o: ["Les ailerons", "Le réservoir", "La coiffe"], a: 2 }],
    hints: ["Retrouve d'abord la fonction technique en panne, puis l'élément qui la réalise.", "Voler droit : stabiliser. Ne pas se déchirer : résister à la pression. Fendre l'air : pénétration dans l'air.", "Ailerons pour stabiliser · corps solide pour résister · coiffe pour fendre l'air."],
    corr: "Une fusée qui part de travers n'est pas stabilisée : il lui faut des ailerons. Un corps qui se déchire ne résiste pas à la pression des gaz. Une fusée trop freinée par l'air a besoin d'une coiffe mieux profilée." }] }
];

const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Un vélo sert à se déplacer. « Se déplacer », c'est…", o: ["sa fonction d'usage", "une solution technique", "un matériau"], a: 0 },
    { t: "choice", c: "conn", label: "Sur un vélo, quel élément permet de ralentir ?", o: ["La selle", "Les freins", "Le guidon"], a: 1 }],
  hints: ["La fonction d'usage dit à quoi sert l'objet.", "Chaque élément d'un objet a un rôle.", "La fonction d'usage · les freins."],
  corr: "« Se déplacer » est la fonction d'usage du vélo. Les freins sont la solution technique qui permet de ralentir. Une fusée se décrit de la même façon." };

const RESUME = `Mission : ${PROBLEM}

À retenir
- Fonction d'usage de la fusée : ${USAGE.toLowerCase()}.
${FT.map(([f, s]) => `- ${f} : ${s.toLowerCase()}`).join("\n")}
- La fonction d'usage dit à quoi sert l'objet. Une fonction technique dit ce que l'objet doit faire. Une solution technique est l'élément qui réalise cette fonction.`;

typo(GROUPS); typo(RAPPEL);
