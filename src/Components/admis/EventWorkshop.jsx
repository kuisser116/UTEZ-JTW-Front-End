import 'react';
import Header from '../Components/HeaderAdmin'
import TableTalleres from '../Components/TableTalleres';
import EventImg from '../../assets/img/assets_participante/wallpaperflare.com_wallpaper.jpg'
import styles from '../../assets/styles/stylesAdmin/WorkshopList.module.css'
import plus from '../../assets/img/Assets_admin/plus-regular-240.png'
import grafic from '../../assets/img/Assets_admin/grafico-de-barras.png'
import config from '../../assets/img/Assets_admin/cog-solid-240.png'
import { Link, useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';

function EventWorkshop() {
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
            <Header/>
            <div className={styles.EventImg}>
                <div className={styles.gradient} style={{background: 'linear-gradient(to right,#F4F2EE,rgba(197, 106, 37, 0))'}}></div>
                <img className={styles.img} src={`http://localhost:3000/api/event/image?filename=${event.mainImg}`} alt="" />
                <div className={styles.eventPart}>
                    <h2>{event.name} </h2>
                    <p>{event.description} </p>
                    <p className=''>{event.startDate} </p>
                    <h3>Activo</h3>
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



            <div className={styles.table}>
                <button className={styles.addTaller}>Agregar taller <img className={styles.plusadd} src={plus} alt="" /></button>
                <Link to='/Dashboard' state={'/EventWorkshop'}><img className={styles.graficView} src={grafic} alt="" /></Link>
                <img className={styles.configView} src={config} alt="" />
                <TableTalleres/>
            </div>
            
        </div>
    );
}

export default EventWorkshop;