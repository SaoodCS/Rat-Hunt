import styled, { css } from 'styled-components';
import Color from '../../../css/colors';

const rightPos = css`
   bottom: calc(-50%);
   left: 90%;
`;

const topPos = css`
   bottom: calc(100% + 0.5em);
   left: 4em;
`;

const centerLeftPos = css`
   bottom: calc(-50%);
   left: 25%;
`;

const centerRightPos = css`
   bottom: calc(-50%);
   left: 50%;
`;

export const TooltipContent = styled.div<{
   isDarkTheme: boolean;
   width?: string;
   height?: string;
   positioning: 'top' | 'left' | 'right' | 'bottom' | 'center-left' | 'center-right';
}>`
   position: absolute;
   width: ${({ width }) => (width ? width : 'auto')};
   height: ${({ height }) => (height ? height : 'auto')};
   padding: 0.5em;
   font-size: 0.8em;
   border-radius: 10px;
   background-color: ${Color.setRgbOpacity(Color.darkThm.dialog, 1)};
   backdrop-filter: blur(5px);
   visibility: hidden;
   opacity: 0;
   transition: all 0.2s ease-in-out;
   ${({ positioning }) => {
      if (positioning === 'right') return rightPos;
      if (positioning === 'top') return topPos;
      if (positioning === 'center-left') return centerLeftPos;
      if (positioning === 'center-right') return centerRightPos;
   }};
   z-index: 1;
`;

export const TooltipWrapper = styled.div`
   width: 100%;
   position: relative;
   &:hover {
      & ${TooltipContent} {
         visibility: visible;
         opacity: 1;
      }
   }
`;
