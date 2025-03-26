import { Link } from 'react-router-dom';
import styles from '../../assets/styles/Components/NavBar.module.css'; // Asegúrate de tener los estilos adecuados

function NavBar() {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link to="/HomeAdmin" className={styles.navLink}>Eventos</Link>
                </li>
                <li className={styles.navItem}>
                    <Link to="/Checadores" className={styles.navLink}>Checadores</Link>
                </li>
             
            </ul>
        </nav>
    );
}

export default NavBar;
