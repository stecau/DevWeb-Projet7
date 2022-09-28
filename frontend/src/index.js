/*-----------------------------------------------------------------------------*/
/* Rendu/Initialisation de notre application React 'app' pour notre FrontEnd : */
/*-----------------------------------------------------------------------------*/

/* Importation des modules de React */
import React from 'react';
import ReactDOM from 'react-dom/client';

/* Importation de style 'css' de base (body & code) */
import './styles/index.css';

/* Importation de notre notre App FrontEnd */
import App from './components/App';

/* Déclaration de l'emplacement du contenu 'ReactDOM' (=DOM temporaire) qui sera généré par React pour la page html (utilisation de l'id 'root' de la <div>) */
const root = ReactDOM.createRoot(document.getElementById('root'));
// Rendu du DOM temporaire 'root' en l'emplacement demandé
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
