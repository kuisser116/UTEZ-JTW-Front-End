import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/stylesAdmin/Home.module.css';
import { Link } from 'react-router-dom';
import Header from '../Components/HeaderAdminHC';
import NavBar from '../Components/NavBar'; 
import plus from '../../assets/img/Assets_admin/plus-regular-240.png';
import fondoImg from '../../assets/img/Assets_admin/fondoa.png';
import arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png';

function Events() {

    const [events, setEvents] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImage, setPreviewImage] = useState(fondoImg);
    const fileInputRef = useRef(null);
    const mainImgRef = useRef(null); // Ref para la imagen principal
    const bannerImgsRef = useRef(null); // Ref para las imágenes del banner

    const id = localStorage.getItem('adminId');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/event/admin/${id}`);
                setEvents(response.data.data);
                console.log(response.data.data)
            } catch (error) {
                console.error('Error al obtener los eventos:', error);
            }
        };
        fetchEvents();
    }, [id]);

    // Función para convertir una fecha al formato 'DD-MM-YYYYTHH:mm:ss'
    const formatDate = (date) => {
        const d = new Date(date);
        const day = ("0" + d.getDate()).slice(-2); // Asegura que el día tenga 2 dígitos
        const month = ("0" + (d.getMonth() + 1)).slice(-2); // Asegura que el mes tenga 2 dígitos
        const year = d.getFullYear();
        const hours = ("0" + d.getHours()).slice(-2);
        const minutes = ("0" + d.getMinutes()).slice(-2);
        const seconds = ("0" + d.getSeconds()).slice(-2);
        
        return `${day}-${month}-${year}T${hours}:${minutes}:${seconds}`;
    };

    // Manejar selección de archivos
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);

        if (files.length > 0) {
            const imageUrl = URL.createObjectURL(files[0]); // Crea una URL temporal de la imagen
            setPreviewImage(imageUrl); // Cambia el fondo del div
        }
    };

    const enviarEvento = async (event) => {
        event.preventDefault();

        // Convertir las fechas al formato requerido
        const startDate = formatDate(event.target.startDate.value);
        const endDate = formatDate(event.target.endDate.value);

        const formData = new FormData();
        formData.append('name', event.target.name.value);
        formData.append('description', event.target.description.value);
        formData.append('startDate', startDate); // Usar fecha convertida
        formData.append('endDate', endDate); // Usar fecha convertida

        // Obtener la imagen principal (mainImg)
        const mainImgFile = mainImgRef.current.files[0];
        if (mainImgFile) {
            formData.append('mainImg', mainImgFile);
            console.log("mainImg:", mainImgFile.name); // Verifica el nombre de la imagen principal
        }

        // Obtener las imágenes del banner (bannerImgs)
        const bannerImgsFiles = bannerImgsRef.current.files;
        for (let i = 0; i < bannerImgsFiles.length; i++) {
            formData.append('bannerImgs', bannerImgsFiles[i]);
            console.log("bannerImgs añadido:", bannerImgsFiles[i].name); // Verifica los archivos de imágenes del banner
        }

        // Verificar los datos antes de enviarlos
        console.log("startDate:", startDate);
        console.log("endDate:", endDate);
        console.log("name:", event.target.name.value);
        console.log("description:", event.target.description.value);
        console.log(id);

        try {
            const response = await axios.post(`http://localhost:3000/api/event/create/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("Respuesta del servidor:", response.data); // Verifica la respuesta del servidor
            setOpenModal(false);
            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
            window.location.reload();
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    //Terminar descripcion con mas de 50 palabras
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    //abrir calendario
    const verCalendario = (e) => {
        e.target.showPicker();
    };

    return (
        <div>
            <Header />
            <NavBar />
            <h2 className={styles.tittle}>Eventos</h2>
            <div className={styles.search}>
                <input className={styles.searchInput} type="text" placeholder="Buscar evento" />
            </div>            
            <button onClick={() => setOpenModal(true)} className={styles.addEvent}>
                Agregar evento <img className={styles.plusadd} src={plus} alt="" />
            </button>
            <div className={styles.eventsGrid}>
                {events.map(event => (
                    <Link
                        className={styles.eventCard}
                        style={{
                            backgroundImage: `url(http://localhost:3000/api/event/image?filename=${event.mainImg})`,
                        }}
                        key={event._id}
                        to={'/EventWorkshop'}
                        state={'/HomeAdmin'}
                        onClick={() => localStorage.setItem('idEvent', event._id)}
                    >
                        <div className={styles.eventInfo}>
                            <div className={styles.info}>
                                <p className={styles.pt}>{event.name}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {openModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <img onClick={() => setOpenModal(false)} className={styles.arrowM} src={arrow} alt="" />
                        <h2 className={styles.formT}>Agregar evento</h2>
                        <form onSubmit={enviarEvento}>
                            {/* Div que actúa como input file con fondo de imagen */}
                            <div 
                                className={styles.fileImg} 
                                onClick={() => mainImgRef.current.click()} // Se abre el input de la imagen principal
                                style={{
                                    backgroundImage: `url(${previewImage})`,
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
                                <p style={{color: 'white'}}>Imagen principal <br /> del evento</p>
                            </div>

                            <p className={styles.advice}>El nombre del archivo no debe contener espacios</p>

                            {/* Input file oculto para la imagen principal */}
                            <input 
                                type="file" 
                                name="mainImg" 
                                multiple 
                                ref={mainImgRef} // Referencia a este input
                                onChange={handleFileChange} 
                                style={{ display: 'none' }} 
                            />
                            
                            <div className={styles.formDataMain}>
                                <input type="datetime-local" name="startDate" placeholder='Fecha de inicio' onFocus={verCalendario}/>
                                <input type="datetime-local" name="endDate" onFocus={verCalendario}/>
                                <input type="text" name='name' placeholder='Nombre del evento' />
                                <input type="text" name='description' placeholder='Descripción del evento' />
                                
                                {/* Input para las imágenes del banner */}
                                <input 
                                    type="file" 
                                    name="bannerImgs" 
                                    multiple 
                                    ref={bannerImgsRef} 
                                />
                                <br />
                                <small style={{color: '#252525'}}>Agrega al menos 3 imágenes</small>
                            </div>

                            <div className={styles.btns}>
                                <button  type="submit" className={styles.Mbtn}>Confirmar</button>
                            </div>
                                    
                            

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Events;
