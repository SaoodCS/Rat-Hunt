import styled from 'styled-components';
import Color from '../../../../../global/css/utils/colors';
import CSS_Clickables from '../../../../../global/css/utils/clickables';

export const RoomIDBtnContainer = styled.div`
   ${CSS_Clickables.removeDefaultEffects};
   ${CSS_Clickables.desktop.changeBrightnessOnHover(0.5)};
   ${CSS_Clickables.portable.changeBrightnessOnClick(0.5, 'revert')};
   color: ${Color.darkThm.warning};
   cursor: pointer;
`;
