import { useRouter } from 'next/router'
import Pronostico from '../src/Components/Pronostico';
import useJupi from '../src/Hooks/useJupi';
import Layout from '../src/Layout/Layout'
import styles from '../styles/Pronosticos.module.css'

const pronosticos = [
  {
      id: 'ajkdnaksjdn1',
      categoria: 'Futbol',
      nombre: 'Liverpool - Real Madrid',
      descripcion: {
        tipo: 'Simple',
        cuota: 'Reservada',
        stake: 10
      },
      valorTicket: 50000,
      sorteo: true,
      img: '/img/Futbol.webp'
  },
  {
      id: 'ajkdnaksjdo2',
      categoria: 'BasketBall',
      nombre: 'NBA - Stake 10',
      descripcion: {
        tipo: 'Combinada',
        cuota: '@7.2',
        stake: 10
      },
      valorTicket: 50000,
      sorteo: true,
      img: '/img/NBA.webp'
  },
  {
      id: 'ajkdnaksjds3',
      categoria: 'Hockey sobre Hielo',
      nombre: 'NHL y Champions | Stake 5',
      descripcion: {
        tipo: 'Combinada',
        cuota: '@12',
        stake: 5
      },
      valorTicket: 50000,
      sorteo: false,
      img: '/img/NHL.jpg'
  },
  {
    id: 'ajkdnaksjdn4',
    categoria: 'Futbol',
    nombre: 'Liverpool - Real Madrid',
    descripcion: {
      tipo: 'Simple',
      cuota: 'Reservada',
      stake: 10
    },
    valorTicket: 50000,
    sorteo: true,
    img: '/img/Futbol.webp'
},
{
    id: 'ajkdnaksjdo5',
    categoria: 'BasketBall',
    nombre: 'NBA - Stake 10',
    descripcion: {
      tipo: 'Combinada',
      cuota: '@7.2',
      stake: 10
    },
    valorTicket: 50000,
    sorteo: true,
    img: '/img/NBA.webp'
},
{
    id: 'ajkdnaksjds6',
    categoria: 'Hockey sobre Hielo',
    nombre: 'NHL y Champions | Stake 5',
    descripcion: {
      tipo: 'Combinada',
      cuota: '@12',
      stake: 5
    },
    valorTicket: 50000,
    sorteo: false,
    img: '/img/NHL.jpg'
} 
];

const Pronosticos = () => {

  const router = useRouter()
  const { cambiarPronostico } = useJupi()

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
                  <h1 className='fw-bolder text-white'>Pronosticos disponibles</h1>
                  <p className='text-white lead'>Incididunt elit amet qui reprehenderit incididunt commodo ad non tempor minim ex qui deserunt.</p>
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