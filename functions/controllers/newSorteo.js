const admin = require("firebase-admin");
const db = admin.firestore();

const newSorteo = async (req, res) => {
    console.log("newSorteo");
    const sorteo = req.body;
    console.log(sorteo);
    // Se crea el sorteo en la colección "sorteos"
    try {
        const idSorteo = db.collection("sorteos").doc().id;
        const sortRef = db.collection("sorteos").doc(idSorteo);
        await sortRef.set({
            id: idSorteo,
            capacidad: sorteo.total_quotas,
            caracteristicas: [],
            categoria: sorteo.category,
            img: sorteo.images,
            nombre: sorteo.title,
            onPronosticos: false,
            participantes: [],
            preview_img: sorteo.video_placeholder,
            status: "active",
            valorTicket: sorteo.price,
            video_poster: sorteo.video_placeholder,
            video_src: sorteo.video_src,
        });
        res.status(200).send({
            success: true,
            message: "Sorteo creado correctamente en Jupi",
            sorteo: idSorteo,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error al crear el sorteo",
            error: error,
        });
    }
};

module.exports = {
    newSorteo,
};
