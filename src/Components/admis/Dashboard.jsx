import 'react';
import Header from '../Components/HeaderAdmin';
import EventImg from '../../assets/img/assets_participante/wallpaperflare.com_wallpaper.jpg';
import styles from '../../assets/styles/stylesAdmin/Dashboard.module.css';
import plus from '../../assets/img/Assets_admin/plus-regular-240.png';
import config from '../../assets/img/Assets_admin/cog-solid-240.png';
import arrowLeft from '../../assets/img/assets_participante/left-arrow-solid-240.png'
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import axios from 'axios';


function Dashboard() {
    const today = new Date().toLocaleDateString();
    const location = useLocation();
    console.log(location);


    const [event, setEvent] = useState(null);
    const eventId = localStorage.getItem('idEvent');
    console.log(eventId)

    useEffect(() => {
 
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/event/${eventId}`);
                setEvent(response.data.data);
                console.log(response.data.data)
            } catch (error) {
                console.error('Error al obtener los detalles del evento:', error);
            }
        };
        fetchEventDetails();
    },[eventId]);

    if (!event) return <p>Cargando evento...</p>;



    return (
        <div>
            <Header />
            <div className={styles.EventImg}>
                <div className={styles.gradient} style={{background: 'linear-gradient(to right,#F4F2EE,rgba(254, 180, 123, 0))'}}></div>
                <img className={styles.img} src={`http://localhost:3000/api/event/image?filename=${event.mainImg}`} alt="" />
                <div className={styles.eventPart}>
                    <h2>{event.name} </h2>
                    <p>{event.description} </p>
                    <p>{event.startDate} </p>
                    <h3>Activo</h3>
                </div>
            </div>

            <div className={styles.table}>
                <button className={styles.addTaller}>Agregar taller <img className={styles.plusadd} src={plus} alt="" /></button>
                <img className={styles.configView} src={config} alt="" />
                <Link to={location.state}><img className={styles.arrowLeft} src={arrowLeft}  alt="" /></Link>
                <h2 className={styles.tittleDashboard}>Dashboard</h2>
                <div className={styles.dashboard}>
                    <div className={styles.dashboardItem}>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleChecador)}>
                            <h3 className={styles.h3}>Checadores</h3>
                            <h4 className={styles.datos}>0</h4>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleAsistentes)}>
                            <h3 className={styles.h3}>Asistentes</h3>
                            <h4 className={styles.datos}>0</h4>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleTalleres)}>
                            <h3 className={styles.h3}>Talleres</h3>
                            <h4 className={styles.datos}>2</h4>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleList)}>
                            <h3 className={styles.h3}>Lista</h3>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleEstado)}>
                            <h3 className={styles.h3}>Estado</h3>
                            <h4 className={styles.datos}>Activo</h4>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleActividad)}>
                            <h3 className={styles.h3}>Actividad</h3>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
