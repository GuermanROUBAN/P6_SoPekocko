// Pour rendre notre structure plus modulaire et simplifier la gestion de notre code nous allons séparer la logique métier de nos routes en contrôleurs.
const Sauce = require('../models/Sauce');
const fs = require ('fs');

exports.creatSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);// on extrait l'objet JSON du Sauce
  delete sauceObject._id;
  const sauce = new Sauce({// on crée une instance de notre modele Sauce
    ...sauceObject, //  operateur spnread ... fait une copie de tous les elements de req.body
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() // methode save enregistre notre Sauce dans la BD //save renvoi une promise
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'})) // renvoie reponse de reussite
      .catch(error => res.status(400).json({ error })); // renvoie une reponse avec l'erreur
  };

exports.modifySauce =  (req, res, next) => {
    const sauceObject = req.file ?// si reg.file existe on aura un type d'objet et s'il n'existe pas on aura un autre type d'objet
    { // On rajoute une image
      ...JSON.parse(req.body.sauce), // on recupere toutes les infos sur l'objet dans cette partie de la requete
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // on genere une nouvelle image. On modifi sauceObject l.26 en modifiant son identifiant.
    }:
    {...req.body};// On fait une copie de req.body
    Sauce.updateOne({_id:req.params.id},{...sauceObject, _id:req.params.id}) // permet de mettre à jour Sauce, {objet} que nous passons en argument.
    // Nous utilisons aussi id passé dans la demande et le remplacons par le Sauce passé comme second argument.
    .then(() => res.status(200).json({message:"Sauce modifiée !"}))
    .catch(error => res.status(400).json({ error }));
  }

exports.deleteSauce = (req, res, next) => { // 
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: req.params.id}) // On lui passe un objet correspondant au document à supprimer. 
    // Et on envoie une reponse de réussite au F_e?.
          .then(() => res.status(200).json({message:"Sauce supprimée!"}))
          .catch(error => res.status(400).json({ error }));  
      });
    })
    .catch(error => res.status(500).json({ error }));  
  };

exports.getOneSauce = (req, res, next) => { // use devient get car on veut que les requetes get. 
    //On utilise deux points face au segment dynamique pour la rendre accessible entant que parametre.
    Sauce.findOne({_id: req.params.id}) //on cherche un Sauce unique ayant le meme _id que le parametre de la requete.
    .then(sauces => res.status(200).json(sauces)) // il va nous renvoyer le tableau des sauces dans le F-e
    .catch(error => res.status(404).json({error})); // si aucun Sauce ou une erreur alors envoie 404 au F-e.
  }

exports.getAllSauce = (req, res, next) => {// use devient get car on veut que les requetes get
    Sauce.find() // On veut la liste complete qui nous retourne une promise
      .then(sauces => res.status(200).json(sauces)) // il va nous renvoyer le tableau des sauces
      .catch(error => res.status(400).json({error}));
    }