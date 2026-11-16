/* ===== 2nde SVT · Thème 1, chapitre 3 · Rappels + Activité 1, d'après les fiches et le corrigé du professeur ===== */
const PROBLEM = "Comment peut-on affirmer que la biodiversité est en perpétuelle évolution ?";
const gap = `<span class="gap">………</span>`;
const HOME = { slug: "trois-echelles-biodiversite", short: "Les échelles de la biodiversité", last: "c3", lastG: "p3", lastK: 2,
  kicker: "Thème 1 · Chapitre 3 · Biodiversité actuelle et passée · Rappels et activité 1", title: "Les différentes échelles de la biodiversité",
  intro: "La biodiversité, qui signifie diversité biologique, désigne toutes les variations du monde vivant : variations du milieu de vie (biodiversité des écosystèmes), variations des espèces (biodiversité des espèces) et variations des individus d'une même espèce (biodiversité génétique).",
  lab: "Problème du chapitre", goal: "Objectifs de la séance : exploiter des animations ; comparer la diversité biologique à différentes échelles.",
  fact: "La forêt tropicale abrite environ 50 % des espèces connues dans le monde (affiche « Forêts et biodiversité », GoodPlanet).",
  parts: "Les trois parties de la séance (environ une heure)", recop: "Bilan de l'activité",
  txt: "LES DIFFÉRENTES ÉCHELLES DE LA BIODIVERSITÉ\n2nde SVT · Thème 1, chapitre 3 · Rappels et activité 1",
  comps: { conn: "Mobiliser ses connaissances", lire: "Exploiter un document, une animation", mod: "Réaliser une manipulation virtuelle", rais: "Raisonner, argumenter" },
  extra: () => `MES TABLEAUX\nBiodiversité génétique : trois personnes de mon entourage\n${porRows().map(r => "- " + r[0] + " : " + r.slice(1).join(" | ")).join("\n")}\n\nBiodiversité des espèces et des écosystèmes (valeurs simulées)\n${ecoSeen().length ? "- Milieux : " + ecoSeen().map(k => ECO[k].name).join(" | ") + "\n" + ecoRows(ecoSeen()).map(r => "- " + r[0] + " : " + r.slice(1).join(" | ")).join("\n") : "- aucun milieu exploré"}\n`,
  extraHTML: () => `<p class="lead">Trois personnes de mon entourage</p>${tbl(["Caractère", "Personne 1", "Personne 2", "Personne 3"], porRows())}<p class="lead">Mes milieux de vie <span class="sim">⚠ Valeurs simulées</span></p>${ecoSeen().length ? tbl(["", ...ecoSeen().map(k => ECO[k].name)], ecoRows(ecoSeen())) : `<p>Aucun milieu exploré pour l'instant.</p>`}` };

const DOC_CAN = { title: "Document 1 · Cinq canards observés au bord d'un étang", w: "canards", sim: "Dessins simplifiés" };
const DOC_TAB = { title: "Document 4 · Tableau de caractères", html: tbl(["Animal", "Mâchoires", "Doigts", "Mamelles"], [["Requin", "présentes", "absents", "absentes"], ["Sardine", "présentes", "absents", "absentes"], ["Crapaud", "présentes", "présents", "absentes"], ["Crocodile", "présentes", "présents", "absentes"], ["Gorille", "présentes", "présents", "présentes"], ["Homme", "présentes", "présents", "présentes"]]) };
const CLASSE = tbl(["Exemple obtenu dans une classe", "Élève 1", "Élève 2", "Élève 3"], [["Couleur des yeux", "marron foncé", "bleus", "marron"], ["Couleur des cheveux", "noirs", "blonds", "bruns"], ["Texture des cheveux", "raides", "raides", "raides"], ["Groupe sanguin", "A+", "A+", "A"]]);
const BIL = ["La <u>biodiversité</u> est à la fois la <u>diversité des écosystèmes</u>, la <u>diversité des espèces</u> et la <u>diversité génétique</u> au sein des espèces.",
  "<u>Espèce</u> : ensemble d'individus ayant des caractères communs, <u>interféconds</u> (capables de produire une descendance) et dont la descendance est <u>fertile</u>.",
  "Au sein d'une même espèce, il existe une grande diversité de caractères.",
  "Pour chaque milieu étudié, il existe une grande diversité d'espèces vivant dans ce milieu.",
  "Rappel : avec un ensemble de caractères, il est possible de convertir des <u>groupes emboîtés</u> en <u>arbre de parenté</u>. Deux espèces sont d'autant plus proches parentes que leur dernier ancêtre commun est récent."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("");
const E3 = ["Écosystèmes", "Espèces", "Génétique"];

const GROUPS = [
{ id: "p1", n: 1, icon: "🦆", tab: "Espèce", title: "C'est quoi, une espèce ?", sub: "Rappels · environ 15 minutes · deux élevages virtuels pour tester l'interfécondité.",
  items: [
  { id: "a1", lvl: "easy", title: "TP virtuel · Combien d'espèces de canards ?",
    intro: "Regarde ces canards : combien d'espèces identifies-tu ? Donne d'abord ton avis, puis vérifie-le en réalisant des croisements.",
    docs: [DOC_CAN],
    pre: { label: "Ton hypothèse : combien d'espèces vois-tu parmi ces cinq canards ?", o: ["Une seule espèce", "Deux espèces", "Trois espèces", "Cinq espèces"], a: 1 },
    widget: { title: "TP virtuel · La volière : qui peut se reproduire avec qui ?", w: "voliere", sim: "Résultats simulés" },
    parts: [
      { t: "rows", c: "mod", label: "Réalise les six croisements. Que donnent ceux-ci ?", choices: ["Petits fertiles", "Pas de descendance"], rows: [{ txt: "Canard A × canard B", a: 0 }, { txt: "Canard A × canard E", a: 1 }, { txt: "Canard C × canard D", a: 1 }, { txt: "Canard C × canard E", a: 0 }] },
      { t: "multi", c: "rais", label: "Quels canards appartiennent à la même espèce que le canard A ? (plusieurs réponses)", o: ["Canard B", "Canard C", "Canard D", "Canard E"], a: [0, 2] },
      { t: "num", c: "rais", label: "Combien d'espèces y a-t-il parmi ces cinq canards ?", unit: "espèce(s)", ans: 2, err: [[v => v === 5, "Avoir un plumage différent ne suffit pas pour former une espèce : regarde le tableau de tes croisements."], [v => v === 3, "Les canards A, B et D donnent ensemble des petits fertiles : ils ne forment qu'une espèce."]] },
      { t: "choice", c: "rais", label: "Les canards D et E se ressemblent beaucoup. Sont-ils de la même espèce ?", o: ["Oui : deux animaux qui se ressemblent sont toujours de la même espèce", "Non : D se reproduit avec A, E se reproduit avec C, et jamais l'inverse", "On ne peut pas le savoir"], a: 1 }],
    hints: ["Remplis tout le tableau « Mes croisements » : deux mâles, trois femelles, six croisements.", "Regroupe les canards qui donnent ensemble des petits fertiles.", "A donne des petits fertiles avec B et D ; C seulement avec E : il y a deux groupes."],
    corr: "Les canards A, B et D sont interféconds et leur descendance est fertile : ils appartiennent à la même espèce, le canard colvert (A : mâle ; D : femelle ; B : canard domestique blanc, issu du colvert). Les canards C et E forment une deuxième espèce, le canard souchet. Il y a donc deux espèces. Se ressembler ne suffit pas : D et E se ressemblent mais ne sont pas de la même espèce, alors que A et B, très différents, le sont." },
  { id: "a2", lvl: "mid", title: "La définition d'une espèce",
    intro: "Le cheval et l'âne se ressemblent et peuvent avoir un petit ensemble. Sont-ils pour autant de la même espèce ?",
    widget: { title: "TP virtuel · Le pré : cheval et âne", w: "ecurie", sim: "Modèle simplifié" },
    parts: [
      { t: "rows", c: "mod", label: "Réalise les quatre croisements. Que donnent-ils ?", choices: ["Petit fertile", "Petit stérile"], rows: [{ txt: "Étalon × jument", a: 0 }, { txt: "Âne × jument", a: 1 }, { txt: "Âne × ânesse", a: 0 }, { txt: "Étalon × ânesse", a: 1 }] },
      { t: "choice", c: "rais", label: "Le cheval et l'âne appartiennent-ils à la même espèce ?", o: ["Oui : ils se ressemblent et peuvent avoir un petit", "Non : ils ne peuvent avoir aucun petit", "Non : leur petit (mulet ou bardot) est stérile"], a: 2, no: { 0: "Se ressembler et avoir un petit ne suffit pas : regarde ce que devient ce petit une fois adulte.", 1: "Ils ont bien un petit : un mulet ou un bardot." } },
      { t: "word", c: "conn", label: `Des individus capables de se reproduire entre eux sont dits ${gap}.`, ans: ["interféconds", "interfécond", "interfécondes", "inter-féconds", "interfeconds"], spell: true, err: [[["fertiles", "fertile", "féconds"], "Ce mot qualifie un individu ou une descendance. Ici, on cherche le mot qui signifie « féconds entre eux »."]] },
      { t: "word", c: "conn", label: `Pour qu'ils soient de la même espèce, il faut aussi que leur descendance soit ${gap}.`, ans: ["fertile", "fertiles", "féconde", "fécondes"], err: [[["stérile", "steriles"], "C'est le contraire : stérile signifie « qui ne peut pas avoir de petits »."]] }],
    hints: ["Dans le pré, observe bien la deuxième génération : le petit, devenu adulte, a-t-il des petits à son tour ?", "Le mot cherché commence par « inter » : féconds entre eux.", "Interféconds · descendance fertile. Le mulet est stérile : cheval et âne sont deux espèces."],
    corr: "Espèce : ensemble d'individus ayant des caractères communs, interféconds (capables de produire une descendance) et dont la descendance est fertile. Le cheval et l'âne ont un petit, le mulet, mais il est stérile : ce sont deux espèces différentes. Compare cette définition avec celle de ton livre (page 79)." }] },

{ id: "p2", n: 2, icon: "🌿", tab: "Classer", title: "Classer les êtres vivants et retrouver leurs parentés", sub: "Rappels · environ 15 minutes · des groupes emboîtés à l'arbre de parenté.",
  items: [
  { id: "b1", lvl: "easy", title: "Lire une classification en groupes emboîtés",
    docs: [{ title: "Document 2 · Classification simplifiée des végétaux", w: "embVeg", sim: "Document à explorer" }, { title: "Document 3 · Classification simplifiée des vertébrés", w: "embVert", sim: "Document à explorer" }],
    parts: [
      { t: "multi", c: "lire", label: "Document 2 : quels caractères sont présents chez la fougère ? (plusieurs réponses)", o: ["Chlorophylle", "Fleurs et fruits", "Tige et feuilles", "Graines", "Racines et vaisseaux conducteurs"], a: [0, 2, 4] },
      { t: "multi", c: "lire", label: "Document 3 : quels caractères sont présents chez les amphibiens ? (plusieurs réponses)", o: ["Poils et mamelles", "Crâne et vertèbres", "Doigts", "Amnios", "Mâchoires", "Squelette osseux"], a: [1, 2, 4, 5] },
      { t: "choice", c: "lire", label: "Quel caractère le pin possède-t-il en plus de la fougère ?", o: ["La chlorophylle", "Les fleurs et les fruits", "Les graines"], a: 2 }],
    hints: ["Un être vivant possède tous les caractères des boîtes qui le contiennent.", "Pars de la fougère (ou du crapaud) et remonte vers l'extérieur : note le nom de chaque boîte traversée.", "Fougère : 3 caractères. Amphibiens : 4 caractères. Le pin est dans une boîte de plus que la fougère."],
    corr: "La fougère possède la chlorophylle, une tige et des feuilles, des racines et des vaisseaux conducteurs ; elle n'a ni graines, ni fleurs, ni fruits. Les amphibiens possèdent un crâne et des vertèbres, des mâchoires, un squelette osseux et des doigts ; ils n'ont ni amnios, ni poils, ni mamelles. Le pin possède, en plus de la fougère, des graines." },
  { id: "b2", lvl: "mid", title: "Construire des groupes emboîtés",
    intro: "Avec un ensemble de caractères, il est possible de convertir des groupes emboîtés en arbre de parenté. Commence par construire les groupes emboîtés pour trois caractères : mâchoires, doigts et mamelles.",
    docs: [DOC_TAB], live: "boites", liveTitle: "Ta classification en groupes emboîtés (elle se remplit avec tes réponses)",
    parts: [
      { t: "rows", c: "mod", label: "Range chaque animal dans la plus petite boîte possible.", choices: BOXN, rows: [{ txt: "Sardine", a: 0 }, { txt: "Crapaud", a: 1 }, { txt: "Gorille", a: 2 }, { txt: "Requin", a: 0 }, { txt: "Crocodile", a: 1 }, { txt: "Homme", a: 2 }] },
      { t: "choice", c: "rais", label: "Un animal rangé dans la boîte « Mamelles » possède…", o: ["uniquement des mamelles", "des mamelles et des doigts, mais pas de mâchoires", "des mâchoires, des doigts et des mamelles"], a: 2 }],
    hints: ["La boîte « Mâchoires » contient la boîte « Doigts », qui contient la boîte « Mamelles ».", "Un animal sans doigts ne peut pas entrer dans la boîte « Doigts » : il reste dans « Mâchoires ».", "Mâchoires : sardine, requin. Doigts : crapaud, crocodile. Mamelles : gorille, homme."],
    corr: "La sardine et le requin n'ont que les mâchoires. Le crapaud et le crocodile ont des mâchoires et des doigts. Le gorille et l'homme ont des mâchoires, des doigts et des mamelles : ils sont rangés dans les trois boîtes à la fois.",
    unlock: { title: "🔓 Animation débloquée · Des groupes emboîtés à l'arbre de parenté", w: "morph", sim: "Modèle simplifié" } },
  { id: "b3", lvl: "hard", title: "Lire un arbre de parenté",
    widget: { title: "Document 5 · Arbre de parenté construit à partir des groupes emboîtés", w: "arbre", sim: "Document à explorer" },
    parts: [
      { t: "choice", c: "lire", label: "Entre la sardine et le crocodile, quelle espèce est la plus proche du gorille ?", o: ["La sardine", "Le crocodile", "Elles sont aussi proches l'une que l'autre"], a: 1 },
      { t: "num", c: "lire", label: "Combien de caractères de cet arbre le crocodile partage-t-il avec le gorille ?", unit: "caractère(s)", ans: 2, err: [[v => v === 3, "Le crocodile n'a pas de mamelles."], [v => v === 1, "Compte tous les traits de couleur situés entre la base de l'arbre et leur dernier ancêtre commun."]] },
      { t: "choice", c: "rais", label: "Quelle justification est correcte ?", o: ["Le crocodile et le gorille vivent tous les deux hors de l'eau", "La sardine et le gorille partagent l'ancêtre commun 1, le plus ancien : ce sont donc les plus proches", "Le crocodile et le gorille partagent un ancêtre commun plus récent (l'ancêtre commun 2), qui leur a transmis les doigts"], a: 2, no: { 0: "Le milieu de vie n'est pas un argument de parenté : on raisonne sur les ancêtres communs et les caractères hérités.", 1: "C'est l'inverse : plus le dernier ancêtre commun est récent, plus les espèces sont proches." } }],
    hints: ["Sur le document, touche « Gorille » puis « Sardine », et ensuite « Gorille » puis « Crocodile ».", "Compare les deux ancêtres communs obtenus : lequel est le plus proche du bout des branches ?", "Gorille et crocodile : ancêtre commun 2 (mâchoires et doigts). Gorille et sardine : ancêtre commun 1 (mâchoires seulement)."],
    corr: "Le crocodile est plus proche du gorille que la sardine. Le gorille et le crocodile partagent l'ancêtre commun 2, qui leur a transmis les doigts : ils ont deux caractères en commun (mâchoires et doigts). Le gorille et la sardine ne partagent que l'ancêtre commun 1, plus ancien : ils n'ont en commun que les mâchoires." }] },

{ id: "p3", n: 3, icon: "🌍", tab: "Échelles", title: "Les différentes échelles de la biodiversité", sub: "Activité 1 · environ 30 minutes · individus, espèces, écosystèmes.",
  items: [
  { id: "c1", lvl: "easy", title: "La biodiversité génétique",
    intro: "En prenant appui sur l'espèce humaine, montre qu'il existe une variabilité des individus au sein d'une même espèce.",
    widget: { title: "À toi · Décris trois personnes de ton entourage", w: "portraits", sim: "Reste sur cet appareil" },
    parts: [
      { t: "task", c: "mod", label: "Complète le portrait des trois personnes (quatre caractères chacune).", okMsg: "Tableau complet.", done: () => ({ ok: porCount() === 12, msg: `${porCount()}/12 cases du tableau remplies.` }) },
      { t: "choice", c: "rais", label: "Que montre ton tableau ?", o: ["Tous les individus d'une même espèce sont identiques", "Au sein d'une même espèce, il existe une grande diversité de caractères", "Chaque personne appartient à une espèce différente"], a: 1 },
      { t: "choice", c: "conn", label: "À quoi est due cette variabilité des individus d'une même espèce ?", o: ["Les individus possèdent les mêmes gènes, mais pas les mêmes versions de ces gènes : les allèles", "Les individus n'ont pas le même nombre de chromosomes", "Les individus ne vivent pas dans le même milieu de vie"], a: 0, no: { 1: "Tous les êtres humains ont 46 chromosomes.", 2: "Le milieu de vie n'explique ni la couleur des yeux ni le groupe sanguin." } }],
    hints: ["Choisis une personne, puis une réponse pour chacun des quatre caractères.", "Compare les trois colonnes de ton tableau : sont-elles identiques ?", "Souviens-toi de la classe de troisième : un gène existe en plusieurs versions, les allèles."],
    corr: "Grâce au tableau, on peut constater qu'au sein d'une même espèce, il existe une grande diversité de caractères. Cette variabilité est due aux allèles : tous les individus d'une espèce possèdent les mêmes gènes, mais pas les mêmes versions de ces gènes. C'est la biodiversité génétique.",
    corrx: CLASSE,
    unlock: { title: "🔓 Simulation débloquée · Une classe tirée au hasard", w: "classe", sim: "Tirage simulé" } },
  { id: "c2", lvl: "mid", title: "TP virtuel · La biodiversité des espèces et des écosystèmes",
    intro: "À partir de deux milieux de vie (le lac, obligatoire, et un milieu terrestre au choix), construis un tableau qui montre la diversité des milieux de vie et la diversité des espèces.",
    widget: { title: "TP virtuel · Explorer deux milieux de vie", w: "eco", sim: "Valeurs simulées" },
    parts: [
      { t: "task", c: "mod", label: "Dans le lac et dans un milieu terrestre : fais les trois mesures et identifie au moins cinq espèces.", okMsg: "Tableau complet pour deux milieux.", done: ecoDone },
      { t: "choice", c: "lire", label: "D'après tes mesures, dans quel milieu la température est-elle la plus basse ?", o: ["Dans le milieu terrestre", "Dans le lac", "Elle est identique dans les deux milieux"], a: 1 },
      { t: "choice", c: "rais", label: "Température, luminosité, humidité : que montrent tes relevés ?", o: ["Les conditions de vie diffèrent d'un milieu à l'autre : il existe une diversité des milieux de vie (écosystèmes)", "Les conditions de vie sont les mêmes partout", "Les conditions de vie ne dépendent que des espèces présentes"], a: 0 },
      { t: "choice", c: "rais", label: "Que montre la liste des espèces relevées dans chaque milieu ?", o: ["Chaque milieu n'abrite qu'une seule espèce", "Les mêmes espèces vivent dans tous les milieux", "Pour chaque milieu étudié, il existe une grande diversité d'espèces vivant dans ce milieu"], a: 2 }],
    hints: ["Les trois boutons de mesure sont au-dessus du paysage. Touche ensuite les êtres vivants marqués d'un « ? ».", "Change de milieu avec les boutons « Lac », « Forêt », « Champ » : tes relevés sont conservés.", "Lis ton tableau colonne par colonne : les conditions de vie changent, et les espèces aussi."],
    corr: "Les conditions de vie (température, luminosité, humidité) ne sont pas les mêmes dans le lac et dans le milieu terrestre : il existe une diversité des milieux de vie, ou écosystèmes. Dans le tableau, on peut voir que pour chaque milieu étudié, il existe une grande diversité d'espèces vivant dans ce milieu." },
  { id: "c3", lvl: "hard", title: "Le bilan : trois échelles", recop: true,
    parts: [
      { t: "rows", c: "rais", label: "À quelle échelle de la biodiversité chaque observation correspond-elle ?", choices: E3, rows: [
        { txt: "Un lac, une forêt et un champ n'offrent pas les mêmes conditions de vie", a: 0 },
        { txt: "Dans le lac vivent la perche, la grenouille verte, le cygne, la limnée…", a: 1 },
        { txt: "Trois élèves n'ont ni les mêmes yeux, ni les mêmes cheveux, ni le même groupe sanguin", a: 2 },
        { txt: "Les canards A, B et D n'ont pas le même plumage, mais appartiennent à la même espèce", a: 2 },
        { txt: "La forêt tropicale abrite environ 50 % des espèces connues dans le monde", a: 1 }] },
      { t: "choice", c: "conn", label: "La biodiversité, c'est…", o: ["uniquement le nombre d'espèces d'un milieu", "à la fois la diversité des écosystèmes, la diversité des espèces et la diversité génétique au sein des espèces", "la diversité des animaux, sans les végétaux"], a: 1 }],
    hints: ["Trois échelles : les milieux de vie, les espèces, les individus d'une même espèce.", "Des individus différents au sein d'une même espèce : c'est la diversité génétique.", "Écosystèmes · espèces · génétique · génétique · espèces."],
    corr: "La biodiversité est à la fois la diversité des écosystèmes, la diversité des espèces et la diversité génétique au sein des espèces.",
    unlock: { title: "🔓 Animation débloquée · Le zoom sur la biodiversité", w: "zoom", sim: "Modèle simplifié" } }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Le mot « biodiversité » signifie…", o: ["nombre d'animaux sur Terre", "diversité biologique", "biologie des milieux"], a: 1 },
    { t: "choice", c: "conn", label: "Au collège, tu as classé les êtres vivants en groupes emboîtés. Sur quoi ce classement repose-t-il ?", o: ["Sur les caractères que les êtres vivants partagent", "Sur leur milieu de vie", "Sur leur taille"], a: 0 }],
  hints: ["Relis l'introduction, juste au-dessus.", "On range dans une même boîte les êtres vivants qui possèdent un même caractère.", "Diversité biologique · les caractères partagés."],
  corr: "La biodiversité est la diversité biologique : toutes les variations du monde vivant. Pour classer les êtres vivants, on utilise les caractères qu'ils partagent." };
/* ===== VERSION LYCÉE : mêmes documents et mêmes TP virtuels, moins de questions, réponses rédigées =====
   Chaque réponse rédigée a des « éléments attendus » (crit) repérés par mots-clés dans le texte sans accents
   (T : casse conservée ; n : minuscules). Un point par élément repéré au premier essai. */
const duckLetters = T => new Set([...(T.match(/\b[A-E]\b(?!')/g) || []), ...(T.match(/canards? [a-e]\b(?!')/gi) || []).map(x => x.slice(-1).toUpperCase())]).size;
const SPK = ["perche", "grenouille", "cygne", "canard", "limnee", "ecrevisse", "moustique", "roseau", "chene", "chouette", "ecureuil", "cerf", "renard", "fougere", "amanite", "fourmi", "bles?\\b", "tournesol", "lapin", "abeille", "coccinelle", "pieride", "papillon", "campagnol", "sauterelle"];
const spCount = n => SPK.filter(k => new RegExp("\\b" + k).test(n)).length;
const fertileSaid = (T, n) => /fertil|descendance (\w+ ){0,2}feconde/.test(n.replace(/(non|pas|in)[ -]?fertil\w*/g, " "));
const lumPairs = () => { const ks = Object.keys(ECO).filter(k => S.eco[k] && S.eco[k].m && S.eco[k].m.l), out = []; ks.forEach(a => ks.forEach(b => { const x = ECO[a].cond.l[1], y = ECO[b].cond.l[1]; if (x > y) out.push([x, y]); })); return out; };
const LYCEE = {
r0: { parts: [
    { t: "word", c: "conn", label: `Le mot « biodiversité » signifie ${gap} (deux mots).`, ans: ["diversité biologique", "diversité du vivant", "diversité du monde vivant"] },
    { t: "word", c: "conn", label: `Au collège, tu as classé les êtres vivants en groupes emboîtés. Ce classement repose sur les ${gap} qu'ils partagent.`, ans: ["caractères", "attributs"], err: [[["milieu", "milieux de vie", "taille"], "Ni le milieu de vie ni la taille : on regarde ce que les êtres vivants possèdent en commun."]] }],
  hints: ["Relis l'introduction, juste au-dessus.", "On range dans une même boîte les êtres vivants qui possèdent un même…", "Diversité biologique · les caractères."] },
a1: { pre: { label: "Ton hypothèse : combien d'espèces vois-tu parmi ces cinq canards ?", num: true, n: 2, unit: "espèce(s)" },
  parts: [
    { t: "task", c: "mod", label: "Réalise les six croisements possibles dans la volière.", okMsg: "Six croisements réalisés.", done: () => { const n = Object.keys(S.cross.can || {}).length; return { ok: n >= 6, msg: `${n}/6 croisements réalisés.` }; } },
    { t: "num", c: "rais", label: "Combien d'espèces y a-t-il parmi ces cinq canards ?", unit: "espèce(s)", ans: 2, err: [[v => v === 5, "Avoir un plumage différent ne suffit pas pour former une espèce : regarde le tableau de tes croisements."], [v => v === 3, "Les canards A, B et D donnent ensemble des petits fertiles : ils ne forment qu'une espèce."]] },
    { t: "redac", c: "rais", min: 25, label: "Justifie ce nombre à partir de tes croisements, puis explique pourquoi les canards D et E, qui se ressemblent beaucoup, ne sont pas de la même espèce.",
      crit: [{ g: "vois", lab: "Tu t'appuies sur des croisements précis, en nommant les canards par leur lettre", re: [T => duckLetters(T) >= 2] },
        { g: "vois", lab: "Tu donnes le résultat de ces croisements", re: [/fertil|descendan|petits|caneton|oeuf|se reprodui|reproduction/] },
        { g: "sais", lab: "Tu rappelles ce qui définit une espèce", re: [/interfecond|inter-fecond|meme espece(\W+\w+){0,10}\W+(fertil|se reprodui)|(fertil|se reprodui\w*)(\W+\w+){0,10}\W+meme espece|une espece (est|c'est|regroupe|rassemble)/] },
        { g: "deduis", lab: "Tu conclus sur le nombre d'espèces", re: [/\b(2|deux) (especes|groupes)/] },
        { g: "deduis", lab: "Tu traites le cas des canards D et E", re: [/ressembl|apparence|plumage|aspect|physique|semblable|pareil|identique/, /ne suffi|pas suffisant|pas un critere|meme si|malgre|pourtant|alors qu|bien qu|\bmais\b|cependant|jamais/] }],
      model: "Je vois que le canard A donne des petits fertiles avec les canards B et D, mais aucune descendance avec E ; le canard C ne donne des petits fertiles qu'avec E. Je sais que les individus d'une même espèce sont interféconds et que leur descendance est fertile. J'en déduis qu'il y a deux espèces : A, B et D d'une part, C et E d'autre part. D et E se ressemblent, mais D se reproduit avec A et E avec C, jamais l'inverse : se ressembler ne suffit pas pour appartenir à la même espèce." }],
  hints: ["Remplis tout le tableau « Mes croisements » avant de rédiger : deux mâles, trois femelles, six croisements.", "Construis ta réponse en trois temps : je vois (des croisements précis et leur résultat) → je sais (ce qui définit une espèce) → j'en déduis (le nombre d'espèces, puis le cas de D et E).", "A donne des petits fertiles avec B et D ; C seulement avec E. Les individus d'une même espèce sont interféconds et leur descendance est fertile : il y a deux espèces, et se ressembler ne suffit pas."] },
a2: { parts: [
    { t: "task", c: "mod", label: "Réalise les quatre croisements possibles dans le pré.", okMsg: "Quatre croisements réalisés.", done: () => { const n = Object.keys(S.cross.equ || {}).length; return { ok: n >= 4, msg: `${n}/4 croisements réalisés.` }; } },
    { t: "redac", c: "rais", min: 20, label: "Le cheval et l'âne appartiennent-ils à la même espèce ? Argumente à partir de tes croisements.",
      crit: [{ g: "vois", lab: "Tu nommes le petit obtenu en croisant un cheval et un âne", re: [/mulet|\bmules?\b|bardot|hybride/] },
        { g: "vois", lab: "Tu précises ce que devient ce petit une fois adulte", re: [/steril|infertil|non fertil|pas fertil|pas (de |avoir de |avoir des |d')?(petits|descendan)|pas se reprodui|ne se reprodui|incapable/] },
        { g: "sais", lab: "Tu rappelles la condition que doit remplir la descendance au sein d'une espèce", re: [fertileSaid] },
        { g: "deduis", lab: "Tu conclus clairement", re: [/(2|deux) especes|especes? (\w+ ){0,2}different|pas (\w+ ){0,2}la meme espece|pas de meme espece|n'appartiennent pas/] }],
      model: "Je vois que le croisement d'un cheval et d'un âne donne un petit, le mulet (ou le bardot), mais que ce petit est stérile. Je sais que, dans une même espèce, la descendance est fertile. J'en déduis que le cheval et l'âne appartiennent à deux espèces différentes." },
    { t: "redac", c: "conn", min: 10, label: "Rédige la définition d'une espèce.",
      crit: [{ g: "sais", lab: "Première idée : ce que ces individus ont en commun", re: [/caractere|ressembl|commun/] },
        { g: "sais", lab: "Deuxième idée : la reproduction entre eux", re: [/interfecond|inter-fecond|se reprodui|produire une descendance|avoir (des|une) (petits|descendance)|reproduction/] },
        { g: "sais", lab: "Troisième idée : la condition sur leur descendance", re: [fertileSaid] }],
      model: "Espèce : ensemble d'individus ayant des caractères communs, interféconds (capables de produire une descendance) et dont la descendance est fertile." }],
  hints: ["Dans le pré, observe bien la deuxième génération : le petit, devenu adulte, a-t-il des petits à son tour ?", "Une définition d'espèce tient en trois idées : ce que les individus ont en commun, leur reproduction entre eux, et une condition sur leur descendance.", "Le mulet (ou le bardot) est stérile : le cheval et l'âne sont deux espèces. Espèce : caractères communs, individus interféconds, descendance fertile."] },
b1: { parts: [
    { t: "list", c: "lire", label: "Document 2 : cite tous les caractères présents chez la fougère.", ph: "caractère 1, caractère 2, …", need: [{ re: /chlorophyl/ }, { re: /tige|feuill/ }, { re: /racine|vaisseau/ }], bad: [{ re: /graine/ }, { re: /fleur|fruit/ }] },
    { t: "list", c: "lire", label: "Document 3 : cite tous les caractères présents chez les amphibiens.", ph: "caractère 1, caractère 2, …", need: [{ re: /crane|vertebre/ }, { re: /machoire/ }, { re: /squelette|osseu|\bos\b/ }, { re: /doigt/ }], bad: [{ re: /amnios/ }, { re: /poil|mamelle/ }] },
    { t: "word", c: "lire", label: "Quel caractère le pin possède-t-il en plus de la fougère ?", ans: ["graines"], err: [[["fleurs", "fruits", "fleurs et fruits"], "Les fleurs et les fruits sont dans la boîte suivante : le pin n'y est pas rangé."], [["chlorophylle", "tige", "feuilles", "racines"], "La fougère possède déjà ce caractère."]] }] },
b2: { parts: [
    { t: "rows", c: "mod", label: "Range chaque animal dans la plus petite boîte possible.", choices: BOXN, rows: [{ txt: "Sardine", a: 0 }, { txt: "Crapaud", a: 1 }, { txt: "Gorille", a: 2 }, { txt: "Requin", a: 0 }, { txt: "Crocodile", a: 1 }, { txt: "Homme", a: 2 }] },
    { t: "list", c: "rais", label: "Cite tous les caractères que possède un animal rangé dans la boîte « Mamelles ».", ph: "caractère 1, caractère 2, …", need: [{ re: /machoire/ }, { re: /doigt/ }, { re: /mamelle/ }] }] },
b3: { parts: [
    { t: "word", c: "lire", label: "Entre la sardine et le crocodile, quelle espèce est la plus proche parente du gorille ?", ans: ["crocodile"], err: [[["sardine"], "Compare leurs derniers ancêtres communs avec le gorille : lequel est le plus récent ?"]] },
    { t: "num", c: "lire", label: "Combien de caractères de cet arbre le crocodile partage-t-il avec le gorille ?", unit: "caractère(s)", ans: 2, err: [[v => v === 3, "Le crocodile n'a pas de mamelles."], [v => v === 1, "Compte tous les traits de couleur situés entre la base de l'arbre et leur dernier ancêtre commun."]] },
    { t: "redac", c: "rais", min: 20, label: "Justifie ta réponse à l'aide de l'arbre de parenté.",
      crit: [{ g: "vois", lab: "Tu repères les derniers ancêtres communs sur l'arbre", re: [/ancetre/] },
        { g: "vois", lab: "Tu cites le caractère que le gorille et le crocodile ont hérité de leur dernier ancêtre commun", re: [/doigt/] },
        { g: "sais", lab: "Tu énonces la règle qui relie ancêtre commun et parenté", re: [/ancetre/, /recent|ancien|\btard/] },
        { g: "deduis", lab: "Tu conclus", re: [/crocodile/, /proche|parent/] }],
      model: "Je vois que le gorille et le crocodile partagent l'ancêtre commun 2, qui leur a transmis les doigts, alors que le gorille et la sardine ne partagent que l'ancêtre commun 1, plus ancien (mâchoires seulement). Je sais que deux espèces sont d'autant plus proches parentes que leur dernier ancêtre commun est récent. J'en déduis que le crocodile est plus proche parent du gorille que la sardine." }],
  hints: ["Sur le document, touche « Gorille » puis « Sardine », et ensuite « Gorille » puis « Crocodile ».", "Compare les deux derniers ancêtres communs obtenus, puis rédige : je vois (ancêtres communs, caractère hérité) → je sais (la règle) → j'en déduis.", "Gorille et crocodile : ancêtre commun 2 (mâchoires et doigts). Gorille et sardine : ancêtre commun 1 (mâchoires seulement). Plus le dernier ancêtre commun est récent, plus les espèces sont proches."] },
c1: { parts: [
    { t: "task", c: "mod", label: "Complète le portrait des trois personnes (quatre caractères chacune).", okMsg: "Tableau complet.", done: () => ({ ok: porCount() === 12, msg: `${porCount()}/12 cases du tableau remplies.` }) },
    { t: "redac", c: "rais", min: 20, label: "Que montre ton tableau ? Explique l'origine de cette variabilité.",
      crit: [{ g: "vois", lab: "Tu décris ton tableau en citant au moins un caractère observé", re: [/yeux|cheveux|sanguin/] },
        { g: "sais", lab: "Tu précises ce que tous les individus d'une espèce possèdent en commun", re: [/memes? genes?/] },
        { g: "sais", lab: "Tu donnes l'origine de cette variabilité", re: [/allele|versions? (\w+ ){0,3}genes?/] },
        { g: "deduis", lab: "Tu conclus sur les individus d'une même espèce", re: [/divers|variab|variation|different|varie|pas (tous )?(les )?memes|pas identique|unique/, /espece|individu|humain|personne/] }],
      model: "Je vois dans mon tableau que les trois personnes n'ont pas toutes la même couleur d'yeux, les mêmes cheveux ou le même groupe sanguin. Je sais que tous les individus d'une espèce possèdent les mêmes gènes, mais pas les mêmes versions de ces gènes : les allèles. J'en déduis qu'au sein d'une même espèce, il existe une grande diversité de caractères, due aux allèles : c'est la biodiversité génétique." }],
  hints: ["Choisis une personne, puis une réponse pour chacun des quatre caractères.", "Je vois : compare les trois colonnes de ton tableau. Je sais : souviens-toi de la classe de troisième, un gène existe en plusieurs versions.", "Les individus d'une espèce ont les mêmes gènes, mais pas les mêmes allèles : d'où la diversité des caractères au sein d'une espèce."] },
c2: { parts: [
    { t: "task", c: "mod", label: "Dans le lac et dans un milieu terrestre : fais les trois mesures et identifie au moins cinq espèces.", okMsg: "Tableau complet pour deux milieux.", done: ecoDone },
    { t: "num", c: "lire", tol: 0.05, label: "Calcul : compare la luminosité de tes deux milieux. Combien de fois est-elle plus forte dans le plus lumineux que dans l'autre ?", unit: "fois plus forte", ans: () => { const r = lumPairs().map(([x, y]) => x / y); return r.length ? r : [NaN]; },
      err: [[v => lumPairs().some(([x, y]) => v === x - y), "Tu as calculé une différence. On demande un rapport : divise la plus grande luminosité par la plus petite."], [v => v > 0 && v < 1, "Divise la plus grande valeur par la plus petite : le résultat doit être supérieur à 1."]] },
    { t: "redac", c: "rais", min: 25, label: "Rédige la conclusion de ton tableau : que montre-t-il sur les milieux de vie, puis sur les espèces ?",
      crit: [{ g: "vois", lab: "Tu cites au moins une condition de vie mesurée", re: [/temperature|luminosite|lumiere|humidite|\blux\b|°c|degre/] },
        { g: "vois", lab: "Tu cites au moins deux espèces relevées", re: [(T, n) => spCount(n) >= 2] },
        { g: "deduis", lab: "Tu conclus sur les milieux de vie", re: [/condition|milieu|ecosysteme/, /different|divers|varie|variation|pas les memes|change|differe/] },
        { g: "deduis", lab: "Tu conclus sur les espèces de chaque milieu", re: [/espece/, /divers|plusieurs|nombreuses|beaucoup|different|variete|multiple|grand nombre/] }],
      model: "Je vois que la température, la luminosité et l'humidité ne sont pas les mêmes dans le lac et dans le milieu terrestre : j'en déduis qu'il existe une diversité des milieux de vie (écosystèmes). Je vois aussi que chaque milieu abrite plusieurs espèces (dans le lac : la perche, la grenouille verte, le cygne…) : j'en déduis que, pour chaque milieu étudié, il existe une grande diversité d'espèces." }],
  corr: "Les conditions de vie (température, luminosité, humidité) ne sont pas les mêmes dans le lac et dans le milieu terrestre : il existe une diversité des milieux de vie, ou écosystèmes. Dans le tableau, on peut voir que pour chaque milieu étudié, il existe une grande diversité d'espèces vivant dans ce milieu. Calcul (valeurs simulées) : lac et forêt, 20 000 ÷ 2 000 = 10 ; champ et lac, 80 000 ÷ 20 000 = 4.",
  hints: ["Les trois boutons de mesure sont au-dessus du paysage. Touche ensuite les êtres vivants marqués d'un « ? ».", "Calcul : un rapport, c'est la plus grande valeur divisée par la plus petite. Conclusion : traite d'abord les conditions de vie, puis les espèces.", "Lis ton tableau colonne par colonne : les conditions de vie changent d'un milieu à l'autre (diversité des écosystèmes), et chaque milieu abrite plusieurs espèces (diversité des espèces)."] },
c3: { parts: [
    { t: "redac", c: "rais", min: 30, label: "Rédige le bilan de la séance : définis la biodiversité en citant ses trois échelles, et illustre chacune par un exemple rencontré pendant la séance.",
      crit: [{ g: "sais", lab: "Tu cites l'échelle des milieux de vie", re: [/ecosysteme|milieux? de vie|milieux/] },
        { g: "sais", lab: "Tu cites l'échelle des espèces", re: [/(des|d'|les) ?especes|diversite specifique/] },
        { g: "sais", lab: "Tu cites l'échelle des individus d'une même espèce", re: [/genetique|allele|individus/] },
        { g: "vois", lab: "Tu illustres avec un milieu ou des espèces de la séance", re: [(T, n) => /\blacs?\b|foret|champ/.test(n) || spCount(n) >= 1] },
        { g: "vois", lab: "Tu illustres la diversité au sein d'une espèce avec un exemple de la séance", re: [/yeux|cheveux|sanguin|plumage|colvert|canards? [abd]\b|personnes|eleves|entourage/] }],
      model: "La biodiversité est à la fois la diversité des écosystèmes (un lac, une forêt et un champ n'offrent pas les mêmes conditions de vie), la diversité des espèces (dans le lac vivent la perche, la grenouille verte, le cygne…) et la diversité génétique au sein des espèces (trois personnes n'ont ni les mêmes yeux, ni les mêmes cheveux, ni le même groupe sanguin)." }],
  hints: ["Trois échelles : les milieux de vie, les espèces, les individus d'une même espèce.", "Pour chaque échelle, donne un exemple rencontré pendant la séance : les milieux explorés, les espèces relevées, tes trois portraits ou les canards.", "Écosystèmes (lac, forêt, champ) · espèces (perche, cygne…) · génétique (yeux, cheveux, groupe sanguin différents au sein de l'espèce humaine)."] }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (LYCEE[it.id]) it.L = LYCEE[it.id]; });
const RESUME = `Problème du chapitre : ${PROBLEM}\n${HOME.goal}\n\nÀ retenir\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
