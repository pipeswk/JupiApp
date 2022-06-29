import { useState, useEffect } from 'react'
import Image from 'next/image'
import Layout from '../../src/Layout/Layout'
import styles from '../../styles/EntradaPronostico.module.css'
import { db } from '../../utils/Firebase'
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import FormPronosticos from '../../src/Components/FormPronosticos'
import CountDown from '../../src/Components/CountDown'
import useJupi from '../../src/Hooks/useJupi'
import PaymentProcess from '../../src/Components/PaymentProcess'

const EntradaPronostico = ( { resultado, id } ) => {

  const [cuota, setCuota] = useState('');
  const [transaction, setTransaction] = useState({});


  const { nombre, descripcion, img, sorteo, valorTicket } = resultado
  const { pagoEnProceso, refPago } = useJupi();
  const moneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valorTicket);


  const operacionCuota = () => {
    if(descripcion.tipo === 'Simple') {
      return 'Reservada'
    } else {
      return descripcion.cuota
    }
  }

  useEffect(() => {
    const restriccion = operacionCuota();
    setCuota(restriccion);
  }, [])

  const obtenerTransaccion = async () => {
    const unsub = onSnapshot(doc(db, "transactions", refPago), (doc) => {
      setTransaction(doc.data());
  });
  }
  
  useEffect(() => {
    if (refPago !== '') {
      obtenerTransaccion();
    }
  }, [refPago])
  


  return (
    <Layout
        pagina={nombre}
    >
      <main>
        <div className='py-4 bg-light'>
          <div className='container'>
            <h1 className='fs-1 fw-bold text-center py-2'>{`Pronostico: ${nombre}`}</h1>
            <div className='row'>
              <div className='col-12 col-md-7 mb-4'>
                <div className='bg-white shadow-sm p-3'>
                  <div className='d-flex flex-column w-100'>
                    {sorteo && (
                      <p className={styles.badge}>Este pronostico incluye sorteo</p>
                    )}
                    {/* Imagen */}
                    <div className='mx-auto'>
                      <Image
                        src={img}
                        width={400}
                        height={300}
                        // layout='responsive'
                        alt={nombre}
                        className='rounded mx-auto'  
                      />
                    </div>
                    {/* Cuerpo */}

                    <div>
                      <div className='container'>
                        <p className='text-center fs-5 fw-bold'>El pronostico se cerrara en</p>
                        <CountDown />
                        <div className='row mt-4'>
                          <div className='col-12 col-md-6'>
                            <p className='text-center fw-bold fs-5'>Descripcion del pronostico:</p>
                            <div className='mt-3 p-md-3'>
                            <p className={styles.parrafo}><span className='fw-bold'>Cuota: </span>{cuota}</p>
                            <p className={styles.parrafo}><span className='fw-bold'>Stake: </span>{descripcion.stake}</p>
                            <p className={styles.parrafo}><span className='fw-bold'>Tipo: </span>{descripcion.tipo}</p>
                          </div>
                          </div>
                          <div className='col-12 col-md-6 p-3'>
                            <div>
                              <Image src='/img/Sorteo.gif' width={350} height={550} alt='logo-bet' className='img-fluid rounded-3' />
                            </div>
                            <p className='text-decoration-underline fw-bold'>Instrucciones de compra:</p>
                            <ol className='d-md-none'>
                              <li>Llena el formulario de <span className='fw-bold'>abajo</span></li>
                              <li>Elige el sorteo al que deseas participar con tu compra <span className='fw-bold'>(Incluido)</span></li>
                              <li>Selecciona el metodo de pago de tu preferencia</li>
                              <li>Haz clic en el boton "PAGAR" y sigue las instrucciones</li>
                            </ol>
                            <ol className='d-none d-md-block'>
                              <li>Llena el formulario del lado <span className='fw-bold'>derecho</span></li>
                              <li>Elige el sorteo al que deseas participar con tu compra <span className='fw-bold'>(Incluido)</span></li>
                              <li>Selecciona el metodo de pago de tu preferencia</li>
                              <li>Haz clic en el boton "PAGAR" y sigue las instrucciones</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              <div className='col-12 col-md-5'>
                <div className='bg-white shadow-sm p-3 rounded'>
                    {pagoEnProceso === false ? (
                      <>
                        <h4 className='text-center fw-bold'>COMPRAR</h4>
                        <div className={styles.description}>
                          <p className='fs-4'><span className='fw-bold'>Descripción de la compra: </span>{sorteo ? (
                            `Pronostico + Sorteo Elegido`
                          ) : (
                            'Pronostico'
                          )}</p>
                          {/* //TODO: validar precio a nivel del servidor */}
                          <p className='fs-4'><span  className='fw-bold'>Precio: </span>{moneda}</p>
                        </div>
                        <FormPronosticos moneda={moneda} id={id} />
                      </>
                    ) : (
                      <PaymentProcess datos={transaction} prod={'pronostico'} />
                    )}
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

export async function getServerSideProps( { params: {id} } ) {
  const docRef = doc(db, 'pronosticos', id);
  const documento = await getDoc(docRef);
  const resultado = documento.data();

  if(documento.exists()) {
    console.log('Si existe', documento.data());
  } else {
    console.log('No existe el documento');
    return {
      redirect: {
        destination: '/pronosticos',
      }
    }
  }

  return {
    props: {
        resultado,
        id
    }
}
}