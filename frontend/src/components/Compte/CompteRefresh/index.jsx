/*--------------------------------------------------------------------------------------------------*/
/* Définition du composant 'CompteRefresh' pour notre application React 'app' pour notre FrontEnd : */
/*--------------------------------------------------------------------------------------------------*/

/* Importation du hook 'useState' de React */
import { useState } from "react";

/* Importation des couleurs et de nos styles personnalisés */
import { StyleButton } from "../../../utils/style/Atomes";

/* Importation de notre Hook 'useTheme' et "useRemplirFormulaireCompte" */
import { useTheme, useRemplirFormulaireCompte } from "../../../utils/hooks";

// Définition du composant fonction 'CompteShow'
const CompteRefresh = ({ admin }) => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // UseState pour le lancement du refresh
    const [refresh, setRefresh] = useState(false);

    // Hook personnalisé pour effectuer le remplissage des inputs du formulaires
    useRemplirFormulaireCompte({}, refresh, setRefresh);

    // Gestionnaire pour le refresh des informations du compte => ATTENTION FAIRE UN GESTIONNAIRE CORRECT
    const gestionnaireRefresh = () => {
        if (!refresh) {
            setRefresh(true);
        }
    };

    return (
        <StyleButton disabled={admin} $styleCreation theme={theme} onClick={() => gestionnaireRefresh()}>
            Refresh
        </StyleButton>
    );
};

export default CompteRefresh;
