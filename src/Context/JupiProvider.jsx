import { createContext, useState, useEffect } from 'react';


const JupiContext = createContext();

const JupiProvider = ( { children } ) => {


    return (
        <JupiContext.Provider
            value={{
                
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