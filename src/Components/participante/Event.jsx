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
       const formData = new FormData();
       formData.append('name', e.target.name.value);
       formData.append('email', e.target.email.value);
       formData.append('password', e.target.email.value);
       formData.append('lastname', e.target.lastname.value);
       formData.append('birthday', formattedBirthday); // Usar la fecha convertida
       formData.append('livingState', e.target.livingState.value);
       formData.append('gender', e.target.gender.value);
       formData.append('eventAwarness', e.target.eventAwarness.value);
       formData.append('workplace', e.target.workplace.value);
       formData.append('profession', e.target.profession.value);
    
        try {
            const response = await axios.post(`${url}/event/inscription/${eventId}`, formData,  {
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
                    <p style={{cursor: 'pointer', textDecoration: 'underline'}}>Ver talleres</p>
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
                    <div className={styles.modalContent}>
                        <h2 className={styles.formT}>Registro al Evento</h2>
                        <form onSubmit={registrarParticipante}>
                            <label htmlFor="name" style={{color:'#252525'}}>Nombres</label><br />
                            <input type="text" name='name' placeholder="Nombres" required id="name" />
                            
                            <label htmlFor="lastname" style={{color:'#252525'}}>Apellidos</label><br />
                            <input type="text" name='lastname' placeholder="Apellidos" required id="lastname" />
                            
                            <label htmlFor="gender" style={{color:'#252525'}}>Género</label><br />
                            <select name="gender" id="gender" className={styles.options} required>
                                <option value="Hombre">Hombre</option>
                                <option value="Mujer">Mujer</option>
                            </select><br />
                            
                            <label htmlFor="birthday" style={{color:'#252525'}}>Fecha de nacimiento</label><br />
                            <input type="date" name='birthday' placeholder="Fecha de nacimiento" required id="birthday" /><br />
                            
                            <label htmlFor="email" style={{color:'#252525'}} >Correo electrónico</label><br />
                            <input type="email" name='email' placeholder="Email" required id="email" /> <br />
                            
                            <label htmlFor="livingState" style={{color:'#252525'}}>Estado de residencia</label><br />
                            <input type="text" name='livingState' placeholder="Estado de residencia" required id="livingState" /><br />
                            
                            <label htmlFor="profession"style={{color:'#252525'}}>Profesión</label><br />
                            <input type="text" name='profession' placeholder="Profesion" id="profession" /><br />
                            
                            <label htmlFor="workplace" style={{color:'#252525'}}>Lugar de trabajo</label><br />
                            <input type="text" name='workplace' placeholder="Lugar de trabajo (Opcional)" id="workplace" /><br />
                            
                            <label htmlFor="eventAwarness" style={{color:'#252525'}}>¿Cómo te enteraste de nosotros?</label><br />
                            <input type="text" name='eventAwarness' placeholder="Como te enteraste de nosotros" required id="eventAwarness" /><br />
                            
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
