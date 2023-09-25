const axios = require("axios");
const admin = require("firebase-admin");
// import axios from "axios";

admin.initializeApp({
  credential: admin.credential.cert(require("../credentials.json")),
  databaseURL: process.env.DATABASE_URL,
});

const db = admin.firestore();

const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

// ENDPOINT para procesar pagos via nequi PARA LOS SORTEOS
const ejecutarPagoSorteo = async (req, res) => {
  console.log(req.body);
  const documento = await db.collection("transactions").add({
    nombreCliente: req.body.data.nombre,
    refPago: "",
    method: req.body.data.method,
    tipoCompra: req.body.product,
    idSorteo: req.body.data.idSorteo,
    cantidad: req.body.data.cantidad,
    telefono: req.body.data.telefono,
    telNequi: req.body.data.telNequi,
    email: req.body.data.email,
    checkoutId: req.body.data.checkoutId,
    tokenAceptacion: "",
    statusTransaccion: false,
    transaccionCreada: false,
  });
  const docId = documento.id;
  const docRef = db.collection("transactions").doc(docId);
  await docRef.update({
    refPago: docId,
  });
  try {
    const tokenAceptacion = await obtenerTokenAceptacion();
    await crearTransaccion(req.body, tokenAceptacion, docId);
    res.status(200).send({
      message: "Transaccion ejecutada con exito",
      refPago: docId,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error al ejecutar pago",
    });
  }
};

// Obtiene el token de aceptación de la API de Nequi
const obtenerTokenAceptacion = async () => {
  const {data} = await axios.get(`https://production.wompi.co/v1/merchants/${publicKey}`);
  const token = data.data.presigned_acceptance.acceptance_token;
  return token;
};

//  Crear transaccion Nequi

const crearTransaccion = async (datos, token, reference) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${privateKey}`,
    },
  };
  let precio;
  let precioNequi;
  const sorteoRef = db.collection("sorteos").doc(datos.data.idSorteo);
  const sorteo = await sorteoRef.get();
  if (!sorteo.exists) {
    console.log("No existe el sorteo");
  } else {
    precio = (sorteo.data().valorTicket) * datos.data.cantidad;
    precioNequi = parseInt(`${precio}00`);
  }
  try {
    const docRef = db.collection("transactions")
        .doc(reference);
    await docRef.update({
      tokenAceptacion: token,
      valorTransaccion: precio,
      transaccionCreada: true,
    });

    const {data} = await axios.post("https://production.wompi.co/v1/transactions", {
      "acceptance_token": token,
      "amount_in_cents": precioNequi,
      "currency": "COP",
      "customer_email": datos.data.email,
      "payment_method": {
        "type": "NEQUI",
        "phone_number": datos.data.telNequi,
      },
      "reference": reference,
      "customer_data": {
        "phone_number": `57${datos.data.telefono}`,
        "full_name": datos.data.nombre,
      },
    }, config);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

// ENDPOINT para procesar pagos via nequi PARA LOS PRONOSTIOS
const ejecutarPagoPronostico = async (req, res) => {
  console.log(req.body);
  const documento = await db.collection("transactions").add({
    nombreCliente: req.body.data.nombre,
    refPago: "",
    method: req.body.data.method,
    tipoCompra: req.body.product,
    cantidad: 1,
    idProductoComprado: req.body.data.idProdComprado,
    telefono: req.body.data.telefono,
    telNequi: req.body.data.telNequi,
    email: req.body.data.email,
    idSorteo: req.body.data.sorteo,
    tokenAceptacion: "",
    statusTransaccion: false,
    transaccionCreada: false,
  });
  const docId = documento.id;
  const docRef = db.collection("transactions").doc(docId);
  await docRef.update({
    refPago: docId,
  });
  try {
    const tokenAceptacion = await obtenerTokenAceptacion();
    await crearTransaccionPronosticos(req.body, tokenAceptacion, docId);
    res.status(200).send({
      message: "Transaccion ejecutada con exito",
      refPago: docId,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error al ejecutar pago",
    });
  }
};

//  Crear transaccion Nequi para pronosticos

const crearTransaccionPronosticos = async (datos, token, reference) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${privateKey}`,
    },
  };
  let precio;
  let precioNequi;
  const pronRef = db.collection("pronosticos").doc(datos.data.idProdComprado);
  const pronostico = await pronRef.get();
  if (!pronostico.exists) {
    console.log("No existe el pronostico");
  } else {
    precio = (pronostico.data().valorTicket) * 1;
    precioNequi = parseInt(`${precio}00`);
  }
  try {
    const docRef = db.collection("transactions")
        .doc(reference);
    await docRef.update({
      tokenAceptacion: token,
      valorTransaccion: precio,
      transaccionCreada: true,
    });

    const {data} = await axios.post("https://production.wompi.co/v1/transactions", {
      "acceptance_token": token,
      "amount_in_cents": precioNequi,
      "currency": "COP",
      "customer_email": datos.data.email,
      "payment_method": {
        "type": "NEQUI",
        "phone_number": datos.data.telNequi,
      },
      "reference": reference,
      "customer_data": {
        "phone_number": `57${datos.data.telefono}`,
        "full_name": datos.data.nombre,
      },
    }, config);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  ejecutarPagoSorteo,
  ejecutarPagoPronostico,
  db,
};
