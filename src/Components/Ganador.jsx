import React from 'react'

const Ganador = ( { ganador } ) => {

    const { nombre, premio, img_src } = ganador;

  return (
    <div className="col-11 col-md-4 col-lg-3 card mx-1">
        <img className="card-img-top" src="/img/Comprar-PS5.webp" alt="Title" />
        <div className="card-body">
            <h4 className="card-title text-center">{nombre}</h4>
            <p className="card-text"><span className='fw-bold'>🔥Premio: </span>{premio}</p>
        </div>
    </div>
  )
}

//TODO: Enlazar imagen

export default Ganador