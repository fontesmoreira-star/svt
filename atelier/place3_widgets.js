/* ===== 3e SVT · Chapitre 3 · Activité 3 · La place de l'Homme dans l'évolution : un « Phylogène » simplifié =====
   D'après la fiche du professeur (logiciel Phylogène, collections « Vertébrés collège » et « Primates collège ») et sa correction :
   tableau de caractères, boîtes emboîtées, arbre phylogénétique, groupes. */
Store.key = "svt3-evo-act3-v1";
const WID = {}, LIVE = {};
const xst = () => { if (!S.x || typeof S.x !== "object") S.x = {}; return S.x; };
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const f1 = v => (+v).toFixed(1);
const sX = (x, y, txt, a, size, extra) => { extra = extra || ""; const m = extra.match(/style="([^"]*)"/); return `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${f1(size)}px;${m ? m[1] : ""}" ${extra.replace(/style="[^"]*"/, "")}>${esc(txt)}</text>`; };
let _cv = null;
const txtW = (t, size) => { try { _cv = _cv || document.createElement("canvas").getContext("2d"); _cv.font = `700 ${size}px ${getComputedStyle(document.body).fontFamily}`; return _cv.measureText(t).width + size * 0.3; } catch (e) { return t.length * size * 0.6; } };
const CIRC = ["①", "②", "③", "④", "⑤"];

/* ---------- les deux collections (données de la correction du professeur) ---------- */
const SETS = {
  vert: { name: "Vertébrés", ch: [{ k: "poils", nm: "Poils" }, { k: "mam", nm: "Mamelles" }, { k: "amn", nm: "Amnios" }, { k: "doigts", nm: "Doigts" }, { k: "sq", nm: "Squelette osseux" }],
    sp: [
      { k: "chat", e: "🐈", nm: "Chat", m: "11111", info: "Mammifère carnivore. Son corps est couvert de poils ; la femelle allaite ses petits grâce à ses mamelles. L'embryon se développe dans une poche remplie de liquide, l'amnios. Ses quatre pattes se terminent par des doigts. Squelette osseux." },
      { k: "crapaud", e: "🐸", nm: "Crapaud", m: "00011", info: "Amphibien. Peau nue, sans poils ni écailles ; pas de mamelles. Il pond des œufs sans coquille dans l'eau : l'embryon n'est pas entouré d'un amnios. Ses quatre pattes se terminent par des doigts. Squelette osseux." },
      { k: "croco", e: "🐊", nm: "Crocodile", m: "00111", info: "Reptile. Peau couverte d'écailles, sans poils ; pas de mamelles. Il pond sur la terre ferme des œufs à coquille, dans lesquels l'embryon se développe dans un amnios. Ses quatre pattes se terminent par des doigts. Squelette osseux." },
      { k: "gorille", e: "🦍", nm: "Gorille", m: "11111", info: "Grand singe. Corps couvert de poils ; la femelle allaite ses petits grâce à ses mamelles. L'embryon se développe dans un amnios. Mains et pieds terminés par des doigts. Squelette osseux." },
      { k: "homme", e: "🧍", nm: "Homme", m: "11111", info: "Corps en partie couvert de poils ; la femme allaite ses enfants grâce à ses mamelles. L'embryon se développe dans un amnios. Mains et pieds terminés par des doigts. Squelette osseux." },
      { k: "sardine", e: "🐟", nm: "Sardine", m: "00001", info: "Poisson. Corps couvert d'écailles, sans poils ; pas de mamelles. Elle pond ses œufs dans l'eau : pas d'amnios. Elle a des nageoires, sans doigts. Squelette osseux." }],
    leaves: ["sardine", "crapaud", "croco", "chat", "homme", "gorille"],
    traits: [["sq"], ["doigts"], ["amn"], ["poils", "mam"]],
    groups: [{ nm: "Vertébrés", def: "au moins un squelette osseux", n: 6 }, { nm: "Tétrapodes", def: "au moins un squelette osseux et des doigts", n: 5 }, { nm: "Amniotes", def: "au moins un squelette osseux, des doigts et un amnios", n: 4 }, { nm: "Mammifères", def: "au moins un squelette osseux, des doigts, un amnios, des poils et des mamelles", n: 3 }] },
  prim: { name: "Primates", ch: [{ k: "coc", nm: "Coccyx" }, { k: "nar", nm: "Narines rapprochées et orbites fermées" }, { k: "ong", nm: "Ongles plats et pouce opposable" }, { k: "poils", nm: "Poils" }],
    sp: [
      { k: "chat", e: "🐈", nm: "Chat", m: "0001", info: "Mammifère. Poils. Griffes, et non ongles plats ; pas de pouce opposable. Narines écartées ; orbites ouvertes vers l'arrière. Il a une queue." },
      { k: "chimp", e: "🐒", nm: "Chimpanzé", m: "1111", info: "Grand singe d'Afrique. Poils. Ongles plats et pouce opposable. Narines rapprochées, tournées vers le bas ; orbites fermées vers l'arrière. Pas de queue : ses dernières vertèbres, soudées, forment un coccyx." },
      { k: "gorille", e: "🦍", nm: "Gorille", m: "1111", info: "Grand singe d'Afrique. Poils. Ongles plats et pouce opposable. Narines rapprochées ; orbites fermées vers l'arrière. Pas de queue : il a un coccyx." },
      { k: "homme", e: "🧍", nm: "Homme", m: "1111", info: "Poils. Ongles plats et pouce opposable. Narines rapprochées, tournées vers le bas ; orbites fermées vers l'arrière. Pas de queue : il a un coccyx." },
      { k: "macaque", e: "🐵", nm: "Macaque", m: "0111", info: "Singe d'Asie et d'Afrique du Nord. Poils. Ongles plats et pouce opposable. Narines rapprochées, tournées vers le bas ; orbites fermées vers l'arrière. Il a une queue : pas de coccyx." },
      { k: "tarsier", e: "👀", nm: "Tarsier", m: "0011", info: "Petit primate d'Asie du Sud-Est, actif la nuit, aux yeux énormes. Poils. Ongles plats et pouce opposable. Narines écartées ; orbites incomplètement fermées vers l'arrière. Longue queue." }],
    leaves: ["chat", "tarsier", "macaque", "chimp", "gorille", "homme"],
    traits: [["poils"], ["ong"], ["nar"], ["coc"]],
    groups: [{ nm: "Mammifères", def: "des poils", n: 6 }, { nm: "Primates", def: "des poils, des ongles plats et un pouce opposable", n: 5 }, { nm: "Singes de l'Ancien Monde", def: "les caractères des primates, des narines rapprochées et des orbites fermées", n: 4 }, { nm: "Hominoïdes", def: "les caractères des singes de l'Ancien Monde et un coccyx", n: 3 }] } };
Object.values(SETS).forEach(C => { C.spk = k => C.sp.find(s => s.k === k); C.has = (sk, ck) => C.spk(sk).m[C.ch.findIndex(c => c.k === ck)] === "1"; C.traitName = t => t.map(k => C.ch.find(c => c.k === k).nm).join(" + "); });
const traitLabel = (C, t) => t.map((k, i) => { const n = C.ch.find(c => c.k === k).nm; return i ? n.charAt(0).toLowerCase() + n.slice(1) : n; }).join(" et ");

/* ======================= 1 · Le tableau de caractères (cliquer : présent / absent) ======================= */
const mxS = set => { const X = xst(); X.mx = X.mx || {}; X.mx[set] = X.mx[set] || {}; return X.mx[set]; };
const mxCell = (set, sk, i) => { const r = mxS(set)[sk]; return r ? r[i] : "?"; };
const mxErrors = set => { const C = SETS[set]; let e = 0, empty = 0; C.sp.forEach(s => C.ch.forEach((c, i) => { const v = mxCell(set, s.k, i); if (v === "?") empty++; else if (v !== s.m[i]) e++; })); return { e, empty }; };
const mxOk = set => { const r = mxErrors(set); return !r.e && !r.empty; };
function mkMatrice(set) {
  return el => {
    const C = SETS[set], X = xst(); X.mxSort = X.mxSort || {}; X.mxChk = X.mxChk || {}; X.mxFirst = X.mxFirst || {};
    let info = null, marks = false;
    el.innerHTML = `<p class="lead">${nb("Remplis le tableau : touche une case pour indiquer si le caractère est présent ou absent (touche encore pour changer). Le bouton 📄 ouvre les informations sur l'espèce.")}</p>
      <div class="row"><button type="button" class="btn ghost" data-sort aria-pressed="false">↕ Organiser le tableau</button><button type="button" class="btn" data-chk>✔ Vérifier mon tableau</button></div>
      <div class="tablewrap mxw"></div><div class="mxinfo" aria-live="polite"></div><p class="readout" aria-live="polite"></p>`;
    const rowsOrder = () => { const L = C.sp.slice(); if (X.mxSort[set]) L.sort((a, b) => [...b.m].filter(c => c === "1").length - [...a.m].filter(c => c === "1").length); return L; };
    const paint = () => {
      const S2 = mxS(set);
      const narrow = ($(".mxw", el).clientWidth || el.clientWidth || 600) < fsPx() * 27;
      const cell = (s, c, i) => { const v = (S2[s.k] || "?".repeat(C.ch.length))[i], bad = marks && v !== "?" && v !== s.m[i], ok = marks && v === s.m[i]; return `<button type="button" class="mxc ${v === "1" ? "on" : v === "0" ? "off" : ""} ${bad ? "is-bad" : ""}" data-s="${s.k}" data-i="${i}" aria-label="${esc(s.nm + " : " + c.nm + " : " + (v === "1" ? "présent" : v === "0" ? "absent" : "pas encore rempli") + (bad ? ", à corriger" : ""))}">${narrow ? `<span class="cn">${c.nm}</span>` : ""}<span class="cv">${v === "1" ? "Présent" : v === "0" ? "Absent" : "?"}</span>${bad ? `<span class="mk">✗</span>` : ok ? `<span class="mk ok">✓</span>` : ""}</button>`; };
      const spBtn = s => `<button type="button" class="mxsp" data-info="${s.k}" aria-pressed="${info === s.k}" aria-label="Informations sur : ${s.nm}"><span aria-hidden="true">${s.e}</span> ${s.nm} <span aria-hidden="true">📄</span></button>`;
      const infoBox = s => `<div class="box info"><p class="lab">📄 ${s.e} ${s.nm}</p><p>${nb(s.info)}</p></div>`;
      if (narrow) $(".mxw", el).innerHTML = `<div class="mxcards">${rowsOrder().map(s => `<div class="mxcard">${spBtn(s)}${info === s.k ? infoBox(s) : ""}<div class="mxrow">${C.ch.map((c, i) => cell(s, c, i)).join("")}</div></div>`).join("")}</div>`;
      else $(".mxw", el).innerHTML = `<table class="mx"><thead><tr><th scope="col">Espèce</th>${C.ch.map(c => `<th scope="col">${c.nm}</th>`).join("")}</tr></thead><tbody>${rowsOrder().map(s => `<tr><th scope="row">${spBtn(s)}</th>${C.ch.map((c, i) => `<td>${cell(s, c, i)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      $$("[data-s]", el).forEach(b => b.onclick = () => { const sk = b.dataset.s, i = +b.dataset.i, r = (S2[sk] || "?".repeat(C.ch.length)).split(""); r[i] = r[i] === "1" ? "0" : "1"; S2[sk] = r.join(""); marks = false; keep(); paint(); const n = $(`[data-s="${sk}"][data-i="${i}"]`, el); if (n) n.focus(); });
      $$("[data-info]", el).forEach(b => b.onclick = () => { info = info === b.dataset.info ? null : b.dataset.info; paint(); });
      const s = info && C.spk(info);
      $(".mxinfo", el).innerHTML = s && !narrow ? infoBox(s) : "";
      const r = mxErrors(set);
      $(".readout", el).innerHTML = nb(r.empty ? `Cases remplies : <b>${C.sp.length * C.ch.length - r.empty}/${C.sp.length * C.ch.length}</b>.` : marks ? (r.e ? `✗ <b>${r.e}</b> case(s) à corriger (marquées ✗).` : "✓ Tableau juste !") : "Tableau rempli : touche « Vérifier mon tableau ».");
      const sb = $("[data-sort]", el); sb.setAttribute("aria-pressed", !!X.mxSort[set]); sb.textContent = X.mxSort[set] ? "↕ Ordre de départ" : "↕ Organiser le tableau";
    };
    $("[data-sort]", el).onclick = () => { X.mxSort[set] = !X.mxSort[set]; keep(); paint(); };
    if (window.ResizeObserver) { let lw = 0; new ResizeObserver(() => { const w = $(".mxw", el).clientWidth; if (Math.abs(w - lw) > 30) { lw = w; paint(); } }).observe($(".mxw", el)); }
    $("[data-chk]", el).onclick = () => { const r = mxErrors(set); marks = true; if (!r.empty && X.mxFirst[set] === undefined) X.mxFirst[set] = r.e; X.mxChk[set] = (X.mxChk[set] || 0) + 1; keep(); paint(); };
    paint();
  };
}
WID.matV = mkMatrice("vert");
WID.matP = mkMatrice("prim");

/* ======================= 2 · Les boîtes emboîtées (afficher les boîtes, caractère par caractère) ======================= */
const bxS = set => { const X = xst(); X.bx = X.bx || {}; X.bx[set] = X.bx[set] || []; return X.bx[set]; };
const BXC = ["#c9a227", "#3f7fbf", "#b5651d", "#c2477a"];
function mkBoites(set) {
  return el => {
    const C = SETS[set], A = bxS(set);
    el.innerHTML = `<p class="lead">${nb("Touche les caractères les uns après les autres : chacun dessine une boîte autour des espèces qui le possèdent.")}</p>
      <div class="seg bxb" role="group" aria-label="Caractères">${C.ch.map(c => `<button type="button" data-c="${c.k}" aria-pressed="false">${c.nm}</button>`).join("")}</div>
      <div class="row"><button type="button" class="btn ghost" data-all>Afficher toutes les boîtes</button><button type="button" class="btn ghost" data-none>Effacer les boîtes</button></div>
      <div class="bxz" aria-live="polite"></div>`;
    const paint = () => {
      $$("[data-c]", el).forEach(b => b.setAttribute("aria-pressed", A.includes(b.dataset.c)));
      /* groupes de caractères ayant exactement les mêmes espèces, du plus partagé au moins partagé */
      const sig = c => C.sp.map(s => C.has(s.k, c.k) ? 1 : 0).join("");
      const groups = []; C.ch.forEach(c => { const g = groups.find(q => q.sig === sig(c)); if (g) g.ch.push(c); else groups.push({ sig: sig(c), ch: [c] }); });
      groups.forEach(g => { g.n = [...g.sig].filter(x => x === "1").length; }); groups.sort((a, b) => b.n - a.n);
      const act = groups.filter(g => g.ch.some(c => A.includes(c.k)));
      const chips = L => L.length ? `<div class="bxs">${L.map(s => `<span class="spt">${s.e} ${s.nm}</span>`).join("")}</div>` : "";
      const build = (lvl, inside) => {
        if (lvl >= act.length) return chips(inside);
        const g = act[lvl], sub = inside.filter(s => g.sig[C.sp.indexOf(s)] === "1"), own = inside.filter(s => !sub.includes(s));
        return chips(own) + `<div class="bx" style="--bc:${BXC[groups.indexOf(g) % BXC.length]}"><p class="bxt">${g.ch.filter(c => A.includes(c.k)).map(c => c.nm).join(" · ")}</p>${build(lvl + 1, sub)}</div>`;
      };
      $(".bxz", el).innerHTML = act.length ? build(0, C.sp) : chips(C.sp) + `<p class="lead">Aucune boîte pour l'instant.</p>`;
    };
    $$("[data-c]", el).forEach(b => b.onclick = () => { const k = b.dataset.c, i = A.indexOf(k); if (i >= 0) A.splice(i, 1); else A.push(k); xst().bxSeen = xst().bxSeen || {}; if (C.ch.every(c => A.includes(c.k))) xst().bxSeen[set] = 1; keep(); paint(); });
    $("[data-all]", el).onclick = () => { A.splice(0, A.length, ...C.ch.map(c => c.k)); xst().bxSeen = xst().bxSeen || {}; xst().bxSeen[set] = 1; keep(); paint(); };
    $("[data-none]", el).onclick = () => { A.splice(0, A.length); keep(); paint(); };
    paint();
  };
}
WID.boxV = mkBoites("vert");
WID.boxP = mkBoites("prim");

/* ======================= 3 · L'arbre phylogénétique (racine à gauche, espèces à droite) ======================= */
/* opts.traits : tableau de 4 étiquettes (ou null) ; opts.groups : 4 tableaux d'indices d'espèces (ordre de C.sp) ou null */
function treeSVG(set, W, F, opts) {
  const C = SETS[set], tk = TK(F) * 0.88, n = 6, rh = F * 1.75, top = F * 0.9, xr = F * 0.5;
  const gw = opts.groups ? F * 0.62 : 0, labW = Math.max(...C.leaves.map(k => txtW(`${C.spk(k).e} ${C.spk(k).nm}`, tk))) + F * 0.4, lw = Math.min(W - xr - labW - gw * 4 - F * 0.3, F * 13), xl = xr + lw, dx = (lw - F * 1.4) / 4;
  const y = i => top + i * rh, xn = k => xr + F * 1.4 + k * dx;
  const c = []; c[3] = y(4); for (let k = 2; k >= 0; k--) c[k] = (y(k) + c[k + 1]) / 2;
  const ln = (x1, y1, x2, y2) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" style="stroke:var(--ink);stroke-width:2.6;stroke-linecap:round"/>`;
  let g = ln(xr, c[0], xn(0), c[0]);
  for (let k = 0; k < 3; k++) g += ln(xn(k), y(k), xn(k), c[k + 1]) + ln(xn(k), y(k), xl, y(k)) + ln(xn(k), c[k + 1], xn(k + 1), c[k + 1]);
  g += ln(xn(3), y(3), xn(3), y(5)); [3, 4, 5].forEach(i => { g += ln(xn(3), y(i), xl, y(i)); });
  for (let k = 0; k < 4; k++) g += `<rect x="${f1(xn(k) - F * 0.2)}" y="${f1(c[k] - F * 0.2)}" width="${f1(F * 0.4)}" height="${f1(F * 0.4)}" style="fill:#f2c200;stroke:var(--ink);stroke-width:1"/>`;
  /* traits d'apparition des caractères : ① sur la racine, ②③④ entre les nœuds */
  const tx = [[(xr + xn(0)) / 2, c[0]], [(xn(0) + xn(1)) / 2, c[1]], [(xn(1) + xn(2)) / 2, c[2]], [(xn(2) + xn(3)) / 2, c[3]]];
  if (opts.traits) tx.forEach(([x, yy], i) => { const has = opts.traits[i] !== null && opts.traits[i] !== undefined; g += `<line x1="${f1(x)}" y1="${f1(yy - F * 0.45)}" x2="${f1(x)}" y2="${f1(yy + F * 0.45)}" style="stroke:${has ? "var(--bad)" : "var(--muted)"};stroke-width:3"/>` + sX(x, yy - F * 0.6, CIRC[i], "middle", tk, `font-weight="800" style="fill:${has ? "var(--bad)" : "var(--muted)"}"`); });
  C.leaves.forEach((k, i) => { const s = C.spk(k); g += sX(xl + F * 0.3, y(i) + tk * 0.35, `${s.e} ${s.nm}`, "start", tk, 'font-weight="700"'); });
  let H = y(5) + F * 1.1;
  if (opts.groups) {
    const gx0 = xl + labW + F * 0.1;
    opts.groups.forEach((sel, j) => {
      const col = `var(--c${j + 1})`, x = gx0 + j * gw, rows = (sel || []).map(si => C.leaves.indexOf(C.sp[si].k)).filter(r => r >= 0).sort((a, b) => a - b);
      let r0 = null; rows.forEach((r, q) => { if (r0 === null) r0 = r; if (rows[q + 1] !== r + 1) { g += `<line x1="${f1(x)}" y1="${f1(y(r0) - rh * 0.4)}" x2="${f1(x)}" y2="${f1(y(r) + rh * 0.4)}" style="stroke:${col};stroke-width:4;stroke-linecap:round"/>`; r0 = null; } });
      g += sX(x, y(0) - F * 0.35, String(j + 1), "middle", tk * 0.85, `font-weight="800" style="fill:${col}"`);
    });
  }
  return { svg: g, H };
}
function legendHTML(set, opts) {
  const C = SETS[set]; let h = "";
  if (opts.traits) h += `<ul class="tleg">${opts.traits.map((t, i) => `<li><span class="tn">${CIRC[i]}</span> ${t ? esc(t) : `<span class="muted">? (à placer)</span>`}</li>`).join("")}</ul>`;
  if (opts.groups) h += `<ul class="tleg">${C.groups.map((gq, j) => `<li><span class="gsw" style="background:var(--c${j + 1})"></span> ${j + 1} · ${gq.nm}</li>`).join("")}</ul>`;
  return h;
}
const TRAITS_OK = set => SETS[set].traits.map(t => traitLabel(SETS[set], t));
function liveTree(set, mode, off) {
  off = off || 0;
  return (W, F, v) => {
    const C = SETS[set], m = (v && v[off]) || {};
    const opts = mode === "traits" ? { traits: [0, 1, 2, 3].map(i => m[i] === undefined ? null : TRAITS_OK(set)[m[i]]) } : { traits: TRAITS_OK(set), groups: [0, 1, 2, 3].map(j => (v && v[off + j]) || []) };
    const t = treeSVG(set, W, F, opts);
    return `<svg viewBox="0 0 ${W} ${f1(t.H)}" width="${W}" height="${f1(t.H)}" role="img" aria-label="Arbre phylogénétique des ${C.name.toLowerCase()} : de la racine vers ${C.leaves.map(k => C.spk(k).nm).join(", ")}. Le dernier nœud porte trois branches.">${t.svg}</svg><div class="tlegw">${legendHTML(set, opts)}</div>`;
  };
}
LIVE.traitsV = liveTree("vert", "traits");
LIVE.groupsV = liveTree("vert", "groups");
LIVE.traitsP = liveTree("prim", "traits", 1);
LIVE.groupsP = liveTree("prim", "groups");
