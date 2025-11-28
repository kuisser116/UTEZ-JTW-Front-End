import React, { useState } from 'react';
import styles from '../../assets/styles/stylesLogin/login.module.css';
import conferenceImage from '../../assets/img/conference-3-100.svg';
import forms from '../../assets/img/formasLogin.svg';
import Header from '../Components/Header';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { url } from '../../utils/base.url';

// Importaciones de Google
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext'; // Importamos el contexto

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Usamos la función del contexto que acabamos de crear
    const { loginWithGoogle } = useAuth();

    // Lógica para Login Normal (Email/Pass)
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

            const { token, user, role } = response.data;

            if (!token || !user) {
                toast.error('Error: Usuario o token no válidos');
                return;
            }

            // Validar restricción de Checadores en Web
            if (role === 'Supervisor') {
                toast.error('Acceso denegado: Los checadores deben usar la App Móvil.');
                return;
            }

            // Guardar datos
            localStorage.setItem('token', token);
            localStorage.setItem('adminId', user._id);
            localStorage.setItem('user', JSON.stringify(user));

            Redireccionar(role);

        } catch (error) {
            toast.error('Credenciales incorrectas');
            console.log(error);
        }
    };

    // Lógica para Login con Google
    const handleGoogleSuccess = async (credentialResponse) => {
        const result = await loginWithGoogle(credentialResponse);

        if (result.success) {
            toast.success(`Bienvenido ${result.user.name}`);
            Redireccionar(result.role);
        } else {
            toast.error(result.error || 'Error al iniciar sesión con Google');
        }
    };

    const Redireccionar = (role) => {
        setTimeout(() => {
            if (role === 'SuperAdmin') navigate('/HomeSA');
            else if (role === 'EventAdmin') navigate('/HomeAdmin');
            else if (role === 'Participant') navigate('/events'); // Asumiendo ruta de participante
            else navigate('/'); // Default
        }, 1500);
    };

    return (
        <div className={styles.body}>
            <img className={styles.formas} src={forms} alt="" />
            <div className={styles.Login}>
                <Header />
                <Toaster position="top-center" richColors />
                <h2 className={styles.title1}>Iniciar sesión</h2>

                {/* Formulario Normal */}
                <div>
                    <div>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <Link to={'/RecoverPassword'} state={'/login'}><p>¿Olvidaste tu contraseña?</p></Link>

                    <button onClick={Validacion}>Iniciar sesión</button>
                    <div style={{ marginTop: '10px' }}>
                        <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
                    </div>

                    <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #ddd' }} />

                    {/* Botón de Google */}
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                toast.error('Falló el inicio de sesión con Google');
                            }}
                            theme="outline"
                            size="large"
                            text="signin_with"
                            width="300" // Ajusta el ancho según tu diseño
                        />
                    </div>
                </div>
            </div>
            <div className={styles.bienvenida}>
                <h2 className={styles.title2}>¡Bienvenido!</h2>
                <img className={styles.img} src={conferenceImage} alt="Bienvenida" />
            </div>
        </div>
    );
}

export default LoginComponent;