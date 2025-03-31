import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/Components/TablaAdministradores.module.css';
import arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png'; // Asegúrate de tener esta imagen
import pen from '../../assets/img/Assets_admin/pencil-solid-240.png';

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

    useEffect(() => {
        const fetchAdministradores = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/administrator/');
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
            role: admin.role,
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
            await axios.put(`http://localhost:3000/api/administrator/${selectedAdmin._id}`, formData);
            setAdministradores((prevState) =>
                prevState.map((admin) =>
                    admin._id === selectedAdmin._id ? { ...admin, ...formData } : admin
                )
            );
            handleCloseModal();
        } catch (error) {
            console.error('Error al actualizar el administrador:', error);
        }
    };

    return (
        <div>
            <div className={styles.tableContent}>
                <div className={styles.tablaContainer}>
                    <table className={styles.tablaTalleres}>
                        <thead>
                            <tr className={styles.encabezado}>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {administradores.length > 0 ? (
                                administradores.map((admin, index) => (
                                    <tr key={index}>
                                        <td>{admin.name} {admin.lastname}</td>
                                        <td>{admin.email}</td>
                                        <td>{admin.role}</td>
                                        <td>{admin.cellphoneNumber}</td>
                                         <td className={styles.edit}>
                                            <img className={styles.img} src={pen} onClick={() => handleEdit(admin)} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className={styles.noData}>No hay administradores con el rol "EventAdmin"</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Editar Administrador */}
            {openModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <img onClick={handleCloseModal} className={styles.arrowM} src={arrow} alt="Cerrar" />
                        <h2 className={styles.formT}>Editar Administrador</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                className={styles.input}
                                name="name"
                                type="text"
                                placeholder="Nombre"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                className={styles.input}
                                name="lastname"
                                type="text"
                                placeholder="Apellido"
                                value={formData.lastname}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                className={styles.input}
                                name="email"
                                type="email"
                                placeholder="Correo"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <select
                                className={styles.inputS}
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="EventAdmin">EventAdmin</option>
                                <option value="SuperAdmin">SuperAdmin</option>
                            </select>
                            <input
                                className={styles.input}
                                name="cellphoneNumber"
                                type="text"
                                placeholder="Teléfono"
                                value={formData.cellphoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="submit" className={styles.btn}>Guardar cambios</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TableAdministradores;
