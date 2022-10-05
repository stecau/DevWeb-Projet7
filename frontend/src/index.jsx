/*-----------------------------------------------------------------------------*/
/* Rendu/Initialisation de notre application React 'app' pour notre FrontEnd : */
/*-----------------------------------------------------------------------------*/

/* Importation des modules de React */
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Importation des différentes 'pages' du site */
import Home from "./pages/Home";
import Connexion from "./pages/Connexion";
import Compte from "./pages/Compte";

/* Importation des composants */
import Header from "./components/Header";
import Footer from "./components/Footer";
import Error from "./components/Error";

/* Importation des utilitaires (provider et style global) */
// Provider
import { ThemeProvider, ConnexionProvider } from "./utils/context";
// Style Global du site */
import GlobalStyle from "./utils/style/GlobalStyle";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Router>
            <ThemeProvider>
                <GlobalStyle />
                <ConnexionProvider>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/connexion" element={<Connexion />} />
                        <Route path="/compte" element={<Compte />} />
                        <Route path="*" element={<Error />} />
                    </Routes>
                    <Footer />
                </ConnexionProvider>
            </ThemeProvider>
        </Router>
    </React.StrictMode>
);
