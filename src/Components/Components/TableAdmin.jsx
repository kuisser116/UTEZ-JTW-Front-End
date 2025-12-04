import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/Components/TablaChecadores.module.css';
import arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png'; // Asegúrate de tener esta imagen
import pen from '../../assets/img/Assets_admin/pencil-solid-240.png';
import disable from '../../assets/img/Assets_admin/user-minus-regular-240.png';
import check from '../../assets/img/Assets_admin/user-plus-regular-240.png';
import { url } from '../../utils/base.url';

function TableAdministradores() {
    const [administradores, setAdministradores] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        role: 'EventAdmin', // Valor por defecto
        cellphoneNumber: ''
    });
    const token = localStorage.getItem("token");
    const [searchTerm, setSearchTerm] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const [itemsPorPagina] = useState(5);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        const fetchAdministradores = async () => {
            try {
                const response = await axios.get(`${url}/administrator/`);
                console.log("Administradores recibidos en el frontend:", response.data.data);

                // Filtrar solo los administradores con el rol "EventAdmin"
                const filteredAdmins = response.data.data.filter(admin => admin.role === 'EventAdmin');
                setAdministradores(filteredAdmins);
            } catch (error) {
                console.error('Error al obtener los administradores:', error);
            }
        };
        fetchAdministradores();
    }, []);

    const handleEdit = (admin) => {
        setSelectedAdmin(admin);
        setFormData({
            name: admin.name,
            lastname: admin.lastname,
            email: admin.email,
            role: 'EventAdmin',
            cellphoneNumber: admin.cellphoneNumber
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedAdmin(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${url}/administrator/${selectedAdmin._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAdministradores((prevState) =>
                prevState.map((admin) =>
                    admin._id === selectedAdmin._id ? { ...admin, ...formData } : admin
                )
            );
            handleCloseModal();
            window.location.reload();
        } catch (error) {
            console.error('Error al actualizar el administrador:', error);
        }
    };

    const handleStatusChange = async (admin) => {
        try {
            const newStatus = !admin.status;
            await axios.put(`${url}/administrator/${admin._id}`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setAdministradores((prevState) =>
                prevState.map((a) =>
                    a._id === admin._id ? { ...a, status: newStatus } : a
                )
            );

            setOpenConfirmModal(false);
        } catch (error) {
            console.error('Error al actualizar el estado del administrador:', error);
        }
    };

    // Funciones de paginación
    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina);
    };

    const irPaginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };

    const irPaginaSiguiente = () => {
        const totalPaginas = Math.ceil(administradoresFiltrados.length / itemsPorPagina);
        if (paginaActual < totalPaginas) {
            setPaginaActual(paginaActual + 1);
        }
    };

    const generarBotonesPaginacion = () => {
        const botones = [];
        const totalPaginas = Math.ceil(administradoresFiltrados.length / itemsPorPagina);

        if (totalPaginas <= 5) {
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
            // Primera página
            botones.push(
                <button
                    key={1}
                    onClick={() => cambiarPagina(1)}
                    className={`${styles.paginationButton} ${paginaActual === 1 ? styles.paginationActive : ''}`}
                >
                    1
                </button>
            );

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
                botones.push(<span key="ellipsis1">...</span>);
            } else if (paginaActual >= totalPaginas - 2) {
                botones.push(<span key="ellipsis1">...</span>);
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
                botones.push(<span key="ellipsis1">...</span>);
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
                botones.push(<span key="ellipsis2">...</span>);
            }

            // Última página
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

    // Filtrado de administradores
    const administradoresFiltrados = administradores.filter(admin =>
        `${admin.name} ${admin.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cálculo de elementos para la página actual
    const indexUltimoItem = paginaActual * itemsPorPagina;
    const indexPrimerItem = indexUltimoItem - itemsPorPagina;
    const administradoresActuales = administradoresFiltrados.slice(indexPrimerItem, indexUltimoItem);

    console.log('administradoresActuales', administradoresActuales)

    return (
        <div>
            <div className={styles.tableContent}>
                <div className={styles.tablaContainer}>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Buscar administrador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <table className={styles.tablaTalleres}>
                        <thead>
                            <tr className={styles.encabezado}>
                                <th>Numero</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Teléfono</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {administradoresActuales.length > 0 ? (
                                administradoresActuales.map((admin, index) => (
                                    <tr key={index}>
                                        <td className={styles.edit}>{indexPrimerItem + index + 1}</td>
                                        <td className={styles.edit}>{admin.name} {admin.lastname}</td>
                                        <td className={styles.edit}>{admin.email}</td>
                                        <td className={styles.edit}>{admin.role}</td>
                                        <td className={styles.edit}>{admin.cellphoneNumber}</td>
                                        <td className={styles.edit}>{admin.status === true ? "Activo" : "Inactivo"}</td>
                                        <td className={styles.edit}>
                                            <img className={styles.img} src={pen} onClick={() => handleEdit(admin)} />
                                            <img
                                                className={styles.img}
                                                src={admin.status ? disable : check}
                                                onClick={() => {
                                                    setSelectedAdmin(admin);
                                                    setConfirmAction(admin.status ? 'desactivar' : 'activar');
                                                    setOpenConfirmModal(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className={styles.noData}>No hay administradores disponibles</td>
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
                                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {generarBotonesPaginacion()}

                        <button
                            onClick={irPaginaSiguiente}
                            disabled={paginaActual === Math.ceil(administradoresFiltrados.length / itemsPorPagina)}
                            className={`${styles.paginationArrow} ${paginaActual === Math.ceil(administradoresFiltrados.length / itemsPorPagina) ? styles.disabled : ''}`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Editar Administrador */}
            {openModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <img onClick={handleCloseModal} className={styles.arrowM} src={arrow} alt="Cerrar" />
                        <h2 className={styles.formT}>Editar Administrador</h2>
                        <form onSubmit={handleSubmit}>
                            <label style={{ color: '#252525' }}>Nombre:</label>
                            <br />
                            <input
                                className={styles.inputS1}
                                name="name"
                                type="text"
                                placeholder="Nombre"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <br />
                            <label style={{ color: '#252525' }}>Apellido:</label>
                            <br />
                            <input
                                className={styles.inputS1}
                                name="lastname"
                                type="text"
                                placeholder="Apellido"
                                value={formData.lastname}
                                onChange={handleInputChange}
                                required
                            />
                            <br />
                            <label style={{ color: '#252525' }}>Correo:</label>
                            <br />
                            <input
                                className={styles.inputS1}
                                name="email"
                                type="email"
                                placeholder="Correo"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <br />
                            <label style={{ color: '#252525' }}>Teléfono:</label>
                            <br />
                            <input
                                className={styles.inputS1}
                                name="cellphoneNumber"
                                type="text"
                                placeholder="Teléfono"
                                value={formData.cellphoneNumber}
                                onChange={handleInputChange}
                                required
                            />

                            <button type="submit" className={styles.add}>Guardar cambios</button>
                        </form>
                    </div>
                </div>
            )}

            {openConfirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContentStatus}>
                        <h2 className={styles.formT}>Confirmar Acción</h2>
                        <p className={styles.pStatus}>
                            ¿Seguro que quieres {confirmAction} a {selectedAdmin.name} {selectedAdmin.lastname}?
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
                                onClick={() => handleStatusChange(selectedAdmin)}
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

export default TableAdministradores;
