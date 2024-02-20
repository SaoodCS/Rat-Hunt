export default class Color {
   static lightThm = {
      bg: 'rgb(2,8,23)',
      accent: 'rgb(108, 50, 209)',
      accentAlt: 'rgb(151, 209, 50)',
      border: 'rgba(255, 255, 255, 0.1)',
      txt: 'rgb(255, 255, 255)',
      txtOnAccent: 'rgba(2,8,23, 0.9)',
      error: 'rgb(233, 65, 35)',
      success: 'rgb(36, 227, 87)',
      warning: 'rgb(255, 193, 7)',
      txtShadow: '1px 1px 1px rgba(255, 255, 255, 0.1)',
      txtShadowHeaders: '1px 1px 1px rgba(255, 255, 255, 0.3)',
      boxShadow: '0px 0px 10px rgba(10,10,10, 1)',
      inactive: 'rgb(32, 42, 58)',
      dialog: 'rgb(9, 9, 11)',
   };

   static darkThm = {
      bg: 'rgb(2,8,23)',
      accent: 'rgb(108, 50, 209)',
      accentDarkerShade: 'rgb(39, 18, 76)',
      accentAlt: 'rgb(151, 209, 50)',
      border: 'rgba(255, 255, 255, 0.1)',
      txt: 'rgb(255, 255, 255)',
      txtOnAccent: 'rgba(2,8,23, 0.9)',
      error: 'rgb(233, 65, 35)',
      success: 'rgb(36, 227, 87)',
      warning: 'rgb(255, 193, 7)',
      txtShadow: '1px 1px 1px rgba(255, 255, 255, 0.1)',
      txtShadowHeaders: '1px 1px 1px rgba(255, 255, 255, 0.3)',
      boxShadow: '0px 0px 10px rgba(10,10,10, 1)',
      inactive: 'rgb(32, 42, 58)',
      dialog: 'rgb(9, 9, 11)',
   };

   static setRgbOpacity = (color: string, opacity: number): string => {
      const rgb = color.split(')')[0].split('(')[1];
      return `rgba(${rgb}, ${opacity})`;
   };

   static setHexOpacity = (color: string, opacity: number): string => {
      const hex = color.split('#')[1];
      return `#${hex}${opacity.toString(16)}`;
   };
}
