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
Post.modify = (id, newPost, result, likeBoolean = false) => {
    if (!likeBoolean) { // Changement de la date de modification si pas un changement due à un like
        // Changement de la date de modification
        newPost.modificationDate = new Date(Date.now());
    };
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
    sql.query(`SELECT * FROM messages WHERE ${type} = "${value}" ORDER BY modificationDate DESC`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, { message: "Message présent", data: res } );
            return;
        }
        // Post avec l'id pas trouvé
        result({ erreurType: "Message absent" }, null);
    });
};

Post.findAll = (result) => {
    sql.query(`SELECT * FROM messages ORDER BY modificationDate DESC`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        if (res.length) {
            result(null, { message: "Liste de tous les messages", data: res } );
            return;
        };
        // Post avec l'id pas trouvé
        result({ erreurType: "Message absent" }, null);
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

/* Envoi du Flag d'un like pour message_id et utilisateur_id dans la table likes */
Post.flagUtilisateurLikeMessage = (message_id, utilisateur_id, result) => {
    sql.query(`SELECT flag FROM likes WHERE message_id = ${message_id} AND utilisateur_id = ${utilisateur_id}`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        if (res.length) {
            result(null, { message: `Le flag du like est : ${res[0].flag}`, data: res[0].flag });
            return;
        };
        // Like avec l'id du message et de l'utilisateur pas trouvé
        result({ erreurType: "Like absent" }, null);
    });
};

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
  
/* Exportation du modèle de Post pour les messages */
module.exports = Post;
