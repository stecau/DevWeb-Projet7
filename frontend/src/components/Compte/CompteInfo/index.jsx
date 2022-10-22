/*-----------------------------------------------------------------------------------------------*/
/* Définition du composant 'CompteInfo' pour notre application React 'app' pour notre FrontEnd : */
/*-----------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../../utils/style/couleurs";
/* Importation de notre style spécifique de lien */
import { StyleLink } from "../../../utils/style/Atomes";

/* Importation de nos Hooks 'useTheme' et 'useIdentification' */
import { useTheme, useIdentification } from "../../../utils/hooks";

const CompteMain = styled.main`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 200px;
`;

const StyledTitleH2 = styled.h2`
    max-width: 600px;
    color: ${({ theme }) => (theme === "clair" ? couleurs.fontClair : couleurs.fontSombre)};
`;

const StyledText = styled.p`
    margin: 0;
    padding: 0;
    color: ${({ theme }) => (theme === "clair" ? couleurs.fontClair : couleurs.fontSombre)};
`;

const CompteInfo = () => {
    const { theme } = useTheme();
    const { majIdentificationType } = useIdentification();

    // Gestionnaire pour la mise à jour du type de connexion (connexion ou création)
    const gestionModificationIdentificationType = (type) => {
        majIdentificationType(
            {
                type: type,
                email: "Inconnu",
            },
            true
        );
    };

    return (
        <CompteMain>
            <StyledTitleH2 theme={theme}>Aucune information disponible</StyledTitleH2>
            <StyledText theme={theme}>Veuillez-vous connecter ou créer un compte pour visualiser vos informations.</StyledText>
            <StyleLink to="/connexion" $styleCreation theme={theme} onClick={() => gestionModificationIdentificationType("connexion")}>
                Connexion
            </StyleLink>
            <StyleLink to="/connexion" $styleCreation theme={theme} onClick={() => gestionModificationIdentificationType("creation")}>
                Créer un compte
            </StyleLink>
        </CompteMain>
    );
};

export default CompteInfo;
