import { ArrowCircleLeftOutline } from '@styled-icons/evaicons-outline/ArrowCircleLeftOutline';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const ArrowCircleLeftIcon = styled(ArrowCircleLeftOutline)<{ darktheme: 'true' | 'false' }>`
   ${MyCSS.Clickables.removeDefaultEffects};
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.accent : Color.lightThm.accent,
         0.5,
      )};
   cursor: pointer;
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
