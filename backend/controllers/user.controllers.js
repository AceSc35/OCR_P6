const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.models');

//Utilisation de JWT pour générer un token

//Pour créer un utilisateur avec un mdp hashé, c'est à dire transformer un mdp en chaine de caractère pour plus de sécurité.
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'utilisateur crée !' }))
        .catch((error) => res.status(400).json({ message: 'Ce mail est déjà utilisé' }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Pour permettre à l'utilisateur de se log
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
