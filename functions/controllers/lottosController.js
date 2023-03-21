const admin = require("firebase-admin");
const db = admin.firestore();

// ENDPOINT: /reservar-lotto

const reservarLotto = async (req, res) => {
  const body = req.body;
  let newLottos = [];
  const lottoRef = db.collection("sorteos").doc(body.id);
  try {
    await db.runTransaction(async (transaction) => {
      const ref = await transaction.get(lottoRef);
      if (!ref.exists) {
        res.status(404).send("Documento no encontrado");
      } else {
        newLottos = ref.data().lottos;
        const lottoI = newLottos.findIndex((lotto) => lotto.number === body.number);
        newLottos[lottoI] = {
          ...newLottos[lottoI],
          checkoutId: body.checkoutId,
        };
        transaction.update(lottoRef, {lottos: newLottos});
        res.status(200).send({
          status: "success",
          message: "Lotto reservado",
          lotto: newLottos[lottoI],
        });
      }
    });
  } catch (error) {
    console.error("Error al reservar lotto: ", error);
  }
};

// ENDPOINT: /liberar-lotto

const liberarLotto = async (req, res) => {
  const body = req.body;
  let newLottos = [];
  const lottoRef = db.collection("sorteos").doc(body.id);
  try {
    await db.runTransaction(async (transaction) => {
      const ref = await transaction.get(lottoRef);
      if (!ref.exists) {
        res.status(404).send("Documento no encontrado");
      } else {
        newLottos = ref.data().lottos;
        const lottoI = newLottos.findIndex((lotto) => lotto.number === body.number);
        newLottos[lottoI] = {
          ...newLottos[lottoI],
          checkoutId: "",
        };
        transaction.update(lottoRef, {lottos: newLottos});
        res.status(200).send({
          status: "success",
          message: "Lotto liberado",
          lotto: newLottos[lottoI],
        });
      }
    });
  } catch (error) {
    console.error("Error al liberar lotto: ", error);
  }
};

module.exports = {
  reservarLotto,
  liberarLotto,
};
