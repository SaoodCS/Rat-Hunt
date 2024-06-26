import { Error } from '@styled-icons/material/Error';
import styled from 'styled-components';
import CSS_Color from '../../../../css/utils/colors';

export const ErrorMsgText = styled.div`
   margin-left: 0.5em;
   font-size: 0.9em;
   width: 90%;
`;

export const ErrorIcon = styled(Error)<{ darktheme: string }>`
   width: 10%;
   color: ${({ darktheme }) =>
      darktheme === 'true' ? CSS_Color.darkThm.error : CSS_Color.lightThm.error};
`;

export const ErrorMsgHolder = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
`;
