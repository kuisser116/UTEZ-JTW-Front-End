import 'react';
import styles from '../../assets/styles/stylesLogin/login.module.css';
import conferenceImage from '../../assets/img/conference-3-100.svg';
import forms from '../../assets/img/formasLogin.svg';
import Header from '../Components/Header';
import {Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const Validacion = async () => {

        try {
            const response = await axios.get('http://localhost:3000/api/administrator/');
            console.log('Datos obtenidos:', response.data); 

            const user = response.data.data.find(user => 
                user.email.toLowerCase() === email.toLowerCase() && 
                user.password === password
            );

            if (user) {
                console.log('Login Exitoso');
                localStorage.setItem('adminId', user._id);
                navigate('/HomeAdmin',{state:'/login'});

            } else {
                console.log('Error de Login');
            }

        } catch (error) {
            console.log('Error al hacer la petición:', error);
        }
    };

    return (
        <div className={styles.body}>
            <img className={styles.formas} src={forms} alt="" />
            <div className={styles.Login}>
                <Header />
                <h2 className={styles.title1}>Iniciar sesión</h2>
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
                    <hr />
                    <button onClick={Validacion}>Iniciar sesión</button>
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
