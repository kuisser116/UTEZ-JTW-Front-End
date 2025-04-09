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
import classNames from 'classnames';
import ReporteImg from '../../assets/img/Assets_admin/report-analysis-5-45.png'


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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener supervisores (checadores)
                const supervisorsResponse = await axios.get(`${url}/supervisor/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const eventSupervisors = supervisorsResponse.data.data.filter(
                    supervisor => supervisor.events.includes(eventId)
                );

                // Obtener participantes
                const participantsResponse = await axios.get(`${url}/event/participants/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Obtener talleres
                const workshopsResponse = await axios.get(`${url}/workshop/all-workshops`);
                const eventWorkshops = workshopsResponse.data.data.filter(
                    workshop => workshop.event === eventId
                );

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

                console.log('Todos los talleres del evento:', eventWorkshops);

                // Modificamos esta parte para usar directamente el array de participants
                const workshopsWithParticipants = eventWorkshops.map(workshop => {
                    return {
                        ...workshop,
                        participantCount: workshop.participants ? workshop.participants.length : 0
                    };
                });

                console.log('Talleres con número de participantes:', workshopsWithParticipants);

                // Ordenar talleres por número de participantes (descendente)
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
            
            const response2 = await axios.put(
              `${url}/event/workshop/?eventId=${eventId}&workshopId=${workshopId}`,
              { startDate, endDate, },
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
            
            console.log('taller en evento:', response2.data)
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

                <img 
                    className={styles.configView} 
                    src={config} 
                    alt="" 
                    onClick={() => setOpenEditModal(true)}
                />
                <TableTalleres />

                
            </div>


            <div className={styles.dashboardcontent}>
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
                            <h3 className={styles.h3}>Talleres más Populares</h3>
                            <div className={styles.datosList}>
                                {workshopStats.talleresPopulares.map((taller, index) => (
                                    <div key={taller._id} className={styles.tallerItem}>
                                        {`${index + 1}. ${taller.name} (${taller.participantCount} participantes)`}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleActividad)}>
                            <h3 className={styles.h3}>Promedio de Participantes por Taller</h3>
                            <h4 className={styles.datos}>{workshopStats.participantesPorTaller}</h4>
                        </div>
                        <img src={ReporteImg} alt="" className={styles.grafico}/>
                        <div className={styles.f1}></div>
                        <div className={styles.f2}></div>
                        <div className={styles.f3}></div>
                        <div className={styles.f4}></div>
                    </div>
                </div>
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
                        <form className={styles.formTalleres} onSubmit={crearTaller}>
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
                                <br />
                                <label htmlFor="" style={{color: "#252525"}}>Nombre</label> <br />
                                <input 
                                    type="text" 
                                    name='name' 
                                    placeholder='Nombre del taller' 
                                    required
                                />
                                <br />
                                <label htmlFor="" style={{color: "#252525"}}>Descripción</label> <br />
                                <input 
                                    type="text" 
                                    name='description' 
                                    placeholder='Descripción del taller' 
                                    required
                                />
                                <br />
                                <label htmlFor="" style={{color: "#252525"}}>Cupo límite</label> <br />
                                <input 
                                    type="number" 
                                    name='limitQuota' 
                                    placeholder='Cupo límite' 
                                    required
                                />
                                <br />
                                <label htmlFor="" style={{color: "#252525"}}>Nombre del instructor</label> <br />
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
                                <label htmlFor="" style={{color:'#252525'}}>Fecha de inicio</label> <br />
                                <input 
                                    type="datetime-local" 
                                    name="startDate" 
                                    placeholder='Fecha de inicio'
                                    onFocus={verCalendario}
                                />
                                <br /> <label htmlFor="" style={{color:'#252525'}}>Fecha de fin"</label> <br />
                                <input 
                                    type="datetime-local" 
                                    name="endDate" 
                                    onFocus={verCalendario}
                                />
                                <br /> <label htmlFor="" style={{color:'#252525'}}>Nombre del evento</label> <br />
                                <input 
                                    type="text" 
                                    name='name' 
                                    placeholder='Nombre del evento'
                                    defaultValue={event.name}
                                />
                                <br /> <label htmlFor="" style={{color:'#252525'}}>Descripción del evento</label> <br />
                                <input 
                                    type="text" 
                                    name='description' 
                                    placeholder='Descripción del evento'
                                    defaultValue={event.description}
                                />
                                <br /> <label htmlFor="" style={{color: '#252525'}}>Imagenes para el banner</label> <br />
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