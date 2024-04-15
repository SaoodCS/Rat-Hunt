import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';

export const Wrapper = styled.div<{
   padding?: string;
   overflow?: string;
   flex?: number;
   height?: string;
   width?: string;
   animations?: { types: MyCSS.Animations.Types; durationSecs: number };
}>`
   padding: ${({ padding }) => (padding ? padding : '0')};
   overflow: ${({ overflow }) => overflow};
   flex: ${({ flex }) => flex};
   height: ${({ height }) => height};
   width: ${({ width }) => width};
   ${({ animations }) =>
      animations ? MyCSS.Animations.multi(animations.types, animations.durationSecs) : null};
`;
