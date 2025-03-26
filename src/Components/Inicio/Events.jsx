import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/stylesLogin/eventos.module.css';
import { Link, useLocation } from 'react-router-dom';
import Header from '../Components/Header';

function Events() {
    const [events, setEvents] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/event/all-events');
                console.log("Eventos recibidos en el frontend:", response.data.data); // 🛠 Debug

                setEvents(response.data.data);
            } catch (error) {
                console.error('Error al obtener los eventos:', error);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div>
            <Header />
            <h2 className={styles.tittle}>Eventos</h2>
            <div className={styles.search}>
                <input className={styles.searchInput} type="text" placeholder="Buscar eventos" />
            </div>
            
            <div className={styles.eventsGrid}>
                {events.map(event => (
                    <Link 
                        className={styles.eventCard} 
                        style={{ 
                            backgroundImage: `url(http://localhost:3000/api/event/image?filename=${event.mainImg})`,
                        }}
                        key={event._id} 
                        to={'/Event'} 
                        state={'/Events'}
                    >
                        <div className={styles.eventInfo}>
                            <div className="event-name">{event.name}</div>
                            <div className="event-description">{event.description}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Events;
