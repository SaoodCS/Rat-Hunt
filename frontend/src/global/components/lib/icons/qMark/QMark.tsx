import { QuestionOctagonFill as QMark } from '@styled-icons/bootstrap/QuestionOctagonFill';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const QMarkIcon = styled(QMark)<{ darktheme: 'true' | 'false' }>`
   ${MyCSS.Clickables.removeDefaultEffects};
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
