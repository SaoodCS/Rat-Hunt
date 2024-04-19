import { UpArrow } from '@styled-icons/boxicons-solid/UpArrow';
import styled from 'styled-components';
import BoolHelper from '../../../../../../../shared/lib/helpers/bool/BoolHelper';
import CSS_Color from '../../../../css/utils/colors';

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
         warning: BoolHelper.strToBool(darktheme)
            ? CSS_Color.darkThm.warning
            : CSS_Color.lightThm.warning,
         success: BoolHelper.strToBool(darktheme)
            ? CSS_Color.darkThm.success
            : CSS_Color.lightThm.success,
         error: BoolHelper.strToBool(darktheme)
            ? CSS_Color.darkThm.error
            : CSS_Color.lightThm.error,
         default: BoolHelper.strToBool(darktheme) ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt,
      })[type || 'default']};
`;
