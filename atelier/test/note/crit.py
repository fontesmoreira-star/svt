# Réponses types d'élèves : vérifie le repérage des éléments attendus (attendu = 0/1 par critère) et que chaque réponse modèle les valide tous
import asyncio
from playwright.async_api import async_playwright
BASE="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/"
CASES={
 ("arbre-jean-note.html","j7"):[
  ("Non l'avocat a tort. Jean est O/O car O est récessif. Chaque parent lui a donné un allèle O. Le père est B/O et la mère A/O.",[1,1,1,1]),
  ("L'avocat n'a pas raison : Jean a deux allèles O, il a reçu un O de son père et un O de sa mère, donc ses parents ont un allèle O caché.",[1,1,1,1]),
  ("Il a tort car le père est BO et la mère AO, Jean a hérité du O de chacun de ses parents.",[0,1,1,1]),
  ("C'est possible que Jean soit du groupe O car ses parents portent tous les deux un allèle O qui ne s'exprime pas.",[0,0,1,1]),
  ("L'avocat a raison, un enfant ne peut pas être O si son père est B et sa mère A.",[0,0,0,0]),
  ("L'avocat a raison car les parents ne peuvent pas donner d'allèle O à Jean.",[0,1,0,0]),
  ("Jean est du groupe O donc il a le génotype O/O. Le test ne s'est pas trompé.",[1,0,0,1]),
  ("L'avocat se trompe : Jean peut être du groupe O, chaque parent transmet un de ses deux allèles.",[0,1,0,1]),
 ],
 ("multiplication-cellulaire-note.html","m8"):[
  ("Avant la division chaque chromosome se copie, c'est la duplication, les chromosomes deviennent doubles. Puis les chromatides se séparent et chaque cellule-fille reçoit une chromatide. Les cellules-filles ont les mêmes chromosomes.",[1,1,1]),
  ("La quantité d'ADN double car les chromosomes se dupliquent. Ensuite la cellule se divise en deux cellules qui ont chacune Q. Elles sont identiques.",[1,1,1]),
  ("L'ADN passe de Q à 2Q car il y a réplication. Les chromosomes doubles se séparent en 2 lots. Les cellules-filles ont 46 chromosomes comme la cellule de départ.",[1,1,1]),
  ("La quantité d'ADN augmente puis elle diminue car la cellule se coupe en deux.",[0,0,0]),
  ("Les chromosomes simples deviennent doubles. Les cellules-filles sont pareilles que la cellule mère.",[1,0,1]),
  ("La moitié de l'ADN est détruite, donc chaque cellule a Q.",[0,0,0]),
 ]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); bad=0
        for (f,qid),cases in CASES.items():
            await pg.goto(BASE+f)
            for txt,exp in cases:
                r=await pg.evaluate("([id,t])=>QB.txt.res(QS.find(q=>q.id===id),t).map(x=>x?1:0)",[qid,txt])
                ok=r==exp; bad+=not ok; print("OK " if ok else "BAD", qid, r, exp, txt[:80])
            m=await pg.evaluate("QS.filter(q=>q.t==='txt').map(q=>[q.id,QB.txt.res(q,q.model).every(Boolean)])"); print("modèles :",m)
        await b.close(); print("ÉCHECS",bad)
asyncio.run(main())
