import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/styles/stylesLogin/recoverPassword.module.css';
import Header from '../Components/Header';

function RecuperarContrasena() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // ⏳ Cuando el modal se abre, espera 2 segundos y redirige al login
  useEffect(() => {
    if (isModalOpen) {
      const timer = setTimeout(() => {
        navigate('/login'); // Redirige al login
      }, 2000);

      return () => clearTimeout(timer); // Limpia el timeout si el componente se desmonta
    }
  }, [isModalOpen, navigate]);

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.recover}>
        <h2 className={styles.tittle}>Recuperar contraseña</h2>
        <div>
          <input className={styles.box} type="email" placeholder="Correo" />
        </div>
        <div>
          <button onClick={() => setIsModalOpen(true)} className={styles.btn}>
            Enviar
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.formT}>Correo enviado</h2>
            <p className={styles.p}>Serás redirigido al login en 2 segundos...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecuperarContrasena;
