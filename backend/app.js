/*---------------------------------------------------------*/
/* Création de notre application 'app' pour notre server : */
/*---------------------------------------------------------*/

/* Importation du module (package) 'express' de node */
const express = require('express');
// /* Importation du module (package) 'mongoose' */
// const mongoose = require('mongoose');
/* Importation du module (package) 'path' */
const path = require('path');

/* Importation de notre router pour user 'userRoutes' */
const userRoutes = require('./routes/user');
/* Importation de notre router pour message 'messageRoutes' */
const messageRoutes = require('./routes/message');

/* Création de notre application express 'app' */
const app = express();

// /* Connexion à la database mongodb Atlas */
// const MONGOOSE_PWD = process.env.MONGOOSE_PWD;
// mongoose.connect(`mongodb+srv://Stecau:${MONGOOSE_PWD}@clusterstecau.rlrnod6.mongodb.net/Piiquante?retryWrites=true&w=majority`,
//     { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connexion à MongoDB réussie !'))
//     .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Extraction corps JSON de la requête POST venant de l'application front-end avec le middleware Express */
app.use(express.json());

/* Création de la fonction de requête par la méthode 'use' de express */
    // 1ère étape, rajout des headers pour éviter les problème de CORS
app.use((req, res, next) => {
    // accéder à notre API depuis n'importe quelle origine ( '*' )
    res.setHeader('Access-Control-Allow-Origin', '*');
    // ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/* Utlisation de notre router 'userRoutes' pour notre application 'app' */
app.use('/api/auth', userRoutes);
/* Rajout d'une route statique pour la récupération des images sur le serveur */
app.use('/images', express.static(path.join(__dirname, 'images')));
/* Utlisation de notre router 'messageRoutes' pour notre application 'app' */
app.use('/api/messages', messageRoutes);


/* exportation de cette application pour y accéder depuis les autres fichiers de notre projet */
module.exports = app;