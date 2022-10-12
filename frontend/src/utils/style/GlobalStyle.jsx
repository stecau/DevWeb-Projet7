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

h1 {
    font-size: 2em;
}

h2 {
    font-size: 1.5em;
}

p {
    margin: 0;
}

.normalIcon {
    color: ${(props) =>
        props.isDarkMode ? colors.secondary : colors.tertiary};
    font-size: 20px;
    padding: 5px 5px 5px 5px;
}

.normalIconRed {
    font-size: 20px;
    padding: 5px 5px 5px 5px;
    color: ${colors.primary};
}

.normalIconReverse {
    color: ${(props) =>
        props.isDarkMode ? colors.tertiary : colors.secondary};
    font-size: 20px;
    padding: 5px 5px 5px 5px;
}

.normalLike {
    color: ${(props) =>
        props.isDarkMode ? colors.secondary : colors.tertiary};
    font-size: 20px;
    padding: 5px 5px 7px 7px;
}

.normalDislike {
    color: ${(props) =>
        props.isDarkMode ? colors.secondary : colors.tertiary};
    font-size: 20px;
    padding: 7px 7px 5px 5px;
}

.liked {
    color: ${(props) => (props.isDarkMode ? "#00FF00" : "#0000FF")};
    font-size: 20px;
    padding: 5px 5px 7px 7px;
}

.disliked {
    color: ${(props) => (props.isDarkMode ? "#FF0000" : "#FF0000")};
    font-size: 20px;
    padding: 7px 7px 5px 5px;
}

legend {
    font-size: 12px;
}

label {
    padding: 5px;
    font-size: 15px;
}

input {
    padding: 5px;
    margin-bottom: 5px;
}

textarea {
    padding: 5px;
    margin-bottom: 5px;
    height: 150px;
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
