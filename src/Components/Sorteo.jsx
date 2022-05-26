import React from 'react'
import Image from 'next/image'

const Sorteo = ( { sorteo } ) => {

    const { categoria, nombre, valorTicket, nuevo, img } = sorteo

  return (
    <div className="card w-100 shadow-lg">
        <Image className="card-img-top" src={img} width={500} height={500} alt={`Imagen ${nombre}`} />
        <div className="card-body">
            <h4 className="card-title">{nombre}</h4>
            <p className="card-text">{`Precio: ${valorTicket}`}</p>
        </div>
    </div>
  )
}

export default Sorteo