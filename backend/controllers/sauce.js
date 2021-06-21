// Pour rendre notre structure plus modulaire et simplifier la gestion de notre code nous allons séparer la logique métier de nos routes en contrôleurs.
const Thing = require('../models/Thing');
const fs = require ('fs');

exports.creatThing = (req, res, next) => {

  const thingObject = JSON.parse(req.body.thing);// on extrait l'objet JSON du Thing
  delete thingObject._id;
  const thing = new Thing({// on crée une instance de notre modele Thing
    ...thingObject, //  operateur spnread ... fait une copie de tous les elements de req.body
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save() // methode save enregistre notre Thing dans la BD //save renvoi une promise
      .then(() => res.status(201).json({ message: 'Objet enregistré !'})) // renvoie reponse de reussite
      .catch(error => res.status(400).json({ error })); // renvoie une reponse avec l'erreur
  };

exports.modifyThing =  (req, res, next) => {
    const thingObject = req.file ?// si reg.file existe on aura un type d'objet et s'il n'existe pas on aura un autre type d'objet
    { // On rajoute une image
      ...JSON.parse(req.body.thing), // on recupere toutes les infos sur l'objet dans cette partie de la requete
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // on genere une nouvelle image. On modifi thingObject l.26 en modifiant son identifiant.
    }:
    {...req.body};// On fait une copie de req.body
    Thing.updateOne({_id:req.params.id},{...thingObject, _id:req.params.id}) // permet de mettre à jour Thing, {objet} que nous passons en argument.
    // Nous utilisons aussi id passé dans la demande et le remplacons par le Thing passé comme second argument.
    .then(() => res.status(200).json({message:"Objet modififié !"}))
    .catch(error => res.status(400).json({ error }));
  }

exports.deleteThing = (req, res, next) => { // 
    Thing.findOne({_id: req.params.id})
    .then(thing => {
      const filename = thing.imageUrl.split('/images')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({_id: req.params.id}) // On lui passe un objet correspondant au document à supprimer. 
    // Et on envoie une reponse de réussite au F_e?.
          .then(() => res.status(200).json({message:"Objet supprimé!"}))
          .catch(error => res.status(400).json({ error }));  
      });
    })
    .catch(error => res.status(500).json({ error }));  
  };

exports.getOneThing = (req, res, next) => { // use devient get car on veut que les requetes get. 
    //On utilise deux points face au segment dynamique pour la rendre accessible entant que parametre.
    Thing.findOne({_id: req.params.id}) //on cherche un Thing unique ayant le meme _id que le parametre de la requete.
    .then(things => res.status(200).json(things)) // il va nous renvoyer le tableau des things dans le F-e
    .catch(error => res.status(404).json({error})); // si aucun Thing ou une erreur alors envoie 404 au F-e.
  }

exports.getAllThings = (req, res, next) => {// use devient get car on veut que les requetes get
    Thing.find() // On veut la liste complete qui nous retourne une promise
      .then(things => res.status(200).json(things)) // il va nous renvoyer le tableau des things
      .catch(error => res.status(400).json({error}));
    }