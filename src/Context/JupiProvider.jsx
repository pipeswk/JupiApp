import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { collection, query, addDoc, updateDoc, onSnapshot, orderBy, doc } from "firebase/firestore";
import { db } from '../../utils/Firebase';
import axios from 'axios';


const JupiContext = createContext();

const JupiProvider = ( { children } ) => {

  const [pronosticoActual, setpronosticoActual] = useState({});
  const [sorteoActual, setSorteoActual] = useState({});
  const [ip, setIp] = useState('');
  const [pronosticos, setPronosticos] = useState([]);
  const [sorteos, setSorteos] = useState([]);
  const [ganadores, setGanadores] = useState([]);
  const [pagoEnProceso, setPagoEnProceso] = useState(false); // TODO: cambiar a false
  const [paymentMethod, setPaymentMethod] = useState('');
  const [refPago, setRefPago] = useState('');
  const [efecty, setEfecty] = useState({});

  const router = useRouter();

  // Se obtiene la IP publica del cliente que accede a la pagina

  const getIP = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      setIp(response.data.ip);
    } catch (error) {
      console.log(error);
    }
  }

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
    getIP();
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
      // Se ejecuta end-point de pago a nequi
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      try {
        const {data: respuesta} = await axios.post('https://us-central1-jupi-e46aa.cloudfunctions.net/app/api/nequi/procesar-pago-sorteo', {
          data: data,
          product: product
        }, config);
        console.log(respuesta);
        setRefPago(respuesta.refPago);
      } catch (error) {
        console.error(error);
      }
    } else {
    // Se ejecuta end-point de pago a nequi
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const {data: respuesta} = await axios.post('https://us-central1-jupi-e46aa.cloudfunctions.net/app/api/nequi/procesar-pago-pronostico', {
        data: data,
        product: product
      }, config);
      console.log(respuesta);
      setRefPago(respuesta.refPago);
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
    } else { // PSE
      console.log(data, product);
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const {data: respuesta} = await axios.post('https://us-central1-jupi-e46aa.cloudfunctions.net/efectivo/api/mp/pse', {
        data: data,
        product: product,
        ip: ip
      }, config)
      setPaymentMethod('PSE');
      console.log(respuesta);
      router.push(respuesta.response.transaction_details.external_resource_url);
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