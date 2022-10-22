/*-----------------------------------------------------------------------------------------------------*/
/* Définition de notre composant 'CompteShow' pour notre application React 'app' pour notre FrontEnd : */
/*-----------------------------------------------------------------------------------------------------*/

/* importation du hook 'useState' et 'useEffect' de React */
import { useState, useEffect } from "react";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs personnalisés */
import couleurs from "../../../utils/style/couleurs";

/* Importation de notre composant 'Chargement' */
import Chargement from "../../Chargement";
/* Importation de notre composant 'CompteForm' */
import CompteForm from "../CompteForm";
/* Importation de notre composant 'CompteRefresh' */
import CompteRefresh from "../CompteRefresh";
/* Importation de notre composant 'CompteModification' */
import CompteModification from "../CompteModification";
/* Importation de notre composant 'CompteSuppression' */
import CompteSuppression from "../CompteSuppression";

/* Importation de nos Hooks personnalisés */
import { useTheme, useIdentification, useFetch, useRemplirFormulaireCompte, useUtilisateurInfo } from "../../../utils/hooks";

const ModificationConteneur = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start-flex;
`;
const StyleTitreH2 = styled.h2`
    max-width: 600px;
    padding: 0;
    margin: 0;
    color: ${({ theme }) => (theme === "clair" ? couleurs.fontClair : couleurs.fontSombre)};
`;

const ButtonConteneur = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
`;

// Définition du composant fonction 'CompteShow'
const CompteShow = () => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // Hook pour les infos de l'utilisateur et leur gestion (retour de requête)
    const { utilisateur, genererUtilisateur } = useUtilisateurInfo();
    // identificationType pour le token, l'id de l'utilisateur et lors de la suppression d'un compte pour les requêtes
    const { identificationType } = useIdentification();

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

    // Hook personnalisé pour effectuer le remplissage des inputs du formulaires
    useRemplirFormulaireCompte(donnees);

    // UseEffect de lancement de la requête pour obtenir les informations utilisateur à la connexion
    useEffect(() => {
        if (utilisateur === "") {
            const token = identificationType.token;

            definirUrl(`http://localhost:4000/api/auth/${identificationType.id}`);
            // Création du 'init' avec JSON (Content-Type": "application/json" et Authorization)
            definirFetchParamObjet({
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            definirInfoFetch({
                typeFetch: "GetCompte",
                donneesMessage: "Consultation du compte terminée",
                alerteMessage: "Consultation du compte : ",
                erreurMessage: "Erreur pour la consultation du compte : [ ",
            });
        }
    }, []);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        // Fetch de get sur utilisateur avec id
        if (donnees.hasOwnProperty("_id")) {
            genererUtilisateur(donnees);
        }
    }, [donnees]);

    // Erreur lors d'une requête Fetch
    if (erreur) {
        return <span>Oups il y a eu un problème</span>;
    }

    return (
        <ModificationConteneur>
            <StyleTitreH2 theme={theme}>Mes informations</StyleTitreH2>
            {enChargement ? <Chargement /> : <CompteForm />}
            <StyleTitreH2 theme={theme}>Mes options</StyleTitreH2>
            <ButtonConteneur className="optionsCompte">
                <CompteRefresh admin={utilisateur.isAdmin} />
                <CompteModification />
                <CompteSuppression admin={utilisateur.isAdmin} />
            </ButtonConteneur>
        </ModificationConteneur>
    );
};

export default CompteShow;
