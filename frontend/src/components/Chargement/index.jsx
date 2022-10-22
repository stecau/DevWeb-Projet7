/*-----------------------------------------------------------------------------------------------*/
/* Définition du composant 'Chargement' pour notre application React 'app' pour notre FrontEnd : */
/*-----------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation de notre style spécifique (niveau atome) de l'indicateur de chargement */
import { IndicateurChargement } from "../../utils/style/Atomes";

const ConteneurIndicateurChargement = styled.div`
    display: flex;
    justify-content: center;
`;

const Chargement = () => {
    return (
        <ConteneurIndicateurChargement>
            <IndicateurChargement />
        </ConteneurIndicateurChargement>
    );
};

export default Chargement;
