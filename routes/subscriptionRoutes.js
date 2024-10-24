const express = require('express');
const router = express.Router();

const { addSubscription, getSubscription, deleteSubscription, updateSubscription } = require("../controllers/subscription");

// ********************************************************************************************************
//                                     User routes
// ********************************************************************************************************

// Post User in DataBase
router.post("/addSubscription", addSubscription);
router.post("/getSubscription", getSubscription);
router.post("/deleteSubscription", deleteSubscription);
router.post("/updateSubscription", updateSubscription);

module.exports = router;
