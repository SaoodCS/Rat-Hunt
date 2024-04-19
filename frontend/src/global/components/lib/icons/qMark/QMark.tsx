import { QuestionOctagonFill as QMark } from '@styled-icons/bootstrap/QuestionOctagonFill';
import styled from 'styled-components';
import BoolHelper from '../../../../../../../shared/lib/helpers/bool/BoolHelper';
import CSS_Clickables from '../../../../css/utils/clickables';
import CSS_Color from '../../../../css/utils/colors';
import { CSS_Helper } from '../../../../css/utils/helper';

export const QMarkIcon = styled(QMark)<{ darktheme: 'true' | 'false' }>`
   ${CSS_Clickables.removeDefaultEffects};
   color: ${({ darktheme }) =>
      BoolHelper.strToBool(darktheme) ? CSS_Color.darkThm.accent : CSS_Color.lightThm.accent};
   ${({ darktheme }) => {
      const bgColor = CSS_Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? CSS_Color.darkThm.accent : CSS_Color.lightThm.accent,
         0.5,
      );
      const mobile = CSS_Clickables.portable.changeColorOnClick(bgColor, 'color', 'persist');
      const desktop = CSS_Clickables.desktop.changeColorOnHover(bgColor, 'color');
      return CSS_Helper.concatStyles(mobile, desktop);
   }};
`;
