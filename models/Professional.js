// backend-pharma/models/Professional.js
const mongoose = require('mongoose');

const ProfessionalSchema = new mongoose.Schema({
  nomEtablissement: {
    type: String,
    required: true,
  },
  adresse: {
    type: String,
    required: true,
  },
  specialties: {
    type: [String],
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'professional'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Professional', ProfessionalSchema);
