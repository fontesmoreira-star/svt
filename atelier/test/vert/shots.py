# Captures des widgets (horloge accélérée) : relecture visuelle
import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/biodiversite-temps/organisation-vertebres.html"
D="test/vert/"
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
        await wz.locator('[data-pi="1"]').click(); await wz.locator('[data-po="av"]').click()
        await wz.locator('[data-pi="3"]').click(); await wz.locator('[data-po="ar"]').click(); await pg.wait_for_timeout(500)
        await wz.locator('[data-pi="0"]').click(); await wz.locator('[data-po="ve"]').click(); await shot(wz,"a1-carpe")
        await wz.locator('[data-an="g"]').click(); await pg.wait_for_timeout(100)
        for i,k in enumerate(["ar","do","av","ve"]): await wz.locator(f'[data-pi="{i}"]').click(); await wz.locator(f'[data-po="{k}"]').click()
        await pg.wait_for_timeout(500); await shot(wz,"a1-gren")
        await wz.locator('[data-vw="t"]').click(); await pg.wait_for_timeout(100); await shot(wz,"a1-top")
        await wz.locator('[data-fold="A"]').click(); await pg.wait_for_timeout(380); await shot(wz,"a1-foldA-mid"); await pg.wait_for_timeout(500); await shot(wz,"a1-foldA-end"); await pg.wait_for_timeout(1400)
        await wz.locator('[data-an="c"]').click(); await pg.wait_for_timeout(100)
        await wz.locator('[data-fold="B"]').click(); await pg.wait_for_timeout(800); await shot(wz,"a1-foldB-end"); await pg.wait_for_timeout(1400); await shot(wz,"a1-ctop")
        wz=await item("p1",1)
        await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(500); await shot(wz,"a2-mid"); await pg.wait_for_timeout(900); await shot(wz,"a2-end")
        await wz.locator('[data-zchk]').click(); await shot(wz,"a2-bad")
        await wz.locator('[data-z="0"]').fill("260"); await wz.locator('[data-z="1"]').fill("630"); await wz.locator('[data-zchk]').click(); await shot(wz,"a2-ok")
        await wz.locator('[data-an="g"]').click(); await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(1500)
        await wz.locator('[data-z="0"]').fill("260"); await wz.locator('[data-z="1"]').fill("560"); await wz.locator('[data-zchk]').click(); await shot(wz,"a2-gren")
        await wz.locator('[data-an="r"]').click(); await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(1500); await shot(wz,"a2-rouss")
        wz=await item("p1",2)
        await wz.locator('[data-si="0"]').click(); await wz.locator('[data-sk="ant"]').click(); await wz.locator('[data-si="1"]').click(); await wz.locator('[data-sk="crane"]').click()
        await wz.locator('[data-si="3"]').click(); await wz.locator('[data-sk="post"]').click()
        await wz.locator('[data-axes]').click(); await pg.wait_for_timeout(100); await shot(wz,"a3-carpe")
        await wz.locator('[data-an="g"]').click(); await wz.locator('[data-si="0"]').click(); await wz.locator('[data-sk="col"]').click(); await wz.locator('[data-si="3"]').click(); await wz.locator('[data-sk="ant"]').click(); await pg.wait_for_timeout(100); await shot(wz,"a3-gren")
        wz=await item("p2",0)
        await shot(wz,"b1-me0")
        await wz.locator('[data-cat="hu"]').click(); await wz.locator('[data-bn="hu"]').click(); await wz.locator('[data-cat="ab"]').click(); await wz.locator('[data-bn="ma"]').click(); await shot(wz,"b1-me")
        for k in ["or","to","gr"]:
            await wz.locator(f'[data-sp="{k}"]').click(); await pg.wait_for_timeout(100)
            for c in ["ce","hu","ab","ma"]: await wz.locator(f'[data-cat="{c}"]').click(); await wz.locator(f'[data-bn="{c}"]').click()
            await shot(wz,f"b1-{k}")
        await wz.locator('[data-skin]').click(); await shot(wz,"b1-noskin")
        wz=await item("p2",1)
        await shot(wz,"b2-0"); await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(330); await wz.locator('.animctl [data-a="run"]').click(); await shot(wz,"b2-mid")
        await wz.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(1200); await shot(wz,"b2-al"); await wz.locator('[data-pap]').click(); await shot(wz,"b2-end")
        ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"); print(tag,"overflow",ov)
        print(tag,"errors:",errs); await b.close()
args={"ipad":(820,1180,False,"ipad"),"phone":(390,844,True,"phone")}[sys.argv[1] if len(sys.argv)>1 else "ipad"]
asyncio.run(main(*args))
