import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/styles/stylesLogin/recoverPassword.module.css';
import Header from '../Components/Header';
import axios from 'axios';
import { url } from '../../utils/base.url';

function RecuperarContrasena() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const passwordRef = useRef(null); // Crear la referencia para el input de correo
  const navigate = useNavigate();

  // ⏳ Cuando el modal se abre, espera 5 segundos y redirige al login
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        navigate('/login'); // Redirige al login
      }, 5000);

      return () => clearTimeout(timer); // Limpia el timeout si el componente se desmonta
    }
  }, [isModalOpen, navigate]);

  const recover = async (e) => {
    e.preventDefault();

    // Obtener el correo usando ref
    const newPasswordData = {
      password: passwordRef.current.value,
    };

    try {
      // Enviar la solicitud POST con JSON en el cuerpo
      console.log(localStorage.getItem('tempToken'));
      const response = await axios.post(`
        ${url}/user/change-pass`,
        newPasswordData,
        {
          headers: {
            'Content-Type': 'application/json', // Especificar que se envía JSON,
            'Authorization':`Bearer ${localStorage.getItem('tempToken')}`
          }
        }
      );

      if(response.data.status >= 300) {
        alert(response.data.data);
        return;
      }

      localStorage.removeItem('tempToken');

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.recover}>
        <h2 className={styles.tittle}>Actualizar contraseña</h2>
        <div>
          <input
            ref={passwordRef} // Asignar la referencia al input
            className={styles.box}
            name="password"
            type="password"
            placeholder="Nueva contraseña"
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
            <h2 className={styles.formT}>Contraseña actualizada</h2>
            <p className={styles.p}>Serás redirigido al login en 5 segundos...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecuperarContrasena;