#!/usr/bin/env python3
"""Construit les 3 apps v2 (source « artifact ») puis les adapte pour GitHub Pages avec outils/adapter.py."""
import pathlib, subprocess, sys
ROOT = pathlib.Path(__file__).parent; SVT = ROOT.parent  # le dépôt svt (atelier/ est à sa racine)
SRC = ROOT / "src"; SRC.mkdir(exist_ok=True)
DEST = SVT / "terminale" / "theme-1"
APPS = {
  "fiches-atmosphere-climat": dict(title="Fiches Atmosphère et Climat", h1="Fiches interactives · Atmosphère et climat",
      sub="Dix fiches, des simulations à manipuler et des cartes de rappel espacé.", js=["data.js", "fiches.js"], css=[]),
  "qcm-atmosphere-climat": dict(title="QCM Atmosphère et Climat", h1="QCM · Atmosphère et climat",
      sub="38 questions en 6 parties, du 🟢 au 🔴. Coups de pouce, correction immédiate, bilan par compétence.", js=["data.js", "qcm.js"], css=[]),
  "entrainement-atmosphere-climat": dict(title="Entraînement Atmosphère et Climat", h1="Entraînement au DS · Atmosphère et climat",
      sub="Sept exercices sur documents à trois paliers, des sujets blancs chronométrés (1 h) et un bilan par compétence.", js=["data.js", "exos.js"], css=[]),
  "temperature-retroactions": dict(title="Température et rétroactions", h1="Évolution de la température et rétroactions",
      sub="Trois ateliers · océan, surfaces gelées, végétalisation : amplificateurs ou amortisseurs du réchauffement ?", js=["retro_widgets.js", "retro_data.js", "retro.js"], css=["retro.css"],
      dest="1-2-systeme-climatique", foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les données simulées portent la mention ⚠ Valeurs simulées. Lycée Français Vauban · Enseignement scientifique."),
  "multiplication-cellulaire": dict(title="Multiplication cellulaire", h1="Reconstituer les étapes de la multiplication cellulaire",
      sub="Observe une cellule qui se multiplie, photographie les étapes de la mitose et construis le bilan.", js=["kit.js", "mitose_widgets.js", "mitose_data.js", "mitose.js"], css=["svt.css", "mitose.css"],
      root="3e/vivant-evolution/ch2-transmission", eyebrow="3e SVT · Génétique et évolution · Activité 9",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les animations sont des modèles simplifiés. Lycée Français Vauban · SVT 3e."),
  "vitesses-mouvements": dict(title="Vitesses et mouvements", h1="Vitesses et mouvements",
      sub="Relie des vitesses, pilote un rover, lis le vol d'une fusée : accéléré, uniforme ou ralenti ?", js=["kit.js", "mouv_widgets.js", "mouv_data.js", "mouv.js"], css=["mouv.css"],
      root="5e/mission-5/mouvement", eyebrow="5e EIST · Mission 5 · Physique-chimie · Le mouvement",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les animations sont des modèles simplifiés. Lycée Français Vauban · EIST 5e."),
  "construire-une-fusee": dict(title="Construire une fusée", h1="S'informer et raisonner pour construire une fusée",
      sub="Légende une vraie fusée, relie chaque fonction à sa solution, puis teste tes fusées à l'atelier.", js=["kit.js", "fusee_widgets.js", "fusee_data.js", "fusee.js"], css=["mouv.css", "fusee.css"],
      root="5e/mission-5/mouvement", eyebrow="5e EIST · Mission 5 · Technologie · Activité 4",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les données simulées portent la mention ⚠ Valeurs simulées. Lycée Français Vauban · EIST 5e."),
  "fusee-a-eau": dict(title="Fusée à eau", h1="Construire une fusée à eau",
      sub="Choisis tes solutions techniques et ton matériel, teste tes réglages, puis prépare ta liste.", js=["kit.js", "eau_widgets.js", "eau_data.js", "eau.js"], css=["mouv.css", "fusee.css"],
      root="5e/mission-5/mouvement", eyebrow="5e EIST · Mission 5 · Technologie · Activité 5",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les données simulées portent la mention ⚠ Valeurs simulées. Lycée Français Vauban · EIST 5e."),
  "revision-chapitre-1": dict(title="Révision · L'information génétique", h1="Je révise le chapitre 1 : l'information génétique",
      sub="Activités 1 à 6 de l'enquête : caractères, hérédité, noyau, ADN, caryotypes. Puis un exercice type brevet.", js=["kit.js", "rev3_widgets.js", "rev3_data.js", "rev3.js"], css=["svt.css", "mouv.css", "rev3.css"],
      root="3e/vivant-evolution/ch1-information-genetique", eyebrow="3e SVT · Génétique · Révision du chapitre 1",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les schémas sont simplifiés. Lycée Français Vauban · SVT 3e."),
  "phases-de-la-lune": dict(title="Les phases de la Lune", h1="Pourquoi la Lune change-t-elle d'apparence ?",
      sub="Le trajet de la lumière, un simulateur de lunaison, le schéma Soleil-Terre-Lune et la vue depuis l'espace. Deux versions : guidée ou experte.", js=["kit.js", "lune_widgets.js", "lune_data.js", "lune.js"], css=["mouv.css", "lune.css"],
      root="5e/mission-5/soleil-terre-lune", eyebrow="5e EIST · Mission 5 · Physique-chimie · Activité 6",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les animations sont des modèles simplifiés. Lycée Français Vauban · EIST 5e."),
  "revision-mission-4": dict(title="Révision Mission 4", h1="Mission 4 : l'entraînement de l'équipage",
      sub="Particules d'eau, changements d'état, TP virtuel en temps réel, graphique à construire, microscope, boîte de Petri et enquête alimentaire.", js=["kit.js", "m4b_plot.js", "m4b_widgets.js", "m4b_data.js", "m4b.js"], css=["mouv.css", "m4b.css"],
      root="5e/mission-4", eyebrow="5e EIST · Mission 4 · Charger des vivres dans la fusée · Révision",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les données simulées portent la mention ⚠ Valeurs simulées. Lycée Français Vauban · EIST 5e."),
  "revision-mission-5": dict(title="Révision Mission 5", h1="Mission 5 : la check-list avant le décollage",
      sub="Centrifugeuse, analyse du sang, référentiel, vitesses, mouvements, objet technique et phases de la Lune : manipule, réponds, trouve le code de lancement.", js=["kit.js", "rev5_widgets.js", "rev5_data.js", "m4b.js"], css=["mouv.css", "rev5.css"],
      root="5e/mission-5", eyebrow="5e EIST · Mission 5 · Le décollage de la fusée · Révision",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les données simulées portent la mention ⚠ Valeurs simulées. Lycée Français Vauban · EIST 5e."),
  "pomme-de-terre-metabolisme": dict(title="Pomme de terre et métabolisme", h1="Pomme de terre et respiration cellulaire",
      sub="TP virtuel sur l'amylase, glucose dans le sang, stockage et voies métaboliques : comment un aliment fournit matière et énergie.", js=["kit.js", "pomme_widgets.js", "pomme_data.js", "pomme.js"], css=["svt.css", "mouv.css", "pomme.css"],
      root="2nde/theme-1/metabolisme", eyebrow="2nde SVT · Thème 1 · Chapitre 2 · Le métabolisme des cellules",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les données simulées sont signalées par ⚠. Lycée Français Vauban · SVT 2nde."),
  "labo-agglutination-tp-note": dict(title="TP noté · Agglutination", h1="TP noté : analyse du sang retrouvé sur les vêtements de la victime",
      sub="Réalise le test d'agglutination, note tes résultats, rédige ta conclusion, puis rends ta copie : barème sur 10 points.", js=["kit.js", "tpagg.js"], css=["svt.css", "mouv.css", "tpagg.css"],
      root="3e/vivant-evolution/ch2-transmission", eyebrow="3e SVT · Génétique · Activité 7 · TP évalué sur 10",
      foot="Aucune donnée n'est envoyée : la copie reste sur cet appareil jusqu'à ce que l'élève la transmette. Labo virtuel : résultats simulés. Lycée Français Vauban · SVT 3e."),
  "revision-genetique-activites-1-10": dict(title="Révision · Génétique 3e", h1="Je révise la génétique : activités 1 à 10",
      sub="Jumeaux, clonage, TP de l'ADN, caryotypes, agglutination, allèles, mitose et méiose : manipule, réponds, puis récupère ta fiche de révision.", js=["kit.js", "rev10_draw.js", "rev10_widgets.js", "rev10_data.js", "rev10.js"], css=["svt.css", "mouv.css", "mitose.css", "meio.css", "rev10.css"],
      root="3e/vivant-evolution/ch2-transmission", eyebrow="3e SVT · Génétique · Révision du chapitre",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les simulations sont des modèles simplifiés, signalés par ⚠. Lycée Français Vauban · SVT 3e."),
  "meiose-cellules-reproductrices": dict(title="La méiose · Activité 10", h1="Reconstituer les étapes de la méiose",
      sub="Observe une cellule qui donne quatre cellules reproductrices, complète le schéma, joue à la loterie des chromosomes et remplis le tableau de croisement.", js=["kit.js", "meio_widgets.js", "meio_data.js", "meio.js"], css=["svt.css", "mouv.css", "mitose.css", "meio.css"],
      root="3e/vivant-evolution/ch2-transmission", eyebrow="3e SVT · Génétique · Activité 10",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les animations sont des modèles simplifiés. Lycée Français Vauban · SVT 3e."),
  "trois-echelles-biodiversite": dict(title="Les échelles de la biodiversité", h1="Espèce, parentés et échelles de la biodiversité",
      sub="Croise des canards, convertis des groupes emboîtés en arbre de parenté, puis explore un lac, une forêt et un champ.", js=["kit.js", "bio_widgets.js", "bio_data.js", "bio.js"], css=["svt.css", "mouv.css", "bio.css"],
      root="2nde/theme-1/echelles-biodiversite", eyebrow="2nde SVT · Thème 1 · Chapitre 3 · Biodiversité actuelle et passée",
      foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les données simulées sont signalées par ⚠. Lycée Français Vauban · SVT 2nde."),
  "potato-metabolism-dnl": dict(title="Potato and cell metabolism", h1="Potato and cellular respiration", lang="en", en="pomme_en.json",
      sub="Virtual amylase lab, glucose in the blood, storage and metabolic pathways: how a food provides matter and energy.", js=["kit.js", "pomme_widgets.js", "pomme_data.js", "pomme.js"], css=["svt.css", "mouv.css", "pomme.css"],
      root="2nde/theme-1/metabolisme", eyebrow="Year 11 (2nde) · DNL Biology · Theme 1 · Chapter 2 · Cell metabolism",
      foot="No data is sent: your answers stay on this device. Simulated data are flagged with ⚠. Lycée Français Vauban · DNL Biology."),
}
HEADER = """<header class="band"><div class="wrap"><div class="titles"><p class="eyebrow">{eyebrow}</p><h1>{h1}</h1><p class="sub">{sub}</p></div>
<div class="tools" role="toolbar" aria-label="Affichage"><button class="tbtn" id="fsMinus" type="button" aria-label="Réduire la taille du texte">A−</button><button class="tbtn" id="fsPlus" type="button" aria-label="Agrandir la taille du texte">A+</button><button class="tbtn" id="themeBtn" type="button">☾ Sombre</button><button class="tbtn" id="projBtn" type="button" aria-pressed="false">⛶ Projection</button>{extra}</div></div></header>
<nav class="tabs" aria-label="Sections"><div class="wrap tabsw"><div id="tabs" class="tabsl"></div><div id="tabx"></div></div></nav>
<main class="wrap" id="main"><p>Chargement…</p></main>
<footer class="wrap foot">{foot}</footer>
<noscript><p class="wrap">Cette application a besoin de JavaScript : ouvre le lien dans Safari (pas dans l'aperçu de Teams ou de Fichiers).</p></noscript>"""
def build(slug, cfg):
    css = (ROOT / "core.css").read_text() + "".join("\n" + (ROOT / c).read_text() for c in cfg["css"])
    parts = {f: (ROOT / f).read_text() for f in cfg["js"]}
    pre = ""
    if cfg.get("lang") == "en":
        import json
        CORE_EN = {"locale": "en-GB", "dec": ".", "readHint": "Tap the graph to read a value.", "table": "Table of values", "light": "☀ Light", "dark": "☾ Dark", "dlNo": "Download is not available here: use “Copy” or “Show the teacher”.", "dlOk": "File offered for saving.", "dlDeclined": "Saving cancelled.", "dlBusy": "A request is already open: try again in a moment.", "dlFail": "Download not possible here: use “Copy”.", "dlDone": "File downloaded.", "name": "First name or number (optional, stays on this device)", "bDl": "⬇ Download (.txt)", "bCp": "⧉ Copy", "bMail": "✉ Send by email", "bShow": "👁 Show the teacher", "cpSel": "Text selected: copy it with ⌘C / Ctrl+C or the Copy menu.", "cpOk": "Report copied: paste it where your teacher asked.", "mailOk": "Your mail app should open with your report.", "bilanTxt": "Report text", "close": "Close", "student": "student", "subject": "Report ", "animRun": "▶ Start", "animPause": "⏸ Pause", "animResume": "▶ Resume", "animReset": "↺ Restart"}
        pre = "window.TP_LANG=\"en\";window.CORE_T=" + json.dumps(CORE_EN, ensure_ascii=False) + ";\n"
        eng = cfg["js"][-1]
        for a, bb in json.loads((ROOT / cfg["en"]).read_text()): parts[eng] = parts[eng].replace(a, bb)
    js = pre + (ROOT / "core.js").read_text() + "\n" + "\n".join(parts[f] for f in cfg["js"])
    extra = '<button class="tbtn" id="timerBtn" type="button" aria-pressed="false">⏱ Mode DS</button>' if slug.startswith("entrainement") else ""
    body = HEADER.format(h1=cfg["h1"], sub=cfg["sub"], extra=extra, eyebrow=cfg.get("eyebrow", "Terminale · Enseignement scientifique · Thème 1 « Science, climat et société »"), foot=cfg.get("foot", "Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les données simulées portent la mention ⚠ Valeurs simulées. Lycée Français Vauban · Enseignement scientifique."))
    if cfg.get("lang") == "en":
        for a, bb in [("Réduire la taille du texte", "Smaller text"), ("Agrandir la taille du texte", "Larger text"), ("☾ Sombre", "☾ Dark"), ("⛶ Projection", "⛶ Projector"), ('aria-label="Affichage"', 'aria-label="Display"'), ("Chargement…", "Loading…"), ("Cette application a besoin de JavaScript : ouvre le lien dans Safari (pas dans l'aperçu de Teams ou de Fichiers).", "This app needs JavaScript: open the link in Safari (not in the Teams or Files preview).")]: body = body.replace(a, bb)
    src = f'<title>{cfg["title"]}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<style>\n{css}\n</style>\n{body}\n<script>\n{js}\n</script>\n'
    p = SRC / f"{slug}.html"; p.write_text(src)
    out = subprocess.check_output([sys.executable, str(SVT / "outils" / "adapter.py"), str(p), str((SVT / cfg["root"] if cfg.get("root") else DEST / cfg["dest"] if cfg.get("dest") else DEST) / f"{slug}.html")] + (["--lang", "en"] if cfg.get("lang") == "en" else []), text=True)
    print(out.strip())
only = sys.argv[1:]
for slug, cfg in APPS.items():
    if only and not any(o in slug for o in only): continue
    if all((ROOT / f).exists() for f in cfg["js"]): build(slug, cfg)
