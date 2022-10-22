/*----------------------------------------------------------------------------------------*/
/* Définition du composant Erreur pour notre application React 'app' pour notre FrontEnd : */
/*----------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../utils/style/couleurs";
/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../utils/hooks";
/* Importation de l'image svg pour l'erreur */
import Svg404 from "../../assets/404.svg";

const ErreurArticle = styled.article`
    margin: 30px;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => (theme === "clair" ? couleurs.backgroundClair : couleurs.backgroundSombre)};
    align-items: center;
`;

const ErreurTitre = styled.h1`
    font-weight: 300;
    color: ${({ theme }) => (theme === "clair" ? couleurs.fontClair : couleurs.fontSombre)};
`;

const ErreurSousTitre = styled.h2`
    font-weight: 300;
    color: ${({ theme }) => (theme === "clair" ? couleurs.tertiaire : couleurs.secondaire)};
`;

const Illustration = styled.img`
    max-width: 800px;
`;

function Erreur() {
    const { theme } = useTheme();
    return (
        <ErreurArticle theme={theme}>
            <ErreurTitre theme={theme}>Oups...</ErreurTitre>
            <Illustration src={Svg404} alt="Erreur 404" />
            <ErreurSousTitre theme={theme}>Il semblerait que la page que vous cherchez n’existe pas</ErreurSousTitre>
        </ErreurArticle>
    );
}

export default Erreur;
