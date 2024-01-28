import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';

export const ScrnResponsiveFlexWrap = styled.div<{
   childrenMargin?: string;
   padding?: string;
}>`
   padding: ${({ padding }) => (padding ? padding : '0')};
   display: flex;
   flex-wrap: wrap;
   overflow: scroll;
   height: 100%;
   ${MyCSS.Scrollbar.hide};
   @media (max-width: 952px) {
      justify-content: center;
      align-items: center;
      height: 99%;
   }
`;
