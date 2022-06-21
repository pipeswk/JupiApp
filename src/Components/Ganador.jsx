import React from 'react'
import Image from 'next/image';
import styles from '../../styles/Ganador.module.css'

const Ganador = ( { ganador } ) => {

    const { nombre, premio, img_src, ciudad, valor_premio } = ganador;
    const moneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valor_premio)

  return (
    <div className="col-11 col-md-4 col-lg-3 card mx-1">
        {/* <img className={`${styles.image} card-img-top img-fluid`} src={img_src} alt="Title" /> */}
        <Image width={800} height={1000} className={`${styles.image} card-img-top img-fluid`} src={img_src} alt="Title" />
        <div className="card-body">
            <h4 className="card-title text-center">{nombre}</h4>
            <p className="card-text text-break"><span className='fw-bold text-break'>🔥Premio: </span>{premio}</p>
            <p className="card-text text-break"><span className='fw-bold text-break'>🏢Ciudad: </span>{ciudad}</p>
            <p className="card-text text-break"><span className='fw-bold text-break'>💲Valor premio: </span>{moneda}</p>
        </div>
    </div>
  )
}

//TODO: Enlazar imagen

export default Ganador