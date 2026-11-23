/* ===== 3e SVT · Activité 9 · version notée sur 10 : la multiplication cellulaire (d'après la fiche « Act9 - Multiplication ») ===== */
const NOTE = {
  key: "svt3-mitose-note-v1", slug: "multiplication-cellulaire-note",
  kicker: "Activité 9 · activité notée sur 10",
  title: "Reconstituer les étapes de la multiplication cellulaire",
  mission: nb("Problème : comment une cellule transmet-elle ses chromosomes aux deux cellules qu'elle forme en se multipliant ?"),
  objectif: nb("Observer une cellule qui se multiplie, retrouver les étapes de la mitose, exploiter le graphique de la quantité d'ADN, puis compléter le schéma bilan et le bilan."),
  regles: ["La partie 2 se fait de mémoire : le document des étapes de la mitose n'est plus affiché une fois la partie 1 validée."],
  fiche: () => `<h2>${nb("Bilan à recopier · la multiplication cellulaire")}</h2>${ETAPES_HTML}<div class="recop"><p class="lab">✔ Bilan</p>
    <p>${nb("Avant la multiplication d'une cellule, chacun des 46 chromosomes <u>simples</u> fait une copie de lui-même : c'est la <u>duplication</u>.")}</p>
    <p>${nb("Pendant la multiplication, les chromosomes maintenant <u>doubles</u> se séparent en <u>2</u> lots de chromosomes <u>simples</u> et se répartissent dans les deux cellules-filles.")}</p>
    <p>${nb("La cellule qui se divise transmet ainsi les 46 chromosomes <u>identiques</u> aux siens.")}</p></div>`
};
const ETAPES_HTML = `<span class="stamp">À connaître !</span><div class="phases">${PHASES.map(p => `<div class="phase"><span class="pn"><i>${p.n}</i>${p.name}</span><span>${nb(p.txt)}</span></div>`).join("")}</div>`;
const SHOT_NM = { pro: "Prophase", meta: "Métaphase", ana: "Anaphase", telo: "Télophase" };
const inWin = (k, t) => typeof t === "number" && t >= SHOTWIN[k][0] && t <= SHOTWIN[k][1];
const PH_NAMES = ["prophase", "métaphase", "anaphase", "télophase", "interphase"];
/* photos de la cellule animée : type de question « shots » */
const QX = {
  shots: {
    html: (q, v) => { v = v || {}; return `<div class="shots">${q.phs.map(k => { const has = typeof v[k] === "number"; return `<div class="shot"><p class="sn">${SHOT_NM[k]}</p><div class="frame ${has ? "has" : ""}">${has ? thumb(v[k]) : "Pas encore de photo"}</div><button type="button" class="btn" data-shot="${k}" aria-label="${has ? "Refaire la photo" : "Prendre la photo"} : ${SHOT_NM[k]}">📸 ${has ? "Refaire" : "Photo"}</button></div>`; }).join("")}</div>`; },
    wire: (box, q, ctx) => $$("[data-shot]", box).forEach(b => b.onclick = () => { const v = Object.assign({}, ctx.get() || {}), k = b.dataset.shot; v[k] = Math.round(CELL.tau * 1000) / 1000; ctx.set(v, true); ctx.focus(`[data-shot="${k}"]`); }),
    filled: (q, v) => !!v && q.phs.every(k => typeof v[k] === "number"),
    score: (q, v) => v ? q.phs.filter(k => inWin(k, v[k])).length * q.pr : 0,
    ans: (q, v) => q.phs.map(k => `${SHOT_NM[k]} : ${typeof (v || {})[k] === "number" ? "photo prise" : "pas de photo"}`).join(" · "),
    exp: q => "Prophase : chromosomes visibles, en désordre · Métaphase : chromosomes alignés au milieu · Anaphase : chromatides qui se séparent · Télophase : chromosomes simples aux deux pôles",
    prof: (q, v) => { v = v || {}; return `<div class="wcards">${q.phs.map(k => { const t = v[k], ok = inWin(k, t), ph = typeof t === "number" ? phaseAt(t) : null; return `<div class="wcard"><p><b>${SHOT_NM[k]}</b></p><div class="wfig">${typeof t === "number" ? thumb(t) : ""}</div><p>${ok ? "✓ bonne photo" : typeof t === "number" ? `✗ photo prise pendant : ${ph.name ? ph.name.toLowerCase() : "la séparation des deux cellules"}` : "✗ pas de photo"} · ${pts(ok ? q.pr : 0)} / ${pts(q.pr)}</p></div>`; }).join("")}</div>`; }
  }
};
const PARTS = [
{ id: "p1", tab: "Observer", title: "Observer une cellule qui se multiplie",
  docs: [{ title: "Document 1 · Les étapes de la mitose", html: ETAPES_HTML },
    { title: "Animation · Une cellule se multiplie", sim: "Modèle simplifié", w: "cell", cap: nb("Utilise « Lancer », « Pause » et le curseur pour avancer ou reculer image par image.") }],
  qs: [
    { id: "m3", t: "shots", p: 2, pr: 0.5, phs: ["pro", "meta", "ana", "telo"], lab: nb("Photographie la cellule à chacune des quatre étapes de la mitose."), help: nb("Place l'animation au bon moment, puis touche le bouton 📸 de l'étape. Tu peux refaire une photo tant que la partie n'est pas validée. 0,5 point par photo.") },
    { id: "m1", t: "num", p: 0.5, unit: "chromosomes", ans: 4, lab: nb("Arrête l'animation quand les chromosomes sont alignés au milieu de la cellule. Combien de chromosomes comptes-tu ?") },
    { id: "m2", t: "choice", p: 0.5, a: 1, lab: nb("À ce moment-là, chaque chromosome est formé…"),
      o: ["d'un seul bâtonnet : c'est un chromosome simple.", "de deux bâtonnets attachés : c'est un chromosome double.", "d'un long fil très fin, presque invisible."].map(nb) }] },
{ id: "p2", tab: "Les étapes", title: "Les étapes de la mitose, de mémoire",
  intro: nb("Le document des étapes n'est plus affiché : réponds de mémoire."),
  qs: [
    { id: "m4", t: "order", p: 1, pr: 0.25, pos: [1, 2, 3, 4], lab: nb("Touche les six images dans l'ordre, de la cellule de départ aux deux cellules-filles."), help: nb("0,25 point par étape de la mitose (de la prophase à la télophase) placée au bon rang."),
      keys: ["inter", "pro", "meta", "ana", "telo", "fin"], th: k => thumb(TAUREF[k]),
      alts: ["Chromosomes en fils fins dans le noyau", "Chromosomes en X, en désordre", "Chromosomes en X alignés au milieu", "Bâtonnets qui s'écartent vers les deux côtés", "Bâtonnets arrivés aux deux pôles", "Deux cellules, chacune avec un noyau"] },
    { id: "m5", t: "words", p: 1, pr: 0.25, lab: nb("Écris le nom de l'étape de la mitose représentée sur chaque image."), help: nb("Les petites fautes d'orthographe sont acceptées. 0,25 point par image."),
      items: [["ana", ["anaphase", "anafase"]], ["pro", ["prophase", "profase"]], ["telo", ["télophase", "telofase"]], ["meta", ["métaphase", "metafase"]]].map(([k, ans]) => ({ fig: thumb(TAUREF[k]), ans, no: PH_NAMES.filter(n => normTxt(n) !== normTxt(ans[0])) })) }] },
{ id: "p3", tab: "L'ADN", title: "Suivre la quantité d'ADN",
  docs: [{ title: "Document 2 · Évolution de la quantité d'ADN dans une cellule au cours d'une division cellulaire", sim: SIMUL + " (durées indicatives)", w: "adn" }],
  qs: [
    { id: "m6", t: "num", p: 0.5, unit: "h", ans: 8, tol: 1, lab: nb("À quelle heure la quantité d'ADN commence-t-elle à augmenter ?") },
    { id: "m7", t: "num", p: 0.5, unit: "h", ans: 14, tol: 1, lab: nb("À quelle heure la quantité d'ADN atteint-elle 2Q ?") },
    { id: "m8", t: "txt", p: 1.5, min: 60, lab: nb("Explique pourquoi la quantité d'ADN passe de Q à 2Q, puis pourquoi chaque cellule-fille ne contient plus que la quantité Q. Que peut-on dire des chromosomes des cellules-filles ?"),
      help: nb("Rédige en phrases complètes, avec le vocabulaire du cours (chromosome simple ou double, chromatide…)."),
      ph: "Avant la division, … Pendant la division, … Les cellules-filles …",
      crit: [
        { lab: "explique le passage de Q à 2Q : chaque chromosome se copie (duplication), les chromosomes simples deviennent doubles", p: 0.5, f: n => any(n, /duplica/, /replica/, /dupliqu/, /\b(se |s )?(re)?copi/, /chromosomes?( simples?)? (deviennent|devient|sont devenus|passent a|se transforment en)( des)?( chromosomes?)? doubles?/) },
        { lab: "explique le passage de 2Q à Q : les chromatides de chaque chromosome se séparent et se répartissent dans les deux cellules-filles", p: 0.5, f: n => any(n, /chromatides?( \w+){0,5} (se )?separ/, /separ\w*( \w+){0,5} chromatides?/, /(partag|repart|divis)\w*( \w+){0,6} (deux|2) (cellules|lots)/, /chaque cellule( fille)? (recoit|a recu|obtient|prend|garde|recupere)/, /chromosomes?( doubles?)?( \w+){0,3} (se )?separ/, /(recoit|recupere|obtient|prend)( \w+){0,2} (la )?moitie/) },
        { lab: "conclut que les cellules-filles ont les mêmes chromosomes que la cellule de départ (même nombre, chromosomes identiques)", p: 0.5, f: n => any(n, /identiques?/, /\bmemes? (chromosomes|information|nombre|adn|genes|caryotype|patrimoine)/, /autant de chromosomes/, /comme (la )?cellule (de depart|mere|initiale)/, /\bpareil(le)?s?\b/, /semblables?/, /similaires?/) }],
      model: nb("Avant la division, chaque chromosome fait une copie de lui-même (duplication) : les chromosomes simples deviennent doubles et la quantité d'ADN passe de Q à 2Q. Pendant la division, les deux chromatides de chaque chromosome double se séparent et se répartissent dans les deux cellules-filles : chacune ne reçoit donc que la quantité Q. Les cellules-filles possèdent ainsi le même nombre de chromosomes, identiques à ceux de la cellule de départ.") }] },
{ id: "p4", tab: "Bilan", title: "Construire le bilan",
  qs: [
    { id: "m9", t: "rows", p: 1, pr: 0.25, lab: nb("Complète le schéma bilan. La cellule de départ possède 4 chromosomes simples."), help: nb("Le schéma se dessine d'après tes choix. 0,25 point par élément."),
      fig: (W, F, v) => schemaSVG(W, F, [(v || {})[1], (v || {})[3]]),
      rows: [
        { txt: "Flèche 1 : que fait la cellule ?", o: ["Duplication : chaque chromosome se copie", "Séparation des chromatides", "Rien ne change"], a: 0 },
        { txt: "Cellule juste avant de se diviser : elle contient…", o: ["4 chromosomes simples", "4 chromosomes doubles", "8 chromosomes simples"], a: 1 },
        { txt: "Flèche 2 : que se passe-t-il ?", o: ["Duplication : chaque chromosome se copie", "Séparation des chromatides et partage entre deux cellules", "Les chromosomes disparaissent"], a: 1 },
        { txt: "Chaque cellule-fille contient…", o: ["2 chromosomes simples", "4 chromosomes simples", "4 chromosomes doubles"], a: 1 }].map(r => ({ txt: nb(r.txt), o: r.o.map(nb), a: r.a })) },
    { id: "m10", t: "gaps", p: 1.5, pr: 0.25, lab: nb("Complète le bilan : écris le mot qui manque dans chaque case."), help: nb("Les accents et les petites fautes de frappe sont acceptés. 0,25 point par case."),
      segs: ["Avant la multiplication d'une cellule, chacun des 46 chromosomes ", { k: "g1", ans: ["simples", "simple", "à une chromatide"], no: ["doubles", "double"] }, " fait une copie de lui-même : c'est la ", { k: "g2", ans: ["duplication", "réplication", "copie"], no: ["mitose", "multiplication", "division"] },
        ".<br>Pendant la multiplication, les chromosomes maintenant ", { k: "g3", ans: ["doubles", "double", "à deux chromatides"], no: ["simples", "simple"] }, " se séparent en ", { k: "g4", ans: ["2", "deux"], no: ["4", "46", "quatre"] }, " lots de chromosomes ", { k: "g5", ans: ["simples", "simple", "à une chromatide", "identiques", "identique"], no: ["doubles", "double"] },
        " et se répartissent dans les deux cellules-filles.<br>La cellule qui se divise transmet ainsi les 46 chromosomes ", { k: "g6", ans: ["identiques", "identique", "semblables", "pareils"], no: ["différents", "different"] }, " aux siens."].map(s => typeof s === "string" ? nb(s) : s) }] }
];
