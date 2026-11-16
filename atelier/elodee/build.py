#!/usr/bin/env python3
"""Assemble les apps TP élodée (FR et DNL EN) : version artifact + version autonome."""
import pathlib, json, base64, io, subprocess
from PIL import Image
ROOT = pathlib.Path(__file__).parent
DIST = ROOT / "dist"; DIST.mkdir(exist_ok=True)
SRC = pathlib.Path("/tmp/claude-0/-home-claude/d63be38d-acd9-551a-9167-ad2291795a00/scratchpad/tp/img")

def jpg(name, maxw, q=78):
    done = ROOT / "img" / (name.split(".")[0] + ".jpg")
    if not (SRC / name).exists() and done.exists():  # images déjà préparées (cas normal depuis le dépôt)
        return "data:image/jpeg;base64," + base64.b64encode(done.read_bytes()).decode()
    im = Image.open(SRC / name).convert("RGB")
    if im.width > maxw: im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "JPEG", quality=q, optimize=True, progressive=True)
    (ROOT / "img").mkdir(exist_ok=True); (ROOT / "img" / (name.split(".")[0] + ".jpg")).write_bytes(b.getvalue())
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()

IMG = {"elodee": jpg("fr-004-003.png", 829, 76), "levure": jpg("fr-004-006.png", 460, 80), "latis": jpg("fr-003-002-40.png", 600, 72)}
meta = json.loads(subprocess.check_output(["node", "-e", "const T=require('./content.js');console.log(JSON.stringify({fr:T.fr.meta,en:T.en.meta}))"], cwd=ROOT))

CORE_EN = {"locale": "en-GB", "dec": ".", "readHint": "Tap the graph to read a value.", "table": "Table of values", "light": "☀ Light", "dark": "☾ Dark",
  "dlNo": "Download is not available here: use “Copy” or “Show the teacher”.", "dlOk": "File offered for saving.", "dlDeclined": "Saving cancelled.",
  "dlBusy": "A request is already open: try again in a moment.", "dlFail": "Download not possible here: use “Copy”.", "dlDone": "File downloaded.",
  "name": "First name or number (optional, stays on this device)", "bDl": "⬇ Download (.txt)", "bCp": "⧉ Copy", "bMail": "✉ Send by email", "bShow": "👁 Show the teacher",
  "cpSel": "Text selected: copy it with ⌘C / Ctrl+C or the Copy menu.", "cpOk": "Score copied: paste it where your teacher asked.", "mailOk": "Your mail app should open with your score.",
  "bilanTxt": "Score text", "close": "Close", "student": "student", "subject": "Score "}

APPS = {
  "tp-elodee-fr": dict(lang="fr", title="TP Élodée · Photosynthèse ou respiration", btn=("Réduire la taille du texte", "Agrandir la taille du texte", "☾ Sombre", "⛶ Projection", "Affichage", "Étapes"),
                       foot="Aucune donnée n'est envoyée : les réponses restent sur cet appareil. Les données simulées sont signalées par ⚠. Lycée Français Vauban · SVT 2nde.",
                       noscript="Cette application a besoin de JavaScript : ouvre le lien dans Safari (pas dans l'aperçu de Teams ou de Fichiers)."),
  "elodea-lab-dnl": dict(lang="en", title="Elodea Lab · Photosynthesis or Respiration", btn=("Smaller text", "Larger text", "☾ Dark", "⛶ Projector", "Display", "Steps"),
                       foot="No data is sent: your answers stay on this device. Simulated data are flagged with ⚠. Lycée Français Vauban · DNL Biology (Year 10 / 2nde).",
                       noscript="This app needs JavaScript: open the link in Safari (not in the Teams or Files preview)."),
}

def build(slug, cfg):
    m = meta[cfg["lang"]]; b = cfg["btn"]
    css = "\n".join((ROOT / f).read_text() for f in ["core.css", "svt.css", "tp.css"])
    pre = f"window.TP_LANG={json.dumps(cfg['lang'])};window.IMG={json.dumps(IMG)};" + (f"window.CORE_T={json.dumps(CORE_EN, ensure_ascii=False)};" if cfg["lang"] == "en" else "")
    js = (ROOT / "core.js").read_text() + "\n" + (ROOT / "content.js").read_text() + "\n" + (ROOT / "tp.js").read_text()
    body = f"""<header class="band"><div class="wrap"><div class="titles"><p class="eyebrow">{m['eyebrow']}</p><h1>{m['title']}</h1><p class="sub">{m['sub']}</p></div>
<div class="tools" role="toolbar" aria-label="{b[4]}"><button class="tbtn" id="fsMinus" type="button" aria-label="{b[0]}">A−</button><button class="tbtn" id="fsPlus" type="button" aria-label="{b[1]}">A+</button><button class="tbtn" id="themeBtn" type="button">{b[2]}</button><button class="tbtn" id="projBtn" type="button" aria-pressed="false">{b[3]}</button></div></div></header>
<nav class="tabs" aria-label="{b[5]}"><div class="wrap" id="tabs"></div></nav>
<main class="wrap" id="main"><p>…</p></main>
<footer class="wrap foot">{cfg['foot']}</footer>
<noscript><p class="wrap">{cfg['noscript']}</p></noscript>"""
    art = f'<title>{cfg["title"]}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<style>\n{css}\n</style>\n{body}\n<script>\n{pre}\n{js}\n</script>\n'
    full = (f'<!doctype html>\n<html lang="{cfg["lang"]}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            f'<title>{cfg["title"]}</title>\n<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}[hidden]{{display:none!important}}img{{max-width:100%}}</style>\n'
            f'<style>\n{css}\n</style>\n</head>\n<body>\n{body}\n<script>\n{pre}\n{js}\n</script>\n</body>\n</html>\n')
    (DIST / f"{slug}.artifact.html").write_text(art); (DIST / f"{slug}.html").write_text(full)
    print(slug, len(full) // 1024, "Ko")

for slug, cfg in APPS.items(): build(slug, cfg)
