/*----------------------------------------------------------------*/
/* Déclaration de notre composent 'CareScale' pour notre App : */
/*----------------------------------------------------------------*/

/* Importation des images */
import Sun from '../assets/sun.svg'
import Water from '../assets/water.svg'

/* Déclaration de la fonction d'un event 'click' */
const handleClick = (careType, scaleValue) => {
    const quantityLabel = {
        1: 'peu',
        2: 'modérément',
        3: 'beaucoup'
    }
	alert(`Cette plante requiert ${quantityLabel[scaleValue]} ${careType === 'light' ? 'de lumière' : "d'arrosage"}`)
};

/* Déclaration d'un composant avec deux props (scaleValue = int, careType = string) */
    // int => objet donc entre {} pour la valeur de la prop dans le parent
    // string => entre '' pour la valeur de la prop dans le parent
const CareScale = ({ scaleValue, careType }) => {
    // Déclaration d'une liste de niveau
	const range = [1, 2, 3]
    // Utilisation ternaire pour choix de l'icône
	const scaleType = careType === 'light' ? (
        <img src={Sun} alt='sun-icon' />
    ) : (
        <img src={Water} alt='water-icon' />
    )

	return (
		<div onClick={() => handleClick(careType, scaleValue)}>
			{range.map((rangeElem) =>
				scaleValue >= rangeElem ? (
					<span key={rangeElem.toString()}>{scaleType}</span>
				) : null
			)}
		</div>
	)
}

export default CareScale