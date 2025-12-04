import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';

// Estilos e imágenes (Reutilizamos los del login)
import styles from '../../assets/styles/stylesLogin/login.module.css';
import conferenceImage from '../../assets/img/conference-3-100.svg';
import Header from '../Components/Header';

// Contexto
import { useAuth } from '../../context/AuthContext';

function RegisterComponent() {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();
    const { registerManual, loginWithGoogle } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- REGISTRO MANUAL ---
    const handleManualRegister = async () => {
        const { name, lastname, email, password, confirmPassword } = formData;

        if (!name || !lastname || !email || !password) {
            return toast.error('Todos los campos son obligatorios');
        }
        if (password !== confirmPassword) {
            return toast.error('Las contraseñas no coinciden');
        }
        if (password.length < 6) {
            return toast.error('La contraseña debe tener al menos 6 caracteres');
        }

        const result = await registerManual({ name, lastname, email, password });

        if (result.success) {
            toast.success('¡Registro exitoso! Por favor inicia sesión.');
            setTimeout(() => navigate('/login'), 2000);
        } else {
            toast.error(result.error);
        }
    };

    // --- REGISTRO GOOGLE ---
    const handleGoogleRegister = async (credentialResponse) => {
        const result = await loginWithGoogle(credentialResponse);

        if (result.success) {
            toast.success(`Bienvenido ${result.user.name}`);
            setTimeout(() => navigate('/Events'), 1500);
        } else {
            toast.error(result.error || 'Error al registrarse con Google');
        }
    };

    return (
        <div className={styles.container}>
            {/* Background Animations */}
            <div className={styles.backgroundShapes}>
                <div className={`${styles.shape} ${styles.shape1}`}></div>
                <div className={`${styles.shape} ${styles.shape2}`}></div>
                <div className={`${styles.shape} ${styles.shape3}`}></div>
            </div>

            <Header />
            <Toaster position="top-center" richColors />

            <div className={styles.contentWrapper}>
                <div className={styles.loginCard} style={{ height: 'auto', minHeight: '650px' }}>

                    {/* Left Side - Form */}
                    <div className={styles.formSection}>
                        <div className={styles.headerWrapper} style={{ marginBottom: '1.5rem' }}>
                            <h2 className={styles.title}>Crear Cuenta</h2>
                            <p className={styles.subtitle}>Únete a nuestra comunidad de eventos</p>
                        </div>

                        <div className={styles.formGroup}>
                            {/* Nombre y Apellido en una fila */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                                <div className={styles.inputWrapper} style={{ marginBottom: 0, flex: 1 }}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        name="name"
                                        placeholder="Nombre(s)"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className={styles.inputWrapper} style={{ marginBottom: 0, flex: 1 }}>
                                    <input
                                        className={styles.input}
                                        type="text"
                                        name="lastname"
                                        placeholder="Apellidos"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.inputWrapper}>
                                <input
                                    className={styles.input}
                                    type="email"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.inputWrapper}>
                                <input
                                    className={styles.input}
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.inputWrapper}>
                                <input
                                    className={styles.input}
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirmar contraseña"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button className={styles.loginButton} onClick={handleManualRegister}>
                            Registrarse
                        </button>

                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                            <p style={{ color: '#666', fontSize: '16px' }}>
                                ¿Ya tienes cuenta?{' '}
                                <Link to="/login" style={{ color: '#a18cd1', fontWeight: 'bold' }}>
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>

                        {/* Separador */}
                        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                            <div style={{ flex: 1, borderBottom: '1px solid #e5e7eb' }}></div>
                            <span style={{ padding: '0 10px', color: '#9ca3af', fontSize: '0.8rem' }}>O regístrate con</span>
                            <div style={{ flex: 1, borderBottom: '1px solid #e5e7eb' }}></div>
                        </div>

                        {/* Botón Google */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleLogin
                                onSuccess={handleGoogleRegister}
                                onError={() => toast.error('Falló el registro con Google')}
                                theme="outline"
                                size="large"
                                width="300"
                                text="signup_with"
                                shape="pill"
                            />
                        </div>
                    </div>

                    {/* Right Side - Welcome (Oculto en móvil por CSS) */}
                    <div className={styles.welcomeSection}>
                        <div className={styles.welcomeContent}>
                            <h2 className={styles.welcomeTitle}>¡Bienvenido!</h2>
                            <p className={styles.welcomeText}>
                                Comienza tu viaje de aprendizaje y networking hoy mismo.
                            </p>
                            <img className={styles.welcomeImage} src={conferenceImage} alt="Bienvenida" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterComponent;