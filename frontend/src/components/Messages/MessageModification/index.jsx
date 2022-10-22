/* REMPLACER PAR MessageForm qui combine création et modification d'un message */

/*----------------------------------------------------------------------------------------------------*/
/* Définition du composant 'MessageModification' pour notre application React 'app' pour notre FrontEnd : */
/*----------------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import couleurs from "../../../utils/style/couleurs";
/* Importation de notre style spécifique de lien */
import { StyleButton } from "../../../utils/style/Atomes";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Importation de notre composant 'Chargement' */
import Chargement from "../../Chargement";

/* importation du hook 'useContext' de React */
import { useState, useEffect } from "react";

/* Importation de notre Hook 'useTheme' */
import { useTheme, useFetch, useIdentification } from "../../../utils/hooks";

const MessageForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0;
    padding: 10px;
    color: ${({ theme }) => (theme === "clair" ? couleurs.tertiaire : couleurs.secondaire)};
`;

const MessageFieldset = styled.fieldset`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledLegend = styled.legend`
    border-color: ${({ theme }) => (theme === "clair" ? couleurs.tertiaire : couleurs.secondaire)};
`;

const StyledTitle = styled.h1`
    margin: 10px 0;
    color: ${({ theme }) => (theme === "clair" ? couleurs.primaire : couleurs.secondaire)};
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: ${({ $width }) => $width};
`;

const ButtonTexte = styled.span`
    font-size: ${({ $size }) => ($size ? $size : "12px")};
    padding-left: 5px;
`;

const AlertText = styled.p`
    color: red;
    font-size: 0.8em;
    margin: 0;
    padding: 0 0 5px 0;
    display: ${(props) =>
        (props.titreValide && props.type === "titre") || (props.texteValide && props.type) === "texte" ? "none" : "block"};
`;

const MessageModification = ({ appMessage, obtenirAppMessage, definirModificationMessageActive }) => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    const { identificationType } = useIdentification();

    // UseState pour récupérer l'image du message
    const [imageValue, setImageValue] = useState(undefined);
    // UseState pour récupérer le titre du message et sa validation
    const [titreValue, setTitreValue] = useState("");
    const [titreValide, setTitreValide] = useState(true);
    // UseState pour récupérer le texte du message et sa validation
    const [texteValue, setTexteValue] = useState("");
    const [texteValide, setTexteValide] = useState(true);

    // UseState d'affichage du block suppression image
    const [showButtonContainer, setShowButtonContainer] = useState(false);

    // UseState de l'url pour les requêtes Fetch
    const [url, definirUrl] = useState("");
    // UseState de l'objet init pour les requêtes Fetch
    const [fetchParamObjet, definirFetchParamObjet] = useState({});
    // UseState pour le déclenchement de la création d'un message
    const [donneesModificationMessage, definirDonneesModificationMessage] = useState({});
    // UseState des informations sur la requête
    const [infoFetch, definirInfoFetch] = useState({
        typeFetch: "",
        donneesMessage: "",
        alerteMessage: "",
        erreurMessage: "",
    });

    // Hook personnalisé pour effectuer les requêtes fetch
    const { donnees, enChargement, erreur } = useFetch(url, fetchParamObjet, infoFetch);

    // Déclenchement de l'affichage des informations du message (initial)
    useEffect(() => {
        setTitreValue(appMessage.titre);
        setTexteValue(appMessage.content);
        setImageValue(appMessage.imageUrl);
        if (appMessage.imageUrl !== null) {
            setShowButtonContainer(true);
        } else {
            setImageValue(undefined);
        }
    }, []);

    // Déclanchement de la requête pour la modification d'un message
    useEffect(() => {
        if (titreValide && texteValide) {
            if (
                donneesModificationMessage.hasOwnProperty("titre") &&
                donneesModificationMessage.hasOwnProperty("content") &&
                donneesModificationMessage.hasOwnProperty("imageUrl") &&
                donneesModificationMessage.imageUrl !== undefined
            ) {
                // Récupération du token
                const token = identificationType.token;

                definirUrl(`http://localhost:4000/api/posts/${appMessage._id}`);
                // Gestion si creation avec un fichier image ou pas (multiform ou json)
                if (typeof donneesModificationMessage.imageUrl === "object" && donneesModificationMessage.imageUrl != null) {
                    // Creation du 'init' avec multipart/form-data 'formData' pour le Content-type
                    const formData = new FormData();
                    formData.append("image", donneesModificationMessage.imageUrl);
                    formData.append(
                        "post",
                        JSON.stringify({
                            titre: donneesModificationMessage.titre,
                            content: donneesModificationMessage.content,
                        })
                    );
                    definirFetchParamObjet({
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    });
                } else {
                    // Création du 'init' avec JSON (Content-Type": "application/json" et body JSON.stringify)
                    definirFetchParamObjet({
                        method: "PUT",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(donneesModificationMessage),
                    });
                }
                definirInfoFetch({
                    typeFetch: "MessageModification",
                    donneesMessage: "Modification du message terminée",
                    alerteMessage: "Modification du message : ",
                    erreurMessage: "Erreur pour la modification du message : [ ",
                });
            } else {
                alert("Image absente du message !");
            }
        } else {
            alert("Contenu des champs Titre, Texte et/ou image inadéquat !");
        }
    }, [donneesModificationMessage]);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        // Fetch de modification
        if (donnees.hasOwnProperty("message")) {
            if (donnees.message === "Message modifié") {
                // Fetch pour actualisation du message
                // Mise à jour de appMessage avec une requête get le message
                const token = identificationType.token;
                definirUrl(`http://localhost:4000/api/posts/${appMessage._id}`);
                definirFetchParamObjet({
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                definirInfoFetch({
                    typeFetch: "getMessage",
                    donneesMessage: "Récupération du message terminée",
                    alerteMessage: "Consultation du message : ",
                    erreurMessage: "Erreur pour la consultation du message : [ ",
                });
            }
        }
        // Fetch de modification
        if (donnees.hasOwnProperty("_id")) {
            obtenirAppMessage(donnees);
            definirModificationMessageActive(0);
        }
    }, [donnees]);

    // Erreur lors d'une requête Fetch
    if (erreur) {
        return <span>Oups il y a eu un problème</span>;
    }

    // Déclaration de la fonction pour vérifier les inputs (titre et texte)
    const verifierInput = (value, type, setValide, setValue) => {
        if (
            ((type === "titre" && value.length > 0) || (type === "texte" && value.length > 0)) &&
            value.indexOf("<script>") === -1 &&
            value.indexOf("select *") === -1 &&
            value.indexOf("or 1=1") === -1 &&
            value.indexOf("or 1=2") === -1 &&
            value.indexOf("OUTFILE") === -1
        ) {
            setValide(true);
            setValue(value);
        } else {
            setValide(false);
            setValue(value);
        }
    };

    return enChargement ? (
        <Chargement />
    ) : (
        <MessageForm theme={theme}>
            <StyledTitle theme={theme}>Modification d'un message</StyledTitle>
            <MessageFieldset>
                <StyledLegend theme={theme}>Contenu :</StyledLegend>
                <label htmlFor="titre">Titre :</label>
                <input
                    type="text"
                    id="titre"
                    value={titreValue}
                    placeholder="Votre titre ici"
                    required
                    onChange={(e) => {
                        verifierInput(e.target.value, "titre", setTitreValide, setTitreValue);
                    }}
                ></input>
                <AlertText titreValide={titreValide} type="titre">
                    Veuillez renseigner correctement le champs
                </AlertText>
                <label htmlFor="texte">Texte</label>
                <textarea
                    type="text"
                    id="texte"
                    value={texteValue}
                    placeholder="Votre texte ici"
                    required
                    onChange={(e) => {
                        verifierInput(e.target.value, "texte", setTexteValide, setTexteValue);
                    }}
                ></textarea>
                <AlertText texteValide={texteValide} type="texte">
                    Veuillez renseigner correctement le champs
                </AlertText>
            </MessageFieldset>
            <MessageFieldset>
                <StyledLegend theme={theme}>Illustration :</StyledLegend>
                {showButtonContainer && typeof imageValue === "string" && (
                    <div>
                        <label htmlFor="suppression">Supprimer l'image du message uniquement :</label>
                        <ButtonContainer $width="100%">
                            <p>
                                {imageValue !== undefined && typeof imageValue === "string"
                                    ? imageValue.split("/images/")[1]
                                    : imageValue.name}
                            </p>
                            <StyleButton
                                theme={theme}
                                $estMessage
                                $estFlex
                                onClick={(e) => {
                                    e.preventDefault();
                                    setImageValue(undefined);
                                    const inputSelectionFile = document.getElementById("image");
                                    inputSelectionFile.type = "text";
                                    inputSelectionFile.type = "file";
                                    setShowButtonContainer(false);
                                }}
                            >
                                <FontAwesomeIcon className={"normalIconRed"} icon="fa-regular fa-circle-xmark" />
                            </StyleButton>
                        </ButtonContainer>
                        <p>----- OU -----</p>
                    </div>
                )}
                <label htmlFor="image">
                    Choisir une image pour {showButtonContainer && "un remplacement d'image dans"} le message (facultatif) :
                </label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={(e) => {
                        setImageValue(e.target.files[0]);
                    }}
                ></input>
            </MessageFieldset>
            <ButtonContainer $width="100%">
                <StyleButton
                    theme={theme}
                    $estMessage
                    $estFlex
                    $estJaime
                    onClick={(e) => {
                        e.preventDefault();
                        definirDonneesModificationMessage({
                            titre: titreValue,
                            content: texteValue,
                            imageUrl: imageValue,
                        });
                    }}
                >
                    <FontAwesomeIcon className={"normalIcon"} icon="fa-solid fa-envelope-circle-check" />
                    <ButtonTexte>Modifier</ButtonTexte>
                </StyleButton>
                <StyleButton
                    theme={theme}
                    $estMessage
                    $estFlex
                    $estJaime
                    onClick={(e) => {
                        e.preventDefault();
                        definirModificationMessageActive(0);
                    }}
                >
                    <FontAwesomeIcon className={"normalIcon"} icon="fa-regular fa-circle-left" />
                    <ButtonTexte>Annuler</ButtonTexte>
                </StyleButton>
            </ButtonContainer>
        </MessageForm>
    );
};

export default MessageModification;
