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
    background-color: ${(props) => (props.modeSombre ? couleurs.sombre : couleurs.clair)};
    margin: 0;  
}

h1 {
    font-size: 2em;
    line-height: 50px;
}

h2 {
    font-size: 1.5em;
    line-height: 50px;
}

p {
    margin: 0;
}

.normalIcon {
    color: ${(props) => (props.modeSombre ? couleurs.secondaire : couleurs.tertiaire)};
    font-size: 20px;
    padding: 5px 5px 5px 5px;
}

.normalIconRed {
    font-size: 20px;
    padding: 5px 5px 5px 5px;
    color: ${couleurs.primaire};
}

.normalIconInverse {
    color: ${(props) => (props.modeSombre ? couleurs.tertiaire : couleurs.secondaire)};
    font-size: 20px;
    padding: 5px 5px 5px 5px;
}

.normalJaime {
    color: ${(props) => (props.modeSombre ? couleurs.secondaire : couleurs.tertiaire)};
    font-size: 20px;
    padding: 5px 5px 7px 7px;
}

.normalJadore {
    color: ${(props) => (props.modeSombre ? couleurs.secondaire : couleurs.tertiaire)};
    font-size: 20px;
    padding: 7px 7px 5px 5px;
}

.aimé {
    color: ${(props) => (props.modeSombre ? "#00FF00" : "#0000FF")};
    font-size: 20px;
    padding: 5px 5px 7px 7px;
}

.adoré {
    color: ${(props) => (props.modeSombre ? "#FF0000" : "#FF0000")};
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

section {
    margin: 30px;
    padding: 60px 90px;
}

@media screen and (max-width: 764px) {
    header {
        flex-direction: column;
        align-items: center;
    }
    nav span {
        display: none
    }

    footer span {
        text-align: center;
    }

    section {
        margin: 15px;
        padding: 20px;
    }

    figure {
        flex-direction: column-reverse;
        align-items: center;
    }

    h1 {
        font-size: 1.25em;
        line-height: 25px;
    }

    h2 {
        font-size: 1em;
        line-height: 25px;
    }

    p {
        font-size: 0.8em;
    }

    figcaption button span {
        display: none
    }

    label {
        font-size: 0.8em;
    }

    input {
        font-size: 0.8em;
    }

    .optionsCompte {
        flex-direction: column;
    }

    figcaption {
        width: 100%;
    }
}

@media screen and (min-width: 765px) and (max-width: 900px) {
    nav span {
        display: none
    }

    section {
        margin: 25px;
        padding: 40px;
    }

    h1 {
        font-size: 1.5em;
        line-height: 30px;
    }

    h2 {
        font-size: 1.25em;
        line-height: 30px;
    }

    footer span {
        text-align: center;
    }

    label {
        font-size: 0.8em;
    }

    input {
        font-size: 0.8em;
    }
}
`;

// StyleGlobal = composant fonction qui va nous permettre d'y utiliser des hooks (useContext ici)
const StyleGlobal = () => {
    const { theme } = useTheme();

    return <ToutLeStyleGlobal modeSombre={theme === "sombre"} />;
};

export default StyleGlobal;
