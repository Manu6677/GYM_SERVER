const express = require('express');
const router = express.Router();

const { addPlan, getPlan, deletePlan, updatePlan } = require("../controllers/plan");

// ********************************************************************************************************
//                                     User routes
// ********************************************************************************************************

// Post User in DataBase
router.post("/addPlan", addPlan);
router.post("/getPlan", getPlan);
router.post("/deletePlan", deletePlan);
router.post("/updatePlan", updatePlan);

module.exports = router;
