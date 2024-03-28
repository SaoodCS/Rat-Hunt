import styled from 'styled-components';
import MyCSS from '../../../css/MyCSS';

export const RelativePositioner = styled.div`
   position: relative;
   width: 100%;
   height: 100%;
`;

export const ChildrenContainer = styled.div<{
   scrollbarWidth: number;
   showScrollbar: boolean;
}>`
   height: 100%;
   width: ${({ scrollbarWidth, showScrollbar }) =>
      showScrollbar ? `calc(100% - ${scrollbarWidth}px)` : '100%'};
   box-sizing: border-box;
   overflow-y: scroll;
   ${MyCSS.Scrollbar.hide};
`;

export const ScrollbarContainer = styled.div<{
   scrollbarWidth: number;
   showScrollbar: boolean;
}>`
   position: absolute;
   width: ${({ scrollbarWidth }) => `${scrollbarWidth}px`};
   right: 0;
   top: 0;
   bottom: 0;
   z-index: -1;
   display: ${({ showScrollbar }) => !showScrollbar && 'none'};
   background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0));
   box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
`;

export const ScrollbarThumb = styled.div<{
   divHeight: number;
   scrollHeight: number;
   scrollPosition: number;
   thumbHeight: number;
   scrollbarWidth: number;
   showScrollbar: boolean;
}>`
   ${MyCSS.Clickables.removeDefaultEffects};
   ${MyCSS.Clickables.desktop.changeBrightnessOnHover(2)};
   ${MyCSS.Clickables.portable.changeBrightnessOnClick(1.5, 'revert')};
   position: absolute;
   width: ${({ scrollbarWidth }) => `${scrollbarWidth}px`};
   right: 0;
   bottom: 0;
   height: ${({ thumbHeight }) => thumbHeight}px;
   top: ${({ divHeight, scrollHeight, scrollPosition, thumbHeight }) => {
      const trackHeight = divHeight - thumbHeight;
      const thumbPosition = (scrollPosition / (scrollHeight - divHeight)) * trackHeight;
      return thumbPosition;
   }}px;
   display: ${({ showScrollbar }) => !showScrollbar && 'none'};
   background: rgba(255, 255, 255, 0.1);
   border-radius: 5px;
   box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
   cursor: pointer;
`;
