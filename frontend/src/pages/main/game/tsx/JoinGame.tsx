import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../../../socket';

export default function JoinGame() {
   const [username, setUsername] = useState<string>('');
   const [roomId, setRoomId] = useState<string>('');
   const navigation = useNavigate();

   useEffect(() => {
      socket.on('acceptuser', ([acceptedUsername, acceptedRoomId]) => {
         console.log(`User ${acceptedUsername} accepted into room ${acceptedRoomId}`);
         // Show user joined room
         // TODO: socket does not have a join method... so this is not working
         // socket.join(acceptedRoomId);
         localStorage.setItem('username', acceptedUsername);
         localStorage.setItem('hosted', 'false');
         localStorage.setItem('roomId', acceptedRoomId);
         // Display mainGame.js
         //history.push('/mainGame');
         navigation('/mainGame', { replace: true });
      });

      socket.on('updateonline', (users) => {
         console.log('Users in the room:', users);
         // Update Active Users
      });
   }, [username, roomId]);

   const handleJoinGame = () => {
      // function to send request to server to join game

      socket.emit('joingame', username, roomId);
   };

   return (
      <div>
         <h1>Join a Game</h1>
         <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
         />
         <input
            type="text"
            placeholder="Enter the room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
         />
         <button onClick={handleJoinGame}>Join Game</button>
      </div>
   );
}
