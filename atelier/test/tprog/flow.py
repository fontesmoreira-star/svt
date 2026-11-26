"""Parcours complet de « Créer son programme avec Thymio » : version guidée (blocs déjà posés) puis experte (programmes construits de zéro).
Pour chaque étape : vérification à vide, 3 coups de pouce, réponses fausses, programme faux puis juste construit dans l'éditeur et validé par le robot-testeur,
corrigé au 2e essai, réponses justes. Captures dans test/tprog/."""
import asyncio
from playwright.async_api import async_playwright
URL = "file:///home/claude/svt/5e/mission-6/programmation/programmer-thymio.html"
D = "test/tprog/"
G = {"p1": ["a0", "a1", "a2"], "p2": ["b1"], "p3": ["c1", "c2"], "p4": ["d1"]}
OKG = {"r0": ["c0", "c0", "c0"], "a0": ["T", "M0123", "c0"], "a1": ["T", "4", "c0"], "a2": ["T", "c0", "R011"], "b1": ["T", "c0", "3", "c0"], "c1": ["T", "c0", "c0"], "c2": ["T", "c0", "c0"], "d1": ["T", "c0", "c0", "c0"]}
BADG = {"r0": ["c1", "c2", "c1"], "a0": ["T", "M1023", "c1"], "a1": ["T", "1", "c1"], "a2": ["T", "c1", "R100"], "b1": ["T", "c1", "2", "c1"], "c1": ["T", "c1", "c2"], "c2": ["T", "c1", "c1"], "d1": ["T", "c1", "c1", "c1"]}
OKL = {"r0": ["capteur", "actionneurs", "capteurs au sol"],
       "a0": ["T", "M0123", "Dans le programme C, lorsque rien n'est détecté devant, le robot roule en avant. Lorsqu'un objet est à gauche il tourne à droite pour l'éviter : il se promène tout seul sans jamais s'arrêter."],
       "a1": ["T", "événement", "4"], "a2": ["T", "actions", "R011"],
       "b1": ["T", "LORSQU'un choc est détecté ALORS le robot arrête ses moteurs, joue un bip et allume son dos en blanc.", "3"],
       "c1": ["T", "Lorsque les capteurs de proximité avant détectent la trousse 1 devant, alors le robot roule en arrière. Cette action reste active jusqu'à ce que les capteurs arrière détectent la trousse 2 derrière : alors il roule en avant, et ainsi de suite sans fin.", "c0"],
       "c2": ["T", "LORSQUE les deux capteurs au sol voient du noir ALORS rouler en avant.\nLORSQUE seul le capteur gauche voit du blanc ALORS tourner à droite.\nLORSQUE seul le capteur droit voit du blanc ALORS tourner à gauche.\nLORSQUE les deux capteurs voient du blanc ALORS arrêter les moteurs."],
       "d1": ["T", "LORSQUE le bouton avant est touché ALORS rouler en avant.\nLORSQUE rien n'est détecté devant ALORS rouler en avant.\nLORSQU'un objet est détecté à gauche ALORS tourner à droite.\nLORSQU'un objet est détecté à droite ALORS tourner à gauche.\nLORSQU'un objet est détecté devant ALORS tourner à droite.", "c0"]}
BADL = {"r0": ["actionneur", "capteurs", "capteurs de proximité"],
        "a0": ["T", "M1023", "Je pense que c'est le programme C parce que c'est le plus long de tous les programmes de la liste."],
        "a1": ["T", "action", "1"], "a2": ["T", "capteurs", "R100"],
        "b1": ["T", "Quand on appuie sur le bouton central le robot va devenir tout rouge et il va avancer.", "2"],
        "c1": ["T", "Le robot avance parce que le bouton avant est appuyé et il roule tout droit vers la trousse numéro un.", "c1"],
        "c2": ["T", "LORSQUE les deux capteurs voient du noir ALORS rouler en avant.\nLORSQUE le capteur gauche voit du blanc ALORS tourner à gauche.\nLORSQUE le capteur droit voit du blanc ALORS tourner à droite."],
        "d1": ["T", "LORSQUE le bouton avant est touché ALORS rouler en avant.\nLORSQU'un objet est détecté devant ALORS tourner à gauche et ensuite il continue tout seul dans le labyrinthe jusqu'à ce qu'il trouve enfin les panneaux solaires de la base.", "c1"]}
EXPECT_BAD_L = {"a0": "0/3", "b1": "0/5", "c2": "2/4", "d1": "3/5"}
# programmes : [événement, [actions]] ; « bad » = premier essai faux (bloc, action) remplacé ensuite par la bonne action
PROGS = {"a1": ("d1", [["b_av", ["d_rouge"]], ["b_ar", ["d_vert"]], ["b_g", ["d_bleu"]], ["b_d", ["d_jaune"]]], (1, 0, "d_rouge")),
         "a2": ("d2", [["b_av", ["d_rouge", "v_rouge"]]], (0, 1, "v_vert")),
         "b1": ("d3", [["b_av", ["m_av", "d_bleu"]], ["b_ar", ["m_ar", "d_violet"]], ["b_g", ["m_g", "d_rouge"]], ["b_d", ["m_d", "d_vert"]], ["choc", ["m_st", "son", "d_blanc"]]], (4, 2, "d_rouge")),
         "c1": ("d4", [["b_av", ["m_av"]], ["p_dev", ["m_ar"]], ["p_der", ["m_av"]], ["b_ar", ["m_st"]]], (2, 0, "m_ar")),
         "c2": ("d5", [["s_nn", ["m_av"]], ["s_bn", ["m_d"]], ["s_nb", ["m_g"]], ["s_bb", ["m_st"]]], (1, 0, "m_g")),
         "d1": ("laby", [["b_av", ["m_av"]], ["p_rien", ["m_av"]], ["p_g", ["m_d"]], ["p_d", ["m_g"]], ["p_dev", ["m_d"]]], (4, 0, "m_g"))}

async def build(pg, w, prog, bad, mode):
    pre = [] if mode == "l" else [b[0] for b in prog]
    first = {"laby": 1}.get(None, 0)
    for i, (e, acts) in enumerate(prog):
        if mode == "l":
            await w.locator("[data-newb]").click(); await w.locator(f'[data-pe="{e}"]').click()
        start = 1 if (mode == "g" and e == "b_av" and acts == ["m_av"] and len(prog) == 5) else 0
        for j, a in enumerate(acts[start:]):
            jj = j + start
            use = bad[2] if (i, jj) == (bad[0], bad[1]) else a
            await w.locator(f'[data-add="{i}"]').click(); await w.locator(f'[data-pa="{use}"]').click()

async def test(pg, w, expect_ok):
    await w.locator("[data-test]").click(); await pg.wait_for_timeout(150)
    t = await w.locator(".tres").inner_text()
    assert ("Défi réussi" in t) == expect_ok, (expect_ok, t)
    return t

async def task(pg, iid, mode):
    w = pg.locator("#wz")
    if iid == "a0":
        for p in "ABCD":
            await w.locator(f'[data-pg="{p}"]').click(); await pg.wait_for_timeout(200)
            if p in "ACD": await w.locator('[data-hd="dev"]').click(); await pg.wait_for_timeout(1500)
            if p == "B": await w.locator('[data-tk="b_av"]').click(); await pg.wait_for_timeout(900)
            if mode == "g": await w.screenshot(path=D + f"f-lecture-{p}.png")
        return
    defi, prog, bad = PROGS[iid]
    t = await test(pg, w, False); print("   vide/incomplet →", t[:90].replace("\n", " "))
    await build(pg, w, prog, bad, mode)
    t = await test(pg, w, False); print("   faux →", t[:160].replace("\n", " | "))
    await w.locator(f'[data-ac="{bad[0]}:{bad[1]}"]').click(); await w.locator(f'[data-pa="{prog[bad[0]][1][bad[1]]}"]').click()
    if iid == "d1": await w.locator('[data-tk="b_av"]').click(); await pg.wait_for_timeout(200); await w.locator("[data-fast]").click(); await pg.wait_for_timeout(2500); await w.screenshot(path=D + f"f-{mode}-laby-run.png")
    if iid == "c1": await w.locator('[data-tk="b_av"]').click(); await pg.wait_for_timeout(1800); await w.screenshot(path=D + f"f-{mode}-trousses.png")
    if iid == "c2": await w.locator("[data-fast]").click(); await pg.wait_for_timeout(1500); await w.screenshot(path=D + f"f-{mode}-piste.png")
    if iid == "b1": await w.locator('[data-tk="b_d"]').click(); await pg.wait_for_timeout(500); await w.locator('[data-choc]').click(); await pg.wait_for_timeout(150); await w.screenshot(path=D + f"f-{mode}-obeissant.png")
    t = await test(pg, w, True); print("   juste →", t[:130].replace("\n", " | "))
    if mode == "g" and iid == "a1": await w.screenshot(path=D + "f-g-defi1.png")

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
    if "T" in OK[iid]:
        await pg.locator("#item [data-check]").click(); t = await pg.locator("#item .gfb").inner_text(); assert "Complète" in t, (iid, "tâche", t)
        await task(pg, iid, mode)
    await pg.locator("#item [data-check]").click(); await pg.wait_for_timeout(100)
    msgs = await pg.locator("#item .pfb.bad, #item .pfb.mid").all_inner_texts()
    print(mode, iid, "FAUX →", [m[:60] for m in msgs])
    if mode == "l" and iid in EXPECT_BAD_L: assert any(EXPECT_BAD_L[iid] in m for m in msgs), (iid, msgs)
    assert await pg.locator("#item .corr").count() == 0, iid + " corrigé trop tôt"
    await pg.locator("#item [data-check]").click(); await pg.wait_for_timeout(100)
    assert await pg.locator("#item .corr").count() == 1, iid + " corrigé absent au 2e essai"
    await fill(pg, OK[iid]); await pg.locator("#item [data-check]").click(); await pg.wait_for_timeout(250)
    bad = await pg.locator("#item .pfb.bad, #item .pfb.mid").all_inner_texts()
    g = (await pg.locator("#item .gfb").inner_text()).replace("\n", " | ")
    print(mode, iid, "JUSTE →", g[:60], bad); assert "Tout est juste" in g, (mode, iid, g, bad)

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
        # version experte : programmes reconstruits de zéro
        await pg.evaluate("S.x.progs = {}; S.x.ok = {}; S.x.loaded = {}; save()")
        await pg.goto(URL + "?version=experte#accueil"); await pg.reload(); await pg.wait_for_timeout(300)
        await run(pg, "l", OKL, BADL)
        await pg.reload(); await pg.wait_for_timeout(300)
        await pg.locator('#tabs [data-v="bilan"]').click(); await pg.wait_for_timeout(200); await pg.screenshot(path=D + "f-bilan-l.png", full_page=True)
        txt = await pg.evaluate("bilanText('Test')"); open(D + "bilan-l.txt", "w").write(txt)
        assert "MES PROGRAMMES" in txt and "Mission · le labyrinthe : réussi" in txt, txt[-900:]
        print(txt[-1300:])
        print("errors:", errs)
        await b.close()
asyncio.run(main())
