const admin = require("firebase-admin");
const db = admin.firestore();
const mercadopago = require("mercadopago");
mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN_MP_2);

const efecty = async (req, res) => {
  console.log(req.body);
  if (req.body.product === "sorteo") {
    const documento = await db.collection("transactions").add({
      nombreCliente: req.body.data.nombre,
      refPago: "",
      method: req.body.data.method,
      tipoCompra: req.body.product,
      idSorteo: req.body.data.idSorteo,
      cantidad: req.body.data.cantidad,
      telefono: req.body.data.telefono,
      email: req.body.data.email,
      statusTransaccion: false,
      transaccionCreada: false,
    });
    const sortRef = db.collection("sorteos").doc(req.body.data.idSorteo);
    const sort = await sortRef.get();
    const precioFinal = sort.data().valorTicket * req.body.data.cantidad;
    const paymentData = {
      transaction_amount: precioFinal,
      description: `Sorteo ${sort.data().nombre}`,
      payment_method_id: "efecty",
      payer: {
        email: req.body.data.email,
      },
    };
    mercadopago.payment.create(paymentData).then(function(data) {
      console.log(data);
      const docRef = db.collection("transactions").doc(documento.id);
      docRef.update({
        refPago: documento.id,
        valorTransaccion: precioFinal,
        transaccionCreada: true,
      });
      res.status(200).send({
        noConvenio: 110757,
        noPago: data.response.id,
        message: documento.id,
        linkExterno: data.response.transaction_details.external_resource_url,
      });
    }).catch(function(error) {
      console.log(error);
      res.status(500).send(error);
    });
  } else {
    const documento = await db.collection("transactions").add({
      nombreCliente: req.body.data.nombre,
      refPago: "",
      method: req.body.data.method,
      tipoCompra: req.body.product,
      idProductoComprado: req.body.data.idProdComprado,
      cantidad: 1,
      telefono: req.body.data.telefono,
      email: req.body.data.email,
      idSorteo: req.body.data.sorteo,
      statusTransaccion: false,
      transaccionCreada: false,
    });
    const proRef = db.collection("pronosticos")
        .doc(req.body.data.idProdComprado);
    const pron = await proRef.get();
    const precioFinal = pron.data().valorTicket * 1;
    const paymentData = {
      transaction_amount: precioFinal,
      description: `Pronostico ${pron.data().nombre}`,
      payment_method_id: "efecty",
      payer: {
        email: req.body.data.email,
      },
    };
    mercadopago.payment.create(paymentData).then(function(data) {
      console.log(data);
      const docRef = db.collection("transactions").doc(documento.id);
      docRef.update({
        refPago: documento.id,
        valorTransaccion: precioFinal,
        transaccionCreada: true,
      });
      res.status(200).send({
        noConvenio: 110757,
        noPago: data.response.id,
        message: documento.id,
        linkExterno: data.response.transaction_details.external_resource_url,
      });
    }).catch(function(error) {
      console.log(error);
      res.status(500).send(error);
    });
  }
};

module.exports = {
  efecty,
};