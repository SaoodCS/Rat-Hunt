import type { ReactNode } from 'react';
import useThemeContext from '../../../../context/theme/hooks/useThemeContext';
import { SuccessIcon, SuccessMsgHolder, SuccessMsgText } from './Style';

interface ISuccessMsg {
   children: ReactNode;
}

export default function SuccessMsg(props: ISuccessMsg): JSX.Element {
   const { children } = props;
   const { isDarkTheme } = useThemeContext();
   return (
      <SuccessMsgHolder>
         <SuccessIcon darktheme={isDarkTheme.toString()} />
         <SuccessMsgText>{children}</SuccessMsgText>
      </SuccessMsgHolder>
   );
}
