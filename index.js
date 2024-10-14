require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const client = require("./connection"); 
const cors = require("cors");
const bodyParser = require("body-parser"); // Import body-parser

// Ensure you have the correct path to your routes
const usersRoute = require("./routes/usersRoutes"); // Fix the path to your usersRoutes
const plansRoute = require("./routes/plansRoutes"); // Fix the path to your plansRoutes
const subscriptionRoute = require("./routes/subscriptionRoutes"); // Fix the path to your plansRoutes

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// Middleware for parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3001;

app.use("/api/v1/users", usersRoute); 
app.use("/api/v1/plans", plansRoute); 
app.use("/api/v1/subscriptions", subscriptionRoute); 


app.listen(port, () => {
  console.log(`Server is started at ${port}`);
});


