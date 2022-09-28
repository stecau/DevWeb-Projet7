/* Importation du module (package) 'mysql' */
const mysql = require("mysql");

// Creation de la connexion à la base de données avec la variable d'environnement DB_CONFIG
const connection = mysql.createConnection(JSON.parse(process.env.DB_CONFIG));

// Ouverture de la connexion MySQL
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

/* Exportation de notre methode de connexion */
module.exports = connection;