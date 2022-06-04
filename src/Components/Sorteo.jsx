import React from 'react'
import Image from 'next/image'

const Sorteo = ( { sorteo } ) => {

    const { categoria, nombre, valorTicket, nuevo, img } = sorteo

    const moneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valorTicket)

  return (
    <div className="card w-100 shadow-lg">
        <Image className="card-img-top" src={img} width={500} height={500} alt={`Imagen ${nombre}`} />
        <div className="card-body">
            <p className='text-center'>{categoria}</p>
            <h4 className="card-title">{nombre}</h4>
            <p className="card-text">{`Precio: ${moneda}`}</p>
        </div>
    </div>
  )
}

export default Sorteo