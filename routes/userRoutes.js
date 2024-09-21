// backend-pharma/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Import du contrôleur des utilisateurs
const userController = require('../controllers/userController');

// Middleware d'authentification
const auth = require('../middleware/authMiddleware');

// Route: GET /api/users/:id
// Description: Récupérer le profil d'un patient
router.get('/:id', auth, userController.getUserProfile);

// Route: PUT /api/users/:id
// Description: Mettre à jour le profil d'un patient
router.put('/:id', [
  auth,
  [
    check('email', 'Veuillez inclure un email valide').optional().isEmail(),
    check('password', 'Le mot de passe doit comporter au moins 6 caractères').optional().isLength({ min: 6 }),
  ]
], userController.updateUserProfile);

module.exports = router;
