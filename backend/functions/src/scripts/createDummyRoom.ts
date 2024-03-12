import * as admin from 'firebase-admin';
import * as serviceAccount from '../../env/service-account-key.json';

if (!admin.apps.length) {
   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
   });
}
