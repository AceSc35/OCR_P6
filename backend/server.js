const express = require('express');
const colors = require('colors');
const bodyparser = require('body-parser');
const dotenv = require('dotenv').config();
const path = require('path');
const saucesRoutes = require('./routes/sauces.routes');

const { errorHandler } = require('./middlewares/errors.middlewares');

const connectDB = require('./config/mongoDB.config');
const port = process.env.PORT || 8000;

const app = express();

connectDB();

//Définir les en-tête de réponse HTTP
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use(express.json());
app.use(bodyparser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', require('./routes/user.routes'));
app.use('/api/sauces', saucesRoutes);

app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));
