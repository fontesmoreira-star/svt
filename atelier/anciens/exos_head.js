/* ===== Entraînement à paliers : exploiter des documents ===== */
Store.key = "ds-climat-tle-entrainement-v2";

/* ---------- documents réutilisés ---------- */
const BOX_UNITS = `<div class="box key"><p class="lab">✔ Règle clé · Unités de pression</p><p>1 atm = 101 325 Pa = 760 mmHg · 1 bar = 10⁵ Pa = 1 000 hPa · 1 hPa = 100 Pa = 1 mbar</p></div>`;
const POLLEN_PREF = { title: "Document · Préférences climatiques de quelques plantes", html: tbl(["Plante", "Préférences climatiques"], [["Graminées et autres herbacées (steppe)", "climat froid, milieux ouverts"], ["Bouleau (arbre pionnier)", "climat froid, sec ou humide"], ["Pin (conifère)", "climat froid à frais"], ["Sapin (conifère)", "climat froid à tempéré, humide"], ["Hêtre (feuillu)", "climat tempéré, humide"], ["Chêne (feuillu)", "climat tempéré"], ["Aulne (feuillu)", "climat tempéré, zones humides"]]) };
const METHODE = `<div class="steps3"><div><span class="s">Je vois</span><span>Je relève des valeurs précises : taxons dominants, pourcentages, dates ou profondeurs.</span></div><div><span class="s">Je sais</span><span>J'utilise les préférences climatiques des plantes (tableau).</span></div><div><span class="s">J'en déduis</span><span>Je conclus sur le climat à chaque période, puis sur son évolution.</span></div></div>`;
const LATE = { ages: [-16, -15, -14.5, -14, -13.5, -13, -12.5, -12, -11.5, -11, -10.5, -10, -9, -8],
  gram: [70, 68, 40, 25, 22, 30, 55, 58, 35, 15, 10, 8, 6, 5], boul: [15, 17, 35, 30, 25, 25, 25, 22, 35, 20, 12, 10, 8, 7],
  pin: [10, 10, 18, 35, 40, 35, 15, 15, 22, 40, 35, 30, 22, 18], chene: [5, 5, 7, 10, 13, 10, 5, 5, 8, 25, 43, 52, 64, 70] };
const zip = (xs, ys) => xs.map((x, i) => [x, ys[i]]);
const BELVAL = { obs: [27.1, 28.4, 30.2, 32.5, 34.8, 36.1, 37.6, 36.9, 33.0, 29.4, 26.2, 24.8, 25.5, 26.9], norm: [25.6, 25.6, 25.5, 25.5, 25.5, 25.4, 25.4, 25.4, 25.3, 25.3, 25.2, 25.2, 25.1, 25.1] };
const P20 = (PALEO.find(p => p[0] === -20) || [0, -7])[1];

/* ---------- exercices ---------- */
const EXOS = [
  { id: "e1", title: "Les unités de pression", ch: "Chapitre 1", cap: "Convertir des unités ; puissances de 10 et ordres de grandeur.", lv: {
    easy: { intro: "Convertis ces pressions en pascals (Pa).", docs: [{ title: "Rappel", html: BOX_UNITS }],
      parts: [
        { t: "num", label: "a) 1 020 hPa = … Pa", unit: "Pa", ans: 102000, tol: 0.5, err: [[v => near(v, 10.2, 0.01), "Tu as divisé. Pour passer des hPa aux Pa, on multiplie par 100."], [v => near(v, 1020000, 1), "1 hPa = 100 Pa, pas 1 000 Pa."]] },
        { t: "num", label: "b) 2,5 bar = … Pa", unit: "Pa", ans: 250000, tol: 0.5, err: [[v => near(v, 2500, 1), "1 bar = 10⁵ Pa = 100 000 Pa, pas 1 000 Pa."], [v => near(v, 25000, 1), "Il manque un zéro : 1 bar = 100 000 Pa."]] }
      ],
      hints: ["« hecto » (h) signifie « cent » : 1 hPa = 100 Pa.", "1 bar = 10⁵ Pa : on multiplie par 100 000.", "1 020 × 100 = … ; 2,5 × 100 000 = …"],
      corr: "a) 1 020 hPa = 1 020 × 100 Pa = <b>102 000 Pa</b> (soit 1,02 × 10⁵ Pa).<br>b) 2,5 bar = 2,5 × 10⁵ Pa = <b>250 000 Pa</b>." },
    mid: { intro: "Un baromètre ancien indique 750 mmHg.", docs: [{ title: "Rappel", html: BOX_UNITS }],
      parts: [
        { t: "num", label: "a) Convertis 750 mmHg en Pa (arrondi à la centaine).", unit: "Pa", ans: 99991, tol: 120, err: [[v => near(v, 570000, 2000), "Tu as multiplié 750 par 760. Utilise une proportion : 760 mmHg correspondent à 101 325 Pa."], [v => near(v, 1000, 5), "Ce résultat est en hPa : la question demande des Pa."]] },
        { t: "num", label: "b) Exprime cette pression en hPa.", unit: "hPa", ans: 999.9, tol: 3, err: [[v => near(v, 99991, 300), "Ce résultat est en Pa : divise par 100 pour obtenir des hPa."]] }
      ],
      hints: ["760 mmHg correspondent à 1 atm, soit 101 325 Pa.", "Produit en croix : P = 750 × 101 325 ÷ 760.", "P ≈ 99 990 Pa. Pour passer en hPa, divise par 100."],
      corr: "a) P = 750 × 101 325 ÷ 760 ≈ <b>99 990 Pa</b>, soit environ 100 000 Pa.<br>b) 99 990 Pa ÷ 100 ≈ <b>1 000 hPa</b>, une pression proche de la pression normale au niveau de la mer." },
    hard: { intro: "La pression moyenne au sol de Vénus est de 92 atm.", docs: [{ title: "Rappel", html: BOX_UNITS + `<p>Pression moyenne au sol sur Terre : 1,013 × 10⁵ Pa.</p>` }],
      parts: [
        { t: "sci", label: "a) Exprime la pression au sol de Vénus en Pa, en écriture scientifique (deux chiffres après la virgule au plus).", unit: "Pa", ans: 9.3219e6, tolRel: 0.02 },
        { t: "num", label: "b) Combien de fois est-elle plus forte que la pression au sol terrestre ?", unit: "fois", ans: 92, tol: 2 },
        { t: "choice", label: "c) Quel est l'ordre de grandeur de la pression au sol de Vénus ?", o: ["10⁵ Pa", "10⁶ Pa", "10⁷ Pa", "10⁹ Pa"], a: 2, no: { 1: "9,3 × 10⁶ est plus proche de 10⁷ que de 10⁶ : 9,3 est supérieur à 3,16 (≈ √10).", 0: "10⁵ Pa est l'ordre de grandeur de la pression terrestre.", 3: "Recalcule : 92 × 1,013 × 10⁵ ≈ 9,3 × 10⁶ Pa." } }
      ],
      hints: ["1 atm = 101 325 Pa ≈ 1,013 × 10⁵ Pa.", "92 × 1,013 × 10⁵ = 93,2 × 10⁵ = 9,32 × 10⁶ Pa.", "Pour l'ordre de grandeur, compare 9,32 à 3,16 (≈ √10) : au-dessus, on arrondit à la puissance de 10 supérieure."],
      corr: "a) P = 92 × 101 325 ≈ <b>9,32 × 10⁶ Pa</b>.<br>b) 9,32 × 10⁶ ÷ 1,013 × 10⁵ = <b>92</b> : c'est logique, puisque 1 atm est la pression terrestre moyenne.<br>c) 9,32 × 10⁶ Pa a pour ordre de grandeur <b>10⁷ Pa</b>." } } },

  { id: "e2", title: "Le diagramme d'état de l'eau", ch: "Chapitre 1", cap: "Déterminer l'état physique de l'eau pour une température et une pression données, à partir de son diagramme d'état.", lv: {
    easy: { intro: "Trois points sont placés sur le diagramme, sous une pression de 10⁵ Pa (pression au sol sur Terre).",
      docs: [{ title: "Document · Diagramme d'état de l'eau", chart: phaseSpec({ points: [{ T: -50, P: 1e5, label: "A" }, { T: 50, P: 1e5, label: "B" }, { T: 200, P: 1e5, label: "C" }] }) }],
      parts: [{ t: "rows", label: "Indique l'état de l'eau en chaque point.", choices: ["Solide", "Liquide", "Gaz"], rows: [{ txt: "A (−50 °C ; 10⁵ Pa)", a: 0 }, { txt: "B (50 °C ; 10⁵ Pa)", a: 1 }, { txt: "C (200 °C ; 10⁵ Pa)", a: 2 }] }],
      hints: ["Repère la ligne horizontale 10⁵ Pa : les trois points sont dessus.", "Sous 10⁵ Pa, l'eau fond vers 0 °C et bout vers 100 °C.", "A est à gauche de la courbe de fusion ; B est entre les deux courbes ; C est à droite de la courbe d'ébullition."],
      corr: "A : <b>solide</b> (glace). B : <b>liquide</b>. C : <b>gaz</b> (vapeur). Sous 10⁵ Pa, on retrouve les températures de fusion (0 °C) et d'ébullition (100 °C)." },
    mid: { intro: "Sur une planète fictive, la pression au sol est de 3 × 10⁶ Pa et la température de surface varie de 20 °C à 260 °C.",
      docs: [{ title: "Document · Diagramme d'état de l'eau", chart: phaseSpec() }],
      parts: [
        { t: "multi", label: "a) Sous quelle(s) forme(s) l'eau peut-elle exister à la surface de cette planète ? (une ou plusieurs réponses)", o: ["Solide", "Liquide", "Gaz"], a: [1, 2] },
        { t: "num", label: "b) Au-dessus de quelle température environ l'eau ne peut-elle plus y être liquide ?", unit: "°C", ans: 234, tol: 15, err: [[v => near(v, 100, 5), "100 °C est la température d'ébullition sous 10⁵ Pa. Ici, la pression est 30 fois plus forte."]] }
      ],
      hints: ["Place la ligne horizontale 3 × 10⁶ Pa : entre 10⁶ et 10⁷, un peu en dessous du milieu.", "Suis cette ligne de 20 °C à 260 °C : traverse-t-elle une courbe ?", "Elle coupe la courbe liquide–gaz vers 230–240 °C : touche le diagramme à cet endroit pour lire les valeurs."],
      corr: "Sous 3 × 10⁶ Pa, l'eau bout vers <b>234 °C</b>. De 20 à 234 °C, elle est <b>liquide</b> ; de 234 à 260 °C, elle est à l'état de <b>gaz</b>. Aucune température n'est assez basse pour la glace." },
    hard: { intro: "Mars : pression moyenne au sol 6 × 10² Pa ; température de surface de −120 °C à +30 °C.",
      docs: [{ title: "Document · Diagramme d'état de l'eau", chart: phaseSpec({ tMin: -130, tMax: 60, lpMin: 1, lpMax: 5, segments: [{ P: 600, t0: -120, t1: 30, label: "Mars", color: "c3" }] }) }],
      parts: [
        { t: "choice", label: "a) Pourquoi l'eau liquide n'est-elle pas stable à la surface de Mars ?", o: ["Il y fait toujours trop froid", "La pression au sol est inférieure à celle du point triple (611 Pa) : la glace passe directement à l'état de vapeur", "Il n'y a pas d'eau sur Mars", "La pression au sol est trop forte"], a: 1,
          no: { 0: "La température monte jusqu'à +30 °C : le froid seul n'explique pas l'absence d'eau liquide.", 2: "Mars possède de la glace d'eau, notamment aux pôles.", 3: "C'est l'inverse : la pression est très faible." } },
        { t: "range", label: "b) Si l'on doublait la pression (1,2 × 10³ Pa), entre quelles températures l'eau serait-elle liquide ?", unit: "°C", lo: 0, hi: 10, tolLo: 2.5, tolHi: 4 },
        { t: "text", label: "c) Propose une piste pour augmenter la pression atmosphérique de Mars, et une limite de cette idée." }
      ],
      crit: ["J'ai proposé un moyen d'ajouter des gaz à l'atmosphère martienne.", "J'ai relié la hausse de pression à la possibilité d'eau liquide.", "J'ai donné une limite réaliste (quantités énormes, fuite de l'atmosphère, durée…)."],
      model: "Libérer des gaz (par exemple le CO₂ gelé des calottes polaires) épaissirait l'atmosphère : la pression dépasserait celle du point triple et l'effet de serre réchaufferait la surface, ce qui rendrait l'eau liquide possible. Limites : les quantités de gaz nécessaires sont énormes, et Mars, plus petite que la Terre, retient mal son atmosphère, qui s'échappe peu à peu vers l'espace.",
      hints: ["Compare la pression de Mars (600 Pa) à celle du point triple (611 Pa).", "La ligne 1,2 × 10³ Pa est juste au-dessus de 10³ Pa : elle passe au-dessus du point triple.", "Sur cette ligne, l'eau fond vers 0 °C et bout vers 10 °C. Touche la courbe d'ébullition pour vérifier."],
      corr: "a) 600 Pa < 611 Pa : sous le point triple, il n'existe pas de domaine liquide ; la glace se sublime.<br>b) Sous 1,2 × 10³ Pa, l'eau serait liquide de <b>0 °C</b> à <b>10 °C environ</b> : une fenêtre très étroite." } } },

  { id: "e3", title: "Le fer, témoin du dioxygène", ch: "Chapitre 1", cap: "Ajuster l'équation d'oxydation du fer ; mettre en relation la production de dioxygène avec des indices géologiques.", lv: {
    easy: { intro: "À l'air libre, le fer métallique s'oxyde en hématite (oxyde de fer III), le constituant de la rouille.",
      parts: [{ t: "coef", label: "Ajuste l'équation avec les plus petits nombres entiers.", sp: [{ f: "Fe", at: { Fe: 1 }, side: 0 }, { f: "O₂", at: { O: 2 }, side: 0 }, { f: "Fe₂O₃", at: { Fe: 2, O: 3 }, side: 1 }], ans: [4, 3, 2] }],
      hints: ["Commence par l'oxygène : 2 atomes dans O₂, 3 dans Fe₂O₃. Le plus petit multiple commun est 6.", "6 atomes d'oxygène : il faut 3 O₂ à gauche et 2 Fe₂O₃ à droite. Le tableau de comptage s'affiche maintenant.", "2 Fe₂O₃ contiennent 4 atomes de fer : il faut 4 Fe à gauche."],
      corr: "<span class=\"eq\">4 Fe + 3 O₂ → 2 Fe₂O₃</span><br>Fer : 4 = 2 × 2. Oxygène : 3 × 2 = 6 = 2 × 3." },
    mid: { intro: "Reconstitue l'histoire du dioxygène de la Terre.",
      parts: [
        { t: "order", label: "a) Touche les événements dans l'ordre chronologique, du plus ancien au plus récent.", items: ["Formation de la Terre ; atmosphère primitive sans dioxygène", "Premières cyanobactéries photosynthétiques (stromatolithes)", "Le dioxygène produit oxyde le fer dissous des océans : dépôt de fers rubanés", "Les océans ne retiennent plus le dioxygène : il s'accumule dans l'atmosphère et des paléosols rouges se forment", "La teneur en dioxygène de l'atmosphère atteint environ 21 %"] },
        { t: "rows", label: "b) Associe chaque événement à sa date.", choices: ["4,6 Ga", "≥ 3,5 Ga", "3,5 à 2,4 Ga", "2,4 Ga", "≈ 500 Ma"], rows: [{ txt: "Fers rubanés", a: 2 }, { txt: "Accumulation du dioxygène dans l'atmosphère", a: 3 }, { txt: "Teneur actuelle atteinte", a: 4 }, { txt: "Premiers stromatolithes", a: 1 }] }
      ],
      hints: ["Il faut des producteurs de dioxygène avant toute trace d'oxydation.", "Le dioxygène s'accumule d'abord dans l'eau, là où il est produit, avant de passer dans l'air.", "Les fers rubanés (marins) précèdent les paléosols rouges (continentaux)."],
      corr: "Ordre : formation de la Terre (4,6 Ga) → stromatolithes (au moins 3,5 Ga) → fers rubanés dans les océans (3,5 à 2,4 Ga) → dioxygène dans l'atmosphère et paléosols rouges (à partir de 2,4 Ga) → teneur actuelle (vers 500 Ma)." },
    hard: { intro: "Des géologues étudient trois niveaux superposés dans un même bassin.",
      docs: [{ title: "Document · Trois niveaux d'une coupe géologique", sim: "Valeurs simulées (exemple fictif)", html: tbl(["Niveau", "Âge", "Observation"], [["3 (le plus récent)", "2,2 Ga", "Sol fossile continental rouge, riche en hématite (fer III)"], ["2", "2,7 Ga", "Dépôts marins à fers rubanés (couches rouges d'oxydes de fer III)"], ["1 (le plus ancien)", "2,9 Ga", "Sol fossile continental gris, riche en fer (II)"]]) },
        { title: "Rappel · Comportement du fer", html: `<p>Fe²⁺ : soluble dans l'eau ; conservé dans les roches et les sols si le milieu ne contient pas de dioxygène.<br>Fe³⁺ (hématite) : insoluble, rouge ; se forme au contact du dioxygène.</p>` }],
      parts: [
        { t: "rows", label: "a) Pour chaque niveau, choisis la déduction.", choices: ["Atmosphère pauvre ou sans dioxygène", "Dioxygène présent dans l'océan", "Dioxygène présent dans l'atmosphère"], rows: [{ txt: "Niveau 1 (2,9 Ga)", a: 0 }, { txt: "Niveau 2 (2,7 Ga)", a: 1 }, { txt: "Niveau 3 (2,2 Ga)", a: 2 }] },
        { t: "text", label: "b) Rédige un court paragraphe reliant ces trois observations à l'histoire du dioxygène (je vois → je sais → j'en déduis)." }
      ],
      crit: ["J'ai cité les trois niveaux avec leur âge.", "J'ai utilisé le comportement du fer (Fe²⁺ soluble et conservé sans dioxygène ; Fe³⁺ insoluble et rouge).", "J'ai conclu : dioxygène d'abord dans l'océan, puis dans l'atmosphère à partir de 2,4 Ga.", "J'ai rappelé l'origine du dioxygène (photosynthèse des cyanobactéries)."],
      model: "Je vois qu'à 2,9 Ga, un sol continental est gris et riche en fer (II), qu'à 2,7 Ga des fers rubanés se déposent dans l'océan, et qu'à 2,2 Ga un sol continental est rouge, riche en hématite. Je sais que le fer (II) n'est conservé qu'en l'absence de dioxygène et que le fer (III), rouge et insoluble, se forme à son contact. J'en déduis qu'à 2,9 Ga l'atmosphère était pauvre en dioxygène ; qu'à 2,7 Ga du dioxygène, produit par la photosynthèse des cyanobactéries, était présent dans l'océan ; et qu'à 2,2 Ga il s'était accumulé dans l'atmosphère, ce qui est cohérent avec son apparition dans l'atmosphère vers 2,4 Ga.",
      hints: ["Un sol continental reflète la composition de l'atmosphère ; un sédiment marin, celle de l'océan.", "Fer (II) conservé = pas de dioxygène ; fer (III) = présence de dioxygène.", "Niveau 1 : continent sans O₂. Niveau 2 : océan avec O₂. Niveau 3 : continent avec O₂."],
      corr: "Niveau 1 : <b>atmosphère pauvre en dioxygène</b>. Niveau 2 : <b>dioxygène dans l'océan</b>. Niveau 3 : <b>dioxygène dans l'atmosphère</b>. La succession confirme l'ordre : océan d'abord, atmosphère ensuite (à partir de 2,4 Ga)." } } },

  { id: "e4", title: "Météo ou climat ?", ch: "Chapitre 2", cap: "Distinguer sur un document des données relevant du climat d'une part, de la météorologie d'autre part.", lv: {
    easy: { intro: "Classe chaque information.",
      parts: [{ t: "rows", label: "Météorologie ou climatologie ?", choices: ["Météo", "Climat"], rows: [
        { txt: "Neige prévue à partir de 600 m d'altitude jeudi", a: 0 }, { txt: "Hauteur moyenne annuelle de pluie à Brest, calculée sur 1991–2020", a: 1 },
        { txt: "Record de chaleur battu à Paris le 25 juillet 2019", a: 0 }, { txt: "Nombre moyen de jours de gel par an dans les Vosges sur 30 ans", a: 1 },
        { txt: "Vent du nord-est à 40 km/h relevé ce matin à Luxembourg", a: 0 }, { txt: "Évolution de la fréquence des canicules en France depuis 1950", a: 1 }] }],
      hints: ["Cherche la durée : une date précise, ou une longue période ?", "Le climat repose sur des moyennes ou des fréquences calculées sur au moins 30 ans.", "Une prévision ou un relevé daté relève de la météo, même s'il s'agit d'un record."],
      corr: "Météo : la neige de jeudi, le record du 25 juillet 2019, le vent de ce matin. Climat : la pluie moyenne sur 1991–2020, les jours de gel sur 30 ans, l'évolution de la fréquence des canicules depuis 1950." },
    mid: { intro: "Une station a relevé les températures maximales pendant un épisode de chaleur.",
      docs: [{ title: "Document · Températures maximales du 1er au 14 août, station fictive", sim: SIMUL, chart: { type: "line", series: [{ name: "Température maximale observée", pts: BELVAL.obs.map((v, i) => [i + 1, v]), color: "c2" }, { name: "Normale 1991–2020", pts: BELVAL.norm.map((v, i) => [i + 1, v]), color: "c1" }], xMin: 1, xMax: 14, xStep: 1, yMin: 20, yMax: 40, yStep: 5, markers: true, xTickW: 1.8, xTitle: "Jour du mois d'août", yTitle: "Température (°C)", xRead: v => v + " août", yRead: v => fmt(v, 1) + " °C", yFmt: v => fmt(v) } }],
      parts: [
        { t: "num", label: "a) Quelle est la température maximale la plus élevée de l'épisode ?", unit: "°C", ans: 37.6, tol: 0.15 },
        { t: "num", label: "b) Calcule l'écart à la normale ce jour-là, avec son signe.", unit: "°C", ans: 12.2, tol: 0.25, im: "text", sign: true, err: [[v => near(v, -12.2, 0.25), "Tu as calculé normale − observée. Écart = valeur observée − référence."]] },
        { t: "choice", label: "c) Ce relevé permet-il d'affirmer que le climat de cette station se réchauffe ?", o: ["Oui, car l'écart à la normale est très fort", "Non : un épisode de deux semaines est un événement météorologique ; il faut des moyennes sur au moins 30 ans", "Oui, car la normale est dépassée 10 jours sur 14", "Non, car les données sont fausses"], a: 1,
          no: { 0: "Un écart fort un jour donné reste un événement météorologique.", 2: "Quatorze jours ne suffisent pas à définir une tendance climatique.", 3: "Rien n'indique que les données soient fausses : la question porte sur ce qu'elles permettent de conclure." } }
      ],
      hints: ["Touche la courbe orange à son maximum : la valeur s'affiche sous le graphique (ou lis le tableau de valeurs).", "Le jour le plus chaud est le 7 août ; la normale ce jour-là vaut 25,4 °C.", "Écart = 37,6 − 25,4 ; donne le signe et l'unité."],
      corr: "a) <b>37,6 °C</b> le 7 août. b) Écart = 37,6 − 25,4 = <b>+12,2 °C</b> au-dessus de la normale. c) <b>Non</b> : un épisode isolé, même extrême, est un événement météorologique ; une tendance climatique se lit sur des moyennes d'au moins 30 ans." },
    hard: { intro: "Sur un réseau social, quelqu'un écrit : « Il a fait −15 °C chez moi en janvier : le réchauffement climatique est une invention. »",
      parts: [
        { t: "choice", label: "a) Quelle donnée choisirais-tu pour lui répondre ?", o: ["La température du 15 janvier dans sa ville", "L'évolution de la température moyenne globale sur plusieurs décennies", "Le nombre de jours de neige de l'hiver dernier", "La météo prévue la semaine prochaine"], a: 1,
          no: { 0: "C'est encore une valeur locale et datée : elle ne dit rien d'une tendance.", 2: "Un seul hiver ne suffit pas à dégager une tendance.", 3: "Une prévision est de la météo, à court terme." } },
        { t: "text", label: "b) Rédige une réponse argumentée de 3 à 5 lignes." }
      ],
      crit: ["Je distingue un épisode météorologique (local, daté) d'une tendance climatique.", "J'explique qu'une tendance se lit sur des moyennes d'au moins 30 ans, à grande échelle.", "Je cite au moins un indicateur du climat global (température moyenne globale, niveau des océans, glaciers…).", "Mon ton reste factuel et respectueux."],
      model: "Un froid de −15 °C un jour de janvier, dans une ville, est un épisode météorologique : il décrit le temps qu'il fait à un endroit et à une date. Le climat se définit par des moyennes calculées sur au moins 30 ans. À l'échelle du globe, la température moyenne a augmenté d'environ 1 °C en un siècle et demi, le niveau des océans monte et les glaciers reculent. Des hivers froids restent possibles dans un climat qui se réchauffe : ils deviennent seulement moins fréquents.",
      hints: ["Commence par qualifier l'observation : météo ou climat ?", "Rappelle ce qu'il faut pour parler de climat : durée, moyennes, échelle.", "Termine par un indicateur global chiffré."],
      corr: "a) <b>L'évolution de la température moyenne globale sur plusieurs décennies</b> : c'est un indicateur climatique, contrairement à un relevé local et daté. b) Compare ta réponse avec la réponse modèle." } } },

  { id: "e5", title: "Lire une courbe de paléotempératures", ch: "Chapitre 2", cap: "Identifier des tendances d'évolution de la température sur plusieurs échelles de temps à partir de graphiques.", lv: {
    easy: { intro: "La courbe donne l'écart de température en Antarctique par rapport à l'actuel, sur 450 000 ans.",
      docs: [{ title: "Document · Écarts de température en Antarctique", sim: "Valeurs simulées (courbe schématique)", chart: paleoSpec() }],
      parts: [
        { t: "num", label: "a) Quel est l'écart de température vers −20 000 ans (−20 sur l'axe) ?", unit: "°C", ans: P20, tol: 1, im: "text", err: [[v => near(v, -P20, 1), "Attention au signe : la courbe est sous 0, l'écart est négatif."]] },
        { t: "num", label: "b) Combien de périodes interglaciaires (écart supérieur ou égal à 0 °C) comptes-tu, période actuelle comprise ?", unit: "", ans: 5, tol: 0 }
      ],
      hints: ["Touche la courbe au-dessus de −20 sur l'axe horizontal : la valeur s'affiche sous le graphique.", "Un interglaciaire correspond à un pic où la courbe passe au-dessus de la ligne 0.", "Les pics sont vers −408, −332, −242, −128 milliers d'années… sans oublier aujourd'hui."],
      corr: `a) Vers −20 000 ans, l'écart est d'environ <b>${fmt(P20, 1)} °C</b> : c'est le dernier maximum glaciaire.<br>b) <b>5</b> interglaciaires : vers −408 000, −332 000, −242 000, −128 000 ans et l'actuel.` },
    mid: { intro: "Même document.",
      docs: [{ title: "Document · Écarts de température en Antarctique", sim: "Valeurs simulées (courbe schématique)", chart: paleoSpec() }],
      parts: [
        { t: "num", label: "a) Estime la durée moyenne d'un cycle glaciaire–interglaciaire, en milliers d'années.", unit: "milliers d'années", ans: 100, tol: 20, conv: v => (v > 5000 ? v / 1000 : v) },
        { t: "choice", label: "b) Comment se fait le passage d'une période glaciaire à une période interglaciaire ?", o: ["Par un réchauffement rapide (environ 10 000 ans) après un long refroidissement irrégulier", "Par un réchauffement lent et régulier sur 100 000 ans", "Par un refroidissement brutal", "On ne voit aucune tendance"], a: 0,
          no: { 1: "Regarde la forme des remontées : elles sont presque verticales à cette échelle.", 2: "Le passage vers un interglaciaire est un réchauffement.", 3: "La courbe montre une alternance très nette." } }
      ],
      hints: ["Repère les pics chauds et lis leur date.", "Entre le pic de −408 000 ans et le pic récent (vers −8 000 ans), combien de cycles complets ?", "(408 − 8) ÷ 4 = …"],
      corr: "a) Les pics chauds sont espacés de 76 000 à 120 000 ans ; en moyenne (408 − 8) ÷ 4 ≈ <b>100 000 ans</b>.<br>b) La courbe a une forme en dents de scie : <b>long refroidissement irrégulier, puis réchauffement rapide</b> (≈ 10 000 ans)." },
    hard: { intro: "À l'échelle du globe, le réchauffement de la dernière déglaciation (entre −20 000 et −10 000 ans) est estimé à environ +5 °C. Le réchauffement global actuel est d'environ +1 °C en 150 ans.",
      parts: [
        { t: "num", label: "a) Vitesse moyenne du réchauffement de la déglaciation, en °C par siècle.", unit: "°C/siècle", ans: 0.05, tol: 0.006, err: [[v => near(v, 0.0005, 0.0001), "C'est une vitesse en °C par an. 10 000 ans = 100 siècles."], [v => near(v, 5, 0.1), "Tu as oublié de diviser par la durée (100 siècles)."]] },
        { t: "num", label: "b) Vitesse moyenne du réchauffement actuel, en °C par siècle.", unit: "°C/siècle", ans: 0.667, tol: 0.05, err: [[v => near(v, 0.0067, 0.001), "C'est une vitesse en °C par an. 150 ans = 1,5 siècle."], [v => near(v, 1.5, 0.05), "Tu as divisé 1,5 par 1 : la vitesse est 1 °C ÷ 1,5 siècle."]] },
        { t: "choice", label: "c) Le réchauffement actuel est environ :", o: ["aussi rapide que celui de la déglaciation", "10 fois plus rapide", "100 fois plus rapide", "1 000 fois plus rapide"], a: 1, no: { 2: "0,67 ÷ 0,05 ≈ 13 : l'ordre de grandeur est 10, pas 100.", 0: "Compare 0,67 et 0,05 °C par siècle." } },
        { t: "text", label: "d) En quoi cette comparaison renforce-t-elle l'idée que le réchauffement actuel n'est pas une simple variation naturelle ? Nuance ta réponse." }
      ],
      crit: ["J'ai comparé les deux vitesses avec leur unité.", "J'ai rappelé que le climat varie naturellement.", "J'ai relié la rapidité actuelle à l'augmentation sans précédent du CO₂ due aux activités humaines.", "J'ai nuancé : la vitesse seule ne prouve pas la cause ; il faut aussi le mécanisme (effet de serre)."],
      model: "La déglaciation s'est faite à environ 0,05 °C par siècle, alors que le réchauffement actuel atteint environ 0,7 °C par siècle, soit une vitesse environ 10 fois plus grande. Le climat varie naturellement, mais ces variations se font sur des milliers d'années. Le réchauffement actuel coïncide avec une hausse du CO₂ atmosphérique plus rapide que tout ce qui est connu depuis des centaines de milliers d'années, liée aux combustions. La vitesse ne suffit pas à elle seule à prouver la cause : c'est l'augmentation de l'effet de serre, mesurée et expliquée, qui relie ce réchauffement aux activités humaines.",
      hints: ["Vitesse = variation ÷ durée. 10 000 ans = 100 siècles.", "Déglaciation : 5 ÷ 100 = … °C/siècle. Actuel : 150 ans = 1,5 siècle.", "Actuel : 1 ÷ 1,5 ≈ 0,67 °C/siècle. Divise 0,67 par 0,05."],
      corr: "a) 5 °C ÷ 100 siècles = <b>0,05 °C/siècle</b>. b) 1 °C ÷ 1,5 siècle ≈ <b>0,67 °C/siècle</b>. c) 0,67 ÷ 0,05 ≈ 13 : <b>environ 10 fois plus rapide</b> (ordre de grandeur)." } } },

  { id: "e6", title: "Lire un diagramme pollinique", ch: "Chapitre 2", cap: "Identifier des traces géologiques, indices de variations climatiques passées (pollens).", lv: {
    easy: { intro: "Voici les pollens d'un seul niveau d'une tourbière.",
      docs: [{ title: "Document 1 · Pollens d'un niveau de tourbière", sim: SIMUL, chart: { type: "bar", categories: ["Hêtre", "Chêne", "Sapin", "Aulne", "Graminées", "Bouleau"], series: [{ name: "Abondance relative", values: [38, 27, 15, 10, 6, 4], color: "c4" }], yMax: 40, yStep: 10, xTitle: "Plante", yTitle: "Abondance relative (%)", unit: "%", valueLabel: v => fmt(v) + " %", legend: false, h: 13 } }, POLLEN_PREF, { title: "Méthode", html: METHODE }],
      parts: [
        { t: "num", label: "a) Quel pourcentage représentent les arbres feuillus (hêtre, chêne, aulne) ?", unit: "%", ans: 75, tol: 0, err: [[v => near(v, 65, 0), "Tu as oublié l'aulne, qui est aussi un feuillu."]] },
        { t: "choice", label: "b) Quel paysage et quel climat ce niveau indique-t-il ?", o: ["Une forêt de feuillus, sous un climat tempéré et humide", "Une steppe, sous un climat froid", "Une forêt de bouleaux et de pins, sous un climat froid", "Un désert chaud"], a: 0,
          no: { 1: "Les graminées ne représentent que 6 %.", 2: "Bouleau (4 %) et pin (absent) sont très minoritaires.", 3: "Aucune plante du document n'indique un climat chaud et sec." } }
      ],
      hints: ["Additionne les pourcentages des trois feuillus.", "Cherche dans le tableau les préférences des plantes dominantes.", "Hêtre et chêne : climat tempéré ; aulne : zones humides."],
      corr: "a) 38 + 27 + 10 = <b>75 %</b> de feuillus. b) <b>Forêt de feuillus, climat tempéré et humide</b> : hêtre et chêne indiquent un climat tempéré, l'aulne et le sapin un milieu humide." },
    mid: { intro: "Une carotte de sédiments lacustres a été découpée en trois niveaux.",
      docs: [{ title: "Document 1 · Diagramme pollinique cumulé de trois niveaux", sim: SIMUL, chart: { type: "stack", parts: ["Hêtre", "Chêne", "Pin", "Bouleau", "Graminées"], colors: ["c4", "c5", "c1", "c3", "c2"],
        rows: [{ label: "Niveau 3", sub: "1,0–2,5 m · récent", values: [2, 3, 10, 20, 65] }, { label: "Niveau 2", sub: "2,5–4,0 m", values: [8, 7, 45, 25, 15] }, { label: "Niveau 1", sub: "4,0–5,0 m · ancien", values: [35, 25, 20, 10, 10] }], xTitle: "Proportion des pollens (%)", labelW: 6.4 } }, POLLEN_PREF, { title: "Méthode", html: METHODE }],
      parts: [
        { t: "num", label: "a) De combien de points le pourcentage de graminées varie-t-il du niveau le plus ancien au plus récent ? (avec son signe)", unit: "points", ans: 55, tol: 0, im: "text", sign: true, err: [[v => near(v, -55, 0), "Variation = valeur récente − valeur ancienne = 65 − 10."]] },
        { t: "rows", label: "b) Quel climat indique chaque niveau ?", choices: ["Tempéré", "Frais à froid", "Froid (steppe)"], rows: [{ txt: "Niveau 1 (ancien)", a: 0 }, { txt: "Niveau 2", a: 1 }, { txt: "Niveau 3 (récent)", a: 2 }] },
        { t: "choice", label: "c) Quelle évolution climatique ce diagramme enregistre-t-il ?", o: ["Un réchauffement", "Un refroidissement progressif", "Aucun changement", "Un réchauffement puis un refroidissement"], a: 1,
          no: { 0: "Lis du bas (ancien) vers le haut (récent) : les feuillus reculent, les graminées progressent.", 2: "Les proportions changent fortement d'un niveau à l'autre.", 3: "Les feuillus ne font que reculer d'un niveau à l'autre." } }
      ],
      hints: ["Lis le diagramme de bas en haut : du niveau le plus profond (ancien) au plus récent.", "Pour chaque niveau, repère la plante dominante et sa préférence climatique.", "Feuillus (niveau 1) → pin et bouleau (niveau 2) → graminées (niveau 3)."],
      corr: "a) 65 − 10 = <b>+55 points</b>.<br>b) Niveau 1 : hêtre et chêne (60 %) → <b>tempéré</b>. Niveau 2 : pin et bouleau (70 %) → <b>frais à froid</b>. Niveau 3 : graminées (65 %) → <b>froid, paysage de steppe</b>.<br>c) La forêt de feuillus laisse place à une forêt de conifères et de bouleaux, puis à une steppe : <b>refroidissement progressif</b>, comme lors de l'entrée dans une période glaciaire." },
    hard: { intro: "Diagramme pollinique d'un lac, entre −16 000 et −8 000 ans.",
      docs: [{ title: "Document 1 · Abondance relative des pollens au cours du temps", sim: SIMUL, chart: { type: "line", series: [{ name: "Graminées", pts: zip(LATE.ages, LATE.gram), color: "c2" }, { name: "Bouleau", pts: zip(LATE.ages, LATE.boul), color: "c3" }, { name: "Pin", pts: zip(LATE.ages, LATE.pin), color: "c1" }, { name: "Chêne", pts: zip(LATE.ages, LATE.chene), color: "c4" }],
        xMin: -16, xMax: -8, xStep: 1, yMin: 0, yMax: 80, yStep: 10, markers: true, xTickW: 2.4, xTitle: "Temps (milliers d'années, 0 = aujourd'hui)", yTitle: "Abondance relative (%)", xRead: v => "Il y a " + fmt(-v * 1000) + " ans", yRead: v => fmt(v) + " %", xFmt: v => fmt(v) } }, POLLEN_PREF, { title: "Méthode", html: METHODE }],
      parts: [
        { t: "choice", label: "a) Pendant quelle période observes-tu un retour temporaire du froid ?", o: ["De −16 000 à −15 000 ans", "De −14 000 à −13 500 ans", "De −12 500 à −12 000 ans", "De −10 000 à −8 000 ans"], a: 2,
          no: { 0: "À −16 000 ans, le froid domine déjà : ce n'est pas un retour.", 1: "Entre −14 000 et −13 500 ans, le pin progresse et les graminées reculent.", 3: "Après −10 000 ans, le chêne domine : le climat est tempéré." } },
        { t: "choice", label: "b) Entre −11 500 et −11 000 ans, le pin passe de 22 % à 40 %. Peut-on affirmer que le nombre de pins a presque doublé ?", o: ["Oui, puisque son pourcentage a presque doublé", "Non : c'est une proportion ; elle peut augmenter parce que d'autres plantes reculent (graminées : 35 % → 15 %)", "Oui, car le pin préfère le froid", "Non, car le pin n'est pas un arbre"], a: 1,
          no: { 0: "Un pourcentage est une part du total : il dépend aussi des autres plantes.", 2: "La question porte sur la lecture d'un pourcentage, pas sur le climat.", 3: "Le pin est un conifère, donc un arbre." } },
        { t: "text", label: "c) Décris puis interprète l'évolution du climat entre −16 000 et −8 000 ans, en t'appuyant sur des valeurs." }
      ],
      crit: ["Je vois : je cite au moins deux plantes avec des valeurs et des dates.", "Je sais : j'utilise les préférences climatiques du tableau.", "J'en déduis : réchauffement vers −14 500 ans, bref retour du froid vers −12 500 / −12 000 ans, réchauffement durable après −11 500 ans.", "Ma conclusion répond à la question posée."],
      model: "Je vois qu'à −16 000 ans les graminées dominent (70 %) ; vers −14 000 ans elles reculent (25 %) au profit du pin et du bouleau ; vers −12 500 / −12 000 ans elles remontent (55 à 58 %) ; après −11 500 ans elles s'effondrent (15 % à −11 000 ans) tandis que le chêne progresse jusqu'à 70 % à −8 000 ans. Je sais que les graminées indiquent un climat froid, le pin et le bouleau un climat froid à frais, le chêne un climat tempéré. J'en déduis un climat froid à −16 000 ans, un réchauffement vers −14 500 ans, un bref retour du froid vers −12 500 / −12 000 ans, puis un réchauffement durable qui installe un climat tempéré.",
      hints: ["Suis surtout deux courbes opposées : graminées (froid) et chêne (tempéré).", "Repère le moment où les graminées remontent alors que le pin recule.", "Vers −12 500 / −12 000 ans, les graminées remontent à 55–58 % : retour du froid."],
      corr: "a) <b>De −12 500 à −12 000 ans</b> : les graminées remontent (55–58 %) et le pin recule (15 %).<br>b) <b>Non</b> : un pourcentage est une part du total ; la forte baisse des graminées fait mécaniquement monter la part des autres plantes." } } },

  { id: "e7", title: "Rétroactions et niveau marin", ch: "Chapitre 2", cap: "Identifier les relations de causalité (actions et rétroactions) ; estimer la variation du volume de l'océan associée à une variation de température.", lv: {
    easy: { intro: "Le climat se réchauffe. Classe chaque phénomène.",
      parts: [{ t: "rows", label: "Rétroaction positive (amplifie le réchauffement) ou négative (le freine) ?", choices: ["Positive", "Négative"], rows: [
        { txt: "Un air plus chaud contient plus de vapeur d'eau", a: 0 }, { txt: "Moins de glace, donc moins de rayonnement solaire renvoyé vers l'espace", a: 0 },
        { txt: "Le dégel du pergélisol libère du CO₂ et du CH₄", a: 0 }, { txt: "À court terme, une végétation plus abondante absorbe plus de CO₂", a: 1 }] }],
      hints: ["Rétroaction positive : elle amplifie la perturbation de départ (ici, le réchauffement).", "Demande-toi si le phénomène augmente ou diminue l'effet de serre, ou l'énergie absorbée.", "Un seul des quatre phénomènes freine le réchauffement."],
      corr: "Positives : <b>vapeur d'eau</b> (gaz à effet de serre), <b>recul des glaces</b> (plus d'énergie absorbée), <b>dégel du pergélisol</b> (libération de gaz à effet de serre). Négative : <b>végétalisation</b> (puits de CO₂ à court terme)." },
    mid: { intro: "Complète la boucle de rétroaction liée aux glaces.",
      parts: [
        { t: "rows", label: "Pour chaque étape, choisis le sens de variation.", choices: ["↑ augmente", "↓ diminue"], rows: [{ txt: "1. La température moyenne augmente → surface couverte par les glaces", a: 1 }, { txt: "2. → rayonnement solaire renvoyé vers l'espace", a: 1 }, { txt: "3. → énergie absorbée par la surface", a: 0 }, { txt: "4. → température moyenne", a: 0 }] },
        { t: "choice", label: "Cette boucle est une rétroaction :", o: ["positive", "négative"], a: 0, no: { 1: "La boucle revient à une hausse de la température : elle amplifie la perturbation." } }
      ],
      hints: ["La glace, très claire, renvoie une grande partie du rayonnement solaire.", "Moins de glace = moins de rayonnement renvoyé, donc plus d'énergie absorbée par l'océan et les sols sombres.", "Si la boucle revient au point de départ dans le même sens, elle amplifie."],
      corr: "Température ↑ → glaces <b>↓</b> → rayonnement renvoyé <b>↓</b> → énergie absorbée <b>↑</b> → température <b>↑</b>. La boucle amplifie le réchauffement : rétroaction <b>positive</b>." },
    hard: { intro: "On estime l'élévation du niveau marin due à la seule dilatation de l'eau.",
      docs: [{ title: "Document · Hypothèses du calcul", sim: "Modèle simplifié", html: `<ul style="margin:0;padding-left:1.2rem;display:grid;gap:.3rem"><li>Seule la couche superficielle de l'océan, épaisse de <b>700 m</b>, se réchauffe, de <b>0,5 °C</b>.</li><li>Coefficient de dilatation thermique de l'eau de mer : <b>α ≈ 2 × 10⁻⁴ par °C</b> (le volume augmente de 0,02 % par °C).</li><li>L'océan s'élève sans s'étaler : <b>élévation du niveau = épaisseur de la couche × α × hausse de température</b>.</li><li>Surface des océans : <b>S ≈ 3,6 × 10⁸ km²</b>.</li></ul>` }],
      parts: [
        { t: "num", label: "a) Calcule l'élévation du niveau marin, en cm.", unit: "cm", ans: 7, tol: 0.3, err: [[v => near(v, 0.07, 0.003), "Ce résultat est en mètres : 1 m = 100 cm."], [v => near(v, 70, 1), "Vérifie la puissance de 10 : 2 × 10⁻⁴ = 0,0002."]] },
        { t: "sci", label: "b) Calcule le volume d'eau supplémentaire (surface des océans × élévation), en km³, en écriture scientifique.", unit: "km³", ans: 2.52e4, tolRel: 0.06 },
        { t: "choice", label: "c) Quel autre phénomène s'ajoute à la dilatation pour élever le niveau marin ?", o: ["La fonte de la banquise", "La fonte des glaciers et des calottes continentales", "L'évaporation", "La photosynthèse du phytoplancton"], a: 1,
          no: { 0: "La banquise flotte déjà : sa fonte ne fait presque pas monter le niveau.", 2: "L'évaporation ne fait pas monter le niveau marin.", 3: "La photosynthèse n'a pas d'effet sur le volume de l'océan." } }
      ],
      hints: ["Élévation = 700 m × 2 × 10⁻⁴ × 0,5.", "Élévation = 0,07 m ; 1 m = 100 cm.", "Pour le volume, exprime l'élévation en km : 7 cm = 7 × 10⁻⁵ km. Puis 3,6 × 10⁸ × 7 × 10⁻⁵ = …"],
      corr: "a) Élévation = 700 × 2 × 10⁻⁴ × 0,5 = 0,07 m = <b>7 cm</b>.<br>b) Volume = 3,6 × 10⁸ km² × 7 × 10⁻⁵ km ≈ <b>2,5 × 10⁴ km³</b>.<br>c) <b>La fonte des glaces continentales</b> : leur eau rejoint l'océan. La banquise, qui flotte, n'y contribue presque pas." } } }
];
