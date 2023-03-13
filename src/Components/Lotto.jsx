import { useState, useEffect } from 'react'
import useJupi from '../Hooks/useJupi'

const Lotto = ( { lotto, setNumber } ) => {
    const [active, setActive] = useState(false);
    const { lottos } = useJupi();

    useEffect(() => {
        if (lottos.includes(lotto.number)) {
            setActive(true);
        } else {
            setActive(false);
        }
    }, [lottos])
    

  return (
    <>
        {active === false ? (
            <div
                className="btn btn-dark"
                role="button"
                onClick={() => setNumber(lotto.number)}
            >
                {lotto.number}
            </div>
        ) : (
            <div
                className="btn btn-success"
                role="button"
                onClick={() => setNumber(lotto.number)}
            >
                {lotto.number}
            </div>
        )}
    </>
  )
}

export default Lotto