import { useState, useEffect } from 'react';
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
                const response = await axios.get(`http://localhost:3000/api/event/${eventId}`);
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
        e.preventDefault();  // ← Cambié `event` por `e`
       // Convertir la fecha de nacimiento al formato DD-MM-YYYY
       const birthday = new Date(e.target.birthday.value); // Obtén la fecha del input
       const formattedBirthday = `${birthday.getDate().toString().padStart(2, '0')}-${(birthday.getMonth() + 1).toString().padStart(2, '0')}-${birthday.getFullYear()}`;
   
       // Crear el objeto con los datos del formulario
       const formData = new FormData();
       formData.append('name', e.target.name.value);
       formData.append('email', e.target.email.value);
       formData.append('lastname', e.target.lastname.value);
       formData.append('birthday', formattedBirthday); // Usar la fecha convertida
       formData.append('livingState', e.target.livingState.value);
       formData.append('gender', e.target.gender.value);
       formData.append('eventAwarness', e.target.eventAwarness.value);
       formData.append('workplace', e.target.workplace.value);
       formData.append('profession', e.target.profession.value);
    
        try {
            const response = await axios.post(`http://localhost:3000/api/event/inscription/${eventId}`, formData,  {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setIsModalOpen(false);
            console.log('Respuesta del servidor', response.data);
            navigate('/ListEvent');
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <div>
            <Header />

            {/* Imagen del evento */}
            <div className={styles.EventImg}>
                <div className={styles.gradient} style={{ background: 'linear-gradient(to right,#F4F2EE,rgba(254, 180, 123, 0))' }}></div>
                <img className={styles.img} src={`http://localhost:3000/api/event/image?filename=${event.mainImg}`} alt="" />

                {/* Información del evento */}
                <div className={styles.eventPart}>
                    <h2>{event.name}</h2>
                    
                    {/* Botón para abrir el modal */}
                    <button onClick={() => setIsModalOpen(true)}>Registrarse</button>

                    <Link to={'/List'} state={'/Event'}>
                    <p style={{cursor: 'pointer', textDecoration: 'underline'}}>Ver talleres</p>
                    </Link>

                    <p>{event.description}</p>
                    <p>{event.startDate}</p>
                </div>

            
            </div>

            <div className={styles.carousel}>
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                loop={true}
                autoplay={{delay: 3000}}
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
                            src={`http://localhost:3000/api/event/image?filename=${img}`} 
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
                    <div className={styles.modalContent}>
                        <h2 className={styles.formT}>Registro al Evento</h2>
                        <form onSubmit={registrarParticipante}>
                            <input type="text" name='name' placeholder="Nombres" required />
                            <input type="text" name='lastname' placeholder="Apellidos" required />
                            <input type="text" name='gender' placeholder="Género" required />
                            <input type="date" name='birthday' placeholder="Fecha de nacimiento" required />
                            <input type="email" name='email' placeholder="Email" required />
                            <input type="text" name='livingState' placeholder="Estado de residencia" required />
                            <input type="text" name='profession' placeholder="Profesion"/>
                            <input type="text" name='workplace' placeholder="Lugar de trabajo (Opcional)" />
                            <input type="text" name='eventAwarness' placeholder="Como te enteraste de nosotros" required />
                            <button type='submit' className={styles.Mbtn}>Confirmar</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className={styles.Mbtn}>Cerrar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Eventpage;
