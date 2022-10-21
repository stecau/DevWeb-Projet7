/*----------------------------------------------------------------------------------------------*/
/* Définition d'un composant FormInput pour notre application React 'app' pour notre FrontEnd : */
/*----------------------------------------------------------------------------------------------*/

/* Importation du modules 'Fragment' de React */
import { Fragment } from "react";

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";

const AlerteTexte = styled.p`
    color: red;
    font-size: 0.8em;
    margin: 0;
    padding: 0 0 5px 0;
    display: ${({ inputValide }) => (inputValide ? "none" : "block")};
`;

// Définition du composant (fonction) 'FormInput'
const FormInput = ({ id, state, majState, modification, admin }) => {
    // Définition des variables en fonction de l'id de l'input
    let disabled = false;
    let labelTexte = "";
    let type = "";
    let inputObjet = {};
    let placeholder = "";
    let alerteTexte = "";
    switch (id) {
        case "email":
            if (admin) disabled = true;
            labelTexte = "Email";
            type = "mail";
            inputObjet = state.email;
            placeholder = "Votre Email ici";
            alerteTexte = "Veuillez renseigner correctement le champs Email";
            break;

        case "motDePasse":
            labelTexte = "Mot de passe";
            type = "password";
            inputObjet = state.motDePasse;
            placeholder = "Votre mot de passe ici";
            alerteTexte = "Veuillez choisir un mot de passe avec au minimum 6 caractère";
            break;

        case "titre":
            labelTexte = "Titre :";
            type = "text";
            inputObjet = state.titre;
            placeholder = "Votre titre ici";
            alerteTexte = "Veuillez renseigner correctement le champs 'Titre'";
            break;

        case "texte":
            labelTexte = "Texte :";
            type = "text";
            inputObjet = state.texte;
            placeholder = "Votre texte ici";
            alerteTexte = "Veuillez renseigner correctement le champs 'Texte'";
            break;

        case "image":
            if (admin) disabled = true;
            if (modification) {
                labelTexte = "Image (si vous souhaitez la modifier) :";
            } else {
                labelTexte = "Image (obligatoire) :";
            }
            type = "file";
            inputObjet = state.image;
            alerteTexte = "Veuillez sélectionner une image";
            break;

        case "ancienMDP":
            labelTexte = "Mot de passe actuel :";
            type = "text";
            inputObjet = state.ancienMDP;
            placeholder = "Mot de passe actuel";
            alerteTexte = "Veuillez choisir un mot de passe avec au minimum 6 caractère";
            break;

        case "nouveauMDP1":
            labelTexte = "Nouveau mot de passe :";
            type = "password";
            inputObjet = state.nouveauMDP1;
            placeholder = "Nouveau mot de passe";
            alerteTexte = "Veuillez choisir un mot de passe avec au minimum 6 caractère";
            break;

        case "nouveauMDP2":
            labelTexte = "Nouveau mot de passe (vérification) :";
            type = "password";
            inputObjet = state.nouveauMDP2;
            placeholder = "Nouveau mot de passe";
            alerteTexte = "Les deux nouveaux mots de passe ne sont pas identiques";
            break;

        case "nom":
            if (admin) disabled = true;
            labelTexte = "Nom :";
            type = "text";
            inputObjet = state.nom;
            placeholder = "Votre nom ici";
            alerteTexte = "Veuillez renseigner correctement le champs Nom";
            break;

        case "prenom":
            if (admin) disabled = true;
            labelTexte = "Prénom :";
            type = "text";
            inputObjet = state.prenom;
            placeholder = "Votre prénom ici";
            alerteTexte = "Veuillez renseigner correctement le champs Prénom";
            break;

        case "poste":
            if (admin) disabled = true;
            labelTexte = "Poste :";
            type = "text";
            inputObjet = state.poste;
            placeholder = "Votre poste ici";
            alerteTexte = "Veuillez renseigner correctement le champs Poste";
            break;

        default:
            break;
    }

    // Gestionnaire et vérificateur de l'input
    const gestionInput = (event) => {
        const regexpEmail = /[a-zA-Z0-9!#$%&'*+\-\/=?^_`{|}~.]+@[a-zA-Z0-9]+\.[a-z]+/g;
        const { id, value, files } = event.target;
        if (
            (id === "email" && estEmailValide(value, regexpEmail)) ||
            (id === "motDePasse" && value.length >= 6) ||
            (id === "ancienMDP" && value.length >= 6) ||
            (id === "nom" && value.length >= 0) ||
            (id === "prenom" && value.length >= 0) ||
            (id === "poste" && value.length >= 0) ||
            (((id === "titre" && value.length > 0) || (id === "texte" && value.length > 0)) &&
                value.indexOf("<script>") === -1 &&
                value.indexOf("select *") === -1 &&
                value.indexOf("or 1=1") === -1 &&
                value.indexOf("or 1=2") === -1 &&
                value.indexOf("OUTFILE") === -1)
        ) {
            majState((ancienneDonnees) => {
                return {
                    ...ancienneDonnees,
                    [id]: {
                        valeur: value,
                        valide: true,
                    },
                };
            });
        } else if (id === "image") {
            if (files.hasOwnProperty("0")) {
                majState((ancienneDonnees) => {
                    return {
                        ...ancienneDonnees,
                        [id]: {
                            valeur: files[0],
                            valide: true,
                        },
                    };
                });
            }
        } else if (id === "nouveauMDP2" && state.nouveauMDP1.valeur === value) {
            majState((ancienneDonnees) => {
                return {
                    ...ancienneDonnees,
                    [id]: {
                        valeur: value,
                        valide: true,
                    },
                };
            });
        } else if (id === "nouveauMDP1") {
            if (value.length >= 6) {
                majState((ancienneDonnees) => {
                    return {
                        ...ancienneDonnees,
                        [id]: {
                            valeur: value,
                            valide: true,
                        },
                    };
                });
            } else {
                majState((ancienneDonnees) => {
                    return {
                        ...ancienneDonnees,
                        [id]: {
                            valeur: value,
                            valide: false,
                        },
                    };
                });
            }
            if (value !== state.nouveauMDP2.valeur) {
                majState((ancienneDonnees) => {
                    return {
                        ...ancienneDonnees,
                        nouveauMDP2: {
                            valeur: ancienneDonnees.nouveauMDP2.valeur,
                            valide: false,
                        },
                    };
                });
            } else {
                majState((ancienneDonnees) => {
                    return {
                        ...ancienneDonnees,
                        nouveauMDP2: {
                            valeur: ancienneDonnees.nouveauMDP2.valeur,
                            valide: true,
                        },
                    };
                });
            }
        } else {
            majState((ancienneDonnees) => {
                return {
                    ...ancienneDonnees,
                    [id]: {
                        valeur: value,
                        valide: false,
                    },
                };
            });
        }
    };

    // Fonction pour la validation d'un Email
    const estEmailValide = (inputEmail, regexpEmail) => {
        if (regexpEmail.test(inputEmail)) {
            const longueurEmail = inputEmail.length;
            if (regexpEmail[Symbol.match](inputEmail) != null) {
                const longueurRegexpEmail = regexpEmail[Symbol.match](inputEmail)[0].length;
                return longueurEmail === longueurRegexpEmail;
            }
        }
        return false;
    };

    return (
        <Fragment>
            <label htmlFor={id}>{labelTexte}</label>
            {id === "texte" ? (
                <textarea
                    type={type}
                    id={id}
                    value={inputObjet.valeur}
                    placeholder={placeholder}
                    required
                    disabled={disabled}
                    onChange={gestionInput}
                ></textarea>
            ) : id === "image" ? (
                <input type="file" id={id} name="image" required disabled={disabled} onChange={gestionInput}></input>
            ) : (
                <input
                    type={type}
                    id={id}
                    value={inputObjet.valeur}
                    placeholder={placeholder}
                    required
                    disabled={disabled}
                    onChange={gestionInput}
                ></input>
            )}
            <AlerteTexte inputValide={inputObjet.valide}>{alerteTexte}</AlerteTexte>
        </Fragment>
    );
};

export default FormInput;
