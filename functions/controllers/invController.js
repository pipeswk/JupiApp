const axios = require("axios");

// ENDPOINT: /setTemperatura

const setTemperatura = async (req, res) => {
  console.log("Temperatura recibida: ", req.body);
  if (req.body.temperatura < 11 || req.body.temperatura > 25) {
    console.log("Temperatura fuera de rango");
    const temp = req.body.temperatura;
    const tel = "57"+req.body.telefono;
    console.log(tel);
    // Se envía alerta whatsapp
    const whatsappData = JSON.stringify({
      "messaging_product": "whatsapp",
      "to": tel,
      "type": "template",
      "template": {
        "name": "invernadero_beta",
        "language": {
          "code": "es_MX",
        },
        "components": [
          {
            "type": "body",
            "parameters": [
              {
                "type": "text",
                "text": "TEMPERATURA",
              },
              {
                "type": "text",
                "text": temp,
              },
            ],
          },
        ],
      },
    });
    const whatsappConfig = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ACCESS_TOKEN_WHATSAPP}`,
      },
    };
    const url = "https://graph.facebook.com/v13.0/106635852120380/messages";
    const {data} = await axios.post(url, whatsappData, whatsappConfig);
    console.log(data);
    res.status(200).send({
      message: "Alerta enviada",
    });
  } else {
    res.status(200).send({
      status: "success",
      message: "Temperatura registrada",
    });
  }
};

// ENDPOINT: /setHumedad

const setHumedad = async (req, res) => {
  console.log("Humedad recibida: ", req.body);
  if (req.body.humedad < 20 || req.body.humedad > 80) {
    console.log("humedad fuera de rango");
    const hum = req.body.humedad;
    const tel = "57"+req.body.telefono;
    // Se envía alerta whatsapp
    const whatsappData = JSON.stringify({
      "messaging_product": "whatsapp",
      "to": tel,
      "type": "template",
      "template": {
        "name": "hum_beta",
        "language": {
          "code": "es_MX",
        },
        "components": [
          {
            "type": "body",
            "parameters": [
              {
                "type": "text",
                "text": "HUMEDAD",
              },
              {
                "type": "text",
                "text": hum,
              },
            ],
          },
        ],
      },
    });
    const whatsappConfig = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ACCESS_TOKEN_WHATSAPP}`,
      },
    };
    const url = "https://graph.facebook.com/v13.0/106635852120380/messages";
    const {data} = await axios.post(url, whatsappData, whatsappConfig);
    console.log(data);
    res.status(200).send({
      message: "Alerta enviada",
    });
  } else {
    res.status(200).send({
      status: "success",
      message: "Humedad registrada",
    });
  }
};


// ENDPOINT: /setRiego

const setRiego = async (req, res) => {
  console.log("Riego activado: ", req.body);
  const id = req.body.LotId;
  const tel = "57"+req.body.telefono;
  // Se envía alerta whatsapp
  const whatsappData = JSON.stringify({
    "messaging_product": "whatsapp",
    "to": tel,
    "type": "template",
    "template": {
      "name": "rieg_beta",
      "language": {
        "code": "es_MX",
      },
      "components": [
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": id,
            },
          ],
        },
      ],
    },
  });
  const whatsappConfig = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.ACCESS_TOKEN_WHATSAPP}`,
    },
  };
  const url = "https://graph.facebook.com/v13.0/106635852120380/messages";
  const {data} = await axios.post(url, whatsappData, whatsappConfig);
  console.log(data);
  res.status(200).send({
    message: "Alerta enviada",
  });
};

module.exports = {
  setTemperatura,
  setHumedad,
  setRiego,
};
