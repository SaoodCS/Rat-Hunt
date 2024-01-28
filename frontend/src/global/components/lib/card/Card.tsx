import styled from 'styled-components';
import Color from '../../../css/colors';
import MyCSS from '../../../css/MyCSS';

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
   @media (min-width: ${MyCSS.PortableBp.asPx}) {
      width: 20em;
   }
`;
