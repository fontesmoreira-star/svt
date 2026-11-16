import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch2-transmission/multiplication-cellulaire.html"
G={"p1":["a1","a2"],"p2":["b1","b2","b3"],"p3":["c1","c2"],"p4":["d1","d2","d3"]}
OK={"r0":["46","A.D.N.","c0"],"a1":["2","4","c1","4"],"a2":["s0.38","s0.5","s0.61","s0.73"],"b1":["O012345"],"b2":["r20314","c3"],"b3":["anaphase","profase","Télophase","metaphase"],
"c1":["r010","8","14 h"],"c2":["c0","c1","c1"],"d1":["r0111"],"d2":["simples","duplication","doubles","deux","simples","identiques"],"d3":["46","92","8"]}
BAD={"a1":["1","8","c0","8"],"a2":["s0.5","s0.44","s0.2","s0.9"],"b1":["O543210"],"b2":["r02314","c0"],"b3":["prophase","anaphase","mitose","télophase"],
"c1":["r101","20","22"],"c2":["c1","c0","c0"],"d1":["r1202"],"d2":["doubles","mitose","simples","4","doubles","différents"],"d3":["23","46","6"]}
async def fill(pg,vals):
    for k,v in enumerate(vals):
        part=pg.locator(f'.part[data-k="{k}"]')
        if v[0]=="c" and len(v)==2: await part.locator(f'.opt[data-j="{v[1]}"]').click()
        elif v[0]=="r" and v[1:].isdigit():
            for i,j in enumerate(v[1:]): await part.locator(f'[data-i="{i}"][data-j="{j}"]').click()
        elif v[0]=="O":
            await part.locator("[data-clear]").click()
            for j in v[1:]: await part.locator(f'.order-item[data-j="{j}"]').click()
        elif v[0]=="s" and v[1]=="0":
            await pg.evaluate("""t=>{const s=document.querySelector('#wz [data-sl]');s.value=t;s.dispatchEvent(new Event('input'))}""",float(v[1:]))
            await part.locator("[data-shot]").click()
        else: await part.locator("input").fill(v)
async def one(pg,iid,first_ok=False):
    await pg.locator("[data-check]").click(); t=await pg.locator(".gfb").inner_text(); assert "Complète" in t,(iid,t)
    for _ in range(3): await pg.locator("[data-hint]").click()
    assert await pg.locator(".hz .hint").count()==3
    if not first_ok:
        await fill(pg,BAD[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
        print(iid,"BAD →",[m[:110] for m in await pg.locator(".pfb.bad").all_inner_texts()])
        assert await pg.locator(".corr").count()==0 and await pg.locator(".unlockz").count()==0 and await pg.locator(".recop").count()==0, iid
        if iid=="a2": await pg.locator(".parts").screenshot(path="test/m/f-a2-bad.png")
        await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100); assert await pg.locator(".corr").count()==1, iid
    await fill(pg,OK[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(250)
    assert not await pg.locator(".pfb.bad").count(), (iid, await pg.locator(".pfb.bad").all_inner_texts())
    print(iid,"OK →",(await pg.locator(".gfb").inner_text()).replace("\n"," | ")[:90],[m for m in await pg.locator(".pfb").all_inner_texts() if "Orthographe" in m])
    if await pg.locator(".unlockz").count(): print("   unlock:",(await pg.locator(".unl .dh").inner_text()).replace("\n"," "))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":820,"height":1180},device_scale_factor=1,accept_downloads=True)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(200); await one(pg,"r0",True)
        await pg.goto(URL+"#bilan"); await pg.wait_for_timeout(200); assert await pg.locator(".recop").count()==0; print("bilan verrouillé:",await pg.locator(".locked").inner_text())
        for g,items in G.items():
            await pg.locator(f'#tabs [data-v="{g}"]').click()
            for i,iid in enumerate(items):
                await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
                await one(pg,iid, iid in ("b1",))
                for run in await pg.locator('.animctl [data-a="run"]').all(): await run.click()
                await pg.wait_for_timeout(2500); await pg.screenshot(path=f"test/m/f-{iid}-mid.png",full_page=True)
                if iid in ("a2","c2","c1"): await pg.wait_for_timeout(9000); await pg.screenshot(path=f"test/m/f-{iid}.png",full_page=True)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); assert await pg.locator(".recop").count()==1
        await pg.locator("#eleve").fill("Élève Test")
        async with pg.expect_download() as d: await pg.locator("#bDl").click()
        dl=await d.value; await dl.save_as("test/m/bilan.txt"); print("download:",dl.suggested_filename)
        await pg.screenshot(path="test/m/f-bilan.png",full_page=True)
        await pg.locator("#bShow").click(); await pg.wait_for_timeout(200); await pg.screenshot(path="test/m/f-show.png"); await pg.locator("#ovClose").click()
        print("errors:",errs); await b.close()
asyncio.run(main())
