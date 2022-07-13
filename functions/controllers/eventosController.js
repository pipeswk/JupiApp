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

      // Se envia mensaje de whatsapp

      const whatsappData = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": `57${documento.data().telefono}`,
        "type": "template",
        "template": {
          "name": "sort_normal",
          "language": {
            "code": "es",
          },
          "components": [
            {
              "type": "header",
              "parameters": [
                {
                  "type": "image",
                  "image": {
                    "link": "https://firebasestorage.googleapis.com/v0/b/jupi-e46aa.appspot.com/o/Sorteos%2FKTM-DUKE.jpg?alt=media&token=b646a623-5928-465b-a111-79b53a8ebdcc",
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
                  "text": "sorteo",
                },
                {
                  "type": "text",
                  "text": "KTM - DUKE 390",
                },
                {
                  "type": "text",
                  "text": documento.data().cantidad,
                },
                {
                  "type": "text",
                  "text": "HbjhbHJBhjb-0",
                },
                {
                  "type": "text",
                  "text": "HbjhbHJBhjb-1",
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
      const url = "https://graph.facebook.com/v13.0/110412985060402/messages";
      const {data} = await axios.post(url, whatsappData, whatsappConfig);
      console.log(data);
      res.status(200).send({
        message: "Evento escuchado",
      });
    } catch (error) {
      console.error(error);
      res.end();
    }
  } else {
    res.status(200).send({
      message: "Evento escuchado, transaccion no completada.",
    });
  }
};

// Configuracion de end-point para escuchar eventos de la API de MercadoPago

const eventosMercadoPago = async (req, res) => {
  console.log(req.body);
  if (req.body.action === "payment.updated") {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.ACCESS_TOKEN_MP}`,
        },
      };
      const url = `https://api.mercadopago.com/v1/payments/${req.body.data.id}`;
      const {data} = await axios.get(url, config);
      if (data.status === "approved") {
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
        const docRef = db.collection("transactions").doc(docs[0].refPago);
        await docRef.update({
          statusTransaccion: true,
        });
        // Se alimenta el Array del Sorteo
        const nuevosInscritos = [];
        for (let i = 0; i < docs[0].cantidad; i++) {
          nuevosInscritos.push(`${docs[0].refPago}-${i}`);
        }

        const sortRef = db.collection("sorteos")
            .doc(docs[0].idSorteo);
        await sortRef.update({
          participantes: admin.firestore.FieldValue
              .arrayUnion(...nuevosInscritos),
        });
        res.status(200).send({
          message: "Evento escuchado",
        });
      } else {
        res.status(200).send({
          message: "Evento escuchado, transacción no completada.",
        });
      }
    } catch (error) {
      console.log(error);
      res.end();
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
