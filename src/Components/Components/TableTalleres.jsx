import { useState, useEffect } from 'react';
import '../../assets/styles/Components/TablaTalleres.css';
import axios from 'axios';

function TableTalleres() {
    const [talleres, setTalleres] = useState([]);
    
    useEffect(() => {
        const fetchTalleres = async () => {
            try {
                const eventId = localStorage.getItem('idEvent');
                if (!eventId) {
                    console.error('No event ID found in localStorage');
                    return;
                }

                // Fetch all workshops
                const response = await axios.get('http://localhost:3000/api/workshop/all-workshops');

                // Filter workshops by current event
                const talleresDelEvento = response.data.data.filter(
                    taller => taller.event === eventId
                );
                
                setTalleres(talleresDelEvento);
            } catch (error) {
                console.error('Error fetching workshops:', error);
            }
        };

        fetchTalleres();
    }, []);

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div>
            <div className='tableContent'>
                <h2 className='tableTittle'>Talleres</h2>
                <div className="tabla-container">
                    <table className="tabla-talleres">
                        <thead>
                            <tr className="encabezado">
                                <th>Nombre del taller</th>
                                <th>Instructor</th>
                                <th>Fecha inicio</th>
                                <th>Fecha fin</th>
                                <th>Cupo límite</th>
                                <th>Información</th>
                            </tr>
                        </thead>
                        <tbody>
                            {talleres.map((taller) => (
                                <tr key={taller._id}>
                                    <td>{taller.name}</td>
                                    <td>{taller.instructor}</td>
                                    <td>{formatDate(taller.startDate)}</td>
                                    <td>{formatDate(taller.endDate)}</td>
                                    <td>{taller.limitQuota}</td>
                                    <td>{taller.description}</td>
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
