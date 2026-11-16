/* ===== 5e EIST · Vitesses et mouvements : contenus, d'après les fiches du professeur (activités 2 et 3) ===== */
const PROBLEM = "Comment savoir si un objet va vite, et s'il accélère, ralentit ou garde la même vitesse ?";
const gap = `<span class="gap">………</span>`;
const T3 = ["Accéléré", "Uniforme", "Ralenti"], V3 = ["Elle augmente", "Elle reste la même", "Elle diminue"], E3 = ["Il augmente", "Il reste le même", "Il diminue"];
const tab = (n, v) => `<div><span class="tn">Tableau ${n}</span>${tbl(["t (s)", "0", "10", "20", "30", "40"], [["v (m/s)", ...v]])}</div>`;
const DOC_CHRONO = { title: "Document · La position d'un objet toutes les 5 secondes", w: "chronoFig" };
const DOC_TABS = { title: "Document · La vitesse d'un objet relevée toutes les 10 secondes", html: `<div class="tabs3">${tab(1, [0, 10, 20, 25, 30])}${tab(2, [25, 25, 25, 25, 25])}${tab(3, [25, 15, 10, 5, 0])}</div>` };
const DOC_GRAPH = { title: "Document · La vitesse d'une fusée en fonction du temps", w: "graphFig" };
const BILAN = [
  ["Si un objet parcourt des distances de plus en plus grandes pendant des intervalles de temps égaux, son mouvement est ", "accéléré", " car sa vitesse ", "augmente", ". Exemple : fusée au décollage."],
  ["Si un objet parcourt des distances de plus en plus petites pendant des intervalles de temps égaux, son mouvement est ", "ralenti", " car sa vitesse ", "diminue", ". Exemple : fusée à l'atterrissage."],
  ["Si un objet parcourt des distances égales pendant des intervalles de temps égaux, son mouvement est ", "uniforme", " car sa vitesse est ", "constante", "."]];
const bilanHTML = () => `<p>Une vitesse s'exprime en <u>m/s</u>, en <u>km/h</u> ou en <u>km/s</u>.</p>` + BILAN.map(l => `<p>${l.map((x, i) => i % 2 ? `<u>${x}</u>` : x).join("")}</p>`).join("");
const word = (label, ans, err) => ({ t: "word", c: "conn", label, ans, err });

const GROUPS = [
{ id: "p1", n: 1, icon: "🏎", tab: "Vitesses", title: "Des vitesses très différentes", sub: "Relie chaque objet à sa vitesse, puis découvre les unités.",
  items: [
  { id: "a1", lvl: "easy", title: "À chacun sa vitesse",
    parts: [{ t: "match", c: "conn", label: "Relie chaque objet à sa vitesse.", rows: [
      { e: "🏃", txt: "Usain Bolt sur une distance de 100 m", v: "10 m/s = 36 km/h" }, { e: "🚶", txt: "Un marcheur", v: "1,7 m/s" }, { e: "🔊", txt: "Le son dans l'air", v: "340 m/s" }, { e: "🛰", txt: "La station spatiale internationale", v: "27 600 km/h" },
      { e: "🐆", txt: "Un guépard", v: "110 km/h" }, { e: "🚗", txt: "Une voiture sur autoroute", v: "130 km/h" }, { e: "🐌", txt: "Un escargot", v: "0,013 m/s" }, { e: "💡", txt: "La lumière", v: "300 000 km/s" }] }],
    hints: ["Commence par les extrêmes : le plus lent et le plus rapide.", "Rien ne va plus vite que la lumière. Sur autoroute, la vitesse est limitée à 130 km/h.", "Le champion court 100 m en 10 s environ. Le guépard est l'animal terrestre le plus rapide : 110 km/h."],
    corr: "Escargot : 0,013 m/s · marcheur : 1,7 m/s · Usain Bolt : 10 m/s = 36 km/h · guépard : 110 km/h · voiture sur autoroute : 130 km/h · son dans l'air : 340 m/s · station spatiale : 27 600 km/h · lumière : 300 000 km/s.",
    unlock: { title: "🔓 Animation débloquée · La course sur 100 m", w: "course", sim: "Vitesses de la fiche" } },
  { id: "a2", lvl: "mid", title: "Les unités de vitesse",
    intro: "Regarde les vitesses de l'étape 1 : elles ne sont pas toutes écrites avec la même unité.",
    parts: [
      { t: "multi", c: "conn", label: "Quelles sont les unités possibles pour exprimer une vitesse ? (3 réponses)", o: ["m/s", "km/h", "km/s", "km", "s", "kg"], a: [0, 1, 2] },
      { t: "choice", c: "rais", label: "Une unité de vitesse est toujours formée…", o: ["d'une unité de distance divisée par une unité de durée", "d'une unité de durée divisée par une unité de distance", "d'une unité de masse"], a: 0 },
      { t: "num", c: "lire", label: "D'après l'étape 1, 10 m/s, c'est combien de km/h ?", unit: "km/h", ans: 36 }],
    hints: ["Dans « km/h », la barre se lit « par » : des kilomètres par heure.", "Le mètre et le kilomètre mesurent une distance, la seconde et l'heure une durée.", "m/s, km/h et km/s sont des unités de vitesse. 10 m/s = 36 km/h."],
    corr: "Une vitesse s'exprime en m/s (mètre par seconde), en km/h (kilomètre par heure) ou en km/s (kilomètre par seconde) : toujours une distance divisée par une durée. Le km est une distance, la seconde une durée, le kg une masse." },
  { id: "a3", lvl: "hard", title: "Défi · Comparer des vitesses",
    intro: `<div class="box key"><p class="lab">✔ Règle clé</p><p>10 m/s = 36 km/h. Pour passer des m/s aux km/h, on multiplie par 3,6. Pour passer des km/h aux m/s, on divise par 3,6.</p></div>`,
    parts: [
      { t: "num", c: "calc", label: "Un marcheur avance à 1,7 m/s. Quelle est sa vitesse en km/h ? (arrondis au dixième)", unit: "km/h", ans: 6.1, tol: 0.15, err: [[v => Math.abs(v - 0.47) < 0.03, "Tu as divisé par 3,6. Pour aller des m/s vers les km/h, on multiplie."]] },
      { t: "num", c: "calc", label: "Un guépard court à 110 km/h. Quelle est sa vitesse en m/s ? (arrondis à l'unité)", unit: "m/s", ans: 31, tol: 0.7, err: [[v => Math.abs(v - 396) < 2, "Tu as multiplié par 3,6. Pour aller des km/h vers les m/s, on divise."]] },
      { t: "choice", c: "rais", label: "Qui est le plus rapide ?", o: ["Usain Bolt à 10 m/s", "Un vélo à 25 km/h", "Ils vont à la même vitesse"], a: 0, no: { 1: "Pour comparer, il faut la même unité : 10 m/s = 36 km/h." } }],
    hints: ["Pour comparer deux vitesses, écris-les d'abord dans la même unité.", "1,7 × 3,6 = ? et 110 ÷ 3,6 = ?", "Marcheur : environ 6,1 km/h. Guépard : environ 31 m/s. Bolt : 36 km/h, plus que 25 km/h."],
    corr: "1,7 × 3,6 ≈ 6,1 km/h. 110 ÷ 3,6 ≈ 31 m/s. Usain Bolt court à 36 km/h : il est plus rapide qu'un vélo à 25 km/h. On ne compare deux vitesses que dans la même unité." }] },

{ id: "p2", n: 2, icon: "📍", tab: "Positions", title: "Lire un mouvement avec des points", sub: "Pilote un rover, puis reconnais trois mouvements.",
  items: [
  { id: "b1", lvl: "easy", title: "Pilote le rover",
    widget: { title: "Simulation · Le rover laisse un point chaque seconde", w: "rover", sim: "Modèle simplifié" },
    parts: [{ t: "rows", c: "mod", label: "Fais rouler le rover, accélère, freine. Que devient l'écart entre deux points ?", choices: E3, rows: [{ txt: "Quand le rover accélère", a: 0 }, { txt: "Quand le rover garde la même vitesse", a: 1 }, { txt: "Quand le rover freine", a: 2 }] }],
    hints: ["Lance le rover, puis touche « Accélérer » pendant qu'il roule.", "Compare l'écart entre les premiers points et l'écart entre les derniers.", "Plus le rover va vite, plus il avance en une seconde : les points s'écartent."],
    corr: "En une seconde, le rover avance d'autant plus qu'il va vite. S'il accélère, l'écart entre deux points augmente. S'il garde la même vitesse, l'écart reste le même. S'il freine, l'écart diminue." },
  { id: "b2", lvl: "mid", title: "Trois mouvements à reconnaître", docs: [DOC_CHRONO],
    parts: [
      { t: "rows", c: "lire", label: "Observe l'écart entre deux points qui se suivent. Que devient-il ?", choices: E3, rows: [{ txt: "Mouvement 1 : l'écart entre 2 points…", a: 1 }, { txt: "Mouvement 2 : l'écart entre 2 points…", a: 0 }, { txt: "Mouvement 3 : l'écart entre 2 points…", a: 2 }] },
      { t: "rows", c: "rais", label: "Donc le mouvement est…", choices: T3, rows: [{ txt: "Mouvement 1", a: 1 }, { txt: "Mouvement 2", a: 0 }, { txt: "Mouvement 3", a: 2 }] }],
    hints: ["L'objet va de gauche à droite : compare le premier écart et le dernier.", "Des écarts qui grandissent : l'objet va de plus en plus vite.", "Mouvement 1 : écarts égaux, uniforme. Mouvement 2 : écarts qui augmentent, accéléré. Mouvement 3 : écarts qui diminuent, ralenti."],
    corr: "Mouvement 1 : uniforme, car l'écart entre 2 points reste le même. Mouvement 2 : accéléré, car l'écart entre 2 points augmente. Mouvement 3 : ralenti, car l'écart entre 2 points diminue.",
    unlock: { title: "🔓 Animation débloquée · Les trois objets en mouvement", w: "chrono3", sim: "Modèle simplifié" } }] },

{ id: "p3", n: 3, icon: "📈", tab: "Mesures", title: "Lire un mouvement avec des mesures", sub: "Des tableaux, puis le graphique de la fusée.",
  items: [
  { id: "c1", lvl: "easy", title: "Trois tableaux de vitesse", docs: [DOC_TABS],
    parts: [
      { t: "num", c: "lire", label: "Tableau 1 : quelle est la vitesse à 30 s ?", unit: "m/s", ans: 25, err: [[v => v === 30, "30, c'est la vitesse à 40 s. Lis la colonne « 30 »."]] },
      { t: "rows", c: "lire", label: "Dans chaque tableau, que fait la vitesse quand le temps passe ?", choices: V3, rows: [{ txt: "Tableau 1", a: 0 }, { txt: "Tableau 2", a: 1 }, { txt: "Tableau 3", a: 2 }] },
      { t: "rows", c: "rais", label: "Donc le mouvement est…", choices: T3, rows: [{ txt: "Tableau 1", a: 0 }, { txt: "Tableau 2", a: 1 }, { txt: "Tableau 3", a: 2 }] }],
    hints: ["Lis la ligne « v (m/s) » de gauche à droite.", "Tableau 1 : 0, 10, 20, 25, 30. Les nombres grandissent-ils ?", "Tableau 1 : la vitesse augmente, accéléré. Tableau 2 : toujours 25, uniforme. Tableau 3 : la vitesse diminue, ralenti."],
    corr: "Tableau 1 : la vitesse augmente (de 0 à 30 m/s), le mouvement est accéléré. Tableau 2 : la vitesse reste égale à 25 m/s, le mouvement est uniforme. Tableau 3 : la vitesse diminue (de 25 à 0 m/s), le mouvement est ralenti." },
  { id: "c2", lvl: "mid", title: "Le vol de la fusée", docs: [DOC_GRAPH],
    parts: [
      { t: "num", c: "lire", label: "Touche le graphique. Quelle est la vitesse de la fusée à 20 s ?", unit: "m/s", ans: 40, tol: 1 },
      { t: "rows", c: "lire", label: "Comment varie la vitesse de la fusée ?", choices: V3, rows: [{ txt: "Entre 0 et 25 s", a: 0 }, { txt: "Entre 25 et 45 s", a: 1 }, { txt: "Entre 45 et 75 s", a: 2 }] },
      { t: "rows", c: "rais", label: "Qu'en déduire sur le mouvement de la fusée pendant cette durée ?", choices: T3, rows: [{ txt: "Entre 0 et 25 s", a: 0 }, { txt: "Entre 25 et 45 s", a: 1 }, { txt: "Entre 45 et 75 s", a: 2 }] }],
    hints: ["Touche un point du graphique : le temps et la vitesse s'affichent dessous.", "Quand les points montent, la vitesse augmente. Quand ils sont à la même hauteur, elle ne change pas.", "0 à 25 s : la vitesse augmente, accéléré. 25 à 45 s : elle reste à 50 m/s, uniforme. 45 à 75 s : elle diminue, ralenti."],
    corr: "Entre 0 et 25 s, la vitesse augmente de 0 à 50 m/s : le mouvement est accéléré. Entre 25 et 45 s, la vitesse reste égale à 50 m/s : le mouvement est uniforme. Entre 45 et 75 s, la vitesse diminue de 50 à 20 m/s : le mouvement est ralenti.",
    unlock: { title: "🔓 Animation débloquée · La fusée et son graphique", w: "fusee", sim: "Modèle simplifié" } },
  { id: "c3", lvl: "hard", title: "Défi · Questions de pilote", docs: [DOC_GRAPH],
    parts: [
      { t: "num", c: "lire", label: "Quelle est la vitesse maximale de la fusée ?", unit: "m/s", ans: 50, tol: 1 },
      { t: "num", c: "lire", label: "Pendant combien de secondes garde-t-elle cette vitesse maximale ?", unit: "s", ans: 20, tol: 1, err: [[v => v === 45, "45 s, c'est le moment où elle cesse d'aller à cette vitesse. On demande une durée : de 25 s à 45 s."], [v => v === 25, "25 s, c'est le moment où elle atteint cette vitesse. On demande une durée : de 25 s à 45 s."]] },
      { t: "choice", c: "rais", label: "À 75 s, la fusée est-elle arrêtée ?", o: ["Oui, sa vitesse est nulle", "Non, elle avance encore à 20 m/s", "On ne peut pas le savoir"], a: 1, no: { 0: "Lis la vitesse du dernier point : elle n'est pas égale à 0." } },
      { t: "num", c: "calc", label: "Entre 0 et 25 s, de combien la vitesse augmente-t-elle toutes les 5 secondes ?", unit: "m/s", ans: 10, tol: 0.5, err: [[v => v === 50, "50 m/s, c'est l'augmentation totale en 25 s. On demande pour 5 secondes."]] }],
    hints: ["La vitesse maximale correspond aux points les plus hauts.", "La fusée va à 50 m/s de 25 s à 45 s : fais la soustraction.", "50 m/s pendant 20 s. À 75 s : 20 m/s. De 0 à 25 s : + 10 m/s toutes les 5 s."],
    corr: "La vitesse maximale est de 50 m/s. La fusée la garde de 25 s à 45 s, soit pendant 20 s. À 75 s, elle avance encore à 20 m/s : elle ralentit mais n'est pas arrêtée. Entre 0 et 25 s, sa vitesse augmente de 10 m/s toutes les 5 secondes." }] },

{ id: "p4", n: 4, icon: "🏁", tab: "Conclusion", title: "Conclusion de la mission", sub: "Complète la conclusion, puis recopie-la dans ton cahier.",
  items: [
  { id: "d2", lvl: "mid", title: "Compléter la conclusion", recop: true,
    intro: "Écris le mot qui manque. Les accents et les petites fautes de frappe sont acceptés.",
    parts: [
      word(`Si un objet parcourt des distances de plus en plus grandes pendant des intervalles de temps égaux, son mouvement est ${gap}…`, ["accéléré", "accélérée"], [[["ralenti"], "Des distances de plus en plus grandes : l'objet va de plus en plus vite."], [["uniforme"], "Uniforme, c'est quand les distances sont égales."]]),
      word(`… car sa vitesse ${gap}. Exemple : fusée au décollage.`, ["augmente", "accélère", "grandit", "croît"], [[["diminue"], "Au décollage, la fusée va de plus en plus vite."]]),
      word(`Si un objet parcourt des distances de plus en plus petites pendant des intervalles de temps égaux, son mouvement est ${gap}…`, ["ralenti", "ralentie", "décéléré"], [[["accéléré"], "Des distances de plus en plus petites : l'objet va de moins en moins vite."]]),
      word(`… car sa vitesse ${gap}. Exemple : fusée à l'atterrissage.`, ["diminue", "baisse", "décroît", "ralentit"], [[["augmente"], "À l'atterrissage, la fusée va de moins en moins vite."]]),
      word(`Si un objet parcourt des distances égales pendant des intervalles de temps égaux, son mouvement est ${gap}…`, ["uniforme"], [[["constant", "constante", "régulier"], "C'est l'idée. Le mot attendu est celui des étapes précédentes : il commence par « uni »."]]),
      word(`… car sa vitesse est ${gap}.`, ["constante", "constant", "la même", "toujours la même", "identique", "fixe"], [[["uniforme"], "C'est le mouvement qui est uniforme. La vitesse, elle, ne change pas : elle est…"]])],
    hints: ["Les trois mots pour le mouvement : accéléré, ralenti, uniforme.", "Les mots pour la vitesse : augmente, diminue, constante.", "Accéléré car sa vitesse augmente · ralenti car sa vitesse diminue · uniforme car sa vitesse est constante."],
    corr: "Mouvement accéléré : la vitesse augmente. Mouvement ralenti : la vitesse diminue. Mouvement uniforme : la vitesse est constante." }] }
];

const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement",
  parts: [
    { t: "choice", c: "conn", label: "Deux fusées volent pendant 10 secondes. La fusée A parcourt 100 m, la fusée B parcourt 300 m. Laquelle est la plus rapide ?", o: ["La fusée A", "La fusée B", "Elles vont à la même vitesse"], a: 1 },
    { t: "choice", c: "conn", label: "Que lit-on sur le compteur d'une voiture ?", o: ["Une distance", "Une durée", "Une vitesse"], a: 2 }],
  hints: ["Dans le même temps, laquelle va le plus loin ?", "Le compteur affiche par exemple « 50 km/h ».", "La fusée B · une vitesse."],
  corr: "Dans la même durée, l'objet le plus rapide est celui qui parcourt la plus grande distance : c'est la fusée B. Le compteur d'une voiture indique sa vitesse, par exemple 50 km/h." };

const RESUME = `Mission : ${PROBLEM}

À retenir
- Une vitesse s'exprime en m/s, en km/h ou en km/s : une distance divisée par une durée. 10 m/s = 36 km/h.
- Ordres de grandeur : escargot 0,013 m/s ; marcheur 1,7 m/s ; Usain Bolt 10 m/s ; guépard 110 km/h ; voiture sur autoroute 130 km/h ; son dans l'air 340 m/s ; station spatiale 27 600 km/h ; lumière 300 000 km/s.
- ${BILAN.map(l => l.join("")).join("\n- ")}`;

typo(GROUPS); typo(RAPPEL); BILAN.forEach((l, i) => { BILAN[i] = l.map(nb); });
