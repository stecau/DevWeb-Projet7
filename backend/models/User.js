/*------------------------------------------------------------------------------------*/
/* Création de notre module (package) 'User' modèle d'utilisateur de la db mongoose : */
/*------------------------------------------------------------------------------------*/

/* Importation du module (package) 'mongoose' */
const mongoose = require('mongoose');
/* Importation du module (package) 'mongoose-unique-validator' */
const uniqueValidator = require('mongoose-unique-validator');

/* Définition du schéma mongoose pour les users qui utilise des objets {} */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, // unique (mot clé) permet de ne pas avoir deux fois le même Email
    password: { type: String, required: true }
});

/* Appel du plugin 'mongoose-unique-validator' pour ne pas avoir deux utilisateurs avec le même Email */
userSchema.plugin(uniqueValidator); 
  
/* Exportation du modèle de User basé sur le schéma mongoose */
module.exports = mongoose.model('User', userSchema);