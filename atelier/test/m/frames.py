import asyncio, re, pathlib
from playwright.async_api import async_playwright
src=pathlib.Path("mitose_widgets.js").read_text()
a=src.index("const ss ="); b=src.index("/* ---------- cellule animée")
js=src[a:b]
html=f"""<!doctype html><meta charset=utf-8><style>{pathlib.Path('core.css').read_text()}{pathlib.Path('svt.css').read_text()}{pathlib.Path('mitose.css').read_text()}
body{{background:var(--surface);margin:8px}} .g{{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}} .g div{{font:12px sans-serif;border:1px solid #ccc}}</style><div class=g id=g></div>
<script>{js}
const ts=[0,0.08,0.2,0.3,0.38,0.44,0.5,0.56,0.61,0.67,0.73,0.8,0.86,0.93,0.99];
document.getElementById('g').innerHTML=ts.map(t=>'<div>'+t+' '+phaseAt(t).name+cellSVG(300,170,t)+'</div>').join('');
</script>"""
pathlib.Path("test/m/frames.html").write_text(html)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(viewport={"width":1560,"height":640}); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e)))
        await pg.goto("file:///home/claude/ds/test/m/frames.html"); await pg.screenshot(path="test/m/frames.png"); print(errs); await b.close()
asyncio.run(main())
