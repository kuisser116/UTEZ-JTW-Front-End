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
    // 1. Estados
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registeredEvents, setRegisteredEvents] = useState([]); // <--- RECUPERADO

    // 2. Cargar datos al iniciar (Usuario + Eventos guardados)
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedEvents = localStorage.getItem('registeredEvents'); // <--- RECUPERADO

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (storedEvents) {
            setRegisteredEvents(JSON.parse(storedEvents));
        }

        setLoading(false);
    }, []);

    // 3. Guardar eventos en localStorage cuando cambien
    useEffect(() => {
        if (registeredEvents.length > 0) {
            localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
        } else {
            localStorage.removeItem('registeredEvents');
        }
    }, [registeredEvents]);

    // --- FUNCIONES DE AUTENTICACIÓN (NUEVAS) ---

    const loginWithGoogle = async (credentialResponse) => {
        try {
            console.log("🟡 Enviando token de Google al backend...");
            
            const res = await axios.post(`${url}/auth/google`, { 
                token: credentialResponse.credential 
            });

            const { token, user, role } = res.data;

            if (role === 'Supervisor') { 
                return { success: false, error: 'Los checadores solo pueden acceder desde la App Móvil.' };
            }

            // Guardar sesión
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

    const registerManual = async (userData) => {
        try {
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

    // --- FUNCIONES DE EVENTOS (RECUPERADAS Y ADAPTADAS) ---

    // Verificar si el usuario está registrado en un evento
    const isRegisteredInEvent = (eventId) => {
        return registeredEvents.includes(eventId);
    };

    // Registrar usuario a un evento
    const registerToEvent = async (eventId) => {
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            // Nota: Aquí adaptamos la lógica para usar los datos del usuario actual
            // independientemente de si entró por Google o Manual.
            const userDataToSend = {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                // Si entró manual, password está hasheado o no disponible, 
                // pero el endpoint /google/ lo usa para "crear o actualizar".
                // Mandamos user.email como fallback si no hay password plano.
                password: user.password || user.email, 
                profession: user.profession || "Sin especificar",
                livingState: user.livingState || "Sin especificar",
                birthday: user.birthday || "01-01-2000",
                gender: user.gender || "Sin especificar",
                eventAwarness: user.eventAwarness || "Web",
                workplace: user.workplace || "Sin especificar"
            };

            // NOTA IMPORTANTE: Estamos usando tu endpoint existente "/google/".
            // Idealmente deberías tener un endpoint genérico "/inscription", 
            // pero este funcionará porque tu backend actualiza si existe.
            const response = await axios.post(
                `${url}/event/inscription/google/${eventId}`,
                userDataToSend,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            // Agregar el evento a la lista local
            const newRegisteredEvents = [...registeredEvents, eventId];
            setRegisteredEvents(newRegisteredEvents);

            return { success: true, data: response.data };

        } catch (error) {
            console.error("❌ Error al registrar al evento:", error);
            
            // Si el error es que ya está registrado, lo sincronizamos localmente
            if (error.response?.data?.message?.includes('ya está registrado') || error.response?.data?.data?.includes('ya está registrado')) {
                const newRegisteredEvents = [...registeredEvents, eventId];
                setRegisteredEvents(newRegisteredEvents);
                return { success: false, error: 'Ya estás registrado en este evento', alreadyRegistered: true };
            }

            return { success: false, error: error.response?.data?.message || 'Error al registrarse' };
        }
    };

    const logout = () => {
        setUser(null);
        setRegisteredEvents([]); // Limpiar eventos al salir
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('adminId');
        localStorage.removeItem('registeredEvents');
    };

    const value = {
        user,
        loading,
        registeredEvents, // <--- Importante exportar esto
        loginWithGoogle,
        registerManual,
        registerToEvent,      // <--- RECUPERADO
        isRegisteredInEvent,  // <--- RECUPERADO (Esto arregla el crash)
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