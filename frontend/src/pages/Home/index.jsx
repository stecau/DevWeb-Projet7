/*-------------------------------------------------------------------------------------*/
/* Définition de la page Home pour notre application React 'app' pour notre FrontEnd : */
/*-------------------------------------------------------------------------------------*/

/* Importation du module 'styled' de 'styled-components' */
import styled from "styled-components";
/* Importation des couleurs de notre style */
import colors from "../../utils/style/colors";
import { Loader } from "../../utils/style/Atoms";

/* importation du hook 'useContext' de React */
import { useState, useContext, useEffect } from "react";

/* Importation de notre Hook 'useTheme' */
import { useTheme } from "../../utils/hooks";

/* Importation de notre connexion context */
import { ConnexionContext } from "../../utils/context";

/* Importation de notre composant 'Card' */
import Card from "../../components/Card";

const HomeWrapper = styled.article`
    display: flex;
    justify-content: center;
`;

const HomeContainer = styled.section`
    margin: 30px;
    background-color: ${({ theme }) =>
        theme === "light" ? colors.backgroundLight : colors.backgroundDark};
    padding: 60px 90px;
    display: flex;
    flex-direction: row;
    max-width: 1200px;
`;

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const getMessagesFromDatabase = async (setLoading) => {
    setLoading(true);
    const token = JSON.parse(window.localStorage.getItem("groupomania")).token;
    const allMessages = await getAllMessagesFromDatabase(token);
    setLoading(false);
    return allMessages;
};

const getAllMessagesFromDatabase = async (token) => {
    try {
        const response = await fetch("http://localhost:4000/api/posts", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!data.error) {
            // Consultation des messages réussie
            return data;
        } else {
            alert(`Consultation des messages : ${data.error.message}`);
        }
    } catch (err) {
        // An error occured
        alert(`Erreur pour la consultation des messages : [ ${err} ]`);
    }
};

const Home = () => {
    const { theme } = useTheme();
    const { identificationType } = useContext(ConnexionContext);
    // Déclaration du status du 'loader' en attendant la fin de la requête avec le 'state'
    const [isLoading, setLoading] = useState(false);
    const [appAllMessages, setAppAllMessages] = useState([]);

    useEffect(() => {
        const getMessages = async () => {
            if (identificationType.type === "connecté") {
                const allMessages = await getMessagesFromDatabase(setLoading);
                setAppAllMessages(allMessages);
            }
        };
        getMessages();
    }, [identificationType]);

    return (
        <HomeWrapper>
            <HomeContainer theme={theme}>
                {isLoading ? (
                    <LoaderWrapper>
                        <Loader />
                    </LoaderWrapper>
                ) : (
                    <Card appAllMessages={appAllMessages} />
                )}
            </HomeContainer>
        </HomeWrapper>
    );
};

export default Home;
