import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../../../../global/hooks/useLocalStorage';
import socket from '../../../../socket';

export default function HostGame() {
   const [username, setUsername] = useState<string>('');
   const [topic, setTopic] = useState<string>('');
   const [currentUser, setCurrentUser] = useLocalStorage('username', '');
   const [isHost, setIsHost] = useLocalStorage('hosted', false);
   const [roomId, setRoomId] = useLocalStorage('roomId', '');
   const [initialTopic, setInitialTopic] = useLocalStorage('initialTopic', '');
   const navigation = useNavigate();

   useEffect(() => {
      socket.on('gamehosted', (roomId, topic, user) => {
         console.log(`Game hosted by ${user} with roomId: ${roomId}, topic: ${topic}`);
         // TODO: socket does not have a join method... so this is not working
         //socket.join(roomId);
         setCurrentUser(user);
         setIsHost(true);
         setRoomId(roomId);
         setInitialTopic(topic);
         // Route to mainGame.js
         navigation('/mainGame', { replace: true });
      });

      socket.on('updateonline', (users) => {
         console.log('Users in the room:', users);
         // Update online users
      });
   }, [username, topic]);

   const handleHostGame = () => {
      // Additional validation or user prompts can be added here
      socket.emit('hostgame', username, topic);
   };

   return (
      <div>
         <h1>Host a Game</h1>
         <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
         />
         <input
            type="text"
            placeholder="Enter the game topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
         />
         <button onClick={handleHostGame}>Host Game</button>
      </div>
   );
}
