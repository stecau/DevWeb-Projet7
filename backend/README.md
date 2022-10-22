# GROUPOMANIA
Dossier 'BackEnd' du serveur local pour l'API du réseau social interne de l'entreprise GROUPOMANIA.

## Serveur de l'API
Le serveur local a été développé sur une architecture NODE.JS (nodemon) + EXPRESS.JS avec une base de données MySQL.

## L'API
L'API s'appuie sur une structure APIRestful avec la structure CRUD.

Elle est structurée avec une arborescence séparée pour les routes, les controleurs, les middlewares (authentification et multer) et les modèles pour la base de données.

Le dossier 'Images' est pour le stockage sur le serveur des images utilisées par les clients pour illustrer les messages et la consultation par le frontend par les url (url image).

## Installation du backend et lancement du serveur en local
1. Copier/Cloner le repo github du backend
2. Installer npm (si pas d'installation) et lancer le projet API GROUPOMANIA avec 'npm install' ou 'npm i'
3. Récupérer le fichier '.env' pour obtenir la bonne confirguration (login et mot de passe de la base de données, port du serveur,...)
4. Lancer le serveur local avec 'npm start' ou 'nodemon serve'