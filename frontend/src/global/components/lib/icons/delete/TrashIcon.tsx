import { Trash } from '@styled-icons/bootstrap/Trash';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../helpers/dataTypes/bool/BoolHelper';

export const TrashIcon = styled(Trash)<{ darktheme: 'true' | 'false' }>`
   ${MyCSS.Clickables.removeDefaultEffects};
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.error : Color.lightThm.error,
         0.5,
      )};
   ${({ darktheme }) => {
      const color = Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.error : Color.lightThm.error,
         1,
      );
      const mobileCol = MyCSS.Clickables.portable.changeColorOnClick(color, 'color', 'revert');
      const desktopCol = MyCSS.Clickables.desktop.changeColorOnHover(color, 'color');
      return MyCSS.Helper.concatStyles(mobileCol, desktopCol);
   }};
`;
