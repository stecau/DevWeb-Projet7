/*---------------------------------------------------------------------------------------------------*/
/* Définition du composant 'ButtonCreation' pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../../utils/style/couleurs";
/* Importation de notre style spécifique de button */
import { StyleButton } from "../../../utils/style/Atomes";

/* Importation de notre composant 'MessageForm' */
import MessageForm from "../MessageForm";

/* Importation des icones FontAwesome */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Importation du hook 'useState' de React */
import { useState } from "react";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../../utils/hooks";

const LiButtonContaineur = styled.li`
    ${(props) =>
        props.$creationActive
            ? `
            margin: 10px 0;
            border-radius: 20px;
            background-color: ${props.theme === "clair" ? couleurs.secondaire : couleurs.tertiaire};
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

// Définition du composant fonction 'ButtonCreation'
const ButtonCreation = ({ definirListeMessages }) => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();

    // UseState pour l'affichage de la creation d'un message
    const [creationMessageActive, definirCreationMessageActive] = useState(false);

    return (
        <LiButtonContaineur $creationActive={creationMessageActive} $width="100%" theme={theme}>
            {!creationMessageActive ? (
                <StyleButton
                    theme={theme}
                    $styleCreation
                    $estFlex
                    onClick={() => {
                        definirCreationMessageActive(true);
                    }}
                >
                    <FontAwesomeIcon className="normalIconInverse" icon="fa-regular fa-envelope" />
                    <ButtonTexte $size="18px">Créer un nouveau post</ButtonTexte>
                </StyleButton>
            ) : (
                <MessageForm definirCreationMessageActive={definirCreationMessageActive} definirListeMessages={definirListeMessages} />
            )}
        </LiButtonContaineur>
    );
};

export default ButtonCreation;
