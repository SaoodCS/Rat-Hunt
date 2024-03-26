import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';

export interface IGlobalFieldStyles {
   width?: string;
   fontSize?: string;
   height?: string;
   margin?: string;
   backgroundColor?: string;
   borderRadius?: string;
   boxSizing?: 'content-box' | 'border-box';
}

export const InputWrapper = styled.div`
   position: relative;
`;

export const StyledForm = styled.form<{
   apiError?: string;
   padding?: number;
   globalFieldStyles?: IGlobalFieldStyles;
}>`
   ${({ padding }) => MyCSS.LayoutStyle.paddingBorderBox(padding ? `${padding}em` : '0em')};
   border-radius: 0.7em;
   display: flex;
   flex-direction: column;
   width: 100%;
   margin-top: 1em;
   border-radius: 0.7em;
   height: fit-content;
   ${({ apiError }) =>
      apiError && {
         '&::before': {
            content: `'${apiError}'`,
            color: Color.darkThm.error,
            fontSize: '0.75em',
            position: 'absolute',
            top: 0,
            paddingTop: '0.25em',
            width: '90%',
         },
      }}
   ${InputWrapper} {
      ${({ globalFieldStyles }) => {
         const { width, fontSize, height, margin, backgroundColor, boxSizing, borderRadius } =
            globalFieldStyles || {};
         return MyCSS.Helper.convertInlineToStyledComp({
            width: width || '100%',
            fontSize: fontSize || '0.8em',
            height: height || '3em',
            margin: margin || 0,
            backgroundColor: backgroundColor || 'transparent',
            boxSizing: boxSizing || 'border-box',
            borderRadius: borderRadius || '0.25em',
         });
      }}
   }
`;

export const ErrorLabel = styled.div<{ isDarkTheme: boolean }>`
   font-size: 0.75em;
   margin-top: 0.2em;
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.error : Color.lightThm.error)};
`;
