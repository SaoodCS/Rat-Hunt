import styled from 'styled-components';
import CSS_Color from '../../../../css/utils/colors';
import { CSS_Helper } from '../../../../css/utils/helper';
import CSS_Inputs from '../../../../css/utils/inputs';

export interface IInputWrapperStyles {
   width?: string;
   fontSize?: string;
   height?: string;
   margin?: string;
   backgroundColor?: string;
   borderRadius?: string;
   boxSizing?: 'content-box' | 'border-box';
}

export interface IFormBtnStyles {
   margin?: string;
   padding?: string;
}

export interface IStyledFormProps {
   apiError?: string;
   padding?: number;
   margin?: string;
   inputWrapperStyles?: IInputWrapperStyles;
   btnStyles?: IFormBtnStyles;
}

export const InputWrapper = styled.div`
   position: relative;
`;

export const StyledForm = styled.form<IStyledFormProps>`
   box-sizing: border-box;
   padding: ${({ padding }) => (padding ? `${padding}em` : '0em')};
   border-radius: 0.7em;
   display: flex;
   flex-direction: column;
   width: 100%;
   margin: ${({ margin }) => margin || '0'};
   border-radius: 0.7em;
   height: fit-content;
   ${({ apiError }) =>
      apiError && {
         '&::before': {
            content: `'${apiError}'`,
            color: CSS_Color.darkThm.error,
            fontSize: '0.75em',
            position: 'absolute',
            top: 0,
            paddingTop: '0.25em',
            width: '90%',
         },
      }}
   ${InputWrapper} {
      ${({ inputWrapperStyles }) => {
         const { width, fontSize, height, margin, backgroundColor, boxSizing, borderRadius } =
            inputWrapperStyles || {};
         return CSS_Helper.convertInlineToStyledComp({
            width: width || CSS_Inputs.width,
            height: height || CSS_Inputs.height,
            fontSize: fontSize || CSS_Inputs.fontSize,
            margin: margin || CSS_Inputs.margin,
            backgroundColor: backgroundColor || 'transparent',
            boxSizing: boxSizing || 'border-box',
            borderRadius: borderRadius || CSS_Inputs.borderRadius,
         });
      }}
   }
   button {
      ${({ btnStyles }) => {
         const { margin, padding } = btnStyles || {};
         return CSS_Helper.convertInlineToStyledComp({
            margin: margin || undefined,
            padding: padding || undefined,
         });
      }}
   }
`;

export const ErrorLabel = styled.div<{ isDarkTheme: boolean }>`
   font-size: 0.75em;
   margin-top: 0.2em;
   color: ${({ isDarkTheme }) =>
      isDarkTheme ? CSS_Color.darkThm.error : CSS_Color.lightThm.error};
`;
