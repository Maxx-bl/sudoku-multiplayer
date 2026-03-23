# 🧩 Modern Sudoku — Solo & Multijoueur

Une application de Sudoku moderne, fluide et responsive, développée en JavaScript pur (Vanilla JS). Ce projet propose une expérience utilisateur soignée avec une esthétique néon-sombre, des animations fluides et un mode multijoueur compétitif (simulé).

![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![Licence](https://img.shields.io/badge/license-MIT-blue)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)

---

## ✨ Fonctionnalités

* **Mode Solo** : 3 niveaux de difficulté (Facile, Moyen, Difficile) avec génération de grilles uniques.
* **Mode 1v1 (Simulé)** : Affrontez un adversaire en temps réel avec une barre de progression comparative.
* **Système de Notes** : Mode "crayon" intégré pour noter vos hypothèses dans les cellules.
* **Aides au jeu** : 
    * Mise en surbrillance intelligente (ligne, colonne, bloc et chiffres identiques).
    * Détection d'erreurs en temps réel.
    * Système d'indices (Hint) et fonction Annuler (Undo).
* **Design Futuriste** : Interface "Dark Mode" avec effets de grain, flous de mouvement et typographies modernes.
* **Responsive** : Optimisé pour une expérience fluide sur desktop, tablette et smartphone.

---

## 🚀 Installation & Utilisation

Le projet est "Zero-Dependency" : il ne nécessite aucun serveur ni installation complexe.

1.  **Cloner le dépôt** :
    ```bash
    git clone [https://github.com/votre-utilisateur/sudoku-modern.git](https://github.com/votre-utilisateur/sudoku-modern.git)
    ```
2.  **Accéder au dossier** :
    ```bash
    cd sudoku-modern
    ```
3.  **Lancer le jeu** :
    Ouvrez simplement le fichier `index.html` dans votre navigateur.

---

## 📂 Structure du projet

Le code est séparé pour respecter les principes de modularité :

* `index.html` : Structure du DOM et conteneurs des écrans (Accueil, Lobby, Jeu).
* `style.css` : Design complet, variables CSS (thème), animations et media queries.
* `engine.js` : Moteur logique (Génération de grilles par backtracking, vérification de validité, algorithme de résolution).
* `app.js` : Contrôleur de l'application (Gestion des états, événements clavier/souris, chronomètre et interface utilisateur).

---

## 🛠️ Technologies utilisées

* **HTML5 / CSS3** : Utilisation de CSS Grid, Flexbox et variables natives.
* **JavaScript (ES6+)** : Manipulation du DOM, gestion d'état synchrone et timers.
* **Google Fonts** : *Space Mono* (chiffres), *Bebas Neue* (titres), *DM Sans* (texte).

---

## 🎮 Commandes de jeu

* **Sélection** : Clic de souris ou flèches directionnelles du clavier.
* **Insertion** : Chiffres `1` à `9` (Clavier ou Pavé numérique à l'écran).
* **Effacer** : Touche `0`, `Backspace` ou bouton "Effacer".
* **Notes** : Touche `N` ou bouton "Notes" pour basculer le mode annotation.

---

## 📜 Licence

Ce projet est distribué sous la licence **MIT**. Libre à vous de le modifier et de l'améliorer !

---
*Créé avec passion pour les amateurs de jeux de réflexion.*