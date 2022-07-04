const express = require("express");
const {
  efecty,
  pse,
} = require("../controllers/efectivoController.js");

const router = new express.Router();

router.post("/efecty", efecty);
router.post("/pse", pse);

module.exports = router;
