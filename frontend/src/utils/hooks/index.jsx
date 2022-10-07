/*---------------------------------------------------------------------------------------------*/
/* Définition des Hooks personnalisés pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------------*/

/* Importation du module 'useState', 'useEffect' et 'useContext' de React */
import { useState, useEffect, useContext } from "react";
/* Importation de notre methode 'ThemeContext' depuis le dossier 'Context' */
import { ThemeContext } from "../context";

// Déclaration de notre Hook pour la réalisation de Fetch
export function useFetch(url) {
    // Déclaration des données 'data' renvoyé par la requête avec le 'state' pour les conserver
    const [data, setData] = useState({});
    // Déclaration du status du 'loader' en attendant la fin de la requête avec le 'state'
    const [isLoading, setLoading] = useState(true);
    // Déclaration du status d'une éventuelle erreur pendant la requête avec le 'state'
    const [error, setError] = useState(false);

    // Utilisation du useEffect pour lancer la requête Fetch
    useEffect(() => {
        // S'il n'y a pas d'url retourne une valuer 'null'
        if (!url) return;
        // Déclaration d'une fonction asynchrone 'fetchData' dans le useEffect car useEffect n'est pas asynchrone
        async function fetchData() {
            // Mise en place de la structure 'try' 'catch' 'finally' pour la gestion des erreur dans la requête
            try {
                // Requête fetch avec l'url (fonction 'fetch' asynchrone => await)
                const response = await fetch(url);
                // Parse de la réponse de la requête (fonction 'json' asynchrone => await)
                const data = await response.json();
                // Appel de la fonction du useState pour la sauvegarde de 'data' dans le 'state'
                setData(data);
            } catch (err) {
                // Transmission de l'erreur et changement du status de 'erreur' dans le 'state'
                //console.log(err)
                setError(true);
            } finally {
                // Fin de la requête, changement du status pour le loader
                setLoading(false);
            }

            //setLoading(false)
        }
        // Début de la requête, changement du status pour le loader
        setLoading(true);
        // Appel de la fonction asynchrone 'fetchData' déclarée dans le useEffect
        fetchData();
    }, [url]);

    // La fonction retourne le status du loader, les données, et le status d'une éventuelle erreur
    return { isLoading, data, error };
}

// Déclaration de notre Hook pour l'utilisation du Thème 'light' ou 'dark'
export function useTheme() {
    // Récupération du contexte de 'ThemeContext'
    const { theme, toggleTheme } = useContext(ThemeContext);
    // Retourne la valeur de theme et la fonction basculement d'état du thème contenu dans l'objet 'ThemeContext'
    return { theme, toggleTheme };
}

// Déclaration de notre Hook pour permettre ou non la modification du mot de passe
export function useChangeMDP() {
    // Déclaration du boolean 'changeMDP' avec le 'state' pour les conserver
    const [changeMDP, setChangeMDP] = useState(false);
    // Déclaration d'une fonction pour changer d'état le 'changeMDP' (interrupteur on/off)
    const toggleChangeMDP = () => {
        setChangeMDP(changeMDP ? false : true);
    };
    // Retourne la valeur de changeMDP et la fonction basculement d'état du toggleChangeMDP
    return { changeMDP, toggleChangeMDP };
}
