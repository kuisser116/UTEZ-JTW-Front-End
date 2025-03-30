import { useState } from 'react';
import styles from '../../assets/styles/Components/TablaChecadores.module.css';
import pen from '../../assets/img/Assets_admin/pencil-solid-240.png';
import trash from '../../assets/img/Assets_admin/trash-regular-240.png';

function TableChecadores() {
    // 📋 Estado de los checadores
    const [checadores, setChecadores] = useState([
        { id: 1, nombre: "Juan Pérez", correo: "juan@example.com", evento: "Conferencia Tech", estatus: "Activo" },
        { id: 2, nombre: "María López", correo: "maria@example.com", evento: "Hackathon 2024", estatus: "Inactivo" },
        { id: 3, nombre: "Carlos Ruiz", correo: "carlos@example.com", evento: "Taller de IA", estatus: "Activo" },
        { id: 4, nombre: "Ana Torres", correo: "ana@example.com", evento: "Congreso de Software", estatus: "Pendiente" },
        { id: 5, nombre: "Luis Gómez", correo: "luis@example.com", evento: "Expo Innovación", estatus: "Activo" }
    ]);

    // 📝 Estados para los modales
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentChecador, setCurrentChecador] = useState(null);

    // 🖊 Abrir modal de edición con datos del checador seleccionado
    const openEditModal = (checador) => {
        setCurrentChecador(checador);
        setIsEditModalOpen(true);
    };

    // 🗑 Abrir modal de eliminación
    const openDeleteModal = (checador) => {
        setCurrentChecador(checador);
        setIsDeleteModalOpen(true);
    };

    // ✅ Guardar cambios en el checador editado
    const handleEditSave = () => {
        setChecadores(checadores.map(ch => ch.id === currentChecador.id ? currentChecador : ch));
        setIsEditModalOpen(false);
    };

    // 🚮 Eliminar checador
    const handleDelete = () => {
        setChecadores(checadores.filter(ch => ch.id !== currentChecador.id));
        setIsDeleteModalOpen(false);
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
                                <th>Estatus</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checadores.map(checador => (
                                <tr key={checador.id}>
                                    <td>{checador.nombre}</td>
                                    <td>{checador.correo}</td>
                                    <td>{checador.evento}</td>
                                    <td>{checador.estatus}</td>
                                    <td className={styles.edit}>
                                        <img 
                                            className={styles.img} 
                                            src={pen} 
                                            alt="Editar" 
                                            onClick={() => openEditModal(checador)} 
                                        />
                                        <img 
                                            className={styles.img} 
                                            src={trash} 
                                            alt="Eliminar" 
                                            onClick={() => openDeleteModal(checador)} 
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 📌 Modal de edición */}
            {isEditModalOpen && currentChecador && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Editar Checador</h2>
                        <input 
                            type="text" 
                            value={currentChecador.nombre} 
                            onChange={(e) => setCurrentChecador({...currentChecador, nombre: e.target.value})} 
                        />
                        <input 
                            type="email" 
                            value={currentChecador.correo} 
                            onChange={(e) => setCurrentChecador({...currentChecador, correo: e.target.value})} 
                        />
                        <input 
                            type="text" 
                            value={currentChecador.evento} 
                            onChange={(e) => setCurrentChecador({...currentChecador, evento: e.target.value})} 
                        />
                        <select 
                            value={currentChecador.estatus} 
                            onChange={(e) => setCurrentChecador({...currentChecador, estatus: e.target.value})}
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                            <option value="Pendiente">Pendiente</option>
                        </select>
                        <button onClick={handleEditSave}>Guardar</button>
                        <button onClick={() => setIsEditModalOpen(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            {/* 📌 Modal de confirmación de eliminación */}
            {isDeleteModalOpen && currentChecador && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>¿Eliminar Checador?</h2>
                        <p>¿Estás seguro de que deseas eliminar a {currentChecador.nombre}?</p>
                        <button onClick={handleDelete}>Sí, eliminar</button>
                        <button onClick={() => setIsDeleteModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TableChecadores;
