import React from 'react'
import styles from '../../styles/EntradaPronostico.module.css'
import useJupi from '../Hooks/useJupi'
import Lotto from './Lotto'

const LottoSelect = ( { datosSorteo, idSorteo } ) => {

    const { lottos, reservarLottoNumber, checkoutId } = useJupi();
    console.log(datosSorteo);

    const setNumber = (number) => {
        if (lottos.includes(number)) {
            reservarLottoNumber(idSorteo, "delete", number);
        } else {
            reservarLottoNumber(idSorteo, "update", number);
        }
    }

  return (
    <div className={`container ${styles.lotto} overflow-scroll`}>
        <div className="d-flex justify-content-center">
            <div className="container row">
                {datosSorteo[0]?.lottos.filter( lotto => lotto.checkoutId === '' || lotto.checkoutId === checkoutId ).map( (lotto) => (
                   <div className="col-3 mb-3" key={lotto.number}>
                        <Lotto
                            lotto={lotto}
                            setNumber={setNumber}
                        />
                    </div> 
                ))}
            </div>
        </div>
    </div>
  )
}

export default LottoSelect