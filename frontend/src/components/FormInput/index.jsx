/*----------------------------------------------------------------------------------------------*/
/* Définition d'un composant FormInput pour notre application React 'app' pour notre FrontEnd : */
/*----------------------------------------------------------------------------------------------*/

/* Importation des modules de React */
import React from "react";

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
const FormInput = ({ id, state, majState, modification }) => {
    // Définition des variables en fonction de l'id de l'input
    let labelTexte = "";
    let type = "";
    let inputObjet = {};
    let placeholder = "";
    let alerteTexte = "";
    switch (id) {
        case "email":
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
            if (modification) {
                labelTexte = "Image (si vous souhaitez la modifier) :";
            } else {
                labelTexte = "Image (obligatoire) :";
            }
            type = "file";
            inputObjet = state.image;
            placeholder = "";
            alerteTexte = "Veuillez sélectionner une image";
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

    if (id !== "texte" && id !== "image") {
        return (
            <React.Fragment>
                <label htmlFor={id}>{labelTexte}</label>
                <input type={type} id={id} value={inputObjet.valeur} placeholder={placeholder} required onChange={gestionInput}></input>
                <AlerteTexte inputValide={inputObjet.valide}>{alerteTexte}</AlerteTexte>
            </React.Fragment>
        );
    } else if (id === "texte") {
        return (
            <React.Fragment>
                <label htmlFor={id}>{labelTexte}</label>
                <textarea type={type} id={id} value={inputObjet.valeur} placeholder={placeholder} required onChange={gestionInput}></textarea>
                <AlerteTexte inputValide={inputObjet.valide}>{alerteTexte}</AlerteTexte>
            </React.Fragment>
        );
    } else if (id === "image") {
        return (
            <React.Fragment>
                <label htmlFor={id}>{labelTexte}</label>
                <input type="file" id={id} name="image" required onChange={gestionInput}></input>
                <AlerteTexte inputValide={inputObjet.valide}>{alerteTexte}</AlerteTexte>
            </React.Fragment>
        );
    }
};

export default FormInput;
