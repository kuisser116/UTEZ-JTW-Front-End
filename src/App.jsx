import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';

// --- GUARDS ---
import ProtectedRoute from './Components/Guards/ProtectedRoute';

// --- PUBLIC COMPONENTS ---
import JWT from './Components/Inicio/JTW'; // Landing Page
import Login from './Components/Inicio/LoginComponent';
import RegisterComponent from './Components/Inicio/RegisterComponent';
import RecoverPassword from './Components/Inicio/PasswordRecover';
import Password from './Components/Inicio/2Password';

// --- PARTICIPANT COMPONENTS ---
import Events from './Components/Inicio/Events';
import Event from './Components/participante/Event';
import ListEvent from './Components/participante/ListEvent';
import List from './Components/participante/List';

// --- EVENT ADMIN COMPONENTS ---
import HomeAdmin from './Components/admis/Home';
import Dashboard from "./Components/admis/Dashboard";
import EventWorkshop from "./Components/admis/EventWorkshop";
import ChecadoresAdmin from './Components/admis/Checadores';

// --- SUPER ADMIN COMPONENTS ---
import HomeSA from './Components/S_admins/Home';
import Admins from './Components/S_admins/Checadores'; // Supongo que este es para gestionar Admins
import EventSA from './Components/S_admins/Events';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* =======================================================
              1. RUTAS PÚBLICAS (Accesibles sin iniciar sesión)
             ======================================================= */}
          <Route path="/" element={<JWT />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterComponent />} />
          <Route path="/RecoverPassword" element={<RecoverPassword />} />
          <Route path="/Password" element={<Password />} />

          {/* =======================================================
              2. RUTAS DE PARTICIPANTE
              Permitimos también a los Admins entrar aquí para que
              puedan ver cómo luce la vista de eventos.
             ======================================================= */}
          <Route
            path="/Events"
            element={
              <ProtectedRoute allowedRoles={['Participant', 'EventAdmin', 'SuperAdmin']}>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Event"
            element={
              <ProtectedRoute allowedRoles={['Participant', 'EventAdmin', 'SuperAdmin']}>
                <Event />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ListEvent"
            element={
              <ProtectedRoute allowedRoles={['Participant', 'EventAdmin', 'SuperAdmin']}>
                <ListEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/List"
            element={
              <ProtectedRoute allowedRoles={['Participant', 'EventAdmin', 'SuperAdmin']}>
                <List />
              </ProtectedRoute>
            }
          />

          {/* =======================================================
              3. RUTAS DE ADMINISTRADOR DE EVENTOS (EventAdmin)
             ======================================================= */}
          <Route
            path="/HomeAdmin"
            element={
              <ProtectedRoute allowedRoles={['EventAdmin']}>
                <HomeAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Dashboard"
            element={
              <ProtectedRoute allowedRoles={['EventAdmin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EventWorkshop"
            element={
              <ProtectedRoute allowedRoles={['EventAdmin']}>
                <EventWorkshop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Checadores"
            element={
              <ProtectedRoute allowedRoles={['EventAdmin']}>
                <ChecadoresAdmin />
              </ProtectedRoute>
            }
          />

          {/* =======================================================
              4. RUTAS DE SUPER ADMINISTRADOR (SuperAdmin)
             ======================================================= */}
          <Route
            path="/HomeSA"
            element={
              <ProtectedRoute allowedRoles={['SuperAdmin']}>
                <HomeSA />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Admins"
            element={
              <ProtectedRoute allowedRoles={['SuperAdmin']}>
                <Admins />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EventSA"
            element={
              <ProtectedRoute allowedRoles={['SuperAdmin']}>
                <EventSA />
              </ProtectedRoute>
            }
          />

          {/* =======================================================
              5. RUTA POR DEFECTO (404)
              Si escriben cualquier cosa rara, los manda al inicio
             ======================================================= */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;