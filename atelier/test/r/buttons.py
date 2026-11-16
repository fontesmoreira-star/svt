import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/terminale/theme-1/1-2-systeme-climatique/temperature-retroactions.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":390,"height":844},color_scheme="dark",device_scale_factor=2,has_touch=True,is_mobile=True)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("dialog",lambda d: errs.append("DIALOG "+d.message))
        await pg.goto(URL+"#g2"); await pg.wait_for_timeout(200)
        fs=lambda: pg.evaluate("getComputedStyle(document.documentElement).fontSize")
        print("fs0",await fs()); await pg.locator("#fsMinus").click(); await pg.locator("#fsMinus").click(); print("fs min",await fs())
        for _ in range(9): await pg.locator("#fsPlus").click()
        print("fs max",await fs(), "overflow", await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"))
        for _ in range(7): await pg.locator("#fsMinus").click()
        await pg.locator("#themeBtn").click(); print("theme",await pg.evaluate("document.documentElement.dataset.theme")); await pg.locator("#themeBtn").click()
        # TP sur téléphone sombre
        await pg.locator(".stepper button").nth(2).click(); await pg.locator('[data-h="1"]').click(); await pg.wait_for_timeout(200)
        await pg.locator('#tpCtl [data-a="run"]').click(); await pg.wait_for_timeout(2500); await pg.locator('#tpCtl [data-a="run"]').click()
        print("pause label:",await pg.locator('#tpCtl [data-a="run"]').inner_text(), "|", await pg.locator("#tpSt").inner_text())
        await pg.locator("#wz").screenshot(path="test/r/p-tp.png")
        await pg.locator('#tpCtl [data-a="reset"]').click(); print("reset:",await pg.locator("#tpSt").inner_text())
        # petites cibles
        small=await pg.evaluate("""Array.from(document.querySelectorAll('button,input,[role=radio]')).filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.height<44)&&e.type!=='range'}).map(e=>e.className+':'+Math.round(e.getBoundingClientRect().height))""")
        print("cibles < 44px:",small)
        # boucle sur téléphone
        await pg.locator(".stepper button").nth(4).click(); await pg.wait_for_timeout(200)
        for j in "2031": await pg.locator(f'.bank [data-j="{j}"]').click()
        await pg.locator('[data-slot="1"]').click(); print("bank after remove:",await pg.locator(".bank [data-j]").count())
        await pg.locator(".part").first.screenshot(path="test/r/p-loop.png")
        # recommencer en deux temps
        await pg.locator("[data-reset]").click(); print("armed:",await pg.locator("[data-reset]").inner_text()); await pg.locator("[data-reset]").click()
        print("after reset slots filled:",await pg.locator(".lslot.filled").count())
        # projection sur ordinateur
        await ctx.close()
        ctx=await b.new_context(viewport={"width":1280,"height":800},device_scale_factor=1); pg=await ctx.new_page(); pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto(URL+"#g1"); await pg.locator("#projBtn").click(); await pg.wait_for_timeout(300)
        print("proj fs",await pg.evaluate("getComputedStyle(document.documentElement).fontSize"),"overflow",await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"))
        await pg.screenshot(path="test/r/proj-g1.png")
        await pg.locator(".stepper button").nth(1).click(); await pg.screenshot(path="test/r/proj-g1b.png",full_page=True)
        # clavier : Entrée vérifie
        await pg.goto(URL+"#bilan"); await pg.wait_for_timeout(200); await pg.locator("#reset").click(); await pg.locator("#reset").click(); await pg.wait_for_timeout(200)
        print("view after reset:",await pg.evaluate("location.hash"))
        # sans localStorage
        ctx2=await b.new_context(viewport={"width":820,"height":1180}); await ctx2.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw new Error('bloqué')}})")
        p2=await ctx2.new_page(); e2=[]; p2.on("pageerror",lambda e:e2.append(str(e))); await p2.goto(URL+"#g3"); await p2.wait_for_timeout(300)
        await p2.locator(".part input").first.fill("photosynthèse"); print("sans localStorage: erreurs",e2,"| parts",await p2.locator(".part").count())
        print("errors:",errs); await b.close()
asyncio.run(main())
