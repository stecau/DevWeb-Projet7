/*------------------------------------------------------------------------------------------------*/
/* Définition du composant AcceuilDefaut pour notre application React 'app' pour notre FrontEnd : */
/*------------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../../utils/style/couleurs";
import { StyleLink } from "../../../utils/style/Atomes";

/* Importation de notre Hooks 'useTheme' */
import { useTheme } from "../../../utils/hooks";

/* Importation de l'image jpeg pour la page d'accueil */
import AccueilIllustration from "../../../assets/home-illustration.jpeg";

const AcceuilFigure = styled.figure`
    display: flex;
    margin: 0;
`;

const AccueilFigCaption = styled.figcaption`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    ${StyleLink} {
        max-width: 250px;
    }
`;

const StyleTitreH1 = styled.h1`
    padding: 0 5px 0 0;
    max-width: 280px;
    color: ${({ theme }) => (theme === "clair" ? couleurs.primaire : couleurs.secondaire)};
`;

const StyleTitreH2 = styled.h2`
    padding: 0 5px 30px 0;
    max-width: 280px;
    color: ${({ theme }) => (theme === "clair" ? couleurs.fontClair : couleurs.fontSombre)};
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

// Définition du composant fonction 'AcceuilDefaut'
const AcceuilDefaut = () => {
    // Récupération des valeurs de contexte grace aux hooks personnalisés
    const { theme } = useTheme();

    return (
        <AcceuilFigure>
            <AccueilFigCaption>
                <StyleTitreH1 theme={theme}>Bienvenue sur le réseau social interne du groupe !</StyleTitreH1>
                <StyleTitreH2 theme={theme}>
                    Rencontrez vos collègues de manières conviviales et apprennez à mieux les connaitre.
                </StyleTitreH2>
                <StyleLink to="/connexion" $estActive theme={theme}>
                    Connectez-vous !
                </StyleLink>
            </AccueilFigCaption>
            <Illustration src={AccueilIllustration} alt="Illustration d'accueil" />
        </AcceuilFigure>
    );
};

export default AcceuilDefaut;
