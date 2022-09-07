/*------------------------------------------------------------------------------------*/
/* Création de notre module (package) 'Sauce' modèle de Sauce de la db mongoose : */
/*------------------------------------------------------------------------------------*/

/* Importation du module (package) 'mongoose' */
const mongoose = require('mongoose');

/* Définition du schéma mongoose pour les Sauces qui utilise des objets {} */
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true }, // l'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
    name: { type: String, required: true }, // nom de la sauce
    manufacturer: { type: String, required: true }, // fabricant de la sauce
    description: { type: String, required: true }, // description de la sauce
    mainPepper: { type: String, required: true }, // le principal ingrédient épicé de la sauce
    imageUrl: { type: String, required: true }, // l'URL de l'image de la sauce téléchargée par l'utilisateur
    heat: { type: Number, required: true }, // nombre entre 1 et 10 décrivant la sauce
    likes: { type: Number, required: true }, // nombre d'utilisateurs qui aiment (= likent) la sauce
    dislikes: { type: Number, required: true }, // nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
    usersLiked: { type: Array, required: true }, // [ "String <userId>" ], tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce
    usersDisliked: { type: Array, required: true }, // [ "String <userId>" ], tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce
});
  
/* Exportation du modèle de User basé sur le schéma mongoose */
module.exports = mongoose.model('Sauce', sauceSchema);


