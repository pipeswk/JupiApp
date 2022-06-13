import { createContext, useState, useEffect } from 'react';
import { collection, query, doc, onSnapshot } from "firebase/firestore";
import { db } from '../../utils/Firebase';


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
      const conulsta = onSnapshot(doc(db, 'personalizacion', 'ganadores'), (doc) => {
        setGanadores(doc.data().listado_ganadores);
      });
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


    return (
        <JupiContext.Provider
            value={{
              cambiarPronostico,
              cambiarSorteo,
              pronosticos,
              sorteos,
              ganadores
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