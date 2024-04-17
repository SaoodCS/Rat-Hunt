import styled from 'styled-components';
import { OpaqueOverlay } from '../overlay/opaqueOverlay/Style';

export const SplashScreenWrapper = styled(OpaqueOverlay)<{ durationSecs: number }>`
   animation: ${({ durationSecs }) => `fadeInThenOut ${durationSecs}s linear`};
   @keyframes fadeInThenOut {
      0% {
         opacity: 0;
      }
      10% {
         opacity: 1;
      }
      90% {
         opacity: 1;
      }
      100% {
         opacity: 0;
      }
   }
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
