/*---------------------------------------------------------------------------------------*/
/* Définition de la page Compte pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------*/

/* importation du hook 'useState' et 'useContext' de React */
import { useContext } from "react";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../../utils/style/colors";
/* Importation de notre style spécifique de lien */
import { StyledLink } from "../../../utils/style/Atoms";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../../utils/context";

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
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

const StyledText = styled.p`
    margin: 0;
    padding: 0;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

const CompteDefault = () => {
    const { theme } = useTheme();

    const { setIdentificationType } = useContext(ConnexionContext);

    return (
        <CompteSection>
            <StyledTitleH2 theme={theme}>
                Aucune information disponible
            </StyledTitleH2>
            <StyledText theme={theme}>
                Veuillez-vous connecter ou créer un compte pour visualiser vos
                informations.
            </StyledText>
            <StyledLink
                to="/connexion"
                $isCreation
                theme={theme}
                onClick={() => {
                    setIdentificationType({
                        type: "connexion",
                        email: "Inconnu",
                    });
                }}
            >
                Connexion
            </StyledLink>
            <StyledLink
                to="/connexion"
                $isCreation
                theme={theme}
                onClick={() => {
                    setIdentificationType({
                        type: "creation",
                        email: "Inconnu",
                    });
                }}
            >
                Créer un compte
            </StyledLink>
        </CompteSection>
    );
};

export default CompteDefault;
