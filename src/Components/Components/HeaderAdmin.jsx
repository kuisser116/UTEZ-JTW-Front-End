import 'react';
import styles from '../../assets/styles/Components/Header.module.css';
import logo from '../../assets/img/Assets_inicio/logo.svg';
import Arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png';
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const today = new Date().toLocaleDateString();
    const location = useLocation();

    const backLink = location.pathname === '/EventWorkshop' ? '/HomeAdmin' : location.state || '/HomeAdmin';

    return (
        <div>
            <nav className={styles.topNav}>
                <div className={styles.nav}>
                    <Link to={backLink} state={'/HomeAdmin'}>
                        <img className={styles.arrow} src={Arrow} alt="Back" />
                    </Link>
                    <p className={styles.today}>{today}</p>
                    <img src={logo} alt="Logo" className={styles.logo} />
                </div>
            </nav>
        </div>
    );
}

export default Header;
