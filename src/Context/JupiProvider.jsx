import { createContext, useState, useEffect } from 'react';


const JupiContext = createContext();

const JupiProvider = ( { children } ) => {

    const [pronosticoActual, setpronosticoActual] = useState({})


    const cambiarPronostico = (pronostico) => {
        setpronosticoActual(pronostico);
    }


    return (
        <JupiContext.Provider
            value={{
              pronosticoActual,
              cambiarPronostico
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