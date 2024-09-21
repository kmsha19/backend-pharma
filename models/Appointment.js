// backend-pharma/models/Appointment.js
const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professional",
      required: true,
    },
    dateHeure: {
      type: Date,
      required: true,
    },
    typeService: {
      type: String,
      required: true,
    },
    statut: {
      type: String,
      enum: ["confirme", "annule", "en_attente"],
      default: "en_attente",
    },
    commentaire: {
      type: String,
    },
    dateCreation: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
