/*--------------------------------------------------------------*/
/* Déclaration de notre composent 'Categories' pour notre App : */
/*--------------------------------------------------------------*/

/* Création du component 'Categories' de notre app */
const Categories = ({ categories, filtreCat,  updateFiltre}) => {
    return (
        <div>
            <label htmlFor="categories">Filtrer par catégorie de plantes :</label>
            <select name="categories" value={filtreCat} onChange={(e) => updateFiltre(e.target.value)}>
                {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <button onClick={() => updateFiltre("Toutes")}>
                Réinitialiser
			</button>
        </div>
    );
};

/* Exportation de notre fonction 'Categories' pour son dans App */
export default Categories;
