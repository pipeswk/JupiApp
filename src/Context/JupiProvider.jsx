import { createContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../../utils/Firebase';


const JupiContext = createContext();

const JupiProvider = ( { children } ) => {

    const [pronosticoActual, setpronosticoActual] = useState({});
    const [sorteoActual, setSorteoActual] = useState({});
    const [pronosticos, setPronosticos] = useState([]);
    const [sorteos, setSorteos] = useState([]);

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

    useEffect(() => {
      obtenerPronosticos();
      obtenerSorteos();
    }, []);
    


    const cambiarPronostico = (pronostico) => {
        setpronosticoActual(pronostico);
    }

    const cambiarSorteo = (sorteo) => {
        setSorteoActual(sorteo);
    }


    return (
        <JupiContext.Provider
            value={{
              cambiarPronostico,
              cambiarSorteo,
              pronosticos,
              sorteos
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