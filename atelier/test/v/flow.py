import asyncio, sys, json
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/5e/mission-5/mouvement/vitesses-mouvements.html"
G={"p1":["a1","a2","a3"],"p2":["b1","b2"],"p3":["c1","c2","c3"],"p4":["d2"]}
OK={"a1":["M01234567"],"a2":["m012","c0","36"],"a3":["6,1","31 m/s","c0"],"b1":["r012"],"b2":["r102","r102"],"c1":["25","r012","r012"],"c2":["40","r012","r012"],"c3":["50","20","c1","10"],"d2":["accelere","augmente","ralenti","diminue","uniformme","constante"]}
BAD={"a1":["M12345670"],"a2":["m013","c1","10"],"a3":["0,47","396","c1"],"b1":["r210"],"b2":["r012","r012"],"c1":["30","r210","r210"],"c2":["10","r210","r210"],"c3":["20","45","c0","50"],"d2":["ralenti","diminue","accéléré","augmente","constant","uniforme"]}
PRE={}
async def fill(pg,iid,vals):
    for k,v in enumerate(vals):
        part=pg.locator(f'.part[data-k="{k}"]')
        if v[0]=="c" and v[1:].isdigit() and len(v)==2: await part.locator(f'.opt[data-j="{v[1]}"]').click()
        elif v[0]=="m" and v[1:].isdigit():
            for j in range(6):
                on=await part.locator(f'.opt[data-j="{j}"]').get_attribute("aria-pressed")=="true"
                if on != (str(j) in v[1:]): await part.locator(f'.opt[data-j="{j}"]').click()
        elif v[0]=="r" and v[1:].isdigit():
            for i,j in enumerate(v[1:]): await part.locator(f'[data-i="{i}"][data-j="{j}"]').click()
        elif v[0]=="M":
            for i in range(len(v)-1):
                if await part.locator(f'[data-mi="{i}"] .mv.has').count(): await part.locator(f'[data-mi="{i}"]').click()
            for i,j in enumerate(v[1:]):
                await part.locator(f'[data-mi="{i}"]').click(); await part.locator(f'[data-mj="{j}"]').click()
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
        await pg.locator('#item .part[data-k="0"] .opt[data-j="1"]').click(); await pg.locator('#item .part[data-k="1"] .opt[data-j="2"]').click(); await pg.locator("#item [data-check]").click(); print("rappel:",(await pg.locator("#item .gfb").inner_text())[:40])
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
                bad_first = iid not in ("b1",)   # deux étapes réussies au premier essai
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
                await pg.screenshot(path=f"test/v/f-{iid}-mid.png",full_page=True)
                if await pg.locator('.animctl [data-a="run"]').count(): await pg.wait_for_timeout(8500)
                await pg.screenshot(path=f"test/v/f-{iid}.png",full_page=True)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200)
        await pg.locator("#eleve").fill("Élève Test")
        async with pg.expect_download() as d: await pg.locator("#bDl").click()
        dl=await d.value; await dl.save_as("test/v/bilan.txt"); print("download:",dl.suggested_filename)
        await pg.locator("#bCp").click(); await pg.wait_for_timeout(200); print("copy:",await pg.locator("#bMsg").inner_text())
        print("mail btn:",await pg.locator("#bMail").count())
        await pg.screenshot(path="test/v/f-bilan.png",full_page=True)
        await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path="test/v/f-show.png"); await pg.locator("#ovClose").click()
        print("errors:",errs)
        await b.close()
asyncio.run(main())
