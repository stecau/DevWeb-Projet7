/*--------------------------------------------------------------------*/
/* Déclaration de notre application React 'app' pour notre FrontEnd : */
/*--------------------------------------------------------------------*/

/* Importation du style de 'App : Layout' */
import '../styles/Layout.css'

/* Importation des modules/components de notre app */
import Banner from './Banner';
import Cart from './Cart';
import ShoppingList from './ShoppingList';
import Footer from './Footer'

/* Importation du logo */
import logo from '../assets/logo.png'

/* Importation du module 'useState' de react */
import { useState, useEffect } from 'react'

/* Création du component 'App' avec la function du même nom */
const App = () => {
    // Récupération du panier dans le localStorage
    const savedCart = localStorage.getItem("LaMaisonJungle");
    console.log("Panier dans localStorage : ", JSON.parse(localStorage.getItem("LaMaisonJungle")));
    // Déclaration du state 'cart' mise à jour avec la fonction 'updateCart' et initialisation vide si pas de localStorage (savedCart = null) sinon avec local storage
    const [cart, updateCart] = useState(savedCart ? JSON.parse(savedCart) : []);
    // Déclaration du 'useEffect' qui modifie le localStorage à partir du panier
    useEffect(() => {
        localStorage.setItem("LaMaisonJungle", JSON.stringify(cart));
        console.log("localStorage modified : ", localStorage);
    }, [cart]);
    
    return (
        // Notre 'App' contient une <div> avec les components 'Banner' + 'Cart' + 'ShoppingList' et 'Footer'
        <div>
            <Banner>
                <img src={logo} alt='La maison jungle' className='lmj-logo' />
                <h1 className='lmj-title'>La maison jungle</h1>
            </Banner>
            <div className='lmj-layout-inner'>
                <Cart cart={cart} updateCart={updateCart} />
                <ShoppingList cart={cart} updateCart={updateCart} />
            </div>
            <Footer />
		    </div>
    );
};

/* Exportation de notre fonction 'App' pour son rendu dans index.js */
export default App;
