const express = require("express");
const {
  ejecutarPagoSorteo,
  ejecutarPagoPronostico,
} = require("../controllers/nequiController.js");
const {newSorteo} = require("../controllers/newSorteo.js");

const router = new express.Router();

router.post("/procesar-pago-sorteo", ejecutarPagoSorteo);
router.post("/procesar-pago-pronostico", ejecutarPagoPronostico);
router.post("/new-sorteo", newSorteo);

module.exports = router;
