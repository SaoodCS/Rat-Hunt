import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../env/service-account-key.json';
import type { IFullUser, IRoom } from '../../helpers/FirebaseHelp';
import { addDummyUsersToRoom, baseDummyUser, generateDummyUsers } from './helpers/helpers';

if (!admin.apps.length) {
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
   });
}

async function createDummyRoom(): Promise<void> {
   const dummyRoom: IRoom = {
      gameStarted: false,
      roomId: 'DUMMY',
      users: [],
      gameState: {
         activeTopic: '',
         activeWord: '',
         currentRat: '',
         currentRound: 0,
         currentTurn: '',
         numberOfRoundsSet: 0,
         userStates: [],
      },
   };
   const dummyUsers: IFullUser[] = generateDummyUsers(baseDummyUser, [
      { userId: 'dummyUser2' },
      { userId: 'dummyUser3' },
      { userId: 'dummyUser4', spectate: true },
   ]);
   const roomWithDummyUsers = addDummyUsersToRoom(dummyRoom, dummyUsers);
   const roomRef = admin.firestore().collection('rooms').doc('room-DUMMY');
   await roomRef.set(roomWithDummyUsers);
}

createDummyRoom().catch((error) => {
   // eslint-disable-next-line no-console
   console.error('Error creating dummy room:', error);
});
