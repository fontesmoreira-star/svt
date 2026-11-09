#!/usr/bin/env python3
"""Génère les pages de navigation du site à partir de outils/catalogue.json.

    python3 outils/generer_pages.py

Pages produites (les apps elles-mêmes ne sont pas touchées) :
- index.html                              accueil : une carte par niveau
- <niveau>/index.html                     page du niveau : thèmes, chapitres, activités
- <niveau>/<thème>/index.html             page d'un thème (s'il contient des activités)
- <niveau>/<thème>/<chapitre>/index.html  page d'un chapitre (s'il contient des activités)
- pages de redirection pour les anciennes adresses (clé « redirections »)

Emplacement d'une activité : <niveau>/[<thème>/[<chapitre>/]]<fichier>.
Le script s'arrête si un fichier annoncé dans le catalogue est absent.
"""
import html, json, os, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CAT = json.load(open(os.path.join(ROOT, "outils", "catalogue.json"), encoding="utf-8"))
E = lambda s: html.escape(s, quote=True)

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='14' fill='%23123d2a'/%3E"
           "%3Cpath d='M20 12c0 14 24 26 24 40M44 12c0 14-24 26-24 40' stroke='%236fcf97' stroke-width='5' fill='none' stroke-linecap='round'/%3E"
           "%3Cpath d='M23 22h18M23 42h18M27 32h10' stroke='%23eaf5ee' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E")

CSS = """
:root{
  --bg:#eff4f1; --surface:#ffffff; --ink:#0f2d36; --muted:#46626c; --line:#bfd2d4;
  --svt:#1f6b45; --svt-soft:#dbeee2; --svt-band:#123d2a;
  --eist:#0b6170; --eist-soft:#d7ecee; --eist-band:#0a3a45;
  --es:#0a6a76; --es-soft:#d9eef0; --es-band:#0c3c48;
  --band-ink:#eef6f2; --band-muted:#b5d3c6;
  --info:#1d5fa8; --info-soft:#e4eefb; --focus:#f2b705;
  --f-display:"Avenir Next","Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;
  --f-body:system-ui,-apple-system,"Segoe UI","Helvetica Neue",Arial,sans-serif;
  --fs:20px; color-scheme:light;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#0b171b; --surface:#12242a; --ink:#e4eff1; --muted:#a3bac1; --line:#2f4a52;
  --svt:#6fcf97; --svt-soft:#173a28; --svt-band:#0b2a1c;
  --eist:#5cc6d3; --eist-soft:#123840; --eist-band:#06262e;
  --es:#55c1cc; --es-soft:#123a40; --es-band:#072a33;
  --band-ink:#e4f2ea; --band-muted:#93c2a6;
  --info:#8ab8f2; --info-soft:#15263b; color-scheme:dark;
}}
*{box-sizing:border-box}
html{font-size:var(--fs);-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--f-body);font-size:1rem;line-height:1.5}
h1,h2,h3{font-family:var(--f-display);line-height:1.15;margin:0;text-wrap:balance}
a{color:inherit}
:focus-visible{outline:3px solid var(--focus);outline-offset:3px;border-radius:6px}
.wrap{max-width:1040px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.c-svt{--c:var(--svt);--cs:var(--svt-soft);--band:var(--svt-band)}
.c-eist{--c:var(--eist);--cs:var(--eist-soft);--band:var(--eist-band)}
.c-es{--c:var(--es);--cs:var(--es-soft);--band:var(--es-band)}
header.top{background:var(--band);color:var(--band-ink);padding-top:env(safe-area-inset-top,0px)}
header.top .wrap{display:flex;flex-wrap:wrap;align-items:flex-end;gap:12px 20px;padding-top:18px;padding-bottom:22px}
.brand{flex:1 1 320px;min-width:0}
.crumbs{display:flex;flex-wrap:wrap;gap:2px 6px;font-size:.8rem;margin-bottom:10px;color:var(--band-muted)}
.crumbs a{color:var(--band-ink);text-decoration:underline;text-underline-offset:3px;padding:6px 0;display:inline-block}
.crumbs span[aria-hidden]{padding:6px 0}
.kick{font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--band-muted);font-weight:600}
h1{font-size:clamp(1.5rem,4.2vw,2.2rem);margin-top:4px}
.tools{display:flex;flex-wrap:wrap;gap:8px}
.tbtn{min-width:52px;min-height:52px;padding:0 12px;border-radius:12px;border:2px solid var(--band-muted);background:transparent;color:var(--band-ink);font:700 .95rem var(--f-body);cursor:pointer}
.msg{min-height:1.5em;font-size:.85rem;color:var(--muted);margin:10px 0 0}
.box{display:flex;gap:12px;align-items:flex-start;border-radius:14px;padding:14px 16px;margin:18px 0;border-left:6px solid}
.box .ic{font-size:1.2rem;line-height:1.4;flex:0 0 auto}
.box b{display:block}
.box p{margin:2px 0 0}
.box.info{background:var(--info-soft);border-color:var(--info)}
.box.soon{background:var(--surface);border-color:var(--line);color:var(--muted)}
section.theme{margin:34px 0 8px}
.thead{border-bottom:3px solid var(--c);padding-bottom:8px;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px}
.thead h2{font-size:1.35rem;color:var(--c)}
.thead a{font-size:.85rem;font-weight:600;color:var(--c);padding:8px 0}
.chap{margin:22px 0 6px}
.chap h3{font-size:1.1rem;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px}
.chap h3 a{font-size:.8rem;font-weight:600;color:var(--c);padding:8px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:14px;margin-top:12px}
a.card{display:flex;flex-direction:column;gap:8px;text-decoration:none;background:var(--surface);border:2px solid var(--line);border-radius:16px;padding:16px 18px;min-height:140px}
a.card:active{transform:scale(.99)}
@media (hover:hover){a.card:hover{border-color:var(--c)}}
.tag{align-self:flex-start;font-size:.72rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--c);background:var(--cs);border-radius:8px;padding:3px 9px}
a.card h3,a.card h4{font-size:1.08rem;margin:0;font-family:var(--f-display);line-height:1.2}
a.card p{margin:0;color:var(--muted);font-size:.88rem;flex:1}
.go{font-weight:700;color:var(--c);font-size:.92rem}
a.lvl{min-height:170px;border-width:3px;border-color:var(--c)}
a.lvl .big{font-family:var(--f-display);font-size:1.6rem;font-weight:700;color:var(--c);line-height:1.1}
.soonlist{margin:6px 0 0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px}
.soonlist li{background:var(--surface);border:1px dashed var(--line);border-radius:10px;padding:4px 10px;font-size:.82rem;color:var(--muted)}
.second{margin-top:26px}
.second h2{font-size:1rem;color:var(--muted);font-family:var(--f-body);font-weight:600;margin-bottom:6px}
footer{color:var(--muted);font-size:.8rem;padding:34px 0 calc(30px + env(safe-area-inset-bottom,0px))}
"""

JS = """
(function(){
  var KEY="portail-svt-v1", st={fs:20};
  try{var raw=localStorage.getItem(KEY);if(raw){var o=JSON.parse(raw);if(o&&o.fs)st.fs=o.fs;}}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}}
  function applyFs(){document.documentElement.style.setProperty("--fs",st.fs+"px");}
  var p=document.getElementById("fsp"),m=document.getElementById("fsm"),c=document.getElementById("cpy"),msg=document.getElementById("msg");
  if(p)p.onclick=function(){st.fs=Math.min(30,st.fs+2);applyFs();save();};
  if(m)m.onclick=function(){st.fs=Math.max(18,st.fs-2);applyFs();save();};
  if(c)c.onclick=function(){
    var u=location.href.split("#")[0];
    var done=function(){msg.textContent="Lien copié : "+u;};
    var fail=function(){msg.textContent="Lien de cette page : "+u;};
    try{navigator.clipboard.writeText(u).then(done,fail);}catch(e){fail();}
  };
  applyFs();
})();
"""


def page(title, desc, depth, couleur, crumbs, kick, h1, body):
    up = "../" * depth
    crumb_html = ""
    if crumbs:
        parts = []
        for label, href in crumbs:
            parts.append(f'<a href="{href}">{E(label)}</a><span aria-hidden="true">›</span>')
        crumb_html = f'<nav class="crumbs" aria-label="Fil d\'Ariane">{"".join(parts)}</nav>'
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<link rel="icon" href="{FAVICON}">
<style>{CSS}</style>
</head>
<body class="c-{couleur}">
<header class="top">
  <div class="wrap">
    <div class="brand">
      {crumb_html}
      <div class="kick">{E(kick)}</div>
      <h1>{E(h1)}</h1>
    </div>
    <div class="tools">
      <button class="tbtn" id="fsm" type="button" aria-label="Réduire le texte">A−</button>
      <button class="tbtn" id="fsp" type="button" aria-label="Agrandir le texte">A+</button>
      <button class="tbtn" id="cpy" type="button" aria-label="Copier le lien de cette page">🔗 Lien</button>
    </div>
  </div>
</header>
<main class="wrap">
<p class="msg" id="msg" role="status" aria-live="polite"></p>
{body}
<footer><p>Aucun compte, aucune collecte de données : la progression reste sur l'appareil de l'élève. Les données simulées sont signalées dans chaque activité.</p></footer>
</main>
<script>{JS}</script>
</body>
</html>
"""


def card(a, href):
    lang = f' hreflang="{a["lang"]}"' if a.get("lang") else ""
    tl = f' lang="{a["lang"]}"' if a.get("lang") else ""
    return (f'<a class="card" href="{href}"{lang}><span class="tag">{E(a["tag"])}</span>'
            f'<h4{tl}>{E(a["titre"])}</h4><p>{E(a["desc"])}</p><span class="go">Ouvrir →</span></a>')


def chap_count(c):
    return len(c.get("activites", []))


def theme_count(t):
    return len(t.get("activites", [])) + sum(chap_count(c) for c in t["chapitres"])


def level_count(n):
    return len(n.get("transversal", [])) + sum(theme_count(t) for t in n["themes"])


def check(path):
    if not os.path.isfile(os.path.join(ROOT, path)):
        sys.exit(f"Fichier manquant : {path}")


def write(path, content):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)
    return path


def theme_block(n, t, rel_theme, link_theme=True):
    """rel_theme : chemin relatif depuis la page courante vers le dossier du thème ('' si on y est)."""
    out = []
    head_link = f'<a href="{rel_theme}">Page du thème →</a>' if link_theme else ""
    out.append(f'<section class="theme" id="{t["id"]}"><div class="thead"><h2>{E(t["titre"])}</h2>{head_link}</div>')
    if t.get("activites"):
        out.append('<div class="chap"><h3>Pour tout le thème</h3><div class="grid">')
        out += [card(a, f'{rel_theme}{a["fichier"]}') for a in t["activites"]]
        out.append("</div></div>")
    vides = []
    for c in t["chapitres"]:
        if not chap_count(c):
            vides.append(c["titre"]); continue
        rc = f'{rel_theme}{c["id"]}/'
        out.append(f'<div class="chap" id="{c["id"]}"><h3>{E(c["titre"])} <a href="{rc}">Page du chapitre →</a></h3><div class="grid">')
        out += [card(a, f'{rc}{a["fichier"]}') for a in c["activites"]]
        out.append("</div></div>")
    if vides:
        lab = "Chapitres du thème · activités dédiées à venir" if t.get("activites") else "Bientôt dans ce thème"
        out.append(f'<div class="chap"><h3 style="font-size:.9rem;color:var(--muted)">{lab}</h3><ul class="soonlist">'
                   + "".join(f"<li>{E(v)}</li>" for v in vides) + "</ul></div>")
    out.append("</section>")
    return "\n".join(out)


def main():
    written = []
    niveaux = CAT["niveaux"]
    home = "Accueil"

    # ---------- accueil ----------
    prim = [n for n in niveaux if not n.get("secondaire")]
    sec = [n for n in niveaux if n.get("secondaire")]
    cards = []
    for n in prim:
        k = level_count(n)
        cards.append(f'<a class="card lvl c-{n["couleur"]}" href="{n["id"]}/"><span class="big">{E(n.get("court", n["titre"]))}</span>'
                     f'<p>{E(n["sous"])}</p><span class="go">{k} activité{"s" if k > 1 else ""} · Ouvrir →</span></a>')
    body = ['<div class="box info"><span class="ic" aria-hidden="true">ℹ️</span><div><b>Contenu · Ta progression</b>'
            '<p>Elle reste enregistrée sur cet appareil, dans Safari. Rien n\'est envoyé. Pour rendre ton bilan, utilise les boutons '
            '« Télécharger », « Copier » ou « Montrer au professeur » de l\'activité.</p></div></div>',
            f'<div class="grid">{"".join(cards)}</div>']
    if sec:
        body.append('<div class="second"><h2>Autres classes</h2><div class="grid">' + "".join(
            f'<a class="card c-{n["couleur"]}" href="{n["id"]}/"><span class="tag">{E(n.get("court", n["titre"]))}</span>'
            f'<h4>{E(n["titre"])}</h4><p>{E(n["sous"])}</p><span class="go">Ouvrir →</span></a>' for n in sec) + "</div></div>")
    written.append(write("index.html", page("Activités SVT, EIST et ES", "Activités interactives par classe.", 0, "svt", [],
                                            "SVT · EIST · Enseignement scientifique", "Choisis ta classe", "\n".join(body))))

    # ---------- niveaux ----------
    for n in niveaux:
        lid, col = n["id"], n["couleur"]
        for a in n.get("transversal", []):
            check(f'{lid}/{a["fichier"]}')
        for t in n["themes"]:
            for a in t.get("activites", []):
                check(f'{lid}/{t["id"]}/{a["fichier"]}')
            for c in t["chapitres"]:
                for a in c.get("activites", []):
                    check(f'{lid}/{t["id"]}/{c["id"]}/{a["fichier"]}')

        body = []
        if n.get("transversal"):
            body.append('<section class="theme"><div class="thead"><h2>Toute l\'année</h2></div><div class="grid">'
                        + "".join(card(a, a["fichier"]) for a in n["transversal"]) + "</div></section>")
        pleins = [t for t in n["themes"] if theme_count(t)]
        vides = [t for t in n["themes"] if not theme_count(t)]
        body += [theme_block(n, t, f'{t["id"]}/') for t in pleins]
        if vides:
            body.append('<div class="box soon"><span class="ic" aria-hidden="true">🗓️</span><div><b>Bientôt</b><ul class="soonlist">'
                        + "".join(f"<li>{E(t['titre'])}</li>" for t in vides) + "</ul></div></div>")
        if not pleins and not n.get("transversal"):
            body.insert(0, '<div class="box soon"><span class="ic" aria-hidden="true">🗓️</span><div><b>Les activités arrivent bientôt.</b></div></div>')
        written.append(write(f"{lid}/index.html", page(n["titre"], n["sous"], 1, col, [(home, "../")],
                                                        n["sous"], n["titre"], "\n".join(body))))

        # ---------- thèmes et chapitres ----------
        for t in pleins:
            tdir = f'{lid}/{t["id"]}'
            written.append(write(f"{tdir}/index.html", page(f'{t["titre"]} · {n.get("court", n["titre"])}', n["sous"], 2, col,
                                                             [(home, "../../"), (n.get("court", n["titre"]), "../")],
                                                             n["titre"], t["titre"], theme_block(n, t, "", link_theme=False))))
            for c in t["chapitres"]:
                if not chap_count(c):
                    continue
                cdir = f'{tdir}/{c["id"]}'
                body = '<div class="grid">' + "".join(card(a, a["fichier"]) for a in c["activites"]) + "</div>"
                written.append(write(f"{cdir}/index.html", page(f'{c["titre"]} · {n.get("court", n["titre"])}', t["titre"], 3, col,
                                                                 [(home, "../../../"), (n.get("court", n["titre"]), "../../"), (t["titre"], "../")],
                                                                 f'{n.get("court", n["titre"])} · {t["titre"]}', c["titre"], body)))

    # ---------- redirections ----------
    for old, new in CAT.get("redirections", {}).items():
        depth = old.count("/")
        target = "../" * depth + new
        if not new.endswith("/"):
            check(new)
        written.append(write(old, f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cette activité a déménagé</title><meta http-equiv="refresh" content="0; url={target}">
<link rel="canonical" href="{target}"><script>location.replace("{target}"+location.hash);</script></head>
<body style="font:20px system-ui;padding:24px"><p>Cette activité a changé d'adresse : <a href="{target}">ouvrir la nouvelle page</a>.</p></body></html>
"""))

    # ---------- contrôle : fichiers .html non référencés ----------
    known = set(written)
    for n in niveaux:
        lid = n["id"]
        known |= {f'{lid}/{a["fichier"]}' for a in n.get("transversal", [])}
        for t in n["themes"]:
            known |= {f'{lid}/{t["id"]}/{a["fichier"]}' for a in t.get("activites", [])}
            for c in t["chapitres"]:
                known |= {f'{lid}/{t["id"]}/{c["id"]}/{a["fichier"]}' for a in c.get("activites", [])}
    orphans = []
    for d, _, files in os.walk(ROOT):
        if "/.git" in d or d.endswith("/outils"):
            continue
        for f in files:
            if f.endswith(".html"):
                rel = os.path.relpath(os.path.join(d, f), ROOT)
                if rel not in known:
                    orphans.append(rel)
    print(f"{len(written)} pages écrites.")
    if orphans:
        print("Fichiers HTML absents du catalogue :", *orphans, sep="\n  ")


if __name__ == "__main__":
    main()
