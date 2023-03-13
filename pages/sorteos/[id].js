import { useState, useEffect } from 'react'
import Image from 'next/image'
import Layout from '../../src/Layout/Layout'
import styles from '../../styles/EntradaPronostico.module.css'
import { db } from '../../utils/Firebase'
import { doc, getDoc } from "firebase/firestore";
import FormSorteos from '../../src/Components/FormSorteos'
import Progress from '../../src/Components/Progress'
import useJupi from '../../src/Hooks/useJupi'
import PaymentProcess from '../../src/Components/PaymentProcess'
import axios from 'axios'
import SectionGanadores from '../../src/Components/SectionGanadores'
import numeral from 'numeral'
import ProductImages from '../../src/Components/ProductImages'

const EntradaSorteo = ( { resultado, entidades, id } ) => {
  
  const [datosSorteo, setDatosSorteo] = useState([]);
  const { nombre, img, valorTicket } = resultado
  const { sorteos, pagoEnProceso } = useJupi()
  const [activo, setActivo] = useState(true);
  const moneda = numeral(valorTicket).format('$0,0');

  useEffect(() => {
    setDatosSorteo(sorteos.filter(sorteo => sorteo.id === id));
  }, [sorteos])

  useEffect(() => {
    if (datosSorteo.length > 0) {
      if (datosSorteo[0].participantes.length === datosSorteo[0].capacidad) {
        setActivo(false);
      } else {
        setActivo(true);
      }
      return;
    }
  }, [datosSorteo])
  

  return (
    <Layout
        pagina={nombre}
    >
      <main>
        <div className='py-4 bg-light'>
          <div className='container'>
            <h1 className='fs-1 fw-bold text-center py-2'>{`Rifa: ${nombre}`}</h1>
            <div className='row mb-5'>
              <div className='col-12 col-md-7 mb-4'>
                <div className='bg-white shadow-sm p-3'>
                  <div className='d-flex flex-column w-100'>
                    {/* Imagen */}
                    <div className='mx-auto'>
                      <ProductImages data={resultado} />
                    </div>
                    {/* Cuerpo */}
                    <ul className='m-3'>
                      {resultado.caracteristicas.map((caracteristica, index) => (
                        <li key={index}>{caracteristica}</li>
                      ))}
                    </ul>
                    <div>
                      <Progress data={datosSorteo[0]} />
                    </div>
                    <p className='text-decoration-underline fw-bold text-center mt-5'>Instrucciones de compra:</p>
                    <ol className='d-md-none'>
                      <li>Llena el formulario de <span className='fw-bold'>abajo.</span></li>
                      <li>Selecciona el método de pago de tu preferencia.</li>
                      <li>Elige la cantidad de tickets a comprar <span className='fw-bold'>(Entre mas tickets compres mayor probabilidad de ganar tienes).</span></li>
                      <li>Haz clic en el botón <span className='fw-bold'>PAGAR</span> y sigue las instrucciones.</li>
                      <li>El sorteo iniciara cuando se completen los cupos, por medio de una transmisión en vivo.</li>
                    </ol>
                    <ol className='d-none d-md-block'>
                      <li>Llena el formulario del lado <span className='fw-bold'>derecho.</span></li>
                      <li>Selecciona el método de pago de tu preferencia.</li>
                      <li>Elige la cantidad de tickets a comprar <span className='fw-bold'>(Entre mas tickets compres mayor probabilidad de ganar tienes).</span></li>
                      <li>Haz clic en el botón <span className='fw-bold'>PAGAR</span> y sigue las instrucciones.</li>
                      <li>El sorteo iniciara cuando se completen los cupos, por medio de una transmisión en vivo.</li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className='col-12 col-md-5' id='pagoEfecty'>
                <div className='bg-white shadow-sm p-3 rounded'>
                    {pagoEnProceso === false ? (
                      <>
                        <h4 className='text-center fw-bold'>COMPRAR</h4>
                        <div className={styles.description}>
                          <p className='fs-4'><span className='fw-bold'>Descripción de la compra: </span>{`Sorteo de ${nombre}`}</p>
                          <p className='fs-4'><span  className='fw-bold'>Precio: </span>{`${moneda} Pesos Colombianos`}</p>
                        </div>
                        {activo === true ? (
                          <FormSorteos id={id} valorTicket={valorTicket} entidades={entidades} datosSorteo={datosSorteo} />
                        ) : (
                          <div>
                            <p className='text-center fs-5 fw-bold'>Lo sentimos, los cupos del sorteo se han agotado.</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <PaymentProcess datos={datosSorteo} prod={'sorteo'} />
                    )}
                </div>
              </div>
            </div>
            <SectionGanadores />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default EntradaSorteo

export async function getServerSideProps( { params: {id} } ) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN
    }
  }
  const {data} = await axios.get('https://api.mercadopago.com/v1/payment_methods', config);
  const entidadesFiltradas = data.filter(method => method.payment_type_id === 'bank_transfer')
  const entidades = entidadesFiltradas[0].financial_institutions
  const docRef = doc(db, 'sorteos', id);
  const documento = await getDoc(docRef);
  const resultado = documento.data();

  if(documento.exists()) {
    console.log('Si existe el documento');
  } else {
    console.log('No existe el documento');
    return {
      redirect: {
        destination: '/#sorteos',
      }
    }
  }

  return {
    props: {
        resultado,
        entidades,
        id
    }
  }
  }