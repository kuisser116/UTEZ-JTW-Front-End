import 'react';
import styles from '../../assets/styles/Components/Header.module.css';
import logo from '../../assets/img/Assets_inicio/logo.svg';
import Arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png';
import { Link, useLocation } from 'react-router-dom';

function HeaderAdmin() {
    const today = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const location = useLocation();

    const backLink = location.pathname === '/EventWorkshop' ? '/HomeAdmin' : location.state || '/HomeAdmin';

    return (
        <div>
            <nav className={styles.topNav}>
                <div className={styles.navContainer}>
                    {/* Back Button */}
                    <Link to={backLink} state={'/HomeAdmin'} className={styles.backButton}>
                        <img className={styles.arrow} src={Arrow} alt="Back" />
                    </Link>

                    {/* Date Display */}
                    <div className={styles.dateContainer}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <p className={styles.today}>{today}</p>
                    </div>

                    {/* Logo */}
                    <img src={logo} alt="Logo" className={styles.logo} />
                </div>
            </nav>
        </div>
    );
}

export default HeaderAdmin;
