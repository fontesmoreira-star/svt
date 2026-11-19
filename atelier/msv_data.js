/* ===== 5e EIST · Physique-chimie · Masse et volume : contenus, d'après la feuille « Exercices masse et volume » (chapitre 3 : la mesure) du professeur ===== */
const PROBLEM = "Comment mesurer un volume et une masse, convertir leurs unités, et que deviennent-ils quand l'eau change d'état ?";
const gap = `<span class="gap">………</span>`;
const frN = x => { let s = Math.abs(x) < 1e-3 && x !== 0 ? x.toFixed(12).replace(/0+$/, "") : String(+(+x).toPrecision(12)); s = s.replace(".", ","); const [i, d] = s.split(","); return i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (d ? "," + d : ""); };
/* une conversion : version guidée (3 choix) ou experte (nombre à écrire) */
function convG(q, ans, unit) { const o = [ans, ans * 10, ans / 10], ord = [[0, 1, 2], [1, 0, 2], [2, 1, 0]][Math.round(Math.abs(Math.log10(ans + 1e-15)) * 7) % 3]; return { t: "choice", c: "calc", label: `${q} = ${gap} ${unit}`, o: ord.map(i => frN(o[i]) + " " + unit), a: ord.indexOf(0), no: Object.fromEntries(ord.map((i, k) => [k, i === 1 ? "Trop grand : tu as décalé la virgule d'un rang de trop vers la droite." : i === 2 ? "Trop petit : tu as décalé la virgule d'un rang de trop vers la gauche." : ""])) }; }
function convL(q, ans, unit) { return { t: "num", c: "calc", label: `${q} = ${gap} ${unit}`, unit, ans, tol: Math.abs(ans) * 1e-6 + 1e-13, err: [[v => near(v, ans * 10, Math.abs(ans) * 1e-5), "Un rang de trop vers la droite : ton résultat est 10 fois trop grand."], [v => near(v, ans / 10, Math.abs(ans) * 1e-6), "Un rang de trop vers la gauche : ton résultat est 10 fois trop petit."], [v => near(v, ans * 1000, Math.abs(ans) * 1e-4) || near(v, ans / 1000, Math.abs(ans) * 1e-7), "Tu as déplacé la virgule dans le mauvais sens : vers une unité plus petite, le nombre devient plus grand."]] }; }
const C7A = [["0,78 dm³", 0.00078, "m³"], ["240,7 mL", 0.2407, "L"], ["120 L", 120, "dm³"], ["45 cm³", 45, "mL"], ["878 dm³", 878000, "cm³"], ["47,5 g", 4750, "cg"]];
const C7B = [["656 dm³", 656000, "cm³"], ["240 L", 240, "dm³"], ["130,1 mL", 0.1301, "L"], ["0,67 dm³", 0.00067, "m³"], ["36 cm³", 36, "mL"], ["38,7 g", 3870, "cg"]];
const C9 = [["1 L", 100, "cL"], ["1,31 dm³", 1310000, "mm³"], ["12 mL", 0.12, "dL"], ["321 mm³", 0.000000321, "m³"], ["33 cL", 0.33, "dm³"], ["0,29 mL", 0.29, "cm³"], ["1,5 L", 0.0015, "m³"], ["7,22 daL", 72.2, "dm³"]];
const SER_MAX = 20 / (1 + 100 / 38);

const HOME = { slug: "masse-et-volume", short: "Masse et volume : le labo de mesure", last: "f3", lastG: "p6", lastK: 2, dur: "environ 1 h, ou en deux séances",
  kicker: "Chapitre 3 · La mesure · Feuille d'exercices", title: "⚡ Le labo de mesure",
  intro: "Les 15 exercices de la feuille deviennent des expériences à faire toi-même : une seringue à écraser, des éprouvettes à lire à la loupe, une balance qui fait la tare, un défi chrono, un tableau de conversion où la virgule saute, des lingots d'or, des glaçons qui fondent et une roche qui explose.",
  lab: "Le problème", goal: "Objectif : savoir mesurer et convertir un volume et une masse, et expliquer ce qu'ils deviennent quand l'eau change d'état.",
  fact: "L'eau est l'un des très rares liquides qui gonflent en gelant : environ +9 % de volume. Une conduite d'eau qui gèle peut éclater, et la glace flotte sur l'eau. Sans cette bizarrerie, les lacs gèleraient du fond vers la surface !",
  parts: "Les six parties du labo", recop: "Fiche mémo à recopier dans le cahier",
  txt: "LE LABO DE MESURE · MASSE ET VOLUME\n5e EIST · Physique-chimie · Chapitre 3 : la mesure",
  comps: { mod: "Manipuler, observer", lire: "Lire une mesure", calc: "Calculer, convertir", conn: "Mobiliser ses connaissances", rais: "Expliquer, argumenter" },
  gk: { vois: "J'observe que", sais: "Or", deduis: "Donc" },
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "Je choisis parmi des propositions, avec des pistes pas à pas." },
    l: { icon: "🚀", short: "Experte", name: "Version experte", q: "experte", desc: "Les mêmes expériences, mais j'écris mes résultats et mes explications : j'observe que…, or…, donc…" } },
  extraTitle: "Mon record au défi chrono",
  extra: () => { const t = xo("tri"); return `DÉFI CHRONO (exercice 6c) : ${t.ok ? "réussi" + (t.best ? ", record " + f1(t.best) + " s" : "") : "pas encore réussi"}\n`; },
  extraHTML: () => { const t = xo("tri"); return t.ok ? `<p class="mypara">🏆 Tri parfait${t.best ? " · record : " + f1(t.best) + " s" : ""}</p>` : `<p class="locked">Réussis le défi chrono de la partie 4 pour afficher ton record.</p>`; } };

const WG = (title, w, sim) => ({ title, w, sim });
const BIL = [
  "Le <u>volume</u> est la place occupée par un objet. Il se mesure avec une <u>éprouvette graduée</u> posée à plat, l'œil à la hauteur du <u>bas du ménisque</u>.",
  "Volume d'un solide : on le plonge dans l'eau. Volume du solide = <u>volume final − volume initial</u> (méthode du déplacement d'eau).",
  "La <u>masse</u> est la quantité de matière. Elle se mesure avec une <u>balance</u> ; la touche <u>TARE</u> remet la balance à zéro pour ne peser que ce qu'on ajoute.",
  "Les <u>gaz</u> sont compressibles (particules éloignées) ; les <u>liquides</u> sont incompressibles (particules au contact).",
  "Unités : 1 L = <u>1 dm³</u> ; 1 mL = <u>1 cm³</u> ; 1 m³ = 1 000 L ; 1 kg = 1 000 g. Dans le tableau de conversion, le chiffre des unités va dans la colonne de l'unité.",
  "<u>1 L d'eau a une masse de 1 kg</u>. Pour une même matière, la masse et le volume sont <u>proportionnels</u>.",
  "Lors d'un changement d'état, la <u>masse se conserve</u> mais le <u>volume change</u> : en gelant, l'eau augmente de volume (environ +9 %), ce qui fait éclater les roches gorgées d'eau."];
const bilanHTML = () => BIL.map(x => `<p>${nb(x)}</p>`).join("");
const tk = (ok, t) => ({ ok, msg: t });

const GROUPS = [
{ id: "p1", n: 1, icon: "💨", tab: "Liquide ou gaz", title: "Liquide ou gaz : lequel se comprime ?", sub: "Exercices 1 et 6a · environ 8 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "La seringue de Nicolas", intro: nb("<b>Exercices 1 et 6a.</b> Nicolas bouche avec son index l'orifice d'une seringue pleine d'air et enfonce le piston autant qu'il peut. Puis il recommence avec de l'eau : il n'y parvient pas."), widget: WG("Expérience · La seringue bouchée", "seringue", "Modèle simplifié"),
    parts: [
      { t: "task", c: "mod", label: "Pousse à fond le piston de la seringue bouchée, avec de l'air puis avec de l'eau.", okMsg: "Les deux essais sont faits.", done: () => { const t = xo("ser").t || {}; return tk(!!(t.airB && t.eauB), `${t.airB ? "✓" : "○"} air bouché poussé à fond · ${t.eauB ? "✓" : "○"} eau bouchée poussée à fond`); } },
      { t: "choice", c: "lire", label: "Avec de l'air, quand on pousse, le volume occupé…", o: ["diminue : l'air se comprime", "reste le même", "augmente"], a: 0 },
      { t: "choice", c: "lire", label: "Avec de l'eau, le piston…", o: ["ne bouge pas : l'eau ne se comprime pas", "s'enfonce jusqu'au bout", "ressort tout seul"], a: 0 },
      { t: "choice", c: "conn", label: "Pourquoi l'air se comprime-t-il ?", o: ["Ses particules sont éloignées les unes des autres : on peut les rapprocher", "Ses particules rétrécissent quand on pousse", "L'air disparaît quand on pousse"], a: 0, no: { 1: "Les particules ne changent pas de taille : c'est l'espace entre elles qui diminue." } },
      { t: "choice", c: "conn", label: "Exercice 6a · Un liquide est-il compressible ?", o: ["Non : ses particules sont déjà au contact, on ne peut pas les rapprocher", "Oui, comme l'air", "Seulement s'il est chaud"], a: 0 }],
    hints: ["Choisis « Air », vérifie que le doigt bouche l'orifice, puis « Pousser à fond ». Recommence avec « Eau ».", "Regarde les petites billes : dans l'air, elles ont de la place entre elles ; dans l'eau, elles se touchent.", "Air : le volume diminue (compressible). Eau : le piston ne bouge pas (incompressible), car les particules sont au contact."],
    corr: "Avec l'air, le piston s'enfonce : le volume diminue, l'air est compressible, car ses particules sont éloignées et peuvent être rapprochées. Avec l'eau, le piston ne bouge pas : les particules d'un liquide sont déjà au contact, on ne peut pas les rapprocher. Un liquide est incompressible." }] },

{ id: "p2", n: 2, icon: "📏", tab: "Volumes", title: "Mesurer un volume", sub: "Exercices 2, 4a et 3 · environ 12 minutes.",
  items: [
  { id: "b1", lvl: "mid", title: "Lire une éprouvette", intro: nb("<b>Exercices 2 et 4a.</b> Quel est le volume contenu dans ces éprouvettes ?"), widget: WG("Expérience · L'œil et le ménisque", "eprouvette"),
    parts: [
      { t: "task", c: "mod", label: "Place ton œil en face du ménisque, pour chacune des deux éprouvettes.", okMsg: "Lecture correcte préparée pour les deux éprouvettes.", done: () => { const o = xo("epr").ok || {}; return tk(!!(o[1] && o[2]), `${o[1] ? "✓" : "○"} éprouvette ① · ${o[2] ? "✓" : "○"} éprouvette ②`); } },
      { t: "choice", c: "lire", label: "Sur l'éprouvette ①, une petite graduation vaut…", o: ["2 mL", "1 mL", "10 mL"], a: 0, no: { 1: "Compte les intervalles entre 60 et 70 mL : il y en a 5." } },
      { t: "num", c: "lire", label: "Volume contenu dans l'éprouvette ① ?", unit: "mL", ans: 74, tol: 0.5, err: [[v => v === 73 || v === 75, "Une graduation vaut 2 mL : le niveau tombe pile sur un trait."], [v => v === 76 || v === 72, "Place ton œil bien en face du ménisque avant de lire."]] },
      { t: "num", c: "lire", label: "Volume contenu dans l'éprouvette ② ?", unit: "mL", ans: 135, tol: 0.5, err: [[v => v === 130 || v === 140, "Une petite graduation vaut 5 mL : regarde le trait exact sous le ménisque."]] },
      { t: "choice", c: "conn", label: "Exercice 4a · Pour lire un volume, l'œil doit être…", o: ["à la hauteur du bas du ménisque, l'éprouvette posée à plat", "au-dessus de l'éprouvette", "sous l'éprouvette"], a: 0 }],
    hints: ["Touche « En face » : dans la loupe, les traits ne bougent plus quand ton œil est bien placé.", "On lit au bas de la courbe de l'eau (le ménisque). ① : 5 intervalles entre 60 et 70 → 2 mL chacun. ② : 10 intervalles entre 50 et 100 → 5 mL chacun.", "① : 74 mL. ② : 135 mL. Œil en face du bas du ménisque."],
    corr: "On pose l'éprouvette à plat et on place l'œil à la hauteur du bas du ménisque (sinon, erreur de parallaxe). Éprouvette ① : une graduation vaut 2 mL, le volume est de 74 mL. Éprouvette ② : une graduation vaut 5 mL, le volume est de 135 mL." },
  { id: "b2", lvl: "mid", title: "Le volume de la pâte à modeler", intro: nb("<b>Exercice 3.</b> On doit mesurer le volume d'un morceau de pâte à modeler, qui n'a pas une forme simple."), widget: WG("Expérience · Le déplacement d'eau", "immersion"),
    parts: [
      { t: "task", c: "mod", label: "Plonge la pâte entière, puis la pâte cassée en deux morceaux.", okMsg: "Les deux immersions sont faites.", done: () => { const d = xo("imm").done || {}; return tk(!!(d[1] && d[2]), `${d[1] ? "✓" : "○"} pâte entière · ${d[2] ? "✓" : "○"} deux morceaux`); } },
      { t: "num", c: "lire", label: "Volume d'eau avant d'ajouter la pâte ?", unit: "mL", ans: 100 },
      { t: "num", c: "lire", label: "Volume lu quand la pâte est dans l'eau ?", unit: "mL", ans: 125, err: [[v => v === 25, "C'est le volume de la pâte : ici, on demande le niveau lu sur l'éprouvette."]] },
      { t: "num", c: "calc", label: "Exercice 3.1a · Volume de la pâte à modeler ?", unit: "mL", ans: 25, err: [[v => v === 125, "125 mL, c'est l'eau ET la pâte : enlève le volume d'eau."]] },
      { t: "choice", c: "conn", label: "Exercice 3.1b · Quelle méthode as-tu utilisée ?", o: ["Le déplacement d'eau : la pâte prend la place de l'eau, qui monte", "J'ai pesé la pâte", "J'ai mesuré la pâte avec une règle"], a: 0 },
      { t: "choice", c: "rais", label: "Exercice 3.2 · Le volume des deux morceaux est…", o: ["25 mL en tout : on a toujours la même quantité de pâte", "50 mL : deux morceaux, donc deux fois plus", "12,5 mL : la moitié"], a: 0 }],
    hints: ["Lis le niveau dans la loupe avant, puis après avoir plongé la pâte.", "Volume de la pâte = volume final − volume initial.", "100 mL · 125 mL · 125 − 100 = 25 mL · déplacement d'eau · deux morceaux : toujours 25 mL."],
    corr: "Avant : 100 mL d'eau. Avec la pâte : 125 mL. La pâte prend la place de l'eau, qui monte : son volume vaut 125 − 100 = 25 mL (méthode du déplacement d'eau). Cassée en deux, la pâte a le même volume total, 25 mL : la quantité de pâte n'a pas changé. Fais le schéma de la manipulation dans ton cahier : éprouvette avant (100 mL), éprouvette après (125 mL)." }] },

{ id: "p3", n: 3, icon: "⚖", tab: "Masses", title: "Mesurer une masse", sub: "Exercices 4b, 4c, 5, 8 et 11 · environ 12 minutes.",
  items: [
  { id: "c1", lvl: "mid", title: "La balance et la tare", intro: nb("<b>Exercices 5, 4b et 4c.</b> Quelle est la masse du liquide contenu dans le gobelet ?"), widget: WG("Expérience · La balance électronique", "balance"),
    parts: [
      { t: "task", c: "mod", label: "Pose le gobelet vide, fais la tare, puis verse le jus.", okMsg: "Tu as utilisé la tare.", done: () => { const f = xo("bal").f || {}; return tk(!!(f.gob && f.jusTare), `${f.gob ? "✓" : "○"} gobelet vide pesé · ${f.jusTare ? "✓" : "○"} jus versé après la tare`); } },
      { t: "num", c: "lire", label: "Masse du gobelet vide ?", unit: "g", ans: 5.8, tol: 0.01 },
      { t: "num", c: "calc", label: "Masse du jus seul ?", unit: "g", ans: 161.2, tol: 0.01, err: [[v => near(v, 167, 0.01), "167,0 g, c'est le gobelet ET le jus : fais la tare, ou calcule 167,0 − 5,8."], [v => near(v, 172.8, 0.01), "Il faut soustraire la masse du gobelet, pas l'ajouter."]] },
      { t: "choice", c: "conn", label: "À quoi sert la touche TARE ?", o: ["À remettre la balance à zéro, pour ne peser que ce qu'on ajoute ensuite", "À éteindre la balance", "À doubler la masse affichée"], a: 0 },
      { t: "rows", c: "conn", label: "Exercices 4b et 4c · Précision de la balance qui affiche…", choices: ["0,1 g", "1 g", "0,01 g"], rows: [{ txt: "654,3 g", a: 0 }, { txt: "123,4 g", a: 0 }] }],
    hints: ["Touche « Poser le gobelet vide », puis « TARE », puis « Verser le jus ».", "Sans tare : masse du jus = 167,0 − 5,8. La précision d'un affichage, c'est son dernier chiffre.", "5,8 g · 161,2 g · TARE = remise à zéro · 654,3 g et 123,4 g : précision 0,1 g (un chiffre après la virgule)."],
    corr: "Gobelet vide : 5,8 g. Gobelet et jus : 167,0 g. Masse du jus : 167,0 − 5,8 = 161,2 g. Plus simple : après la tare (remise à zéro avec le gobelet posé), la balance affiche directement 161,2 g. Une balance qui affiche 654,3 g ou 123,4 g mesure au dixième de gramme : précision 0,1 g." },
  { id: "c2", lvl: "hard", title: "Bouteilles d'eau et liquide mystère", intro: nb("<b>Exercices 8 et 11.</b> Rappel : 1 L d'eau a une masse de 1 kg, soit 1 000 g."), widget: WG("Les balances de l'énoncé", "bouteilles"),
    docs: [{ title: "Exercice 11 · Un liquide inconnu", w: "becher" }],
    unlock: WG("Vérification débloquée · Remplis et vide les bouteilles", "verifBouteilles"),
    parts: [
      { t: "num", c: "calc", label: "Exercice 8a · La grande bouteille de 1,5 L pèse 37 g vide. Quelle est sa masse pleine d'eau ?", unit: "g", ans: 1537, err: [[v => v === 38.5 || v === 1.537, "1,5 L d'eau, c'est 1 500 g : additionne en grammes."], [v => v === 1463, "Pleine, la bouteille est plus lourde : il faut ajouter la masse de l'eau."]] },
      { t: "num", c: "calc", label: "Exercice 8b · La petite bouteille de 50 cL pèse 521 g pleine. Quelle est sa masse vide ?", unit: "g", ans: 21, err: [[v => v === 471, "50 cL = 0,5 L : l'eau a une masse de 500 g, pas 50 g."], [v => v === 1021, "Vide, elle est plus légère : il faut enlever la masse de l'eau."]] },
      { t: "num", c: "lire", label: "Exercice 11a · Quelle est la masse du liquide ?", unit: "g", ans: 250 },
      { t: "choice", c: "rais", label: "Exercice 11b · Est-ce de l'eau ?", o: ["C'est très probablement de l'eau : 250 mL d'eau ont une masse de 250 g", "Non : l'eau est plus lourde que ça", "On ne peut rien dire du tout"], a: 0 }],
    hints: ["1,5 L d'eau = 1,5 kg = 1 500 g. 50 cL = 0,5 L : 500 g d'eau.", "Pleine = vide + eau. Vide = pleine − eau. Pour l'exercice 11, la balance a été tarée avec le bécher.", "37 + 1 500 = 1 537 g · 521 − 500 = 21 g · 250 g · 1 mL d'eau = 1 g, donc 250 mL d'eau = 250 g : compatible avec de l'eau."],
    corr: "8a : 1,5 L d'eau a une masse de 1 500 g, donc la bouteille pleine pèse 37 + 1 500 = 1 537 g. 8b : 50 cL = 0,5 L, soit 500 g d'eau ; la bouteille vide pèse 521 − 500 = 21 g. 11 : la balance a été tarée avec le bécher, le liquide a une masse de 250 g. 250 mL d'eau ont une masse de 250 g : ce liquide est très probablement de l'eau (un autre liquide aurait le plus souvent une masse différente)." }] },

{ id: "p4", n: 4, icon: "🔁", tab: "Unités", title: "Les unités et les conversions", sub: "Exercices 6c, 7 et 9 · environ 15 minutes.",
  items: [
  { id: "d1", lvl: "easy", title: "⚡ Défi chrono : masse ou volume ?", intro: nb("<b>Exercice 6c.</b> Barre les mesures qui ne sont pas des mesures de volume."), widget: WG("Défi chrono", "tri"),
    parts: [
      { t: "task", c: "mod", label: "Réussis un tri parfait.", okMsg: "Tri parfait !", done: () => tk(triOk(), triOk() ? "Tri parfait réalisé." : "Tri parfait pas encore réalisé.") },
      { t: "num", c: "lire", label: "Combien de mesures as-tu barrées ?", unit: "", ans: 6 },
      { t: "choice", c: "conn", label: "Les mesures barrées sont des mesures de…", o: ["masse", "longueur", "température"], a: 0 }],
    hints: ["Les unités de volume se terminent par L (litre) ou par ³ (mètre cube…).", "Il faut barrer les mesures en g, kg et mg.", "6 mesures : 0,0004 mg · 96,5 kg · 0,502 g · 99 g · 1,11 kg · 0,218 mg. Ce sont des masses."],
    corr: "Les mesures en L, mL, cL, dL, hL, m³, dm³, cm³ sont des volumes. Il fallait barrer les 6 mesures de masse : 0,0004 mg ; 96,5 kg ; 0,502 g ; 99 g ; 1,11 kg ; 0,218 mg." },
  { id: "d2", lvl: "mid", title: "Convertir · exercice 7 (1)", widget: WG("Outil · Le tableau de conversion", "tableau"),
    parts: [{ t: "choice", c: "conn", label: "Exercice 7a · 1 L, c'est…", o: ["1 dm³ (ou 1 000 cm³)", "1 m³", "1 cm³"], a: 0 }].concat(C7A.map(c => convG(...c))),
    hints: ["Dans le tableau, place le chiffre des unités dans la colonne de l'unité de départ, puis cherche la colonne de l'unité d'arrivée.", "L = dm³ et mL = cm³ : ce sont les mêmes colonnes. Pour 47,5 g en cg, il faut ajouter un zéro.", "0,00078 m³ · 0,2407 L · 120 dm³ · 45 mL · 878 000 cm³ · 4 750 cg."],
    corr: "1 L = 1 dm³ = 1 000 cm³. 0,78 dm³ = 0,00078 m³ ; 240,7 mL = 0,2407 L ; 120 L = 120 dm³ ; 45 cm³ = 45 mL ; 878 dm³ = 878 000 cm³ ; 47,5 g = 4 750 cg." },
  { id: "d3", lvl: "mid", title: "Convertir · exercice 7 (2)", widget: WG("Outil · Le tableau de conversion", "tableau"),
    parts: C7B.map(c => convG(...c)),
    hints: ["Même méthode : chiffre des unités dans la colonne de départ, virgule dans la colonne d'arrivée.", "Vers une unité plus petite, le nombre devient plus grand (on ajoute des zéros) ; vers une plus grande, il devient plus petit.", "656 000 cm³ · 240 dm³ · 0,1301 L · 0,00067 m³ · 36 mL · 3 870 cg."],
    corr: "656 dm³ = 656 000 cm³ ; 240 L = 240 dm³ ; 130,1 mL = 0,1301 L ; 0,67 dm³ = 0,00067 m³ ; 36 cm³ = 36 mL ; 38,7 g = 3 870 cg." },
  { id: "d4", lvl: "hard", title: "Défi · exercice 9", widget: WG("Outil · Le tableau de conversion", "tableau"),
    parts: C9.map(c => convG(...c)),
    hints: ["1 daL (décalitre) = 10 L. Les colonnes hL, daL et L sont sous les dm³.", "Pour 321 mm³ en m³, il faut beaucoup de zéros : compte les colonnes entre mm³ et m³.", "100 cL · 1 310 000 mm³ · 0,12 dL · 0,000000321 m³ · 0,33 dm³ · 0,29 cm³ · 0,0015 m³ · 72,2 dm³."],
    corr: "1 L = 100 cL ; 1,31 dm³ = 1 310 000 mm³ ; 12 mL = 0,12 dL ; 321 mm³ = 0,000000321 m³ ; 33 cL = 0,33 dm³ ; 0,29 mL = 0,29 cm³ ; 1,5 L = 0,0015 m³ ; 7,22 daL = 72,2 dm³." }] },

{ id: "p5", n: 5, icon: "💧", tab: "Masse et volume", title: "Masse et volume : une relation", sub: "Exercices 10 et 6b · environ 10 minutes.",
  items: [
  { id: "e1", lvl: "mid", title: "1 litre d'eau = 1 kilogramme", intro: nb("<b>Exercices 10a, 10b et 6b.</b>"), widget: WG("Expérience · L'aquarium sur la balance", "eau"),
    parts: [
      { t: "task", c: "mod", label: "Verse au moins 3 L d'eau, litre par litre.", okMsg: "Au moins 3 L versés.", done: () => tk(eauOk(), eauOk() ? "Au moins 3 L versés." : `${xo("eau").L || 0} L versé(s).`) },
      { t: "num", c: "calc", label: "Exercice 10a · Masse de 17 L d'eau liquide ?", unit: "kg", ans: 17, err: [[v => v === 17000, "Juste en grammes ! La question attend des kilogrammes : 17 kg."]] },
      { t: "num", c: "calc", label: "Exercice 10b · Masse de 36 L d'eau liquide ?", unit: "kg", ans: 36, err: [[v => v === 36000, "Juste en grammes ! La question attend des kilogrammes : 36 kg."]] },
      { t: "rows", c: "conn", label: "Exercice 6b · Masse ou volume ?", choices: ["Masse", "Volume"], rows: [{ txt: "Se mesure avec une balance", a: 0 }, { txt: "Se mesure avec une éprouvette graduée", a: 1 }, { txt: "S'exprime en grammes ou en kilogrammes", a: 0 }, { txt: "S'exprime en litres ou en m³", a: 1 }, { txt: "C'est la place occupée par un objet", a: 1 }, { txt: "C'est la quantité de matière d'un objet", a: 0 }] }],
    hints: ["Touche « +1 L » plusieurs fois et regarde la balance.", "1 L → 1 kg, 2 L → 2 kg… La masse est proportionnelle au volume.", "17 kg · 36 kg · masse : balance, grammes, quantité de matière ; volume : éprouvette, litres, place occupée."],
    corr: "1 L d'eau a une masse de 1 kg : 17 L d'eau ont une masse de 17 kg et 36 L une masse de 36 kg. Trois différences entre masse et volume : la masse se mesure avec une balance, le volume avec une éprouvette ; la masse s'exprime en g ou kg, le volume en L ou m³ ; la masse est la quantité de matière, le volume la place occupée." },
  { id: "e2", lvl: "hard", title: "L'or et l'argent", intro: nb("<b>Exercices 10c et 10d.</b> Le volume de 2 kg d'or est de 104 cm³. Le volume de 3 kg d'argent est de 286 cm³."), widget: WG("Expérience · La pile de lingots", "lingots"),
    parts: [
      { t: "num", c: "calc", label: "Exercice 10c · Volume de 8 kg d'or ?", unit: "cm³", ans: 416, err: [[v => v === 832, "8 kg, c'est 4 fois 2 kg (et pas 8 fois) : 4 × 104."], [v => v === 208, "8 kg, c'est 4 lingots de 2 kg, pas 2."]] },
      { t: "num", c: "calc", label: "Exercice 10d · Volume de 6 kg d'argent ?", unit: "cm³", ans: 572, err: [[v => v === 1716, "6 kg, c'est 2 fois 3 kg (et pas 6 fois) : 2 × 286."]] },
      { t: "choice", c: "rais", label: "Comment justifier le calcul pour l'or ?", o: ["8 kg = 4 × 2 kg, donc le volume est 4 fois plus grand : 4 × 104 = 416 cm³", "8 kg = 8 lingots, donc 8 × 104 cm³", "On ajoute 6 à 104"], a: 0 },
      { t: "choice", c: "rais", label: "Défi · Pour une même masse de 1 kg, quel métal prend le plus de place ?", o: ["L'argent (environ 95 cm³, contre 52 cm³ pour l'or)", "L'or", "Les deux prennent la même place"], a: 0 }],
    hints: ["Ajoute des lingots d'or : combien de lingots de 2 kg pour faire 8 kg ?", "Masse et volume sont proportionnels : si la masse est multipliée par 4, le volume aussi.", "8 = 4 × 2 → 4 × 104 = 416 cm³ · 6 = 2 × 3 → 2 × 286 = 572 cm³ · 1 kg d'or : 104 ÷ 2 = 52 cm³ ; 1 kg d'argent : 286 ÷ 3 ≈ 95 cm³."],
    corr: "8 kg d'or, c'est 4 fois 2 kg : le volume est 4 fois plus grand, 4 × 104 = 416 cm³. 6 kg d'argent, c'est 2 fois 3 kg : 2 × 286 = 572 cm³. Pour une même matière, masse et volume sont proportionnels. Pour 1 kg, l'or occupe 52 cm³ et l'argent environ 95 cm³ : l'or est beaucoup plus « dense »." }] },

{ id: "p6", n: 6, icon: "🧊", tab: "Changements d'état", title: "Masse, volume et changements d'état", sub: "Exercices 12, 13, 15 et 14 · environ 15 minutes.",
  items: [
  { id: "f1", lvl: "hard", title: "Huile et glaçons", intro: nb("<b>Exercice 12.</b> On réalise l'expérience en trois étapes."), widget: WG("Expérience · L'éprouvette sur la balance", "huile", "Valeurs simulées"),
    parts: [
      { t: "task", c: "mod", label: "Réalise les trois étapes, jusqu'à la fusion complète des glaçons.", okMsg: "Les trois étapes sont faites.", done: () => tk(hgDone(), hgDone() ? "Les glaçons ont fondu." : `Étape ${xo("hg").s || 0}/3.`) },
      { t: "num", c: "lire", label: "12a · Volume d'huile introduit dans l'éprouvette ?", unit: "cm³", ans: 110 },
      { t: "num", c: "calc", label: "12b · Volume de glaçons introduit ?", unit: "cm³", ans: 66, err: [[v => v === 176, "176 cm³, c'est l'huile ET les glaçons : enlève le volume d'huile."]] },
      { t: "num", c: "calc", label: "12c · Masse des glaçons ?", unit: "g", ans: 60, err: [[v => v === 275, "275 g, c'est l'éprouvette, l'huile et les glaçons : fais la différence entre les étapes 2 et 1."]] },
      { t: "choice", c: "rais", label: "12d · Après la fusion des glaçons, la masse…", o: ["ne change pas (275 g) : c'était prévisible, la masse se conserve lors d'un changement d'état", "diminue, car la glace a disparu", "augmente, car l'eau est plus lourde que la glace"], a: 0 },
      { t: "choice", c: "rais", label: "12e · Le volume dans l'éprouvette…", o: ["diminue (176 → 170 cm³) : l'eau liquide occupe moins de place que la glace", "augmente : la glace fondue prend plus de place", "ne change pas"], a: 0 }],
    hints: ["Fais les étapes ① ② ③ dans l'ordre et lis, à chaque fois, le volume dans la loupe et la masse sur la balance.", "Volume de glaçons = volume à l'étape 2 − volume à l'étape 1. Masse des glaçons = masse à l'étape 2 − masse à l'étape 1.", "110 cm³ · 176 − 110 = 66 cm³ · 275 − 215 = 60 g · masse inchangée · volume en baisse : 66 cm³ de glace donnent 60 cm³ d'eau."],
    corr: "12a : 110 cm³ d'huile. 12b : 176 − 110 = 66 cm³ de glaçons. 12c : 275 − 215 = 60 g de glace. 12d : après la fusion, la balance affiche toujours 275 g : la masse se conserve lors d'un changement d'état, c'était prévisible. 12e : le volume diminue (176 → 170 cm³) : les 66 cm³ de glace ont donné 60 cm³ d'eau liquide. La glace occupe plus de place que l'eau liquide. (L'eau, plus dense que l'huile, tombe au fond.)" },
  { id: "f2", lvl: "mid", title: "La masse lors d'une fusion", intro: nb("<b>Exercices 15 et 13.</b> On place des glaçons dans un récipient fermé et on pèse l'ensemble, avant et après la fusion."), widget: WG("Expérience · Le flacon sur la balance", "flacon", "Valeurs simulées"),
    parts: [
      { t: "task", c: "mod", label: "Laisse fondre les glaçons dans le flacon fermé. Essaie aussi avec le flacon ouvert, en attendant 3 jours.", okMsg: "Fusion observée dans le flacon fermé.", done: () => { const s = xo("fla"); return tk(!!s.mF, `${s.mF ? "✓" : "○"} fusion, flacon fermé · ${s.eO ? "✓" : "○"} flacon ouvert pendant 3 jours (facultatif)`); } },
      { t: "choice", c: "conn", label: "15a · Quel changement d'état observe-t-on ?", o: ["La fusion : solide → liquide", "La solidification : liquide → solide", "La vaporisation : liquide → gaz"], a: 0 },
      { t: "choice", c: "rais", label: "15b · Que montre cette expérience ?", o: ["La masse se conserve lors d'un changement d'état", "La masse diminue quand la glace fond", "La glace n'a pas de masse"], a: 0 },
      { t: "choice", c: "rais", label: "Pourquoi le flacon doit-il être fermé ?", o: ["Pour qu'aucune eau ne s'échappe en s'évaporant, ce qui fausserait la pesée", "Pour que la glace fonde plus vite", "Pour que la balance fonctionne"], a: 0 },
      { t: "match", c: "rais", label: "13a · Remets dans l'ordre le protocole qui montre que la masse ne varie pas lors de la fusion.", ask: "Choisis l'action de", rows: [{ e: "1", txt: "Étape 1", v: "Placer des glaçons dans un flacon fermé" }, { e: "2", txt: "Étape 2", v: "Peser le flacon et noter sa masse" }, { e: "3", txt: "Étape 3", v: "Attendre que toute la glace ait fondu" }, { e: "4", txt: "Étape 4", v: "Peser à nouveau et comparer les deux masses" }] }],
    hints: ["Touche « Laisser fondre » et surveille l'affichage de la balance. Puis ouvre le flacon et attends 3 jours.", "La glace devient de l'eau liquide. Flacon ouvert : de la vapeur d'eau s'échappe.", "Fusion · la masse se conserve · bouchon : rien ne s'échappe · protocole : glaçons → pesée → fusion → nouvelle pesée."],
    corr: "On observe une fusion (solide → liquide). La balance affiche la même masse avant et après (167,2 g) : la masse se conserve lors d'un changement d'état. Le flacon doit être fermé : ouvert, une partie de l'eau s'évapore et la masse diminue, ce qui fausserait l'expérience. Protocole (exercice 13a) : placer des glaçons dans un flacon fermé, le peser, attendre la fusion complète, peser à nouveau et comparer. 13b : fais le schéma de ces deux pesées dans ton cahier." },
  { id: "f3", lvl: "hard", title: "Des roches qui éclatent", recop: true, intro: nb("<b>Exercice 14.</b> Après les pluies d'automne, certaines roches perméables éclatent pendant les grands froids de l'hiver. Les carrelages en terre cuite des terrasses aussi."), widget: WG("Expérience · Le gel dans la fissure", "roche", "Modèle simplifié"),
    parts: [
      { t: "task", c: "mod", label: "Fais pleuvoir, puis fais geler l'eau de la fissure jusqu'à ce que la roche éclate.", okMsg: "La roche a éclaté.", done: () => tk(rocDone(), rocDone() ? "La roche a éclaté." : "La roche n'a pas encore éclaté.") },
      { t: "choice", c: "lire", label: "Pendant les pluies d'automne…", o: ["l'eau entre dans les fissures et les pores de la roche perméable", "la roche fond", "la roche devient imperméable"], a: 0 },
      { t: "choice", c: "conn", label: "Quand l'eau gèle, son volume…", o: ["augmente (d'environ 9 %)", "diminue", "ne change pas"], a: 0, no: { 1: "Souviens-toi de l'exercice 12 : la glace occupe plus de place que l'eau liquide." } },
      { t: "choice", c: "rais", label: "Pourquoi la roche éclate-t-elle ?", o: ["La glace, plus volumineuse, pousse sur les parois de la fissure jusqu'à faire éclater la roche", "La glace est plus lourde que l'eau et écrase la roche", "Le froid fait rétrécir la roche"], a: 0 },
      { t: "choice", c: "rais", label: "Et pendant ce temps, la masse de l'eau de la fissure…", o: ["ne change pas : seul son volume augmente", "augmente", "diminue"], a: 0 }],
    hints: ["Touche « Pluie d'automne », puis descends la température sous 0 °C, puis jusqu'à −5 °C.", "Regarde l'étiquette sur la glace : de combien son volume augmente-t-il ?", "L'eau entre dans la fissure · en gelant, elle augmente de volume (+9 %) · la glace pousse et fait éclater la roche · la masse ne change pas."],
    corr: "Les pluies d'automne remplissent d'eau les fissures et les pores des roches perméables (et des carrelages en terre cuite). Quand il gèle, l'eau devient de la glace : sa masse ne change pas, mais son volume augmente d'environ 9 %. La glace pousse sur les parois et finit par faire éclater la roche. Recopie la fiche mémo dans ton cahier." }] }
];
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Le volume d'un objet, c'est…", o: ["la place qu'il occupe", "sa quantité de matière", "sa température"], a: 0 },
    { t: "choice", c: "conn", label: "La masse se mesure avec…", o: ["une balance", "une éprouvette graduée", "un thermomètre"], a: 0 },
    { t: "choice", c: "conn", label: "1 L est égal à…", o: ["1 000 mL", "100 mL", "10 mL"], a: 0 }],
  hints: ["Le volume, c'est de la place.", "On pose l'objet sur le plateau.", "La place · une balance · 1 L = 1 000 mL."],
  corr: "Le volume est la place occupée par un objet. La masse se mesure avec une balance. 1 L = 1 000 mL." };

/* ===== VERSION EXPERTE ===== */
const EXPERT = {
r0: { parts: [
    { t: "word", c: "conn", label: `Le volume se mesure avec une éprouvette ${gap}.`, ans: ["graduée", "graduee"] },
    { t: "word", c: "conn", label: `La masse se mesure avec une ${gap}.`, ans: ["balance"] },
    { t: "num", c: "calc", label: "1 L = combien de mL ?", unit: "mL", ans: 1000 }],
  hints: ["Elle porte des traits.", "Elle a un plateau et un écran.", "Graduée · balance · 1 000 mL."] },
a1: { parts: [
    { t: "task", c: "mod", label: "Pousse à fond le piston de la seringue bouchée, avec de l'air puis avec de l'eau.", okMsg: "Les deux essais sont faits.", done: () => { const t = xo("ser").t || {}; return tk(!!(t.airB && t.eauB), `${t.airB ? "✓" : "○"} air bouché poussé à fond · ${t.eauB ? "✓" : "○"} eau bouchée poussée à fond`); } },
    { t: "num", c: "lire", label: "Volume occupé par l'air quand on pousse à fond (seringue bouchée) ?", unit: "mL", ans: () => SER_MAX, tol: 0.3 },
    { t: "redac", c: "rais", min: 25, label: "Exercice 1 · Explique ce qui se passe avec l'air, puis avec l'eau. Utilise le mot « particules ».",
      crit: [{ g: "vois", lab: "Avec l'air, le volume diminue (le piston s'enfonce)", re: [/air/, /(diminu|s'enfonce|enfonc|reduit|se comprim|compress)/] }, { g: "vois", lab: "Avec l'eau, le piston ne bouge pas", re: [/eau/, /(ne bouge|bloqu|n'avance|pas enfonc|impossible|ne s'enfonce|incompress)/] }, { g: "sais", lab: "Les particules d'un gaz sont éloignées ; celles d'un liquide sont au contact", re: [/particule/, /(eloign|espace|ecart|vide|contact|colle|serre|touch)/] }, { g: "deduis", lab: "Un gaz est compressible, un liquide est incompressible", re: [/incompressible|ne se comprime pas|ne peut pas etre comprim/] }],
      model: "J'observe qu'avec l'air, le piston s'enfonce : le volume diminue. Avec l'eau, le piston ne bouge pas. Or les particules d'un gaz sont éloignées les unes des autres alors que celles d'un liquide sont au contact. Donc l'air est compressible (on rapproche ses particules) et l'eau est incompressible." },
    { t: "word", c: "conn", label: `Exercice 6a · Un liquide est ${gap} : on ne peut pas diminuer son volume.`, ans: ["incompressible", "incompressibles"], err: [[["compressible"], "C'est l'inverse : regarde l'essai avec l'eau."]] }],
  hints: ["Pousse à fond avec l'air bouché et lis le volume.", "J'observe (ce que fait le piston), or (les particules), donc (compressible ou non).", `≈ ${f1(SER_MAX)} mL · air compressible, eau incompressible · incompressible.`],
  corr: `Avec l'air, le volume tombe à environ ${f1(SER_MAX)} mL : l'air est compressible, ses particules sont éloignées. Avec l'eau, le piston ne bouge pas : ses particules sont au contact, un liquide est incompressible.` },
b1: { parts: [
    { t: "task", c: "mod", label: "Place ton œil en face du ménisque, pour chacune des deux éprouvettes.", okMsg: "Lecture correcte préparée pour les deux éprouvettes.", done: () => { const o = xo("epr").ok || {}; return tk(!!(o[1] && o[2]), `${o[1] ? "✓" : "○"} éprouvette ① · ${o[2] ? "✓" : "○"} éprouvette ②`); } },
    { t: "num", c: "lire", label: "Valeur d'une petite graduation sur l'éprouvette ② ?", unit: "mL", ans: 5 },
    { t: "num", c: "lire", label: "Volume contenu dans l'éprouvette ① ?", unit: "mL", ans: 74, tol: 0.5 },
    { t: "num", c: "lire", label: "Volume contenu dans l'éprouvette ② ?", unit: "mL", ans: 135, tol: 0.5 },
    { t: "redac", c: "conn", min: 15, label: "Exercice 4a · Décris la position qu'il faut prendre pour mesurer un volume.",
      crit: [{ g: "sais", lab: "L'éprouvette est posée sur une surface plane (horizontale)", re: [/(plat|plane|horizontal|table|poser|posee|droite|vertical)/] }, { g: "sais", lab: "L'œil est à la hauteur du liquide (en face)", re: [/(oeil|yeux|regard)/, /(hauteur|face|niveau|meme)/] }, { g: "sais", lab: "On lit au bas du ménisque", re: [/menisque/] }],
      model: "L'éprouvette est posée sur une table bien horizontale. Je place mon œil à la hauteur de la surface du liquide, en face, et je lis la graduation au niveau du bas du ménisque." }],
  hints: ["Compte les intervalles entre deux nombres.", "Dans la loupe, les traits bougent si l'œil n'est pas en face.", "5 mL · 74 mL · 135 mL · table horizontale, œil en face du bas du ménisque."],
  corr: "② : 10 intervalles entre 50 et 100 mL, soit 5 mL par graduation. Volumes : 74 mL et 135 mL. On pose l'éprouvette à plat et on lit, l'œil en face, au bas du ménisque." },
b2: { parts: [
    { t: "task", c: "mod", label: "Plonge la pâte entière, puis la pâte cassée en deux morceaux.", okMsg: "Les deux immersions sont faites.", done: () => { const d = xo("imm").done || {}; return tk(!!(d[1] && d[2]), `${d[1] ? "✓" : "○"} pâte entière · ${d[2] ? "✓" : "○"} deux morceaux`); } },
    { t: "num", c: "calc", label: "Exercice 3.1a · Volume de la pâte à modeler ?", unit: "mL", ans: 25, err: [[v => v === 125, "125 mL, c'est l'eau ET la pâte."]] },
    { t: "num", c: "calc", label: "Exercice 3.2 · Volume total des deux morceaux ?", unit: "mL", ans: 25 },
    { t: "redac", c: "rais", min: 25, label: "Exercices 3.1b et 3.2 · Explique la méthode utilisée, puis le résultat obtenu avec les deux morceaux.",
      crit: [{ g: "vois", lab: "Le niveau passe de 100 à 125 mL", re: [/100/, /125/] }, { g: "sais", lab: "La pâte prend la place de l'eau (déplacement d'eau)", re: [/(deplac|prend la place|monte|pousse l'eau|immerg|plong)/] }, { g: "deduis", lab: "Volume = 125 − 100 = 25 mL", re: [/25/] }, { g: "deduis", lab: "Deux morceaux : même volume, car même quantité de pâte", re: [/(meme|identique|toujours|pas change|ne change pas)/] }],
      model: "J'observe que le niveau de l'eau passe de 100 mL à 125 mL quand je plonge la pâte. Or la pâte prend la place de l'eau, qui monte : c'est la méthode du déplacement d'eau. Donc le volume de la pâte vaut 125 − 100 = 25 mL. Cassée en deux, la pâte garde le même volume total (25 mL), car la quantité de pâte n'a pas changé." }],
  hints: ["Lis le niveau avant et après.", "Volume = volume final − volume initial.", "25 mL · 25 mL · déplacement d'eau, même quantité de pâte."],
  corr: "La pâte déplace 125 − 100 = 25 mL d'eau : son volume est de 25 mL. En deux morceaux, toujours 25 mL. Fais le schéma de la manipulation dans ton cahier." },
c1: { parts: [
    { t: "task", c: "mod", label: "Pose le gobelet vide, fais la tare, puis verse le jus.", okMsg: "Tu as utilisé la tare.", done: () => { const f = xo("bal").f || {}; return tk(!!(f.gob && f.jusTare), `${f.gob ? "✓" : "○"} gobelet vide pesé · ${f.jusTare ? "✓" : "○"} jus versé après la tare`); } },
    { t: "num", c: "calc", label: "Exercice 5 · Masse du liquide contenu dans le gobelet ?", unit: "g", ans: 161.2, tol: 0.01, err: [[v => near(v, 167, 0.01), "167,0 g, c'est le gobelet ET le jus."]] },
    { t: "num", c: "lire", label: "Exercice 4b · Une balance affiche 654,3 g. Quelle est sa précision ?", unit: "g", ans: 0.1, tol: 0.001, err: [[v => v === 1, "Regarde le dernier chiffre affiché : il est après la virgule."]] },
    { t: "num", c: "lire", label: "Exercice 4c · Une balance affiche 123,4 g. Quelle est sa précision ?", unit: "g", ans: 0.1, tol: 0.001 },
    { t: "redac", c: "rais", min: 25, label: "Explique deux méthodes pour obtenir la masse du jus seul.",
      crit: [{ g: "sais", lab: "Méthode 1 : peser le gobelet vide puis plein, et soustraire", re: [/(soustra|moins|difference|−|-|enleve)/] }, { g: "sais", lab: "Méthode 2 : la tare (remise à zéro avec le gobelet posé)", re: [/tare|zero/] }, { g: "deduis", lab: "Résultat : 161,2 g", re: [/161[,.]2/] }],
      model: "Méthode 1 : je pèse le gobelet vide (5,8 g), puis le gobelet avec le jus (167,0 g), et je soustrais : 167,0 − 5,8 = 161,2 g. Méthode 2 : je pose le gobelet vide, j'appuie sur TARE pour remettre la balance à zéro, puis je verse le jus : la balance affiche directement 161,2 g." }],
  hints: ["Utilise la tare, ou fais une soustraction.", "La précision correspond au dernier chiffre affiché.", "161,2 g · 0,1 g · 0,1 g · soustraction ou tare."],
  corr: "Masse du jus : 167,0 − 5,8 = 161,2 g, ou directement 161,2 g après la tare. Précision : 0,1 g pour les deux balances (un chiffre après la virgule)." },
c2: { parts: [
    { t: "num", c: "calc", label: "Exercice 8a · Masse de la grande bouteille (1,5 L, 37 g vide) pleine d'eau ?", unit: "g", ans: 1537 },
    { t: "num", c: "calc", label: "Exercice 8b · Masse de la petite bouteille (50 cL, 521 g pleine) vide ?", unit: "g", ans: 21, err: [[v => v === 471, "50 cL = 0,5 L : 500 g d'eau."]] },
    { t: "num", c: "lire", label: "Exercice 11a · Masse du liquide ?", unit: "g", ans: 250 },
    { t: "redac", c: "rais", min: 20, label: "Exercice 11b · Est-ce de l'eau ? Justifie.",
      crit: [{ g: "vois", lab: "Tu cites 250 mL et 250 g", re: [/250/] }, { g: "sais", lab: "Tu rappelles que 1 mL d'eau a une masse de 1 g (ou 1 L = 1 kg)", re: [/(1 ?ml|1 ?l\b|un litre|un millilitre|1 ?cm)/, /(1 ?g\b|1 ?kg|un gramme|un kilo)/] }, { g: "deduis", lab: "Tu conclus que c'est compatible avec de l'eau", re: [/(eau|compatible|probable|surement|peut-etre|possible)/] }],
      model: "J'observe que 250 mL de ce liquide ont une masse de 250 g. Or 1 mL d'eau a une masse de 1 g, donc 250 mL d'eau ont une masse de 250 g. Donc ce liquide est très probablement de l'eau (pour en être sûr, il faudrait d'autres tests)." }],
  hints: ["1,5 L d'eau = 1 500 g ; 50 cL d'eau = 500 g.", "Pleine = vide + eau ; vide = pleine − eau.", "1 537 g · 21 g · 250 g · 250 mL d'eau = 250 g."],
  corr: "1 537 g ; 21 g ; 250 g. 250 mL d'eau ont une masse de 250 g : le liquide est très probablement de l'eau." },
d1: { parts: [
    { t: "task", c: "mod", label: "Réussis un tri parfait.", okMsg: "Tri parfait !", done: () => tk(triOk(), triOk() ? "Tri parfait réalisé." : "Tri parfait pas encore réalisé.") },
    { t: "num", c: "lire", label: "Combien de mesures as-tu barrées ?", unit: "", ans: 6 },
    { t: "list", c: "conn", label: "Écris les unités des mesures barrées (sans les répéter).", ph: "unité 1, unité 2, …", need: [{ re: /\bmg\b/ }, { re: /\bkg\b/ }, { re: /(^|[\s,;])g\b/ }], bad: [{ re: /(\bml\b|\bcl\b|\bdl\b|\bhl\b|cm[3³]|dm[3³]|\bm[3³]|(^|[\s,;])l\b)/ }] }],
  hints: ["Un volume s'exprime en L ou en …³.", "Il y a trois unités de masse différentes.", "6 mesures · g, kg, mg."],
  corr: "6 mesures barrées, en g, kg et mg : ce sont des masses." },
d2: { parts: [{ t: "num", c: "calc", label: "Exercice 7a · 1 L = combien de cm³ ?", unit: "cm³", ans: 1000 }].concat(C7A.map(c => convL(...c))) },
d3: { parts: C7B.map(c => convL(...c)) },
d4: { parts: C9.map(c => convL(...c)) },
e1: { parts: [
    { t: "task", c: "mod", label: "Verse au moins 3 L d'eau, litre par litre.", okMsg: "Au moins 3 L versés.", done: () => tk(eauOk(), eauOk() ? "Au moins 3 L versés." : `${xo("eau").L || 0} L versé(s).`) },
    { t: "num", c: "calc", label: "Exercice 10a · Masse de 17 L d'eau liquide ?", unit: "kg", ans: 17 },
    { t: "num", c: "calc", label: "Exercice 10b · Masse de 36 L d'eau liquide, en grammes ?", unit: "g", ans: 36000, err: [[v => v === 36, "36 kg : convertis en grammes."]] },
    { t: "redac", c: "conn", min: 20, label: "Exercice 6b · Donne trois différences entre la masse et le volume.",
      crit: [{ g: "sais", lab: "Instruments : balance / éprouvette graduée", re: [/balance/, /eprouvette/] }, { g: "sais", lab: "Unités : g ou kg / L ou m³", re: [/(gramme|\bg\b|kg|kilo)/, /(litre|\bl\b|m[3³]|cm[3³]|ml)/] }, { g: "sais", lab: "Définitions : quantité de matière / place occupée", re: [/(matiere)/, /(place|espace|occup)/] }],
      model: "1. La masse se mesure avec une balance, le volume avec une éprouvette graduée. 2. La masse s'exprime en grammes ou en kilogrammes, le volume en litres ou en mètres cubes. 3. La masse est la quantité de matière d'un objet, le volume est la place qu'il occupe." }],
  hints: ["Verse 3 L et regarde la balance.", "Pense aux instruments, aux unités et aux définitions.", "17 kg · 36 000 g · balance / éprouvette ; g / L ; matière / place."],
  corr: "17 L d'eau : 17 kg ; 36 L : 36 kg = 36 000 g. Différences : instrument (balance / éprouvette), unité (g / L), définition (quantité de matière / place occupée)." },
e2: { parts: [
    { t: "num", c: "calc", label: "Exercice 10c · Volume de 8 kg d'or ?", unit: "cm³", ans: 416 },
    { t: "num", c: "calc", label: "Exercice 10d · Volume de 6 kg d'argent ?", unit: "cm³", ans: 572 },
    { t: "num", c: "calc", label: "Défi · Volume de 1 kg d'or ?", unit: "cm³", ans: 52 },
    { t: "redac", c: "rais", min: 15, label: "Justifie ton calcul pour les 8 kg d'or.",
      crit: [{ g: "sais", lab: "8 kg = 4 × 2 kg (masse multipliée par 4)", re: [/(4|quatre)/] }, { g: "sais", lab: "Proportionnalité : le volume est multiplié par 4 aussi", re: [/(proportion|aussi|meme|4 ?(×|x|fois) ?104|104 ?(×|x|fois) ?4)/] }, { g: "deduis", lab: "Résultat : 416 cm³", re: [/416/] }],
      model: "8 kg, c'est 4 fois 2 kg. Comme la masse et le volume sont proportionnels, le volume est lui aussi multiplié par 4 : 4 × 104 = 416 cm³." }],
  hints: ["Combien de fois 2 kg dans 8 kg ?", "Masse × 4 → volume × 4.", "416 cm³ · 572 cm³ · 52 cm³."],
  corr: "8 kg = 4 × 2 kg → 4 × 104 = 416 cm³. 6 kg = 2 × 3 kg → 2 × 286 = 572 cm³. 1 kg d'or : 104 ÷ 2 = 52 cm³." },
f1: { parts: [
    { t: "task", c: "mod", label: "Réalise les trois étapes, jusqu'à la fusion complète des glaçons.", okMsg: "Les trois étapes sont faites.", done: () => tk(hgDone(), hgDone() ? "Les glaçons ont fondu." : `Étape ${xo("hg").s || 0}/3.`) },
    { t: "num", c: "lire", label: "12a · Volume d'huile ?", unit: "cm³", ans: 110 },
    { t: "num", c: "calc", label: "12b · Volume de glaçons ?", unit: "cm³", ans: 66 },
    { t: "num", c: "calc", label: "12c · Masse des glaçons ?", unit: "g", ans: 60 },
    { t: "num", c: "calc", label: "Volume d'eau liquide obtenu après la fusion ?", unit: "cm³", ans: 60, err: [[v => v === 170, "170 cm³, c'est l'huile ET l'eau."]] },
    { t: "redac", c: "rais", min: 30, label: "12d et 12e · Que deviennent la masse et le volume après la fusion ? Explique.",
      crit: [{ g: "vois", lab: "La masse reste 275 g", re: [/275|ne change pas|reste la meme|identique|conserv/] }, { g: "vois", lab: "Le volume diminue de 176 à 170 cm³", re: [/(176|170|diminu|baiss)/] }, { g: "sais", lab: "La masse se conserve lors d'un changement d'état", re: [/conserv|ne varie pas|ne change pas/] }, { g: "deduis", lab: "La glace occupe plus de place que l'eau liquide", re: [/glace/, /(plus de place|plus de volume|volumineu|plus grand|plus gros|moins de place)/] }],
      model: "J'observe qu'après la fusion, la balance affiche toujours 275 g, mais que le volume passe de 176 à 170 cm³. Or la masse se conserve lors d'un changement d'état. Donc c'était prévisible ; en revanche, le volume diminue car les 66 cm³ de glace donnent seulement 60 cm³ d'eau liquide : la glace occupe plus de place que l'eau liquide." }],
  hints: ["Fais les trois étapes dans l'ordre.", "Volume d'eau de fusion = volume final − volume d'huile.", "110 · 66 · 60 g · 60 cm³ · masse conservée, volume en baisse."],
  corr: "110 cm³ ; 66 cm³ ; 60 g ; 170 − 110 = 60 cm³ d'eau. La masse se conserve (275 g) ; le volume diminue car la glace occupe plus de place que l'eau liquide." },
f2: { parts: [
    { t: "task", c: "mod", label: "Laisse fondre les glaçons dans le flacon fermé. Essaie aussi avec le flacon ouvert, en attendant 3 jours.", okMsg: "Fusion observée dans le flacon fermé.", done: () => { const s = xo("fla"); return tk(!!s.mF, `${s.mF ? "✓" : "○"} fusion, flacon fermé · ${s.eO ? "✓" : "○"} flacon ouvert pendant 3 jours (facultatif)`); } },
    { t: "num", c: "lire", label: "Masse affichée après la fusion, flacon fermé ?", unit: "g", ans: 167.2, tol: 0.01 },
    { t: "word", c: "conn", label: `15a · Le changement d'état observé est la ${gap}.`, ans: ["fusion"] },
    { t: "redac", c: "rais", min: 30, label: "13a · Rédige le protocole d'une expérience qui montre que la masse ne varie pas lors de la fusion.",
      crit: [{ g: "sais", lab: "Glaçons dans un récipient fermé", re: [/(glace|glacon)/, /(ferm|bouch|clos)/] }, { g: "sais", lab: "Peser avant la fusion", re: [/(pes|balance|mass)/] }, { g: "sais", lab: "Attendre la fusion complète", re: [/(fond|fusion|attend)/] }, { g: "deduis", lab: "Peser après et comparer les deux masses", re: [/(compar|apres|a nouveau|deuxieme|encore)/] }],
      model: "Je place des glaçons dans un flacon que je ferme avec un bouchon. Je pèse le flacon sur une balance et je note la masse. J'attends que toute la glace ait fondu, puis je pèse à nouveau le flacon et je compare les deux masses : elles sont égales." }],
  hints: ["Lis la balance avant et après la fusion.", "Ton protocole : quoi, dans quel récipient, quand peser, que comparer ?", "167,2 g · fusion · flacon fermé, pesée, fusion, nouvelle pesée."],
  corr: "167,2 g avant et après : la masse se conserve lors de la fusion. Protocole : glaçons dans un flacon fermé, pesée, fusion complète, nouvelle pesée, comparaison. Le flacon doit rester fermé, sinon l'eau s'évapore. 13b : fais le schéma des deux pesées dans ton cahier." },
f3: { parts: [
    { t: "task", c: "mod", label: "Fais pleuvoir, puis fais geler l'eau de la fissure jusqu'à ce que la roche éclate.", okMsg: "La roche a éclaté.", done: () => tk(rocDone(), rocDone() ? "La roche a éclaté." : "La roche n'a pas encore éclaté.") },
    { t: "num", c: "calc", label: "L'eau augmente d'environ 9 % de volume en gelant. Quel volume de glace donnent 100 cm³ d'eau ?", unit: "cm³", ans: 109, tol: 1 },
    { t: "redac", c: "rais", min: 35, label: "Exercice 14 · Explique pourquoi certaines roches et certains carrelages éclatent pendant les grands froids.",
      crit: [{ g: "vois", lab: "L'eau de pluie entre dans les fissures (roche perméable)", re: [/(eau|pluie)/, /(entre|penetre|infiltr|remplit|fissure|pore|permeable)/] }, { g: "sais", lab: "En gelant, l'eau augmente de volume", re: [/(gel|glace|solidif)/, /(augmente|plus de volume|plus de place|gonfl|dilat|volumineu)/] }, { g: "deduis", lab: "La glace pousse et fait éclater la roche", re: [/(pousse|eclat|casse|fissur|appuie|force)/] }],
      model: "J'observe qu'en automne, l'eau de pluie entre dans les fissures et les pores des roches perméables et des carrelages en terre cuite. Or, quand elle gèle, l'eau augmente de volume (environ +9 %) alors que sa masse ne change pas. Donc la glace pousse sur les parois et finit par faire éclater la roche ou le carrelage." }],
  hints: ["Pluie, puis gel sous −5 °C.", "100 cm³ + 9 % de 100 cm³.", "109 cm³ · l'eau entre, gèle, gonfle et fait éclater la roche."],
  corr: "100 + 9 = 109 cm³ de glace. L'eau entre dans les fissures ; en gelant, elle augmente de volume ; la glace pousse et fait éclater la roche. Recopie la fiche mémo dans ton cahier." }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `Le problème : ${PROBLEM}\n${HOME.goal}\n\nFiche mémo à recopier\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
