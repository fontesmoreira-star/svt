# Captures des animations (horloge accélérée) : relecture visuelle
import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/biodiversite-temps/evolution-biodiversite-temps.html"
D="test/kt/"
FAST="""(()=>{let T=0;window.requestAnimationFrame=cb=>setTimeout(()=>{T+=100;cb(T)},16);window.cancelAnimationFrame=id=>clearTimeout(id);})()"""
async def main(w,h,dark,tag):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":w,"height":h},color_scheme="dark" if dark else "light"); await ctx.add_init_script(FAST)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        async def item(v,i):
            await pg.goto(URL+"#"+v); await pg.wait_for_timeout(250)
            if i is not None: await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(200)
            return pg.locator("#wz") if i is not None else pg.locator("#item")
        async def shot(loc,name): await loc.screenshot(path=f"{D}w-{tag}-{name}.png")
        w0=await item("accueil",None); await w0.locator('[data-p="Carbonifère"]').click(); await shot(w0,"r0")
        wz=await item("p1",0)
        await shot(wz,"a1-a")
        await wz.locator('[data-st="c"]').click(); await pg.wait_for_timeout(500); await shot(wz,"a1-warp"); await pg.wait_for_timeout(1500); await shot(wz,"a1-c")
        wz=await item("p1",1)
        for e in ["j","k"]: await wz.locator(f'[data-st="{e}"]').click(); await pg.wait_for_timeout(1900); await shot(wz,f"a2-{e}")
        await wz.locator('[data-gi="0"]').click(); await wz.locator('[data-gchk]').click(); await pg.wait_for_timeout(100); await shot(wz,"a2-grid")
        await pg.goto(URL+"#p2"); await pg.wait_for_timeout(250); await pg.locator(".stepper button").nth(0).click(); await pg.wait_for_timeout(200)
        await pg.locator('[data-h="0"]').click(); await pg.wait_for_timeout(250); wz=pg.locator("#wz")
        await wz.locator('[data-f="0"]').click(); await wz.locator('[data-t="het"]').click(); await wz.locator('[data-f="1"]').click(); await wz.locator('[data-t="het"]').click(); await shot(wz,"b1-M")
        await wz.locator('[data-sb="D"]').click(); await pg.wait_for_timeout(150); await shot(wz,"b1-D")
        wz=await item("p2",1); await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(1150); await wz.locator('.animctl [data-a="run"]').click(); await shot(wz,"b2-mid"); await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(2400); await shot(wz,"b2-end")
        wz=await item("p2",2); await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(2200); await shot(wz,"b3-end")
        wz=await item("p3",0); await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(1500); await shot(wz,"c1-end")
        wz=await item("p3",1)
        for _ in range(6): await wz.locator('[data-sel]').click(); await pg.wait_for_timeout(1000)
        await shot(wz,"c2-end")
        ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"); print(tag,"overflow",ov)
        print(tag,"errors:",errs); await b.close()
args={"ipad":(820,1180,False,"ipad"),"phone":(390,844,True,"phone")}[sys.argv[1] if len(sys.argv)>1 else "ipad"]
asyncio.run(main(*args))
