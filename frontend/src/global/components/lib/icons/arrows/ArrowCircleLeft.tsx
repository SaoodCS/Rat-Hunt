import { ArrowCircleLeftOutline } from '@styled-icons/evaicons-outline/ArrowCircleLeftOutline';
import styled from 'styled-components';
import BoolHelper from '../../../../../../../shared/lib/helpers/bool/BoolHelper';
import CSS_Clickables from '../../../../css/utils/clickables';
import CSS_Color from '../../../../css/utils/colors';

export const ArrowCircleLeftIcon = styled(ArrowCircleLeftOutline)<{ darktheme: 'true' | 'false' }>`
   ${CSS_Clickables.removeDefaultEffects};
   color: ${({ darktheme }): string =>
      CSS_Color.setRgbOpacity(
         BoolHelper.strToBool(darktheme) ? CSS_Color.darkThm.warning : CSS_Color.lightThm.warning,
         1,
      )};
   cursor: pointer;
   ${CSS_Clickables.portable.changeBrightnessOnClick(0.5, 'persist')};
   ${CSS_Clickables.desktop.changeBrightnessOnHover(0.5)};
   filter: brightness(0.8);
`;
