const express = require("express");
const {
  ejecutarPago,
} = require("../controllers/nequiController.js");

const router = new express.Router();

router.post("/procesar-pago-sorteo", ejecutarPago);

module.exports = router;
