import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google'; // Importamos Google

// Imports de estilos y assets
import styles from '../../assets/styles/stylesLogin/login.module.css';
import conferenceImage from '../../assets/img/conference-3-100.svg';
import Header from '../Components/Header'; // Usamos el Header general (cambia a HeaderAdmin si prefieres el otro)

// Contexto y Utils
import { url } from '../../utils/base.url';
import { useAuth } from '../../context/AuthContext';

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Traemos la función de login con Google del contexto
    const { loginWithGoogle } = useAuth();

    // --- LÓGICA LOGIN MANUAL ---
    const Validacion = async () => {
        try {
            if (email === '' || password === '') {
                toast.error('Correo o contraseña incorrectos');
                return;
            }
            const response = await axios.post(`${url}/auth/login`, {
                email,
                password
            });

            console.log('Datos obtenidos:', response.data);

            const { token, user, role } = response.data;

            if (!token || !user) {
                console.log('Error: Usuario o token no válidos');
                return;
            }

            // Validar restricción de Checadores (Supervisores) en Web
            if (role === 'Supervisor') {
                toast.error('Acceso denegado: Los checadores deben usar la App Móvil.');
                return;
            }

            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('adminId', user._id);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success(`Bienvenido ${user.name || ''}`);

            // Redireccionar según el rol
            Redireccionar(role);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Correo o contraseña incorrectos');
            console.log('Error al hacer la petición:', error);
        }
    };

    // --- LÓGICA LOGIN GOOGLE ---
    const handleGoogleSuccess = async (credentialResponse) => {
        const result = await loginWithGoogle(credentialResponse);

        if (result.success) {
            toast.success(`Bienvenido ${result.user.name}`);
            Redireccionar(result.role);
        } else {
            toast.error(result.error || 'Error al iniciar sesión con Google');
        }
    };

    // --- FUNCIÓN REDIRECCIONAR ---
    const Redireccionar = (role) => {
        setTimeout(() => {
            if (role === 'SuperAdmin') navigate('/HomeSA');
            else if (role === 'EventAdmin') navigate('/HomeAdmin');
            else if (role === 'Participant') navigate('/Events'); // Redirección para participantes
            else navigate('/'); // Default

            // Truco para recargar el contexto si no se actualizó automáticamente
            window.location.reload();
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.backgroundShapes}>
                <div className={`${styles.shape} ${styles.shape1}`}></div>
                <div className={`${styles.shape} ${styles.shape2}`}></div>
                <div className={`${styles.shape} ${styles.shape3}`}></div>
            </div>

            <Header />
            <Toaster position="top-center" richColors />

            <div className={styles.contentWrapper}>
                <div className={styles.loginCard}>
                    {/* Left Side - Form */}
                    <div className={styles.formSection}>
                        <div className={styles.headerWrapper}>
                            <h2 className={styles.title}>Bienvenido de nuevo</h2>
                            <p className={styles.subtitle}>Ingresa tus credenciales para acceder</p>
                        </div>

                        <div className={styles.formGroup}>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={styles.input}
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className={styles.inputWrapper}>
                                <input
                                    className={styles.input}
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.forgotPassword}>
                            <Link to={'/RecoverPassword'} state={'/login'}>
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button className={styles.loginButton} onClick={Validacion}>
                            Iniciar Sesión
                        </button>

                        {/* Enlace para Registrarse */}
                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                            <p style={{ color: '#666', fontSize: '16px' }}>
                                ¿No tienes cuenta?{' '}
                                <Link to="/register" style={{ color: '#4F46E5', fontWeight: 'bold' }}>
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>

                        {/* Separador */}
                        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                            <div style={{ flex: 1, borderBottom: '1px solid #e5e7eb' }}></div>
                            <span style={{ padding: '0 10px', color: '#9ca3af', fontSize: '0.8rem' }}>O continúa con</span>
                            <div style={{ flex: 1, borderBottom: '1px solid #e5e7eb' }}></div>
                        </div>

                        {/* Botón de Google */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error('Falló el inicio de sesión con Google')}
                                theme="outline"
                                size="large"
                                width="300"
                                text="signin_with"
                                shape="pill"
                            />
                        </div>
                    </div>

                    {/* Right Side - Welcome/Image */}
                    <div className={styles.welcomeSection}>
                        <div className={styles.welcomeContent}>
                            <h2 className={styles.welcomeTitle}>¡Hola!</h2>
                            <p className={styles.welcomeText}>
                                Gestiona tus eventos y talleres de manera eficiente con nuestra plataforma.
                            </p>
                            <img className={styles.welcomeImage} src={conferenceImage} alt="Conference" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;