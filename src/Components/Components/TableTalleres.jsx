import 'react';
import '../../assets/styles//Components/TablaTalleres.css'


function TableTalleres() {
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
                            <th>Informacion</th>
                            <th className="acciones"></th>
                            </tr>
                        </thead>
                        <tbody id="tabla-body">
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
    );
}

export default TableTalleres;