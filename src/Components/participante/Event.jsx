import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import styles from '../../assets/styles/stylesUser/events.module.css';
import Header from '../Components/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../../utils/base.url';
import { Toaster, toast } from 'sonner';

function Eventpage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [event, setEvent] = useState(null);
    const [workshops, setWorkshops] = useState([]);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);
    const eventId = localStorage.getItem('idEvent');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${url}/event/${eventId}`);
                setEvent(response.data.data);
            } catch (error) {
                console.error('Error al obtener los detalles del evento:', error);
            }
        };

        const fetchWorkshops = async () => {
            try {
                const response = await axios.get(`${url}/workshop/all-workshops`);
                const workshopsDelEvento = response.data.data.filter(w => w.event === eventId);
                setWorkshops(workshopsDelEvento);
            } catch (error) {
                console.error('Error al obtener talleres:', error);
            }
        };

        fetchEventDetails();
        fetchWorkshops();
    }, [eventId]);

    if (!event) return <p>Cargando evento...</p>;

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);

            const userData = {
                name: decoded.given_name,
                lastname: decoded.family_name || "Sin apellido",
                email: decoded.email,
                profession: "Sin especificar",
                livingState: "Sin especificar",
                birthday: null,
                gender: "Sin especificar",
                eventAwarness: "Google",
                workplace: "Sin especificar"
            };

            const response = await axios.post(`${url}/event/inscription/google/${eventId}`, userData, {
                headers: { 'Content-Type': 'application/json' },
            });

            setIsModalOpen(false);
            navigate('/ListEvent');
            toast.success('Registro exitoso con Google');
        } catch (error) {
            console.error("Google Login Error:", error);
            toast.error('Error al registrarse con Google');
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Toaster position="top-center" />
            <Header />

            {/* HERO SECTION - Full Width Modern */}
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
                            <span>Evento Próximo</span>
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
                                <span>UTEZ Campus</span>
                            </div>
                        </div>

                        <div className={styles.heroActions}>
                            <button className={styles.ctaButton} onClick={() => setIsModalOpen(true)}>
                                Inscríbete Ahora
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </button>

                            <button
                                className={styles.secondaryButton}
                                onClick={() => document.getElementById('workshops-section')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Explorar Talleres
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
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
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>500+</span>
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
                        <span className={styles.statValue}>{workshops.length}</span>
                        <span className={styles.statLabel}>Talleres</span>
                    </div>
                </div>

                <div className={styles.statDivider}></div>

                <div className={styles.statItem}>
                    <div className={styles.statIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>100%</span>
                        <span className={styles.statLabel}>Gratuito</span>
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className={styles.aboutSection}>
                <div className={styles.aboutContent}>
                    <div className={styles.aboutText}>
                        <span className={styles.sectionLabel}>Sobre el Evento</span>
                        <h2>Una Experiencia Única de Aprendizaje</h2>
                        <p>
                            Sumérgete en un evento diseñado para impulsar tu crecimiento profesional y personal.
                            Conecta con expertos de la industria, participa en talleres prácticos y amplía tu red de contactos.
                        </p>
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
                            {event.bannerImgs.slice(0, 4).map((img, index) => (
                                <div key={index} className={styles.gridImage}>
                                    <img src={`${url}/event/image?filename=${img}`} alt={`Preview ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* WORKSHOPS SECTION */}
            <section id="workshops-section" className={styles.workshopsSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionLabel}>Talleres</span>
                    <h2>Actividades Disponibles</h2>
                    <p>Descubre las actividades que tenemos preparadas para ti</p>
                </div>

                {workshops.length > 0 ? (
                    <div className={styles.workshopsGrid}>
                        {workshops.map((workshop, index) => (
                            <div
                                key={workshop._id}
                                className={styles.workshopCard}
                                onClick={() => setSelectedWorkshop(workshop)}
                            >
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

                                    <button className={styles.workshopBtn}>
                                        Ver Detalles
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </button>
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
                        <p>Pronto se agregarán nuevas actividades</p>
                    </div>
                )}
            </section>

            {/* WORKSHOP DETAIL MODAL */}
            {selectedWorkshop && (
                <div className={styles.modalOverlay} onClick={() => setSelectedWorkshop(null)}>
                    <div className={styles.workshopModal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedWorkshop(null)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className={styles.workshopModalImage}>
                            {selectedWorkshop.img ? (
                                <img
                                    src={`${url}/workshop/image?filename=${selectedWorkshop.img}`}
                                    alt={selectedWorkshop.name}
                                />
                            ) : (
                                <div className={styles.modalPlaceholder}>
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                        <polyline points="21 15 16 10 5 21"></polyline>
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className={styles.workshopModalContent}>
                            <h2>{selectedWorkshop.name}</h2>
                            <p className={styles.modalInstructor}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                Instructor: {selectedWorkshop.instructor}
                            </p>

                            <div className={styles.modalDescription}>
                                <h3>Descripción</h3>
                                <p>{selectedWorkshop.description}</p>
                            </div>

                            <div className={styles.modalDetails}>
                                <div className={styles.detailItem}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    <div>
                                        <span className={styles.detailLabel}>Inicio</span>
                                        <span className={styles.detailValue}>{selectedWorkshop.startDate}</span>
                                    </div>
                                </div>

                                <div className={styles.detailItem}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    <div>
                                        <span className={styles.detailLabel}>Fin</span>
                                        <span className={styles.detailValue}>{selectedWorkshop.endDate}</span>
                                    </div>
                                </div>

                                <div className={styles.detailItem}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    <div>
                                        <span className={styles.detailLabel}>Cupo</span>
                                        <span className={styles.detailValue}>{selectedWorkshop.limitQuota} personas</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* REGISTRATION MODAL */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className={styles.modalIcon}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>

                        <h2 className={styles.formT}>Inscríbete al Evento</h2>
                        <p className={styles.modalSubtitle}>
                            Únete con tu cuenta de Google de forma rápida y segura
                        </p>

                        <div className={styles.googleBtnWrapper}>
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => {
                                    console.log('Login Failed');
                                    toast.error('Fallo el inicio de sesión con Google');
                                }}
                                size="large"
                                shape="pill"
                                width="280"
                            />
                        </div>

                        <button className={styles.Mbtn} onClick={() => setIsModalOpen(false)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Eventpage;
