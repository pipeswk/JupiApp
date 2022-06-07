import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import styles from '../../styles/EntradaPronostico.module.css'

const FormSorteos = () => {

    const [metodo, setMetodo] = useState('');

    const formik = useFormik({
        initialValues: {
            nombre: '',
            email: '',
            telefono: '',
            method: '',
            telNequi: '',
            telDaviplata: '',
            cantidad: ''
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
            telNequi: Yup.string()
                .max(10, 'El numero de nequi no puede tener más de 10 caracteres')
                .min(10, 'El numero de nequi debe tener al menos 10 caracteres')
                .matches(/^[0-9]*$/, 'El numero de nequi solo puede contener números')
                .when('method', {
                    is: 'NEQUI',
                    then: Yup.string()
                        .required('El numero de nequi es obligatorio')
                }),
            telDaviplata: Yup.string()
            .max(10, 'El numero de Daviplata no puede tener más de 10 caracteres')
            .min(10, 'El numero de Daviplata debe tener al menos 10 caracteres')
            .matches(/^[0-9]*$/, 'El numero de Daviplata solo puede contener números')
            .when('method', {
                is: 'DAVIPLATA',
                then: Yup.string()
                    .required('El numero de Daviplata es obligatorio')
            }),
            cantidad: Yup.number()
                .required('La cantidad es obligatoria')
                .min(1, 'La cantidad debe ser mayor a 0')
                .max(50, 'La cantidad no puede ser mayor a 50')
        }),
        onSubmit: values => {
            enviarDatos(values);
        }
    })

    const enviarDatos = (values) => {
        console.log(values);
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
            <label htmlFor='telefono' className="form-label fw-bold">Telefono</label>
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
            {formik.touched.telefono && formik.errors.telefono ? (
                <div className="text-danger">{formik.errors.telefono}</div>
            ) : null}
            </div>
        </div>
        
        <p className='fw-bold'>Selecciona el metodo de pago (Disponible solo en Colombia):</p>
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
                <img src='/img/nequi.webp' className="img-fluid" alt="Logo Efecty"></img>
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
            id='DAVIPLATA'
            className={metodo === 'DAVIPLATA' ? styles.methodCard_Active : styles.methodCard_Desactive}
            onClick={(e) => {
                e.preventDefault();
                setMetodo('DAVIPLATA');
                formik.setFieldValue('method', 'DAVIPLATA');
            } }
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
                {formik.touched.telNequi && formik.errors.telNequi ? (
                    <div className="text-danger">{formik.errors.telNequi}</div>
                ) : null}
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

        {metodo === 'DAVIPLATA' && (
            <>
            <div className={styles.badge}>
                <p>Recibiras una notificacion en tu celular para realizar el pago con tu saldo de DAVIPLATA</p>
            </div>
            <div className="mb-3">
                <label htmlFor='telDaviplata' className="form-label fw-bold">Numero de Daviplata:</label>
                <div className="input-group mb-3">
                    <span className="input-group-text" id="inputGroup-sizing-sm">+57</span>
                    <input
                        type="tel"
                        id='telDaviplata'
                        name='telDaviplata'
                        className="form-control"
                        placeholder='Ej: 3153315875'
                        value={formik.values.telDaviplata}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.telDaviplata && formik.errors.telDaviplata ? (
                        <div className="text-danger">{formik.errors.telDaviplata}</div>
                    ) : null}
                </div>
            </div>
            </>
        )}

        <div className="mb-3">
            <label htmlFor='cantidad' className="form-label fw-bold">Cantidad</label>
            <input
                type="number"
                id='cantidad'
                name='cantidad'
                className="form-control"
                placeholder='Cantidad de tickets a comprar'
                min={1}
                value={formik.values.cantidad}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.cantidad && formik.errors.cantidad ? (
                <div className="text-danger">{formik.errors.cantidad}</div>
            ) : null}
        </div>
        {/* <div className={styles.description}>
            <p className='fs-4'><span className='fw-bold'>Resumen: </span>{`${cantidad} Ticket/s`}</p>
            <p className='fs-4'><span  className='fw-bold'>Total a pagar: </span>{totalPagar}</p>
        </div> */}
        <button type='submit' className="btn btn-primary w-100 mt-5 fw-bold">PAGAR</button>
    </form>
  )
}

export default FormSorteos