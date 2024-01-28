import { useContext } from 'react';
import { ThemeContext } from '../../../../context/theme/ThemeContext';
import { OfflineFetchWrapper, OfflineIcon, OfflineMsg } from './Style';

export default function OfflineFetch(): JSX.Element {
   const { isDarkTheme } = useContext(ThemeContext);

   return (
      <OfflineFetchWrapper>
         <OfflineIcon size="100%" darktheme={isDarkTheme.toString()} />
         <OfflineMsg isDarkTheme={isDarkTheme}>No network connection</OfflineMsg>
      </OfflineFetchWrapper>
   );
}
