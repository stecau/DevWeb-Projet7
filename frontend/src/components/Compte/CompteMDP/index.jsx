/*---------------------------------------------------------------------------------------*/
/* Définition de la page CompteMDP pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation de notre style personnalisé pour le 'button' */
import { StyleButton } from "../../../utils/style/Atomes";

/* Importation de nos Hook personnalisés */
import { useTheme, useChangeMDP, useUtilisateurInfo, useRemplirFormulaireCompte } from "../../../utils/hooks";

/* Importation de notre composant 'FormInput' */
import FormInput from "../../FormInput";

const ChangeMDPConteneur = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    max-width: 458px;
`;

const InputBloc = styled.div`
    ${({ $margin }) => $margin && "margin: " + $margin}
`;

// Définition du composant fonction 'CompteMDP'
const CompteMDP = () => {
    // Theme pour la gestion du mode jour et nuit
    const { theme } = useTheme();
    // Hook pour les infos de l'utilisateur et leur gestion (retour de requête)
    const { utilisateur } = useUtilisateurInfo();
    // Hook pour la gestion du changement de mot de passe
    const { changeMDP, afficherChangeMDP } = useChangeMDP();
    // Hook pour la gestion du changement des valeurs dans le formulaire (par utilisateur) ou la mise à jour après (refresh, modif, get)
    const { utilisateurDonnees, definirUtilisateurDonnees } = useRemplirFormulaireCompte();

    // Gestionnaire pour le changement ou pas de mot de passe
    const gestionnaireChangeMDP = () => {
        afficherChangeMDP();
        if (changeMDP) {
            definirUtilisateurDonnees((ancienUtilisateur) => {
                return {
                    ...ancienUtilisateur,
                    ancienMDP: { valeur: "", valide: true },
                    nouveauMDP1: { valeur: "", valide: true },
                    nouveauMDP2: { valeur: "", valide: true },
                };
            });
        }
    };

    return (
        <fieldset disabled={utilisateur.isAdmin}>
            <legend>Mot de passe :</legend>
            {changeMDP ? (
                <ChangeMDPConteneur>
                    <InputBloc>
                        <FormInput id="ancienMDP" state={utilisateurDonnees} majState={definirUtilisateurDonnees} />
                    </InputBloc>
                    <InputBloc>
                        <FormInput id="nouveauMDP1" state={utilisateurDonnees} majState={definirUtilisateurDonnees} />
                    </InputBloc>
                    <InputBloc>
                        <FormInput id="nouveauMDP2" state={utilisateurDonnees} majState={definirUtilisateurDonnees} />
                    </InputBloc>
                    <InputBloc $margin={"auto"}>
                        <StyleButton $styleCreation theme={theme} onClick={() => gestionnaireChangeMDP()}>
                            Annuler le changement de mot de passe
                        </StyleButton>
                    </InputBloc>
                </ChangeMDPConteneur>
            ) : (
                <StyleButton $styleCreation theme={theme} onClick={() => afficherChangeMDP()}>
                    Changer mon mot de passe
                </StyleButton>
            )}
        </fieldset>
    );
};

export default CompteMDP;
