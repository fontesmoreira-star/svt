import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/terminale/theme-3/3-1-biodiversite/methode-capture-marquage-recapture.html"
D="test/cmr/"
async def cmr(pg, est=True):
    w=pg.locator("#wz")
    for _ in range(12):
        a=w.locator("[data-act]")
        if await a.is_hidden():
            ex=await pg.evaluate("LAB.cap.n*LAB.cfg.n2/(LAB.rec.reduce((s,r)=>s+r.m,0)/LAB.rec.length)")
            await w.locator("#estIn").fill(str(round(ex))); await w.locator("[data-est]").click(); await pg.wait_for_timeout(100); continue
        t=await a.inner_text()
        if "Nouvelle" in t: return
        await a.click(); await pg.wait_for_timeout(2000 if "Attendre" in t or "Relâcher" in t else 1200)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        for name,(w,h,dark) in {"ipad":(820,1180,False),"phone":(390,844,True),"land":(1180,820,False)}.items():
            ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light",device_scale_factor=1)
            pg=await ctx.new_page(); errs=[]
            pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
            await pg.goto(URL+"#p2"); await pg.wait_for_timeout(400)
            await cmr(pg)
            for v in ["accueil","p1","p2","p3","p4","bilan"]:
                await pg.goto(URL+"#"+v); await pg.reload(); await pg.wait_for_timeout(400)
                n=await pg.locator(".stepper button").count()
                for i in range(max(n,1)):
                    if n: await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(350)
                    if v=="p4" and i in (0,2):
                        for nn in ["50","200"]:
                            await pg.locator(f'[data-fn="{nn}"]').click(); await pg.locator("[data-go]").click(); await pg.wait_for_timeout(1700)
                    ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
                    if ov>1: print(name,v,i,"OVERFLOW",ov)
                    if name!="land" or i==0: await pg.screenshot(path=f"{D}s-{name}-{v}-{i}.png",full_page=True)
            print(name,"errors:",errs)
            await ctx.close()
        await b.close()
asyncio.run(main())
