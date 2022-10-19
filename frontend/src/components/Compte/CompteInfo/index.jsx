/*---------------------------------------------------------------------------------------*/
/* Définition de la page Compte pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../../utils/style/couleurs";
/* Importation de notre style spécifique de lien */
import { StyleLink } from "../../../utils/style/Atomes";

/* Importation de notre Hook 'useTheme' */
import { useTheme, useIdentification } from "../../../utils/hooks";

const CompteSection = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 200px;
`;

const StyledTitleH2 = styled.h2`
    max-width: 600px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "clair" ? couleurs.fontClair : couleurs.fontSombre};
`;

const StyledText = styled.p`
    margin: 0;
    padding: 0;
    color: ${({ theme }) =>
        theme === "clair" ? couleurs.fontClair : couleurs.fontSombre};
`;

const CompteInfo = () => {
    const { theme } = useTheme();
    const { majIdentificationType } = useIdentification();

    return (
        <CompteSection>
            <StyledTitleH2 theme={theme}>
                Aucune information disponible
            </StyledTitleH2>
            <StyledText theme={theme}>
                Veuillez-vous connecter ou créer un compte pour visualiser vos
                informations.
            </StyledText>
            <StyleLink
                to="/connexion"
                $styleCreation
                theme={theme}
                onClick={() => {
                    console.log("<----- COMPTE DEFAULT ----->");
                    console.log(" => Click bouton pour faire une connexion");
                    majIdentificationType(
                        {
                            type: "connexion",
                            email: "Inconnu",
                        },
                        true
                    );
                    console.log("<----- ----- ----->");
                }}
            >
                Connexion
            </StyleLink>
            <StyleLink
                to="/connexion"
                $styleCreation
                theme={theme}
                onClick={() => {
                    console.log("<----- COMPTE DEFAULT ----->");
                    console.log(" => Click bouton pour faire une création");
                    majIdentificationType(
                        {
                            type: "creation",
                            email: "Inconnu",
                        },
                        true
                    );
                    console.log("<----- ----- ----->");
                }}
            >
                Créer un compte
            </StyleLink>
        </CompteSection>
    );
};

export default CompteInfo;
