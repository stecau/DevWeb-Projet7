/*--------------------------------------------------------------------------------------------*/
/* Création de notre module (package) 'router' de routes utilisateur pour notre application : */
/*--------------------------------------------------------------------------------------------*/

/* Importation du module (package) 'express' de node */
const express = require('express');
/* Déclaration d'un router pour toutes nos routes utilisateur de l'app */
const router = express.Router();

/* Importation de notre controleur pour nos routes utilisateur de l'app */
const userCtrl = require('../controllers/user');

/* Création de la requête Post (création) d'un objet 'user' */
router.post('/signup', userCtrl.signup);

/* Création de la requête Post (connexion) sur un objet 'user' */
router.post('/login', userCtrl.login);

/* Rajout de la route de suppression d'un utilisateur à prévoir (RGPD)

/* Exportation de notre router express */
module.exports = router;