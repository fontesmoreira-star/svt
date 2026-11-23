# Captures de chaque animation à mi-parcours et à la fin (horloge accélérée), pour relecture visuelle
import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/metabolisme/fiche-animee-metabolisme.html"
D="test/metab/"
FAST="""(()=>{let T=0;window.requestAnimationFrame=cb=>setTimeout(()=>{T+=100;cb(T)},16);window.cancelAnimationFrame=id=>clearTimeout(id);})()"""
STEPS=[("accueil",None,[]),("p1",0,[("um","both")]),("p1",1,[("org","1"),("org","2")]),("p2",0,[("rk","r"),("rk","a"),("rk","l")]),("p2",1,[("lp","on"),("lp","off")]),
       ("p3",0,[]),("p4",0,[("rs","cep"),("rs","lad")]),("p5",0,[]),("p5",1,[("vk","foie"),("vk","adip")]),("p6",0,[("ex","g"),("ex","s")])]
async def main(w=820,h=1180,dark=False,tag="ipad"):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light")
        await ctx.add_init_script(FAST)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(300)
        for v,i,segs in STEPS:
            await pg.goto(URL+"#"+v); await pg.reload(); await pg.wait_for_timeout(250)
            if i is not None: await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(200)
            wz=pg.locator("#wz") if i is not None else pg.locator("#item")
            runs=pg.locator('#wz .animctl [data-a="run"]')
            if not segs: segs=[(None,None)]
            for a,k in segs:
                if a: await wz.locator(f'[data-{a}="{k}"]').click(); await pg.wait_for_timeout(100)
                n=await runs.count()
                for j in range(n):
                    await runs.nth(j).click(); await pg.wait_for_timeout(450)
                    await runs.nth(j).click()  # pause à mi-parcours
                    await wz.screenshot(path=f"{D}w-{tag}-{v}-{i}-{k}-{j}-mid.png")
                    await runs.nth(j).click(); await pg.wait_for_timeout(2900)
                await wz.screenshot(path=f"{D}w-{tag}-{v}-{i}-{k}-end.png")
            ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth")
            if ov>1: print(tag,v,i,"OVERFLOW",ov)
        print(tag,"errors:",errs)
        await b.close()
asyncio.run(main(*([390,844,True,"phone"] if "phone" in sys.argv else [])))
