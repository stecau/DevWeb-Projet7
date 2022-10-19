/*------------------------------------------------------------------------------------------------------*/
/* Définition du composant CreationOuConnexion pour notre application React 'app' pour notre FrontEnd : */
/*------------------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../../utils/style/couleurs";
/* Importation de notre style spécifique de lien */
import { StyleLink } from "../../../utils/style/Atomes";

/* Importation de nos Hooks 'useTheme' et 'useIdentification' */
import { useTheme, useIdentification } from "../../../utils/hooks";

const StyleTitreH2 = styled.h2`
    max-width: 350px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "clair" ? couleurs.fontClair : couleurs.fontSombre};
`;

const BasculementCreation = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

// Définition du composant (fonction) 'CreationOuConnexion'
const CreationOuConnexion = () => {
    // Récupération de la valeur du theme avec le hook 'useTheme'
    const { theme } = useTheme();
    // Récupération du type de connexion et de la fonction de mise à jour avec le hook 'useIdentification'
    const { identificationType, majIdentificationType } = useIdentification();

    // Définition du gestionnaire de click pour le lien
    const gestionClickLien = () => {
        let type = "creation";
        if (identificationType.type !== "connexion") {
            type = "connexion";
        }
        console.log("<----- CONNEXION ----->");
        console.log(
            " => Click sur bouton pour affichage création commpte ou affichage connexion"
        );
        majIdentificationType(
            {
                type: type,
            },
            true
        );
    };

    // Affichage du texte du titre en fonction du type de connexion
    const TexteTitreH2 = () => {
        if (identificationType.type === "connexion") {
            return "Ou créez votre compte";
        } else {
            return "";
        }
    };

    // Affichage du texte du lien en fonction du type de connexion
    const TexteLien = () => {
        if (identificationType.type === "connexion") {
            return "Créer un compte";
        } else {
            return "J'ai déjà un compte";
        }
    };

    return (
        <BasculementCreation>
            <StyleTitreH2 theme={theme}>{TexteTitreH2()}</StyleTitreH2>
            <StyleLink
                to="/connexion"
                $styleCreation
                theme={theme}
                onClick={gestionClickLien}
            >
                {TexteLien()}
            </StyleLink>
        </BasculementCreation>
    );
};

export default CreationOuConnexion;
