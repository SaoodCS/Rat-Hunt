import { ArrowCircleRightOutline } from '@styled-icons/evaicons-outline/ArrowCircleRightOutline';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../../../../shared/lib/helpers/bool/BoolHelper';

export const ArrowCircleRightIcon = styled(ArrowCircleRightOutline)<{
   darktheme: 'true' | 'false';
}>`
   ${MyCSS.Clickables.removeDefaultEffects};
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.accent : Color.lightThm.accent,
         0.5,
      )};

   ${({ darktheme }) => {
      const color = Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.accent : Color.lightThm.accent,
         1,
      );
      const mobileCol = MyCSS.Clickables.portable.changeColorOnClick(color, 'color', 'revert');
      const desktopCol = MyCSS.Clickables.desktop.changeColorOnHover(color, 'color');
      return MyCSS.Helper.concatStyles(mobileCol, desktopCol);
   }};
`;
