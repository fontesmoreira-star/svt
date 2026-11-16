import asyncio, sys, json
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/5e/mission-4/revision-mission-4.html"
G={"p1":["a1","a2"],"p2":["b1","b2","b3"],"p3":["c1","c2"],"p4":["d2"]}
SOLY=[20,10,5,0,0,0,0,-5,-10]
OK={"a1":["r0321","r011"],"a2":["250 g","c1","c1"],"b1":["P","c0"],"b2":["r012","pallier","0"],"b3":["ebullition","constante","c0","c1"],"c1":["r0101","8","64"],"c2":["m0123","r0111","c0"],"d2":["0","c0","3","10","200"]}
BAD={"a1":["r1230","r100"],"a2":["240","c0","c0"],"b1":["Q","c1"],"b2":["r210","courbe","100"],"b3":["fusion","variable","c1","c0"],"c1":["r1010","6","16"],"c2":["m045","r1000","c1"],"d2":["100","c1","4","500","100"]}
PRE={"a2":0}
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
        elif v in ("P","Q"):
            await part.locator(".plotz .figbox").evaluate("e=>e.scrollIntoView({block:'center'})"); await pg.wait_for_timeout(150); box=await part.locator(".plotz .figbox svg").bounding_box(); geo=await pg.evaluate("(()=>{const F=parseFloat(getComputedStyle(document.documentElement).fontSize);return {L:F*3,R:F*0.9,T:F*1.3,B:F*3}})()")
            pw=box["width"]-geo["L"]-geo["R"]; ph=box["height"]-geo["T"]-geo["B"]
            for i,y in enumerate(SOLY):
                yy = y if v=="P" else (y+5 if i%2 else y)
                await pg.mouse.click(box["x"]+geo["L"]+i/8*pw, box["y"]+geo["T"]+(25-yy)/40*ph)
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
        await pg.locator('#item .part[data-k="0"] .opt[data-j="1"]').click(); await pg.locator('#item .part[data-k="1"] .opt[data-j="1"]').click(); await pg.locator("#item [data-check]").click(); print("rappel:",(await pg.locator("#item .gfb").inner_text())[:40])
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
                bad_first = True   # deux étapes réussies au premier essai
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
                await pg.screenshot(path=f"test/m4/f-{iid}-mid.png",full_page=True)
                if await pg.locator('.animctl [data-a="run"]').count(): await pg.wait_for_timeout(8500)
                await pg.screenshot(path=f"test/m4/f-{iid}.png",full_page=True)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200)
        await pg.locator("#eleve").fill("Élève Test")
        async with pg.expect_download() as d: await pg.locator("#bDl").click()
        dl=await d.value; await dl.save_as("test/m4/bilan.txt"); print("download:",dl.suggested_filename)
        await pg.locator("#bCp").click(); await pg.wait_for_timeout(200); print("copy:",await pg.locator("#bMsg").inner_text())
        print("mail btn:",await pg.locator("#bMail").count())
        await pg.screenshot(path="test/m4/f-bilan.png",full_page=True)
        await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path="test/m4/f-show.png"); await pg.locator("#ovClose").click()
        print("errors:",errs)
        await b.close()
asyncio.run(main())
