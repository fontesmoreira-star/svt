import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/metabolisme/fiche-animee-metabolisme.html"
D="test/metab/"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True),"land":(1180,820,False)}.items():
            ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",device_scale_factor=1)
            pg=await ctx.new_page(); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
            await pg.goto(URL+"#p1"); await pg.wait_for_timeout(300)
            # quelques simulations pour remplir les graphiques
            for v in ["accueil","p1","p2","p3","p4","p5","p6","bilan"]:
                await pg.goto(URL+"#"+v); await pg.reload(); await pg.wait_for_timeout(300)
                n=await pg.locator(".stepper button").count()
                for i in range(max(n,1)):
                    if n: await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(250)
                    ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
                    if ov>1: print(name,v,i,"OVERFLOW",ov)
                    if name!="land" or i==0: await pg.screenshot(path=f"{D}s-{name}-{v}-{i}.png",full_page=True)
            print(name,"errors:",errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
