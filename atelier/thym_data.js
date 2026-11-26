/* ===== 5e EIST · Mission 6 · Tempête de sable · Technologie · Activité 2 : contenus, d'après la fiche « Découvrir la programmation avec les robots Thymio » et le diaporama Mission 6 du professeur ===== */
const PROBLEM = "Comment un robot réagit-il à ce qui l'entoure, et comment le programmer ?";
const gap = `<span class="gap">………</span>`;
const HOME = { slug: "decouvrir-thymio", short: "Découvrir la programmation avec Thymio", last: "d1", lastG: "p4", lastK: 0, dur: "environ 55 minutes, en une ou deux séances",
  kicker: "Mission 6 · Tempête de sable · Phase 2 · Activité 2", title: "Un robot pour nettoyer les panneaux solaires",
  intro: "Les éoliennes ne marcheront pas sur Mars : il faut dégager les panneaux solaires recouverts de sable. Dehors, la tempête rend la sortie dangereuse… Les astronautes vont confier le travail à un robot. Avant de le programmer, découvre comment il perçoit son environnement et comment il décide de ce qu'il fait.",
  lab: "Le problème à résoudre", goal: "Objectif : décrire le comportement du robot Thymio avec des instructions logiques SI… ALORS…, puis programmer le robot nettoyeur.",
  fact: "Sur Mars, les robots ne peuvent pas être pilotés en direct : un message radio met de 3 à 22 minutes environ pour aller de la Terre à Mars. Ils doivent donc réagir seuls, grâce à leurs capteurs et à leur programme.",
  parts: "Les quatre étapes de la mission", recop: "Fiche mémo à recopier dans le cahier",
  txt: "ACTIVITÉ 2 · DÉCOUVRIR LA PROGRAMMATION AVEC LES ROBOTS THYMIO\n5e EIST · Mission 6 · Tempête de sable · Technologie",
  comps: { obs: "Observer, manipuler", voc: "Utiliser le vocabulaire de la technologie", algo: "Décrire un comportement par des instructions logiques", prog: "Programmer, tester, corriger", conn: "Mobiliser ses connaissances" },
  gk: { vois: "Instruction observée", sais: "Vocabulaire", deduis: "Écriture SI… ALORS…" },
  howL: `<li>Écris tes instructions comme sur la fiche : <b>SI</b> … <b>ALORS</b> …, une par ligne. Touche <b>Vérifier</b> : l'application repère les éléments attendus (un point par élément). Seul le premier essai compte, puis tu complètes librement.</li><li>Le repérage est automatique (mots-clés) : ton professeur lit tes réponses rédigées dans ton bilan.</li>`,
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "J'observe le robot, puis je relie et je choisis les bonnes étiquettes pour construire les instructions." },
    l: { icon: "🚀", short: "Experte", name: "Version experte", q: "experte", desc: "Les mêmes manipulations, mais j'écris moi-même les noms et les instructions SI… ALORS…" } },
  extraTitle: "Mon programme du robot nettoyeur",
  extra: () => `MON PROGRAMME DU ROBOT NETTOYEUR\n${progTxt().join("\n")}\nTest : ${xst().pisteOk ? "réussi (le robot s'est arrêté aux panneaux)" : "pas encore réussi"} · ${xst().pisteRuns || 0} essai(s)\n`,
  extraHTML: () => `<ol class="ul">${progTxt().map(x => `<li>${esc(x)}</li>`).join("")}</ol><p class="lead">${xst().pisteOk ? "✓ Test réussi : le robot s'est arrêté aux panneaux solaires." : "Pas encore de test réussi (partie 4)."} ${xst().pisteRuns || 0} essai(s).</p>` };

/* ---------- repérage des instructions rédigées (version experte) ---------- */
const SEGS = n => n.split(/[.;!?\n]+|(?=\bsi\b)/);
/* vrai si un morceau de la réponse contient la condition c, puis l'action a (cherchée après « alors » ou une virgule) */
const RULE = (c, a) => (T, n) => SEGS(n).some(s => { const i = s.search(c); if (i < 0) return false; const r = s.slice(i), j = r.search(/\balors\b|,/); return a.test(j >= 0 ? r.slice(j) : r); });
const AC = { av: /avanc|en avant|tout droit|vers l.avant/, rec: /recul|en arriere|marche arriere/, td: /(tourn|pivot|vir|braqu|va|part|dirig)\w*.*droite/, tg: /(tourn|pivot|vir|braqu|va|part|dirig)\w*.*gauche/,
  rg: /(recul|en arriere|marche arriere).*gauche/, rd: /(recul|en arriere|marche arriere).*droite/, st: /arret|stop|immobil|ne bouge (plus|pas)|freine/ };
const CO = { dev: /devant|en face/, dr: /droite/, ga: /gauche/, der: /derriere|dans son dos/, rien: /\brien\b|aucun|pas d.?objet|ne detecte pas|ne voit rien/, vide: /vide|bord|trou|tomb|dessous|precipice|plus de (sol|table)/,
  fav: /(fleche|touche|bouton)(?:(?!alors)[^,])*?(avant|haut|devant)/, far: /(fleche|touche|bouton)(?:(?!alors)[^,])*?(arriere|bas)/, fdr: /(fleche|touche|bouton)(?:(?!alors)[^,])*?droite/, fga: /(fleche|touche|bouton)(?:(?!alors)[^,])*?gauche/,
  n2: /(deux|2|les capteurs|tous)(?:(?!alors)[^,])*?noir/, b2: /(deux|2|les capteurs|tous)(?:(?!alors)[^,])*?blanc/, gb: /gauche(?:(?!alors)[^,]){0,30}blanc|blanc(?:(?!alors)[^,]){0,30}gauche/, db: /droit(?:(?!alors)[^,]){0,30}blanc|blanc(?:(?!alors)[^,]){0,30}droit/ };
const SIAL = { g: "deduis", lab: "Tu écris des instructions avec SI et ALORS", re: [/\bsi\b/, /\balors\b/] };
const R = (lab, c, a) => ({ g: "vois", lab, re: [RULE(c, a)] });

const DOC_VOC = { title: "Document · Le vocabulaire de la technologie", html: `<ul class="ul"><li>Un <b>capteur</b> prélève une information sur l'environnement du robot : il « sent » (un toucher, un obstacle, le sol…).</li><li>Un <b>actionneur</b> agit sur l'environnement : il produit un mouvement, de la lumière ou un son.</li><li>Entre les deux, le <b>programme</b> décide de ce que fait le robot.</li></ul>` };
const DOC_INSTR = { title: "Document · Une instruction logique", html: `<p>Le robot Thymio possède plusieurs programmes préenregistrés. Exemple en <b>mode rouge</b> :</p><p class="instr"><b>SI</b> Thymio détecte un objet devant lui <b>ALORS</b> il recule.</p>` };
const DOC_MODES = { title: "Document · Les programmes préenregistrés", html: `<p>Le robot Thymio possède plusieurs programmes préenregistrés. Chacun d'eux correspond à un comportement différent, identifiable par la couleur du robot : <b>Amical</b>, <b>Explorateur</b>, <b>Obéissant</b>, <b>Peureux</b>…</p>` };
const DOC_LIGNE = { title: "Document · Le robot nettoyeur", html: `<p>Ses deux <b>capteurs au sol</b> voient si le sol est <b>blanc</b> (clair) ou <b>noir</b> (foncé). Au départ, les deux capteurs sont sur la ligne noire.</p>` };

const BIL = ["Un robot <u>perçoit</u> son environnement grâce à ses <u>capteurs</u> : touches, capteurs de proximité, capteurs au sol.",
  "Il <u>agit</u> sur son environnement grâce à ses <u>actionneurs</u> : roues (moteurs), LED, haut-parleur.",
  "Entre les deux, le <u>programme</u> décide. Il est fait d'<u>instructions logiques</u>.",
  "Une instruction logique s'écrit : <u>SI</u> un capteur détecte quelque chose, <u>ALORS</u> le robot réalise une action grâce à ses actionneurs.",
  "Exemple (mode rouge) : SI Thymio détecte un objet devant lui, ALORS il recule.",
  "Chaque couleur de Thymio est un programme préenregistré : vert = <u>amical</u>, rouge = <u>peureux</u>, jaune = <u>explorateur</u>, violet = <u>obéissant</u>.",
  "Programmer, c'est écrire le programme, le <u>tester</u>, observer, puis le <u>corriger</u>."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("");

const MROUGE = [{ e: "⬆", txt: "SI Thymio détecte un objet devant lui", v: "ALORS il recule" }, { e: "➡", txt: "SI Thymio détecte un objet à droite", v: "ALORS il recule en tournant à gauche" }, { e: "⬅", txt: "SI Thymio détecte un objet à gauche", v: "ALORS il recule en tournant à droite" }, { e: "⬇", txt: "SI Thymio détecte un objet derrière lui", v: "ALORS il avance" }];
const MVERT = [{ e: "⬆", txt: "SI Thymio détecte un objet devant lui", v: "ALORS il avance" }, { e: "➡", txt: "SI Thymio détecte un objet à droite", v: "ALORS il tourne à droite" }, { e: "⬅", txt: "SI Thymio détecte un objet à gauche", v: "ALORS il tourne à gauche" }];
const MVIOLET = [{ e: "▲", txt: "SI on appuie sur la flèche avant", v: "ALORS il avance" }, { e: "▼", txt: "SI on appuie sur la flèche arrière", v: "ALORS il recule" }, { e: "▶", txt: "SI on appuie sur la flèche de droite", v: "ALORS il tourne à droite" }, { e: "◀", txt: "SI on appuie sur la flèche de gauche", v: "ALORS il tourne à gauche" }];
const MJAUNE = [{ e: "➡", txt: "SI Thymio détecte un objet à droite", v: "ALORS il tourne à gauche" }, { e: "⬅", txt: "SI Thymio détecte un objet à gauche", v: "ALORS il tourne à droite" }, { e: "⬆", txt: "SI Thymio détecte un objet devant lui", v: "ALORS il recule" }, { e: "🚫", txt: "SI Thymio ne détecte rien", v: "ALORS il avance" }, { e: "⬛", txt: "SI Thymio détecte du vide en dessous", v: "ALORS il s'arrête" }];
const MODEL = rows => rows.map(r => `${r.txt} ${r.v}.`).join("<br>");
const NAMEQ = (a, why) => ({ t: "choice", c: "algo", label: "Quel nom donnerais-tu à ce mode ?", o: ["Peureux : il fuit les objets", "Amical : il suit les objets", "Explorateur : il se promène sans rien heurter ni tomber"], a, no: why });
const taskSeen = (key, n, label, ok) => ({ t: "task", c: "obs", label, okMsg: ok, done: () => { const k = nSeen(key); return { ok: k >= n, msg: `${k}/${n} situations observées.` }; } });

const GROUPS = [
{ id: "p1", n: 1, icon: "🤖", tab: "Le robot", title: "De quoi le robot est-il fait ?", sub: "Les quatre vues du robot, puis la chaîne d'information · environ 15 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "Les pièces du robot", intro: "Le robot Thymio est le robot d'entraînement de la base. Avant de lui confier les panneaux solaires, apprends à le connaître.",
    widget: { title: "Schéma interactif · Le robot Thymio sous quatre angles", w: "anatomie" },
    parts: [
      { t: "task", c: "obs", label: "Teste les six numéros (change de vue pour tous les trouver).", okMsg: "Les six numéros sont testés.", done: () => { const n = Object.keys(xst().anat || {}).length; return { ok: n >= 6, msg: `${n}/6 numéros testés.` }; } },
      { t: "match", c: "voc", label: "Relie chaque numéro à son nom.", ask: "Choisis le nom du", rows: [{ e: "①", txt: "numéro 1 (vue du dessus)", v: "Touches (flèches et bouton central)" }, { e: "②", txt: "numéro 2 (vue du dessus)", v: "LED (lumières)" }, { e: "③", txt: "numéro 3 (vue du dessous)", v: "Haut-parleur" }, { e: "④", txt: "numéro 4", v: "Roues" }, { e: "⑤", txt: "numéro 5 (vues de devant et de derrière)", v: "Capteurs de proximité" }, { e: "⑥", txt: "numéro 6 (vue du dessous)", v: "Capteurs au sol" }] },
      { t: "num", c: "obs", label: "Vue de devant : combien de capteurs de proximité compte-t-on ?", ans: 5, err: [[v => v === 7, "7, c'est le total avec l'arrière : compte seulement ceux de devant."], [v => v === 2, "2, ce sont ceux de derrière."]] },
      { t: "num", c: "obs", label: "Et sur la vue de derrière ?", ans: 2 }],
    hints: ["Touche chaque numéro dans chacune des quatre vues : les numéros 3 et 6 sont sous le robot.", "Ce qui s'allume : les LED. Ce qui fait « bip » : le haut-parleur. Ce qui « sent » la main sans la toucher : les capteurs de proximité. Ce qui est tourné vers le sol : les capteurs au sol.", "① touches · ② LED · ③ haut-parleur · ④ roues · ⑤ capteurs de proximité · ⑥ capteurs au sol · 5 capteurs devant, 2 derrière."],
    corr: "① les touches (quatre flèches et un bouton central) · ② les LED · ③ le haut-parleur · ④ les roues · ⑤ les capteurs de proximité : 5 à l'avant et 2 à l'arrière · ⑥ les deux capteurs au sol." },
  { id: "a2", lvl: "mid", title: "Capteur ou actionneur ?", docs: [DOC_VOC],
    widget: { title: "Animation · Le trajet de l'information dans le robot", w: "chaine" },
    parts: [
      taskSeen("chaine", 3, "Observe les trois situations.", "Les trois situations sont observées."),
      { t: "rows", c: "voc", label: "Pour chaque élément du robot : capteur ou actionneur ?", choices: ["📥 Capteur", "📤 Actionneur"], rows: [{ txt: "👆 Touches", a: 0 }, { txt: "⚙ Roues (moteurs)", a: 1 }, { txt: "📡 Capteurs de proximité", a: 0 }, { txt: "💡 LED", a: 1 }, { txt: "🔦 Capteurs au sol", a: 0 }, { txt: "🔊 Haut-parleur", a: 1 }] },
      { t: "rows", c: "voc", label: "Complète les phrases de la fiche.", rows: [{ txt: "Le robot interagit avec son environnement (il le perçoit) par l'intermédiaire de ses…", o: ["capteurs", "actionneurs"], a: 0 }, { txt: "Il réagit alors par l'intermédiaire de ses…", o: ["capteurs", "actionneurs"], a: 1 }] },
      { t: "choice", c: "conn", label: "Entre les capteurs et les actionneurs, qu'est-ce qui décide de ce que fait le robot ?", o: ["Le programme", "Les roues", "La personne qui le regarde"], a: 0 }],
    hints: ["Dans l'animation, l'information entre en bleu et le robot agit en orange.", "Ce qui « sent » (toucher, obstacle, sol) est un capteur. Ce qui produit un mouvement, de la lumière ou un son est un actionneur.", "Capteurs : touches, capteurs de proximité, capteurs au sol. Actionneurs : roues (moteurs), LED, haut-parleur. Le programme décide."],
    corr: "Les capteurs prélèvent une information sur l'environnement : touches, capteurs de proximité, capteurs au sol. Les actionneurs agissent sur l'environnement : roues (et leurs moteurs), LED, haut-parleur. Le robot interagit avec son environnement par l'intermédiaire de ses capteurs et réagit par l'intermédiaire de ses actionneurs. Entre les deux, c'est le programme qui décide." }] },

{ id: "p2", n: 2, icon: "🧠", tab: "SI… ALORS…", title: "Parler le langage des robots : SI… ALORS…", sub: "L'instruction logique, puis tout le mode rouge · environ 12 minutes.",
  items: [
  { id: "b1", lvl: "easy", title: "Une instruction logique", docs: [DOC_INSTR],
    widget: { title: "Simulation · Thymio en mode rouge, vu du dessus", w: "arena_rouge1", sim: "Modèle simplifié" },
    parts: [
      taskSeen("rouge1", 1, "Pose un objet devant le robot et observe.", "L'exemple de la fiche est vérifié."),
      { t: "choice", c: "algo", label: "Une instruction logique décrit précisément le comportement du robot avec deux mots :", o: ["SI … ALORS …", "ET … OU …", "D'ABORD … ENSUITE …"], a: 0 },
      { t: "rows", c: "algo", label: "Dans l'exemple, que décrit chaque morceau ?", choices: ["ce que détecte un capteur", "l'action du robot"], rows: [{ txt: "« Thymio détecte un objet devant lui »", a: 0 }, { txt: "« il recule »", a: 1 }] },
      { t: "choice", c: "voc", label: "Dans cet exemple, quel capteur détecte, et quel actionneur agit ?", o: ["Les capteurs de proximité avant détectent ; les roues (moteurs) agissent", "Les touches détectent ; le haut-parleur agit", "Les capteurs au sol détectent ; les LED agissent"], a: 0 }],
    hints: ["Relis l'exemple : quels mots sont écrits en majuscules ?", "Après SI : ce qui est détecté (la condition). Après ALORS : ce que fait le robot (l'action).", "SI … ALORS … · « détecte un objet devant lui » : un capteur · « il recule » : l'action · capteurs de proximité avant et roues."],
    corr: "Une instruction logique s'écrit avec SI et ALORS : SI un capteur détecte quelque chose (la condition), ALORS le robot réalise une action grâce à ses actionneurs. Ici : SI les capteurs de proximité avant détectent un objet, ALORS les roues font reculer le robot." },
  { id: "b2", lvl: "mid", title: "Tout le mode rouge", intro: "Le mode rouge contient d'autres instructions. Teste chaque situation, puis décris le comportement du robot.",
    widget: { title: "Simulation · Thymio en mode rouge, vu du dessus", w: "arena_rouge", sim: "Modèle simplifié" },
    parts: [
      taskSeen("rouge", 4, "Teste les quatre situations.", "Les quatre situations sont observées."),
      { t: "match", c: "algo", label: "Complète les instructions logiques du mode rouge.", ask: "Choisis la suite de", rows: MROUGE },
      NAMEQ(0, { 1: "Regarde bien : quand un objet approche, le robot s'éloigne de lui.", 2: "Ce mode ne se promène pas : sans objet, le robot reste immobile." })],
    hints: ["Choisis une situation, puis regarde la trace en pointillés : le robot avance-t-il ou recule-t-il ? Vers quel côté ? Le bouton 🐢 ralentit l'animation.", "Dans trois situations sur quatre, le robot recule : il s'éloigne toujours de l'objet.", "Devant : il recule · à droite : il recule en tournant à gauche · à gauche : il recule en tournant à droite · derrière : il avance. C'est le mode Peureux."],
    corr: "SI Thymio détecte un objet devant lui ALORS il recule. SI Thymio détecte un objet à droite ALORS il recule en tournant à gauche. SI Thymio détecte un objet à gauche ALORS il recule en tournant à droite. SI Thymio détecte un objet derrière lui ALORS il avance. Il fuit les objets : c'est le mode Peureux." }] },

{ id: "p3", n: 3, icon: "🎨", tab: "Les modes", title: "Chaque couleur, un programme", sub: "Trois autres modes à décoder · environ 15 minutes.",
  items: [
  { id: "c2", lvl: "easy", title: "Le mode violet", docs: [DOC_MODES],
    widget: { title: "Simulation · Thymio en mode violet, vu du dessus", w: "arena_violet", sim: "Modèle simplifié" },
    parts: [
      taskSeen("violet", 4, "Appuie sur les quatre flèches du robot.", "Les quatre flèches sont testées."),
      { t: "match", c: "algo", label: "Complète les instructions logiques du mode violet.", ask: "Choisis la suite de", rows: MVIOLET },
      { t: "choice", c: "voc", label: "Dans ce mode, quels capteurs le robot utilise-t-il ?", o: ["Ses touches", "Ses capteurs de proximité", "Ses capteurs au sol"], a: 0, no: { 1: "Ici, il n'y a aucun objet : le robot réagit quand on appuie sur ses flèches." } }],
    hints: ["Appuie sur chaque flèche et regarde la trace en pointillés.", "Le robot fait ce qu'indique la flèche : c'est le mode Obéissant.", "Avant : il avance · arrière : il recule · droite : il tourne à droite · gauche : il tourne à gauche. Capteurs utilisés : les touches."],
    corr: "SI on appuie sur la flèche avant ALORS il avance. SI on appuie sur la flèche arrière ALORS il recule. SI on appuie sur la flèche de droite ALORS il tourne à droite. SI on appuie sur la flèche de gauche ALORS il tourne à gauche. Les touches sont des capteurs : c'est le mode Obéissant." },
  { id: "c1", lvl: "mid", title: "Le mode vert",
    widget: { title: "Simulation · Thymio en mode vert, vu du dessus", w: "arena_vert", sim: "Modèle simplifié" },
    parts: [
      taskSeen("vert", 3, "Teste les trois situations.", "Les trois situations sont observées."),
      { t: "match", c: "algo", label: "Complète les instructions logiques du mode vert.", ask: "Choisis la suite de", rows: MVERT },
      NAMEQ(1, { 0: "Regarde bien : le robot va vers l'objet, il ne le fuit pas.", 2: "Sans objet, le robot reste immobile : il ne se promène pas." })],
    hints: ["Teste les trois situations et compare avec le mode rouge.", "Cette fois, le robot va vers l'objet.", "Devant : il avance · à droite : il tourne à droite · à gauche : il tourne à gauche. Il suit l'objet : c'est le mode Amical."],
    corr: "SI Thymio détecte un objet devant lui ALORS il avance. SI Thymio détecte un objet à droite ALORS il tourne à droite. SI Thymio détecte un objet à gauche ALORS il tourne à gauche. Il suit l'objet (ta main, par exemple) : c'est le mode Amical." },
  { id: "c3", lvl: "hard", title: "Le mode jaune",
    widget: { title: "Simulation · Thymio en mode jaune, vu du dessus", w: "arena_jaune", sim: "Modèle simplifié" },
    parts: [
      taskSeen("jaune", 5, "Teste les cinq situations, y compris le bord de la table.", "Les cinq situations sont observées."),
      { t: "match", c: "algo", label: "Complète les instructions logiques du mode jaune.", ask: "Choisis la suite de", rows: MJAUNE },
      { t: "choice", c: "voc", label: "Quel capteur détecte le bord de la table ?", o: ["Les capteurs au sol", "Les capteurs de proximité avant", "Les touches"], a: 0, no: { 1: "Les capteurs de proximité regardent devant le robot, pas sous lui : regarde les deux petits carrés qui s'allument à l'avant, sous le robot." } },
      NAMEQ(2, { 0: "Sans objet, ce robot se déplace tout seul : il ne fait pas que fuir.", 1: "Il ne suit pas l'objet : il l'évite." })],
    hints: ["Ce mode a cinq instructions : n'oublie pas « Aucun objet » et « Bord de la table ».", "Il évite les objets (il tourne du côté opposé) et il ne tombe jamais de la table.", "À droite : il tourne à gauche · à gauche : il tourne à droite · devant : il recule · rien : il avance · vide en dessous : il s'arrête (capteurs au sol). C'est le mode Explorateur."],
    corr: "SI Thymio détecte un objet à droite ALORS il tourne à gauche. SI Thymio détecte un objet à gauche ALORS il tourne à droite. SI Thymio détecte un objet devant ALORS il recule. SI Thymio ne détecte rien ALORS il avance. SI Thymio détecte du vide en dessous (grâce à ses capteurs au sol) ALORS il s'arrête. Il se promène sans rien heurter ni tomber : c'est le mode Explorateur." }] },

{ id: "p4", n: 4, icon: "🧹", tab: "Mission", title: "Mission : programmer le robot nettoyeur", sub: "Écris le programme, teste-le, corrige-le · environ 15 minutes.",
  items: [
  { id: "d1", lvl: "hard", title: "Le robot nettoyeur suit la ligne", recop: true, docs: [DOC_LIGNE],
    intro: `<div class="box key"><p class="lab">✔ Point méthode · Programmer</p><p>${nb("J'écris le programme → je le <b>teste</b> → j'observe → je le <b>corrige</b>. Le robot fait exactement ce que dit le programme, rien de plus.")}</p></div>`,
    widget: { title: "Simulation · La piste d'essai, de la base aux panneaux solaires", w: "piste", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "prog", label: "Choisis une action pour chaque instruction, puis teste jusqu'à ce que le robot s'arrête aux panneaux solaires.", okMsg: "Mission réussie : le robot s'arrête aux panneaux solaires.", done: () => ({ ok: !!xst().pisteOk, msg: xst().pisteOk ? "Mission réussie." : `Le robot n'est pas encore arrivé aux panneaux (${xst().pisteRuns || 0} essai(s)).` }) },
      { t: "choice", c: "voc", label: "Pour suivre la ligne, le robot utilise…", o: ["ses capteurs au sol, qui distinguent le noir du blanc", "ses capteurs de proximité avant", "ses touches"], a: 0 },
      { t: "choice", c: "algo", label: "Le capteur gauche voit du blanc et le droit voit du noir. Où est la ligne, et que doit faire le robot ?", o: ["La ligne est à sa droite : il tourne à droite", "La ligne est à sa gauche : il tourne à gauche", "Il n'y a plus de ligne : il s'arrête"], a: 0 },
      { t: "choice", c: "algo", label: "Pourquoi le robot s'arrête-t-il devant les panneaux ?", o: ["La ligne s'arrête : ses deux capteurs voient du blanc", "Ses capteurs de proximité détectent les panneaux", "Sa batterie est vide"], a: 0 }],
    hints: ["Fais un premier essai : pendant le test, l'instruction active s'encadre en orange. Laquelle est active quand le robot se trompe ?", "Si le capteur gauche voit du blanc, le robot est sorti de la ligne par la gauche : la ligne est à sa droite.", "⚫⚫ : il avance · ⚪⚫ (gauche blanc) : il tourne à droite · ⚫⚪ (droit blanc) : il tourne à gauche · ⚪⚪ : il s'arrête."],
    corr: "SI les deux capteurs au sol voient du noir ALORS il avance. SI seul le capteur gauche voit du blanc ALORS il tourne à droite (la ligne est à sa droite). SI seul le capteur droit voit du blanc ALORS il tourne à gauche. SI les deux capteurs voient du blanc ALORS il s'arrête : la ligne est finie, le robot est devant les panneaux. Recopie la fiche mémo dans ton cahier." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Activité 1 : peut-on produire l'électricité de la base avec des éoliennes ?", o: ["Non : sur Mars, le vent pousse aussi peu qu'une brise (moins de 2,8 m/s), alors qu'il faut au moins 4 m/s", "Oui : les vents de Mars atteignent 160 km/h", "Oui, à condition de construire des éoliennes très hautes"], a: 0 },
    { t: "choice", c: "conn", label: "Pourquoi la base manque-t-elle d'électricité ?", o: ["Le sable de la tempête recouvre les panneaux solaires", "Les éoliennes de la base sont cassées", "Il n'y a jamais de Soleil sur Mars"], a: 0 },
    { t: "choice", c: "conn", label: "Mission 5 (la fusée) : une solution technique, c'est…", o: ["l'élément qui réalise une fonction technique", "le besoin auquel répond l'objet", "le prix de l'objet"], a: 0 }],
  hints: ["Activité 1 : compare le vent martien « ressenti » à la vitesse minimale de production d'une éolienne.", "Relis l'introduction de la mission, en haut de la page.", "Non (moins de 2,8 m/s, alors qu'il faut 4 m/s) · le sable recouvre les panneaux · l'élément qui réalise une fonction technique."],
  corr: "Le vent martien pousse aussi peu qu'une brise de moins de 2,8 m/s : il faut au moins 4 m/s pour produire de l'électricité. Le sable recouvre les panneaux solaires. Une solution technique est l'élément qui réalise une fonction technique." };

/* ===== VERSION EXPERTE : mêmes manipulations, noms et instructions écrits par l'élève ===== */
const EXPERT = {
r0: { parts: [
    { t: "num", c: "conn", label: "Activité 1 : à partir de quelle vitesse de vent une éolienne produit-elle de l'électricité ?", unit: "m/s", ans: 4, err: [[v => v === 2, "À 2 m/s, le rotor tourne, mais ne produit pas encore d'électricité."]] },
    { t: "word", c: "conn", label: `La base manque d'électricité : le ${gap} de la tempête recouvre les panneaux solaires.`, ans: ["sable", "poussière", "poussières", "sable martien"] },
    { t: "word", c: "conn", label: `Mission 5 : une solution technique est l'élément qui réalise une ${gap} technique.`, ans: ["fonction"], err: [[["solution"], "On cherche ce que l'objet doit faire."]] }],
  hints: ["Activité 1 : la vitesse minimale de production du document 1.", "Relis l'introduction de la mission, en haut de la page.", "4 m/s · sable · fonction."] },
a1: { parts: [
    { t: "task", c: "obs", label: "Teste les six numéros (change de vue pour tous les trouver).", okMsg: "Les six numéros sont testés.", done: () => { const n = Object.keys(xst().anat || {}).length; return { ok: n >= 6, msg: `${n}/6 numéros testés.` }; } },
    { t: "word", c: "voc", label: "Comment s'appelle l'élément ③ ?", ans: ["haut-parleur", "haut-parleurs", "haut parleur", "hautparleur", "enceinte"] },
    { t: "word", c: "voc", label: "Comment s'appellent les éléments ⑤ ?", ans: ["capteurs de proximité", "capteur de proximité", "capteurs d'obstacles", "capteurs d'obstacle", "capteurs infrarouges", "capteurs infrarouge"], err: [[["capteurs au sol", "capteur au sol", "capteurs de sol"], "Les capteurs au sol sont sous le robot. Les ⑤ sont à l'avant et à l'arrière."], [["capteur", "capteurs"], "Oui, ce sont des capteurs… mais lesquels ? Ils détectent ce qui est proche."]] },
    { t: "word", c: "voc", label: "Comment s'appellent les éléments ⑥ ?", ans: ["capteurs au sol", "capteur au sol", "capteurs de sol", "capteurs du sol", "capteurs sol"], err: [[["capteurs de proximité", "capteur de proximité"], "Les capteurs de proximité sont à l'avant et à l'arrière. Les ⑥ regardent le sol."], [["capteur", "capteurs"], "Oui, ce sont des capteurs… mais lesquels ? Regarde vers quoi ils sont tournés."]] },
    { t: "num", c: "obs", label: "Combien le robot a-t-il de capteurs de proximité en tout (avant et arrière) ?", ans: 7, err: [[v => v === 5, "5, c'est seulement l'avant : regarde aussi la vue de derrière."]] }],
  hints: ["Touche chaque numéro dans chacune des quatre vues : les numéros 3 et 6 sont sous le robot.", "③ fait « bip ». ⑤ « sent » la main sans la toucher. ⑥ est tourné vers le sol.", "③ haut-parleur · ⑤ capteurs de proximité · ⑥ capteurs au sol · 5 + 2 = 7 capteurs de proximité."] },
a2: { parts: [
    taskSeen("chaine", 3, "Observe les trois situations.", "Les trois situations sont observées."),
    { t: "rows", c: "voc", label: "Pour chaque élément du robot : capteur ou actionneur ?", choices: ["📥 Capteur", "📤 Actionneur"], rows: [{ txt: "👆 Touches", a: 0 }, { txt: "⚙ Roues (moteurs)", a: 1 }, { txt: "📡 Capteurs de proximité", a: 0 }, { txt: "💡 LED", a: 1 }, { txt: "🔦 Capteurs au sol", a: 0 }, { txt: "🔊 Haut-parleur", a: 1 }] },
    { t: "redac", c: "voc", min: 18, label: "Une main s'approche devant le robot. Explique ce qui se passe en utilisant les mots capteur, programme et actionneur.",
      crit: [{ g: "vois", lab: "Tu dis que la main (l'objet) est détectée", re: [/main|objet|obstacle/, /detect|sent|percoi|capt|repere|voit/] },
        { g: "sais", lab: "Tu nommes le capteur : les capteurs de proximité", re: [/capteur/, /proximit|avant|devant|infra/] },
        { g: "sais", lab: "Tu dis que le programme décide", re: [/programme/] },
        { g: "sais", lab: "Tu nommes un actionneur : les roues (moteurs) ou les LED", re: [/actionneur/, /roue|moteur|led|lumier/] }],
      model: "Quand une main s'approche devant le robot, ses capteurs de proximité la détectent : l'information entre dans le robot. Le programme décide de la réaction. Les actionneurs agissent : les roues (leurs moteurs) font reculer le robot et les LED deviennent rouges." }],
  hints: ["Dans l'animation, l'information entre en bleu et le robot agit en orange.", "Capteur : il « sent ». Actionneur : il produit un mouvement, de la lumière ou un son. Le programme décide.", "Capteurs : touches, capteurs de proximité, capteurs au sol. Actionneurs : roues, LED, haut-parleur. La main → capteurs de proximité → programme → roues et LED."] },
b1: { parts: [
    taskSeen("rouge1", 1, "Pose un objet devant le robot et observe.", "L'exemple de la fiche est vérifié."),
    { t: "list", c: "algo", label: `Complète : « ${gap} un capteur détecte quelque chose, ${gap} Thymio réalise une action. » Écris les deux mots manquants, séparés par une virgule.`, ph: "mot 1, mot 2", need: [{ re: /\bsi\b/ }, { re: /\balors\b/ }], bad: [{ re: /\bet\b|\bou\b|\bpuis\b|\bensuite\b|\bquand\b|\bdonc\b/ }] },
    { t: "redac", c: "voc", min: 14, label: "Explique l'instruction de l'exemple : quel capteur détecte, et quel actionneur agit ?",
      crit: [{ g: "vois", lab: "Tu décris le comportement : un objet devant, il recule", re: [/devant|objet/, /recul/] },
        { g: "sais", lab: "Tu nommes le capteur : les capteurs de proximité (avant)", re: [/capteur/, /proximit|avant|devant|infra/] },
        { g: "sais", lab: "Tu nommes l'actionneur : les roues (leurs moteurs)", re: [/roue|moteur/] }],
      model: "SI les capteurs de proximité avant détectent un objet devant Thymio, ALORS ses actionneurs, les roues (leurs moteurs), le font reculer." }],
  hints: ["Relis l'exemple : quels mots sont écrits en majuscules ?", "Après SI : ce qui est détecté, par un capteur. Après ALORS : l'action, par un actionneur.", "si, alors · capteurs de proximité avant · roues (moteurs)."] },
b2: { parts: [
    taskSeen("rouge", 4, "Teste les quatre situations.", "Les quatre situations sont observées."),
    { t: "redac", c: "algo", min: 28, label: "Écris les quatre instructions logiques du mode rouge, une par ligne : SI… ALORS…",
      crit: [R("Objet devant : il recule", CO.dev, AC.rec), R("Objet à droite : il recule en tournant à gauche", CO.dr, AC.rg), R("Objet à gauche : il recule en tournant à droite", CO.ga, AC.rd), R("Objet derrière : il avance", CO.der, AC.av), SIAL],
      model: MODEL(MROUGE) },
    NAMEQ(0, { 1: "Regarde bien : quand un objet approche, le robot s'éloigne de lui.", 2: "Ce mode ne se promène pas : sans objet, le robot reste immobile." })],
  hints: ["Choisis une situation, puis regarde la trace en pointillés : avance ? recule ? vers quel côté ? Le bouton 🐢 ralentit l'animation.", "Écris une ligne par situation : « SI Thymio détecte un objet … ALORS il … ».", "Devant : il recule · à droite : il recule en tournant à gauche · à gauche : il recule en tournant à droite · derrière : il avance."] },
c1: { parts: [
    taskSeen("vert", 3, "Teste les trois situations.", "Les trois situations sont observées."),
    { t: "redac", c: "algo", min: 22, label: "Écris les trois instructions logiques du mode vert, une par ligne.",
      crit: [R("Objet devant : il avance", CO.dev, AC.av), R("Objet à droite : il tourne à droite", CO.dr, AC.td), R("Objet à gauche : il tourne à gauche", CO.ga, AC.tg), SIAL],
      model: MODEL(MVERT) },
    NAMEQ(1, { 0: "Regarde bien : le robot va vers l'objet, il ne le fuit pas.", 2: "Sans objet, le robot reste immobile : il ne se promène pas." })],
  hints: ["Teste les trois situations et compare avec le mode rouge.", "Cette fois, le robot va vers l'objet.", "Devant : il avance · à droite : il tourne à droite · à gauche : il tourne à gauche."] },
c2: { parts: [
    taskSeen("violet", 4, "Appuie sur les quatre flèches du robot.", "Les quatre flèches sont testées."),
    { t: "redac", c: "algo", min: 26, label: "Écris les quatre instructions logiques du mode violet, une par ligne.",
      crit: [R("Flèche avant : il avance", CO.fav, AC.av), R("Flèche arrière : il recule", CO.far, AC.rec), R("Flèche de droite : il tourne à droite", CO.fdr, AC.td), R("Flèche de gauche : il tourne à gauche", CO.fga, AC.tg), SIAL],
      model: MODEL(MVIOLET) },
    { t: "choice", c: "voc", label: "Dans ce mode, quels capteurs le robot utilise-t-il ?", o: ["Ses touches", "Ses capteurs de proximité", "Ses capteurs au sol"], a: 0, no: { 1: "Ici, il n'y a aucun objet : le robot réagit quand on appuie sur ses flèches." } }],
  hints: ["Appuie sur chaque flèche et regarde la trace en pointillés.", "Écris : « SI on appuie sur la flèche … ALORS il … ».", "Avant : il avance · arrière : il recule · droite : il tourne à droite · gauche : il tourne à gauche · les touches."] },
c3: { parts: [
    taskSeen("jaune", 5, "Teste les cinq situations, y compris le bord de la table.", "Les cinq situations sont observées."),
    { t: "redac", c: "algo", min: 35, label: "Écris les cinq instructions logiques du mode jaune, une par ligne.",
      crit: [R("Objet à droite : il tourne à gauche", CO.dr, AC.tg), R("Objet à gauche : il tourne à droite", CO.ga, AC.td), R("Objet devant : il recule", CO.dev, AC.rec), R("Rien : il avance", CO.rien, AC.av), R("Vide en dessous : il s'arrête", CO.vide, AC.st), SIAL],
      model: MODEL(MJAUNE) },
    { t: "word", c: "voc", label: "Quels capteurs détectent le bord de la table ?", ans: ["capteurs au sol", "capteur au sol", "capteurs de sol", "capteurs du sol", "capteurs sol"], err: [[["capteurs de proximité", "capteur de proximité"], "Les capteurs de proximité regardent devant le robot, pas sous lui."]] },
    NAMEQ(2, { 0: "Sans objet, ce robot se déplace tout seul : il ne fait pas que fuir.", 1: "Il ne suit pas l'objet : il l'évite." })],
  hints: ["Ce mode a cinq instructions : n'oublie pas « Aucun objet » et « Bord de la table ».", "Il évite les objets (il tourne du côté opposé) et ne tombe jamais de la table.", "À droite : il tourne à gauche · à gauche : il tourne à droite · devant : il recule · rien : il avance · vide en dessous : il s'arrête (capteurs au sol)."] },
d1: { parts: [
    { t: "task", c: "prog", label: "Choisis une action pour chaque instruction, puis teste jusqu'à ce que le robot s'arrête aux panneaux solaires.", okMsg: "Mission réussie : le robot s'arrête aux panneaux solaires.", done: () => ({ ok: !!xst().pisteOk, msg: xst().pisteOk ? "Mission réussie." : `Le robot n'est pas encore arrivé aux panneaux (${xst().pisteRuns || 0} essai(s)).` }) },
    { t: "redac", c: "algo", min: 30, label: "Recopie ton programme qui fonctionne sous forme d'instructions logiques SI… ALORS…, une par ligne.",
      crit: [R("Deux capteurs sur le noir : il avance", CO.n2, AC.av), R("Capteur gauche sur le blanc : il tourne à droite", CO.gb, AC.td), R("Capteur droit sur le blanc : il tourne à gauche", CO.db, AC.tg), R("Deux capteurs sur le blanc : il s'arrête", CO.b2, AC.st), SIAL],
      model: "SI les deux capteurs au sol voient du noir ALORS il avance.<br>SI seul le capteur gauche voit du blanc ALORS il tourne à droite.<br>SI seul le capteur droit voit du blanc ALORS il tourne à gauche.<br>SI les deux capteurs voient du blanc ALORS il s'arrête." },
    { t: "choice", c: "voc", label: "Pour suivre la ligne, le robot utilise…", o: ["ses capteurs au sol, qui distinguent le noir du blanc", "ses capteurs de proximité avant", "ses touches"], a: 0 }],
  hints: ["Fais un premier essai : pendant le test, l'instruction active s'encadre en orange. Laquelle est active quand le robot se trompe ?", "Si le capteur gauche voit du blanc, le robot est sorti de la ligne par la gauche : la ligne est à sa droite.", "⚫⚫ : il avance · ⚪⚫ : il tourne à droite · ⚫⚪ : il tourne à gauche · ⚪⚪ : il s'arrête."] }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `Le problème : ${PROBLEM}\n${HOME.goal}\n\nFiche mémo à recopier\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
