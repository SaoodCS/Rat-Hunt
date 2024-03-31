import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../env/service-account-key.json';
import type { IUserStates } from '../../helpers/FirebaseHelp';
import { FBHelp, type IRoom } from '../../helpers/FirebaseHelp';
import { addDummyUsersToRoom, baseDummyUser, generateDummyUsers } from './helpers/helpers';

if (!admin.apps.length) {
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
   });
}

async function createDummyRoom(): Promise<void> {
   const topics = await FBHelp.getTopics();
   if (!topics) throw new Error('No topics found');
   const selectedTopic = topics[0].key;
   const selectedWord = topics[0].values[0];
   const dummyUsers: IUserStates[] = generateDummyUsers(baseDummyUser, [
      { userId: 'dummyUser2' },
      { userId: 'dummyUser3' },
      { userId: 'dummyUser4', spectate: true },
   ]);
   const dummyRoom: IRoom = {
      gameStarted: false,
      roomId: 'DUMMY',
      gameState: {
         activeTopic: selectedTopic,
         activeWord: selectedWord,
         currentRat: dummyUsers[0].userId,
         currentRound: 0,
         currentTurn: dummyUsers[0].userId,
         numberOfRoundsSet: 4,
         userStates: [],
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
