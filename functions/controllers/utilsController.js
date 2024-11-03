const admin = require("firebase-admin");
const db = admin.firestore();

const newProspecto = async (req, res) => {
    const data = req.body.data;
    
    // Se crea cliente en la colección de "clientes"

    try {
        // Se genera id de firestore
        const customerId = db.collection("clientes").doc().id;
        console.log("customerId ==> ", customerId);
        console.log("data ==> ", data);
        await db.collection("clientes").doc(customerId).set({
            email: [
                data.email,
            ],
            lastTokenSignal: null,
            nombreCliente: data.nombre,
            relatedOrders: [],
            telNequi: data.telNequi,
            telefono: [
                data.telefono,
            ],
            token: [],
            id: customerId,
            tipoDocumento: data.tipoDocumento || null,
            noDocumento: data.noDocumento || null,
            tipo: "prospecto",
            productoAsociado: {
                idSorteo: data.idSorteo,
                cantidad: data.cantidad,
            },
            createdDate: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(200).send({
            status: "success",
            message: "Prospecto creado",
            id: customerId,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "error",
            message: "Error al crear el prospecto",
            error: error,
        });
    }
};

// Funcion para añadir un campo a todos los documentos de una colección
const addCollectionField = async (req, res) => {
    const collectionName = req.body.collectionName;
    const fieldName = req.body.fieldName;
    const fieldValue = req.body.fieldValue;
    const isSubcollection = req.body.isSubcollection; // Booleano
    
    if (isSubcollection) {
        const subcollectionName = req.body.subcollectionName;
        const collectionDocId = req.body.collectionDocId;
        const subcollectionRef = db.collection(collectionName).doc(collectionDocId).collection(subcollectionName);
        const docs = await subcollectionRef.get();
        
        try {
            // Se inicializa batch
            const batchSize = 500;

            for (let i = 0; i < docs.docs.length; i += batchSize) {
                const batch = db.batch();
                docs.docs.slice(i, i + batchSize).forEach((doc) => {
                    batch.update(doc.ref, {
                        [fieldName]: fieldValue,
                    });
                });
                await batch.commit();
            }
            res.status(200).send({
                status: "success",
                message: `Campo añadido en ${docs.docs.length} documentos`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                status: "error",
                message: "Error al añadir el campo",
                error: error,
            });
        }
    } else {
        const collectionRef = db.collection(collectionName);
        const docs = await collectionRef.get();
        
        try {
            // Se inicializa batch
            const batchSize = 500;
            for (let i = 0; i < docs.docs.length; i += batchSize) {
                const batch = db.batch();
                docs.docs.slice(i, i + batchSize).forEach((doc) => {
                    batch.update(doc.ref, {
                        [fieldName]: fieldValue,
                    });
                });
                await batch.commit();
            }
            res.status(200).send({
                status: "success",
                message: `Campo añadido en ${docs.docs.length} documentos`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({
                status: "error",
                message: "Error al añadir el campo",
                error: error,
            });
        }
    }
};

module.exports = {
    newProspecto,
    addCollectionField,
};
