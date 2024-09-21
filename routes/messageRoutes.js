// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// @route   GET /api/conversations/:id/messages
// @desc    Obtenir tous les messages d'une conversation
// @access  Privé
router.get("/conversations/:id/messages", authMiddleware, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.utilisateur.id;

    // Vérifier si l'utilisateur fait partie de la conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(404).json({ msg: "Conversation non trouvée." });
    }

    const messages = await Message.find({ conversationId })
      .sort({ dateEnvoi: 1 }); // Trier par ordre croissant

    res.status(200).json({ messages });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur");
  }
});

// @route   POST /api/messages
// @desc    Envoyer un nouveau message
// @access  Privé
router.post("/", authMiddleware, async (req, res) => {
  const { conversationId, contenu } = req.body;
  if (!conversationId || !contenu) {
    return res.status(400).json({ msg: "Conversation ID et contenu requis." });
  }

  try {
    const userId = req.utilisateur.id;

    // Vérifier si la conversation existe et si l'utilisateur en fait partie
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(userId)) {
      return res.status(404).json({ msg: "Conversation non trouvée." });
    }

    // Déterminer le destinataire
    const receiverId = conversation.participants.find((id) => id !== userId);
    if (!receiverId) {
      return res.status(400).json({ msg: "Destinataire introuvable." });
    }

    const message = new Message({
      conversationId,
      senderId: userId,
      receiverId,
      contenu,
    });

    await message.save();

    // Mettre à jour le dernier message de la conversation
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json({ message });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur du serveur");
  }
});

module.exports = router;
