const admin = require("firebase-admin");
const axios = require("axios");
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
      const cantidadComprada = documento.data().cantidad;
      if (documento.data().tipoCompra === "sorteo") {
        // Se ejecuta transacción para actualizar documento de sorteo
        const sortRef = db.collection("sorteos")
            .doc(documento.data().idSorteo);
        const lottoRef = db.collection("lottos")
            .doc(documento.data().idSorteo);
        const purchasedNumbers = [];
        await db.runTransaction(async (t) => {
          const lotto = await t.get(lottoRef);
          const numerosDisponibles = lotto.data().avaliableNumbers;
          const numerosOcupados = lotto.data().busyNumbers;
          for (let i = 0; i < cantidadComprada; i++) {
            const numeroAleatorio = Math.floor(Math.random() * numerosDisponibles.length);
            if (numerosDisponibles[numeroAleatorio]) {
              const lotto = numerosDisponibles[numeroAleatorio];
              lotto.avaliable = false;
              lotto.checkoutId = documento.data().checkoutId;
              lotto.phoneNumber = documento.data().telefono;
              lotto.refPago = documento.data().refPago;
              purchasedNumbers.push(lotto.number);
              numerosOcupados.push(lotto);
              numerosDisponibles.splice(numeroAleatorio, 1);
            }
          }
          // Se acutualiza el documento de lottos
          t.update(lottoRef, {
            avaliableNumbers: numerosDisponibles,
            busyNumbers: numerosOcupados,
          });
        });

        // Se envia mensaje de whatsapp
        let buyNumbers = "|";
        purchasedNumbers.forEach((lotto) => {
          buyNumbers += `  ${lotto}  |`;
        });
        const sort = await sortRef.get();
        const whatsappData = JSON.stringify({
          "messaging_product": "whatsapp",
          "to": `57${documento.data().telefono}`,
          "type": "template",
          "template": {
            "name": "sort_with_img_3",
            "language": {
              "code": "es_MX",
            },
            "components": [
              {
                "type": "header",
                "parameters": [
                  {
                    "type": "image",
                    "image": {
                      "link": sort.data().preview_img,
                    },
                  },
                ],
              },
              {
                "type": "body",
                "parameters": [
                  {
                    "type": "text",
                    "text": documento.data().nombreCliente,
                  },
                  {
                    "type": "text",
                    "text": "rifa",
                  },
                  {
                    "type": "text",
                    "text": sort.data().nombre,
                  },
                  {
                    "type": "text",
                    "text": documento.data().cantidad,
                  },
                  {
                    "type": "text",
                    "text": documento.data().refPago,
                  },
                  {
                    "type": "text",
                    "text": buyNumbers,
                  },
                ],
              },
            ],
          },
        });
        const whatsappConfig = {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.ACCESS_TOKEN_WHATSAPP}`,
          },
        };
        const url = "https://graph.facebook.com/v13.0/106635852120380/messages";
        const {data} = await axios.post(url, whatsappData, whatsappConfig);
        console.log(data);
        res.status(200).send({
          message: "Evento escuchado",
        });
      } else {
        console.log("Evento diferente a sorteo escuchado");
        res.status(200).send({
          message: "Evento escuchado",
        });
      }
    } catch (error) {
      console.error(error);
      res.end();
    }
  } else {
    res.status(200).send({
      message: "Evento escuchado, transacción no completada.",
    });
  }
};

// Configuracion de end-point para escuchar eventos de la API de MercadoPago

const eventosMercadoPago = async (req, res) => {
  console.log(req.body);
  if (req.body.action === "payment.updated") {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ACCESS_TOKEN_MP_2}`,
      },
    };
    const url = `https://api.mercadopago.com/v1/payments/${req.body.data.id}`;
    const {data} = await axios.get(url, config);
    if (data.status === "approved") {
      console.log("Transacción aprobada en MP:");
      console.log(data);
      const id = req.body.data.id;
      const ref = db.collection("transactions");
      const snap = await ref.where("idMercadoPago", "==", parseInt(id)).get();
      if (snap.empty) {
        console.log(`No se encontro el id ${req.body.data.id}`);
        res.status(200).send({
          message: "Evento escuchado",
        });
        return;
      }
      const docs = [];
      snap.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        docs.push(doc.data());
      });

      if (docs[0].statusTransaccion === true) {
        res.status(200).send({
          message: "Evento escuchado",
        });
        return;
      }
      const docRef = db.collection("transactions").doc(docs[0].refPago);
      await docRef.update({
        statusTransaccion: true,
        net_received_amount: data.transaction_details.net_received_amount,
      });

      const cantidadComprada = docs[0].cantidad;
      if (docs[0].tipoCompra === "sorteo") {
        const sortRef = db.collection("sorteos")
            .doc(docs[0].idSorteo);
        const lottoRef = db.collection("lottos")
            .doc(docs[0].idSorteo);
        const purchasedNumbers = [];
        await db.runTransaction(async (t) => {
          const lotto = await t.get(lottoRef);
          const numerosDisponibles = lotto.data().avaliableNumbers;
          const numerosOcupados = lotto.data().busyNumbers;
          for (let i = 0; i < cantidadComprada; i++) {
            const numeroAleatorio = Math.floor(Math.random() * numerosDisponibles.length);
            if (numerosDisponibles[numeroAleatorio]) {
              const lotto = numerosDisponibles[numeroAleatorio];
              lotto.avaliable = false;
              lotto.checkoutId = docs[0].checkoutId;
              lotto.phoneNumber = docs[0].telefono;
              lotto.refPago = docs[0].refPago;
              purchasedNumbers.push(lotto.number);
              numerosOcupados.push(lotto);
              numerosDisponibles.splice(numeroAleatorio, 1);
            }
          }
          // Se acutualiza el documento de lottos
          t.update(lottoRef, {
            avaliableNumbers: numerosDisponibles,
            busyNumbers: numerosOcupados,
          });
        });

        const sorteo = await sortRef.get();

        // Se envia mensaje de whatsapp

        try {
          let buyNumbers = "|";
          purchasedNumbers.forEach((lotto) => {
            buyNumbers += `  ${lotto}  |`;
          });
          const whatsappData = JSON.stringify({
            "messaging_product": "whatsapp",
            "to": `57${docs[0].telefono}`,
            "type": "template",
            "template": {
              "name": "sort_with_img_3",
              "language": {
                "code": "es_MX",
              },
              "components": [
                {
                  "type": "header",
                  "parameters": [
                    {
                      "type": "image",
                      "image": {
                        "link": sorteo.data().video_poster,
                      },
                    },
                  ],
                },
                {
                  "type": "body",
                  "parameters": [
                    {
                      "type": "text",
                      "text": docs[0].nombreCliente,
                    },
                    {
                      "type": "text",
                      "text": "rifa",
                    },
                    {
                      "type": "text",
                      "text": sorteo.data().nombre,
                    },
                    {
                      "type": "text",
                      "text": docs[0].cantidad,
                    },
                    {
                      "type": "text",
                      "text": docs[0].refPago,
                    },
                    {
                      "type": "text",
                      "text": buyNumbers,
                    },
                  ],
                },
              ],
            },
          });
          const whatsappConfig = {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.ACCESS_TOKEN_WHATSAPP}`,
            },
          };
          const url = "https://graph.facebook.com/v13.0/106635852120380/messages";
          await axios.post(url, whatsappData, whatsappConfig);
        } catch (error) {
          console.error({
            message: "Error al enviar mensaje de whatsapp",
            error: error,
          });
        }
        
        // Se traquea evento en XYZ
        try {
          const axiosInstance = axios.create({
            headers: {
              "Origin": "https://xyz-inside.web.app",
            },
          });

          const {data: response} = await axiosInstance.post("https://us-central1-influencer-marketing-project.cloudfunctions.net/app/set-conversion", {
            influencer_id: docs[0].influencer_id,
            utm_campaign: sorteo.data().id, // Cambiar después por UTM 
            url: docs[0].resolvedUrl,
            net_ammount: data.transaction_details.net_received_amount,
          });
          console.log("Enviado a XYZ");
          console.log(response);
        } catch (error) {
          console.error({
            message: "Error al enviar a XYZ",
            error: error,
          });
        }

        res.status(200).send({
          message: "Evento escuchado",
        });
      }
    } else {
      res.status(200).send({
        message: "Evento escuchado, transacción no completada.",
      });
    }
  } else {
    res.status(200).send({
      message: "Evento escuchado",
    });
  }
};

module.exports = {
  escucharEventos,
  eventosMercadoPago,
};
