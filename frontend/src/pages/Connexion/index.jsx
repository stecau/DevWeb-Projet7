/*------------------------------------------------------------------------------------------*/
/* Définition de la page Connexion pour notre application React 'app' pour notre FrontEnd : */
/*------------------------------------------------------------------------------------------*/

/* importation du hook 'useState' et 'useContext' de React */
import { useState, useContext } from "react";
/* importation du hook 'useNavigate' de 'react-router-dom' */
import { useNavigate } from "react-router-dom";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";
/* Importation de notre style spécifique de lien */
import { StyledLink, StyledButton } from "../../utils/style/Atoms";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../utils/context";
import { useEffect } from "react";

const ConnexionWrapper = styled.article`
    display: flex;
    justify-content: center;
`;

const ConnexionContainer = styled.section`
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

const CreationContainer = styled.div`
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

const connexionUtilisateur = async (type, email, motDePasse) => {
    let url = "";
    let body = "";
    let dataMessage = "";
    let alertMessage = "";
    let erreurMessage = "";
    if (type === "creation") {
        url = "http://localhost:4000/api/auth/signup";
        body = JSON.stringify({
            email: email,
            motDePasse: motDePasse,
            nom: "Ici votre nom",
            prenom: "Ici votre prénom",
        });
        dataMessage = "Nouvel utilisateur enregistré";
        alertMessage = "Création d'un compte échouée : ";
        erreurMessage = "Erreur de création d'un compte : ";
    }
    if (type === "connexion") {
        url = "http://localhost:4000/api/auth/login";
        body = JSON.stringify({
            email: email,
            motDePasse: motDePasse,
        });
        dataMessage = "Utilisateur connecté : ";
        alertMessage = "Connexion échouée : ";
        erreurMessage = "Erreur de connexion : ";
    }
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: body,
        });
        const data = await response.json();
        if (data.message.indexOf(dataMessage) !== -1) {
            // Connexion ou Creation réussie
            return data;
        } else {
            alert(`${alertMessage}${data.message}`);
        }
    } catch (err) {
        // An error occured
        alert(`${erreurMessage}[ ${err} ]`);
    }
};

// Fonction pour générer un token falcifier pour le localStorage
const generateurFalseToken = (data, reverse = false) => {
    /* Mise dans le local storage d'un string contenant :
    l'ensemble des informations d'identifacation séparée par @
    (token)type@(connecté)email@(email)id@(id)token
    {
        ...identificationType,
        token: utilisateur.token}
    } */
    if (reverse) {
        // data est un string
        const stringToParse = `{\"token\":${data.split("ty-pe@q")[0]}\", 
        \"type\":\"${data.split("ty-pe@q")[1].split("em(aà-il@")[0]}\", 
        \"email\":\"${
            data.split("ty-pe@q")[1].split("em(aà-il@")[1].split("id@")[0]
        }\", 
            \"id\":\"${data
                .split("ty-pe@q")[1]
                .split("em(aà-il@")[1]
                .split("id@")[1]
                .replace("toenk", "")}}`;
        const objectResult = JSON.parse(stringToParse);
        objectResult.id = parseInt(objectResult.id, 10);
        return objectResult;
    } else {
        // data est un string
        const stringResult = `${data.token}ty-pe@q${"connecté"}em(aà-il@${
            data.email
        }id@${data.id}toenk`;
        return stringResult;
    }
};

const Connexion = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [emailValue, setEmailValue] = useState("");
    const [emailValide, setEmailValide] = useState(true);
    const [motDePasseValue, setMotDePasseValue] = useState("");
    const [motDePasseValide, setMotDePasseValide] = useState(true);

    const { identificationType, setIdentificationType } =
        useContext(ConnexionContext);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("groupomania")) {
                // Generation d'un token falcifié pour le localStorage
                const tokenObject = generateurFalseToken(
                    window.localStorage.getItem("groupomania"),
                    "reverse"
                );
                setIdentificationType({ ...tokenObject });
                document.title = `Groupomania / Utilisateur ${tokenObject.email}`;
                navigate("/");
            }
        }
    }, []);

    // Déclaration de la fonction faire la requête de connexion (avec création de compte)
    const identification = async (e, type, email, motDePasse) => {
        e.preventDefault();
        let utilisateur = {};
        if (email && motDePasse) {
            if (type === "creation") {
                utilisateur = await connexionUtilisateur(
                    "creation",
                    email,
                    motDePasse
                );
            }
            if (
                type === "connexion" ||
                utilisateur.message === "Nouvel utilisateur enregistré"
            ) {
                utilisateur = await connexionUtilisateur(
                    "connexion",
                    email,
                    motDePasse
                );
                if (utilisateur) {
                    setIdentificationType({
                        type: "connecté",
                        email: email,
                        id: utilisateur.utilisateur_Id,
                    });
                    if (typeof window !== "undefined") {
                        // Generation d'un token falcifié pour le localStorage
                        window.localStorage.setItem(
                            "groupomania",
                            JSON.stringify(
                                generateurFalseToken({
                                    type: "connecté",
                                    email: email,
                                    id: utilisateur.utilisateur_Id,
                                    token: utilisateur.token,
                                })
                            )
                        );
                    }
                    document.title = `Groupomania / Utilisateur ${email}`;
                    navigate("/");
                }
            }
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
            <ConnexionContainer theme={theme}>
                <StyledTitleH1 theme={theme}>
                    {identificationType.type === "connexion"
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
                            identificationType.type === "connexion"
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
                        {identificationType.type === "connexion"
                            ? "Connexion"
                            : "Création"}
                    </StyledButton>
                </ConnexionFrom>
                <CreationContainer>
                    <StyledTitleH2 theme={theme}>
                        {identificationType.type === "connexion"
                            ? "Ou créez votre compte"
                            : ""}
                    </StyledTitleH2>
                    <StyledLink
                        to="/connexion"
                        $isCreation
                        theme={theme}
                        onClick={() => {
                            let type = "creation";
                            if (identificationType.type !== "connexion") {
                                type = "connexion";
                            }
                            setIdentificationType({
                                type: type,
                            });
                        }}
                    >
                        {identificationType.type === "connexion"
                            ? "Créer un compte"
                            : "J'ai déjà un compte"}
                    </StyledLink>
                </CreationContainer>
            </ConnexionContainer>
        </ConnexionWrapper>
    );
};

export default Connexion;
