/*---------------------------------------------------------------------------------------------*/
/* Création de notre module (package) de 'controleur (logique métier)' de nos routes message : */
/*---------------------------------------------------------------------------------------------*/

/* Importation du package 'fs' (file system) pour la suppression de fichier */
const fs = require('fs');
/* Importation de notre modèle MySQL 'Post' */
const Post = require("../models/Post");

/* Création de la requête Post (création) d'un objet 'post' */
exports.createPost = (req, res) => {
    // Si fichier ou pas (un champs file est présent ou pas)
    const postObject = req.file ? { // si champs file alors req sous forme de texte que l'on convertie en objet
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // Vérification si la requête a bien un body correct
    const bodyValider = bodyValide(postObject, 'createPost');
    if (!bodyValider[0]) {
        res.status(400).json({message: bodyValider[1]});
    } else {
        // Création d'une instance post de l'objet Post
        const post = new Post({
            ...postObject,
            createur_id: req.auth.utilisateur_Id
        });
        // Sauvegarde du message dans la base de données
        Post.create(post, (err, data) => {
            if (err) {
                res.status(500).json({
                    message: err.code || "Une erreur a eu lieu au moment de la création du post"
                });
            } else {
                console.log(data.message, data.data)
                res.status(201).json({ message: data.message });
            };
        });
    };
};

/* Création de la requête Post (création) d'un like sur un 'post' */
exports.likePost = (req, res) => {
    // Vérification si la requête a bien un body correct et un param id au format numérique
    const bodyValider = bodyValide(req.body, 'likePost');
    if (!bodyValider[0]) {
        res.status(400).json({message: bodyValider[1]});
    } else if (isNaN(req.params.id)) {
        res.status(400).json({message: "Erreur dans l'url !"});
    } else {
        const like = req.body.like;
        const utilisateur_id = req.auth.utilisateur_Id;
        // Utilisation de la méthode Post 'findBy' de notre object Post
        Post.findBy( {"key": "_id", "value": req.params.id} , (err, post) => {
            if (err) {
                if (!err.hasOwnProperty('erreurType')) {
                    res.status(500).json({
                        message: err.code || "Une erreur a eu lieu au moment de l'affectation du like sur le post"
                    });
                } else {
                    res.status(400).json({ message: "Erreur d'url"});
                };
            } else {
                // Récupération du flag pour un like/dislike avec message_id et utilisateur_id
                Post.flagUtilisateurLikeMessage(req.params.id, utilisateur_id, (err, flag) => {
                    if (err) {
                        if (!err.hasOwnProperty('erreurType')) {
                            res.status(500).json({
                                message: err.code || "Une erreur a eu lieu au moment de l'affectation du like sur le post"
                            });
                        } else {
                            if (like === 1 || like === -1) {
                                // Rajout de la ligne pour message_id et utilisateur_id avec valeur 1
                                const likeObject = {
                                    "flag": like,
                                    "message_id": req.params.id,
                                    "utilisateur_id": utilisateur_id
                                };
                                Post.rajoutUtilisateurLikeMessage(likeObject, (err, like) => {
                                    if (err) {
                                        res.status(500).json({
                                            message: err.code || "Une erreur a eu lieu au moment de l'affectation du like sur le post"
                                        });
                                    } else {
                                        console.log(like.message, like.data);
                                        // Update du nombre de like ou dislike pour le post
                                        if (likeObject.flag === 1) {
                                            post.data[0].likes += likeObject.flag;
                                        };
                                        if(likeObject.flag === -1) {
                                            post.data[0].dislikes -= likeObject.flag;
                                        }; 
                                        Post.modify(req.params.id, post.data[0], (err, post) => {
                                            if (err) {
                                                if (!err.hasOwnProperty('erreurType')) {
                                                    res.status(500).json({
                                                        message: err.code || "Une erreur a eu lieu au moment de la modification du post"
                                                    });
                                                } else {
                                                    res.status(400).json({ message: "Erreur d'url" });
                                                }
                                            } else {
                                                console.log(post.message, post.data);
                                                res.status(201).json({ message: post.message});
                                            };
                                        }, true);
                                    };
                                });
                            } else {
                                res.status(400).json({ message: "Like absent"});
                            };
                        };
                    } else {
                        if (like === 0) {
                            console.log(flag.message);
                            // Suppression de la ligne pour message_id et utilisateur_id
                            Post.suppressionUtilisateurLikeMessage(req.params.id, utilisateur_id, (err, like) => {
                                if (err) {
                                    if (!err.hasOwnProperty('erreurType')) {
                                        res.status(500).json({
                                            message: err.code || "Une erreur a eu lieu au moment de l'affectation du like sur le post"
                                        });
                                    } else {
                                        res.status(400).json({ message: "Like absent"});
                                    };
                                } else {
                                    console.log(like.message);
                                    // Update du nombre de like ou dislike pour le post
                                    if (flag.data === 1) {
                                        post.data[0].likes -= flag.data;
                                    };
                                    if(flag.data === -1) {
                                        post.data[0].dislikes += flag.data;
                                    }; 
                                    Post.modify(req.params.id, post.data[0], (err, post) => {
                                        if (err) {
                                            if (!err.hasOwnProperty('erreurType')) {
                                                res.status(500).json({
                                                    message: err.code || "Une erreur a eu lieu au moment de la modification du post"
                                                });
                                            } else {
                                                res.status(400).json({ message: "Erreur d'url" });
                                            }
                                        } else {
                                            console.log(post.message, post.data);
                                            res.status(200).json({ message: post.message});
                                        };
                                    }, true);
                                };
                            });
                        } else {
                            res.status(400).json({ message: "Like déjà présent"});
                        };
                    };
                });
            };
        });
    };
};

/* Création de la requête Put (modification) sur un objet message avec son id */
exports.modifyPost = (req, res) => {
    // Si fichier ou pas (un champs file est présent ou pas)
    const postObject = req.file ? { // si champs file alors req sous forme de texte que l'on convertie en objet
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    // Vérification si la requête a bien un body correct
    const bodyValider = bodyValide(postObject, 'modifyPost');
    if (!bodyValider[0]) {
        res.status(400).json({message: bodyValider[1]});
    } else if (isNaN(req.params.id)) {
        res.status(400).json({message: "Erreur dans l'url !"});
    } else {
        // Utilisation de la méthode Post 'findBy' de notre object Post
        Post.findBy( {"key": "_id", "value": req.params.id} , (err, post) => {
            if (err) {
                if (!err.hasOwnProperty('erreurType')) {
                    res.status(500).json({
                        message: err.code || "Une erreur a eu lieu au moment de la modification du post"
                    });
                } else {
                    res.status(400).json({ message: "Erreur d'url"});
                };
            } else {
                // Post dans la base, on compare les id (token vs createur_id du Post) [un seul post dans la liste car id unique]
                if (post.data[0].createur_id != req.auth.utilisateur_Id) { // ce n'est pas le même utilisateur
                    res.status(403).json({ message: 'Requête non autorisée !' });
                } else {
                    // Si changement d'image, alors on supprime l'ancienne image du serveur
                    suppressionServeurAncienneImage(post.data, postObject);
                    // utilisation de la méthode Post 'modify' de notre objet Post
                    Post.modify(req.params.id, postObject, (err, post) => {
                        if (err) {
                            if (!err.hasOwnProperty('erreurType')) {
                                res.status(500).json({
                                    message: err.code || "Une erreur a eu lieu au moment de la modification du post"
                                });
                            } else {
                                res.status(400).json({ message: "Erreur d'url" });
                            }
                        } else {
                            console.log(post.message, post.data);
                            res.status(200).json({ message: post.message});
                        };
                    });
                };
            };
        });
    };
};

/* Création de la requête Delete (suppression) sur un objet message avec son id */
exports.deletePost = (req, res) => {
    // Vérification si la requête a bien un param id au format numérique
    if (isNaN(req.params.id)) {
        res.status(400).json({message: "Erreur dans l'url !"});
    } else {
        // Utilisation de la méthode Post 'findBy' de notre object Post
        Post.findBy( {"key": "_id", "value": req.params.id} , (err, post) => {
            if (err) {
                if (!err.hasOwnProperty('erreurType')) {
                    res.status(500).json({
                        message: err.code || "Une erreur a eu lieu au moment de la suppression du post"
                    });
                } else {
                    res.status(400).json({ message: "Erreur d'url"});
                };
            } else {
                // Post dans la base, on compare les id (token vs createur_id du Post) [un seul post dans la liste car id unique]
                if (post.data[0].createur_id != req.auth.utilisateur_Id) { // ce n'est pas le même utilisateur
                    res.status(403).json({ message: 'Requête non autorisée !' });
                } else {
                    if (post.data.imageUrl != null) { // Il y a une image avec le post
                        // Suppression du fichier sur le serveur
                        const filename = post.data.imageUrl.split('/images/')[1]; // récupération du nom du fichier dans le dossier 'images'
                        // méthode de suppression de fichier avec fonction asynchrone
                        fs.unlink(`images/${filename}`, () => {
                            if (err) throw err;
                            console.log(`images/${filename} was deleted`);
                        });
                    };
                    // Utilisation de la méthode 'deleteOne' pour la suppression dans la base de données
                    Post.remove(req.params.id, (err, post) => {
                        if (err) {
                            if (!err.hasOwnProperty('erreurType')) {
                                res.status(500).json({
                                    message: err.code || "Une erreur a eu lieu au moment de la suppression du post"
                                });
                            } else {
                                res.status(400).json({ message: "Erreur d'url" });
                            }
                        } else {
                            console.log(post.message, post.data);
                            res.status(200).json({ message: post.message});
                        };
                    });
                };
            };
        });
    };
};

// Rajout d'une requête Get sur un objet avec son id
exports.getOnePostById = (req, res) => {
    // Utilisation de la méthode Post 'findBy' de notre object Post
    Post.findBy( {"key": "_id", "value": req.params.id} , (err, post) => {
        if (err) {
            if (!err.hasOwnProperty('erreurType')) {
                res.status(500).json({
                    message: err.code || "Une erreur a eu lieu au moment de la consultation du post"
                });
            } else {
                res.status(401).json({ message: "Erreur d'url"});
            };
        } else {
            res.status(200).json(post.data[0]); // Recherche avec l'id qui est unique => liste avec 1 seul post
        };
    });
};

// Rajout d'une requête Get sur la totalité des objets 'Post' ou de recherche par des paramètres
exports.getAllPosts = (req, res) => {
    if (!Object.keys(req.query).length) {
        // Utilisation de la méthode Post 'findAll' de notre object Post
        Post.findAll((err, post) => {
            if (err) {
                if (!err.hasOwnProperty('erreurType')) {
                    res.status(500).json({
                        message: err.code || "Une erreur a eu lieu au moment de la consultation des posts"
                    });
                } else {
                    res.status(401).json({ message: "Erreur d'url"});
                };
            } else {
                res.status(200).json(post.data);
            };
        });
    } else { // Présence de query
        // Utilisation de la méthode Post 'findAll' de notre object Post
        const query = {"key": Object.keys(req.query)[0], "value": Object.values(req.query)[0]}
        Post.findBy( query , (err, post) => {
            if (err) {
                if (!err.hasOwnProperty('erreurType')) {
                    res.status(500).json({
                        message: err.code || "Une erreur a eu lieu au moment de la consultation des posts"
                    });
                } else {
                    res.status(401).json({ message: "Erreur d'url"});
                };
            } else {
                res.status(200).json(post.data);
            };
        });
    };
};

// Rajout d'une requête Get sur la totalité des objets 'Post' ou de recherche par des paramètres
exports.getPostsBy = (req, res) => {
    // Utilisation de la méthode Post 'findBy' de notre object Post
    const query = {"key": req.params.type, "value": req.params.value};
    Post.findBy( query , (err, post) => {
        if (err) {
            if (!err.hasOwnProperty('erreurType')) {
                res.status(500).json({
                    message: err.code || "Une erreur a eu lieu au moment de la consultation des posts"
                });
            } else {
                res.status(401).json({ message: "Erreur d'url"});
            };
        } else {
            res.status(200).json(post.data);
        };
    });
};

// Fonction de supression de l'ancienne image du serveur si modification de l'image d'une sauce
const suppressionServeurAncienneImage = (post, postObjet) => {
    if ('imageUrl' in postObjet) { // Si la requête (modification de l'objet Post) contient une image
        if (postObjet.imageUrl != post.imageUrl) { // Si les url entre la requête et l'image (sauce en base de données) sur le serveur sont différentes
            // Suppression du fichier sur le serveur
            const filename = post.imageUrl.split('/images/')[1]; // récupération du nom du fichier dans le dossier 'images'
            // méthode de suppression de fichier avec fonction callback
            fs.unlink(`images/${filename}`, (err) => {
                if (err) throw err;
                console.log(`images/${filename} was deleted`);
            });
        };
    };
};

// Fonction de validation d'une requête avec body
const bodyValide = (bodyObject, reqType) => {
    if (Object.keys(bodyObject).length === 0) {
        return [false, "Le contenu de la requête est vide !"];
    } else {
        switch (reqType) {
            case 'createPost':
                if (bodyObject.hasOwnProperty('titre') && bodyObject.hasOwnProperty('content')) {
                    return [true, null]; 
                };
                break;
            case 'modifyPost':
                if (bodyObject.hasOwnProperty('titre') && bodyObject.hasOwnProperty('content') &&
                bodyObject.hasOwnProperty('imageUrl')) {
                    return [true, null]; 
                };
                break;
            case 'likePost':
                if (bodyObject.hasOwnProperty('like')) {
                    if (typeof bodyObject.like === 'number') {
                        return [true, null]; 
                    };
                };
                break;
        };
    };
    return [false, "Le contenu de la requête est incorrect !"];
};
