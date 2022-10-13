/*---------------------------------------------------------------------------------------*/
/* Définition de la page Compte pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------*/

/* importation du hook 'useState' et 'useContext' de React */
import { useState, useContext, useEffect } from "react";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../../utils/style/colors";
import { Loader } from "../../../utils/style/Atoms";
/* Importation de notre style spécifique de lien */
import { StyledLink, StyledButton } from "../../../utils/style/Atoms";

/* Importation de notre Hook 'useTheme' */
import { useTheme, useChangeMDP } from "../../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../../utils/context";

const ModificationContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: start-flex;
`;
const StyledTitleH2 = styled.h2`
    max-width: 600px;
    line-height: 50px;
    padding: 0;
    margin: 0;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
`;

const CompteFrom = styled.form`
    display: flex;
    flex-direction: column;
    color: ${({ theme }) =>
        theme === "light" ? colors.fontLight : colors.fontDark};
    padding: 10px;
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

const NewMotDePasse1AlertText = styled.p`
    color: red;
    font-size: 0.8em;
    margin: 0;
    padding: 0 0 5px 0;
    display: ${({ newMotDePasse1Valide }) =>
        newMotDePasse1Valide ? "none" : "block"};
`;

const NewMotDePasse2AlertText = styled.p`
    color: red;
    font-size: 0.8em;
    margin: 0;
    padding: 0 0 5px 0;
    display: ${({ newMotDePasse2Valide }) =>
        newMotDePasse2Valide ? "none" : "block"};
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
`;

const ChangeMDPContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    max-width: 458px;
`;

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
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

// Fonction pour générer un token falcifier pour le localStorage
const generateurFalseToken = (data, reverse = false) => {
    /* Mise dans le local storage d'un string contenant :
    l'ensemble des informations d'identifacation séparée par @
    (token)type@(connecté)em(aà-il@(email)id@(id)token
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

// Old : $2b$10$nhL/q28iNp3fOl.KXGtbdekt05MKlUtzfEtYi8KkVX8sqJDU0xFA6
// New : $2b$10$CaD/j6v26InhaztyOGT5fOf3U7xgIuWWPhdsp4m9XxprDu82FaY9K

// const fetchCompte = async (e, type, id, token) => {
//     let url = "";
//     let method = "GET";
//     let body = "";
//     let dataMessage = "";
//     let alertMessage = "";
//     let erreurMessage = "";
//     if (type === "recupération") {
//         url = `http://localhost:4000/api/auth/${id}`;

//         dataMessage = "Utilisateur présent";
//         alertMessage = "Récupération d'un compte échouée : ";
//         erreurMessage = "Erreur de récupération d'un compte : ";
//     }
//     if (type === "connexion") {
//         url = "http://localhost:4000/api/auth/login";
//         body = JSON.stringify({
//             email: "email",
//             motDePasse: "motDePasse",
//         });
//         dataMessage = "Utilisateur connecté : ";
//         alertMessage = "Connexion échouée : ";
//         erreurMessage = "Erreur de connexion : ";
//     }
//     try {
//         let response = "";
//         if (method === "GET") {
//             response = await fetch(url);
//         } else {
//             response = await fetch(url, {
//                 method: method,
//                 headers: {
//                     Accept: "application/json",
//                     "Content-Type": "application/json",
//                 },
//                 body: body,
//             });
//         }
//         const data = await response.json();
//         if (data.message.indexOf(dataMessage) !== -1) {
//             // Connexion ou Creation réussie
//             return data;
//         } else {
//             alert(`${alertMessage}${data.message}`);
//         }
//     } catch (err) {
//         // An error occured
//         alert(`${erreurMessage}[ ${err} ]`);
//     }
// };

// const deleteUtilisateurInDatabase = async (e, type, email, motDePasse) => {
//     e.preventDefault();
//     console.log(type, email, motDePasse);
// };

const deleteUtilisateurInDatabase = async (id) => {
    const token = generateurFalseToken(
        window.localStorage.getItem("groupomania"),
        "reverse"
    ).token;
    console.log(id, token);
    const isSuppresed = await deleteUtilisateur(id, token);
    return isSuppresed;
};

const deleteUtilisateur = async (id, token) => {
    let isSuppresed = false;
    try {
        const response = await fetch(`http://localhost:4000/api/auth/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        console.log(data);
        if (data.message === "Utilisateur supprimé") {
            // Suppression de l'utilisateur réussie
            alert(`Suppression du compte effectuée !`);
            isSuppresed = true;
        } else {
            alert(`Suppression du compte échouée : ${data.message}`);
        }
    } catch (err) {
        // An error occured
        alert(`Erreur de suppression du compte : [ ${err} ]`);
    }
    return isSuppresed;
};

const updateUtilisateurInDatabase = async (id, modifiedUtilisateur) => {
    const token = generateurFalseToken(
        window.localStorage.getItem("groupomania"),
        "reverse"
    ).token;
    console.log(id, modifiedUtilisateur, token);
    const utilisateur = await updateUtilisateur(id, modifiedUtilisateur, token);
    return utilisateur;
};

const updateUtilisateur = async (id, modifiedUtilisateur, token) => {
    try {
        const response = await fetch(`http://localhost:4000/api/auth/${id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(modifiedUtilisateur),
        });
        const data = await response.json();
        if (data.utilisateur) {
            // Modification de l'utilisateur réussie
            return data.utilisateur;
        } else {
            alert(`Modification du compte échouée : ${data.message}`);
        }
    } catch (err) {
        // An error occured
        alert(`Erreur de modification du compte : [ ${err} ]`);
    }
};

const CompteShow = ({ utilisateur, setUtilisateur }) => {
    const { theme } = useTheme();
    const { changeMDP, toggleChangeMDP } = useChangeMDP();
    const { identificationType, setIdentificationType } =
        useContext(ConnexionContext);

    const [modifiedUtilisateur, setModifiedUtilisateur] = useState({});
    const [emailValue, setEmailValue] = useState(utilisateur.email);
    const [emailValide, setEmailValide] = useState(true);
    const [motDePasseValue, setMotDePasseValue] = useState("");
    const [motDePasseValide, setMotDePasseValide] = useState(true);
    const [newMotDePasse1Value, setNewMotDePasse1Value] = useState("");
    const [newMotDePasse1Valide, setNewMotDePasse1Valide] = useState(true);
    const [newMotDePasse2Value, setNewMotDePasse2Value] = useState("");
    const [newMotDePasse2Valide, setNewMotDePasse2Valide] = useState(true);
    const [nomValue, setNomValue] = useState(utilisateur.nom);
    const [prenomValue, setPrenomValue] = useState(utilisateur.prenom);
    const [posteValue, setPosteValue] = useState(utilisateur.poste);

    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        verifierInput(
            newMotDePasse2Value,
            "checkNewMotDePasse",
            setNewMotDePasse2Valide
        );
    }, [newMotDePasse1Value, newMotDePasse2Value]);

    useEffect(() => {
        const modificationCompte = async () => {
            if (modifiedUtilisateur.email) {
                setLoading(true);
                const updatedUtilisateur = await updateUtilisateurInDatabase(
                    utilisateur._id,
                    modifiedUtilisateur
                );
                if (updatedUtilisateur) {
                    alert("Modification du compte effectuée !");
                    setUtilisateur(updatedUtilisateur);
                    if (changeMDP) {
                        toggleChangeMDP();
                        setMotDePasseValue("");
                        setNewMotDePasse1Value("");
                        setNewMotDePasse2Value("");
                    }
                }
                setLoading(false);
            }
        };
        modificationCompte();
    }, [modifiedUtilisateur]);

    const refresh = () => {
        setEmailValue(utilisateur.email);
        setMotDePasseValue("");
        setNomValue(utilisateur.nom);
        setPrenomValue(utilisateur.prenom);
        setPosteValue(utilisateur.poste);
    };

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

    const suppression = () => {
        let isConfirmed = window.confirm(
            "Etes-vous sur de vouloir supprimer votre compte et tous vos messages associés ainsi que vos votes ?"
        );
        if (isConfirmed) {
            const isSuppresed = deleteUtilisateurInDatabase(utilisateur._id);
            if (isSuppresed) {
                deconnection();
            }
        }
    };

    const modifie = () => {
        let motDePasse = "";
        let newMotDePasse = "";
        let sauvegarde = true;
        if (
            motDePasseValue !== "" &&
            motDePasseValide &&
            newMotDePasse1Value !== "" &&
            newMotDePasse1Valide &&
            newMotDePasse2Valide
        ) {
            motDePasse = motDePasseValue;
            newMotDePasse = newMotDePasse1Value;
        } else {
            if (
                motDePasseValue !== "" &&
                newMotDePasse1Value !== "" &&
                newMotDePasse2Value !== ""
            ) {
                sauvegarde = false;
                if (motDePasseValue === "" && newMotDePasse1Value !== "") {
                    setMotDePasseValide(false);
                    alert("Veuillez renseigner votre mot de passe actuel !");
                } else if (newMotDePasse1Value !== newMotDePasse2Value) {
                    setNewMotDePasse2Valide(false);
                    alert(
                        "Veuillez renseigner deux nouveaux mots de passe identique !"
                    );
                } else {
                    alert("Veuillez vérifier les champs mot de passe !");
                }
            }
        }
        if (sauvegarde) {
            let newUtilisateur = {
                email: emailValue,
                motDePasse: motDePasse,
                newMotDePasse: newMotDePasse,
                nom: nomValue,
                prenom: prenomValue,
                poste: posteValue,
            };
            if (motDePasse === "") {
                delete newUtilisateur.motDePasse;
                delete newUtilisateur.newMotDePasse;
            }
            setModifiedUtilisateur({ ...newUtilisateur });
            console.log("utilisateur", utilisateur);
            console.log("modifiedUtilisateur", newUtilisateur);
        }
    };

    // Déclaration de la fonction pour vérifier les inputs
    const verifierInput = (value, type, setValide) => {
        console.log("value", value);
        console.log("motDePasseValue", motDePasseValue);
        console.log("newMotDePasse1Value", newMotDePasse1Value);
        console.log("newMotDePasse2Value", newMotDePasse2Value);
        const regexpEmail =
            /[a-zA-Z0-9!#$%&'*+\-\/=?^_`{|}~.]+@[a-zA-Z0-9]+\.[a-z]+/g;
        if (
            (type === "email" && isEmailValid(value, regexpEmail)) ||
            (type === "motDePasse" && value.length >= 6) ||
            (type === "checkNewMotDePasse" && newMotDePasse1Value === value)
        ) {
            setValide(true);
        } else {
            setValide(false);
        }
        console.log(newMotDePasse1Value);
        console.log(newMotDePasse2Value);
        console.log(newMotDePasse1Value === newMotDePasse2Value);
    };

    return (
        <ModificationContainer>
            <StyledTitleH2 theme={theme}>Mes informations</StyledTitleH2>
            {isLoading ? (
                <LoaderWrapper>
                    <Loader />
                </LoaderWrapper>
            ) : (
                <CompteFrom theme={theme}>
                    <label htmlFor="email">Email :</label>
                    <input
                        type="mail"
                        id="mail"
                        value={emailValue}
                        placeholder="Votre Email ici"
                        required
                        onChange={(e) => {
                            setEmailValue(e.target.value);
                            verifierInput(
                                e.target.value,
                                "email",
                                setEmailValide
                            );
                        }}
                    ></input>
                    <EmailAlertText emailValide={emailValide}>
                        Veuillez renseigner correctement le champs Email
                    </EmailAlertText>
                    <fieldset>
                        <legend>Mot de passe :</legend>
                        {changeMDP ? (
                            <ChangeMDPContainer>
                                <label htmlFor="oldPassword">
                                    Mot de passe actuel :
                                </label>
                                <input
                                    type="text"
                                    id="oldPassword"
                                    value={motDePasseValue}
                                    placeholder="Mot de passe actuel"
                                    required
                                    onChange={(e) => {
                                        setMotDePasseValue(e.target.value);
                                        verifierInput(
                                            e.target.value,
                                            "motDePasse",
                                            setMotDePasseValide
                                        );
                                    }}
                                ></input>
                                <MotDePasseAlertText
                                    motDePasseValide={motDePasseValide}
                                >
                                    Veuillez choisir un mot de passe avec au
                                    minimum 6 caractère
                                </MotDePasseAlertText>
                                <label htmlFor="newPassword1">
                                    Nouveau mot de passe :
                                </label>
                                <input
                                    type="password"
                                    id="newPassword1"
                                    value={newMotDePasse1Value}
                                    placeholder="Nouveau mot de passe"
                                    required
                                    onChange={(e) => {
                                        setNewMotDePasse1Value(e.target.value);
                                        verifierInput(
                                            e.target.value,
                                            "motDePasse",
                                            setNewMotDePasse1Valide
                                        );
                                    }}
                                ></input>
                                <NewMotDePasse1AlertText
                                    newMotDePasse1Valide={newMotDePasse1Valide}
                                >
                                    Veuillez choisir un mot de passe avec au
                                    minimum 6 caractère
                                </NewMotDePasse1AlertText>
                                <label htmlFor="newPassword2">
                                    Nouveau mot de passe :
                                </label>
                                <input
                                    type="password"
                                    id="newPassword2"
                                    value={newMotDePasse2Value}
                                    placeholder="Nouveau mot de passe"
                                    required
                                    onChange={(e) => {
                                        setNewMotDePasse2Value(e.target.value);
                                        verifierInput(
                                            e.target.value,
                                            "checkNewMotDePasse",
                                            setNewMotDePasse2Valide
                                        );
                                    }}
                                ></input>
                                <NewMotDePasse2AlertText
                                    newMotDePasse2Valide={newMotDePasse2Valide}
                                >
                                    Les deux nouveaux mots de passe ne sont pas
                                    identiques
                                </NewMotDePasse2AlertText>
                                <StyledButton
                                    $isCreation
                                    theme={theme}
                                    onClick={() => {
                                        toggleChangeMDP();
                                        if (changeMDP) {
                                            setMotDePasseValue("");
                                            setNewMotDePasse1Value("");
                                            setNewMotDePasse2Value("");
                                        }
                                    }}
                                >
                                    Annuler le changement de mot de passe
                                </StyledButton>
                            </ChangeMDPContainer>
                        ) : (
                            <StyledButton
                                $isCreation
                                theme={theme}
                                onClick={() => toggleChangeMDP()}
                            >
                                Changer mon mot de passe
                            </StyledButton>
                        )}
                    </fieldset>
                    <label htmlFor="nom">Nom :</label>
                    <input
                        type="text"
                        id="nom"
                        value={nomValue}
                        placeholder="Votre nom ici"
                        required
                        onChange={(e) => setNomValue(e.target.value)}
                    ></input>
                    <label htmlFor="prenom">Prénom :</label>
                    <input
                        type="text"
                        id="prenom"
                        value={prenomValue}
                        placeholder="Votre prénom ici"
                        required
                        onChange={(e) => setPrenomValue(e.target.value)}
                    ></input>
                    <label htmlFor="poste">Poste :</label>
                    <input
                        type="text"
                        id="poste"
                        value={posteValue}
                        placeholder="Votre poste ici"
                        onChange={(e) => setPosteValue(e.target.value)}
                    ></input>
                </CompteFrom>
            )}
            <StyledTitleH2 theme={theme}>Mes options</StyledTitleH2>
            <ButtonContainer>
                <StyledLink
                    to={`/compte/${""}`}
                    $isCreation
                    theme={theme}
                    onClick={() => refresh()}
                >
                    Refresh
                </StyledLink>
                <StyledButton
                    $isCreation
                    theme={theme}
                    onClick={() => modifie()}
                >
                    Sauvegarder mes modifications
                </StyledButton>
                <StyledButton
                    $isCreation
                    theme={theme}
                    onClick={() => suppression()}
                >
                    Supprimer mon compte
                </StyledButton>
            </ButtonContainer>
        </ModificationContainer>
    );
};

export default CompteShow;
