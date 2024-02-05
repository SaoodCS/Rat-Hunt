import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import APIHelper from '../../global/firebase/apis/helper/NApiHelper';
import { firestore } from '../../global/firebase/config/config';

interface ITopics {
   key: string;
   values: string[];
}

export default class TopicClass {
   public static key = {
      query: 'topics',
   };

   public static getTopicsQuery(
      options: UseQueryOptions<ITopics[]> = {},
   ): UseQueryResult<ITopics[], unknown> {
      return useQuery({
         queryKey: [TopicClass.key.query],
         queryFn: async () => TopicClass.getTopics(),
         ...options,
      });
   }

   private static async getTopics() {
      try {
         const docRef = doc(firestore, 'topics', 'topics');
         const docSnap = await getDoc(docRef);
         if (docSnap.exists()) {
            return docSnap.data().topics;
         } else {
            throw new APIHelper.ErrorThrower('Error: Document Does Not Exist');
         }
      } catch (e) {
         throw new APIHelper.ErrorThrower(APIHelper.handleError(e));
      }
   }
}
