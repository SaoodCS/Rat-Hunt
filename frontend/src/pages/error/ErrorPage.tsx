import { TextBtn } from '../../global/components/lib/button/textBtn/Style';
import useThemeContext from '../../global/context/theme/hooks/useThemeContext';
import { ErrorHeading, ErrorPageWrapper, ErrorSubheading, ErrorText } from './style/Style';

export default function ErrorPage(): JSX.Element {
   const { isDarkTheme } = useThemeContext();
   return (
      <ErrorPageWrapper>
         <ErrorHeading>Oops!</ErrorHeading>
         <ErrorSubheading>Something went wrong</ErrorSubheading>
         <ErrorText>
            Not to worry, try the following link to return back to the home page.
         </ErrorText>
         <TextBtn
            onClick={() => (window.location.href = '/')}
            isDarkTheme={isDarkTheme}
            style={{ marginTop: '0.5em' }}
         >
            Go Home
         </TextBtn>
      </ErrorPageWrapper>
   );
}
