import { ArrowCircleLeftOutline } from '@styled-icons/evaicons-outline/ArrowCircleLeftOutline';
import styled from 'styled-components';
import BoolHelper from '../../../../../../../shared/lib/helpers/bool/BoolHelper';
import Color from '../../../../css/utils/colors';
import CSS_Clickables from '../../../../css/utils/clickables';

export const ArrowCircleLeftIcon = styled(ArrowCircleLeftOutline)<{ darktheme: 'true' | 'false' }>`
   ${CSS_Clickables.removeDefaultEffects};
   color: ${({ darktheme }): string =>
      Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? Color.darkThm.warning : Color.lightThm.warning,
         1,
      )};
   cursor: pointer;
   ${CSS_Clickables.portable.changeBrightnessOnClick(0.5, 'persist')};
   ${CSS_Clickables.desktop.changeBrightnessOnHover(0.5)};
   filter: brightness(0.8);
`;
