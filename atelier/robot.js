/* ===== Robot Thymio (5e EIST, Mission 6) : outils communs et dessin du robot vu du dessus, partagés par les activités Thymio ===== */
const keep = () => { try { save(); } catch (e) {} if (typeof refreshTasks === "function") refreshTasks(); };
const xst = () => S.x;
const N1 = x => (+x).toFixed(1), N3 = x => (+x).toFixed(3);
const RAD = Math.PI / 180;
/* texte SVG dont le style optionnel complète le style de base */
const sX = (x, y, txt, a, size, extra) => { extra = extra || ""; const m = extra.match(/style="([^"]*)"/); return `<text x="${N1(x)}" y="${N1(y)}" text-anchor="${a || "start"}" style="fill:var(--ink);font-size:${N1(size)}px;${m ? m[1] : ""}" ${extra.replace(/style="[^"]*"/, "")}>${esc(txt)}</text>`; };
const press = (el, key, cur) => $$(`[data-${key}]`, el).forEach(b => b.setAttribute("aria-pressed", b.dataset[key] === String(cur) ? "true" : "false"));
function loopWhile(el, fn) { let lt = 0; const st = ts => { if (!document.body.contains(el)) return; const dt = lt ? Math.min(0.1, (ts - lt) / 1000) : 0; lt = ts; fn(dt, ts); requestAnimationFrame(st); }; requestAnimationFrame(st); }
const seen = key => { const X = xst(); X.seen = X.seen || {}; X.seen[key] = X.seen[key] || {}; return X.seen[key]; };
const nSeen = key => Object.keys(((xst().seen || {})[key]) || {}).length;
/* découpe un texte en lignes d'au plus n caractères */
const wrapT = (t, n) => { const out = []; let cur = ""; String(t).split(" ").forEach(w => { if (cur && (cur + " " + w).length > n) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; }); if (cur) out.push(cur); return out; };

/* ---------- le robot vu du dessus (schéma simplifié) : largeur 1, avant vers le haut (y négatif) ---------- */
const MCOL = { rouge: "#d93030", vert: "#2fa84f", jaune: "#e3b800", violet: "#8e44c9", cyan: "#13b0c6", bleu: "#2f6fe0", off: "#c9d1d8" };
const MNAME = { rouge: "rouge", vert: "vert", jaune: "jaune", violet: "violet", cyan: "cyan" };
const FR = [[-0.42, -0.36], [-0.25, -0.55], [0, -0.62], [0.25, -0.55], [0.42, -0.36]], RR = [[-0.28, 0.5], [0.28, 0.5]], GR = [[-0.13, -0.44], [0.13, -0.44]];
const BODY = "M-0.5,0.44 Q-0.5,0.5 -0.44,0.5 L0.44,0.5 Q0.5,0.5 0.5,0.44 L0.5,-0.12 C0.5,-0.48 0.28,-0.62 0,-0.62 C-0.28,-0.62 -0.5,-0.48 -0.5,-0.12 Z";
const TOPLED = "M-0.4,0.4 L-0.4,-0.1 C-0.4,-0.4 -0.22,-0.52 0,-0.52 C0.22,-0.52 0.4,-0.4 0.4,-0.1 L0.4,0.4 Z";
function robotSVG(x, y, th, s, o) {
  o = o || {}; const ns = 'vector-effect="non-scaling-stroke"', sn = o.sens || {}, col = o.col || MCOL[o.mode] || MCOL.off;
  let g = `<g transform="translate(${N1(x)} ${N1(y)}) rotate(${N1(th)}) scale(${N3(s)})">`;
  if (o.ghost) return g + `<path d="${BODY}" style="fill:none;stroke:var(--muted);stroke-width:1.6;stroke-dasharray:5 4" ${ns}/></g>`;
  g += `<rect x="-0.63" y="-0.1" width="0.13" height="0.44" rx="0.04" style="fill:#2a2e33"/><rect x="0.5" y="-0.1" width="0.13" height="0.44" rx="0.04" style="fill:#2a2e33"/>`;
  g += `<path d="${BODY}" style="fill:#fbfcfd;stroke:#56616b;stroke-width:1.6" ${ns}/>`;
  g += `<path d="${TOPLED}" style="fill:${col};opacity:${o.col || (o.mode && o.mode !== "off") ? 0.62 : 0.35}"/>`;
  /* capteurs au sol (sous le robot, vus par transparence) */
  if (!o.noGround) GR.forEach((p, i) => { const c = o.gcol ? o.gcol[i] : (sn.g && sn.g[i] ? "#ff3b30" : "none"), z = o.gcol ? 1.7 : 1; g += `<rect x="${p[0] - 0.05 * z}" y="${p[1] - 0.04 * z}" width="${0.1 * z}" height="${0.08 * z}" rx="0.015" style="fill:${c};stroke:${o.gcol ? "#e53935" : "#56616b"};stroke-width:${o.gcol ? 2 : 1};${o.gcol ? "" : "stroke-dasharray:2 2"}" ${ns}/>`; });
  /* les cinq touches : quatre flèches et le bouton central */
  const bt = (d, k) => { const on = o.press === k; return `<path d="${d}" style="fill:${on ? "#fff59d" : "rgba(255,255,255,.8)"};stroke:${on ? "#e65100" : "#56616b"};stroke-width:${on ? 2.6 : 1}" ${ns}/>`; };
  g += bt("M0,-0.37 L0.09,-0.23 L-0.09,-0.23 Z", "av") + bt("M0,0.33 L0.09,0.19 L-0.09,0.19 Z", "ar") + bt("M-0.31,-0.02 L-0.17,-0.11 L-0.17,0.07 Z", "g") + bt("M0.31,-0.02 L0.17,-0.11 L0.17,0.07 Z", "d");
  g += `<circle cx="0" cy="-0.02" r="0.065" style="fill:${o.press === "c" ? "#fff59d" : "rgba(255,255,255,.8)"};stroke:#56616b;stroke-width:1" ${ns}/>`;
  /* capteurs de proximité : cinq devant, deux derrière ; leur petit voyant rouge s'allume quand ils détectent */
  const dot = (p, on) => (on ? `<circle cx="${p[0]}" cy="${p[1]}" r="0.085" style="fill:#ff3b30;opacity:.45"/>` : "") + `<circle cx="${p[0]}" cy="${p[1]}" r="0.035" style="fill:${on ? "#ff1a1a" : "#3a4047"}"/>`;
  FR.forEach((p, i) => { g += dot(p, sn.f && sn.f[i]); });
  RR.forEach((p, i) => { g += dot(p, sn.r && sn.r[i]); });
  return g + "</g>";
}
/* coordonnées du monde d'un point du robot (repère du robot : avant = y négatif) */
const toW = (P, lx, ly, sc) => { const c = Math.cos(P.th * RAD), s = Math.sin(P.th * RAD); return [P.x + (lx * c - ly * s) * sc, P.y + (lx * s + ly * c) * sc]; };

