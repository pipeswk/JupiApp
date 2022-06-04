import styles from '../../styles/Pronostico.module.css'

const Pronostico = ( { pronostico } ) => {

    const { categoria, nombre, descripcion, valorTicket, sorteo, img } = pronostico

    const cuota = () => {
        if(descripcion.tipo === 'Simple') {
            return 'Reservada'
        } else {
            return descripcion.cuota
        }
    }

    const moneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valorTicket)

  return (
    <div className='card shadow-sm mb-3 position-relative'>
        {sorteo && <span className={`${styles.badge} position-absolute top-0 start-50 translate-middle badge rounded-pill p-2`}>{`STAKE ${descripcion.stake} - SORTEO INCLUIDO`}</span>}
        <img src={img} className={`${styles.image} card-img-top img-fluid img-thumbnail`} alt={nombre} />
        <div className='card-body mt-1'>
            <p className='fw-light text-center fs-8'>{categoria}</p>
            <h2 className={`${styles.title} text-center fs-4 fw-bold px-3`}>{nombre}</h2>
            <ul>
                <li>{`Tipo: ${descripcion.tipo}`}</li>
                <li>{`Cuota: ${cuota()}`}</li>
                <li>{`Stake: ${descripcion.stake}`}</li>
            </ul>
            <p className={`container text-center rounded fw-bold w-50 ${styles.precio}`}>{`Precio: ${moneda}`}</p>
        </div>
    </div>
  )
}

export default Pronostico