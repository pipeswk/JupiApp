const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const moment = require("moment-timezone");
const {db} = require("./controllers/nequiController.js");
const authMiddleware = require("./middleware/authMiddleware.js");

const app = express();
const efectivo = express();
const eventos = express();
const lottos = express();
const utils = express();

dotenv.config();

// cors

const whitelist = [
  process.env.FRONTEND1,
  process.env.FRONTEND2,
  process.env.FRONTEND3,
  process.env.FRONTEND4,
  process.env.FRONTEND5,
];

const corsOptions = {
  origin: function(origin, callback) {
    console.log(`Origen del request: ${origin}`);
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
efectivo.use(cors(corsOptions));
lottos.use(cors(corsOptions));
utils.use(cors({origin: true}));

// Routing

app.use("/api/nequi", require("./routes/nequi.routes.js"));
efectivo.use("/api/mp", require("./routes/efectivo.routes.js"));
eventos.use("/", require("./routes/eventos.routes.js"));
lottos.use("/api/lottos", require("./routes/lottos.routes.js"));
utils.use("/", authMiddleware, require("./routes/utils.routes.js"));

exports.app = functions.https.onRequest(app);
exports.efectivo = functions.https.onRequest(efectivo);
exports.eventos = functions.https.onRequest(eventos);
exports.lottos = functions.https.onRequest(lottos);
exports.utils = functions.https.onRequest(utils);
exports.createSorteo = functions.firestore
    .document("sorteos/{sorteoId}")
    .onCreate(async (snap, context) => {
      const timestamp = moment().tz("America/Bogota");
      timestamp.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      });
      const sortRef = db.collection("sorteos").doc(snap.id);
      const sorteo = snap.data();
      const lottos = [];

      // Función para generar números con ceros iniciales según la capacidad
      const formatNumber = (num, capacidad) => {
        const numDigits = capacidad.toString().length - 1;
        return num.toString().padStart(numDigits, "0");
      };

      for (let i = 0; i < sorteo.capacidad; i++) {
        lottos.push({
          number: formatNumber(i, sorteo.capacidad),
          available: true,
          checkoutId: "",
          phoneNumber: "",
          fechaReserva: timestamp,
          buyerName: "",
          numberBlocked: false,
        });
      }

      await sortRef.update({
        status: "active",
        availableNumbers: sorteo.capacidad,
      });
      // Se crean documentos de cada lotto en la subcoleccion lottos
      const lottosRef = sortRef.collection("lottos");

      // Se inicializa batch para escritura en lote
      const batchSize = 500;
      for (let i = 0; i < lottos.length; i += batchSize) {
        const batch = db.batch();
        lottos.slice(i, i + batchSize).forEach((lotto) => {
          const lottoRef = lottosRef.doc();
          batch.set(lottoRef, lotto);
        });
        await batch.commit();
      }
    });

// exports.generateJwt = functions.https.onRequest(async (req, res) => {
//     const secretPass = req.body.secretPass;
//     const name = req.body.name;

//     if (!secretPass || secretPass !== process.env.SECRET_PASS) {
//         res.status(401).send({
//             status: "error",
//             message: "No autorizado",
//         });
//         return;
//     }

//     const token = jwt.sign({ name: name }, process.env.JUPI_BCK_SECRET_KEY, {
//         expiresIn: "1h",
//     });
//     res.status(200).send({
//         status: "success",
//         message: "Token generado",
//         token: token,
//     });
// });
