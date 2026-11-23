/* ===== 3e SVT · Activité 8 · version notée sur 10 : l'arbre de Jean (d'après la fiche « Act8 - transmission allèles ») ===== */
const NOTE = {
  key: "svt3-arbre-jean-note-v1", slug: "arbre-jean-note",
  kicker: "Activité 8 · activité notée sur 10",
  title: "L'arbre généalogique de la famille de Jean",
  mission: nb("Jean NEYMAR est du <b>groupe O</b>. Son avocat conteste : « Son père est du groupe B et sa mère du groupe A. Jean ne peut pas être du groupe O : le test d'agglutination s'est trompé ! »"),
  objectif: nb("Construire l'arbre généalogique de la famille de Jean en y indiquant les allèles de chaque personne, puis dire, en le justifiant, si l'avocat a raison."),
  regles: ["La fabrique de globules rouges (partie 1) et le simulateur de naissances (partie 3) sont des outils : ils ne sont pas notés."],
  fiche: () => `<h2>${nb("Bilan à recopier · la transmission des allèles")}</h2><div class="recop"><p class="lab">✔ Bilan</p>
    <p>${nb("Dans l'espèce humaine, nous avons tous les mêmes <u>gènes</u> sur nos chromosomes, mais pas forcément les mêmes <u>allèles</u>.")}</p>
    <p>${nb("Pour un gène donné, nous pouvons porter soit <u>deux allèles identiques</u>, soit <u>deux allèles différents</u>.")}</p>
    <p>${nb("Si l'allèle est <u>dominant</u>, il s'exprime toujours, même s'il n'est présent qu'une seule fois sur la paire de chromosomes. S'il est <u>récessif</u>, il doit être présent 2 fois pour s'exprimer.")}</p>
    <p>${nb("L'ensemble des allèles d'un individu forme son <u>génotype</u>. Le <u>génotype</u> détermine en grande partie le phénotype (caractères exprimés, comme la couleur des cheveux ou des yeux).")}</p></div>
    <p>${nb("Famille de Jean : père B/O, mère A/O, sœur A/B, Jean O/O, frère B/O. Chaque parent transmet un seul de ses deux allèles : Jean a reçu un allèle O de chacun de ses parents.")}</p>`
};
const GENS = ["A/A", "A/B", "A/O", "B/B", "B/O", "O/O"];
const GRP = ["A", "B", "AB", "O"];
const rti = g => `<span class="rti">${rbcSVG(g)}</span>`;
const Q1 = { id: "j1", t: "rows", multi: true, p: 1, pr: 0.25, lab: "Pour chaque groupe sanguin, touche <b>tous</b> les génotypes possibles.", help: nb("Aide-toi de la fabrique. Une ligne rapporte 0,25 point si elle contient tous les bons génotypes, et seulement eux."),
  choices: GENS, rows: [{ txt: `${rti("A")}Groupe A (la mère)`, a: [0, 2] }, { txt: `${rti("O")}Groupe O (Jean)`, a: [5] }, { txt: `${rti("B")}Groupe B (le père et le frère)`, a: [3, 4] }, { txt: `${rti("AB")}Groupe AB (la sœur)`, a: [1] }] };
const Q4 = { id: "j4", t: "tree", p: 2.5, pr: 0.5, lab: nb("Complète l'arbre généalogique : indique les deux allèles de chaque personne."), help: nb("Pour les enfants, le chromosome de gauche vient du père, celui de droite de la mère. Touche un carré orange pour changer l'allèle (A → B → O → vide). 0,5 point par personne.") };
const PARTS = [
{ id: "p1", tab: "Allèles", title: "Les allèles du groupe sanguin",
  docs: [{ title: "Document 1 · Le gène du groupe sanguin", html: `<p>${nb("Notre groupe sanguin dépend du <b>type de molécule fixée à la surface de nos globules rouges</b> (= antigènes). Le gène « groupe sanguin », situé sur la <b>paire de chromosomes n°9</b>, est responsable de la fabrication de ces antigènes.")}</p><p>${nb("Il existe 3 <b>allèles</b> (3 versions) de ce gène. Chaque personne possède 2 allèles : un sur chaque chromosome de la paire.")}</p>${LEGEND_AL}` },
    { title: "Document 2 · La fabrique de globules rouges", sim: "Modèle simplifié · outil non noté", w: "factory" }],
  qs: [Q1,
    { id: "j2", t: "choice", p: 0.5, lab: nb("Deux chromosomes d'une même paire portent-ils nécessairement les mêmes allèles ?"), a: 1,
      o: ["Oui : les deux chromosomes d'une paire sont identiques.", "Non : ils portent le même gène, mais pas forcément le même allèle.", "Non : ils ne portent pas les mêmes gènes."].map(nb) },
    { id: "j3", t: "choice", p: 0.5, lab: nb("La présence de deux allèles A est-elle nécessaire pour être du groupe sanguin A ?"), a: 1,
      o: ["Oui : il faut le génotype A/A pour être du groupe A.", "Non : une personne de génotype A/O est aussi du groupe A.", "Non : il suffit de ne posséder aucun allèle B."].map(nb) }] },
{ id: "p2", tab: "Arbre", title: "L'arbre généalogique de la famille de Jean",
  docs: [{ title: "Document 3 · La famille de Jean", html: `<p><b>${nb("Père : groupe B · Mère : groupe A · Sœur : groupe AB · Jean : groupe O · Frère : groupe B")}</b></p><p>${nb("Chaque parent ne donne qu'<b>un seul</b> de ses deux chromosomes n°9 à son enfant lors de la fécondation : chaque enfant reçoit <b>un allèle de son père</b> et <b>un allèle de sa mère</b>.")}</p>` },
    { title: "Rappel · Ton tableau de la partie 1", own: () => { const v = S.ans.j1 || {}; return `<div class="gtab">${Q1.rows.map((r, i) => `<span class="g">${plain(r.txt)}</span><span>${esc(QB.rows.cell(Q1, r, v[i]))}</span>`).join("")}</div>`; }, cap: nb("Ce sont tes réponses, pas une correction.") }],
  qs: [Q4] },
{ id: "p3", tab: "Hasard", title: "Le hasard de la fécondation",
  intro: nb("Le père (B/O) et la mère (A/O) donnent chacun un de leurs deux allèles, au hasard."),
  docs: [{ title: "Document 4 · Des naissances au hasard", sim: "Tirages au hasard : chaque série donne des nombres un peu différents · outil non noté", w: "sim" }],
  qs: [{ id: "j5", t: "rows", p: 1, pr: 0.25, lab: nb("Complète le tableau de croisement : quel est le groupe sanguin de l'enfant dans chaque case ?"), choices: GRP,
      doc: { title: "Tableau de croisement", html: `<div class="tablewrap" style="border:0"><table class="punnett"><thead><tr><th></th><th class="m">Mère A</th><th class="m">Mère O</th></tr></thead><tbody><tr><th class="d">Père B</th><td>B + A</td><td>B + O</td></tr><tr><th class="d">Père O</th><td>O + A</td><td>O + O</td></tr></tbody></table></div>` },
      rows: [{ txt: "B (père) + A (mère)", a: 2 }, { txt: "B (père) + O (mère)", a: 1 }, { txt: "O (père) + A (mère)", a: 0 }, { txt: "O (père) + O (mère)", a: 3 }] },
    { id: "j6", t: "choice", p: 0.5, lab: nb("Pour ce couple (père B/O × mère A/O), quelle est la probabilité qu'un enfant soit du groupe O ?"), a: 1,
      o: ["0 : c'est impossible.", "1 chance sur 4 (25 %).", "1 chance sur 2 (50 %).", "3 chances sur 4 (75 %)."].map(nb) }] },
{ id: "p4", tab: "Conclusion", title: "L'avocat a-t-il raison ?",
  docs: [{ title: "Rappel · La mission", html: `<p>${NOTE.mission}</p>` },
    { title: "Rappel · Ton arbre de la partie 2", own: () => treeHTML(S.ans.j4, true), cap: nb("Ce sont tes réponses, pas une correction.") }],
  qs: [{ id: "j7", t: "txt", p: 2, min: 60, lab: nb("L'avocat affirme : « Jean ne peut pas être du groupe O, car son père est du groupe B et sa mère du groupe A. » A-t-il raison ? Rédige ta réponse en la justifiant."),
      help: nb("Appuie-toi sur l'arbre : le génotype de Jean, les allèles que ses parents lui ont transmis, le génotype des parents. Puis conclus."),
      ph: "L'avocat … car Jean est … ; or chaque parent … ; donc …",
      crit: [
        { lab: "indique que Jean est O/O : il possède deux allèles O", p: 0.5, f: n => any(n, /\bo o\b/, /\boo\b/, /(deux|2) alleles? (de type |du groupe )?o\b/, /alleles? o( \w+){0,3} (deux|2) fois/, /\bo et (un )?o\b/, /(deux|2) fois (l )?allele o\b/, /homozygote/) },
        { lab: "explique que chaque parent transmet un de ses allèles : Jean a reçu un allèle O de son père et un de sa mère", p: 0.5, f: n => any(n, /chaque parent/, /chacun (de )?(ses |s )?parents?/) || (any(n, /\b(donn\w*|transmi\w*|transmet\w*|recu|recoit|herit\w*|vien\w*|provien\w*)\b/) && (any(n, /parents?/) || (any(n, /\bpere|papa/) && any(n, /\bmere|maman/)))) },
        { lab: "en déduit que les parents portent chacun un allèle O qui ne s'exprime pas : père B/O, mère A/O", p: 0.5, f: n => (any(n, /\bb o\b/, /\bo b\b/, /\bbo\b/) && any(n, /\ba o\b/, /\bo a\b/, /\bao\b/)) || any(n, /(pere|mere|parents?|ils|chacun)( \w+){0,6} (porte\w*|possede\w*|ont|a|cache\w*|detien\w*|aussi)( \w+){0,3} (un |l |des )?alleles? o\b/, /(pere|mere|parents?)( \w+){0,8} (allele )?o\b( \w+){0,3} (recessif|cache|masque|ne s exprime pas|qui ne s exprime)/, /heterozygote/) },
        { lab: "conclut que l'avocat a tort : Jean peut bien être du groupe O (le test ne s'est pas trompé)", p: 0.5, f: n => !(/avocat( \w+){0,2} (a raison|dit vrai|ne se trompe pas)/.test(n) && !/pas raison/.test(n)) && any(n, /\btort\b/, /pas raison/, /se trompe\b/, /(est|c est|reste) (bien |tout a fait |donc |quand meme )?possible/, /peut (donc |bien |tout a fait |quand meme )?etre (du groupe |de groupe )?o\b/, /test( \w+){0,4} (ne s est pas|n est pas|pas) (trompe|faux)/) }],
      model: nb("Non, l'avocat a tort. Jean est du groupe O : son génotype est O/O, car l'allèle O est récessif. Or chaque parent transmet un seul de ses deux allèles à son enfant : Jean a donc reçu un allèle O de son père et un allèle O de sa mère. Son père est donc B/O et sa mère A/O : ils portent chacun un allèle O qui ne s'exprime pas. Jean peut bien être du groupe O : le test ne s'est pas trompé.") }] },
{ id: "p5", tab: "Bilan", title: "Le bilan",
  qs: [{ id: "j8", t: "fill", p: 2, pr: 0.25, lab: nb("Complète le bilan avec les mots de la liste."),
      segs: ["Dans l'espèce humaine, nous avons tous les mêmes ", { k: "b1" }, " sur nos chromosomes, mais pas forcément les mêmes ", { k: "b2" }, ".<br>Pour un gène donné, nous pouvons porter soit ", { k: "b3" }, ", soit ", { k: "b4" }, ".<br>Si l'allèle est ", { k: "b5" }, ", il s'exprime toujours, même s'il n'est présent qu'une seule fois sur la paire de chromosomes. S'il est ", { k: "b6" }, ", il doit être présent 2 fois pour s'exprimer.<br>L'ensemble des allèles d'un individu forme son ", { k: "b7" }, ". Le ", { k: "b8" }, " détermine en grande partie le phénotype (caractères exprimés, comme la couleur des cheveux ou des yeux)."].map(s => typeof s === "string" ? nb(s) : s),
      bank: ["gènes", "allèles", "deux allèles identiques", "deux allèles différents", "dominant", "récessif", "génotype", "génotype", "phénotype", "antigènes"],
      sol: { b1: "gènes", b2: "allèles", b3: "deux allèles identiques", b4: "deux allèles différents", b5: "dominant", b6: "récessif", b7: "génotype", b8: "génotype" },
      ok: w => { const P = ["deux allèles identiques", "deux allèles différents"]; return { b1: w.b1 === "gènes", b2: w.b2 === "allèles", b3: P.includes(w.b3), b4: P.includes(w.b4) && w.b4 !== w.b3, b5: w.b5 === "dominant", b6: w.b6 === "récessif", b7: w.b7 === "génotype", b8: w.b8 === "génotype" }; } }] }
];
