import 'react';
import styles from '../../assets/styles/Components/HeaderAdmin.module.css';
import logo from '../../assets/img/Assets_inicio/logo.svg';
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const today = new Date().toLocaleDateString();
    const location = useLocation();

    const backLink = location.pathname === '/HomeAdmin' ? '/login' : location.state || '/login';

    return (
        <div>
            <nav className={styles.topNav}>
                <div className={styles.nav}>
                    <Link to={backLink} state={'/'}>
                        <button className={styles.arrow}>Cerrar Sesion</button>
                    </Link>
                    <p className={styles.today}>{today}</p>
                    <img src={logo} alt="Logo" className={styles.logo} />
                </div>
            </nav>
        </div>
    );
}

export default Header;
