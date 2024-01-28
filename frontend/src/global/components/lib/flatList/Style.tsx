import styled from 'styled-components';
import MyCSS from '../../../css/MyCSS';
import Color from '../../../css/colors';

export const FlatListWrapper = styled.div`
   width: 100%;
   ${MyCSS.Scrollbar.hide};
`;

export const FlatListItem = styled.div<{ isDarkTheme: boolean }>`
   ${MyCSS.Clickables.removeDefaultEffects};
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
      const bgColor = Color.setRgbOpacity(
         isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         0.1,
      );
      const mobile = MyCSS.Clickables.portable.changeColorOnClick(
         bgColor,
         'background-color',
         'revert',
      );
      const desktop = MyCSS.Clickables.desktop.changeColorOnHover(bgColor, 'background-color');
      return MyCSS.Helper.concatStyles(mobile, desktop);
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
