/*----------------------------------------------------------------------------------------*/
/* Définition de la page Accueil pour notre application React 'app' pour notre FrontEnd : */
/*----------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../utils/style/couleurs";

/* Importation de nos Hooks 'useTheme' et 'useVerificationConnexion' */
import { useTheme, useVerificationConnexion } from "../../utils/hooks";

/* Importation de notre composant 'FilActualites' */
import FilActualites from "../../components/Accueil/FilActualites";
/* Importation de notre composant 'AcceuilDefaut' */
import AcceuilDefaut from "../../components/Accueil/AccueilDefaut";

const AcceuilArticle = styled.article`
    display: flex;
    justify-content: center;
`;

const AccueilSection = styled.section`
    margin: 30px;
    background-color: ${({ theme }) => (theme === "clair" ? couleurs.backgroundClair : couleurs.backgroundSombre)};
    padding: 60px 90px;
    display: flex;
    flex-direction: row;
    max-width: 1200px;
`;

// Définition de la route (composant fonction) 'Accueil'
const Acceuil = () => {
    // Récupération des valeurs de contexte grace aux hooks personnalisés
    const { theme } = useTheme();
    // Récupération du statut de connexion au chargement de la page grace aux hooks personnalisés
    const { identificationType } = useVerificationConnexion();

    return (
        <AcceuilArticle>
            <AccueilSection theme={theme}>{identificationType.type !== "connecté" ? <AcceuilDefaut /> : <FilActualites />}</AccueilSection>
        </AcceuilArticle>
    );
};

export default Acceuil;
