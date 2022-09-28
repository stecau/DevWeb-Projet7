/*----------------------------------------------------------*/
/* Déclaration de notre composent 'Banner' pour notre App : */
/*----------------------------------------------------------*/

/* Importation du style de 'Banner' */
import '../styles/Banner.css';

/* Création du component 'Banner' de notre app avec utilisation de la prop technique 'children' */
const Banner = ({ children }) => {
    // Children sont les élément enfant du parent de 'Banner'
	return <div className='lmj-banner'>{children}</div>
};

/* Exportation de notre fonction 'Banner' pour son dans App */
export default Banner;