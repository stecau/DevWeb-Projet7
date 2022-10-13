/*-------------------------------------------------------------------------------------*/
/* Définition de la page Home pour notre application React 'app' pour notre FrontEnd : */
/*-------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";
import { StyledLink } from "../../utils/style/Atoms";

/* importation du hook 'useContext' de React */
import { useContext } from "react";

/* Importation de notre Hook 'useTheme' */
import { useTheme, useIdentification } from "../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../utils/context";

/* Importation de notre composant 'Cards' */
import Cards from "../../components/Cards";

/* Importation de l'image jpeg pour la page d'accueil */
import HomeIllustration from "../../assets/home-illustration.jpeg";
import { useEffect } from "react";

const HomeWrapper = styled.article`
    display: flex;
    justify-content: center;
`;

const HomeContainer = styled.section`
    margin: 30px;
    background-color: ${({ theme }) =>
        theme === "light" ? colors.backgroundLight : colors.backgroundDark};
    padding: 60px 90px;
    display: flex;
    flex-direction: row;
    max-width: 1200px;
`;

const HomeFigure = styled.figure`
    display: flex;
    flex-direction: row;
    margin: 0;
`;

const LeftCol = styled.figcaption`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    ${StyledLink} {
        max-width: 250px;
    }
`;

const StyledTitleH1 = styled.h1`
    padding: 0 5px 0 0;
    max-width: 280px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "light" ? colors.primary : colors.secondary};
`;

const StyledTitleH2 = styled.h2`
    padding: 0 5px 30px 0;
    max-width: 280px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

const Illustration = styled.img`
    max-height: 500px;
    width: 100%;
    object-fit: contain;
    ${({ isMessage }) =>
        !isMessage &&
        `flex: 1;
        width: 50%;`};
`;

const Home = () => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // Theme pour la gestion du mode jour et nuit
    const { identificationType, updateIdentificationType } =
        useIdentification();

    // Récupération du statut de connexion au chargement de la page
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (
                window.localStorage.getItem("groupomania") &&
                identificationType.type !== "connecté"
            ) {
                console.log("<----- HOME ----->");
                console.log(
                    " => récupération infos depuis localStorage (pour restaurer la session)"
                );
                // Generation d'un token falcifié pour le localStorage et changement valeur identificationType
                updateIdentificationType(
                    window.localStorage.getItem("groupomania"),
                    true
                );
            }
        }
    }, []);

    return (
        <HomeWrapper>
            <HomeContainer theme={theme}>
                {identificationType.type !== "connecté" ? (
                    <HomeFigure>
                        <LeftCol>
                            <StyledTitleH1 theme={theme}>
                                Bienvenue sur le réseau social interne du groupe
                                !
                            </StyledTitleH1>
                            <StyledTitleH2 theme={theme}>
                                Rencontrez vos collègues de manières conviviales
                                et apprennez à mieux les connaitre.
                            </StyledTitleH2>
                            <StyledLink
                                to="/connexion"
                                $isActivated
                                theme={theme}
                            >
                                Connectez-vous !
                            </StyledLink>
                        </LeftCol>
                        <Illustration
                            src={HomeIllustration}
                            alt="Home illustration"
                        />
                    </HomeFigure>
                ) : (
                    <Cards />
                )}
            </HomeContainer>
        </HomeWrapper>
    );
};

export default Home;
