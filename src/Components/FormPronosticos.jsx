import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup';
import styles from '../../styles/EntradaPronostico.module.css'
import useJupi from '../Hooks/useJupi';

const FormPronosticos = ( { moneda, entidades, id } ) => {


    const [metodo, setMetodo] = useState('');

    const { sorteos, pagar } = useJupi();

    const formik = useFormik({
        initialValues: {
            nombre: '',
            email: '',
            telefono: '',
            sorteo: '',
            method: '',
            telNequi: '',
            tipoDocumento: 'CC',
            noDocumento: '',
            idProdComprado: id
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
            sorteo: Yup.string()
                .required('El sorteo es obligatorio'),
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
        }),
        onSubmit: values => {
            enviarDatos(values);
        }
    })

    const enviarDatos = (values) => {
        pagar(values, 'pronostico');
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
            </div>
            {formik.touched.telefono && formik.errors.telefono ? (
                <div className="text-danger">{formik.errors.telefono}</div>
            ) : null}
        </div>

        <div className="mb-3">
            <label htmlFor='sorteo' className="form-label fw-bold">Elige un sorteo en el que desees participar:</label>
            <div className="input-group mb-3">
                <select
                    className="form-control"
                    id='sorteo'
                    name='sorteo'
                    value={formik.values.sorteo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                >
                    <option value="">--Elige un sorteo--</option>
                    {sorteos.filter(sorteo => sorteo.onPronosticos === true).map(sorteo => (
                        <option key={sorteo.id} value={sorteo.id}>{sorteo.nombre}</option>
                    ))}
                </select>
            </div>
            {formik.touched.sorteo && formik.errors.sorteo ? (
                <div className="text-danger">{formik.errors.sorteo}</div>
            ) : null}
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
                <p>Obtendras un codigo que debes entregar al cajero en EFECTY para terminar tu pago</p>
            </div>
            </>
        )}

        {metodo === 'PSE' && (
            <>
                <div className={styles.badge}>
                    <p>Recibiras una notificacion en tu celular para realizar el pago con tu saldo de PSE</p>
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
                            placeholder='Ej: 1023943857'
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
            <p className='fs-4'><span className='fw-bold'>Resumen: </span>Pronostico deportivo</p>
            <p className='fs-4'><span  className='fw-bold'>Total a pagar: </span>{moneda}</p>
        </div>
        <button type='submit' className="btn btn-primary w-100 mt-5 fw-bold">PAGAR</button>
    </form>
  )
}

export default FormPronosticos