import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/stylesAdmin/Home.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import NavBar from '../Components/NavBar';
import plus from '../../assets/img/Assets_admin/plus-regular-240.png';
import fondoImg from '../../assets/img/Assets_admin/fondoa.png';
import arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png';
import { url } from '../../utils/base.url';
import { Toaster, toast } from 'sonner'



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
                const response = await axios.get(`${url}/event/admin`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEvents(response.data.data);
                console.log(response.data.data)
            } catch (error) {
                console.error('Error al obtener los eventos:', error);
                toast.error('Error al obtener los eventos');
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
            toast.error('Debes agregar al menos 3 imágenes para el banner');
            return;
        }
        for (let i = 0; i < bannerImgsFiles.length; i++) {
            formData.append('bannerImgs', bannerImgsFiles[i]);
        }

        try {
            if (!event.target.name.value || !event.target.description.value) {
                toast.error('El nombre y la descripción son campos obligatorios');
                return;
            }

            const response = await axios.post(`${url}/event/create`, formData, {
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
                toast.error(error.response.data.data);
            } else {
                toast.error('Ocurrió un error al crear el evento. Por favor, verifica todos los campos.');
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
            <Toaster position="top-center" />
            <Header showBackButton={false} />
            <NavBar />
            <div className={styles.headerContainer}>
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
            </div>
            <div className={styles.eventsGrid}>
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <Link
                            className={styles.eventCard}
                            style={{
                                backgroundImage: `url(${url}/event/image?filename=${event.mainImg})`,
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
                <div className={styles.modalOverlay} onClick={() => setOpenModal(false)}>
                    <div className={styles.modalContent4} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Agregar Nuevo Evento</h2>
                            <button onClick={() => setOpenModal(false)} className={styles.closeBtn}>×</button>
                        </div>

                        <form onSubmit={enviarEvento} className={styles.modalForm}>
                            <div className={styles.formField}>
                                <label>Nombre del Evento <span className={styles.required}>*</span></label>
                                <input
                                    type="text"
                                    name='name'
                                    placeholder='Ej: Conferencia Anual 2024'
                                    required
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Descripción <span className={styles.required}>*</span></label>
                                <textarea
                                    name='description'
                                    placeholder='Describe el evento...'
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formField}>
                                    <label>Fecha Inicio <span className={styles.required}>*</span></label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        onFocus={verCalendario}
                                        required
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label>Fecha Fin <span className={styles.required}>*</span></label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        onFocus={verCalendario}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formField}>
                                <label>Imagen Principal</label>
                                <div
                                    className={styles.imagePreview}
                                    onClick={() => mainImgRef.current.click()}
                                    style={{
                                        backgroundImage: previewImage !== fondoImg ? `url(${previewImage})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    {previewImage === fondoImg && (
                                        <div className={styles.imagePlaceholder}>
                                            <span>📷</span>
                                            <p>Click para seleccionar imagen</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    name="mainImg"
                                    ref={mainImgRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Imágenes del Banner</label>
                                <small className={styles.fieldHint}>Selecciona mínimo 3 imágenes</small>
                                <input
                                    type="file"
                                    name="bannerImgs"
                                    multiple
                                    ref={bannerImgsRef}
                                    className={styles.fileInputStyled}
                                    accept="image/*"
                                />
                            </div>

                            <div className={styles.modalFooter}>
                                <button
                                    type="button"
                                    onClick={() => setOpenModal(false)}
                                    className={styles.btnCancel}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={styles.btnSubmit}
                                >
                                    Guardar Evento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Events;
