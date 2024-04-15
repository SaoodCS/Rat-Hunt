import * as admin from 'firebase-admin';
import * as serviceAccount from '../../env/service-account-key.json';
import { topics } from '../../../../shared/app/utils/topics/topics';

if (!admin.apps.length) {
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
   });
}

async function updateTopics(): Promise<void> {
   const topicsRef = admin.firestore().collection('topics').doc('topics');
   await topicsRef.set({ topics });
}

updateTopics()
   .then(() => {
      // eslint-disable-next-line no-console
      console.log('Topics updated');
   })
   .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Error updating topics:', error);
   });
