/*------------------------------------------------------------------------------------------------------------*/
/* Définition de notre composant 'CompteSuppression' pour notre application React 'app' pour notre FrontEnd : */
/*------------------------------------------------------------------------------------------------------------*/

/* importation du hook 'useState' et 'useContext' de React */
import { useState, useEffect } from "react";

/* Importation de nos styles personnalisés */
import { StyleButton } from "../../../utils/style/Atomes";

/* Importation de notre composant 'Chargement' */
import Chargement from "../../Chargement";

/* Importation de nos Hooks 'useTheme', 'useIdentification' et 'useFetch' */
import { useTheme, useIdentification, useFetch } from "../../../utils/hooks";

// Définition du composant fonction 'CompteSuppression'
const CompteSuppression = ({ admin }) => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // identificationType pour le token, l'id de l'utilisateur et lors de la suppression d'un compte pour les requêtes
    const { identificationType, majIdentificationType } = useIdentification();

    // UseState pour le lancement des requêtes Fetch de suppression et la déconnexion car suppression compte
    const [deconnexion, setDeconnexion] = useState(false);
    const [suppression, setSuppression] = useState(false);

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

    // Hook personnalisé pour effectuer les requêtes fetch
    const { donnees, enChargement, erreur } = useFetch(url, fetchParamObjet, infoFetch);

    // UseEffect pour le lancement de la requête Fetch de suppression d'un compte
    useEffect(() => {
        if (suppression) {
            console.log("<----- COMPTE SUPPRESSION ----->");
            //console.log(" => utilisation 'identificationType.token' et 'identificationType.id'");
            let isConfirmed = window.confirm(
                "Etes-vous sur de vouloir supprimer votre compte et tous vos messages associés ainsi que vos votes ?"
            );
            if (isConfirmed) {
                const token = identificationType.token;
                const id = identificationType.id;

                definirUrl(`http://localhost:4000/api/auth/${id}`);
                // Création du 'init' avec JSON (Content-Type": "application/json" et body JSON.stringify)
                definirFetchParamObjet({
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                definirInfoFetch({
                    typeFetch: "SuppressionCompte",
                    donneesMessage: "Suppression du compte terminée",
                    alerteMessage: "Suppression du compte : ",
                    erreurMessage: "Erreur pour la suppression du compte : [ ",
                });
            }
        }
    }, [suppression]);

    // Récupération lors d'une requête Fetch
    useEffect(() => {
        // Fetch de suppression
        if (donnees.hasOwnProperty("message")) {
            setSuppression(false);
            if (donnees.message === "Utilisateur supprimé") {
                console.log("<----- FIN COMPTE SUPPRESSION ----->");
                //console.log(" => suppression du compte -> déconnexion");
                setDeconnexion(true);
            }
        }
    }, [donnees]);

    // UseEffect pour la déconnexion (suppression du localStorage)
    useEffect(() => {
        if (deconnexion) {
            console.log("<----- COMPTE DECONNECT ----->");
            console.log(" => déconnection du compte -> suppression localStorage data");
            if (window.localStorage.getItem("groupomania")) {
                window.localStorage.removeItem("groupomania");
            }
            console.log(" => déconnection du compte -> update identificationType statut");
            majIdentificationType(
                {
                    type: "connexion",
                    email: "Inconnu",
                },
                true
            );
            document.title = `Groupomania / utilisateur Inconnu`;
            console.log("<----- FIN COMPTE DECONNECT ----->");
        }
    }, [deconnexion]);

    // Erreur lors d'une requête Fetch
    if (erreur) {
        return <span>Oups il y a eu un problème</span>;
    }

    return enChargement ? (
        <Chargement />
    ) : (
        <StyleButton
            disabled={admin}
            $styleCreation
            theme={theme}
            onClick={() => {
                setSuppression(true);
            }}
        >
            Supprimer mon compte
        </StyleButton>
    );
};

export default CompteSuppression;
