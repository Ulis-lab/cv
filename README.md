# Créateur de CV — version web (Beta 0.3.2)

Un outil simple pour aider les élèves à faire leur CV : on remplit un formulaire, on choisit un modèle, on personnalise (couleur, police, forme et cadrage de la photo), puis on enregistre.

**Rien à installer** : ça marche directement dans Chrome ou Edge.

## Utilisation
- **Remplir mon CV** : le formulaire à gauche, l'aperçu à droite.
- **Photo** : clique sur la photo du CV pour la déplacer et zoomer.
- **Sauvegarder / Charger** : enregistre le CV dans un petit fichier `.json` pour le reprendre plus tard.
- **PowerPoint (.pptx)** : télécharge le CV en PowerPoint.
- **PDF** : ouvre l'impression, choisir « Enregistrer au format PDF ».
- **Imprimer** : impression directe.

## Vie privée
Tout se passe dans le navigateur de l'élève. Aucune information (nom, photo, etc.) n'est envoyée sur internet ni stockée ici. 

## Pour les curieux
Le même code existe en application Windows portable (Electron). Seul le fichier `web-bridge.js` change : il remplace l'enregistrement par des téléchargements et l'impression du navigateur.
