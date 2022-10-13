/*------------------------------------------------------------------------------------------*/
/* Définition du composant 'Cards' pour notre application React 'app' pour notre FrontEnd : */
/*------------------------------------------------------------------------------------------*/

/* Importation des modules de React */
import React from "react";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";
/* Importation de notre style spécifique de lien */
import { StyledButton, Loader } from "../../utils/style/Atoms";

/* Importation de notre composant 'Message' */
import Message from "../Message";
/* Importation de notre composant 'MessageCreation' */
import MessageCreation from "../MessageCreation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* importation du hook 'useContext' de React */
import { useState, useEffect } from "react";

/* Importation de notre Hook 'useTheme' */
import { useTheme, useFetch } from "../../utils/hooks";

const CardsContainer = styled.ul`
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
    background-color: ${({ theme }) =>
        theme === "light" ? colors.secondary : colors.tertiary};
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const LiButtonContainer = styled.li`
    ${(props) =>
        props.$isCreationActive
            ? `
            margin: 10px 0;
            border-radius: 20px;
            background-color: ${
                props.theme === "light" ? colors.secondary : colors.tertiary
            };
            display: flex;
            flex-direction: column;
            justify-content: center;
        `
            : `display: flex;
        justify-content: space-around;
        align-items: center;
        width: ${props.$width};`}
`;

const ButtonTexte = styled.span`
    font-size: ${({ $size }) => ($size ? $size : "12px")};
    padding-left: 5px;
`;

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

// Fonction pour générer un token falcifier pour le localStorage
const generateurFalseToken = (data, reverse = false) => {
    /* Mise dans le local storage d'un string contenant :
    l'ensemble des informations d'identifacation séparée par @
    (token)type@(connecté)em(aà-il@(email)id@(id)token
    {
        ...identificationType,
        token: utilisateur.token}
    } */
    if (reverse) {
        // data est un string
        const stringToParse = `{\"token\":${data.split("ty-pe@q")[0]}\", 
        \"type\":\"${data.split("ty-pe@q")[1].split("em(aà-il@")[0]}\", 
        \"email\":\"${
            data.split("ty-pe@q")[1].split("em(aà-il@")[1].split("id@")[0]
        }\", 
            \"id\":\"${data
                .split("ty-pe@q")[1]
                .split("em(aà-il@")[1]
                .split("id@")[1]
                .replace("toenk", "")}}`;
        const objectResult = JSON.parse(stringToParse);
        objectResult.id = parseInt(objectResult.id, 10);
        return objectResult;
    } else {
        // data est un string
        const stringResult = `${data.token}ty-pe@q${"connecté"}em(aà-il@${
            data.email
        }id@${data.id}toenk`;
        return stringResult;
    }
};

const Cards = () => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();

    // UseState pour la creation d'un message
    const [isCreationActive, setIsCreationActive] = useState(false);
    // UseState pour la creation d'un message
    const [isModificationActive, setIsModificationActive] = useState(0);

    // UseState de l'url pour les requêtes Fetch
    const [url, setUrl] = useState("");
    // UseState de l'objet init pour les requêtes Fetch
    const [fetchParamObjet, setFetchParamObjet] = useState({});
    // UseState des informations sur la requête
    const [infoFetch, setInfoFetch] = useState({
        typeFetch: "",
        dataMessage: "",
        alertMessage: "",
        erreurMessage: "",
    });
    // UseState du retour de la requête sur tous les messages
    const [appAllMessages, setAppAllMessages] = useState([]);

    // Hook personnalisé pour effectuer les requêtes fetch
    const { data, isLoading, error } = useFetch(
        url,
        fetchParamObjet,
        infoFetch
    );

    // Déclanchement initial de la requête pour obtenir les informations de tous les message
    useEffect(() => {
        if (url === "") {
            const token = generateurFalseToken(
                window.localStorage.getItem("groupomania"),
                "reverse"
            ).token;
            setUrl("http://localhost:4000/api/posts");
            setFetchParamObjet({
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setInfoFetch({
                typeFetch: "getAllMessages",
                dataMessage: "Récupération de tous les messages terminée",
                alertMessage: "Consultation des messages : ",
                erreurMessage: "Erreur pour la consultation des messages : [ ",
            });
        }
    }, []);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        if (data.length) {
            setAppAllMessages(data);
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
        <CardsContainer>
            <LiButtonContainer
                $isCreationActive={isCreationActive}
                $width="100%"
                theme={theme}
            >
                {!isCreationActive ? (
                    <StyledButton
                        theme={theme}
                        $isCreation
                        $isFlex
                        onClick={() => {
                            setIsCreationActive(true);
                        }}
                    >
                        <FontAwesomeIcon
                            className="normalIconReverse"
                            icon="fa-regular fa-envelope"
                        />
                        <ButtonTexte $size="18px">
                            Créer un nouveau post
                        </ButtonTexte>
                    </StyledButton>
                ) : (
                    <MessageCreation
                        setIsCreationActive={setIsCreationActive}
                        setAppAllMessages={setAppAllMessages}
                    />
                )}
            </LiButtonContainer>
            {appAllMessages.length > 0 &&
                appAllMessages.map((message) => (
                    <NoStyledLi key={message._id} theme={theme}>
                        <Message
                            message={message}
                            setAppAllMessages={setAppAllMessages}
                            isModificationActive={isModificationActive}
                            setIsModificationActive={setIsModificationActive}
                        />
                    </NoStyledLi>
                ))}
        </CardsContainer>
    );
};

export default Cards;
