import React from 'react'
import Spinner from './Spinner';
import styles from '../../styles/StatusPse.module.css'

const StatusPse = ( { data } ) => {

    const { tipoCompra, statusTransaccion } = data;
    let status;
    if (statusTransaccion === true) {
        status = 'Aprobada'
    } else {
        status = 'Rechazada'
    }

  return (
    <div className='container'>
        <div className='bg-white my-5 rounded shadow-sm p-4'>
            {statusTransaccion === true ? (
                <>
                    <div className='d-flex justify-content-center'>
                        <p className='text-success fw-bold fs-3 my-4 text-center'>{`Tu transacción ha sido ${status}`}</p>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="bi bi-check-circle-fill text-success mb-5" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                    </div>
                    <p className='text-center fw-bold'>{`Los datos del ${tipoCompra} han sido enviados a tu whatsapp. Gracias por tu compra.`}</p>
                    <span>En caso de que no recibas el mensaje en tu Whatsapp por favor revisa tu bandeja de mensajes de texto (SMS).</span>
                </>
            ) : (
                <>
                   <div className='d-flex justify-content-center'>
                        <p className={`${styles.confirmando} fw-bold fs-3 my-4 text-center`}>Estamos confirmando el pago</p>
                    </div>
                    <div className='d-flex justify-content-center my-5'>
                        <Spinner />
                    </div>
                    <p className='text-center fw-bold'>Por favor espera un momento mientras confirmamos tu pago, esta operación puede durar unos minutos...</p> 
                </>
            )}
        </div>
    </div>
  )
}

export default StatusPse