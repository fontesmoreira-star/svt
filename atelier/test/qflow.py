import sys, asyncio
from playwright.async_api import async_playwright
f=sys.argv[1]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":820,"height":1180}, accept_downloads=True); pg = await ctx.new_page(); errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://"+f); await pg.wait_for_timeout(300)
        allq = await pg.evaluate("ALLQ.map(x=>[x.p.id,x.id,x.q.a,x.q.o.length])")
        # Q1 of each part: wrong, hint x3, wrong again -> correction shown; others: alternate right/wrong
        for k,(pid,qid,a,n) in enumerate(allq):
            await pg.evaluate(f"go('{pid}', true)")
            el = pg.locator(f"#{qid}")
            wrong = (k % 3 == 0)
            pick = (a+1)%n if wrong else a
            await el.locator(f'.opt[data-k="{pick}"]').click(); await el.locator("[data-v]").click()
            if wrong:
                fb = await el.locator(".qfb").inner_text()
                corr1 = await el.locator(".qcorr").inner_text()
                for h in range(3): await el.locator("[data-h]").click()
                nh = await el.locator(".hint").count(); hb = await el.locator("[data-h]").count()
                await el.locator("[data-r]").click(); await el.locator(f'.opt[data-k="{pick}"]').click(); await el.locator("[data-v]").click()
                corr2 = await el.locator(".qcorr").inner_text()
                if k < 4: print(qid, "| fb:", fb.replace("\n"," ")[:70], "| corr after 1:", bool(corr1.strip()), "| hints:", nh, "btn left:", hb, "| corr after 2:", corr2[:30].replace("\n"," "))
                if not corr2.strip() or corr1.strip() or nh!=3 or hb!=0: print("!! PROBLEM", qid)
            else:
                c = await el.locator(".qcorr").inner_text()
                if not c.strip(): print("!! no correction on success", qid)
        await pg.evaluate("go('bilan')"); await pg.wait_for_timeout(150)
        print((await pg.evaluate("bilanText('Test')"))[:1800])
        # animation buttons on a chart
        await pg.evaluate("go('p5')"); await pg.wait_for_timeout(200)
        run = pg.locator("#p5q1 .animctl [data-a='run']").first
        print("anim label:", await run.inner_text()); await run.click(); await pg.wait_for_timeout(1200)
        print("anim label playing:", await run.inner_text()); await run.click(); print("paused:", await run.inner_text())
        await pg.locator("#p5q1 .animctl [data-a='reset']").first.click(); await pg.wait_for_timeout(8000); print("end:", await run.inner_text())
        # download (blob shim) + copy + show
        await pg.evaluate("go('bilan')"); await pg.wait_for_timeout(150)
        await pg.fill("#eleve", "Léa 12")
        async with pg.expect_download() as dl: await pg.click("#bDl")
        d = await dl.value; path = await d.path(); txt = open(path, encoding="utf-8-sig").read()
        print("download:", d.suggested_filename, len(txt), "chars; msg:", await pg.inner_text("#bMsg"))
        print("mail button:", await pg.locator("#bMail").count())
        await pg.click("#bShow"); await pg.wait_for_timeout(100); print("overlay:", (await pg.locator(".overlay").inner_text())[:120].replace("\n"," | ")); await pg.click("#ovClose")
        await pg.click("#reset"); await pg.click("#reset"); await pg.wait_for_timeout(100); print("after reset view:", await pg.evaluate("S.view"), await pg.evaluate("Object.keys(S.ans).length"))
        print("storage keys:", await pg.evaluate("Object.keys(localStorage)"))
        print("errors", errs)
        await b.close()
asyncio.run(main())
