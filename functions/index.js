const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
const eventos = express();

dotenv.config();

// cors

const whitelist = [
  process.env.FRONTEND1,
  process.env.FRONTEND2,
];

const corsOptions = {
  origin: function(origin, callback) {
    console.log(origin);
    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      // No esta permitido el request desde ese origen
      callback(new Error("Error de Cors"));
    }
  },
};

app.use(cors(corsOptions));

// Routing

app.use("/api/nequi", require("./routes/nequi.routes.js"));
eventos.use("/", require("./routes/eventos.routes.js"));

exports.app = functions.https.onRequest(app);
exports.eventos = functions.https.onRequest(eventos);
