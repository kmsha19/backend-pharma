PharmaConnect Backend

Ce backend fournit l'API pour la gestion des utilisateurs, des rendez-vous, des professionnels, et des patients pour l'application PharmaConnect. Il est développé avec Node.js, Express et utilise MongoDB via Mongoose comme base de données.
Technologies Utilisées

    Node.js (serveur backend)
    Express (framework backend)
    Mongoose (ODM pour MongoDB)
    JWT (authentification basée sur les tokens)
    Bcrypt.js (pour le hachage des mots de passe)
    Dotenv (pour la gestion des variables d'environnement)
    Express-validator (pour la validation des entrées utilisateur)

Structure des Fichiers (Arborescence)

bash

backend-pharma
├── config
│   └── db.js                  # Configuration de la connexion MongoDB
├── controllers                # Contient la logique métier
│   ├── appointmentController.js  # Gestion des rendez-vous
│   ├── authController.js         # Gestion de l'authentification
├── middleware                 # Middlewares de gestion des requêtes
│   └── authMiddleware.js       # Middleware pour la vérification des tokens JWT
├── models                     # Modèles de base de données Mongoose
│   ├── Appointment.js          # Modèle de rendez-vous
│   ├── Conversation.js         # Modèle de conversation (en attente)
│   ├── Message.js              # Modèle de message (en attente)
│   ├── Professional.js         # Modèle pour les professionnels de santé
│   └── User.js                 # Modèle utilisateur générique
├── routes                     # Routes définissant l'API
│   ├── appointmentRoutes.js    # Routes pour les rendez-vous
│   ├── authRoutes.js           # Routes pour l'authentification
│   ├── disponibiliteRoutes.js  # Routes pour les disponibilités des professionnels
│   ├── userRoutes.js           # Routes utilisateur (patients et professionnels)
├── server.js                   # Point d'entrée du serveur Express
├── package.json                # Dépendances et scripts de l'application backend
└── README.md                   # Documentation du projet backend

Installation et Lancement

    Cloner le projet :

bash

git clone https://github.com/votre-repo/pharma-connect.git
cd backend-pharma

    Installer les dépendances avec Yarn ou NPM :

bash

yarn install
# ou avec npm
npm install

    Créer un fichier .env à la racine avec les variables suivantes :

makefile

MONGO_URI=mongodb://<votre-base-de-données>
JWT_SECRET=<votre-secret-jwt>

    Démarrer le serveur en mode développement :

bash

yarn start
# ou avec npm
npm start

L'API sera accessible à l'adresse http://localhost:5000.
Fonctionnalités
Actuellement disponibles :

    Inscription et Connexion pour les utilisateurs (patients et professionnels).
    Gestion des rendez-vous pour les patients et les professionnels.
    Disponibilités des professionnels pour permettre aux patients de réserver des créneaux.
    Gestion des tokens JWT pour l'authentification sécurisée.
    Middleware d'authentification pour protéger les routes sensibles.

À faire :

    Messagerie en temps réel entre patients et professionnels (partie conversations/messages à implémenter).
    Améliorations des validations d'entrée et gestion plus avancée des erreurs.
    Tests automatisés pour garantir la robustesse de l'API.

Avancement Global
Frontend :

    Complété à 80%.
    Fonctionnalités principales implémentées, reste à peaufiner le style et à ajouter la partie messagerie.
    À finaliser : amélioration de l'UX/UI et gestion des conversations.

Backend :

    Complété à 75%.
    Les routes principales sont en place, la gestion des rendez-vous, utilisateurs, et disponibilités fonctionne bien.
    À finaliser : messagerie, optimisation et tests unitaires.

Notes

    Contributions : Toute aide pour l'amélioration de la messagerie ou l'implémentation de nouvelles fonctionnalités est la bienvenue !
    Dépendances : Vérifiez que toutes les dépendances sont bien installées et configurées (notamment MongoDB).
    Derniers Bugs : Les bugs restants sont principalement liés à la gestion des messages et à certaines validations.
