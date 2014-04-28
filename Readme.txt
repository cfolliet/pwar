Pour installer les dépendances :
shift + click droit --> Ouvrir une fenêtre des commandes ici
Taper "npm install" entrer...

Les modules seront télécharger dans le dossier node_modules

Pour lancer le serveur:
Taper "node server"

Les règles du jeu:
- une carte avec un nombre p de planètes de taille aléatoire (p est fonction du nombre de joueur)
- une planète génère un nombre u d'unités toutes les s secondes (u est fonction de la taille de la planète)
- un joueur peut envoyer 50% des unités d'une planète vers une autre planète
  - si la planète de destination est occupé par un adversaire:
    - si l'attaquant à le plus d'unité, l'attaquant gagne la planète, il y restera le resultat de nombre-unité-attaquant - nombre-unité-defenseur
    - si l'attaquant à moins d'unité que le défenseur, le défenseur restera avec le resultat de nombre-unité-defenseur - nombre-unité-attaquant
    
- le jeu se termine lorsqu'un joueur à tué tous les autres
