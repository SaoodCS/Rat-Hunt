import styled from 'styled-components';
import CSS_Clickables from '../../../css/utils/clickables';
import CSS_Color from '../../../css/utils/colors';
import { CSS_Helper } from '../../../css/utils/helper';
import { CSS_Scrollbar } from '../../../css/utils/scrollbar';

export const FlatListWrapper = styled.div`
   width: 100%;
   ${CSS_Scrollbar.hide};
`;

export const FlatListItem = styled.div<{ isDarkTheme: boolean }>`
   ${CSS_Clickables.removeDefaultEffects};
   height: 6em;
   width: 100%;
   box-sizing: border-box;
   padding: 1em;
   display: flex;
   flex-direction: column;
   justify-content: center;
   border-bottom: 1px solid
      ${({ isDarkTheme }) => (isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')};
   cursor: pointer;
   ${({ isDarkTheme }) => {
      const bgColor = CSS_Color.setRgbOpacity(
         isDarkTheme ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt,
         0.1,
      );
      const mobile = CSS_Clickables.portable.changeColorOnClick(
         bgColor,
         'background-color',
         'revert',
      );
      const desktop = CSS_Clickables.desktop.changeColorOnHover(bgColor, 'background-color');
      return CSS_Helper.concatStyles(mobile, desktop);
   }}
`;

export const FirstRowWrapper = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin-bottom: 0.2em;
   margin-left: 0.4em;
`;

export const ItemTitleWrapper = styled.div`
   font-weight: 600;
   display: flex;
`;

export const ItemTitle = styled.div`
   padding-right: 0.25em;
`;

export const ItemValue = styled.div``;

export const SecondRowTagsWrapper = styled.div`
   display: flex;
   flex-wrap: wrap;
`;

export const Tag = styled.div<{ bgColor: string }>`
   font-size: 0.7em;
   border-radius: 1em;
   text-align: center;
   width: fit-content;
   padding-right: 0.5em;
   padding-left: 0.5em;
   padding-top: 0.25em;
   padding-bottom: 0.25em;
   margin-left: 0.25em;
   margin: 0.4em;
   background-color: ${({ bgColor }) => bgColor};
`;
