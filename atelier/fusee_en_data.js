/* ===== 5e EIST · Mission 5 · Activité 4 en DNL anglais (A2-B1) : contenus adaptés de la fiche du professeur =====
   Mêmes manipulations que la version française ; consignes courtes, mots-clés EN → FR avec prononciation, glossaire. */
const PROBLEM = "What is each part of a rocket for?";
const DOC_FUSEE = { title: "Document · The parts of a real rocket", w: "rocketDoc" };
const FT = [["Help the rocket go through the air (less friction)", "Nose cone"], ["Hold the fuel", "Fuel tank"], ["Push out the hot gases", "Nozzle"], ["Make gases under high pressure by burning fuel", "Combustion chamber"], ["Resist the pressure of the hot gases", "Body (structure)"], ["Keep the rocket stable and correct its path", "Fins"]];
const USAGE = "To carry a payload (a satellite, a crew) into space";
const GLOSS = [["nose cone", "la coiffe"], ["fuel tank", "le réservoir"], ["body", "le corps (la structure)"], ["combustion chamber", "la chambre de combustion"], ["nozzle", "la tuyère"], ["fins", "les ailerons"], ["fuel", "le carburant"], ["payload", "la charge (satellite, équipage)"], ["main function", "la fonction d'usage"], ["technical function", "une fonction technique"], ["technical solution", "une solution technique"]];
const CANDO = ["I can name the parts of a rocket in English.", "I can say what each part is for: “The fins keep the rocket stable.”", "I can change one thing at a time to compare two tests."];
const bilanHTML = () => `<p><b>Main function</b> (what is the rocket for?): <u>${USAGE}</u>.</p>${tbl(["Technical function (what must it do?)", "Technical solution (which part does it?)"], FT.map(([f, s]) => [f, `<u>${s}</u>`]))}<p>The <b>main function</b> says what the object is for. A <b>technical function</b> says what the object must do. A <b>technical solution</b> is the part that does it.</p><p class="lab2"><b>My glossary</b></p>${glossTable(GLOSS)}${canDo(CANDO)}`;

const GROUPS = [
{ id: "p1", n: 1, icon: "🔍", tab: "Find out", title: "Find out about a real rocket", sub: "Read the information cards and label the drawing.",
  items: [
  { id: "a1", lvl: "easy", title: "Label the rocket", docs: [DOC_FUSEE],
    intro: KW([["nose cone", "coiffe"], ["fuel tank", "réservoir"], ["body", "corps"], ["combustion chamber", "chambre de combustion"], ["nozzle", "tuyère"], ["fins", "ailerons"]]),
    parts: [{ t: "match", c: "lire", label: "Give a name to each number on the drawing.", ask: "Choose the name for", rows: [{ e: "①", txt: "Number 1", v: "Nose cone" }, { e: "②", txt: "Number 2", v: "Fuel tank" }, { e: "③", txt: "Number 3", v: "Body (structure)" }, { e: "④", txt: "Number 4", v: "Combustion chamber" }, { e: "⑤", txt: "Number 5", v: "Nozzle" }, { e: "⑥", txt: "Number 6", v: "Fins" }] }],
    hints: ["Each card says where the part is: at the top, inside, at the very bottom…", "Number 1 is at the top. Number 5 is the cone at the very bottom. Number 6 shows the small wings.", "1 nose cone · 2 fuel tank · 3 body · 4 combustion chamber · 5 nozzle · 6 fins."],
    corr: "1: nose cone (at the top). 2: fuel tank (big container inside). 3: body, the wall of the rocket. 4: combustion chamber (in the engine). 5: nozzle (cone at the very bottom). 6: fins (small wings at the bottom)." }] },

{ id: "p2", n: 2, icon: "🧩", tab: "Functions", title: "Complete the diagram", sub: "Main function, technical functions and technical solutions.",
  items: [
  { id: "b1", lvl: "easy", title: "The main function",
    intro: `<span class="box info" style="display:grid"><span class="lab">ℹ Vocabulary</span><span>The <b>main function</b> answers the question: “What is this object <b>for</b>?” <i lang="fr">(= la fonction d'usage)</i></span></span>${KW([["payload", "charge"], ["crew", "équipage"], ["fuel", "carburant"]])}`,
    parts: [
      { t: "choice", c: "rais", label: "What is the main function of a rocket?", o: ["To burn fuel", USAGE, "To fly as fast as possible", "To resist pressure"], a: 1, no: { 0: "Burning fuel is a way to do it, not the goal.", 2: "Speed is a way to reach space, not the goal.", 3: "This is a technical function: something the rocket must do to succeed." } },
      { t: "choice", c: "rais", label: "“Hold the fuel” is…", o: ["the main function of the rocket", "a technical function: something the rocket must do for its mission", "a technical solution: a part of the rocket"], a: 1 }],
    hints: ["Why do we send rockets?", "A rocket carries something: a satellite, a space probe, astronauts.", "Main function: to carry a payload into space. “Hold the fuel” is a technical function."],
    corr: "The main function of a rocket is to carry a payload (a satellite, a crew) into space. To do this, it must do several technical functions, for example hold the fuel." },
  { id: "d2", lvl: "mid", title: "Match each technical function to its solution", docs: [DOC_FUSEE], recop: true,
    intro: `<span class="box info" style="display:grid"><span class="lab">ℹ Vocabulary</span><span>A <b>technical solution</b> is the part of the rocket that does a technical function. <i lang="fr">(= une solution technique)</i></span></span>${KW([["to hold", "contenir"], ["to push out", "éjecter"], ["to resist", "résister"], ["stable", "stable, bien droit"], ["path", "trajectoire"]])}`,
    parts: [{ t: "match", c: "rais", label: "Match each technical function to its technical solution.", ask: "Choose the solution for", rows: FT.map(([f, s]) => ({ e: "⚙", txt: f, v: s })) }],
    hints: ["Read the information cards again: each one explains the job of a part.", "The part that cuts through the air is at the top. The part that lets the gases out is at the very bottom.", "Nose cone: through the air. Fuel tank: fuel. Nozzle: push out the gases. Combustion chamber: make the gases. Body: resist. Fins: stable."],
    corr: "Go through the air: nose cone. Hold the fuel: fuel tank. Push out the gases: nozzle. Make gases by burning fuel: combustion chamber. Resist the pressure: body of the rocket. Keep the rocket stable and correct its path: fins." }] },

{ id: "p3", n: 3, icon: "🚀", tab: "Launch lab", title: "The launch lab", sub: "Test some rockets, fix the ones that fly badly, then fill in your mission log.",
  items: [
  { id: "c1", lvl: "mid", title: "Test to understand",
    intro: KW([["to launch", "lancer"], ["height", "altitude"], ["higher", "plus haut"], ["straight", "droit"], ["pointed", "pointu"], ["flat", "plat"]]),
    widget: { title: "Simulation · Launch lab", w: "atelier", sim: "Simulated values" },
    parts: [
      { t: "rows", c: "mod", label: "Do some tests. Change only one part at a time. What do you notice?", choices: ["It goes higher", "It flies straight", "Nothing changes"], rows: [{ txt: "When you add fins, mainly…", a: 1 }, { txt: "When you change the flat top for a pointed nose cone…", a: 0 }, { txt: "When you take a big fuel tank…", a: 0 }] },
      { t: "num", c: "mod", label: "What is the greatest height you can reach?", unit: "m", ans: 80, tol: 0.5, err: [[v => v === 100, "100 m is the top of the scale. Read the height shown after the flight."], [v => v < 80, "Another rocket goes higher: change one more part."]] }],
    hints: ["First launch the starting rocket. Then change only one button and launch again.", "Look at the table “My tests”: it keeps all your results.", "Best rocket: pointed nose cone, with fins, big fuel tank. It reaches 80 m."],
    corr: "The fins keep the rocket stable: it flies straight. The pointed nose cone reduces air friction: the rocket goes higher. A big fuel tank holds more fuel: the rocket goes higher. The best rocket reaches 80 m." },
  { id: "c2", lvl: "hard", title: "Challenge · Fix a rocket",
    parts: [
      { t: "choice", c: "rais", label: "A mini rocket takes off, then goes sideways and spins. Which technical function is missing?", o: ["Hold the fuel", "Keep the rocket stable and correct its path", "Push out the hot gases"], a: 1 },
      { t: "choice", c: "rais", label: "What must you add?", o: ["A wider nozzle", "Fins", "A second fuel tank"], a: 1 },
      { t: "choice", c: "rais", label: "The body of another rocket breaks at take-off. Which technical function is missing?", o: ["Resist the pressure of the hot gases", "Help the rocket go through the air", "Keep the rocket stable"], a: 0 },
      { t: "choice", c: "rais", label: "A rocket flies straight, but the air slows it down a lot. Which part must you improve?", o: ["The fins", "The fuel tank", "The nose cone"], a: 2 }],
    hints: ["First find the technical function that does not work, then the part that does it.", "Fly straight: stable. Not break: resist the pressure. Cut through the air: through the air.", "Fins to keep it stable · a strong body to resist · a nose cone to cut through the air."],
    corr: "A rocket that goes sideways is not stable: it needs fins. A body that breaks does not resist the pressure of the gases. A rocket slowed down by the air needs a better nose cone." },
  { id: "c3", lvl: "easy", title: "Mission log · My glossary",
    intro: "Show that you know the words of the mission. Tap 🔊 to hear a word.",
    parts: [
      { t: "match", c: "lang", label: "Find the French word for each English word.", ask: "Choose the French word for", rows: [{ e: "🔤", txt: "nose cone", v: "coiffe" }, { e: "🔤", txt: "fuel tank", v: "réservoir" }, { e: "🔤", txt: "nozzle", v: "tuyère" }, { e: "🔤", txt: "fins", v: "ailerons" }, { e: "🔤", txt: "payload", v: "charge" }, { e: "🔤", txt: "main function", v: "fonction d'usage" }] },
      { t: "word", c: "lang", spell: true, label: `Complete: “The ${`<span class="gap">………</span>`} keep the rocket stable.”`, ans: ["fins", "fin", "ailerons"], err: [[["nose cone", "nozzle", "fuel tank"], "This part does something else. Which part looks like small wings?"]] }],
    hints: ["Use the key words of the earlier steps: they give the French word.", "“Nozzle” is the cone where the gases come out. “Payload” is what the rocket carries.", "nose cone = coiffe · fuel tank = réservoir · nozzle = tuyère · fins = ailerons · payload = charge · main function = fonction d'usage. The fins keep the rocket stable."],
    corr: "nose cone = coiffe · fuel tank = réservoir · nozzle = tuyère · fins = ailerons · payload = charge · main function = fonction d'usage. “The fins keep the rocket stable.”" }] }
];

const RAPPEL = { id: "r0", lvl: "easy", title: "Warm-up",
  intro: KW([["bike", "vélo"], ["brakes", "freins"], ["saddle", "selle"], ["handlebars", "guidon"]]),
  parts: [
    { t: "choice", c: "conn", label: "A bike is for travelling. “Travelling” is…", o: ["its main function", "a technical solution", "a material"], a: 0 },
    { t: "choice", c: "conn", label: "On a bike, which part helps you slow down?", o: ["The saddle", "The brakes", "The handlebars"], a: 1 }],
  hints: ["The main function says what the object is for.", "Each part of an object has a job.", "The main function · the brakes."],
  corr: "“Travelling” is the main function of the bike. The brakes are the technical solution that helps you slow down. We describe a rocket in the same way." };

const RESUME = `Mission: ${PROBLEM}

Remember
- Main function of the rocket: ${USAGE.toLowerCase()}.
${FT.map(([f, s]) => `- ${f}: ${s.toLowerCase()}`).join("\n")}
- The main function says what the object is for. A technical function says what the object must do. A technical solution is the part that does it.

My glossary
${GLOSS.map(([en, fr]) => `- ${en} = ${fr}`).join("\n")}`;
