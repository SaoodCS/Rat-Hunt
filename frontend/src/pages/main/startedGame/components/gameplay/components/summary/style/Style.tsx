import styled from 'styled-components';
import Color from '../../../../../../../../global/css/colors';
import { TextColourizer } from '../../../../../../../../global/components/lib/font/textColorizer/TextColourizer';
import MyCSS from '../../../../../../../../global/css/MyCSS';

export const RoundSummaryTitle = styled.div`
   height: 2.5em;
   box-sizing: border-box;
   display: flex;
   justify-content: center;
   align-items: center;
   border-bottom: 2px solid ${Color.darkThm.accentDarkerShade};
   color: ${Color.setRgbOpacity(Color.darkThm.dialogBright, 1)};
   filter: brightness(2);
`;

export const NextPlayAgainBtnContainer = styled.div`
   position: absolute;
   right: 0px;
   height: 2.5em;
   padding-right: 1em;
   display: flex;
   align-items: center;
   box-sizing: border-box;
   filter: brightness(0.8);
`;

export const NextRoundPlayAgainBtn = styled(TextColourizer)`
   ${MyCSS.Clickables.removeDefaultEffects};
   color: ${Color.darkThm.warning};
   padding: 0em 1em 0.2em 1em;
   font-size: 0.9em;
   border-bottom: 1px solid ${Color.darkThm.accent};
   border-bottom-left-radius: 1em;
   border-bottom-right-radius: 1em;
   cursor: pointer;
   ${MyCSS.Clickables.desktop.changeBrightnessOnHover(0.8)};
   ${MyCSS.Clickables.portable.changeBrightnessOnClick(0.8, 'persist')};
`;

export const SummaryTableWrapper = styled.div`
   position: absolute;
   top: 5.5em;
   bottom: 0px;
   left: 0px;
   right: 0px;
   box-sizing: border-box;
`;

export const MarqueeContainer = styled.div`
   height: 3em;
   border-bottom: 2px solid ${Color.setRgbOpacity(Color.darkThm.accent, 0.65)};
   display: flex;
   justify-content: center;
   align-items: center;
   filter: brightness(1);
   background-color: ${Color.setRgbOpacity(Color.darkThm.bg, 1)};
   z-index: 999;
`;
