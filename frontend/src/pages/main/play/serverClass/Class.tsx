import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import APIHelper from '../../../../global/firebase/apis/helper/NApiHelper';

interface ITopics {
   topics: string[];
}

export default class ServerClass {
   public static Endpoints = {
      local: {
         base: 'http://localhost:3000',
         topics: 'http://localhost:3000/api/topics',
      },
      prod: {
         // TODO: Update these once server is deployed
         base: '',
         topics: '',
      },
   };

   public static key = {
      query: 'topics',
   };

   public static getTopicsQuery(
      options: UseQueryOptions<ITopics> = {},
   ): UseQueryResult<ITopics, unknown> {
      return useQuery({
         queryKey: [ServerClass.key.query],
         queryFn: async () =>
            APIHelper.fetcher<ITopics>(undefined, 'GET', ServerClass.Endpoints.local.topics),
         ...options,
      });
   }
}
