const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/user.controllers');

//Route pour créer un compte utilisateur
router.post('/signup', signup);

//Route pour se connecter avec un compte utilisateur
router.post('/login', login);

module.exports = router;
