// backend-pharma/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Récupérer le token depuis l'en-tête Authorization
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({ message: 'Aucun token, autorisation refusée' });
  }

  try {
    // Vérifier la validité du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Ajouter les informations de l'utilisateur à la requête
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
