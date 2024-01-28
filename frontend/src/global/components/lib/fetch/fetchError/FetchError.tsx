import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import { ErrorIcon, ErrorMsg, FetchErrorWrapper } from './Style';

interface IFetchError {
   iconHeightEm?: number;
}

export default function FetchError(props: IFetchError): JSX.Element {
   const { iconHeightEm } = props;
   const { isDarkTheme } = useThemeContext();

   return (
      <FetchErrorWrapper>
         <ErrorIcon darktheme={isDarkTheme.toString()} height={`${iconHeightEm || 5}em`} />
         <ErrorMsg isDarkTheme={isDarkTheme}>An error occured whilst getting data.</ErrorMsg>
      </FetchErrorWrapper>
   );
}
