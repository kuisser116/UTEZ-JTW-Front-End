import 'react';
import Header from '../Components/Header';
import EventImg from '../../assets/img/assets_participante/wallpaperflare.com_wallpaper.jpg';
import styles from '../../assets/styles/stylesAdmin/Dashboard.module.css';
import plus from '../../assets/img/Assets_admin/plus-regular-240.png';
import config from '../../assets/img/Assets_admin/cog-solid-240.png';
import arrowLeft from '../../assets/img/assets_participante/left-arrow-solid-240.png'
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';


function Dashboard() {
    const today = new Date().toLocaleDateString();
    const location = useLocation();
    console.log(location);

    return (
        <div>
            <Header />
            <div className={styles.EventImg}>
                <div className={styles.gradient} style={{background: 'linear-gradient(to right,#F4F2EE,rgba(254, 180, 123, 0))'}}></div>
                <img className={styles.img} src={EventImg} alt="" />
                <div className={styles.eventPart}>
                    <h2>Titulo de evento</h2>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto, laudantium consequatur est placeat inventore et sunt deleniti accusamus qui voluptatem, eaque vel saepe voluptate sapiente aliquid atque eveniet illum beatae!</p>
                    <p>{today} </p>
                    <h3>Activo</h3>
                </div>
            </div>

            <div className={styles.table}>
                <button className={styles.addTaller}>Agregar taller <img className={styles.plusadd} src={plus} alt="" /></button>
                <img className={styles.configView} src={config} alt="" />
                <Link to={location.state}><img className={styles.arrowLeft} src={arrowLeft}  alt="" /></Link>
                <h2 className={styles.tittleDashboard}>Dashboard</h2>
                <div className={styles.dashboard}>
                    <div className={styles.dashboardItem}>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleChecador)}>
                            <h3>Checadores</h3>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleAsistentes)}>
                            <h3>Asistentes</h3>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleTalleres)}>
                            <h3>Talleres</h3>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleList)}>
                            <h3>Lista</h3>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleEstado)}>
                            <h3>Estado</h3>
                        </div>
                        <div className={classNames(styles.dashboardModule, styles.dashboardModuleActividad)}>
                            <h3>Actividad</h3>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
