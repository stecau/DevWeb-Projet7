/*-------------------------------------------------------------------------------------------*/
/* Définition de la page CompteForm pour notre application React 'app' pour notre FrontEnd : */
/*-------------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs et de nos styles personnalisés */
import couleurs from "../../../utils/style/couleurs";

/* Importation de notre composant 'FormInput' */
import FormInput from "../../FormInput";
/* Importation de notre composant 'CompteMDP' */
import CompteMDP from "../CompteMDP";

/* Importation de notre Hook 'useTheme' */
import { useTheme, useUtilisateurInfo, useRemplirFormulaireCompte } from "../../../utils/hooks";

const CompteFromBloc = styled.form`
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => (theme === "clair" ? couleurs.fontClair : couleurs.fontSombre)};
    padding: 10px;
`;

// Définition du composant fonction 'CompteForm'
const CompteForm = () => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // Hook pour les infos de l'utilisateur et leur gestion (retour de requête)
    const { utilisateur } = useUtilisateurInfo();
    // Hook pour la gestion du changement des valeurs dans le formulaire (par utilisateur) ou la mise à jour après (refresh, modif, get)
    const { utilisateurDonnees, definirUtilisateurDonnees } = useRemplirFormulaireCompte();

    return (
        <CompteFromBloc theme={theme}>
            <FormInput id="email" state={utilisateurDonnees} majState={definirUtilisateurDonnees} admin={utilisateur.isAdmin} />
            <CompteMDP />
            <FormInput id="nom" state={utilisateurDonnees} majState={definirUtilisateurDonnees} admin={utilisateur.isAdmin} />
            <FormInput id="prenom" state={utilisateurDonnees} majState={definirUtilisateurDonnees} admin={utilisateur.isAdmin} />
            <FormInput id="poste" state={utilisateurDonnees} majState={definirUtilisateurDonnees} admin={utilisateur.isAdmin} />
        </CompteFromBloc>
    );
};

export default CompteForm;
