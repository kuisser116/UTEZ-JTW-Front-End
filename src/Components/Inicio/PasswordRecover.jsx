import 'react';
import '../../assets/styles/stylesLogin/recoverPassword.css'

function RecuperarContrasena() {


  return (

    <body>
        
        <div className='recover'>
            <h2>Recuperar contraseña</h2>
            <div>
                <input type="email" placeholder='Correo' />
            </div>
            <div>
                <button>Enviar</button>
            </div>
       </div>

    </body>
       

  );
}

export default RecuperarContrasena;