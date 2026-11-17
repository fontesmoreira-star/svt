"""Version experte : repérage des éléments attendus sur des réponses types."""
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/5e/mission-5/soleil-terre-lune/phases-de-la-lune.html?version=experte"
CASES={
 ("a1",4):[("MODEL",4),
   ("Non, la Lune ne produit pas de lumière. C'est le Soleil qui l'éclaire et elle renvoie sa lumière vers nos yeux, c'est un objet diffusant.",4),
   ("La Lune n'est pas une source primaire comme il le croit, elle est seulement éclairée par le Soleil.",2),
   ("Il a raison la Lune brille comme le Soleil la nuit car elle est très lumineuse et grosse.",0)],
 ("b2",1):[("MODEL",4),
   ("Le Soleil éclaire toujours la moitié de la Lune. Depuis l'espace on voit toujours la même moitié éclairée. Depuis la Terre on voit une partie plus ou moins grande car la Lune tourne autour de la Terre.",4),
   ("Depuis la Terre la Lune change d'apparence chaque soir parce qu'elle tourne autour de la Terre pendant tout le mois, et cela fait des formes différentes.",1),
   ("C'est à cause de l'ombre de la Terre qui cache la Lune pendant la nuit quand on la regarde.",0)],
 ("c1",0):[("MODEL",5),
   ("La Lune tourne autour de la Terre et le Soleil l'éclaire à moitié, donc on voit une partie plus ou moins grande de sa face éclairée : ce sont les phases.",5),
   ("Parce que la Lune change de forme tous les soirs, elle devient plus petite puis plus grande dans le ciel.",0)],
}
WORDS={("c1",1):[("sombre",True),("noire",True),("elle est pas éclairée",True),("dans l'ombre",True),("éclairée",False),("pleine",False)],
 ("b1",3):[("grandit",True),("elle augmente",True),("diminue",False)],
 ("a1",3):[("notre oeil",True),("nos yeux",True),("l'observateur",True),("la Terre",False)]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(URL); await pg.wait_for_timeout(200); bad=0
        for (iid,k),cs in CASES.items():
            for txt,exp in cs:
                r=await pg.evaluate("([i,k,t])=>{const p=EXPERT[i].parts[k];const v=t==='MODEL'?p.model.replace(/\\u00a0|\\u202f/g,' '):t;const r=checkPart(p,v);return {pts:r.pts,max:p.crit.length,auto:r.auto,msg:r.msg}}",[iid,k,txt])
                flag="" if r["pts"]==exp else "   <<< attendu %d"%exp
                bad+=bool(flag); print(f'{iid}.{k} {r["pts"]}/{r["max"]} {r.get("auto")} {txt[:55]!r}{flag}')
        for (iid,k),cs in WORDS.items():
            for txt,exp in cs:
                r=await pg.evaluate("([i,k,t])=>checkPart(EXPERT[i].parts[k],t)",[iid,k,txt])
                flag="" if r["ok"]==exp else "   <<< attendu %s"%exp
                bad+=bool(flag); print(f'{iid}.{k} ok={r["ok"]} {txt!r} · {r["msg"][:90]}{flag}')
        print("écarts:",bad,"errors:",errs); await b.close()
asyncio.run(main())
