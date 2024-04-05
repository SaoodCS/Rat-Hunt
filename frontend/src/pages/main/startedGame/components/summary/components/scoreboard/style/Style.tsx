import type { FlattenSimpleInterpolation } from 'styled-components';
import styled from 'styled-components';
import MyCSS from '../../../../../../../../global/css/MyCSS';
import Color from '../../../../../../../../global/css/colors';

export const ScoreboardWrapper = styled.div<{ localStyles?: FlattenSimpleInterpolation }>`
   position: absolute;
   top: 0;
   bottom: 0.5em;
   width: 100%;
   overflow: scroll;
   ${MyCSS.Scrollbar.hide};
   ${({ localStyles }) => localStyles};
   border-left: 1px solid ${Color.setRgbOpacity(Color.darkThm.accent, 0.5)};
   border-right: 1px solid ${Color.setRgbOpacity(Color.darkThm.accent, 0.5)};
   padding-top: 1em;
`;
