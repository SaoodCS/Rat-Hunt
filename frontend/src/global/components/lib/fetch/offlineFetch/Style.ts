import { CloudOffline } from '@styled-icons/ionicons-outline/CloudOffline';
import styled from 'styled-components';
import CSS_Color from '../../../../css/utils/colors';

export const OfflineMsg = styled.div<{ isDarkTheme: boolean }>`
   font-size: 0.9em;
   color: ${({ isDarkTheme }) =>
      isDarkTheme
         ? CSS_Color.setRgbOpacity(CSS_Color.darkThm.txt, 0.5)
         : CSS_Color.setRgbOpacity(CSS_Color.lightThm.txt, 0.8)};
`;

export const OfflineFetchWrapper = styled.div`
   height: 5em;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   width: 100%;
`;

export const OfflineIcon = styled(CloudOffline)<{ darktheme: string }>`
   color: ${({ darktheme }) =>
      darktheme === 'true'
         ? CSS_Color.setRgbOpacity(CSS_Color.darkThm.error, 0.6)
         : CSS_Color.setRgbOpacity(CSS_Color.lightThm.error, 0.7)};
`;
