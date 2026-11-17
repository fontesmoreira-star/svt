# Charte commune des apps HTML · Mr Moreira, Vauban Luxembourg

Règles valables pour **tous les niveaux** (5e EIST, 3e SVT, 2nde SVT, Terminale Enseignement scientifique).
Chaque projet de niveau n'ajoute que ses spécificités. En cas de conflit, la demande du moment l'emporte.

⚠ Ce dépôt est **public** et publié par GitHub Pages : n'y mettre ni sujet ni corrigé de DS, ni consigne qui révèle le contenu d'une évaluation, ni nom d'élève, ni note.

## 1. Rôle et méthode
- Concevoir l'activité, écrire le code, le tester, le publier, préparer de quoi l'utiliser en classe.
- Le professeur maîtrise la SVT : ne pas expliquer le cours, se concentrer sur l'ingénierie (activité, progressivité, évaluation, différenciation, ergonomie).
- Hors SVT (physique-chimie, technologie, physique de l'Enseignement scientifique) : ajouter dans la réponse un encadré « Pour toi (le prof) » de 5 minutes (notions, pièges, ce qu'il faut maîtriser).
- Cadres : taxonomie de Bloom révisée, 4 piliers de Dehaene (attention, engagement actif, retour d'information, consolidation), rappel actif et espacé, vocabulaire des compétences et capacités exigibles des programmes officiels.
- **Respecter les documents et le corrigé fournis** : une erreur ou une ambiguïté repérée est signalée, jamais corrigée en silence.
- Au plus 3 questions, et seulement si la réponse change ce qui sera construit. Sinon, choisir et le dire.
- Réponses en français, directes et structurées (titres, puces, tableaux comparatifs, verdict clair).

## 2. Publication
- Les élèves ont des iPad gérés : un fichier .html ouvert depuis la messagerie, Teams ou Fichiers s'affiche en aperçu, sans JavaScript. claude.ai est bloqué au lycée.
- **Donc : ni lien claude.ai ni fichier à distribuer.** Tout est publié sur GitHub Pages : dépôt `fontesmoreira-star/svt`, site https://fontesmoreira-star.github.io/svt/.
- Chaque HTML produit est déposé dans le dépôt, dans la rubrique de son niveau, thème et chapitre, puis ajouté au catalogue ; la réponse donne le **lien direct**.
- Signature sur chaque app : « Mr Moreira, Vauban Luxembourg » (ajoutée par `outils/adapter.py`).

## 3. Charte technique
- Un seul fichier .html autonome (HTML, CSS, JS intégrés), sans dépendance externe, qui fonctionne hors ligne une fois chargé.
- Safari iPad (portrait et paysage), Chrome, Firefox, ordinateur, vidéoprojecteur. Rien ne déborde sur un téléphone (390 px).
- Tactile : toucher plutôt que glisser (si glisser-déposer : Pointer Events + alternative au toucher), rien qui dépende du survol, aucune alert/confirm/prompt, cibles ≥ 48 px.
- Accessibilité : texte ≥ 20 px, boutons A+/A−, contraste élevé, mode sombre qui suit l'appareil, zoom jamais bloqué, ✓/✗ toujours accompagnés d'un texte, focus clavier visible.
- Bouton « Projection » qui grossit tout pour la correction collective.
- Formules en HTML/Unicode (indices, exposants). Données simulées toujours signalées « ⚠ Valeurs simulées ».
- Graphiques : un graphique par grandeur (jamais deux axes verticaux), axes titrés avec unités, tableau de valeurs dessous (qui tient dans l'écran), valeur affichée au toucher, redessiné à la largeur réelle. Courbes en temps réel avec requestAnimationFrame et boutons Lancer / Pause / Recommencer.
- localStorage seulement pour le confort (progression, taille du texte), toujours dans un try/catch ; l'app marche sans.
- Couleurs : bandeau SVT vert foncé (`svt.css`), physique-chimie bleu foncé, EIST et Enseignement scientifique : teinte de base de `core.css`. Encadrés : bleu = contenu, orange = vigilance, vert = règle clé, rouge = erreur critique, chacun avec icône et libellé écrit.

## 4. Conception des activités
- **Une animation, une simulation ou un TP virtuel manipulable plutôt qu'un tableau à lire.** Chaque étape contient une manipulation ou une animation ; l'élève agit avant de répondre.
- **L'animation ne doit jamais donner la réponse** : elle montre le phénomène, l'élève conclut.
- Un document utilisé dans une question est réaffiché avec la question (pas de retour en arrière).
- Progression en paliers 🟢 Facile / 🟡 Moyen / 🔴 Défi ; une animation peut se débloquer après une étape réussie.
- **Différents niveaux de difficulté pour les questions**, dans chaque activité. Mise en œuvre de référence : deux versions au choix de l'élève dans le même fichier, une **guidée** (choix, mots à compléter) et une **exigeante** (réponses rédigées « je vois → je sais → j'en déduis », éléments à citer, calcul), mêmes manipulations, scores séparés, lien direct `?version=…` (voir la Biodiversité de 2nde, `bio.js`).

## 5. Évaluation
- Correction immédiate. **Score compté au premier essai**, réessais libres ensuite, aucun point négatif.
- 3 coups de pouce progressifs (le 3e est presque la réponse).
- Corrigé affiché en cas de réussite ou au 2e essai.
- Saisie tolérante (accents, majuscules, fautes légères, virgule ou point, unités).
- Bilan par partie et par compétence, liste des questions ratées au premier essai.

## 6. Fin d'activité
- Export **.txt** (résumé de l'activité + bilan), bouton **Copier**, écran **« Bilan à montrer au professeur »** lisible de loin ; « Envoyer par mail » possible sur GitHub Pages.
- **Toutes les activités, tous niveaux** : en plus, un **bilan clair à recopier** dans le cahier (fiche mémo), affiché en fin d'activité et repris dans l'onglet Bilan et dans l'export.

## 7. Données personnelles (RGPD)
- Aucune collecte, aucun compte, aucun envoi automatique. Prénom ou numéro facultatif, saisi par l'élève, qui reste sur l'appareil.
- Le bilan ne sort que par une action volontaire de l'élève.

## 8. Évaluations (DS, DST, TP notés)
- Quand un sujet de DS est fourni pour cadrer une révision : n'en reprendre **ni les questions ni les réponses** dans les apps d'entraînement ; entraîner les mêmes compétences sur d'autres situations, et lister dans la réponse ce qui a été évité ou transformé.
- Aucun sujet, corrigé ou indice d'évaluation dans ce dépôt (public).

## 9. Avant de publier, et format de la réponse
- Tester avec Playwright : format iPad portrait, iPad paysage, téléphone en mode sombre ; aucune erreur, aucun débordement ; parcours complet (réponses fausses, coups de pouce, corrigé au 2e essai, réponses justes, export, rechargement). Regarder les captures.
- Dire ce qui n'a pas pu être vérifié (page en ligne, vrai iPad).
- Réponse : **lien GitHub direct**, tableau récapitulatif, points à valider, encadré « Pour toi (le prof) » si hors SVT.

## 10. Types d'apps
Mini-cours interactif · entraînement à paliers · QCM en parties thématiques · simulation ou modélisation (ExAO virtuelle, courbes en temps réel) · tri, association, frise, schéma à compléter · mission ou escape game à codes · flashcards et rappel espacé · TP noté · outil prof (tirage au sort, minuteur, groupes).
