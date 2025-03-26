import { useState } from 'react';
import EventImg from '../../assets/img/assets_participante/wallpaperflare.com_wallpaper.jpg';
import styles from '../../assets/styles/stylesUser/events.module.css';
import Header from '../Components/Header';
import {Link} from 'react-router-dom'

function Eventpage() {
    const today = new Date().toLocaleDateString();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <Header />

            {/* Imagen del evento */}
            <div className={styles.EventImg}>
                <div className={styles.gradient} style={{ background: 'linear-gradient(to right,#F4F2EE,rgba(254, 180, 123, 0))' }}></div>
                <img className={styles.img} src={EventImg} alt="" />

                {/* Información del evento */}
                <div className={styles.eventPart}>
                    <h2>Título del Evento</h2>
                    
                    {/* Botón para abrir el modal */}
                    <button onClick={() => setIsModalOpen(true)}>Registrarse</button>
                    
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
                    <p>{today}</p>
                    <h3>Activo</h3>
                </div>
            </div>

            {/* Modal de Registro */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2  className={styles.formT}>Registro al Evento</h2>
                        <form>
                            <input type="text" placeholder="Nombres" required />
                            <input type="email" placeholder="Apellidos" required />
                            <input type="tel" placeholder="Genero" required />
                            <input type="tel" placeholder="Fecha de nacimiento" required />
                            <input type="tel" placeholder="Email" required />
                            <input type="tel" placeholder="Estado de residencia" required />
                            <input type="tel" placeholder="Lugar de trabajo(Opccional)" required />
                            <input type="tel" placeholder="Telefono" required />


                            <Link  to={'/ListEvent'} state={'/Events'}><button type="submit" className={styles.Mbtn}>Confirmar</button></Link>
                            <button type="button" onClick={() => setIsModalOpen(false)} className={styles.Mbtn}>Cerrar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Eventpage;
