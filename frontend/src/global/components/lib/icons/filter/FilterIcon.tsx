import { Filter } from '@styled-icons/fluentui-system-filled/Filter';
import styled from 'styled-components';
import BoolHelper from '../../../../../../../shared/helpers/bool/BoolHelper';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';

export const FilterIcon = styled(Filter)<{ darktheme: 'true' | 'false' }>`
   ${MyCSS.Clickables.removeDefaultEffects};
   cursor: pointer;
   color: ${({ darktheme }) =>
      BoolHelper.strToBool(darktheme) ? Color.darkThm.accent : Color.lightThm.accent};
   ${({ darktheme }) => {
      const bgColor = Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.accent : Color.lightThm.accent,
         0.5,
      );
      const mobile = MyCSS.Clickables.portable.changeColorOnClick(bgColor, 'color', 'persist');
      const desktop = MyCSS.Clickables.desktop.changeColorOnHover(bgColor, 'color');
      return MyCSS.Helper.concatStyles(mobile, desktop);
   }};
`;
