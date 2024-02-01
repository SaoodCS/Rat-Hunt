import { useEffect, useState } from 'react';
import useLocalStorage from '../../../../global/hooks/useLocalStorage';
import socket from '../../../../socket';

export default function MainGame() {
   const [currentUser] = useLocalStorage('username', '');
   const [isHost] = useLocalStorage('hosted', false);
   const [roomId] = useLocalStorage('roomId', '');
   const [initialTopic] = useLocalStorage('initialTopic', '');
   const [words, setWords] = useState([]);
   const [targetWord, setTargetWord] = useState('');
   const [newTopic, setNewTopic] = useState('');
   const [topics, setTopics] = useState<string[]>([]);
   const [isRat, setIsRat] = useState<boolean>(false);
   const [ratName, setRatName] = useState<string>('');

   useEffect(() => {
      fetchTopicsFromServer();
      // Set up event listeners for socket events
      socket.on('giveassigment', ([receivedWords, receivedTargetWord, receivedRatName]) => {
         setWords(receivedWords);
         setTargetWord(receivedTargetWord);
         setRatName(receivedRatName);

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
   }, []);

   const fetchTopicsFromServer = async () => {
      try {
         // Make a request to your backend to fetch topics
         const response = await fetch('/api/getTopics');
         const data = await response.json();

         // Update the state with the fetched topics
         setTopics(data.topics);
      } catch (error) {
         console.error('Error fetching topics:', error);
      }
   };

   const startRound = () => {
      // TODO: original code was `io.in(roomId).emit('startround', roomId);` - but io is not defined so changed it to the one below
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

         <select onChange={(e) => handleTopicChange(e)} value={newTopic}>
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
}
