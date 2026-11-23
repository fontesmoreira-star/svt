/* ===== Moteur « activité notée » (3e SVT) =====
   Consignes et barème → parties validées une seule fois, dans l'ordre → copie rendue.
   Côté élève : ni correction, ni ✓/✗, ni note, même après la remise de la copie.
   Côté professeur : « Espace professeur » (onglet Ma copie, code à 4 chiffres) avec la note détaillée,
   la correction et le décodage du « code de correction » écrit dans chaque copie transmise.

   Contrat de données (fichier *_note_data.js, chargé avant ce moteur) :
     NOTE  = { key, slug, kicker, title, mission?, objectif, regles?: [..], fiche: () => html, ficheTxt: string }
     PARTS = [{ id, tab, title, intro?, docs?: [doc], qs: [question] }]
     doc   = { title, html? | w? (widget WID[w]) | own?: () => html (rappel des réponses de l'élève), sim?, cap? }
     question = { id, t, p (points), lab, help?, doc?, fig?: (W, F, v) => svg, … }
   Types intégrés : choice · rows (multi possible) · num · word · words · gaps · fill · txt · order.
   Un fichier de widgets peut en ajouter (const QX = { type: { html, wire, filled, score, ans, exp, prof? } }).
*/
Store.key = NOTE.key;
const META_KEY = NOTE.key + "-meta";
const SIGN = "Mr Moreira, Vauban Luxembourg";
const PROF_H = 2413666122; /* empreinte du code professeur (le code n'est pas écrit dans la page) */
const DEF = { fs: 21, theme: null, proj: false, view: "consignes", ans: {}, val: {}, w: {}, rendu: null };
let S = Store.load(DEF);
["ans", "val", "w"].forEach(k => { if (!S[k] || typeof S[k] !== "object") S[k] = {}; });
const save = () => Store.save(S);
const meta = () => { try { return JSON.parse(localStorage.getItem(META_KEY) || "{}") || {}; } catch (e) { return {}; } };
const setMeta = m => { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) {} };
const rnd = x => Math.round(x * 100) / 100;
const pts = v => String(rnd(v)).replace(".", ",");
const plain = s => { const d = document.createElement("div"); d.innerHTML = String(s); return d.textContent.replace(/[  ]/g, " ").replace(/\s+/g, " ").trim(); };
const nrm = x => String(x || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe").replace(/[’'`\-]/g, " ").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const any = (n, ...re) => re.some(r => r.test(n));
const hm = d => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const dmy = d => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const MINTXT = 40;
const eleve = () => { try { return localStorage.getItem(Store.key + "-eleve") || ""; } catch (e) { return ""; } };

/* ---------- types de questions intégrés ---------- */
/* chaque type : html(q, v, ro) · wire(box, q, ctx) · filled(q, v) · score(q, v) · ans(q, v) (texte brut) · exp(q) (texte brut) · prof?(q, v) (html) */
const okWord = (val, q) => { const r = fuzzy(val, q.ans); return !!r.ok && !(q.no && fuzzy(val, q.no).ok); };
const QB = {
  choice: {
    html: (q, v) => `<div class="opts" role="radiogroup" aria-labelledby="L-${q.id}">${q.o.map((o, j) => `<button type="button" class="opt" role="radio" aria-checked="${v === j}" data-j="${j}"><span class="k">${"ABCDE"[j]}</span><span>${o}</span></button>`).join("")}</div>`,
    wire: (box, q, ctx) => $$("[data-j]", box).forEach(b => b.onclick = () => { ctx.set(+b.dataset.j, true); ctx.focus(`[data-j="${b.dataset.j}"]`); }),
    filled: (q, v) => v !== undefined && v !== null,
    score: (q, v) => v === q.a ? q.p : 0,
    ans: (q, v) => v === undefined || v === null ? "—" : plain(q.o[v]),
    exp: q => plain(q.o[q.a])
  },
  rows: {
    html: (q, v) => `<div class="rows">${q.rows.map((r, i) => { const cur = (v || {})[i]; return `<div class="rowq"><span class="rt">${r.txt}</span><div class="seg" role="group" aria-label="${esc(plain(r.txt))}">${(r.o || q.choices).map((c, j) => { const on = q.multi ? Array.isArray(cur) && cur.includes(j) : cur === j; return `<button type="button" aria-pressed="${on}" data-i="${i}" data-j="${j}">${c}</button>`; }).join("")}</div></div>`; }).join("")}</div>`,
    wire: (box, q, ctx) => $$("[data-i]", box).forEach(b => b.onclick = () => {
      const i = +b.dataset.i, j = +b.dataset.j, cur = Object.assign({}, ctx.get() || {});
      if (q.multi) { const a = Array.isArray(cur[i]) ? cur[i].slice() : []; const k = a.indexOf(j); if (k >= 0) a.splice(k, 1); else a.push(j); cur[i] = a; } else cur[i] = j;
      ctx.set(cur, true); ctx.focus(`[data-i="${i}"][data-j="${j}"]`);
    }),
    filled: (q, v) => !!v && q.rows.every((r, i) => q.multi ? Array.isArray(v[i]) && v[i].length > 0 : v[i] !== undefined),
    rowOk: (q, r, x) => q.multi ? Array.isArray(x) && x.slice().sort().join() === r.a.slice().sort().join() : x === r.a,
    score: (q, v) => v ? q.rows.filter((r, i) => QB.rows.rowOk(q, r, v[i])).length * q.pr : 0,
    cell: (q, r, x) => { const L = r.o || q.choices; if (q.multi) return Array.isArray(x) && x.length ? x.slice().sort().map(j => plain(L[j])).join(" ou ") : "—"; return x === undefined ? "—" : plain(L[x]); },
    ans: (q, v) => q.rows.map((r, i) => `${plain(r.txt)} : ${QB.rows.cell(q, r, (v || {})[i])}`).join(" · "),
    exp: q => q.rows.map(r => `${plain(r.txt)} : ${QB.rows.cell(q, r, r.a)}`).join(" · "),
    prof: (q, v) => `<ul class="ul">${q.rows.map((r, i) => { const x = (v || {})[i], ok = QB.rows.rowOk(q, r, x); return `<li>${ok ? "✓" : "✗"} ${r.txt} : <b>${esc(QB.rows.cell(q, r, x))}</b>${ok ? "" : ` <span class="muted">(attendu : ${esc(QB.rows.cell(q, r, r.a))})</span>`} · ${pts(ok ? q.pr : 0)} / ${pts(q.pr)}</li>`; }).join("")}</ul>`
  },
  num: {
    html: (q, v) => `<div class="row"><input id="I-${q.id}" class="inp" inputmode="decimal" autocomplete="off" aria-labelledby="L-${q.id}" value="${esc(v || "")}"><span class="unit">${q.unit || ""}</span></div>`,
    wire: (box, q, ctx) => { const i = $("input", box); i.addEventListener("input", () => ctx.set(i.value, false)); },
    filled: (q, v) => String(v || "").trim() !== "",
    val: (q, v) => { let x = parseNum(v); if (!Number.isFinite(x)) x = parseNum(String(v || "").replace(/[a-zA-Zéèàù\s]+$/, "")); if (!Number.isFinite(x)) { const w = ({ un: 1, deux: 2, trois: 3, quatre: 4, six: 6, huit: 8 })[normTxt(v)]; if (w !== undefined) x = w; } return x; },
    score: (q, v) => near(QB.num.val(q, v), q.ans, q.tol || 0, 0) ? q.p : 0,
    ans: (q, v) => String(v || "").trim() ? `${String(v).trim()}${q.unit && !/[a-z]/i.test(String(v)) ? " " + q.unit : ""}` : "—",
    exp: q => `${String(q.ans).replace(".", ",")} ${q.unit || ""}${q.tol ? ` (± ${String(q.tol).replace(".", ",")})` : ""}`.trim()
  },
  word: {
    html: (q, v) => `<div class="row"><input class="inp wide" autocomplete="off" autocapitalize="off" spellcheck="false" aria-labelledby="L-${q.id}" value="${esc(v || "")}" style="max-width:22rem"></div>`,
    wire: (box, q, ctx) => { const i = $("input", box); i.addEventListener("input", () => ctx.set(i.value, false)); },
    filled: (q, v) => String(v || "").trim() !== "",
    score: (q, v) => okWord(v, q) ? q.p : 0,
    ans: (q, v) => String(v || "").trim() || "—",
    exp: q => q.ans[0]
  },
  /* plusieurs mots à écrire, chacun sous une image (items: [{ fig, ans, no }]) */
  words: {
    html: (q, v) => `<div class="wcards">${q.items.map((it, i) => `<div class="wcard"><div class="wfig">${it.fig}</div><label class="wlab"><span>Image ${i + 1}</span><input class="inp" data-w="${i}" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc((v || {})[i] || "")}"></label></div>`).join("")}</div>`,
    wire: (box, q, ctx) => $$("[data-w]", box).forEach(inp => inp.addEventListener("input", () => { const cur = Object.assign({}, ctx.get() || {}); cur[+inp.dataset.w] = inp.value; ctx.set(cur, false); })),
    filled: (q, v) => !!v && q.items.every((it, i) => String(v[i] || "").trim() !== ""),
    score: (q, v) => v ? q.items.filter((it, i) => okWord(v[i], it)).length * q.pr : 0,
    ans: (q, v) => q.items.map((it, i) => `image ${i + 1} : ${String((v || {})[i] || "").trim() || "—"}`).join(" · "),
    exp: q => q.items.map((it, i) => `image ${i + 1} : ${it.ans[0]}`).join(" · "),
    prof: (q, v) => `<div class="wcards">${q.items.map((it, i) => { const x = String((v || {})[i] || "").trim(), ok = okWord(x, it); return `<div class="wcard"><div class="wfig">${it.fig}</div><p>${ok ? "✓" : "✗"} <b>${esc(x || "—")}</b>${ok ? "" : ` <span class="muted">(attendu : ${it.ans[0]})</span>`}</p></div>`; }).join("")}</div>`
  },
  /* texte à trous à écrire (segs: [texte | { k, ans, no }]) */
  gaps: {
    html: (q, v) => { let n = 0; return `<p class="filltext">${q.segs.map(s => typeof s === "string" ? s : `<input class="inp gapin" data-g="${s.k}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Mot manquant n°${++n}" value="${esc((v || {})[s.k] || "")}">`).join("")}</p>`; },
    wire: (box, q, ctx) => $$("[data-g]", box).forEach(inp => inp.addEventListener("input", () => { const cur = Object.assign({}, ctx.get() || {}); cur[inp.dataset.g] = inp.value; ctx.set(cur, false); })),
    G: q => q.segs.filter(s => typeof s !== "string"),
    filled: (q, v) => !!v && QB.gaps.G(q).every(s => String(v[s.k] || "").trim() !== ""),
    score: (q, v) => v ? QB.gaps.G(q).filter(s => okWord(v[s.k], s)).length * q.pr : 0,
    txt: (q, f) => plain(q.segs.map(s => typeof s === "string" ? s.replace(/<br>/g, " ") : `[${f(s)}]`).join("")),
    ans: (q, v) => QB.gaps.txt(q, s => String((v || {})[s.k] || "").trim() || "…"),
    exp: q => QB.gaps.txt(q, s => s.ans[0]),
    prof: (q, v) => `<p class="filltext">${q.segs.map(s => { if (typeof s === "string") return s; const x = String((v || {})[s.k] || "").trim(), ok = okWord(x, s); return `<span class="gapr ${ok ? "ok" : "bad"}">${ok ? "✓" : "✗"} ${esc(x || "…")}${ok ? "" : ` <small>(${s.ans[0]})</small>`}</span>`; }).join("")}</p>`
  },
  /* texte à trous avec banque de mots (segs: [texte | { k }], bank, ok(v) → { k: bool }) */
  fill: {
    act: {},
    first: (q, v) => (q.segs.find(s => typeof s !== "string" && (v || {})[s.k] === undefined) || {}).k || null,
    html: (q, v, ro) => {
      v = v || {}; let act = QB.fill.act[q.id]; if (!act || v[act] !== undefined) act = QB.fill.first(q, v);
      const used = Object.values(v);
      const slot = s => { const w = v[s.k] !== undefined ? q.bank[v[s.k]] : null; return `<button type="button" class="blank${act === s.k && !ro ? " active" : ""}${w ? " filled" : ""}" data-slot="${s.k}" ${ro ? "disabled" : ""} aria-label="${w ? "Case remplie : " + esc(w) + (ro ? "" : ". Toucher pour la vider.") : "Case vide" + (ro ? "" : ". Toucher pour la choisir.")}">${w ? esc(w) : "……"}</button>`; };
      return `<p class="filltext">${q.segs.map(s => typeof s === "string" ? s : slot(s)).join("")}</p>` + (ro ? "" : `<div class="bank" role="group" aria-label="Mots à placer"><p class="cap">${nb("Touche une case, puis le mot qui convient. Chaque étiquette ne sert qu'une fois.")}</p><div class="bankw">${q.bank.map((w, i) => `<button type="button" class="bword" data-word="${i}" ${used.includes(i) ? "disabled" : ""}>${esc(w)}</button>`).join("")}</div></div>`);
    },
    wire: (box, q, ctx) => {
      $$("[data-slot]", box).forEach(b => b.onclick = () => { const v = Object.assign({}, ctx.get() || {}), k = b.dataset.slot; delete v[k]; QB.fill.act[q.id] = k; ctx.set(v, true); ctx.focus(`[data-slot="${k}"]`); });
      $$("[data-word]", box).forEach(b => b.onclick = () => { const v = Object.assign({}, ctx.get() || {}); let k = QB.fill.act[q.id]; if (!k || v[k] !== undefined) k = QB.fill.first(q, v); if (!k) return; v[k] = +b.dataset.word; QB.fill.act[q.id] = QB.fill.first(q, v); ctx.set(v, true); ctx.focus(QB.fill.act[q.id] ? `[data-slot="${QB.fill.act[q.id]}"]` : `[data-slot="${k}"]`); });
    },
    K: q => q.segs.filter(s => typeof s !== "string").map(s => s.k),
    filled: (q, v) => !!v && QB.fill.K(q).every(k => v[k] !== undefined),
    word: (q, v, k) => v && v[k] !== undefined ? q.bank[v[k]] : undefined,
    oks: (q, v) => { const w = {}; QB.fill.K(q).forEach(k => w[k] = QB.fill.word(q, v, k)); return q.ok(w); },
    score: (q, v) => { const o = QB.fill.oks(q, v || {}); return QB.fill.K(q).filter(k => o[k]).length * q.pr; },
    txt: (q, f) => plain(q.segs.map(s => typeof s === "string" ? s.replace(/<br>/g, " ") : `[${f(s.k)}]`).join("")),
    ans: (q, v) => QB.fill.txt(q, k => QB.fill.word(q, v, k) || "…"),
    exp: q => QB.fill.txt(q, k => q.sol[k]),
    prof: (q, v) => { const o = QB.fill.oks(q, v || {}); return `<p class="filltext">${q.segs.map(s => { if (typeof s === "string") return s; const w = QB.fill.word(q, v, s.k), ok = o[s.k]; return `<span class="gapr ${ok ? "ok" : "bad"}">${ok ? "✓" : "✗"} ${esc(w || "…")}${ok ? "" : ` <small>(${q.sol[s.k]})</small>`}</span>`; }).join("")}</p>`; }
  },
  /* réponse rédigée, notée par éléments attendus (crit: [{ lab, p, f(n) }], model) */
  txt: {
    html: (q, v) => `<textarea class="inp" aria-labelledby="L-${q.id}" placeholder="${esc(q.ph || "Rédige ta réponse en phrases complètes…")}" style="min-height:8rem">${esc(v || "")}</textarea><p class="cap" data-cnt></p>`,
    wire: (box, q, ctx) => { const ta = $("textarea", box), c = $("[data-cnt]", box), mn = q.min || MINTXT; const cnt = () => { const L = ta.value.trim().length; c.textContent = `${L} caractères${L < mn ? ` (au moins ${mn})` : ""}`; }; ta.addEventListener("input", () => { ctx.set(ta.value, false); cnt(); }); cnt(); },
    filled: (q, v) => String(v || "").trim().length >= (q.min || MINTXT),
    res: (q, v) => { const n = nrm(v); return q.crit.map(c => !!n && !!c.f(n)); },
    score: (q, v) => QB.txt.res(q, v).reduce((s, x, i) => s + (x ? q.crit[i].p : 0), 0),
    ans: (q, v) => String(v || "").trim() || "—",
    exp: q => plain(q.model),
    prof: (q, v) => { const r = QB.txt.res(q, v); return `<p class="quote">« ${esc(String(v || "").trim() || "—")} »</p><ul class="ul">${q.crit.map((c, i) => `<li>${r[i] ? "✓ présent" : "✗ absent"} (${pts(c.p)} pt) : ${c.lab}</li>`).join("")}</ul><p class="cap">${nb("Repérage automatique par mots-clés : relisez la réponse et ajustez si besoin.")}</p><p><b>Exemple de réponse :</b> ${q.model}</p>`; }
  },
  /* remettre des images dans l'ordre (keys, alts, th(key) → html, pos : rangs notés, pr) */
  order: {
    ord: q => { const n = q.keys.length, base = Array.from({ length: n }, (_, i) => i); let h = 7; for (const c of q.id) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff; let r = shuffle(base, h); if (r.every((x, i) => x === i)) r = r.reverse(); return r; },
    html: (q, v) => { const ch = v || []; return `<div class="order-list pics">${QB.order.ord(q).map(j => { const pos = ch.indexOf(j); return `<button type="button" class="order-item" data-j="${j}" ${pos >= 0 ? `data-pos="${pos + 1}"` : ""} aria-label="${esc(q.alts[j])}${pos >= 0 ? ", placée en position " + (pos + 1) : ""}"><span class="n">${pos >= 0 ? pos + 1 : ""}</span><span class="th">${q.th(q.keys[j])}</span></button>`; }).join("")}</div><div class="row"><button type="button" class="btn ghost" data-clear>Effacer l'ordre</button><span class="cap">Touche une image placée pour la retirer.</span></div>`; },
    wire: (box, q, ctx) => { $$(".order-item", box).forEach(b => b.onclick = () => { const cur = (ctx.get() || []).slice(), j = +b.dataset.j, i = cur.indexOf(j); if (i >= 0) cur.splice(i, 1); else cur.push(j); ctx.set(cur, true); ctx.focus(`[data-j="${j}"]`); }); $("[data-clear]", box).onclick = () => ctx.set([], true); },
    filled: (q, v) => Array.isArray(v) && v.length === q.keys.length,
    score: (q, v) => Array.isArray(v) ? q.pos.filter(i => v[i] === i).length * q.pr : 0,
    ans: (q, v) => Array.isArray(v) && v.length ? v.map(j => q.alts[j]).join(" → ") : "—",
    exp: q => q.alts.join(" → "),
    prof: (q, v) => `<ol class="ul">${(v || []).map((j, i) => `<li>${q.pos.includes(i) ? (j === i ? "✓ " : "✗ ") : ""}${esc(q.alts[j])}${q.pos.includes(i) && j !== i ? ` <span class="muted">(attendu : ${q.alts[i]})</span>` : ""}</li>`).join("")}</ol><p class="cap">${nb(`Rangs notés : ${q.pos.map(i => i + 1).join(", ")} (${pts(q.pr)} pt chacun).`)}</p>`
  }
};
const QT = Object.assign({}, QB, typeof QX === "undefined" ? {} : QX);

/* ---------- barème ---------- */
const QS = [];
PARTS.forEach((P, pi) => { P.n = pi + 1; P.qs.forEach(q => { q.part = P; q.num = QS.length + 1; QS.push(q); }); P.max = rnd(P.qs.reduce((s, q) => s + q.p, 0)); });
const TOTAL = rnd(QS.reduce((s, q) => s + q.p, 0));
const qScore = (q, v) => { try { return rnd(QT[q.t].score(q, v === undefined ? S.ans[q.id] : v) || 0); } catch (e) { return 0; } };
const partScore = (P, vals) => rnd(P.qs.reduce((s, q) => s + (vals ? vals[q.num - 1] : qScore(q)), 0));
const total = vals => rnd(PARTS.reduce((s, P) => s + partScore(P, vals), 0));
const partOK = P => !!S.val[P.id];
const prevOK = P => P.n === 1 || partOK(PARTS[P.n - 2]);
const allVal = () => PARTS.every(partOK);

/* ---------- code de correction : la note de chaque question, brouillée, dans la copie transmise ---------- */
const ALPH = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const h32 = s => { let h = 0x811c9dc5; for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; };
const rng = seed => { let x = (seed >>> 0) || 0x9e3779b9; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x & 31; }; };
function encode(vals) {
  const s0 = Math.floor(Math.random() * 1024), r = rng(h32(NOTE.key + "|" + s0)); let sum = s0 & 31;
  const body = vals.map((x, i) => { const v = Math.round(x * 4); sum = (sum + v * (i + 7)) & 31; return ALPH[(v + r()) & 31]; });
  return (ALPH[s0 >> 5] + ALPH[s0 & 31] + body.join("") + ALPH[(sum + r()) & 31]).match(/.{1,4}/g).join("-");
}
function decode(str) {
  const c = String(str || "").toUpperCase().replace(/[^0-9A-Z]/g, ""), idx = ch => ALPH.indexOf(ch);
  if (c.length !== QS.length + 3 || [...c].some(ch => idx(ch) < 0)) return null;
  const s0 = idx(c[0]) * 32 + idx(c[1]), r = rng(h32(NOTE.key + "|" + s0)); let sum = s0 & 31;
  const vals = [...c.slice(2, -1)].map((ch, i) => { const v = (idx(ch) - r()) & 31; sum = (sum + v * (i + 7)) & 31; return v; });
  if (idx(c[c.length - 1]) !== ((sum + r()) & 31)) return null;
  if (vals.some((v, i) => v > QS[i].p * 4)) return null;
  return vals.map(v => v / 4);
}

/* ---------- documents et questions ---------- */
function docHTML(d) {
  return `<figure class="doc" style="margin:0"><figcaption class="dh"><span>${d.title}</span>${d.sim ? `<span class="sim">⚠ ${d.sim}</span>` : ""}</figcaption><div class="db">${d.html || ""}${d.own ? d.own() : ""}${d.w ? `<div data-wid="${d.w}"></div>` : ""}${d.cap ? `<p class="cap">${d.cap}</p>` : ""}</div></figure>`;
}
function mountWidgets(root) { $$("[data-wid]", root).forEach(el => { if (el.dataset.mounted) return; el.dataset.mounted = "1"; WID[el.dataset.wid](el); }); }
const qShell = q => `<div class="panel q" id="q-${q.id}"><p class="ql" id="L-${q.id}"><span class="cn">${q.num}</span> ${q.lab} <span class="ctag">${pts(q.p)} pt${q.t === "txt" ? " · réponse rédigée" : ""}</span></p>${q.help ? `<p class="cap">${q.help}</p>` : ""}${q.doc ? docHTML(q.doc) : ""}${q.fig ? `<div class="figbox" data-qfig></div>` : ""}<div class="qb"></div></div>`;
const FIGS = {}; let EDIT = null;
function paintQ(q) {
  const host = $("#q-" + q.id); if (!host) return; const box = $(".qb", host);
  box.innerHTML = QT[q.t].html(q, S.ans[q.id], false);
  const ctx = {
    get: () => S.ans[q.id],
    set: (v, re) => { S.ans[q.id] = v; save(); if (re) paintQ(q); if (EDIT) EDIT(); if (FIGS[q.id]) FIGS[q.id].draw(); },
    focus: sel => { const n = $(".qb " + sel, host); if (n) n.focus({ preventScroll: true }); }
  };
  QT[q.t].wire(box, q, ctx);
}

/* ---------- navigation ---------- */
const VIEWS = ["consignes", ...PARTS.map(P => P.id), "copie"];
function tabs() {
  $("#tabs").innerHTML = VIEWS.map(v => {
    const P = PARTS.find(x => x.id === v), lab = v === "consignes" ? "Consignes" : v === "copie" ? "Ma copie" : `${P.n} · ${P.tab}`;
    const st = v === "copie" ? (S.rendu ? "✓ rendue" : "") : P ? (partOK(P) ? "✓" : prevOK(P) ? "" : "🔒") : "";
    const al = st === "🔒" ? "verrouillée" : v === "copie" ? "copie rendue" : "partie validée";
    return `<button class="tab" type="button" data-v="${v}" ${S.view === v ? 'aria-current="page"' : ""}>${lab}${st ? `<span class="dot" aria-label="${al}">${st}</span>` : ""}</button>`;
  }).join("");
  $$("#tabs .tab").forEach(b => b.onclick = () => go(b.dataset.v));
}
function go(v, noScroll) {
  if (!VIEWS.includes(v)) v = "consignes"; S.view = v; save(); tabs();
  if (location.hash !== "#" + v) { try { history.replaceState(null, "", "#" + v); } catch (e) {} }
  const m = $("#main");
  if (v === "consignes") renderConsignes(m); else if (v === "copie") renderCopie(m); else renderPart(m, PARTS.find(P => P.id === v));
  if (!noScroll) window.scrollTo(0, 0);
  const c = $("#tabs [aria-current]"); if (c && c.scrollIntoView) c.scrollIntoView({ block: "nearest", inline: "center" });
}
const nextBtn = (v, t) => `<div class="row"><button type="button" class="btn" data-next="${v}">${t}</button></div>`;
const wireNext = m => $$("[data-next]", m).forEach(b => b.onclick = () => go(b.dataset.next));

/* ---------- consignes ---------- */
function renderConsignes(m) {
  m.innerHTML = `<section class="view">
    <div class="panel"><p class="kicker">${NOTE.kicker}</p><h2 class="sec-title">${NOTE.title}</h2>
      ${NOTE.mission ? `<p class="lead">${NOTE.mission}</p>` : ""}
      <div class="box info"><p class="lab">ℹ Objectif</p><p>${NOTE.objectif}</p></div></div>
    <div class="panel"><h3>Barème</h3>${tbl(["Partie", "Points"], [...PARTS.map(P => [`Partie ${P.n} · ${P.title}`, pts(P.max)]), ["<b>Total</b>", `<b>${pts(TOTAL)}</b>`]])}
      <p class="cap">${nb("Les points de chaque question sont indiqués à côté de la question. Les réponses rédigées sont notées sur les éléments attendus, puis relues par le professeur.")}</p></div>
    <div class="box warn"><p class="lab">⚠ Règles de l'activité notée</p><ul class="ul">
      <li>${nb("Les parties se font <b>dans l'ordre</b>. Chaque partie se valide <b>une seule fois</b> : relis-toi avant de valider.")}</li>
      <li>${nb("Une partie validée se ferme : ses documents et tes réponses ne s'affichent plus.")}</li>
      <li>${nb("<b>Aucune correction et aucune note ne s'affichent</b>, même après la remise de ta copie : ton professeur te communiquera ta note.")}</li>
      <li>${nb("Rédige des phrases complètes, avec le vocabulaire du cours.")}</li>
      ${(NOTE.regles || []).map(r => `<li>${nb(r)}</li>`).join("")}
      <li>${nb("Quand toutes les parties sont validées, rends ta copie dans l'onglet « Ma copie », puis transmets-la comme ton professeur te l'a demandé.")}</li></ul></div>
    ${nextBtn(PARTS[0].id, "Commencer la partie 1 →")}</section>`;
  wireNext(m);
}

/* ---------- une partie ---------- */
function renderPart(m, P) {
  const nextV = P.n < PARTS.length ? PARTS[P.n].id : "copie";
  let h = `<section class="view"><div><p class="kicker">Partie ${P.n} · ${pts(P.max)} point${P.max > 1 ? "s" : ""}</p><h2 class="sec-title">${nb(P.title)}</h2>${P.intro && prevOK(P) && !partOK(P) ? `<p class="lead">${P.intro}</p>` : ""}</div>`;
  if (!prevOK(P)) h += `<p class="locked">🔒 ${nb(`Valide d'abord la partie ${P.n - 1} : cette partie se débloque ensuite.`)}</p>${nextBtn(PARTS[P.n - 2].id, `← Partie ${P.n - 1}`)}`;
  else if (partOK(P)) h += `<div class="fb neutral"><p class="h">✓ ${nb(`Partie ${P.n} validée à ${hm(S.val[P.id])}.`)}</p><p>${nb("Tes réponses sont enregistrées dans ta copie : tu ne peux plus les modifier. La correction ne s'affiche pas.")}</p></div>${nextBtn(nextV, nextV === "copie" ? "Ma copie →" : `Partie ${P.n + 1} →`)}`;
  else h += (P.docs || []).map(docHTML).join("") + P.qs.map(qShell).join("") +
    `<div class="panel"><p class="cap">${nb(`Avant de valider : relis tes ${P.qs.length > 1 ? `${P.qs.length} réponses` : "réponse"}. Après validation, la partie ${P.n} se ferme.`)}</p><div class="row acts"><button type="button" class="btn" id="valBtn">Valider la partie ${P.n}</button></div><div id="vmsg" aria-live="polite"></div></div>`;
  m.innerHTML = h + "</section>";
  wireNext(m);
  if (!prevOK(P) || partOK(P)) return;
  mountWidgets(m);
  P.qs.forEach(q => { if (q.fig) FIGS[q.id] = liveSVG($(`#q-${q.id} [data-qfig]`, m), (W, F) => q.fig(W, F, S.ans[q.id])); paintQ(q); });
  const vb = $("#valBtn", m), msg = $("#vmsg", m); let armed = null;
  const disarm = () => { if (armed) clearTimeout(armed); armed = null; vb.textContent = `Valider la partie ${P.n}`; vb.classList.remove("warn"); };
  EDIT = () => { if (armed || msg.innerHTML) { disarm(); msg.innerHTML = ""; } };
  vb.onclick = () => {
    const miss = P.qs.filter(q => !QT[q.t].filled(q, S.ans[q.id]));
    if (miss.length) {
      disarm();
      const tx = miss.filter(q => q.t === "txt");
      msg.innerHTML = `<div class="fb neutral"><p class="h">${nb(`Il manque ${miss.length > 1 ? "les réponses aux questions" : "la réponse à la question"} ${miss.map(q => q.num).join(", ")}.`)}</p>${tx.length ? `<p>${nb(`Réponse rédigée : au moins ${tx[0].min || MINTXT} caractères.`)}</p>` : ""}</div>`;
      const f = $("#q-" + miss[0].id); if (f && f.scrollIntoView) f.scrollIntoView({ block: "start", behavior: "smooth" });
      return;
    }
    if (!armed) { vb.textContent = "Confirmer : je ne pourrai plus modifier"; vb.classList.add("warn"); msg.innerHTML = `<div class="fb neutral"><p class="h">${nb("Toutes les questions sont remplies.")}</p><p>${nb("Touche de nouveau le bouton pour valider définitivement cette partie.")}</p></div>`; armed = setTimeout(() => { disarm(); msg.innerHTML = ""; }, 6000); return; }
    disarm(); S.val[P.id] = Date.now(); save(); go(P.id);
  };
}

/* ---------- la copie ---------- */
function answersHTML() {
  return PARTS.map(P => `<div class="field"><b>${nb(`Partie ${P.n} · ${P.title}`)}</b><ul class="ul">${P.qs.map(q => `<li><b>${q.num}.</b> ${plain(q.lab)}<br><span class="muted">→ ${esc(QT[q.t].ans(q, S.ans[q.id]))}</span></li>`).join("")}</ul></div>`).join("");
}
function copyText(name) {
  const R = S.rendu, M = meta();
  let t = `${plain(NOTE.kicker).toUpperCase()}\n${plain(NOTE.title)}\n3e SVT\n\nÉlève : ${name || "—"}\n`;
  t += R ? `Copie rendue le ${dmy(R.t)} à ${hm(R.t)}\nCopies rendues sur cet appareil : ${M.n || R.n}${M.eff ? ` · copie recommencée ${M.eff} fois` : ""}\nCode de correction (professeur) : ${R.code}\n` : "Copie pas encore rendue.\n";
  PARTS.forEach(P => { t += `\nPartie ${P.n} · ${plain(P.title)} (/${pts(P.max)})\n`; P.qs.forEach(q => { t += `${q.num}. ${plain(q.lab)} (${pts(q.p)} pt)\n   → ${QT[q.t].ans(q, S.ans[q.id])}\n`; }); });
  return t + `\n${SIGN}\n`;
}
function renderCopie(m) {
  const R = S.rendu, M = meta();
  m.innerHTML = `<section class="view"><div><p class="kicker">Ma copie</p><h2 class="sec-title">${R ? "Copie rendue" : "Rendre ma copie"}</h2></div>
    ${R ? `<div class="fb neutral"><p class="h">✓ ${nb(`Copie rendue le ${dmy(R.t)} à ${hm(R.t)}.`)}</p><p>${nb("Ta copie est enregistrée et ne peut plus être modifiée. Ta note et la correction te seront communiquées par ton professeur.")}</p></div>
      <div class="panel"><h3>Transmettre ma copie</h3><p class="cap">${nb("Écris ton prénom ou ton numéro, puis transmets ta copie comme ton professeur te l'a demandé.")}</p><div id="bt"></div></div>
      <details class="panel recap"><summary>${nb("Relire mes réponses")}</summary>${answersHTML()}</details>`
    : `<div class="panel"><h3>Où en es-tu ?</h3><ul class="inds">${PARTS.map(P => `<li class="${partOK(P) ? "done" : ""}"><span class="bx" aria-hidden="true">${partOK(P) ? "✓" : ""}</span><span>${nb(`Partie ${P.n} · ${P.title}`)} <span class="st">${partOK(P) ? `✓ validée à ${hm(S.val[P.id])}` : "à valider"}</span></span></li>`).join("")}</ul>
      ${allVal() ? `<p class="lead">${nb("Tout est validé. Une fois rendue, ta copie ne peut plus être modifiée. Ni la note ni la correction ne s'affichent : ton professeur te les communiquera.")}</p><div class="row"><button type="button" class="btn" id="rendre">📝 Rendre ma copie</button></div>` : `<p class="locked">🔒 ${nb(`Valide les ${PARTS.length} parties pour pouvoir rendre ta copie.`)}</p>`}</div>`}
    ${R ? "" : `<div class="panel"><h3>Recommencer</h3><p class="cap">${nb("Efface toutes tes réponses sur cet appareil. Ton professeur voit combien de fois la copie a été recommencée.")}</p><div class="row"><button class="btn ghost" type="button" id="reset">Tout effacer</button></div></div>`}
    <div class="panel prof" id="prof"></div></section>`;
  const r = $("#rendre", m); if (r) armButton(r, "📝 Rendre ma copie", "Confirmer la remise de ma copie", () => { const M2 = meta(); M2.n = (M2.n || 0) + 1; setMeta(M2); S.rendu = { t: Date.now(), n: M2.n, code: encode(QS.map(q => qScore(q))) }; save(); tabs(); renderCopie(m); window.scrollTo(0, 0); });
  if (R) renderBilanTools($("#bt", m), copyText, name => `<p class="kicker">${NOTE.kicker} · copie à montrer au professeur</p><h2>${esc(name || "Élève")}</h2><p>${nb(`Copie rendue le ${dmy(R.t)} à ${hm(R.t)}`)}</p>
    <div class="line"><span>Parties validées</span><b class="num">${PARTS.filter(partOK).length} / ${PARTS.length}</b></div>
    <div class="line"><span>Copies rendues sur cet appareil</span><b class="num">${M.n || R.n}</b></div>${M.eff ? `<div class="line"><span>Copie recommencée</span><b class="num">${M.eff} fois</b></div>` : ""}
    <div class="line"><span>Code de correction</span><b class="code">${R.code}</b></div>
    <p class="cap">${nb("Professeur : la note s'affiche dans l'espace professeur (onglet « Ma copie »).")}</p>`, NOTE.slug);
  const rs = $("#reset", m); if (rs) armButton(rs, "Tout effacer", "Confirmer l'effacement ?", () => { const M2 = meta(); M2.eff = (M2.eff || 0) + 1; setMeta(M2); wipe(); go("consignes"); });
  renderProf($("#prof", m));
}
function wipe() { S.ans = {}; S.val = {}; S.w = {}; S.rendu = null; save(); }

/* ---------- espace professeur ---------- */
let PROF = false;
const chipCls = (s, p) => s >= p ? "ok" : s > 0 ? "mid" : "bad";
function profQ(q) {
  const v = S.ans[q.id], sc = qScore(q), T = QT[q.t];
  return `<div class="pq"><p class="pl"><span class="cn">${q.num}</span> <b>${q.lab}</b> <span class="chip ${chipCls(sc, q.p)}">${pts(sc)} / ${pts(q.p)}</span></p>${T.prof ? T.prof(q, v) : `<p><b>Réponse :</b> ${esc(T.ans(q, v))}</p><p class="muted"><b>Attendu :</b> ${esc(T.exp(q))}</p>`}</div>`;
}
function scoreTable(vals) {
  return tbl(["Partie", "Points"], [...PARTS.map(P => [`Partie ${P.n} · ${P.title}`, `${pts(partScore(P, vals))} / ${pts(P.max)}`]), ["<b>Total</b>", `<b>${pts(total(vals))} / ${pts(TOTAL)}</b>`]]);
}
function renderProf(el) {
  if (!PROF) {
    el.innerHTML = `<h3>🔒 Espace professeur</h3><p class="cap">${nb("Réservé au professeur : note, correction, décodage des copies transmises et fiche mémo.")}</p>
      <div class="row"><input id="pin" class="inp" type="password" inputmode="numeric" autocomplete="off" maxlength="12" aria-label="Code professeur" placeholder="Code" style="max-width:9rem"><button class="btn ghost" type="button" id="pinBtn">Ouvrir</button></div><p class="cap" id="pinMsg" aria-live="polite"></p>`;
    const open = () => { const v = $("#pin", el).value.trim(); if (h32("svt-vauban-prof|" + v) === PROF_H) { PROF = true; renderProf(el); const h = $("h3", el); if (h) { h.setAttribute("tabindex", "-1"); h.focus(); } } else { $("#pinMsg", el).textContent = "Code incorrect."; $("#pin", el).value = ""; } };
    $("#pinBtn", el).onclick = open; $("#pin", el).addEventListener("keydown", e => { if (e.key === "Enter") open(); });
    return;
  }
  const R = S.rendu, M = meta(), anyVal = PARTS.some(partOK), name = eleve();
  el.innerHTML = `<div class="row" style="justify-content:space-between"><h3>🔓 Espace professeur</h3><button class="btn ghost" type="button" id="lockBtn">🔒 Verrouiller</button></div>
    <div class="box warn"><p class="lab">⚠ À ne pas montrer à la classe</p><p>${nb("Cette zone affiche la note et la correction. Verrouillez avant de rendre l'appareil.")}</p></div>
    <h4>Copie de cet appareil${name ? ` · ${esc(name)}` : ""}</h4>
    ${anyVal ? `<p class="score-big">${pts(total())} / ${pts(TOTAL)}</p><p class="lead">${R ? nb(`Copie rendue le ${dmy(R.t)} à ${hm(R.t)} · code ${R.code}`) : nb(`Copie pas encore rendue : note provisoire des parties validées (${PARTS.filter(partOK).length} / ${PARTS.length}).`)}</p>
      <p class="cap">${nb(`Copies rendues sur cet appareil : ${M.n || 0} · copie recommencée : ${M.eff || 0} fois.`)}</p>${scoreTable()}
      <details class="recap"><summary>Correction détaillée, question par question</summary><div class="pqs">${QS.map(profQ).join("")}</div></details>`
      : `<p class="lead">${nb("Aucune partie validée sur cet appareil.")}</p>`}
    <h4>Décoder une copie transmise</h4><p class="cap">${nb("Collez le « code de correction » écrit dans la copie (.txt, courriel ou écran « Montrer au professeur »).")}</p>
    <div class="row"><input id="dec" class="inp wide" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Code de correction" placeholder="XXXX-XXXX-…" style="max-width:24rem"><button class="btn ghost" type="button" id="decBtn">Décoder</button></div><div id="decOut" aria-live="polite"></div>
    <h4>Fiche mémo</h4><p class="cap">${nb("À projeter quand toute la classe a rendu sa copie (elle n'est pas montrée aux élèves dans cette version notée).")}</p>
    <div class="row"><button class="btn ghost" type="button" id="ficheBtn">⛶ Projeter la fiche mémo</button></div>
    <h4>Élève suivant</h4><p class="cap">${nb("Efface la copie de cet appareil et remet les compteurs à zéro.")}</p><div class="row"><button class="btn ghost" type="button" id="wipeBtn">Effacer cette copie</button></div>`;
  $("#lockBtn", el).onclick = () => { PROF = false; renderProf(el); };
  $("#ficheBtn", el).onclick = () => showOverlay(`<p class="kicker">${NOTE.kicker}</p>${NOTE.fiche()}`);
  const dec = () => { const vals = decode($("#dec", el).value), out = $("#decOut", el);
    out.innerHTML = vals ? `<p class="score-big">${pts(total(vals))} / ${pts(TOTAL)}</p>${scoreTable(vals)}<details class="recap"><summary>Détail par question</summary>${tbl(["Question", "Points"], QS.map((q, i) => [`${q.num}. ${plain(q.lab).slice(0, 90)}${plain(q.lab).length > 90 ? "…" : ""}`, `${pts(vals[i])} / ${pts(q.p)}`]))}</details>`
      : `<div class="fb bad"><p class="h">${nb("Code non reconnu : vérifiez qu'il vient de cette activité et qu'il est recopié en entier.")}</p></div>`; };
  $("#decBtn", el).onclick = dec; $("#dec", el).addEventListener("keydown", e => { if (e.key === "Enter") dec(); });
  armButton($("#wipeBtn", el), "Effacer cette copie", "Confirmer l'effacement ?", () => { wipe(); setMeta({}); try { localStorage.removeItem(Store.key + "-eleve"); } catch (e) {} go("copie"); });
}

/* ---------- démarrage ---------- */
Display.init(S, save);
window.addEventListener("hashchange", () => { const h = location.hash.slice(1); if (h && h !== S.view && VIEWS.includes(h)) go(h); });
go(VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : (S.view || "consignes"), true);
