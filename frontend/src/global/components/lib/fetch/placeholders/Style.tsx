import type { Keyframes } from 'styled-components';
import styled, { keyframes } from 'styled-components';
import Color from '../../../../css/colors';

// Define a keyframe animation for the placeholderLine
const pulse = (isDarkTheme: boolean): Keyframes => keyframes`
  0% {
    background-color: ${isDarkTheme ? Color.darkThm.border : Color.lightThm.border};
  }
  50% {
    background-color: ${
       isDarkTheme
          ? Color.setRgbOpacity(Color.darkThm.txt, 0.3)
          : Color.setRgbOpacity(Color.lightThm.txt, 0.3)
    };
  }
  100% {
    background-color: ${isDarkTheme ? Color.darkThm.border : Color.lightThm.border};
  }
`;

export const PlaceholderLine = styled.div<{
   width?: string;
   height?: string;
   margin?: string;
   borderRadius?: string;
   isDarkTheme: boolean;
}>`
   width: ${({ width }) => width || '100%'};
   height: ${({ height }) => height || '16px'};
   border-radius: ${({ borderRadius }) => borderRadius || '4px'};
   margin: ${({ margin }) => margin || '8px 0'};
   animation: ${({ isDarkTheme }) => pulse(isDarkTheme)} 1.5s infinite ease-in-out;
`;

export const PlaceholderCircle = styled.div<{
   size: string;
   isDarkTheme: boolean;
}>`
   animation: ${({ isDarkTheme }) => pulse(isDarkTheme)} 1.5s infinite ease-in-out;
   width: ${({ size }) => size};
   height: ${({ size }) => size};
   border-radius: 50%;
`;

export const PlaceholderRect = styled.div<{
   width: string;
   height: string;
   borderRadius?: string;
   isDarkTheme: boolean;
}>`
   animation: ${({ isDarkTheme }) => pulse(isDarkTheme)} 1.5s infinite ease-in-out;
   width: ${({ width }) => width};
   height: ${({ height }) => height};
   border-radius: ${({ borderRadius }) => borderRadius || 0};
`;
