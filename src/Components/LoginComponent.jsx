import 'react';
import '../assets/styles/stylesLogin/login.css'
import conferenceImage from '../assets/img/conference-3-100.svg'
import forms from '../assets/img/formasLogin.svg'


function LoginComponent() {
    return (
        <body>
            <img className='formas' src={forms} alt="" />
                    {/* Sección del formulario */}
                    <div className='Login'>
                        <h2 className='title1'>Iniciar sesión</h2>
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
                    
                    {/* Sección de bienvenida */}
                    <div className='bienvenida'>
                        <h2 className='title2'>¡Bienvenido!</h2>
                        <img className='img'
                            src={conferenceImage}
                        />
                    </div>
        </body>
                
    )
}

export default LoginComponent;