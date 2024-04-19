import styled from 'styled-components';
import CSS_Clickables from '../../../../../global/css/utils/clickables';
import CSS_Color from '../../../../../global/css/utils/colors';

export const RoomIDBtnContainer = styled.div`
   ${CSS_Clickables.removeDefaultEffects};
   ${CSS_Clickables.desktop.changeBrightnessOnHover(0.5)};
   ${CSS_Clickables.portable.changeBrightnessOnClick(0.5, 'revert')};
   color: ${CSS_Color.darkThm.warning};
   cursor: pointer;
`;
