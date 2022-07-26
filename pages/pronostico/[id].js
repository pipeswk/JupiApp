import { useEffect } from 'react'
import Image from 'next/image'
import { db } from '../../utils/Firebase'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import Layout from '../../src/Layout/Layout'

const ResultadoCompraPronostico = ( { id, imagen } ) => {

    useEffect(() => {
      console.log(imagen);
    }, [])
    

  return (
    <Layout
        pagina='Vamos a ganar'
    >
        <main>
            <div className='py-4 bg-light'>
                <div className='container'>
                    <div className='bg-white my-5 rounded shadow-sm p-4 text-center'>
                        <Image src={imagen.img_src} width={300} height={500} />
                    </div>
                </div>
            </div>
        </main>
    </Layout>
  )
}

export default ResultadoCompraPronostico

export async function getServerSideProps( { params: {id} } ) {

    const docRef = doc(db, 'transactions', id);
    const documento = await getDoc(docRef);
    let resultado = [];
    if (documento.exists() && documento.data().statusTransaccion === true) {
        const q = query(collection(db, 'imgpronosticos'), where('idPron', '==', documento.data().idProductoComprado));
        const docs = await getDocs(q);
        docs.forEach(doc => {
            resultado.push(doc.data());
        });
    } else {
        console.log('Documento no encontrado!');
        return {
            redirect: {
              destination: '/',
            }
        }
    }


    return {
        props: {
            id,
            imagen: resultado[0]
        }
    }
}