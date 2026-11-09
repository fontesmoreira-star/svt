#!/usr/bin/env python3
"""Adapte une app écrite pour claude.ai en page autonome pour GitHub Pages.

Usage :
    python3 outils/adapter.py SOURCE.html DESTINATION.html [--lang fr|en] [--cle ancienne=nouvelle ...]

Ce que fait le script :
- accepte la source « nue » (qui commence par <title>) ou la page publiée telle que
  claude.ai la sert (squelette <!doctype html>…<body> autour) ;
- reconstruit un vrai document HTML (doctype, lang, charset, viewport, styles de base) ;
- ajoute un petit module qui remplace la capacité « downloads » de claude.ai par un
  téléchargement de fichier .txt classique (blob) : le code de l'app n'est pas modifié ;
- --cle remplace une clé de stockage (localStorage) pour éviter que deux apps du site
  partagent la même progression (toutes les pages du site ont la même origine).
"""
import argparse, os, re, sys

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='14' fill='%23123d2a'/%3E"
           "%3Cpath d='M20 12c0 14 24 26 24 40M44 12c0 14-24 26-24 40' stroke='%236fcf97' stroke-width='5' fill='none' stroke-linecap='round'/%3E"
           "%3Cpath d='M23 22h18M23 42h18M27 32h10' stroke='%23eaf5ee' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E")

# Mêmes styles de base que le squelette de claude.ai : l'app s'affiche à l'identique.
BASE_CSS = ("<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);"
            "padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}"
            "body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}"
            "img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style>")

SHIM = """<script>
/* Hébergement classique (GitHub Pages) : le bilan se télécharge comme un fichier .txt */
(function(){
  if(window.claude) return;
  function save(o){
    return new Promise(function(res,rej){
      try{
        var txt=(o&&o.data!=null)?String(o.data):"";
        var blob=new Blob(["\\ufeff"+txt],{type:"text/plain;charset=utf-8"});
        var url=URL.createObjectURL(blob);
        var a=document.createElement("a");
        a.href=url; a.download=(o&&o.filename)||"bilan.txt"; a.style.display="none";
        document.body.appendChild(a); a.click();
        setTimeout(function(){URL.revokeObjectURL(url); a.remove();},15000);
        res();
      }catch(e){ rej({code:"failed"}); }
    });
  }
  window.claude={use:function(name){
    return name==="downloads" ? Promise.resolve({save:save}) : Promise.reject(new Error("indisponible"));
  }};
})();
</script>"""


def adapt(src, lang="fr", cles=()):
    s = src.lstrip("\ufeff")
    # page publiée : on retire le squelette ajouté par claude.ai
    if s.lstrip().lower().startswith("<!doctype"):
        i = s.find("<body>")
        if i < 0:
            sys.exit("squelette inattendu (pas de <body>)")
        s = s[i + len("<body>"):]
        s = re.sub(r"</body>\s*</html>\s*$", "", s.rstrip())
    m = re.match(r"\s*<title>(.*?)</title>\s*", s, re.S)
    if not m:
        sys.exit("titre introuvable en tête de fichier")
    title = m.group(1).strip()
    rest = s[m.end():]
    rest = re.sub(r'^\s*<meta name="claude:viewport-fit-sides"[^>]*>\s*', "", rest)
    for old, new in cles:
        n = rest.count(f'"{old}"')
        if n == 0:
            sys.exit(f'clé "{old}" introuvable')
        rest = rest.replace(f'"{old}"', f'"{new}"')
    head_css = ""
    if rest.lstrip().startswith("<style"):
        end = rest.index("</style>") + len("</style>")
        head_css, rest = rest[:end].strip(), rest[end:]
    head = "\n".join([
        "<!doctype html>", f'<html lang="{lang}">', "<head>", '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
        f"<title>{title}</title>", f'<link rel="icon" href="{FAVICON}">',
        BASE_CSS, head_css, SHIM, "</head>", "<body>",
    ])
    return head + "\n" + rest.strip() + "\n</body>\n</html>\n", title


def main():
    p = argparse.ArgumentParser()
    p.add_argument("source"); p.add_argument("destination")
    p.add_argument("--lang", default="fr")
    p.add_argument("--cle", action="append", default=[], help="ancienne=nouvelle")
    a = p.parse_args()
    cles = [c.split("=", 1) for c in a.cle]
    with open(a.source, encoding="utf-8") as f:
        html, title = adapt(f.read(), a.lang, cles)
    os.makedirs(os.path.dirname(os.path.abspath(a.destination)), exist_ok=True)
    with open(a.destination, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"{a.destination}  ({len(html)//1024} Ko)  {title}")


if __name__ == "__main__":
    main()
