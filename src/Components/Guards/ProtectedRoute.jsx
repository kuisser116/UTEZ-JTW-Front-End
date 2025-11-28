import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Este componente recibe:
// - children: El componente que quieres proteger (opcional si usas Outlet)
// - allowedRoles: Un array con los roles permitidos (ej: ['SuperAdmin', 'EventAdmin'])
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();

    // 1. Mientras verifica el token, mostramos un "Cargando..." o nada
    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Cargando...</div>;
    }

    // 2. Si no está autenticado, mandar al Login
    // "replace" borra el historial para que no pueda volver atrás
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si tiene un rol, pero no está en la lista de permitidos
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirigir según su rol real para que no se quede en el limbo
        if (user.role === 'SuperAdmin') return <Navigate to="/HomeSA" replace />;
        if (user.role === 'EventAdmin') return <Navigate to="/HomeAdmin" replace />;
        return <Navigate to="/Events" replace />;
    }

    // 4. Si todo está bien, renderiza la ruta hija
    return children ? children : <Outlet />;
};

export default ProtectedRoute;