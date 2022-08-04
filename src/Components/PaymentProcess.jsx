import { useEffect, useState } from 'react'
import Link from 'next/link'
import useJupi from '../Hooks/useJupi'
import Spinner from './Spinner';

const PaymentProcess = ( { datos, prod } ) => {
  const [pagoConfirmado, setPagoConfirmado] = useState(false);
  const { paymentMethod, refPago, efecty } = useJupi();

  const validarProducto = () => {
    if (prod === 'sorteo') {
      return true;
    }
  }

  useEffect(() => {
    const validador = validarProducto();
    if (validador === true) {
      if (datos[0]?.participantes.includes(`${refPago}-0`)) {
        setPagoConfirmado(true);
      } else {
        setPagoConfirmado(false);
      }
    } else {
      if (datos?.statusTransaccion === true) {
        setPagoConfirmado(true);
      } else {
        setPagoConfirmado(false);
      }
    }
  }, [datos])
  

  return (
    <>
      {paymentMethod === 'NEQUI' ? (
        <div id='pagoNequi'>
          {pagoConfirmado === false ? (
            <h1 className='text-center my-4'>Completa la transacción</h1>
          ) : (
            <h1 className='text-center my-4 fw-bold text-success'>Pago confirmado</h1>
          )}
          {pagoConfirmado || (<p className='text-center'>{`Elegiste ${paymentMethod} como metodo de pago`}</p>)}
          <div className='d-flex justify-content-center my-5'>
            {pagoConfirmado === false ? (
              <Spinner />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
              </>
            )}
          </div>
          {pagoConfirmado === false ? (
            <p className='text-center'>Por favor completa el pago desde tu App de Nequi para finalizar tu compra</p>
          ) : (
            <p className='text-center fw-bold'>Gracias por tu pago. Tu ticket del sorteo y confirmación de compra se han enviado a tu whatsapp (En caso de que no llegue el mensaje a whatsapp, revise sus SMS).</p>
          )}
        </div>
      ) : paymentMethod === 'EFECTY' ? (
        <div>
          {pagoConfirmado === false ? (
            <h1 className='text-center my-4'>Completa la transacción</h1>
          ) : (
            <h1 className='text-center my-4 fw-bold text-success'>Pago confirmado</h1>
          )}
          {pagoConfirmado || (<p className='text-center'>{`Elegiste ${paymentMethod} como metodo de pago`}</p>)}
          <div className='d-flex justify-content-center my-5'>
            {pagoConfirmado === false ? (
              <Spinner />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="bi bi-check-circle-fill text-success" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
              </>
            )}
          </div>
          {pagoConfirmado === false ? (
            <>
              <p className='text-center'>Por favor completa el pago en un corresponsal de Efecty con los siguientes datos:</p>
              <p className='text-center'><span className='fw-bold'>Numero de convenio: </span>{efecty?.convenio}</p>
              <p className='text-center'><span className='fw-bold'>Numero de pago: </span>{efecty?.noPago}</p>
              <Link href={efecty?.link}>
                <a target='_blank'><p className='text-center text-decoration-underline text-primary'>Ver instrucciones de pago</p></a>
              </Link>
            </>
          ) : (
            <p className='text-center fw-bold'>Gracias por tu pago. Tu ticket del sorteo y confirmación de compra se han enviado a tu whatsapp (En caso de que no llegue el mensaje a whatsapp, revise sus SMS).</p>
          )}
        </div>
      ) : (
        <div>PSE</div>
      )}
    </>
  )
}

export default PaymentProcess