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

/* Création de la requête Post (création) d'un avis sur un 'post' */
exports.avisPost = (req, res) => {
    // Vérification si la requête a bien un body correct et un param id au format numérique
    const bodyValider = bodyValide(req.body, 'avisPost');
    if (!bodyValider[0]) {
        res.status(400).json({message: bodyValider[1]});
    } else if (isNaN(req.params.id)) {
        res.status(400).json({message: "Erreur dans l'url !"});
    } else {
        const avis = req.body.avis;
        const utilisateur_id = req.auth.utilisateur_Id;
        // Utilisation de la méthode Post 'findBy' de notre object Post
        Post.findBy( {"key": "_id", "value": req.params.id} , (err, post) => {
            if (err) {
                if (!err.hasOwnProperty('erreurType')) {
                    res.status(500).json({
                        message: err.code || "Une erreur a eu lieu au moment de l'affectation de l'avis sur le post"
                    });
                } else {
                    res.status(400).json({ message: "Erreur d'url"});
                };
            } else {
                const listeUtilisateursJaime = post.data[0].listeJaimeData;
                const listeUtilisateursJadore = post.data[0].listeJadoreData;
                // Vérification qu'il n'y a pas de Jaime ou Jadore de l'utilisateur pour le message
                if ((avis === 1 || avis === -1) && 
                     listeUtilisateursJaime.indexOf(utilisateur_id) === -1 &&
                     listeUtilisateursJadore.indexOf(utilisateur_id) === -1) {
                    // Rajout de la ligne pour message_id et utilisateur_id avec valeur 1
                    const avisObject = {
                        "flag": avis,
                        "message_id": req.params.id,
                        "utilisateur_id": utilisateur_id
                    };
                    Post.rajoutUtilisateurAvisMessage(avisObject, (err, avisData) => {
                        if (err) {
                            res.status(500).json({
                                message: err.code || "Une erreur a eu lieu au moment de l'affectation de l'avis sur le post"
                            });
                        } else {
                            console.log(avisData.message, avisData.data);
                            res.status(201).json({ message: avisData.message});
                        };
                    });
                } else if (avis === 0 && (listeUtilisateursJaime.indexOf(utilisateur_id) != -1 ||
                           listeUtilisateursJadore.indexOf(utilisateur_id) != -1)) {
                    // Suppression de la ligne pour message_id et utilisateur_id
                    Post.suppressionUtilisateurAvisMessage(req.params.id, utilisateur_id, (err, avisData) => {
                        if (err) {
                            if (!err.hasOwnProperty('erreurType')) {
                                res.status(500).json({
                                    message: err.code || "Une erreur a eu lieu au moment de l'affectation de l'avis sur le post"
                                });
                            } else {
                                res.status(400).json({ message: "Avis absent"});
                            };
                        } else {
                            console.log(avisData.message);
                            res.status(200).json({ message: avisData.message});
                        };
                    });
                } else {
                    res.status(400).json({ message: "Condition de changement d'avis inadéquate"});
                };
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
                if (post.data[0].createur_id === req.auth.utilisateur_Id || req.auth.isAdmin === 1) { // c'est le bon utilisateur/créateur ou c'est l'admin
                    // Si changement d'image, alors on supprime l'ancienne image du serveur
                    suppressionServeurAncienneImage(post.data[0], postObject);
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
                } else { // ce n'est pas le même utilisateur et ce n'est pas un administrateur
                    res.status(403).json({ message: 'Requête non autorisée !' });
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
                if (post.data[0].createur_id === req.auth.utilisateur_Id || req.auth.isAdmin === 1) { // c'est le bon utilisateur/créateur ou c'est l'admin
                    if (post.data[0].imageUrl != null) { // Il y a une image avec le post
                        // Suppression du fichier sur le serveur
                        const filename = post.data[0].imageUrl.split('/images/')[1]; // récupération du nom du fichier dans le dossier 'images'
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
                } else { // ce n'est pas le même utilisateur et ce n'est pas un administrateur
                    res.status(403).json({ message: 'Requête non autorisée !' });
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
            console.log(post.message, post.data);
            res.status(200).json(post.data[0]); // Recherche avec l'id qui est unique => liste avec 1 seul post
        };
    });
};

// Rajout d'une requête Get sur la totalité des objets 'Post' ou de recherche par des paramètres
exports.getAllPosts = (req, res) => {
    // Utilisation de la méthode Post 'findAll' de notre object Post
    Post.findAll((err, post) => {
        if (err) {
            if (!err.hasOwnProperty('erreurType')) {
                res.status(500).json({
                    message: err.code || "Une erreur a eu lieu au moment de la consultation des posts"
                });
            } else {
                res.status(401).json({ message: "Erreur sur la consultation des posts"});
            }
        } else {
            if (Object.keys(req.query).length) { // Requête avec un ou des params query
                let postList = post.data;
                for (let [key, valueInitial] of Object.entries(req.query)) {
                    let valueList = valueInitial;
                    if (typeof(valueInitial) === "number" || typeof(valueInitial) === "string") {
                        valueList = [valueInitial];
                    };
                    let typeComparaison = "egal";
                    for (let value of valueList) {
                        if (isNaN(value)) {
                            if (value.indexOf('>') != -1) {
                                typeComparaison = "superieur";
                                value = value.replace('>', '');
                                if (value.indexOf('=') != -1) {
                                    typeComparaison = "superieurOuEgal";
                                    value = value.replace('=', '');
                                };
                            };
                            if (value.indexOf('<') != -1) {
                                typeComparaison = "inferieur";
                                value = value.replace('<', '');
                                if (value.indexOf('=') != -1) {
                                    typeComparaison = "inferieurOuEgal";
                                    value = value.replace('=', '');
                                };
                            };
                        };
                        if (key.indexOf('Date') != -1) {
                            value = new Date(value);
                        };
                        postList = supressionPostFromAllPost(key, value, postList, typeComparaison);
                    };
                };
            };
            res.status(200).json(post.data);
        };
    });
};

// Rajout d'une requête Get sur la totalité des objets 'Post' ou de recherche par des paramètres
exports.getPostsBy = (req, res) => {
    // Mise au format Objet des paramètres de la requête
    let query = {"key": req.params.type, "value": req.params.value};
    // Mise au format de date (MySQL) si la clé concerne une date
    if (query.key.indexOf('Date') != -1) {
        let value = new Date(req.params.value);
        value = `${value.getFullYear()}-${('0' + (value.getMonth() + 1)).slice(-2)}-${('0' + value.getDate()).slice(-2)} ${value.getHours()}:${value.getMinutes()}:${value.getSeconds()}`;
        query = {"key": req.params.type, "value": value};
    };
    // Utilisation de la méthode Post 'findBy' de notre object Post
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
            console.log(post.message, post.data);
            res.status(200).json(post.data);
        };
    });
};

// Fonction de supression de l'ancienne image du serveur si modification de l'image d'une sauce
const suppressionServeurAncienneImage = (post, postObjet) => {
    if ('imageUrl' in post && post.imageUrl != null) { // Si la requête (modification de l'objet Post) contient une image
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
            case 'avisPost':
                if (bodyObject.hasOwnProperty('avis')) {
                    if (typeof bodyObject.avis === 'number') {
                        return [true, null]; 
                    };
                };
                break;
        };
    };
    return [false, "Le contenu de la requête est incorrect !"];
};

const supressionPostFromAllPost = (key, value, postList, typeComparaison) => {
    let lastIndex = 0;
    for (let index = 0; index < postList.length; index++) {
        lastIndex = index;
        let referenceValue = postList[index][key];
        let searchValue = value;
        if (key.indexOf('Date') != -1) {
            referenceValue = postList[index][key].getTime();
            searchValue = value.getTime();
        };
        switch (typeComparaison) {
            case "egal":
                // console.log("if egal");
                // console.log("postList[index][key] != value", postList[index][key] != value);
                if (referenceValue != searchValue) {
                    // console.log("Supprime : ", postList[index]);
                    // console.log(`postList[index][key] : ${postList[index][key]} / req.query[key] : ${value}`);
                    postList.splice(index, 1);
                    // console.log("lastIndex", lastIndex);
                    // console.log("postList.length", postList.length);
                    if (lastIndex < postList.length) {
                        postList = supressionPostFromAllPost(key, value, postList, typeComparaison);
                    };
                };
                break;
            case "superieur":
                // console.log("if superieur");
                // console.log("postList[index][key] <= value", postList[index][key] <= value);
                if (referenceValue <= searchValue) {
                    // console.log("Supprime : ", postList[index]);
                    // console.log(`postList[index][key] : ${postList[index][key]} / req.query[key] : ${value}`);
                    postList.splice(index, 1);
                    // console.log("lastIndex", lastIndex);
                    // console.log("postList.length", postList.length);
                    if (lastIndex < postList.length) {
                        postList = supressionPostFromAllPost(key, value, postList, typeComparaison);
                    };
                };
                break;
            case "superieurOuEgal":
                // console.log("if superieurOuEgal");
                // console.log("postList[index][key] < value", postList[index][key] < value);
                if (referenceValue < searchValue) {
                    // console.log("Supprime : ", postList[index]);
                    // console.log(`postList[index][key] : ${postList[index][key]} / req.query[key] : ${value}`);
                    postList.splice(index, 1);
                    // console.log("lastIndex", lastIndex);
                    // console.log("postList.length", postList.length);
                    if (lastIndex < postList.length) {
                        postList = supressionPostFromAllPost(key, value, postList, typeComparaison);
                    };
                };
                break;
            case "inferieur":
                // console.log("if inferieur");
                // console.log("postList[index][key] >= value", postList[index][key] >= value);
                if (referenceValue >= searchValue) {
                    // console.log("Supprime : ", postList[index]);
                    // console.log(`postList[index][key] : ${postList[index][key]} / req.query[key] : ${value}`);
                    postList.splice(index, 1);
                    // console.log("lastIndex", lastIndex);
                    // console.log("postList.length", postList.length);
                    if (lastIndex < postList.length) {
                        postList = supressionPostFromAllPost(key, value, postList, typeComparaison);
                    };
                };
                break;
            case "inferieurOuEgal":
                // console.log("if inferieurOuEgal");
                // console.log("postList[index][key] > value", postList[index][key] > value);
                if (referenceValue > searchValue) {
                    // console.log("Supprime : ", postList[index]);
                    // console.log(`postList[index][key] : ${postList[index][key]} / req.query[key] : ${value}`);
                    postList.splice(index, 1);
                    // console.log("lastIndex", lastIndex);
                    // console.log("postList.length", postList.length);
                    if (lastIndex < postList.length) {
                        postList = supressionPostFromAllPost(key, value, postList, typeComparaison);
                    };
                };
                break;
        };
    };
    return postList;
};
