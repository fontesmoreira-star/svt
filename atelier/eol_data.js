/* ===== 5e EIST · Mission 6 · Tempête de sable · Activité 1 : contenus, d'après la fiche « Mettre en relation des données sur l'énergie éolienne sur Mars » du professeur ===== */
const PROBLEM = "Peut-on utiliser l'énergie éolienne sur Mars pour produire de l'électricité ?";
const gap = `<span class="gap">………</span>`;
const PARA = ["les vents de Mars, même à 160 km/h, sont ressentis comme un vent de moins de 10 km/h sur Terre, soit moins de 2,8 m/s.", "une éolienne ne produit de l'électricité qu'à partir d'un vent de 4 m/s, soit 14,4 km/h.", "le vent martien est trop faible : d'après ces documents, on ne peut pas produire d'électricité avec une éolienne sur Mars."];
const LINK = ["J'observe que…", "Or…", "Donc…"];
const HOME = { slug: "eolienne-sur-mars", short: "L'énergie éolienne sur Mars", last: "d1", lastG: "p4", lastK: 0, dur: "environ 45 minutes",
  kicker: "Mission 6 · Tempête de sable · Activité 1", title: "Des éoliennes pour sauver la base ?",
  intro: "Alerte ! Une tempête de sable a recouvert les panneaux solaires, la seule source d'énergie de la base. L'ingénieure propose d'installer des éoliennes. Bonne idée ? Enquête avec les trois documents.",
  lab: "Le problème à résoudre", goal: "Objectif : répondre au problème dans un paragraphe rédigé : j'observe que…, or…, donc…",
  fact: "En 2018, une tempête de poussière géante a recouvert Mars pendant des semaines. Le robot Opportunity, qui fonctionnait à l'énergie solaire, ne s'est jamais réveillé.",
  parts: "Les quatre étapes de l'enquête", recop: "Fiche mémo à recopier dans le cahier",
  txt: "ACTIVITÉ 1 · PEUT-ON UTILISER L'ÉNERGIE ÉOLIENNE SUR MARS ?\n5e EIST · Mission 6 · Tempête de sable",
  comps: { lire: "Extraire des informations d'un document", mod: "Observer, manipuler", calc: "Calculer, convertir", conn: "Mobiliser ses connaissances", rais: "Raisonner, argumenter" },
  gk: { vois: "J'observe que", sais: "Or", deduis: "Donc" },
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "Je suis les pistes de rédaction, pas à pas, et je construis mon paragraphe avec des étiquettes." },
    l: { icon: "🚀", short: "Experte", name: "Version experte", q: "experte", desc: "Les mêmes documents et manipulations, mais j'écris mes réponses et je rédige seul mon paragraphe." } },
  extraTitle: "Mon paragraphe",
  extra: () => `MON PARAGRAPHE\n${myPara() || "— (pas encore construit)"}\n`,
  extraHTML: () => { const t = myPara(); return t ? `<p class="mypara">${esc(t)}</p>` : `<p class="locked">Ton paragraphe apparaîtra ici quand tu l'auras construit à l'étape 4.</p>`; } };
function myPara() {
  const st = IT().d1; if (!st || !st.v) return "";
  if (EXP()) { const k = ITEMS.d1.it.parts.findIndex(p => p.t === "redac"); return k >= 0 ? String(st.v[k] || "").trim() : ""; }
  const m = st.v[0] || {}; if ([0, 1, 2].some(i => m[i] === undefined)) return "";
  return [0, 1, 2].map(i => `${LINK[i].replace("…", "")} ${PARA[m[i]]}`).join(" ");
}

const DOC1 = { title: "Document 1 · Produire de l'électricité avec le vent", html: `<p>L'éolienne est un dispositif qui transforme l'énergie du vent (énergie primaire de type mécanique) en énergie électrique. Le vent exerce une pression sur les pales du rotor qui se met à tourner.</p><p>On peut classer la vitesse du vent en 3 catégories :</p><ul class="ul"><li><b>Vitesse d'enclenchement</b> : le rotor se met en mouvement dès que le vent atteint 2 m/s (mais jusqu'à 4 m/s, la production d'électricité est nulle).</li><li><b>Vitesse nominale</b> : l'éolienne atteint sa puissance maximale à la vitesse de vent nominale (environ 12 m/s).</li><li><b>Vitesse de déclenchement</b> : en raison des dommages qui seraient causés au rotor par une tempête, l'éolienne freine dès que la vitesse du vent atteint 25 m/s (environ 90 km/h).</li></ul><p>Plus la distance par rapport au sol augmente, plus le vent souffle fort. Par conséquent, plus les éoliennes sont hautes, plus elles peuvent produire d'électricité.</p>` };
const DOC2 = { title: "Document 2 · Données sur Mars", html: `<p>Dans le film <i>Seul sur Mars</i>, les astronautes font face à une violente tempête ! Ce passage est-il réaliste ? Pas complètement…</p><p>Malgré sa faible épaisseur, l'atmosphère de Mars est effectivement balayée par des nuages de poussières, soulevés par des vents pouvant atteindre les 160 km/h ! Ces nuages peuvent obscurcir le ciel pendant plusieurs heures, sachant qu'à la base, Mars reçoit déjà deux fois moins d'énergie solaire que la Terre. Toutefois, en raison de la faible pression atmosphérique, de tels vents seraient ressentis comme de petites brises : leur puissance équivaut à un vent de moins de 10 km/h sur Terre, pas de quoi projeter Matt Damon dans les airs !</p>` };
const DOC3 = { title: "Document 3 · Convertir une vitesse", html: `<p><b>1 m/s = 3,6 km/h</b></p><p>Des m/s vers les km/h : je <b>multiplie</b> par 3,6. Des km/h vers les m/s : je <b>divise</b> par 3,6.</p>` };

const BIL = ["Une éolienne transforme l'énergie <u>mécanique</u> du vent en énergie <u>électrique</u> : le vent pousse les pales, le rotor tourne.",
  "Elle ne produit de l'électricité qu'à partir d'un vent de <u>4 m/s</u> (14,4 km/h). Au-delà de 25 m/s (90 km/h), elle <u>freine</u> pour ne pas s'abîmer.",
  "Convertir une vitesse : m/s <u>× 3,6</u> → km/h ; km/h <u>÷ 3,6</u> → m/s.",
  "Sur Mars, l'atmosphère est très <u>peu épaisse</u> : même un vent de 160 km/h pousse aussi peu qu'une brise de moins de 10 km/h sur Terre (2,8 m/s).",
  "Conclusion : d'après ces documents, le vent martien est trop faible pour produire de l'électricité avec une éolienne. Il faut chercher une <u>autre source d'énergie</u>.",
  "Pour argumenter : <u>j'observe que</u> (je cite les documents), <u>or</u> (je rappelle ce que je sais), <u>donc</u> (je conclus en répondant au problème)."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("");

const GROUPS = [
{ id: "p1", n: 1, icon: "🌬", tab: "L'éolienne", title: "Comment une éolienne produit-elle de l'électricité ?", sub: "Document 1 et la soufflerie · environ 10 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "La soufflerie",
    widget: { title: "Simulation · Une éolienne dans la soufflerie", w: "souffle", sim: "Modèle simplifié" }, docs: [DOC1],
    parts: [
      { t: "task", c: "mod", label: "Teste des vents de plus en plus forts, jusqu'à 30 m/s.", okMsg: "Tous les comportements de l'éolienne sont observés.", done: () => { const n = Object.keys(xst().zones || {}).length; return { ok: n >= 5, msg: `${n}/5 comportements de l'éolienne observés.` }; } },
      { t: "match", c: "lire", label: "Que fait l'éolienne ? Relie chaque vent à ce que tu observes.", ask: "Choisis ce qui se passe pour", rows: [{ e: "🍃", txt: "Vent de 1 m/s", v: "Le rotor ne tourne pas" }, { e: "🌬", txt: "Vent de 3 m/s", v: "Le rotor tourne, mais aucune électricité" }, { e: "💡", txt: "Vent de 8 m/s", v: "Il produit de l'électricité" }, { e: "⚡", txt: "Vent de 15 m/s", v: "Production maximale" }, { e: "⛔", txt: "Vent de 28 m/s", v: "L'éolienne freine et s'arrête" }] },
      { t: "num", c: "lire", label: "Piste 1 · Quelle est la vitesse minimale du vent pour produire de l'électricité ?", unit: "m/s", ans: 4, err: [[v => v === 2, "À 2 m/s, le rotor se met à tourner, mais la production d'électricité est encore nulle."], [v => v === 12, "12 m/s, c'est la vitesse de la puissance maximale."]] },
      { t: "choice", c: "conn", label: "Une éolienne transforme…", o: ["l'énergie mécanique du vent en énergie électrique", "l'énergie électrique en vent", "l'énergie lumineuse du Soleil en énergie électrique"], a: 0, no: { 2: "C'est le rôle d'un panneau solaire." } },
      { t: "choice", c: "lire", label: "Pourquoi construit-on des éoliennes très hautes ?", o: ["Plus on est haut, plus le vent souffle fort : elles produisent plus d'électricité", "Pour qu'on les voie de loin", "Pour que les pales ne touchent pas les arbres"], a: 0 }],
    hints: ["Touche les boutons 1, 3, 8, 15 et 28 m/s, puis regarde le rotor, la lampe et la barre.", "Relis les trois catégories du document 1 : enclenchement (2 m/s), production à partir de 4 m/s, puissance maximale (12 m/s), freinage (25 m/s).", "1 m/s : ne tourne pas · 3 m/s : tourne sans électricité · 8 m/s : produit · 15 m/s : maximum · 28 m/s : freine. Minimum : 4 m/s."],
    corr: "Le rotor tourne dès 2 m/s, mais l'éolienne ne produit de l'électricité qu'à partir de 4 m/s. Sa production est maximale vers 12 m/s ; au-delà de 25 m/s, elle freine pour ne pas s'abîmer. Elle transforme l'énergie mécanique du vent en énergie électrique. Plus elle est haute, plus le vent est fort, plus elle produit." }] },

{ id: "p2", n: 2, icon: "🔁", tab: "Convertir", title: "Convertir une vitesse", sub: "Document 3 et la double échelle · environ 10 minutes.",
  items: [
  { id: "b1", lvl: "mid", title: "Des m/s aux km/h", docs: [DOC3],
    widget: { title: "Outil · La double échelle des vitesses", w: "echelle" },
    parts: [
      { t: "task", c: "mod", label: "Place le curseur sur 4 m/s.", okMsg: "Le curseur est sur 4 m/s.", done: () => ({ ok: xst().ech === 4, msg: xst().ech === 4 ? "Le curseur est sur 4 m/s." : "Le curseur n'est pas encore sur 4 m/s." }) },
      { t: "choice", c: "lire", label: "Sur l'échelle du bas, 4 m/s correspond à…", o: ["entre 10 et 20 km/h", "entre 0 et 10 km/h", "entre 30 et 40 km/h"], a: 0 },
      { t: "num", c: "calc", label: "Piste 2 · Calcule : 4 m/s, cela fait combien de km/h ?", unit: "km/h", ans: 14.4, tol: 0.05, err: [[v => near(v, 1.11, 0.02), "Tu as divisé. Des m/s vers les km/h, on multiplie par 3,6."], [v => v === 240, "On ne multiplie pas par 60 : utilise le document 3."]] },
      { t: "num", c: "calc", label: "Vérifie le document 1 : 25 m/s, cela fait combien de km/h ?", unit: "km/h", ans: 90, err: [[v => near(v, 6.94, 0.05), "Tu as divisé : multiplie par 3,6."]] },
      { t: "num", c: "calc", label: "Et 10 km/h, combien de m/s ? Arrondis au dixième.", unit: "m/s", ans: 2.8, tol: 0.11, err: [[v => v === 36, "Tu as multiplié. Des km/h vers les m/s, on divise par 3,6."]] }],
    hints: ["Déplace le curseur jusqu'au trait 4 de l'échelle du haut et lis l'échelle du bas.", "4 × 3,6 = ? · 25 × 3,6 = ? · pour 10 km/h, on fait l'inverse : 10 ÷ 3,6.", "14,4 km/h · 90 km/h · 10 ÷ 3,6 ≈ 2,8 m/s."],
    corr: "4 m/s × 3,6 = 14,4 km/h : c'est le vent minimal pour produire de l'électricité. 25 m/s × 3,6 = 90 km/h, comme l'indique le document 1. 10 km/h ÷ 3,6 ≈ 2,8 m/s (2,77… arrondi au dixième)." }] },

{ id: "p3", n: 3, icon: "🪐", tab: "Le vent martien", title: "Le vent sur Mars", sub: "Document 2 et l'animation · environ 10 minutes.",
  items: [
  { id: "c1", lvl: "mid", title: "Une tempête… qui pousse comme une brise", docs: [DOC2],
    widget: { title: "Animation · La même éolienne sur Terre et sur Mars", w: "deuxvents", sim: "Modèle simplifié" },
    parts: [
      { t: "choice", c: "lire", label: "D'après le document 2, les vents de Mars peuvent atteindre…", o: ["160 km/h", "10 km/h", "90 km/h"], a: 0 },
      { t: "choice", c: "lire", label: "Pourtant, ces vents sont ressentis comme…", o: ["une petite brise : un vent de moins de 10 km/h sur Terre", "une violente tempête qui emporte tout", "un vent de 160 km/h sur Terre"], a: 0 },
      { t: "choice", c: "rais", label: "Pourquoi ? Regarde les points blancs de l'animation.", o: ["L'atmosphère de Mars est très peu épaisse (faible pression) : il y a peu d'air pour pousser les pales", "Il fait trop froid sur Mars", "Il n'y a pas du tout d'air sur Mars"], a: 0, no: { 2: "Il y a de l'air sur Mars, mais très peu : l'atmosphère est très peu épaisse." } },
      { t: "choice", c: "rais", label: "Piste 3 · Le vent martien « ressenti » (moins de 2,8 m/s) suffit-il à produire de l'électricité ?", o: ["Non : il est plus faible que 4 m/s, la vitesse minimale de production", "Oui : 160 km/h, c'est très fort", "Oui : il dépasse 2 m/s, donc le rotor tourne"], a: 0, no: { 1: "160 km/h, c'est la vitesse réelle ; mais ce vent pousse aussi peu qu'une brise de moins de 10 km/h.", 2: "Le rotor tourne dès 2 m/s, mais la production reste nulle jusqu'à 4 m/s." } },
      { t: "choice", c: "lire", label: "Pourquoi la base a-t-elle besoin d'une autre source d'énergie pendant une tempête ?", o: ["La poussière couvre les panneaux et obscurcit le ciel, alors que Mars reçoit déjà deux fois moins d'énergie solaire que la Terre", "Les panneaux solaires ne marchent jamais sur Mars", "La tempête casse toujours les panneaux"], a: 0 }],
    hints: ["Relis le document 2 en cherchant les deux vitesses : la vitesse réelle et la vitesse « ressentie ».", "Dans l'animation, compare le nombre de points blancs sur Terre et sur Mars : sur Mars, très peu d'air pousse les pales.", "160 km/h · une petite brise de moins de 10 km/h · atmosphère très peu épaisse · 2,8 m/s < 4 m/s : non · la poussière cache le Soleil."],
    corr: "Les vents martiens peuvent atteindre 160 km/h, mais l'atmosphère est très peu épaisse : ils poussent aussi peu qu'une brise de moins de 10 km/h sur Terre, soit moins de 2,8 m/s. C'est moins que les 4 m/s nécessaires pour produire de l'électricité. Pendant une tempête, la poussière couvre les panneaux et cache un Soleil déjà deux fois plus faible que sur Terre." }] },

{ id: "p4", n: 4, icon: "✍", tab: "Ma réponse", title: "Répondre au problème", sub: "Le paragraphe argumenté, puis la fiche mémo · environ 15 minutes.",
  items: [
  { id: "d1", lvl: "hard", title: "Mon paragraphe : j'observe que, or, donc", recop: true, docs: [DOC1, DOC2],
    intro: `<div class="box key"><p class="lab">✔ Point méthode · Argumenter</p><p>${nb("<b>J'observe que</b> : je cite le document. <b>Or</b> : je rappelle ce que je sais (un autre document). <b>Donc</b> : je conclus en répondant au problème.")}</p></div>`,
    parts: [
      { t: "match", c: "rais", label: "Construis ton paragraphe : place chaque morceau de phrase après le bon mot de liaison.", ask: "Choisis la suite de", rows: LINK.map((l, i) => ({ e: String(i + 1), txt: l, v: PARA[i] })) },
      { t: "choice", c: "rais", label: "Quelle est la réponse au problème ?", o: ["Non : d'après ces documents, le vent martien est trop faible pour qu'une éolienne produise de l'électricité", "Oui : les vents martiens atteignent 160 km/h", "Oui : le rotor tourne dès 2 m/s"], a: 0 }],
    hints: ["« J'observe que » : ce que dit le document 2 sur Mars. « Or » : ce que dit le document 1 sur l'éolienne. « Donc » : la réponse au problème.", "Le paragraphe compare deux vitesses : 2,8 m/s (Mars) et 4 m/s (le minimum).", "J'observe que les vents martiens sont ressentis comme moins de 2,8 m/s ; or il faut 4 m/s ; donc pas d'électricité éolienne sur Mars."],
    corr: "J'observe que les vents de Mars, même à 160 km/h, sont ressentis comme un vent de moins de 10 km/h sur Terre, soit moins de 2,8 m/s. Or une éolienne ne produit de l'électricité qu'à partir d'un vent de 4 m/s (14,4 km/h). Donc, d'après ces documents, le vent martien est trop faible : on ne peut pas produire d'électricité avec une éolienne sur Mars. Recopie ton paragraphe et la fiche mémo dans ton cahier." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Un panneau solaire transforme…", o: ["l'énergie lumineuse en énergie électrique", "l'énergie électrique en lumière", "le vent en électricité"], a: 0 },
    { t: "choice", c: "conn", label: "Pour passer d'une vitesse en m/s à une vitesse en km/h, on…", o: ["multiplie par 3,6", "divise par 3,6", "multiplie par 60"], a: 0 },
    { t: "choice", c: "conn", label: "Quelle relation permet de calculer une vitesse ?", o: ["v = d ÷ t", "v = d × t", "v = t ÷ d"], a: 0 }],
  hints: ["Le panneau solaire reçoit la lumière du Soleil.", "1 m/s = 3,6 km/h.", "Lumineuse → électrique · × 3,6 · v = d ÷ t."],
  corr: "Un panneau solaire transforme l'énergie lumineuse en énergie électrique. Des m/s aux km/h, on multiplie par 3,6. La vitesse se calcule avec v = d ÷ t." };

/* ===== VERSION EXPERTE : mêmes documents et manipulations, réponses écrites et paragraphe rédigé ===== */
const EXPERT = {
r0: { parts: [
    { t: "word", c: "conn", label: `Un panneau solaire transforme l'énergie ${gap} en énergie électrique.`, ans: ["lumineuse", "lumière", "solaire", "radiante"] },
    { t: "num", c: "calc", label: "Convertis 10 m/s en km/h.", unit: "km/h", ans: 36, err: [[v => near(v, 2.78, 0.02), "Tu as divisé : des m/s vers les km/h, on multiplie par 3,6."]] },
    { t: "word", c: "conn", label: `Pour calculer une vitesse : v = d ${gap} t.`, ans: ["÷", "/", ":", "divisé par", "divise par", "divisé"] }],
  hints: ["Le panneau solaire reçoit la lumière du Soleil.", "1 m/s = 3,6 km/h.", "Lumineuse · 36 km/h · v = d ÷ t."] },
a1: { parts: [
    { t: "task", c: "mod", label: "Teste des vents de plus en plus forts, jusqu'à 30 m/s.", okMsg: "Tous les comportements de l'éolienne sont observés.", done: () => { const n = Object.keys(xst().zones || {}).length; return { ok: n >= 5, msg: `${n}/5 comportements de l'éolienne observés.` }; } },
    { t: "num", c: "lire", label: "Piste 1 · Quelle est la vitesse minimale du vent pour produire de l'électricité ?", unit: "m/s", ans: 4, err: [[v => v === 2, "À 2 m/s, le rotor se met à tourner, mais la production d'électricité est encore nulle."], [v => v === 12, "12 m/s, c'est la vitesse de la puissance maximale."]] },
    { t: "word", c: "conn", label: `Une éolienne transforme l'énergie ${gap} du vent en énergie électrique.`, ans: ["mécanique", "cinétique", "de mouvement"], err: [[["électrique"], "L'énergie électrique est ce que l'éolienne produit."], [["lumineuse", "solaire"], "C'est l'énergie du panneau solaire."]] },
    { t: "redac", c: "rais", min: 12, label: "Explique pourquoi l'éolienne s'arrête quand le vent dépasse 25 m/s.",
      crit: [{ g: "vois", lab: "Tu cites la vitesse de 25 m/s (90 km/h)", re: [/25|90/] },
        { g: "sais", lab: "Tu dis qu'un vent trop fort abîmerait le rotor", re: [/abim|dommage|cass|endommag|detrui|degat|degrad|briser|arrach/] },
        { g: "deduis", lab: "Tu dis que l'éolienne freine pour se protéger", re: [/frein|arret|stop|protege|bloqu/] }],
      model: "J'observe qu'à partir de 25 m/s (90 km/h), le vent est celui d'une tempête. Or un vent aussi fort abîmerait le rotor. Donc l'éolienne freine et s'arrête pour se protéger." }],
  hints: ["Teste 1, 3, 8, 15 et 28 m/s : regarde le rotor, la lampe et le panneau rouge.", "Le document 1 parle de « vitesse de déclenchement » et de « dommages ».", "4 m/s · énergie mécanique · au-delà de 25 m/s, le rotor serait abîmé : l'éolienne freine."],
  corr: "L'éolienne ne produit de l'électricité qu'à partir de 4 m/s. Elle transforme l'énergie mécanique du vent en énergie électrique. Au-delà de 25 m/s (90 km/h), le vent abîmerait le rotor : l'éolienne freine pour se protéger." },
b1: { parts: [
    { t: "task", c: "mod", label: "Place le curseur sur 4 m/s.", okMsg: "Le curseur est sur 4 m/s.", done: () => ({ ok: xst().ech === 4, msg: xst().ech === 4 ? "Le curseur est sur 4 m/s." : "Le curseur n'est pas encore sur 4 m/s." }) },
    { t: "num", c: "calc", label: "Piste 2 · Convertis 4 m/s en km/h.", unit: "km/h", ans: 14.4, tol: 0.05, err: [[v => near(v, 1.11, 0.02), "Tu as divisé. Des m/s vers les km/h, on multiplie par 3,6."]] },
    { t: "num", c: "calc", label: "Convertis 10 km/h en m/s, au dixième près.", unit: "m/s", ans: 2.8, tol: 0.11, err: [[v => v === 36, "Tu as multiplié. Des km/h vers les m/s, on divise par 3,6."]] },
    { t: "num", c: "calc", label: "Défi · Les vents de tempête martiens (160 km/h) : combien de m/s ? Arrondis à l'unité.", unit: "m/s", ans: 44, tol: 0.6, err: [[v => near(v, 576, 1), "Tu as multiplié. Des km/h vers les m/s, on divise par 3,6."]] }],
  hints: ["Vérifie d'abord sur la double échelle l'ordre de grandeur attendu.", "Des m/s vers les km/h : × 3,6. Des km/h vers les m/s : ÷ 3,6.", "4 × 3,6 = 14,4 km/h · 10 ÷ 3,6 ≈ 2,8 m/s · 160 ÷ 3,6 ≈ 44 m/s."],
  corr: "4 m/s × 3,6 = 14,4 km/h. 10 km/h ÷ 3,6 ≈ 2,8 m/s. 160 km/h ÷ 3,6 ≈ 44 m/s : c'est la vitesse réelle des vents de tempête martiens, mais ils poussent aussi peu qu'une brise à cause de l'atmosphère très peu épaisse." },
c1: { parts: [
    { t: "num", c: "lire", label: "Vitesse maximale des vents de tempête sur Mars (document 2) ?", unit: "km/h", ans: 160 },
    { t: "num", c: "lire", label: "Ces vents sont ressentis comme un vent terrestre de moins de combien de km/h ?", unit: "km/h", ans: 10 },
    { t: "redac", c: "rais", min: 18, label: "Explique pourquoi une tempête martienne à 160 km/h ne projetterait pas Matt Damon dans les airs.",
      crit: [{ g: "vois", lab: "Tu cites le vent ressenti : moins de 10 km/h, une petite brise", re: [/10 ?km|brise|faible|ressenti|2[,.][78]/] },
        { g: "sais", lab: "Tu expliques que l'atmosphère de Mars est très peu épaisse (faible pression, peu d'air)", re: [/epaiss|pression|peu d'air|tres peu|fine|mince|leger|dense|rare/] },
        { g: "deduis", lab: "Tu en déduis que l'air pousse très peu", re: [/pousse|force|souffl|emport|projet|renvers|souleve/, /peu|faible|pas assez|pas de quoi|brise|doucement|legere/] }],
      model: "J'observe que les vents martiens peuvent atteindre 160 km/h, mais qu'ils sont ressentis comme une brise de moins de 10 km/h. Or l'atmosphère de Mars est très peu épaisse : il y a très peu d'air. Donc ce vent pousse très peu et ne projetterait pas un astronaute dans les airs." },
    { t: "choice", c: "lire", label: "Pourquoi la base a-t-elle besoin d'une autre source d'énergie pendant une tempête ?", o: ["La poussière couvre les panneaux et obscurcit le ciel, alors que Mars reçoit déjà deux fois moins d'énergie solaire que la Terre", "Les panneaux solaires ne marchent jamais sur Mars", "La tempête casse toujours les panneaux"], a: 0 }],
  hints: ["Relis le document 2 : cherche la vitesse réelle et la vitesse « ressentie ».", "Dans l'animation, compare le nombre de points blancs (l'air) sur Terre et sur Mars.", "160 km/h · 10 km/h · peu d'air : le vent pousse comme une brise · la poussière cache le Soleil."],
  corr: "Les vents martiens peuvent atteindre 160 km/h mais, l'atmosphère étant très peu épaisse, ils poussent aussi peu qu'une brise de moins de 10 km/h sur Terre. Pendant une tempête, la poussière couvre les panneaux et cache un Soleil déjà deux fois plus faible que sur Terre." },
d1: { parts: [
    { t: "redac", c: "rais", min: 35, label: "Réponds au problème dans un paragraphe rédigé : j'observe que…, or…, donc… Utilise les trois documents.",
      crit: [{ g: "vois", lab: "Tu cites le vent martien ressenti : moins de 10 km/h, ou environ 2,8 m/s", re: [/10 ?km|2[,.][78]|brise/] },
        { g: "sais", lab: "Tu cites la vitesse minimale de production : 4 m/s (14,4 km/h)", re: [/\b4 ?m|14[,.]4/] },
        { g: "deduis", lab: "Tu compares les deux vitesses", re: [/inferieur|plus (faible|petit|lent)|moins (fort|rapide|vite|que|de 4|eleve)|trop (faible|lent|petit)|pas assez|n'atteint pas|n'atteignent pas|en dessous|en-dessous/] },
        { g: "deduis", lab: "Tu réponds au problème : pas d'électricité éolienne sur Mars", re: [/(pas|impossible|ne peut|ne pourra|aucune|nulle)/, /(electricit|eolien|energie)/] },
        { g: "deduis", lab: "Tu utilises les mots de liaison « or » et « donc »", re: [/\bor\b/, /\bdonc\b/] }],
      model: "J'observe que les vents de Mars, même lorsqu'ils atteignent 160 km/h, sont ressentis comme un vent de moins de 10 km/h sur Terre, soit environ 2,8 m/s, car l'atmosphère martienne est très peu épaisse. Or une éolienne ne produit de l'électricité qu'à partir d'un vent de 4 m/s, soit 14,4 km/h. Donc le vent martien est trop faible : d'après ces documents, on ne peut pas utiliser l'énergie éolienne sur Mars pour produire de l'électricité." }],
  hints: ["« J'observe que » : le document 2 (le vent martien ressenti). « Or » : le document 1 (le minimum pour produire). « Donc » : la réponse au problème.", "Pense à convertir pour comparer dans la même unité : 10 km/h ≈ 2,8 m/s, à comparer à 4 m/s.", "J'observe que le vent martien est ressenti comme moins de 2,8 m/s. Or il faut au moins 4 m/s. Donc on ne peut pas produire d'électricité éolienne sur Mars."],
  corr: "J'observe que les vents de Mars, même à 160 km/h, sont ressentis comme un vent de moins de 10 km/h sur Terre, soit environ 2,8 m/s. Or une éolienne ne produit de l'électricité qu'à partir de 4 m/s (14,4 km/h). Donc, d'après ces documents, le vent martien est trop faible : on ne peut pas utiliser l'énergie éolienne sur Mars pour produire de l'électricité. Recopie ton paragraphe et la fiche mémo dans ton cahier." }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `Le problème : ${PROBLEM}\n${HOME.goal}\n\nFiche mémo à recopier\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
