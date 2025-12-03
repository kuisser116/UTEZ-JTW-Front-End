import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import styles from '../../assets/styles/stylesLogin/JTW.module.css';
import formas from '../../assets/img/Assets_inicio/formasInicio.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast, Toaster } from 'sonner';
import ParticleBackground from '../Components/ParticleBackground';

function JumpToWorkPage() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { isAuthenticated, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    // Manejar click en "Eventos"
    const handleEventosClick = (e) => {
        e.preventDefault();

        // Si ya está autenticado, ir directamente a eventos
        if (isAuthenticated) {
            navigate('/Events');
        } else {
            // Si no está autenticado, mostrar modal de login
            setShowLoginModal(true);
        }
    };

    // Manejar login con Google
    const handleGoogleLogin = async (credentialResponse) => {
        const result = await loginWithGoogle(credentialResponse);

        if (result.success) {
            setShowLoginModal(false);
            toast.success('¡Bienvenido! Redirigiendo a eventos...');
            setTimeout(() => {
                navigate('/Events');
            }, 1000);
        } else {
            toast.error('Error al iniciar sesión con Google');
        }
    };

    return (
        <div>
            <ParticleBackground />
            <Toaster position="top-center" />
            <img className={styles.formas} src={formas} alt="" />
            
            <nav className={styles.topNav}>
                <div className={styles.nav}>
                    <ul className={styles.navLinks}>
                        <li>
                            <a className={styles.aEventos} href="#eventos" onClick={handleEventosClick}>
                                Eventos
                            </a>
                        </li>
                        
                        {/* --- BOTÓN DE REGISTRO --- */}
                        <Link to={'/register'}>
                            <button 
                                className={styles.logoututtonRe} 
                                style={{ marginRight: '15px' }} // Separación visual
                            >
                                Registrarse
                            </button>
                        </Link>

                        {/* --- BOTÓN DE LOGIN ADMIN --- */}
                        <Link to={'/login'} state={'/'}>
                            <button className={styles.logoututton}>
                                Iniciar Sesión Admin
                            </button>
                        </Link>
                    </ul>
                </div>
            </nav>

            <p className={styles.p}>Arreglamos y solucionamos tu vida</p>

            {/* MODAL DE LOGIN CON GOOGLE */}
            {showLoginModal && (
                <div className={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

                        <h2 className={styles.modalTitle}>Inicia Sesión para Continuar</h2>
                        <p className={styles.modalSubtitle}>
                            Necesitas iniciar sesión con Google para ver y registrarte en eventos
                        </p>

                        <div className={styles.googleBtnWrapper}>
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => {
                                    console.log('Login Failed');
                                    toast.error('Fallo el inicio de sesión con Google');
                                }}
                                size="large"
                                shape="pill"
                                width="280"
                            />
                        </div>

                        <button className={styles.cancelBtn} onClick={() => setShowLoginModal(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default JumpToWorkPage;