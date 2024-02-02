import React, { useEffect, useState } from 'react';
import socket from '../../../socket';

const currentUser = localStorage.getItem('username');
const isHost = localStorage.getItem('hosted') === 'true';
const roomId = localStorage.getItem('roomId');
const initialTopic = localStorage.getItem('initialTopic');
const serverURL = 'http://localhost:3000'

const MainGame: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState<string>('');
  const [newTopic, setNewTopic] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [isRat, setIsRat] = useState<boolean>(false);

  useEffect(() => {
    fetchTopicsFromServer();
    // Set up event listeners for socket events
    socket.on('giveassigment', ({receivedWords, receivedTargetWord, receivedRatName}) => {
      setWords(receivedWords);
      setTargetWord(receivedTargetWord);
      // Check if the current user is the rat
      setIsRat(currentUser === receivedRatName);
    });

    socket.on('topicupdated', (activeTopic) => {
      setNewTopic(activeTopic);
    });

    setNewTopic(initialTopic || '');

    // Clean up event listeners on component unmount
    return () => {
      socket.off('giveassigment');
    };
  }, []); // Empty dependency array ensures that this effect runs only once on component mount

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

  const startRound = () => {
    // Emit startRound event to the server
    socket.emit('startround', roomId);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewTopic(e.target.value);
  };

  const changeTopic = () => {
    // Emit changeTopic event to server with new topic
    socket.emit('selecttopic', newTopic);
  };

  return (
    <div>
      <h1>Game Info</h1>
      {/* Display game information */}
      <p>Target Word: {isRat ? 'You are the Rat' : targetWord}</p>

      {/* Display words in a grid */}
      <div>
        {words.map((word, index) => (
          <div key={index} className={word === targetWord && !isRat ? 'highlight' : ''}>
            {word}
          </div>
        ))}
      </div>

      <select onChange={handleTopicChange} value={newTopic}>
        {topics.map((topic, index) => (
          <option key={index} value={topic}>
            {topic}
          </option>
        ))}
      </select>
      {isHost && <button onClick={changeTopic}>Change Topic</button>}

      {/* Display start round button (visible only to the host) */}
      {isHost && <button onClick={startRound}>Start Round</button>}
    </div>
  );
};

export default MainGame;