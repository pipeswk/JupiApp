import Listado from '../src/Components/Listado'
import Layout from '../src/Layout/Layout'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import SectionGanadores from '../src/Components/SectionGanadores';

export default function Home() {

  const router = useRouter();

  const handleClickPronosticos = (e) => {
    e.preventDefault();
    router.push('/pronosticos')
  }

  return (
    <Layout
      pagina='Inicio'
    >
      <main>
        <div className="container my-5">
          <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
            <div className="col-lg-7 p-3 p-lg-5 pt-lg-3">
              <h1 className="display-4 fw-bold lh-1">Sorteos y pronósticos deportivos a bajo costo</h1>
              <p className="lead">
              Encuentra todo tipo de <span className={`fw-bold fs-3 ${styles.descripcion}`}>sorteos</span> para Colombia aquí: Viajes, consolas, vehículos, teléfonos y mucho mas... Ademas obtén los mejores <span className={`fw-bold fs-3 ${styles.descripcion}`}>pronosticos</span> deportivos.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
                <a href='#sorteos'><button type="button" className="btn btn-primary btn-lg px-4 me-md-2 fw-bold w-100">Ver sorteos</button></a>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg px-4"
                  onClick={handleClickPronosticos}
                >
                  Ver Pronósticos
                </button>
              </div>
            </div>
            <div className="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg mx-md-5">
              <img className='img-fluid rounded' src='/img/Apuestas.jpg' width={720} height={600} />
            </div>
          </div>
        </div> 
      </main>

      <Listado />

      <SectionGanadores />

    </Layout>
  )
}
