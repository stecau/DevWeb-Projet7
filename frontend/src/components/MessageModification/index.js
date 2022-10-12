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

const MessageModification = ({
    appMessage,
    setAppMessage,
    setIsModificationActive,
}) => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();

    // UseState pour récupérer l'image du message
    const [imageValue, setImageValue] = useState(undefined);
    // UseState pour récupérer le titre du message
    const [titreValue, setTitreValue] = useState("");
    // UseState pour récupérer le texte du message
    const [texteValue, setTexteValue] = useState("");

    // UseState d'affichage du block suppression image
    const [showButtonContainer, setShowButtonContainer] = useState(false);

    // UseState de l'url pour les requêtes Fetch
    const [url, setUrl] = useState("");
    // UseState de l'objet init pour les requêtes Fetch
    const [fetchParamObjet, setFetchParamObjet] = useState({});
    // UseState pour le déclenchement de la création d'un message
    const [dataModificationMessage, setDataModificationMessage] = useState({});
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

    // Déclenchement de l'affichage des informations du message (initial)
    useEffect(() => {
        setTitreValue(appMessage.titre);
        setTexteValue(appMessage.content);
        setImageValue(appMessage.imageUrl);
        console.log("appMessage.imageUrl", appMessage.imageUrl);
        if (appMessage.imageUrl !== null) {
            console.log("modif show button container = true");
            setShowButtonContainer(true);
        } else {
            setImageValue(undefined);
        }
    }, []);

    // Déclanchement de la requête pour la modification d'un message
    useEffect(() => {
        if (
            dataModificationMessage.hasOwnProperty("titre") &&
            dataModificationMessage.hasOwnProperty("content") &&
            dataModificationMessage.hasOwnProperty("imageUrl")
        ) {
            // Récupération du token
            const token = JSON.parse(
                window.localStorage.getItem("groupomania")
            );
            // Modification de la valeur de imageUrl si undefined
            if (dataModificationMessage.imageUrl === undefined) {
                dataModificationMessage.imageUrl = null;
            }
            setUrl(`http://localhost:4000/api/posts/${appMessage._id}`);
            // Gestion si creation avec un fichier image ou pas (multiform ou json)
            console.log(dataModificationMessage.imageUrl);
            console.log(typeof dataModificationMessage.imageUrl);
            if (
                typeof dataModificationMessage.imageUrl === "object" &&
                dataModificationMessage.imageUrl != null
            ) {
                console.log("Avec Image");
                // Creation du 'init' avec multipart/form-data 'formData' pour le Content-type
                const formData = new FormData();
                formData.append("image", dataModificationMessage.imageUrl);
                formData.append(
                    "post",
                    JSON.stringify({
                        titre: dataModificationMessage.titre,
                        content: dataModificationMessage.content,
                    })
                );
                setFetchParamObjet({
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
            } else {
                console.log("Sans Image");
                // Création du 'init' avec JSON (Content-Type": "application/json" et body JSON.stringify)
                setFetchParamObjet({
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(dataModificationMessage),
                });
            }
            setInfoFetch({
                typeFetch: {
                    type: "MessageModification",
                },
                dataMessage: "Modification du message terminée",
                alertMessage: "Modification du message : ",
                erreurMessage: "Erreur pour la modification du message : [ ",
            });
        }
    }, [dataModificationMessage]);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        // Fetch de modification
        if (data.hasOwnProperty("message")) {
            if (data.message === "Message modifié") {
                // Fetch pour actualisation du message
                // Mise à jour de appMessage avec une requête get le message
                const token = JSON.parse(
                    window.localStorage.getItem("groupomania")
                );
                setUrl(`http://localhost:4000/api/posts/${appMessage._id}`);
                setFetchParamObjet({
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                setInfoFetch({
                    typeFetch: {
                        type: "getMessage",
                    },
                    dataMessage: "Récupération du message terminée",
                    alertMessage: "Consultation du message : ",
                    erreurMessage:
                        "Erreur pour la consultation du message : [ ",
                });
            }
        }
        // Fetch de modification
        if (data.hasOwnProperty("_id")) {
            setAppMessage(data);
            setIsModificationActive(0);
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
        <MessageForm theme={theme}>
            <StyledTitle theme={theme}>Modification d'un message</StyledTitle>
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
                <label htmlFor="texte">Texte</label>
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
                {showButtonContainer && typeof imageValue === "string" && (
                    <div>
                        <label htmlFor="suppression">
                            Supprimer l'image du message uniquement :
                        </label>
                        <ButtonContainer $width="100%">
                            <p>
                                {imageValue !== undefined &&
                                typeof imageValue === "string"
                                    ? imageValue.split("/images/")[1]
                                    : imageValue.name}
                            </p>
                            <StyledButton
                                theme={theme}
                                $isCard
                                $isFlex
                                onClick={(e) => {
                                    e.preventDefault();
                                    setImageValue(undefined);
                                    const inputSelectionFile =
                                        document.getElementById("image");
                                    inputSelectionFile.type = "text";
                                    inputSelectionFile.type = "file";
                                    setShowButtonContainer(false);
                                }}
                            >
                                <FontAwesomeIcon
                                    className={"normalIconRed"}
                                    icon="fa-regular fa-circle-xmark"
                                />
                            </StyledButton>
                        </ButtonContainer>
                        <p>----- OU -----</p>
                    </div>
                )}
                <label htmlFor="image">
                    Choisir une image pour{" "}
                    {showButtonContainer && "un remplacement d'image dans"} le
                    message (facultatif) :
                </label>
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
                    $isFlex
                    $isLike
                    onClick={(e) => {
                        e.preventDefault();
                        setDataModificationMessage({
                            titre: titreValue,
                            content: texteValue,
                            imageUrl: imageValue,
                        });
                    }}
                >
                    <FontAwesomeIcon
                        className={"normalIcon"}
                        icon="fa-solid fa-envelope-circle-check"
                    />
                    <ButtonTexte>Modifier</ButtonTexte>
                </StyledButton>
                <StyledButton
                    theme={theme}
                    $isCard
                    $isFlex
                    $isLike
                    onClick={(e) => {
                        e.preventDefault();
                        setIsModificationActive(0);
                    }}
                >
                    <FontAwesomeIcon
                        className={"normalIcon"}
                        icon="fa-regular fa-circle-left"
                    />
                    <ButtonTexte>Annuler</ButtonTexte>
                </StyledButton>
            </ButtonContainer>
        </MessageForm>
    );
};

export default MessageModification;
