/* ===== 5e EIST · Mission 6 · Activité 3 · Créer son programme : éditeur de blocs et Thymio virtuel (moteur : tprog_sim.js, dessin : robot.js) ===== */
Store.key = "eist5-thymio-prog-v1";
const WID = {}, LIVE = {};
const clone = p => JSON.parse(JSON.stringify(p || []));
const B_ = (e, ...a) => ({ e, a });
/* les défis : scène, familles de blocs proposées en version guidée, programme de départ de la version guidée */
const DFS = {
  d1: { scene: "bac", E: ["t"], A: ["d", "v"], scaf: [B_("b_av"), B_("b_ar"), B_("b_g"), B_("b_d")] },
  d2: { scene: "bac", E: ["t"], A: ["d", "v"], scaf: [B_("b_av")] },
  d3: { scene: "bac", E: ["t", "c"], A: ["m", "d", "s"], scaf: [B_("b_av"), B_("b_ar"), B_("b_g"), B_("b_d"), B_("choc")] },
  d4: { scene: "trousses", E: ["t", "p"], A: ["m"], scaf: [B_("b_av"), B_("p_dev"), B_("p_der"), B_("b_ar")] },
  d5: { scene: "piste", E: ["t", "s"], A: ["m"], scaf: [B_("s_nn"), B_("s_bn"), B_("s_nb"), B_("s_bb")] },
  laby: { scene: "laby", E: ["t", "p"], A: ["m"], scaf: [B_("b_av", "m_av"), B_("p_rien"), B_("p_g"), B_("p_d"), B_("p_dev")] } };
const DNAME = { d1: "Défi 1 · un dos qui change de couleur", d2: "Défi 2 · un événement, deux actions", d3: "Défi 3 · un robot obéissant", d4: "Défi 4 · l'aller-retour sans fin", d5: "Défi 5 · le suiveur de ligne", laby: "Mission · le labyrinthe" };
/* les programmes préenregistrés à lire (partie 1) : sans couleur, pour les reconnaître à leurs instructions */
const PRESET = { A: [B_("p_rien", "m_st"), B_("p_dev", "m_ar"), B_("p_der", "m_av")], B: [B_("b_av", "m_av"), B_("b_ar", "m_ar"), B_("b_g", "m_g"), B_("b_d", "m_d"), B_("b_c", "m_st")],
  C: [B_("p_rien", "m_av"), B_("p_g", "m_d"), B_("p_d", "m_g"), B_("p_dev", "m_ar")], D: [B_("p_rien", "m_st"), B_("p_dev", "m_av"), B_("p_g", "m_g"), B_("p_d", "m_d")] };
const MAXB = 8, MAXA = 4;
function progOf(k) { const X = xst(); X.progs = X.progs || {}; if (!X.progs[k]) X.progs[k] = (typeof EXP === "function" && EXP()) ? [] : clone(DFS[k].scaf); return X.progs[k]; }
const okOf = k => !!((xst().ok || {})[k]);

/* ---------- l'éditeur de blocs : LORSQUE (événement) → ALORS (actions) ---------- */
function editor(host, opts) {
  let open = null;
  const allowE = () => (typeof EXP === "function" && EXP()) || !opts.E ? Object.keys(EVG) : opts.E, allowA = () => (typeof EXP === "function" && EXP()) || !opts.A ? Object.keys(ACG) : opts.A;
  const sw = c => c === "eteint" ? `<i class="sw off"></i>` : `<i class="sw" style="background:${TCOL[c]}"></i>`;
  const acHTML = a => { const A = ACTS[a]; return A.g === "d" || A.g === "v" ? `${sw(A.c)}${esc(A.t)}` : `<span aria-hidden="true">${A.i}</span> ${esc(A.t)}`; };
  const evHTML = e => `<span aria-hidden="true">${EVS[e].i}</span> ${esc(EVS[e].t)}`;
  const chooser = (b) => {
    if (!open || open.b !== b) return "";
    if (open.k === "ev") return `<div class="choose" role="group" aria-label="Choisir l'événement">${allowE().map(g => `<p class="cg">${EVG[g]}</p><div class="cc">${Object.keys(EVS).filter(e => EVS[e].g === g).map(e => `<button type="button" class="chipe" data-pe="${e}">${evHTML(e)}</button>`).join("")}</div>`).join("")}<div class="row"><button type="button" class="btn ghost" data-close>Fermer</button></div></div>`;
    return `<div class="choose" role="group" aria-label="Choisir l'action">${allowA().map(g => `<p class="cg">${ACG[g]}</p><div class="cc">${Object.keys(ACTS).filter(a => ACTS[a].g === g).map(a => `<button type="button" class="chipe ${ACTS[a].g === "d" || ACTS[a].g === "v" ? "col" : ""}" data-pa="${a}">${acHTML(a)}</button>`).join("")}</div>`).join("")}<div class="row">${open.k === "rep" ? `<button type="button" class="btn ghost" data-rm>🗑 Retirer cette action</button>` : ""}<button type="button" class="btn ghost" data-close>Fermer</button></div></div>`;
  };
  const paint = () => {
    const P = opts.get();
    if (opts.ro) { host.innerHTML = `<ol class="prg ro">${P.map(b => `<li class="pblk"><div class="pbh"><span class="pkw">LORSQUE</span><span class="pev ro">${evHTML(b.e)}</span></div><div class="pba"><span class="pkw">ALORS</span><div class="pacts">${b.a.map(a => `<span class="pact ro">${acHTML(a)}</span>`).join("")}</div></div></li>`).join("")}</ol>`; return; }
    host.innerHTML = `<ol class="prg">${P.map((b, i) => `<li class="pblk" data-b="${i}"><div class="pbh"><span class="pkw">LORSQUE</span><button type="button" class="pev ${b.e ? "" : "empty"}" data-ev="${i}" aria-label="Bloc ${i + 1}, événement : ${b.e ? esc(EVS[b.e].t) : "à choisir"}">${b.e ? evHTML(b.e) : "choisir un événement…"}</button><button type="button" class="btn ghost pdel" data-del="${i}" aria-label="Supprimer le bloc ${i + 1}">🗑</button></div>
      <div class="pba"><span class="pkw">ALORS</span><div class="pacts">${b.a.map((a, j) => `<button type="button" class="pact" data-ac="${i}:${j}" aria-label="Bloc ${i + 1}, action ${j + 1} : ${esc(ACTS[a].t)}. Toucher pour changer.">${acHTML(a)}</button>`).join("")}${b.a.length < MAXA ? `<button type="button" class="padd ${b.a.length ? "" : "empty"}" data-add="${i}" aria-label="Bloc ${i + 1} : ajouter une action">+ action</button>` : ""}</div></div>${chooser(i)}</li>`).join("")}</ol>
      <div class="row">${P.length < MAXB ? `<button type="button" class="btn ghost" data-newb>+ Ajouter un bloc</button>` : `<span class="lead">${MAXB} blocs au maximum.</span>`}</div>`;
    const ch = () => { keep(); if (opts.onChange) opts.onChange(); paint(); };
    $$("[data-ev]", host).forEach(b => b.onclick = () => { const i = +b.dataset.ev; open = open && open.b === i && open.k === "ev" ? null : { b: i, k: "ev" }; paint(); const n = $(".choose button", host); if (n) n.focus(); });
    $$("[data-add]", host).forEach(b => b.onclick = () => { const i = +b.dataset.add; open = open && open.b === i && open.k === "add" ? null : { b: i, k: "add" }; paint(); const n = $(".choose button", host); if (n) n.focus(); });
    $$("[data-ac]", host).forEach(b => b.onclick = () => { const [i, j] = b.dataset.ac.split(":").map(Number); open = { b: i, k: "rep", j }; paint(); const n = $(".choose button", host); if (n) n.focus(); });
    $$("[data-pe]", host).forEach(b => b.onclick = () => { const i = open.b; P[i].e = b.dataset.pe; open = null; ch(); const n = $(`[data-ev="${i}"]`, host); if (n) n.focus(); });
    $$("[data-pa]", host).forEach(b => b.onclick = () => { const i = open.b; if (open.k === "rep") P[i].a[open.j] = b.dataset.pa; else P[i].a.push(b.dataset.pa); open = null; ch(); const n = $(`[data-add="${i}"]`, host) || $(`[data-ev="${i}"]`, host); if (n) n.focus(); });
    const rm = $("[data-rm]", host); if (rm) rm.onclick = () => { const i = open.b; P[i].a.splice(open.j, 1); open = null; ch(); const n = $(`[data-add="${i}"]`, host); if (n) n.focus(); };
    const cl = $("[data-close]", host); if (cl) cl.onclick = () => { const i = open.b; open = null; paint(); const n = $(`[data-ev="${i}"]`, host); if (n) n.focus(); };
    $$("[data-del]", host).forEach(b => armButton(b, "🗑", "Supprimer ?", () => { P.splice(+b.dataset.del, 1); open = null; ch(); }));
    const nb2 = $("[data-newb]", host); if (nb2) nb2.onclick = () => { P.push({ e: null, a: [] }); open = { b: P.length - 1, k: "ev" }; ch(); const n = $(".choose button", host); if (n) n.focus(); };
  };
  paint();
  return { paint, hl(set) { $$(".pblk", host).forEach((li, i) => li.classList.toggle("fire", set.has(i))); } };
}

/* ---------- le Thymio virtuel : scène, robot, touches, mains ---------- */
function stage(host, opts) {
  let alt = false; const ALT = { piste: { x: 5.8, y: 5.45, th: 270 } }[opts.scene];
  let sim = mkSim(opts.scene, opts.prog()), pressK = null, pressT = 0, btnFire = new Map(), run = true, fast = false, done = false;
  const sc = SCENES[opts.scene];
  host.innerHTML = `<div class="figbox"></div>
    <div class="ctl"><div class="pad" role="group" aria-label="Les touches du robot">${[["", "b_av", ""], ["b_g", "b_c", "b_d"], ["", "b_ar", ""]].flat().map(k => k ? `<button type="button" data-tk="${k}" aria-label="Toucher ${EVS[k].t.replace("le bouton ", "le bouton ").replace(" est touché", "")}">${EVS[k].i}</button>` : "<span></span>").join("")}</div>
      <div class="ctl2"><button type="button" class="btn ghost" data-choc>👋 Taper sur le dos</button>${sc.hands ? `<div class="hands" role="group" aria-label="Placer ta main près du robot"><span class="lab3">✋ Ta main :</span>${[["dev", "devant"], ["g", "à gauche"], ["d", "à droite"], ["der", "derrière"], ["", "retirer"]].map(h => `<button type="button" class="btn ghost" data-hd="${h[0]}">${h[1]}</button>`).join("")}</div>` : ""}
      <div class="row"><button type="button" class="btn ghost" data-home>↺ Replacer le robot</button>${ALT ? `<button type="button" class="btn ghost" data-flip aria-pressed="false">⇄ Départ dans l'autre sens</button>` : ""}<button type="button" class="btn ghost" data-run aria-pressed="false">⏸ Pause</button>${opts.fast ? `<button type="button" class="btn ghost" data-fast aria-pressed="false">⏩ Accéléré</button>` : ""}</div></div></div>
    <p class="readout" aria-live="off"></p>`;
  const k0 = () => sim, MOTX = { m_av: "roule en avant", m_ar: "roule en arrière", m_g: "tourne à gauche", m_d: "tourne à droite", m_st: "est arrêté" };
  const fig = liveSVG($(".figbox", host), (W, F) => {
    const S0 = k0(), k = W / sc.W, H = sc.H * k, tk = TK(F) * 0.8, P = S0.P;
    let s = `<rect x="0" y="0" width="${W}" height="${N1(H)}" rx="12" style="fill:${sc.line ? "#fbfaf5" : "#e8edf1"}"/>`;
    if (!sc.line) { for (let i = 1; i < sc.W; i++) s += `<line x1="${N1(i * k)}" x2="${N1(i * k)}" y1="0" y2="${N1(H)}" style="stroke:#d8dfe5;stroke-width:1"/>`; for (let j = 1; j < sc.H; j++) s += `<line y1="${N1(j * k)}" y2="${N1(j * k)}" x1="0" x2="${W}" style="stroke:#d8dfe5;stroke-width:1"/>`; }
    if (sc.line) s += `<polyline points="${sc.line.map(p => `${N1(p[0] * k)},${N1(p[1] * k)}`).join(" ")}" style="fill:none;stroke:#121416;stroke-width:${N1(LWID * k)};stroke-linejoin:round;stroke-linecap:round"/>`;
    if (sc.goal) { const [x1, y1, x2, y2] = sc.goal, ok = done; s += `<rect x="${N1(x1 * k)}" y="${N1(y1 * k)}" width="${N1((x2 - x1) * k)}" height="${N1((y2 - y1) * k)}" rx="6" style="fill:${ok ? "#d6f5dd" : "#fff4c9"};stroke:#c9a200;stroke-width:2;stroke-dasharray:6 4"/>`;
      [0, 1].forEach(i => { const px = x1 + 0.25 + i * ((x2 - x1 - 0.5) / 2 + 0.05), py = y1 + 0.25; s += `<rect x="${N1(px * k)}" y="${N1(py * k)}" width="${N1(((x2 - x1 - 0.5) / 2 - 0.05) * k)}" height="${N1(1.0 * k)}" rx="3" style="fill:${ok ? "#2f6fe0" : "#3c5a86"};stroke:#1c2a40;stroke-width:1.5"/>`; });
      s += sX((x1 + x2) / 2 * k, (y2 - 0.25) * k, ok ? "⚡ nettoyés !" : "panneaux", "middle", tk * 0.9, 'font-weight="800" style="fill:#5a4500"');
      s += `<rect x="${N1(0.1 * k)}" y="${N1(5.15 * k)}" width="${N1(2.1 * k)}" height="${N1(1.8 * k)}" rx="6" style="fill:#dfe5ea;opacity:.7"/>` + sX(1.15 * k, 6.85 * k, "BASE", "middle", tk * 0.9, 'font-weight="800" style="fill:#1d2a33"'); }
    sc.walls.forEach(g => { s += `<line x1="${N1(g[0] * k)}" y1="${N1(g[1] * k)}" x2="${N1(g[2] * k)}" y2="${N1(g[3] * k)}" style="stroke:#7a5a3c;stroke-width:${N1(Math.max(5, 0.16 * k))};stroke-linecap:round"/>`; });
    (sc.objs || []).forEach(o => { s += `<rect x="${N1(o[0] * k)}" y="${N1(o[1] * k)}" width="${N1((o[2] - o[0]) * k)}" height="${N1((o[3] - o[1]) * k)}" rx="${N1(0.2 * k)}" style="fill:#2f6fb0;stroke:#173a63;stroke-width:2"/><line x1="${N1((o[0] + 0.25) * k)}" x2="${N1((o[2] - 0.25) * k)}" y1="${N1((o[1] + o[3]) / 2 * k)}" y2="${N1((o[1] + o[3]) / 2 * k)}" style="stroke:#c7d6ea;stroke-width:2;stroke-dasharray:3 3"/>` + sX((o[0] + o[2]) / 2 * k, (o[1] < sc.H / 2 ? o[3] + 0.15 : o[1] - 0.15) * k + (o[1] < sc.H / 2 ? tk : -4), o[4], "middle", tk * 0.9, 'font-weight="700" style="fill:#173a63"'); });
    S0.hands.forEach(h => { s += `<text x="${N1(h[0] * k)}" y="${N1(h[1] * k + 0.3 * k)}" text-anchor="middle" style="font-size:${N1(0.8 * k)}px">✋</text>`; });
    /* rayons des capteurs qui détectent */
    const ray = (sp, on) => { if (!on) return ""; const o = wpt(P, sp[0], sp[1]), a = (P.th + sp[2]) * Math.PI / 180; return `<line x1="${N1(o[0] * k)}" y1="${N1(o[1] * k)}" x2="${N1((o[0] + Math.sin(a) * RANGE) * k)}" y2="${N1((o[1] - Math.cos(a) * RANGE) * k)}" style="stroke:#ff3b30;stroke-width:3;opacity:.55;stroke-linecap:round"/>`; };
    SFR.forEach((sp, i) => { s += ray(sp, S0.f[i]); }); SRR.forEach((sp, i) => { s += ray(sp, S0.r[i]); });
    if (S0.top === "blanc") s += `<circle cx="${N1(P.x * k)}" cy="${N1(P.y * k)}" r="${N1(0.8 * k)}" style="fill:#ffffff;stroke:#90a4ae;stroke-width:2;stroke-dasharray:4 3"/>`;
    if (S0.bot !== "eteint") s += `<circle cx="${N1(P.x * k)}" cy="${N1(P.y * k)}" r="${N1(0.78 * k)}" style="fill:${TCOL[S0.bot]};opacity:.55"/>`;
    s += robotSVG(P.x * k, P.y * k, P.th, k, { col: S0.top !== "eteint" ? TCOL[S0.top] : null, sens: { f: S0.f, r: S0.r }, gcol: sc.line ? S0.g.map(b => b ? "#000" : "#fff") : null, press: pressT > 0 ? pressK : null, noGround: !sc.line });
    if (S0.beep > 0) s += `<text x="${N1((P.x + 0.75) * k)}" y="${N1((P.y - 0.55) * k)}" style="font-size:${N1(Math.max(tk * 1.4, 0.55 * k))}px;fill:#e65100;font-weight:800">♪</text>`;
    return `<svg viewBox="0 0 ${W} ${N1(H)}" width="${W}" height="${N1(H)}" role="img" aria-label="${esc(`Vue du dessus : ${sc.name}. Le robot ${MOTX[MOT(S0)]}, dos ${CNAME[S0.top]}, ventre ${CNAME[S0.bot]}.`)}">${s}</svg>`;
  });
  const rd = () => { const S0 = sim, e = S0.lastEv; $(".readout", host).innerHTML = nb(`Dernier événement : <b>${e ? "lorsque " + esc(EVS[e].t) : "aucun"}</b> · moteurs : <b>${MOTX[MOT(S0)]}</b>`); };
  const home = () => { sim = mkSim(opts.scene, opts.prog(), alt ? ALT : null); pressT = 0; btnFire.clear(); done = false; fig.draw(); rd(); };
  const tap = e => { sim.prog = opts.prog(); fire(sim, e); sim.prog.forEach((b, i) => { if (b.e === e) btnFire.set(i, 0.6); }); if (e.startsWith("b_")) { pressK = { b_av: "av", b_ar: "ar", b_g: "g", b_d: "d", b_c: "c" }[e]; pressT = 0.5; } if (opts.onTap) opts.onTap(e); rd(); };
  $$("[data-tk]", host).forEach(b => b.onclick = () => tap(b.dataset.tk));
  $("[data-choc]", host).onclick = () => tap("choc");
  $$("[data-hd]", host).forEach(b => b.onclick = () => { addHand(sim, b.dataset.hd); if (opts.onTap) opts.onTap("main"); fig.draw(); });
  $("[data-home]", host).onclick = home;
  const fl = $("[data-flip]", host); if (fl) fl.onclick = e => { alt = !alt; e.currentTarget.setAttribute("aria-pressed", String(alt)); home(); };
  $("[data-run]", host).onclick = e => { run = !run; e.currentTarget.textContent = run ? "⏸ Pause" : "▶ Reprendre"; e.currentTarget.setAttribute("aria-pressed", String(!run)); };
  const fb = $("[data-fast]", host); if (fb) fb.onclick = e => { fast = !fast; e.currentTarget.setAttribute("aria-pressed", String(fast)); };
  let acc = 0;
  loopWhile(host, dt => {
    if (!run) return; sim.prog = opts.prog(); acc += dt * (fast ? 4 : 1); let n = 0;
    while (acc >= 1 / 60 && n < 40) { simStep(sim, 1 / 60); acc -= 1 / 60; n++; }
    pressT -= dt; btnFire.forEach((v, kk) => { if (v - dt <= 0) btnFire.delete(kk); else btnFire.set(kk, v - dt); });
    if (sc.goal && !done) { const G = sc.goal; if (sim.P.x > G[0] && sim.P.x < G[2] && sim.P.y > G[1] && sim.P.y < G[3]) done = true; }
    if (opts.onFire) { const set = new Set(btnFire.keys()); sim.fired.forEach(b => { const i = sim.prog.indexOf(b); if (i >= 0) set.add(i); }); opts.onFire(set); }
    fig.draw(); if (Math.random() < 0.2) rd();
  });
  rd();
  return { home, sim: () => sim };
}

/* ---------- un atelier de défi : le Thymio virtuel, l'éditeur et le robot-testeur ---------- */
function atelier(el, k) {
  const D = DFS[k], X = xst(); X.ok = X.ok || {}; X.tests = X.tests || {};
  el.innerHTML = `<div class="atl"><div class="stg"></div><div class="edw"><p class="kicker">Mon programme · ${DNAME[k]}</p><div class="ed"></div>
      <div class="row"><button type="button" class="btn" data-test>✅ Faire vérifier par le robot-testeur</button><button type="button" class="btn ghost" data-zero>↺ Repartir ${EXP() ? "de zéro" : "du modèle"}</button></div><div class="tres" aria-live="polite"></div></div></div>`;
  let ed;
  const st = stage($(".stg", el), { scene: D.scene, prog: () => progOf(k), fast: D.scene === "laby" || D.scene === "piste", onFire: set => ed && ed.hl(set) });
  ed = editor($(".ed", el), { get: () => progOf(k), E: D.E, A: D.A, onChange: () => { $(".tres", el).innerHTML = ""; } });
  const show = r => { $(".tres", el).innerHTML = `${r.ok ? `<p class="okm">${nb("✅ Défi réussi ! Le robot-testeur valide ton programme.")}</p>` : `<p class="badm">${nb("✗ Pas encore : lis ce qui ne va pas, corrige ton programme, puis teste-le à nouveau.")}</p>`}<ul class="tlist">${r.lines.map(l => `<li class="${l[0] ? "ok" : "no"}"><span class="ti">${l[0] ? "✓" : "✗"}</span><span>${nb(esc(l[1]))}</span></li>`).join("")}</ul>`; };
  $("[data-test]", el).onclick = () => {
    const P = progOf(k), empty = P.filter(b => !b.e || !b.a.length).length;
    if (!P.length || empty) { $(".tres", el).innerHTML = `<p class="badm">${nb(!P.length ? "Ton programme est vide : ajoute au moins un bloc." : `${empty} bloc(s) incomplet(s) : chaque bloc a besoin d'un événement et d'au moins une action.`)}</p>`; return; }
    const r = DEFIS[k].test(P); X.tests[k] = (X.tests[k] || 0) + 1; if (r.ok) X.ok[k] = 1; keep(); show(r);
  };
  armButton($("[data-zero]", el), `↺ Repartir ${EXP() ? "de zéro" : "du modèle"}`, "Effacer mon programme ?", () => { X.progs[k] = EXP() ? [] : clone(D.scaf); keep(); ed = editor($(".ed", el), { get: () => progOf(k), E: D.E, A: D.A, onChange: () => { $(".tres", el).innerHTML = ""; } }); st.home(); $(".tres", el).innerHTML = ""; });
}
Object.keys(DFS).forEach(k => { WID["atelier_" + k] = el => atelier(el, k); });

/* ---------- lire les programmes préenregistrés et les essayer ---------- */
WID.lecture = el => {
  const X = xst(); X.loaded = X.loaded || {}; let cur = X.cur || "A"; const live = clone(PRESET[cur]);
  el.innerHTML = `<p class="lead">${nb("Voici quatre programmes préenregistrés de Thymio, écrits avec les blocs du logiciel. Charge-les un par un dans le robot d'essai, puis place ta main autour de lui pour les tester.")}</p>
    <div class="atl"><div class="edw"><div class="vbar" role="group" aria-label="Choisir le programme">${Object.keys(PRESET).map(p => `<button type="button" data-pg="${p}">Programme ${p}</button>`).join("")}</div><div class="ed"></div><p class="lead ldd"></p></div><div class="stg"></div></div>`;
  const ed = editor($(".ed", el), { get: () => live, ro: true });
  const st = stage($(".stg", el), { scene: "bac", prog: () => live, onFire: set => $$(".ed .pblk", el).forEach((li, i) => li.classList.toggle("fire", set.has(i))) });
  const load = p => { cur = p; X.cur = p; X.loaded[p] = 1; keep(); live.splice(0, live.length, ...clone(PRESET[p])); ed.paint(); st.home(); press(el, "pg", p); $(".ldd", el).innerHTML = nb(`Le programme ${p} est chargé dans le robot d'essai. (${Object.keys(X.loaded).length}/4 programmes essayés)`); };
  $$("[data-pg]", el).forEach(b => b.onclick = () => load(b.dataset.pg));
  load(cur);
};
