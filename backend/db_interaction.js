const topics = require('./topics');
// an array of all users
var users = [];
// users by room
var rooms = {};
// grid by room
var active_topic = {};

function getTopics() {
   // get topics from topic.js
   return topics.flatMap((topic) => topic.key);
}

// remove a user from an array
function removeUser(username, array) {
   var index = array.indexOf(username);
   // if we found a use remove them
   if (index > -1) {
      array.splice(index, 1);
   }
}

function getUsers(roomId) {
   return rooms[roomId];
}

// is a username available in a room
function isUsernameAvailable(username) {
   var index = users.indexOf(username);
   if (index > -1) {
      return false;
   } else {
      return true;
   }
}

function roomExists(roomId) {
   return rooms[roomId] !== undefined;
}

function addUserToRoom(username, roomId) {
   addUser(username);
   addRoom(roomId);
   rooms[roomId].push(username);
}

// add user
function addUser(username) {
   users.push(username);
}

function addRoom(roomId) {
   if (rooms[roomId] === undefined) {
      rooms[roomId] = [];
   }
}

function deleteRoomIfEmpty(roomId) {
   if (rooms[roomId].length === 0) {
      delete rooms[roomId];
      delete active_topic[roomId];
   }
}

function currentTopic(roomId, topic) {
   console.log(`roomId: ${roomId}, topic: ${topic}`);
   console.log(active_topic[roomId]);
   if (topic !== undefined) {
      active_topic[roomId] = topic;
      console.log(`Set active topic as: ${active_topic[roomId]}`);
   }
   console.log(`Getting active topic: ${active_topic[roomId]}`);
   return active_topic[roomId];
}

// export functions
module.exports = {
   removeUser,
   isUsernameAvailable,
   addUser,
   addRoom,
   deleteRoomIfEmpty,
   addUserToRoom,
   currentTopic,
   roomExists,
   getUsers,
   getTopics,
};
