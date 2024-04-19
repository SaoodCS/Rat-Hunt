import styled from 'styled-components';
import CSS_Clickables from '../../../css/utils/clickables';
import CSS_Color from '../../../css/utils/colors';
import { FlatListWrapper } from '../flatList/Style';

export const CardListTitle = styled.div`
   margin-bottom: 1em;
   display: flex;
   align-items: center;
`;

export const CardListWrapper = styled(FlatListWrapper)`
   padding: 1em;
   box-sizing: border-box;
`;

export const ItemTitleAndSubTitleWrapper = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   align-items: start;
`;

export const ItemRightColWrapper = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   align-items: end;
`;

export const ItemTitleAndIconWrapper = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
`;

export const CardListItem = styled.div<{ isDarkTheme: boolean; width?: string }>`
   ${CSS_Clickables.removeDefaultEffects};
   display: flex;
   border: 1px solid ${CSS_Color.darkThm.border};
   height: 5em;
   box-sizing: border-box;
   padding: 1em;
   border-radius: 10px;
   font-size: 0.9em;
   flex-direction: row;
   justify-content: space-between;
   background-color: ${({ isDarkTheme }) =>
      CSS_Color.setRgbOpacity(isDarkTheme ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt, 0.05)};
   margin-bottom: 1em;
   width: ${({ width }) => width || '100%'};
   cursor: pointer;
`;
