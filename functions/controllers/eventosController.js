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
        const pronImgRef = db.collection("imgpronosticos");
        const pronImg = await pronImgRef
            .where("idPron", "==", documento.data().idProductoComprado).get();
        if (pronImg.empty) {
          console.log("Documento no encontrado");
          return;
        }
        const imagen = [];
        pronImg.forEach((doc) => {
          imagen.push(doc.data().img_src);
        });
        // Se envia mensaje de whatsapp
        const whatsappData = JSON.stringify({
          "messaging_product": "whatsapp",
          "to": `57${documento.data().telefono}`,
          "type": "template",
          "template": {
            "name": "pronos_normal_img_and_url",
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
                      "link": imagen[0],
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
                    "text": "sorteo",
                  },
                  {
                    "type": "text",
                    "text": documento.data().refPago,
                  },
                  {
                    "type": "text",
                    "text": "ganar",
                  },
                  {
                    "type": "text",
                    "text": "sorteo",
                  },
                ],
              },
              {
                "type": "button",
                "sub_type": "url",
                "index": 0,
                "parameters": [
                  {
                    "type": "text",
                    "text": sorteo.id,
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
        const resWa = await axios.post(url, whatsappData, whatsappConfig);
        console.log(resWa.data);
        if (resWa.status === 200) {
          res.status(200).send({
            message: "Evento escuchado",
          });
        } else {
          // Se envia SMS de respaldo
          const smsData = JSON.stringify({
            "messages": [
              {
                "destinations": [
                  {
                    "to": `57${documento.data().telefono}`,
                  },
                ],
                "from": "InfoSMS",
                "text": `Hola ${documento.data().nombreCliente}, mira tu pronostico en https://jupi.com.co/pronostico/${documento.id}`,
              },
            ],
          });
          const smsConfig = {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `App ${process.env.ACCESS_TOKEN_INFOBIP}`,
            },
          };
          const urlSms = "https://pwvx5l.api.infobip.com/sms/2/text/advanced";
          const {data: ressms} = await axios.post(urlSms, smsData, smsConfig);
          console.log(ressms);
          res.status(200).send({
            message: "Evento escuchado",
          });
        }
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
          "Authorization": `Bearer ${process.env.ACCESS_TOKEN_MP_2}`,
        },
      };
      const url = `https://api.mercadopago.com/v1/payments/${req.body.data.id}`;
      const {data} = await axios.get(url, config);
      if (data.status === "approved") {
        console.log("El resultado en MP es", data);
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

        if (docs[0].tipoCompra === "sorteo") {
          const sortRef = db.collection("sorteos")
              .doc(docs[0].idSorteo);
          const sorteo = await sortRef.get();
          await sortRef.update({
            participantes: admin.firestore.FieldValue
                .arrayUnion(...nuevosInscritos),
          });
          // Se envia mensaje de whatsapp
          const whatsappData = JSON.stringify({
            "messaging_product": "whatsapp",
            "to": `57${docs[0].telefono}`,
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
                      "text": docs[0].nombreCliente,
                    },
                    {
                      "type": "text",
                      "text": docs[0].tipoCompra,
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
          const {data: r} = await axios.post(url, whatsappData, whatsappConfig);
          console.log(r);
          res.status(200).send({
            message: "Evento escuchado",
          });
        } else {
          const sortRef = db.collection("sorteos")
              .doc(docs[0].idSorteo);
          const sorteo = await sortRef.get();
          await sortRef.update({
            participantes: admin.firestore.FieldValue
                .arrayUnion(...nuevosInscritos),
          });
          const pronRef = db.collection("pronosticos")
              .doc(docs[0].idProductoComprado);
          await pronRef.update({
            compradores: admin.firestore.FieldValue
                .arrayUnion(...nuevosInscritos),
          });
          const pronImgRef = db.collection("imgpronosticos");
          const pronImg = await pronImgRef
              .where("idPron", "==", docs[0].idProductoComprado).get();
          if (pronImg.empty) {
            console.log("Documento no encontrado");
            return;
          }
          const imagen = [];
          pronImg.forEach((doc) => {
            imagen.push(doc.data().img_src);
          });
          // Se envia mensaje de whatsapp
          const whatsappData = JSON.stringify({
            "messaging_product": "whatsapp",
            "to": `57${docs[0].telefono}`,
            "type": "template",
            "template": {
              "name": "pronos_normal_img_and_url",
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
                        "link": imagen[0],
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
                      "text": docs[0].tipoCompra,
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
                      "text": "sorteo",
                    },
                    {
                      "type": "text",
                      "text": docs[0].refPago,
                    },
                    {
                      "type": "text",
                      "text": "ganar",
                    },
                    {
                      "type": "text",
                      "text": "sorteo",
                    },
                  ],
                },
                {
                  "type": "button",
                  "sub_type": "url",
                  "index": 0,
                  "parameters": [
                    {
                      "type": "text",
                      "text": sorteo.id,
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
          const resWa = await axios.post(url, whatsappData, whatsappConfig);
          console.log(resWa.data);
          if (resWa.status === 200) {
            res.status(200).send({
              message: "Evento escuchado",
            });
          } else {
            // Se envia SMS de respaldo
            const smsData = JSON.stringify({
              "messages": [
                {
                  "destinations": [
                    {
                      "to": `57${docs[0].telefono}`,
                    },
                  ],
                  "from": "InfoSMS",
                  "text": `Hola ${docs[0].nombreCliente}, mira tu pronostico en https://jupi.com.co/pronostico/${docs[0].refPago}`,
                },
              ],
            });
            const smsConfig = {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `App ${process.env.ACCESS_TOKEN_INFOBIP}`,
              },
            };
            const urlSms = "https://pwvx5l.api.infobip.com/sms/2/text/advanced";
            const {data: ressms} = await axios.post(urlSms, smsData, smsConfig);
            console.log(ressms);
            res.status(200).send({
              message: "Evento escuchado",
            });
          }
        }
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
