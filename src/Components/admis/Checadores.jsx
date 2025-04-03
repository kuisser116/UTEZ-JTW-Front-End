import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/stylesAdmin/Home.module.css';
import tableStyles from '../../assets/styles/Components/TablaChecadores.module.css';
import { useNavigate } from 'react-router-dom';
import Header from '../Components/HeaderAdminHC';
import NavBar from '../Components/NavBar'; 
import TableCheck from '../Components/TableChecadores';
import plus from '../../assets/img/Assets_admin/plus-regular-240.png';
import arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png';

function Events() {
    const [openModal, setOpenModal] = useState(false);
    const [checadores, setChecadores] = useState([]);
    const [adminEvents, setAdminEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    console.log(token)
    const adminId = localStorage.getItem("adminId");
    const sId = localStorage.getItem("sId");
    console.log(sId)

    useEffect(() => {
        if (!token) {
            console.log('No puedes entrar')
            navigate("/login");
        } else {
            fetchChecadores();
            fetchAdminEvents();
        }
    }, []);

    const fetchAdminEvents = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/event/admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAdminEvents(response.data.data);
        } catch (error) {
            console.error('Error al obtener eventos del admin:', error);
        }
    };

    const fetchChecadores = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/supervisor/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setChecadores(response.data.data);
        } catch (error) {
            console.error('Error al obtener checadores:', error);
        }
    };

    const handleAssignEvent = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/supervisor/${sId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            const existingEvents = response.data.events || [];
            console.log(existingEvents)
            const updatedEvents = [...new Set([...existingEvents, selectedEvent])];
            console.log(updatedEvents)
            await axios.put(`http://localhost:3000/api/supervisor/${sId}`, {
                events: updatedEvents
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setOpenAssignModal(false);
            fetchChecadores();
            window.location.reload();
        } catch (error) {
            console.error('Error al asignar evento:', error);
        }
    };

    return (
        <div>
            <Header />
            <NavBar /> 
            <h2 className={styles.tittle}>Checadores</h2>
            <div className={styles.search}>
                <input className={styles.searchInput} type="text" placeholder="Buscar checador" />
            </div>
            
            <button onClick={() => setOpenModal(true)} className={styles.addEvent}>
                Agregar checador <img className={styles.plusadd} src={plus} alt="" />
            </button>

            {openModal && (
                <div className={styles.modalOverlay}>
                    <div className={`${styles.modalContent} ${styles.tableContent}`}>
                        <img onClick={() => setOpenModal(false)} className={styles.arrowM} src={arrow} alt="" />
                        <h2 className={styles.formT}>Lista de Checadores</h2>
                        <div className={styles.tablaContainer}>
                            <table className={styles.tablaTalleres}>
                                <thead>
                                    <tr className={styles.encabezado}>
                                        <th>Nombre del Checador</th>
                                        <th>Correo</th>
                                        <th>Teléfono</th>
                                        <th>Status</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checadores.length > 0 ? (
                                        checadores.map((checador) => (
                                            <tr key={checador._id}>
                                                <td>{`${checador.name} ${checador.lastname}`}</td>
                                                <td>{checador.email}</td>
                                                <td>{checador.cellphoneNumber}</td>
                                                <td>{checador.status ? 'Activo' : 'Inactivo'}</td>
                                                <td>
                                                    <button 
                                                        className={styles.add}
                                                        onClick={() => {
                                                            setSelectedSupervisor(checador);
                                                            setOpenAssignModal(true);
                                                            localStorage.setItem('sId', checador._id);
                                                        }}
                                                    >
                                                        Agregar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">No hay checadores disponibles.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {openAssignModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent2}>
                        <select 
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className={styles.options}
                        >
                            <option value="">Seleccionar evento</option>
                            {adminEvents.map((event) => (
                                <option key={event._id} value={event._id}>
                                    {event.name}
                                </option>
                            ))}
                        </select>
                        <div className={styles.siC}>
                            <button 
                                onClick={handleAssignEvent}
                                className={styles.add}
                                disabled={!selectedEvent}
                            >
                                Confirmar
                            </button>
                            <button 
                                onClick={() => setOpenAssignModal(false)}
                                className={styles.cancel}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className={styles.eventsGrid}>
               <TableCheck/>
            </div>
        </div>
    );
}

export default Events;
