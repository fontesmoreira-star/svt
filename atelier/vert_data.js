/* ===== 2nde SVT · Thème 1 · Chapitre 3 · Activité 3 « L'organisation des vertébrés » : contenus =====
   D'après la fiche du professeur (Th1 Ch3 Act3 2026) et sa trace écrite. Les photographies sont remplacées par des dessins
   et une radiographie virtuelle ; le logiciel Phylogène par un logiciel de classification simplifié (membres antérieurs). */
const PROBLEM = "Que nous apprend l'organisation du corps des vertébrés sur leur parenté ?";
const tk2 = ok => ok ? "✓" : "○";
const taskMsg = (ok, msg) => ({ ok, msg });
const nP = a => POLES[a].filter(([k], i) => (((xst().ax || {}).p || {})[a] || {})[i] === k).length;
const fA = a => !!((((xst().ax || {}).f || {})[a]) || {}).A;
const T_AX = () => taskMsg(nP("c") + nP("g") === 8 && fA("c") && fA("g"), `${tk2(nP("c") === 4)} carpe : ${nP("c")}/4 pôles · ${tk2(fA("c"))} plan de symétrie · ${tk2(nP("g") === 4)} grenouille : ${nP("g")}/4 pôles · ${tk2(fA("g"))} plan de symétrie`);
const T_RX = () => { const r = xst().rx || {}, v = ["c", "g", "r"].filter(k => (r.v || {})[k]).length, z = ["c", "g"].filter(k => (r.ok || {})[k]).length; return taskMsg(v === 3 && z === 2, `${tk2(v === 3)} ${v}/3 radiographies · ${tk2(z === 2)} trois parties délimitées : ${z}/2 animaux`); };
const nS = a => SQP[a].filter(([k], i) => ((((xst().sq || {}).a || {})[a]) || {})[i] === k).length;
const T_SQ = () => { const ax = ["c", "g"].filter(a => ((xst().sq || {}).ax || {})[a]).length; return taskMsg(nS("c") + nS("g") === 8 && ax === 2, `${tk2(nS("c") === 4)} carpe : ${nS("c")}/4 · ${tk2(nS("g") === 4)} grenouille : ${nS("g")}/4 · ${tk2(ax === 2)} axes affichés : ${ax}/2`); };
const nPh = k => Object.keys(CAT).filter(c => ((((xst().ph || {}).a || {})[k]) || {})[c]).length;
const T_PH = () => taskMsg(SPK.every(k => nPh(k) === 4), SPK.map(k => `${tk2(nPh(k) === 4)} ${SPC[k].n} ${nPh(k)}/4`).join(" · "));
const T_AL = () => { const a = xst().al || {}; return taskMsg(!!(a.done && a.pap), `${tk2(a.done)} membres alignés · ${tk2(a.pap)} aile du papillon comparée`); };

const HOME = { slug: "organisation-vertebres", short: "L'organisation des vertébrés", last: "b2", lastG: "p2", lastK: 1, dur: "environ 1 h",
  kicker: "Thème 1 · Chapitre 3 · Biodiversité actuelle et passée · Activité 3", title: "Décrire et comparer l'organisation des vertébrés",
  intro: "Des pôles à nommer, un animal à plier, une radiographie et un logiciel de classification : décris l'organisation externe et squelettique de la carpe et de la grenouille, puis compare les membres antérieurs de quatre vertébrés.",
  lab: "Le problème", goal: "Objectifs : exploiter un logiciel ; comparer l'organisation externe et squelettique de vertébrés ; comprendre la parenté entre les vertébrés.",
  fact: "La chauve-souris est le seul mammifère capable de vraiment voler : son aile est une main dont les doigts, très allongés, tendent une fine membrane de peau.",
  parts: "Les deux parties de l'activité", recop: "Bilan à recopier dans le cahier",
  txt: "ACTIVITÉ 3 · L'ORGANISATION DES VERTÉBRÉS\n2nde SVT · Thème 1 · Chapitre 3 : biodiversité actuelle et passée",
  comps: { conn: "Restituer ses connaissances", lire: "Extraire des informations (dessins, radiographies, logiciel)", calc: "Calculer (échelles)", rais: "Raisonner, mettre en relation", mod: "Exploiter un logiciel, réaliser un TP virtuel" },
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "Je manipule, je choisis et je complète, pas à pas." },
    l: { icon: "🎓", short: "Exigeante", name: "Version exigeante", q: "exigeante", desc: "Les mêmes manipulations, moins d'aide : je rédige avec « je vois → je sais → j'en déduis »." } },
  extraTitle: "Mes observations",
  extra: () => {
    const x = xst(), r = x.rx || {}, a = x.al || {};
    return `MES OBSERVATIONS\n- Axes et plan de symétrie : carpe ${nP("c")}/4 pôles${fA("c") ? ", plan trouvé" : ""} ; grenouille ${nP("g")}/4 pôles${fA("g") ? ", plan trouvé" : ""} ; ${(x.ax || {}).e || 0} erreur(s) au premier choix\n- Radiographies : ${["c", "g", "r"].filter(k => (r.v || {})[k]).map(k => RXA[k].n.toLowerCase() + " (contraste " + RXA[k].ct + " %)").join(", ") || "aucune"} ; trois parties délimitées : ${["c", "g"].filter(k => (r.ok || {})[k]).length}/2\n- Squelette : carpe ${nS("c")}/4, grenouille ${nS("g")}/4 structures identifiées\n- Logiciel de classification : ${SPK.map(k => SPC[k].n + " " + nPh(k) + "/4").join(", ")} ; ${(x.ph || {}).e || 0} erreur(s) ; membres ${a.done ? "alignés" : "non alignés"}\n`;
  },
  extraHTML: () => {
    const x = xst(), r = x.rx || {}, a = x.al || {};
    return tbl(["Manipulation", "Résultat"], [["Axes et plan de symétrie", `Carpe ${nP("c")}/4 pôles${fA("c") ? " · plan ✓" : ""} · grenouille ${nP("g")}/4 pôles${fA("g") ? " · plan ✓" : ""}`],
      ["Radiographies (contraste du squelette)", ["c", "g", "r"].filter(k => (r.v || {})[k]).map(k => RXA[k].n + " " + RXA[k].ct + " %").join(" · ") || "—"],
      ["Tête, tronc, queue", `${["c", "g"].filter(k => (r.ok || {})[k]).length}/2 animaux`], ["Squelette et axes", `Carpe ${nS("c")}/4 · grenouille ${nS("g")}/4`],
      ["Membres antérieurs (logiciel)", SPK.map(k => `${SPC[k].n} ${nPh(k)}/4`).join(" · ") + (a.done ? " · alignés ✓" : "")]]);
  } };

/* ---------- documents ---------- */
const DOC_DEF = { title: "Définitions", html: `<ul class="ul"><li><b>Axe de polarité</b> : droite virtuelle reliant deux pôles opposés du corps d'un animal.</li><li><b>Plan de symétrie bilatérale</b> : plan virtuel séparant le corps en une partie droite et une partie gauche, toutes deux semblables.</li></ul>` };
const DOC_RX = { title: "Pour comprendre la radiographie", html: `<ul class="ul"><li>Les <b>rayons X</b> traversent facilement les tissus mous (peau, muscles), mais sont arrêtés par les tissus riches en minéraux, comme l'<b>os</b> (riche en phosphate de calcium) : sur la radiographie, l'os apparaît <b>blanc et très contrasté</b>.</li><li>Le <b>cartilage</b>, souple et peu minéralisé, laisse passer davantage les rayons X : il apparaît beaucoup moins contrasté.</li><li>La <b>roussette</b> est un petit requin des côtes européennes. Son squelette est entièrement <b>cartilagineux</b> : elle sert de point de comparaison.</li></ul>` };
const DOC_PH = { title: "Le logiciel de classification", html: `<p>Comme le logiciel <b>Phylogène</b>, ce logiciel donne accès aux données anatomiques d'espèces de la collection « vertébrés lycée ». Rubrique <b>Comparer</b>, données anatomiques <b>organe locomoteur</b> : on compare le <b>membre antérieur</b> de quatre vertébrés, la <b>mésange</b> (un oiseau), l'<b>oreillard</b> (une chauve-souris), la <b>tortue</b> et la <b>grenouille</b>.</p><p>Chaque os ou ensemble d'os est numéroté : colorie-le avec la bonne couleur.</p>` };

/* ---------- bilan (trace écrite du professeur) ---------- */
const BIL = ["La carpe et la grenouille possèdent <u>deux axes de polarité</u> : un axe <u>antéro-postérieur</u> (de la tête, à l'avant, à la queue, à l'arrière) et un axe <u>dorso-ventral</u> (du dos au ventre). Un <u>plan de symétrie bilatérale</u> délimite une droite et une gauche semblables.",
  "Leur <u>squelette est osseux</u>. Il se divise en trois parties : <u>la tête, le tronc et la queue</u> (réduite à l'urostyle chez la grenouille).",
  "Le <u>crâne est antérieur</u>, la <u>colonne vertébrale est dorsale</u>, le long de l'axe antéro-postérieur, et elles possèdent <u>quatre membres en position ventrale</u>, deux antérieurs et deux postérieurs, de part et d'autre du plan de symétrie. Cette organisation est comparable chez l'ensemble des vertébrés.",
  "Les membres antérieurs de la mésange, de l'oreillard, de la tortue et de la grenouille ont des formes et des fonctions différentes, mais la <u>même organisation</u> : une <u>ceinture scapulaire</u> qui articule le membre, puis un os (l'humérus), deux os (le radius et le cubitus) et les nombreux os de la main.",
  "L'existence de cette <u>organisation commune</u> suggère une <u>parenté</u> : ces vertébrés ont hérité cette organisation d'un <u>ancêtre commun</u>."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("");

/* ---------- échauffement ---------- */
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement : le vocabulaire pour s'orienter dans un corps",
  intro: "Avant de décrire la carpe et la grenouille, mets-toi d'accord sur les mots qui servent à s'orienter dans le corps d'un animal.",
  docs: [DOC_DEF],
  parts: [
    { t: "rows", c: "conn", label: "Associe chaque mot à sa signification.", choices: ["Côté de la tête", "Côté de la queue", "Côté du dos", "Côté du ventre"], rows: [{ txt: "Dorsal", a: 2 }, { txt: "Antérieur", a: 0 }, { txt: "Ventral", a: 3 }, { txt: "Postérieur", a: 1 }] },
    { t: "choice", c: "conn", label: "Un axe de polarité est…", o: ["une droite virtuelle qui relie deux pôles opposés du corps", "un os qui traverse le corps de part en part", "la ligne qui sépare deux espèces sur un arbre"], a: 0 },
    { t: "choice", c: "rais", label: "Lequel possède un seul plan de symétrie, qui sépare une droite et une gauche semblables ?", o: ["Un papillon", "Une coquille d'escargot", "Une étoile de mer à cinq bras"], a: 0, no: { 1: "La coquille s'enroule en spirale : aucun plan ne la coupe en deux moitiés semblables.", 2: "L'étoile de mer a cinq bras disposés autour d'un centre : elle a plusieurs plans de symétrie, et pas une droite et une gauche." } }],
  hints: ["Relis les définitions : un axe relie deux pôles, un plan sépare deux moitiés.", "Antérieur = avant, postérieur = arrière. Pense à un papillon vu de dessus : ses deux ailes droites et ses deux ailes gauches se ressemblent.", "Dorsal : dos · antérieur : tête · ventral : ventre · postérieur : queue · droite virtuelle · le papillon."],
  corr: "Antérieur : côté de la tête ; postérieur : côté de la queue ; dorsal : côté du dos ; ventral : côté du ventre. Un axe de polarité est une droite virtuelle qui relie deux pôles opposés du corps. Le papillon possède un plan de symétrie bilatérale : il sépare une moitié droite et une moitié gauche semblables." };

/* ---------- les deux parties ---------- */
const GROUPS = [
{ id: "p1", n: 1, icon: "🐟", tab: "Carpe et grenouille", title: "Décrire l'organisation de la carpe et de la grenouille", sub: "Axes, plan de symétrie, radiographie et squelette · environ 35 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "Deux axes et un plan",
    intro: "Question 1 de la fiche : à partir des définitions, décris l'organisation de la carpe et de la grenouille.",
    docs: [DOC_DEF],
    widget: { title: "TP virtuel · Les axes de polarité et le plan de symétrie", w: "axes", sim: "Dessins simplifiés" },
    parts: [
      { t: "task", c: "mod", label: "Pour chaque animal, nomme les quatre pôles (vue de côté), puis trouve son plan de symétrie en le pliant (vue de dessus).", okMsg: "Pôles nommés et plans trouvés pour les deux animaux.", done: T_AX },
      { t: "rows", c: "lire", label: "Que relie chaque axe de polarité ?", choices: ["La tête et la queue", "Le dos et le ventre", "Le côté droit et le côté gauche"], rows: [{ txt: "Axe antéro-postérieur", a: 0 }, { txt: "Axe dorso-ventral", a: 1 }] },
      { t: "choice", c: "lire", label: "Le plan de symétrie bilatérale (ligne A, vue de dessus) sépare…", o: ["un côté droit et un côté gauche semblables", "l'avant et l'arrière du corps", "le dos et le ventre"], a: 0 },
      { t: "choice", c: "rais", label: "La ligne B, en travers du corps, est-elle un plan de symétrie ?", o: ["Non : l'avant (la tête) ne se superpose pas à l'arrière (la queue)", "Oui : les deux moitiés ont la même taille", "Oui, mais seulement chez la grenouille"], a: 0, no: { 1: "Deux moitiés de même taille ne suffisent pas : elles doivent se superposer." } },
      { t: "rows", c: "rais", label: "Chez quel(s) animal(aux) observe-t-on…", choices: ["Les deux", "Carpe seulement", "Grenouille seulement"], rows: [{ txt: "un axe antéro-postérieur et un axe dorso-ventral", a: 0 }, { txt: "un plan de symétrie bilatérale", a: 0 }, { txt: "la tête au pôle antérieur", a: 0 }] }],
    hints: ["Vue de côté : touche un repère numéroté, puis choisis le nom du pôle. Quand les deux pôles d'un axe sont justes, l'axe se trace.", "Vue de dessus : plie l'animal selon la ligne A, puis selon la ligne B, et regarde si les deux moitiés se superposent.", "Tête et queue · dos et ventre · droite et gauche · non, la tête ne se superpose pas à la queue · les deux, les deux, les deux."],
    corr: "La carpe et la grenouille possèdent deux axes de polarité : l'axe antéro-postérieur relie la tête (pôle antérieur) à la queue (pôle postérieur), l'axe dorso-ventral relie le dos au ventre. Un plan de symétrie bilatérale (ligne A) sépare un côté droit et un côté gauche semblables. La ligne B n'est pas un plan de symétrie : la tête ne se superpose pas à la queue. Ces caractéristiques sont communes aux deux animaux." },
  { id: "a2", lvl: "mid", title: "Une radiographie : trois parties et un squelette",
    intro: "Questions 2 et 3 de la fiche : combien de parties possède le corps de ces vertébrés ? Leur squelette est-il osseux ou cartilagineux ?",
    docs: [DOC_RX],
    widget: { title: "TP virtuel · Radiographie", w: "radio", sim: "Radiographies dessinées, contrastes simulés" },
    parts: [
      { t: "task", c: "mod", label: "Radiographie les trois animaux, puis délimite les trois parties du corps de la carpe et de la grenouille.", okMsg: "Radiographies faites et parties délimitées.", done: T_RX },
      { t: "num", c: "lire", label: "Combien de parties as-tu délimitées dans le corps de chacun de ces deux vertébrés ?", unit: "parties", ans: 3, tol: 0 },
      { t: "rows", c: "lire", label: "Dans quelle partie du corps se trouve…", choices: ["Tête", "Tronc", "Queue"], rows: [{ txt: "le crâne", a: 0 }, { txt: "les côtes de la carpe", a: 1 }, { txt: "l'urostyle de la grenouille", a: 2 }, { txt: "l'attache des membres antérieurs", a: 1 }] },
      { t: "choice", c: "lire", label: "Sur la radiographie, comment apparaît le squelette de la carpe et de la grenouille, comparé à celui de la roussette ?", o: ["Beaucoup plus contrasté (blanc)", "Aussi peu contrasté", "Invisible"], a: 0 },
      { t: "choice", c: "rais", label: "J'en déduis que le squelette de la carpe et de la grenouille est…", o: ["osseux", "cartilagineux", "absent : ce sont des invertébrés"], a: 0, no: { 1: "Le cartilage laisse passer les rayons X : il est peu contrasté, comme chez la roussette." } }],
    hints: ["Lance la radiographie de chaque animal, puis déplace les deux limites et touche « Vérifier mes limites ».", "La tête s'arrête derrière le crâne ; le tronc contient les côtes ; chez la grenouille, la queue est cachée entre les os du bassin. Relis « Pour comprendre la radiographie ».", "3 parties · tête, tronc, queue, tronc · beaucoup plus contrasté · osseux."],
    corr: "Le corps de la carpe et celui de la grenouille possèdent trois parties : la tête (le crâne), le tronc (avec les côtes chez la carpe et l'attache des membres) et la queue (réduite à un os, l'urostyle, chez la grenouille). Sur la radiographie, leur squelette apparaît blanc et très contrasté (environ 85 à 90 %), beaucoup plus que celui de la roussette (environ 20 %) : il est riche en minéraux, c'est un squelette osseux." },
  { id: "a3", lvl: "mid", title: "Le crâne, la colonne vertébrale et les membres",
    intro: "Questions 4 et 5 de la fiche : comment sont disposés le crâne, la colonne vertébrale et les membres par rapport aux axes de polarité ? Que suggère cette organisation commune ?",
    widget: { title: "Planche anatomique · Squelettes de la carpe et de la grenouille", w: "squel", sim: "Schémas simplifiés" },
    parts: [
      { t: "task", c: "mod", label: "Identifie les quatre structures numérotées de chaque squelette, puis affiche les axes pour les deux animaux.", okMsg: "Structures identifiées et axes affichés.", done: T_SQ },
      { t: "rows", c: "lire", label: "Par rapport aux axes et au plan de symétrie, où se trouve…", choices: ["À l'avant, au pôle antérieur", "Côté dorsal, le long de l'axe antéro-postérieur", "Côté ventral, de part et d'autre du plan de symétrie"], rows: [{ txt: "le crâne", a: 0 }, { txt: "la colonne vertébrale", a: 1 }, { txt: "les membres", a: 2 }] },
      { t: "num", c: "lire", label: "Combien de membres possèdent la carpe et la grenouille ? (nageoires paires ou pattes)", unit: "membres", ans: 4, tol: 0, err: [[v => near(v, 2, 0), "Compte aussi les membres de l'autre côté du plan de symétrie : ils vont par paires."]] },
      { t: "choice", c: "lire", label: "Ces membres sont…", o: ["deux antérieurs et deux postérieurs", "quatre antérieurs", "deux à droite seulement"], a: 0 },
      { t: "choice", c: "rais", label: "Cette organisation commune à la carpe et à la grenouille suggère…", o: ["une parenté : elles ont hérité cette organisation d'un ancêtre commun", "qu'elles vivent dans le même milieu", "qu'elles se nourrissent de la même façon"], a: 0, no: { 1: "Leur milieu de vie diffère : l'eau pour la carpe, l'eau et la terre pour la grenouille adulte.", 2: "L'organisation du squelette ne renseigne pas sur l'alimentation." } }],
    hints: ["Touche un numéro, puis choisis le nom de la structure. Affiche les axes : la flèche rouge va de l'avant vers l'arrière.", "La carpe est vue de côté (dos en haut, ventre en bas) ; la grenouille est vue de dessus (le plan de symétrie apparaît comme une ligne).", "Crâne : à l'avant · colonne : dorsale, le long de l'axe antéro-postérieur · membres : ventraux, de part et d'autre du plan · 4 membres, 2 antérieurs et 2 postérieurs · une parenté."],
    corr: "Chez la carpe comme chez la grenouille, le crâne est antérieur, la colonne vertébrale est dorsale et suit l'axe antéro-postérieur, et les quatre membres (nageoires paires ou pattes) sont ventraux : deux antérieurs et deux postérieurs, disposés de part et d'autre du plan de symétrie. Cette organisation commune suggère une parenté : ces deux vertébrés l'ont héritée d'un ancêtre commun." }] },

{ id: "p2", n: 2, icon: "🦇", tab: "Phylogène", title: "Comparer les membres antérieurs de quatre vertébrés", sub: "Logiciel de classification (inspiré de Phylogène) · environ 25 minutes.",
  items: [
  { id: "b1", lvl: "mid", title: "Quatre membres antérieurs, quatre fonctions",
    intro: "Question 6 de la fiche : compare l'organisation des membres antérieurs de la mésange, de l'oreillard, de la tortue et de la grenouille.",
    docs: [DOC_PH],
    pre: { label: "Hypothèse · L'aile de la mésange, l'aile de l'oreillard, la patte de la tortue et celle de la grenouille sont-elles construites avec les mêmes os ?", o: ["Oui, avec les mêmes os", "Non, avec des os différents"], a: 0, yes: "✓ Ton hypothèse est confirmée par l'observation.", nope: "↻ L'observation ne confirme pas ton hypothèse de départ : c'est ainsi que l'on progresse." },
    widget: { title: "Logiciel · Comparer les membres antérieurs", w: "phylo", sim: "Schémas simplifiés, d'après les données de Phylogène" },
    parts: [
      { t: "task", c: "mod", label: "Colorie les quatre os ou ensembles d'os de chaque membre antérieur.", okMsg: "Les quatre membres sont coloriés.", done: T_PH },
      { t: "rows", c: "lire", label: "À quoi sert le membre antérieur de…", choices: ["Voler", "Marcher", "Nager"], rows: [{ txt: "la mésange", a: 0 }, { txt: "l'oreillard", a: 0 }, { txt: "la tortue terrestre", a: 1 }] },
      { t: "num", c: "lire", label: "Combien d'os forment le bras (de l'épaule au coude) chez chacun des quatre vertébrés ?", unit: "os", ans: 1, tol: 0 },
      { t: "num", c: "lire", label: "Combien d'os forment l'avant-bras chez la mésange, l'oreillard et la tortue ?", unit: "os", ans: 2, tol: 0 },
      { t: "num", c: "calc", label: "Sur un document agrandi 3 fois (échelle × 3), l'humérus de l'oreillard mesure 7,5 cm. Quelle est sa longueur réelle ?", unit: "cm", ans: 2.5, tol: .05, err: [[v => near(v, 22.5, .1), "Le document est agrandi : pour retrouver la taille réelle, on divise par 3."]] }],
    hints: ["Choisis un pinceau, puis touche les os. Commence toujours par l'épaule : la ceinture scapulaire articule le membre au reste du squelette.", "Bras : un seul os, l'humérus. Avant-bras : deux os, le radius et le cubitus (soudés chez la grenouille). Taille réelle = taille sur le document ÷ agrandissement.", "Voler, voler, marcher · 1 os · 2 os · 7,5 ÷ 3 = 2,5 cm."],
    corr: "La mésange et l'oreillard utilisent leur membre antérieur pour voler, la tortue pour marcher. Chez les quatre vertébrés, le membre antérieur est articulé par une ceinture scapulaire ; le bras contient un seul os (l'humérus), l'avant-bras deux os (le radius et le cubitus, soudés chez la grenouille), puis viennent les nombreux os de la main. Taille réelle de l'humérus de l'oreillard : 7,5 ÷ 3 = 2,5 cm." },
  { id: "b2", lvl: "hard", title: "Même organisation, fonctions différentes", recop: true,
    intro: "Aligne les quatre membres à l'épaule et donne-leur un humérus de même longueur : que reste-t-il de commun ?",
    widget: { title: "Logiciel · Aligner et comparer", w: "aligne", sim: "Schémas simplifiés" },
    parts: [
      { t: "task", c: "mod", label: "Lance l'alignement des membres, puis ajoute l'aile du papillon.", okMsg: "Membres alignés et comparés avec l'aile du papillon.", done: T_AL },
      { t: "choice", c: "lire", label: "Une fois alignés, que montrent les quatre membres ?", o: ["La même succession : ceinture scapulaire, humérus (1 os), radius et cubitus (2 os), puis les os de la main", "Des os différents chez chaque espèce", "Le même nombre de doigts chez les quatre espèces"], a: 0, no: { 2: "Compte les doigts : la grenouille en a 4 à l'avant, la tortue et l'oreillard 5, la mésange seulement 3, très réduits." } },
      { t: "choice", c: "lire", label: "L'aile du papillon sert aussi à voler. Est-elle construite sur le même plan ?", o: ["Non : elle ne contient aucun os (ni humérus, ni radius, ni cubitus)", "Oui : elle contient les mêmes os que l'aile de la mésange", "Oui, car elle sert à voler"], a: 0 },
      { t: "choice", c: "rais", label: "Qu'est-ce qui indique une parenté entre des êtres vivants ?", o: ["Une même organisation (mêmes os, disposés de la même façon), même si la fonction diffère", "Une même fonction (par exemple voler), même si l'organisation diffère", "Une même taille"], a: 0, no: { 1: "La mésange et le papillon volent tous les deux, mais leurs ailes n'ont pas du tout la même organisation." } },
      { t: "choice", c: "rais", label: "Que peut-on conclure sur la parenté entre ces quatre vertébrés ?", o: ["Ils sont apparentés : ils ont hérité cette organisation d'un ancêtre commun", "Ils ne sont pas apparentés, car leurs membres ont des formes différentes", "Seuls la mésange et l'oreillard sont apparentés, car ils volent"], a: 0 }],
    hints: ["Lance l'animation : les membres se déplient et leur humérus prend la même longueur. Puis touche « Ajouter l'aile d'un papillon ».", "Compare l'ordre des couleurs de l'épaule vers les doigts. Une ressemblance de fonction ne suffit pas : c'est l'organisation qui compte.", "La même succession d'os · non, aucun os · une même organisation · apparentés, ancêtre commun."],
    corr: "Une fois alignés, les quatre membres antérieurs montrent la même organisation : une ceinture scapulaire, un humérus, un radius et un cubitus, puis les os de la main, alors que leurs formes et leurs fonctions diffèrent (voler, marcher, sauter). L'aile du papillon sert aussi à voler mais ne contient aucun os : une même fonction n'indique pas une parenté. L'organisation commune des membres des vertébrés suggère qu'ils sont apparentés : ils l'ont héritée d'un ancêtre commun." }] }
];

/* ===== VERSION EXIGEANTE ===== */
const EXPERT = {
r0: { parts: [
    { t: "rows", c: "conn", label: "Associe chaque mot à sa signification.", choices: ["Côté de la tête", "Côté de la queue", "Côté du dos", "Côté du ventre"], rows: [{ txt: "Dorsal", a: 2 }, { txt: "Antérieur", a: 0 }, { txt: "Ventral", a: 3 }, { txt: "Postérieur", a: 1 }] },
    { t: "word", c: "conn", label: "Complète : un plan de symétrie bilatérale sépare le corps en une partie droite et une partie …", ans: ["gauche", "partie gauche", "une partie gauche"] },
    { t: "choice", c: "rais", label: "Lequel possède un seul plan de symétrie, qui sépare une droite et une gauche semblables ?", o: ["Un papillon", "Une coquille d'escargot", "Une étoile de mer à cinq bras"], a: 0 }],
  hints: ["Relis les définitions.", "Antérieur = avant, postérieur = arrière ; un plan sépare deux moitiés.", "Dorsal : dos · antérieur : tête · ventral : ventre · postérieur : queue · gauche · le papillon."],
  corr: "Antérieur : côté de la tête ; postérieur : côté de la queue ; dorsal : côté du dos ; ventral : côté du ventre. Le plan de symétrie bilatérale sépare une partie droite et une partie gauche semblables, comme chez le papillon." },
a1: { parts: [
    { t: "task", c: "mod", label: "Pour chaque animal, nomme les quatre pôles (vue de côté), puis trouve son plan de symétrie en le pliant (vue de dessus).", okMsg: "Pôles nommés et plans trouvés pour les deux animaux.", done: T_AX },
    { t: "redac", c: "rais", min: 30, label: "À partir des définitions et du TP virtuel, décris l'organisation de la carpe et de la grenouille.",
      crit: [{ g: "vois", lab: "L'axe antéro-postérieur (tête à l'avant, queue à l'arrière)", re: [/(antero|avant|anterieur)/, /(posterieur|arriere|queue)/] },
        { g: "vois", lab: "L'axe dorso-ventral (du dos au ventre)", re: [/(dorso|dos|dorsal)/, /(ventr)/] },
        { g: "vois", lab: "Le plan de symétrie bilatérale (droite et gauche semblables)", re: [/symetri/, /(droit|gauche)/] },
        { g: "sais", lab: "Le vocabulaire : axes de polarité", re: [/(axe|axes) de polarite/] },
        { g: "deduis", lab: "Une organisation commune aux deux animaux", re: [/(les deux|tous deux|deux especes|carpe et (la )?grenouille|commun|meme)/] }],
      model: "Je vois que la carpe et la grenouille possèdent deux axes de polarité. L'axe antéro-postérieur relie la tête, à l'avant, à la queue, à l'arrière ; l'axe dorso-ventral relie le dos au ventre. Je vois aussi qu'en pliant l'animal selon la ligne A, les deux moitiés se superposent : c'est un plan de symétrie bilatérale, qui sépare un côté droit et un côté gauche semblables. La ligne B n'est pas un plan de symétrie. J'en déduis que la carpe et la grenouille ont la même organisation externe." }],
  hints: ["Nomme les pôles et plie les deux animaux selon les deux lignes.", "Utilise les mots : axe de polarité, antéro-postérieur, dorso-ventral, plan de symétrie bilatérale, droite, gauche.", "Deux axes de polarité (antéro-postérieur, dorso-ventral) + un plan de symétrie bilatérale → même organisation chez les deux animaux."],
  corr: "La carpe et la grenouille possèdent un axe antéro-postérieur (de la tête, à l'avant, à la queue, à l'arrière), un axe dorso-ventral (du dos au ventre) et un plan de symétrie bilatérale qui sépare un côté droit et un côté gauche semblables : leur organisation externe est la même." },
a2: { parts: [
    { t: "task", c: "mod", label: "Radiographie les trois animaux, puis délimite les trois parties du corps de la carpe et de la grenouille.", okMsg: "Radiographies faites et parties délimitées.", done: T_RX },
    { t: "num", c: "lire", label: "Combien de parties possède le corps de chacun de ces deux vertébrés ?", unit: "parties", ans: 3, tol: 0 },
    { t: "word", c: "lire", label: "Comment s'appelle l'os qui forme la queue de la grenouille ?", ans: ["urostyle", "l'urostyle", "un urostyle"] },
    { t: "redac", c: "rais", min: 25, label: "Le squelette de la carpe et de la grenouille est-il osseux ou cartilagineux ? Justifie à partir des radiographies.",
      crit: [{ g: "vois", lab: "Le squelette de la carpe et de la grenouille est très contrasté (blanc, environ 85 à 90 %)", re: [/(contrast|blanc|visible|8[0-9]|9[0-9])/] },
        { g: "vois", lab: "Celui de la roussette l'est beaucoup moins (environ 20 %)", re: [/(roussette|requin|2[0-9] ?%)/] },
        { g: "sais", lab: "L'os, riche en minéraux, arrête les rayons X ; le cartilage les laisse passer", re: [/(mineral|calcium|rayons x|cartilage)/] },
        { g: "deduis", lab: "Conclusion : un squelette osseux", re: [/osseu/] }],
      model: "Je vois que sur la radiographie, le squelette de la carpe et celui de la grenouille apparaissent blancs et très contrastés, environ 88 % et 85 %, alors que celui de la roussette est beaucoup moins contrasté, environ 21 %. Je sais que l'os, riche en minéraux comme le phosphate de calcium, arrête les rayons X, alors que le cartilage, peu minéralisé, les laisse passer. J'en déduis que le squelette de la carpe et de la grenouille est osseux." }],
  hints: ["Radiographie les trois animaux et compare les contrastes mesurés.", "Relis « Pour comprendre la radiographie ». La queue de la grenouille est cachée entre les os du bassin.", "3 parties (tête, tronc, queue) · urostyle · contraste élevé chez la carpe et la grenouille, faible chez la roussette → squelette osseux."],
  corr: "Trois parties : la tête, le tronc et la queue (l'urostyle chez la grenouille). Le squelette de la carpe et de la grenouille est très contrasté sur la radiographie (environ 85 à 90 %), contrairement à celui de la roussette, cartilagineux (environ 20 %) : il est riche en minéraux, c'est un squelette osseux." },
a3: { parts: [
    { t: "task", c: "mod", label: "Identifie les quatre structures numérotées de chaque squelette, puis affiche les axes pour les deux animaux.", okMsg: "Structures identifiées et axes affichés.", done: T_SQ },
    { t: "redac", c: "rais", min: 35, label: "Décris la position du crâne, de la colonne vertébrale et des membres par rapport aux axes de polarité et au plan de symétrie, puis indique ce que suggère cette organisation commune à la carpe et à la grenouille.",
      crit: [{ g: "vois", lab: "Le crâne est antérieur (à l'avant)", re: [/crane/, /(anterieur|avant)/] },
        { g: "vois", lab: "La colonne vertébrale est dorsale, le long de l'axe antéro-postérieur", re: [/colonne/, /(dorsal|dos)/] },
        { g: "vois", lab: "Les membres sont ventraux", re: [/membre/, /ventr/] },
        { g: "vois", lab: "Quatre membres, par paires de part et d'autre du plan de symétrie", re: [/(quatre|4|deux anterieurs|paires?|de part et d'autre)/] },
        { g: "deduis", lab: "Une parenté : un ancêtre commun", re: [/(parent|apparent|ancetre commun)/] }],
      model: "Je vois que chez la carpe comme chez la grenouille, le crâne est situé à l'avant, au pôle antérieur, et que la colonne vertébrale est dorsale et suit l'axe antéro-postérieur. Je vois aussi que les quatre membres, nageoires paires ou pattes, sont en position ventrale : deux antérieurs et deux postérieurs, disposés par paires de part et d'autre du plan de symétrie. J'en déduis que cette organisation commune suggère une parenté entre la carpe et la grenouille : elles l'ont héritée d'un ancêtre commun." }],
  hints: ["Identifie les structures et affiche les axes pour les deux animaux.", "Pour chaque structure : avant ou arrière ? dos ou ventre ? Puis : que suggère une organisation identique ?", "Crâne antérieur · colonne dorsale le long de l'axe antéro-postérieur · 4 membres ventraux, 2 antérieurs et 2 postérieurs · parenté, ancêtre commun."],
  corr: "Le crâne est antérieur, la colonne vertébrale est dorsale et suit l'axe antéro-postérieur, les quatre membres sont ventraux, deux antérieurs et deux postérieurs, de part et d'autre du plan de symétrie. Cette organisation commune suggère une parenté : la carpe et la grenouille l'ont héritée d'un ancêtre commun." },
b1: { parts: [
    { t: "task", c: "mod", label: "Colorie les quatre os ou ensembles d'os de chaque membre antérieur.", okMsg: "Les quatre membres sont coloriés.", done: T_PH },
    { t: "choice", c: "lire", label: "Chez la grenouille, l'avant-bras ne montre qu'un seul os. Comment l'expliquer ?", o: ["Le radius et le cubitus sont soudés en un seul os", "La grenouille n'a pas de radius", "Ce n'est pas un avant-bras mais un humérus"], a: 0 },
    { t: "choice", c: "lire", label: "Chez l'oreillard, quels os sont très allongés pour tendre la membrane de l'aile ?", o: ["Les os de la main (métacarpiens et phalanges)", "L'humérus", "La ceinture scapulaire"], a: 0 },
    { t: "num", c: "calc", label: "Sur un document agrandi 3 fois (échelle × 3), l'humérus de l'oreillard mesure 7,5 cm. Quelle est sa longueur réelle ?", unit: "cm", ans: 2.5, tol: .05, err: [[v => near(v, 22.5, .1), "Le document est agrandi : pour retrouver la taille réelle, on divise par 3."]] },
    { t: "num", c: "calc", label: "Sur ce même document, le radius de l'oreillard mesure 11,4 cm. Combien de fois est-il plus long que l'humérus ? (arrondi au dixième)", unit: "fois", ans: 1.5, tol: .05, err: [[v => near(v, 3.8, .1), "Ça, c'est la longueur réelle du radius : divise-la par celle de l'humérus (2,5 cm)."]] }],
  hints: ["Colorie les quatre membres en partant de l'épaule.", "Taille réelle = taille sur le document ÷ agrandissement. Pour comparer deux longueurs, on les divise.", "Soudés · les os de la main · 7,5 ÷ 3 = 2,5 cm · 11,4 ÷ 7,5 ≈ 1,5."],
  corr: "Chez la grenouille, le radius et le cubitus sont soudés en un seul os. Chez l'oreillard, les métacarpiens et les phalanges sont très allongés et tendent la membrane de l'aile. L'humérus mesure 7,5 ÷ 3 = 2,5 cm ; le radius (11,4 ÷ 3 = 3,8 cm) est environ 1,5 fois plus long que l'humérus." },
b2: { parts: [
    { t: "task", c: "mod", label: "Lance l'alignement des membres, puis ajoute l'aile du papillon.", okMsg: "Membres alignés et comparés avec l'aile du papillon.", done: T_AL },
    { t: "redac", c: "rais", min: 35, label: "Que peux-tu conclure sur la parenté entre ces quatre vertébrés en considérant l'organisation de leurs membres antérieurs ? Rédige : je vois → je sais → j'en déduis.",
      crit: [{ g: "vois", lab: "Une ceinture scapulaire chez les quatre", re: [/ceinture/] },
        { g: "vois", lab: "Le même enchaînement d'os : humérus, radius et cubitus, os de la main", re: [/humerus/, /(radius|cubitus)/] },
        { g: "vois", lab: "Des formes ou des fonctions différentes (voler, marcher…)", re: [/(vol|march|nag|saut|fonction|forme)/] },
        { g: "sais", lab: "Une même fonction n'indique pas une parenté (l'aile du papillon n'a pas d'os)", re: [/(papillon|insecte|fonction)/] },
        { g: "deduis", lab: "Une parenté : un ancêtre commun", re: [/(parent|apparent|ancetre commun)/] }],
      model: "Je vois que les membres antérieurs de la mésange, de l'oreillard, de la tortue et de la grenouille ont des formes et des fonctions différentes : voler, marcher, se déplacer à terre. Pourtant, une fois alignés, ils montrent tous une ceinture scapulaire, puis un humérus, un radius et un cubitus (soudés chez la grenouille) et les nombreux os de la main. Je sais qu'une même fonction n'indique pas une parenté : l'aile du papillon permet aussi de voler, mais elle ne contient aucun os. J'en déduis que ces quatre vertébrés sont apparentés : ils ont hérité cette organisation commune d'un ancêtre commun." },
    { t: "choice", c: "rais", label: "Qu'est-ce qui indique une parenté entre des êtres vivants ?", o: ["Une même organisation (mêmes os, disposés de la même façon), même si la fonction diffère", "Une même fonction (par exemple voler), même si l'organisation diffère", "Une même taille"], a: 0 }],
  hints: ["Aligne les membres et compare-les à l'aile du papillon.", "Cite les os communs, puis les différences de forme et de fonction. Que montre l'aile du papillon ?", "Ceinture scapulaire, humérus, radius et cubitus, main chez les quatre · fonctions différentes · le papillon vole sans os · même organisation → ancêtre commun."],
  corr: "Les quatre membres antérieurs ont la même organisation (ceinture scapulaire, humérus, radius et cubitus, os de la main) malgré des formes et des fonctions différentes. Une même fonction n'indique pas une parenté (l'aile du papillon n'a pas d'os) : c'est l'organisation commune qui suggère que ces vertébrés sont apparentés et l'ont héritée d'un ancêtre commun." }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `Le problème : ${PROBLEM}\n${HOME.goal}\n\nBilan à recopier\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
