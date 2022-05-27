import React from 'react'
import styles from '../../styles/Listado.module.css'
import Sorteo from './Sorteo';

const sorteos = [
    {
        id: 'ajkdnaksjdn1',
        categoria: 'Vehiculos',
        nombre: 'KTM DUKE - 390',
        valorTicket: 20000,
        nuevo: true,
        img: '/img/KTM-DUKE.jpg'
    },
    {
        id: 'ajkdnaksjdo2',
        categoria: 'Consolas',
        nombre: 'Play Station 5',
        valorTicket: 20000,
        nuevo: true,
        img: '/img/Comprar-PS5.webp'
    },
    {
        id: 'ajkdnaksjds3',
        categoria: 'Electronica',
        nombre: 'Iphone 13',
        valorTicket: 20000,
        nuevo: true,
        img: '/img/Iphone-13-Pro-Max-256Gb-Plata-APPLE-MLLC3LZA-3108595_b.webp'
    },
    {
        id: 'ajkdnaksjdn4',
        categoria: 'Vehiculos',
        nombre: 'KTM DUKE - 390',
        valorTicket: 20000,
        nuevo: true,
        img: '/img/KTM-DUKE.jpg'
    },
    {
        id: 'ajkdnaksjdo5',
        categoria: 'Consolas',
        nombre: 'Play Station 5',
        valorTicket: 20000,
        nuevo: true,
        img: '/img/Comprar-PS5.webp'
    },
    {
        id: 'ajkdnaksjdm6',
        categoria: 'Electronica',
        nombre: 'Iphone 13',
        valorTicket: 20000,
        nuevo: true,
        img: '/img/Iphone-13-Pro-Max-256Gb-Plata-APPLE-MLLC3LZA-3108595_b.webp'
    }
];

const Listado = () => {

  return (
    <div className='container-fluid my-5'>
        <h2 id='sorteos' className={`display-4 fw-bold lh-1 text-center ${styles.titulo}`}>Ultimos sorteos</h2>
            <div className='w-100 rounded-3 border shadow-lg p-3 d-flex justify-content-center'>
                <div className='container row'>
                    {sorteos.map( (sorteo) => (
                        <div
                            className='col-md-3 col-sm-4 mb-3'
                            role='button'
                            key={sorteo.id}
                        >
                            <Sorteo
                                sorteo={sorteo}
                            />
                        </div>
                    ) )}
                </div>
            </div>
    </div>
  )
}

export default Listado