import 'react';
import styles from'../../assets/styles/stylesLogin/eventos.module.css'
import img from '../../assets/img/assets_participante/wallpaperflare.com_wallpaper.jpg'
import {Link, useLocation} from 'react-router-dom'
import Header from '../Components/Header'

function Events() {
    const location = useLocation();
    console.log(location);

    const events = [
        {
            id: 1,
            name: 'Festival Gamer',
            image: img,
            description: 'Pa jugar clash',
            category: 'GAMER',
        },
        {
            id: 2,
            name: 'Natación',
            image: img,
            description: 'Evento de natación',
            category: 'NATACIÓN',
        },
        {
            id: 3,
            name: 'Videojuego',
            image: img,
            description: 'Torneo de videojuegos',
            category: 'VIDEOJUEGOS',
        },
        {
            id: 4,
            name: 'Festival Gamer 2',
            image: img,
            description: 'Más juegos de gamers',
            category: 'GAMER',
        },
        {
            id: 5,
            name: 'Natación Avanzada',
            image: img,
            description: 'Evento para nadadores avanzados',
            category: 'NATACIÓN',
        },
        {
            id: 6,
            name: 'Videojuego Avanzado',
            image: img,
            description: 'Competencia de videojuegos avanzados',
            category: 'VIDEOJUEGOS',
        },
        {
            id: 1,
            name: 'Festival Gamer',
            image: img,
            description: 'Pa jugar clash',
            category: 'GAMER',
        },
        {
            id: 2,
            name: 'Natación',
            image: img,
            description: 'Evento de natación',
            category: 'NATACIÓN',
        },
        {
            id: 3,
            name: 'Videojuego',
            image: img,
            description: 'Torneo de videojuegos',
            category: 'VIDEOJUEGOS',
        },
        {
            id: 4,
            name: 'Festival Gamer 2',
            image: img,
            description: 'Más juegos de gamers',
            category: 'GAMER',
        },
        {
            id: 5,
            name: 'Natación Avanzada',
            image: img,
            description: 'Evento para nadadores avanzados',
            category: 'NATACIÓN',
        },
        {
            id: 6,
            name: 'Videojuego Avanzado',
            image: img,
            description: 'Competencia de videojuegos avanzados',
            category: 'VIDEOJUEGOS',
        },
    ];

    return (
        <div>
            <Header/>
            <h2 className={styles.tittle}>Eventos</h2>
            <div className={styles.search}>
                <input className={styles.searchInput} type="text" placeholder="Buscar eventos" />
                <div className={styles.selection}>
                <select id={styles.dropdown}>
                    <option value="">Categoria...</option>
                    <option value="opcion1">Opción 1</option>
                    <option value="opcion2">Opción 2</option>
                    <option value="opcion3">Opción 3</option>
                </select>
            </div>
            </div>

           

            <div className={styles.eventsGrid}>
                {events.map(event => (
                    <Link className={styles.eventCard} style={{backgroundImage: `url(${event.image})`, backgroundSize: 'cover'}} key={event.id} to={'/Event'} state={'/Events'}>
                        <div className={styles.eventInfo}>
                            <div className="event-category">{event.category}</div>
                            <div className="event-name">{event.name}</div>
                            <div className="event-description">{event.description}</div>
                            <div className="event-price">{event.price}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Events;
