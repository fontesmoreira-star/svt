/* ===== DNL anglais (5e EIST) · mots-clés EN → FR avec prononciation, glossaire, « Can I do it? » =====
   KW([["nose cone", "coiffe"], …]) : étiquettes à insérer dans un intro (contenu de phrase, valide dans un <p>).
   Le bouton 🔊 lit le mot anglais (speechSynthesis, voix de l'appareil, hors ligne) ; il disparaît si l'appareil ne sait pas parler. */
const DNL_SAY = (() => { try { return "speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function"; } catch (e) { return false; } })();
try { document.documentElement.classList.toggle("nosay", !DNL_SAY); } catch (e) {}
document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("[data-say]"); if (!b || !DNL_SAY) return;
  try { const u = new SpeechSynthesisUtterance(b.dataset.say); u.lang = "en-GB"; u.rate = 0.85; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } catch (x) {}
});
const sayBtn = w => `<button type="button" class="say" data-say="${esc(w)}" aria-label="Listen: ${esc(w)}">🔊</button>`;
const KW = pairs => `<span class="kwbox" role="group" aria-label="Key words"><span class="kwt">🔤 Key words</span>${pairs.map(([en, fr]) => `<span class="kw">${sayBtn(en)}<b lang="en">${en}</b><i lang="fr">${fr}</i></span>`).join("")}</span>`;
const glossTable = pairs => `<div class="tablewrap"><table class="t gloss"><thead><tr><th>English</th><th>Français</th></tr></thead><tbody>${pairs.map(([en, fr]) => `<tr><td><span class="gw">${sayBtn(en)}<b lang="en">${en}</b></span></td><td lang="fr">${fr}</td></tr>`).join("")}</tbody></table></div>`;
const canDo = list => `<div class="box key"><p class="lab">✔ Can I do it?</p><ul class="cando">${list.map(x => `<li><span class="bx" aria-hidden="true"></span>${x}</li>`).join("")}</ul></div>`;
