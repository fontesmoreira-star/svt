# Chaque vue et chaque étape, en iPad portrait, téléphone sombre et iPad paysage : erreurs, débordements, captures
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch3-diversite-evolution/place-de-l-homme.html"
D="test/place3/"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True),"land":(1180,820,False)}.items():
            for ver in ["guidee","exigeante"]:
                ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",device_scale_factor=1)
                pg=await ctx.new_page(); errs=[]
                pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
                await pg.goto(URL+"?version="+ver+"#accueil"); await pg.wait_for_timeout(300)
                for v in ["accueil","p1","p2","p3","p4","bilan"]:
                    await pg.goto(URL+"?version="+ver+"#"+v); await pg.reload(); await pg.wait_for_timeout(350)
                    n=await pg.locator(".stepper button").count()
                    for i in range(max(n,1)):
                        if n: await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(300)
                        ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
                        if ov>1: print(name,ver,v,i,"OVERFLOW",ov)
                        if ver=="guidee" or v in ("accueil","bilan"): await pg.screenshot(path=f"{D}s-{name}-{ver[0]}-{v}-{i}.png",full_page=True)
                print(name,ver,"errors:",errs)
                await ctx.close()
        await b.close()
asyncio.run(main())
