/*
Pour rendre notre structure plus modulaire et simplifier
la gestion de notre code nous allons séparer 
la logique métier de nos routes en contrôleurs.
*/

//Importation du modèle Sauce
const Sauce = require('../models/Sauce');
const fs = require('fs');
//-----------------------------------------------------------------------------

// Création sauce
exports.creatSauce = (req, res, next) => {
  // on extrait l'objet JSON du Sauce
  const sauceObject = JSON.parse(req.body.sauce);

  delete sauceObject._id;

  // on crée une instance de notre modele Sauce
  const sauce = new Sauce({
    //  operateur spread ... fait une copie de tous les elements de req.body
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  // methode save enregistre notre Sauce dans la BD //save renvoi une promise
  sauce.save()
    // renvoie reponse de reussite
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    // renvoie une reponse avec l'erreur  
    .catch(error => res.status(400).json({ error }));
};
//-----------------------------------------------------------------------------


// Modification sauce
exports.modifySauce = (req, res, next) => {
  // si reg.file existe on aura un type d'objet et s'il n'existe
  //pas on aura un autre type d'objet  
  const sauceObject = req.file ?
    { // On rajoute une image
      ...JSON.parse(req.body.sauce), // on recupere toutes les infos sur l'objet dans cette partie de la requete
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // on genere une nouvelle image. On modifi sauceObject l.26 en modifiant son identifiant.
    } :
    { ...req.body };// On fait une copie de req.body
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // permet de mettre à jour Sauce, {objet} que nous passons en argument.
    // Nous utilisons aussi id passé dans la demande et le remplacons par le Sauce passé comme second argument.
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch(error => res.status(400).json({ error }));
}
//-----------------------------------------------------------------------------

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => { // 
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const fileName = sauce.imageUrl.split('/images')[1];
      fs.unlink(`images/${fileName}`, () => {
        Sauce.deleteOne({ _id: req.params.id }) // On lui passe un objet correspondant au document à supprimer. 
          // Et on envoie une reponse de réussite au F_e?.
          .then(() => res.status(200).json({ message: "Sauce supprimée!" }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
//-----------------------------------------------------------------------------

// Trouver une sauce
exports.getOneSauce = (req, res, next) => { // use devient get car on veut que les requetes get. 
  //On utilise deux points face au segment dynamique pour la rendre accessible entant que parametre.
  Sauce.findOne({ _id: req.params.id }) //on cherche un Sauce unique ayant le meme _id que le parametre de la requete.
    .then(sauces => res.status(200).json(sauces)) // il va nous renvoyer le tableau des sauces dans le F-e
    .catch(error => res.status(404).json({ error })); // si aucun Sauce ou une erreur alors envoie 404 au F-e.
}
//-----------------------------------------------------------------------------

// Voir toutes les sauces
exports.getAllSauces = (req, res, next) => {// use devient get car on veut que les requetes get
  Sauce.find() // On veut la liste complete qui nous retourne une promise
    .then(sauces => res.status(200).json(sauces)) // il va nous renvoyer le tableau des sauces
    .catch(error => res.status(400).json({ error }));
}
//-----------------------------------------------------------------------------

// Like/dislike une sauce
exports.likeSauce = (req, res, next) => {
  // Récupération d'une sauce
  Sauce.findOne({ _id: req.params.id })// on cherche la sauce par l'id (id rouge dans la BD)
    .then(sauce => {
      switch (req.body.like) { // recuperer la valeur du front end
        case -1: // L'utilisateur a appuye sur dislike
          Sauce.updateOne({ _id: req.params.id }, { // on update la sauce 
            $inc: { dislikes: 1 }, // dans dislike on ajoute 1
            $push: { usersDisliked: req.body.userId }, // on ajoute dans le tableau usersDisliked l'id de l'user qui a disliké
            
          })
            .then(() => res.status(201).json({ message: 'Dislike !' }))
            .catch(error => res.status(400).json({ error }))
          break;

        case 0:
          //Cas -1 Like : On retire un like
          if (sauce.usersLiked.find(user => user === req.body.userId)) { // massif avec les users qui on like notre sauce
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },          
            })
              .then(() => res.status(201).json({ message: ' Like retiré !' }))
              .catch(error => res.status(400).json({ error }))
          }

          //Cas -1 dislike : On retire un dislike
          if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },            
            })
              .then(() => res.status(201).json({ message: ' Dislike retiré !' }))
              .catch(error => res.status(400).json({ error }));
          }
          break

        case 1:
          Sauce.updateOne({ _id: req.params.id }, {
            $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },          
          })
            .then(() => res.status(201).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }));
          break;
        default:
          return res.status(500).json({ error });

      }
    })
    .catch(error => res.status(500).json({ error }))
}