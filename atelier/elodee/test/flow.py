import sys, asyncio
from playwright.async_api import async_playwright
f=sys.argv[1]; lang=sys.argv[2]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":820,"height":1180}); pg = await ctx.new_page(); errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://"+f); await pg.wait_for_timeout(300)
        # answer all graded items wrong first then right
        ids = await pg.evaluate("Object.values(ITEMS).filter(it=>maxOf(it)).map(it=>[it.id,it.step,it.type])")
        for wrong in [True, False]:
            for iid, step, typ in ids:
                await pg.evaluate(f"go('{step}', true)"); await pg.wait_for_timeout(40)
                el = pg.locator(f'[data-item="{iid}"]')
                await el.scroll_into_view_if_needed()
                it = await pg.evaluate(f"(()=>{{const it=ITEMS['{iid}']; return {{a:it.a, rows: it.rows? it.rows.map(r=>r.a):null, ans: it.ans, n: it.opts? it.opts.length: 0, ncols: it.cols? it.cols.map(c=>c.opts.length):null}}}})()")
                if typ=="choice":
                    k = (it["a"]+1)%it["n"] if wrong else it["a"]
                    await el.locator(f'.opt[data-j="{k}"]').click()
                elif typ=="num":
                    await el.locator("input").fill(str(it["ans"]*3+1 if wrong else it["ans"]).replace(".",","))
                elif typ=="grid":
                    for ri,row in enumerate(it["rows"]):
                        for ci,a in enumerate(row):
                            k = (a+1)%it["ncols"][ci] if wrong else a
                            await el.locator(f'[data-c="{ri}-{ci}"][data-j="{k}"]').click()
                elif typ=="gap":
                    blanks = await pg.evaluate("gapBlanks()")
                    order = blanks[::-1] if wrong else blanks
                    if not wrong:
                        # clear filled blanks
                        for i in range(len(blanks)):
                            await el.locator(f'[data-b="{i}"]').click()
                        await el.locator('[data-b="0"]').click()
                    for w in order:
                        await el.locator(f'[data-w="{w}"]').click()
                elif typ=="match":
                    n = await pg.evaluate("C.dnl.match.pairs.length")
                    for i in range(n):
                        await el.locator(f'[data-en="{i}"]').click()
                        fr = (i+1)%n if wrong else i
                        await el.locator(f'[data-fr="{fr}"]').click()
                await el.locator("[data-check]").click(); await pg.wait_for_timeout(30)
                fb = (await el.locator(".fbz").inner_text()).split("\n")[0]
                if wrong: print("WRONG", iid, "→", fb[:80])
                elif not fb.startswith("✓"): print("!! RIGHT FAILED", iid, fb)
        await pg.evaluate("go('bilan')"); await pg.wait_for_timeout(100)
        print(await pg.evaluate("bilanText('Test')"))
        # simulation
        await pg.evaluate("S.src='sim'; S.simDone=false; save(); go('s4')"); await pg.wait_for_timeout(200)
        await pg.click("#exRun"); await pg.wait_for_timeout(13000)
        await pg.screenshot(path=f"test/{lang}-sim-mid.png")
        st = await pg.evaluate("[SIM.t.toFixed(1), document.querySelector('#exL').textContent, document.querySelector('#bubs').getAttribute('class')]"); print("sim at ~13s:", st)
        await pg.evaluate("SIM.t=39.5"); await pg.wait_for_timeout(1500)
        print("sim end:", await pg.evaluate("[SIM.t, S.simDone, document.querySelector('#exDone').textContent, document.querySelectorAll('#exTab tbody tr').length]"))
        ch = pg.locator("#exChart .chart"); bb = await ch.bounding_box(); await pg.mouse.click(bb["x"]+bb["width"]*0.5, bb["y"]+bb["height"]*0.4)
        print("readout:", await pg.locator("#exChart .readout").inner_text())
        await pg.locator("#srcSim").screenshot(path=f"test/{lang}-sim-end.png")
        # photo upload
        await pg.evaluate("S.src='mine'; save(); go('s4')"); await pg.wait_for_timeout(150)
        await pg.set_input_files("#photo", "img/fr-004-003.jpg"); await pg.wait_for_timeout(300)
        print("photo:", await pg.evaluate("!!document.querySelector('#photoPrev img')"))
        print("errors", errs)
        await b.close()
asyncio.run(main())
