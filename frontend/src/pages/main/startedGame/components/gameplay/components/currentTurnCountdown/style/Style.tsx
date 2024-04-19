import styled from 'styled-components';
import CSS_Color from '../../../../../../../../global/css/utils/colors';

export const TimerBar = styled.div<{ timeRemainingSecs: number; timeGivenSecs: number }>`
   position: absolute;
   top: 0px;
   height: 100%;
   left: 0px;
   background-color: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 0.2)};
   border-top-left-radius: 1em;
   border-top-right-radius: 1em;
   transition: right 0.5s ease-in-out;
   z-index: -1;
   right: ${(props) => `${(props.timeRemainingSecs / props.timeGivenSecs) * 100}%`};
   box-sizing: border-box;
`;
