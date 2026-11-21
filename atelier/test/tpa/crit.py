# Réponses types d'élèves : éléments attendus des réponses rédigées (0/1 par élément) et lecture attendue selon les observations du groupe
import asyncio, json
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/metabolisme/tp-amylase-amidon-note.html"
TYP={"t1":[0,0,0,0,0],"t2":[0,1,2,3,4],"g1":0,"g2":2}      # résultat attendu
PART={"t1":[0,0,0,0,0],"t2":[0,0,1,1,2],"g1":0,"g2":1}     # tube 2 pas fini à 12 min
RATE={"t1":[0,0,0,0,0],"t2":[0,0,0,0,0],"g1":0,"g2":0}     # rien ne se passe (amylase inactive)
INV ={"t1":[0,1,2,3,4],"t2":[0,0,0,0,0],"g1":2,"g2":0}     # tubes inversés
CASES=[
 # Partie 1 · tube témoin
 (TYP,"p1","j","Le tube 1 n'a pas d'amylase, il sert à comparer avec le tube 2.",[1]),
 (TYP,"p1","j","C'est le témoin : sans amylase l'amidon ne disparait pas.",[1]),
 (TYP,"p1","j","Il permet de comparer, la seule différence est l'amylase.",[1]),
 (TYP,"p1","j","il sert a montrer que sans amilase rien ne se passe",[1]),
 (TYP,"p1","j","Le tube 1 sert de témoin pour comparer.",[0]),
 (TYP,"p1","j","Il contient plus d'amidon que le tube 2.",[0]),
 # Partie 2 · interprétation, cohérente avec les observations
 (TYP,"p2","j","L'eau iodée est jaune donc il n'y a plus d'amidon dans le tube 2.",[1]),
 (TYP,"p2","j","la couleur jaune montre l'absence d'amidon",[1]),
 (TYP,"p2","j","Il ny a plus d'amidon car l'eau iodé ne devien pas bleu noir",[1]),
 (TYP,"p2","j","L'amidon n'a pas disparu dans le tube 2.",[0]),
 (TYP,"p2","j","L'eau iodée est jaune dans le tube 2.",[0]),
 (PART,"p2","j","La couleur s'éclaircit : il y a moins d'amidon mais il en reste encore un peu.",[1]),
 (PART,"p2","j","L'amidon diminue mais n'a pas totalement disparu.",[1]),
 (PART,"p2","j","L'eau iodée est brune à 12 min.",[0]),
 (RATE,"p2","j","L'eau iodée reste bleu-noir : il y a toujours de l'amidon.",[1]),
 (RATE,"p2","j","L'amidon n'a pas disparu dans le tube 2.",[1]),
 (RATE,"p2","j","Il n'y a plus d'amidon.",[0]),
 # Conclusion · Donc
 (TYP,"c","c4","Donc l'amylase transforme l'amidon en glucose. L'amylase est une enzyme.",[1,1,1]),
 (TYP,"c","c4","Donc l'amylase découpe l'amidon en molécules de glucose.",[1,1,0]),
 (TYP,"c","c4","Donc l'enzyme amylase digère l'amidon.",[1,0,1]),
 (TYP,"c","c4","Donc l'amilase transforme l'amidon en glucoze, c'est une enzime.",[1,1,1]),
 (TYP,"c","c4","Donc l'amylase transforme le glucose en amidon.",[1,0,0]),
 (TYP,"c","c4","Donc l'amidon disparaît à cause de la chaleur.",[0,0,0]),
 # Conclusion · Mais
 (TYP,"c","c5","Mais on ne l'a fait qu'une fois, il faudrait répéter l'expérience.",[1,1]),
 (TYP,"c","c5","Mais c'est dans un tube et pas dans le corps. On pourrait tester avec de l'amylase bouillie.",[1,1]),
 (TYP,"c","c5","Mais l'expérience ne se passe pas dans l'intestin.",[1,0]),
 (TYP,"c","c5","Mais on pourrait essayer à une autre température.",[0,1]),
 (TYP,"c","c5","Mais le Glucotest ne mesure pas la quantité de glucose.",[1,0]),
 (PART,"c","c5","Mais il restait de l'amidon à 12 min, il aurait fallu attendre plus longtemps.",[1,1]),
 (TYP,"c","c5","Mais c'est sûr que l'amylase marche toujours.",[0,0]),
 # Retour sur l'hypothèse
 (TYP,"c","c6","Elle est validée car l'amidon a disparu dans le tube 2 avec l'amylase.",[1]),
 (TYP,"c","c6","Notre hypothèse est invalidée : nous pensions que la chaleur suffisait, or le témoin garde son amidon.",[1]),
 (TYP,"c","c6","Validée, comme les résultats le montrent dans le tube 2.",[1]),
 (TYP,"c","c6","Elle est validée, nous avions raison.",[0]),
]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); await pg.goto(URL)
        bad=0
        for obs,pid,k,txt,exp in CASES:
            r=await pg.evaluate("([o,pid,k,t])=>{S.obs=o;const L=pid==='c'?CONC:PARTS.find(P=>P.id===pid).items;const it=L.find(x=>x.k===k);return critRes(it,t).map(x=>x?1:0)}",[obs,pid,k,txt])
            ok=r==exp; bad+=not ok
            print("OK " if ok else "BAD", pid,k,r,exp,txt[:80])
        # lecture attendue selon les observations : [a (tube 1), b (tube 2), g1, g2, c1 (je vois)]
        for nm,obs,exp in [("typique",TYP,[0,2,1,0,0]),("partiel",PART,[0,1,1,0,0]),("raté",RATE,[0,0,1,1,2]),("inversé",INV,[2,0,0,1,3])]:
            r=await pg.evaluate("o=>{S.obs=o;return [...PARTS[1].items.filter(i=>!isTxt(i)).map(ansOf),ansOf(CONC[0])]}",obs)
            ok=r==exp; bad+=not ok; print("OK " if ok else "BAD","lecture",nm,r,exp)
        m=await pg.evaluate("""()=>{const out=[];for(const o of [%s]){S.obs=o;[...PARTS.flatMap(P=>P.items),...CONC].filter(isTxt).forEach(it=>out.push(it.k+':'+critRes(it,modelOf(it)).every(Boolean)))};return out}"""%",".join(json.dumps(x) for x in [TYP,PART,RATE]))
        print("models:",m); bad+=sum(1 for x in m if x.endswith("false"))
        print("barème:",await pg.evaluate("[PARTS.map(P=>[P.max,P.items.reduce((s,i)=>s+i.p,0)]),CMAX,MAXAPP,MANIP]"))
        await b.close(); print("FAILS",bad)
asyncio.run(main())
