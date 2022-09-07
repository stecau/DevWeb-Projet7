/*--------------------------------------------------------------------------------------------------*/
/* Création de notre module (package) de 'controleur (logique métier)' de nos routes utilisateurs : */
/*--------------------------------------------------------------------------------------------------*/

/* Importation du module (package) 'bcrypt' pour crypter les mots de passe */
const bcrypt = require('bcrypt');
/* Importation du module (package) 'jsonwebtoken' pour générer et comparer des tokens utilisateurs */
const jwt = require('jsonwebtoken');

// /* Importation de notre modèle mongoose 'User' */
// const User = require('../models/User');

/* Création de la requête Post (création) d'un objet 'user' */
exports.signup = (req, res, next) => {
    // Hashage du mot de passe (Attention : fonction asynchrone)
    bcrypt.hash(req.body.password, 10) // Bouclage 10 fois sur l'algo de cryptage
        .then(hash => {
            // // Création d'une instance 'user' de notre modèle mongoose d'objet 'User'
            // const user = new User({
            //     email: req.body.email,
            //     password: hash
            // });
            // On enregistre dans le base de donnée
            user.save() // Attention utilisation des promesses par la méthode save de mongoose
                // Renvoie réponse à la requete de création d'un objet (code 201)
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                // Capture erreur et réponse requête code 400 + erreur
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error })); // erreur code 500 pour une erreur serveur
};

/* Création de la requête Get (connexion) d'un objet 'user' */
exports.login = (req, res, next) => {
    // Utilisation de la méthode mongoose 'findOne' de notre object utilisateur
    User.findOne({ email: req.body.email}) // Utilisation des promesses
        .then(user => {
            if (user === null) {
                // code erreur 401 Unauthorized : manque des informations d'authentification valides pour la ressource
                res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' }) // Message flou car pas de divulgation si utilisateur ou pas dans la base
            } else {
                // Utilisateur dans la base, on compare le mot de passe
                bcrypt.compare(req.body.password, user.password) // C'est un promesse
                    .then(valid => { // bcrypt renvoie une réponse sur la comparaison de mot de passe
                        if (!valid) { // Mot de passe incorrect
                            // code erreur 401 Unauthorized : manque des informations d'authentification valides pour la ressource
                            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' }) // Message flou car pas de divulgation si utilisateur ou pas dans la base
                        } else { // Mot de passe valid, renvoie objet pour l'identification de l'utilisateur dans les requête qu'il fait (token) 
                            const RANDOM_TOKEN_SECRET = process.env.RANDOM_TOKEN_SECRET;
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id }, // 1er arg : Objet avec le user id
                                    RANDOM_TOKEN_SECRET, // 2ème arg : La clé token pour l'encodage
                                    { expiresIn: '24h'} // 3ème arg : Arg de configuration avec une expiration de 24h (il faut se reconnecter au bout de 24h)
                                )
                            });
                        };
                    })
                    .catch(error => res.status(500).json({ error }));
            };
        })
        .catch(error => res.status(500).json({ error })); 
};

