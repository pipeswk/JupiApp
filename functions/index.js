const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const moment = require("moment-timezone");
const {db} = require("./controllers/nequiController.js");

const app = express();
const efectivo = express();
const eventos = express();
const lottos = express();
const invernadero = express();

dotenv.config();

// cors

const whitelist = [
  process.env.FRONTEND1,
  process.env.FRONTEND2,
  process.env.FRONTEND3,
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
efectivo.use(cors(corsOptions));
lottos.use(cors(corsOptions));

// Routing

app.use("/api/nequi", require("./routes/nequi.routes.js"));
efectivo.use("/api/mp", require("./routes/efectivo.routes.js"));
eventos.use("/", require("./routes/eventos.routes.js"));
lottos.use("/api/lottos", require("./routes/lottos.routes.js"));
invernadero.use("/api/invernadero", require("./routes/invernadero.routes.js"));

exports.app = functions.https.onRequest(app);
exports.efectivo = functions.https.onRequest(efectivo);
exports.eventos = functions.https.onRequest(eventos);
exports.lottos = functions.https.onRequest(lottos);
exports.invernadero = functions.https.onRequest(invernadero);
exports.liberador = functions.pubsub.schedule("every 15 minutes")
    .onRun(async (context) => {
      await db.runTransaction(async (t) => {
        const sorteosDisponibles = await t.get(db.collection("sorteos").where("status", "==", "active"));
        sorteosDisponibles.forEach(async (sorteo) => {
          console.log(sorteo.data().nombre);
          let newLottos = [];
          newLottos = sorteo.data().lottos;
          newLottos.map((lotto, i) => {
            const now = moment().tz("America/Bogota");
            const fechaReserva = moment(lotto.fechaReserva._seconds * 1000).tz("America/Bogota");
            const diff = now.diff(fechaReserva, "minutes");
            if (diff > 15 && lotto.avaliable === true) {
              newLottos[i] = {
                ...newLottos[i],
                checkoutId: "",
              };
              t.update(sorteo.ref, {lottos: newLottos});
              console.log(lotto.number + " liberado");
            } else {
              console.log("No se ha liberado el lotto" + lotto.number);
            }
          });
        });
      });
    });
