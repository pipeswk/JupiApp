import 'bootstrap/dist/css/bootstrap.css'; // Add this line
import '../styles/globals.css'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { JupiProvider } from '../src/Context/JupiProvider';
import * as fbq from '../lib/fpixel';

function MyApp({ Component, pageProps }) {

  const router = useRouter();

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap');
  }, []);

  useEffect(() => {
    fbq.pageview();

    const handleRouteChange = () => {
      fbq.pageview();
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  
  

  return (
    <JupiProvider>
      <Script
        id='fb-pixel'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbq.FB_PIXEL_ID}');
          `,
        }}
      />
      <Component {...pageProps} />
    </JupiProvider>
  )
}

export default MyApp
