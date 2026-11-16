import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/meiose-cellules-reproductrices.html"
G={"p1":["a1","a2","a3"],"p2":["b1","b2"],"p3":["c1"],"p4":["d1","d2","d3"]}
OK={"a1":["4","2","2","c0"],"a2":["S0.34","S0.43","S0.62","S0.73"],"a3":["O012345"],"b1":["r01101","r0132"],"b2":["92","23","46","c0"],"c1":["T","4","c0","c2"],"d1":["m01","m01","c0"],"d2":["G0123","4","c0"],"d3":["23","differents","au hasard","differentes"]}
BAD={"a1":["2","4","4","c1"],"a2":["S0.43","S0.34","S0.73","S0.62"],"a3":["O102345"],"b1":["r10010","r0123"],"b2":["46","46","23","c1"],"c1":["T","2","c1","c0"],"d1":["m02","m2","c1"],"d2":["G1032","2","c1"],"d3":["46","identiques","en deux","identiques"]}
PRE={"a1":0}
async def task(pg,iid):
    if iid=="c1":
        for _ in range(5):
            await pg.locator("#wz [data-go]").click(); await pg.wait_for_timeout(4500)
        print("   coll:",(await pg.locator("#wz .coll .lead").inner_text()))
async def fill(pg,iid,vals):
    for k,v in enumerate(vals):
        part=pg.locator(f'.part[data-k="{k}"]')
        if v=="T": continue
        if v[0]=="S":
            await pg.locator("#wz [data-sl]").evaluate(f"(e)=>{{e.value={v[1:]};e.dispatchEvent(new Event('input'))}}"); await part.locator("[data-shot]").click()
        elif v[0]=="O":
            await part.locator("[data-clear]").click()
            for j in v[1:]: await part.locator(f'.order-item[data-j="{j}"]').click()
        elif v[0]=="G":
            for i,j in enumerate(v[1:]): await part.locator(f'[data-gi="{i}"]').click(); await part.locator(f'[data-gj="{j}"]').click()
        elif v[0]=="c" and v[1:].isdigit() and len(v)==2: await part.locator(f'.opt[data-j="{v[1]}"]').click()
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
        await pg.screenshot(path="test/mei/f-accueil.png",full_page=True)
        await fill(pg,"r0",["46","c0","c0"]); await pg.locator("#item [data-check]").click(); print("rappel:",(await pg.locator("#item .gfb").inner_text())[:40])
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
                print(iid,"BAD →",[m[:110] for m in msgs])
                assert await pg.locator(".corr").count()==0, iid+" corr trop tôt"
                assert await pg.locator(".unlockz").count()==0, iid
                await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                assert await pg.locator(".corr").count()==1, iid+" corr absent au 2e essai"
                await pg.screenshot(path=f"test/mei/f-{iid}-bad.png",full_page=True)
                await fill(pg,iid,OK[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(250)
                assert not await pg.locator(".pfb.bad").count(), (iid, await pg.locator(".pfb.bad").all_inner_texts())
                gf=await pg.locator(".gfb").inner_text()
                print(iid,"OK →",gf.replace("\n"," | ")[:100])
                if await pg.locator(".unlockz").count(): print("   unlock:",(await pg.locator(".unl .dh").inner_text()).replace("\n"," "))
                if await pg.locator("#hypo .pfb").count(): print("   hypo:",await pg.locator("#hypo .pfb").inner_text())
                for run in await pg.locator('.unlockz .animctl [data-a="run"]').all(): await run.click()
                if await pg.locator('.unlockz .animctl').count():
                    for k,tm in enumerate([3000,4000,6000]):
                        await pg.wait_for_timeout(tm); await pg.locator(".unl").screenshot(path=f"test/mei/f-{iid}-unl{k}.png"); print("   ",k,(await pg.locator(".unlockz .readout, .unlockz .celllab").first.inner_text())[:110])
                await pg.screenshot(path=f"test/mei/f-{iid}.png",full_page=True)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(300)
        await pg.locator("#eleve").fill("Élève Test")
        async with pg.expect_download() as d: await pg.locator("#bDl").click()
        dl=await d.value; await dl.save_as("test/mei/bilan.txt"); print("download:",dl.suggested_filename)
        await pg.locator("#bCp").click(); await pg.wait_for_timeout(200); print("copy:",await pg.locator("#bMsg").inner_text())
        print("mail btn:",await pg.locator("#bMail").count())
        await pg.screenshot(path="test/mei/f-bilan.png",full_page=True)
        await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path="test/mei/f-show.png"); await pg.locator("#ovClose").click()
        await pg.reload(); await pg.wait_for_timeout(300); print("après rechargement:",(await pg.locator(".score-big").inner_text()))
        print("errors:",errs)
        await b.close()
asyncio.run(main())
