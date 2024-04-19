import styled from 'styled-components';
import CSS_Clickables from '../../../../global/css/utils/clickables';
import CSS_Color from '../../../../global/css/utils/colors';

export const WaitingRoomTitle = styled.div`
   font-size: 1.75em;
   color: ${CSS_Color.darkThm.accent};
   filter: brightness(1.3);
`;

export const PlayBtnContainer = styled.div<{ disablePlay?: boolean }>`
   ${CSS_Clickables.removeDefaultEffects};
   ${CSS_Clickables.desktop.changeBrightnessOnHover(0.8)};
   ${CSS_Clickables.portable.changeBrightnessOnClick(0.8, 'revert')}
   display: flex;
   position: absolute;
   color: ${CSS_Color.darkThm.warning};
   right: 0em;
   filter: ${({ disablePlay }) => (disablePlay ? 'brightness(0.5)' : 'brightness(1)')};
`;

export const RoomIdTopicItemContainer = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   padding: 0.5em;
   border-bottom: 1px solid ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accentDarkerShade, 1)};
   border-radius: 0.5em;
   flex: 1;
   filter: brightness(0.9);
   & > svg {
      color: ${CSS_Color.darkThm.success};
   }
`;

export const ItemLabel = styled.div`
   width: 6em;
   color: ${CSS_Color.darkThm.error};
`;

export const ItemValue = styled.div`
   color: ${CSS_Color.darkThm.success};
   padding-right: 0.4em;
`;

export const UserListItemContainer = styled.div<{ isThisUser?: boolean }>`
   display: flex;
   align-items: center;
   background-color: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accentDarkerShade, 0.6)};
   margin: 1.3em 0em 0em 0em;
   border-radius: 1em;
   border-top: 1px solid ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 0.25)};
   color: ${({ isThisUser }) =>
      isThisUser
         ? CSS_Color.setRgbOpacity(CSS_Color.darkThm.error, 0.9)
         : CSS_Color.setRgbOpacity(CSS_Color.darkThm.txt, 0.6)};
   & > svg {
      color: ${({ isThisUser }) =>
         isThisUser
            ? CSS_Color.setRgbOpacity(CSS_Color.darkThm.error, 0.5)
            : CSS_Color.setRgbOpacity(CSS_Color.darkThm.txt, 0.15)};
   }
`;
