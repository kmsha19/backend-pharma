// backend-pharma/controllers/professionalController.js
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// Import du modèle Professional
const Professional = require('../models/Professional');

/**
 * @desc    Récupérer le profil d'un professionnel
 * @route   GET /api/professionals/:id
 * @access  Privé (professionnel ou administrateur)
 */
exports.getProfessionalProfile = async (req, res) => {
  try {
    // Vérifier si l'utilisateur demande est un professionnel ou le même utilisateur
    if (req.user.role !== 'professional' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    const pro = await Professional.findById(req.params.id).select('-password');
    if (!pro || pro.role !== 'professional') {
      return res.status(404).json({ message: 'Professionnel non trouvé' });
    }

    res.json(pro);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Professionnel non trouvé' });
    }
    res.status(500).send('Erreur serveur');
  }
};

/**
 * @desc    Mettre à jour le profil d'un professionnel
 * @route   PUT /api/professionals/:id
 * @access  Privé (professionnel ou administrateur)
 */
exports.updateProfessionalProfile = async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erreurs: errors.array() });
  }

  const { nomEtablissement, adresse, specialties, email, password } = req.body;

  // Construire l'objet de mise à jour
  const updateFields = {};
  if (nomEtablissement) updateFields.nomEtablissement = nomEtablissement;
  if (adresse) updateFields.adresse = adresse;
  if (specialties) updateFields.specialties = specialties;
  if (email) updateFields.email = email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateFields.password = await bcrypt.hash(password, salt);
  }

  try {
    // Vérifier si l'utilisateur est autorisé à mettre à jour ce profil
    if (req.user.role !== 'professional' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    // Vérifier l'existence du professionnel
    let pro = await Professional.findById(req.params.id);
    if (!pro || pro.role !== 'professional') {
      return res.status(404).json({ message: 'Professionnel non trouvé' });
    }

    // Mettre à jour le profil
    pro = await Professional.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    res.json(pro);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};
