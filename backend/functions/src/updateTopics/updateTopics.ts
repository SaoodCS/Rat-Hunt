import * as admin from 'firebase-admin';
import * as serviceAccount from '../../env/service-account-key.json';
import { animals } from '../topics/animals/animals';
import { countries } from '../topics/countries/countries';
import { food } from '../topics/food/food';
import { movies } from '../topics/movies/movies';
import { sports } from '../topics/sports/sports';
import { music } from '../topics/musicGenres/musicGenres';
import { singers } from '../topics/singers/singers';
import { clothing } from '../topics/itemOfClothing/itemOfClothing';
import type AppTypes from '../../../../shared/app/types/AppTypes';

if (!admin.apps.length) {
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
   });
}

const topics: AppTypes.Topic[] = [
   animals,
   countries,
   movies,
   sports,
   food,
   music,
   clothing,
   singers,
];

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
