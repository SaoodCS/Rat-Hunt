import styled from 'styled-components';
import Color from '../../../../css/utils/colors';
import { CSS_Helper } from '../../../../css/utils/helper';
import CSS_Clickables from '../../../../css/utils/clickables';

interface ITextBtnAttrs {
   isDisabled?: boolean;
}

interface ITextBtn extends ITextBtnAttrs {
   isDarkTheme: boolean;
   position?: 'left' | 'center' | 'right';
   isDangerBtn?: boolean;
   isWarningBtn?: boolean;
}

export const TextBtn = styled.button.attrs<ITextBtnAttrs>(({ isDisabled }) => ({
   disabled: isDisabled,
}))<ITextBtn>`
   all: unset;
   ${CSS_Clickables.removeDefaultEffects};
   font-size: 0.95em;
   padding: 0.5em;
   border-radius: 10px;
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
   justify-content: ${({ position }) =>
      position === 'center' ? 'center' : position === 'right' ? 'end' : 'start'};
   display: flex;

   ${({ isDarkTheme, isDisabled }) => {
      if (isDisabled) return;
      const colorMobile = Color.setRgbOpacity(
         isDarkTheme ? Color.darkThm.accent : Color.lightThm.accent,
         0.5,
      );
      const colorDesktop = Color.setRgbOpacity(
         isDarkTheme ? Color.darkThm.txt : Color.lightThm.txt,
         0.1,
      );
      const mobile = CSS_Clickables.portable.changeColorOnClick(
         colorMobile,
         'background-color',
         'revert',
      );
      const desktop = CSS_Clickables.desktop.changeColorOnHover(colorDesktop, 'background-color');

      return CSS_Helper.concatStyles(mobile, desktop);
   }};
`;
