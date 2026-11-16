import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/5e/mission-4/revision-mission-4.html"
D="test/m4b/"
G={"p1":["a1","a2","a3"],"p2":["b1","b2"],"p3":["c1","c2","c3","c4"],"p4":["d1"]}
OK={"a1":["r012","M012"],"a2":["M0123","r0101"],"a3":["c0","c0","c0","c0"],"b1":["0","4","r012","solidification"],"b2":["c0","P","c0","r012"],
    "c1":["T","r012","c0"],"c2":["8","64","c0","c0"],"c3":["M01234","c0"],"c4":["T","m02","c0","c0"],"d1":["c0","liquéfaction","32","c0"]}
BAD={"a1":["r210","M120"],"a2":["M1032","r1010"],"a3":["c1","c1","c1","c2"],"b1":["-5","5","r000","fusion"],"b2":["c1","Q","c1","r210"],
     "c1":["T","r210","c1"],"c2":["3","16","c1","c1"],"c3":["M10234","c1"],"c4":["T","m01","c1","c1"],"d1":["c1","vaporisation","5","c1"]}
FUSY=[-15,-10,-5,0,0,0,0,5,10,15]
async def task(pg,iid):
    if iid=="c1":
        for sl,f in [("yaourt",58),("levure",41),("pain",70)]:
            await pg.locator(f'#wz [data-sl="{sl}"]').click(); await pg.locator('#wz [data-z="400"]').click()
            await pg.locator("#wz [data-f]").evaluate(f"(e)=>{{e.value={f};e.dispatchEvent(new Event('input'))}}"); await pg.wait_for_timeout(150)
            if sl=="pain": await pg.locator("#wz").screenshot(path=D+"f-micro-pain400.png")
    if iid=="c4":
        for k in ["poulet","yaourt","mayo","confiture","jus","pain"]: await pg.locator(f'#wz [data-pi="{k}"]').click()
async def fill(pg,iid,vals):
    for k,v in enumerate(vals):
        part=pg.locator(f'.part[data-k="{k}"]')
        if v=="T": continue
        if v in ("P","Q"):
            await part.locator(".plotz .figbox").evaluate("e=>e.scrollIntoView({block:'center'})"); await pg.wait_for_timeout(150)
            box=await part.locator(".plotz .figbox svg").bounding_box()
            F=await pg.evaluate("parseFloat(getComputedStyle(document.documentElement).fontSize)")
            L,R,T,B=F*3,F*0.9,F*1.3,F*3
            if await part.locator("[data-clear]").count(): await part.locator("[data-clear]").click()
            pw=box["width"]-L-R; ph=box["height"]-T-B
            for i,y in enumerate(FUSY):
                yy = y if v=="P" else (y+5 if i%2 else y)
                await pg.mouse.click(box["x"]+L+i/9*pw, box["y"]+T+(20-yy)/40*ph)
        elif v[0]=="M":
            for i in range(len(v)-1):
                if await part.locator(f'[data-mi="{i}"] .mv.has').count(): await part.locator(f'[data-mi="{i}"]').click()
            for i,j in enumerate(v[1:]):
                await part.locator(f'[data-mi="{i}"]').click(); await part.locator(f'[data-mj="{j}"]').click()
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
        await pg.screenshot(path=D+"f-accueil.png",full_page=True)
        await fill(pg,"r0",["c3","c0","c0"]); await pg.locator("#item [data-check]").click(); print("rappel:",(await pg.locator("#item .gfb").inner_text())[:60])
        for g,items in G.items():
            await pg.locator(f'#tabs [data-v="{g}"]').click()
            for i,iid in enumerate(items):
                await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
                await pg.locator("[data-check]").click()
                t=await pg.locator(".gfb").inner_text(); assert "Complète" in t or "Place" in t, (iid,t)
                for _ in range(3): await pg.locator("[data-hint]").click()
                assert await pg.locator(".hz .hint").count()==3 and await pg.locator("[data-hint]").count()==0, iid
                await fill(pg,iid,BAD[iid])
                if "T" in OK[iid]:
                    await pg.locator("[data-check]").click(); t=await pg.locator(".gfb").inner_text(); assert "Complète" in t, (iid,"tâche non faite mais validée",t)
                    await task(pg,iid); print(iid,"task:",await pg.locator("[data-task]").inner_text())
                await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                msgs=await pg.locator(".pfb.bad").all_inner_texts()
                print(iid,"BAD →",[m[:120] for m in msgs])
                assert await pg.locator(".corr").count()==0, iid+" corr trop tôt"
                assert await pg.locator(".unlockz").count()==0, iid
                await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                assert await pg.locator(".corr").count()==1, iid+" corr absent au 2e essai"
                await pg.screenshot(path=D+f"f-{iid}-bad.png",full_page=True)
                await fill(pg,iid,OK[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(250)
                assert not await pg.locator(".pfb.bad").count(), (iid, await pg.locator(".pfb.bad").all_inner_texts())
                gf=await pg.locator(".gfb").inner_text()
                print(iid,"OK →",gf.replace("\n"," | ")[:110])
                if await pg.locator(".unlockz").count(): print("   unlock:",(await pg.locator(".unl .dh").inner_text()).replace("\n"," "))
                for run in await pg.locator('.unlockz .animctl [data-a="run"]').all(): await run.click()
                if await pg.locator('.unlockz .animctl').count():
                    for k,tm in enumerate([2500,4000,6000]):
                        await pg.wait_for_timeout(tm); await pg.locator(".unl").screenshot(path=D+f"f-{iid}-unl{k}.png"); print("   ",k,(await pg.locator(".unlockz .readout").first.inner_text())[:120])
                await pg.screenshot(path=D+f"f-{iid}.png",full_page=True)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(300)
        await pg.locator("#eleve").fill("Élève Test")
        async with pg.expect_download() as d: await pg.locator("#bDl").click()
        dl=await d.value; await dl.save_as(D+"bilan.txt"); print("download:",dl.suggested_filename)
        await pg.locator("#bCp").click(); await pg.wait_for_timeout(200); print("copy:",await pg.locator("#bMsg").inner_text())
        await pg.screenshot(path=D+"f-bilan.png",full_page=True)
        await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+"f-show.png"); await pg.locator("#ovClose").click()
        await pg.reload(); await pg.wait_for_timeout(300); print("après rechargement:",(await pg.locator(".score-big").inner_text()))
        print("errors:",errs)
        await b.close()
asyncio.run(main())
