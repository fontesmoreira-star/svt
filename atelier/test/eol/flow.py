import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/5e/mission-6/energie-eolienne/eolienne-sur-mars.html"
D="test/eol/"
G={"p1":["a1"],"p2":["b1"],"p3":["c1"],"p4":["d1"]}
OKG={"a1":["T","M01234","4","c0","c0"],"b1":["T","c0","14,4","90","2,8"],"c1":["c0","c0","c0","c0","c0"],"d1":["M012","c0"]}
BADG={"a1":["T","M10234","2","c2","c1"],"b1":["T","c1","1,11","6,94","36"],"c1":["c1","c1","c2","c2","c1"],"d1":["M102","c1"]}
OKL={"a1":["T","4","mecanique","Au-delà de 25 m/s le vent est trop fort, il abîmerait le rotor, donc l'éolienne freine et s'arrête."],"b1":["T","14.4","2,77","44"],
     "c1":["160","10","Le vent est ressenti comme une brise de moins de 10 km/h car l'atmosphère de Mars est très peu épaisse donc l'air pousse très peu.","c0"],
     "d1":["J'observe que les vents de Mars, même à 160 km/h, sont ressentis comme un vent de moins de 10 km/h sur Terre, soit 2,8 m/s. Or une éolienne ne produit de l'électricité qu'à partir de 4 m/s. Donc le vent martien est trop faible et on ne peut pas produire d'électricité avec une éolienne sur Mars."]}
BADL={"a1":["T","12","électrique","Elle s'arrête parce que le vent est trop fort pour elle, voilà ce que je pense vraiment."],"b1":["T","1,11","36","576"],
     "c1":["90","160","Parce que Matt Damon est vraiment beaucoup trop lourd pour être emporté par le vent de cette grande tempête martienne de sable.","c1"],
     "d1":["Je pense que c'est possible car il y a beaucoup de vent sur Mars pendant les tempêtes de sable, les éoliennes vont bien tourner et faire de l'électricité pour la base martienne, et en plus le vent souffle très fort à 160 km/h donc tout va bien."]}
async def task(pg,iid):
    w=pg.locator("#wz")
    if iid=="a1":
        for v in [1,3,8,15,28]: await w.locator(f'[data-vv="{v}"]').click(); await pg.wait_for_timeout(120)
        await w.locator('[data-vv="8"]').click(); await pg.wait_for_timeout(300); await w.screenshot(path=D+"f-souffle8.png")
        await w.locator('[data-vv="28"]').click(); await pg.wait_for_timeout(300); await w.screenshot(path=D+"f-souffle28.png")
    if iid=="b1":
        await w.locator("[data-e]").evaluate("e=>{e.value=4;e.dispatchEvent(new Event('input'))}"); await pg.wait_for_timeout(100); await w.screenshot(path=D+"f-echelle.png")
async def fill(pg,iid,vals):
    for k,v in enumerate(vals):
        part=pg.locator(f'.part[data-k="{k}"]')
        if v=="T": continue
        if v[0]=="M" and v[1:].isdigit():
            for i in range(len(v)-1):
                if await part.locator(f'[data-mi="{i}"] .mv.has').count(): await part.locator(f'[data-mi="{i}"]').click()
            for i,j in enumerate(v[1:]):
                await part.locator(f'[data-mi="{i}"]').click(); await part.locator(f'[data-mj="{j}"]').click()
        elif v[0]=="c" and v[1:].isdigit() and len(v)==2: await part.locator(f'.opt[data-j="{v[1]}"]').click()
        elif await part.locator("textarea").count(): await part.locator("textarea").fill(v)
        else: await part.locator("input").fill(v)
async def run(pg,mode,OK,BAD):
    for g,items in G.items():
        await pg.locator(f'#tabs [data-v="{g}"]').click()
        for i,iid in enumerate(items):
            await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
            await pg.locator("[data-check]").click()
            t=await pg.locator(".gfb").inner_text(); assert "Complète" in t or "trop courte" in t or "manquante" in t, (mode,iid,t)
            for _ in range(3): await pg.locator("[data-hint]").click()
            await fill(pg,iid,BAD[iid])
            if "T" in OK[iid] and mode=="g":
                await pg.locator("[data-check]").click(); t=await pg.locator(".gfb").inner_text(); assert "Complète" in t, (iid,"tâche",t)
                await task(pg,iid)
            await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
            print(mode,iid,"BAD →",[m[:100] for m in await pg.locator(".pfb.bad,.pfb.mid").all_inner_texts()])
            assert await pg.locator(".corr").count()==0, iid+" corr trop tôt"
            await pg.locator("[data-check]").click(); await pg.wait_for_timeout(100)
            assert await pg.locator(".corr").count()==1, iid+" corr absent"
            await fill(pg,iid,OK[iid]); await pg.locator("[data-check]").click(); await pg.wait_for_timeout(250)
            bad=await pg.locator(".pfb.bad,.pfb.mid").all_inner_texts()
            print(mode,iid,"OK →",(await pg.locator(".gfb").inner_text()).replace("\n"," | ")[:80], bad)
            if iid=="d1": await pg.screenshot(path=D+f"f-{mode}-d1.png",full_page=True)
            if iid=="c1" and mode=="g": await pg.locator("#wz").screenshot(path=D+"f-deuxvents.png")
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":820,"height":1180},device_scale_factor=1)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(200)
        await run(pg,"g",OKG,BADG)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+"f-bilan-g.png",full_page=True)
        print("PARA g:", await pg.evaluate("myPara()"))
        await pg.goto(URL+"?version=experte#accueil"); await pg.wait_for_timeout(300)
        await run(pg,"l",OKL,BADL)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+"f-bilan-l.png",full_page=True)
        txt=await pg.evaluate("bilanText('Test')"); open(D+"bilan-l.txt","w").write(txt); print(txt[-1500:])
        print("errors:",errs)
        await b.close()
asyncio.run(main())
