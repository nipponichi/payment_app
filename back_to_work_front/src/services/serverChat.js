import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";

const app = express();
app.use(cors());

const server = app.listen(3000, () =>
  console.log("Servidor corriendo en http://localhost:3000")
);

const wss = new WebSocketServer({ server });

let clients = new Set();

wss.on("connection", (ws) => {
  console.log("Cliente conectado");
  clients.add(ws);

  ws.on("message", (data) => {
    const message = JSON.parse(data);
    console.log("📩 Mensaje recibido:", message);

    clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(message));
      }
    });
  });

  ws.on("close", () => {
    console.log("❌ Cliente desconectado");
    clients.delete(ws);
  });
});
