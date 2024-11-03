// authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader ) {
    return res.status(401).json({message: "Acceso denegado. Token no proporcionado."});
  }

  // Extrae el token eliminando "Bearer"
  const token = authHeader.split(" ")[1];

  try {
    // Verifica el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JUPI_BCK_SECRET_KEY);
    req.user = decoded; // Guarda los datos decodificados del token en req.user
    next(); // Continúa con la siguiente función de middleware o la ruta
  } catch (error) {
    return res.status(403).json({message: "Token no válido."});
  }
};

module.exports = authMiddleware;
