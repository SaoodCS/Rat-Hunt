import { QueryClient } from '@tanstack/react-query';
import NumberHelper from '../../../../shared/lib/helpers/number/NumberHelper';

export default class GlobalConfig {
   static queryClient = new QueryClient({
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
   });
}
