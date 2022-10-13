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
    // Fournit aux enfants le contexte (ici le type d'identification et l'object de connexion)
    // Utilisation du useState pour sauvegarder l'état de 'identificationType' avec sa fonction de mise à jour 'setIdentificationType'
    const [identificationType, setIdentificationType] = useState({
        type: "connexion",
        email: "Inconnu",
    });

    const generateurFalseToken = (data, reverse = false) => {
        /* Fonction pour le lecture du token falcifié du locazlStorage ou
        pour le création et le mise dans le local storage d'un string contenant :
        l'ensemble des informations d'identifacation séparée par des chaines spécifiques
        (token)ty-pe@q(é)em(aà-il@(email)id@(id)toenk */
        if (reverse) {
            // data est un string
            const stringToParse = `{\"token\":\"${
                data.split("ty-pe@q(é)em(aà-il@")[0]
            }\", 
            \"type\":\"${"connecté"}\", 
            \"email\":\"${
                data.split("ty-pe@q(é)em(aà-il@")[1].split("id@")[0]
            }\", 
                \"id\":${data
                    .split("ty-pe@q(é)em(aà-il@")[1]
                    .split("id@")[1]
                    .replace("toenk", "")}}`;
            console.log("<----- FONCTION GEN ----->");
            console.log(stringToParse);
            const objectResult = JSON.parse(stringToParse);
            // objectResult.id = parseInt(objectResult.id, 10);
            return objectResult;
        } else {
            // data est un objet
            const stringResult = `${data.token}ty-pe@q(é)em(aà-il@${data.email}id@${data.id}toenk`;
            console.log("<----- FONCTION GEN ----->");
            console.log(stringResult);
            return stringResult;
        }
    };

    // Déclaration d'une fonction pour changer d'état du localStorage ou du useState identificationType
    const updateIdentificationType = (data, reverse = false) => {
        console.log("<----- FONCTION UPDATE ----->");
        console.log("UseIdentification", data);
        console.log("typeof data", typeof data);
        console.log("reverse", reverse);
        let response = data; // cas où on fournit déjà l'objet
        if (typeof data === "string") {
            console.log("=> data = string");
            // Fonction pour récupérer un objet  équivalent à un JSON.parse du localStorage (response = objet)
            response = generateurFalseToken(data, reverse);
        }
        if (reverse) {
            console.log("=> reverse = true");
            console.log("=> response = objet");
            setIdentificationType(response);
        } else {
            console.log("=> reverse = false");
            if (typeof window !== "undefined") {
                // Fonction pour générer un token falcifier pour le localStorage (response = string)
                console.log("=> response = string");
                response = generateurFalseToken(data);
                window.localStorage.setItem("groupomania", response);
            }
        }
        console.log("UseIdentification => response", response);
        console.log("<----- ----- ----->");
    };

    return (
        <ConnexionContext.Provider
            value={{ identificationType, updateIdentificationType }}
        >
            {children}
        </ConnexionContext.Provider>
    );
};
