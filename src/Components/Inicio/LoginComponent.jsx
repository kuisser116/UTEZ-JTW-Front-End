import 'react';
import styles from '../../assets/styles/stylesLogin/login.module.css'
import conferenceImage from '../../assets/img/conference-3-100.svg'
import forms from '../../assets/img/formasLogin.svg'


function LoginComponent() {


    
    return (
        <body>
            <img className={styles.formas} src={forms} alt="" />
                    <div className={styles.Login}>
                        <h2 className={styles.title1}>Iniciar sesión</h2>
                        <div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Correo electrónico"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                />
                            </div>
                            <p>¿Olvidaste tu contraseña?</p>
                            <hr />
                            <button>Iniciar sesión</button>
                            <p>¿No tienes una cuenta? <span>Regístrate</span></p>
                        </div>
                    </div>
                    
                    <div className={styles.bienvenida}>
                        <h2 className={styles.title2}>¡Bienvenido!</h2>
                        <img className={styles.img}
                            src={conferenceImage}
                        />
                    </div>
        </body>
                
    )
}

export default LoginComponent;