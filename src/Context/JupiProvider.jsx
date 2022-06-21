import { createContext, useState, useEffect } from 'react';
import { collection, query, addDoc, updateDoc, onSnapshot, orderBy, doc } from "firebase/firestore";
import { getFunctions, httpsCallable } from 'firebase/functions'
import { db } from '../../utils/Firebase';
import axios from 'axios';


const JupiContext = createContext();

const JupiProvider = ( { children } ) => {

    const [pronosticoActual, setpronosticoActual] = useState({});
    const [sorteoActual, setSorteoActual] = useState({});
    const [pronosticos, setPronosticos] = useState([]);
    const [sorteos, setSorteos] = useState([]);
    const [ganadores, setGanadores] = useState([]);

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

    const pagarSorteo = async (data) => {
      // Se crea el documento de la transacción en la base de datos
      const docRef = await addDoc(collection(db, 'transactions'), {
        nombreCliente: data.nombre,
        refPago: '',
        tipoCompra: 'sorteo',
        idProductoComprado: data.idSorteo,
        cantidad: data.cantidad,
        telefono: data.telefono,
        telNequi: data.telNequi,
        email: data.email,
        tokenAceptacion: "",
        statusTransaccion: false,
        transaccionCreada: false
      });
      console.log(`El nuevo documento tiene id: ${docRef.id}`);
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
    }


    return (
        <JupiContext.Provider
            value={{
              cambiarPronostico,
              cambiarSorteo,
              pronosticos,
              sorteos,
              ganadores,
              pagarSorteo
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