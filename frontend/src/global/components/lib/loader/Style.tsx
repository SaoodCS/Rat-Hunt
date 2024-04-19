import styled from 'styled-components';
import Color from '../../../css/utils/colors';
import { FullScreenWrapper } from '../positionModifiers/fullScreenWrapper/FullScreenWrapper';
import CSS_ZIndex from '../../../css/utils/zIndex';

export const CustomSpinnerWrapper = styled(FullScreenWrapper)`
   z-index: ${CSS_ZIndex.get('loader')};
`;

export const CustomSpinner = styled.div<{
   isDarkTheme: boolean;
   disableSpin?: boolean;
   sizePx?: string;
}>`
   border: ${({ isDarkTheme, sizePx }) =>
      isDarkTheme
         ? `calc(${sizePx || '70px'} / 7 ) solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.5)}`
         : `calc(${sizePx || '70px'} / 7 ) solid ${Color.setRgbOpacity(Color.lightThm.txt, 0.5)}`};
   border-top: ${({ isDarkTheme, sizePx }) =>
      isDarkTheme
         ? `calc(${sizePx || '70px'} / 7 ) solid ${Color.darkThm.txt}`
         : `calc(${sizePx || '70px'} / 7 ) solid ${Color.lightThm.txt}`};
   border-radius: 50%;
   height: ${({ sizePx }) => sizePx || '70px'};
   width: ${({ sizePx }) => sizePx || '70px'};
   animation: ${({ disableSpin }) => (disableSpin ? 'none' : 'spin 1s linear infinite')};

   @keyframes spin {
      0% {
         transform: rotate(0deg);
      }

      100% {
         transform: rotate(360deg);
      }
   }
`;
