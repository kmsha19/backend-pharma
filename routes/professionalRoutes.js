// backend-pharma/routes/professionalRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Import du contrôleur des professionnels
const professionalController = require('../controllers/professionalController');

// Middleware d'authentification
const auth = require('../middleware/authMiddleware');

// Route: GET /api/professionals/:id
// Description: Récupérer le profil d'un professionnel
router.get('/:id', auth, professionalController.getProfessionalProfile);

// Route: PUT /api/professionals/:id
// Description: Mettre à jour le profil d'un professionnel
router.put('/:id', [
  auth,
  [
    check('email', 'Veuillez inclure un email valide').optional().isEmail(),
    check('password', 'Le mot de passe doit comporter au moins 6 caractères').optional().isLength({ min: 6 }),
    // Ajoutez d'autres validations si nécessaire
  ]
], professionalController.updateProfessionalProfile);

module.exports = router;
