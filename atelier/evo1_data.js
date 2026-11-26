/* ===== 3e SVT · Chapitre 3 · Activité 1 · L'apparition d'un nouveau caractère chez un être vivant : contenus =====
   D'après la fiche « Activité 1 » du professeur (documents drosophile, transmission des mutations, textes de Lamarck et de Darwin, bilan à compléter).
   Les DS « évolution » n'y sont pas repris : ni leurs questions, ni leurs exemples (pinsons des Galápagos, matrices de caractères, pourcentages de ressemblance). */
const PROBLEM = "Comment un nouveau caractère apparaît-il chez un être vivant ?";
const gap = `<span class="gap">………</span>`;
const PARA = ["selon Lamarck, l'effort de la girafe allonge son cou pendant sa vie, et ce cou allongé se transmet à ses petits.",
  "un effort ne modifie pas les allèles des cellules reproductrices : seules les mutations, qui apparaissent au hasard, se transmettent si elles touchent un ovule ou un spermatozoïde.",
  "Lamarck a tort et Darwin a raison : des girafes naissent avec un cou plus long que les autres, et les famines conservent surtout celles-là, qui le transmettent à leurs descendants."];
const LINK = ["J'observe que…", "Or…", "Donc…"];
const HOME = { slug: "apparition-nouveau-caractere", short: "L'apparition d'un nouveau caractère", last: "d3", lastG: "p4", lastK: 2, dur: "environ 55 minutes",
  kicker: "Chapitre 3 · Diversité et évolution des êtres vivants · Activité 1", title: "D'où viennent les nouveaux caractères ?",
  intro: "Dans un élevage, les drosophiles ne se ressemblent pas toutes : yeux rouges ou blancs, ailes longues ou courtes… Un jour, une mouche naît même avec quatre ailes ! Comment un nouveau caractère apparaît-il ? Et qui explique le mieux le long cou de la girafe : Lamarck ou Darwin ?",
  lab: "Le problème à résoudre", goal: "Objectif : préciser les éléments à la base de la diversité génétique de la drosophile, proposer une explication à l'origine de cette diversité, puis déterminer lequel des deux naturalistes, Lamarck ou Darwin, a raison.",
  fact: "En 1995, l'Américain Edward Lewis a reçu le prix Nobel de médecine, avec deux autres chercheurs, pour ses travaux sur les gènes qui contrôlent le développement de l'embryon. Il les a étudiés grâce à des drosophiles mutantes… dont certaines avaient quatre ailes.",
  parts: "Les quatre parties de l'activité", recop: "Fiche mémo à recopier dans le cahier",
  txt: "ACTIVITÉ 1 · L'APPARITION D'UN NOUVEAU CARACTÈRE CHEZ UN ÊTRE VIVANT\n3e SVT · Chapitre 3 · Diversité et évolution des êtres vivants",
  comps: { lire: "Extraire des informations de documents", mod: "Observer, manipuler", conn: "Mobiliser ses connaissances", rais: "Raisonner, argumenter" },
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "Je réponds avec des choix et des étiquettes, pas à pas, et je construis ma conclusion avec des morceaux de phrases." },
    l: { icon: "🔬", short: "Exigeante", name: "Version exigeante", q: "exigeante", desc: "Les mêmes documents et manipulations, mais j'écris mes réponses et je rédige mes explications : je vois → je sais → j'en déduis." } },
  extraTitle: "Mes expériences",
  extra: () => `MES EXPÉRIENCES\n${myExp().map(x => "- " + x.replace(/<[^>]+>/g, "")).join("\n")}\n`,
  extraHTML: () => `<ul class="ul">${myExp().map(x => `<li>${nb(x)}</li>`).join("")}</ul>` };
function myExp() {
  const X = xst(), vu = Object.keys(X.vu || {}).map(Number).sort((a, b) => a - b), M = X.mut || {}, T = trS();
  return [`Drosophiles examinées : <b>${vu.length}/${FLIES.length}</b>${vu.length ? " (mouches " + vu.map(i => FLIES[i].n).join(", ") + ")" : ""}`,
    `Labo des mutations : cellule de l'aile ${M.aile ? "✓ observée" : "— pas encore"} ; spermatozoïde ${M.spz ? "✓ observé" : "— pas encore"}`,
    `Troupeau avec famines : génération 0 → ${fmt(meanAt("f", 0), 2)} m${T.f ? ` ; génération ${T.f} → <b>${fmt(meanAt("f", T.f), 2)} m</b>` : " (pas encore simulé)"} ⚠ valeurs simulées`,
    `Troupeau témoin, sans famine : génération 0 → ${fmt(meanAt("t", 0), 2)} m${T.t ? ` ; génération ${T.t} → <b>${fmt(meanAt("t", T.t), 2)} m</b>` : " (pas encore simulé)"} ⚠ valeurs simulées`];
}

/* ---------- documents ---------- */
const DOC1 = { title: "Document 1 · Le caryotype de la drosophile (schéma)", w: "kary", cap: "Les chromosomes d'une cellule de drosophile, rangés par paires." };
const DOC2 = { title: "Document 2 · Quelques gènes portés par les chromosomes 1 et 2", w: "genes", cap: "Chaque gène occupe une place précise sur un chromosome (schéma)." };
const DOC3 = { title: "Document 3 · Une drosophile normale et une drosophile mutante", html: `<p>${nb("Chez la drosophile mutante, le 3e segment du thorax (T3) est transformé en 2e segment (T2). Cette transformation est due à la mutation d'un gène qui contrôle la formation des segments du corps chez l'embryon.")}</p>` };
const DOC4 = { title: "Document 4 · La transmission des mutations", html: `<div class="trans"><p class="tbx">${nb("Individu")}</p><div class="trow"><p class="tin">${nb("Mutation d'un gène dans une cellule d'un organe non reproducteur")}</p><span class="tar" aria-hidden="true">➜</span><p class="tout no">${nb("Mutation non transmise à la descendance de l'individu")}</p></div><div class="trow"><p class="tin">${nb("Mutation d'un gène dans un gamète (ovule ou spermatozoïde)")}</p><span class="tar" aria-hidden="true">➜</span><p class="tout yes">${nb("Mutation transmise à la descendance de l'individu")}</p></div></div><p>${nb("Les mutations ayant lieu au hasard, elles peuvent affecter n'importe quelle cellule d'un individu.")}</p>` };
const DOC5 = { title: "Document 5 · Le long cou de la girafe : deux explications", w: "surligneur", html: `<p>${nb("Le long cou de la girafe a fait couler beaucoup d'encre chez les naturalistes du XIXe siècle. Pour expliquer ce caractère très particulier, deux théories s'opposent : celle de Lamarck, naturaliste français, et celle de Darwin, naturaliste anglais.")}</p>` };

/* ---------- fiche mémo : le bilan du professeur, complété, et ce que montrent les documents ---------- */
const BIL = ["Les individus d'une même espèce partagent le même <u>caryotype</u> et les mêmes <u>gènes</u> mais pas forcément les mêmes <u>allèles</u>. Les différences alléliques sont dues à des <u>mutations</u>.",
  "Une <u>mutation</u> est une modification d'un gène : elle crée un nouvel allèle. Les mutations ont lieu <u>au hasard</u> et peuvent toucher n'importe quelle cellule.",
  "Une mutation dans une cellule d'un organe non reproducteur (l'aile, par exemple) n'est <u>pas transmise</u>. Une mutation dans un <u>gamète</u> (ovule ou spermatozoïde) est <u>transmise</u> à la descendance : on la retrouve dans toutes les cellules du descendant.",
  "Les <u>mutations</u> permettent l'apparition de nouveaux caractères (exemple : la drosophile à quatre ailes) et, à terme, de nouvelles <u>espèces</u>.",
  "Lamarck pensait que l'effort allonge le cou au cours de la vie et que ce caractère acquis se transmet : c'est <u>faux</u>, un effort ne modifie pas les allèles des gamètes. <u>Darwin a raison</u> : les individus naissent différents ; ceux qui sont avantagés dans leur milieu (les girafes les plus hautes pendant les famines) survivent plus souvent et transmettent leurs caractères.",
  "La <u>sélection naturelle</u> favorise les individus les mieux adaptés à leur environnement."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("");

const GROUPS = [
{ id: "p1", n: 1, icon: "🪰", tab: "Les drosophiles", title: "Les drosophiles d'un élevage", sub: "Documents 1 et 2, la boîte d'élevage · environ 10 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "Toutes les drosophiles se ressemblent-elles ?", docs: [DOC1, DOC2],
    widget: { title: "Manipulation · La boîte d'élevage", w: "elevage" },
    parts: [
      { t: "task", c: "mod", label: "Examine au moins quatre drosophiles de l'élevage.", okMsg: "Au moins quatre drosophiles examinées.", done: () => { const n = Object.keys(xst().vu || {}).length; return { ok: n >= 4, msg: `${n}/4 drosophiles examinées au minimum.` }; } },
      { t: "num", c: "lire", label: "Combien de paires de chromosomes possède une cellule de drosophile ?", unit: "paires", ans: 4, err: [[v => v === 8, "8, c'est le nombre de chromosomes : ils sont rangés par paires."], [v => v === 2, "Compte les paires numérotées sur le document 1."]] },
      { t: "rows", c: "rais", label: "Chez les drosophiles examinées, ces éléments sont-ils identiques ou peuvent-ils différer ?", choices: ["Identique chez toutes", "Peut différer"],
        rows: [{ txt: "Le caryotype (nombre et forme des chromosomes)", a: 0 }, { txt: "Les gènes présents (couleur des yeux, taille des ailes…)", a: 0 }, { txt: "La place de chaque gène sur les chromosomes", a: 0 }, { txt: "Les allèles de ces gènes", a: 1 }, { txt: "Les caractères (couleur des yeux, taille des ailes…)", a: 1 }] },
      { t: "choice", c: "rais", label: "À la base de la diversité génétique des drosophiles, il y a…", o: ["des allèles différents pour certains gènes", "des gènes différents d'une mouche à l'autre", "un nombre de chromosomes différent d'une mouche à l'autre"], a: 0, no: { 1: "Toutes les fiches montrent les cinq mêmes gènes, au même endroit.", 2: "Toutes les fiches montrent le même caryotype." } }],
    hints: ["Touche les mouches une à une et compare leurs fiches : caryotype, chromosomes 1 et 2, allèles.", "Sur toutes les fiches, les chromosomes et la place des gènes sont les mêmes. Ce sont les mots écrits en couleur (les allèles) qui changent.", "4 paires · caryotype, gènes et place des gènes : identiques · allèles et caractères : peuvent différer · la diversité vient des allèles."],
    corr: "La drosophile possède 4 paires de chromosomes. Toutes les drosophiles examinées ont le même caryotype et les mêmes gènes, placés au même endroit sur les chromosomes. Elles ne possèdent pas forcément les mêmes allèles : c'est pourquoi leurs caractères diffèrent. La diversité génétique repose sur la diversité des allèles." }] },

{ id: "p2", n: 2, icon: "⚡", tab: "Les mutations", title: "D'où viennent les nouveaux allèles ?", sub: "Documents 3 et 4, la mouche à quatre ailes et le labo des mutations · environ 15 minutes.",
  items: [
  { id: "b1", lvl: "mid", title: "Une mouche à quatre ailes", docs: [DOC3],
    widget: { title: "Observation · Drosophile normale et drosophile mutante", w: "ailes" },
    parts: [
      { t: "task", c: "mod", label: "Affiche les segments du thorax des deux drosophiles.", okMsg: "Segments du thorax affichés.", done: () => ({ ok: !!xst().segVu, msg: xst().segVu ? "Segments du thorax affichés." : "Touche « Afficher les segments du thorax »." }) },
      { t: "num", c: "lire", label: "Combien d'ailes possède la drosophile mutante ?", unit: "ailes", ans: 4, err: [[v => v === 2, "Compte aussi les ailes portées par le segment T3."]] },
      { t: "choice", c: "lire", label: "Chez la drosophile mutante, le 3e segment du thorax (T3)…", o: ["ressemble au 2e segment (T2) et porte une deuxième paire d'ailes à la place des balanciers", "a disparu", "porte une paire de pattes en plus"], a: 0 },
      { t: "choice", c: "rais", label: "Ce nouveau caractère est apparu…", o: ["à la suite de la mutation d'un gène qui contrôle la formation des segments : un nouvel allèle", "parce que la mouche s'est entraînée à voler", "parce que la mouche a mangé une nourriture différente"], a: 0, no: { 1: "Les ailes se forment chez l'embryon, bien avant que la mouche ne vole : ce caractère vient de ses gènes.", 2: "Le document 3 indique l'origine de cette transformation." } }],
    hints: ["Compte les ailes de chaque mouche, puis touche « Afficher les segments du thorax ».", "Regarde le segment T3 (orange) : que porte-t-il chez la mouche normale ? Et chez la mutante ?", "4 ailes · T3 ressemble à T2 et porte des ailes à la place des balanciers · mutation d'un gène : un nouvel allèle."],
    corr: "La drosophile mutante a quatre ailes : son 3e segment du thorax (T3) est transformé en 2e segment (T2) et porte une deuxième paire d'ailes à la place des balanciers. Ce nouveau caractère est dû à la mutation d'un gène qui contrôle la formation des segments : la mutation a créé un nouvel allèle." },
  { id: "b2", lvl: "mid", title: "Transmise ou pas transmise ?", docs: [DOC4],
    widget: { title: "Animation · Le labo des mutations", w: "mutlab", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Observe les deux expériences jusqu'au bout : une mutation dans une cellule de l'aile, puis dans un spermatozoïde.", okMsg: "Les deux expériences sont observées.", done: () => { const M = xst().mut || {}, n = (M.aile ? 1 : 0) + (M.spz ? 1 : 0); return { ok: n === 2, msg: `${n}/2 expériences observées jusqu'au bout.` }; } },
      { t: "rows", c: "rais", label: "La mutation est-elle transmise à la descendance ?", choices: ["Transmise", "Non transmise"],
        rows: [{ txt: "Mutation dans une cellule de l'aile", a: 1 }, { txt: "Mutation dans un spermatozoïde", a: 0 }, { txt: "Mutation dans un ovule", a: 0 }, { txt: "Mutation dans une cellule de l'œil", a: 1 }] },
      { t: "choice", c: "conn", label: "Après la fécondation par le spermatozoïde muté, le nouvel allèle se retrouve…", o: ["dans toutes les cellules du descendant, car elles proviennent toutes de la cellule-œuf par mitoses", "seulement dans les ailes du descendant", "dans aucune cellule du descendant"], a: 0 },
      { t: "choice", c: "lire", label: "D'après le document 4, les mutations…", o: ["ont lieu au hasard et peuvent toucher n'importe quelle cellule", "se produisent quand l'animal en a besoin", "ne touchent que les cellules reproductrices"], a: 0, no: { 1: "Relis la dernière phrase du document 4.", 2: "Le document 4 montre aussi des mutations dans un organe non reproducteur." } }],
    hints: ["Lance l'animation avec « Une cellule de l'aile », puis avec « Un spermatozoïde ». Regarde les étoiles ★ dans les cellules du descendant.", "Le descendant provient de la fécondation d'un ovule par un spermatozoïde. Une cellule de l'aile participe-t-elle à la fécondation ?", "Aile et œil : non transmise · spermatozoïde et ovule : transmise · toutes les cellules (mitoses de la cellule-œuf) · au hasard."],
    corr: "Une mutation dans une cellule d'un organe non reproducteur (aile, œil…) reste chez l'individu : elle n'est pas transmise. Une mutation dans un gamète (ovule ou spermatozoïde) est transmise : après la fécondation, elle est dans la cellule-œuf, puis, par mitoses, dans toutes les cellules du descendant. Les mutations ont lieu au hasard et peuvent toucher n'importe quelle cellule." }] },

{ id: "p3", n: 3, icon: "🦒", tab: "Lamarck et Darwin", title: "Le long cou de la girafe : deux théories", sub: "Document 5, le surligneur et les deux scénarios animés · environ 15 minutes.",
  items: [
  { id: "c1", lvl: "easy", title: "Surligner les deux théories", docs: [{ title: DOC5.title, html: DOC5.html }],
    widget: { title: "Manipulation · Le surligneur", w: "surligneur" },
    parts: [
      { t: "task", c: "mod", label: "Surligne au moins trois passages importants dans chaque texte.", okMsg: "Au moins trois passages surlignés dans chaque texte.", done: () => { const a = hlN("L"), b = hlN("D"); return { ok: a >= 3 && b >= 3, msg: `Lamarck : ${a}/3 · Darwin : ${b}/3 passages surlignés au minimum.` }; } },
      { t: "rows", c: "lire", label: "Qui dit quoi ? Pour chaque idée, indique le naturaliste qui la défend.", choices: ["Lamarck", "Darwin", "Les deux"],
        rows: [{ txt: "Le cou de la girafe s'allonge au cours de sa vie, à force d'efforts pour atteindre les feuilles.", a: 0 }, { txt: "Le cou allongé par les efforts se retrouve chez tous les individus de sa race.", a: 0 },
          { txt: "Dès leur naissance, certaines girafes sont un peu plus hautes que les autres.", a: 1 }, { txt: "Pendant les famines, les girafes les plus hautes ont plus de chances de survivre.", a: 1 },
          { txt: "Les survivantes ont des descendants qui héritent de leurs particularités.", a: 1 }, { txt: "Un long cou permet à la girafe de brouter les feuilles des arbres élevés.", a: 2 }] }],
    hints: ["Dans le texte de Lamarck, cherche les mots « s'efforcer », « habitude », « efforts ». Dans celui de Darwin, « naissante », « famine », « héritant ».", "Lamarck parle d'un changement pendant la vie, dû à l'effort. Darwin parle de différences qui existent déjà entre les girafes.", "Lamarck : les deux premières idées · Darwin : les trois suivantes · les deux : le long cou permet de brouter haut."],
    corr: "Pour Lamarck, la girafe s'efforce d'atteindre les feuilles : son cou s'allonge au cours de sa vie, et ce caractère acquis se retrouve chez ses descendants. Pour Darwin, les girafes naissent déjà différentes ; pendant les famines, les plus hautes survivent plus souvent et ont des descendants qui héritent de leur particularité. Tous deux constatent que le long cou permet de brouter haut." },
  { id: "c2", lvl: "mid", title: "Deux scénarios en images", docs: [DOC5],
    widget: { title: "Animation · Les deux scénarios", w: "scenarios" },
    parts: [
      { t: "task", c: "mod", label: "Regarde l'animation jusqu'au bout.", okMsg: "Animation regardée jusqu'au bout.", done: () => ({ ok: !!xst().scen, msg: xst().scen ? "Animation regardée jusqu'au bout." : "Touche « Lancer » et regarde les trois étapes." }) },
      { t: "rows", c: "rais", label: "Dans chaque scénario, quand apparaissent les différences de longueur du cou ?", choices: ["Pendant la vie, par l'effort", "Dès la naissance"],
        rows: [{ txt: "Selon Lamarck", a: 0 }, { txt: "Selon Darwin", a: 1 }] },
      { t: "choice", c: "rais", label: "Dans le scénario de Lamarck, d'où vient le long cou des petits ?", o: ["Leurs parents ont allongé leur cou par l'effort et le leur ont transmis", "Seules les girafes au long cou ont survécu", "Ils ont mangé plus de feuilles que leurs parents"], a: 0 },
      { t: "choice", c: "rais", label: "Dans le scénario de Darwin, que deviennent les girafes au cou court pendant la famine ?", o: ["Elles meurent plus souvent, car elles n'atteignent plus les feuilles", "Elles allongent leur cou pour atteindre les feuilles", "Elles ont plus de petits que les autres"], a: 0, no: { 1: "C'est l'idée de Lamarck, pas celle de Darwin." } }],
    hints: ["Touche « Lancer », puis compare les deux scénarios étape par étape (les légendes sous l'animation t'aident).", "À l'étape 1, chez Lamarck, les cous s'allongent ; chez Darwin, ils sont déjà de longueurs différentes.", "Lamarck : pendant la vie · Darwin : dès la naissance · Lamarck : cou allongé transmis · Darwin : les cous courts meurent pendant la famine."],
    corr: "Selon Lamarck, le cou s'allonge pendant la vie, par l'effort, et les petits héritent de ce cou allongé. Selon Darwin, les différences existent dès la naissance : pendant la famine, les girafes au cou court n'atteignent plus les feuilles et meurent plus souvent ; les survivantes, au long cou, le transmettent à leurs petits." }] },

{ id: "p4", n: 4, icon: "⚖", tab: "Qui a raison ?", title: "Lamarck ou Darwin : qui a raison ?", sub: "Le simulateur de troupeau, le verdict, puis le bilan · environ 15 minutes.",
  items: [
  { id: "d1", lvl: "mid", title: "Le simulateur de troupeau",
    widget: { title: "Simulation · Un troupeau de girafes sur plusieurs générations", w: "troupeau", sim: "Valeurs simulées" },
    parts: [
      { t: "task", c: "mod", label: "Simule au moins 5 générations pour chacun des deux troupeaux.", okMsg: "Au moins 5 générations simulées pour chaque troupeau.", done: () => { const T = trS(); return { ok: T.f >= 5 && T.t >= 5, msg: `Avec famines : ${T.f}/5 · témoin : ${T.t}/5 générations au minimum.` }; } },
      { t: "num", c: "lire", label: "Lis le tableau : hauteur moyenne du troupeau avec famines à la génération 5 (au centième de mètre) ?", unit: "m", ans: () => meanAt("f", 5), tol: 0.011, err: [[v => near(v, meanAt("t", 5), 0.011), "C'est la valeur du troupeau témoin : lis la colonne « Avec famines »."], [v => near(v, meanAt("f", 0), 0.011), "C'est la valeur de la génération 0."]] },
      { t: "choice", c: "lire", label: "Avec des famines, au fil des générations, la hauteur moyenne des girafes…", o: ["augmente", "diminue", "ne change pas"], a: 0 },
      { t: "choice", c: "lire", label: "Dans le troupeau témoin, sans famine, la hauteur moyenne…", o: ["reste à peu près la même", "augmente autant qu'avec les famines", "diminue fortement"], a: 0 },
      { t: "choice", c: "rais", label: "Pourquoi la hauteur moyenne augmente-t-elle avec les famines ?", o: ["Les girafes les plus hautes atteignent les dernières feuilles : elles survivent plus souvent et leurs petits héritent de leur taille", "Chaque girafe s'étire pour atteindre les feuilles et transmet son cou allongé", "Les famines font grandir les girafes"], a: 0, no: { 1: "Dans le simulateur, aucune girafe ne s'étire : la taille d'un petit dépend seulement de celle de ses parents, à quelques centimètres près.", 2: "Observe qui meurt pendant la famine et qui a des petits." } }],
    hints: ["Choisis « Avec famines » et touche « 5 générations », puis fais de même avec le troupeau témoin. Le tableau de valeurs est sous le graphique.", "Pendant une famine, regarde la ligne pointillée : quelles girafes atteignent encore les feuilles ? Lesquelles deviennent grises ?", "La moyenne augmente avec les famines et reste à peu près stable sans famine : les plus hautes survivent et transmettent leur taille."],
    corr: "Avec des famines, la hauteur moyenne augmente de génération en génération : seules les girafes assez hautes atteignent les dernières feuilles, elles survivent plus souvent et leurs petits héritent de leur taille. Dans le troupeau témoin, les morts touchent les girafes au hasard : la hauteur moyenne reste à peu près la même. Aucune girafe ne s'étire dans ce modèle." },
  { id: "d2", lvl: "hard", title: "Mon verdict : Lamarck ou Darwin ?", docs: [DOC4, DOC5],
    intro: `<div class="box key"><p class="lab">✔ Point méthode · Argumenter</p><p>${nb("<b>J'observe que</b> : je cite le document. <b>Or</b> : je rappelle ce que je sais (parties 1 et 2). <b>Donc</b> : je conclus en répondant à la question.")}</p></div>`,
    parts: [
      { t: "rows", c: "conn", label: "Ce que tu as découvert dans les parties 1 et 2 : vrai ou faux ?", choices: ["Vrai", "Faux"],
        rows: [{ txt: "Les mutations apparaissent au hasard, pas parce que l'animal en a besoin.", a: 0 }, { txt: "Une girafe qui étire son cou modifie les allèles de ses spermatozoïdes ou de ses ovules.", a: 1 }, { txt: "Seules les mutations des cellules reproductrices sont transmises aux descendants.", a: 0 }, { txt: "Des girafes peuvent naître avec un cou plus long que les autres, grâce à des allèles différents.", a: 0 }] },
      { t: "match", c: "rais", label: "Construis ton argument : place chaque morceau de phrase après le bon mot de liaison.", ask: "Choisis la suite de", rows: LINK.map((l, i) => ({ e: String(i + 1), txt: l, v: PARA[i] })) },
      { t: "choice", c: "rais", label: "Lequel des deux naturalistes a raison ?", o: ["Darwin", "Lamarck", "Les deux"], a: 0, no: { 1: "Un caractère acquis par l'effort ne modifie pas les allèles des gamètes : il ne peut pas être transmis.", 2: "Les deux explications s'opposent sur un point : le caractère acquis par l'effort se transmet-il ?" } }],
    hints: ["Relis le document 4 : quelles mutations sont transmises ? Une cellule du cou est-elle une cellule reproductrice ?", "« J'observe que » : ce que dit Lamarck. « Or » : ce que tu sais des mutations. « Donc » : le verdict.", "Vrai, faux, vrai, vrai · Lamarck → or un effort ne modifie pas les gamètes → donc Darwin a raison."],
    corr: "J'observe que, selon Lamarck, l'effort de la girafe allonge son cou pendant sa vie, et que ce cou allongé se transmet à ses petits. Or un effort ne modifie pas les allèles des cellules reproductrices : seules les mutations, qui apparaissent au hasard, sont transmises quand elles touchent un ovule ou un spermatozoïde. Donc Lamarck a tort et Darwin a raison : des girafes naissent avec un cou plus long que les autres, et les famines conservent surtout celles-là, qui le transmettent à leurs descendants." },
  { id: "d3", lvl: "easy", title: "Le bilan à compléter", recop: true,
    intro: `<p>${nb("Complète le bilan de l'activité. Il s'affiche ensuite, avec la fiche mémo à recopier dans ton cahier.")}</p>`,
    parts: [
      { t: "rows", c: "conn", label: "Choisis le mot qui complète chaque phrase du bilan.", choices: ["gènes", "allèles", "mutations", "espèces"],
        rows: [{ txt: "Les individus d'une même espèce partagent le même caryotype et les mêmes ………", a: 0 }, { txt: "… mais pas forcément les mêmes ………", a: 1 }, { txt: "Les différences alléliques sont dues à des ………", a: 2 }, { txt: "Les ……… permettent l'apparition de nouveaux caractères…", a: 2 }, { txt: "… et, à terme, de nouvelles ………", a: 3 }] }],
    hints: ["Partie 1 : qu'est-ce qui est identique chez toutes les drosophiles ? Qu'est-ce qui diffère ?", "Partie 2 : d'où viennent les nouveaux allèles ?", "gènes · allèles · mutations · mutations · espèces."],
    corr: "Les individus d'une même espèce partagent le même caryotype et les mêmes gènes mais pas forcément les mêmes allèles. Les différences alléliques sont dues à des mutations. Les mutations permettent l'apparition de nouveaux caractères et, à terme, de nouvelles espèces. Recopie la fiche mémo dans ton cahier." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement : les mots de la génétique",
  parts: [
    { t: "choice", c: "conn", label: "Le caryotype, c'est…", o: ["l'ensemble des chromosomes d'une cellule, rangés par paires", "un seul chromosome", "une cellule reproductrice"], a: 0 },
    { t: "choice", c: "conn", label: "Un gène est…", o: ["une portion de chromosome (d'ADN) qui détermine un caractère", "un chromosome entier", "un caractère visible, comme la couleur des yeux"], a: 0 },
    { t: "choice", c: "conn", label: "Les allèles sont…", o: ["les différentes versions d'un même gène", "des gènes différents", "les deux chromosomes d'une paire"], a: 0 },
    { t: "choice", c: "conn", label: "Les cellules reproductrices (gamètes) sont…", o: ["les ovules et les spermatozoïdes", "toutes les cellules du corps", "les cellules de la peau"], a: 0 }],
  hints: ["Pense au caryotype de l'enquête : des chromosomes photographiés puis rangés.", "Un gène est un « morceau » de chromosome ; un allèle est une « version » de gène.", "Chromosomes rangés par paires · portion de chromosome · versions d'un même gène · ovules et spermatozoïdes."],
  corr: "Le caryotype est l'ensemble des chromosomes d'une cellule, rangés par paires. Un gène est une portion de chromosome (d'ADN) qui détermine un caractère ; ses différentes versions sont les allèles. Les gamètes sont les ovules et les spermatozoïdes." };

/* ===== VERSION EXIGEANTE : mêmes documents et manipulations, réponses écrites et explications rédigées ===== */
const EXPERT = {
r0: { parts: [
    { t: "word", c: "conn", label: `L'ensemble des chromosomes d'une cellule, rangés par paires, s'appelle le ${gap}.`, ans: ["caryotype", "caryotypes"] },
    { t: "word", c: "conn", label: `Une portion de chromosome qui détermine un caractère est un ${gap}.`, ans: ["gène", "gene"], err: [[["allèle", "allele"], "Un allèle est une version d'un gène."]] },
    { t: "word", c: "conn", label: `Les différentes versions d'un même gène sont des ${gap}.`, ans: ["allèles", "allèle", "allele", "alleles"] },
    { t: "word", c: "conn", label: `Les ovules et les spermatozoïdes sont les cellules ${gap}, appelées aussi gamètes.`, ans: ["reproductrices", "reproductrice", "sexuelles", "sexuelle"] }],
  hints: ["Pense au caryotype de l'enquête : des chromosomes photographiés puis rangés.", "Un gène est un « morceau » de chromosome ; un allèle est une « version » de gène.", "caryotype · gène · allèles · reproductrices."] },
a1: { parts: [
    { t: "task", c: "mod", label: "Examine au moins quatre drosophiles de l'élevage.", okMsg: "Au moins quatre drosophiles examinées.", done: () => { const n = Object.keys(xst().vu || {}).length; return { ok: n >= 4, msg: `${n}/4 drosophiles examinées au minimum.` }; } },
    { t: "num", c: "lire", label: "Combien de paires de chromosomes possède une cellule de drosophile ?", unit: "paires", ans: 4, err: [[v => v === 8, "8, c'est le nombre de chromosomes : ils sont rangés par paires."]] },
    { t: "num", c: "lire", label: "Combien de chromosomes en tout dans cette cellule ?", unit: "chromosomes", ans: 8, err: [[v => v === 4, "4, c'est le nombre de paires."]] },
    { t: "redac", c: "rais", min: 25, label: "Précise les éléments à la base de la diversité génétique des drosophiles de l'élevage.",
      crit: [{ g: "vois", lab: "Tu dis que toutes les drosophiles ont le même caryotype (4 paires de chromosomes)", re: [/caryotype|4 paires|quatre paires|memes? chromosomes|meme nombre de chromosomes/] },
        { g: "sais", lab: "Tu dis qu'elles ont les mêmes gènes, placés au même endroit", re: [/(memes?|identiques?|pareils?) genes|genes (sont )?(les )?(memes|identiques|pareils)|meme (place|endroit|position|emplacement)|memes (places|endroits|positions|emplacements)/] },
        { g: "deduis", lab: "Tu dis que ce sont les allèles qui diffèrent d'une mouche à l'autre", re: [/allele/, /differ|pas (forcement )?(les )?memes|varient|changent|autres?|plusieurs|versions/] }],
      model: "Je vois que toutes les drosophiles examinées ont le même caryotype : 4 paires de chromosomes. Je sais qu'elles ont aussi les mêmes gènes, placés au même endroit sur les chromosomes. J'en déduis que leurs différences viennent des allèles : un même gène existe en plusieurs versions, et les mouches ne possèdent pas forcément les mêmes allèles." }],
  hints: ["Touche les mouches une à une et compare leurs fiches : caryotype, chromosomes 1 et 2, allèles.", "Qu'est-ce qui est identique sur toutes les fiches ? Qu'est-ce qui change ?", "4 paires, 8 chromosomes · même caryotype, mêmes gènes au même endroit, allèles différents."],
  corr: "La drosophile possède 4 paires, soit 8 chromosomes. Toutes les drosophiles examinées ont le même caryotype et les mêmes gènes, placés au même endroit sur les chromosomes, mais pas forcément les mêmes allèles : la diversité génétique repose sur la diversité des allèles." },
b1: { parts: [
    { t: "task", c: "mod", label: "Affiche les segments du thorax des deux drosophiles.", okMsg: "Segments du thorax affichés.", done: () => ({ ok: !!xst().segVu, msg: xst().segVu ? "Segments du thorax affichés." : "Touche « Afficher les segments du thorax »." }) },
    { t: "num", c: "lire", label: "Combien d'ailes possède la drosophile mutante ?", unit: "ailes", ans: 4, err: [[v => v === 2, "Compte aussi les ailes portées par le segment T3."]] },
    { t: "word", c: "conn", label: `Le caractère « quatre ailes » est dû à un nouvel ${gap} d'un gène qui contrôle la formation des segments.`, ans: ["allèle", "allele"], err: [[["gène", "gene"], "Le gène existe chez toutes les drosophiles : c'est sa version qui a changé."]] },
    { t: "redac", c: "rais", min: 20, label: "Propose une explication à l'apparition de cette drosophile à quatre ailes.",
      crit: [{ g: "vois", lab: "Tu décris le nouveau caractère : quatre ailes, le segment T3 transformé en T2", re: [/4 ailes|quatre ailes|deuxieme paire|2e paire|seconde paire|balancier|t3|segment/] },
        { g: "sais", lab: "Tu dis qu'un gène a été modifié par une mutation", re: [/mutation|mute|modifi/] },
        { g: "deduis", lab: "Tu dis que cette mutation a créé un nouvel allèle", re: [/allele/] }],
      model: "Je vois que la drosophile mutante a quatre ailes : son 3e segment du thorax (T3) ressemble au 2e (T2) et porte des ailes à la place des balanciers. Je sais que les caractères sont déterminés par des gènes. J'en déduis qu'une mutation a modifié un gène qui contrôle la formation des segments : elle a créé un nouvel allèle, à l'origine de ce nouveau caractère." }],
  hints: ["Compte les ailes, puis affiche les segments du thorax : que porte T3 chez chaque mouche ?", "Le document 3 indique la cause de la transformation.", "4 ailes · allèle · une mutation d'un gène des segments a créé un nouvel allèle."],
  corr: "La drosophile mutante a quatre ailes : son segment T3 est transformé en T2 et porte une deuxième paire d'ailes à la place des balanciers. Une mutation a modifié un gène qui contrôle la formation des segments : elle a créé un nouvel allèle, à l'origine de ce nouveau caractère." },
b2: { parts: [
    { t: "task", c: "mod", label: "Observe les deux expériences jusqu'au bout : une mutation dans une cellule de l'aile, puis dans un spermatozoïde.", okMsg: "Les deux expériences sont observées.", done: () => { const M = xst().mut || {}, n = (M.aile ? 1 : 0) + (M.spz ? 1 : 0); return { ok: n === 2, msg: `${n}/2 expériences observées jusqu'au bout.` }; } },
    { t: "rows", c: "rais", label: "La mutation est-elle transmise à la descendance ?", choices: ["Transmise", "Non transmise"],
      rows: [{ txt: "Mutation dans une cellule de l'aile", a: 1 }, { txt: "Mutation dans un spermatozoïde", a: 0 }, { txt: "Mutation dans un ovule", a: 0 }, { txt: "Mutation dans une cellule de l'œil", a: 1 }] },
    { t: "word", c: "lire", label: `D'après le document 4, les mutations ont lieu au ${gap} : elles peuvent toucher n'importe quelle cellule.`, ans: ["hasard"] },
    { t: "redac", c: "rais", min: 25, label: "Explique pourquoi une mutation n'est transmise aux descendants que si elle touche une cellule reproductrice.",
      crit: [{ g: "vois", lab: "Tu cites les résultats du labo : la mutation de l'aile n'est pas transmise, celle du spermatozoïde l'est", re: [/aile/, /spermato|gamete|reproduct|ovule/] },
        { g: "sais", lab: "Tu dis que le descendant provient de la fécondation (ovule + spermatozoïde → cellule-œuf)", re: [/fecond|cellule.?oeuf|\boeuf|zygote/] },
        { g: "deduis", lab: "Tu dis que le nouvel allèle passe alors dans toutes les cellules du descendant (mitoses)", re: [/toutes (les|ses) cellules|chaque cellule|tout (le|son) corps|mitose/] }],
      model: "Je vois que la mutation d'une cellule de l'aile reste dans l'aile du père, alors que la mutation du spermatozoïde se retrouve chez le descendant. Je sais que le descendant provient de la fécondation d'un ovule par un spermatozoïde, qui forme une cellule-œuf. J'en déduis que seule une mutation dans un gamète passe dans la cellule-œuf, puis, par mitoses, dans toutes les cellules du descendant ; une cellule de l'aile ne participe pas à la reproduction." }],
  hints: ["Lance l'animation avec « Une cellule de l'aile », puis avec « Un spermatozoïde » : regarde les étoiles ★ chez le descendant.", "D'où vient la première cellule du descendant ? Que deviennent ensuite ses copies ?", "Aile, œil : non · spermatozoïde, ovule : oui · hasard · fécondation → cellule-œuf → mitoses → toutes les cellules."],
  corr: "Une mutation dans une cellule d'un organe non reproducteur n'est pas transmise. Une mutation dans un gamète l'est : elle passe dans la cellule-œuf, puis, par mitoses, dans toutes les cellules du descendant. Les mutations ont lieu au hasard et peuvent toucher n'importe quelle cellule." },
c1: { parts: [
    { t: "task", c: "mod", label: "Surligne au moins trois passages importants dans chaque texte.", okMsg: "Au moins trois passages surlignés dans chaque texte.", done: () => { const a = hlN("L"), b = hlN("D"); return { ok: a >= 3 && b >= 3, msg: `Lamarck : ${a}/3 · Darwin : ${b}/3 passages surlignés au minimum.` }; } },
    { t: "rows", c: "lire", label: "Qui a écrit chaque passage ?", choices: ["Lamarck", "Darwin"],
      rows: [{ txt: "« s'efforcer continuellement d'y atteindre »", a: 0 }, { txt: "« les individus les plus élevés (…) ont souvent pu être conservés en temps de famine »", a: 1 },
        { txt: "« leur font acquérir des dimensions et une forme qu'elles n'eussent jamais obtenues »", a: 0 }, { txt: "« héritant des mêmes particularités corporelles »", a: 1 },
        { txt: "« Il est résulté de cette habitude soutenue depuis longtemps, dans tous les individus de sa race »", a: 0 }, { txt: "« les individus moins favorisés (…) auront été plus exposés à périr »", a: 1 }] },
    { t: "redac", c: "rais", min: 20, label: "Explique avec tes mots ce qui, selon Lamarck, a allongé le cou des girafes.",
      crit: [{ g: "vois", lab: "Tu dis que la girafe s'efforce d'atteindre les feuilles des arbres", re: [/effort|s'efforc|s'etir|etir|atteindre|brout|feuill/] },
        { g: "sais", lab: "Tu dis que le cou s'allonge au cours de la vie, par l'habitude", re: [/allong|grandi|long/, /vie|habitude|longtemps|a force|petit a petit|progressivement|effort/] },
        { g: "deduis", lab: "Tu dis que ce caractère se transmet à ses descendants", re: [/transm|herit|descendan|petits|enfants|generation|race/] }],
      model: "Selon Lamarck, la girafe vit dans des lieux arides : elle doit brouter les feuilles des arbres et s'efforce continuellement de les atteindre. À force d'efforts, son cou s'allonge au cours de sa vie. Ce cou allongé se transmet ensuite à ses descendants, génération après génération." }],
  hints: ["Dans le texte de Lamarck, cherche « s'efforcer », « habitude », « efforts » ; dans celui de Darwin, « naissante », « famine », « héritant ».", "Lamarck parle d'un changement pendant la vie ; Darwin, de différences entre individus et de survie pendant les famines.", "Lamarck, Darwin, Lamarck, Darwin, Lamarck, Darwin · effort → cou allongé pendant la vie → transmis."],
  corr: "Pour Lamarck, la girafe s'efforce d'atteindre les feuilles : son cou s'allonge au cours de sa vie, et ce caractère acquis se retrouve chez ses descendants. Pour Darwin, les girafes naissent déjà différentes ; pendant les famines, les plus hautes survivent plus souvent et ont des descendants qui héritent de leur particularité." },
c2: { parts: [
    { t: "task", c: "mod", label: "Regarde l'animation jusqu'au bout.", okMsg: "Animation regardée jusqu'au bout.", done: () => ({ ok: !!xst().scen, msg: xst().scen ? "Animation regardée jusqu'au bout." : "Touche « Lancer » et regarde les trois étapes." }) },
    { t: "rows", c: "rais", label: "Dans chaque scénario, quand apparaissent les différences de longueur du cou ?", choices: ["Pendant la vie, par l'effort", "Dès la naissance"],
      rows: [{ txt: "Selon Lamarck", a: 0 }, { txt: "Selon Darwin", a: 1 }] },
    { t: "redac", c: "rais", min: 25, label: "Quelle est la grande différence entre les deux scénarios ? Compare-les.",
      crit: [{ g: "vois", lab: "Lamarck : le cou s'allonge pendant la vie, par l'effort", re: [/lamarck/, /effort|pendant (sa|la|leur) vie|s'etir|etir|habitude|s'allong/] },
        { g: "sais", lab: "Darwin : les girafes naissent déjà différentes", re: [/darwin/, /naiss|nait|naissent|deja|differen|variet|plus (grand|haut|long)/] },
        { g: "deduis", lab: "Darwin : la famine élimine surtout les girafes au cou court", re: [/famine|disette/, /meur|mort|perir|surviv|survec|elimin|disparai/] }],
      model: "Selon Lamarck, toutes les girafes s'étirent et leur cou s'allonge pendant leur vie, par l'effort ; leurs petits héritent de ce cou allongé. Selon Darwin, les girafes naissent déjà avec des cous de longueurs différentes : pendant les famines, celles au cou court n'atteignent plus les feuilles et meurent, tandis que les plus hautes survivent et transmettent leur long cou." }],
  hints: ["Touche « Lancer » et compare les deux scénarios étape par étape.", "Chez Lamarck, les cous changent pendant la vie. Chez Darwin, que se passe-t-il pendant la famine ?", "Lamarck : effort, pendant la vie · Darwin : différences dès la naissance, la famine élimine les cous courts."],
  corr: "Selon Lamarck, le cou s'allonge pendant la vie, par l'effort, et les petits héritent de ce cou allongé. Selon Darwin, les différences existent dès la naissance : pendant la famine, les girafes au cou court meurent plus souvent, les plus hautes survivent et transmettent leur long cou." },
d1: { parts: [
    { t: "task", c: "mod", label: "Simule au moins 5 générations pour chacun des deux troupeaux.", okMsg: "Au moins 5 générations simulées pour chaque troupeau.", done: () => { const T = trS(); return { ok: T.f >= 5 && T.t >= 5, msg: `Avec famines : ${T.f}/5 · témoin : ${T.t}/5 générations au minimum.` }; } },
    { t: "num", c: "lire", label: "Hauteur moyenne du troupeau avec famines à la génération 5 (au centième de mètre) ?", unit: "m", ans: () => meanAt("f", 5), tol: 0.011, err: [[v => near(v, meanAt("t", 5), 0.011), "C'est la valeur du troupeau témoin."]] },
    { t: "num", c: "lire", label: "Hauteur moyenne du troupeau témoin à la génération 5 (au centième de mètre) ?", unit: "m", ans: () => meanAt("t", 5), tol: 0.011, err: [[v => near(v, meanAt("f", 5), 0.011), "C'est la valeur du troupeau avec famines."]] },
    { t: "redac", c: "rais", min: 30, label: "Explique pourquoi la hauteur moyenne des girafes augmente avec les famines, mais pas dans le troupeau témoin.",
      crit: [{ g: "vois", lab: "Tu compares : elle augmente avec les famines, elle reste à peu près stable sans famine", re: [/augment|monte|grandi|plus haut|hausse|passe de/, /temoin|sans famine|stable|ne change|pareil|constant|meme|presque pas/] },
        { g: "sais", lab: "Tu dis que pendant les famines, seules les plus hautes atteignent les feuilles et survivent", re: [/surviv|survec|meur|mort|perir|elimin|atteign|feuille/] },
        { g: "deduis", lab: "Tu dis qu'elles transmettent leur grande taille à leurs petits", re: [/transmet|herit|petits|descendan|bebe|generation suivante|enfants/] }],
      model: "Je vois qu'avec des famines, la hauteur moyenne passe de 4,47 m à plus de 4,8 m en 5 générations, alors qu'elle reste vers 4,5 m dans le troupeau témoin. Je sais que pendant une famine, seules les girafes les plus hautes atteignent les dernières feuilles : elles survivent plus souvent, alors que dans le témoin les morts touchent les girafes au hasard. J'en déduis que les survivantes, plus hautes, transmettent leur taille à leurs petits : à chaque génération, le troupeau compte plus de girafes hautes." }],
  hints: ["Choisis « Avec famines » et touche « 5 générations », puis fais de même avec le troupeau témoin. Le tableau est sous le graphique.", "Pendant une famine, regarde la ligne pointillée : quelles girafes atteignent encore les feuilles ? Lesquelles deviennent grises ?", "Avec famines : la moyenne augmente ; témoin : stable · les plus hautes survivent et transmettent leur taille."],
  corr: "Avec des famines, la hauteur moyenne augmente : seules les girafes assez hautes atteignent les dernières feuilles, elles survivent plus souvent et leurs petits héritent de leur taille. Dans le témoin, les morts touchent les girafes au hasard : la hauteur moyenne reste à peu près la même. Aucune girafe ne s'étire dans ce modèle." },
d2: { parts: [
    { t: "rows", c: "conn", label: "Ce que tu as découvert dans les parties 1 et 2 : vrai ou faux ?", choices: ["Vrai", "Faux"],
      rows: [{ txt: "Les mutations apparaissent au hasard, pas parce que l'animal en a besoin.", a: 0 }, { txt: "Une girafe qui étire son cou modifie les allèles de ses spermatozoïdes ou de ses ovules.", a: 1 }, { txt: "Seules les mutations des cellules reproductrices sont transmises aux descendants.", a: 0 }] },
    { t: "redac", c: "rais", min: 40, label: "Lequel des deux naturalistes a raison ? Justifie ta réponse avec ce que tu as découvert dans les parties 1 et 2 : j'observe que…, or…, donc…",
      crit: [{ g: "vois", lab: "Tu rappelles l'idée de Lamarck : l'effort allonge le cou pendant la vie, et ce caractère se transmet", re: [/lamarck/, /effort|s'etir|etir|habitude|exerc|pendant (sa|la) vie|acquis/] },
        { g: "sais", lab: "Tu dis que seules les mutations des gamètes (ovules, spermatozoïdes) sont transmises", re: [/mutation/, /gamete|reproduct|ovule|spermato|sexuel/] },
        { g: "sais", lab: "Tu dis que les mutations apparaissent au hasard, pas selon les besoins", re: [/hasard|aleatoire|pas (parce qu|selon|en fonction)|besoin/] },
        { g: "deduis", lab: "Tu conclus que Darwin a raison (et que Lamarck a tort)", re: [/darwin (a|avait) raison|darwin .{0,40}(raison|correct|juste|vrai)|lamarck .{0,30}(tort|faux|trompe|se trompait|n'a pas raison)/] },
        { g: "deduis", lab: "Tu expliques que les girafes au long cou existaient dès la naissance et ont survécu aux famines", re: [/naiss|nait|naissent|deja|des le depart|allele/, /surviv|survec|conserv|famine|disette|meur|selection/] }],
      model: "J'observe que, selon Lamarck, l'effort de la girafe allonge son cou pendant sa vie et que ce caractère acquis se transmet à ses petits. Or un effort ne modifie pas les allèles des cellules reproductrices : seules les mutations des gamètes (ovules, spermatozoïdes) sont transmises, et elles apparaissent au hasard, pas selon les besoins de l'animal. Donc Lamarck a tort et Darwin a raison : des girafes naissent avec un cou plus long grâce à des allèles différents ; pendant les famines, elles survivent plus souvent et transmettent leur long cou à leurs descendants." }],
  hints: ["Relis le document 4 : quelles mutations sont transmises ? Une cellule du cou est-elle une cellule reproductrice ?", "« J'observe que » : l'idée de Lamarck. « Or » : ce que tu sais des mutations (partie 2). « Donc » : ton verdict et l'explication de Darwin.", "Lamarck : effort → cou allongé transmis ; or seules les mutations des gamètes, au hasard, sont transmises ; donc Darwin a raison."],
  corr: "J'observe que, selon Lamarck, l'effort allonge le cou pendant la vie et que ce caractère acquis se transmet. Or un effort ne modifie pas les allèles des gamètes : seules les mutations des cellules reproductrices sont transmises, et elles apparaissent au hasard. Donc Lamarck a tort et Darwin a raison : des girafes naissent avec un cou plus long ; pendant les famines, elles survivent plus souvent et le transmettent à leurs descendants." },
d3: { parts: [
    { t: "word", c: "conn", label: `Les individus d'une même espèce partagent le même caryotype et les mêmes ${gap}…`, ans: ["gènes", "gène", "genes"], err: [[["allèles", "allèle", "alleles"], "Les allèles, justement, peuvent différer d'un individu à l'autre."]] },
    { t: "word", c: "conn", label: `… mais pas forcément les mêmes ${gap}.`, ans: ["allèles", "allèle", "alleles"], err: [[["gènes", "gène", "genes"], "Tous les individus d'une espèce ont les mêmes gènes."]] },
    { t: "word", c: "conn", label: `Les différences alléliques sont dues à des ${gap}.`, ans: ["mutations", "mutation"] },
    { t: "word", c: "conn", label: `Les ${gap} permettent l'apparition de nouveaux caractères…`, ans: ["mutations", "mutation"] },
    { t: "word", c: "conn", label: `… et, à terme, de nouvelles ${gap}.`, ans: ["espèces", "espèce", "especes"] }],
  hints: ["Partie 1 : qu'est-ce qui est identique chez toutes les drosophiles ? Qu'est-ce qui diffère ?", "Partie 2 : d'où viennent les nouveaux allèles ?", "gènes · allèles · mutations · mutations · espèces."] }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `Le problème : ${PROBLEM}\n${HOME.goal}\n\nFiche mémo à recopier\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
