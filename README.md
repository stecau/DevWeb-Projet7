# GROUPOMANIA

API du réseau social interne du groupe GROUPOMANIA

## GROUPOMANIA APIs

Cette API est un ensemble de deux APIs et d'une base de données.&nbsp;
L'ensemble de l'API fait appel au langage JavaScript et à node.js&nbsp;
L'API frontend est  basée sur le framework React disponible dans node.js.&nbsp;
L'API backend est un serveur node.js avec une app express.js&nbsp;
La base de données est une base de données relationnelle SQL qui est gérée par le serveur avec le module mySQL pour node.js.

## Récupération de GROUPOMANIA APIs

Cloner le repository github : https://github.com/stecau/DevWeb-Projet7 (branche main) ou copier un zip de la branche main.

### Installation de l'API frontend

Pour pouvoir utiliser l'API frontend, après avoir récupéré l'ensemble des fichiers de dépôt github, vous devez avoir le gestionnaire de package npm de node.js.&nbsp;
1. Déplacez-vous dans le dossier 'frontend' : dans un terminal 'cd frontend'&nbsp;
2. Executez dans le même terminal la commande suivante : 'npm install'&nbsp;
3. Normalement, l'installation des dépendences de l'application frontend doit se lancer&nbsp;
4. Et ensuite, pour lancer l'application en elle-même, utilsez la commande 'npm start'&nbsp;

Par la suite, il suffira de se déplacer dans le dossier frontend et de lancer la commande 'npm start'. L'instllation étant déjà réalisée, l'application se lancera immédiatement (un peu plus d'information avec le fichier readme.md dans le dossier frontend)

### Installation de l'API backend

Pour pouvoir faire communiquer le navigateur avec la base de données, vous devez installer et lancer le serveur Node.js Express.&nbsp;
Pour cela :&nbsp;
1. Déplacez-vous dans le dossier 'backend' : dans un terminal 'cd backend'&nbsp;
2. Executez dans le même terminal la commande suivante : 'npm install'&nbsp;
3. Normalement, l'installation des dépendences de l'application backend doit se lancer&nbsp;
4. Et ensuite, pour lancer l'application en elle-même, utilsez la commande 'npm start'&nbsp;

Par la suite, il suffira de se déplacer dans le dossier backend et de lancer la commande 'npm start'. L'instllation étant déjà réalisée, l'application se lancera immédiatement (un peu plus d'information avec le fichier readme.md dans le dossier backend).

### Connexion à la base de données et autres options (TOKEN et port d'écoute du serveur backend)

L'API backend est configurée pour se connecter automatiquement à la base de données.&nbsp;
Cependant pour des questions de sécurité, vous devez avoir les accès spécifiques à cette base qui sont stockés dans un fichier .env dans le dossier backend.&nbsp;
Ce fichier contient également le port d'écoute par défaut du serveur ainsi qu'une clé secrète utilisée pour générer les TOKENs de connexion des utilisateurs frontend (navigateur) afin d'établir le dialogue avec la base de données par l'intermédiaire du serveur.&nbsp;
Si vous avez reçu le fichier .env, c'est que vous êtes un utilisateur validé.

#### Installation de la base de données mySQL

Pour pouvoir utiliser la base de données en local, vous devez avoir mySQL d'installer sur votre machine.&nbsp;
Une fois mySQL installé si vous ne l'avais pas déjà, importez la base de données GROUPOMANIA tout simplement.&nbsp;
Le fichier a importé est : 'groupomania.sql'&nbsp;
En ligne de commande dans un terminal cela donne normalement :&nbsp;
    mysql -u [utilisateur] -p groupomania < groupomania.sql&nbsp;
Comme vous le remarquez, il faut un utilisateur et le nom de la base de données (ici groupomania) mais également un mot de passe. Ces informations (utilisateur, normalement 'root' et le mot de passe) sont les votre. Il faudra cependant dansles mettre dans le fichier .env précédenment cité.&nbsp;

Le fichier .env est de la forme : &nbsp;
PORT=4000&nbsp;
DB_CONFIG = '{&nbsp;
    "host": "127.0.0.1",&nbsp;
    "user": "user name entre guillement",&nbsp;
    "password": "mot de passe entre guillement",&nbsp;
    "database": "groupomania"&nbsp;
}'
RANDOM_TOKEN_SECRET=" la clé pour la génération des token"&nbsp;

BONNE NAVIGATION !!!
