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
            return res.status(200).send({
                status: "success",
                message: `Campo añadido en ${docs.docs.length} documentos`,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
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
            return res.status(200).send({
                status: "success",
                message: `Campo añadido en ${docs.docs.length} documentos`,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                status: "error",
                message: "Error al añadir el campo",
                error: error,
            });
        }
    }
};

const lockNumbers = async (req, res) => {
    const sortId = req.body.sortId;
    const numbersToLock = req.body.numbersToLock;

    if (!sortId || !numbersToLock) {
        return res.status(400).send({
            status: "error",
            message: "Faltan parámetros: sortId o numbersToLock",
        });
    }

    if (numbersToLock > 100) {
        return res.status(400).send({
            status: "error",
            message: "No se pueden bloquear más de 100 números",
        });
    }

    const collectionRef = db.collection("sorteos").doc(sortId).collection("lottos");
    const query = collectionRef
        .where("numberLocked", "==", false)
        .where("available", "==", true)
        .limit(numbersToLock);
    const docs = await query.get();
    if (docs.empty) {
        return res.status(404).send({
            status: "error",
            message: "No hay números disponibles",
        });
    } else {
        const batch = db.batch();
        const docsLocked = [];
        docs.docs.forEach((doc) => {
            docsLocked.push(doc.data());
            batch.update(doc.ref, {
                numberLocked: true,
            });
        });
        await batch.commit();
        return res.status(200).send({
            status: "success",
            message: `Se han bloqueado ${docs.docs.length} números`,
            numbersLocked: docsLocked,
        });
    }
};

const unlockNumbers = async (req, res) => {
    const sortId = req.body.sortId;
    const numbersToUnlock = req.body.numbersToUnlock;

    if (!sortId || !numbersToUnlock) {
        return res.status(400).send({
            status: "error",
            message: "Faltan parámetros: sortId o numbersToUnlock",
        });
    }

    const collectionRef = db.collection("sorteos").doc(sortId).collection("lottos");
    const query = collectionRef.where("numberLocked", "==", true).limit(numbersToUnlock);
    const docs = await query.get();
    if (docs.empty) {
        return res.status(404).send({
            status: "error",
            message: "No hay números disponibles",
        });
    } else {
        const docsUnlocked = [];
        const batch = db.batch();
        docs.docs.forEach((doc) => {
            docsUnlocked.push(doc.data());
            batch.update(doc.ref, {
                numberLocked: false,
            });
        });
        await batch.commit();
        return res.status(200).send({
            status: "success",
            message: `Se han desbloqueado ${docs.docs.length} números`,
            numbersUnlocked: docsUnlocked,
        });
    }
};

const unlockAllNumbers = async (req, res) => {
    const sortId = req.body.sortId;

    if (!sortId) {
        return res.status(400).send({
            status: "error",
            message: "Faltan parámetros: sortId",
        });
    }

    const collectionRef = db.collection("sorteos").doc(sortId).collection("lottos");
    const query = collectionRef.where("numberLocked", "==", true);
    const docs = await query.get();
    if (docs.empty) {
        return res.status(404).send({
            status: "error",
            message: "No hay números disponibles",
        });
    } else {
        const docsUnlocked = [];
        const batch = db.batch();
        docs.docs.forEach((doc) => {
            docsUnlocked.push(doc.data().number);
            batch.update(doc.ref, {
                numberLocked: false,
            });
        });
        await batch.commit();
        return res.status(200).send({
            status: "success",
            message: `Se han desbloqueado ${docs.docs.length} números`,
            numbersUnlocked: docsUnlocked,
        });
    }
};

module.exports = {
    newProspecto,
    addCollectionField,
    lockNumbers,
    unlockNumbers,
    unlockAllNumbers,
};
