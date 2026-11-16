import sys, asyncio, json
from playwright.async_api import async_playwright
f=sys.argv[1]
FILL = """
([id, correct]) => {
  const x = ITEMS[id]; const it = x.it; const st = itState(id); st.v = {};
  it.parts.forEach((p,k)=>{
    let v;
    if(p.t==='num'){ let a=p.ans; if(!correct) a=a*3+1; v=(p.sign&&a>0?'+':'')+String(Math.round(a*1000)/1000).replace('.',','); }
    if(p.t==='word'){ v = correct ? p.ans[0] : 'zzzz'; }
    if(p.t==='sci'){ const ex=Math.floor(Math.log10(p.ans)); v={m:String(Math.round(p.ans/10**ex*100)/100).replace('.',','), e:String(correct?ex:ex+1)}; }
    if(p.t==='range'){ v={lo:String(p.lo), hi:String(correct?p.hi:p.hi+30)}; }
    if(p.t==='choice'){ v=correct?p.a:(p.a+1)%p.o.length; }
    if(p.t==='multi'){ v=correct?p.a.slice():[0]; }
    if(p.t==='rows'){ v={}; p.rows.forEach((r,i)=>v[i]=correct?r.a:(r.a+1)%p.choices.length); }
    if(p.t==='order'){ v=p.items.map((_,i)=>i); if(!correct) v.reverse(); }
    if(p.t==='coef'){ v=correct?p.ans.slice():p.ans.map(x=>x+1); }
    if(p.t==='text'){ v='Ma réponse rédigée.'; }
    st.v[k]=v;
  }); save();
}
"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width":820,"height":1180}, accept_downloads=True); pg = await ctx.new_page(); errs=[]
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("file://"+f); await pg.wait_for_timeout(300)
        exos = await pg.evaluate("EXOS.map(e=>e.id)")
        bad = []
        for eid in exos:
            for l in ["easy","mid","hard"]:
                iid = f"{eid}-{l}"
                await pg.evaluate(f"S.lv['{eid}']='{l}'; go('{eid}', true)")
                await pg.evaluate(FILL, [iid, False]); await pg.evaluate(f"go('{eid}', true)")
                await pg.click("#item [data-check]"); await pg.wait_for_timeout(40)
                g1 = (await pg.inner_text("#item .gfb")).split("\n")[0]
                corr1 = await pg.locator("#item .corr").count()
                # second wrong attempt -> corrigé must show
                await pg.click("#item [data-check]"); await pg.wait_for_timeout(40)
                corr2 = await pg.locator("#item .corr").count()
                await pg.evaluate(FILL, [iid, True]); await pg.evaluate(f"go('{eid}', true)")
                await pg.click("#item [data-check]"); await pg.wait_for_timeout(40)
                g3 = (await pg.inner_text("#item .gfb")).split("\n")[0]
                model = await pg.locator("#item .after .box.info").count()
                unlock = await pg.locator("#item .unlock").count()
                hastext = await pg.evaluate(f"ITEMS['{iid}'].it.parts.some(p=>p.t==='text')")
                mx = await pg.evaluate(f"itemMax(ITEMS['{iid}'].it)")
                ok = (corr1==0 or mx==0) and corr2==1 and (g3.startswith("✓") or mx==0) and (model==1 if hastext else True)
                if not ok: bad.append((iid, g1, corr1, corr2, g3, model))
                if unlock: print("unlock shown on", iid)
        print("items with problems:", bad)
        # hints on one item
        await pg.evaluate("S.lv.e2='mid'; S.it['e2-mid']=undefined; save(); go('e2', true)")
        for i in range(3): await pg.click("#item [data-hint]")
        print("hints shown:", await pg.locator("#item .hz .hint").count(), "hint button left:", await pg.locator("#item [data-hint]").count())
        # docsSolved for e2 mid
        await pg.evaluate(FILL, ["e2-mid", True]); await pg.evaluate("go('e2', true)"); await pg.click("#item [data-check]"); await pg.wait_for_timeout(100)
        print("e2 mid doc title after success:", await pg.locator("#item .doc .dh span").first.inner_text())
        # typed tolerance
        await pg.evaluate("S.lv.e5='easy'; S.it['e5-easy']=undefined; save(); go('e5', true)")
        await pg.fill("#item .part[data-k='2'] input", "Interglacière"); await pg.click("#item [data-check]")
        print("typo msg:", await pg.inner_text("#item .part[data-k='2'] .pfbw"))
        await pg.fill("#item .part[data-k='2'] input", "glaciaire"); await pg.click("#item [data-check]")
        print("err msg:", await pg.inner_text("#item .part[data-k='2'] .pfbw"))
        # dilatation simulator
        await pg.evaluate("S.lv.e7='hard'; go('e7', true)"); await pg.wait_for_timeout(100)
        n = await pg.locator("#item .unlock").count(); print("unlock panel:", n)
        if n:
            await pg.evaluate("const r=document.querySelector('#dsT'); r.value=2; r.dispatchEvent(new Event('input'))")
            print("sim result:", await pg.inner_text("#dsR"))
            await pg.locator("#item .unlock").screenshot(path="test/e-unlock.png")
        # sujets blancs : fill all A correctly
        await pg.evaluate("S.sj='A'; save(); go('sujets', true)"); await pg.wait_for_timeout(200)
        ids = await pg.evaluate("Array.from(document.querySelectorAll('[data-sjroot]')).map(e=>e.dataset.sjroot)")
        for i,iid in enumerate(ids):
            await pg.evaluate(FILL, [iid, i%2==0])
        await pg.evaluate("go('sujets', true)")
        for iid in ids:
            await pg.locator(f'[data-sjroot="{iid}"] [data-check]').click(); await pg.wait_for_timeout(30)
        # tick criteria in redac items
        crits = pg.locator("[data-sjroot] .crit button")
        for i in range(await crits.count()): await crits.nth(0 if False else i).click()
        print("sujet end:", (await pg.inner_text("#sjEnd")).replace("\n"," | ")[:200])
        await pg.click("#sjGo"); await pg.wait_for_timeout(1500)
        print("timer:", await pg.inner_text("#tabx"))
        await pg.evaluate("S.timer.acc = 3599; S.timer.t0 = Date.now(); save()"); await pg.wait_for_timeout(2200)
        print("timer end:", await pg.inner_text("#tabx"), "|", await pg.inner_text("#timerLive"))
        await pg.screenshot(path="test/e-sujet.png")
        # bilan + download
        await pg.evaluate("go('bilan')"); await pg.wait_for_timeout(150)
        async with pg.expect_download() as dl: await pg.click("#bDl")
        d = await dl.value; txt=open(await d.path(), encoding="utf-8-sig").read()
        print(txt[:2600])
        await pg.click("#bCp"); print("copy:", await pg.inner_text("#bMsg"))
        await pg.click("#bShow"); await pg.wait_for_timeout(100); await pg.screenshot(path="test/e-show.png"); await pg.click("#ovClose")
        print("errors", errs)
        await b.close()
asyncio.run(main())
