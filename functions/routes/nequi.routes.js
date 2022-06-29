const express = require("express");
const {
  ejecutarPagoSorteo,
  ejecutarPagoPronostico,
} = require("../controllers/nequiController.js");

const router = new express.Router();

router.post("/procesar-pago-sorteo", ejecutarPagoSorteo);
router.post("/procesar-pago-pronostico", ejecutarPagoPronostico);

module.exports = router;
