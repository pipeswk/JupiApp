const express = require("express");
const {
    newProspecto,
    addCollectionField,
} = require("../controllers/utilsController.js");

const router = new express.Router();

router.post("/create-prospect", newProspecto);
router.post("/add-collection-field", addCollectionField);

module.exports = router;
