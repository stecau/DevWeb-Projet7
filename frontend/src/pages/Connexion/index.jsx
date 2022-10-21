/*------------------------------------------------------------------------------------------*/
/* Définition de la page Connexion pour notre application React 'app' pour notre FrontEnd : */
/*------------------------------------------------------------------------------------------*/

/* importation des hooks 'useState' et 'useEffect' de React */
import { useState, useEffect } from "react";
/* importation du hook 'useNavigate' de 'react-router-dom' */
import { useNavigate } from "react-router-dom";

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../utils/style/couleurs";
/* Importation de notre style spécifique de button */
import { StyleButton } from "../../utils/style/Atomes";

/* Importation de nos Hook 'useTheme', 'useIdentification', 'useFetch' et 'useVerificationConnexion' */
import { useTheme, useIdentification, useFetch, useVerificationConnexion } from "../../utils/hooks";

/* Importation de notre composant 'Chargement' */
import Chargement from "../../components/Chargement";
/* Importation de notre composant 'FormInput' */
import FormInput from "../../components/FormInput";
/* Importation de notre composant 'CreationOuConnexion' */
import CreationOuConnexion from "../../components/Connexion/CreationOuConnexion";

const ConnexionArticle = styled.article`
    display: flex;
    justify-content: center;
`;

const ConnexionSection = styled.section`
    margin: 30px;
    background-color: ${({ theme }) => (theme === "clair" ? couleurs.backgroundClair : couleurs.backgroundSombre)};
    padding: 60px 90px;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
`;

const ConnexionFrom = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 150px;
    color: ${({ theme }) => (theme === "clair" ? couleurs.fontClair : couleurs.fontSombre)};
`;

const StyleTitreH1 = styled.h1`
    max-width: 350px;
    line-height: 50px;
    color: ${({ theme }) => (theme === "clair" ? couleurs.primaire : couleurs.secondaire)};
`;

// Définition de la route (composant fonction) 'Connexion'
const Connexion = () => {
    // Récupération des valeurs de contexte grace aux hooks personnalisés
    const { theme } = useTheme();
    // Hook personnalisé pour la récupération des informations de connexion au chargement de la page si une connexion est active et renvoie sur le fil d'actualité
    const { identificationType, majIdentificationType } = useVerificationConnexion(true);

    // Définition de 'allerA' pour suivre une route de notre app frontend
    const allerA = useNavigate();

    // Définition/récupération des données de connexion (mail et mot de passe) grace au State
    const [connexionDonnees, definirConnexionDonnees] = useState({
        email: { valeur: "", valide: true },
        motDePasse: { valeur: "", valide: true },
    });

    // UseState de l'url pour les requêtes Fetch
    const [url, definirUrl] = useState("");
    // UseState de l'objet init pour les requêtes Fetch
    const [fetchParamObjet, definirFetchParamObjet] = useState({});
    // UseState des informations sur la requête
    const [infoFetch, definirInfoFetch] = useState({
        typeFetch: "",
        donneesMessage: "",
        alerteMessage: "",
        erreurMessage: "",
    });

    // Hook personnalisé pour effectuer les requêtes fetch
    const { donnees, enChargement, erreur } = useFetch(url, fetchParamObjet, infoFetch);

    // Récupération des données lors d'une requête Fetch
    useEffect(() => {
        // Fetch de signup (création d'un compte)
        if (donnees.hasOwnProperty("message")) {
            if (donnees.message === infoFetch.donneesMessage && infoFetch.typeFetch === "CreationCompte") {
                // Requête de connexion qui suit la création du compte en définissant l'url, l'init et les infos pour le hook useFetch()
                console.log(" => création effectuée : nouveau compte généré, connexion sur le compte");
                console.log("<----- FIN CREATION ----->");
                console.log("<----- CONNEXION ----->");
                definirUrl("http://localhost:4000/api/auth/login");
                // Création du 'init' avec JSON (Content-Type": "application/json" et Authorization)
                definirFetchParamObjet({
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.valeur,
                        motDePasse: motDePasse.valeur,
                    }),
                });
                definirInfoFetch({
                    typeFetch: "ConnexionCompte",
                    donneesMessage: "Utilisateur connecté : ",
                    alerteMessage: "Connexion échouée : ",
                    erreurMessage: "Erreur de connexion : [ ",
                });
            }
        }
        // Fetch de login (connexion d'un compte)
        if (donnees.hasOwnProperty("message")) {
            if (donnees.message.indexOf(infoFetch.donneesMessage) !== -1 && infoFetch.typeFetch === "ConnexionCompte") {
                console.log(" => login effectué : udpade de identificationType (statut connecté)");
                // Mise à jour du type de connexion (utilisation du hook useIdentification)
                majIdentificationType(
                    {
                        type: "connecté",
                        email: email.valeur,
                        id: donnees.utilisateur_Id,
                        token: donnees.token,
                        isAdmin: donnees.isAdmin,
                    },
                    true
                );
                if (typeof window !== "undefined") {
                    // Generation d'un token falcifié pour le localStorage  (utilisation du hook useIdentification)
                    console.log(" => login effectué : génération du token falcifié pour localStorage");
                    majIdentificationType({
                        type: "connecté",
                        email: email.valeur,
                        id: donnees.utilisateur_Id,
                        token: donnees.token,
                        isAdmin: donnees.isAdmin,
                    });
                }
                // Affichage de l'email de l'utilisateur connecté dans l'onglet du navigateur
                document.title = `Groupomania / Utilisateur ${email.valeur}`;
                // Redirection vers le fil d'actualités
                allerA("/");
                console.log(" => connexion terminée : redirection vers la page 'Fil d'actualités'");
                console.log("<----- FIN CONNEXION ----->");
            }
        }
    }, [donnees]);

    // Erreur lors d'une requête Fetch
    if (erreur) {
        return <span>Oups il y a eu un problème</span>;
    }

    // Gestionnaire d'envoie des données du formulaire
    const gestionEnvoieForm = (event) => {
        event.preventDefault();
        if (email.valeur !== "" && motDePasse.valeur !== "") {
            // Si création d'un compte
            if (identificationType.type === "creation") {
                // Requête de création de compte en définissant l'url, l'init et les infos pour le hook useFetch()
                console.log("<----- CREATION COMPTE ----->");
                definirUrl("http://localhost:4000/api/auth/signup");
                // Création du 'init' avec JSON (Content-Type": "application/json" et Authorization)
                definirFetchParamObjet({
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.valeur,
                        motDePasse: motDePasse.valeur,
                        nom: "Ici votre nom",
                        prenom: "Ici votre prénom",
                    }),
                });
                definirInfoFetch({
                    typeFetch: "CreationCompte",
                    donneesMessage: "Nouvel utilisateur enregistré",
                    alerteMessage: "Création d'un compte échouée : ",
                    erreurMessage: "Erreur de création d'un compte : [ ",
                });
            }
            // Si connexion d'un compte uniquement
            if (identificationType.type === "connexion") {
                // Requête de connexion d'un compte en définissant l'url, l'init et les infos pour le hook useFetch()
                console.log("<----- CONNEXION ----->");
                definirUrl("http://localhost:4000/api/auth/login");
                // Création du 'init' avec JSON (Content-Type": "application/json" et Authorization)
                definirFetchParamObjet({
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.valeur,
                        motDePasse: motDePasse.valeur,
                    }),
                });
                definirInfoFetch({
                    typeFetch: "ConnexionCompte",
                    donneesMessage: "Utilisateur connecté : ",
                    alerteMessage: "Connexion échouée : ",
                    erreurMessage: "Erreur de connexion : [ ",
                });
            }
        } else {
            // Email et/ou Mot de passe 'vide'' dans le formulaire
            console.log("<----- CONNEXION OU CREATION ----->");
            if (email.valeur.length === 0) {
                definirConnexionDonnees((ancienneDonnees) => {
                    return {
                        ...ancienneDonnees,
                        email: {
                            valeur: email.valeur,
                            valide: false,
                        },
                    };
                });
            }
            if (motDePasse.valeur.length === 0) {
                definirConnexionDonnees((ancienneDonnees) => {
                    return {
                        ...ancienneDonnees,
                        motDePasse: {
                            valeur: motDePasse.valeur,
                            valide: false,
                        },
                    };
                });
            }
        }
    };

    // Récupération des données de connexion pour les inputs du formulaire
    const { email, motDePasse } = connexionDonnees;

    // Affichage du texte du titre en fonction du type de connexion
    const TexteTitreH1 = () => {
        if (identificationType.type === "connexion") {
            return "Connectez-vous !";
        } else {
            return "Créez votre compte !";
        }
    };

    // Affichage du texte du bouton en fonction du type de connexion
    const TexteButton = () => {
        if (identificationType.type === "connexion") {
            return "Connexion";
        } else {
            return "Création";
        }
    };

    return (
        <ConnexionArticle>
            <ConnexionSection theme={theme}>
                <StyleTitreH1 theme={theme}>{TexteTitreH1()}</StyleTitreH1>
                {enChargement ? (
                    <Chargement />
                ) : (
                    <ConnexionFrom theme={theme}>
                        <FormInput id="email" state={connexionDonnees} majState={definirConnexionDonnees} />
                        <FormInput id="motDePasse" state={connexionDonnees} majState={definirConnexionDonnees} />
                        <StyleButton theme={theme} $estActive onClick={gestionEnvoieForm}>
                            {TexteButton()}
                        </StyleButton>
                    </ConnexionFrom>
                )}
                <CreationOuConnexion />
            </ConnexionSection>
        </ConnexionArticle>
    );
};

export default Connexion;
