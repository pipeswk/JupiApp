import React from 'react'

const ProductImages = ( { data } ) => {
    
  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 0"></button>
            {data.img.map((ima, index) => (
                <button type="button" key={index} data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index + 1} aria-label={`Slide ${index + 1}`}></button>
            ))}
        </div>
        <div className="carousel-inner">
            <div className="carousel-item active">
            <img src={data.img[0]} className="d-block w-100" alt={data.nombre} />
            </div>
            {data.img.map((ima, index) => {
                if(index > 0) {
                    return (
                        <div className="carousel-item" key={index}>
                            <img src={ima} className="d-block w-100" alt={`${data.nombre} ${index}`} />
                        </div>
                    )
                }
            })}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
        </button>
    </div>
  )
}

export default ProductImages