import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Cargando...</div>;

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'SuperAdmin') return <Navigate to="/HomeSA" replace />;
        if (user.role === 'EventAdmin') return <Navigate to="/HomeAdmin" replace />;
        return <Navigate to="/Events" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;