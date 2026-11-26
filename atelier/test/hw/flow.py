import asyncio, sys
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/terminale/theme-3/3-1-biodiversite/modele-hardy-weinberg.html"
D="test/hw/"
W=int(sys.argv[1]) if len(sys.argv)>1 else 820
H=int(sys.argv[2]) if len(sys.argv)>2 else 1180
TAG=sys.argv[3] if len(sys.argv)>3 else ""
G={"p1":["a1","a2"],"p2":["b1","b2","b3"],"p3":["c1","c2","c3"],"p4":["d1","d2","d3"]}
PRE={"b1":0,"b3":0,"c2":0}
J={"sex":"fmt(Math.round(P_SEX10()*100)/100)","both":"fmt(Math.round(P_BOTH10()*100)/100)"}
OKG={"r0":["c0","R010","c0"],"a1":["T","R010","R012","c0"],"a2":["T","0,2","0,4","0,4","50","0,4","0,6"],
 "b1":["T","40","60","0,16","0,24","0,36","c0"],"b2":["T","0,16","0,48","0,36","1","0,4","c0"],"b3":["T","R0001","R1111","c0","X012"],
 "c1":["T","0,4","0,46","0,69","c0","c0"],"c2":["T","J:sex","c0","J:both","c0","c0"],"c3":["T","R012","c0","c0","MATCH"],
 "d1":["T","0,54","292","497","212","c0"],"d2":["T","0,165","27","276","R020","c0"],"d3":["R100011","c0"]}
BADG={"r0":["c1","R101","c1"],"a1":["T","R101","R210","c1"],"a2":["T","5","10","10","25","0,8","30"],
 "b1":["T","0,4","0,6","0,8","0,48","0,35","c1"],"b2":["T","0,2","0,24","0,4","0,76","0,64","c1"],"b3":["T","R1110","R0000","c1","X34"],
 "c1":["T","0,69","0,4","0,4","c1","c1"],"c2":["T","0,5","c1","0,5","c1","c1"],"c3":["T","R120","c1","c1","MATCHBAD"],
 "d1":["T","1,08","100","248,4","100","c1"],"d2":["T","0,329","100","137,8","R111","c1"],"d3":["R011100","c1"]}
OKL={"r0":["allèles","R010","0,25","0,4"],"a1":["T","M","c0"],"a2":["T","0,2","0,4","0,4","0,4","0,6","M"],
 "b1":["T","40","0,16","0,24","0,36","M"],"b2":["T","0,48","0,4","M","0,42"],"b3":["T","0,25","M","X012"],
 "c1":["T","0,69","0,29","M"],"c2":["T","J:sex","J:both","M"],"c3":["T","R012","M","MATCH"],
 "d1":["T","0,54","292","497","212","M"],"d2":["T","0,165","27","276","M"],"d3":["M","c0"]}
BT="Je pense que cette activité était intéressante mais je ne suis pas vraiment certain de ce que montre ce logiciel sur la tablette, il faudrait demander au professeur ce qu'il en pense un jour car moi je préfère regarder les araignées dans leur jardin tranquillement sans rien calculer du tout ni écrire de longues phrases compliquées pendant le cours de sciences de cet après-midi"
BT=BT+" "+BT
BADL={"r0":["chromosomes","R101","1","2,5"],"a1":["T",BT,"c1"],"a2":["T","5","10","10","0,8","1,2",BT],
 "b1":["T","0,4","0,8","0,48","0,3",BT],"b2":["T","0,24","0,64",BT,"0,21"],"b3":["T","0",BT,"X34"],
 "c1":["T","0,4","-0,29",BT],"c2":["T","0,5","0,5",BT],"c3":["T","R120",BT,"MATCHBAD"],
 "d1":["T","1,08","100","100","100",BT],"d2":["T","0,329","100","100",BT],"d3":[BT,"c1"]}
async def go_sim(pg,w,wait=2300):
    await w.locator("[data-go]").click(); await pg.wait_for_timeout(wait)
async def task(pg,iid):
    w=pg.locator("#wz")
    if iid=="a1":
        idx=await pg.evaluate("[0,1,2].map(g=>POP.indexOf(g))")
        for i in idx: await w.locator(f'.spb[data-i="{i}"]').click(); await pg.wait_for_timeout(120)
        await w.screenshot(path=D+f"w{TAG}-a1.png")
    if iid=="a2":
        await w.locator("[data-sort]").click(); await pg.wait_for_timeout(900)
        await w.locator("[data-pour]").click(); await pg.wait_for_timeout(1000); await w.screenshot(path=D+f"w{TAG}-a2-pour.png"); await pg.wait_for_timeout(1700)
        await w.locator("[data-usort]").click(); await pg.wait_for_timeout(200)
        await w.screenshot(path=D+f"w{TAG}-a2.png")
    if iid=="b1":
        for k in range(5):
            await w.locator("[data-one]").click(); await pg.wait_for_timeout(350)
            if k==0: await w.screenshot(path=D+f"w{TAG}-b1-fly.png")
            await pg.wait_for_timeout(600)
        await w.locator('[data-n="1000"]').click(); await pg.wait_for_timeout(1400)
        await w.screenshot(path=D+f"w{TAG}-b1.png")
    if iid=="b2":
        await w.locator("[data-p40]").click(); await w.locator('[data-pd="0.1"]').click(); await w.locator('[data-pd="0.1"]').click(); await w.locator("[data-p40]").click()
        await w.locator('[data-a="run"]').click(); await pg.wait_for_timeout(1300); await w.screenshot(path=D+f"w{TAG}-b2-mid.png"); await pg.wait_for_timeout(1700)
        await w.screenshot(path=D+f"w{TAG}-b2.png")
    if iid=="b3":
        await w.locator('[data-gk="p1"]').click()
        for _ in range(3): await w.locator("[data-next]").click(); await pg.wait_for_timeout(80)
        await w.locator('[data-tab] td[data-c="B"][data-r="3"]').click()
        await w.screenshot(path=D+f"w{TAG}-b3-p1.png")
        await w.locator('[data-gk="het"]').click(); await w.locator("[data-all]").click(); await pg.wait_for_timeout(2600)
        await w.screenshot(path=D+f"w{TAG}-b3.png")
    if iid=="c1":
        await w.locator('[data-a="run"]').click(); await pg.wait_for_timeout(3400)
        await w.locator("[data-mod]").click(); await pg.wait_for_timeout(150)
        await w.screenshot(path=D+f"w{TAG}-c1.png")
    if iid=="c2":
        await go_sim(pg,w)
        await w.locator('[data-f="sex"][data-v="1"]').click(); await go_sim(pg,w)
        await w.locator('[data-f="pred"][data-v="1"]').click(); await go_sim(pg,w)
        await w.screenshot(path=D+f"w{TAG}-c2.png")
    if iid=="c3":
        await w.locator('[data-sz="n50"]').click()
        for _ in range(3): await go_sim(pg,w)
        await w.locator('[data-sz="n1000"]').click(); await go_sim(pg,w)
        await w.locator('[data-sz="inf"]').click(); await w.locator('[data-f="mig"][data-v="1"]').click(); await go_sim(pg,w)
        await w.locator('[data-f="mig"][data-v="0"]').click(); await w.locator('[data-f="mut"][data-v="1"]').click(); await go_sim(pg,w)
        await w.screenshot(path=D+f"w{TAG}-c3.png")
    if iid in ("d1","d2"):
        k="mn" if iid=="d1" else "hb"
        await w.locator(f"#cv-{k}").fill("0,54" if k=="mn" else "0,165"); await w.locator("[data-go]").click(); await pg.wait_for_timeout(200)
        await w.screenshot(path=D+f"w{TAG}-{iid}.png")
async def fill(pg,iid,vals,root=""):
    for k,v in enumerate(vals):
        part=pg.locator(f'{root} .part[data-k="{k}"]')
        if v=="T": continue
        if v.startswith("J:"): v=await pg.evaluate(J[v[2:]])
        if v=="M": v=await pg.evaluate(f"ITEMS['{iid}'].it.parts[{k}].model")
        if v in ("MATCH","MATCHBAD"):
            n=await part.locator(".mrow").count()
            for i in range(n): await part.locator(f'[data-mi="{i}"]').click()
            for i in range(n):
                await part.locator(f'[data-mi="{i}"]').click()
                j=i if v=="MATCH" else (i+1)%n
                await part.locator(f'[data-mj="{j}"]').click()
            continue
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
    if "T" in OK[iid] and mode=="g": await task(pg,iid)
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
            if iid in ("b3","d3"): await pg.wait_for_timeout(300); await pg.screenshot(path=D+f"f{TAG}-{mode}-{iid}.png",full_page=True)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":W,"height":H},device_scale_factor=1,color_scheme="dark" if W<500 else "light")
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(200)
        miss=await pg.evaluate("""Object.entries(EXPERT).flatMap(([id,L])=>L.parts.map((p,k)=>p.t==='redac'?[id,k,checkPart(p,p.model).hits.map((h,i)=>h?null:p.crit[i].lab).filter(Boolean)]:null).filter(Boolean)).filter(x=>x[2].length)""")
        print("modèles incomplets :",miss)
        bt=await pg.evaluate("""(t=>Object.entries(EXPERT).flatMap(([id,L])=>L.parts.map((p,k)=>p.t==='redac'?[id,k,checkPart(p,t).hits.filter(Boolean).length+'/'+p.crit.length]:null).filter(Boolean)))("""+repr(BT)+")")
        print("texte hors sujet :",bt)
        await run(pg,"g",OKG,BADG)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+f"f{TAG}-bilan-g.png",full_page=True)
        await pg.goto(URL+"?version=exigeante#accueil"); await pg.wait_for_timeout(300)
        await run(pg,"l",OKL,BADL)
        await pg.reload(); await pg.wait_for_timeout(300)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+f"f{TAG}-bilan-l.png",full_page=True)
        ov=await pg.evaluate("document.documentElement.scrollWidth-window.innerWidth"); print("overflow bilan:",ov)
        txt=await pg.evaluate("bilanText('Test')"); open(D+f"bilan{TAG}-l.txt","w").write(txt); print(txt[:900]); print("…"); print(txt[-1500:])
        print("errors:",errs)
        await b.close()
asyncio.run(main())
