// backend-pharma/controllers/appointmentController.js
const { validationResult } = require('express-validator');

// Import des modèles
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Professional = require('../models/Professional');

/**
 * @desc    Récupérer les rendez-vous pour un professionnel
 * @route   GET /api/appointments/professional
 * @access  Privé (professionnel)
 */
exports.getAppointmentsForProfessional = async (req, res) => {
  try {
    // Vérifier le rôle de l'utilisateur
    if (req.user.role !== 'professional') {
      return res.status(403).json({ message: 'Accès interdit' });
    }

    // Récupérer les rendez-vous du professionnel
    const appointments = await Appointment.find({ professional: req.user.id })
      .populate('patient', 'name email')
      .populate('professional', 'nomEtablissement adresse');

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

/**
 * @desc    Créer un nouveau rendez-vous
 * @route   POST /api/appointments
 * @access  Privé (patient)
 */
exports.createAppointment = async (req, res) => {
  // Validation des entrées
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ erreurs: errors.array() });
  }

  const { professionalId, dateHeure, typeService, commentaire } = req.body;

  try {
    // Vérifier que le professionnel existe
    const professional = await Professional.findById(professionalId);
    if (!professional) {
      return res.status(404).json({ message: 'Professionnel non trouvé' });
    }

    // Créer une nouvelle instance de Rendez-vous
    const appointment = new Appointment({
      dateHeure,
      typeService,
      commentaire,
      patient: req.user.id,
      professional: professionalId,
    });

    // Sauvegarder le rendez-vous
    await appointment.save();

    // Retourner le rendez-vous créé
    res.status(201).json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};
