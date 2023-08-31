import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import TiktokPixel from 'tiktok-pixel'
import Head from 'next/head'
import Footer from '../Components/Footer'
import Header from '../Components/Header'

const Layout = ( { children, pagina, description } ) => {

  useEffect(() => {
    TiktokPixel.init('CJO1CK3C77UEOD73L81G')
    TiktokPixel.pageView()
  }, [])
  

  return (
    <div>
        <Head>
            <title>{`Jupi - ${pagina}`}</title>
            <meta name="description" content={description} />
            <meta name="theme-color" content="#000428" /> 
            <link rel="icon" href="/jupi.ico" />
        </Head>
        <Header />
        {children}
        <Analytics />
        <Footer />
    </div>
  )
}

export default Layout