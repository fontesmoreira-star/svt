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
Une activité peut aussi pointer vers une app rangée ailleurs sur le site, sans la copier :
clé « chemin » (chemin depuis la racine du site, par exemple « 2nde/theme-1/metabolisme/tp-elodee.html »).
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
  --pc:#1d4f9c; --pc-soft:#e1eafa; --pc-band:#0f2a5c;
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
  --pc:#8ab4f5; --pc-soft:#14284a; --pc-band:#0a1b3a;
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
.c-pc{--c:var(--pc);--cs:var(--pc-soft);--band:var(--pc-band)}
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

/* ---- plan Thème / Chapitre ---- */
.lbl{font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.toc{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr));gap:12px;margin:14px 0 6px}
a.tile{display:flex;flex-direction:column;gap:8px;text-decoration:none;background:var(--surface);border:2px solid var(--line);border-top:8px solid var(--c);border-radius:14px;padding:12px 14px;min-height:120px}
a.tile .lbl{color:var(--c)}
a.tile b{font-family:var(--f-display);font-size:1rem;line-height:1.2;flex:1}
a.tile.empty{border-top-color:var(--line);background:transparent}
a.tile.empty .lbl,a.tile.empty b{color:var(--muted)}
.dots{display:flex;flex-wrap:wrap;gap:5px;margin:0;padding:0;list-style:none}
.dots li{min-width:26px;height:26px;padding:0 4px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:800;border:2px dashed var(--line);color:var(--muted)}
.dots li.on{background:var(--c);border:2px solid var(--c);color:var(--surface)}
.cnt{font-size:.78rem;font-weight:700;color:var(--muted)}
details.th{margin:22px 0 0;background:var(--surface);border:2px solid var(--line);border-radius:18px;overflow:hidden}
details.th>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:14px;padding:14px 16px;min-height:64px;background:var(--cs);border-bottom:2px solid transparent}
details.th[open]>summary{border-bottom-color:var(--line)}
details.th>summary::-webkit-details-marker{display:none}
details.th.empty>summary{background:transparent}
.num{flex:0 0 auto;width:54px;height:54px;border-radius:14px;background:var(--c);color:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
.num small{font-size:.5rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.num span{font-family:var(--f-display);font-size:1.45rem;font-weight:800}
details.th.empty .num{background:transparent;border:2px dashed var(--line);color:var(--muted)}
.sumtxt{flex:1;min-width:0}
.sumtxt h2{font-size:1.2rem;color:var(--ink)}
.sumtxt .cnt{display:block;margin-top:3px}
.chev{flex:0 0 auto;font-size:1.3rem;color:var(--c);transition:transform .2s}
details.th[open] .chev{transform:rotate(180deg)}
details.th.empty .chev{color:var(--muted)}
.thbody{padding:6px 16px 18px}
.thlink{display:inline-block;font-size:.85rem;font-weight:700;color:var(--c);padding:12px 0 4px}
ol.chaps{list-style:none;margin:8px 0 0;padding:0;position:relative}
ol.chaps>li{position:relative;padding:0 0 18px 58px}
ol.chaps>li::before{content:"";position:absolute;left:21px;top:44px;bottom:0;width:3px;background:var(--line);border-radius:2px}
ol.chaps>li:last-child::before{display:none}
.cnum{position:absolute;left:0;top:2px;width:45px;height:45px;border-radius:50%;background:var(--c);color:var(--surface);display:flex;align-items:center;justify-content:center;font-family:var(--f-display);font-weight:800;font-size:1rem}
li.vide .cnum{background:var(--surface);border:3px dashed var(--line);color:var(--muted)}
.chead{min-height:48px;display:flex;flex-direction:column;justify-content:center}
.chead .lbl{color:var(--c)}
li.vide .chead .lbl{color:var(--muted)}
.chead h3{font-size:1.06rem;margin-top:2px;display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px}
li.vide .chead h3{color:var(--muted);font-weight:600}
.disc{font-family:var(--f-body);font-size:.68rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;border-radius:6px;padding:2px 7px;color:#fff;background:var(--pc)}
.disc.techno{background:#8a4b0f}
.disc.svt{background:var(--svt)}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .disc{color:#0b171b}:root:not([data-theme="light"]) .disc.techno{background:#f0a35c}}
.later{font-size:.82rem;color:var(--muted);margin:2px 0 0}
.clink{display:inline-block;font-size:.82rem;font-weight:700;color:var(--c);padding:10px 0 0}
.year{background:var(--surface);border:2px solid var(--line);border-left:8px solid var(--c);border-radius:14px;padding:12px 16px;margin-top:18px}
.year h2{font-size:1.05rem;margin-bottom:4px}
.pager{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;margin-top:26px}
.pager a{flex:1 1 240px;text-decoration:none;background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:12px 16px;min-height:56px}
.pager a .lbl{display:block;color:var(--c)}
.pager a.next{text-align:right}
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
  function openHash(){try{var id=decodeURIComponent(location.hash.slice(1));if(!id)return;var el=document.getElementById(id);if(!el)return;
    var d=el.tagName==="DETAILS"?el:el.closest("details");if(d&&!d.open)d.open=true;}catch(e){}}
  window.addEventListener("hashchange",openHash);openHash();
  applyFs();
})();
"""


def page(title, desc, depth, couleur, crumbs, kick, h1, body, cache=False):
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
<meta name="description" content="{E(desc)}">{ROBOTS if cache else ""}
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
<footer><p>Aucun compte, aucune collecte de données : la progression reste sur l'appareil de l'élève. Les données simulées sont signalées dans chaque activité.</p><p data-signature><b>Mr Moreira · Vauban Luxembourg</b></p></footer>
</main>
<script>{JS}</script>
</body>
</html>
"""


ROBOTS = '\n<meta name="robots" content="noindex, nofollow">'


def card(a, href):
    lang = f' hreflang="{a["lang"]}"' if a.get("lang") else ""
    tl = f' lang="{a["lang"]}"' if a.get("lang") else ""
    return (f'<a class="card" href="{href}"{lang}><span class="tag">{E(a["tag"])}</span>'
            f'<h4{tl}>{E(a["titre"])}</h4><p>{E(a["desc"])}</p><span class="go">Ouvrir →</span></a>')


def href(a, local, depth):
    """local : lien relatif habituel ; depth : profondeur de la page courante depuis la racine du site."""
    return "../" * depth + a["chemin"] if a.get("chemin") else local


def where(a, folder):
    return a["chemin"] if a.get("chemin") else f'{folder}/{a["fichier"]}'


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


import re

DISC = [("Physique-chimie", "PC", ""), ("Technologie", "Techno", "techno"), ("SVT", "SVT", "svt")]


def theme_label(n, t):
    """(mot, numéro, nom) : « Thème 1 · La Terre… » → ("Thème", "1", "La Terre…")."""
    m = re.match(r"^(Thème|Mission)\s+(\d+)\s*(?:·\s*)?(.*)$", t["titre"])
    if m:
        nom = m.group(3).strip()
        if not nom and t["chapitres"]:
            noms = [re.sub(r"^(Physique-chimie|Technologie|SVT) · ", "", c["titre"]) for c in t["chapitres"][:2]]
            nom = " · ".join(noms) + (" …" if len(t["chapitres"]) > 2 else "")
        return m.group(1), t.get("num", m.group(2)), nom
    return n.get("mot_theme", "Thème"), str(t.get("num", n["themes"].index(t) + 1)), t["titre"]


def chap_label(n, t, c):
    """(numéro, nom, discipline) : « Chapitre 2 · … », « 1.2 … », sinon numéro dans le thème."""
    titre = c["titre"]
    m = re.match(r"^Chapitre\s+(\d+)\s*·\s*(.*)$", titre) or re.match(r"^(\d+\.\d+)\s+(.*)$", titre)
    if m:
        num, nom = m.group(1), m.group(2)
    else:
        num, nom = str(t["chapitres"].index(c) + 1), titre
    disc = None
    for full, short, cls in DISC:
        if nom.startswith(full + " · "):
            disc, nom = (short, cls), nom[len(full) + 3:]
    return str(c.get("num", num)), nom, disc


def plural(k, mot):
    return f'{k} {mot}{"s" if k > 1 else ""}'


def theme_title(n, t):
    mot, num, nom = theme_label(n, t)
    return f"{mot} {num}" + (f" · {nom}" if nom else "")


def chap_title(n, t, c):
    num, nom, _ = chap_label(n, t, c)
    mot = n.get("mot_chapitre", "Chapitre")
    return (f"{num} · {nom}" if "." in num else f"{mot} {num} · {nom}")


def disc_html(disc):
    return f'<span class="disc {disc[1]}">{E(disc[0])}</span>' if disc else ""


def theme_tile(n, t):
    mot, num, nom = theme_label(n, t)
    k = theme_count(t)
    dots = "".join(f'<li class="{"on" if chap_count(c) else ""}" title="{E(chap_title(n, t, c))}">{E(chap_label(n, t, c)[0])}</li>'
                   for c in t["chapitres"])
    tc = f' c-{t["couleur"]}' if t.get("couleur") else ""
    cnt = plural(k, "activité") if k else "À venir"
    return (f'<a class="tile{tc}{"" if k else " empty"}" href="#{t["id"]}"><span class="lbl">{E(mot)} {E(num)}</span>'
            f'<b>{E(nom or mot + " " + num)}</b>' + (f'<ul class="dots" aria-hidden="true">{dots}</ul>' if dots else "")
            + f'<span class="cnt">{cnt}</span></a>')


def chapters_list(n, t, rel_theme, depth):
    mot = n.get("mot_chapitre", "Chapitre")
    out = ['<ol class="chaps">']
    for c in t["chapitres"]:
        num, nom, disc = chap_label(n, t, c)
        k = chap_count(c)
        lab = f"{num}" if "." in num else f"{mot} {num}"
        rc = f'{rel_theme}{c["id"]}/'
        out.append(f'<li id="{c["id"]}" class="{"" if k else "vide"}"><span class="cnum" aria-hidden="true">{E(num)}</span>'
                   f'<div class="chead"><span class="lbl">{E(lab)}{" · " + plural(k, "activité") if k else ""}</span>'
                   f'<h3>{disc_html(disc)}{E(nom)}</h3></div>')
        if k:
            out.append('<div class="grid">' + "".join(card(a, href(a, f'{rc}{a.get("fichier", "")}', depth)) for a in c["activites"]) + "</div>")
            out.append(f'<a class="clink" href="{rc}">Page du chapitre →</a>')
        else:
            out.append('<p class="later">Activités à venir</p>')
        out.append("</li>")
    out.append("</ol>")
    return "\n".join(out)


def theme_inner(n, t, rel_theme, depth):
    out = []
    if t.get("activites"):
        mot = theme_label(n, t)[0]
        out.append(f'<div class="chap"><h3>Pour {"toute la" if mot == "Mission" else "tout le"} {E(mot.lower())}</h3><div class="grid">')
        out += [card(a, href(a, f'{rel_theme}{a.get("fichier", "")}', depth)) for a in t["activites"]]
        out.append("</div></div>")
    if t["chapitres"]:
        out.append(chapters_list(n, t, rel_theme, depth))
    return "\n".join(out)


def theme_block(n, t, rel_theme, depth=1):
    """Section repliable d'un thème sur la page du niveau."""
    mot, num, nom = theme_label(n, t)
    k = theme_count(t)
    pleins = sum(1 for c in t["chapitres"] if chap_count(c))
    tc = f' c-{t["couleur"]}' if t.get("couleur") else ""
    if k:
        cnt = plural(k, "activité") + (f" · {pleins} chapitre{'s' if pleins > 1 else ''} sur {len(t['chapitres'])}" if t["chapitres"] else "")
    else:
        cnt = "Activités à venir" + (f" · {plural(len(t['chapitres']), 'chapitre')}" if t["chapitres"] else "")
    out = [f'<details class="th{tc}{"" if k else " empty"}" id="{t["id"]}"{" open" if k else ""}>'
           f'<summary><span class="num" aria-hidden="true"><small>{E(mot)}</small><span>{E(num)}</span></span>'
           f'<span class="sumtxt"><h2>{E(nom or mot + " " + num)}</h2><span class="cnt">{cnt}</span></span>'
           f'<span class="chev" aria-hidden="true">▾</span></summary><div class="thbody">']
    if k:
        out.append(f'<a class="thlink" href="{rel_theme}">Page du {E(mot.lower())} →</a>')
    out.append(theme_inner(n, t, rel_theme, depth))
    out.append("</div></details>")
    return "\n".join(out)


SITE = "https://fontesmoreira-star.github.io/svt/"


def readme_plan():
    """Plan Thème / Chapitre de chaque niveau, réécrit dans README.md entre deux balises."""
    L = ["<!-- plan:debut (généré par outils/generer_pages.py, ne pas modifier à la main) -->", "## Plan du site", ""]
    for n in CAT["niveaux"]:
        if n.get("cache"):
            continue
        lid = n["id"]
        L += [f'### [{n["titre"]}]({SITE}{lid}/) · {plural(level_count(n), "activité")}', ""]
        for a in n.get("transversal", []):
            L.append(f'- 📌 **Toute l\'année** · [{a["titre"]}]({SITE}{where(a, lid)})')
        for t in n["themes"]:
            k = theme_count(t)
            tt = theme_title(n, t)
            L.append(f'- {"📂" if k else "▫️"} **{tt}**' + (f' · [page]({SITE}{lid}/{t["id"]}/)' if k else " · à venir"))
            for a in t.get("activites", []):
                L.append(f'  - 📌 [{a["titre"]}]({SITE}{where(a, lid + "/" + t["id"])})')
            for c in t["chapitres"]:
                ct = chap_title(n, t, c)
                if not chap_count(c):
                    L.append(f'  - ▫️ {ct} · à venir')
                    continue
                L.append(f'  - 📁 **{ct}**')
                for a in c["activites"]:
                    L.append(f'    - [{a["titre"]}]({SITE}{where(a, lid + "/" + t["id"] + "/" + c["id"])})' + (f' · {a["tag"]}' if a.get("tag") else ""))
        L.append("")
    L.append("<!-- plan:fin -->")
    plan = "\n".join(L)
    path = os.path.join(ROOT, "README.md")
    txt = open(path, encoding="utf-8").read()
    if "<!-- plan:debut" in txt:
        txt = re.sub(r"<!-- plan:debut.*?<!-- plan:fin -->", lambda m: plan, txt, flags=re.S)
    else:
        txt = txt.rstrip() + "\n\n" + plan + "\n"
    open(path, "w", encoding="utf-8").write(txt)


def main():
    written = []
    niveaux = CAT["niveaux"]
    home = "Accueil"

    # ---------- accueil ----------
    visibles = [n for n in niveaux if not n.get("cache")]
    prim = [n for n in visibles if not n.get("secondaire")]
    sec = [n for n in visibles if n.get("secondaire")]
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
            check(where(a, lid))
        for t in n["themes"]:
            for a in t.get("activites", []):
                check(where(a, f'{lid}/{t["id"]}'))
            for c in t["chapitres"]:
                for a in c.get("activites", []):
                    check(where(a, f'{lid}/{t["id"]}/{c["id"]}'))

        body = []
        if n.get("transversal"):
            body.append('<section class="year"><h2>Toute l\'année</h2><div class="grid">'
                        + "".join(card(a, href(a, a.get("fichier", ""), 1)) for a in n["transversal"]) + "</div></section>")
        pleins = [t for t in n["themes"] if theme_count(t)]
        if n["themes"]:
            mots = sorted({theme_label(n, t)[0] for t in n["themes"]})
            body.append(f'<section class="theme"><div class="thead"><h2>Sommaire · {E(" / ".join(m + "s" for m in mots))} et chapitres</h2></div>'
                        f'<div class="toc">{"".join(theme_tile(n, t) for t in n["themes"])}</div>'
                        '<p class="cnt">Pastille pleine : chapitre avec des activités · pointillés : à venir.</p></section>')
            body += [theme_block(n, t, f'{t["id"]}/') for t in n["themes"]]
        if not pleins and not n.get("transversal"):
            body.insert(0, '<div class="box soon"><span class="ic" aria-hidden="true">🗓️</span><div><b>Les activités arrivent bientôt.</b></div></div>')
        cache = bool(n.get("cache"))
        written.append(write(f"{lid}/index.html", page(n["titre"], n["sous"], 1, col, [(home, "../")],
                                                        n["sous"], n["titre"], "\n".join(body), cache)))

        # ---------- thèmes et chapitres ----------
        court = n.get("court", n["titre"])
        for t in pleins:
            tdir = f'{lid}/{t["id"]}'
            mot, num, nom = theme_label(n, t)
            tcol = t.get("couleur", col)
            written.append(write(f"{tdir}/index.html", page(f'{theme_title(n, t)} · {court}', n["sous"], 2, tcol,
                                                             [(home, "../../"), (court, "../")],
                                                             f'{court} · {mot} {num}', nom or f"{mot} {num}",
                                                             theme_inner(n, t, "", 2), cache)))
            ouverts = [c for c in t["chapitres"] if chap_count(c)]
            for i, c in enumerate(ouverts):
                cdir = f'{tdir}/{c["id"]}'
                cnum, cnom, disc = chap_label(n, t, c)
                clab = cnum if "." in cnum else f'{n.get("mot_chapitre", "Chapitre")} {cnum}'
                body = '<div class="grid">' + "".join(card(a, href(a, a.get("fichier", ""), 3)) for a in c["activites"]) + "</div>"
                nav = []
                if i > 0:
                    p_ = ouverts[i - 1]
                    nav.append(f'<a class="prev" href="../{p_["id"]}/"><span class="lbl">← Chapitre précédent</span>{E(chap_title(n, t, p_))}</a>')
                if i < len(ouverts) - 1:
                    q_ = ouverts[i + 1]
                    nav.append(f'<a class="next" href="../{q_["id"]}/"><span class="lbl">Chapitre suivant →</span>{E(chap_title(n, t, q_))}</a>')
                if nav:
                    body += '<nav class="pager" aria-label="Autres chapitres du thème">' + "".join(nav) + "</nav>"
                written.append(write(f"{cdir}/index.html", page(f'{cnom} · {court}', theme_title(n, t), 3, tcol,
                                                                 [(home, "../../../"), (court, "../../"), (f"{mot} {num}", "../")],
                                                                 f'{court} · {mot} {num} · {clab}' + (f" · {disc[0]}" if disc else ""),
                                                                 cnom, body, cache)))

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
        known |= {where(a, lid) for a in n.get("transversal", [])}
        for t in n["themes"]:
            known |= {where(a, f'{lid}/{t["id"]}') for a in t.get("activites", [])}
            for c in t["chapitres"]:
                known |= {where(a, f'{lid}/{t["id"]}/{c["id"]}') for a in c.get("activites", [])}
    orphans = []
    for d, _, files in os.walk(ROOT):
        if "/.git" in d or d.endswith("/outils") or os.path.relpath(d, ROOT).split(os.sep)[0] == "atelier":
            continue
        for f in files:
            if f.endswith(".html"):
                rel = os.path.relpath(os.path.join(d, f), ROOT)
                if rel not in known:
                    orphans.append(rel)
    readme_plan()
    print(f"{len(written)} pages écrites (+ plan dans README.md).")
    if orphans:
        print("Fichiers HTML absents du catalogue :", *orphans, sep="\n  ")


if __name__ == "__main__":
    main()
