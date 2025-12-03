import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../utils/base.url';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    // --- ESTADOS ---
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registeredEvents, setRegisteredEvents] = useState([]);

    // --- EFECTOS (Persistencia) ---

    // 1. Cargar datos del usuario desde localStorage al iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedEvents = localStorage.getItem('registeredEvents');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }

        if (storedEvents) {
            setRegisteredEvents(JSON.parse(storedEvents));
        }

        setLoading(false);
    }, []);

    // 2. Guardar eventos registrados en localStorage cuando cambien
    useEffect(() => {
        if (registeredEvents.length > 0) {
            localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
        } else {
            localStorage.removeItem('registeredEvents');
        }
    }, [registeredEvents]);

    // --- FUNCIONES DE AUTENTICACIÓN ---

    // A. Login con Google (Conectado al Backend)
    const loginWithGoogle = async (credentialResponse) => {
        try {
            console.log("🟡 Enviando token de Google al backend...");
            
            // Enviamos el token al backend para validación y creación de usuario
            const res = await axios.post(`${url}/auth/google`, { 
                token: credentialResponse.credential 
            });

            const { token, user, role } = res.data;

            // Validación de seguridad para la Web (Checadores bloqueados)
            if (role === 'Supervisor') { 
                return { success: false, error: 'Los checadores solo pueden acceder desde la App Móvil.' };
            }

            // Guardar sesión en local
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('adminId', user._id);

            setUser(user);
            return { success: true, role, user };

        } catch (error) {
            console.error("Error en login con Google:", error);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Error al conectar con el servidor.' 
            };
        }
    };

    // B. Registro Manual
    const registerManual = async (userData) => {
        try {
            // Forzamos el rol de Participant para registros públicos
            const dataToSend = { ...userData, role: 'Participant' };
            
            await axios.post(`${url}/auth/register`, dataToSend);
            
            return { success: true };
        } catch (error) {
            console.error("Error en registro manual:", error);
            return { 
                success: false, 
                error: error.response?.data?.data || error.response?.data?.message || 'Error al registrar usuario' 
            };
        }
    };

    // --- FUNCIONES DE EVENTOS ---

    // C. Verificar si el usuario está registrado en un evento
    const isRegisteredInEvent = (eventId) => {
        return registeredEvents.includes(eventId);
    };

    // D. Registrar usuario a un evento
    const registerToEvent = async (eventId) => {
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            // Preparamos los datos para el endpoint de inscripción
            // Usamos los datos del estado 'user' actual (sea de Google o Manual)
            const userDataToSend = {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                // Si no hay password plano (porque vino de Google), mandamos el email como fallback
                // Esto es compatible con tu lógica de backend actual
                password: user.password || user.email, 
                profession: user.profession || "Sin especificar",
                livingState: user.livingState || "Sin especificar",
                birthday: user.birthday || "01-01-2000",
                gender: user.gender || "Sin especificar",
                eventAwarness: user.eventAwarness || "Web",
                workplace: user.workplace || "Sin especificar"
            };

            console.log('📤 Inscribiendo usuario al evento:', eventId);

            const response = await axios.post(
                `${url}/event/inscription/google/${eventId}`,
                userDataToSend,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            console.log('✅ Inscripción exitosa:', response.data);

            // Agregar el evento a la lista local
            const newRegisteredEvents = [...registeredEvents, eventId];
            setRegisteredEvents(newRegisteredEvents);

            return { success: true, data: response.data };

        } catch (error) {
            console.error("❌ Error al registrar al evento:", error);

            // Si el backend dice que ya está registrado, actualizamos el estado local
            if (error.response?.data?.message?.includes('ya está registrado') || error.response?.data?.data?.includes('ya está registrado')) {
                const newRegisteredEvents = [...registeredEvents, eventId];
                setRegisteredEvents(newRegisteredEvents);
                return { success: false, error: 'Ya estás registrado en este evento', alreadyRegistered: true };
            }

            return { success: false, error: error.response?.data?.message || error.response?.data?.data || 'Error al registrarse' };
        }
    };

    // E. Cerrar sesión
    const logout = () => {
        setUser(null);
        setRegisteredEvents([]);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('adminId');
        localStorage.removeItem('registeredEvents');
    };

    const value = {
        user,
        loading,
        registeredEvents,
        loginWithGoogle,
        registerManual, // <--- Importante para el formulario de registro
        registerToEvent,
        isRegisteredInEvent, // <--- Importante para evitar crash
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;