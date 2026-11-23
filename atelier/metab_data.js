/* ===== 2nde SVT · Thème 1 · Chapitre 2 · Le métabolisme des cellules · Fiche de révision animée : contenus =====
   D'après la fiche de révision du professeur (6 parties + « Ce qu'il faut retenir »).
   Évaluation : aucune question, aucun document, aucune situation et aucune réponse des DS n°2 (versions 2F et 2B).
   Les compétences évaluées sont entraînées sur d'autres situations : micro-organismes mystères en culture, microscope et
   barre d'échelle, tilleul, graines de pois en ExAO. Pas de schéma de cellule avec ses échanges gazeux, pas de définition
   de la voie métabolique, aucun exercice sur l'euglène en ExAO ni sur la fermentation des levures. */
const PROBLEM = "Comment les cellules obtiennent-elles la matière et l'énergie dont elles ont besoin ?";
const tk2 = ok => ok ? "✓" : "○";
const taskMsg = (ok, msg) => ({ ok, msg });
const T_US = () => { const u = xst().us || {}; return taskMsg(!!(u.syn && u.nrg), `${tk2(u.syn)} atelier synthèse · ${tk2(u.nrg)} atelier énergie`); };
const T_CU = () => { const u = xst().cu || {}; return taskMsg(!!(u[1] && u[2]), `${tk2(u[1])} culture du micro-organisme ① · ${tk2(u[2])} culture du micro-organisme ②`); };
const T_RX = () => { const u = xst().rx || {}; return taskMsg(!!(u.r && u.a && u.l), `${tk2(u.r)} respiration · ${tk2(u.a)} fermentation alcoolique · ${tk2(u.l)} fermentation lactique`); };
const T_PH = () => { const u = xst().ph || {}; return taskMsg(!!(u.on && u.off), `${tk2(u.on)} lampe allumée · ${tk2(u.off)} lampe éteinte (animation jusqu'au bout)`); };
const T_MI = () => { const u = xst().mi || {}; const n = ["lc", "lb", "ec", "eb"].filter(k => u[k]).length; return taskMsg(n === 4, `${tk2(u.lc && u.lb)} levures : règle sous la cellule et sous la barre · ${tk2(u.ec && u.eb)} euglènes : règle sous la cellule et sous la barre`); };
const T_RS = () => { const u = xst().rs || {}; return taskMsg(!!(u.bee && u.aph && u.lad && u.cep), `${tk2(u.bee)} abeille · ${tk2(u.aph)} puceron · ${tk2(u.lad)} coccinelle · ${tk2(u.cep)} cèpe (animation lancée)`); };
const T_DG = () => { const u = xst().dg || {}; return taskMsg(!!(u.trip && u.am && u.pr), `${tk2(u.trip)} trajet complet · ${tk2(u.am)} amidon + amylase · ${tk2(u.pr)} protéine + amylase`); };
const T_VO = () => { const u = xst().vo || {}; return taskMsg(!!(u.foie && u.muscle && u.adip), `${tk2(u.foie)} foie · ${tk2(u.muscle)} muscle · ${tk2(u.adip)} tissu adipeux`); };
const T_EX = () => { const u = xst().ex || {}; return taskMsg(!!(u.g && u.s), `${tk2(u.g)} graines en germination · ${tk2(u.s)} graines sèches (20 min de mesures)`); };

const HOME = { slug: "fiche-animee-metabolisme", short: "Fiche animée · Le métabolisme", last: "f1", lastG: "p6", lastK: 0, dur: "environ 1 heure en tout, ou une partie par jour pour réviser",
  kicker: "Thème 1 · Chapitre 2 · Le métabolisme des cellules · Fiche de révision animée", title: "Le métabolisme des cellules : la fiche animée",
  intro: "Toute la fiche de révision du chapitre, partie par partie : à chaque étape, tu relis la fiche, tu lances une animation ou une expérience virtuelle, puis tu vérifies que tu as compris.",
  lab: "La question du chapitre", goal: "Objectif : connaître les définitions et les équations bilans, comparer des métabolismes, suivre la matière dans l'environnement et dans le corps humain, et s'entraîner à analyser un graphique d'échanges gazeux.",
  fact: "La molécule de glucose est la même chez la levure, l'euglène, le tilleul et l'être humain : C₆H₁₂O₆, soit 6 atomes de carbone, 12 d'hydrogène et 6 d'oxygène.",
  parts: "Les six parties de la fiche", recop: "Ce qu'il faut retenir (à recopier dans le cahier)",
  txt: "FICHE DE RÉVISION ANIMÉE · LE MÉTABOLISME DES CELLULES\n2nde SVT · Thème 1 · Chapitre 2",
  comps: { conn: "Restituer ses connaissances", lire: "Extraire des informations (animation, tableau, graphique)", calc: "Calculer (échelles, conversions, vitesses)", rais: "Raisonner, mettre en relation", mod: "Manipuler une animation ou un TP virtuel" },
  vers: { g: { icon: "🧭", short: "Guidée", name: "Version guidée", q: "guidee", desc: "Je choisis, je complète et je calcule, pas à pas." },
    l: { icon: "🎓", short: "Exigeante", name: "Version exigeante", q: "exigeante", desc: "Les mêmes animations, moins d'aide : j'écris les mots, je calcule davantage et je rédige avec « je vois → je sais → j'en déduis »." } },
  extraTitle: "Mes expériences",
  extra: () => {
    const x = xst(), cu = x.cu || {}, ex = x.ex || {};
    let t = "MES CULTURES (nombre de cellules en millions par mL, jour 0 → jour 7, valeurs simulées)\n";
    t += CU_M.map((m, i) => `- ${"ABC"[i]} (${m}) : ① ${cu[1] ? "0,1 → " + fmt(CU[1].g[i]) : "—"} ; ② ${cu[2] ? "0,1 → " + fmt(CU[2].g[i]) : "—"}`).join("\n");
    t += "\n\nMON ExAO (graines de pois, enceinte fermée, valeurs simulées)\n" + ["g", "s"].map(c => `- ${EXD[c].name} : ${ex[c] ? `O₂ ${f2(EXD[c].o(0))} % → ${f2(EXD[c].o(20))} % ; CO₂ ${f2(EXD[c].c(0))} % → ${f2(EXD[c].c(20))} % en 20 min` : "—"}`).join("\n");
    return t + "\n";
  },
  extraHTML: () => {
    const x = xst(), cu = x.cu || {}, ex = x.ex || {};
    return `<p class="kicker">Cultures · millions de cellules par mL, jour 0 → jour 7 <span class="simw">⚠ Valeurs simulées</span></p>` + fit(tbl(["Milieu", "①", "②"], CU_M.map((m, i) => [`${"ABC"[i]} · ${m}`, cu[1] ? "0,1 → " + fmt(CU[1].g[i]) : "—", cu[2] ? "0,1 → " + fmt(CU[2].g[i]) : "—"])))
      + `<p class="kicker">ExAO · graines de pois en enceinte fermée, de 0 à 20 min <span class="simw">⚠ Valeurs simulées</span></p>` + fit(tbl(["Graines", "O₂ (%)", "CO₂ (%)"], ["g", "s"].map(c => [EXD[c].name, ex[c] ? `${f2(EXD[c].o(0))} → ${f2(EXD[c].o(20))}` : "—", ex[c] ? `${f2(EXD[c].c(0))} → ${f2(EXD[c].c(20))}` : "—"])));
  } };

/* ---------- la fiche, partie par partie (texte du professeur) ---------- */
const fit = h => `<div class="fit">${h}</div>`;
const box = (k, lab, h) => `<div class="box ${k}"><p class="lab">${lab}</p>${h}</div>`;
const DOC_MET = { title: "Fiche · 1. Le métabolisme", html: `<p><b>Métabolisme</b> : ensemble des réactions chimiques se déroulant dans une cellule. Il comprend :</p><ul class="ul"><li>les <b>réactions de synthèse</b> (fabrication) de matière → croissance et activité des cellules ;</li><li>les réactions qui permettent de <b>produire de l'énergie</b> (et rejettent CO₂ et H₂O).</li></ul>` };
const DOC_TROPH = { title: "Fiche · 1. Autotrophe ou hétérotrophe", html: fit(tbl(["", "Autotrophe", "Hétérotrophe"], [["Produit sa matière vivante à partir de…", "nutriments <b>minéraux</b> uniquement", "nutriments <b>organiques</b>"], ["Source d'énergie", "lumière solaire", "matière organique (glucose…)"], ["Exemples", "végétaux, euglènes, cyanobactéries", "animaux, champignons, levures"]])) };
const DOC_EQ1 = { title: "Fiche · 2. Les équations bilans : dégrader le glucose", html: `<div class="eqs"><p><b>Respiration</b><span>glucose + O₂ → CO₂ + H₂O + énergie</span></p><p><b>Fermentation alcoolique</b><span>glucose → CO₂ + éthanol + énergie</span></p><p><b>Fermentation lactique</b><span>glucose → acide lactique + énergie</span></p></div>`
  + box("key", "✔ À retenir", "<p>La respiration et la fermentation <b>dégradent le glucose</b> pour produire de l'énergie.</p>")
  + box("warn", "⚠ Vigilance", "<p>La fermentation lactique (cellules musculaires, bactéries du yaourt) ne rejette <b>pas</b> de CO₂ : glucose → acide lactique + énergie.</p>") };
const DOC_EQ2 = { title: "Fiche · 2. Les équations bilans : produire du glucose", html: `<div class="eqs"><p><b>Photosynthèse</b> (chloroplaste)<span>lumière + CO₂ + H₂O → glucose + O₂</span></p></div>`
  + box("key", "✔ À retenir", "<p>La photosynthèse <b>produit du glucose</b> en utilisant l'énergie lumineuse.</p>") };
const DOC_CMP = { title: "Fiche · 3. Comparaison des métabolismes", html: fit(tbl(["Critère", "Levure", "Euglène"], [["Type d'organisme", "champignon unicellulaire eucaryote", "algue unicellulaire eucaryote chlorophyllienne"], ["Besoins nutritifs", "eau + matière organique (glucose)", "eau + sels minéraux + lumière"], ["Type de métabolisme", "<b>hétérotrophe</b>", "<b>autotrophe</b>"], ["Organites clés", "mitochondries (respiration)", "chloroplastes (photosynthèse) + mitochondries"], ["Échanges gazeux", "absorbe O₂, rejette CO₂", "à la lumière : absorbe CO₂, rejette O₂ (bilan net)"]]))
  + box("info", "ℹ Méthode · taille réelle", "<p>Taille réelle = longueur mesurée sur le dessin × valeur de la barre d'échelle ÷ longueur de la barre sur le dessin.</p>") };
const DOC_FLUX = { title: "Fiche · 4. Les flux de matière dans l'environnement", html: `<p>Les molécules produites par le métabolisme circulent au sein d'un organisme et d'un organisme à l'autre. Ces <b>flux de matière</b> sont associés à des <b>flux d'énergie</b> car la matière organique contient de l'énergie chimique.</p><ul class="ul"><li><b>Tilleul</b> (producteur primaire) : réalise la photosynthèse → produit de la matière organique (glucose) qui circule dans la sève élaborée.</li><li><b>Abeille</b> : se nourrit du nectar des fleurs (matière organique).</li><li><b>Puceron</b> : perce les tiges pour prélever la sève élaborée.</li><li><b>Coccinelle</b> : se nourrit des pucerons.</li><li><b>Cèpe de Bordeaux</b> (mycorhize) : association mutualiste avec le tilleul. Le champignon reçoit de la matière organique du tilleul et lui fournit de l'eau et des sels minéraux.</li></ul>`
  + box("warn", "⚠ À retenir", "<p>Les organismes autotrophes (végétaux) sont à la base des flux de matière, car ils produisent la matière organique à partir de matière minérale.</p>") };
const DOC_DIG = { title: "Fiche · 5. De l'amidon au glucose : la digestion", html: `<ol class="ul"><li><b>Ingestion</b> : les aliments (ex. : pomme de terre riche en amidon) entrent par la bouche.</li><li><b>Digestion chimique</b> : l'<b>amylase</b> (enzyme présente dans la salive et le suc pancréatique) transforme l'amidon en glucose.</li><li><b>Absorption intestinale</b> : le glucose passe dans le sang au niveau de l'intestin grêle.</li><li><b>Transport sanguin</b> : le glucose est distribué à toutes les cellules de l'organisme.</li></ol>`
  + box("info", "ℹ Rôle des enzymes", "<p>Les <b>enzymes</b> sont des protéines qui catalysent (accélèrent) les réactions chimiques du métabolisme. Chaque enzyme est <b>spécifique</b> d'une réaction.</p>") };
const DOC_VOIES = { title: "Fiche · 5. Utilisation du glucose par les cellules", html: `<p>Le glucose peut suivre plusieurs voies métaboliques :</p><ul class="ul"><li><b>Respiration cellulaire</b> : dans les mitochondries, glucose + O₂ → CO₂ + H₂O + énergie.</li><li><b>Stockage</b> : sous forme de <b>glycogène</b> (foie, muscles) ou de <b>triglycérides</b> (tissu adipeux).</li></ul>`
  + box("warn", "⚠ À retenir", "<p>La respiration cellulaire se déroule dans les <b>mitochondries</b>. Elle nécessite du glucose <b>et</b> du dioxygène.</p>") };
const DOC_METH = { title: "Fiche · 6. Méthode : analyser un graphique d'échanges gazeux", html: `<ol class="ul"><li><b>Identifier</b> ce qui est mesuré (O₂, CO₂, glucose, éthanol…), avec les unités.</li><li><b>Décrire</b> l'évolution de chaque courbe (augmente, diminue, stable), avec des valeurs.</li><li><b>Mettre en relation</b> les variations observées.</li><li><b>Conclure</b> sur le type de métabolisme (respiration, fermentation, photosynthèse).</li></ol>`
  + box("info", "ℹ Calculer une vitesse moyenne", "<p>Vitesse moyenne = variation de la teneur ÷ durée. Exemple : une teneur qui passe de 10 % à 7 % en 5 min varie de 3 % ; vitesse = 3 ÷ 5 = 0,6 % par minute.</p>") };

/* ---------- ce qu'il faut retenir (fiche du professeur) ---------- */
const BIL = ["Le <u>métabolisme</u> est l'ensemble des réactions chimiques d'une cellule : réactions de synthèse et réactions qui produisent de l'énergie.",
  "<u>Autotrophe</u> : matière minérale + lumière. <u>Hétérotrophe</u> : matière organique.",
  "<u>Respiration</u> (mitochondries) : glucose + O₂ → CO₂ + H₂O + énergie.",
  "<u>Fermentation</u> : glucose → CO₂ + éthanol + énergie (alcoolique) ; glucose → acide lactique + énergie (lactique).",
  "<u>Photosynthèse</u> (chloroplastes) : lumière + CO₂ + H₂O → glucose + O₂.",
  "Les <u>flux de matière</u> sont des flux d'énergie : la matière organique contient de l'énergie chimique."];
const bilanHTML = () => BIL.map(x => `<p>✓ ${nb(x)}</p>`).join("");

/* ---------- échauffement ---------- */
const RAPPEL = { id: "r0", lvl: "easy", title: "Échauffement : tailles et unités du vivant",
  intro: "Le métabolisme se joue à l'échelle des cellules et des molécules. Descends et monte l'escalier des unités, puis réponds.",
  widget: { title: "Outil · L'escalier des unités", w: "escalier" },
  parts: [
    { t: "num", c: "calc", label: "Une levure mesure 5 µm. Convertis : 5 µm = … mm", unit: "mm", ans: .005, tol: 1e-7, err: [[v => near(v, 5000, .5), "Tu as multiplié par 1 000 : du µm au mm, on monte d'une marche, donc on divise par 1 000."], [v => near(v, .05, 1e-7), "Une seule marche sépare le µm du mm : on divise par 1 000, pas par 100."]] },
    { t: "num", c: "calc", label: "Une mitochondrie mesure environ 2 µm. Combien de molécules de 1 nm pourrait-on aligner sur sa longueur ?", unit: "molécules", ans: 2000, tol: 0, err: [[v => near(v, 2, 0), "Convertis d'abord 2 µm en nm : on descend d'une marche, donc × 1 000."], [v => near(v, .002, 1e-7), "Mauvais sens : du µm au nm, on descend d'une marche, donc on multiplie par 1 000."]] },
    { t: "num", c: "calc", label: "Une euglène mesure 50 µm. Combien de fois est-elle plus longue qu'une levure de 5 µm ?", unit: "fois", ans: 10, tol: 0 },
    { t: "choice", c: "conn", label: "Quel instrument permet d'observer une levure de 5 µm ?", o: ["Le microscope optique", "La loupe à main", "L'œil nu"], a: 0, no: { 1: "Une loupe à main grossit quelques fois seulement : 5 µm, c'est 0,005 mm.", 2: "À l'œil nu, on distingue à peine 0,1 mm, c'est-à-dire 100 µm." } }],
  hints: ["Utilise l'escalier : à chaque marche descendue (m → mm → µm → nm), on multiplie par 1 000.", "5 µm → mm : on monte d'une marche, donc on divise par 1 000. 2 µm → nm : on descend, donc × 1 000.", "5 ÷ 1 000 = 0,005 · 2 × 1 000 = 2 000 · 50 ÷ 5 = 10 · le microscope optique."],
  corr: "5 µm = 5 ÷ 1 000 mm = 0,005 mm. 2 µm = 2 000 nm : on peut aligner 2 000 molécules de 1 nm. 50 ÷ 5 = 10 : l'euglène est 10 fois plus longue que la levure. Une cellule de quelques µm s'observe au microscope optique." };

/* ---------- les six parties ---------- */
const GROUPS = [
{ id: "p1", n: 1, icon: "🧬", tab: "Définitions", title: "Le métabolisme : définitions", sub: "Deux ateliers dans chaque cellule, deux façons de se nourrir · environ 12 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "Les deux ateliers d'une cellule",
    docs: [DOC_MET],
    widget: { title: "Animation · Les réactions chimiques d'une cellule", w: "usine", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Lance l'atelier « synthèse » puis l'atelier « énergie » (ou les deux ensemble), jusqu'au bout.", okMsg: "Les deux ateliers ont été observés.", done: T_US },
      { t: "rows", c: "conn", label: "Réaction de synthèse, ou réaction qui produit de l'énergie ?", choices: ["Synthèse", "Production d'énergie"], rows: [
        { txt: "De petites molécules s'assemblent pour former une protéine.", a: 0 },
        { txt: "Une cellule musculaire dégrade du glucose pour se contracter.", a: 1 },
        { txt: "Une cellule de la peau fabrique les molécules d'une nouvelle cellule.", a: 0 },
        { txt: "Une molécule organique est dégradée : du CO₂ et de l'eau sont rejetés.", a: 1 }] },
      { t: "choice", c: "lire", label: "Dans l'animation, que devient la cellule quand l'atelier « synthèse » fonctionne ?", o: ["Elle grandit", "Elle rejette du CO₂", "Elle rétrécit"], a: 0, no: { 1: "Le CO₂ sort de l'atelier « énergie ».", 2: "Compare la membrane à la fin avec le pointillé de départ." } }],
    hints: ["Lance l'animation en mode « Les deux ateliers » : tu vois les deux d'un coup.", "Synthèse = fabriquer (assembler) ; production d'énergie = dégrader une molécule organique, avec rejet de CO₂ et d'eau.", "Protéine : synthèse · contraction : énergie · nouvelle cellule : synthèse · CO₂ et eau rejetés : énergie. La cellule grandit."],
    corr: "Les réactions de synthèse assemblent de petites molécules en grandes molécules : la cellule grandit et fonctionne. Les réactions qui produisent de l'énergie dégradent des molécules organiques et rejettent du CO₂ et de l'eau ; l'énergie libérée sert à l'activité de la cellule et aux synthèses." },
  { id: "a2", lvl: "mid", title: "Autotrophe ou hétérotrophe ?",
    intro: "Deux micro-organismes mystères sont mis en culture pendant 7 jours dans trois milieux différents. Lequel est autotrophe ?",
    docs: [DOC_TROPH],
    widget: { title: "Expérience · Deux micro-organismes mystères", w: "cultures", sim: "Valeurs simulées" },
    parts: [
      { t: "task", c: "mod", label: "Lance la culture du micro-organisme ①, puis celle du micro-organisme ②.", okMsg: "Les deux cultures sont terminées.", done: T_CU },
      { t: "rows", c: "lire", label: "Dans quel milieu chaque micro-organisme se multiplie-t-il ?", choices: ["A", "B", "C", "Aucun"], rows: [{ txt: "Micro-organisme ①", a: 0 }, { txt: "Micro-organisme ②", a: 2 }] },
      { t: "choice", c: "rais", label: "Quels milieux faut-il comparer pour montrer que ① a besoin de lumière ?", o: ["A et B : seule la lumière change", "A et C : on ajoute du glucose et on retire la lumière", "B et C : seul le glucose change"], a: 0, no: { 1: "Entre A et C, deux conditions changent : on ne peut pas savoir laquelle compte.", 2: "Entre B et C, seul le glucose change : cela renseigne sur le glucose, pas sur la lumière." } },
      { t: "rows", c: "rais", label: "J'en déduis le type de métabolisme de chacun :", choices: ["Autotrophe", "Hétérotrophe"], rows: [{ txt: "Micro-organisme ①", a: 0 }, { txt: "Micro-organisme ②", a: 1 }] }],
    hints: ["Lance les deux cultures, puis lis le tableau : quels nombres augmentent vraiment ?", "Pour tester un facteur, on compare deux milieux qui ne diffèrent que par ce facteur. Relis aussi le tableau autotrophe / hétérotrophe.", "① : milieu A seulement (minéral + lumière) → autotrophe. ② : milieu C seulement (glucose) → hétérotrophe."],
    corr: "① ne se multiplie que dans le milieu A (eau + sels minéraux, à la lumière) : de 0,1 à 8 millions de cellules par mL. A et B ne diffèrent que par la lumière : ① en a besoin. Il produit sa matière à partir de matière minérale grâce à l'énergie lumineuse : il est autotrophe (c'était une cyanobactérie). ② ne se multiplie que dans le milieu C, qui contient du glucose : il a besoin de matière organique, il est hétérotrophe (c'était une levure)." }] },

{ id: "p2", n: 2, icon: "⚗️", tab: "Équations", title: "Les équations bilans", sub: "Respiration, fermentations, photosynthèse : les molécules en mouvement · environ 12 minutes.",
  items: [
  { id: "b1", lvl: "easy", title: "Dégrader le glucose pour produire de l'énergie",
    docs: [DOC_EQ1],
    widget: { title: "Animation · Les molécules en mouvement", w: "reac", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Lance les trois animations jusqu'au bout : respiration, fermentation alcoolique, fermentation lactique.", okMsg: "Les trois réactions ont été observées.", done: T_RX },
      { t: "rows", c: "lire", label: "De quelle réaction s'agit-il ?", choices: ["Respiration", "Ferm. alcoolique", "Ferm. lactique"], rows: [
        { txt: "Elle produit de l'éthanol.", a: 1 }, { txt: "Elle produit de l'acide lactique.", a: 2 }, { txt: "Elle produit de l'eau.", a: 0 }, { txt: "Elle libère le plus d'énergie.", a: 0 }] },
      { t: "num", c: "lire", label: "Combien de molécules de CO₂ la fermentation alcoolique produit-elle à partir d'une molécule de glucose ?", unit: "molécules", ans: 2, tol: 0, err: [[v => v === 6, "6, c'est pour la respiration. Relance la fermentation alcoolique et compte les CO₂."]] },
      { t: "num", c: "calc", label: "Le carbone se conserve : combien d'atomes de carbone y a-t-il dans 2 molécules d'acide lactique (3 atomes de carbone chacune) ?", unit: "atomes", ans: 6, tol: 0 }],
    hints: ["Choisis chaque réaction puis touche ▶ Lancer ; regarde les molécules d'arrivée et la jauge d'énergie.", "L'éthanol n'apparaît que dans la fermentation alcoolique ; l'eau seulement dans la respiration.", "Éthanol : alcoolique · acide lactique : lactique · eau et le plus d'énergie : respiration · 2 CO₂ · 2 × 3 = 6."],
    corr: "Respiration : glucose + O₂ → CO₂ + H₂O + énergie (beaucoup d'énergie). Fermentation alcoolique : glucose → 2 CO₂ + 2 éthanol + énergie. Fermentation lactique : glucose → 2 acide lactique + énergie. Les fermentations libèrent beaucoup moins d'énergie que la respiration. Le carbone se conserve : 6 atomes dans le glucose, 2 × 3 = 6 dans l'acide lactique." },
  { id: "b2", lvl: "mid", title: "Fabriquer du glucose grâce à la lumière",
    docs: [DOC_EQ2],
    widget: { title: "Animation · La photosynthèse dans un chloroplaste", w: "photo", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Lance l'animation lampe allumée, puis lampe éteinte, jusqu'au bout.", okMsg: "Les deux essais ont été observés.", done: T_PH },
      { t: "rows", c: "conn", label: "Utilisé ou fabriqué par la photosynthèse ?", choices: ["Utilisé", "Fabriqué"], rows: [{ txt: "Le dioxyde de carbone (CO₂)", a: 0 }, { txt: "L'eau (H₂O)", a: 0 }, { txt: "Le glucose", a: 1 }] },
      { t: "num", c: "calc", label: "Une molécule de glucose contient 6 atomes de carbone. Combien de molécules de CO₂ (1 atome de carbone chacune) faut-il pour la fabriquer ?", unit: "molécules", ans: 6, tol: 0 },
      { t: "choice", c: "rais", label: "D'où viennent les atomes de carbone du glucose fabriqué ?", o: ["Du dioxyde de carbone (CO₂)", "De l'eau (H₂O)", "De la lumière"], a: 0, no: { 1: "La molécule d'eau H₂O ne contient pas de carbone.", 2: "La lumière apporte de l'énergie, pas de la matière." } }],
    hints: ["Regarde ce qui entre dans le chloroplaste et ce qui en sort quand la lampe est allumée.", "Compte les atomes de carbone (boules grises) : il y en a un par CO₂ et six dans le glucose.", "CO₂ et eau : utilisés · glucose : fabriqué · 6 CO₂ · le carbone vient du CO₂."],
    corr: "La photosynthèse utilise du CO₂ et de l'eau et fabrique du glucose (et du dioxygène), grâce à l'énergie lumineuse. Il faut 6 CO₂ pour un glucose : les 6 atomes de carbone du glucose viennent du CO₂ ; la lumière apporte l'énergie." }] },

{ id: "p3", n: 3, icon: "🔬", tab: "Levure et euglène", title: "Comparer deux métabolismes", sub: "Microscope virtuel, mesures et calcul de la taille réelle · environ 10 minutes.",
  items: [
  { id: "c1", lvl: "mid", title: "Deux cellules au microscope",
    docs: [DOC_CMP],
    widget: { title: "Microscope virtuel · Levures et euglènes", w: "micro", sim: "Dessins d'observation simplifiés" },
    parts: [
      { t: "task", c: "mod", label: "Pour chaque lame, place la règle sous la cellule puis sous la barre d'échelle.", okMsg: "Les quatre mesures sont possibles.", done: T_MI },
      { t: "num", c: "lire", label: "Lame 1 : longueur de la levure centrale sur le dessin ?", unit: "cm", ans: 2.4, tol: .1 },
      { t: "num", c: "calc", label: "Lame 1 : la barre d'échelle mesure 2 cm et vaut 5 µm. Taille réelle de la levure ?", unit: "µm", ans: 6, tol: .3, err: [[v => near(v, 12, .7), "Tu as multiplié 2,4 par 5 sans diviser par la longueur de la barre (2 cm)."], [v => near(v, .96, .06), "Calcul inversé : taille réelle = 2,4 × 5 ÷ 2."]] },
      { t: "num", c: "calc", label: "Lame 2 : taille réelle de l'euglène (sans le flagelle) ?", unit: "µm", ans: 50, tol: 2, err: [[v => near(v, 100, 5), "Tu as oublié de diviser par la longueur de la barre (2 cm)."], [v => near(v, 12.5, 1), "La barre de la lame 2 vaut 20 µm, pas 5 µm."]] },
      { t: "choice", c: "conn", label: "Quel organite l'euglène possède-t-elle, mais pas la levure ?", o: ["Les chloroplastes", "Les mitochondries", "Le noyau"], a: 0, no: { 1: "Relis la ligne « Organites clés » : la levure possède des mitochondries.", 2: "Les deux sont des eucaryotes : elles ont un noyau." } }],
    hints: ["Règle sous la cellule : lis le nombre en face du bord droit de la levure. Règle sous la barre : vérifie sa longueur.", "Taille réelle = longueur mesurée × valeur de la barre ÷ longueur de la barre.", "Levure : 2,4 × 5 ÷ 2 = 6 µm · euglène : 5,0 × 20 ÷ 2 = 50 µm · chloroplastes."],
    corr: "Levure : 2,4 cm sur le dessin ; taille réelle = 2,4 × 5 ÷ 2 = 6 µm. Euglène : 5,0 cm ; taille réelle = 5,0 × 20 ÷ 2 = 50 µm : elle est environ 8 fois plus longue que la levure. L'euglène, chlorophyllienne, possède des chloroplastes ; la levure n'en a pas." }] },

{ id: "p4", n: 4, icon: "🌳", tab: "Flux de matière", title: "Les flux de matière dans l'environnement", sub: "Le tilleul et ses partenaires · environ 8 minutes.",
  items: [
  { id: "d1", lvl: "mid", title: "Le tilleul et ses partenaires",
    docs: [DOC_FLUX],
    widget: { title: "Animation · Ce qui circule autour du tilleul", w: "reseau", sim: "Schéma simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Affiche chaque partenaire (abeille, puceron, coccinelle, cèpe) et lance l'animation.", okMsg: "Les quatre relations ont été observées.", done: T_RS },
      { t: "match", c: "lire", label: "Relie chaque organisme à ce qu'il reçoit.", ask: "Choisis ce que reçoit", rows: [{ e: "🐝", txt: "Abeille", v: "nectar des fleurs" }, { e: "🟢", txt: "Puceron", v: "sève élaborée" }, { e: "🐞", txt: "Coccinelle", v: "pucerons" }, { e: "🍄", txt: "Cèpe", v: "matière organique du tilleul" }, { e: "🌳", txt: "Tilleul", v: "eau et sels minéraux du cèpe" }] },
      { t: "choice", c: "rais", label: "L'énergie chimique contenue dans une coccinelle provient, à l'origine…", o: ["de la lumière du Soleil captée par le tilleul", "des sels minéraux du sol", "du cèpe"], a: 0, no: { 1: "Les sels minéraux sont de la matière minérale : ils n'apportent pas d'énergie chimique.", 2: "Le cèpe reçoit de la matière organique du tilleul : il ne la produit pas." } },
      { t: "choice", c: "rais", label: "Pourquoi le tilleul est-il appelé « producteur primaire » ?", o: ["Il produit de la matière organique à partir de matière minérale", "Il se nourrit de la matière organique fournie par le cèpe", "C'est le plus grand organisme du réseau"], a: 0 }],
    hints: ["Touche chaque partenaire, puis ▶ Lancer : les points dorés sont de la matière organique, les bleus de l'eau et des sels minéraux.", "Remonte la chaîne : coccinelle ← puceron ← sève élaborée ← photosynthèse du tilleul ← lumière.", "Nectar · sève élaborée · pucerons · matière organique · eau et sels minéraux · lumière · matière organique à partir de matière minérale."],
    corr: "Abeille : nectar ; puceron : sève élaborée ; coccinelle : pucerons ; cèpe : matière organique du tilleul ; tilleul : eau et sels minéraux du cèpe. Le tilleul, autotrophe, produit la matière organique par photosynthèse : c'est le producteur primaire. L'énergie chimique de la coccinelle vient, à l'origine, de l'énergie lumineuse captée par le tilleul." }] },

{ id: "p5", n: 5, icon: "🥔", tab: "Chez l'Homme", title: "De l'amidon à l'énergie chez l'être humain", sub: "Digestion, enzymes et voies du glucose · environ 12 minutes.",
  items: [
  { id: "e1", lvl: "easy", title: "De l'amidon au glucose",
    docs: [DOC_DIG],
    widget: { title: "Animation · Le trajet de l'amidon et l'amylase au travail", w: "digest", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Lance le trajet de l'amidon, puis le zoom avec l'amidon et avec une protéine.", okMsg: "Trajet et zooms observés.", done: T_DG },
      { t: "rows", c: "lire", label: "Où cela se passe-t-il ?", choices: ["Bouche et intestin grêle", "Sang", "Cellules"], rows: [{ txt: "L'amidon est découpé en glucose.", a: 0 }, { txt: "Le glucose est transporté dans tout l'organisme.", a: 1 }, { txt: "Le glucose est utilisé.", a: 2 }] },
      { t: "choice", c: "rais", label: "Que montre le zoom avec la protéine ?", o: ["L'amylase est spécifique : elle n'agit pas sur la protéine", "L'amylase découpe toutes les molécules", "La protéine est plus rapide à découper que l'amidon"], a: 0, no: { 1: "Regarde le compteur de coupures avec la protéine.", 2: "Aucune coupure n'a lieu avec la protéine." } }],
    hints: ["Suis les étapes 1 à 4 qui s'allument sous le trajet.", "L'amylase agit dans la bouche (salive) et dans l'intestin grêle (suc pancréatique) ; le sang transporte.", "Bouche et intestin grêle · sang · cellules · l'amylase est spécifique de l'amidon."],
    corr: "L'amylase de la salive puis du suc pancréatique découpe l'amidon en glucose ; le glucose passe dans le sang au niveau de l'intestin grêle ; le sang le distribue à toutes les cellules, qui l'utilisent. L'amylase n'agit pas sur une protéine : chaque enzyme est spécifique d'une réaction." },
  { id: "e2", lvl: "mid", title: "Que devient le glucose dans les cellules ?",
    docs: [DOC_VOIES],
    widget: { title: "Animation · Les voies du glucose", w: "voies", sim: "Modèle simplifié" },
    parts: [
      { t: "task", c: "mod", label: "Lance l'animation pour les trois cellules : foie, muscle, tissu adipeux.", okMsg: "Les trois cellules ont été observées.", done: T_VO },
      { t: "rows", c: "conn", label: "Sous quelle forme le glucose est-il mis en réserve ?", choices: ["Glycogène", "Triglycérides", "Amidon"], rows: [{ txt: "Dans le foie", a: 0 }, { txt: "Dans les muscles", a: 0 }, { txt: "Dans le tissu adipeux", a: 1 }] },
      { t: "choice", c: "rais", label: "Assembler des glucoses pour former du glycogène, c'est…", o: ["une réaction de synthèse", "une réaction qui produit de l'énergie", "une digestion"], a: 0, no: { 1: "Aucune molécule n'est dégradée : on assemble.", 2: "La digestion découpe ; ici, on assemble." } },
      { t: "choice", c: "rais", label: "Pourquoi l'amidon de la pomme de terre et le glycogène du foie se ressemblent-ils ?", o: ["Ce sont deux réserves formées de nombreux glucoses assemblés", "Ce sont deux enzymes", "Ce sont deux produits de la respiration"], a: 0 }],
    hints: ["Change de cellule avec les boutons, puis ▶ Lancer : regarde ce qui se forme dans la case « Stockage ».", "Revois l'atelier « synthèse » de la partie 1 et la chaîne d'amidon de l'étape précédente.", "Glycogène · glycogène · triglycérides · synthèse · des glucoses assemblés."],
    corr: "Le glucose est soit dégradé par la respiration cellulaire (dans les mitochondries), soit mis en réserve : glycogène dans le foie et les muscles, triglycérides dans le tissu adipeux. Fabriquer du glycogène, c'est une synthèse : des glucoses sont assemblés, comme dans l'amidon des végétaux." }] },

{ id: "p6", n: 6, icon: "📈", tab: "Méthode", title: "Méthode : analyser un graphique d'échanges gazeux", sub: "Une ExAO virtuelle avec des graines de pois · environ 12 minutes.",
  items: [
  { id: "f1", lvl: "hard", title: "Des graines de pois dans une enceinte fermée", recop: true,
    intro: "Des graines de pois en germination, puis des graines sèches, sont placées dans une enceinte fermée, à l'obscurité. Des sondes mesurent le dioxygène et le dioxyde de carbone pendant 20 minutes. Applique la méthode en quatre étapes.",
    docs: [DOC_METH],
    widget: { title: "ExAO virtuelle · Graines de pois", w: "exao", sim: "Valeurs simulées" },
    parts: [
      { t: "task", c: "mod", label: "Étape 1 · Lance les mesures avec les graines en germination, puis avec les graines sèches.", okMsg: "Les deux séries de mesures sont terminées.", done: T_EX },
      { t: "rows", c: "lire", label: "Étape 2 · Décris l'évolution de chaque courbe.", choices: ["Augmente", "Diminue", "Reste stable"], rows: [{ txt: "O₂ · graines en germination", a: 1 }, { txt: "CO₂ · graines en germination", a: 0 }, { txt: "O₂ · graines sèches", a: 2 }] },
      { t: "num", c: "lire", label: "De combien la teneur en O₂ a-t-elle diminué en 20 min avec les graines en germination ?", unit: "%", ans: 1.6, tol: .05, err: [[v => near(v, 19.3, .1), "C'est la valeur finale : calcule la différence entre le début et la fin."]] },
      { t: "num", c: "calc", label: "Vitesse moyenne de consommation de O₂ ?", unit: "% par minute", ans: .08, tol: .004, err: [[v => near(v, 12.5, .5), "Calcul inversé : vitesse = variation ÷ durée = 1,6 ÷ 20."]] },
      { t: "choice", c: "rais", label: "Étapes 3 et 4 · Je mets en relation et je conclus :", o: ["Les graines en germination consomment du O₂ et rejettent du CO₂ : elles respirent", "Les graines en germination réalisent la photosynthèse", "Les graines sèches et les graines en germination se comportent de la même façon"], a: 0, no: { 1: "Les graines sont à l'obscurité, et l'équation de la photosynthèse ne correspond pas aux variations observées.", 2: "Compare les deux séries : seules les graines en germination modifient la composition de l'air." } }],
    hints: ["Touche un graphique pour lire les valeurs, ou ouvre les tableaux de valeurs sous les graphiques.", "O₂ : de 20,9 % à 19,3 %. Vitesse = variation ÷ durée. Compare avec l'équation de la respiration.", "Diminue · augmente · stable · 1,6 % · 1,6 ÷ 20 = 0,08 % par minute · elles respirent."],
    corr: "Les sondes mesurent O₂ et CO₂ (en %). Avec les graines en germination, O₂ diminue de 20,9 % à 19,3 %, soit 1,6 % en 20 min (0,08 % par minute), et CO₂ augmente de 0,04 % à 1,64 %. Avec les graines sèches (témoin), les teneurs restent stables. Une consommation de O₂ associée à un rejet de CO₂ correspond à la respiration : glucose + O₂ → CO₂ + H₂O + énergie. Les graines en germination respirent." }] }
];

/* ===== VERSION EXIGEANTE : mêmes animations, mots à écrire, calculs et réponses rédigées ===== */
const EXPERT = {
a2: { parts: [
    { t: "task", c: "mod", label: "Lance la culture du micro-organisme ①, puis celle du micro-organisme ②.", okMsg: "Les deux cultures sont terminées.", done: T_CU },
    { t: "num", c: "calc", label: "Par combien le nombre de cellules du micro-organisme ② a-t-il été multiplié en 7 jours dans le milieu C ?", unit: "fois", ans: 120, tol: 1, err: [[v => near(v, 11.9, .2), "C'est l'augmentation (12 − 0,1) : on demande « multiplié par », donc 12 ÷ 0,1."]] },
    { t: "redac", c: "rais", min: 40, label: "Montre que le micro-organisme ① est autotrophe et que le micro-organisme ② est hétérotrophe. Rédige : je vois → je sais → j'en déduis.",
      crit: [{ g: "vois", lab: "① se multiplie seulement en milieu minéral à la lumière", re: [/lumiere/, /(mineral|sels)/] },
        { g: "vois", lab: "② se multiplie seulement avec du glucose", re: [/glucose/] },
        { g: "vois", lab: "Tu cites des valeurs du tableau", re: [/\d/] },
        { g: "sais", lab: "Autotrophe : matière minérale et énergie lumineuse", re: [/autotroph/, /(mineral|lumi)/] },
        { g: "sais", lab: "Hétérotrophe : matière organique", re: [/heterotroph/, /organique/] },
        { g: "deduis", lab: "Conclusion : ① autotrophe, ② hétérotrophe", re: [/(①|\b1\b|premier)[^.]{0,90}autotroph|autotroph[^.]{0,60}(①|\b1\b|premier)/, /(②|\b2\b|second|deuxieme)[^.]{0,90}heterotroph|heterotroph[^.]{0,60}(②|\b2\b|second|deuxieme)/] }],
      model: "Je vois que le micro-organisme ① se multiplie seulement dans le milieu A, minéral et à la lumière (de 0,1 à 8 millions de cellules par mL en 7 jours), et pas à l'obscurité, même avec du glucose. Je vois que le micro-organisme ② se multiplie seulement dans le milieu C, qui contient du glucose (de 0,1 à 12 millions par mL). Je sais qu'un organisme autotrophe produit sa matière à partir de matière minérale grâce à l'énergie lumineuse, et qu'un organisme hétérotrophe a besoin de matière organique. J'en déduis que le micro-organisme ① est autotrophe et que le micro-organisme ② est hétérotrophe." }],
  hints: ["Lance les deux cultures, puis appuie-toi sur le tableau des résultats.", "« Multiplié par » : valeur finale ÷ valeur initiale. Pour rédiger : ce que tu vois (avec des valeurs), ce que tu sais (définitions), ce que tu en déduis.", "12 ÷ 0,1 = 120 · ① : milieu A seulement → autotrophe · ② : milieu C (glucose) seulement → hétérotrophe."],
  corr: "② : 12 ÷ 0,1 = 120 fois plus de cellules en 7 jours. ① ne se multiplie qu'en milieu minéral à la lumière : il produit sa matière à partir de matière minérale grâce à la lumière, il est autotrophe. ② ne se multiplie qu'en présence de glucose (matière organique) : il est hétérotrophe." },
b1: { parts: [
    { t: "task", c: "mod", label: "Lance les trois animations jusqu'au bout : respiration, fermentation alcoolique, fermentation lactique.", okMsg: "Les trois réactions ont été observées.", done: T_RX },
    { t: "word", c: "conn", label: "Respiration : glucose + ……… → CO₂ + H₂O + énergie", ans: ["dioxygène", "O2", "O₂", "dioxygene"], err: [[["oxygène", "oxygene"], "Précise : la molécule est le dioxygène (O₂)."]] },
    { t: "word", c: "conn", label: "Fermentation alcoolique : glucose → CO₂ + ……… + énergie", ans: ["éthanol", "ethanol", "alcool"] },
    { t: "word", c: "conn", label: "Fermentation lactique : glucose → ……… + énergie", ans: ["acide lactique", "lactate"], err: [[["acide lactique et CO2", "CO2", "dioxyde de carbone"], "La fermentation lactique ne rejette pas de CO₂."]] },
    { t: "num", c: "calc", label: "Vérifie la conservation du carbone dans la fermentation alcoolique : 2 éthanol (2 C chacun) + 2 CO₂ (1 C chacun) = … atomes de carbone", unit: "atomes", ans: 6, tol: 0 }],
  hints: ["Lance chaque réaction et observe les molécules d'arrivée.", "La respiration utilise une molécule de gaz ; les deux fermentations n'en utilisent pas.", "Dioxygène · éthanol · acide lactique · 2 × 2 + 2 × 1 = 6."],
  corr: "Respiration : glucose + dioxygène → CO₂ + H₂O + énergie. Fermentation alcoolique : glucose → CO₂ + éthanol + énergie. Fermentation lactique : glucose → acide lactique + énergie. Le carbone se conserve : 2 × 2 + 2 × 1 = 6 atomes, comme dans le glucose." },
b2: { parts: [
    { t: "task", c: "mod", label: "Lance l'animation lampe allumée, puis lampe éteinte, jusqu'au bout.", okMsg: "Les deux essais ont été observés.", done: T_PH },
    { t: "num", c: "calc", label: "Combien de molécules de CO₂ faut-il pour fabriquer une molécule de glucose (6 atomes de carbone) ?", unit: "molécules", ans: 6, tol: 0 },
    { t: "redac", c: "rais", min: 30, label: "Explique d'où proviennent la matière et l'énergie du glucose fabriqué par photosynthèse. Appuie-toi sur l'animation.",
      crit: [{ g: "vois", lab: "Le CO₂ et l'eau entrent dans le chloroplaste", re: [/(co2|co₂|dioxyde de carbone)/, /(eau|h2o|h₂o)/] },
        { g: "vois", lab: "Le glucose n'est fabriqué qu'avec la lumière", re: [/(lampe|lumiere|eclair)/, /(seulement|que|uniquement|eteinte|sans)/] },
        { g: "sais", lab: "6 atomes de carbone dans le glucose, 1 dans chaque CO₂", re: [/(6|six)/, /carbone/] },
        { g: "deduis", lab: "La matière (le carbone) vient du CO₂ (et de l'eau)", re: [/(matiere|carbone|atome)[^.]{0,80}(co2|co₂|dioxyde de carbone)|(co2|co₂|dioxyde de carbone)[^.]{0,80}(matiere|carbone)/] },
        { g: "deduis", lab: "L'énergie vient de la lumière", re: [/energie[^.]{0,60}lumi|lumi[^.]{0,60}energie/] }],
      model: "Je vois dans l'animation que 6 molécules de CO₂ et 6 molécules d'eau entrent dans le chloroplaste, et qu'une molécule de glucose n'est fabriquée que lorsque la lampe est allumée. Je sais que le glucose contient 6 atomes de carbone et que chaque CO₂ en contient un. J'en déduis que la matière du glucose, en particulier son carbone, provient du CO₂ et de l'eau, et que l'énergie nécessaire provient de la lumière." }],
  hints: ["Lance les deux essais et compare-les.", "Compte les atomes de carbone : 6 CO₂ → 1 glucose.", "La matière vient du CO₂ (et de l'eau), l'énergie vient de la lumière."],
  corr: "Il faut 6 CO₂ pour un glucose. La matière du glucose provient du CO₂ (le carbone) et de l'eau ; l'énergie provient de la lumière : sans lumière, aucun glucose n'est fabriqué." },
c1: { parts: [
    { t: "task", c: "mod", label: "Pour chaque lame, place la règle sous la cellule puis sous la barre d'échelle.", okMsg: "Les quatre mesures sont possibles.", done: T_MI },
    { t: "num", c: "calc", label: "Taille réelle de la levure ?", unit: "µm", ans: 6, tol: .3, err: [[v => near(v, 12, .7), "Tu n'as pas divisé par la longueur de la barre."]] },
    { t: "num", c: "calc", label: "Taille réelle de l'euglène (sans le flagelle) ?", unit: "µm", ans: 50, tol: 2, err: [[v => near(v, 100, 5), "Tu n'as pas divisé par la longueur de la barre."]] },
    { t: "num", c: "calc", label: "Combien de levures pourrait-on aligner sur 1 mm ? (arrondis à l'unité)", unit: "levures", ans: 167, tol: 8, err: [[v => near(v, .17, .02), "Convertis d'abord 1 mm en µm : 1 mm = 1 000 µm."]] },
    { t: "word", c: "conn", label: "Quel organite, absent chez la levure, permet à l'euglène de réaliser la photosynthèse ?", ans: ["chloroplaste", "chloroplastes", "les chloroplastes", "le chloroplaste"] }],
  hints: ["Mesure chaque cellule et chaque barre avec la règle virtuelle.", "Taille réelle = longueur mesurée × valeur de la barre ÷ longueur de la barre. Puis 1 mm = 1 000 µm.", "6 µm · 50 µm · 1 000 ÷ 6 ≈ 167 · chloroplaste."],
  corr: "Levure : 2,4 × 5 ÷ 2 = 6 µm. Euglène : 5,0 × 20 ÷ 2 = 50 µm. Sur 1 mm = 1 000 µm, on alignerait 1 000 ÷ 6 ≈ 167 levures. L'euglène possède des chloroplastes, absents chez la levure." },
d1: { parts: [
    { t: "task", c: "mod", label: "Affiche chaque partenaire (abeille, puceron, coccinelle, cèpe) et lance l'animation.", okMsg: "Les quatre relations ont été observées.", done: T_RS },
    { t: "redac", c: "rais", min: 40, label: "La coccinelle ne mange jamais le tilleul. Explique pourquoi elle en dépend pourtant. Utilise les mots « matière organique » et « énergie ».",
      crit: [{ g: "vois", lab: "La coccinelle mange les pucerons", re: [/puceron/] },
        { g: "vois", lab: "Les pucerons prélèvent la sève élaborée du tilleul", re: [/seve/] },
        { g: "sais", lab: "Le tilleul produit la matière organique (photosynthèse, autotrophe)", re: [/(photosynth|autotroph|produi|fabriqu)/, /matiere organique/] },
        { g: "sais", lab: "La matière organique contient de l'énergie", re: [/energie/] },
        { g: "deduis", lab: "La matière organique passe du tilleul aux pucerons puis à la coccinelle", re: [/(passe|circul|transf|flux|chaine|transmi)/] }],
      model: "Je vois que la coccinelle se nourrit de pucerons et que les pucerons prélèvent la sève élaborée du tilleul. Je sais que le tilleul est autotrophe : il produit la matière organique par photosynthèse, et cette matière organique contient de l'énergie chimique. J'en déduis que la matière organique, avec l'énergie qu'elle contient, circule du tilleul aux pucerons puis à la coccinelle : sans tilleul, pas de pucerons, donc pas de coccinelles." },
    { t: "choice", c: "rais", label: "L'énergie chimique contenue dans une coccinelle provient, à l'origine…", o: ["de la lumière du Soleil captée par le tilleul", "des sels minéraux du sol", "du cèpe"], a: 0 }],
  hints: ["Affiche « Coccinelle » : quelles flèches mènent jusqu'à elle ?", "Remonte la chaîne : coccinelle ← puceron ← sève élaborée ← tilleul (photosynthèse) ← lumière.", "Pucerons · sève élaborée · matière organique produite par photosynthèse · énergie chimique · circulation de la matière."],
  corr: "La coccinelle mange les pucerons, qui prélèvent la sève élaborée du tilleul. Le tilleul, autotrophe, produit cette matière organique par photosynthèse ; elle contient de l'énergie chimique, issue à l'origine de la lumière. La matière et l'énergie circulent du tilleul aux pucerons puis à la coccinelle." },
e2: { parts: [
    { t: "task", c: "mod", label: "Lance l'animation pour les trois cellules : foie, muscle, tissu adipeux.", okMsg: "Les trois cellules ont été observées.", done: T_VO },
    { t: "word", c: "conn", label: "Forme de réserve du glucose dans le foie et les muscles :", ans: ["glycogène", "glycogene", "le glycogène"] },
    { t: "word", c: "conn", label: "Forme de réserve dans le tissu adipeux :", ans: ["triglycérides", "triglycerides", "triglycéride", "des triglycérides", "les triglycérides"] },
    { t: "choice", c: "rais", label: "Assembler des glucoses pour former du glycogène, c'est…", o: ["une réaction de synthèse", "une réaction qui produit de l'énergie", "une digestion"], a: 0 }],
  hints: ["Lance l'animation pour chaque cellule et regarde la case « Stockage ».", "Relis la fiche : deux formes de réserve sont citées.", "Glycogène · triglycérides · synthèse."],
  corr: "Réserves : glycogène dans le foie et les muscles, triglycérides dans le tissu adipeux. Fabriquer une réserve, c'est une réaction de synthèse." },
f1: { parts: [
    { t: "task", c: "mod", label: "Lance les mesures avec les graines en germination, puis avec les graines sèches.", okMsg: "Les deux séries de mesures sont terminées.", done: T_EX },
    { t: "num", c: "calc", label: "Vitesse moyenne de consommation de O₂ des graines en germination ?", unit: "% par minute", ans: .08, tol: .004, err: [[v => near(v, 1.6, .05), "C'est la variation : divise-la par la durée (20 min)."], [v => near(v, 12.5, .5), "Calcul inversé : vitesse = variation ÷ durée."]] },
    { t: "num", c: "calc", label: "Vitesse moyenne de rejet de CO₂ des graines en germination ?", unit: "% par minute", ans: .08, tol: .004 },
    { t: "redac", c: "rais", min: 40, label: "En suivant les quatre étapes de la méthode, analyse les résultats et conclus sur le métabolisme des graines en germination. Cite des valeurs.",
      crit: [{ g: "vois", lab: "Étape 1 · Ce qui est mesuré : O₂ et CO₂", re: [/(o2|o₂|dioxygene)/, /(co2|co₂|dioxyde de carbone)/] },
        { g: "vois", lab: "Étape 2 · O₂ diminue, avec des valeurs", re: [/(diminu|baiss|consomm)/, /(20[,.]9|19[,.]3|1[,.]6)/] },
        { g: "vois", lab: "Étape 2 · CO₂ augmente", re: [/(augment|hausse|rejet|libere|produi)/] },
        { g: "vois", lab: "Le témoin (graines sèches) reste stable", re: [/(seche|temoin)/, /(stable|constant|ne (change|varie)|pas de variation|presque pas)/] },
        { g: "sais", lab: "Étape 3 · La respiration consomme O₂ et rejette CO₂", re: [/respir/, /(consomm|absorb|utilis)/] },
        { g: "deduis", lab: "Étape 4 · Les graines en germination respirent", re: [/(graine|germ|elles)[^.]{0,80}respir|respir[^.]{0,80}(graine|germ)/] }],
      model: "Les sondes mesurent les teneurs en O₂ et en CO₂ (en %) pendant 20 minutes. Avec les graines en germination, la teneur en O₂ diminue de 20,9 % à 19,3 %, soit une consommation de 1,6 % (0,08 % par minute), et la teneur en CO₂ augmente de 0,04 % à 1,64 %. Avec les graines sèches, le témoin, les teneurs restent stables. Je sais que la respiration consomme du dioxygène et rejette du dioxyde de carbone : glucose + O₂ → CO₂ + H₂O + énergie. J'en déduis que les graines en germination respirent." }],
  hints: ["Lis les valeurs à 0 et à 20 min dans les tableaux de valeurs.", "Vitesse = variation ÷ durée. Pour rédiger : identifier, décrire avec des valeurs, mettre en relation, conclure.", "0,08 % par minute pour les deux gaz · O₂ ↓, CO₂ ↑, témoin stable → respiration."],
  corr: "O₂ : 20,9 → 19,3 % (− 1,6 % en 20 min, soit 0,08 % par minute) ; CO₂ : 0,04 → 1,64 % (+ 1,6 %, soit 0,08 % par minute). Le témoin (graines sèches) reste stable. Consommation de O₂ et rejet de CO₂ : les graines en germination respirent." }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `La question : ${PROBLEM}\n${HOME.goal}\n\nCe qu'il faut retenir\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}`;
typo(GROUPS); typo(RAPPEL);
