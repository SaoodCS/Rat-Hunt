import { QueryClient } from '@tanstack/react-query';
import {
   ArcElement,
   CategoryScale,
   Chart as ChartJS,
   Filler,
   Legend,
   LineElement,
   LinearScale,
   PointElement,
   Title,
   Tooltip,
} from 'chart.js';
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
      chartJSRegister: ChartJS.register(
         CategoryScale,
         LinearScale,
         PointElement,
         LineElement,
         ArcElement,
         Title,
         Tooltip,
         Filler,
         Legend,
      ),
   };
}
