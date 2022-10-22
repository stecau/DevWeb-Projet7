/*----------------------------------------------------------------------------------------*/
/* Création de notre module (package) 'router' de routes message pour notre application : */
/*----------------------------------------------------------------------------------------*/

/* Importation du module (package) 'express' de node */
const express = require('express');
/* Déclaration d'un router pour toutes nos routes message de l'app */
const router = express.Router();

/* Importation de notre authentificateur pour nos routes message de l'app */
const auth = require('../middleware/auth');
/* Importation de notre multer pour nos routes message de l'app */
const multer = require('../middleware/multer-config');

/* Importation de notre controleur pour nos routes message de l'app */
const postCtrl = require('../controllers/post');

/* Création de la requête Post (création) d'un objet 'message' */
router.post('/', auth, multer, postCtrl.createPost);

/* Création de la requête Post (création) d'un avis sur une message */
router.post('/:id/avis', auth, postCtrl.avisPost);

/* Création de la requête Put (modification) sur un objet message avec son id */
router.put('/:id', auth, multer, postCtrl.modifyPost);

/* Création de la requête Delete d'effacement d'un objet message avec son id */
router.delete('/:id', auth, postCtrl.deletePost);

/* Création de la requête Get sur un objet message avec son type et la valeur */
router.get('/:type&:value', auth, postCtrl.getPostsBy);

/* Création de la requête Get sur un objet message avec son id */
router.get('/:id', auth, postCtrl.getOnePostById);

/* Création de la requête Get sur la totalité des objets 'message' voir avec des queries */
router.get('/', auth, postCtrl.getAllPosts);

/* Exportation de notre router express */
module.exports = router;