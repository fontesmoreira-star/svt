/* ===================== AJOUTS v2 aux exercices ===================== */
const EX = id => EXOS.find(e => e.id === id);
const LVS = [["easy", "🟢 Facile", "easy"], ["mid", "🟡 Moyen", "mid"], ["hard", "🔴 Défi", "hard"]];

/* e1 🔴 : question rédigée qui relie pression et diagramme d'état */
(() => { const it = EX("e1").lv.hard;
  it.docs[0].html += `<p>Point critique de l'eau : <b>374 °C ; 2,21 × 10⁷ Pa</b>. Au-delà de 374 °C, l'eau ne peut plus exister à l'état liquide, quelle que soit la pression.</p><p>Température moyenne au sol de Vénus : <b>≈ 470 °C</b>.</p>`;
  it.parts.push({ t: "text", label: "d) Rédige : malgré une pression 92 fois plus forte que sur Terre, l'eau peut-elle être liquide à la surface de Vénus ? Justifie avec les données." });
  it.crit = ["Je compare la température de Vénus (470 °C) à celle du point critique (374 °C).", "J'explique qu'au-delà de 374 °C il n'existe pas d'eau liquide, même sous forte pression.", "Je conclus : l'eau ne peut exister que sous forme de vapeur (gaz) à la surface de Vénus."];
  it.model = "Non. La température au sol de Vénus (≈ 470 °C) est supérieure à la température du point critique de l'eau (374 °C). Au-delà de cette température, l'eau ne peut plus être liquide, quelle que soit la pression : même avec 9,3 × 10⁶ Pa, l'eau ne peut exister que sous forme de vapeur.";
  it.hints = it.hints.concat([]); it.corr += "<br>d) Voir la réponse modèle : 470 °C > 374 °C, donc pas d'eau liquide, quelle que soit la pression."; })();

/* e2 🟢 : saisie tolérante ; e2 🟡 : la planète n'apparaît sur le diagramme qu'après la bonne réponse */
(() => { const it = EX("e2").lv.easy; it.parts[0].label = "a) Indique l'état de l'eau en chaque point.";
  it.parts.push({ t: "word", label: "b) Comment appelle-t-on le point du diagramme où les trois états de l'eau coexistent ?", ans: ["point triple"], err: [[["point critique"], "Le point critique marque la fin de la courbe liquide–gaz. Cherche le point où les trois courbes se rejoignent."], [["point de fusion", "point d'ebullition"], "Ce sont des températures de changement d'état, pas le point où les trois états coexistent."]] });
  it.corr += "<br>b) Le <b>point triple</b> (0,01 °C ; 611 Pa)."; })();
(() => { const it = EX("e2").lv.mid;
  it.docsSolved = [{ title: "Document · Diagramme d'état de l'eau (planète placée)", chart: phaseSpec({ segments: [{ P: 3e6, t0: 20, t1: 260, label: "Planète", color: "c3" }] }) }]; })();

/* e3 🟢 : nommer la transformation (saisie tolérante) */
(() => { const it = EX("e3").lv.easy; it.parts[0].label = "a) " + it.parts[0].label;
  it.parts.push({ t: "word", label: "b) En un mot : comment s'appelle la transformation chimique que subit le fer au contact du dioxygène ?", ans: ["oxydation", "une oxydation", "oxyder"], err: [[["reduction"], "C'est l'inverse : le fer perd des électrons au profit du dioxygène."], [["combustion"], "Pas de flamme ici : cherche un terme plus général."]] });
  it.corr += "<br>b) Une <b>oxydation</b>."; })();

/* e5 🟢 : le mot « interglaciaire » n'est plus donné dans l'énoncé */
(() => { const it = EX("e5").lv.easy;
  it.parts[1].label = "b) Combien de périodes chaudes (écart supérieur ou égal à 0 °C) comptes-tu, période actuelle comprise ?";
  it.parts.push({ t: "word", label: "c) Comment appelle-t-on une période chaude comprise entre deux glaciations ?", ans: ["interglaciaire", "période interglaciaire", "un interglaciaire"], err: [[["glaciaire", "periode glaciaire", "glaciation"], "C'est l'inverse : une période glaciaire est une période froide."]] });
  it.corr += "<br>c) Une période <b>interglaciaire</b>."; })();

/* e6 🔴 : refait (forêt / paysage ouvert sur 140 000 ans, comparé à l'Antarctique) */
const AP = [[-140, 12], [-136, 15], [-132, 38], [-130, 62], [-128, 80], [-124, 84], [-120, 80], [-116, 66], [-112, 46], [-108, 54], [-104, 40], [-100, 57], [-96, 44], [-92, 36], [-88, 40], [-84, 54], [-80, 47], [-76, 34], [-72, 27], [-68, 24], [-64, 30], [-60, 33], [-56, 28], [-52, 30], [-48, 27], [-44, 25], [-40, 23], [-36, 21], [-32, 18], [-28, 15], [-24, 12], [-20, 10], [-16, 15], [-14, 30], [-12, 48], [-10, 72], [-8, 84], [-6, 86], [-4, 86], [-2, 83], [0, 80]];
EX("e6").lv.hard = { intro: "Deux enregistrements obtenus à des milliers de kilomètres l'un de l'autre : la végétation autour d'un lac d'Europe de l'Ouest, et la température en Antarctique.",
  docs: [{ title: "Document 1 · Part des pollens d'arbres dans les sédiments d'un lac", sim: "Valeurs simulées", chart: { type: "line", series: [{ name: "Pollens d'arbres", pts: AP, color: "c4" }], xMin: -140, xMax: 0, xStep: 20, yMin: 0, yMax: 100, yStep: 20, legend: false, anim: true, animDur: 6000, xTickW: 3,
      xTitle: "Temps (milliers d'années, 0 = aujourd'hui)", yTitle: "Pollens d'arbres (%)", xRead: v => (v === 0 ? "Aujourd'hui" : "Il y a " + fmt(-v * 1000) + " ans"), yRead: v => fmt(v) + " % de pollens d'arbres", xFmt: v => fmt(v) },
      after: `<p class="lead">Beaucoup de pollens d'arbres : paysage forestier. Peu de pollens d'arbres : paysage ouvert, dominé par les herbacées.</p>` },
    { title: "Document 2 · Écarts de température en Antarctique (par rapport à l'actuel)", sim: "Valeurs simulées (courbe schématique)", chart: paleoSpec({ series: [{ name: "Écart de température", pts: PALEO.filter(p => p[0] >= -140), color: "c1", w: 2.6 }], xMin: -140, xMax: 0, xStep: 20, xTickW: 3 }) }],
  parts: [
    { t: "choice", c: "lire", label: "a) En dehors de la période actuelle, quand le paysage autour du lac était-il le plus boisé ?", o: ["Entre −130 000 et −115 000 ans", "Entre −60 000 et −40 000 ans", "Entre −25 000 et −15 000 ans", "Entre −100 000 et −90 000 ans"], a: 0,
      no: { 1: "Entre −60 000 et −40 000 ans, la part de pollens d'arbres reste vers 25 à 33 %.", 2: "Vers −20 000 ans, la part de pollens d'arbres est à son minimum (≈ 10 %).", 3: "Vers −100 000 ans, un pic existe (≈ 57 %), mais il est plus faible que celui de −125 000 ans." } },
    { t: "num", c: "calc", label: "b) Calcule la variation de la part de pollens d'arbres entre −20 000 ans et −8 000 ans, avec son signe.", unit: "points", ans: 74, tol: 3, im: "text", sign: true, err: [[v => near(v, -74, 3), "Variation = valeur la plus récente − valeur la plus ancienne = 84 − 10."], [v => near(v, 840, 30), "C'est une variation en points de pourcentage, pas un rapport : fais une soustraction."]] },
    { t: "choice", c: "rais", label: "c) Compare les deux documents. Que constates-tu ?", o: ["Les périodes riches en pollens d'arbres correspondent aux périodes chaudes de l'Antarctique", "Elles correspondent aux périodes froides de l'Antarctique", "Il n'existe aucun lien entre les deux courbes", "La végétation change 50 000 ans avant la température"], a: 0,
      no: { 1: "Vers −125 000 ans, les deux courbes sont au plus haut ; vers −20 000 ans, toutes deux au plus bas.", 2: "Compare les dates des maximums et des minimums des deux courbes.", 3: "Les maximums des deux courbes tombent aux mêmes dates, à quelques milliers d'années près." } },
    { t: "text", label: "d) Rédige : en quoi l'accord entre ces deux enregistrements renforce-t-il la reconstitution des climats passés ? Indique une limite." }
  ],
  crit: ["Je cite des valeurs des deux documents (dates, %, °C).", "Je relie forêt et climat chaud, paysage ouvert et climat froid.", "J'explique que deux indices indépendants, éloignés l'un de l'autre, qui concordent montrent un changement global et rendent la conclusion plus solide.", "Je donne une limite (un seul lac, datations imprécises, réponse locale de la végétation, données simulées…)."],
  model: "Vers −125 000 ans, les pollens d'arbres atteignent 80 à 84 % : le paysage est forestier, signe d'un climat chaud ; au même moment, l'Antarctique est 1 à 2 °C plus chaud qu'aujourd'hui. Vers −20 000 ans, les pollens d'arbres tombent à 10 % (paysage ouvert, climat froid) quand l'Antarctique est environ 7 °C plus froid. Deux enregistrements indépendants, obtenus à des milliers de kilomètres, varient ensemble : le changement climatique est global, et la reconstitution est plus solide que si elle reposait sur un seul indice. Limite : un seul lac est étudié, et la végétation répond aussi à des facteurs locaux (humidité, sols) ; les datations ne sont pas parfaitement précises.",
  hints: ["Document 1 : une part élevée de pollens d'arbres signifie un paysage forestier.", "Lis la valeur à −20 000 ans (≈ 10 %) puis à −8 000 ans (≈ 84 %).", "Lance les deux animations : les pics et les creux tombent-ils aux mêmes dates ?"],
  corr: "a) <b>Entre −130 000 et −115 000 ans</b> (80 à 84 % de pollens d'arbres).<br>b) 84 − 10 = <b>+74 points</b>.<br>c) <b>Les périodes boisées correspondent aux périodes chaudes de l'Antarctique</b> : les deux enregistrements concordent." };

/* e7 🟢 : saisie tolérante ; e7 🟡 : rédaction ; e7 🔴 : simulateur débloqué après la bonne réponse */
(() => { const it = EX("e7").lv.easy;
  it.parts[0].rows[2].txt = "Le dégel des sols gelés en permanence libère du CO₂ et du CH₄";
  it.parts[0].label = "a) " + it.parts[0].label;
  it.parts.push({ t: "word", label: "b) Comment appelle-t-on le sol gelé en permanence des régions froides ?", ans: ["pergélisol", "permafrost", "pergelisol"], err: [[["banquise"], "La banquise est de la glace de mer, pas un sol."], [["toundra"], "La toundra est une végétation ; cherche le nom du sol gelé."]] });
  it.corr += "<br>b) Le <b>pergélisol</b> (ou permafrost)."; })();
(() => { const it = EX("e7").lv.mid;
  it.parts.push({ t: "text", label: "c) Rédige en 3 ou 4 lignes l'explication de cette boucle, du réchauffement de départ jusqu'à son amplification." });
  it.crit = ["Je pars de la hausse de température et du recul des glaces.", "J'explique que les surfaces découvertes, plus sombres, renvoient moins le rayonnement solaire et en absorbent davantage.", "Je conclus que la boucle amplifie le réchauffement : c'est une rétroaction positive."];
  it.model = "Le réchauffement fait fondre une partie des glaces. Les surfaces découvertes (océan, sols), plus sombres que la glace, renvoient moins le rayonnement solaire vers l'espace et en absorbent davantage. L'énergie absorbée augmente, ce qui accentue le réchauffement et la fonte : la boucle amplifie la perturbation de départ, c'est une rétroaction positive."; })();
EX("e7").lv.hard.unlock = { title: "🔓 Simulateur débloqué · dilatation de l'océan", mount: el => dilatSim(el) };

/* ---------- connaissances pour les sujets blancs (aucune question du DS) ---------- */
const K = (label, o, a, no, hints, corr) => ({ parts: [{ t: "choice", c: "conn", label, o, a, no }], hints, corr });
const KB = {
  A1: K("L'atmosphère primitive de la Terre était composée principalement de :", ["N₂, CO₂ et vapeur d'eau", "O₂ et N₂", "O₃ et CH₄", "Argon et O₂"], 0, { 1: "Le dioxygène n'apparaît que bien plus tard, grâce à la vie.", 2: "L'ozone se forme à partir du dioxygène, absent au début.", 3: "L'argon n'est qu'un gaz en traces." }, ["Pense au dégazage des volcans primitifs.", "Le dioxygène était absent au début de l'histoire de la Terre.", "Trois gaz : un gaz inerte, un gaz à effet de serre et l'eau."], "Diazote, dioxyde de carbone et vapeur d'eau."),
  A2: K("Les océans se sont formés :", ["par condensation de la vapeur d'eau de l'atmosphère, quand la surface s'est refroidie", "il y a 500 millions d'années", "grâce à la photosynthèse", "par fonte récente de comètes"], 0, { 1: "Les océans sont bien plus anciens : plus de 4 milliards d'années.", 2: "La photosynthèse produit du dioxygène, pas l'eau des océans.", 3: "Les comètes ont pu apporter de l'eau, mais très tôt et en partie seulement." }, ["Quel était l'état de l'eau dans l'atmosphère primitive ?", "Que se passe-t-il quand la surface d'une planète se refroidit ?", "La vapeur d'eau se liquéfie : c'est une condensation."], "Par condensation de la vapeur d'eau atmosphérique, lors du refroidissement de la surface."),
  A3: K("La concentration maximale d'ozone se situe :", ["dans la stratosphère, vers 20 à 30 km d'altitude", "au ras du sol", "vers 400 km d'altitude", "au fond des océans"], 0, { 1: "L'ozone près du sol est un polluant, en faible quantité.", 2: "À 400 km, l'atmosphère est presque vide.", 3: "L'ozone est un gaz de l'atmosphère." }, ["La couche d'ozone filtre les UV avant qu'ils n'atteignent le sol.", "Elle se trouve dans la couche au-dessus de la troposphère.", "Quelques dizaines de kilomètres d'altitude."], "Dans la stratosphère, vers 20 à 30 km."),
  A4: K("Un climat se définit par :", ["des moyennes de grandeurs atmosphériques sur une longue période (au moins 30 ans)", "la température d'un jour donné", "les prévisions à 7 jours", "la seule quantité de pluie"], 0, { 1: "Une valeur datée relève de la météo.", 2: "Une prévision à court terme relève de la météo.", 3: "Le climat combine plusieurs grandeurs : température, pression, pluie, vent…" }, ["Climat ou météo : quelle durée ?", "Le climat repose sur des moyennes.", "Les normales sont calculées sur 30 ans."], "Des moyennes de grandeurs atmosphériques sur une longue période."),
  A5: K("Une rétroaction positive :", ["amplifie la perturbation qui l'a déclenchée", "freine la perturbation", "est toujours bénéfique pour le climat", "ne concerne que l'océan"], 0, { 1: "Une rétroaction qui freine est négative.", 2: "« Positive » ne veut pas dire « bénéfique ».", 3: "Elle peut concerner les glaces, la vapeur d'eau, les sols…" }, ["« Positive » ne signifie pas « bonne ».", "Suis la boucle : revient-elle renforcer la cause de départ ?", "Elle renforce la perturbation."], "Elle amplifie la perturbation de départ."),
  A6: K("Les combustibles fossiles sont dits non renouvelables car :", ["ils se forment en des dizaines à des centaines de millions d'années, bien plus lentement qu'on ne les consomme", "ils ne contiennent pas de carbone", "ils se reconstituent chaque année", "ils sont d'origine purement minérale"], 0, { 1: "Ils sont au contraire très riches en carbone.", 2: "Leur formation demande des millions d'années.", 3: "Ils proviennent du carbone d'êtres vivants." }, ["D'où vient le carbone du charbon ou du pétrole ?", "Compare leur durée de formation à notre rythme de consommation.", "Des millions d'années contre quelques siècles."], "Leur formation est bien trop lente par rapport à leur consommation."),
  B1: K("Les stromatolithes sont :", ["des structures calcaires construites par des micro-organismes photosynthétiques", "des météorites riches en eau", "des cristaux de glace fossiles", "des roches volcaniques"], 0, { 1: "Les météorites viennent de l'espace.", 2: "Ils ne sont pas faits de glace.", 3: "Ils sont d'origine biologique." }, ["Ce sont des traces de vie très anciennes.", "Ils sont construits par des micro-organismes.", "Ces micro-organismes réalisent la photosynthèse."], "Des structures calcaires construites par des micro-organismes photosynthétiques."),
  B2: K("Les fers rubanés se sont déposés :", ["dans les océans, entre environ 3,5 et 2,4 milliards d'années", "sur les continents, après 2,4 milliards d'années", "il y a 10 000 ans", "dans l'atmosphère"], 0, { 1: "Ce sont les paléosols rouges qui sont continentaux et plus récents.", 2: "Ce sont des roches très anciennes.", 3: "Une roche ne se dépose pas dans l'atmosphère." }, ["Marins ou continentaux ?", "Ils précèdent l'accumulation du dioxygène dans l'air.", "Leur dépôt massif s'arrête vers 2,4 Ga."], "Dans les océans, entre 3,5 et 2,4 Ga."),
  B3: K("Aujourd'hui, la principale source de dioxygène atmosphérique est :", ["la photosynthèse", "la respiration", "les combustions", "les éruptions volcaniques"], 0, { 1: "La respiration consomme du dioxygène.", 2: "Les combustions consomment du dioxygène.", 3: "Les volcans libèrent surtout de la vapeur d'eau et du CO₂." }, ["Une source ajoute du dioxygène à l'atmosphère.", "Quel métabolisme rejette du dioxygène ?", "Celui des êtres vivants chlorophylliens."], "La photosynthèse."),
  B4: K("La climatologie étudie :", ["les variations du climat à moyen ou long terme", "le temps qu'il fera demain", "uniquement les tempêtes", "la composition des roches"], 0, { 1: "C'est le rôle de la météorologie.", 2: "Elle étudie l'ensemble des grandeurs du climat.", 3: "C'est le rôle de la géologie." }, ["Météorologie : court terme. Climatologie : … ?", "Années, siècles, millénaires.", "Variations du climat local ou global."], "Les variations du climat à moyen ou long terme."),
  B5: K("La fonte de la banquise arctique :", ["fait très peu varier le niveau marin, car cette glace flotte déjà", "est la première cause de la montée des océans", "fait baisser le niveau marin", "n'a aucun effet sur le climat"], 0, { 1: "Les premières causes sont la dilatation thermique et la fonte des glaces continentales.", 2: "Elle ne retire pas d'eau à l'océan.", 3: "Elle découvre un océan sombre : c'est une rétroaction." }, ["La banquise est de la glace de mer.", "Un glaçon qui fond dans un verre fait-il déborder le verre ?", "La glace qui flotte déplace déjà son volume d'eau."], "Elle fait très peu varier le niveau marin."),
  B6: K("L'océan joue un rôle d'amortisseur du réchauffement car :", ["il absorbe une grande partie de l'énergie supplémentaire et une partie du CO₂ émis", "il refroidit l'atmosphère chaque hiver", "il produit l'essentiel du CO₂ atmosphérique", "il ne se réchauffe jamais"], 0, { 1: "Ce n'est pas une variation saisonnière.", 2: "Il absorbe du CO₂, il n'en est pas la source principale.", 3: "L'océan se réchauffe, et se dilate." }, ["Où va l'essentiel de l'énergie supplémentaire ?", "L'océan stocke aussi du carbone.", "Énergie et CO₂."], "Il absorbe une grande partie de l'énergie supplémentaire et une partie du CO₂."),
  C1: K("La teneur actuelle de l'atmosphère en dioxygène est d'environ :", ["21 %", "78 %", "0,04 %", "50 %"], 0, { 1: "78 % est la part du diazote.", 2: "0,04 % est l'ordre de grandeur du CO₂.", 3: "Trop élevé." }, ["Le diazote représente environ 78 %.", "Le dioxygène est le deuxième gaz.", "Environ un cinquième de l'air."], "Environ 21 %."),
  C2: K("L'ozone stratosphérique protège les êtres vivants car il :", ["absorbe une grande partie des UV solaires, qui sont mutagènes", "produit du dioxygène", "absorbe le CO₂", "réchauffe la surface terrestre"], 0, { 1: "Il se forme à partir du dioxygène.", 2: "Il n'a pas de rôle de puits de CO₂.", 3: "Son rôle protecteur concerne les UV." }, ["Quel rayonnement endommage l'ADN ?", "Les ultraviolets.", "La couche d'ozone en arrête une grande partie."], "Il absorbe une grande partie des UV, mutagènes."),
  C3: K("Le carbone est stocké dans plusieurs réservoirs. Lequel n'en est PAS un ?", ["Le noyau terrestre", "L'atmosphère", "Les océans", "Les roches"], 0, { 1: "L'atmosphère contient du CO₂.", 2: "Les océans contiennent du carbone dissous.", 3: "Les roches calcaires et les combustibles fossiles stockent du carbone." }, ["Les réservoirs du cycle du carbone sont superficiels.", "Atmosphère, sols, océans, biosphère, roches…", "Un seul n'est pas une enveloppe superficielle."], "Le noyau terrestre."),
  C4: K("Depuis un siècle et demi, la température moyenne globale a augmenté d'environ :", ["1 °C", "0,1 °C", "5 °C", "10 °C"], 0, { 1: "C'est dix fois trop peu.", 2: "C'est l'ordre de grandeur d'une déglaciation entière.", 3: "Bien trop élevé." }, ["C'est un ordre de grandeur.", "Un peu plus d'un degré aujourd'hui.", "Ni 0,1 ni 5 °C."], "Environ 1 °C."),
  C5: K("Le dégel du pergélisol :", ["libère des gaz à effet de serre et amplifie le réchauffement", "freine le réchauffement", "fait baisser le niveau marin", "n'a aucun effet climatique"], 0, { 1: "Il libère des GES : il ne freine pas.", 2: "Il ne retire pas d'eau à l'océan.", 3: "Il libère du CO₂ et du CH₄." }, ["Que contient le sol gelé ?", "De la matière organique qui libère du CO₂ et du CH₄ en dégelant.", "Plus de GES → plus de réchauffement."], "Il libère des GES : rétroaction positive."),
  C6: K("Sur les 400 000 dernières années, périodes glaciaires et interglaciaires alternent avec une périodicité d'environ :", ["100 000 ans", "10 ans", "1 000 ans", "10 millions d'années"], 0, { 1: "Ce serait de la variabilité à court terme.", 2: "Trop court.", 3: "Trop long." }, ["Compte les cycles sur la courbe de l'Antarctique.", "Environ 4 cycles en 400 000 ans.", "400 000 ÷ 4 = …"], "Environ 100 000 ans.")
};
const SUJETS = {
  A: { titre: "Sujet blanc A", kb: ["A1", "A2", "A3", "A4", "A5", "A6"], ex: [["e5", "mid"], ["e6", "hard"]] },
  B: { titre: "Sujet blanc B", kb: ["B1", "B2", "B3", "B4", "B5", "B6"], ex: [["e3", "hard"], ["e7", "hard"]] },
  C: { titre: "Sujet blanc C", kb: ["C1", "C2", "C3", "C4", "C5", "C6"], ex: [["e4", "hard"], ["e2", "mid"]] }
};

/* ---------- compétences ---------- */
const COMPS = { lire: "Lire un graphique ou un document", calc: "Calculer", conn: "Mobiliser ses connaissances", rais: "Raisonner, exercer son esprit critique", redac: "Rédiger une réponse argumentée (auto-évaluation)" };
const DEFC = { num: "calc", sci: "calc", range: "lire", choice: "rais", multi: "lire", rows: "conn", order: "conn", coef: "calc", word: "conn", text: "redac" };
const CMAP = { "e2-easy": ["lire", "conn"], "e2-mid": ["lire", "lire"], "e2-hard": ["rais", "lire", "redac"], "e3-hard": ["rais", "redac"], "e4-mid": ["lire", "calc", "rais"], "e4-hard": ["rais", "redac"], "e5-easy": ["lire", "lire", "conn"], "e5-mid": ["lire", "lire"], "e5-hard": ["calc", "calc", "calc", "redac"], "e6-easy": ["calc", "rais"], "e6-mid": ["calc", "rais", "rais"], "e1-hard": ["calc", "calc", "calc", "redac"], "e7-mid": ["rais", "rais", "redac"], "e7-hard": ["calc", "calc", "conn"] };
const baseId = id => id.replace(/^sj-[ABC]-/, "");
const compOf = (id, k, p) => p.c || (CMAP[baseId(id)] && CMAP[baseId(id)][k]) || DEFC[p.t];

/* ---------- registre des items ---------- */
const ITEMS = {};
EXOS.forEach(e => LVS.forEach(([l, lab]) => { ITEMS[e.id + "-" + l] = { it: e.lv[l], label: `Ex. ${e.id.slice(1)} · ${e.title} · ${lab}` }; }));
Object.entries(SUJETS).forEach(([sk, sj]) => {
  sj.kb.forEach((k, i) => { ITEMS[`sj-${sk}-${k}`] = { it: KB[k], label: `${sj.titre} · Partie 1, question ${i + 1}`, sujet: sk, part: 0 }; });
  sj.ex.forEach(([e, l], i) => { ITEMS[`sj-${sk}-${e}-${l}`] = { it: EX(e).lv[l], label: `${sj.titre} · Partie ${i + 2} (${EX(e).title})`, sujet: sk, part: i + 1 }; });
});

/* ---------- état ---------- */
const DEF = { fs: 21, theme: null, proj: false, it: {}, view: "accueil", lv: {}, sj: "A", timer: { acc: 0, run: false, t0: 0, show: false, total: 3600 } };
let S = Store.load(DEF);
if (!S.timer) S.timer = DEF.timer;
const save = () => Store.save(S);
const scorable = p => p.t !== "text";
function itState(id) { if (!S.it[id]) S.it[id] = { v: {}, hints: 0, crit: {} }; return S.it[id]; }
function itemMax(it) { return it.parts.filter(scorable).length; }
const corrShown = st => !!(st && st.first && (st.lastOk || (st.tries || 0) >= 2));
function lvStatus(e, l) { const st = S.it[e.id + "-" + l]; if (!st || !st.first) return ["", "à faire"]; return st.first.pts === st.first.max ? ["✓", "réussi"] : ["◐", st.first.pts + "/" + st.first.max]; }

/* ---------- vérification ---------- */
function checkPart(p, val) {
  if (p.t === "word") {
    const r = fuzzy(val, p.ans); if (r.empty) return { ok: false, empty: true, msg: "Réponse manquante." };
    if (r.ok) return { ok: true, msg: r.typo ? `✓ Juste. Orthographe exacte : « ${p.ans[0]} ».` : "✓ Juste." };
    for (const [alts, m] of (p.err || [])) if (fuzzy(val, alts).ok) return { ok: false, msg: "✗ " + m };
    return { ok: false, msg: "✗ Pas encore : relis l'énoncé, puis utilise un coup de pouce si besoin." };
  }
  if (p.t === "num") {
    if (val === undefined || String(val).trim() === "") return { ok: false, empty: true, msg: "Réponse manquante." };
    let v = parseNum(val); if (p.conv) v = p.conv(v);
    if (!Number.isFinite(v)) return { ok: false, msg: "Écris un nombre (la virgule est acceptée)." };
    if (near(v, p.ans, p.tol || 0, p.tolRel || 0)) { const noSign = p.sign && !/^\s*[+]/.test(String(val)); return { ok: true, msg: noSign ? "✓ Juste. Pense à écrire le signe + devant une variation positive." : "✓ Juste." }; }
    for (const [f, m] of (p.err || [])) if (f(v)) return { ok: false, msg: "✗ " + m };
    return { ok: false, msg: "✗ Pas encore : vérifie ta lecture ou ton calcul." };
  }
  if (p.t === "sci") {
    const m = parseNum(val && val.m), e = parseInt(val && val.e, 10);
    if (!Number.isFinite(m) || !Number.isFinite(e)) return { ok: false, empty: true, msg: "Complète les deux cases." };
    const v = m * Math.pow(10, e);
    if (near(v, p.ans, 0, p.tolRel)) { const sci = Math.abs(m) >= 1 && Math.abs(m) < 10; return { ok: true, msg: sci ? "✓ Juste." : "✓ La valeur est juste, mais en écriture scientifique le nombre devant 10ⁿ est compris entre 1 et 10." }; }
    const r = v / p.ans; const k = Math.round(Math.log10(Math.abs(r)));
    if (k !== 0 && near(Math.abs(r), Math.pow(10, k), 0, 0.06)) return { ok: false, msg: `✗ Les chiffres sont bons, mais la puissance de 10 est fausse (écart de 10${supStr(k)}).` };
    return { ok: false, msg: "✗ Pas encore : reprends le calcul." };
  }
  if (p.t === "range") {
    const lo = parseNum(val && val.lo), hi = parseNum(val && val.hi);
    if (!Number.isFinite(lo) || !Number.isFinite(hi)) return { ok: false, empty: true, msg: "Complète les deux températures." };
    if (near(lo, p.lo, p.tolLo) && near(hi, p.hi, p.tolHi)) return { ok: true, msg: "✓ Juste : une fenêtre de température très étroite." };
    if (!near(lo, p.lo, p.tolLo)) return { ok: false, msg: "✗ La borne basse correspond à la fusion de la glace : regarde la courbe de fusion." };
    return { ok: false, msg: "✗ La borne haute correspond à l'ébullition : suis la ligne 1,2 × 10³ Pa jusqu'à la courbe liquide–gaz." };
  }
  if (p.t === "choice") { if (val === undefined || val === null) return { ok: false, empty: true, msg: "Choisis une réponse." }; return val === p.a ? { ok: true, msg: "✓ Juste." } : { ok: false, msg: "✗ " + ((p.no && p.no[val]) || "Ce n'est pas la bonne proposition.") }; }
  if (p.t === "multi") { const s = (val || []).slice().sort().join(","); if (!s) return { ok: false, empty: true, msg: "Choisis au moins une réponse." }; return s === p.a.slice().sort().join(",") ? { ok: true, msg: "✓ Juste." } : { ok: false, msg: "✗ Pas encore : il y a " + p.a.length + " bonne(s) réponse(s)." }; }
  if (p.t === "rows") { const v = val || {}; if (p.rows.some((r, i) => v[i] === undefined)) return { ok: false, empty: true, msg: "Réponds à chaque ligne." }; const bad = p.rows.filter((r, i) => v[i] !== r.a).length; return bad ? { ok: false, msg: `✗ ${bad} ligne(s) à corriger (en rouge).` } : { ok: true, msg: "✓ Toutes les lignes sont justes." }; }
  if (p.t === "order") { const v = val || []; if (v.length < p.items.length) return { ok: false, empty: true, msg: "Place tous les événements." }; const bad = v.filter((x, i) => x !== i).length; return bad ? { ok: false, msg: `✗ ${bad} événement(s) mal placé(s).` } : { ok: true, msg: "✓ Ordre juste." }; }
  if (p.t === "coef") {
    if (!val) return { ok: false, empty: true, msg: "Modifie les coefficients avant de vérifier." };
    const bal = coefBalance(p, val);
    if (bal.ok) { const g = val.reduce((a, b) => gcd(a, b)); if (val.every((x, i) => x === p.ans[i])) return { ok: true, msg: "✓ Équation équilibrée avec les plus petits entiers." }; if (g > 1) return { ok: false, msg: "✗ L'équation est équilibrée, mais simplifie : divise tous les coefficients par " + g + "." }; }
    return { ok: false, msg: "✗ L'équation n'est pas équilibrée : compte les atomes de chaque élément des deux côtés." };
  }
  return { ok: true, msg: "" };
}
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
function coefBalance(p, v) { const cnt = [{}, {}]; p.sp.forEach((s, i) => Object.entries(s.at).forEach(([el, n]) => { cnt[s.side][el] = (cnt[s.side][el] || 0) + n * v[i]; })); const els = Array.from(new Set([...Object.keys(cnt[0]), ...Object.keys(cnt[1])])); return { ok: els.every(el => cnt[0][el] === cnt[1][el]), cnt, els }; }

/* ---------- minuteur « Mode DS » (1 h) ---------- */
const Timer = {
  left() { const T = S.timer; const el = T.acc + (T.run ? (Date.now() - T.t0) / 1000 : 0); return Math.max(0, T.total - el); },
  start() { const T = S.timer; if (T.run || this.left() <= 0) return; T.run = true; T.t0 = Date.now(); T.show = true; save(); this.paint(); },
  pause() { const T = S.timer; if (!T.run) return; T.acc += (Date.now() - T.t0) / 1000; T.run = false; save(); this.paint(); },
  reset() { S.timer = Object.assign({}, S.timer, { acc: 0, run: false, t0: 0 }); save(); this.paint(); },
  toggleShow() { S.timer.show = !S.timer.show; save(); this.paint(); },
  fmt(s) { s = Math.ceil(s); const m = Math.floor(s / 60), r = s % 60; return `${m}:${String(r).padStart(2, "0")}`; },
  paint() {
    const x = $("#tabx"), b = $("#timerBtn"); if (b) b.setAttribute("aria-pressed", S.timer.show ? "true" : "false");
    if (!x) return; if (!S.timer.show) { x.innerHTML = ""; return; }
    const left = this.left(), over = left <= 0;
    if (over && S.timer.run) { S.timer.run = false; S.timer.acc = S.timer.total; save(); }
    x.innerHTML = `<div class="timer ${over ? "over" : left < 300 ? "low" : ""}" role="timer" aria-label="Temps restant"><span class="tt num">${over ? "⏰ Temps écoulé" : "⏱ " + this.fmt(left)}</span><button type="button" class="tb" data-t="run" aria-label="${S.timer.run ? "Mettre en pause" : "Démarrer"}">${S.timer.run ? "⏸" : "▶"}</button><button type="button" class="tb" data-t="reset" aria-label="Remettre à 1 h">↺</button></div>`;
    $("[data-t=run]", x).onclick = () => S.timer.run ? this.pause() : this.start();
    $("[data-t=reset]", x).onclick = () => this.reset();
    const live = $("#timerLive"); if (live && over && !live.dataset.done) { live.dataset.done = "1"; live.textContent = "Temps écoulé : l'heure du DS est passée. Termine ta phrase, puis vérifie tes réponses."; }
  }
};
setInterval(() => { if (S.timer.show) Timer.paint(); }, 1000);

/* ---------- navigation ---------- */
const VIEWS = ["accueil", ...EXOS.map(e => e.id), "sujets", "bilan"];
function tabs() {
  $("#tabs").innerHTML = VIEWS.map(v => {
    if (v === "accueil") return `<button class="tab" type="button" data-v="accueil">Accueil</button>`;
    if (v === "bilan") return `<button class="tab" type="button" data-v="bilan">Bilan</button>`;
    if (v === "sujets") return `<button class="tab" type="button" data-v="sujets">⏱ Sujets blancs</button>`;
    const e = EX(v); const marks = LVS.map(([l]) => lvStatus(e, l)[0] || "·").join("");
    return `<button class="tab" type="button" data-v="${v}">Ex. ${v.slice(1)}<span class="dot" aria-hidden="true">${marks}</span></button>`;
  }).join("");
  $$("#tabs .tab").forEach(b => { b.onclick = () => go(b.dataset.v); if (b.dataset.v === S.view) b.setAttribute("aria-current", "page"); });
}
function go(v, noScroll) {
  if (!VIEWS.includes(v)) v = "accueil";
  S.view = v; save(); tabs();
  if (location.hash !== "#" + v) { try { history.replaceState(null, "", "#" + v); } catch (e) {} }
  const m = $("#main");
  if (v === "accueil") renderHome(m); else if (v === "bilan") renderBilan(m); else if (v === "sujets") renderSujets(m); else renderExo(m, EX(v));
  if (!noScroll) window.scrollTo(0, 0);
  const cur = $("#tabs [aria-current]"); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest", inline: "center" });
}

function renderHome(m) {
  m.innerHTML = `<section class="view">
    <div class="panel"><p class="kicker">Mode d'emploi</p><h2 class="sec-title">S'entraîner comme au DS</h2>
      <ul class="ul">
        <li>Chaque exercice a trois paliers : <span class="lv easy">🟢 Facile</span>, <span class="lv mid">🟡 Moyen</span> et <span class="lv hard">🔴 Défi</span>. Les questions vont du plus simple au plus exigeant.</li>
        <li>Touche <b>Vérifier</b> : chaque réponse est corrigée aussitôt. Seul le premier essai compte ; ensuite, corrige librement.</li>
        <li>Bloqué ? Trois <b>coups de pouce</b> s'affichent un par un. Le corrigé apparaît quand tout est juste, ou après ton deuxième essai.</li>
        <li>Réponses rédigées : écris, valide, puis compare avec la réponse modèle et coche la grille d'auto-évaluation.</li>
        <li>Les mots tapés sont acceptés même avec une faute de frappe ou sans accent.</li>
      </ul></div>
    <button class="card-btn feature" type="button" data-go="sujets"><span class="kicker">Nouveau · format du DS</span><span class="t">⏱ Sujets blancs chronométrés (1 h)</span><span class="m">Trois sujets complets construits comme le DS : 6 questions de connaissances, puis deux exercices sur documents. Note estimée sur 20 et bilan par compétence.</span></button>
    <div class="grid-cards">${EXOS.map((e, i) => `<button class="card-btn" type="button" data-go="${e.id}"><span class="kicker">Exercice ${i + 1} · ${e.ch}</span><span class="t">${e.title}</span><span class="m">${e.cap}</span><span class="row" style="gap:.3rem">${LVS.map(([l, lab]) => { const s = lvStatus(e, l); return `<span class="chip ${s[0] === "✓" ? "ok" : s[0] ? "mid" : ""}">${lab.split(" ")[0]} ${s[0] || ""} ${s[1]}</span>`; }).join("")}</span></button>`).join("")}</div>
    <div class="box info"><p class="lab">ℹ Mode DS</p><p>Le bouton <b>⏱ Mode DS</b> en haut de page affiche un minuteur d'1 h, la durée du DS. Il reste visible pendant que tu navigues.</p></div>
  </section>`;
  $$("[data-go]", m).forEach(b => b.onclick = () => go(b.dataset.go));
}

function renderExo(m, e) {
  const l = S.lv[e.id] || "easy"; const idx = EXOS.indexOf(e);
  m.innerHTML = `<section class="view"><div><p class="kicker">Exercice ${idx + 1} · ${e.ch}</p><h2 class="sec-title">${e.title}</h2><p class="lead">Capacité travaillée : ${e.cap}</p></div>
    <div class="lvtabs" role="group" aria-label="Palier">${LVS.map(([k, lab]) => { const s = lvStatus(e, k); return `<button type="button" data-l="${k}" aria-current="${k === l}">${lab}${s[0] ? ` <span aria-label="${s[1]}">${s[0]}</span>` : ""}</button>`; }).join("")}</div>
    <article class="panel itemroot" id="item"></article>
    <div class="row" id="navx"></div></section>`;
  $$(".lvtabs button", m).forEach(b => b.onclick = () => { S.lv[e.id] = b.dataset.l; save(); renderExo(m, e); });
  renderItem(e.lv[l], e.id + "-" + l, $("#item"), LVS.find(x => x[0] === l));
  const li = LVS.findIndex(x => x[0] === l), nx = $("#navx"); const nextL = LVS[li + 1], nextE = EXOS[idx + 1];
  nx.innerHTML = `${nextL ? `<button class="btn ghost" type="button" data-nl>Palier suivant : ${nextL[1]} →</button>` : ""}${nextE ? `<button class="btn ghost" type="button" data-ne>Exercice ${idx + 2} →</button>` : `<button class="btn ghost" type="button" data-nb>Voir mon bilan</button>`}`;
  const a = $("[data-nl]", nx); if (a) a.onclick = () => { S.lv[e.id] = nextL[0]; save(); renderExo(m, e); window.scrollTo(0, 0); };
  const b = $("[data-ne]", nx); if (b) b.onclick = () => go(nextE.id);
  const c = $("[data-nb]", nx); if (c) c.onclick = () => go("bilan");
}

/* ---------- rendu d'un item dans un conteneur (exercice ou sujet blanc) ---------- */
function renderItem(it, id, root, lvl) {
  const st = itState(id);
  const docs = (corrShown(st) && it.docsSolved) ? it.docsSolved : (it.docs || []);
  root.dataset.iid = id;
  root.innerHTML = `${lvl ? `<p class="lv ${lvl[2]}">${lvl[1]}</p>` : ""}${it.intro ? `<p>${it.intro}</p>` : ""}${docs.map(docHTML).join("")}
    <div class="parts" style="display:grid;gap:.9rem">${it.parts.map((p, k) => `<div class="part" data-k="${k}"></div>`).join("")}</div>
    <div class="row acts"></div><div class="gfb" aria-live="polite"></div>
    <div class="hints hz"></div><div class="after"></div>`;
  mountDocs(root);
  it.parts.forEach((p, k) => renderPart(it, id, k, root));
  paintActions(it, id, root, lvl);
}
function renderPart(it, id, k, root) {
  const p = it.parts[k], st = S.it[id], box = $(`.part[data-k="${k}"]`, root), v = st.v[k], pid = `${id}-p${k}`;
  const checked = !!st.checked; const r = checked && scorable(p) ? checkPart(p, v) : null;
  const tag = `<span class="ctag">${COMPS[compOf(id, k, p)].split(" (")[0]}</span>`;
  let h = `<p class="pl" id="${pid}-l">${p.label} ${tag}</p>`;
  const okc = r ? (r.ok ? "is-ok" : "is-bad") : "";
  if (p.t === "num") h += `<div class="row"><input id="${pid}" class="inp ${okc}" inputmode="${p.im || "decimal"}" autocomplete="off" aria-labelledby="${pid}-l" value="${esc(v || "")}"><span class="unit">${p.unit || ""}</span></div>`;
  if (p.t === "word") h += `<div class="row"><input id="${pid}" class="inp wide ${okc}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-labelledby="${pid}-l" value="${esc(v || "")}" style="max-width:22rem"></div>`;
  if (p.t === "sci") h += `<div class="sci"><input id="${pid}" class="inp ${okc}" inputmode="decimal" aria-label="Nombre devant la puissance de 10" value="${esc((v && v.m) || "")}"><span>× 10</span><sup><input class="inp e ${okc}" inputmode="numeric" aria-label="Exposant" value="${esc((v && v.e) || "")}" style="min-height:48px"></sup><span class="unit">${p.unit}</span></div><p class="lead">Exemple : 1,5 × 10⁴ s'écrit 1,5 dans la première case et 4 dans la seconde (−4 pour 10⁻⁴).</p>`;
  if (p.t === "range") h += `<div class="row"><span>de</span><input class="inp" data-r="lo" inputmode="text" aria-label="Température basse" value="${esc((v && v.lo) || "")}" style="max-width:6.5rem"><span class="unit">°C</span><span>à</span><input class="inp" data-r="hi" inputmode="text" aria-label="Température haute" value="${esc((v && v.hi) || "")}" style="max-width:6.5rem"><span class="unit">°C</span></div>`;
  if (p.t === "choice") h += `<div class="opts" role="radiogroup" aria-labelledby="${pid}-l">${p.o.map((o, j) => { let cls = "", t = ""; if (checked && v === j) { cls = j === p.a ? "is-ok" : "is-bad"; t = j === p.a ? "✓ Juste" : "✗ Faux"; } return `<button type="button" class="opt ${cls}" role="radio" aria-checked="${v === j}" data-j="${j}"><span class="k">${"ABCD"[j]}</span><span>${o}</span>${t ? `<span class="tag">${t}</span>` : ""}</button>`; }).join("")}</div>`;
  if (p.t === "multi") h += `<div class="seg">${p.o.map((o, j) => `<button type="button" aria-pressed="${(v || []).includes(j)}" data-j="${j}">${(v || []).includes(j) ? "☑" : "☐"} ${o}</button>`).join("")}</div>`;
  if (p.t === "rows") h += `<div class="rows">${p.rows.map((row, i) => { const cur = (v || {})[i]; return `<div class="rowq"><span class="rt">${row.txt}</span><div class="seg" role="group" aria-label="${esc(row.txt)}">${p.choices.map((c, j) => { const cls = checked && cur === j ? (j === row.a ? "is-ok" : "is-bad") : ""; return `<button type="button" class="${cls}" aria-pressed="${cur === j}" data-i="${i}" data-j="${j}">${cls === "is-ok" ? "✓ " : cls === "is-bad" ? "✗ " : ""}${c}</button>`; }).join("")}</div></div>`; }).join("")}</div>`;
  if (p.t === "order") {
    const ord = order(baseId(id) + k, p.items.length); const chosen = v || [];
    h += `<div class="order-list">${ord.map(j => { const pos = chosen.indexOf(j); const cls = checked && pos >= 0 ? (pos === j ? "is-ok" : "is-bad") : ""; return `<button type="button" class="order-item ${cls}" data-j="${j}" ${pos >= 0 ? `data-pos="${pos + 1}"` : ""}><span class="n">${pos >= 0 ? pos + 1 : ""}</span><span>${p.items[j]}</span>${cls ? `<span class="tag" style="margin-left:auto;font-weight:800">${cls === "is-ok" ? "✓" : "✗"}</span>` : ""}</button>`; }).join("")}</div><div class="row"><button type="button" class="btn ghost" data-clear>Effacer l'ordre</button><span class="lead">Touche un événement placé pour le retirer.</span></div>`;
  }
  if (p.t === "coef") {
    const vals = v || p.sp.map(() => 1);
    const left = p.sp.map((s, i) => [s, i]).filter(x => x[0].side === 0), right = p.sp.map((s, i) => [s, i]).filter(x => x[0].side === 1);
    const one = ([s, i]) => `<span class="coef ${okc}"><button type="button" data-c="${i}" data-d="-1" aria-label="Diminuer le coefficient de ${s.f}">−</button><output aria-live="polite">${vals[i]}</output><button type="button" data-c="${i}" data-d="1" aria-label="Augmenter le coefficient de ${s.f}">+</button><span class="f">${s.f}</span></span>`;
    h += `<div class="coefs">${left.map(one).join(`<span class="arrow">+</span>`)}<span class="arrow">→</span>${right.map(one).join(`<span class="arrow">+</span>`)}</div>`;
    if (st.hints >= 2 || checked) { const b = coefBalance(p, vals); h += `<div class="tablewrap"><table class="t"><thead><tr><th>Élément</th><th>Atomes à gauche</th><th>Atomes à droite</th><th></th></tr></thead><tbody>${b.els.map(x => `<tr><td>${x}</td><td class="n">${b.cnt[0][x] || 0}</td><td class="n">${b.cnt[1][x] || 0}</td><td>${(b.cnt[0][x] || 0) === (b.cnt[1][x] || 0) ? "✓ égal" : "✗ différent"}</td></tr>`).join("")}</tbody></table></div>`; }
  }
  if (p.t === "text") h += `<textarea id="${pid}" class="inp" aria-labelledby="${pid}-l" placeholder="Rédige ta réponse ici, en phrases complètes…">${esc(v || "")}</textarea><p class="lead">Après validation : réponse modèle et grille d'auto-évaluation.</p>`;
  h += `<div class="pfbw" aria-live="polite">${r ? `<p class="pfb ${r.ok ? "ok" : "bad"}">${r.msg}</p>` : ""}</div>`;
  box.innerHTML = h;
  const setV = (val, rerender) => { st.v[k] = val; save(); if (rerender) renderPart(it, id, k, root); };
  const clear = () => { $$(".is-ok,.is-bad", box).forEach(x => x.classList.remove("is-ok", "is-bad")); const f = $(".pfbw", box); if (f) f.innerHTML = ""; };
  const refocus = sel => { const n = box.querySelector(sel); if (n) n.focus(); };
  if (["num", "text", "word"].includes(p.t)) { const inp = box.querySelector("input,textarea"); inp.addEventListener("input", () => { setV(inp.value, false); clear(); }); if (p.t !== "text") inp.addEventListener("keydown", ev => { if (ev.key === "Enter") { const b = $(".acts [data-check]", root); if (b) b.click(); } }); }
  if (p.t === "sci") { const [a, b] = box.querySelectorAll("input"); const upd = () => { setV({ m: a.value, e: b.value }, false); clear(); }; a.addEventListener("input", upd); b.addEventListener("input", upd); }
  if (p.t === "range") { const lo = box.querySelector('[data-r="lo"]'), hi = box.querySelector('[data-r="hi"]'); const upd = () => { setV({ lo: lo.value, hi: hi.value }, false); clear(); }; lo.addEventListener("input", upd); hi.addEventListener("input", upd); }
  if (p.t === "choice") $$(".opt", box).forEach(b => b.onclick = () => { setV(+b.dataset.j, true); refocus(`.opt[data-j="${b.dataset.j}"]`); });
  if (p.t === "multi") $$(".seg button", box).forEach(b => b.onclick = () => { const cur = (st.v[k] || []).slice(); const j = +b.dataset.j; const i = cur.indexOf(j); if (i >= 0) cur.splice(i, 1); else cur.push(j); setV(cur, true); refocus(`[data-j="${j}"]`); });
  if (p.t === "rows") $$(".seg button", box).forEach(b => b.onclick = () => { const cur = Object.assign({}, st.v[k] || {}); cur[+b.dataset.i] = +b.dataset.j; setV(cur, true); refocus(`[data-i="${b.dataset.i}"][data-j="${b.dataset.j}"]`); });
  if (p.t === "order") { $$(".order-item", box).forEach(b => b.onclick = () => { const cur = (st.v[k] || []).slice(); const j = +b.dataset.j; const i = cur.indexOf(j); if (i >= 0) cur.splice(i, 1); else cur.push(j); setV(cur, true); refocus(`[data-j="${j}"]`); }); box.querySelector("[data-clear]").onclick = () => setV([], true); }
  if (p.t === "coef") $$("[data-c]", box).forEach(b => b.onclick = () => { const cur = (st.v[k] || p.sp.map(() => 1)).slice(); const i = +b.dataset.c; cur[i] = Math.max(1, Math.min(12, cur[i] + +b.dataset.d)); setV(cur, true); refocus(`[data-c="${i}"][data-d="${b.dataset.d}"]`); });
}
function order(key, n) { const base = Array.from({ length: n }, (_, i) => i); let h = 7; for (const c of key) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff; let r = shuffle(base, h); if (r.every((x, i) => x === i)) r = r.reverse(); return r; }

function paintActions(it, id, root, lvl) {
  const st = S.it[id]; const acts = $(".acts", root), gfb = $(".gfb", root), hints = $(".hz", root), after = $(".after", root);
  const max = itemMax(it), hasText = it.parts.some(p => p.t === "text"), shown = corrShown(st);
  acts.innerHTML = `<button class="btn" type="button" data-check>${max ? "Vérifier" : "Valider ma réponse"}</button>
    ${st.hints < 3 && !(shown && st.lastOk) ? `<button class="btn ghost" type="button" data-hint>💡 Coup de pouce ${st.hints + 1}/3</button>` : ""}
    <button class="btn ghost" type="button" data-reset>↺ Recommencer</button>`;
  hints.innerHTML = it.hints.slice(0, st.hints).map((h, i) => `<p class="hint"><b>Coup de pouce ${i + 1}/3</b> · ${h}</p>`).join("");
  if (st.first) {
    const f = st.first;
    gfb.innerHTML = max ? (st.lastOk ? `<div class="fb ok"><p class="h">✓ Tout est juste${f.pts === f.max ? (st.tries === 1 ? " du premier coup !" : ".") : " (après correction)."}</p><p>Score retenu (premier essai) : ${f.pts}/${f.max}${f.hints ? ` · ${f.hints} coup(s) de pouce avant le premier essai` : ""}.</p></div>`
      : `<div class="fb bad"><p class="h">✗ ${st.lastPts}/${max} réponse(s) juste(s).</p><p>${shown ? "Le corrigé est affiché ci-dessous : corrige les réponses en rouge, puis vérifie à nouveau." : "Corrige les réponses en rouge, puis vérifie à nouveau. Le corrigé s'affichera au deuxième essai."} (Score retenu : ${f.pts}/${f.max}, premier essai.)</p></div>`) : "";
  } else gfb.innerHTML = "";
  let a = "";
  if (shown && it.corr) a += `<div class="corr"><p class="h">Corrigé</p><p>${it.corr}</p></div>`;
  if (hasText && st.first) {
    a += `<div class="panel" style="background:var(--surface-2)"><p class="kicker">Réponse rédigée · auto-évaluation</p><div class="box info"><p class="lab">ℹ Réponse modèle</p><p>${it.model}</p></div><p><b>Coche ce que ta réponse contient :</b></p><div class="crit">${it.crit.map((c, i) => `<button type="button" aria-pressed="${!!st.crit[i]}" data-ci="${i}"><span class="bx">${st.crit[i] ? "✓" : ""}</span><span>${c}</span></button>`).join("")}</div><p class="lead">Auto-évaluation : ${Object.values(st.crit).filter(Boolean).length}/${it.crit.length} critères.</p></div>`;
  }
  if (shown && st.lastOk && it.unlock) a += `<div class="panel unlock"><h3>${it.unlock.title}</h3><div class="unlockz"></div></div>`;
  after.innerHTML = a;
  if (shown && st.lastOk && it.unlock) it.unlock.mount($(".unlockz", after));
  $("[data-check]", acts).onclick = () => {
    const res = it.parts.map((p, k) => scorable(p) ? checkPart(p, st.v[k]) : null);
    const empty = res.some(r => r && r.empty);
    const textEmpty = it.parts.some((p, k) => p.t === "text" && !String(st.v[k] || "").trim());
    const pts = res.filter(r => r && r.ok).length;
    if ((empty || (!max && textEmpty)) && !st.first) { gfb.innerHTML = `<div class="fb neutral"><p class="h">Complète toutes les parties avant de vérifier.</p><p>Le premier essai n'est compté que lorsque tout est rempli.</p></div>`; return; }
    const wasShown = corrShown(st);
    st.checked = true; st.lastPts = pts; st.lastOk = pts === max; st.tries = (st.tries || 0) + 1;
    if (!st.first) st.first = { pts, max, hints: st.hints, parts: res.map(r => r ? !!r.ok : null) };
    save();
    if (!wasShown && corrShown(st) && it.docsSolved) renderItem(it, id, root, lvl);
    else { it.parts.forEach((p, k) => renderPart(it, id, k, root)); paintActions(it, id, root, lvl); }
    tabs(); if (root.dataset.sj) updSujet(root.dataset.sj);
    const g = $(".gfb", root); if (g && g.scrollIntoView) g.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  const hb = $("[data-hint]", acts); if (hb) hb.onclick = () => { st.hints = Math.min(3, st.hints + 1); save(); paintActions(it, id, root, lvl); if (st.hints === 2) it.parts.forEach((p, k) => { if (p.t === "coef") renderPart(it, id, k, root); }); const hs = $$(".hz .hint", root); const last = hs[hs.length - 1]; if (last) last.scrollIntoView({ block: "nearest", behavior: "smooth" }); };
  armButton($("[data-reset]", acts), "↺ Recommencer", "Effacer mes réponses ?", () => { const keep = st.first; S.it[id] = { v: {}, hints: 0, crit: {}, first: keep, tries: keep ? st.tries : 0, lastOk: false }; save(); renderItem(it, id, root, lvl); });
  $$(".crit button", after).forEach(b => b.onclick = () => { const i = +b.dataset.ci; st.crit[i] = !st.crit[i]; save(); paintActions(it, id, root, lvl); const nb = $(`.after [data-ci="${i}"]`, root); if (nb) nb.focus(); if (root.dataset.sj) updSujet(root.dataset.sj); });
}

/* ---------- simulateur débloqué : dilatation de l'océan ---------- */
function dilatSim(el) {
  el.innerHTML = `<p class="lead">Fais varier l'épaisseur de la couche qui se réchauffe et la hausse de température : l'élévation du niveau marin est recalculée (α = 2 × 10⁻⁴ par °C, modèle simplifié).</p>
    <div class="field"><label for="dsH">Épaisseur de la couche réchauffée : <b class="num" id="dsHv"></b></label><input id="dsH" type="range" min="100" max="2000" step="100" value="700"></div>
    <div class="field"><label for="dsT">Hausse de température : <b class="num" id="dsTv"></b></label><input id="dsT" type="range" min="0" max="3" step="0.1" value="0.5"></div>
    <div class="dilat"><svg viewBox="0 0 320 170" role="img" aria-label="Coupe de l'océan : la hauteur d'eau augmente avec la dilatation"><rect x="20" y="20" width="280" height="140" rx="6" style="fill:var(--surface-2);stroke:var(--line)"/><rect id="dsW" x="21" y="80" width="278" height="79" style="fill:var(--info-soft)"/><rect id="dsWarm" x="21" y="80" width="278" height="20" style="fill:var(--c2);opacity:.28"/><line id="dsL0" x1="20" x2="300" y1="80" y2="80" style="stroke:var(--muted);stroke-width:2" stroke-dasharray="6 4"/><line id="dsL1" x1="20" x2="300" y1="80" y2="80" style="stroke:var(--info);stroke-width:3"/><text x="304" y="84" style="fill:var(--muted);font-size:11px">avant</text></svg>
      <div class="dsres"><p>Élévation du niveau marin</p><p class="score-big num" id="dsR"></p><p class="lead" id="dsC"></p></div></div>`;
  const H = $("#dsH", el), Tt = $("#dsT", el);
  const upd = () => {
    const h = +H.value, dT = +Tt.value, dh = h * 2e-4 * dT * 100; // cm
    $("#dsHv", el).textContent = fmt(h) + " m"; $("#dsTv", el).textContent = fmt(dT, 1) + " °C"; $("#dsR", el).textContent = fmt(dh, 1) + " cm";
    $("#dsC", el).textContent = dh >= 30 ? "Soit environ " + fmt(dh / 100, 2) + " m : comparable à la hausse projetée pour 2100 dans certains scénarios." : "Avec 700 m et +0,5 °C, tu retrouves les 7 cm de l'exercice.";
    const lift = Math.min(55, dh * 0.9); $("#dsL1", el).setAttribute("y1", 80 - lift); $("#dsL1", el).setAttribute("y2", 80 - lift);
    $("#dsW", el).setAttribute("y", 80 - lift); $("#dsW", el).setAttribute("height", 79 + lift);
    $("#dsWarm", el).setAttribute("y", 80 - lift); $("#dsWarm", el).setAttribute("height", Math.min(79, h / 2000 * 79) + lift);
  };
  H.oninput = upd; Tt.oninput = upd; upd();
}

/* ---------- sujets blancs ---------- */
function sujetScore(sk) {
  const sj = SUJETS[sk]; let p1 = 0, p1done = 0; sj.kb.forEach(k => { const st = S.it[`sj-${sk}-${k}`]; if (st && st.first) { p1done++; p1 += st.first.pts; } });
  const parts = sj.ex.map(([e, l]) => { const id = `sj-${sk}-${e}-${l}`, it = EX(e).lv[l], st = S.it[id]; if (!st || !st.first) return null; const nT = it.parts.filter(p => p.t === "text").length; const crit = it.crit ? Object.values(st.crit || {}).filter(Boolean).length / it.crit.length : 0; const num = st.first.pts + crit * nT * 2, den = st.first.max + nT * 2; return den ? 7 * num / den : 0; });
  const done = p1done === 6 && parts.every(x => x !== null);
  return { p1, p1done, parts, done, total: p1 + parts.reduce((a, b) => a + (b || 0), 0) };
}
const r1 = x => fmt(Math.round(x * 2) / 2, 1).replace(/,0$/, "");
function renderSujets(m) {
  const sk = S.sj || "A", sj = SUJETS[sk];
  m.innerHTML = `<section class="view"><div><p class="kicker">Format du DS · 1 h · 20 points</p><h2 class="sec-title">Sujets blancs</h2><p class="lead">Chaque sujet suit la structure du DS : une partie de connaissances, puis deux exercices d'exploitation de documents. Aucune question n'est reprise du DS.</p></div>
    <div class="lvtabs" role="group" aria-label="Choix du sujet">${Object.entries(SUJETS).map(([k, s]) => { const sc = sujetScore(k); return `<button type="button" data-sj="${k}" aria-current="${k === sk}">${s.titre}${sc.done ? ` · ${r1(sc.total)}/20` : ""}</button>`; }).join("")}</div>
    <div class="panel"><div class="tablewrap"><table class="t"><thead><tr><th>Partie</th><th>Contenu</th><th>Points</th><th>Temps conseillé</th></tr></thead><tbody>
      <tr><td>1</td><td>Mobiliser ses connaissances · 6 questions</td><td class="n">6</td><td class="n">10 min</td></tr>
      ${sj.ex.map(([e, l], i) => `<tr><td>${i + 2}</td><td>${EX(e).title} · ${LVS.find(x => x[0] === l)[1]}</td><td class="n">7</td><td class="n">25 min</td></tr>`).join("")}</tbody></table></div>
      <div class="row"><button class="btn" type="button" id="sjGo">⏱ Démarrer le chrono (1 h)</button><span class="lead">Le minuteur reste affiché en haut de l'écran.</span></div><p class="toast" id="timerLive" aria-live="polite"></p></div>
    <h3 class="sec-title" style="font-size:1.25rem">Partie 1 · Mobiliser ses connaissances (6 points)</h3>
    ${sj.kb.map((k, i) => `<article class="panel itemroot" data-sjroot="sj-${sk}-${k}" data-n="${i + 1}"></article>`).join("")}
    ${sj.ex.map(([e, l], i) => `<h3 class="sec-title" style="font-size:1.25rem">Partie ${i + 2} · ${EX(e).title} (7 points)</h3><article class="panel itemroot" data-sjroot="sj-${sk}-${e}-${l}"></article>`).join("")}
    <div class="panel" id="sjEnd"></div></section>`;
  $$("[data-sj]", m).forEach(b => b.onclick = () => { S.sj = b.dataset.sj; save(); renderSujets(m); window.scrollTo(0, 0); });
  $("#sjGo", m).onclick = () => { if (Timer.left() <= 0) Timer.reset(); S.timer.show = true; Timer.start(); };
  $$("[data-sjroot]", m).forEach(el => { const id = el.dataset.sjroot; el.dataset.sj = sk; const x = ITEMS[id]; renderItem(x.it, id, el, el.dataset.n ? [null, `Question ${el.dataset.n}`, "mid"] : null); });
  updSujet(sk);
}
function updSujet(sk) {
  const el = $("#sjEnd"); if (!el) return; const sc = sujetScore(sk);
  el.innerHTML = `<p class="kicker">Bilan du sujet</p><div class="tablewrap"><table class="t"><thead><tr><th>Partie</th><th>Points</th></tr></thead><tbody><tr><td>1 · Connaissances</td><td class="n">${sc.p1done < 6 ? `${sc.p1}/${sc.p1done} faites sur 6` : sc.p1 + "/6"}</td></tr>${sc.parts.map((p, i) => `<tr><td>${i + 2} · ${EX(SUJETS[sk].ex[i][0]).title}</td><td class="n">${p === null ? "à faire" : r1(p) + "/7"}</td></tr>`).join("")}</tbody></table></div>
    <p class="score-big">${sc.done ? r1(sc.total) + "/20" : "…/20"}</p><p class="lead">${sc.done ? "Note estimée à partir de tes premiers essais et de ton auto-évaluation des réponses rédigées." : "La note estimée s'affiche quand toutes les parties sont validées."}</p>
    <div class="row"><button class="btn ghost" type="button" id="sjBilan">Voir mon bilan par compétence</button></div>`;
  $("#sjBilan", el).onclick = () => go("bilan");
}

/* ---------- bilan ---------- */
function compStats() {
  const r = {}; Object.keys(COMPS).forEach(k => r[k] = { ok: 0, n: 0 });
  Object.entries(ITEMS).forEach(([id, x]) => { const st = S.it[id]; if (!st || !st.first) return; x.it.parts.forEach((p, k) => { const c = compOf(id, k, p); if (p.t === "text") { if (x.it.crit) { r.redac.n += 1; r.redac.ok += Object.values(st.crit || {}).filter(Boolean).length / x.it.crit.length; } return; } const okp = st.first.parts ? st.first.parts[k] : null; if (okp === null || okp === undefined) return; r[c].n++; if (okp) r[c].ok++; }); });
  return r;
}
function missedParts() { const out = []; Object.entries(ITEMS).forEach(([id, x]) => { const st = S.it[id]; if (!st || !st.first || !st.first.parts) return; x.it.parts.forEach((p, k) => { if (st.first.parts[k] === false) out.push(`${x.label} · ${String(p.label).replace(/<[^>]+>/g, "").slice(0, 80)}`); }); }); return out; }
function totals() { let pts = 0, max = 0, done = 0, n = 0; EXOS.forEach(e => LVS.forEach(([l]) => { n++; const st = S.it[e.id + "-" + l]; max += itemMax(e.lv[l]); if (st && st.first) { done++; pts += st.first.pts; } })); return { pts, max, done, n }; }
const ACTIVITY = "Entraînement au DS · Atmosphère et climat · Terminale, Enseignement scientifique, Thème 1 (1.1 L'atmosphère terrestre et la vie ; 1.2 La complexité du système climatique). Sept exercices sur documents à trois paliers (unités de pression, diagramme d'état de l'eau, fer et dioxygène, météo et climat, paléotempératures, pollens et forêts, rétroactions et niveau marin) et trois sujets blancs d'1 h au format du DS. Score compté au premier essai, sans points négatifs.";
function bilanText(name) {
  const T = totals(), cs = compStats();
  let t = `RÉSUMÉ DE L'ACTIVITÉ\n${ACTIVITY}\n\nBILAN\nÉlève : ${name || "—"}\nDate : ${today()}\n\nExercices (points au premier essai)\n`;
  EXOS.forEach((e, i) => { t += `- Exercice ${i + 1} · ${e.title} : ` + LVS.map(([l, lab]) => { const st = S.it[e.id + "-" + l]; return `${lab.split(" ")[1]} ${st && st.first ? st.first.pts + "/" + st.first.max : "—"}`; }).join(" · ") + "\n"; });
  t += `Total exercices : ${T.pts}/${T.max} (${T.done}/${T.n} paliers faits)\n\nSujets blancs (note estimée)\n`;
  Object.entries(SUJETS).forEach(([k, s]) => { const sc = sujetScore(k); t += `- ${s.titre} : ${sc.done ? r1(sc.total) + "/20" : "non terminé"}\n`; });
  t += `\nBilan par compétence (premier essai)\n`; Object.entries(COMPS).forEach(([k, lab]) => { const c = cs[k]; t += `- ${lab} : ${c.n ? (k === "redac" ? Math.round(c.ok / c.n * 100) + " % des critères cochés" : c.ok + "/" + c.n) : "—"}\n`; });
  const ms = missedParts(); t += `\nQuestions ratées au premier essai (${ms.length})\n${ms.length ? ms.map(x => "- " + x).join("\n") : "- aucune"}\n`;
  return t;
}
function renderBilan(m) {
  const T = totals(), cs = compStats(), ms = missedParts();
  m.innerHTML = `<section class="view"><div><p class="kicker">Bilan</p><h2 class="sec-title">Mon bilan d'entraînement</h2><p class="lead">Points comptés au premier essai. ${T.done}/${T.n} paliers faits.</p></div>
    <div class="panel"><p class="score-big">${T.pts}/${T.max}</p><div class="bar" aria-hidden="true"><i style="width:${T.max ? T.pts / T.max * 100 : 0}%"></i></div></div>
    <div class="panel"><h3>Par compétence</h3><div class="comps">${Object.entries(COMPS).map(([k, lab]) => { const c = cs[k]; const r = c.n ? c.ok / c.n : 0; return `<div class="comp"><div class="row" style="justify-content:space-between"><span>${lab}</span><b class="num">${c.n ? (k === "redac" ? Math.round(r * 100) + " %" : c.ok + "/" + c.n) : "—"}</b></div><div class="bar" aria-hidden="true"><i style="width:${r * 100}%"></i></div></div>`; }).join("")}</div></div>
    <div class="panel"><h3>Exercices</h3><div class="tablewrap"><table class="t"><thead><tr><th>Exercice</th>${LVS.map(([, lab]) => `<th>${lab}</th>`).join("")}</tr></thead><tbody>${EXOS.map((e, i) => `<tr><td>${i + 1}. ${e.title}</td>${LVS.map(([l]) => { const st = S.it[e.id + "-" + l]; return `<td class="n">${st && st.first ? `${st.first.pts === st.first.max ? "✓ " : "◐ "}${st.first.pts}/${st.first.max}` : "—"}</td>`; }).join("")}</tr>`).join("")}</tbody></table></div></div>
    <div class="panel"><h3>Sujets blancs</h3><div class="tablewrap"><table class="t"><thead><tr><th>Sujet</th><th>Note estimée</th></tr></thead><tbody>${Object.entries(SUJETS).map(([k, s]) => { const sc = sujetScore(k); return `<tr><td>${s.titre}</td><td class="n">${sc.done ? r1(sc.total) + "/20" : "non terminé"}</td></tr>`; }).join("")}</tbody></table></div></div>
    <div class="panel"><h3>Questions ratées au premier essai</h3>${ms.length ? `<ul class="ul">${ms.map(x => `<li>${x}</li>`).join("")}</ul>` : "<p>Aucune pour l'instant.</p>"}</div>
    <div class="panel"><h3>Transmettre mon bilan</h3><p class="lead">Le fichier contient le résumé de l'activité, tes points par exercice et par compétence, tes sujets blancs et la liste des questions ratées.</p><div id="bt"></div></div>
    <div class="panel"><h3>Recommencer</h3><p class="lead">Efface toutes les réponses de cet entraînement sur cet appareil.</p><div class="row"><button class="btn ghost" type="button" id="reset">Tout effacer</button></div></div></section>`;
  renderBilanTools($("#bt"), bilanText, name => `<p class="kicker">Bilan à montrer au professeur</p><h2>${esc(name || "Élève")}</h2><p>Entraînement Atmosphère et climat · ${today()}</p>${Object.entries(COMPS).map(([k, lab]) => { const c = cs[k]; return `<div class="line"><span>${lab}</span><b class="num">${c.n ? (k === "redac" ? Math.round(c.ok / c.n * 100) + " %" : c.ok + "/" + c.n) : "—"}</b></div>`; }).join("")}<div class="line"><span><b>Exercices (premier essai)</b></span><b class="num">${T.pts}/${T.max}</b></div>${Object.entries(SUJETS).map(([k, s]) => { const sc = sujetScore(k); return sc.done ? `<div class="line"><span>${s.titre}</span><b class="num">${r1(sc.total)}/20</b></div>` : ""; }).join("")}`, "entrainement-atmosphere-climat");
  armButton($("#reset"), "Tout effacer", "Confirmer l'effacement ?", () => { S.it = {}; S.lv = {}; S.timer = Object.assign({}, DEF.timer); save(); Timer.paint(); go("accueil"); });
}

/* ---------- démarrage ---------- */
Display.init(S, save);
{ const tb = $("#timerBtn"); if (tb) tb.onclick = () => Timer.toggleShow(); }
Timer.paint();
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && h !== S.view && VIEWS.includes(h)) go(h); });
go(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : (S.view || "accueil"), true);
