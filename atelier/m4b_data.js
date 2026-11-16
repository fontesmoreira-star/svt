/* ===== 5e EIST · Révision de la Mission 4 (v2), d'après les activités et TP du professeur ===== */
const PROBLEM = "Comment conserver les vivres de l'équipage pendant le long voyage vers Mars ?";
const gap = `<span class="gap">………</span>`;
const HOME = { slug: "revision-mission-4", short: "Révision · Mission 4", last: "d1", lastG: "p4", lastK: 0,
  kicker: "5e EIST · Mission 4 · Charger des vivres dans la fusée", title: "Entraînement de l'équipage avant le contrôle",
  intro: "Avant le départ, chaque membre d'équipage passe quatre épreuves : le labo de l'eau, le labo des courbes, le labo des micro-organismes et l'épreuve finale. Manipule d'abord, puis réponds.",
  lab: "La question de la mission", goal: "Objectif : réviser toute la Mission 4, puis recopier ta fiche mémo dans ton cahier.",
  fact: "Dans l'espace, les astronautes mangent surtout des aliments déshydratés ou en conserve : ils se gardent des mois sans réfrigérateur.",
  parts: "Les quatre épreuves (environ une heure, en plusieurs fois si tu veux)", recop: "Ma fiche mémo",
  txt: "RÉVISION · MISSION 4 · CHARGER DES VIVRES DANS LA FUSÉE\n5e EIST",
  comps: { conn: "Mobiliser ses connaissances", mod: "Observer, manipuler", lire: "Lire et construire un graphique", rais: "Raisonner, argumenter" } };

const MEMO = ["L'eau existe sous trois états : <u>solide</u> (la glace), <u>liquide</u> et <u>gazeux</u> (la vapeur d'eau, invisible).",
  "On passe d'un état à l'autre en chauffant ou en refroidissant : ce sont les <u>changements d'état</u>. Un glaçon qui fond, c'est une <u>fusion</u> ; de l'eau qui gèle, une <u>solidification</u> ; une flaque qui sèche, une <u>vaporisation</u> ; la buée sur un miroir, une <u>liquéfaction</u>.",
  "Quand l'eau gèle dans une bouteille, elle prend plus de place : la bouteille gonfle.",
  "Pendant un changement d'état de l'eau pure, la température reste constante : sur la courbe, c'est un <u>palier</u> (à 0 °C pour la glace qui fond ou l'eau qui gèle).",
  "Un graphique complet a un <u>titre</u>, deux axes avec leur grandeur et leur unité, et une <u>échelle régulière</u>.",
  "Les <u>micro-organismes</u> sont des êtres vivants visibles seulement au microscope. Ils ont besoin d'eau, de nutriments, de chaleur et, pour la plupart, de dioxygène.",
  "Pour conserver un aliment, on supprime un de leurs besoins (froid, sel ou sucre, mise sous vide) ou on les tue par la chaleur (pasteurisation)."];
const CHECK = ["nommer les changements d'état et dire s'il faut chauffer ou refroidir", "dire ce que deviennent la masse et le volume de l'eau quand elle change d'état", "construire un graphique à partir d'un tableau : échelle régulière, points, titre", "légender une courbe : états de l'eau, changement d'état, palier", "citer des types de micro-organismes et savoir à partir de quand un plat devient dangereux", "mener une enquête alimentaire et rédiger une explication"];
const bilanHTML = () => `<ul>${MEMO.map(x => `<li>${nb(x)}</li>`).join("")}</ul><p class="lab">Je vérifie que je sais…</p><ul class="chk">${CHECK.map(x => `<li>☐ ${nb(x)}</li>`).join("")}</ul>`;
const FUS = [[0, -15], [1, -10], [2, -5], [3, 0], [4, 0], [5, 0], [6, 0], [7, 5], [8, 10], [9, 15]];
const CH4 = ["Fusion", "Solidification", "Vaporisation", "Liquéfaction"];

const GROUPS = [
{ id: "p1", n: 1, icon: "💧", tab: "Labo de l'eau", title: "Épreuve 1 · Le labo de l'eau", sub: "Les états de l'eau, les changements d'état, la masse et le volume.",
  items: [
  { id: "a1", lvl: "easy", title: "Les particules d'eau",
    widget: { title: "Simulation · L'eau au microscope… imaginaire", w: "particules", sim: "Modèle simplifié" },
    parts: [
      { t: "rows", c: "mod", label: "Utilise la simulation. Dans quel état est l'eau pure ?", choices: ["Solide", "Liquide", "Gazeux"], rows: [{ txt: "À −15 °C", a: 0 }, { txt: "À 40 °C", a: 1 }, { txt: "À 115 °C", a: 2 }] },
      { t: "match", c: "conn", label: "Relie chaque description à l'état de l'eau.", ask: "Choisis l'état pour", rows: [{ e: "🧊", txt: "Particules rangées et serrées, qui vibrent sur place", v: "État solide" }, { e: "💧", txt: "Particules serrées mais en désordre, qui glissent", v: "État liquide" }, { e: "♨", txt: "Particules très éloignées, qui bougent dans tous les sens", v: "État gazeux" }] }],
    hints: ["Déplace le curseur de température et lis le texte sous le dessin.", "Plus il fait chaud, plus les particules bougent et s'éloignent.", "−15 °C : solide · 40 °C : liquide · 115 °C : gazeux."],
    corr: "À −15 °C, l'eau est solide : ses particules sont rangées et serrées. À 40 °C, elle est liquide : particules serrées mais en désordre. À 115 °C, elle est gazeuse : particules très éloignées, qui bougent dans tous les sens." },
  { id: "a2", lvl: "mid", title: "Les changements d'état autour de nous",
    widget: { title: "Animations · Quatre scènes de la vie quotidienne", w: "scenes" },
    parts: [
      { t: "match", c: "conn", label: "Quel changement d'état se produit dans chaque scène ?", ask: "Choisis le changement d'état de", rows: [{ e: "1", txt: "Scène 1 · Le glaçon au soleil", v: CH4[0] }, { e: "2", txt: "Scène 4 · Le bac à glaçons", v: CH4[1] }, { e: "3", txt: "Scène 2 · La flaque au soleil", v: CH4[2] }, { e: "4", txt: "Scène 3 · Le miroir de la salle de bains", v: CH4[3] }] },
      { t: "rows", c: "conn", label: "Pour provoquer ce changement d'état, faut-il chauffer ou refroidir ?", choices: ["Chauffer", "Refroidir"], rows: [{ txt: "Fusion", a: 0 }, { txt: "Solidification", a: 1 }, { txt: "Vaporisation", a: 0 }, { txt: "Liquéfaction", a: 1 }] }],
    hints: ["Pour chaque scène, demande-toi : de quel état part l'eau, et dans quel état arrive-t-elle ?", "Solide → liquide : fusion. Liquide → solide : solidification. Liquide → gaz : vaporisation. Gaz → liquide : liquéfaction.", "Glaçon : fusion · bac à glaçons : solidification · flaque : vaporisation · miroir : liquéfaction (la vapeur de la douche redevient liquide sur le miroir froid)."],
    corr: "Le glaçon qui fond : fusion (on chauffe). L'eau du bac qui gèle : solidification (on refroidit). La flaque qui sèche : vaporisation (on chauffe). La buée sur le miroir : liquéfaction, la vapeur d'eau redevient liquide au contact du miroir froid (on refroidit)." },
  { id: "a3", lvl: "mid", title: "Deux expériences : la balance et la bouteille",
    widget: { title: "Expériences virtuelles · Masse et volume", w: "masse", sim: "Valeurs simulées" },
    parts: [
      { t: "choice", c: "mod", label: "Expérience A : pendant que le glaçon fond dans le bocal fermé, l'écran de la balance…", o: ["affiche toujours le même nombre", "affiche un nombre de plus en plus grand", "affiche un nombre de plus en plus petit"], a: 0 },
      { t: "choice", c: "rais", label: "Pourquoi le bocal doit-il être fermé pour que l'expérience soit juste ?", o: ["Pour que rien ne puisse entrer ni sortir du bocal", "Pour que la glace fonde plus vite", "Pour que la balance fonctionne"], a: 0 },
      { t: "choice", c: "mod", label: "Expérience B : quand l'eau de la bouteille devient de la glace, elle…", o: ["dépasse le trait rouge : elle prend plus de place", "reste au niveau du trait rouge", "descend sous le trait rouge"], a: 0 },
      { t: "choice", c: "rais", label: "Pourquoi ne faut-il pas remplir à ras bord une bouteille que l'on met au congélateur ?", o: ["Elle pourrait éclater, car la glace prend plus de place que l'eau liquide", "L'eau ne gèlerait pas", "La bouteille deviendrait plus lourde"], a: 0, no: { 2: "Regarde la balance de l'expérience B : le nombre change-t-il ?" } }],
    hints: ["Lance les deux expériences et regarde bien l'écran des balances et le trait rouge.", "Si le bocal était ouvert, de la vapeur d'eau pourrait s'échapper.", "A : toujours le même nombre ; il faut que rien n'entre ni ne sorte. B : la glace dépasse le trait, la bouteille peut éclater."],
    corr: "Dans le bocal fermé, la balance affiche toujours le même nombre pendant que la glace fond. Dans la bouteille, la glace dépasse le trait rouge : en gelant, l'eau prend plus de place, ce qui peut faire éclater une bouteille trop pleine." }] },

{ id: "p2", n: 2, icon: "📈", tab: "Labo des courbes", title: "Épreuve 2 · Le labo des courbes", sub: "Mesurer, construire un graphique, repérer un palier.",
  items: [
  { id: "b1", lvl: "mid", title: "TP virtuel · L'eau qui gèle",
    widget: { title: "TP virtuel · Refroidir de l'eau pure", w: "tpgel", sim: "Valeurs simulées" },
    parts: [
      { t: "num", c: "lire", label: "Lance le TP. À quelle température l'eau pure se transforme-t-elle en glace ?", unit: "°C", ans: 0 },
      { t: "num", c: "lire", label: "Pendant combien de minutes la température reste-t-elle constante ?", unit: "min", ans: 4, err: [[v => v === 5, "Compte la durée entre la première et la dernière mesure à 0 °C, pas le nombre de mesures."], [v => v === 8, "8 min, c'est le moment où le palier se termine. On demande sa durée."]] },
      { t: "rows", c: "lire", label: "Dans quel état est l'eau du tube ?", choices: ["Liquide", "Liquide et solide", "Solide"], rows: [{ txt: "À 2 min", a: 0 }, { txt: "À 6 min", a: 1 }, { txt: "À 11 min", a: 2 }] },
      { t: "word", c: "conn", label: `Le passage de l'état liquide à l'état solide s'appelle la ${gap}.`, ans: ["solidification"], spell: true, err: [[["fusion"], "La fusion, c'est l'inverse : du solide vers le liquide."], [["congélation"], "C'est le mot de la vie courante. Le mot scientifique est attendu."]] }],
    hints: ["Touche le graphique pour lire chaque mesure. Le tableau se remplit aussi minute par minute.", "La partie horizontale de la courbe s'appelle un palier.", "0 °C · palier de 4 à 8 min, soit 4 min · liquide, liquide et solide, solide · solidification."],
    corr: "La température descend jusqu'à 0 °C, reste constante de 4 à 8 minutes (palier de 4 minutes) pendant que l'eau se transforme en glace, puis redescend. Pendant le palier, l'eau est à la fois liquide et solide : c'est la solidification." },
  { id: "b2", lvl: "hard", title: "Construire et légender un graphique",
    intro: "On réchauffe de la glace sortie du congélateur. Le tableau donne les mesures.",
    parts: [
      { t: "choice", c: "lire", label: "Sur l'axe des températures, quelle graduation est correcte ?", o: ["−20 ; −15 ; −10 ; −5 ; 0 ; 5 ; 10 ; 15 ; 20", "−20 ; −10 ; −5 ; 0 ; 10 ; 15 ; 20", "0 ; 5 ; 10 ; 20 ; 40"], a: 0, no: { 1: "Les écarts ne sont pas tous égaux : une échelle doit être régulière.", 2: "Les températures négatives du tableau ne pourraient pas être placées, et l'échelle n'est pas régulière." } },
      { t: "plot", c: "lire", label: "Place les dix points du tableau.", pts: FUS, xMax: 9, yMin: -20, yMax: 20, snap: 5, xName: "Temps (min)", yName: "Température (°C)", xTitle: "Temps (min)", yTitle: "Température (°C)" },
      { t: "choice", c: "lire", label: "Quel titre convient à ce graphique ?", o: ["Évolution de la température de la glace en fonction du temps", "Évolution du temps en fonction de la glace", "La glace"], a: 0 },
      { t: "rows", c: "lire", label: "Légende ta courbe : que se passe-t-il ?", choices: ["Glace (solide) qui se réchauffe", "Palier : fusion (solide + liquide)", "Eau liquide qui se réchauffe"], rows: [{ txt: "De 0 à 3 min", a: 0 }, { txt: "De 3 à 6 min", a: 1 }, { txt: "De 6 à 9 min", a: 2 }] }],
    hints: ["Une échelle régulière : on ajoute toujours la même valeur d'une graduation à la suivante.", "Pour chaque colonne du tableau, repère le temps en bas, puis monte jusqu'à la bonne température. Les températures négatives sont sous le zéro.", "Le titre dit ce qui est mesuré (la température de la glace) en fonction de quoi (le temps). Le palier est à 0 °C, de 3 à 6 min."],
    corr: "L'échelle doit être régulière (de 5 en 5). Les points dessinent une montée, un palier à 0 °C de 3 à 6 minutes, puis une nouvelle montée. Titre : évolution de la température de la glace en fonction du temps. Avant le palier, la glace (solide) se réchauffe ; pendant le palier, elle fond (fusion) ; après, l'eau liquide se réchauffe.",
    unlock: { title: "🔓 Animation débloquée · Pourquoi un palier ?", w: "palier", sim: "Modèle simplifié" } }] },

{ id: "p3", n: 3, icon: "🦠", tab: "Labo des microbes", title: "Épreuve 3 · Le labo des micro-organismes", sub: "Les observer, comprendre leur multiplication, s'en protéger, enquêter.",
  items: [
  { id: "c1", lvl: "easy", title: "Au microscope",
    widget: { title: "Microscope virtuel", w: "micro", sim: "Images dessinées" },
    parts: [
      { t: "task", c: "mod", label: "Obtiens une image nette des trois lames au grossissement × 400.", okMsg: "Trois lames observées.", done: () => { const n = Object.keys(xst().mic || {}).length; return { ok: n >= 3, msg: `${n}/3 lames observées nettes à × 400.` }; } },
      { t: "rows", c: "mod", label: "Qu'observe-t-on sur chaque lame ?", choices: ["Des bactéries", "Des levures", "Une moisissure"], rows: [{ txt: "Lame 1 · yaourt (petits bâtonnets en chaînettes)", a: 0 }, { txt: "Lame 2 · levure de boulanger (cellules ovales qui bourgeonnent)", a: 1 }, { txt: "Lame 3 · pain moisi (longs filaments et boules de spores)", a: 2 }] },
      { t: "choice", c: "conn", label: "Pourquoi les appelle-t-on des micro-organismes ?", o: ["Ce sont des êtres vivants si petits qu'on ne les voit qu'au microscope", "Ce sont des objets fabriqués en laboratoire", "Ce sont des poussières"], a: 0 }],
    hints: ["Tourne la vis de mise au point lentement : l'image devient nette d'un seul coup.", "Les levures et les moisissures sont des champignons ; les bactéries sont beaucoup plus petites.", "Yaourt : bactéries · levure : levures · pain moisi : moisissure."],
    corr: "Le yaourt contient des bactéries (petits bâtonnets), la levure de boulanger est faite de levures (cellules ovales qui bourgeonnent) et le pain moisi porte une moisissure (filaments et spores). Ce sont des êtres vivants microscopiques : des micro-organismes." },
  { id: "c2", lvl: "mid", title: "La boîte de Petri",
    widget: { title: "Simulation · Une bactérie dans un aliment", w: "petri", sim: "Valeurs simulées" },
    parts: [
      { t: "num", c: "rais", label: "Sur la table (25 °C), combien de bactéries y a-t-il au bout d'une heure, à partir d'une seule ?", unit: "bactéries", ans: 8, err: [[v => v === 3, "3, c'est le nombre de divisions en une heure. Chaque division double le nombre de bactéries : 1 → 2 → 4 → …"], [v => v === 6, "Le nombre ne s'ajoute pas : il double toutes les 20 minutes."]] },
      { t: "num", c: "rais", label: "Et au bout de 2 heures ?", unit: "bactéries", ans: 64, err: [[v => v === 16, "16, c'est le double de 8. Mais en une heure de plus, il y a 3 nouvelles divisions."], [v => v === 6, "6, c'est le nombre de divisions en 2 heures."]] },
      { t: "choice", c: "mod", label: "Au réfrigérateur, les bactéries…", o: ["se multiplient beaucoup plus lentement", "meurent toutes", "se multiplient plus vite"], a: 0 },
      { t: "choice", c: "mod", label: "Au congélateur, les bactéries…", o: ["ne se multiplient plus, mais ne sont pas toutes mortes", "sont toutes tuées", "se multiplient lentement"], a: 0, no: { 1: "Regarde le texte de la simulation : le froid arrête la multiplication, il ne tue pas." } }],
    hints: ["Lance la simulation sur la table et lis le compteur toutes les 20 minutes.", "En 1 heure, il y a 3 divisions : 1 → 2 → 4 → 8.", "1 h : 8 bactéries · 2 h : 6 divisions, 64 bactéries · réfrigérateur : plus lent · congélateur : arrêt."],
    corr: "À 25 °C, le nombre de bactéries double toutes les 20 minutes : 1 → 2 → 4 → 8 en une heure, 64 en deux heures. Au réfrigérateur, la multiplication est beaucoup plus lente ; au congélateur, elle s'arrête, mais les bactéries ne sont pas toutes mortes." },
  { id: "c3", lvl: "mid", title: "Le bouclier anti-microbes",
    widget: { title: "Simulation · Les besoins des micro-organismes", w: "bouclier", sim: "Modèle simplifié" },
    parts: [
      { t: "match", c: "conn", label: "Que supprime chaque technique de conservation ?", ask: "Choisis l'effet de", rows: [{ e: "🧊", txt: "Réfrigérateur", v: "La chaleur" }, { e: "❄", txt: "Congélateur", v: "La chaleur et l'eau liquide" }, { e: "🔥", txt: "Pasteurisation", v: "Les micro-organismes (tués par la chaleur)" }, { e: "🧂", txt: "Sel ou sucre", v: "L'eau disponible" }, { e: "📦", txt: "Mise sous vide", v: "Le dioxygène" }] },
      { t: "choice", c: "rais", label: "Pour ralentir le développement des micro-organismes dans un aliment, il suffit de…", o: ["supprimer un de leurs besoins", "laver l'aliment à l'eau froide", "ajouter des nutriments"], a: 0 }],
    hints: ["Choisis chaque technique dans la simulation : le besoin supprimé est barré.", "Les quatre besoins : eau, nutriments, chaleur, dioxygène.", "Réfrigérateur : chaleur · congélateur : chaleur et eau liquide · pasteurisation : tue · sel ou sucre : eau · sous vide : dioxygène."],
    corr: "Les micro-organismes ont besoin d'eau, de nutriments, de chaleur et, pour la plupart, de dioxygène. Le réfrigérateur supprime la chaleur ; le congélateur, la chaleur et l'eau liquide ; le sel et le sucre rendent l'eau indisponible ; la mise sous vide supprime le dioxygène ; la pasteurisation tue la plupart des micro-organismes par la chaleur." },
  { id: "c4", lvl: "hard", title: "Enquête · Le pique-nique de Léo",
    widget: { title: "Enquête · Les aliments du pique-nique", w: "piquenique" },
    parts: [
      { t: "task", c: "mod", label: "Inspecte les six aliments du pique-nique.", okMsg: "Les six aliments sont inspectés.", done: () => { const n = Object.keys(xst().pic || {}).length; return { ok: n >= 6, msg: `${n}/6 aliments inspectés.` }; } },
      { t: "multi", c: "rais", label: "Quels aliments ont pu rendre Léo malade ? (plusieurs réponses)", o: ["Le poulet rôti", "Les yaourts", "La mayonnaise maison", "La confiture", "Le jus de fruits pasteurisé", "Le pain"], a: [0, 2] },
      { t: "choice", c: "rais", label: "Pourquoi ces aliments sont-ils dangereux ?", o: ["Restés longtemps au chaud, les micro-organismes ont eu le temps de s'y multiplier énormément", "Ils étaient trop sucrés", "Ils avaient été pasteurisés"], a: 0 },
      { t: "choice", c: "rais", label: "Qu'aurait dû faire Léo ?", o: ["Garder ces aliments au froid, dans la glacière, jusqu'au repas", "Les laisser au soleil pour les réchauffer", "Ajouter du sel sur le poulet au moment du repas"], a: 0 }],
    hints: ["Repère les aliments restés longtemps à une température élevée.", "La glacière, le sucre et la pasteurisation protègent les aliments.", "Poulet et mayonnaise : plusieurs heures à 32 °C, les bactéries se sont multipliées. Il fallait les garder au froid."],
    corr: "Le poulet et la mayonnaise sont restés plusieurs heures au soleil, à 32 °C : les micro-organismes ont eu le temps de s'y multiplier énormément. Les yaourts (glacière), la confiture (sucre), le jus (pasteurisé, fermé) et le pain sec sont protégés. Il fallait garder ces aliments au froid jusqu'au repas." }] },

{ id: "p4", n: 4, icon: "🚀", tab: "Épreuve finale", title: "Épreuve 4 · Prêt pour le décollage ?", sub: "Des situations nouvelles, puis ta fiche mémo à recopier.",
  items: [
  { id: "d1", lvl: "hard", title: "L'épreuve finale de l'équipage", recop: true,
    intro: "Journal de bord : la fusée est en route vers Mars. Aide l'équipage à résoudre ces petits problèmes.",
    parts: [
      { t: "choice", c: "rais", label: "Une bouteille d'eau pleine à ras bord est oubliée dans un module où il fait −30 °C. Que risque-t-il de se passer ?", o: ["L'eau gèle, prend plus de place et la bouteille peut éclater", "L'eau s'évapore entièrement", "Rien : l'eau ne gèle pas dans l'espace"], a: 0 },
      { t: "word", c: "conn", label: `En sortant du module froid, la visière du casque se couvre de buée : la vapeur d'eau de l'air devient liquide. C'est une ${gap}.`, ans: ["liquéfaction", "liquefaction", "condensation"], err: [[["vaporisation"], "C'est l'inverse : la vaporisation fait passer du liquide au gaz."], [["solidification", "fusion"], "Ici, l'eau passe de l'état gazeux à l'état liquide."]] },
      { t: "num", c: "rais", label: "Un repas réhydraté est oublié 1 h 40 min à 25 °C. Il contenait une bactérie. Combien en contient-il maintenant ?", unit: "bactéries", ans: 32, err: [[v => v === 5, "5, c'est le nombre de divisions. Le nombre de bactéries double à chaque division."], [v => v === 64, "Compte les divisions : 1 h 40 min = 100 min = 5 fois 20 minutes."]] },
      { t: "choice", c: "rais", label: "Quels vivres emporter pour un voyage de plusieurs mois sans réfrigérateur ?", o: ["Des aliments déshydratés ou en conserve", "Des yaourts et de la viande fraîche", "Des fruits frais coupés"], a: 0 }],
    hints: ["Pense aux expériences de l'épreuve 1, puis à la boîte de Petri.", "Gaz → liquide : liquéfaction. 1 h 40 min = 100 min = 5 divisions de 20 minutes.", "Bouteille qui éclate · liquéfaction · 2 × 2 × 2 × 2 × 2 = 32 bactéries · aliments déshydratés ou en conserve."],
    corr: "L'eau qui gèle prend plus de place : la bouteille peut éclater. La buée est une liquéfaction. En 100 minutes, il y a 5 divisions : 32 bactéries. Pour un long voyage sans froid, on emporte des aliments déshydratés (sans eau) ou en conserve (chauffés puis fermés). Ta fiche mémo s'affiche ci-dessous : recopie-la dans ton cahier." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Lequel de ces mots n'est pas un état de l'eau ?", o: ["Solide", "Liquide", "Gazeux", "Bouillant"], a: 3 },
    { t: "choice", c: "conn", label: "Un micro-organisme est…", o: ["un être vivant visible seulement au microscope", "un petit insecte", "une poussière"], a: 0 },
    { t: "choice", c: "conn", label: "Pourquoi range-t-on les yaourts au réfrigérateur ?", o: ["Pour ralentir la multiplication des micro-organismes", "Pour tuer tous les micro-organismes", "Pour qu'ils soient plus sucrés"], a: 0 }],
  hints: ["Les trois états : un pour la glace, un pour l'eau, un pour la vapeur.", "« Micro » signifie très petit.", "Bouillant · être vivant microscopique · ralentir."],
  corr: "L'eau existe sous trois états : solide, liquide et gazeux. Un micro-organisme est un être vivant visible seulement au microscope. Le froid du réfrigérateur ralentit leur multiplication." };
const RESUME = `La question de la mission : ${PROBLEM}\n\nMa fiche mémo\n${MEMO.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}\n\nJe vérifie que je sais…\n${CHECK.map(x => "- " + x).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
