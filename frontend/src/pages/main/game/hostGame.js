import React, { useEffect, useState } from 'react';
import socket from '../../../socket';

const HostGame = () => {
  const [username, setUsername] = useState<string>('');
  const [topic, setTopic] = useState<string>('');

  useEffect(() => {
    socket.on('gamehosted', (roomId, topic, user) => {
      console.log(`Game hosted by ${user} with roomId: ${roomId}, topic: ${topic}`);
      socket.join(roomId);
      localStorage.setItem('username', user);
      localStorage.setItem('hosted', 'true');
      localStorage.setItem('roomId', roomId);
      localStorage.setItem('initialTopic', topic);
      // Route to mainGame.js
      history.push('/mainGame');
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
};

export default HostGame;
