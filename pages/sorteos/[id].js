import { useState } from 'react'
import Image from 'next/image'
import Layout from '../../src/Layout/Layout'
import styles from '../../styles/EntradaPronostico.module.css'
import { db } from '../../utils/Firebase'
import { doc, getDoc } from "firebase/firestore";
import FormSorteos from '../../src/Components/FormSorteos'

const EntradaSorteo = ( { resultado, id } ) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [metodo, setMetodo] = useState('');
    const [numNequi, setNumNequi] = useState('');
    const [cantidad, setCantidad] = useState('1');
  
    const { nombre, categoria, img, nuevo, valorTicket } = resultado
    const moneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valorTicket);
    const totalPagar = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cantidad * valorTicket);
  
  
    const handleSubmit = (e) => {
      e.preventDefault()
      console.log({
        name,
        email,
        telefono,
        metodo,
        numNequi,
        id
      })
    }
  
  
    return (
      <Layout
          pagina={nombre}
      >
        <main>
          <div className='py-4 bg-light'>
            <div className='container'>
              <h1 className='fs-1 fw-bold text-center py-2'>{`Sorteo: ${nombre}`}</h1>
              <div className='row'>
                <div className='col-12 col-md-7 mb-4'>
                  <div className='bg-white shadow-sm p-3'>
                    <div className='d-flex flex-column w-100'>
                      {/* Imagen */}
                      <div className='mx-auto'>
                        <Image
                          src={img}
                          width={400}
                          height={400}
                          // layout='responsive'
                          alt={nombre}
                          className='rounded mx-auto img-fluid'  
                        />
                      </div>
                      {/* Cuerpo */}
  
                      <p>Ipsum qui dolore occaecat culpa et exercitation exercitation quis Lorem non eu labore ex non. Consequat ea labore laboris in consectetur et proident voluptate do. Sunt ullamco aliquip eiusmod aliqua ad exercitation aute culpa ea fugiat voluptate cupidatat magna eiusmod.</p>
  
                    </div>
                  </div>
                </div>
                <div className='col-12 col-md-5'>
                  <div className='bg-white shadow-sm p-3 rounded'>
                      <h4 className='text-center fw-bold'>COMPRAR</h4>
                      <div className={styles.description}>
                        <p className='fs-4'><span className='fw-bold'>Descripción de la compra: </span>{`Sorteo de bajo costo: ${nombre}`}</p>
                        {/* //TODO: validar precio a nivel del servidor */}
                        <p className='fs-4'><span  className='fw-bold'>Precio: </span>{moneda}</p>
                      </div>
                      <FormSorteos />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    )
}

export default EntradaSorteo

export async function getServerSideProps( { params: {id} } ) {
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
          id
      }
  }
  }