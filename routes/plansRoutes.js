const express = require('express');
const router = express.Router();

const { addPlan, getPlan, deletePlan, updatePlan, deletePlanForcefully } = require("../controllers/plan");

// ********************************************************************************************************
//                                     User routes
// ********************************************************************************************************

// Post User in DataBase
router.post("/addPlan", addPlan);
router.post("/getPlan", getPlan);
router.post("/updatePlan", updatePlan);
router.post("/deletePlan", deletePlan);
router.post("/deletePlanForcefully", deletePlanForcefully);

module.exports = router;
