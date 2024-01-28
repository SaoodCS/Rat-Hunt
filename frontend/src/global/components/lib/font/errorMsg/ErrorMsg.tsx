import type { ReactNode } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import { ErrorIcon, ErrorMsgHolder, ErrorMsgText } from './Style';

interface IErrorMsg {
   children: ReactNode;
}

export default function ErrorMsg(props: IErrorMsg): JSX.Element {
   const { children } = props;
   const { isDarkTheme } = useThemeContext();
   return (
      <ErrorMsgHolder>
         <ErrorIcon darktheme={isDarkTheme.toString()} />
         <ErrorMsgText>{children}</ErrorMsgText>
      </ErrorMsgHolder>
   );
}
