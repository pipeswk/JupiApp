import { useState } from 'react'
import Image from 'next/image'
import useJupi from '../../src/Hooks/useJupi'
import Layout from '../../src/Layout/Layout'
import styles from '../../styles/EntradaPronostico.module.css'

const EntradaPronostico = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [premio, setPremio] = useState('');
  const [metodo, setMetodo] = useState('');
  const [numNequi, setNumNequi] = useState('')

  const { pronosticoActual } = useJupi();

  const { nombre, categoria, img, sorteo, valorTicket } = pronosticoActual
  const moneda = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(valorTicket)

  //TODO: La carga de informacion debe ser por consulta a la API

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({
      name,
      email,
      telefono,
      premio,
      metodo,
      numNequi
    })
  }


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

                    <p>Ipsum qui dolore occaecat culpa et exercitation exercitation quis Lorem non eu labore ex non. Consequat ea labore laboris in consectetur et proident voluptate do. Sunt ullamco aliquip eiusmod aliqua ad exercitation aute culpa ea fugiat voluptate cupidatat magna eiusmod.</p>

                  </div>
                </div>
              </div>
              <div className='col-12 col-md-5'>
                <div className='bg-white shadow-sm p-3 rounded'>
                    <h4 className='text-center'>COMPRAR</h4>
                    <div className={styles.description}>
                      <p><span className='fw-bold'>Descripción de la compra: </span>{sorteo ? (
                        `Pronostico + sorteo elegido`
                      ) : (
                        'Pronostico'
                      )}</p>
                      {/* //TODO: validar precio a nivel del servidor */}
                      <p><span  className='fw-bold'>Precio: </span>{moneda}</p>
                      <p>Una vez completada la compra se enviara el pronostico y el ticket del sorteo al correo especificado.</p>
                    </div>
                    <form
                      onSubmit={handleSubmit}
                    >
                      <div className="mb-3">
                        <label htmlFor='nombre' className="form-label fw-bold">Nombre completo</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nombre"
                          placeholder="Ej: Andres Rojas"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor='email' className="form-label fw-bold">Email</label>
                        <input
                          type="email" 
                          className="form-control" 
                          id="email" 
                          placeholder="Ej: correo@correo.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor='telefono' className="form-label fw-bold">Telefono</label>
                        <div className="input-group mb-3">
                          <span className="input-group-text" id="inputGroup-sizing-sm">+57</span>
                          <input
                            type="tel"
                            id='telefono'
                            className="form-control"
                            placeholder='Ej: 3153315875'
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor='sorteo' className="form-label fw-bold">Elige el sorteo en el que desea participar</label>
                        <select className="form-select" id="sorteo">
                          <option selected>--Seleccionar--</option>
                          {/* //TODO: Mapear disponibles */}
                          <option value=""></option>
                        </select>
                      </div>
                      
                      <p className='fw-bold'>Selecciona el metodo de pago (Disponible solo en Colombia):</p>
                      <div className={styles.pagos}>
                        <div
                          id='NEQUI'
                          className={metodo === 'NEQUI' ? styles.methodCard_Active : styles.methodCard_Desactive}
                          onClick={() => setMetodo('NEQUI')}
                        >
                          <img src='/img/nequi.webp' className="img-fluid" alt="Logo Nequi"></img>
                        </div>
                        <div
                          id='EFECTY'
                          className={metodo === 'EFECTY' ? styles.methodCard_Active : styles.methodCard_Desactive}
                          onClick={() => setMetodo('EFECTY')}
                        >
                          <img src='/img/efecty.png' className="img-fluid" alt="Logo Efecty"></img>
                        </div>
                        <div
                          id='DAVIPLATA'
                          className={metodo === 'DAVIPLATA' ? styles.methodCard_Active : styles.methodCard_Desactive}
                          onClick={() => setMetodo('DAVIPLATA')}
                        >
                          <img src='/img/Daviplata.png' className="img-fluid" alt="Logo Efecty"></img>
                        </div>
                      </div>
                      {metodo === 'NEQUI' && (
                        <>
                          <div className={styles.badge}>
                            <p>Recibiras una notificacion en tu celular para realizar el pago con tu saldo de NEQUI</p>
                          </div>
                          <div className="mb-3">
                            <label htmlFor='telnequi' className="form-label">Numero de NEQUI:</label>
                            <div className="input-group mb-3">
                              <span className="input-group-text" id="inputGroup-sizing-sm">+57</span>
                              <input
                                type="tel"
                                id='telnequi'
                                className="form-control"
                                placeholder='Ej: 3153315875'
                                value={numNequi}
                                onChange={(e) => setNumNequi(e.target.value)}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      {metodo === 'EFECTY' && (
                        <>
                          <div className={styles.badge}>
                            <p>Obtendras un codigo que debes entregar al cajero en EFECTY para terminar tu pago</p>
                          </div>
                        </>
                      )}

                      {/* //TODO: Falta el condicional de Daviplata */}
                      

                      <button type='submit' className="btn btn-primary w-100 mt-5 fw-bold">PAGAR</button>
                    </form>
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