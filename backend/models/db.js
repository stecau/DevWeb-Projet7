/* Importation du module (package) 'mysql' */
const mysql = require("mysql");

/* Importation de notre module de configuration pour la connection a la DB */
const dbConfig = require("../config/db.config");

// Create a connection to the database
// const connection = mysql.createConnection({
//   host: dbConfig.HOST,
//   user: dbConfig.USER,
//   password: dbConfig.PASSWORD,
//   database: dbConfig.DB
// });
var connString = `mysql://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}/${dbConfig.DB}?charset=utf8_general_ci&timezone=-0700`;
var connection = mysql.createConnection(connString);

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

/* Exportation de notre methode de connexion */
module.exports = connection;