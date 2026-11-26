# Réponses d'élèves plausibles (version exigeante) : éléments repérés par les mots-clés de chaque réponse rédigée
import asyncio
from playwright.async_api import async_playwright
URL="file:///home/claude/svt/3e/vivant-evolution/ch3-diversite-evolution/place-de-l-homme.html?version=exigeante"
T={"b1":["Le crocodile et le chat ont tous les deux un amnios mais pas le crapaud. Ils l'ont herite d'un ancetre commun. Donc le crocodile et le chat sont plus proches parents entre eux qu'avec le crapaud.",
         "Le chat et le crocodile partagent l'amnios donc leur ancêtre commun le possédait, il est plus récent que celui avec le crapaud."],
   "b3":["L'Homme est un vertebre car il a un squelette osseux, un tetrapode car il a des doigts, un amniote car il a un amnios et un mammifere car il a des poils et des mamelles.",
         "Il appartient aux 4 groupes : vertébrés (squelette osseux), tétrapodes (doigts), amniotes (amnios) et mammifères (poils, mamelles)."],
   "c2":["Non, le chimpanze, le gorille et l'Homme ont les memes caracteres, ils partent du meme noeud. On ne peut pas les departager. C'est l'ADN qui montre que le chimpanze est le plus proche.",
         "Ils ont tous les trois un coccyx donc ces caractères ne suffisent pas. Il faut comparer l'ADN : 98,8 % avec le chimpanzé."],
   "c3":["L'Homme est un primate car il a des ongles plats et un pouce opposable, un singe de l'ancien monde car il a des narines rapprochees et des orbites fermees et un hominoide car il a un coccyx comme le chimpanze et le gorille.",
         "C'est un primate (pouce opposable), un singe de l'Ancien Monde (orbites fermées) et un hominoïde avec le gorille et le chimpanzé (coccyx)."]}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=["--no-sandbox"]); pg=await b.new_page(); await pg.goto(URL); await pg.wait_for_timeout(300)
        for iid,L in T.items():
            for txt in L:
                r=await pg.evaluate("""([id,t])=>{applyMode();const it=ITEMS[id].it;const p=it.parts.find(q=>q.t==='redac');const T=nzT(t);return p.crit.map(c=>(critHit(c,T)?'✓ ':'✗ ')+c.lab)}""",[iid,txt])
                print(iid, sum(x.startswith("✓") for x in r),"/",len(r), [x for x in r if x.startswith("✗")])
        await b.close()
asyncio.run(main())
