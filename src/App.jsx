import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Events from './Components/Inicio/Events';
import Dashboard from "./Components/admis/Dashboard";
import Login from './Components/Inicio/LoginComponent';
import EventWorkshop from "./Components/admis/EventWorkshop";
import JWT from './Components/Inicio/JTW';
import Event from './Components/participante/event';
import ListEvent from './Components/participante/ListEvent';

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
      </Routes>
    </Router>
  );
}

export default App;
