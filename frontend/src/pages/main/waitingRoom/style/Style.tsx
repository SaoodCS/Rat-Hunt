import styled from 'styled-components';
import MyCSS from '../../../../global/css/MyCSS';
import Color from '../../../../global/css/colors';

export const WaitingRoomTitle = styled.div`
   font-size: 1.75em;
   color: ${Color.darkThm.accent};
   filter: brightness(1.3);
`;

export const PlayBtnContainer = styled.div<{ disablePlay?: boolean }>`
   ${MyCSS.Clickables.removeDefaultEffects};
   ${MyCSS.Clickables.desktop.changeBrightnessOnHover(0.8)};
   ${MyCSS.Clickables.portable.changeBrightnessOnClick(0.8, 'revert')}
   display: flex;
   position: absolute;
   color: ${Color.darkThm.warning};
   right: 0em;
   filter: ${({ disablePlay }) => (disablePlay ? 'brightness(0.5)' : 'brightness(1)')};
`;

export const RoomIdTopicItemContainer = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   padding: 0.5em;
   border-bottom: 1px solid ${Color.setRgbOpacity(Color.darkThm.accentDarkerShade, 1)};
   border-radius: 0.5em;
   flex: 1;
   filter: brightness(0.9);
   & > svg {
      color: ${Color.darkThm.success};
   }
`;

export const ItemLabel = styled.div`
   width: 6em;
   color: ${Color.darkThm.error};
`;

export const ItemValue = styled.div`
   color: ${Color.darkThm.success};
   padding-right: 0.4em;
`;

export const UserListItemContainer = styled.div<{ isThisUser?: boolean }>`
   display: flex;
   align-items: center;
   background-color: ${Color.setRgbOpacity(Color.darkThm.accentDarkerShade, 0.6)};
   margin: 1.3em 0em 0em 0em;
   border-radius: 1em;
   border-top: 1px solid ${Color.setRgbOpacity(Color.darkThm.accent, 0.25)};
   color: ${({ isThisUser }) =>
      isThisUser
         ? Color.setRgbOpacity(Color.darkThm.error, 0.9)
         : Color.setRgbOpacity(Color.darkThm.txt, 0.6)};
   & > svg {
      color: ${({ isThisUser }) =>
         isThisUser
            ? Color.setRgbOpacity(Color.darkThm.error, 0.5)
            : Color.setRgbOpacity(Color.darkThm.txt, 0.15)};
   }
`;
