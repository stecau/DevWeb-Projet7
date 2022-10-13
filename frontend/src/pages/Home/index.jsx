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
import { useTheme } from "../../utils/hooks";

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

// Fonction pour générer un token falcifier pour le localStorage
const generateurFalseToken = (data, reverse = false) => {
    /* Mise dans le local storage d'un string contenant :
    l'ensemble des informations d'identifacation séparée par @
    (token)type@(connecté)em(aà-il@(email)id@(id)token
    {
        ...identificationType,
        token: utilisateur.token}
    } */
    if (reverse) {
        // data est un string
        const stringToParse = `{\"token\":${data.split("ty-pe@q")[0]}\", 
        \"type\":\"${data.split("ty-pe@q")[1].split("em(aà-il@")[0]}\", 
        \"email\":\"${
            data.split("ty-pe@q")[1].split("em(aà-il@")[1].split("id@")[0]
        }\", 
            \"id\":\"${data
                .split("ty-pe@q")[1]
                .split("em(aà-il@")[1]
                .split("id@")[1]
                .replace("toenk", "")}}`;
        const objectResult = JSON.parse(stringToParse);
        objectResult.id = parseInt(objectResult.id, 10);
        return objectResult;
    } else {
        // data est un string
        const stringResult = `${data.token}ty-pe@q${"connecté"}em(aà-il@${
            data.email
        }id@${data.id}toenk`;
        return stringResult;
    }
};

const Home = () => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // Identification pour la gestion du statut de connexion et de l'email + id de l'utilisateur connecté
    const { identificationType, setIdentificationType } =
        useContext(ConnexionContext);

    // Récupération du statut de connexion au chargement de la page
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("groupomania")) {
                // Generation d'un token falcifié pour le localStorage
                const tokenObject = generateurFalseToken(
                    window.localStorage.getItem("groupomania"),
                    "reverse"
                );
                setIdentificationType({ ...tokenObject });
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
