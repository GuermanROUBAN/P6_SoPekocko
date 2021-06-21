const express = require('express');

const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');



// 2) On envoie dans la base de donnée
router.post('/', auth, multer, sauceCtrl.creatSauce); 
// on met multer après l'authentification de la requete et pas avant

// 2.C) Mise en place de la modification d'un article
router.put('/:id', auth, multer, sauceCtrl.modifySauce);

// 2.D) Supprimer un article
router.delete('/:id', auth, sauceCtrl.deleteSauce);
  
// 2.B) Recup d'un id spécifique
router.get('/:id', auth, sauceCtrl.getOneSauce)
  
// 2.A) On va aller chercher dans la BD
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;