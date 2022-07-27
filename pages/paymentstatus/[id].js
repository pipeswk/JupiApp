import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../src/Layout/Layout'
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/Firebase'
import StatusPse from '../../src/Components/StatusPse';

const EntradaPago = () => {
    const [resultado, setResultado] = useState({});
    const router = useRouter();
    const { id } = router.query;
    console.log(id);

    useEffect(() => {
        if (id !== undefined) {
            const payStatus = onSnapshot(doc(db, 'transactions', id), (payment) => {
                setResultado(payment.data());
            });
            return
        }
    }, [id])
    

  return (
    <Layout
        pagina='Pago'
    >
        <main>
            <div className='py-4 bg-light'>
                <StatusPse data={resultado} />
            </div>
        </main>
    </Layout>
  )
}

export default EntradaPago

// export async function getServerSideProps( { params: {id} } ) {
//     let resultado;
//     const docRef = doc(db, 'transactions', id);
//     const documento = await getDoc(docRef);
//     if (documento.exists()) {
//         resultado = documento.data();
//     } else {
//         console.log('Documento no encontrado!');
//         return {
//             redirect: {
//               destination: '/',
//             }
//         }
//     }
//     return {
//         props: {
//         id,
//         resultado
//         }
//     }
// }