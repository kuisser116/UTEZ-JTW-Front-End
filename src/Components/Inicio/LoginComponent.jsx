import 'react';
import styles from '../../assets/styles/stylesLogin/login.module.css';
import conferenceImage from '../../assets/img/conference-3-100.svg';
import Header from '../Components/HeaderAdmin';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner'
import { url } from '../../utils/base.url';

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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

            const token = response.data.token;
            const user = response.data.user;

            if (!token || !user) {
                console.log('Error: Usuario o token no válidos');
                return;
            }

            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('adminId', user._id);
            console.log(user.role)

            // Redireccionar según el rol
            if (user.role === 'SuperAdmin') {
                toast.success('Inicio de sesión exitoso');
                setTimeout(() => {
                    navigate('/HomeSA');
                }, 2000);
            } else if (user.role === 'EventAdmin') {
                toast.success('Inicio de sesión exitoso');
                setTimeout(() => {
                    navigate('/HomeAdmin');
                }, 2000);
            } else {
                toast.error('Acceso denegado');
                console.log('Rol no reconocido');
            }

        } catch (error) {
            toast.error('Correo o contraseña incorrectos');
            console.log('Error al hacer la petición:', error);
        }
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
                            <p className={styles.subtitle}>Ingresa tus credenciales para acceder al panel</p>
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
