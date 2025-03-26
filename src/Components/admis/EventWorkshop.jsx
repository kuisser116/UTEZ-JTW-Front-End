import 'react';
import Header from '../Components/HeaderAdmin'
import TableTalleres from '../Components/TableTalleres';
import EventImg from '../../assets/img/assets_participante/wallpaperflare.com_wallpaper.jpg'
import styles from '../../assets/styles/stylesAdmin/WorkshopList.module.css'
import plus from '../../assets/img/Assets_admin/plus-regular-240.png'
import grafic from '../../assets/img/Assets_admin/grafico-de-barras.png'
import config from '../../assets/img/Assets_admin/cog-solid-240.png'
import { Link, useLocation} from 'react-router-dom';

function EventWorkshop() {
    const today = new Date().toLocaleDateString();
    const location = useLocation();
    console.log(location);



    return (
        <div>
            <Header/>
            <div className={styles.EventImg}>
                <div className={styles.gradient} style={{background: 'linear-gradient(to right,#F4F2EE,rgba(197, 106, 37, 0))'}}></div>
                <img className={styles.img} src={EventImg} alt="" />
                <div className={styles.eventPart}>
                    <h2>Titulo de evento</h2>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto, laudantium consequatur est placeat inventore et sunt deleniti accusamus qui voluptatem, eaque vel saepe voluptate sapiente aliquid atque eveniet illum beatae!</p>
                    <p className=''>{today} </p>
                    <h3>Activo</h3>
                </div>
            </div>

            <div className={styles.table}>
                <button className={styles.addTaller}>Agregar taller <img className={styles.plusadd} src={plus} alt="" /></button>
                <Link to='/Dashboard' state={'/EventWorkshop'}><img className={styles.graficView} src={grafic} alt="" /></Link>
                <img className={styles.configView} src={config} alt="" />
                <TableTalleres/>
            </div>
            
        </div>
    );
}

export default EventWorkshop;