const admin = require("firebase-admin");
const db = admin.firestore();

// Configuracion de end-point para escuchar eventos de la API de Nequi

const escucharEventos = async (req, res) => {
  if (req.body.data.transaction.status === "APPROVED") {
    try {
      const docRef = db.collection("transactions")
          .doc(req.body.data.transaction.reference);
      const documento = await docRef.get();
      await docRef.update({
        statusTransaccion: true,
      });
      // Se alimenta el Array del Sorteo
      const nuevosInscritos = [];
      for (let i = 0; i < documento.data().cantidad; i++) {
        nuevosInscritos.push(`${documento.data().refPago}-${i}`);
      }

      const sortRef = db.collection("sorteos")
          .doc(documento.data().idSorteo);
      await sortRef.update({
        participantes: admin.firestore.FieldValue
            .arrayUnion(...nuevosInscritos),
      });

      res.status(200).send({
        message: "Evento escuchado",
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    res.status(200).send({
      message: "Evento escuchado, transaccion no completada.",
    });
  }
};

// Configuracion de end-point para escuchar eventos de la API de Nequi

const eventosMercadoPago = async (req, res) => {
  console.log(req.body);
  res.status(200).send({
    message: "Evento escuchado",
  });
};

module.exports = {
  escucharEventos,
  eventosMercadoPago,
};
