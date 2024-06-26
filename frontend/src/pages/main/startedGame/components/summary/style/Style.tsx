import styled from 'styled-components';
import { TextColourizer } from '../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import CSS_Clickables from '../../../../../../global/css/utils/clickables';
import CSS_Color from '../../../../../../global/css/utils/colors';

export const TITLE_HEIGHT = 2.5;
export const MARQUEE_HEIGHT = 3;
export const SCOREBOARD_CONTAINER_HEIGHT = MARQUEE_HEIGHT * 2 + TITLE_HEIGHT;

export const RoundSummaryTitle = styled.div`
   height: ${TITLE_HEIGHT}em;
   box-sizing: border-box;
   display: flex;
   justify-content: center;
   align-items: center;
   border-bottom: 2px solid ${CSS_Color.darkThm.accentDarkerShade};
   color: ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.dialogBright, 1)};
   filter: brightness(2);
   border-top-left-radius: 1em;
   border-top-right-radius: 1em;
   letter-spacing: 0.1em;
`;

export const NextPlayAgainBtnContainer = styled.div`
   position: absolute;
   right: 0px;
   height: ${TITLE_HEIGHT}em;
   padding-right: 1em;
   display: flex;
   align-items: center;
   box-sizing: border-box;
   filter: brightness(0.8);
`;

export const NextRoundPlayAgainBtn = styled(TextColourizer)`
   ${CSS_Clickables.removeDefaultEffects};
   color: ${CSS_Color.darkThm.warning};
   padding: 0em 1em 0.2em 1em;
   font-size: 0.9em;
   border-bottom: 1px solid ${CSS_Color.darkThm.accent};
   border-bottom-left-radius: 1em;
   border-bottom-right-radius: 1em;
   cursor: pointer;
   ${CSS_Clickables.desktop.changeBrightnessOnHover(0.8)};
   ${CSS_Clickables.portable.changeBrightnessOnClick(0.8, 'persist')};
`;

export const ScoreboardContainer = styled.div`
   position: absolute;
   top: ${SCOREBOARD_CONTAINER_HEIGHT}em;
   bottom: 0px;
   left: 0px;
   right: 0px;
   box-sizing: border-box;
   display: flex;
   justify-content: center;
`;

export const MarqueeContainer = styled.div`
   height: ${MARQUEE_HEIGHT}em;
   border-bottom: 2px solid ${CSS_Color.setRgbOpacity(CSS_Color.darkThm.accent, 0.65)};
   display: flex;
   justify-content: center;
   align-items: center;
   filter: brightness(1);
   z-index: 2;
   box-sizing: border-box;
`;

export const PointsMsgsWrapper = styled(MarqueeContainer)`
   overflow: hidden;
   width: 100%;
`;
