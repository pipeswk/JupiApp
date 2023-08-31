import React from 'react'
import Image from 'next/image'
import numeral from 'numeral'

const Sorteo = ( { sorteo } ) => {

    const { categoria, nombre, valorTicket, preview_img } = sorteo
    const moneda = numeral(valorTicket).format('$0,0');

  return (
    <div className="card w-100 shadow-lg h-100">
        <img className="card-img-top img-fluid" src={preview_img} alt={`Imagen ${nombre}`} />
        <div className="card-body">
            <p className='text-center'>{categoria}</p>
            <h4 className="card-title">{nombre}</h4>
            <p className="card-text">{`Precio: ${moneda}`}</p>
        </div>
    </div>
  )
}

export default Sorteo