import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import JSXHelper from '../../../../helpers/dataTypes/jsx/jsxHelper';
import { PlaceholderLine } from '../../fetch/placeholders/Style';
import {
   CardListItem,
   CardListTitle,
   CardListWrapper,
   ItemRightColWrapper,
   ItemTitleAndIconWrapper,
   ItemTitleAndSubTitleWrapper,
} from '../Style';

interface ICardListPlaceholder {
   repeatItemCount: number;
}

export function CardListItemPlaceholder(): JSX.Element {
   const { isDarkTheme } = useThemeContext();

   return (
      <CardListItem isDarkTheme={isDarkTheme}>
         <ItemTitleAndIconWrapper>
            <PlaceholderLine isDarkTheme={isDarkTheme} height="2em" width="2em" />
            <ItemTitleAndSubTitleWrapper>
               <PlaceholderLine isDarkTheme={isDarkTheme} width="10em" margin="0em 1em 0.5em" />
               <PlaceholderLine
                  isDarkTheme={isDarkTheme}
                  width="5em"
                  margin="0em 1em 0em"
                  height="0.5em"
               />
            </ItemTitleAndSubTitleWrapper>
         </ItemTitleAndIconWrapper>
         <ItemRightColWrapper>
            <PlaceholderLine isDarkTheme={isDarkTheme} height="5em" width="2em" />
            <PlaceholderLine isDarkTheme={isDarkTheme} height="5em" width="5em" />
         </ItemRightColWrapper>
      </CardListItem>
   );
}

export default function CardListPlaceholder(props: ICardListPlaceholder): JSX.Element {
   const { repeatItemCount } = props;
   const { isDarkTheme } = useThemeContext();
   return (
      <>
         <CardListWrapper>
            <CardListTitle>
               <div>
                  <PlaceholderLine
                     isDarkTheme={isDarkTheme}
                     width="7em"
                     height={'1em'}
                     style={{
                        paddingTop: '1em',
                        paddingRight: '1em',
                        marginBottom: '1.5em',
                     }}
                  />
                  <PlaceholderLine isDarkTheme={isDarkTheme} width="5em" />
               </div>
            </CardListTitle>
            {JSXHelper.repeatJSX(<CardListItemPlaceholder />, repeatItemCount)}
         </CardListWrapper>
      </>
   );
}
