import { QueryClient } from '@tanstack/react-query';

import NumberHelper from '../helpers/dataTypes/number/NumberHelper';

export default class GlobalUtils {
   static config = {
      queryClient: new QueryClient({
         defaultOptions: {
            queries: {
               networkMode: 'offlineFirst',
               retry: false,
               retryOnMount: true,
               refetchOnMount: true,
               refetchOnWindowFocus: true,
               refetchOnReconnect: true,
               staleTime: NumberHelper.minsToMs(20),
               // cacheTime: minsToMs(1),
            },
         },
      }),
   };
}
