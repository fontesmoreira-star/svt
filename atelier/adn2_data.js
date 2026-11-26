/* ===== 3e SVT · Chapitre 3 · Activité 2 · Des comparaisons d'ADN : contenus =====
   D'après la fiche « Activité 2 : Des comparaisons d'ADN » du professeur (version V2 + guide méthodologique) : document 1 (pourcentages
   d'information génétique en commun avec l'Homme), document 2 (Homme et chimpanzé), classement, arbre de parenté, bilan.
   Les DS « évolution » n'y sont pas repris : ni la question « arguments en faveur d'une parenté étroite de l'Homme et du chimpanzé »,
   ni le tableau du DS 2026 (vache, souris à 85 %, chimpanzé à 98,55 %), ni les matrices de caractères. */
const PROBLEM = "Qu'en est-il de l'ADN humain, comparé à celui des autres espèces ?";
const gap = `<span class="gap">………</span>`;
const HOME = { slug: "comparaisons-adn", short: "Des comparaisons d'ADN", last: "d1", lastG: "p4", lastK: 0, dur: "environ 50 minutes",
  kicker: "Chapitre 3 · Diversité et évolution des êtres vivants · Activité 2", title: "Que révèle l'ADN de l'Homme comparé à celui des autres êtres vivants ?",
  intro: "Les mutations définissent des différences entre les allèles des différents individus. Pourtant, entre deux humains, ces différences sont très faibles au vu de tout le patrimoine génétique. Et entre l'Homme et les autres êtres vivants ?",
  lab: "Le problème à résoudre", goal: "Objectif : comparer des ADN, classer des êtres vivants selon le pourcentage d'information génétique qu'ils ont en commun avec l'Homme, construire un arbre de parenté, puis compléter le bilan.",
  fact: "L'ADN d'une cellule humaine compte environ 3 milliards de paires de lettres (A, T, C, G). 0,1 % de différences entre deux humains, cela représente déjà environ 3 millions de lettres différentes !",
  parts: "Les quatre parties de l'activité", recop: "Fiche mémo à recopier dans le cahier",
  txt: "ACTIVITÉ 2 · DES COMPARAISONS D'ADN\n3e SVT · Chapitre 3 · Diversité et évolution des êtres vivants",
  comps: { lire: "Extraire des informations de documents", mod: "Observer, manipuler", calc: "Calculer", repr: "Représenter des données", conn: "Mobiliser ses connaissances", rais: "Raisonner, argumenter" },
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "Je réponds avec des choix et des étiquettes, pas à pas." },
    l: { icon: "🔬", short: "Exigeante", name: "Version exigeante", q: "exigeante", desc: "Les mêmes documents et manipulations, mais j'écris mes réponses, je calcule seul et je rédige mes explications : je vois → je sais → j'en déduis." } },
  extraTitle: "Mes comparaisons",
  extra: () => `MES COMPARAISONS\n${myCmp().map(x => "- " + x.replace(/<[^>]+>/g, "")).join("\n")}\n`,
  extraHTML: () => `<ul class="ul">${myCmp().map(x => `<li>${nb(x)}</li>`).join("")}</ul>` };
function myCmp() {
  const X = xst(), C = X.cmp || {}, RG = X.rg || {};
  return [...Object.entries(PAIRS).map(([k, P]) => `Comparateur · ${P.lab} : ${C[k] ? `<b>${pairSeq(k).diffs.length}</b> lettre(s) différente(s) sur 1 000, soit <b>${fmt((SEQN - pairSeq(k).diffs.length) / SEQN * 100)} %</b> de ressemblance ⚠ séquences simulées` : "pas encore comparé"}`),
    `Règle de ressemblance : ${SP.filter(s => RG[s.k]).length}/${SP.length} êtres vivants placés`];
}

/* ---------- documents ---------- */
const DOC1 = { title: "Document 1 · Comparaison de l'information génétique portée par l'ADN de l'Homme avec celle d'autres espèces",
  html: `<div class="spg">${SP.map(s => `<div class="spc"><span class="se" aria-hidden="true">${s.e}</span><span class="sn">${spName(s)}</span><span class="sg">${s.grp}</span><span class="sp">${fmt(s.p)} %</span></div>`).join("")}<div class="spc ref"><span class="se" aria-hidden="true">🧍</span><span class="sn">Homme</span><span class="sg">vertébré, mammifère</span><span class="sp">référence</span></div></div>`,
  cap: "Le chiffre indique le pourcentage d'information génétique en commun avec l'Homme." };
const DOC2 = { title: "Document 2 · Des différences et des ressemblances entre l'Homme et le chimpanzé", html: `<p>${nb("L'information génétique de l'Homme et celle du chimpanzé se ressemblent beaucoup (document 1). Mais il existe entre l'Homme et le chimpanzé des différences dans la molécule d'ADN au niveau de 49 régions. Dans l'une de ces régions se trouve un gène impliqué dans le développement du cerveau.")}</p>` };
const DOCM = { title: "Fiche méthode · Construire un arbre de parenté", html: `<ol class="ul meth">
  <li><b>Analyser les données</b> : l'espèce de référence est l'Homme ; repère les pourcentages de ressemblance et classe-les du plus élevé au plus faible.</li>
  <li><b>Organiser les espèces</b> : plus le pourcentage est élevé, plus l'espèce est proche de la référence ; plus il est faible, plus elle est éloignée.</li>
  <li><b>Tracer l'arbre</b> : chaque séparation (nœud •) représente un ancêtre commun hypothétique. Les espèces les plus proches partagent des branches communes plus longtemps ; les plus éloignées se séparent plus tôt.</li></ol>
  <div class="box warn"><p class="lab">⚠ Points importants</p><p>${nb("L'arbre se lit de la base (racine) vers les extrémités. Les longueurs des branches n'ont pas d'importance : seul l'ordre des séparations compte. Chaque nœud donne exactement deux branches.")}</p></div>` };

/* ---------- fiche mémo ---------- */
const BIL = ["Entre deux humains, l'ADN est presque identique : les différences, dues aux mutations, sont <u>très faibles</u> (environ 0,1 %).",
  "Comparer deux ADN, c'est compter les lettres différentes. Pourcentage de ressemblance = nombre de lettres identiques ÷ nombre total de lettres × 100.",
  "La comparaison de l'ADN humain avec celui des autres êtres vivants montre de nombreuses <u>ressemblances</u>. Ceci suggère des <u>liens de parenté</u> entre les êtres vivants.",
  "Deux espèces ont hérité leur ADN d'un <u>ancêtre commun</u> ; depuis leur séparation, des mutations s'accumulent au hasard. Plus le pourcentage de ressemblance est élevé, plus les espèces sont proches.",
  "L'espèce la plus proche de nous du point de vue génétique est le <u>chimpanzé</u> (98,8 % d'information génétique en commun). C'est notre plus proche parent.",
  "Dans un arbre de parenté, chaque nœud (•) représente un <u>ancêtre commun</u> hypothétique ; seul l'ordre des séparations compte, pas la longueur des branches.",
  "L'ADN de l'Homme et celui du chimpanzé diffèrent pourtant dans 49 régions, dont l'une contient un gène impliqué dans le développement du <u>cerveau</u>."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("");

const RANK = ["chimp", "souris", "poisson", "mouche", "haemo"];
const rankRows = () => RANK.map((k, i) => ({ e: String(i + 1), txt: i === 0 ? "1er : le plus proche de l'Homme" : i === 4 ? "5e : le plus éloigné de l'Homme" : `${i + 1}e`, v: `${SPK(k).e} ${SPK(k).nm}` }));
const sepRows = () => SEP.map((k, i) => ({ e: "•", txt: i === 0 ? "1re séparation (la plus ancienne)" : i === 4 ? "5e séparation (la plus récente)" : `${i + 1}e séparation`, v: `${SPK(k).e} ${SPK(k).nm}` }));
const cmpTask = ks => ({ t: "task", c: "mod", label: `Compare l'extrait en entier pour : ${ks.map(k => "« " + PAIRS[k].lab + " »").join(", puis ")}.`, okMsg: "Comparaisons faites.", done: () => { const C = xst().cmp || {}, n = ks.filter(k => C[k]).length; return { ok: n === ks.length, msg: `${n}/${ks.length} comparaison(s) faite(s) en entier.` }; } });

const GROUPS = [
{ id: "p1", n: 1, icon: "🔬", tab: "Le comparateur", title: "Le comparateur d'ADN", sub: "Comparer l'ADN de deux humains, puis de l'Homme et du chimpanzé · environ 12 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "Deux humains, puis l'Homme et le chimpanzé",
    widget: { title: "Manipulation · Le comparateur d'ADN", w: "comparateur", sim: "Séquences simulées" },
    parts: [
      cmpTask(["hum", "chimp"]),
      { t: "num", c: "lire", label: "Combien de lettres différentes entre les deux humains, sur les 1 000 lettres de l'extrait ?", unit: "lettre(s)", ans: () => pairSeq("hum").diffs.length },
      { t: "choice", c: "calc", label: "Pourcentage de ressemblance entre les deux humains = (1 000 − lettres différentes) ÷ 1 000 × 100 = …", o: ["99,9 %", "99 %", "0,1 %"], a: 0, no: { 2: "0,1 %, c'est le pourcentage de différences." } },
      { t: "num", c: "lire", label: "Combien de lettres différentes entre l'Homme et le chimpanzé ?", unit: "lettre(s)", ans: () => pairSeq("chimp").diffs.length },
      { t: "choice", c: "calc", label: "Pourcentage de ressemblance entre l'Homme et le chimpanzé = (1 000 − lettres différentes) ÷ 1 000 × 100 = …", o: ["98,8 %", "88 %", "1,2 %"], a: 0, no: { 2: "1,2 %, c'est le pourcentage de différences." } }],
    hints: ["Choisis « Deux humains », touche « Comparer tout l'extrait » et lis le résultat ; fais de même avec « Homme / chimpanzé ».", "Lettres identiques = 1 000 − lettres différentes. Ressemblance = lettres identiques ÷ 1 000 × 100.", "1 lettre → 999 ÷ 1 000 × 100 = 99,9 % · 12 lettres → 988 ÷ 1 000 × 100 = 98,8 %."],
    corr: "Entre deux humains, 1 lettre sur 1 000 diffère : 99,9 % de ressemblance. Entre l'Homme et le chimpanzé, 12 lettres sur 1 000 diffèrent : 988 ÷ 1 000 × 100 = 98,8 % de ressemblance. ⚠ Séquences simulées, choisies pour respecter les pourcentages réels." }] },

{ id: "p2", n: 2, icon: "📏", tab: "Classer", title: "Classer les êtres vivants", sub: "Document 1 et la règle de ressemblance · environ 10 minutes.",
  items: [
  { id: "b1", lvl: "easy", title: "Du plus proche au plus éloigné de l'Homme", docs: [DOC1],
    widget: { title: "Manipulation · La règle de ressemblance", w: "regle" },
    parts: [
      { t: "task", c: "repr", label: "Place les cinq êtres vivants du document 1 sur la règle.", okMsg: "Les cinq êtres vivants sont placés.", done: () => { const n = SP.filter(s => rgS()[s.k]).length; return { ok: n === SP.length, msg: `${n}/${SP.length} êtres vivants placés.` }; } },
      { t: "match", c: "lire", label: "Classe ces êtres vivants selon le pourcentage d'information génétique qu'ils ont en commun avec l'Homme, du plus proche au plus éloigné.", ask: "Choisis l'être vivant pour la place", rows: rankRows() },
      { t: "multi", c: "lire", label: "D'après le document 1, quels êtres vivants sont, comme l'Homme, des vertébrés mammifères ?", o: ["Chimpanzé commun", "Souris domestique", "Poisson zèbre", "Mouche du vinaigre"], a: [0, 1] },
      { t: "choice", c: "rais", label: "Plus le pourcentage d'information génétique en commun avec l'Homme est élevé…", o: ["plus l'être vivant est génétiquement proche de l'Homme", "plus l'être vivant est grand", "plus l'être vivant vit longtemps"], a: 0 }],
    hints: ["Touche un être vivant, puis touche la règle à l'endroit de son pourcentage (ou écris-le).", "Sur la règle, le plus proche de l'Homme est le plus à droite, près de 100 %.", "Chimpanzé (98,8 %), souris (90 %), poisson zèbre (85 %), mouche du vinaigre (36 %), Haemophilus influenzae (7 %) · mammifères : chimpanzé et souris."],
    corr: "Du plus proche au plus éloigné de l'Homme : chimpanzé commun (98,8 %), souris domestique (90 %), poisson zèbre (85 %), mouche du vinaigre (36 %), Haemophilus influenzae (7 %). Les deux mammifères sont les plus proches. Plus le pourcentage est élevé, plus l'être vivant est génétiquement proche de l'Homme." }] },

{ id: "p3", n: 3, icon: "🌳", tab: "La parenté", title: "Des ressemblances aux liens de parenté", sub: "Deux lignées qui divergent, puis l'arbre de parenté · environ 18 minutes.",
  items: [
  { id: "c1", lvl: "mid", title: "Pourquoi tant de ressemblances ?",
    widget: { title: "Animation · Deux espèces issues d'un ancêtre commun", w: "divergence", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Observe l'ADN des deux espèces peu de temps après la séparation (étapes 1 à 3), puis longtemps après (étape 11 ou 12).", okMsg: "Les deux moments sont observés.", done: () => { const D = xst().dv || {}, n = (D.lo ? 1 : 0) + (D.hi ? 1 : 0); return { ok: n === 2, msg: `${n}/2 moments observés.` }; } },
      { t: "choice", c: "lire", label: "Au moment de la séparation (étape 0), l'ADN des deux espèces…", o: ["est identique : elles l'ont hérité de leur ancêtre commun", "est complètement différent", "n'existe pas encore"], a: 0 },
      { t: "choice", c: "rais", label: "Au fil du temps, les différences entre les deux ADN…", o: ["augmentent, car des mutations s'accumulent au hasard dans chaque lignée", "diminuent", "restent toujours les mêmes"], a: 0 },
      { t: "choice", c: "rais", label: "Deux espèces dont l'ADN se ressemble beaucoup…", o: ["ont probablement un ancêtre commun récent : elles sont proches parentes", "vivent forcément au même endroit", "ont forcément la même taille"], a: 0 }],
    hints: ["Mets le curseur sur 0, puis sur 2, puis sur 12 : compare les lettres colorées.", "Touche « Montrer l'ADN de l'ancêtre commun » : d'où vient l'ADN des espèces A et B ?", "Identique au départ (hérité de l'ancêtre) · les mutations s'accumulent · beaucoup de ressemblances = ancêtre commun récent."],
    corr: "Au moment de la séparation, les deux espèces ont le même ADN, hérité de leur ancêtre commun. Ensuite, des mutations s'accumulent au hasard dans chaque lignée : plus la séparation est ancienne, plus les différences sont nombreuses. Des ADN très semblables suggèrent donc un ancêtre commun récent, c'est-à-dire une parenté proche." },
  { id: "c2", lvl: "mid", title: "Construire l'arbre de parenté", docs: [DOC1, DOCM],
    live: "arbre", liveTitle: "Mon arbre de parenté (il se dessine avec tes réponses)",
    parts: [
      { t: "match", c: "repr", label: "Construis l'arbre : quel être vivant se sépare de la lignée de l'Homme à chaque nœud, de la séparation la plus ancienne à la plus récente ?", ask: "Choisis l'être vivant pour la", rows: sepRows() },
      { t: "choice", c: "lire", label: "D'après la fiche méthode, que représente chaque nœud (•) de l'arbre ?", o: ["Un ancêtre commun hypothétique", "Une espèce actuelle", "Une mutation"], a: 0 },
      { t: "choice", c: "lire", label: "D'après la fiche méthode, dans un arbre de parenté, les longueurs des branches…", o: ["n'ont pas d'importance : seul l'ordre des séparations compte", "indiquent la taille des êtres vivants", "indiquent le nombre de mutations"], a: 0 }],
    hints: ["Relis la fiche méthode : les espèces les plus éloignées de l'Homme se séparent le plus tôt.", "La 1re séparation (la plus ancienne) concerne l'être vivant qui a le plus petit pourcentage ; la 5e, celui qui a le plus grand.", "Haemophilus (7 %), mouche (36 %), poisson zèbre (85 %), souris (90 %), chimpanzé (98,8 %) · ancêtre commun · seul l'ordre compte."],
    corr: "De la séparation la plus ancienne à la plus récente : Haemophilus influenzae (7 %), mouche du vinaigre (36 %), poisson zèbre (85 %), souris domestique (90 %), chimpanzé commun (98,8 %). Chaque nœud représente un ancêtre commun hypothétique ; seul l'ordre des séparations compte." }] },

{ id: "p4", n: 4, icon: "🐒", tab: "Homme et chimpanzé", title: "L'Homme et le chimpanzé, puis le bilan", sub: "Document 2 et le bilan à compléter · environ 10 minutes.",
  items: [
  { id: "d1", lvl: "mid", title: "Si proches… et pourtant différents", docs: [DOC2], recop: true,
    parts: [
      { t: "choice", c: "lire", label: "D'après le document 2, l'ADN de l'Homme et celui du chimpanzé…", o: ["se ressemblent beaucoup, mais diffèrent dans 49 régions", "sont identiques", "n'ont presque rien en commun"], a: 0 },
      { t: "choice", c: "lire", label: "Dans l'une de ces 49 régions se trouve un gène impliqué…", o: ["dans le développement du cerveau", "dans la couleur des yeux", "dans la digestion"], a: 0 },
      { t: "rows", c: "conn", label: "Complète le bilan de l'activité : choisis le mot qui convient.", choices: ["ressemblances", "liens de parenté", "chimpanzé", "mutations"],
        rows: [{ txt: "La comparaison de l'ADN humain avec celui des autres êtres vivants montre de nombreuses ………", a: 0 }, { txt: "Ceci suggère des ……… entre les êtres vivants.", a: 1 }, { txt: "L'espèce la plus proche de nous du point de vue génétique est le ……… : c'est notre plus proche parent.", a: 2 }] }],
    hints: ["Relis le document 2 phrase par phrase.", "Pense aux parties 2 et 3 : beaucoup de points communs, un ancêtre commun, le plus grand pourcentage.", "49 régions · cerveau · ressemblances, liens de parenté, chimpanzé."],
    corr: "L'ADN de l'Homme et celui du chimpanzé se ressemblent beaucoup, mais diffèrent dans 49 régions, dont l'une contient un gène impliqué dans le développement du cerveau. Bilan : la comparaison de l'ADN humain avec celui des autres êtres vivants montre de nombreuses ressemblances. Ceci suggère des liens de parenté entre les êtres vivants. L'espèce la plus proche de nous du point de vue génétique est le chimpanzé : c'est notre plus proche parent. Recopie la fiche mémo dans ton cahier." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement : souviens-toi de l'activité 1",
  parts: [
    { t: "choice", c: "conn", label: "Une mutation est…", o: ["une modification d'un gène, qui crée un nouvel allèle", "un nouveau chromosome", "un effort fait par un animal"], a: 0 },
    { t: "choice", c: "conn", label: "Une mutation est transmise aux descendants si elle touche…", o: ["un gamète (ovule ou spermatozoïde)", "une cellule de la peau", "n'importe quelle cellule"], a: 0 },
    { t: "choice", c: "conn", label: "Deux individus d'une même espèce ont…", o: ["les mêmes gènes, mais pas forcément les mêmes allèles", "des gènes différents", "exactement le même ADN"], a: 0 }],
  hints: ["Pense à la drosophile à quatre ailes.", "Pense au labo des mutations : aile ou spermatozoïde ?", "Modification d'un gène → nouvel allèle · gamète · mêmes gènes, allèles différents."],
  corr: "Une mutation est une modification d'un gène : elle crée un nouvel allèle. Elle n'est transmise aux descendants que si elle touche un gamète. Deux individus d'une même espèce ont les mêmes gènes, mais pas forcément les mêmes allèles." };

/* ===== VERSION EXIGEANTE ===== */
const EXPERT = {
r0: { parts: [
    { t: "word", c: "conn", label: `Une modification d'un gène s'appelle une ${gap}.`, ans: ["mutation", "mutations"] },
    { t: "word", c: "conn", label: `Une mutation crée un nouvel ${gap}.`, ans: ["allèle", "allele", "allèles"] },
    { t: "word", c: "conn", label: `Une mutation est transmise aux descendants si elle touche un ${gap} (ovule ou spermatozoïde).`, ans: ["gamète", "gamete", "gamètes", "cellule reproductrice"] }],
  hints: ["Pense à la drosophile à quatre ailes.", "Un gène peut exister en plusieurs versions…", "mutation · allèle · gamète."] },
a1: { parts: [
    cmpTask(["hum", "chimp", "souris"]),
    { t: "num", c: "calc", label: "Pourcentage de ressemblance entre les deux humains ?", unit: "%", ans: 99.9, tol: 0.02, err: [[v => near(v, 0.1, 0.02), "0,1 %, c'est le pourcentage de différences."], [v => v === 999, "999, c'est le nombre de lettres identiques : divise par 1 000 et multiplie par 100."]] },
    { t: "num", c: "calc", label: "Pourcentage de ressemblance entre l'Homme et le chimpanzé ?", unit: "%", ans: 98.8, tol: 0.02, err: [[v => near(v, 1.2, 0.02), "1,2 %, c'est le pourcentage de différences."], [v => v === 988, "988, c'est le nombre de lettres identiques."]] },
    { t: "num", c: "calc", label: "Pourcentage de ressemblance entre l'Homme et la souris ?", unit: "%", ans: 90, tol: 0.02, err: [[v => near(v, 10, 0.02), "10 %, c'est le pourcentage de différences."], [v => v === 900, "900, c'est le nombre de lettres identiques."]] }],
  hints: ["Compare en entier chaque paire et note le nombre de lettres différentes.", "Ressemblance = (1 000 − lettres différentes) ÷ 1 000 × 100.", "1 → 99,9 % · 12 → 98,8 % · 100 → 90 %."],
  corr: "Deux humains : 1 lettre différente sur 1 000, soit 99,9 % de ressemblance. Homme et chimpanzé : 12 lettres différentes, soit 98,8 %. Homme et souris : 100 lettres différentes, soit 90 %. ⚠ Séquences simulées, choisies pour respecter les pourcentages réels." },
b1: { parts: [
    { t: "task", c: "repr", label: "Place les cinq êtres vivants du document 1 sur la règle.", okMsg: "Les cinq êtres vivants sont placés.", done: () => { const n = SP.filter(s => rgS()[s.k]).length; return { ok: n === SP.length, msg: `${n}/${SP.length} êtres vivants placés.` }; } },
    { t: "match", c: "lire", label: "Classe ces êtres vivants selon le pourcentage d'information génétique qu'ils ont en commun avec l'Homme, du plus proche au plus éloigné.", ask: "Choisis l'être vivant pour la place", rows: rankRows() },
    { t: "redac", c: "rais", min: 30, label: "Décris comment varie le pourcentage d'information génétique en commun avec l'Homme selon le groupe auquel appartient l'être vivant (document 1).",
      crit: [{ g: "vois", lab: "Tu cites les mammifères, les plus proches : chimpanzé (98,8 %) et souris (90 %)", re: [/chimp|souris|mammif/, /98|90|plus (proche|eleve|haut|grand)|les plus/] },
        { g: "sais", lab: "Tu cites le poisson zèbre (85 %), un vertébré qui n'est pas un mammifère", re: [/poisson/, /85|vertebre/] },
        { g: "deduis", lab: "Tu dis que les êtres vivants les plus éloignés (insecte, bactérie) ont les pourcentages les plus faibles", re: [/mouche|insecte|bacteri|haemophilus|arthropode/, /faible|moins|bas|petit|36|eloign/] }],
      model: "Les mammifères, comme l'Homme, ont les pourcentages les plus élevés : 98,8 % pour le chimpanzé et 90 % pour la souris. Le poisson zèbre, un vertébré qui n'est pas un mammifère, en partage 85 %. Les êtres vivants les plus différents de l'Homme ont les pourcentages les plus faibles : la mouche du vinaigre, un insecte (36 %), et la bactérie Haemophilus influenzae (7 %)." }],
  hints: ["Touche un être vivant, puis touche la règle à l'endroit de son pourcentage (ou écris-le).", "Regarde le groupe écrit sous chaque nom dans le document 1 : mammifère, poisson, insecte, bactérie.", "Mammifères (98,8 et 90 %) > poisson (85 %) > insecte (36 %) > bactérie (7 %)."],
  corr: "Du plus proche au plus éloigné : chimpanzé (98,8 %), souris (90 %), poisson zèbre (85 %), mouche du vinaigre (36 %), Haemophilus influenzae (7 %). Les mammifères ont les pourcentages les plus élevés ; un vertébré non mammifère vient ensuite ; un insecte et une bactérie ont les plus faibles." },
c1: { parts: [
    { t: "task", c: "mod", label: "Observe l'ADN des deux espèces peu de temps après la séparation (étapes 1 à 3), puis longtemps après (étape 11 ou 12).", okMsg: "Les deux moments sont observés.", done: () => { const D = xst().dv || {}, n = (D.lo ? 1 : 0) + (D.hi ? 1 : 0); return { ok: n === 2, msg: `${n}/2 moments observés.` }; } },
    { t: "num", c: "lire", label: `À l'étape ${DV.steps}, combien de lettres différentes entre l'espèce A et l'espèce B ?`, unit: "lettre(s)", ans: () => dvDiff(DV.steps) },
    { t: "redac", c: "rais", min: 30, label: "Explique pourquoi de nombreuses ressemblances entre l'ADN de deux espèces suggèrent qu'elles sont apparentées.",
      crit: [{ g: "vois", lab: "Tu dis qu'au moment de la séparation, l'ADN des deux espèces est identique, hérité de l'ancêtre commun", re: [/identique|meme adn|pareil|herit|ancetre/] },
        { g: "sais", lab: "Tu dis que des mutations s'accumulent au cours du temps dans chaque lignée", re: [/mutation/, /temps|accumul|s'ajout|de plus en plus|au fil|augment|nombreuses/] },
        { g: "deduis", lab: "Tu conclus : beaucoup de ressemblances = ancêtre commun récent, parenté proche", re: [/ancetre commun|parent|apparent|famille/, /recent|proche|peu de temps|pas longtemps|separees? (il y a )?peu/] }],
      model: "Je vois qu'au moment de la séparation, l'ADN des espèces A et B est identique : il est hérité de leur ancêtre commun. Je sais qu'ensuite, des mutations s'accumulent au hasard dans chaque lignée, et que les différences augmentent avec le temps. J'en déduis que deux espèces dont l'ADN se ressemble beaucoup se sont séparées il y a peu de temps : elles ont un ancêtre commun récent, elles sont proches parentes." }],
  hints: ["Mets le curseur sur 0, puis sur 2, puis sur 12, et compte les lettres colorées.", "Touche « Montrer l'ADN de l'ancêtre commun » : d'où vient l'ADN des espèces A et B ?", "Identique au départ (hérité de l'ancêtre) → les mutations s'accumulent → beaucoup de ressemblances = ancêtre commun récent."],
  corr: "Au moment de la séparation, les deux espèces ont le même ADN, hérité de leur ancêtre commun. Ensuite, des mutations s'accumulent au hasard dans chaque lignée. Des ADN très semblables suggèrent donc une séparation récente : un ancêtre commun récent, une parenté proche." },
c2: { parts: [
    { t: "match", c: "repr", label: "Construis l'arbre : quel être vivant se sépare de la lignée de l'Homme à chaque nœud, de la séparation la plus ancienne à la plus récente ?", ask: "Choisis l'être vivant pour la", rows: sepRows() },
    { t: "word", c: "lire", label: `Chaque nœud (•) de l'arbre représente un ${gap} commun hypothétique.`, ans: ["ancêtre", "ancetre", "ancêtres"] },
    { t: "redac", c: "rais", min: 25, label: "Explique pourquoi, dans ton arbre, la souris se sépare de la lignée de l'Homme après le poisson zèbre.",
      crit: [{ g: "vois", lab: "Tu compares les pourcentages : souris 90 %, poisson zèbre 85 %", re: [/90/, /85/] },
        { g: "sais", lab: "Tu dis que plus le pourcentage est élevé, plus l'espèce est proche de l'Homme", re: [/plus .{0,25}(proche|apparent|eleve|grand|haut)|ressembl/] },
        { g: "deduis", lab: "Tu dis que la souris partage avec l'Homme un ancêtre commun plus récent que le poisson zèbre", re: [/ancetre/, /recent|plus tard|apres|moins ancien|longtemps/] }],
      model: "Je vois que la souris partage 90 % de son information génétique avec l'Homme, contre 85 % pour le poisson zèbre. Je sais que plus le pourcentage est élevé, plus l'espèce est proche de l'Homme. J'en déduis que la souris partage avec l'Homme un ancêtre commun plus récent que le poisson zèbre : elle se sépare de la lignée de l'Homme plus tard." }],
  hints: ["Relis la fiche méthode : les espèces les plus éloignées se séparent le plus tôt.", "Compare 90 % et 85 % : laquelle des deux espèces est la plus proche de l'Homme ?", "Haemophilus, mouche, poisson zèbre, souris, chimpanzé · ancêtre · 90 % > 85 % → ancêtre commun plus récent avec la souris."],
  corr: "Ordre des séparations : Haemophilus influenzae, mouche du vinaigre, poisson zèbre, souris domestique, chimpanzé commun. Chaque nœud représente un ancêtre commun hypothétique. La souris (90 %) est plus proche de l'Homme que le poisson zèbre (85 %) : elle partage avec lui un ancêtre commun plus récent, donc elle se sépare plus tard." },
d1: { parts: [
    { t: "redac", c: "rais", min: 25, label: "Comment expliquer que l'Homme et le chimpanzé soient si différents, alors que 98,8 % de leur information génétique est commune ? Utilise le document 2.",
      crit: [{ g: "vois", lab: "Tu cites les 49 régions de l'ADN où l'Homme et le chimpanzé diffèrent", re: [/49|regions?/] },
        { g: "sais", lab: "Tu cites le gène impliqué dans le développement du cerveau", re: [/cerveau/] },
        { g: "deduis", lab: "Tu dis que des différences d'ADN dans certains gènes, même peu nombreuses, peuvent changer des caractères importants", re: [/(petit|peu|quelques|faible|1[,.]2|certain)/, /(caractere|change|modifi|important|grand|different)/] }],
      model: "Je vois que, malgré 98,8 % d'information génétique commune, l'ADN de l'Homme et celui du chimpanzé diffèrent dans 49 régions. Je sais que l'une de ces régions contient un gène impliqué dans le développement du cerveau. J'en déduis que des différences d'ADN peu nombreuses, mais situées dans certains gènes, peuvent changer des caractères importants, comme le cerveau." },
    { t: "word", c: "conn", label: `La comparaison de l'ADN humain avec celui des autres êtres vivants montre de nombreuses ${gap}.`, ans: ["ressemblances", "ressemblance", "similitudes", "similitude", "points communs"], err: [[["différences", "difference", "differences"], "Relis la partie 2 : les pourcentages en commun sont souvent élevés."]] },
    { t: "word", c: "conn", label: `Ceci suggère des liens de ${gap} entre les êtres vivants.`, ans: ["parenté", "parente"] },
    { t: "word", c: "conn", label: `L'espèce la plus proche de nous du point de vue génétique est le ${gap} : c'est notre plus proche parent.`, ans: ["chimpanzé", "chimpanze", "chimpanzé commun"] }],
  hints: ["Relis le document 2 phrase par phrase.", "Des différences peu nombreuses, mais où sont-elles ? Que contrôle l'une de ces régions ?", "49 régions, gène du développement du cerveau · ressemblances, parenté, chimpanzé."],
  corr: "L'ADN de l'Homme et celui du chimpanzé diffèrent dans 49 régions, dont l'une contient un gène impliqué dans le développement du cerveau : peu de différences, mais dans des gènes importants. Bilan : la comparaison de l'ADN humain avec celui des autres êtres vivants montre de nombreuses ressemblances. Ceci suggère des liens de parenté entre les êtres vivants. L'espèce la plus proche de nous du point de vue génétique est le chimpanzé : c'est notre plus proche parent. Recopie la fiche mémo dans ton cahier." }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `Le problème : ${PROBLEM}\n${HOME.goal}\n\nFiche mémo à recopier\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
