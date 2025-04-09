import { Link, useLocation } from 'react-router-dom';
import styles from '../../assets/styles/Components/NavBar.module.css';
import { useState } from 'react';
import { url } from '../../utils/base.url';
function NavBar() {
    const location = useLocation(); 
    const [isMenuOpen, setIsModalOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
            <li className={styles.navItem}>
                    <Link 
                        to="/EventSA" 
                        className={`${styles.navLink} ${location.pathname === "/HomeAdmin" ? styles.active : ""}`}
                    >
                        Eventos
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link 
                        to="/HomeSA" 
                        className={`${styles.navLink} ${location.pathname === "/HomeAdmin" ? styles.active : ""}`}
                    >
                        Super Administradores
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link 
                        to="/Admins" 
                        className={`${styles.navLink} ${location.pathname === "/Checadores" ? styles.active : ""}`}
                    >
                        Administradores
                    </Link>
                </li>
            </ul>

        </nav>
    );
}

export default NavBar;
