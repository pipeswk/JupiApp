import React from 'react'
import styles from '../../styles/Listado.module.css'
import WrapperGanadores from './WrapperGanadores'

const SectionGanadores = () => {
  return (
    <div>
        <h2 className={`display-4 fw-bold lh-1 text-center ${styles.titulo}`}>Ultimos Ganadores</h2>
        <WrapperGanadores />
    </div>
  )
}

export default SectionGanadores