// backend-pharma/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Import du contrôleur d'authentification
const authController = require('../controllers/authController');

// Route: POST /api/auth/register
// Description: Inscription des patients
router.post('/register', [
  check('name', 'Le nom est requis').not().isEmpty(),
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('password', 'Le mot de passe doit comporter au moins 6 caractères').isLength({ min: 6 }),
  check('dateOfBirth', 'La date de naissance est requise').isISO8601(),
], authController.registerPatient);

// Route: POST /api/auth/register-pro
// Description: Inscription des professionnels
router.post('/register-pro', [
  check('nomEtablissement', 'Le nom de l\'établissement est requis').not().isEmpty(),
  check('adresse', 'L\'adresse est requise').not().isEmpty(),
  check('specialties', 'Les spécialités sont requises').isArray({ min: 1 }),
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('password', 'Le mot de passe doit comporter au moins 6 caractères').isLength({ min: 6 }),
], authController.registerProfessional);

// Route: POST /api/auth/login
// Description: Connexion des utilisateurs (patients et professionnels)
router.post('/login', [
  check('email', 'Veuillez inclure un email valide').isEmail(),
  check('password', 'Le mot de passe est requis').exists(),
], authController.loginUser);

module.exports = router;
