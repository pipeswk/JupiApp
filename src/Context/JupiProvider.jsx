import { createContext, useState, useEffect } from 'react';
import { collection, query, addDoc, updateDoc, onSnapshot, orderBy, doc } from "firebase/firestore";
import { db } from '../../utils/Firebase';
import axios from 'axios';


const JupiContext = createContext();

const JupiProvider = ( { children } ) => {

    const [pronosticoActual, setpronosticoActual] = useState({});
    const [sorteoActual, setSorteoActual] = useState({});
    const [pronosticos, setPronosticos] = useState([]);
    const [sorteos, setSorteos] = useState([]);
    const [ganadores, setGanadores] = useState([]);
    const [pagoEnProceso, setPagoEnProceso] = useState(false); // TODO: cambiar a false
    const [paymentMethod, setPaymentMethod] = useState('');
    const [refPago, setRefPago] = useState('');
    const [efecty, setEfecty] = useState({});

    // Consulta en tiempo real de los pronosticos
    const obtenerPronosticos = async () => {
      const q = query(collection(db, "pronosticos"));
      const consulta = onSnapshot(q, (querySnapshot) => {
        const pronosticos = [];
        querySnapshot.forEach((doc) => {
            pronosticos.push({
              id: doc.id,
              ...doc.data()
            });
        });
        setPronosticos(pronosticos);
      });
    }

    // Consulta en tiempo real de los sorteos

    const obtenerSorteos = async () => {
      const q = query(collection(db, "sorteos"));
      const consulta = onSnapshot(q, (querySnapshot) => {
        const sorteos = [];
        querySnapshot.forEach((doc) => {
            sorteos.push({
              id: doc.id,
              ...doc.data()
            });
        });
        setSorteos(sorteos);
      });
    }

    // Consulta en tiempo real de los ganadores

    const obtenerGanadores = async () => {
      const q = query(collection(db, "ganadores"), orderBy("fechayhora", "desc"));
      const consulta = onSnapshot(q, (querySnapshot) => {
        const ganadores = [];
        querySnapshot.forEach((doc) => {
            ganadores.push({
              id: doc.id,
              ...doc.data()
            });
        });
        setGanadores(ganadores);
      })
    }
    
    // UseEffect que ejecuta las consultas tan pronto se renderiza el componente

    useEffect(() => {
      obtenerPronosticos();
      obtenerSorteos();
      obtenerGanadores();
    }, []);
    


    const cambiarPronostico = (pronostico) => {
        setpronosticoActual(pronostico);
    }

    const cambiarSorteo = (sorteo) => {
        setSorteoActual(sorteo);
    }

    const nequi = async (data, product) => {
      if (product === 'sorteo') {
        // Se crea el documento de la transacción en la base de datos
        const docRef = await addDoc(collection(db, 'transactions'), {
          nombreCliente: data.nombre,
          refPago: '',
          method: data.method,
          tipoCompra: product,
          idSorteo: data.idSorteo,
          cantidad: data.cantidad,
          telefono: data.telefono,
          telNequi: data.telNequi,
          email: data.email,
          tokenAceptacion: "",
          statusTransaccion: false,
          transaccionCreada: false
        });
        console.log(`El nuevo documento tiene id: ${docRef.id}`);
        setRefPago(docRef.id);
        const refId = doc(db, 'transactions', docRef.id);
        await updateDoc(refId, {
          refPago: docRef.id
        });

        // Se ejecuta end-point de pago a nequi
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }

        try {
          const {data: respuesta} = await axios.post('https://us-central1-jupi-e46aa.cloudfunctions.net/app/api/nequi/procesar-pago-sorteo', {
            reference: docRef.id,
            customer_email: data.email,
            phone_nequi: data.telNequi,
            full_name: data.nombre,
            phone_number: data.telefono,
            cantidad: data.cantidad,
            idSorteo: data.idSorteo,
          }, config);
          console.log(respuesta);
        } catch (error) {
          console.error(error);
        }
      } else {
        // Se crea el documento de la transacción en la base de datos
      const docRef = await addDoc(collection(db, 'transactions'), {
        nombreCliente: data.nombre,
        refPago: '',
        method: data.method,
        tipoCompra: product,
        cantidad: 1,
        idProductoComprado: data.idProdComprado,
        telefono: data.telefono,
        telNequi: data.telNequi,
        email: data.email,
        idSorteo: data.sorteo,
        tokenAceptacion: "",
        statusTransaccion: false,
        transaccionCreada: false
      });
      console.log(`El nuevo documento tiene id: ${docRef.id}`);
      setRefPago(docRef.id);
      const refId = doc(db, 'transactions', docRef.id);
      await updateDoc(refId, {
        refPago: docRef.id
      });

      // Se ejecuta end-point de pago a nequi
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      try {
        const {data: respuesta} = await axios.post('https://us-central1-jupi-e46aa.cloudfunctions.net/app/api/nequi/procesar-pago-pronostico', {
          reference: docRef.id,
          customer_email: data.email,
          phone_nequi: data.telNequi,
          full_name: data.nombre,
          phone_number: data.telefono,
          cantidad: data.cantidad,
          idPron: data.idProdComprado,
        }, config);
        console.log(respuesta);
      } catch (error) {
        console.error(error);
      }
      }
    }

    const pagar = async (data, product) => {
      console.log(data, product);
      if (data.method === 'NEQUI') {
        setPaymentMethod('NEQUI');
        setPagoEnProceso(true);
        nequi(data, product);
      } else if (data.method === 'EFECTY') {
        console.log(data, product);
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }
        const {data: respuesta} = await axios.post('https://us-central1-jupi-e46aa.cloudfunctions.net/efectivo/api/mp/efecty', {
          data: data,
          product: product
        }, config)
        setPaymentMethod('EFECTY');
        setEfecty({
          convenio: respuesta.noConvenio,
          noPago: respuesta.noPago,
          link: respuesta.linkExterno
        })
        setPagoEnProceso(true);
        setRefPago(respuesta.message);
        console.log(respuesta);
      }
    }


    return (
        <JupiContext.Provider
            value={{
              cambiarPronostico,
              cambiarSorteo,
              pronosticos,
              sorteos,
              ganadores,
              pagar,
              pagoEnProceso,
              paymentMethod,
              refPago,
              efecty
            }}
        >
            {children}
        </JupiContext.Provider>
    )

}

export {
    JupiProvider
}
export default JupiContext;