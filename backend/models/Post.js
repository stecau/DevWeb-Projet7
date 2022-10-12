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
    //this.likes = post.likes; // le nombre de likes
    //this.dislikes = post.dislikes; // le nombre de dislikes
    //this.listUserLikes = post.listUserLikes; // la liste des utilisateurs qui ont liké le message
    //this.listUserDislikes = post.listUserDislikes; // la liste des utilisateurs qui ont disliké le message
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
                    ORDER BY messages.modificationDate DESC`, (err, resLike) => {
                if (err) {
                    result(err, null);
                    return;
                }
                if (resLike.length || resAll.length) {
                    // traitement des messages sans like avec mise en jour pour les messages avec like
                    const listUpdatedMessage = Post.compareMessages(resAll, resLike);
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
                    ORDER BY messages.modificationDate DESC`, (err, resLike) => {
                if (err) {
                    result(err, null);
                    return;
                };
                if (resLike.length) {
                    // traitement des messages sans like avec mise en jour pour les messages avec like
                    const listUpdatedMessage = Post.compareMessages(resAll, resLike);
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

// /* Envoi du Flag d'un like pour message_id et utilisateur_id dans la table likes */
// Post.flagUtilisateurLikeMessage = (message_id, utilisateur_id, result) => {
//     sql.query(`SELECT flag FROM likes WHERE message_id = ${message_id} AND utilisateur_id = ${utilisateur_id}`, (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         };
//         if (res.length) {
//             result(null, { message: `Le flag du like est : ${res[0].flag}`, data: res[0].flag });
//             return;
//         };
//         // Like avec l'id du message et de l'utilisateur pas trouvé
//         result({ erreurType: "Like absent" }, null);
//     });
// };

/* Suppression de la ligne pour message_id et utilisateur_id dans la table likes */
Post.suppressionUtilisateurLikeMessage = (message_id, utilisateur_id, result) => {
    sql.query(`DELETE FROM likes WHERE message_id = ${message_id} AND utilisateur_id = ${utilisateur_id}`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        if (res.affectedRows == 0) { // Like avec message_id et utilisateur_id pas trouvé
            result({ erreurType: "Like absent" }, null);
            return;
        };
        result(null, { message: "Like supprimé", data: (message_id, utilisateur_id) });
    });
};

/* Rajout de la ligne pour message_id et utilisateur_id dans la table likes */
Post.rajoutUtilisateurLikeMessage = (newLike, result) => {
    sql.query("INSERT INTO likes SET ?", newLike, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        result(null, { message: "Nouveau like enregistré", data: { _id: res.insertId, ...newLike } });
    });
};

// /* Récupération des listes d'id d'utillisateur qui ont liké et disliké pour un message */
// Post.getLikesMessage = (messageId, result) => {
//     // Récupération de la liste des utilisateur.id qui ont fait un like pour un message
//     Post.getListeLikesMessage(messageId, 1, (errListeLikes, dataListeLikes) => {
//         // Récupération de la liste des utilisateur.id qui ont fait un dislike pour un message
//         Post.getListeLikesMessage(messageId, -1, (errListeDislikes, dataListeDislikes) => {
//             result({
//                 "listeLikesErreur": errListeLikes,
//                 "listeDislikesErreur": errListeDislikes
//             },
//             {
//                 "listeLikesData": dataListeLikes,
//                 "listeDislikesData": dataListeDislikes
//             });
//         });
//     });
// };

// /* Récupération liste id utillisateur like ou dislike pour un message */
// Post.getListeLikesMessage = (messageId, flag, result) => {
// // Récupération de la liste des utilisateur.id qui ont fait un dislike pour un message
//     sql.query(`SELECT utilisateur_id FROM messages
//                JOIN likes ON messages._id = likes.message_id
//                JOIN utilisateurs ON utilisateurs._id = likes.utilisateur_id
//                WHERE messages._id = ${messageId} && flag = ${flag}
//                ORDER BY messages.modificationDate DESC`, (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         };
//         if (res.length && flag === 1) {
//             result(null, { message: `Liste de likes pour message ${messageId}`, data: res });
//             return;
//         };
//         if (res.length && flag === -1) {
//             result(null, { message: `Liste de dislikes pour message ${messageId}`, data: res });
//             return;
//         };
//         // MessageId ou flag inexsistant pour le post rechercher
//         result({ erreurType: "Like/Dislike absent ou Message absent" }, null);
//     });
// };

// /* Récupération liste id utillisateur like ou dislike pour tous les messages */
// Post.getListeLikesAllMessage = (result) => {
//     // Récupération de la liste des utilisateur.id qui ont fait un dislike pour un message
//     sql.query(`SELECT message_id, createur_id, titre, content, imageUrl, messages.creationDate, messages.modificationDate, utilisateur_id, flag FROM messages
//                 JOIN likes ON messages._id = likes.message_id
//                 JOIN utilisateurs ON utilisateurs._id = likes.utilisateur_id
//                 ORDER BY messages.modificationDate DESC`, (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         } 
//         if (res.length){
//             result(null, { message: `Liste des messages avec like-utilisateur_id et like-flag : `, data: res });
//             return;
//         };
//         // Post inexistant
//         result({ erreurType: "Message absent de la base" }, null);
//     });
// };

/* Comparaison et Traitement des datas pour obtention de la liste des messages sans like data */
Post.compareMessages = (resAll, resLike) => {
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
                nbrLikes: 0,
                nbrDislikes: 0,
                listeLikesData: [],
                listeDislikesData: []
            }
        };
        return acc;
    }, {})
    // Convertion de l'objet en liste de ses valeurs (=> Object.values) et tri en fonction de l'ordre décroissant des dates (=> sort de la liste)
    let listReducedMessageFromAll = Object.values(reducedMessageFromAll).sort((a, b) => {
        return a.orderMessage - b.orderMessage;
    });

    const reducedMessageFromLike = resLike.reduce( (acc, ligneTableSQL, index) => {
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
                nbrLikes: 0,
                nbrDislikes: 0,
                listeLikesData: [],
                listeDislikesData: []
            }
        };
        let flag = ligneTableSQL.flag
        if (flag === 1) {
            acc[ligneTableSQL.message_id]["nbrLikes"] += 1
            acc[ligneTableSQL.message_id]["listeLikesData"].push(ligneTableSQL.utilisateur_id)
        }
        if (flag === -1) {
            acc[ligneTableSQL.message_id]["nbrDislikes"] += 1
            acc[ligneTableSQL.message_id]["listeDislikesData"].push(ligneTableSQL.utilisateur_id)
        }
        return acc;
    }, {})
    // Convertion de l'objet en liste de ses valeurs (=> Object.values) et tri en fonction de l'ordre décroissant des dates (=> sort de la liste)
    let listReducedMessageFromLike = Object.values(reducedMessageFromLike).sort((a, b) => {
        return a.orderMessage - b.orderMessage;
    });

    // Comparaison et mise à jour de la liste avec les informations sur les likes
    if (listReducedMessageFromAll.length === listReducedMessageFromLike.length) {
        return listReducedMessageFromLike;
    } else {
        let listeMessageUpdated = []
        for (message of listReducedMessageFromAll) {
            let updated = false
            for (messageWithLike of listReducedMessageFromLike) {
                if (message._id === messageWithLike._id) {
                    listeMessageUpdated.push({ ...messageWithLike });
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
Post.updatedMessages = (allPostWithLikesData) => {
    const updatedMessage = allPostWithLikesData.reduce( (acc, ligneTableSQL, index) => {
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
                nbrLikes: 0,
                nbrDislikes: 0,
                listeLikesData: [],
                listeDislikesData: []
            }
        };
        let flag = ligneTableSQL.flag
        if (flag === 1) {
            acc[ligneTableSQL.message_id]["nbrLikes"] += 1
            acc[ligneTableSQL.message_id]["listeLikesData"].push(ligneTableSQL.utilisateur_id)
        }
        if (flag === -1) {
            acc[ligneTableSQL.message_id]["nbrDislikes"] += 1
            acc[ligneTableSQL.message_id]["listeDislikesData"].push(ligneTableSQL.utilisateur_id)
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
