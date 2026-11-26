/* ===== 5e EIST · Mission 6 · Tempête de sable · Technologie · Activité 3 : contenus, d'après la fiche « Créer son propre programme à l'aide du logiciel de programmation » et le diaporama « Programmer Thymio » du professeur ===== */
const PROBLEM = "Comment écrire un programme pour que le robot réalise une mission tout seul ?";
const gap = `<span class="gap">………</span>`;
const DORDER = ["d1", "d2", "d3", "d4", "d5", "laby"];
const HOME = { slug: "programmer-thymio", short: "Créer son programme avec Thymio", last: "d1", lastG: "p4", lastK: 0, dur: "environ 1 heure, en une ou deux séances",
  kicker: "Mission 6 · Tempête de sable · Phase 2 · Activité 3", title: "Programme ton robot, bloc par bloc",
  intro: "Les astronautes confient le robot nettoyeur à ton équipe. Dans le logiciel de programmation, un programme est fait de blocs : « lorsque… » (un événement), puis « alors… » (des actions). Entraîne-toi sur le Thymio virtuel avec les défis de la fiche, puis fais traverser le labyrinthe au robot jusqu'aux panneaux solaires, sans l'aider.",
  lab: "Le problème à résoudre", goal: "Objectif : réussir les défis de programmation, puis programmer le robot pour qu'il traverse seul le labyrinthe jusqu'aux panneaux solaires.",
  fact: "Le rover Perseverance choisit lui-même son chemin entre les rochers de Mars : ses caméras repèrent les obstacles et son programme calcule la route, car ses pilotes, sur Terre, ne peuvent pas le guider en direct.",
  parts: "Les quatre étapes de la mission", recop: "Fiche mémo à recopier dans le cahier",
  txt: "ACTIVITÉ 3 · CRÉER SON PROPRE PROGRAMME AVEC LE ROBOT THYMIO\n5e EIST · Mission 6 · Tempête de sable · Technologie",
  comps: { obs: "Observer, manipuler", algo: "Lire et écrire des instructions logiques", prog: "Programmer, tester, corriger", voc: "Utiliser le vocabulaire de la technologie", conn: "Mobiliser ses connaissances" },
  gk: { vois: "Instruction attendue", sais: "Vocabulaire", deduis: "Écriture LORSQUE (SI)… ALORS…" },
  howL: `<li>Programme sur le Thymio virtuel, teste, puis fais vérifier ton programme par le <b>robot-testeur</b>.</li><li>Écris tes instructions comme dans le logiciel : <b>LORSQUE</b> (ou SI) … <b>ALORS</b> …, une par ligne. Touche <b>Vérifier</b> : l'application repère les éléments attendus (un point par élément). Seul le premier essai compte, puis tu complètes librement. Ton professeur lit tes réponses rédigées dans ton bilan.</li>`,
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "Les blocs « lorsque… » sont déjà posés : je choisis les bonnes actions, puis je réponds avec des étiquettes." },
    l: { icon: "🚀", short: "Experte", name: "Version experte", q: "experte", desc: "Je construis mes programmes à partir de zéro, avec tous les blocs du logiciel, et j'écris mes instructions." } },
  extraTitle: "Mes programmes",
  extra: () => `MES PROGRAMMES\n${DORDER.map(k => `${DNAME[k]} : ${okOf(k) ? "réussi" : "pas encore réussi"} (${(xst().tests || {})[k] || 0} vérification(s))\n${((xst().progs || {})[k] || []).length ? progLines(xst().progs[k]).map(x => "  " + x).join("\n") : "  (vide)"}`).join("\n")}\n`,
  extraHTML: () => `<div class="mprogs">${DORDER.map(k => { const p = (xst().progs || {})[k] || []; return `<div class="mprog"><p><b>${esc(DNAME[k])}</b> <span class="chip ${okOf(k) ? "ok" : ""}">${okOf(k) ? "✓ réussi" : "pas encore réussi"}</span></p>${p.length ? `<ol class="ul">${progLines(p).map(x => `<li>${esc(x)}</li>`).join("")}</ol>` : `<p class="lead">Programme vide.</p>`}</div>`; }).join("")}</div>` };

/* ---------- repérage des instructions rédigées (version experte) ---------- */
const SEGS = n => n.split(/[.;!?\n]+|(?=\bsi\b|\blorsqu|\bquand\b)/);
const RULE = (c, a) => (T, n) => SEGS(n).some(s => { const i = s.search(c); if (i < 0) return false; const r = s.slice(i), j = r.search(/\balors\b|,/); return a.test(j >= 0 ? r.slice(j) : r); });
const AC = { av: /avanc|en avant|tout droit|vers l.avant/, td: /(tourn|pivot|vir|braqu|va|part|dirig)\w*.*droite/, tg: /(tourn|pivot|vir|braqu|va|part|dirig)\w*.*gauche/, tr: /tourn|pivot|vir|braqu/, st: /arret|stop|immobil|ne bouge (plus|pas)|freine/ };
const CO = { dev: /devant|en face/, rien: /\brien\b|aucun|pas d.?objet|ne detecte pas|ne voit rien/, ga: /gauche/, dr: /droite/,
  n2: /(deux|2|les capteurs|tous)(?:(?!alors)[^,])*?noir/, b2: /(deux|2|les capteurs|tous)(?:(?!alors)[^,])*?blanc/, gb: /gauche(?:(?!alors)[^,]){0,30}blanc|blanc(?:(?!alors)[^,]){0,30}gauche/, db: /droit(?:(?!alors)[^,]){0,30}blanc|blanc(?:(?!alors)[^,]){0,30}droit/ };
const SIAL = { g: "deduis", lab: "Tu écris des instructions avec LORSQUE (ou SI) et ALORS", re: [/\bsi\b|\blorsqu|\bquand\b/, /\balors\b/] };
const R = (lab, c, a) => ({ g: "vois", lab, re: [RULE(c, a)] });

const DOC_BLOC = { title: "Document · Les blocs du logiciel de programmation", html: `<p>Dans le logiciel (Blockly4Thymio), un programme est fait de <b>blocs</b>. Chaque bloc commence par un <b>événement</b> : « lorsque le bouton avant est touché ». Puis viennent une ou plusieurs <b>actions</b> : « allumer la LED du dessus en rouge ».</p><p class="instr">Un bloc = une instruction logique : <b>LORSQUE</b> (SI) un événement se produit, <b>ALORS</b> le robot agit.</p>` };
const DOC_VRAI = { title: "Sur le vrai robot", html: `<p>${"Connecte le robot en regardant la démonstration du professeur. Attention : les câbles sont très sensibles et se déconnectent facilement. Ne manipule pas trop le robot quand il est connecté !"}</p>` };
const consigne = (t, x) => `<div class="box info"><p class="lab">🎯 ${t}</p><p>${nb(x)}</p></div>`;

const BIL = ["Un programme est une suite de <u>blocs</u>. Chaque bloc est une <u>instruction logique</u> : <u>LORSQUE</u> un événement se produit, <u>ALORS</u> le robot réalise des actions.",
  "L'<u>événement</u> est détecté par un <u>capteur</u> : touches, choc, capteurs de proximité, capteurs au sol.",
  "Les <u>actions</u> sont réalisées par les <u>actionneurs</u> : moteurs (roues), LED, haut-parleur.",
  "Un même événement peut déclencher <u>plusieurs actions</u>.",
  "Une action reste active jusqu'à ce qu'une autre la remplace : « rouler en avant » fait rouler le robot jusqu'au prochain ordre.",
  "Programmer, c'est écrire le programme, le <u>tester</u>, observer, puis <u>affiner</u> les instructions jusqu'à ce que le robot réussisse."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("");
const taskD = (k, label) => ({ t: "task", c: "prog", label, okMsg: "Le robot-testeur valide ton programme.", done: () => ({ ok: okOf(k), msg: okOf(k) ? "Défi réussi." : `Pas encore validé par le robot-testeur (${(xst().tests || {})[k] || 0} vérification(s)).` }) });
const TASKL = "Programme le défi, teste-le sur le Thymio virtuel, puis fais-le vérifier par le robot-testeur.";
const CAPACT = { t: "rows", c: "voc", label: "Capteur ou actionneur ?", choices: ["📥 Capteur", "📤 Actionneur"], rows: [{ txt: "Le bouton avant", a: 0 }, { txt: "La LED du dessus (le dos)", a: 1 }, { txt: "La LED du dessous (le ventre)", a: 1 }] };

const GROUPS = [
{ id: "p1", n: 1, icon: "🧩", tab: "Les blocs", title: "Le langage des blocs", sub: "Lire un programme, puis les défis 1 et 2 · environ 15 minutes.",
  items: [
  { id: "a0", lvl: "easy", title: "Lire un programme", docs: [DOC_BLOC],
    widget: { title: "Atelier · Les programmes préenregistrés dans le robot d'essai", w: "lecture", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "obs", label: "Charge et essaie les quatre programmes (place ta main autour du robot).", okMsg: "Les quatre programmes sont essayés.", done: () => { const n = Object.keys(xst().loaded || {}).length; return { ok: n >= 4, msg: `${n}/4 programmes essayés.` }; } },
      { t: "match", c: "algo", label: "Quel comportement préenregistré chaque programme décrit-il ?", ask: "Choisis le comportement du", rows: [{ e: "A", txt: "Programme A", v: "Peureux (rouge)" }, { e: "B", txt: "Programme B", v: "Obéissant (violet)" }, { e: "C", txt: "Programme C", v: "Explorateur (jaune)" }, { e: "D", txt: "Programme D", v: "Amical (vert)" }] },
      { t: "choice", c: "algo", label: "Un bloc « lorsque … alors … », c'est…", o: ["une instruction logique : SI un événement se produit, ALORS le robot agit", "la liste des pièces du robot", "un dessin du trajet du robot"], a: 0 }],
    hints: ["Charge un programme, puis place ta main devant, à gauche, à droite ou derrière le robot. Pour le programme B, touche les flèches.", "Le peureux fuit la main, l'amical va vers elle, l'obéissant obéit aux flèches, l'explorateur roule tout seul et évite les obstacles.", "A : peureux · B : obéissant · C : explorateur · D : amical. Un bloc est une instruction logique."],
    corr: "A : peureux (objet devant → il recule ; objet derrière → il avance). B : obéissant (il réagit aux flèches). C : explorateur (rien devant → il avance ; objet d'un côté → il tourne de l'autre côté). D : amical (il va vers l'objet, et s'arrête quand il ne voit rien). Chaque bloc est une instruction logique : LORSQUE (SI) un événement se produit, ALORS le robot agit." },
  { id: "a1", lvl: "easy", title: "Défi 1 · Un dos qui change de couleur", docs: [DOC_VRAI],
    intro: consigne("Défi 1", "À chaque fois qu'on appuie sur une touche fléchée, le dos de Thymio change de couleur : une couleur différente pour chaque touche."),
    widget: { title: "Atelier · Le Thymio virtuel et mon programme", w: "atelier_d1", sim: "Modèle simplifié" },
    parts: [
      taskD("d1", TASKL),
      { t: "num", c: "algo", label: "Combien de blocs ton programme contient-il ?", ans: 4, err: [[v => v === 1, "Un seul bloc ne réagit qu'à une seule flèche : il en faut un par flèche."]] },
      { t: "choice", c: "voc", label: "Dans « lorsque le bouton avant est touché », le bouton avant est…", o: ["un capteur : il déclenche l'événement", "un actionneur : il réalise l'action", "le programme"], a: 0 }],
    hints: ["Dans chaque bloc, touche « + action » et choisis une couleur dans « La LED du dessus : le dos ».", "Teste avec les flèches du Thymio virtuel : le dos doit changer de couleur à chaque flèche.", "Un bloc par flèche, soit 4 blocs ; dans chacun, « allumer le dos en … » avec une couleur différente. Le bouton est un capteur."],
    corr: "4 blocs, un par flèche. Par exemple : lorsque le bouton avant est touché → allumer le dos en rouge ; arrière → vert ; gauche → bleu ; droite → jaune. Le bouton est un capteur : il déclenche l'événement. La LED est un actionneur." },
  { id: "a2", lvl: "easy", title: "Défi 2 · Un événement, deux actions",
    intro: consigne("Défi 2", "Quand on appuie sur la touche du haut, le dos et le ventre de Thymio deviennent rouges. Essaie de réussir ce défi avec un seul bloc !"),
    widget: { title: "Atelier · Le Thymio virtuel et mon programme", w: "atelier_d2", sim: "Modèle simplifié" },
    parts: [
      taskD("d2", TASKL),
      { t: "choice", c: "algo", label: "Dans ton bloc, il y a…", o: ["1 événement et 2 actions", "2 événements et 1 action", "2 événements et 2 actions"], a: 0 },
      CAPACT],
    hints: ["La touche du haut, c'est le bouton avant.", "Dans le même bloc, touche deux fois « + action » : une fois pour le dos, une fois pour le ventre.", "Lorsque le bouton avant est touché → allumer le dos en rouge et allumer le ventre en rouge. Bouton : capteur ; LED : actionneurs."],
    corr: "Un seul bloc : lorsque le bouton avant est touché → allumer le dos en rouge + allumer le ventre en rouge. Un même événement peut déclencher plusieurs actions. Le bouton est un capteur ; les deux LED sont des actionneurs." }] },

{ id: "p2", n: 2, icon: "🕹", tab: "Obéissant", title: "Le robot obéissant", sub: "Défi 3 · environ 10 minutes.",
  items: [
  { id: "b1", lvl: "mid", title: "Défi 3 · Un robot obéissant",
    intro: consigne("Défi 3", "On dirige Thymio avec les flèches, comme dans le mode violet. Le dos change de couleur : vert quand il tourne à droite, rouge quand il tourne à gauche, bleu quand il avance, violet quand il recule. Pour arrêter Thymio, il faut taper sur son dos. Quand il s'arrête, il émet un son et s'allume en blanc."),
    widget: { title: "Atelier · Le Thymio virtuel et mon programme", w: "atelier_d3", sim: "Modèle simplifié" },
    parts: [
      taskD("d3", TASKL),
      { t: "choice", c: "conn", label: "Pour arrêter le robot, on tape sur son dos. Quel événement utilise-t-on ?", o: ["un choc est détecté", "le bouton central est touché", "rien n'est détecté devant"], a: 0 },
      { t: "num", c: "algo", label: "Combien d'actions contient le bloc « un choc est détecté » ?", ans: 3, err: [[v => v === 2, "Relis la consigne : le robot s'arrête, émet un son… et s'allume en blanc."]] },
      { t: "choice", c: "voc", label: "Le son est produit par…", o: ["le haut-parleur : un actionneur", "le micro : un capteur", "les LED : des actionneurs"], a: 0 }],
    hints: ["Chaque flèche a deux actions : un mouvement (Les moteurs) et une couleur (Le dos).", "Le bloc « un choc est détecté » a trois actions : arrêter les moteurs, jouer un bip, allumer le dos en blanc.", "Avant → rouler en avant + dos bleu · arrière → rouler en arrière + dos violet · droite → tourner à droite + dos vert · gauche → tourner à gauche + dos rouge · choc → arrêter + bip + dos blanc."],
    corr: "Lorsque le bouton avant est touché → rouler en avant + dos bleu. Arrière → rouler en arrière + dos violet. Droite → tourner à droite + dos vert. Gauche → tourner à gauche + dos rouge. Lorsqu'un choc est détecté → arrêter les moteurs + jouer un bip + dos blanc (3 actions). Le haut-parleur est un actionneur." }] },

{ id: "p3", n: 3, icon: "📡", tab: "Capteurs", title: "Des capteurs qui commandent le robot", sub: "Défis 4 et 5 · environ 20 minutes.",
  items: [
  { id: "c1", lvl: "mid", title: "Défi 4 · L'aller-retour sans fin",
    intro: consigne("Défi 4", "Deux trousses sont posées face à face. 1) Thymio se met en marche lorsqu'on appuie sur le bouton avant. 2) Il fait des allers-retours sans fin entre les deux trousses. 3) Pour l'arrêter, on appuie sur le bouton arrière."),
    widget: { title: "Atelier · Le Thymio virtuel entre deux trousses", w: "atelier_d4", sim: "Modèle simplifié" },
    parts: [
      taskD("d4", TASKL),
      { t: "choice", c: "conn", label: "Pourquoi le robot repart-il en avant quand il arrive près de la trousse 2 ?", o: ["Ses capteurs de proximité arrière la détectent : « objet détecté derrière » déclenche « rouler en avant »", "Il touche la trousse et rebondit", "Le bouton avant est encore enfoncé"], a: 0 },
      { t: "choice", c: "algo", label: "Que se passe-t-il si on oublie le bloc « un objet est détecté derrière » ? Teste-le !", o: ["Le robot recule jusqu'à la trousse 2 et reste bloqué contre elle", "Le robot s'arrête au milieu", "Rien ne change"], a: 0 }],
    hints: ["Quatre blocs : le départ, la trousse devant, la trousse derrière, l'arrêt.", "Une action reste active : « rouler en arrière » fait reculer le robot… jusqu'à ce qu'un autre événement change l'action.", "Bouton avant → rouler en avant · objet devant → rouler en arrière · objet derrière → rouler en avant · bouton arrière → arrêter les moteurs."],
    corr: "Lorsque le bouton avant est touché → rouler en avant. Lorsqu'un objet est détecté devant → rouler en arrière. Lorsqu'un objet est détecté derrière → rouler en avant. Lorsque le bouton arrière est touché → arrêter les moteurs. Sans le bloc « derrière », le robot recule sans fin et reste bloqué contre la trousse 2." },
  { id: "c2", lvl: "hard", title: "Défi 5 · Le suiveur de ligne",
    intro: consigne("Défi 5", "Programme Thymio pour qu'il fasse le tour de la piste noire en suivant la ligne. Sur le vrai robot, construis ta piste avec les feuilles fournies par le professeur."),
    widget: { title: "Atelier · Le Thymio virtuel sur la piste noire", w: "atelier_d5", sim: "Modèle simplifié" },
    parts: [
      taskD("d5", TASKL),
      { t: "choice", c: "voc", label: "Quels capteurs déclenchent les événements de ton programme ?", o: ["les capteurs au sol, qui voient le noir ou le blanc", "les capteurs de proximité", "les touches"], a: 0 },
      { t: "choice", c: "algo", label: "Seul le capteur gauche voit du blanc. Que doit faire le robot ?", o: ["Tourner à droite : la ligne est à sa droite", "Tourner à gauche : la ligne est à sa gauche", "S'arrêter : la ligne est finie"], a: 0 }],
    hints: ["C'est le programme du robot nettoyeur de l'activité 2, écrit avec des blocs.", "Si le capteur gauche voit du blanc, le robot est sorti de la ligne par la gauche : la ligne est à sa droite.", "⚫⚫ → rouler en avant · ⚪⚫ → tourner à droite · ⚫⚪ → tourner à gauche · ⚪⚪ → arrêter les moteurs."],
    corr: "Lorsque les deux capteurs au sol voient du noir → rouler en avant. Seul le capteur gauche voit du blanc → tourner à droite. Seul le capteur droit voit du blanc → tourner à gauche. Les deux voient du blanc → arrêter les moteurs (sur cette piste en boucle, cela n'arrive que si le robot se perd)." }] },

{ id: "p4", n: 4, icon: "🧹", tab: "Mission", title: "Mission : le labyrinthe jusqu'aux panneaux solaires", sub: "Étape 3 de la fiche · environ 20 minutes.",
  items: [
  { id: "d1", lvl: "hard", title: "Traverser le labyrinthe", recop: true,
    intro: consigne("Mission", "Le robot est posé à l'entrée du labyrinthe ; on appuie sur le bouton avant pour lancer le programme. Ensuite, interdit de toucher le robot ou d'activer ses capteurs avec la main. Interdit aussi d'utiliser les programmes préenregistrés !") + `<div class="box key"><p class="lab">✔ Point méthode · Affiner son programme</p><p>${nb("Je teste → j'observe quel bloc est actif (il s'encadre en orange) → je change une action ou l'ordre des blocs → je teste à nouveau. Quand deux blocs se déclenchent en même temps, c'est le dernier de la liste qui commande le robot virtuel.")}</p></div>`,
    widget: { title: "Atelier · Le labyrinthe, de la base aux panneaux solaires", w: "atelier_laby", sim: "Modèle simplifié" },
    parts: [
      taskD("laby", "Programme le robot, teste-le, affine tes instructions, puis fais-le vérifier par le robot-testeur : il appuie sur le bouton avant et laisse le robot seul pendant 2 minutes."),
      { t: "choice", c: "voc", label: "Quels capteurs ton robot utilise-t-il dans le labyrinthe ?", o: ["ses capteurs de proximité", "ses capteurs au sol", "seulement ses touches"], a: 0 },
      { t: "choice", c: "algo", label: "Pourquoi faut-il le bloc « rien n'est détecté devant → rouler en avant » ?", o: ["Une action reste active : sans lui, le robot continuerait à tourner après un virage", "Pour que le robot s'arrête à la fin", "Pour allumer le dos du robot"], a: 0 },
      { t: "choice", c: "prog", label: "Ton robot reste bloqué contre un mur. Que fais-tu ?", o: ["J'observe quel bloc est actif, j'affine mes instructions (action, ordre des blocs), puis je teste à nouveau", "Je pousse le robot avec la main", "Je recommence le même essai sans rien changer"], a: 0 }],
    hints: ["Dans ce labyrinthe, tous les virages tournent du même côté. Lequel ?", "Il faut aussi corriger la trajectoire : un objet à gauche → tourner à droite ; un objet à droite → tourner à gauche. Et quand rien n'est devant → rouler en avant.", "Bouton avant → rouler en avant · rien devant → rouler en avant · objet à gauche → tourner à droite · objet à droite → tourner à gauche · objet devant → tourner à droite."],
    corr: "Une solution : lorsque le bouton avant est touché → rouler en avant ; lorsque rien n'est détecté devant → rouler en avant ; lorsqu'un objet est détecté à gauche → tourner à droite ; à droite → tourner à gauche ; devant → tourner à droite (tous les virages de ce labyrinthe tournent à droite). Le robot utilise ses capteurs de proximité. D'autres solutions existent : le robot-testeur les accepte si le robot arrive seul aux panneaux. Recopie la fiche mémo dans ton cahier." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Un capteur…", o: ["prélève une information sur l'environnement du robot", "agit sur l'environnement du robot", "décide de ce que fait le robot"], a: 0 },
    { t: "choice", c: "voc", label: "« SI Thymio détecte un objet devant lui ALORS il recule » : quel actionneur réalise l'action ?", o: ["les roues (moteurs)", "les capteurs de proximité", "les touches"], a: 0 },
    { t: "choice", c: "conn", label: "Activité 2 : pour suivre la ligne noire, le robot nettoyeur utilisait…", o: ["ses capteurs au sol", "ses capteurs de proximité", "ses touches"], a: 0 }],
  hints: ["Un capteur « sent », un actionneur agit.", "Reculer, c'est un mouvement.", "Un capteur · les roues (moteurs) · les capteurs au sol."],
  corr: "Un capteur prélève une information sur l'environnement du robot. Les roues (leurs moteurs) réalisent le mouvement : ce sont des actionneurs. Le suiveur de ligne utilise ses capteurs au sol." };

/* ===== VERSION EXPERTE : programmes construits à partir de zéro, instructions écrites ===== */
const EXPERT = {
r0: { parts: [
    { t: "word", c: "conn", label: `Un ${gap} prélève une information sur l'environnement du robot.`, ans: ["capteur", "capteurs"], err: [[["actionneur", "actionneurs"], "Un actionneur agit sur l'environnement."]] },
    { t: "word", c: "voc", label: `Les moteurs (roues), les LED et le haut-parleur sont des ${gap}.`, ans: ["actionneurs", "actionneur"], err: [[["capteurs", "capteur"], "Ils agissent : ce ne sont pas des capteurs."]] },
    { t: "word", c: "conn", label: `Pour suivre la ligne noire, le robot utilise ses ${gap}.`, ans: ["capteurs au sol", "capteur au sol", "capteurs de sol", "capteurs du sol", "capteurs sol"] }],
  hints: ["Un capteur « sent », un actionneur agit.", "Ils produisent un mouvement, de la lumière, un son.", "capteur · actionneurs · capteurs au sol."] },
a0: { parts: [
    { t: "task", c: "obs", label: "Charge et essaie les quatre programmes (place ta main autour du robot).", okMsg: "Les quatre programmes sont essayés.", done: () => { const n = Object.keys(xst().loaded || {}).length; return { ok: n >= 4, msg: `${n}/4 programmes essayés.` }; } },
    { t: "match", c: "algo", label: "Quel comportement préenregistré chaque programme décrit-il ?", ask: "Choisis le comportement du", rows: [{ e: "A", txt: "Programme A", v: "Peureux (rouge)" }, { e: "B", txt: "Programme B", v: "Obéissant (violet)" }, { e: "C", txt: "Programme C", v: "Explorateur (jaune)" }, { e: "D", txt: "Programme D", v: "Amical (vert)" }] },
    { t: "redac", c: "algo", min: 15, label: "Explique comment tu as reconnu le programme de l'explorateur, en citant ses instructions.",
      crit: [{ g: "vois", lab: "Rien devant → il roule en avant", re: [RULE(CO.rien, /avanc|roul/)] }, { g: "vois", lab: "Objet d'un côté → il tourne de l'autre côté (il évite)", re: [/tourn|evit|recul/] }, { g: "sais", lab: "Tu dis qu'il se déplace seul, sans jamais s'arrêter", re: [/seul|jamais|tout le temps|toujours|sans arret|n.?arrete pas|se promene|explor|ne s.?arrete/] }],
      model: "Dans le programme C, lorsque rien n'est détecté devant, le robot roule en avant ; lorsqu'un objet est détecté d'un côté, il tourne de l'autre côté, et lorsqu'un objet est devant, il recule. Il n'a aucun bloc « arrêter les moteurs » : il se déplace tout seul en évitant les obstacles, c'est l'explorateur." }],
  hints: ["Charge un programme, puis place ta main devant, à gauche, à droite ou derrière le robot. Pour le programme B, touche les flèches.", "Cherche le programme qui fait rouler le robot quand il ne voit rien.", "Lorsque rien n'est détecté devant → rouler en avant ; objet à gauche → tourner à droite ; objet à droite → tourner à gauche."] },
a1: { parts: [
    taskD("d1", TASKL),
    { t: "word", c: "algo", label: `La partie « lorsque … » d'un bloc s'appelle l'${gap}.`, ans: ["événement", "evenement", "évènement"], err: [[["action", "actions"], "L'action vient après : « alors … »."]] },
    { t: "num", c: "algo", label: "Combien de blocs ton programme contient-il ?", ans: 4, err: [[v => v === 1, "Un seul bloc ne réagit qu'à une seule flèche : il en faut un par flèche."]] }],
  hints: ["Touche « + Ajouter un bloc », puis choisis l'événement dans « Les touches ».", "Un bloc par flèche ; dans chacun, « + action » → La LED du dessus : le dos.", "4 blocs · le mot cherché : événement."] },
a2: { parts: [
    taskD("d2", TASKL),
    { t: "word", c: "algo", label: `Un même événement peut déclencher plusieurs ${gap}.`, ans: ["actions", "action"] },
    CAPACT],
  hints: ["La touche du haut, c'est le bouton avant.", "Dans le même bloc, ajoute deux actions : le dos et le ventre.", "Lorsque le bouton avant est touché → dos rouge + ventre rouge · actions · bouton : capteur, LED : actionneurs."] },
b1: { parts: [
    taskD("d3", TASKL),
    { t: "redac", c: "algo", min: 12, label: "Écris l'instruction logique qui arrête le robot.",
      crit: [{ g: "vois", lab: "L'événement : un choc (une tape sur le dos)", re: [/choc|tape|tapant|frappe|dos/] }, { g: "vois", lab: "Arrêter les moteurs", re: [/arret|stop|immobil/] }, { g: "vois", lab: "Jouer un son", re: [/son|bip|sonne|bruit|musique|note/] }, { g: "vois", lab: "Allumer le dos en blanc", re: [/blanc/] }, SIAL],
      model: "LORSQU'un choc est détecté (on tape sur le dos), ALORS le robot arrête ses moteurs, joue un bip et allume son dos en blanc." },
    { t: "num", c: "algo", label: "Combien d'actions contient ce bloc ?", ans: 3 }],
  hints: ["Chaque flèche a deux actions : un mouvement et une couleur.", "Le choc se trouve dans « Le choc ». Trois actions : moteurs, son, dos.", "Lorsqu'un choc est détecté → arrêter les moteurs + jouer un bip + dos blanc."] },
c1: { parts: [
    taskD("d4", TASKL),
    { t: "redac", c: "algo", min: 20, label: "Explique pourquoi ton robot fait des allers-retours sans fin.",
      crit: [{ g: "vois", lab: "Trousse détectée devant → il recule", re: [RULE(/devant|en face|avant/, /recul|arriere/)] }, { g: "vois", lab: "Trousse détectée derrière → il avance", re: [RULE(/derriere|arriere/, /avanc|en avant/)] }, { g: "sais", lab: "Tu nommes les capteurs de proximité", re: [/capteur/, /proximit|infra/] }, { g: "sais", lab: "Tu dis que l'action reste active jusqu'au prochain événement", re: [/(reste|continue|jusqu|toujours|garde|sans fin|tant que)/] }],
      model: "Lorsque les capteurs de proximité avant détectent la trousse 1, alors le robot roule en arrière. Cette action reste active jusqu'à ce que les capteurs arrière détectent la trousse 2 : alors il roule en avant, jusqu'à la trousse 1, et ainsi de suite, sans fin." },
    { t: "choice", c: "algo", label: "Que se passe-t-il si on oublie le bloc « un objet est détecté derrière » ? Teste-le !", o: ["Le robot recule jusqu'à la trousse 2 et reste bloqué contre elle", "Le robot s'arrête au milieu", "Rien ne change"], a: 0 }],
  hints: ["Quatre blocs : le départ, la trousse devant, la trousse derrière, l'arrêt.", "Une action reste active jusqu'à ce qu'un autre événement la change.", "Bouton avant → rouler en avant · objet devant → rouler en arrière · objet derrière → rouler en avant · bouton arrière → arrêter."] },
c2: { parts: [
    taskD("d5", TASKL),
    { t: "redac", c: "algo", min: 30, label: "Écris ton programme sous forme d'instructions logiques, une par ligne.",
      crit: [R("Deux capteurs sur le noir → rouler en avant", CO.n2, AC.av), R("Capteur gauche sur le blanc → tourner à droite", CO.gb, AC.td), R("Capteur droit sur le blanc → tourner à gauche", CO.db, AC.tg), SIAL],
      model: "LORSQUE les deux capteurs au sol voient du noir ALORS rouler en avant.<br>LORSQUE seul le capteur gauche voit du blanc ALORS tourner à droite.<br>LORSQUE seul le capteur droit voit du blanc ALORS tourner à gauche.<br>LORSQUE les deux capteurs voient du blanc ALORS arrêter les moteurs." }],
  hints: ["C'est le programme du robot nettoyeur de l'activité 2, avec des blocs « Les capteurs au sol ».", "Si le capteur gauche voit du blanc, la ligne est à la droite du robot.", "⚫⚫ → rouler en avant · ⚪⚫ → tourner à droite · ⚫⚪ → tourner à gauche · ⚪⚪ → arrêter."] },
d1: { parts: [
    taskD("laby", "Programme le robot, teste-le, affine tes instructions, puis fais-le vérifier par le robot-testeur : il appuie sur le bouton avant et laisse le robot seul pendant 2 minutes."),
    { t: "redac", c: "algo", min: 30, label: "Écris ton programme sous forme d'instructions logiques, une par ligne.",
      crit: [{ g: "vois", lab: "Le bouton avant lance le robot", re: [/bouton|touche|fleche/, /avan|lance|demarr|roul/] }, R("Rien devant → rouler en avant", CO.rien, AC.av), R("Objet devant → tourner", CO.dev, AC.tr), { g: "vois", lab: "Objet d'un côté → tourner de l'autre côté", re: [(T, n) => RULE(CO.ga, AC.td)(T, n) || RULE(CO.dr, AC.tg)(T, n)] }, SIAL],
      model: "LORSQUE le bouton avant est touché ALORS rouler en avant.<br>LORSQUE rien n'est détecté devant ALORS rouler en avant.<br>LORSQU'un objet est détecté à gauche ALORS tourner à droite.<br>LORSQU'un objet est détecté à droite ALORS tourner à gauche.<br>LORSQU'un objet est détecté devant ALORS tourner à droite." },
    { t: "choice", c: "voc", label: "Quels capteurs ton robot utilise-t-il dans le labyrinthe ?", o: ["ses capteurs de proximité", "ses capteurs au sol", "seulement ses touches"], a: 0 }],
  hints: ["Observe le labyrinthe : tous les virages tournent du même côté.", "Une action reste active : après un virage, il faut un bloc pour repartir tout droit. Et pour ne pas frotter les murs, corrige la trajectoire avec les capteurs de gauche et de droite.", "Bouton avant → rouler en avant · rien devant → rouler en avant · objet à gauche → tourner à droite · objet à droite → tourner à gauche · objet devant → tourner à droite."] }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `Le problème : ${PROBLEM}\n${HOME.goal}\n\nFiche mémo à recopier\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
