# Réponses types d'élèves : vérifie les éléments attendus des réponses rédigées (attendu = 0/1 par élément)
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/metabolisme/tp-amylase-amidon-note.html"
CASES=[
 # Partie 1 · eau iodée
 ("p1","j","L'eau iodée est jaune donc il n'y a plus d'amidon dans le tube 2.",[1]),
 ("p1","j","Elle reste jaune : l'amidon a disparu.",[1]),
 ("p1","j","la couleur jaune montre l'absence d'amidon",[1]),
 ("p1","j","Il ny a plus d'amidon car l'eau iodé ne devien pas bleu noir",[1]),
 ("p1","j","L'eau iodée est jaune dans le tube 2.",[0]),
 ("p1","j","Il y a encore de l'amidon dans le tube 2.",[0]),
 # Partie 2 · tube témoin
 ("p2","j","Le tube 1 n'a pas d'amylase, il sert à comparer avec le tube 2.",[1]),
 ("p2","j","C'est le témoin : sans amylase l'amidon ne disparait pas.",[1]),
 ("p2","j","Il permet de comparer, la seule différence est l'amylase.",[1]),
 ("p2","j","il sert a montrer que sans amilase rien ne se passe",[1]),
 ("p2","j","Le tube 1 sert de témoin pour comparer.",[0]),
 ("p2","j","Il contient plus d'amidon que le tube 2.",[0]),
 # Conclusion · Donc
 ("c","c4","Donc l'amylase transforme l'amidon en glucose. L'amylase est une enzyme.",[1,1,1]),
 ("c","c4","Donc l'amylase découpe l'amidon en molécules de glucose.",[1,1,0]),
 ("c","c4","Donc l'enzyme amylase digère l'amidon.",[1,0,1]),
 ("c","c4","Donc l'amilase transforme l'amidon en glucoze, c'est une enzime.",[1,1,1]),
 ("c","c4","Donc l'amylase transforme le glucose en amidon.",[1,0,0]),
 ("c","c4","Donc l'amidon disparaît à cause de la chaleur.",[0,0,0]),
 ("c","c4","Donc il y a du glucose dans le tube 2.",[0,0,0]),
 # Conclusion · Mais
 ("c","c5","Mais on ne l'a fait qu'une fois, il faudrait répéter l'expérience.",[1,1]),
 ("c","c5","Mais c'est dans un tube et pas dans le corps. On pourrait tester avec de l'amylase bouillie.",[1,1]),
 ("c","c5","Mais l'expérience ne se passe pas dans l'intestin.",[1,0]),
 ("c","c5","Mais on pourrait essayer à une autre température.",[0,1]),
 ("c","c5","Mais le Glucotest ne mesure pas la quantité de glucose.",[1,0]),
 ("c","c5","Mais c'est sûr que l'amylase marche toujours.",[0,0]),
]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); await pg.goto(URL)
        bad=0
        for pid,k,txt,exp in CASES:
            r=await pg.evaluate("([pid,k,t])=>{const L=pid==='c'?CONC:PARTS.find(P=>P.id===pid).items;const it=L.find(x=>x.k===k);return critRes(it,t).map(x=>x?1:0)}",[pid,k,txt])
            ok=r==exp; bad+=not ok
            print("OK " if ok else "BAD", pid,k,r,exp,txt[:75])
        m=await pg.evaluate("[...PARTS.flatMap(P=>P.items),...CONC].filter(isTxt).map(it=>it.k+':'+critRes(it,it.model).every(Boolean))")
        print("models:",m); bad+=sum(1 for x in m if x.endswith("false"))
        print("barème:",await pg.evaluate("[PARTS.map(P=>[P.max,P.items.reduce((s,i)=>s+i.p,0)]),CMAX,MAXAPP,MANIP]"))
        await b.close(); print("FAILS",bad)
asyncio.run(main())
