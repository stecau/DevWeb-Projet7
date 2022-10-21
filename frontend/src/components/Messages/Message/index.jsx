/*--------------------------------------------------------------------------------------------*/
/* Définition du composant 'Message' pour notre application React 'app' pour notre FrontEnd : */
/*--------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../../utils/style/couleurs";
/* Importation de notre style spécifique de 'button' */
import { StyleButton } from "../../../utils/style/Atomes";

/* Importation des icones FontAwesome */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* importation de notre composant 'ButtonAvis' */
import ButtonAvis from "../ButtonAvis";
/* importation de notre composant 'MessageForm' */
import MessageForm from "../MessageForm";
/* importation de notre composant 'MessageSuppression' */
import MessageSuppression from "../MessageSuppression";

/* importation des hooks 'useContext', 'useState' et 'useEffect' de React */
import { useContext, useState, useEffect } from "react";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../../utils/context";

const MessageFigure = styled.figure`
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

const StyleTitre = styled.h1`
    margin: 18px 0 0 0;
    color: ${({ theme }) => (theme === "clair" ? couleurs.primaire : couleurs.secondaire)};
`;

const StyleContenu = styled.p`
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

const ButtonConteneur = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: ${({ $width }) => $width};
`;

const ButtonTexte = styled.span`
    font-size: ${({ $size }) => ($size ? $size : "12px")};
    padding-left: 5px;
`;

// Définition du composant fonction 'Message'
const Message = ({ message, definirListeMessages, modificationMessageActive, definirModificationMessageActive }) => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // Identification pour la récupération de l'id de l'utilisateur connecté
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
        definirEstUtilisateur(creationUtilisateurStatuts(message));
    }, [message]);

    // Déclenchement de l'affichage du message (après modification)
    useEffect(() => {
        if (appMessage.hasOwnProperty("_id") && !modificationMessageActive) {
            obtenirAppMessage(appMessage);
            definirEstUtilisateur(creationUtilisateurStatuts(appMessage));
        }
    }, [appMessage, modificationMessageActive]);

    // Fonction pour définir le statut de l'utilisateur par rapport aux 'Jaime', 'Jadore' et le 'createur' du message
    const creationUtilisateurStatuts = (donnees) => {
        let donneesMessage = {};
        if (donnees.listeJaimeData.indexOf(identificationType.id) !== -1) {
            donneesMessage.aime = true;
        } else {
            donneesMessage.aime = false;
        }
        if (donnees.listeJadoreData.indexOf(identificationType.id) !== -1) {
            donneesMessage.adore = true;
        } else {
            donneesMessage.adore = false;
        }
        if (donnees.createur_id === identificationType.id) {
            donneesMessage.createur = true;
        } else {
            donneesMessage.createur = false;
        }
        return donneesMessage;
    };

    return modificationMessageActive === appMessage._id ? (
        <MessageForm
            appMessage={appMessage}
            obtenirAppMessage={obtenirAppMessage}
            definirModificationMessageActive={definirModificationMessageActive}
        />
    ) : (
        <MessageFigure>
            <Illustration isMessage src={appMessage.imageUrl} alt="Illustration du message" />
            <FigureCaption>
                <StyleTitre theme={theme}>{appMessage.titre}</StyleTitre>
                <StyleContenu theme={theme}>{appMessage.content}</StyleContenu>
                <ButtonConteneur $width="100%">
                    <ButtonAvis appMessage={appMessage} estUtilisateur={estUtilisateur} definirEstUtilisateur={definirEstUtilisateur} />
                    {(estUtilisateur.createur || identificationType.isAdmin === 1) && (
                        <ButtonConteneur $width="50%">
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
                        </ButtonConteneur>
                    )}
                </ButtonConteneur>
            </FigureCaption>
        </MessageFigure>
    );
};

export default Message;
