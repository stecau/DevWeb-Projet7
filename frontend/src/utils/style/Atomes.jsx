/*------------------------------------------------------------------------------------------------------*/
/* Définition du niveau 'Atome' de notre style pour notre application React 'app' pour notre FrontEnd : */
/*------------------------------------------------------------------------------------------------------*/

/* Importation du composant 'Link' de React Router DOM */
import { Link } from "react-router-dom";

/* Importation du module 'styled' et 'keyframes' de 'styled-components' */
import styled, { keyframes } from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "./couleurs";

const rotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const IndicateurChargement = styled.div`
    padding: 10px;
    border: 6px solid ${couleurs.primaire};
    border-bottom-color: transparent;
    border-radius: 22px;
    animation: ${rotation} 1s infinite linear;
    height: 0;
    width: 0;
`;

export const StyleLink = styled(Link)`
    margin: 5px;
    padding: 10px 15px;
    color: ${({ theme }) => (theme === "clair" ? couleurs.fontClair : couleurs.fontSombre)};
    text-decoration: none;
    font-size: 18px;
    text-align: center;
    ${(props) =>
        props.$estActive &&
        `color: ${couleurs.fontSombre}; 
        border-radius: 30px; 
        background-color: ${couleurs.primaire};`};
    ${(props) =>
        props.$styleCreation &&
        `color: ${props.theme === "clair" ? couleurs.secondaire : couleurs.tertiaire};
        padding: 5px 10px;
        font-size: 13px;
        border-radius: 5px; 
        background-color: ${props.theme === "clair" ? couleurs.tertiaire : couleurs.secondaire};`};
    ${(props) =>
        props.$estMessage &&
        `color: ${props.theme === "clair" ? couleurs.fontClair : couleurs.fontSombre};
        padding: 0px;
        background-color: ${props.theme === "clair" ? couleurs.secondaire : couleurs.tertiaire};`};
`;

export const StyleButton = styled.button`
    margin: 5px;
    padding: 10px 15px;
    color: ${({ theme }) => (theme === "clair" ? couleurs.fontClair : couleurs.fontSombre)};
    text-decoration: none;
    font-size: 18px;
    text-align: center;
    border: none;
    cursor: pointer;
    ${(props) =>
        props.$estActive &&
        `color: ${couleurs.fontSombre}; 
        border-radius: 30px; 
        background-color: ${couleurs.primaire};`};
    ${(props) =>
        props.$styleCreation &&
        `color: ${props.theme === "clair" ? couleurs.secondaire : couleurs.tertiaire};
        padding: 5px 10px;
        font-size: 13px;
        border-radius: 5px; 
        background-color: ${props.theme === "clair" ? couleurs.tertiaire : couleurs.secondaire};`};
    ${(props) =>
        props.$estMessage &&
        `color: ${props.theme === "clair" ? couleurs.fontClair : couleurs.fontSombre};
        padding: 0px;
        background-color: ${props.theme === "clair" ? couleurs.secondaire : couleurs.tertiaire};`};
    ${(props) => props.$estJaime && `color: ${props.theme === "clair" ? couleurs.tertiaire : couleurs.secondaire};`};
    ${(props) =>
        props.$estFlex &&
        `display: flex;
        align-items: center;`};
`;
