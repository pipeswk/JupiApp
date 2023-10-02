const admin = require("firebase-admin");
const db = admin.firestore();
const mercadopago = require("mercadopago");
mercadopago.configurations.setAccessToken(process.env.ACCESS_TOKEN_MP_2);

const efecty = async (req, res) => {
  console.log(req.body);
  if (req.body.product === "sorteo") {
    const documento = await db.collection("transactions").add({
      uid: req.body.uid,
      nombreCliente: req.body.data.nombre,
      refPago: "",
      method: req.body.data.method,
      tipoCompra: req.body.product,
      idSorteo: req.body.data.idSorteo,
      cantidad: req.body.data.cantidad,
      telefono: req.body.data.telefono,
      email: req.body.data.email,
      checkoutId: req.body.data.checkoutId,
      statusTransaccion: false,
      transaccionCreada: false,
    });
    const clientRef = db.collection("clientes").doc(req.body.uid);
    await clientRef.update({
      nombre: req.body.data.nombre,
      telefono: req.body.data.telefono,
      email: req.body.data.email,
      telNequi: req.body.data.telNequi,
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
        idMercadoPago: data.response.id,
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
        idMercadoPago: data.response.id,
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

const pse = async (req, res) => {
  console.log(req.body);
  if (req.body.product === "sorteo") {
    const documento = await db.collection("transactions").add({
      uid: req.body.uid,
      nombreCliente: req.body.data.nombre,
      refPago: "",
      method: req.body.data.method,
      tipoCompra: req.body.product,
      idSorteo: req.body.data.idSorteo,
      cantidad: req.body.data.cantidad,
      telefono: req.body.data.telefono,
      email: req.body.data.email,
      checkoutId: req.body.data.checkoutId,
      statusTransaccion: false,
      transaccionCreada: false,
    });
    const clientRef = db.collection("clientes").doc(req.body.uid);
    await clientRef.update({
      nombre: req.body.data.nombre,
      telefono: req.body.data.telefono,
      email: req.body.data.email,
      telNequi: req.body.data.telNequi,
    });
    const sortRef = db.collection("sorteos").doc(req.body.data.idSorteo);
    const sort = await sortRef.get();
    const precioFinal = sort.data().valorTicket * req.body.data.cantidad;
    const paymentData = {
      transaction_amount: precioFinal,
      description: `Sorteo ${sort.data().nombre}`,
      payment_method_id: "pse",
      payer: {
        email: req.body.data.email,
        identification: {
          type: req.body.data.tipoDocumento,
          number: toString(req.body.data.noDocumento),
        },
        entity_type: "individual",
      },
      transaction_details: {
        financial_institution: req.body.data.entidad,
      },
      additional_info: {
        ip_address: req.body.ip,
      },
      callback_url: `https://jupi-app-beta.vercel.app/paymentstatus/${documento.id}`,
      notification_url: "https://us-central1-jupi-e46aa.cloudfunctions.net/eventos/mercadopago",
    };
    mercadopago.payment.create(paymentData).then(function(data) {
      console.log(data);
      const docRef = db.collection("transactions").doc(documento.id);
      docRef.update({
        refPago: documento.id,
        valorTransaccion: precioFinal,
        transaccionCreada: true,
        idMercadoPago: data.response.id,
      });
      res.status(200).send(data);
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
      payment_method_id: "pse",
      payer: {
        email: req.body.data.email,
        identification: {
          type: req.body.data.tipoDocumento,
          number: toString(req.body.data.noDocumento),
        },
        entity_type: "individual",
      },
      transaction_details: {
        financial_institution: req.body.data.entidad,
      },
      additional_info: {
        ip_address: req.body.ip,
      },
      callback_url: `https://jupi-app-beta.vercel.app/paymentstatus/${documento.id}`,
    };
    mercadopago.payment.create(paymentData).then(function(data) {
      console.log(data);
      const docRef = db.collection("transactions").doc(documento.id);
      docRef.update({
        refPago: documento.id,
        valorTransaccion: precioFinal,
        transaccionCreada: true,
        idMercadoPago: data.response.id,
      });
      res.status(200).send(data);
    }).catch(function(error) {
      console.log(error);
      res.status(500).send(error);
    });
  }
};

module.exports = {
  efecty,
  pse,
};
