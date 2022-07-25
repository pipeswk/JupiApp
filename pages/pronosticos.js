import { useRouter } from 'next/router'
import Pronostico from '../src/Components/Pronostico';
import useJupi from '../src/Hooks/useJupi';
import Layout from '../src/Layout/Layout'
import styles from '../styles/Pronosticos.module.css'


const Pronosticos = () => {

  const router = useRouter()
  const { cambiarPronostico, pronosticos } = useJupi()

  const handleClickPronostico = (pronostico) => {
    cambiarPronostico(pronostico)
    router.push(`/pronosticos/${pronostico.id}`)
  }

  return (
    <Layout
        pagina='Pronosticos'
    >
        <main>
          {/* Seccion superior */}
          <div className={`rounded-bottom ${styles.section}`}>
            <section className='py-5 text-center container'>
              <div className='row py-lg-5'>
                <div className='col-lg-6 col-md-8 mx-auto'>
                  <h1 className='fw-bolder text-white'>Pronósticos disponibles</h1>
                  <p className='text-white lead'>Compra pronósticos deportivos de alta confiabilidad. Todos nuestros pronósticos incluye un sorteo en el que podrás participar ☺</p>
                </div>
              </div>
            </section>
          </div>

          {/* Cuerpo de la pagina */}

          <div className='album py-5 bg-light'>
            <div className='container'>
              <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3'>
                {pronosticos.map( (pronostico) => (
                  <div
                    key={pronostico.id}
                    className='col'
                    role='button'
                    onClick={() => handleClickPronostico(pronostico)}
                  >
                    <Pronostico
                      pronostico={pronostico}
                    />
                  </div>
                ) )}
              </div>

            </div>
          </div>

        </main>
    </Layout>
  )
}

export default Pronosticos