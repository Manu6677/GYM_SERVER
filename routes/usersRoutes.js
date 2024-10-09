const express = require('express');
const router = express.Router();

const { addUser } = require("../controllers/user");

// ********************************************************************************************************
//                                     User routes
// ********************************************************************************************************

// Post User in DataBase
router.post("/adduser", addUser);

module.exports = router;
