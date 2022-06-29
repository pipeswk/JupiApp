const express = require("express");
const {
  escucharEventos,
  eventosMercadoPago,
} = require("../controllers/eventosController.js");

const router = new express.Router();

router.post("/nequi", escucharEventos);
router.post("/mercadopago", eventosMercadoPago);

module.exports = router;
