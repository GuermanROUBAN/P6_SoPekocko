const express = require('express');

const router = express.Router();

const stuffCtrl = require('../controllers/sauce');

const express = require('express');

const router = express.Router();

const stuffCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');



// 2) On envoie dans la base de donnée
router.post('/', auth, multer, stuffCtrl.creatThing); 
// on met multer après l'authentification de la requete et pas avant

// 2.C) Mise en place de la modification d'un article
router.put('/:id', auth, multer, stuffCtrl.modifyThing);

// 2.D) Supprimer un article
router.delete('/:id', auth, stuffCtrl.deleteThing);
  
// 2.B) Recup d'un id spécifique
router.get('/:id', auth, stuffCtrl.getOneThing)
  
// 2.A) On va aller chercher dans la BD
router.get('/', auth, stuffCtrl.getAllThings);

module.exports = router;