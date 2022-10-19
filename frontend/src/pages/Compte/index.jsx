/*---------------------------------------------------------------------------------------*/
/* Définition de la page Compte pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------*/

/* importation du hook 'useState' et 'useContext' de React */
import { useEffect } from "react";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../utils/style/couleurs";

/* Importation de notre Hook 'useTheme' */
import { useTheme, useIdentification } from "../../utils/hooks";

/* Impotation de notre composant 'CompteDefault' */
import CompteInfo from "../../components/Compte/CompteInfo";
/* Impotation de notre composant 'CompteShow' */
import CompteShow from "../../components/Compte/CompteShow";

const CompteWrapper = styled.article`
    display: flex;
    justify-content: center;
`;

const CompteContainer = styled.section`
    margin: 30px;
    background-color: ${({ theme }) =>
        theme === "clair"
            ? couleurs.backgroundClair
            : couleurs.backgroundSombre};
    padding: 60px 90px;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
`;

const StyledTitleH1 = styled.h1`
    max-width: 600px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "clair" ? couleurs.primaire : couleurs.secondaire};
`;

const Compte = () => {
    const { theme } = useTheme();
    const { identificationType, majIdentificationType } = useIdentification();

    // UseEffect de récupération des infos de session au chargement de la page
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (
                window.localStorage.getItem("groupomania") &&
                identificationType.type !== "connecté"
            ) {
                console.log("<----- COMPTE INIT ----->");
                console.log(
                    " => récupération infos depuis localStorage (pour restaurer la session)"
                );
                // Generation d'un token falcifié pour le localStorage
                majIdentificationType(
                    window.localStorage.getItem("groupomania"),
                    true
                );
                // const tokenObject = generateurFauxToken(
                //     window.localStorage.getItem("groupomania"),
                //     "reverse"
                // );
                // setIdentificationType({ ...tokenObject });
            }
        }
    }, []);

    return (
        <CompteWrapper>
            <CompteContainer theme={theme}>
                <StyledTitleH1 theme={theme}>
                    Mon compte Groupomania
                </StyledTitleH1>
                {identificationType.type !== "connecté" ? (
                    <CompteInfo />
                ) : (
                    <CompteShow />
                )}
            </CompteContainer>
        </CompteWrapper>
    );
};

export default Compte;
