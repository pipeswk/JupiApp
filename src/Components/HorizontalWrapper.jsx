import styles from '../../styles/HorizontalWarpper.module.css'

const HorizontalWrapper = ( { children } ) => {
    return (
      <div className='container-fluid mt-3'>
          <div className='row'>
              <div className={`col-12 w-100 d-flex ${styles.horizontalScrolling_Wrapper}`}>
                  {children}
              </div>
          </div>
      </div>
    )
  }
  
  export default HorizontalWrapper