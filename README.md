# Rat Hunt Monorepo

<a href="https://rat-hunt.web.app/" target="_blank">
Click here to Visit the Live Web App
</br>
</br>
<img src="frontend/resources/icons/logo-192x192.png" alt="Rat Hunt Logo" width="200"/>
</a>

---

## Gameplay Demo Video

<a href="https://youtu.be/WxCCqd9LFTQ" target="_blank">
Click here or press the play button to watch a gameplay demo video
</br>
</br>
<img src="resources/readme/thumbnails/youtubeplaybtn.png" alt="Rat Hunt Gameplay Demo" width = "70%">
</a>

---

## How to Play

1. At the start of each round, a rat is randomly selected out of the players in the game
2. All players receive the same secret word from the grid, except for the rat
3. All players then take turns to provide a clue related to the secret word in order to convince others that they are not the rat, without revealing the word to the rat. The rat also gives a clue based on their estimation of the secret word.
4. All players (including the rat) then vote on who they think the rat is, and the rat guesses what the secret word is.

### Scoring

- If the rat correctly guesses the secret word, they earn 1 point
- If the rat does not receive the most votes, they earn 1 point
- If the rat does not receive any votes, they earn 1 point
- If the rat receives the most votes, all players (except the rat) earn 1 point
- If a player that is not the rat correctly votes for the rat, they earn 1 point
- If the rat does not correctly guess the secret word, all players (except the rat) earn 1 point

---

## For Software Development

<a href="https://github.com/SaoodCS/Rat-Hunt/tree/prod/frontend">Click Here to View the Front-End README</a>
</br>
<a href="https://github.com/SaoodCS/Rat-Hunt/tree/prod/backend">Click Here to View the Back-End README</a>

### Prerequisites

1. Install Node version 20.12.2 _(If you have a different version of node installed on your machine, install version 20.12.2 through and then set it as the active version)_
2. Install Firebase CLI v13.7.2 for hosting and deployment purposes by running `npm install -g firebase-tools@13.7.2` in terminal

### Scripts

- `npm run start` - Starts the front-end development server
- `npm run app-deploy` - Builds & deploys the front-end to firebase hosting and back-end to firebase cloud functions
- `npm run app-install` - Installs all dependencies in all sub-directories
