import { useState, useEffect, useRef } from 'react';
import '../../assets/styles/Components/TablaTalleres.css';
import axios from 'axios';
import { url } from '../../utils/base.url';
import { Toaster, toast } from 'sonner';
import arrow from '../../assets/img/assets_participante/left-arrow-solid-240.png';

function TableTalleres() {
    const [talleres, setTalleres] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedTaller, setSelectedTaller] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const imgRef = useRef(null);

    const fetchTalleres = async () => {
        try {
            const eventId = localStorage.getItem('idEvent');
            if (!eventId) return console.error('No event ID found in localStorage');

            const response = await axios.get(`${url}/workshop/all-workshops`);
            const talleresDelEvento = response.data.data.filter(taller => taller.event === eventId);
            setTalleres(talleresDelEvento);
        } catch (error) {
            console.error('Error fetching workshops:', error);
        }
    };

    useEffect(() => {
        fetchTalleres();
    }, []);

    const formatForInput = (dateString) => {
        if (!dateString) return '';
        const [datePart, timePart] = dateString.split(' ');
        if (!datePart || !timePart) return '';
        const [day, month, year] = datePart.split('/');
        return `${year}-${month}-${day}T${timePart.slice(0, 5)}`;
    };

    const formatDateForBackend = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${day}-${month}-${year}T${hours}:${minutes}:${seconds}`;
    };

    const handleEditClick = (taller) => {
        setSelectedTaller(taller);
        setOpenEditModal(true);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const handleUpdateTaller = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        
        // Only append values if they have been changed
        if (e.target.name.value) formData.append('name', e.target.name.value);
        if (e.target.description.value) formData.append('description', e.target.description.value);
        if (e.target.startDate.value) {
            formData.append('startDate', formatDateForBackend(e.target.startDate.value));
        }
        if (e.target.endDate.value) {
            formData.append('endDate', formatDateForBackend(e.target.endDate.value));
        }
        if (e.target.limitQuota.value) formData.append('limitQuota', e.target.limitQuota.value);
        if (e.target.instructor.value) formData.append('instructor', e.target.instructor.value);

        const imgFile = imgRef.current.files[0];
        if (imgFile) formData.append('img', imgFile);

        try {
            await axios.put(
                `${url}/workshop/update/${selectedTaller._id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            toast.success('Taller actualizado correctamente');
            setOpenEditModal(false);
            setPreviewImage(null);
            setSelectedTaller(null);
            await fetchTalleres();
        } catch (error) {
            console.error('Error updating workshop:', error);
            toast.error('Error al actualizar el taller');
        }
    };

    return (
        <div>
            <Toaster position="top-center" />
            <div className='tableContent'>
                <h2 className='tableTittle'>Talleres</h2>
                <div className="tabla-container">
                    <table className="tabla-talleres">
                        <thead>
                            <tr className="encabezado">
                                <th>Nombre del taller</th>
                                <th>Instructor</th>
                                <th>Fecha inicio</th>
                                <th>Fecha fin</th>
                                <th>Cupo límite</th>
                                <th>Información</th>
                            </tr>
                        </thead>
                        <tbody>
                            {talleres.map((taller) => (
                                <tr key={taller._id}>
                                    <td>{taller.name}</td>
                                    <td>{taller.instructor}</td>
                                    <td>{taller.startDate}</td>
                                    <td>{taller.endDate}</td>
                                    <td>{taller.limitQuota}</td>
                                    <td>{taller.description}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {openEditModal && selectedTaller && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <img
                            onClick={() => {
                                setOpenEditModal(false);
                                setPreviewImage(null);
                                setSelectedTaller(null);
                            }}
                            className="arrowM"
                            src={arrow}
                            alt="Close"
                        />
                        <h2 className="formT">Editar Taller</h2>
                        <form onSubmit={handleUpdateTaller}>
                            <div
                                className="fileImg"
                                onClick={() => imgRef.current.click()}
                                style={{
                                    backgroundImage: previewImage
                                        ? `url(${previewImage})`
                                        : selectedTaller.img
                                            ? `url(${url}/workshop/image?filename=${selectedTaller.img})`
                                            : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <p>Imagen del taller</p>
                            </div>

                            <input
                                type="file"
                                name="img"
                                ref={imgRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />

                            <div className="formDataMain">
                                <div className="date-input-container">
                                    <label htmlFor="startDate">Fecha de inicio:</label>
                                    <input
                                        type="datetime-local"
                                        id="startDate"
                                        name="startDate"
                                        placeholder='Fecha de inicio'
                                        defaultValue={formatForInput(selectedTaller.startDate) || ''}
                                        onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                                    />
                                </div>

                                <div className="date-input-container">
                                    <label htmlFor="endDate">Fecha de fin:</label>
                                    <input
                                        type="datetime-local"
                                        id="endDate"
                                        name="endDate"
                                        placeholder='Fecha de fin'
                                        defaultValue={formatForInput(selectedTaller.endDate) || ''}
                                        onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                                    />
                                </div>

                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={selectedTaller.name || ''}
                                    placeholder="Nombre del taller"
                                />
                                <input
                                    type="text"
                                    name="description"
                                    defaultValue={selectedTaller.description || ''}
                                    placeholder="Descripción del taller"
                                />
                                <input
                                    type="number"
                                    name="limitQuota"
                                    defaultValue={selectedTaller.limitQuota || ''}
                                    placeholder="Cupo límite"
                                />
                                <input
                                    type="text"
                                    name="instructor"
                                    defaultValue={selectedTaller.instructor || ''}
                                    placeholder="Nombre del instructor"
                                />
                            </div>

                            <div className="btns">
                                <button type="submit" className="Mbtn">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TableTalleres;
