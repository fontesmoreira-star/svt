/* ===== 3e SVT · Révision du chapitre de génétique, d'après le résumé et les fiches 1 à 10 du professeur ===== */
const PROBLEM = "Comment l'information génétique est-elle portée par nos cellules, et comment se transmet-elle d'une cellule à l'autre et d'une génération à l'autre ?";
const gap = `<span class="gap">………</span>`;
const GRIDC = ["A/B", "A/O", "B/O", "O/O", "A/A", "B/B"];
const HOME = { slug: "revision-genetique-activites-1-10", short: "Révision · Génétique (activités 1 à 10)", last: "e3", lastG: "p5", lastK: 2,
  kicker: "3e SVT · Génétique · Révision des activités 1 à 10", title: "Je révise tout le chapitre de génétique",
  intro: "Caractères, noyau, ADN, chromosomes, allèles, mitose et méiose : chaque étape te fait manipuler, puis répondre. Ta progression reste enregistrée sur cet appareil : tu peux réviser en plusieurs fois.",
  lab: "Le problème du chapitre", goal: "Objectif : réviser les activités 1 à 10, puis recopier ou télécharger ta fiche de révision.",
  fact: "Déroulé, l'ADN d'une seule de tes cellules mesurerait environ 2 mètres.",
  parts: "Les cinq parties de la révision", recop: "Ma fiche de révision",
  txt: "RÉVISION · GÉNÉTIQUE (ACTIVITÉS 1 À 10)\n3e SVT",
  comps: { conn: "Mobiliser ses connaissances", lire: "Exploiter un document", mod: "Manipuler, expérimenter", rais: "Raisonner, argumenter" } };

const FICHE = [
  ["Caractères (activités 1 et 2)", "Un <u>caractère</u> est une particularité observable. Les <u>caractères spécifiques</u> sont communs à tous les individus d'une espèce ; les <u>variations individuelles</u> sont propres à chacun (couleur des yeux, groupe sanguin…). L'ensemble des caractères observables d'un individu forme son <u>phénotype</u>. Les <u>caractères héréditaires</u> se transmettent de génération en génération. Certains caractères peuvent être modifiés par l'<u>environnement</u> ou les conditions de vie (bronzage, musculature, nombre de globules rouges) : ces modifications ne sont pas transmises à la descendance, donc ne sont pas héréditaires."],
  ["Noyau et ADN (activités 3 à 5)", "L'information génétique est localisée dans le <u>noyau</u> de la cellule (expérience de clonage). Elle est portée par l'<u>ADN</u>, présent dans toutes les cellules ; on peut l'extraire et le colorer en vert avec le vert de méthyle."],
  ["Chromosomes et caryotype (activité 6)", "Le <u>caryotype</u> présente les chromosomes d'une cellule, photographiés puis classés par paires et par taille. L'être humain possède <u>46 chromosomes</u>, soit 23 paires : XX chez la femme, XY chez l'homme. Un nombre anormal de chromosomes entraîne des anomalies (trisomie 21 : trois chromosomes 21). Un chromosome double est formé de <u>2 chromatides</u> identiques reliées par le <u>centromère</u> ; chaque chromatide est un long filament d'ADN."],
  ["Gènes et allèles (activités 7 et 8)", "Nous avons tous les mêmes <u>gènes</u>, situés au même endroit sur les deux chromosomes d'une paire, mais pas forcément les mêmes <u>allèles</u> (versions d'un gène). Un allèle <u>dominant</u> s'exprime même s'il n'est présent qu'une fois ; un allèle <u>récessif</u> doit être présent deux fois pour s'exprimer. L'ensemble des allèles d'un individu forme son <u>génotype</u>, qui détermine en grande partie le phénotype."],
  ["Mitose et méiose (activités 9 et 10)", "<u>Mitose</u> : chaque chromosome se copie (duplication), puis les chromatides se séparent ; une cellule donne 2 cellules à 46 chromosomes, <u>identiques</u> à elle. <u>Méiose</u> : une cellule donne 4 <u>cellules reproductrices</u> à 23 chromosomes, un de chaque paire ; les chromosomes de chaque paire se répartissent au hasard, donc les cellules reproductrices sont génétiquement <u>différentes</u>. À la <u>fécondation</u>, 23 + 23 = 46 chromosomes."]];
const bilanHTML = () => FICHE.map(([t, x]) => `<p><b>${t}.</b> ${nb(x)}</p>`).join("");
const DOC_SUSP = { title: "Document · Les suspects de l'enquête (activités 6 et 7)", html: tbl(["Suspect", "Sexe", "Groupe sanguin"], [["Jean NEYMAR", "homme", "O"], ["Djamal ALATETE", "homme", "A"], ["Max HYMOME", "homme", "AB"]]) };
const DOC_LEO = { title: "Document · La famille Martin", html: `<p>${nb("Monsieur Martin est du groupe sanguin A : son génotype est A/O. Madame Martin est du groupe B : son génotype est B/O. Leur fils Léo est du groupe O.")}</p><p>${nb("Monsieur Martin s'étonne : « Ni ma femme ni moi ne sommes du groupe O ! »")}</p>` };

const GROUPS = [
{ id: "p1", n: 1, icon: "🧑‍🤝‍🧑", tab: "Caractères", title: "Caractères et hérédité", sub: "Activités 1 et 2 : profil des suspects, caractères héréditaires.",
  items: [
  { id: "a1", lvl: "easy", title: "Spécifique ou individuel ?",
    parts: [
      { t: "rows", c: "conn", label: "Ce caractère est-il commun à tous les êtres humains ou propre à chacun ?", choices: ["Caractère spécifique", "Variation individuelle"], rows: [{ txt: "Avoir deux yeux", a: 0 }, { txt: "La couleur des yeux", a: 1 }, { txt: "Marcher sur deux jambes", a: 0 }, { txt: "Le groupe sanguin", a: 1 }, { txt: "Avoir une colonne vertébrale", a: 0 }, { txt: "La forme du lobe de l'oreille", a: 1 }] },
      { t: "word", c: "conn", label: `L'ensemble des caractères observables d'un individu forme son ${gap}.`, ans: ["phénotype", "phenotype"], spell: true, err: [[["génotype"], "Le génotype, c'est l'ensemble des allèles. On cherche l'ensemble des caractères observables."], [["caryotype"], "Le caryotype, c'est l'ensemble des chromosomes classés par paires."]] }],
    hints: ["Spécifique : on le retrouve chez tous les êtres humains. Individuel : il change d'une personne à l'autre.", "Tous les êtres humains ont deux yeux, mais pas tous la même couleur d'yeux.", "Spécifiques : deux yeux, deux jambes, colonne vertébrale. Individuels : couleur des yeux, groupe sanguin, lobe de l'oreille. Mot : phénotype."],
    corr: "Les caractères communs à tous les individus d'une espèce sont des caractères spécifiques (deux yeux, marche sur deux jambes, colonne vertébrale). Chaque individu se différencie par des variations individuelles (couleur des yeux, groupe sanguin, forme du lobe de l'oreille). L'ensemble des caractères observables constitue le phénotype." },
  { id: "a2", lvl: "mid", title: "Héréditaire ou modifié par l'environnement ?",
    widget: { title: "Simulation · Les jumeaux", w: "jumeaux", sim: "Valeurs simulées" },
    parts: [
      { t: "task", c: "mod", label: "Change au moins une condition de vie du jumeau 2, puis fais naître son bébé.", okMsg: "Simulation réalisée.", done: () => { const J = xst().jum || {}; return { ok: !!(J.baby && (J.sun || J.sport || J.alt)), msg: J.baby ? (J.sun || J.sport || J.alt ? "Simulation réalisée." : "Change aussi une condition de vie du jumeau 2.") : "Le bébé n'est pas encore né." }; } },
      { t: "rows", c: "rais", label: "Classe chaque caractère.", choices: ["Héréditaire", "Modifié par l'environnement"], rows: [{ txt: "La couleur des yeux", a: 0 }, { txt: "La peau bronzée après les vacances", a: 1 }, { txt: "Le groupe sanguin", a: 0 }, { txt: "Les muscles développés par la musculation", a: 1 }, { txt: "Les globules rouges plus nombreux en montagne", a: 1 }] },
      { t: "word", c: "conn", label: `Ces modifications ne sont pas transmises à la descendance : elles ne sont donc pas ${gap}.`, ans: ["héréditaires", "héréditaire"] },
      { t: "choice", c: "rais", label: "Les deux jumeaux ont les mêmes gènes, mais pas la même couleur de peau. Pourquoi ?", o: ["Le phénotype dépend aussi de l'environnement (soleil, sport, altitude…)", "Leurs gènes ont changé pendant les vacances", "Le bronzage est héréditaire"], a: 0, no: { 2: "Regarde le bébé du jumeau 2 : il ne naît pas bronzé." } }],
    hints: ["Compare les deux jumeaux, puis le jumeau 2 et son bébé, dans le tableau.", "Un caractère héréditaire se retrouve chez les vrais jumeaux, quelles que soient leurs conditions de vie.", "Héréditaires : yeux, groupe sanguin. Modifiés par l'environnement : bronzage, muscles, globules rouges. Mot : héréditaires."],
    corr: "La couleur des yeux et le groupe sanguin sont des caractères héréditaires : ils se transmettent de génération en génération. Le bronzage, la musculature et le nombre de globules rouges peuvent être modifiés par l'environnement ou les conditions de vie ; ces modifications ne sont pas transmises à la descendance, donc ne sont pas héréditaires." }] },

{ id: "p2", n: 2, icon: "🔬", tab: "Noyau et ADN", title: "Où est l'information génétique ?", sub: "Activités 3 et 5 : expérience de clonage, extraction de l'ADN.",
  items: [
  { id: "b1", lvl: "mid", title: "L'expérience de clonage",
    widget: { title: "Simulation · Le transfert de noyau", w: "clonage", sim: "Schéma simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Réalise au moins 2 expériences avec des vaches différentes.", okMsg: "2 expériences réalisées.", done: () => { const n = Object.keys(CLO().tries).length; return { ok: n >= 2, msg: `${Math.min(n, 2)}/2 expériences réalisées.` }; } },
      { t: "choice", c: "rais", label: "Le veau ressemble toujours à la vache qui a donné…", o: ["le noyau", "l'ovule", "son utérus (la vache porteuse)"], a: 0 },
      { t: "choice", c: "rais", label: "Noyau d'un embryon de vache rousse, ovule d'une vache noire et blanche : le veau sera…", o: ["roux", "noir et blanc", "à moitié roux, à moitié noir et blanc"], a: 0 },
      { t: "word", c: "conn", label: `L'information génétique est localisée dans le ${gap} de la cellule.`, ans: ["noyau"], err: [[["cytoplasme", "membrane", "ovule"], "Le veau ressemble toujours à la vache qui a donné cette partie de la cellule."]] }],
    hints: ["Change une seule vache à la fois et compare le veau obtenu.", "Change la vache porteuse : le veau change-t-il ? Change la vache qui donne le noyau : et maintenant ?", "Le veau a toujours les caractères de la vache qui a donné le noyau : l'information génétique est dans le noyau."],
    corr: "Quelle que soit la vache qui donne l'ovule ou qui porte l'embryon, le veau présente les caractères de la vache qui a donné le noyau. L'information génétique est donc localisée dans le noyau de la cellule." },
  { id: "b2", lvl: "mid", title: "TP virtuel · Notre échantillon contient-il de l'ADN ?",
    widget: { title: "TP virtuel · Extraire l'ADN de la banane", w: "tpadn", sim: "Simulation" },
    parts: [
      { t: "task", c: "mod", label: "Réalise le TP jusqu'au test au vert de méthyle.", okMsg: "TP terminé.", done: () => { const T = xst().tp || {}; return { ok: !!T.done, msg: T.done ? "TP terminé." : "Le TP n'est pas encore terminé." }; } },
      { t: "match", c: "conn", label: "Relie chaque produit à son rôle.", ask: "Choisis le rôle de", rows: [{ e: "🧴", txt: "Liquide vaisselle", v: "Détruit les membranes des cellules" }, { e: "🧂", txt: "Sel", v: "Aide l'ADN à précipiter" }, { e: "❄", txt: "Éthanol froid", v: "Fait apparaître l'ADN en filaments blancs" }, { e: "🟢", txt: "Vert de méthyle", v: "Colore l'ADN en vert" }] },
      { t: "choice", c: "rais", label: "J'observe que le précipité devient vert. Or le vert de méthyle se fixe spécifiquement sur l'ADN. Donc…", o: ["le précipité contient de l'ADN", "la banane est verte", "le précipité contient de l'éthanol"], a: 0 },
      { t: "choice", c: "conn", label: "Quelle erreur faut-il éviter après avoir versé l'éthanol ?", o: ["Agiter le tube", "Attendre 2 à 3 minutes", "Laisser le tube immobile"], a: 0 }],
    hints: ["Suis l'ordre de ta fiche : mortier, tube, éthanol, attente, spatule, colorant.", "Le liquide vaisselle et le sel s'ajoutent avant de broyer. L'éthanol froid se verse très lentement, puis on n'agite plus.", "Liquide vaisselle : membranes · sel : aide à précipiter · éthanol : filaments blancs · vert de méthyle : colore l'ADN. Erreur : agiter."],
    corr: "Le liquide vaisselle détruit les membranes des cellules, le sel aide l'ADN à précipiter, l'éthanol froid le fait apparaître en filaments blancs, et le vert de méthyle, qui se fixe spécifiquement sur l'ADN, le colore en vert. Le précipité vert contient donc de l'ADN : notre échantillon de banane contient de l'ADN. Il ne faut pas agiter le tube après l'éthanol." }] },

{ id: "p3", n: 3, icon: "🧬", tab: "Chromosomes", title: "Chromosomes et caryotype", sub: "Activités 4 et 6 : la structure d'un chromosome, lire un caryotype.",
  items: [
  { id: "c1", lvl: "easy", title: "Légender un chromosome",
    widget: { title: "Schéma · Le chromosome", w: "chromo" },
    parts: [
      { t: "rows", c: "conn", label: "Affiche le chromosome double, puis légende les repères.", choices: ["Chromatide", "Centromère"], rows: [{ txt: "Repère ①", a: 0 }, { txt: "Repère ②", a: 1 }, { txt: "Repère ③", a: 0 }] },
      { t: "num", c: "conn", label: "Combien de chromatides possède un chromosome double ?", unit: "chromatides", ans: 2 },
      { t: "choice", c: "conn", label: "Chaque chromatide est formée…", o: ["d'un long filament d'ADN", "d'un noyau", "de plusieurs cellules"], a: 0 },
      { t: "choice", c: "conn", label: "Sur les deux chromosomes d'une même paire, un gène est situé…", o: ["au même endroit", "à des endroits différents", "seulement sur le chromosome venu du père"], a: 0 }],
    hints: ["Touche « Chromosome double » : deux bâtonnets identiques apparaissent.", "Les deux bâtonnets sont les chromatides ; le point qui les relie est le centromère.", "① chromatide · ② centromère · ③ chromatide · 2 chromatides · un long filament d'ADN · au même endroit."],
    corr: "Un chromosome double est formé de 2 chromatides identiques, reliées par le centromère. Chaque chromatide est un long filament d'ADN. Les chromosomes vont par paires et un gène est situé au même endroit sur les deux chromosomes d'une paire." },
  { id: "c2", lvl: "mid", title: "Lire des caryotypes",
    widget: { title: "Document · Trois caryotypes humains", w: "caryo", sim: "Caryotypes schématisés" },
    parts: [
      { t: "rows", c: "lire", label: "À qui appartient chaque caryotype ?", choices: ["Une femme (XX)", "Un homme (XY)"], rows: [{ txt: "Caryotype n° 1", a: 0 }, { txt: "Caryotype n° 2", a: 1 }, { txt: "Caryotype n° 3", a: 1 }] },
      { t: "rows", c: "lire", label: "Chaque caryotype est-il normal ?", choices: ["Normal : 46 chromosomes", "Trisomie 21 : 47 chromosomes"], rows: [{ txt: "Caryotype n° 1", a: 0 }, { txt: "Caryotype n° 2", a: 1 }, { txt: "Caryotype n° 3", a: 0 }] },
      { t: "num", c: "conn", label: "Combien de paires de chromosomes compte un caryotype humain normal ?", unit: "paires", ans: 23, err: [[v => v === 46, "46, c'est le nombre de chromosomes. Une paire en compte deux."]] }],
    hints: ["Pour chaque caryotype, touche la dernière case : elle montre les chromosomes sexuels.", "Touche la paire n° 21 de chaque caryotype et compte ses chromosomes.", "N° 1 : femme normale. N° 2 : homme avec trois chromosomes 21. N° 3 : homme normal. 23 paires."],
    corr: "Les chromosomes sexuels indiquent le sexe : XX pour une femme (caryotype n° 1), XY pour un homme (n° 2 et n° 3). Le caryotype n° 2 possède trois chromosomes 21 au lieu de deux, soit 47 chromosomes : c'est une trisomie 21. Un caryotype humain normal compte 23 paires, soit 46 chromosomes." }] },

{ id: "p4", n: 4, icon: "🩸", tab: "Allèles", title: "Groupes sanguins, gènes et allèles", sub: "Activités 7 et 8 : test d'agglutination, génotype et phénotype.",
  items: [
  { id: "d1", lvl: "mid", title: "TP virtuel · Le test d'agglutination",
    widget: { title: "TP virtuel · Le test d'agglutination", w: "aggl", sim: "Résultats simulés" }, docs: [DOC_SUSP],
    parts: [
      { t: "rows", c: "mod", label: "Teste les quatre échantillons. Quel est le groupe sanguin de chacun ?", choices: ["A", "B", "AB", "O"], rows: [{ txt: "Lucie DITÉE", a: 0 }, { txt: "Sang du coupable", a: 3 }, { txt: "Échantillon mystère 1", a: 2 }, { txt: "Échantillon mystère 2", a: 1 }] },
      { t: "choice", c: "conn", label: "Une agglutination avec le sérum anti-A montre que les globules rouges portent…", o: ["l'antigène A", "l'antigène B", "aucun antigène"], a: 0 },
      { t: "choice", c: "rais", label: "Pourquoi teste-t-on d'abord le sang de Lucie DITÉE, dont on connaît le groupe ?", o: ["Pour vérifier que les sérums fonctionnent : c'est un témoin", "Parce qu'elle est coupable", "Pour avoir moins de puits à préparer"], a: 0 },
      { t: "choice", c: "rais", label: "D'après le document, quel suspect peut être l'auteur du sang ?", o: ["Jean NEYMAR", "Djamal ALATETE", "Max HYMOME"], a: 0 }],
    hints: ["Agglutination avec l'anti-A : antigène A présent. Avec l'anti-B : antigène B présent.", "Les deux sérums : groupe AB. Aucun des deux : groupe O.", "Lucie A · coupable O · mystère 1 AB · mystère 2 B. Le coupable est du groupe O : Jean NEYMAR."],
    corr: "Lucie DITÉE (témoin) agglutine seulement avec l'anti-A : elle est du groupe A, le test fonctionne. Le sang du coupable n'agglutine ni avec l'anti-A, ni avec l'anti-B : il est du groupe O. Seul Jean NEYMAR est du groupe O : son groupe est compatible avec le sang retrouvé." },
  { id: "d2", lvl: "mid", title: "Génotype et phénotype",
    widget: { title: "Simulation · La machine à groupes sanguins", w: "allele", sim: "Modèle simplifié" },
    parts: [
      { t: "rows", c: "mod", label: "Quel est le groupe sanguin (phénotype) correspondant à chaque génotype ?", choices: ["A", "B", "AB", "O"], rows: [{ txt: "A/O", a: 0 }, { txt: "O/O", a: 3 }, { txt: "A/B", a: 2 }, { txt: "B/O", a: 1 }, { txt: "A/A", a: 0 }] },
      { t: "choice", c: "rais", label: "Faut-il deux allèles A pour être du groupe A ?", o: ["Non : un seul allèle A suffit, car il est dominant sur l'allèle O", "Oui : il faut toujours deux allèles identiques", "Non : il faut un allèle A et un allèle B"], a: 0 },
      { t: "word", c: "conn", label: `L'allèle O ne s'exprime que s'il est présent deux fois : il est ${gap}.`, ans: ["récessif", "recessif"], err: [[["dominant"], "Un allèle dominant s'exprime même s'il n'est présent qu'une seule fois."]] },
      { t: "word", c: "conn", label: `L'ensemble des allèles d'un individu forme son ${gap}.`, ans: ["génotype"], spell: true, err: [[["phénotype"], "Le phénotype, ce sont les caractères observables."], [["caryotype"], "Le caryotype, ce sont les chromosomes classés par paires."]] }],
    hints: ["Règle les deux allèles dans la machine et regarde le groupe obtenu.", "L'allèle A commande l'antigène A, l'allèle B l'antigène B, l'allèle O aucun antigène.", "A/O → A · O/O → O · A/B → AB · B/O → B · A/A → A. O est récessif. Mot : génotype."],
    corr: "L'allèle A commande la fabrication de l'antigène A, l'allèle B celle de l'antigène B, et l'allèle O aucun antigène. Un seul allèle A suffit pour être du groupe A : A est dominant sur O, qui est récessif (il doit être présent deux fois pour s'exprimer). A/B donne le groupe AB. L'ensemble des allèles d'un individu forme son génotype." },
  { id: "d3", lvl: "hard", title: "Défi · La famille de Jean", live: "famille", liveTitle: "Arbre de la famille de Jean (groupes sanguins)",
    intro: "Chaque parent ne donne qu'un seul de ses chromosomes n° 9 à chaque enfant lors de la fécondation. L'arbre se complète avec tes réponses.",
    parts: [
      { t: "rows", c: "rais", label: "Quel est le génotype de chaque membre de la famille ?", choices: null, rows: FAM.map((f, i) => ({ txt: `${f[0]} (groupe ${f[2]})`, o: FAMG[i], a: [1, 1, 0, 0, 1][i] })) },
      { t: "choice", c: "rais", label: "Comment sait-on que le papa de Jean porte un allèle O ?", o: ["Jean est O/O : il a reçu un allèle O de chacun de ses parents", "Le groupe B est récessif", "Le papa est du groupe O"], a: 0 },
      { t: "choice", c: "rais", label: "Les deux chromosomes d'une même paire portent-ils forcément les mêmes allèles ?", o: ["Non : la maman porte l'allèle A sur un chromosome et l'allèle O sur l'autre", "Oui, toujours"], a: 0 }],
    hints: ["Commence par Jean : il est du groupe O, et l'allèle O est récessif.", "Jean a reçu un allèle O de son papa et un allèle O de sa maman : chaque parent porte donc un allèle O.", "Papa B/O · Maman A/O · Sœur A/B · Jean O/O · Frère B/O : sa maman n'a pas d'allèle B à lui donner."],
    corr: "Jean est du groupe O : il est O/O et a reçu un allèle O de chacun de ses parents. Le papa (groupe B) est donc B/O et la maman (groupe A) est A/O. La sœur (AB) a reçu A de sa maman et B de son papa : A/B. Le frère (B) a reçu B de son papa et O de sa maman : B/O. Les deux chromosomes d'une paire ne portent pas forcément les mêmes allèles." }] },

{ id: "p5", n: 5, icon: "🔁", tab: "Divisions", title: "Mitose et méiose", sub: "Activités 9 et 10 : comparer les deux divisions, puis un exercice type brevet.",
  items: [
  { id: "e1", lvl: "easy", title: "Comparer mitose et méiose",
    parts: [
      { t: "rows", c: "conn", label: "Complète le tableau comparatif.", choices: null, rows: [
        { txt: "Mitose · nombre de cellules obtenues à partir d'une cellule", o: ["2", "4"], a: 0 }, { txt: "Méiose · nombre de cellules obtenues à partir d'une cellule", o: ["2", "4"], a: 1 },
        { txt: "Méiose · chromosomes dans chaque cellule obtenue, chez l'être humain", o: ["46", "23"], a: 1 }, { txt: "Mitose · chromosomes dans chaque cellule obtenue, chez l'être humain", o: ["46", "23"], a: 0 },
        { txt: "Mitose · les cellules obtenues sont…", o: ["identiques à la cellule de départ", "génétiquement différentes"], a: 0 }, { txt: "Méiose · les cellules obtenues sont…", o: ["identiques à la cellule de départ", "génétiquement différentes"], a: 1 },
        { txt: "Méiose · elle produit…", o: ["des cellules du corps", "des cellules reproductrices"], a: 1 }] },
      { t: "word", c: "conn", label: `Avant une division, chaque chromosome simple fait une copie de lui-même : c'est la ${gap}.`, ans: ["duplication", "réplication"], err: [[["mitose", "méiose", "division"], "On cherche le nom de la copie des chromosomes, pas celui de la division."]] }],
    hints: ["Repense aux schémas bilans des activités 9 et 10.", "Mitose : 1 cellule → 2 cellules. Méiose : 1 cellule → 4 cellules reproductrices.", "Mitose : 2 · 46 · identiques. Méiose : 4 · 23 · différentes · cellules reproductrices. Mot : duplication."],
    corr: "Mitose : une cellule donne 2 cellules à 46 chromosomes, identiques à elle ; ce sont des cellules du corps. Méiose : une cellule donne 4 cellules reproductrices à 23 chromosomes, génétiquement différentes. Avant chaque division, chaque chromosome se copie : c'est la duplication." },
  { id: "e2", lvl: "mid", title: "Mitose ou méiose ?",
    intro: "Chaque image montre une cellule à 2 paires de chromosomes en train de se diviser. Bleu = chromosome venu du père ; rouge rayé = venu de la mère.",
    parts: [{ t: "rows", c: "rais", label: "Mitose ou méiose ?", choices: ["Mitose", "Méiose"], rows: DUO_IMG.map(([k], i) => ({ txt: "Image " + (i + 1), a: k === "mito" ? 0 : 1 })) }],
    hints: ["À la fin d'une mitose : 2 cellules qui ont les 2 paires. À la fin d'une méiose : 4 cellules avec un seul chromosome de chaque paire.", "Méiose I : les deux chromosomes d'une même paire se placent côte à côte, puis s'écartent (des X entiers). Mitose : les chromosomes s'alignent un par un, puis leurs chromatides se séparent.", "Image 1 méiose · 2 mitose · 3 méiose · 4 méiose · 5 mitose · 6 mitose."],
    corr: "Images 1, 3 et 4 : méiose (4 cellules finales à un chromosome de chaque paire ; paires côte à côte ; chromosomes d'une paire qui se séparent). Images 2, 5 et 6 : mitose (chromosomes alignés un par un ; 2 cellules identiques ; chromatides qui se séparent).",
    unlock: { title: "🔓 Animation débloquée · Mitose et méiose côte à côte", w: "duo", sim: "Modèle simplifié" } },
  { id: "e3", lvl: "hard", title: "Exercice type brevet · Le groupe sanguin de Léo", docs: [DOC_LEO], recop: true,
    parts: [
      { t: "multi", c: "rais", label: "Quels spermatozoïdes Monsieur Martin (A/O) peut-il produire ? (plusieurs réponses)", o: ["Des spermatozoïdes portant l'allèle A", "Des spermatozoïdes portant l'allèle O", "Des spermatozoïdes portant A et O", "Des spermatozoïdes portant l'allèle B"], a: [0, 1] },
      { t: "grid", c: "rais", label: "Complète le tableau de croisement : chaque case est une cellule-œuf.", corner: "♀ \\ ♂", rows: [["ovule", "B"], ["ovule", "O"]], cols: [["sperma­tozoïde", "A"], ["sperma­tozoïde", "O"]], chips: GRIDC, ans: [0, 2, 1, 3], ask: "Choisis le génotype de la case" },
      { t: "num", c: "rais", label: "Sur les 4 cases du tableau, combien donnent un enfant du groupe O ?", unit: "case(s)", ans: 1 },
      { t: "choice", c: "rais", label: "Léo peut-il être l'enfant de ce couple ?", o: ["Oui : chacun de ses parents lui a transmis son allèle O", "Non : des parents A et B ne peuvent avoir qu'un enfant AB", "Non : il faudrait qu'un des parents soit du groupe O"], a: 0 }],
    hints: ["La méiose sépare les deux allèles : chaque spermatozoïde porte A ou O, chaque ovule porte B ou O.", "Dans chaque case : l'allèle de l'ovule et celui du spermatozoïde. O/B s'écrit aussi B/O.", "A/B · B/O · A/O · O/O : une case sur quatre donne un enfant O/O, du groupe O."],
    corr: "Lors de la méiose, Monsieur Martin produit des spermatozoïdes portant A ou O, et Madame Martin des ovules portant B ou O. Le tableau de croisement donne quatre génotypes possibles : A/B, B/O, A/O et O/O. Léo, du groupe O, est O/O : il a reçu l'allèle O de son père et l'allèle O de sa mère. C'est possible : une case sur quatre. Ta fiche de révision s'affiche ci-dessous." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement · trois questions éclair",
  parts: [
    { t: "choice", c: "conn", label: "Où se trouve l'information génétique dans une cellule ?", o: ["Dans le noyau", "Dans le cytoplasme", "Dans la membrane"], a: 0 },
    { t: "num", c: "conn", label: "Combien de chromosomes contient un spermatozoïde humain ?", unit: "chromosomes", ans: 23, err: [[v => v === 46, "46, c'est une cellule du corps. La méiose divise ce nombre par deux."]] },
    { t: "choice", c: "conn", label: "Le bronzage est-il un caractère héréditaire ?", o: ["Non : c'est une modification due à l'environnement, qui n'est pas transmise", "Oui : il se transmet aux enfants"], a: 0 }],
  hints: ["Pense à l'expérience de clonage (activité 3).", "Les cellules reproductrices contiennent la moitié des chromosomes d'une cellule du corps.", "Noyau · 23 · non."],
  corr: "L'information génétique est dans le noyau. Un spermatozoïde contient 23 chromosomes. Le bronzage est une modification due à l'environnement : il n'est pas transmis à la descendance." };
const RESUME = `Problème : ${PROBLEM}\n\nMa fiche de révision\n${FICHE.map(([t, x]) => `${t}\n${x.replace(/<\/?u>/g, "")}`).join("\n\n")}`;
typo(GROUPS); typo(RAPPEL);
GROUPS[4].items[1].parts[0].rows.forEach((r, i) => { r.aria = "Image " + (i + 1); r.txt = duoImg(DUO_IMG[i], i); });
