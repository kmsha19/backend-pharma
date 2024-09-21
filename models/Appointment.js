// backend-pharma/models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  dateHeure: {
    type: Date,
    required: true,
  },
  typeService: {
    type: String,
    required: true,
  },
  commentaire: {
    type: String,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
