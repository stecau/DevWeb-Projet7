/*------------------------------------------------------------------------------------------*/
/* Définition de la page Connexion pour notre application React 'app' pour notre FrontEnd : */
/*------------------------------------------------------------------------------------------*/

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

const ConnexionWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const ConnexionArticle = styled.article`
    margin: 30px;
    background-color: ${({ theme }) =>
        theme === "light" ? colors.backgroundLight : colors.backgroundDark};
    padding: 60px 90px;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
`;

const ConnexionFrom = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 150px;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

const StyledTitleH1 = styled.h1`
    max-width: 350px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "light" ? colors.primary : colors.secondary};
`;

const StyledTitleH2 = styled.h2`
    max-width: 350px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

const EmailAlertText = styled.p`
    color: red;
    font-size: 0.8em;
    margin: 0;
    padding: 0 0 5px 0;
    display: ${({ emailValide }) => (emailValide ? "none" : "block")};
`;

const MotDePasseAlertText = styled.p`
    color: red;
    font-size: 0.8em;
    margin: 0;
    padding: 0 0 5px 0;
    display: ${({ motDePasseValide }) => (motDePasseValide ? "none" : "block")};
`;

const CreationContainer = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const isEmailValid = (inputEmail, regexpEmail) => {
    if (regexpEmail.test(inputEmail)) {
        const emailLength = inputEmail.length;
        if (regexpEmail[Symbol.match](inputEmail) != null) {
            const regexpEmailLength =
                regexpEmail[Symbol.match](inputEmail)[0].length;
            return emailLength === regexpEmailLength;
        }
    }
    return false;
};

const Connexion = () => {
    const { theme } = useTheme();
    const [emailValue, setEmailValue] = useState("");
    const [emailValide, setEmailValide] = useState(true);
    const [motDePasseValue, setMotDePasseValue] = useState("");
    const [motDePasseValide, setMotDePasseValide] = useState(true);

    const { identificationType, setIdentificationType } =
        useContext(ConnexionContext);

    // Déclaration de la fonction faire la requête de connexion (avec création de compte)
    const identification = (e, type, email, motDePasse) => {
        e.preventDefault();
        console.log(type, email, motDePasse);
        if (type === "creation") {
            console.log("CREATION");
        }
        if (email && motDePasse) {
            fetch("http://localhost:4000/api/auth/login", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    motDePasse: motDePasse,
                }),
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (
                        data.message.indexOf("Utilisateur connecté : ") !== -1
                    ) {
                        alert(
                            `Connexion réussie : 
                            ${data.message} (ID=${data.utilisateur_Id}, token=${data.token})`
                        );
                        return data; // utilisation du state pour stocker le token
                    } else {
                        alert(`Connexion échouée : ${data.message}`);
                    }
                })
                .catch((err) => {
                    // An error occured
                    alert(`Erreur de connexion : [ ${err} ]`);
                });
        } else {
            if (emailValue.length === 0) {
                setEmailValide(false);
            }
            if (motDePasseValue.length === 0) {
                setMotDePasseValide(false);
            }
        }
    };

    // Déclaration de la fonction pour vérifier les inputs
    const verifierInput = (value, type, setValide, setValue) => {
        const regexpEmail =
            /[a-zA-Z0-9!#$%&'*+\-\/=?^_`{|}~.]+@[a-zA-Z0-9]+\.[a-z]+/g;
        if (
            (type === "email" && isEmailValid(value, regexpEmail)) ||
            (type === "motDePasse" && value.length >= 6)
        ) {
            setValide(true);
            setValue(value);
        } else {
            setValide(false);
            setValue(value);
        }
    };

    return (
        <ConnexionWrapper>
            <ConnexionArticle theme={theme}>
                <StyledTitleH1 theme={theme}>
                    {identificationType === "connexion"
                        ? "Connectez-vous !"
                        : "Créez votre compte !"}
                </StyledTitleH1>
                <ConnexionFrom theme={theme}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="mail"
                        id="mail"
                        value={emailValue}
                        placeholder="Votre Email ici"
                        required
                        onChange={(e) =>
                            verifierInput(
                                e.target.value,
                                "email",
                                setEmailValide,
                                setEmailValue
                            )
                        }
                    ></input>
                    <EmailAlertText emailValide={emailValide}>
                        Veuillez renseigner correctement le champs Email
                    </EmailAlertText>
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        type="password"
                        id="password"
                        value={motDePasseValue}
                        placeholder="Votre mot de passe ici"
                        required
                        onChange={(e) =>
                            verifierInput(
                                e.target.value,
                                "motDePasse",
                                setMotDePasseValide,
                                setMotDePasseValue
                            )
                        }
                    ></input>
                    <MotDePasseAlertText motDePasseValide={motDePasseValide}>
                        Veuillez choisir un mot de passe avec au minimum 6
                        caractère
                    </MotDePasseAlertText>
                    <StyledButton
                        onClick={(e) =>
                            identificationType === "connexion"
                                ? identification(
                                      e,
                                      "connexion",
                                      emailValue,
                                      motDePasseValue
                                  )
                                : identification(
                                      e,
                                      "creation",
                                      emailValue,
                                      motDePasseValue
                                  )
                        }
                        $isActivated
                        theme={theme}
                    >
                        {identificationType === "connexion"
                            ? "Connexion"
                            : "Création"}
                    </StyledButton>
                </ConnexionFrom>
                {identificationType === "connexion" && (
                    <CreationContainer>
                        <StyledTitleH2 theme={theme}>
                            Ou créez votre compte
                        </StyledTitleH2>
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
                    </CreationContainer>
                )}
            </ConnexionArticle>
        </ConnexionWrapper>
    );
};

export default Connexion;
