/*---------------------------------------------------------------------------------------------*/
/* Définition des composants Provider pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------------*/

/* Importation du module 'createContext' et 'useState' de React */
import { createContext, useState } from "react";

/*---------------------------------------------------------------------------------------------*/
// Déclaration du ThemeContext avec 'createContext'
export const ThemeContext = createContext();

// Déclaration du composant Provider ThemeProvider utilisant le contexte 'ThemeContext'
export const ThemeProvider = ({ children }) => {
    // Fournit aux enfants le contexte (ici le thème)
    // Utilisation du useState pour sauvegarder l'état de 'theme' avec sa fonction de mise à jour 'setTheme'
    const [theme, setTheme] = useState("clair");
    // Déclaration d'une fonction pour changer d'état le 'theme' (interrupteur jour/nuit)
    const changeTheme = () => {
        setTheme(theme === "clair" ? "sombre" : "clair");
    };

    return <ThemeContext.Provider value={{ theme, changeTheme }}>{children}</ThemeContext.Provider>;
};
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
// Déclaration du ConnexionContext avec 'createContext'
export const ConnexionContext = createContext();

// Déclaration du composant Provider ConnexionProvider utilisant le contexte 'ConnexionContext'
export const ConnexionProvider = ({ children }) => {
    // Fournit aux enfants le contexte (ici le type d'identification et l'object de connexion)
    // Utilisation du useState pour sauvegarder l'état de 'identificationType' avec sa fonction de mise à jour 'setIdentificationType'
    const [identificationType, setIdentificationType] = useState({
        type: "connexion",
        email: "Inconnu",
    });

    const generateurFauxToken = (donnees, inverse = false) => {
        /* Fonction pour le lecture du token falcifié du localStorage ou
        pour le création et le mise dans le local storage d'un string contenant :
        l'ensemble des informations d'identifacation séparée par des chaines spécifiques
        (token)ty-pe@q(é)em(aà-il@(email)id@(id)toenk(isAdmin) */
        if (inverse) {
            // donnees est un string
            const stringToParse = `{\"token\":\"${donnees.split("ty-pe@q(é)em(aà-il@")[0]}\", 
            \"type\":\"${"connecté"}\", 
            \"email\":\"${donnees.split("ty-pe@q(é)em(aà-il@")[1].split("id@")[0]}\", 
            \"id\":${donnees.split("ty-pe@q(é)em(aà-il@")[1].split("id@")[1].split("toenk")[0]},
            \"isAdmin\":${donnees.split("toenk")[1]}}`;
            //console.log("<----- FONCTION GEN ----->");
            //console.log(stringToParse);
            const objectResult = JSON.parse(stringToParse);
            // objectResult.id = parseInt(objectResult.id, 10);
            return objectResult;
        } else {
            // donnees est un objet
            const stringResult = `${donnees.token}ty-pe@q(é)em(aà-il@${donnees.email}id@${donnees.id}toenk${donnees.isAdmin}`;
            //console.log("<----- FONCTION GEN ----->");
            //console.log(stringResult);
            return stringResult;
        }
    };

    // Déclaration d'une fonction pour changer d'état du localStorage ou du useState identificationType
    const majIdentificationType = (donnees, inverse = false) => {
        //console.log("<----- FONCTION UPDATE ----->");
        //console.log("UseIdentification", donnees);
        //console.log("typeof donnees", typeof donnees);
        //console.log("inverse", inverse);
        let reponse = donnees; // cas où on fournit déjà l'objet
        if (typeof donnees === "string") {
            //console.log("=> donnees = string");
            // Fonction pour récupérer un objet  équivalent à un JSON.parse du localStorage (reponse = objet)
            reponse = generateurFauxToken(donnees, inverse);
        }
        if (inverse) {
            //console.log("=> inverse = true");
            //console.log("=> reponse = objet");
            setIdentificationType(reponse);
        } else {
            //console.log("=> inverse = false");
            if (typeof window !== "undefined") {
                // Fonction pour générer un token falcifier pour le localStorage (reponse = string)
                //console.log("=> reponse = string");
                reponse = generateurFauxToken(donnees);
                window.localStorage.setItem("groupomania", reponse);
            }
        }
        //console.log("UseIdentification => reponse", reponse);
        //console.log("<----- ----- ----->");
    };

    return <ConnexionContext.Provider value={{ identificationType, majIdentificationType }}>{children}</ConnexionContext.Provider>;
};
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
// Déclaration du CompteContext avec 'createContext'
export const CompteContext = createContext();

// Déclaration du composant Provider CompteProvider utilisant le contexte 'CompteContext'
export const CompteProvider = ({ children }) => {
    // Fournit aux enfants le contexte (ici les données du compte)
    // UseState pour le lancement de la requête Fetch d'obtention des informations d'un utilisateur
    const [utilisateur, genererUtilisateur] = useState("");

    // Définition/récupération/Validation des données de l'utilisateur (mail et mot de passe,...) grace au State
    const [utilisateurDonnees, definirUtilisateurDonnees] = useState({
        email: { valeur: "", valide: true },
        ancienMDP: { valeur: "", valide: true },
        nouveauMDP1: { valeur: "", valide: true },
        nouveauMDP2: { valeur: "", valide: true },
        nom: { valeur: "", valide: true },
        prenom: { valeur: "", valide: true },
        poste: { valeur: "", valide: true },
    });

    // Déclaration du boolean 'changeMDP' avec le 'state' pour les conserver
    const [changeMDP, definirChangeMDP] = useState(false);
    // Déclaration d'une fonction pour changer d'état le 'changeMDP' (interrupteur on/off)
    const afficherChangeMDP = () => {
        definirChangeMDP(changeMDP ? false : true);
    };

    return (
        <CompteContext.Provider
            value={{
                utilisateur,
                genererUtilisateur,
                utilisateurDonnees,
                definirUtilisateurDonnees,
                changeMDP,
                afficherChangeMDP,
            }}
        >
            {children}
        </CompteContext.Provider>
    );
};
