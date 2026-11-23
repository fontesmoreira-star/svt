"""Repère le français resté dans une app DNL : parcourt l'accueil, chaque étape (vérification à vide, 3 coups de pouce,
deux essais faux pour afficher le corrigé), le bilan ; ignore les éléments lang="fr". Usage : scan.py URL [version]"""
import asyncio, sys, re
from playwright.async_api import async_playwright
URL = sys.argv[1]; Q = ("?version=" + sys.argv[2]) if len(sys.argv) > 2 else ""
FR = re.compile(r"[éèêàçùôâîœ«»]|\b(le|la|les|des|une|est|et|tu|ton|ta|tes|du|au|aux|pas|sur|dans|avec|pour|qui|que|ou|je|mon|ma|partie|étape|bilan|version guidée|accueil|semaine)\b", re.I)
JS = """() => { const c = document.body.cloneNode(true); c.querySelectorAll('[lang="fr"],script,style').forEach(n => n.remove());
  const a = [...document.querySelectorAll('[aria-label],[placeholder],svg text,title')].filter(n => !n.closest('[lang="fr"]')).map(n => n.getAttribute('aria-label') || n.getAttribute('placeholder') || n.textContent);
  return (c.innerText + "\\n" + a.join("\\n")); }"""
async def main():
    seen = set()
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox"]); pg = await (await b.new_context(viewport={"width": 1180, "height": 900})).new_page()
        errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
        async def grab(tag):
            for line in (await pg.evaluate(JS)).split("\n"):
                line = line.strip()
                if line and FR.search(line) and line not in seen: seen.add(line); print(f"[{tag}] {FR.search(line).group(0)!r} … {line[max(0,FR.search(line).start()-60):FR.search(line).end()+60]}")
        await pg.goto(URL + Q + "#accueil"); await pg.wait_for_timeout(300); await grab("home")
        for v in ["accueil", "p1", "p2", "p3", "p4"]:
            if not await pg.locator(f'#tabs [data-v="{v}"]').count(): continue
            await pg.locator(f'#tabs [data-v="{v}"]').click(); await pg.wait_for_timeout(200)
            n = await pg.locator(".stepper button").count()
            for i in range(max(n, 1)):
                if n: await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(200)
                root = "#item " if v == "accueil" else ""
                if await pg.locator(root + "#hypo [data-h]").count(): await pg.locator(root + "#hypo [data-h]").first.click(); await pg.wait_for_timeout(100)
                for run in await pg.locator('.animctl [data-a="run"]').all(): await run.click()
                for sel in ["#wz [data-s='1']", "#wz [data-wk='2']", "[data-k='nose'][data-j='1']"]:
                    if await pg.locator(sel).count(): await pg.locator(sel).first.click()
                await pg.wait_for_timeout(600)
                print("..", v, i, flush=True); await pg.locator(root + "[data-check]").click(timeout=5000); await grab(f"{v}.{i} vide")
                for _ in range(3):
                    if await pg.locator(root + "[data-hint]").count(): await pg.locator(root + "[data-hint]").click()
                # une réponse quelconque partout, puis deux essais
                for o in await pg.locator(root + ".part").all():
                    if await o.locator(".opt").count(): await o.locator(".opt").first.click()
                    for s in await o.locator(".seg").all():
                        if await s.locator("button").count(): await s.locator("button").first.click()
                    if await o.locator("input").count(): await o.locator("input").first.fill("zzz")
                    if await o.locator("textarea").count(): await o.locator("textarea").fill("the moon is the moon " * 8)
                    while await o.locator("[data-mj]").count() and await o.locator(".mrow[aria-pressed='true']").count(): await o.locator("[data-mj]").first.click()
                    for ph in await o.locator(".phz").all(): await ph.click()
                await pg.locator(root + "[data-check]").click(); await pg.wait_for_timeout(100); await pg.locator(root + "[data-check]").click(); await pg.wait_for_timeout(150)
                await pg.wait_for_timeout(2500)
                await grab(f"{v}.{i}")
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(300); await grab("bilan")
        txt = await pg.evaluate("() => bilanText('X')")
        for line in txt.split("\n"):
            if FR.search(line) and " = " not in line: print("[txt]", line[:160])
        print("errors:", errs); await b.close()
asyncio.run(main())
