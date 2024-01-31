// an array of all users
var users = [];
// users by room
var rooms = {};
// grid by room
var active_grids = {};

// remove a user from an array
function removeUser(username, array) {
    var index = array.indexOf(username);
    // if we found a use remove them
    if (index > -1) {
        array.splice(index, 1);
    }
}

function getUsers(roomId) {
    return users.at(rooms[roomId]);
}

// is a username available?
function isUsernameAvailable(username) {
    var index = users.indexOf(username);
    if (index > -1) {
        return false
    } else {
        return true
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
    users.push(username)
}

function addRoom(roomId) {
    if (rooms[roomId] === undefined) {
        rooms[roomId] = [];
    }
}

function deleteRoomIfEmpty(roomId){
    if (rooms[roomId].length === 0) {
        delete rooms[roomId];
        delete active_grids[roomId];
    }
}

function currentTopic(roomId, topic) {
    if(topic !== null){
        active_topic[roomId] = topic;
    }
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
};
