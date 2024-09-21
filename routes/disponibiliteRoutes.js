// routes/disponibiliteRoutes.js
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const Professional = require("../models/Professional");

// @route   POST /api/disponibilites
// @desc    Ajouter une disponibilité
// @access  Privé (Professionnels)
router.post(
  "/",
  [
    authMiddleware,
    check("jour", "Le jour est requis").not().isEmpty(),
    check("heureDebut", "L'heure de début est requise").matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
    check("heureFin", "L'heure de fin est requise").matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
  ],
  async (req, res) => {
    const erreurs = validationResult(req);
    if (!erreurs.isEmpty()) {
      return res.status(400).json({ erreurs: erreurs.array() });
    }

    const { jour, heureDebut, heureFin } = req.body;

    try {
      const professional = await Professional.findById(req.utilisateur.id);
      if (!professional) {
        return res.status(404).json({ msg: "Professionnel non trouvé" });
      }

      professional.disponibilites.push({ jour, heureDebut, heureFin });
      await professional.save();

      res.status(200).json({ disponibilites: professional.disponibilites });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Erreur du serveur");
    }
  }
);

// @route   GET /api/disponibilites
// @desc    Obtenir les disponibilités du professionnel
// @access  Privé (Professionnels)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const professional = await Professional.findById(req.utilisateur.id);
    if (!professional) {
      return res.status(404).json({ msg: "Professionnel non trouvé" });
    }

    res.status(200).json({ disponibilites: professional.disponibilites });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur");
  }
});

// @route   DELETE /api/disponibilites/:id
// @desc    Supprimer une disponibilité
// @access  Privé (Professionnels)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const professional = await Professional.findById(req.utilisateur.id);
    if (!professional) {
      return res.status(404).json({ msg: "Professionnel non trouvé" });
    }

    professional.disponibilites = professional.disponibilites.filter(
      (dispo) => dispo._id.toString() !== req.params.id
    );

    await professional.save();
    res.status(200).json({ disponibilites: professional.disponibilites });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur");
  }
});

module.exports = router;
