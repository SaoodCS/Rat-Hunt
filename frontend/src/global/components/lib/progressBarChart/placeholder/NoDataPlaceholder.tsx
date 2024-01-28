import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';

export const BarChartNoDataPlaceholder = styled.div<{ horizontal?: boolean }>`
   width: 16em;
   height: 100%;
   background-size: cover;
   background-position: center center;
   background-repeat: repeat;
   background-image: url('data:image/svg+xml;utf8,%3Csvg height=%22auto%22 viewBox=%220 0 2000 1500%22 xmlns=%22http:%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath d=%22M0 1500h160M200 1600h160v-85.013q0-44-44-44h-72q-44 0-44 44ZM400 1700h160v-168.487q0-44-44-44h-72q-44 0-44 44ZM600 1500h160v-241.867q0-44-44-44h-72q-44 0-44 44ZM800 1500h160v-427.071q0-44-44-44h-72q-44 0-44 44ZM1000 1500h160v-424.136q0-44-44-44h-72q-44 0-44 44ZM1200 1500h160V737.763q0-44-44-44h-72q-44 0-44 44ZM1400 1500h160V708.849q0-44-44-44h-72q-44 0-44 44ZM1600 1500h160V528.893q0-44-44-44h-72q-44 0-44 44ZM1800 1500h160V239.674q0-44-44-44h-72q-44 0-44 44Z%22 fill=%22rgba(178%2C 178%2C 178%2C 0.1)%22%2F%3E%3C%2Fsvg%3E');
   rotate: ${({ horizontal }) => (horizontal ? '90deg' : '0deg')};
   // stretch the component across the x axis:
   transform: scale(1.25, 3);
   margin-top: -2.3em;
   margin-left: 13em;

   @media (max-width: ${MyCSS.PortableBp.asPx}) {
      width: 16em;
      transform: scale(1.25, 3);
      margin-left: -1.5em;
      margin-top: -7em;
   }
`;
