/* Fiches élèves et corrigés Word — TP élodée (FR + DNL EN) */
const fs = require("fs");
const D = require("docx");
const { Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, AlignmentType, LevelFormat, VerticalAlign, HeightRule, Footer, PageNumber } = D;
const T = require("./content.js");
const OUT = "dist"; fs.mkdirSync(OUT, { recursive: true });
const IMG = f => fs.readFileSync("img/" + f);
const W = 9906; // largeur utile A4, marges 1000
const COL = { ink: "14251A", muted: "4A6150", green: "1F6F3A", greenSoft: "E3F1E6", yellow: "FFF6D6", blue: "1D5BB0", blueSoft: "E6EEFA", orange: "9C4F05", orangeSoft: "FDEBD5", red: "AD2318", line: "B9CBB9", ans: "1F6F3A" };

function makeDoc(lang) {
  const FR = lang === "fr";
  const ty = s => FR ? s.replace(/ ([?!:;»%])/g, " $1").replace(/« /g, "« ") : s;
  let nNum = 0; const numbering = [{ reference: "bul", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 500, hanging: 260 } } } }, { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1000, hanging: 260 } } } }] }];
  const newNum = () => { const ref = "n" + (++nNum); numbering.push({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 500, hanging: 320 } } } }] }); return ref; };

  /* texte riche minimal : <b>, <i>, **gras** */
  function runs(str, base = {}) {
    const out = []; let b = false, i = false;
    String(ty(str)).split(/(<\/?b>|<\/?i>|\*\*)/).forEach(tok => {
      if (tok === "<b>" || tok === "**" && !b) { b = true; return; } if (tok === "</b>" || tok === "**" && b) { b = false; return; }
      if (tok === "<i>") { i = true; return; } if (tok === "</i>") { i = false; return; }
      const t = tok.replace(/<[^>]+>/g, ""); if (t) out.push(new TextRun(Object.assign({ text: t, bold: b || base.bold, italics: i || base.italics }, base.color ? { color: base.color } : {}, base.size ? { size: base.size } : {})));
    });
    return out;
  }
  const P = (str, o = {}) => new Paragraph({ children: Array.isArray(str) ? str : runs(str, o), spacing: { after: o.after ?? 100, before: o.before ?? 0 }, alignment: o.align, keepNext: o.keepNext, indent: o.indent });
  const H = (str, lvl = 1, o = {}) => new Paragraph({ heading: lvl === 1 ? D.HeadingLevel.HEADING_1 : lvl === 2 ? D.HeadingLevel.HEADING_2 : D.HeadingLevel.HEADING_3, children: runs(str), keepNext: true, pageBreakBefore: o.pageBreak });
  const Bul = (str, o = {}) => new Paragraph({ children: runs(str, o), numbering: { reference: "bul", level: o.level || 0 }, spacing: { after: 60 } });
  const Num = (ref, str, o = {}) => new Paragraph({ children: runs(str, o), numbering: { reference: ref, level: 0 }, spacing: { after: 60 } });
  const numList = items => { const r = newNum(); return items.map(s => Num(r, s)); };
  const border = (c = COL.line, sz = 6) => ({ style: BorderStyle.SINGLE, size: sz, color: c });
  const allB = (c, sz) => ({ top: border(c, sz), bottom: border(c, sz), left: border(c, sz), right: border(c, sz) });
  const cell = (children, w, o = {}) => new TableCell({ children: Array.isArray(children) ? children : [children], width: { size: w, type: WidthType.DXA }, shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR, color: "auto" } : undefined, borders: o.borders || allB(o.bc, o.bs), verticalAlign: o.v || VerticalAlign.TOP, margins: { top: 80, bottom: 80, left: 120, right: 120 }, columnSpan: o.span });
  const table = (rows, widths, o = {}) => new Table({ width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths, rows: rows.map((r, ri) => new TableRow({ cantSplit: true, children: r.map((c, ci) => c instanceof TableCell ? c : cell(typeof c === "string" ? P(c, { bold: o.headBold && ri === 0, after: 40 }) : c, widths[ci], { fill: o.headFill && ri === 0 ? o.headFill : undefined })), height: o.rowH && ri > 0 ? { value: o.rowH, rule: HeightRule.ATLEAST } : undefined, tableHeader: o.headBold && ri === 0 })) });
  const answerBox = (h = 1100, hint) => new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W], rows: [new TableRow({ cantSplit: true, height: { value: h, rule: HeightRule.ATLEAST }, children: [cell(hint ? P(hint, { italics: true, color: "8A9A8D", size: 18 }) : P(""), W, { bc: "9DB59F", bs: 6 })] })] });
  const spacer = (a = 80) => new Paragraph({ children: [], spacing: { after: a } });
  const KIND = { info: [COL.blue, COL.blueSoft, "ℹ"], warn: [COL.orange, COL.orangeSoft, "⚠"], key: [COL.green, COL.greenSoft, "✔"], err: [COL.red, "FBE2DE", "⛔"] };
  const box = (kind, label, paras) => { const [c, f, ic] = KIND[kind]; return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W], rows: [new TableRow({ cantSplit: true, children: [cell([P(`${ic} ${label.toUpperCase()}`, { bold: true, color: c, size: 18, after: 60 }), ...paras], W, { fill: f, borders: { top: border(c, 4), bottom: border(c, 4), right: border(c, 4), left: border(c, 24) } })] })] }); };
  const img = (file, w, h, type = "png") => new Paragraph({ children: [new ImageRun({ type, data: IMG(file), transformation: { width: w, height: h } })], spacing: { after: 80 }, alignment: AlignmentType.CENTER });
  const pts = n => n ? ` (${FR ? String(n).replace(".", ",") : n} pt${n > 1 ? "s" : ""})` : "";
  const ansLabel = FR ? "Réponse attendue" : "Expected answer";
  const ans = (paras, n) => box("key", ansLabel + (n ? pts(n) : ""), paras.map(p => typeof p === "string" ? P(p, { after: 60 }) : p));
  const bar = (rows) => table([[FR ? "Critère" : "Criterion", FR ? "Points" : "Points"], ...rows.map(r => [r[0], FR ? String(r[1]).replace(".", ",") : String(r[1])])], [W - 1400, 1400], { headBold: true, headFill: COL.greenSoft });

  function headerTable(C, kind) {
    const m = C.meta; const w = [2900, 3000, W - 5900];
    const left = [P(m.theme, { bold: true, size: 19, after: 60 }), P(m.chapter, { size: 19, after: 0 })];
    const mid = [P(m.activity, { size: 20, align: AlignmentType.CENTER, after: 40 }), ...(kind ? [P(kind, { bold: true, color: COL.red, size: 20, align: AlignmentType.CENTER, after: 0 })] : [])];
    const right = [P(m.objectivesTitle, { bold: true, size: 18, after: 40 }), ...m.objectives.map(o => new Paragraph({ children: runs(o, { size: 16 }), numbering: { reference: "bul", level: 0 }, spacing: { after: 20 } }))];
    return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: w, rows: [new TableRow({ cantSplit: true, children: [cell(left, w[0], { fill: "E3F1E6", v: VerticalAlign.CENTER }), cell(mid, w[1], { fill: "FFF6D6", v: VerticalAlign.CENTER }), cell(right, w[2], { fill: "FFFBEA" })] })] });
  }
  function clueTable(C) {
    const w = [W / 2, W / 2]; const mk = (c, icon) => [P(`${icon} ${c.title}`, { bold: true, after: 60 }), ...(c.over ? [P(c.over, { size: 16, color: COL.muted, after: 0 })] : []), P(c.eq, { after: 80, size: 21 }), ...c.rows.map(r => P(`<b>${r[0]}</b> : ${r[1]}`.replace(" : ", FR ? " : " : ": "), { size: 19, after: 40 }))];
    return new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: w, rows: [new TableRow({ cantSplit: true, children: [cell(mk(C.clues.ps, "🌿"), w[0], { fill: "F1F7F0" }), cell(mk(C.clues.rs, "🔥"), w[1], { fill: "FBF3EC" })] })] });
  }
  function build(children, title, footerTxt) {
    return new Document({
      creator: "Filipe Moreira", title, styles: {
        default: { document: { run: { font: "Arial", size: 21, color: COL.ink } } },
        paragraphStyles: [
          { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Arial", size: 28, bold: true, color: "1B4A2C" }, paragraph: { spacing: { before: 280, after: 120 }, keepNext: true, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "9DB59F", space: 4 } } } },
          { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Arial", size: 23, bold: true, color: "1B4A2C" }, paragraph: { spacing: { before: 200, after: 100 }, keepNext: true } },
          { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { font: "Arial", size: 21, bold: true, color: COL.ink }, paragraph: { spacing: { before: 140, after: 80 }, keepNext: true } }
        ]
      },
      numbering: { config: numbering },
      sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
        footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: footerTxt + "  ·  ", size: 16, color: COL.muted }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: COL.muted }), new TextRun({ text: " / ", size: 16, color: COL.muted }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: COL.muted })] })] }) },
        children }]
    });
  }
  return { FR, ty, runs, P, H, Bul, numList, cell, table, answerBox, spacer, box, img, ans, bar, pts, headerTable, clueTable, build, border, allB, W };
}

/* ================= FICHE ÉLÈVE (FR ou EN) ================= */
function worksheet(lang) {
  const C = T[lang], K = makeDoc(lang), FR = K.FR, { P, H, Bul, numList, table, answerBox, spacer, box, img, pts } = K;
  const s1 = C.s1, s2 = C.s2, e1 = C.s3.ex1, e2 = C.s3.ex2, s4 = C.s4;
  const ch = [];
  ch.push(K.headerTable(C)); ch.push(spacer(120));
  ch.push(P(`<b>${C.h.inv}</b>`, { size: 26, align: AlignmentType.CENTER, after: 160 }));
  ch.push(H("🔍 " + C.h.sit, 2)); C.situation.forEach(s => ch.push(P(s)));
  ch.push(P(`<b>${C.h.clues}</b>`, { keepNext: true })); ch.push(K.clueTable(C)); ch.push(spacer());
  ch.push(H("🎯 " + C.h.mission, 2)); ch.push(P(`<b>${C.h.problem}</b> ${C.problem}`)); ch.push(P(`<b>${C.h.iq}</b>`, { keepNext: true })); ch.push(...numList(C.invQ));
  // Étape 1
  ch.push(H("📋 " + C.h.s1, 1)); ch.push(P(s1.before)); ch.push(P(`<b>${s1.a}</b>`, { keepNext: true }));
  ch.push(table([s1.tableHead, ...s1.rows.map(r => [r.name, "", ""])], [2400, 3753, 3753], { headBold: true, headFill: "E3F1E6", rowH: 620 }));
  ch.push(spacer()); ch.push(P(`<b>${s1.b}</b>`, { keepNext: true }));
  s1.hyps.forEach(h => { ch.push(Bul(`<b>${h.label.split(/ ?: /)[0]}</b>${FR ? " : " : ": "}${h.label.split(/ ?: /).slice(1).join(": ")}`)); ch.push(Bul(s1.predWord, { level: 1 })); });
  // Étape 2
  ch.push(H("🧪 " + C.h.s2, 1)); ch.push(P(`<b>${s2.equipTitle}</b>`, { keepNext: true })); s2.equipment.forEach(e => ch.push(Bul(e)));
  ch.push(P(`<b>${s2.groupTitle}</b>`, { before: 120, keepNext: true })); ch.push(P(`<i>${s2.groupQ.join(" ")}</i>`, { keepNext: true })); ch.push(answerBox(1300));
  ch.push(P(`<b>${s2.protoTitle}</b>`, { before: 160, keepNext: true })); ch.push(...numList(s2.protocol));
  ch.push(img("fr-003-002-40.jpg", 330, 189, "jpg")); if (!FR) ch.push(P("<i>(yeah, this image is in French, don't tell anyone!)</i>", { align: AlignmentType.CENTER, size: 17, color: "6A7B6E" }));
  ch.push(P(`<b>${s2.altTitle}</b>`, { keepNext: true })); s2.alternance.forEach(a => ch.push(Bul(`<b>${a[0]}${FR ? " : " : ": "}${a[1]}</b> ${a[2]}`)));
  ch.push(spacer()); ch.push(box("warn", FR ? "Vigilance" : "Watch out", s2.vigilance.map(v => Bul(v))));
  // Étape 3
  ch.push(H("📊 " + C.h.s3, 1));
  ch.push(H(e1.title, 3)); ch.push(img("fr-004-003.jpg", 470, 302, "jpg")); ch.push(P(`<i>${e1.link}</i>`, { size: 18, color: "4A6150", align: AlignmentType.CENTER }));
  ch.push(P(e1.a, { bold: true, keepNext: true })); ch.push(answerBox(500)); ch.push(P(e1.b, { bold: true, before: 120, keepNext: true })); ch.push(answerBox(1500));
  ch.push(spacer()); ch.push(box("info", FR ? "Remarque" : "Note", [P(e1.note.replace(/^(Rq|Note) ?: ?/, ""), { size: 19, after: 0 })]));
  ch.push(H(e2.title, 3)); ch.push(P(e2.ctx));
  const w2 = [W * 0.47, W * 0.53];
  ch.push(new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: w2, rows: [new TableRow({ cantSplit: true, children: [K.cell([P(e2.doc1, { size: 17, bold: true, after: 60 }), img("glucose.png", 270, 133)], w2[0], { v: VerticalAlign.TOP }), K.cell([P(e2.doc2, { size: 17, bold: true, after: 60 }), img("fr-004-006.jpg", 240, 159, "jpg"), P(FR ? "Légendes : noyau, vacuole, mitochondrie, membrane, cytoplasme." : "Labels: nucleus, vacuole, mitochondrion, membrane, cytoplasm.", { size: 16, italics: true, color: COL.muted, after: 0 })], w2[1])] })] }));
  ch.push(P(e2.a, { bold: true, before: 120, keepNext: true })); ch.push(answerBox(1400)); ch.push(P(e2.b, { bold: true, before: 120, keepNext: true })); ch.push(answerBox(1100));
  // Étape 4
  ch.push(H("📈 " + C.h.s4, 1, { pageBreak: true })); ch.push(P(`<b>${s4.photo}</b>`, { keepNext: true })); ch.push(answerBox(4200, FR ? "Insérez ici la photo de votre courbe (ou une capture d'écran de LATIS BIO)." : "Insert the photo of your curve here (or a LATIS BIO screenshot)."));
  ch.push(P(`<b>${s4.analysis}</b>`, { before: 120 }));
  ch.push(H(s4.d, 3)); ch.push(P(s4.dIntro, { keepNext: true })); ch.push(Bul(`<b>${s4.dDark}</b>`)); ch.push(answerBox(900)); ch.push(Bul(`<b>${s4.dLight}</b>`)); ch.push(answerBox(900));
  if (!FR) ch.push(box("info", "Useful language", [P("“Between <i>0</i> and <i>10</i> minutes, the O₂ level <i>falls slowly</i> from … to … mg/L.” · “When the lamp is turned on, the O₂ level <i>rises quickly</i>…” · “The curve goes up / goes down / levels off.”", { size: 19, after: 0 })]));
  ch.push(P(`<i>${s4.obs}</i>`, { before: 120, keepNext: true })); ch.push(answerBox(600));
  ch.push(H(s4.i, 3));
  [[s4.iUp], [s4.iDown]].forEach(([q]) => { ch.push(Bul(`<b>${q}</b>`)); s4.ioOpts.forEach(o => ch.push(P("☐ " + o, { indent: { left: 900 }, after: 40 }))); ch.push(P(`${s4.imQ}   ☐ ${s4.imOpts[0]}   ☐ ${s4.imOpts[1]}`, { indent: { left: 900 }, after: 120 })); });
  ch.push(H(s4.c, 3)); ch.push(P(s4.cQ, { keepNext: true })); ch.push(P(`<i>${s4.cQ2}</i>`, { keepNext: true })); ch.push(answerBox(1800));
  ch.push(H("🎓 " + C.h.more, 2)); ch.push(P(`<b>${s4.bonus}</b>`, { keepNext: true })); ch.push(answerBox(1400));
  ch.push(P(FR ? "<b>Note : …… / 11</b>" : "<b>Mark: …… / 11</b>", { align: AlignmentType.RIGHT, before: 160 }));
  if (!FR) dnlStudent(ch, C, K);
  return K.build(ch, C.meta.title, FR ? "TP élodée · 2nde SVT · Fiche élève" : "Elodea lab · DNL Year 10 · Student worksheet");
}
function dnlStudent(ch, C, K) {
  const { P, H, Bul, numList, table, answerBox, spacer, box } = K; const N = C.dnl;
  ch.push(H("🎮 Interactive Activities", 1, { pageBreak: true }));
  ch.push(H(N.tps.title, 3)); ch.push(P(`<i>${N.tps.lead}</i>`)); ch.push(...numList(N.tps.qs.map(q => `“${q}”`)));
  ch.push(H(N.gap.title, 3)); ch.push(P("Complete the sentences with: <b>" + N.gap.bank.join(", ") + "</b> (each word once)."));
  const r = K.numList(N.gap.sentences.map(sn => sn.map(x => typeof x === "number" ? "__________" : x).join("")));
  ch.push(...r);
  ch.push(H(N.match.title, 3)); ch.push(P("Match the English and French terms (write the letter)."));
  const fr = ["Dioxygène", "Échanges gazeux", "Chloroplaste", "Diminution", "Amidon", "Bulle", "Élodée", "Turbulent"];
  ch.push(table([["Column A", "", "Column B"], ...N.match.pairs.map((p, i) => [`${i + 1}. ${p[0]}`, "→ ……", `${"ABCDEFGH"[i]}. ${fr[i]}`])], [4200, 1500, W - 5700], { headBold: true, headFill: "E3F1E6" }));
  ch.push(H(N.challenge.title, 3)); ch.push(P(`${N.challenge.lead} <b>${N.challenge.banned.join(", ")}</b>.`)); ch.push(P(`<i>${N.challenge.alt}</i>`, { size: 19 })); ch.push(answerBox(1400));
  ch.push(H("✅ Check Your Understanding", 1));
  ch.push(H(N.exit.title, 3)); ch.push(P(N.exit.lead)); N.exit.starters.forEach((s, i) => { ch.push(P(`${i + 1}. ${s}`, { keepNext: true, after: 40 })); ch.push(answerBox(500)); });
  ch.push(H(N.quiz.title, 3)); N.quiz.qs.forEach((q, i) => { ch.push(P(`<b>${i + 1}. ${q.q}</b>`, { keepNext: true, after: 40, before: 60 })); q.o.forEach((o, j) => ch.push(P(`☐ ${"abcd"[j]}) ${o}`, { indent: { left: 500 }, after: 20, keepNext: j < 3 }))); });
  ch.push(H(N.minute.title, 3)); ch.push(P(`“${N.minute.q}”`)); ch.push(answerBox(1200));
  ch.push(H("📚 " + N.glossary.title + " · Lexique spécialisé", 1, { pageBreak: true }));
  ch.push(table([["Français", "English", "Pronunciation (IPA)", "Example in context"], ...N.glossary.items.map(g => [g[0], `<b>${g[1]}</b>`, g[2], `“${g[3]}”`])], [2100, 2300, 2000, W - 6400], { headBold: true, headFill: "E3F1E6" }));
  ch.push(H("⚠ " + N.mistakes.title, 1));
  ch.push(P("<b>False friends · Faux amis</b>")); ch.push(table([["French ≠ English", "Correct translation"], ...N.mistakes.falseFriends.map(f => [`${f[0]} ≠ ${f[1]}`, f[2]])], [W / 2, W / 2], { headBold: true, headFill: "FDEBD5" }));
  ch.push(P("<b>Common grammatical errors</b>", { before: 120 })); N.mistakes.grammar.forEach(g => ch.push(Bul(`✗ “${g[0]}” → ✓ “${g[1]}”`)));
  ch.push(P("<b>Pronunciation tips</b>", { before: 120 })); N.mistakes.pron.forEach(p => ch.push(Bul(`<b>${p[0]}</b>: ${p[1]}`)));
  ch.push(H("🌍 " + N.culture.title, 1)); ch.push(P("<b>Historical context</b>")); N.culture.hist.forEach(h => ch.push(Bul(`<b>${h[0]}</b>: ${h[1]}`)));
  ch.push(P("<b>Modern applications</b>", { before: 80 })); N.culture.modern.forEach(h => ch.push(Bul(`<b>${h[0]}</b>: ${h[1]}`)));
  ch.push(P("<b>English-speaking scientists to mention</b>", { before: 80 })); N.culture.sci.forEach(h => ch.push(Bul(`<b>${h[0]}</b>: ${h[1]}`)));
  ch.push(spacer()); ch.push(box("key", "Remember", [P(N.remember, { after: 0 })]));
}

/* ================= CORRIGÉS ================= */
function key(lang) {
  const C = T[lang], K = makeDoc(lang), FR = K.FR, { P, H, Bul, numList, table, spacer, box, img, ans, bar } = K;
  const L = FR ? FRK : ENK; const s1 = C.s1;
  const ch = [];
  ch.push(K.headerTable(C, FR ? "CORRIGÉ PROFESSEUR · version élodée" : "TEACHER'S ANSWER KEY · Elodea version")); ch.push(spacer(120));
  ch.push(P(`<b>${C.h.inv}</b>`, { size: 26, align: AlignmentType.CENTER, after: 120 }));
  ch.push(table([[FR ? "Partie" : "Part", FR ? "Barème" : "Marks"], ...L.bareme.map(b => [b[0], b[1]])], [W - 1800, 1800], { headBold: true, headFill: "E3F1E6" }));
  ch.push(H(L.prepT, 1)); L.prep.forEach(p => ch.push(Bul(p)));
  ch.push(spacer()); ch.push(box("warn", L.troubleT, L.trouble.map(t => Bul(t))));
  // Étape 1
  ch.push(H("📋 " + C.h.s1 + (FR ? " (non noté)" : " (not graded)"), 1, { pageBreak: true }));
  ch.push(P(`<b>${s1.a}</b>`, { keepNext: true }));
  ch.push(table([s1.tableHead, ...s1.rows.map(r => [r.name, `<b>${s1.o2Opts[r.o2]}</b>`, `<b>${L.light[r.light]}</b>`])], [2400, 3753, 3753], { headBold: true, headFill: "E3F1E6" }));
  ch.push(P(`<b>${s1.b}</b>`, { before: 120, keepNext: true }));
  ch.push(table([[FR ? "Hypothèse" : "Hypothesis", C.ui.darkCol, C.ui.lightCol], ...s1.hyps.map((h, i) => [h.label, `<b>${s1.predOpts[h.dark]}</b>`, `<b>${s1.predOpts[h.light]}</b>${i === 2 ? L.h3note : ""}`])], [4300, 2400, W - 6700], { headBold: true, headFill: "E3F1E6" }));
  ch.push(spacer()); ch.push(box("info", L.predTipT, [P(L.predTip, { after: 0 })]));
  // Étape 2
  ch.push(H("🧪 " + C.h.s2 + (FR ? " (non noté)" : " (not graded)"), 1)); ch.push(P(`<b>${L.demT}</b>`)); L.dem.forEach(d => ch.push(Bul(d)));
  // Étape 3
  ch.push(H("📊 " + C.h.s3, 1, { pageBreak: true }));
  ch.push(H(C.s3.ex1.title, 3)); ch.push(P(C.s3.ex1.a, { bold: true })); ch.push(ans(L.e1a, 1));
  ch.push(P(C.s3.ex1.b, { bold: true, before: 120 })); ch.push(ans(L.e1b, 2)); ch.push(bar(L.e1bBar));
  ch.push(H(C.s3.ex2.title, 3)); ch.push(P(C.s3.ex2.a, { bold: true })); ch.push(ans(L.e2a, 2)); ch.push(bar(L.e2aBar));
  ch.push(P(C.s3.ex2.b, { bold: true, before: 120 })); ch.push(ans(L.e2b, 1)); ch.push(bar(L.e2bBar));
  // Étape 4
  ch.push(H("📈 " + C.h.s4, 1, { pageBreak: true }));
  ch.push(img("courbe_" + lang + ".png", 600, 283));
  const E = T.EXAO.filter(p => [0, 10, 11, 20, 21, 30, 40].includes(p[0]));
  ch.push(table([[FR ? "t (min)" : "t (min)", ...E.map(p => String(p[0]))], [FR ? "O₂ (mg/L)" : "O₂ (mg/L)", ...E.map(p => FR ? String(p[1].toFixed(2)).replace(".", ",") : p[1].toFixed(2))]], [1906, ...E.map(() => 8000 / E.length)], { headBold: true, headFill: "E3F1E6" }));
  ch.push(P(`<i>${L.curveNote}</i>`, { size: 18, color: "4A6150", before: 60 }));
  ch.push(H(C.s4.d, 3)); ch.push(ans(L.desc, 2)); ch.push(bar(L.descBar)); ch.push(P(`<b>${L.obsT}</b> ${L.obs}`, { before: 120 }));
  ch.push(H(C.s4.i, 3)); ch.push(ans(L.interp, 1.5)); ch.push(bar(L.interpBar));
  ch.push(H(C.s4.c, 3)); ch.push(ans(L.concl, 1.5)); ch.push(bar(L.conclBar));
  ch.push(H("🎓 " + C.h.more + " (bonus)", 3)); ch.push(ans(L.bonus));
  ch.push(H(L.errT, 1, { pageBreak: true })); ch.push(table([[L.errCols[0], L.errCols[1]], ...L.err], [W / 2, W / 2], { headBold: true, headFill: "FDEBD5" }));
  ch.push(H(L.limT, 2)); L.lim.forEach(l => ch.push(Bul(l)));
  ch.push(H(L.appT, 2)); L.app.forEach(a => ch.push(Bul(a)));
  if (!FR) dnlKey(ch, C, K);
  return K.build(ch, (FR ? "Corrigé · " : "Answer key · ") + C.meta.title, FR ? "TP élodée · 2nde SVT · Corrigé professeur" : "Elodea lab · DNL Year 10 · Teacher's answer key");
}
function dnlKey(ch, C, K) {
  const { P, H, Bul, table, ans, box, spacer } = K; const N = C.dnl;
  ch.push(H("🎮 Interactive Activities · Answers", 1, { pageBreak: true }));
  ch.push(H(N.tps.title + " (expected ideas)", 3));
  ENK.tps.forEach((t, i) => { ch.push(P(`<b>${i + 1}. ${N.tps.qs[i]}</b>`, { after: 40, keepNext: true })); ch.push(Bul(t)); });
  ch.push(H(N.gap.title, 3)); ch.push(ans(N.gap.sentences.map((sn, i) => `${i + 1}. ` + sn.map(x => typeof x === "number" ? `<b>${N.gap.bank[x]}</b>` : x).join(""))));
  ch.push(H(N.match.title, 3)); ch.push(ans(["1 → C · 2 → A · 3 → B · 4 → E · 5 → D · 6 → G · 7 → H · 8 → F"]));
  ch.push(H(N.challenge.title + " (model answer)", 3)); ch.push(ans([ENK.challenge])); ch.push(P("<i>Accept any description that avoids the four forbidden words and quotes values with units. The app flags forbidden words automatically.</i>", { size: 18 }));
  ch.push(H(N.quiz.title, 3)); ch.push(table([["Question", "Answer"], ...N.quiz.qs.map((q, i) => [`${i + 1}. ${q.q}`, `<b>${"abcd"[q.a]}) ${q.o[q.a]}</b>`])], [W - 3600, 3600], { headBold: true, headFill: "E3F1E6" }));
  ch.push(H(N.exit.title + " and " + N.minute.title + " (models)", 3)); ENK.exit.forEach(e => ch.push(Bul(e)));
  ch.push(H("🗣 Teaching tips for DNL", 2)); ENK.tips.forEach(t => ch.push(Bul(t)));
  ch.push(spacer()); ch.push(box("key", "Final encouragement", [P("Remember: in DNL, the goal is NOT perfect English. The goal is (1) scientific understanding in an English context, (2) building confidence with scientific vocabulary, (3) thinking and problem-solving in another language.", { after: 60 }), P("Your students are doing TWO hard things at once: learning biology AND using English. Celebrate their attempts, not just their accuracy!", { after: 60 }), P("<b>Key phrase to use often:</b> “Don't worry about making mistakes: that's how we learn! I'm more interested in your THINKING than in perfect grammar!”", { after: 0 })]));
}

/* ----- textes des corrigés ----- */
const FRK = {
  bareme: [["Étapes 1 et 2 : hypothèses, prédictions, démarche", "non noté"], ["Exercice 1 : a) 1 pt · b) 2 pts", "3 pts"], ["Exercice 2 : a) 2 pts · b) 1 pt", "3 pts"], ["Étape 4 : description 2 pts · interprétation 1,5 pt · conclusion 1,5 pt", "5 pts"], ["Total", "11 pts"], ["Question bonus", "+ bonus"]],
  prepT: "🛠 Préparation et repères pour l'élodée",
  prep: [
    "<b>Matériel vivant</b> : <i>Elodea canadensis</i> ou <i>Egeria densa</i> (« élodée dense » des animaleries). Garder les rameaux en aquarium <b>éclairé</b> la veille et le matin : photosynthèse active, feuilles bien vertes.",
    "<b>Eau</b> : eau du robinet reposée (déchlorée, à température ambiante) + <b>hydrogénocarbonate de sodium</b>, environ 1 g/L (repère à ajuster). Sans apport de CO₂, la photosynthèse est vite limitée et la hausse d'O₂ reste faible.",
    "<b>Astuce</b> : partir d'une eau moins riche en O₂ (eau bouillie puis refroidie, enrichie ensuite en NaHCO₃) rend la hausse plus nette et retarde l'apparition de bulles.",
    "<b>Quantité</b> : 2 à 3 rameaux d'environ 5 cm. Plus de biomasse donne des variations plus amples.",
    "<b>Lumière</b> : LED blanche à 5–10 cm. Avec une lampe à incandescence, intercaler un écran d'eau : un échauffement diminue la solubilité de l'O₂ et crée une fausse baisse.",
    "<b>Agitation lente</b>, rameaux hors de portée du turbulent ; sonde sans bulle sous la membrane.",
    "<b>Ordres de grandeur</b> (courbe simulée de l'app, à titre de repère) : obscurité ≈ −0,03 mg/L/min ; lumière ≈ +0,1 mg/L/min ; décalage de 1 à 2 min à chaque changement de condition.",
    "<b>Plan B</b> : si une mesure échoue ou pour un élève absent, l'app propose une courbe simulée (onglet 4 · Résultats, « Courbe simulée (secours) »), signalée comme telle."
  ],
  troubleT: "Si la courbe ne réagit pas",
  trouble: ["<b>Pas de hausse à la lumière</b> : CO₂ limitant (ajouter NaHCO₃), lampe trop faible ou trop loin, élodée abîmée ou trop peu de rameaux, eau trop froide.", "<b>Pas de baisse à l'obscurité</b> : respiration faible avec peu de biomasse ; resserrer l'échelle, allonger la phase, ajouter des rameaux.", "<b>Courbe en dents de scie</b> : bulles sur la sonde ou agitation irrégulière."],
  light: ["Lumière nécessaire (+ chlorophylle)", "Pas besoin de lumière : en continu, jour et nuit"],
  h3note: " (si la production dépasse la consommation)",
  predTipT: "À valoriser à l'oral",
  predTip: "Pour l'hypothèse 3, une réponse « O₂ stable ou diminue moins vite à la lumière » est aussi recevable si l'élève la justifie par une lumière faible (production = consommation : point de compensation). Avec la lampe du TP, on attend une augmentation.",
  demT: "Attendus de la démarche du groupe",
  dem: ["Tester les deux conditions, obscurité et lumière, en ne faisant varier qu'un seul facteur : la lumière (mêmes rameaux, même eau, même température).", "Des durées égales et suffisamment longues (≥ 10 min avec l'élodée, qui réagit lentement).", "Commencer à l'obscurité : on mesure d'abord la respiration seule (état de référence).", "Répéter l'alternance pour vérifier que les variations sont reproductibles.", "Interprétation : une hausse d'O₂ traduit une production nette ; une baisse, une consommation nette."],
  e1a: ["L'organite qui change de couleur est le <b>chloroplaste</b>."],
  e1b: ["Après coloration à l'eau iodée, les chloroplastes des cellules placées à la lumière (a) sont colorés en <b>bleu-noir</b>, alors que ceux des cellules placées à l'obscurité (b) restent <b>verts</b>.", "Or l'eau iodée colore l'amidon en bleu-noir. Donc, à la lumière, les chloroplastes contiennent de l'<b>amidon</b> : c'est la molécule synthétisée et mise en réserve <b>dans les chloroplastes</b>, à partir du glucose produit par la photosynthèse. À l'obscurité, pas de photosynthèse, donc pas d'amidon."],
  e1bBar: [["Comparaison des deux couleurs (lumière / obscurité)", 0.5], ["Rôle de l'eau iodée (amidon → bleu-noir)", 0.5], ["Molécule synthétisée : l'amidon", 0.5], ["Localisation dans les chloroplastes, en lien avec la lumière", 0.5]],
  e2a: ["La concentration en glucose du milieu <b>diminue de 15 g/L à 0,5 g/L en 10 min</b> : rapidement au début (−3 g/L la 1re minute), puis plus lentement.", "Les levures, placées en présence de dioxygène, consomment donc le glucose : <b>le glucose est consommé lors de la respiration</b> (c'en est un réactif)."],
  e2aBar: [["Description avec valeurs et unités (début, fin, durée)", 1], ["Déduction : le glucose est consommé par la respiration", 1]],
  e2b: ["La cellule B (milieu aérobie, avec O₂) contient de <b>nombreuses mitochondries bien développées</b> (organites sombres à replis internes), alors que la cellule A (milieu anaérobie) n'en possède presque pas.", "La respiration, qui utilise le dioxygène, se déroule donc <b>dans les mitochondries</b>."],
  e2bBar: [["Comparaison des mitochondries de A et B", 0.5], ["Lieu de la respiration : les mitochondries", 0.5]],
  curveNote: "Valeurs de la courbe simulée de l'app (allure typique). Accepter les valeurs réellement lues par les élèves sur leur propre courbe.",
  desc: ["<b>À l'obscurité</b> (0–10 min et 20–30 min) : la concentration en O₂ dissous <b>diminue lentement et régulièrement</b>, de 8,2 à 7,9 mg/L entre 0 et 10 min, soit environ −0,3 mg/L en 10 min (même allure entre 20 et 30 min, après 1 à 2 min de décalage).", "<b>À la lumière</b> (10–20 min et 30–40 min) : après un court décalage d'environ 1 min, la concentration en O₂ <b>augmente nettement</b>, de 7,9 à 8,9 mg/L entre 10 et 20 min (et de 8,7 à 9,7 mg/L entre 30 et 40 min), soit environ +1 mg/L en 10 min : une variation environ 3 fois plus rapide qu'à l'obscurité."],
  descBar: [["Obscurité : sens de variation", 0.5], ["Obscurité : valeurs chiffrées avec unité et temps", 0.5], ["Lumière : sens de variation", 0.5], ["Lumière : valeurs chiffrées avec unité et temps", 0.5]],
  obsT: "Observation complémentaire (non notée) :", obs: "à la lumière, de petites <b>bulles de gaz</b> se forment sur les feuilles. C'est surtout du dioxygène produit par la photosynthèse, qui s'échappe sous forme de gaz : il n'est pas mesuré par la sonde, donc la production réelle est un peu sous-estimée.",
  interp: ["Quand la quantité d'O₂ augmente, les cellules ☒ <b>produisent de l'O₂</b> → le métabolisme actif est ☒ <b>la photosynthèse</b>.", "Quand la quantité d'O₂ diminue, les cellules ☒ <b>consomment de l'O₂</b> → le métabolisme actif est ☒ <b>la respiration</b>."],
  interpBar: [["Augmentation : production d'O₂ (0,25) + photosynthèse (0,5)", 0.75], ["Diminution : consommation d'O₂ (0,25) + respiration (0,5)", 0.75]],
  concl: ["C'est l'<b>hypothèse 3</b> qui est validée.", "À l'obscurité, l'O₂ diminue : les cellules consomment du dioxygène, elles respirent. L'hypothèse 1 (photosynthèse seule, qui prévoyait un O₂ stable à l'obscurité) est donc rejetée.", "À la lumière, l'O₂ augmente : les cellules produisent du dioxygène, elles réalisent la photosynthèse. L'hypothèse 2 (respiration seule, qui prévoyait une baisse aussi à la lumière) est rejetée.", "Les cellules végétales chlorophylliennes réalisent donc <b>les deux métabolismes</b> : la photosynthèse à la lumière, dans les chloroplastes, et la respiration en permanence, dans les mitochondries."],
  conclBar: [["Rejet argumenté de l'hypothèse 1", 0.5], ["Rejet argumenté de l'hypothèse 2", 0.5], ["Hypothèse 3 validée et réponse à la problématique", 0.5]],
  bonus: ["À la lumière, les deux métabolismes fonctionnent <b>en même temps</b> : la sonde mesure un <b>bilan</b>, O₂ produit par la photosynthèse − O₂ consommé par la respiration.", "Si l'O₂ augmente, la production dépasse la consommation : <b>la photosynthèse est le métabolisme dominant</b> à la lumière.", "Prolongement chiffré : en supposant que la respiration garde la même vitesse à la lumière, la production réelle vaut environ +0,10 + 0,03 ≈ 0,13 mg/L/min."],
  errT: "⚠ Erreurs fréquentes et remédiations", errCols: ["Erreur fréquente", "Remédiation"],
  err: [["« À la lumière, la plante ne respire plus. »", "La respiration est continue (mitochondries) ; à la lumière, la sonde mesure un bilan (question bonus)."], ["Description sans valeurs, sans unité ni temps", "Imposer le modèle « entre … et … min, la concentration passe de … à … mg/L »."], ["Interpréter le décalage de 1–2 min comme un arrêt du métabolisme", "Inertie de la mesure (diffusion du gaz, temps de réponse de la plante et de la sonde)."], ["« La photosynthèse produit de l'amidon » sans lien avec le glucose", "L'amidon est la forme de réserve fabriquée à partir du glucose produit par la photosynthèse."], ["Ex. 2 : conclure seulement « la respiration consomme de l'O₂ »", "C'est exact, mais le doc 1 mesure le glucose : la question porte sur la molécule mesurée."], ["Confondre chloroplaste et mitochondrie", "Chloroplaste : photosynthèse (cellules chlorophylliennes) ; mitochondrie : respiration (toutes les cellules eucaryotes)."]],
  limT: "Limites à discuter à l'oral (esprit critique)",
  lim: ["L'élodée est un organisme <b>pluricellulaire</b> : la mesure est globale et inclut des cellules peu chlorophylliennes (tige), qui ne font que respirer.", "Une partie de l'O₂ produit s'échappe en <b>bulles</b> et n'est pas mesurée.", "La <b>température</b> doit rester constante : l'O₂ est moins soluble dans l'eau chaude.", "Une seule expérience, sans répétition : comparer les courbes des différents groupes."],
  appT: "Lien avec l'app élève",
  app: ["Autocorrigés (score au premier essai) : tableau et prédictions de l'étape 1, questions fermées des exercices 1 et 2, observation des bulles, interprétation, choix de l'hypothèse.", "Réponses rédigées : l'app ne donne pas de modèle, seulement une liste de critères à cocher (auto-évaluation). La copie notée reste la fiche Word.", "Le bilan (téléchargeable ou à montrer) indique le score par étape et le nombre de critères cochés."]
};
const ENK = {
  bareme: [["Steps 1 and 2: hypotheses, predictions, approach", "not graded"], ["Exercise 1: a) 1 pt · b) 2 pts", "3 pts"], ["Exercise 2: a) 2 pts · b) 1 pt", "3 pts"], ["Step 4: description 2 pts · interpretation 1.5 pts · conclusion 1.5 pts", "5 pts"], ["Total", "11 pts"], ["Bonus question", "+ bonus"]],
  prepT: "🛠 Preparation and Elodea benchmarks",
  prep: [
    "<b>Living material</b>: <i>Elodea canadensis</i> or <i>Egeria densa</i> (sold in aquarium shops). Keep the sprigs in a <b>lit</b> aquarium the day before and in the morning: active photosynthesis, bright green leaves.",
    "<b>Water</b>: tap water left to stand (dechlorinated, room temperature) + <b>sodium hydrogen carbonate</b>, about 1 g/L (adjust as needed). Without extra CO₂, photosynthesis is soon limited and the O₂ rise stays small.",
    "<b>Tip</b>: start from water lower in O₂ (boiled then cooled, then enriched with NaHCO₃): the rise is clearer and bubbles appear later.",
    "<b>Amount</b>: 2 or 3 sprigs about 5 cm long. More biomass gives larger changes.",
    "<b>Light</b>: white LED at 5–10 cm. With an incandescent bulb, add a water screen: warming lowers O₂ solubility and creates a false decrease.",
    "<b>Slow stirring</b>, sprigs out of reach of the stir bar; no bubble under the probe membrane.",
    "<b>Orders of magnitude</b> (simulated curve in the app, as a benchmark): darkness ≈ −0.03 mg/L/min; light ≈ +0.1 mg/L/min; 1–2 min lag after each change.",
    "<b>Plan B</b>: if a measurement fails or a student was absent, the app offers a simulated curve (tab 4 · Results, “Simulated curve (back-up)”), clearly flagged."
  ],
  troubleT: "If the curve does not respond",
  trouble: ["<b>No rise in light</b>: CO₂ limiting (add NaHCO₃), lamp too weak or too far, damaged Elodea or too few sprigs, water too cold.", "<b>No fall in darkness</b>: weak respiration with little biomass; zoom in, lengthen the phase, add sprigs.", "<b>Jagged curve</b>: bubbles on the probe or irregular stirring."],
  light: ["Light required (+ chlorophyll)", "No light required: continuous, day and night"],
  h3note: " (if production exceeds consumption)",
  predTipT: "Worth discussing",
  predTip: "For Hypothesis 3, “O₂ stable, or falls more slowly, in light” is also acceptable if justified by dim light (production = consumption: compensation point). With the lab lamp, we expect a rise.",
  demT: "Expected group approach",
  dem: ["Test both conditions, darkness and light, changing only one factor: light (same sprigs, same water, same temperature).", "Equal, long enough durations (≥ 10 min with Elodea, which responds slowly).", "Start in darkness: we first measure respiration alone (baseline).", "Repeat the alternation to check that the changes are reproducible.", "Interpretation: a rise in O₂ means net production; a fall means net consumption."],
  e1a: ["The organelle that changes colour is the <b>chloroplast</b>."],
  e1b: ["After staining with iodine solution, the chloroplasts of the cells placed in light (a) turn <b>blue-black</b>, whereas those of the cells placed in darkness (b) stay <b>green</b>.", "Iodine solution turns starch blue-black. So, in light, the chloroplasts contain <b>starch</b>: it is the molecule synthesised and stored <b>in the chloroplasts</b>, from the glucose produced by photosynthesis. In darkness, there is no photosynthesis, so no starch."],
  e1bBar: [["Comparison of the two colours (light / darkness)", 0.5], ["Role of iodine solution (starch → blue-black)", 0.5], ["Synthesised molecule: starch", 0.5], ["Location in the chloroplasts, linked to light", 0.5]],
  e2a: ["The glucose concentration in the medium <b>falls from 15 g/L to 0.5 g/L in 10 min</b>: quickly at first (−3 g/L in the first minute), then more slowly.", "Yeast cells, placed with oxygen, therefore consume glucose: <b>glucose is consumed during respiration</b> (it is a reactant)."],
  e2aBar: [["Description with values and units (start, end, duration)", 1], ["Deduction: glucose is consumed by respiration", 1]],
  e2b: ["Cell B (aerobic, with O₂) contains <b>many well-developed mitochondria</b> (dark organelles with internal folds), whereas cell A (anaerobic) has almost none.", "Respiration, which uses oxygen, therefore takes place <b>in the mitochondria</b>."],
  e2bBar: [["Comparison of mitochondria in A and B", 0.5], ["Site of respiration: the mitochondria", 0.5]],
  curveNote: "Values from the app's simulated curve (typical pattern). Accept the values students actually read on their own curve.",
  desc: ["<b>In darkness</b> (0–10 min and 20–30 min): the dissolved O₂ concentration <b>falls slowly and steadily</b>, from 8.2 to 7.9 mg/L between 0 and 10 min, about −0.3 mg/L in 10 min (same pattern between 20 and 30 min, after a 1–2 min lag).", "<b>In light</b> (10–20 min and 30–40 min): after a short lag of about 1 min, the O₂ concentration <b>rises clearly</b>, from 7.9 to 8.9 mg/L between 10 and 20 min (and from 8.7 to 9.7 mg/L between 30 and 40 min), about +1 mg/L in 10 min: roughly 3 times faster than in darkness."],
  descBar: [["Darkness: direction of change", 0.5], ["Darkness: values with unit and times", 0.5], ["Light: direction of change", 0.5], ["Light: values with unit and times", 0.5]],
  obsT: "Extra observation (not graded):", obs: "in light, tiny <b>gas bubbles</b> form on the leaves. They are mostly oxygen produced by photosynthesis, escaping as a gas: the probe does not measure it, so real production is slightly underestimated.",
  interp: ["When the O₂ quantity increases, the cells ☒ <b>produce O₂</b> → the active metabolism is ☒ <b>photosynthesis</b>.", "When the O₂ quantity decreases, the cells ☒ <b>consume O₂</b> → the active metabolism is ☒ <b>respiration</b>."],
  interpBar: [["Increase: O₂ production (0.25) + photosynthesis (0.5)", 0.75], ["Decrease: O₂ consumption (0.25) + respiration (0.5)", 0.75]],
  concl: ["<b>Hypothesis 3</b> is validated.", "In darkness, O₂ falls: the cells consume oxygen, they respire. Hypothesis 1 (photosynthesis only, which predicted stable O₂ in darkness) is rejected.", "In light, O₂ rises: the cells produce oxygen, they carry out photosynthesis. Hypothesis 2 (respiration only, which predicted a fall in light too) is rejected.", "Chlorophyll-containing plant cells therefore perform <b>both metabolisms</b>: photosynthesis in light, in the chloroplasts, and respiration all the time, in the mitochondria."],
  conclBar: [["Hypothesis 1 rejected, with evidence", 0.5], ["Hypothesis 2 rejected, with evidence", 0.5], ["Hypothesis 3 validated and main problem answered", 0.5]],
  bonus: ["In light, both metabolisms work <b>at the same time</b>: the probe measures a <b>balance</b>, O₂ produced by photosynthesis − O₂ consumed by respiration.", "If O₂ rises, production exceeds consumption: <b>photosynthesis is the dominant metabolism</b> in light.", "Going further with numbers: assuming respiration keeps the same rate in light, real production is about +0.10 + 0.03 ≈ 0.13 mg/L/min."],
  errT: "⚠ Common errors and remediation", errCols: ["Common error", "Remediation"],
  err: [["“In light, the plant stops respiring.”", "Respiration is continuous (mitochondria); in light, the probe measures a balance (bonus question)."], ["Description with no values, unit or times", "Require the frame “between … and … min, the concentration goes from … to … mg/L”."], ["Reading the 1–2 min lag as the metabolism stopping", "Measurement inertia (gas diffusion, response time of plant and probe)."], ["“Photosynthesis produces starch” with no link to glucose", "Starch is the storage form made from the glucose produced by photosynthesis."], ["Ex. 2: only concluding “respiration consumes O₂”", "True, but Doc 1 measures glucose: the question is about the measured molecule."], ["Confusing chloroplast and mitochondrion", "Chloroplast: photosynthesis (green cells); mitochondrion: respiration (all eukaryotic cells)."]],
  limT: "Limits to discuss orally (critical thinking)",
  lim: ["Elodea is a <b>multicellular</b> organism: the measurement is global and includes poorly green cells (stem) that only respire.", "Part of the O₂ produced escapes as <b>bubbles</b> and is not measured.", "<b>Temperature</b> must stay constant: O₂ is less soluble in warm water.", "A single experiment, without repetition: compare the curves of the different groups."],
  appT: "Link with the student app",
  app: ["Auto-corrected (first-try score): Step 1 table and predictions, closed questions in Exercises 1 and 2, bubble observation, interpretation, choice of hypothesis; Language lab gap-fill, matching and quiz.", "Written answers: the app gives no model answer, only a checklist of criteria (self-assessment). The graded copy remains the Word worksheet.", "The score summary (downloadable or shown on screen) gives the score per step, the self-assessment ticks, and the exit-ticket sentences."],
  tps: ["No photosynthesis without light, but respiration goes on: the plant uses up its reserves (starch, glucose) and O₂; it turns pale and yellow and finally dies if it stays in the dark too long.", "No: photosynthesis needs light energy, captured by chlorophyll. At night, only respiration takes place.", "Chloroplasts make glucose (store energy) only in light; mitochondria release usable energy (ATP) from glucose all the time, day and night, in every cell, including non-green cells such as roots."],
  challenge: "Between 0 and 10 minutes, the oxygen level goes down slowly, from 8.2 to 7.9 mg/L: the cells use up oxygen. About one minute after the lamp is switched on, the level rises quickly, from 7.9 to 8.9 mg/L in ten minutes: the cells release oxygen. When the lamp is off again, the level drops slightly, and it climbs again in the last light phase.",
  exit: ["<b>One thing I learned today is…</b> that plant cells carry out respiration all the time, even in light.", "<b>One question I still have is…</b> does the plant respire faster in light than in darkness?", "<b>Photosynthesis and respiration are different because…</b> photosynthesis produces oxygen and glucose in the chloroplasts and needs light, whereas respiration consumes them in the mitochondria, day and night.", "<b>One-minute paper (model):</b> We measured the dissolved oxygen around Elodea sprigs in darkness and in light. In darkness, oxygen went down because the cells only carried out respiration; in light, oxygen went up because photosynthesis produced more oxygen than respiration used. So plant cells perform both photosynthesis and respiration."],
  tips: ["Display the “Useful language” frames during Step 4: describing a curve is the main language goal of the lesson.", "Run Activity D (forbidden words) right after Step 4: it reuses the curve and forces rephrasing.", "Use the glossary's 🔊 buttons in the app (when available on the iPad) for pronunciation practice.", "Accept answers with grammar mistakes as long as the science is right; reformulate them correctly aloud."]
};

(async () => {
  const jobs = [["TP_Elodee_Fiche_eleve_FR.docx", worksheet("fr")], ["TP_Elodea_DNL_Student_worksheet.docx", worksheet("en")], ["TP_Elodee_Corrige_FR.docx", key("fr")], ["TP_Elodea_DNL_Answer_key.docx", key("en")]];
  for (const [f, doc] of jobs) { fs.writeFileSync(OUT + "/" + f, await Packer.toBuffer(doc)); console.log("ok", f); }
})();
