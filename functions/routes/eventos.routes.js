const express = require("express");
const {
  escucharEventos,
} = require("../controllers/eventosController.js");

const router = new express.Router();

router.post("/nequi", escucharEventos);

module.exports = router;
