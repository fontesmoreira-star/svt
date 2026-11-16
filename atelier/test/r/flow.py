import asyncio, sys, json
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/terminale/theme-1/1-2-systeme-climatique/temperature-retroactions.html"
G={"g1":["g1a","g1b","g1c","g1d"],"g2":["g2a","g2b","g2c","g2d","g2e","g2f"],"g3":["g3a","g3b","g3c"],"commun":["c1","c2"]}
OK={"g1a":["Thermoclyne","1 000 m","c1","0,26"],"g1b":["0,26 m","52","m01"],"g1c":["29,8","26,3 °C","c1","inertie"],"g1d":["4","c1","c1","tMon texte."],
"g2a":["130","c1","c1"],"g2b":["2 %","la banquise","c1"],"g2c":["300 mL","250","r10"],"g2d":["60","40 W","95","c1"],"g2e":["L0123","c0","tConséquences."],"g2f":["150","350","76 m","c0"],
"g3a":["photosynthese","87","r102"],"g3b":["80","0","c1","c1"],"g3c":["c0","c1","c1","c1","tRôle."],"c1":["r01122","c0","c1"],"c2":["tRéponse."]}
BAD={"g1a":["plancton","1","c0","0,00026"],"g1b":["2,6","26","m02"],"g1c":["26,3","29,8","c0","capacité thermique"],"g1d":["3","c0","c0","tx"],
"g2a":["37","c0","c0"],"g2b":["0,02","iceberg","c0"],"g2c":["350","200","r01"],"g2d":["40","60","5","c2"],"g2e":["L3210","c1","tx"],"g2f":["1,5","105","0,0757","c1"],
"g3a":["respiration","10263","r012"],"g3b":["130","200","c0","c0"],"g3c":["c1","c0","c0","c0","tx"],"c1":["r10021","c1","c0"],"c2":["tx"]}
PRE={"g1c":1,"g2c":2}
async def fill(pg,iid,vals):
    for k,v in enumerate(vals):
        part=pg.locator(f'.part[data-k="{k}"]')
        if v[0]=="c" and v[1:].isdigit() and len(v)==2: await part.locator(f'.opt[data-j="{v[1]}"]').click()
        elif v[0]=="m":
            for j in range(4):
                on=await part.locator(f'.opt[data-j="{j}"]').get_attribute("aria-pressed")=="true"
                if on != (str(j) in v[1:]): await part.locator(f'.opt[data-j="{j}"]').click()
        elif v[0]=="r":
            for i,j in enumerate(v[1:]): await part.locator(f'[data-i="{i}"][data-j="{j}"]').click()
        elif v[0]=="L":
            while await part.locator('[data-slot]:not([disabled])').count(): await part.locator('[data-slot]:not([disabled])').first.click()
            for j in v[1:]: await part.locator(f'.bank [data-j="{j}"]').click()
        elif v[0]=="t": await part.locator("textarea").fill(v[1:])
        else: await part.locator("input").fill(v)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":820,"height":1180},device_scale_factor=1,accept_downloads=True)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(200)
        await pg.locator('[data-pi="0"][data-pj="0"]').click(); await pg.locator('[data-pi="1"][data-pj="0"]').click(); await pg.locator('[data-pi="2"][data-pj="2"]').click()
        for g,items in G.items():
            await pg.locator(f'#tabs [data-v="{g}"]').click()
            for i,iid in enumerate(items):
                await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
                # vérifier vide
                if iid in PRE:
                    assert await pg.locator(".parts").is_hidden(), iid+" parts should be hidden"
                    await pg.locator(f'[data-h="{PRE[iid]}"]').click(); await pg.wait_for_timeout(200)
                await pg.locator("[data-check]").click()
                t=await pg.locator(".gfb").inner_text(); assert "Complète" in t, (iid,t)
                # 3 coups de pouce
                for _ in range(3): await pg.locator("[data-hint]").click()
                assert await pg.locator(".hz .hint").count()==3 and await pg.locator("[data-hint]").count()==0, iid
                bad_first = iid not in ("g1a","g3a")   # deux étapes réussies au premier essai
                if bad_first:
                    await fill(pg,iid,BAD[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                    msgs=await pg.locator(".pfb.bad").all_inner_texts()
                    print(iid,"BAD →",[m[:95] for m in msgs])
                    if iid!="c2" and not all(v[0]=="t" for v in OK[iid]):
                        assert await pg.locator(".corr").count()==0, iid+" corr trop tôt"
                        assert await pg.locator(".unlockz").count()==0, iid
                        await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                        assert await pg.locator(".corr").count()==1, iid+" corr absent au 2e essai"
                        assert await pg.locator(".unlockz").count()==0, iid+" unlock avant réussite"
                await fill(pg,iid,OK[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(250)
                msgs=await pg.locator(".pfb").all_inner_texts()
                assert not await pg.locator(".pfb.bad").count(), (iid, await pg.locator(".pfb.bad").all_inner_texts())
                gf=await pg.locator(".gfb").inner_text()
                print(iid,"OK →",gf.replace("\n"," | ")[:110], "| typo:" ,[m for m in msgs if "Orthographe" in m or "signe" in m])
                if await pg.locator(".crit button").count():
                    await pg.locator(".crit button").first.click(); await pg.locator(".crit button").nth(1).click()
                if await pg.locator(".unlockz").count(): print("   unlock:",(await pg.locator(".unl .dh").inner_text()).replace("\n"," "))
                if await pg.locator("#hypo .pfb").count(): print("   hypo:",await pg.locator("#hypo .pfb").inner_text())
                # animations
                for run in await pg.locator('.animctl [data-a="run"]').all():
                    await run.click()
                await pg.wait_for_timeout(1500)
                await pg.screenshot(path=f"test/r/f-{iid}-mid.png",full_page=True)
                if await pg.locator('.animctl [data-a="run"]').count(): await pg.wait_for_timeout(8500)
                await pg.screenshot(path=f"test/r/f-{iid}.png",full_page=True)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200)
        await pg.locator("#eleve").fill("Élève Test")
        async with pg.expect_download() as d: await pg.locator("#bDl").click()
        dl=await d.value; await dl.save_as("test/r/bilan.txt"); print("download:",dl.suggested_filename)
        await pg.locator("#bCp").click(); await pg.wait_for_timeout(200); print("copy:",await pg.locator("#bMsg").inner_text())
        print("mail btn:",await pg.locator("#bMail").count())
        await pg.screenshot(path="test/r/f-bilan.png",full_page=True)
        await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path="test/r/f-show.png"); await pg.locator("#ovClose").click()
        print("errors:",errs)
        await b.close()
asyncio.run(main())
