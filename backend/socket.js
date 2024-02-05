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

  // locals
  var username;
  var roomId;

  // Disconnect
  socket.on("disconnect", function () {
    if (username !== undefined && room !== undefined) {
      dbLogic.removeUser(username, rooms[roomId]);
      console.log(`User ${username} disconnected from room ${roomId}.`);
      io.in(roomId).emit('updateonline', dbLogic.getUsers(roomId));
      socket.leave(roomId);
      dbLogic.deleteRoomIfEmpty(roomId);
    } else {
      console.log("Unregistered user disconnected");
    }
  });

  // Leaveroom event
  socket.on("leaveroom", function (username, roomId) {
    if (username !== undefined && roomId !== undefined) {
      dbLogic.removeUser(username, rooms[roomId]);
      console.log(`User ${username} disconnected from room ${roomId}.`);
      io.in(roomId).emit('updateonline', dbLogic.getUsers(roomId));
      socket.leave(roomId);
      dbLogic.deleteRoomIfEmpty(roomId);
    } else {
      console.log("Unregistered user disconnected");
    }
  });

  socket.on("hostgame", function (username, topic) {
    if (!dbLogic.isUsernameAvailable(username)) {
      console.log("Username taken.");
      socket.emit("usernametaken");
      return;
    }
    console.log("Creating Game");
    // Generate UUID using UUID package. Shorten to 4 characters
    const roomId = uuid.v4().slice(0, 4);
    dbLogic.addUserToRoom(username, roomId);
    dbLogic.currentTopic(roomId, topic);
    socket.join(roomId);
    // Emit event that room is created
    io.emit("gamehosted", roomId, topic, username);
  });

  socket.on("joingame", function (username, roomId) {
    if (!dbLogic.isUsernameAvailable(username)) {
      console.log("Username taken.");
      socket.emit("usernametaken");
      return;
    }
    // Check if room exists
    if (!dbLogic.roomExists(roomId)) {
      console.log("Room does not exist");
      return;
    }
    // Add user to room
    dbLogic.addUserToRoom(username, roomId);
    socket.join(roomId);
    socket.emit("acceptuser", [username, roomId]);
    io.in(roomId).emit("updateonline", dbLogic.getUsers(roomId));
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
