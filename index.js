import http from "node:http";
import path from "node:path";

import express from "express";
import { Server, Socket } from "socket.io";

import { kafkaClient } from "./kafka-client.js";
import { json } from "node:stream/consumers";



async function main() {
  const PORT = process.env.PORT ?? 8000;
  const app = express();
  const server = http.createServer(app);
  const io = new Server();
  io.attach(server);

  const kafkaProducer = kafkaClient.producer();
await kafkaProducer.connect();

const kafkaConsumer = kafkaClient.consumer({
  groupId: `socket-server-${PORT}`,
});
await kafkaConsumer.connect();

await kafkaConsumer.subscribe({
  topics: ["location-updates"],
  fromBeginning: true,
});

kafkaConsumer.run({
    eachMessage: async({topic, partition, message, heartbeat}) => {
        const data = JSON.parse(message.value.toString())
        console.log(`kafkaconsumer data received`, { data });
        io.emit('server:location:update', { id: data.id, latitude: data.latitude, longitude: data.longitude })
        await heartbeat();
        
    }
})

  io.on("connection", (socket) => {
    console.log(`[socket: ${socket.id}]: connected success...`);

    socket.on("client:location:update", async (locationData) => {
      const { latitude, longitude } = locationData;
      console.log(
        `[socket: ${socket.id}]:client:location:update`,
        locationData,
      );

      await kafkaProducer.send({
        topic: "location-updates",
        messages: [
          {
            key: socket.id,
            value: JSON.stringify({ id: socket.id, latitude, longitude }),
          },
        ],
      });
    });
  });

  app.get("/health", (req, res) => {
    return res.json({ healthy: true });
  });

  app.use(express.static(path.resolve("./public")));

  server.listen(PORT, () => {
    console.log(`server is running on port: http://localhost:${PORT}`);
  });
}

main();
