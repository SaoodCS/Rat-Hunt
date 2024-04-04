import styled from 'styled-components';
import MyCSS from '../../../../../global/css/MyCSS';
import Color from '../../../../../global/css/colors';

export const RoomIDBtnContainer = styled.div`
   ${MyCSS.Clickables.removeDefaultEffects};
   ${MyCSS.Clickables.desktop.changeBrightnessOnHover(0.5)};
   ${MyCSS.Clickables.portable.changeBrightnessOnClick(0.5, 'revert')};
   color: ${Color.darkThm.warning};
   cursor: pointer;
`;
