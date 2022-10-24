/*---------------------------------------------------------------------------------------------*/
/* Définition des Hooks personnalisés pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------------*/

/* Importation du module 'useState', 'useEffect' et 'useContext' de React */
import { useState, useEffect, useContext } from "react";
/* importation du hook 'useNavigate' de 'react-router-dom' */
import { useNavigate } from "react-router-dom";

/* Importation de notre composant context 'ThemeContext' depuis le dossier 'Context' */
import { ThemeContext } from "../context";
/* Importation de notre composant context 'ConnexionContext' depuis le dossier 'Context' */
import { ConnexionContext } from "../context";
/* Importation de notre composant context 'CompteContext' depuis le dossier 'Context' */
import { CompteContext } from "../context";

/*---------------------------------------------------------------------------------------------*/
// Déclaration de notre Hook pour l'utilisation du Thème 'Clair' ou 'Sombre'
export function useTheme() {
    // Récupération du contexte de 'ThemeContext'
    const { theme, changeTheme } = useContext(ThemeContext);
    // Retourne la valeur de theme et la fonction basculement d'état du thème contenu dans l'objet 'ThemeContext'
    return { theme, changeTheme };
}
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
// Déclaration de notre Hook pour l'utilisation de l'identification
export function useIdentification() {
    // Récupération du contexte de 'ConnexionContext'
    const { identificationType, majIdentificationType } = useContext(ConnexionContext);
    // Retourne les données d'identification et la fonction de mise à jour des données contenu dans l'objet 'ConnexionContext'
    return { identificationType, majIdentificationType };
}
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
// Déclaration de notre Hook pour récupérer les données d'identification au chargement initial d'une page
export function useVerificationConnexion(connexionPage = false) {
    // Récupération du contexte de 'ConnexionContext'
    const { identificationType, majIdentificationType } = useContext(ConnexionContext);

    // Définition de 'allerA' pour suivre une route de notre app frontend
    const allerA = useNavigate();

    // State pour récupération du mail pour le titre du document
    const [modifierTitreDocument, majModifierTitreDocument] = useState(false);

    // Récupération du statut de connexion au chargement de la page
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("groupomania") && identificationType.type !== "connecté") {
                // Récupération du token falcifié du localStorage (utilisation du hook useIdentification)
                majIdentificationType(window.localStorage.getItem("groupomania"), true);
                // Titre du document à modifier
                majModifierTitreDocument(true);
            }
        }
    }, []);

    // Changement du titre de l'onglet et changement de route si url "/connexion"
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("groupomania") && identificationType.type === "connecté" && modifierTitreDocument) {
                document.title = `Groupomania / Utilisateur ${identificationType.email}`;
                majModifierTitreDocument(false);
                if (connexionPage) {
                    allerA("/");
                }
            }
        }
    }, [identificationType, modifierTitreDocument]);

    // Retourne les données d'identification et la fonction de mise à jour des données contenu dans l'objet 'ConnexionContext'
    return { identificationType, majIdentificationType };
}
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
// Déclaration de notre Hook pour remplir le formulaire d'un comptes (au chargement de la page, au refresh, à la modification)
export function useRemplirFormulaireCompte(donnees = {}, refresh = false, setRefresh = null) {
    // Récupération du contexte de 'CompteContext'
    const { utilisateur, utilisateurDonnees, definirUtilisateurDonnees } = useContext(CompteContext);

    // Fonction pour changer l'affichage dans les inputs des valeurs par défaut
    const changeDefautValeur = (valeur, defautValeur = null, nouvelleValeur = "") => {
        if (valeur === defautValeur) {
            return nouvelleValeur;
        } else {
            return valeur;
        }
    };

    // Fonction pour mettre à jour les valeurs dans le formulaire
    const updateFormValeur = (objetData) => {
        definirUtilisateurDonnees((ancienUtilisateur) => {
            return {
                ...ancienUtilisateur,
                email: { valeur: objetData.email, valide: true },
                ancienMDP: { valeur: "", valide: true },
                nouveauMDP1: { valeur: "", valide: true },
                nouveauMDP2: { valeur: "", valide: true },
                nom: { valeur: changeDefautValeur(objetData.nom, "Ici votre nom"), valide: true },
                prenom: { valeur: changeDefautValeur(objetData.prenom, "Ici votre prénom"), valide: true },
                poste: { valeur: changeDefautValeur(objetData.poste), valide: true },
            };
        });
    };

    useEffect(() => {
        if (refresh) {
            updateFormValeur(utilisateur);
            setRefresh(false);
        } else if (donnees.hasOwnProperty("_id")) {
            updateFormValeur(donnees);
        } else if (donnees.message === "Utilisateur modifié") {
            updateFormValeur(donnees.utilisateur);
        }
    }, [donnees, refresh]);

    return { utilisateurDonnees, definirUtilisateurDonnees };
}
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
// Déclaration de notre Hook pour mettre à jour le compte de l'utilisateur
export function useUtilisateurInfo() {
    // Récupération du contexte de 'CompteContext'
    const { utilisateur, genererUtilisateur } = useContext(CompteContext);
    // Retourne la valeur de utilisateur et la fonction de changement de valeur genererUtilisateur
    return { utilisateur, genererUtilisateur };
}
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
// Déclaration de notre Hook pour permettre ou non la modification du mot de passe
export function useChangeMDP() {
    // Récupération du contexte de 'CompteContext'
    const { changeMDP, afficherChangeMDP } = useContext(CompteContext);
    // Retourne la valeur de changeMDP et la fonction basculement d'état du afficherChangeMDP
    return { changeMDP, afficherChangeMDP };
}
/*---------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------*/
// Déclaration de notre Hook pour permettre la réalisation de requêtes Fetch
export function useFetch(url, fetchParamObjet, definirInfoFetch) {
    // Déclaration des données 'donnees' renvoyées par la requête avec le 'state' pour les conserver
    const [donnees, definirDonnees] = useState(0);
    // Déclaration du status du 'IndicateurChargement' en attendant la fin de la requête avec le 'state'
    const [enChargement, definirChargement] = useState(false);
    // Déclaration du status d'une éventuelle erreur pendant la requête avec le 'state'
    const [erreur, definirErreur] = useState(false);

    // Utilisation du useEffect pour lancer la requête Fetch
    useEffect(() => {
        // S'il n'y a pas d'url retourne une valuer 'null'
        if (!url) return;
        // Déclaration d'une fonction asynchrone 'fetchData' dans le useEffect car useEffect n'est pas asynchrone
        async function fetchData() {
            // Mise en place de la structure 'try' 'catch' 'finally' pour la gestion des erreur dans la requête
            try {
                // Requête fetch avec l'url (fonction 'fetch' asynchrone => await)
                const reponse = await fetch(url, fetchParamObjet);
                // Parse de la réponse de la requête (fonction 'json' asynchrone => await)
                const donnees = await reponse.json();
                if (reponse.ok) {
                    // Appel de la fonction du useState pour la sauvegarde des 'donnees' dans le 'state'
                    definirDonnees(donnees);
                } else {
                    if (donnees.message === "ER_DUP_ENTRY") {
                        // Erreur car compte existant => correction du message avec un message un peu flou
                        donnees.message = "Veuillez choisir une autre paire identifiant/mot de passe";
                    }
                    alert(`${definirInfoFetch.alerteMessage}${donnees.message}`);
                }
            } catch (err) {
                // Transmission de l'erreur et changement du status de 'erreur' dans le 'state'
                alert(`${definirInfoFetch.erreurMessage}${err} ]`);
                definirErreur(true);
            } finally {
                // Fin de la requête, changement du status pour le IndicateurChargement
                definirChargement(false);
            }
        }
        // Début de la requête, changement du status pour le IndicateurChargement
        definirChargement(true);
        // Appel de la fonction asynchrone 'fetchData' déclarée dans le useEffect (utilisation de setTimeout pour simuler un délai)
        fetchData();
    }, [url, fetchParamObjet, definirInfoFetch]);

    // La fonction retourne le status du IndicateurChargement, les données, et le status d'une éventuelle erreur
    return { enChargement, donnees, erreur };
}
/*---------------------------------------------------------------------------------------------*/
