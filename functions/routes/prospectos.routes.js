const express = require("express");
const {
    newProspecto,
} = require("../controllers/prospectosController.js");

const router = new express.Router();

router.post("/create-prospect", newProspecto);

module.exports = router;
