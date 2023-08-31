import { useEffect, useState } from 'react'
import TiktokPixel from 'tiktok-pixel'
import styles from '../../styles/EntradaPronostico.module.css'
import useJupi from '../Hooks/useJupi'
import Lotto from './Lotto'

const LottoSelect = ( { datosSorteo, idSorteo } ) => {

    const [eventCheckout, setEventCheckout] = useState(false);
    console.log(datosSorteo[0]);

    const { setLottos, reservarLottoNumber, checkoutId } = useJupi();

    useEffect(() => {
        const arlott = [];
        datosSorteo[0]?.lottos.filter( lott => lott.checkoutId === checkoutId ).map( lott => {
            arlott.push(lott.number);
        });
        setLottos(arlott);
    }, [datosSorteo])
    

    const setNumber = (number, operation) => {
        reservarLottoNumber(idSorteo, operation, number);
        if (eventCheckout === false) {
            setEventCheckout(true);
            TiktokPixel.track('AddToCart', {
                content_type: 'product',
                content_ids: [idSorteo],
                value: datosSorteo[0]?.valorTicket,
                currency: 'COP'
            });
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