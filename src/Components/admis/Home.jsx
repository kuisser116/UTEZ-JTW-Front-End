import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/stylesAdmin/Home.module.css';
import { Link, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");



    const id = localStorage.getItem('adminId');
    console.log(id)
    const token = localStorage.getItem("token");
    console.log(token)


    useEffect(() => {
        if (!token) {
            console.log('No puedes entrar')
            navigate("/login"); // Redirige al login si no hay token
        }
    }, []); 

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/event/admin`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
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
    
        const startDate = formatDate(event.target.startDate.value);
        const endDate = formatDate(event.target.endDate.value);
    
        const formData = new FormData();
        formData.append('name', event.target.name.value);
        formData.append('description', event.target.description.value);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
    
        const mainImgFile = mainImgRef.current.files[0];
        if (mainImgFile) {
            const renamedFile = new File(
                [mainImgFile],
                mainImgFile.name.replace(/\s+/g, "_"),
                { type: mainImgFile.type }
            );
            formData.append('mainImg', renamedFile);
        }
    
        const bannerImgsFiles = bannerImgsRef.current.files;
        if (bannerImgsFiles.length < 3) {
            alert('Debes agregar al menos 3 imágenes para el banner');
            return;
        }
        for (let i = 0; i < bannerImgsFiles.length; i++) {
            formData.append('bannerImgs', bannerImgsFiles[i]);
        }
    
        try {
            if (!event.target.name.value || !event.target.description.value) {
                alert('El nombre y la descripción son campos obligatorios');
                return;
            }
    
            const response = await axios.post(`http://localhost:3000/api/event/create`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Respuesta del servidor:", response.data);
            setOpenModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            if (error.response?.data?.data) {
                alert(error.response.data.data);
            } else {
                alert('Ocurrió un error al crear el evento. Por favor, verifica todos los campos.');
            }
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

        const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <Header />
            <NavBar />
            <h2 className={styles.tittle}>Eventos</h2>
            <div className={styles.search}>
            <input 
                className={styles.searchInput} 
                type="text" 
                placeholder="Buscar evento" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
            />
            </div>            
            <button onClick={() => setOpenModal(true)} className={styles.addEvent}>
                Agregar evento
            </button>
            <div className={styles.eventsGrid}>
                {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                    <Link 
                        className={styles.eventCard} 
                        style={{ 
                            backgroundImage: `url(http://localhost:3000/api/event/image?filename=${event.mainImg})`,
                        }}
                        key={event._id} 
                        to={`/EventWorkshop`} 
                        state={'/HomeAdmin'}
                        onClick={() => localStorage.setItem('idEvent', event._id)}
                    >
                        <div className={styles.eventInfo}>
                            <div className={styles.info}>
                                <p className={styles.p}>{event.name}</p>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <p className={styles.noEvents}>No hay eventos disponibles</p>
            )}
            </div>

            {openModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent4}>
                        <img onClick={() => setOpenModal(false)} className={styles.arrowMC} src={arrow} alt="" />
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
                                <label htmlFor="" style={{color: '#252525'}}>Inicio del evento</label>
                                <input type="datetime-local" name="startDate" placeholder='Fecha de inicio' onFocus={verCalendario}/> <br />
                                <label htmlFor="" style={{color: '#252525'}}>Fin del evento</label>
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
