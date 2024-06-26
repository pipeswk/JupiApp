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
const prospectos = express();

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
prospectos.use(cors(corsOptions));

// Routing

app.use("/api/nequi", require("./routes/nequi.routes.js"));
efectivo.use("/api/mp", require("./routes/efectivo.routes.js"));
eventos.use("/", require("./routes/eventos.routes.js"));
lottos.use("/api/lottos", require("./routes/lottos.routes.js"));
prospectos.use("/", require("./routes/prospectos.routes.js"));

exports.app = functions.https.onRequest(app);
exports.efectivo = functions.https.onRequest(efectivo);
exports.eventos = functions.https.onRequest(eventos);
exports.lottos = functions.https.onRequest(lottos);
exports.prospectos = functions.https.onRequest(prospectos);
exports.liberador = functions
    .runWith({
      timeoutSeconds: 540,
      memory: "1GB",
    })
    .pubsub.schedule("every 15 minutes")
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
              // console.log(lotto.number + " liberado");
            } else {
              console.log("No se ha liberado el lotto" + lotto.number);
            }
          });
          t.update(sorteo.ref, {lottos: newLottos});
          // console.log(newLottos);
        });
      });
    });
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
      for (let i = 0; i < sorteo.capacidad; i++) {
        if (i < 10 && sorteo.capacidad === 100) {
          lottos.push({
            number: "0" + i.toString(),
            avaliable: true,
            checkoutId: "",
            phoneNumber: "",
            fechaReserva: timestamp,
          });
        } else if (i < 10 && sorteo.capacidad === 1000) {
          lottos.push({
            number: "00" + i.toString(),
            avaliable: true,
            checkoutId: "",
            phoneNumber: "",
            fechaReserva: timestamp,
          });
        } else if (i < 100 && sorteo.capacidad === 1000) {
          lottos.push({
            number: "0" + i.toString(),
            avaliable: true,
            checkoutId: "",
            phoneNumber: "",
            fechaReserva: timestamp,
          });
        } else if (i < 10 && sorteo.capacidad === 10000) {
          lottos.push({
            number: "000" + i.toString(),
            avaliable: true,
            checkoutId: "",
            phoneNumber: "",
            fechaReserva: timestamp,
          });
        } else if (i < 100 && sorteo.capacidad === 10000) {
          lottos.push({
            number: "00" + i.toString(),
            avaliable: true,
            checkoutId: "",
            phoneNumber: "",
            fechaReserva: timestamp,
          });
        } else if (i < 1000 && sorteo.capacidad === 10000) {
          lottos.push({
            number: "0" + i.toString(),
            avaliable: true,
            checkoutId: "",
            phoneNumber: "",
            fechaReserva: timestamp,
          });
        } else {
          lottos.push({
            number: i.toString(),
            avaliable: true,
            checkoutId: "",
            phoneNumber: "",
            fechaReserva: timestamp,
          });
        }
      }
      await sortRef.update({
        status: "active",
      });
      // Se crea documento en la colección lottos
      const lottosRef = db.collection("lottos").doc(snap.id);
      await lottosRef.set({
        avaliableNumbers: lottos,
        busyNumbers: [],
      });
    });
