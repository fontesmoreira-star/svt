# Réponses types d'élèves : vérifie les critères des réponses rédigées (attendu = liste de 0/1 par critère)
import asyncio, json
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/labo-agglutination-tp-note.html"
CASES=[
 ("p1","j","Lucie est du groupe A car son sang agglutine avec l'anti-A.",[1]),
 ("p1","j","Ses globules rouges ont le marqueur A.",[1]),
 ("p1","j","Il y a eu une agglutination dans le puits anti-A et pas dans l'anti-B",[1]),
 ("p1","j","Elle est du groupe A parce que c'est écrit.",[0]),
 ("p2","j","Le sang du coupable n'agglutine ni avec anti-A ni avec anti-B donc il est O.",[1]),
 ("p2","j","Ses globules rouges n'ont aucun antigène.",[1]),
 ("p2","j","Il n'y a pas d'agglutination dans les deux puits.",[1]),
 ("p2","j","Ses globules rouges ne portent ni A ni B",[1]),
 ("p2","j","Le coupable est du groupe O.",[0]),
 ("c","c4","Donc Jean NEYMAR peut être le coupable car il est du groupe O comme le sang retrouvé. Djamal et Max ne peuvent pas être coupables car ils sont A et AB.",[1,1,1]),
 ("c","c4","Donc c'est Neymar le coupable, il a le même groupe. Les autres suspects sont innocents.",[1,1,1]),
 ("c","c4","Donc le coupable est Jean Neymar.",[1,0,0]),
 ("c","c4","Donc Max HYMOME est coupable car AB a tous les antigènes",[0,0,0]),
 ("c","c5","Mais beaucoup de personnes sont du groupe O, il faudrait faire un test ADN.",[1,1]),
 ("c","c5","Mais ce n'est pas une preuve, on pourrait comparer les empreintes digitales.",[1,1]),
 ("c","c5","Mais il n'est peut-être pas coupable, il faut d'autres analyses",[0,1]),
 ("c","c5","Mais c'est sûr que c'est lui.",[0,0]),
]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); await pg.goto(URL)
        bad=0
        for pid,k,txt,exp in CASES:
            r=await pg.evaluate("([pid,k,t])=>{const L=pid==='c'?CONC:PARTS.find(P=>P.id===pid).items;const it=L.find(x=>x.k===k);return critRes(it,t).map(x=>x?1:0)}",[pid,k,txt])
            ok=r==exp; bad+=not ok
            print("OK " if ok else "BAD", pid,k,r,exp,txt[:70])
        # chaque réponse modèle valide tous ses critères
        m=await pg.evaluate("[...PARTS.flatMap(P=>P.items),...CONC].filter(isTxt).map(it=>critRes(it,it.model).every(Boolean))")
        print("models all ok:",m); await b.close(); print("FAILS",bad)
asyncio.run(main())
