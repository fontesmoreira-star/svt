# Captures des simulations (horloge accélérée) : relecture visuelle
import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/forces-evolutives/derive-genetique.html"
D="test/derive/"
FAST="""(()=>{let T=0;window.requestAnimationFrame=cb=>setTimeout(()=>{T+=100;cb(T)},16);window.cancelAnimationFrame=id=>clearTimeout(id);})()"""
async def main(w,h,dark,tag):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light"); await ctx.add_init_script(FAST)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        async def item(v,i):
            await pg.goto(URL+"#"+v); await pg.wait_for_timeout(250)
            await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(200)
            if await pg.locator('[data-h="0"]').count(): await pg.locator('[data-h="0"]').click(); await pg.wait_for_timeout(200)
            return pg.locator("#wz")
        async def shot(loc,name): await loc.screenshot(path=f"{D}w-{tag}-{name}.png")
        wz=await item("p1",0)
        await shot(wz,"a1-0")
        await wz.locator('[data-ug="1"]').click(); await pg.wait_for_timeout(110); await shot(wz,"a1-fly"); await pg.wait_for_timeout(400); await shot(wz,"a1-1")
        for _ in range(4):
            await wz.locator('[data-ug="10"]').click(); await pg.wait_for_timeout(2000)
        await shot(wz,"a1-many")
        wz=await item("p2",0)
        await wz.locator('[data-run="10"]').click(); await pg.wait_for_timeout(200); await shot(wz,"b1-mid"); await pg.wait_for_timeout(500); await shot(wz,"b1-end")
        wz=await item("p2",1)
        await wz.locator('[data-run="10"]').click(); await pg.wait_for_timeout(700); await shot(wz,"b2-big")
        await wz.locator('[data-sz="100"]').click(); await wz.locator('[data-run="10"]').click(); await pg.wait_for_timeout(700); await shot(wz,"b2-100")
        wz=await item("p2",2)
        await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(500); await wz.locator('.animctl [data-a="run"]').click(); await shot(wz,"b3-mid")
        await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(1300); await shot(wz,"b3-5")
        await wz.locator('[data-gc="500"]').click(); await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(1300); await shot(wz,"b3-500")
        ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"); print(tag,"overflow",ov)
        print(tag,"errors:",errs); await b.close()
args={"ipad":(820,1180,False,"ipad"),"phone":(390,844,True,"phone")}[sys.argv[1] if len(sys.argv)>1 else "ipad"]
asyncio.run(main(*args))
