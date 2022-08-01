import Head from 'next/head'
import Footer from '../Components/Footer'
import Header from '../Components/Header'

const Layout = ( { children, pagina } ) => {
  return (
    <div>
        <Head>
            <title>{`Jupi - ${pagina}`}</title>
            <meta name="description" content="App de sorteos a bajo costo" />
            <meta name="theme-color" content="#000428" /> 
            <link rel="icon" href="/jupi.ico" />
        </Head>
        <Header />
        {children}
        <Footer />
    </div>
  )
}

export default Layout