/*---------------------------------------------------------------------------------------------*/
/* Définition des composants Provider pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------------*/

/* Importation du module 'createContext' et 'useState' de React */
import { createContext, useState } from "react";

// Déclaration du ThemeContext avec 'createContext'
export const ThemeContext = createContext();

// Déclaration du composant Provider ThemeProvider utilisant le composant 'ThemeContext'
export const ThemeProvider = ({ children }) => {
    // Fournit aux enfants le contexte (ici le thème)
    // Utilisation du useState pour sauvegarder l'état de 'theme' avec sa fonction de mise à jour 'setTheme'
    const [theme, setTheme] = useState("light");
    // Déclaration d'une fonction pour changer d'état le 'theme' (interrupteur jour/nuit)
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Déclaration du ConnexionContext avec 'createContext'
export const ConnexionContext = createContext();

// Déclaration du composant Provider ConnexionProvider utilisant le composant 'ConnexionContext'
export const ConnexionProvider = ({ children }) => {
    // Fournit aux enfants le contexte (ici le type d'identification)
    // Utilisation du useState pour sauvegarder l'état de 'identificationType' avec sa fonction de mise à jour 'setIdentificationType'
    const [identificationType, setIdentificationType] = useState("connexion");

    return (
        <ConnexionContext.Provider
            value={{ identificationType, setIdentificationType }}
        >
            {children}
        </ConnexionContext.Provider>
    );
};
