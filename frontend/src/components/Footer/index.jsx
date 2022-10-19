/*-----------------------------------------------------------------------------------------*/
/* Définition du composant Footer pour notre application React 'app' pour notre FrontEnd : */
/*-----------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../utils/style/couleurs";
/* Importation de notre Hook 'useTheme' */
import { useIdentification, useTheme } from "../../utils/hooks";
/* Importation des logos 'ligth' et 'Sombre' */
import logoNoir from "../../assets/icon-left-font-monochrome-black.svg";
import logoBlanc from "../../assets/icon-left-font-monochrome-white.svg";

const FooterContainer = styled.footer`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    color: ${({ theme }) =>
        theme === "clair" ? couleurs.logoNoir : couleurs.logoBlanc};
    padding: 30px;
`;

const FooterDescription = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 30px;
`;

const FooterText = styled.span`
    padding-top: 15px;
    font-size: 20px;
    color: ${({ theme }) =>
        theme === "clair" ? couleurs.fontClair : couleurs.fontSombre};
`;

const ImgLogo = styled.img`
    height: 50px;
`;

const ModeNuitButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: ${({ theme }) =>
        theme === "clair" ? couleurs.fontClair : couleurs.fontSombre};
`;

function Footer() {
    const { changeTheme, theme } = useTheme();
    const { identificationType } = useIdentification();

    // Fonction pour l'affichage de l'email dans le texte du pied de page
    const TextePiedDePage = () => {
        if (identificationType.hasOwnProperty("email")) {
            return identificationType.email;
        }
        return "inconnu";
    };

    return (
        <FooterContainer theme={theme}>
            <FooterDescription>
                <ImgLogo
                    src={theme === "clair" ? logoNoir : logoBlanc}
                    alt="Logo Groupomania"
                />
                <FooterText theme={theme}>
                    Réseau Social d'entreprise / Utilisateur :{" "}
                    {TextePiedDePage()}
                </FooterText>
            </FooterDescription>
            <ModeNuitButton onClick={changeTheme} theme={theme}>
                Changer de mode : {theme === "clair" ? "☀️" : "🌙"}
            </ModeNuitButton>
        </FooterContainer>
    );
}

export default Footer;
