const express = require('express');
const router = express.Router();

const { addUser, getUser, deleteUser, updateUser, deleteUserForcefully } = require("../controllers/user");

// ********************************************************************************************************
//                                     User routes
// ********************************************************************************************************

// Post User in DataBase
router.post("/adduser", addUser);
router.post("/getUser", getUser);
router.post("/deleteUser", deleteUser);
router.post("/updateUser", updateUser);
router.post("/deleteUserForcefully", deleteUserForcefully);

module.exports = router;
