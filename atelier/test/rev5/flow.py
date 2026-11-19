import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/5e/mission-5/revision-mission-5.html"
D="test/rev5/"
G={"p1":["a1","a2","a3","a4"],"p2":["b1","b2","b3","b4"],"p3":["c1","c2","c3"],"p4":["d1","d2","d3"],"p5":["e1","e2"],"p6":["f1"]}
OK={"a1":["T","r0123","m012","accélération"],"a2":["T","r110","r001","8"],"a3":["r0012","O","c0"],"a4":["5,4","1,9","3,5","c0"],
    "b1":["T","r011","c2","referentiel"],"b2":["O","m012","c0"],"b3":["T","36","12","3","10,8 km/h"],"b4":["30","79","20","500"],
    "c1":["T","r210","c0"],"c2":["r120","r21","c0"],"c3":["r0121","10","c0","c0"],"d1":["c0","r01212"],"d2":["c0","M012345"],"d3":["r01","c0"],
    "e1":["T","r3012","c0","29,5"],"e2":["c0","c0","c0"],"f1":["c0","c0","r01","2","c1","c0"]}
BAD={"a1":["T","r1032","m013","vitesse"],"a2":["T","r001","r110","32"],"a3":["r1102","Orev","c1"],"a4":["5","10","7,3","c1"],
    "b1":["T","r100","c0","repère"],"b2":["Orev","m013","c1"],"b3":["T","30","10","432","0,83"],"b4":["270","0,79","259,2","0,002"],
    "c1":["T","r012","c1"],"c2":["r012","r12","c1"],"c3":["r1210","0","c1","c1"],"d1":["c1","r21012"],"d2":["c1","M102345"],"d3":["r10","c1"],
    "e1":["T","r0123","c1","365"],"e2":["c1","c1","c1"],"f1":["c1","c1","r10","125","c0","c1"]}
async def task(pg,iid):
    w=pg.locator("#wz")
    if iid=="a1":
        for g in range(1,7): await w.locator(f'[data-gv="{g}"]').click()
        await w.screenshot(path=D+"f-centri6.png")
    if iid=="a2":
        await w.locator('[data-sy="in"]').click(); await w.locator('[data-sy="out"]').click()
    if iid=="b1":
        await w.locator('[data-a="run"]').click(); await pg.wait_for_timeout(3500); await w.screenshot(path=D+"f-refer-sol.png"); await pg.wait_for_timeout(4000)
        await w.locator('[data-vw="fus"]').click(); await w.locator('[data-a="run"]').click(); await pg.wait_for_timeout(3500); await w.screenshot(path=D+"f-refer-fus.png"); await pg.wait_for_timeout(4000)
    if iid=="b3":
        await w.locator('[data-a="run"]').click(); await pg.wait_for_timeout(12500); await w.screenshot(path=D+"f-radar.png")
    if iid=="c1":
        await w.locator('[data-a="run"]').click(); await pg.wait_for_timeout(6500); await w.screenshot(path=D+"f-traces.png")
    if iid=="e1":
        for n in [1,2,3,4]:
            await w.locator(f'[data-lp="{n}"]').click(); await w.screenshot(path=D+f"f-lune-{n}.png")
async def fill(pg,iid,vals):
    for k,v in enumerate(vals):
        part=pg.locator(f'.part[data-k="{k}"]')
        if v=="T": continue
        if v in ("O","Orev"):
            await part.locator("[data-clear]").click()
            n=await part.locator(".order-item").count()
            seq=list(range(n)) if v=="O" else list(range(n))[::-1]
            for j in seq: await part.locator(f'.order-item[data-j="{j}"]').click()
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
        await fill(pg,"r0",["c0","c0","c0"]); await pg.locator("#item [data-check]").click(); print("rappel:",(await pg.locator("#item .gfb").inner_text())[:60])
        for g,items in G.items():
            await pg.locator(f'#tabs [data-v="{g}"]').click()
            for i,iid in enumerate(items):
                await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
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
                await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
                assert await pg.locator(".corr").count()==1, iid+" corr absent au 2e essai"
                if iid=="a3": await pg.screenshot(path=D+f"f-{iid}-bad.png",full_page=True)
                await fill(pg,iid,OK[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(250)
                assert not await pg.locator(".pfb.bad").count(), (iid, await pg.locator(".pfb.bad").all_inner_texts())
                print(iid,"OK →",(await pg.locator(".gfb").inner_text()).replace("\n"," | ")[:90])
                if iid in ("a3","c3","d2","f1"): await pg.screenshot(path=D+f"f-{iid}-ok.png",full_page=True)
            print(g,"foot:",(await pg.locator("#gfoot").inner_text()).replace("\n"," ")[:90])
        await pg.locator('#tabs [data-v="accueil"]').click(); await pg.wait_for_timeout(200)
        pu=pg.locator('[data-w="pupitre"]')
        await pu.locator("input").fill("12345"); await pu.locator("[data-launch]").click(); print("code faux:",await pu.locator(".pfb").inner_text())
        await pu.locator("input").fill("73915"); await pu.locator("[data-launch]").click(); await pg.wait_for_timeout(2000); await pu.screenshot(path=D+"f-launch-mid.png"); await pg.wait_for_timeout(4500)
        print("code juste:",await pu.locator(".pfb").inner_text()); await pu.screenshot(path=D+"f-launch.png")
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(300)
        await pg.screenshot(path=D+"f-bilan.png",full_page=True)
        txt=await pg.evaluate("bilanText('Test')"); open(D+"bilan.txt","w").write(txt); print(txt[-900:])
        await pg.reload(); await pg.wait_for_timeout(300); print("reload view:",await pg.evaluate("S.view"), "launched:",await pg.evaluate("S.x.launched"))
        print("errors:",errs)
        await b.close()
asyncio.run(main())
