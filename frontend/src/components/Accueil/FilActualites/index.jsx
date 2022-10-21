/*--------------------------------------------------------------------------------------------------*/
/* Définition du composant 'FilActualites' pour notre application React 'app' pour notre FrontEnd : */
/*--------------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../../utils/style/couleurs";

/* Importation de notre composant 'Chargement' */
import Chargement from "../../Chargement";
/* Importation de notre composant 'Message' */
import Message from "../../Messages/Message";
/* Importation de notre composant 'ButtonCreation' */
import ButtonCreation from "../../Messages/ButtonCreation";

/* Importation des hooks 'useState' et 'useEffect' de React */
import { useState, useEffect } from "react";

/* Importation de nos Hook personnalisés 'useTheme', 'useFetch' et 'useIdentification' */
import { useTheme, useFetch, useIdentification } from "../../../utils/hooks";

const FilActualitesContainer = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-items: space-between;
    margin: 0;
    padding: 0;
    list-style: none;
`;

const NoStyledLi = styled.li`
    margin: 10px 0;
    border-radius: 20px;
    background-color: ${({ theme }) => (theme === "clair" ? couleurs.secondaire : couleurs.tertiaire)};
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

// Définition du composant fonction 'FilActualites'
const FilActualites = () => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // identificationType pour le token pour la requête d'obtention de tous les messages
    const { identificationType } = useIdentification();

    // UseState pour la modification d'un message
    const [modificationMessageActive, definirModificationMessageActive] = useState(false);

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
    // UseState du retour de la requête sur tous les messages
    const [listeMessages, definirListeMessages] = useState([]);

    // Hook personnalisé pour effectuer les requêtes fetch
    const { donnees, enChargement, erreur } = useFetch(url, fetchParamObjet, infoFetch);

    // Déclanchement initial de la requête pour obtenir les informations de tous les message
    useEffect(() => {
        if (url === "") {
            console.log("<----- FIL D'ACTUALITES ----->");
            const token = identificationType.token;
            definirUrl("http://localhost:4000/api/posts");
            definirFetchParamObjet({
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            definirInfoFetch({
                typeFetch: "getAllMessages",
                donneesMessage: "Récupération de tous les messages terminée",
                alerteMessage: "Consultation des messages : ",
                erreurMessage: "Erreur pour la consultation des messages : [ ",
            });
        }
    }, []);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        if (donnees !== 0 && infoFetch.typeFetch === "getAllMessages") {
            //console.log(" => récupération des messages terminée");
            console.log("<----- FIN FIL D'ACTUALITES ----->");
            definirListeMessages(donnees);
        }
    }, [donnees]);

    // Erreur lors d'une requête Fetch
    if (erreur) {
        return <span>Oups il y a eu un problème</span>;
    }

    return enChargement ? (
        <Chargement />
    ) : (
        <FilActualitesContainer>
            <ButtonCreation definirListeMessages={definirListeMessages} />
            {listeMessages.length > 0 &&
                listeMessages.map((message) => (
                    <NoStyledLi key={message._id} theme={theme}>
                        <Message
                            message={message}
                            definirListeMessages={definirListeMessages}
                            modificationMessageActive={modificationMessageActive}
                            definirModificationMessageActive={definirModificationMessageActive}
                        />
                    </NoStyledLi>
                ))}
        </FilActualitesContainer>
    );
};

export default FilActualites;
