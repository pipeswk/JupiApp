import { useState } from 'react'

const Progress = () => {

    const [porcentaje, setPorcentaje] = useState(75);

    const participantes = [
        {
            nombre: 'Juan'
        },
        {
            nombre: 'Pedro'
        },
        {
            nombre: 'Maria'
        },
        {
            nombre: 'Felipe'
        }
    ]

    // const calcularPorcentaje = () => {
    //     setPorcentaje((participantes.length / 2000) * 100);
    //     console.log(porcentaje);
    // }
    // calcularPorcentaje();

  return (
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
  )
}

export default Progress