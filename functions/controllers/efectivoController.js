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
      checkoutId: req.body.data.checkoutId,
      statusTransaccion: false,
      transaccionCreada: false,
      influencer_id: req.body.data.influencer_id,
      utm_campaign: req.body.data.utm_campaign,
      resolvedUrl: req.body.data.resolvedUrl,
      createdDate: admin.firestore.FieldValue.serverTimestamp(),
    });
    const user = await validarUsuario({
      telefono: req.body.data.telefono,
      email: req.body.data.email,
      refPago: documento.id,
      nombre: req.body.data.nombre,
      telNequi: null,
      noDocumento: req.body.data.noDocumento || null,
    });
    const sortRef = db.collection("sorteos").doc(req.body.data.idSorteo);
    const sort = await sortRef.get();
    const precioFinal = sort.data().valorTicket * req.body.data.cantidad;
    const paymentData = {
      transaction_amount: precioFinal,
      description: `SP ${sort.data().nombre}`,
      payment_method_id: "efecty",
      payer: {
        email: req.body.data.email,
      },
    };
    mercadopago.payment.create(paymentData).then(function(data) {
      console.log(data);
      const docRef = db.collection("transactions").doc(documento.id);
      docRef.update({
        uid: user.uid,
        refPago: documento.id,
        valorTransaccion: precioFinal,
        transaccionCreada: true,
        idMercadoPago: data.response.id,
      });
      return res.status(200).send({
        uid: user.uid,
        noConvenio: 110757,
        noPago: data.response.id,
        internalTransactionId: documento.id,
        valorTransaccion: precioFinal,
        linkExterno: data.response.transaction_details.external_resource_url,
      });
    }).catch(function(error) {
      console.log(error);
      return res.status(500).send(error);
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

// Se valida si el usuario existe en la base de datos

const validarUsuario = async (data) => {
  const {telefono, email, refPago, nombre, telNequi, noDocumento} = data;
  // Se valida existentes de cliente
  let userDoc;
  const clienteRef = db.collection("clientes");
  const phoneQuery = await clienteRef.where("telefono", "array-contains", telefono).get();
  if (!phoneQuery.empty) {
    userDoc = phoneQuery.docs[0];
  } else {
    // Buscar por email
    const emailQuery = await clienteRef.where("email", "array-contains", email).get();
    if (!emailQuery.empty) {
      userDoc = emailQuery.docs[0];
    }
  }

  if (userDoc) {
    // Se actualiza el documento existente
    await userDoc.ref.update({
      relatedOrders: admin.firestore.FieldValue.arrayUnion(refPago),
      telefono: admin.firestore.FieldValue.arrayUnion(telefono),
      email: admin.firestore.FieldValue.arrayUnion(email),
    });
    return {
      newUser: false,
      uid: userDoc.id,
    };
  } else {
    // Se crea nuevo documento
    const newUserDoc = await clienteRef.add({
      nombreCliente: nombre,
      cedula: noDocumento || null,
      telefono: [telefono],
      email: [email],
      relatedOrders: [refPago],
      telNequi: telNequi,
      createdDate: admin.firestore.FieldValue.serverTimestamp(),
    });
    return {
      newUser: true,
      uid: newUserDoc.id,
    };
  }
};

const pse = async (req, res) => {
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
      checkoutId: req.body.data.checkoutId,
      statusTransaccion: false,
      transaccionCreada: false,
      influencer_id: req.body.data.influencer_id,
      utm_campaign: req.body.data.utm_campaign,
      resolvedUrl: req.body.data.resolvedUrl,
      createdDate: admin.firestore.FieldValue.serverTimestamp(),
    });
    const user = await validarUsuario({
      telefono: req.body.data.telefono,
      email: req.body.data.email,
      refPago: documento.id,
      nombre: req.body.data.nombre,
      telNequi: null,
      noDocumento: req.body.data.noDocumento || null,
    });
    const sortRef = db.collection("sorteos").doc(req.body.data.idSorteo);
    const sort = await sortRef.get();
    const precioFinal = sort.data().valorTicket * req.body.data.cantidad;
    const paymentData = {
      transaction_amount: precioFinal,
      description: `SP - ${sort.data().nombre}`,
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
      callback_url: `https://tusrecordatorios.vercel.app/paymentstatus/${documento.id}`,
      notification_url: "https://us-central1-jupi-e46aa.cloudfunctions.net/eventos/mercadopago",
    };
    mercadopago.payment.create(paymentData).then(function(data) {
      console.log(data);
      const docRef = db.collection("transactions").doc(documento.id);
      docRef.update({
        uid: user.uid,
        refPago: documento.id,
        valorTransaccion: precioFinal,
        transaccionCreada: true,
        idMercadoPago: data.response.id,
      });
      return res.status(200).send({
        ...data,
        internalTransactionId: documento.id,
        valorTransaccion: precioFinal,
        uid: user.uid,
      });
    }).catch(function(error) {
      console.log(error);
      return res.status(500).send(error);
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
      return res.status(200).send(data);
    }).catch(function(error) {
      console.log(error);
      return res.status(500).send(error);
    });
  }
};

module.exports = {
  efecty,
  pse,
};
