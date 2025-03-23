import 'react';
import EventImg from '../../assets/img/assets_participante/wallpaperflare.com_wallpaper.jpg'
import styles from '../../assets/styles/stylesUser/events.module.css'
import Header from '../Components/Header'
import {Link, useLocation} from 'react-router-dom'

function Eventpage() {
    const today = new Date().toLocaleDateString();
    const location = useLocation();
    console.log(location);

    return (
        <div>
            <Header/>
            <div className={styles.EventImg}>
                <div className={styles.gradient} style={{background: 'linear-gradient(to right,#F4F2EE,rgba(254, 180, 123, 0))'}}></div>
                <img className={styles.img} src={EventImg} alt="" />

                <div className={styles.eventPart}>
                    <h2>Titulo de evento</h2>
                    <Link to={'/ListEvent'} state={'/Event'}><button>Registrarse</button></Link>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto, laudantium consequatur est placeat inventore et sunt deleniti accusamus qui voluptatem, eaque vel saepe voluptate sapiente aliquid atque eveniet illum beatae!</p>
                    <p className=''>{today} </p>
                    <h3>Activo</h3>

                </div>

            </div>

        </div>
    );
}

export default Eventpage;