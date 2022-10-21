/*------------------------------------------------------------------------------------------------*/
/* Définition du composant 'MessageForm' pour notre application React 'app' pour notre FrontEnd : */
/*------------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../../utils/style/couleurs";

/* importation des hooks 'useState' et 'useEffect' de React */
import { useState, useEffect } from "react";

/* Importation de nos Hooks personnalisés 'useTheme', 'useFetch' et 'useIdentification' */
import { useTheme, useFetch, useIdentification } from "../../../utils/hooks";

/* Importation de notre composant 'Chargement' */
import Chargement from "../../Chargement";
/* Importation de notre composant 'FormInput' */
import FormInput from "../../FormInput";
/* Importation de notre composant 'MessageButtons' */
import MessageButtons from "../MessageButtons";

const MessageFormBloc = styled.form`
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

const MessageForm = ({
    definirCreationMessageActive = null,
    definirListeMessages = null,
    appMessage = {},
    obtenirAppMessage = null,
    definirModificationMessageActive = null,
}) => {
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
    // UseState pour le déclenchement de la création ou de la modification d'un message
    const [donneesActionMessage, definirDonneesActionMessage] = useState({});
    // UseState des informations sur la requête
    const [infoFetch, definirInfoFetch] = useState({
        typeFetch: "",
        donneesMessage: "",
        alerteMessage: "",
        erreurMessage: "",
    });

    // Hook personnalisé pour effectuer les requêtes fetch
    const { donnees, enChargement, erreur } = useFetch(url, fetchParamObjet, infoFetch);

    // Définition du type d'action : création ou modification d'un message
    let modification = false;
    if (appMessage.hasOwnProperty("_id")) {
        modification = true;
    }

    // Déclenchement de l'affichage des informations du message (initial)
    useEffect(() => {
        if (modification) {
            definirCreationDonnees({
                titre: { valeur: appMessage.titre, valide: true },
                texte: { valeur: appMessage.content, valide: true },
                image: { valeur: appMessage.imageUrl, valide: true },
            });
        }
    }, []);

    // Déclanchement de la requête pour la création ou la modification d'un message
    useEffect(() => {
        if (titre.valide && texte.valide && image.valide) {
            // Condition pour lancement de la requête
            // Mais true à l'initialisation de la page pour ne pas avoir les messages à l'initial
            if (
                donneesActionMessage.hasOwnProperty("titre") &&
                donneesActionMessage.titre !== "" &&
                donneesActionMessage.hasOwnProperty("content") &&
                donneesActionMessage.content !== "" &&
                donneesActionMessage.hasOwnProperty("imageUrl") &&
                donneesActionMessage.content !== undefined
            ) {
                // Récupération du token
                const token = identificationType.token;

                if (modification) {
                    console.log("<----- MODIFICATION MESSAGE ----->");
                    // Définition d'une requête de modification
                    definirUrl(`http://localhost:4000/api/posts/${appMessage._id}`);

                    // Gestion si creation avec un fichier image ou pas (multiform ou json) = avec ou sans changement d'image
                    if (typeof donneesActionMessage.imageUrl === "object" && donneesActionMessage.imageUrl != null) {
                        // Creation du 'init' avec multipart/form-data 'formData' pour le Content-type
                        const formData = new FormData();
                        formData.append("image", donneesActionMessage.imageUrl);
                        formData.append(
                            "post",
                            JSON.stringify({
                                titre: donneesActionMessage.titre,
                                content: donneesActionMessage.content,
                            })
                        );
                        definirFetchParamObjet({
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            body: formData,
                        });
                    } else {
                        // Création du 'init' avec JSON (Content-Type": "application/json" et body JSON.stringify)
                        definirFetchParamObjet({
                            method: "PUT",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(donneesActionMessage),
                        });
                    }

                    definirInfoFetch({
                        typeFetch: "MessageModification",
                        donneesMessage: "Modification du message terminée",
                        alerteMessage: "Modification du message : ",
                        erreurMessage: "Erreur pour la modification du message : [ ",
                    });
                } else {
                    console.log("<----- CREATION MESSAGE ----->");
                    // Définition d'une requête de création
                    definirUrl(`http://localhost:4000/api/posts`);

                    // Creation du 'init' avec multipart/form-data 'formData' pour le Content-type
                    const formData = new FormData();
                    formData.append("image", donneesActionMessage.imageUrl);
                    formData.append(
                        "post",
                        JSON.stringify({
                            titre: donneesActionMessage.titre,
                            content: donneesActionMessage.content,
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
                        typeFetch: "MessageCreation",
                        donneesMessage: "Création du message terminée",
                        alerteMessage: "Création du message : ",
                        erreurMessage: "Erreur pour la création du message : [ ",
                    });
                }
            }
        } else {
            alert("Contenu des champs Titre, Texte et/ou Image inadéquat !");
        }
    }, [donneesActionMessage]);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        // Fetch de modification ou création
        if (donnees.hasOwnProperty("message")) {
            // Fetch de modification
            if (donnees.message === "Message modifié") {
                console.log("<----- FIN MODIFICATION MESSAGE ----->");
                console.log("<----- ACTUALISATION MESSAGE MODIFIE ----->");
                // Fetch pour actualisation du message
                // Mise à jour de appMessage avec une requête get sur le message
                const token = identificationType.token;
                definirUrl(`http://localhost:4000/api/posts/${appMessage._id}`);
                definirFetchParamObjet({
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                definirInfoFetch({
                    typeFetch: "getMessage",
                    donneesMessage: "Récupération du message terminée",
                    alerteMessage: "Consultation du message : ",
                    erreurMessage: "Erreur pour la consultation du message : [ ",
                });
            }
            // Fetch de création
            if (donnees.message === "Nouveau message enregistré") {
                console.log("<----- FIN CREATION MESSAGE ----->");
                console.log("<----- ACTUALISATION DES MESSAGES ----->");
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
                    typeFetch: "getAllMessage",
                    donneesMessage: "Récupération de tous les messages terminée",
                    alerteMessage: "Consultation de tous les messages : ",
                    erreurMessage: "Erreur pour la consultation de tous les messages : [ ",
                });
            }
        }
        // Retour de Fetch après modification
        if (donnees.hasOwnProperty("_id")) {
            console.log("<----- FIN ACTUALISATION MESSAGE MODIFIE ----->");
            obtenirAppMessage(donnees);
            definirModificationMessageActive(0);
        }
        // Retour de Fetch après getAllMessages
        if (donnees.length > 0) {
            console.log("<----- FIN ACTUALISATION DES MESSAGES ----->");
            definirListeMessages(donnees);
            definirCreationMessageActive(false);
        }
    }, [donnees]);

    // Erreur lors d'une requête Fetch
    if (erreur) {
        return <span>Oups il y a eu un problème</span>;
    }

    // Récupération des données de création ou modifications pour moins de code et plus de lisibilité
    const { titre, texte, image } = creationDonnees;

    return enChargement ? (
        <Chargement />
    ) : (
        <MessageFormBloc theme={theme} enctype="multipart/form-data">
            <StyledTitle theme={theme}>{modification ? "Modification" : "Création"} d'un message</StyledTitle>
            <MessageFieldset>
                <StyledLegend theme={theme}>Contenu :</StyledLegend>
                <FormInput id="titre" state={creationDonnees} majState={definirCreationDonnees} />
                <FormInput id="texte" state={creationDonnees} majState={definirCreationDonnees} />
            </MessageFieldset>
            <MessageFieldset>
                <StyledLegend theme={theme}>Illustration :</StyledLegend>
                <FormInput id="image" state={creationDonnees} majState={definirCreationDonnees} modification={modification} />
            </MessageFieldset>
            {modification ? (
                <MessageButtons
                    definirModificationMessageActive={definirModificationMessageActive}
                    definirDonneesActionMessage={definirDonneesActionMessage}
                    creationDonnees={creationDonnees}
                />
            ) : (
                <MessageButtons
                    definirCreationMessageActive={definirCreationMessageActive}
                    definirDonneesActionMessage={definirDonneesActionMessage}
                    creationDonnees={creationDonnees}
                />
            )}
        </MessageFormBloc>
    );
};

export default MessageForm;
