/*--------------------------------------------------------------------------------------------*/
/* Définition du composant 'Message' pour notre application React 'app' pour notre FrontEnd : */
/*--------------------------------------------------------------------------------------------*/

/* Importation des modules de React */
import React from "react";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";
/* Importation de notre style spécifique de lien */
import { StyledButton, Loader } from "../../utils/style/Atoms";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* importation de notre conposant 'MessageModification' */
import MessageModification from "../MessageModification";

/* importation du hook 'useContext' de React */
import { useContext, useState, useEffect } from "react";

/* Importation de notre Hook 'useTheme' */
import { useTheme, useFetch } from "../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../utils/context";

const PostFigure = styled.figure`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
    padding: 10px;
`;

const FigureCaption = styled.figcaption`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledTitle = styled.h1`
    margin: 18px 0 0 0;
    color: ${({ theme }) =>
        theme === "light" ? colors.primary : colors.secondary};
`;

const StyledContent = styled.p`
    margin: 16px 0;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
    white-space: pre-wrap;
`;

const Illustration = styled.img`
    max-height: 500px;
    width: 100%;
    object-fit: contain;
    border-radius: 15px;
    ${({ isMessage }) =>
        !isMessage &&
        `flex: 1;
        width: 50%;`};
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

const Message = ({
    message,
    setAppAllMessages,
    isModificationActive,
    setIsModificationActive,
}) => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // Identification pour la gestion du statut de connexion et de l'email + id de l'utilisateur connecté
    const { identificationType } = useContext(ConnexionContext);

    // UseState de l'url pour les requêtes Fetch
    const [url, setUrl] = useState("");
    // UseState de le suppression de message pour les requêtes Fetch
    const [suppressionMessage, setSuppressionMessage] = useState(false);
    // UseState de l'objet init pour les requêtes Fetch
    const [fetchParamObjet, setFetchParamObjet] = useState({});
    // UseState du statut de modification de like/dislike sur les messages
    const [likeForMessage, setLikeForMessage] = useState({});
    // UseState des informations sur la requête
    const [infoFetch, setInfoFetch] = useState({
        typeFetch: {},
        dataMessage: "",
        alertMessage: "",
        erreurMessage: "",
    });
    // UseState du retour de la requête sur un message avec son id
    const [appMessage, setAppMessage] = useState({});
    // UseState du retour de la requête sur un message avec un like (nbrLike)
    const [appNbrLike, setAppNbrLike] = useState({});
    // UseState du retour de la requête sur un message avec un dislike (nbrDislike)
    const [appNbrDislike, setAppNbrDislike] = useState({});
    // UseState du retour de la requête sur un message avec un like (listeLikesData)
    const [appListeLikesData, setAppListeLikesData] = useState({});
    // UseState du retour de la requête sur un message avec un dislike (listeDislikesData)
    const [appListeDislikesData, setAppListeDislikesData] = useState({});

    // Hook personnalisé pour effectuer les requêtes fetch
    const { data, isLoading, error } = useFetch(
        url,
        fetchParamObjet,
        infoFetch
    );

    // Déclenchement de l'affichage du message (initial)
    useEffect(() => {
        setAppMessage(message);
        setAppNbrLike(message.nbrLikes);
        setAppNbrDislike(message.nbrDislikes);
        setAppListeLikesData(message.listeLikesData);
        setAppListeDislikesData(message.listeDislikesData);
    }, [message]);

    // Déclenchement de l'affichage du message (après modification)
    useEffect(() => {
        if (appMessage.hasOwnProperty("_id") && !isModificationActive) {
            setAppMessage(appMessage);
            setAppNbrLike(appMessage.nbrLikes);
            setAppNbrDislike(appMessage.nbrDislikes);
            setAppListeLikesData(appMessage.listeLikesData);
            setAppListeDislikesData(appMessage.listeDislikesData);
        }
    }, [appMessage, isModificationActive]);

    // Déclanchement de la requête pour un like/dislike ou annulation sur message
    useEffect(() => {
        if (likeForMessage.hasOwnProperty("id")) {
            const token = identificationType.token;
            setUrl(`http://localhost:4000/api/posts/${likeForMessage.id}/like`);
            setFetchParamObjet({
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: `{"like": ${likeForMessage.like}}`,
            });
            setInfoFetch({
                typeFetch: {
                    type: "setLike",
                    like: likeForMessage.like,
                    button: likeForMessage.button,
                },
                dataMessage:
                    "Affectation/annulation d'un like/dislike terminée",
                alertMessage: "Affectation/annulation d'un like/dislike : ",
                erreurMessage:
                    "Erreur pour l'affectation/annulation d'un like/dislike : [ ",
            });
        }
    }, [likeForMessage]);

    // Déclanchement de la requête pour une suppression de message
    useEffect(() => {
        if (suppressionMessage) {
            const token = identificationType.token;
            setUrl(`http://localhost:4000/api/posts/${appMessage._id}`);
            setFetchParamObjet({
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setInfoFetch({
                typeFetch: {
                    type: "deleteMessage",
                },
                dataMessage: "Suppression du message terminée",
                alertMessage: "Suppression du message : ",
                erreurMessage: "Erreur pour la suppression du message : [ ",
            });
        }
    }, [suppressionMessage, appMessage]);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        // Fetch de like
        if (data.hasOwnProperty("message")) {
            if (
                data.message === "Nouveau like enregistré" ||
                data.message === "Like supprimé"
            ) {
                // Mise à jour de appMessage avec une requête get sur le message
                const token = identificationType.token;
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
                        type: "getMessageWithIdForLike",
                        like: infoFetch.typeFetch.like,
                        button: infoFetch.typeFetch.button,
                    },
                    dataMessage: "Récupération du message terminée",
                    alertMessage: "Consultation du message : ",
                    erreurMessage:
                        "Erreur pour la consultation du message : [ ",
                });
            }
        }
        // Fetch sur un message avec son id
        if (data.hasOwnProperty("_id")) {
            if (infoFetch.typeFetch.type === "getMessageWithIdForLike") {
                if (infoFetch.typeFetch.button === "like") {
                    setAppNbrLike(data.nbrLikes);
                    setAppListeLikesData(data.listeLikesData);
                }
                if (infoFetch.typeFetch.button === "dislike") {
                    setAppNbrDislike(data.nbrDislikes);
                    setAppListeDislikesData(data.listeDislikesData);
                }
            }
        }
        // Fetch sur la suppression d'un message avec son id
        if (data.hasOwnProperty("message")) {
            if (data.message === "Message supprimé") {
                // Mise à jour de appAllMessages avec une requête get sur tous les messages
                const token = identificationType.token;
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
        }
        // Fetch sur récupération de tous les messages
        if (data.length) {
            setAppAllMessages(data);
        }
    }, [data]);

    // Erreur lors d'une requête Fetch
    if (error || !appMessage.hasOwnProperty("_id")) {
        return <span>Oups il y a eu un problème</span>;
    }

    // Fonction pour identifier si le message est liké, disliké ou créé par l'utilisateur connecté
    const isMessage = (type, data) => {
        let dataMessage = {};
        if (type === "like") {
            if (data.indexOf(identificationType.id) !== -1) {
                dataMessage.like = true;
            } else {
                dataMessage.like = false;
            }
        }
        if (type === "dislike") {
            if (data.indexOf(identificationType.id) !== -1) {
                dataMessage.dislike = true;
            } else {
                dataMessage.dislike = false;
            }
        }
        if (type === "id") {
            if (data === identificationType.id) {
                dataMessage.createur = true;
            } else {
                dataMessage.createur = false;
            }
        }
        return dataMessage;
    };

    // Fonction pour déterminer la valeur du like (-1, 0, 1)
    const defineLikeForMessage = (listeLike, listeDislike, likeValue) => {
        if (
            likeValue === 1 &&
            !isMessage("like", listeLike).like &&
            !isMessage("dislike", listeDislike).dislike
        ) {
            setLikeForMessage({
                id: message._id,
                like: likeValue,
                button: "like",
            });
            return;
        }
        if (
            likeValue === -1 &&
            !isMessage("dislike", listeDislike).dislike &&
            !isMessage("like", listeLike).like
        ) {
            setLikeForMessage({
                id: message._id,
                like: likeValue,
                button: "dislike",
            });
            return;
        }
        if (likeValue === 1 && isMessage("like", listeLike).like) {
            setLikeForMessage({ id: message._id, like: 0, button: "like" });
        } else if (
            likeValue === -1 &&
            isMessage("dislike", listeDislike).dislike
        ) {
            setLikeForMessage({ id: message._id, like: 0, button: "dislike" });
        }
    };

    return isLoading ? (
        <LoaderWrapper>
            <Loader />
        </LoaderWrapper>
    ) : isModificationActive === appMessage._id ? (
        <MessageModification
            appMessage={appMessage}
            setAppMessage={setAppMessage}
            setIsModificationActive={setIsModificationActive}
        />
    ) : (
        <PostFigure>
            <Illustration
                isMessage
                src={appMessage.imageUrl}
                alt="Illustration du message"
            />
            <FigureCaption>
                <StyledTitle theme={theme}>{appMessage.titre}</StyledTitle>
                <StyledContent theme={theme}>
                    {appMessage.content}
                </StyledContent>
                <ButtonContainer $width="100%">
                    <ButtonContainer $width="50%">
                        <StyledButton
                            theme={theme}
                            $isCard
                            $isLike
                            $isFlex
                            onClick={() =>
                                defineLikeForMessage(
                                    appListeLikesData,
                                    appListeDislikesData,
                                    1
                                )
                            }
                        >
                            <FontAwesomeIcon
                                className={
                                    isMessage("like", appListeLikesData).like
                                        ? "liked"
                                        : "normalLike"
                                }
                                icon="fa-regular fa-thumbs-up"
                            />
                            <ButtonTexte>Like : {appNbrLike}</ButtonTexte>
                        </StyledButton>
                        <StyledButton
                            theme={theme}
                            $isCard
                            $isLike
                            $isFlex
                            onClick={() =>
                                defineLikeForMessage(
                                    appListeLikesData,
                                    appListeDislikesData,
                                    -1
                                )
                            }
                        >
                            <FontAwesomeIcon
                                className={
                                    isMessage("dislike", appListeDislikesData)
                                        .dislike
                                        ? "disliked"
                                        : "normalDislike"
                                }
                                icon="fa-regular fa-thumbs-down"
                            />
                            <ButtonTexte>Dislike : {appNbrDislike}</ButtonTexte>
                        </StyledButton>
                    </ButtonContainer>
                    {(isMessage("id", appMessage.createur_id).createur ||
                        identificationType.isAdmin === 1) && (
                        <ButtonContainer $width="50%">
                            <StyledButton
                                theme={theme}
                                $isCard
                                $isFlex
                                className="normalIcon"
                                onClick={() => {
                                    setIsModificationActive(appMessage._id);
                                }}
                            >
                                <FontAwesomeIcon
                                    className="normalIcon"
                                    icon="fa-regular fa-pen-to-square"
                                />
                                <ButtonTexte>Modifier</ButtonTexte>
                            </StyledButton>
                            <StyledButton
                                theme={theme}
                                $isCard
                                $isFlex
                                className="normalIcon"
                                onClick={() => {
                                    setSuppressionMessage(true);
                                }}
                            >
                                <FontAwesomeIcon
                                    className="normalIcon"
                                    icon="fa-regular fa-trash-can"
                                />
                                <ButtonTexte>Supprimer</ButtonTexte>
                            </StyledButton>
                        </ButtonContainer>
                    )}
                </ButtonContainer>
            </FigureCaption>
        </PostFigure>
    );
};

export default Message;
