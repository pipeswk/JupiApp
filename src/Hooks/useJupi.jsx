import { useContext } from 'react';
import JupiContext from '../Context/JupiProvider';

const useJupi = () => {
    return useContext(JupiContext);
}

export default useJupi;