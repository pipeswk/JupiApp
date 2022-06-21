const admin = require("firebase-admin");
const db = admin.firestore();

// Configuracion de end-point para escuchar eventos de la API de Nequi

const escucharEventos = async (req, res) => {
  res.status(200).send({
    message: "Evento escuchado",
  });
  if (req.body.data.transaction.status === "APPROVED") {
    try {
      const docRef = db.collection("transactions")
          .doc(req.body.data.transaction.reference);
      await docRef.update({
        statusTransaccion: true,
      });
    } catch (error) {
      console.error(error);
    }
    return;
  }
};


module.exports = {
  escucharEventos,
};
