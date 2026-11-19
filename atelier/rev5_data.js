/* ===== 5e EIST · Révision de la Mission 5 · Le décollage de la fusée, d'après les activités 1 à 6 du professeur ===== */
const PROBLEM = "Quels sont les effets du décollage sur l'organisme, et comment décrire le mouvement de la fusée ?";
const gap = `<span class="gap">………</span>`;
const HOME = { slug: "revision-mission-5", short: "Révision · Mission 5", last: "f1", lastG: "p6", lastK: 0, dur: "environ 1 h 15 (tu peux la faire en plusieurs fois)",
  kicker: "5e EIST · Mission 5 · Le décollage de la fusée", title: "La check-list avant le décollage",
  intro: "Avant de partir pour Mars, l'équipage vérifie tout : le corps des astronautes, le mouvement de la fusée, sa construction et le ciel. Chaque partie réussie te donne un chiffre du code de lancement.",
  lab: "La question de la mission", goal: "Objectif : réviser toute la Mission 5, puis recopier ta fiche mémo dans ton cahier.",
  fact: "Au décollage, les astronautes sont allongés sur le dos : l'accélération pousse alors le sang vers le dos et non vers les pieds, et le cerveau reste mieux irrigué.",
  parts: "Les six parties de la check-list", recop: "Ma fiche mémo",
  txt: "RÉVISION · MISSION 5 · LE DÉCOLLAGE DE LA FUSÉE\n5e EIST",
  comps: { conn: "Mobiliser ses connaissances", lire: "Lire un document, un graphique", mod: "Observer, manipuler", calc: "Calculer, convertir", rais: "Raisonner, argumenter" },
  extraTitle: "Mon décollage", extraLabel: "l'état de ton décollage", extra: () => `Code de lancement : ${xst().launched ? "trouvé, la fusée a décollé" : "pas encore trouvé"}\n`,
  extraHTML: () => xst().launched ? `<p>🚀 ${nb("Code de lancement trouvé : ta fusée est partie pour Mars !")}</p>` : `<p class="locked">🔑 Code de lancement pas encore trouvé : termine les parties 1 à 5 et tape le code sur le pupitre de l'accueil.</p>` };
HOME.groupFoot = codeFoot; HOME.homeHTML = pupitreHTML;

const MEMO = ["Au décollage, la vitesse de la fusée augmente très vite : l'<u>accélération</u> est élevée. Elle se mesure en <u>g</u> (1 g au sol, 3 à 4 g au décollage).",
  "Une forte accélération perturbe le <u>cœur</u>, les <u>muscles</u> et le <u>cerveau</u> : le sang circule mal et ces organes sont mal <u>irrigués</u> (voile gris, puis perte de connaissance vers 6 g).",
  "Le sang apporte aux organes du <u>dioxygène</u> et du <u>glucose</u> : ils servent à produire l'<u>énergie</u> dont l'organe a besoin pour fonctionner. L'organe rejette du <u>dioxyde de carbone</u> dans le sang.",
  "L'entraînement en centrifugeuse rend les systèmes <u>circulatoire</u> et <u>musculaire</u> plus efficaces : le cœur réagit plus vite et limite les effets de l'accélération.",
  "Un mouvement se décrit par rapport à un <u>référentiel</u> : assis dans la fusée, l'astronaute est immobile par rapport à la fusée, mais en mouvement par rapport au sol.",
  "La vitesse : <u>v = d ÷ t</u> (v en m/s, d en m, t en s). On utilise aussi les km/h : vitesse en m/s × 3,6 = vitesse en km/h.",
  "Positions relevées à intervalles de temps égaux : points de plus en plus écartés → la vitesse augmente, mouvement <u>accéléré</u> ; points également espacés → vitesse constante, mouvement <u>uniforme</u> ; points de plus en plus rapprochés → la vitesse diminue, mouvement <u>ralenti</u>.",
  "Un objet technique répond à un besoin : c'est sa <u>fonction d'usage</u>. Il remplit des <u>fonctions techniques</u>, réalisées par des <u>solutions techniques</u> (stabiliser la fusée → les ailerons).",
  "La Lune est un <u>objet diffusant</u> : le Soleil en éclaire toujours une moitié. Selon sa position autour de la Terre (un tour en 28 jours environ), on voit plus ou moins cette moitié : ce sont les <u>phases de la Lune</u>."];
const CHECK = ["relier une accélération à ses effets sur le corps à l'aide d'un tableau", "comparer le sang qui entre dans un organe et celui qui en sort, puis dire ce que l'organe consomme et rejette", "expliquer pourquoi un astronaute peut perdre connaissance : je vois, je sais, j'en conclus", "dire si un objet est immobile ou en mouvement selon le référentiel choisi", "calculer une vitesse, une distance ou une durée, et convertir des m/s en km/h", "reconnaître un mouvement accéléré, uniforme ou ralenti sur des points, un tableau ou un graphique", "distinguer fonction d'usage, fonction technique et solution technique", "nommer les phases de la Lune et les expliquer"];
const bilanHTML = () => `<ul>${MEMO.map(x => `<li>${nb(x)}</li>`).join("")}</ul><p class="lab">Je vérifie que je sais…</p><ul class="chk">${CHECK.map(x => `<li>☐ ${nb(x)}</li>`).join("")}</ul>`;

const T3 = ["Accéléré", "Uniforme", "Ralenti"];
const DOC1 = { title: "Document 1 · Les effets de l'accélération chez une personne non entraînée", html: tbl(["Accélération", "Situation", "Muscles", "Circulation du sang"], [["1 g", "Au sol, sur Terre", "Mouvements normaux", "Normale dans les organes"], ["3 g / 4 g", "Décollage d'une fusée", "Difficultés à bouger", "Léger manque de sang dans le cerveau : voile gris"], ["5 g", "Luge (record)", "Impossible de relever la tête", "Manque de sang dans le cerveau : perte de la vision"], ["6 g", "Formule 1", "Aucun muscle ne peut bouger", "Plus de sang dans le cerveau : perte de connaissance"]]) + `<p class="cap">${nb("Lors d'une forte accélération, le cœur a du mal à pomper le sang. Au retour sur Terre, l'accélération peut monter jusqu'à 9 g en cas de problème.")}</p>` };
const DIAL = `<div class="box info"><p class="lab">ℹ Le débat de l'équipage</p><p><b>Anatole</b> : « Thomas Pesquet est attaché à son siège pendant le décollage. Il ne bouge pas. »</p><p><b>Ingrid</b> : « Mais si, il bouge ! Il part dans l'espace, et la fusée peut atteindre 7,9 km/s. »</p></div>`;
const FORM = `<div class="box key"><p class="lab">✔ Les trois écritures de la formule</p><p>v = d ÷ t · t = d ÷ v · d = v × t</p></div>`;
const tab = (n, v) => `<div><span class="tn">Tableau ${n}</span>${tbl(["t (s)", "0", "10", "20", "30", "40"], [["v (m/s)", ...v]])}</div>`;
const DOC_TABS = { title: "Document · Vitesses de trois objets relevées toutes les 10 secondes", sim: "Valeurs simulées", html: `<div class="tabs3">${tab(1, [12, 12, 12, 12, 12])}${tab(2, [40, 32, 20, 9, 0])}${tab(3, [0, 5, 15, 30, 50])}</div>` };
const DOC_DIST = { title: "Document · Distances parcourues par deux robots, chaque seconde", sim: "Valeurs simulées", html: tbl(["Seconde", "1re", "2e", "3e", "4e"], [["Robot X (cm)", "9", "7", "5", "3"], ["Robot Y (cm)", "3", "3", "3", "3"]]) };
const FT = [["Améliorer la pénétration dans l'air (limiter les frottements)", "Coiffe"], ["Contenir le carburant", "Réservoir"], ["Éjecter les gaz de combustion", "Tuyère"], ["Produire des gaz par combustion", "Chambre de combustion"], ["Résister à la pression des gaz", "Corps (structure)"], ["Stabiliser la fusée et corriger sa trajectoire", "Ailerons"]];
const PH4 = ["Nouvelle lune", "Premier quartier", "Pleine lune", "Dernier quartier"];

const GROUPS = [
{ id: "p1", n: 1, icon: "🩺", tab: "Médecin de bord", title: "Partie 1 · Le médecin de bord", sub: "SVT · Les effets de l'accélération sur le corps et les échanges entre le sang et les organes.",
  items: [
  { id: "a1", lvl: "easy", title: "Dans la centrifugeuse",
    widget: { title: "Simulation · La centrifugeuse", w: "centri", sim: "Modèle simplifié" }, docs: [DOC1],
    parts: [
      { t: "task", c: "mod", label: "Teste les six accélérations, de 1 g à 6 g.", okMsg: "Les six accélérations sont testées.", done: () => { const n = Object.keys(xst().gseen || {}).length; return { ok: n >= 6, msg: `${n}/6 accélérations testées.` }; } },
      { t: "rows", c: "lire", label: "D'après le document 1, que se passe-t-il chez une personne non entraînée ?", choices: ["Rien de particulier", "Difficultés à bouger, voile gris", "Perte de la vision", "Perte de connaissance"], rows: [{ txt: "À 1 g", a: 0 }, { txt: "À 3 g / 4 g", a: 1 }, { txt: "À 5 g", a: 2 }, { txt: "À 6 g", a: 3 }] },
      { t: "multi", c: "conn", label: "Quels organes sont perturbés par une forte accélération ? (3 réponses)", o: ["Le cœur", "Les muscles", "Le cerveau", "L'estomac", "Les os"], a: [0, 1, 2] },
      { t: "word", c: "conn", label: `Au décollage, la vitesse de la fusée augmente très vite : on parle d'une forte ${gap}.`, ans: ["accélération", "acceleration"], spell: true, err: [[["vitesse"], "La vitesse augmente, oui : mais quand elle augmente très vite, on parle d'un autre mot."], [["gravité", "gravite"], "Le « g » vient de la gravité, mais le mot attendu décrit l'augmentation rapide de la vitesse."]] }],
    hints: ["Fais glisser le curseur jusqu'à 6 g et regarde le hublot et la colonne de sang. Puis lis le tableau ligne par ligne.", "Le tableau parle des muscles et du cerveau ; le texte dessous explique que le cœur a du mal à pomper le sang.", "1 g : rien · 3 g/4 g : difficultés à bouger, voile gris · 5 g : perte de la vision · 6 g : perte de connaissance. Organes : cœur, muscles, cerveau. Mot : accélération."],
    corr: "Plus l'accélération est forte, moins le sang monte jusqu'au cerveau : voile gris au décollage (3 g/4 g), perte de la vision à 5 g, perte de connaissance à 6 g. Les organes perturbés sont le cœur (qui a du mal à pomper le sang), les muscles et le cerveau. Quand la vitesse augmente très vite, l'accélération est élevée : elle se mesure en g." },
  { id: "a2", lvl: "mid", title: "Au labo : le sang du cerveau",
    widget: { title: "Laboratoire · Prélèvements de sang", w: "sang" },
    intro: `<div class="box key"><p class="lab">✔ Point méthode · Faire une comparaison</p><p>${nb("J'utilise « plus… que… », « moins… que… » ou « autant… que… ». Ce qui diminue entre l'entrée et la sortie a été consommé par l'organe ; ce qui augmente a été rejeté.")}</p></div>`,
    parts: [
      { t: "task", c: "mod", label: "Fais les deux prélèvements.", okMsg: "Les deux prélèvements sont analysés.", done: () => { const s = xst().sy || {}; const n = (s.in ? 1 : 0) + (s.out ? 1 : 0); return { ok: n === 2, msg: `${n}/2 prélèvements analysés.` }; } },
      { t: "rows", c: "lire", label: "Complète la comparaison : « Il y a … de cette substance dans le sang sortant que dans le sang entrant. »", choices: ["plus", "moins", "autant"], rows: [{ txt: "Dioxygène", a: 1 }, { txt: "Glucose", a: 1 }, { txt: "Dioxyde de carbone", a: 0 }] },
      { t: "rows", c: "rais", label: "Qu'en déduis-tu ? Le cerveau…", choices: ["la consomme", "la rejette"], rows: [{ txt: "Dioxygène", a: 0 }, { txt: "Glucose", a: 0 }, { txt: "Dioxyde de carbone", a: 1 }] },
      { t: "num", c: "calc", label: "Quelle quantité de dioxygène le cerveau a-t-il prélevée dans 100 mL de sang ?", unit: "mL", ans: 8, err: [[v => v === 32, "Tu as additionné. Le cerveau a prélevé la différence entre l'entrée et la sortie : entrant − sortant."], [v => v === 12 || v === 20, "C'est une valeur du tableau. Calcule la différence entre le sang entrant et le sang sortant."], [v => v === -8, "Le cerveau prélève : la quantité est positive. Fais entrant − sortant."]] }],
    hints: ["Touche les deux seringues : les deux colonnes du tableau se remplissent.", "Dioxygène : 20 mL à l'entrée, 12 mL à la sortie. Il y en a donc moins à la sortie. Ce qui diminue est consommé.", "Moins, moins, plus · consomme, consomme, rejette · 20 − 12 = 8 mL."],
    corr: "Il y a moins de dioxygène (12 mL contre 20 mL) et moins de glucose (80 mg contre 90 mg) dans le sang sortant que dans le sang entrant : le cerveau consomme du dioxygène (8 mL prélevés) et du glucose (10 mg). Il y a plus de dioxyde de carbone dans le sang sortant (57 mL contre 49 mL) : le cerveau rejette du dioxyde de carbone." },
  { id: "a3", lvl: "mid", title: "Le schéma des échanges et le raisonnement",
    live: "schema", liveTitle: "Mon schéma · Échanges entre le sang et le cerveau (il se dessine avec tes réponses)",
    parts: [
      { t: "rows", c: "conn", label: "Pour chaque élément, indique ce qui se passe.", choices: ["Entre dans le cerveau", "Sort du cerveau", "Produite et utilisée dans le cerveau"], rows: [{ txt: "Dioxygène", a: 0 }, { txt: "Glucose", a: 0 }, { txt: "Dioxyde de carbone", a: 1 }, { txt: "Énergie", a: 2 }] },
      { t: "order", c: "rais", label: "Remets le raisonnement dans l'ordre : je vois → je sais → j'en conclus. Pourquoi un astronaute non entraîné perd-il connaissance à 6 g ?", txt: ["À 6 g, le sang ne circule presque plus jusqu'au cerveau (document 1).", "Le cerveau a besoin du dioxygène et du glucose apportés par le sang pour produire son énergie.", "Mal irrigué, le cerveau manque de dioxygène et de glucose : l'astronaute perd connaissance."] },
      { t: "choice", c: "conn", label: "Pendant une forte accélération, le corps de l'astronaute…", o: ["garde tout son sang, mais le sang arrive mal au cerveau", "perd une partie de son sang", "fabrique moins de sang"], a: 0, no: { 1: "Erreur fréquente : le sang ne quitte pas le corps. Il est toujours là, mais il circule mal." } }],
    hints: ["Reprends l'étape 2 : ce que le cerveau consomme entre dans le cerveau ; ce qu'il rejette en sort.", "L'énergie ne voyage pas dans le sang : elle est produite dans l'organe, à partir du dioxygène et du glucose. Pour l'ordre : d'abord le document, puis la connaissance, enfin la conclusion.", "Dioxygène et glucose : entrent · dioxyde de carbone : sort · énergie : produite et utilisée. Ordre : le sang n'arrive plus → le cerveau a besoin de dioxygène et de glucose → il manque d'énergie, perte de connaissance."],
    corr: "Le sang apporte au cerveau du dioxygène et du glucose : ils entrent dans le cerveau, qui les utilise pour produire l'énergie dont il a besoin. Le cerveau rejette du dioxyde de carbone, qui repart avec le sang. Je vois : à 6 g, le sang ne circule presque plus jusqu'au cerveau. Je sais : le cerveau a besoin de dioxygène et de glucose pour produire son énergie. J'en conclus : mal irrigué, il en manque et l'astronaute perd connaissance. Le corps ne perd pas son sang : il circule mal." },
  { id: "a4", lvl: "hard", title: "Défi · L'entraînement en centrifugeuse",
    widget: { title: "Document 3 · La réactivité du cœur d'un astronaute pendant son entraînement", w: "reac" },
    parts: [
      { t: "num", c: "lire", label: "Quelle est la réactivité du cœur avant l'entraînement (0 séance) ?", unit: "s", ans: 5.4, tol: 0.05 },
      { t: "num", c: "lire", label: "Et après 10 séances ?", unit: "s", ans: 1.9, tol: 0.05, err: [[v => v === 10, "10, c'est le nombre de séances. Lis la valeur sur l'axe vertical."]] },
      { t: "num", c: "calc", label: "De combien de secondes la réactivité a-t-elle diminué ?", unit: "s", ans: 3.5, tol: 0.05, err: [[v => near(v, 7.3, 0.05), "Tu as additionné : fais la différence 5,4 − 1,9."]] },
      { t: "choice", c: "rais", label: "Que montre ce graphique ?", o: ["Le cœur met de moins en moins de temps à accélérer ses battements : il envoie mieux le sang au cerveau", "Le cœur met de plus en plus de temps à accélérer ses battements", "L'entraînement supprime l'accélération du décollage"], a: 0, no: { 1: "La réactivité est un temps : quand elle diminue, le cœur réagit plus vite.", 2: "L'accélération du décollage reste la même : c'est le corps qui la supporte mieux." } }],
    hints: ["Touche les points de la courbe pour lire leur valeur, ou lis le tableau sous le graphique.", "La réactivité est un temps : plus il est court, plus le cœur réagit vite.", "5,4 s · 1,9 s · 5,4 − 1,9 = 3,5 s · le cœur réagit plus vite et envoie mieux le sang au cerveau."],
    corr: "La réactivité passe de 5,4 s (0 séance) à 1,9 s (10 séances) : elle diminue de 3,5 s. Le cœur met moins de temps à accélérer ses battements, il envoie mieux le sang au cerveau : l'entraînement en centrifugeuse rend les systèmes circulatoire et musculaire plus efficaces et atténue les effets de l'accélération." }] },

{ id: "p2", n: 2, icon: "🧭", tab: "Référentiel et vitesse", title: "Partie 2 · Le référentiel et la vitesse", sub: "Physique-chimie · Immobile ou en mouvement ? Classer, mesurer et calculer des vitesses.",
  items: [
  { id: "b1", lvl: "easy", title: "Thomas Pesquet bouge-t-il ?", intro: DIAL,
    widget: { title: "Animation · Le décollage vu de deux endroits", w: "refer", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Fais décoller la fusée en regardant depuis le sol, puis depuis ton siège.", okMsg: "Les deux points de vue sont observés.", done: () => { const r = xst().ref || {}; const n = (r.sol ? 1 : 0) + (r.fus ? 1 : 0); return { ok: n === 2, msg: `${n}/2 points de vue observés jusqu'au bout.` }; } },
      { t: "rows", c: "mod", label: "Pendant le décollage, Thomas Pesquet est…", choices: ["Immobile", "En mouvement"], rows: [{ txt: "par rapport à son siège (la fusée)", a: 0 }, { txt: "par rapport au sol", a: 1 }, { txt: "par rapport à la tour de lancement", a: 1 }] },
      { t: "choice", c: "rais", label: "Qui a raison dans le débat de l'équipage ?", o: ["Anatole seulement", "Ingrid seulement", "Les deux : cela dépend de ce que l'on choisit pour observer le mouvement"], a: 2, no: { 0: "Anatole a raison par rapport à la fusée. Mais par rapport au sol ?", 1: "Ingrid a raison par rapport au sol. Mais par rapport à son siège ?" } },
      { t: "word", c: "conn", label: `Ce que l'on choisit pour observer un mouvement s'appelle le ${gap}.`, ans: ["référentiel", "referentiel"], spell: true }],
    hints: ["Lance l'animation avec le bouton « le sol », puis recommence avec « mon siège ». Lis les distances sous les boutons.", "La distance entre l'astronaute et son siège reste 0 m : par rapport à la fusée, il ne bouge pas. Par rapport au sol, sa distance change.", "Immobile par rapport à la fusée · en mouvement par rapport au sol et à la tour · les deux ont raison · référentiel."],
    corr: "Thomas Pesquet est immobile par rapport à la fusée (sa distance à son siège ne change pas), mais en mouvement par rapport au sol et à la tour de lancement. Anatole et Ingrid ont tous les deux raison : ils n'ont pas choisi le même référentiel. Le mouvement d'un objet dépend du référentiel choisi pour l'observer." },
  { id: "b2", lvl: "mid", title: "Des vitesses très différentes",
    parts: [
      { t: "order", c: "rais", label: "Range ces vitesses de la plus lente à la plus rapide.", txt: ["🐌 Un escargot : 0,013 m/s", "🚶 Un marcheur : 5 km/h", "🐆 Un guépard : 110 km/h", "🔊 Le son dans l'air : 340 m/s", "🛰 La station spatiale : 27 600 km/h", "💡 La lumière : 300 000 km/s"] },
      { t: "multi", c: "conn", label: "Quelles sont des unités de vitesse ? (3 réponses)", o: ["m/s", "km/h", "km/s", "km", "s", "kg"], a: [0, 1, 2] },
      { t: "choice", c: "conn", label: "Pour passer d'une vitesse en m/s à une vitesse en km/h, on…", o: ["multiplie par 3,6", "divise par 3,6", "multiplie par 60"], a: 0 }],
    hints: ["Attention aux unités : 340 m/s, c'est 340 mètres en une seule seconde. Convertis si besoin avec × 3,6.", "340 m/s × 3,6 = 1 224 km/h : le son va plus vite que le guépard. 27 600 km/h, c'est encore beaucoup plus.", "Escargot, marcheur, guépard, son, station spatiale, lumière · m/s, km/h, km/s · on multiplie par 3,6."],
    corr: "De la plus lente à la plus rapide : escargot (0,013 m/s), marcheur (5 km/h), guépard (110 km/h), son (340 m/s, soit 1 224 km/h), station spatiale (27 600 km/h), lumière (300 000 km/s). Une unité de vitesse est une distance divisée par une durée : m/s, km/h, km/s. Pour passer des m/s aux km/h, on multiplie par 3,6." },
  { id: "b3", lvl: "mid", title: "Le radar du rover", intro: FORM,
    widget: { title: "Expérience virtuelle · Chronométrer le rover", w: "radar", sim: "Valeurs simulées" },
    parts: [
      { t: "task", c: "mod", label: "Lance le rover et attends qu'il s'arrête.", okMsg: "Le rover est arrivé.", done: () => ({ ok: !!xst().radar, msg: xst().radar ? "Le rover est arrivé." : "Le rover n'est pas encore arrivé." }) },
      { t: "num", c: "lire", label: "Quelle distance d le rover a-t-il parcourue ?", unit: "m", ans: 36 },
      { t: "num", c: "lire", label: "Pendant quelle durée t ?", unit: "s", ans: 12 },
      { t: "num", c: "calc", label: "Calcule sa vitesse v en m/s.", unit: "m/s", ans: 3, err: [[v => v === 432, "Tu as multiplié d par t. La vitesse, c'est la distance divisée par la durée."], [v => near(v, 0.33, 0.01), "Tu as divisé t par d. C'est l'inverse : v = d ÷ t."]] },
      { t: "num", c: "calc", label: "Convertis cette vitesse en km/h.", unit: "km/h", ans: 10.8, tol: 0.05, err: [[v => near(v, 0.83, 0.01), "Tu as divisé par 3,6. Pour passer des m/s aux km/h, on multiplie."]] }],
    hints: ["La piste est graduée tous les 6 m : regarde le trait rouge où le rover s'arrête. Le chronomètre donne la durée.", "v = d ÷ t = 36 ÷ 12.", "36 m · 12 s · 36 ÷ 12 = 3 m/s · 3 × 3,6 = 10,8 km/h."],
    corr: "Le rover parcourt 36 m en 12 s. Sa vitesse est v = d ÷ t = 36 ÷ 12 = 3 m/s. En km/h : 3 × 3,6 = 10,8 km/h." },
  { id: "b4", lvl: "hard", title: "Défi · Les calculs de la mission", intro: FORM,
    parts: [
      { t: "num", c: "calc", label: "À 3 m/s, combien de secondes faut-il au rover pour parcourir 90 m ?", unit: "s", ans: 30, err: [[v => v === 270, "Tu as multiplié. Pour trouver une durée : t = d ÷ v."]] },
      { t: "num", c: "calc", label: "La fusée d'Ingrid va à 7,9 km/s. Quelle distance parcourt-elle en 10 s ?", unit: "km", ans: 79, err: [[v => near(v, 0.79, 0.001), "Tu as divisé. Pour trouver une distance : d = v × t."], [v => v === 79000, "C'est juste en mètres ! La réponse est demandée en km."]] },
      { t: "num", c: "calc", label: "Un drone martien vole à 72 km/h. Quelle est sa vitesse en m/s ?", unit: "m/s", ans: 20, err: [[v => near(v, 259.2, 0.1), "Pour passer des km/h aux m/s, on fait l'inverse de × 3,6 : on divise par 3,6."]] },
      { t: "num", c: "calc", label: "La lumière du Soleil parcourt 150 000 000 km à 300 000 km/s pour arriver sur Terre. Combien de secondes met-elle ?", unit: "s", ans: 500, err: [[v => v === 0.002, "Tu as divisé la vitesse par la distance. C'est l'inverse : t = d ÷ v."]] }],
    hints: ["Repère ce que l'on cherche (v, d ou t), puis choisis la bonne écriture de la formule dans l'encadré vert.", "Durée : t = d ÷ v. Distance : d = v × t. km/h → m/s : on divise par 3,6.", "90 ÷ 3 = 30 s · 7,9 × 10 = 79 km · 72 ÷ 3,6 = 20 m/s · 150 000 000 ÷ 300 000 = 500 s."],
    corr: "t = d ÷ v = 90 ÷ 3 = 30 s. d = v × t = 7,9 × 10 = 79 km. 72 km/h ÷ 3,6 = 20 m/s. t = 150 000 000 ÷ 300 000 = 500 s, soit un peu plus de 8 minutes." }] },

{ id: "p3", n: 3, icon: "📈", tab: "Les mouvements", title: "Partie 3 · Accéléré, uniforme ou ralenti ?", sub: "Physique-chimie · Reconnaître un mouvement sur des points, un tableau, un graphique.",
  items: [
  { id: "c1", lvl: "easy", title: "Trois mobiles, un point chaque seconde",
    widget: { title: "Animation · Les traces de trois mobiles", w: "traces" },
    parts: [
      { t: "task", c: "mod", label: "Lance l'animation jusqu'à l'arrivée.", okMsg: "Les trois traces sont complètes.", done: () => ({ ok: !!xst().traces, msg: xst().traces ? "Les trois traces sont complètes." : "L'animation n'est pas encore terminée." }) },
      { t: "rows", c: "mod", label: "Quel est le mouvement de chaque mobile ?", choices: T3, rows: [{ txt: "Mobile A", a: 2 }, { txt: "Mobile B", a: 1 }, { txt: "Mobile C", a: 0 }] },
      { t: "choice", c: "rais", label: "Comment reconnais-tu le mouvement uniforme ?", o: ["Ses points sont également espacés : il parcourt la même distance chaque seconde", "Il arrive le premier", "Il laisse plus de points que les autres"], a: 0 }],
    hints: ["Regarde l'écart entre deux points qui se suivent, du début à la fin de chaque ligne.", "Écart de plus en plus grand : la vitesse augmente. Écart de plus en plus petit : la vitesse diminue.", "A : ralenti · B : uniforme · C : accéléré."],
    corr: "Les points sont laissés à intervalles de temps égaux (1 s). Mobile A : points de plus en plus rapprochés, il ralentit (mouvement ralenti). Mobile B : points également espacés, vitesse constante (mouvement uniforme). Mobile C : points de plus en plus écartés, il accélère (mouvement accéléré)." },
  { id: "c2", lvl: "mid", title: "Lire des mesures", docs: [DOC_TABS, DOC_DIST],
    parts: [
      { t: "rows", c: "lire", label: "Quel mouvement chaque tableau décrit-il ?", choices: T3, rows: [{ txt: "Tableau 1", a: 1 }, { txt: "Tableau 2", a: 2 }, { txt: "Tableau 3", a: 0 }] },
      { t: "rows", c: "lire", label: "Et les deux robots ?", choices: T3, rows: [{ txt: "Robot X", a: 2 }, { txt: "Robot Y", a: 1 }] },
      { t: "choice", c: "rais", label: "Dans le tableau 2, que fait l'objet à 40 s ?", o: ["Il est arrêté : sa vitesse est nulle", "Il roule à vitesse constante", "Il accélère"], a: 0 }],
    hints: ["Dans les tableaux, regarde comment évolue la vitesse : elle augmente, reste la même ou diminue ?", "Pour les robots, on donne des distances pour des durées égales : comme l'écart entre des points.", "1 : uniforme · 2 : ralenti · 3 : accéléré · X : ralenti · Y : uniforme · à 40 s, v = 0 : arrêté."],
    corr: "Tableau 1 : la vitesse reste à 12 m/s, mouvement uniforme. Tableau 2 : la vitesse diminue jusqu'à 0, mouvement ralenti ; à 40 s l'objet est arrêté. Tableau 3 : la vitesse augmente, mouvement accéléré. Robot X : distances de plus en plus petites chaque seconde, ralenti. Robot Y : distances égales, uniforme." },
  { id: "c3", lvl: "hard", title: "Défi · Le retour de la capsule",
    widget: { title: "Document · Vitesse de la capsule pendant sa descente vers l'océan", w: "capsule", sim: "Valeurs simulées" },
    parts: [
      { t: "rows", c: "lire", label: "Quel est le mouvement de la capsule ?", choices: T3, rows: [{ txt: "De 0 à 20 s", a: 0 }, { txt: "De 20 à 40 s", a: 1 }, { txt: "De 40 à 60 s", a: 2 }, { txt: "De 60 à 80 s", a: 1 }] },
      { t: "num", c: "lire", label: "À quelle vitesse la capsule touche-t-elle l'eau (80 s) ?", unit: "m/s", ans: 10, err: [[v => v === 0, "Lis la courbe à 80 s : la vitesse n'est pas nulle quand la capsule touche l'eau."], [v => v === 60, "60 m/s, c'est la vitesse avant l'ouverture des parachutes."]] },
      { t: "choice", c: "rais", label: "Entre 40 et 60 s, la capsule ralentit. Est-elle arrêtée à 60 s ?", o: ["Non : elle a ralenti, mais elle continue de descendre à 10 m/s", "Oui : ralentir veut dire s'arrêter"], a: 0 },
      { t: "choice", c: "rais", label: "Pourquoi la vitesse diminue-t-elle à partir de 40 s ?", o: ["Les parachutes freinent la capsule", "La capsule n'a plus de carburant", "La capsule est arrivée dans l'eau"], a: 0 }],
    hints: ["Touche la courbe pour lire la vitesse à différents moments. Ligne qui monte, ligne horizontale, ligne qui descend ?", "Une partie horizontale signifie que la vitesse reste la même : mouvement uniforme.", "Accéléré, uniforme, ralenti, uniforme · 10 m/s · ralentir ne veut pas dire s'arrêter · les parachutes freinent."],
    corr: "De 0 à 20 s, la vitesse augmente de 0 à 60 m/s : mouvement accéléré. De 20 à 40 s, elle reste à 60 m/s : uniforme. De 40 à 60 s, les parachutes freinent la capsule, la vitesse diminue jusqu'à 10 m/s : ralenti. De 60 à 80 s, elle reste à 10 m/s : uniforme. La capsule touche l'eau à 10 m/s : ralentir ne signifie pas forcément s'arrêter." }] },

{ id: "p4", n: 4, icon: "🛠", tab: "Ingénieur fusée", title: "Partie 4 · L'atelier de l'ingénieur", sub: "Technologie · Fonction d'usage, fonctions techniques et solutions techniques.",
  items: [
  { id: "d1", lvl: "easy", title: "Le vocabulaire de l'objet technique",
    intro: `<p>${nb("Nouvel objet : le <b>rover martien</b> qui transportera l'équipage sur Mars.")}</p>`,
    parts: [
      { t: "choice", c: "conn", label: "Un objet technique est…", o: ["un objet fabriqué par l'être humain pour répondre à un besoin", "un objet que l'on trouve tel quel dans la nature", "un objet qui fonctionne toujours avec un moteur"], a: 0 },
      { t: "rows", c: "rais", label: "Pour le rover martien, classe chaque phrase.", choices: ["Fonction d'usage", "Fonction technique", "Solution technique"], rows: [{ txt: "Transporter les astronautes sur le sol de Mars", a: 0 }, { txt: "Rouler sur un sol couvert de cailloux", a: 1 }, { txt: "Des roues larges et crantées", a: 2 }, { txt: "Fournir de l'énergie au moteur", a: 1 }, { txt: "Des panneaux solaires et une batterie", a: 2 }] }],
    hints: ["Fonction d'usage : à quoi sert l'objet ? Fonction technique : ce qu'il doit faire pour y arriver. Solution technique : l'élément qui le fait.", "Une solution technique est un objet ou une pièce que l'on peut toucher.", "Usage : transporter les astronautes · techniques : rouler sur les cailloux, fournir de l'énergie · solutions : roues crantées, panneaux solaires et batterie."],
    corr: "Un objet technique est fabriqué par l'être humain pour répondre à un besoin. Le rover sert à transporter les astronautes sur Mars (fonction d'usage). Pour cela, il doit rouler sur un sol caillouteux et avoir de l'énergie (fonctions techniques), grâce à des roues crantées, des panneaux solaires et une batterie (solutions techniques)." },
  { id: "d2", lvl: "mid", title: "À chaque fonction, sa solution",
    widget: { title: "Document · Les éléments d'une fusée", w: "fuseeDessin" },
    parts: [
      { t: "choice", c: "conn", label: "Quelle est la fonction d'usage d'une fusée ?", o: ["Transporter une charge (satellite, équipage) dans l'espace", "Contenir le carburant", "Éjecter les gaz de combustion"], a: 0, no: { 1: "C'est une fonction technique : ce que la fusée doit faire pour réussir sa mission.", 2: "C'est une fonction technique." } },
      { t: "match", c: "rais", label: "Relie chaque fonction technique à sa solution technique.", ask: "Choisis la solution pour", rows: FT.map(([f, s]) => ({ e: "⚙", txt: f, v: s })) }],
    hints: ["Pourquoi envoie-t-on des fusées ? Pour emporter quelque chose dans l'espace.", "Ce qui fend l'air est au sommet ; ce qui laisse sortir les gaz est tout en bas ; les petites ailes stabilisent.", "Coiffe : pénétrer dans l'air · réservoir : carburant · tuyère : éjecter les gaz · chambre de combustion : produire les gaz · corps : résister · ailerons : stabiliser."],
    corr: "La fusée sert à transporter une charge dans l'espace. Coiffe : pénétration dans l'air. Réservoir : contenir le carburant. Tuyère : éjecter les gaz. Chambre de combustion : produire des gaz par combustion. Corps : résister à la pression. Ailerons : stabiliser la fusée et corriger sa trajectoire." },
  { id: "d3", lvl: "hard", title: "Défi · Dépanner la fusée à eau",
    parts: [
      { t: "rows", c: "rais", label: "Au premier essai, la fusée à eau vole mal. Quelle solution technique proposes-tu ?", choices: ["Ajouter des ailerons", "Ajouter une coiffe pointue", "Changer de bouteille"], rows: [{ txt: "Elle part de travers et tourne sur elle-même", a: 0 }, { txt: "Son sommet est plat : l'air la freine beaucoup", a: 1 }] },
      { t: "choice", c: "rais", label: "Pour savoir si ta modification est efficace, tu…", o: ["changes un seul élément à la fois, puis tu relances", "changes tout en même temps", "relances sans rien changer"], a: 0 }],
    hints: ["Relis les fonctions techniques de l'étape 2.", "Stabiliser : les ailerons. Limiter les frottements de l'air : la coiffe.", "Ailerons · coiffe pointue · un seul changement à la fois, sinon on ne sait pas lequel a marché."],
    corr: "Une fusée qui part de travers manque de stabilité : on ajoute des ailerons. Un sommet plat freine la fusée : une coiffe pointue améliore la pénétration dans l'air. On ne change qu'un élément à la fois : sinon, impossible de savoir quelle modification a fait la différence." }] },

{ id: "p5", n: 5, icon: "🌙", tab: "La Lune", title: "Partie 5 · La Lune depuis la fusée", sub: "Physique-chimie · Signaux lumineux : le système Soleil-Terre-Lune.",
  items: [
  { id: "e1", lvl: "mid", title: "Les phases de la Lune",
    widget: { title: "Simulation · La Lune autour de la Terre", w: "lune", sim: "Schéma simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Place la Lune dans les quatre positions.", okMsg: "Les quatre positions sont observées.", done: () => { const n = Object.keys(xst().lseen || {}).length; return { ok: n >= 4, msg: `${n}/4 positions observées.` }; } },
      { t: "rows", c: "mod", label: "Nomme la phase de la Lune pour chaque position.", choices: PH4, rows: [{ txt: "Position 1", a: 3 }, { txt: "Position 2", a: 0 }, { txt: "Position 3", a: 1 }, { txt: "Position 4", a: 2 }] },
      { t: "choice", c: "conn", label: "La Lune est…", o: ["un objet diffusant : elle renvoie la lumière du Soleil", "une source primaire de lumière, comme le Soleil", "un objet qui ne reçoit jamais de lumière"], a: 0 },
      { t: "num", c: "conn", label: "En combien de jours environ la Lune fait-elle le tour de la Terre ?", unit: "jours", ans: 28, tol: 1.5, err: [[v => v === 365 || v === 365.25, "365 jours, c'est le tour de la Terre autour du Soleil."], [v => v === 7, "7 jours, c'est environ le temps entre deux phases principales."]] }],
    hints: ["Dans la vue de l'espace, la moitié de la Lune tournée vers le Soleil est toujours éclairée. Regarde ensuite le ciel de l'observateur.", "Hémisphère Nord : au premier quartier, la moitié droite est éclairée ; au dernier quartier, la moitié gauche.", "1 : dernier quartier · 2 : nouvelle lune · 3 : premier quartier · 4 : pleine lune · objet diffusant · 28 jours environ."],
    corr: "En position 2, la Lune est entre la Terre et le Soleil : sa face éclairée nous tourne le dos, c'est la nouvelle lune. En position 3, on voit la moitié droite : premier quartier. En position 4, on voit toute la face éclairée : pleine lune. En position 1, on voit la moitié gauche : dernier quartier. La Lune est un objet diffusant : le Soleil en éclaire toujours une moitié. Elle fait le tour de la Terre en 28 jours environ (la lunaison)." },
  { id: "e2", lvl: "hard", title: "Défi · Raisonner avec les phases",
    parts: [
      { t: "choice", c: "rais", label: "Pourquoi ne voit-on pas la Lune à la nouvelle lune ?", o: ["Sa moitié éclairée est tournée vers le Soleil, de l'autre côté : on ne voit que sa face sombre", "La Terre lui fait de l'ombre", "La Lune s'éteint une fois par mois"], a: 0, no: { 1: "Une ombre de la Terre sur la Lune, c'est une éclipse de Lune : cela n'arrive que quelques fois par an, et à la pleine lune." } },
      { t: "choice", c: "rais", label: "Ce soir, c'est la pleine lune. Que verras-tu dans une semaine environ ?", o: ["Le dernier quartier", "Le premier quartier", "Encore la pleine lune"], a: 0 },
      { t: "choice", c: "rais", label: "Loin dans l'espace, un astronaute observe la Lune de côté pendant tout un mois. Que voit-il ?", o: ["Toujours la même moitié de disque éclairée : l'apparence de la Lune dépend de l'endroit d'où on l'observe", "Les mêmes phases que depuis la Terre", "Une Lune toujours entièrement sombre"], a: 0 }],
    hints: ["Reprends la simulation : regarde la position 2, puis l'ordre des positions dans le sens de la flèche.", "Dans le sens de la flèche, après la position 4 (pleine lune) vient la position 1.", "Face éclairée tournée vers le Soleil · dernier quartier · l'apparence dépend de l'observateur."],
    corr: "À la nouvelle lune, la face éclairée de la Lune est tournée vers le Soleil : depuis la Terre, on ne voit que sa face sombre. Une semaine après la pleine lune vient le dernier quartier. Le Soleil éclaire toujours une moitié de la Lune : ce que l'on en voit dépend de l'endroit d'où on l'observe." }] },

{ id: "p6", n: 6, icon: "🚀", tab: "Compte à rebours", title: "Partie 6 · Le compte à rebours", sub: "Des situations nouvelles qui mélangent toute la mission, puis ta fiche mémo.",
  items: [
  { id: "f1", lvl: "hard", title: "Les dernières vérifications", recop: true,
    intro: "Journal de bord : l'équipage est presque prêt. Réponds aux dernières questions du contrôleur de vol.",
    parts: [
      { t: "choice", c: "conn", label: "Au retour sur Terre, une capsule subit une accélération de 8 g. Que risque un astronaute non entraîné ?", o: ["De perdre connaissance", "Rien : c'est comme au sol", "De devenir plus lourd pour toujours"], a: 0 },
      { t: "choice", c: "conn", label: "Le cerveau a besoin de dioxygène et de glucose pour…", o: ["produire l'énergie qui lui sert à fonctionner", "fabriquer du sang", "fabriquer du dioxygène"], a: 0 },
      { t: "rows", c: "rais", label: "Dans le rover qui roule, Thomas regarde Sophie, assise à côté de lui. Sophie est…", choices: ["Immobile", "En mouvement"], rows: [{ txt: "par rapport au rover", a: 0 }, { txt: "par rapport aux rochers de Mars", a: 1 }] },
      { t: "num", c: "calc", label: "Le rover parcourt 150 m en 1 min 15 s. Quelle est sa vitesse en m/s ?", unit: "m/s", ans: 2, err: [[v => near(v, 130.4, 0.5) || near(v, 125, 0.1), "Convertis d'abord la durée en secondes : 1 min 15 s = 60 + 15 = 75 s."], [v => near(v, 0.5, 0.001), "Tu as divisé la durée par la distance : v = d ÷ t."]] },
      { t: "choice", c: "rais", label: "Le compteur du rover affiche 4 km/h pendant tout le trajet. Son mouvement est…", o: ["accéléré", "uniforme", "ralenti"], a: 1 },
      { t: "choice", c: "conn", label: "Pourquoi voit-on la Lune la nuit ?", o: ["Elle renvoie vers nous une partie de la lumière du Soleil", "Elle produit sa propre lumière", "Elle reflète les lumières des villes"], a: 0 }],
    hints: ["Relis le document 1 de la partie 1 et ta formule de la partie 2.", "Plus de 6 g : le sang ne monte plus au cerveau. Pour la vitesse : 1 min 15 s = 75 s.", "Perte de connaissance · énergie · immobile / en mouvement · 150 ÷ 75 = 2 m/s · uniforme · la Lune renvoie la lumière du Soleil."],
    corr: "À 8 g, le sang n'arrive plus au cerveau : un astronaute non entraîné perd connaissance. Le cerveau utilise le dioxygène et le glucose pour produire son énergie. Sophie est immobile par rapport au rover, en mouvement par rapport aux rochers. v = 150 ÷ 75 = 2 m/s. Une vitesse constante donne un mouvement uniforme. La Lune est un objet diffusant : elle renvoie la lumière du Soleil. Ta fiche mémo s'affiche ci-dessous : recopie-la dans ton cahier." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "En quelle unité peut-on mesurer une accélération ?", o: ["En g", "En km", "En °C", "En mL"], a: 0 },
    { t: "choice", c: "conn", label: "Quelle relation permet de calculer une vitesse ?", o: ["v = d ÷ t", "v = d × t", "v = t ÷ d"], a: 0 },
    { t: "choice", c: "conn", label: "Le Soleil est…", o: ["une source primaire de lumière", "un objet diffusant", "une planète"], a: 0 }],
  hints: ["Pense à la centrifugeuse : 1 g au sol, 3 g au décollage.", "Une vitesse s'exprime en m/s : des mètres divisés par des secondes.", "En g · v = d ÷ t · le Soleil produit sa propre lumière : source primaire."],
  corr: "L'accélération se mesure en g. La vitesse se calcule avec v = d ÷ t. Le Soleil est une source primaire de lumière : il produit sa propre lumière." };
const RESUME = `La question de la mission : ${PROBLEM}\n\nMa fiche mémo\n${MEMO.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}\n\nJe vérifie que je sais…\n${CHECK.map(x => "- " + x).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
