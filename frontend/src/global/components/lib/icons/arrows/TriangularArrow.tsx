import { UpArrow } from '@styled-icons/boxicons-solid/UpArrow';
import styled from 'styled-components';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const TriangularArrowIcon = styled(UpArrow)<{
   direction: 'up' | 'down' | 'left' | 'right';
   darktheme: 'true' | 'false';
   type?: 'warning' | 'success' | 'error';
}>`
   transform: scale(0.8, 1);
   rotate: ${({ direction }) =>
      ({ up: '0deg', down: '180deg', left: '90deg', right: '270deg' })[direction]};

   color: ${({ darktheme, type }) =>
      ({
         warning: BoolHelper.strToBool(darktheme) ? Color.darkThm.warning : Color.lightThm.warning,
         success: BoolHelper.strToBool(darktheme) ? Color.darkThm.success : Color.lightThm.success,
         error: BoolHelper.strToBool(darktheme) ? Color.darkThm.error : Color.lightThm.error,
         default: BoolHelper.strToBool(darktheme) ? Color.darkThm.txt : Color.lightThm.txt,
      })[type || 'default']};
`;
