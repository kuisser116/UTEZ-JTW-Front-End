import 'react';
import EventImg from '../../assets/img/assets_participante/wallpaperflare.com_wallpaper.jpg'
import styles from '../../assets/styles/stylesUser/listEvent.module.css'
import Header from '../Components/Header'
import TableTalleres from '../Components/TableTalleres';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { url } from '../../utils/base.url';



function ListEvent() {
    const today = new Date().toLocaleDateString();

    const [event, setEvent] = useState(null);
    const eventId = localStorage.getItem('idEvent');
    console.log(eventId)

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    useEffect(() => {
        if (!token) {
            console.log('No puedes entrar')
            navigate("/login"); // Redirige al login si no hay token
        }
    }, []);

    useEffect(() => {
 
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/event/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEvent(response.data.data);
                console.log(response.data.data)
            } catch (error) {
                console.error('Error al obtener los detalles del evento:', error);
            }
        };
        fetchEventDetails();
    },[]);

    if (!event) return <p>Cargando evento...</p>;


  

    return (
        <div>
            <Header/>
            <div className={styles.EventImg}>
                <div className={styles.gradient} style={{background: 'linear-gradient(to right,#F4F2EE,rgba(254, 180, 123, 0))'}}></div>
                <img className={styles.img} src={`http://localhost:3000/api/event/image?filename=${event.mainImg}`} alt="" />
                <div className={styles.eventPart}>
                    <h2>{event.name} </h2>
                    <button className={styles.btnRdo}>Registrado</button>
                    <p>{event.description} </p>
                    <p className=''>{event.startDate} </p>
                </div>
            </div>

            <div className={styles.table}>
                <TableTalleres/>
            </div>

            

        </div>
    );
}

export default ListEvent;