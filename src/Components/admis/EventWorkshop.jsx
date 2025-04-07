import 'react';
import Header from '../Components/HeaderAdmin'
import TableTalleres from '../Components/TableTalleres';
import styles from '../../assets/styles/stylesAdmin/WorkshopList.module.css'
import plus from '../../assets/img/Assets_admin/plus-regular-240.png'
import grafic from '../../assets/img/Assets_admin/grafico-de-barras.png'
import config from '../../assets/img/Assets_admin/cog-solid-240.png'
import arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png'
import { Link, useLocation, useNavigate} from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import arrowD from '../../assets/img/Assets_admin/down-arrow-solid-240 (2).png'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { url } from '../../utils/base.url';
import { Toaster, toast } from 'sonner'


function EventWorkshop() {
    const today = new Date().toLocaleDateString();
    const location = useLocation();
    console.log(location);
    const [event, setEvent] = useState(null);
    const eventId = localStorage.getItem('idEvent');
    const adminId = localStorage.getItem('adminId');
    console.log(eventId)
    console.log(adminId)
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


    useEffect(() => {
        if (!token) {
            console.log('No puedes entrar')
            navigate("/login"); // Redirige al login si no hay token
        }
    }, []);

    useEffect(() => {
 
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`${url}/event/${eventId}`);
                setEvent(response.data.data);
                console.log(response.data.data)
            } catch (error) {
                console.error('Error al obtener los detalles del evento:', error);
            }
        };
        fetchEventDetails();
    },[eventId]);

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


    // Asegúrate de que las fechas sean objetos Date
    const workshopStart = new Date(workshopStartDate);
    const workshopEnd = new Date(workshopEndDate);

        // Función para formatear las fechas al formato DD/MM/YYYY hh:mm:ss
        const formatDate = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${day}-${month}-${year}T${hours}:${minutes}:${seconds}`;
        };
    
        // Formatear las fechas de inicio y fin del taller
        const startDate = formatDate(workshopStart);
        const endDate = formatDate(workshopEnd);

        const es = event.startDate;
        const ee = event.endDate;

        console.log(es)
        console.log(ee)
    
        // Para depuración
        console.log(startDate);
        console.log(endDate);

        if (startDate >= es && endDate <= ee) {
            
            console.log('El taller está dentro del rango del evento');



            const formData = new FormData();
        formData.append('name', e.target.name.value);
        formData.append('description', e.target.description.value);
    
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('limitQuota', e.target.limitQuota.value);
        formData.append('instructor', e.target.instructor.value);
        formData.append('event', eventId);
    
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
    
            console.log('Taller creado:', response.data);
            setOpenModal(false);
            window.location.reload();
            toast.success('Taller creado correctamente');
        } catch (error) {
            console.error('Error al crear el taller:', error);
            toast.error('Error al crear el taller');
        }


        } else {
            console.log('El taller está fuera del rango del evento');
            toast.error('El taller está fuera del rango del evento');
        }
    
        // Si las validaciones pasan, continuar con la creación del taller
        
    };
    
    
    
    
    const actualizarEvento = async (e) => {
        e.preventDefault();
        const eventId = localStorage.getItem('idEvent');
    
        const formData = new FormData();
        
        if (e.target.name.value) formData.append('name', e.target.name.value);
        if (e.target.description.value) formData.append('description', e.target.description.value);
        
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
            // Create a new file with the modified name (spaces replaced with underscores)
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
            const response = await axios.put(
                `${url}/event/update/${eventId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            console.log('Evento actualizado:', response.data);
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
        <div>
            <Toaster position="top-center" />
            <Header/>
            <div className={styles.EventImg}>
                <div className={styles.gradient} style={{background: 'linear-gradient(to right,#F4F2EE,rgba(197, 106, 37, 0))'}}></div>
                <img className={styles.img} src={`${url}/event/image?filename=${event.mainImg}`} alt="" />
                <div className={styles.eventPart}>
                    <h2>{event.name} </h2>
                    <p>{event.description} </p>
                    <p className=''>{event.startDate} </p>
                    <h3>Activo</h3>
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



            <div className={styles.table}>
                <button 
                    className={styles.addTaller} 
                    onClick={() => setOpenModal(true)}
                >
                    Agregar taller <img className={styles.plusadd} src={plus} alt="" />
                </button>
                <Link to='/Dashboard' state={'/EventWorkshop'}>
                    <img className={styles.graficView} src={grafic} alt="" />
                </Link>
                <img 
                    className={styles.configView} 
                    src={config} 
                    alt="" 
                    onClick={() => setOpenEditModal(true)}
                />
                <TableTalleres/>
            </div>

            {openModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <img 
                            onClick={() => setOpenModal(false)} 
                            className={styles.arrowM} 
                            src={arrow} 
                            alt="" 
                        />
                        <h2 className={styles.formT}>Agregar Taller</h2>
                        <form onSubmit={crearTaller}>
                            <div 
                                className={styles.fileImg} 
                                onClick={() => imgRef.current.click()}
                                style={{
                                    backgroundImage: previewImage ? `url(${previewImage})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                            >
                                <p style={{color: 'white'}}>
                                    {previewImage ? 'Imagen del taller' : 'Imagen del taller'}
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
                                <label style={{color: 'black'}} htmlFor="startDate">Fecha de inicio</label> <br />
                                <input 
                                    type="datetime-local" 
                                    name="startDate" 
                                    placeholder='Fecha de inicio' 
                                    required
                                    onFocus={verCalendario}
                                /> <br />
                                <label style={{color: 'black'}} htmlFor="endDate">Fecha de fin</label> <br />
                                <input 
                                    type="datetime-local" 
                                    name="endDate" 
                                    placeholder='Fecha de fin'
                                    required
                                    onFocus={verCalendario}
                                />
                                <input 
                                    type="text" 
                                    name='name' 
                                    placeholder='Nombre del taller' 
                                    required
                                />
                                <input 
                                    type="text" 
                                    name='description' 
                                    placeholder='Descripción del taller' 
                                    required
                                />
                                <input 
                                    type="number" 
                                    name='limitQuota' 
                                    placeholder='Cupo límite' 
                                    required
                                />
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

            {openEditModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <img 
                            onClick={() => setOpenEditModal(false)} 
                            className={styles.arrowM} 
                            src={arrow} 
                            alt="" 
                        />
                        <h2 className={styles.formT}>Editar evento</h2>
                        <form onSubmit={actualizarEvento}>
                            <div 
                                className={styles.fileImg} 
                                onClick={() => editMainImgRef.current.click()}
                                style={{
                                    backgroundImage: previewEditImage ? 
                                        `url(${previewEditImage})` : 
                                        `url(${url}/event/image?filename=${event.mainImg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}
                            >
                                <p style={{color: 'white'}}>Imagen principal del evento</p>
                            </div>

                            <input 
                                type="file" 
                                name="mainImg" 
                                ref={editMainImgRef}
                                onChange={handleEditFileChange}
                                style={{ display: 'none' }} 
                                
                            />
                            
                            <div className={styles.formDataMain}>
                                <input 
                                    type="datetime-local" 
                                    name="startDate" 
                                    placeholder='Fecha de inicio'
                                    onFocus={verCalendario}
                                />
                                <input 
                                    type="datetime-local" 
                                    name="endDate" 
                                    onFocus={verCalendario}
                                />
                                <input 
                                    type="text" 
                                    name='name' 
                                    placeholder='Nombre del evento'
                                    defaultValue={event.name}
                                />
                                <input 
                                    type="text" 
                                    name='description' 
                                    placeholder='Descripción del evento'
                                    defaultValue={event.description}
                                />
                                
                                <input 
                                    type="file" 
                                    name="bannerImgs" 
                                    multiple 
                                    ref={editBannerImgsRef}
                                />
                                <br />
                                <small style={{color: '#252525'}}>Agrega al menos 3 imágenes</small>
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