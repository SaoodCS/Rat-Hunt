import { CheckCircle } from '@styled-icons/material/CheckCircle';
import styled from 'styled-components';
import CSS_Color from '../../../../css/utils/colors';

export const SuccessMsgText = styled.div`
   margin-left: 0.5em;
   font-size: 0.9em;
   width: 90%;
`;

export const SuccessIcon = styled(CheckCircle)<{ darktheme: string }>`
   width: 10%;
   color: ${({ darktheme }) =>
      darktheme === 'true' ? CSS_Color.darkThm.success : CSS_Color.lightThm.success};
`;

export const SuccessMsgHolder = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
`;
