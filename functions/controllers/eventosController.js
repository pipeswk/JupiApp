const admin = require("firebase-admin");
const {FieldPath, FieldValue} =require("firebase-admin/firestore");
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
                    "text": sort.data().nombre,
                  },
                  {
                    "type": "text",
                    "text": documento.data().refPago,
                  },
                  {
                    "type": "text",
                    "text": documento.data().cantidad,
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
        // Condicional para sorteos
        const sortRef = db.collection("sorteos").doc(docs[0].idSorteo);
        const lottosRef = sortRef.collection("lottos"); // Subcolección 'lottos'
        const purchasedNumbers = [];

        const MAX_RETRIES = 5; // Número máximo de reintentos si la transacción falla
        let transactionSuccess = false;
        let attempts = 0;

        // Lista de IDs de documentos ya seleccionados en intentos anteriores
        const excludedDocIds = new Set();

        while (!transactionSuccess && attempts < MAX_RETRIES) {
          attempts++;
          try {
            await db.runTransaction(async (t) => {
              // Consulta aleatoria limitada, excluyendo documentos seleccionados en intentos previos
              const querySnapshot = await t.get(
                lottosRef
                  .where("available", "==", true)
                  .where(FieldPath.documentId(), "not-in", Array.from(excludedDocIds))
                  .limit(cantidadComprada - purchasedNumbers.length),
              );
      
              // Si no hay suficientes números disponibles después de la exclusión, lanzamos un error
              if (querySnapshot.size < (cantidadComprada - purchasedNumbers.length)) {
                throw new Error("No hay suficientes números disponibles para completar la compra.");
              }
      
              // Aleatorizar y seleccionar los documentos
              const numerosDisponibles = querySnapshot.docs.sort(() => 0.5 - Math.random());
      
              // Procesar cada número seleccionado y actualizar detalles en Firestore
              for (const selectedDoc of numerosDisponibles) {
                const lottoRef = lottosRef.doc(selectedDoc.id);
                const lottoData = selectedDoc.data();
      
                // Actualizamos el documento del número seleccionado
                t.update(lottoRef, {
                  available: false,
                  checkoutId: docs[0].checkoutId,
                  phoneNumber: docs[0].telefono,
                  fechaReserva: new Date(),
                  refPago: docs[0].refPago,
                });
      
                // Almacenamos el número comprado y agregamos su ID a la lista de excluidos para el próximo intento
                purchasedNumbers.push(lottoData.number);
                excludedDocIds.add(selectedDoc.id);
              }
      
              console.log("Números comprados:", purchasedNumbers);
            });
      
            transactionSuccess = true; // Marcar éxito en la transacción
          } catch (error) {
            console.log(`Error en el intento ${attempts}:`, error);
            if (attempts === MAX_RETRIES) {
              await db.collection("failedTransactions").add({
                checkout_id: docs[0].checkoutId,
                customer_name: docs[0].nombreCliente,
                customer_phone: docs[0].telefono,
                cantidad_comprada: cantidadComprada,
                cantidad_asignada: purchasedNumbers.length,
                numeros_asignados: purchasedNumbers,
                error_message: error.message || null,
                attempts: attempts,
                timestamp: new Date(),
              });
              
              // Registrar el error en Error Reporting
              console.error("Transacción fallida después de múltiples intentos:", {
                checkout_id: docs[0].checkoutId,
                customer_name: docs[0].nombreCliente,
                customer_phone: docs[0].telefono,
                cantidad_comprada: cantidadComprada,
                cantidad_asignada: purchasedNumbers.length,
                numeros_asignados: purchasedNumbers,
                timestamp: new Date(),
                details: error.message || null,
              });
            }
          }
        }

        // Se corre transacción para decrementar valor disponible en sorteo
        await db.runTransaction(async (t) => {
          // Se actualiza contador "availableNumbers" del documento del sorteo con un increment
          t.update(sortRef, {
            availableNumbers: FieldValue.increment(-purchasedNumbers.length),
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
                      "text": sorteo.data().nombre,
                    },
                    {
                      "type": "text",
                      "text": docs[0].refPago,
                    },
                    {
                      "type": "text",
                      "text": docs[0].cantidad,
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
            business_id: docs[0].influencer_id || null,
            utm_campaign: docs[0].utm_campaign || sorteo.data().id, // Cambiar después por UTM 
            url: docs[0].resolvedUrl || null,
            net_ammount: data.transaction_details.net_received_amount,
            qty: cantidadComprada || docs[0].cantidad,
          });
          console.log("Enviado a XYZ");
          console.log(response);
        } catch (error) {
          // TODO: Manejar reintento
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
