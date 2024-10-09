// const {Client} = require('pg');
// require('dotenv').config();

// const db = process.env.DB
// const db_pass = process.env.DB_PASS;
// const db_host = process.env.DB_HOST;
// const db_user = process.env.DB_USER;
// const db_port = process.env.DB_PORT;

// const client = new Client({
//     host: db_host,
//     user: db_user,
//     port: db_port,
//     password: db_pass,
//     database : db
// })

// module.exports = client;

require('dotenv').config();
const mysql = require('mysql2');

const db = process.env.DB;
const db_pass = process.env.DB_PASS;
const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_port = process.env.DB_PORT;

console.log(db, db_pass, db_host, db_user,);

const client = mysql.createConnection({
    host: db_host,
    user: db_user,
    password: db_pass,
    database: db,
    port: db_port
});

// Connect to the database
client.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to the MySQL database');
  }
});

module.exports = client;
