import type { FlattenSimpleInterpolation } from 'styled-components';
import styled from 'styled-components';
import { CSS_Scrollbar } from '../../../../../../../../global/css/utils/scrollbar';

export const ScoreboardWrapper = styled.div<{ localStyles?: FlattenSimpleInterpolation }>`
   position: absolute;
   top: 1em;
   bottom: 0.5em;
   width: 100%;
   overflow: scroll;
   ${CSS_Scrollbar.hide};
   ${({ localStyles }) => localStyles};
`;
