/* ===== 2nde SVT · Thème 1 · Chapitre 3 · Activité 2 « L'évolution de la biodiversité au cours du temps » : contenus =====
   D'après le sujet du professeur (Th1 Ch3 Act2 2025), son corrigé, le TP « foraminifères et crise K/T » et le résumé du chapitre.
   Le logiciel « Écosystèmes » est remplacé par une machine à remonter le temps ; les documents 2 à 4 sont redessinés (valeurs simulées ou approchées). */
const PROBLEM = "Comment et pourquoi la biodiversité change-t-elle au cours du temps ?";
const tk2 = ok => ok ? "✓" : "○";
const taskMsg = (ok, msg) => ({ ok, msg });
const TVS = () => (xst().tv || {}).vis || {};
const T_TV1 = () => { const v = TVS(); return taskMsg(!!(v.a && v.c), `${tk2(v.a)} forêt actuelle de Guadeloupe · ${tk2(v.c)} forêt du Carbonifère`); };
const T_TV2 = () => { const v = TVS(), t = xst().tv || {}, n = ERAS.filter(e => v[e]).length; return taskMsg(n === 4 && !!t.gok, `${tk2(n === 4)} ${n}/4 époques visitées · ${tk2(t.gok)} tableau des groupes vérifié et juste`); };
const T_LP = () => { const l = xst().lp || {}, n = o => SAB[o].f.filter((f, i) => (l[o] || {})[i] === f[0]).length; return taskMsg(n("M") + n("D") === 12, `${tk2(n("M") === 6)} sable A : ${n("M")}/6 identifiés · ${tk2(n("D") === 6)} sable B : ${n("D")}/6 identifiés`); };
const T_KT = () => taskMsg(!!(xst().kt || {}).done, (xst().kt || {}).done ? "✓ Carotte lue jusqu'à −65 Ma." : "Lance la lecture de la carotte jusqu'au bout (−65 Ma).");
const T_FA = () => taskMsg(!!(xst().fa || {}).done, (xst().fa || {}).done ? "✓ Courbe tracée jusqu'à aujourd'hui." : "Lance le tracé de la courbe jusqu'au bout.");
const T_AM = () => taskMsg(!!(xst().am || {}).done, (xst().am || {}).done ? "✓ Animation de l'Amazonie regardée jusqu'en 2010." : "Lance l'animation de l'Amazonie jusqu'en 2010.");
const T_SL = () => { const n = ((xst().sl || {}).gens || [0]).length - 1; return taskMsg(n >= 6, `${tk2(n >= 6)} ${Math.min(n, 6)}/6 générations de sélection`); };

const HOME = { slug: "evolution-biodiversite-temps", short: "La biodiversité au cours du temps", last: "c2", lastG: "p3", lastK: 1, dur: "environ 1 h 30 (possible en deux séances : parties 1 et 2, puis partie 3)",
  kicker: "Thème 1 · Chapitre 3 · Biodiversité actuelle et passée · Activité 2", title: "Comment la biodiversité a-t-elle évolué au cours du temps ?",
  intro: "Une machine à remonter le temps, une loupe binoculaire, une carotte de roches et des graphiques : compare la biodiversité à différentes époques, découvre ce qui l'a bouleversée il y a 66 millions d'années, puis comment l'être humain la modifie aujourd'hui.",
  lab: "Le problème", goal: "Objectifs : comparer la diversité biologique à différentes périodes et mettre en évidence son évolution ; identifier des facteurs naturels et humains qui la modifient.",
  fact: "Au Carbonifère, la libellule géante Meganeura avait près de 70 cm d'envergure. Aujourd'hui, les plus grandes libellules et demoiselles atteignent à peine 20 cm.",
  parts: "Les trois parties de l'activité", recop: "Bilan à recopier dans le cahier",
  txt: "ACTIVITÉ 2 · L'ÉVOLUTION DE LA BIODIVERSITÉ AU COURS DU TEMPS\n2nde SVT · Thème 1 · Chapitre 3 : biodiversité actuelle et passée",
  comps: { conn: "Restituer ses connaissances", lire: "Extraire des informations (logiciel, documents, graphiques)", calc: "Calculer (conversions, durées, pourcentages)", rais: "Raisonner, mettre en relation", mod: "Exploiter un logiciel, réaliser un TP virtuel" },
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "Je choisis, je complète et je calcule, pas à pas." },
    l: { icon: "🎓", short: "Exigeante", name: "Version exigeante", q: "exigeante", desc: "Les mêmes manipulations, moins d'aide : je calcule davantage et je rédige avec « je vois → je sais → j'en déduis »." } },
  extraTitle: "Mes observations",
  extra: () => {
    const x = xst(), tv = x.tv || {}, l = x.lp || {}, sl = (x.sl || {}).gens || [];
    const n = o => SAB[o].f.filter((f, i) => (l[o] || {})[i] === f[0]).length;
    return `MES OBSERVATIONS\n- Machine à remonter le temps : ${ERAS.filter(e => (tv.vis || {})[e]).length}/4 époques visitées ; tableau des groupes ${tv.gok ? "juste" : "non terminé"}${tv.gchk ? ` (${tv.gchk} vérification(s))` : ""}\n- Loupe binoculaire : ${n("M")}/6 microfossiles identifiés dans le sable du Maastrichtien, ${n("D")}/6 dans celui du Danien ; ${l.e || 0} erreur(s) au premier choix\n- Sélection du maïs : ${sl.length > 1 ? `${sl.length - 1} génération(s), longueur moyenne des épis de ${fmt(sl[0])} cm à ${fmt(sl[sl.length - 1])} cm (modèle simplifié)` : "pas encore réalisée"}\n`;
  },
  extraHTML: () => {
    const x = xst(), tv = x.tv || {}, l = x.lp || {}, sl = (x.sl || {}).gens || [];
    const n = o => SAB[o].f.filter((f, i) => (l[o] || {})[i] === f[0]).length;
    return tbl(["Manipulation", "Résultat"], [["Machine à remonter le temps", `${ERAS.filter(e => (tv.vis || {})[e]).length}/4 époques · tableau des groupes ${tv.gok ? "✓ juste" : "à terminer"}`], ["Loupe binoculaire (foraminifères)", `Maastrichtien ${n("M")}/6 · Danien ${n("D")}/6 · ${l.e || 0} erreur(s) au premier choix`], ["Sélection du maïs (modèle)", sl.length > 1 ? `${sl.length - 1} génération(s) · ${fmt(sl[0])} → ${fmt(sl[sl.length - 1])} cm` : "—"]]);
  } };

/* ---------- documents (d'après le sujet du professeur) ---------- */
const box = (k, lab, h) => `<div class="box ${k}"><p class="lab">${lab}</p>${h}</div>`;
const DOC1 = { title: "Document 1 · Inventaire simplifié des espèces d'une forêt marécageuse actuelle de Guadeloupe", html: `<p>Au niveau du sol, les <b>fougères</b> peuvent recouvrir une grande surface lorsque l'éclairement est suffisant. On rencontre de nombreux arbustes, comme le bois lait (<i>Tabernaemontana citrifolia</i>). La strate des arbres, dominée par le <b>mangle médaille</b>, comporte une quinzaine d'espèces : mapou baril, <b>fromager</b> (<i>Ceiba pentandra</i>), palétuvier jaune, icaque…</p><p>Les oiseaux sont discrets : on rencontre le <b>colibri falle-vert</b> (<i>Eulampis holosericeus</i>) et le <b>sucrier</b> (<i>Coereba flaveola</i>), qui se nourrissent surtout du nectar des fleurs. Le <b>crabe de terre</b> (<i>Cardisoma guanhumi</i>) vit dans les endroits les plus élevés. Le <b>raton laveur</b> (<i>Procyon minor</i>), espèce protégée, fréquente la forêt marécageuse et la mangrove. Le <b>madère</b>, dont le tubercule est un aliment de base aux Antilles, pousse dans les parties humides.</p>` };
const DOC_KT = { title: "La crise Crétacé-Tertiaire (K/T)", html: `<p>La crise du Crétacé-Tertiaire (ou K/T, de l'allemand <i>Kreide-Tertiär</i>) est une <b>extinction de masse</b> survenue il y a environ <b>66 millions d'années</b> (65,5 Ma dans les documents plus anciens). Environ <b>76 % des espèces marines</b> se seraient alors éteintes, parmi lesquelles les ammonites, les bélemnites et les rudistes. De nombreuses victimes ont aussi été recensées sur la terre ferme, dont les dinosaures (non aviens).</p>` };
const DOC_FO = { title: "Document · Les foraminifères, des microfossiles", html: `<p>Les <b>foraminifères</b> sont des êtres vivants unicellulaires du plancton marin. Ils fabriquent une petite coquille calcaire (0,1 à 1 mm) formée de loges, percée d'un ou plusieurs orifices (le <i>foramen</i>). Après leur mort, ces coquilles s'accumulent au fond de l'océan et deviennent des <b>fossiles</b> dans les roches sédimentaires.</p><p>On dispose de deux sables précisément datés : l'un du <b>Maastrichtien</b> (fin du Crétacé), l'autre du <b>Danien</b> (début du Tertiaire), d'une loupe binoculaire et d'une planche d'identification.</p>` };
const DOC_RG = { title: "Document · Répartition des fossiles de trois groupes de foraminifères", w: "range", sim: "Schéma simplifié" };
const DOC_IR = { title: "Pour comprendre le document 2", html: `<ul class="ul"><li>L'<b>iridium</b> est un métal très rare dans les roches de la croûte terrestre, mais beaucoup plus abondant dans certaines <b>météorites</b>.</li><li>Les <b>fragments de magnétite</b> (un oxyde de fer) se forment en grand nombre lors de l'impact d'une météorite.</li><li>La <b>productivité biologique</b> est la quantité de matière organique produite par les êtres vivants, surtout le plancton. Le <b>CaCO₃</b> (calcaire) des roches marines provient surtout des coquilles du plancton, comme celles des foraminifères.</li></ul>` };
const DOC_CR = { title: "Document 3 · Les crises biologiques", html: `<p>Certaines <b>crises biologiques</b> entraînent la disparition brutale et simultanée de nombreuses espèces, et parfois de groupes entiers : ce sont des <b>extinctions de masse</b>. Le graphique montre le nombre de familles d'animaux marins au cours des 540 derniers millions d'années.</p>` };
const DOC_H = { title: "L'Homme et la biodiversité", html: `<p>Popularisé par le prix Nobel de chimie Paul Crutzen, le mot <b>anthropocène</b> désigne la période qui a débuté lorsque les activités humaines ont laissé une empreinte sur l'ensemble de la planète.</p><p><b>La destruction de la forêt en Amazonie.</b> En Amérique du Sud, 40 millions d'hectares (ha) de forêt ont disparu entre 2000 et 2010. 1 ha = 10 000 m².</p>` };
const DOC_M = { title: "Document · L'Homme et la biodiversité agricole", html: `<p>Depuis les débuts de l'agriculture, l'Homme croise et sélectionne les plantes qu'il cultive. Une plante sauvage du Mexique, la <b>téosinte</b>, est ainsi à l'origine de toutes les variétés de <b>maïs</b>, dont beaucoup ont disparu. En France, on compte plus de <b>1 200 variétés</b> de maïs autorisées ; seules quelques-unes sont réellement cultivées.</p>` };

/* ---------- bilan (corrigé du professeur) ---------- */
const BIL = ["La biodiversité <u>évolue en permanence</u> : les espèces actuelles ne représentent qu'une toute petite partie des espèces qui ont existé, comme le montrent les fossiles.",
  "Les <u>crises biologiques</u> sont des extinctions massives et brutales, suivies de périodes de <u>diversification</u> de nouveaux groupes.",
  "Lors de la <u>crise Crétacé-Tertiaire</u> (il y a 66 Ma), environ 76 % des espèces marines disparaissent, dont les ammonites, ainsi que les dinosaures non aviens. Causes : l'<u>impact de la météorite de Chicxulub</u> (pic d'iridium, magnétite) et un <u>volcanisme intense</u> (trapps du Deccan).",
  "La biodiversité est modifiée par des facteurs <u>naturels</u> (géologiques) et par des facteurs <u>anthropiques</u> : destruction des habitats (première cause), surexploitation, pollution, espèces invasives, maladies.",
  "L'Homme modifie aussi la biodiversité par la <u>sélection artificielle</u> (de la téosinte au maïs) ; mais cultiver peu de variétés réduit la diversité génétique."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("");

/* ---------- échauffement ---------- */
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement : se repérer dans les temps géologiques",
  intro: "Avant de voyager dans le temps, repère-toi sur la frise : les temps géologiques se comptent en millions d'années (Ma).",
  widget: { title: "Outil · La frise des temps géologiques", w: "frise" },
  parts: [
    { t: "choice", c: "conn", label: "Rappel de l'activité 1 : les trois échelles de la biodiversité sont…", o: ["les écosystèmes, les espèces et la diversité génétique", "les animaux, les végétaux et les bactéries", "les océans, les continents et l'atmosphère"], a: 0 },
    { t: "num", c: "calc", label: "Écris 66 Ma en années.", unit: "années", ans: 66000000, tol: 0, err: [[v => near(v, 66000, 0), "1 Ma = 1 million d'années = 1 000 000 d'années."], [v => near(v, 660000, 0), "1 Ma = 1 000 000 d'années : 66 × 1 000 000."]] },
    { t: "rows", c: "lire", label: "Range ces périodes de la plus ancienne (1) à la plus récente (4).", choices: ["1", "2", "3", "4"], rows: [{ txt: "Jurassique", a: 1 }, { txt: "Carbonifère", a: 0 }, { txt: "Paléogène", a: 3 }, { txt: "Crétacé", a: 2 }] },
    { t: "num", c: "calc", label: "Combien de temps a duré le Crétacé (de −145 à −66 Ma) ?", unit: "millions d'années", ans: 79, tol: 0, err: [[v => near(v, 211, 0), "On calcule une durée : 145 − 66, et non 145 + 66."]] }],
  hints: ["Touche les périodes sur la frise pour lire leurs dates.", "1 Ma = 1 000 000 d'années. Plus le nombre de Ma est grand, plus la période est ancienne.", "Écosystèmes, espèces, génétique · 66 000 000 · Carbonifère, Jurassique, Crétacé, Paléogène · 145 − 66 = 79."],
  corr: "Les trois échelles : écosystèmes, espèces, diversité génétique. 66 Ma = 66 000 000 d'années. Ordre : Carbonifère (1), Jurassique (2), Crétacé (3), Paléogène (4). Le Crétacé a duré 145 − 66 = 79 millions d'années." };

/* ---------- les trois parties ---------- */
const GROUPS = [
{ id: "p1", n: 1, icon: "⏳", tab: "Voyage dans le temps", title: "Comparer la biodiversité à différentes époques", sub: "La machine à remonter le temps (logiciel « Écosystèmes ») · environ 25 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "Deux forêts marécageuses, à 305 millions d'années d'écart",
    docs: [DOC1],
    widget: { title: "Logiciel · La machine à remonter le temps", w: "temps", sim: "Scènes reconstituées, tailles non respectées" },
    parts: [
      { t: "task", c: "mod", label: "Observe la forêt actuelle de Guadeloupe, puis voyage jusqu'au Carbonifère.", okMsg: "Les deux forêts ont été observées.", done: T_TV1 },
      { t: "rows", c: "lire", label: "Dans quelle forêt observe-t-on…", choices: ["Aujourd'hui", "Carbonifère", "Les deux"], rows: [
        { txt: "des arbres à fleurs (fromager, mangle médaille) ?", a: 0 }, { txt: "des prêles géantes de plus de 10 m ?", a: 1 }, { txt: "des fougères ?", a: 2 }, { txt: "des oiseaux et un mammifère ?", a: 0 }, { txt: "une libellule de 70 cm d'envergure ?", a: 1 }] },
      { t: "choice", c: "rais", label: "Que montre la comparaison des deux forêts ?", o: ["Les espèces ne sont pas les mêmes : la biodiversité évolue au cours du temps", "Les espèces actuelles existaient déjà il y a 305 Ma", "La biodiversité est restée la même : seule la taille des êtres vivants a changé"], a: 0, no: { 1: "Cherche un fromager ou un colibri dans la forêt du Carbonifère.", 2: "Les espèces elles-mêmes sont différentes, pas seulement leur taille." } }],
    hints: ["Touche « Carbonifère » : la machine voyage dans le temps. Lis le carnet de terrain sous chaque scène.", "Seules les fougères sont présentes dans les deux forêts ; les plantes à fleurs, les oiseaux et les mammifères n'existent pas encore au Carbonifère.", "Aujourd'hui · Carbonifère · les deux · aujourd'hui · Carbonifère · la biodiversité évolue."],
    corr: "Aujourd'hui, la forêt marécageuse de Guadeloupe abrite des fougères, des arbres à fleurs (fromager, mangle médaille), des oiseaux (colibri, sucrier) et un mammifère (raton laveur). Il y a 305 Ma, la forêt marécageuse du Carbonifère abritait des fougères, des lycophytes et des prêles géants, une libellule géante et des amphibiens primitifs, mais ni plantes à fleurs, ni oiseaux, ni mammifères. Les espèces ne sont pas les mêmes : la biodiversité évolue au cours du temps." },
  { id: "a2", lvl: "mid", title: "Quatre étapes dans le temps",
    intro: "Ajoute deux étapes au voyage : le Jurassique (vers −150 Ma) et le Crétacé (vers −68 Ma). Note dans le tableau les groupes présents dans chaque forêt.",
    widget: { title: "Logiciel · La machine à remonter le temps et mon tableau", w: "temps2", sim: "Scènes reconstituées, tailles non respectées" },
    parts: [
      { t: "task", c: "mod", label: "Visite les quatre époques, remplis le tableau des groupes et vérifie-le.", okMsg: "Tableau juste pour les quatre époques.", done: T_TV2 },
      { t: "rows", c: "rais", label: "D'après les quatre forêts visitées, quand ce groupe apparaît-il ?", choices: ["Déjà là à −305 Ma", "Entre −305 et −150 Ma", "Entre −150 et −68 Ma"], rows: [{ txt: "Plantes à fleurs", a: 2 }, { txt: "Oiseaux", a: 1 }, { txt: "Mammifères", a: 1 }, { txt: "Fougères", a: 0 }] },
      { t: "rows", c: "rais", label: "Quand ce groupe disparaît-il ?", choices: ["Entre −305 et −150 Ma", "Entre −150 et −68 Ma", "Entre −68 Ma et aujourd'hui"], rows: [{ txt: "Prêles et lycophytes géants", a: 0 }, { txt: "Dinosaures non aviens", a: 2 }] },
      { t: "choice", c: "conn", label: "Les espèces actuelles représentent…", o: ["une toute petite partie des espèces qui ont existé", "toutes les espèces qui ont existé", "à peu près la moitié des espèces qui ont existé"], a: 0 }],
    hints: ["Dans le tableau, une colonne s'ouvre quand tu as visité l'époque. Touche « Vérifier mon tableau » pour voir les cases à corriger.", "Un groupe « apparaît » entre deux étapes s'il est absent de la plus ancienne et présent dans la plus récente.", "Plantes à fleurs : entre −150 et −68 Ma · oiseaux et mammifères : entre −305 et −150 Ma · fougères : déjà là · lycophytes géants : entre −305 et −150 Ma · dinosaures : entre −68 Ma et aujourd'hui."],
    corr: "Les fougères, les insectes et les amphibiens sont présents aux quatre époques. Les oiseaux et les mammifères apparaissent entre −305 et −150 Ma, les plantes à fleurs entre −150 et −68 Ma. Les prêles et lycophytes géants disparaissent après le Carbonifère, les dinosaures non aviens après −68 Ma (les oiseaux sont aujourd'hui considérés comme leurs descendants). Les espèces actuelles ne sont qu'une toute petite partie de celles qui ont existé." }] },

{ id: "p2", n: 2, icon: "☄️", tab: "Crise K/T", title: "Une crise biologique : la crise Crétacé-Tertiaire", sub: "TP virtuel à la loupe binoculaire, carotte de roches et grandes crises · environ 35 minutes.",
  items: [
  { id: "b1", lvl: "mid", title: "TP virtuel : des microfossiles de part et d'autre de la limite K/T",
    intro: "Problème : comment la biodiversité des foraminifères a-t-elle varié lors de la crise K/T ?",
    docs: [DOC_KT, DOC_FO, DOC_RG],
    pre: { label: "Hypothèse · D'après le document de répartition, quels groupes t'attends-tu à trouver dans le sable du Danien ?", o: ["Hétérohélicidés et globigérinidés", "Globotruncanidés et hétérohélicidés", "Les trois groupes"], a: 0, yes: "✓ Ton hypothèse est confirmée par l'observation.", nope: "↻ L'observation ne confirme pas ton hypothèse de départ : c'est ainsi que l'on progresse." },
    widget: { title: "TP virtuel · Loupe binoculaire", w: "loupe", sim: "Dessins d'observation simplifiés" },
    parts: [
      { t: "task", c: "mod", label: "Identifie les six microfossiles de chaque sable avec la planche.", okMsg: "Les douze microfossiles sont identifiés.", done: T_LP },
      { t: "rows", c: "lire", label: "Dans quel(s) sable(s) as-tu trouvé ce groupe ?", choices: ["Maastrichtien seulement", "Danien seulement", "Les deux"], rows: [{ txt: "Globotruncanidés", a: 0 }, { txt: "Hétérohélicidés", a: 2 }, { txt: "Globigérinidés", a: 1 }] },
      { t: "choice", c: "rais", label: "J'en déduis :", o: ["Lors de la crise K/T, des groupes disparaissent, d'autres survivent et de nouveaux apparaissent", "Lors de la crise K/T, tous les foraminifères disparaissent", "La crise K/T n'a pas modifié les foraminifères"], a: 0, no: { 1: "Il y a bien des foraminifères dans le sable du Danien.", 2: "Les deux sables ne contiennent pas les mêmes groupes." } }],
    hints: ["Touche un microfossile (ou son numéro), puis choisis son groupe : la planche décrit la forme de chacun.", "Globotruncanidés : disque en spirale · hétérohélicidés : deux rangées en éventail · globigérinidés : boules en spirale.", "Globotruncanidés : Maastrichtien seulement · hétérohélicidés : les deux · globigérinidés : Danien seulement."],
    corr: "Sable du Maastrichtien : globotruncanidés et hétérohélicidés. Sable du Danien : hétérohélicidés et globigérinidés. À la limite K/T, les globotruncanidés disparaissent, les hétérohélicidés survivent (moins nombreux) et les globigérinidés apparaissent juste après : la crise a profondément modifié la biodiversité." },
  { id: "b2", lvl: "hard", title: "Que s'est-il passé il y a 66 millions d'années ?",
    docs: [DOC_IR],
    widget: { title: "Document 2 · Une carotte de roches à travers la limite K/T", w: "kt", sim: "Valeurs simulées" },
    parts: [
      { t: "task", c: "mod", label: "Lance la lecture de la carotte jusqu'à −65 Ma.", okMsg: "Carotte lue jusqu'au bout.", done: T_KT },
      { t: "rows", c: "lire", label: "À la limite K/T (−66 Ma), comment varie chaque mesure ?", choices: ["Pic brutal", "Chute brutale", "Pas de changement"], rows: [{ txt: "Teneur en iridium", a: 0 }, { txt: "Fragments de magnétite", a: 0 }, { txt: "Productivité biologique", a: 1 }, { txt: "Abondance du CaCO₃", a: 1 }] },
      { t: "num", c: "calc", label: "Combien de temps avant l'impact le volcanisme du Deccan commence-t-il ?", unit: "millions d'années", ans: .4, tol: .05, err: [[v => near(v, 400000, 50000), "Réponds en millions d'années : 400 000 ans = 0,4 Ma."]] },
      { t: "choice", c: "rais", label: "Pourquoi le pic d'iridium est-il un indice d'un impact de météorite ?", o: ["L'iridium est rare dans la croûte terrestre mais abondant dans certaines météorites", "L'iridium est fabriqué par le plancton", "L'iridium se forme quand le CaCO₃ disparaît"], a: 0 },
      { t: "choice", c: "rais", label: "Pourquoi l'abondance du CaCO₃ chute-t-elle à la limite ?", o: ["Le plancton à coquille calcaire meurt en masse : la productivité biologique s'effondre", "La météorite apporte du CaCO₃", "Le volcanisme ajoute du CaCO₃ aux roches"], a: 0, no: { 1: "La météorite apporterait plutôt du calcaire en plus : ici, il diminue.", 2: "Le CaCO₃ diminue : il faut chercher ce qui en produit moins." } }],
    hints: ["Lance la lecture : la carotte se dépose couche après couche et les quatre courbes se tracent en même temps.", "Lis la frise des événements : le volcanisme commence vers −66,4 Ma, l'impact a lieu à −66 Ma. Relis aussi « Pour comprendre le document 2 ».", "Iridium et magnétite : pic · productivité et CaCO₃ : chute · 66,4 − 66 = 0,4 Ma · météorites · le plancton meurt."],
    corr: "À la limite K/T, une fine couche d'argile sombre montre un pic d'iridium et de fragments de magnétite : ce sont des indices d'un impact de météorite (Chicxulub, au Mexique). Le volcanisme intense du Deccan avait commencé environ 0,4 Ma avant. Ces événements provoquent l'effondrement de la productivité biologique : le plancton à coquille calcaire meurt en masse, d'où la chute du CaCO₃." },
  { id: "b3", lvl: "mid", title: "Les grandes crises en 540 millions d'années",
    docs: [DOC_CR],
    widget: { title: "Document 3 · Variations de la diversité animale marine", w: "familles", sim: "Valeurs approchées" },
    parts: [
      { t: "task", c: "mod", label: "Trace la courbe jusqu'à aujourd'hui.", okMsg: "Courbe tracée.", done: T_FA },
      { t: "num", c: "lire", label: "Combien de crises majeures (flèches rouges) comptes-tu ?", unit: "crises", ans: 5, tol: 0 },
      { t: "num", c: "lire", label: "Nombre de familles juste avant la crise K/T ?", unit: "familles", ans: 620, tol: 15 },
      { t: "num", c: "calc", label: "Juste après la crise K/T, il en reste 510. Quel pourcentage des familles a disparu ? (arrondi à l'unité)", unit: "%", ans: 18, tol: 1, err: [[v => near(v, 82, 1.5), "82 %, c'est ce qui reste : calcule ce qui a disparu (620 − 510) ÷ 620 × 100."], [v => near(v, 110, 1), "110, c'est le nombre de familles disparues : divise par 620 puis multiplie par 100."]] },
      { t: "choice", c: "rais", label: "Que se passe-t-il après chaque crise ?", o: ["Le nombre de familles augmente de nouveau : de nouveaux groupes se diversifient", "Le nombre de familles reste bas pour toujours", "Les familles disparues réapparaissent"], a: 0, no: { 2: "Une espèce ou une famille disparue ne réapparaît jamais." } }],
    hints: ["Lance le tracé, puis ouvre le tableau de valeurs sous le graphique.", "Pourcentage disparu = (avant − après) ÷ avant × 100.", "5 crises · 620 familles · (620 − 510) ÷ 620 × 100 ≈ 18 % · diversification."],
    corr: "On compte 5 crises majeures en 540 Ma. À la crise K/T, le nombre de familles marines passe d'environ 620 à 510 : (620 − 510) ÷ 620 × 100 ≈ 18 % des familles disparaissent (et environ 76 % des espèces). Après chaque crise, la diversité augmente de nouveau : de nouveaux groupes se diversifient." }] },

{ id: "p3", n: 3, icon: "🧑‍🌾", tab: "L'Homme", title: "L'Homme modifie la biodiversité", sub: "Causes de l'érosion, Amazonie et sélection du maïs · environ 25 minutes.",
  items: [
  { id: "c1", lvl: "mid", title: "L'érosion de la biodiversité",
    docs: [DOC_H],
    widget: { title: "Document 4 · Les causes de l'érosion de la biodiversité et l'Amazonie", w: "erosion", sim: "Valeurs approchées" },
    parts: [
      { t: "task", c: "mod", label: "Lance l'animation de l'Amazonie jusqu'en 2010.", okMsg: "Animation regardée.", done: T_AM },
      { t: "choice", c: "lire", label: "Quelle est la principale cause de menace pour les quatre groupes ?", o: ["La perte et la destruction de l'habitat", "La surexploitation", "La pollution"], a: 0 },
      { t: "rows", c: "lire", label: "Quel groupe est le plus touché par cette cause ?", choices: ["Mammifères", "Oiseaux", "Amphibiens", "Conifères"], rows: [{ txt: "Pollution", a: 2 }, { txt: "Maladies", a: 2 }, { txt: "Espèces invasives", a: 0 }] },
      { t: "num", c: "calc", label: "Convertis : 40 millions d'hectares = … km² (1 ha = 10 000 m² ; 1 km² = 1 000 000 m²)", unit: "km²", ans: 400000, tol: 0, err: [[v => near(v, 4e11, 1e9), "Ça, ce sont des m² : divise par 1 000 000 pour avoir des km²."], [v => near(v, 4000000, 0) || near(v, 40000, 0), "1 km² = 100 ha : 40 000 000 ÷ 100."]] },
      { t: "num", c: "calc", label: "Combien de fois la surface du Luxembourg (2 586 km²) cela représente-t-il ? (arrondi à l'unité)", unit: "fois", ans: 155, tol: 1.5 }],
    hints: ["Lis le graphique cause par cause : la barre la plus longue l'emporte. Lance aussi l'animation de l'Amazonie.", "1 ha = 10 000 m² = 0,01 km², donc 100 ha = 1 km². Puis divise par la surface du Luxembourg.", "Perte de l'habitat · amphibiens, amphibiens, mammifères · 40 000 000 ÷ 100 = 400 000 km² · 400 000 ÷ 2 586 ≈ 155."],
    corr: "La perte et la destruction de l'habitat est la première cause de menace pour les quatre groupes (environ 80 % des espèces menacées de mammifères). Les amphibiens sont les plus touchés par la pollution et les maladies, les mammifères par les espèces invasives. 40 millions d'hectares = 400 000 km², soit environ 155 fois la surface du Luxembourg, détruits en 10 ans." },
  { id: "c2", lvl: "mid", title: "De la téosinte au maïs", recop: true,
    docs: [DOC_M],
    widget: { title: "Simulation · La sélection artificielle", w: "selection", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Réalise au moins six générations de sélection.", okMsg: "Six générations réalisées.", done: T_SL },
      { t: "choice", c: "lire", label: "Comment évolue la longueur moyenne des épis au fil des générations ?", o: ["Elle augmente", "Elle diminue", "Elle reste stable"], a: 0 },
      { t: "choice", c: "conn", label: "Comment appelle-t-on ce choix des plantes à ressemer fait par l'Homme ?", o: ["La sélection artificielle", "La sélection naturelle", "La dérive génétique"], a: 0, no: { 1: "Ici, ce n'est pas le milieu qui « choisit » : c'est l'agriculteur." } },
      { t: "rows", c: "rais", label: "Vrai ou faux ?", choices: ["Vrai", "Faux"], rows: [{ txt: "L'Homme a obtenu de nombreuses variétés de maïs à partir d'une plante sauvage.", a: 0 }, { txt: "Les 1 200 variétés de maïs autorisées en France sont toutes cultivées.", a: 1 }, { txt: "Cultiver seulement quelques variétés réduit la diversité génétique des champs.", a: 0 }] }],
    hints: ["Touche « Récolter, garder les 3 plus gros épis… » six fois, et regarde le graphique.", "C'est l'agriculteur qui choisit les plantes qui se reproduiront. Relis le document sur les variétés de maïs.", "Elle augmente · sélection artificielle · vrai, faux, vrai."],
    corr: "En ressemant à chaque génération les plantes aux plus gros épis, l'agriculteur fait augmenter la longueur moyenne des épis : c'est la sélection artificielle. L'Homme a ainsi obtenu toutes les variétés de maïs à partir de la téosinte. Mais seules quelques variétés sont réellement cultivées, ce qui réduit la diversité génétique." }] }
];

/* ===== VERSION EXIGEANTE ===== */
const EXPERT = {
a1: { parts: [
    { t: "task", c: "mod", label: "Observe la forêt actuelle de Guadeloupe, puis voyage jusqu'au Carbonifère.", okMsg: "Les deux forêts ont été observées.", done: T_TV1 },
    { t: "redac", c: "rais", min: 30, label: "À partir du document 1 et de la machine à remonter le temps, montre que la biodiversité évolue au cours du temps. Rédige : je vois → je sais → j'en déduis.",
      crit: [{ g: "vois", lab: "Des êtres vivants de la forêt actuelle (arbres à fleurs, oiseaux, mammifère…)", re: [/(fromager|mangle|paletuvier|colibri|sucrier|raton|crabe|madere|a fleurs|oiseau|mammifere)/] },
        { g: "vois", lab: "Des êtres vivants de la forêt du Carbonifère", re: [/(lepidodendron|calamite|prele|lycophyte|meganeura|libellule|arthropleura|amphibien)/] },
        { g: "vois", lab: "Un point commun : les fougères", re: [/fougere/] },
        { g: "deduis", lab: "Les espèces ne sont pas les mêmes", re: [/(differen|pas les memes|ont change|ont disparu|n'existai|absent|nouvelles? especes|apparu|n'y a pas|n'y avait pas)/] },
        { g: "deduis", lab: "Conclusion : la biodiversité évolue au cours du temps", re: [/biodiversite/, /(evolu|change|varie|modifi)/] }],
      model: "Je vois qu'aujourd'hui, la forêt marécageuse de Guadeloupe abrite des fougères, des arbres à fleurs comme le fromager et le mangle médaille, des oiseaux comme le colibri et un mammifère, le raton laveur. Je vois qu'au Carbonifère, il y a 305 Ma, la forêt marécageuse abritait aussi des fougères, mais des lépidodendrons, des prêles géantes, une libellule géante et des amphibiens primitifs, et aucun arbre à fleurs, oiseau ou mammifère. Les espèces ne sont pas les mêmes. J'en déduis que la biodiversité évolue au cours du temps." }],
  hints: ["Visite les deux époques et relis le carnet de terrain de chacune.", "Cite des êtres vivants précis pour chaque époque, puis ce qu'ils ont en commun et ce qui les distingue.", "Aujourd'hui : arbres à fleurs, oiseaux, mammifère · Carbonifère : lycophytes et prêles géants, libellule géante · en commun : fougères · espèces différentes → la biodiversité évolue."],
  corr: "Les deux forêts marécageuses n'abritent pas les mêmes espèces : seules les fougères sont communes. Au Carbonifère, il n'y a ni plantes à fleurs, ni oiseaux, ni mammifères, mais des lycophytes et des prêles géants. La biodiversité évolue au cours du temps." },
a2: { parts: [
    { t: "task", c: "mod", label: "Visite les quatre époques, remplis le tableau des groupes et vérifie-le.", okMsg: "Tableau juste pour les quatre époques.", done: T_TV2 },
    { t: "num", c: "lire", label: "Combien des neuf groupes du tableau sont présents dans les quatre forêts ?", unit: "groupes", ans: 3, tol: 0 },
    { t: "word", c: "lire", label: "Quel groupe apparaît entre −150 et −68 Ma ?", ans: ["plantes à fleurs", "plante à fleurs", "les plantes à fleurs", "angiospermes", "plantes a fleurs"] },
    { t: "rows", c: "rais", label: "Quand ce groupe disparaît-il ?", choices: ["Entre −305 et −150 Ma", "Entre −150 et −68 Ma", "Entre −68 Ma et aujourd'hui"], rows: [{ txt: "Prêles et lycophytes géants", a: 0 }, { txt: "Dinosaures non aviens", a: 2 }] }],
  hints: ["Vérifie d'abord ton tableau : il doit être juste.", "Cherche les lignes cochées dans les quatre colonnes, puis la ligne qui s'allume seulement à partir du Crétacé.", "3 groupes (fougères, insectes, amphibiens) · plantes à fleurs · entre −305 et −150 Ma · entre −68 Ma et aujourd'hui."],
  corr: "Trois groupes sont présents aux quatre époques : fougères, insectes, amphibiens. Les plantes à fleurs apparaissent entre −150 et −68 Ma. Les prêles et lycophytes géants disparaissent après le Carbonifère, les dinosaures non aviens après −68 Ma." },
b1: { parts: [
    { t: "task", c: "mod", label: "Identifie les six microfossiles de chaque sable avec la planche.", okMsg: "Les douze microfossiles sont identifiés.", done: T_LP },
    { t: "redac", c: "rais", min: 30, label: "Compare les deux sables et conclus : comment la crise K/T a-t-elle modifié la biodiversité des foraminifères ?",
      crit: [{ g: "vois", lab: "Les globotruncanidés : seulement au Maastrichtien", re: [/globotruncan/] },
        { g: "vois", lab: "Les globigérinidés : seulement au Danien", re: [/globigerin/] },
        { g: "vois", lab: "Les hétérohélicidés : dans les deux sables", re: [/heterohelic/] },
        { g: "deduis", lab: "Des groupes disparaissent", re: [/(dispar|eteint|extinction)/] },
        { g: "deduis", lab: "De nouveaux groupes apparaissent", re: [/(appar|nouveau|nouvelle|diversifi)/] }],
      model: "Je vois que le sable du Maastrichtien contient des globotruncanidés et des hétérohélicidés, et que celui du Danien contient des hétérohélicidés et des globigérinidés. Les globotruncanidés ne sont présents qu'avant la limite K/T, les globigérinidés seulement après, et les hétérohélicidés de part et d'autre. J'en déduis que lors de la crise K/T, certains groupes disparaissent, d'autres survivent et de nouveaux groupes apparaissent : la biodiversité a été profondément modifiée." }],
  hints: ["Identifie d'abord les douze microfossiles.", "Pour chaque groupe : dans quel(s) sable(s) ? Puis : qui disparaît, qui survit, qui apparaît ?", "Globotruncanidés : Maastrichtien seulement (disparition) · hétérohélicidés : les deux (survie) · globigérinidés : Danien seulement (apparition)."],
  corr: "Globotruncanidés au Maastrichtien seulement (ils disparaissent à la limite K/T), hétérohélicidés dans les deux sables (ils survivent), globigérinidés au Danien seulement (ils apparaissent). La crise K/T modifie la biodiversité : disparitions, survies et apparitions." },
b2: { parts: [
    { t: "task", c: "mod", label: "Lance la lecture de la carotte jusqu'à −65 Ma.", okMsg: "Carotte lue jusqu'au bout.", done: T_KT },
    { t: "num", c: "lire", label: "Par combien la teneur en iridium est-elle multipliée entre −67 Ma et la limite K/T ? (arrondi à l'unité)", unit: "fois", ans: 30, tol: 1.5, err: [[v => near(v, 8.7, .3), "C'est l'augmentation (9 − 0,3) : « multipliée par » se calcule 9 ÷ 0,3."]] },
    { t: "num", c: "calc", label: "Combien de temps avant l'impact le volcanisme du Deccan commence-t-il ?", unit: "millions d'années", ans: .4, tol: .05, err: [[v => near(v, 400000, 50000), "Réponds en millions d'années : 400 000 ans = 0,4 Ma."]] },
    { t: "redac", c: "rais", min: 40, label: "Présente les facteurs à l'origine de la crise Crétacé-Tertiaire en t'appuyant sur les données de la carotte.",
      crit: [{ g: "vois", lab: "Le pic d'iridium à la limite", re: [/iridium/, /(pic|augment|hausse|abond|fort|multipli|eleve)/] },
        { g: "vois", lab: "Les fragments de magnétite", re: [/magnetite/] },
        { g: "sais", lab: "Un impact de météorite (Chicxulub)", re: [/(meteorite|asteroide|chicxulub)/] },
        { g: "sais", lab: "Un volcanisme intense (Deccan)", re: [/(volcan|deccan)/] },
        { g: "deduis", lab: "L'effondrement de la productivité et du CaCO₃ (le plancton meurt)", re: [/(productivite|caco3|caco₃|plancton|calcaire)/, /(chute|diminu|baiss|effondr|meurt|disparai)/] }],
      model: "Je vois qu'à la limite K/T, à −66 Ma, la teneur en iridium passe brutalement d'environ 0,3 à 9 ng/g et que les fragments de magnétite sont très abondants. Je sais que l'iridium est rare dans la croûte terrestre mais abondant dans certaines météorites : c'est l'indice d'un impact de météorite, celui de Chicxulub au Mexique. Je vois aussi que le volcanisme intense du Deccan commence environ 0,4 Ma avant l'impact. J'en déduis que ces deux événements ont provoqué l'effondrement de la productivité biologique : le plancton à coquille calcaire meurt en masse, d'où la chute du CaCO₃, et de nombreuses espèces disparaissent." }],
  hints: ["Lis la carotte jusqu'au bout et ouvre le tableau de valeurs.", "Iridium : 0,3 ng/g avant, 9 ng/g à la limite. Relis « Pour comprendre le document 2 ».", "9 ÷ 0,3 = 30 · 0,4 Ma · impact (iridium, magnétite) + volcanisme du Deccan → la productivité et le CaCO₃ s'effondrent."],
  corr: "L'iridium est multiplié par environ 30 à la limite K/T, avec des fragments de magnétite : indices de l'impact de la météorite de Chicxulub. Le volcanisme du Deccan a commencé environ 0,4 Ma avant. Ces deux facteurs provoquent l'effondrement de la productivité biologique (chute du CaCO₃) et une extinction de masse." },
b3: { parts: [
    { t: "task", c: "mod", label: "Trace la courbe jusqu'à aujourd'hui.", okMsg: "Courbe tracée.", done: T_FA },
    { t: "num", c: "lire", label: "Quelle crise fait disparaître la plus grande part des familles ? Donne sa date (en Ma, sans le signe −).", unit: "Ma", ans: 252, tol: 3 },
    { t: "num", c: "calc", label: "Quel pourcentage des familles disparaît lors de la crise K/T (620 → 510) ? (arrondi à l'unité)", unit: "%", ans: 18, tol: 1, err: [[v => near(v, 82, 1.5), "82 %, c'est ce qui reste."]] },
    { t: "choice", c: "rais", label: "Lors de la crise K/T, environ 76 % des espèces marines disparaissent, mais seulement 18 % des familles. Pourquoi ?", o: ["Une famille survit dès qu'au moins une de ses espèces survit", "Les familles sont plus résistantes que les espèces", "Le graphique compte mal les familles"], a: 0 },
    { t: "choice", c: "rais", label: "Que se passe-t-il après chaque crise ?", o: ["Le nombre de familles augmente de nouveau : de nouveaux groupes se diversifient", "Le nombre de familles reste bas pour toujours", "Les familles disparues réapparaissent"], a: 0 }],
  hints: ["Ouvre le tableau « avant / après » de chaque crise et compare les chutes.", "Une famille regroupe plusieurs espèces proches.", "Permien-Trias (−252 Ma : 395 → 190) · ≈ 18 % · une famille survit si une de ses espèces survit · diversification."],
  corr: "La crise Permien-Trias (−252 Ma) est la plus forte : environ 395 → 190 familles, plus de la moitié. À la crise K/T, ≈ 18 % des familles disparaissent mais 76 % des espèces : une famille survit dès qu'une seule de ses espèces survit. Après chaque crise, de nouveaux groupes se diversifient." },
c1: { parts: [
    { t: "task", c: "mod", label: "Lance l'animation de l'Amazonie jusqu'en 2010.", okMsg: "Animation regardée.", done: T_AM },
    { t: "word", c: "lire", label: "Quelle est la principale cause de menace pour les quatre groupes ?", ans: ["destruction de l'habitat", "perte de l'habitat", "la destruction de l'habitat", "perte et destruction de l'habitat", "destruction des habitats", "perte d'habitat", "la perte de l'habitat", "deforestation"] },
    { t: "num", c: "calc", label: "40 millions d'hectares = … km²", unit: "km²", ans: 400000, tol: 0, err: [[v => near(v, 4e11, 1e9), "Ça, ce sont des m²."]] },
    { t: "num", c: "calc", label: "Surface moyenne détruite chaque année entre 2000 et 2010 ?", unit: "km² par an", ans: 40000, tol: 0 },
    { t: "num", c: "calc", label: "Combien de Luxembourg (2 586 km²) sont détruits chaque année ? (arrondi à l'unité)", unit: "par an", ans: 15.5, tol: 1 }],
  hints: ["Compare les barres cause par cause. Lance l'animation de l'Amazonie.", "100 ha = 1 km². La période 2000-2010 dure 10 ans.", "Perte de l'habitat · 400 000 km² · 40 000 km² par an · 40 000 ÷ 2 586 ≈ 15 à 16 Luxembourg par an."],
  corr: "Première cause : la perte et la destruction de l'habitat. 40 millions d'ha = 400 000 km² en 10 ans, soit 40 000 km² par an : environ 15 à 16 fois la surface du Luxembourg chaque année." },
c2: { parts: [
    { t: "task", c: "mod", label: "Réalise au moins six générations de sélection.", okMsg: "Six générations réalisées.", done: T_SL },
    { t: "redac", c: "rais", min: 40, label: "Montre comment l'Homme peut agir sur la biodiversité, en t'appuyant sur les documents de la partie 3 (érosion, Amazonie, maïs).",
      crit: [{ g: "vois", lab: "La destruction des habitats, première cause (environ 80 %)", re: [/(habitat|destruction|deforest)/, /\d/] },
        { g: "sais", lab: "D'autres causes : surexploitation, pollution, espèces invasives, maladies", re: [/(surexploit|chasse|peche|pollution|invasi|maladie)/] },
        { g: "vois", lab: "L'exemple de l'Amazonie (40 millions d'ha en 10 ans)", re: [/(amazon|40 millions|luxembourg)/] },
        { g: "sais", lab: "La sélection artificielle : de la téosinte au maïs", re: [/selection/, /(teosinte|mais|variete)/] },
        { g: "deduis", lab: "Cultiver peu de variétés réduit la diversité génétique", re: [/(peu de variete|quelques varietes|reduit|diminu|perte|appauvri)/, /(genetique|diversite)/] }],
      model: "L'Homme fait diminuer la biodiversité : la perte et la destruction des habitats est la première cause de menace, pour environ 80 % des espèces menacées de mammifères, d'oiseaux et d'amphibiens. Par exemple, en Amazonie, 40 millions d'hectares de forêt ont disparu entre 2000 et 2010, environ 155 fois la surface du Luxembourg. La surexploitation, la pollution, les espèces invasives et les maladies menacent aussi de nombreuses espèces. L'Homme modifie aussi la biodiversité par la sélection artificielle : à partir de la téosinte, il a obtenu de nombreuses variétés de maïs. Mais comme seules quelques variétés sont cultivées, la diversité génétique des champs diminue." }],
  hints: ["Réalise la simulation, puis relis les documents de la partie 3.", "Deux façons d'agir : faire disparaître des espèces (causes de l'érosion) et en modifier par la sélection.", "Destruction des habitats (≈ 80 %) · surexploitation, pollution, invasives, maladies · Amazonie : 40 millions d'ha · téosinte → maïs · peu de variétés cultivées → moins de diversité génétique."],
  corr: "L'Homme réduit la biodiversité (destruction des habitats, première cause ; surexploitation, pollution, espèces invasives, maladies ; Amazonie : 40 millions d'ha détruits en 10 ans). Il la modifie aussi par la sélection artificielle (téosinte → maïs), mais la culture de quelques variétés seulement réduit la diversité génétique." }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `Le problème : ${PROBLEM}\n${HOME.goal}\n\nBilan à recopier\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
