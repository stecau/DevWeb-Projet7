/*--------------------------------------------------------------------------------------------*/
/* Définition du composant 'Message' pour notre application React 'app' pour notre FrontEnd : */
/*--------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../../utils/style/couleurs";
/* Importation de notre style spécifique de lien */
import { StyleButton } from "../../../utils/style/Atomes";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* importation de notre conposant 'MessageModification' */
import ButtonAvis from "../ButtonAvis";
/* importation de notre conposant 'MessageModification' */
//import MessageModification from "../MessageModification";
import MessageForm from "../MessageForm";
/* importation de notre conposant 'MessageSuppression' */
import MessageSuppression from "../MessageSuppression";

/* importation du hook 'useContext' de React */
import { useContext, useState, useEffect } from "react";

/* Importation de nos Hooks 'useTheme' */
import { useTheme } from "../../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../../utils/context";

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
    color: ${({ theme }) => (theme === "clair" ? couleurs.primaire : couleurs.secondaire)};
`;

const StyledContent = styled.p`
    margin: 16px 0;
    color: ${({ theme }) => (theme === "clair" ? couleurs.fontClair : couleurs.fontSombre)};
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

const Message = ({ message, definirListeMessages, modificationMessageActive, definirModificationMessageActive }) => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // Identification pour la gestion du statut de connexion et de l'email + id de l'utilisateur connecté
    const { identificationType } = useContext(ConnexionContext);

    // UseState du retour de la requête sur un message avec son id
    const [appMessage, obtenirAppMessage] = useState({});
    // UseState pour identifier si le message est aimé, adoré ou créé par l'utilisateur connecté
    const [estUtilisateur, definirEstUtilisateur] = useState({
        aime: false,
        adore: false,
        createur: false,
    });

    // Déclenchement de l'affichage du message (initial)
    useEffect(() => {
        obtenirAppMessage(message);
        definirEstUtilisateur(() => {
            let donneesMessage = {};
            if (message.listeJaimeData.indexOf(identificationType.id) !== -1) {
                donneesMessage.aime = true;
            } else {
                donneesMessage.aime = false;
            }
            if (message.listeJadoreData.indexOf(identificationType.id) !== -1) {
                donneesMessage.adore = true;
            } else {
                donneesMessage.adore = false;
            }
            if (message._id === identificationType.id) {
                donneesMessage.createur = true;
            } else {
                donneesMessage.createur = false;
            }
            return donneesMessage;
        });
    }, [message]);

    // Déclenchement de l'affichage du message (après modification)
    useEffect(() => {
        if (appMessage.hasOwnProperty("_id") && !modificationMessageActive) {
            obtenirAppMessage(appMessage);
            definirEstUtilisateur(() => {
                let donneesMessage = {};
                if (appMessage.listeJaimeData.indexOf(identificationType.id) !== -1) {
                    donneesMessage.aime = true;
                } else {
                    donneesMessage.aime = false;
                }
                if (appMessage.listeJadoreData.indexOf(identificationType.id) !== -1) {
                    donneesMessage.adore = true;
                } else {
                    donneesMessage.adore = false;
                }
                if (appMessage.createur_id === identificationType.id) {
                    donneesMessage.createur = true;
                } else {
                    donneesMessage.createur = false;
                }
                return donneesMessage;
            });
        }
    }, [appMessage, modificationMessageActive]);

    return modificationMessageActive === appMessage._id ? (
        <MessageForm appMessage={appMessage} obtenirAppMessage={obtenirAppMessage} definirModificationMessageActive={definirModificationMessageActive} />
    ) : (
        <PostFigure>
            <Illustration isMessage src={appMessage.imageUrl} alt="Illustration du message" />
            <FigureCaption>
                <StyledTitle theme={theme}>{appMessage.titre}</StyledTitle>
                <StyledContent theme={theme}>{appMessage.content}</StyledContent>
                <ButtonContainer $width="100%">
                    <ButtonAvis appMessage={appMessage} estUtilisateur={estUtilisateur} definirEstUtilisateur={definirEstUtilisateur} />
                    {(estUtilisateur.createur || identificationType.isAdmin === 1) && (
                        <ButtonContainer $width="50%">
                            <StyleButton
                                theme={theme}
                                $estMessage
                                $estFlex
                                className="normalIcon"
                                onClick={() => {
                                    definirModificationMessageActive(appMessage._id);
                                }}
                            >
                                <FontAwesomeIcon className="normalIcon" icon="fa-regular fa-pen-to-square" />
                                <ButtonTexte>Modifier</ButtonTexte>
                            </StyleButton>
                            <MessageSuppression appMessage={appMessage} definirListeMessages={definirListeMessages} />
                        </ButtonContainer>
                    )}
                </ButtonContainer>
            </FigureCaption>
        </PostFigure>
    );
};

export default Message;
