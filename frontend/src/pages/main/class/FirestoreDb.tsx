import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../global/firebase/config/config';
import APIHelper from '../../../global/firebase/apis/helper/NApiHelper';

export namespace FirestoreDB {
   export namespace Topics {
      interface ITopics {
         key: string;
         values: string[];
      }

      export const key = {
         getTopics: 'getTopics',
      };

      export function getTopicsQuery(
         options: UseQueryOptions<ITopics[]> = {},
      ): UseQueryResult<ITopics[], unknown> {
         return useQuery({
            queryKey: [key.getTopics],
            queryFn: async (): Promise<ITopics[]> => {
               try {
                  const docRef = doc(firestore, 'topics', 'topics');
                  const docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                     return docSnap.data().topics;
                  }
                  throw new APIHelper.ErrorThrower('Error: Document Does Not Exist');
               } catch (e) {
                  throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
               }
            },
            ...options,
         });
      }
   }
}

export default FirestoreDB;
