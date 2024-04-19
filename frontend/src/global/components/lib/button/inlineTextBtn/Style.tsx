import styled from 'styled-components';
import Color from '../../../../css/utils/colors';
import CSS_Clickables from '../../../../css/utils/clickables';

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
         ? Color.setRgbOpacity(
              isDarkTheme ? Color.darkThm.error : Color.lightThm.error,
              isDisabled ? 0.5 : 1,
           )
         : isWarningBtn
           ? Color.setRgbOpacity(
                isDarkTheme ? Color.darkThm.warning : Color.lightThm.warning,
                isDisabled ? 0.5 : 1,
             )
           : Color.setRgbOpacity(
                isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
                isDisabled ? 0.5 : 1,
             )};
`;
