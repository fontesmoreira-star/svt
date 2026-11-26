/* ===== 3e SVT · Chapitre 3 · Diversité et évolution des êtres vivants · Activité 2 · Des comparaisons d'ADN : simulations =====
   D'après la fiche du professeur « Activité 2 : Des comparaisons d'ADN » (V2 + guide méthodologique). Les séquences sont simulées. */
Store.key = "svt3-evo-act2-v1";
const WID = {}, LIVE = {};
const xst = () => { if (!S.x || typeof S.x !== "object") S.x = {}; return S.x; };
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const f1 = v => (+v).toFixed(1);
const rng = s => { let x = s; return () => { x = (x * 1103515245 + 12345) & 0x7fffffff; return x / 0x7fffffff; }; };
const sX = (x, y, txt, a, size, extra) => { extra = extra || ""; const m = extra.match(/style="([^"]*)"/); return `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${f1(size)}px;${m ? m[1] : ""}" ${extra.replace(/style="[^"]*"/, "")}>${esc(txt)}</text>`; };
const press = (el, key, cur) => $$(`[data-${key}]`, el).forEach(b => b.setAttribute("aria-pressed", b.dataset[key] === String(cur) ? "true" : "false"));

/* ---------- document 1 : les espèces comparées à l'Homme (valeurs de la fiche du professeur) ---------- */
const SP = [
  { k: "mouche", e: "🪰", nm: "Mouche du vinaigre", sh: "mouche", grp: "arthropode, insecte", p: 36 },
  { k: "haemo", e: "🦠", nm: "Haemophilus influenzae", sh: "Haemophilus", grp: "bactérie", p: 7, it: true },
  { k: "chimp", e: "🐒", nm: "Chimpanzé commun", sh: "chimpanzé", grp: "vertébré, mammifère", p: 98.8 },
  { k: "souris", e: "🐭", nm: "Souris domestique", sh: "souris", grp: "vertébré, mammifère", p: 90 },
  { k: "poisson", e: "🐟", nm: "Poisson zèbre", sh: "poisson zèbre", grp: "vertébré, poisson à nageoires rayonnées", p: 85 }];
const SPK = k => SP.find(s => s.k === k);
const spName = s => s.it ? `<i>${s.nm}</i>` : s.nm;

/* ======================= 1 · Le comparateur d'ADN ======================= */
const BASES = "ATCG", SEQN = 1000;
const PAIRS = { hum: { lab: "Deux humains", a: "Homme A", b: "Homme B", n: 1, seed: 31, fix: [637] }, chimp: { lab: "Homme / chimpanzé", a: "Homme", b: "Chimpanzé", n: 12, seed: 47 }, souris: { lab: "Homme / souris", a: "Homme", b: "Souris", n: 100, seed: 59 } };
const REF = (() => { const R = rng(7); return Array.from({ length: SEQN }, () => BASES[Math.floor(R() * 4)]); })();
const _ps = {};
function pairSeq(k) {
  if (_ps[k]) return _ps[k];
  const P = PAIRS[k], R = rng(P.seed), pos = new Set(P.fix || []);
  while (pos.size < P.n) pos.add(20 + Math.floor(R() * (SEQN - 40)));
  const b = REF.slice(), diffs = [...pos].sort((x, y) => x - y);
  diffs.forEach(i => { const o = BASES.replace(REF[i], ""); b[i] = o[Math.floor(R() * 3)]; });
  return (_ps[k] = { a: REF, b, diffs });
}
WID.comparateur = el => {
  const X = xst(); X.cmp = X.cmp || {};
  let k = PAIRS[X.cpair] ? X.cpair : "hum", start = 0, per = 20;
  el.innerHTML = `<p class="lead">${nb("Le comparateur aligne le même extrait d'ADN (1 000 lettres A, T, C, G) chez deux êtres vivants, lettre par lettre. Parcours l'extrait, puis compare-le en entier.")}</p>
    <div class="seg" role="group" aria-label="ADN comparés">${Object.entries(PAIRS).map(([q, P]) => `<button type="button" data-p="${q}">${P.lab}</button>`).join("")}</div>
    <div class="seqw" aria-live="polite"></div>
    <div class="row"><button type="button" class="btn ghost" data-mv="-1" aria-label="Lettres précédentes">◀ Précédentes</button><button type="button" class="btn ghost" data-mv="1" aria-label="Lettres suivantes">Suivantes ▶</button></div>
    <p class="readout" data-pos></p>
    <div class="row"><button type="button" class="btn" data-all>🔍 Comparer tout l'extrait</button><button type="button" class="btn ghost" data-nx>Aller à la différence suivante</button></div>
    <div class="figbox" data-map></div><p class="readout" data-res aria-live="polite"></p>
    <p class="cap">${nb("Légende : | lettre identique · ✗ lettre différente. Touche la carte de l'extrait pour t'y déplacer.")}</p>`;
  const box = $(".seqw", el);
  const perRow = () => { const w = box.clientWidth || 300, cell = Math.max(19, fsPx() * 1.05), lab = fsPx() * 5.8; return Math.max(8, Math.min(30, Math.floor((w - lab) / cell))); };
  const rows = () => (box.clientWidth || 300) < fsPx() * 22 ? 2 : 1;
  const paint = () => {
    const P = PAIRS[k], s = pairSeq(k), done = !!X.cmp[k]; per = perRow(); const n = per * rows();
    start = Math.max(0, Math.min(SEQN - n, start)); start = Math.floor(start / per) * per;
    let h = "", vis = 0;
    for (let r = 0; r < rows(); r++) {
      const a = start + r * per, idx = Array.from({ length: per }, (_, i) => a + i).filter(i => i < SEQN);
      const cells = (arr, cls) => idx.map(i => { const d = s.a[i] !== s.b[i]; if (cls === "b" && d) vis++; return `<span class="sq ${cls === "b" && d ? "d" : ""}">${cls === "m" ? (d ? "✗" : "|") : arr[i]}</span>`; }).join("");
      h += `<div class="seqb" style="grid-template-columns:5.6em repeat(${idx.length},minmax(0,1fr))"><span class="sl">${P.a}</span>${cells(s.a, "a")}<span class="sl"></span>${cells(null, "m").replace(/<span class="sq ">✗/g, '<span class="sq x">✗')}<span class="sl">${P.b}</span>${cells(s.b, "b")}</div>`;
    }
    box.innerHTML = h;
    $("[data-pos]", el).innerHTML = nb(`Lettres <b>${start + 1}</b> à <b>${Math.min(SEQN, start + n)}</b> sur 1 000 · lettres différentes ici : <b>${vis}</b>.`);
    $("[data-res]", el).innerHTML = done ? nb(`Extrait comparé en entier : <b>${s.diffs.length}</b> lettre${s.diffs.length > 1 ? "s" : ""} différente${s.diffs.length > 1 ? "s" : ""} sur 1 000.`) : nb("Touche « Comparer tout l'extrait » pour compter toutes les différences.");
    $("[data-nx]", el).disabled = !done; press(el, "p", k); map.draw();
  };
  const map = liveSVG($("[data-map]", el), (W, F) => {
    const s = pairSeq(k), done = !!X.cmp[k], tk = TK(F) * 0.85, x0 = F * 0.3, w = W - F * 0.6, y0 = F * 0.4, h = F * 1.3, X2 = i => x0 + i / SEQN * w, n = per * rows();
    let g = `<rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(w)}" height="${f1(h)}" rx="4" style="fill:var(--surface-2);stroke:var(--line)"/>`;
    if (done) s.diffs.forEach(i => { g += `<line x1="${f1(X2(i + 0.5))}" y1="${f1(y0 + 2)}" x2="${f1(X2(i + 0.5))}" y2="${f1(y0 + h - 2)}" style="stroke:var(--bad);stroke-width:${k === "souris" ? 1.4 : 2.4}"/>`; });
    g += `<rect x="${f1(X2(start))}" y="${f1(y0 - 3)}" width="${f1(Math.max(4, n / SEQN * w))}" height="${f1(h + 6)}" rx="3" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>`;
    g += sX(x0, y0 + h + tk * 1.1, "lettre 1", "start", tk) + sX(x0 + w, y0 + h + tk * 1.1, "lettre 1 000", "end", tk);
    return `<svg viewBox="0 0 ${W} ${f1(y0 + h + tk * 1.5)}" width="${W}" height="${f1(y0 + h + tk * 1.5)}" role="img" aria-label="Carte de l'extrait de 1 000 lettres${done ? ` : ${s.diffs.length} différences marquées en rouge` : ""}. Le cadre montre les lettres affichées.">${g}</svg>`;
  });
  $("[data-map]", el).addEventListener("pointerdown", e => { const svg = $("svg", $("[data-map]", el)); if (!svg) return; const r = svg.getBoundingClientRect(), F = fsPx(), x = (e.clientX - r.left) * (svg.viewBox.baseVal.width / r.width); start = Math.round((x - F * 0.3) / (svg.viewBox.baseVal.width - F * 0.6) * SEQN - per); paint(); });
  $$("[data-p]", el).forEach(b => b.onclick = () => { k = b.dataset.p; X.cpair = k; start = 0; keep(); paint(); });
  $$("[data-mv]", el).forEach(b => b.onclick = () => { start += +b.dataset.mv * per * rows(); if (start >= SEQN) start = 0; paint(); });
  $("[data-all]", el).onclick = () => { X.cmp[k] = 1; keep(); paint(); };
  $("[data-nx]", el).onclick = () => { const d = pairSeq(k).diffs, n = per * rows(), nx = d.find(i => i >= start + n) ?? d[0]; start = nx - Math.floor(per / 2); paint(); };
  if (window.ResizeObserver) { let lw = 0; new ResizeObserver(() => { const w = box.clientWidth; if (Math.abs(w - lw) > 4) { lw = w; paint(); } }).observe(box); }
  paint();
};

/* ======================= 2 · La règle de ressemblance : placer chaque espèce ======================= */
const rgS = () => { const X = xst(); X.rg = X.rg || {}; return X.rg; };
let _cv = null;
const txtW = (t, size) => { try { _cv = _cv || document.createElement("canvas").getContext("2d"); _cv.font = `800 ${size}px ${getComputedStyle(document.body).fontFamily}`; return _cv.measureText(t).width + size * 0.4; } catch (e) { return t.length * size * 0.62; } };
WID.regle = el => {
  const RG = rgS(); let sel = null, msg = "";
  el.innerHTML = `<p class="lead">${nb("Passe du document 1 à un graphique : touche un être vivant, puis touche la règle à l'endroit de son pourcentage d'information génétique en commun avec l'Homme.")}</p>
    <div class="spchips" role="group" aria-label="Êtres vivants à placer">${SP.map(s => `<button type="button" class="spchip" data-s="${s.k}" aria-pressed="false"><span aria-hidden="true">${s.e}</span> ${spName(s)}<span class="ok" data-ok></span></button>`).join("")}</div>
    <div class="figbox rgfig"></div>
    <div class="row rgalt"><label class="lead" for="rgn">ou écris son pourcentage :</label><input id="rgn" class="inp" inputmode="decimal" autocomplete="off" style="max-width:7rem"><span class="unit">%</span><button type="button" class="btn ghost" data-put>Placer</button></div>
    <p class="readout" aria-live="polite"></p>`;
  const tryPut = v => {
    if (!sel) { msg = "Touche d'abord un être vivant."; return upd(); }
    const s = SPK(sel); if (!Number.isFinite(v)) { msg = "Écris un nombre."; return upd(); }
    if (Math.abs(v - s.p) <= 3) { RG[sel] = 1; msg = `✓ ${s.nm} placé à ${fmt(s.p)} %.`; sel = null; keep(); }
    else msg = `✗ Pas à ${fmt(Math.round(v))} % : relis le pourcentage de « ${s.nm} » dans le document 1.`;
    upd();
  };
  const fig = liveSVG($(".rgfig", el), (W, F) => {
    const tk = TK(F) * 0.88, L = F * 0.9, R = F * 0.9, w = W - L - R, X = p => L + p / 100 * w, step = F * 1.95;
    const placed = [{ e: "🧍", sh: W < F * 20 ? "Homme" : "Homme (référence)", p: 100 }].concat(SP.filter(s => RG[s.k]));
    /* placement des étiquettes, niveau par niveau : ni chevauchement, ni ligne qui traverse une étiquette */
    const order = placed.filter(s => s.p < 60).sort((a, b) => b.p - a.p).concat(placed.filter(s => s.p >= 60).sort((a, b) => a.p - b.p));
    const boxes = [], lines = [], pos = new Map();
    order.forEach(s => {
      const x = X(s.p), wd = Math.max(txtW(`${s.e} ${s.sh}`, tk), txtW(`${fmt(s.p)} %`, tk)), pref = s.p >= 60 ? ["end", "start"] : ["start", "end"];
      const cand = (lv, anc) => { let x0 = anc === "end" ? x - wd : x; x0 = Math.max(2, Math.min(W - 2 - wd, x0)); return { x0, x1: x0 + wd, lo: lv * step, hi: lv * step + step * 0.95, lv }; };
      const ok = b => !boxes.some(q => q.x0 < b.x1 + 4 && b.x0 < q.x1 + 4 && q.lo < b.hi && b.lo < q.hi) && !lines.some(l => l.x > b.x0 - 3 && l.x < b.x1 + 3 && l.top > b.lo) && !boxes.some(q => x > q.x0 - 3 && x < q.x1 + 3 && q.lo < b.lo);
      let got = null; for (const anc of pref) for (let lv = 0; lv < 9 && !got; lv++) { const c = cand(lv, anc); if (ok(c)) got = c; }
      if (!got) got = cand(Math.max(0, ...boxes.map(q => q.lv)) + 1, pref[0]);
      boxes.push(got); lines.push({ x, top: got.lo }); pos.set(s, got);
    });
    const maxLv = Math.max(0, ...boxes.map(q => q.lv)), base = F * 1.6 + (maxLv + 1) * step + F * 0.4, H = base + F * 3.2;
    let g = `<rect x="${f1(L)}" y="${f1(base - F * 0.35)}" width="${f1(w)}" height="${f1(F * 0.7)}" rx="${f1(F * 0.35)}" style="fill:var(--surface-2);stroke:var(--line)"/>`;
    for (let p = 0; p <= 100; p += 10) { const big = p % 50 === 0, show = p % (w < F * 18 ? 20 : 10) === 0; g += `<line x1="${f1(X(p))}" y1="${f1(base - F * 0.35)}" x2="${f1(X(p))}" y2="${f1(base + F * (big ? 0.75 : 0.55))}" style="stroke:var(--ink);stroke-width:${big ? 2 : 1.2}"/>`; if (show) g += sX(X(p), base + F * 1.55, String(p), "middle", tk); }
    g += sX(L + w / 2, H - F * 0.3, W < F * 22 ? "En commun avec l'Homme (%)" : "Information génétique en commun avec l'Homme (%)", "middle", tk, 'font-weight="700"');
    const halo = 'style="paint-order:stroke;stroke:var(--surface);stroke-width:5px;stroke-linejoin:round"';
    order.forEach(s => { const x = X(s.p), P = pos.get(s), yb = base - F * 1.1 - P.lv * step, tx = P.x0 + tk * 0.2;
      g += `<line x1="${f1(x)}" y1="${f1(base - F * 0.35)}" x2="${f1(x)}" y2="${f1(yb + F * 0.2)}" style="stroke:var(--accent);stroke-width:2"/><circle cx="${f1(x)}" cy="${f1(base)}" r="${f1(F * 0.28)}" style="fill:var(--accent)"/>`;
      g += sX(tx, yb - tk * 1.05, `${s.e} ${s.sh}`, "start", tk, 'font-weight="800" ' + halo) + sX(tx, yb, `${fmt(s.p)} %`, "start", tk * 0.92, halo); });
    return `<svg viewBox="0 0 ${W} ${f1(H)}" width="${W}" height="${f1(H)}" role="img" aria-label="Règle de 0 à 100 % : information génétique en commun avec l'Homme. Placés : ${placed.map(s => s.sh + " " + fmt(s.p) + " %").join(", ")}.">${g}</svg>`;
  });
  $(".rgfig", el).addEventListener("pointerdown", e => { const svg = $("svg", $(".rgfig", el)); if (!svg) return; const r = svg.getBoundingClientRect(), F = fsPx(), W = svg.viewBox.baseVal.width, x = (e.clientX - r.left) * (W / r.width); tryPut((x - F * 0.9) / (W - F * 1.8) * 100); });
  const upd = () => {
    $$("[data-s]", el).forEach(b => { const on = b.dataset.s === sel, ok = !!RG[b.dataset.s]; b.setAttribute("aria-pressed", on); b.disabled = ok; $("[data-ok]", b).textContent = ok ? " ✓ placé" : ""; });
    const n = SP.filter(s => RG[s.k]).length;
    $(".readout", el).innerHTML = nb(`${msg ? msg + " " : ""}Êtres vivants placés : <b>${n}/${SP.length}</b>.${sel ? ` Sélectionné : <b>${SPK(sel).nm}</b>.` : ""}`); fig.draw();
  };
  $$("[data-s]", el).forEach(b => b.onclick = () => { sel = b.dataset.s; msg = ""; upd(); });
  $("[data-put]", el).onclick = () => { tryPut(parseNum($("#rgn", el).value)); $("#rgn", el).value = ""; };
  $("#rgn", el).addEventListener("keydown", e => { if (e.key === "Enter") $("[data-put]", el).click(); });
  upd();
};

/* ======================= 3 · Pourquoi tant de ressemblances ? deux lignées qui divergent ======================= */
const DV = { n: 40, steps: 12 };
const DV_ANC = (() => { const R = rng(23); return Array.from({ length: DV.n }, () => BASES[Math.floor(R() * 4)]); })();
const DV_EV = [71, 89].map(seed => { const R = rng(seed), ev = []; for (let t = 1; t <= DV.steps; t++) { const r = R(), m = r < 0.4 ? 0 : r < 0.85 ? 1 : 2; for (let j = 0; j < m; j++) { const i = Math.floor(R() * DV.n), o = BASES.replace(DV_ANC[i], ""); ev.push({ t, i, b: o[Math.floor(R() * 3)] }); } } return ev; });
const dvSeq = (L, t) => { const s = DV_ANC.slice(); DV_EV[L].filter(e => e.t <= t).forEach(e => { s[e.i] = e.b; }); return s; };
const dvDiff = t => { const a = dvSeq(0, t), b = dvSeq(1, t); return a.filter((c, i) => c !== b[i]).length; };
WID.divergence = el => {
  const X = xst(); X.dv = X.dv || {};
  let t = Number.isInteger(X.dvt) ? X.dvt : 0, anc = false;
  el.innerHTML = `<p class="lead">${nb("Une espèce ancestrale se sépare en deux populations qui deviennent deux espèces (A et B). Fais avancer le temps : à chaque étape, des mutations peuvent toucher, au hasard, l'ADN de chaque lignée.")}</p>
    <div class="field"><label>Temps écoulé depuis la séparation<input type="range" min="0" max="${DV.steps}" step="1" value="${t}" data-t aria-label="Temps écoulé depuis la séparation, de 0 à ${DV.steps} étapes"></label></div>
    <div class="row"><button type="button" class="btn ghost" data-st="-1" aria-label="Reculer d'une étape">◀ −1</button><button type="button" class="btn ghost" data-st="1" aria-label="Avancer d'une étape">+1 ▶</button><button type="button" class="btn ghost" data-anc aria-pressed="false">Montrer l'ADN de l'ancêtre commun</button></div>
    <div class="dvg"><div class="figbox" data-tree></div><div class="dvs" aria-live="polite"></div></div><p class="readout"></p>`;
  const tree = liveSVG($("[data-tree]", el), (W, F) => {
    const tk = TK(F) * 0.9, w = Math.min(W, F * 13), H = F * 9, bx = w / 2, by = H - F * 1.6, top = F * 1.4, len = (by - top) * (0.15 + 0.85 * t / DV.steps), sp = (w / 2 - F * 1.2) * (0.25 + 0.75 * t / DV.steps);
    let g = `<line x1="${f1(bx)}" y1="${f1(H - F * 0.3)}" x2="${f1(bx)}" y2="${f1(by)}" style="stroke:var(--ink);stroke-width:3"/>`;
    [[-1, "A"], [1, "B"]].forEach(([d, n]) => { const ex = bx + d * sp, ey = by - len; g += `<line x1="${f1(bx)}" y1="${f1(by)}" x2="${f1(ex)}" y2="${f1(ey)}" style="stroke:var(--ink);stroke-width:3"/>` + sX(ex, ey - F * 0.4, `Espèce ${n}`, "middle", tk, 'font-weight="800"'); });
    g += `<circle cx="${f1(bx)}" cy="${f1(by)}" r="${f1(F * 0.32)}" style="fill:var(--accent)"/>` + sX(bx + F * 0.5, by + F * 0.35, "ancêtre commun", "start", tk * 0.9, 'font-weight="700"');
    return `<svg viewBox="0 0 ${w} ${f1(H)}" width="${w}" height="${f1(H)}" role="img" aria-label="Arbre : un ancêtre commun, puis deux branches, espèce A et espèce B, ${t} étapes de temps après la séparation.">${g}</svg>`;
  });
  const upd = () => {
    const a = dvSeq(0, t), b = dvSeq(1, t), d = a.filter((c, i) => c !== b[i]).length;
    const row = (lab, s, ref) => `<div class="dvr"><span class="sl">${lab}</span><span class="dvl">${s.map((c, i) => `<span class="sq ${ref && c !== ref[i] ? "d" : ""}">${c}</span>`).join("")}</span></div>`;
    $(".dvs", el).innerHTML = (anc ? row("Ancêtre", DV_ANC, null) : "") + row("Espèce A", a, b) + row("Espèce B", b, a);
    $(".readout", el).innerHTML = nb(`Étape <b>${t}</b>/${DV.steps} · lettres différentes entre A et B : <b>${d}</b> sur ${DV.n} · ressemblance : <b>${fmt(Math.round((DV.n - d) / DV.n * 1000) / 10)} %</b>.`);
    $("[data-t]", el).value = t; const ab = $("[data-anc]", el); ab.setAttribute("aria-pressed", anc); ab.textContent = anc ? "Masquer l'ADN de l'ancêtre commun" : "Montrer l'ADN de l'ancêtre commun";
    if (t >= 1 && t <= 3) X.dv.lo = 1; if (t >= DV.steps - 1) X.dv.hi = 1; X.dvt = t; keep(); tree.draw();
  };
  $("[data-t]", el).oninput = e => { t = +e.target.value; upd(); };
  $$("[data-st]", el).forEach(b => b.onclick = () => { t = Math.max(0, Math.min(DV.steps, t + +b.dataset.st)); upd(); });
  $("[data-anc]", el).onclick = () => { anc = !anc; upd(); };
  upd();
};

/* ======================= 3 · L'arbre de parenté, dessiné à partir des réponses de l'élève ======================= */
const SEP = ["haemo", "mouche", "poisson", "souris", "chimp"]; /* ordre attendu des séparations, de la plus ancienne à la plus récente */
LIVE.arbre = (W, F, v) => {
  const m = (v && v[0]) || {}, tk = TK(F) * 0.9, n = 6, rh = F * 2.05, top = F * 1.1, xr = F * 3.3, labW = Math.min(W * 0.5, F * 9.5), lw = Math.min(W - xr - labW, F * 13), xl = xr + lw, dx = (lw - F * 0.6) / 5, H = top + rh * (n - 1) + F * 2.4;
  const lab = i => { if (i === 5) return { t: "🧍 Homme", u: "référence" }; const j = m[i]; if (j === undefined) return { t: "?", u: "à placer", empty: true }; const s = SPK(SEP[j]); return { t: `${s.e} ${s.sh}`, u: `${fmt(s.p)} % en commun` }; };
  const y = i => top + i * rh;
  const yn = []; yn[4] = (y(4) + y(5)) / 2; for (let k = 3; k >= 0; k--) yn[k] = (y(k) + yn[k + 1]) / 2;
  const xn = k => xr + F * 0.6 + k * dx;
  let g = `<line x1="${f1(xr)}" y1="${f1(yn[0])}" x2="${f1(xn(0))}" y2="${f1(yn[0])}" style="stroke:var(--ink);stroke-width:2.6"/>` + sX(xr - F * 0.2, yn[0] + tk * 0.3, "racine", "end", tk * 0.85, 'style="fill:var(--muted)"');
  for (let k = 0; k < 5; k++) {
    const yc = k < 4 ? yn[k + 1] : y(5), xc = k < 4 ? xn(k + 1) : xl;
    g += `<line x1="${f1(xn(k))}" y1="${f1(y(k))}" x2="${f1(xn(k))}" y2="${f1(yc)}" style="stroke:var(--ink);stroke-width:2.6"/><line x1="${f1(xn(k))}" y1="${f1(y(k))}" x2="${f1(xl)}" y2="${f1(y(k))}" style="stroke:var(--ink);stroke-width:2.6"/><line x1="${f1(xn(k))}" y1="${f1(yc)}" x2="${f1(xc)}" y2="${f1(yc)}" style="stroke:var(--ink);stroke-width:2.6"/>`;
    g += `<circle cx="${f1(xn(k))}" cy="${f1(yn[k])}" r="${f1(F * 0.24)}" style="fill:var(--accent)"/>`;
  }
  for (let i = 0; i < 6; i++) { const L = lab(i); g += sX(xl + F * 0.35, y(i) + tk * 0.3, L.t, "start", tk, L.empty ? 'style="fill:var(--muted)"' : 'font-weight="700"') + sX(xl + F * 0.35, y(i) + tk * 1.3, L.u, "start", tk * 0.85, 'style="fill:var(--muted)"'); }
  
  return `<svg viewBox="0 0 ${W} ${f1(H)}" width="${W}" height="${f1(H)}" role="img" aria-label="Arbre de parenté en construction, de la racine à l'Homme : ${[0, 1, 2, 3, 4].map(i => lab(i).empty ? "espèce à placer" : lab(i).t + ", " + lab(i).u).join(" ; ")} ; puis l'Homme.">${g}</svg>`;
};
