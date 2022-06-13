import React from 'react'
import styles from '../../styles/Ganador.module.css'

const Ganador = ( { ganador } ) => {

    const { nombre, premio, img_src } = ganador;

  return (
    <div className="col-11 col-md-4 col-lg-3 card mx-1">
        <img className={`${styles.image} card-img-top img-fluid`} src={img_src} alt="Title" />
        <div className="card-body">
            <h4 className="card-title text-center">{nombre}</h4>
            <p className="card-text text-break"><span className='fw-bold text-break'>🔥Premio: </span>{premio}</p>
        </div>
    </div>
  )
}

//TODO: Enlazar imagen

export default Ganador