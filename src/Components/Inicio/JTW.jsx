import 'react';
import styles from '../../assets/styles/stylesLogin/JTW.module.css';
import logo from '../../assets/img/Assets_inicio/logo4.png'
import formas from '../../assets/img/Assets_inicio/formasInicio.svg'
import { Link, useLocation } from 'react-router-dom';


function JumpToWorkPage() {
    const location = useLocation();
    console.log(location);


    return (
        <div>
        <img className={styles.formas} src={formas} alt="" />
        <nav className={styles.topNav}>
            <div className={styles.nav}>
            <ul className={styles.navLinks}>
            <Link to={'/Events'} state={'/'}><li><a href="#eventos">Eventos</a></li> </Link>
            <Link to={'/login'} state={'/'}><button  className={styles.logoututton}>Iniciar Sesion</button></Link>

            </ul>
            </div>
        </nav>
        <div className={styles.div_logo}>
            <img src={logo} alt=""  className={styles.logo} />
            <p>Arreglamos y solucionamos tu vida</p>

        </div>




    </div>
  );
}

export default JumpToWorkPage;
