import { useState, useEffect } from 'react'
import useJupi from '../Hooks/useJupi'

const Lotto = ( { lotto, setNumber } ) => {
    const [active, setActive] = useState(false);
    const { lottos, checkoutId } = useJupi();

    useEffect(() => {
        if (lottos.includes(lotto.number)) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [lottos])
    

  return (
    <>
        {checkoutId !== lotto.checkoutId ? (
            <div
                className="btn btn-dark"
                role="button"
                onClick={() => setNumber(lotto.number, "update")}
            >
                {lotto.number}
            </div>
        ) : (
            <div
                className="btn btn-success"
                role="button"
                onClick={() => setNumber(lotto.number, "delete")}
            >
                {lotto.number}
            </div>
        )}
    </>
  )
}

export default Lotto