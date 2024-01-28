import { useContext } from 'react';
import { TextBtn } from '../../global/components/lib/button/textBtn/Style';
import { ThemeContext } from '../../global/context/theme/ThemeContext';
import { ErrorHeading, ErrorPageWrapper, ErrorSubheading, ErrorText } from './style/Style';

export default function NotFound(): JSX.Element {
   const { isDarkTheme } = useContext(ThemeContext);

   return (
      <ErrorPageWrapper>
         <ErrorHeading>404</ErrorHeading>
         <ErrorSubheading>Not Found</ErrorSubheading>
         <ErrorText>The requested page may have moved, or it just doesn&apos;t exist.</ErrorText>

         <TextBtn
            isDarkTheme={isDarkTheme}
            style={{ marginTop: '0.5em' }}
            onClick={() => (window.location.href = '/')}
         >
            Go Home
         </TextBtn>
      </ErrorPageWrapper>
   );
}
