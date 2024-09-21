// routes/conversationRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

// @route   GET /api/conversations
// @desc    Obtenir toutes les conversations de l'utilisateur
// @access  Privé
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.utilisateur.id;
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "nom email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    res.status(200).json({ conversations });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur");
  }
});

// @route   POST /api/conversations
// @desc    Créer une nouvelle conversation
// @access  Privé
router.post("/", authMiddleware, async (req, res) => {
  const { receiverId } = req.body;
  if (!receiverId) {
    return res.status(400).json({ msg: "ID du destinataire requis." });
  }

  try {
    const userId = req.utilisateur.id;

    // Vérifier si la conversation existe déjà
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (conversation) {
      return res.status(200).json({ conversation });
    }

    // Créer une nouvelle conversation
    conversation = new Conversation({
      participants: [userId, receiverId],
    });

    await conversation.save();

    // Optionnel : Retourner la conversation avec les participants peuplés
    conversation = await Conversation.findById(conversation._id).populate("participants", "nom email");

    res.status(201).json({ conversation });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur");
  }
});

module.exports = router;
