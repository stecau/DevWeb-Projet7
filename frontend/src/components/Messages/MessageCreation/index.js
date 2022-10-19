/*----------------------------------------------------------------------------------------------------*/
/* Définition du composant 'MessageCreation' pour notre application React 'app' pour notre FrontEnd : */
/*----------------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../../utils/style/couleurs";

/* importation du hook 'useContext' de React */
import { useState, useEffect } from "react";

/* Importation de notre Hook 'useTheme' */
import { useTheme, useFetch, useIdentification } from "../../../utils/hooks";

/* Importation de notre composant 'Chargement' */
import Chargement from "../../Chargement";
/* Importation de notre composant 'FormInput' */
import FormInput from "../../FormInput";
/* Importation de notre composant 'MessageButtons' */
import MessageButtons from "../MessageButtons";

const MessageForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
    padding: 10px;
    color: ${({ theme }) => (theme === "clair" ? couleurs.tertiaire : couleurs.secondaire)};
`;

const MessageFieldset = styled.fieldset`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledLegend = styled.legend`
    border-color: ${({ theme }) => (theme === "clair" ? couleurs.tertiaire : couleurs.secondaire)};
`;

const StyledTitle = styled.h1`
    margin: 10px 0;
    color: ${({ theme }) => (theme === "clair" ? couleurs.primaire : couleurs.secondaire)};
`;

const MessageCreation = ({ definirCreationMessageActive, definirListeMessages }) => {
    // Récupération des valeurs de contexte grace aux hooks personnalisés
    const { theme } = useTheme();
    const { identificationType } = useIdentification();

    // Définition/récupération des données de création du message (titre, texte et image) grace au State
    const [creationDonnees, definirCreationDonnees] = useState({
        titre: { valeur: "", valide: true },
        texte: { valeur: "", valide: true },
        image: { valeur: undefined, valide: true },
    });

    // UseState de l'url pour les requêtes Fetch
    const [url, definirUrl] = useState("");
    // UseState de l'objet init pour les requêtes Fetch
    const [fetchParamObjet, definirFetchParamObjet] = useState({});
    // UseState pour le déclenchement de la création d'un message
    const [donneesCreationMessage, definirDonneesCreationMessage] = useState({});
    // UseState des informations sur la requête
    const [infoFetch, definirInfoFetch] = useState({
        typeFetch: {},
        donneesMessage: "",
        alerteMessage: "",
        erreurMessage: "",
    });

    // Hook personnalisé pour effectuer les requêtes fetch
    const { donnees, enChargement, erreur } = useFetch(url, fetchParamObjet, infoFetch);

    // Déclanchement de la requête pour la création d'un message
    useEffect(() => {
        if (titre.valide && texte.valide && image.valide) {
            // Condition pour lancement de la requête
            // Mais true à l'initialisation de la page pour ne pas avoir les messages à l'initial
            if (
                donneesCreationMessage.hasOwnProperty("titre") &&
                donneesCreationMessage.titre !== "" &&
                donneesCreationMessage.hasOwnProperty("content") &&
                donneesCreationMessage.content !== "" &&
                donneesCreationMessage.hasOwnProperty("imageUrl") &&
                donneesCreationMessage.content !== undefined
            ) {
                // Récupération du token
                const token = identificationType.token;

                definirUrl(`http://localhost:4000/api/posts`);

                // Creation du 'init' avec multipart/form-data 'formData' pour le Content-type
                const formData = new FormData();
                formData.append("image", donneesCreationMessage.imageUrl);
                formData.append(
                    "post",
                    JSON.stringify({
                        titre: donneesCreationMessage.titre,
                        content: donneesCreationMessage.content,
                    })
                );

                definirFetchParamObjet({
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                definirInfoFetch({
                    typeFetch: {
                        type: "MessageCreation",
                    },
                    donneesMessage: "Création du message terminée",
                    alerteMessage: "Création du message : ",
                    erreurMessage: "Erreur pour la création du message : [ ",
                });
            }
        } else {
            alert("Contenu des champs Titre, Texte et/ou Image inadéquat !");
        }
    }, [donneesCreationMessage]);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        // Fetch de création
        if (donnees.hasOwnProperty("message")) {
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
        // Fetch de getAllMessages
        if (donnees.length > 0) {
            definirListeMessages(donnees);
            definirCreationMessageActive(false);
        }
    }, [donnees]);

    // Erreur lors d'une requête Fetch
    if (erreur) {
        return <span>Oups il y a eu un problème</span>;
    }

    const { titre, texte, image } = creationDonnees;

    return enChargement ? (
        <Chargement />
    ) : (
        <MessageForm theme={theme} enctype="multipart/form-data">
            <StyledTitle theme={theme}>Création d'un message</StyledTitle>
            <MessageFieldset>
                <StyledLegend theme={theme}>Contenu :</StyledLegend>
                <FormInput id="titre" state={creationDonnees} majState={definirCreationDonnees} />
                <FormInput id="texte" state={creationDonnees} majState={definirCreationDonnees} />
            </MessageFieldset>
            <MessageFieldset>
                <StyledLegend theme={theme}>Illustration :</StyledLegend>
                <FormInput id="image" state={creationDonnees} majState={definirCreationDonnees} />
            </MessageFieldset>
            <MessageButtons
                definirCreationMessageActive={definirCreationMessageActive}
                definirDonneesCreationMessage={definirDonneesCreationMessage}
                creationDonnees={creationDonnees}
            />
        </MessageForm>
    );
};

export default MessageCreation;
