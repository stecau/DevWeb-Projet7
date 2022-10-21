/*-----------------------------------------------------------------------------*/
/* Rendu/Initialisation de notre application React 'app' pour notre FrontEnd : */
/*-----------------------------------------------------------------------------*/

/* Importation des modules de React */
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Importation des différentes 'pages' du site */
import Accueil from "./pages/Accueil";
import Connexion from "./pages/Connexion";
import Compte from "./pages/Compte";

/* Importation des composants */
import Header from "./components/Header";
import Footer from "./components/Footer";
import Erreur from "./components/Erreur";

/* Importation des utilitaires (provider et style global) */
// Provider
import { ThemeProvider, ConnexionProvider } from "./utils/context";
// Style Global du site */
import StyleGlobal from "./utils/style/StyleGlobal";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faThumbsUp,
    faHeart,
    faTrashCan,
    faPenToSquare,
    faEnvelope,
    faCircleLeft,
    faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";

import {
    faEnvelopeCircleCheck,
    faArrowRightFromBracket,
    faHouse,
    faAddressCard,
    faRightToBracket,
    faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

library.add(
    faThumbsUp,
    faHeart,
    faTrashCan,
    faPenToSquare,
    faEnvelope,
    faEnvelopeCircleCheck,
    faCircleLeft,
    faCircleXmark,
    faArrowRightFromBracket,
    faHouse,
    faAddressCard,
    faRightToBracket,
    faRightFromBracket
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <StrictMode>
        <Router>
            <ThemeProvider>
                <StyleGlobal />
                <ConnexionProvider>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Accueil />} />
                        <Route path="/connexion" element={<Connexion />} />
                        <Route path="/compte" element={<Compte />} />
                        <Route path="*" element={<Erreur />} />
                    </Routes>
                    <Footer />
                </ConnexionProvider>
            </ThemeProvider>
        </Router>
    </StrictMode>
);
