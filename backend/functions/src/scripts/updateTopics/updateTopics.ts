import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../env/service-account-key.json';
import type ITopic from '../../helpers/FirebaseHelp';
import { animals } from '../../topics/animals/animals';
import { countries } from '../../topics/countries/countries';
import { food } from '../../topics/food/food';
import { movies } from '../../topics/movies/movies';
import { sports } from '../../topics/sports/sports';

if (!admin.apps.length) {
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
   });
}

const topics: ITopic[] = [animals, countries, movies, sports, food];

async function updateTopics(): Promise<void> {
   const topicsRef = admin.firestore().collection('topics').doc('topics');
   await topicsRef.set({ topics });
}

updateTopics().catch((error) => {
   // eslint-disable-next-line no-console
   console.error('Error updating topics:', error);
});
