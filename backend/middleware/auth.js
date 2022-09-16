/*------------------------------------------------------------------------------*/
/* Création de notre module (package) 'auth' pour le middleware de vérification */          
/*                     de connection de l'utilisateur (token)                   */
/*------------------------------------------------------------------------------*/

/* Importation du module (package) 'jsonwebtoken' */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // récupération du token ('bearer token') avec une structure try catch
    try {
        // récupération du token dans le header de la request
        const token = req.headers.authorization.split(' ')[1]; 
        // décodage du token récupéré avec la clé secrète d'encodage
            // Récupération de la chaine d'encodage
        const RANDOM_TOKEN_SECRET = process.env.RANDOM_TOKEN_SECRET;
        const decodedToken = jwt.verify(token, RANDOM_TOKEN_SECRET);
        // récupération du utilisateur_id de l'objet decodedToken avec la key de l'objet 'utilisateur_Id'
        const utilisateur_id = decodedToken.utilisateur_Id; 
        // Rajout d'un objet d'authentification dans l'entête de la requête
        req.auth = {
            utilisateur_Id: utilisateur_id
        };
        next(); // pour continuer la route (routage)
    } catch(error) {
        res.status(401).json({ error });
    };
};