/*---------------------------------------------------------------------------------------------------*/
/* Définition du composant 'MessageButtons' pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation de notre style spécifique de lien */
import { StyleButton } from "../../../utils/style/Atomes";

/* Importation des icones FontAwesome */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../../utils/hooks";

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

const MessageButtons = ({
    definirDonneesActionMessage,
    creationDonnees,
    definirCreationMessageActive = null,
    definirModificationMessageActive = null,
}) => {
    // Récupération des valeurs de contexte grace aux hooks personnalisés
    const { theme } = useTheme();

    // Récupération des valeurs définies dans les inputs du formulaire
    const { titre, texte, image } = creationDonnees;

    // Définition du type d'action : création ou modification d'un message
    let modification = false;
    if (definirCreationMessageActive === null) {
        modification = true;
    }

    // Gestionnaire du click sur annulation
    const gestionaireAnnulation = (event) => {
        event.preventDefault();
        if (modification) {
            definirModificationMessageActive(false);
        } else {
            definirCreationMessageActive(false);
        }
    };

    // Gestionnaire du click sur 'validation'
    const gestionnaireValidation = (event) => {
        event.preventDefault();
        if (titre.valeur === "") titre.valide = false;
        if (texte.valeur === "") texte.valide = false;
        if (image.valeur === undefined) image.valide = false;
        definirDonneesActionMessage({
            titre: titre.valeur,
            content: texte.valeur,
            imageUrl: image.valeur,
        });
    };

    return (
        <ButtonContainer $width="100%">
            <StyleButton theme={theme} $estMessage $estJaime $estFlex onClick={gestionnaireValidation}>
                <FontAwesomeIcon className={"normalJaime"} icon="fa-solid fa-envelope-circle-check" />
                <ButtonTexte>{modification ? "Modifier" : "Envoyer"}</ButtonTexte>
            </StyleButton>
            <StyleButton theme={theme} $estMessage $estJaime $estFlex onClick={gestionaireAnnulation}>
                <FontAwesomeIcon className={"normalJadore"} icon="fa-regular fa-circle-left" />
                <ButtonTexte>Annuler</ButtonTexte>
            </StyleButton>
        </ButtonContainer>
    );
};

export default MessageButtons;
