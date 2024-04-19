import { RefreshCircle } from '@styled-icons/ionicons-outline/RefreshCircle';
import styled from 'styled-components';
import BoolHelper from '../../../../../../../shared/lib/helpers/bool/BoolHelper';
import Color from '../../../../css/utils/colors';
import { CSS_Helper } from '../../../../css/utils/helper';
import CSS_Clickables from '../../../../css/utils/clickables';

export const RefreshCircleIcon = styled(RefreshCircle)<{ darktheme: 'true' | 'false' }>`
   ${CSS_Clickables.removeDefaultEffects};
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.warning : Color.lightThm.warning,
         0.5,
      )};

   ${({ darktheme }) => {
      const color = Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.warning : Color.lightThm.warning,
         1,
      );
      const mobileCol = CSS_Clickables.portable.changeColorOnClick(color, 'color', 'revert');
      const desktopCol = CSS_Clickables.desktop.changeColorOnHover(color, 'color');
      return CSS_Helper.concatStyles(mobileCol, desktopCol);
   }};
`;
