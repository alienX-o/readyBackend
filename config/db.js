const fs = require("fs");
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
//   database: process.env.DB_NAME,
//   ssl: {
//     ca: fs.readFileSync("./ca.pem"), // download from Aiven console
//   },
//});
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = pool.promise();
