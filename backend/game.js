const topics = require('./topics');

// Function to get a random grid
function getRandomTopic() {
   return topics[getRandomChoice(topics.length)];
}

// Get 6 random words based on the key
function getRandomWords(key) {
   const topic = topics.find((t) => t.key === key);

   if (topic && topic.values && topic.values.length >= 6) {
      const shuffledWords = topic.values.sort(() => Math.random() - 0.5);
      return shuffledWords.slice(0, 6);
   } else {
      console.error(`Unable to find or retrieve words for key: ${key}`);
      return [];
   }
}

// Function to get a random choice from 0 to N-1
function getRandomChoice(N) {
   return Math.floor(Math.random() * N);
}

module.exports = {
   getRandomTopic,
   getRandomChoice,
   getRandomWords,
};
