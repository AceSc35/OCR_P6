const jwt = require('jsonwebtoken');

//Autorisation
module.exports = (req, res, next) => {
  try {
    //Cette constante obtiendra le jeton de l'en-tête (Bearer Token)
    const token = req.headers.authorization.split(' ')[1];
    req.token = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    if (req.body.userId && req.body.userId !== req.token.userId) {
      throw 'User ID non valable !';
    } else {
      next();
    }
  } catch (error) {
    res.status(403).json({ message: 'utilisateur non identifiable' });
  }
};
