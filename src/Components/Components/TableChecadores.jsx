import { useState, useEffect } from 'react';
import styles from '../../assets/styles/Components/TablaChecadores.module.css';
import pen from '../../assets/img/Assets_admin/pencil-solid-240.png';
import axios from 'axios';
import { url } from '../../utils/base.url';
import arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png';
import { Toaster, toast } from 'sonner'

function TableChecadores() {
    const [supervisores, setSupervisores] = useState([]);
    const [events, setEvents] = useState({});
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [adminEvents, setAdminEvents] = useState([]);
    const [workshops, setWorkshops] = useState([]);
    const [selectedEventWorkshops, setSelectedEventWorkshops] = useState([]);
    
    const token = localStorage.getItem("token");
    const adminId = localStorage.getItem("adminId");
    console.log(token)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener todos los supervisores
                const responseSupervisores = await axios.get(`${url}/supervisor/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                console.log(responseSupervisores.data)

                // Obtener eventos de la base de datos
                const responseEventos = await axios.get(`${url}/event/all-events`);
                const eventosMap = responseEventos.data.data.reduce((acc, evento) => {
                    acc[evento._id] = evento.name;
                    return acc;
                }, {});
                setEvents(eventosMap);

                // Obtener eventos asignados al administrador actual
                if (adminId) {
                    const responseAdminEvents = await axios.get(`${url}/event/admin`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });

                    const eventosDelAdmin = responseAdminEvents.data.data.map(evento => evento._id);
                    setAdminEvents(eventosDelAdmin);

                    // Filtrar supervisores que están asignados a los eventos del admin
                    const supervisoresFiltrados = responseSupervisores.data.data.filter(supervisor =>
                        supervisor.events.some(eventoId => eventosDelAdmin.includes(eventoId))
                    );

                    setSupervisores(supervisoresFiltrados);
                }

                // Add workshop fetching
                const responseWorkshops = await axios.get(`${url}/workshop/all-workshops`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setWorkshops(responseWorkshops.data.data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (supervisor) => {
        setSelectedSupervisor(supervisor);
        setOpenEditModal(true);
    
        // Cargar talleres del evento actual
        if (supervisor.events && supervisor.events[0]) {
            const currentEventId = supervisor.events[0];
            const filteredWorkshops = workshops.filter(workshop => workshop.event === currentEventId);
            setSelectedEventWorkshops(filteredWorkshops);
        } else {
            setSelectedEventWorkshops([]);
        }
    };
    
    const handleEventChange = (e) => {
        const selectedEventId = e.target.value;
        setSelectedSupervisor(prev => ({
            ...prev,
            events: [selectedEventId],
            workshops: []
        }));
        
        // Filter workshops for the selected event
        const filteredWorkshops = workshops.filter(workshop => 
            workshop.event === selectedEventId
        );
        setSelectedEventWorkshops(filteredWorkshops);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
                await axios.put(`${url}/supervisor/${selectedSupervisor._id}`, {
                events: selectedSupervisor.events,
                workshops: selectedSupervisor.workshops,
                status: selectedSupervisor.status
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const workshopId = selectedSupervisor.workshops;
            const response = await axios.put(
                `${url}/workshop/add-supervisor/${workshopId}/${selectedSupervisor._id}`,
                {},
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            console.log(response.data)
            
            

            setOpenEditModal(false);
            location.reload();
        } catch (error) {
            toast.error('Este supervisor ya está asignado a este taller');
            console.error('Error al actualizar el supervisor:', error);
        }
    };

    return (
        <div>
            <Toaster position="top-center" />
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
                            {supervisores.length > 0 ? (
                                supervisores.map(supervisor => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No hay checadores asignados a los eventos del administrador.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {openEditModal && selectedSupervisor && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <img onClick={() => setOpenEditModal(false)} className={styles.arrowM} src={arrow} alt="" />
                        <h2 className={styles.formT}>Editar Checador</h2>
                        <form onSubmit={handleEditSubmit}>
                            <select 
                                className={styles.inputS} 
                                value={selectedSupervisor.events[0] || ''} 
                                onChange={handleEventChange}
                            >
                                <option value="">Seleccionar evento</option>
                                {adminEvents.map(eventId => (
                                    <option key={eventId} value={eventId}>{events[eventId] || "Evento no encontrado"}</option>
                                ))}
                            </select>

                            <select 
                                className={styles.inputS}
                                multiple
                                value={selectedSupervisor.workshops || []}
                                onChange={(e) => setSelectedSupervisor({
                                    ...selectedSupervisor,
                                    workshops: Array.from(e.target.selectedOptions, option => option.value)
                                })}
                            >
                                {selectedEventWorkshops.map(workshop => (
                                    <option key={workshop._id} value={workshop._id}>
                                        {workshop.name}
                                    </option>
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

                            <button type="submit" className={styles.add}>Guardar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TableChecadores;
