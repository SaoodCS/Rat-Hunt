import styled from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';

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
   ${MyCSS.Clickables.removeDefaultEffects};
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
      const mobile = MyCSS.Clickables.portable.changeColorOnClick(
         colorMobile,
         'background-color',
         'revert',
      );
      const desktop = MyCSS.Clickables.desktop.changeColorOnHover(colorDesktop, 'background-color');

      return MyCSS.Helper.concatStyles(mobile, desktop);
   }};
`;
