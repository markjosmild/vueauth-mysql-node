const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.password,
  database: "socialmediadb",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("mysql database connected!");
});

module.exports = con;
