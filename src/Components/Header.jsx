import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from '../../styles/Header.module.css'

const Header = () => {

  return (
    <header className={styles.header}>
        <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <Link href='/' className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                    <a>
                        <Image src='/img/Logo.png' width={50} height={50} alt='Logo' className="bi" />
                    </a>
                </Link>

                <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                    <li>
                        <Link href='/#sorteos'>
                            <a className={`nav-link px-2 text-white ${styles.navText}`}>Sorteos</a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/pronosticos'>
                            <a className={`nav-link px-2 text-white ${styles.navText}`}>Pronosticos</a>
                        </Link>
                    </li>
                    <li>
                        <Link href='/ganadores'>
                            <a className={`nav-link px-2 text-white ${styles.navText}`}>Ganadores</a>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </header>
  )
}

export default Header