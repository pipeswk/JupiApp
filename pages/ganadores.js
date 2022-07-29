import { useEffect } from 'react'
import TablaGanadores from '../src/Components/TablaGanadores'
import WrapperGanadores from '../src/Components/WrapperGanadores'
import useJupi from '../src/Hooks/useJupi'
import Layout from '../src/Layout/Layout'

const Ganadores = () => {
  const { setPagoEnProceso, setPaymentMethod, setRefPago } = useJupi();

  useEffect(() => {
    setPagoEnProceso(false);
    setPaymentMethod('');
    setRefPago('');
  }, [])
  

  return (
    <Layout
        pagina='Ganadores'
    >
      <div className='mt-5'>
        <h1 className='text-center fw-bold'>Últimos Ganadores</h1>
          <WrapperGanadores />
      </div>
      <div className='container mt-5'>
        <TablaGanadores />
      </div>
    </Layout>
  )
}

export default Ganadores