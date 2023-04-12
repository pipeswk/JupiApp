const admin = require("firebase-admin");
const db = admin.firestore();
const moment = require("moment-timezone");

// ENDPOINT: /reservar-lotto

const reservarLotto = async (req, res) => {
  const body = req.body;
  let newLottos = [];
  const lottoRef = db.collection("sorteos").doc(body.id);
  const fechaR = moment().tz("America/Bogota");
  console.log("fechaR: ", fechaR);
  try {
    const ref = await lottoRef.get();
    if (!ref.exists) {
      res.status(404).send("Documento no encontrado");
    } else {
      newLottos = ref.data().lottos;
      const lottoI = newLottos.findIndex((lotto) => lotto.number === body.number);
      newLottos[lottoI] = {
        ...newLottos[lottoI],
        checkoutId: body.checkoutId,
        fechaReserva: fechaR,
      };
      await lottoRef.update({lottos: newLottos});
      res.status(200).send({
        status: "success",
        message: "Lotto reservado",
        lotto: newLottos[lottoI],
      });
    }
  } catch (error) {
    console.error("Error al reservar lotto: ", error);
    res.status(500).send({
      status: "error",
      message: "Error al reservar lotto",
    });
  }
};

// ENDPOINT: /liberar-lotto

const liberarLotto = async (req, res) => {
  const body = req.body;
  let newLottos = [];
  const lottoRef = db.collection("sorteos").doc(body.id);
  try {
    const ref = await lottoRef.get();
    if (!ref.exists) {
      res.status(404).send("Documento no encontrado");
    } else {
      newLottos = ref.data().lottos;
      const lottoI = newLottos.findIndex((lotto) => lotto.number === body.number);
      newLottos[lottoI] = {
        ...newLottos[lottoI],
        checkoutId: "",
      };
      await lottoRef.update({lottos: newLottos});
      res.status(200).send({
        status: "success",
        message: "Lotto liberado",
        lotto: newLottos[lottoI],
      });
    }
  } catch (error) {
    console.error("Error al liberar lotto: ", error);
    res.status(500).send({
      status: "error",
      message: "Error al liberar lotto",
    });
  }
};

module.exports = {
  reservarLotto,
  liberarLotto,
};
