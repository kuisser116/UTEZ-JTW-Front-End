import React, { useState } from 'react';
import styles from '../../assets/styles/stylesLogin/login.module.css'; // Reusamos estilos
import conferenceImage from '../../assets/img/conference-3-100.svg';
import forms from '../../assets/img/formasLogin.svg';
import Header from '../Components/Header';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

// Google y Auth
import { GoogleLogin } from '@react-oauth/google';
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

    // 1. Registro Manual
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
            setTimeout(() => navigate('/login'), 2000); // Redirigir al login
        } else {
            toast.error(result.error);
        }
    };

    // 2. Registro con Google (Es lo mismo que login, el backend lo crea si no existe)
    const handleGoogleRegister = async (credentialResponse) => {
        const result = await loginWithGoogle(credentialResponse);

        if (result.success) {
            toast.success(`Bienvenido ${result.user.name}`);
            // Redirigir directamente al panel de eventos
            setTimeout(() => navigate('/Events'), 1500);
        } else {
            toast.error(result.error || 'Error al registrarse con Google');
        }
    };

    return (
        <div className={styles.body}>
            <img className={styles.formas} src={forms} alt="" />
            <div className={styles.Login} style={{ height: 'auto', minHeight: '600px' }}> {/* Ajuste de altura */}
                <Header />
                <Toaster position="top-center" richColors />
                <h2 className={styles.title1}>Crear Cuenta</h2>
                
                <div style={{ width: '80%', margin: '0 auto' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre(s)"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ width: '50%' }}
                        />
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Apellidos"
                            value={formData.lastname}
                            onChange={handleChange}
                            style={{ width: '50%' }}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button onClick={handleManualRegister} style={{ marginTop: '20px' }}>
                        Registrarse
                    </button>
                    
                    <div style={{ margin: '15px 0', textAlign: 'center' }}>
                        <p>¿Ya tienes cuenta? <Link to="/login" style={{color: '#007bff'}}>Inicia sesión aquí</Link></p>
                    </div>

                    <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #ddd' }} />
                    
                    {/* Botón de Google */}
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '20px' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleRegister}
                            onError={() => toast.error('Falló el registro con Google')}
                            theme="outline"
                            size="large"
                            text="signup_with" // Dice "Sign up with Google"
                            width="300"
                        />
                    </div>
                </div>
            </div>
            <div className={styles.bienvenida}>
                <h2 className={styles.title2}>¡Únete a nosotros!</h2>
                <img className={styles.img} src={conferenceImage} alt="Bienvenida" />
            </div>
        </div>
    );
}

export default RegisterComponent;