import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';

export const StyledForm = styled.form<{
   apiError?: string;
   padding?: number;
   fieldsMargin?: string;
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
   & > * {
      margin: ${({ fieldsMargin }) => fieldsMargin || '0em'};
   }
`;

export const ErrorLabel = styled.div<{ isDarkTheme: boolean }>`
   font-size: 0.75em;
   margin-top: 0.2em;
   color: ${({ isDarkTheme }) => (isDarkTheme ? Color.darkThm.error : Color.lightThm.error)};
`;
