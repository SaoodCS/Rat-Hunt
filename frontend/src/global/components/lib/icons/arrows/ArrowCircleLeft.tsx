import { ArrowCircleLeftOutline } from '@styled-icons/evaicons-outline/ArrowCircleLeftOutline';
import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';
import BoolHelper from '../../../../../../../shared/lib/helpers/bool/BoolHelper';

export const ArrowCircleLeftIcon = styled(ArrowCircleLeftOutline)<{ darktheme: 'true' | 'false' }>`
   ${MyCSS.Clickables.removeDefaultEffects};
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.warning : Color.lightThm.warning,
         1,
      )};
   cursor: pointer;
   ${MyCSS.Clickables.portable.changeBrightnessOnClick(0.5, 'persist')};
   ${MyCSS.Clickables.desktop.changeBrightnessOnHover(0.5)};
   filter: brightness(0.8);
`;
