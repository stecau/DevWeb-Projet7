/*----------------------------------------------------------------*/
/* Création de notre server pour notre application 'GROUPOMANIA': */
/*----------------------------------------------------------------*/

/* Importation du module (package) 'http' de node */
const http = require('http');
/* Importation du module (package) 'dotenv' de node */
const dotenv = require('dotenv');
dotenv.config(); // Attention : Nécessite le fichier '.env'

/* Importation de notre application express 'app' */
const app = require('./app');

/* Création d'un serveur node */
    // Fonction normalizePort qui renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

    // Définition du port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

    // Fonction errorHandler
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    };
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    };
};

/* Création du serveur */
const server = http.createServer(app);
    // Ecoute les erreur avec la fonction errorHandler
server.on('error', errorHandler);
    // Ecoute des évènements en consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

/* Lancement du serveur */
server.listen(port);