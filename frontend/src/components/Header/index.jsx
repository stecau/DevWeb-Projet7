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
/* Importation des utilitaires de style (StyledLink) */
import { StyledLink } from "../../utils/style/Atoms";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../utils/hooks";

/* Importation de notre context 'ConnexionContext' */
import { ConnexionContext } from "../../utils/context";

/* Importation des logos 'ligth' et 'dark' */
import logoLigth from "../../assets/icon-left-font-monochrome-black.svg";
import logoDark from "../../assets/icon-left-font-monochrome-white.svg";

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
                    src={theme === "light" ? logoLigth : logoDark}
                    alt="Logo Groupomania"
                />
            </Link>
            <nav>
                <StyledLink
                    to="/"
                    $isActivated={location.pathname === "/" && 1}
                    theme={theme}
                >
                    Acceuil
                </StyledLink>
                <StyledLink
                    to={
                        identificationType.type !== "connecté"
                            ? "/compte"
                            : `/compte/${""}`
                    }
                    $isActivated={
                        location.pathname.indexOf("/compte") !== -1 && 1
                    }
                    theme={theme}
                >
                    Mon compte
                </StyledLink>
                {identificationType.type !== "connecté" ? (
                    <StyledLink
                        to="/connexion"
                        $isActivated={location.pathname === "/connexion" && 1}
                        theme={theme}
                    >
                        Connexion
                    </StyledLink>
                ) : (
                    <StyledLink
                        to="/connexion"
                        $isActivated={location.pathname === "/deconnexion" && 1}
                        theme={theme}
                        onClick={deconnection}
                    >
                        Déconnexion
                    </StyledLink>
                )}
            </nav>
        </HeaderContainer>
    );
};

export default Header;
