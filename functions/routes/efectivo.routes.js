const express = require("express");
const {
  efecty,
} = require("../controllers/efectivoController.js");

const router = new express.Router();

router.post("/efecty", efecty);

module.exports = router;
