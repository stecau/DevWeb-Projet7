/*--------------------------------------------------------------------------------------------------*/
/* Création de notre module (package) de 'controleur (logique métier)' de nos routes utilisateurs : */
/*--------------------------------------------------------------------------------------------------*/

/* Importation du module (package) 'bcrypt' pour crypter les mots de passe */
const bcrypt = require('bcrypt');
/* Importation du module (package) 'jsonwebtoken' pour générer et comparer des tokens utilisateurs */
const jwt = require('jsonwebtoken');

/* Importation de notre modèle MySQL 'Utilisateur' */
const Utilisateur = require("../models/User");

/* Création de la requête Post (création) d'un 'utilisateur' */
exports.signup = (req, res) => {
    // Vérification si la requête a bien un body correct
    const bodyValider = bodyValide(req.body, 'createUtilisateur');
    if (!bodyValider[0]) {
        res.status(400).json({message: bodyValider[1]});
    } else {
        // Hashage du mot de passe (Attention : fonction asynchrone)
        bcrypt.hash(req.body.motDePasse, 10) // Bouclage 10 fois sur l'algo de cryptage
            .then(hash => {
                // Création d'une instance utilisateur de l'objet Utilisateur
                const utilisateur = new Utilisateur({
                    email: req.body.email,
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    poste: req.body.poste,
                    motDePasse: hash
                });
                // Sauvegarde de l'utilisateur dans la base de données
                Utilisateur.create(utilisateur, (err, data) => {
                    if (err) {
                        res.status(500).json({
                            message: err.code || "Une erreur a eu lieu au moment de la création de l'utilisateur"
                        });
                    } else {
                        console.log(data.message, data.data)
                        res.status(201).json({ message: data.message });
                    };
                });
            })
            .catch(error => res.status(500).json({ error })); // erreur code 500 pour une erreur serveur
    };
};

/* Création de la requête Post (connexion) d'un 'utilisateur' */
exports.login = (req, res) => {
    // Vérification si la requête a bien un body correct
    const bodyValider = bodyValide(req.body, 'connexionUtilisateur');
    if (!bodyValider[0]) {
        res.status(400).json({message: bodyValider[1]});
    } else {
        // Utilisation de la méthode Utilisateur 'findBy' de notre object utilisateur
        Utilisateur.findBy( {"key": "email", "value": req.body.email} , (err, utilisateur) => {
            if (err)
                if (!err.hasOwnProperty('erreurType')) {
                    res.status(500).json({
                        message: err.code || "Une erreur a eu lieu au moment de la connexion de l'utilisateur"
                    });
                } else {
                    // code erreur 401 Unauthorized : manque des informations d'authentification valides pour la ressource
                    res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' }); // Message flou car pas de divulgation si utilisateur ou pas dans la base
                }
            else {
                // Utilisateur dans la base, on compare le mot de passe
                bcrypt.compare(req.body.motDePasse, utilisateur.data.motDePasse) // C'est un promesse
                    .then(valid => { // bcrypt renvoie une réponse sur la comparaison de mot de passe
                        if (!valid) { // Mot de passe incorrect
                            // code erreur 401 Unauthorized : manque des informations d'authentification valides pour la ressource
                            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' }) // Message flou car pas de divulgation si utilisateur ou pas dans la base
                        } else { // Mot de passe valid, renvoie objet pour l'identification de l'utilisateur dans les requête qu'il fait (token) 
                            const RANDOM_TOKEN_SECRET = process.env.RANDOM_TOKEN_SECRET;
                            console.log('Utilisateur connecté :', utilisateur.data._id);
                            res.status(200).json({
                                message: `Utilisateur connecté : ${utilisateur.data._id}`,
                                utilisateur_Id: utilisateur.data._id,
                                token: jwt.sign(
                                    { utilisateur_Id: utilisateur.data._id }, // 1er arg : Objet avec le utilisateur id
                                    RANDOM_TOKEN_SECRET, // 2ème arg : La clé token pour l'encodage
                                    { expiresIn: '24h'} // 3ème arg : Arg de configuration avec une expiration de 24h (il faut se reconnecter au bout de 24h)
                                )
                            });
                        };
                    })
                    .catch(error => res.status(500).json({ error }));
            };
        });
    };
};

// Rajout d'une requête Get sur un utilisateur avec son id
exports.getOneUserById = (req, res) => {
    // Utilisation de la méthode Utilisateur 'findBy' de notre object utilisateur
    Utilisateur.findBy( {"key": "_id", "value": req.params.id} , (err, utilisateur) => {
        if (err) {
            if (!err.hasOwnProperty('erreurType')) {
                res.status(500).json({
                    message: err.code || "Une erreur a eu lieu au moment de la connexion de l'utilisateur"
                });
            } else {
                res.status(400).json({ message: "Erreur d'url"});
            };
        } else {
            // Utilisateur dans la base, on compare les id (token vs utilisateur à effacer)
            if (utilisateur.data._id != req.auth.utilisateur_Id) { // ce n'est pas le même utilisateur
                res.status(403).json({ message: 'Requête non autorisée !' });
            } else {
                utilisateur.data.motDePasse = "";
                res.status(200).json(utilisateur.data); // Recherche avec l'id qui est unique
            };
        }
    });
};

/* Création de la requête PUT (modification) d'un 'utilisateur' */
exports.modify = (req, res) => {
    // Vérification si la requête a bien un body correct et un param id au format numérique
    const bodyValider = bodyValide(req.body, 'modifyUtilisateur');
    if (!bodyValider[0]) {
        res.status(400).json({message: bodyValider[1]});
    } else if (isNaN(req.params.id) ) {
        res.status(400).json({message: "Erreur dans l'url !"});
    } else {
        // Utilisation de la méthode Utilisateur 'findBy' de notre object utilisateur
        Utilisateur.findBy( {"key": "_id", "value": req.params.id} , (err, utilisateur) => {
            if (err) {
                if (!err.hasOwnProperty('erreurType')) {
                    res.status(500).json({
                        message: err.code || "Une erreur a eu lieu au moment de la connexion de l'utilisateur"
                    });
                } else {
                    res.status(400).json({ message: "Erreur d'url"});
                };
            } else {
                // Utilisateur dans la base, on compare les id (token vs utilisateur à effacer)
                if (utilisateur.data._id != req.auth.utilisateur_Id) { // ce n'est pas le même utilisateur
                    res.status(403).json({ message: 'Requête non autorisée !' });
                } else {
                    // Gestion du cas particulier si modification du mot de passe
                    const modifiedUtilisateur = {...req.body};
                    if (modifiedUtilisateur.hasOwnProperty('motDePasse')) {
                        // Vérification de l'ancien mot de passe
                        bcrypt.compare(modifiedUtilisateur.motDePasse, utilisateur.data.motDePasse)
                            .then(valid => {
                                if (!valid) { // Mot de passe incorrect
                                    // code erreur 401 Unauthorized : manque des informations d'authentification valides pour la ressource
                                    res.status(401).json({ message: 'Mot de passe actuel incorrect' }); // Message flou car pas de divulgation si utilisateur ou pas dans la base
                                } else { // Mot de passe valid
                                    // remplacement du mot de passe avec le nouveau
                                    modifiedUtilisateur.motDePasse = modifiedUtilisateur.newMotDePasse
                                    // suppression du champs 'newMotDePasse
                                    delete modifiedUtilisateur.newMotDePasse
                                    // Hashage du mot de passe
                                    bcrypt.hash(modifiedUtilisateur.motDePasse, 10) // Bouclage 10 fois sur l'algo de cryptage
                                    .then(hash => {
                                        modifiedUtilisateur.motDePasse = hash;
                                        // utilisation de la méthode Utilisateur 'modify' de notre objet utilisateur
                                        Utilisateur.modify(req.auth.utilisateur_Id, modifiedUtilisateur, (err, utilisateur) => {
                                            if (err) {
                                                if (!err.hasOwnProperty('erreurType')) {
                                                    res.status(500).json({
                                                        message: err.code || "Une erreur a eu lieu au moment de la connexion de l'utilisateur"
                                                    });
                                                } else {
                                                    res.status(400).json({ message: "Erreur d'url" });
                                                }
                                            } else {
                                                console.log(utilisateur.message, utilisateur.data);
                                                // delete utilisateur.data.motDePasse;
                                                utilisateur.data.motDePasse = "";
                                                res.status(200).json({ message: utilisateur.message, utilisateur: utilisateur.data});
                                            };
                                        });
                                    })
                                    .catch(error => res.status(500).json({ error })); // erreur code 500 pour une erreur serveur
                                }})
                            .catch(error => res.status(500).json({ error }));
                    } else {
                        // On conserve l'ancien mot de passe
                        modifiedUtilisateur.motDePasse = utilisateur.data.motDePasse;
                        // utilisation de la méthode Utilisateur 'modify' de notre objet utilisateur
                        Utilisateur.modify(req.auth.utilisateur_Id, modifiedUtilisateur, (err, utilisateur) => {
                            if (err) {
                                if (!err.hasOwnProperty('erreurType')) {
                                    res.status(500).json({
                                        message: err.code || "Une erreur a eu lieu au moment de la connexion de l'utilisateur"
                                    });
                                } else {
                                    res.status(400).json({ message: "Erreur d'url" });
                                }
                            } else {
                                console.log(utilisateur.message, utilisateur.data)
                                // delete utilisateur.data.motDePasse;
                                utilisateur.data.motDePasse = "";
                                res.status(200).json({ message: utilisateur.message, utilisateur: utilisateur.data});
                            };
                        });
                    };
                };
            };
        });
    };
};

/* Création de la requête Delete (effacement) d'un 'utilisateur' */
exports.delete = (req, res) => {
    // Vérification si la requête a bien un param id au format numérique
    if (isNaN(req.params.id)) {
        res.status(400).json({message: "Erreur dans l'url !"});
    } else {
        // Utilisation de la méthode Utilisateur 'findBy' de notre object utilisateur
        Utilisateur.findBy( {"key": "_id", "value": req.params.id} , (err, utilisateur) => {
            if (err) {
                if (!err.hasOwnProperty('erreurType')) {
                    res.status(500).json({
                        message: err.code || "Une erreur a eu lieu au moment de la connexion de l'utilisateur"
                    });
                } else {
                    res.status(400).json({ message: "Erreur d'url" });
                };
            } else {
                // Utilisateur dans la base, on compare les id (token vs utilisateur à effacer)
                if (utilisateur.data._id != req.auth.utilisateur_Id) { // ce n'est pas le même utilisateur
                    res.status(403).json({ message: 'Requête non autorisée !' });
                } else {
                    // utilisation de la méthode Utilisateur 'remove' de notre objet utilisateur 
                    Utilisateur.remove(req.auth.utilisateur_Id, (err, utilisateur) => {
                        if (err) {
                            if (!err.hasOwnProperty('erreurType')) {
                                res.status(500).json({
                                    message: err.code || "Une erreur a eu lieu au moment de la connexion de l'utilisateur"
                                });
                            } else {
                                res.status(400).json({ message: "Erreur d'url" });
                            }
                        } else {
                            console.log(utilisateur.message, utilisateur.data)
                            res.status(200).json({ message: utilisateur.message});
                        };
                    });
                };
            };
        });
    };
};

// Fonction de validation d'une requête avec body
const bodyValide = (bodyObject, reqType) => {
    if (Object.keys(bodyObject).length === 0) {
        return [false, "Le contenu de la requête est vide !"];
    } else {
        switch (reqType) {
            case 'createUtilisateur':
                if (bodyObject.hasOwnProperty('email') && bodyObject.hasOwnProperty('motDePasse') &&
                bodyObject.hasOwnProperty('nom') && bodyObject.hasOwnProperty('prenom')) {
                    return [true, null]; 
                };
                break;
            case 'modifyUtilisateur':
                if (bodyObject.hasOwnProperty('email') && bodyObject.hasOwnProperty('nom') && 
                bodyObject.hasOwnProperty('prenom') && bodyObject.hasOwnProperty('poste')) {
                    return [true, null];
                };
                break;
            case 'connexionUtilisateur':
                if (bodyObject.hasOwnProperty('email') && bodyObject.hasOwnProperty('motDePasse')) {
                    return [true, null]; 
                };
                break;
        };
    };
    return [false, "Le contenu de la requête est incorrect !"];
};
