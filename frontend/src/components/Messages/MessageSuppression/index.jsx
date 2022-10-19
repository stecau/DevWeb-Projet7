/*--------------------------------------------------------------------------------------------*/
/* Définition du composant 'Message' pour notre application React 'app' pour notre FrontEnd : */
/*--------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation de notre style spécifique de lien */
import { StyleButton } from "../../../utils/style/Atomes";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Importation de notre composant 'Chargement' */
import Chargement from "../../Chargement";

/* importation du hook 'useContext' de React */
import { useContext, useState, useEffect } from "react";

/* Importation de nos Hooks 'useTheme' et 'useFetch' */
import { useTheme, useFetch } from "../../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../../utils/context";

const ButtonTexte = styled.span`
    font-size: ${({ $size }) => ($size ? $size : "12px")};
    padding-left: 5px;
`;

const MessageSuppression = ({ appMessage, definirListeMessages, definirEnChargementSuppression }) => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // Identification pour l'utilisation du token
    const { identificationType } = useContext(ConnexionContext);

    // UseState de l'url pour les requêtes Fetch
    const [url, definirUrl] = useState("");
    // UseState de l'objet init pour les requêtes Fetch
    const [fetchParamObjet, definirFetchParamObjet] = useState({});
    // UseState des informations sur la requête
    const [infoFetch, definirInfoFetch] = useState({
        typeFetch: {},
        donneesMessage: "",
        alerteMessage: "",
        erreurMessage: "",
    });
    // UseState de le suppression de message pour les requêtes Fetch
    const [suppressionMessage, activeSuppressionMessage] = useState(false);

    // Hook personnalisé pour effectuer les requêtes fetch
    const { donnees, enChargement, erreur } = useFetch(url, fetchParamObjet, infoFetch);

    // Déclanchement de la requête pour une suppression de message
    useEffect(() => {
        if (suppressionMessage) {
            const token = identificationType.token;
            definirUrl(`http://localhost:4000/api/posts/${appMessage._id}`);
            definirFetchParamObjet({
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            definirInfoFetch({
                typeFetch: {
                    type: "deleteMessage",
                },
                donneesMessage: "Suppression du message terminée",
                alerteMessage: "Suppression du message : ",
                erreurMessage: "Erreur pour la suppression du message : [ ",
            });
        }
    }, [suppressionMessage, appMessage]);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        // Fetch sur la suppression d'un message avec son id
        if (donnees.hasOwnProperty("message")) {
            if (donnees.message === "Message supprimé") {
                // Mise à jour de listeMessages avec une requête get sur tous les messages
                const token = identificationType.token;
                definirUrl(`http://localhost:4000/api/posts`);
                definirFetchParamObjet({
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                definirInfoFetch({
                    typeFetch: {
                        type: "getAllMessage",
                    },
                    donneesMessage: "Récupération de tous les messages terminée",
                    alerteMessage: "Consultation de tous les messages : ",
                    erreurMessage: "Erreur pour la consultation de tous les messages : [ ",
                });
            }
        }
        // Fetch sur récupération de tous les messages
        if (donnees.length) {
            // Envoi de la nouvelle liste grace au State
            definirListeMessages(donnees);
        }
    }, [donnees]);

    // Erreur lors d'une requête Fetch
    if (erreur || !appMessage.hasOwnProperty("_id")) {
        return <span>Oups il y a eu un problème</span>;
    }

    return enChargement ? (
        <Chargement />
    ) : (
        <StyleButton
            theme={theme}
            $estMessage
            $estFlex
            className="normalIcon"
            onClick={() => {
                activeSuppressionMessage(true);
            }}
        >
            <FontAwesomeIcon className="normalIcon" icon="fa-regular fa-trash-can" />
            <ButtonTexte>Supprimer</ButtonTexte>
        </StyleButton>
    );
};

export default MessageSuppression;
