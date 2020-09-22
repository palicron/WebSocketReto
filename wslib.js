const WebSocket = require("ws");
const Mensajes = require("./Mensajes");
const json = require("./Data/Mesage.json");
const clients = [];
const messages = [];
var i = 0;
const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();
    ws.on("message", (message) => {
      i++;
      Mensajes.create({
        message: message,
        author: "Anonimus",
        ts: i,
      }).then((result) => {
        getmesage(message);
      });
    });
  });
};
const sendMessages = () => {
  clients.forEach((client) => client.send(JSON.stringify(messages)));
};
const getmesage = (msj) => {
  messages.push(msj);
  console.log(messages);
  sendMessages();
};
const refreshArray = () => {
  messages.length = 0;
  Mensajes.findAll().then((result) => {
    for (let i = 0; i < result.length; i++) {
      messages.push(result[i].message);
      console.log(messages);
    }
    sendMessages();
  });
};
exports.wsConnection = wsConnection;
exports.getmesage = getmesage;
exports.refreshArray = refreshArray;
