import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/stylesLogin/eventos.module.css';
import { Link, useLocation } from 'react-router-dom';
import Header from '../Components/Header';
import { url } from '../../utils/base.url';


function Events() {
    const [events, setEvents] = useState([]);
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${url}/event/all-events`);
                console.log("Eventos recibidos en el frontend:", response.data.data); // 🛠 Debug

                setEvents(response.data.data);
            } catch (error) {
                console.error('Error al obtener los eventos:', error);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <Header/>
            <h2 className={styles.tittle}>Eventos</h2>
            <div className={styles.search}>
                <input className={styles.searchInput} type="text" placeholder="Buscar eventos" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
            
            <div className={styles.eventsGrid}>
                {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                    <Link 
                        className={styles.eventCard} 
                        style={{ 
                            backgroundImage: `url(${url}/event/image?filename=${event.mainImg})`,
                        }}
                        key={event._id} 
                        to={`/Event`} 
                        state={'/Events'}
                        onClick={() => localStorage.setItem('idEvent', event._id)}
                    >
                        <div className={styles.eventInfo}>
                            <div className={styles.info}>
                                <p className={styles.p}>{event.name}</p>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <p className={styles.noEvents}>No hay eventos disponibles</p>
            )}
            </div>
        </div>
    );
}

export default Events;
