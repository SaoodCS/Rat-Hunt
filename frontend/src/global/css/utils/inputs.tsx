import CSS_Color from './colors';

export namespace CSS_Inputs {
   export const width = '100%';
   export const height = '3em';
   export const fontSize = '0.8em';
   export const margin = '0em 0em 1em 0em';
   export const borderRadius = '0.25em';
   export const padding = '0em 0em 0em 0.6em';
   export const transition = 'all 0.3s ease';
   export const rightIconBoxWidth = '12%';
   export const rightIconBoxMarginTopBottom = '0.6em';

   export const rightIconBoxBorder = (isDarkTheme: boolean): string => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      const opacity = 0.75;
      return `1px solid ${CSS_Color.setRgbOpacity(theme.accent, opacity)}`;
   };

   export const rightIconColor = (isDarkTheme: boolean): string => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      const opacity = 0.5;
      return CSS_Color.setRgbOpacity(theme.txt, opacity);
   };

   export const bgCol = (isDarkTheme: boolean): string => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      return CSS_Color.setRgbOpacity(theme.bg, 0.1);
   };
   export const valueCol = (isDarkTheme: boolean): string => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      return theme.txt;
   };
   export const placeholderCol = (isDarkTheme: boolean): string => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      const opacity = 0.5;
      return CSS_Color.setRgbOpacity(theme.txt, opacity);
   };

   export const disabledCol = (isDarkTheme: boolean): string => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      const opacity = 0.6;
      return CSS_Color.setRgbOpacity(theme.txt, opacity);
   };

   export const borderCol = (isDarkTheme: boolean, opacity: number = 0.5): string => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      return CSS_Color.setRgbOpacity(theme.accent, opacity);
   };

   export const focusedBorderCol = (isDarkTheme: boolean): string => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      const opacity = 1;
      return CSS_Color.setRgbOpacity(theme.accent, opacity);
   };

   export const errorBorderCol = (isDarkTheme: boolean): string => {
      const theme = isDarkTheme ? CSS_Color.darkThm : CSS_Color.lightThm;
      const opacity = 1;
      return CSS_Color.setRgbOpacity(theme.error, opacity);
   };

   export const border = (isDarkTheme: boolean): string => {
      return `2px solid ${borderCol(isDarkTheme)}`;
   };

   export const focusedBorder = (isDarkTheme: boolean): string => {
      return `2px solid ${focusedBorderCol(isDarkTheme)}`;
   };

   export const errorBorder = (isDarkTheme: boolean): string => {
      return `2px solid ${errorBorderCol(isDarkTheme)}`;
   };
}

export default CSS_Inputs;
