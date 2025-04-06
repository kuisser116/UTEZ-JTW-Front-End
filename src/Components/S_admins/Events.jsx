import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/stylesSA/eventos.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Components/HeaderAdminHC';
import NavBar from '../Components/SNavBar';
import { url } from '../../utils/base.url';


function Events() {
    const [events, setEvents] = useState([]);
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log('No puedes entrar')
            navigate("/login"); // Redirige al login si no hay token
        }
    }, []);

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

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <Header/>
            <NavBar/>
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
                            backgroundImage: `url(http://localhost:3000/api/event/image?filename=${event.mainImg})`,
                        }}
                        key={event._id} 
                        to={`/List`} 
                        state={'/EventSA'}
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
