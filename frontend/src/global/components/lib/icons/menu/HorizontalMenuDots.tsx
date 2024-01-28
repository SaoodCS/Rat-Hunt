import { DotsHorizontalRounded } from '@styled-icons/boxicons-regular/DotsHorizontalRounded';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const HorizontalMenuDots = styled(DotsHorizontalRounded)<{ darktheme: 'true' | 'false' }>`
   ${MyCSS.Clickables.removeDefaultEffects};
   height: 1em;
   color: ${({ darktheme }) =>
      darktheme === 'true' ? Color.darkThm.accent : Color.lightThm.accent};
   border-radius: 50%;
   border: 1px solid
      ${({ darktheme }) => (darktheme === 'true' ? Color.darkThm.accent : Color.lightThm.accent)};
   cursor: pointer;
   ${({ darktheme }) => {
      const color = Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.accent : Color.lightThm.accent,
         0.5,
      );
      const mobileCol = MyCSS.Clickables.portable.changeColorOnClick(color, 'color', 'persist');
      const mobileBorder = MyCSS.Clickables.portable.changeColorOnClick(color, 'border', 'persist');
      const desktopCol = MyCSS.Clickables.desktop.changeColorOnHover(color, 'color');
      const desktopBorder = MyCSS.Clickables.desktop.changeColorOnHover(color, 'border');
      return MyCSS.Helper.concatStyles(mobileCol, mobileBorder, desktopCol, desktopBorder);
   }};
   transition: all 0.3s ease-in-out;
`;
