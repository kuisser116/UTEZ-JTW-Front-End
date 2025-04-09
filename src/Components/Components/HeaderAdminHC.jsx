import 'react';
import styles from '../../assets/styles/Components/HeaderAdmin.module.css';
import logo from '../../assets/img/Assets_inicio/logo.svg';
import { Link, useLocation } from 'react-router-dom';
import { url } from '../../utils/base.url';
function Header() {
    const today = new Date().toLocaleDateString();
    const location = useLocation();

    const backLink = location.pathname === '/HomeAdmin' ? '/login' : location.state || '/login';

    const eliminarToken = () =>{
        localStorage.removeItem('token');
    }

    return (
        <div>
            <nav className={styles.topNav}>
                <div className={styles.nav}>
                    <Link to={'/'} state={'/'}>
                        <button onClick={eliminarToken} className={styles.arrow}>Cerrar Sesion</button>
                    </Link>
                    <p className={styles.today}>{today}</p>
                </div>
            </nav>
        </div>
    );
}

export default Header;
