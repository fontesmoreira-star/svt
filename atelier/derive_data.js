/* ===== 2nde SVT · Thème 1 · Chapitre 3 · Activité 4 « La dérive génétique » : contenus =====
   D'après l'activité du professeur (Th1 Ch3 Act4, version DNL « Exploring Genetic Drift Through Simulation ») et sa trace écrite.
   Le logiciel en ligne est remplacé par un simulateur intégré ; une population de 10 individus montre les tirages un par un ;
   le défi final (guépard, goulot d'étranglement) devient une simulation. Vocabulaire bilingue français-anglais. */
const PROBLEM = "Comment la fréquence des allèles peut-elle changer au hasard dans une population, et quelles en sont les conséquences sur la biodiversité ?";
const tk2 = ok => ok ? "✓" : "○";
const taskMsg = (ok, msg) => ({ ok, msg });
const UR = () => xst().ur || {};
const urLastFix = () => { const f = UR().fx || []; return f.length ? f[f.length - 1] : null; };
const T_UR = () => taskMsg(!!UR().nf, UR().nf ? `✓ Un allèle a été fixé dans ta population (génération ${urLastFix()}).` : "Fais avancer ta population jusqu'à ce qu'un allèle soit fixé (100 %).");
const R10 = () => simRuns(10).slice(0, 10), RBIG = () => simRuns(10000).slice(0, 10);
const T_SA = () => taskMsg(R10().length >= 10, `${tk2(R10().length >= 10)} ${Math.min(10, R10().length)}/10 simulations avec 10 individus`);
const T_SB = () => taskMsg(R10().length >= 10 && RBIG().length >= 10, `${tk2(R10().length >= 10)} ${Math.min(10, R10().length)}/10 simulations avec 10 individus · ${tk2(RBIG().length >= 10)} ${Math.min(10, RBIG().length)}/10 avec 10 000 individus`);
const GLK = () => (xst().gl || {}).k || {};
const T_GL = () => taskMsg(GLK()[5] !== undefined && GLK()[500] !== undefined, `${tk2(GLK()[5] !== undefined)} crise à 5 guépards · ${tk2(GLK()[500] !== undefined)} crise à 500 guépards`);
const nLost = R => R.filter(lost).length;

const HOME = { slug: "derive-genetique", short: "La dérive génétique", last: "b3", lastG: "p2", lastK: 2, dur: "environ 1 h",
  kicker: "Thème 1 · Chapitre 3 · Biodiversité actuelle et passée · Activité 4", title: "La dérive génétique : quand le hasard modifie les populations",
  intro: "Une petite population à faire se reproduire, puis un logiciel de simulation : observe comment la fréquence de deux allèles change au fil des générations, compare une petite et une grande population, puis découvre ce qui est arrivé aux guépards.",
  lab: "Le problème", goal: "Objectifs : exploiter un logiciel de simulation ; comprendre le mécanisme de la dérive génétique ; faire le lien avec l'évolution de la biodiversité.",
  fact: "Les guépards actuels se ressemblent tant génétiquement qu'une greffe de peau entre deux guépards non apparentés est acceptée, comme entre de vrais jumeaux.",
  parts: "Les deux parties de l'activité", recop: "Bilan à recopier dans le cahier",
  txt: "ACTIVITÉ 4 · LA DÉRIVE GÉNÉTIQUE\n2nde SVT · Thème 1 · Chapitre 3 : biodiversité actuelle et passée",
  comps: { conn: "Restituer ses connaissances", lire: "Extraire des informations (simulations, graphiques, tableaux)", calc: "Calculer (fréquences, pourcentages)", rais: "Raisonner, mettre en relation", mod: "Exploiter un logiciel de simulation" },
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "Je simule, je choisis et je complète, pas à pas." },
    l: { icon: "🎓", short: "Exigeante", name: "Version exigeante", q: "exigeante", desc: "Les mêmes simulations, moins d'aide : je rédige avec « je vois → je sais → j'en déduis »." } },
  extraTitle: "Mes simulations",
  extra: () => {
    const u = UR(), k = GLK(), f = R => R.map(a => pct(a[NG]) + " %").join(", ");
    return `MES SIMULATIONS\n- Petite population pas à pas : ${(u.g || []).length - 1} génération(s) ; allèle fixé ${u.nf || 0} fois${(u.fx || []).length ? " (générations " + u.fx.join(", ") + ")" : ""}\n- 10 individus : fréquences finales de A1 = ${f(R10()) || "—"} ; un allèle a disparu ${nLost(R10())} fois sur ${R10().length}\n- 10 000 individus : fréquences finales de A1 = ${f(RBIG()) || "—"} ; un allèle a disparu ${nLost(RBIG())} fois sur ${RBIG().length}\n- Guépards (6 allèles au départ) : ${[5, 50, 500].filter(c => k[c] !== undefined).map(c => `crise à ${c} → ${k[c]} allèle(s)`).join(" ; ") || "—"}\n`;
  },
  extraHTML: () => {
    const u = UR(), k = GLK(), f = R => R.length ? R.map(a => pct(a[NG])).join(" · ") + " %" : "—";
    return tbl(["Simulation", "Résultat"], [["Petite population pas à pas", `${(u.g || []).length - 1} génération(s) · allèle fixé ${u.nf || 0} fois${(u.fx || []).length ? " (gén. " + u.fx.join(", ") + ")" : ""}`],
      ["10 individus · A1 finale", `${f(R10())} · disparition : ${nLost(R10())}/${R10().length}`], ["10 000 individus · A1 finale", `${f(RBIG())} · disparition : ${nLost(RBIG())}/${RBIG().length}`],
      ["Guépards · allèles conservés sur 6", [5, 50, 500].filter(c => k[c] !== undefined).map(c => `crise à ${c} : ${k[c]}`).join(" · ") || "—"]]);
  } };

/* ---------- documents ---------- */
const DOC_VOC = { title: "Vocabulaire · Vocabulary", html: `<div class="fit"><table class="t"><thead><tr><th>Français</th><th>English</th><th>Exemple · Example</th></tr></thead><tbody>
  <tr><td>allèle</td><td>allele</td><td>Each gene has different alleles.</td></tr><tr><td>fréquence allélique</td><td>allele frequency</td><td>The frequency of A1 is 50 %.</td></tr>
  <tr><td>génotype</td><td>genotype</td><td>The genotype (A1 ; A2) is heterozygous.</td></tr><tr><td>homozygote / hétérozygote</td><td>homozygous / heterozygous</td><td>Two identical / two different alleles.</td></tr>
  <tr><td>génération</td><td>generation</td><td>After 100 generations…</td></tr><tr><td>aléatoire, au hasard</td><td>random, by chance</td><td>Drift is a random process.</td></tr>
  <tr><td>fixation (100 %)</td><td>fixation</td><td>When an allele reaches 100 %.</td></tr><tr><td>effectif</td><td>population size</td><td>⚠ « effectif » ≠ « effective ».</td></tr>
  <tr><td>dérive génétique</td><td>genetic drift</td><td>Drift causes random changes.</td></tr></tbody></table></div>` };
const DOC_POP = { title: "Une population de 10 individus", html: `<p>On suit un gène qui existe sous deux allèles, <b>A1</b> et <b>A2</b>. Aucun des deux ne donne d'avantage ou de désavantage à son porteur : ils sont <b>neutres</b>.</p><p>Chaque individu possède deux exemplaires du gène. Lors de la reproduction, chaque descendant reçoit deux allèles <b>tirés au hasard</b> parmi les 20 allèles de la génération des parents. L'effectif reste de 10 individus.</p>` };
const DOC_SIM = { title: "Le logiciel de simulation", html: `<p>Comme le logiciel en ligne <i>Population Genetics Explorer</i> (HHMI BioInteractive), ce simulateur reproduit ces tirages au hasard pendant <b>100 générations</b> et trace la fréquence de l'allèle A1. Réglages : fréquence initiale de A1 = 50 %, nombre de générations = 100. Chaque simulation représente une population différente.</p>` };
const DOC_GP = { title: "Défi · Le guépard", html: `<p>Les guépards actuels sont presque identiques génétiquement. Il y a environ <b>10 000 ans</b>, leur population a brutalement chuté : seuls quelques individus ont survécu, puis la population s'est reconstituée. On parle de <b>goulot d'étranglement</b> (<i>population bottleneck</i>).</p><p>La simulation suit un gène qui existe sous <b>six allèles</b> (A à F), plus ou moins fréquents, pendant 60 générations.</p>` };

/* ---------- bilan (trace écrite du professeur) ---------- */
const BIL = ["Dans une population d'une même espèce, il existe souvent une grande <u>diversité génétique</u> : de nombreux gènes sont représentés par des <u>allèles</u> différents. La <u>fréquence des allèles</u> peut varier au cours du temps : c'est le départ de l'évolution.",
  "La <u>dérive génétique</u> est une variation <u>au hasard</u> (sans influence extérieure) de la fréquence des allèles au cours du temps dans une population.",
  "Elle est la conséquence de la <u>reproduction sexuée</u> : d'une génération à la suivante, seuls certains allèles sont transmis des parents aux descendants, et ce tri est complètement <u>aléatoire</u>. Un allèle peut ainsi <u>disparaître</u>, et l'autre être <u>fixé</u> (100 %).",
  "Les effets de la dérive génétique sont d'autant plus importants que la <u>population est petite</u>.",
  "La dérive génétique contribue à <u>éloigner génétiquement</u> différentes populations d'une même espèce : l'échantillon des allèles présents devient de plus en plus différent d'une population à l'autre. Dans une population très réduite, elle peut faire <u>perdre des allèles</u> et réduire la biodiversité génétique (exemple du guépard)."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("");

/* ---------- échauffement ---------- */
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement : allèles, génotypes et fréquences",
  intro: "Avant de simuler, revois les mots et le calcul dont tu auras besoin. Le vocabulaire est donné en français et en anglais.",
  docs: [DOC_VOC],
  parts: [
    { t: "rows", c: "conn", label: "Ces génotypes sont-ils homozygotes ou hétérozygotes ?", choices: ["Homozygote", "Hétérozygote"], rows: [{ txt: "(A1 ; A1)", a: 0 }, { txt: "(A1 ; A2)", a: 1 }, { txt: "(A2 ; A2)", a: 0 }] },
    { t: "num", c: "calc", label: "Une population compte 10 individus. Combien d'exemplaires du gène (d'allèles) possède-t-elle en tout ?", unit: "allèles", ans: 20, tol: 0, err: [[v => near(v, 10, 0), "Chaque individu possède deux exemplaires du gène."]] },
    { t: "num", c: "calc", label: "Parmi ces 20 allèles, 8 sont des allèles A1. Quelle est la fréquence de A1 ?", unit: "%", ans: 40, tol: 0, err: [[v => near(v, 8, 0), "Fréquence = nombre d'allèles A1 ÷ nombre total d'allèles × 100."], [v => near(v, .4, 0), "0,4 est juste, mais exprime-la en pourcentage : × 100."]] },
    { t: "choice", c: "conn", label: "Un allèle dont la fréquence atteint 100 % est dit…", o: ["fixé", "dominant", "muté"], a: 0 }],
  hints: ["Homozygote : deux allèles identiques. Chaque individu a deux exemplaires de chaque gène.", "Fréquence d'un allèle = nombre de cet allèle ÷ nombre total d'allèles du gène × 100.", "Homozygote, hétérozygote, homozygote · 20 · 8 ÷ 20 × 100 = 40 % · fixé."],
  corr: "(A1 ; A1) et (A2 ; A2) sont homozygotes, (A1 ; A2) est hétérozygote. 10 individus portent 2 × 10 = 20 allèles du gène. Fréquence de A1 = 8 ÷ 20 × 100 = 40 %. Un allèle à 100 % est fixé : tous les individus le portent en deux exemplaires." };

/* ---------- les deux parties ---------- */
const GROUPS = [
{ id: "p1", n: 1, icon: "🎲", tab: "Le hasard", title: "Le hasard de la reproduction", sub: "Une petite population, génération après génération · environ 15 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "Dix individus, deux allèles",
    intro: "Question 1 de la fiche : au départ, indique les fréquences des allèles et les génotypes possibles. Puis fais se reproduire la population.",
    docs: [DOC_POP],
    widget: { title: "Simulation · Une population de 10 individus", w: "urne", sim: "Tirages au hasard" },
    parts: [
      { t: "task", c: "mod", label: "Fais avancer la population génération après génération, jusqu'à ce qu'un allèle soit fixé (100 %).", okMsg: "Un allèle a été fixé.", done: T_UR },
      { t: "num", c: "lire", label: "Au départ (génération 0), quelle est la fréquence de l'allèle A1 ?", unit: "%", ans: 50, tol: 0, err: [[v => near(v, .5, 0), "0,5 est juste, mais exprime-la en pourcentage."]] },
      { t: "multi", c: "conn", label: "Quels génotypes sont possibles dans cette population ? (plusieurs réponses)", o: ["(A1 ; A1)", "(A1 ; A2)", "(A2 ; A2)", "(A1 ; A3)"], a: [0, 1, 2] },
      { t: "num", c: "lire", label: "Dans ta population, à quelle génération un allèle a-t-il été fixé ?", unit: "", ans: () => urLastFix() === null ? -1 : urLastFix(), tol: 0 },
      { t: "choice", c: "lire", label: "D'une génération à l'autre, la fréquence de A1…", o: ["varie au hasard, tantôt à la hausse, tantôt à la baisse", "augmente toujours", "reste égale à 50 %"], a: 0 },
      { t: "choice", c: "rais", label: "Pourquoi varie-t-elle, alors qu'aucun allèle n'est avantagé ?", o: ["Lors de la reproduction, seuls certains allèles sont transmis, tirés au hasard", "L'allèle le plus utile est transmis plus souvent", "Les allèles se transforment l'un en l'autre"], a: 0, no: { 1: "A1 et A2 sont neutres : aucun n'est plus utile que l'autre.", 2: "Les allèles ne changent pas : seul leur nombre change d'une génération à l'autre." } }],
    hints: ["Touche « Génération suivante » : regarde d'où viennent les allèles de chaque descendant. Utilise « 10 générations » pour aller plus vite.", "Au départ : 10 allèles A1 sur 20. Lis la génération de fixation sous le graphique ou dans le tableau.", "50 % · les trois génotypes avec A1 et A2 · la génération affichée · au hasard · tirage au hasard des allèles transmis."],
    corr: "Au départ, A1 et A2 ont chacun une fréquence de 50 % (10 allèles sur 20) ; les génotypes possibles sont (A1 ; A1), (A1 ; A2) et (A2 ; A2). À chaque génération, les allèles transmis sont tirés au hasard : la fréquence de A1 varie sans direction prévisible, jusqu'à ce qu'un allèle soit fixé (100 %) et que l'autre disparaisse. La génération de fixation dépend de ta population : elle change à chaque essai." }] },

{ id: "p2", n: 2, icon: "📈", tab: "Simulateur", title: "Le logiciel de simulation : petite et grande population", sub: "Simulateur de génétique des populations · environ 40 minutes.",
  items: [
  { id: "b1", lvl: "mid", title: "Partie A · Une petite population (10 individus)",
    intro: "Questions 2, 3 et 4 de la fiche : lance 10 simulations avec 10 individus, puis observe les courbes.",
    docs: [DOC_SIM],
    pre: { label: "Hypothèse · Au bout de 100 générations, que deviendra la fréquence de A1 dans une population de 10 individus ?", o: ["Elle peut prendre n'importe quelle valeur, et souvent un allèle disparaît", "Elle restera proche de 50 %", "Elle sera de 100 % dans toutes les simulations"], a: 0, yes: "✓ Ton hypothèse est confirmée par les simulations.", nope: "↻ Les simulations ne confirment pas ton hypothèse de départ : c'est ainsi que l'on progresse." },
    widget: { title: "Logiciel · Simulateur de dérive génétique", w: "simA", sim: "Valeurs simulées" },
    parts: [
      { t: "task", c: "mod", label: "Lance 10 simulations avec 10 individus.", okMsg: "10 simulations réalisées.", done: T_SA },
      { t: "choice", c: "lire", label: "Que montrent les courbes ?", o: ["Elles sont toutes différentes et varient au hasard ; souvent, A1 atteint 0 % ou 100 %", "Elles sont toutes identiques", "Elles restent toutes autour de 50 %"], a: 0 },
      { t: "num", c: "lire", label: "Quelle est la fréquence finale de A1 dans ta simulation n° 1 ?", unit: "%", ans: () => (R10()[0] || [])[NG], tol: .5 },
      { t: "num", c: "lire", label: "Dans combien de tes 10 simulations un allèle a-t-il disparu avant 100 générations ?", unit: "simulations", ans: () => nLost(R10()), tol: 0 },
      { t: "choice", c: "conn", label: "Ce phénomène s'appelle la dérive génétique. C'est…", o: ["la variation au hasard des fréquences des allèles au fil des générations", "l'augmentation de la fréquence de l'allèle le plus avantageux", "l'apparition de nouveaux allèles par mutation"], a: 0, no: { 1: "Ici, aucun allèle n'est avantagé : c'est la sélection naturelle qui favorise un allèle avantageux.", 2: "Aucun nouvel allèle n'apparaît dans les simulations : seule leur fréquence change." } }],
    hints: ["Touche « Lancer 10 simulations ». Le tableau sous le graphique donne la fréquence finale de chaque simulation.", "Un allèle a disparu quand A1 finit à 0 % (A1 disparu) ou à 100 % (A2 disparu). Compte les « oui » du tableau.", "Courbes toutes différentes · lis ta simulation n° 1 · compte les « oui » · variation au hasard des fréquences."],
    corr: "Les courbes sont toutes différentes : la fréquence de A1 varie au hasard d'une génération à l'autre, et dans presque toutes les simulations, un allèle disparaît (0 %) tandis que l'autre est fixé (100 %), souvent bien avant 100 générations. C'est la dérive génétique : la variation au hasard des fréquences des allèles au fil des générations, due à la transmission aléatoire des allèles lors de la reproduction. Tes valeurs (simulation n° 1, nombre de disparitions) dépendent de tes propres simulations." },
  { id: "b2", lvl: "mid", title: "Partie B · Une grande population (10 000 individus)",
    intro: "Questions 5 et 6 de la fiche : garde les mêmes réglages, mais passe à 10 000 individus, puis compare.",
    widget: { title: "Logiciel · Simulateur de dérive génétique", w: "simB", sim: "Valeurs simulées" },
    parts: [
      { t: "task", c: "mod", label: "Lance 10 simulations avec 10 000 individus (et garde tes 10 simulations avec 10 individus).", okMsg: "Les deux séries de simulations sont prêtes.", done: T_SB },
      { t: "num", c: "lire", label: "Dans combien de tes simulations à 10 000 individus un allèle a-t-il disparu ?", unit: "simulations", ans: () => nLost(RBIG()), tol: 0 },
      { t: "rows", c: "lire", label: "Compare : à quelle population cela correspond-il ?", choices: ["10 individus", "10 000 individus"], rows: [{ txt: "La fréquence finale de A1 va de 0 à 100 %.", a: 0 }, { txt: "Les courbes restent proches de 50 %.", a: 1 }, { txt: "Les trois génotypes existent encore après 100 générations.", a: 1 }, { txt: "Il ne reste souvent qu'un seul génotype, homozygote.", a: 0 }] },
      { t: "num", c: "calc", label: "Dans une population de 10 000 individus, A1 a une fréquence de 52 %. Combien d'allèles A1 cela représente-t-il ?", unit: "allèles A1", ans: 10400, tol: 0, err: [[v => near(v, 5200, 0), "Chaque individu porte deux allèles : la population en compte 20 000."]] },
      { t: "choice", c: "rais", label: "Quelle relation y a-t-il entre la dérive génétique et l'effectif de la population ?", o: ["Plus la population est petite, plus la dérive génétique est forte", "Plus la population est grande, plus la dérive génétique est forte", "L'effectif n'a aucun effet sur la dérive génétique"], a: 0 }],
    hints: ["Choisis « 10 000 individus », lance 10 simulations, puis compare avec le tableau « Résumé par effectif ».", "Dans une petite population, le hasard du tirage d'un petit nombre d'allèles a beaucoup d'effet ; sur 20 000 allèles, les écarts se compensent. 52 % de 20 000 = 0,52 × 20 000.", "Souvent 0 · 10 individus, 10 000, 10 000, 10 individus · 10 400 · plus la population est petite, plus la dérive est forte."],
    corr: "Avec 10 000 individus, les courbes restent proches de 50 % (entre 40 et 60 % environ) et aucun allèle ne disparaît dans la grande majorité des simulations : les trois génotypes existent encore. Avec 10 individus, la fréquence finale va de 0 à 100 % et un allèle disparaît presque toujours. 52 % de 20 000 allèles = 10 400 allèles A1. Plus la population est petite, plus la dérive génétique est forte : le hasard du tirage d'un petit nombre d'allèles a beaucoup plus d'effet." },
  { id: "b3", lvl: "hard", title: "Partie C · Dérive génétique et biodiversité : le guépard", recop: true,
    intro: "Question 7 et défi de la fiche : quelles sont les conséquences de la dérive génétique sur la biodiversité ?",
    docs: [DOC_GP],
    widget: { title: "Simulation · Un goulot d'étranglement", w: "goulot", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Simule une crise à 5 guépards, puis une crise à 500 guépards.", okMsg: "Les deux crises ont été simulées.", done: T_GL },
      { t: "num", c: "lire", label: "Combien d'allèles du gène la population possède-t-elle avant la crise ?", unit: "allèles", ans: 6, tol: 0 },
      { t: "num", c: "lire", label: "Combien d'allèles restent après ta crise à 5 guépards ?", unit: "allèles", ans: () => GLK()[5], tol: 0 },
      { t: "choice", c: "lire", label: "Quand la population redevient grande, les allèles perdus pendant la crise…", o: ["ne réapparaissent pas", "réapparaissent peu à peu", "réapparaissent tous dès la génération suivante"], a: 0, no: { 1: "Un allèle perdu n'est plus porté par aucun individu : il ne peut plus être transmis." } },
      { t: "choice", c: "rais", label: "Pourquoi cette faible diversité génétique est-elle un problème pour la survie des guépards ?", o: ["Avec moins d'allèles différents, la population a moins de chances de compter des individus capables de résister à une maladie ou à un changement du milieu", "Les guépards ne peuvent plus se reproduire entre eux", "Les guépards deviennent tous de plus en plus rapides"], a: 0 },
      { t: "choice", c: "rais", label: "Dans la partie A, tes 10 petites populations étaient identiques au départ. Que sont-elles devenues ?", o: ["Génétiquement différentes : A1 fixé dans les unes, A2 dans les autres", "Toutes identiques", "Toutes privées des deux allèles"], a: 0 }],
    hints: ["Choisis « 5 guépards », lance la simulation, puis recommence avec « 500 guépards ». Le tableau indique les allèles perdus.", "Pendant la crise, la population est minuscule : la dérive y est très forte, surtout pour les allèles rares. Après la crise, il n'existe plus aucun porteur des allèles perdus.", "6 · ton résultat (souvent 2 à 4) · ne réapparaissent pas · moins de chances de s'adapter · génétiquement différentes."],
    corr: "Avant la crise, la population possède 6 allèles. Pendant la crise à 5 guépards, la dérive génétique est très forte : plusieurs allèles, surtout les plus rares, disparaissent, et ils ne réapparaissent pas quand la population redevient grande. Avec 500 survivants, presque tous les allèles sont conservés. La dérive génétique peut donc réduire la diversité génétique, surtout dans les petites populations : les guépards ont moins de chances de s'adapter à une maladie ou à un changement du milieu. Elle éloigne aussi génétiquement des populations d'une même espèce, comme tes 10 petites populations de la partie A." }] }
];

/* ===== VERSION EXIGEANTE ===== */
const EXPERT = {
r0: { parts: [
    { t: "word", c: "conn", label: "Comment appelle-t-on un individu de génotype (A1 ; A2) ?", ans: ["hétérozygote", "heterozygote", "un hétérozygote", "il est hétérozygote"] },
    { t: "num", c: "calc", label: "Une population compte 10 individus. Combien d'allèles du gène possède-t-elle en tout ?", unit: "allèles", ans: 20, tol: 0 },
    { t: "num", c: "calc", label: "Parmi ces 20 allèles, 8 sont des allèles A1. Quelle est la fréquence de A2 ?", unit: "%", ans: 60, tol: 0, err: [[v => near(v, 40, 0), "40 %, c'est la fréquence de A1 : A2 représente les 12 autres allèles."]] },
    { t: "word", c: "conn", label: "Traduis en anglais : « dérive génétique ».", ans: ["genetic drift", "the genetic drift"] }],
  hints: ["Relis le vocabulaire bilingue.", "Chaque individu a deux exemplaires du gène ; les fréquences de A1 et de A2 font 100 % à elles deux.", "Hétérozygote · 20 · 12 ÷ 20 × 100 = 60 % · genetic drift."],
  corr: "(A1 ; A2) est hétérozygote. 10 individus portent 20 allèles ; 12 allèles A2 sur 20 donnent une fréquence de 60 %. Dérive génétique se dit genetic drift." },
a1: { parts: [
    { t: "task", c: "mod", label: "Fais avancer la population génération après génération, jusqu'à ce qu'un allèle soit fixé (100 %).", okMsg: "Un allèle a été fixé.", done: T_UR },
    { t: "multi", c: "conn", label: "Au départ, quels génotypes sont possibles ? (plusieurs réponses)", o: ["(A1 ; A1)", "(A1 ; A2)", "(A2 ; A2)", "(A1 ; A3)"], a: [0, 1, 2] },
    { t: "num", c: "lire", label: "Dans ta population, à quelle génération un allèle a-t-il été fixé ?", unit: "", ans: () => urLastFix() === null ? -1 : urLastFix(), tol: 0 },
    { t: "redac", c: "rais", min: 30, label: "Explique pourquoi la fréquence de A1 a changé dans ta population, alors qu'aucun des deux allèles n'est avantagé.",
      crit: [{ g: "vois", lab: "La fréquence de A1 a varié, à la hausse et à la baisse (valeurs)", re: [/(frequence|%|pour ?cent)/, /(vari|augment|diminu|hausse|baisse|change|monte|descend)/] },
        { g: "sais", lab: "Lors de la reproduction, seuls certains allèles sont transmis", re: [/(reproduction|descendant|transmi|generation suivante|parent)/] },
        { g: "sais", lab: "Ce tri des allèles se fait au hasard", re: [/(hasard|aleatoire|tire|tirage|chance)/] },
        { g: "deduis", lab: "Un allèle peut disparaître et l'autre être fixé", re: [/(dispar|fix|100 ?%|perdu)/] },
        { g: "deduis", lab: "C'est la dérive génétique", re: [/derive/] }],
      model: "Je vois que la fréquence de A1 est partie de 50 %, puis qu'elle a augmenté ou diminué d'une génération à l'autre, sans direction prévisible, jusqu'à ce qu'un allèle soit fixé à 100 % et que l'autre disparaisse. Je sais que lors de la reproduction, chaque descendant ne reçoit que deux des allèles des parents et que ces allèles sont tirés au hasard : certains allèles sont transmis plusieurs fois, d'autres pas du tout. J'en déduis que la fréquence des allèles change par hasard, même sans avantage : c'est la dérive génétique." }],
  hints: ["Observe d'où viennent les allèles de chaque descendant, puis fais avancer jusqu'à la fixation.", "Décris d'abord la courbe, puis explique ce qui se passe à chaque reproduction.", "Fréquence qui varie dans les deux sens · seuls certains allèles transmis · tirés au hasard · fixation ou disparition · dérive génétique."],
  corr: "La fréquence de A1 varie au hasard parce qu'à chaque reproduction, seuls certains allèles des parents sont transmis, tirés au hasard. Un allèle peut ainsi disparaître et l'autre être fixé, sans aucun avantage : c'est la dérive génétique." },
b1: { parts: [
    { t: "task", c: "mod", label: "Lance 10 simulations avec 10 individus.", okMsg: "10 simulations réalisées.", done: T_SA },
    { t: "num", c: "lire", label: "Quelle est la fréquence finale de A1 dans ta simulation n° 1 ?", unit: "%", ans: () => (R10()[0] || [])[NG], tol: .5 },
    { t: "num", c: "lire", label: "Dans combien de tes 10 simulations un allèle a-t-il disparu avant 100 générations ?", unit: "simulations", ans: () => nLost(R10()), tol: 0 },
    { t: "redac", c: "rais", min: 30, label: "Ce phénomène s'appelle la dérive génétique. Explique ce terme avec tes mots, en t'appuyant sur tes simulations.",
      crit: [{ g: "vois", lab: "Les courbes sont toutes différentes et imprévisibles", re: [/(differen|imprevisible|aucune n'est pareille|pas les memes|pas le meme|pas la meme|varient|chacune)/] },
        { g: "vois", lab: "Souvent, un allèle disparaît et l'autre est fixé (0 % ou 100 %)", re: [/(dispar|fix|100 ?%|0 ?%|perdu)/] },
        { g: "sais", lab: "La fréquence des allèles change d'une génération à l'autre", re: [/frequence/, /(generation|temps)/] },
        { g: "sais", lab: "Au hasard, par la transmission aléatoire des allèles lors de la reproduction", re: [/(hasard|aleatoire|chance)/] }],
      model: "Je vois que mes 10 courbes sont toutes différentes : la fréquence de A1 monte et descend sans direction prévisible, et dans la plupart des simulations, A1 finit à 0 % ou à 100 %, c'est-à-dire qu'un allèle disparaît et que l'autre est fixé. Je sais qu'à chaque reproduction, seuls certains allèles des parents sont transmis aux descendants. J'en déduis que la dérive génétique est la variation au hasard de la fréquence des allèles d'une génération à l'autre, due à la transmission aléatoire des allèles." }],
  hints: ["Lance les 10 simulations et lis le tableau.", "Décris les courbes, puis explique la cause.", "Courbes différentes · 0 % ou 100 % · la fréquence change à chaque génération · au hasard de la transmission des allèles."],
  corr: "Les courbes sont toutes différentes et, le plus souvent, un allèle disparaît tandis que l'autre est fixé. La dérive génétique est la variation au hasard de la fréquence des allèles au fil des générations, due à la transmission aléatoire des allèles lors de la reproduction." },
b2: { parts: [
    { t: "task", c: "mod", label: "Lance 10 simulations avec 10 000 individus (et garde tes 10 simulations avec 10 individus).", okMsg: "Les deux séries de simulations sont prêtes.", done: T_SB },
    { t: "num", c: "lire", label: "Dans combien de tes simulations à 10 000 individus un allèle a-t-il disparu ?", unit: "simulations", ans: () => nLost(RBIG()), tol: 0 },
    { t: "num", c: "calc", label: "Dans une population de 10 000 individus, A1 a une fréquence de 52 %. Combien d'allèles A1 cela représente-t-il ?", unit: "allèles A1", ans: 10400, tol: 0, err: [[v => near(v, 5200, 0), "Chaque individu porte deux allèles : la population en compte 20 000."]] },
    { t: "redac", c: "rais", min: 35, label: "Explique la relation entre la dérive génétique et l'effectif de la population, en comparant tes deux séries de simulations.",
      crit: [{ g: "vois", lab: "Petite population : A1 finit entre 0 et 100 %, un allèle disparaît souvent", re: [/(10 individus|petite)/, /(dispar|0 ?%|100 ?%|fix)/] },
        { g: "vois", lab: "Grande population : les courbes restent proches de 50 %", re: [/(10 ?000|grande)/, /(50|proche|stable|peu)/] },
        { g: "sais", lab: "Le hasard du tirage d'un petit nombre d'allèles a plus d'effet", re: [/(hasard|aleatoire|tirage|chance)/] },
        { g: "deduis", lab: "Plus la population est petite, plus la dérive est forte", re: [/(petite|faible effectif|peu d'individus)/, /(fort|important|grand effet)/] }],
      model: "Je vois qu'avec 10 individus, la fréquence finale de A1 va de 0 à 100 % et qu'un allèle disparaît dans presque toutes les simulations, alors qu'avec 10 000 individus, les courbes restent proches de 50 % et qu'aucun allèle ne disparaît. Je sais que la dérive génétique vient du tirage au hasard des allèles transmis : sur un petit nombre d'allèles, le hasard crée de grands écarts, alors que sur 20 000 allèles, les écarts se compensent. J'en déduis que plus la population est petite, plus la dérive génétique est forte." }],
  hints: ["Lance les deux séries, puis lis le tableau « Résumé par effectif ».", "Pense à un tirage à pile ou face : sur 4 lancers ou sur 4 000 lancers, est-on aussi sûr d'obtenir à peu près 50 % de piles ?", "Petite : 0 à 100 %, disparitions · grande : proche de 50 % · hasard plus fort sur un petit nombre · plus la population est petite, plus la dérive est forte."],
  corr: "Avec 10 individus, la fréquence finale de A1 va de 0 à 100 % et un allèle disparaît presque toujours ; avec 10 000 individus, elle reste proche de 50 %. Le hasard du tirage a beaucoup plus d'effet sur un petit nombre d'allèles : plus la population est petite, plus la dérive génétique est forte. 52 % de 20 000 = 10 400 allèles A1." },
b3: { parts: [
    { t: "task", c: "mod", label: "Simule une crise à 5 guépards, puis une crise à 500 guépards.", okMsg: "Les deux crises ont été simulées.", done: T_GL },
    { t: "num", c: "lire", label: "Combien d'allèles restent après ta crise à 5 guépards ?", unit: "allèles", ans: () => GLK()[5], tol: 0 },
    { t: "redac", c: "rais", min: 40, label: "Conclus sur l'impact de la dérive génétique sur la biodiversité, puis explique pourquoi la faible diversité génétique des guépards est un problème pour leur survie.",
      crit: [{ g: "vois", lab: "Des allèles sont perdus pendant la crise (6 au départ, moins après)", re: [/(allele)/, /(perd|dispar|plus que|reste)/] },
        { g: "vois", lab: "Les allèles perdus ne réapparaissent pas", re: [/(reapparai|ne reviennent|pas de retour|definitiv|plus jamais)/] },
        { g: "sais", lab: "La dérive est plus forte dans les petites populations", re: [/(petite|faible effectif|peu d'individus|5 guepards|crise)/] },
        { g: "deduis", lab: "Elle réduit la diversité génétique (la biodiversité)", re: [/(diversite|biodiversite)/, /(redui|diminu|baiss|perte|appauvri)/] },
        { g: "deduis", lab: "Moins de chances de s'adapter (maladie, changement du milieu)", re: [/(adapt|maladie|resist|survi|changement)/] }],
      model: "Je vois qu'avant la crise, la population de guépards possède 6 allèles, mais que pendant la crise à 5 individus, plusieurs allèles disparaissent, surtout les plus rares, et qu'ils ne réapparaissent pas quand la population redevient grande. Avec 500 survivants, presque tous les allèles sont conservés. Je sais que la dérive génétique est d'autant plus forte que la population est petite. J'en déduis que la dérive génétique peut réduire la diversité génétique, donc la biodiversité, et éloigner génétiquement des populations d'une même espèce. Les guépards, presque identiques, ont moins de chances de compter des individus capables de résister à une nouvelle maladie ou de s'adapter à un changement du milieu." },
    { t: "choice", c: "rais", label: "Dans la partie A, tes 10 petites populations étaient identiques au départ. Que sont-elles devenues ?", o: ["Génétiquement différentes : A1 fixé dans les unes, A2 dans les autres", "Toutes identiques", "Toutes privées des deux allèles"], a: 0 }],
  hints: ["Compare tes deux crises dans le tableau.", "Que deviennent les allèles pendant la crise, puis après ? Quelles conséquences pour l'adaptation de l'espèce ?", "Allèles perdus pendant la crise, jamais retrouvés · dérive forte dans les petites populations · diversité génétique réduite · moins d'adaptation possible · populations différentes."],
  corr: "La dérive génétique peut faire disparaître des allèles, surtout dans les petites populations : après le goulot d'étranglement, les guépards ont perdu des allèles qui ne réapparaissent pas. Elle réduit ainsi la diversité génétique et éloigne génétiquement les populations d'une même espèce. Avec peu de diversité, les guépards ont moins de chances de s'adapter à une maladie ou à un changement du milieu." }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `Le problème : ${PROBLEM}\n${HOME.goal}\n\nBilan à recopier\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
