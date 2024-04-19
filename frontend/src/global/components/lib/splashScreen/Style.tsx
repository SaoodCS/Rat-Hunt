import styled from 'styled-components';
import { CSS_ZIndex } from '../../../css/utils/zIndex';
import { Overlay } from '../overlay/Overlay';
import { CSS_Keyframes } from '../../../css/utils/keyframes';

export const SplashScreenWrapper = styled(Overlay)<{ durationSecs: number }>`
   z-index: ${CSS_ZIndex.get('splashScreen')};
   ${({ durationSecs }) => CSS_Keyframes.fadeInAndOut(durationSecs)};
`;

export const SplashScreenFooter = styled.div`
   position: fixed;
   bottom: 0px;
   width: 100dvw;
   display: flex;
   justify-content: center;
   padding-bottom: 2em;
   font-style: italic;
   letter-spacing: 0.055rem;
   font-family: 'Arial';
   font-weight: 500;
`;
