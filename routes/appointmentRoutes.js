// backend-pharma/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// Import du contrôleur des rendez-vous
const appointmentController = require('../controllers/appointmentController');

// Middleware d'authentification
const auth = require('../middleware/authMiddleware');

// Route: GET /api/appointments/professional
// Description: Récupérer les rendez-vous pour un professionnel
router.get('/professional', auth, appointmentController.getAppointmentsForProfessional);

// Route: GET /api/appointments/patient
// Description: Récupérer les rendez-vous pour un patient
router.get('/patient', auth, appointmentController.getAppointmentsForPatient);

// Route: POST /api/appointments
// Description: Créer un nouveau rendez-vous
router.post('/', [
  auth,
  [
    check('dateHeure', 'La date et l\'heure sont requises').isISO8601(),
    check('typeService', 'Le type de service est requis').not().isEmpty(),
    check('professionalId', 'L\'ID du professionnel est requis').isMongoId(),
    // Ajoutez d'autres validations si nécessaire
  ]
], appointmentController.createAppointment);

// Ajoutez d'autres routes pour la gestion des rendez-vous ici

module.exports = router;
