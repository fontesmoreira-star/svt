/* ===== Boîte à outils commune : typographie, SVG à la largeur réelle, commande d'animation ===== */
const SIMUL = "Valeurs simulées";
const NB = " ", NN = " ";
const tbl = (head, rows) => `<div class="tablewrap"><table class="t"><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* ---------- typographie française appliquée aux contenus ---------- */
function nb(s) {
  return String(s).replace(/ ([?!;])/g, NN + "$1").replace(/ :(?=[ <]|$)/g, NB + ":").replace(/« /g, "«" + NB).replace(/ »/g, NB + "»")
    .replace(/(\d) (\d{3})(?!\d)/g, "$1" + NN + "$2").replace(/(\d) (%|°C|m|cm|mm|mL|L|W|km|km²|km³|Mt|t|kg|ans|min|fois|millions)(?![\wà-ÿ²³])/g, "$1" + NB + "$2");
}
function typo(o) { if (typeof o === "string") return nb(o); if (Array.isArray(o)) return o.map(typo); if (o && typeof o === "object") { Object.keys(o).forEach(k => { if (typeof o[k] !== "function") o[k] = typo(o[k]); }); } return o; }

/* ---------- SVG redessiné à la largeur réelle (texte toujours lisible) ---------- */
const fsPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 20;
function liveSVG(host, draw) {
  const o = { host, draw() { const W = Math.max(260, host.clientWidth || 320); host.innerHTML = draw(W, fsPx()); } };
  o.draw(); Charts.list.add(o);
  if (window.ResizeObserver) { let lw = host.clientWidth; new ResizeObserver(() => { const w = host.clientWidth; if (Math.abs(w - lw) > 4) { lw = w; o.draw(); } }).observe(host); }
  return o;
}
const sT = (x, y, txt, a, size, extra) => `<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${size.toFixed(1)}px" ${extra || ""}>${esc(txt)}</text>`;
const TK = F => Math.max(15, F * 0.76);
function arrow(x1, y1, x2, y2, w, color, op) {
  const a = Math.atan2(y2 - y1, x2 - x1), hl = Math.max(w * 1.1, 10), hw = Math.max(w * 0.95, 7);
  const bx = x2 - Math.cos(a) * hl, by = y2 - Math.sin(a) * hl, nx = -Math.sin(a), ny = Math.cos(a);
  return `<g style="opacity:${op || 1}"><line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" style="stroke:var(--${color});stroke-width:${Math.max(w, 1.5).toFixed(1)}"/><polygon points="${x2.toFixed(1)},${y2.toFixed(1)} ${(bx + nx * hw).toFixed(1)},${(by + ny * hw).toFixed(1)} ${(bx - nx * hw).toFixed(1)},${(by - ny * hw).toFixed(1)}" style="fill:var(--${color})"/></g>`;
}

/* ---------- commande d'animation commune : Lancer / Pause / Recommencer ---------- */
function animCtl(el, dur, onP) {
  el.innerHTML = `<button class="btn" type="button" data-a="run"></button><button class="btn ghost" type="button" data-a="reset">${CT.animReset}</button>`;
  const st = { p: 0, playing: false, lt: 0, raf: 0 }, b = el.querySelector('[data-a="run"]');
  const lab = () => { b.textContent = st.playing ? CT.animPause : (st.p > 0 && st.p < 1) ? CT.animResume : CT.animRun; };
  const frame = ts => {
    if (!st.playing) return; if (!document.body.contains(el)) { st.playing = false; return; }
    const dt = st.lt ? Math.min(100, ts - st.lt) : 0; st.lt = ts; st.p = Math.min(1, st.p + dt / dur);
    if (st.p >= 1) st.playing = false; onP(st.p); lab(); if (st.playing) st.raf = requestAnimationFrame(frame);
  };
  st.play = () => { if (st.p >= 1) st.p = 0; st.playing = true; st.lt = 0; lab(); st.raf = requestAnimationFrame(frame); };
  st.pause = () => { st.playing = false; cancelAnimationFrame(st.raf); lab(); };
  st.set = p => { st.pause(); st.p = Math.max(0, Math.min(1, p)); onP(st.p); lab(); };
  b.onclick = () => st.playing ? st.pause() : st.play();
  el.querySelector('[data-a="reset"]').onclick = () => st.set(0);
  lab(); onP(0); return st;
}

