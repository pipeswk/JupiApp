import { useState, useEffect } from 'react'
import styles from '../../styles/CountDown.module.css'

const CountDown = () => {

    const [tiempo, setTiempo] = useState({});

    useEffect(() => {
      setTimeout(() => {
          setTiempo(calcularTiempo());
      }, 1000);
    });
    

    const calcularTiempo = () => {
        const diferencia = new Date('2022-06-23T00:00:00-05:00') - +new Date();
        let tiempo = {};

        if(diferencia > 0) {
            tiempo = {
                d: Math.floor(diferencia / (1000 * 60 * 60 * 24)),
                h: Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((diferencia % (1000 * 60)) / 1000)
            }
        }

        return tiempo;
    }

  return (
    <div className='d-flex justify-content-center'>
        <div className={styles.cuadro}>
            <span className='d-flex justify-content-center fs-2 fw-bold'>{tiempo.d}</span>
            <p className='d-flex justify-content-center text-decoration-underline'>Días</p>
        </div>
        <div className={styles.cuadro}>
            <span className='d-flex justify-content-center fs-2 fw-bold'>{tiempo.h}</span>
            <p className='d-flex justify-content-center text-decoration-underline'>Hrs</p>
        </div>
        <div className={styles.cuadro}>
            <span className='d-flex justify-content-center fs-2 fw-bold'>{tiempo.m}</span>
            <p className='d-flex justify-content-center text-decoration-underline'>Min</p>
        </div>
        <div className={styles.cuadro}>
            <span className='d-flex justify-content-center fs-2 fw-bold'>{tiempo.s}</span>
            <p className='d-flex justify-content-center text-decoration-underline'>Seg</p>
        </div>
    </div>
  )
}

export default CountDown