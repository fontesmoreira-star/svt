"""Parcours complet de « Découvrir la programmation avec Thymio » : versions guidée puis experte.
Pour chaque étape : vérification à vide, 3 coups de pouce, réponses fausses (corrigé absent), 2e essai (corrigé affiché), réponses justes.
Manipulations réelles dans les simulations (numéros, situations, programme du robot nettoyeur). Captures dans test/thym/."""
import asyncio, re
from playwright.async_api import async_playwright
URL = "file:///home/claude/svt/5e/mission-6/programmation/decouvrir-thymio.html"
D = "test/thym/"
G = {"p1": ["a1", "a2"], "p2": ["b1", "b2"], "p3": ["c2", "c1", "c3"], "p4": ["d1"]}
OKG = {"r0": ["c0", "c0", "c0"], "a1": ["T", "M012345", "5", "2"], "a2": ["T", "R010101", "R01", "c0"], "b1": ["T", "c0", "R01", "c0"], "b2": ["T", "M0123", "c0"],
       "c2": ["T", "M0123", "c0"], "c1": ["T", "M012", "c1"], "c3": ["T", "M01234", "c0", "c2"], "d1": ["T", "c0", "c0", "c0"]}
BADG = {"r0": ["c1", "c2", "c1"], "a1": ["T", "M102345", "7", "3"], "a2": ["T", "R101010", "R10", "c1"], "b1": ["T", "c1", "R10", "c2"], "b2": ["T", "M1023", "c1"],
        "c2": ["T", "M1032", "c1"], "c1": ["T", "M021", "c0"], "c3": ["T", "M10234", "c1", "c0"], "d1": ["T", "c1", "c1", "c2"]}
ROUGE = "SI Thymio détecte un objet devant lui ALORS il recule.\nSI Thymio détecte un objet à droite ALORS il recule en tournant à gauche.\nSI Thymio détecte un objet à gauche ALORS il recule en tournant à droite.\nSI Thymio détecte un objet derrière lui ALORS il avance."
VERT = "SI Thymio détecte un objet devant lui ALORS il avance.\nSI Thymio détecte un objet à droite ALORS il tourne à droite.\nSI Thymio détecte un objet à gauche ALORS il tourne à gauche."
OKL = {"r0": ["4", "sable", "fonction"],
       "a1": ["T", "haut-parleur", "capteurs de proximité", "capteurs au sol", "7"],
       "a2": ["T", "R010101", "Quand une main s'approche devant le robot, les capteurs de proximité la détectent. Le programme décide alors de la réaction, et les actionneurs agissent : les roues font reculer le robot et les LED deviennent rouges."],
       "b1": ["T", "si, alors", "SI les capteurs de proximité avant détectent un objet devant Thymio, ALORS les roues (les moteurs) le font reculer."],
       "b2": ["T", ROUGE, "c0"],
       "c2": ["T", "SI on appuie sur la flèche avant ALORS il avance.\nSI on appuie sur la flèche arrière ALORS il recule.\nSI on appuie sur la flèche de droite ALORS il tourne à droite.\nSI on appuie sur la flèche de gauche ALORS il tourne à gauche.", "c0"],
       "c1": ["T", VERT, "c1"],
       "c3": ["T", "SI Thymio détecte un objet à droite ALORS il tourne à gauche.\nSI Thymio détecte un objet à gauche ALORS il tourne à droite.\nSI Thymio détecte un objet devant lui ALORS il recule.\nSI Thymio ne détecte rien ALORS il avance.\nSI Thymio détecte du vide en dessous ALORS il s'arrête.", "capteurs au sol", "c2"],
       "d1": ["T", "SI les deux capteurs au sol voient du noir ALORS il avance.\nSI seul le capteur gauche voit du blanc ALORS il tourne à droite.\nSI seul le capteur droit voit du blanc ALORS il tourne à gauche.\nSI les deux capteurs voient du blanc ALORS il s'arrête.", "c0"]}
BADL = {"r0": ["2", "eau", "solution"],
        "a1": ["T", "moteur", "capteurs", "capteur de proximité", "5"],
        "a2": ["T", "R101010", "Le robot voit la main et il part en arrière parce qu'il a peur de la main qui arrive devant lui très vite."],
        "b1": ["T", "et, ou", "Le robot voit quelque chose devant lui alors il va reculer très vite vers l'arrière de la table."],
        "b2": ["T", VERT + "\nSI rien ALORS il dort tranquillement sur la table.", "c1"],
        "c2": ["T", "SI on appuie sur la flèche avant ALORS il recule.\nSI on appuie sur la flèche arrière ALORS il avance.\nSI on appuie sur la flèche de droite ALORS il tourne à gauche.\nSI on appuie sur la flèche de gauche ALORS il tourne à droite.", "c1"],
        "c1": ["T", ROUGE, "c0"],
        "c3": ["T", VERT + "\nSI il y a un trou ALORS il saute par-dessus avec ses roues et il continue sa route.", "capteurs de proximité", "c0"],
        "d1": ["T", "SI les deux capteurs voient du noir ALORS il avance.\nSI le capteur gauche voit du blanc ALORS il tourne à gauche.\nSI le capteur droit voit du blanc ALORS il tourne à droite.\nSI les deux capteurs voient du blanc ALORS il avance.", "c1"]}
EXPECT_BAD_L = {"b2": "1/5", "c2": "1/5", "c1": "1/4", "c3": "1/6", "d1": "2/5"}

async def set_prog(w, prog):
    for i, j in enumerate(prog): await w.locator(f'[data-ri="{i}"][data-aj="{j}"]').click()

async def task(pg, iid):
    w = pg.locator("#wz")
    if iid == "a1":
        for v, ms in [("dessus", [1, 2]), ("dessous", [3, 4, 6]), ("devant", [4, 5]), ("derriere", [4, 5])]:
            await w.locator(f'[data-vw="{v}"]').click()
            for m in ms:
                await w.locator(f'[data-m="{m}"]').click(); await pg.wait_for_timeout(650)
                await w.screenshot(path=D + f"f-anat-{v}-{m}.png")
    if iid == "a2":
        for sc in ["main", "fleche", "bord"]:
            await w.locator(f'[data-sc="{sc}"]').click(); await pg.wait_for_timeout(2900); await w.screenshot(path=D + f"f-chaine-{sc}.png")
    if iid in ("b1", "b2", "c1", "c3", "c2"):
        sits = {"b1": ["devant"], "b2": ["devant", "droite", "gauche", "derriere"], "c1": ["devant", "droite", "gauche"], "c3": ["devant", "droite", "gauche", "rien", "vide"], "c2": ["av", "g", "d", "ar"]}[iid]
        for st in sits:
            await w.locator(f'[data-st="{st}"]').click(); await pg.wait_for_timeout(2300)
            await w.screenshot(path=D + f"f-arena-{iid}-{st}.png")
    if iid == "d1":
        await w.locator("[data-run]").click(); t = await w.locator(".readout").inner_text(); assert "Choisis" in t, t
        await w.locator('[data-sp="rapide"]').click()
        for prog, exp in [([0, 1, 2, 3], "avant d'arriver"), ([0, 2, 1, 0], "roulé sur les panneaux"), ([0, 0, 0, 0], "perdu")]:
            await set_prog(w, prog); await w.locator("[data-run]").click()
            for _ in range(60):
                await pg.wait_for_timeout(250); t = await w.locator(".readout").inner_text()
                if "✗" in t or "✓" in t: break
            print("   piste", prog, "→", t[:90]); assert exp in t, (prog, t)
        await w.screenshot(path=D + "f-piste-fail.png")
        await set_prog(w, [0, 2, 1, 3]); await w.locator('[data-sp="normal"]').click(); await w.locator("[data-run]").click()
        await pg.wait_for_timeout(3000); await w.screenshot(path=D + "f-piste-run.png")
        await w.locator('[data-sp="rapide"]').click()
        for _ in range(80):
            await pg.wait_for_timeout(250); t = await w.locator(".readout").inner_text()
            if "✗" in t or "✓" in t: break
        print("   piste juste →", t[:80]); assert "Mission réussie" in t, t
        await pg.wait_for_timeout(1500); await w.screenshot(path=D + "f-piste-ok.png")

async def fill(pg, vals):
    for k, v in enumerate(vals):
        part = pg.locator(f'#item .part[data-k="{k}"]')
        if v == "T": continue
        if v[0] == "M" and v[1:].isdigit():
            for i in range(len(v) - 1):
                if await part.locator(f'[data-mi="{i}"] .mv.has').count(): await part.locator(f'[data-mi="{i}"]').click()
            for i, j in enumerate(v[1:]):
                await part.locator(f'[data-mi="{i}"]').click(); await part.locator(f'[data-mj="{j}"]').click()
        elif v[0] == "R" and v[1:].isdigit():
            for i, j in enumerate(v[1:]): await part.locator(f'.seg button[data-i="{i}"][data-j="{j}"]').click()
        elif v[0] == "c" and v[1:].isdigit() and len(v) == 2: await part.locator(f'.opt[data-j="{v[1]}"]').click()
        elif await part.locator("textarea").count(): await part.locator("textarea").fill(v)
        else: await part.locator("input").fill(v)

async def one(pg, mode, iid, OK, BAD):
    await pg.locator("#item [data-check]").click()
    t = await pg.locator("#item .gfb").inner_text(); assert "Complète" in t or "courte" in t or "manquante" in t, (mode, iid, t)
    for _ in range(3): await pg.locator("#item [data-hint]").click()
    await fill(pg, BAD[iid])
    if "T" in OK[iid] and mode == "g":
        await pg.locator("#item [data-check]").click(); t = await pg.locator("#item .gfb").inner_text(); assert "Complète" in t, (iid, "tâche", t)
        await task(pg, iid)
    await pg.locator("#item [data-check]").click(); await pg.wait_for_timeout(100)
    msgs = await pg.locator("#item .pfb.bad, #item .pfb.mid").all_inner_texts()
    print(mode, iid, "FAUX →", [m[:70] for m in msgs])
    if mode == "l" and iid in EXPECT_BAD_L: assert any(EXPECT_BAD_L[iid] in m for m in msgs), (iid, msgs)
    assert await pg.locator("#item .corr").count() == 0, iid + " corrigé trop tôt"
    await pg.locator("#item [data-check]").click(); await pg.wait_for_timeout(100)
    assert await pg.locator("#item .corr").count() == 1, iid + " corrigé absent au 2e essai"
    await fill(pg, OK[iid]); await pg.locator("#item [data-check]").click(); await pg.wait_for_timeout(250)
    bad = await pg.locator("#item .pfb.bad, #item .pfb.mid").all_inner_texts()
    g = (await pg.locator("#item .gfb").inner_text()).replace("\n", " | ")
    print(mode, iid, "JUSTE →", g[:70], bad); assert "Tout est juste" in g, (mode, iid, g, bad)

async def run(pg, mode, OK, BAD):
    await one(pg, mode, "r0", OK, BAD)
    for g, items in G.items():
        await pg.locator(f'#tabs [data-v="{g}"]').click()
        for i, iid in enumerate(items):
            await pg.locator(".stepper button").nth(i).click(); await pg.wait_for_timeout(150)
            await one(pg, mode, iid, OK, BAD)
            if iid == "d1": await pg.screenshot(path=D + f"f-{mode}-d1.png", full_page=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox"])
        ctx = await b.new_context(viewport={"width": 820, "height": 1180}, device_scale_factor=1)
        pg = await ctx.new_page(); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        await pg.goto(URL + "#accueil"); await pg.wait_for_timeout(300)
        await run(pg, "g", OKG, BADG)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D + "f-bilan-g.png", full_page=True)
        await pg.goto(URL + "?version=experte#accueil"); await pg.wait_for_timeout(300)
        await run(pg, "l", OKL, BADL)
        await pg.reload(); await pg.wait_for_timeout(300)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D + "f-bilan-l.png", full_page=True)
        txt = await pg.evaluate("bilanText('Test')"); open(D + "bilan-l.txt", "w").write(txt)
        assert "MON PROGRAMME DU ROBOT NETTOYEUR" in txt and "Test : réussi" in txt, txt[-600:]
        print(txt[:400]); print("…"); print(txt[-900:])
        print("errors:", errs)
        await b.close()
asyncio.run(main())
