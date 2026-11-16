import sys, asyncio
from playwright.async_api import async_playwright
f=sys.argv[1]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":820,"height":1180}, accept_downloads=True); pg = await ctx.new_page(); errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://"+f); await pg.wait_for_timeout(300)
        await pg.evaluate("go('f3')"); await pg.wait_for_timeout(200)
        print("o2 table hidden before:", await pg.evaluate("document.querySelector('#wO2h details').hidden"))
        await pg.locator("#wO2h [data-a='run']").click(); await pg.wait_for_timeout(4500)
        print("o2 msg mid:", await pg.inner_text("#o2msg"))
        await pg.wait_for_timeout(5500); print("o2 msg end:", await pg.inner_text("#o2msg"), "| table hidden after:", await pg.evaluate("document.querySelector('#wO2h details').hidden"))
        await pg.locator("#wg").screenshot(path="test/f-o2.png")
        await pg.evaluate("go('f10')"); await pg.wait_for_timeout(200)
        await pg.locator(".labsw [data-k='perm']").click(); await pg.wait_for_timeout(100)
        await pg.locator("#wLabo [data-a='run']").click(); await pg.wait_for_timeout(7600)
        print("labo:", (await pg.inner_text("#laboRes")).replace("\n"," | "))
        await pg.locator(".labsw [data-k='ocean']").click(); await pg.locator("#wLabo [data-a='run']").click(); await pg.wait_for_timeout(7600)
        print("labo no ocean:", (await pg.inner_text("#laboRes")).replace("\n"," | "))
        await pg.evaluate("for (const k of ['vap','ice','perm']) {} "); 
        await pg.locator("#wg").screenshot(path="test/f-labo.png")
        await pg.evaluate("const r=document.querySelector('#fdT'); r.value=1.5; r.dispatchEvent(new Event('input'))"); print("dilat:", await pg.inner_text("#fdR"))
        # cards: first answers
        await pg.evaluate("go('f1')"); await pg.wait_for_timeout(100)
        await pg.locator("#fc [data-flip]").first.click(); await pg.locator("#fc [data-r='0']").first.click()
        await pg.evaluate("go('rappel')"); await pg.click("#start")
        for i in range(10):
            await pg.click("#sess [data-flip]"); await pg.click("#sess [data-r='%d']" % (i%2)); await pg.wait_for_timeout(20)
        await pg.evaluate("go('bilan')"); await pg.wait_for_timeout(100)
        async with pg.expect_download() as dl: await pg.click("#bDl")
        d = await dl.value; print(open(await d.path(), encoding="utf-8-sig").read()[:1400])
        print("errors", errs); await b.close()
asyncio.run(main())
