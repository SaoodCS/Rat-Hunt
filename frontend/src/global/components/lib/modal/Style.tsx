import { Close } from '@styled-icons/evil/Close';
import styled from 'styled-components';
import CSS_Color from '../../../css/utils/colors';
import { CSS_ZIndex } from '../../../css/utils/zIndex';
import { SimpleAnimator } from '../animation/simpleAnimator/SimpleAnimator';
import { FullScreenWrapper } from '../positionModifiers/fullScreenWrapper/FullScreenWrapper';

export const ModalCenterer = styled(FullScreenWrapper)`
   z-index: ${CSS_ZIndex.get('modal')};
`;

export const ModalAnimator = styled(SimpleAnimator)``;

export const ModalHeader = styled.span<{ isDarkTheme: boolean }>`
   text-shadow: ${({ isDarkTheme }) =>
      isDarkTheme ? CSS_Color.darkThm.txtShadowHeaders : CSS_Color.lightThm.txtShadowHeaders};
`;

export const ModalBody = styled.div`
   box-sizing: border-box;
   max-height: 25em;
   font-size: 0.85em;
   word-spacing: 0.1em;
`;

export const ModalHeaderContainer = styled.div<{ isDarkTheme: boolean }>`
   padding: 1em;
   display: flex;
   justify-content: space-between;
   align-items: center;
   border-bottom: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 0.3)} 1px solid;
   border-radius: 5px;
   font-size: 1em;
   font-weight: 500;
`;

export const ModalContainer = styled.div<{ isDarkTheme: boolean }>`
   width: 17em;
   border-radius: 10px;
   background-color: ${({ isDarkTheme }) =>
      isDarkTheme
         ? CSS_Color.setRgbOpacity(CSS_Color.darkThm.dialog, 1)
         : CSS_Color.setRgbOpacity(CSS_Color.lightThm.dialog, 1)};
   color: ${CSS_Color.darkThm.txt};
   backdrop-filter: blur(50px);
   filter: brightness(1.25);
   border: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 0.3)} 1px solid;
`;

export const ModalCloseButton = styled(Close)`
   height: 1.25em;
   cursor: pointer;
   font-weight: 1000;
   border-radius: 50%;
   &:active {
      background-color: ${CSS_Color.lightThm.border};
      background-position: center;
      transition: background 0.05s;
   }
`;

export const ModalFooterWrapper = styled.div`
   display: flex;
   align-items: center;
   justify-content: right;
   padding-top: 0.5em;
`;
