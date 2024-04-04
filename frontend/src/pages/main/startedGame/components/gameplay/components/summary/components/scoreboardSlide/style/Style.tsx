import type { FlattenSimpleInterpolation } from 'styled-components';
import styled from 'styled-components';
import MyCSS from '../../../../../../../../../../global/css/MyCSS';

export const ScoreboardWrapper = styled.div<{ localStyles?: FlattenSimpleInterpolation }>`
   position: absolute;
   top: 0.5em;
   bottom: 0.5em;
   width: 100%;
   overflow: scroll;
   ${MyCSS.Scrollbar.hide};
   ${({ localStyles }) => localStyles};
`;
