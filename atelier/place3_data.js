/* ===== 3e SVT · Chapitre 3 · Activité 3 · La place de l'Homme dans l'évolution : contenus =====
   D'après la fiche « Activité 3 » du professeur (Phylogène : vertébrés puis primates) et sa correction (tableaux, boîtes, arbres, bilan).
   Les DS « évolution » n'y sont pas repris : aucune de leurs espèces (truite, grenouille, coq, cœlacanthe, lézard, souris, végétaux)
   ni de leurs matrices de caractères. */
const PROBLEM = "Quelle est la place de l'Homme parmi les êtres vivants, puis parmi les mammifères ?";
const gap = `<span class="gap">………</span>`;
const HOME = { slug: "place-de-l-homme", short: "La place de l'Homme dans l'évolution", last: "d1", lastG: "p4", lastK: 0, dur: "environ 55 minutes",
  kicker: "Chapitre 3 · Diversité et évolution des êtres vivants · Activité 3", title: "Où se place l'Homme dans l'arbre du vivant ?",
  intro: "Le chimpanzé est notre plus proche parent. Pour connaître la place de l'Homme parmi tous les êtres vivants, on peut comparer son ADN avec celui des autres espèces. On peut aussi comparer leurs caractères et construire des groupes emboîtés ou des arbres de parenté : c'est ce que tu vas faire, comme avec le logiciel Phylogène.",
  lab: "Le problème à résoudre", goal: "Objectif : construire un tableau de caractères, des boîtes emboîtées et un arbre phylogénétique pour les vertébrés, puis pour les primates, et conclure.",
  fact: "Le tarsier, un petit primate d'Asie, a des yeux immenses : chacun est à peu près aussi gros que son cerveau !",
  parts: "Les quatre parties de l'activité", recop: "Fiche mémo à recopier dans le cahier",
  txt: "ACTIVITÉ 3 · LA PLACE DE L'HOMME DANS L'ÉVOLUTION\n3e SVT · Chapitre 3 · Diversité et évolution des êtres vivants",
  comps: { lire: "Extraire des informations de documents", mod: "Observer, manipuler (outil numérique)", repr: "Représenter des données", conn: "Mobiliser ses connaissances", rais: "Raisonner, argumenter" },
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "Je réponds avec des choix et des étiquettes, pas à pas." },
    l: { icon: "🔬", short: "Exigeante", name: "Version exigeante", q: "exigeante", desc: "Les mêmes tableaux, boîtes et arbres, mais j'écris mes réponses et je rédige mes justifications : je vois → je sais → j'en déduis." } },
  extraTitle: "Mes tableaux de caractères",
  extra: () => `MES TABLEAUX DE CARACTÈRES\n${myMx().map(x => "- " + x.replace(/<[^>]+>/g, "")).join("\n")}\n`,
  extraHTML: () => `<ul class="ul">${myMx().map(x => `<li>${nb(x)}</li>`).join("")}</ul>` };
function myMx() {
  const X = xst(), F = X.mxFirst || {};
  return ["vert", "prim"].map(set => `Tableau des ${SETS[set].name.toLowerCase()} : ${mxOk(set) ? "✓ juste" : "pas encore juste"}${F[set] !== undefined ? ` · <b>${F[set]}</b> erreur(s) à la première vérification` : ""}`);
}

/* ---------- documents ---------- */
const grpDoc = (set, title, src) => ({ title, html: `<ul class="ul">${SETS[set].groups.map((g, j) => `<li><span class="gsw" style="background:var(--c${j + 1})"></span> <b>${j + 1} · ${g.nm}</b> : ${src === "fiche" ? "les espèces qui présentent " : "les espèces qui ont "}${g.def}.</li>`).join("")}</ul>` });
const DOCGV = grpDoc("vert", "Les groupes à entourer (d'après la fiche)", "fiche");
const DOCGP = grpDoc("prim", "Les groupes de la partie 2", "corr");

/* ---------- fiche mémo : le bilan du professeur, puis la méthode ---------- */
const BIL = ["L'Homme est un <u>vertébré tétrapode</u> : il possède en effet un crâne, des vertèbres et 4 pattes.",
  "Il fait aussi partie des <u>amniotes</u> car son embryon se développe dans une poche appelée amnios.",
  "Ses mamelles et ses poils en font un <u>mammifère</u>, alors que ses ongles plats et ses pouces opposables en font un <u>primate</u>.",
  "Parmi les <u>primates</u>, il appartient à la famille des <u>grands singes</u> et des <u>hominoïdes</u>, parmi lesquels on trouve aussi le gorille et le chimpanzé, son plus proche parent.",
  "Ces liens de parenté suggèrent une origine commune et des <u>ancêtres communs</u>, dont le plus récent est celui qu'il partage avec le chimpanzé.",
  "Méthode : tableau de caractères → boîtes emboîtées → arbre. Plus un caractère est partagé, plus il est apparu tôt : il se place près de la racine. Chaque nœud ▪ représente un <u>ancêtre commun</u> qui possédait déjà tous les caractères placés avant lui.",
  "Les caractères étudiés ne départagent pas le chimpanzé et le gorille : c'est la comparaison de l'<u>ADN</u> (activité 2) qui montre que le chimpanzé est notre plus proche parent."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("");

const spOpts = set => SETS[set].sp.map(s => `${s.e} ${s.nm}`);
const spIdx = (set, ks) => ks.map(k => SETS[set].sp.findIndex(s => s.k === k));
const leafSet = (set, n) => SETS[set].leaves.slice(6 - n);
const trRows = set => TRAITS_OK(set).map((t, i) => ({ e: CIRC[i], txt: i === 0 ? "Trait ① (le plus près de la racine)" : i === 3 ? "Trait ④ (le plus récent)" : `Trait ${CIRC[i]}`, v: t }));
const grpParts = set => SETS[set].groups.map((g, j) => ({ t: "multi", c: "repr", label: `Groupe ${j + 1} · ${g.nm} : quelles espèces entoures-tu ?`, o: spOpts(set), a: spIdx(set, leafSet(set, g.n)).sort((a, b) => a - b) }));
const mxTask = set => ({ t: "task", c: "mod", label: `Remplis le tableau des ${SETS[set].name.toLowerCase()}, puis vérifie-le jusqu'à ce qu'il soit juste.`, okMsg: "Tableau juste.", done: () => { const r = mxErrors(set); return { ok: !r.e && !r.empty, msg: r.empty ? `${SETS[set].sp.length * SETS[set].ch.length - r.empty}/${SETS[set].sp.length * SETS[set].ch.length} cases remplies.` : r.e ? "Tableau rempli, mais pas encore juste : vérifie-le." : "Tableau juste." }; } });
const bxTask = set => ({ t: "task", c: "mod", label: "Affiche toutes les boîtes, caractère par caractère.", okMsg: "Toutes les boîtes ont été affichées.", done: () => { const ok = !!(xst().bxSeen || {})[set]; return { ok, msg: ok ? "Toutes les boîtes ont été affichées." : "Affiche les boîtes de tous les caractères." }; } });
const LIST = (lab, needs, bads, model) => ({ t: "list", c: "lire", label: lab, need: needs.map(r => ({ re: r })), bad: bads.map(r => ({ re: r })), ph: "caractère 1, caractère 2, …", model });

const GROUPS = [
{ id: "p1", n: 1, icon: "🦴", tab: "Le tableau", title: "Les vertébrés : le tableau de caractères", sub: "Chat, crapaud, crocodile, gorille, Homme et sardine · environ 10 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "Présent ou absent ?",
    widget: { title: "Outil numérique · Le tableau de caractères (collection « Vertébrés »)", w: "matV" },
    parts: [
      mxTask("vert"),
      { t: "choice", c: "lire", label: "Quel caractère est présent chez toutes les espèces du tableau ?", o: ["Le squelette osseux", "Les doigts", "L'amnios"], a: 0, no: { 1: "La sardine n'a pas de doigts.", 2: "Le crapaud et la sardine n'ont pas d'amnios." } },
      { t: "multi", c: "lire", label: "Quelles espèces possèdent des poils et des mamelles ?", o: spOpts("vert"), a: spIdx("vert", ["chat", "gorille", "homme"]).sort((a, b) => a - b) },
      { t: "choice", c: "lire", label: "Quelle espèce possède un amnios, mais ni poils ni mamelles ?", o: ["Le crocodile", "Le crapaud", "La sardine"], a: 0 }],
    hints: ["Touche 📄 à côté du nom d'une espèce pour lire ses informations, puis remplis sa ligne.", "Le crapaud et la sardine pondent dans l'eau des œufs sans amnios ; la sardine a des nageoires, pas de doigts.", "Squelette osseux : toutes · poils et mamelles : chat, gorille, Homme · amnios sans poils : crocodile."],
    corr: "Toutes les espèces ont un squelette osseux. Toutes sauf la sardine ont des doigts. Le chat, le gorille, l'Homme et le crocodile ont un amnios. Seuls le chat, le gorille et l'Homme ont des poils et des mamelles." }] },

{ id: "p2", n: 2, icon: "📦", tab: "Boîtes et arbre", title: "Des boîtes emboîtées à l'arbre des vertébrés", sub: "Boîtes, traits sur la branche principale, groupes · environ 18 minutes.",
  items: [
  { id: "b1", lvl: "easy", title: "Les boîtes emboîtées",
    widget: { title: "Outil numérique · Afficher les boîtes", w: "boxV" },
    parts: [
      bxTask("vert"),
      { t: "match", c: "repr", label: "Range les boîtes de la plus grande à la plus petite.", ask: "Choisis le caractère de la", rows: TRAITS_OK("vert").map((t, i) => ({ e: String(i + 1), txt: i === 0 ? "Boîte 1 (la plus grande)" : i === 3 ? "Boîte 4 (la plus petite)" : `Boîte ${i + 1}`, v: t })) },
      { t: "choice", c: "rais", label: "Pourquoi les poils et les mamelles forment-ils une seule boîte ?", o: ["Ils sont présents chez exactement les mêmes espèces", "Ce sont des caractères de l'Homme", "Ils sont apparus avant l'amnios"], a: 0 },
      { t: "choice", c: "rais", label: "Plus une boîte est petite…", o: ["moins son caractère est partagé : il est apparu plus récemment", "plus son caractère est ancien", "plus les espèces qu'elle contient sont petites"], a: 0 }],
    hints: ["Touche « Afficher toutes les boîtes », puis compte les espèces dans chaque boîte.", "La plus grande boîte contient les six espèces ; la plus petite, trois.", "Squelette osseux, doigts, amnios, poils et mamelles · mêmes espèces · plus petite = caractère apparu plus récemment."],
    corr: "Les boîtes s'emboîtent : squelette osseux (6 espèces) ⊃ doigts (5) ⊃ amnios (4) ⊃ poils et mamelles (3). Les poils et les mamelles forment une seule boîte car ils sont présents chez exactement les mêmes espèces. Moins un caractère est partagé, plus il est apparu récemment." },
  { id: "b2", lvl: "mid", title: "Placer les caractères sur l'arbre",
    live: "traitsV", liveTitle: "L'arbre des vertébrés (les traits se placent avec tes réponses)",
    parts: [
      { t: "match", c: "repr", label: "Place par des traits, sur la branche principale, l'apparition de chaque caractère (du plus ancien au plus récent).", ask: "Choisis le caractère du", rows: trRows("vert") },
      { t: "choice", c: "rais", label: "Le nœud ▪ d'où partent le chat, l'Homme et le gorille représente…", o: ["leur dernier ancêtre commun, qui possédait déjà des poils et des mamelles", "l'Homme", "une espèce actuelle"], a: 0 },
      { t: "choice", c: "rais", label: "Pourquoi le chat, l'Homme et le gorille partent-ils du même nœud ?", o: ["Les caractères du tableau ne permettent pas de les départager", "Ce sont les trois espèces les plus grandes", "Ils vivent au même endroit"], a: 0 }],
    hints: ["Le caractère le plus partagé (la plus grande boîte) apparaît le premier, près de la racine.", "Reprends l'ordre des boîtes de la plus grande à la plus petite.", "① squelette osseux · ② doigts · ③ amnios · ④ poils et mamelles · ancêtre commun · aucun caractère ne les départage."],
    corr: "De la racine vers les feuilles : ① squelette osseux, ② doigts, ③ amnios, ④ poils et mamelles. Chaque nœud ▪ représente un ancêtre commun ; celui du chat, de l'Homme et du gorille possédait déjà poils et mamelles. Aucun caractère du tableau ne les départage : ils partent du même nœud." },
  { id: "b3", lvl: "mid", title: "Entourer les groupes", docs: [DOCGV],
    live: "groupsV", liveTitle: "L'arbre des vertébrés et tes groupes (barres de couleur)",
    parts: [
      ...grpParts("vert"),
      { t: "choice", c: "rais", label: "L'Homme appartient…", o: ["aux quatre groupes : vertébrés, tétrapodes, amniotes et mammifères", "seulement au groupe des mammifères", "seulement aux vertébrés et aux mammifères"], a: 0 }],
    hints: ["Pour chaque groupe, relis sa définition et coche les espèces qui ont au moins ces caractères.", "Les groupes s'emboîtent comme les boîtes : chaque groupe est inclus dans le précédent.", "Vertébrés : les 6 · tétrapodes : sans la sardine · amniotes : sans sardine ni crapaud · mammifères : chat, Homme, gorille · l'Homme est dans les quatre."],
    corr: "Vertébrés : les six espèces. Tétrapodes : toutes sauf la sardine. Amniotes : le crocodile, le chat, l'Homme et le gorille. Mammifères : le chat, l'Homme et le gorille. L'Homme appartient aux quatre groupes." }] },

{ id: "p3", n: 3, icon: "🐒", tab: "Les primates", title: "La place de l'Homme parmi les mammifères", sub: "Chat, chimpanzé, gorille, Homme, macaque et tarsier · environ 18 minutes.",
  items: [
  { id: "c1", lvl: "easy", title: "Le tableau des primates",
    widget: { title: "Outil numérique · Le tableau de caractères (collection « Primates »)", w: "matP" },
    parts: [
      mxTask("prim"),
      { t: "choice", c: "lire", label: "Quel caractère est présent chez toutes les espèces du tableau ?", o: ["Les poils", "Le coccyx", "Les ongles plats et le pouce opposable"], a: 0 },
      { t: "multi", c: "lire", label: "Quelles espèces possèdent un coccyx ?", o: spOpts("prim"), a: spIdx("prim", ["chimp", "gorille", "homme"]).sort((a, b) => a - b) },
      { t: "choice", c: "lire", label: "Quelle espèce n'a ni ongles plats ni pouce opposable ?", o: ["Le chat", "Le tarsier", "Le macaque"], a: 0 }],
    hints: ["Touche 📄 à côté du nom d'une espèce pour lire ses informations.", "Coccyx = pas de queue : les dernières vertèbres sont soudées. Le macaque et le tarsier ont une queue.", "Poils : toutes · coccyx : chimpanzé, gorille, Homme · sans ongles plats : chat."],
    corr: "Toutes les espèces ont des poils. Toutes sauf le chat ont des ongles plats et un pouce opposable. Le macaque, le chimpanzé, le gorille et l'Homme ont des narines rapprochées et des orbites fermées. Seuls le chimpanzé, le gorille et l'Homme ont un coccyx." },
  { id: "c2", lvl: "mid", title: "Boîtes et arbre des primates",
    widget: { title: "Outil numérique · Afficher les boîtes", w: "boxP" },
    live: "traitsP", liveTitle: "L'arbre des primates (les traits se placent avec tes réponses)",
    parts: [
      bxTask("prim"),
      { t: "match", c: "repr", label: "Place par des traits l'apparition de chaque caractère sur la branche principale (du plus ancien au plus récent).", ask: "Choisis le caractère du", rows: trRows("prim") },
      { t: "choice", c: "rais", label: "D'après ces caractères, peut-on dire qui, du chimpanzé ou du gorille, est le plus proche parent de l'Homme ?", o: ["Non : tous les trois ont les mêmes caractères et partent du même nœud", "Oui : le gorille", "Oui : le macaque"], a: 0 },
      { t: "choice", c: "conn", label: "Comment sait-on que le chimpanzé est notre plus proche parent ?", o: ["En comparant l'ADN (activité 2)", "En comparant leur taille", "En comparant leur nourriture"], a: 0 }],
    hints: ["Affiche toutes les boîtes : la plus grande correspond au caractère le plus partagé.", "Ordre des boîtes : poils, puis ongles plats et pouce, puis narines et orbites, puis coccyx.", "① poils · ② ongles plats et pouce opposable · ③ narines rapprochées et orbites fermées · ④ coccyx · non · l'ADN."],
    corr: "De la racine vers les feuilles : ① poils, ② ongles plats et pouce opposable, ③ narines rapprochées et orbites fermées, ④ coccyx. Le chimpanzé, le gorille et l'Homme partagent les mêmes caractères et partent du même nœud : ces caractères ne les départagent pas. C'est la comparaison de l'ADN qui montre que le chimpanzé est notre plus proche parent." },
  { id: "c3", lvl: "mid", title: "Les groupes et la réponse au problème", docs: [DOCGP],
    live: "groupsP", liveTitle: "L'arbre des primates et tes groupes (barres de couleur)",
    parts: [
      ...grpParts("prim"),
      { t: "choice", c: "rais", label: "Réponse au problème : parmi les mammifères, l'Homme est…", o: ["un primate, un singe de l'Ancien Monde et un hominoïde, avec le chimpanzé et le gorille", "un primate, avec le tarsier seulement", "un mammifère qui n'appartient à aucun autre groupe"], a: 0 }],
    hints: ["Pour chaque groupe, relis sa définition et coche les espèces qui ont tous ces caractères.", "Les groupes s'emboîtent : mammifères ⊃ primates ⊃ singes de l'Ancien Monde ⊃ hominoïdes.", "Mammifères : les 6 · primates : sans le chat · singes de l'Ancien Monde : macaque, chimpanzé, gorille, Homme · hominoïdes : chimpanzé, gorille, Homme."],
    corr: "Mammifères : les six espèces. Primates : toutes sauf le chat. Singes de l'Ancien Monde : le macaque, le chimpanzé, le gorille et l'Homme. Hominoïdes : le chimpanzé, le gorille et l'Homme. Parmi les mammifères, l'Homme est un primate, un singe de l'Ancien Monde et un hominoïde, avec le chimpanzé et le gorille." }] },

{ id: "p4", n: 4, icon: "✍", tab: "Bilan", title: "Le bilan", sub: "Le bilan à compléter, puis la fiche mémo · environ 7 minutes.",
  items: [
  { id: "d1", lvl: "easy", title: "Le bilan à compléter", recop: true,
    parts: [
      { t: "rows", c: "conn", label: "Choisis le mot qui complète chaque phrase du bilan.", choices: ["vertébré tétrapode", "amniotes", "mammifère", "primate", "hominoïdes", "ancêtres communs"],
        rows: [{ txt: "L'Homme est un ……… : il possède en effet un crâne, des vertèbres et 4 pattes.", a: 0 }, { txt: "Il fait aussi partie des ……… car son embryon se développe dans une poche appelée amnios.", a: 1 },
          { txt: "Ses mamelles et ses poils en font un ………", a: 2 }, { txt: "… alors que ses ongles plats et ses pouces opposables en font un ………", a: 3 },
          { txt: "Parmi les primates, il appartient à la famille des grands singes et des ………, avec le gorille et le chimpanzé.", a: 4 }, { txt: "Ces liens de parenté suggèrent une origine commune et des ………", a: 5 }] }],
    hints: ["Reprends tes deux arbres : de la racine vers l'Homme, quels groupes traverses-tu ?", "Amnios → amniotes · poils et mamelles → mammifère · ongles plats et pouce → primate · coccyx → hominoïdes.", "vertébré tétrapode · amniotes · mammifère · primate · hominoïdes · ancêtres communs."],
    corr: "L'Homme est un vertébré tétrapode. Il fait partie des amniotes. Ses mamelles et ses poils en font un mammifère, ses ongles plats et ses pouces opposables un primate. Parmi les primates, il appartient aux grands singes et aux hominoïdes, avec le gorille et le chimpanzé, son plus proche parent. Ces liens de parenté suggèrent une origine commune et des ancêtres communs. Recopie la fiche mémo dans ton cahier." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement : souviens-toi de l'activité 2",
  parts: [
    { t: "choice", c: "conn", label: "Dans un arbre de parenté, chaque nœud représente…", o: ["un ancêtre commun hypothétique", "une espèce actuelle", "une mutation"], a: 0 },
    { t: "choice", c: "conn", label: "Dans un arbre de parenté, la longueur des branches…", o: ["n'a pas d'importance : seul l'ordre des séparations compte", "indique la taille des espèces", "indique leur âge"], a: 0 },
    { t: "choice", c: "conn", label: "Deux espèces qui se ressemblent beaucoup…", o: ["ont probablement un ancêtre commun récent", "vivent forcément au même endroit", "sont forcément de la même taille"], a: 0 }],
  hints: ["Pense à l'arbre de l'activité 2, dessiné à partir des pourcentages d'ADN.", "Relis la fiche méthode de l'activité 2 : « seul l'ordre… ».", "Ancêtre commun · seul l'ordre compte · ancêtre commun récent."],
  corr: "Chaque nœud d'un arbre de parenté représente un ancêtre commun hypothétique ; seul l'ordre des séparations compte, pas la longueur des branches. Deux espèces qui se ressemblent beaucoup ont probablement un ancêtre commun récent." };

/* ===== VERSION EXIGEANTE ===== */
const EXPERT = {
r0: { parts: [
    { t: "word", c: "conn", label: `Dans un arbre de parenté, chaque nœud représente un ${gap} commun hypothétique.`, ans: ["ancêtre", "ancetre"] },
    { t: "word", c: "conn", label: `Dans un arbre, seul l'ordre des ${gap} compte, pas la longueur des branches.`, ans: ["séparations", "separations", "séparation", "nœuds", "noeuds", "embranchements"] },
    { t: "word", c: "conn", label: `D'après l'ADN (activité 2), notre plus proche parent est le ${gap}.`, ans: ["chimpanzé", "chimpanze"] }],
  hints: ["Pense à l'arbre de l'activité 2.", "Relis la fiche méthode de l'activité 2.", "ancêtre · séparations · chimpanzé."] },
a1: { parts: [
    mxTask("vert"),
    { t: "num", c: "lire", label: "Combien d'espèces du tableau possèdent des doigts ?", unit: "espèces", ans: 5 },
    { t: "num", c: "lire", label: "Combien d'espèces du tableau possèdent un amnios ?", unit: "espèces", ans: 4 },
    LIST("Cite les caractères du tableau que l'Homme partage avec le crocodile.", [/amnios/, /doigt/, /squelette|osseux|os\b/], [/poil/, /mamelle/], "amnios, doigts, squelette osseux")],
  hints: ["Touche 📄 à côté du nom d'une espèce pour lire ses informations.", "Compare la ligne de l'Homme et celle du crocodile, case par case.", "Doigts : 5 espèces · amnios : 4 · Homme et crocodile : amnios, doigts, squelette osseux."],
  corr: "Doigts : 5 espèces (toutes sauf la sardine). Amnios : 4 espèces (crocodile, chat, gorille, Homme). L'Homme partage avec le crocodile l'amnios, les doigts et le squelette osseux, mais pas les poils ni les mamelles." },
b1: { parts: [
    bxTask("vert"),
    { t: "match", c: "repr", label: "Range les boîtes de la plus grande à la plus petite.", ask: "Choisis le caractère de la", rows: TRAITS_OK("vert").map((t, i) => ({ e: String(i + 1), txt: i === 0 ? "Boîte 1 (la plus grande)" : i === 3 ? "Boîte 4 (la plus petite)" : `Boîte ${i + 1}`, v: t })) },
    { t: "redac", c: "rais", min: 25, label: "Le crocodile et le chat sont dans la boîte « Amnios », mais pas le crapaud. Qu'est-ce que cela indique sur leurs liens de parenté ?",
      crit: [{ g: "vois", lab: "Tu dis que le crocodile et le chat partagent l'amnios, que le crapaud n'a pas", re: [/amnios/, /crocodile|chat|crapaud|partag|commun|tous les deux|les deux/] },
        { g: "sais", lab: "Tu dis qu'un caractère partagé a été hérité d'un ancêtre commun", re: [/ancetre/, /herit|transmi|commun|partag|possedait/] },
        { g: "deduis", lab: "Tu conclus que le crocodile et le chat sont plus proches parents entre eux qu'avec le crapaud", re: [/plus proche|plus apparent|plus de parent|ancetre commun plus recent|plus recent/] }],
      model: "Je vois que le crocodile et le chat possèdent tous les deux un amnios, alors que le crapaud n'en a pas. Je sais qu'un caractère partagé par plusieurs espèces a été hérité de leur ancêtre commun. J'en déduis que le crocodile et le chat ont un ancêtre commun qui possédait un amnios, plus récent que celui qu'ils partagent avec le crapaud : ils sont plus proches parents entre eux qu'avec le crapaud." }],
  hints: ["Affiche toutes les boîtes et compte les espèces dans chacune.", "Un caractère partagé a été hérité d'un ancêtre commun qui le possédait déjà.", "Squelette osseux, doigts, amnios, poils et mamelles · le chat et le crocodile ont un ancêtre commun plus récent."],
  corr: "Les boîtes s'emboîtent : squelette osseux ⊃ doigts ⊃ amnios ⊃ poils et mamelles. Le crocodile et le chat ont hérité l'amnios d'un ancêtre commun que le crapaud ne partage pas : ils sont plus proches parents entre eux qu'avec le crapaud." },
b2: { parts: [
    { t: "match", c: "repr", label: "Place par des traits, sur la branche principale, l'apparition de chaque caractère (du plus ancien au plus récent).", ask: "Choisis le caractère du", rows: trRows("vert") },
    { t: "word", c: "rais", label: `Le nœud ▪ d'où partent le chat, l'Homme et le gorille représente leur dernier ${gap} commun.`, ans: ["ancêtre", "ancetre"] },
    LIST("Cite les caractères que possédait déjà l'ancêtre commun du crocodile et de l'Homme.", [/amnios/, /doigt/, /squelette|osseux|os\b/], [/poil/, /mamelle/], "amnios, doigts, squelette osseux")],
  hints: ["Le caractère le plus partagé apparaît le premier, près de la racine.", "L'ancêtre commun du crocodile et de l'Homme est le nœud qui suit le trait ③.", "① squelette osseux · ② doigts · ③ amnios · ④ poils et mamelles · ancêtre · amnios, doigts, squelette osseux."],
  corr: "① squelette osseux, ② doigts, ③ amnios, ④ poils et mamelles. Le nœud du chat, de l'Homme et du gorille est leur dernier ancêtre commun. L'ancêtre commun du crocodile et de l'Homme possédait déjà un squelette osseux, des doigts et un amnios, mais pas encore de poils ni de mamelles." },
b3: { parts: [
    ...grpParts("vert"),
    { t: "redac", c: "rais", min: 25, label: "À quels groupes appartient l'Homme ? Justifie avec ses caractères.",
      crit: [{ g: "vois", lab: "Vertébré : squelette osseux", re: [/vertebre/, /squelette|osseux|os\b/] },
        { g: "vois", lab: "Tétrapode : doigts", re: [/tetrapode/, /doigt/] },
        { g: "sais", lab: "Amniote : amnios", re: [/amniote/, /amnios/] },
        { g: "deduis", lab: "Mammifère : poils et mamelles", re: [/mammifere/, /poil|mamelle/] }],
      model: "L'Homme possède un squelette osseux : c'est un vertébré. Il a des doigts : c'est un tétrapode. Son embryon se développe dans un amnios : c'est un amniote. Il a des poils et des mamelles : c'est un mammifère. Il appartient donc aux quatre groupes." }],
  hints: ["Pour chaque groupe, relis sa définition et coche les espèces qui ont au moins ces caractères.", "Les groupes s'emboîtent comme les boîtes.", "Vertébrés : 6 · tétrapodes : 5 · amniotes : 4 · mammifères : 3 · l'Homme est dans les quatre."],
  corr: "Vertébrés : les six espèces ; tétrapodes : toutes sauf la sardine ; amniotes : crocodile, chat, Homme, gorille ; mammifères : chat, Homme, gorille. L'Homme est un vertébré (squelette osseux), un tétrapode (doigts), un amniote (amnios) et un mammifère (poils, mamelles)." },
c1: { parts: [
    mxTask("prim"),
    { t: "num", c: "lire", label: "Combien d'espèces du tableau possèdent un coccyx ?", unit: "espèces", ans: 3 },
    LIST("Cite les caractères du tableau que l'Homme partage avec le macaque.", [/poil/, /ongle|pouce/, /narine|orbite/], [/coccyx/], "poils, ongles plats et pouce opposable, narines rapprochées et orbites fermées")],
  hints: ["Touche 📄 à côté du nom d'une espèce pour lire ses informations.", "Compare la ligne de l'Homme et celle du macaque : le macaque a-t-il une queue ?", "Coccyx : 3 espèces · Homme et macaque : poils, ongles plats et pouce opposable, narines rapprochées et orbites fermées."],
  corr: "Seuls le chimpanzé, le gorille et l'Homme ont un coccyx. L'Homme partage avec le macaque les poils, les ongles plats et le pouce opposable, les narines rapprochées et les orbites fermées, mais pas le coccyx : le macaque a une queue." },
c2: { parts: [
    bxTask("prim"),
    { t: "match", c: "repr", label: "Place par des traits l'apparition de chaque caractère sur la branche principale (du plus ancien au plus récent).", ask: "Choisis le caractère du", rows: trRows("prim") },
    { t: "redac", c: "rais", min: 25, label: "Les caractères étudiés permettent-ils de dire qui, du chimpanzé ou du gorille, est le plus proche parent de l'Homme ? Comment peut-on le savoir ?",
      crit: [{ g: "vois", lab: "Tu dis que le chimpanzé, le gorille et l'Homme ont les mêmes caractères et partent du même nœud", re: [/meme|memes|identiques|pareil|tous les trois|meme noeud|meme ancetre/] },
        { g: "deduis", lab: "Tu conclus que ces caractères ne permettent pas de les départager", re: [/ne (permet|permettent)|pas possible|impossible|on ne peut|pas departager|non\b|ne suffi/] },
        { g: "sais", lab: "Tu dis que c'est la comparaison de l'ADN qui montre que c'est le chimpanzé", re: [/adn|genetique|98/] }],
      model: "Je vois que le chimpanzé, le gorille et l'Homme possèdent exactement les mêmes caractères et partent du même nœud de l'arbre. J'en déduis que ces caractères ne permettent pas de les départager. Je sais que la comparaison de l'ADN (activité 2) montre que le chimpanzé est l'espèce génétiquement la plus proche de nous : c'est notre plus proche parent." }],
  hints: ["Affiche toutes les boîtes : la plus grande correspond au caractère le plus partagé.", "Regarde le dernier nœud de l'arbre : combien de branches en partent ?", "① poils · ② ongles plats et pouce · ③ narines et orbites · ④ coccyx · mêmes caractères → pas départagés → l'ADN."],
  corr: "① poils, ② ongles plats et pouce opposable, ③ narines rapprochées et orbites fermées, ④ coccyx. Le chimpanzé, le gorille et l'Homme ont les mêmes caractères : ils partent du même nœud et ces caractères ne les départagent pas. C'est la comparaison de l'ADN qui montre que le chimpanzé est notre plus proche parent." },
c3: { parts: [
    ...grpParts("prim"),
    { t: "redac", c: "rais", min: 30, label: "Réponds au problème : quelle est la place de l'Homme parmi les mammifères ? Justifie avec ses caractères.",
      crit: [{ g: "vois", lab: "Primate : ongles plats et pouce opposable", re: [/primate/, /ongle|pouce/] },
        { g: "sais", lab: "Singe de l'Ancien Monde : narines rapprochées et orbites fermées", re: [/ancien monde|singe/, /narine|orbite/] },
        { g: "deduis", lab: "Hominoïde : coccyx, avec le chimpanzé et le gorille", re: [/hominoide|grand singe/, /coccyx|chimp|gorille/] }],
      model: "Parmi les mammifères, l'Homme est un primate, car il a des ongles plats et un pouce opposable. C'est aussi un singe de l'Ancien Monde, car il a des narines rapprochées et des orbites fermées. Enfin, c'est un hominoïde, car il a un coccyx, comme le chimpanzé et le gorille." }],
  hints: ["Pour chaque groupe, relis sa définition et coche les espèces qui ont tous ces caractères.", "Les groupes s'emboîtent : mammifères ⊃ primates ⊃ singes de l'Ancien Monde ⊃ hominoïdes.", "Primate (ongles, pouce) · singe de l'Ancien Monde (narines, orbites) · hominoïde (coccyx) avec chimpanzé et gorille."],
  corr: "Mammifères : les six espèces ; primates : toutes sauf le chat ; singes de l'Ancien Monde : macaque, chimpanzé, gorille, Homme ; hominoïdes : chimpanzé, gorille, Homme. L'Homme est un primate (ongles plats, pouce opposable), un singe de l'Ancien Monde (narines rapprochées, orbites fermées) et un hominoïde (coccyx), avec le chimpanzé et le gorille." },
d1: { parts: [
    { t: "word", c: "conn", label: `L'Homme est un vertébré ${gap} : il possède en effet un crâne, des vertèbres et 4 pattes.`, ans: ["tétrapode", "tetrapode"] },
    { t: "word", c: "conn", label: `Il fait aussi partie des ${gap}, car son embryon se développe dans une poche appelée amnios.`, ans: ["amniotes", "amniote"] },
    { t: "word", c: "conn", label: `Ses mamelles et ses poils en font un ${gap}…`, ans: ["mammifère", "mammifere"] },
    { t: "word", c: "conn", label: `… alors que ses ongles plats et ses pouces opposables en font un ${gap}.`, ans: ["primate"] },
    { t: "word", c: "conn", label: `Parmi les primates, il appartient à la famille des grands singes et des ${gap}, avec le gorille et le chimpanzé.`, ans: ["hominoïdes", "hominoides", "hominoïde", "hominoide"] },
    { t: "word", c: "conn", label: `Ces liens de parenté suggèrent une origine commune et des ancêtres ${gap}.`, ans: ["communs", "commun"] }],
  hints: ["Reprends tes deux arbres : de la racine vers l'Homme, quels groupes traverses-tu ?", "Amnios → amniotes · poils et mamelles → mammifère · ongles plats et pouce → primate · coccyx → hominoïdes.", "tétrapode · amniotes · mammifère · primate · hominoïdes · communs."] }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `Le problème : ${PROBLEM}\n${HOME.goal}\n\nFiche mémo à recopier\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
