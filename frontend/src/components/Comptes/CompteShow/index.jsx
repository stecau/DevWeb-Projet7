/*---------------------------------------------------------------------------------------*/
/* Définition de la page Compte pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------*/

/* importation du hook 'useState' et 'useContext' de React */
import { useState, useEffect } from "react";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../../utils/style/colors";
import { Loader } from "../../../utils/style/Atoms";
/* Importation de notre style spécifique de lien */
import { StyledButton } from "../../../utils/style/Atoms";

/* Importation de notre Hook 'useTheme' */
import {
    useTheme,
    useChangeMDP,
    useIdentification,
    useFetch,
} from "../../../utils/hooks";

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

const CompteShow = () => {
    const { theme } = useTheme();
    const { changeMDP, toggleChangeMDP } = useChangeMDP();
    const { identificationType, updateIdentificationType } =
        useIdentification();

    // UseState pour le lancement de la requête Fetch d'obtention des informations d'un utilisateur
    const [utilisateur, setUtilisateur] = useState("");

    // UseState pour la gestion du formulaire
    const [modifiedutilisateur, setModifiedutilisateur] = useState({});
    const [emailValue, setEmailValue] = useState("");
    const [emailValide, setEmailValide] = useState(true);
    const [motDePasseValue, setMotDePasseValue] = useState("");
    const [motDePasseValide, setMotDePasseValide] = useState(true);
    const [newMotDePasse1Value, setNewMotDePasse1Value] = useState("");
    const [newMotDePasse1Valide, setNewMotDePasse1Valide] = useState(true);
    const [newMotDePasse2Value, setNewMotDePasse2Value] = useState("");
    const [newMotDePasse2Valide, setNewMotDePasse2Valide] = useState(true);
    const [nomValue, setNomValue] = useState("");
    const [prenomValue, setPrenomValue] = useState("");
    const [posteValue, setPosteValue] = useState("");

    // UseState pour le lancement des requêtes Fetch ou le refresh ou la déconnexion car suppression compte
    const [refresh, setRefresh] = useState(false);
    const [deconnexion, setDeconnexion] = useState(false);
    const [suppression, setSuppression] = useState(false);

    // UseState de l'url pour les requêtes Fetch
    const [url, setUrl] = useState("");
    // UseState de l'objet init pour les requêtes Fetch
    const [fetchParamObjet, setFetchParamObjet] = useState({});
    // UseState des informations sur la requête
    const [infoFetch, setInfoFetch] = useState({
        typeFetch: {},
        dataMessage: "",
        alertMessage: "",
        erreurMessage: "",
    });

    // Hook personnalisé pour effectuer les requêtes fetch
    const { data, isLoading, error } = useFetch(
        url,
        fetchParamObjet,
        infoFetch
    );

    // UseEffect de lancement de la requête pour obtenir les informations utilisateur à la connexion
    useEffect(() => {
        if (utilisateur === "") {
            console.log("<----- COMPTE GETUSER ----->");
            console.log(" => Lancement d'une requete GET USER");
            const token = identificationType.token;

            setUrl(`http://localhost:4000/api/auth/${identificationType.id}`);
            // Création du 'init' avec JSON (Content-Type": "application/json" et Authorization)
            setFetchParamObjet({
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setInfoFetch({
                typeFetch: {
                    type: "GetCompte",
                },
                dataMessage: "Consultation du compte terminée",
                alertMessage: "Consultation du compte : ",
                erreurMessage: "Erreur pour la consultation du compte : [ ",
            });
        }
    }, []);

    // UseEffect pour le lancement de la requête Fetch de suppression d'un compte
    useEffect(() => {
        if (suppression) {
            console.log("<----- COMPTE DELETE ----->");
            console.log(
                " => utilisation 'identificationType.token' et 'identificationType.id'"
            );
            let isConfirmed = window.confirm(
                "Etes-vous sur de vouloir supprimer votre compte et tous vos messages associés ainsi que vos votes ?"
            );
            if (isConfirmed) {
                const token = identificationType.token;
                const id = identificationType.id;

                setUrl(`http://localhost:4000/api/auth/${id}`);
                // Création du 'init' avec JSON (Content-Type": "application/json" et body JSON.stringify)
                setFetchParamObjet({
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                setInfoFetch({
                    typeFetch: {
                        type: "SuppressionCompte",
                    },
                    dataMessage: "Suppression du compte terminée",
                    alertMessage: "Suppression du compte : ",
                    erreurMessage: "Erreur pour la suppression du compte : [ ",
                });
            }
        }
    }, [suppression]);

    // useEffect pour la requête de modification d'un utilisateur
    useEffect(() => {
        // Réalisation de la requête si il y a une modification du useState modifiedutilisateur et qu'il contient le mail (=pas objet vide)
        if (modifiedutilisateur.email) {
            console.log("<----- COMPTE MODIF ----->");
            console.log(
                " => utilisation 'identificationType.token' et 'identificationType.id'"
            );
            const token = identificationType.token;
            const id = identificationType.id;
            console.log(
                " => ainsi que l'utilisateur modifié : ",
                modifiedutilisateur
            );

            setUrl(`http://localhost:4000/api/auth/${id}`);
            // Création du 'init' avec JSON (Content-Type": "application/json" et Authorization)
            setFetchParamObjet({
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(modifiedutilisateur),
            });

            setInfoFetch({
                typeFetch: {
                    type: "ModificationCompte",
                },
                dataMessage: "Modification du compte terminée",
                alertMessage: "Modification du compte : ",
                erreurMessage: "Erreur pour la modification du compte : [ ",
            });
        }
    }, [modifiedutilisateur]);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        // Fetch de get sur utilisateur avec id
        if (data.hasOwnProperty("_id")) {
            setUtilisateur(data);
            updateFormValue(data);
        }
        // Fetch de suppression
        if (data.hasOwnProperty("message")) {
            setSuppression(false);
            if (data.message === "Utilisateur supprimé") {
                console.log(" => suppression du compte -> déconnexion");
                setDeconnexion(true);
            }
        }
        // Fetch de modification
        if (data.hasOwnProperty("message")) {
            if (data.message === "Utilisateur modifié") {
                alert("Modification du compte effectuée !");
                setUtilisateur(data.utilisateur);
                updateFormValue(data.utilisateur);
            } else {
                alert(data.message);
            }
        }
    }, [data]);

    // UseEffect pour le refresh des informations du compte
    useEffect(() => {
        if (refresh) {
            console.log("<----- COMPTE REFRESH ----->");
            console.log(" => refresh du formulaire");
            updateFormValue(utilisateur);
        }
        setRefresh(false);
    }, [refresh]);

    // UseEffect pour la déconnexion (suppression du localStorage)
    useEffect(() => {
        if (deconnexion) {
            console.log("<----- COMPTE DECONNECT ----->");
            console.log(
                " => déconnection du compte -> suppression localStorage data"
            );
            if (window.localStorage.getItem("groupomania")) {
                window.localStorage.removeItem("groupomania");
            }
            console.log(
                " => déconnection du compte -> update identificationType statut"
            );
            updateIdentificationType(
                {
                    type: "connexion",
                    email: "Inconnu",
                },
                true
            );
            document.title = `Groupomania / utilisateur ${identificationType.email}`;
            console.log(identificationType);
            console.log("<----- ----- ----->");
        }
    }, [deconnexion]);

    // useEffect pour la vérification du nouveau mot de passe
    useEffect(() => {
        if (newMotDePasse1Value !== "" && newMotDePasse2Value !== "") {
            console.log(" => Vérification nouveau mot de passe");
            verifierInput(
                newMotDePasse2Value,
                "checkNewMotDePasse",
                setNewMotDePasse2Valide
            );
        }
    }, [newMotDePasse1Value, newMotDePasse2Value]);

    // Erreur lors d'une requête Fetch
    if (error) {
        return <span>Oups il y a eu un problème</span>;
    }

    // Déclaration de la fonction pour vérifier les inputs
    const verifierInput = (value, type, setValide) => {
        if (utilisateur !== "") {
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
        }
    };

    // Fonction pour la vérification avant modification du compte
    const verificationAvantModification = () => {
        console.log(
            " => Vérification avant lancement Fetch pour modification du compte"
        );
        let motDePasse = "";
        let newMotDePasse = "";
        let sauvegarde = true;
        console.log(" => Changement de mot de passe actif ? -> ", changeMDP);
        if (changeMDP) {
            if (
                motDePasseValue !== "" &&
                motDePasseValide &&
                newMotDePasse1Value !== "" &&
                newMotDePasse1Valide &&
                newMotDePasse2Value !== "" &&
                newMotDePasse2Valide
            ) {
                // Les mots de passe ont été changés et validés
                motDePasse = motDePasseValue;
                newMotDePasse = newMotDePasse1Value;
            } else {
                // Les mots de passe ont été changés mais pas validés
                // Pas de sauvegarde, mots de passe non renseignés alors que modification souhaitée
                sauvegarde = false;
                let alertTexte = [];
                if (motDePasseValue === "") setMotDePasseValide(false);
                if (newMotDePasse1Value === "") setNewMotDePasse1Valide(false);
                if (newMotDePasse2Value === "") setNewMotDePasse2Valide(false);
                if (newMotDePasse1Value !== newMotDePasse2Value)
                    setNewMotDePasse2Valide(false);
                if (motDePasseValue === "" && newMotDePasse1Value !== "") {
                    alertTexte.push(
                        "Veuillez renseigner votre mot de passe actuel !"
                    );
                } else if (newMotDePasse1Value !== newMotDePasse2Value) {
                    alertTexte.push(
                        "Veuillez renseigner deux nouveaux mots de passe identique !"
                    );
                } else {
                    alertTexte = [
                        "Veuillez vérifier les champs mot de passe !",
                    ];
                }
                alert(alertTexte.join("\n"));
            }
        }
        if (sauvegarde) {
            // Création de l'objet newutilisateur avec nouveau mot de passe
            let newutilisateur = {
                email: emailValue,
                motDePasse: motDePasse,
                newMotDePasse: newMotDePasse,
                nom: nomValue,
                prenom: prenomValue,
                poste: posteValue,
            };
            if (motDePasse === "") {
                // Modification de l'objet newutilisateur si pas de nouveau mot de passe
                delete newutilisateur.motDePasse;
                delete newutilisateur.newMotDePasse;
            }
            // Modification du useState modifiedutilisateur pour lancement de la requête Fetch de modification
            console.log(
                " => création 'nouveau compte objet' pour le lancement Fetch pour modification du compte"
            );
            setModifiedutilisateur({ ...newutilisateur });
            // console.log("utilisateur", utilisateur);
            console.log("modifiedutilisateur", newutilisateur);
        }
    };

    // Fonction to change l'affichage dans les inputs des valeurs par défaut
    const changeDefautValeur = (
        valeur,
        setValeur,
        defautValeur = null,
        nouvelleValeur = ""
    ) => {
        if (valeur === defautValeur) {
            setValeur(nouvelleValeur);
        } else {
            setValeur(valeur);
        }
    };

    // Fonction pour mettre à jour les valeurs dans le formulaire
    const updateFormValue = (objetData) => {
        setEmailValue(objetData.email);
        setMotDePasseValue("");
        changeDefautValeur(objetData.nom, setNomValue, "Ici votre nom");
        changeDefautValeur(
            objetData.prenom,
            setPrenomValue,
            "Ici votre prénom"
        );
        changeDefautValeur(objetData.poste, setPosteValue);
        console.log("update form", objetData);
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
                        disabled={utilisateur.isAdmin ? true : false}
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
                    <fieldset disabled={utilisateur.isAdmin ? true : false}>
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
                        disabled={utilisateur.isAdmin ? true : false}
                        type="text"
                        id="nom"
                        value={nomValue}
                        placeholder="Votre nom ici"
                        required
                        onChange={(e) => setNomValue(e.target.value)}
                    ></input>
                    <label htmlFor="prenom">Prénom :</label>
                    <input
                        disabled={utilisateur.isAdmin ? true : false}
                        type="text"
                        id="prenom"
                        value={prenomValue}
                        placeholder="Votre prénom ici"
                        required
                        onChange={(e) => setPrenomValue(e.target.value)}
                    ></input>
                    <label htmlFor="poste">Poste :</label>
                    <input
                        disabled={utilisateur.isAdmin ? true : false}
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
                <StyledButton
                    disabled={utilisateur.isAdmin ? true : false}
                    $isCreation
                    theme={theme}
                    onClick={() => {
                        setRefresh(true);
                    }}
                >
                    Refresh
                </StyledButton>
                <StyledButton
                    disabled={utilisateur.isAdmin ? true : false}
                    $isCreation
                    theme={theme}
                    onClick={() => verificationAvantModification()}
                >
                    Sauvegarder mes modifications
                </StyledButton>
                <StyledButton
                    disabled={utilisateur.isAdmin ? true : false}
                    $isCreation
                    theme={theme}
                    onClick={() => {
                        setSuppression(true);
                    }}
                >
                    Supprimer mon compte
                </StyledButton>
            </ButtonContainer>
        </ModificationContainer>
    );
};

export default CompteShow;
