const express = require('express');
const router = express.Router();
const saucesctrl = require('../controllers/sauces.controllers');
const auth = require('../middlewares/auth.middlewares');
const multer = require('../middlewares/multer.middlewares');

//Ajouter une nouvelle sauce
router.post('/', auth, multer, saucesctrl.createSauce);

//Modifier une sauce existante
router.put('/:id', auth, multer, saucesctrl.modifySauce);

//Supprimer une sauce existance
router.delete('/:id', auth, saucesctrl.deleteSauce);

//Obtenir toutes les sauces
router.get('/', auth, saucesctrl.getAllSauces);

//Obtenir une sauce en particulier
router.get('/:id', auth, saucesctrl.getOneSauce);

//Route pour la fonction like,dislike

router.post('/:id/like', auth, saucesctrl.doYouLikeIt);

module.exports = router;
