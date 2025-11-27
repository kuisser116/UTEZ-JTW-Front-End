import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import EventImg from '../../assets/img/assets_participante/wallpaperflare.com_wallpaper.jpg';
import styles from '../../assets/styles/stylesUser/events.module.css';
import Header from '../Components/Header';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { url } from '../../utils/base.url';
import { Toaster, toast } from 'sonner'
import arrowD from '../../assets/img/Assets_admin/down-arrow-solid-240 (2).png'

function Eventpage() {
    const today = new Date().toLocaleDateString();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [event, setEvent] = useState(null);
    const eventId = localStorage.getItem('idEvent');
    const navigate = useNavigate();
    console.log(eventId)

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
    }, []);

    if (!event) return <p>Cargando evento...</p>;

    // Configuración del carrusel
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const registrarParticipante = async (e) => {
        e.preventDefault();

        // Validación de la fecha de nacimiento
        const birthdayInput = e.target.birthday.value;
        const birthdayDate = new Date(birthdayInput);
        const today = new Date();

        // Verificar si la fecha es válida y anterior a hoy
        if (birthdayDate >= today) {
            toast.error('La fecha de nacimiento debe ser anterior al día de hoy');
            return;
        }

        // Verificar que la fecha no sea muy antigua (por ejemplo, más de 120 años)
        const maxAge = new Date();
        maxAge.setFullYear(today.getFullYear() - 120);
        if (birthdayDate < maxAge) {
            toast.error('La fecha de nacimiento no es válida');
            return;
        }

        // Convertir la fecha de nacimiento al formato DD-MM-YYYY
        const formattedBirthday = `${birthdayDate.getDate().toString().padStart(2, '0')}-${(birthdayDate.getMonth() + 1).toString().padStart(2, '0')}-${birthdayDate.getFullYear()}`;

        // Crear el objeto con los datos del formulario
        const userData = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.email.value,
            lastname: e.target.lastname.value,
            birthday: formattedBirthday,
            livingState: e.target.livingState.value,
            gender: e.target.gender.value,
            eventAwarness: e.target.eventAwarness.value,
            workplace: e.target.workplace.value,
            profession: e.target.profession.value
        };

        try {
            const response = await axios.post(`${url}/event/inscription/${eventId}`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setIsModalOpen(false);
            console.log('Respuesta del servidor', response.data);
            navigate('/ListEvent');
        } catch (error) {
            console.log(error);
            toast.error('Correo ya registrado');
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log("Google User:", decoded);

            const userData = {
                name: decoded.given_name,
                lastname: decoded.family_name || "Sin apellido",
                email: decoded.email,
                // Mandamos vacíos o null los que no tenemos
                profession: "Sin especificar",
                livingState: "Sin especificar",
                birthday: null,
                gender: "Sin especificar",
                eventAwarness: "Google",
                workplace: "Sin especificar"
            };

            // Send to backend (Ruta especifica para Google)
            const response = await axios.post(`${url}/event/inscription/google/${eventId}`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setIsModalOpen(false);
            console.log('Respuesta del servidor', response.data);
            navigate('/ListEvent');
            toast.success('Registro exitoso con Google');

        } catch (error) {
            console.error("Google Login Error:", error);
            toast.error('Error al registrarse con Google');
        }
    };


    return (
        <div>
            <Toaster position="top-center" />
            <Header />

            {/* Imagen del evento */}
            <div className={styles.EventImg}>
                <div className={styles.gradient} style={{ background: 'linear-gradient(to right,#F4F2EE,rgba(254, 180, 123, 0))' }}></div>
                <img className={styles.img} src={`${url}/event/image?filename=${event.mainImg}`} alt="" />

                {/* Información del evento */}
                <div className={styles.eventPart}>
                    <h2>{event.name}</h2>

                    {/* Botón para abrir el modal */}
                    <button onClick={() => setIsModalOpen(true)}>Registrarse</button>

                    <Link to={'/List'} state={'/Event'}>
                        <p style={{ cursor: 'pointer', textDecoration: 'underline' }}>Ver talleres</p>
                    </Link>

                    <p>{event.description}</p>
                    <p>{event.startDate}</p>
                </div>
                <img className={styles.arrowD} src={arrowD} alt="" />


            </div>

            <div className={styles.carousel}>
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    loop={true}
                    autoplay={{ delay: 3000 }}
                    speed={1500}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 0,
                        modifier: 2,
                        slideShadows: false,
                    }}
                    pagination={{ clickable: true }}
                    modules={[EffectCoverflow, Pagination, Autoplay]}
                    className={styles.swiperContainer}
                >
                    {event.bannerImgs.map((img, index) => (
                        <SwiperSlide key={index} className={styles.swiperSlide}>
                            <img
                                src={`${url}/event/image?filename=${img}`}
                                alt={`Imagen ${index + 1}`}
                                className={styles.bannerImage}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div>
                <footer>

                </footer>
            </div>

            {/* Modal de registro */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '400px', padding: '40px 20px', borderRadius: '15px', textAlign: 'center' }}>
                        <h2 className={styles.formT} style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>Inscríbete al Evento</h2>

                        <p style={{ marginBottom: '30px', color: '#666', fontSize: '16px' }}>
                            Para registrarte, inicia sesión de forma segura con tu cuenta de Google.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                            <GoogleLogin
                                onSuccess={handleGoogleLogin}
                                onError={() => {
                                    console.log('Login Failed');
                                    toast.error('Fallo el inicio de sesión con Google');
                                }}
                                size="large"
                                shape="pill"
                                width="250"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className={styles.Mbtn}
                            style={{
                                backgroundColor: '#f44336',
                                marginTop: '10px',
                                width: '100%',
                                maxWidth: '250px'
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Eventpage;
