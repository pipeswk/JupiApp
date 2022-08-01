import React from 'react'
import Image from 'next/image'
import numeral from 'numeral'

const Sorteo = ( { sorteo } ) => {

    const { categoria, nombre, valorTicket, onPronosticos, img } = sorteo
    const moneda = numeral(valorTicket).format('$0,0');

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