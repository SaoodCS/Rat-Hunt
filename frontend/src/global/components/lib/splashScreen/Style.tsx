import styled from 'styled-components';
import MyCSS from '../../../css/MyCSS';
import { Overlay } from '../overlay/Overlay';

export const SplashScreenWrapper = styled(Overlay)<{ durationSecs: number }>`
   ${({ durationSecs }) => MyCSS.Keyframes.fadeInAndOut(durationSecs)};
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
