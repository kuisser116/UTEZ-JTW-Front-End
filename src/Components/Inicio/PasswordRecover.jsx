import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/styles/stylesLogin/recoverPassword.module.css';
import Header from '../Components/Header';
import axios from 'axios';

function RecuperarContrasena() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const emailRef = useRef(null); // Crear la referencia para el input de correo
  const navigate = useNavigate();

  // ⏳ Cuando el modal se abre, espera 2 segundos y redirige al login
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        navigate('/Password'); // Redirige al login
      }, 2000);

      return () => clearTimeout(timer); // Limpia el timeout si el componente se desmonta
    }
  }, [isModalOpen, navigate]);

  const recover = async (e) => {
    e.preventDefault();

    // Obtener el correo usando ref
    const emailData = {
      email: emailRef.current.value,
    };

    try {
      // Enviar la solicitud POST con JSON en el cuerpo
      const response = await axios.post(
        'http://localhost:3000/api/user/change-pass-mail',
        emailData,
        {
          headers: {
            'Content-Type': 'application/json', // Especificar que se envía JSON
          },
        }
      );

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
              setIsModalOpen(true);
            }}
            className={styles.btn}
          >
            Enviar
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.formT}>Correo enviado</h2>
            <p className={styles.p}>Serás redirigido en 2 segundos...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecuperarContrasena;
