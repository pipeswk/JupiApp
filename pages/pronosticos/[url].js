import React from 'react'
import useJupi from '../../src/Hooks/useJupi'
import Layout from '../../src/Layout/Layout'

const EntradaPronostico = () => {

    const { pronosticoActual } = useJupi();

    const { nombre } = pronosticoActual

  return (
    <Layout
        pagina={nombre}
    >
      <main>
        <div className='py-5 bg-light'>
          <div className='container'>
            <div className='row'>
              <div className='col-12 col-md-7 mb-4'>
                <div className='card'>
                  Hola
                </div>
              </div>
              <div className='col-12 col-md-5'>
                <div className='card'>
                    Hola
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default EntradaPronostico