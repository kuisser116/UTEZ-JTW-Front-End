import { useState } from 'react';
import '../../assets/styles/Components/TablaTalleres.css';

function TableTalleres() {
    // 📝 Array con 2 talleres
    const [talleres] = useState([
        { id: 1, nombre: "Taller de React", fecha: "10/04/2025", evento: "Tech Conference", cupo: 30, info: "Aprende los fundamentos de React." },
        { id: 2, nombre: "Taller de Node.js", fecha: "12/04/2025", evento: "Backend Summit", cupo: 25, info: "Desarrolla APIs con Node.js y Express." }
    ]);

    return (
        <div>
            <div className='tableContent'>
                <h2 className='tableTittle'>Talleres</h2>
                <div className="tabla-container">
                    <table className="tabla-talleres">
                        <thead>
                            <tr className="encabezado">
                                <th>Nombre del taller</th>
                                <th>Fecha</th>
                                <th>Nombre del evento</th>
                                <th>Cupo de taller</th>
                                <th>Información</th>
                            </tr>
                        </thead>
                        <tbody>
                            {talleres.map((taller) => (
                                <tr key={taller.id}>
                                    <td>{taller.nombre}</td>
                                    <td>{taller.fecha}</td>
                                    <td>{taller.evento}</td>
                                    <td>{taller.cupo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TableTalleres;
