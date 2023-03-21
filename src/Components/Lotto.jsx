import { useState, useEffect } from 'react'
import useJupi from '../Hooks/useJupi'

const Lotto = ( { lotto, setNumber } ) => {
    const { checkoutId, spinLotto } = useJupi();
    

  return (
    <>
        {checkoutId !== lotto.checkoutId ? (
            <div
                className="btn btn-dark"
                role="button"
                onClick={() => setNumber(lotto.number, "update")}
            >
                {spinLotto === false ? (
                    lotto.number
                ) : (
                    <div className="spinner-border text-light" role="status"></div>
                )}
            </div>
        ) : (
            <div
                className="btn btn-success"
                role="button"
                onClick={() => setNumber(lotto.number, "delete")}
            >
                {spinLotto === false ? (
                    lotto.number
                ) : (
                    <div className="spinner-border text-light" role="status"></div>
                )}
            </div>
        )}
    </>
  )
}

export default Lotto