/* ===== QCM en parties thématiques ===== */
Store.key = "ds-climat-tle-qcm-v2";

const D_ATM = { title: "Document · Composition de l'atmosphère terrestre (% du volume)", html: tbl(["Gaz", "Atmosphère primitive (≈ 4,6 Ga)", "Atmosphère actuelle"], [["Vapeur d'eau H₂O", "80", "traces"], ["Diazote N₂", "5", "78"], ["Dioxygène O₂", "0", "21"], ["Dioxyde de carbone CO₂", "15", "traces"]]) + `<p class="lead" style="font-size:.85rem">La quantité totale de diazote est restée à peu près stable depuis la formation de la Terre.</p>` };
const D_PHASE = () => ({ title: "Document · Diagramme d'état de l'eau", chart: phaseSpec() });
const D_PALEO = () => ({ title: "Document · Écarts de température en Antarctique (par rapport à l'actuel)", sim: "Valeurs simulées (courbe schématique)", chart: paleoSpec() });

const PARTS = [
  { id: "p1", title: "L'atmosphère primitive et l'eau", fiche: "les fiches 1 et 2", qs: [
    { q: "D'après le document, quel gaz a connu la plus forte augmentation de sa <b>proportion</b> entre l'atmosphère primitive et l'atmosphère actuelle ?", docs: [D_ATM],
      o: ["Le dioxygène (O₂)", "Le diazote (N₂)", "Le dioxyde de carbone (CO₂)", "La vapeur d'eau (H₂O)"], a: 1,
      why: "Le diazote passe de 5 % à 78 %, soit +73 points, contre +21 points pour le dioxygène. Sa quantité est pourtant restée stable : sa proportion a augmenté parce que la vapeur d'eau et le CO₂ ont quitté l'atmosphère.",
      no: { 0: "Le dioxygène gagne 21 points (0 → 21 %). Compare avec le diazote : 5 → 78 %.", 2: "Le CO₂ passe de 15 % à l'état de traces : sa proportion diminue.", 3: "La vapeur d'eau passe de 80 % à l'état de traces : sa proportion diminue fortement." } },
    { q: "Vénus, à 0,72 UA du Soleil, a une température moyenne de surface d'environ 470 °C. Mercure, à 0,38 UA, n'atteint qu'environ 167 °C. Quelle explication est la plus cohérente avec le document ?",
      docs: [{ title: "Document · Atmosphère de Vénus", html: tbl(["Grandeur", "Vénus"], [["Dioxyde de carbone CO₂", "96,5 %"], ["Diazote N₂", "3,5 %"], ["Pression moyenne au sol", "92 atm"]]) }],
      o: ["Vénus reçoit plus d'énergie solaire que Mercure", "L'atmosphère de Vénus, très dense et composée à 96,5 % de CO₂, produit un effet de serre très intense", "Les volcans de Vénus chauffent toute sa surface", "Vénus tourne plus vite sur elle-même que Mercure"], a: 1,
      why: "Plus loin du Soleil, Vénus reçoit moins d'énergie que Mercure. Sa température plus élevée s'explique par son atmosphère dense et très riche en CO₂, un gaz à effet de serre.",
      no: { 0: "C'est l'inverse : plus une planète est loin du Soleil, moins elle reçoit d'énergie par m².", 2: "Le document ne parle pas de volcanisme : il donne la composition de l'atmosphère.", 3: "La rotation n'apparaît pas dans le document ; c'est l'atmosphère qui fait la différence." } },
    { q: "Convertis 850 hPa en bar.", o: ["8,5 bar", "0,85 bar", "85 bar", "0,085 bar"], a: 1,
      why: "1 hPa = 100 Pa et 1 bar = 10⁵ Pa = 1 000 hPa. Donc 850 hPa = 850 ÷ 1 000 = 0,85 bar.",
      no: { 0: "Tu as divisé par 100. Or 1 bar = 1 000 hPa : il faut diviser par 1 000.", 2: "Tu as divisé par 10. Or 1 bar = 1 000 hPa.", 3: "Tu as divisé par 10 000. Or 1 bar = 1 000 hPa." } },
    { q: "Sous une pression de 10³ Pa et à 20 °C, dans quel état se trouve l'eau ?", docs: [D_PHASE()],
      o: ["Solide", "Liquide", "Gazeux", "Les trois états coexistent"], a: 2,
      why: "À 20 °C, l'eau ne reste liquide que si la pression dépasse environ 2,3 × 10³ Pa (courbe liquide–gaz). Sous 10³ Pa, le point est sous cette courbe : l'eau est à l'état de vapeur.",
      no: { 1: "Place le point (20 °C ; 10³ Pa) : il est sous la courbe liquide–gaz, donc dans le domaine du gaz.", 0: "Le domaine du solide est à gauche de la courbe de fusion, vers 0 °C. 20 °C est à droite.", 3: "Les trois états ne coexistent qu'au point triple (0,01 °C ; 611 Pa)." } },
    { q: "Une planète fictive a une pression de surface de 10⁶ Pa et des températures comprises entre 50 °C et 150 °C. Sous quelle(s) forme(s) l'eau peut-elle exister à sa surface ?", docs: [D_PHASE()],
      o: ["Liquide uniquement", "Gaz uniquement", "Liquide et gaz", "Solide et liquide"], a: 0,
      why: "Sous 10⁶ Pa, l'eau ne bout qu'à environ 180 °C. Entre 50 et 150 °C, tout le segment est dans le domaine du liquide.",
      no: { 2: "Cherche la température d'ébullition sous 10⁶ Pa : vers 180 °C, donc au-delà de 150 °C.", 1: "À 10⁶ Pa, la vapeur n'apparaît qu'au-delà d'environ 180 °C.", 3: "Le solide n'existe qu'en dessous d'environ 0 °C." } },
    { q: "Quelle conclusion ces deux documents permettent-ils de tirer sur l'origine de l'eau terrestre ?",
      docs: [{ title: "Document · Gaz libérés (% du volume)", html: tbl(["Gaz", "Gaz volcaniques actuels", "Chauffage d'une chondrite (météorite)"], [["H₂O", "82", "78"], ["CO₂", "14", "20"], ["N₂", "4", "2"]]) }],
      o: ["L'eau des océans provient uniquement des volcans", "L'eau des océans provient uniquement des météorites et des comètes", "L'eau terrestre peut avoir une double origine : interne (dégazage du manteau) et externe (météorites, comètes)", "Les météorites ne contiennent pas d'eau"], a: 2,
      why: "Les deux sources libèrent surtout de la vapeur d'eau : le dégazage du manteau (origine interne) et les chondrites et comètes (origine externe) ont pu fournir l'eau, qui s'est condensée quand la surface s'est refroidie.",
      no: { 0: "Le chauffage d'une chondrite libère aussi 78 % de vapeur d'eau : une source externe est possible.", 1: "Les gaz volcaniques contiennent 82 % de vapeur d'eau : une source interne est possible.", 3: "Le chauffage d'une chondrite libère 78 % de vapeur d'eau." } }
  ] },
  { id: "p2", title: "Le dioxygène et la vie", fiche: "la fiche 3", qs: [
    { q: "Que montre l'apparition du précipité rougeâtre dans le tube B ?",
      docs: [{ title: "Document · Expérience", html: `<p><b>Tube A</b> : sulfate de fer (II) dissous dans l'eau distillée → solution limpide, légèrement verdâtre.</p><p><b>Tube B</b> : même solution + quelques gouttes d'eau oxygénée (H₂O₂), qui libère du dioxygène → apparition d'un précipité rougeâtre.</p>` }],
      o: ["Les ions fer (II) dissous ont été oxydés en fer (III), insoluble", "L'eau oxygénée est un colorant rouge", "Le fer (III) est plus soluble que le fer (II)", "Le dioxygène a dissous le fer"], a: 0,
      why: "Au contact du dioxygène, les ions Fe²⁺, solubles, sont oxydés en fer (III), qui précipite en hydroxydes puis oxydes rougeâtres et insolubles.",
      no: { 1: "L'eau oxygénée est incolore : elle sert à apporter du dioxygène.", 2: "C'est l'inverse : le fer (III) précipite, il est insoluble.", 3: "Le fer était déjà dissous (Fe²⁺) ; le dioxygène le fait précipiter." } },
    { q: "Ajuste l'équation : <span class=\"eq\" style=\"display:inline-block;white-space:normal\">… Fe(OH)₃ → … Fe₂O₃ + … H₂O</span>", o: ["1 ; 1 ; 1", "2 ; 1 ; 3", "2 ; 1 ; 2", "3 ; 2 ; 3"], a: 1,
      why: "Fer : 2 à gauche, 2 dans Fe₂O₃. Oxygène : 2 × 3 = 6 à gauche ; 3 + 3 = 6 à droite. Hydrogène : 2 × 3 = 6 à gauche ; 3 × 2 = 6 à droite.",
      no: { 0: "Compte le fer : Fe₂O₃ en contient 2, il faut donc 2 Fe(OH)₃.", 2: "Vérifie l'hydrogène : 2 Fe(OH)₃ apportent 6 H, il faut donc 3 H₂O.", 3: "Avec 3 Fe(OH)₃ et 2 Fe₂O₃, on a 3 Fe à gauche et 4 à droite." } },
    { q: "Les fers rubanés (alternance de couches de silice et d'oxydes de fer (III)) se sont formés en grande quantité :",
      o: ["dans les océans, entre environ 3,5 et 2,4 Ga", "sur les continents, après 2,4 Ga", "dans les océans, depuis 500 Ma seulement", "dans l'atmosphère primitive"], a: 0,
      why: "Ce sont des dépôts marins : le dioxygène produit dans l'océan oxyde le fer dissous, qui précipite. Il s'en forme de 3,5 à 2,4 Ga environ.",
      no: { 1: "Ce sont les paléosols rouges qui sont continentaux et postérieurs à 2,4 Ga.", 2: "Il ne s'en forme presque plus après 2,4 Ga.", 3: "Une roche ne se forme pas dans l'atmosphère." } },
    { q: "Que peut-on déduire de ce sol fossile ?",
      docs: [{ title: "Document · Un sol fossile continental", sim: "Valeurs simulées (exemple fictif)", html: `<p>Un sol fossile formé sur un continent, de couleur grise et riche en fer (II), est daté de 2,9 Ga.</p>` }],
      o: ["L'atmosphère contenait déjà environ 21 % de dioxygène", "L'atmosphère contenait très peu ou pas de dioxygène à cette date", "La photosynthèse n'existait pas encore", "Les océans ne contenaient pas de fer"], a: 1,
      why: "Sur un continent, le fer (II) n'est conservé que si l'air est pauvre en dioxygène ; sinon il serait oxydé en fer (III), de couleur rouge.",
      no: { 2: "Les stromatolithes montrent une photosynthèse dès 3,5 Ga : le dioxygène produit restait d'abord piégé dans les océans.", 0: "Avec 21 % de dioxygène, le fer du sol aurait été oxydé et le sol serait rouge.", 3: "Le document porte sur un sol continental, pas sur les océans." } },
    { q: "Pourquoi ne se forme-t-il presque plus de fers rubanés après 2,4 Ga ?",
      o: ["Les cyanobactéries ont disparu", "Le fer est désormais oxydé sur les continents et n'arrive plus dissous dans l'océan", "Les océans se sont asséchés", "Le dioxygène a disparu des océans"], a: 1,
      why: "Une fois l'atmosphère oxygénée, l'altération des roches continentales produit du fer (III) insoluble qui reste sur place : l'apport de fer dissous à l'océan s'arrête.",
      no: { 0: "Des cyanobactéries existent encore aujourd'hui (stromatolithes actuels).", 2: "Les océans existent sans interruption depuis leur formation.", 3: "Au contraire, le dioxygène s'accumule dans l'eau puis passe dans l'atmosphère." } },
    { q: "La teneur actuelle de l'atmosphère en dioxygène (environ 21 %) a été atteinte il y a environ :",
      o: ["4,6 milliards d'années", "2,4 milliards d'années", "500 millions d'années", "10 000 ans"], a: 2,
      why: "Le dioxygène s'accumule dans l'atmosphère à partir de 2,4 Ga, mais sa teneur actuelle n'est atteinte que vers 500 Ma.",
      no: { 1: "2,4 Ga marque le début de l'accumulation du dioxygène dans l'atmosphère, pas la teneur actuelle.", 0: "À 4,6 Ga, l'atmosphère primitive ne contenait pas de dioxygène.", 3: "La teneur de 21 % est bien plus ancienne." } }
  ] },
  { id: "p3", title: "Ozone et échanges avec la biosphère", fiche: "les fiches 4 et 5", qs: [
    { q: "Comment se forme l'ozone stratosphérique ?",
      o: ["Les UV solaires dissocient le dioxygène ; un atome d'oxygène libéré s'associe à une molécule de O₂ pour former O₃", "Les CFC libèrent de l'ozone sous l'effet des UV", "Les cyanobactéries rejettent directement de l'ozone", "Les éruptions volcaniques libèrent directement de l'ozone"], a: 0,
      why: "O₂ + UV → O + O, puis O + O₂ → O₃. Sans dioxygène dans l'atmosphère, pas de couche d'ozone.",
      no: { 1: "Les CFC détruisent l'ozone.", 2: "La photosynthèse produit du dioxygène (O₂), qui sert ensuite à former l'ozone dans la stratosphère.", 3: "L'ozone se forme à partir du dioxygène, sous l'action des UV." } },
    { q: "Pour quelle longueur d'onde le rayonnement qui atteint le sol est-il le plus dangereux pour l'ADN ?",
      docs: [{ title: "Documents · Rayonnement UV au sol et absorption par l'ADN", sim: "Valeurs simulées (modèle simplifié)", charts: [uvSolSpec(), uvAdnSpec()] }],
      o: ["260 nm", "305 nm", "340 nm", "Aucune : l'ozone arrête tous les UV"], a: 1,
      why: "À 260 nm, l'ADN absorbe beaucoup mais presque rien n'atteint le sol (absorbé par l'ozone). À 340 nm, le rayonnement atteint le sol mais l'ADN ne l'absorbe presque plus. Vers 305 nm, une partie atteint le sol et l'ADN l'absorbe encore : c'est là que le risque de mutation est le plus fort.",
      no: { 0: "À 260 nm, l'ADN absorbe fortement, mais 0 % du rayonnement atteint le sol.", 2: "À 340 nm, 82 % du rayonnement atteint le sol, mais l'ADN ne l'absorbe plus (0 %).", 3: "Le premier graphique montre qu'au-delà de 290 nm une partie des UV atteint le sol." } },
    { q: "Pourquoi les CFC détruisent-ils autant d'ozone ?",
      o: ["Ils absorbent tous les UV à la place de l'ozone", "Les UV en libèrent des atomes de chlore qui détruisent l'ozone et sont régénérés : un seul atome détruit de nombreuses molécules", "Ils sont très toxiques pour les êtres vivants", "Ils forment des pluies acides avec la vapeur d'eau"], a: 1,
      why: "Cl + O₃ → ClO + O₂, puis ClO + O → Cl + O₂ : l'atome de chlore est libéré à la fin du cycle et recommence.",
      no: { 2: "Les CFC sont inoffensifs pour les êtres vivants : leur danger est indirect, par la destruction de l'ozone.", 0: "Ce sont les UV qui cassent les CFC et libèrent le chlore.", 3: "Il n'est pas question de pluies acides : le chlore libéré détruit l'ozone." } },
    { q: "Que montrent ces mesures ?",
      docs: [{ title: "Document · Teneur en dioxygène dans deux enceintes fermées (ExAO)", sim: SIMUL, chart: { type: "line", series: [{ name: "Enceinte avec criquet", pts: [[0, 20.9], [1, 20.6], [2, 20.4], [3, 20.1], [4, 19.9], [5, 19.6], [6, 19.4], [7, 19.1], [8, 18.9], [9, 18.7], [10, 18.5]], color: "c2" }, { name: "Enceinte témoin, sans criquet", pts: [[0, 20.9], [1, 20.9], [2, 20.8], [3, 20.9], [4, 20.9], [5, 20.9], [6, 20.8], [7, 20.9], [8, 20.9], [9, 20.9], [10, 20.9]], color: "c1" }], xMin: 0, xMax: 10, xStep: 1, yMin: 18, yMax: 21.5, yStep: 0.5, markers: true, anim: true, xTickW: 2.2, h: 13, xTitle: "Temps (min)", yTitle: "Dioxygène (%)", xRead: v => "t = " + v + " min", yRead: v => fmt(v, 1) + " %", yFmt: v => fmt(v, 1) } }],
      o: ["Le criquet consomme du dioxygène : la respiration est un puits de O₂", "Le criquet produit du dioxygène", "La baisse est due à l'appareil de mesure", "Le criquet consomme du dioxyde de carbone"], a: 0,
      why: "Seule l'enceinte avec le criquet perd du dioxygène (de 20,9 % à 18,5 % en 10 min) ; le témoin reste stable. La baisse est donc due au criquet, qui respire.",
      no: { 1: "La teneur en dioxygène diminue dans l'enceinte du criquet.", 2: "Le témoin, mesuré avec le même dispositif, reste stable : l'appareil n'est pas en cause.", 3: "Les mesures portent sur le dioxygène ; la respiration rejette du CO₂." } },
    { q: "Parmi ces flux de dioxygène, lequel est un puits lié aux activités humaines ?",
      docs: [{ title: "Document · Principaux flux de dioxygène (Gt/an)", html: tbl(["Processus", "Flux (Gt/an)", "Sens"], [["Photosynthèse", "170", "vers l'atmosphère"], ["Respiration", "170", "depuis l'atmosphère"], ["Combustions (énergies fossiles, biomasse)", "36,8", "depuis l'atmosphère"], ["Enfouissement de matière organique", "1", "vers l'atmosphère"], ["Oxydation de la matière organique des roches", "0,5", "depuis l'atmosphère"]]) + `<p class="lead" style="font-size:.8rem">D'après Magnard 2020.</p>` }],
      o: ["La photosynthèse", "La respiration", "Les combustions", "L'enfouissement de matière organique"], a: 2,
      why: "Les combustions consomment du dioxygène (C + O₂ → CO₂) : c'est un puits d'environ 37 Gt/an, lié aux activités humaines.",
      no: { 0: "La photosynthèse est une source de dioxygène.", 1: "La respiration est un puits, mais d'origine naturelle.", 3: "L'enfouissement de matière organique est une petite source de dioxygène." } },
    { q: "Quelle hypothèse ces données soutiennent-elles ?",
      docs: [{ title: "Document · Les libellules géantes du Carbonifère", html: `<p>Au Carbonifère (−359 à −299 Ma), la teneur atmosphérique en dioxygène atteint environ 35 %. Des libellules de cette époque (<i>Meganeura</i>) mesuraient jusqu'à 70 cm d'envergure, contre 17 cm au maximum aujourd'hui. Des libellules élevées sur plusieurs générations dans un air enrichi en dioxygène ont grandi d'environ 15 %.</p>` }],
      o: ["Une teneur élevée en dioxygène a favorisé le gigantisme de certains insectes", "Les insectes géants ont produit le dioxygène du Carbonifère", "La taille des insectes ne dépend que de leur nourriture", "Le dioxygène était absent au Carbonifère"], a: 0,
      why: "La teneur en O₂ plus élevée au Carbonifère et l'expérience d'élevage vont dans le même sens : l'atmosphère a influencé l'évolution de certaines espèces.",
      no: { 1: "Les insectes respirent : ils consomment du dioxygène, ils n'en produisent pas.", 2: "L'expérience montre un effet de la teneur en dioxygène sur la taille.", 3: "Le document indique au contraire environ 35 % de dioxygène." } }
  ] },
  { id: "p4", title: "Météo, climat et indicateurs", fiche: "les fiches 6 et 7", qs: [
    { q: "Laquelle de ces informations relève de la climatologie ?",
      o: ["Il fera 31 °C demain après-midi à Lyon", "Un orage a apporté 40 mm de pluie mardi dernier à Nancy", "La moyenne des températures maximales de juillet calculée sur 1991–2020 dans une station", "Des rafales à 90 km/h sont prévues cette nuit sur la côte"], a: 2,
      why: "Une moyenne calculée sur 30 ans est une normale climatique. Les trois autres décrivent un épisode daté ou une prévision à court terme : c'est de la météorologie." },
    { q: "Une carte du monde entier montre les températures relevées le 3 janvier à midi (heure universelle). Il s'agit :",
      o: ["d'un document climatique, car il couvre toute la planète", "d'un document météorologique, car il décrit l'atmosphère à une date précise", "d'un document climatique, car il porte sur la température", "d'un document qui n'est ni météorologique ni climatique"], a: 1,
      why: "Météo et climat se distinguent par la durée étudiée et le traitement des données (valeurs datées ou moyennes sur une longue période), pas par l'étendue de la carte ni par la grandeur mesurée.",
      no: { 0: "L'échelle spatiale ne suffit pas : la météo s'étudie aussi à l'échelle du globe.", 2: "Météo et climat utilisent les mêmes grandeurs (température, pression, précipitations…)." } },
    { q: "Dans une station, la température maximale observée un jour de canicule est 36,4 °C ; la moyenne de référence (1991–2020) pour ce jour est 24,9 °C. Quel est l'écart à la référence ?",
      o: ["−11,5 °C", "+11,5 °C", "11,5", "+61,3 °C"], a: 1,
      why: "Écart = valeur observée − référence = 36,4 − 24,9 = +11,5 °C. Le signe + indique une valeur au-dessus de la normale. L'unité est obligatoire.",
      no: { 0: "Tu as calculé référence − observée. L'écart se calcule : valeur observée − référence.", 2: "Un écart s'écrit avec son signe et son unité.", 3: "Tu as additionné les deux valeurs." } },
    { q: "D'après le graphique, de combien la tendance de la température moyenne globale a-t-elle augmenté entre 1960 et 2020 ?",
      docs: [{ title: "Document · Écart de la température moyenne globale à la moyenne 1880–1920", sim: APPROX, chart: tglobSpec() }],
      o: ["Environ +0,3 °C", "Environ +0,9 °C", "Environ +1,2 °C", "Environ +2 °C"], a: 1,
      why: "En 1960, la tendance est vers +0,25 °C ; en 2020, vers +1,15 °C. La hausse est d'environ 0,9 °C en 60 ans. +1,2 °C est l'écart de 2020 par rapport à 1880–1920, pas la hausse depuis 1960.",
      no: { 2: "+1,15 °C est la valeur de 2020 par rapport à la référence 1880–1920. On demande la variation entre 1960 et 2020.", 0: "Relis la valeur de 2020 : elle dépasse +1 °C.", 3: "Relis l'axe vertical : la courbe ne dépasse pas +1,2 °C." } },
    { q: "Le niveau moyen des océans s'est élevé d'environ 8 cm entre 1993 et 2015. Quelle est la vitesse moyenne d'élévation ?",
      o: ["Environ 0,36 mm/an", "Environ 3,6 mm/an", "Environ 36 mm/an", "Environ 8 cm/an"], a: 1,
      why: "8 cm = 80 mm ; durée = 2015 − 1993 = 22 ans ; 80 ÷ 22 ≈ 3,6 mm/an.",
      no: { 0: "Vérifie la conversion : 8 cm = 80 mm.", 2: "Recalcule : 80 mm ÷ 22 ans ≈ 3,6 mm/an.", 3: "8 cm, c'est l'élévation totale sur 22 ans, pas par an." } },
    { q: "Quelles sont les deux principales causes de l'élévation actuelle du niveau marin ?",
      o: ["La fonte de la banquise et l'augmentation des précipitations", "La dilatation thermique de l'eau de mer et la fonte des glaces continentales (glaciers, calottes)", "La fonte de la banquise et la dilatation thermique de l'eau", "L'évaporation des océans et le dégel du pergélisol"], a: 1,
      why: "L'eau de mer qui se réchauffe se dilate, et l'eau des glaces posées sur les continents rejoint l'océan. La banquise flotte déjà : sa fonte ne change presque pas le niveau marin.",
      no: { 2: "La banquise est de la glace de mer qui flotte : sa fonte fait très peu varier le niveau marin.", 0: "La banquise flotte déjà, et les précipitations ne sont pas une cause retenue.", 3: "L'évaporation ferait baisser le niveau ; le pergélisol libère surtout des gaz en dégelant." } },
    { q: "Un hiver très froid en Europe de l'Ouest :",
      o: ["prouve que le réchauffement climatique s'est arrêté", "est un épisode météorologique régional qui ne suffit pas, à lui seul, à remettre en cause une tendance climatique globale", "prouve que le climat de la Terre se refroidit", "n'a aucun lien avec la météorologie"], a: 1,
      why: "Une tendance climatique se dégage de moyennes sur au moins 30 ans, à l'échelle globale. Un épisode isolé, même extrême, n'en est pas une." }
  ] },
  { id: "p5", title: "La variabilité naturelle du climat", fiche: "la fiche 8", qs: [
    { q: "D'après la courbe, il y a environ 20 000 ans, la Terre se trouvait :", docs: [D_PALEO()],
      o: ["en période glaciaire", "en période interglaciaire, plus chaude qu'aujourd'hui", "dans un climat identique à l'actuel", "au moment de la formation des océans"], a: 0,
      why: "Vers −20 000 ans, l'écart est d'environ −7 °C : c'est le dernier maximum glaciaire. Le réchauffement qui suit mène au climat actuel vers −10 000 ans.",
      no: { 1: "Vers −20 000 ans, la courbe est à son minimum (≈ −7 °C).", 2: "L'écart est d'environ −7 °C par rapport à l'actuel.", 3: "Les océans se sont formés il y a plus de 4 milliards d'années." } },
    { q: "Sur cette courbe, les périodes chaudes (interglaciaires) sont, par rapport aux périodes froides :", docs: [D_PALEO()],
      o: ["beaucoup plus longues", "beaucoup plus courtes, de l'ordre de 10 000 à 20 000 ans", "de même durée", "absentes depuis 400 000 ans"], a: 1,
      why: "Les pics chauds sont étroits (10 000 à 20 000 ans environ), alors que les périodes froides s'étendent sur plusieurs dizaines de milliers d'années.",
      no: { 0: "Compare la largeur des pics (au-dessus de 0 °C) et des creux.", 3: "On compte cinq pics chauds sur 450 000 ans, période actuelle comprise." } },
    { q: "Une moraine frontale (bourrelet de blocs déposés au front d'un glacier) est observée 30 km en aval du front actuel d'un glacier alpin. On peut en déduire :",
      o: ["que le glacier était plus étendu dans le passé, ce qui indique un climat plus froid", "que le glacier avance actuellement", "que le climat était plus chaud qu'aujourd'hui", "que les moraines se déposent toujours loin des glaciers"], a: 0,
      why: "Une moraine marque une ancienne position du front du glacier. Un glacier plus étendu suppose un climat plus froid." },
    { q: "Quel climat ce spectre pollinique suggère-t-il ?",
      docs: [{ title: "Document · Pollens d'un niveau de sédiment lacustre", sim: SIMUL, chart: { type: "bar", categories: ["Sapin", "Aulne", "Bouleau", "Jonc", "Graminées"], series: [{ name: "Abondance relative", values: [55, 25, 10, 5, 5], color: "c4" }], yMax: 60, yStep: 10, xTitle: "Taxon", yTitle: "Abondance relative (%)", unit: "%", valueLabel: v => fmt(v) + " %", legend: false, h: 13 },
        after: tbl(["Plante", "Préférences climatiques"], [["Sapin", "froid à tempéré, humide"], ["Aulne", "tempéré, zones humides"], ["Bouleau", "froid, sec ou humide"], ["Jonc", "froid et humide"], ["Graminées", "milieux ouverts ; abondantes en climat froid"]]) }],
      o: ["Froid, paysage de steppe", "Tempéré et humide", "Chaud et sec", "Polaire"], a: 1,
      why: "Le sapin (55 %) et l'aulne (25 %) dominent : 80 % des pollens viennent de plantes de climat tempéré et humide. Les plantes de climat froid ne représentent que 20 %.",
      no: { 0: "Les plantes de climat froid (bouleau, jonc, graminées) ne totalisent que 20 % : ce n'est pas une steppe.", 2: "Aucune plante du document n'indique un climat chaud et sec.", 3: "Les arbres dominent : un climat polaire ne permet pas une forêt de sapins." } },
    { q: "Que peut-on déduire de ce document ?",
      docs: [{ title: "Document · Floraison des cerisiers à Kyoto", html: `<p>Les archives japonaises donnent la date de pleine floraison des cerisiers depuis l'an 850. Entre le XVIᵉ et le XVIIIᵉ siècle, elle a souvent lieu après le 12 avril ; vers l'an 2000, autour du 5 avril. Plus le printemps est chaud, plus la floraison est précoce.</p>` }],
      o: ["Les printemps sont aujourd'hui plus chauds à Kyoto qu'aux siècles précédents", "Les printemps sont aujourd'hui plus froids", "La floraison ne donne aucune information climatique", "Les cerisiers ont changé d'espèce"], a: 0,
      why: "Une floraison plus précoce indique des printemps plus chauds : la date de floraison est un indice climatique." },
    { q: "Les reconstitutions montrent que le climat de la Terre varie naturellement :",
      o: ["uniquement à l'échelle des millions d'années", "à plusieurs échelles de temps : siècles, millénaires, centaines de milliers d'années", "uniquement depuis la révolution industrielle", "jamais : seul le réchauffement actuel est une variation"], a: 1,
      why: "Cycles d'environ 100 000 ans, réchauffement après le dernier maximum glaciaire, variations de quelques siècles : la variabilité naturelle existe à plusieurs échelles de temps." }
  ] },
  { id: "p6", title: "Réchauffement actuel et rétroactions", fiche: "les fiches 9 et 10", qs: [
    { q: "Depuis environ un siècle et demi, la température moyenne globale a augmenté d'environ :", o: ["0,1 °C", "1 °C", "5 °C", "10 °C"], a: 1,
      why: "On mesure un réchauffement global d'environ +1 °C depuis le milieu du XIXᵉ siècle (un peu plus de 1,1 °C aujourd'hui)." },
    { q: "Lequel de ces gaz n'est PAS un gaz à effet de serre important ?", o: ["Le dioxyde de carbone (CO₂)", "Le méthane (CH₄)", "Le diazote (N₂)", "Le protoxyde d'azote (N₂O)"], a: 2,
      why: "CO₂, CH₄, N₂O et vapeur d'eau sont les principaux gaz à effet de serre. Le diazote, pourtant majoritaire (78 %), n'en est pas un." },
    { q: "Le dégel du pergélisol (sol gelé en permanence) sous l'effet du réchauffement libère du CO₂ et du CH₄. Il s'agit d'une rétroaction :",
      o: ["positive, car elle amplifie le réchauffement", "négative, car elle freine le réchauffement", "neutre", "positive, car elle refroidit le climat"], a: 0,
      why: "Réchauffement → dégel → libération de gaz à effet de serre → effet de serre accru → réchauffement : la boucle amplifie la perturbation.",
      no: { 3: "Une rétroaction positive amplifie la perturbation : ici, le réchauffement." } },
    { q: "À court terme, un accroissement de la végétalisation :",
      o: ["est une rétroaction négative : les végétaux absorbent du CO₂ et freinent le réchauffement", "est une rétroaction positive : les végétaux rejettent du dioxygène", "n'a aucun effet sur le CO₂ atmosphérique", "renforce l'effet de serre"], a: 0,
      why: "Par la photosynthèse, les végétaux constituent un puits de CO₂ : la concentration en CO₂ augmente moins vite, ce qui freine le réchauffement." },
    { q: "La fonte des glaces de mer découvre l'océan, plus sombre, qui renvoie moins le rayonnement solaire et en absorbe davantage. Cette rétroaction :",
      o: ["amplifie le réchauffement (rétroaction positive)", "freine le réchauffement (rétroaction négative)", "fait baisser le niveau marin", "n'agit qu'en hiver"], a: 0,
      why: "Plus de rayonnement absorbé → plus de réchauffement → plus de fonte : la boucle amplifie la perturbation." },
    { q: "L'océan absorbe une grande partie de l'énergie supplémentaire liée à l'augmentation de l'effet de serre. Quelle conséquence à long terme ?",
      o: ["Le changement climatique est irréversible à l'échelle de plusieurs siècles : l'énergie stockée retournera vers l'atmosphère", "L'énergie est détruite au fond des océans", "L'océan se refroidit", "Le niveau marin baisse"], a: 0,
      why: "À court terme, l'océan amortit la hausse de température. À long terme, l'énergie qu'il a accumulée retourne vers l'atmosphère : le réchauffement se poursuit pendant des siècles." },
    { q: "Depuis plusieurs centaines de milliers d'années, l'augmentation actuelle de la concentration atmosphérique en CO₂ est :",
      o: ["la plus rapide jamais enregistrée", "comparable aux variations naturelles", "plus lente que lors des déglaciations", "impossible à mesurer"], a: 0,
      why: "Jamais, depuis plusieurs centaines de milliers d'années, la concentration en CO₂ n'a augmenté aussi rapidement qu'aujourd'hui." }
  ] }
];


/* ---------- palier (e/m/h), compétence, 3 coups de pouce ---------- */
const COMP = { conn: "Mobiliser ses connaissances", doc: "Extraire des informations d'un document", graph: "Lire un graphique", calc: "Calculer", rais: "Raisonner, argumenter" };
const LVL = { e: ["🟢", "Facile"], m: ["🟡", "Moyen"], h: ["🔴", "Défi"] };
const META = {
  p1q1: ["m", "doc", ["Pour chaque gaz, calcule : valeur actuelle − valeur primitive.", "Une proportion qui passe de 5 % à 78 % gagne combien de points ?", "Le diazote gagne 73 points ; le dioxygène, 21 seulement."]],
  p1q2: ["m", "rais", ["Plus une planète est loin du Soleil, plus elle reçoit… ?", "Vénus reçoit moins d'énergie solaire que Mercure : la distance n'explique donc pas sa température.", "Regarde la composition : 96,5 % d'un gaz à effet de serre, sous 92 atm."]],
  p1q3: ["e", "calc", ["1 bar = 1 000 hPa.", "Pour passer des hPa aux bar, on divise par 1 000.", "850 ÷ 1 000 = …"]],
  p1q4: ["e", "graph", ["Repère la ligne horizontale 10³ Pa.", "Place le point à 20 °C sur cette ligne : au-dessus ou en dessous de la courbe liquide–gaz ?", "Sous la courbe liquide–gaz, on est dans le domaine du gaz."]],
  p1q5: ["m", "graph", ["Trace mentalement la ligne 10⁶ Pa.", "Où cette ligne coupe-t-elle la courbe liquide–gaz ?", "Vers 180 °C : entre 50 et 150 °C, on reste du même côté de la courbe."]],
  p1q6: ["m", "doc", ["Compare la part de vapeur d'eau dans les deux colonnes.", "Les deux sources libèrent-elles beaucoup de vapeur d'eau ?", "Une source interne et une source externe sont toutes deux compatibles avec les données."]],
  p2q1: ["e", "doc", ["Qu'apporte l'eau oxygénée dans le tube B ?", "Le fer (II) est soluble ; le fer (III) est insoluble.", "Le dioxygène transforme le fer (II) dissous en fer (III), qui précipite."]],
  p2q2: ["m", "calc", ["Commence par le fer : combien d'atomes dans Fe₂O₃ ?", "Il faut donc 2 Fe(OH)₃ : compte les atomes d'hydrogène à gauche.", "6 H à gauche, donc 3 H₂O à droite ; vérifie l'oxygène."]],
  p2q3: ["e", "conn", ["Les fers rubanés sont-ils des dépôts marins ou continentaux ?", "Ils témoignent du dioxygène dans l'océan, avant son accumulation dans l'air.", "Leur dépôt massif s'arrête vers 2,4 Ga."]],
  p2q4: ["m", "rais", ["Un sol continental est en contact avec l'atmosphère.", "Le fer (II) n'est conservé qu'en l'absence de dioxygène.", "Un sol gris riche en fer (II) indique une atmosphère sans dioxygène."]],
  p2q5: ["h", "rais", ["D'où vient le fer dissous dans les océans ?", "Que devient le fer des roches continentales quand l'air contient du dioxygène ?", "Oxydé sur place, insoluble, il n'arrive plus dissous jusqu'à l'océan."]],
  p2q6: ["e", "conn", ["Distingue l'apparition du dioxygène dans l'air et la teneur actuelle.", "L'accumulation commence vers 2,4 Ga…", "… mais la teneur actuelle n'est atteinte que bien plus tard."]],
  p3q1: ["e", "conn", ["L'ozone a pour formule O₃.", "Il se forme à partir d'une molécule abondante dans l'air.", "Les UV cassent O₂ en deux atomes O, qui s'associent ensuite à O₂."]],
  p3q2: ["h", "graph", ["Il faut deux conditions : atteindre le sol ET être absorbé par l'ADN.", "Lis les deux graphiques à la même longueur d'onde.", "À 260 nm, rien n'atteint le sol ; à 340 nm, l'ADN n'absorbe plus rien."]],
  p3q3: ["m", "conn", ["Les CFC sont-ils toxiques pour les êtres vivants ?", "Les UV libèrent du chlore à partir des CFC.", "Regarde les deux réactions : que devient l'atome de chlore à la fin ?"]],
  p3q4: ["e", "graph", ["Compare les deux courbes.", "Le témoin reste à 20,9 % : l'appareil fonctionne.", "Seule l'enceinte avec le criquet perd du dioxygène."]],
  p3q5: ["m", "doc", ["Un puits retire du dioxygène à l'atmosphère.", "Parmi les puits, lequel est lié aux activités humaines ?", "Brûler un combustible consomme du dioxygène."]],
  p3q6: ["m", "rais", ["Quelle est la teneur en dioxygène au Carbonifère ?", "Que montre l'élevage dans un air enrichi en dioxygène ?", "Les deux données vont dans le même sens."]],
  p4q1: ["e", "conn", ["Cherche la durée concernée par chaque information.", "Le climat repose sur des moyennes calculées sur une longue période.", "Une moyenne sur 30 ans est une normale climatique."]],
  p4q2: ["m", "rais", ["Qu'est-ce qui distingue la météo du climat : l'étendue ou la durée ?", "Le document décrit un instant précis.", "Une date précise relève de la météorologie, même à l'échelle du globe."]],
  p4q3: ["e", "calc", ["Écart = valeur observée − valeur de référence.", "36,4 − 24,9 = …", "N'oublie ni le signe ni l'unité."]],
  p4q4: ["m", "graph", ["Lis la valeur de 1960, puis celle de 2020.", "Touche la courbe à 1960 et à 2020 pour lire les valeurs.", "≈ +0,25 °C puis ≈ +1,15 °C : fais la différence."]],
  p4q5: ["m", "calc", ["Vitesse = variation ÷ durée.", "8 cm = 80 mm ; durée = 2015 − 1993.", "80 ÷ 22 = …"]],
  p4q6: ["m", "conn", ["La glace qui flotte déjà fait-elle monter le niveau quand elle fond ?", "Que fait l'eau de mer quand elle se réchauffe ?", "Dilatation thermique + fonte des glaces posées sur les continents."]],
  p4q7: ["e", "rais", ["Un hiver est-il un épisode ou une moyenne ?", "Une tendance climatique se lit sur au moins 30 ans, à grande échelle.", "Un épisode régional ne suffit pas à contredire une tendance globale."]],
  p5q1: ["e", "graph", ["Repère −20 sur l'axe horizontal.", "La courbe est-elle au-dessus ou en dessous de 0 °C ?", "Environ −7 °C par rapport à l'actuel."]],
  p5q2: ["m", "graph", ["Les périodes chaudes sont les pics au-dessus de 0 °C.", "Compare la largeur d'un pic et celle d'un creux.", "Un pic dure 10 000 à 20 000 ans ; un creux, plusieurs dizaines de milliers d'années."]],
  p5q3: ["e", "rais", ["Une moraine marque une ancienne position du front du glacier.", "Le glacier descendait donc plus bas qu'aujourd'hui.", "Un glacier plus étendu suppose un climat plus froid."]],
  p5q4: ["m", "doc", ["Repère les deux plantes les plus abondantes.", "Lis leurs préférences climatiques dans le tableau.", "Sapin + aulne = 80 % des pollens."]],
  p5q5: ["e", "rais", ["Une floraison plus précoce indique un printemps… ?", "Compare les XVIᵉ–XVIIIᵉ siècles et l'an 2000.", "La floraison avance : les printemps se réchauffent."]],
  p5q6: ["e", "conn", ["Pense au cycle d'environ 100 000 ans.", "Pense aussi à la dernière déglaciation, il y a 20 000 à 10 000 ans.", "La variabilité naturelle existe à plusieurs échelles de temps."]],
  p6q1: ["e", "conn", ["C'est un ordre de grandeur, sur environ 150 ans.", "C'est un peu plus de 1 °C aujourd'hui.", "Ni 0,1 °C, ni 5 °C."]],
  p6q2: ["e", "conn", ["Liste les principaux gaz à effet de serre du programme.", "CO₂, CH₄, N₂O et vapeur d'eau.", "Le gaz majoritaire de l'air n'en fait pas partie."]],
  p6q3: ["m", "rais", ["Quel est l'effet des gaz libérés par le dégel ?", "Plus de GES → plus de réchauffement → plus de dégel…", "Une boucle qui amplifie la perturbation est positive."]],
  p6q4: ["m", "rais", ["Que font les végétaux chlorophylliens du CO₂ ?", "Moins de CO₂ dans l'air : l'effet de serre augmente moins vite.", "Une boucle qui freine la perturbation est négative."]],
  p6q5: ["m", "rais", ["L'océan, sombre, absorbe-t-il plus ou moins d'énergie que la glace ?", "Plus d'énergie absorbée → la température… ?", "Une boucle qui amplifie la perturbation est positive."]],
  p6q6: ["h", "rais", ["Où est stockée l'essentiel de l'énergie supplémentaire ?", "L'océan restitue cette énergie très lentement.", "Le réchauffement se poursuivra pendant des siècles."]],
  p6q7: ["e", "conn", ["Compare avec plusieurs centaines de milliers d'années.", "Les variations naturelles passées étaient beaucoup plus lentes.", "La plus rapide jamais enregistrée sur cette période."]]
};
const LORD = { e: 0, m: 1, h: 2 };
PARTS.forEach(p => { p.qs.forEach((q, i) => { const m = META[p.id + "q" + (i + 1)]; q.lvl = m[0]; q.comp = m[1]; q.hints = m[2]; }); p.qs.sort((a, b) => LORD[a.lvl] - LORD[b.lvl]); });
const ACTIVITY = "QCM Atmosphère et climat · Terminale, Enseignement scientifique · Thème 1 « Science, climat et société » (1.1 L'atmosphère terrestre et la vie ; 1.2 La complexité du système climatique). 38 questions en 6 parties, classées par palier dans chaque partie. Score compté au premier essai, sans points négatifs.";
/* ---------- état ---------- */
const DEF = { fs: 21, theme: null, proj: false, ans: {}, seed: (Math.random() * 1e9) | 0, view: "accueil" };
let S = Store.load(DEF);
const save = () => Store.save(S);
const qid = (p, i) => p.id + "q" + (i + 1);
const ALLQ = []; PARTS.forEach((p, pi) => p.qs.forEach((q, i) => ALLQ.push({ p, pi, q, i, id: qid(p, i) })));

function partScore(p) { let ok = 0, done = 0; p.qs.forEach((q, i) => { const a = S.ans[qid(p, i)]; if (a && a.first !== undefined) { done++; if (a.first) ok++; } }); return { ok, done, n: p.qs.length }; }
function compScore() { const r = {}; Object.keys(COMP).forEach(k => r[k] = { ok: 0, done: 0, n: 0 }); ALLQ.forEach(x => { const c = r[x.q.comp]; c.n++; const a = S.ans[x.id]; if (a && a.first !== undefined) { c.done++; if (a.first) c.ok++; } }); return r; }
function level(ok, n) { const r = n ? ok / n : 0; return r >= 0.8 ? ["Acquis", "ok"] : r >= 0.5 ? ["En cours d'acquisition", "mid"] : ["À retravailler", "bad"]; }
const shortQ = q => q.q.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").slice(0, 90) + (q.q.length > 90 ? "…" : "");

/* ---------- navigation ---------- */
const VIEWS = ["accueil", ...PARTS.map(p => p.id), "bilan"];
function tabs() {
  $("#tabs").innerHTML = VIEWS.map(v => {
    if (v === "accueil") return `<button class="tab" type="button" data-v="accueil">Accueil</button>`;
    if (v === "bilan") return `<button class="tab" type="button" data-v="bilan">Bilan</button>`;
    const p = PARTS.find(x => x.id === v); const s = partScore(p);
    return `<button class="tab" type="button" data-v="${v}">Partie ${v.slice(1)}<span class="dot" aria-label="${s.done} questions faites sur ${s.n}">${s.done === s.n ? "✓" : s.done ? s.done + "/" + s.n : ""}</span></button>`;
  }).join("");
  $$("#tabs .tab").forEach(b => { b.onclick = () => go(b.dataset.v); if (b.dataset.v === S.view) b.setAttribute("aria-current", "page"); });
}
function go(v, noScroll) {
  if (!VIEWS.includes(v)) v = "accueil";
  S.view = v; save(); tabs();
  if (location.hash !== "#" + v) { try { history.replaceState(null, "", "#" + v); } catch (e) {} }
  const m = $("#main");
  if (v === "accueil") renderHome(m); else if (v === "bilan") renderBilan(m); else renderPart(m, PARTS.find(p => p.id === v));
  if (!noScroll) window.scrollTo(0, 0);
  const cur = $("#tabs [aria-current]"); if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "nearest", inline: "center" });
}

function renderHome(m) {
  const tot = ALLQ.length, done = ALLQ.filter(x => S.ans[x.id] && S.ans[x.id].first !== undefined).length;
  m.innerHTML = `<section class="view">
    <div class="panel"><p class="kicker">Mode d'emploi</p><h2 class="sec-title">${tot} questions en 6 parties</h2>
      <ul class="ul">
        <li>Choisis une réponse, puis touche <b>Valider</b>. Seul ton <b>premier essai</b> compte ; ensuite, réessaie librement.</li>
        <li>Bloqué ? Touche <b>💡 Coup de pouce</b> : trois indices, du plus général au plus précis.</li>
        <li>La correction s'affiche dès que tu as juste, ou après ton deuxième essai.</li>
        <li>Chaque question indique son palier (🟢 Facile, 🟡 Moyen, 🔴 Défi) et la compétence travaillée.</li>
        <li>Sur un graphique, touche un point pour lire sa valeur ; ▶ Lancer rejoue le tracé.</li>
      </ul></div>
    <div class="box key"><p class="lab">✔ Règle clé</p><p>Lis toute la question avant les propositions, puis élimine celles que le document contredit.</p></div>
    <div class="grid-cards">${PARTS.map((p, i) => { const s = partScore(p); return `<button class="card-btn" type="button" data-go="${p.id}"><span class="kicker">Partie ${i + 1}</span><span class="t">${p.title}</span><span class="m">${p.qs.length} questions · révise avec ${p.fiche}</span><span class="chip ${s.done === s.n ? level(s.ok, s.n)[1] : ""}">${s.done}/${s.n} faites${s.done ? ` · ${s.ok} au premier essai` : ""}</span></button>`; }).join("")}</div>
    <p class="lead">${done}/${tot} questions faites.</p>
  </section>`;
  $$("[data-go]", m).forEach(b => b.onclick = () => go(b.dataset.go));
}

function renderPart(m, p) {
  const idx = PARTS.indexOf(p);
  m.innerHTML = `<section class="view"><div><p class="kicker">Partie ${idx + 1} · ${p.qs.length} questions · du 🟢 au 🔴</p><h2 class="sec-title">${p.title}</h2><p class="lead">En cas de difficulté, révise ${p.fiche} de l'app « Fiches ».</p></div>
    ${p.qs.map((q, i) => `<article class="panel" id="${qid(p, i)}" aria-labelledby="${qid(p, i)}-t"></article>`).join("")}
    <div class="panel" id="partEnd"></div></section>`;
  p.qs.forEach((q, i) => renderQ(p, i));
  renderPartEnd(p);
}
function order(id, n) { const base = Array.from({ length: n }, (_, i) => i); let h = S.seed; for (const c of id) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff; return shuffle(base, h || 7); }

function renderQ(p, i) {
  const q = p.qs[i], id = qid(p, i), el = $("#" + id), L = LVL[q.lvl];
  el.innerHTML = `<div class="qhead"><p class="kicker">Question ${i + 1}</p><span class="chip">${L[0]} ${L[1]}</span><span class="chip">${COMP[q.comp]}</span></div>
    <h3 id="${id}-t" class="qtext">${q.q}</h3>
    ${(q.docs || []).map(docHTML).join("")}<div class="qdyn" style="display:grid;gap:.7rem"></div>`;
  mountDocs(el); paintQ(p, i);
}
function paintQ(p, i) {
  const q = p.qs[i], id = qid(p, i), el = $("#" + id + " .qdyn"), st = S.ans[id] || {};
  const ord = order(id, q.o.length);
  const locked = st.cur !== undefined && st.cur !== null && st.validated;
  const good = locked && st.cur === q.a;
  el.innerHTML = `<div class="opts" role="radiogroup" aria-labelledby="${id}-t">${ord.map((k, j) => {
      const chosen = st.cur === k; let cls = "", tag = "";
      if (locked) { if (k === q.a && chosen) { cls = "is-ok"; tag = "✓ Juste"; } else if (chosen) { cls = "is-bad"; tag = "✗ Faux"; } else if (k === q.a && st.showAns) { cls = "is-ok"; tag = "✓ Bonne réponse"; } }
      return `<button type="button" class="opt ${cls}" role="radio" aria-checked="${chosen}" data-k="${k}" ${locked ? "disabled" : ""}><span class="k">${"ABCD"[j]}</span><span>${q.o[k]}</span>${tag ? `<span class="tag">${tag}</span>` : ""}</button>`;
    }).join("")}</div>
    <div class="row qact"></div><div class="qfb" aria-live="polite"></div><div class="hints"></div><div class="qcorr"></div>`;
  const act = $(".qact", el), fb = $(".qfb", el), hz = $(".hints", el), cz = $(".qcorr", el);
  const nh = st.hints || 0;
  hz.innerHTML = q.hints.slice(0, nh).map((h, k) => `<p class="hint"><b>Coup de pouce ${k + 1}/3</b> · ${h}</p>`).join("");
  const hintBtn = nh < 3 && !good ? `<button class="btn ghost" type="button" data-h>💡 Coup de pouce ${nh + 1}/3</button>` : "";
  if (!locked) {
    act.innerHTML = `<button class="btn" type="button" data-v ${st.cur === undefined || st.cur === null ? "disabled" : ""}>Valider</button>${hintBtn}${st.first !== undefined ? `<span class="chip">Premier essai compté : ${st.first ? "✓ juste" : "✗ faux"}</span>` : ""}`;
  } else {
    fb.innerHTML = good
      ? `<div class="fb ok"><p class="h">✓ Juste${st.first ? " du premier coup !" : " (après réessai, non compté)."}</p></div>`
      : `<div class="fb bad"><p class="h">✗ Pas encore.</p><p>${(q.no && q.no[st.cur]) || "Relis le document et élimine les propositions qu'il contredit."}</p></div>`;
    act.innerHTML = good ? `<button class="btn ghost" type="button" data-r>↺ Refaire la question</button>` : `<button class="btn" type="button" data-r>↺ Réessayer${st.first !== undefined ? " (non compté)" : ""}</button>${hintBtn}`;
  }
  if (st.showAns) cz.innerHTML = `<div class="corr"><p class="h">Correction</p><p>${q.why}</p></div>`;
  $$(".opt", el).forEach(b => b.onclick = () => { if (locked) return; st.cur = +b.dataset.k; S.ans[id] = st; save(); paintQ(p, i); const nb = $(`.opt[data-k="${b.dataset.k}"]`, el); if (nb) nb.focus(); });
  const hb = $("[data-h]", el); if (hb) hb.onclick = () => { st.hints = Math.min(3, (st.hints || 0) + 1); S.ans[id] = st; save(); paintQ(p, i); const h = $$(".hint", el).pop(); if (h) h.scrollIntoView({ block: "nearest", behavior: "smooth" }); };
  const vb = $("[data-v]", el); if (vb) vb.onclick = () => {
    if (st.cur === undefined || st.cur === null) return;
    st.validated = true; const ok = st.cur === q.a;
    if (st.first === undefined) { st.first = ok; st.hintsBefore = st.hints || 0; }
    st.tries = (st.tries || 0) + 1; if (ok || st.tries >= 2) st.showAns = true;
    S.ans[id] = st; save(); paintQ(p, i); renderPartEnd(p); tabs();
    const f = $(".qfb", el); if (f && f.scrollIntoView) f.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };
  const rb = $("[data-r]", el); if (rb) rb.onclick = () => { st.validated = false; st.cur = null; S.ans[id] = st; save(); paintQ(p, i); };
}

function renderPartEnd(p) {
  const el = $("#partEnd"); if (!el) return; const s = partScore(p); const idx = PARTS.indexOf(p); const next = PARTS[idx + 1];
  if (s.done < s.n) { el.innerHTML = `<p><b>${s.done}/${s.n}</b> questions validées dans cette partie.</p><div class="bar" aria-hidden="true"><i style="width:${s.done / s.n * 100}%"></i></div>`; return; }
  const [lab, cls] = level(s.ok, s.n);
  el.innerHTML = `<p class="kicker">Fin de la partie ${idx + 1}</p><p class="score-big">${s.ok}/${s.n}</p><p><span class="chip ${cls}">${cls === "ok" ? "✓" : cls === "mid" ? "◐" : "✗"} ${lab}</span> au premier essai.</p>
    ${cls !== "ok" ? `<div class="box warn"><p class="lab">⚠ Conseil</p><p>Relis ${p.fiche}, puis refais les questions ratées.</p></div>` : ""}
    <div class="row">${next ? `<button class="btn" type="button" data-n>Partie ${idx + 2} →</button>` : ""}<button class="btn ghost" type="button" data-b>Voir mon bilan</button></div>`;
  const n = el.querySelector("[data-n]"); if (n) n.onclick = () => go(next.id);
  el.querySelector("[data-b]").onclick = () => go("bilan");
}

function missed() { return ALLQ.filter(x => S.ans[x.id] && S.ans[x.id].first === false); }
function bilanText(name) {
  let t = `RÉSUMÉ DE L'ACTIVITÉ\n${ACTIVITY}\nParties : ${PARTS.map((p, i) => `${i + 1}. ${p.title}`).join(" · ")}\n\nBILAN\nÉlève : ${name || "—"}\nDate : ${today()}\n\nScore par partie (premier essai)\n`;
  let ok = 0, n = 0, done = 0;
  PARTS.forEach((p, i) => { const s = partScore(p); ok += s.ok; n += s.n; done += s.done; t += `- Partie ${i + 1} · ${p.title} : ${s.ok}/${s.n}${s.done < s.n ? ` (${s.done}/${s.n} faites)` : ` — ${level(s.ok, s.n)[0]}`}\n`; });
  t += `Total : ${ok}/${n} (${done}/${n} questions faites)\n\nScore par compétence\n`;
  const cs = compScore(); Object.entries(COMP).forEach(([k, lab]) => { const c = cs[k]; t += `- ${lab} : ${c.ok}/${c.done} réussies au premier essai (${c.n} questions)\n`; });
  const ms = missed(); t += `\nQuestions ratées au premier essai (${ms.length})\n` + (ms.length ? ms.map(x => `- Partie ${x.pi + 1}, question ${x.i + 1} [${LVL[x.q.lvl][1]} · ${COMP[x.q.comp]}] : ${shortQ(x.q)}`).join("\n") : "- aucune") + "\n";
  const nh = ALLQ.reduce((a, x) => a + ((S.ans[x.id] && S.ans[x.id].hints) || 0), 0); t += `\nCoups de pouce utilisés : ${nh}\n`;
  const weak = PARTS.filter(p => { const s = partScore(p); return s.done === s.n && s.ok / s.n < 0.8; });
  if (weak.length) t += `À revoir : ${weak.map(p => p.fiche).join(", ")}\n`;
  return t;
}
function renderBilan(m) {
  let ok = 0, n = 0, done = 0; PARTS.forEach(p => { const s = partScore(p); ok += s.ok; n += s.n; done += s.done; });
  const cs = compScore(), ms = missed();
  m.innerHTML = `<section class="view"><div><p class="kicker">Bilan</p><h2 class="sec-title">Mon bilan</h2><p class="lead">Score compté au premier essai. ${done}/${n} questions faites.</p></div>
    <div class="panel"><p class="score-big">${ok}/${n}</p><div class="bar" aria-hidden="true"><i style="width:${n ? ok / n * 100 : 0}%"></i></div></div>
    <div class="panel"><h3>Par partie</h3><div class="tablewrap"><table class="t"><thead><tr><th>Partie</th><th>Score</th><th>Niveau</th><th>À réviser</th></tr></thead><tbody>${PARTS.map((p, i) => { const s = partScore(p); const lv = s.done < s.n ? ["Non terminée", ""] : level(s.ok, s.n); return `<tr><td>${i + 1}. ${p.title}</td><td class="n">${s.ok}/${s.n}</td><td><span class="chip ${lv[1]}">${lv[1] === "ok" ? "✓ " : lv[1] === "bad" ? "✗ " : lv[1] === "mid" ? "◐ " : ""}${lv[0]}</span></td><td>${p.fiche}</td></tr>`; }).join("")}</tbody></table></div></div>
    <div class="panel"><h3>Par compétence</h3><div class="comps">${Object.entries(COMP).map(([k, lab]) => { const c = cs[k]; const r = c.done ? c.ok / c.done : 0; return `<div class="comp"><div class="row" style="justify-content:space-between"><span>${lab}</span><b class="num">${c.ok}/${c.done}${c.done < c.n ? ` <span class="muted">(${c.n - c.done} à faire)</span>` : ""}</b></div><div class="bar" aria-hidden="true"><i style="width:${r * 100}%"></i></div></div>`; }).join("")}</div></div>
    <div class="panel"><h3>Questions ratées au premier essai</h3>${ms.length ? `<ul class="ul">${ms.map(x => `<li><button class="linkbtn" type="button" data-q="${x.p.id}|${x.id}">Partie ${x.pi + 1}, question ${x.i + 1}</button> · ${LVL[x.q.lvl][0]} ${COMP[x.q.comp]}</li>`).join("")}</ul>` : `<p>Aucune pour l'instant.</p>`}</div>
    <div class="panel"><h3>Transmettre mon bilan</h3><p class="lead">Le fichier contient le résumé de l'activité, ton score par partie et par compétence, et la liste des questions ratées.</p><div id="bt"></div></div>
    <div class="panel"><h3>Recommencer</h3><p class="lead">Efface toutes les réponses de ce QCM sur cet appareil.</p><div class="row"><button class="btn ghost" type="button" id="reset">Tout effacer</button></div></div></section>`;
  $$("[data-q]", m).forEach(b => b.onclick = () => { const [pid, qq] = b.dataset.q.split("|"); go(pid); setTimeout(() => { const e = $("#" + qq); if (e) e.scrollIntoView({ block: "start" }); }, 60); });
  renderBilanTools($("#bt"), bilanText, name => `<p class="kicker">Bilan à montrer au professeur</p><h2>${esc(name || "Élève")}</h2><p>QCM Atmosphère et climat · ${today()}</p>${PARTS.map((p, i) => { const s = partScore(p); return `<div class="line"><span>${i + 1}. ${p.title}</span><b class="num">${s.ok}/${s.n}${s.done < s.n ? " *" : ""}</b></div>`; }).join("")}<div class="line"><span><b>Total (premier essai)</b></span><b class="num">${ok}/${n}</b></div><p style="font-size:1.1rem">Questions ratées : ${ms.length ? ms.map(x => `P${x.pi + 1}-Q${x.i + 1}`).join(", ") : "aucune"}${done < n ? " · * partie non terminée" : ""}</p>`, "qcm-atmosphere-climat");
  armButton($("#reset"), "Tout effacer", "Confirmer l'effacement ?", () => { S.ans = {}; S.seed = (Math.random() * 1e9) | 0; save(); go("accueil"); });
}

/* ---------- démarrage ---------- */
Display.init(S, save);
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && h !== S.view && VIEWS.includes(h)) go(h); });
go(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : (S.view || "accueil"), true);
