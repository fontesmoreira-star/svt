# Chargement des deux activités notées : erreurs, débordements, captures de chaque partie (iPad portrait, iPad paysage, téléphone sombre)
import asyncio, sys
from playwright.async_api import async_playwright
BASE="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/"
APPS={"jean":"arbre-jean-note.html","mito":"multiplication-cellulaire-note.html"}
SIZES={"ipad":(820,1180,False),"land":(1180,820,False),"phone":(390,844,True)}
async def main():
    only=sys.argv[1:]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for app,f in APPS.items():
            if only and app not in only: continue
            for name,(w,h,dark) in SIZES.items():
                ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light")
                pg=await ctx.new_page(); errs=[]
                pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
                await pg.goto(BASE+f+"#consignes"); await pg.wait_for_timeout(300)
                await pg.screenshot(path=f"test/note/{app}-{name}-consignes.png",full_page=True)
                ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
                print(app,name,"consignes overflow",ov)
                # force all parts open to look at them (state injected)
                await pg.evaluate("PARTS.forEach((P,i)=>{ if(i>0) S.val[PARTS[i-1].id]=Date.now() }); save()")
                for P in await pg.evaluate("PARTS.map(P=>P.id)"):
                    await pg.evaluate(f"delete S.val['{P}']; save()")
                    await pg.evaluate(f"go('{P}')"); await pg.wait_for_timeout(400)
                    ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
                    wide=await pg.evaluate("[...document.querySelectorAll('#main *')].filter(e=>e.getBoundingClientRect().right>window.innerWidth+1).slice(0,5).map(e=>e.tagName+'.'+e.className)")
                    print(app,name,P,"overflow",ov,wide)
                    await pg.screenshot(path=f"test/note/{app}-{name}-{P}.png",full_page=True)
                    await pg.evaluate(f"S.val['{P}']=Date.now(); save()")
                print(app,name,"errors:",errs); await ctx.close()
        await b.close()
asyncio.run(main())
