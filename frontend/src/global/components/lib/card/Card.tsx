import styled from 'styled-components';
import Color from '../../../css/utils/colors';
import { CSS_Media } from '../../../css/utils/media';

export const Card = styled.div<{ isDarkTheme: boolean }>`
   border: ${({ isDarkTheme }) =>
      isDarkTheme ? `1px solid ${Color.darkThm.border}` : `1px solid ${Color.lightThm.border}`};
   margin: 1em;
   border-radius: 10px;
`;

export const CardWidgetWrapper = styled.div<{ bgColor: string; height?: string }>`
   height: ${({ height }) => height || '6em'};
   margin-bottom: 1em;
   width: 100%;
   border-radius: 10px;
   background-color: ${({ bgColor }) => bgColor};
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   @media (min-width: ${CSS_Media.PortableBp.asPx}) {
      width: 20em;
   }
`;
