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

      if (documento.data().tipoCompra === "sorteo") {
        const sortRef = db.collection("sorteos")
            .doc(documento.data().idSorteo);
        const sorteo = await sortRef.get();
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
            "name": "sort_with_img",
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
                      "link": sorteo.data().img,
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
                    "text": documento.data().tipoCompra,
                  },
                  {
                    "type": "text",
                    "text": sorteo.data().nombre,
                  },
                  {
                    "type": "text",
                    "text": documento.data().cantidad,
                  },
                  {
                    "type": "text",
                    "text": documento.data().refPago,
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
        const sortRef = db.collection("sorteos")
            .doc(documento.data().idSorteo);
        const sorteo = await sortRef.get();
        await sortRef.update({
          participantes: admin.firestore.FieldValue
              .arrayUnion(...nuevosInscritos),
        });
        const pronRef = db.collection("pronosticos")
            .doc(documento.data().idProductoComprado);
        await pronRef.update({
          compradores: admin.firestore.FieldValue
              .arrayUnion(...nuevosInscritos),
        });
        // Se envia mensaje de whatsapp
        const whatsappData = JSON.stringify({
          "messaging_product": "whatsapp",
          "to": `57${documento.data().telefono}`,
          "type": "template",
          "template": {
            "name": "pron_with_img",
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
                      "link": "https://firebasestorage.googleapis.com/v0/b/jupi-e46aa.appspot.com/o/pronosticos%2FNHL.jpg?alt=media&token=276807f0-b780-460c-80a2-94f526300e17",
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
                    "text": documento.data().tipoCompra,
                  },
                  {
                    "type": "text",
                    "text": "sorteo",
                  },
                  {
                    "type": "text",
                    "text": sorteo.data().nombre,
                  },
                  {
                    "type": "text",
                    "text": documento.data().refPago,
                  },
                  {
                    "type": "text",
                    "text": "ganar",
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
      }
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
