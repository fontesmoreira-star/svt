/* ===== Données partagées (documents de cours redessinés ou simulés) ===== */
const SIMUL = "Valeurs simulées";
const APPROX = "Valeurs approchées lues sur le document du cours";

/* Courbe schématique des écarts de température en Antarctique (°C) sur 450 000 ans — simulée d'après l'allure des enregistrements */
const PALEO_KEYS = [[450, -4.5], [440, -6], [430, -7], [420, -3], [412, 0.6], [408, 1.2], [402, -0.6], [396, -3], [385, -4.2], [372, -3.5], [360, -5.5], [350, -6.5], [345, -7.5],
  [338, -3], [332, 1.8], [326, 0.4], [318, -3.5], [305, -4.8], [295, -3.8], [282, -5.5], [268, -6], [260, -6.8], [255, -7],
  [248, -2.5], [242, 0.6], [236, -1.6], [226, -3.8], [215, -1.2], [205, -4.5], [192, -3.8], [180, -5.5], [165, -6], [150, -7.2], [140, -8],
  [134, -3], [128, 2.0], [122, 0.3], [115, -3.5], [105, -4.5], [95, -4], [85, -5], [70, -5.5], [60, -4.5], [45, -5.8], [30, -6.5], [22, -7.5], [18, -7.2],
  [14, -4], [10, -0.6], [8, 0.5], [4, 0.1], [0, 0.3]];
function paleoAt(t) { const K = PALEO_KEYS; for (let i = 1; i < K.length; i++) { const [t0, v0] = K[i - 1], [t1, v1] = K[i]; if (t <= t0 && t >= t1) { const f = (t0 - t) / (t0 - t1); return v0 + f * (v1 - v0); } } return 0; }
const PALEO = (() => { const pts = []; for (let t = 450; t >= 0; t -= 2) { const w = (t > 16 && t < 400 && paleoAt(t) < -1.8) ? 0.22 * Math.sin(t * 1.7) + 0.15 * Math.sin(t * 0.63 + 1) : 0; pts.push([-t, Math.round((paleoAt(t) + w) * 10) / 10]); } return pts; })();
function paleoSpec(extra) {
  return Object.assign({ type: "line", series: [{ name: "Écart de température", pts: PALEO, color: "c1", w: 2.4 }], xMin: -450, xMax: 0, xStep: 50, yMin: -9, yMax: 3, yStep: 1, xTickW: 3.2,
    xTitle: "Temps (milliers d'années, 0 = aujourd'hui)", yTitle: "Écart de température (°C)", xFmt: v => fmt(v), xRead: v => (v === 0 ? "Aujourd'hui" : "Il y a " + fmt(-v * 1000) + " ans"), yRead: v => (v > 0 ? "+" : "") + fmt(v, 1) + " °C", yFmt: v => (v > 0 ? "+" : "") + fmt(v),
    legend: false, anim: true, animDur: 7000, alt: "Courbe des écarts de température en Antarctique sur 450 000 ans" }, extra || {});
}

/* Température moyenne globale : tendance (écart à la moyenne 1880-1920, °C) — valeurs approchées */
const TGLOB = [[1880, 0], [1890, -0.05], [1900, -0.05], [1910, -0.1], [1920, 0], [1930, 0.05], [1940, 0.3], [1950, 0.2], [1960, 0.25], [1970, 0.25], [1980, 0.35], [1990, 0.5], [2000, 0.7], [2010, 0.9], [2020, 1.15]];
function tglobSpec() {
  return { type: "line", series: [{ name: "Tendance globale", pts: TGLOB, color: "c2" }], xMin: 1880, xMax: 2020, xStep: 20, yMin: -0.4, yMax: 1.4, yStep: 0.2, markers: true, legend: false,
    xTitle: "Année", yTitle: "Écart à 1880-1920 (°C)", xFmt: v => String(v), xRead: v => String(v), yFmt: v => (v > 0 ? "+" : "") + fmt(v, 1), yRead: v => (v > 0 ? "+" : "") + fmt(v, 2) + " °C", anim: true };
}

/* Niveau moyen des océans (cm, référence 1993) — valeurs approchées */
const SEA = [[1993, 0], [1995, 0.6], [1997, 1.1], [1999, 1.8], [2001, 2.5], [2003, 3.2], [2005, 3.8], [2007, 4.2], [2009, 4.8], [2011, 5.6], [2013, 6.8], [2015, 8]];
function seaSpec() {
  return { type: "line", series: [{ name: "Niveau moyen", pts: SEA, color: "c1" }], xMin: 1993, xMax: 2015, xStep: 2, yMin: -2, yMax: 10, yStep: 2, markers: true, legend: false, xTickW: 3,
    xTitle: "Année", yTitle: "Niveau moyen des océans (cm)", xFmt: v => String(v), xRead: v => String(v), yRead: v => fmt(v, 1) + " cm", anim: true };
}

/* UV : modèle simplifié (deux grandeurs, donc deux graphiques) */
const UVL = [250, 260, 270, 280, 290, 295, 300, 305, 310, 315, 320, 330, 340, 350, 360];
const UV_SOL = [0, 0, 0, 0, 0.5, 2, 6, 14, 26, 40, 55, 72, 82, 88, 90];
const UV_ADN = [85, 100, 95, 75, 30, 20, 12, 7, 3, 1.5, 0.5, 0.1, 0, 0, 0];
function uvSolSpec() { return { type: "line", anim: true, series: [{ name: "Part atteignant le sol", pts: UVL.map((l, i) => [l, UV_SOL[i]]), color: "c2" }], xMin: 250, xMax: 360, xStep: 10, yMin: 0, yMax: 100, yStep: 20, markers: true, legend: false, xTickW: 2.6, h: 12,
  xTitle: "Longueur d'onde (nm)", yTitle: "Atteint le sol (%)", xRead: v => v + " nm", yRead: v => fmt(v) + " % du rayonnement atteint le sol", alt: "Part du rayonnement UV solaire qui atteint le sol selon la longueur d'onde" }; }
function uvAdnSpec() { return { type: "line", anim: true, series: [{ name: "Absorption par l'ADN", pts: UVL.map((l, i) => [l, UV_ADN[i]]), color: "c3" }], xMin: 250, xMax: 360, xStep: 10, yMin: 0, yMax: 100, yStep: 20, markers: true, legend: false, xTickW: 2.6, h: 12,
  xTitle: "Longueur d'onde (nm)", yTitle: "Absorption ADN (%)", xRead: v => v + " nm", yRead: v => "absorption par l'ADN : " + fmt(v) + " % du maximum", alt: "Absorption des UV par l'ADN selon la longueur d'onde" }; }

/* Compositions atmosphériques (% en volume) */
const ATM = {
  cats: ["N₂", "O₂", "CO₂", "H₂O"],
  prim: [5, 0, 15, 80], act: [78, 21, 0, 0], venus: [3.5, 0, 96.5, 0],
  trace: { act: [false, false, true, true], prim: [false, false, false, false], venus: [false, false, false, false] }
};

const tbl = (head, rows, cls) => `<div class="tablewrap"><table class="t ${cls || ""}"><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td${i && /^[−+\-]?[\d\s ,.]+( ?%| °C| Gt\/an)?$/.test(String(c)) ? ' class="n"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* ---------- documents : rendu HTML + montage différé des graphiques ---------- */
const DOCSPECS = new Map(); let _dk = 0;
function docHTML(d) {
  let inner = d.html || "";
  (d.charts || (d.chart ? [d.chart] : [])).forEach(c => { const k = "d" + (++_dk); DOCSPECS.set(k, c); inner += `<div class="chartbox" data-chart="${k}"></div>`; });
  if (d.after) inner += d.after;
  return `<figure class="doc" style="margin:0"><figcaption class="dh"><span>${d.title}</span>${d.sim ? `<span class="sim">⚠ ${d.sim}</span>` : ""}</figcaption><div class="db">${inner}</div></figure>`;
}
function mountDocs(root) { $$("[data-chart]", root).forEach(el => { if (el.dataset.mounted) return; el.dataset.mounted = "1"; mountChart(el, DOCSPECS.get(el.dataset.chart)); }); }

function phaseSpec(extra) { return Object.assign({ type: "phase", tMin: -150, tMax: 500, lpMin: 1, lpMax: 8, readState: false, alt: "Diagramme d'état de l'eau : pression en fonction de la température", readHint: "Touche le diagramme pour lire la température et la pression d'un point." }, extra || {}); }
