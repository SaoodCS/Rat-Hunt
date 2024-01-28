import styled from 'styled-components';
import MyCSS from '../../../css/MyCSS';
import Color from '../../../css/colors';

export const CardHolder = styled.div`
   width: 25em;
   height: 25em;
   position: relative;
   max-width: 100%;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;

   @media (min-width: 450px) {
      width: 28em;
      height: 28em;
   }

   @media (min-width: 500px) {
      width: 30em;
      height: 30em;
   }

   @media (min-width: 520px) {
      width: 32em;
      height: 32em;
   }

   @media (min-width: 550px) {
      width: 34em;
      height: 34em;
   }

   @media (min-width: 600px) {
      width: 37em;
      height: 37em;
   }

   @media (min-width: 700px) {
      width: 42em;
      height: 42em;
   }

   @media (min-width: 953px) {
      width: 25em;
      height: 25em;
   }

   @media (min-width: 1030px) {
      width: 27em;
      height: 27em;
   }

   @media (min-width: 1100px) {
      width: 28em;
      height: 28em;
   }

   @media (min-width: ${MyCSS.PortableBp.asNum + 300}px) {
      width: 30em;
      height: 30em;
   }

   @media (min-width: 1250px) {
      width: 32em;
      height: 32em;
   }

   @media (min-width: 1330px) {
      width: 35em;
      height: 35em;
   }

   @media (min-width: 1500px) {
      width: 38em;
      height: 38em;
   }

   @media (min-width: 1650px) {
      width: 29em;
      height: 29em;
   }
   @media (min-width: 1800px) {
      width: 31em;
      height: 31em;
   }

   @media (min-width: 1900px) {
      width: 33em;
      height: 33em;
   }

   @media (min-width: 1986px) {
      width: 35em;
      height: 35em;
   }
`;

export const CardHolderRow = styled.div`
   display: flex;
   height: 50%;
   width: 100%;
   position: relative;
`;

export const SmallCardSquareHolder = styled.div`
   width: 50%;
   height: 100%;
   position: relative;
`;

export const ExtraSmallCardSquareHolder = styled.div`
   width: 100%;
   height: 50%;
   position: relative;
`;

export const CardContentWrapper = styled.div<{
   isDarkTheme: boolean;
   height?: string;
   minHeight?: string;
}>`
   position: absolute;
   top: 0.5em;
   bottom: 0.5em;
   left: 0.5em;
   right: 0.5em;
   border-radius: 10px;
   overflow: hidden;
   background-color: ${({ isDarkTheme }) =>
      Color.setRgbOpacity(isDarkTheme ? Color.lightThm.bg : Color.darkThm.bg, 0.05)};
   font-size: 0.9em;
   height: ${({ height }) => height || 'auto'};
   min-height: ${({ minHeight }) => minHeight};
`;
