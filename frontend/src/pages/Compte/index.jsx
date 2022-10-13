/*---------------------------------------------------------------------------------------*/
/* Définition de la page Compte pour notre application React 'app' pour notre FrontEnd : */
/*---------------------------------------------------------------------------------------*/

/* importation du hook 'useState' et 'useContext' de React */
import { useContext, useEffect, useState } from "react";
/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";
import { Loader } from "../../utils/style/Atoms";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../utils/context";

/* Impotation de notre composant 'CompteDefault' */
import CompteDefault from "../../components/Compte/CompteDefault";
/* Impotation de notre composant 'CompteShow' */
import CompteShow from "../../components/Compte/Compte";

const CompteWrapper = styled.article`
    display: flex;
    justify-content: center;
`;

const CompteContainer = styled.section`
    margin: 30px;
    background-color: ${({ theme }) =>
        theme === "light" ? colors.backgroundLight : colors.backgroundDark};
    padding: 60px 90px;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
`;

const StyledTitleH1 = styled.h1`
    max-width: 600px;
    line-height: 50px;
    color: ${({ theme }) =>
        theme === "light" ? colors.primary : colors.secondary};
`;

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

// Fonction pour générer un token falcifier pour le localStorage
const generateurFalseToken = (data, reverse = false) => {
    /* Mise dans le local storage d'un string contenant :
    l'ensemble des informations d'identifacation séparée par @
    (token)type@(connecté)em(aà-il@(email)id@(id)token
    {
        ...identificationType,
        token: utilisateur.token}
    } */
    if (reverse) {
        // data est un string
        const stringToParse = `{\"token\":${data.split("ty-pe@q")[0]}\", 
        \"type\":\"${data.split("ty-pe@q")[1].split("em(aà-il@")[0]}\", 
        \"email\":\"${
            data.split("ty-pe@q")[1].split("em(aà-il@")[1].split("id@")[0]
        }\", 
            \"id\":\"${data
                .split("ty-pe@q")[1]
                .split("em(aà-il@")[1]
                .split("id@")[1]
                .replace("toenk", "")}}`;
        const objectResult = JSON.parse(stringToParse);
        objectResult.id = parseInt(objectResult.id, 10);
        return objectResult;
    } else {
        // data est un string
        const stringResult = `${data.token}ty-pe@q${"connecté"}em(aà-il@${
            data.email
        }id@${data.id}toenk`;
        return stringResult;
    }
};

const getUtilisateurFromDatabase = async (id) => {
    const token = generateurFalseToken(
        window.localStorage.getItem("groupomania"),
        "reverse"
    ).token;
    const utilisateur = await getUtilisateur(id, token);
    return utilisateur;
};

const getUtilisateur = async (id, token) => {
    try {
        const response = await fetch(`http://localhost:4000/api/auth/${id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!data.error) {
            // Consultation de l'utilisateur réussie
            return data;
        } else {
            alert(`Récupération d'un compte échouée : ${data.error.message}`);
        }
    } catch (err) {
        // An error occured
        alert(`Erreur de récupération d'un compte : [ ${err} ]`);
    }
};

const Compte = () => {
    const { theme } = useTheme();

    // Déclaration du status du 'loader' en attendant la fin de la requête avec le 'state'
    const [isLoading, setLoading] = useState(false);
    const { identificationType, setIdentificationType } =
        useContext(ConnexionContext);
    const [utilisateur, setUtilisateur] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("groupomania")) {
                // Generation d'un token falcifié pour le localStorage
                const tokenObject = generateurFalseToken(
                    window.localStorage.getItem("groupomania"),
                    "reverse"
                );
                setIdentificationType({ ...tokenObject });
            }
        }
    }, []);

    useEffect(() => {
        const getUtilisateur = async () => {
            if (identificationType.type === "connecté") {
                setLoading(true);
                const utilisateur = await getUtilisateurFromDatabase(
                    identificationType.id
                );
                setLoading(false);
                setUtilisateur(utilisateur);
            }
        };
        console.log("toto");
        getUtilisateur();
    }, [identificationType]);

    return (
        <CompteWrapper>
            <CompteContainer theme={theme}>
                <StyledTitleH1 theme={theme}>
                    Mon compte Groupomania
                </StyledTitleH1>
                {identificationType.type !== "connecté" ? (
                    <CompteDefault />
                ) : isLoading ? (
                    <LoaderWrapper>
                        <Loader />
                    </LoaderWrapper>
                ) : (
                    <CompteShow
                        utilisateur={utilisateur}
                        setUtilisateur={setUtilisateur}
                    />
                )}
            </CompteContainer>
        </CompteWrapper>
    );
};

export default Compte;
