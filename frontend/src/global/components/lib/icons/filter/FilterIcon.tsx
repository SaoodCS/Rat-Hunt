import { Filter } from '@styled-icons/fluentui-system-filled/Filter';
import styled from 'styled-components';
import BoolHelper from '../../../../../../../shared/lib/helpers/bool/BoolHelper';
import Color from '../../../../css/utils/colors';
import { CSS_Helper } from '../../../../css/utils/helper';
import CSS_Clickables from '../../../../css/utils/clickables';

export const FilterIcon = styled(Filter)<{ darktheme: 'true' | 'false' }>`
   ${CSS_Clickables.removeDefaultEffects};
   cursor: pointer;
   color: ${({ darktheme }) =>
      BoolHelper.strToBool(darktheme) ? Color.darkThm.accent : Color.lightThm.accent};
   ${({ darktheme }) => {
      const bgColor = Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.accent : Color.lightThm.accent,
         0.5,
      );
      const mobile = CSS_Clickables.portable.changeColorOnClick(bgColor, 'color', 'persist');
      const desktop = CSS_Clickables.desktop.changeColorOnHover(bgColor, 'color');
      return CSS_Helper.concatStyles(mobile, desktop);
   }};
`;
