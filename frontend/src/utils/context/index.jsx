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
    const [theme, setTheme] = useState("clair");
    // Déclaration d'une fonction pour changer d'état le 'theme' (interrupteur jour/nuit)
    const changeTheme = () => {
        setTheme(theme === "clair" ? "sombre" : "clair");
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
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

    const generateurFauxToken = (donnees, reverse = false) => {
        /* Fonction pour le lecture du token falcifié du locazlStorage ou
        pour le création et le mise dans le local storage d'un string contenant :
        l'ensemble des informations d'identifacation séparée par des chaines spécifiques
        (token)ty-pe@q(é)em(aà-il@(email)id@(id)toenk */
        if (reverse) {
            // donnees est un string
            const stringToParse = `{\"token\":\"${
                donnees.split("ty-pe@q(é)em(aà-il@")[0]
            }\", 
            \"type\":\"${"connecté"}\", 
            \"email\":\"${
                donnees.split("ty-pe@q(é)em(aà-il@")[1].split("id@")[0]
            }\", 
            \"id\":${
                donnees
                    .split("ty-pe@q(é)em(aà-il@")[1]
                    .split("id@")[1]
                    .split("toenk")[0]
            },
            \"isAdmin\":${donnees.split("toenk")[1]}}`;
            console.log("<----- FONCTION GEN ----->");
            console.log(stringToParse);
            const objectResult = JSON.parse(stringToParse);
            // objectResult.id = parseInt(objectResult.id, 10);
            return objectResult;
        } else {
            // donnees est un objet
            const stringResult = `${donnees.token}ty-pe@q(é)em(aà-il@${donnees.email}id@${donnees.id}toenk${donnees.isAdmin}`;
            console.log("<----- FONCTION GEN ----->");
            console.log(stringResult);
            return stringResult;
        }
    };

    // Déclaration d'une fonction pour changer d'état du localStorage ou du useState identificationType
    const majIdentificationType = (donnees, reverse = false) => {
        console.log("<----- FONCTION UPDATE ----->");
        console.log("UseIdentification", donnees);
        console.log("typeof donnees", typeof donnees);
        console.log("reverse", reverse);
        let reponse = donnees; // cas où on fournit déjà l'objet
        if (typeof donnees === "string") {
            console.log("=> donnees = string");
            // Fonction pour récupérer un objet  équivalent à un JSON.parse du localStorage (reponse = objet)
            reponse = generateurFauxToken(donnees, reverse);
        }
        if (reverse) {
            console.log("=> reverse = true");
            console.log("=> reponse = objet");
            setIdentificationType(reponse);
        } else {
            console.log("=> reverse = false");
            if (typeof window !== "undefined") {
                // Fonction pour générer un token falcifier pour le localStorage (reponse = string)
                console.log("=> reponse = string");
                reponse = generateurFauxToken(donnees);
                window.localStorage.setItem("groupomania", reponse);
            }
        }
        console.log("UseIdentification => reponse", reponse);
        console.log("<----- ----- ----->");
    };

    return (
        <ConnexionContext.Provider
            value={{ identificationType, majIdentificationType }}
        >
            {children}
        </ConnexionContext.Provider>
    );
};
