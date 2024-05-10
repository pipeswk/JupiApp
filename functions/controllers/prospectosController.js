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
            createdDate: admin.firestore.FieldValue.serverTimestamp()
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
        })
    }
};

module.exports = {
    newProspecto,
};