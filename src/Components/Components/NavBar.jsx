import { Link, useLocation } from 'react-router-dom';
import styles from '../../assets/styles/Components/NavBar.module.css';
import { useState } from 'react';

function NavBar() {
    const location = useLocation(); 
    const [isMenuOpen, setIsModalOpen] = useState(false);
    
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link 
                        to="/HomeAdmin" 
                        className={`${styles.navLink} ${location.pathname === "/HomeAdmin" ? styles.active : ""}`}
                    >
                        Eventos
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link 
                        to="/Checadores" 
                        className={`${styles.navLink} ${location.pathname === "/Checadores" ? styles.active : ""}`}
                    >
                        Checadores
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;
