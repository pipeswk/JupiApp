const express = require("express");
const {
    newProspecto,
    addCollectionField,
    lockNumbers,
    lockSpecificNumbers,
    unlockNumbers,
    unlockAllNumbers,
} = require("../controllers/utilsController.js");

const router = new express.Router();

router.post("/create-prospect", newProspecto);
router.post("/add-collection-field", addCollectionField);
router.post("/lock-numbers", lockNumbers);
router.post("/lock-specific-numbers", lockSpecificNumbers);
router.post("/unlock-numbers", unlockNumbers);
router.post("/unlock-all-numbers", unlockAllNumbers);

module.exports = router;
