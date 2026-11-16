"""Version lycée : débordements et erreurs sur iPad, téléphone (sombre) et paysage, avec une réponse vérifiée (grille visible)."""
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/echelles-biodiversite/trois-echelles-biodiversite.html?version=lycee"
T="Je vois que A x B donne des petits fertiles. Il y a deux espèces parmi ces canards et je pense que cela se voit bien dans le tableau de mes croisements réalisés dans la volière."
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True),"land":(1180,820,False)}.items():
            ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",device_scale_factor=1)
            pg=await ctx.new_page(); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
            await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(200)
            await pg.evaluate("()=>{S.cross.can={AB:'fert',AD:'fert',AE:'none',CB:'none',CD:'none',CE:'fert'};S.itL.a1={v:{},hints:0,crit:{},pre:3};save()}")
            for v in ["accueil","p1","p2","p3","bilan"]:
                await pg.goto(URL+"#"+v); await pg.reload(); await pg.wait_for_timeout(250)
                n=await pg.locator(".stepper button").count()
                for i in range(max(n,1)):
                    if n: await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(200)
                    if v=="p1" and i==0:
                        await pg.locator('.part[data-k="1"] input').fill("2"); await pg.locator('.part[data-k="2"] textarea').fill(T)
                        await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(150)
                    ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
                    if ov>1: print(name,v,i,"OVERFLOW",ov)
                    small=await pg.evaluate("()=>[...document.querySelectorAll('#main button, #tabx button')].filter(b=>b.offsetParent&&b.getBoundingClientRect().height<47.5).map(b=>b.className+':'+b.textContent.trim().slice(0,20))")
                    if small: print(name,v,i,"cibles < 48 px :",small[:4])
                    if name!="land" or i==0: await pg.screenshot(path=f"test/b/L{name}-{v}-{i}.png",full_page=True)
            print(name,"errors:",errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
