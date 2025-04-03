import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Events from './Components/Inicio/Events';
import Dashboard from "./Components/admis/Dashboard";
import Login from './Components/Inicio/LoginComponent';
import EventWorkshop from "./Components/admis/EventWorkshop";
import JWT from './Components/Inicio/JTW';
import Event from './Components/participante/event';
import ListEvent from './Components/participante/ListEvent';
import HomeAdmin from './Components/admis/Home';
import ChecadoresAdmin from './Components/admis/Checadores';
import RecoverPassword from './Components/Inicio/PasswordRecover';
import Password from './Components/Inicio/2Password';
import HomeSA from './Components/S_admins/Home';
import Admins from './Components/S_admins/Checadores';
import EventSA from './Components/S_admins/Events';
import List from './Components/participante/List';
import Recover from './Components/Inicio/Recover';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JWT />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/EventWorkshop" element={<EventWorkshop />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Event" element={<Event />} />
        <Route path="/ListEvent" element={<ListEvent />} />
        <Route path="/HomeAdmin" element={<HomeAdmin />} />
        <Route path="/Checadores" element={<ChecadoresAdmin />} />
        <Route path="/RecoverPassword" element={<RecoverPassword />} />
        <Route path="/Password" element={<Password />} />
        <Route path="/HomeSA" element={<HomeSA />} />
        <Route path="/Admins" element={<Admins />} />
        <Route path="/EventSA" element={<EventSA />} />
        <Route path="/List" element={<List />} />
        <Route path="/Recover" element={<Recover />} />
      </Routes>
    </Router>
  );
}

export default App;
