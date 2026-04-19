import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import { validatePlayCard } from "./utils/validation.js";
import { withLock } from "./utils/locks.js";

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mtg";
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.error("Erro ao conectar MongoDB:", err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let rooms = {};

function createRoom(id) {
  return {
    id,
    players: [],
    state: {
      battlefield: [],
      graveyard: [],
      exile: []
    },
    stack: [],
    turn: {
      current: null
    },
    priority: {
      current: null
    },
    version: 0
  };
}

function emitRoom(room) {
  room.version++;

  room.players.forEach(p => {
    io.to(p.socketId).emit("roomState", {
      version: room.version,
      state: room
    });
  });
}

io.on("connection", (socket) => {

  socket.on("joinRoom", async ({ roomId, userId, name }) => {

    if (!rooms[roomId]) {
      rooms[roomId] = createRoom(roomId);
    }

    const room = rooms[roomId];

    let player = room.players.find(p => p.userId === userId);

    if (player) {
      player.socketId = socket.id;
    } else {
      player = {
        userId,
        socketId: socket.id,
        name,
        life: 40,
        hand: [],
        mana: 0
      };

      room.players.push(player);

      if (!room.turn.current) {
        room.turn.current = userId;
        room.priority.current = userId;
      }
    }

    socket.join(roomId);
    emitRoom(room);
  });

  socket.on("playCard", (data) =>
    withLock(data.roomId, () => {
      try {
        const room = rooms[data.roomId];
        const player = room.players.find(p => p.userId === data.userId);

        validatePlayCard(room, player, data.cardId);

        const card = player.hand.find(c => c.id === data.cardId);

        room.stack.push({ card });

        emitRoom(room);

      } catch (e) {
        socket.emit("error", e.message);
      }
    })
  );

});

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mtg";
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB conectado com sucesso!"))
  .catch(err => console.error("Erro ao conectar MongoDB:", err));

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
