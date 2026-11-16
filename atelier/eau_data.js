/* ===== 5e EIST · Activité 5 : fusée à eau, d'après la fiche du professeur ===== */
const PROBLEM = "Quel matériel choisir pour que ta fusée à eau décolle bien ?";
const FT = [["Améliorer la pénétration dans l'air (limiter les frottements)", "Coiffe en forme de cône"], ["Contenir l'eau et l'air", "Bouteille en plastique"], ["Éjecter l'eau", "Goulot de la bouteille"], ["Augmenter la pression", "Pompe à vélo (air comprimé)"], ["Résister à la pression", "Plastique épais d'une bouteille de boisson gazeuse"], ["Stabiliser la fusée", "Ailerons"]];
const CONS = `<div class="box warn"><p class="lab">⚠ Consignes de ta fiche</p><ul><li>Par groupes de 2 personnes, avec le matériel de votre choix.</li><li>Respecter les solutions techniques de la fusée à eau, avec des matériaux adéquats.</li><li>Apporter le matériel au cours prochain : la fusée se construit en classe.</li><li>La fusée doit décoller du pas de tir : ne rien mettre sur le goulot de la bouteille.</li><li>Présentation à la classe : travail noté. Élection de la plus belle fusée !</li></ul></div>`;
const bilanHTML = () => `<p><b>Ma fusée à eau</b></p>${tbl(["Ce que la fusée doit faire", "Solution technique"], FT.map(([f, s]) => [nb(f), `<u>${nb(s)}</u>`]))}
<p><b>À apporter au cours prochain</b> (groupe de 2) : une bouteille de boisson gazeuse vide, du carton léger pour la coiffe, du carton rigide ou du plastique pour 3 ou 4 ailerons, du ruban adhésif solide, de quoi décorer.</p>
<p><b>Règles</b> : rien sur le goulot (pas de tir) · ne pas percer la bouteille · remplir d'eau au tiers environ · préparer la présentation à la classe.</p>`;
const rowq = (txt, o, a) => ({ txt, o, a });

const GROUPS = [
{ id: "p1", n: 1, icon: "🧩", tab: "Solutions", title: "Les solutions techniques de la fusée à eau", sub: "Mêmes fonctions que la vraie fusée, autres solutions.",
  items: [
  { id: "a1", lvl: "easy", title: "De la vraie fusée à la fusée à eau",
    intro: `<div class="box info"><p class="lab">ℹ Comment ça marche</p><p>On met de l'eau dans la bouteille, puis on pompe de l'air dedans. L'air comprimé chasse l'eau par le goulot, vers le bas : la fusée part vers le haut. Ici, pas de combustion : c'est l'eau qui est éjectée.</p></div>`,
    parts: [{ t: "match", c: "rais", label: "Relie chaque fonction technique à sa solution sur la fusée à eau.", ask: "Choisis la solution pour", rows: FT.map(([f, s]) => ({ e: "⚙", txt: f, v: s })) }],
    hints: ["Pense à la vraie fusée : coiffe, réservoir, tuyère, moteur, corps, ailerons.", "Le réservoir devient la bouteille. La tuyère devient le goulot.", "Coiffe en cône · bouteille · goulot · pompe à vélo · plastique épais · ailerons."],
    corr: "Coiffe en cône : pénétration dans l'air. Bouteille : contenir l'eau et l'air. Goulot : éjecter l'eau. Pompe à vélo : augmenter la pression. Plastique épais de la bouteille : résister à la pression. Ailerons : stabiliser la fusée." }] },
{ id: "p2", n: 2, icon: "🧰", tab: "Matériel", title: "Choisir un matériel adéquat", sub: "Pour chaque élément, quel matériau convient ?",
  items: [
  { id: "b1", lvl: "mid", title: "Le bon matériau au bon endroit",
    parts: [{ t: "rows", c: "rais", label: "Choisis le matériel adéquat.", choices: null, rows: [
      rowq("Le corps de la fusée (il doit résister à la pression)", ["Bouteille en verre", "Bouteille de boisson gazeuse en plastique", "Brique de lait en carton"], 1),
      rowq("La coiffe (légère et pointue)", ["Cône en carton léger", "Gros caillou pointu", "Pas de coiffe"], 0),
      rowq("Les ailerons (rigides et légers)", ["Mouchoirs en papier", "Plaques de métal lourdes", "Carton rigide ou plastique"], 2),
      rowq("La fixation des éléments", ["Ruban adhésif solide", "Punaises plantées dans la bouteille", "Colle à l'eau"], 0)] }],
    hints: ["Une fusée doit être légère, mais solide.", "La bouteille ne doit jamais être percée : elle doit garder l'air sous pression.", "Bouteille de boisson gazeuse · cône en carton léger · carton rigide ou plastique · ruban adhésif solide."],
    corr: "Une bouteille de boisson gazeuse est prévue pour résister à la pression (le verre est dangereux, le carton éclaterait). La coiffe et les ailerons doivent être légers et rigides : carton ou plastique. On fixe tout au ruban adhésif, sans jamais percer la bouteille." },
  { id: "b2", lvl: "mid", title: "Les consignes à respecter", intro: CONS,
    parts: [
      { t: "choice", c: "lire", label: "Pourquoi ne faut-il rien mettre sur le goulot de la bouteille ?", o: ["Pour que la fusée soit plus jolie", "Parce que le goulot se fixe sur le pas de tir et laisse sortir l'eau", "Parce que le goulot doit rester sec"], a: 1 },
      { t: "choice", c: "lire", label: "Quand faut-il apporter le matériel ?", o: ["Au printemps", "Au cours prochain", "Le jour de l'élection"], a: 1, no: { 0: "Au printemps, c'est le décollage. La construction se fait avant, en classe." } },
      { t: "choice", c: "rais", label: "Tes ailerons dépassent sous le goulot. Quel est le problème ?", o: ["Aucun", "La fusée ne pourra pas se poser sur le pas de tir", "La fusée sera trop légère"], a: 1 }],
    hints: ["Relis les consignes dans l'encadré orange.", "Le pas de tir se branche sur le goulot : il doit rester libre.", "Goulot libre pour le pas de tir · matériel au cours prochain · rien ne doit gêner sous le goulot."],
    corr: "Le goulot sert à fixer la fusée sur le pas de tir et à laisser sortir l'eau : il doit rester libre, et rien ne doit dépasser en dessous. Le matériel est à apporter au cours prochain ; le décollage aura lieu au printemps." }] },
{ id: "p3", n: 3, icon: "🚀", tab: "Essais", title: "Le banc d'essai virtuel", sub: "Combien d'eau ? Avec ou sans coiffe ? Avec ou sans ailerons ?",
  items: [
  { id: "c1", lvl: "mid", title: "Trouver les bons réglages",
    widget: { title: "Simulation · Banc d'essai de la fusée à eau", w: "banc", sim: SIMUL },
    parts: [
      { t: "choice", c: "mod", label: "Avec quelle quantité d'eau la fusée monte-t-elle le plus haut ?", o: ["Bouteille vide", "Bouteille remplie au tiers", "Bouteille remplie aux deux tiers", "Bouteille pleine"], a: 1 },
      { t: "choice", c: "rais", label: "Pourquoi une bouteille vide décolle-t-elle à peine ?", o: ["Elle est trop lourde", "Il n'y a pas d'eau à éjecter", "Il n'y a pas d'air dedans"], a: 1 },
      { t: "choice", c: "mod", label: "Que se passe-t-il sans ailerons ?", o: ["La fusée monte plus haut", "La fusée part de travers", "Rien ne change"], a: 1 },
      { t: "num", c: "mod", label: "Quelle est la plus grande altitude que tu peux atteindre ?", unit: "m", ans: 40, tol: 0.5, err: [[v => v < 40, "Une autre fusée monte plus haut : change encore un réglage."], [v => v === 50, "50 m est le haut de l'échelle. Lis l'altitude affichée après le vol."]] }],
    hints: ["Teste les quatre quantités d'eau, sans rien changer d'autre.", "Regarde le tableau « Mes essais ».", "Le meilleur réglage : un tiers d'eau, avec coiffe, avec ailerons. Altitude : 40 m."],
    corr: "Il faut de l'eau à éjecter, mais aussi de la place pour l'air comprimé : la fusée monte le plus haut avec la bouteille remplie au tiers environ. La coiffe limite les frottements de l'air et les ailerons gardent la fusée droite. Meilleure altitude du simulateur : 40 m." }] },
{ id: "p4", n: 4, icon: "📋", tab: "Prêt ?", title: "Prêt pour la construction ?", sub: "Vérifie ton plan, puis recopie ta liste.",
  items: [
  { id: "d2", lvl: "easy", title: "Mon plan de construction", recop: true, intro: CONS,
    parts: [
      { t: "multi", c: "rais", label: "Que dois-tu apporter au cours prochain ? (4 réponses)", o: ["Une bouteille de boisson gazeuse vide", "Du carton pour la coiffe et les ailerons", "Du ruban adhésif solide", "De quoi décorer la fusée", "Une bouteille en verre", "Des allumettes"], a: [0, 1, 2, 3] },
      { t: "num", c: "lire", label: "Combien de personnes dans ton groupe ?", unit: "personnes", ans: 2 },
      { t: "choice", c: "lire", label: "Sur quoi seras-tu noté ?", o: ["Sur l'altitude atteinte", "Sur la présentation de la fusée à la classe", "Sur le prix du matériel"], a: 1 }],
    hints: ["Rien de dangereux : pas de verre, pas de feu.", "La fusée à eau fonctionne sans combustion.", "Bouteille de boisson gazeuse, carton, ruban adhésif, décoration · groupe de 2 · présentation notée."],
    corr: "À apporter : une bouteille de boisson gazeuse vide, du carton, du ruban adhésif solide et de quoi décorer. Le travail se fait par groupes de 2 et la présentation de la fusée à la classe est notée." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Sur une vraie fusée, quel élément laisse sortir les gaz ?", o: ["La coiffe", "La tuyère", "Les ailerons"], a: 1 },
    { t: "choice", c: "conn", label: "À quoi servent les ailerons ?", o: ["À contenir le carburant", "À stabiliser la fusée", "À produire des gaz"], a: 1 }],
  hints: ["Souviens-toi du schéma de l'activité 4.", "Les gaz sortent tout en bas.", "La tuyère · stabiliser la fusée."],
  corr: "Les gaz sortent par la tuyère, tout en bas. Les ailerons stabilisent la fusée. Ta fusée à eau doit remplir les mêmes fonctions techniques." };
const RESUME = `Mission : ${PROBLEM}

Consignes : groupes de 2 ; matériel adéquat à apporter au cours prochain ; rien sur le goulot (pas de tir) ; présentation notée ; décollage au printemps.

À retenir
${FT.map(([f, s]) => `- ${f} : ${s.toLowerCase()}`).join("\n")}
- À apporter : bouteille de boisson gazeuse vide, carton léger (coiffe), carton rigide ou plastique (ailerons), ruban adhésif solide, décoration.
- Réglage : bouteille remplie d'eau au tiers environ, avec coiffe et ailerons.`;
typo(GROUPS); typo(RAPPEL);
