/*-----------------------------------------------------------------------------------------*/
/* Définition du composant Footer pour notre application React 'app' pour notre FrontEnd : */
/*-----------------------------------------------------------------------------------------*/

/* importation du hook 'useContext' de React */
import { useContext } from "react";
/* Importation du Hook useLocation de React Router */
import { useLocation } from "react-router-dom";
/* Importation du composant 'Link' de React Router */
import { Link } from "react-router-dom";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des utilitaires de style (StyleLink) */
import { StyleLink } from "../../utils/style/Atomes";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../utils/hooks";

/* Importation de notre context 'ConnexionContext' */
import { ConnexionContext } from "../../utils/context";

/* Importation des logos 'Clair' et 'Sombre' */
import logoNoir from "../../assets/icon-left-font-monochrome-black.svg";
import logoBlanc from "../../assets/icon-left-font-monochrome-white.svg";

const HomeLogo = styled.img`
    height: 50px;
`;

const HeaderContainer = styled.header`
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Header = () => {
    const { theme } = useTheme();
    const location = useLocation();
    const { identificationType, setIdentificationType } =
        useContext(ConnexionContext);

    const deconnection = () => {
        if (window.localStorage.getItem("groupomania")) {
            window.localStorage.removeItem("groupomania");
        }
        setIdentificationType({
            type: "connexion",
            email: "Inconnu",
        });
        document.title = `Groupomania / Utilisateur ${identificationType.email}`;
    };

    return (
        <HeaderContainer>
            <Link to="/">
                <HomeLogo
                    src={theme === "clair" ? logoNoir : logoBlanc}
                    alt="Logo Groupomania"
                />
            </Link>
            <nav>
                <StyleLink
                    to="/"
                    $estActive={location.pathname === "/" && 1}
                    theme={theme}
                >
                    Acceuil
                </StyleLink>
                <StyleLink
                    to="/compte"
                    $estActive={location.pathname === "/compte" && 1}
                    theme={theme}
                >
                    Mon compte
                </StyleLink>
                {identificationType.type !== "connecté" ? (
                    <StyleLink
                        to="/connexion"
                        $estActive={location.pathname === "/connexion" && 1}
                        theme={theme}
                    >
                        Connexion
                    </StyleLink>
                ) : (
                    <StyleLink
                        to="/connexion"
                        $estActive={location.pathname === "/deconnexion" && 1}
                        theme={theme}
                        onClick={deconnection}
                    >
                        Déconnexion
                    </StyleLink>
                )}
            </nav>
        </HeaderContainer>
    );
};

export default Header;
