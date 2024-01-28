import Sheet from 'react-modal-sheet';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css } from 'styled-components';
import Color from '../../../css/colors';
import { ModalCloseButton } from '../modal/Style';

const darkModeColorTop: string = Color.setRgbOpacity(Color.darkThm.bg, 0.95);
const darkModeColorBottom: string = Color.setRgbOpacity(Color.darkThm.bg, 0.99);

const commonHeaderStyles = (darktheme: boolean): FlattenSimpleInterpolation => css`
   background-color: ${darktheme ? darkModeColorTop : Color.lightThm.bg};
   display: flex;
   justify-content: center;
   align-items: center;
   border-top-left-radius: 7px;
   border-top-right-radius: 7px;
`;

export const SheetContentWrapper = styled.div<{ height: string }>`
   height: ${({ height }) => height};
`;

export const CustomPanelHeader = styled.div<{ darktheme: string }>`
   ${({ darktheme }) => commonHeaderStyles(darktheme === 'true')};
   padding-top: 1em;
   padding-bottom: 1em;
   font-size: 1em;
   background-color: ${({ darktheme }) =>
      darktheme === 'true' ? Color.darkThm.bg : Color.lightThm.bg};
`;

export const CustomBottomPanelSheet = styled(Sheet)<{ darktheme: string }>`
   .react-modal-sheet-backdrop {
   }
   .react-modal-sheet-container {
   }
   .react-modal-sheet-header {
      ${({ darktheme }) => commonHeaderStyles(darktheme === 'true')};
      padding-top: 0.1em;
   }
   .react-modal-sheet-drag-indicator {
   }
   .react-modal-sheet-content {
      background: ${({ darktheme }) =>
         darktheme === 'true'
            ? `linear-gradient(${darkModeColorTop}, ${darkModeColorBottom})`
            : Color.lightThm.bg};
   }
`;

export const PanelCloseButton = styled(ModalCloseButton)`
   font-size: 1.05em;
`;

export const HeaderColumnLeft = styled.div`
   width: 25%;
   padding-left: 1em;
   display: flex;
   justify-content: left;
`;

export const HeaderColumnCenter = styled(HeaderColumnLeft)`
   display: flex;
   justify-content: center;
   width: 50%;
`;

export const HeaderColumnRight = styled(HeaderColumnLeft)`
   display: flex;
   justify-content: right;
   width: 25%;
   padding-right: 1em;
`;
