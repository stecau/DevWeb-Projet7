/*--------------------------------------------------------------------------------------------*/
/* Définition du composant 'ButtonAvis' pour notre application React 'app' pour notre FrontEnd : */
/*--------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation de notre style spécifique de 'button' */
import { StyleButton } from "../../../utils/style/Atomes";

/* Importation des icones FontAwesome */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Importation de notre composant 'Chargement' */
import Chargement from "../../Chargement";

/* importation des hooks 'useContext', 'useState' et 'useEffect' de React */
import { useContext, useState, useEffect } from "react";

/* Importation de nos Hooks 'useTheme' et 'useFetch' */
import { useTheme, useFetch } from "../../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../../utils/context";

const ButtonConteneur = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: ${({ $width }) => $width};
`;

const ButtonTexte = styled.span`
    font-size: ${({ $size }) => ($size ? $size : "12px")};
    padding-left: 5px;
`;

// Définition du composant fonction 'ButtonAvis'
const ButtonAvis = ({ appMessage, estUtilisateur, definirEstUtilisateur }) => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // Identification pour la récupération du token et de l'id de l'utilisateur
    const { identificationType } = useContext(ConnexionContext);

    // UseState de l'url pour les requêtes Fetch
    const [url, definirUrl] = useState("");
    // UseState de l'objet init pour les requêtes Fetch
    const [fetchParamObjet, definirFetchParamObjet] = useState({});
    // UseState des informations sur la requête
    const [infoFetch, definirInfoFetch] = useState({
        typeFetch: {},
        donneesMessage: "",
        alerteMessage: "",
        erreurMessage: "",
    });
    // UseState du statut de modification de Jaime/Jadore sur les messages
    const [avisPourMessage, definirAvisPourMessage] = useState({});

    // UseState du retour de la requête sur un message avec un Avis
    const [messageAvis, obtenirMessageAvis] = useState({
        Jaime: {
            nbr: 0,
            listeId: [],
        },
        Jadore: {
            nbr: 0,
            listeId: [],
        },
    });

    // Hook personnalisé pour effectuer les requêtes fetch
    const { donnees, enChargement, erreur } = useFetch(url, fetchParamObjet, infoFetch);

    // Déclenchement de l'affichage des avis du message
    useEffect(() => {
        if (appMessage.hasOwnProperty("_id")) {
            obtenirMessageAvis({
                Jaime: {
                    nbr: appMessage.nbrJaimes,
                    listeId: appMessage.listeJaimeData,
                },
                Jadore: {
                    nbr: appMessage.nbrJadores,
                    listeId: appMessage.listeJadoreData,
                },
            });
        }
    }, [appMessage]);

    // Déclanchement de la requête pour un Jaime/Jadore ou annulation sur message
    useEffect(() => {
        if (avisPourMessage.hasOwnProperty("id")) {
            console.log("<----- AFFECTATION AVIS MESSAGE ----->");
            const token = identificationType.token;
            definirUrl(`http://localhost:4000/api/posts/${avisPourMessage.id}/avis`);
            definirFetchParamObjet({
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: `{"avis": ${avisPourMessage.avis}}`,
            });
            definirInfoFetch({
                typeFetch: {
                    type: "setAvis",
                    avis: avisPourMessage.avis,
                    button: avisPourMessage.button,
                },
                donneesMessage: "Affectation/annulation d'un Jaime/Jadore terminée",
                alerteMessage: "Affectation/annulation d'un Jaime/Jadore : ",
                erreurMessage: "Erreur pour l'affectation/annulation d'un Jaime/Jadore : [ ",
            });
        }
    }, [avisPourMessage]);

    // Récupération lors d'une requête Fetch (déclenchement avec return du fetch grâce à 'donnees')
    useEffect(() => {
        // Fetch de avis
        if (donnees.hasOwnProperty("message")) {
            if (donnees.message === "Nouveau avis enregistré" || donnees.message === "Avis supprimé") {
                console.log("<----- FIN AFFECTATION AVIS MESSAGE ----->");
                console.log("<----- ACTUALISATION MESSAGE MODIFIE ----->");
                // Mise à jour des avis avec une requête get sur le message
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
                    typeFetch: {
                        type: "getMessageAvecIdPourAvis",
                        avis: infoFetch.typeFetch.avis,
                        button: infoFetch.typeFetch.button,
                    },
                    donneesMessage: "Récupération du message terminée",
                    alerteMessage: "Consultation du message : ",
                    erreurMessage: "Erreur pour la consultation du message : [ ",
                });
            }
        }
        // Fetch sur un message avec son id après émission d'un avis
        if (donnees.hasOwnProperty("_id")) {
            console.log("<----- FIN ACTUALISATION MESSAGE MODIFIE ----->");
            if (infoFetch.typeFetch.type === "getMessageAvecIdPourAvis") {
                if (infoFetch.typeFetch.button === "Jaime") {
                    obtenirMessageAvis((ancienMessageAvis) => {
                        return {
                            ...ancienMessageAvis,
                            Jaime: {
                                nbr: donnees.nbrJaimes,
                                listeId: donnees.listeJaimeData,
                            },
                        };
                    });
                    if (infoFetch.typeFetch.avis === 1) {
                        definirEstUtilisateur((ancienneDonnees) => {
                            return {
                                ...ancienneDonnees,
                                aime: true,
                            };
                        });
                    } else {
                        definirEstUtilisateur((ancienneDonnees) => {
                            return {
                                ...ancienneDonnees,
                                aime: false,
                            };
                        });
                    }
                }
                if (infoFetch.typeFetch.button === "Jadore") {
                    obtenirMessageAvis((ancienMessageAvis) => {
                        return {
                            ...ancienMessageAvis,
                            Jadore: {
                                nbr: donnees.nbrJadores,
                                listeId: donnees.listeJadoreData,
                            },
                        };
                    });
                    if (infoFetch.typeFetch.avis === -1) {
                        definirEstUtilisateur((ancienneDonnees) => {
                            return {
                                ...ancienneDonnees,
                                adore: true,
                            };
                        });
                    } else {
                        definirEstUtilisateur((ancienneDonnees) => {
                            return {
                                ...ancienneDonnees,
                                adore: false,
                            };
                        });
                    }
                }
            }
        }
    }, [donnees]);

    // Erreur lors d'une requête Fetch
    if (erreur) {
        return <span>Oups il y a eu un problème</span>;
    }

    // Fonction pour déterminer la valeur de l'avis (-1, 0, 1) qui lancera le déclenchement de la requête (avisPourMessage)
    const definirAvisValeurPourMessage = (avisValue) => {
        if (avisValue === 1 && !estUtilisateur.aime && !estUtilisateur.adore) {
            definirAvisPourMessage({
                id: appMessage._id,
                avis: avisValue,
                button: "Jaime",
            });
            return;
        }
        if (avisValue === -1 && !estUtilisateur.adore && !estUtilisateur.aime) {
            definirAvisPourMessage({
                id: appMessage._id,
                avis: avisValue,
                button: "Jadore",
            });
            return;
        }
        if (avisValue === 1 && estUtilisateur.aime) {
            definirAvisPourMessage({
                id: appMessage._id,
                avis: 0,
                button: "Jaime",
            });
        } else if (avisValue === -1 && estUtilisateur.adore) {
            definirAvisPourMessage({
                id: appMessage._id,
                avis: 0,
                button: "Jadore",
            });
        }
    };

    // Récupération des valeurs Jaime et Jadore pour moins de code et plus de lisibilité
    const { Jaime, Jadore } = messageAvis;

    return enChargement ? (
        <Chargement />
    ) : (
        <ButtonConteneur $width="50%">
            <StyleButton
                theme={theme}
                $estMessage
                $estJaime
                $estFlex
                onClick={() => {
                    definirAvisValeurPourMessage(1);
                }}
            >
                <FontAwesomeIcon className={estUtilisateur.aime ? "aimé" : "normalJaime"} icon="fa-regular fa-thumbs-up" />
                <ButtonTexte>J'aime : {Jaime.nbr}</ButtonTexte>
            </StyleButton>
            <StyleButton
                theme={theme}
                $estMessage
                $estJaime
                $estFlex
                onClick={() => {
                    definirAvisValeurPourMessage(-1);
                }}
            >
                <FontAwesomeIcon className={estUtilisateur.adore ? "adoré" : "normalJadore"} icon="fa-regular fa-heart" />
                <ButtonTexte>J'adore : {Jadore.nbr}</ButtonTexte>
            </StyleButton>
        </ButtonConteneur>
    );
};

export default ButtonAvis;
