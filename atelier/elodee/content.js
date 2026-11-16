/* ===== Contenu du TP « Photosynthèse, respiration ou les deux ? » — version élodée (FR + DNL EN) =====
   Source unique : apps HTML (inline) et fiches/corrigés Word (require). */
const TPDATA = (() => {

/* ---------- courbe ExAO simulée de l'élodée (déterministe) ---------- */
function simulateExao() {
  const phases = [[0, 10, 0], [10, 20, 1], [20, 30, 0], [30, 40, 1]];
  const lightAt = t => (phases.find(p => t >= p[0] && t < p[1]) || [0, 0, 1])[2];
  const R_DARK = -0.032, R_LIGHT = 0.118;            // mg/L/min (bilan net)
  let O = 8.2, r = R_DARK, seed = 11; const out = []; const dt = 0.05;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed / 2147483647) - 0.5; };
  for (let k = 0; k <= 40 / dt + 1e-9; k++) {
    const t = Math.round(k * dt * 100) / 100;
    if (Math.abs(t * 4 - Math.round(t * 4)) < 1e-6) out.push([t, Math.round((O + rnd() * 0.012) * 100) / 100]);
    const L = lightAt(t); const target = L ? R_LIGHT : R_DARK; const tau = L ? 0.9 : 0.55;
    r += (target - r) * dt / tau; O += r * dt;
  }
  return out;
}
const EXAO = simulateExao();

const fr = {
  lang: "fr",
  meta: {
    eyebrow: "2nde · SVT · Thème 1 « La Terre, la vie et l'organisation du vivant » · Chapitre 2",
    title: "Photosynthèse, respiration ou les deux ?",
    sub: "Enquête expérimentale sur l'élodée (ExAO) · Activité 1",
    theme: "Thème 1 : La Terre, la vie et l'organisation du vivant",
    chapter: "Chapitre 2 : Le métabolisme des cellules",
    activity: "Activité 1 : Enquête expérimentale – Quels métabolismes dans une cellule végétale chlorophyllienne ?",
    objectivesTitle: "Objectifs de la séance :",
    objectives: ["Formuler et tester des hypothèses par l'expérimentation (ExAO)", "Exploiter des graphiques pour identifier la photosynthèse et/ou la respiration", "Déduire les échanges gazeux et les acteurs moléculaires des métabolismes", "Localiser ces métabolismes dans les organites cellulaires"],
    capacities: "Capacités : expérimenter des réactions du métabolisme pour les caractériser ; mettre en œuvre des expériences pour identifier les substrats et produits du métabolisme."
  },
  h: { inv: "ENQUÊTE SCIENTIFIQUE : Photosynthèse, respiration ou les deux ?", sit: "La situation problème", clues: "Indices à votre disposition :", mission: "Votre mission", problem: "Problématique :", iq: "Questions d'investigation :",
    s1: "ÉTAPE 1 : Formulez vos hypothèses", s2: "ÉTAPE 2 : Protocole expérimental", s3: "ÉTAPE 3 : Pendant l'acquisition – Approfondissement", s4: "ÉTAPE 4 : Analyse des résultats et conclusion", more: "Pour aller plus loin" },
  situation: [
    "Les cellules végétales chlorophylliennes possèdent à la fois des <b>chloroplastes</b> et des <b>mitochondries</b>.",
    "L'<b>élodée</b> est une plante aquatique. Ses feuilles, épaisses de deux couches de cellules seulement, sont riches en chloroplastes. Comme elle vit immergée, elle échange ses gaz directement avec l'eau qui l'entoure : on peut suivre ces échanges en mesurant le <b>dioxygène dissous</b> dans l'eau."
  ],
  clues: {
    ps: { title: "Photosynthèse", eq: "6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂", over: "lumière + chlorophylle", rows: [["Réactifs", "dioxyde de carbone + eau"], ["Conditions", "lumière + chlorophylle (dans les chloroplastes)"], ["Produits", "glucose + dioxygène"]] },
    rs: { title: "Respiration cellulaire", eq: "C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + énergie utilisable (ATP)", over: "", rows: [["Réactifs", "glucose + dioxygène"], ["Conditions", "en continu (dans les mitochondries)"], ["Produits", "dioxyde de carbone + eau + énergie utilisable"]] }
  },
  problem: "Une cellule végétale chlorophyllienne réalise-t-elle uniquement la photosynthèse, uniquement la respiration, ou les deux métabolismes ?",
  invQ: ["Quels échanges gazeux en O₂ observe-t-on dans l'obscurité ?", "Quels échanges gazeux en O₂ observe-t-on à la lumière ?", "Comment ces observations permettent-elles de déterminer quel(s) métabolisme(s) est/sont actif(s) ?"],
  s1: {
    before: "Avant de manipuler, réfléchissez :",
    a: "a) D'après les réactions chimiques fournies, complétez le tableau :",
    tableHead: ["Métabolisme", "O₂ consommé ou produit ?", "Conditions de lumière nécessaires ?"],
    rows: [{ name: "Photosynthèse", o2: 0, light: 0 }, { name: "Respiration", o2: 1, light: 1 }],
    o2Opts: ["O₂ produit", "O₂ consommé"], lightOpts: ["Lumière nécessaire", "Pas besoin de lumière (en continu)"],
    b: "b) Émettez 3 hypothèses possibles :",
    hyps: [{ label: "Hypothèse 1 : Les cellules ne font QUE de la photosynthèse", dark: 1, light: 0 }, { label: "Hypothèse 2 : Les cellules ne font QUE de la respiration", dark: 2, light: 2 }, { label: "Hypothèse 3 : Les cellules font LES DEUX", dark: 2, light: 0 }],
    predOpts: ["O₂ augmente", "O₂ stable", "O₂ diminue"],
    predWord: "Prédiction : à l'obscurité _______ / à la lumière _______",
    fb: {
      "0-dark": { 0: "Sans lumière, la photosynthèse ne peut pas produire d'O₂.", 2: "Si les cellules ne font que la photosynthèse, rien ne consomme l'O₂ à l'obscurité." },
      "0-light": { 1: "À la lumière, la photosynthèse produit de l'O₂.", 2: "La photosynthèse produit de l'O₂, elle n'en consomme pas." },
      "1-dark": { 0: "La respiration consomme de l'O₂, elle n'en produit pas.", 1: "La respiration fonctionne en continu : l'O₂ est consommé." },
      "1-light": { 0: "Sans photosynthèse, la lumière ne change rien : la respiration continue de consommer l'O₂.", 1: "La respiration fonctionne aussi à la lumière : l'O₂ continue d'être consommé." },
      "2-dark": { 0: "À l'obscurité, seule la respiration peut fonctionner.", 1: "À l'obscurité, la respiration consomme l'O₂." },
      "2-light": { 1: "Possible si la production égale la consommation (lumière faible). Avec la lampe, on attend que la photosynthèse l'emporte.", 2: "À la lumière, la photosynthèse produit de l'O₂ en plus de la respiration qui en consomme." }
    }
  },
  s2: {
    equipTitle: "Matériel à disposition :",
    equipment: [
      "Rameaux d'<b>élodée</b> (plante aquatique chlorophyllienne), conservés à la lumière avant la séance",
      "Eau du robinet enrichie en <b>hydrogénocarbonate de sodium</b> (NaHCO₃), source de CO₂ pour la photosynthèse",
      "Bioréacteur et capteur d'O₂ dissous (mesure en temps réel)",
      "Logiciel LATIS BIO",
      "Lampe (de préférence à LED, pour ne pas chauffer l'eau)",
      "Caches opaques",
      "Agitateur magnétique et turbulent",
      "Ciseaux fins, pince"
    ],
    groupTitle: "Démarche proposée par votre groupe (à discuter) :",
    groupQ: ["Quelle(s) condition(s) lumineuse(s) allez-vous tester ?", "Combien de temps pour chaque condition ?", "Comment allez-vous interpréter une augmentation ou une diminution de l'O₂ ?"],
    protoTitle: "Protocole technique :",
    protocol: [
      "Couper 2 à 3 rameaux d'élodée bien verts, d'environ 5 cm.",
      "Remplir le bioréacteur avec l'eau enrichie en hydrogénocarbonate de sodium.",
      "Introduire le turbulent, puis les rameaux d'élodée : ils ne doivent <b>pas toucher le turbulent</b>.",
      "Ouvrir LATIS BIO : O₂ dissous, étalonnage par défaut.",
      "Placer la sonde à O₂ dans l'eau, loin des feuilles, sans bulle d'air sous la membrane.",
      "Fermer le bioréacteur et boucher les orifices non utilisés.",
      "Agitation magnétique <b>lente</b> (les feuilles ne doivent pas être abîmées).",
      "<b>DÉPART À L'OBSCURITÉ</b> (caches + lampe éteinte).",
      "Paramétrer : acquisition 40 min.",
      "Lancer les mesures.",
      "Ajuster l'échelle sur chaque graphique : avec l'élodée, les variations sont plus faibles qu'avec des algues en suspension, resserrez l'axe des ordonnées."
    ],
    altTitle: "Alternance lumière/obscurité :",
    alternance: [["0-10 min", "Obscurité", ""], ["10-20 min", "Lumière", "(retirer les caches + allumer la lampe)"], ["20-30 min", "Obscurité", "(remettre les caches + éteindre la lampe)"], ["30-40 min", "Lumière", ""]],
    vigilance: [
      "Les rameaux ne doivent jamais toucher le turbulent : il hacherait les feuilles.",
      "Une lampe classique chauffe l'eau et fausse la mesure (le dioxygène est moins soluble dans l'eau chaude) : préférez une LED, ou éloignez la lampe.",
      "Avec l'élodée, la courbe réagit avec 1 à 2 minutes de retard après chaque changement de condition : ne concluez pas trop vite."
    ]
  },
  s3: {
    ex1: { title: "Exercice 1 : déterminer la molécule synthétisée par photosynthèse et son lieu de production",
      doc: "Doc. Cellules d'élodée placées à la lumière (a) et à l'obscurité (b), puis colorées à l'eau iodée. L'eau iodée met en évidence l'amidon (glucide), qui prend une coloration bleu-noir.",
      link: "Ce sont des cellules de la plante que vous étudiez en ExAO.",
      a: "a) Examinez les vues microscopiques et nommez l'organite qui change de couleur (1 pt)",
      b: "b) Comparez la couleur de ces organites quand on met le réactif eau iodée dans les 2 cas proposés : que pouvez-vous alors en déduire sur le nom de la molécule synthétisée ? (2 pts)",
      note: "Rq : l'amidon (C₆H₁₀O₅)ₙ est un glucide complexe (de grande taille), présent chez les végétaux et les champignons, où il sert de molécule de réserve. Il est construit grâce à une très longue répétition de molécules de glucose (de petite taille). Le glucose (C₆H₁₂O₆) est un glucide simple.",
      organites: ["Noyau", "Chloroplaste", "Mitochondrie", "Vacuole", "Paroi"], orgA: 1,
      orgNo: { 0: "Le noyau n'est pas visible ici et ne change pas de couleur.", 2: "Les mitochondries sont trop petites pour être vues à ce grossissement.", 3: "La vacuole occupe le centre de la cellule et reste incolore.", 4: "La paroi entoure la cellule ; elle ne change pas de couleur." },
      colorRows: [{ label: "Cellule placée à la lumière (a)", a: 0 }, { label: "Cellule placée à l'obscurité (b)", a: 1 }], colorOpts: ["Bleu-noir", "Vert"],
      mol: ["Le glucose", "L'amidon", "Le dioxygène", "Le dioxyde de carbone"], molA: 1,
      molNo: { 0: "Le glucose est bien produit par la photosynthèse, mais l'eau iodée révèle une autre molécule : sa forme de stockage.", 2: "Le dioxygène est un gaz : l'eau iodée ne le colore pas.", 3: "Le CO₂ est un réactif de la photosynthèse, pas un produit." },
      critB: ["Je compare la couleur des chloroplastes dans les deux cas (lumière / obscurité).", "J'utilise le rôle de l'eau iodée (elle colore l'amidon en bleu-noir).", "Je conclus : à la lumière, de l'amidon est fabriqué dans les chloroplastes (à partir du glucose produit par photosynthèse)."]
    },
    ex2: { title: "Exercice 2 : déterminer le produit principal consommé lors de la respiration et son lieu d'utilisation",
      ctx: "On prend une suspension de cellules de levures (organisme hétérotrophe) et on introduit du glucose dans le milieu aquatique.",
      doc1: "Doc 1 : concentration en glucose dans un milieu contenant des levures, en milieu aérobie (mesure par sonde à glucose)",
      doc2: "Doc 2 : cellules de levure observées au microscope électronique après une longue période dans deux milieux différents (A : anaérobie, sans O₂ ; B : aérobie, avec O₂)",
      a: "a) Examinez la courbe du doc 1 pour déterminer les variations de concentration dans le milieu de la molécule concernée et en déduire ce qui est consommé lors de la respiration (2 pts)",
      b: "b) Donnez les différences observées entre les 2 cellules de levure du doc 2 puis déduisez-en le lieu de la respiration dans la cellule (1 pt)",
      gluc: [[0, 15], [1, 12], [2, 10], [3, 8], [4, 5], [5, 4], [6, 3], [7, 2], [8, 1.5], [9, 1], [10, 0.5]],
      q0: "Concentration en glucose au début (t\u00a0=\u00a00)", q10: "Concentration en glucose à t\u00a0=\u00a010\u00a0min",
      cons: ["Le glucose", "L'amidon", "Le dioxyde de carbone", "L'eau"], consA: 0,
      consNo: { 1: "Le doc 1 mesure le glucose, pas l'amidon.", 2: "Le CO₂ est un produit de la respiration.", 3: "L'eau est un produit de la respiration." },
      mitoRows: [{ label: "Cellule A (milieu sans O₂)", a: 1 }, { label: "Cellule B (milieu avec O₂)", a: 0 }], mitoOpts: ["Nombreuses mitochondries bien développées", "Mitochondries rares ou peu développées"],
      site: ["Le noyau", "La vacuole", "Les mitochondries", "La membrane"], siteA: 2,
      siteNo: { 0: "Le noyau est présent dans les deux cellules : il ne fait pas la différence.", 1: "La vacuole est présente dans les deux cellules.", 3: "La membrane entoure les deux cellules de la même façon." },
      critA: ["Je cite les valeurs de début et de fin, avec l'unité (g/L) et la durée.", "Je conclus : les levures consomment le glucose, qui est donc un réactif de la respiration."],
      critBb: ["Je compare le nombre et l'aspect des mitochondries dans les cellules A et B.", "Je conclus : la respiration (qui utilise l'O₂) se déroule dans les mitochondries."]
    }
  },
  s4: {
    photo: "Insérez une photo de votre courbe (iPad) :",
    analysis: "Analyse de votre courbe d'O₂ :",
    d: "1. Description des observations (2 pts)", dIntro: "Décrivez l'évolution de la quantité d'O₂ :", dDark: "À l'obscurité :", dLight: "À la lumière :",
    critD: ["Je décris chaque phase : obscurité et lumière.", "Je donne des valeurs lues sur la courbe, avec l'unité (mg/L) et les temps (min).", "Je compare les variations : sens et rapidité."],
    obs: "Observation complémentaire (non notée) : pendant les phases de lumière, regardez les feuilles d'élodée. Que voit-on apparaître ?",
    obsOpts: ["De petites bulles de gaz", "Rien de particulier", "Les feuilles jaunissent"], obsA: 0,
    obsNo: { 1: "Regarde de près la surface des feuilles quand la lampe est allumée.", 2: "La couleur des feuilles ne change pas en quelques minutes." },
    i: "2. Interprétation (1,5 pt)",
    iUp: "Quand la quantité d'O₂ augmente, cela signifie que les cellules :", iDown: "Quand la quantité d'O₂ diminue, cela signifie que les cellules :",
    ioOpts: ["produisent de l'O₂", "consomment de l'O₂"], imOpts: ["photosynthèse", "respiration"], imQ: "Donc le métabolisme actif est :",
    c: "3. Conclusion de l'enquête (1,5 pt)", cQ: "Quelle hypothèse est validée ? Justifiez.", cQ2: "Les cellules végétales chlorophylliennes réalisent-elles la photosynthèse, la respiration ou les deux ?",
    hypOpts: ["Hypothèse 1 (photosynthèse seule)", "Hypothèse 2 (respiration seule)", "Hypothèse 3 (les deux)"], hypA: 2,
    hypNo: { 0: "Avec la photosynthèse seule, l'O₂ resterait stable à l'obscurité. Que montre ta courbe entre 0 et 10 min ?", 1: "Avec la respiration seule, l'O₂ diminuerait aussi à la lumière. Que montre ta courbe entre 10 et 20 min ?" },
    critC: ["Je nomme l'hypothèse validée.", "J'explique pourquoi l'hypothèse 1 est rejetée (l'O₂ diminue à l'obscurité).", "J'explique pourquoi l'hypothèse 2 est rejetée (l'O₂ augmente à la lumière).", "Je réponds à la problématique : les cellules réalisent les deux métabolismes."],
    bonus: "Question bonus : à la lumière, pourquoi observe-t-on une variation d'O₂ alors que les deux métabolismes sont actifs ? Quel est le métabolisme « dominant » ?",
    critBonus: ["J'explique que la sonde mesure un bilan : O₂ produit par la photosynthèse − O₂ consommé par la respiration.", "Je nomme le métabolisme dominant à la lumière.", "Je précise que la respiration ne s'arrête pas à la lumière."]
  },
  exao: { title: "ExAO virtuelle · élodée", sim: "Données simulées : à utiliser seulement si ta mesure a échoué ou si tu étais absent(e)",
    yTitle: "O₂ dissous (mg/L)", xTitle: "Temps (min)", light: "Lumière", dark: "Obscurité", run: "▶ Lancer", pause: "⏸ Pause", resume: "▶ Reprendre", reset: "↺ Recommencer",
    lamp: "Lampe", on: "allumée", off: "éteinte", time: "Temps", o2: "O₂ dissous", done: "Acquisition terminée (40 min).", series: "O₂ dissous", tableT: "Valeurs toutes les minutes" },
  ui: {
    tabs: ["Mission", "1 · Hypothèses", "2 · Protocole", "3 · Exercices", "4 · Résultats", "Bilan"],
    check: "Vérifier", ok: "✓ Juste.", okFirst: "✓ Juste du premier coup.", okLater: "✓ Juste (après réessai, non compté).", notYet: "✗ Pas encore.", retry: "↺ Réessayer (non compté)", firstCounted: "Premier essai compté",
    incomplete: "Réponds à toutes les cases avant de vérifier.", rowsBad: n => `✗ ${n} réponse(s) à corriger (en rouge).`, numBad: "✗ Vérifie ta lecture sur la courbe.", numNaN: "Écris un nombre (virgule acceptée).",
    critHead: "Rédige ta réponse dans ta fiche Word, puis vérifie qu'elle contient :", critCount: (a, b) => `Auto-évaluation : ${a}/${b}`,
    wordNote: "Ta copie notée est la fiche Word : cette app t'aide à vérifier tes raisonnements.",
    groupNote: "Discutez en groupe et notez vos idées ici (facultatif), puis comparez avec le protocole retenu.", showProto: "Voir le protocole retenu",
    photoBtn: "📷 Choisir la photo de ma courbe", photoNote: "La photo reste sur cet iPad : elle n'est envoyée nulle part.", photoNone: "Aucune photo choisie.",
    srcMine: "Ma courbe (photo)", srcSim: "Courbe simulée (secours)", srcQ: "Quelle courbe analyses-tu ?",
    next: "Étape suivante →", prev: "← Étape précédente",
    bilanT: "Mon bilan", bilanLead: "Questions fermées autocorrigées : score au premier essai. Les réponses rédigées sont dans ta fiche Word.",
    colStep: "Étape", colScore: "Score (1er essai)", colCrit: "Auto-évaluation", reset: "Tout effacer", resetC: "Confirmer l'effacement ?", resetLead: "Efface tes réponses dans cette app, sur cet appareil.",
    transmit: "Transmettre mon bilan", showTitle: "Bilan à montrer au professeur", total: "Total (premier essai)", missionGo: "Commencer l'étape 1 →",
    timeline: "Chronologie de l'acquisition", stepsDone: "Étapes cochées", tickHint: "Coche chaque étape quand elle est faite.", key: "Règle clé", vig: "Vigilance", info: "À retenir",
    docRedrawn: "Document redessiné d'après la fiche", chartHint: "Touche la courbe pour lire une valeur.",
    darkCol: "À l'obscurité", lightCol: "À la lumière", cellsCol: "Les cellules", photoCap: "Ma courbe ExAO", docImg: "Document de la fiche", score: "Score", pts: "pt(s)", none: "—",
    exportTitle: "Bilan — TP Photosynthèse, respiration ou les deux ? (élodée, 2nde SVT)", eleve: "Élève", date: "Date", groupAns: "Démarche du groupe (étape 2)", firstTry: "Score compté au premier essai."
  }
};

const en = {
  lang: "en",
  meta: {
    eyebrow: "Year 10 (2nde) · Biology DNL · Theme 1 · Chapter 2: Cell metabolism",
    title: "Photosynthesis, Respiration, or Both?",
    sub: "Experimental investigation with Elodea (data logging) · Activity 1",
    theme: "Theme 1: Earth, Life and the Organisation of Living Things",
    chapter: "Chapter 2: Cell Metabolism",
    activity: "Activity 1: Experimental investigation – Which metabolisms take place in a chlorophyll-containing plant cell?",
    objectivesTitle: "Learning objectives:",
    objectives: ["Formulate and test hypotheses through experimentation (data logging)", "Use graphs to identify photosynthesis and/or respiration", "Deduce the gas exchanges and the molecules involved in each metabolism", "Locate these metabolisms in cell organelles"],
    capacities: ""
  },
  h: { inv: "SCIENTIFIC INVESTIGATION: Photosynthesis, Respiration, or Both?", sit: "The Problem Situation", clues: "Clues at your disposal:", mission: "Your Mission", problem: "Main problem:", iq: "Investigation questions:",
    s1: "STEP 1: Formulate Your Hypotheses", s2: "STEP 2: Experimental Protocol", s3: "STEP 3: During Acquisition – Going Further", s4: "STEP 4: Results Analysis and Conclusion", more: "Going Further" },
  situation: [
    "Chlorophyll-containing plant cells possess both <b>chloroplasts</b> and <b>mitochondria</b>.",
    "<b>Elodea</b> (Canadian waterweed) is an aquatic plant. Its leaves are only two cell layers thick and are rich in chloroplasts. Because it lives under water, it exchanges gases directly with the surrounding water, so we can follow these exchanges by measuring the <b>dissolved oxygen</b> in the water."
  ],
  clues: {
    ps: { title: "Photosynthesis", eq: "6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂", over: "light + chlorophyll", rows: [["Reactants", "carbon dioxide + water"], ["Conditions", "light + chlorophyll (in the chloroplasts)"], ["Products", "glucose + oxygen"]] },
    rs: { title: "Cellular Respiration", eq: "C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O + usable energy (ATP)", over: "", rows: [["Reactants", "glucose + oxygen"], ["Conditions", "continuous (in the mitochondria)"], ["Products", "carbon dioxide + water + usable energy"]] }
  },
  problem: "Does a chlorophyll-containing plant cell perform only photosynthesis, only respiration, or both metabolisms?",
  invQ: ["What oxygen (O₂) gas exchanges do we observe in darkness?", "What oxygen (O₂) gas exchanges do we observe in light?", "How do these observations allow us to determine which metabolism(s) is/are active?"],
  s1: {
    before: "Before conducting the experiment, let's think:",
    a: "a) Based on the chemical reactions provided, complete the table:",
    tableHead: ["Metabolism", "Is O₂ consumed or produced?", "Light conditions required?"],
    rows: [{ name: "Photosynthesis", o2: 0, light: 0 }, { name: "Respiration", o2: 1, light: 1 }],
    o2Opts: ["O₂ produced", "O₂ consumed"], lightOpts: ["Light required", "No light required (continuous)"],
    b: "b) State 3 possible hypotheses:",
    hyps: [{ label: "Hypothesis 1: The cells ONLY perform photosynthesis", dark: 1, light: 0 }, { label: "Hypothesis 2: The cells ONLY perform respiration", dark: 2, light: 2 }, { label: "Hypothesis 3: The cells perform BOTH processes", dark: 2, light: 0 }],
    predOpts: ["O₂ rises", "O₂ stays stable", "O₂ falls"],
    predWord: "Prediction: in darkness _________ / in light _________",
    fb: {
      "0-dark": { 0: "Without light, photosynthesis cannot produce O₂.", 2: "If the cells only perform photosynthesis, nothing consumes O₂ in darkness." },
      "0-light": { 1: "In light, photosynthesis produces O₂.", 2: "Photosynthesis produces O₂; it does not consume it." },
      "1-dark": { 0: "Respiration consumes O₂; it does not produce it.", 1: "Respiration is continuous: O₂ is consumed." },
      "1-light": { 0: "Without photosynthesis, light changes nothing: respiration keeps consuming O₂.", 1: "Respiration also works in light: O₂ is still consumed." },
      "2-dark": { 0: "In darkness, only respiration can work.", 1: "In darkness, respiration consumes O₂." },
      "2-light": { 1: "Possible if production equals consumption (dim light). With the lamp on, we expect photosynthesis to win.", 2: "In light, photosynthesis produces O₂ while respiration consumes some." }
    }
  },
  s2: {
    equipTitle: "Available equipment:",
    equipment: [
      "Sprigs of <b>Elodea</b> (an aquatic chlorophyll-containing plant), kept in light before the lesson",
      "Tap water enriched with <b>sodium hydrogen carbonate</b> (NaHCO₃, baking soda), a source of CO₂ for photosynthesis",
      "Bioreactor and dissolved O₂ probe (real-time measurement)",
      "LATIS BIO software",
      "Lamp (preferably LED, so the water does not heat up)",
      "Opaque covers",
      "Magnetic stirrer and stir bar",
      "Fine scissors, forceps"
    ],
    groupTitle: "Your group's approach (to discuss):",
    groupQ: ["Which light condition(s) will you test?", "How long for each condition?", "How will you interpret an increase or a decrease in O₂?"],
    protoTitle: "Technical protocol:",
    protocol: [
      "Cut 2 or 3 healthy green Elodea sprigs, about 5 cm long.",
      "Fill the bioreactor with the water enriched with sodium hydrogen carbonate.",
      "Insert the magnetic stir bar, then the Elodea sprigs: they must <b>not touch the stir bar</b>.",
      "Open LATIS BIO: dissolved O₂, default calibration.",
      "Place the O₂ probe in the water, away from the leaves, with no air bubble under the membrane.",
      "Close the bioreactor and plug the unused openings.",
      "<b>Slow</b> magnetic stirring (the leaves must not be damaged).",
      "<b>START IN DARKNESS</b> (covers on + lamp off).",
      "Set parameters: 40-minute acquisition.",
      "Start measurements.",
      "Adjust the scale on each graph: with Elodea, the changes are smaller than with algae in suspension, so zoom in on the vertical axis."
    ],
    altTitle: "Light/darkness alternation:",
    alternance: [["0-10 min", "Darkness", ""], ["10-20 min", "Light", "(remove the covers + turn on the lamp)"], ["20-30 min", "Darkness", "(put the covers back + turn off the lamp)"], ["30-40 min", "Light", ""]],
    vigilance: [
      "The sprigs must never touch the stir bar: it would shred the leaves.",
      "A classic bulb heats the water and distorts the measurement (oxygen is less soluble in warm water): use an LED, or move the lamp further away.",
      "With Elodea, the curve reacts 1 to 2 minutes after each change of condition: don't jump to conclusions."
    ]
  },
  s3: {
    ex1: { title: "Exercise 1: Determine the molecule synthesised by photosynthesis and its production site",
      doc: "Doc. Elodea cells placed in light (a) and in darkness (b), then stained with iodine solution. Iodine solution reveals starch (a carbohydrate), which turns blue-black.",
      link: "These are cells of the very plant you are studying with the data logger.",
      a: "a) Examine the microscopic views and name the organelle that changes colour (1 pt)",
      b: "b) Compare the colour of these organelles when iodine solution is added in both cases: what can you deduce about the name of the synthesised molecule? (2 pts)",
      note: "Note: starch (C₆H₁₀O₅)ₙ is a complex carbohydrate (large molecule) found in plants and fungi, where it serves as a storage molecule. It is built from very long chains of glucose molecules (small molecules). Glucose (C₆H₁₂O₆) is a simple carbohydrate.",
      organites: ["Nucleus", "Chloroplast", "Mitochondrion", "Vacuole", "Cell wall"], orgA: 1,
      orgNo: { 0: "The nucleus is not visible here and does not change colour.", 2: "Mitochondria are too small to be seen at this magnification.", 3: "The vacuole fills the centre of the cell and stays colourless.", 4: "The cell wall surrounds the cell; it does not change colour." },
      colorRows: [{ label: "Cell placed in light (a)", a: 0 }, { label: "Cell placed in darkness (b)", a: 1 }], colorOpts: ["Blue-black", "Green"],
      mol: ["Glucose", "Starch", "Oxygen", "Carbon dioxide"], molA: 1,
      molNo: { 0: "Glucose is indeed produced by photosynthesis, but iodine reveals another molecule: its storage form.", 2: "Oxygen is a gas: iodine does not stain it.", 3: "CO₂ is a reactant of photosynthesis, not a product." },
      critB: ["I compare the colour of the chloroplasts in both cases (light / darkness).", "I use the role of iodine solution (it turns starch blue-black).", "I conclude: in light, starch is made in the chloroplasts (from the glucose produced by photosynthesis)."]
    },
    ex2: { title: "Exercise 2: Determine the main product consumed during respiration and its site of use",
      ctx: "We take a suspension of yeast cells (a heterotrophic organism) and add glucose to the water.",
      doc1: "Doc 1: glucose concentration in a medium containing yeast, with oxygen (aerobic), measured with a glucose probe",
      doc2: "Doc 2: yeast cells observed under an electron microscope after a long period in two different media (A: anaerobic, without O₂; B: aerobic, with O₂)",
      a: "a) Examine the curve in Doc 1 to determine how the concentration of the molecule changes, and deduce what is consumed during respiration (2 pts)",
      b: "b) Give the differences between the 2 yeast cells in Doc 2, then deduce the site of respiration in the cell (1 pt)",
      gluc: [[0, 15], [1, 12], [2, 10], [3, 8], [4, 5], [5, 4], [6, 3], [7, 2], [8, 1.5], [9, 1], [10, 0.5]],
      q0: "Glucose concentration at the start (t\u00a0=\u00a00)", q10: "Glucose concentration at t\u00a0=\u00a010\u00a0min",
      cons: ["Glucose", "Starch", "Carbon dioxide", "Water"], consA: 0,
      consNo: { 1: "Doc 1 measures glucose, not starch.", 2: "CO₂ is a product of respiration.", 3: "Water is a product of respiration." },
      mitoRows: [{ label: "Cell A (without O₂)", a: 1 }, { label: "Cell B (with O₂)", a: 0 }], mitoOpts: ["Many well-developed mitochondria", "Few or poorly developed mitochondria"],
      site: ["The nucleus", "The vacuole", "The mitochondria", "The membrane"], siteA: 2,
      siteNo: { 0: "Both cells have a nucleus: it does not explain the difference.", 1: "Both cells have a vacuole.", 3: "Both cells are surrounded by a membrane in the same way." },
      critA: ["I quote the start and end values, with the unit (g/L) and the duration.", "I conclude: yeast consumes glucose, so glucose is a reactant of respiration."],
      critBb: ["I compare the number and the appearance of mitochondria in cells A and B.", "I conclude: respiration (which uses O₂) takes place in the mitochondria."]
    }
  },
  s4: {
    photo: "Insert a photo of your curve (iPad):",
    analysis: "O₂ curve analysis:",
    d: "1. Description of observations (2 pts)", dIntro: "Describe how the quantity of O₂ changes:", dDark: "In darkness:", dLight: "In light:",
    critD: ["I describe each phase: darkness and light.", "I give values read on the curve, with the unit (mg/L) and the times (min).", "I compare the changes: direction and speed."],
    obs: "Extra observation (not graded): during the light phases, look at the Elodea leaves. What appears?",
    obsOpts: ["Tiny gas bubbles", "Nothing special", "The leaves turn yellow"], obsA: 0,
    obsNo: { 1: "Look closely at the surface of the leaves when the lamp is on.", 2: "Leaf colour does not change in a few minutes." },
    i: "2. Interpretation (1.5 pts)",
    iUp: "When the O₂ quantity increases, this means the cells:", iDown: "When the O₂ quantity decreases, this means the cells:",
    ioOpts: ["produce O₂", "consume O₂"], imOpts: ["photosynthesis", "respiration"], imQ: "Therefore, the active metabolism is:",
    c: "3. Investigation conclusion (1.5 pts)", cQ: "Which hypothesis is validated? Justify.", cQ2: "Do chlorophyll-containing plant cells perform photosynthesis, respiration, or both?",
    hypOpts: ["Hypothesis 1 (photosynthesis only)", "Hypothesis 2 (respiration only)", "Hypothesis 3 (both)"], hypA: 2,
    hypNo: { 0: "With photosynthesis only, O₂ would stay stable in darkness. What does your curve show between 0 and 10 min?", 1: "With respiration only, O₂ would also fall in light. What does your curve show between 10 and 20 min?" },
    critC: ["I name the validated hypothesis.", "I explain why Hypothesis 1 is rejected (O₂ falls in darkness).", "I explain why Hypothesis 2 is rejected (O₂ rises in light).", "I answer the main problem: the cells perform both metabolisms."],
    bonus: "Bonus question: in light, why do we observe a change in O₂ even though both metabolisms are active? Which is the \"dominant\" metabolism?",
    critBonus: ["I explain that the probe measures a balance: O₂ produced by photosynthesis − O₂ consumed by respiration.", "I name the dominant metabolism in light.", "I state that respiration does not stop in light."]
  },
  exao: { title: "Virtual data logger · Elodea", sim: "Simulated data: use only if your own measurement failed or if you were absent",
    yTitle: "Dissolved O₂ (mg/L)", xTitle: "Time (min)", light: "Light", dark: "Darkness", run: "▶ Start", pause: "⏸ Pause", resume: "▶ Resume", reset: "↺ Restart",
    lamp: "Lamp", on: "on", off: "off", time: "Time", o2: "Dissolved O₂", done: "Acquisition complete (40 min).", series: "Dissolved O₂", tableT: "Values every minute" },
  ui: {
    tabs: ["Mission", "1 · Hypotheses", "2 · Protocol", "3 · Exercises", "4 · Results", "Language lab", "Score"],
    check: "Check", ok: "✓ Correct.", okFirst: "✓ Correct on the first try.", okLater: "✓ Correct (after a retry, not counted).", notYet: "✗ Not yet.", retry: "↺ Try again (not counted)", firstCounted: "First try counted",
    incomplete: "Answer every part before checking.", rowsBad: n => `✗ ${n} answer(s) to fix (in red).`, numBad: "✗ Check your reading of the curve.", numNaN: "Type a number.",
    critHead: "Write your answer in your Word worksheet, then check that it includes:", critCount: (a, b) => `Self-assessment: ${a}/${b}`,
    wordNote: "Your graded copy is the Word worksheet: this app helps you check your reasoning.",
    groupNote: "Discuss in your group and jot down your ideas here (optional), then compare with the protocol we will use.", showProto: "Show the protocol we will use",
    photoBtn: "📷 Choose the photo of my curve", photoNote: "The photo stays on this iPad: it is not sent anywhere.", photoNone: "No photo chosen.",
    srcMine: "My curve (photo)", srcSim: "Simulated curve (back-up)", srcQ: "Which curve are you analysing?",
    next: "Next step →", prev: "← Previous step",
    bilanT: "My score", bilanLead: "Auto-corrected closed questions: score on the first try. Your written answers are in your Word worksheet.",
    colStep: "Step", colScore: "Score (1st try)", colCrit: "Self-assessment", reset: "Erase everything", resetC: "Confirm erasing?", resetLead: "Erases your answers in this app, on this device.",
    transmit: "Send my score", showTitle: "Score to show the teacher", total: "Total (first try)", missionGo: "Start Step 1 →",
    timeline: "Acquisition timeline", stepsDone: "Steps ticked", tickHint: "Tick each step when it is done.", key: "Key rule", vig: "Watch out", info: "Remember",
    docRedrawn: "Document redrawn from the worksheet", chartHint: "Tap the curve to read a value.",
    darkCol: "In darkness", lightCol: "In light", cellsCol: "The cells", photoCap: "My data-logger curve", docImg: "Worksheet document", score: "Score", pts: "pt(s)", none: "—",
    exportTitle: "Score — Lab: Photosynthesis, Respiration, or Both? (Elodea, DNL Year 10)", eleve: "Student", date: "Date", groupAns: "Group approach (Step 2)", firstTry: "Score counted on the first try.",
    labScore: "Language lab", exitAns: "Exit ticket", minuteAns: "One-minute paper", challengeAns: "Graph challenge"
  },
  dnl: {
    tps: { title: "Activity A: Think-Pair-Share", lead: "2 minutes of pair work, then class sharing.", qs: ["If you put a plant in complete darkness for several days, what do you predict will happen? Why?", "Can photosynthesis occur at night? Why or why not?", "Why do plants have BOTH chloroplasts and mitochondria instead of just chloroplasts?"], timer: "2-minute pair timer", start: "▶ Start 2 min", stop: "⏸ Stop", restart: "↺ Reset", end: "Time's up! Share with the class." },
    gap: { title: "Activity B: Gap-fill", lead: "Tap a blank, then tap a word. Each word is used once.",
      bank: ["produce", "consume", "light", "darkness", "chloroplasts", "mitochondria", "oxygen", "glucose"],
      sentences: [["Photosynthesis occurs in ", 4, " and requires ", 2, "."], ["During photosynthesis, cells ", 0, " ", 6, " and glucose."], ["Cellular respiration occurs in ", 5, " continuously, even in ", 3, "."], ["During respiration, cells ", 1, " oxygen to break down ", 7, "."]] },
    match: { title: "Activity C: Matching", lead: "Tap an English term, then its French translation.",
      pairs: [["Chloroplast", "Chloroplaste"], ["Oxygen", "Dioxygène"], ["Gas exchanges", "Échanges gazeux"], ["Starch", "Amidon"], ["Decrease", "Diminution"], ["Waterweed (Elodea)", "Élodée"], ["Stir bar", "Turbulent"], ["Bubble", "Bulle"]] },
    challenge: { title: "Activity D: Graph interpretation challenge", lead: "Describe the O₂ curve WITHOUT using these words:", forbidden: ["increase", "increases", "increased", "increasing", "decrease", "decreases", "decreased", "decreasing", "photosynthesis", "respiration"], banned: ["increase", "decrease", "photosynthesis", "respiration"], alt: "Try instead: rises, goes up, falls, drops, goes down, production, consumption, released, used up…", ph: "Between 0 and 10 minutes, the oxygen level…", found: "Forbidden word(s) found:", clean: "✓ No forbidden word. Well done!", words: "words" },
    quiz: { title: "Quick quiz", qs: [
      { q: "Photosynthesis occurs in:", o: ["Mitochondria", "Chloroplasts", "The nucleus", "The cell membrane"], a: 1 },
      { q: "Which statement is TRUE about Elodea leaf cells?", o: ["They only do photosynthesis", "They only do respiration", "They do both processes", "They don't need oxygen"], a: 2 },
      { q: "In darkness, Elodea cells:", o: ["Produce more O₂ than they consume", "Consume O₂ through respiration", "Stop all metabolic activities", "Only do photosynthesis"], a: 1 },
      { q: "The O₂ probe measures:", o: ["Carbon dioxide levels", "Light intensity", "Dissolved oxygen concentration", "Temperature"], a: 2 },
      { q: "When the O₂ curve rises in light, it means:", o: ["Respiration is dominant", "Photosynthesis is dominant", "No metabolism is active", "The cells are dead"], a: 1 },
      { q: "Why do we add sodium hydrogen carbonate to the water?", o: ["To kill bacteria", "To supply CO₂ for photosynthesis", "To make the water warmer", "To feed the yeast"], a: 1 }
    ] },
    exit: { title: "Exit ticket", lead: "Write 3 complete sentences in English.", starters: ["One thing I learned today is…", "One question I still have is…", "Photosynthesis and respiration are different because…"] },
    minute: { title: "One-minute paper", q: "In 3 sentences, explain to a friend who missed class: what did we discover about plant cell metabolism?" },
    glossary: { title: "Specialised vocabulary", listen: "🔊", items: [
      ["Photosynthèse", "Photosynthesis", "/ˌfəʊtəʊˈsɪnθəsɪs/", "Photosynthesis produces oxygen and glucose."],
      ["Respiration cellulaire", "Cellular respiration", "/ˈseljʊlə ˌrespɪˈreɪʃən/", "Cellular respiration occurs in mitochondria."],
      ["Chloroplaste", "Chloroplast", "/ˈklɒrəplɑːst/", "Chloroplasts contain chlorophyll pigments."],
      ["Mitochondrie", "Mitochondrion (pl. mitochondria)", "/ˌmaɪtəˈkɒndrɪən/", "Mitochondria are the powerhouse of the cell."],
      ["Échanges gazeux", "Gas exchanges", "/ɡæs ɪksˈtʃeɪndʒɪz/", "Gas exchanges involve oxygen and carbon dioxide."],
      ["Dioxygène / O₂", "Oxygen / O₂", "/ˈɒksɪdʒən/", "Oxygen is released during photosynthesis."],
      ["Dioxyde de carbone / CO₂", "Carbon dioxide / CO₂", "/ˈkɑːbən daɪˈɒksaɪd/", "Carbon dioxide is absorbed by plants."],
      ["Glucose", "Glucose", "/ˈɡluːkəʊs/", "Glucose is a simple sugar."],
      ["Amidon", "Starch", "/stɑːtʃ/", "Starch is a storage molecule in plants."],
      ["Métabolisme", "Metabolism", "/məˈtæbəlɪzəm/", "Metabolism includes all chemical reactions in cells."],
      ["Obscurité", "Darkness", "/ˈdɑːknəs/", "In darkness, only respiration occurs."],
      ["Lumière", "Light", "/laɪt/", "Light is required for photosynthesis."],
      ["Chlorophylle", "Chlorophyll", "/ˈklɒrəfɪl/", "Chlorophyll captures light energy."],
      ["Énergie utilisable / ATP", "Usable energy / ATP", "/ˈjuːzəbl ˈenədʒi/", "ATP is the usable energy currency of cells."],
      ["Élodée", "Waterweed / Elodea", "/ˈwɔːtəwiːd/ – /ɪˈləʊdiə/", "Elodea is an aquatic plant with very thin leaves."],
      ["Rameau / tige", "Sprig / stem", "/sprɪɡ/ – /stem/", "Cut a sprig of Elodea about five centimetres long."],
      ["Feuille (pl. feuilles)", "Leaf (pl. leaves)", "/liːf/ – /liːvz/", "Elodea leaves are only two cells thick."],
      ["Bulle", "Bubble", "/ˈbʌbl/", "Tiny bubbles appear on the leaves in light."],
      ["Hydrogénocarbonate de sodium", "Sodium hydrogen carbonate (baking soda)", "/ˈsəʊdiəm ˈhaɪdrədʒən ˈkɑːbənət/", "Sodium hydrogen carbonate supplies CO₂ to the plant."],
      ["Turbulent (barreau aimanté)", "Magnetic stir bar", "/mæɡˈnetɪk stɜː bɑː/", "The stir bar must not touch the leaves."],
      ["Capteur / Sonde", "Probe / Sensor", "/prəʊb/ – /ˈsensə/", "The oxygen probe measures dissolved O₂."],
      ["Courbe / Graphique", "Curve / Graph", "/kɜːv/ – /ɡrɑːf/", "Analyse the oxygen curve carefully."],
      ["Hypothèse", "Hypothesis (pl. hypotheses)", "/haɪˈpɒθəsɪs/", "Let's test our hypothesis experimentally."],
      ["Prédiction", "Prediction", "/prɪˈdɪkʃən/", "What's your prediction for this experiment?"],
      ["Diminution / Baisse", "Decrease", "/ˈdiːkriːs/", "We observe a decrease in oxygen levels."],
      ["Augmentation / Hausse", "Increase", "/ˈɪnkriːs/", "There's an increase in O₂ concentration."],
      ["Levure", "Yeast", "/jiːst/", "Yeast cells perform cellular respiration."],
      ["Organite", "Organelle", "/ˌɔːɡəˈnel/", "Organelles are specialised structures in cells."],
      ["Cellule végétale", "Plant cell", "/plɑːnt sel/", "Plant cells have both chloroplasts and mitochondria."],
      ["Eau iodée", "Iodine solution", "/ˈaɪədiːn səˈluːʃən/", "Iodine solution turns blue-black with starch."],
      ["Réactifs", "Reactants", "/riˈæktənts/", "The reactants of photosynthesis are CO₂ and water."],
      ["Produits", "Products", "/ˈprɒdʌkts/", "The products of respiration include CO₂ and water."],
      ["Consommer", "To consume", "/kənˈsjuːm/", "Plant cells consume oxygen during respiration."],
      ["Produire", "To produce", "/prəˈdjuːs/", "Chloroplasts produce glucose and oxygen."],
      ["Libérer / Dégager", "To release", "/rɪˈliːs/", "Plants release oxygen into the water."],
      ["Absorber", "To absorb", "/əbˈzɔːb/", "Leaves absorb carbon dioxide from the water."],
      ["Mesurer", "To measure", "/ˈmeʒə/", "We measure oxygen concentration with a probe."]
    ] },
    mistakes: { title: "Common mistakes to avoid",
      falseFriends: [["Préservatif", "Preservative", "Condom ≠ Conservateur"], ["Actuellement", "Actually", "Currently ≠ En fait"], ["Expérience", "Experience", "Experiment ≠ Vécu"]],
      grammar: [["The cells makes photosynthesis", "The cells perform / carry out photosynthesis"], ["In the obscurity", "In darkness / In the dark"], ["The oxygen is produced", "Oxygen is produced (no article for general substances)"], ["They consume the glucose", "They consume glucose (no article in scientific contexts)"], ["The leafs", "The leaves (irregular plural)"]],
      pron: [["Photosynthesis", "Don't say \"foto-SIN-tay-sis\" → say \"foe-toe-SIN-thuh-sis\""], ["Chloroplast", "Not \"cloro-plast\" → \"KLOR-oh-plast\""], ["Hypothesis", "Not \"hipo-tay-sis\" → \"high-PAH-thuh-sis\""], ["Mitochondrion", "\"my-toe-KON-dree-on\" (singular!)"]] },
    culture: { title: "Cultural connections",
      hist: [["Joseph Priestley (1733–1804)", "British scientist who discovered that plants \"restore\" air: a mouse could live in a closed jar if a sprig of mint was inside."], ["Jan Ingenhousz (1730–1799)", "Dutch scientist who showed that plants need light for this process, by watching bubbles form on underwater leaves."], ["Melvin Calvin (1911–1997)", "American scientist who won the Nobel Prize for discovering the \"Calvin cycle\" of photosynthesis."]],
      modern: [["NASA", "Uses algae photosynthesis to produce oxygen in space-station experiments."], ["Biofuels", "Companies use algae photosynthesis to produce renewable energy."], ["Carbon capture", "Research on enhancing plant photosynthesis to fight climate change."]],
      sci: [["Robin Hill (UK)", "Discovered the \"Hill reaction\", showing O₂ production by isolated chloroplasts."], ["Peter Mitchell (UK)", "Nobel Prize for explaining how mitochondria make ATP."]] },
    remember: "Remember: in DNL, the goal is NOT perfect English. The goal is to understand science in English, to build confidence with scientific vocabulary, and to think and solve problems in another language. Don't worry about making mistakes: that's how we learn!"
  }
};

return { fr, en, EXAO };
})();
if (typeof module !== "undefined") module.exports = TPDATA;
