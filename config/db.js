// backend-pharma/config/db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connexion à la base de données MongoDB réussie !");
  } catch (err) {
    console.error("Erreur lors de la connexion à la base de données :", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
