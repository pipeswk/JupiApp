import 'bootstrap/dist/css/bootstrap.css'; // Add this line
import '../styles/globals.css'
import { useEffect } from 'react';
import { JupiProvider } from '../src/Context/JupiProvider';

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap');
  }, []);
  

  return (
    <JupiProvider>
      <Component {...pageProps} />
    </JupiProvider>
  )
}

export default MyApp
