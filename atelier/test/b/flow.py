import asyncio, sys, json
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/echelles-biodiversite/trois-echelles-biodiversite.html"
G={"p1":["a1","a2"],"p2":["b1","b2","b3"],"p3":["c1","c2","c3"]}
OK={"a1":["r0110","m02","2","c1"],"a2":["r0101","c2","interfecond","fertile"],"b1":["m024","m1245","c2"],"b2":["r012012","c2"],"b3":["c1","2","c2"],"c1":["T","c1","c0"],"c2":["T","c1","c0","c2"],"c3":["r01221","c1"]}
BAD={"a1":["r1001","m13","5","c0"],"a2":["r1010","c0","fertiles","stérile"],"b1":["m01","m03","c0"],"b2":["r210210","c0"],"b3":["c0","3","c1"],"c1":["T","c0","c1"],"c2":["T","c0","c1","c0"],"c3":["r00000","c0"]}
PRE={"a1":3}
async def task(pg,iid):
    if iid=="c1":
        for pi,vals in enumerate([(0,0,0,0),(3,3,1,8),(2,1,2,5)]):
            await pg.locator(f'#wz [data-p="{pi}"]').click()
            for k,j in zip("yctg",vals): await pg.locator(f'#wz [data-k="{k}"][data-j="{j}"]').click()
    if iid=="c2":
        for e in ["lac","champ"]:
            await pg.locator(f'#wz [data-e="{e}"]').click()
            for s in "tlh": await pg.locator(f'#wz [data-sn="{s}"]').click()
            ids=await pg.locator("#wz .ecosp").evaluate_all("ns=>ns.map(n=>n.dataset.id)")
            for i in ids[:5]: await pg.locator(f'#wz .ecosp[data-id="{i}"] .hit').click(force=True)
async def fill(pg,iid,vals):
    for k,v in enumerate(vals):
        part=pg.locator(f'.part[data-k="{k}"]')
        if v=="T": continue
        if v[0]=="c" and v[1:].isdigit() and len(v)==2: await part.locator(f'.opt[data-j="{v[1]}"]').click()
        elif v[0]=="m" and v[1:].isdigit():
            n=await part.locator('.opt').count()
            for j in range(n):
                on=await part.locator(f'.opt[data-j="{j}"]').get_attribute("aria-pressed")=="true"
                if on != (str(j) in v[1:]): await part.locator(f'.opt[data-j="{j}"]').click()
        elif v[0]=="r" and v[1:].isdigit():
            for i,j in enumerate(v[1:]): await part.locator(f'[data-i="{i}"][data-j="{j}"]').click()
        else: await part.locator("input").fill(v)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":820,"height":1180},device_scale_factor=1,accept_downloads=True)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(200)
        await pg.screenshot(path="test/b/f-accueil.png",full_page=True)
        await pg.locator('#item .part[data-k="0"] .opt[data-j="1"]').click(); await pg.locator('#item .part[data-k="1"] .opt[data-j="0"]').click(); await pg.locator("#item [data-check]").click(); print("rappel:",(await pg.locator("#item .gfb").inner_text())[:40])
        for g,items in G.items():
            await pg.locator(f'#tabs [data-v="{g}"]').click()
            for i,iid in enumerate(items):
                await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
                if iid in PRE:
                    assert await pg.locator(".parts").is_hidden(), iid+" parts should be hidden"
                    await pg.locator(f'[data-h="{PRE[iid]}"]').click(); await pg.wait_for_timeout(200)
                await pg.locator("[data-check]").click()
                t=await pg.locator(".gfb").inner_text(); assert "Complète" in t, (iid,t)
                for _ in range(3): await pg.locator("[data-hint]").click()
                assert await pg.locator(".hz .hint").count()==3 and await pg.locator("[data-hint]").count()==0, iid
                await fill(pg,iid,BAD[iid])
                if "T" in OK[iid]:
                    await pg.locator("[data-check]").click(); t=await pg.locator(".gfb").inner_text(); assert "Complète" in t, (iid,"tâche non faite mais validée",t)
                    await task(pg,iid); print(iid,"task:",await pg.locator("[data-task]").inner_text())
                await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                msgs=await pg.locator(".pfb.bad").all_inner_texts()
                print(iid,"BAD →",[m[:100] for m in msgs])
                assert await pg.locator(".corr").count()==0, iid+" corr trop tôt"
                assert await pg.locator(".unlockz").count()==0, iid
                await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                assert await pg.locator(".corr").count()==1, iid+" corr absent au 2e essai"
                assert await pg.locator(".unlockz").count()==0, iid+" unlock avant réussite"
                await fill(pg,iid,OK[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(250)
                msgs=await pg.locator(".pfb").all_inner_texts()
                assert not await pg.locator(".pfb.bad").count(), (iid, await pg.locator(".pfb.bad").all_inner_texts())
                gf=await pg.locator(".gfb").inner_text()
                print(iid,"OK →",gf.replace("\n"," | ")[:110], "| typo:" ,[m for m in msgs if "Orthographe" in m])
                if await pg.locator(".unlockz").count(): print("   unlock:",(await pg.locator(".unl .dh").inner_text()).replace("\n"," "))
                if await pg.locator("#hypo .pfb").count(): print("   hypo:",await pg.locator("#hypo .pfb").inner_text())
                if await pg.locator(".unlockz [data-draw]").count(): await pg.locator(".unlockz [data-draw]").click(); await pg.wait_for_timeout(2200); print("   classe:",await pg.locator(".unlockz .readout").inner_text())
                for run in await pg.locator('.unlockz .animctl [data-a="run"]').all(): await run.click()
                if await pg.locator('.unlockz .animctl').count():
                    for k,tm in enumerate([2500,4000,4500,3500]):
                        await pg.wait_for_timeout(tm); await pg.locator(".unl").screenshot(path=f"test/b/f-{iid}-unl{k}.png"); print("   ",k,(await pg.locator(".unlockz .readout").inner_text())[:100])
                await pg.screenshot(path=f"test/b/f-{iid}.png",full_page=True)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200)
        await pg.locator("#eleve").fill("Élève Test")
        async with pg.expect_download() as d: await pg.locator("#bDl").click()
        dl=await d.value; await dl.save_as("test/b/bilan.txt"); print("download:",dl.suggested_filename)
        await pg.locator("#bCp").click(); await pg.wait_for_timeout(200); print("copy:",await pg.locator("#bMsg").inner_text())
        print("mail btn:",await pg.locator("#bMail").count())
        await pg.screenshot(path="test/b/f-bilan.png",full_page=True)
        await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path="test/b/f-show.png"); await pg.locator("#ovClose").click()
        # persistance après rechargement
        await pg.reload(); await pg.wait_for_timeout(300); print("après rechargement:",(await pg.locator(".score-big").inner_text()))
        print("errors:",errs)
        await b.close()
asyncio.run(main())
