import 'react';
import Header from '../Components/HeaderAdmin'
import styles from '../../assets/styles/stylesAdmin/WorkshopList.module.css'
import arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { url } from '../../utils/base.url';
import { Toaster, toast } from 'sonner'
import classNames from 'classnames';

function EventWorkshop() {
    const today = new Date().toLocaleDateString();
    const location = useLocation();
    const [event, setEvent] = useState(null);
    const [workshops, setWorkshops] = useState([]);
    const eventId = localStorage.getItem('idEvent');
    const adminId = localStorage.getItem('adminId');
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const imgRef = useRef(null);

    const [openEditModal, setOpenEditModal] = useState(false);
    const [previewEditImage, setPreviewEditImage] = useState(null);
    const editMainImgRef = useRef(null);
    const editBannerImgsRef = useRef(null);

    const verCalendario = (e) => {
        e.target.showPicker();
    };

    const token = localStorage.getItem("token");

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
        if (!token) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${url}/event/${eventId}`);
                setEvent(response.data.data);
            } catch (error) {
                console.error('Error al obtener los detalles del evento:', error);
            }
        };
        fetchEventDetails();
    }, [eventId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supervisorsResponse = await axios.get(`${url}/supervisor/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const eventSupervisors = supervisorsResponse.data.data.filter(
                    supervisor => supervisor.events.includes(eventId)
                );

                const participantsResponse = await axios.get(`${url}/event/participants/${eventId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const workshopsResponse = await axios.get(`${url}/workshop/all-workshops`);
                const eventWorkshops = workshopsResponse.data.data.filter(
                    workshop => workshop.event === eventId
                );
                setWorkshops(eventWorkshops);

                setCounts({
                    checadores: eventSupervisors.length,
                    participantes: participantsResponse.data.data.length,
                    talleres: eventWorkshops.length
                });

            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };
        fetchData();
    }, [eventId, token]);

    useEffect(() => {
        const fetchWorkshopStats = async () => {
            try {
                const workshopsResponse = await axios.get(`${url}/workshop/all-workshops`);
                const eventWorkshops = workshopsResponse.data.data.filter(
                    workshop => workshop.event === eventId
                );

                const workshopsWithParticipants = eventWorkshops.map(workshop => {
                    return {
                        ...workshop,
                        participantCount: workshop.participants ? workshop.participants.length : 0
                    };
                });

                const sortedWorkshops = workshopsWithParticipants.sort(
                    (a, b) => b.participantCount - a.participantCount
                );

                const totalParticipants = workshopsWithParticipants.reduce(
                    (sum, workshop) => sum + workshop.participantCount,
                    0
                );
                const averageParticipants = workshopsWithParticipants.length > 0
                    ? Math.round(totalParticipants / workshopsWithParticipants.length)
                    : 0;

                setWorkshopStats({
                    participantesPorTaller: averageParticipants,
                    talleresPopulares: sortedWorkshops
                });

            } catch (error) {
                console.error('Error al obtener estadísticas de talleres:', error);
            }
        };
        fetchWorkshopStats();
    }, [eventId]);

    const deleteWorkshop = async (workshopId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este taller?')) {
            try {
                await axios.delete(`${url}/workshop/delete/${workshopId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                toast.success('Taller eliminado correctamente');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error('Error al eliminar el taller:', error);
                toast.error('Error al eliminar el taller');
            }
        }
    };

    if (!event) return <p>Cargando evento...</p>;

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const handleEditFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewEditImage(imageUrl);
        }
    };

    function formatDate(dateString) {
        if (!dateString) return null;
        const [datePart, timePart] = dateString.split("T");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes] = timePart.split(":");
        return `${day}/${month}/${year} ${hours}:${minutes}:00`;
    }

    const crearTaller = async (e) => {
        e.preventDefault();
        const workshopStartDate = e.target.startDate.value;
        const workshopEndDate = e.target.endDate.value;

        const workshopStart = new Date(workshopStartDate);
        const workshopEnd = new Date(workshopEndDate);

        const formatDate = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${day}-${month}-${year}T${hours}:${minutes}:${seconds}`;
        };

        const startDate = formatDate(workshopStart);
        const endDate = formatDate(workshopEnd);
        const es = event.startDate;
        const ee = event.endDate;

        if (startDate >= es && endDate <= ee) {
            const formData = new FormData();
            formData.append('name', e.target.name.value);
            formData.append('description', e.target.description.value);
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('limitQuota', e.target.limitQuota.value);
            formData.append('instructor', e.target.instructor.value);

            const imgFile = imgRef.current.files[0];
            if (imgFile) {
                formData.append('img', imgFile);
            }

            try {
                const response = await axios.post(
                    `${url}/workshop/create`,
                    formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
                );

                const { createdWorkshop } = response.data;
                const workshopId = createdWorkshop._id;

                await axios.put(
                    `${url}/event/workshop/?eventId=${eventId}&workshopId=${workshopId}`,
                    { startDate, endDate, },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setOpenModal(false);
                window.location.reload();
                toast.success('Taller creado correctamente');
            } catch (error) {
                console.error('Error al crear el taller:', error);
                toast.error('Error al crear el taller');
            }
        } else {
            toast.error('El taller está fuera del rango del evento');
        }
    };

    const actualizarEvento = async (e) => {
        e.preventDefault();
        const eventId = localStorage.getItem('idEvent');
        const formData = new FormData();

        if (e.target.name.value) formData.append('name', e.target.name.value);
        if (e.target.description.value) formData.append('description', e.target.description.value);
        if (e.target.location.value) formData.append('location', e.target.location.value);

        if (e.target.startDate.value) {
            const startDate = formatDate(e.target.startDate.value);
            formData.append('startDate', startDate);
        }

        if (e.target.endDate.value) {
            const endDate = formatDate(e.target.endDate.value);
            formData.append('endDate', endDate);
        }

        const mainImgFile = editMainImgRef.current.files[0];
        if (mainImgFile) {
            const modifiedFile = new File(
                [mainImgFile],
                mainImgFile.name.replace(/\s+/g, "_"),
                { type: mainImgFile.type }
            );
            formData.append('mainImg', modifiedFile);
        }

        const bannerImgsFiles = editBannerImgsRef.current.files;
        if (bannerImgsFiles.length > 0) {
            for (let i = 0; i < bannerImgsFiles.length; i++) {
                formData.append('bannerImgs', bannerImgsFiles[i]);
            }
        }

        try {
            await axios.put(
                `${url}/event/update/${eventId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setOpenEditModal(false);
            toast.success('Evento actualizado correctamente');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Error al actualizar el evento:', error);
            toast.error('Error al actualizar el evento');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Toaster position="top-center" />
            <Header />

            {/* HERO SECTION */}
            <section className={styles.heroSection}>
                <div className={styles.heroImageBg}>
                    <img src={`${url}/event/image?filename=${event.mainImg}`} alt={event.name} />
                    <div className={styles.heroOverlay}></div>
                </div>

                <div className={styles.heroContentWrapper}>
                    <div className={styles.heroText}>
                        <div className={styles.eventBadge}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span>Evento Activo</span>
                        </div>

                        <h1 className={styles.heroTitle}>{event.name}</h1>
                        <p className={styles.heroDescription}>{event.description}</p>

                        <div className={styles.heroMeta}>
                            <div className={styles.metaChip}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                <span>{event.startDate}</span>
                            </div>
                            <div className={styles.metaChip}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span>{event.location || "Sin especificar"}</span>
                            </div>
                        </div>

                        <div className={styles.heroActions}>
                            <button
                                className={styles.ctaButton}
                                onClick={() => setOpenEditModal(true)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Editar Evento
                            </button>

                            <button
                                className={styles.secondaryButton}
                                onClick={() => setOpenModal(true)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                Agregar Taller
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.scrollIndicator}>
                    <div className={styles.scrollMouse}></div>
                    <span>Scroll para explorar</span>
                </div>
            </section>

            {/* STATS BAR */}
            <section className={styles.statsBar}>
                <div className={styles.statItem}>
                    <div className={styles.statIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{counts.checadores}</span>
                        <span className={styles.statLabel}>Checadores</span>
                    </div>
                </div>

                <div className={styles.statDivider}></div>

                <div className={styles.statItem}>
                    <div className={styles.statIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{counts.participantes}</span>
                        <span className={styles.statLabel}>Participantes</span>
                    </div>
                </div>

                <div className={styles.statDivider}></div>

                <div className={styles.statItem}>
                    <div className={styles.statIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{counts.talleres}</span>
                        <span className={styles.statLabel}>Talleres</span>
                    </div>
                </div>

                <div className={styles.statDivider}></div>

                {/*
                <div className={styles.statItem}>
                    <div className={styles.statIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{workshopStats.participantesPorTaller}</span>
                        <span className={styles.statLabel}>Promedio/Taller</span>
                    </div>
                </div>
                */}
            </section>

            {/* ABOUT SECTION */}
            <section className={styles.aboutSection}>
                <div className={styles.aboutContent}>
                    <div className={styles.aboutText}>
                        <span className={styles.sectionLabel}>Sobre el Evento</span>
                        <h2>{event.name}</h2>
                        <p>{event.description}</p>
                        <div className={styles.featureList}>
                            <div className={styles.featureItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Certificado de participación</span>
                            </div>
                            <div className={styles.featureItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Networking con profesionales</span>
                            </div>
                            <div className={styles.featureItem}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Material didáctico incluido</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.aboutImage}>
                        <div className={styles.imageGrid}>
                            {event.bannerImgs && event.bannerImgs.slice(0, 4).map((img, index) => (
                                <div key={index} className={styles.gridImage}>
                                    <img src={`${url}/event/image?filename=${img}`} alt={`Preview ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* WORKSHOPS SECTION (CARDS) */}
            <section className={styles.workshopsSection}>
                <div className={styles.sectionHeader}>
                    <h2>Talleres del Evento</h2>
                    <p>Gestiona los talleres disponibles</p>
                </div>

                {workshops.length > 0 ? (
                    <div className={styles.workshopsGrid}>
                        {workshops.map((workshop, index) => (
                            <div key={workshop._id} className={styles.workshopCard}>
                                <div className={styles.workshopImage}>
                                    {workshop.img ? (
                                        <img
                                            src={`${url}/workshop/image?filename=${workshop.img}`}
                                            alt={workshop.name}
                                        />
                                    ) : (
                                        <div className={styles.workshopPlaceholder}>
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                <polyline points="21 15 16 10 5 21"></polyline>
                                            </svg>
                                        </div>
                                    )}
                                    <div className={styles.workshopBadge}>
                                        Taller #{index + 1}
                                    </div>
                                </div>

                                <div className={styles.workshopContent}>
                                    <h3>{workshop.name}</h3>
                                    <p className={styles.workshopInstructor}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                        {workshop.instructor}
                                    </p>
                                    <p className={styles.workshopDescription}>{workshop.description}</p>

                                    <div className={styles.workshopMeta}>
                                        <div className={styles.metaItem}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                            <span>{workshop.startDate}</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="9" cy="7" r="4"></circle>
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                            </svg>
                                            <span>{workshop.limitQuota} cupos</span>
                                        </div>
                                    </div>

                                    <div className={styles.workshopActions}>
                                        <button
                                            className={styles.workshopBtn}
                                            onClick={() => toast.info('Función de editar taller pendiente')}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                            Editar
                                        </button>
                                        <button
                                            className={classNames(styles.workshopBtn, styles.deleteBtn)}
                                            onClick={() => deleteWorkshop(workshop._id)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noWorkshops}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <h3>No hay talleres disponibles</h3>
                        <p>Agrega un nuevo taller para comenzar</p>
                    </div>
                )}
            </section>

            {/* DASHBOARD SECTION (MOVED TO BOTTOM) */}
            <div className={styles.dashboardcontent}>
                <h2 className={styles.tittleDashboard}>Dashboard</h2>
                <div className={styles.dashboard}>
                    <div className={styles.dashboardItem}>
                        <div className={styles.dashboardModule}>
                            <h3 className={styles.h3}>Checadores</h3>
                            <h4 className={styles.datos}>{counts.checadores}</h4>
                        </div>
                        <div className={styles.dashboardModule}>
                            <h3 className={styles.h3}>Participantes</h3>
                            <h4 className={styles.datos}>{counts.participantes}</h4>
                        </div>
                        <div className={styles.dashboardModule}>
                            <h3 className={styles.h3}>Talleres</h3>
                            <h4 className={styles.datos}>{counts.talleres}</h4>
                        </div>
                        <div className={styles.dashboardModule}>
                            <h3 className={styles.h3}>Talleres más Populares</h3>
                            <div className={styles.datosList}>
                                {workshopStats.talleresPopulares.map((taller, index) => (
                                    <div key={taller._id} className={styles.tallerItem}>
                                        {`${index + 1}. ${taller.name} (${taller.participantCount} participantes)`}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.dashboardModule}>
                            <h3 className={styles.h3}>Promedio de Participantes por Taller</h3>
                            <h4 className={styles.datos}>{workshopStats.participantesPorTaller}</h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* CREATE WORKSHOP MODAL */}
            {openModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <img
                            onClick={() => setOpenModal(false)}
                            className={styles.arrowM}
                            src={arrow}
                            alt="Cerrar"
                        />
                        <h2 className={styles.formT}>Agregar Taller</h2>
                        <form className={styles.formTalleres} onSubmit={crearTaller}>
                            <div
                                className={styles.fileImg}
                                onClick={() => imgRef.current.click()}
                                style={{
                                    backgroundImage: previewImage ? `url(${previewImage})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <p style={{ color: previewImage ? 'transparent' : '#6b7280' }}>
                                    {previewImage ? '' : 'Click para subir imagen'}
                                </p>
                            </div>

                            <input
                                type="file"
                                name="img"
                                ref={imgRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />

                            <div className={styles.formDataMain}>
                                <label htmlFor="startDate">Fecha de inicio</label>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    required
                                    onFocus={verCalendario}
                                />

                                <label htmlFor="endDate">Fecha de fin</label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    required
                                    onFocus={verCalendario}
                                />

                                <label htmlFor="name">Nombre</label>
                                <input
                                    type="text"
                                    name='name'
                                    placeholder='Nombre del taller'
                                    required
                                />

                                <label htmlFor="description">Descripción</label>
                                <input
                                    type="text"
                                    name='description'
                                    placeholder='Descripción del taller'
                                    required
                                />

                                <label htmlFor="limitQuota">Cupo límite</label>
                                <input
                                    type="number"
                                    name='limitQuota'
                                    placeholder='Cupo límite'
                                    required
                                />

                                <label htmlFor="instructor">Nombre del instructor</label>
                                <input
                                    type="text"
                                    name='instructor'
                                    placeholder='Nombre del instructor'
                                    required
                                />
                            </div>

                            <div className={styles.btns}>
                                <button type="submit" className={styles.Mbtn}>Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT EVENT MODAL */}
            {openEditModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <img
                            onClick={() => setOpenEditModal(false)}
                            className={styles.arrowM}
                            src={arrow}
                            alt="Cerrar"
                        />
                        <h2 className={styles.formT}>Editar evento</h2>
                        <form onSubmit={actualizarEvento} className={styles.formTalleres}>
                            <div
                                className={styles.fileImg}
                                onClick={() => editMainImgRef.current.click()}
                                style={{
                                    backgroundImage: previewEditImage ?
                                        `url(${previewEditImage})` :
                                        `url(${url}/event/image?filename=${event.mainImg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <p style={{ color: 'transparent' }}>Imagen principal</p>
                            </div>

                            <input
                                type="file"
                                name="mainImg"
                                ref={editMainImgRef}
                                onChange={handleEditFileChange}
                                style={{ display: 'none' }}
                            />

                            <div className={styles.formDataMain}>
                                <label htmlFor="startDate">Fecha de inicio</label>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    onFocus={verCalendario}
                                />

                                <label htmlFor="endDate">Fecha de fin</label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    onFocus={verCalendario}
                                />

                                <label htmlFor="name">Nombre del evento</label>
                                <input
                                    type="text"
                                    name='name'
                                    placeholder='Nombre del evento'
                                    defaultValue={event.name}
                                />

                                <label htmlFor="description">Descripción del evento</label>
                                <input
                                    type="text"
                                    name='description'
                                    placeholder='Descripción del evento'
                                    defaultValue={event.description}
                                />

                                <label htmlFor="location">Ubicación</label>
                                <input
                                    type="text"
                                    name='location'
                                    placeholder='Ubicación del evento'
                                    defaultValue={event.location || "UTEZ Campus"}
                                />

                                <label htmlFor="bannerImgs">Imágenes para el banner</label>
                                <input
                                    type="file"
                                    name="bannerImgs"
                                    multiple
                                    ref={editBannerImgsRef}
                                    style={{ padding: '10px' }}
                                />
                                <small style={{ color: '#6b7280' }}>Agrega al menos 3 imágenes</small>
                            </div>

                            <div className={styles.btns}>
                                <button type="submit" className={styles.Mbtn}>Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EventWorkshop;