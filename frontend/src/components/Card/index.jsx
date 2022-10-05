/*-----------------------------------------------------------------------------------------*/
/* Définition du composant 'Card' pour notre application React 'app' pour notre FrontEnd : */
/*-----------------------------------------------------------------------------------------*/

/* Importation des modules de React */
import React from "react";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";
/* Importation de notre style spécifique de lien */
import { StyledLink } from "../../utils/style/Atoms";

/* importation du hook 'useContext' de React */
import { useContext } from "react";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../utils/context";

/* Importation de l'image jpeg pour la page d'accueil */
import HomeIllustration from "../../assets/home-illustration.jpeg";

const HomeFigure = styled.figure`
    display: flex;
    flex-direction: row;
    margin: 0;
`;

const LeftCol = styled.figcaption`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    ${StyledLink} {
        max-width: 250px;
    }
`;

const CardsContainer = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-items: space-between;
    margin: 0;
    padding: 0;
    list-style: none;
`;

const NoStyledLi = styled.li`
    margin: 10px 0;
    border-radius: 20px;
    background-color: ${({ theme }) =>
        theme === "light" ? colors.secondary : colors.tertiary};
`;

const PostFigure = styled.figure`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
    padding: 10px;
`;

const FigureCaption = styled.figcaption`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledTitleH1 = styled.h1`
    padding: 0 5px 0 0;
    max-width: 280px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "light" ? colors.primary : colors.secondary};
`;

const StyledTitleH2 = styled.h2`
    padding: 0 5px 30px 0;
    max-width: 280px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

const StyledTitle = styled.h1`
    margin: 18px 0 0 0;
    color: ${({ theme }) =>
        theme === "light" ? colors.primary : colors.secondary};
`;

const StyledContent = styled.p`
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

const Illustration = styled.img`
    max-height: 500px;
    width: 100%;
    object-fit: contain;
    ${({ isMessage }) =>
        !isMessage &&
        `flex: 1;
        width: 50%;`};
`;

const Card = ({ appAllMessages }) => {
    const { theme } = useTheme();
    const { identificationType } = useContext(ConnexionContext);

    return identificationType.type !== "connecté" ? (
        <HomeFigure>
            <LeftCol>
                <StyledTitleH1 theme={theme}>
                    Bienvenue sur le réseau social interne du groupe !
                </StyledTitleH1>
                <StyledTitleH2 theme={theme}>
                    Rencontrez vos collègues de manières conviviales et
                    apprennez à mieux les connaitre.
                </StyledTitleH2>
                <StyledLink to="/connexion" $isActivated theme={theme}>
                    Connectez-vous !
                </StyledLink>
            </LeftCol>
            <Illustration src={HomeIllustration} alt="Home illustration" />
        </HomeFigure>
    ) : (
        <CardsContainer>
            {appAllMessages.length > 0 &&
                appAllMessages.map((message) => (
                    <NoStyledLi key={message._id} theme={theme}>
                        <StyledLink
                            to={`/message/${message._id}`}
                            theme={theme}
                            $isCard
                        >
                            <PostFigure>
                                <Illustration
                                    isMessage
                                    src={message.imageUrl}
                                    alt="Illustration du message"
                                />
                                <FigureCaption>
                                    <StyledTitle theme={theme}>
                                        {message.titre}
                                    </StyledTitle>
                                    <StyledContent theme={theme}>
                                        {message.content}
                                    </StyledContent>
                                </FigureCaption>
                            </PostFigure>
                        </StyledLink>
                    </NoStyledLi>
                ))}
        </CardsContainer>
    );
};

export default Card;
