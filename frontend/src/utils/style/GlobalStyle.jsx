/*-------------------------------------------------------------------------------------------------*/
/* Définition d'un composant Global Style pour notre application React 'app' pour notre FrontEnd : */
/*-------------------------------------------------------------------------------------------------*/

/* Importation du module 'createGlobalStyle' de 'styled-components' */
import { createGlobalStyle } from "styled-components";
/* Importation de notre methode 'ThemeContext' depuis le dossier 'Context' */
import { useTheme } from "../hooks";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";

// Définition du style Global avec 'createGlobalStyle'
const StyledGlobalStyle = createGlobalStyle`
* {
    font-family: 'Lato', Helvetica, sans-serif;
}

body {
    /* Utilisation du contexte pour le thème du style Golbal (ligth or dark) */
    background-color: ${(props) =>
        props.isDarkMode ? colors.dark : colors.light};
    margin: 0;  
}
`;
/* Info :
    background-color: ${(props) => props.isDarkMode ? '#2F2E41' : 'white'};
        est équivalent ici à :
    background-color: ${({ isDarkMode }) => (isDarkMode ? '#2F2E41' : 'white')};
*/

// GlobalStyle = composant fonction qui va nous permettre d'y utiliser des hooks (useContext ici)
const GlobalStyle = () => {
    const { theme } = useTheme();

    return <StyledGlobalStyle isDarkMode={theme === "dark"} />;
};

export default GlobalStyle;
