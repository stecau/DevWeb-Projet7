/*----------------------------------------------------------------*/
/* Déclaration de notre composent 'Footer' pour notre App : */
/*----------------------------------------------------------------*/

/* Importation du module 'useState' de react */
import { useState } from 'react'

/* Importation du style de 'Footer' */
import '../styles/Footer.css'

function Footer() {
    // Déclaration de 'inputValue' [valeur initial ''] et de sa fonction de mise à jour 'setInputValue'avec react (useState)
	const [inputValue, setInputValue] = useState('')
    // Fonction pour la modification de 'inputValue' à l'event 'onChange'
	const handleInput = (e) => {
		setInputValue(e.target.value)
	};
    // Fonction pour la vérification de 'inputValue' à l'event 'onBlur' (= perte du focus)
	function handleBlur() {
		if (!inputValue.includes('@')) {
			alert("Attention, il n'y a pas d'@, ceci n'est pas une adresse valide 😥")
		}
	}

	return (
		<footer className='lmj-footer'>
			<div className='lmj-footer-elem'>
				Pour les passionné·e·s de plantes 🌿🌱🌵
			</div>
			<div className='lmj-footer-elem'>Laissez-nous votre mail :
                <input
                    placeholder='Entrez votre mail'
                    onChange={handleInput}
                    value={inputValue}
                    onBlur={handleBlur}
                />
            </div>
		</footer>
	)
}

export default Footer