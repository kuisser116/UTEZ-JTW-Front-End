import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
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
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registeredEvents, setRegisteredEvents] = useState([]);

    // Cargar datos del usuario desde localStorage al iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedEvents = localStorage.getItem('registeredEvents');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (storedEvents) {
            setRegisteredEvents(JSON.parse(storedEvents));
        }

        setLoading(false);
    }, []);

    // Guardar usuario en localStorage cuando cambie
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Guardar eventos registrados en localStorage cuando cambien
    useEffect(() => {
        if (registeredEvents.length > 0) {
            localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
        } else {
            localStorage.removeItem('registeredEvents');
        }
    }, [registeredEvents]);

    // Login con Google
    const loginWithGoogle = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);

            // Crear fecha de nacimiento por defecto (01-01-2000)
            const defaultBirthday = "01-01-2000";

            const userData = {
                name: decoded.given_name,
                lastname: decoded.family_name || "Sin apellido",
                email: decoded.email,
                password: decoded.email, // Usar el email como password
                picture: decoded.picture,
                googleId: decoded.sub,
                // Datos por defecto para el backend
                profession: "Sin especificar",
                livingState: "Sin especificar",
                birthday: defaultBirthday,
                gender: "Sin especificar",
                eventAwarness: "Google",
                workplace: "Sin especificar"
            };

            console.log('🔐 Usuario logueado con Google:', userData);

            setUser(userData);
            return { success: true, user: userData };
        } catch (error) {
            console.error("Error en login con Google:", error);
            return { success: false, error };
        }
    };

    // Registrar usuario a un evento
    const registerToEvent = async (eventId) => {
        if (!user) {
            return { success: false, error: 'Usuario no autenticado' };
        }

        try {
            // Mapear los campos correctamente para el backend de participantes
            // Este código SOLO afecta a usuarios que iniciaron sesión con Google
            const userDataToSend = {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                password: user.password || user.email,
                profession: user.profession || "Sin especificar",
                livingState: user.livingState || "Sin especificar",
                birthday: user.birthday || "01-01-2000",
                gender: user.gender || "Sin especificar",
                eventAwarness: user.eventAwarness || "Google",
                workplace: user.workplace || "Sin especificar"
            };

            console.log('📤 Datos de PARTICIPANTE que se envían al backend:', userDataToSend);
            console.log('🎯 Event ID:', eventId);

            const response = await axios.post(
                `${url}/event/inscription/google/${eventId}`,
                userDataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Respuesta del backend:', response.data);

            // Agregar el evento a la lista de eventos registrados
            const newRegisteredEvents = [...registeredEvents, eventId];
            setRegisteredEvents(newRegisteredEvents);

            return { success: true, data: response.data };
        } catch (error) {
            console.error("❌ Error al registrar al evento:", error);
            console.error("📋 Detalles del error:", error.response?.data);

            // Si el error es que ya está registrado, agregarlo a la lista local
            if (error.response?.data?.message?.includes('ya está registrado')) {
                const newRegisteredEvents = [...registeredEvents, eventId];
                setRegisteredEvents(newRegisteredEvents);
                return { success: false, error: 'Ya estás registrado en este evento', alreadyRegistered: true };
            }

            return { success: false, error: error.response?.data?.message || error.response?.data?.data || 'Error al registrarse' };
        }
    };

    // Verificar si el usuario está registrado en un evento
    const isRegisteredInEvent = (eventId) => {
        return registeredEvents.includes(eventId);
    };

    // Cerrar sesión
    const logout = () => {
        setUser(null);
        setRegisteredEvents([]);
        localStorage.removeItem('user');
        localStorage.removeItem('registeredEvents');
    };

    const value = {
        user,
        loading,
        registeredEvents,
        loginWithGoogle,
        registerToEvent,
        isRegisteredInEvent,
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
