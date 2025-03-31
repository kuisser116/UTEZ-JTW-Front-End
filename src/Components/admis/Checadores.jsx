import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/styles/stylesAdmin/Home.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../Components/HeaderAdminHC';
import NavBar from '../Components/NavBar'; 
import TableCheck from '../Components/TableChecadores';

function Events() {
    const location = useLocation();
    const navigate = useNavigate();

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log('No puedes entrar')
            navigate("/login"); // Redirige al login si no hay token
        }
    }, []); 

    return (
        <div>
            <Header />
            <NavBar /> 
            <h2 className={styles.tittle}>Checadores</h2>
            <div className={styles.search}>
                <input className={styles.searchInput} type="text" placeholder="Buscar checador" />
            </div>
            
            <div className={styles.eventsGrid}>
               <TableCheck/>
            </div>
        </div>
    );
}

export default Events;
