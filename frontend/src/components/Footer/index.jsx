/*-----------------------------------------------------------------------------------------*/
/* Définition du composant Footer pour notre application React 'app' pour notre FrontEnd : */
/*-----------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";
/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../utils/hooks";
/* Importation des logos 'ligth' et 'dark' */
import logoLigth from "../../assets/icon-left-font-monochrome-black.svg";
import logoDark from "../../assets/icon-left-font-monochrome-white.svg";

const FooterContainer = styled.footer`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
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
`;

const ImgLogo = styled.img`
    height: 50px;
`;

const NightModeButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

function Footer() {
    const { toggleTheme, theme } = useTheme();

    return (
        <FooterContainer theme={theme}>
            <FooterDescription>
                <ImgLogo
                    src={theme === "light" ? logoLigth : logoDark}
                    alt="Logo Groupomania"
                />
                <FooterText>
                    Réseau Social d'entreprise / Utilisateur : Inconnu
                </FooterText>
            </FooterDescription>
            <NightModeButton onClick={() => toggleTheme()} theme={theme}>
                Changer de mode : {theme === "light" ? "☀️" : "🌙"}
            </NightModeButton>
        </FooterContainer>
    );
}

export default Footer;
