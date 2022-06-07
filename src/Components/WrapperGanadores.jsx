import React from 'react'
import useJupi from '../Hooks/useJupi'
import Ganador from './Ganador'
import HorizontalWrapper from './HorizontalWrapper'

const WrapperGanadores = () => {

    const { ganadores } = useJupi()

  return (
      <div className='mt-5'>
        <HorizontalWrapper>
            {ganadores.map( (ganador, index) => (
                <Ganador
                    key={index}
                    ganador={ganador}
                />
            ))}
        </HorizontalWrapper>
      </div>
  )
}

export default WrapperGanadores