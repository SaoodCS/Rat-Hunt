import * as admin from 'firebase-admin';
import { topics } from '../../../../shared/app/utils/topics/topics';
import { serviceAccountKey } from '../helpers/serviceAccountKey';

if (!admin.apps.length) {
   admin.initializeApp({
      credential: admin.credential.cert({
         projectId: serviceAccountKey.project_id,
         clientEmail: serviceAccountKey.client_email,
         privateKey: serviceAccountKey.private_key,
      }),
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
