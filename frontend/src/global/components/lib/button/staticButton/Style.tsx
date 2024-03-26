import styled, { css } from 'styled-components';
import MyCSS from '../../../../css/MyCSS';
import Color from '../../../../css/colors';

interface IStaticButtonAttrs {
   isDisabled?: boolean;
}

interface IStaticButton extends IStaticButtonAttrs {
   isDarkTheme: boolean;
   width?: string;
   isDangerBtn?: boolean;
   isWarningBtn?: boolean;
}

export const StaticButton = styled.button.attrs<IStaticButtonAttrs>(({ isDisabled }) => ({
   disabled: isDisabled,
}))<IStaticButton>`
   all: unset;
   ${MyCSS.Clickables.removeDefaultEffects};
   padding-top: 0.6em;
   padding-bottom: 0.6em;
   letter-spacing: 0.1em;
   text-align: center;
   border-radius: 0.5em;
   ${({ isDarkTheme, isDisabled, isDangerBtn, isWarningBtn }) => {
      const theme = isDarkTheme ? Color.darkThm : Color.lightThm;
      const textColor = theme.txt;
      const textOpacity = 0.8;
      const textShadowCol = theme.bg;
      const textShadowOpacity = 0.3;
      const backgroundOpacity = isDisabled ? 0.5 : 1;
      const bgColor = isDangerBtn ? theme.error : isWarningBtn ? theme.warning : theme.accent;
      return css`
         color: ${Color.setRgbOpacity(textColor, textOpacity)};
         background-color: ${Color.setRgbOpacity(bgColor, backgroundOpacity)};
         text-shadow: 0.1em 0.1em 0 ${Color.setRgbOpacity(textShadowCol, textShadowOpacity)};
         ${MyCSS.Clickables.desktop.changeBrightnessOnHover(0.8)};
         ${MyCSS.Clickables.portable.changeBrightnessOnClick(0.8, 'revert')};
      `;
   }}
   font-size: 0.95em;
   width: ${({ width }) => width || 'auto'};
   transition: background-color 0.3s ease-out;
   backdrop-filter: blur(30px);
`;
