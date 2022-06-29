import { useState, useEffect } from 'react'

const Progress = ( { data } ) => {

    const [porcentaje, setPorcentaje] = useState(0);

    useEffect(() => {
        const calcularPorcentaje = () => {
            const porc = Math.round((data?.participantes.length / 500) * 100);
            setPorcentaje(porc);
            console.log(porcentaje);
        }
        calcularPorcentaje();
    }, [data])

  return (
    <div>
        <p className='text-center fw-bold'>{`Cupos Disponibles: ${500 - data?.participantes.length}`}</p>
        <div className='progress'>
            <div
                className={porcentaje === 100 ? (
                    'progress-bar progress-bar-striped progress-bar-animated bg-success fw-bold'
                ) : (
                    'progress-bar progress-bar-striped progress-bar-animated fw-bold'
                )}
                role="progressbar"
                aria-valuenow="75"
                aria-valuemin="0"
                aria-valuemax="100"
                style={{
                    width: `${porcentaje}%`
                }}
            >
                {porcentaje}%
            </div>
        </div>
    </div>
  )
}

export default Progress