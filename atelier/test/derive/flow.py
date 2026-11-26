# Parcours complet générique : les réponses justes sont tirées des données de l'app (choix, nombres, modèles rédigés)
import asyncio, sys, json
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/2nde/theme-1/forces-evolutives/derive-genetique.html"
D="test/derive/"
FAST="""(()=>{let T=0;window.requestAnimationFrame=cb=>setTimeout(()=>{T+=100;cb(T)},16);window.cancelAnimationFrame=id=>clearTimeout(id);})()"""
G={"p1":["a1"],"p2":["b1","b2","b3"]}
BADTXT="Je pense que c'est comme ça parce que c'est logique et que tout le monde le sait bien, il suffit de regarder un peu pour voir ce qui se passe vraiment dans la vie de tous les jours à la maison."
GET="""id=>{const it=ITEMS[id].it;return it.parts.map(p=>{const a=typeof p.ans==='function'?p.ans():p.ans;return {t:p.t,a:p.a,ans:a,rows:p.rows?p.rows.map(r=>r.a):null,n:p.o?p.o.length:(p.choices?p.choices.length:0),model:p.model||null,w:p.ans&&p.ans[0]}})}"""
def fr(x):
    s=("%.12f"%x).rstrip("0").rstrip(".") if abs(x)<1e-3 and x!=0 else repr(round(x,10)).rstrip("0").rstrip(".") if "." in repr(round(x,10)) else str(x)
    return s.replace(".",",")
def ok_vals(P):
    out=[]
    for p in P:
        t=p["t"]
        if t=="task": out.append(("T",None))
        elif t=="choice": out.append(("c",p["a"]))
        elif t=="multi": out.append(("x",p["a"]))
        elif t=="rows": out.append(("r",p["rows"]))
        elif t=="match": out.append(("m",list(range(len(p["rows"] or [])) ) if p["rows"] else None))
        elif t=="num": out.append(("i",fr(p["ans"]) if p.get("ans") is not None else "0"))
        elif t=="word": out.append(("i",p["w"]))
        elif t=="list": out.append(("i",""))
        elif t=="redac": out.append(("ta",p["model"]))
    return out
def bad_vals(P):
    out=[]
    for p in P:
        t=p["t"]
        if t=="task": out.append(("T",None))
        elif t=="choice": out.append(("c",(p["a"]+1)%p["n"]))
        elif t=="multi": out.append(("x",[j for j in range(p["n"]) if j not in p["a"]][:1]))
        elif t=="rows": out.append(("r",[(a+1)%p["n"] for a in p["rows"]]))
        elif t=="match": k=len(p["rows"]); out.append(("m",[1,0]+list(range(2,k))))
        elif t=="num": out.append(("i",fr((p.get("ans") if p.get("ans") is not None else 99)*10+3)))
        elif t=="word": out.append(("i","xyzzy"))
        elif t=="list": out.append(("i","L, mL"))
        elif t=="redac": out.append(("ta",BADTXT))
    return out
async def go_run(w,sel,ms):
    await w.locator(sel+' [data-a="run"]').click(); await pg_wait(w,ms)
async def pg_wait(w,ms): await w.page.wait_for_timeout(ms)
async def task(pg,iid):
    w=pg.locator("#wz")
    if iid=="a1":
        await w.locator('[data-ug="1"]').click(); await pg.wait_for_timeout(600)
        for _ in range(40):
            if await pg.evaluate("(S.x.ur||{}).nf||0"): break
            await w.locator('[data-ug="10"]').click(); await pg.wait_for_timeout(1900)
        await w.screenshot(path=D+"f-a1.png")
    if iid=="b1":
        await w.locator('[data-run="10"]').click(); await pg.wait_for_timeout(900); await w.screenshot(path=D+"f-b1.png")
    if iid=="b2":
        await w.locator('[data-sz="10000"]').click(); await w.locator('[data-run="10"]').click(); await pg.wait_for_timeout(900); await w.screenshot(path=D+"f-b2.png")
    if iid=="b3":
        for c in ["5","500"]:
            await w.locator(f'[data-gc="{c}"]').click(); await w.locator('.animctl [data-a="run"]').click(); await pg.wait_for_timeout(1500)
        await w.screenshot(path=D+"f-b3.png")
async def fill(pg,vals,root=""):
    for k,(kind,v) in enumerate(vals):
        part=pg.locator(f'{root} .part[data-k="{k}"]')
        if kind=="T": continue
        if kind=="c": await part.locator(f'.opt[data-j="{v}"]').click()
        elif kind=="x":
            n=await part.locator('.opt').count()
            for j in range(n):
                if await part.locator(f'.opt[data-j="{j}"][aria-pressed="true"]').count(): await part.locator(f'.opt[data-j="{j}"]').click()
            for j in v: await part.locator(f'.opt[data-j="{j}"]').click()
        elif kind=="r":
            for i,j in enumerate(v): await part.locator(f'.seg button[data-i="{i}"][data-j="{j}"]').click()
        elif kind=="m":
            for i in range(len(v)):
                if await part.locator(f'[data-mi="{i}"] .mv.has').count(): await part.locator(f'[data-mi="{i}"]').click()
            for i,j in enumerate(v): await part.locator(f'[data-mi="{i}"]').click(); await part.locator(f'[data-mj="{j}"]').click()
        elif kind=="ta": await part.locator("textarea").fill(v)
        else: await part.locator("input").fill(v)
async def check_item(pg,mode,iid,root=""):
    P=await pg.evaluate(GET,iid); OK=ok_vals(P); BAD=bad_vals(P); hasT=any(k=="T" for k,_ in OK)
    await pg.locator(f"{root} [data-check]").click()
    t=await pg.locator(f"{root} .gfb").inner_text(); assert "Complète" in t, (mode,iid,t)
    for _ in range(3):
        if await pg.locator(f"{root} [data-hint]").count(): await pg.locator(f"{root} [data-hint]").click()
    await fill(pg,BAD,root)
    if hasT and mode=="g":
        await pg.locator(f"{root} [data-check]").click(); t=await pg.locator(f"{root} .gfb").inner_text(); assert "Complète" in t, (iid,"tâche",t)
        await task(pg,iid)
        P=await pg.evaluate(GET,iid); OK=ok_vals(P)
    await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(100)
    assert await pg.locator(f"{root} .corr").count()==0, iid+" corr trop tôt"
    await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(100)
    assert await pg.locator(f"{root} .corr").count()==1, iid+" corr absent"
    await fill(pg,OK,root); await pg.locator(f"{root} [data-check]").click(); await pg.wait_for_timeout(250)
    bad=await pg.locator(f"{root} .pfb.bad,{root} .pfb.mid").all_inner_texts()
    g=(await pg.locator(f"{root} .gfb").inner_text()).replace("\n"," | ")[:50]
    print(mode,iid,"OK →",g,bad); assert "Tout est juste" in g, (mode,iid,bad)
    if await pg.locator(f"{root} .unlockz").count(): await pg.locator(f"{root} .unl").screenshot(path=D+f"f-unlock-{iid}.png")
async def run(pg,mode):
    await pg.locator('#tabs [data-v="accueil"]').click(); await pg.wait_for_timeout(150)
    await check_item(pg,mode,"r0","#item")
    for g,items in G.items():
        await pg.locator(f'#tabs [data-v="{g}"]').click()
        for i,iid in enumerate(items):
            await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
            if await pg.locator('[data-h="0"]').count(): await pg.locator('[data-h="0"]').click(); await pg.wait_for_timeout(150)
            await check_item(pg,mode,iid)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"])
        ctx=await b.new_context(viewport={"width":820,"height":1180},device_scale_factor=1); await ctx.add_init_script(FAST)
        pg=await ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        await pg.goto(URL+"#accueil"); await pg.wait_for_timeout(300)
        await run(pg,"g")
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+"f-bilan-g.png",full_page=True)
        await pg.goto(URL+"?version=experte#accueil"); await pg.wait_for_timeout(300)
        await run(pg,"l")
        await pg.reload(); await pg.wait_for_timeout(300)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D+"f-bilan-l.png",full_page=True)
        txt=await pg.evaluate("bilanText('Test')"); open(D+"bilan-l.txt","w").write(txt); print(txt[-700:])
        print("errors:",errs)
        await b.close()
asyncio.run(main())
