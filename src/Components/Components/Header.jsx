import React from 'react';
import styles from '../../assets/styles/Components/Header.module.css';
import logo from '../../assets/img/Assets_inicio/logo.svg';
import Arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Importamos el hook de autenticación
import { useAuth } from '../../context/AuthContext'; 

function Header() {
    const today = new Date().toLocaleDateString();
    const location = useLocation();
    const navigate = useNavigate();

    // Obtenemos la función logout y el estado de autenticación
    const { logout, isAuthenticated } = useAuth();

    const backLink = location.pathname === '/Events' ? '/' : location.state || '/';

    const handleLogout = () => {
        logout(); // Limpia el contexto y localStorage
        navigate('/login'); // Redirige al login
    };

    return (
        <div>
            <nav className={styles.topNav}>
                <div className={styles.nav}>
                    {/* Botón de regresar */}
                    <Link to={backLink} state={'/Events'}>
                        <img className={styles.arrow} src={Arrow} alt="Back" />
                    </Link>

                    {/* Fecha */}
                    <p className={styles.today}>{today}</p>

                    {/* Logo */}
                    <img src={logo} alt="Logo" className={styles.logo} />

                    {/* Botón de Cerrar Sesión (Solo si está logueado) */}
                    {isAuthenticated && (
                        <button 
                            className={styles.logoutBtn} 
                            onClick={handleLogout}
                            title="Cerrar Sesión"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </button>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Header;