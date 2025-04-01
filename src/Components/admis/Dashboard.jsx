import 'react';
import Header from '../Components/HeaderAdmin';
import EventImg from '../../assets/img/assets_participante/wallpaperflare.com_wallpaper.jpg';
import styles from '../../assets/styles/stylesAdmin/Dashboard.module.css';
import plus from '../../assets/img/Assets_admin/plus-regular-240.png';
import config from '../../assets/img/Assets_admin/cog-solid-240.png';
import arrowLeft from '../../assets/img/assets_participante/left-arrow-solid-240.png'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import axios from 'axios';


function Dashboard() {
    const today = new Date().toLocaleDateString();
    const location = useLocation();
    console.log(location);

    const navigate = useNavigate();

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log('No puedes entrar')
            navigate("/login"); // Redirige al login si no hay token
        }
    }, []);


    const [event, setEvent] = useState(null);
    const eventId = localStorage.getItem('idEvent');
    console.log(eventId)

    const [counts, setCounts] = useState({
        checadores: 0,
        participantes: 0,
        talleres: 0
    });

    const [workshopStats, setWorkshopStats] = useState({
        participantesPorTaller: 0,
        talleresPopulares: []
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch event details
                const eventResponse = await axios.get(`http://localhost:3000/api/event/${eventId}`);
                setEvent(eventResponse.data.data);

                // Fetch supervisors (checadores)
                const supervisorsResponse = await axios.get('http://localhost:3000/api/supervisor/');
                const eventSupervisors = supervisorsResponse.data.data.filter(
                    supervisor => supervisor.events.includes(eventId)
                );

                console.log('Checadores',eventSupervisors.length);

                // Fetch participants
                const participantsResponse = await axios.get(`http://localhost:3000/api/event/participants/${eventId}`);

                // Fetch workshops
                const workshopsResponse = await axios.get('http://localhost:3000/api/workshop/all-workshops');
                const eventWorkshops = workshopsResponse.data.data.filter(
                    workshop => workshop.event === eventId
                );

                console.log("Supervisores recibidos:", eventSupervisors);
                console.log("Participantes recibidos:", participantsResponse.data);
                console.log("Talleres recibidos:", eventWorkshops);


                setCounts({
                    checadores: eventSupervisors.length,
                    participantes: participantsResponse.data.data.length,
                    talleres: eventWorkshops.length
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [eventId]);

    useEffect(() => {
        const fetchWorkshopStats = async () => {
            try {
                // Fetch workshops
                const workshopsResponse = await axios.get('http://localhost:3000/api/workshop/all-workshops');
                const eventWorkshops = workshopsResponse.data.data.filter(
                    workshop => workshop.event === eventId
                );

                // Fetch participants for each workshop
                const workshopsWithParticipants = await Promise.all(
                    eventWorkshops.map(async (workshop) => {
                        try {
                            const participantsResponse = await axios.get(
                                `http://localhost:3000/api/workshop/participants/${workshop._id}`
                            );
                            return {
                                ...workshop,
                                participantCount: participantsResponse.data.data.length
                            };
                        } catch (error) {
                            console.error(`Error fetching participants for workshop ${workshop._id}:`, error);
                            return {
                                ...workshop,
                                participantCount: 0
                            };
                        }
                    })
                );

                // Calculate average participants per workshop
                const totalParticipants = workshopsWithParticipants.reduce(
                    (sum, workshop) => sum + workshop.participantCount, 
                    0
                );
                const averageParticipants = workshopsWithParticipants.length > 0 
                    ? Math.round(totalParticipants / workshopsWithParticipants.length) 
                    : 0;

                // Get most popular workshop
                const popularWorkshop = [...workshopsWithParticipants]
                    .sort((a, b) => b.participantCount - a.participantCount)[0];

                setWorkshopStats({
                    participantesPorTaller: averageParticipants,
                    talleresPopulares: popularWorkshop
                });

            } catch (error) {
                console.error('Error fetching workshop stats:', error);
            }
        };

        fetchWorkshopStats();
    }, [eventId]);

    if (!event) return <p>Cargando evento...</p>;



    return (
        <div>
            <Header />
      

            <div className={styles.table}>
              
                <h2 className={styles.tittleDashboard}>Dashboard</h2>
                <div className={styles.dashboard}>
                    <div className={styles.dashboardItem}>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleChecador)}>
                            <h3 className={styles.h3}>Checadores</h3>
                            <h4 className={styles.datos}>{counts.checadores}</h4>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleAsistentes)}>
                            <h3 className={styles.h3}>Participantes</h3>
                            <h4 className={styles.datos}>{counts.participantes}</h4>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleTalleres)}>
                            <h3 className={styles.h3}>Talleres</h3>
                            <h4 className={styles.datos}>{counts.talleres}</h4>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleList)}>
                            <h3 className={styles.h3}>Taller más Popular</h3>
                            <h4 className={styles.datosList}>
                                {workshopStats.talleresPopulares ? 
                                    `- ${workshopStats.talleresPopulares.name} ` : 
                                    '-'}
                            </h4>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleEstado)}>
                            <h3 className={styles.h3}>% Asistencia</h3>
                            <h4 className={styles.datos}>0%</h4>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleActividad)}>
                            <h3 className={styles.h3}>Promedio de Participantes por Taller</h3>
                            <h4 className={styles.datos}>{workshopStats.participantesPorTaller}</h4>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
