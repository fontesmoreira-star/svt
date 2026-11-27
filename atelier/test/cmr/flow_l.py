import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/terminale/theme-3/3-1-biodiversite/methode-capture-marquage-recapture.html"
D="test/cmr/"
TM="l"
G={"p1":["a1","a2"],"p2":["b1","b2","b3"],"p3":["c1","c2","c3","c4"],"p4":["d1","d2","d3","d4"]}
PRE={"b3":2,"c1":0,"c2":1,"c3":0}
J={"last":"fmt(errOf(lastEst()),1)","max":"fmt(Math.max(...shownStd().map(r=>r.err)),1)","big":"fmt(errMean(bigStd()),1)","defi":"fmt(defi()[defi().length-1].err,1)",
   "w50":"fmt(stat(50).within,1)","w200":"fmt(stat(200).within,1)","c200":"fmt(stat(200).cont,1)","imp50":"String(stat(50).imp)","wid300":"String(Math.round(stat(300).wid))",
   "prop":"fmt(lastEst().mb/lastEst().n2*100,1)","mean":"fmt(errMean(shownStd()),1)"}
OKG={"r0":["c0","c0","c0"],"a1":["T","6","10","2","c0","c0"],"a2":["T","c0","30","c0","250"],"b1":["T","J:last","c0","R00012"],"b2":["T","J:max","c0","c0"],"b3":["T","J:big","X01","c0"],
     "c1":["T","c0","R22","c0","c0"],"c2":["T","R021","c0","c0"],"c3":["T","R22","c0","X01"],"c4":["T","J:defi","X0123"],
     "d1":["T","J:w50","J:w200","c0","c0"],"d2":["T","c0","0,2","0,082","0,12","0,28","c0"],"d3":["T","J:c200","c0","c0","c0"],"d4":["R010101","c0"]}
BADG={"r0":["c1","c2","c1"],"a1":["T","5","9","6","c1","c1"],"a2":["T","c1","3,3","c1","6,4"],"b1":["T","999","c1","R11111"],"b2":["T","999","c1","c1"],"b3":["T","999","X23","c1"],
     "c1":["T","c1","R00","c1","c1"],"c2":["T","R000","c1","c1"],"c3":["T","R00","c1","X23"],"c4":["T","999","X45"],
     "d1":["T","999","999","c1","c1"],"d2":["T","c1","20","12,25","0,28","0,12","c1"],"d3":["T","999","c1","c1","c1"],"d4":["R101010","c1"]}
OKL={"r0":["abondance","25","20"],"a1":["T","6","10","2","20","M"],"a2":["T","M","30","250","16"],"b1":["T","J:last","J:prop","M"],"b2":["T","J:max","J:mean","M"],"b3":["T","J:big","X01","M"],
     "c1":["T","R22","M","c0"],"c2":["T","R021","M","c0"],"c3":["T","R22","M","X01"],"c4":["T","J:defi","M"],
     "d1":["T","J:w50","J:w200","J:imp50","M"],"d2":["T","400","0,2","0,082","0,12","0,28","427","1000","c0"],"d3":["T","J:c200","J:wid300","M","c0"],"d4":["M","c0"]}
BT="Je pense que cette activité était intéressante mais je ne suis pas vraiment certain de ce que montre ce logiciel sur la tablette, il faudrait demander au professeur ce qu'il en pense un jour car moi je préfère regarder les poissons nager dans leur bassin tranquillement sans rien calculer du tout ni écrire de longues phrases compliquées pendant le cours de sciences de cet après-midi"
BT=BT+" "+BT
BADL={"r0":["richesse","4","2,81"],"a1":["T","5","9","6","60",BT],"a2":["T",BT,"3","6,4","80"],"b1":["T","999","999",BT],"b2":["T","999","999",BT],"b3":["T","999","X23",BT],
     "c1":["T","R00",BT,"c1"],"c2":["T","R000",BT,"c1"],"c3":["T","R00",BT,"X23"],"c4":["T","999",BT],
     "d1":["T","999","999","999",BT],"d2":["T","100","20","12,25","0,28","0,12","1000","427","c1"],"d3":["T","999","9999",BT,"c1"],"d4":[BT,"c1"]}

async def act_loop(pg):
    w=pg.locator("#wz")
    for _ in range(30):
        a=w.locator("[data-act]")
        if await a.is_hidden():
            ex=await pg.evaluate("LAB.cap.n*LAB.cfg.n2/(LAB.rec.reduce((s,r)=>s+r.m,0)/LAB.rec.length)")
            await w.locator("#estIn").fill(str(round(ex)).replace(".",",")); await w.locator("[data-est]").click(); await pg.wait_for_timeout(80); continue
        t=await a.inner_text()
        if "Nouvelle" in t: return
        await a.click(); await pg.wait_for_timeout(1900 if ("Attendre" in t or "Relâcher" in t) else 1150)
async def lab(pg,n1=50,n2=50,k=1,cond=None,until=None):
    w=pg.locator("#wz")
    for attempt in range(6):
        if "Nouvelle" in await w.locator("[data-act]").inner_text(): await w.locator("[data-act]").click(); await pg.wait_for_timeout(150)
        for key,v in (("n1",n1),("n2",n2)): await w.locator(f'[data-nr="{key}"]').evaluate(f"e=>{{e.value={v};e.dispatchEvent(new Event('input'))}}")
        await w.locator(f'[data-kk="{k}"]').click()
        if cond:
            if not await w.locator("[data-cond]").evaluate("d=>d.open"): await w.locator("[data-cond] summary").click()
            for key,v in cond.items(): await w.locator(f'[data-s="{key}"][data-v="{v}"]').click()
        await act_loop(pg)
        if cond:
            await w.locator("[data-act]").click(); await pg.wait_for_timeout(150)
            if await w.locator("[data-ideal]").is_enabled(): await w.locator("[data-ideal]").click()
        if until is None or await pg.evaluate(until): return
    raise Exception("lab: condition non atteinte "+str(until))
async def task(pg,iid):
    w=pg.locator("#wz")
    if iid=="a1":
        for _ in range(4):
            await w.locator("[data-act]").click(); await pg.wait_for_timeout(2500)
        await w.screenshot(path=D+"f-a1.png")
    if iid=="a2": await w.locator("[data-br]").evaluate("e=>{e.value=30;e.dispatchEvent(new Event('input'))}")
    if iid=="b1": await lab(pg,50,50,1,until="T_1().ok"); await w.screenshot(path=D+"f-b1.png")
    if iid=="b2":
        await lab(pg,50,50,1); await lab(pg,50,50,1,until="T_3().ok")
    if iid=="b3":
        await lab(pg,150,150,1); await lab(pg,200,200,1,until="big2()>=2"); await lab(pg,100,100,3,until="multi1()>=1"); await w.screenshot(path=D+"f-b3.png")
    if iid=="c1":
        await lab(pg,150,150,1,{"lose":"t"}); await lab(pg,150,150,1,{"eff":"pred"})
    if iid=="c2":
        await lab(pg,150,150,1,{"w":"h","pl":"same"},until="hasRun(r=>r.w==='h'&&r.pl==='near')")
        await lab(pg,150,150,1,{"w":"h","pl":"far"},until="hasRun(r=>r.w==='h'&&r.pl==='far')")
    if iid=="c3":
        await lab(pg,150,150,1,{"birth":"t"}); await lab(pg,150,150,1,{"eff":"shy"})
    if iid=="c4": await lab(pg,200,200,3,until="T_C4().ok"); await w.screenshot(path=D+"f-c4.png")
    if iid=="d1":
        for n in ["50","200"]:
            await w.locator(f'[data-fn="{n}"]').click(); await w.locator("[data-go]").click(); await pg.wait_for_timeout(1700)
        await w.screenshot(path=D+"f-d1.png")
    if iid=="d2":
        for n in ["100","400","25"]: await w.locator(f'[data-rn="{n}"]').click(); await pg.wait_for_timeout(100)
        await w.screenshot(path=D+"f-d2.png")
    if iid=="d3":
        await w.locator('[data-fn="300"]').click(); await w.locator("[data-go]").click(); await pg.wait_for_timeout(1700)
        for n in ["50","200","300"]: await w.locator(f'[data-fs="{n}"]').click(); await pg.wait_for_timeout(100)
        await w.screenshot(path=D+"f-d3.png")
async def fill(pg,iid,vals,root=""):
    for k,v in enumerate(vals):
        part=pg.locator(f'{root} .part[data-k="{k}"]')
        if v=="T": continue
        if v.startswith("J:"): v=await pg.evaluate(J[v[2:]])
        if v=="M": v=await pg.evaluate(f"ITEMS['{iid}'].it.parts[{k}].model")
        if v[0]=="R" and v[1:].isdigit():
            for i,j in enumerate(v[1:]): await part.locator(f'.seg button[data-i="{i}"][data-j="{j}"]').click()
        elif v[0]=="X" and v[1:].isdigit():
            n=await part.locator('.opt').count()
            for j in range(n):
                if await part.locator(f'.opt[data-j="{j}"][aria-pressed="true"]').count(): await part.locator(f'.opt[data-j="{j}"]').click()
            for j in v[1:]: await part.locator(f'.opt[data-j="{j}"]').click()
        elif v[0]=="c" and v[1:].isdigit() and len(v)==2: await part.locator(f'.opt[data-j="{v[1]}"]').click()
        elif await part.locator("textarea").count(): await part.locator("textarea").fill(v)
        else: await part.locator("input").fill(v)
async def check_item(pg,mode,iid,OK,BAD,root=""):
    if iid in PRE: await pg.locator(f'{root} [data-h="{PRE[iid]}"]').click(); await pg.wait_for_timeout(150)
    await pg.locator(f"{root} [data-check]").click()
    t=await pg.locator(f"{root} .gfb").inner_text(); assert "Complète" in t, (mode,iid,t)
    for _ in range(3): await pg.locator(f"{root} [data-hint]").click()
    if "T" in OK[iid] and mode==TM: await task(pg,iid)
    await fill(pg,iid,BAD[iid],root)
    await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(100)
    print(mode,iid,"BAD →",(await pg.locator(f"{root} .gfb").inner_text()).replace("\n"," | ")[:70])
    assert await pg.locator(f"{root} .corr").count()==0, iid+" corr trop tôt"
    await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(100)
    assert await pg.locator(f"{root} .corr").count()==1, iid+" corr absent"
    await fill(pg,iid,OK[iid],root); await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(250)
    bad=await pg.locator(f"{root} .pfb.bad,{root} .pfb.mid").all_inner_texts()
    g=(await pg.locator(f"{root} .gfb").inner_text()).replace("\n"," | ")[:60]
    print(mode,iid,"OK →",g,bad); assert "Tout est juste" in g, (mode,iid,bad)
async def run(pg,mode,OK,BAD):
    await pg.locator('#tabs [data-v="accueil"]').click(); await pg.wait_for_timeout(150)
    await check_item(pg,mode,"r0",OK,BAD,"#item")
    for g,items in G.items():
        await pg.locator(f'#tabs [data-v="{g}"]').click()
        for i,iid in enumerate(items):
            await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(200)
            await check_item(pg,mode,iid,OK,BAD)
            if iid=="a2": await pg.wait_for_timeout(200); await pg.screenshot(path=D+f"f-{mode}-a2.png",full_page=True)
            if iid=="d4": await pg.wait_for_timeout(300); await pg.screenshot(path=D+f"f-{mode}-d4.png",full_page=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":820,"height":1180},device_scale_factor=1)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"?version=exigeante#accueil"); await pg.wait_for_timeout(300)
        print("stockage vide :", await pg.evaluate("JSON.stringify(S.it)"), await pg.evaluate("JSON.stringify(S.itL)"))
        await run(pg,"l",OKL,BADL)
        await pg.reload(); await pg.wait_for_timeout(300)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(300)
        await pg.screenshot(path=D+"x-bilan-l.png",full_page=True)
        print("bilan à recopier :", "OUVERT" if await pg.locator(".recop").count() else "VERROUILLÉ", "·", (await pg.locator("#main").inner_text())[:400].replace("\n"," | "))
        print("version guidée vide :", await pg.evaluate("Object.keys(S.it).length"), "étapes")
        print("errors:",errs)
        await b.close()
asyncio.run(main())
