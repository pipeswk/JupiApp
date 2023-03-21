const express = require("express");
const {
  reservarLotto,
  liberarLotto,
} = require("../controllers/lottosController.js");

const router = new express.Router();

router.post("/reservar-lotto", reservarLotto);
router.post("/liberar-lotto", liberarLotto);

module.exports = router;
