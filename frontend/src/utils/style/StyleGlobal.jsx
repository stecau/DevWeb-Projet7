/*-------------------------------------------------------------------------------------------------*/
/* Définition d'un composant Global Style pour notre application React 'app' pour notre FrontEnd : */
/*-------------------------------------------------------------------------------------------------*/

/* Importation du module 'createGlobalStyle' de 'styled-components' */
import { createGlobalStyle } from "styled-components";
/* Importation de notre methode 'ThemeContext' depuis le dossier 'Context' */
import { useTheme } from "../hooks";
/* Importation des couleurs de notre style */
import couleurs from "./couleurs";

// Définition du style Global avec 'createGlobalStyle'
const ToutLeStyleGlobal = createGlobalStyle`
* {
    font-family: 'Lato', Helvetica, sans-serif;
}

body {
    /* Utilisation du contexte pour le thème du style Golbal (ligth or Sombre) */
    background-color: ${(props) =>
        props.estModeSombre ? couleurs.sombre : couleurs.clair};
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
        props.estModeSombre ? couleurs.secondaire : couleurs.tertiaire};
    font-size: 20px;
    padding: 5px 5px 5px 5px;
}

.normalIconRed {
    font-size: 20px;
    padding: 5px 5px 5px 5px;
    color: ${couleurs.primaire};
}

.normalIconInverse {
    color: ${(props) =>
        props.estModeSombre ? couleurs.tertiaire : couleurs.secondaire};
    font-size: 20px;
    padding: 5px 5px 5px 5px;
}

.normalJaime {
    color: ${(props) =>
        props.estModeSombre ? couleurs.secondaire : couleurs.tertiaire};
    font-size: 20px;
    padding: 5px 5px 7px 7px;
}

.normalJadore {
    color: ${(props) =>
        props.estModeSombre ? couleurs.secondaire : couleurs.tertiaire};
    font-size: 20px;
    padding: 7px 7px 5px 5px;
}

.aimé {
    color: ${(props) => (props.estModeSombre ? "#00FF00" : "#0000FF")};
    font-size: 20px;
    padding: 5px 5px 7px 7px;
}

.adoré {
    color: ${(props) => (props.estModeSombre ? "#FF0000" : "#FF0000")};
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

// StyleGlobal = composant fonction qui va nous permettre d'y utiliser des hooks (useContext ici)
const StyleGlobal = () => {
    const { theme } = useTheme();

    return <ToutLeStyleGlobal estModeSombre={theme === "sombre"} />;
};

export default StyleGlobal;
