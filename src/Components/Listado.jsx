import React from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/Listado.module.css'
import useJupi from '../Hooks/useJupi';
import Sorteo from './Sorteo';

const Listado = () => {

    const router = useRouter();
    const { sorteos, cambiarSorteo } = useJupi();

    const handleClick = (sorteo) => {
        cambiarSorteo(sorteo);
        router.push(`/sorteos/${sorteo.id}`);
    }

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
                            onClick={() => handleClick(sorteo)}
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