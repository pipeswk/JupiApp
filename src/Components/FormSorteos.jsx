import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import TiktokPixel from 'tiktok-pixel'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import styles from '../../styles/EntradaPronostico.module.css'
import useJupi from '../Hooks/useJupi';
import numeral from 'numeral';
import LottoSelect from './LottoSelect';
import * as fbq from '../../lib/fpixel';

const FormSorteos = ( { valorTicket, id, entidades, datosSorteo } ) => {

    const [metodo, setMetodo] = useState('');
    const [cantidad, setCantidad] = useState(0);
    const [cargando, setCargando] = useState(false);
    const { pagar, checkoutId, setCheckoutId, lottos } = useJupi();
    const totalPagar = numeral(cantidad * valorTicket).format('$0,0');
    const router = useRouter();

    useEffect(() => {
        function makeid(length) {
            let result = '';
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
            }
            return result;
        }
        setCheckoutId(makeid(35));
    }, [])

    useEffect(() => {
      setCantidad(lottos.length);
    }, [lottos])
    
    

    const formik = useFormik({
        initialValues: {
            idSorteo: id,
            nombre: '',
            email: '',
            telefono: '',
            method: '',
            telNequi: '',
            tipoDocumento: 'CC',
            noDocumento: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required('El nombre es obligatorio')
                .max(50, 'El nombre no puede tener más de 50 caracteres')
                .min(3, 'El nombre debe tener al menos 3 caracteres'),
            email: Yup.string()
                .email('El email no es válido')
                .required('El email es obligatorio')
                .max(50, 'El email no puede tener más de 50 caracteres')
                .min(3, 'El email debe tener al menos 3 caracteres'),
            telefono: Yup.string()
                .required('El teléfono es obligatorio')
                .max(10, 'El teléfono no puede tener más de 10 caracteres')
                .min(10, 'El teléfono debe tener al menos 10 caracteres')
                .matches(/^[0-9]*$/, 'El teléfono solo puede contener números'),
            method: Yup.string()
                .required('El método de pago es obligatorio'),
            telNequi: Yup.string()
                .max(10, 'El numero de nequi no puede tener más de 10 caracteres')
                .min(10, 'El numero de nequi debe tener al menos 10 caracteres')
                .matches(/^[0-9]*$/, 'El numero de nequi solo puede contener números')
                .when('method', {
                    is: 'NEQUI',
                    then: Yup.string()
                        .required('El numero de nequi es obligatorio')
                }),
            noDocumento: Yup.string()
            .max(10, 'El numero de documento no puede tener más de 10 caracteres')
            .min(6, 'El numero de documento debe tener al menos 6 caracteres')
            .matches(/^[0-9]*$/, 'El numero de documento solo puede contener números')
            .when('method', {
                is: 'PSE',
                then: Yup.string()
                    .required('El numero de documento es obligatorio')
            }),
            entidad: Yup.string()
            .when('method', {
                is: 'PSE',
                then: Yup.string()
                    .required('La entidad es obligatoria')
            })
        }),
        onSubmit: values => {
            if (metodo === 'NEQUI') {
                setCargando(true);
                fbq.event('Purchase', { currency: 'COP', value: cantidad * valorTicket });
                TiktokPixel.track('CompletePayment', {
                    content_name: datosSorteo.nombre,
                    content_category: datosSorteo.categoria,
                    content_ids: [id],
                    content_type: 'product',
                    value: cantidad * valorTicket,
                    currency: 'COP',
                    quantity: cantidad,
                });
                enviarDatos({
                    ...values,
                    cantidad: cantidad,
                    checkoutId: checkoutId,
                    lottos: lottos
                });
            } else if (metodo === 'EFECTY') {
                setCargando(true);
                fbq.event('Purchase', { currency: 'COP', value: cantidad * valorTicket });
                TiktokPixel.track('CompletePayment', {
                    content_name: datosSorteo.nombre,
                    content_category: datosSorteo.categoria,
                    content_ids: [id],
                    content_type: 'product',
                    value: cantidad * valorTicket,
                    currency: 'COP',
                    quantity: cantidad,
                });
                enviarDatos({
                    ...values,
                    cantidad: cantidad,
                    checkoutId: checkoutId,
                    lottos: lottos
                });
            } else {
                setCargando(true);
                fbq.event('Purchase', { currency: 'COP', value: cantidad * valorTicket });
                TiktokPixel.track('CompletePayment', {
                    content_name: datosSorteo.nombre,
                    content_category: datosSorteo.categoria,
                    content_ids: [id],
                    content_type: 'product',
                    value: cantidad * valorTicket,
                    currency: 'COP',
                    quantity: cantidad,
                });
                enviarDatos({
                    ...values,
                    cantidad: cantidad,
                    checkoutId: checkoutId,
                    lottos: lottos
                });
            }
        }
    })

    const enviarDatos = async (values) => {
        await pagar(values, 'sorteo');
        router.push(`/sorteos/${id}#pagoEfecty`);
    }

  return (
    <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
            <label htmlFor='cantidad' className="form-label fw-bold">Selecciona los números con los que deseas participar:</label>
            <LottoSelect
                datosSorteo={datosSorteo}
                idSorteo={id}
            />
        </div>
        <div className="mb-3">
            <label htmlFor='nombre' className="form-label fw-bold">Nombre completo</label>
            <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                placeholder="Ej: Andres Rojas"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onClick={() => {
                    fbq.event('initiateCheckout', {
                        content_name: 'Sorteo',
                        content_category: 'Sorteo',
                        content_ids: [id],
                        content_type: 'product',
                        value: cantidad * valorTicket,
                        currency: 'COP',
                        num_items: cantidad,
                    });
                    TiktokPixel.track('InitiateCheckout', {
                        content_name: datosSorteo.nombre,
                        content_category: datosSorteo.categoria,
                        content_ids: [id],
                        content_type: 'product',
                        value: cantidad * valorTicket,
                        currency: 'COP'
                    });
                }}
                onBlur={formik.handleBlur}
            />
            {formik.touched.nombre && formik.errors.nombre ? (
                <div className="text-danger">{formik.errors.nombre}</div>
            ) : null}
        </div>

        <div className="mb-3">
            <label htmlFor='email' className="form-label fw-bold">Email</label>
            <input
                type="email" 
                className="form-control" 
                id="email" 
                name="email"
                placeholder="Ej: correo@correo.com" 
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
                <div className="text-danger">{formik.errors.email}</div>
            ) : null}
        </div>

        <div className="mb-3">
            <label htmlFor='telefono' className="form-label fw-bold">Teléfono Whatsapp (Recibirás tu ticket al whatsapp)</label>
            <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-sm">+57</span>
            <input
                type="tel"
                id='telefono'
                name='telefono'
                className="form-control"
                placeholder='Ej: 3153315875'
                value={formik.values.telefono}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            </div>
            {formik.touched.telefono && formik.errors.telefono ? (
                <div className="text-danger">{formik.errors.telefono}</div>
            ) : null}
        </div>
        
        <p className='fw-bold'>Selecciona el método de pago (Disponible solo en Colombia):</p>
        <div className={styles.pagos}>
            
            <div
            id='NEQUI'
            className={metodo === 'NEQUI' ? styles.methodCard_Active : styles.methodCard_Desactive}
            onClick={(e) => {
                e.preventDefault();
                setMetodo('NEQUI');
                fbq.event('AddPaymentInfo', {
                    content_name: 'Sorteo',
                    content_category: 'Sorteo',
                    content_ids: [id],
                    content_type: 'product',
                    value: cantidad * valorTicket,
                    currency: 'COP',
                    num_items: cantidad,
                    method: 'NEQUI'
                });
                TiktokPixel.track('AddPaymentInfo');
                formik.setFieldValue('method', 'NEQUI');
            } }
            >
                <img src='/img/nequi.webp' className="img-fluid" alt="Logo Nequi"></img>
            </div>

            <div
            id='EFECTY'
            className={metodo === 'EFECTY' ? styles.methodCard_Active : styles.methodCard_Desactive}
            onClick={(e) => {
                e.preventDefault();
                setMetodo('EFECTY');
                fbq.event('AddPaymentInfo', {
                    content_name: 'Sorteo',
                    content_category: 'Sorteo',
                    content_ids: [id],
                    content_type: 'product',
                    value: cantidad * valorTicket,
                    currency: 'COP',
                    num_items: cantidad,
                    method: 'EFECTY'
                });
                TiktokPixel.track('AddPaymentInfo');
                formik.setFieldValue('method', 'EFECTY');
            } }
            >
                <img src='/img/efecty.png' className="img-fluid" alt="Logo Efecty"></img>
            </div>

            <div
            id='PSE'
            className={metodo === 'PSE' ? styles.methodCard_Active : styles.methodCard_Desactive}
            onClick={(e) => {
                e.preventDefault();
                setMetodo('PSE');
                fbq.event('AddPaymentInfo', {
                    content_name: 'Sorteo',
                    content_category: 'Sorteo',
                    content_ids: [id],
                    content_type: 'product',
                    value: cantidad * valorTicket,
                    currency: 'COP',
                    num_items: cantidad,
                    method: 'PSE'
                });
                TiktokPixel.track('AddPaymentInfo');
                formik.setFieldValue('method', 'PSE');
            } }
            >
                <img src='/img/logo-pse-300x300.png' className="img-fluid" alt="Logo PSE"></img>
            </div>

        </div>
        {formik.touched.method && formik.errors.method ? (
                <div className="text-danger">{formik.errors.method}</div>
            ) : null}
        {metodo === 'NEQUI' && (
            <>
            <div className={styles.badge}>
                <p>Recibirás una notificación en tu celular para realizar el pago con tu saldo de NEQUI</p>
            </div>
            <div className="mb-3">
                <label htmlFor='telnequi' className="form-label fw-bold">Numero de NEQUI:</label>
                <div className="input-group mb-3">
                <span className="input-group-text" id="inputGroup-sizing-sm">+57</span>
                <input
                    type="tel"
                    id='telnequi'
                    name='telNequi'
                    className="form-control"
                    placeholder='Ej: 3153315875'
                    value={formik.values.telNequi}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                </div>
                {formik.touched.telNequi && formik.errors.telNequi ? (
                    <div className="text-danger">{formik.errors.telNequi}</div>
                ) : null}
            </div>
            </>
        )}
        {metodo === 'EFECTY' && (
            <>
            <div className={styles.badge}>
                <p>Obtendrás un código que debes entregar al cajero en EFECTY para terminar tu pago</p>
            </div>
            </>
        )}

        {metodo === 'PSE' && (
            <>
            <div className={styles.badge}>
                <p>Se te redireccionara a la pagina oficial del banco que selecciones para completar la transacción.</p>
            </div>
            <div className="mb-3">
                <label htmlFor='noDocumento' className="form-label fw-bold">Numero de documento de identidad:</label>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">C.C</span>
                    <input
                        type="number"
                        id='noDocumento'
                        name='noDocumento'
                        className="form-control"
                        placeholder='Ej: 1023943785'
                        value={formik.values.noDocumento}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
                {formik.touched.noDocumento && formik.errors.noDocumento ? (
                        <div className="text-danger">{formik.errors.noDocumento}</div>
                    ) : null}
            </div>

            <div className="mb-3">
                <label htmlFor='entidad' className="form-label fw-bold">Seleccione su banco</label>
                <div className="input-group mb-3">
                    <select
                        className="form-control"
                        id='entidad'
                        name='entidad'
                        value={formik.values.entidad}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value=''>--Elige una entidad--</option>
                        {entidades.map(entidad => (
                            <option key={entidad.id} value={entidad.id}>{entidad.description}</option>
                        ))}
                    </select>
                </div>
                {formik.touched.entidad && formik.errors.entidad ? (
                    <div className="text-danger">{formik.errors.entidad}</div>
                ) : null}
            </div>
            </>
        )}
        <div className={styles.description}>
            <p className='fs-4'><span className='fw-bold'>Resumen: </span>{`${cantidad} Ticket/s`}</p>
            <div className='d-flex'>
                {lottos.map((lotto, index) => (
                    <p key={index} className='fs-8'>{`${lotto}, `}</p>
                ))}
            </div>
            <p className='fs-4'><span  className='fw-bold'>Total a pagar: </span>
            {cantidad > 0 ? (
                totalPagar
            ) : (
                'Seleccione al menos un número de rifa'
            )}
            </p>
        </div>
        {/* <p>Al hacer clic en el botón "PAGAR" aceptas nuestros <Link href='/terminosycondiciones'><a className='alert-link text-primary'>Términos y Condiciones</a></Link></p> */}
        {cargando === false ? (
            cantidad > 0 ? (
                <button type='submit' className="btn btn-primary w-100 mt-5 fw-bold">PAGAR</button>
            ) : (
                <button type='button' className="btn btn-primary w-100 mt-5 fw-bold" disabled>Seleccione al menos un numero de rifa</button>
            )
        ) : (
            <button className="btn btn-primary w-100 mt-5 fw-bold" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {` Cargando...`}
            </button>
        )}
    </form>
  )
}

export default FormSorteos