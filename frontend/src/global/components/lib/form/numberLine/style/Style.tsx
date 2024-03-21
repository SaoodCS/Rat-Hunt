import type { CSSProperties } from 'react';
import styled, { css } from 'styled-components';
import MyCSS from '../../../../../css/MyCSS';
import Color from '../../../../../css/colors';
import { InputLabel } from '../../textOrNumber/Style';

export const NumberLineInputLabel = styled(InputLabel)<{ inputHasValue?: boolean }>`
   padding-top: 5px;
   transform: ${({ inputHasValue }) => (inputHasValue ? 'translateY(-11px)' : 'translateY(-5px)')};
`;

export const InputSliderWrapper = styled.div<{ inputHasValue: boolean }>`
   width: 100%;
   padding-left: 0.5em;
   padding-right: 0.5em;
   box-sizing: border-box;
   ${MyCSS.Clickables.removeDefaultEffects};
`;

export const numberLineStyles: CSSProperties = {
   borderRadius: 0,
   position: 'relative',
   width: '100%',
   borderRight: `2px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.3)}`,
   borderLeft: `2px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.3)}`,
};

export const numberLabelStyles = (
   isLabelCurrentVal: boolean,
   minValue: number,
   maxValue: number,
   label: number,
   displayAllNumbers: boolean,
): CSSProperties => {
   const isLabelMinOrMax = label === minValue || label === maxValue;
   return {
      color: Color.setRgbOpacity(Color.darkThm.txt, isLabelCurrentVal ? 1 : 0.3),
      paddingTop: isLabelCurrentVal ? '4px' : '0.1em',
      fontSize: isLabelCurrentVal ? '1.1em' : '1em',
      opacity: isLabelCurrentVal || isLabelMinOrMax || displayAllNumbers ? 1 : 0,
      transition: 'padding 0.2s ease, font-size, color 0.2s ease',
   };
};

export const activeLineStyles: CSSProperties = {
   borderRadius: '0em',
   height: '1px',
   overflow: 'hidden',
   background: `linear-gradient(to right, ${Color.setRgbOpacity(Color.darkThm.txt, 0)} 0%,  ${Color.darkThm.txt} 100%)`,
   borderBottom: `1px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0)}`,
   borderTop: `1px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0)}`,
   marginTop: '4.5px',
};

export const inactiveLineStyles = (hasError: boolean): CSSProperties => {
   const color = hasError ? Color.darkThm.error : Color.darkThm.txt;
   const opacity = hasError ? 1 : 0.3;
   return {
      backgroundColor: Color.setRgbOpacity(color, opacity),
      height: '0.1em',
   };
};

export const activeDotStyles = (hasValue: boolean): CSSProperties => {
   return {
      backgroundColor: Color.darkThm.txt,
      border: `2px solid ${Color.darkThm.txt}`,
      width: hasValue ? '1.35em' : '1.1em',
      height: hasValue ? '1.35em' : '1.1em',
      marginTop: hasValue ? '-0.6em' : '-0.4em',
      boxShadow: `0px 0px 0px 0px ${Color.darkThm.txt}`,
      transition: 'width 0.2s ease, height 0.2s ease, margin-top 0.2s ease',
      opacity: 1,
   };
};

export const dotTouchAreaStyles = (min: number, max: number): CSSProperties => {
   return {
      boxSizing: 'border-box',
      marginBottom: '-40px',
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderCollapse: 'separate',
      width: `calc(100% / ${max - min})`,
      height: '70px',
      borderRadius: '0',
      zIndex: 1,
   };
};

export const LabelIndicatorLine = styled.div<{ minValue: number; maxValue: number }>`
   border-right: 1px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.3)};
   border-left: 1px solid ${Color.setRgbOpacity(Color.darkThm.txt, 0.3)};
   width: ${({ minValue, maxValue }) => `calc((100% / (${maxValue} - ${minValue})))`};
   height: 100%;
   box-sizing: border-box;
`;

export const LabelIndicatorLineWrapper = styled.div<{ currentValue: number | '' }>`
   position: relative;
   width: 99.7%;
   height: 8px;
   transform: translateY(-100%);
   display: flex;
   box-sizing: content-box;
   & > div:last-child {
      border-right: none;
   }
   & > div:first-child {
      border-left: none;
   }
   ${({ currentValue }) => {
      if (currentValue === '') return '';
      const oneLess = currentValue - 1;
      return css`
         & > div:nth-child(${oneLess}) {
            border-right: none;
         }
         & > div:nth-child(${currentValue}) {
            border-left: none;
         }
      `;
   }}
`;
