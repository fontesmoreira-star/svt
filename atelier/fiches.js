/* ===== Fiches interactives + rappel espacé ===== */
Store.key = "ds-climat-tle-fiches-v2";

const B = {
  info: (t, h) => `<div class="box info"><p class="lab">ℹ ${t || "À retenir"}</p>${h}</div>`,
  warn: (h) => `<div class="box warn"><p class="lab">⚠ Vigilance</p>${h}</div>`,
  key: (t, h) => `<div class="box key"><p class="lab">✔ ${t || "Règle clé"}</p>${h}</div>`,
  err: (h) => `<div class="box err"><p class="lab">⛔ Erreur critique</p>${h}</div>`
};
const ul = items => `<ul style="margin:0;padding-left:1.2rem;display:grid;gap:.35rem">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
const seg = (name, opts, cur) => `<div class="seg" role="group" aria-label="${name}">${opts.map(([k, lab]) => `<button type="button" data-s="${k}" aria-pressed="${k === cur}">${lab}</button>`).join("")}</div>`;

/* ---------- fiches ---------- */
const FICHES = [
  { id: "f1", ch: 1, title: "De l'atmosphère primitive à l'atmosphère actuelle", cap: "Analyser des données en lien avec l'évolution de la composition de l'atmosphère au cours des temps géologiques.",
    body: () => ul(["Il y a environ <b>4,6 Ga</b>, l'atmosphère primitive était composée surtout de <b>vapeur d'eau (H₂O)</b>, de <b>dioxyde de carbone (CO₂)</b> et de <b>diazote (N₂)</b>.", "Aujourd'hui : environ <b>78 % de N₂</b> et <b>21 % de O₂</b>, avec des traces d'autres gaz (H₂O, CO₂, CH₄, N₂O, argon…).", "Cette transformation est liée à la <b>condensation de l'eau</b> (formation des océans) puis à l'apparition de la vie et de la <b>photosynthèse</b>.", "<b>Vénus</b> : 96,5 % de CO₂ et 92 atm au sol. Son effet de serre très intense explique ≈ 470 °C en surface, alors que Mercure, plus proche du Soleil, n'atteint qu'environ 167 °C."]),
    widget: "atm", after: () => B.warn(`<p>La quantité totale de diazote est restée à peu près stable. Sa <b>proportion</b> a augmenté parce que les autres gaz (H₂O, CO₂) ont quitté l'atmosphère : un pourcentage dépend de tous les gaz du mélange.</p>`),
    cards: [["Quels sont les trois gaz majoritaires de l'atmosphère primitive ?", "Vapeur d'eau (≈ 80 %), dioxyde de carbone (≈ 15 %) et diazote (≈ 5 %)."], ["Quelle est la composition actuelle de l'atmosphère ?", "≈ 78 % de N₂, 21 % de O₂, et des traces d'autres gaz (H₂O, CO₂, CH₄, N₂O, argon…)."], ["Pourquoi Vénus est-elle plus chaude que Mercure, pourtant plus proche du Soleil ?", "Son atmosphère dense, composée à 96,5 % de CO₂, provoque un effet de serre très intense."]] },
  { id: "f2", ch: 1, title: "L'eau : états physiques et origine des océans", cap: "Déterminer l'état physique de l'eau pour une température et une pression données à partir de son diagramme d'état.",
    body: () => ul(["L'état de l'eau dépend de la <b>température</b> et de la <b>pression</b> : on le lit sur le <b>diagramme d'état</b>.", "<b>Point triple</b> (0,01 °C ; 611 Pa) : les trois états coexistent. Sous cette pression, l'eau liquide n'existe pas.", "<b>Formation des océans</b> : en refroidissant, la surface de la Terre primitive a permis la <b>condensation</b> de la vapeur d'eau atmosphérique.", "<b>Double origine de l'eau</b> : interne (<b>dégazage du manteau</b>, volcanisme : 82 % de H₂O dans les gaz) et externe (<b>chondrites</b> et comètes du bombardement primitif : 78 % de H₂O libérés)."]),
    widget: "phase", after: () => B.key("Règle clé · Unités de pression", `<p>1 atm = 101 325 Pa = 760 mmHg · 1 bar = 10⁵ Pa = 1 000 hPa · 1 hPa = 100 Pa = 1 mbar</p>`) + B.warn(`<p>Sur le diagramme, l'axe des pressions est <b>logarithmique</b> : chaque graduation multiplie la pression par 10. Le milieu entre 10⁶ et 10⁷ vaut environ 3 × 10⁶, pas 5 × 10⁶.</p>`),
    cards: [["Comment les océans se sont-ils formés ?", "En se refroidissant, la surface de la Terre primitive a permis la condensation (liquéfaction) de la vapeur d'eau de l'atmosphère."], ["D'où vient l'eau terrestre ?", "Double origine : interne (dégazage du manteau, volcanisme) et externe (météorites de type chondrite, comètes)."], ["Pourquoi l'eau liquide n'est-elle pas stable à la surface de Mars ?", "La pression au sol (≈ 600 Pa) est inférieure à celle du point triple (611 Pa) : la glace passe directement à l'état de vapeur."]] },
  { id: "f3", ch: 1, title: "Le dioxygène : une histoire écrite dans le fer", cap: "Mettre en relation la production de O₂ dans l'atmosphère avec des indices géologiques ; ajuster les équations d'oxydation du fer.",
    body: () => ul(["Les premières traces de vie, les <b>stromatolithes</b>, datent d'au moins <b>3,5 Ga</b>. Construits par des <b>cyanobactéries</b>, ils produisent du dioxygène par <b>photosynthèse</b> : 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂.", "Ce dioxygène oxyde d'abord le <b>fer dissous des océans</b> : dépôt de <b>fers rubanés</b> (3,5 à 2,4 Ga).", "Quand les espèces réduites des océans sont oxydées, le dioxygène s'accumule dans l'<b>atmosphère</b> à partir de <b>2,4 Ga</b> : formation de <b>paléosols rouges</b>.", "La teneur actuelle (≈ 21 %) est atteinte vers <b>500 Ma</b>."]),
    widget: ["o2", "frise"], after: () => B.info("Expérience et équations", `<p>Fe²⁺ (soluble, solution verdâtre) + dioxygène → fer (III) (insoluble, précipité rougeâtre).</p><p class="eq">4 Fe + 3 O₂ → 2 Fe₂O₃</p><p class="eq">4 Fe²⁺ + O₂ + 10 H₂O → 4 Fe(OH)₃ + 8 H⁺</p><p class="eq">2 Fe(OH)₃ → Fe₂O₃ + 3 H₂O</p>`) + B.warn(`<p>Le dioxygène ne passe pas tout de suite dans l'air : pendant plus d'un milliard d'années, il est consommé dans l'océan par l'oxydation du fer.</p>`),
    cards: [["Que révèlent les fers rubanés ?", "Du dioxygène était présent dans les océans entre 3,5 et 2,4 Ga : il oxydait le fer dissous (Fe²⁺) en oxydes de fer (III) insolubles."], ["Que révèlent les paléosols rouges ?", "À partir de 2,4 Ga, l'atmosphère contient du dioxygène : le fer des sols continentaux est oxydé sur place (hématite)."], ["Quand la teneur actuelle en O₂ (≈ 21 %) est-elle atteinte ?", "Il y a environ 500 millions d'années."]] },
  { id: "f4", ch: 1, title: "La couche d'ozone, bouclier contre les UV", cap: "Mettre en relation des spectres d'absorption de l'ozone et de l'ADN dans le domaine ultraviolet.",
    body: () => ul(["Dans la <b>stratosphère</b>, les <b>UV</b> dissocient le dioxygène : O₂ → O + O, puis <b>O + O₂ → O₃</b>.", "La couche d'ozone est permanente ; sa concentration est maximale vers <b>20 à 30 km</b> d'altitude.", "Elle <b>absorbe une grande partie des UV</b>, que l'ADN absorbe aussi : ils sont <b>mutagènes</b> (cancers de la peau).", "Les <b>CFC</b>, inoffensifs pour les êtres vivants, libèrent sous l'effet des UV du <b>chlore</b> qui détruit l'ozone : Cl + O₃ → ClO + O₂, puis ClO + O → Cl + O₂. Le chlore est régénéré.", "Le <b>protocole de Montréal</b> (1987) a interdit les CFC : la couche d'ozone se reconstitue lentement."]),
    widget: "uv", after: () => B.warn(`<p>Sans dioxygène, pas d'ozone : la couche d'ozone est elle aussi une conséquence de la photosynthèse.</p>`),
    cards: [["Comment se forme l'ozone stratosphérique ?", "Les UV dissocient O₂ en deux atomes O ; chaque atome O s'associe à un O₂ : O + O₂ → O₃."], ["Pourquoi la couche d'ozone protège-t-elle les êtres vivants ?", "Elle absorbe une grande partie des UV solaires, qui sont absorbés par l'ADN et peuvent provoquer des mutations."], ["Pourquoi un seul atome de chlore détruit-il de nombreuses molécules d'ozone ?", "Il est régénéré à la fin du cycle (Cl + O₃ → ClO + O₂ ; ClO + O → Cl + O₂) et recommence."]] },
  { id: "f5", ch: 1, title: "Échanges entre biosphère et atmosphère", cap: "Suivre l'évolution de la teneur atmosphérique en dioxygène et la relier à l'évolution de la biodiversité.",
    body: () => ul(["Aujourd'hui, les <b>sources</b> et les <b>puits</b> de dioxygène sont surtout liés aux êtres vivants et aux combustions.", "<b>Photosynthèse</b> : absorbe du CO₂, rejette du O₂ (élodée : le rouge de crésol vire au rouge, signe d'un milieu appauvri en CO₂).", "<b>Respiration</b> : consomme du O₂, rejette du CO₂ (criquet : baisse du O₂ mesurée en ExAO, eau de chaux troublée).", "<b>Combustions</b> : C + O₂ → CO₂ ; environ 37 Gt de O₂ consommées par an.", "Au <b>Carbonifère</b> (−359 à −299 Ma), le O₂ atteint ≈ 35 % : des libellules géantes (<i>Meganeura</i>, 70 cm d'envergure) vivaient alors. L'atmosphère a influencé l'évolution de certaines espèces."]),
    widget: "flux", after: () => "",
    cards: [["Citer une source et deux puits actuels de dioxygène atmosphérique.", "Source : la photosynthèse. Puits : la respiration et les combustions (et l'oxydation de la matière organique)."], ["Quel flux de dioxygène est d'origine humaine ?", "Les combustions (≈ 37 Gt/an), qui consomment du O₂ et rejettent du CO₂."], ["Quel lien entre l'atmosphère du Carbonifère et les libellules géantes ?", "Une teneur en O₂ élevée (≈ 35 %) a pu favoriser le gigantisme de certains insectes comme Meganeura."]] },
  { id: "f6", ch: 2, title: "Météo ou climat ?", cap: "Distinguer sur un document des données relevant du climat d'une part, de la météorologie d'autre part.",
    body: () => ul(["Météorologie et climatologie utilisent <b>les mêmes grandeurs</b> : température, pression, humidité, précipitations, nébulosité, vitesse et direction du vent.", "La <b>météorologie</b> étudie les phénomènes atmosphériques et les <b>prévoit à court terme</b> (jours, semaines).", "Un <b>climat</b> est un ensemble de <b>moyennes</b> de grandeurs atmosphériques observées dans une région donnée pendant une période donnée : les <b>normales</b> sont calculées sur <b>30 ans</b>.", "La <b>climatologie</b> étudie les variations du climat local ou global à moyen ou long terme (années, siècles, millénaires)."]),
    widget: "reveal", after: () => B.key("Règle clé · Calculer un écart", `<p><b>Écart = valeur observée − valeur de référence</b>, toujours avec son <b>signe</b> et son <b>unité</b>. Exemple : 31,0 °C observés pour une normale de 24,5 °C → écart = +6,5 °C.</p>`) + B.warn(`<p>Un épisode isolé (canicule, hiver très froid) ne suffit pas à établir une tendance climatique. L'étendue de la carte ne suffit pas non plus : une carte du monde un jour donné reste un document météorologique.</p>`),
    cards: [["Qu'est-ce qu'un climat ?", "Un ensemble de moyennes de grandeurs atmosphériques observées dans une région donnée pendant une période donnée (normales calculées sur 30 ans)."], ["Quelles grandeurs utilisent la météorologie et la climatologie ?", "Les mêmes : température, pression, humidité, précipitations, nébulosité, vitesse et direction du vent."], ["Comment calcule-t-on un écart à la normale ?", "Écart = valeur observée − valeur de référence, avec son signe et son unité."]] },
  { id: "f7", ch: 2, title: "Les indicateurs du climat global", cap: "Interpréter des documents donnant la variation d'un indicateur climatique en fonction du temps.",
    body: () => ul(["Principal indicateur : la <b>température moyenne de la Terre</b>, calculée à partir de mesures <b>in situ</b> et <b>satellitaires</b>.", "Autres indicateurs : <b>niveau moyen des océans</b>, <b>étendue des glaciers</b> et des <b>glaces polaires</b>.", "Tous montrent une évolution récente cohérente : hausse de la température, montée du niveau marin, recul des glaces."]),
    widget: "indic", after: () => B.key("Règle clé · Taux de variation", `<p><b>Vitesse moyenne = variation ÷ durée</b>, avec les unités. Exemple : +8 cm de 1993 à 2015 → 80 mm ÷ 22 ans ≈ 3,6 mm/an.</p>`) + B.err(`<p>Ne confonds pas <b>banquise</b> (glace de mer, qui flotte : sa fonte fait très peu monter le niveau) et <b>glaces continentales</b> (glaciers, calottes : leur fonte fait monter le niveau marin).</p>`),
    cards: [["Citer trois indicateurs du climat global.", "Température moyenne globale, niveau moyen des océans, étendue des glaciers et des glaces polaires."], ["Quelles sont les deux causes de la montée du niveau marin ?", "La dilatation thermique de l'eau qui se réchauffe et la fonte des glaces continentales."], ["Pourquoi la fonte de la banquise fait-elle très peu monter le niveau marin ?", "La banquise est de la glace de mer qui flotte : elle déplace déjà un volume d'eau équivalent."]] },
  { id: "f8", ch: 2, title: "La variabilité naturelle du climat", cap: "Identifier des tendances d'évolution de la température sur plusieurs échelles de temps ; identifier des traces géologiques, indices de variations climatiques passées (pollens, glaciers).",
    body: () => ul(["Le climat varie naturellement à <b>plusieurs échelles de temps</b>.", "Sur 800 000 ans : alternance de <b>périodes glaciaires</b> (longues, froides) et <b>interglaciaires</b> (courtes, chaudes), avec une périodicité d'environ <b>100 000 ans</b>.", "Il y a <b>20 000 ans</b> : dernier maximum glaciaire ; réchauffement il y a environ <b>10 000 ans</b>.", "Indices : <b>moraines</b> et vallées glaciaires (ancienne extension des glaciers), <b>pollens</b> conservés dans les sédiments (végétation, donc climat), archives comme les <b>dates de floraison</b> des cerisiers à Kyoto (température du printemps)."]),
    widget: "paleo", after: () => B.key("Méthode · Exploiter un diagramme pollinique", `<div class="steps3"><div><span class="s">Je vois</span><span>Je relève les plantes dominantes avec leurs pourcentages et leurs dates.</span></div><div><span class="s">Je sais</span><span>J'utilise les préférences climatiques fournies.</span></div><div><span class="s">J'en déduis</span><span>Je conclus sur le climat de chaque période, puis sur son évolution.</span></div></div>`) + B.warn(`<p>Un pourcentage de pollen est une <b>part du total</b> : il peut monter simplement parce que d'autres plantes reculent.</p>`),
    cards: [["Quelle est la périodicité des cycles glaciaire–interglaciaire récents ?", "Environ 100 000 ans."], ["Que s'est-il passé il y a 20 000 ans, puis vers 10 000 ans ?", "Une période glaciaire (dernier maximum glaciaire), puis un réchauffement qui mène au climat actuel."], ["Que révèle une moraine éloignée du front actuel d'un glacier ?", "Le glacier était plus étendu autrefois : le climat était plus froid."]] },
  { id: "f9", ch: 2, title: "Le réchauffement climatique actuel", cap: "Analyser la variation au cours du temps de la teneur atmosphérique en CO₂ et de la température moyenne.",
    body: () => ul(["Depuis un siècle et demi, on mesure un réchauffement global d'environ <b>+1 °C</b>.", "Il est la réponse du système climatique au renforcement de l'effet de serre, dû aux émissions de <b>gaz à effet de serre</b> : <b>CO₂, CH₄, N₂O</b> et <b>vapeur d'eau</b>.", "Depuis plusieurs centaines de milliers d'années, <b>jamais le CO₂ n'a augmenté aussi vite</b> qu'aujourd'hui.", "L'énergie supplémentaire est surtout <b>stockée par les océans</b>, mais aussi par l'air et les sols : la température moyenne et le niveau des océans augmentent."]),
    widget: "chain", after: () => "",
    cards: [["Citer quatre gaz à effet de serre.", "CO₂, CH₄, N₂O et vapeur d'eau."], ["Où est stockée l'essentiel de l'énergie supplémentaire ?", "Dans les océans (et, dans une moindre mesure, dans l'air et les sols)."], ["Qu'a d'exceptionnel l'augmentation actuelle du CO₂ ?", "Jamais, depuis plusieurs centaines de milliers d'années, sa concentration n'a augmenté aussi rapidement."]] },
  { id: "f10", ch: 2, title: "Rétroactions et rôle de l'océan", cap: "Identifier les relations de causalité (actions et rétroactions) qui agissent sur la dynamique du système climatique.",
    body: () => ul(["Une <b>rétroaction positive</b> amplifie la perturbation : vapeur d'eau, recul des glaces, dégel du pergélisol.", "Une <b>rétroaction négative</b> la freine : à court terme, l'accroissement de la végétalisation (puits de CO₂).", "L'<b>océan</b> joue un rôle d'<b>amortisseur</b> : il absorbe une grande partie de l'énergie supplémentaire et une partie du CO₂ émis.", "Conséquences : <b>dilatation thermique</b> de l'eau, qui s'ajoute à la <b>fonte des glaces continentales</b> pour élever le niveau marin ; changement <b>irréversible</b> à l'échelle de plusieurs siècles, car l'énergie stockée retournera vers l'atmosphère."]),
    widget: ["loops", "labo", "dilat"], after: () => "",
    cards: [["Qu'est-ce qu'une rétroaction positive ?", "Un mécanisme qui amplifie la perturbation de départ (ex. : réchauffement → dégel du pergélisol → libération de GES → réchauffement)."], ["Citer une rétroaction négative.", "À court terme, l'accroissement de la végétalisation, qui absorbe du CO₂."], ["Pourquoi le changement climatique est-il irréversible sur plusieurs siècles ?", "L'énergie accumulée par les océans retournera progressivement vers l'atmosphère."]] }
];
const CARDS = []; FICHES.forEach(f => f.cards.forEach((c, i) => CARDS.push({ id: f.id + "c" + i, f, q: c[0], a: c[1] })));

/* ---------- état ---------- */
const DEF = { fs: 21, theme: null, proj: false, view: "ch1", seen: {}, box: {}, last: {}, ws: {}, firstAns: {} };
let S = Store.load(DEF);
const save = () => Store.save(S);
const DAY = 86400000, GAP = [0, 0, 1, 3, 7, 14];
const boxOf = id => S.box[id] || 0;
const isDue = id => { const b = boxOf(id); if (b === 0) return true; return Date.now() - (S.last[id] || 0) >= GAP[b] * DAY; };

/* ---------- widgets ---------- */
const WIDGETS = {
  atm(el) {
    const cur = S.ws.atm || "prim";
    const lab = { prim: "Terre primitive (≈ 4,6 Ga)", act: "Terre actuelle", venus: "Vénus actuelle" };
    el.innerHTML = `<p class="pl"><b>Compare les compositions</b> : touche une atmosphère, puis une barre.</p>${seg("Atmosphère", [["prim", "Terre primitive"], ["act", "Terre actuelle"], ["venus", "Vénus"]], cur)}<div class="chartbox" id="wAtm"></div>`;
    mountChart($("#wAtm", el), { type: "bar", categories: ATM.cats, series: [{ name: lab[cur], values: ATM[cur], color: cur === "venus" ? "c2" : "c1" }], yMax: 100, yStep: 20, xTitle: "Gaz", yTitle: "Proportion (% du volume)", unit: "", legend: false, h: 13,
      valueLabel: (v, ci) => (v === 0 ? (ATM.trace[cur][ci] ? "traces" : "0 %") : fmt(v) + " %"), alt: "Composition de l'atmosphère : " + lab[cur] });
    $$(".seg button", el).forEach(b => b.onclick = () => { S.ws.atm = b.dataset.s; save(); WIDGETS.atm(el); });
  },
  phase(el) {
    const P = { mercure: { n: "Mercure", P: null, t0: -170, t1: 480, res: "<b>Pression quasi nulle</b> : on ne peut pas placer Mercure sur le diagramme. Sans atmosphère, l'eau ne peut pas y rester liquide ; elle ne subsiste que sous forme de glace dans des zones très froides." },
      venus: { n: "Vénus", P: 9e6, t0: 450, t1: 480, res: "Toute la plage de température est dans le domaine du <b>gaz</b> : l'eau n'existe que sous forme de vapeur." },
      terre: { n: "Terre", P: 1e5, t0: -70, t1: 60, res: "La ligne traverse les domaines <b>solide</b> et <b>liquide</b> ; la vapeur d'eau est aussi présente dans l'atmosphère : on observe <b>les trois états</b>." },
      mars: { n: "Mars", P: 6e2, t0: -120, t1: 30, res: "La pression (≈ 600 Pa) est sous celle du point triple : l'eau est <b>solide ou gazeuse</b>, jamais liquide de façon stable." } };
    const cur = S.ws.phase || "terre", p = P[cur];
    el.innerHTML = `<p class="pl"><b>Place une planète</b> sur le diagramme (données : pression au sol, températures extrêmes en surface).</p>${seg("Planète", Object.keys(P).map(k => [k, P[k].n]), cur)}
      <div class="chartbox" id="wPh"></div><div class="fb neutral"><p class="h">${p.n}${p.P ? ` · P ≈ ${fmtPow(p.P)} Pa · T de ${fmt(p.t0)} à ${fmt(p.t1)} °C` : ""}</p><p>${p.res}</p></div>`;
    mountChart($("#wPh", el), phaseSpec({ readState: true, segments: p.P ? [{ P: p.P, t0: p.t0, t1: p.t1, label: p.n, color: "c3" }] : [], readHint: "Touche le diagramme : la température, la pression et l'état de l'eau s'affichent." }));
    $$(".seg button", el).forEach(b => b.onclick = () => { S.ws.phase = b.dataset.s; save(); WIDGETS.phase(el); });
  },
  frise(el) {
    const EV = [
      { t: 4.6, d: "4,6 Ga", n: "Formation de la Terre", v: "Atmosphère primitive : H₂O, CO₂, N₂.", s: "Pas de dioxygène.", x: "La vapeur d'eau se condense en refroidissant : formation des océans." },
      { t: 3.5, d: "≥ 3,5 Ga", n: "Stromatolithes", v: "Structures carbonatées construites par des micro-organismes ressemblant aux cyanobactéries actuelles.", s: "Les cyanobactéries réalisent la photosynthèse, qui rejette du O₂.", x: "Du dioxygène est produit dans l'océan dès au moins 3,5 Ga." },
      { t: 3.0, d: "3,5 à 2,4 Ga", n: "Fers rubanés", v: "Alternance de couches de silice et de couches rouges d'oxydes de fer (III), déposées dans les océans.", s: "Fe²⁺ est soluble ; au contact du O₂, il forme du fer (III) insoluble qui précipite.", x: "Le dioxygène était présent dans l'océan et oxydait le fer dissous." },
      { t: 2.4, d: "2,4 Ga", n: "Paléosols rouges", v: "Sols continentaux gris (fer II) avant 2,4 Ga, puis rouges (hématite) de 2,4 à 2 Ga.", s: "Sur un continent, le fer est oxydé sur place si l'air contient du O₂.", x: "Le dioxygène s'accumule dans l'atmosphère à partir de 2,4 Ga." },
      { t: 0.5, d: "≈ 500 Ma", n: "Teneur actuelle", v: "La teneur en O₂ atteint environ 21 %.", s: "La couche d'ozone, formée à partir du O₂, filtre une grande partie des UV.", x: "L'atmosphère actuelle s'est mise en place progressivement." }];
    const cur = S.ws.frise ?? 1, e = EV[cur];
    el.innerHTML = `<p class="pl"><b>Parcours la frise</b> : touche un événement.</p>
      <div style="position:relative;height:2.6rem;margin:.4rem 1rem 0" aria-hidden="true"><div style="position:absolute;left:0;right:0;top:1.1rem;height:6px;border-radius:3px;background:linear-gradient(90deg,var(--surface-2),var(--accent))"></div>${EV.map((x, i) => `<span style="position:absolute;left:${(4.6 - x.t) / 4.6 * 100}%;top:.45rem;transform:translateX(-50%);width:1.4rem;height:1.4rem;border-radius:50%;display:grid;place-items:center;font-size:.7rem;font-weight:800;background:${i === cur ? "var(--accent)" : "var(--surface)"};color:${i === cur ? "var(--accent-ink)" : "var(--ink)"};border:2px solid var(--accent)">${i + 1}</span>`).join("")}</div>
      <div class="row" style="justify-content:space-between;font-size:.75rem;color:var(--muted);margin:0 .2rem"><span>−4,6 Ga</span><span>aujourd'hui</span></div>
      <div class="seg" role="group" aria-label="Événements">${EV.map((x, i) => `<button type="button" data-s="${i}" aria-pressed="${i === cur}">${i + 1}. ${x.d}</button>`).join("")}</div>
      <div class="panel" style="background:var(--surface-2)"><h3>${cur + 1}. ${e.n} <span class="chip">${e.d}</span></h3><div class="steps3"><div><span class="s">Je vois</span><span>${e.v}</span></div><div><span class="s">Je sais</span><span>${e.s}</span></div><div><span class="s">J'en déduis</span><span>${e.x}</span></div></div></div>`;
    $$(".seg button", el).forEach(b => b.onclick = () => { S.ws.frise = +b.dataset.s; save(); WIDGETS.frise(el); const nb = $(`[data-s="${b.dataset.s}"]`, el); if (nb) nb.focus(); });
  },
  uv(el) {
    const interp = (arr, l) => { for (let i = 1; i < UVL.length; i++) if (l <= UVL[i]) { const f = (l - UVL[i - 1]) / (UVL[i] - UVL[i - 1]); return arr[i - 1] + f * (arr[i] - arr[i - 1]); } return arr[arr.length - 1]; };
    let maxP = 0; for (let l = 250; l <= 360; l += 5) maxP = Math.max(maxP, interp(UV_SOL, l) * interp(UV_ADN, l));
    const gauge = (id, lab, col) => `<div style="display:grid;gap:.2rem"><div class="row" style="justify-content:space-between"><span>${lab}</span><b class="num" id="${id}v"></b></div><div class="bar"><i id="${id}b" style="width:0;background:var(--${col})"></i></div></div>`;
    el.innerHTML = `<p class="pl"><b>Fais varier la longueur d'onde</b> des UV et compare les deux spectres.</p>
      <div class="field"><label for="lam">Longueur d'onde : <span class="num" id="lamv"></span></label><input id="lam" type="range" min="250" max="360" step="5" style="width:100%;min-height:48px;accent-color:var(--accent)"></div>
      ${gauge("gs", "Part du rayonnement qui atteint le sol (le reste est absorbé par l'ozone)", "c2")}${gauge("ga", "Absorption par l'ADN (% du maximum)", "c3")}${gauge("gr", "Risque relatif pour l'ADN au sol (100 % = longueur d'onde la plus dangereuse)", "c1")}
      <p aria-live="polite">Risque pour l'ADN au sol : <span class="chip" id="risk"></span></p>
      <p class="lead" style="font-size:.8rem">⚠ Valeurs simulées (modèle simplifié). Risque relatif = part atteignant le sol × absorption par l'ADN.</p>`;
    const r = $("#lam", el);
    const upd = () => {
      const lam = +r.value; S.ws.uv = lam; save();
      const sol = interp(UV_SOL, lam), adn = interp(UV_ADN, lam), risk = sol * adn / maxP * 100;
      const lvl = risk >= 60 ? ["✗ fort", "bad"] : risk >= 20 ? ["◐ modéré", "mid"] : ["✓ faible", "ok"];
      $("#lamv", el).textContent = lam + " nm";
      [["gs", sol], ["ga", adn], ["gr", risk]].forEach(([id, v]) => { $("#" + id + "v", el).textContent = fmt(Math.round(v)) + " %"; $("#" + id + "b", el).style.width = Math.min(100, v) + "%"; });
      const c = $("#risk", el); c.className = "chip " + lvl[1]; c.textContent = lvl[0];
    };
    r.value = S.ws.uv || 280; r.addEventListener("input", upd); upd();
  },
  flux(el) {
    const F = [["Photosynthèse", "Source de O₂ · puits de CO₂", "≈ 170 Gt de O₂ par an"], ["Respiration", "Puits de O₂ · source de CO₂", "≈ 170 Gt de O₂ par an"], ["Combustions", "Puits de O₂ · source de CO₂ (origine humaine)", "≈ 37 Gt de O₂ par an"], ["Enfouissement de matière organique", "Petite source de O₂ (la matière enfouie n'est pas oxydée)", "≈ 1 Gt de O₂ par an"]];
    const open = S.ws.flux || {};
    el.innerHTML = `<p class="pl"><b>Source ou puits ?</b> Réfléchis, puis touche une carte pour vérifier.</p><div class="grid-cards">${F.map((f, i) => `<button type="button" class="card-btn" data-i="${i}" aria-expanded="${!!open[i]}"><span class="t">${f[0]}</span><span class="m">${open[i] ? `<b style="color:var(--ink)">${f[1]}</b><br>${f[2]}` : "Toucher pour révéler"}</span></button>`).join("")}</div>
      <div class="chartbox" id="wO2"></div>`;
    $$(".card-btn", el).forEach(b => b.onclick = () => { const o = Object.assign({}, S.ws.flux || {}); o[b.dataset.i] = !o[b.dataset.i]; S.ws.flux = o; save(); WIDGETS.flux(el); });
    const O2 = [[-580, 17], [-500, 17], [-450, 16.5], [-400, 16], [-390, 14], [-380, 20], [-360, 21], [-340, 27], [-300, 35], [-280, 33], [-260, 25], [-250, 15], [-230, 15], [-210, 20], [-200, 15], [-180, 21], [-150, 23], [-100, 23], [-60, 25], [-30, 24], [0, 21]];
    $("#wO2", el).insertAdjacentHTML("beforebegin", `<p class="pl" style="margin-top:.4rem"><b>Teneur en dioxygène sur 600 millions d'années</b> <span class="chip">⚠ ${APPROX}</span></p>`);
    mountChart($("#wO2", el), { type: "line", series: [{ name: "Dioxygène atmosphérique", pts: O2, color: "c1" }], xMin: -600, xMax: 0, xStep: 100, yMin: 10, yMax: 40, yStep: 5, legend: false, xTickW: 3, bands: [{ x0: -359, x1: -299, label: "Carbonifère" }], hlines: [{ y: 21, label: "teneur actuelle", color: "muted" }],
      xTitle: "Temps (millions d'années, 0 = aujourd'hui)", yTitle: "Dioxygène (%)", xRead: v => (v === 0 ? "Aujourd'hui" : "Il y a " + fmt(-v) + " Ma"), yRead: v => fmt(v) + " %", h: 14 });
  },
  reveal(el) {
    const R = [["Question posée", "Quel temps fait-il, ou fera-t-il ?", "Quelles sont les caractéristiques statistiques du temps sur une longue période ?"], ["Durée étudiée", "Heures, jours, semaines.", "Décennies et au-delà ; normales calculées sur 30 ans."], ["Données utilisées", "Valeurs observées ou prévues à des dates précises.", "Moyennes, variabilité, fréquence et intensité des événements."], ["Exemple", "« 42,6 °C à Paris le 25 juillet 2019. »", "« Moyenne des températures maximales de juillet sur 1991–2020. »"]];
    const o = S.ws.reveal || {};
    const cell = (k, txt) => `<td><button type="button" class="btn ghost" data-k="${k}" style="width:100%;justify-content:flex-start;text-align:left;font-weight:${o[k] ? 400 : 700};min-height:48px;white-space:normal;padding:.4rem .6rem">${o[k] ? txt : "Toucher pour révéler"}</button></td>`;
    el.innerHTML = `<p class="pl"><b>Rappel actif</b> : essaie de dire chaque case de mémoire, puis touche-la pour vérifier.</p>
      <div class="tablewrap"><table class="t"><thead><tr><th></th><th>Météorologie</th><th>Climatologie</th></tr></thead><tbody>${R.map((r, i) => `<tr><th>${r[0]}</th>${cell(i + "m", r[1])}${cell(i + "c", r[2])}</tr>`).join("")}</tbody></table></div>
      <div class="row"><button type="button" class="btn ghost" id="rvAll">Tout révéler</button><button type="button" class="btn ghost" id="rvNone">Tout cacher</button></div>`;
    $$("[data-k]", el).forEach(b => b.onclick = () => { const n = Object.assign({}, S.ws.reveal || {}); n[b.dataset.k] = !n[b.dataset.k]; S.ws.reveal = n; save(); WIDGETS.reveal(el); const nb = $(`[data-k="${b.dataset.k}"]`, el); if (nb) nb.focus(); });
    $("#rvAll", el).onclick = () => { const n = {}; R.forEach((r, i) => { n[i + "m"] = n[i + "c"] = true; }); S.ws.reveal = n; save(); WIDGETS.reveal(el); };
    $("#rvNone", el).onclick = () => { S.ws.reveal = {}; save(); WIDGETS.reveal(el); };
  },
  indic(el) {
    const cur = S.ws.indic || "temp";
    el.innerHTML = `<p class="pl"><b>Explore les indicateurs</b>.</p>${seg("Indicateur", [["temp", "Température"], ["sea", "Niveau des océans"], ["glac", "Glaciers"], ["ban", "Banquise"]], cur)}<div id="wInd" style="display:grid;gap:.6rem"></div>`;
    const w = $("#wInd", el);
    if (cur === "temp") { w.innerHTML = `<span class="chip">⚠ ${APPROX}</span><div class="chartbox" id="wC"></div><p>Tendance : environ <b>+1,15 °C</b> en 2020 par rapport à la moyenne 1880–1920, dont l'essentiel depuis 1980.</p>`; mountChart($("#wC", w), tglobSpec()); }
    if (cur === "sea") { w.innerHTML = `<span class="chip">⚠ ${APPROX}</span><div class="chartbox" id="wC"></div><p>+8 cm entre 1993 et 2015, soit environ <b>3,6 mm/an</b> en moyenne.</p>`; mountChart($("#wC", w), seaSpec()); }
    if (cur === "glac") w.innerHTML = `<div class="steps3"><div><span class="s">1912</span><span class="score-big" style="font-size:1.8rem">250 m</span><span>d'épaisseur de la Mer de Glace sous la gare du Montenvers</span></div><div><span class="s">2015</span><span class="score-big" style="font-size:1.8rem">90 m</span><span>d'épaisseur au même endroit</span></div><div><span class="s">Vitesse moyenne</span><span class="score-big" style="font-size:1.8rem">−1,6 m/an</span><span>(90 − 250) ÷ 103 ans</span></div></div>`;
    if (cur === "ban") w.innerHTML = `<p>La <b>banquise</b> est de la glace de mer, formée par le gel de l'eau de surface (vers −1,8 °C dans l'océan Arctique). Elle s'étend en hiver et se réduit en été : on compare donc sa surface <b>d'une année à l'autre, à la même saison</b>. Sa surface minimale estivale en Arctique diminue nettement depuis 1979.</p>`;
    $$(".seg button", el).forEach(b => b.onclick = () => { S.ws.indic = b.dataset.s; save(); WIDGETS.indic(el); });
  },
  paleo(el) {
    const cur = S.ws.paleo || "long";
    el.innerHTML = `<p class="pl"><b>Change d'échelle de temps</b>.</p>${seg("Échelle", [["long", "450 000 ans"], ["short", "25 000 derniers ans"]], cur)}<span class="chip">⚠ Valeurs simulées (courbe schématique)</span><div class="chartbox" id="wP"></div>
      <p>${cur === "long" ? "Alternance de longues périodes froides et de courts interglaciaires, environ tous les <b>100 000 ans</b>." : "Dernier maximum glaciaire vers <b>−20 000 ans</b>, puis réchauffement rapide jusque vers <b>−10 000 ans</b>."}</p>`;
    const sp = cur === "long" ? paleoSpec() : paleoSpec({ series: [{ name: "Écart de température", pts: PALEO.filter(p => p[0] >= -26), color: "c1", w: 3 }], xMin: -26, xMax: 0, xStep: 2, markers: true, xTickW: 2.2 });
    mountChart($("#wP", el), sp);
    $$(".seg button", el).forEach(b => b.onclick = () => { S.ws.paleo = b.dataset.s; save(); WIDGETS.paleo(el); });
  },
  chain(el) {
    const C = ["Les activités humaines émettent des gaz à effet de serre (CO₂, CH₄, N₂O).", "Leur concentration atmosphérique augmente.", "L'effet de serre se renforce.", "Le système climatique accumule de l'énergie : il est déséquilibré par rapport à l'ère préindustrielle.", "L'énergie supplémentaire est stockée, surtout par les océans.", "La température moyenne et le niveau des océans augmentent."];
    const n = Math.max(1, Math.min(C.length, S.ws.chain || 1));
    el.innerHTML = `<p class="pl"><b>Reconstitue la chaîne de causes</b> : avant de toucher « Et ensuite ? », essaie de prévoir l'étape suivante.</p><ol style="margin:0;padding-left:1.4rem;display:grid;gap:.45rem">${C.slice(0, n).map(c => `<li>${c}</li>`).join("")}</ol>
      <div class="row">${n < C.length ? `<button type="button" class="btn" id="chNext">Et ensuite ? (${n}/${C.length})</button>` : `<span class="chip ok">✓ Chaîne complète</span>`}<button type="button" class="btn ghost" id="chReset">↺ Recommencer</button></div>`;
    const nx = $("#chNext", el); if (nx) nx.onclick = () => { S.ws.chain = n + 1; save(); WIDGETS.chain(el); const b = $("#chNext", el); if (b) b.focus(); };
    $("#chReset", el).onclick = () => { S.ws.chain = 1; save(); WIDGETS.chain(el); };
  },
  loops(el) {
    const L = { vap: ["Vapeur d'eau", ["Température ↑", "Évaporation et vapeur d'eau dans l'air ↑", "Effet de serre ↑", "Température ↑"], "positive"],
      glace: ["Glaces", ["Température ↑", "Surface couverte par les glaces ↓", "Rayonnement solaire renvoyé vers l'espace ↓, énergie absorbée ↑", "Température ↑"], "positive"],
      perg: ["Pergélisol", ["Température ↑", "Dégel du pergélisol ↑", "Libération de CO₂ et de CH₄ ↑, effet de serre ↑", "Température ↑"], "positive"],
      veg: ["Végétalisation", ["CO₂ et température ↑", "Végétalisation et photosynthèse ↑", "Absorption de CO₂ ↑ : la hausse du CO₂ est freinée", "Réchauffement freiné"], "négative"] };
    const cur = S.ws.loops || "vap", l = L[cur];
    el.innerHTML = `<p class="pl"><b>Choisis une boucle</b> et suis-la jusqu'au retour.</p>${seg("Rétroaction", Object.keys(L).map(k => [k, L[k][0]]), cur)}
      <ol style="margin:0;padding-left:1.4rem;display:grid;gap:.4rem">${l[1].map((s, i) => `<li>${i ? "→ " : ""}${s}</li>`).join("")}</ol>
      <div class="box info"><p class="lab">ℹ ${l[2] === "positive" ? "Rétroaction positive" : "Rétroaction négative"}</p><p><b>${l[2] === "positive" ? "↻ Elle amplifie le réchauffement." : "↺ Elle freine le réchauffement."}</b></p></div>`;
    $$(".seg button", el).forEach(b => b.onclick = () => { S.ws.loops = b.dataset.s; save(); WIDGETS.loops(el); });
  }
};


/* ---------- v2 : simulations ---------- */
const O2H = [[-4.6, 0], [-3.5, 0], [-3.0, 0], [-2.5, 0.05], [-2.45, 0.3], [-2.4, 1], [-2.3, 2], [-2.1, 2.5], [-1.8, 1.5], [-1.5, 1.2], [-1.2, 1.3], [-1.0, 1.5], [-0.8, 3], [-0.7, 6], [-0.6, 12], [-0.5, 18], [-0.45, 17], [-0.4, 16], [-0.36, 24], [-0.32, 33], [-0.3, 35], [-0.27, 30], [-0.25, 16], [-0.2, 18], [-0.1, 23], [-0.05, 24], [0, 21]];
WIDGETS.o2 = el => {
  el.innerHTML = `<p class="pl"><b>Lance l'histoire du dioxygène</b> : les grands témoins apparaissent au fil du tracé.</p><span class="chip">⚠ Valeurs simulées (allure schématique)</span><div class="chartbox" id="wO2h"></div><div class="fb neutral" id="o2msg" aria-live="polite"><p class="h">Touche ▶ Lancer.</p></div>`;
  const msgs = [[-4.6, "Il y a 4,6 Ga : atmosphère sans dioxygène."], [-3.5, "Dès 3,5 Ga : stromatolithes. Le dioxygène produit reste piégé dans l'océan (fers rubanés)."], [-2.4, "Vers 2,4 Ga : le dioxygène s'accumule dans l'atmosphère ; paléosols rouges."], [-0.5, "Vers 500 Ma : la teneur actuelle (≈ 21 %) est atteinte."], [-0.3, "Carbonifère : jusqu'à ≈ 35 % de dioxygène."], [0, "Aujourd'hui : ≈ 21 %."]];
  mountChart($("#wO2h", el), { type: "line", series: [{ name: "Dioxygène atmosphérique", pts: O2H, color: "c1", w: 3 }], xMin: -4.6, xMax: 0, xStep: 0.5, yMin: 0, yMax: 40, yStep: 10, legend: false, anim: true, animStart: "empty", animDur: 9000, xTickW: 2.6,
    marks: [{ x: -3.5, label: "Stromatolithes", color: "c4" }, { x: -2.4, label: "O₂ dans l'air", color: "c2", row: 1 }, { x: -0.5, label: "≈ 21 %", color: "c3", anchor: "end" }],
    xTitle: "Temps (milliards d'années, 0 = aujourd'hui)", yTitle: "Dioxygène (% de l'air)", xFmt: v => fmt(v, 1), xRead: v => (v === 0 ? "Aujourd'hui" : "Il y a " + fmt(-v, 2) + " Ga"), yRead: v => fmt(v, 1) + " %", h: 14,
    onCut: x => { let m = null; msgs.forEach(q => { if (x >= q[0] - 1e-9) m = q[1]; }); const b = $("#o2msg", el); if (b && m) b.innerHTML = `<p class="h">${m}</p>`; } });
};
function climModel(o) {
  const F = t => 3.7 * Math.min(t / 100, 1), lam = 3.2 - (o.vap ? 1.6 : 0) - (o.ice ? 0.4 : 0) - (o.perm ? 0.25 : 0) + (o.veg ? 0.3 : 0), C = o.ocean ? 60 : 3;
  const out = []; let T = 0; for (let t = 0; t <= 200; t += 0.5) { if (Number.isInteger(t / 5)) out.push([t, Math.round(T * 100) / 100]); T += 0.5 * (F(t) - lam * T) / C; } return out;
}
WIDGETS.labo = el => {
  const o = Object.assign({ vap: true, ice: true, perm: false, veg: false, ocean: true }, S.ws.labo || {});
  const SW = [["vap", "💧 Vapeur d'eau", "+"], ["ice", "🧊 Recul des glaces", "+"], ["perm", "🟫 Dégel du pergélisol", "+"], ["veg", "🌳 Végétation (court terme)", "−"], ["ocean", "🌊 Océan amortisseur", "≈"]];
  el.innerHTML = `<p class="pl"><b>Laboratoire des rétroactions</b> : les émissions de GES augmentent pendant 100 ans puis se stabilisent. Active ou coupe chaque mécanisme, prédis l'effet, puis lance la simulation.</p>
    <span class="chip">⚠ Valeurs simulées (modèle très simplifié)</span>
    <div class="seg labsw" role="group" aria-label="Mécanismes">${SW.map(([k, lab, sg]) => `<button type="button" data-k="${k}" aria-pressed="${!!o[k]}">${o[k] ? "☑" : "☐"} ${lab} <span class="muted">(${sg})</span></button>`).join("")}</div>
    <div class="chartbox" id="wLabo"></div><div class="fb neutral" id="laboRes" aria-live="polite"><p class="h">Le résultat s'affiche à la fin du tracé.</p></div>`;
  const sim = climModel(o), ref = climModel({ ocean: o.ocean });
  const fin = sim[sim.length - 1][1], fin0 = ref[ref.length - 1][1];
  mountChart($("#wLabo", el), { type: "line", series: [{ name: "Avec les mécanismes choisis", pts: sim, color: "c2", w: 3.2 }, { name: "Sans aucune rétroaction", pts: ref, color: "c6", w: 2.2 }], xMin: 0, xMax: 200, xStep: 25, yMin: 0, yMax: 6, yStep: 1, anim: true, animStart: "empty", animDur: 7000, xTickW: 2.6,
    hlines: [], xTitle: "Temps (années)", yTitle: "Réchauffement (°C)", xRead: v => "Année " + v, yRead: v => "+" + fmt(v, 1) + " °C", yFmt: v => "+" + fmt(v), h: 14,
    onCut: x => { const r = $("#laboRes", el); if (!r) return; if (x >= 200 - 1e-9) { const k = fin / fin0; r.className = "box info"; r.innerHTML = `<p class="lab">ℹ Résultat de la simulation</p><p><b>Après 200 ans : +${fmt(fin, 1)} °C, contre +${fmt(fin0, 1)} °C sans rétroaction (× ${fmt(k, 1)}).</b></p><p>${k > 1.05 ? "Les rétroactions positives amplifient le réchauffement." : k < 0.95 ? "La rétroaction négative freine le réchauffement." : "Sans rétroaction active, la courbe suit la référence."}${o.ocean ? " L'océan ralentit la hausse : il stocke l'énergie, qu'il restituera pendant des siècles." : " Sans l'océan, la température réagit presque immédiatement."}</p>`; } else { r.className = "fb neutral"; r.innerHTML = `<p class="h">Année ${Math.round(x)}…</p>`; } } });
  $$(".labsw button", el).forEach(b => b.onclick = () => { o[b.dataset.k] = !o[b.dataset.k]; S.ws.labo = o; save(); WIDGETS.labo(el); const nb = $(`.labsw [data-k="${b.dataset.k}"]`, el); if (nb) nb.focus(); });
};
WIDGETS.dilat = el => {
  el.innerHTML = `<p class="pl"><b>Dilatation de l'océan</b> : fais varier l'épaisseur de la couche qui se réchauffe et la hausse de température (α = 2 × 10⁻⁴ par °C, modèle simplifié).</p>
    <div class="field"><label for="fdH">Épaisseur de la couche réchauffée : <b class="num" id="fdHv"></b></label><input id="fdH" type="range" min="100" max="2000" step="100" value="700"></div>
    <div class="field"><label for="fdT">Hausse de température : <b class="num" id="fdTv"></b></label><input id="fdT" type="range" min="0" max="3" step="0.1" value="0.5"></div>
    <div class="dilat"><svg viewBox="0 0 320 170" role="img" aria-label="Coupe de l'océan : la hauteur d'eau augmente avec la dilatation"><rect x="20" y="20" width="280" height="140" rx="6" style="fill:var(--surface-2);stroke:var(--line)"/><rect id="fdW" x="21" y="80" width="278" height="79" style="fill:var(--info-soft)"/><rect id="fdWarm" x="21" y="80" width="278" height="20" style="fill:var(--c2);opacity:.28"/><line x1="20" x2="300" y1="80" y2="80" style="stroke:var(--muted);stroke-width:2" stroke-dasharray="6 4"/><line id="fdL1" x1="20" x2="300" y1="80" y2="80" style="stroke:var(--info);stroke-width:3"/></svg>
      <div class="dsres"><p class="lead">Pointillés : niveau initial · trait plein : niveau après dilatation · zone orangée : couche réchauffée.</p><p>Élévation du niveau marin</p><p class="score-big num" id="fdR"></p><p class="lead">Élévation = épaisseur × α × hausse de température.</p></div></div>`;
  const H = $("#fdH", el), Tt = $("#fdT", el);
  const upd = () => { const h = +H.value, dT = +Tt.value, dh = h * 2e-4 * dT * 100; $("#fdHv", el).textContent = fmt(h) + " m"; $("#fdTv", el).textContent = fmt(dT, 1) + " °C"; $("#fdR", el).textContent = fmt(dh, 1) + " cm"; const lift = Math.min(55, dh * 0.9); ["fdL1"].forEach(i => { $("#" + i, el).setAttribute("y1", 80 - lift); $("#" + i, el).setAttribute("y2", 80 - lift); }); $("#fdW", el).setAttribute("y", 80 - lift); $("#fdW", el).setAttribute("height", 79 + lift); $("#fdWarm", el).setAttribute("y", 80 - lift); $("#fdWarm", el).setAttribute("height", Math.min(79, h / 2000 * 79) + lift); };
  H.oninput = upd; Tt.oninput = upd; upd();
};

/* ---------- navigation ---------- */
const VIEWS = ["ch1", "ch2", ...FICHES.map(f => f.id), "rappel", "bilan"];
function tabs() {
  const cur = S.view.startsWith("f") ? "ch" + FICHES.find(f => f.id === S.view).ch : S.view;
  const due = CARDS.filter(c => isDue(c.id)).length;
  $("#tabs").innerHTML = [["ch1", "Chapitre 1 · Atmosphère et vie"], ["ch2", "Chapitre 2 · Système climatique"], ["rappel", `Rappel espacé <span class="chip">${due}</span>`], ["bilan", "Bilan"]].map(([v, lab]) => `<button class="tab" type="button" data-v="${v}" ${v === cur ? 'aria-current="page"' : ""}>${lab}</button>`).join("");
  $$("#tabs .tab").forEach(b => b.onclick = () => go(b.dataset.v));
}
function go(v, noScroll) {
  if (!VIEWS.includes(v)) v = "ch1";
  S.view = v; if (v.startsWith("f")) S.seen[v] = true; save(); tabs();
  if (location.hash !== "#" + v) { try { history.replaceState(null, "", "#" + v); } catch (e) {} }
  const m = $("#main");
  if (v === "ch1" || v === "ch2") renderList(m, +v.slice(2)); else if (v === "rappel") renderRecall(m); else if (v === "bilan") renderBilan(m); else renderFiche(m, FICHES.find(f => f.id === v));
  if (!noScroll) window.scrollTo(0, 0);
}
function mastered(f) { return f.cards.filter((c, i) => boxOf(f.id + "c" + i) >= 3).length; }
function renderList(m, ch) {
  const list = FICHES.filter(f => f.ch === ch);
  m.innerHTML = `<section class="view"><div><p class="kicker">Chapitre ${ch}</p><h2 class="sec-title">${ch === 1 ? "L'atmosphère terrestre et la vie" : "La complexité du système climatique"}</h2><p class="lead">Chaque fiche se lit en 5 minutes : l'essentiel, une manipulation, puis trois cartes pour te tester.</p></div>
    <div class="grid-cards">${list.map(f => { const i = FICHES.indexOf(f) + 1; const mk = mastered(f); return `<button class="card-btn" type="button" data-go="${f.id}"><span class="kicker">Fiche ${i}</span><span class="t">${f.title}</span><span class="m">${f.cap}</span><span class="row" style="gap:.3rem"><span class="chip ${S.seen[f.id] ? "ok" : ""}">${S.seen[f.id] ? "✓ lue" : "à lire"}</span><span class="chip ${mk === 3 ? "ok" : mk ? "mid" : ""}">${mk}/3 cartes maîtrisées</span></span></button>`; }).join("")}</div></section>`;
  $$("[data-go]", m).forEach(b => b.onclick = () => go(b.dataset.go));
}
function renderFiche(m, f) {
  const i = FICHES.indexOf(f), prev = FICHES[i - 1], next = FICHES[i + 1];
  m.innerHTML = `<section class="view"><div><p class="kicker">Fiche ${i + 1} · Chapitre ${f.ch} · ≈ 5 min</p><h2 class="sec-title">${f.title}</h2><p class="lead">Capacité : ${f.cap}</p></div>
    <div class="panel"><h3>L'essentiel</h3>${f.body()}</div>
    <div class="panel" id="wg" style="display:grid;gap:.7rem"></div>
    ${f.after()}
    <div class="panel"><h3>Teste-toi</h3><p class="lead">Réponds dans ta tête, puis retourne la carte et sois honnête : tes réponses alimentent le rappel espacé.</p><div id="fc" style="display:grid;gap:.7rem"></div></div>
    <div class="row">${prev ? `<button class="btn ghost" type="button" data-go="${prev.id}">← Fiche ${i}</button>` : ""}${next ? `<button class="btn ghost" type="button" data-go="${next.id}">Fiche ${i + 2} →</button>` : `<button class="btn ghost" type="button" data-go="rappel">Rappel espacé →</button>`}<button class="btn ghost" type="button" data-go="ch${f.ch}">Retour au chapitre ${f.ch}</button></div></section>`;
  const wg = $("#wg", m); [].concat(f.widget).forEach((w, k) => { const d = document.createElement("div"); d.style.display = "grid"; d.style.gap = ".7rem"; if (k) { d.className = "wsep"; } wg.appendChild(d); WIDGETS[w](d); });
  const fc = $("#fc", m); f.cards.forEach((c, k) => { const d = document.createElement("div"); fc.appendChild(d); flashcard(d, CARDS.find(x => x.id === f.id + "c" + k), false); });
  $$("[data-go]", m).forEach(b => b.onclick = () => go(b.dataset.go));
}
function boxLabel(b) { return b === 0 ? "nouvelle" : b >= 3 ? `boîte ${b} · maîtrisée` : `boîte ${b}`; }
function flashcard(el, c, inSession, onDone) {
  let flipped = false;
  const draw = () => {
    const b = boxOf(c.id);
    el.innerHTML = `<div class="panel" style="background:var(--surface-2);gap:.6rem"><div class="row" style="justify-content:space-between"><span class="kicker">${inSession ? "Carte · " + c.f.title : "Carte " + (+c.id.split("c")[1] + 1) + " sur 3"}</span><span class="chip ${b >= 3 ? "ok" : ""}">${boxLabel(b)}</span></div>
      <p style="font-weight:700">${c.q}</p>${flipped ? `<div class="box info"><p class="lab">ℹ Réponse</p><p>${c.a}</p></div><div class="row"><button class="btn" type="button" data-r="1">✓ Je savais</button><button class="btn ghost" type="button" data-r="0">↺ À revoir</button></div>` : `<div class="row"><button class="btn" type="button" data-flip>Retourner la carte</button></div>`}</div>`;
    const fl = $("[data-flip]", el); if (fl) fl.onclick = () => { flipped = true; draw(); const r = $("[data-r='1']", el); if (r) r.focus(); };
    $$("[data-r]", el).forEach(btn => btn.onclick = () => { const ok = btn.dataset.r === "1"; if (S.firstAns[c.id] === undefined) S.firstAns[c.id] = ok; S.box[c.id] = ok ? Math.min(5, Math.max(boxOf(c.id), 1) + 1) : 1; S.last[c.id] = Date.now(); save(); tabs(); if (onDone) onDone(ok); else { flipped = false; draw(); el.querySelector(".kicker").insertAdjacentHTML("afterend", `<span class="toast">${ok ? "✓ Notée « je savais »" : "↺ Notée « à revoir »"}</span>`); } });
  };
  draw();
}
let session = null;
function renderRecall(m) {
  const filt = S.ws.rf || "all";
  const pool = CARDS.filter(c => filt === "all" || "ch" + c.f.ch === filt);
  const due = pool.filter(c => isDue(c.id));
  const counts = [0, 1, 2, 3, 4, 5].map(b => pool.filter(c => boxOf(c.id) === b).length);
  m.innerHTML = `<section class="view"><div><p class="kicker">Rappel espacé</p><h2 class="sec-title">Réviser au bon moment</h2><p class="lead">Une carte réussie passe dans la boîte suivante et revient plus tard (1, 3, 7 puis 14 jours). Une carte ratée revient en boîte 1. Ta progression reste sur cet appareil.</p></div>
    <div class="panel">${seg("Chapitres", [["all", "Tous"], ["ch1", "Chapitre 1"], ["ch2", "Chapitre 2"]], filt)}
      <div class="tablewrap"><table class="t"><thead><tr><th>Nouvelles</th><th>Boîte 1</th><th>Boîte 2</th><th>Boîte 3</th><th>Boîte 4</th><th>Boîte 5</th></tr></thead><tbody><tr>${counts.map(n => `<td class="n">${n}</td>`).join("")}</tr></tbody></table></div>
      <p><b>${due.length}</b> carte(s) à revoir maintenant.</p><div class="row"><button class="btn" type="button" id="start" ${due.length ? "" : "disabled"}>Commencer une série (${Math.min(10, due.length)} cartes)</button><button class="btn ghost" type="button" id="all">Réviser toutes les cartes</button></div></div>
    <div id="sess" style="display:grid;gap:.7rem"></div></section>`;
  $$(".seg button", m).forEach(b => b.onclick = () => { S.ws.rf = b.dataset.s; save(); renderRecall(m); });
  const run = list => { session = { list: shuffle(list).slice(0, 10), i: 0, ok: 0 }; step(); };
  const step = () => { const s = $("#sess"); if (session.i >= session.list.length) { s.innerHTML = `<div class="fb ok"><p class="h">✓ Série terminée : ${session.ok}/${session.list.length} « je savais ».</p><p>Reviens demain : les cartes ratées réapparaîtront en priorité.</p></div>`; return; } s.innerHTML = `<p class="kicker">Carte ${session.i + 1} sur ${session.list.length}</p><div id="cur"></div>`; flashcard($("#cur", s), session.list[session.i], true, ok => { if (ok) session.ok++; session.i++; step(); }); const fb = $("#cur [data-flip]"); if (fb) fb.focus(); };
  $("#start", m).onclick = () => run(due);
  $("#all", m).onclick = () => run(pool);
}
const ACTIVITY = "Fiches interactives Atmosphère et climat · Terminale, Enseignement scientifique, Thème 1 (1.1 L'atmosphère terrestre et la vie ; 1.2 La complexité du système climatique). Dix fiches : l'essentiel du cours, des documents et simulations à manipuler (composition de l'atmosphère, diagramme d'état de l'eau, histoire du dioxygène, UV et ozone, flux de dioxygène, météo et climat, indicateurs, paléotempératures, réchauffement, rétroactions et océan) et 30 cartes de rappel espacé.";
const missedCards = () => CARDS.filter(c => S.firstAns[c.id] === false);
function bilanText(name) {
  let t = `RÉSUMÉ DE L'ACTIVITÉ\n${ACTIVITY}\n\nBILAN\nÉlève : ${name || "—"}\nDate : ${today()}\n\nFiches\n`;
  FICHES.forEach((f, i) => { t += `- Fiche ${i + 1} · ${f.title} : ${S.seen[f.id] ? "lue" : "non lue"} · ${mastered(f)}/3 cartes maîtrisées\n`; });
  const tot = FICHES.reduce((a, f) => a + mastered(f), 0), tried = CARDS.filter(c => S.firstAns[c.id] !== undefined).length, ok1 = CARDS.filter(c => S.firstAns[c.id] === true).length;
  t += `\nCartes maîtrisées (boîte 3 ou plus) : ${tot}/${CARDS.length}\nCartes réussies au premier essai : ${ok1}/${tried} essayées\n`;
  const ms = missedCards(); t += `\nCartes ratées au premier essai (${ms.length})\n${ms.length ? ms.map(c => `- Fiche ${FICHES.indexOf(c.f) + 1} : ${c.q}`).join("\n") : "- aucune"}\n`;
  return t;
}
function renderBilan(m) {
  const tot = FICHES.reduce((a, f) => a + mastered(f), 0), lues = FICHES.filter(f => S.seen[f.id]).length, ms = missedCards();
  m.innerHTML = `<section class="view"><div><p class="kicker">Bilan</p><h2 class="sec-title">Mes révisions</h2><p class="lead">Une carte est « maîtrisée » (boîte 3 ou plus) quand tu l'as réussie au moins deux fois, à des jours différents.</p></div>
    <div class="panel"><p class="score-big">${tot}/${CARDS.length}</p><p>cartes maîtrisées · ${lues}/${FICHES.length} fiches lues</p><div class="bar" aria-hidden="true"><i style="width:${tot / CARDS.length * 100}%"></i></div></div>
    <div class="tablewrap"><table class="t"><thead><tr><th>Fiche</th><th>Lue</th><th>Cartes maîtrisées</th></tr></thead><tbody>${FICHES.map((f, i) => `<tr><td>${i + 1}. ${f.title}</td><td>${S.seen[f.id] ? "✓ oui" : "— non"}</td><td class="n">${mastered(f)}/3</td></tr>`).join("")}</tbody></table></div>
    <div class="panel"><h3>Cartes ratées au premier essai</h3>${ms.length ? `<ul class="ul">${ms.map(c => `<li><button class="linkbtn" type="button" data-go="${c.f.id}">Fiche ${FICHES.indexOf(c.f) + 1}</button> · ${c.q}</li>`).join("")}</ul>` : "<p>Aucune pour l'instant.</p>"}</div>
    <div class="panel"><h3>Transmettre mon bilan</h3><p class="lead">Le fichier contient le résumé de l'activité, ta progression par fiche et la liste des cartes ratées.</p><div id="bt"></div></div>
    <div class="panel"><h3>Recommencer</h3><p class="lead">Efface la progression des fiches et des cartes sur cet appareil.</p><div class="row"><button class="btn ghost" type="button" id="reset">Tout effacer</button></div></div></section>`;
  $$("[data-go]", m).forEach(b => b.onclick = () => go(b.dataset.go));
  renderBilanTools($("#bt"), bilanText, name => `<p class="kicker">Bilan à montrer au professeur</p><h2>${esc(name || "Élève")}</h2><p>Fiches Atmosphère et climat · ${today()}</p>${FICHES.map((f, i) => `<div class="line"><span>${i + 1}. ${f.title}</span><b class="num">${S.seen[f.id] ? "lue" : "—"} · ${mastered(f)}/3</b></div>`).join("")}<div class="line"><span><b>Cartes maîtrisées</b></span><b class="num">${tot}/${CARDS.length}</b></div><p style="font-size:1.1rem">Cartes ratées au premier essai : ${ms.length}</p>`, "fiches-atmosphere-climat");
  armButton($("#reset"), "Tout effacer", "Confirmer l'effacement ?", () => { Object.assign(S, { seen: {}, box: {}, last: {}, ws: {}, firstAns: {} }); save(); go("ch1"); });
}

/* ---------- démarrage ---------- */
Display.init(S, save);
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && h !== S.view && VIEWS.includes(h)) go(h); });
go(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : (S.view || "ch1"), true);
