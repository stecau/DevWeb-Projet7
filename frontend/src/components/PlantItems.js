/*----------------------------------------------------------------*/
/* Déclaration de notre composent 'PlantItems' pour notre App : */
/*----------------------------------------------------------------*/

/* Importation du style de 'PlantItems' */
import '../styles/PlantItems.css';

/* Importation de composant 'CareScale' */
import CareScale from './CareScale'

/* Déclaration d'un event 'click' */
const handleClick = (plantName) => {
	alert(`Vous voulez acheter 1 ${plantName}? Très bon choix 🌱✨`)
};

/* Déclaration d'un composant avec des props (name, cover, id, light, water) */
const PlantItems = ({ name, cover, light, water }) => {
	return (
        <li className='lmj-plant-item' onClick={() => handleClick(name)}>
            <img className='lmj-plant-item-cover' src={cover} alt={`${name} cover`} />
            {name}
            <div>
                <CareScale careType='water' scaleValue={water} />
                <CareScale careType='light' scaleValue={light} />
            </div>
        </li>
	)
}

export default PlantItems