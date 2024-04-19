import styled from 'styled-components';
import CSS_Clickables from '../../../../css/utils/clickables';
import CSS_Color from '../../../../css/utils/colors';
import { CSS_Helper } from '../../../../css/utils/helper';

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
   justify-content: ${({ position }) =>
      position === 'center' ? 'center' : position === 'right' ? 'end' : 'start'};
   display: flex;

   ${({ isDarkTheme, isDisabled }) => {
      if (isDisabled) return;
      const colorMobile = CSS_Color.setRgbOpacity(
         isDarkTheme ? CSS_Color.darkThm.accent : CSS_Color.lightThm.accent,
         0.5,
      );
      const colorDesktop = CSS_Color.setRgbOpacity(
         isDarkTheme ? CSS_Color.darkThm.txt : CSS_Color.lightThm.txt,
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
