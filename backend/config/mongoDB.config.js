const mongoose = require('mongoose');

//Connexion avec le logiciel MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected and ready to pair : ${conn.connection.host}`.blue.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
