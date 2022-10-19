/*----------------------------------------------------------------------------------------*/
/* Définition du composant Error pour notre application React 'app' pour notre FrontEnd : */
/*----------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../utils/style/couleurs";
/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../utils/hooks";
/* Importation de l'image svg pour l'erreur */
import Svg404 from "../../assets/404.svg";

const ErrorWrapper = styled.div`
    margin: 30px;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) =>
        theme === "clair"
            ? couleurs.backgroundClair
            : couleurs.backgroundSombre};
    align-items: center;
`;

const ErrorTitle = styled.h1`
    font-weight: 300;
    color: ${({ theme }) =>
        theme === "clair" ? couleurs.fontClair : couleurs.fontSombre};
`;

const ErrorSubtitle = styled.h2`
    font-weight: 300;
    color: ${({ theme }) =>
        theme === "clair" ? couleurs.tertiaire : couleurs.secondaire};
`;

const Illustration = styled.img`
    max-width: 800px;
`;

function Error() {
    const { theme } = useTheme();
    return (
        <ErrorWrapper theme={theme}>
            <ErrorTitle theme={theme}>Oups...</ErrorTitle>
            <Illustration src={Svg404} alt="Erreur 404" />
            <ErrorSubtitle theme={theme}>
                Il semblerait que la page que vous cherchez n’existe pas
            </ErrorSubtitle>
        </ErrorWrapper>
    );
}

export default Error;
