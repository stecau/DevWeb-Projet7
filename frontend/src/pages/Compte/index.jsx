/*---------------------------------------------------------------------------------------*/
/* Définition de la page Compte pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------*/

/* importation du hook 'useState' et 'useContext' de React */
import { useState, useContext } from "react";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";
/* Importation de notre style spécifique de lien */
import { StyledLink, StyledButton } from "../../utils/style/Atoms";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../utils/context";

const CompteWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const CompteArticle = styled.article`
    margin: 30px;
    background-color: ${({ theme }) =>
        theme === "light" ? colors.backgroundLight : colors.backgroundDark};
    padding: 60px 90px;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
`;

const CompteSection = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 200px;
`;

const StyledTitleH1 = styled.h1`
    max-width: 600px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "light" ? colors.primary : colors.secondary};
`;

const StyledTitleH2 = styled.h2`
    max-width: 600px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

const StyledText = styled.p`
    margin: 0;
    padding: 0;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

const ModificationContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const CompteFrom = styled.form`
    display: flex;
    flex-direction: column;
`;

const identification = (e, type, email, motDePasse) => {
    e.preventDefault();
    console.log(type, email, motDePasse);
};

const Compte = () => {
    const { theme } = useTheme();
    const [emailValue, setEmailValue] = useState("Votre Email ici");
    const [motDePasseValue, setmotDePasseValue] = useState(
        "Votre mot de passe ici"
    );
    const [nomValue, setNomValue] = useState("Votre nom ici");
    const [prenomValue, setPrenomValue] = useState("Votre prénom ici");
    const [posteValue, setPosteValue] = useState("Votre poste ici");

    const { identificationType, setIdentificationType } =
        useContext(ConnexionContext);

    return (
        <CompteWrapper>
            <CompteArticle theme={theme}>
                <StyledTitleH1 theme={theme}>
                    Mon compte Groupomania
                </StyledTitleH1>
                {identificationType !== "connected" ? (
                    <CompteSection>
                        <StyledTitleH2 theme={theme}>
                            Aucune information disponible
                        </StyledTitleH2>
                        <StyledText theme={theme}>
                            Veuillez-vous connecter ou créer un compte pour
                            visualiser vos informations.
                        </StyledText>
                        <StyledLink
                            to="/connexion"
                            $isCreation
                            theme={theme}
                            onClick={() => {
                                setIdentificationType("connexion");
                            }}
                        >
                            Connexion
                        </StyledLink>
                        <StyledLink
                            to="/connexion"
                            $isCreation
                            theme={theme}
                            onClick={() => {
                                setIdentificationType("creation");
                            }}
                        >
                            Créer un compte
                        </StyledLink>
                    </CompteSection>
                ) : (
                    <ModificationContainer>
                        <StyledTitleH2 theme={theme}>
                            Mes informations
                        </StyledTitleH2>
                        <CompteFrom theme={theme}>
                            <p>tata</p>
                            <StyledTitleH2 theme={theme}>
                                Mes options
                            </StyledTitleH2>
                            <StyledLink
                                to="/compte/id"
                                $isCreation
                                theme={theme}
                                onClick={() => {
                                    setIdentificationType("creation");
                                }}
                            >
                                Supprimer mon compte
                            </StyledLink>
                            <StyledLink
                                to="/compte/id"
                                $isCreation
                                theme={theme}
                                onClick={() => {
                                    setIdentificationType("creation");
                                }}
                            >
                                Sauvegarder mes modifications
                            </StyledLink>
                        </CompteFrom>
                    </ModificationContainer>
                )}
            </CompteArticle>
        </CompteWrapper>
    );
};

export default Compte;
