/*-------------------------------------------------------------------------------------------------------------*/
/* Définition de notre composant 'CompteModification' pour notre application React 'app' pour notre FrontEnd : */
/*-------------------------------------------------------------------------------------------------------------*/

/* importation du hook 'useState' et 'useContext' de React */
import { useState, useEffect } from "react";

/* Importation de nos styles personnalisés */
import { StyleButton } from "../../../utils/style/Atomes";

/* Importation de notre composant 'Chargement' */
import Chargement from "../../Chargement";

/* Importation de notre Hook 'useTheme' */
import { useTheme, useIdentification, useFetch, useChangeMDP, useUtilisateurInfo, useRemplirFormulaireCompte } from "../../../utils/hooks";

// Définition du composant fonction 'CompteModification'
const CompteModification = () => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // identificationType pour le token, l'id de l'utilisateur et modification de l'email (majIdentificationType)
    const { identificationType, majIdentificationType } = useIdentification();
    // Hook pour la gestion du changement de mot de passe
    const { changeMDP, afficherChangeMDP } = useChangeMDP();
    // Hook pour les infos de l'utilisateur et leur gestion (retour de requête)
    const { utilisateur, genererUtilisateur } = useUtilisateurInfo();
    // Hook pour la gestion du changement des valeurs dans le formulaire (par utilisateur) ou la mise à jour après (refresh, modif, get)
    const { utilisateurDonnees, definirUtilisateurDonnees } = useRemplirFormulaireCompte();

    // Récupération des donnees par type pour simplification code et clarté
    const { email, ancienMDP, nouveauMDP1, nouveauMDP2, nom, prenom, poste } = utilisateurDonnees;

    // UseState de l'url pour les requêtes Fetch
    const [url, definirUrl] = useState("");
    // UseState de l'objet init pour les requêtes Fetch
    const [fetchParamObjet, definirFetchParamObjet] = useState({});
    // UseState des informations sur la requête
    const [infoFetch, definirInfoFetch] = useState({
        typeFetch: "",
        donneesMessage: "",
        alerteMessage: "",
        erreurMessage: "",
    });
    // UseState pour l'envoi de l'utilisateur à modifier à la requête
    const [utilisateurModification, definirUtilisateurModification] = useState({});

    // Hook personnalisé pour effectuer les requêtes fetch
    const { donnees, enChargement, erreur } = useFetch(url, fetchParamObjet, infoFetch);

    // Hook personnalisé pour effectuer le remplissage des inputs du formulaires après requête de modification
    useRemplirFormulaireCompte(donnees);

    // useEffect pour la requête de modification d'un utilisateur
    useEffect(() => {
        // Réalisation de la requête si il y a une modification du useState utilisateurModification et qu'il contient le mail (=pas objet vide)
        if (utilisateurModification.email) {
            //console.log(" => utilisation 'identificationType.token' et 'identificationType.id'");
            const token = identificationType.token;
            const id = identificationType.id;
            //console.log(" => ainsi que l'utilisateur modifié : ", utilisateurModification);

            definirUrl(`http://localhost:4000/api/auth/${id}`);
            // Création du 'init' avec JSON (Content-Type": "application/json" et Authorization)
            definirFetchParamObjet({
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(utilisateurModification),
            });

            definirInfoFetch({
                typeFetch: "ModificationCompte",
                donneesMessage: "Modification du compte terminée",
                alerteMessage: "Modification du compte : ",
                erreurMessage: "Erreur pour la modification du compte : [ ",
            });
        }
    }, [utilisateurModification]);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        // Fetch de modification
        if (donnees.hasOwnProperty("message")) {
            if (donnees.message === "Utilisateur modifié") {
                alert("Modification du compte effectuée !");
                // Gestion changement du mail
                if (donnees.utilisateur.email !== utilisateur.email) {
                    console.log(" => changement du mail dans le titre du document et le footer");
                    // Changement du titre de l'onglet
                    document.title = `Groupomania / utilisateur ${donnees.utilisateur.email}`;
                    // Création de la nouvelle identification pour le mail dans le footer et le faux token
                    const nouvelleIdentification = {
                        ...identificationType,
                        email: donnees.utilisateur.email,
                    };
                    // Changement de l'email dans l'identification pour le footer
                    majIdentificationType(nouvelleIdentification, true);
                    // Changement de l'email pour le faux token
                    majIdentificationType(nouvelleIdentification);
                }
                genererUtilisateur(donnees.utilisateur);
                if (changeMDP) afficherChangeMDP();
            } else {
                alert(donnees.message);
            }
            console.log("<----- FIN COMPTE MODIF ----->");
        }
    }, [donnees]);

    // Erreur lors d'une requête Fetch
    if (erreur) {
        return <span>Oups il y a eu un problème</span>;
    }

    // Gestionnaire pour la vérification et la définition de 'utilisateurModification' pour la requête de modification du compte
    const gestionnaireModificationUtilisateur = () => {
        console.log("<----- COMPTE MODIF ----->");
        console.log(" => Vérification et définition avant lancement Fetch pour modification du compte");
        let ancien = "";
        let nouveau = "";
        let sauvegarde = true;
        console.log(" => Changement de mot de passe actif ? -> ", changeMDP);
        if (changeMDP) {
            if (
                ancienMDP.valeur !== "" &&
                ancienMDP.valide &&
                nouveauMDP1.valeur !== "" &&
                nouveauMDP1.valide &&
                nouveauMDP2.valeur !== "" &&
                nouveauMDP2.valide
            ) {
                // Les mots de passe ont été changés et validés
                ancien = ancienMDP.valeur;
                nouveau = nouveauMDP1.valeur;
            } else {
                // Les mots de passe ont été changés mais pas validés
                // Pas de sauvegarde, mots de passe non renseignés alors que modification souhaitée
                sauvegarde = false;
                let alertTexte = [];
                if (ancienMDP.valeur === "") {
                    definirUtilisateurDonnees((ancienUtilisateur) => {
                        return {
                            ...ancienUtilisateur,
                            ancienMDP: { valeur: "", valide: false },
                        };
                    });
                }
                if (nouveauMDP1.valeur === "") {
                    definirUtilisateurDonnees((ancienUtilisateur) => {
                        return {
                            ...ancienUtilisateur,
                            nouveauMDP1: { valeur: "", valide: false },
                        };
                    });
                }
                if (ancienMDP.valeur === "" && nouveauMDP1.valeur !== "") {
                    alertTexte.push("Veuillez renseigner votre mot de passe actuel !");
                } else if (nouveauMDP1.valeur !== nouveauMDP2.valeur) {
                    alertTexte.push("Veuillez renseigner deux nouveaux mots de passe identique !");
                } else {
                    alertTexte = ["Veuillez vérifier les champs mot de passe !"];
                }
                alert(alertTexte.join("\n"));
                console.log("<----- FIN COMPTE MODIF ----->");
            }
        }
        // Absence du mail => alert message
        if (email.valeur === "") {
            sauvegarde = false;
            alert("Veuillez renseigner un email !");
            console.log("<----- FIN COMPTE MODIF ----->");
        }
        if (sauvegarde) {
            // Création de l'objet newutilisateur avec nouveau mot de passe
            let newutilisateur = {
                email: email.valeur,
                motDePasse: ancien,
                newMotDePasse: nouveau,
                nom: nom.valeur,
                prenom: prenom.valeur,
                poste: poste.valeur,
            };
            if (ancien === "") {
                // Modification de l'objet newutilisateur si pas de nouveau mot de passe
                delete newutilisateur.motDePasse;
                delete newutilisateur.newMotDePasse;
            }
            // Modification du useState utilisateurDonnees pour lancement de la requête Fetch de modification
            console.log(" => création 'nouveau compte objet' pour le lancement Fetch pour modification du compte");
            definirUtilisateurModification({ ...newutilisateur });
            //console.log("utilisateurDonnees", newutilisateur);
        }
    };

    return enChargement ? (
        <Chargement />
    ) : (
        <StyleButton disabled={utilisateur.isAdmin} $styleCreation theme={theme} onClick={() => gestionnaireModificationUtilisateur()}>
            Sauvegarder mes modifications
        </StyleButton>
    );
};

export default CompteModification;
