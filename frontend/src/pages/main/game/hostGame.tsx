import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../../../socket';

const HostGame: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const navigate = useNavigate();
  const serverURL = 'http://localhost:3000'

  useEffect(() => {
    fetchTopicsFromServer();
    socket.on('gamehosted', (roomId, topic, user) => {
      setUsername(user);
      console.log(`Game hosted by ${user} with roomId: ${roomId}, topic: ${topic}`);
      localStorage.setItem('username', user);
      localStorage.setItem('hosted', 'true');
      localStorage.setItem('roomId', roomId);
      localStorage.setItem('initialTopic', topic);
      // Route to mainGame.js
      navigate('/main/game');
    });

    socket.on('updateonline', (users) => {
      console.log('Users in the room:', users);
      // Update online users
    });
  }, []);

  const fetchTopicsFromServer = async () => {
    try {
      // Make a request to your backend to fetch topics
      const response = await fetch(`${serverURL}/api/topics`);
      const data = await response.json();

      // Update the state with the fetched topics
      setTopics(data.topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

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
      <select onChange={(e) => setTopic(e.target.value)} value={topic}>
        {topics.map((topicOption, index) => (
          <option key={index} value={topicOption}>
            {topicOption}
          </option>
        ))}
      </select>
      <button onClick={handleHostGame}>Host Game</button>
    </div>
  );
};

export default HostGame;
