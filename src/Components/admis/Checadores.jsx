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
import { url } from '../../utils/base.url';


function Events() {
    const [openModal, setOpenModal] = useState(false);
    const [checadores, setChecadores] = useState([]);
    const [adminEvents, setAdminEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [openAssignModal, setOpenAssignModal] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [openModalRegister, setOpenModalRegister] = useState(false);
    const [workshops, setWorkshops] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        cellphoneNumber: '',
        events: [],
        workshops: []
    });
    const [selectedEventWorkshops, setSelectedEventWorkshops] = useState([]);
    const [filteredChecadores, setFilteredChecadores] = useState([]);
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
            fetchWorkshops();
        }
    }, []);

    useEffect(() => {
        filterAvailableChecadores();
    }, [checadores, adminEvents]);

    const filterAvailableChecadores = () => {
        const filtered = checadores.filter(checador => {
            // If the checker has no events, they are available
            if (!checador.events || checador.events.length === 0) return true;
            
            // Check if any of the checker's events belong to the current admin
            const hasAdminEvent = checador.events.some(checadorEvent => 
                adminEvents.some(adminEvent => adminEvent._id === checadorEvent)
            );
            
            // Return true if the checker has no events from this admin
            return !hasAdminEvent;
        });
        
        setFilteredChecadores(filtered);
    };

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

    const fetchWorkshops = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/workshop/all-workshops', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setWorkshops(response.data.data);
        } catch (error) {
            console.error('Error al obtener talleres:', error);
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

    const handleEventChange = (e) => {
        const selectedEventId = e.target.value;
        setFormData(prev => ({
            ...prev,
            events: [selectedEventId],
            workshops: [] // Reset workshops when event changes
        }));
        
        // Filter workshops for the selected event
        const filteredWorkshops = workshops.filter(workshop => 
            workshop.event === selectedEventId
        );
        setSelectedEventWorkshops(filteredWorkshops);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWorkshopChange = (e) => {
        const selectedWorkshops = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            workshops: selectedWorkshops
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const supervisorData = {
                ...formData,
                password: formData.email,
                role: "Checador",
                status: true
            };

            await axios.post('http://localhost:3000/api/supervisor/', supervisorData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setOpenModalRegister(false);
            fetchChecadores();
            window.location.reload();
        } catch (error) {
            console.error('Error al registrar checador:', error);
        }
    };

    return (
        <div>
            <Header />
            <NavBar /> 
            <h2 className={styles.tittle}>Checadores</h2>
          
            
            <button onClick={() => setOpenModal(true)} className={styles.addEvent}>
                Agregar checador 
            </button>

            {openModal && (
                <div className={styles.modalOverlay}>
                    <div className={`${styles.modalContent} ${styles.tableContent}`}>
                        <img onClick={() => setOpenModal(false)} className={styles.arrowM} src={arrow} alt="" />
                        <h2 className={styles.formT}>Lista de Checadores</h2>
                        <button className={styles.btnc} onClick={() => setOpenModalRegister(true)}>Registrar checador</button>
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
                                    {filteredChecadores.length > 0 ? (
                                        filteredChecadores.map((checador) => (
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

            {openModalRegister && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent3}>
                        <img onClick={() => setOpenModalRegister(false)} className={styles.arrowMR} src={arrow} alt="" />
                        <h2 className={styles.formT}>Registrar checador</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Nombre"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className={styles.input}
                            />
                            <input
                                type="text"
                                name="lastname"
                                placeholder="Apellido"
                                value={formData.lastname}
                                onChange={handleInputChange}
                                required
                                className={styles.input}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className={styles.input}
                            />
                            <input
                                type="tel"
                                name="cellphoneNumber"
                                placeholder="Número de teléfono"
                                value={formData.cellphoneNumber}
                                onChange={handleInputChange}
                                required
                                className={styles.input}
                            />
                            <select
                                name="events"
                                onChange={handleEventChange}
                                required
                                className={styles.options2}
                            >
                                <option value="">Seleccionar evento</option>
                                {adminEvents.map((event) => (
                                    <option key={event._id} value={event._id}>
                                        {event.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="workshops"
                                multiple
                                onChange={handleWorkshopChange}
                                required
                                className={styles.options2}
                            >
                                {selectedEventWorkshops.map((workshop) => (
                                    <option key={workshop._id} value={workshop._id}>
                                        {workshop.name}
                                    </option>
                                ))}
                            </select>
                            <div className={styles.buttonContainer}>
                                <button type="submit" className={styles.add}>
                                    Registrar Checador
                                </button>
                        
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Events;
