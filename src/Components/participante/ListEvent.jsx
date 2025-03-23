import 'react';
import EventImg from '../../assets/img/assets_participante/wallpaperflare.com_wallpaper.jpg'
import styles from '../../assets/styles/stylesUser/listEvent.module.css'
import Header from '../Components/Header'
import TableTalleres from '../Components/TableTalleres';

function ListEvent() {
    const today = new Date().toLocaleDateString();

  

    return (
        <div>
            <Header/>
            <div className={styles.EventImg}>
                <div className={styles.gradient} style={{background: 'linear-gradient(to right,#F4F2EE,rgba(254, 180, 123, 0))'}}></div>
                <img className={styles.img} src={EventImg} alt="" />
                <div className={styles.eventPart}>
                    <h2>Titulo de evento</h2>
                    <button className={styles.btnRdo}>Registrado</button>
                    <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto, laudantium consequatur est placeat inventore et sunt deleniti accusamus qui voluptatem, eaque vel saepe voluptate sapiente aliquid atque eveniet illum beatae!</p>
                    <p className=''>{today} </p>
                    <h3>Activo</h3>
                </div>
            </div>

            <div className={styles.table}>
                <TableTalleres/>
            </div>

            

        </div>
    );
}

export default ListEvent;