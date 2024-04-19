import styled from 'styled-components';
import CSS_Clickables from '../../../../css/utils/clickables';
import CSS_Color from '../../../../css/utils/colors';

export const InlineTxtBtn = styled.span<{
   isDarkTheme: boolean;
   isDisabled?: boolean;
   isDangerBtn?: boolean;
   isWarningBtn?: boolean;
}>`
   all: unset;
   ${CSS_Clickables.removeDefaultEffects};
   cursor: pointer;
   color: ${({ isDarkTheme, isDisabled, isDangerBtn, isWarningBtn }) =>
      isDangerBtn
         ? CSS_Color.setRgbOpacity(
              isDarkTheme ? CSS_Color.darkThm.error : CSS_Color.lightThm.error,
              isDisabled ? 0.5 : 1,
           )
         : isWarningBtn
           ? CSS_Color.setRgbOpacity(
                isDarkTheme ? CSS_Color.darkThm.warning : CSS_Color.lightThm.warning,
                isDisabled ? 0.5 : 1,
             )
           : CSS_Color.setRgbOpacity(
                isDarkTheme ? CSS_Color.darkThm.accent : CSS_Color.lightThm.accent,
                isDisabled ? 0.5 : 1,
             )};
`;
