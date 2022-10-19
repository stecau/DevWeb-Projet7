/*-------------------------------------------------------------------------------------*/
/* Création de notre module (package) 'Post' modèle de message (post) de la db MySQL : */
/*-------------------------------------------------------------------------------------*/

/* Importation du module (package) 'db' connexion à la base de données MySQL */
const sql = require("./db.js");

// constructeur d'un message
const Post = function(post) {
    this.createur_id = post.createur_id; // l'identifiant unique de l'utilisateur qui a créé le message
    this.titre = post.titre; // titre du message
    this.content = post.content; // contenu du message
    this.imageUrl = post.imageUrl; // l'URL de l'image ou des images téléchargée par l'utilisateur
};

/* Creation d'un post */
Post.create = (newPost, result) => {
    sql.query("INSERT INTO messages SET ?", newPost, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        result(null, { message: "Nouveau message enregistré", data: { _id: res.insertId, ...newPost } });
    });
};

/* Modification d'un message */
Post.modify = (id, newPost, result) => {
    // Changement de la date de modification
    newPost.modificationDate = new Date(Date.now());
    sql.query(`UPDATE messages SET ? WHERE _id = ${id}`, newPost, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        if (res.affectedRows == 0) { // Post avec l'id pas trouvé
            result({ erreurType: "Message absent" }, null);
            return;
        };
        result(null, { message: "Message modifié", data: { _id: id, ...newPost } });
    });
};

/* Recherche d'un ou des messages avec un nom de colonne et une valeur */
Post.findBy = ( {"key": type, "value": value} , result) => {
    sql.query(`SELECT * FROM messages WHERE ${type} = "${value}" ORDER BY modificationDate DESC`, (err, resAll) => {
        if (err) {
            result(err, null);
            return;
        }
        if (resAll.length) {
            // correction du type pour éviter ambiguité sur colonne de la table (sqlMessage: "Column '_id' in where clause is ambiguous")
            if (type === "_id" ) {
                type = "messages._id"
            }
            // traitement des datas pour obtention de la liste des messages avec like data
            sql.query(`SELECT message_id, createur_id, titre, content, imageUrl, messages.creationDate, messages.modificationDate, utilisateur_id, flag FROM messages
                    JOIN likes ON messages._id = likes.message_id
                    JOIN utilisateurs ON utilisateurs._id = likes.utilisateur_id 
                    WHERE ${type} = "${value}"
                    ORDER BY messages.modificationDate DESC`, (err, resAvis) => {
                if (err) {
                    result(err, null);
                    return;
                }
                if (resAvis.length || resAll.length) {
                    // traitement des messages sans avis avec mise en jour pour les messages avec avis
                    const listUpdatedMessage = Post.compareMessages(resAll, resAvis);
                    result(null, { message: "Message présent", data: listUpdatedMessage } );
                    return;
                }
                // Post avec l'id pas trouvé
                result({ erreurType: "Message absent" }, null);
            });
        }
    });
};

Post.findAll = (result) => {
    sql.query(`SELECT * FROM messages ORDER BY modificationDate DESC`, (err, resAll) => {
        if (err) {
            result(err, null);
            return;
        }
        if (resAll.length) {
            // traitement des datas pour obtention de la liste des messages avec like data
            sql.query(`SELECT message_id, createur_id, titre, content, imageUrl, messages.creationDate, messages.modificationDate, utilisateur_id, flag FROM messages
                    JOIN likes ON messages._id = likes.message_id
                    JOIN utilisateurs ON utilisateurs._id = likes.utilisateur_id
                    ORDER BY messages.modificationDate DESC`, (err, resAvis) => {
                if (err) {
                    result(err, null);
                    return;
                };
                if (resAvis.length) {
                    // traitement des messages sans avis avec mise en jour pour les messages avec avis
                    const listUpdatedMessage = Post.compareMessages(resAll, resAvis);
                    result(null, { message: "Liste de tous les messages", data: listUpdatedMessage } );
                    return;
                };
                // Post avec l'id pas trouvé
                result({ erreurType: "Message absent" }, null);
            });
        }
    });
};

/* Suppression d'un message */
Post.remove = (id, result) => {
    sql.query("DELETE FROM messages WHERE _id = ?", id, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        if (res.affectedRows == 0) { // Post avec l'id pas trouvé
            result({ erreurType: "Message absent" }, null);
            return;
        };
        result(null, { message: "Message supprimé", data: id });
    });
};

/* Suppression de la ligne pour message_id et utilisateur_id dans la table likes */
Post.suppressionUtilisateurAvisMessage = (message_id, utilisateur_id, result) => {
    sql.query(`DELETE FROM likes WHERE message_id = ${message_id} AND utilisateur_id = ${utilisateur_id}`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        if (res.affectedRows == 0) { // Avis avec message_id et utilisateur_id pas trouvé
            result({ erreurType: "Avis absent" }, null);
            return;
        };
        result(null, { message: "Avis supprimé", data: (message_id, utilisateur_id) });
    });
};

/* Rajout de la ligne pour message_id et utilisateur_id dans la table likes */
Post.rajoutUtilisateurAvisMessage = (newAvis, result) => {
    sql.query("INSERT INTO likes SET ?", newAvis, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        result(null, { message: "Nouveau avis enregistré", data: { _id: res.insertId, ...newAvis } });
    });
};

/* Comparaison et Traitement des datas pour obtention de la liste des messages sans avis data */
Post.compareMessages = (resAll, resAvis) => {
    // Reduction des doublons
    const reducedMessageFromAll = resAll.reduce( (acc, ligneTableSQL, index) => {
        if (!acc.hasOwnProperty(ligneTableSQL._id)) {
            acc[ligneTableSQL._id] = {
                orderMessage: index,
                _id: ligneTableSQL._id,
                createur_id: ligneTableSQL.createur_id,
                titre: ligneTableSQL.titre,
                content: ligneTableSQL.content,
                imageUrl: ligneTableSQL.imageUrl,
                creationDate: ligneTableSQL.creationDate,
                modificationDate: ligneTableSQL.creationDate,
                nbrJaimes: 0,
                nbrJadores: 0,
                listeJaimeData: [],
                listeJadoreData: []
            }
        };
        return acc;
    }, {})
    // Convertion de l'objet en liste de ses valeurs (=> Object.values) et tri en fonction de l'ordre décroissant des dates (=> sort de la liste)
    let listReducedMessageFromAll = Object.values(reducedMessageFromAll).sort((a, b) => {
        return a.orderMessage - b.orderMessage;
    });

    const reducedMessageFromAvis = resAvis.reduce( (acc, ligneTableSQL, index) => {
        if (!acc.hasOwnProperty(ligneTableSQL.message_id)) {
            acc[ligneTableSQL.message_id] = {
                orderMessage: index,
                _id: ligneTableSQL.message_id,
                createur_id: ligneTableSQL.createur_id,
                titre: ligneTableSQL.titre,
                content: ligneTableSQL.content,
                imageUrl: ligneTableSQL.imageUrl,
                creationDate: ligneTableSQL.creationDate,
                modificationDate: ligneTableSQL.creationDate,
                nbrJaimes: 0,
                nbrJadores: 0,
                listeJaimeData: [],
                listeJadoreData: []
            }
        };
        let flag = ligneTableSQL.flag
        if (flag === 1) {
            acc[ligneTableSQL.message_id]["nbrJaimes"] += 1
            acc[ligneTableSQL.message_id]["listeJaimeData"].push(ligneTableSQL.utilisateur_id)
        }
        if (flag === -1) {
            acc[ligneTableSQL.message_id]["nbrJadores"] += 1
            acc[ligneTableSQL.message_id]["listeJadoreData"].push(ligneTableSQL.utilisateur_id)
        }
        return acc;
    }, {})
    // Convertion de l'objet en liste de ses valeurs (=> Object.values) et tri en fonction de l'ordre décroissant des dates (=> sort de la liste)
    let listReducedMessageFromAvis = Object.values(reducedMessageFromAvis).sort((a, b) => {
        return a.orderMessage - b.orderMessage;
    });

    // Comparaison et mise à jour de la liste avec les informations sur les avis
    if (listReducedMessageFromAll.length === listReducedMessageFromAvis.length) {
        return listReducedMessageFromAvis;
    } else {
        let listeMessageUpdated = []
        for (message of listReducedMessageFromAll) {
            let updated = false
            for (messageWithAvis of listReducedMessageFromAvis) {
                if (message._id === messageWithAvis._id) {
                    listeMessageUpdated.push({ ...messageWithAvis });
                    updated = true
                    break;
                };
            };
            if (!updated) {
                listeMessageUpdated.push({ ...message });
            };
        };
        return listeMessageUpdated;
    };
};

/* Traitement des datas pour obtention de la liste des messages avec like data */
Post.updatedMessages = (allPostWithAvisData) => {
    const updatedMessage = allPostWithAvisData.reduce( (acc, ligneTableSQL, index) => {
        if (!acc.hasOwnProperty(ligneTableSQL.message_id)) {
            acc[ligneTableSQL.message_id] = {
                orderMessage: index,
                _id: ligneTableSQL.message_id,
                createur_id: ligneTableSQL.createur_id,
                titre: ligneTableSQL.titre,
                content: ligneTableSQL.content,
                imageUrl: ligneTableSQL.imageUrl,
                creationDate: ligneTableSQL.creationDate,
                modificationDate: ligneTableSQL.creationDate,
                nbrJaimes: 0,
                nbrJadores: 0,
                listeJaimeData: [],
                listeJadoreData: []
            }
        };
        let flag = ligneTableSQL.flag
        if (flag === 1) {
            acc[ligneTableSQL.message_id]["nbrJaimes"] += 1
            acc[ligneTableSQL.message_id]["listeJaimeData"].push(ligneTableSQL.utilisateur_id)
        }
        if (flag === -1) {
            acc[ligneTableSQL.message_id]["nbrJadores"] += 1
            acc[ligneTableSQL.message_id]["listeJadoreData"].push(ligneTableSQL.utilisateur_id)
        }
        return acc;
    }, {})
    // Convertion de l'objet en liste de ses valeurs (=> Object.values) et tri en fonction de l'ordre décroissant des dates (=> sort de la liste)
    let listUpdatedMessage = Object.values(updatedMessage).sort((a, b) => {
        return a.orderMessage - b.orderMessage;
    });
    return listUpdatedMessage;
};

/* Exportation du modèle de Post pour les messages */
module.exports = Post;
