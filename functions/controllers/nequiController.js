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
  try {
    const tokenAceptacion = await obtenerTokenAceptacion();
    await crearTransaccion(req.body, tokenAceptacion);
    res.status(200).send({
      message: "Transaccion ejecutada con exito",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error al ejecutar pago",
    });
  }
};

// Obtiene el token de aceptación de la API de Nequi
const obtenerTokenAceptacion = async () => {
  const {data} = await axios.get(`https://sandbox.wompi.co/v1/merchants/${publicKey}`);
  const token = data.data.presigned_acceptance.acceptance_token;
  return token;
};

//  Crear transaccion Nequi

const crearTransaccion = async (datos, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${privateKey}`,
    },
  };
  const reference = datos.reference;
  let precio;
  let precioNequi;
  const sorteoRef = db.collection("sorteos").doc(datos.idSorteo);
  const sorteo = await sorteoRef.get();
  if (!sorteo.exists) {
    console.log("No existe el sorteo");
  } else {
    precio = (sorteo.data().valorTicket) * datos.cantidad;
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

    const {data} = await axios.post("https://sandbox.wompi.co/v1/transactions", {
      "acceptance_token": token,
      "amount_in_cents": precioNequi,
      "currency": "COP",
      "customer_email": datos.customer_email,
      "payment_method": {
        "type": "NEQUI",
        "phone_number": datos.phone_nequi,
      },
      "reference": reference,
      "customer_data": {
        "phone_number": `57${datos.phone_number}`,
        "full_name": datos.full_name,
      },
    }, config);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

// ENDPOINT para procesar pagos via nequi PARA LOS PRONOSTIOS
const ejecutarPagoPronostico = async (req, res) => {
  try {
    const tokenAceptacion = await obtenerTokenAceptacion();
    await crearTransaccionPronosticos(req.body, tokenAceptacion);
    res.status(200).send({
      message: "Transaccion ejecutada con exito",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error al ejecutar pago",
    });
  }
};

//  Crear transaccion Nequi para pronosticos

const crearTransaccionPronosticos = async (datos, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${privateKey}`,
    },
  };
  const reference = datos.reference;
  let precio;
  let precioNequi;
  const pronRef = db.collection("pronosticos").doc(datos.idPron);
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

    const {data} = await axios.post("https://sandbox.wompi.co/v1/transactions", {
      "acceptance_token": token,
      "amount_in_cents": precioNequi,
      "currency": "COP",
      "customer_email": datos.customer_email,
      "payment_method": {
        "type": "NEQUI",
        "phone_number": datos.phone_nequi,
      },
      "reference": reference,
      "customer_data": {
        "phone_number": `57${datos.phone_number}`,
        "full_name": datos.full_name,
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
};
