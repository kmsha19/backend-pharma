// routes/serviceRoutes.js
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

// Exemple de liste de services. Idéalement, ces services devraient être stockés dans une base de données.
const services = [
  { id: "1", nom: "Consultation Générale", description: "Consultation médicale générale.", prix: 50 },
  { id: "2", nom: "Consultation Spécialisée", description: "Consultation médicale spécialisée.", prix: 80 },
  // Ajoutez d'autres services selon les besoins
];

// @route   GET /api/services
// @desc    Obtenir la liste des services
// @access  Public
router.get("/", (req, res) => {
  res.status(200).json({ services });
});

// Vous pouvez ajouter des routes POST, PUT, DELETE pour gérer les services si nécessaire

module.exports = router;
