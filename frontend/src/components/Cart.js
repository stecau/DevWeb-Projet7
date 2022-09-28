/*----------------------------------------------------------*/
/* Déclaration de notre composent 'Cart' pour notre App : */
/*----------------------------------------------------------*/

/* Importation du style de 'Cart' */
import '../styles/Cart.css';

/* Importation du module 'useState' de react */
// useState est un hook = fonction qui permet de « se brancher » (to hook up) sur des fonctionnalités React
import { useState, useEffect } from 'react'

/* Création du component 'Cart' de notre app */
const Cart = ({ cart, updateCart }) => {
    // Déclaration variable d'état d'ouverture ou fermeture du panier
    const [isOpen, setIsOpen] = useState(true);
    // Déclaration du total du panier en utilisant l'accumulateur de la méthode 'reduce'
    const total = cart.reduce( (acc, plantType) => acc + plantType.amount * plantType.price, 0 );
    // Déclaration d'un useEffect pour changer le nom de l'onglet de la page html
    useEffect(() => {
		document.title = `LMJ: ${total}€ d'achats`
	}, [total])

	return isOpen ? (
		<div className='lmj-cart'>
			<button className='lmj-cart-toggle-button' onClick={() => setIsOpen(false)}>
				Fermer
			</button>
            {cart.length > 0 ? (
                <div>
                    <h2>Panier</h2>
                    <ul>
                        {cart.map(({ name, price, amount }, index) =>(
                            <div key={`${name}-${index}`}>
                                {name} {price}€ x {amount}
                            </div>
                        ))}
                    </ul>
                    <h3>Total : {total}€</h3>
                    <button onClick={() => updateCart([])}>Vider le panier</button>
                </div>
            ) : (
                <div>Votre panier est vide</div>
            )}
		</div>
	) : (
		<div className='lmj-cart-closed'>
			<button className='lmj-cart-toggle-button' onClick={() => setIsOpen(true)}>
				Ouvrir le Panier
			</button>
		</div>
	);
};

/* Exportation de notre fonction 'Banner' pour son dans App */
export default Cart;