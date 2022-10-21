/*---------------------------------------------------------------------------------------*/
/* Définition de la page Compte pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../utils/style/couleurs";

/* Importation de nos Hooks personnalisés 'useTheme' et 'useVerificationConnexion' */
import { useTheme, useVerificationConnexion } from "../../utils/hooks";

/* Impotation de notre composant 'CompteDefault' */
import CompteInfo from "../../components/Compte/CompteInfo";
/* Impotation de notre composant 'CompteShow' */
import CompteShow from "../../components/Compte/CompteShow";
import { CompteProvider } from "../../utils/context";

const CompteArticle = styled.article`
    display: flex;
    justify-content: center;
`;

const CompteSection = styled.section`
    margin: 30px;
    background-color: ${({ theme }) => (theme === "clair" ? couleurs.backgroundClair : couleurs.backgroundSombre)};
    padding: 60px 90px;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
`;

const StyleTitreH1 = styled.h1`
    max-width: 600px;
    line-height: 50px;
    color: ${({ theme }) => (theme === "clair" ? couleurs.primaire : couleurs.secondaire)};
`;

// Définition de la route (composant fonction) 'Compte'
const Compte = () => {
    // Récupération des valeurs de contexte grace aux hooks personnalisés
    const { theme } = useTheme();
    // Récupération du statut de connexion au chargement de la page grace aux hooks personnalisés
    const { identificationType } = useVerificationConnexion();

    return (
        <CompteArticle>
            <CompteSection theme={theme}>
                <StyleTitreH1 theme={theme}>Mon compte Groupomania</StyleTitreH1>
                {identificationType.type !== "connecté" ? (
                    <CompteInfo />
                ) : (
                    <CompteProvider>
                        <CompteShow />
                    </CompteProvider>
                )}
            </CompteSection>
        </CompteArticle>
    );
};

export default Compte;
