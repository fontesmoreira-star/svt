/* ===== 5e EIST · Mission 5 · Activité 5 en DNL anglais (A2-B1) : les phases de la Lune, adapté de la fiche du professeur =====
   Mêmes manipulations que la version française ; mots-clés EN → FR avec prononciation, glossaire, cadres de phrase (version experte). */
const PROBLEM = "Why does the Moon look different every night?";
const gap = `<span class="gap">………</span>`;
const GLOSS = [["the Moon", "la Lune"], ["the Sun", "le Soleil"], ["the Earth", "la Terre"], ["primary light source", "source primaire de lumière"], ["scattering object", "objet diffusant"], ["to light up / lit", "éclairer / éclairé"], ["half", "la moitié"], ["the phases of the Moon", "les phases de la Lune"], ["lunar month", "la lunaison"], ["new moon", "la nouvelle lune"], ["first quarter", "le premier quartier"], ["full moon", "la pleine lune"], ["last quarter", "le dernier quartier"], ["frame of reference", "le référentiel"], ["observer", "l'observateur"]];
const CANDO = ["I can explain how we see the Moon: Sun → Moon → eye.", "I can name the four main phases of the Moon in English.", "I can say why the Moon looks different: “From Earth, we see a bigger or smaller part of the lit half.”"];
const HOME = { slug: "phases-of-the-moon-dnl", short: "Phases of the Moon (DNL)", last: "c1", lastG: "p3", lastK: 1, dur: "about 50 minutes",
  kicker: "Mission 5 · Light signals · Activity 5 · Science in English", title: "Why does the Moon look different every night?",
  intro: "Before leaving for Mars, the crew learns to read the sky. Every evening, the Moon does not look the same. Your mission: find out why!",
  lab: "The mission question", goal: "Goal: explain the phases of the Moon with the Sun, the Earth and the Moon.",
  fact: "Light from the Moon takes about 1.3 seconds to reach your eye.",
  parts: "The three parts of the activity", recop: "Summary to copy into your notebook",
  txt: "ACTIVITY 5 · WHY DOES THE MOON LOOK DIFFERENT EVERY NIGHT?\n5e EIST · Science in English (DNL) · Mission 5 · Light signals: the Sun-Earth-Moon system",
  comps: { conn: "Use what I know", lire: "Use a diagram or an animation", mod: "Use a model", rais: "Reason and explain", lang: "Use scientific English" },
  gk: { vois: "I see", sais: "I know", deduis: "So" },
  vers: { g: { icon: "🧭", short: "Guided", name: "Guided version", q: "guided", desc: "I choose or I complete, step by step." },
    l: { icon: "🚀", short: "Expert", name: "Expert version", q: "expert", desc: "The same experiments, less help: I write my answers, I explain in my own words and I calculate." } },
  extraTitle: "My phases table",
  extra: () => { const [T, E] = tabAns(); return `MY PHASES TABLE\n${[0, 1, 2, 3].map(i => `- Week ${i + 1} · from Earth: ${T[i] === undefined ? "—" : PH_TXT[T[i]]} · from space: ${E[i] === undefined ? "—" : PH_TXT[E[i]]}`).join("\n")}\n` },
  extraHTML: () => { const [T, E] = tabAns(); return `<div class="tablewrap"><table class="t phtab"><thead><tr><th>Week</th><th>What an observer on Earth sees</th><th>What an observer in space sees</th></tr></thead><tbody>${[0, 1, 2, 3].map(i => `<tr><td>${i + 1}</td><td>${phasePic(T[i], 44)}<span class="pdt">${T[i] === undefined ? "—" : PH_TXT[T[i]]}</span></td><td>${phasePic(E[i], 44)}<span class="pdt">${E[i] === undefined ? "—" : PH_TXT[E[i]]}</span></td></tr>`).join("")}</tbody></table></div>` } };
function tabAns() { const get = id => { const it = ITEMS[id].it, k = it.parts.findIndex(p => p.t === "phase"), st = IT()[id]; return k >= 0 && st && st.v[k] ? st.v[k] : {}; }; return [get("b1"), get("b2")]; }

const DOC_INTRO = { title: "Document 1 · How do we see an object?", html: `<p><i>To see an object, light from this object must reach our eye.</i></p><p><i>Only stars, like the Sun, give out light: they are <b>primary light sources</b>.</i></p><p><i>Planets and moons (satellites), like the Moon, do not give out light: they are <b>scattering objects</b>. They send back the light they receive.</i></p><p><i>So the ……… must light up ……… and a ray of light must reach ………</i></p>` };
const DOC_TXT = { title: "Document 2 · The phases of the Moon", html: `<p>If you look at the Moon every evening, you can see that it looks different. These different looks are called the <b>phases of the Moon</b>. The phases change over about 28 days: this is a <b>lunar month</b>. The Sun always lights up one half of the Moon, but an observer on Earth sees all of this lit half, part of it, or none of it.</p>` };
const DOC_SCH = { title: "Document 3 · The Moon around the Earth", w: "schema", sim: "Simplified diagram" };
const WEEKS = n => [1, 2, 3, 4].map(w => ({ txt: "Week " + w, a: n[w - 1] }));
const FRAMES = list => `<span class="box info" style="display:grid"><span class="lab">✍ Sentence starters</span><span>${list.map(x => `“${x} …”`).join(" · ")}</span></span>`;

const BIL = ["To see an object, light from this object must reach our eye.",
  "The Sun is a <u>primary light source</u>. The Moon is a <u>scattering object</u>: it does not give out light, it sends back the light of the Sun.",
  "The Sun always lights up <u>one half</u> of the Moon.",
  "The Moon goes around the Earth in about 28 days: this is a <u>lunar month</u>. Depending on where the Moon is, an observer on Earth sees all, part or none of its lit half: these are the <u>phases of the Moon</u>.",
  "From space, we always see one lit half: what the Moon looks like depends on where the observer is (the <u>frame of reference</u>)."];
const bilanHTML = () => BIL.map(x => `<p>${x}</p>`).join("") + `<p class="lab2">I draw the four phases (seen from the Northern Hemisphere):</p><div class="phstrip">${[[0, "New moon"], [1, "First quarter"], [3, "Full moon"], [2, "Last quarter"]].map(([s, n]) => `<figure>${phasePic(s, 58)}<figcaption>${n}</figcaption></figure>`).join("")}</div><p class="lab2">My glossary</p>${glossTable(GLOSS)}${canDo(CANDO)}`;

const GROUPS = [
{ id: "p1", n: 1, icon: "🔦", tab: "See the Moon", title: "How do we see the Moon?", sub: "The light lab · about 10 minutes.",
  items: [
  { id: "a1", lvl: "easy", title: "The light lab",
    intro: KW([["light", "lumière"], ["to give out light", "émettre de la lumière"], ["to light up", "éclairer"], ["ray of light", "rayon lumineux"], ["screen", "écran"], ["eye", "œil"]]),
    docs: [DOC_INTRO],
    widget: { title: "Virtual lab · The path of light", w: "rayon", sim: "Simplified model" },
    parts: [
      { t: "task", c: "mod", label: "Do the three tests: no obstacle, with the screen, with the hand.", okMsg: "Three tests done.", done: () => { const n = ["free", "screen", "hand"].filter(k => (xst().ray || {})[k]).length; return { ok: n === 3, msg: `${n}/3 tests done.` }; } },
      { t: "rows", c: "conn", label: "Complete the sentence of document 1.", choices: ["Sun", "the Moon", "our eye"], rows: [{ txt: "So the … (1)", a: 0 }, { txt: "… must light up … (2)", a: 1 }, { txt: "… and a ray of light must reach … (3)", a: 2 }] },
      { t: "rows", c: "conn", label: "Primary light source or scattering object?", choices: ["Primary light source", "Scattering object"], rows: [{ txt: "The Sun", a: 0 }, { txt: "The Moon", a: 1 }, { txt: "The planet Mars", a: 1 }, { txt: "The Pole Star (a star)", a: 0 }] }],
    hints: ["In the lab, look where the light starts, then where it goes.", "Document 1 says it: only stars give out light. Planets and moons do not.", "Sun · the Moon · our eye. The Sun and the Pole Star are primary light sources; the Moon and Mars are scattering objects."],
    corr: "So the Sun must light up the Moon and a ray of light must reach our eye. The Sun and the Pole Star are stars: they are primary light sources. The Moon (a satellite) and Mars (a planet) do not give out light: they are scattering objects. With the screen, the Moon is not lit; with the hand, the light from the Moon does not reach the eye: in both cases, we cannot see the Moon." }] },

{ id: "p2", n: 2, icon: "🌓", tab: "The phases", title: "Why does the Moon look different?", sub: "Simulator and diagram · about 25 minutes.",
  items: [
  { id: "b1", lvl: "mid", title: "What an observer on Earth sees",
    intro: `First, complete the column “observer on Earth”. ${KW([["week", "semaine"], ["lit", "éclairé"], ["dark", "sombre"], ["half", "moitié"], ["new moon", "nouvelle lune"], ["first quarter", "premier quartier"], ["full moon", "pleine lune"], ["last quarter", "dernier quartier"]])}`,
    docs: [DOC_TXT],
    widget: { title: "Simulator · The Moon around the Earth (instead of the video)", w: "lunaison", sim: "Simplified animation" },
    parts: [
      { t: "task", c: "mod", label: "Look at the Moon at the end of the four weeks.", okMsg: "All four weeks observed.", done: () => { const n = Object.keys(xst().wk || {}).length; return { ok: n >= 4, msg: `${n}/4 weeks observed.` }; } },
      { t: "phase", c: "lire", label: "Draw what an observer on Earth sees.", rows: WEEKS([1, 3, 2, 0]) },
      { t: "rows", c: "lire", label: "What is the name of each phase?", choices: PHN, rows: [{ txt: "Week 1", a: 1 }, { txt: "Week 2", a: 2 }, { txt: "Week 3", a: 3 }, { txt: "Week 4", a: 0 }] }],
    hints: ["Tap “Week 1”, then 2, 3 and 4: look at the Moon in the sky, on the right.", "To draw, tap the lit half. If you see no lit part, tap “Nothing lit”.", "Week 1: right half (first quarter). Week 2: the whole disc (full moon). Week 3: left half (last quarter). Week 4: nothing (new moon)."],
    corr: "Week 1: first quarter, the right half is lit. Week 2: full moon, the whole disc is lit. Week 3: last quarter, the left half is lit. Week 4: new moon, we cannot see any lit part. (Seen from the Northern Hemisphere, like in Luxembourg.)" },
  { id: "b2", lvl: "hard", title: "What an observer in space sees",
    intro: `Then think and complete the column “observer in space”. Remember: frame of reference! ${KW([["frame of reference", "référentiel"], ["space", "espace"], ["always", "toujours"], ["the same", "le même, pareil"], ["shadow", "ombre"]])}`,
    docs: [DOC_SCH, { title: "Document 2 (extract)", html: `<p>The Sun always lights up one half of the Moon, but an observer on Earth sees all of this lit half, part of it, or none of it.</p>` }],
    pre: { label: "Your opinion first: does the observer in space also see the Moon change?", o: ["Yes, they see the same phases as from Earth", "No, they always see the same thing", "I don't know"], a: 1, yes: "✓ Good idea: your drawing confirms it.", nope: "↻ Your drawing made you change your mind: that is how we learn." },
    parts: [
      { t: "phase", c: "mod", label: "Draw what an observer in space sees, from where you look at the diagram (the Sun is on their left).", rows: WEEKS([2, 2, 2, 2]) },
      { t: "choice", c: "rais", label: "Why does this observer always see the same thing?", o: ["The Sun always lights up the half of the Moon facing it, and the observer always looks from the same place", "The Moon makes its own light", "The Moon does not go around the Earth"], a: 0, no: { 1: "Read document 1 again: the Moon is a scattering object.", 2: "Look at the diagram: the Moon is in four different places." } },
      { t: "rows", c: "rais", label: "True or false?", choices: ["True", "False"], rows: [{ txt: "The Sun always lights up one half of the Moon.", a: 0 }, { txt: "The phases of the Moon are caused by the shadow of the Earth.", a: 1 }, { txt: "What the Moon looks like depends on where we look from.", a: 0 }] }],
    hints: ["On the diagram, the Sun lights everything from the left.", "Wherever the Moon is, which half faces the Sun?", "The four drawings are the same: the left half, facing the Sun, is lit. The shadow of the Earth plays no part (that is an eclipse, which is rare)."],
    corr: "From space, where you look at the diagram from, you always see the left half of the Moon lit: it is the half facing the Sun. The four drawings are the same. From Earth, depending on where the Moon is, we see a bigger or smaller part of this lit half: what the Moon looks like depends on the frame of reference. The phases are not caused by the shadow of the Earth.",
    unlock: { title: "🔓 Animation unlocked · From space and from Earth", w: "espace", sim: "Simplified model" } }] },

{ id: "p3", n: 3, icon: "🚀", tab: "Mission", title: "Ready to read the sky?", sub: "Your mission log, a new situation, then the summary to copy · about 15 minutes.",
  items: [
  { id: "c0", lvl: "easy", title: "Mission log · Moon words",
    intro: "Show that you know the words of the mission. Tap 🔊 to hear a word.",
    parts: [
      { t: "match", c: "lang", label: "Find the French word for each English word.", ask: "Choose the French word for", rows: [{ e: "🔤", txt: "new moon", v: "nouvelle lune" }, { e: "🔤", txt: "full moon", v: "pleine lune" }, { e: "🔤", txt: "first quarter", v: "premier quartier" }, { e: "🔤", txt: "lunar month", v: "lunaison" }, { e: "🔤", txt: "scattering object", v: "objet diffusant" }, { e: "🔤", txt: "frame of reference", v: "référentiel" }] },
      { t: "word", c: "lang", spell: true, label: `Complete: “When we see the whole disc lit, it is a ${gap} moon.”`, ans: ["full", "pleine"], err: [[["new", "half", "quarter"], "Look at your drawing for week 2: the whole disc is lit."]] }],
    hints: ["Use the key words of the earlier steps: they give the French word.", "“Lunar month” is the 28-day cycle. “Frame of reference” is where you look from.", "new moon = nouvelle lune · full moon = pleine lune · first quarter = premier quartier · lunar month = lunaison · scattering object = objet diffusant · frame of reference = référentiel. The whole disc is lit: full moon."],
    corr: "new moon = nouvelle lune · full moon = pleine lune · first quarter = premier quartier · lunar month = lunaison · scattering object = objet diffusant · frame of reference = référentiel. “When we see the whole disc lit, it is a full moon.”" },
  { id: "c1", lvl: "hard", title: "The mission report", recop: true,
    docs: [DOC_SCH],
    parts: [
      { t: "rows", c: "rais", label: "Where is the Moon?", choices: ["Between the Earth and the Sun", "Opposite the Sun", "On the side"], rows: [{ txt: "At full moon", a: 1 }, { txt: "At new moon", a: 0 }, { txt: "At first quarter", a: 2 }] },
      { t: "choice", c: "rais", label: "Full moon. From the Moon, an astronaut looks at the Earth. What does the astronaut see?", o: ["An Earth that is almost all dark", "An Earth that is all lit", "An Earth that is half lit"], a: 0, no: { 1: "That is what the observer on Earth sees of the Moon. Put yourself in the astronaut's place: is the half of the Earth facing them lit by the Sun?", 2: "Look at the diagram: at full moon, the Moon is opposite the Sun." } },
      { t: "choice", c: "conn", label: "Why does the Moon look different every night?", o: ["As it goes around the Earth, it shows us a bigger or smaller part of its half lit by the Sun", "The shadow of the Earth hides part of it", "It changes shape"], a: 0 }],
    hints: ["Find Week 2 (full moon) and Week 4 (new moon) on the diagram: where are they compared with the Sun?", "For the astronaut, it is the Earth that is lit or not by the Sun. Which half of the Earth does the astronaut see?", "Full moon: opposite the Sun. New moon: between the Earth and the Sun. The astronaut sees the side of the Earth where it is night."],
    corr: "At full moon, the Moon is opposite the Sun; at new moon, it is between the Earth and the Sun; at first quarter, it is on the side. At full moon, the astronaut sees the half of the Earth where it is night: an Earth that is almost all dark. The Moon looks different because, as it goes around the Earth, it shows us a bigger or smaller part of its half lit by the Sun." }] }
];

const RAPPEL = { id: "r0", lvl: "easy", title: "Warm-up",
  intro: KW([["star", "étoile"], ["planet", "planète"], ["satellite", "satellite"], ["to go around", "tourner autour"]]),
  parts: [
    { t: "choice", c: "conn", label: "The Sun is…", o: ["a primary light source", "a scattering object", "a planet"], a: 0 },
    { t: "choice", c: "conn", label: "The Moon goes around…", o: ["the Earth", "Mars", "itself only"], a: 0 }],
  hints: ["The Sun is a star: it makes its own light.", "The Moon is the satellite of the Earth.", "Primary light source · the Earth."],
  corr: "The Sun is a star: it is a primary light source. The Moon is the natural satellite of the Earth: it goes around the Earth." };

/* ===== EXPERT VERSION: same experiments, written answers, explanations, one calculation ===== */
const EXPERT = {
r0: { parts: [
    { t: "word", c: "conn", label: `The Sun makes its own light: it is a ${gap} light source.`, ans: ["primary", "primaire"], spell: true, err: [[["secondary", "scattering"], "A source that makes its own light is a primary light source."]] },
    { t: "word", c: "conn", label: `The Moon is the natural satellite of the ${gap}.`, ans: ["Earth", "the Earth", "Terre"], spell: true }],
  hints: ["A star, like the Sun, makes its own light.", "The Moon goes around our planet.", "Primary · Earth."] },
a1: { parts: [
    { t: "task", c: "mod", label: "Do the three tests: no obstacle, with the screen, with the hand.", okMsg: "Three tests done.", done: () => { const n = ["free", "screen", "hand"].filter(k => (xst().ray || {})[k]).length; return { ok: n === 3, msg: `${n}/3 tests done.` }; } },
    { t: "word", c: "conn", spell: true, label: `So the ${gap} must light up…`, ans: ["Sun", "the Sun", "Soleil"], err: [[["Moon", "the Moon"], "The Moon does not give out light: it is the Moon that is lit."]] },
    { t: "word", c: "conn", spell: true, label: `… must light up ${gap}…`, ans: ["the Moon", "Moon", "Lune"], err: [[["Sun", "the Sun"], "The Sun is the source: it is the Sun that lights up."]] },
    { t: "word", c: "conn", label: `… and a ray of light must reach ${gap}.`, ans: ["our eye", "eye", "our eyes", "eyes", "the eye", "the observer", "observer", "the observer's eye"] },
    { t: "redac", c: "rais", min: 15, label: `A crew member says: “The Moon shines because it makes its own light, like the Sun.” Explain the mistake. ${FRAMES(["You are wrong: the Moon", "It is a", "It is lit by", "This light"])}`,
      crit: [{ g: "sais", lab: "You say that the Moon does not make light", re: [/(not|n'?t|never|no|cannot) (make|makes|produce|produces|give|gives|emit|emits|create|creates|have its own)|not (its own|a) (light|source)|no (own )?light|not a (primary )?(light )?source/] },
        { g: "sais", lab: "You use the words: scattering object", re: [/scatter|diffus|non.?luminous/] },
        { g: "deduis", lab: "You explain where the Moon's light comes from", re: [/sun/, /\blit\b|light|send|reflect|scatter|bounce/] },
        { g: "deduis", lab: "You explain that this light reaches us", re: [/\beyes?\b|observer|reach(es)? us|to us|towards us|reach(es)? (the )?earth|to (the )?earth|we (can )?see|see it/] }],
      model: "You are wrong: the Moon does not make its own light, it is not a primary light source. It is a scattering object: it is lit by the Sun and sends back part of this light, which reaches our eye." }],
  hints: ["In the lab, look where the light starts, then where it goes.", "To answer the crew member: is the Moon a primary light source or a scattering object? Where does its light come from? Where does it go?", "Sun · the Moon · our eye. The Moon does not give out light: it is a scattering object, lit by the Sun; it sends this light back to our eye."] },
b1: { parts: [
    { t: "task", c: "mod", label: "Look at the Moon at the end of the four weeks.", okMsg: "All four weeks observed.", done: () => { const n = Object.keys(xst().wk || {}).length; return { ok: n >= 4, msg: `${n}/4 weeks observed.` }; } },
    { t: "phase", c: "lire", label: "Draw what an observer on Earth sees.", rows: WEEKS([1, 3, 2, 0]) },
    { t: "num", c: "rais", tol: 1, label: "Calculation: using document 2, how many days are there between new moon and full moon?", unit: "days", ans: 14.5, err: [[v => v === 28, "28 days is a whole lunar month: from new moon to new moon."], [v => v === 7, "7 days only takes you to the first quarter."]] },
    { t: "word", c: "lire", label: `Between new moon and full moon, the lit part we can see ${gap}.`, ans: ["grows", "gets bigger", "increases", "gets larger", "becomes bigger", "is growing", "waxes", "grandit"], err: [[["shrinks", "decreases", "gets smaller", "wanes"], "Look at the sky in the simulator between week 4 and week 2."]] }],
  hints: ["Tap “Week 1”, then 2, 3 and 4: look at the Moon in the sky, on the right.", "Full moon is halfway through the lunar month: divide the length of the lunar month by 2.", "Week 1: right half. Week 2: all. Week 3: left half. Week 4: nothing. 28 ÷ 2 = 14 days; the lit part we can see grows."],
  corr: "Week 1: first quarter, the right half is lit. Week 2: full moon, the whole disc is lit. Week 3: last quarter, the left half is lit. Week 4: new moon, we cannot see any lit part. Full moon comes halfway through the lunar month: 28 ÷ 2 = about 14 days after new moon; between the two, the lit part we can see grows." },
b2: { parts: [
    { t: "phase", c: "mod", label: "Draw what an observer in space sees, from where you look at the diagram (the Sun is on their left).", rows: WEEKS([2, 2, 2, 2]) },
    { t: "redac", c: "rais", min: 25, label: `Explain why the Moon looks different for the observer on Earth, but always looks the same for the observer in space. ${FRAMES(["I know that the Sun always", "From space, the observer", "From Earth, we see", "So, what the Moon looks like depends on"])}`,
      crit: [{ g: "sais", lab: "The Sun always lights up one half of the Moon", re: [/half/, /\blit\b|light|illuminat/] },
        { g: "vois", lab: "From space, we always see the same thing", re: [/space/, /always|same|(not|n't) change|never change|identical/] },
        { g: "vois", lab: "From Earth, we see a bigger or smaller part of the lit half", re: [/earth/, /part|partly|partially|fully|all of|none|more or less|bigger|smaller|some of|whole|nothing|portion/] },
        { g: "deduis", lab: "You link it to the Moon's movement or to the frame of reference", re: [/frame|reference|point of view|position|where|around|orbit|moves|turns|rotat|revolv/] }],
      model: "I know that the Sun always lights up one half of the Moon. From space, the observer always looks from the same place: they always see the half facing the Sun, so the Moon always looks the same. From Earth, the Moon goes around us: depending on its position, we see all, part or none of its lit half. So, what the Moon looks like depends on the frame of reference." }],
  hints: ["On the diagram, the Sun lights everything from the left: which half of the Moon is lit in each position?", "Write in three steps: I know (what the Sun lights up) → I see (from space, from Earth) → so (the frame of reference). Use the sentence starters.", "The four drawings are the same (left half). The Sun always lights up one half; from Earth, we see a bigger or smaller part of it, depending on where the Moon is."] },
c0: { parts: [
    { t: "word", c: "lang", spell: true, label: `In English, <i lang=fr>“nouvelle lune”</i> is: ${gap}`, ans: ["new moon"] },
    { t: "word", c: "lang", spell: true, label: `In English, <i lang=fr>“pleine lune”</i> is: ${gap}`, ans: ["full moon"] },
    { t: "word", c: "lang", spell: true, label: `In English, <i lang=fr>“premier quartier”</i> is: ${gap}`, ans: ["first quarter"] },
    { t: "word", c: "lang", spell: true, label: `In English, <i lang=fr>“lunaison”</i> is: ${gap}`, ans: ["lunar month", "lunation"] },
    { t: "word", c: "lang", spell: true, label: `In English, <i lang=fr>“référentiel”</i> is: ${gap}`, ans: ["frame of reference", "reference frame", "frame"] }],
  hints: ["Use the key words of the earlier steps (tap 🔊 to hear them).", "In English, the adjective comes before the noun: <i lang=fr>pleine lune</i> → full … · <i lang=fr>lunaison</i> is a “month” of the Moon.", "new moon · full moon · first quarter · lunar month · frame of reference."],
  corr: `<i lang=fr>nouvelle lune</i> = new moon · <i lang=fr>pleine lune</i> = full moon · <i lang=fr>premier quartier</i> = first quarter · <i lang=fr>lunaison</i> = lunar month · <i lang=fr>référentiel</i> = frame of reference.` },
c1: { parts: [
    { t: "redac", c: "rais", min: 30, label: `Answer the mission question: why does the Moon look different every night? Use the words of the activity. ${FRAMES(["The Moon is a scattering object:", "The Sun always lights up", "In about 28 days", "Depending on its position, we see", "These are"])}`,
      crit: [{ g: "sais", lab: "The Moon is lit by the Sun", re: [/sun/, /\blit\b|light|scatter|reflect|send/] },
        { g: "sais", lab: "One half of the Moon is always lit", re: [/half/] },
        { g: "vois", lab: "The Moon goes around the Earth", re: [/around|orbit|turns|goes round|revolv|moves/] },
        { g: "deduis", lab: "We see a bigger or smaller part of the lit half", re: [/part|partly|partially|fully|all of|none|more or less|bigger|smaller|some of|whole|nothing|portion/] },
        { g: "sais", lab: "You use the words: phases, lunar month", re: [/phase|lunar month|lunation/] }],
      model: "The Moon is a scattering object: the Sun always lights up one half of the Moon. In about 28 days (a lunar month), the Moon goes around the Earth. Depending on its position, an observer on Earth sees all, part or none of this lit half: these are the phases of the Moon." },
    { t: "word", c: "rais", label: `Full moon. From the Moon, an astronaut looks at the Earth. The Earth looks ${gap}.`, ans: ["dark", "black", "not lit", "unlit", "almost dark", "all dark", "very dark", "in the night", "in darkness", "invisible", "sombre", "noire"], err: [[["lit", "bright", "full", "all lit", "fully lit", "round"], "That is what the observer on Earth sees of the Moon. Put yourself in the astronaut's place: is the half of the Earth facing them lit by the Sun?"]] }],
  hints: ["Use your answers from parts 1 and 2: what lights up the Moon? Which part? What does the Moon do around the Earth?", "For the astronaut, it is the Earth that is lit or not by the Sun. At full moon, the Moon is opposite the Sun.", "The Sun lights up one half of the Moon; as it goes around the Earth (lunar month), it shows us a bigger or smaller part of it: these are the phases. The astronaut sees the side of the Earth where it is night: dark."],
  corr: "The Sun always lights up one half of the Moon, a scattering object. As it goes around the Earth (lunar month of about 28 days), the Moon shows us a bigger or smaller part of this lit half: these are the phases of the Moon. At full moon, the Moon is opposite the Sun: the astronaut sees the side of the Earth where it is night, an Earth that is almost all dark." }
};
[RAPPEL, ...GROUPS.flatMap(g => g.items)].forEach(it => { if (EXPERT[it.id]) it.L = EXPERT[it.id]; });
const RESUME = `The mission question: ${PROBLEM}\n${HOME.goal}\n\nSummary to copy\n${BIL.map(x => "- " + x.replace(/<\/?u>/g, "")).join("\n")}\n- The four phases (Northern Hemisphere): new moon (nothing lit), first quarter (right half), full moon (whole disc), last quarter (left half).\n\nMy glossary\n${GLOSS.map(([en, fr]) => `- ${en} = ${fr}`).join("\n")}`;
