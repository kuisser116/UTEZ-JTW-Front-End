import { useState, useEffect } from 'react';
import styles from '../../assets/styles/Components/TablaChecadores.module.css';
import pen from '../../assets/img/Assets_admin/pencil-solid-240.png';
import axios from 'axios';

function TableChecadores() {
    const [supervisores, setSupervisores] = useState([]);
    const [events, setEvents] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [adminEvents, setAdminEvents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/supervisor/');
                setSupervisores(response.data.data);

                const responseEventos = await axios.get('http://localhost:3000/api/event/all-events');
                const eventosMap = responseEventos.data.data.reduce((acc, evento) => {
                    acc[evento._id] = evento.name;
                    return acc;
                }, {});
                setEvents(eventosMap);

                const adminId = localStorage.getItem('adminId');
                if (adminId) {
                    const responseAdminEvents = await axios.get(`http://localhost:3000/api/event/admin/${adminId}`);
                    setAdminEvents(responseAdminEvents.data.data);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
        fetchData();
    }, []);

    const handleEditClick = (supervisor) => {
        setSelectedSupervisor(supervisor);
        setOpenEditModal(true);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/supervisor/${selectedSupervisor._id}`, {
                events: selectedSupervisor.events, // Asegúrate de actualizar los eventos correctamente
                status: selectedSupervisor.status
            });
            setOpenEditModal(false);
            console.log(selectedSupervisor.email)
            location.reload();
        } catch (error) {
            console.error('Error al actualizar el supervisor:', error);
            alert('Error al actualizar el supervisor');
        }
    };

    return (
        <div>
            <div className={styles.tableContent}>
                <div className={styles.tablaContainer}>
                    <table className={styles.tablaTalleres}>
                        <thead>
                            <tr className={styles.encabezado}>
                                <th>Nombre del Checador</th>
                                <th>Correo</th>
                                <th>Evento Asignado</th>
                                <th>Status</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supervisores.map(supervisor => (
                                <tr key={supervisor._id}>
                                    <td>{supervisor.name}</td>
                                    <td>{supervisor.email}</td>
                                    <td>
                                        {supervisor.events.map(eventoId => (
                                            <span key={eventoId}>
                                                {events[eventoId] || "Evento no encontrado"}
                                                <br />
                                            </span>
                                        ))}
                                    </td>
                                    <td>{supervisor.status ? 'Activo' : 'Inactivo'}</td>
                                    <td className={styles.edit}>
                                        <img className={styles.img} src={pen} alt="Editar" onClick={() => handleEditClick(supervisor)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {openEditModal && selectedSupervisor && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Editar Supervisor</h2>
                        <form onSubmit={handleEditSubmit}>
                            <select 
                                className={styles.inputS} 
                                value={selectedSupervisor.events[0] || ''} 
                                onChange={(e) => setSelectedSupervisor({ ...selectedSupervisor, events: [e.target.value] })} 
                            >
                                <option value="">Seleccionar evento</option>
                                {adminEvents.map(event => (
                                    <option key={event._id} value={event._id}>{event._id}</option>
                                ))}
                            </select>

                            <select 
                                className={styles.inputS} 
                                value={selectedSupervisor.status} 
                                onChange={(e) => setSelectedSupervisor({ ...selectedSupervisor, status: e.target.value === 'true' })}
                            >
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>

                            <button type="submit" className={styles.btn}>Guardar</button>
                        </form>
                        <button onClick={() => setOpenEditModal(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TableChecadores;
