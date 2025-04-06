import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/stylesSA/Home.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/HeaderAdminHC';
import NavBar from '../Components/SNavBar'; 
import plus from '../../assets/img/Assets_admin/plus-regular-240.png';
import TableAdmin from '../Components/TableSA'
import arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png';
import { url } from '../../utils/base.url';
import { Toaster, toast } from 'sonner'


function Events() {
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        role: 'SuperAdmin', // Valor predeterminado
        cellphoneNumber: '',
        company: ''
    });

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    useEffect(() => {
        if (!token) {
            console.log('No puedes entrar')
            navigate("/login"); // Redirige al login si no hay token
        }
    }, []); 

      // Este useEffect actualizará la contraseña con el correo cuando el email cambie
      useEffect(() => {
          if (formData.email) {
              setFormData((prevData) => ({
                  ...prevData,
                  password: formData.email // Asigna el correo como contraseña por defecto
              }));
          }
      }, [formData.email]); // Solo se ejecuta cuando el email cambia
  
      const handleChange = (e) => {
          setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    const enviarUsuario = async (event) => {
        event.preventDefault();
        try {
            const responseUser = await axios.post('http://localhost:3000/api/auth/register', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaa',responseUser.data);
            setOpenModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error al agregar usuario', error);
            toast.error('Correo ya registrado');
        }
    };

    

    return (
        <div>
            <Toaster position="top-center" />
            <Header />
            <NavBar />
            <h2 className={styles.tittle}>Super Administradores</h2>
                     
            <button onClick={() => setOpenModal(true)} className={styles.addEvent}>
                Agregar usuario <img className={styles.plusadd} src={plus} alt="" />
            </button>
            
            {openModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <img onClick={() => setOpenModal(false)} className={styles.arrowM} src={arrow} alt="" />
                        <h2 className={styles.formT}>Agregar usuario</h2>
                        <form onSubmit={enviarUsuario}>
                            <input className={styles.input} name="name" type="text" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
                            <input className={styles.input} name="lastname" type="text" placeholder="Apellido" value={formData.lastname} onChange={handleChange} required />
                            <input className={styles.input} name="email" type="email" placeholder="Correo" value={formData.email} onChange={handleChange} required />
                            <input className={styles.input} name="cellphoneNumber" type="tel" placeholder="Número de celular" value={formData.cellphoneNumber} onChange={handleChange} required />
                            <input className={styles.input} name="company" type="text" placeholder="Compañía" value={formData.company} onChange={handleChange} required />
                            <button type="submit" className={styles.btn}>Guardar</button>
                        </form>
                    </div>
                </div>
            )}

                    <div className={styles.eventsGrid}>
                    <TableAdmin/>
                    </div>
        </div>
    );
}

export default Events;
