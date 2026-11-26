# Atelier · le moteur des apps

Sources de toutes les apps du site, script de construction et tests.
Les règles à respecter sont dans [`CHARTE.md`](CHARTE.md).

## Démarrer une séance de travail
1. Cloner le dépôt dans `/home/claude/svt` (les tests visent `file:///home/claude/svt/...`).
2. Travailler dans `atelier/` : `cd /home/claude/svt/atelier`.
3. Construire : `python3 build.py <morceau-du-nom>` (sans argument : tout reconstruit).
   La page est écrite à sa place dans le site, déjà adaptée pour GitHub Pages (`outils/adapter.py` ajoute la signature et le téléchargement).
4. Tester (Playwright est préinstallé) : `python3 test/<dossier>/smoke.py`, puis `wid.py` et `flow.py` s'ils existent. Pour une app sur `lune.js`, `test/msv/flow.py` est un parcours générique : il tire les bonnes réponses des données (choix, nombres, réponses modèles) et vérifie aussi que chaque réponse modèle rédigée valide tous ses critères ; il suffit d'adapter `URL`, `G` et la fonction `task()`. Regarder les captures (ignorées par git).
5. Publier : ajouter l'app au catalogue, régénérer les pages, commit, push sur `main` (voir plus bas).

Contrôle : reconstruire toutes les apps ne doit modifier aucune page publiée (`git status` vide hors `atelier/`).

## Construire une nouvelle app
Ajouter une entrée dans `APPS` (`build.py`) :

| Clé | Rôle |
|---|---|
| `title`, `h1`, `sub` | Onglet du navigateur, titre et sous-titre du bandeau |
| `js`, `css` | Fichiers ajoutés après `core.js` / `core.css`, dans l'ordre |
| `root` | Dossier de destination dans le site (ex. `5e/mission-4`) |
| `eyebrow`, `foot` | Ligne au-dessus du titre, pied de page |
| `lang` | `"en"` pour une version DNL |

Partir du gabarit le plus proche (copier ses 4 fichiers, renommer, changer les données).

## Les gabarits
| Gabarit | Fichiers | Apps | Pour quoi |
|---|---|---|---|
| **Parcours à étapes** (le plus complet, à privilégier) | `m4b.js` + `*_widgets.js` + `*_data.js` | Révision Mission 4 (5e) | Parties à étapes, paliers, simulations par étape, animation débloquée, fiche mémo à recopier, bilan par partie et compétence |
| **Deux versions (guidée / exigeante)** | `lune.js` + `lune_widgets.js` + `lune_data.js` | Phases de la Lune (5e) | Moteur générique tiré de `bio.js` : `HOME.vers` nomme les versions, `EXPERT` contient les blocs exigeants, type `phase` (dessiner une Lune par moitiés éclairées). À privilégier pour toute nouvelle activité (règle : plusieurs niveaux de difficulté). |
| même famille | `meio.js`, `rev10.js`, `bio.js`, `pomme.js` | Méiose, Révision génétique 1-10 (3e), Biodiversité, Pomme de terre FR/EN (2nde) | Idem, versions précédentes |
| Missions 5e | `mouv.js`, `fusee.js`, `eau.js` | Mission 5 | Scénario-mission, ateliers |
| Activités 3e | `mitose.js`, `rev3.js` | Multiplication cellulaire, Révision ch. 1 | Photos d'étapes, exercice type brevet |
| **TP noté** | `tpagg.js` | TP noté agglutination (3e) | Barème sur 10, copie verrouillée après « Rendre ma copie », compteur de copies |
| **Activité notée sans note visible** (à privilégier pour toute version notée) | `note.js` + `note.css` + `*_note_data.js` (+ widgets de l'activité) | Arbre de Jean noté (`jean_widgets.js`), Multiplication cellulaire notée (`mitose_widgets.js`) (3e) | Consignes et barème, parties validées une fois dans l'ordre (une partie validée se ferme), aucune correction ni note côté élève, copie rendue avec un « code de correction » brouillé ; « Espace professeur » (onglet Ma copie, code à 4 chiffres dont seule l'empreinte est dans la page) : note détaillée, critères des réponses rédigées, décodage des codes reçus, fiche mémo à projeter, effacement pour l'élève suivant. Types : `choice`, `rows` (`multi`), `num`, `word`, `words`, `gaps`, `fill`, `txt` (critères par mots-clés), `order` + types ajoutés par les widgets (`QX` : `tree`, `shots`). Tests : `test/note/` (`smoke.py`, `flow.py` avec `PROF_PIN=…`, `crit.py`). |
| Terminale ES | `data.js` + `fiches.js` / `qcm.js` / `exos.js` ; `retro.js` | Atmosphère et climat, Rétroactions | Fiches + rappel espacé, QCM en parties, entraînement à paliers + sujets chronométrés, ateliers de simulation |
| **Simulateur climatique** (Terminale ES, sur le moteur `lune.js`) | `simc_widgets.js` + `simc_data.js` | Modéliser le climat du futur (1.3) | Modèle 0D (cycle du carbone, effet de serre, océan à deux couches, niveau des mers, rétroactions activables), simulations nommées superposées, courbe animée, curseur d'année, tableau adaptatif ; tâches `hasSim(E, masque)` ; valeurs des réponses calculées par le modèle (`V`) |
| **Laboratoires de modélisation** (Terminale ES, moteur `lune.js`) | `mod_widgets.js` + `mod_data.js` + `mod_maps.js` | Le laboratoire du climatologue (1.3) | Cartes terre/mer en canvas (`mod_maps.js`, généré depuis `global-land-mask`), graphique générique `lchart()` (bandes, marqueurs, curseur), bilan d'énergie par latitude, Lorenz, modèle paléo itératif, ensemble de 12 modèles (attribution et scénarios SSP) ; paragraphe synthétique construit partie après partie (`para: true`, `paraParts()`) |
| **Génétique des populations** (Terminale ES, moteur `lune.js`) | `hw_widgets.js` + `hw_data.js` + `hw.css` | Le modèle de Hardy-Weinberg (3.1, activité 2) | Population d'araignées triable (positions en CSS, transition) et urne d'allèles où les jetons volent (`fly()`), bal des gamètes (tableau de croisement rempli en direct), carré p × q animé (`animCtl`), tableur avec barre de formule (Python en déblocage), labo des forces évolutives (sélection, dérive de Wright-Fisher, migration, mutation ; courbes propres à chaque étape, observations superposées), comparateur effectifs observés / attendus. Repère de graphique commun `frame()`. Tests : `test/hw/` (`smoke.py`, `flow.py [largeur hauteur suffixe]`). |
| **Labo d'exercices animés** (5e, moteur `lune.js`) | `msv_widgets.js` + `msv_data.js` | Masse et volume, le labo de mesure (Mission 4) | Feuille d'exercices transformée en TP virtuels : éprouvette + loupe (parallaxe), déplacement d'eau, balance avec tare, défi chrono, tableau de conversion, effet `boom()` ; conversions générées (`convG` / `convL`) |
| **DNL anglais 5e** (moteurs `fusee.js` / `lune.js`) | `dnl.js` + `dnl.css` + `*_en_data.js` + `*_en.json` | Building a rocket, Phases of the Moon (Mission 5) | Données en anglais (A2-B1), mots-clés EN → FR avec bouton 🔊 (`KW()`, synthèse vocale de l'appareil), glossaire (`glossTable()`) et « Can I do it? » (`canDo()`) dans le bilan, étape « Mission log » (compétence `lang`). Moteur et widgets traduits par paires `[fr, en]` : `en` accepte une liste de fichiers de paires, `en_files` les fichiers JS à traduire. Contrôle : `test/dnl/scan.py URL [version]` liste le français resté affiché. |
| **Fiche de révision animée** (2nde, moteur `lune.js`) | `metab_widgets.js` + `metab_data.js` + `metab.css` | Le métabolisme des cellules (2nde, Th1 Ch2) | Une fiche de cours découpée en étapes : chaque étape = extrait de la fiche (`docs`) + animation (`widget`) + vérifications à deux versions. Molécules en boules (`mol()`, `hexa()`, `spark()`), légendes HTML (`legend()`), repères numérotés (`pin()`), règle virtuelle et barre d'échelle (`ruler()`), particules le long d'un trajet (`along()`), ExAO à deux graphiques synchronisés avec lecture au toucher. Tests : `test/metab/` (`smoke.py`, `flow.py`, `crit.py`, `shots.py` avec horloge accélérée). |
| TP ExAO | `elodee/` (`python3 elodee/build.py` → `elodee/dist/`, puis `outils/adapter.py`) | TP élodée FR + DNL (2nde) | ExAO virtuelle, documents, fiche élève |

Contrat de données du gabarit « parcours à étapes » : `HOME`, `GROUPS` (parties → étapes → `parts`), `RAPPEL`, `RESUME`, `bilanHTML`, `WID` (widgets), `LIVE`.
Types de `parts` : `num`, `word`, `choice`, `multi`, `rows`, `match`, `order`, `shot`, `task` (`done()` → `{ok, msg}`), `grid`, `plot`.

### Deux versions dans le même fichier (guidée / lycée)
`bio.js` (Biodiversité 2nde) sait proposer deux versions d'une même activité : chaque étape peut porter un bloc `L` (`parts`, `hints`, `pre`, `corr`) qui remplace les questions guidées en version lycée (voir `LYCEE` dans `bio_data.js`). Types de questions ajoutés : `redac` (réponse rédigée ; `crit` = éléments attendus repérés par mots-clés, un point chacun ; `model` = réponse modèle ; auto-validation possible après le corrigé) et `list` (éléments à citer, `need` / `bad`). Réponses et scores séparés par version (`S.it` / `S.itL`), manipulations communes. Lien direct : `?version=lycee`. Tests : `test/b/flow_l.py`, `smoke_l.py`, `lycee_crit.py` (réponses types pour régler les mots-clés).

## Bibliothèques communes
- `core.js` / `core.css` : `$`, `$$`, `Store` (localStorage protégé), `fmt`, `parseNum`, `fuzzy`, `normTxt`, `esc`, `Display` (A+/A−, sombre, projection), `armButton` (validation en deux temps), `renderBilanTools` (.txt, Copier, Montrer), `showOverlay`, `mountChart`, `buildTable`.
- `kit.js` : `nb()` / `typo()` (espaces insécables), `tbl()`, `liveSVG(host, (W, F) => svg)` (redessin à la largeur réelle), `sT()` (texte SVG), `TK()`, `arrow()`, `animCtl()` (Lancer / Pause / Recommencer).
- `svt.css` (vert SVT), `mouv.css` (5e).

## Publier
1. Catalogue : ajouter l'activité dans `outils/catalogue.json` (`fichier`, ou `chemin` depuis la racine pour afficher une app déjà en ligne ailleurs). Toujours réécrire avec `json.dumps(c, ensure_ascii=False, indent=1)`.
2. `python3 outils/generer_pages.py`
3. `git pull --ff-only`, commit, `git push origin HEAD:main`.
4. Déploiement : `gh run list --repo fontesmoreira-star/svt --limit 1` (github.io n'est pas joignable depuis l'espace de travail).

## Pièges connus
- `liveSVG` dessine **immédiatement** : une variable utilisée dans le dessin doit être déclarée avant l'appel.
- Les tableaux à beaucoup de colonnes débordent sur téléphone : découper en blocs ou passer en colonne (voir `tblX` dans `m4b_plot.js`).
- `anciens/` : sources remplacées (Mission 4 v1, variantes de `exos.js`), gardées pour référence.
