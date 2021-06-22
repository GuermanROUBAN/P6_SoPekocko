
const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
//id: => ObjectID => "identifiant unique créé par MandoDB",
userId:{ type: String, required: true }, // "identifiant unique MandoDB pour l utilisateur qui a créé la sauce",
name: { type: String, required: true },//"nom de la sauce",
manufacturer: { type: String, required: true },//"fabricant de la sauce",
descrption:{ type: String, required: true },//"description de la sauce",
mainPepper: { type: String, required: true },//"principal ingrédient de la sauce",
imageUrl:{ type: String, required: true }, //"string de l'imade de la sauce téléchargée par l'utilisateur",
heat:{ type: Number, required: true },// number entre 1 et 10 décrivant la sauce,
likes: { type: Number, required: true, default:0 },//number d'utilisateurs qui aiment la sauce,
dislikes: { type: Number, required: true, default:0  },//umber d'utilisateurs qui n'aiment pas la sauce,
usersLiked: { type: [String], required: true },// "tableau d'identifiants d'utilisateurs ayant aimé la sauce",
usersDisliked:{ type: [String], required: true },//"tableau d'identifiants d'utilisateurs n'ayant pas aimé la sauce"title: { type: String, required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);
