import 'react';
import styles from  '../../assets/styles//Components/TablaChecadores.module.css'


function TableChecadores() {
    return (
        <div>
                <div className={styles.tableContent}>
                    <div className={styles.tablaContainer}>
                    <table className={styles.tablaTalleres}>
                        <thead>
                            <tr className={styles.encabezado}> 
                            <th>Nombre del Checador</th>
                            <th>Correo</th>
                            <th>Evento Asignado</th>
                            <th>Estatus</th>
                            <th>Editar</th>
                            <th  className={styles.acciones}></th>
                            </tr>
                        </thead>
                        <tbody id="tabla-body">
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
    );
}

export default TableChecadores;