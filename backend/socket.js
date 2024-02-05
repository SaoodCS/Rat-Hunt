const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const uuid = require("uuid");
const gameLogic = require("./game");
const dbLogic = require("./db_interaction");

const app = express();
const allowedOrigins = ["http://localhost:5173", "https://rat-hunt.web.app"];

// set cors policy for express
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.get("/api/topics", (req, res) => {
  // get topics from topics.js
  res.json({ topics: dbLogic.getTopics() });
});

// Socket real-time magic
io.on("connection", function (socket) {
  console.log("A user connected.");

  // Disconnect
  socket.on("disconnect", function (username, roomId) {
    // Get socket.id from socket
    const socketId = socket.id;
    // Check if socketId exists in real-time db. If does, get associated user
    // TODO: If user exists in db, delete from db and remove from room.
    if (username !== undefined && room !== undefined) {
      dbLogic.removeUser(username, rooms[roomId]);
      console.log(`User ${username} disconnected from room ${roomId}.`);
      io.in(roomId).emit("updateonline");
      socket.leave(roomId);
      // Check firebase realtime room. If empty, delete.
      dbLogic.deleteRoomIfEmpty(roomId);
    } else {
      console.log("Unregistered user disconnected");
    }
  });

  // Leaveroom event
  socket.on("leaveroom", function (username, roomId) {
    // TODO: Same as Above (Should always have associated user)
    if (username !== undefined && roomId !== undefined) {
      dbLogic.removeUser(username, rooms[roomId]);
      console.log(`User ${username} disconnected from room ${roomId}.`);
      io.in(roomId).emit("updateonline", dbLogic.getUsers(roomId));
      socket.leave(roomId);
      dbLogic.deleteRoomIfEmpty(roomId);
    } else {
      console.log("Unregistered user disconnected");
    }
  });

  socket.on("hostgame", function (username, topic) {
    console.log("Creating Game");
    // Generate UUID using UUID package. Shorten to 4 characters
    const roomId = uuid.v4().slice(0, 4);
    // TODO: check the generated roomId against already existing ones, run a while loop until the room id is unique
    // TODO: Create a new Game in Firebase Realtime db:
    // const userData = {username, socket.id}
    // dbLogic.addUserToRoom(userData, roomId)
    dbLogic.addUserToRoom(username, roomId);
    // TODO: Set currentTopic as topic
    dbLogic.currentTopic(roomId, topic);
    // Join the client to the game room
    socket.join(roomId);
    // Emit event that room is created
    // TODO: realtime database will contain roomId, topic, username, so it won't have to be sent to the client from here
    // Send event to client that game is hosted
    socket.emit("gamehosted", roomId);
    // Broadcast event to all clients connected to room to update online users
    io.in(roomId).emit("updateonline");
  });

  socket.on("joingame", function (username, roomId) {
    // Check if room exists
    if (!dbLogic.roomExists(roomId)) {
      console.log("Room does not exist");
      socket.emit("roomnotexists");
      return;
    }
    // TODO: check user exists in room.
    if (!dbLogic.isUsernameAvailable(username)) {
      console.log(`Username ${username} taken.`);
      socket.emit("usernametaken");
      return;
    }
    // Add user to room
    dbLogic.addUserToRoom(username, roomId);
    socket.join(roomId);
    socket.emit("userjoined");
    io.in(roomId).emit("updateonline");
  });

  socket.on("selecttopic", function (roomId, topic) {
    const activeTopic = dbLogic.currentTopic(roomId, topic);
    io.in(roomId).emit("topicupdated", activeTopic);
  });

  // Assign roles event
  socket.on("startround", function (roomId) {
    // Get active topic
    console.log(`looking for active topic for room: ${roomId}`);
    const activeTopic = dbLogic.currentTopic(roomId);

    // get words and assign targetWord
    const words = gameLogic.getRandomWords(activeTopic);
    const targetWord = words[gameLogic.getRandomChoice(words.length)];

    // get users and assign a rat
    const users = dbLogic.getUsers(roomId);
    const ratName = users[gameLogic.getRandomChoice(users.length)];
    console.log(
      `active topic: ${activeTopic} users: ${users}, words: ${words}, targetWord: ${targetWord}`
    );
    io.in(roomId).emit("giveassigment", {
      receivedWords: words,
      receivedTargetWord: targetWord,
      receivedRatName: ratName,
    });
  });
});

// Listen
// TODO: when running the server locally, you can only access it's endpoints from the same machine, not from other devices on the same network...
const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log("Listening on port " + port);
});
