import { RefreshCircle } from '@styled-icons/ionicons-outline/RefreshCircle';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const RefreshCircleIcon = styled(RefreshCircle)<{ darktheme: 'true' | 'false' }>`
   ${MyCSS.Clickables.removeDefaultEffects};
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
      const mobileCol = MyCSS.Clickables.portable.changeColorOnClick(color, 'color', 'revert');
      const desktopCol = MyCSS.Clickables.desktop.changeColorOnHover(color, 'color');
      return MyCSS.Helper.concatStyles(mobileCol, desktopCol);
   }};
`;
