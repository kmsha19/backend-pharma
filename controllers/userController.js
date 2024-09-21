// backend-pharma/controllers/userController.js
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Import du modèle User
const User = require('../models/User');

/**
 * @desc    Récupérer le profil d'un patient
 * @route   GET /api/users/:id
 * @access  Privé (patient ou professionnel)
 */
exports.getUserProfile = async (req, res) => {
  try {
    // Vérifier si l'utilisateur demande est un patient ou le même utilisateur
    if (req.user.role !== 'patient' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user || user.role !== 'patient') {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
};

/**
 * @desc    Mettre à jour le profil d'un patient
 * @route   PUT /api/users/:id
 * @access  Privé (patient ou professionnel)
 */
exports.updateUserProfile = async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erreurs: errors.array() });
  }

  const { name, email, password } = req.body;

  // Construire l'objet de mise à jour
  const updateFields = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateFields.password = await bcrypt.hash(password, salt);
  }

  try {
    // Vérifier si l'utilisateur est autorisé à mettre à jour ce profil
    if (req.user.role !== 'patient' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    // Vérifier l'existence du patient
    let user = await User.findById(req.params.id);
    if (!user || user.role !== 'patient') {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    // Mettre à jour le profil
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};
