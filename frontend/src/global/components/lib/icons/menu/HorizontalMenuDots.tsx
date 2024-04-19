import { DotsHorizontalRounded } from '@styled-icons/boxicons-regular/DotsHorizontalRounded';
import styled from 'styled-components';
import BoolHelper from '../../../../../../../shared/lib/helpers/bool/BoolHelper';
import Color from '../../../../css/utils/colors';
import { CSS_Helper } from '../../../../css/utils/helper';
import CSS_Clickables from '../../../../css/utils/clickables';

export const HorizontalMenuDots = styled(DotsHorizontalRounded)<{ darktheme: 'true' | 'false' }>`
   ${CSS_Clickables.removeDefaultEffects};
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
      const mobileCol = CSS_Clickables.portable.changeColorOnClick(color, 'color', 'persist');
      const mobileBorder = CSS_Clickables.portable.changeColorOnClick(color, 'border', 'persist');
      const desktopCol = CSS_Clickables.desktop.changeColorOnHover(color, 'color');
      const desktopBorder = CSS_Clickables.desktop.changeColorOnHover(color, 'border');
      return CSS_Helper.concatStyles(mobileCol, mobileBorder, desktopCol, desktopBorder);
   }};
   transition: all 0.3s ease-in-out;
`;
