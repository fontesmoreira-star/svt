/* ===== Terminale ES · Thème 3 · 3.1 La biodiversité et son évolution · Activité 2 « Les populations évoluent-elles ? Le modèle de Hardy-Weinberg » =====
   Widgets : population d'araignées paon (génotypes, tri par phénotype, urne des allèles), bal des gamètes (fécondations au hasard et
   tableau de croisement), carré de Hardy-Weinberg (aires p², pq, q² et allèles A de la génération 2), tableur des générations (+ Python),
   observations du manuel face au modèle, labo des forces évolutives (sélection sexuelle, prédation, dérive, migration, mutation),
   comparateur effectifs observés / attendus (groupes sanguins MN, drépanocytose). */
Store.key = "tes-th3-hw-v1";
const WID = {}, LIVE = {};
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const RMO = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } })();
const clampN = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const f2 = x => fmt(Math.round(x * 100) / 100, 2);
const f3 = x => fmt(Math.round(x * 1000) / 1000, 3);
const r2 = x => Math.round(x * 100) / 100;
const GT = ["(A//A)", "(A//a)", "(a//a)"];
const ALS = [["A", "A"], ["A", "a"], ["a", "a"]];
const bead = (a, cls) => `<span class="al ${a === "A" || a === "M" ? "A" : "a"}${cls ? " " + cls : ""}" aria-hidden="true">${a}</span>`;
const relBox = (el, ref) => { const a = el.getBoundingClientRect(), b = ref.getBoundingClientRect(); return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height }; };
/* un jeton qui vole d'un point à un autre (overlay en position absolue dans « host ») */
function fly(host, html, from, to, delay, dur, done) {
  const n = document.createElement("span"); n.className = "flyb"; n.innerHTML = html; n.style.left = from.x + "px"; n.style.top = from.y + "px"; n.style.width = from.w + "px"; n.style.height = from.h + "px";
  host.appendChild(n);
  const end = () => { if (n.parentNode) n.remove(); if (done) done(); };
  if (RMO) { end(); return; }
  n.style.transition = `transform ${dur}ms ease ${delay}ms, opacity 200ms ease ${delay + dur - 150}ms`;
  requestAnimationFrame(() => requestAnimationFrame(() => { n.style.transform = `translate(${to.x - from.x}px,${to.y - from.y}px) scale(${to.w / Math.max(1, from.w)})`; }));
  setTimeout(end, delay + dur + 30);
}

/* ---------- repère commun des graphiques (un seul axe vertical) ---------- */
function frame(W, F, o) {
  const tk = TK(F), L = F * 3.3, R = F * 1.1, T = F * 1.2, B = F * 3.3, ph = o.ph || Math.max(F * 9, Math.min(W * 0.52, 360)), pw = W - L - R, H = T + ph + B;
  const X = v => L + (v - o.x0) / (o.x1 - o.x0) * pw, Y = v => T + ph - (v - o.y0) / (o.y1 - o.y0) * ph, g = [];
  o.yt.forEach(v => g.push(`<line x1="${L}" x2="${(L + pw).toFixed(1)}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" style="stroke:var(--grid)"/>` + sT(L - 6, Y(v) + tk * 0.35, o.yf ? o.yf(v) : fmt(v), "end", tk)));
  o.xt.forEach(v => g.push(`<line x1="${X(v).toFixed(1)}" x2="${X(v).toFixed(1)}" y1="${T}" y2="${(T + ph).toFixed(1)}" style="stroke:var(--grid)"/>` + sT(X(v), T + ph + tk * 1.3, fmt(v), "middle", tk)));
  g.push(`<line x1="${L}" x2="${(L + pw).toFixed(1)}" y1="${(T + ph).toFixed(1)}" y2="${(T + ph).toFixed(1)}" style="stroke:var(--ink);stroke-width:1.5"/><line x1="${L}" x2="${L}" y1="${T}" y2="${(T + ph).toFixed(1)}" style="stroke:var(--ink);stroke-width:1.5"/>`);
  const lf = Math.max(16, F * 0.8);
  g.push(sT(L + pw / 2, T + ph + tk * 2.8, o.xl, "middle", lf, `font-weight="700"`));
  g.push(`<text transform="translate(${(lf * 0.95).toFixed(1)},${(T + ph / 2).toFixed(1)}) rotate(-90)" text-anchor="middle" style="fill:var(--ink);font-size:${lf.toFixed(1)}px;font-weight:700">${esc(o.yl)}</text>`);
  return { g, X, Y, L, T, pw, ph, H, tk };
}
const svgWrap = (W, H, label, body, defs) => `<svg viewBox="0 0 ${W} ${Math.round(H)}" width="${W}" height="${Math.round(H)}" role="img" aria-label="${esc(label)}">${defs ? `<defs>${defs}</defs>` : ""}${body}</svg>`;
const ptOf = (fig, ev) => { const svg = fig.querySelector("svg"); if (!svg) return null; const r = svg.getBoundingClientRect(), k = svg.viewBox.baseVal.width / r.width; return [(ev.clientX - r.left) * k, (ev.clientY - r.top) * k]; };

/* ======================= L'ARAIGNÉE PAON ======================= */
const SPC = [{ o: "#1764d0", m: "#e2432a", i: "#f3c21b", b: "#000000", r: 3.1 }, { o: "#5f8cc2", m: "#d68a63", i: "#e3d08f", b: "#333333", r: 2.3 }, { o: "#9aabbb", m: "#c4af9c", i: "#d9d2bf", b: "#858585", r: 1.5 }];
const PHT = ["taches noires très marquées sur des couleurs vives", "taches noires moyennement marquées", "taches noires peu marquées sur des couleurs ternes"];
const LEGS = "M30 41 L20 34 L9 31 M30 42 L18 39 L6 40 M30 43 L19 46 L8 51 M30 44 L22 50 L14 58 M30 41 L40 34 L51 31 M30 42 L42 39 L54 40 M30 43 L41 46 L52 51 M30 44 L38 50 L46 58";
function spiderSVG(g) {
  const c = SPC[g], B = [[18, 22], [42, 22], [24, 31], [36, 31], [30, 15]];
  return `<svg class="spg" viewBox="0 0 60 60" aria-hidden="true"><path class="legs" d="${LEGS}"/><ellipse cx="30" cy="43" rx="6.5" ry="6" class="ceph"/>
    <ellipse cx="30" cy="23" rx="19" ry="14.5" fill="${c.o}" stroke="#1d1d1d" stroke-width="1.1"/><ellipse cx="30" cy="23.5" rx="13" ry="10" fill="${c.m}"/><ellipse cx="30" cy="24" rx="6.8" ry="5" fill="${c.i}"/>
    ${B.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${c.r}" fill="${c.b}"/>`).join("")}<circle cx="27.5" cy="45" r="1.1" fill="#fff"/><circle cx="32.5" cy="45" r="1.1" fill="#fff"/></svg>`;
}
const POP = shuffle([0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], 20251);
const NPOP = POP.length;
const POUR = POP.flatMap((g, i) => ALS[g].map((a, k) => ({ a, sp: i, k })));

function spiW(el, mode) {
  const x = xst(); if (!Array.isArray(x.ins)) x.ins = [];
  let sel = null; const sorted = () => mode === "count" && !!x.sortNow;
  el.innerHTML = `<div class="hw hwwrap">
    <p class="lead">${mode === "count" ? "Voici une population de 25 araignées paon. Trie-les, puis verse dans l'urne les deux allèles de chaque araignée." : "Voici une population de 25 araignées paon mâles. Touche une araignée pour l'observer de près et découvrir ses deux allèles."}</p>
    ${mode === "count" ? `<div class="row"><button type="button" class="btn" data-sort></button></div>` : ""}
    <div class="spipop" data-pop role="group" aria-label="Population de 25 araignées paon"></div>
    <div class="spizoom" data-zoom aria-live="polite"></div>
    ${mode === "count" ? `<div class="urnbox"><div class="row" style="justify-content:space-between"><p class="kicker" style="margin:0">🏺 L'urne des allèles : <b data-uc>0</b> allèle(s)</p></div>
      <div class="urn" data-urn></div>
      <div class="row"><button type="button" class="btn" data-pour>🏺 Verser les allèles dans l'urne</button><button type="button" class="btn ghost" data-usort></button><button type="button" class="btn ghost" data-uclr>↺ Vider l'urne</button></div>
      <p class="cap">Chaque araignée possède deux allèles du gène (un sur chaque chromosome de la paire). Dans l'urne, les allèles sont rangés par lignes de 10.</p></div>` : ""}
    <div class="flyz" data-fly></div></div>`;
  const pop = $("[data-pop]", el), fz = $("[data-fly]", el), wrap = el.firstElementChild;
  pop.innerHTML = POP.map((g, i) => `<button type="button" class="spb" data-i="${i}" aria-pressed="false" aria-label="Araignée n° ${i + 1}">${spiderSVG(g)}</button>`).join("") + ["Contraste fort", "Contraste moyen", "Contraste faible"].map((t, j) => `<p class="spgl" data-gl="${j}" hidden>${t}</p>`).join("");
  let geo = null;
  function layout() {
    const W = Math.max(260, pop.clientWidth || 320), gap = 6, s = clampN(Math.floor((W - 4 * gap) / 5), 48, 64), cw = 5 * s + 4 * gap, x0 = Math.max(0, (W - cw) / 2), lh = Math.round(fsPx() * 1.7);
    const pos = [];
    if (!sorted()) { POP.forEach((g, i) => pos[i] = [x0 + (i % 5) * (s + gap), Math.floor(i / 5) * (s + gap)]); pop.style.height = (5 * (s + gap) - gap) + "px"; $$("[data-gl]", pop).forEach(n => n.hidden = true); }
    else { let y = 0; const gl = $$("[data-gl]", pop); [0, 1, 2].forEach(g => { gl[g].hidden = false; gl[g].style.transform = `translate(${x0}px,${y}px)`; y += lh; const ids = POP.map((v, i) => v === g ? i : -1).filter(i => i >= 0); ids.forEach((i, k) => pos[i] = [x0 + (k % 5) * (s + gap), y + Math.floor(k / 5) * (s + gap)]); y += Math.ceil(ids.length / 5) * (s + gap) + gap * 2; }); pop.style.height = y + "px"; }
    $$(".spb", pop).forEach((b, i) => { b.style.width = b.style.height = s + "px"; b.style.transform = `translate(${pos[i][0]}px,${pos[i][1]}px)`; });
    geo = { s };
  }
  function zoom() {
    const z = $("[data-zoom]", el);
    if (sel === null) { z.innerHTML = `<p class="lead">${mode === "count" ? "Touche une araignée pour revoir ses allèles." : "Touche une araignée : son portrait et ses allèles s'affichent ici."}</p>`; return; }
    const g = POP[sel];
    z.innerHTML = `<div class="spibig">${spiderSVG(g)}</div><div><p style="margin:0"><b>Araignée n° ${sel + 1}</b></p><p style="margin:.2rem 0">Ses deux allèles : ${bead(ALS[g][0])} ${bead(ALS[g][1])}</p><p style="margin:0">Génotype : <b>${GT[g]}</b></p><p class="sr">Observation : ${PHT[g]}.</p></div>`;
  }
  function paint() {
    $$(".spb", pop).forEach((b, i) => { b.setAttribute("aria-pressed", String(i === sel)); b.classList.toggle("seen", mode !== "count" && x.ins.includes(i)); });
    if (mode === "count") {
      $("[data-sort]", el).textContent = sorted() ? "↺ Remettre la population en désordre" : "🔀 Trier les araignées par phénotype";
      const urn = $("[data-urn]", el), n = x.poured ? 2 * NPOP : 0, ord = x.urnSort ? POUR.slice().sort((a, b) => (a.a === "A" ? 0 : 1) - (b.a === "A" ? 0 : 1)) : POUR;
      urn.innerHTML = ord.map((o, j) => `<span class="slot" data-j="${j}">${x.poured ? bead(o.a) : ""}</span>`).join("");
      urn.setAttribute("aria-label", x.poured ? `Urne : ${2 * NPOP} allèles${x.urnSort ? ", rangés par allèle, par lignes de 10" : ", mélangés"}` : "Urne vide");
      $("[data-uc]", el).textContent = n;
      $("[data-pour]", el).disabled = !!x.poured; $("[data-usort]", el).disabled = !x.poured; $("[data-uclr]", el).disabled = !x.poured;
      $("[data-usort]", el).textContent = x.urnSort ? "🔀 Mélanger l'urne" : "🧮 Ranger l'urne par allèle";
    }
    zoom();
  }
  pop.addEventListener("click", ev => { const b = ev.target.closest(".spb"); if (!b) return; sel = +b.dataset.i; if (mode !== "count" && !x.ins.includes(sel)) { x.ins.push(sel); keep(); } paint(); });
  if (mode === "count") {
    $("[data-sort]", el).onclick = () => { x.sortNow = !x.sortNow; if (x.sortNow) x.sortEver = true; keep(); layout(); paint(); };
    $("[data-pour]", el).onclick = () => {
      if (x.poured) return; x.poured = true; x.urnSort = false; paint(); keep();
      const urn = $("[data-urn]", el), slots = $$(".slot", urn); slots.forEach(s => s.style.visibility = "hidden");
      const sp = $$(".spb", pop); let left = slots.length;
      POUR.forEach((o, j) => { const a = relBox(sp[o.sp], wrap), t = relBox(slots[j], wrap), from = { x: a.x + a.w * (o.k ? 0.62 : 0.18), y: a.y + a.h * 0.3, w: t.w, h: t.h };
        fly(fz, bead(o.a), from, t, o.sp * 45 + o.k * 20, 650, () => { slots[j].style.visibility = ""; if (--left === 0) keep(); }); });
    };
    $("[data-usort]", el).onclick = () => { x.urnSort = !x.urnSort; if (x.urnSort) x.urnEver = true; keep(); paint(); };
    armButton($("[data-uclr]", el), "↺ Vider l'urne", "Confirmer : vider l'urne ?", () => { x.poured = false; x.urnSort = false; keep(); paint(); });
  }
  if (window.ResizeObserver) { let lw = pop.clientWidth; new ResizeObserver(() => { const w = pop.clientWidth; if (Math.abs(w - lw) > 4 && document.body.contains(el)) { lw = w; layout(); } }).observe(pop); }
  layout(); paint();
}
WID.spi = el => spiW(el, "inspect");
WID.spicount = el => spiW(el, "count");

/* ======================= LE BAL DES GAMÈTES ======================= */
const GURN = { ov: shuffle(Array.from({ length: 50 }, (_, i) => i < 20 ? "A" : "a"), 31), sp: shuffle(Array.from({ length: 50 }, (_, i) => i < 20 ? "A" : "a"), 77) };
function gm() { const x = xst(); if (!Array.isArray(x.gm) || x.gm.length !== 4) x.gm = [0, 0, 0, 0]; return x.gm; }
const gTot = () => gm().reduce((s, v) => s + v, 0);
WID.gam = el => {
  const x = xst(); let busy = false;
  el.innerHTML = `<div class="hw hwwrap">
    <p class="lead">Les 25 araignées de la partie 1 se reproduisent. Leurs allèles passent dans les gamètes : chaque allèle de l'urne a la même chance de se retrouver dans un ovule ou dans un spermatozoïde. Les gamètes se rencontrent <b>au hasard</b>.</p>
    <div class="gurns"><div class="gurn"><p class="kicker">🥚 Ovules (gamètes femelles)</p><div class="urn" data-u="ov">${GURN.ov.map((a, j) => `<span class="slot" data-j="${j}">${bead(a)}</span>`).join("")}</div></div>
      <div class="gurn"><p class="kicker">🔹 Spermatozoïdes (gamètes mâles)</p><div class="urn" data-u="sp">${GURN.sp.map((a, j) => `<span class="slot" data-j="${j}">${bead(a)}</span>`).join("")}</div></div></div>
    <div class="zyg" aria-live="polite"><span class="kicker" style="margin:0">Dernier descendant :</span><span class="zs" data-z0></span><span class="zs" data-z1></span><b data-zg></b></div>
    <div class="row"><button type="button" class="btn" data-one>💞 1 fécondation</button>${[10, 100, 1000].map(n => `<button type="button" class="btn ghost" data-n="${n}">× ${fmt(n)}</button>`).join("")}<button type="button" class="btn ghost" data-rst>↺ Recommencer</button></div>
    <p class="lead" data-msg aria-live="polite"></p>
    <div data-pun></div><div class="flyz" data-fly></div></div>`;
  const wrap = el.firstElementChild, fz = $("[data-fly]", el);
  const idx = ["AA", "Aa", "aA", "aa"];
  function pun(flash) {
    const c = gm(), T = gTot(), fq = v => T ? f3(v / T) : "—";
    const cell = (k, gl) => `<td class="pc g${gl}${flash === k ? " flash" : ""}"><b>${GT[gl]}</b><span>n = ${fmt(c[k])}</span><span>f = ${fq(c[k])}</span></td>`;
    $("[data-pun]", el).innerHTML = `<div class="tablewrap"><table class="t pun"><caption>Tableau de croisement · ${fmt(T)} fécondation${T > 1 ? "s" : ""} · ⚠ ${SIMUL}</caption>
      <thead><tr><th scope="col"><span class="diag"><span class="lng">Spermatozoïde ↓ · Ovule →</span><span class="sht" aria-hidden="true">♂ ↓ · ♀ →</span></span></th><th scope="col"><span class="lng">Ovule</span><span class="sht" aria-hidden="true">♀</span> ${bead("A")}</th><th scope="col"><span class="lng">Ovule</span><span class="sht" aria-hidden="true">♀</span> ${bead("a")}</th></tr></thead>
      <tbody><tr><th scope="row"><span class="lng">Spermatozoïde</span><span class="sht" aria-hidden="true">♂</span> ${bead("A")}</th>${cell(0, 0)}${cell(1, 1)}</tr><tr><th scope="row"><span class="lng">Spermatozoïde</span><span class="sht" aria-hidden="true">♂</span> ${bead("a")}</th>${cell(2, 1)}${cell(3, 2)}</tr></tbody></table></div>
      <p class="lead sht">♀ : ovule · ♂ : spermatozoïde.</p><p class="lead">Descendants : ${GT[0]} ${fq(c[0])} · ${GT[1]} ${fq(c[1] + c[2])} · ${GT[2]} ${fq(c[3])} (fréquences observées).</p>`;
    $$("[data-one],[data-n],[data-rst]", el).forEach(b => b.disabled = busy);
  }
  const draw = () => [Math.random() < 0.4 ? "A" : "a", Math.random() < 0.4 ? "A" : "a"];
  const kOf = (sp, ov) => (sp === "A" ? 0 : 2) + (ov === "A" ? 0 : 1);
  $("[data-one]", el).onclick = () => {
    if (busy) return; busy = true; pun();
    const [ov, sp] = draw(), pick = (u, a) => { const L = GURN[u].map((v, j) => v === a ? j : -1).filter(j => j >= 0); return L[Math.floor(Math.random() * L.length)]; };
    const jo = pick("ov", ov), js = pick("sp", sp), so = $(`[data-u="ov"] [data-j="${jo}"]`, el), ss = $(`[data-u="sp"] [data-j="${js}"]`, el), z0 = $("[data-z0]", el), z1 = $("[data-z1]", el);
    so.classList.add("pick"); ss.classList.add("pick"); z0.innerHTML = z1.innerHTML = ""; $("[data-zg]", el).textContent = "";
    let n = 2; const fin = () => { if (--n) return; so.classList.remove("pick"); ss.classList.remove("pick"); z0.innerHTML = bead(ov); z1.innerHTML = bead(sp); const k = kOf(sp, ov), g = k === 0 ? 0 : k === 3 ? 2 : 1; $("[data-zg]", el).textContent = "→ " + GT[g];
      gm()[k]++; x.gs1 = (x.gs1 || 0) + 1; busy = false; keep(); pun(k); $("[data-msg]", el).textContent = `Ovule ${ov} + spermatozoïde ${sp} → descendant ${GT[g]}.`; $("[data-one]", el).focus(); };
    const a = relBox(so, wrap), b = relBox(ss, wrap), t0 = relBox(z0, wrap), t1 = relBox(z1, wrap);
    fly(fz, bead(ov), a, t0, 0, 700, fin); fly(fz, bead(sp), b, t1, 0, 700, fin);
  };
  $$("[data-n]", el).forEach(btn => btn.onclick = () => {
    if (busy) return; const N = +btn.dataset.n; busy = true; pun(); let done = 0, lt = 0; const dur = RMO ? 1 : 900;
    const step = ts => { if (!document.body.contains(el)) { busy = false; return; } const dt = lt ? Math.min(100, ts - lt) : 16; lt = ts; const goal = Math.min(N, Math.ceil(N * Math.min(1, (done / N) + dt / dur))); while (done < goal) { const [ov, sp] = draw(); gm()[kOf(sp, ov)]++; done++; }
      if (done >= N) { busy = false; keep(); pun(); $("[data-msg]", el).textContent = `${fmt(N)} fécondations au hasard de plus.`; btn.focus(); return; } pun(); requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
  armButton($("[data-rst]", el), "↺ Recommencer", "Confirmer : tout effacer ?", () => { x.gm = [0, 0, 0, 0]; keep(); $("[data-z0]", el).innerHTML = $("[data-z1]", el).innerHTML = ""; $("[data-zg]", el).textContent = ""; $("[data-msg]", el).textContent = ""; pun(); });
  pun();
};

/* ======================= LE CARRÉ DE HARDY-WEINBERG ======================= */
WID.sq = el => {
  const x = xst(); if (!Array.isArray(x.sqv)) x.sqv = []; let p = typeof x.sp === "number" ? clampN(x.sp, 0.05, 0.95) : 0.4, an = 0, G = null;
  const visit = () => { const k = f2(p); if (!x.sqv.includes(k)) x.sqv.push(k); };
  el.innerHTML = `<div class="hw"><p class="lead">Le tableau de croisement peut se dessiner comme un carré de côté 1 : chaque case a pour <b>aire</b> la probabilité du génotype. Fais varier p, la fréquence de l'allèle A dans les gamètes de la génération 1.</p>
    <div class="field"><label>Fréquence de A : <b>p = <span data-pv></span></b> · fréquence de a : <b>q = 1 − p = <span data-qv></span></b><input type="range" min="0.05" max="0.95" step="0.01" data-pr aria-label="Fréquence p de l'allèle A, de 0,05 à 0,95"></label>
      <div class="row">${[-0.1, -0.01, 0.01, 0.1].map(d => `<button type="button" class="btn ghost sm" data-pd="${d}" aria-label="${d > 0 ? "Augmenter" : "Diminuer"} p de ${fmt(Math.abs(d))}">${d > 0 ? "+" : "−"}${fmt(Math.abs(d))}</button>`).join("")}<button type="button" class="btn ghost sm" data-p40>p = 0,40</button></div></div>
    <div class="figbox chartbox" data-fig></div><p class="readout" data-ro aria-live="polite">Touche une case pour lire son calcul.</p>
    <div class="box info"><p class="lab">ℹ Animation</p><p>Où se trouvent les allèles A des descendants (génération 2) ? Un descendant (A//A) porte deux allèles A ; un descendant (A//a) n'en porte qu'un sur deux : on hachure la moitié de chaque case (A//a).</p><div class="row animctl" data-an></div></div></div>`;
  const fig = $("[data-fig]", el);
  const chart = liveSVG(fig, (W, F) => {
    const tk = TK(F), lab = F * 3.2, top = F * 3.6, S0 = Math.min(W - lab - F * 0.6, 470), x0 = lab + Math.max(0, (W - lab - S0) / 2 - F), y0 = top, H = top + S0 + F * 1.2, q = 1 - p, g = [];
    const R = (a, b, c, d) => [x0 + a * S0, y0 + b * S0, c * S0, d * S0];
    const cells = [[0, 0, p, p, 0, "p²", p * p], [p, 0, q, p, 1, "p × q", p * q], [0, p, p, q, 1, "q × p", p * q], [p, p, q, q, 2, "q²", q * q]];
    const col = ["var(--c1)", "var(--c3)", "var(--c2)"];
    G = { x0, y0, S0, cells };
    cells.forEach(([a, b, c, d, gt, fo, v]) => { const [X, Y, w, h] = R(a, b, c, d); g.push(`<rect x="${X.toFixed(1)}" y="${Y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" style="fill:${col[gt]};fill-opacity:.28;stroke:var(--ink);stroke-width:2"/>`);
      if (w > F * 4.2 && h > F * 2.4) g.push(sT(X + w / 2, Y + h / 2 - tk * 0.15, GT[gt], "middle", tk, `font-weight="800"`) + sT(X + w / 2, Y + h / 2 + tk * 1.05, `${fo} = ${f2(v)}`, "middle", tk * 0.92));
      else if (w > F * 3.2 && h > F * 1.2) g.push(sT(X + w / 2, Y + h / 2 + tk * 0.35, GT[gt], "middle", tk * 0.85, `font-weight="800"`)); });
    /* étiquettes des gamètes */
    g.push(sT(x0 + S0 / 2, y0 - F * 2.5, "Ovules →", "middle", tk, `font-weight="700"`));
    [[0, p, "A", "p"], [p, q, "a", "q"]].forEach(([a, w, al, s]) => { const X = x0 + (a + w / 2) * S0; if (w * S0 > F * 2.6) g.push(sT(X, y0 - F * 1.15, `${al} (${s} = ${f2(w)})`, "middle", tk * 0.9)); else g.push(sT(X, y0 - F * 1.15, al, "middle", tk * 0.9)); g.push(`<line x1="${(x0 + a * S0 + 3).toFixed(1)}" x2="${(x0 + (a + w) * S0 - 3).toFixed(1)}" y1="${(y0 - F * 0.55).toFixed(1)}" y2="${(y0 - F * 0.55).toFixed(1)}" style="stroke:var(--ink);stroke-width:2"/>`); });
    g.push(`<text transform="translate(${(F * 0.85).toFixed(1)},${(y0 + S0 / 2).toFixed(1)}) rotate(-90)" text-anchor="middle" style="fill:var(--ink);font-size:${tk.toFixed(1)}px;font-weight:700">← Spermatozoïdes</text>`);
    [[0, p, "A"], [p, q, "a"]].forEach(([b, h, al]) => g.push(sT(x0 - F * 0.5, y0 + (b + h / 2) * S0 + tk * 0.35, al, "end", tk, `font-weight="700"`)));
    /* animation : les allèles A de la génération 2 */
    if (an > 0) {
      const a1 = Math.min(1, an / 0.3), mv = clampN((an - 0.35) / 0.45, 0, 1), e = mv < 0.5 ? 2 * mv * mv : 1 - Math.pow(-2 * mv + 2, 2) / 2, fin = clampN((an - 0.85) / 0.15, 0, 1);
      const hat = (a, b, c, d, op) => { const [X, Y, w, h] = R(a, b, c, d); return `<rect x="${X.toFixed(1)}" y="${Y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" style="fill:url(#hwh);opacity:${op.toFixed(2)};stroke:var(--ink);stroke-width:1.5"/>`; };
      g.push(hat(0, 0, p, p, a1), hat(0, p, p, q / 2, a1));
      const s0 = [p, 0, q, p / 2], t0 = [0, p + q / 2, p, q / 2], m = s0.map((v, i) => v + (t0[i] - v) * e);
      g.push(hat(m[0], m[1], m[2], m[3], a1));
      if (fin > 0) { const [X, Y, w, h] = R(0, 0, p, 1); g.push(`<rect x="${X.toFixed(1)}" y="${Y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" style="fill:none;stroke:var(--accent);stroke-width:5;opacity:${fin.toFixed(2)}"/><line x1="${X.toFixed(1)}" x2="${(X + w).toFixed(1)}" y1="${(y0 - F * 0.55).toFixed(1)}" y2="${(y0 - F * 0.55).toFixed(1)}" style="stroke:var(--accent);stroke-width:7;opacity:${fin.toFixed(2)}"/>`); }
    }
    return svgWrap(W, H, `Carré de croisement pour p = ${f2(p)}`, g.join(""), `<pattern id="hwh" patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(45)"><rect width="9" height="9" style="fill:var(--accent-soft)"/><line x1="0" y1="0" x2="0" y2="9" style="stroke:var(--accent);stroke-width:4"/></pattern>`);
  });
  const ctl = animCtl($("[data-an]", el), 2600, t => { an = t; chart.draw(); if (t >= 1) $("[data-ro]", el).textContent = "Les allèles A de la génération 2 (hachures) occupent maintenant une colonne. Compare sa largeur au segment « A » des ovules."; });
  $("[data-an]", el).insertAdjacentHTML("beforeend", `<span class="lead">Lancer : les hachures se rassemblent.</span>`);
  function paint() { $("[data-pv]", el).textContent = f2(p); $("[data-qv]", el).textContent = f2(1 - p); $("[data-pr]", el).value = p; chart.draw(); }
  const set = v => { p = clampN(Math.round(v * 100) / 100, 0.05, 0.95); x.sp = p; visit(); keep(); ctl.set(0); paint(); };
  $("[data-pr]", el).addEventListener("input", e => set(+e.target.value));
  $$("[data-pd]", el).forEach(b => b.onclick = () => set(p + +b.dataset.pd));
  $("[data-p40]", el).onclick = () => set(0.4);
  fig.addEventListener("pointerdown", ev => { const P = ptOf(fig, ev); if (!P || !G) return; const u = (P[0] - G.x0) / G.S0, v = (P[1] - G.y0) / G.S0; if (u < 0 || u > 1 || v < 0 || v > 1) return; const c = G.cells.find(([a, b, w, h]) => u >= a && u <= a + w && v >= b && v <= b + h); if (!c) return;
    $("[data-ro]", el).innerHTML = `Case ${GT[c[4]]} : spermatozoïde ${v < p ? "A" : "a"} × ovule ${u < p ? "A" : "a"} → probabilité ${c[5]} = ${f2(v < p ? p : 1 - p)} × ${f2(u < p ? p : 1 - p)} = <b>${f3(c[6])}</b>`; });
  visit(); keep(); paint();
};

/* ======================= LE TABLEUR DES GÉNÉRATIONS ======================= */
const GSTART = { p1: ["Population de la partie 1", [0.2, 0.4, 0.4]], het: ["Que des hétérozygotes (A//a)", [0, 1, 0]], hom: ["Moitié (A//A), moitié (a//a)", [0.5, 0, 0.5]], eq: ["0,49 ; 0,42 ; 0,09", [0.49, 0.42, 0.09]] };
function genRows(key, n) { const r = [GSTART[key][1].slice()]; for (let i = 1; i < n; i++) { const [a, b] = r[i - 1], p = a + b / 2, q = 1 - p; r.push([p * p, 2 * p * q, q * q]); } return r.map(([a, b, c]) => ({ a, b, c, p: a + b / 2, q: 1 - (a + b / 2) })); }
WID.gen = el => {
  const x = xst(); if (!GSTART[x.gk]) x.gk = "p1"; if (!x.gtry || typeof x.gtry !== "object") x.gtry = {}; let n = Number.isInteger(x.gn) ? clampN(x.gn, 1, 10) : 1, cur = null, G = null;
  el.innerHTML = `<div class="hw"><p class="lead">Le modèle calcule chaque génération à partir de la précédente : les fréquences génotypiques de la génération n + 1 sont p², 2pq et q², où p est la fréquence de A dans la génération n.</p>
    <div class="field"><span class="plab" id="gkL">Population de départ (génération 1) : f(A//A) ; f(A//a) ; f(a//a)</span><div class="seg" role="group" aria-labelledby="gkL">${Object.entries(GSTART).map(([k, v]) => `<button type="button" data-gk="${k}">${v[0]}${k === "p1" ? " (0,20 ; 0,40 ; 0,40)" : k === "het" ? " (0 ; 1 ; 0)" : k === "hom" ? " (0,5 ; 0 ; 0,5)" : ""}</button>`).join("")}</div></div>
    <div class="row"><button type="button" class="btn" data-next>➕ Génération suivante</button><button type="button" class="btn ghost" data-all>⏩ Jusqu'à la génération 10</button><button type="button" class="btn ghost" data-g1>↺ Revenir à la génération 1</button></div>
    <div class="figbox chartbox" data-fig></div><p class="readout" data-ro aria-live="polite">${CT.readHint}</p>
    <p class="kicker" style="margin:0">📊 Le tableur · touche une cellule pour voir sa formule</p><p class="fx" data-fx aria-live="polite"><span class="fxl">fx</span> <span data-fxt>Touche une cellule.</span></p><div data-tab></div></div>`;
  const fig = $("[data-fig]", el), COL = ["var(--c1)", "var(--c3)", "var(--c2)"];
  const chart = liveSVG(fig, (W, F) => {
    const R = genRows(x.gk, n), o = frame(W, F, { x0: 1, x1: 10, y0: 0, y1: 1, xt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(v => W > 480 || v % 2 === 1 || v === 10), yt: [0, 0.2, 0.4, 0.6, 0.8, 1], xl: "Génération", yl: "Fréquence génotypique", ph: Math.max(F * 8, Math.min(W * 0.45, 300)) }), g = o.g;
    ["a", "b", "c"].forEach((k, s) => { const pts = R.map((r, i) => [o.X(i + 1), o.Y(r[k])]); g.push(`<polyline points="${pts.map(q => q.map(v => v.toFixed(1)).join(",")).join(" ")}" style="fill:none;stroke:${COL[s]};stroke-width:3" stroke-dasharray="${DASH(s)}"/>`); pts.forEach(([X, Y]) => g.push(s === 0 ? `<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="5" style="fill:${COL[s]}"/>` : s === 1 ? `<rect x="${(X - 5).toFixed(1)}" y="${(Y - 5).toFixed(1)}" width="10" height="10" style="fill:${COL[s]}"/>` : `<polygon points="${X.toFixed(1)},${(Y - 6).toFixed(1)} ${(X + 6).toFixed(1)},${(Y + 5).toFixed(1)} ${(X - 6).toFixed(1)},${(Y + 5).toFixed(1)}" style="fill:${COL[s]}"/>`)); });
    G = o; return svgWrap(W, o.H, "Fréquences génotypiques au fil des générations", g.join(""));
  });
  const leg = `<ul class="simleg hwleg"><li><span class="lg" style="background:var(--c1)"></span><span class="sn">● f(A//A)</span></li><li><span class="lg" style="background:var(--c3)"></span><span class="sn">■ f(A//a)</span></li><li><span class="lg" style="background:var(--c2)"></span><span class="sn">▲ f(a//a)</span></li></ul>`;
  fig.insertAdjacentHTML("afterend", leg);
  const NAR = () => (el.clientWidth || 600) < 480;
  const FORM = (c, r) => r === 2 ? { A: "1", B: f2(GSTART[x.gk][1][0]) + " (donnée de départ)", C: f2(GSTART[x.gk][1][1]) + " (donnée de départ)", D: f2(GSTART[x.gk][1][2]) + " (donnée de départ)", E: "=B2+C2/2", F: "=1-E2" }[c]
    : NAR() ? { A: `=A${r - 1}+1`, B: `=E${r - 1}^2`, C: `=2*E${r - 1}*(1-E${r - 1})`, D: `=(1-E${r - 1})^2`, E: `=B${r}+C${r}/2` }[c]
    : { A: `=A${r - 1}+1`, B: `=E${r - 1}^2`, C: `=2*E${r - 1}*F${r - 1}`, D: `=F${r - 1}^2`, E: `=B${r}+C${r}/2`, F: `=1-E${r}` }[c];
  function table() {
    const R = genRows(x.gk, n), head = ["<span class=\"lng\">Génération</span><span class=\"sht\" aria-hidden=\"true\">Gén.</span>", "<span class=\"lng\">f(A//A)</span><span class=\"sht\" aria-hidden=\"true\">f(AA)</span>", "<span class=\"lng\">f(A//a)</span><span class=\"sht\" aria-hidden=\"true\">f(Aa)</span>", "<span class=\"lng\">f(a//a)</span><span class=\"sht\" aria-hidden=\"true\">f(aa)</span>", "<span class=\"lng\">p = f(A)</span><span class=\"sht\" aria-hidden=\"true\">p</span>", "<span class=\"lng\">q = f(a)</span><span class=\"sht\" aria-hidden=\"true\">q</span>"], L = NAR() ? "ABCDE" : "ABCDEF";
    return `<div class="tablewrap"><table class="t xls"><thead><tr><th class="xc"></th>${[...L].map(c => `<th class="xc">${c}</th>`).join("")}</tr><tr><th class="xr">1</th>${head.slice(0, L.length).map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${R.map((r, i) => { const rr = i + 2, v = [String(i + 1), f2(r.a), f2(r.b), f2(r.c), f2(r.p), f2(r.q)].slice(0, L.length); return `<tr><th class="xr">${rr}</th>${v.map((t, j) => `<td class="n" tabindex="0" data-c="${L[j]}" data-r="${rr}" ${cur === L[j] + rr ? 'aria-current="true"' : ""}>${t}</td>`).join("")}</tr>`; }).join("")}</tbody></table></div>${NAR() ? `<p class="cap" style="margin:0">Sur petit écran : f(AA) = f(A//A), etc. ; la colonne F (q = 1 − p) est masquée et les formules utilisent 1 − p.</p>` : ""}`;
  }
  function fx(c, r) { const R = genRows(x.gk, n), row = R[r - 2], v = { A: String(r - 1), B: f2(row.a), C: f2(row.b), D: f2(row.c), E: f2(row.p), F: f2(row.q) }[c]; $("[data-fxt]", el).innerHTML = `<b>${c}${r}</b> ${FORM(c, r)} ${String(FORM(c, r)).startsWith("=") ? "→ " + v : ""}`; }
  function paint() {
    $$("[data-gk]", el).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.gk === x.gk)));
    $("[data-next]", el).disabled = $("[data-all]", el).disabled = n >= 10; $("[data-g1]", el).disabled = n <= 1;
    $("[data-tab]", el).innerHTML = table(); chart.draw();
    $$("[data-tab] td", el).forEach(td => { const go = () => { cur = td.dataset.c + td.dataset.r; fx(td.dataset.c, +td.dataset.r); $$("[data-tab] td", el).forEach(t => t.removeAttribute("aria-current")); td.setAttribute("aria-current", "true"); }; td.onclick = go; td.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }; });
  }
  const setN = v => { n = clampN(v, 1, 10); x.gn = n; x.gtry[x.gk] = Math.max(x.gtry[x.gk] || 0, n); keep(); paint(); };
  $("[data-next]", el).onclick = () => setN(n + 1);
  $("[data-all]", el).onclick = () => { if (RMO) { setN(10); return; } const t = setInterval(() => { if (n >= 10 || !document.body.contains(el)) { clearInterval(t); return; } setN(n + 1); }, 220); };
  $("[data-g1]", el).onclick = () => { cur = null; $("[data-fxt]", el).textContent = "Touche une cellule."; setN(1); };
  $$("[data-gk]", el).forEach(b => b.onclick = () => { x.gk = b.dataset.gk; cur = null; $("[data-fxt]", el).textContent = "Touche une cellule."; setN(1); b.focus(); });
  fig.addEventListener("pointerdown", ev => { const P = ptOf(fig, ev); if (!P || !G) return; const i = Math.round((P[0] - G.L) / G.pw * 9); if (i < 0 || i > 9) return; const R = genRows(x.gk, n); if (i >= R.length) { $("[data-ro]", el).textContent = `Génération ${i + 1} : pas encore calculée.`; return; } const r = R[i]; $("[data-ro]", el).innerHTML = `Génération ${i + 1} : f(A//A) = <b>${f2(r.a)}</b> · f(A//a) = <b>${f2(r.b)}</b> · f(a//a) = <b>${f2(r.c)}</b>`; });
  if (window.ResizeObserver) { let nw = NAR(); new ResizeObserver(() => { if (NAR() !== nw && document.body.contains(el)) { nw = NAR(); cur = null; $("[data-fxt]", el).textContent = "Touche une cellule."; paint(); } }).observe(el); }
  paint();
};
WID.py = el => {
  let p = 0.4; const out = []; for (let g = 2; g <= 10; g++) { const a = p * p, b = 2 * p * (1 - p), c = (1 - p) * (1 - p); p = a + b / 2; out.push(`${g} ${+a.toFixed(2)} ${+b.toFixed(2)} ${+c.toFixed(2)} ${+p.toFixed(2)}`); }
  el.innerHTML = `<p class="lead">Le même modèle, écrit en Python : une boucle calcule les générations 2 à 10 à partir de p = 0,4.</p>
    <pre class="code" aria-label="Programme Python"><span class="cm"># Modèle de Hardy-Weinberg : un gène, deux allèles A et a</span>
p = 0.4                         <span class="cm"># fréquence de A à la génération 1</span>
<span class="kw">for</span> g <span class="kw">in</span> range(2, 11):          <span class="cm"># générations 2 à 10</span>
    fAA = p**2                  <span class="cm"># probabilité p × p</span>
    fAa = 2*p*(1-p)             <span class="cm"># deux cases (A//a) : 2pq</span>
    faa = (1-p)**2              <span class="cm"># q × q</span>
    p = fAA + fAa/2             <span class="cm"># fréquence de A dans la génération g</span>
    print(g, round(fAA, 2), round(fAa, 2), round(faa, 2), round(p, 2))</pre>
    <p class="kicker" style="margin:0">Ce qu'affiche le programme</p><pre class="code out">${out.join("\n")}</pre>
    <p class="cap">Python écrit les nombres avec un point (0.16 = 0,16) et ne garde pas les zéros inutiles (0.4 = 0,40).</p>`;
};

/* ======================= LES OBSERVATIONS DU MANUEL FACE AU MODÈLE ======================= */
const OBS = [0.40, 0.46, 0.52, 0.57, 0.60, 0.63, 0.65, 0.67, 0.68, 0.69];
WID.obs = el => {
  const x = xst(); let k = x.obsRun ? 10 : 0, G = null;
  el.innerHTML = `<div class="hw"><div class="row animctl" data-an></div>
    <div class="row"><button type="button" class="btn ghost" data-mod aria-pressed="false"></button></div>
    <div class="figbox chartbox" data-fig></div><p class="readout" data-ro aria-live="polite">${CT.readHint}</p><div data-tab></div></div>`;
  const fig = $("[data-fig]", el);
  const chart = liveSVG(fig, (W, F) => {
    const o = frame(W, F, { x0: 1, x1: 10, y0: 0, y1: 1, xt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(v => W > 480 || v % 2 === 1 || v === 10), yt: [0, 0.2, 0.4, 0.6, 0.8, 1], xl: "Génération", yl: "Fréquence de A (p)", ph: Math.max(F * 8, Math.min(W * 0.48, 320)) }), g = o.g;
    if (x.obsModel) g.push(`<line x1="${o.X(1).toFixed(1)}" x2="${o.X(10).toFixed(1)}" y1="${o.Y(0.4).toFixed(1)}" y2="${o.Y(0.4).toFixed(1)}" style="stroke:var(--c2);stroke-width:3.5" stroke-dasharray="10 6"/>` + sT(o.X(10), o.Y(0.4) + o.tk * 1.3, "Modèle de Hardy-Weinberg", "end", o.tk * 0.9, `font-weight="700" style="fill:var(--c2)"`));
    const kk = Math.floor(k), pts = OBS.slice(0, kk).map((v, i) => [o.X(i + 1), o.Y(v)]);
    if (pts.length > 1) g.push(`<polyline points="${pts.map(q => q.map(v => v.toFixed(1)).join(",")).join(" ")}" style="fill:none;stroke:var(--c1);stroke-width:3"/>`);
    pts.forEach(([X, Y]) => g.push(`<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="6" style="fill:var(--c1);stroke:var(--surface);stroke-width:2"/>`));
    if (kk >= 10) g.push(sT(o.X(10), o.Y(0.69) - o.tk * 0.8, "Observations", "end", o.tk * 0.9, `font-weight="700" style="fill:var(--c1)"`));
    if (!kk) g.push(sT(o.L + o.pw / 2, o.T + o.ph * 0.25, "Lance l'affichage des observations", "middle", o.tk));
    G = o; return svgWrap(W, o.H, "Fréquence de l'allèle A observée au fil des générations", g.join(""));
  });
  function paint() {
    const b = $("[data-mod]", el); b.textContent = x.obsModel ? "✓ Prévision du modèle affichée" : "📐 Afficher la prévision du modèle de Hardy-Weinberg"; b.setAttribute("aria-pressed", String(!!x.obsModel));
    const kk = Math.floor(k), rows = OBS.map((v, i) => [String(i + 1), i < kk ? f2(v) : "…", x.obsModel ? "0,40" : "—"]);
    $("[data-tab]", el).innerHTML = `<div class="tablewrap"><table class="t simtab"><caption>Fréquence de l'allèle A · données du manuel (doc. 3 p. 193)</caption><thead><tr><th>Génération</th><th>p observé</th><th>p prévu par le modèle</th></tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    chart.draw();
  }
  animCtl($("[data-an]", el), 3000, t => { k = t <= 0 ? 0 : t >= 1 ? 10 : 1 + t * 9; if (t >= 1 && !x.obsRun) { x.obsRun = true; keep(); } paint(); });
  $("[data-an]", el).insertAdjacentHTML("beforeend", `<span class="lead">Les mesures des chercheurs apparaissent génération après génération.</span>`);
  if (x.obsRun) { k = 10; paint(); }
  $("[data-mod]", el).onclick = () => { x.obsModel = !x.obsModel; keep(); paint(); $("[data-mod]", el).focus(); };
  fig.addEventListener("pointerdown", ev => { const P = ptOf(fig, ev); if (!P || !G) return; const i = Math.round((P[0] - G.L) / G.pw * 9); if (i < 0 || i > 9) return; $("[data-ro]", el).innerHTML = `Génération ${i + 1} : p observé = <b>${i < Math.floor(k) ? f2(OBS[i]) : "pas encore affiché"}</b>${x.obsModel ? ` · p prévu par le modèle = <b>0,40</b>` : ""}`; });
  paint();
};

/* ======================= LE LABO DES FORCES ÉVOLUTIVES ======================= */
const FW = { sex: [3, 2.4, 1], pred: [0.55, 0.8, 1] }, MIG = { m: 0.1, p: 0.1 }, MUT = 1e-5, NG = 30;
const SIZES = { inf: "Très grande (modèle)", n1000: "1 000 araignées", n50: "50 araignées" };
function binom(n, p, R) { let k = 0; for (let i = 0; i < n; i++) if (R() < p) k++; return k; }
function simulate(c, R) {
  R = R || Math.random; let p = 0.4; const out = [p];
  for (let g = 2; g <= NG; g++) {
    const q = 1 - p; let w = [1, 1, 1];
    if (c.sex) w = w.map((v, i) => v * FW.sex[i]); if (c.pred) w = w.map((v, i) => v * FW.pred[i]);
    const wb = p * p * w[0] + 2 * p * q * w[1] + q * q * w[2]; p = (p * p * w[0] + p * q * w[1]) / wb;
    if (c.mig) p = (1 - MIG.m) * p + MIG.m * MIG.p;
    if (c.mut) p = p * (1 - MUT);
    if (c.size && c.size !== "inf") { const n2 = c.size === "n50" ? 100 : 2000; p = binom(n2, p, R) / n2; }
    out.push(p);
  }
  return out;
}
const pDet = (c, g) => simulate(Object.assign({}, c, { size: "inf" }))[g - 1];
function fruns() { const x = xst(); if (!Array.isArray(x.fr)) x.fr = []; return x.fr; }
const noSel = r => !r.sex && !r.pred, pure = r => noSel(r) && !r.mig && !r.mut;
const hasF = pred => fruns().some(pred), cntF = pred => fruns().filter(pred).length;
function forceTxt(r) { const f = []; if (r.sex) f.push("sélection sexuelle"); if (r.pred) f.push("prédation"); if (r.mig) f.push("migration"); if (r.mut) f.push("mutation"); return (f.length ? f.join(" + ") : "aucune force") + " · " + (r.size === "inf" ? "très grande population" : SIZES[r.size]); }
function forW(el, mode) {
  const x = xst(), key = mode === "sel" ? "fs" : "fa"; if (!x[key] || typeof x[key] !== "object") x[key] = {}; const u = x[key];
  const D = mode === "sel" ? { sex: false, pred: false } : { sex: false, pred: false, size: "inf", mig: false, mut: false }; Object.keys(D).forEach(k => { if (typeof u[k] !== typeof D[k]) u[k] = D[k]; }); if (u.size && !SIZES[u.size]) u.size = "inf";
  const OK_ = mode === "sel" ? "fobs" : "fobsA"; if (x[OK_] === undefined) x[OK_] = mode === "sel";
  const mine = () => fruns().filter(r => (r.m || "sel") === mode);
  let anim = null, G = null;
  const yn = (k, lab, sub) => `<div class="field"><span class="plab" id="fl-${k}">${lab}</span><div class="seg" role="group" aria-labelledby="fl-${k}"><button type="button" data-f="${k}" data-v="0">Non</button><button type="button" data-f="${k}" data-v="1">Oui</button></div>${sub ? `<p class="cap" style="margin:.2rem 0 0">${sub}</p>` : ""}</div>`;
  el.innerHTML = `<div class="simc hw"><div class="simp" role="group" aria-label="Réglages des forces évolutives"><p class="simh">1 · Je règle les forces évolutives</p>
      ${yn("sex", "Sélection sexuelle : les femelles préfèrent les mâles contrastés", "Succès reproducteur relatif : (a//a) × 1 · (A//a) × 2,4 · (A//A) × 3")}
      ${yn("pred", "Prédation : les araignées contrastées sont plus repérées", "Survie relative : (a//a) 1 · (A//a) 0,8 · (A//A) 0,55")}
      ${mode === "all" ? `<div class="field"><span class="plab" id="fl-size">Taille de la population</span><div class="seg" role="group" aria-labelledby="fl-size">${Object.entries(SIZES).map(([k, v]) => `<button type="button" data-sz="${k}">${v}</button>`).join("")}</div><p class="cap" style="margin:.2rem 0 0">Dans une population finie, les allèles transmis sont tirés au hasard parmi ceux des parents.</p></div>
      ${yn("mig", "Migration : 10 % d'arrivants par génération", "Ils viennent d'une population voisine où f(A) = 0,10.")}
      ${yn("mut", "Mutations : A devient a", "Taux réaliste : 1 allèle A sur 100 000 par génération.")}` : `<p class="cap" style="margin:0">Population très grande, sans migration ni mutation.</p>`}
      <div class="row"><button type="button" class="btn" data-go>▶ Lancer ${NG} générations</button><button type="button" class="btn ghost" data-pz hidden>⏸ Pause</button></div><p class="lead" data-msg aria-live="polite"></p></div>
    <div class="simr"><p class="simh">2 · J'observe l'évolution de la fréquence de A</p>
      <div class="row"><button type="button" class="btn ghost sm" data-obs aria-pressed="false"></button></div>
      <div class="figbox chartbox" data-fig></div><p class="readout" data-ro aria-live="polite">${CT.readHint}</p><ul class="simleg" data-leg></ul><div data-tab></div>
      <div class="row"><button type="button" class="btn ghost" data-clr>↺ Effacer les courbes</button></div></div></div>`;
  const fig = $("[data-fig]", el), shown = () => mine().slice(-6);
  const chart = liveSVG(fig, (W, F) => {
    const o = frame(W, F, { x0: 1, x1: NG, y0: 0, y1: 1, xt: [1, 5, 10, 15, 20, 25, 30].filter(v => W > 420 || v % 10 === 0 || v === 1), yt: [0, 0.2, 0.4, 0.6, 0.8, 1], xl: "Génération", yl: "Fréquence de A (p)" }), g = o.g;
    const L2 = shown(); L2.forEach((r, s) => { const kk = anim && anim.r === r ? Math.max(1, Math.floor(anim.k)) : NG, pts = r.ps.slice(0, kk).map((v, i) => [o.X(i + 1), o.Y(v)]); const c = `var(--c${1 + (r.id - 1) % 6})`;
      g.push(`<polyline points="${pts.map(q => q.map(v => v.toFixed(1)).join(",")).join(" ")}" style="fill:none;stroke:${c};stroke-width:3" stroke-dasharray="${DASH(r.id - 1)}"/>`);
      if (kk >= NG) { const [X, Y] = pts[pts.length - 1]; g.push(`<circle cx="${X.toFixed(1)}" cy="${Y.toFixed(1)}" r="4" style="fill:${c}"/>` + sT(X - 4, Y - 8, "n° " + r.id, "end", o.tk * 0.8, `font-weight="700" style="fill:${c}"`)); } });
    if (x[OK_]) OBS.forEach((v, i) => g.push(`<circle cx="${o.X(i + 1).toFixed(1)}" cy="${o.Y(v).toFixed(1)}" r="5.5" style="fill:var(--surface);stroke:var(--ink);stroke-width:2.5"/>`));
    if (!L2.length) g.push(sT(o.L + o.pw / 2, o.T + o.ph * 0.15, "Lance une simulation", "middle", o.tk));
    G = o; return svgWrap(W, o.H, "Fréquence de l'allèle A au fil des générations, selon les forces évolutives", g.join(""));
  });
  function legend() {
    const L2 = shown(); $("[data-leg]", el).innerHTML = (x[OK_] ? `<li><svg width="22" height="16" aria-hidden="true"><circle cx="11" cy="8" r="5" style="fill:var(--surface);stroke:var(--ink);stroke-width:2.5"/></svg><span class="sn">Observations du manuel (générations 1 à 10)</span></li>` : "") +
      L2.map(r => `<li><svg width="30" height="16" aria-hidden="true"><line x1="2" x2="28" y1="8" y2="8" style="stroke:var(--c${1 + (r.id - 1) % 6});stroke-width:3" stroke-dasharray="${DASH(r.id - 1)}"/></svg><span class="sn"><b>n° ${r.id}</b> · ${forceTxt(r)}</span></li>`).join("");
    const nar = (el.clientWidth || 600) < 700, R = mine().slice(-10);
    $("[data-tab]", el).innerHTML = R.length ? `<div class="tablewrap"><table class="t simtab"><caption>Mes simulations de cette étape${mine().length > 10 ? " (les 10 dernières)" : ""} · ⚠ ${SIMUL}</caption><thead><tr>${(nar ? ["Simulation", "p à la génération 10", "p à la génération 30"] : ["Simulation", "Forces et population", "p à la génération 10", "p à la génération 30"]).map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${R.map(r => `<tr><td>${nar ? `<b>n° ${r.id}</b><br><span class="muted">${forceTxt(r)}</span>` : `n° ${r.id}`}</td>${nar ? "" : `<td>${forceTxt(r)}</td>`}<td class="n">${f2(r.ps[9])}</td><td class="n">${f2(r.ps[NG - 1])}</td></tr>`).join("")}</tbody></table></div>` : `<p class="locked">Tes simulations apparaîtront ici.</p>`;
  }
  function paint() {
    $$("[data-f]", el).forEach(b => b.setAttribute("aria-pressed", String(!!u[b.dataset.f] === (b.dataset.v === "1"))));
    $$("[data-sz]", el).forEach(b => b.setAttribute("aria-pressed", String(u.size === b.dataset.sz)));
    $$("[data-f],[data-sz],[data-go],[data-clr]", el).forEach(b => b.disabled = !!anim);
    const ob = $("[data-obs]", el); ob.textContent = x[OK_] ? "✓ Observations du manuel affichées" : "Afficher les observations du manuel"; ob.setAttribute("aria-pressed", String(!!x[OK_]));
    const pz = $("[data-pz]", el); pz.hidden = !anim; if (anim) pz.textContent = anim.pause ? "▶ Reprendre" : "⏸ Pause";
    legend(); chart.draw();
  }
  $$("[data-f]", el).forEach(b => b.onclick = () => { u[b.dataset.f] = b.dataset.v === "1"; keep(); paint(); b.focus(); });
  $$("[data-sz]", el).forEach(b => b.onclick = () => { u.size = b.dataset.sz; keep(); paint(); b.focus(); });
  $("[data-obs]", el).onclick = () => { x[OK_] = !x[OK_]; keep(); paint(); $("[data-obs]", el).focus(); };
  $("[data-go]", el).onclick = () => {
    if (anim) return; const c = { sex: !!u.sex, pred: !!u.pred, size: mode === "all" ? u.size : "inf", mig: mode === "all" && !!u.mig, mut: mode === "all" && !!u.mut };
    const r = Object.assign({ id: (x.fid = (x.fid || 0) + 1), m: mode }, c, { ps: simulate(c).map(v => Math.round(v * 1e5) / 1e5) }); const L = fruns(); L.push(r); while (L.length > 16) L.shift(); keep();
    $("[data-msg]", el).textContent = `Simulation n° ${r.id} : ${forceTxt(r)}.`;
    anim = { r, k: 1, pause: false }; let lt = 0; paint();
    const fr = ts => { if (!document.body.contains(el) || !anim) { anim = null; return; } const dt = lt ? Math.min(100, ts - lt) : 16; lt = ts; if (!anim.pause) anim.k += NG * dt / (RMO ? 1 : 1800); if (anim.k >= NG) { anim = null; paint(); $("[data-go]", el).focus(); return; } chart.draw(); requestAnimationFrame(fr); };
    requestAnimationFrame(fr);
  };
  $("[data-pz]", el).onclick = () => { if (!anim) return; anim.pause = !anim.pause; paint(); $("[data-pz]", el).focus(); };
  armButton($("[data-clr]", el), "↺ Effacer les courbes", "Confirmer : effacer les courbes de cette étape ?", () => { x.fr = fruns().filter(r => (r.m || "sel") !== mode); keep(); paint(); });
  fig.addEventListener("pointerdown", ev => { const P = ptOf(fig, ev); if (!P || !G) return; const g = Math.round((P[0] - G.L) / G.pw * (NG - 1)) + 1; if (g < 1 || g > NG) return; const L2 = shown();
    $("[data-ro]", el).innerHTML = `Génération ${g} : ` + [x[OK_] && g <= 10 ? `observations <b>${f2(OBS[g - 1])}</b>` : "", ...L2.map(r => `n° ${r.id} <b>${f2(r.ps[g - 1])}</b>`)].filter(Boolean).join(" · ") || `Génération ${g} : aucune courbe.`; });
  if (window.ResizeObserver) { let nw = (el.clientWidth || 600) < 700; new ResizeObserver(() => { const n = (el.clientWidth || 600) < 700; if (n !== nw && document.body.contains(el)) { nw = n; legend(); } }).observe(el); }
  paint();
}
WID.forsel = el => forW(el, "sel");
WID.forall = el => forW(el, "all");

/* ======================= LE COMPARATEUR OBSERVÉ / ATTENDU ======================= */
const CMPD = { mn: { N: 1000, obs: [292, 496, 212], g: ["(M//M)", "(M//N)", "(N//N)"], al: "M", first: true, unit: "personnes" },
  hb: { N: 1000, obs: [671, 328, 1], g: ["(A//A)", "(A//S)", "(S//S)"], al: "S", first: false, unit: "adultes" } };
const expOf = (d, v) => { const a = d.first ? v : 1 - v, b = 1 - a; return [a * a, 2 * a * b, b * b].map(f => f * d.N); };
function cmpW(el, key) {
  const x = xst(); if (!x.cmp || typeof x.cmp !== "object") x.cmp = {}; const d = CMPD[key]; let G = null;
  el.innerHTML = `<div class="hw"><div class="field"><label for="cv-${key}">Ta valeur de la fréquence de l'allèle ${d.al} : <b>f(${d.al})</b></label><div class="row"><input id="cv-${key}" class="inp" inputmode="decimal" autocomplete="off" style="max-width:9rem" value="${x.cmp[key] !== undefined ? fmt(x.cmp[key]) : ""}"><button type="button" class="btn" data-go>📊 Tracer les effectifs attendus</button></div><p class="pfb" data-e aria-live="polite"></p></div>
    <div class="figbox chartbox" data-fig></div><p class="readout" data-ro aria-live="polite">${CT.readHint}</p>
    <ul class="simleg hwleg"><li><span class="lg" style="background:var(--c1)"></span><span class="sn">Effectifs observés (nombre écrit au-dessus)</span></li><li><span class="lg dash"></span><span class="sn">Effectifs attendus selon le modèle, calculés avec ta valeur (sans nombre : à toi de les calculer)</span></li></ul></div>`;
  const fig = $("[data-fig]", el);
  const chart = liveSVG(fig, (W, F) => {
    const v = x.cmp[key], E = v === undefined ? null : expOf(d, v), top = Math.max(...d.obs, ...(E || [0])) * 1.12, st = top > 600 ? 200 : 100, ymax = Math.ceil(top / st) * st, yt = []; for (let t = 0; t <= ymax; t += st) yt.push(t);
    const o = frame(W, F, { x0: 0, x1: 3, y0: 0, y1: ymax, xt: [], yt, xl: "Génotype", yl: `Effectif (${d.unit})`, ph: Math.max(F * 8, Math.min(W * 0.45, 300)) }), g = o.g, bw = o.pw / 3 * 0.3;
    d.g.forEach((lab, i) => { const cx = o.X(i + 0.5); g.push(sT(cx, o.T + o.ph + o.tk * 1.3, lab, "middle", o.tk, `font-weight="700"`));
      const y = o.Y(d.obs[i]); g.push(`<rect x="${(cx - bw - 3).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${(o.T + o.ph - y).toFixed(1)}" style="fill:var(--c1)"/>` + sT(cx - bw / 2 - 3, y - 6, fmt(d.obs[i]), "middle", o.tk * 0.9, `font-weight="700"`));
      if (E) { const ye = o.Y(E[i]); g.push(`<rect x="${(cx + 3).toFixed(1)}" y="${ye.toFixed(1)}" width="${bw.toFixed(1)}" height="${(o.T + o.ph - ye).toFixed(1)}" style="fill:var(--c2);fill-opacity:.15;stroke:var(--c2);stroke-width:2.5" stroke-dasharray="6 4"/>`); } });
    G = o; return svgWrap(W, o.H, "Effectifs observés et attendus par génotype", g.join(""));
  });
  const go = () => { const inp = $(`#cv-${key}`, el), v = parseNum(inp.value), e = $("[data-e]", el); if (!Number.isFinite(v) || v < 0 || v > 1) { e.className = "pfb bad"; e.textContent = "Écris une fréquence entre 0 et 1 (par exemple 0,25)."; return; } e.className = "pfb"; e.textContent = `Effectifs attendus tracés pour f(${d.al}) = ${fmt(v)}.`; x.cmp[key] = v; keep(); chart.draw(); };
  $("[data-go]", el).onclick = go; $(`#cv-${key}`, el).addEventListener("keydown", ev => { if (ev.key === "Enter") go(); });
  fig.addEventListener("pointerdown", ev => { const P = ptOf(fig, ev); if (!P || !G) return; const i = Math.floor((P[0] - G.L) / G.pw * 3); if (i < 0 || i > 2) return; $("[data-ro]", el).innerHTML = `${d.g[i]} : <b>${fmt(d.obs[i])}</b> ${d.unit} observés${x.cmp[key] !== undefined ? " · barre en pointillés : effectif attendu avec ta valeur" : ""}.`; });
}
WID.cmpmn = el => cmpW(el, "mn");
WID.cmphb = el => cmpW(el, "hb");

/* ---------- récapitulatif (dernière étape) et tableaux du bilan ---------- */
function frunsTable() {
  const R = fruns(); if (!R.length) return `<p class="locked">Aucune simulation dans le labo des forces pour l'instant.</p>`;
  return tbl(["Simulation", "Forces et population", "p (génération 10)", "p (génération 30)"], R.slice(-12).map(r => [`n° ${r.id}`, forceTxt(r), f2(r.ps[9]), f2(r.ps[NG - 1])]));
}
function gamTable() { const c = gm(), T = gTot(); if (!T) return `<p class="locked">Aucune fécondation simulée pour l'instant.</p>`; return tbl(["Génotype", "Descendants", "Fréquence observée"], [[GT[0], fmt(c[0]), f3(c[0] / T)], [GT[1], fmt(c[1] + c[2]), f3((c[1] + c[2]) / T)], [GT[2], fmt(c[3]), f3(c[3] / T)]]); }
WID.recap = el => { el.innerHTML = `<p class="kicker">Le bal des gamètes (${fmt(gTot())} fécondations)</p>${gamTable()}<p class="kicker">Le labo des forces évolutives</p>${frunsTable()}`; };
