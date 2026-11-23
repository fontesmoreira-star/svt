# Activités interactives SVT, EIST et Enseignement scientifique

Site : https://fontesmoreira-star.github.io/svt/

Applications HTML autonomes (un fichier par activité, sans dépendance externe), rangées par niveau, thème et chapitre.

| Niveau | Dossier | Page à donner aux élèves |
|---|---|---|
| 5e EIST | `5e/` | https://fontesmoreira-star.github.io/svt/5e/ |
| 4e SVT | `4e/` | https://fontesmoreira-star.github.io/svt/4e/ |
| 3e SVT | `3e/` | https://fontesmoreira-star.github.io/svt/3e/ |
| 2nde SVT | `2nde/` | https://fontesmoreira-star.github.io/svt/2nde/ |
| Terminale ES | `terminale/` | https://fontesmoreira-star.github.io/svt/terminale/ |
| Terminale spé SVT | `terminale-spe/` | https://fontesmoreira-star.github.io/svt/terminale-spe/ |

Chaque thème et chaque chapitre qui contient une activité a aussi sa propre page, par exemple `3e/vivant-evolution/ch2-transmission/`.

Aucune collecte de données : la progression reste dans le navigateur de l'élève, et le bilan ne sort que par une action de l'élève (téléchargement .txt, copie, écran « Montrer au professeur »).

## Ajouter une activité
1. Adapter l'app écrite pour claude.ai : `python3 outils/adapter.py source.html <niveau>/<thème>/<chapitre>/nom.html`
2. Ajouter l'activité dans `outils/catalogue.json` (au niveau, au thème ou au chapitre).
3. Régénérer les pages : `python3 outils/generer_pages.py`
4. Publier (commit + push) : le site est à jour en 1 à 2 minutes.

Pour afficher une app déjà en ligne dans une autre rubrique sans la copier (par exemple les activités de 2nde dans « Cours Miya »), mettre dans le catalogue une clé `chemin` (chemin depuis la racine du site) à la place de `fichier`.

## Rubriques cachées
Un niveau du catalogue marqué `"cache": true` n'apparaît pas sur l'accueil, et ses pages et ses apps portent `noindex` (non référencées par les moteurs de recherche). L'adresse n'est connue que de ceux à qui on la donne, mais le dépôt reste public : n'y mettre ni nom de famille, ni note, ni adresse personnelle.
Une thématique peut avoir sa propre couleur (`"couleur": "pc"` = bleu physique-chimie).

## Atelier
Le dossier `atelier/` contient les sources de toutes les apps, le script de construction, les tests et la charte commune (`atelier/CHARTE.md`). Mode d'emploi : `atelier/README.md`.

<!-- plan:debut (généré par outils/generer_pages.py, ne pas modifier à la main) -->
## Plan du site

### [5e EIST](https://fontesmoreira-star.github.io/svt/5e/) · 14 activités

- 📌 **Toute l'année** · [Mes automatismes de 5e](https://fontesmoreira-star.github.io/svt/5e/automatismes.html)
- ▫️ **Mission 1 · Le système solaire · Les voyages dans l'espace …** · à venir
  - ▫️ Chapitre 1 · Le système solaire · à venir
  - ▫️ Chapitre 2 · Les voyages dans l'espace · à venir
  - ▫️ Chapitre 3 · Les sources de lumière · à venir
  - ▫️ Chapitre 4 · La gestion de projet · à venir
- ▫️ **Mission 2 · Devenir astronaute** · à venir
  - ▫️ Chapitre 1 · Devenir astronaute · à venir
- ▫️ **Mission 3 · Le corps humain en impesanteur · Le mouvement et sa commande** · à venir
  - ▫️ Chapitre 1 · Le corps humain en impesanteur · à venir
  - ▫️ Chapitre 2 · Le mouvement et sa commande · à venir
- 📂 **Mission 4 · Charger la fusée** · [page](https://fontesmoreira-star.github.io/svt/5e/mission-4/)
  - 📌 [Mission 4 : l'entraînement de l'équipage (révision)](https://fontesmoreira-star.github.io/svt/5e/mission-4/revision-mission-4.html)
  - 📁 **Chapitre 1 · Les micro-organismes**
    - [Un repas, des bactéries… et des maths](https://fontesmoreira-star.github.io/svt/5e/mission-4/micro-organismes/echiquier-bacteries.html) · Défi
    - [A meal, some bacteria… and maths](https://fontesmoreira-star.github.io/svt/5e/mission-4/micro-organismes/bacteria-chessboard.html) · English · DNL
  - 📁 **Chapitre 2 · Masse et volume**
    - [⚡ Le labo de mesure : masse et volume](https://fontesmoreira-star.github.io/svt/5e/mission-4/masse-volume/masse-et-volume.html) · Labo · exercices animés
  - 📁 **Chapitre 3 · Les changements d'état**
    - [Quand l'eau se met à bouillir](https://fontesmoreira-star.github.io/svt/5e/mission-4/changements-etat/ebullition-eau.html) · TP virtuel
  - ▫️ Chapitre 4 · Les micro-organismes et la santé · à venir
- 📂 **Mission 5 · Le décollage · Le mouvement …** · [page](https://fontesmoreira-star.github.io/svt/5e/mission-5/)
  - 📌 [Mission 5 : la check-list avant le décollage (révision)](https://fontesmoreira-star.github.io/svt/5e/mission-5/revision-mission-5.html)
  - 📁 **Chapitre 1 · Le décollage**
    - [Le décollage et le corps humain](https://fontesmoreira-star.github.io/svt/5e/mission-5/decollage/decollage-corps-humain.html) · Mission Mars
  - 📁 **Chapitre 2 · Le mouvement**
    - [Vitesses et mouvements](https://fontesmoreira-star.github.io/svt/5e/mission-5/mouvement/vitesses-mouvements.html) · Activités 2 et 3
    - [Construire une fusée](https://fontesmoreira-star.github.io/svt/5e/mission-5/mouvement/construire-une-fusee.html) · Activité 4 · Technologie
    - [Building a rocket (Science in English)](https://fontesmoreira-star.github.io/svt/5e/mission-5/mouvement/building-a-rocket-dnl.html) · Activité 4 · DNL anglais
  - 📁 **Chapitre 3 · Signaux lumineux : le système Soleil-Terre-Lune**
    - [Pourquoi la Lune change-t-elle d'apparence ?](https://fontesmoreira-star.github.io/svt/5e/mission-5/soleil-terre-lune/phases-de-la-lune.html) · Activité 5 · Physique-chimie
    - [Why does the Moon look different every night? (Science in English)](https://fontesmoreira-star.github.io/svt/5e/mission-5/soleil-terre-lune/phases-of-the-moon-dnl.html) · Activité 5 · DNL anglais
  - ▫️ Chapitre 4 · Les sources et conversions d'énergie · à venir
- 📂 **Mission 6 · Tempête de sable** · [page](https://fontesmoreira-star.github.io/svt/5e/mission-6/)
  - 📁 **Chapitre 1 · L'énergie éolienne**
    - [Peut-on utiliser l'énergie éolienne sur Mars ?](https://fontesmoreira-star.github.io/svt/5e/mission-6/energie-eolienne/eolienne-sur-mars.html) · Activité 1
  - ▫️ Chapitre 2 · La programmation · à venir
- ▫️ **Mission 7 · Nourrir les marsonautes · La nutrition des végétaux** · à venir
  - ▫️ Chapitre 1 · Nourrir les marsonautes · à venir
  - ▫️ Chapitre 2 · La nutrition des végétaux · à venir
- ▫️ **Mission 8 · L'énergie et ses conversions : les circuits électriques** · à venir
  - ▫️ Chapitre 1 · L'énergie et ses conversions : les circuits électriques · à venir
- ▫️ **Mission 9 · La respiration des animaux** · à venir
  - ▫️ Chapitre 1 · La respiration des animaux · à venir
- ▫️ **Mission 10 · La digestion** · à venir
  - ▫️ Chapitre 1 · La digestion · à venir
- ▫️ **Mission 11 · La circulation sanguine** · à venir
  - ▫️ Chapitre 1 · La circulation sanguine · à venir
- ▫️ **Mission 12 · Les volcans de Mars** · à venir
  - ▫️ Chapitre 1 · Les volcans de Mars · à venir
- ▫️ **Mission 13 · Les signaux lumineux** · à venir
  - ▫️ Chapitre 1 · Les signaux lumineux · à venir

### [4e SVT](https://fontesmoreira-star.github.io/svt/4e/) · 2 activités

- 📂 **Thème 1 · La planète Terre, l'environnement et l'action humaine** · [page](https://fontesmoreira-star.github.io/svt/4e/planete-terre/)
  - 📁 **Chapitre 1 · La tectonique des plaques**
    - [Plaques en mouvement](https://fontesmoreira-star.github.io/svt/4e/planete-terre/tectonique-des-plaques/plaques-en-mouvement.html) · Séance animée · 45 min
- ▫️ **Thème 2 · Le vivant et son évolution** · à venir
- 📂 **Thème 3 · Le corps humain et la santé** · [page](https://fontesmoreira-star.github.io/svt/4e/corps-sante/)
  - 📁 **Chapitre 1 · Puberté et reproduction humaine**
    - [Devenir adulte : la puberté](https://fontesmoreira-star.github.io/svt/4e/corps-sante/puberte-reproduction/devenir-adulte.html) · Séance animée · 45 min

### [3e SVT](https://fontesmoreira-star.github.io/svt/3e/) · 12 activités

- 📌 **Toute l'année** · [Mes automatismes de 3e](https://fontesmoreira-star.github.io/svt/3e/automatismes.html)
- 📂 **Thème 1 · Le vivant et son évolution** · [page](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/)
  - 📁 **Chapitre 1 · L'information génétique**
    - [Je révise le chapitre 1](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/ch1-information-genetique/revision-chapitre-1.html) · Révision · activités 1 à 6
    - [Je révise toute la génétique](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/ch2-transmission/revision-genetique-activites-1-10.html) · Révision · activités 1 à 10
  - 📁 **Chapitre 2 · La transmission de l'information génétique**
    - [Enquête caryotypes](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/ch2-transmission/enquete-caryotypes.html) · Enquête · dossier 6
    - [Labo d'agglutination](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/ch2-transmission/labo-agglutination.html) · Enquête · dossier 7
    - [TP noté : le test d'agglutination](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/ch2-transmission/labo-agglutination-tp-note.html) · TP noté sur 10 · dossier 7
    - [L'arbre de Jean](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/ch2-transmission/arbre-jean.html) · Enquête · dossier 8
    - [Activité notée : l'arbre de Jean](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/ch2-transmission/arbre-jean-note.html) · Activité notée sur 10 · dossier 8
    - [La multiplication cellulaire](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/ch2-transmission/multiplication-cellulaire.html) · Activité 9
    - [Activité notée : la multiplication cellulaire](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/ch2-transmission/multiplication-cellulaire-note.html) · Activité notée sur 10 · activité 9
    - [Reconstituer les étapes de la méiose](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/ch2-transmission/meiose-cellules-reproductrices.html) · Activité 10
    - [Je révise toute la génétique](https://fontesmoreira-star.github.io/svt/3e/vivant-evolution/ch2-transmission/revision-genetique-activites-1-10.html) · Révision · activités 1 à 10
  - ▫️ Chapitre 3 · Diversité et évolution des êtres vivants · à venir
- ▫️ **Thème 2 · Le corps humain et la santé** · à venir
  - ▫️ Chapitre 4 · Le monde microbien et la santé · à venir
- ▫️ **Thème 3 · La planète Terre, l'environnement et l'action humaine** · à venir

### [2nde SVT](https://fontesmoreira-star.github.io/svt/2nde/) · 10 activités

- 📌 **Toute l'année** · [Mes automatismes de 2nde](https://fontesmoreira-star.github.io/svt/2nde/automatismes.html)
- 📂 **Thème 1 · La Terre, la vie et l'organisation du vivant** · [page](https://fontesmoreira-star.github.io/svt/2nde/theme-1/)
  - ▫️ Chapitre 1 · L'organisme pluricellulaire, un ensemble de cellules spécialisées · à venir
  - 📁 **Chapitre 2 · Le métabolisme des cellules**
    - [Les flux de matière dans l'environnement](https://fontesmoreira-star.github.io/svt/2nde/theme-1/metabolisme/flux-matiere.html) · Activité 2 · schéma fonctionnel
    - [L'étude d'un mutant de levure (Rho⁺ / Rho⁻)](https://fontesmoreira-star.github.io/svt/2nde/theme-1/metabolisme/levures-rho.html) · Activité 3 · étude de documents · ExAO
    - [TP Élodée : photosynthèse ou respiration ?](https://fontesmoreira-star.github.io/svt/2nde/theme-1/metabolisme/tp-elodee.html) · TP virtuel · ExAO
    - [Elodea Lab: photosynthesis or respiration?](https://fontesmoreira-star.github.io/svt/2nde/theme-1/metabolisme/elodea-lab.html) · English · DNL
    - [Pomme de terre et respiration cellulaire](https://fontesmoreira-star.github.io/svt/2nde/theme-1/metabolisme/pomme-de-terre-metabolisme.html) · Activité · enzymes et respiration
    - [TP noté : l'action de l'amylase sur l'amidon](https://fontesmoreira-star.github.io/svt/2nde/theme-1/metabolisme/tp-amylase-amidon-note.html) · TP noté sur 10 · 8 + manipulation /2
    - [Potato and cellular respiration](https://fontesmoreira-star.github.io/svt/2nde/theme-1/metabolisme/potato-metabolism-dnl.html) · English · DNL
    - [Le métabolisme des cellules : la fiche animée](https://fontesmoreira-star.github.io/svt/2nde/theme-1/metabolisme/fiche-animee-metabolisme.html) · Fiche de révision animée
  - 📁 **Chapitre 3 · Les échelles de la biodiversité**
    - [Espèce, parentés et échelles de la biodiversité](https://fontesmoreira-star.github.io/svt/2nde/theme-1/echelles-biodiversite/trois-echelles-biodiversite.html) · Activité · TP virtuels
  - ▫️ Chapitre 4 · La biodiversité change au cours du temps · à venir
  - ▫️ Chapitre 5 · Les forces évolutives : sélection naturelle et dérive génétique · à venir
  - ▫️ Chapitre 6 · Communication intra-spécifique et sélection sexuelle · à venir
- ▫️ **Thème 2 · Les enjeux contemporains de la planète** · à venir
  - ▫️ Chapitre 1 · L'érosion, processus et conséquences · à venir
  - ▫️ Chapitre 2 · Sédimentation et milieux de sédimentation · à venir
  - ▫️ Chapitre 3 · Érosion et activité humaine · à venir
  - ▫️ Chapitre 4 · Structure et fonctionnement des agrosystèmes · à venir
  - ▫️ Chapitre 5 · Caractéristiques des sols et production de biomasse · à venir
  - ▫️ Chapitre 6 · Vers une gestion durable des agrosystèmes · à venir
- ▫️ **Thème 3 · Corps humain et santé** · à venir
  - ▫️ Chapitre 1 · Corps humain : de la fécondation à la puberté · à venir
  - ▫️ Chapitre 2 · Cerveau, plaisir, sexualité · à venir
  - ▫️ Chapitre 3 · Hormones et procréation humaine · à venir
  - ▫️ Chapitre 4 · Agents pathogènes et maladies vectorielles · à venir
  - ▫️ Chapitre 5 · Microbiote humain et santé · à venir

### [Terminale · Enseignement scientifique](https://fontesmoreira-star.github.io/svt/terminale/) · 7 activités

- 📂 **Thème 1 · Science, climat et société** · [page](https://fontesmoreira-star.github.io/svt/terminale/theme-1/)
  - 📌 [Fiches Atmosphère et climat](https://fontesmoreira-star.github.io/svt/terminale/theme-1/fiches-atmosphere-climat.html)
  - 📌 [Entraînement Atmosphère et climat](https://fontesmoreira-star.github.io/svt/terminale/theme-1/entrainement-atmosphere-climat.html)
  - 📌 [QCM Atmosphère et climat](https://fontesmoreira-star.github.io/svt/terminale/theme-1/qcm-atmosphere-climat.html)
  - ▫️ 1.1 · L'atmosphère terrestre et la vie · à venir
  - 📁 **1.2 · La complexité du système climatique**
    - [Évolution de la température et rétroactions](https://fontesmoreira-star.github.io/svt/terminale/theme-1/1-2-systeme-climatique/temperature-retroactions.html) · Ateliers
  - 📁 **1.3 · Le climat du futur**
    - [Activité 1 · Manipuler un modèle climatique simple](https://fontesmoreira-star.github.io/svt/terminale/theme-1/1-3-climat-futur/simulateur-climat-futur.html) · Simulation · 2 versions
    - [Activité 2 · Le laboratoire du climatologue](https://fontesmoreira-star.github.io/svt/terminale/theme-1/1-3-climat-futur/comment-sont-faits-les-modeles.html) · Laboratoires · 2 versions
- ▫️ **Thème 2 · Le futur des énergies** · à venir
  - ▫️ 2.1 · Deux siècles d'énergie électrique · à venir
  - ▫️ 2.2 · Les atouts de l'électricité et l'optimisation de son transport · à venir
  - ▫️ 2.3 · Énergie, choix de développement et futur climatique · à venir
- 📂 **Thème 3 · Une histoire du vivant** · [page](https://fontesmoreira-star.github.io/svt/terminale/theme-3/)
  - 📁 **3.1 · La biodiversité et son évolution**
    - [Activité 1 · Estimer un effectif par capture-marquage-recapture](https://fontesmoreira-star.github.io/svt/terminale/theme-3/3-1-biodiversite/methode-capture-marquage-recapture.html) · Simulation · 2 versions
  - ▫️ 3.2 · L'évolution comme grille de lecture du monde · à venir
  - ▫️ 3.3 · L'évolution humaine · à venir
  - ▫️ 3.4 · Les modèles démographiques · à venir
  - ▫️ 3.5 · De la machine de Turing à l'intelligence artificielle · à venir

### [Terminale · Spécialité SVT](https://fontesmoreira-star.github.io/svt/terminale-spe/) · 1 activité

- 📂 **Thème 1 · Génétique et évolution** · [page](https://fontesmoreira-star.github.io/svt/terminale-spe/genetique-evolution/)
  - 📁 **Chapitre 5 · La complexification des génomes : transferts horizontaux et endosymbioses**
    - [Transferts horizontaux de gènes](https://fontesmoreira-star.github.io/svt/terminale-spe/genetique-evolution/ch5-complexification-genomes/transferts-horizontaux.html) · Documents

<!-- plan:fin -->
