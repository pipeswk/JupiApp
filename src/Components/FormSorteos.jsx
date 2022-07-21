import { useState } from 'react'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import styles from '../../styles/EntradaPronostico.module.css'
import useJupi from '../Hooks/useJupi';

const FormSorteos = ( { valorTicket, id, entidades } ) => {

    const [metodo, setMetodo] = useState('');
    const [cantidad, setCantidad] = useState('1');
    const [cargando, setCargando] = useState(false);
    const { pagar } = useJupi();
    const totalPagar = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(cantidad * valorTicket);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            idSorteo: id,
            nombre: '',
            email: '',
            telefono: '',
            method: '',
            telNequi: '',
            tipoDocumento: 'CC',
            noDocumento: '',
            cantidad: '1',
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
            }),
            cantidad: Yup.number()
                .required('La cantidad es obligatoria')
                .min(1, 'La cantidad debe ser mayor a 0')
                .max(50, 'La cantidad no puede ser mayor a 50')
        }),
        onSubmit: values => {
            if (metodo === 'NEQUI') {
                router.push(`/sorteos/${id}#pagoNequi`);
                setCargando(true);
                enviarDatos(values);
            } else if (metodo === 'EFECTY') {
                setCargando(true);
                enviarDatos(values);
                router.push(`/sorteos/${id}#pagoEfecty`);
            } else {
                setCargando(true);
                enviarDatos(values);
            }
        }
    })

    const enviarDatos = (values) => {
        pagar(values, 'sorteo');
    }

  return (
    <form onSubmit={formik.handleSubmit}>
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
            <label htmlFor='telefono' className="form-label fw-bold">Teléfono</label>
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

        <div className="mb-3">
            <label htmlFor='cantidad' className="form-label fw-bold">Cantidad de tickets a comprar:</label>
            <input
                type="number"
                id='cantidad'
                name='cantidad'
                className="form-control"
                placeholder='Cantidad de tickets a comprar'
                min={1}
                value={formik.values.cantidad}
                onChange={(e) => {
                    formik.setFieldValue('cantidad', e.target.value);
                    setCantidad(e.target.value);

                }}
                onBlur={formik.handleBlur}
            />
            {formik.touched.cantidad && formik.errors.cantidad ? (
                <div className="text-danger">{formik.errors.cantidad}</div>
            ) : null}
        </div>
        <div className={styles.description}>
            <p className='fs-4'><span className='fw-bold'>Resumen: </span>{`${cantidad} Ticket/s`}</p>
            <p className='fs-4'><span  className='fw-bold'>Total a pagar: </span>{totalPagar}</p>
        </div>
        <p>Al hacer clic en el botón "PAGAR" aceptas nuestros <span className='alert-link text-primary'>Términos y Condiciones</span></p>
        {cargando === false ? (
            <button type='submit' className="btn btn-primary w-100 mt-5 fw-bold">PAGAR</button>
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