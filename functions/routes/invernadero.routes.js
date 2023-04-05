const express = require("express");
const {
  setTemperatura,
  setHumedad,
  setRiego,
} = require("../controllers/invController.js");

const router = new express.Router();

router.post("/temperatura", setTemperatura);
router.post("/humedad", setHumedad);
router.post("/riego", setRiego);

module.exports = router;
