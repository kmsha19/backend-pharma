// backend-pharma/controllers/authController.js
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Import des modèles
const User = require('../models/User');
const Professional = require('../models/Professional');

/**
 * @desc    Inscription des patients
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerPatient = async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erreurs: errors.array() });
  }

  const { name, email, password, dateOfBirth } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Créer une nouvelle instance de User
    user = new User({
      name,
      email,
      password,
      role: 'patient',
      dateOfBirth,
    });

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Sauvegarder l'utilisateur
    await user.save();

    // Générer le token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * @desc    Inscription des professionnels
 * @route   POST /api/auth/register-pro
 * @access  Public
 */
exports.registerProfessional = async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erreurs: errors.array() });
  }

  const { nomEtablissement, adresse, specialties, email, password } = req.body;

  try {
    // Vérifier si le professionnel existe déjà
    let pro = await Professional.findOne({ email });
    if (pro) {
      return res.status(400).json({ message: 'Professionnel déjà existant' });
    }

    // Créer une nouvelle instance de Professional
    pro = new Professional({
      nomEtablissement,
      adresse,
      specialties, // Supposons que specialties est un tableau de chaînes
      email,
      password,
      role: 'professional',
    });

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    pro.password = await bcrypt.hash(password, salt);

    // Sauvegarder le professionnel
    await pro.save();

    // Générer le token JWT
    const payload = {
      user: {
        id: pro.id,
        role: pro.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * @desc    Connexion des utilisateurs (patients et professionnels)
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erreurs: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Rechercher l'utilisateur dans les collections User et Professional
    let user = await User.findOne({ email });
    let role = 'patient';
    if (!user) {
      user = await Professional.findOne({ email });
      role = 'professional';
      if (!user) {
        return res.status(400).json({ message: 'Utilisateur non trouvé' });
      }
    }

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Générer le token JWT
    const payload = {
      user: {
        id: user.id,
        role: role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};
