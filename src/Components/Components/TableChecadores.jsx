import { useState, useEffect } from 'react';
import styles from '../../assets/styles/Components/TablaChecadores.module.css';
import pen from '../../assets/img/Assets_admin/pencil-solid-240.png';
import axios from 'axios';
import { url } from '../../utils/base.url';
import arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png';
import { Toaster, toast } from 'sonner'
import disable from '../../assets/img/Assets_admin/user-minus-regular-240.png';
import check from '../../assets/img/Assets_admin/user-plus-regular-240.png';

function TableChecadores() {
    const [supervisores, setSupervisores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [events, setEvents] = useState({});
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [adminEvents, setAdminEvents] = useState([]);
    const [workshops, setWorkshops] = useState([]);
    const [selectedEventWorkshops, setSelectedEventWorkshops] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [itemsPorPagina] = useState(10);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    
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

                // Filtrar supervisores por el administrador actual
                const supervisoresFiltrados = responseSupervisores.data.data.filter(
                    supervisor => supervisor.administrator === adminId
                );
                
                setSupervisores(supervisoresFiltrados);

                // Obtener eventos de la base de datos
                const responseEventos = await axios.get(`${url}/event/all-events`);
                const eventosMap = responseEventos.data.data.reduce((acc, evento) => {
                    acc[evento._id] = evento.name;
                    return acc;
                }, {});
                setEvents(eventosMap);

                // Obtener eventos del admin actual
                if (adminId) {
                    const responseAdminEvents = await axios.get(`${url}/event/admin`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setAdminEvents(responseAdminEvents.data.data.map(evento => evento._id));
                }

                const responseWorkshops = await axios.get(`${url}/workshop/all-workshops`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setWorkshops(responseWorkshops.data.data);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                toast.error('Error al cargar los datos');
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
            // 1. Primero obtenemos los datos actuales del supervisor
            const supervisorResponse = await axios.get(`${url}/supervisor/${selectedSupervisor._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const talleresActuales = supervisorResponse.data.data.workshops || [];

            // 2. Eliminamos al supervisor de todos sus talleres actuales
            for (const workshopId of talleresActuales) {
                try {
                    await axios.delete(
                        `${url}/workshop/remove-supervisor/${workshopId}/${selectedSupervisor._id}`,
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                } catch (error) {
                    console.error(`Error al eliminar supervisor del taller ${workshopId}:`, error);
                    toast.error(`Error al eliminar supervisor del taller`);
                }
            }

            // 3. Actualizamos la información básica del supervisor (evento y estado)
            await axios.put(`${url}/supervisor/${selectedSupervisor._id}`, {
                events: selectedSupervisor.events,
                status: selectedSupervisor.status
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // 4. Agregamos el supervisor a los nuevos talleres seleccionados
            const talleresNuevos = selectedSupervisor.workshops || [];
            for (const workshopId of talleresNuevos) {
                try {
                    await axios.put(
                        `${url}/workshop/add-supervisor/${workshopId}/${selectedSupervisor._id}`,
                        {},
                        { headers: { 'Authorization': `Bearer ${token}` } }
                    );
                } catch (error) {
                    if (error.response && error.response.data.errorCode === 11000) {
                        console.log(`El supervisor ya está asignado al taller ${workshopId}`);
                        continue;
                    }
                    console.error(`Error al agregar supervisor al taller ${workshopId}:`, error);
                    toast.error(`Error al agregar supervisor al taller`);
                }
            }

            toast.success('Supervisor actualizado correctamente');
            setOpenEditModal(false);
            location.reload();
        } catch (error) {
            toast.error('Error al actualizar el supervisor');
            console.error('Error al actualizar el supervisor:', error);
        }
    };

    const handleStatusChange = async (supervisor) => {
        try {
            const newStatus = !supervisor.status;
            await axios.put(`${url}/supervisor/${supervisor._id}`, 
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            // Actualizar el estado local
            setSupervisores((prevState) =>
                prevState.map((s) =>
                    s._id === supervisor._id ? { ...s, status: newStatus } : s
                )
            );
            
            setOpenConfirmModal(false);
            location.reload();
        } catch (error) {
            console.error('Error al actualizar el estado del checador:', error);
        }
    };

    // Función para cambiar de página
    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    // Función para ir a la página anterior
    const irPaginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };

    // Función para ir a la página siguiente
    const irPaginaSiguiente = () => {
        const totalPaginas = Math.ceil(supervisores.length / itemsPorPagina);
        if (paginaActual < totalPaginas) {
            setPaginaActual(paginaActual + 1);
        }
    };

    // Función para generar los botones de paginación con elipsis
    const generarBotonesPaginacion = () => {
        const botones = [];
        const totalPaginas = Math.ceil(supervisores.length / itemsPorPagina);
        
        if (totalPaginas <= 5) {
            // Si hay 5 páginas o menos, mostrar todos los botones
            for (let i = 1; i <= totalPaginas; i++) {
                botones.push(
                    <button
                        key={i}
                        onClick={() => cambiarPagina(i)}
                        className={`${styles.paginationButton} ${paginaActual === i ? styles.paginationActive : ''}`}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // Siempre mostrar la primera página
            botones.push(
                <button
                    key={1}
                    onClick={() => cambiarPagina(1)}
                    className={`${styles.paginationButton} ${paginaActual === 1 ? styles.paginationActive : ''}`}
                >
                    1
                </button>
            );

            // Lógica para determinar qué botones mostrar con elipsis
            let startPage, endPage;
            
            if (paginaActual <= 3) {
                startPage = 2;
                endPage = 4;
                botones.push(
                    ...Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                        const pagina = startPage + i;
                        return (
                            <button
                                key={pagina}
                                onClick={() => cambiarPagina(pagina)}
                                className={`${styles.paginationButton} ${paginaActual === pagina ? styles.paginationActive : ''}`}
                            >
                                {pagina}
                            </button>
                        );
                    })
                );
                botones.push(
                    <span key="ellipsis1" className={styles.paginationEllipsis}>...</span>
                );
            } else if (paginaActual >= totalPaginas - 2) {
                botones.push(
                    <span key="ellipsis1" className={styles.paginationEllipsis}>...</span>
                );
                startPage = totalPaginas - 3;
                endPage = totalPaginas - 1;
                botones.push(
                    ...Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                        const pagina = startPage + i;
                        return (
                            <button
                                key={pagina}
                                onClick={() => cambiarPagina(pagina)}
                                className={`${styles.paginationButton} ${paginaActual === pagina ? styles.paginationActive : ''}`}
                            >
                                {pagina}
                            </button>
                        );
                    })
                );
            } else {
                botones.push(
                    <span key="ellipsis1" className={styles.paginationEllipsis}>...</span>
                );
                botones.push(
                    ...Array.from({ length: 3 }, (_, i) => {
                        const pagina = paginaActual - 1 + i;
                        return (
                            <button
                                key={pagina}
                                onClick={() => cambiarPagina(pagina)}
                                className={`${styles.paginationButton} ${paginaActual === pagina ? styles.paginationActive : ''}`}
                            >
                                {pagina}
                            </button>
                        );
                    })
                );
                botones.push(
                    <span key="ellipsis2" className={styles.paginationEllipsis}>...</span>
                );
            }

            // Siempre mostrar la última página
            botones.push(
                <button
                    key={totalPaginas}
                    onClick={() => cambiarPagina(totalPaginas)}
                    className={`${styles.paginationButton} ${paginaActual === totalPaginas ? styles.paginationActive : ''}`}
                >
                    {totalPaginas}
                </button>
            );
        }
        
        return botones;
    };

    // Agregar función para filtrar supervisores
    const supervisoresFiltrados = supervisores.filter(supervisor =>
        supervisor.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Modificar el cálculo de la paginación para usar supervisoresFiltrados
    const indexUltimoItem = paginaActual * itemsPorPagina;
    const indexPrimerItem = indexUltimoItem - itemsPorPagina;
    const supervisoresActuales = supervisoresFiltrados.slice(indexPrimerItem, indexUltimoItem);
    const totalPaginas = Math.ceil(supervisoresFiltrados.length / itemsPorPagina);

    return (
        <div>
            <Toaster position="top-center" />
            <div className={styles.tableContent}>
                <div className={styles.tablaContainer}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Buscar checador por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    
                    <table className={styles.tablaTalleres}>
                        <thead>
                            <tr className={styles.encabezado}>
                                <th>Número</th>
                                <th>Nombre del Checador</th>
                                <th>Correo</th>
                                <th>Evento Asignado</th>
                                <th>Status</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supervisoresActuales.length > 0 ? (
                                supervisoresActuales.map((supervisor, index) => (
                                    <tr key={supervisor._id}>
                                        <td>{(paginaActual - 1) * itemsPorPagina + index + 1}</td>
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
                                            <img 
                                                className={styles.img} 
                                                src={supervisor.status ? disable : check} 
                                                onClick={() => {
                                                    setSelectedSupervisor(supervisor);
                                                    setConfirmAction(supervisor.status ? 'desactivar' : 'activar');
                                                    setOpenConfirmModal(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No hay checadores asignados a los eventos del administrador.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className={styles.paginationContainer}>
                        <button 
                            onClick={irPaginaAnterior} 
                            disabled={paginaActual === 1}
                            className={`${styles.paginationArrow} ${paginaActual === 1 ? styles.disabled : ''}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        
                        {generarBotonesPaginacion()}
                        
                        <button 
                            onClick={irPaginaSiguiente} 
                            disabled={paginaActual === Math.ceil(supervisores.length / itemsPorPagina)}
                            className={`${styles.paginationArrow} ${paginaActual === Math.ceil(supervisores.length / itemsPorPagina) ? styles.disabled : ''}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
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



                            <button type="submit" className={styles.add}>Guardar</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Confirmación */}
            {openConfirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContentStatus}>
                        <h2 className={styles.formT}>Confirmar Acción</h2>
                        <p className={styles.pStatus}>
                            ¿Seguro que quieres {confirmAction} a {selectedSupervisor.name}?
                        </p>
                        <div className={styles.buttonContainer}>
                            <button 
                                className={styles.btnCancel}
                                onClick={() => setOpenConfirmModal(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className={styles.btnConfirm}
                                onClick={() => handleStatusChange(selectedSupervisor)}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TableChecadores;
