const Sauce = require('../models/sauces.models');
const fs = require('fs');

//Ajouter une nouvalle sauce pour l'app
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(sauceObject);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistrée !' }))
    .catch((error) => res.status(400).json({ error }));
};

//Modifier une sauce de l'app
exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const sauceObject = req.file
        ? { ...JSON.parse(req.body.sauce), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }
        : { ...req.body };
      if (sauce.userId === req.token.userId) {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
          .catch((error) => res.status(400).json({ error }));
      } else {
        res.status(401).json({ error: `Vous n'êtes pas autorisé à modifier cette sauce !` });
      }
    })
    .catch(() => res.status(500).json({ error: 'Sauce introuvable' }));
};

//Supprimer une sauce de l'app
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId === req.token.userId) {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
            .catch((error) => res.status(500).json({ error: error.message }));
        });
      } else {
        res.status(401).json({ error: `Vous n'êtes pas autorisé à supprimer cette sauce !` });
      }
    })
    .catch(() => res.status(500).json({ error: 'Sauce introuvable' }));
};

//Obtenir une sauce de l'app
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//Obtenir toutes les sauces de l'app
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

//Systeme de like et dislike
exports.doYouLikeIt = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const userId = req.body.userId;
      const like = req.body.like;

      //On filtre par utilisateur
      sauce.usersLiked = sauce.usersLiked.filter((el) => el !== userId);
      sauce.usersDisliked = sauce.usersDisliked.filter((el) => el !== userId);

      //on push dans le tableau l'utilisateur par son id en fonction du like ou dislike
      if (like === 1) {
        sauce.usersLiked.push(userId);
      }

      if (like === -1) {
        sauce.usersDisliked.push(userId);
      }

      //On relie le like/dislike avec le tableau
      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;

      sauce
        .save()
        .then(() => res.status(200).json({ message: 'Votre avis a été enregistré !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
