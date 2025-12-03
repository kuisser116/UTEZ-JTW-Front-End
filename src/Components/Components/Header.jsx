import { useState } from 'react';
import styles from '../../assets/styles/Components/Header.module.css';
import logo from '../../assets/img/Assets_inicio/logo.svg';
import Arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast, Toaster } from 'sonner';

function Header() {
    const today = new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Lógica para el botón de regreso
    const backLink = location.pathname === '/Events' ? '/' : location.state || '/';

    const handleLogout = () => {
        logout();
        toast.success('Sesión cerrada exitosamente');
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    return (
        <div>
            <Toaster position="top-center" richColors />
            <nav className={styles.topNav}>
                <div className={styles.navContainer}>
                    {/* Back Button */}
                    <Link to={backLink} state={'/Events'} className={styles.backButton}>
                        <img className={styles.arrow} src={Arrow} alt="Back" />
                    </Link>

                    {/* Date Display (Solo visible en desktop/tablet) */}
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

                    {/* User Profile / Logout */}
                    {isAuthenticated && user && (
                        <div className={styles.userSection}>
                            <button 
                                className={styles.userButton} 
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                {user.picture ? (
                                    <img 
                                        src={user.picture} 
                                        alt={user.name} 
                                        className={styles.userAvatar} 
                                    />
                                ) : (
                                    <div className={styles.userAvatarPlaceholder}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                
                                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                                
                                <svg 
                                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    className={showUserMenu ? styles.chevronUp : styles.chevronDown}
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <>
                                    {/* Overlay invisible para cerrar el menú al hacer clic fuera */}
                                    <div className={styles.menuOverlay} onClick={() => setShowUserMenu(false)} />
                                    
                                    <div className={styles.userMenu}>
                                        <div className={styles.userInfo}>
                                            <p className={styles.userEmailName}>{user.name}</p>
                                            <p className={styles.userEmail}>{user.email}</p>
                                        </div>
                                        <div className={styles.menuDivider}></div>
                                        <button 
                                            className={styles.logoutButton} 
                                            onClick={handleLogout}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                <polyline points="16 17 21 12 16 7"></polyline>
                                                <line x1="21" y1="12" x2="9" y2="12"></line>
                                            </svg>
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

export default Header;