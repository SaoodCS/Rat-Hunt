import * as admin from 'firebase-admin';
import type AppTypes from '../../../../shared/app/types/AppTypes';
import * as serviceAccount from '../../env/service-account-key.json';
import { addDummyUsersToRoom, baseDummyUser, generateDummyUsers } from './helpers/helpers';
import { topics } from '../../../../shared/app/utils/topics/topics';

if (!admin.apps.length) {
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
   });
}

async function createDummyRoom(): Promise<void> {
   const selectedTopic = topics[0].key;
   const selectedWord = topics[0].values[0];
   const baseDummy = await baseDummyUser();
   const dummyUsers: AppTypes.UserState[] = generateDummyUsers(baseDummy, [
      { userId: 'dummyUser2' },
      { userId: 'dummyUser3' },
      { userId: 'dummyUser4', spectate: true },
   ]);
   const turnQueue = dummyUsers.map((user) => user.userId);
   const dummyRoom: AppTypes.Room = {
      gameStarted: false,
      roomId: 'DUMMY',
      gameState: {
         activeTopic: selectedTopic,
         activeWord: selectedWord,
         currentRat: dummyUsers[0].userId,
         ratGuess: '',
         currentRound: 0,
         currentTurn: dummyUsers[0].userId,
         currentTurnChangedAt: '',
         numberOfRoundsSet: 4,
         userStates: [],
         turnQueue,
      },
   };
   const roomWithDummyUsers = addDummyUsersToRoom(dummyRoom, dummyUsers);
   const roomRef = admin.firestore().collection('games').doc('room-DUMMY');
   await roomRef.set(roomWithDummyUsers);
}

createDummyRoom()
   .then(() => {
      // eslint-disable-next-line no-console
      console.log('Dummy room created');
   })
   .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error creating dummy room:', error);
   });
