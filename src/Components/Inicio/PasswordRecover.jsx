import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/styles/stylesLogin/recoverPassword.module.css';
import Header from '../Components/Header';
import axios from 'axios';
import { url } from '../../utils/base.url';

function RecuperarContrasena() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const emailRef = useRef(null); // Crear la referencia para el input de correo
  const navigate = useNavigate();
  const [emailWasSent, setEmailWasSent] = useState(false);
  const codeReference = useRef(null);
  const [tempToken, setTempToken] = useState(null);

  const recover = async (e) => {
    e.preventDefault();
  
    const email = emailRef.current.value.trim();
  
    if (email === '') {
      alert('El correo no puede estar vacío');
      return; // Detiene la ejecución de la función
    }
  
    const emailData = { email };
  
    try {
      const response = await axios.post(
        `${url}/user/change-pass-mail`,
        emailData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      setTempToken(response.data.token);
      setEmailWasSent(true); // Mueve esto aquí para mostrar el input de código
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  
 

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.recover}>
        <h2 className={styles.tittle}>Recuperar contraseña</h2>
        {
          !emailWasSent ?
            <>
              {/* Input para el correo electronico */}
              <div>
                <input
                  ref={emailRef} // Asignar la referencia al input
                  className={styles.box}
                  name="email"
                  type="email"
                  placeholder="Correo"
                />
              </div>
              <div>
                <button
                  onClick={(e) => {
                    recover(e);
                    mostrarPaginaCodigo(e);

                  }}
                  className={styles.btn}
                >
                  Enviar
                </button>
              </div>
            </>
            :
            <>


              {/* Input para el codigo de recuperacion */}
              <div>
                <label>Codigo de recuperación</label>
                <input
                  ref={codeReference}
                  className={styles.box}
                  name="code"
                  type="text"
                  placeholder="Codigo de recuperacion"
                />
                <button
                  className={styles.btn}
                  onClick={async () => {
                    try {
                      const response = await axios.post(`
                        ${url}/user/validate-code`,
                        { code: codeReference.current.value },
                        {
                          headers: {
                          'authorization': `Bearer ${tempToken}`
                          }
                        }
                      )

                      if(response.data.status >= 300) {
                        alert(response.data.data);
                        return;
                      }
                      localStorage.setItem('tempToken', tempToken);
                      navigate('/Password');
                    } catch (err) {
                      console.log(err);
                      alert('Codigo invalido');
                    }
                  }}
                >
                  Enviar Codigo
                </button>
              </div>
            </>
        }
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className={styles.modalContent}>
            <p className={styles.p}>Si existe un usuario con este correo, se enviará un correo con un codigo de recuperación</p>
            <button style={{ margin: 0 }} onClick={() => {
              emailWasSent(true);
            }}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecuperarContrasena;