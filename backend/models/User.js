/*---------------------------------------------------------------------------------*/
/* Création de notre module (package) 'Utilisateur' modèle d'utilisateur de la db MySQL : */
/*---------------------------------------------------------------------------------*/

/* Importation du module (package) 'db' connexion à la base de données MySQL */
const sql = require("./db.js");

// constructeur d'un utilisateur
const Utilisateur = function(utilisateur) {
    this.email = utilisateur.email;
    this.nom = utilisateur.nom;
    this.prenom = utilisateur.prenom;
    this.poste = utilisateur.poste;
    this.motDePasse = utilisateur.motDePasse;
};

/* Creation d'un utilisateur */
Utilisateur.create = (nouvelUtilisateur, result) => {
    sql.query("INSERT INTO utilisateurs SET ?", nouvelUtilisateur, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        result(null, { message: "Nouvel utilisateur enregistré", data: { _id: res.insertId, ...nouvelUtilisateur } });
    });
};

/* Modification d'un utilisateur */
Utilisateur.modify = (id, nouvelUtilisateur, result) => {
    // Changement de la date de modification
    nouvelUtilisateur.modificationDate = new Date(Date.now());
    sql.query(`UPDATE utilisateurs SET ? WHERE _id = ${id}`, nouvelUtilisateur, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        if (res.affectedRows == 0) { // Utilisateur avec l'id pas trouvé
            result({ erreurType: "Utilisateur absent" }, null);
            return;
        };
        result(null, { message: "Utilisateur modifié", data: { _id: id, ...nouvelUtilisateur } });
    });
};

/* Recherche d'un utilisateur avec l'id */
Utilisateur.findBy = ( {"key": type, "value": value} , result) => {
    sql.query(`SELECT * FROM utilisateurs WHERE ${type} = "${value}"`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        if (res.length) {
            result(null, { message: "Utilisateur présent", data: res[0] } ); // id unique donc index de la liste 0
            return;
        };
        // Utilisateur avec l'id pas trouvé
        result({ erreurType: "Utilisateur absent" }, null);
    });
};

/* Suppression d'un utilisateur */
Utilisateur.remove = (id, result) => {
    sql.query("DELETE FROM utilisateurs WHERE _id = ?", id, (err, res) => {
        if (err) {
            result(err, null);
            return;
        };
        if (res.affectedRows == 0) { // Utilisateur avec l'id pas trouvé
            result({ erreurType: "Utilisateur absent" }, null);
            return;
        };
        result(null, { message: "Utilisateur supprimé", data: id });
    });
};
  
/* Exportation du modèle de 'Utilisateur' pour les utilisateurs */
module.exports = Utilisateur;