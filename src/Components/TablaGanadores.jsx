import React from 'react'
import useJupi from '../Hooks/useJupi'

const TablaGanadores = () => {

    const { ganadores } = useJupi()

    const newGanadores = [...ganadores].reverse()

    const fecha = (secs) => {
        let t = new Date(1970, 0, 1);
        t.setSeconds(secs);
        return t.toLocaleString();
    }

  return (
    <div>
        <table className='table table-hover'>
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Ganador</th>
            <th scope="col">Premio</th>
            <th scope="col">Fecha entrega</th>
            </tr>
        </thead>
        <tbody>
            {ganadores.map( (ganador, index) => (
                <tr key={index}>
                    <th scope="row">{index}</th>
                    <td>{ganador.nombre}</td>
                    <td>{ganador.premio}</td>
                    <td>{fecha(ganador.fechayhora.seconds)}</td>
                </tr>
            ))}
        </tbody>
        </table>
    </div>
  )
}

export default TablaGanadores