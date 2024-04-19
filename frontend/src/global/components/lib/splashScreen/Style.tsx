import styled from 'styled-components';
import { CSS_ZIndex } from '../../../css/utils/zIndex';
import { Overlay } from '../overlay/Overlay';

export const SplashScreenWrapper = styled(Overlay)`
   z-index: ${CSS_ZIndex.get('splashScreen')};
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
