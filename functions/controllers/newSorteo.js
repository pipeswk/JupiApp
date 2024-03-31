const admin = require("firebase-admin");
const db = admin.firestore();

const newSorteo = async (req, res) => {
    console.log("newSorteo");
    const sorteo = req.body;
    console.log(sorteo);
    // Se crea el sorteo en la colección "sorteos"
    try {
        const idSorteo = sorteo.campaign_id;
        const sortRef = db.collection("sorteos").doc(idSorteo);
        await sortRef.set({
            id: idSorteo,
            capacidad: sorteo.capacidad,
            caracteristicas: [],
            categoria: sorteo.categoria,
            img: sorteo.img,
            nombre: sorteo.nombre,
            onPronosticos: false,
            participantes: [],
            preview_img: sorteo.preview_img,
            status: "active",
            valorTicket: sorteo.valorTicket,
            video_poster: sorteo.video_poster,
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
