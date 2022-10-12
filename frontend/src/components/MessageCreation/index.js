/*----------------------------------------------------------------------------------------------------*/
/* Définition du composant 'MessageCreation' pour notre application React 'app' pour notre FrontEnd : */
/*----------------------------------------------------------------------------------------------------*/

/* Importation des modules de React */
import React from "react";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";
/* Importation de notre style spécifique de lien */
import { StyledButton, Loader } from "../../utils/style/Atoms";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* importation du hook 'useContext' de React */
import { useState, useEffect } from "react";

/* Importation de notre Hook 'useTheme' */
import { useTheme, useFetch } from "../../utils/hooks";

const MessageForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
    padding: 10px;
    color: ${({ theme }) =>
        theme === "light" ? colors.tertiary : colors.secondary};
`;

const MessageFieldset = styled.fieldset`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledLegend = styled.legend`
    border-color: ${({ theme }) =>
        theme === "light" ? colors.tertiary : colors.secondary};
`;

const StyledTitle = styled.h1`
    margin: 10px 0;
    color: ${({ theme }) =>
        theme === "light" ? colors.primary : colors.secondary};
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: ${({ $width }) => $width};
`;

const ButtonTexte = styled.span`
    font-size: ${({ $size }) => ($size ? $size : "12px")};
    padding-left: 5px;
`;

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const MessageCreation = ({ setIsCreationActive, setAppAllMessages }) => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();

    // UseState pour récupérer l'image du message
    const [imageValue, setImageValue] = useState(undefined);
    // UseState pour récupérer le titre du message
    const [titreValue, setTitreValue] = useState("");
    // UseState pour récupérer le texte du message
    const [texteValue, setTexteValue] = useState("");

    // UseState de l'url pour les requêtes Fetch
    const [url, setUrl] = useState("");
    // UseState de l'objet init pour les requêtes Fetch
    const [fetchParamObjet, setFetchParamObjet] = useState({});
    // UseState pour le déclenchement de la création d'un message
    const [dataCreationMessage, setDataCreationMessage] = useState({});
    // UseState des informations sur la requête
    const [infoFetch, setInfoFetch] = useState({
        typeFetch: {},
        dataMessage: "",
        alertMessage: "",
        erreurMessage: "",
    });

    // Hook personnalisé pour effectuer les requêtes fetch
    const { data, isLoading, error } = useFetch(
        url,
        fetchParamObjet,
        infoFetch
    );

    // Déclanchement de la requête pour la création d'un message
    useEffect(() => {
        console.log("dataCreationMessage", dataCreationMessage);
        if (
            dataCreationMessage.hasOwnProperty("titre") &&
            dataCreationMessage.hasOwnProperty("content")
        ) {
            // Récupération du token
            const token = JSON.parse(
                window.localStorage.getItem("groupomania")
            );
            setUrl(`http://localhost:4000/api/posts`);
            // Gestion si creation avec un fichier image ou pas (multiform ou json)
            if (imageValue !== undefined) {
                console.log("Avec Image");
                // Creation du 'init' avec multipart/form-data 'formData' pour le Content-type
                const formData = new FormData();
                formData.append("image", dataCreationMessage.imageUrl);
                formData.append(
                    "post",
                    JSON.stringify({
                        titre: dataCreationMessage.titre,
                        content: dataCreationMessage.content,
                    })
                );

                setFetchParamObjet({
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                console.log("Sans Image");
                // Création du 'init' avec JSON (Content-Type": "application/json" et body JSON.stringify)
                setFetchParamObjet({
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(dataCreationMessage),
                });
            }
            setInfoFetch({
                typeFetch: {
                    type: "MessageCreation",
                },
                dataMessage: "Création du message terminée",
                alertMessage: "Création du message : ",
                erreurMessage: "Erreur pour la création du message : [ ",
            });
        }
    }, [dataCreationMessage]);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        // Fetch de création
        if (data.hasOwnProperty("message")) {
            // Mise à jour de appAllMessages avec une requête get sur tous les messages
            const token = JSON.parse(
                window.localStorage.getItem("groupomania")
            );
            setUrl(`http://localhost:4000/api/posts`);
            setFetchParamObjet({
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setInfoFetch({
                typeFetch: {
                    type: "getAllMessage",
                },
                dataMessage: "Récupération de tous les messages terminée",
                alertMessage: "Consultation de tous les messages : ",
                erreurMessage:
                    "Erreur pour la consultation de tous les messages : [ ",
            });
        }
        // Fetch de getAllMessages
        if (data.length > 0) {
            setAppAllMessages(data);
            setIsCreationActive(false);
        }
    }, [data]);

    // Erreur lors d'une requête Fetch
    if (error) {
        return <span>Oups il y a eu un problème</span>;
    }

    return isLoading ? (
        <LoaderWrapper>
            <Loader />
        </LoaderWrapper>
    ) : (
        <MessageForm theme={theme} enctype="multipart/form-data">
            <StyledTitle theme={theme}>Création d'un message</StyledTitle>
            <MessageFieldset>
                <StyledLegend theme={theme}>Contenu :</StyledLegend>
                <label htmlFor="titre">Titre :</label>
                <input
                    type="text"
                    id="titre"
                    value={titreValue}
                    placeholder="Votre titre ici"
                    required
                    onChange={(e) => {
                        setTitreValue(e.target.value);
                    }}
                ></input>
                <label htmlFor="texte">Texte :</label>
                <textarea
                    type="text"
                    id="texte"
                    value={texteValue}
                    placeholder="Votre texte ici"
                    required
                    onChange={(e) => {
                        setTexteValue(e.target.value);
                    }}
                ></textarea>
            </MessageFieldset>
            <MessageFieldset>
                <StyledLegend theme={theme}>Illustration :</StyledLegend>
                <label htmlFor="image">Image (facultative) :</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={(e) => {
                        setImageValue(e.target.files[0]);
                    }}
                ></input>
            </MessageFieldset>
            <ButtonContainer $width="100%">
                <StyledButton
                    theme={theme}
                    $isCard
                    $isLike
                    $isFlex
                    onClick={(e) => {
                        e.preventDefault();
                        setDataCreationMessage({
                            titre: titreValue,
                            content: texteValue,
                            imageUrl: imageValue,
                        });
                    }}
                >
                    <FontAwesomeIcon
                        className={"normalLike"}
                        icon="fa-solid fa-envelope-circle-check"
                    />
                    <ButtonTexte>Envoyer</ButtonTexte>
                </StyledButton>
                <StyledButton
                    theme={theme}
                    $isCard
                    $isLike
                    $isFlex
                    onClick={(e) => {
                        e.preventDefault();
                        setIsCreationActive(false);
                    }}
                >
                    <FontAwesomeIcon
                        className={"normalDislike"}
                        icon="fa-regular fa-circle-left"
                    />
                    <ButtonTexte>Annuler</ButtonTexte>
                </StyledButton>
            </ButtonContainer>
        </MessageForm>
    );
};

export default MessageCreation;
