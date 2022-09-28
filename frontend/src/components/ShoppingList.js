/*----------------------------------------------------------------*/
/* Déclaration de notre composent 'ShoppingList' pour notre App : */
/*----------------------------------------------------------------*/

/* Importation du module 'useState' de react */
import { useState } from 'react'

/* Importation du style de 'ShoppingList' */
import '../styles/ShoppingList.css';

/* Importation de la liste des plantes */
import { plantList } from '../datas/plantList'

/* Importation de composant 'PlantItems' et 'Categories' */
import PlantItems from './PlantItems'
import Categories from './Categories';

/* Création du component 'ShoppingList' de notre app */
const ShoppingList = ({ cart, updateCart }) => {
    /* Déclaration de la liste des catégories de plantes */
    const categories = plantList.reduce(
        (acc, plant) => acc.includes(plant.category) ? acc : acc.concat(plant.category), []
    );
    // Rajout de la catégorie 'Toutes'
    categories.push("Toutes");
    // Déclaration de la valeur de filtre des catégories
    const [filtreCat, updateFiltre] = useState("Toutes");

    // Déclaration de la fonction 'addToCart'
    const addToCart = (name, price) => {
        // Utilisation de la méthode 'find' d'un tableau pour savoir s'il y a déjà la plante dans le panier
		const currentPlantSaved = cart.find((plant) => plant.name === name);
		if (currentPlantSaved) { // Si la plante est déjà dans le panier
            // Création d'un tableau sans la plante en question avec la méthode 'filter'
			const cartFilteredCurrentPlant = cart.filter(
				(plant) => plant.name !== name
			)
            // Mise à jour du panier (liste des plante dans le panier)
			updateCart([
                // avec le tableau sans la plante
				...cartFilteredCurrentPlant,
                // avec la plante et sa quantité qui augmente de + 1
				{ name, price, amount: currentPlantSaved.amount + 1 }
			])
		} else { // La plante n'est pas dans le panier
            // Rajout de la plante dans la liste de plante du panier
			updateCart([...cart, { name, price, amount: 1 }])
		};
	};

    return (
		<div className='lmj-shopping-list'>
            <Categories categories={categories}  filtreCat={filtreCat} updateFiltre={updateFiltre} />
            <ul className='lmj-plant-list'>
                {plantList.map(({ id, cover, name, water, light, price, category }) => (
                    filtreCat === "Toutes" ? (
                        <div key={id}>
                            <PlantItems cover={cover} name={name} water={water} light={light} price={price} />
                            <button onClick={() => addToCart(name, price)}>Ajouter</button>
                        </div>
                    ) : (
                        filtreCat === category && (
                            <div key={id}>
                                <PlantItems cover={cover} name={name} water={water} light={light} price={price} />
                                <button onClick={() => addToCart(name, price)}>Ajouter</button>
                            </div>
                        )
                    )
                ))}
            </ul>
		</div>
    )
}

export default ShoppingList