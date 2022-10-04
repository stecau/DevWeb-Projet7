/*-------------------------------------------------------------------------------------*/
/* Définition de la page Home pour notre application React 'app' pour notre FrontEnd : */
/*-------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";
/* Importation de notre style spécifique de lien */
import { StyledLink } from "../../utils/style/Atoms";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../utils/hooks";

/* Importation de l'image jpeg pour la page d'accueil */
import HomeIllustration from "../../assets/home-illustration.jpeg";

const HomeWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const HomeContainer = styled.div`
    margin: 30px;
    background-color: ${({ theme }) =>
        theme === "light" ? colors.backgroundLight : colors.backgroundDark};
    padding: 60px 90px;
    display: flex;
    flex-direction: row;
    max-width: 1200px;
`;

const LeftCol = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    ${StyledLink} {
        max-width: 250px;
    }
`;

const StyledTitleH1 = styled.h1`
    max-width: 280px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "light" ? colors.primary : colors.secondary};
`;

const StyledTitleH2 = styled.h2`
    padding-bottom: 30px;
    max-width: 280px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

const Illustration = styled.img`
    flex: 1;
    max-height: 500px;
    width: 50%;
    object-fit: contain;
`;

const Home = () => {
    const { theme } = useTheme();

    return (
        <HomeWrapper>
            <HomeContainer theme={theme}>
                <LeftCol>
                    <StyledTitleH1 theme={theme}>
                        Bienvenue sur le réseau social interne du groupe !
                    </StyledTitleH1>
                    <StyledTitleH2 theme={theme}>
                        Rencontrez vos collègues de manières conviviales et
                        apprennez à mieux les connaitre.
                    </StyledTitleH2>
                    <StyledLink to="/connexion" $isActivated theme={theme}>
                        Connectez-vous !
                    </StyledLink>
                </LeftCol>
                <Illustration src={HomeIllustration} alt="Home illustration" />
            </HomeContainer>
        </HomeWrapper>
    );
};

export default Home;
